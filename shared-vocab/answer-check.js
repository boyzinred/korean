/*
  answer-check.js
  ----------------------------------------------------------------------------
  How a typed vocabulary answer is marked, for pages that quiz words read
  through review-banks.js (study-quiz.html). The rules are progress-review's,
  which are the word bank pages' own:

    한국어        spaces ignored; "아래/밑" accepts either half, and any
                 spelling the bank lists in koAlts
    romanization dashes and spaces ignored; the bank's own and the site's
                 literal transcription of every accepted 한국어
    English      any part of a gloss split at , / ; or a numbered sense,
                 brackets dropped, and with or without to / a / an / the

  Two words the bank glosses the same — 아주 and 매우 are both "very" —
  cannot be told apart from the English, so answering with the other one is
  a retake, not a miss: otherWordMeant returns that word and the page asks
  again without counting anything.

  API
    AnswerCheck.create(words, romanize) -> {
      wordIn(entry, lang)
      accepted(entry, lang)            every answer that counts
      check(entry, direction, input)   -> true / false
      otherWordMeant(entry, direction, input) -> the other word, or null
    }
    words      every word of the bank, { id, ko, en, ro, koAlts }
    direction  { promptLang, answerLang }, each "ko", "ro" or "en"
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.AnswerCheck = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function normalize(text, lang) {
    const value = String(text || "").trim().toLowerCase();
    if (lang === "ko") return value.replace(/\s+/g, "");
    if (lang === "ro") return value.replace(/[\s-]+/g, "");
    return value.replace(/[.!?]/g, "").replace(/\s+/g, " ").trim();
  }

  function create(words, romanize) {
    const all = words || [];
    const toRoman = typeof romanize === "function" ? romanize : (text => text);

    function wordIn(entry, lang) {
      if (lang === "en") return entry.en;
      if (lang === "ro") return entry.ro || toRoman(entry.ko);
      return entry.ko;
    }

    function accepted(entry, lang) {
      const korean = String(entry.ko).split("/").concat(entry.koAlts || []);
      if (lang === "ko") return korean;
      if (lang === "ro") return [entry.ro || toRoman(entry.ko)].concat(korean.map(toRoman));
      const parts = String(entry.en).split(/\d+\.\s*|[,/;]/)
        .map(part => part.replace(/\([^)]*\)/g, "").trim())
        .filter(Boolean);
      const out = new Set([String(entry.en).replace(/\([^)]*\)/g, "").trim(), ...parts]);
      [...out].forEach(item => {
        const stripped = item.replace(/^(to|a|an|the)\s+/i, "").trim();
        if (stripped) out.add(stripped);
      });
      return [...out];
    }

    function checkIn(entry, lang, input) {
      const given = normalize(input, lang);
      if (!given) return false;
      return accepted(entry, lang).some(answer => normalize(answer, lang) === given);
    }

    /* A shared spelling makes either meaning right: shown 쓰다, "to write"
       and "to wear" both are. A shared meaning does not make either word
       right; that is otherWordMeant's retake. */
    function check(entry, direction, input) {
      if (checkIn(entry, direction.answerLang, input)) return true;
      if (direction.answerLang !== "en") return false;
      const shown = wordIn(entry, direction.promptLang);
      return all.some(other => other !== entry && wordIn(other, direction.promptLang) === shown
        && checkIn(other, "en", input));
    }

    function otherWordMeant(entry, direction, input) {
      if (direction.promptLang !== "en" || direction.answerLang === "en") return null;
      if (checkIn(entry, direction.answerLang, input)) return null;
      const meaning = normalize(entry.en, "en");
      return all.find(other => other.id !== entry.id
        && normalize(other.en, "en") === meaning
        && checkIn(other, direction.answerLang, input)) || null;
    }

    return { wordIn, accepted, check, otherWordMeant };
  }

  return { create, normalize };
}));
