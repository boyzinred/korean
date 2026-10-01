/*
  review-banks.js
  ----------------------------------------------------------------------------
  Every word bank on the site, read for progress-review.html.

  The word lists live in their own pages, and each page works its words out in
  code of its own: the Tue-Wed list is sorted by level and cut into thirties,
  the reading banks find each story's words by scanning the passages, the
  TOPIK I bank numbers its homographs. Copying any of that here would drift the
  first time a class adds words, so this file copies none of it. Each page
  marks the part that builds its words and its groupings:

      /* review-bank:start … *\/
      …the word data, the code that builds WORDS, and refGroups…
      /* review-bank:end *\/

  and the review page fetches the page, runs the marked code on its own, and
  takes what it needs from the result. The marked code must not touch the DOM
  or the page's other variables; shared-vocab/test-review-banks.js checks that
  every page's blocks still run and still yield words.

  A word's id here is the page's own id, so a star read or written by the
  review is the same star the page shows, in the same localStorage key.

  API
    ReviewBanks.BANKS                     the banks, in the order the review lists them
    ReviewBanks.extract(html)             the marked code of a page, joined
    ReviewBanks.build(bank, html, opts)   -> { words, modes }
        words  [{ id, ko, en, ro, usage, koAlts }]
        modes  [{ id, label, groups: [{ id, label, ids }] }]
        opts.window    the object the marked code sees as `window`
        opts.Function  the Function constructor to run it with
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ReviewBanks = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* The class pages and the reading banks all end their blocks the same way,
     with BANK_WORDS, REF_MODES, REF_MODE_LABELS and refGroups(mode), whose
     groups are { id, label, words }. */
  const STANDARD = "{ words: BANK_WORDS, modes: REF_MODES, modeLabels: REF_MODE_LABELS, groups: refGroups }";

  function standard(raw) {
    return {
      words: raw.words,
      modes: raw.modes.map(mode => ({
        id: mode,
        label: raw.modeLabels[mode] || mode,
        groups: raw.groups(mode).map(group => ({
          id: group.id,
          label: group.label,
          words: group.words
        }))
      }))
    };
  }

  const plain = word => ({
    id: word.id,
    ko: word.ko,
    en: word.en,
    usage: word.usage || ""
  });

  const BANKS = [
    {
      id: "topik-i",
      title: "TOPIK I Word Bank",
      href: "tutoring-topik-i-word-bank.html",
      starKey: "topikIFamiliarityV2",
      scripts: ["shared-vocab/topik-vocab-topik-i.js"],
      exports: "{ BANK, USED_POS, DAYS }",
      /* The page builds its groups as HTML for its own tables, so the review
         groups the same words the same two ways here, from the same lists. */
      shape: raw => ({
        words: raw.BANK,
        modes: [
          {
            id: "pos",
            label: "Part of speech",
            groups: raw.USED_POS.map(group => ({
              id: "pos-" + group.id,
              label: group.label + " · " + group.korean,
              words: raw.BANK.filter(word => word.partOfSpeech === group.id)
            }))
          },
          {
            id: "day",
            label: "Study day",
            groups: raw.DAYS.map(day => ({
              id: "day-" + day,
              label: "Day " + day,
              words: raw.BANK.filter(word => word.day === day)
            }))
          }
        ]
      }),
      /* Auxiliary verbs are glossed as their pattern, and the page quizzes the
         pattern, so the review asks for what the page asks for. */
      word: word => ({
        id: word.id,
        ko: word.shownKorean,
        en: word.shownMeaning,
        ro: word.shownRomanization,
        usage: "",
        koAlts: word.korean_alts || []
      })
    },
    {
      id: "tue-wed",
      title: "Tue-Wed Korean",
      href: "tue-wed-korean.html",
      starKey: "koreanTueWedFamiliarity:v1",
      exports: STANDARD,
      shape: standard,
      word: word => Object.assign(plain(word), { usage: word.sentence || "" })
    },
    {
      id: "moon",
      title: "문지현",
      href: "soongsil-moon-ji-hyeon.html",
      starKey: "koreanMoonFamiliarity:v1",
      exports: STANDARD,
      shape: standard,
      word: plain
    },
    {
      id: "kang",
      title: "강태홍",
      href: "soongsil-kang-tae-hong.html",
      starKey: "koreanKangFamiliarity:v1",
      exports: STANDARD,
      shape: standard,
      word: plain
    },
    {
      id: "engineering",
      title: "공학 학술한국어",
      href: "soongsil-advanced-korean-for-engineering.html",
      starKey: "koreanEngineeringFamiliarity:v1",
      exports: STANDARD,
      shape: standard,
      word: plain
    },
    {
      id: "htsk-1",
      title: "HowToStudyKorean Unit 1",
      href: "howtostudykorean-unit-1.html",
      starKey: "koreanHtskFamiliarity:u1:v2",
      exports: STANDARD,
      shape: standard,
      word: plain
    },
    {
      id: "reading-1",
      title: "Reading · Grade 1",
      href: "reading-comprehension-grade-1.html",
      starKey: "koreanReadingFamiliarity:v2",
      scripts: ["shared-vocab/reading-vocab.js"],
      exports: STANDARD,
      shape: standard,
      word: plain
    },
    {
      id: "reading-2",
      title: "Reading · Grade 2",
      href: "reading-comprehension-grade-2.html",
      starKey: "koreanReadingFamiliarity:g2:v2",
      scripts: ["shared-vocab/reading-vocab.js", "shared-vocab/reading-vocab-2.js"],
      exports: STANDARD,
      shape: standard,
      word: plain
    }
  ];

  const BLOCK = /\/\*\s*review-bank:start[\s\S]*?\*\/([\s\S]*?)\/\*\s*review-bank:end\s*\*\//g;

  function extract(html) {
    const parts = [];
    let match;
    BLOCK.lastIndex = 0;
    while ((match = BLOCK.exec(html))) parts.push(match[1]);
    return parts.join("\n");
  }

  /* The site's literal romanization, for the banks that do not store one. */
  const INITIALS = ["g", "gg", "n", "d", "dd", "r", "m", "b", "bb", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
  const MEDIALS = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "oa", "oae", "oi", "yo", "u", "ueo", "ue", "ui", "yu", "eu", "eui", "i"];
  const FINALS = ["", "k", "kk", "ks", "n", "nj", "nh", "t", "l", "lk", "lm", "lp", "ls", "lt", "lp", "lh", "m", "p", "ps", "s", "ss", "ng", "j", "ch", "k", "t", "p", "h"];

  function romanize(text) {
    let out = "";
    let prev = false;
    for (const ch of String(text ?? "")) {
      const code = ch.codePointAt(0) - 0xAC00;
      if (code >= 0 && code <= 0xD7A3 - 0xAC00) {
        out += (prev ? "-" : "") + INITIALS[Math.floor(code / 588)]
          + MEDIALS[Math.floor((code % 588) / 28)] + FINALS[code % 28];
        prev = true;
      } else {
        out += ch;
        prev = false;
      }
    }
    return out;
  }

  function build(bank, html, options) {
    const settings = options || {};
    const code = extract(html);
    if (!code.trim()) throw new Error(bank.href + " has no review-bank block");
    const Ctor = settings.Function || Function;
    const run = new Ctor("window", '"use strict";\n' + code + "\nreturn " + bank.exports + ";");
    const shaped = bank.shape(run(settings.window || (typeof window !== "undefined" ? window : {})));

    const seen = new Set();
    const words = [];
    shaped.words.forEach(source => {
      const word = bank.word(source);
      if (!word.id || seen.has(word.id)) return;
      seen.add(word.id);
      word.ro = word.ro || romanize(word.ko);
      word.koAlts = word.koAlts || [];
      words.push(word);
    });

    /* A word several stories share is listed under each of them; a group
       holds each id once. */
    const modes = shaped.modes.map(mode => ({
      id: mode.id,
      label: mode.label,
      groups: mode.groups
        .map(group => ({
          id: group.id,
          label: group.label,
          ids: [...new Set(group.words.map(source => bank.word(source).id))].filter(id => seen.has(id))
        }))
        .filter(group => group.ids.length)
    }));

    return { words, modes };
  }

  return { BANKS, extract, build, romanize };
}));
