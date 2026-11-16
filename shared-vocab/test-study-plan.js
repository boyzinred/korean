#!/usr/bin/env node
/*
 * Tests for the daily tasks: the scheduler and its combined sessions, the
 * forgiving study-day progression, the three quiz engines over units of any
 * size, checkpoint and resume, the star proposals and word records, the
 * progress repository, and the real TOPIK II units.
 *
 * Run: node shared-vocab/test-study-plan.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");
const SpacedSession = require("./spaced-session.js");
const StudyPlan = require("./study-plan.js");
const StudyPlanStore = require("./study-plan-store.js");
const AnswerCheck = require("./answer-check.js");
const ReviewBanks = require("./review-banks.js");

const ROOT = path.resolve(__dirname, "..");
const CONFIG = StudyPlan.configFor(StudyPlan.PLANS[0]);
/* The comprehensive quiz with its optional spaced Part 2 switched on. */
const WITH_SRS = StudyPlan.merge(CONFIG, { comprehensive: { includeSRSPhase: true } });
let passed = 0;
const failures = [];

function test(name, fn) {
  try { fn(); passed += 1; console.log("  ✓ " + name); }
  catch (error) { failures.push(name); console.log("  ✗ " + name + "\n      " + String(error && error.stack || error).split("\n").slice(0, 3).join("\n      ")); }
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

function finishDay(units, records, date) {
  const day = StudyPlan.today(CONFIG, units, records, date);
  day.tasks.forEach(task => { records[task.id] = { status: "done", completedOn: date }; });
  return day;
}
function addDays(date, n) {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + n);
  return StudyPlan.localDate(d);
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

/* =========================================================================
   SCHEDULING
   ========================================================================= */
section("Scheduling");

const UNIT_COUNT = 150;
const DAYS = StudyPlan.timeline(CONFIG, UNIT_COUNT);
const ALL = DAYS.flat();
const exposuresOf = unit => ALL.flatMap(session => session.exposures
  .filter(e => e.unit === unit).map(e => Object.assign({ day: session.day, key: session.key }, e)));

test("one new unit per study day, in collection order, never twice", () => {
  const comp = ALL.filter(s => s.key === "comprehensive");
  assert.strictEqual(comp.length, UNIT_COUNT);
  comp.forEach(s => assert.deepStrictEqual(s.units, [s.day]));
  DAYS.forEach((sessions, day) => assert(sessions.filter(s => s.key === "comprehensive").length <= 1, "day " + day));
});

test("each unit gets exactly seven exposures, at 0, 1, 3, 7, 14, 21 and 29", () => {
  for (let unit = 0; unit < UNIT_COUNT; unit += 1) {
    const mine = exposuresOf(unit).sort((a, b) => a.day - b.day);
    assert.deepStrictEqual(mine.map(e => e.day - unit), [0, 1, 3, 7, 14, 21, 29], "unit " + unit);
    assert.deepStrictEqual(mine.map(e => e.key),
      ["comprehensive", "earlyReview", "earlyReview", "intermediateReview", "intermediateReview", "maintenance", "maintenance"]);
    assert.deepStrictEqual(mine.map(e => e.n), [1, 1, 2, 3, 4, 1, 2], "Review 1–4, Maintenance 1–2");
  }
});

test("seven exposures span 30 study days", () => {
  const days = exposuresOf(10).map(e => e.day);
  assert.strictEqual(Math.max(...days) - Math.min(...days) + 1, 30);
});

test("Early Review combines the units learnt 1 and 3 study days ago", () => {
  assert.deepStrictEqual(DAYS[40].find(s => s.key === "earlyReview").units, [39, 37]);
});

test("Intermediate Review combines the units learnt 7 and 14 study days ago", () => {
  assert.deepStrictEqual(DAYS[40].find(s => s.key === "intermediateReview").units, [33, 26]);
});

test("Maintenance combines the units learnt 21 and 29 study days ago", () => {
  assert.deepStrictEqual(DAYS[40].find(s => s.key === "maintenance").units, [19, 11]);
});

test("ramp-up: only sessions with an eligible unit, partial pairs allowed", () => {
  const keysOn = day => DAYS[day].map(s => s.key + ":" + s.units.join(","));
  assert.deepStrictEqual(keysOn(0), ["comprehensive:0"]);
  assert.deepStrictEqual(keysOn(1), ["comprehensive:1", "earlyReview:0"]);
  assert.deepStrictEqual(keysOn(2), ["comprehensive:2", "earlyReview:1"]);
  assert.deepStrictEqual(keysOn(3), ["comprehensive:3", "earlyReview:2,0"]);
  assert.deepStrictEqual(keysOn(7), ["comprehensive:7", "earlyReview:6,4", "intermediateReview:0"]);
  assert.deepStrictEqual(keysOn(21), ["comprehensive:21", "earlyReview:20,18", "intermediateReview:14,7", "maintenance:0"]);
});

test("never more than four sessions; exactly four, every pair full, from day 29 on", () => {
  assert(DAYS.length >= 120, "simulated " + DAYS.length + " days");
  DAYS.forEach((sessions, day) => assert(sessions.length <= 4, "day " + day));
  for (let day = 29; day < UNIT_COUNT; day += 1) {
    assert.deepStrictEqual(DAYS[day].map(s => s.key), ["comprehensive", "earlyReview", "intermediateReview", "maintenance"], "day " + day);
    assert.deepStrictEqual(DAYS[day].map(s => s.units.length), [1, 2, 2, 2], "day " + day);
  }
});

test("120 established study days: 120 new units, 480 sessions, 840 exposures", () => {
  const days = DAYS.slice(29, 149);
  assert.strictEqual(days.length, 120);
  assert.strictEqual(days.flat().length, 480);
  assert.strictEqual(days.flat().reduce((sum, s) => sum + s.units.length, 0), 120 * 7);
});

test("no unit is left out of, or doubled within, any exposure", () => {
  ALL.forEach(session => assert.strictEqual(new Set(session.units).size, session.units.length));
  assert.strictEqual(ALL.reduce((sum, s) => sum + s.units.length, 0), UNIT_COUNT * 7);
});

test("after the last unit, reviews run out the schedule and stop", () => {
  const small = StudyPlan.timeline(CONFIG, 3);
  assert.strictEqual(small.length, 3 + 29);
  assert.strictEqual(small.flat().filter(s => s.key === "comprehensive").length, 3);
  assert.strictEqual(small.flat().reduce((sum, s) => sum + s.units.length, 0), 21);
});

test("a configuration that could exceed the maximum is rejected with a clear error", () => {
  const bad = StudyPlan.merge(CONFIG, { scheduling: { maximumSessionsPerStudyDay: 3 } });
  assert.throws(() => StudyPlan.timeline(bad, 10), /maximumSessionsPerStudyDay/);
  const twoNew = StudyPlan.merge(CONFIG, { scheduling: { newUnitsPerStudyDay: 2 } });
  assert.throws(() => StudyPlan.timeline(twoNew, 10), /newUnitsPerStudyDay/);
});

/* =========================================================================
   FORGIVING PROGRESSION
   ========================================================================= */
section("Forgiving progression");

const UNITS = ids(14, "unit-");

test("day 0 is the comprehensive quiz on unit 1", () => {
  const day = StudyPlan.today(CONFIG, UNITS, {}, "2026-11-16");
  assert.strictEqual(day.index, 0);
  assert.deepStrictEqual(day.tasks.map(t => t.id), ["d0:comprehensive:unit-1"]);
  assert.strictEqual(day.tasks[0].status, "not-started");
});

test("missing five calendar days does not move the study day", () => {
  const records = {};
  finishDay(UNITS, records, "2026-11-16");
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, records, "2026-11-17").index, 1);
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, records, "2026-11-22").index, 1);
});

test("finish day 12 on Monday, come back Saturday → day 13", () => {
  const records = {};
  let date = "2026-11-04";
  for (let i = 0; i <= 12; i += 1) { finishDay(UNITS, records, date); date = addDays(date, 1); }
  /* Day 12 finished on 2026-11-16, a Monday; 2026-11-21 is a Saturday. */
  const back = StudyPlan.today(CONFIG, UNITS, records, "2026-11-21");
  assert.strictEqual(back.index, 13);
  assert.deepStrictEqual(back.tasks.find(t => t.key === "earlyReview").units, [12, 10], "reviews stay relative to study days");
});

test("returning after an absence shows the same pending sessions, and no extras", () => {
  const records = {};
  let date = "2026-11-01";
  for (let i = 0; i < 9; i += 1) { finishDay(UNITS, records, date); date = addDays(date, 1); }
  const pending = StudyPlan.today(CONFIG, UNITS, records, date);
  const later = StudyPlan.today(CONFIG, UNITS, records, addDays(date, 30));
  assert.deepStrictEqual(later.tasks.map(t => t.id), pending.tasks.map(t => t.id));
  assert(later.tasks.length <= 4);
  assert(later.tasks.every(t => t.status === "not-started"), "nothing marked failed, done or skipped");
});

test("an unfinished study day does not open the next one", () => {
  const records = {};
  for (const date of ["2026-11-01", "2026-11-02", "2026-11-03"]) finishDay(UNITS, records, date);
  const day3 = StudyPlan.today(CONFIG, UNITS, records, "2026-11-04");
  records[day3.tasks[0].id] = { status: "done", completedOn: "2026-11-04" };
  records[day3.tasks[1].id] = { status: "started", n: 30 };
  for (const date of ["2026-11-04", "2026-11-05", "2026-12-25"]) {
    const now = StudyPlan.today(CONFIG, UNITS, records, date);
    assert.strictEqual(now.index, day3.index, date);
    assert.strictEqual(now.tasks[1].status, "in-progress");
  }
});

test("finishing the last session opens the next day on the next local date, not before", () => {
  const records = {};
  finishDay(UNITS, records, "2026-11-16");
  const same = StudyPlan.today(CONFIG, UNITS, records, "2026-11-16");
  assert.strictEqual(same.index, 0);
  assert.strictEqual(same.complete, true);
  assert(same.tasks.every(t => t.status === "completed"), "finished sessions stay on show");
  assert.strictEqual(StudyPlan.today(CONFIG, UNITS, records, "2026-11-17").index, 1);
});

test("finishing early never offers the next day's sessions the same date", () => {
  const records = {};
  finishDay(UNITS, records, "2026-11-16");
  const day1Ids = StudyPlan.timeline(CONFIG, UNITS.length)[1].map(s => StudyPlan.taskId(UNITS, s));
  assert(StudyPlan.today(CONFIG, UNITS, records, "2026-11-16").tasks.every(task => !day1Ids.includes(task.id)));
});

test("the whole 14-unit plan runs to the end: 43 study days, 98 exposures", () => {
  const records = {};
  let date = "2026-11-16";
  let exposures = 0;
  let days = 0;
  while (!StudyPlan.today(CONFIG, UNITS, records, date).finished) {
    exposures += finishDay(UNITS, records, date).tasks.reduce((sum, t) => sum + t.units.length, 0);
    date = addDays(date, 1);
    assert(++days < 200);
  }
  assert.strictEqual(days, 14 + 29);
  assert.strictEqual(exposures, 14 * 7);
});

/* =========================================================================
   VARIABLE UNIT SIZES
   ========================================================================= */
section("Variable unit sizes");

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
  test(n + " words: valid groups, every word in a base group once, last group the whole unit", () => {
    const seq = StudyPlan.hierarchy(n, 5);
    seq.forEach(([a, b]) => assert(Number.isInteger(a) && Number.isInteger(b) && a >= 0 && a < b && b <= n));
    const leaves = seq.filter(([a, b]) => b - a <= 5 && a % 5 === 0);
    const covered = leaves.flatMap(([a, b]) => Array.from({ length: b - a }, (_, i) => a + i));
    assert.deepStrictEqual(covered.slice().sort((x, y) => x - y), Array.from({ length: n }, (_, i) => i));
    assert.deepStrictEqual(seq[seq.length - 1], [0, n]);
    assert.strictEqual(new Set(seq.map(r => r.join())).size, seq.length, "no group repeated");
  });
  test(n + " words: every quiz asks every word, no others, and finishes", () => {
    const words = ids(n);
    for (const [algorithm, policy] of [["comprehensive"], ["review", "earlyReview"], ["review", "intermediateReview"], ["maintenance"]]) {
      const run = StudyPlan.engine.create(algorithm, words, CONFIG, seeded(n), { policy });
      const asked = drive(run, learner(0.4, n));
      assert.deepStrictEqual([...new Set(asked.map(a => a.id))].sort(), words.slice().sort(), algorithm);
      asked.filter(a => a.group).forEach(a => {
        assert(a.group.size <= n);
        assert(a.group.from >= 1 && a.group.to <= n);
      });
    }
  });
}

/* =========================================================================
   COMBINED SESSIONS
   ========================================================================= */
section("Combined sessions");

function pool(...units) {
  const all = [];
  const unitOf = {};
  units.forEach(([unit, n]) => ids(n, unit + "-w").forEach(id => { all.push(id); unitOf[id] = unit; }));
  return { all, unitOf };
}

test("a 46-word and a 53-word unit make a 99-word pool, each word keeping its unit", () => {
  const { all, unitOf } = pool(["u5", 46], ["u3", 53]);
  const run = StudyPlan.engine.create("review", all, CONFIG, seeded(1), { policy: "intermediateReview", unitOf });
  assert.strictEqual(run.ids.length, 99);
  const asked = drive(run, (id, now) => {
    assert.strictEqual(now.unit, unitOf[id]);
    return now.phase === "initial" && /^u3-w(1|2)$/.test(id) ? "f" : "s";
  });
  assert.strictEqual(asked.filter(a => a.phase === "initial").length, 99);
  const out = StudyPlan.engine.outcome(run);
  assert.strictEqual(out.byUnit.u5.words, 46);
  assert.strictEqual(out.byUnit.u3.words, 53);
  assert.deepStrictEqual(out.byUnit.u3.failed, ["u3-w1", "u3-w2"]);
  assert.deepStrictEqual(out.byUnit.u5.failed, []);
  assert.strictEqual(StudyPlan.srs.proposals(run, () => ({ l: 1 }), "2026-11-16").find(p => p.id === "u3-w1").unit, "u3");
});

test("the weak-word pool can mix both units", () => {
  const { all, unitOf } = pool(["a", 20], ["b", 20]);
  const run = StudyPlan.engine.create("review", all, CONFIG, seeded(2), { policy: "intermediateReview", unitOf });
  const asked = drive(run, (id, now) => (now.phase === "initial" && /-w(3|9)$/.test(id) ? "w" : "s"));
  assert.deepStrictEqual([...new Set(asked.filter(a => a.phase === "targeted").map(a => a.id))].sort(), ["a-w3", "a-w9", "b-w3", "b-w9"]);
});

test("a session's word count is the sum of its units' sizes, and its id names both units", () => {
  const sizes = [48, 51, 44, 58];
  const early = StudyPlan.timeline(CONFIG, 4)[3].find(s => s.key === "earlyReview");
  assert.deepStrictEqual(early.units, [2, 0]);
  assert.strictEqual(early.units.reduce((sum, u) => sum + sizes[u], 0), 92);
  assert.strictEqual(StudyPlan.taskId(["u1", "u2", "u3", "u4"], early), "d3:earlyReview:u3+u1");
});

test("each unit's Review 3 is 한국어 → English; every other exposure English → 한국어", () => {
  const dirs = {};
  ALL.forEach(session => session.exposures.forEach(e => {
    const d = StudyPlan.directionFor(CONFIG, session.algorithm, e.n);
    dirs[session.algorithm + e.n] = d.promptLang + ">" + d.answerLang;
  }));
  assert.deepStrictEqual(dirs, {
    comprehensive1: "en>ko", review1: "en>ko", review2: "en>ko", review3: "ko>en", review4: "en>ko",
    maintenance1: "en>ko", maintenance2: "en>ko"
  });
  /* Review 3 is the offset-7 unit of an Intermediate Review: in a full
     session, one unit each way. */
  const mid = DAYS[40].find(s => s.key === "intermediateReview");
  assert.deepStrictEqual(mid.exposures.map(e => [e.unit, e.n]), [[33, 3], [26, 4]]);
});

test("a recognition answer (한국어 → English) can keep or cost a star, never raise one", () => {
  const { all, unitOf } = pool(["a", 3], ["b", 3]);
  const dirOf = {};
  all.forEach(id => { dirOf[id] = unitOf[id] === "b" ? "ko>en" : "en>ko"; });
  const run = StudyPlan.engine.create("review", all, CONFIG, seeded(3), { policy: "intermediateReview", unitOf, dirOf });
  drive(run, (id, now) => (now.phase === "initial" && id === "b-w3" ? "f" : now.phase === "initial" && id === "b-w2" ? "w" : "s"));
  const byId = Object.fromEntries(StudyPlan.srs.proposals(run, () => ({ l: 2, d: "2026-11-01" }), "2026-11-16").map(p => [p.id, p]));
  assert.strictEqual(byId["a-w1"].to, 3, "production, clean on a later day: up");
  assert.strictEqual(byId["b-w1"].to, 2, "recognition, clean: kept, not raised");
  assert.strictEqual(byId["b-w1"].cleanDay, "2026-11-16", "still stamped clean");
  assert.strictEqual(byId["b-w2"].to, 2, "recognition, hesitant: kept");
  assert.strictEqual(byId["b-w3"].to, 1, "recognition, missed: down a rung");
  assert.deepStrictEqual(JSON.parse(JSON.stringify(run)).dirOf, dirOf, "a resumed run keeps each word's direction");
});

/* =========================================================================
   COMPREHENSIVE QUIZ
   ========================================================================= */
section("Comprehensive quiz");

test("in unit order within each group, and the quiz is the groups alone", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(12), CONFIG, seeded(1));
  const asked = [];
  while (run.phase === "groups") {
    asked.push(StudyPlan.engine.current(run).id);
    StudyPlan.engine.answer(run, CONFIG, "s", 500);
  }
  assert.deepStrictEqual(asked, [].concat(ids(5), ids(10).slice(5), ids(10), ["w11", "w12"], ids(12)));
  assert(run.done, "regular repetition only: the quiz ends with the last group");
});

/* Answer the comprehensive run until its current group is words from–to. */
function reachGroup(run, from, to) {
  while (!(StudyPlan.engine.current(run).group.from === from && StudyPlan.engine.current(run).group.to === to)) {
    StudyPlan.engine.answer(run, CONFIG, "s");
  }
}

test("a miss on word 3 of a 10-word group shows the answer and restarts at word 1 — words 4–10 are not asked", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), CONFIG, seeded(2));
  reachGroup(run, 1, 10);
  StudyPlan.engine.answer(run, CONFIG, "s");
  StudyPlan.engine.answer(run, CONFIG, "s");
  assert.strictEqual(StudyPlan.engine.current(run).id, "w3");
  const events = StudyPlan.engine.answer(run, CONFIG, "f");
  assert(events.groupRetry && events.restarted);
  assert.strictEqual(events.restartFrom, 1);
  const now = StudyPlan.engine.current(run);
  assert.strictEqual(now.id, "w1", "straight back to word 1");
  assert.strictEqual(now.group.attempt, 2);
  assert.strictEqual(now.group.from, 1);
  assert.strictEqual(now.group.to, 10);
  assert(!run.log.some(([id]) => ["w4", "w5", "w6", "w7", "w8", "w9", "w10"].includes(id) && run.log.indexOf(run.log.find(e => e[0] === id)) > 20),
    "words 4–10 were not asked after the miss");
  assert.deepStrictEqual(run.marks.w3, { w: 0, f: 1 });
  /* The group passes only on one uninterrupted all-right attempt. */
  for (let i = 0; i < 10; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  assert(run.done, "1–10 was the last group; it passed on the clean attempt");
});

test("strict 5-word checkpoints: a miss on word 7 of 1–10 restarts at word 6, not word 1", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), CONFIG, seeded(2));
  reachGroup(run, 1, 10);
  for (let i = 0; i < 6; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  assert.strictEqual(StudyPlan.engine.current(run).id, "w7");
  const events = StudyPlan.engine.answer(run, CONFIG, "f");
  assert.strictEqual(events.restartFrom, 6);
  const asked = [];
  for (let i = 0; i < 5; i += 1) {
    asked.push(StudyPlan.engine.current(run).id);
    StudyPlan.engine.answer(run, CONFIG, "s");
  }
  assert.deepStrictEqual(asked, ["w6", "w7", "w8", "w9", "w10"]);
  assert(run.done, "1–10 passes once words 6–10 go through clean");
});

test("strict 5-word checkpoints hold in a 50-word group: a miss on word 43 goes back to word 41", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(50), CONFIG, seeded(8));
  reachGroup(run, 1, 50);
  for (let i = 0; i < 42; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  assert.strictEqual(StudyPlan.engine.answer(run, CONFIG, "f").restartFrom, 41);
  assert.strictEqual(StudyPlan.engine.current(run).id, "w41");
  assert.strictEqual(StudyPlan.engine.current(run).group.attempt, 2);
});

test("the immediate policy restarts the whole group, in order", () => {
  const cfg = StudyPlan.merge(CONFIG, { comprehensive: { restartPolicy: "immediate" } });
  const run = StudyPlan.engine.create("comprehensive", ids(10), cfg, seeded(2));
  while (StudyPlan.engine.current(run).group.size !== 10) StudyPlan.engine.answer(run, cfg, "s");
  for (let i = 0; i < 6; i += 1) StudyPlan.engine.answer(run, cfg, "s");
  assert.strictEqual(StudyPlan.engine.answer(run, cfg, "f").restartFrom, 1);
  const asked = [];
  for (let i = 0; i < 10; i += 1) {
    asked.push(StudyPlan.engine.current(run).id);
    StudyPlan.engine.answer(run, cfg, "s");
  }
  assert.deepStrictEqual(asked, ids(10));
});

test("a hesitant answer does not restart a group", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), CONFIG, seeded(2));
  ["s", "s", "w", "s", "s"].forEach(r => StudyPlan.engine.answer(run, CONFIG, r));
  assert.strictEqual(StudyPlan.engine.current(run).group.from, 6);
  assert.deepStrictEqual(run.marks.w3, { w: 1, f: 0 });
});

test("restarts work the same for groups of any size", () => {
  for (const n of [1, 3, 5, 12, 43, 63]) {
    const run = StudyPlan.engine.create("comprehensive", ids(n), CONFIG, seeded(n));
    while (run.phase === "groups") {
      const now = StudyPlan.engine.current(run);
      const last = now.group.position === now.group.size;
      /* Miss the last word of every group's first attempt. */
      const events = StudyPlan.engine.answer(run, CONFIG, last && now.group.attempt === 1 ? "f" : "s");
      if (last && now.group.attempt === 1) {
        assert(events.restarted, "n=" + n);
        const again = StudyPlan.engine.current(run);
        /* Back to the start of the missed word's 5-word segment. */
        assert.strictEqual(again.group.position, Math.floor((now.group.position - 1) / 5) * 5 + 1);
        assert.strictEqual(again.group.from, now.group.from);
      }
    }
  }
});

test("finish-attempt is still available as a policy", () => {
  const cfg = StudyPlan.merge(CONFIG, { comprehensive: { restartPolicy: "finish-attempt" } });
  const run = StudyPlan.engine.create("comprehensive", ids(10), cfg, seeded(2));
  for (let i = 0; i < 5; i += 1) StudyPlan.engine.answer(run, cfg, "s");
  ["s", "f", "s", "s"].forEach(r => StudyPlan.engine.answer(run, cfg, r));
  assert.strictEqual(StudyPlan.engine.current(run).id, "w10", "carries on after the miss");
  assert(StudyPlan.engine.answer(run, cfg, "s").groupRetry);
  assert.strictEqual(StudyPlan.engine.current(run).id, "w6");
});

test("checkpoint policy: a big group restarts only its current segment; small groups restart whole", () => {
  const cfg = StudyPlan.merge(CONFIG, { comprehensive: { restartPolicy: "checkpoint", checkpointMinGroupSize: 21, checkpointSegmentSize: 10 } });
  const run = StudyPlan.engine.create("comprehensive", ids(40), cfg, seeded(3));
  /* Small group first: 1–5, miss word 4 → back to word 1. */
  for (let i = 0; i < 3; i += 1) StudyPlan.engine.answer(run, cfg, "s");
  assert.strictEqual(StudyPlan.engine.answer(run, cfg, "f").restartFrom, 1);
  while (!(StudyPlan.engine.current(run).group.size === 40)) StudyPlan.engine.answer(run, cfg, "s");
  for (let i = 0; i < 24; i += 1) StudyPlan.engine.answer(run, cfg, "s");
  assert.strictEqual(StudyPlan.engine.current(run).id, "w25");
  const events = StudyPlan.engine.answer(run, cfg, "f");
  assert.strictEqual(events.restartFrom, 21);
  assert.strictEqual(StudyPlan.engine.current(run).id, "w21", "back to the segment's start, not word 1");
  for (let i = 0; i < 20; i += 1) StudyPlan.engine.answer(run, cfg, "s");
  assert(run.done, "the group passes once the rest goes through without a miss");
});

test("strict 5-word checkpoints are the default", () => {
  assert.strictEqual(CONFIG.comprehensive.restartPolicy, "checkpoint");
  assert.strictEqual(CONFIG.comprehensive.checkpointSegmentSize, 5);
  assert(CONFIG.comprehensive.checkpointMinGroupSize <= 6, "every group over 5 words uses them");
});

test("a group failed mid-way pauses and resumes with earlier groups intact", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(20), CONFIG, seeded(5));
  reachGroup(run, 11, 15);
  StudyPlan.engine.answer(run, CONFIG, "s");
  StudyPlan.engine.answer(run, CONFIG, "f");
  const passedBefore = run.passed;
  const saved = JSON.parse(JSON.stringify(run));
  const now = StudyPlan.engine.current(saved);
  assert.strictEqual(now.id, "w11");
  assert.strictEqual(now.group.attempt, 2);
  assert.strictEqual(saved.passed, passedBefore);
  assert.strictEqual(passedBefore, 3, "1–5, 6–10 and 1–10 stay passed");
});

test("right answers repeated through restarts never reach the star twice", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(5), CONFIG, seeded(6));
  for (let attempt = 0; attempt < 4; attempt += 1) {
    for (let i = 0; i < 4; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
    StudyPlan.engine.answer(run, CONFIG, "f");
  }
  drive(run, () => "s");
  assert(run.log.filter(([id]) => id === "w1").length >= 5);
  const proposals = StudyPlan.srs.proposals(run, () => ({ l: 0 }), "2026-11-16");
  assert.strictEqual(proposals.length, 5, "one per word");
  assert.strictEqual(proposals.find(p => p.id === "w1").to, 2, "five right answers in one sitting are still ★★");
  assert.strictEqual(StudyPlan.srs.wordRecords(run, () => null, "2026-11-16").w1.seen, 1, "one retrieval on the long-term record");
});

test("repeated misses never undo a group already passed", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(15), CONFIG, seeded(3));
  for (let i = 0; i < 5; i += 1) StudyPlan.engine.answer(run, CONFIG, "s");
  for (let attempt = 0; attempt < 6; attempt += 1) {
    for (let i = 0; i < 5; i += 1) StudyPlan.engine.answer(run, CONFIG, i === 4 ? "f" : "s");
    assert.strictEqual(StudyPlan.engine.current(run).group.index, 1);
    assert.strictEqual(run.passed, 1);
  }
});

test("the retry safeguard is off by default, and passes a group only when configured", () => {
  const strict = StudyPlan.engine.create("comprehensive", ids(5), CONFIG, seeded(4));
  for (let i = 0; i < 50; i += 1) StudyPlan.engine.answer(strict, CONFIG, "f");
  assert.strictEqual(strict.phase, "groups");
  const capped = StudyPlan.merge(CONFIG, { comprehensive: { maxGroupAttempts: 3 } });
  const run = StudyPlan.engine.create("comprehensive", ids(5), capped, seeded(4));
  let events = {};
  let guard = 0;
  while (!events.forced && guard++ < 50) events = StudyPlan.engine.answer(run, capped, "f");
  assert(events.forced && events.groupPassed);
  assert.strictEqual(guard, 2 + 5, "two restarts, then the third attempt runs to the end and passes");
  assert(run.done);
});

test("optional Part 2 asks every word, shuffled, and favours what Part 1 found weak", () => {
  const words = ids(20);
  const run = StudyPlan.engine.create("comprehensive", words, WITH_SRS, seeded(4));
  const once = new Set();
  while (run.phase === "groups") {
    const id = StudyPlan.engine.current(run).id;
    let r = "s";
    if (id === "w3" && !once.has("w3")) { r = "f"; once.add("w3"); }
    if (id === "w5" && !once.has("w5")) { r = "w"; once.add("w5"); }
    StudyPlan.engine.answer(run, CONFIG, r);
  }
  const part2 = drive(run, () => "s").map(now => now.id);
  assert.deepStrictEqual([...new Set(part2)].sort(), words.slice().sort());
  assert.notDeepStrictEqual(part2.slice(0, 20), words);
  const count = id => part2.filter(x => x === id).length;
  assert.strictEqual(count("w3"), 3);
  assert.strictEqual(count("w5"), 2);
  assert.strictEqual(count("w1"), 1, "a strong word is asked once");
});

test("spaced parts never ask the same word twice running while others remain", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(8), WITH_SRS, seeded(5));
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

test("a star moves once per quiz, from one measured answer — never from the repeats", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(10), WITH_SRS, seeded(6));
  drive(run, () => "s");
  assert(run.log.length >= 30);
  const proposals = StudyPlan.srs.proposals(run, () => ({ l: 0 }), "2026-11-16");
  assert.strictEqual(proposals.length, 10);
  proposals.forEach(p => assert.strictEqual(p.to, 2, "clean today is ★★, not ★★★"));
  StudyPlan.srs.proposals(run, () => ({ l: 2, d: "2026-11-16" }), "2026-11-16").forEach(p => assert.strictEqual(p.to, 2));
  StudyPlan.srs.proposals(run, () => ({ l: 2, d: "2026-11-16" }), "2026-11-17").forEach(p => assert.strictEqual(p.to, 3));
});

test("word records count one retrieval per quiz, with the calendar gap since the last", () => {
  const run = StudyPlan.engine.create("maintenance", ids(4), CONFIG, seeded(6));
  drive(run, id => (id === "w2" ? "f" : "s"));
  const records = StudyPlan.srs.wordRecords(run, id => (id === "w1" ? { last: "2026-11-02", seen: 3, right: 3 } : null), "2026-11-16");
  assert.strictEqual(records.w1.seen, 4);
  assert.strictEqual(records.w1.gap, 14, "a two-week break reads as two weeks");
  assert.strictEqual(records.w2.right, 0);
  assert.strictEqual(records.w2.relearn, true);
});

test("a word that keeps failing in optional Part 2 is let go and flagged", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(6), WITH_SRS, seeded(7));
  const answers = drive(run, id => (run.phase === "srs" && id === "w4" ? "f" : "s"));
  assert.deepStrictEqual(run.relearn, ["w4"]);
  assert.strictEqual(answers.filter(a => a.phase === "srs" && a.id === "w4").length, CONFIG.comprehensive.relearnAfterMisses);
});

/* =========================================================================
   REVIEW AND MAINTENANCE
   ========================================================================= */
section("Review and maintenance quizzes");

test("review: every word once first, then only weak and failed words", () => {
  const words = ids(30);
  const run = StudyPlan.engine.create("review", words, CONFIG, seeded(8), { policy: "intermediateReview" });
  const weak = new Set(["w2", "w9"]);
  const failed = new Set(["w4", "w15", "w22"]);
  const asked = drive(run, (id, now) => (now.phase === "initial" ? (failed.has(id) ? "f" : weak.has(id) ? "w" : "s") : "s"));
  assert.deepStrictEqual(asked.slice(0, 30).map(a => a.id).sort(), words.slice().sort());
  assert(asked.slice(0, 30).every(a => a.phase === "initial"), "nothing else before every word is asked");
  const later = asked.slice(30).map(a => a.id);
  const pool = new Set([...weak, ...failed]);
  assert(later.every(id => pool.has(id)), "strong words are not repeated");
  pool.forEach(id => assert(asked.some(a => a.phase === "targeted" && a.id === id), id + " gets targeted repetition"));
  failed.forEach(id => assert(asked.some(a => a.phase === "srs" && a.id === id), id + " gets a delayed retrieval"));
});

test("review: in Part 3, failed words come before weak ones", () => {
  const run = StudyPlan.engine.create("review", ids(10), CONFIG, seeded(30), { policy: "intermediateReview" });
  drive(run, (id, now) => (now.phase === "initial" ? (id === "w1" ? "w" : id === "w2" ? "f" : "s") : "s"));
  assert.strictEqual(run.log.filter(([, phase]) => phase === "srs")[0][0], "w2");
});

test("early review is one spaced run: no first pass, no groups, every word until it sticks", () => {
  const { all, unitOf } = pool(["a", 12], ["b", 9]);
  const run = StudyPlan.engine.create("review", all, CONFIG, seeded(40), { policy: "earlyReview", unitOf });
  assert.deepStrictEqual(run.phases, ["srs"]);
  const firsts = new Map();
  const asked = drive(run, (id, now) => {
    const first = !firsts.has(id);
    firsts.set(id, true);
    if (id === "a-w1") return first ? "f" : "s";
    if (id === "b-w2") return first ? "w" : "s";
    return "s";
  });
  assert(asked.every(a => a.phase === "srs" && a.group === null));
  assert.deepStrictEqual([...new Set(asked.map(a => a.id))].sort(), all.slice().sort(), "every word of both units");
  const count = id => asked.filter(a => a.id === id).length;
  assert.strictEqual(count("a-w3"), 1, "right first time: asked once");
  assert.strictEqual(count("a-w1"), 3, "missed: comes back until two more right answers");
  assert.strictEqual(count("b-w2"), 2, "hesitant: comes back once more");
  assert.strictEqual(run.scored["a-w1"], "f", "measured on its first answer");
  assert.strictEqual(run.scored["b-w2"], "w");
  const out = StudyPlan.engine.outcome(run);
  assert.strictEqual(out.byUnit.a.words, 12);
  assert.deepStrictEqual(out.byUnit.a.failed, ["a-w1"]);
  assert.deepStrictEqual(out.byUnit.b.weak, ["b-w2"]);
});

test("early review: a word that will not stick is let go, and the run ends", () => {
  const run = StudyPlan.engine.create("review", ids(6), CONFIG, seeded(41), { policy: "earlyReview" });
  const asked = drive(run, id => (id === "w4" ? "f" : "s"));
  assert.deepStrictEqual(run.relearn, ["w4"]);
  assert.strictEqual(asked.filter(a => a.id === "w4").length, CONFIG.earlyReview.relearnAfterMisses);
});

test("the comprehensive quiz is measured on each word's first answer in the last, whole-unit group", () => {
  const run = StudyPlan.engine.create("comprehensive", ids(12), CONFIG, seeded(42));
  const seenInLast = new Set();
  drive(run, (id, now) => {
    const last = now.group.size === 12;
    if (last && id === "w9" && !seenInLast.has(id)) { seenInLast.add(id); return "f"; }
    if (!last && id === "w2") return now.group.attempt === 1 ? "f" : "s";
    return "s";
  });
  assert.strictEqual(run.scored.w9, "f", "missed in the final group");
  assert.strictEqual(run.scored.w2, "s", "earlier misses are practice, not the measure");
  assert.strictEqual(Object.keys(run.scored).length, 12);
});

test("intermediate review keeps its three parts", () => {
  const run = StudyPlan.engine.create("review", ids(10), CONFIG, seeded(31), { policy: "intermediateReview" });
  const asked = drive(run, (id, now) => (now.phase === "initial" && id === "w1" ? "w" : "s"));
  assert.deepStrictEqual(run.phases, ["initial", "targeted", "srs"]);
  assert.strictEqual(asked.filter(a => a.phase === "srs" && a.id === "w1").length, 1);
});

test("review: targeted groups shuffle between attempts", () => {
  const run = StudyPlan.engine.create("review", ids(10), CONFIG, seeded(10), { policy: "intermediateReview" });
  while (run.phase === "initial") StudyPlan.engine.answer(run, CONFIG, "f");
  const orders = new Set();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const seen = [];
    for (let i = 0; i < 5; i += 1) {
      seen.push(StudyPlan.engine.current(run).id);
      StudyPlan.engine.answer(run, CONFIG, i === 4 ? "f" : "s", 0, seeded(attempt * 31 + i));
    }
    orders.add(seen.join());
  }
  assert(orders.size > 1);
});

test("review: all strong skips straight to done", () => {
  const run = StudyPlan.engine.create("review", ids(25), CONFIG, seeded(11), { policy: "intermediateReview" });
  assert.strictEqual(drive(run, () => "s").length, 25);
});

test("review: a word that will not stick is let go, not asked forever", () => {
  const run = StudyPlan.engine.create("review", ids(12), CONFIG, seeded(12), { policy: "intermediateReview" });
  const asked = drive(run, (id, now) => (id === "w7" ? (now.phase === "targeted" ? "s" : "f") : "s"));
  assert(run.relearn.includes("w7"));
  assert(asked.length < 60);
});

test("maintenance: cold recall first, no groups, weak once more and failed twice", () => {
  const run = StudyPlan.engine.create("maintenance", ids(40), CONFIG, seeded(13));
  const asked = drive(run, (id, now) => (now.phase === "cold" ? (id === "w1" ? "w" : id === "w2" ? "f" : "s") : "s"));
  assert(asked.slice(0, 40).every(a => a.phase === "cold"));
  assert.strictEqual(asked.filter(a => a.phase === "cold").length, 40);
  assert(asked.every(a => a.group === null));
  const extra = asked.slice(40).map(a => a.id);
  assert.strictEqual(extra.filter(id => id === "w1").length, 1);
  assert.strictEqual(extra.filter(id => id === "w2").length, 2);
  assert.strictEqual(extra.length, 3);
});

test("maintenance: the cold score is kept apart from the corrective repeats", () => {
  const run = StudyPlan.engine.create("maintenance", ids(10), CONFIG, seeded(14));
  drive(run, (id, now) => (now.phase === "cold" && id === "w3" ? "f" : "s"));
  assert.strictEqual(run.scored.w3, "f");
  assert.strictEqual(StudyPlan.srs.proposals(run, () => ({ l: 3 }), "2026-11-16").find(p => p.id === "w3").to, 2);
});

test("maintenance: repeated failure flags the word, and the session still ends", () => {
  const run = StudyPlan.engine.create("maintenance", ids(5), CONFIG, seeded(15));
  drive(run, id => (id === "w5" ? "f" : "s"));
  assert.deepStrictEqual(run.relearn, ["w5"]);
});

test("maintenance takes far fewer answers than a comprehensive quiz", () => {
  const comp = drive(StudyPlan.engine.create("comprehensive", ids(50), CONFIG, seeded(17)), learner(0.5, 16)).length;
  const maint = drive(StudyPlan.engine.create("maintenance", ids(50), CONFIG, seeded(18)), learner(0.15, 16)).length;
  assert(maint < comp / 3, maint + " vs " + comp);
});

/* =========================================================================
   PAUSE AND RESUME
   ========================================================================= */
section("Pause and resume");

for (const [algorithm, policy] of [["comprehensive"], ["review", "earlyReview"], ["maintenance"]]) {
  test(algorithm + ": a run saved as JSON after any answer resumes on the same question", () => {
    const answerFor = learner(0.4, algorithm.length * 7);
    const { all, unitOf } = pool(["a", 13], ["b", 10]);
    let saved = JSON.parse(JSON.stringify(StudyPlan.engine.create(algorithm, all, CONFIG, seeded(19), { policy, unitOf })));
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

/* =========================================================================
   PERSISTENCE
   ========================================================================= */
section("Persistence");

test("a save is refused when another tab wrote the session first", () => {
  const storage = memoryStorage();
  const tabA = StudyPlanStore.open("plan", storage);
  const tabB = StudyPlanStore.open("plan", storage);
  const first = tabA.saveTask("t", { status: "started", n: 1 }, tabA.versionOf(null));
  const seenByB = tabB.versionOf(tabB.task("t"));
  assert(tabA.saveTask("t", { status: "started", n: 2 }, first.seen).ok);
  assert(tabB.saveTask("t", { status: "started", n: 2 }, seenByB).conflict);
});

test("starting a session twice (refresh, two tabs) makes one record", () => {
  const storage = memoryStorage();
  const tabA = StudyPlanStore.open("plan", storage);
  const tabB = StudyPlanStore.open("plan", storage);
  assert(tabA.saveTask("t", { status: "started", n: 0 }, tabA.versionOf(null)).ok);
  assert(tabB.saveTask("t", { status: "started", n: 0 }, tabB.versionOf(null)).conflict);
  assert.strictEqual(Object.keys(tabA.tasks()).length, 1);
});

test("a finished session is never un-finished by a copy that was behind", () => {
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

test("two tabs completing the last session cannot advance the day twice", () => {
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
  tabB.setState({ day: 1, on: "2026-11-17" });
  tabB.setState({ day: 0, on: "2026-11-16" });
  assert.strictEqual(tabA.state().day, 1, "the recorded day never goes back");
});

test("word records are written in one batch", () => {
  const repo = StudyPlanStore.open("plan", memoryStorage());
  repo.setWords({ a: { seen: 1, last: "2026-11-16" }, b: { seen: 2, relearn: true } });
  assert.strictEqual(repo.word("a").seen, 1);
  assert.strictEqual(repo.words().b.relearn, true);
});

test("SpacedSession: a restored session continues identically", () => {
  const items = ids(12).map((id, i) => ({ id, item: id, box: i % 3 }));
  const original = SpacedSession.create({ items, retireAt: 3 });
  for (let i = 0; i < 7; i += 1) original.grade(original.next(), i % 3 !== 0);
  const copy = SpacedSession.create({ restore: JSON.parse(JSON.stringify(original.snapshot())) });
  assert.deepStrictEqual(copy.snapshot(), original.snapshot());
});

/* =========================================================================
   THE REAL COLLECTION, AND ANSWER CHECKING
   ========================================================================= */
section("TOPIK II section vocab");

const bankConfig = ReviewBanks.BANKS.find(bank => bank.id === StudyPlan.PLANS[0].collection.bank);
const context = vm.createContext({});
context.window = context;
const built = ReviewBanks.build(bankConfig, fs.readFileSync(path.join(ROOT, bankConfig.href), "utf8"),
  { window: context, Function: vm.runInContext("Function", context) });
const allGroups = built.modes.find(mode => mode.id === StudyPlan.PLANS[0].collection.grouping).groups;
const unitGroups = StudyPlanStore.pickUnits(allGroups, StudyPlan.PLANS[0].collection.units);

test("the plan uses the 2023 units only, in the book's order", () => {
  assert.deepStrictEqual(unitGroups.map(g => g.id), [1, 2, 3, 4, 5, 6, 7].map(n => "unit-2023-" + n));
  const covered = unitGroups.flatMap(group => group.ids);
  assert.strictEqual(new Set(covered).size, covered.length, "no word in two units");
  assert(covered.every(id => id.startsWith("t23-")), "no 2018 word");
  assert.strictEqual(covered.length, built.words.filter(w => w.id.startsWith("t23-")).length, "every 2023 word");
});

test("appending 2018 later puts its units after 2023's, leaving 2023's schedule alone", () => {
  const later = StudyPlanStore.pickUnits(allGroups, ["^unit-2023-", "^unit-2018-"]);
  assert.strictEqual(later.length, 14);
  assert.deepStrictEqual(later.slice(0, 7), unitGroups);
  assert.strictEqual(later[7].id, "unit-2018-1");
  assert.strictEqual(StudyPlanStore.pickUnits(allGroups).length, 14, "no patterns: every unit");
});

test("every real session of the plan runs to the end, scored unit by unit", () => {
  const unitIds = unitGroups.map(g => g.id);
  StudyPlan.timeline(CONFIG, unitGroups.length).flat().forEach((session, index) => {
    const unitOf = {};
    const all = session.units.flatMap(u => unitGroups[u].ids.map(id => { unitOf[id] = unitIds[u]; return id; }));
    const run = StudyPlan.engine.create(session.algorithm, all, CONFIG, seeded(index), { policy: session.policy, unitOf });
    drive(run, learner(0.4, index));
    const out = StudyPlan.engine.outcome(run);
    session.units.forEach(u => assert.strictEqual(out.byUnit[unitIds[u]].words, unitGroups[u].ids.length));
  });
});

test("answers are checked the review page's way", () => {
  const check = AnswerCheck.create(built.words, ReviewBanks.romanize);
  const word = built.words.find(w => w.ko === "예약하다");
  const dir = { promptLang: "en", answerLang: "ko" };
  assert(check.check(word, dir, "예약하다"));
  assert(check.check(word, dir, " 예약 하다 "));
  assert(!check.check(word, dir, "취소하다"));
  assert(!check.check(word, dir, ""));
  assert(check.check(word, { promptLang: "ko", answerLang: "en" }, "Reserve"));
  const twinOf = w => built.words.find(o => o !== w && o.ko !== w.ko
    && AnswerCheck.normalize(o.en, "en") === AnswerCheck.normalize(w.en, "en"));
  const ambiguous = built.words.find(twinOf);
  if (ambiguous) assert.strictEqual(check.otherWordMeant(ambiguous, dir, twinOf(ambiguous).ko), twinOf(ambiguous));
});

console.log("\n" + passed + " passed" + (failures.length ? ", " + failures.length + " failed" : ""));
if (failures.length) process.exit(1);
