/*
 * Korean Grammar Toolkit
 * Conjugation, particle selection, and modifier forms for building sentences
 * from arbitrary shared-vocabulary entries.
 *
 * Browser: <script src="./shared-vocab/korean-grammar.js"></script>
 * Node/CommonJS: const KoreanGrammar = require("./korean-grammar.js");
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.KoreanGrammar = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const BASE = 0xac00;
  const LAST = 0xd7a3;
  const JUNG_COUNT = 21;
  const JONG_COUNT = 28;

  const isSyllable = ch => { const c = ch.charCodeAt(0); return c >= BASE && c <= LAST; };
  const decompose = ch => {
    const i = ch.charCodeAt(0) - BASE;
    return { cho: Math.floor(i / 588), jung: Math.floor((i % 588) / JONG_COUNT), jong: i % JONG_COUNT };
  };
  const compose = (cho, jung, jong) => String.fromCharCode(BASE + cho * 588 + jung * JONG_COUNT + jong);

  // Medial vowel indices used by the harmony and contraction rules.
  const V = { A: 0, AE: 1, YA: 2, YAE: 3, EO: 4, E: 5, YEO: 6, YE: 7, O: 8, WA: 9, WAE: 10, OE: 11, YO: 12, U: 13, WO: 14, WE: 15, WI: 16, YU: 17, EU: 18, UI: 19, I: 20 };
  // Final consonant indices referenced by the irregular rules.
  const T = { NONE: 0, L: 8, B: 17, D: 7, S: 19, H: 27, N: 4, M: 16 };

  const lastSyllable = text => {
    const chars = [...String(text)].filter(isSyllable);
    return chars.length ? chars[chars.length - 1] : null;
  };

  function hasBatchim(text) {
    const ch = lastSyllable(text);
    return !!ch && decompose(ch).jong !== T.NONE;
  }

  function finalConsonant(text) {
    const ch = lastSyllable(text);
    return ch ? decompose(ch).jong : T.NONE;
  }

  // ---------------------------------------------------------------------------
  // Particles
  // ---------------------------------------------------------------------------
  const particle = (consonantForm, vowelForm) => noun => String(noun) + (hasBatchim(noun) ? consonantForm : vowelForm);

  const topic = particle("은", "는");
  const subject = particle("이", "가");
  const object = particle("을", "를");
  const and = particle("과", "와");
  const withParticle = particle("으로", "로");
  const copula = particle("이에요", "예요");
  const copulaFormal = noun => String(noun) + "입니다";
  const copulaPlain = particle("이다", "다");
  const vocativeSubject = particle("이", "가");

  // 로/으로 keeps the plain form after ㄹ.
  function instrumental(noun) {
    return String(noun) + (!hasBatchim(noun) || finalConsonant(noun) === T.L ? "로" : "으로");
  }

  // ---------------------------------------------------------------------------
  // Stems and irregular classes
  // ---------------------------------------------------------------------------
  function stemOf(word) {
    const text = String(word).trim();
    return /다$/.test(text) ? text.slice(0, -1) : text;
  }

  // Verbs and adjectives whose final consonant looks irregular but conjugates
  // regularly. Everything else with that final consonant is treated as irregular.
  // 묻다 is listed as "ask" in the shared data, which is the irregular one.
  const REGULAR_B = ["입다", "잡다", "좁다", "씹다", "뽑다", "접다", "업다", "집다", "굽다", "꼽다", "밟다", "넓다", "짧다"];
  const REGULAR_D = ["받다", "닫다", "믿다", "얻다", "쏟다", "뜯다", "돋다"];
  const REGULAR_S = ["웃다", "씻다", "벗다", "빗다", "솟다", "빼앗다"];
  const REGULAR_H = ["좋다", "낳다", "넣다", "놓다", "많다", "싫다", "괜찮다", "쌓다", "닿다"];
  /*
   * Matched as a suffix so compounds inherit the base word's behaviour:
   * 내놓다 follows 놓다, 붙잡다 follows 잡다.
   */
  const endsWithAny = (word, list) => list.some(regular => word === regular || word.endsWith(regular));
  // 르-stems that follow the 으 rule instead of doubling ㄹ.
  const EU_RE = new Set(["따르다", "들르다", "치르다", "다다르다"]);
  // ㅂ-irregulars that take 와 rather than 워.
  const B_WA = new Set(["돕다", "곱다"]);

  function irregularClass(word) {
    const text = String(word).trim();
    const stem = stemOf(text);
    if (!stem) return "none";
    if (/르$/.test(stem) && stem.length >= 2 && !EU_RE.has(text)) return "reu";
    const jong = finalConsonant(stem);
    if (jong === T.B && !endsWithAny(text, REGULAR_B)) return "b";
    if (jong === T.D && !endsWithAny(text, REGULAR_D)) return "d";
    if (jong === T.S && !endsWithAny(text, REGULAR_S)) return "s";
    if (jong === T.H && !endsWithAny(text, REGULAR_H)) return "h";
    if (jong === T.L) return "l";
    if (jong === T.NONE) {
      const ch = lastSyllable(stem);
      if (ch && decompose(ch).jung === V.EU) return "eu";
    }
    return "none";
  }

  const CHO_N = 2, CHO_S = 9;
  const dropFinal = stem => {
    const ch = lastSyllable(stem);
    const { cho, jung } = decompose(ch);
    return stem.slice(0, -1) + compose(cho, jung, T.NONE);
  };

  /*
   * ㄹ-final stems drop the ㄹ before an ending that begins with ㄴ, ㅂ, or ㅅ
   * (사니까, 삽니다, 사세요, 산, 사는) but keep it everywhere else (살면, 살고,
   * 살아요). `ending` is the ending with any leading "(으)" already removed.
   */
  function endingDropsL(ending) {
    if (!ending) return false;
    const head = ending[0];
    if (head === "ㄴ" || head === "ㄹ" || head === "ㅂ" || head === "ㅁ") return true;
    if (!isSyllable(head)) return false;
    const cho = decompose(head).cho;
    return cho === CHO_N || cho === CHO_S;
  }

  /*
   * The stem as it appears before a vowel-initial ending (으-endings and 아/어).
   * The ㅂ/ㄷ/ㅅ/ㅎ irregulars only surface here; before a consonant-initial
   * ending the dictionary stem is used unchanged (춥고, 듣습니다).
   */
  function euStem(word) {
    const stem = stemOf(word);
    const kind = irregularClass(word);
    const ch = lastSyllable(stem);
    if (!ch) return { stem, needsEu: false };
    const { cho, jung, jong } = decompose(ch);
    const head = stem.slice(0, -1);
    switch (kind) {
      case "l": // ㄹ survives here; only 으 is suppressed (살면)
        return { stem, needsEu: false };
      case "b": // 춥다 -> 추우 (absorbs the 으)
        return { stem: head + compose(cho, jung, T.NONE) + "우", needsEu: false };
      case "d": // 듣다 -> 들으
        return { stem: head + compose(cho, jung, T.L), needsEu: true };
      case "s": // 짓다 -> 지으
        return { stem: head + compose(cho, jung, T.NONE), needsEu: true };
      case "h": // 그렇다 -> 그러
        return { stem: head + compose(cho, jung, T.NONE), needsEu: false };
      default:
        return { stem, needsEu: jong !== T.NONE };
    }
  }

  /*
   * Attaches an ending whose leading 으 is optional, written here as "(으)".
   * attachEu("먹다", "(으)면") -> "먹으면";  attachEu("가다", "(으)면") -> "가면"
   * A leading bare ㄴ/ㄹ/ㅂ/ㅁ jamo is merged into the stem's final slot.
   */
  function attachEu(word, ending) {
    const optional = ending.startsWith("(으)");
    let rest = optional ? ending.slice(3) : ending;
    let { stem, needsEu } = euStem(word);
    if (irregularClass(word) === "l" && endingDropsL(rest)) stem = dropFinal(stem);
    let out = stem;
    if (optional && needsEu) out += "으";
    const HEAD = { "ㄴ": T.N, "ㄹ": T.L, "ㅂ": T.B, "ㅁ": T.M };
    if (rest && HEAD[rest[0]] !== undefined) {
      const ch = lastSyllable(out);
      const { cho, jung, jong } = decompose(ch);
      if (jong === T.NONE) {
        out = out.slice(0, -1) + compose(cho, jung, HEAD[rest[0]]);
      } else {
        // Cannot merge onto an occupied final slot; insert 으 and merge there.
        out += "으";
        const eu = lastSyllable(out);
        const d = decompose(eu);
        out = out.slice(0, -1) + compose(d.cho, d.jung, HEAD[rest[0]]);
      }
      rest = rest.slice(1);
    }
    return out + rest;
  }

  /*
   * The stem before a consonant-initial ending (-고, -지만, -기, -네요, -습니다).
   * No irregular applies; only a ㄹ-stem changes, and only before ㄴ/ㅂ/ㅅ.
   */
  function plainStem(word, ending) {
    const stem = stemOf(word);
    if (irregularClass(word) === "l" && endingDropsL(ending)) return dropFinal(stem);
    return stem;
  }

  /*
   * The 아/어 infinitive form: 가다 -> 가, 먹다 -> 먹어, 하다 -> 해, 춥다 -> 추워.
   */
  function infinitive(word) {
    const text = String(word).trim();
    const stem = stemOf(text);
    if (!stem) return "";
    if (/하$/.test(stem)) return stem.slice(0, -1) + "해";
    // 아니다 is suppletive: 아니에요, not 아녀요.
    if (/아니$/.test(stem)) return stem + "에";

    const kind = irregularClass(text);
    const ch = lastSyllable(stem);
    const { cho, jung, jong } = decompose(ch);
    const head = stem.slice(0, -1);
    const bright = jung === V.A || jung === V.O || jung === V.YA || jung === V.YO;

    switch (kind) {
      case "b": {
        const base = head + compose(cho, jung, T.NONE);
        return base + (B_WA.has(text) ? "와" : "워");
      }
      case "d": {
        const base = head + compose(cho, jung, T.L);
        return base + (bright ? "아" : "어");
      }
      case "s": {
        const base = head + compose(cho, jung, T.NONE);
        return base + (bright ? "아" : "어");
      }
      case "h": {
        // 그렇다 -> 그래, 빨갛다 -> 빨개
        const merged = jung === V.YA ? V.YAE : V.AE;
        return head + compose(cho, merged, T.NONE);
      }
      case "reu": {
        // 부르다 -> 불러: drop 르, add ㄹ to the previous syllable, then 러/라.
        const before = stem.slice(0, -1);
        const prev = lastSyllable(before);
        const p = decompose(prev);
        const doubled = before.slice(0, -1) + compose(p.cho, p.jung, T.L);
        const prevBright = p.jung === V.A || p.jung === V.O;
        return doubled + (prevBright ? "라" : "러");
      }
      case "eu": {
        // 쓰다 -> 써, 바쁘다 -> 바빠: 으 drops and takes the previous vowel's harmony.
        const before = stem.slice(0, -1);
        const prev = lastSyllable(before);
        const prevBright = prev ? [V.A, V.O].includes(decompose(prev).jung) : false;
        return before + compose(cho, prevBright ? V.A : V.EO, T.NONE);
      }
      default:
        break;
    }

    if (jong !== T.NONE) return stem + (bright ? "아" : "어");

    // Open syllable: contract the stem vowel with 아/어.
    const CONTRACT = {
      [V.A]: V.A, [V.EO]: V.EO, [V.O]: V.WA, [V.U]: V.WO, [V.I]: V.YEO,
      [V.AE]: V.AE, [V.E]: V.E, [V.OE]: V.WAE, [V.YEO]: V.YEO, [V.WI]: V.WI,
      [V.YO]: V.YO, [V.YU]: V.YU, [V.WA]: V.WA, [V.WO]: V.WO
    };
    const merged = CONTRACT[jung];
    if (merged !== undefined) {
      if (jung === V.WI) return stem + "어"; // 쉬다 -> 쉬어
      return head + compose(cho, merged, T.NONE);
    }
    return stem + (bright ? "아" : "어");
  }

  /* Past stem: 가다 -> 갔, 먹다 -> 먹었, 하다 -> 했 */
  function pastStem(word) {
    const inf = infinitive(word);
    const ch = lastSyllable(inf);
    const { cho, jung, jong } = decompose(ch);
    if (jong !== T.NONE) return inf + "었";
    return inf.slice(0, -1) + compose(cho, jung, 20 /* ㅆ */);
  }

  // ---------------------------------------------------------------------------
  // Sentence endings
  // ---------------------------------------------------------------------------
  const politeEnding = word => infinitive(word) + "요";
  const pastPolite = word => pastStem(word) + "어요";
  const futurePolite = word => attachEu(word, "(으)ㄹ") + " 거예요";
  const plainPresent = word => String(word).trim();
  const formalPresent = word => {
    // ㄹ-stems drop the ㄹ and take -ㅂ니다 (만들다 -> 만듭니다); every other stem
    // uses its dictionary form, so the ㅂ/ㄷ irregulars stay hidden (춥습니다).
    if (irregularClass(word) === "l") return attachEu(word, "(으)ㅂ") + "니다";
    const stem = stemOf(word);
    return hasBatchim(stem) ? stem + "습니다" : attachEu(word, "(으)ㅂ") + "니다";
  };
  const formalPast = word => pastStem(word) + "습니다";
  const casualPresent = word => infinitive(word);
  const casualPast = word => pastStem(word) + "어";

  /*
   * Determiner (modifier) forms placed in front of a noun.
   * 있다/없다 and anything built on them take 는 even though they behave as
   * adjectives elsewhere: 재미있는 사람, never 재미있은 사람.
   */
  const takesNeun = word => /(있다|없다)$/.test(String(word).trim());

  function modifier(word, { adjective = false, tense = "present" } = {}) {
    if (takesNeun(word)) {
      // 있는 / 있던 / 있을 — there is no 있은.
      if (tense === "past") return plainStem(word, "던") + "던";
      if (tense === "present") return plainStem(word, "는") + "는";
    }
    if (adjective && tense === "present") return attachEu(word, "(으)ㄴ");
    if (tense === "past") return attachEu(word, "(으)ㄴ");
    if (tense === "future") return attachEu(word, "(으)ㄹ");
    // Present-tense verbs and 있다/없다 take 는 (살다 -> 사는).
    return plainStem(word, "는") + "는";
  }

  /* Negatives */
  const shortNegative = word => "안 " + politeEnding(word);
  const longNegative = word => stemOf(word) + "지 않아요";
  const inability = word => "못 " + politeEnding(word);

  // ---------------------------------------------------------------------------
  // English helpers used when phrasing generated prompts
  // ---------------------------------------------------------------------------
  const article = english => (/^[aeiou]/i.test(english) ? "an " : "a ") + english;
  /*
   * The first sense of a dictionary gloss. Entries often pack several senses
   * into one field ("move, transfer  communicate", "earn ; to invite"), and a
   * generated sentence can only carry one of them.
   */
  function baseEnglish(entry) {
    return String((entry && entry.english) || "")
      .replace(/\([^)]*\)/g, " ")
      .split(/[/;,]|\s{2,}/)[0]
      .replace(/\s+/g, " ")
      .trim();
  }
  /* "to study" -> "study" */
  const verbEnglish = entry => baseEnglish(entry).replace(/^(?:to\s+)+/i, "");
  /* "to be quiet" -> "quiet". Some glosses carry a doubled "to be be", so strip greedily. */
  const adjectiveEnglish = entry => baseEnglish(entry).replace(/^(?:(?:to|be)\s+)+/i, "");

  /*
   * Glosses are often phrasal ("look around", "be born", "turn out well").
   * Only the head verb inflects, so these wrappers split the phrase, inflect
   * the first word, and put the rest back.
   */
  const onHead = inflect => phrase => {
    const text = String(phrase).trim();
    const space = text.indexOf(" ");
    if (space < 0) return inflect(text);
    return inflect(text.slice(0, space)) + text.slice(space);
  };

  /* third-person singular: study -> studies, watch -> watches, go -> goes */
  const thirdPerson = onHead(function (verb) {
    if (verb.toLowerCase() === "be") return "is";
    if (verb.toLowerCase() === "have") return "has";
    if (/(ch|sh|ss|x|z|o)$/i.test(verb)) return verb + "es";
    if (/[^aeiou]y$/i.test(verb)) return verb.slice(0, -1) + "ies";
    return verb + "s";
  });
  /* study -> studying, make -> making, sit -> sitting */
  const gerund = onHead(function (verb) {
    if (verb.toLowerCase() === "be") return "being";
    if (/[^aeiou]e$/i.test(verb) && !/ee$/i.test(verb)) return verb.slice(0, -1) + "ing";
    if (/^[^aeiou]*[aeiou][bdgklmnprt]$/i.test(verb)) return verb + verb.slice(-1) + "ing";
    return verb + "ing";
  });
  /* study -> studied, live -> lived, stop -> stopped */
  const pastEnglish = onHead(function (verb) {
    const IRREGULAR = {
      go: "went", come: "came", eat: "ate", drink: "drank", see: "saw", watch: "watched",
      read: "read", write: "wrote", make: "made", meet: "met", buy: "bought", give: "gave",
      take: "took", sleep: "slept", know: "knew", think: "thought", say: "said", speak: "spoke",
      hear: "heard", find: "found", get: "got", send: "sent", teach: "taught", learn: "learned",
      run: "ran", sit: "sat", stand: "stood", wear: "wore", win: "won", lose: "lost", put: "put",
      be: "was", have: "had", become: "became", begin: "began", bring: "brought", build: "built",
      catch: "caught", choose: "chose", cut: "cut", do: "did", drive: "drove", fall: "fell",
      feel: "felt", forget: "forgot", grow: "grew", hold: "held", keep: "kept", leave: "left",
      let: "let", pay: "paid", rise: "rose", sell: "sold", set: "set", show: "showed",
      shut: "shut", sing: "sang", spend: "spent", swim: "swam", tell: "told", understand: "understood",
      wake: "woke", "break": "broke", ride: "rode", hurt: "hurt", cost: "cost", quit: "quit"
    };
    const key = verb.toLowerCase();
    if (IRREGULAR[key]) return IRREGULAR[key];
    if (/e$/i.test(verb)) return verb + "d";
    if (/[^aeiou]y$/i.test(verb)) return verb.slice(0, -1) + "ied";
    if (/^[^aeiou]*[aeiou][bdgklmnprt]$/i.test(verb)) return verb + verb.slice(-1) + "ed";
    return verb + "ed";
  });

  return {
    hasBatchim, finalConsonant,
    topic, subject, object, and, withParticle, instrumental, copula, copulaFormal, copulaPlain, vocativeSubject,
    stemOf, plainStem, euStem, attachEu, irregularClass,
    infinitive, pastStem, modifier,
    politeEnding, pastPolite, futurePolite, plainPresent, formalPresent, formalPast, casualPresent, casualPast,
    shortNegative, longNegative, inability,
    article, baseEnglish, verbEnglish, adjectiveEnglish, thirdPerson, gerund, pastEnglish
  };
});
