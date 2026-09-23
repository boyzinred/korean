/*
  drill-questions.js
  ----------------------------------------------------------------------------
  The question generator behind the click-only Korean drill on the two reading
  comprehension pages and the TOPIK I word bank.

  This file writes questions. It does not draw them. There is no markup and no
  stylesheet here, because the three pages that use it do not look alike: a
  reading page renders a choice with .choice and .choice-letter, the word bank
  renders it with .choice alone, and each keeps its own exercise card, its own
  buttons, and its own feedback blocks. A question comes out of here as data
  and each page renders it the way it renders everything else.

  Eleven kinds of question, each of which the page can switch off:

    concept   개념·형태   the idea behind a word rather than the word itself:
                          its class, its group, the two words it is built from,
                          the syllable it shares with another, its opposite, the
                          sentence that uses a grammar point.
    guess     뜻 짐작하기 two or three sentences that all want the same word,
                          with the word taken out of every one of them.
    blank     빈칸 채우기 one or two words cut out of a real sentence.
    confuse   닮은 말     보다 · 보이다 · 보여 주다, and which of them the
                          sentence in front of you is asking for.
    fix       틀린 곳     a sentence with something wrong in it: find the wrong
                          one, find the right one, find the wrong word in it,
                          and put that word right.
    place     자리·어순   where a word belongs: which particle a noun takes, the
                          noun a particle is written onto, and what a sentence
                          looks like once a word is moved out of its place.
    polite    말투·높임   how high a sentence speaks, which sentences speak at
                          the same height, and the words that raise one.
    order     문장 순서   three or four sentences put back in order.
    chunk     조각 순서   one sentence cut into pieces and put back together.
    excerpt   짧은 글     two or three lines and a question about them.
    next      다음 문장   the sentence that comes next.

  Nothing is hand-written. Every question is generated from the page's own
  material, so the pool grows with the bank and no two runs are the same. The
  wrong answers are not invented either: a distractor is always a real surface
  form taken from somewhere else in the same corpus, matched on part of speech
  and, wherever it can be, on the ending — so the wrong answers read as Korean
  and the right one cannot be spotted by its shape.

  Using it
  --------
    const drill = DrillQuestions.create({
      units:    [{ id, label, titleKo, lines: [{ ko }] }],
      words:    [{ id, ko, pos, posKo, topicId, topicKo, unitIds, forms }],
      grammar:  [{ id, form, label, unitIds, examples: [{ ko }] }] or null,
      antonyms: [[ko, ko], …],
      confusables: [{ words: [ko, ko, ko], ko: "what separates them" }, …],
      extras:   [{ ko, unitIds }] more sentences for blanks and chunks,
      mineSurfaces: true when the bank stores dictionary forms only
    });

    drill.pool({ units: Set, types: Set, grammar: Set, weights })  -> every question
    drill.draw({ … }, 20)                                          -> a balanced run

  weights is optional: a unit id → 0-100 map saying how much of a run each of
  the ticked units is to fill. Without it the units share a run evenly, which
  is what every caller did before the mix sliders existed.

  A question
  ----------
    { id, type, tag, units, passage, prompt, sentence, mode, choices, answer,
      answerText, tiles, solution, join, hint, hintId, why }

    mode "mc"     choices / answer / answerText
    mode "order"  tiles (shuffled) / solution / join
    sentence      null, or [{ text }, { blank: "①" }, { br: true }, …]
    passage       null, or the lines to show above the question
    units         the unit ids the question was built out of, which is what the
                  mix sliders weigh
    hint / hintId the English behind the answer, and the id of the word it
                  belongs to. The generator never decides whether a hint is
                  shown — the page does, off its own familiarity stars.
*/
(function (global) {
  "use strict";

  /* =======================================================================
     Korean odds and ends
  ======================================================================= */

  /* Particles agree with the last letter of the word in front of them, so the
     generated prompts work it out instead of writing 은/는 everywhere.

     finalIndex is the same sum kept as a number rather than a yes or no: 0 when
     the syllable has no final consonant, 8 when that consonant is ㄹ, 17 when it
     is ㅂ. The placement and politeness questions need all three — ㄹ is the
     letter (으)로 bends around, and ㅂ is what tells 갑니다 from 아니다. */
  function finalIndex(text) {
    const clean = String(text || "").replace(/[^가-힣]/g, "");
    if (!clean) return -1;
    return (clean.charCodeAt(clean.length - 1) - 0xAC00) % 28;
  }
  function hasFinal(text) {
    return finalIndex(text) > 0;
  }
  /* A syllable taken apart, for the questions that have to look at the vowel
     rather than the letter: 가 and 해 end an -아/-어 ending, 세 and 예 do not,
     and nothing but the vowel separates them. */
  function syllable(letter) {
    const code = String(letter || "").charCodeAt(0) - 0xAC00;
    if (!(code >= 0 && code <= 11171)) return null;
    return { vowel: Math.floor((code % 588) / 28), final: code % 28 };
  }
  const INFINITIVE_VOWELS = new Set([0, 1, 4, 5, 6, 9, 10, 14, 15]);
  /* Syllables that pass the vowel test above and still are not an -아/-어
     ending: 이에요 and 예요 are the copula, -(으)세요 is honorific, and none of
     the three loses its 요 by having the 요 taken off. */
  const NOT_INFINITIVE = new Set(["에", "예", "세", "셔"]);
  const eun = text => (hasFinal(text) ? "은" : "는");
  const iga = text => (hasFinal(text) ? "이" : "가");
  const eul = text => (hasFinal(text) ? "을" : "를");
  const ida = text => (hasFinal(text) ? "이에요" : "예요");
  const wa = text => (hasFinal(text) ? "과" : "와");

  function shuffle(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = out[i];
      out[i] = out[j];
      out[j] = swap;
    }
    return out;
  }
  function take(list, count) { return shuffle(list).slice(0, count); }
  function pickOne(list) { return list && list.length ? list[Math.floor(Math.random() * list.length)] : null; }
  function unique(list) { return [...new Set(list)]; }

  function eojeols(sentence) {
    return String(sentence || "").trim().split(/\s+/).filter(Boolean);
  }
  const PUNCT = /[.,!?…"'“”‘’]/g;
  const bare = text => String(text || "").replace(PUNCT, "").trim();

  /* A passage is stored a paragraph at a time on one page and a sentence at a
     time on another. Everything here wants sentences, so a paragraph is split
     on its sentence ends — but a line of speech runs over those ends, and
     "저기 봐! 어미 새야." is one utterance, so a piece that opens a quote and
     never closes it keeps the piece after it. */
  const SENTENCE_END = /(?<=[.!?…]["”’']?)\s+/;
  const QUOTE_MARKS = /["“”]/g;
  function splitSentences(text) {
    const parts = String(text || "").split(SENTENCE_END).map(part => part.trim()).filter(Boolean);
    const out = [];
    let held = "";
    parts.forEach(part => {
      held = held ? held + " " + part : part;
      if ((held.match(QUOTE_MARKS) || []).length % 2 === 0) { out.push(held); held = ""; }
    });
    if (held) out.push(held);
    return out;
  }

  const TYPES = [
    { id: "concept", ko: "개념·형태", en: "Concept and word building",
      note: "What a word is, which group it belongs to, what it is built from." },
    { id: "guess", ko: "뜻 짐작하기", en: "Context, then the word",
      note: "Two or three sentences that all want the same word, and the word gone from every one." },
    { id: "blank", ko: "빈칸 채우기", en: "Fill in the blank",
      note: "One or two words cut out of a real sentence." },
    { id: "confuse", ko: "닮은 말", en: "Choose between similar words",
      note: "보다 · 보이다 · 보여 주다 — which one this sentence is asking for." },
    { id: "fix", ko: "틀린 곳", en: "Error correction",
      note: "A sentence with something wrong in it: spot it, then put it right." },
    { id: "place", ko: "자리·어순", en: "Where the word goes",
      note: "Which particle a noun takes, and where a word sits in the sentence." },
    { id: "polite", ko: "말투·높임", en: "Politeness and speech level",
      note: "How high a sentence speaks, and the words that raise it." },
    { id: "order", ko: "문장 순서", en: "Sentence ordering",
      note: "Whole sentences put back in the order they were written." },
    { id: "chunk", ko: "조각 순서", en: "Sentence chunk ordering",
      note: "One sentence cut into pieces and put back together." },
    { id: "excerpt", ko: "짧은 글", en: "Short excerpt",
      note: "Two or three lines, then a question about them." },
    { id: "next", ko: "다음 문장", en: "The next sentence",
      note: "What the writer says next." }
  ];
  const TYPE_BY_ID = new Map(TYPES.map(type => [type.id, type]));

  /* No generator may flood the pool: each stops at this many questions, having
     shuffled its source first, so every run draws a different slice of a bank
     that may hold several thousand. */
  const PER_KIND_CAP = 400;

  /* =======================================================================
     The three rules the placement questions lean on
     -----------------------------------------------------------------------
     Korean word order is loose enough that moving a word around a sentence is
     usually not an error, so a question built on "move this and see" would have
     more than one answer. Three things a sentence genuinely cannot do:

       a particle is written onto the back of its noun, never in front of it
       and never with a space between;
       a 관형사 sits directly before the word it describes;
       the predicate closes the sentence.

     Nothing else is asked about, and the particle a noun takes is decided by
     its last letter rather than by taste, so it can be asked about too.
  ======================================================================= */
  const PARTICLE_FAMILIES = [
    { withFinal: "은", without: "는" },
    { withFinal: "이", without: "가" },
    { withFinal: "을", without: "를" },
    { withFinal: "과", without: "와" },
    /* (으)로 is the odd one: a ㄹ 받침 takes the short form, like 서울로. */
    { withFinal: "으로", without: "로", liquid: true }
  ];
  function particleFor(noun, family) {
    const last = finalIndex(noun);
    if (family.liquid && last === 8) return family.without;
    return last > 0 ? family.withFinal : family.without;
  }
  function otherParticle(noun, family) {
    return particleFor(noun, family) === family.withFinal ? family.without : family.withFinal;
  }

  /* Everything that may be found sitting in front of a particle. */
  const PARTICLES = new Set([
    "은", "는", "이", "가", "을", "를", "의", "도", "만", "에", "에서", "에게",
    "에게서", "한테", "한테서", "께", "께서", "와", "과", "랑", "이랑", "하고",
    "부터", "까지", "로", "으로", "보다", "처럼", "같이", "마다", "밖에"
  ]);
  const NOUNISH = new Set(["noun", "proper noun", "noun phrase", "dependent noun",
    "pronoun", "number", "numeral", "counter", "name"]);
  const PREDICATE_POS = new Set(["verb", "adjective", "auxiliary verb"]);

  /* =======================================================================
     Speech levels
     -----------------------------------------------------------------------
     Four heights, named the way a Korean classroom names them and glossed in
     Korean, because this exercise never shows English. A sentence is only
     given a height when its last word says so plainly; anything the reader of
     this file would have to think about is left unclassified rather than
     guessed at, since a question about a sentence nobody can place is worse
     than a question that never gets asked.
  ======================================================================= */
  const LEVELS = [
    { id: "hamnida", name: "합니다체", ko: "합니다체 — 아주 높임",
      cue: "'-습니다', '-ㅂ니다'로 끝나면 합니다체예요." },
    { id: "haeyo", name: "해요체", ko: "해요체 — 두루높임",
      cue: "'요'로 끝나면 해요체예요." },
    { id: "banmal", name: "반말", ko: "반말 — 낮춤",
      cue: "'요'를 붙이지 않으면 반말이에요." },
    { id: "haera", name: "해라체", ko: "해라체 — 글말",
      cue: "'-다', '-ㄴ다'로 끝나면 해라체예요. 글에서 많이 써요." }
  ];
  const TAIL_PUNCT = /[\s.,!?…"'“”‘’]+$/;
  const BANMAL_TAIL = /(야|니|자|지|네|군|까|래|걸|게)$/;

  /* The last word of a sentence, with its full stop off, since that is the word
     every politeness question is really about. */
  function lastWord(text) {
    const tokens = eojeols(String(text || "").replace(TAIL_PUNCT, ""));
    return tokens.length ? tokens[tokens.length - 1] : "";
  }
  /* 로 after a vowel or a ㄹ, 으로 after everything else. */
  const ro = text => ([0, 8].indexOf(finalIndex(text)) >= 0 ? "로" : "으로");

  /* The handful of words Korean swaps rather than bends when it speaks upward.
     This is the one table in the file that is not read off the page — nothing
     in a word bank says 진지 is 밥 spoken higher — but a pair is only ever
     asked about when the plain half is a word the page itself teaches. */
  const HONORIFICS = [
    { plain: "밥", high: "진지", kind: "noun" },
    { plain: "나이", high: "연세", kind: "noun" },
    { plain: "이름", high: "성함", kind: "noun" },
    { plain: "집", high: "댁", kind: "noun" },
    { plain: "사람", high: "분", kind: "noun" },
    { plain: "말", high: "말씀", kind: "noun" },
    { plain: "생일", high: "생신", kind: "noun" },
    { plain: "먹다", high: "드시다", kind: "verb" },
    { plain: "자다", high: "주무시다", kind: "verb" },
    { plain: "있다", high: "계시다", kind: "verb" },
    { plain: "주다", high: "드리다", kind: "verb" },
    { plain: "말하다", high: "말씀하시다", kind: "verb" },
    { plain: "묻다", high: "여쭈다", kind: "verb" },
    { plain: "보다", high: "뵙다", kind: "verb" },
    { plain: "죽다", high: "돌아가시다", kind: "verb" }
  ];

  /* =======================================================================
     Question constructors
     The answer is shuffled into place here, so nothing about the order of the
     choices can leak it to the page or to the reader.
  ======================================================================= */
  let sequence = 0;
  function multipleChoice(spec) {
    const choices = unique(spec.choices.map(choice => String(choice)));
    const shuffled = shuffle(choices);
    const answer = shuffled.indexOf(String(spec.answer));
    return {
      id: "q" + (sequence += 1),
      mode: "mc",
      type: spec.type,
      tag: spec.tag,
      units: unique(spec.units || []),
      hint: spec.hint || "",
      hintId: spec.hintId || "",
      passage: spec.passage || null,
      prompt: spec.prompt,
      sentence: spec.sentence || null,
      choices: shuffled,
      answer,
      answerText: String(spec.answer),
      why: spec.why || "",
      valid: choices.length >= 3 && answer >= 0
    };
  }
  function ordering(spec) {
    const solution = spec.solution.map(piece => String(piece));
    let tiles = shuffle(solution);
    /* A puzzle that comes out already solved is not a puzzle. */
    for (let attempt = 0; attempt < 8 && tiles.join("") === solution.join(""); attempt += 1) {
      tiles = shuffle(solution);
    }
    return {
      id: "q" + (sequence += 1),
      mode: "order",
      type: spec.type,
      tag: spec.tag,
      units: unique(spec.units || []),
      hint: "",
      hintId: "",
      passage: null,
      prompt: spec.prompt,
      sentence: null,
      tiles,
      solution,
      join: spec.join || " ",
      why: spec.why || "",
      valid: solution.length >= 3
    };
  }

  /* =======================================================================
     The corpus — every sentence the drill may cut up, and a scanner that says
     which bank word each piece of a sentence is.
  ======================================================================= */
  function buildCorpus(config) {
    const words = config.words || [];

    /* surface -> word, longest first when they collide, so 대학생 is never read
       as 학생 and 좋아해요 never as 하다. */
    const surfaceMap = new Map();
    function remember(surface, word) {
      const clean = bare(surface);
      if (!clean) return;
      if (!surfaceMap.has(clean)) surfaceMap.set(clean, word);
    }
    words.forEach(word => {
      const forms = word.forms && word.forms.length ? word.forms : [word.ko];
      forms.forEach(form => remember(form, word));
    });

    /* A dictionary form ending in 다 never appears as itself in a sentence, so
       the stem is what a surface has to begin with. */
    const stems = new Map();
    words.forEach(word => {
      const ko = String(word.ko || "");
      const stem = /다$/.test(ko) && ko.length > 1 ? ko.slice(0, -1) : ko;
      if (!stem) return;
      const held = stems.get(stem);
      if (!held || String(held.ko).length < ko.length) stems.set(stem, word);
    });

    const sentences = [];
    function addSentence(text, unitIds) {
      splitSentences(text).forEach(ko => sentences.push({ ko, unitIds: unitIds || [] }));
    }
    (config.units || []).forEach(unit => {
      (unit.lines || []).forEach(line => addSentence(line.ko, [unit.id]));
    });
    (config.extras || []).forEach(extra => addSentence(extra.ko, extra.unitIds || []));
    (config.grammar || []).forEach(point => {
      (point.examples || []).forEach(example => addSentence(example.ko, point.unitIds || []));
    });

    /* Mining: a bank that stores only dictionary forms has its surfaces read
       back off the sentences. Each eojeol is matched against the longest stem
       it begins with, which files 먹었어요 and 먹고 under 먹다. */
    if (config.mineSurfaces) {
      sentences.forEach(entry => {
        eojeols(entry.ko).forEach(token => {
          const clean = bare(token);
          if (!clean) return;
          for (let length = clean.length; length >= 1; length -= 1) {
            const word = stems.get(clean.slice(0, length));
            if (word) { remember(clean, word); break; }
          }
        });
      });
    }

    /* Surfaces indexed by the word they belong to, and by part of speech and
       ending, so a distractor can be drawn that ends the way the surface it
       stands in for ends. */
    const surfacesByWord = new Map();
    const byPos = new Map();
    const byPosEnding = new Map();
    surfaceMap.forEach((word, surface) => {
      if (!surfacesByWord.has(word.id)) surfacesByWord.set(word.id, []);
      surfacesByWord.get(word.id).push(surface);
      const pos = word.pos || "";
      if (!byPos.has(pos)) byPos.set(pos, []);
      byPos.get(pos).push({ surface, word });
      const key = pos + "|" + surface.slice(-2);
      if (!byPosEnding.has(key)) byPosEnding.set(key, []);
      byPosEnding.get(key).push({ surface, word });
    });

    const longestFirst = [...surfaceMap.keys()].sort((a, b) => b.length - a.length);

    /* Which bank words a sentence uses, and where. A hit has to start an
       eojeol, which keeps 이 out of 이름 while letting 학교 out of 학교에서. */
    function scan(sentence) {
      const text = String(sentence || "");
      const hits = [];
      const taken = new Array(text.length).fill(false);
      const starts = new Set([0]);
      for (let i = 0; i < text.length; i += 1) if (/\s/.test(text[i])) starts.add(i + 1);

      longestFirst.forEach(surface => {
        let from = 0;
        while (from <= text.length - surface.length) {
          const at = text.indexOf(surface, from);
          if (at < 0) break;
          const end = at + surface.length;
          let free = starts.has(at);
          for (let i = at; free && i < end; i += 1) if (taken[i]) free = false;
          if (free) {
            for (let i = at; i < end; i += 1) taken[i] = true;
            hits.push({ start: at, end, surface, word: surfaceMap.get(surface) });
          }
          from = at + 1;
        }
      });
      return hits.sort((a, b) => a.start - b.start);
    }

    /* A wrong answer that still reads as Korean: same part of speech and, where
       one exists, the same ending, so 학교에서 is answered against 시장에서
       rather than against a bare noun.

       `strict` keeps only the ending matches. The excerpt questions use it,
       because a wrong answer there is a whole sentence that has to read as
       Korean before it can be rejected on its meaning — loosen the ending and
       비 가져요 날도 예뻐요 ends up on the screen. */
    function distractorsFor(surface, word, count, strict) {
      const pos = (word && word.pos) || "";
      const ownSurfaces = new Set(surfacesByWord.get(word && word.id) || []);
      const pools = strict
        ? [byPosEnding.get(pos + "|" + surface.slice(-2)) || []]
        : [byPosEnding.get(pos + "|" + surface.slice(-2)) || [], byPos.get(pos) || []];

      const found = [];
      const seen = new Set([surface]);
      pools.forEach(pool => {
        if (found.length >= count) return;
        shuffle(pool).forEach(candidate => {
          if (found.length >= count) return;
          if (seen.has(candidate.surface) || ownSurfaces.has(candidate.surface)) return;
          if (candidate.word && word && candidate.word.id === word.id) return;
          seen.add(candidate.surface);
          found.push(candidate.surface);
        });
      });
      return found;
    }

    /* The bank word an eojeol is a form of, found by the longest stem it begins
       with, so 먹었어 comes back as 먹다. It misses the forms that change the
       stem itself — 간다 never begins with 가 — which is why the politeness
       questions treat a word it cannot place as a word they will not ask about
       rather than guessing at one. */
    function rootOf(token) {
      const clean = bare(token);
      for (let length = clean.length; length >= 1; length -= 1) {
        const word = stems.get(clean.slice(0, length));
        if (word) return word;
      }
      return null;
    }

    /* Dictionary forms only. Not surfaceMap, which on a mining page holds
       학교에서 as a form of 학교 and would call every noun-and-particle in the
       corpus a word of its own. */
    const dictionary = new Set(words.map(word => String(word.ko || "")).filter(Boolean));
    const isWord = text => dictionary.has(String(text || ""));
    const wordFor = surface => surfaceMap.get(bare(surface)) || null;

    return { words, sentences, scan, distractorsFor, rootOf, isWord, wordFor };
  }

  /* =======================================================================
     create()
  ======================================================================= */
  function create(incoming) {
    /* Units are normalised to one sentence per line before anything reads
       them, so a page may hand over paragraphs or sentences as it pleases. */
    const config = Object.assign({}, incoming, {
      units: (incoming.units || []).map(unit => Object.assign({}, unit, {
        lines: (unit.lines || []).flatMap(line => splitSentences(line.ko).map(ko => ({ ko })))
      }))
    });
    const corpus = buildCorpus(config);

    const inSelection = (ids, allowed) => !ids || !ids.length || ids.some(id => allowed.has(id));

    /* -------------------------------------------------------------- concept */
    function conceptQuestions(state) {
      const out = [];
      const words = corpus.words.filter(word => inSelection(word.unitIds, state.units));
      if (!words.length) return out;

      const byPos = new Map();
      const byTopic = new Map();
      words.forEach(word => {
        if (word.posKo) {
          if (!byPos.has(word.posKo)) byPos.set(word.posKo, []);
          byPos.get(word.posKo).push(word);
        }
        if (word.topicKo) {
          if (!byTopic.has(word.topicKo)) byTopic.set(word.topicKo, []);
          byTopic.get(word.topicKo).push(word);
        }
      });
      const posNames = [...byPos.keys()];
      const topicNames = [...byTopic.keys()];

      /* 1 — which class of word is this? */
      if (posNames.length >= 4) {
        take(words.filter(word => word.posKo), PER_KIND_CAP).forEach(word => {
          const others = take(posNames.filter(name => name !== word.posKo), 3);
          if (others.length < 3) return;
          out.push(multipleChoice({
            type: "concept", tag: "품사", units: word.unitIds,
            prompt: "'" + word.ko + "'" + eun(word.ko) + " 무슨 품사예요?",
            choices: [word.posKo].concat(others),
            answer: word.posKo,
            why: "'" + word.ko + "'" + eun(word.ko) + " " + word.posKo + ida(word.posKo) + "."
          }));
        });
      }

      /* 2 — which group does it sit in? */
      if (topicNames.length >= 4) {
        take(words.filter(word => word.topicKo), PER_KIND_CAP).forEach(word => {
          const others = take(topicNames.filter(name => name !== word.topicKo), 3);
          if (others.length < 3) return;
          out.push(multipleChoice({
            type: "concept", tag: "갈래", units: word.unitIds,
            prompt: "'" + word.ko + "'" + eun(word.ko) + " 어느 갈래에 속해요?",
            choices: [word.topicKo].concat(others),
            answer: word.topicKo,
            why: "'" + word.ko + "'" + eun(word.ko) + " '" + word.topicKo + "' 갈래의 말이에요."
          }));
        });
      }

      /* 3 — the one that does not belong, by group and then by class */
      function oddOne(groups, tag, noun) {
        const names = [...groups.keys()].filter(name => (groups.get(name) || []).length >= 3);
        if (names.length < 2) return;
        take(names, Math.min(names.length, 150)).forEach(name => {
          for (let round = 0; round < 3; round += 1) {
            const inside = take(groups.get(name), 3);
            const otherName = pickOne(names.filter(other => other !== name));
            const outsider = pickOne(groups.get(otherName) || []);
            if (inside.length < 3 || !outsider) return;
            out.push(multipleChoice({
              type: "concept", tag,
              units: inside.flatMap(word => word.unitIds || []).concat(outsider.unitIds || []),
              prompt: "다음 중 '" + name + "'에 속하지 않는 말은 무엇이에요?",
              choices: inside.map(word => word.ko).concat([outsider.ko]),
              answer: outsider.ko,
              why: "'" + outsider.ko + "'" + eun(outsider.ko) + " '" + otherName + "' " + noun
                + "이고, 나머지는 '" + name + "'" + ida(name) + "."
            }));
          }
        });
      }
      oddOne(byTopic, "갈래 아닌 것", "갈래의 말");
      oddOne(byPos, "품사 아닌 것", "품사");

      /* 4 — which two words is it built from?
         Nouns only, on both sides and in the middle, and one half has to sit in
         the same group as the whole. Without those rules the search turns up
         다시 = 다 + 시 and 공원 = 공 + 원, which are words that happen to spell
         another word rather than words another is built from. */
      const koIndex = new Map();
      corpus.words.forEach(word => {
        if (word.ko && !koIndex.has(word.ko)) koIndex.set(word.ko, word);
      });
      /* Narrower than the NOUNISH set above: a pronoun or a counter spelling
         out half of a compound is a coincidence, not a word it is built from. */
      const COMPOUNDABLE = new Set(["noun", "proper noun", "noun phrase", "dependent noun"]);
      const compounds = [];
      words.forEach(word => {
        const ko = String(word.ko || "");
        if (ko.length < 2 || !COMPOUNDABLE.has(word.pos) || !/^[가-힣]+$/.test(ko)) return;
        for (let cut = 1; cut < ko.length; cut += 1) {
          const left = koIndex.get(ko.slice(0, cut));
          const right = koIndex.get(ko.slice(cut));
          if (left && right && left.ko !== ko && right.ko !== ko
            && COMPOUNDABLE.has(left.pos) && COMPOUNDABLE.has(right.pos)
            && (left.topicId === word.topicId || right.topicId === word.topicId)) {
            compounds.push({ word, left, right });
            break;
          }
        }
      });
      /* The wrong decompositions are built rather than borrowed from other
         compounds: a bank may hold only two or three, and a question that can
         only be asked once a fourth exists is a question never asked. */
      const shortWords = words.filter(word => /^[가-힣]{1,3}$/.test(String(word.ko || "")));
      const spare = () => { const word = pickOne(shortWords); return word ? word.ko : null; };
      take(compounds, PER_KIND_CAP).forEach(item => {
        const right = item.left.ko + " + " + item.right.ko;
        const wrong = unique([
          [item.left.ko, spare()],
          [spare(), item.right.ko],
          [spare(), spare()],
          [item.right.ko, item.left.ko]
        ].filter(pair => pair[0] && pair[1]).map(pair => pair[0] + " + " + pair[1]))
          .filter(text => text !== right).slice(0, 3);
        if (wrong.length < 3) return;
        out.push(multipleChoice({
          type: "concept", tag: "낱말 만들기", units: item.word.unitIds,
          prompt: "'" + item.word.ko + "'" + eun(item.word.ko) + " 어떤 두 말이 합쳐진 말이에요?",
          choices: [right].concat(wrong),
          answer: right,
          why: "'" + item.word.ko + "' = '" + item.left.ko + "' + '" + item.right.ko + "'"
        }));
      });

      /* 5 — the noun under a 하다 verb */
      const hadas = [];
      words.forEach(word => {
        const ko = String(word.ko || "");
        if (!/하다$/.test(ko) || ko.length < 3) return;
        const stem = ko.slice(0, -2);
        if (koIndex.has(stem)) hadas.push({ word, stem });
      });
      const nouns = words.filter(word => word.pos === "noun" && /^[가-힣]{1,4}$/.test(String(word.ko || "")));
      take(hadas, PER_KIND_CAP).forEach(item => {
        const right = item.stem + eul(item.stem) + " 해요";
        const wrong = unique(take(nouns.filter(noun => noun.ko !== item.stem), 8)
          .map(noun => noun.ko + eul(noun.ko) + " 해요")).filter(text => text !== right).slice(0, 3);
        if (wrong.length < 3) return;
        out.push(multipleChoice({
          type: "concept", tag: "낱말 만들기", units: item.word.unitIds,
          prompt: "'" + item.word.ko + "'" + eun(item.word.ko) + " 무엇을 하는 거예요?",
          choices: [right].concat(wrong),
          answer: right,
          why: "'" + item.word.ko + "'" + eun(item.word.ko) + " '" + item.stem + "'에 '하다'가 붙은 말이에요."
        }));
      });

      /* 6 — the syllable two words share. Most of the bank is Sino-Korean,
         built a morpheme at a time, and 학교 beside 학생 is the cheapest way to
         see it — provided the pair shares exactly one syllable, or the wrong
         answers would be right as well. */
      const syllablesOf = word => unique(String(word.ko || "").split(""));
      const bySyllable = new Map();
      words.forEach(word => {
        const ko = String(word.ko || "");
        if (!/^[가-힣]{2,4}$/.test(ko) || /다$/.test(ko)) return;
        syllablesOf(word).forEach(syllable => {
          if (!bySyllable.has(syllable)) bySyllable.set(syllable, []);
          bySyllable.get(syllable).push(word);
        });
      });
      [...bySyllable.entries()].filter(entry => entry[1].length >= 2).forEach(entry => {
        const syllable = entry[0];
        for (let round = 0; round < 2; round += 1) {
          const pair = take(entry[1], 2);
          if (pair.length < 2) return;
          const first = syllablesOf(pair[0]);
          const second = syllablesOf(pair[1]);
          if (first.filter(letter => second.indexOf(letter) >= 0).length !== 1) continue;
          const wrong = take(unique(first.concat(second)).filter(letter => letter !== syllable), 3);
          if (wrong.length < 3) continue;
          out.push(multipleChoice({
            type: "concept", tag: "같은 글자",
            units: (pair[0].unitIds || []).concat(pair[1].unitIds || []),
            prompt: "'" + pair[0].ko + "'" + wa(pair[0].ko) + " '" + pair[1].ko
              + "'에 똑같이 들어 있는 글자는 무엇이에요?",
            choices: [syllable].concat(wrong),
            answer: syllable,
            why: "'" + pair[0].ko + "', '" + pair[1].ko + "' — 두 말에 모두 '"
              + syllable + "'" + iga(syllable) + " 있어요."
          }));
        }
      });

      /* 7 — opposites, from the list the page supplies */
      const wordsByKo = new Map(words.map(word => [word.ko, word]));
      (config.antonyms || [])
        .filter(pair => wordsByKo.has(pair[0]) && wordsByKo.has(pair[1]))
        .forEach(pair => {
          [[pair[0], pair[1]], [pair[1], pair[0]]].forEach(ends => {
            const from = ends[0];
            const to = ends[1];
            const source = wordsByKo.get(from);
            const wrong = unique(take(words.filter(word =>
              word.pos === source.pos && word.ko !== from && word.ko !== to), 6)
              .map(word => word.ko)).slice(0, 3);
            if (wrong.length < 3) return;
            out.push(multipleChoice({
              type: "concept", tag: "반대말", units: source.unitIds,
              prompt: "'" + from + "'의 반대말은 무엇이에요?",
              choices: [to].concat(wrong),
              answer: to,
              why: "'" + from + "' ↔ '" + to + "'"
            }));
          });
        });

      /* 8 — which sentence uses this grammar point? */
      const points = selectedGrammar(state);
      if (points.length >= 4) {
        take(points, PER_KIND_CAP).forEach(point => {
          const mine = (point.examples || []).filter(example => example.ko);
          if (!mine.length) return;
          const right = pickOne(mine).ko;
          const others = [];
          take(points.filter(other => other.id !== point.id), 6).forEach(other => {
            const example = pickOne(other.examples || []);
            if (example && example.ko && example.ko !== right) others.push(example.ko);
          });
          const wrong = unique(others).slice(0, 3);
          if (wrong.length < 3) return;
          out.push(multipleChoice({
            type: "concept", tag: "문법", units: point.unitIds,
            prompt: "'" + point.form + "'" + eul(point.form) + " 쓴 문장을 고르세요.",
            choices: [right].concat(wrong),
            answer: right,
            why: "'" + right + "'에 '" + point.form + "'" + iga(point.form) + " 있어요."
          }));
        });
      }

      return out;
    }

    function selectedGrammar(state) {
      return (config.grammar || []).filter(point =>
        state.grammar.has(point.id) && inSelection(point.unitIds, state.units));
    }

    /* ---------------------------------------------------------------- guess */
    /* Context first, the word after it. A definition would be the obvious way
       to write this question, and there is no Korean definition anywhere in
       the three banks to write it from — what they carry is English, and
       English is the one thing this exercise never shows. So the idea is
       described the way a reader meets it in the first place: two or three
       real sentences that all want the same word, with the word taken out of
       every one of them. One context can be filled by guessing at the shape of
       the answer. Three cannot — only the word that means the right thing fits
       all of them at once. */
    function guessQuestions(state) {
      const out = [];
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));

      /* Every surface the pool shows, and the sentences it turns up in. A
         surface twice in one sentence is one home rather than two, or a
         question built on "different sentences" shows the same line twice. */
      const homes = new Map();
      take(pool, PER_KIND_CAP * 3).forEach(entry => {
        const seen = new Set();
        corpus.scan(entry.ko).forEach(hit => {
          if (!hit.word || seen.has(hit.surface)) return;
          seen.add(hit.surface);
          if (!homes.has(hit.surface)) homes.set(hit.surface, []);
          homes.get(hit.surface).push({ entry, hit });
        });
      });

      homes.forEach((places, surface) => {
        if (places.length < 2) return;
        const word = places[0].hit.word;
        if (!word || !inSelection(word.unitIds, state.units)) return;
        [2, 3].forEach(size => {
          if (places.length < size) return;
          const shown = take(places, size);
          const lines = shown.map(place => place.entry.ko);
          if (unique(lines).length !== size) return;
          /* Two lines where one is written inside the other are one context
             shown twice: 제 이야기를 잘 들어요 beside 콩이는 제 이야기를 잘
             들어요 asks nothing the shorter one did not ask on its own. */
          if (lines.some(line => lines.some(other => other !== line && other.indexOf(line) >= 0))) return;
          const wrong = corpus.distractorsFor(surface, word, 3);
          if (wrong.length < 3) return;
          /* Each line is the sentence with its hole in it, and the lines are
             kept apart by a break the page draws, so all of the contexts are
             read at once rather than one at a time. */
          const sentence = [];
          shown.forEach((place, index) => {
            if (index) sentence.push({ br: true });
            sentence.push({ text: place.entry.ko.slice(0, place.hit.start) });
            sentence.push({ blank: "" });
            sentence.push({ text: place.entry.ko.slice(place.hit.end) });
          });
          out.push(multipleChoice({
            type: "guess", tag: size === 2 ? "두 문장 공통" : "세 문장 공통",
            units: shown.flatMap(place => place.entry.unitIds || []),
            prompt: (size === 2 ? "두" : "세") + " 문장에 똑같이 들어갈 말은 무엇이에요?",
            sentence,
            choices: [surface].concat(wrong),
            answer: surface,
            hint: word.en,
            hintId: word.id,
            why: shown.map(place => place.entry.ko).join(" ")
          }));
        });
      });

      return take(out, PER_KIND_CAP);
    }

    /* ---------------------------------------------------------------- blank */
    function blankQuestions(state) {
      const out = [];
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));

      take(pool, PER_KIND_CAP).forEach(entry => {
        const hits = corpus.scan(entry.ko).filter(hit => hit.word);
        if (!hits.length) return;

        const hit = pickOne(hits);
        const wrong = corpus.distractorsFor(hit.surface, hit.word, 3);
        if (wrong.length === 3) {
          out.push(multipleChoice({
            type: "blank", tag: "빈칸", units: entry.unitIds,
            prompt: "빈칸에 알맞은 말을 고르세요.",
            hint: hit.word.en, hintId: hit.word.id,
            sentence: [
              { text: entry.ko.slice(0, hit.start) },
              { blank: "" },
              { text: entry.ko.slice(hit.end) }
            ],
            choices: [hit.surface].concat(wrong),
            answer: hit.surface,
            why: "'" + entry.ko + "'"
          }));
        }

        /* Two blanks where the sentence has room for them. */
        if (hits.length < 2) return;
        const two = take(hits, 2).sort((a, b) => a.start - b.start);
        if (two[0].end > two[1].start) return;
        const first = two[0];
        const second = two[1];
        const rightPair = first.surface + "  /  " + second.surface;
        const firstWrong = corpus.distractorsFor(first.surface, first.word, 3);
        const secondWrong = corpus.distractorsFor(second.surface, second.word, 3);
        if (firstWrong.length < 3 || secondWrong.length < 3) return;
        const wrongPairs = unique([
          firstWrong[0] + "  /  " + second.surface,
          first.surface + "  /  " + secondWrong[0],
          firstWrong[1] + "  /  " + secondWrong[1]
        ]).filter(text => text !== rightPair).slice(0, 3);
        if (wrongPairs.length < 3) return;
        out.push(multipleChoice({
          type: "blank", tag: "빈칸 둘", units: entry.unitIds,
          prompt: "①과 ②에 알맞은 말을 차례대로 고르세요.",
          sentence: [
            { text: entry.ko.slice(0, first.start) },
            { blank: "①" },
            { text: entry.ko.slice(first.end, second.start) },
            { blank: "②" },
            { text: entry.ko.slice(second.end) }
          ],
          choices: [rightPair].concat(wrongPairs),
          answer: rightPair,
          why: "'" + entry.ko + "'"
        }));
      });

      /* Grammar blanks: the form itself cut out of one of its own examples.
         A form is written "은 / 는", "-아요 / -어요", "안 · -지 않아요" — split on
         all three separators and take the hyphen off each end, but leave the
         spaces inside alone, because "(으)ㄴ 것 같다" is how the bank writes it
         and how the choice has to read. A form with a space rarely appears in a
         sentence literally, which is the point: it drops out rather than
         producing a blank nobody can fill. */
      const points = selectedGrammar(state);
      if (points.length < 4) return out;
      const formsOf = point => String(point.form || "")
        .split(/[\/,·]/)
        .map(part => part.trim().replace(/^-+/, "").replace(/-+$/, "").trim())
        .filter(Boolean);

      take(points, PER_KIND_CAP).forEach(point => {
        const mine = formsOf(point);
        const elsewhere = unique(points.filter(other => other.id !== point.id).flatMap(formsOf))
          .filter(form => mine.indexOf(form) < 0);
        if (elsewhere.length < 3) return;
        (point.examples || []).forEach(example => {
          const text = String(example.ko || "");
          const used = mine.filter(form => text.indexOf(form) >= 0).sort((a, b) => b.length - a.length);
          if (!used.length) return;
          const form = used[0];
          const at = text.lastIndexOf(form);
          const wrong = take(elsewhere, 3);
          if (wrong.length < 3) return;
          out.push(multipleChoice({
            type: "blank", tag: "문법 빈칸", units: point.unitIds,
            prompt: "빈칸에 알맞은 말을 고르세요.",
            sentence: [
              { text: text.slice(0, at) },
              { blank: "" },
              { text: text.slice(at + form.length) }
            ],
            choices: [form].concat(wrong),
            answer: form,
            why: "'" + text + "'"
          }));
        });
      });

      return out;
    }

    /* ---------------------------------------------------------------- place */
    /* Every eojeol in a sentence that is one of the page's nouns with a
       particle written onto its back, and where in the sentence that sits.

       This reads the eojeols rather than the scanner, because on a mining page
       the scanner has already learnt 학교에서 as a form of 학교 and hands back
       the whole eojeol, leaving no particle behind it to find. An eojeol taken
       apart from the right gives the same answer either way. */
    const PARTICLES_LONGEST = [...PARTICLES].sort((a, b) => b.length - a.length);
    const TRAILING = /[.,!?…"'“”‘’]+$/;
    function particleHits(text) {
      const found = [];
      const tokens = eojeols(text);
      let from = 0;
      tokens.forEach((token, index) => {
        const start = text.indexOf(token, from);
        from = start + token.length;
        /* The last eojeol closes the sentence, so what looks like a particle on
           the end of it is the end of a verb: 나와 is 나오다, not 나 with 와
           behind it. Nothing is lost by leaving that one alone. */
        if (index === tokens.length - 1) return;
        const whole = token.replace(TRAILING, "");
        if (!/^[가-힣]+$/.test(whole)) return;
        /* 물가 is not 물 with a particle on it. A compound the bank knows in
           its own right is left alone here; one the bank does not know is a
           hole this cannot see, and a rare one. */
        if (corpus.isWord(whole)) return;
        const particle = PARTICLES_LONGEST.find(item =>
          whole.length > item.length && whole.slice(-item.length) === item);
        if (!particle) return;
        const noun = whole.slice(0, -particle.length);
        const word = corpus.wordFor(noun);
        if (!word || !NOUNISH.has(word.pos) || bare(noun) !== noun) return;
        found.push({ noun, word, particle, start, end: start + whole.length });
      });
      return found;
    }

    function placeQuestions(state) {
      const out = [];
      const words = corpus.words.filter(word => inSelection(word.unitIds, state.units));
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));
      const quoted = text => /["“”‘’']/.test(text);

      /* 1 — the particle a noun takes, which its last letter decides and
         nothing else does. The wrong answers are the same noun wearing the
         forms that belong to a word ending the other way. */
      const nouns = words.filter(word => NOUNISH.has(word.pos)
        && /^[가-힣]{1,4}$/.test(String(word.ko || "")));
      take(nouns, PER_KIND_CAP).forEach(word => {
        const noun = String(word.ko);
        const family = pickOne(PARTICLE_FAMILIES);
        const particle = particleFor(noun, family);
        const right = noun + particle;
        const wrong = unique([noun + otherParticle(noun, family)].concat(
          take(PARTICLE_FAMILIES.filter(other => other !== family), 2)
            .map(other => noun + otherParticle(noun, other))))
          .filter(text => text !== right).slice(0, 3);
        if (wrong.length < 3) return;
        const last = finalIndex(noun);
        const reason = family.liquid && last === 8
          ? "'" + noun + "'의 받침은 'ㄹ'이에요."
          : (last > 0 ? "'" + noun + "'에는 받침이 있어요." : "'" + noun + "'에는 받침이 없어요.");
        out.push(multipleChoice({
          type: "place", tag: "조사 붙이기", units: word.unitIds,
          prompt: "'" + noun + "' 뒤에 조사를 바르게 붙인 것은 무엇이에요?",
          choices: [right].concat(wrong),
          answer: right,
          why: reason + " " + noun + " + " + particle + " → " + right
        }));
      });

      /* 2 — the noun and its particle written as one word, in that order. The
         three wrong answers are the three ways it can go wrong: the particle
         in front, the particle in front with a space, the particle behind with
         a space. */
      take(pool, PER_KIND_CAP).forEach(entry => {
        const hit = pickOne(particleHits(entry.ko));
        if (!hit) return;
        const right = hit.noun + hit.particle;
        const wrong = unique([
          hit.particle + hit.noun,
          hit.particle + " " + hit.noun,
          hit.noun + " " + hit.particle
        ]).filter(text => text !== right).slice(0, 3);
        if (wrong.length < 3) return;
        out.push(multipleChoice({
          type: "place", tag: "조사 자리", units: entry.unitIds,
          prompt: "빈칸에 알맞게 쓴 것을 고르세요.",
          sentence: [
            { text: entry.ko.slice(0, hit.start) },
            { blank: "" },
            { text: entry.ko.slice(hit.end) }
          ],
          choices: [right].concat(wrong),
          answer: right,
          why: "조사는 앞말에 붙여 써요. " + hit.noun + " + " + hit.particle + " → " + right
        }));
      });

      /* 3 — which word the particle rode in on. Every wrong answer is another
         word out of the same sentence, so the answer cannot be the one that
         happens to be there; a word carrying that same particle somewhere else
         in the line is kept out, since it would be right as well. */
      take(pool, PER_KIND_CAP).forEach(entry => {
        const hits = particleHits(entry.ko);
        const hit = pickOne(hits);
        if (!hit) return;
        const shared = new Set(hits.filter(item => item.particle === hit.particle)
          .map(item => item.noun));
        const candidates = unique(eojeols(entry.ko).map(token => {
          const clean = bare(token);
          const known = hits.find(item => item.noun + item.particle === clean);
          return known ? known.noun : clean;
        })).filter(text => text && text !== hit.noun && !shared.has(text));
        const wrong = take(candidates, 3);
        if (wrong.length < 3) return;
        out.push(multipleChoice({
          type: "place", tag: "조사가 붙는 말", units: entry.unitIds,
          prompt: "이 문장에서 '" + hit.particle + "'" + eun(hit.particle) + " 어느 말 뒤에 붙었어요?",
          sentence: [{ text: entry.ko }],
          choices: [hit.noun].concat(wrong),
          answer: hit.noun,
          why: "조사는 앞말 뒤에 붙어요. " + hit.noun + " + " + hit.particle
            + " → " + (hit.noun + hit.particle)
        }));
      });

      /* 4 — the predicate closes the sentence. Move it anywhere else and the
         sentence is wrong, which is not true of moving anything else, so this
         is the only word the wrong answers are built by moving. */
      take(pool, PER_KIND_CAP).forEach(entry => {
        if (quoted(entry.ko)) return;
        const tokens = eojeols(entry.ko.replace(TAIL_PUNCT, ""));
        if (tokens.length < 4 || tokens.length > 6) return;
        if (unique(tokens).length !== tokens.length) return;
        const last = tokens[tokens.length - 1];
        if (!/(요|다|까)$/.test(last)) return;
        const rest = tokens.slice(0, -1);
        const right = tokens.join(" ");
        const wrong = unique(rest.map((ignore, at) =>
          rest.slice(0, at).concat([last], rest.slice(at)).join(" ")))
          .filter(text => text !== right).slice(0, 3);
        if (wrong.length < 3) return;
        out.push(multipleChoice({
          type: "place", tag: "서술어 자리", units: entry.unitIds,
          prompt: "낱말을 바른 자리에 놓은 문장은 무엇이에요?",
          choices: [right].concat(wrong),
          answer: right,
          why: "한국어는 서술어가 맨 뒤에 와요. '" + last + "'" + iga(last) + " 맨 뒤에 있어요."
        }));
      });

      /* 5 — a 관형사 stands directly in front of the word it describes, and
         nowhere else in the sentence will do. */
      /* The headword only. A bank files 어떤지 as a searchable form of 어떤, and
         어떤지 closes a clause rather than standing in front of a noun, so the
         rule this question teaches is not a rule it keeps. */
      const determiners = new Set(words.filter(word => word.pos === "determiner")
        .map(word => bare(word.ko)).filter(Boolean));
      if (determiners.size) {
        take(pool, PER_KIND_CAP).forEach(entry => {
          if (quoted(entry.ko)) return;
          const tokens = eojeols(entry.ko.replace(TAIL_PUNCT, ""));
          if (tokens.length < 4 || unique(tokens).length !== tokens.length) return;
          const at = tokens.findIndex((token, index) =>
            index < tokens.length - 1 && determiners.has(bare(token)));
          if (at < 0) return;
          const mover = tokens[at];
          const rest = tokens.slice(0, at).concat(tokens.slice(at + 1));
          const right = tokens.join(" ");
          const wrong = unique(rest.map((ignore, index) =>
            rest.slice(0, index).concat([mover], rest.slice(index)).join(" "))
            .concat([rest.concat([mover]).join(" ")]))
            .filter(text => text !== right).slice(0, 3);
          if (wrong.length < 3) return;
          out.push(multipleChoice({
            type: "place", tag: "꾸미는 말 자리", units: entry.unitIds,
            prompt: "'" + mover + "'" + eul(mover) + " 바른 자리에 놓은 문장은 무엇이에요?",
            choices: [right].concat(wrong),
            answer: right,
            why: "관형사는 꾸미는 말 바로 앞에 와요. '" + mover + " " + tokens[at + 1] + "'처럼 써요."
          }));
        });
      }

      return out;
    }


    /* -------------------------------------------------------------- confuse */
    /* 보다 · 보이다 · 보여 주다: words close enough in shape that nothing but
       the sentence around them says which one is wanted. Families come from two
       places — the page hands over the ones worth a line of explanation, and
       the rest are found by looking for a stem another stem begins with, which
       is how 살다 · 살리다 and 앉다 · 앉히다 turn up without anybody listing
       them.

       The wrong answers are built rather than borrowed, because a family member
       may never appear in the corpus in the form the question needs. The ending
       is lifted off the right answer and glued onto the other stems, so 보고
       becomes 보이고 and 보여 주고. Three things keep that from writing Korean
       nobody would:

         the surface still begins with its own stem, which 봤어요 does not, 보
           and 았 having been squeezed into one syllable;
         every stem involved ends in a vowel, since a stem ending in a
           consonant takes a different ending and 가깝 + 요 is not a word;
         the ending begins with a consonant — -고, -는, -면, -지 — which is the
           half of the endings that attach to a stem without changing it or
           being changed by it.

       That last rule is also what keeps the questions honest, and not only
       tidy. The corpus is read by matching an eojeol against the longest stem
       it begins with, and a contraction defeats that: 말해 begins with 말, so
       it is filed under 말다 rather than 말하다, and 들었어요 under 들다 rather
       than 듣다. Neither remainder — 해, 었어요 — is an ending that begins with
       a consonant, so neither is ever asked about, and a question whose keyed
       answer is the wrong word never reaches the screen. */
    const stemOf = ko => {
      const text = String(ko || "");
      return /다$/.test(text) && text.length > 1 ? text.slice(0, -1) : text;
    };
    const vowelStem = ko => finalIndex(stemOf(ko)) === 0;
    const ENDING_HEADS = new Set(["고", "는", "니", "면", "지", "게", "서", "기", "자",
      "거", "려", "러", "네", "며", "세", "시", "다", "죠", "던", "잖", "구"]);
    /* What is left of a surface once its own stem is taken off the front, or
       nothing when what is left is not an ending this can safely move. */
    function endingAfter(surface, word) {
      const stem = stemOf(word.ko);
      if (!stem || !vowelStem(word.ko)) return "";
      if (surface.indexOf(stem) !== 0 || surface.length <= stem.length) return "";
      const rest = surface.slice(stem.length);
      if (PARTICLES.has(rest) || !ENDING_HEADS.has(rest[0])) return "";
      return rest;
    }

    function confusableFamilies() {
      const byKo = new Map();
      corpus.words.forEach(word => { if (word.ko && !byKo.has(word.ko)) byKo.set(word.ko, word); });

      const families = [];
      const seen = new Set();
      function add(members, note) {
        const kept = members.filter(Boolean).slice(0, 4);
        if (kept.length < 2) return;
        const key = kept.map(word => word.ko).sort().join("|");
        if (seen.has(key)) return;
        seen.add(key);
        families.push({ words: kept, ko: note || "" });
      }

      (config.confusables || []).forEach(group => {
        const list = Array.isArray(group) ? group : (group.words || []);
        add(list.map(ko => byKo.get(ko)), Array.isArray(group) ? "" : group.ko);
      });

      const predicates = corpus.words.filter(word => PREDICATE_POS.has(word.pos)
        && /^[가-힣 ]+다$/.test(String(word.ko || "")));
      predicates.forEach(word => {
        const stem = stemOf(word.ko);
        if (!stem || stem.length > 3) return;
        const kin = predicates.filter(other => {
          if (other.ko === word.ko) return false;
          const theirs = stemOf(other.ko);
          return theirs !== stem && theirs.indexOf(stem) === 0 && theirs.length <= stem.length + 2;
        });
        if (kin.length) add([word].concat(kin), "");
      });
      return families;
    }

    function confuseQuestions(state) {
      const out = [];
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));
      const families = confusableFamilies()
        .filter(family => family.words.some(word => inSelection(word.unitIds, state.units)));
      if (!families.length) return out;

      /* Words by class, for the families of two: three choices are wanted and
         two words can only supply two of them. */
      const byPos = new Map();
      corpus.words.forEach(word => {
        if (!byPos.has(word.pos)) byPos.set(word.pos, []);
        byPos.get(word.pos).push(word);
      });
      /* Every stem the same ending can be glued to, which is where the filling
         comes from when a family is too small to supply three wrong answers.
         Drawn the same way the family's own wrong answers are, so a choice
         list never mixes 가고 and 나가고 with a 알아보세요. */
      const gluable = corpus.words.filter(word => PREDICATE_POS.has(word.pos) && vowelStem(word.ko));

      /* Which families a word belongs to, so a sentence is scanned once and
         each of its words looked up rather than every family walking the pool. */
      const familiesOf = new Map();
      families.forEach(family => {
        family.words.forEach(word => {
          if (!familiesOf.has(word.id)) familiesOf.set(word.id, []);
          familiesOf.get(word.id).push(family);
        });
      });

      take(pool, PER_KIND_CAP * 2).forEach(entry => {
        corpus.scan(entry.ko).forEach(hit => {
          const word = hit.word;
          if (!word) return;
          (familiesOf.get(word.id) || []).forEach(family => {
            const others = family.words.filter(other => other.id !== word.id);
            const note = family.ko || "";

            /* 1 — which of the family the sentence is asking for */
            const ending = endingAfter(hit.surface, word);
            if (ending) {
              const wrong = unique(others.filter(other => vowelStem(other.ko))
                .map(other => stemOf(other.ko) + ending))
                .filter(text => text !== hit.surface);
              if (wrong.length) {
                /* A family of two leaves one near miss and two ordinary wrong
                   answers, which is still the question being asked: the one
                   word it is easy to reach for instead is on the screen. */
                const padded = unique(wrong.concat(take(gluable, 8)
                  .map(other => stemOf(other.ko) + ending)))
                  .filter(text => text !== hit.surface).slice(0, 3);
                if (padded.length === 3) {
                  out.push(multipleChoice({
                    type: "confuse", tag: "닮은 말",
                    units: entry.unitIds,
                    prompt: "빈칸에 알맞은 말을 고르세요.",
                    sentence: [
                      { text: entry.ko.slice(0, hit.start) },
                      { blank: "" },
                      { text: entry.ko.slice(hit.end) }
                    ],
                    choices: [hit.surface].concat(padded),
                    answer: hit.surface,
                    hint: word.en,
                    hintId: word.id,
                    why: note || "'" + entry.ko + "'"
                  }));
                }
              }
            }

            /* 2 — which of them the word in front of you is a form of. Not
               asked when the sentence shows the dictionary form itself, since
               then the answer is already written on the screen, and not asked
               unless the form can be taken apart into a stem and an ending this
               file is sure about — see endingAfter above. */
            if (hit.surface !== word.ko && ending) {
              const spare = others.length >= 2 ? []
                : take(byPos.get(word.pos) || [], 4)
                  .filter(other => other.id !== word.id).map(other => other.ko);
              const choices = unique([word.ko]
                .concat(others.map(other => other.ko)).concat(spare)).slice(0, 4);
              if (choices.length >= 3) {
                out.push(multipleChoice({
                  type: "confuse", tag: "닮은 말 찾기",
                  units: entry.unitIds,
                  prompt: "이 문장의 '" + hit.surface + "'" + eun(hit.surface) + " 어느 말이에요?",
                  sentence: [{ text: entry.ko }],
                  choices,
                  answer: word.ko,
                  hint: word.en,
                  hintId: word.id,
                  why: note || "'" + hit.surface + "'" + eun(hit.surface) + " '" + word.ko + "'의 모습이에요."
                }));
              }
            }
          });
        });
      });

      return take(out, PER_KIND_CAP);
    }

    /* ------------------------------------------------------------------ fix */
    /* A sentence with something wrong in it — and nothing wrong that a rule
       does not guarantee is wrong. Korean lets a writer move most things
       around, so "that reads oddly" is not a mistake and is never asked about
       here. Three things are mistakes wherever they turn up, and each is made
       by taking a real sentence and breaking it:

         a particle that disagrees with the last letter of its noun
           (학교를 → 학교을),
         a particle written apart from its noun, or in front of it
           (학교에 → 학교 에, 에학교),
         the predicate lifted out of the last place in the sentence.

       A meaning error would be the fourth kind — 저는 친구보다 영화를 좋아해요,
       where every word is spelled right and the sentence still says something
       nobody meant — and it is not generated here. Swap one word for another of
       the same class and the sentence that comes out is as likely to be true as
       to be wrong, and a wrong answer that is not wrong is worse than a
       question never asked. The words that really are used for one another are
       asked about by 닮은 말 instead. */
    function corruptionsOf(entry) {
      const text = String(entry.ko || "");
      const out = [];

      particleHits(text).forEach(hit => {
        const right = hit.noun + hit.particle;
        const family = PARTICLE_FAMILIES.find(item =>
          item.withFinal === hit.particle || item.without === hit.particle);
        const swap = family && particleFor(hit.noun, family) === hit.particle
          ? hit.noun + otherParticle(hit.noun, family) : null;
        /* Everything the noun and its particle can be written as and be wrong,
           which is where the choices for "put it right" come from. */
        const spoiled = unique([
          swap,
          hit.particle + hit.noun,
          hit.noun + " " + hit.particle
        ].concat(PARTICLE_FAMILIES.map(other => hit.noun + otherParticle(hit.noun, other)))
          .filter(Boolean).filter(form => form !== right));

        if (swap) {
          out.push({
            single: true, bad: swap, right, spoiled,
            text: text.slice(0, hit.start) + swap + text.slice(hit.end),
            why: "'" + hit.noun + "'에는 받침이 " + (hasFinal(hit.noun) ? "있" : "없")
              + "어요. '" + swap + "'" + iga(swap) + " 아니라 '" + right + "'" + ida(right) + "."
          });
        }
        out.push({
          single: true, bad: hit.particle + hit.noun, right, spoiled,
          text: text.slice(0, hit.start) + hit.particle + hit.noun + text.slice(hit.end),
          why: "조사는 앞말 뒤에 붙어요. '" + hit.particle + hit.noun + "'" + iga(hit.particle + hit.noun)
            + " 아니라 '" + right + "'" + ida(right) + "."
        });
        out.push({
          single: false, bad: hit.noun + " " + hit.particle, right, spoiled,
          text: text.slice(0, hit.start) + hit.noun + " " + hit.particle + text.slice(hit.end),
          why: "조사는 앞말에 붙여 써요. '" + hit.noun + " " + hit.particle + "'" + iga(hit.particle)
            + " 아니라 '" + right + "'" + ida(right) + "."
        });
      });

      /* The predicate out of its place. Nothing here is a single wrong word —
         every word is spelled right and the sentence is still not Korean — so
         this one is only ever shown whole. */
      const tokens = eojeols(text.replace(TAIL_PUNCT, ""));
      const last = tokens[tokens.length - 1] || "";
      if (!/["“”‘’']/.test(text) && tokens.length >= 4 && tokens.length <= 7
        && unique(tokens).length === tokens.length && /(요|다|까)$/.test(last)) {
        const rest = tokens.slice(0, -1);
        const at = 1 + Math.floor(Math.random() * (rest.length - 1));
        out.push({
          single: false, bad: null, right: text, spoiled: [],
          text: rest.slice(0, at).concat([last], rest.slice(at)).join(" "),
          why: "한국어는 서술어가 맨 뒤에 와요. '" + last + "'" + iga(last) + " 맨 뒤로 가야 해요."
        });
      }

      return out;
    }

    function fixQuestions(state) {
      const out = [];
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));
      const lines = unique(pool.map(entry => entry.ko));
      if (lines.length < 4) return out;
      const lineSet = new Set(lines);

      /* One breakage per sentence, drawn fresh, so the same line coming round
         again in another run is not broken in the same place. */
      const broken = [];
      take(pool, PER_KIND_CAP).forEach(entry => {
        const spoil = pickOne(corruptionsOf(entry));
        if (spoil && !lineSet.has(spoil.text)) broken.push({ entry, spoil });
      });
      if (!broken.length) return out;

      broken.forEach(item => {
        const entry = item.entry;
        const spoil = item.spoil;

        /* 1 — the wrong one among three that are right */
        const honest = take(lines.filter(line => line !== entry.ko), 3);
        if (honest.length === 3) {
          out.push(multipleChoice({
            type: "fix", tag: "틀린 문장 찾기",
            units: entry.unitIds,
            prompt: "다음 중 틀린 문장은 무엇이에요?",
            choices: [spoil.text].concat(honest),
            answer: spoil.text,
            why: spoil.why
          }));
        }

        /* 2 — the right one among three that are wrong. The three are other
           sentences broken, never this one broken three ways, or the answer is
           the line the other three are all versions of. */
        const wrong = unique(take(broken.filter(other => other.entry.ko !== entry.ko), 6)
          .map(other => other.spoil.text)).filter(text => !lineSet.has(text)).slice(0, 3);
        if (wrong.length === 3) {
          out.push(multipleChoice({
            type: "fix", tag: "바른 문장 찾기",
            units: entry.unitIds,
            prompt: "다음 중 바른 문장은 무엇이에요?",
            choices: [entry.ko].concat(wrong),
            answer: entry.ko,
            why: "'" + entry.ko + "'만 바른 문장이에요."
          }));
        }

        if (!spoil.bad) return;

        /* 3 — where the mistake is. Only the breakages that leave exactly one
           wrong word behind: a particle written apart from its noun is a
           mistake spread over two words, and pointing at either one of them is
           half an answer. */
        if (spoil.single) {
          const others = unique(eojeols(spoil.text).map(bare))
            .filter(token => token && token !== spoil.bad);
          const picked = take(others, 3);
          if (picked.length === 3) {
            out.push(multipleChoice({
              type: "fix", tag: "틀린 곳 찾기",
              units: entry.unitIds,
              prompt: "이 문장에서 틀린 말은 무엇이에요?",
              sentence: [{ text: spoil.text }],
              choices: [spoil.bad].concat(picked),
              answer: spoil.bad,
              why: spoil.why
            }));
          }
        }

        /* 4 — put it right. The thing on the screen is never offered back as a
           choice; the other three are the other ways the same two words can be
           written wrongly. */
        const fixes = take(spoil.spoiled.filter(form => form !== spoil.bad), 3);
        if (fixes.length === 3) {
          out.push(multipleChoice({
            type: "fix", tag: "바르게 고치기",
            units: entry.unitIds,
            prompt: "'" + spoil.bad + "'" + eul(spoil.bad) + " 바르게 고친 것은 무엇이에요?",
            sentence: [{ text: spoil.text }],
            choices: [spoil.right].concat(fixes),
            answer: spoil.right,
            why: spoil.why
          }));
        }
      });

      return take(out, PER_KIND_CAP);
    }

    /* --------------------------------------------------------------- polite */
    /* The height a sentence speaks at, read off its last word, or nothing when
       that word does not say plainly. Guessing here would put two right answers
       on the screen, so a sentence this cannot place is a sentence it does not
       ask about. */
    function levelOf(text) {
      const body = String(text || "").replace(TAIL_PUNCT, "");
      const tokens = eojeols(body);
      if (tokens.length < 2) return null;
      const last = tokens[tokens.length - 1];
      if (last.length < 2) return null;
      /* 갑니다 and 아니다 both end in 니다. Only the first has a ㅂ in front of
         it, and that ㅂ is the whole of the 합니다체. */
      if (/(니다|니까|시다)$/.test(last) && finalIndex(last.slice(0, -2)) === 17) return "hamnida";
      if (/십시오$/.test(last)) return "hamnida";
      if (/요$/.test(last)) return "haeyo";

      const root = corpus.rootOf(last);
      const predicate = Boolean(root && PREDICATE_POS.has(root.pos));
      if (/다$/.test(last)) {
        /* 간다, 먹는다, 갔다 — the plain written ending — but not 바다. */
        const before = last[last.length - 2];
        const piece = syllable(before);
        if (predicate || before === "는" || (piece && piece.final === 4)
          || /(았|었|겠|였)다$/.test(last)) return "haera";
        return null;
      }
      /* Below this line the ending is a bare one, and a bare ending only says
         반말 when the word carrying it is a verb or an adjective. 개 ends the
         way 봐 does and is a puppy. */
      if (!predicate) return null;
      if (BANMAL_TAIL.test(last)) return "banmal";
      const tail = last[last.length - 1];
      const piece = syllable(tail);
      if (piece && piece.final === 0 && INFINITIVE_VOWELS.has(piece.vowel)
        && !NOT_INFINITIVE.has(tail)) return "banmal";
      return null;
    }

    /* 해요체 comes apart cleanly: the 요 on the end is the politeness and
       nothing else, so taking it off leaves the same sentence in 반말. Only the
       -아/-어 endings survive that cut — 이에요 becomes 이야 and -(으)세요
       becomes 해, neither of which is a letter you can delete — so the syllable
       in front of the 요 has to be an infinitive one. */
    function toBanmal(text) {
      const trail = (String(text).match(TAIL_PUNCT) || [""])[0];
      const body = String(text).replace(TAIL_PUNCT, "");
      if (!/요$/.test(body) || body.length < 3 || eojeols(body).length < 2) return null;
      const before = body[body.length - 2];
      const piece = syllable(before);
      if (!piece || piece.final !== 0 || !INFINITIVE_VOWELS.has(piece.vowel)) return null;
      if (NOT_INFINITIVE.has(before)) return null;
      return body.slice(0, -1) + trail;
    }

    function politeQuestions(state) {
      const out = [];
      const words = corpus.words.filter(word => inSelection(word.unitIds, state.units));
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));

      /* Every sentence filed under the height it speaks at, plus the 반말 each
         해요체 sentence turns into once its 요 comes off. That is the one change
         to a sentence this file makes rather than finds, and it is here because
         a bank of polite model sentences holds no 반말 of its own to compare
         them with. A derived line remembers where it came from, so that no
         question ever shows a sentence beside its own 반말. */
      const byLevel = new Map(LEVELS.map(level => [level.id, []]));
      take(pool, PER_KIND_CAP * 3).forEach(entry => {
        const level = levelOf(entry.ko);
        const units = entry.unitIds || [];
        if (level) byLevel.get(level).push({ text: entry.ko, from: entry.ko, units });
        const low = toBanmal(entry.ko);
        if (low) byLevel.get("banmal").push({ text: low, from: entry.ko, units });
      });
      const at = id => byLevel.get(id) || [];
      const share = Math.ceil(PER_KIND_CAP / 4);

      /* Wrong answers drawn from other heights, never twice from the same
         sentence and never from one the question already shows. */
      function against(shown, levels, wanted) {
        const used = new Set();
        shown.forEach(item => { used.add(item.from); used.add(item.text); });
        const wrong = [];
        shuffle(levels.flatMap(at)).forEach(item => {
          if (wrong.length >= wanted || used.has(item.from) || used.has(item.text)) return;
          used.add(item.from);
          used.add(item.text);
          wrong.push(item.text);
        });
        return wrong.length === wanted ? wrong : null;
      }

      /* 1 — name the height of one sentence */
      LEVELS.forEach(level => {
        take(at(level.id), share).forEach(item => {
          out.push(multipleChoice({
            type: "polite", tag: "말투 찾기", units: item.units,
            prompt: "이 문장은 어떤 말투예요?",
            sentence: [{ text: item.text }],
            choices: [level.ko].concat(LEVELS.filter(other => other.id !== level.id)
              .map(other => other.ko)),
            answer: level.ko,
            why: "'" + lastWord(item.text) + "'" + ro(lastWord(item.text)) + " 끝나요. " + level.cue
          }));
        });
      });

      /* 2 — the sentence that speaks at the same height as this one */
      LEVELS.forEach(level => {
        const mine = at(level.id);
        if (mine.length < 2) return;
        const elsewhere = LEVELS.filter(other => other.id !== level.id).map(other => other.id);
        take(mine, share).forEach(item => {
          const twin = pickOne(mine.filter(other =>
            other.from !== item.from && other.text !== item.text));
          if (!twin) return;
          const wrong = against([item, twin], elsewhere, 3);
          if (!wrong) return;
          out.push(multipleChoice({
            type: "polite", tag: "말투가 같은 것", units: item.units,
            prompt: "이 문장과 말투가 같은 것을 고르세요.",
            sentence: [{ text: item.text }],
            choices: [twin.text].concat(wrong),
            answer: twin.text,
            why: "두 문장 다 " + level.name + ida(level.name) + "."
          }));
        });
      });

      /* 3 — the one that speaks at a different height from the other three */
      LEVELS.forEach(odd => {
        LEVELS.forEach(crowd => {
          if (crowd.id === odd.id || at(crowd.id).length < 3) return;
          take(at(odd.id), Math.ceil(share / 3)).forEach(item => {
            const wrong = against([item], [crowd.id], 3);
            if (!wrong) return;
            out.push(multipleChoice({
              type: "polite", tag: "말투가 다른 것", units: item.units,
              prompt: "다음 중 말투가 다른 하나는 무엇이에요?",
              choices: [item.text].concat(wrong),
              answer: item.text,
              why: "'" + item.text + "'만 " + odd.name + ida(odd.name)
                + ". 나머지는 " + crowd.name + ida(crowd.name) + "."
            }));
          });
        });
      });

      /* 4 — the highest of the four, and 5 — the one that is not 높임말 at all */
      const top = at("hamnida").length ? "hamnida" : "haeyo";
      const below = top === "hamnida" ? ["haeyo", "banmal", "haera"] : ["banmal", "haera"];
      take(at(top), share).forEach(item => {
        const wrong = against([item], below, 3);
        if (!wrong) return;
        out.push(multipleChoice({
          type: "polite", tag: "가장 높은 말투", units: item.units,
          prompt: "다음 중 가장 높여 말한 것은 무엇이에요?",
          choices: [item.text].concat(wrong),
          answer: item.text,
          why: top === "hamnida"
            ? "'-습니다', '-ㅂ니다'로 끝나는 합니다체가 가장 높은 말투예요."
            : "'요'를 붙이면 높임말이 돼요."
        }));
      });

      take(at("banmal"), share).forEach(item => {
        const wrong = against([item], ["haeyo", "hamnida"], 3);
        if (!wrong) return;
        out.push(multipleChoice({
          type: "polite", tag: "높임말이 아닌 것", units: item.units,
          prompt: "다음 중 높임말이 아닌 것은 무엇이에요?",
          choices: [item.text].concat(wrong),
          answer: item.text,
          why: "'" + item.text + "'에는 '요'가 없어요. 반말이에요."
        }));
      });

      /* 6 — who you may say it to. Only this direction is asked: 반말 to a
         teacher is wrong, while 해요체 to a friend is merely polite, and a
         question whose wrong answers are not wrong is not a question. */
      ["haeyo", "hamnida"].forEach(id => {
        take(at(id), Math.ceil(share / 2)).forEach(item => {
          const wrong = against([item], ["banmal"], 3);
          if (!wrong) return;
          out.push(multipleChoice({
            type: "polite", tag: "듣는 사람", units: item.units,
            prompt: "선생님께 하는 말로 알맞은 것은 무엇이에요?",
            choices: [item.text].concat(wrong),
            answer: item.text,
            why: "어른께는 '요'나 '-습니다'를 붙여서 말해요. 나머지는 반말이에요."
          }));
        });
      });

      /* 7 — the ending that raises the person being spoken to */
      /* The answer has to end in -(으)세요, since that is what the question
         names; the wrong answers have to be free of every honorific mark, not
         just that one, or 주셨어요 ends up standing there raising someone in a
         choice the reader is being told is plain. */
      const raises = item => /(세요|십니|십시오|셨|시는)/.test(item.text);
      const endsSeyo = item => /세요["'“”‘’]?[.!?…]*$/.test(item.text);
      const plainHaeyo = at("haeyo").filter(item => !raises(item));
      if (plainHaeyo.length >= 3) {
        take(at("haeyo").filter(endsSeyo), Math.ceil(share / 2)).forEach(item => {
          const used = new Set([item.from, item.text]);
          const wrong = [];
          shuffle(plainHaeyo).forEach(other => {
            if (wrong.length >= 3 || used.has(other.from) || used.has(other.text)) return;
            used.add(other.from);
            used.add(other.text);
            wrong.push(other.text);
          });
          if (wrong.length < 3) return;
          out.push(multipleChoice({
            type: "polite", tag: "높임 말끝", units: item.units,
            prompt: "듣는 사람을 높이는 '-(으)세요'를 쓴 문장은 무엇이에요?",
            choices: [item.text].concat(wrong),
            answer: item.text,
            why: "'" + lastWord(item.text) + "'에 '-(으)세요'가 있어요."
          }));
        });
      }

      /* 8 — the words Korean swaps rather than bends, asked only about the
         plain halves this page actually teaches */
      const known = new Map(words.map(word => [String(word.ko || ""), word]));
      HONORIFICS.filter(pair => known.has(pair.plain)).forEach(pair => {
        const wrong = take(unique(HONORIFICS
          .filter(other => other.kind === pair.kind && other.high !== pair.high)
          .map(other => other.high)), 3);
        if (wrong.length < 3) return;
        out.push(multipleChoice({
          type: "polite", tag: "높임말 낱말", units: known.get(pair.plain).unitIds,
          prompt: "'" + pair.plain + "'" + eul(pair.plain) + " 높여서 말하면 무엇이에요?",
          choices: [pair.high].concat(wrong),
          answer: pair.high,
          why: "'" + pair.plain + "'의 높임말은 '" + pair.high + "'" + ida(pair.high) + "."
        }));
      });

      return out;
    }

    /* ------------------------------------------------------------ order/chunk */
    function orderQuestions(state) {
      const out = [];
      (config.units || []).filter(unit => state.units.has(unit.id)).forEach(unit => {
        const lines = (unit.lines || []).map(line => line.ko).filter(Boolean);
        [3, 4].forEach(size => {
          for (let start = 0; start + size <= lines.length; start += 1) {
            const run = lines.slice(start, start + size);
            if (unique(run).length !== run.length) continue;
            out.push(ordering({
              type: "order", tag: "문장 순서", units: [unit.id],
              prompt: "문장을 글의 순서대로 놓으세요.",
              solution: run,
              why: run.join(" ")
            }));
          }
        });
      });
      return take(out, PER_KIND_CAP);
    }

    function chunkQuestions(state) {
      const out = [];
      const pool = corpus.sentences.filter(entry => inSelection(entry.unitIds, state.units));
      take(pool, PER_KIND_CAP).forEach(entry => {
        /* The full stop comes off first: left on, it says which piece goes last
           and the puzzle solves itself from the right-hand end. */
        const body = entry.ko.replace(/[.!?]+["”]?\s*$/, "").trim();
        const tokens = eojeols(body);
        if (tokens.length < 3 || tokens.length > 9) return;
        /* Three to five pieces: one word each while the sentence is short, and
           pairs once it is not, so a puzzle is never a wall of tiles. */
        let pieces;
        if (tokens.length <= 5) {
          pieces = tokens.slice();
        } else {
          const per = Math.ceil(tokens.length / 4);
          pieces = [];
          for (let i = 0; i < tokens.length; i += per) pieces.push(tokens.slice(i, i + per).join(" "));
        }
        if (pieces.length < 3 || unique(pieces).length !== pieces.length) return;
        out.push(ordering({
          type: "chunk", tag: "조각 순서", units: entry.unitIds,
          prompt: "조각을 눌러 바른 문장을 만드세요.",
          solution: pieces,
          why: entry.ko
        }));
      });
      return out;
    }

    /* -------------------------------------------------------------- excerpt */
    /* A true sentence with one word swapped for another of the same class —
       still Korean, no longer what the passage said. */
    function falsify(text) {
      const hits = shuffle(corpus.scan(text).filter(hit => hit.word));
      for (let i = 0; i < hits.length; i += 1) {
        const hit = hits[i];
        const wrong = corpus.distractorsFor(hit.surface, hit.word, 1, true)[0];
        if (!wrong) continue;
        return {
          from: text,
          text: text.slice(0, hit.start) + wrong + text.slice(hit.end),
          swapped: hit.surface,
          to: wrong
        };
      }
      return null;
    }

    function excerptQuestions(state) {
      const out = [];
      const allTitles = (config.units || []).map(unit => unit.titleKo).filter(Boolean);

      (config.units || []).filter(unit => state.units.has(unit.id)).forEach(unit => {
        const lines = (unit.lines || []).map(line => line.ko).filter(Boolean);

        [2, 3].forEach(size => {
          for (let start = 0; start + size <= lines.length; start += 1) {
            const window = lines.slice(start, start + size);

            /* the one that is not in the passage */
            const altered = falsify(pickOne(window));
            if (altered && window.indexOf(altered.text) < 0) {
              const others = take(window.filter(line => line !== altered.from), 3);
              if (others.length >= 2) {
                out.push(multipleChoice({
                  type: "excerpt", tag: "다른 내용 찾기", units: [unit.id],
                  passage: window,
                  prompt: "이 글의 내용과 다른 것은 무엇이에요?",
                  choices: [altered.text].concat(others),
                  answer: altered.text,
                  why: "글에는 '" + altered.swapped + "'" + iga(altered.swapped) + " 있어요. '"
                    + altered.to + "'" + iga(altered.to) + " 아니에요."
                }));
              }
            }

            /* the one that is */
            const right = pickOne(window);
            const fakes = [];
            window.forEach(line => {
              if (line === right) return;
              const fake = falsify(line);
              if (fake && window.indexOf(fake.text) < 0) fakes.push(fake.text);
            });
            const extra = falsify(right);
            if (extra && window.indexOf(extra.text) < 0) fakes.push(extra.text);
            const wrong = unique(fakes).slice(0, 3);
            if (wrong.length === 3) {
              out.push(multipleChoice({
                type: "excerpt", tag: "같은 내용 찾기", units: [unit.id],
                passage: window,
                prompt: "이 글의 내용과 같은 것은 무엇이에요?",
                choices: [right].concat(wrong),
                answer: right,
                why: "글에 '" + right + "'" + iga(right) + " 그대로 있어요."
              }));
            }

            /* a word that never turns up in it */
            const inside = unique(window.flatMap(line => corpus.scan(line).map(hit => hit.word))
              .filter(Boolean).map(word => word.ko));
            const outsiders = corpus.words.filter(word =>
              inSelection(word.unitIds, state.units) && inside.indexOf(word.ko) < 0);
            const missing = pickOne(outsiders);
            const shown = take(inside, 3);
            if (missing && shown.length === 3) {
              out.push(multipleChoice({
                type: "excerpt", tag: "글에 있는 말", units: [unit.id],
                passage: window,
                prompt: "이 글에 나오지 않는 말은 무엇이에요?",
                choices: shown.concat([missing.ko]),
                answer: missing.ko,
                why: "'" + missing.ko + "'" + eun(missing.ko) + " 이 글에 없어요."
              }));
            }
          }
        });

        /* the title over the whole thing */
        if (unit.titleKo && allTitles.length >= 4 && lines.length) {
          const wrong = take(allTitles.filter(title => title !== unit.titleKo), 3);
          if (wrong.length === 3) {
            out.push(multipleChoice({
              type: "excerpt", tag: "제목", units: [unit.id],
              passage: lines.slice(0, 4),
              prompt: "이 글의 제목으로 알맞은 것은 무엇이에요?",
              choices: [unit.titleKo].concat(wrong),
              answer: unit.titleKo,
              why: "이 글은 '" + unit.titleKo + "'에 대한 글이에요."
            }));
          }
        }
      });

      return take(out, PER_KIND_CAP);
    }

    /* ----------------------------------------------------------------- next */
    function nextQuestions(state) {
      const out = [];
      const everyLine = (config.units || []).flatMap(unit =>
        (unit.lines || []).map(line => ({ unitId: unit.id, ko: line.ko })));

      (config.units || []).filter(unit => state.units.has(unit.id)).forEach(unit => {
        const lines = (unit.lines || []).map(line => line.ko).filter(Boolean);
        for (let at = 1; at < lines.length; at += 1) {
          const right = lines[at];
          const outside = everyLine.filter(line => line.unitId !== unit.id && line.ko !== right);
          const wrong = unique(take(outside, 8).map(line => line.ko)).slice(0, 3);
          if (wrong.length < 3) continue;
          out.push(multipleChoice({
            type: "next", tag: "다음 문장", units: [unit.id],
            passage: lines.slice(Math.max(0, at - 3), at),
            prompt: "이 글 다음에 올 문장으로 알맞은 것은 무엇이에요?",
            choices: [right].concat(wrong),
            answer: right,
            why: "다음 문장은 '" + right + "'" + ida(right) + "."
          }));
        }
      });
      return take(out, PER_KIND_CAP);
    }

    const GENERATORS = {
      concept: conceptQuestions,
      guess: guessQuestions,
      blank: blankQuestions,
      confuse: confuseQuestions,
      fix: fixQuestions,
      place: placeQuestions,
      polite: politeQuestions,
      order: orderQuestions,
      chunk: chunkQuestions,
      excerpt: excerptQuestions,
      next: nextQuestions
    };

    /* A unit the run is to be drawn from at all: ticked, and — where the page
       has mix sliders — not turned all the way down. A question belonging to no
       unit belongs to every one of them and is never weighed out. */
    function weightOf(state, id) {
      if (!state.weights) return 1;
      const held = state.weights instanceof Map ? state.weights.get(id) : state.weights[id];
      return held === undefined || held === null ? 1 : Math.max(0, Number(held) || 0);
    }
    function livingUnits(state, question) {
      const mine = (question.units || []).filter(id => state.units.has(id));
      if (!mine.length) return null;
      const kept = mine.filter(id => weightOf(state, id) > 0);
      return kept.length ? kept : [];
    }

    function pool(state) {
      const out = [];
      TYPES.forEach(type => {
        if (!state.types.has(type.id)) return;
        GENERATORS[type.id](state).forEach(question => {
          if (!question || !question.valid) return;
          const units = livingUnits(state, question);
          if (units && !units.length) return;
          out.push(question);
        });
      });
      return out;
    }

    /* A run is spread evenly over the types that are switched on, so ticking
       six of them never produces a run that is five-sixths blanks merely
       because blanks are the easiest to generate. The same is then done inside
       each type over the kinds of question it holds: grade 1 has two
       compound-word questions and three hundred part-of-speech ones, and
       without this the two would never be seen. */
    function interleave(lists) {
      const queues = lists.map(list => shuffle(list));
      const out = [];
      let at = 0;
      while (queues.some(queue => queue.length)) {
        const queue = queues[at % queues.length];
        if (queue.length) out.push(queue.pop());
        at += 1;
      }
      return out;
    }

    /* A generator that runs a couple of rounds over its source can draw the
       same pair of words twice, so a run refuses a question it has asked. */
    function keyOf(question) {
      return [
        question.type,
        question.prompt,
        (question.sentence || []).map(part => part.text || "").join("§"),
        (question.passage || []).join("§"),
        question.mode === "order" ? question.solution.join("§") : question.answerText
      ].join("|");
    }

    function drawFrom(questions, wanted, asked) {
      const byType = new Map();
      questions.forEach(question => {
        if (!byType.has(question.type)) byType.set(question.type, new Map());
        const byTag = byType.get(question.type);
        if (!byTag.has(question.tag)) byTag.set(question.tag, []);
        byTag.get(question.tag).push(question);
      });
      /* Reversed because the round-robin below pops off the end. */
      const buckets = [...byType.values()].map(byTag => interleave([...byTag.values()]).reverse());

      const picked = [];
      let cursor = 0;
      while (picked.length < wanted && buckets.some(bucket => bucket.length)) {
        const bucket = buckets[cursor % buckets.length];
        cursor += 1;
        if (!bucket.length) continue;
        const question = bucket.pop();
        const key = keyOf(question);
        if (asked.has(key)) continue;
        asked.add(key);
        picked.push(question);
      }
      return picked;
    }

    /* How many of the run each unit is to fill. A slider standing at twice
       another fills twice as much of it; the remainders are handed out largest
       first, so twenty questions over three even units come out 7/7/6 rather
       than 6/6/6 and a gap. */
    function quotasFor(ids, weights, wanted) {
      const total = ids.reduce((sum, id) => sum + weights.get(id), 0);
      if (!total) return new Map(ids.map(id => [id, 0]));
      const shares = ids.map(id => {
        const exact = (weights.get(id) / total) * wanted;
        return { id, whole: Math.floor(exact), rest: exact - Math.floor(exact) };
      });
      const quotas = new Map(shares.map(share => [share.id, share.whole]));
      let left = wanted - shares.reduce((sum, share) => sum + share.whole, 0);
      shares.sort((a, b) => b.rest - a.rest).forEach(share => {
        if (left <= 0) return;
        quotas.set(share.id, quotas.get(share.id) + 1);
        left -= 1;
      });
      return quotas;
    }

    function draw(state, wanted) {
      const questions = pool(state);
      const asked = new Set();
      if (!state.weights) return shuffle(drawFrom(questions, wanted, asked));

      /* Each question is filed under one of its units, chosen by the sliders
         themselves: a word that turns up in day 3 and day 9 belongs to
         whichever of the two the run is asking for more of, most of the time. */
      const weights = new Map([...state.units].map(id => [id, weightOf(state, id)]));
      const ids = [...state.units].filter(id => weights.get(id) > 0);
      if (ids.length < 2) return shuffle(drawFrom(questions, wanted, asked));

      const groups = new Map(ids.map(id => [id, []]));
      questions.forEach(question => {
        /* A question the page filed under no unit at all — a word that turns
           up in none of the passages — belongs to every one of them, so it is
           filed by the sliders like everything else rather than being left to
           fill whatever gap is over at the end. */
        const mine = livingUnits(state, question) || ids;
        if (!mine.length) return;
        let ticket = Math.random() * mine.reduce((sum, id) => sum + weights.get(id), 0);
        let home = mine[mine.length - 1];
        for (let i = 0; i < mine.length; i += 1) {
          ticket -= weights.get(mine[i]);
          if (ticket <= 0) { home = mine[i]; break; }
        }
        groups.get(home).push(question);
      });

      const quotas = quotasFor(ids, weights, wanted);
      const picked = [];
      ids.forEach(id => { picked.push(...drawFrom(groups.get(id), quotas.get(id), asked)); });
      /* A unit that could not fill its share hands what is left to the others,
         so a mix that asks for more of a thin day still returns a full run. */
      if (picked.length < wanted) {
        const rest = ids.flatMap(id => groups.get(id))
          .filter(question => !asked.has(keyOf(question)));
        picked.push(...drawFrom(rest, wanted - picked.length, asked));
      }
      return shuffle(picked);
    }

    return { pool, draw, TYPES };
  }

  global.DrillQuestions = { create, TYPES, TYPE_BY_ID, splitSentences };
})(window);
