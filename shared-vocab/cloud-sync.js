/*
  cloud-sync.js
  ----------------------------------------------------------------------------
  Keeps the familiarity stars of every page in step across devices, through
  the Supabase project named in cloud-config.js.

  Every page goes on reading and writing its stars in localStorage exactly as
  it always has; this file never changes how a page works. It watches for
  writes to any key with "Familiarity" in its name, and in the background
  pushes the words that changed and pulls the ones another device changed.
  Signed out, offline, or with no project configured, it does nothing and the
  page runs on this browser alone.

  One row per word: (store_key, item_id) → the page's own star record, or
  null once the star is cleared. See supabase/schema.sql.

  How a sync settles a word
    The shadow is what this browser last agreed with the cloud. A word whose
    local value still equals its shadow has not been touched here, so the
    cloud's value is taken. A word touched here since is kept and pushed —
    except the first time two devices meet, when neither has a shadow for it:
    then the higher star wins, and on a tie the later clean day.

  API (window.KoreanCloud)
    configured            true once cloud-config.js holds a project
    signIn(passcode)      -> Promise; signs in as the configured account
    signOut()             -> Promise; the stars stay on this browser
    syncNow()             -> Promise
    session()             -> Promise<session | null>

  Events
    "korean-cloud-sync" on window, cancelable, detail { keys }, after a pull
    changed stars on this browser. A page that repaints itself calls
    preventDefault(); otherwise a small notice offers to reload.
*/
(function () {
  "use strict";

  const config = window.KoreanCloudConfig || {};
  const configured = Boolean(config.url && config.anonKey && config.email);

  const LIBRARY = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
  const TABLE = "progress";
  const SHADOW_KEY = "korean.cloudSync.shadow.v1";
  const CURSOR_KEY = "korean.cloudSync.cursor.v1";
  const LAST_SYNC_KEY = "korean.cloudSync.last.v1";
  const PAGE_SIZE = 1000;
  const PUSH_CHUNK = 500;

  const isSynced = key => typeof key === "string" && /familiarity/i.test(key);

  /* ---- watching the page's writes --------------------------------------
     Patched on the prototype because localStorage itself cannot take an own
     property without storing it as an item. Only the synced keys are looked
     at; everything else passes straight through. The keys a page reads are
     noted too, so a pull can tell whether this page is showing stale stars. */
  const read = new Set();
  const nativeSet = Storage.prototype.setItem;
  const nativeGet = Storage.prototype.getItem;
  const nativeRemove = Storage.prototype.removeItem;

  Storage.prototype.setItem = function (key, value) {
    nativeSet.call(this, key, value);
    if (this === window.localStorage && isSynced(key)) schedulePush();
  };
  Storage.prototype.removeItem = function (key) {
    nativeRemove.call(this, key);
    if (this === window.localStorage && isSynced(key)) schedulePush();
  };
  Storage.prototype.getItem = function (key) {
    if (this === window.localStorage && isSynced(key)) read.add(key);
    return nativeGet.call(this, key);
  };

  function load(key, fallback) {
    try {
      const raw = nativeGet.call(localStorage, key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }
  function save(key, value) {
    try { nativeSet.call(localStorage, key, typeof value === "string" ? value : JSON.stringify(value)); }
    catch (_) {}
  }

  function syncedKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (isSynced(key)) keys.push(key);
    }
    return keys;
  }

  /* ---- the client --------------------------------------------------------
     The library is only fetched when there is something to do with it: a
     saved session, or a sign-in. supabase-js keeps its session under
     sb-<project ref>-auth-token, which is how a page knows without loading it. */
  let clientPromise = null;

  function hasSavedSession() {
    try {
      const ref = new URL(config.url).hostname.split(".")[0];
      return Boolean(nativeGet.call(localStorage, "sb-" + ref + "-auth-token"));
    } catch (_) { return false; }
  }

  function client() {
    if (!configured) return Promise.reject(new Error("Cloud sync is not set up yet: fill in shared-vocab/cloud-config.js."));
    if (!clientPromise) {
      clientPromise = new Promise((resolve, reject) => {
        if (window.supabase && window.supabase.createClient) { resolve(); return; }
        const script = document.createElement("script");
        script.src = LIBRARY;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Could not load the Supabase library."));
        document.head.appendChild(script);
      }).then(() => window.supabase.createClient(config.url, config.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true }
      }));
      clientPromise.catch(() => { clientPromise = null; });
    }
    return clientPromise;
  }

  async function session() {
    if (!configured) return null;
    const supa = await client();
    const { data } = await supa.auth.getSession();
    return data.session || null;
  }

  /* ---- status ------------------------------------------------------------
     Any element marked data-cloud-status shows where things stand. */
  let status = { state: "idle", text: "" };

  function paintStatus(state, text) {
    status = { state, text };
    document.querySelectorAll("[data-cloud-status]").forEach(node => {
      node.textContent = text;
      node.dataset.cloudState = state;
    });
    window.dispatchEvent(new CustomEvent("korean-cloud-status", { detail: status }));
  }

  function clock(iso) {
    const when = new Date(iso);
    return isNaN(when) ? "" : when.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function paintSignedIn() {
    const last = load(LAST_SYNC_KEY, "");
    paintStatus("synced", last ? "Synced " + clock(last) : "Signed in");
  }

  /* ---- merging -------------------------------------------------------------- */
  const level = record => (record && typeof record === "object" ? Number(record.l) || 0 : Number(record) || 0);
  const cleanDay = record => (record && typeof record === "object" && record.d) || "";

  function better(localStr, remoteStr) {
    if (localStr === undefined) return remoteStr;
    if (remoteStr === undefined) return localStr;
    const local = JSON.parse(localStr);
    const remote = JSON.parse(remoteStr);
    if (level(local) !== level(remote)) return level(local) > level(remote) ? localStr : remoteStr;
    return cleanDay(remote) > cleanDay(local) ? remoteStr : localStr;
  }

  async function pull(supa, shadow) {
    const cursor = load(CURSOR_KEY, "");
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      let query = supa.from(TABLE).select("store_key, item_id, record, updated_at")
        .order("updated_at").order("store_key").order("item_id")
        .range(from, from + PAGE_SIZE - 1);
      if (cursor) query = query.gte("updated_at", cursor);
      const { data, error } = await query;
      if (error) throw error;
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }

    const stores = new Map();
    const changed = new Set();
    let newest = cursor;
    rows.forEach(row => {
      if (row.updated_at > newest) newest = row.updated_at;
      if (!stores.has(row.store_key)) stores.set(row.store_key, load(row.store_key, {}) || {});
      const store = stores.get(row.store_key);
      const known = shadow[row.store_key] || (shadow[row.store_key] = {});

      const localStr = store[row.item_id] === undefined ? undefined : JSON.stringify(store[row.item_id]);
      const remoteStr = row.record === null ? undefined : JSON.stringify(row.record);
      const shadowStr = known[row.item_id];

      let keep;
      if (localStr === shadowStr) keep = remoteStr;
      else if (shadowStr === undefined) keep = better(localStr, remoteStr);
      else keep = localStr;

      if (keep !== localStr) {
        if (keep === undefined) delete store[row.item_id];
        else store[row.item_id] = JSON.parse(keep);
        changed.add(row.store_key);
      }
      if (remoteStr === undefined) delete known[row.item_id];
      else known[row.item_id] = remoteStr;
    });

    changed.forEach(key => save(key, stores.get(key)));
    if (newest) save(CURSOR_KEY, newest);
    return [...changed];
  }

  async function push(supa, shadow, userId) {
    const rows = [];
    const settle = [];
    syncedKeys().forEach(key => {
      const store = load(key, {}) || {};
      const known = shadow[key] || {};
      const ids = new Set(Object.keys(store).concat(Object.keys(known)));
      ids.forEach(id => {
        const localStr = store[id] === undefined ? undefined : JSON.stringify(store[id]);
        if (localStr === known[id]) return;
        rows.push({ user_id: userId, store_key: key, item_id: id, record: localStr === undefined ? null : store[id] });
        settle.push([key, id, localStr]);
      });
    });
    for (let i = 0; i < rows.length; i += PUSH_CHUNK) {
      const { error } = await supa.from(TABLE).upsert(rows.slice(i, i + PUSH_CHUNK),
        { onConflict: "user_id,store_key,item_id" });
      if (error) throw error;
      settle.slice(i, i + PUSH_CHUNK).forEach(([key, id, localStr]) => {
        const known = shadow[key] || (shadow[key] = {});
        if (localStr === undefined) delete known[id];
        else known[id] = localStr;
      });
    }
    return rows.length;
  }

  /* ---- running a sync ------------------------------------------------------
     One at a time. A write that lands mid-sync asks for another round rather
     than starting a second one beside it. */
  let running = null;
  let again = false;

  async function syncNow() {
    if (running) { again = true; return running; }
    running = (async () => {
      const current = await session();
      if (!current) { paintStatus("signed-out", "Sign in"); return; }
      const supa = await client();
      paintStatus("syncing", "Syncing…");
      const shadow = load(SHADOW_KEY, {}) || {};
      try {
        const changed = await pull(supa, shadow);
        save(SHADOW_KEY, shadow);
        await push(supa, shadow, current.user.id);
        save(SHADOW_KEY, shadow);
        save(LAST_SYNC_KEY, new Date().toISOString());
        paintSignedIn();
        if (changed.length) announce(changed);
      } catch (error) {
        save(SHADOW_KEY, shadow);
        console.warn("[cloud-sync]", error);
        paintStatus("error", "Sync failed — retrying later");
      }
    })();
    try { await running; }
    finally {
      running = null;
      if (again) { again = false; syncNow(); }
    }
  }

  let pushTimer = null;
  function schedulePush() {
    if (!configured) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { if (hasSavedSession()) syncNow(); }, 2000);
  }

  /* ---- telling the page --------------------------------------------------- */
  function announce(keys) {
    const event = new CustomEvent("korean-cloud-sync", { detail: { keys }, cancelable: true });
    const handled = !window.dispatchEvent(event);
    if (handled || !keys.some(key => read.has(key))) return;
    if (document.getElementById("cloudSyncNotice")) return;
    const notice = document.createElement("div");
    notice.id = "cloudSyncNotice";
    notice.setAttribute("role", "status");
    notice.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:9999;max-width:calc(100% - 32px);"
      + "display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:8px;"
      + "background:var(--surface,#fff);color:var(--surface-text,#222);border:1px solid var(--border,#ccc);"
      + "box-shadow:0 6px 24px rgba(0,0,0,.18);font:600 .9rem/1.3 inherit;";
    notice.innerHTML = '<span>Stars changed on another device.</span>'
      + '<button type="button" class="btn primary small">Reload</button>'
      + '<button type="button" class="btn secondary small" aria-label="Dismiss">✕</button>';
    const [reload, dismiss] = notice.querySelectorAll("button");
    reload.addEventListener("click", () => location.reload());
    dismiss.addEventListener("click", () => notice.remove());
    document.body.appendChild(notice);
  }

  /* ---- signing in and out ------------------------------------------------ */
  async function signIn(passcode) {
    const supa = await client();
    const { error } = await supa.auth.signInWithPassword({ email: config.email, password: String(passcode || "") });
    if (error) throw error;
    await syncNow();
  }

  async function signOut() {
    if (!configured) return;
    const supa = await client();
    await supa.auth.signOut();
    paintStatus("signed-out", "Sign in");
  }

  window.KoreanCloud = { configured, signIn, signOut, syncNow, session, status: () => status };

  /* ---- when to sync ---------------------------------------------------------
     On load, when the tab is put away (so a run's stars leave before the
     phone sleeps), and when it comes back after a while (to collect what
     another device did meanwhile). */
  function start() {
    if (!configured) { paintStatus("off", "Sign in"); return; }
    if (!hasSavedSession()) { paintStatus("signed-out", "Sign in"); return; }
    paintSignedIn();
    syncNow();
  }

  let hiddenAt = 0;
  document.addEventListener("visibilitychange", () => {
    if (!configured || !hasSavedSession()) return;
    if (document.visibilityState === "hidden") {
      hiddenAt = Date.now();
      clearTimeout(pushTimer);
      syncNow();
    } else if (Date.now() - hiddenAt > 30000) {
      syncNow();
    }
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
