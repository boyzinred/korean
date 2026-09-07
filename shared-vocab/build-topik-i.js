// Builds topik-vocab-topik-i.js: the TOPIK I (levels 1-2) word bank.
//
// Two sources, because neither is complete on its own:
//   1. NIKL's graded frequency list, grade A only. That grade is 초급 — exactly
//      TOPIK I — and its 순위 column gives the teaching order. It carries no
//      English and, being a dictionary-headword list, no particles at all.
//   2. The 500 level-1 entries from topik-vocab-2000.js: particles, set
//      expressions, collocations, counters, numerals and proper nouns — the
//      function words NIKL omits and you cannot pass level 2 without.
//
// English comes from shared-vocab.json where it is right and from
// topik-i-glosses.js where it is missing, wrong, or attached to the wrong
// homograph. Topics likewise: shared-vocab's "general-core" bucket is too
// coarse to drill against, so those are reassigned there by hand.
const fs = require('fs');
const path = require('path');
const { OVERRIDES, TOPIC_OVERRIDES } = require('./topik-i-glosses.js');

const NIKL = '/Users/tprimandaru/Documents/languages/korean/diagnostic-vocab/topik-6000-vocab-nikl.md';
const DAYS = 27;

// The source is an RTF-escaped markdown table: every Hangul character arrives
// as a \uNNNN escape and every row ends in a stray backslash.
function decode(cell) {
  return cell
    .replace(/\\uc0\s*/g, '')
    .replace(/\\u(\d+)\s?/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\\/g, '')
    .trim();
}

// 품사 codes mapped onto the part-of-speech vocabulary the pages already use.
// 보조용언 gets its own group: -어 보다, -고 싶다 and -지 않다 are grammar
// patterns, and drilling them as plain verbs teaches the wrong thing.
const POS_FROM_NIKL = {
  '명': 'noun', '동': 'verb', '형': 'adjective', '부': 'adverb',
  '수': 'numeral', '의': 'dependent noun', '관': 'determiner', '대': 'pronoun',
  '감': 'interjection', '보': 'auxiliary verb', '불': 'conjunction'
};

// NIKL files 그리고, 그래서, 하지만 and the rest as 부사. Every TOPIK textbook
// calls them conjunctions and so does the rest of this site, so they move.
const CONJUNCTIONS = new Set(['그리고', '그래서', '그런데', '그러면', '그렇지만', '하지만', '그러나', '왜냐하면', '그래']);

const TOPIC_FROM_CATEGORY = {
  'verbs-actions': 'daily-life', 'descriptions-qualities': 'description',
  'time-calendar': 'time', 'food-drink': 'food', 'transport-directions': 'transport',
  'communication-media': 'communication', 'body-health': 'body-health',
  'questions-pronouns': 'communication', 'school-study': 'work-study',
  'travel-movement': 'movement', 'places-buildings': 'places',
  'numbers-counters': 'quantity-degree', 'daily-life-actions': 'daily-life',
  'people-occupations': 'people', 'clothing-appearance': 'daily-life',
  'hobbies-sports': 'culture-leisure', 'animals-nature': 'nature-environment',
  'family-relationships': 'family', 'feelings-emotions': 'feelings',
  'shopping-money': 'shopping-money', 'adverbs-connectors': 'abstract',
  'greetings-politeness': 'communication', 'countries-languages': 'places',
  'weather-seasons': 'weather', 'home-household': 'daily-life',
  'events-celebrations': 'culture-leisure', 'society-economy': 'society',
  'work-business': 'work-study', 'government-law': 'society',
  'science-technology': 'technology'
};

// Fallbacks for a word whose category is general-core and which is not named in
// TOPIC_OVERRIDES: the part of speech is the only signal left.
const TOPIC_FROM_POS = {
  'verb': 'daily-life', 'adjective': 'description', 'adverb': 'abstract',
  'numeral': 'quantity-degree', 'dependent noun': 'quantity-degree',
  'determiner': 'abstract', 'pronoun': 'communication',
  'interjection': 'communication', 'conjunction': 'abstract',
  'auxiliary verb': 'abstract', 'noun': 'abstract'
};

// shared-vocab was written for lesson pages, so glosses arrive with English
// articles and the odd doubled "to be be" from an earlier bulk edit.
function tidy(english) {
  return String(english || '')
    .replace(/\s+/g, ' ')
    .replace(/^to be to be\b/, 'to be')
    .replace(/^to be be\b/, 'to be')
    .replace(/^(a|an|the) /i, '')
    .replace(/^sb\b/, 'someone')
    .trim();
}

function niklEntries() {
  const rows = [];
  for (const line of fs.readFileSync(NIKL, 'utf8').split('\n')) {
    const cells = line.split('|');
    if (cells.length < 6) continue;
    const rank = cells[1].trim();
    if (!/^\d+$/.test(rank)) continue;
    if (decode(cells[5]) !== 'A') continue;
    // Headwords carry a homograph index (가격 03); the number is not the word.
    const korean = decode(cells[2]).replace(/\s*\d+$/, '');
    const code = decode(cells[3]);
    if (!POS_FROM_NIKL[code]) throw new Error(`unknown 품사 ${code} on ${korean}`);
    let partOfSpeech = POS_FROM_NIKL[code];
    if (partOfSpeech === 'adverb' && CONJUNCTIONS.has(korean)) partOfSpeech = 'conjunction';
    rows.push({ rank: Number(rank), korean, partOfSpeech });
  }
  // A word can be listed twice for the same part of speech once the homograph
  // index is dropped; keep the better-ranked one.
  const best = new Map();
  for (const row of rows) {
    const key = `${row.korean}|${row.partOfSpeech}`;
    if (!best.has(key) || best.get(key).rank > row.rank) best.set(key, row);
  }
  return [...best.values()];
}

function build() {
  const sv = JSON.parse(fs.readFileSync(path.join(__dirname, 'shared-vocab.json'), 'utf8'));
  const byKorean = new Map();
  sv.forEach(w => {
    if (!byKorean.has(w.korean)) byKorean.set(w.korean, []);
    byKorean.get(w.korean).push(w);
  });

  const unresolved = [];
  const entries = niklEntries().map(row => {
    const key = `${row.korean}|${row.partOfSpeech}`;
    const candidates = byKorean.get(row.korean) || [];
    const exact = candidates.find(c => c.partOfSpeech === row.partOfSpeech);
    const source = exact || candidates[0];
    const meaning = OVERRIDES[key] || (exact ? tidy(exact.english) : '');
    if (!meaning) unresolved.push(key);

    // An auxiliary's looked-up category describes the main verb it is spelled
    // like (있다 lands in descriptions-qualities), which says nothing about the
    // pattern, so the class decides the topic outright.
    let topic = row.partOfSpeech === 'auxiliary verb' ? 'abstract' : TOPIC_OVERRIDES[row.korean];
    if (!topic && source && source.category !== 'general-core') topic = TOPIC_FROM_CATEGORY[source.category];
    if (!topic) topic = TOPIC_FROM_POS[row.partOfSpeech];

    return {
      korean: row.korean, meaning, partOfSpeech: row.partOfSpeech,
      topic, level: 1, rank: row.rank
    };
  });

  if (unresolved.length) throw new Error(`no English for: ${unresolved.join(', ')}`);

  // The function words NIKL leaves out. They keep their curated order, which is
  // already a teaching order, so they get a rank past every NIKL word.
  const level1 = require('./topik-vocab-2000.js').WORDS.filter(w => w.level === 1);
  const have = new Set(entries.map(e => `${e.korean}|${e.partOfSpeech}`));
  let n = 0;
  for (const word of level1) {
    const key = `${word.korean}|${word.partOfSpeech}`;
    if (have.has(key)) continue;
    have.add(key);
    entries.push({
      korean: word.korean, meaning: tidy(word.meaning), partOfSpeech: word.partOfSpeech,
      topic: word.topic, level: 1, rank: 100000 + (n++)
    });
  }

  // Each class is dealt out in its own frequency order across contiguous day
  // slices, so every day is a cross-section of the bank rather than a run of
  // one class.
  const classes = [...new Set(entries.map(e => e.partOfSpeech))];
  const buckets = new Map(classes.map(pos => [pos, entries.filter(e => e.partOfSpeech === pos).sort((a, b) => a.rank - b.rank)]));
  const ORDER = ['noun', 'verb', 'adjective', 'adverb', 'particle', 'expression', 'phrase',
    'dependent noun', 'counter', 'numeral', 'determiner', 'pronoun', 'auxiliary verb',
    'conjunction', 'interjection', 'proper noun', 'noun phrase'];
  const rank = pos => (ORDER.indexOf(pos) === -1 ? ORDER.length : ORDER.indexOf(pos));

  // Interleave the whole bank first, by each word's relative position inside
  // its own class, then cut that single sequence into equal days. Slicing per
  // class instead would leave days of uneven length once seventeen classes
  // each round their own boundary.
  const sequence = classes.flatMap(pos => {
    const list = buckets.get(pos);
    return list.map((word, i) => ({ word, pos, at: (i + 0.5) / list.length }));
  });
  sequence.sort((a, b) => a.at - b.at || rank(a.pos) - rank(b.pos));

  return sequence.map(({ word }, i) => ({
    korean: word.korean, meaning: word.meaning, partOfSpeech: word.partOfSpeech,
    topic: word.topic, level: 1,
    day: Math.floor((i * DAYS) / sequence.length) + 1
  }));
}

if (require.main === module) {
  const words = build();
  const perDay = {};
  words.forEach(w => { perDay[w.day] = (perDay[w.day] || 0) + 1; });
  const sizes = [...new Set(Object.values(perDay))].sort((a, b) => a - b);

  const line = w => `  { korean: ${JSON.stringify(w.korean)}, meaning: ${JSON.stringify(w.meaning)}, ` +
    `partOfSpeech: ${JSON.stringify(w.partOfSpeech)}, topic: ${JSON.stringify(w.topic)}, ` +
    `level: ${w.level}, day: ${w.day} }`;

  const file = `(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.TopikVocab = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // TOPIK I vocabulary, levels 1 and 2, ${words.length} words.
  // Grade A of the NIKL graded frequency list (초급 — exactly TOPIK I), plus the
  // particles, set expressions, collocations and counters that a
  // dictionary-headword list leaves out.
  // Day 1-${DAYS}, ${sizes.join('-')} words per day. Each part of speech is spread
  // evenly across the days in frequency order, so every day is a cross-section
  // of the bank instead of a run of one class.
  // Generated by build-topik-i.js — edit that and the glosses in
  // topik-i-glosses.js, not this.

  var WORDS = [
${words.map(line).join(',\n')}
  ];

  return { WORDS: WORDS };
}));
`;

  fs.writeFileSync(path.join(__dirname, 'topik-vocab-topik-i.js'), file);
  const byPos = {};
  words.forEach(w => { byPos[w.partOfSpeech] = (byPos[w.partOfSpeech] || 0) + 1; });
  console.log(`wrote ${words.length} words across ${DAYS} days (${sizes.join('-')} per day)`);
  console.log(byPos);
}

module.exports = { build, decode, niklEntries };
