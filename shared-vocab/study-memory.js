/*
  study-memory.js
  ----------------------------------------------------------------------------
  The long-term memory model behind the daily tasks: how well each word is
  probably remembered today, and how one measured answer changes that.

  The site already had two pieces of spaced repetition, and this keeps both:

    SpacedSession (spaced-session.js)  spacing inside one sitting
    the familiarity stars              ★ to ★★★, with their own rules
                                       (SpacedSession.stars), confirmed by
                                       the learner after a quiz

  What it did not have is a memory estimate across days. The daily tasks
  already kept one record per word (study-plan-store.js, w:<word id>) with
  the date and result of every measured retrieval; this module grows that
  same record into a memory state rather than adding a second store:

    s       stability, in days: how long until recall drops to 90%
    d       difficulty, 1 (easy) – 10 (hard), from the word's history
    last    the calendar date of its last measured retrieval
    first   the date it was learnt (its comprehensive quiz)
    seen, right, weak, lapses, result, relearn, gap   as before
    recent  its last few results, oldest first ("ssfw")
    ev      the quizzes already applied to it, newest last — a quiz is
            applied to a word once, however often its save is retried

  Recall is modelled as an exponential forgetting curve on real calendar
  days, R = 0.9 ^ (elapsed / s), so a word left alone for two weeks reads
  as two weeks even while the study-day schedule was paused. A word is due
  when R falls to targetRetention.

  One measured answer is one update:
    strong   s grows, more when it was recalled late (low R) than early
    weak     s grows a little
    failed   s collapses (lapseFactor), it is flagged for relearning
    same calendar day as the last retrieval: no growth at all — an evening
    of cramming cannot fake a week of memory

  A record written before this model (no s) is read from its last result,
  so nothing already studied is lost.

  No DOM, no storage. Node: require("./study-memory.js").
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.StudyMemory = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DEFAULTS = {
    useExistingEngine: true,
    trackActualElapsedTime: true,
    avoidSameSessionMasteryInflation: true,
    updateOnIndependentRecall: true,
    /* R at which a word is due; also the R that stability is measured at. */
    targetRetention: 0.9,
    /* Stability after the comprehensive quiz, by its measured answer. A word
       missed twice or more while the groups were built starts lower. */
    initialStability: { s: 1, w: 0.5, f: 0.25 },
    troubledStartFactor: 0.7,
    troubledAfterMisses: 2,
    /* Growth on a later day: s × (1 + gain × difficulty factor ×
       (1 + lateBonus × (1 − R))). */
    strongGain: 1.2,
    weakGain: 0.3,
    lateBonus: 4,
    lapseFactor: 0.3,
    minStability: 0.25,
    maxStability: 365,
    /* Overdue: past due by this multiple of its interval. */
    overdueFactor: 2,
    difficulty: { start: 5, perLearnMiss: 0.5, maxLearnPenalty: 2, fail: 1, weak: 0.5, strong: -0.3, min: 1, max: 10 },
    recentLength: 6,
    eventMemory: 12
  };

  function settings(config) {
    const cfg = Object.assign({}, DEFAULTS, config || {});
    cfg.initialStability = Object.assign({}, DEFAULTS.initialStability, (config && config.initialStability) || {});
    cfg.difficulty = Object.assign({}, DEFAULTS.difficulty, (config && config.difficulty) || {});
    return cfg;
  }

  const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));

  /* Calendar days, counted at local noon so a clock change is not a day. */
  function dayNumber(date) {
    if (!date) return NaN;
    return Math.round(new Date(String(date).slice(0, 10) + "T12:00:00").getTime() / 86400000);
  }
  function daysBetween(from, to) {
    const a = dayNumber(from);
    const b = dayNumber(to);
    return Number.isFinite(a) && Number.isFinite(b) ? b - a : NaN;
  }

  /* The record read as a memory state. A record from before this model has
     no s; its last result stands in for it. */
  function state(record, config) {
    const cfg = settings(config);
    const r = record || {};
    const learnt = Boolean(r.last);
    let s = Number(r.s);
    if (!(s > 0)) s = learnt ? (cfg.initialStability[r.result] || cfg.initialStability.s) : 0;
    let d = Number(r.d);
    if (!(d > 0)) d = cfg.difficulty.start + (Number(r.lapses) || 0) * cfg.difficulty.fail;
    return {
      learnt,
      s: learnt ? clamp(s, cfg.minStability, cfg.maxStability) : 0,
      d: clamp(d, cfg.difficulty.min, cfg.difficulty.max),
      last: r.last || "",
      first: r.first || r.last || "",
      seen: Number(r.seen) || 0,
      right: Number(r.right) || 0,
      weak: Number(r.weak) || 0,
      lapses: Number(r.lapses) || 0,
      result: r.result || "",
      relearn: Boolean(r.relearn),
      recent: String(r.recent || r.result || "")
    };
  }

  /* Days of waiting that bring R from 1 down to `target`. */
  function interval(s, config) {
    const cfg = settings(config);
    return s * Math.log(cfg.targetRetention) / Math.log(0.9);
  }

  function retention(record, today, config) {
    const st = state(record, config);
    if (!st.learnt) return 0;
    const elapsed = Math.max(0, daysBetween(st.last, today) || 0);
    return Math.pow(0.9, elapsed / st.s);
  }

  /* Where a word stands today:
       { learnt, R, elapsed, interval, dueOn, isDue, overdue, s, d } */
  function status(record, today, config) {
    const cfg = settings(config);
    const st = state(record, cfg);
    if (!st.learnt) return { learnt: false, R: 0, elapsed: Infinity, interval: 0, dueOn: "", isDue: true, overdue: true, s: 0, d: st.d };
    const elapsed = Math.max(0, daysBetween(st.last, today) || 0);
    const R = Math.pow(0.9, elapsed / st.s);
    const wait = interval(st.s, cfg);
    const due = new Date(st.last + "T12:00:00");
    due.setDate(due.getDate() + Math.max(1, Math.round(wait)));
    const dueOn = due.getFullYear() + "-" + String(due.getMonth() + 1).padStart(2, "0") + "-" + String(due.getDate()).padStart(2, "0");
    return {
      learnt: true, R, elapsed, interval: wait, dueOn,
      isDue: R <= cfg.targetRetention + 1e-9 || dueOn <= today,
      overdue: elapsed >= Math.max(1, wait) * cfg.overdueFactor,
      s: st.s, d: st.d
    };
  }

  function difficultyFactor(d) { return clamp(1.3 - 0.06 * d, 0.6, 1.25); }

  /* One measured answer applied to a record. -> { record, applied }.
     event:
       result   "s" | "w" | "f"
       date     YYYY-MM-DD, the local date it was given
       kind     "learn" (a comprehensive quiz) | "review"
       source   the quiz's id: the same source is never applied twice
       marks    { w, f } the word's misses while it was being learnt
       relearn  the quiz let it go after repeated misses */
  function apply(record, event, config) {
    const cfg = settings(config);
    const before = record || {};
    const seenEvents = Array.isArray(before.ev) ? before.ev : [];
    if (event.source && seenEvents.includes(event.source)) return { record: before, applied: false };
    const st = state(before, cfg);
    const result = event.result;
    const out = Object.assign({}, before);
    const date = event.date;
    const elapsed = st.learnt ? Math.max(0, daysBetween(st.last, date) || 0) : 0;
    const R = st.learnt ? Math.pow(0.9, elapsed / st.s) : 0;
    let s = st.s;
    let d = st.d;

    if (result) {
      if (!st.learnt) {
        const marks = event.marks || {};
        s = cfg.initialStability[result] || cfg.initialStability.s;
        if ((Number(marks.f) || 0) >= cfg.troubledAfterMisses) s *= cfg.troubledStartFactor;
        d = cfg.difficulty.start
          + Math.min(cfg.difficulty.maxLearnPenalty, ((Number(marks.f) || 0) + 0.5 * (Number(marks.w) || 0)) * cfg.difficulty.perLearnMiss)
          + (result === "f" ? cfg.difficulty.fail : result === "w" ? cfg.difficulty.weak : 0);
        out.first = date;
      } else if (result === "f") {
        s = st.s * cfg.lapseFactor;
        d = st.d + cfg.difficulty.fail;
      } else {
        const sameDay = elapsed < 1 && cfg.avoidSameSessionMasteryInflation;
        const gain = result === "s" ? cfg.strongGain : cfg.weakGain;
        if (!sameDay) s = st.s * (1 + gain * difficultyFactor(st.d) * (1 + cfg.lateBonus * (1 - R)));
        d = st.d + (result === "s" ? cfg.difficulty.strong : cfg.difficulty.weak);
      }
      out.s = Math.round(clamp(s, cfg.minStability, cfg.maxStability) * 1000) / 1000;
      out.d = Math.round(clamp(d, cfg.difficulty.min, cfg.difficulty.max) * 100) / 100;
      out.gap = st.learnt ? daysBetween(st.last, date) : null;
      out.last = date;
      if (!out.first) out.first = st.first || date;
      out.seen = st.seen + 1;
      out.right = st.right + (result === "f" ? 0 : 1);
      out.weak = st.weak + (result === "w" ? 1 : 0);
      out.result = result;
      out.recent = (st.recent + result).slice(-cfg.recentLength);
      if (result === "f") out.relearn = true;
      else if (result === "s") out.relearn = false;
    }
    /* A lapse: forgotten after it was learnt, or let go by a quiz. */
    if ((result === "f" && st.learnt) || event.relearn) {
      out.lapses = st.lapses + 1;
      out.relearn = true;
    }
    if (event.source) out.ev = seenEvents.concat(event.source).slice(-cfg.eventMemory);
    /* n orders two copies of one record when the sync meets them: the one
       with more retrievals is ahead. */
    out.n = Number(out.seen) || 0;
    return { record: out, applied: true };
  }

  return { DEFAULTS, settings, state, status, retention, interval, apply, dayNumber, daysBetween };
}));
