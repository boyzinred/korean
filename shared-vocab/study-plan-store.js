/*
  study-plan-store.js
  ----------------------------------------------------------------------------
  Where the daily tasks keep their progress, and where they get their words.

  PROGRESS REPOSITORY — StudyPlanStore.open(planId, storage)
    One localStorage key per plan, korean.studyPlan:<plan id>:v1, holding
    one record per item. cloud-sync.js carries every key with that prefix to
    the Supabase `progress` table exactly as it carries the stars (one row per
    item, see supabase/schema.sql), so progress follows you to any device you
    sign in on and survives a cleared browser. Items:

      t:<task id>  a task: { status: "started" | "done", startedOn,
                   completedOn, n (answers given), p (0–1 progress), run (the
                   quiz checkpoint, study-plan.js), stars (the proposed star
                   changes and whether they were confirmed), outcome }
      state        { day: the study day reached, on: the date it opened,
                   startedOn }. A record of where you are, for history; the
                   day itself is always worked out again from the tasks.
      w:<word id>  the word's long-term record, on calendar dates: { last
                   (date of its last measured retrieval), gap (calendar days
                   since the one before), seen, right, weak, result, relearn,
                   lapses }. relearn is set when a quiz lets the word go after
                   repeated misses, and cleared when a later quiz gets it right
                   first time.

    Every record carries rev, by (the tab that wrote it) and at. A save says
    which rev and tab it last saw; if the stored record has moved on since —
    another tab, or the sync bringing down another device's answers — the
    save is refused and the page is told, instead of writing over it.

    Two copies of one record are settled by better(): a finished task beats
    an unfinished one, then more answers beat fewer, then the later write.
    cloud-sync.js applies the same rule, so a finished quiz can never be
    un-finished by a device that was behind.

  COLLECTION ADAPTER — StudyPlanStore.collection(plan, options)
    The plan's words and units, read from the word bank's own page through
    review-banks.js, the way progress-review.html and the dashboard read
    them. Units are the groups of the plan's grouping, in their own order.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.StudyPlanStore = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const PREFIX = "korean.studyPlan:";
  const keyOf = planId => PREFIX + planId + ":v1";
  const unitsKeyOf = planId => "korean.studyPlanUnits:" + planId;

  function token() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function better(a, b) {
    if (!a) return b;
    if (!b) return a;
    const rank = r => (r.status === "done" ? 2 : 1);
    if (rank(a) !== rank(b)) return rank(a) > rank(b) ? a : b;
    if ((Number(a.n) || 0) !== (Number(b.n) || 0)) return (Number(a.n) || 0) > (Number(b.n) || 0) ? a : b;
    return String(a.at || "") >= String(b.at || "") ? a : b;
  }

  function open(planId, storage) {
    const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    const key = keyOf(planId);
    const me = token();

    function readAll() {
      try { return JSON.parse(store.getItem(key) || "{}") || {}; }
      catch (_) { return {}; }
    }
    function writeAll(data) {
      try { store.setItem(key, JSON.stringify(data)); return true; }
      catch (_) { return false; }
    }

    function tasks() {
      const all = readAll();
      const out = {};
      Object.keys(all).forEach(item => {
        if (item.startsWith("t:") && all[item]) out[item.slice(2)] = all[item];
      });
      return out;
    }
    function task(id) { return readAll()["t:" + id] || null; }

    /* What a page holds when it opens a task, to hand back with its saves. */
    function versionOf(record) { return record ? { rev: record.rev || 0, by: record.by || "" } : { rev: 0, by: "" }; }

    /* Write a record if nothing else has since `seen`. -> { ok, seen } or
       { conflict, held }. */
    function put(item, record, seen) {
      const all = readAll();
      const held = all[item] || null;
      const expected = seen || { rev: 0, by: "" };
      if ((held ? held.rev || 0 : 0) !== expected.rev || (held ? held.by || "" : "") !== expected.by) {
        return { conflict: true, held };
      }
      const next = Object.assign({}, record, { rev: expected.rev + 1, by: me, at: new Date().toISOString() });
      all[item] = next;
      if (!writeAll(all)) return { conflict: false, ok: false, error: "storage" };
      return { ok: true, seen: versionOf(next), record: next };
    }

    /* Write whichever is ahead, the stored record or this one — for records
       many writers may touch (state, words) where the rule decides. */
    function settle(item, record) {
      const all = readAll();
      const candidate = Object.assign({}, record, { by: me, at: new Date().toISOString(), rev: ((all[item] && all[item].rev) || 0) + 1 });
      const keep = better(all[item] || null, candidate);
      if (keep === candidate) { all[item] = candidate; writeAll(all); }
      return all[item];
    }

    return {
      key,
      tasks,
      task,
      versionOf,
      saveTask: (id, record, seen) => put("t:" + id, record, seen),
      state: () => readAll().state || null,
      setState: record => settle("state", Object.assign({ n: Number(record.day) || 0 }, record)),
      word: id => readAll()["w:" + id] || null,
      words() {
        const all = readAll();
        const out = {};
        Object.keys(all).forEach(item => { if (item.startsWith("w:") && all[item]) out[item.slice(2)] = all[item]; });
        return out;
      },
      setWord: (id, record) => settle("w:" + id, Object.assign({ n: 0 }, record)),
      /* Many words in one write: { id: record }. */
      setWords(records) {
        const all = readAll();
        const at = new Date().toISOString();
        Object.keys(records).forEach(id => {
          const item = "w:" + id;
          all[item] = Object.assign({}, records[id], { n: 0, by: me, at, rev: ((all[item] && all[item].rev) || 0) + 1 });
        });
        writeAll(all);
      }
    };
  }

  /* ---- the collection ------------------------------------------------------ */

  /* -> { bank, words, byId, units: [{ id, label, number, ids }] }. options:
       ReviewBanks   the review-banks.js API
       fetch         (url) -> Promise<Response>
       window        what the bank's code sees as window (its data scripts)
       loadScript    (src) -> Promise, for a bank's data scripts */
  async function collection(plan, options) {
    const RB = options.ReviewBanks;
    const config = RB.BANKS.find(bank => bank.id === plan.collection.bank);
    if (!config) throw new Error("not-available");
    for (const src of config.scripts || []) await options.loadScript(src);
    const response = await options.fetch("./" + config.href, { cache: "no-cache" });
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    const built = RB.build(config, await response.text(), { window: options.window });
    const mode = built.modes.find(entry => entry.id === plan.collection.grouping);
    if (!mode) throw new Error(config.href + " has no grouping " + plan.collection.grouping);
    const units = mode.groups.map((group, index) => ({ id: group.id, label: group.label, number: index + 1, ids: group.ids }));
    return { bank: config, words: built.words, byId: new Map(built.words.map(word => [word.id, word])), units };
  }

  /* The unit list, kept on this browser so the home page can draw today's
     tasks before the bank's page has been fetched again. */
  function cachedUnits(planId, storage) {
    try { return JSON.parse((storage || localStorage).getItem(unitsKeyOf(planId)) || "null"); }
    catch (_) { return null; }
  }
  function cacheUnits(planId, units, storage) {
    try {
      (storage || localStorage).setItem(unitsKeyOf(planId),
        JSON.stringify(units.map(unit => ({ id: unit.id, label: unit.label, number: unit.number, size: unit.ids.length }))));
    } catch (_) {}
  }

  return { PREFIX, keyOf, open, better, collection, cachedUnits, cacheUnits };
}));
