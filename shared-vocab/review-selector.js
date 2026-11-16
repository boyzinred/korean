/*
  review-selector.js
  ----------------------------------------------------------------------------
  Picks the words for one day's Adaptive Review Quiz: about 55 distinct
  words out of everything learnt on earlier study days, the ones most likely
  to be slipping first, with a few well-known ones checked now and then.

  Input is plain data — the candidates, today's date, the earlier reviews —
  so the home page can preview a selection and the quiz page can freeze the
  very same one (the randomness is seeded by the task id).

    ReviewSelector.select({
      candidates: [{ id, unit, record, stars }],  record: the word's memory
                                                  record (study-memory.js);
                                                  stars: 0–3
      today:      "YYYY-MM-DD",
      history:    [{ day, on, ids, results }]     earlier reviews, newest
                                                  first; results { id: s|w|f }
      config:     the adaptiveReview settings (DEFAULTS below),
      memory:     the srs settings (study-memory.js),
      seed:       a string
    }) -> {
      ids        the selection in presentation order (shuffled), no repeats
      picks      { id: { tier, reason, score } }
      counts     { weak, developing, mastered } in the selection
      quotas     the quotas used after adapting and redistributing
      stats      the pool and its backlog (see poolStats)
    }

  How a word is placed:
    tier       weak (relearning, failed last time, ★ or less, never measured,
               or retention under tiers.weakBelowRetention); mastered (★★★
               and stability of at least tiers.masteredMinStability days);
               otherwise developing. Stars alone never decide it: a ★★★
               word that has gone overdue is weak again.
    score      SRS urgency (1 − R, more when due, much more when R is very
               low) + low familiarity + recent failures + real days since
               its last recall + days since a review last picked it
               (coverage) − a penalty for being picked review after review
               + a little seeded randomness, too small to outrank a word that
               is genuinely urgent. Every weight is in config.weights. The
               coverage factor has no ceiling, which is what stops a word
               from starving when there is more due than a review can hold.

  Then the quotas (30 weak / 15 developing / 10 mastered by default) are
  filled from each tier in score order; slots a tier cannot fill go to the
  best remaining words of any tier. A word picked for the last
  maxConsecutiveSelections reviews in a row sits this one out unless there is
  nothing else to ask, so a handful of hard words cannot take over every
  review. After a review that went very well the quotas lean toward older
  and better-known words; after one that went badly, toward the weak.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./study-memory.js"));
  else root.ReviewSelector = factory(root.StudyMemory);
}(typeof self !== "undefined" ? self : this, function (StudyMemory) {
  "use strict";

  const DEFAULTS = {
    targetUniqueWords: 55,
    minimumUniqueWords: 50,
    maximumUniqueWords: 60,
    weakOverdueTarget: 30,
    developingTarget: 15,
    masteredTarget: 10,
    prioritizeSRSUrgency: true,
    prioritizeRecentFailures: true,
    useFamiliarityScores: true,
    includeControlledRandomness: true,
    includeCoverageFairness: true,
    initialAttemptsPerWord: 1,
    enableExtendedRepetition: false,
    /* Optional second tries for missed words, at the end of the quiz. Off by
       default; when on, the selection shrinks so that unique words plus
       retries stay within maxPresentations. */
    sameSessionRetries: 0,
    maxPresentations: 60,
    maxConsecutiveSelections: 3,
    tiers: { weakMaxStars: 1, weakBelowRetention: 0.7, masteredMinStars: 3, masteredMinStability: 7 },
    weights: {
      urgency: 1.0, due: 0.3, urgent: 1.0, urgentBelowRetention: 0.5,
      familiarity: 0.6, failures: 0.8, elapsed: 0.4, coverage: 1.0,
      repeat: 0.5, random: 0.15
    },
    /* Days over which the elapsed factor grows from 0 to 1, and the coverage
     factor by 1 (it keeps growing after that). */
    elapsedHorizonDays: 30,
    coverageHorizonDays: 7,
    adaptive: { enabled: true, highAccuracy: 0.85, lowAccuracy: 0.6, shiftSlots: 5, staleBoost: 1.5 },
    backlog: { window: 3, dueRatio: 2 }
  };

  const TIERS = ["weak", "developing", "mastered"];
  const TIER_LABELS = { weak: "Weak / overdue", developing: "Developing", mastered: "Mastered" };

  function isObject(value) { return value && typeof value === "object" && !Array.isArray(value); }
  function merge(base, extra) {
    const out = Object.assign({}, base);
    Object.keys(extra || {}).forEach(key => {
      out[key] = isObject(base && base[key]) && isObject(extra[key]) ? merge(base[key], extra[key]) : extra[key];
    });
    return out;
  }
  const settings = config => merge(DEFAULTS, config || {});

  /* A small seeded random (mulberry32 over a string hash). */
  function seeded(text) {
    let h = 1779033703 ^ String(text || "").length;
    for (let i = 0; i < String(text || "").length; i += 1) {
      h = Math.imul(h ^ String(text).charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(list, random) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      const swap = out[i]; out[i] = out[j]; out[j] = swap;
    }
    return out;
  }
  const clamp01 = value => Math.max(0, Math.min(1, value));

  /* How many reviews in a row (from the latest back) picked this word, and
     the date the last one did. */
  function selectionHistory(history) {
    const streak = new Map();
    const lastPicked = new Map();
    (history || []).forEach((review, index) => {
      (review.ids || []).forEach(id => {
        if (!lastPicked.has(id)) lastPicked.set(id, review.on || "");
        if ((streak.get(id) || 0) === index) streak.set(id, index + 1);
      });
    });
    return { streak, lastPicked };
  }

  /* Everything the selection knows about one word. */
  function assess(candidate, today, cfg, memory, picked) {
    const record = candidate.record || {};
    const st = StudyMemory.state(record, memory);
    const now = StudyMemory.status(record, today, memory);
    const stars = Math.max(0, Math.min(3, Number(candidate.stars) || 0));
    const t = cfg.tiers;
    const failedLast = st.result === "f";
    const recentFails = (st.recent.match(/f/g) || []).length;
    let tier = "developing";
    let reason = "developing";
    if (!st.learnt) { tier = "weak"; reason = "not yet measured"; }
    else if (st.relearn) { tier = "weak"; reason = "relearning"; }
    else if (failedLast) { tier = "weak"; reason = "missed last time"; }
    else if (now.R < t.weakBelowRetention) { tier = "weak"; reason = "overdue"; }
    else if (stars <= t.weakMaxStars) { tier = "weak"; reason = "low familiarity"; }
    else if (stars >= t.masteredMinStars && now.s >= t.masteredMinStability) { tier = "mastered"; reason = now.isDue ? "due retention check" : "retention check"; }
    else if (now.isDue) reason = "due";
    const since = picked.lastPicked.get(candidate.id) || st.first || st.last;
    const waited = since ? Math.max(0, StudyMemory.daysBetween(since, today) || 0) : cfg.coverageHorizonDays;
    return {
      id: candidate.id, unit: candidate.unit || "", stars, tier, reason, st, now,
      recentFails, failedLast, waited,
      streak: picked.streak.get(candidate.id) || 0
    };
  }

  function score(word, cfg, random, boost) {
    const w = cfg.weights;
    const b = boost || 1;
    let total = 0;
    if (cfg.prioritizeSRSUrgency) {
      total += w.urgency * (1 - word.now.R);
      if (word.now.isDue) total += w.due;
      if (word.now.R < w.urgentBelowRetention) total += w.urgent;
    }
    if (cfg.useFamiliarityScores) total += w.familiarity * (3 - word.stars) / 3;
    if (cfg.prioritizeRecentFailures) {
      total += w.failures * clamp01((word.failedLast ? 0.5 : 0) + (word.st.relearn ? 0.3 : 0)
        + word.recentFails * 0.15 + word.st.lapses * 0.05);
    }
    const elapsed = Number.isFinite(word.now.elapsed) ? word.now.elapsed : cfg.elapsedHorizonDays;
    total += w.elapsed * b * clamp01(elapsed / cfg.elapsedHorizonDays);
    if (cfg.includeCoverageFairness) {
      /* Waiting keeps counting: a word passed over for twice the horizon
         scores twice as much, so nothing waits for ever behind a run of
         hard words. */
      total += w.coverage * b * word.waited / cfg.coverageHorizonDays;
      total -= w.repeat * Math.max(0, word.streak - 1);
    }
    if (cfg.includeControlledRandomness) total += w.random * random();
    return Math.round(total * 1000) / 1000;
  }

  /* The share of a review's words that came back right. */
  function accuracy(review) {
    const results = review && review.results ? Object.values(review.results) : [];
    if (!results.length) return null;
    return results.filter(r => r !== "f").length / results.length;
  }

  function poolStats(words, cfg, history) {
    const due = words.filter(w => w.now.isDue).length;
    const overdue = words.filter(w => w.now.overdue).length;
    const learnt = words.filter(w => w.now.learnt);
    const retention = learnt.length ? learnt.reduce((sum, w) => sum + w.now.R, 0) / learnt.length : null;
    const byTier = {};
    TIERS.forEach(tier => { byTier[tier] = words.filter(w => w.tier === tier).length; });
    /* How each tier has been doing in the reviews so far. */
    const performance = {};
    TIERS.forEach(tier => { performance[tier] = { asked: 0, right: 0 }; });
    (history || []).forEach(review => {
      const tiers = review.tiers || {};
      Object.keys(review.results || {}).forEach(id => {
        const tier = tiers[id];
        if (!performance[tier]) return;
        performance[tier].asked += 1;
        if (review.results[id] !== "f") performance[tier].right += 1;
      });
    });
    const capacity = cfg.targetUniqueWords;
    /* The backlog has stayed large for the last few reviews as well. */
    const window = Math.max(1, cfg.backlog.window);
    const recent = (history || []).slice(0, window - 1).map(review => review.stats && review.stats.due);
    const heavy = due > cfg.backlog.dueRatio * capacity
      && recent.length === window - 1 && recent.every(n => Number(n) > cfg.backlog.dueRatio * capacity);
    return {
      eligible: words.length, due, overdue, capacity,
      retention: retention === null ? null : Math.round(retention * 1000) / 1000,
      byTier, performance, recommendSlowerIntake: heavy
    };
  }

  function select(input) {
    const cfg = settings(input.config);
    const memory = input.memory;
    const random = seeded(input.seed || "");
    const history = input.history || [];
    const picked = selectionHistory(history);
    const seen = new Set();
    const words = [];
    (input.candidates || []).forEach(candidate => {
      if (!candidate || seen.has(candidate.id)) return;
      seen.add(candidate.id);
      words.push(assess(candidate, input.today, cfg, memory, picked));
    });

    /* Quotas, adapted to how the last review went. */
    const quotas = { weak: cfg.weakOverdueTarget, developing: cfg.developingTarget, mastered: cfg.masteredTarget };
    let boost = 1;
    let adapted = "";
    const last = accuracy(history[0]);
    if (cfg.adaptive.enabled && last !== null) {
      const shift = Math.max(0, cfg.adaptive.shiftSlots | 0);
      if (last >= cfg.adaptive.highAccuracy) {
        const moved = Math.min(shift, quotas.weak);
        quotas.weak -= moved;
        quotas.developing += Math.ceil(moved / 2);
        quotas.mastered += Math.floor(moved / 2);
        boost = cfg.adaptive.staleBoost;
        adapted = "easier";
      } else if (last <= cfg.adaptive.lowAccuracy) {
        const moved = Math.min(shift, quotas.mastered);
        quotas.mastered -= moved;
        quotas.weak += moved;
        adapted = "harder";
      }
    }

    words.forEach(word => { word.score = score(word, cfg, random, boost); });

    /* How many: the target, never over the maximum, never more than there
       are, and leaving room for retries if those are on. */
    let target = Math.min(cfg.targetUniqueWords, cfg.maximumUniqueWords);
    const retries = Math.max(0, cfg.sameSessionRetries | 0);
    if (retries > 0) {
      /* Plan for a fifth of the words being missed and retried. */
      const room = Math.floor(cfg.maxPresentations / (1 + 0.2 * retries));
      target = Math.min(target, room);
    }
    target = Math.min(target, words.length);
    const sum = TIERS.reduce((n, tier) => n + quotas[tier], 0) || 1;
    if (target !== sum) {
      let given = 0;
      TIERS.forEach(tier => { quotas[tier] = Math.floor(quotas[tier] * target / sum); given += quotas[tier]; });
      for (let i = 0; given < target; i = (i + 1) % TIERS.length) { quotas[TIERS[i]] += 1; given += 1; }
    }

    const resting = word => cfg.includeCoverageFairness && word.streak >= cfg.maxConsecutiveSelections;
    const byScore = (a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const chosen = new Set();
    const picks = {};
    const take = (word, why) => {
      chosen.add(word.id);
      picks[word.id] = { tier: word.tier, reason: why || word.reason, score: word.score, unit: word.unit };
    };
    TIERS.forEach(tier => {
      words.filter(w => w.tier === tier && !resting(w)).sort(byScore).slice(0, quotas[tier]).forEach(w => take(w));
    });
    /* Slots a tier could not fill: the best remaining words, then — only if
       there is nothing else — the ones sitting a review out. */
    const fill = pool => pool.filter(w => !chosen.has(w.id)).sort(byScore)
      .slice(0, Math.max(0, target - chosen.size)).forEach(w => take(w));
    fill(words.filter(w => !resting(w)));
    fill(words);

    const counts = {};
    TIERS.forEach(tier => { counts[tier] = 0; });
    Object.values(picks).forEach(p => { counts[p.tier] += 1; });
    const ids = shuffle([...chosen], random);
    return {
      ids, picks, counts, quotas, adapted, target,
      stats: poolStats(words, cfg, history)
    };
  }

  return { DEFAULTS, TIERS, TIER_LABELS, settings, select, seeded, accuracy, poolStats };
}));
