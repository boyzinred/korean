#!/usr/bin/env node
/*
 * Every grammar form, over every verb and adjective in the shared vocabulary.
 *
 * The templates call korean-grammar.js, so this looks for the mistakes that
 * survive a correct engine used the wrong way: an irregular stem left
 * unchanged before a vowel ending (어둡은), 있다/없다 taking -(으)ㄴ, a ㄹ-stem
 * keeping its ㄹ before ㄴ/ㅂ/ㅅ, and 하다 verbs written 하아/하어.
 *
 * Run: node shared-vocab/test-conjugation-audit.js
 */
"use strict";
const KV = require("./shared-vocab.js");
const G = require("./korean-grammar.js");
const T = require("./grammar-templates.js");

const predicates = KV.DATA.filter(e => /^[가-힣]+다$/.test(e.korean) && (e.partOfSpeech === "verb" || e.partOfSpeech === "adjective"));
const problems = [];
const note = m => problems.push(m);

const stemOf = w => w.replace(/다$/, "");
const finalJong = word => {
  const stem = stemOf(word);
  const code = stem.charCodeAt(stem.length - 1);
  return code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 : -1;
};
const B = 17, D = 7, S = 19, L = 8, H = 27;

/*
 * Forms that must never appear for a given base word. A ㅂ-irregular stem, for
 * instance, may never be followed directly by 은/어/아/으 — it becomes 우.
 */
function forbiddenFragments(word) {
  const stem = stemOf(word);
  const kind = G.irregularClass(word);
  const bad = [];
  if (kind === "b") ["은", "어", "아", "으"].forEach(t => bad.push(stem + t));
  if (kind === "d") ["어", "아", "으", "은", "을"].forEach(t => bad.push(stem + t));
  if (kind === "s") ["어", "아", "으", "은", "을"].forEach(t => bad.push(stem + t));
  if (kind === "h") ["은", "어", "아"].forEach(t => bad.push(stem + t));
  if (kind === "reu") ["어", "아"].forEach(t => bad.push(stem + t));
  if (kind === "eu") ["어", "아"].forEach(t => bad.push(stem + t));
  if (/(있다|없다)$/.test(word)) bad.push(stem + "은");
  if (kind === "l") ["는", "니", "세", "습니"].forEach(t => bad.push(stem + t));
  if (/하다$/.test(word)) [stem + "아", stem + "어"].forEach(t => bad.push(t));
  return bad;
}

// --- 1. the engine's own forms ----------------------------------------------
const ENGINE_FORMS = [
  ["polite", w => G.politeEnding(w)],
  ["past polite", w => G.pastPolite(w)],
  ["formal", w => G.formalPresent(w)],
  ["future", w => G.futurePolite(w)],
  ["long negative", w => G.longNegative(w)],
  ["adjective modifier", w => G.modifier(w, { adjective: true })],
  ["verb modifier", w => G.modifier(w)],
  ["past modifier", w => G.modifier(w, { tense: "past" })],
  ["future modifier", w => G.modifier(w, { tense: "future" })],
  ["-(으)면", w => G.attachEu(w, "(으)면")],
  ["-(으)니까", w => G.attachEu(w, "(으)니까")],
  ["-(으)세요", w => G.attachEu(w, "(으)세요")],
  ["-(으)ㄹ 수 있다", w => G.attachEu(w, "(으)ㄹ") + " 수 있어요"],
  ["-고", w => G.plainStem(w, "고") + "고"],
  ["-지만", w => G.plainStem(w, "지") + "지만"],
  ["-네요", w => G.plainStem(w, "네") + "네요"]
];

let engineChecked = 0;
for (const entry of predicates) {
  const bad = forbiddenFragments(entry.korean);
  if (!bad.length) continue;
  for (const [label, build] of ENGINE_FORMS) {
    let form;
    try { form = build(entry.korean); } catch (e) { note(`${entry.korean} ${label}: threw ${e.message}`); continue; }
    engineChecked++;
    const hit = bad.find(fragment => form.startsWith(fragment));
    if (hit) note(`${entry.korean} (${G.irregularClass(entry.korean)}) ${label} -> ${form}`);
  }
}

// --- 2. the same words through every grammar template -----------------------
const SLOT_FOR = { verb: "verb", adjective: "adj" };
let templateChecked = 0;
for (const form of T.listForms()) {
  const needs = T.slotsFor(form);
  for (const entry of predicates) {
    const slot = SLOT_FOR[entry.partOfSpeech];
    if (!needs.includes(slot) && !needs.includes(slot + "2")) continue;
    const bad = forbiddenFragments(entry.korean);
    if (!bad.length) continue;
    // Put the word under test in its slot; fill the rest from the whole list.
    const slots = {};
    let ok = true;
    needs.forEach((need, i) => {
      if (need === slot || need === slot + "2") { slots[need] = entry; return; }
      const pool = KV.DATA.filter(e => T.fillsSlot(e, need) && e.korean !== entry.korean);
      if (!pool.length) { ok = false; return; }
      slots[need] = pool[i % pool.length];
    });
    if (!ok) continue;
    let built;
    try { built = T.build(form, slots); } catch (e) { note(`${form} with ${entry.korean}: threw ${e.message}`); continue; }
    templateChecked++;
    const hit = bad.find(fragment => built.korean.includes(fragment));
    if (hit) note(`${form} with ${entry.korean} (${G.irregularClass(entry.korean)}) -> ${built.korean}`);
  }
}

console.log(`${predicates.length} predicates · ${engineChecked} engine forms · ${templateChecked} template sentences checked`);
if (problems.length) {
  console.log(`\n${problems.length} bad form(s):`);
  problems.slice(0, 30).forEach(p => console.log("  - " + p));
  process.exit(1);
}
console.log("no malformed conjugations");
