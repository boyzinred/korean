#!/usr/bin/env node
/*
 * Rebuilds shared-vocab.js / shared-vocab.json / shared-vocab.csv from the
 * repository's own lesson and reference pages.
 *
 * Inputs
 *   shared-vocab.csv                             existing curated records (base)
 *   tutoring-topik-i-vocab.html                  TOPIK vocabulary reference
 *   tutoring-topik-ii-level-3-vocab.html         TOPIK vocabulary reference
 *   tutoring-topik-ii-level-4-vocab.html         TOPIK vocabulary reference
 *   tutoring-topik-ii-level-5-vocab.html         TOPIK vocabulary reference
 *   tutoring-topik-multiple-choice-test-library.html   practice tests
 *
 * Run: node shared-vocab/build-shared-vocab.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const HERE = __dirname;
const ROOT = path.resolve(HERE, "..");
const VERSION = "1.2.0";

// ---------------------------------------------------------------------------
// Hangul helpers
// ---------------------------------------------------------------------------
const CHO = ["g", "gg", "n", "d", "dd", "r", "m", "b", "bb", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const JUNG = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "oa", "oae", "oi", "yo", "u", "ueo", "ue", "ui", "yu", "eu", "eui", "i"];
const JONG = ["", "k", "kk", "ks", "n", "nj", "nh", "t", "l", "lk", "lm", "lp", "ls", "lt", "lp", "lh", "m", "p", "ps", "s", "ss", "ng", "j", "ch", "k", "t", "p", "h"];
const CHO_J = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const JUNG_J = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const JONG_J = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

const isSyllable = code => code >= 0xac00 && code <= 0xd7a3;

function romanize(text) {
  let out = "";
  let pending = [];
  const flush = () => { if (pending.length) { out += pending.join("-"); pending = []; } };
  for (const ch of String(text)) {
    const code = ch.charCodeAt(0);
    if (isSyllable(code)) {
      const i = code - 0xac00;
      pending.push(CHO[Math.floor(i / 588)] + JUNG[Math.floor((i % 588) / 28)] + JONG[i % 28]);
    } else {
      flush();
      out += ch;
    }
  }
  flush();
  return out;
}

function toJamo(text) {
  let out = "";
  for (const ch of String(text)) {
    const code = ch.charCodeAt(0);
    if (isSyllable(code)) {
      const i = code - 0xac00;
      out += CHO_J[Math.floor(i / 588)] + JUNG_J[Math.floor((i % 588) / 28)] + JONG_J[i % 28];
    } else out += ch;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Source registry
// ---------------------------------------------------------------------------
const SOURCE_GROUPS = [
  {
    id: "topik-vocab",
    label: "TOPIK vocabulary lists",
    description: "Curated word lists from the TOPIK vocabulary reference pages.",
    priority: 1
  },
  {
    id: "bab",
    label: "Bab lessons",
    description: "Vocabulary taught in the numbered workbook lessons.",
    priority: 2
  },
  {
    id: "topik-test",
    label: "TOPIK practice tests",
    description: "Words that appear in the multiple-choice test library.",
    priority: 3
  },
  {
    id: "topik-extra",
    label: "Extra TOPIK core list",
    description: "Beginner/intermediate core vocabulary that is not tied to any lesson or test.",
    priority: 4
  }
];

const TOPIK_VOCAB_FILES = [
  { id: "topik1-vocab", file: "tutoring-topik-i-vocab.html", label: "TOPIK I vocabulary", level: 1 },
  { id: "topik2-level3-vocab", file: "tutoring-topik-ii-level-3-vocab.html", label: "TOPIK II level 3 vocabulary", level: 3 },
  { id: "topik2-level4-vocab", file: "tutoring-topik-ii-level-4-vocab.html", label: "TOPIK II level 4 vocabulary", level: 4 },
  { id: "topik2-level5-vocab", file: "tutoring-topik-ii-level-5-vocab.html", label: "TOPIK II level 5 vocabulary", level: 5 }
];

const TEST_LIBRARY_FILE = "tutoring-topik-multiple-choice-test-library.html";
const LOCAL_LESSON_FILE = "tutoring-bab20.html";
const LOCAL_LESSON_CONST = "BAB20_LOCAL_VOCAB";
const LOCAL_LESSON_ID = "bab20";
const TEST_SOURCE_PREFIX = "test-";

// Lesson titles are curated data that lives only in the generated library, so
// carry them over from the previous build rather than restating them here.
const LESSON_TITLES = (() => {
  try {
    return require("./shared-vocab.js").LESSONS || {};
  } catch (error) {
    return {};
  }
})();

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABEL_NAMES = {
  "adverbs-connectors": "Adverbs & Connectors",
  "animals-nature": "Animals & Nature",
  "body-health": "Body & Health",
  "clothing-appearance": "Clothing & Appearance",
  "communication-media": "Communication & Media",
  "countries-languages": "Countries & Languages",
  "daily-life-actions": "Daily-Life Actions",
  "descriptions-qualities": "Descriptions & Qualities",
  "events-celebrations": "Events & Celebrations",
  "family-relationships": "Family & Relationships",
  "feelings-emotions": "Feelings & Emotions",
  "food-drink": "Food & Drink",
  "general-core": "General Core",
  "government-law": "Government & Law",
  "greetings-politeness": "Greetings & Politeness",
  "hobbies-sports": "Hobbies & Sports",
  "home-household": "Home & Household",
  "numbers-counters": "Numbers & Counters",
  "people-occupations": "People & Occupations",
  "places-buildings": "Places & Buildings",
  "questions-pronouns": "Questions & Pronouns",
  "school-study": "School & Study",
  "science-technology": "Science & Technology",
  "shopping-money": "Shopping & Money",
  "society-economy": "Society & Economy",
  "time-calendar": "Time & Calendar",
  "transport-directions": "Transport & Directions",
  "travel-movement": "Travel & Movement",
  "verbs-actions": "General Verbs & Actions",
  "weather-seasons": "Weather & Seasons",
  "work-business": "Work & Business"
};

// section id -> category, per TOPIK vocabulary file
const SECTION_CATEGORY = {
  "topik1-vocab": {
    "question-adverbs": "questions-pronouns",
    "actions-descriptive": "verbs-actions",
    "food-shopping-weather": "food-drink",
    "places-transportation": "places-buildings",
    "days-time": "time-calendar",
    "numbers": "numbers-counters",
    "family-members": "family-relationships",
    "greetings": "greetings-politeness",
    "personal-information-people": "people-occupations"
  },
  "topik2-level3-vocab": {
    "core-high-frequency": "general-core",
    "education": "school-study",
    "work": "work-business",
    "daily-life": "daily-life-actions",
    "common-verbs": "verbs-actions"
  },
  "topik2-level4-vocab": {
    "society-daily-life": "society-economy",
    "education-school": "school-study",
    "work-economy": "work-business",
    "feelings-personality": "feelings-emotions",
    "health": "body-health",
    "nature-environment": "animals-nature",
    "frequent-verbs": "verbs-actions",
    "frequent-adjectives": "descriptions-qualities",
    "common-expressions": "general-core"
  },
  "topik2-level5-vocab": {
    "core-vocabulary": "general-core",
    "common-collocations": "general-core",
    "society": "society-economy",
    "economy": "society-economy",
    "science-technology": "science-technology",
    "environment": "animals-nature",
    "education": "school-study",
    "government": "government-law",
    "health": "body-health",
    "writing-reading": "communication-media",
    "common-verbs": "verbs-actions"
  }
};

// Hand-checked part-of-speech and category corrections. Applied to inferred
// words at creation time and re-applied to every entry at the end of the build,
// so a correction still lands once the word is part of the committed CSV.
const WORD_OVERRIDES = {
  "어떻게": { partOfSpeech: "adverb" },
  "느리다": { partOfSpeech: "adjective", category: "descriptions-qualities" },
  "무엇/뭐": { partOfSpeech: "pronoun", category: "questions-pronouns" },
  "현금": { partOfSpeech: "noun", category: "shopping-money" },
  "초록색": { partOfSpeech: "noun", category: "descriptions-qualities" },
  "카페": { partOfSpeech: "noun", category: "places-buildings" },
  "이": { partOfSpeech: "numeral", category: "numbers-counters" },
  "미안합니다": { partOfSpeech: "expression" },
  "맞아요": { partOfSpeech: "expression" },
  "아니에요": { partOfSpeech: "expression" },
  "처음 뵙겠습니다": { partOfSpeech: "expression" },
  "반갑습니다": { partOfSpeech: "expression" },
  "성": { partOfSpeech: "noun" },
  "국적": { partOfSpeech: "noun" },
  "출근": { partOfSpeech: "noun" },
  "퇴근": { partOfSpeech: "noun" },
  "이사": { partOfSpeech: "noun" },
  "편리하다": { partOfSpeech: "adjective" },
  "불편하다": { partOfSpeech: "adjective" },
  "효과적이다": { partOfSpeech: "adjective" },
  "긍정적이다": { partOfSpeech: "adjective" },
  "부정적이다": { partOfSpeech: "adjective" },
  "공공": { partOfSpeech: "noun" },
  "자신감": { partOfSpeech: "noun" },
  "책임감": { partOfSpeech: "noun" },
  "인공지능": { partOfSpeech: "noun" },
  "과정": { partOfSpeech: "noun", category: "general-core" },
  // Filed under places by an earlier pass; it is a communication word.
  "표현": { partOfSpeech: "noun", category: "communication-media" },
  "지원하다": { partOfSpeech: "verb", category: "verbs-actions" },
  "판단하다": { partOfSpeech: "verb", category: "verbs-actions" }
};

// Vocabulary that only occurs inside the multiple-choice test library.
const TEST_LIBRARY_WORDS = [
  { korean: "휴대전화", english: "mobile phone", partOfSpeech: "noun", category: "communication-media", topikLevel: 2 },
  { korean: "채소", english: "vegetable", partOfSpeech: "noun", category: "food-drink", topikLevel: 2 },
  { korean: "취소", english: "cancellation", partOfSpeech: "noun", category: "general-core", topikLevel: 2 },
  { korean: "취소하다", english: "to cancel", partOfSpeech: "verb", category: "verbs-actions", topikLevel: 2 },
  { korean: "취소되다", english: "to be cancelled", partOfSpeech: "verb", category: "verbs-actions", topikLevel: 3 },
  { korean: "요금", english: "fee / fare", partOfSpeech: "noun", category: "shopping-money", topikLevel: 2 },
  { korean: "좌석", english: "seat", partOfSpeech: "noun", category: "places-buildings", topikLevel: 3 },
  { korean: "관람하다", english: "to view / to watch", partOfSpeech: "verb", category: "hobbies-sports", topikLevel: 3 },
  { korean: "규칙적이다", english: "to be regular", partOfSpeech: "adjective", category: "descriptions-qualities", topikLevel: 3 },
  { korean: "꾸준하다", english: "to be steady", partOfSpeech: "adjective", category: "descriptions-qualities", topikLevel: 3 },
  { korean: "꾸준히", english: "steadily", partOfSpeech: "adverb", category: "adverbs-connectors", topikLevel: 3 },
  { korean: "휴관", english: "closed day / closure", partOfSpeech: "noun", category: "places-buildings", topikLevel: 3 },
  { korean: "메모", english: "memo / note", partOfSpeech: "noun", category: "communication-media", topikLevel: 2 },
  { korean: "통화하다", english: "to talk on the phone", partOfSpeech: "verb", category: "communication-media", topikLevel: 2 },
  { korean: "계산", english: "calculation / payment", partOfSpeech: "noun", category: "shopping-money", topikLevel: 2 },
  { korean: "계산하다", english: "to calculate / to pay", partOfSpeech: "verb", category: "shopping-money", topikLevel: 2 },
  { korean: "취직하다", english: "to get a job", partOfSpeech: "verb", category: "work-business", topikLevel: 3 },
  { korean: "틀리다", english: "to be wrong", partOfSpeech: "verb", category: "verbs-actions", topikLevel: 2 },
  { korean: "끼다", english: "to wear (gloves, rings, glasses)", partOfSpeech: "verb", category: "clothing-appearance", topikLevel: 2 },
  { korean: "찌다", english: "to gain weight / to steam", partOfSpeech: "verb", category: "verbs-actions", topikLevel: 2 },
  { korean: "깨끗이", english: "cleanly / neatly", partOfSpeech: "adverb", category: "adverbs-connectors", topikLevel: 2 },
  { korean: "제", english: "my (humble)", partOfSpeech: "determiner", category: "questions-pronouns", topikLevel: 1 }
];

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') { if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length > 1);
}

function csvCell(value) {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ---------------------------------------------------------------------------
// Extract vocabulary from the TOPIK reference pages
// ---------------------------------------------------------------------------
function readSections(file) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8");
  const match = text.match(/const SECTIONS = (\[[\s\S]*?\]);\n/);
  if (!match) throw new Error(`SECTIONS array not found in ${file}`);
  return JSON.parse(match[1]);
}

function readLocalLessonVocab() {
  const text = fs.readFileSync(path.join(ROOT, LOCAL_LESSON_FILE), "utf8");
  const start = text.indexOf(`const ${LOCAL_LESSON_CONST}`);
  if (start < 0) return [];
  const open = text.indexOf("[", start);
  let depth = 0, end = -1;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "[") depth++;
    else if (text[i] === "]" && --depth === 0) { end = i; break; }
  }
  if (end < 0) throw new Error(`${LOCAL_LESSON_CONST} array is unterminated`);
  return JSON.parse(text.slice(open, end + 1));
}

function readTests() {
  const lines = fs.readFileSync(path.join(ROOT, TEST_LIBRARY_FILE), "utf8").split("\n");
  const start = lines.findIndex(l => /^\s*const TESTS = \[/.test(l));
  const end = lines.findIndex((l, i) => i > start && /^\s*\];\s*$/.test(l));
  if (start < 0 || end < 0) throw new Error("TESTS array not found in the test library");
  // eslint-disable-next-line no-eval
  return eval(lines.slice(start, end + 1).join("\n") + ";TESTS");
}

function testCorpus(tests) {
  const corpus = {};
  for (const test of tests) {
    const parts = [];
    for (const question of test.questions) {
      if (question.prompt) parts.push(question.prompt);
      if (question.instruction) parts.push(question.instruction);
      (question.options || []).forEach(option => parts.push(option));
      if (question.contextTable) parts.push(question.contextTable.flat().join(" "));
    }
    corpus[TEST_SOURCE_PREFIX + test.id] = parts.join("\n");
  }
  return corpus;
}

// ---------------------------------------------------------------------------
// Part-of-speech / category inference for words that are new to the dataset
// ---------------------------------------------------------------------------
const VERB_SUFFIX = /(하다|되다|시키다|지다)$/;

function inferPartOfSpeech(korean, english) {
  const override = WORD_OVERRIDES[korean];
  if (override && override.partOfSpeech) return override.partOfSpeech;
  if (korean.includes("~")) return "expression";
  if (/\s/.test(korean)) return /다$/.test(korean) ? "phrase" : "noun phrase";
  if (/다$/.test(korean)) {
    if (/^to /.test(english) || VERB_SUFFIX.test(korean)) return "verb";
    return "adjective";
  }
  if (/(습니다|어요|아요|에요|예요)$/.test(korean)) return "expression";
  return "noun";
}

function inferCategory(korean, sourceId, sectionId, partOfSpeech) {
  const override = WORD_OVERRIDES[korean];
  if (override && override.category) return override.category;
  const base = (SECTION_CATEGORY[sourceId] || {})[sectionId] || "general-core";
  if (base === "verbs-actions" && partOfSpeech === "adjective") return "descriptions-qualities";
  return base;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function build() {
  // 1. Base records from the curated CSV.
  const rows = parseCsv(fs.readFileSync(path.join(HERE, "shared-vocab.csv"), "utf8"));
  const header = rows[0];
  const base = rows.slice(1).map(row => {
    const rec = Object.fromEntries(header.map((h, i) => [h, row[i] ?? ""]));
    const legacy = rec.sources ? rec.sources.split("|").filter(Boolean) : [];
    return {
      id: rec.id,
      korean: rec.korean,
      // Romanization is always derived, never carried over, so the whole
      // dataset follows one transcription rule.
      romanization: romanize(rec.korean),
      english: rec.english,
      partOfSpeech: rec.partOfSpeech,
      topikLevel: Number(rec.topikLevel) || 1,
      category: rec.category,
      labels: rec.labels ? rec.labels.split("|").filter(Boolean) : [rec.category],
      lessons: rec.lessons ? rec.lessons.split("|").filter(Boolean) : [],
      sources: new Set(legacy.includes("topik-core") ? ["topik-core"] : [])
    };
  });

  const byKorean = new Map();
  base.forEach(entry => { if (!byKorean.has(entry.korean)) byKorean.set(entry.korean, entry); });
  const entries = [...byKorean.values()];

  // Every lesson word is sourced from its Bab lesson(s).
  entries.forEach(entry => entry.lessons.forEach(lesson => entry.sources.add(lesson)));

  const added = { topikVocab: 0, testLibrary: 0, lessonLocal: 0 };

  function addEntry(record) {
    const entry = {
      id: null,
      korean: record.korean,
      romanization: romanize(record.korean),
      english: record.english,
      partOfSpeech: record.partOfSpeech,
      topikLevel: record.topikLevel,
      category: record.category,
      labels: [record.category],
      lessons: [],
      sources: new Set()
    };
    byKorean.set(entry.korean, entry);
    entries.push(entry);
    return entry;
  }

  // 2. TOPIK vocabulary reference pages.
  for (const file of TOPIK_VOCAB_FILES) {
    for (const section of readSections(file.file)) {
      for (const item of section.items) {
        let entry = byKorean.get(item.korean);
        if (!entry) {
          const partOfSpeech = inferPartOfSpeech(item.korean, item.meaning);
          entry = addEntry({
            korean: item.korean,
            english: item.meaning,
            partOfSpeech,
            topikLevel: file.level,
            category: inferCategory(item.korean, file.id, section.id, partOfSpeech)
          });
          added.topikVocab++;
        }
        entry.sources.add(file.id);
      }
    }
  }

  // 3. Words that only appear in the multiple-choice test library.
  for (const word of TEST_LIBRARY_WORDS) {
    if (byKorean.has(word.korean)) continue;
    addEntry(word);
    added.testLibrary++;
  }

  // 3b. Bab 20's page carries its own vocabulary list, which predates the word
  //     being tracked here. Fold it in so the lesson owns everything it teaches.
  for (const word of readLocalLessonVocab()) {
    let entry = byKorean.get(word.korean);
    if (!entry) {
      entry = addEntry({
        korean: word.korean,
        romanization: word.romanization,
        english: word.english,
        partOfSpeech: word.partOfSpeech,
        topikLevel: word.topikLevel || 1,
        category: word.category
      });
      added.lessonLocal++;
    }
    if (!entry.lessons.includes(LOCAL_LESSON_ID)) entry.lessons.push(LOCAL_LESSON_ID);
    entry.lessons.sort();
    entry.sources.add(LOCAL_LESSON_ID);
  }

  // 4. Tag every entry that occurs in a practice test.
  const tests = readTests();
  const corpus = testCorpus(tests);
  const stemIndex = new Map();
  const addStem = (jamo, korean) => { if (jamo && jamo.length >= 2 && !stemIndex.has(jamo)) stemIndex.set(jamo, korean); };
  for (const entry of entries) {
    for (const variant of entry.korean.split("/")) {
      const word = variant.trim();
      if (!word) continue;
      addStem(toJamo(word), entry.korean);
      if (/다$/.test(word) && word.length >= 2) {
        const stem = toJamo(word.slice(0, -1));
        addStem(stem, entry.korean);
        // ㅂ/ㄷ/ㅅ/ㄹ/으 irregular stems lose their final jamo when conjugated
        if (/[ㅂㄷㅅㄹㅡ]$/.test(stem)) addStem(stem.slice(0, -1), entry.korean);
      }
    }
  }
  const stems = [...stemIndex.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [sourceId, text] of Object.entries(corpus)) {
    for (const chunk of text.match(/[가-힣]+/g) || []) {
      const jamo = toJamo(chunk);
      const hit = stems.find(([stem]) => jamo.startsWith(stem));
      if (hit) byKorean.get(hit[1]).sources.add(sourceId);
    }
  }

  // 5. Freeze the source registry and resolve one primary source per word.
  const testSources = tests.map(test => ({
    id: TEST_SOURCE_PREFIX + test.id,
    label: test.title,
    group: "topik-test",
    file: TEST_LIBRARY_FILE
  }));
  const babIds = [...new Set(entries.flatMap(entry => entry.lessons))].sort();
  const babSources = babIds.map(id => ({
    id,
    label: `Bab ${Number(id.replace("bab", ""))}`,
    group: "bab",
    file: `tutoring-${id.replace(/^bab0?/, "bab")}.html`
  }));
  const sources = [
    ...TOPIK_VOCAB_FILES.map(f => ({ id: f.id, label: f.label, group: "topik-vocab", file: f.file })),
    ...babSources,
    ...testSources,
    { id: "topik-core", label: "TOPIK core word list", group: "topik-extra", file: null }
  ];
  const sourceOrder = new Map(sources.map((s, i) => [s.id, i]));

  entries.forEach(entry => {
    const list = [...entry.sources].filter(id => sourceOrder.has(id));
    list.sort((a, b) => sourceOrder.get(a) - sourceOrder.get(b));
    if (!list.length) list.push("topik-core");
    entry.sources = list;
    entry.primarySource = list[0];
    entry.sourceGroup = sources.find(s => s.id === entry.primarySource).group;
    const beyondWorkbook = list.some(id => !/^bab\d\d$/.test(id));
    entry.sourceType = entry.lessons.length ? (beyondWorkbook ? "workbook+topik" : "workbook") : "topik";
  });

  // 6. Re-apply the hand-checked corrections, including to words that reached
  //    the committed CSV before their override existed.
  for (const [korean, override] of Object.entries(WORD_OVERRIDES)) {
    const entry = byKorean.get(korean);
    if (!entry) continue;
    if (override.partOfSpeech) entry.partOfSpeech = override.partOfSpeech;
    if (override.category) {
      entry.labels = entry.labels.map(id => (id === entry.category ? override.category : id));
      entry.category = override.category;
      if (!entry.labels.includes(override.category)) entry.labels.unshift(override.category);
    }
  }

  // 7. Stable ids, sorted output.
  entries.sort((a, b) => {
    const ai = a.id ? Number(a.id.replace(/\D/g, "")) : Infinity;
    const bi = b.id ? Number(b.id.replace(/\D/g, "")) : Infinity;
    if (ai !== bi) return ai - bi;
    return a.korean.localeCompare(b.korean, "ko");
  });
  entries.forEach((entry, i) => { entry.id = "kv" + String(i + 1).padStart(4, "0"); });

  return { entries, sources, added, tests };
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
function emit({ entries, sources, added }) {
  const levelCounts = {};
  entries.forEach(e => { levelCounts[e.topikLevel] = (levelCounts[e.topikLevel] || 0) + 1; });
  const usedLabels = [...new Set(entries.map(e => e.category))].sort();
  const labels = Object.fromEntries(usedLabels.map(id => [id, { id, name: LABEL_NAMES[id] || id.replace(/-/g, " ") }]));
  const lessonIds = [...new Set(entries.flatMap(e => e.lessons))].sort();
  const lessons = Object.fromEntries(lessonIds.map(id => [id, LESSON_TITLES[id] || { number: Number(id.replace("bab", "")) }]));

  const sourceGroups = SOURCE_GROUPS.filter(group => sources.some(s => s.group === group.id));

  const meta = {
    name: "Korean Shared Vocabulary",
    version: VERSION,
    entryCount: entries.length,
    workbookEntryCount: entries.filter(e => e.lessons.length).length,
    levelCounts,
    lessonCount: lessonIds.length,
    labelCount: usedLabels.length,
    sourceCount: sources.length,
    levelMethod: "Approximate learning bands. Levels 1-3 come from the original TOPIK A/B ranking; levels 4-5 mark words introduced by the TOPIK II level 4 and level 5 vocabulary references.",
    romanizationMethod: "Literal jamo transcription. Syllables are joined with dashes; a consonant with two values takes the first in the onset and the second in the coda (g/k, d/t, b/p, r/l, gg/kk, dd/tt, bb/pp, -/ng). No liaison, tensing, or assimilation is applied.",
    sourcePriority: "Every word carries all of its sources. primarySource resolves duplicates in the order TOPIK vocabulary lists, Bab lessons, TOPIK practice tests, extra TOPIK core list."
  };

  const plain = entries.map(e => ({
    id: e.id,
    korean: e.korean,
    romanization: e.romanization,
    english: e.english,
    partOfSpeech: e.partOfSpeech,
    topikLevel: e.topikLevel,
    category: e.category,
    labels: e.labels,
    lessons: e.lessons,
    sources: e.sources,
    primarySource: e.primarySource,
    sourceGroup: e.sourceGroup,
    sourceType: e.sourceType
  }));

  // JSON
  fs.writeFileSync(path.join(HERE, "shared-vocab.json"), JSON.stringify(plain, null, 2) + "\n");

  // CSV
  const header = ["id", "korean", "romanization", "english", "partOfSpeech", "topikLevel", "category", "labels", "lessons", "sources", "primarySource", "sourceGroup", "sourceType"];
  const csv = [header.join(",")].concat(plain.map(e => [
    e.id, e.korean, e.romanization, e.english, e.partOfSpeech, e.topikLevel, e.category,
    e.labels.join("|"), e.lessons.join("|"), e.sources.join("|"), e.primarySource, e.sourceGroup, e.sourceType
  ].map(csvCell).join(",")));
  fs.writeFileSync(path.join(HERE, "shared-vocab.csv"), "﻿" + csv.join("\n") + "\n");

  // JS library
  const js = renderLibrary({ meta, plain, lessons, labels, sources, sourceGroups });
  fs.writeFileSync(path.join(HERE, "shared-vocab.js"), js);

  return { meta, added, sources };
}

function renderLibrary({ meta, plain, lessons, labels, sources, sourceGroups }) {
  const j = value => JSON.stringify(value);
  return `/*
 * Korean Shared Vocabulary v${meta.version}
 * Generated by shared-vocab/build-shared-vocab.js — do not edit by hand.
 * Sources: Bab 1-20 workbook vocabulary, the four TOPIK vocabulary references,
 * the TOPIK multiple-choice test library, and the extra TOPIK core word list.
 * Browser: <script src="./shared-vocab.js"></script>
 * Node/CommonJS: const KoreanVocab = require("./shared-vocab.js");
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.KoreanVocab = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const META = Object.freeze(${j(meta)});
  const LESSONS = Object.freeze(${j(lessons)});
  const LABELS = Object.freeze(${j(labels)});
  const SOURCE_GROUPS = Object.freeze(${j(sourceGroups)});
  const SOURCES = Object.freeze(${j(sources)});
  const DATA = ${j(plain)};

  DATA.forEach(Object.freeze);
  Object.freeze(DATA);

  const SOURCE_INDEX = new Map(SOURCES.map(function (source, index) { return [source.id, { source: source, order: index }]; }));
  const GROUP_INDEX = new Map(SOURCE_GROUPS.map(function (group) { return [group.id, group]; }));

  const lessonIndex = {};
  const labelIndex = {};
  const sourceIndex = {};
  DATA.forEach(function (entry) {
    entry.lessons.forEach(function (id) { (lessonIndex[id] = lessonIndex[id] || []).push(entry); });
    entry.labels.forEach(function (id) { (labelIndex[id] = labelIndex[id] || []).push(entry); });
    entry.sources.forEach(function (id) { (sourceIndex[id] = sourceIndex[id] || []).push(entry); });
  });

  // ---- Romanization ------------------------------------------------------
  const CHO = ${j(CHO)};
  const JUNG = ${j(JUNG)};
  const JONG = ${j(JONG)};
  function romanize(text) {
    let out = "";
    let pending = [];
    function flush() { if (pending.length) { out += pending.join("-"); pending = []; } }
    for (const ch of String(text)) {
      const code = ch.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const i = code - 0xac00;
        pending.push(CHO[Math.floor(i / 588)] + JUNG[Math.floor((i % 588) / 28)] + JONG[i % 28]);
      } else { flush(); out += ch; }
    }
    flush();
    return out;
  }

  // ---- Source helpers ----------------------------------------------------
  function normalizeLesson(id) {
    const value = String(id || "").toLowerCase();
    const match = value.match(/^bab\\s*(\\d+)$/);
    return match ? "bab" + String(Number(match[1])).padStart(2, "0") : value;
  }

  function sourceInfo(id) {
    const hit = SOURCE_INDEX.get(id);
    return hit ? hit.source : null;
  }

  function sourceOrder(id) {
    const hit = SOURCE_INDEX.get(id);
    return hit ? hit.order : Number.MAX_SAFE_INTEGER;
  }

  /*
   * The single source a word is listed under. Duplicates resolve in registry
   * order (TOPIK vocabulary lists, then Bab lessons, then practice tests, then
   * the extra core list). \`prefer\` lets a lesson page claim its own words:
   * a Bab page passes its own id so the lesson always owns what it teaches.
   */
  function primarySourceOf(entry, prefer) {
    if (!entry || !entry.sources || !entry.sources.length) return null;
    const preferred = (Array.isArray(prefer) ? prefer : prefer ? [prefer] : []).map(normalizeLesson);
    for (const id of preferred) if (entry.sources.indexOf(id) !== -1) return id;
    return entry.sources.slice().sort(function (a, b) { return sourceOrder(a) - sourceOrder(b); })[0];
  }

  function groupOf(sourceId) {
    const source = sourceInfo(sourceId);
    return source ? source.group : null;
  }

  function listSources(groupId) {
    return SOURCES.filter(function (source) { return !groupId || source.group === groupId; })
      .map(function (source) {
        return Object.assign({}, source, { count: (sourceIndex[source.id] || []).length });
      });
  }

  function listSourceGroups() { return SOURCE_GROUPS.slice(); }

  function forSource(id) { return (sourceIndex[id] || []).slice(); }

  /*
   * Buckets every entry under exactly one source id, so a menu built from the
   * result never offers the same word twice.
   */
  function bucketBySource(entries, prefer) {
    const buckets = new Map();
    (entries || DATA).forEach(function (entry) {
      const id = primarySourceOf(entry, prefer);
      if (!id) return;
      if (!buckets.has(id)) buckets.set(id, []);
      buckets.get(id).push(entry);
    });
    return buckets;
  }

  // ---- Selection ---------------------------------------------------------
  function asArray(value) { return value == null ? [] : Array.isArray(value) ? value : [value]; }

  function select(options) {
    const opts = options || {};
    const lessons = asArray(opts.lessons).map(normalizeLesson);
    const sources = asArray(opts.sources);
    const groups = asArray(opts.sourceGroups);
    const labels = asArray(opts.labels);
    const parts = asArray(opts.partsOfSpeech);
    const levels = asArray(opts.levels).map(Number);
    const prefer = opts.prefer;
    const primaryOnly = Boolean(opts.primaryOnly);
    return DATA.filter(function (entry) {
      if (lessons.length && !lessons.some(function (id) { return entry.lessons.indexOf(id) !== -1; })) return false;
      if (sources.length) {
        const ok = primaryOnly
          ? sources.indexOf(primarySourceOf(entry, prefer)) !== -1
          : sources.some(function (id) { return entry.sources.indexOf(id) !== -1; });
        if (!ok) return false;
      }
      if (groups.length) {
        const group = primaryOnly
          ? groupOf(primarySourceOf(entry, prefer))
          : null;
        const ok = primaryOnly
          ? groups.indexOf(group) !== -1
          : entry.sources.some(function (id) { return groups.indexOf(groupOf(id)) !== -1; });
        if (!ok) return false;
      }
      if (labels.length && !labels.some(function (id) { return entry.category === id || entry.labels.indexOf(id) !== -1; })) return false;
      if (parts.length && parts.indexOf(entry.partOfSpeech) === -1) return false;
      if (levels.length && levels.indexOf(entry.topikLevel) === -1) return false;
      return true;
    });
  }

  function forLesson(id) { return (lessonIndex[normalizeLesson(id)] || []).slice(); }
  function find(korean) { return DATA.find(function (entry) { return entry.korean === korean; }) || null; }
  function merge() {
    const seen = new Set();
    const out = [];
    Array.prototype.slice.call(arguments).forEach(function (list) {
      (list || []).forEach(function (entry) {
        if (seen.has(entry.id)) return;
        seen.add(entry.id);
        out.push(entry);
      });
    });
    return out;
  }
  function random(list, count) {
    const pool = (list || DATA).slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    return count == null ? pool : pool.slice(0, count);
  }
  function toLessonVocab(list) {
    return (list || []).map(function (entry) {
      return {
        korean: entry.korean,
        romanization: entry.romanization || romanize(entry.korean),
        english: entry.english,
        partOfSpeech: entry.partOfSpeech,
        category: entry.category
      };
    });
  }
  function listLessons() { return Object.keys(LESSONS).sort(); }
  function listLabels() { return Object.keys(LABELS).sort(); }

  function validate() {
    const problems = [];
    const seen = new Set();
    DATA.forEach(function (entry) {
      if (seen.has(entry.korean)) problems.push("duplicate headword: " + entry.korean);
      seen.add(entry.korean);
      if (!entry.sources.length) problems.push("no source: " + entry.korean);
      if (!SOURCE_INDEX.has(entry.primarySource)) problems.push("unknown primary source: " + entry.korean);
      entry.sources.forEach(function (id) {
        if (!SOURCE_INDEX.has(id)) problems.push("unknown source " + id + " on " + entry.korean);
      });
      if (!LABELS[entry.category]) problems.push("unknown category on " + entry.korean);
    });
    return { ok: problems.length === 0, problems: problems };
  }

  return {
    META: META, DATA: DATA, LESSONS: LESSONS, LABELS: LABELS,
    SOURCES: SOURCES, SOURCE_GROUPS: SOURCE_GROUPS,
    lessonIndex: lessonIndex, labelIndex: labelIndex, sourceIndex: sourceIndex,
    romanize: romanize,
    select: select, forLesson: forLesson, forSource: forSource, find: find,
    merge: merge, random: random, toLessonVocab: toLessonVocab,
    primarySourceOf: primarySourceOf, bucketBySource: bucketBySource,
    sourceInfo: sourceInfo, groupOf: groupOf,
    listLessons: listLessons, listLabels: listLabels,
    listSources: listSources, listSourceGroups: listSourceGroups,
    normalizeLesson: normalizeLesson,
    validate: validate
  };
});
`;
}

const result = build();
const emitted = emit(result);
console.log(`shared-vocab v${VERSION}: ${emitted.meta.entryCount} entries, ${emitted.sources.length} sources`);
console.log(`  new from TOPIK vocabulary references: ${result.added.topikVocab}`);
console.log(`  new from the multiple-choice test library: ${result.added.testLibrary}`);
console.log(`  new from the Bab 20 page vocabulary: ${result.added.lessonLocal}`);
