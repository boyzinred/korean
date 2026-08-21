# Korean Vocab and Grammar Practice Hub

A static, GitHub Pages-hosted site of self-contained HTML lessons and quiz tools for studying Korean vocabulary and grammar (TOPIK I/II reference material plus a 20-lesson "Bab" textbook series). No build step, backend, or framework — every page is a single HTML file with inline CSS/JS that runs entirely client-side.

## Structure

- `index.html` — landing page / directory. Renders a card grid of every lesson page from a `PAGES` array (grouped into "TOPIK I", "TOPIK II", "Lessons", "Helper exercises"), with collapsible sections, a jump-to-section TOC, and light/dark theme toggle (persisted in `localStorage`).
- `tutoring-bab1.html` … `tutoring-bab20.html` — the 20-lesson Bab textbook series. Each lesson has a vocab bank (single quiz covering all lesson words), grammar-point sections with meaning/form/notes and example sentences, and matching translation exercises.
- `tutoring-topik-i-vocab.html` / `tutoring-topik-i-grammar.html` — TOPIK I reference vocabulary and grammar practice. The grammar page generates its sentences from shared vocabulary.
- `tutoring-topik-ii-level-{3,4,5}-{vocab,grammar}.html` — TOPIK II reference material by level.
- `tutoring-topik-multiple-choice-test-library.html` — library of TOPIK-style multiple-choice practice tests.
- `numbers-practice.html` — dedicated exercise for choosing the correct Korean number system (native vs. Sino-Korean).
- `conjugation-practice.html` — verb/adjective conjugation drills.
- `korean-ui-design-system.md` — the shared design system spec (colors, typography, spacing, component rules) that every page's inline CSS follows, so all pages look and behave consistently.
- `shared-vocab/` — a shared vocabulary library (`shared-vocab.js`, `.json`, `.csv`) with ~1,840 Korean headwords tagged by lesson, source file, TOPIK level, and category; lesson pages load `shared-vocab.js` and pull word sets via a small selection API (`select`, `forLesson`, `forSource`, `primarySourceOf`, `bucketBySource`, `merge`, `romanize`, etc.). Regenerate it with `node shared-vocab/build-shared-vocab.js` and check it with `node shared-vocab/verify-shared-vocab.js`. See `shared-vocab/shared-vocab-usage.md` for the integration guide.

## Features

- **Vocabulary source picker** (Bab 1–20 and all four TOPIK grammar pages): each exercise menu lists every vocabulary source — the four TOPIK vocabulary references, all 20 Bab lessons, the ten practice tests, and the extra TOPIK core list — grouped and individually selectable, on top of the existing word-type and category tree. A word that appears in several places is listed under exactly one source, resolved as this Bab → TOPIK vocabulary lists → other Bab lessons → practice tests → extra core list, so the per-source counts always add up to the pool size. The default selection is the current lesson on a Bab page, and the four TOPIK vocabulary lists on a TOPIK grammar page.
- **One exercise per grammar point** (all four TOPIK grammar pages): a single translation exercise whose mode — typed or multiple choice — is chosen in the setup menu, the way the Bab lessons work, instead of two separate cards. On the TOPIK II pages a **Sentences** control switches between sentences generated from the chosen vocabulary and the lesson's own example sentences; the vocabulary picker hides itself when the lesson examples are selected. The Grammar Bank at the top of each page is collapsible.
- **Generated grammar practice**: `tutoring-topik-i-grammar.html` builds all 32 of its drills from the chosen vocabulary, and the TOPIK II level 3/4/5 pages can generate fresh sentences for any of their grammar points. Sentences are conjugated by `shared-vocab/korean-grammar.js` (batchim, the ㅂ/ㄷ/ㅅ/ㄹ/르/으/ㅎ irregulars, modifier forms, particles) and shaped by a per-form template in `shared-vocab/grammar-templates.js`. When the selected sources cannot supply a grammar point's slots the menu says so and blocks the start button.
- **Exercise setup menu** on every quiz: choose question count, question/answer language (English, romanization, or Korean), typed vs. multiple-choice mode, "repeat question if wrong," and an optional timer — with a question preview before starting and an "end exercise early" option mid-run.
- **Vocab assistant / hints** with graduated reveal levels and an answer-reveal option; missed or looked-up words are collected into a personalized vocabulary review at the end of each exercise.
- **Typed-answer keyboard flow**: Enter checks the answer, Enter again advances, and focus returns to the input automatically (desktop and mobile).
- **Literal romanization system**, one rule across every page: each jamo is transcribed, syllables are joined with dashes, and a consonant with two values takes the first in the onset and the second in the coda. No pronunciation changes are applied, so `직업` is `jik-eop` (not `ji-geop`) and `습관` is `seup-goan` (not `seup-kkwan`). Answers are compared with the dashes stripped, so `an-nyeong` and `annyeong` both count.
  | ㄱ g/k | ㄴ n | ㄷ d/t | ㄹ r/l | ㅁ m | ㅂ b/p | ㅅ s | ㅇ –/ng | ㅈ j | ㅊ ch | ㅋ k | ㅌ t | ㅍ p | ㅎ h |
  | ㄲ gg/kk | ㄸ dd/tt | ㅃ bb/pp | ㅆ ss | ㅉ jj |
  | ㅏ a | ㅑ ya | ㅓ eo | ㅕ yeo | ㅗ o | ㅛ yo | ㅜ u | ㅠ yu | ㅡ eu | ㅣ i |
  | ㅐ ae | ㅒ yae | ㅔ e | ㅖ ye | ㅘ oa | ㅙ oae | ㅚ oi | ㅝ ueo | ㅞ ue | ㅟ ui | ㅢ eui |

  Enforced by `node shared-vocab/test-romanization.js`, which checks the shared library, every romanization stored in a page, and each page's own transcription table.
- **Light/dark theme**, collapsible sections, and scroll-position memory, implemented identically across all pages per the shared design system.

# TODO
- add TOPIK II 3급  2 to topik library
  
# FINISHED TASKS
AUGUST 21, 2026
- shared vocab now covers the 4 TOPIK vocab files and the multiple-choice test library (1,841 headwords, 35 sources)
- shared vocab is regenerated by a script instead of edited by hand
- bab1-20 exercise menus: replaced "only this bab / all relevant words" with a per-source picker, one source per word
- bab20 vocab moved off its page-local fallback list and into shared vocab (186 lesson words)
- korean conjugation engine and per-grammar-form sentence templates added under shared-vocab/
- topik-i-grammar now generates from shared vocab instead of its own 80-word bank
- topik-ii level 3/4/5 grammar: a generated exercise per grammar point, with the source picker
- all topik grammar pages: collapsible grammar bank, and one translation exercise per grammar point with a typed/multiple-choice mode selector instead of two separate exercises
- one literal romanization everywhere: ㄲ/ㄸ/ㅃ now gg/dd/bb in the onset, ㅘ/ㅙ/ㅚ/ㅝ/ㅞ/ㅟ/ㅢ now oa/oae/oi/ueo/ue/ui/eui, no liaison or tensing; romanization answers are checked without dashes
- fixed irregular conjugation across the site: bab pages decided ㅂ/ㄷ/ㅅ irregularity from a short allowlist, so words outside it came out wrong (어둡은, 어둡어요). Irregularity is now decided by rule and bab2-10 share the one tested engine; 있다/없다 take 는/던/을 before a noun

AUGUST 10, 2026
- TOPIK 1 VOCAB fixes:
  - add a "repeat question if wrong" option in menus
  - be able to choose which sections to include in master quiz
  - update romanization
- helper exercise of which number system to use

AUGUST 6, 2026
- turn all babs into html files
  - no material exercises
  - lots of examples
  - batchim notes
  - dash/space is ignored internally
- update romanization file

AUGUST 4, 2026
- make big test for grammar file
- add more detailed batchim ending notes in relevant grammar points
- add batchim examples in relevant grammar points
- for both, space doesnt add dash / double space should add space
- if number of questions matches number of items, each item should be displayed once, same for twice, thrice, etc
- keep romanization literal with dashes in between syllables: ㄱ → g/k, ㄴ → n, ㄷ → d/t, ㄹ → r/l, ㅁ → m, ㅂ → b/p, ㅅ → s, ㅇ → silent/ng, ㅈ → j, ㅊ → ch, ㅋ → k, ㅌ → t, ㅍ → p, ㅎ → h, ㄲ → kk, ㄸ → tt, ㅃ → pp, ㅆ → ss, ㅉ → jj, ㅏ → a, ㅑ → ya, ㅓ → eo, ㅕ → yeo, ㅗ → o, ㅛ → yo, ㅜ → u, ㅠ → yu, ㅡ → eu, ㅣ → i, ㅐ → ae, ㅔ → e, ㅒ → yae, ㅖ → ye, ㅘ → oa, ㅝ → ueo, ㅟ → ui, ㅞ → ue, ㅙ → oae, ㅚ → oi, ㅢ → eui

- make bab files
  - use the TOPIK vocab html for extra vocab to make more variety in questions
  - use the grammar html as a guide to lay out the material. there are no actual notes or section markers in the material, but make your own sections and have an explanation (like in the grammar html). group all the vocab in the material into one vocab section at the top that is like a mini version of the vocab html (vocab bank with just 1 quiz for all the words). for the exercises for the grammar points, have typed/multiple choice translation exercises like in the grammar html, but also use the exercises in the material with the same menu ui before these exercises

- make a romanization file
  - translating korean characters into romanization using the literal interpration i mentione earlier
  - the page should just have one exercise where i can choose length of excerpt to translate into romanization. have same menu ui as other exercises from other files.
  - use excerpts from TOPIK resources
  
AUGUST 2, 2026
- for all files, typed answers should be able to press enter once to check answer and enter again to go to next question then focus cursor on answer field so i can immediately type again. on mobile, it should work the same
- tutoring-topik-i-grammar.html wont let me type english
- for grammar files, each grammar point section should include the rule (Meaning, form, and nuance) and 3 examples (one for each politeness level if relevant, if not then just 3 normal examples)
- for all exercises, have a "menu" screen before the user starts the exercise that allows them to choose X number of questions (with default N = number of vocab or 10 questions for grammar), what language they want the questions and answers to be in (english/romanization/korean), set a timer that ends the exercise when time is up (with default being untimed). also include a "end exercise early" button when the exercise starts so that users can see the summary feedback for questions theyve answered thus far.
- make sections collapsable in index.html
