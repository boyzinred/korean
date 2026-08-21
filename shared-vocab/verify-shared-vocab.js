#!/usr/bin/env node
/*
 * Checks the invariants the exercise menus rely on.
 * Run: node shared-vocab/verify-shared-vocab.js
 */
"use strict";
const KV = require("./shared-vocab.js");

const problems = [];
const note = message => problems.push(message);

// 1. The library's own validation.
const validation = KV.validate();
validation.problems.forEach(note);

// 2. Every entry is listed under exactly one source, and the buckets partition
//    the dataset with nothing lost and nothing counted twice.
for (const prefer of [null, "bab01", "bab14", "bab20"]) {
  const buckets = KV.bucketBySource(KV.DATA, prefer);
  const listed = [...buckets.values()].flat();
  const unique = new Set(listed.map(entry => entry.id));
  if (listed.length !== KV.DATA.length) note(`prefer=${prefer}: bucketed ${listed.length} of ${KV.DATA.length} entries`);
  if (unique.size !== listed.length) note(`prefer=${prefer}: a word is listed under more than one source`);
}

// 3. A Bab page that prefers its own lesson owns that lesson's whole word list,
//    so the default exercise pool matches what the lesson teaches.
KV.listLessons().forEach(lesson => {
  const taught = KV.forLesson(lesson).length;
  const owned = KV.DATA.filter(entry => KV.primarySourceOf(entry, lesson) === lesson).length;
  if (taught !== owned) note(`${lesson}: teaches ${taught} words but owns ${owned} when preferred`);
});

// 4. Without a preference, duplicates resolve in the documented tier order.
const GROUP_RANK = { "topik-vocab": 1, bab: 2, "topik-test": 3, "topik-extra": 4 };
KV.DATA.forEach(entry => {
  const best = Math.min(...entry.sources.map(id => GROUP_RANK[KV.groupOf(id)] ?? 99));
  const actual = GROUP_RANK[entry.sourceGroup] ?? 99;
  if (actual !== best) note(`${entry.korean}: listed under ${entry.sourceGroup} but a higher-priority source exists`);
});

// 5. Every declared source actually holds words.
KV.listSources().forEach(source => {
  if (!source.count) note(`source ${source.id} has no words`);
});

console.log(`${KV.META.entryCount} entries · ${KV.SOURCES.length} sources · ${KV.listLabels().length} categories`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.slice(0, 40).forEach(p => console.log("  - " + p));
  process.exit(1);
}
console.log("all invariants hold");
