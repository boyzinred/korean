#!/usr/bin/env node
/*
 * Tests for the daily tasks: the two-quiz scheduler and its forgiving
 * study-day progression, the comprehensive quiz over units of any size, the
 * memory model, the adaptive review selector and quiz, star and memory
 * updates, checkpoint and resume, the progress repository, 120-study-day
 * simulations, and the real TOPIK II units.
 *
 * Run: node shared-vocab/test-study-plan.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");
const SpacedSession = require("./spaced-session.js");
const StudyMemory = require("./study-memory.js");
const ReviewSelector = require("./review-selector.js");
const StudyPlan = require("./study-plan.js");
const StudyPlanStore = require("./study-plan-store.js");
const AnswerCheck = require("./answer-check.js");
const ReviewBanks = require("./review-banks.js");

const ROOT = path.resolve(__dirname, "..");
const CONFIG = StudyPlan.configFor(StudyPlan.PLANS[0]);
const GROUPS_ONLY = StudyPlan.merge(CONFIG, { comprehensive: { includeSRSPhase: false } });
let passed = 0;
const failures = [];

function test(name, fn) {
  try { fn(); passed += 1; console.log("  ✓ " + name); }
  catch (error) { failures.push(name); console.log("  ✗ " + name + "\n      " + String(error && error.stack || error).split("\n").slice(0, 4).join("\n      ")); }
}
function section(name) { console.log("\n" + name); }

/* A seeded random, so a failing run can be repeated. */
function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
/* A learner who gets better with practice: each word starts at `fail` and
   halves its chance of a miss every time it is asked. */
function learner(fail, seed) {
  const rand = seeded(seed);
  const seen = new Map();
  return id => {
    const times = seen.get(id) || 0;
    seen.set(id, times + 1);
    const p = fail * Math.pow(0.5, times);
    const roll = rand();
    return roll < p ? "f" : roll < p * 1.5 ? "w" : "s";
  };
}
const ids = (n, prefix) => Array.from({ length: n }, (_, i) => (prefix || "w") + (i + 1));
const fmt = ranges => ranges.map(([a, b]) => (a + 1) + "–" + b);
function addDays(date, n) {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + n);
  return StudyPlan.localDate(d);
}

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key),
    get length() { return data.size; },
    key: i => [...data.keys()][i]
  };
}

/* Mark every quiz of today's study day done. */
function finishDay(units, records, date) {
  const day = StudyPlan.today(CONFIG, units, records, date);
  day.tasks.forEach(task => { records[task.id] = { status: "done", completedOn: date }; });
  return day;
}

/* Drive a run, answering by a policy (id, now) -> "s" | "w" | "f". */
function drive(run, policy, limit, config) {
  const asked = [];
  let guard = 0;
  while (!run.done) {
    const now = StudyPlan.engine.current(run);
    asked.push(now);
    StudyPlan.engine.answer(run, config || CONFIG, policy(now.id, now, asked.length), 1000, seeded(guard));
    if (++guard > (limit || 50000)) throw new Error("run did not finish");
  }
  return asked;
}

/* ---- a whole learner's world: units, a repository, stars ---------------- */
function world(sizes, prefix) {
  const units = sizes.map((n, i) => ({ id: (prefix || "unit-") + (i + 1), ids: ids(n, "u" + (i + 1) + "w") }));
  return { units, unitIds: units.map(u => u.id), repo: StudyPlanStore.open("plan", memoryStorage()), stars: {}, log: [] };
}
const starLevel = (w, id) => (w.stars[id] ? w.stars[id].l : 0);

/* Run one task the way study-quiz.html does, start to finish: freeze a
   review's selection, drive the quiz, save it done, write the memory
   records, confirm the star changes. */
function runTask(w, task, date, answerFor, config) {
  const cfg = config || CONFIG;
  let poolIds;
  let selection = null;
  const unitOf = {};
  if (task.algorithm === "comprehensive") {
    const unit = w.units[task.units[0]];
    poolIds = unit.ids;
    poolIds.forEach(id => { unitOf[id] = unit.id; });
  } else {
    selection = StudyPlan.selectReview(cfg, task, w.units, w.repo.words(), id => starLevel(w, id), w.repo.tasks(), date);
    poolIds = selection.ids;
    poolIds.forEach(id => { unitOf[id] = selection.picks[id].unit; });
  }
  const tiers = selection ? Object.fromEntries(Object.entries(selection.picks).map(([id, p]) => [id, p.tier])) : {};
  const run = StudyPlan.engine.create(task.algorithm, poolIds, cfg, seeded(task.day + 1), { policy: task.policy, unitOf, tiers });
  let seen = w.repo.versionOf(null);
  const first = w.repo.saveTask(task.id, { status: "started", startedOn: date, n: 0, run, selection }, seen);
  assert(first.ok, "task saved once");
  seen = first.seen;
  drive(run, (id, now) => answerFor(id, now, task, date), 50000, cfg);
  const saved = w.repo.saveTask(task.id, { status: "done", startedOn: date, completedOn: date, n: run.answers, run, selection }, seen);
  assert(saved.ok);
  const records = StudyPlan.srs.wordRecords(run, id => w.repo.word(id), date, { source: task.id, memory: cfg.srs });
  w.repo.setWords(records);
  StudyPlan.srs.proposals(run, id => w.stars[id] || { l: 0 }, date).forEach(p => {
    w.stars[p.id] = { l: p.to, d: p.cleanDay || (w.stars[p.id] && w.stars[p.id].d) || "" };
  });
  w.log.push({ date, task, run, selection });
  return { run, selection };
}

/* A learner whose recall in a review follows the model's own estimate. */
function realistic(w, seed) {
  const rand = seeded(seed);
  const learn = learner(0.35, seed + 1);
  return (id, now, task, date) => {
    if (task.algorithm === "comprehensive") return learn(id);
    const R = StudyMemory.retention(w.repo.word(id), date, CONFIG.srs);
    const roll = rand();
    return roll < Math.pow(R, 0.8) ? (rand() < 0.85 ? "s" : "w") : "f";
  };
}

function studyDay(w, date, answerFor, config) {
  const day = StudyPlan.today(config || CONFIG, w.unitIds, w.repo.tasks(), date);
  day.tasks.filter(t => t.status !== "completed").forEach(task => runTask(w, task, date, answerFor, config));
  return day;
}

/* =========================================================================
   SCHEDULING
   ========================================================================= */
section("Scheduling");

const UNITS = ids(14, "unit-");

test("day 0 is the comprehensive quiz alone: nothing has been learnt to review", () => {
  const day = StudyPlan.today(CONFIG, UNITS, {}, "2026-11-16");
  assert.strictEqual(day.index, 0);
  assert.deepStrictEqual(day.tasks.map(t => t.id), ["d0:comprehensive:unit-1"]);
  assert.strictEqual(day.tasks[0].status, "not-started");
});

test("every later day: the comprehensive quiz first, then one adaptive review over every earlier unit", () => {
  for (let d = 1; d < 14; d += 1) {
    const tasks = StudyPlan.dayTasks(CONFIG, 14, d);
    assert.deepStrictEqual(tasks.map(t => t.key), ["comprehensive", "review"], "day " + d);
    assert.deepStrictEqual(tasks[0].units, [d]);
    assert.deepStrictEqual(tasks[1].units, Array.from({ length: d }, (_, i) => i), "learnt before day " + d);
  }
});

test("one new unit per study day, in order, never twice; never more than two quizzes", () => {
  const taught = [];
  for (let d = 0; d < 200; d += 1) {
    const tasks = StudyPlan.dayTasks(CONFIG, 120, d);
    assert(tasks.length <= 2, "day " + d);
    tasks.filter(t => t.algorithm === "comprehensive").forEach(t => taught.push(...t.units));
  }
  assert.deepStrictEqual(taught, Array.from({ length: 120 }, (_, i) => i));
});

test("once every unit is learnt, the days carry on with the review alone", () => {
  for (const d of [7, 8, 30, 365]) {
    const tasks = StudyPlan.dayTasks(CONFIG, 7, d);
    assert.deepStrictEqual(tasks.map(t => t.key), ["review"], "day " + d);
    assert.deepStrictEqual(tasks[0].units, [0, 1, 2, 3, 4, 5, 6]);
  }
});

test("task ids: a comprehensive quiz names its unit (as before), a review its day", () => {
  const [comp, review] = StudyPlan.dayTasks(CONFIG, 14, 3);
  assert.strictEqual(StudyPlan.taskId(UNITS, comp), "d3:comprehensive:unit-4");
  assert.strictEqual(StudyPlan.taskId(UNITS, review), "d3:review");
  assert.strictEqual(StudyPlan.findTask(CONFIG, UNITS, "d3:review").units.length, 3);
  assert.strictEqual(StudyPlan.findTask(CONFIG, UNITS, "d3:comprehensive:unit-4").units[0], 3);
  assert.strictEqual(StudyPlan.findTask(CONFIG, UNITS, "d3:comprehensive:unit-9"), null);
  assert.strictEqual(StudyPlan.findTask(CONFIG, UNITS, "d1:earlyReview:unit-1"), null, "the old review sessions are gone");
});

test("a configuration with more quiz types than the daily maximum is rejected", () => {
  const three = StudyPlan.merge(CONFIG, { sessions: CONFIG.sessions.concat([{ key: "x", label: "X", algorithm: "review", policy: "adaptiveReview" }]) });
  assert.throws(() => StudyPlan.validate(three), /maxDailyQuizSessions/);
  assert.throws(() => StudyPlan.validate(StudyPlan.merge(CONFIG, { scheduling: { newUnitsPerStudyDay: 2 } })), /newUnitsPerStudyDay/);
  assert.throws(() => StudyPlan.validate(StudyPlan.merge(CONFIG, { adaptiveReview: { targetUniqueWords: 70 } })), /unique words/);
});

test("the configuration carries the spec's settings", () => {
  assert.strictEqual(CONFIG.scheduling.maxDailyQuizSessions, 2);
  assert.strictEqual(CONFIG.comprehensive.includeSRSPhase, true);
  assert.strictEqual(CONFIG.comprehensive.baseGroupSize, 5);
  const r = CONFIG.adaptiveReview;
  assert.deepStrictEqual([r.targetUniqueWords, r.minimumUniqueWords, r.maximumUniqueWords], [55, 50, 60]);
  assert.deepStrictEqual([r.weakOverdueTarget, r.developingTarget, r.masteredTarget], [30, 15, 10]);
  assert.strictEqual(r.initialAttemptsPerWord, 1);
  assert.strictEqual(r.enableExtendedRepetition, false);
  assert.strictEqual(CONFIG.srs.trackActualElapsedTime, true);
});

/* =========================================================================
   FORGIVING PROGRESSION
   ========================================================================= */
section("Forgiving progression");

test("missing five calendar days does not move the study day", () => {
  const records = {};
  finishDay(UNITS, records, "2026-11-16");
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, records, "2026-11-17").index, 1);
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, records, "2026-11-22").index, 1);
});

test("returning after an absence shows the same two quizzes, and no backlog", () => {
  const records = {};
  let date = "2026-11-01";
  for (let i = 0; i < 9; i += 1) { finishDay(UNITS, records, date); date = addDays(date, 1); }
  const pending = StudyPlan.today(CONFIG, UNITS, records, date);
  const later = StudyPlan.today(CONFIG, UNITS, records, addDays(date, 30));
  assert.deepStrictEqual(later.tasks.map(t => t.id), pending.tasks.map(t => t.id));
  assert.strictEqual(later.tasks.length, 2);
  assert(later.tasks.every(t => t.status === "not-started"), "nothing marked failed, done or skipped");
});

test("a half-done day stays put, its finished quiz ticked and its other one in progress", () => {
  const records = {};
  for (const date of ["2026-11-01", "2026-11-02", "2026-11-03"]) finishDay(UNITS, records, date);
  const day3 = StudyPlan.today(CONFIG, UNITS, records, "2026-11-04");
  records[day3.tasks[0].id] = { status: "done", completedOn: "2026-11-04" };
  records[day3.tasks[1].id] = { status: "started", n: 30 };
  for (const date of ["2026-11-04", "2026-11-05", "2026-12-25"]) {
    const now = StudyPlan.today(CONFIG, UNITS, records, date);
    assert.strictEqual(now.index, 3, date);
    assert.deepStrictEqual(now.tasks.map(t => t.status), ["completed", "in-progress"]);
  }
});

test("finishing both opens the next day on the next local date, never the same one", () => {
  const records = {};
  finishDay(UNITS, records, "2026-11-16");
  finishDay(UNITS, records, "2026-11-17");
  const same = StudyPlan.today(CONFIG, UNITS, records, "2026-11-17");
  assert.strictEqual(same.index, 1);
  assert.strictEqual(same.complete, true);
  assert(same.tasks.every(t => t.status === "completed"), "finished quizzes stay on show");
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, records, "2026-11-18").index, 2);
});

test("finishing a review again (a second tab, a retried save) updates the one task", () => {
  const w = world([10, 10, 10]);
  studyDay(w, "2026-11-16", () => "s");
  studyDay(w, "2026-11-17", () => "s");
  const before = Object.keys(w.repo.tasks()).length;
  const stale = w.repo.saveTask("d1:review", { status: "done", n: 1 }, w.repo.versionOf(null));
  assert(stale.conflict, "a tab that never saw the record cannot write over it");
  assert.strictEqual(Object.keys(w.repo.tasks()).length, before);
});

test("progression is the same on every device holding the same records", () => {
  const w = world([10, 10, 10, 10]);
  ["2026-11-16", "2026-11-17", "2026-11-18"].forEach(date => studyDay(w, date, () => "s"));
  const copy = JSON.parse(JSON.stringify(w.repo.tasks()));
  const a = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-11-25");
  const b = StudyPlan.today(CONFIG, w.unitIds, copy, "2026-11-25");
  assert.strictEqual(a.index, 3);
  assert.deepStrictEqual(a.tasks.map(t => t.id), b.tasks.map(t => t.id));
});

test("old records carry over: a finished day-0 comprehensive quiz is still finished", () => {
  const records = { "d0:comprehensive:unit-1": { status: "done", completedOn: "2026-11-14" },
    "d1:earlyReview:unit-1": { status: "done", completedOn: "2026-11-15" } };
  const day = StudyPlan.today(CONFIG, UNITS, records, "2026-11-17");
  assert.strictEqual(day.index, 1);
  assert.deepStrictEqual(day.tasks.map(t => t.id), ["d1:comprehensive:unit-2", "d1:review"]);
});

/* =========================================================================
   COMPREHENSIVE QUIZ
   ========================================================================= */
section("Comprehensive quiz: grouping");

test("a 50-word unit groups exactly as specified", () => {
  assert.deepStrictEqual(fmt(StudyPlan.hierarchy(50, 5)), [
    "1–5", "6–10", "1–10", "11–15", "16–20", "11–20", "1–20",
    "21–25", "26–30", "21–30", "31–35", "36–40", "31–40", "21–40", "1–40",
    "41–45", "46–50", "41–50", "1–50"
  ]);
});

test("a 43-word unit ends on 41–43 and then 1–43", () => {
  assert.deepStrictEqual(fmt(StudyPlan.hierarchy(43, 5)).slice(-3), ["1–40", "41–43", "1–43"]);
});

for (const n of [1, 3, 5, 12, 37, 43, 50, 56, 63]) {
  test(n + " words: valid groups, each word in one base group, the last group the whole unit; the quiz asks every word and ends", () => {
    const seq = StudyPlan.hierarchy(n, 5);
    seq.forEach(([a, b]) => assert(Number.isInteger(a) && Number.isInteger(b) && a >= 0 && a < b && b <= n));
    const leaves = seq.filter(([a, b]) => b - a <= 5 && a % 5 === 0);
    const covered = leaves.flatMap(([a, b]) => Array.from({ length: b - a }, (_, i) => a + i));
    assert.deepStrictEqual(covered.slice().sort((x, y) => x - y), Array.from({ length: n }, (_, i) => i));
    assert.deepStrictEqual(seq[seq.length - 1], [0, n]);
    assert.strictEqual(new Set(seq.map(r => r.join())).size, seq.length, "no group repeated");
    const words = ids(n);
    const run = StudyPlan.engine.create("comprehensive", words, CONFIG, seeded(n));
    const asked = drive(run, learner(0.4, n));
    assert.deepStrictEqual([...new Set(asked.map(a => a.id))].sort(), words.slice().sort());
    assert.deepStrictEqual(Object.keys(run.scored).sort(), words.slice().sort(), "every word measured once");
  });
}

section("Comprehensive quiz: Part 1, restarts");

/* Answer the comprehensive run until its current group is words from–to. */
function reachGroup(run, from, to) {
  while (!(StudyPlan.engine.current(run).group.from === from && StudyPlan.engine.current(run).group.to === to)) {
    StudyPlan.engine.answer(run, CONFIG, "s");
  }
}
const partOneDone = run => run.phase !== "groups";

test("Part 1 asks each group in unit order, then Part 2 follows", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(12), CONFIG, seeded(1));
  const asked = [];
  while (run.phase === "groups") {
    asked.push(StudyPlan.engine.current(run).id);
    StudyPlan.engine.answer(run, CONFIG, "s", 500);
  }
  assert.deepStrictEqual(asked, [].concat(ids(5), ids(10).slice(5), ids(10), ["w11", "w12"], ids(12)));
  assert.strictEqual(run.phase, "srs");
});

test("a miss on word 3 of a 10-word group restarts at word 1 — words 4–10 are not asked", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), CONFIG, seeded(2));
  reachGroup(run, 1, 10);
  StudyPlan.engine.answer(run, CONFIG, "s");
  StudyPlan.engine.answer(run, CONFIG, "s");
  const answersBefore = run.answers;
  const events = StudyPlan.engine.answer(run, CONFIG, "f");
  assert(events.groupRetry && events.restarted);
  assert.strictEqual(events.restartFrom, 1);
  const now = StudyPlan.engine.current(run);
  assert.strictEqual(now.id, "w1");
  assert.strictEqual(now.group.attempt, 2);
  assert.strictEqual(run.answers, answersBefore + 1);
  for (let i = 0; i < 10; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  assert(partOneDone(run), "1–10 passed on the clean attempt");
});

test("strict 5-word checkpoints by default: a miss on word 7 of 1–10 restarts at word 6", () => {
  assert.strictEqual(CONFIG.comprehensive.restartPolicy, "checkpoint");
  const run = StudyPlan.engine.create("comprehensive", ids(10), CONFIG, seeded(2));
  reachGroup(run, 1, 10);
  for (let i = 0; i < 6; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  assert.strictEqual(StudyPlan.engine.answer(run, CONFIG, "f").restartFrom, 6);
  const asked = [];
  for (let i = 0; i < 5; i += 1) { asked.push(StudyPlan.engine.current(run).id); StudyPlan.engine.answer(run, CONFIG, "s"); }
  assert.deepStrictEqual(asked, ["w6", "w7", "w8", "w9", "w10"]);
  assert(partOneDone(run));
});

test("the immediate policy restarts the whole group from word 1", () => {
  const cfg = StudyPlan.merge(CONFIG, { comprehensive: { restartPolicy: "immediate" } });
  const run = StudyPlan.engine.create("comprehensive", ids(10), cfg, seeded(2));
  while (StudyPlan.engine.current(run).group.size !== 10) StudyPlan.engine.answer(run, cfg, "s");
  for (let i = 0; i < 6; i += 1) StudyPlan.engine.answer(run, cfg, "s");
  assert.strictEqual(StudyPlan.engine.answer(run, cfg, "f").restartFrom, 1);
  const asked = [];
  for (let i = 0; i < 10; i += 1) { asked.push(StudyPlan.engine.current(run).id); StudyPlan.engine.answer(run, cfg, "s"); }
  assert.deepStrictEqual(asked, ids(10));
});

test("a hesitant answer counts as right for the group, and is flagged weak", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), CONFIG, seeded(2));
  ["s", "s", "w", "s", "s"].forEach(r => StudyPlan.engine.answer(run, CONFIG, r));
  assert.strictEqual(StudyPlan.engine.current(run).group.from, 6);
  assert.deepStrictEqual(run.marks.w3, { w: 1, f: 0 });
});

test("misses never undo a group already passed, nor the whole quiz", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(15), CONFIG, seeded(3));
  for (let i = 0; i < 5; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  for (let attempt = 0; attempt < 6; attempt += 1) {
    for (let i = 0; i < 5; i += 1) StudyPlan.engine.answer(run, CONFIG, i === 4 ? "f" : "s");
    assert.strictEqual(StudyPlan.engine.current(run).group.index, 1);
    assert.strictEqual(run.passed, 1);
  }
});

test("a group failed mid-way pauses and resumes with earlier groups intact", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(20), CONFIG, seeded(5));
  reachGroup(run, 11, 15);
  StudyPlan.engine.answer(run, CONFIG, "s");
  StudyPlan.engine.answer(run, CONFIG, "f");
  const saved = JSON.parse(JSON.stringify(run));
  const now = StudyPlan.engine.current(saved);
  assert.strictEqual(now.id, "w11");
  assert.strictEqual(now.group.attempt, 2);
  assert.strictEqual(saved.passed, 3, "1–5, 6–10 and 1–10 stay passed");
});

test("finish-attempt and the retry safeguard remain available as policies", () => {
  const fin = StudyPlan.merge(CONFIG, { comprehensive: { restartPolicy: "finish-attempt" } });
  const run = StudyPlan.engine.create("comprehensive", ids(10), fin, seeded(2));
  for (let i = 0; i < 5; i += 1) StudyPlan.engine.answer(run, fin, "s");
  ["s", "f", "s", "s"].forEach(r => StudyPlan.engine.answer(run, fin, r));
  assert.strictEqual(StudyPlan.engine.current(run).id, "w10", "carries on after the miss");
  assert(StudyPlan.engine.answer(run, fin, "s").groupRetry);
  const capped = StudyPlan.merge(CONFIG, { comprehensive: { maxGroupAttempts: 3 } });
  const c = StudyPlan.engine.create("comprehensive", ids(5), capped, seeded(4));
  let events = {};
  let guard = 0;
  while (!events.forced && guard++ < 50) events = StudyPlan.engine.answer(c, capped, "f");
  assert(events.forced && events.groupPassed);
});

section("Comprehensive quiz: Part 2, spaced retrieval");

test("Part 2 asks every word, shuffled, once if Part 1 was clean, more if it was not", () => {
  const words = ids(20);
  const run = StudyPlan.engine.create("comprehensive", words, CONFIG, seeded(4));
  const once = new Set();
  while (run.phase === "groups") {
    const id = StudyPlan.engine.current(run).id;
    let r = "s";
    if (id === "w3" && !once.has("w3")) { r = "f"; once.add("w3"); }
    if (id === "w5" && !once.has("w5")) { r = "w"; once.add("w5"); }
    StudyPlan.engine.answer(run, CONFIG, r);
  }
  const part2 = drive(run, () => "s").map(now => now.id);
  assert.deepStrictEqual([...new Set(part2)].sort(), words.slice().sort(), "every word, no others");
  assert.notDeepStrictEqual(part2.slice(0, 20), words, "no positional cues");
  const count = id => part2.filter(x => x === id).length;
  assert.strictEqual(count("w3"), 3, "missed in Part 1: three right answers to retire");
  assert.strictEqual(count("w5"), 2, "hesitant: two");
  assert.strictEqual(count("w1"), 1, "clean: once");
  assert.strictEqual(part2[0], "w3", "the missed word comes first");
});

test("the measured answer is each word's first Part 2 answer, kept apart from practice", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(6), CONFIG, seeded(9));
  const firstInPart2 = {};
  drive(run, (id, now) => {
    if (now.phase !== "srs") return "s";
    const r = id === "w2" && !("w2" in firstInPart2) ? "f" : "s";
    if (!(id in firstInPart2)) firstInPart2[id] = r;
    return r;
  });
  assert.deepStrictEqual(run.scored, firstInPart2);
  assert.strictEqual(run.scoreAt, "srs");
});

test("spaced parts never ask the same word twice running while others remain", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(8), CONFIG, seeded(5));
  while (run.phase === "groups") StudyPlan.engine.answer(run, CONFIG, StudyPlan.engine.current(run).id === "w2" && run.answers < 3 ? "f" : "s");
  let last = null;
  const rand = seeded(9);
  while (!run.done) {
    const now = StudyPlan.engine.current(run);
    if (StudyPlan.srs.stats(run.srs).live > 1) assert.notStrictEqual(now.id, last);
    last = now.id;
    StudyPlan.engine.answer(run, CONFIG, rand() < 0.3 ? "f" : "s");
  }
});

test("a word that keeps failing in Part 2 is let go and flagged for relearning", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(6), CONFIG, seeded(7));
  const answers = drive(run, id => (run.phase === "srs" && id === "w4" ? "f" : "s"));
  assert.deepStrictEqual(run.relearn, ["w4"]);
  assert.strictEqual(answers.filter(a => a.phase === "srs" && a.id === "w4").length, CONFIG.comprehensive.relearnAfterMisses);
  const record = StudyPlan.srs.wordRecords(run, () => null, "2026-11-16", { source: "t" }).w4;
  assert.strictEqual(record.relearn, true);
});

test("a groups-only comprehensive quiz is still available, measured on the last group", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), GROUPS_ONLY, seeded(2));
  drive(run, () => "s", 5000, GROUPS_ONLY);
  assert.strictEqual(run.scoreAt, "final-group");
  assert.strictEqual(Object.keys(run.scored).length, 10);
});

test("same-session repetition never inflates memory or stars", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(5), CONFIG, seeded(6));
  for (let attempt = 0; attempt < 4; attempt += 1) {
    for (let i = 0; i < 4; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
    StudyPlan.engine.answer(run, CONFIG, "f");
  }
  drive(run, () => "s");
  assert(run.log.filter(([id]) => id === "w1").length >= 5);
  const proposals = StudyPlan.srs.proposals(run, () => ({ l: 0 }), "2026-11-16");
  assert.strictEqual(proposals.length, 5, "one star proposal per word");
  assert.strictEqual(proposals.find(p => p.id === "w1").to, 2, "many right answers in one sitting are still ★★");
  const records = StudyPlan.srs.wordRecords(run, () => null, "2026-11-16", { source: "d0" });
  assert.strictEqual(records.w1.seen, 1, "one retrieval on the long-term record");
  assert.strictEqual(records.w1.s, CONFIG.srs.initialStability.s, "starting stability, not more");
  assert(records.w5.s < records.w1.s, "the word missed four times while learning starts lower");
  assert(records.w5.d > records.w1.d, "and harder");
});

/* =========================================================================
   MEMORY MODEL
   ========================================================================= */
section("Memory model (SRS)");

const M = CONFIG.srs;
const learnt = (result, date) => StudyMemory.apply(null, { result, date, kind: "learn", source: "c" }, M).record;

test("retention decays with real calendar time, whatever the study schedule did", () => {
  const record = learnt("s", "2026-11-01");
  const after1 = StudyMemory.retention(record, "2026-11-02", M);
  const after14 = StudyMemory.retention(record, "2026-11-15", M);
  assert(Math.abs(after1 - 0.9) < 1e-9, "one day after learning, at stability 1, R = 90%");
  assert(after14 < 0.25, "fourteen days later it is treated as fourteen days: " + after14);
  assert(StudyMemory.status(record, "2026-11-15", M).overdue);
  assert(!StudyMemory.status(record, "2026-11-01", M).isDue);
  assert(StudyMemory.status(record, "2026-11-02", M).isDue);
});

test("a successful delayed recall grows stability; a later one more than an early one", () => {
  const base = learnt("s", "2026-11-01");
  const onTime = StudyMemory.apply(base, { result: "s", date: "2026-11-02", source: "r1" }, M).record;
  const late = StudyMemory.apply(base, { result: "s", date: "2026-11-08", source: "r1" }, M).record;
  const weak = StudyMemory.apply(base, { result: "w", date: "2026-11-02", source: "r1" }, M).record;
  assert(onTime.s > base.s * 2, "on time: " + onTime.s);
  assert(late.s > onTime.s, "recalled late, after more forgetting, grows more");
  assert(weak.s > base.s && weak.s < onTime.s, "hesitant grows a little");
  assert.strictEqual(onTime.gap, 1);
  assert.strictEqual(late.gap, 7);
});

test("a failed recall cuts stability, raises difficulty and flags relearning", () => {
  let record = learnt("s", "2026-11-01");
  record = StudyMemory.apply(record, { result: "s", date: "2026-11-02", source: "r1" }, M).record;
  record = StudyMemory.apply(record, { result: "s", date: "2026-11-05", source: "r2" }, M).record;
  const strong = record.s;
  const failed = StudyMemory.apply(record, { result: "f", date: "2026-11-20", source: "r3" }, M).record;
  assert(failed.s < strong * 0.5);
  assert(failed.d > record.d);
  assert.strictEqual(failed.relearn, true);
  assert.strictEqual(failed.lapses, 1);
  const back = StudyMemory.apply(failed, { result: "s", date: "2026-11-21", source: "r4" }, M).record;
  assert.strictEqual(back.relearn, false, "a later strong recall clears relearning");
});

test("a second right answer on the same calendar day adds no stability", () => {
  const record = learnt("s", "2026-11-01");
  const again = StudyMemory.apply(record, { result: "s", date: "2026-11-01", source: "r1" }, M).record;
  assert.strictEqual(again.s, record.s);
});

test("the same quiz is never applied to a word twice", () => {
  const record = learnt("s", "2026-11-01");
  const once = StudyMemory.apply(record, { result: "s", date: "2026-11-03", source: "d2:review" }, M);
  const twice = StudyMemory.apply(once.record, { result: "s", date: "2026-11-03", source: "d2:review" }, M);
  assert(once.applied && !twice.applied);
  assert.strictEqual(twice.record.seen, once.record.seen);
  assert.strictEqual(twice.record.s, once.record.s);
});

test("records written before the memory model are read from their last result", () => {
  const legacy = { last: "2026-11-14", seen: 1, right: 1, result: "s", gap: null };
  const st = StudyMemory.state(legacy, M);
  assert(st.learnt);
  assert.strictEqual(st.s, M.initialStability.s);
  const next = StudyMemory.apply(legacy, { result: "s", date: "2026-11-17", source: "d1:review" }, M).record;
  assert.strictEqual(next.seen, 2);
  assert(next.s > st.s);
});

test("the sync keeps the copy of a word with more retrievals", () => {
  const a = StudyMemory.apply(learnt("s", "2026-11-01"), { result: "s", date: "2026-11-02", source: "r1" }, M).record;
  const b = learnt("s", "2026-11-01");
  assert.strictEqual(StudyPlanStore.better(Object.assign({ at: "1" }, a), Object.assign({ at: "2" }, b)).seen, 2);
});

/* =========================================================================
   ADAPTIVE REVIEW SELECTION
   ========================================================================= */
section("Adaptive review: selection");

/* Candidates in each state, for the selector alone. */
function candidate(id, state, today) {
  const t = today || "2026-12-01";
  const ago = n => addDays(t, -n);
  const shapes = {
    failed: { record: { last: ago(2), first: ago(10), s: 0.5, d: 7, seen: 3, right: 2, result: "f", recent: "ssf", relearn: true, lapses: 1 }, stars: 1 },
    weakstar: { record: { last: ago(1), first: ago(3), s: 1, d: 5, seen: 1, right: 1, result: "w", recent: "w" }, stars: 1 },
    developing: { record: { last: ago(2), first: ago(9), s: 3, d: 5, seen: 2, right: 2, result: "s", recent: "ss" }, stars: 2 },
    mastered: { record: { last: ago(5), first: ago(40), s: 30, d: 4, seen: 5, right: 5, result: "s", recent: "sssss" }, stars: 3 },
    overdueMastered: { record: { last: ago(90), first: ago(120), s: 20, d: 4, seen: 5, right: 5, result: "s", recent: "sssss" }, stars: 3 }
  };
  return Object.assign({ id, unit: "u" }, JSON.parse(JSON.stringify(shapes[state])));
}
function makePool(spec, today) {
  const out = [];
  Object.entries(spec).forEach(([state, n]) => { for (let i = 0; i < n; i += 1) out.push(candidate(state + i, state, today)); });
  return out;
}
const pick = (candidates, extra) => ReviewSelector.select(Object.assign({ candidates, today: "2026-12-01", config: CONFIG.adaptiveReview, memory: M, seed: "x" }, extra || {}));

test("55 distinct words by default, never more than 60, never a duplicate", () => {
  const candidates = makePool({ failed: 40, developing: 120, mastered: 100 });
  const sel = pick(candidates.concat(candidates.slice(0, 20)));
  assert.strictEqual(sel.ids.length, 55);
  assert.strictEqual(new Set(sel.ids).size, 55);
  const big = pick(candidates, { config: StudyPlan.merge(CONFIG.adaptiveReview, { targetUniqueWords: 60 }) });
  assert(big.ids.length <= 60);
});

test("the default composition is 30 weak/overdue, 15 developing, 10 mastered when each has enough", () => {
  const sel = pick(makePool({ failed: 40, developing: 120, mastered: 100 }));
  assert.deepStrictEqual(sel.counts, { weak: 30, developing: 15, mastered: 10 });
});

test("weak, failed and overdue words come first", () => {
  const sel = pick(makePool({ failed: 12, overdueMastered: 6, developing: 120, mastered: 100 }));
  for (let i = 0; i < 12; i += 1) assert(sel.ids.includes("failed" + i), "failed" + i);
  for (let i = 0; i < 6; i += 1) {
    assert(sel.ids.includes("overdueMastered" + i), "a ★★★ word gone overdue is reviewed");
    assert.strictEqual(sel.picks["overdueMastered" + i].tier, "weak");
    assert.strictEqual(sel.picks["overdueMastered" + i].reason, "overdue");
  }
});

test("quotas a tier cannot fill go to the best remaining words, never to duplicates", () => {
  const sel = pick(makePool({ failed: 5, developing: 200 }));
  assert.strictEqual(sel.ids.length, 55);
  assert.strictEqual(sel.counts.weak, 5);
  assert.strictEqual(sel.counts.mastered, 0);
  assert.strictEqual(sel.counts.developing, 50);
  assert.strictEqual(new Set(sel.ids).size, 55);
});

test("fewer than 50 learnt words: all of them, no filler", () => {
  const candidates = makePool({ developing: 31, failed: 4 });
  const sel = pick(candidates);
  assert.strictEqual(sel.ids.length, 35);
  assert.deepStrictEqual(sel.ids.slice().sort(), candidates.map(c => c.id).sort());
});

test("mastered words are still checked — by due-ness, time and coverage, not at random", () => {
  const today = "2026-12-01";
  const pool = makePool({ failed: 40, developing: 100 }, today);
  for (let i = 0; i < 40; i += 1) {
    const c = candidate("m" + i, "mastered", today);
    c.record.last = addDays(today, -(i + 1));
    pool.push(c);
  }
  const sel = pick(pool, { config: StudyPlan.merge(CONFIG.adaptiveReview, { includeControlledRandomness: false }) });
  const chosen = sel.ids.filter(id => id.startsWith("m")).map(id => Number(id.slice(1))).sort((a, b) => a - b);
  assert.strictEqual(chosen.length, 10);
  assert.deepStrictEqual(chosen, [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], "the ten longest unseen");
});

test("the same inputs give the same selection (the home page's preview is the quiz's)", () => {
  const candidates = makePool({ failed: 20, developing: 80, mastered: 40 });
  assert.deepStrictEqual(pick(candidates).ids, pick(candidates).ids);
  assert.notDeepStrictEqual(pick(candidates).ids, pick(candidates, { seed: "other day" }).ids, "another day, another shuffle");
});

test("randomness varies the pick among equals but never outranks an urgent word", () => {
  const pool = makePool({ developing: 200 });
  pool.push(candidate("urgent", "overdueMastered"));
  const seen = new Set();
  for (let s = 0; s < 20; s += 1) {
    const sel = pick(pool, { seed: "day" + s });
    assert(sel.ids.includes("urgent"), "seed " + s);
    sel.ids.forEach(id => seen.add(id));
  }
  assert(seen.size > 70, "different days pick different developing words: " + seen.size);
});

test("a word picked three reviews running sits the next one out — unless there is nothing else", () => {
  const pool = makePool({ failed: 3, developing: 100 });
  const history = [1, 2, 3].map(n => ({ day: 10 - n, on: addDays("2026-12-01", -n), ids: ["failed0", "failed1"], results: { failed0: "f", failed1: "f" } }));
  const sel = pick(pool, { history });
  assert(!sel.ids.includes("failed0") && !sel.ids.includes("failed1"));
  assert(sel.ids.includes("failed2"));
  const tiny = pick(makePool({ failed: 3 }), { history });
  assert.strictEqual(tiny.ids.length, 3, "a small pool still asks them");
});

test("after a review that went well the quotas lean toward older and known words; after a bad one, toward the weak", () => {
  const pool = makePool({ failed: 60, developing: 120, mastered: 100 });
  const good = [{ day: 1, on: "2026-11-30", ids: ["x"], results: Object.fromEntries(ids(20, "a").map(id => [id, "s"])) }];
  const bad = [{ day: 1, on: "2026-11-30", ids: ["x"], results: Object.fromEntries(ids(20, "a").map((id, i) => [id, i < 10 ? "f" : "s"])) }];
  assert.deepStrictEqual(pick(pool, { history: good }).counts, { weak: 25, developing: 18, mastered: 12 });
  assert.deepStrictEqual(pick(pool, { history: bad }).counts, { weak: 35, developing: 15, mastered: 5 });
});

test("backlog statistics, and a gentle recommendation only when it stays large", () => {
  const pool = makePool({ failed: 80, developing: 100, overdueMastered: 50 });
  const sel = pick(pool);
  assert.strictEqual(sel.stats.eligible, 230);
  assert(sel.stats.due >= 130, "due " + sel.stats.due);
  assert.strictEqual(sel.stats.capacity, 55);
  assert(sel.stats.retention > 0 && sel.stats.retention < 1);
  assert.strictEqual(sel.stats.recommendSlowerIntake, false, "one heavy day is not a trend");
  const heavy = [1, 2].map(n => ({ day: 10 - n, on: addDays("2026-12-01", -n), ids: [], stats: { due: 200 } }));
  assert.strictEqual(pick(pool, { history: heavy }).stats.recommendSlowerIntake, true);
});

test("optional retries shrink the selection so the quiz stays within 60 presentations", () => {
  const cfg = StudyPlan.merge(CONFIG.adaptiveReview, { sameSessionRetries: 1 });
  const sel = pick(makePool({ failed: 40, developing: 120 }), { config: cfg });
  assert.strictEqual(sel.ids.length, 50);
});

section("Adaptive review: in the plan");

test("the review pool is every earlier unit's words, never today's new unit", () => {
  const w = world([12, 14, 9, 11]);
  ["2026-11-16", "2026-11-17", "2026-11-18"].forEach(date => studyDay(w, date, () => "s"));
  const task = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-11-19").tasks.find(t => t.key === "review");
  assert.deepStrictEqual(task.units, [0, 1, 2]);
  const sel = StudyPlan.selectReview(CONFIG, task, w.units, w.repo.words(), () => 2, w.repo.tasks(), "2026-11-19");
  assert.strictEqual(sel.pool, 35);
  assert.strictEqual(sel.ids.length, 35);
  assert(sel.ids.every(id => !w.units[3].ids.includes(id)), "no word from unit 4, today's new one");
});

test("a word shared with today's unit waits for tomorrow", () => {
  const w = world([6, 6]);
  w.units[1].ids[0] = w.units[0].ids[0];
  studyDay(w, "2026-11-16", () => "s");
  const task = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-11-17").tasks[1];
  const sel = StudyPlan.selectReview(CONFIG, task, w.units, w.repo.words(), () => 2, w.repo.tasks(), "2026-11-17");
  assert(!sel.ids.includes(w.units[0].ids[0]));
  assert.strictEqual(sel.ids.length, 5);
});

/* =========================================================================
   ADAPTIVE REVIEW QUIZ
   ========================================================================= */
section("Adaptive review: the quiz");

test("one attempt per word, in the frozen order, then done", () => {
  const order = ["c", "a", "e", "b", "d"];
  const run = StudyPlan.engine.create("review", order, CONFIG, seeded(1), { policy: "adaptiveReview" });
  const asked = drive(run, id => (id === "e" ? "f" : id === "b" ? "w" : "s"));
  assert.deepStrictEqual(asked.map(a => a.id), order);
  assert.strictEqual(run.answers, 5);
  assert.deepStrictEqual(run.scored, { c: "s", a: "s", e: "f", b: "w", d: "s" });
  const out = StudyPlan.engine.outcome(run);
  assert.deepStrictEqual(out.failed, ["e"]);
  assert.deepStrictEqual(out.weak, ["b"]);
});

test("a miss does not restart anything: the next word follows", () => {
  const run = StudyPlan.engine.create("review", ids(10), CONFIG, seeded(1), { policy: "adaptiveReview" });
  const events = StudyPlan.engine.answer(run, CONFIG, "f");
  assert(!events.restarted && !events.groupRetry);
  assert.strictEqual(StudyPlan.engine.current(run).id, "w2");
});

test("optional second tries stay within the presentation cap and do not change the score", () => {
  const cfg = StudyPlan.merge(CONFIG, { adaptiveReview: { sameSessionRetries: 1, maxPresentations: 12 } });
  const run = StudyPlan.engine.create("review", ids(10), cfg, seeded(1), { policy: "adaptiveReview" });
  const asked = drive(run, (id, now) => (now.phase === "recall" && Number(id.slice(1)) <= 5 ? "f" : "s"), 1000, cfg);
  assert.strictEqual(asked.length, 12, "ten words, two retries before the cap");
  assert.strictEqual(Object.values(run.scored).filter(r => r === "f").length, 5, "the first answer still counts");
});

test("the review's tiers are kept on the run and reported", () => {
  const tiers = { a: "weak", b: "developing", c: "mastered" };
  const run = StudyPlan.engine.create("review", ["a", "b", "c"], CONFIG, seeded(1), { policy: "adaptiveReview", tiers });
  assert.strictEqual(StudyPlan.engine.current(run).tier, "weak");
  drive(run, id => (id === "a" ? "f" : "s"));
  const out = StudyPlan.engine.outcome(run);
  assert.deepStrictEqual(out.byTier.weak.failed, ["a"]);
  assert.strictEqual(out.byTier.mastered.strong.length, 1);
});

/* =========================================================================
   SCORING, STARS AND MEMORY TOGETHER
   ========================================================================= */
section("Scoring, stars and memory");

test("a review updates exactly its selected words — the others are untouched", () => {
  const w = world([30, 30, 30]);
  w.units.forEach((_, i) => studyDay(w, addDays("2026-11-16", i), () => "s"));
  const before = JSON.parse(JSON.stringify(w.repo.words()));
  const date = "2026-11-20";
  const task = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), date).tasks[0];
  assert.strictEqual(task.key, "review");
  const { selection } = runTask(w, task, date, () => "s");
  const after = w.repo.words();
  Object.keys(after).forEach(id => {
    if (selection.ids.includes(id)) assert.strictEqual(after[id].seen, before[id].seen + 1, id);
    else assert.strictEqual(after[id].seen, before[id].seen, id + " was not selected");
  });
});

test("delayed success raises stars and stability together; a forgotten ★★★ word drops both", () => {
  const w = world([8, 8]);
  studyDay(w, "2026-11-16", () => "s");
  const id = w.units[0].ids[0];
  assert.strictEqual(starLevel(w, id), 2, "clean on the day it was learnt: ★★");
  studyDay(w, "2026-11-17", () => "s");
  assert.strictEqual(starLevel(w, id), 3, "clean again on a later day: ★★★");
  const s1 = w.repo.word(id).s;
  assert(s1 > CONFIG.srs.initialStability.s);
  const task = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-12-20").tasks[0];
  runTask(w, task, "2026-12-20", wordId => (wordId === id ? "f" : "s"));
  assert.strictEqual(starLevel(w, id), 2, "a genuine lapse costs the third star");
  assert(w.repo.word(id).s < s1);
  assert.strictEqual(w.repo.word(id).relearn, true);
});

test("a recognition answer (한국어 → English) can keep or cost a star, never raise one", () => {
  const run = StudyPlan.engine.create("review", ["a", "b", "c"], CONFIG, seeded(3), { policy: "adaptiveReview", dirOf: { a: "ko>en", b: "ko>en", c: "en>ko" } });
  drive(run, id => (id === "b" ? "f" : "s"));
  const byId = Object.fromEntries(StudyPlan.srs.proposals(run, () => ({ l: 2, d: "2026-11-01" }), "2026-11-16").map(p => [p.id, p]));
  assert.strictEqual(byId.a.to, 2);
  assert.strictEqual(byId.b.to, 1);
  assert.strictEqual(byId.c.to, 3);
});

test("finishing the same quiz twice (a retried save) applies its memory updates once", () => {
  const w = world([10, 10]);
  studyDay(w, "2026-11-16", () => "s");
  const { run } = runTask(w, StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-11-17").tasks[1], "2026-11-17", () => "s");
  const once = JSON.parse(JSON.stringify(w.repo.words()));
  w.repo.setWords(StudyPlan.srs.wordRecords(run, id => w.repo.word(id), "2026-11-17", { source: "d1:review", memory: M }));
  const twice = w.repo.words();
  Object.keys(once).forEach(id => {
    assert.strictEqual(twice[id].seen, once[id].seen, id);
    assert.strictEqual(twice[id].s, once[id].s, id);
  });
});

test("a calendar gap shows in the review's estimates even though the study day did not move", () => {
  const w = world([20, 20, 20]);
  studyDay(w, "2026-11-16", () => "s");
  const task = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-11-17").tasks[1];
  const soon = StudyPlan.selectReview(CONFIG, task, w.units, w.repo.words(), () => 2, w.repo.tasks(), "2026-11-17");
  const later = StudyPlan.selectReview(CONFIG, task, w.units, w.repo.words(), () => 2, w.repo.tasks(), "2026-12-01");
  assert.strictEqual(StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-12-01").index, 1);
  assert(later.stats.retention < soon.stats.retention - 0.3, soon.stats.retention + " → " + later.stats.retention);
  assert(later.stats.overdue > soon.stats.overdue);
});

/* =========================================================================
   PAUSE AND RESUME
   ========================================================================= */
section("Pause and resume");

for (const algorithm of ["comprehensive", "review"]) {
  test(algorithm + ": a run saved as JSON after any answer resumes on the same question", () => {
    const answerFor = learner(0.4, algorithm.length * 7);
    let saved = JSON.parse(JSON.stringify(StudyPlan.engine.create(algorithm, ids(23), CONFIG, seeded(19))));
    let checks = 0;
    while (!saved.done) {
      const before = StudyPlan.engine.current(saved);
      const copy = JSON.parse(JSON.stringify(saved));
      assert.deepStrictEqual(StudyPlan.engine.current(copy), before);
      StudyPlan.engine.answer(copy, CONFIG, answerFor(before.id), 900);
      saved = JSON.parse(JSON.stringify(copy));
      assert(++checks < 5000);
    }
    assert.strictEqual(StudyPlan.engine.progress(saved), 1);
  });
}

test("a review's selection is frozen in its record: resuming asks the same words, whatever changed since", () => {
  const w = world([40, 40, 40]);
  studyDay(w, "2026-11-16", () => "s");
  studyDay(w, "2026-11-17", () => "s");
  const task = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), "2026-11-18").tasks[1];
  const sel = StudyPlan.selectReview(CONFIG, task, w.units, w.repo.words(), () => 2, w.repo.tasks(), "2026-11-18");
  const run = StudyPlan.engine.create("review", sel.ids, CONFIG, seeded(1));
  for (let i = 0; i < 7; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  w.repo.saveTask(task.id, { status: "started", n: 7, run, selection: sel }, w.repo.versionOf(null));
  /* A week later, with different stars, a fresh selection would differ… */
  const fresh = StudyPlan.selectReview(CONFIG, task, w.units, w.repo.words(), () => 0, w.repo.tasks(), "2026-11-25");
  assert.notDeepStrictEqual(fresh.ids, sel.ids);
  /* …but the record holds the frozen one, and the run picks up at word 8. */
  const held = w.repo.task(task.id);
  assert.deepStrictEqual(held.selection.ids, sel.ids);
  assert.strictEqual(StudyPlan.engine.current(held.run).id, sel.ids[7]);
});

/* =========================================================================
   PERSISTENCE
   ========================================================================= */
section("Persistence");

test("a save is refused when another tab wrote the quiz first", () => {
  const storage = memoryStorage();
  const tabA = StudyPlanStore.open("plan", storage);
  const tabB = StudyPlanStore.open("plan", storage);
  const first = tabA.saveTask("t", { status: "started", n: 1 }, tabA.versionOf(null));
  const seenByB = tabB.versionOf(tabB.task("t"));
  assert(tabA.saveTask("t", { status: "started", n: 2 }, first.seen).ok);
  assert(tabB.saveTask("t", { status: "started", n: 2 }, seenByB).conflict);
});

test("starting a quiz twice (refresh, two tabs) makes one record", () => {
  const storage = memoryStorage();
  const tabA = StudyPlanStore.open("plan", storage);
  const tabB = StudyPlanStore.open("plan", storage);
  assert(tabA.saveTask("t", { status: "started", n: 0 }, tabA.versionOf(null)).ok);
  assert(tabB.saveTask("t", { status: "started", n: 0 }, tabB.versionOf(null)).conflict);
  assert.strictEqual(Object.keys(tabA.tasks()).length, 1);
});

test("a finished quiz is never un-finished by a copy that was behind", () => {
  const done = { status: "done", n: 300, at: "2026-11-16T10:00:00Z" };
  const behind = { status: "started", n: 310, at: "2026-11-16T11:00:00Z" };
  assert.strictEqual(StudyPlanStore.better(done, behind), done);
  assert.strictEqual(StudyPlanStore.better(behind, done), done);
});

test("cloud-sync carries plan keys and settles them by the same rule", () => {
  const source = fs.readFileSync(path.join(__dirname, "cloud-sync.js"), "utf8");
  assert(/korean\.studyPlan:/.test(source));
  assert(/isPlan\(row\.store_key\)/.test(source));
});

test("two tabs completing the last quiz cannot advance the day twice", () => {
  const storage = memoryStorage();
  const tabA = StudyPlanStore.open("plan", storage);
  const tabB = StudyPlanStore.open("plan", storage);
  const id = StudyPlan.today(CONFIG, UNITS, tabA.tasks(), "2026-11-16").tasks[0].id;
  const seenA = tabA.versionOf(null);
  const seenB = tabB.versionOf(null);
  tabA.saveTask(id, { status: "done", completedOn: "2026-11-16", n: 1 }, seenA);
  tabB.saveTask(id, { status: "done", completedOn: "2026-11-16", n: 1 }, seenB);
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, tabA.tasks(), "2026-11-17").index, 1);
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, tabB.tasks(), "2026-11-30").index, 1);
  tabA.setState({ day: 1, on: "2026-11-17" });
  tabB.setState({ day: 0, on: "2026-11-16" });
  assert.strictEqual(tabA.state().day, 1, "the recorded day never goes back");
});

test("word records are written in one batch and keep their retrieval count for merges", () => {
  const repo = StudyPlanStore.open("plan", memoryStorage());
  repo.setWords({ a: { seen: 3, last: "2026-11-16" }, b: { seen: 2, relearn: true } });
  assert.strictEqual(repo.word("a").n, 3);
  assert.strictEqual(repo.words().b.relearn, true);
});

test("the unit cache keeps each unit's word ids", () => {
  const storage = memoryStorage();
  StudyPlanStore.cacheUnits("plan", [{ id: "u1", label: "One", number: 1, ids: ["a", "b"] }], storage);
  assert.deepStrictEqual(StudyPlanStore.cachedUnits("plan", storage)[0].ids, ["a", "b"]);
});

test("SpacedSession: a restored session continues identically", () => {
  const items = ids(12).map((id, i) => ({ id, item: id, box: i % 3 }));
  const original = SpacedSession.create({ items, retireAt: 3 });
  for (let i = 0; i < 7; i += 1) original.grade(original.next(), i % 3 !== 0);
  const copy = SpacedSession.create({ restore: JSON.parse(JSON.stringify(original.snapshot())) });
  assert.deepStrictEqual(copy.snapshot(), original.snapshot());
});

/* =========================================================================
   SIMULATIONS
   ========================================================================= */
section("Simulations over 120 study days");

/* Run `days` study days with a learner, skipping calendar days now and then,
   and check every invariant on the way. */
function simulate(sizes, days, seed, skipEvery) {
  const w = world(sizes);
  const answerFor = realistic(w, seed);
  let date = "2026-11-16";
  const taught = [];
  const lastPicked = new Map();
  let maxWait = 0;
  const reviews = [];
  let answers = 0;
  for (let d = 0; d < days; d += 1) {
    const day = StudyPlan.today(CONFIG, w.unitIds, w.repo.tasks(), date);
    assert.strictEqual(day.index, d, "one study day per active day");
    assert(day.tasks.length <= 2);
    const before = w.log.length;
    studyDay(w, date, answerFor);
    w.log.slice(before).forEach(entry => {
      answers += entry.run.answers;
      if (entry.task.algorithm === "comprehensive") { taught.push(entry.task.units[0]); return; }
      const sel = entry.selection;
      assert(sel.ids.length <= CONFIG.adaptiveReview.maximumUniqueWords);
      assert.strictEqual(new Set(sel.ids).size, sel.ids.length);
      if (d < sizes.length) assert(sel.ids.every(id => !w.units[d].ids.includes(id)), "never today's unit");
      const eligible = new Set(entry.task.units.flatMap(u => w.units[u].ids));
      assert(sel.ids.every(id => eligible.has(id)), "only learnt words");
      assert.strictEqual(entry.run.answers, sel.ids.length, "one attempt per word");
      sel.ids.forEach(id => { lastPicked.set(id, d); });
      reviews.push({ day: d, size: sel.ids.length, stats: sel.stats, counts: sel.counts });
    });
    /* How long the longest-waiting learnt word has gone without a review. */
    for (let u = 0; u < Math.min(d, sizes.length); u += 1) {
      w.units[u].ids.forEach(id => { maxWait = Math.max(maxWait, d - (lastPicked.has(id) ? lastPicked.get(id) : u)); });
    }
    date = addDays(date, skipEvery && d % skipEvery === skipEvery - 1 ? 3 : 1);
  }
  assert.deepStrictEqual(taught, Array.from({ length: Math.min(days, sizes.length) }, (_, i) => i), "each unit once, in order");
  return { w, reviews, maxWait, answers };
}

test("the TOPIK II plan's shape (7 units of 52–60) over 120 study days, with missed days", () => {
  const sizes = [52, 56, 60, 53, 55, 58, 54];
  const { reviews, maxWait, answers, w } = simulate(sizes, 120, 7, 9);
  assert.strictEqual(reviews.length, 119);
  reviews.forEach(r => assert.strictEqual(r.size, Math.min(55, sizes.slice(0, Math.min(r.day, 7)).reduce((a, b) => a + b, 0)), "day " + r.day));
  assert(maxWait <= 21, "every learnt word is reviewed at least every three weeks: " + maxWait);
  const retention = reviews[reviews.length - 1].stats.retention;
  assert(retention > 0.75, "estimated retention stays high: " + retention);
  const totalWords = sizes.reduce((a, b) => a + b, 0);
  const mastered = Object.values(w.stars).filter(s => s.l === 3).length;
  console.log("      7 units: " + Math.round(answers / 120) + " answers a day on average, longest wait " + maxWait
    + " days, retention " + Math.round(retention * 100) + "%, ★★★ " + mastered + "/" + totalWords);
});

test("a long collection (40 units of 50) over 120 study days: no starvation, backlog flagged", () => {
  const sizes = Array.from({ length: 40 }, () => 50);
  const { reviews, maxWait, answers } = simulate(sizes, 120, 11);
  reviews.forEach(r => assert.strictEqual(r.size, Math.min(55, Math.min(r.day, 40) * 50), "day " + r.day));
  /* 2,000 words and 55 review slots a day: going round them all once takes
     about 37 days, so no word should wait much more than twice that. */
  const lap = Math.ceil(sizes.reduce((x, y) => x + y, 0) / CONFIG.adaptiveReview.targetUniqueWords);
  assert(maxWait <= 2 * lap, "older words keep coming back: longest wait " + maxWait + " days, a lap is " + lap);
  const flagged = reviews.filter(r => r.stats.recommendSlowerIntake).length;
  console.log("      40 units: " + Math.round(answers / 120) + " answers a day, longest wait " + maxWait + " days, backlog recommendation on "
    + flagged + " of " + reviews.length + " reviews, final due " + reviews[reviews.length - 1].stats.due);
  assert(flagged > 0, "a backlog this size is pointed out");
});

/* =========================================================================
   THE REAL COLLECTION, AND ANSWER CHECKING
   ========================================================================= */
section("TOPIK I · Complete Guide vocab");

const bankConfig = ReviewBanks.BANKS.find(bank => bank.id === StudyPlan.PLANS[0].collection.bank);
const context = vm.createContext({});
context.window = context;
const built = ReviewBanks.build(bankConfig, fs.readFileSync(path.join(ROOT, bankConfig.href), "utf8"),
  { window: context, Function: vm.runInContext("Function", context) });
const allGroups = built.modes.find(mode => mode.id === StudyPlan.PLANS[0].collection.grouping).groups;
const unitGroups = StudyPlanStore.pickUnits(allGroups, StudyPlan.PLANS[0].collection.units);
const BOOK_ORDER = ["p1l", "p1r", "p2l", "p2r", "m1l", "m1r", "m2l", "m2r"];

test("the plan uses all 64 units, book by book, type by type", () => {
  assert.deepStrictEqual(unitGroups.map(g => g.id),
    BOOK_ORDER.flatMap(book => [1, 2, 3, 4, 5, 6, 7, 8].map(n => "unit-" + book + "-" + n)));
  const covered = unitGroups.flatMap(group => group.ids);
  assert.strictEqual(new Set(covered).size, covered.length, "no word in two units");
  unitGroups.forEach(group => {
    const book = group.id.split("-")[1];
    assert(group.ids.every(id => id.startsWith(book + "-")), group.id + " holds only its own book's words");
    assert(group.ids.length >= 30 && group.ids.length <= 40, group.id + " has " + group.ids.length + " words");
  });
});

test("the TOPIK II plan is left out of Today's Tasks", () => {
  assert.strictEqual(StudyPlan.PLANS.length, 1);
  assert(!StudyPlan.planById("topik-ii-vocab"));
});

test("the real units' sizes over 120 study days, with missed days: every review full, nothing starves", () => {
  const sizes = unitGroups.map(group => group.ids.length);
  const { reviews, maxWait, answers } = simulate(sizes, 120, 5, 6);
  assert.strictEqual(reviews.length, 119);
  reviews.forEach(r => assert(r.size >= Math.min(50, sizes.slice(0, Math.min(r.day, sizes.length)).reduce((a, b) => a + b, 0)), "day " + r.day + ": " + r.size));
  const lap = Math.ceil(sizes.reduce((x, y) => x + y, 0) / CONFIG.adaptiveReview.targetUniqueWords);
  assert(maxWait <= 2 * lap, "longest wait " + maxWait + " days, a lap is " + lap);
  console.log("      64 units: " + Math.round(answers / 120) + " answers a day, longest wait " + maxWait + " days");
});

test("every real unit's comprehensive quiz runs to the end and measures every word", () => {
  unitGroups.forEach((group, index) => {
    const run = StudyPlan.engine.create("comprehensive", group.ids, CONFIG, seeded(index));
    drive(run, learner(0.4, index));
    assert.strictEqual(Object.keys(run.scored).length, group.ids.length);
  });
});

test("answers are checked the review page's way", () => {
  const check = AnswerCheck.create(built.words, ReviewBanks.romanize);
  const word = built.words.find(w => w.ko === "공부하다");
  const dir = { promptLang: "en", answerLang: "ko" };
  assert(check.check(word, dir, "공부하다"));
  assert(check.check(word, dir, " 공부 하다 "));
  assert(!check.check(word, dir, "좋아하다"));
  assert(!check.check(word, dir, ""));
});

console.log("\n" + passed + " passed" + (failures.length ? ", " + failures.length + " failed" : ""));
if (failures.length) process.exit(1);
