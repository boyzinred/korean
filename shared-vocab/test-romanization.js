#!/usr/bin/env node
/*
 * One literal romanization across the whole site.
 *
 * Every character is transcribed, syllables are joined with dashes, and a
 * consonant with two values takes the first in the onset and the second in the
 * coda. No pronunciation changes are applied.
 *
 *   ㄱ g/k   ㄴ n     ㄷ d/t   ㄹ r/l   ㅁ m     ㅂ b/p   ㅅ s
 *   ㅇ -/ng  ㅈ j     ㅊ ch    ㅋ k     ㅌ t     ㅍ p     ㅎ h
 *   ㄲ gg/kk ㄸ dd/tt ㅃ bb/pp ㅆ ss    ㅉ jj
 *   ㅏ a  ㅑ ya  ㅓ eo  ㅕ yeo  ㅗ o  ㅛ yo  ㅜ u  ㅠ yu  ㅡ eu  ㅣ i
 *   ㅐ ae ㅒ yae ㅔ e   ㅖ ye   ㅘ oa ㅙ oae ㅚ oi ㅝ ueo ㅞ ue ㅟ ui ㅢ eui
 *
 * Run: node shared-vocab/test-romanization.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const KV = require("./shared-vocab.js");

const ROOT = path.resolve(__dirname, "..");
const CHO = ["g", "gg", "n", "d", "dd", "r", "m", "b", "bb", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const JUNG = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "oa", "oae", "oi", "yo", "u", "ueo", "ue", "ui", "yu", "eu", "eui", "i"];
const JONG = ["", "k", "kk", "ks", "n", "nj", "nh", "t", "l", "lk", "lm", "lp", "ls", "lt", "lp", "lh", "m", "p", "ps", "s", "ss", "ng", "j", "ch", "k", "t", "p", "h"];

/* Reference implementation, written independently of the shipped one. */
function expected(text) {
  let out = "";
  let run = [];
  const flush = () => { if (run.length) { out += run.join("-"); run = []; } };
  for (const ch of String(text)) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const i = code - 0xac00;
      run.push(CHO[Math.floor(i / 588)] + JUNG[Math.floor((i % 588) / 28)] + JONG[i % 28]);
    } else { flush(); out += ch; }
  }
  flush();
  return out;
}

const problems = [];
const note = m => problems.push(m);

// --- 1. hand-checked forms ---------------------------------------------------
const REFERENCE = {
  "안녕하세요": "an-nyeong-ha-se-yo", "언제": "eon-je", "학생": "hak-saeng",
  "꽃": "ggoch", "따다": "dda-da", "빵": "bbang", "쌀": "ssal", "짜다": "jja-da",
  "의사": "eui-sa", "과일": "goa-il", "원": "ueon", "위": "ui", "외국": "oi-guk",
  "왜": "oae", "웨": "ue", "값": "gaps", "닭": "dalk", "넓다": "neolp-da",
  "없다": "eops-da", "앉다": "anj-da", "많다": "manh-da", "밖": "bakk",
  "부엌": "bu-eok", "옷": "os", "있다": "iss-da", "잎": "ip", "끝": "ggeut",
  "한국어": "han-guk-eo", "서울": "seo-ul"
};
Object.entries(REFERENCE).forEach(([korean, want]) => {
  if (expected(korean) !== want) note(`reference table: ${korean} -> ${expected(korean)}, expected ${want}`);
  if (KV.romanize(korean) !== want) note(`KoreanVocab.romanize: ${korean} -> ${KV.romanize(korean)}, expected ${want}`);
});

// --- 2. the shared library ---------------------------------------------------
const offRule = KV.DATA.filter(entry => entry.romanization !== expected(entry.korean));
offRule.slice(0, 5).forEach(entry => note(`shared-vocab ${entry.korean}: ${entry.romanization} should be ${expected(entry.korean)}`));
if (offRule.length > 5) note(`...and ${offRule.length - 5} more shared-vocab entries`);

// --- 3. every romanization stored in a page ---------------------------------
const PAGES = fs.readdirSync(ROOT).filter(f => /^tutoring-topik-.*\.html$/.test(f)).sort();
const PAIR = /"korean":\s*"((?:[^"\\]|\\.)*)",\s*"romanization":\s*"((?:[^"\\]|\\.)*)"/g;
let storedChecked = 0;
for (const page of PAGES) {
  const text = fs.readFileSync(path.join(ROOT, page), "utf8");
  let match, bad = 0, first = null;
  PAIR.lastIndex = 0;
  while ((match = PAIR.exec(text))) {
    const korean = JSON.parse(`"${match[1]}"`);
    const stored = JSON.parse(`"${match[2]}"`);
    storedChecked++;
    if (stored !== expected(korean)) { bad++; if (!first) first = `${korean}: ${stored} should be ${expected(korean)}`; }
  }
  if (bad) note(`${page}: ${bad} stored romanizations off-rule (e.g. ${first})`);
}

// --- 4. the transcription tables inside the pages ---------------------------
const TABLE = {
  CHO: JSON.stringify(CHO).replace(/,/g, ", ").replace(/\[ /, "["),
  JUNG: JSON.stringify(JUNG).replace(/,/g, ", "),
  JONG: JSON.stringify(JONG).replace(/,/g, ", ")
};
for (const page of PAGES) {
  const text = fs.readFileSync(path.join(ROOT, page), "utf8");
  for (const name of ["CHO", "JUNG", "JONG"]) {
    const found = text.match(new RegExp(`const ${name} = (\\[[^\\]]*\\]);`));
    if (!found) continue;
    const actual = JSON.parse(found[1]);
    const want = { CHO, JUNG, JONG }[name];
    if (JSON.stringify(actual) !== JSON.stringify(want)) {
      const diff = actual.map((v, i) => (v === want[i] ? null : `${i}: ${JSON.stringify(v)} != ${JSON.stringify(want[i])}`)).filter(Boolean);
      note(`${page}: ${name} table differs (${diff.slice(0, 4).join(", ")})`);
    }
  }
}

// --- 5. romanization answers are compared without dashes --------------------
for (const page of PAGES) {
  const text = fs.readFileSync(path.join(ROOT, page), "utf8");
  if (!/romanization/.test(text)) continue;
  const hasRomanNormalizer =
    /normalizeRomanization[\s\S]{0,400}?replace\(\/\[\^a-z\]\/g, ""\)/.test(text) ||
    /mode === "romanization"\) return text\.replace\(\/\[\^a-z\]\/g, ""\)/.test(text) ||
    /m === "romanization"\) return s\.replace\(\/\[\^a-z\]\/g, ""\)/.test(text);
  const isQuizPage = /menu-answer|answer-mode|quizSections/.test(text);
  if (isQuizPage && !hasRomanNormalizer) note(`${page}: romanization answers are not compared without dashes`);
}

console.log(`${Object.keys(REFERENCE).length} reference forms · ${KV.DATA.length} shared entries · ${storedChecked} stored page romanizations · ${PAGES.length} TOPIK pages`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.slice(0, 25).forEach(p => console.log("  - " + p));
  process.exit(1);
}
console.log("every romanization follows the rule");
