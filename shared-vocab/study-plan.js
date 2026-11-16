/*
  study-plan.js
  ----------------------------------------------------------------------------
  The daily tasks: what each study day asks, and how its two quizzes run. No
  DOM, no storage, no network — the home page's Today's Tasks card and
  study-quiz.html drive it, study-plan-store.js keeps what it produces,
  study-memory.js is the memory model, review-selector.js picks the review's
  words, and shared-vocab/test-study-plan.js tests it all.

  1. CONFIG — StudyPlan.PLANS, StudyPlan.DEFAULTS
     A plan is a collection (a word bank from review-banks.js, cut into units
     by one of its groupings) plus the policies below. Nothing here knows
     which collection it is running or how many words a unit has: sizes come
     from the data. A second plan is one more entry in PLANS.

  2. SCHEDULER — StudyPlan.dayTasks(…), StudyPlan.today(…)
     At most two quizzes a study day, in this order:

       Comprehensive Quiz     the next unit, learnt from scratch
       Adaptive Review Quiz   ~55 words picked from every unit learnt on an
                              earlier study day (review-selector.js)

     Study day k learns unit k. Day 0 has no review (nothing learnt yet);
     once every unit is learnt the days carry on with the review alone.

     A study day is a batch of quizzes, not a date. The day you are on is
     worked out from which quizzes are finished, every time, rather than
     counted up: day d is finished when both of its quizzes are, and the next
     one opens on a later local date than the one d was finished on. A missed
     week leaves you on the same day, nothing goes overdue, and a refresh, two
     tabs or a retried save cannot move the day twice. The memory model, on
     the other hand, runs on real calendar days: a two-week break reads as
     two weeks when the review picks its words.

  3. QUIZ ENGINE — StudyPlan.engine
     A run is a plain object (a checkpoint) that survives JSON, so it can be
     paused after any answer and resumed anywhere. Each answer is graded by
     the page as "s" strong (right and sure), "w" weak (right but hesitant)
     or "f" failed (wrong, skipped or not known).

       comprehensive  Part 1, building up: the unit in its own order, five
                      words at a time, merged into ever larger groups
                      (hierarchy()), each repeated until one attempt is all
                      right. A miss stops the attempt at once and restarts
                      the group (restartPolicy: by default from the start of
                      the missed word's 5-word stretch).
                      Part 2, spaced retrieval: every word shuffled, no
                      positional cues, through SpacedSession; a word Part 1
                      found clean is asked once, a hesitant or missed one
                      until it sticks. Each word's first Part 2 answer is its
                      measured, independent retrieval.
       review         Every selected word once, in a frozen shuffled order,
                      with the answer shown after it. That one answer is the
                      measurement. (Optional second tries for misses,
                      sameSessionRetries, are off.)

  4. SRS ADAPTER — StudyPlan.srs
     A run moves each word at most once, from its one measured answer: one
     update to its memory record (study-memory.js) and one proposed star
     change (the site's own rules, SpacedSession.stars), which the learner
     confirms. Everything else in a run is practice and never reaches either
     — which is what keeps a hundred right answers in one evening from
     counting as a hundred days of memory.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./spaced-session.js"), require("./study-memory.js"), require("./review-selector.js"));
  } else root.StudyPlan = factory(root.SpacedSession, root.StudyMemory, root.ReviewSelector);
}(typeof self !== "undefined" ? self : this, function (SpacedSession, StudyMemory, ReviewSelector) {
  "use strict";

  /* ======================================================================
     1. CONFIG
     ====================================================================== */
  const DEFAULTS = {
    vocabulary: {
      /* Informational only: nothing below assumes it. */
      expectedWordsPerUnit: 50,
      allowVariableUnitSize: true,
      deriveWordCountFromData: true
    },
    scheduling: {
      newUnitsPerStudyDay: 1,
      maxDailyQuizSessions: 2,
      missedDaysPauseSchedule: true,
      allowMultipleStudyDaysPerCalendarDay: false
    },
    /* The day's quizzes, in the order they are shown and done; policy names
       the settings block each runs with. */
    sessions: [
      { key: "comprehensive", label: "Comprehensive Quiz", algorithm: "comprehensive", policy: "comprehensive" },
      { key: "review", label: "Adaptive Review Quiz", algorithm: "review", policy: "adaptiveReview" }
    ],
    comprehensive: {
      baseGroupSize: 5,
      cumulativeGrouping: true,
      preserveOriginalOrder: true,
      immediateRestartOnError: true,
      strictPerfectGroupPass: true,
      requirePerfectGroupPass: true,
      /* What a miss inside a group does — it always ends the attempt there
         and shows the answer; then:
           "checkpoint"      start again from the first word of the current
                             checkpointSegmentSize-word stretch, in groups of
                             checkpointMinGroupSize words or more (smaller
                             groups restart whole): a miss on word 7 of 1–10
                             goes back to word 6, on word 3 to word 1
           "immediate"       start the whole group again from its first word
           "finish-attempt"  finish the attempt, then repeat the whole group
         Either way a group passes only once every word in it has gone right
         with no miss since its stretch (or the group) began. */
      restartPolicy: "checkpoint",
      checkpointMinGroupSize: 6,
      checkpointSegmentSize: 5,
      /* A safeguard, off: after this many failed attempts at one group, pass
         it anyway (its misses stay recorded). null = never. */
      maxGroupAttempts: null,
      /* Part 2, the spaced retrieval. A word retires after srsRetireAt rungs;
         one Part 1 never missed or hesitated on starts one right answer
         from retiring. */
      includeSRSPhase: true,
      srsRetireAt: 3,
      relearnAfterMisses: 3
    },
    adaptiveReview: ReviewSelector.DEFAULTS,
    srs: StudyMemory.DEFAULTS,
    familiarity: {
      useExistingStarSystem: true,
      reflectLongTermRetention: true,
      allowMasteryDowngrades: true
    },
    /* Asked in English, answered in 한국어: a production answer, the only
       kind the star rules let raise a star. A typed answer slower than
       hesitantAfterMs starts out marked hesitant; the learner can unmark it. */
    answer: { promptLang: "en", answerLang: "ko", hesitantAfterMs: 8000 },
    /* A quiz kind asked the other way round, e.g.
       { review: { promptLang: "ko", answerLang: "en" } }. None by default. */
    directions: {}
  };

  const PLANS = [
    {
      id: "topik-ii-vocab",
      title: "TOPIK II section vocab",
      /* review-banks.js bank id, the grouping whose groups are the units,
         and which of those groups to use, in order: every group matching the
         first pattern (in the bank's own order), then the second, … The units
         themselves are used as they are: same words, same order inside.

         2023 only for now. To add the 2018 workbook, append "^unit-2018-":
         its units then follow 2023's. Only ever append — a unit put ahead of
         ones already learnt would shift them. */
      collection: { bank: "topik-ii-vocab", grouping: "unit", units: ["^unit-2023-"] }
    }
  ];

  const ALGORITHMS = ["comprehensive", "review"];

  function isObject(value) { return value && typeof value === "object" && !Array.isArray(value); }
  function merge(base, extra) {
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(extra || {}).forEach(key => {
      out[key] = isObject(base && base[key]) && isObject(extra[key]) ? merge(base[key], extra[key]) : extra[key];
    });
    return out;
  }

  /* Throws on a configuration the scheduler cannot honour. */
  function validate(cfg) {
    const max = cfg.scheduling.maxDailyQuizSessions;
    if (cfg.sessions.length > max) {
      throw new Error("Study plan configuration: " + cfg.sessions.length + " quiz types ("
        + cfg.sessions.map(s => s.key).join(", ") + ") can fall on one study day, but maxDailyQuizSessions is " + max + ".");
    }
    if (cfg.scheduling.newUnitsPerStudyDay !== 1) {
      throw new Error("Study plan configuration: only newUnitsPerStudyDay = 1 is supported (got "
        + cfg.scheduling.newUnitsPerStudyDay + ").");
    }
    cfg.sessions.forEach(session => {
      if (!ALGORITHMS.includes(session.algorithm)) throw new Error("Study plan configuration: unknown algorithm " + session.algorithm);
      if (!cfg[session.policy]) throw new Error("Study plan configuration: no settings for policy " + session.policy);
    });
    if (!cfg.sessions.length || cfg.sessions[0].algorithm !== "comprehensive") {
      throw new Error("Study plan configuration: the first quiz must be the comprehensive one");
    }
    const review = cfg.adaptiveReview;
    if (review.maximumUniqueWords < review.minimumUniqueWords || review.targetUniqueWords > review.maximumUniqueWords) {
      throw new Error("Study plan configuration: adaptiveReview needs minimum ≤ target ≤ maximum unique words");
    }
    return cfg;
  }

  /* The direction a quiz kind is asked in: { promptLang, answerLang }. */
  function directionFor(config, algorithm) {
    const cfg = config || DEFAULTS;
    const special = cfg.directions && cfg.directions[algorithm];
    const base = special || cfg.answer;
    return { promptLang: base.promptLang, answerLang: base.answerLang };
  }

  function configFor(plan) { return validate(merge(DEFAULTS, (plan && plan.config) || {})); }
  function planById(id) { return PLANS.find(plan => plan.id === id) || null; }

  /* ======================================================================
     2. SCHEDULER
     ====================================================================== */

  /* Study day `day`'s quizzes, for a collection of unitCount units:
       [{ key, label, algorithm, policy, day, units: [unit index, …] }]
     The comprehensive quiz's units are the one it teaches; the review's are
     every unit learnt before this day (its pool). */
  function dayTasks(config, unitCount, day) {
    const cfg = config || DEFAULTS;
    const count = Math.max(0, unitCount | 0);
    const out = [];
    cfg.sessions.forEach(session => {
      let units = null;
      if (session.algorithm === "comprehensive") units = day < count ? [day] : null;
      else {
        const learnt = Math.min(day, count);
        units = learnt > 0 ? Array.from({ length: learnt }, (_, i) => i) : null;
      }
      if (!units) return;
      out.push({ key: session.key, label: session.label, algorithm: session.algorithm, policy: session.policy, day, units });
    });
    return out;
  }

  /* A comprehensive quiz's id names its day and unit, so its record keeps
     pointing at the right words; a review's names its day. */
  function taskId(unitIds, session) {
    if (session.algorithm === "comprehensive") return "d" + session.day + ":" + session.key + ":" + session.units.map(u => unitIds[u]).join("+");
    return "d" + session.day + ":" + session.key;
  }

  /* Local calendar date, YYYY-MM-DD, in the browser's own time zone. */
  function localDate(when) {
    const d = when || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function statusOf(record) {
    if (!record) return "not-started";
    return record.status === "done" ? "completed" : "in-progress";
  }

  function shapeTask(session, units, records) {
    const id = taskId(units, session);
    const record = (records && records[id]) || null;
    return Object.assign({}, session, { id, unitIds: session.units.map(u => units[u]), status: statusOf(record), record });
  }

  /* The study day to show today, from the task records alone:
       { index, tasks: [{ …session, id, unitIds, status, record }],
         complete, finished, completedOn, unitsLearnt, unitCount }
     index    the study day (0-based)
     complete both quizzes are done (they stay on show, ticked, until a
              later date)
     finished there is nothing to schedule (an empty collection)

     records  { [task id]: record }, a record being { status, completedOn }
     units    the collection's unit ids, in order
     today    the local date, YYYY-MM-DD */
  function today(config, units, records, todayDate) {
    const cfg = validate(config || DEFAULTS);
    const count = units.length;
    const sameDayLock = !cfg.scheduling.allowMultipleStudyDaysPerCalendarDay;
    const held = records || {};
    for (let index = 0; ; index += 1) {
      const tasks = dayTasks(cfg, count, index).map(session => shapeTask(session, units, held));
      const meta = { index, unitsLearnt: Math.min(index, count), unitCount: count };
      if (!tasks.length) return Object.assign(meta, { tasks: [], complete: true, finished: true });
      const complete = tasks.every(task => task.status === "completed");
      if (!complete) return Object.assign(meta, { tasks, complete: false, finished: false });
      const completedOn = tasks.reduce((latest, task) =>
        String(task.record.completedOn || "") > latest ? String(task.record.completedOn || "") : latest, "");
      /* Finished today (or on a clock ahead of this one): stay on it. */
      if (sameDayLock && completedOn >= todayDate) return Object.assign(meta, { tasks, complete: true, finished: false, completedOn });
    }
  }

  /* A quiz found by id, for opening a finished one's results after its day
     has passed. */
  function findTask(config, units, id) {
    const match = /^d(\d+):([^:]+)/.exec(String(id || ""));
    if (!match) return null;
    const found = dayTasks(config || DEFAULTS, units.length, Number(match[1]))
      .find(session => session.key === match[2] && taskId(units, session) === id);
    return found ? Object.assign({}, found, { id, unitIds: found.units.map(u => units[u]) }) : null;
  }

  /* ---- the review's words ---------------------------------------------- */

  /* The earlier reviews, newest first, as the selector reads them. */
  function reviewHistory(records, beforeDay) {
    const out = [];
    Object.keys(records || {}).forEach(id => {
      const match = /^d(\d+):review$/.exec(id);
      const record = records[id];
      if (!match || !record || !record.selection) return;
      const day = Number(match[1]);
      if (beforeDay !== undefined && day >= beforeDay) return;
      const tiers = {};
      Object.keys(record.selection.picks || {}).forEach(word => { tiers[word] = record.selection.picks[word].tier; });
      out.push({
        day,
        on: record.selection.on || record.startedOn || "",
        ids: record.selection.ids || [],
        tiers,
        stats: record.selection.stats || null,
        results: record.status === "done" && record.run ? Object.assign({}, record.run.scored) : null
      });
    });
    return out.sort((a, b) => b.day - a.day);
  }

  /* Pick a review task's words.
       task       the review task (its units are the eligible ones)
       units      [{ id, ids }] the collection's units, in order
       words      { word id: memory record }
       starOf     id -> 0–3
       records    the plan's task records (for the earlier reviews)
     -> ReviewSelector.select's result, plus `on` (the date) and `pool`. */
  function selectReview(config, task, units, words, starOf, records, todayDate) {
    const cfg = config || DEFAULTS;
    const exclude = new Set(task.day < units.length ? units[task.day].ids : []);
    const candidates = [];
    const seen = new Set();
    task.units.forEach(index => {
      const unit = units[index];
      (unit && unit.ids || []).forEach(id => {
        if (seen.has(id) || exclude.has(id)) return;
        seen.add(id);
        candidates.push({ id, unit: unit.id, record: (words && words[id]) || null, stars: starOf ? starOf(id) : 0 });
      });
    });
    const result = ReviewSelector.select({
      candidates, today: todayDate, history: reviewHistory(records, task.day),
      config: cfg.adaptiveReview, memory: cfg.srs, seed: task.id
    });
    return Object.assign(result, { on: todayDate, pool: candidates.length });
  }

  /* ======================================================================
     3. QUIZ ENGINE
     ====================================================================== */

  /* The groups of Part 1, as [from, to) ranges over a list of `count` words:
     base groups of `size`, merged pairwise into a balanced tree as each pair
     is passed, so 50 words go 1–5, 6–10, 1–10, 11–15, 16–20, 11–20, 1–20, …,
     1–40, 41–45, 46–50, 41–50, 1–50. The base groups are taken left to right
     in the largest power-of-two blocks that fit (8 then 2 for ten groups);
     after each block past the first, everything so far is tested together,
     which is what makes the last range the whole unit. A short last base
     group just stays short: 43 words end on 41–43 and then 1–43. */
  function hierarchy(count, size, cumulative) {
    const step = Math.max(1, size || 5);
    const base = [];
    for (let from = 0; from < count; from += step) base.push([from, Math.min(count, from + step)]);
    if (cumulative === false || base.length <= 1) return base;
    const out = [];
    function tree(lo, hi) {
      if (hi - lo === 1) { out.push(base[lo].slice()); return; }
      const mid = lo + (hi - lo) / 2;
      tree(lo, mid);
      tree(mid, hi);
      out.push([base[lo][0], base[hi - 1][1]]);
    }
    let lo = 0;
    let blocks = 0;
    while (lo < base.length) {
      let width = 1;
      while (width * 2 <= base.length - lo) width *= 2;
      tree(lo, lo + width);
      lo += width;
      blocks += 1;
      if (blocks > 1) out.push([0, base[lo - 1][1]]);
    }
    return out;
  }

  function shuffle(list, random) {
    const rand = random || Math.random;
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      const swap = out[i];
      out[i] = out[j];
      out[j] = swap;
    }
    return out;
  }

  const PHASE_NAMES = {
    groups: "Building up",
    srs: "Spaced retrieval",
    recall: "Recall",
    retry: "Second tries"
  };

  function phasesFor(algorithm, settings) {
    if (algorithm === "comprehensive") return ["groups"].concat(settings.includeSRSPhase ? ["srs"] : []);
    return ["recall"].concat((settings.sameSessionRetries | 0) > 0 ? ["retry"] : []);
  }

  /* A fresh run.
       algorithm  "comprehensive" or "review"
       ids        the words: a unit's ids in the unit's order, or a review's
                  selection in the order it is to be asked
       options    { policy: the settings block (default: the algorithm's),
                    unitOf: { word id: unit id }, dirOf: { word id: "en>ko" },
                    tiers: { word id: tier } (a review's) } */
  function createRun(algorithm, ids, config, random, options) {
    if (!ALGORITHMS.includes(algorithm)) throw new Error("unknown quiz algorithm " + algorithm);
    const opts = options || {};
    const cfg = config || DEFAULTS;
    const policy = opts.policy || (algorithm === "review" ? "adaptiveReview" : algorithm);
    const settings = cfg[policy];
    if (!settings) throw new Error("no settings for policy " + policy);
    const pool = [...new Set(ids)];
    const unitOf = {};
    const dirOf = {};
    pool.forEach(id => {
      unitOf[id] = (opts.unitOf && opts.unitOf[id]) || "";
      if (opts.dirOf && opts.dirOf[id]) dirOf[id] = opts.dirOf[id];
    });
    const run = {
      v: 3,
      kind: algorithm,
      policy,
      ids: pool,
      unitOf,
      dirOf,
      tiers: Object.assign({}, opts.tiers || {}),
      phases: phasesFor(algorithm, settings),
      /* Where each word's measured answer comes from: a review's one pass
         ("pass"), the comprehensive quiz's first spaced answer ("srs"), or
         with no spaced part its first answer in the last group. */
      scoreAt: null,
      phase: null,
      group: null,
      pass: null,
      srs: null,
      card: null,
      /* first   each word's first answer in this run, whatever the part
         scored  the one measured answer per word that reaches memory and
                 the star
         marks   { id: { w, f } } every weak and failed answer, kept apart
         relearn words let go after repeated misses */
      first: {},
      scored: {},
      marks: {},
      relearn: [],
      log: [],
      answers: 0,
      passed: 0,
      forced: 0,
      done: false
    };
    run.scoreAt = algorithm === "review" ? "pass" : run.phases.includes("srs") ? "srs" : "final-group";
    enter(run, settings, 0, random);
    return run;
  }

  function groupFrom(pool, seq, index, shuffled, random) {
    const range = seq[index];
    const words = pool.slice(range[0], range[1]);
    return { pool, seq, gi: index, order: shuffled ? shuffle(words, random) : words, pos: 0, clean: true, tries: 1, shuffled };
  }

  function enter(run, settings, index, random) {
    run.group = null;
    run.pass = null;
    run.srs = null;
    run.card = null;
    if (index >= run.phases.length) {
      run.phase = "done";
      run.done = true;
      return;
    }
    const phase = run.phases[index];
    run.phase = phase;
    if (phase === "groups") {
      const seq = hierarchy(run.ids.length, settings.baseGroupSize, settings.cumulativeGrouping);
      run.group = groupFrom(run.ids, seq, 0, settings.preserveOriginalOrder === false, random);
      return;
    }
    if (phase === "recall") {
      /* The selection's own (already shuffled, frozen) order. */
      run.pass = { order: run.ids.slice(), pos: 0, scored: true };
      return;
    }
    if (phase === "retry") {
      const missed = run.ids.filter(id => run.scored[id] === "f");
      const tries = Math.max(0, settings.sameSessionRetries | 0);
      const room = Math.max(0, (Number(settings.maxPresentations) || Infinity) - run.answers);
      let order = [];
      for (let i = 0; i < tries; i += 1) order = order.concat(shuffle(missed, random));
      order = order.slice(0, room);
      if (!order.length) { enter(run, settings, index + 1, random); return; }
      run.pass = { order, pos: 0, scored: false };
      return;
    }
    if (phase === "srs") {
      const pool = run.ids.slice();
      const retireAt = Math.max(1, settings.srsRetireAt || 3);
      const session = SpacedSession.create({
        items: pool.map(id => ({ id, item: id, box: srs.startBox(run, id, retireAt) })),
        retireAt
      });
      /* SpacedSession opens in a shuffled order; put the lowest rungs (the
         missed words) first, keeping that shuffle among equals. */
      session.cards.slice().sort((a, b) => a.box - b.box || a.due - b.due)
        .forEach((card, order) => { card.due = order; });
      const card = session.next();
      run.srs = session.snapshot();
      run.card = card ? card.id : null;
      if (!card) enter(run, settings, index + 1, random);
    }
  }

  /* The word to ask now, and where the run stands:
       { id, unit, phase, phaseName, part, parts, group: { index, count, from,
         to, size, attempt, position } | null, position, length } or null. */
  function current(run) {
    if (!run || run.done) return null;
    const part = run.phases.indexOf(run.phase) + 1;
    const base = { phase: run.phase, phaseName: PHASE_NAMES[run.phase] || run.phase, part, parts: run.phases.length };
    let now = null;
    if (run.group) {
      const g = run.group;
      const range = g.seq[g.gi];
      now = Object.assign(base, {
        id: g.order[g.pos],
        group: {
          index: g.gi, count: g.seq.length, from: range[0] + 1, to: range[1],
          size: range[1] - range[0], attempt: g.tries, position: g.pos + 1,
          pool: g.pool.length, ofPool: Boolean(g.targeted)
        },
        position: g.pos + 1,
        length: g.order.length
      });
    } else if (run.pass) {
      now = Object.assign(base, { id: run.pass.order[run.pass.pos], group: null, position: run.pass.pos + 1, length: run.pass.order.length });
    } else if (run.phase === "srs") {
      const stats = srs.stats(run.srs);
      now = Object.assign(base, { id: run.card, group: null, position: stats.asked, length: stats.total, srs: stats });
    }
    if (now) {
      now.unit = run.unitOf ? run.unitOf[now.id] || "" : "";
      now.tier = run.tiers ? run.tiers[now.id] || "" : "";
    }
    return now;
  }

  const RESULTS = ["s", "w", "f"];

  /* Record one answer to the current word and move the run on. Returns what
     happened, for the page to say so:
       { groupPassed, groupRetry, restarted, restartFrom (the 1-based word
         the group starts again from), forced, phaseDone, done, relearn } */
  function answer(run, config, result, ms, random) {
    if (!run || run.done) return { done: true };
    if (!RESULTS.includes(result)) throw new Error("result must be s, w or f");
    const settings = (config || DEFAULTS)[run.policy || run.kind] || {};
    const now = current(run);
    const id = now.id;
    const events = {};
    run.answers += 1;
    run.log.push([id, run.phase, result, Math.max(0, Math.round(Number(ms) || 0))]);
    if (!(id in run.first)) run.first[id] = result;
    if (result !== "s") {
      const mark = run.marks[id] || (run.marks[id] = { w: 0, f: 0 });
      mark[result] += 1;
    }
    const index = run.phases.indexOf(run.phase);

    if (run.group) {
      const g = run.group;
      const lenient = settings.requirePerfectGroupPass === false;
      const limit = Number(settings.maxGroupAttempts) || 0;
      const policy = settings.restartPolicy || "finish-attempt";
      if (result === "f") g.clean = false;
      /* No spaced part: the measured answer is the word's first in the last
         group, the whole unit. */
      if (run.scoreAt === "final-group" && g.gi === g.seq.length - 1 && !(id in run.scored)) run.scored[id] = result;
      /* A miss under "immediate" or "checkpoint" ends the attempt here: the
         rest of the group is not asked, and the next question is the group's
         first word (or the current stretch's). Groups already passed are
         untouched. */
      if (result === "f" && !lenient && policy !== "finish-attempt" && !(limit > 0 && g.tries >= limit)) {
        const size = g.order.length;
        let from = 0;
        if (policy === "checkpoint" && size >= (Number(settings.checkpointMinGroupSize) || 21)) {
          const segment = Math.max(1, Number(settings.checkpointSegmentSize) || 10);
          from = Math.floor(g.pos / segment) * segment;
        }
        if (from === 0 && g.shuffled) {
          const range = g.seq[g.gi];
          g.order = shuffle(g.pool.slice(range[0], range[1]), random);
        }
        events.groupRetry = true;
        events.restarted = true;
        events.restartFrom = from + 1;
        g.pos = from;
        g.clean = true;
        g.tries += 1;
        return events;
      }
      g.pos += 1;
      if (g.pos < g.order.length) return events;
      const forced = !g.clean && !lenient && limit > 0 && g.tries >= limit;
      if (g.clean || lenient || forced) {
        events.groupPassed = true;
        if (forced) { events.forced = true; run.forced += 1; }
        run.passed += 1;
        if (g.gi + 1 >= g.seq.length) {
          events.phaseDone = true;
          enter(run, settings, index + 1, random);
        } else {
          run.group = groupFrom(g.pool, g.seq, g.gi + 1, g.shuffled, random);
        }
      } else {
        events.groupRetry = true;
        const range = g.seq[g.gi];
        const words = g.pool.slice(range[0], range[1]);
        g.order = g.shuffled ? shuffle(words, random) : words;
        g.pos = 0;
        g.clean = true;
        g.tries += 1;
      }
    } else if (run.pass) {
      if (run.pass.scored !== false && !(id in run.scored)) run.scored[id] = result;
      run.pass.pos += 1;
      if (run.pass.pos >= run.pass.order.length) {
        events.phaseDone = true;
        enter(run, settings, index + 1, random);
      }
    } else if (run.phase === "srs") {
      /* The comprehensive quiz's measured answer is its first shuffled one. */
      if (run.scoreAt === "srs" && !(id in run.scored)) run.scored[id] = result;
      const session = SpacedSession.create({ restore: run.srs });
      const card = session.cards.find(entry => entry.id === id);
      let outcome;
      if (result === "w" && settings.weakClimbs === false) {
        const box = card.box;
        session.grade(card, false);
        card.missed -= 1;
        card.box = box;
        outcome = { retired: false, box };
      } else {
        outcome = session.grade(card, result !== "f");
      }
      if (!outcome.retired && card.missed >= Math.max(1, settings.relearnAfterMisses || 3)) {
        card.retired = true;
        card.gaveUp = true;
        if (!run.relearn.includes(id)) run.relearn.push(id);
        events.relearn = id;
      }
      const next = session.next();
      run.srs = session.snapshot();
      if (next) run.card = next.id;
      else {
        /* The question cap ends a run that will not settle; whatever is
           still in it is flagged rather than forgotten. */
        session.cards.forEach(entry => {
          if (!entry.retired && !run.relearn.includes(entry.id)) run.relearn.push(entry.id);
        });
        events.phaseDone = true;
        enter(run, settings, index + 1, random);
      }
    }
    if (run.done) events.done = true;
    return events;
  }

  /* 0–1, for a progress bar: each part an equal share, and inside a part
     the share of its questions (groups: of the words in all its groups;
     spaced: of the rungs still to climb). */
  function progress(run) {
    if (!run) return 0;
    if (run.done) return 1;
    const parts = run.phases.length;
    const index = run.phases.indexOf(run.phase);
    let within = 0;
    if (run.group) {
      const g = run.group;
      const sizes = g.seq.map(range => range[1] - range[0]);
      const total = sizes.reduce((a, b) => a + b, 0);
      const before = sizes.slice(0, g.gi).reduce((a, b) => a + b, 0);
      within = total ? (before + g.pos) / total : 0;
    } else if (run.pass) {
      within = run.pass.order.length ? run.pass.pos / run.pass.order.length : 0;
    } else if (run.srs) {
      const stats = srs.stats(run.srs);
      within = stats.needed ? stats.climbed / stats.needed : 0;
    }
    return Math.min(0.999, (index + Math.min(1, within)) / parts);
  }

  /* What the run found, once it is done:
       { strong, weak, failed }  the measured answer, word by word
       relearn                    let go after repeated misses
       practised                  words that had any weak or failed answer
       byUnit, byTier             the same, unit by unit and (a review's)
                                  tier by tier */
  function outcome(run) {
    const summarise = ids => {
      const pick = code => ids.filter(id => run.scored[id] === code);
      return {
        words: ids.length,
        strong: pick("s"),
        weak: pick("w"),
        failed: pick("f"),
        unscored: ids.filter(id => !(id in run.scored)),
        relearn: run.relearn.filter(id => ids.includes(id)),
        practised: ids.filter(id => run.marks[id])
      };
    };
    const all = summarise(run.ids);
    const groupBy = lookup => {
      const keys = [];
      run.ids.forEach(id => { const key = lookup[id] || ""; if (!keys.includes(key)) keys.push(key); });
      const out = {};
      keys.forEach(key => { out[key] = summarise(run.ids.filter(id => (lookup[id] || "") === key)); });
      return out;
    };
    all.byUnit = groupBy(run.unitOf || {});
    all.byTier = run.tiers && Object.keys(run.tiers).length ? groupBy(run.tiers) : {};
    all.answers = run.answers;
    return all;
  }

  /* ======================================================================
     4. SRS ADAPTER
     ====================================================================== */
  const srs = {
    /* Where a word starts on Part 2's ladder, from how Part 1 went: never
       wrong or slow → one right answer retires it; ever slow → one rung up;
       ever wrong → the bottom. */
    startBox(run, id, retireAt) {
      const top = Math.max(0, retireAt - 1);
      const mark = run.marks[id];
      if (!mark) return top;
      if (mark.f) return 0;
      return Math.min(top, 1);
    },

    stats(snapshot) {
      if (!snapshot) return { total: 0, retired: 0, live: 0, asked: 0, climbed: 0, needed: 0 };
      const retireAt = snapshot.retireAt;
      let climbed = 0;
      let needed = 0;
      let retired = 0;
      snapshot.cards.forEach(card => {
        const owed = retireAt - card.from;
        needed += owed;
        if (card.retired) { climbed += owed; retired += 1; }
        else climbed += Math.max(0, Math.min(retireAt, card.box) - card.from);
      });
      return { total: snapshot.cards.length, retired, live: snapshot.cards.length - retired, asked: snapshot.asked, climbed, needed };
    },

    /* The star each word should move to, as proposals for the page to show
       and the learner to confirm, using the site's own star rules:
         strong  up a rung (★★★ only if the last clean answer was on an
                 earlier calendar day), stamped clean today
         weak    right, so it never costs a star; an unstarred word gets ★
         failed  a rung down — a ★★★ word forgotten loses its third star
       starOf(id) -> { l, d } the word's current star record. */
    proposals(run, starOf, todayDate) {
      const out = [];
      run.ids.forEach(id => {
        const result = run.scored[id];
        if (!result) return;
        const held = starOf(id) || {};
        const level = Math.max(0, Math.min(SpacedSession.stars.RUNGS, Number(held.l) || 0));
        let to = level;
        let cleanDay = "";
        /* Only an answer given in 한국어 is production. */
        const produced = String((run.dirOf || {})[id] || "en>ko").split(">")[1] === "ko";
        if (result === "s") {
          const earned = SpacedSession.stars.earned(true, held.d || "", todayDate);
          to = SpacedSession.stars.after(level, earned, { produced });
          cleanDay = todayDate;
        } else if (result === "w") {
          to = produced ? Math.max(level, 1) : level;
        } else {
          to = SpacedSession.stars.after(level, 1, { produced: true });
        }
        out.push({ id, unit: (run.unitOf || {})[id] || "", result, from: level, to, cleanDay });
      });
      return out;
    },

    /* Each word's memory record after this run: one update per word, from
       its measured answer, on the calendar date. held(id) -> the record so
       far. options: { source (the task id: a source already applied to a
       word is skipped), memory (the srs settings) }. Only the run's own
       words are touched. -> { id: record } for the words that changed. */
    wordRecords(run, held, todayDate, options) {
      const opts = options || {};
      const out = {};
      run.ids.forEach(id => {
        const result = run.scored[id];
        const relearn = run.relearn.includes(id);
        if (!result && !relearn) return;
        const applied = StudyMemory.apply(held(id), {
          result, date: todayDate, source: opts.source || "",
          kind: run.kind === "comprehensive" ? "learn" : "review",
          marks: run.marks[id] || null, relearn
        }, opts.memory);
        if (applied.applied) out[id] = applied.record;
      });
      return out;
    }
  };

  const engine = { create: createRun, current, answer, progress, outcome, hierarchy, PHASE_NAMES };

  return {
    DEFAULTS, PLANS, ALGORITHMS,
    configFor, planById, merge, validate, directionFor,
    dayTasks, taskId, today, findTask, localDate, statusOf,
    reviewHistory, selectReview,
    engine, srs, hierarchy, shuffle
  };
}));
