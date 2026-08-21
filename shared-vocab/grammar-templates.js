/*
 * Grammar Sentence Templates
 * One generator per TOPIK II grammar form, keyed by the form string printed on
 * the lesson page. Each template receives filled vocabulary slots and returns a
 * Korean sentence with its English translation.
 *
 * Requires korean-grammar.js.
 *
 * Browser: <script src="./shared-vocab/grammar-templates.js"></script>
 * Node/CommonJS: const GrammarTemplates = require("./grammar-templates.js");
 */
(function (root, factory) {
  const api = factory(typeof require === "function" ? require("./korean-grammar.js") : root.KoreanGrammar);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.GrammarTemplates = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (G) {
  "use strict";

  const {
    attachEu, plainStem, infinitive, pastStem, modifier, politeEnding, pastPolite,
    verbEnglish, adjectiveEnglish, thirdPerson, gerund, pastEnglish
  } = G;

  // Slot kinds a template can request.
  //   verb, verb2  - partOfSpeech "verb"
  //   adj, adj2    - partOfSpeech "adjective"
  //   noun         - any noun
  //   place        - noun in places-buildings
  //   time         - noun in time-calendar
  const V = e => verbEnglish(e);
  const A = e => adjectiveEnglish(e);

  /*
   * Normalises the form string so near-identical labels across levels share a
   * template: "-(으)ㄴ/는 반면(에)" and "-(으)ㄴ/는 반면에" are the same grammar.
   */
  function normalizeForm(form) {
    return String(form).replace(/^-/, "").replace(/\s+/g, " ").trim();
  }

  const TEMPLATES = {
    // ---- TOPIK II level 3 --------------------------------------------------
    "(으)면서": {
      needs: ["verb", "verb2"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)면서")} ${politeEnding(s.verb2.korean)}.`,
        `I ${V(s.verb2)} while ${gerund(V(s.verb))}.`
      ]
    },
    "(으)려고 하다": {
      needs: ["verb"],
      build: s => [`${attachEu(s.verb.korean, "(으)려고")} 해요.`, `I plan to ${V(s.verb)}.`]
    },
    "(으)ㄴ 후에": {
      needs: ["verb", "verb2"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄴ")} 후에 ${politeEnding(s.verb2.korean)}.`,
        `After ${gerund(V(s.verb))}, I ${V(s.verb2)}.`
      ]
    },
    "기 전에": {
      needs: ["verb", "verb2"],
      build: s => [
        `${plainStem(s.verb.korean, "기")}기 전에 ${politeEnding(s.verb2.korean)}.`,
        `Before ${gerund(V(s.verb))}, I ${V(s.verb2)}.`
      ]
    },
    "(으)니까": {
      needs: ["adj", "verb"],
      build: s => [
        `${attachEu(s.adj.korean, "(으)니까")} ${politeEnding(s.verb.korean)}.`,
        `Since it is ${A(s.adj)}, I ${V(s.verb)}.`
      ]
    },
    "아/어서": {
      needs: ["adj", "verb"],
      build: s => [
        `${infinitive(s.adj.korean)}서 ${politeEnding(s.verb.korean)}.`,
        `It is ${A(s.adj)}, so I ${V(s.verb)}.`
      ]
    },
    "(으)ㄹ 것 같다": {
      needs: ["verb"],
      build: s => [`${attachEu(s.verb.korean, "(으)ㄹ")} 것 같아요.`, `I think I will ${V(s.verb)}.`]
    },
    "(으)면": {
      needs: ["verb", "verb2"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)면")} ${politeEnding(s.verb2.korean)}.`,
        `If I ${V(s.verb)}, I ${V(s.verb2)}.`
      ]
    },
    "아/어 보다": {
      needs: ["verb"],
      build: s => [`${infinitive(s.verb.korean)} 보세요.`, `Try ${gerund(V(s.verb))}.`]
    },
    "(으)ㄹ 수 있다 / 없다": {
      needs: ["verb"],
      build: s => [`${attachEu(s.verb.korean, "(으)ㄹ")} 수 있어요.`, `I can ${V(s.verb)}.`]
    },
    "(으)ㄹ 때": {
      needs: ["verb", "verb2"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")} 때 ${politeEnding(s.verb2.korean)}.`,
        `When I ${V(s.verb)}, I ${V(s.verb2)}.`
      ]
    },
    "다가": {
      needs: ["verb", "verb2"],
      build: s => [
        `${plainStem(s.verb.korean, "다")}다가 ${pastPolite(s.verb2.korean)}.`,
        `I was ${gerund(V(s.verb))} and then I ${pastEnglish(V(s.verb2))}.`
      ]
    },
    "고 있다": {
      needs: ["verb"],
      build: s => [`${plainStem(s.verb.korean, "고")}고 있어요.`, `I am ${gerund(V(s.verb))}.`]
    },
    "게 되다": {
      needs: ["verb"],
      build: s => [`${plainStem(s.verb.korean, "게")}게 됐어요.`, `I ended up ${gerund(V(s.verb))}.`]
    },
    "기 때문에": {
      needs: ["adj", "verb"],
      build: s => [
        `${plainStem(s.adj.korean, "기")}기 때문에 ${politeEnding(s.verb.korean)}.`,
        `Because it is ${A(s.adj)}, I ${V(s.verb)}.`
      ]
    },
    "(으)ㄴ 적이 있다": {
      needs: ["verb"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄴ")} 적이 있어요.`,
        `I have tried ${gerund(V(s.verb))} before.`
      ]
    },
    "(으)러 가다 / 오다": {
      needs: ["place", "verb"],
      build: s => [
        `${s.place.korean}에 ${attachEu(s.verb.korean, "(으)러")} 가요.`,
        `I am going to the ${G.baseEnglish(s.place)} to ${V(s.verb)}.`
      ]
    },
    "네요": {
      needs: ["adj"],
      build: s => [`${plainStem(s.adj.korean, "네")}네요.`, `Oh, it is ${A(s.adj)}.`]
    },
    "(으)ㄹ지도 모르다": {
      needs: ["verb"],
      build: s => [`${attachEu(s.verb.korean, "(으)ㄹ")}지도 몰라요.`, `I might ${V(s.verb)}.`]
    },
    "(으)ㄴ/는 것 같다": {
      needs: ["verb"],
      build: s => [`${modifier(s.verb.korean)} 것 같아요.`, `It seems that he ${thirdPerson(V(s.verb))}.`]
    },

    // ---- TOPIK II level 4 --------------------------------------------------
    "아/어 보이다": {
      needs: ["adj"],
      build: s => [`${infinitive(s.adj.korean)} 보여요.`, `You look ${A(s.adj)}.`]
    },
    "(으)ㄴ/는 편이다": {
      needs: ["adj"],
      build: s => [
        `${modifier(s.adj.korean, { adjective: true })} 편이에요.`,
        `It is rather ${A(s.adj)}.`
      ]
    },
    "(으)ㄹ 뿐만 아니라": {
      needs: ["adj", "adj2"],
      build: s => [
        `${attachEu(s.adj.korean, "(으)ㄹ")} 뿐만 아니라 ${politeEnding(s.adj2.korean)}.`,
        `It is not only ${A(s.adj)} but also ${A(s.adj2)}.`
      ]
    },
    "기는 하지만": {
      needs: ["adj", "adj2"],
      build: s => [
        `${plainStem(s.adj.korean, "기")}기는 하지만 ${politeEnding(s.adj2.korean)}.`,
        `It is ${A(s.adj)}, but it is also ${A(s.adj2)}.`
      ]
    },
    "(으)ㄴ/는 데다가": {
      needs: ["adj", "adj2"],
      build: s => [
        `${modifier(s.adj.korean, { adjective: true })} 데다가 ${politeEnding(s.adj2.korean)}.`,
        `Besides being ${A(s.adj)}, it is ${A(s.adj2)}.`
      ]
    },
    "(으)ㄹ 정도로": {
      needs: ["adj", "verb"],
      build: s => [
        `${attachEu(s.adj.korean, "(으)ㄹ")} 정도로 ${pastPolite(s.verb.korean)}.`,
        `I ${pastEnglish(V(s.verb))} to the point of being ${A(s.adj)}.`
      ]
    },
    "(으)ㄹ 리가 없다": {
      needs: ["verb"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")} 리가 없어요.`,
        `There is no way he would ${V(s.verb)}.`
      ]
    },
    "(으)ㄴ/는 줄 알다": {
      needs: ["verb"],
      build: s => [`${modifier(s.verb.korean)} 줄 알았어요.`, `I thought he ${thirdPerson(V(s.verb))}.`]
    },
    "(으)ㄴ/는 척하다": {
      needs: ["verb"],
      build: s => [`${modifier(s.verb.korean)} 척해요.`, `He pretends to ${V(s.verb)}.`]
    },
    "(으)ㄹ 뻔하다": {
      needs: ["verb"],
      build: s => [`${attachEu(s.verb.korean, "(으)ㄹ")} 뻔했어요.`, `I almost ${pastEnglish(V(s.verb))}.`]
    },
    "느라고": {
      needs: ["verb", "verb2"],
      build: s => [
        `${plainStem(s.verb.korean, "느")}느라고 못 ${politeEnding(s.verb2.korean)}.`,
        `I could not ${V(s.verb2)} because I was busy ${gerund(V(s.verb))}.`
      ]
    },
    "(으)ㄴ/는 탓에": {
      needs: ["adj", "verb"],
      build: s => [
        `${modifier(s.adj.korean, { adjective: true })} 탓에 못 ${politeEnding(s.verb.korean)}.`,
        `Because it is ${A(s.adj)}, I cannot ${V(s.verb)}.`
      ]
    },
    "(으)ㄴ/는 덕분에": {
      needs: ["verb", "verb2"],
      build: s => [
        `${modifier(s.verb.korean, { tense: "past" })} 덕분에 ${pastPolite(s.verb2.korean)}.`,
        `Thanks to ${gerund(V(s.verb))}, I ${pastEnglish(V(s.verb2))}.`
      ]
    },
    "(으)ㄹ까 봐": {
      needs: ["verb", "verb2"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")}까 봐 ${politeEnding(s.verb2.korean)}.`,
        `I ${V(s.verb2)} because I am worried that I might ${V(s.verb)}.`
      ]
    },
    "(으)ㄴ/는 대신에": {
      needs: ["verb", "verb2"],
      build: s => [
        `${modifier(s.verb.korean)} 대신에 ${politeEnding(s.verb2.korean)}.`,
        `Instead of ${gerund(V(s.verb))}, I ${V(s.verb2)}.`
      ]
    },
    "(으)ㄹ 수밖에 없다": {
      needs: ["verb"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")} 수밖에 없어요.`,
        `I have no choice but to ${V(s.verb)}.`
      ]
    },
    "(으)ㄴ/는 반면에": {
      needs: ["adj", "adj2"],
      build: s => [
        `${modifier(s.adj.korean, { adjective: true })} 반면에 ${politeEnding(s.adj2.korean)}.`,
        `It is ${A(s.adj)}, whereas it is also ${A(s.adj2)}.`
      ]
    },
    "(으)ㄹ 만큼": {
      needs: ["verb", "verb2"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")} 만큼 ${politeEnding(s.verb2.korean)}.`,
        `I ${V(s.verb2)} as much as I ${V(s.verb)}.`
      ]
    },
    "더니": {
      needs: ["adj", "verb"],
      build: s => [
        `${plainStem(s.adj.korean, "더")}더니 ${politeEnding(s.verb.korean)}.`,
        `It used to be ${A(s.adj)}, and now I ${V(s.verb)}.`
      ]
    },
    "았/었더니": {
      needs: ["verb", "verb2"],
      build: s => [
        `${pastStem(s.verb.korean)}더니 ${pastPolite(s.verb2.korean)}.`,
        `After I ${pastEnglish(V(s.verb))}, I ${pastEnglish(V(s.verb2))}.`
      ]
    },

    // ---- TOPIK II level 5 --------------------------------------------------
    "더라도": {
      needs: ["adj", "verb"],
      build: s => [
        `${plainStem(s.adj.korean, "더")}더라도 ${politeEnding(s.verb.korean)}.`,
        `Even if it is ${A(s.adj)}, I ${V(s.verb)}.`
      ]
    },
    "(으)ㄴ/는 셈이다": {
      needs: ["verb"],
      build: s => [
        `${modifier(s.verb.korean, { tense: "past" })} 셈이에요.`,
        `That means I basically ${pastEnglish(V(s.verb))}.`
      ]
    },
    "다시피": {
      needs: ["verb", "verb2"],
      build: s => [
        `${plainStem(s.verb.korean, "다")}다시피 ${politeEnding(s.verb2.korean)}.`,
        `As you ${V(s.verb)}, I ${V(s.verb2)}.`
      ]
    },
    "(으)ㄹ 따름이다": {
      needs: ["adj"],
      build: s => [`${attachEu(s.adj.korean, "(으)ㄹ")} 따름이에요.`, `I am simply ${A(s.adj)}.`]
    },
    "(으)ㄹ 법하다": {
      needs: ["verb"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")} 법해요.`,
        `It seems likely that he would ${V(s.verb)}.`
      ]
    },
    "기에": {
      needs: ["adj", "verb"],
      build: s => [
        `${plainStem(s.adj.korean, "기")}기에 ${pastPolite(s.verb.korean)}.`,
        `Because it was ${A(s.adj)}, I ${pastEnglish(V(s.verb))}.`
      ]
    },
    "(으)ㄹ 만하다": {
      needs: ["verb"],
      build: s => [`${attachEu(s.verb.korean, "(으)ㄹ")} 만해요.`, `It is worth ${gerund(V(s.verb))}.`]
    },
    "(으)ㄹ수록": {
      needs: ["verb", "adj"],
      build: s => [
        `${attachEu(s.verb.korean, "(으)ㄹ")}수록 ${politeEnding(s.adj.korean)}.`,
        `The more I ${V(s.verb)}, the more ${A(s.adj)} it is.`
      ]
    },
    "(으)ㄴ 나머지": {
      needs: ["adj", "verb"],
      build: s => [
        `${modifier(s.adj.korean, { adjective: true })} 나머지 ${pastPolite(s.verb.korean)}.`,
        `Being so ${A(s.adj)}, I ${pastEnglish(V(s.verb))}.`
      ]
    },
    "(으)ㄹ지라도": {
      needs: ["adj", "verb"],
      build: s => [
        `${attachEu(s.adj.korean, "(으)ㄹ")}지라도 ${politeEnding(s.verb.korean)}.`,
        `Even if it is ${A(s.adj)}, I ${V(s.verb)}.`
      ]
    }
  };

  // Forms whose label differs slightly between levels but share a template.
  const ALIASES = {
    "(으)ㄴ 탓에": "(으)ㄴ/는 탓에",
    "(으)ㄴ 덕분에": "(으)ㄴ/는 덕분에",
    "(으)ㄴ/는 반면(에)": "(으)ㄴ/는 반면에",
    "(으)ㄹ 수 있다/없다": "(으)ㄹ 수 있다 / 없다",
    "(으)러 가다/오다": "(으)러 가다 / 오다"
  };

  /*
   * Copulas, existentials, and pro-forms are tagged as adjectives in the shared
   * data but cannot stand in an "it is ___" frame, so they are kept out of the
   * descriptive slots. Verb slots need a real action, not 있다/없다 either.
   */
  const NON_DESCRIPTIVE = new Set([
    "있다", "없다", "이다", "아니다", "되다", "계시다", "드리다",
    "그렇다", "이렇다", "저렇다", "어떻다", "어떠하다", "같다"
  ]);

  /* True when an entry can fill the given slot kind. */
  function fillsSlot(entry, slot) {
    if (!entry || !entry.korean) return false;
    const gloss = G.baseEnglish(entry);
    if (!gloss) return false;
    switch (slot) {
      case "verb":
      case "verb2":
        return entry.partOfSpeech === "verb" && /^[가-힣]+다$/.test(entry.korean) && !NON_DESCRIPTIVE.has(entry.korean);
      case "adj":
      case "adj2":
        return entry.partOfSpeech === "adjective" && /^[가-힣]+다$/.test(entry.korean) && !NON_DESCRIPTIVE.has(entry.korean);
      case "place":
        return entry.partOfSpeech === "noun" && entry.category === "places-buildings";
      case "time":
        return entry.partOfSpeech === "noun" && entry.category === "time-calendar";
      case "noun":
        return entry.partOfSpeech === "noun" || entry.partOfSpeech === "proper noun";
      default:
        return false;
    }
  }

  function templateFor(form) {
    const key = normalizeForm(form);
    return TEMPLATES[key] || TEMPLATES[ALIASES[key]] || null;
  }

  function listForms() { return Object.keys(TEMPLATES); }

  /*
   * Picks one entry per slot from `pool`, never reusing the same word twice in
   * one sentence. Returns null when a slot cannot be filled, which is how a
   * caller learns the selected vocabulary does not support this grammar point.
   */
  function fillSlots(form, pool, random) {
    const needs = slotsFor(form);
    if (!needs) return null;
    const pick = random || (n => Math.floor(Math.random() * n));
    const used = new Set();
    const slots = {};
    for (const slot of needs) {
      const candidates = pool.filter(entry => fillsSlot(entry, slot) && !used.has(entry.korean));
      if (!candidates.length) return null;
      const chosen = candidates[pick(candidates.length)];
      used.add(chosen.korean);
      slots[slot] = chosen;
    }
    return slots;
  }

  /* Whether `pool` can supply every slot the form needs. */
  function supports(form, pool) {
    const needs = slotsFor(form);
    if (!needs) return false;
    const counts = {};
    needs.forEach(slot => { counts[slot] = (counts[slot] || 0) + 1; });
    // Slots of the same kind compete for the same words.
    const KIND = { verb: "verb", verb2: "verb", adj: "adj", adj2: "adj" };
    const required = {};
    Object.keys(counts).forEach(slot => {
      const kind = KIND[slot] || slot;
      required[kind] = (required[kind] || 0) + counts[slot];
    });
    return Object.entries(required).every(([kind, n]) => {
      const sample = kind === "verb" ? "verb" : kind === "adj" ? "adj" : kind;
      return pool.filter(entry => fillsSlot(entry, sample)).length >= n;
    });
  }

  /*
   * Builds one sentence. `slots` maps a slot name to a vocabulary entry.
   * Returns null when the template does not exist.
   */
  function build(form, slots) {
    const template = templateFor(form);
    if (!template) return null;
    const [korean, english] = template.build(slots);
    return { korean, english };
  }

  function slotsFor(form) {
    const template = templateFor(form);
    return template ? template.needs.slice() : null;
  }

  return { build, templateFor, slotsFor, listForms, normalizeForm, fillsSlot, fillSlots, supports, NON_DESCRIPTIVE, TEMPLATES, ALIASES };
});
