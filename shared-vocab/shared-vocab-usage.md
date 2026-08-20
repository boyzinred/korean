# Shared Korean Vocabulary - Integration Guide

## Files

- `shared-vocab.js` - browser-ready shared vocabulary library for your HTML lessons.
- `shared-vocab.json` - the same records as plain JSON, useful for Supabase or build scripts.
- `shared-vocab.csv` - editable/importable table.

Version **1.1.0** contains **1,737 unique Korean headwords and useful expressions**. It now covers **Bab 1-20**, the two attached TOPIK vocabulary/romanization references, and the attached TOPIK practice/reading files.

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
  lessons: ["bab03", "bab06", ...],
  sources: ["bab03", "topik-core", ...],
  sourceType: "workbook+topik"
}
```

`lessons` is reserved for Bab lesson selection. `sources` records every lesson, reference, or practice file in which a word was found. A duplicate Korean headword remains one record; only its source arrays are expanded.

## Load the library

Place `shared-vocab.js` beside the lesson HTML files and load it before the lesson's main script:

```html
<script src="./shared-vocab.js?v=1.1.0"></script>
<script>
  // Existing LESSON object and app code follow.
</script>
```

## Use one Bab lesson

```js
const vocab = KoreanVocab.toLessonVocab(
  KoreanVocab.select({ lessons: ["bab20"] })
);
```

`bab1` and `bab01` are both accepted, although the zero-padded form is preferred.

## Select by attached source file

```js
const words = KoreanVocab.select({
  sources: ["topik1-reading-practice-4"]
});
```

Several sources use OR/any matching by default:

```js
const words = KoreanVocab.select({
  sources: [
    "topik1-intermediate-2",
    "topik2-level3-practice-2"
  ]
});
```

Available IDs and file names can be inspected at runtime:

```js
KoreanVocab.listSources();
```

## Combine source and semantic filters

Different dimensions use AND matching:

```js
const words = KoreanVocab.select({
  sources: ["bab20"],
  labels: ["food-drink"],
  levels: [1, 2]
});
```

TOPIK Level 3 academic or workplace vocabulary from the attached reference:

```js
const words = KoreanVocab.select({
  sources: ["topik2-level3-romanization"],
  levels: [3]
});
```

## Mix lesson vocabulary with extra TOPIK vocabulary

```js
const lessonWords = KoreanVocab.forLesson("bab20");
const extraWords = KoreanVocab.select({
  sources: ["topik1-intermediate-reading-1"],
  labels: ["food-drink", "transport-directions"]
});

const exerciseVocab = KoreanVocab.toLessonVocab(
  KoreanVocab.merge(lessonWords, extraWords)
);
```

## Romanization

```js
const romanizeKorean = KoreanVocab.romanize;
const r = v.romanization || KoreanVocab.romanize(v.korean);
```

The function follows the requested literal transcription system, separates Hangul syllables with hyphens, and does not apply pronunciation changes.

## Useful API calls

```js
KoreanVocab.find("쌀국수");
KoreanVocab.forLesson("bab20");
KoreanVocab.forSource("topik2-level3-practice-2");
KoreanVocab.listLessons();
KoreanVocab.listSources();
KoreanVocab.listLabels();
KoreanVocab.validate();
KoreanVocab.DATA;
```

## Source IDs added in this version

```text
bab20
topik1-grammar-vocab-romanization
topik2-level3-romanization
topik2-level3-practice-2
topik1-intermediate-reading-1
topik1-intermediate-1
topik1-intermediate-2
topik1-intermediate-3
topik1-reading-practice-1
topik1-reading-practice-2
topik1-reading-practice-3
topik1-reading-practice-4
```

## Minimal Bab 20 patch

```html
<script src="./shared-vocab.js?v=1.1.0"></script>
<script>
  const romanizeKorean = KoreanVocab.romanize;

  const LESSON = {
    // Keep the rest of the existing Bab 20 fields.
    vocab: KoreanVocab.toLessonVocab(
      KoreanVocab.select({ lessons: ["bab20"] })
    )
  };
</script>
```
