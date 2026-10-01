/*
  study-log.js
  ----------------------------------------------------------------------------
  Writes down every answer given in an exercise, one row per answer, to the
  study_events table in Supabase (supabase/schema.sql). The dashboard on
  index.html reads it back as streaks, time, accuracy and the words you miss.

  Load it after cloud-sync.js, which it sends through. Every answer is queued
  in this browser first and sent a few seconds later, when the tab is put away,
  or the next time a page opens signed in, so an answer given offline or
  signed out is not lost. Nothing here changes how a page works: if the table
  is missing or the network is down, the queue simply waits.

  API (window.KoreanStudy)
    start(run)                  a run has started; `run` is any object that
                                lives as long as the run (the page's own run
                                state), which is how answers are grouped
    answer(run, fields) -> id   one answer. fields:
        page       the page's id (the review bank's id where it has one)
        exercise   "vocab", "drill", "comprehension", "sentence", "test", …
        item       the page's id for the word or question, if it has one
        ko, en     the word or question, as shown on the dashboard
        correct    true / false
        attempt    1 for the first try at this question, 2+ for a retry
        given      what was typed or picked
        mode, dir, run   how it was asked: "typed" / "mc" / "handwriting",
                   "en>ko", and the run type ("regular", "repeat", "spaced")
        extra      anything else worth keeping, as a plain object
    amend(id, changes)          rewrite an answer already logged, e.g.
                                { correct: true, overridden: true } for
                                Count as correct
    flush()                     -> Promise; send what is queued now
    queued()                    how many answers are waiting to be sent
    lastError()                 "missing-table", "network", or ""
*/
(function () {
  "use strict";

  const QUEUE_KEY = "korean.studyLog.queue.v1";
  const STATE_KEY = "korean.studyLog.state.v1";
  const TABLE = "study_events";
  const MAX_QUEUE = 20000;
  const CHUNK = 500;
  /* Time between two answers counts as study up to this much; past it the
     tab was more likely left open than the question being thought about. */
  const MAX_GAP = 120000;
  const TEXT_CAP = 300;

  const runs = new WeakMap();
  /* Answers already sent this visit, so a Count as correct pressed after the
     send can still rewrite them. */
  const sent = new Map();

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      try { return window.crypto.randomUUID(); } catch (_) {}
    }
    const bytes = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-"
      + hex.slice(16, 20) + "-" + hex.slice(20);
  }

  function localDay(when) {
    const d = when || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-"
      + String(d.getDate()).padStart(2, "0");
  }

  const clip = value => (value === undefined || value === null) ? null : String(value).slice(0, TEXT_CAP);

  function runOf(run) {
    const key = run && typeof run === "object" ? run : window;
    let held = runs.get(key);
    if (!held) {
      held = { id: uuid(), last: Date.now() };
      runs.set(key, held);
    }
    return held;
  }

  function start(run) {
    if (!run || typeof run !== "object") return;
    runs.set(run, { id: uuid(), last: Date.now() });
  }

  function answer(run, fields) {
    const f = fields || {};
    if (!f.page || !f.exercise) return null;
    const held = runOf(run);
    const now = Date.now();
    const gap = Math.max(0, Math.min(MAX_GAP, now - held.last));
    held.last = now;

    const data = Object.assign({}, f.extra || {});
    if (f.mode) data.mode = String(f.mode);
    if (f.dir) data.dir = String(f.dir);
    if (f.run) data.run = String(f.run);
    if (f.given !== undefined && f.given !== null && f.given !== "") data.given = clip(f.given);

    const event = {
      id: uuid(),
      run_id: held.id,
      at: new Date(now).toISOString(),
      day: localDay(new Date(now)),
      page: String(f.page),
      exercise: String(f.exercise),
      item_id: f.item === undefined || f.item === null || f.item === "" ? null : String(f.item),
      ko: clip(f.ko),
      en: clip(f.en),
      correct: Boolean(f.correct),
      attempt: Math.max(1, Math.min(32767, Number(f.attempt) || 1)),
      ms: gap,
      data
    };
    const queue = load(QUEUE_KEY, []);
    queue.push(event);
    save(QUEUE_KEY, queue.length > MAX_QUEUE ? queue.slice(queue.length - MAX_QUEUE) : queue);
    schedule(4000);
    return event.id;
  }

  function amend(id, changes) {
    if (!id || !changes) return;
    const apply = event => {
      if (changes.correct !== undefined) event.correct = Boolean(changes.correct);
      const extra = Object.assign({}, changes);
      delete extra.correct;
      event.data = Object.assign({}, event.data, extra);
      return event;
    };
    const queue = load(QUEUE_KEY, []);
    const waiting = queue.find(event => event.id === id);
    if (waiting) apply(waiting);
    else if (sent.has(id)) queue.push(apply(JSON.parse(JSON.stringify(sent.get(id)))));
    else return;
    save(QUEUE_KEY, queue);
    schedule(4000);
  }

  /* ---- sending ------------------------------------------------------------ */
  let timer = null;
  let flushing = null;

  function schedule(delay) {
    clearTimeout(timer);
    timer = setTimeout(() => { flush(); }, delay);
  }

  function setError(code) {
    save(STATE_KEY, { error: code || "", at: new Date().toISOString() });
  }

  function lastError() {
    return (load(STATE_KEY, {}) || {}).error || "";
  }

  async function flush() {
    if (flushing) return flushing;
    flushing = (async () => {
      const cloud = window.KoreanCloud;
      if (!cloud || !cloud.configured || !cloud.hasSavedSession()) return;
      let queue = load(QUEUE_KEY, []);
      if (!queue.length) return;
      try {
        const current = await cloud.session();
        if (!current) return;
        const supa = await cloud.client();
        while (queue.length) {
          const chunk = queue.slice(0, CHUNK);
          const { error } = await supa.from(TABLE).upsert(
            chunk.map(event => Object.assign({ user_id: current.user.id }, event)),
            { onConflict: "id" });
          if (error) throw error;
          chunk.forEach(event => sent.set(event.id, event));
          while (sent.size > 400) sent.delete(sent.keys().next().value);
          /* Read the queue fresh: answers may have landed while this chunk was
             on its way, and an amend may have rewritten one already sent. */
          const sentIds = new Map(chunk.map(event => [event.id, JSON.stringify(event)]));
          queue = load(QUEUE_KEY, []).filter(event =>
            !sentIds.has(event.id) || sentIds.get(event.id) !== JSON.stringify(event));
          save(QUEUE_KEY, queue);
        }
        setError("");
      } catch (error) {
        const text = String((error && (error.code || "")) + " " + (error && error.message || ""));
        const missing = /42P01|PGRST205|does not exist|Could not find the table/i.test(text);
        setError(missing ? "missing-table" : "network");
        console.warn("[study-log]", error);
      }
    })();
    try { await flushing; }
    finally { flushing = null; }
  }

  window.KoreanStudy = {
    start, answer, amend, flush,
    queued: () => load(QUEUE_KEY, []).length,
    lastError
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => schedule(3000));
  } else {
    schedule(3000);
  }
})();
