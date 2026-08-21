# Shared Korean Vocabulary - Integration Guide

## Files

- `shared-vocab.js` - browser-ready shared vocabulary library for your HTML lessons.
- `shared-vocab.json` - the same records as plain JSON, useful for Supabase or build scripts.
- `shared-vocab.csv` - editable/importable table.
- `build-shared-vocab.js` - regenerates all three from the repository's own pages.
- `verify-shared-vocab.js` - checks the invariants the exercise menus rely on.
- `korean-grammar.js` - conjugation, particles, and modifier forms for building sentences from any entry.
- `grammar-templates.js` - one sentence generator per TOPIK II grammar form, keyed by the form string.
- `test-korean-grammar.js` / `test-grammar-templates.js` - test suites for the two above.
- `test-romanization.js` - checks that every page follows the one romanization rule.
- `test-conjugation-audit.js` - runs every grammar form over every verb and adjective and rejects malformed output.

Version **1.2.0** contains **1,841 unique Korean headwords and expressions** across **35 sources**: Bab 1-20, the four TOPIK vocabulary reference pages, the ten practice tests in the multiple-choice test library, and the extra TOPIK core word list.

## Rebuilding

```bash
node shared-vocab/build-shared-vocab.js
```

The script reads `shared-vocab.csv` as its curated base and re-derives every file-backed source by re-reading the pages themselves:

| Input page | Source ids produced |
| --- | --- |
| `tutoring-topik-i-vocab.html` | `topik1-vocab` |
| `tutoring-topik-ii-level-3-vocab.html` | `topik2-level3-vocab` |
| `tutoring-topik-ii-level-4-vocab.html` | `topik2-level4-vocab` |
| `tutoring-topik-ii-level-5-vocab.html` | `topik2-level5-vocab` |
| `tutoring-topik-multiple-choice-test-library.html` | `test-<test id>` (10 of them) |
| `lessons` column of the base CSV, plus `BAB20_LOCAL_VOCAB` in `tutoring-bab20.html` | `bab01` … `bab20` |
| base CSV | `topik-core` |

Test-library membership is detected by decomposing every Korean chunk in a test's prompts, options, and tables into jamo and prefix-matching it against every headword and verb/adjective stem in the dataset, so inflected forms (`갑니다`, `왔어요`, `피곤해서`) resolve back to their base word.

Part of speech and category for words the script discovers are inferred, then corrected by the `WORD_OVERRIDES` table near the top of the script. Corrections there apply on every run, including to words already committed to the CSV.

## Data shape

```js
{
  id: "kv0001",
  korean: "하다",
  romanization: "ha-da",
  english: "to do",
  partOfSpeech: "verb",
  topikLevel: 1,
  category: "daily-life-actions",
  labels: ["daily-life-actions"],
  lessons: ["bab03", "bab06", "bab12", ...],
  sources: ["bab03", "bab06", ..., "test-intermediate-1", ..., "topik-core"],
  primarySource: "bab03",
  sourceGroup: "bab",
  sourceType: "workbook+topik"
}
```

`lessons` is reserved for Bab lesson selection. `sources` records **every** source a word was found in — a duplicate headword stays one record and only its source array grows.

## One source per word

`sources` is intentionally multi-valued, but a menu should never offer the same word twice. `primarySource` is the single source a word is listed under. Duplicates resolve in registry order:

1. **TOPIK vocabulary lists** — `topik1-vocab`, `topik2-level3-vocab`, `topik2-level4-vocab`, `topik2-level5-vocab`
2. **Bab lessons** — `bab01` … `bab20`
3. **TOPIK practice tests** — `test-intermediate-1` … `test-topik-ii-level-3-practice-2`
4. **Extra TOPIK core list** — `topik-core`

A lesson page needs to own the words it teaches, so `primarySourceOf` takes a `prefer` argument that wins ahead of the registry order:

```js
KoreanVocab.primarySourceOf(entry);            // global priority
KoreanVocab.primarySourceOf(entry, "bab03");   // Bab 3 keeps its own vocabulary
```

Every Bab page (1-20) passes its own id, which is why each Bab's source bucket holds that lesson's complete word list while still listing every other word exactly once.

`bucketBySource` builds the whole partition in one call:

```js
const buckets = KoreanVocab.bucketBySource(KoreanVocab.DATA, "bab03");
// Map: sourceId -> entries, every entry appearing in exactly one bucket
```

## Source registry

```js
KoreanVocab.SOURCES;            // [{ id, label, group, file }] in priority order
KoreanVocab.SOURCE_GROUPS;      // [{ id, label, description, priority }]
KoreanVocab.listSources();      // same, each with a `count`
KoreanVocab.listSources("bab"); // only one group
KoreanVocab.sourceInfo("bab03");
KoreanVocab.groupOf("test-reading-20");   // "topik-test"
KoreanVocab.forSource("topik2-level4-vocab");
```

## Selecting words

```js
const vocab = KoreanVocab.toLessonVocab(
  KoreanVocab.select({ lessons: ["bab20"] })
);
```

`bab1` and `bab01` are both accepted, although the zero-padded form is preferred.

`select` matches OR within a dimension and AND across dimensions:

```js
KoreanVocab.select({
  sources: ["topik2-level4-vocab", "topik2-level5-vocab"],
  labels: ["body-health"],
  levels: [4, 5]
});
```

Pass `primaryOnly: true` (with an optional `prefer`) to select by the single listed source rather than by any source — this is what an exercise menu wants, because the counts then sum to the pool size with no double counting:

```js
KoreanVocab.select({
  sources: ["bab03", "topik1-vocab"],
  primaryOnly: true,
  prefer: "bab03"
});
```

`sourceGroups` filters by group and honours `primaryOnly` the same way:

```js
KoreanVocab.select({ sourceGroups: ["topik-vocab"], primaryOnly: true });
```

## Romanization

```js
const romanizeKorean = KoreanVocab.romanize;
const r = v.romanization || KoreanVocab.romanize(v.korean);
```

Every jamo is transcribed and syllables are joined with dashes. A consonant
with two values takes the first in the onset and the second in the coda.

| ㄱ g/k | ㄴ n | ㄷ d/t | ㄹ r/l | ㅁ m | ㅂ b/p | ㅅ s | ㅇ –/ng | ㅈ j | ㅊ ch | ㅋ k | ㅌ t | ㅍ p | ㅎ h |
| ㄲ gg/kk | ㄸ dd/tt | ㅃ bb/pp | ㅆ ss | ㅉ jj |
| ㅏ a | ㅑ ya | ㅓ eo | ㅕ yeo | ㅗ o | ㅛ yo | ㅜ u | ㅠ yu | ㅡ eu | ㅣ i |
| ㅐ ae | ㅒ yae | ㅔ e | ㅖ ye | ㅘ oa | ㅙ oae | ㅚ oi | ㅝ ueo | ㅞ ue | ㅟ ui | ㅢ eui |

No pronunciation changes are applied — no liaison, no tensing, no assimilation:

```
직업   jik-eop      (not ji-geop)
습관   seup-goan    (not seup-kkwan)
책임감 chaek-im-gam (not chae-gim-gam)
환경   hoan-gyeong  (not hwan-gyeong)
꽃     ggoch        넓다  neolp-da     의사  eui-sa
```

The `romanization` field is always re-derived by the build, never carried over
from the CSV, so the whole dataset follows this one rule. Quiz pages show the
dashes but compare answers with every non-letter stripped, so `an-nyeong`,
`an nyeong`, and `annyeong` are all accepted.

Run `node shared-vocab/test-romanization.js` to check the rule across the
shared library, every romanization stored in a page, and each page's own
transcription table.

## Levels

Levels 1-3 come from the original TOPIK A/B ranking. Levels 4 and 5 mark words introduced by the TOPIK II level 4 and level 5 vocabulary references. They are selection aids, not official per-word TOPIK certifications.

## Useful API calls

```js
KoreanVocab.find("쌀국수");
KoreanVocab.forLesson("bab20");
KoreanVocab.forSource("test-reading-20");
KoreanVocab.primarySourceOf(entry, "bab07");
KoreanVocab.bucketBySource(KoreanVocab.DATA, "bab07");
KoreanVocab.listLessons();
KoreanVocab.listSources();
KoreanVocab.listSourceGroups();
KoreanVocab.listLabels();
KoreanVocab.validate();
KoreanVocab.DATA;
KoreanVocab.META;
```

## Minimal lesson patch

```html
<script src="./shared-vocab/shared-vocab.js?v=1.2.0"></script>
<script>
  const romanizeKorean = KoreanVocab.romanize;

  const LESSON = {
    // Keep the rest of the existing lesson fields.
    vocab: KoreanVocab.toLessonVocab(
      KoreanVocab.select({ lessons: ["bab20"] })
    )
  };
</script>
```

## Generating sentences

`korean-grammar.js` conjugates any dictionary-form verb or adjective, including
the ㅂ/ㄷ/ㅅ/ㄹ/르/으/ㅎ irregular classes:

```js
KoreanGrammar.politeEnding("춥다");         // 추워요
KoreanGrammar.pastPolite("듣다");           // 들었어요
KoreanGrammar.formalPresent("만들다");       // 만듭니다
KoreanGrammar.attachEu("살다", "(으)면");    // 살면
KoreanGrammar.attachEu("살다", "(으)니까");  // 사니까
KoreanGrammar.modifier("살다");              // 사는
KoreanGrammar.topic("학생");                 // 학생은
```

ㄹ-stems keep their ㄹ before 으-endings and drop it only before ㄴ/ㅂ/ㅅ, and the
ㅂ/ㄷ irregulars stay hidden before consonant endings (춥습니다, not 추웁니다).

Irregularity is decided by rule, not by a word list: a stem ending in ㅂ, ㄷ, ㅅ,
or ㅎ is irregular unless it is a known regular one, so a word the code has
never seen still conjugates correctly (어둡다 → 어두운, 어두워요). The regular
lists are matched as suffixes so compounds inherit their base (내놓다 follows
놓다). 있다/없다 and anything built on them take 는/던/을 in front of a noun
(재미있는, never 재미있은).

`node shared-vocab/test-conjugation-audit.js` runs every form over all 520
predicates in the vocabulary and over every grammar template, and fails on any
irregular stem left unchanged before a vowel ending.

`grammar-templates.js` turns a grammar form plus a vocabulary pool into a
sentence. It picks the slots itself and never reuses a word within one sentence:

```js
const slots = GrammarTemplates.fillSlots("-(으)면서", pool);
GrammarTemplates.build("-(으)면서", slots);
// { korean: "음악을 들으면서 공부해요.", english: "I study while listening." }
```

`GrammarTemplates.slotsFor(form)` reports what a form needs and
`GrammarTemplates.fillsSlot(entry, slot)` says whether a word can fill it. The
grammar pages use both to tell the learner when the selected sources are too
narrow for a grammar point.

Run `node shared-vocab/test-korean-grammar.js` and
`node shared-vocab/test-grammar-templates.js` after touching either file.
