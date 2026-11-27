/*
  answer-check.js
  ----------------------------------------------------------------------------
  How a typed vocabulary answer is marked, for pages that quiz words read
  through review-banks.js (study-quiz.html). The rules are progress-review's,
  which are the word bank pages' own:

    all          punctuation ignored (punctuationIn lists what was dropped,
                 for the feedback to say so)
    한국어        spacing counts; "아래/밑" accepts either half, and any
                 spelling the bank lists in koAlts
    한국어, English  an answer that is right but for its spacing is not
                 marked: spacingOff says so, and the page asks once more
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
      spacingOff(entry, direction, input) -> right but for the spaces
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

  /* Punctuation never counts, in any language: 봄·여름, "don't", "가요?" and
     "to go!" match 봄여름, "dont", 가요 and "to go". */
  const PUNCTUATION = /[\p{P}\p{S}]/gu;
  const APOSTROPHES = /['’‘`]/g;
  function normalize(text, lang) {
    const value = String(text || "").trim().toLowerCase().replace(APOSTROPHES, "").replace(PUNCTUATION, " ");
    if (lang === "ko" || lang === "ro") return value.replace(/\s+/g, "");
    return value.replace(/\s+/g, " ").trim();
  }
  /* With the spacing kept: punctuation is dropped or read as a space, so
     봄·여름 matches both 봄여름 and 봄 여름, and well-known both
     wellknown and well known. Romanization never counts its spaces. */
  function spaced(text, lang) {
    if (lang === "ro") return [normalize(text, lang)];
    const value = String(text || "").toLowerCase().replace(APOSTROPHES, "");
    return [...new Set([value.replace(PUNCTUATION, ""), value.replace(PUNCTUATION, " ")]
      .map(item => item.replace(/\s+/g, " ").trim()))];
  }
  function punctuationIn(text) {
    return [...new Set(String(text || "").match(/[\p{P}\p{S}]/gu) || [])].join(" ");
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

    /* loose: spaces ignored too, as they were before spacing counted. */
    function checkIn(entry, lang, input, loose) {
      const given = normalize(input, lang).replace(/\s+/g, "");
      if (!given) return false;
      if (loose) return accepted(entry, lang).some(answer => normalize(answer, lang).replace(/\s+/g, "") === given);
      const tries = spaced(input, lang);
      return accepted(entry, lang).some(answer => spaced(answer, lang).some(form => tries.includes(form)));
    }

    /* A shared spelling makes either meaning right: shown 쓰다, "to write"
       and "to wear" both are. A shared meaning does not make either word
       right; that is otherWordMeant's retake. */
    function check(entry, direction, input, loose) {
      if (checkIn(entry, direction.answerLang, input, loose)) return true;
      if (direction.answerLang !== "en") return false;
      const shown = wordIn(entry, direction.promptLang);
      return all.some(other => other !== entry && wordIn(other, direction.promptLang) === shown
        && checkIn(other, "en", input, loose));
    }

    function spacingOff(entry, direction, input) {
      return !check(entry, direction, input) && check(entry, direction, input, true);
    }

    /* Spacing aside: a slip in the spaces of the other word is still that
       word. */
    function otherWordMeant(entry, direction, input) {
      if (direction.promptLang !== "en" || direction.answerLang === "en") return null;
      if (checkIn(entry, direction.answerLang, input, true)) return null;
      const meaning = normalize(entry.en, "en");
      return all.find(other => other.id !== entry.id
        && normalize(other.en, "en") === meaning
        && checkIn(other, direction.answerLang, input, true)) || null;
    }

    return { wordIn, accepted, check, spacingOff, otherWordMeant };
  }

  return { create, normalize, punctuationIn };
}));
