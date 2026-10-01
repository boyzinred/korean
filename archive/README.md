# Archive

Pages that are no longer part of the study rotation, kept whole rather than
deleted. Nothing here is linked from `index.html` any more, but every file still
works: open one directly and it loads, because its relative links were rewritten
to point up one level (`../shared-vocab/…`, `../index.html`). GitHub Pages
uploads the whole repository, so the old URLs keep resolving under `/archive/`.

The Bab series and the first TOPIK I pages were archived on 23 September 2026;
the TOPIK II pages and the conjugation and numbers practice on 1 October 2026.

## What is here

- `tutoring-bab1.html` … `tutoring-bab20.html` — the 20-lesson Bab textbook
  series. Each lesson holds a vocabulary bank with a single quiz over all of its
  words, one section per grammar point with meaning, form and notes, and typed
  or multiple-choice translation exercises built from the lesson's own
  vocabulary.
- `tutoring-topik-i-vocab.html` — the first TOPIK I vocabulary page. Superseded
  by `tutoring-topik-i-word-bank.html`, which holds the same level in 1,358
  headwords over 27 study days.
- `tutoring-topik-i-grammar.html` — TOPIK I grammar, 32 drills generated from
  the shared vocabulary.
- `tutoring-topik-ii-level-{3,4,5}-{vocab,grammar}.html` — TOPIK II reference
  vocabulary and generated grammar drills by level. The vocabulary pages are
  still read by `shared-vocab/build-shared-vocab.js`, and the grammar pages by
  `test-grammar-templates.js`, here where they sit.
- `tutoring-topik-1500-vocab.html` — the TOPIK II 1,500-word bank. Its stars
  are still in the browser under `topik2000FamiliarityV1`.
- `conjugation-practice.html`, `numbers-practice.html` — the helper drills for
  verb and adjective conjugation and for choosing a number system.

## Bringing one back

Move it up a directory, put its relative links back (`"../` → `"./`), and add a
row to the `PAGES` array in `index.html`.

## What they still depend on

`shared-vocab/shared-vocab.js`, `word-notes.js`, `korean-grammar.js` and
`grammar-templates.js` — all still live, all still used by pages in the
rotation. None of them may be removed on the grounds that only the archive
reads them without checking the pages above the directory first.
