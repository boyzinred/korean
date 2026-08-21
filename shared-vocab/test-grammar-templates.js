#!/usr/bin/env node
/*
 * Every grammar form on the TOPIK II pages must have a template, and every
 * template must produce a clean sentence for a wide sample of vocabulary.
 * Run: node shared-vocab/test-grammar-templates.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const KV = require("./shared-vocab.js");
const T = require("./grammar-templates.js");

const ROOT = path.resolve(__dirname, "..");
const PAGES = [
  "tutoring-topik-ii-level-3-grammar.html",
  "tutoring-topik-ii-level-4-grammar.html",
  "tutoring-topik-ii-level-5-grammar.html"
];

const problems = [];
const note = m => problems.push(m);

// --- 1. every published form has a template ---------------------------------
const forms = [];
for (const page of PAGES) {
  const text = fs.readFileSync(path.join(ROOT, page), "utf8");
  const points = JSON.parse(text.match(/const GRAMMAR_POINTS = (\[[\s\S]*?\]);\n/)[1]);
  points.forEach(p => forms.push({ page, id: p.id, form: p.form }));
}
const missing = forms.filter(f => !T.templateFor(f.form));
missing.forEach(f => note(`no template for ${f.form}  (${f.page} ${f.id})`));
console.log(`${forms.length} grammar points across ${PAGES.length} pages · ${new Set(forms.map(f => T.normalizeForm(f.form))).size} distinct forms`);

// --- 2. every template renders cleanly --------------------------------------
const verbs = KV.DATA.filter(e => T.fillsSlot(e, "verb"));
const adjectives = KV.DATA.filter(e => T.fillsSlot(e, "adj"));
const places = KV.DATA.filter(e => T.fillsSlot(e, "place"));
const nouns = KV.DATA.filter(e => T.fillsSlot(e, "noun"));
console.log(`pool: ${verbs.length} verbs · ${adjectives.length} adjectives · ${places.length} places · ${nouns.length} nouns`);

const POOLS = { verb: verbs, verb2: verbs, adj: adjectives, adj2: adjectives, place: places, noun: nouns, time: nouns };
const SAMPLES = 60;
let rendered = 0;

const uniqueForms = [...new Map(forms.map(f => [T.normalizeForm(f.form), f])).values()];
for (const { form, page, id } of uniqueForms) {
  const needs = T.slotsFor(form);
  if (!needs) continue;
  for (let i = 0; i < SAMPLES; i++) {
    const slots = {};
    needs.forEach((slot, n) => {
      const pool = POOLS[slot];
      slots[slot] = pool[(i * 7 + n * 13 + form.length * 3) % pool.length];
    });
    let out;
    try {
      out = T.build(form, slots);
    } catch (error) {
      note(`${form} (${page} ${id}) threw: ${error.message}`);
      break;
    }
    rendered++;
    const used = needs.map(k => slots[k].korean).join(" + ");
    if (!out || !out.korean || !out.english) { note(`${form}: empty output for ${used}`); break; }
    if (/undefined|NaN|\[object/.test(out.korean + out.english)) { note(`${form}: bad interpolation -> ${out.korean} / ${out.english}`); break; }
    // A generated Korean sentence must be Hangul plus spaces and terminal punctuation.
    if (/[a-zA-Z]/.test(out.korean)) { note(`${form}: latin text in Korean -> ${out.korean}`); break; }
    if (/[()ㄱ-ㅎㅏ-ㅣ]/.test(out.korean)) { note(`${form}: unresolved ending marker -> ${out.korean}  (${used})`); break; }
    if (!/[.?!]$/.test(out.korean)) { note(`${form}: Korean missing final punctuation -> ${out.korean}`); break; }
    if (/\s{2,}|^\s|\s+[.?!]/.test(out.korean)) { note(`${form}: spacing problem -> "${out.korean}"`); break; }
    if (/\s{2,}|\bto to\b|\bthe the\b/.test(out.english)) { note(`${form}: English problem -> "${out.english}"`); break; }
  }
}

console.log(`${rendered} sentences rendered`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.slice(0, 30).forEach(p => console.log("  - " + p));
  process.exit(1);
}
console.log("all templates render cleanly");
