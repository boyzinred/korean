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

  Six kinds of question, each of which the page can switch off:

    concept   개념·형태   the idea behind a word rather than the word itself:
                          its class, its group, the two words it is built from,
                          the syllable it shares with another, its opposite, the
                          sentence that uses a grammar point.
    blank     빈칸 채우기 one or two words cut out of a real sentence.
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
      extras:   [{ ko, unitIds }] more sentences for blanks and chunks,
      mineSurfaces: true when the bank stores dictionary forms only
    });

    drill.pool({ units: Set, types: Set, grammar: Set })   -> every question
    drill.draw({ … }, 20)                                  -> a balanced run

  A question
  ----------
    { id, type, tag, passage, prompt, sentence, mode, choices, answer,
      answerText, tiles, solution, join, why }

    mode "mc"     choices / answer / answerText
    mode "order"  tiles (shuffled) / solution / join
    sentence      null, or [{ text }, { blank: "①" }, …] for the page to render
    passage       null, or the lines to show above the question
*/
(function (global) {
  "use strict";

  /* =======================================================================
     Korean odds and ends
  ======================================================================= */

  /* Particles agree with the last letter of the word in front of them, so the
     generated prompts work it out instead of writing 은/는 everywhere. */
  function hasFinal(text) {
    const clean = String(text || "").replace(/[^가-힣]/g, "");
    if (!clean) return false;
    return (clean.charCodeAt(clean.length - 1) - 0xAC00) % 28 !== 0;
  }
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
    { id: "blank", ko: "빈칸 채우기", en: "Fill in the blank",
      note: "One or two words cut out of a real sentence." },
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

    return { words, sentences, scan, distractorsFor };
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
            type: "concept", tag: "품사",
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
            type: "concept", tag: "갈래",
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
      const NOUNISH = new Set(["noun", "proper noun", "noun phrase", "dependent noun"]);
      const compounds = [];
      words.forEach(word => {
        const ko = String(word.ko || "");
        if (ko.length < 2 || !NOUNISH.has(word.pos) || !/^[가-힣]+$/.test(ko)) return;
        for (let cut = 1; cut < ko.length; cut += 1) {
          const left = koIndex.get(ko.slice(0, cut));
          const right = koIndex.get(ko.slice(cut));
          if (left && right && left.ko !== ko && right.ko !== ko
            && NOUNISH.has(left.pos) && NOUNISH.has(right.pos)
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
          type: "concept", tag: "낱말 만들기",
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
          type: "concept", tag: "낱말 만들기",
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
              type: "concept", tag: "반대말",
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
            type: "concept", tag: "문법",
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
            type: "blank", tag: "빈칸",
            prompt: "빈칸에 알맞은 말을 고르세요.",
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
          type: "blank", tag: "빈칸 둘",
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
            type: "blank", tag: "문법 빈칸",
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
              type: "order", tag: "문장 순서",
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
          type: "chunk", tag: "조각 순서",
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
                  type: "excerpt", tag: "다른 내용 찾기",
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
                type: "excerpt", tag: "같은 내용 찾기",
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
                type: "excerpt", tag: "글에 있는 말",
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
              type: "excerpt", tag: "제목",
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
            type: "next", tag: "다음 문장",
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
      blank: blankQuestions,
      order: orderQuestions,
      chunk: chunkQuestions,
      excerpt: excerptQuestions,
      next: nextQuestions
    };

    function pool(state) {
      const out = [];
      TYPES.forEach(type => {
        if (!state.types.has(type.id)) return;
        GENERATORS[type.id](state).forEach(question => {
          if (question && question.valid) out.push(question);
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

    function draw(state, wanted) {
      const byType = new Map();
      pool(state).forEach(question => {
        if (!byType.has(question.type)) byType.set(question.type, new Map());
        const byTag = byType.get(question.type);
        if (!byTag.has(question.tag)) byTag.set(question.tag, []);
        byTag.get(question.tag).push(question);
      });
      /* Reversed because the round-robin below pops off the end. */
      const buckets = [...byType.values()].map(byTag => interleave([...byTag.values()]).reverse());

      const picked = [];
      /* A generator that runs a couple of rounds over its source can draw the
         same pair of words twice, so a run refuses a question it has asked. */
      const asked = new Set();
      let cursor = 0;
      while (picked.length < wanted && buckets.some(bucket => bucket.length)) {
        const bucket = buckets[cursor % buckets.length];
        cursor += 1;
        if (!bucket.length) continue;
        const question = bucket.pop();
        const key = [
          question.type,
          question.prompt,
          (question.sentence || []).map(part => part.text || "").join("§"),
          (question.passage || []).join("§"),
          question.mode === "order" ? question.solution.join("§") : question.answerText
        ].join("|");
        if (asked.has(key)) continue;
        asked.add(key);
        picked.push(question);
      }
      return shuffle(picked);
    }

    return { pool, draw, TYPES };
  }

  global.DrillQuestions = { create, TYPES, TYPE_BY_ID, splitSentences };
})(window);
