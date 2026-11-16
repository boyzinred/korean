/*
  study-plan.js
  ----------------------------------------------------------------------------
  The daily tasks: which vocabulary units each study day quizzes, and how each
  of the three quizzes runs. No DOM, no storage, no network — the home page's
  Today's Tasks card and study-quiz.html drive it, study-plan-store.js keeps
  what it produces, and shared-vocab/test-study-plan.js tests it.

  Four parts, each usable on its own:

  1. CONFIG — StudyPlan.PLANS, StudyPlan.DEFAULTS
     A plan is a collection (a word bank from review-banks.js, cut into units
     by one of its groupings) plus the policies below. Nothing in the
     scheduler or the quizzes knows which collection it is running, or how
     many words a unit has: sizes come from the data. A second plan is one
     more entry in PLANS.

  2. SCHEDULER — StudyPlan.timeline(config, unitCount), StudyPlan.today(…)
     One new unit per study day: unit k is learnt on study day k. A unit is
     then quizzed at study days 0, 1, 3, 7, 14, 21 and 29 after that — seven
     exposures over 30 study days. The exposures are grouped into four
     sessions, each one quiz on screen:

       Comprehensive         offset 0      today's unit
       Early Review          offsets 1, 3  the units learnt 1 and 3 days ago
       Intermediate Review   offsets 7, 14
       Maintenance Review    offsets 21, 29

     A review that covers two units is one session and one exposure for each
     of them. A session only exists on a day that has at least one unit for
     it, so the first days ramp up from one session to four, and from study
     day 29 every day has exactly four until the units run out. More session
     types than the daily maximum is a configuration error, thrown at once.

     A study day is a batch of sessions, not a date. The day you are on is
     worked out from which sessions are finished, every time, rather than
     counted up: day d is finished when all of its sessions are, and the next
     one opens on a later local date than the one d was finished on. So a
     missed week leaves you on the same day, nothing ever goes overdue, and
     refreshing, two tabs or a retried save cannot move the day twice.

  3. QUIZ ENGINE — StudyPlan.engine
     A run is a plain object (a checkpoint) that survives JSON, so it can be
     paused after any answer and resumed anywhere. Its pool is one unit's
     words, or two units' words one after the other; every word keeps its
     unit (run.unitOf) so results can be read unit by unit. Each answer is
     graded by the page as "s" strong (right and sure), "w" weak (right but
     hesitant) or "f" failed (wrong, skipped or not known).

       comprehensive  Part 1 groups: the unit in its own order, five words at
                      a time, merged into ever larger groups (hierarchy()),
                      each repeated until one attempt is all right. A miss
                      stops the attempt at once and the group starts again
                      from the start of its current 5-word segment
                      (restartPolicy).
                      Part 2 spaced: every word once more, shuffled, through
                      SpacedSession; what Part 1 found weak starts lower on
                      the ladder and comes round more.
       review         Part 1 every word once, shuffled. Part 2 the weak and
                      failed ones only, in groups (shuffled each attempt).
                      Part 3 those again, spaced. Early and intermediate
                      reviews run it with their own policy.
       maintenance    Part 1 every word once, cold. Part 2 spaced, weak once
                      more and failed twice; no grouping.

     A word that keeps failing in a spaced part is let go after a few misses
     and flagged for relearning rather than holding the run hostage.

  4. SRS ADAPTER — StudyPlan.srs
     The site's spaced repetition is SpacedSession (the in-sitting ladder) and
     its star rules (★ to ★★★, ★★★ only on a later calendar day than the last
     clean run). A run moves each word's star at most once, from one measured
     answer: the first spaced retrieval in a comprehensive quiz, the first
     answer in a review or maintenance quiz. Everything else in the run is
     practice and never reaches the star — which is what keeps a hundred right
     answers in one evening from counting as a hundred days of memory. Those
     rules, and the per-word retrieval log, run on calendar dates, not study
     days: a two-week break reads as two weeks.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./spaced-session.js"));
  else root.StudyPlan = factory(root.SpacedSession);
}(typeof self !== "undefined" ? self : this, function (SpacedSession) {
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
      maximumSessionsPerStudyDay: 4,
      calendarMode: "completed-study-days",
      missedDaysPauseSchedule: true,
      allowMultipleStudyDaysPerCalendarDay: false
    },
    /* The day's sessions, in the order they are shown and done. offsets are
       study days after a unit is learnt; policy names the settings block the
       session's quiz runs with. */
    sessions: [
      { key: "comprehensive", label: "Comprehensive Quiz", algorithm: "comprehensive", policy: "comprehensive", offsets: [0] },
      { key: "earlyReview", label: "Early Review", algorithm: "review", policy: "earlyReview", offsets: [1, 3] },
      { key: "intermediateReview", label: "Intermediate Review", algorithm: "review", policy: "intermediateReview", offsets: [7, 14] },
      { key: "maintenance", label: "Maintenance Review", algorithm: "maintenance", policy: "maintenance", offsets: [21, 29] }
    ],
    comprehensive: {
      baseGroupSize: 5,
      cumulativeGrouping: true,
      preserveOriginalOrder: true,
      requirePerfectGroupPass: true,
      /* What a miss inside a group does:
           "checkpoint"      stop the attempt there, show the answer, and
                             start again from the first word of the current
                             checkpointSegmentSize-word segment, in groups of
                             checkpointMinGroupSize words or more (smaller
                             groups restart whole). The default: strict
                             5-word checkpoints, so a miss on word 7 of 1–10
                             goes back to word 6, and a miss on word 3 to
                             word 1
           "immediate"       stop there and start the whole group again from
                             its first word
           "finish-attempt"  finish the attempt, then repeat the whole group
         Whichever it is, a group passes only once every word in it has been
         answered right with no miss since its segment (or the group) began. */
      restartPolicy: "checkpoint",
      checkpointMinGroupSize: 6,
      checkpointSegmentSize: 5,
      /* A safeguard, off by default: after this many failed attempts at one
         group, pass it anyway (its misses stay recorded). null = never. */
      maxGroupAttempts: null,
      includeSRSPhase: true,
      srsRetireAt: 3,
      relearnAfterMisses: 3
    },
    /* Days 1 and 3: consolidation. A hesitant word starts at the bottom of
       the spaced ladder, so it is asked twice more, and a word is given
       more misses before it is set aside. */
    earlyReview: {
      combineEligibleUnits: true,
      initialFullRecall: true,
      repeatWeakWords: true,
      targetedGroupSize: 5,
      restartPolicy: "finish-attempt",
      maxGroupAttempts: null,
      includeSRSPhase: true,
      srsRetireAt: 2,
      weakStart: "bottom",
      relearnAfterMisses: 3
    },
    /* Days 7 and 14: independent retrieval. A hesitant word needs one
       delayed right answer, and nothing strong is asked again. */
    intermediateReview: {
      combineEligibleUnits: true,
      initialFullRecall: true,
      repeatWeakWords: true,
      targetedGroupSize: 5,
      restartPolicy: "finish-attempt",
      maxGroupAttempts: null,
      includeSRSPhase: true,
      srsRetireAt: 2,
      weakStart: "top",
      relearnAfterMisses: 2
    },
    maintenance: {
      combineEligibleUnits: true,
      initialColdRecall: true,
      cumulativeGrouping: false,
      selectiveRemediation: true,
      includeSRSPhase: true,
      srsRetireAt: 2,
      weakStart: "top",
      relearnAfterMisses: 1
    },
    /* Asked in English, answered in 한국어: a production answer, which is
       the only kind the star rules let raise a star. A typed answer slower
       than hesitantAfterMs starts out marked hesitant; the learner can
       unmark it. */
    answer: { promptLang: "en", answerLang: "ko", hesitantAfterMs: 8000 },
    /* Exposures asked the other way, by algorithm and exposure number. Each
       unit's Review 2 (3 study days after it is learnt) shows the 한국어 and
       is answered in English: a recognition check between the production
       ones. In a combined session only that unit's words turn round; each
       question says which way it goes. A recognition answer can keep or cost
       a star but never raise one (the site's star rule). */
    exposureDirections: {
      review: { 2: { promptLang: "ko", answerLang: "en" } }
    }
  };

  const PLANS = [
    {
      id: "topik-ii-vocab",
      title: "TOPIK II section vocab",
      /* review-banks.js bank id, the grouping whose groups are the units,
         and which of those groups to use, in order: every group matching the
         first pattern (in the bank's own order), then the second, … The units
         themselves are used as they are: same words, same order inside.

         2023 only for now. To add the 2018 workbook later, append
         "^unit-2018-" — its units then follow 2023's rather than coming
         first, so the schedule already walked is not disturbed. Only ever
         append: a unit put ahead of ones already learnt would shift them. */
      collection: { bank: "topik-ii-vocab", grouping: "unit", units: ["^unit-2023-"] }
    }
  ];

  const ALGORITHMS = ["comprehensive", "review", "maintenance"];

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
    const max = cfg.scheduling.maximumSessionsPerStudyDay;
    if (cfg.sessions.length > max) {
      throw new Error("Study plan configuration: " + cfg.sessions.length + " session types ("
        + cfg.sessions.map(s => s.key).join(", ") + ") can fall on one study day, but maximumSessionsPerStudyDay is "
        + max + ". Merge offsets into fewer sessions or raise the maximum.");
    }
    if (cfg.scheduling.newUnitsPerStudyDay !== 1) {
      throw new Error("Study plan configuration: only newUnitsPerStudyDay = 1 is supported (got "
        + cfg.scheduling.newUnitsPerStudyDay + ").");
    }
    const seen = new Set();
    cfg.sessions.forEach(session => {
      if (!ALGORITHMS.includes(session.algorithm)) throw new Error("Study plan configuration: unknown algorithm " + session.algorithm);
      if (!cfg[session.policy]) throw new Error("Study plan configuration: no settings for policy " + session.policy);
      session.offsets.forEach(offset => {
        if (seen.has(offset)) throw new Error("Study plan configuration: offset " + offset + " is in two sessions");
        seen.add(offset);
      });
    });
    if (!seen.has(0) || cfg.sessions[0].offsets[0] !== 0 || cfg.sessions[0].algorithm !== "comprehensive") {
      throw new Error("Study plan configuration: the first session must be the comprehensive quiz at offset 0");
    }
    return cfg;
  }

  /* The direction an exposure is asked in: { promptLang, answerLang }. */
  function directionFor(config, algorithm, n) {
    const cfg = config || DEFAULTS;
    const special = cfg.exposureDirections && cfg.exposureDirections[algorithm] && cfg.exposureDirections[algorithm][n];
    const base = special || cfg.answer;
    return { promptLang: base.promptLang, answerLang: base.answerLang };
  }

  function configFor(plan) { return validate(merge(DEFAULTS, (plan && plan.config) || {})); }
  function planById(id) { return PLANS.find(plan => plan.id === id) || null; }

  /* ======================================================================
     2. SCHEDULER
     ====================================================================== */

  /* Every study day's sessions, for a collection of unitCount units, as
     [[session, …], …] indexed by study day. A session is
       { key, label, algorithm, policy, day, units: [unit index, …],
         exposures: [{ unit, offset, n }] }
     with units in the order of the session's offsets (most recent first),
     and n each unit's exposure number within the session's kind across its
     schedule (Review 1–4 counts early and intermediate together,
     Maintenance 1–2). */
  function timeline(config, unitCount) {
    const cfg = validate(config || DEFAULTS);
    const count = Math.max(0, unitCount | 0);
    if (!count) return [];
    const maxOffset = Math.max(...cfg.sessions.flatMap(s => s.offsets));
    /* A unit's exposure number within its algorithm, over the offsets in
       schedule order: review offsets 1, 3, 7, 14 are Review 1–4. */
    const numberOf = {};
    ALGORITHMS.forEach(algorithm => {
      cfg.sessions.filter(s => s.algorithm === algorithm).flatMap(s => s.offsets)
        .sort((a, b) => a - b).forEach((offset, index) => { numberOf[offset] = index + 1; });
    });
    const days = [];
    for (let day = 0; day < count + maxOffset; day += 1) {
      const sessions = [];
      cfg.sessions.forEach(session => {
        const exposures = session.offsets
          .map(offset => ({ unit: day - offset, offset, n: numberOf[offset] }))
          .filter(exposure => exposure.unit >= 0 && exposure.unit < count);
        if (!exposures.length) return;
        sessions.push({
          key: session.key, label: session.label, algorithm: session.algorithm, policy: session.policy,
          day, units: exposures.map(e => e.unit), exposures
        });
      });
      if (sessions.length > cfg.scheduling.maximumSessionsPerStudyDay) {
        throw new Error("Study plan: study day " + day + " has " + sessions.length + " sessions, over the maximum");
      }
      days.push(sessions);
    }
    return days;
  }

  /* A session's id names its day, its kind and its units by the units' own
     ids, so a record keeps pointing at the right words. */
  function taskId(unitIds, session) {
    return "d" + session.day + ":" + session.key + ":" + session.units.map(u => unitIds[u]).join("+");
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

  /* The study day to show today, from the session records alone:
       { index, tasks: [{ …session, id, unitIds, status, record }],
         complete, finished, completedOn, total }
     index    the study day (0-based)
     complete every session of it is done (today: they stay on show, ticked,
              until tomorrow)
     finished the plan has no study days left

     records  { [task id]: record }, a record being { status, completedOn }
     units    the collection's unit ids, in order
     today    the local date, YYYY-MM-DD */
  function today(config, units, records, todayDate) {
    const cfg = validate(config || DEFAULTS);
    const days = timeline(cfg, units.length);
    const sameDayLock = !cfg.scheduling.allowMultipleStudyDaysPerCalendarDay;
    const held = records || {};
    const shape = session => {
      const id = taskId(units, session);
      const record = held[id] || null;
      return Object.assign({}, session, { id, unitIds: session.units.map(u => units[u]), status: statusOf(record), record });
    };
    for (let index = 0; index < days.length; index += 1) {
      const tasks = days[index].map(shape);
      if (!tasks.length) continue;
      const complete = tasks.every(task => task.status === "completed");
      if (!complete) return { index, tasks, complete: false, finished: false, total: days.length };
      const completedOn = tasks.reduce((latest, task) =>
        String(task.record.completedOn || "") > latest ? String(task.record.completedOn || "") : latest, "");
      /* Finished today (or on a clock ahead of this one): stay on it. */
      if (sameDayLock && completedOn >= todayDate) {
        return { index, tasks, complete: true, finished: false, completedOn, total: days.length };
      }
    }
    return { index: days.length, tasks: [], complete: true, finished: true, total: days.length };
  }

  /* A session found by id anywhere in the plan, for opening a finished one's
     results after its day has passed. */
  function findTask(config, units, id) {
    const days = timeline(config, units.length);
    for (const sessions of days) {
      for (const session of sessions) {
        if (taskId(units, session) === id) return Object.assign({}, session, { id, unitIds: session.units.map(u => units[u]) });
      }
    }
    return null;
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
    initial: "Recall",
    cold: "Cold recall",
    targeted: "Weak words, in groups",
    srs: "Spaced practice"
  };

  function phasesFor(algorithm, settings) {
    if (algorithm === "comprehensive") return ["groups"].concat(settings.includeSRSPhase ? ["srs"] : []);
    if (algorithm === "review") {
      return ["initial"].concat(settings.repeatWeakWords ? ["targeted"] : [], settings.includeSRSPhase ? ["srs"] : []);
    }
    return ["cold"].concat(settings.selectiveRemediation && settings.includeSRSPhase ? ["srs"] : []);
  }

  /* A fresh run.
       algorithm  "comprehensive", "review" or "maintenance"
       ids        the pool: one unit's word ids in the unit's order, or
                  several units' concatenated (a word in two units is asked
                  once, under the first)
       options    { policy: the settings block (default: the algorithm's),
                    unitOf: { word id: unit id } } */
  function createRun(algorithm, ids, config, random, options) {
    if (!ALGORITHMS.includes(algorithm)) throw new Error("unknown quiz algorithm " + algorithm);
    const opts = options || {};
    const cfg = config || DEFAULTS;
    const policy = opts.policy || (algorithm === "review" ? "earlyReview" : algorithm);
    const settings = cfg[policy];
    if (!settings) throw new Error("no settings for policy " + policy);
    const pool = [...new Set(ids)];
    const unitOf = {};
    /* dirOf: each word's direction as "en>ko", kept in the run so a resumed
       run asks the same way and the stars know a recognition answer. */
    const dirOf = {};
    pool.forEach(id => { if (opts.dirOf && opts.dirOf[id]) dirOf[id] = opts.dirOf[id]; });
    pool.forEach(id => { unitOf[id] = (opts.unitOf && opts.unitOf[id]) || ""; });
    const run = {
      v: 2,
      kind: algorithm,
      policy,
      ids: pool,
      unitOf,
      dirOf,
      phases: phasesFor(algorithm, settings),
      phase: null,
      group: null,
      pass: null,
      srs: null,
      card: null,
      /* first   each word's first answer in this run, whatever the part
         scored  the one measured answer per word that reaches the star
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
    enter(run, settings, 0, random);
    return run;
  }

  function groupFrom(pool, seq, index, shuffled, random) {
    const range = seq[index];
    const words = pool.slice(range[0], range[1]);
    /* targeted marks a review's weak-word groups, which shuffle every
       attempt; a comprehensive group keeps the unit's order. */
    return { pool, seq, gi: index, order: shuffled ? shuffle(words, random) : words, pos: 0, clean: true, tries: 1, shuffled, targeted: false };
  }

  /* Weak or failed on the measured answer. */
  function needsWork(run) {
    return run.ids.filter(id => run.scored[id] === "w" || run.scored[id] === "f");
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
    if (phase === "initial" || phase === "cold") {
      run.pass = { order: shuffle(run.ids, random), pos: 0 };
      return;
    }
    if (phase === "targeted") {
      const pool = needsWork(run);
      if (!pool.length) { enter(run, settings, index + 1, random); return; }
      const seq = hierarchy(pool.length, settings.targetedGroupSize, true);
      run.group = groupFrom(pool, seq, 0, true, random);
      run.group.targeted = true;
      return;
    }
    if (phase === "srs") {
      const pool = run.kind === "comprehensive" ? run.ids.slice() : needsWork(run);
      if (!pool.length) { enter(run, settings, index + 1, random); return; }
      const retireAt = Math.max(1, settings.srsRetireAt || 3);
      const session = SpacedSession.create({
        items: pool.map(id => ({ id, item: id, box: srs.startBox(run, id, retireAt, settings) })),
        retireAt
      });
      /* SpacedSession opens in a shuffled order; put the lowest rungs (the
         failed words) first, keeping that shuffle among equals. */
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
    const base = { phase: run.phase, phaseName: PHASE_NAMES[run.phase], part, parts: run.phases.length };
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
    if (now) now.unit = run.unitOf ? run.unitOf[now.id] || "" : "";
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
    const settings = (config || DEFAULTS)[run.policy || run.kind];
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
      const lenient = run.phase === "groups" && settings.requirePerfectGroupPass === false;
      const limit = Number(settings.maxGroupAttempts) || 0;
      const policy = settings.restartPolicy || "finish-attempt";
      if (result === "f") g.clean = false;
      /* A miss under "immediate" or "checkpoint" ends the attempt here: the
         rest of the group is not asked, and the next question is the group's
         first word (or the current segment's). Groups already passed are
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
          const targeted = g.targeted;
          run.group = groupFrom(g.pool, g.seq, g.gi + 1, g.shuffled, random);
          run.group.targeted = targeted;
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
      run.scored[id] = result;
      run.pass.pos += 1;
      if (run.pass.pos >= run.pass.order.length) {
        events.phaseDone = true;
        enter(run, settings, index + 1, random);
      }
    } else if (run.phase === "srs") {
      /* The comprehensive quiz's measured answer is its first shuffled one. */
      if (run.kind === "comprehensive" && !(id in run.scored)) run.scored[id] = result;
      const session = SpacedSession.create({ restore: run.srs });
      const card = session.cards.find(entry => entry.id === id);
      const outcome = session.grade(card, result !== "f");
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
       byUnit                     the same, unit by unit */
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
    const units = [];
    run.ids.forEach(id => { const unit = (run.unitOf || {})[id] || ""; if (!units.includes(unit)) units.push(unit); });
    all.byUnit = {};
    units.forEach(unit => { all.byUnit[unit] = summarise(run.ids.filter(id => ((run.unitOf || {})[id] || "") === unit)); });
    all.answers = run.answers;
    return all;
  }

  /* ======================================================================
     4. SRS ADAPTER
     ====================================================================== */
  const srs = {
    /* Where a word starts on the spaced ladder. In a comprehensive quiz,
       from how Part 1 went: never wrong or slow → one right answer retires
       it; ever slow → one rung up; ever wrong → the bottom. In a review or a
       maintenance quiz only weak and failed words are in it: failed from the
       bottom, weak from where the policy says (early review: the bottom). */
    startBox(run, id, retireAt, settings) {
      const top = Math.max(0, retireAt - 1);
      if (run.kind === "comprehensive") {
        const mark = run.marks[id];
        if (!mark) return top;
        if (mark.f) return 0;
        return Math.min(top, 1);
      }
      if (run.scored[id] === "w") return settings && settings.weakStart === "bottom" ? 0 : top;
      return 0;
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
         strong  as a clean spaced run: up a rung (★★★ only if the last clean
                 run was on an earlier calendar day), stamped clean today
         weak    right, so it never costs a star; an unstarred word gets ★
         failed  a rung down
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

    /* The long-term record of each measured retrieval, on calendar dates:
       { last, gap (calendar days since the previous one), seen, right,
         weak, relearn, lapses }. held(id) -> the word's record so far. */
    wordRecords(run, held, todayDate) {
      const out = {};
      const toDay = date => Math.round(new Date(date + "T12:00:00").getTime() / 86400000);
      run.ids.forEach(id => {
        const result = run.scored[id];
        const before = held(id) || {};
        const record = Object.assign({}, before);
        if (result) {
          record.gap = before.last ? toDay(todayDate) - toDay(before.last) : null;
          record.last = todayDate;
          record.seen = (Number(before.seen) || 0) + 1;
          record.right = (Number(before.right) || 0) + (result === "f" ? 0 : 1);
          record.weak = (Number(before.weak) || 0) + (result === "w" ? 1 : 0);
          record.result = result;
        }
        if (run.relearn.includes(id)) {
          record.relearn = true;
          record.lapses = (Number(before.lapses) || 0) + 1;
        } else if (result === "s" && before.relearn) {
          record.relearn = false;
        }
        if (result || run.relearn.includes(id)) out[id] = record;
      });
      return out;
    }
  };

  const engine = { create: createRun, current, answer, progress, outcome, hierarchy, PHASE_NAMES };

  return {
    DEFAULTS, PLANS, ALGORITHMS,
    configFor, planById, merge, validate, directionFor,
    timeline, taskId, today, findTask, localDate, statusOf,
    engine, srs, hierarchy, shuffle
  };
}));
