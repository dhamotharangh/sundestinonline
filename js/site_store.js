/* SunDestin Online — storage module (DEMO: browser localStorage).
   Every page reads and writes through SDO_STORE, never localStorage directly, so the
   production backend (PHP + MySQL on Hostinger) replaces this one file with fetch() calls.
   Keys: text_<property_id>, rates_csv, availability_csv, users, session.
   Demo passwords are hashed (SHA-256 + salt) but this is NOT a secure system: anything in
   localStorage can be read by whoever uses this browser. */
(function () {
  "use strict";
  var NS = "sdo_";
  function read(k, d) { try { var v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function write(k, v) { try { if (v == null) localStorage.removeItem(NS + k); else localStorage.setItem(NS + k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  async function hash(text) {
    var enc = new TextEncoder().encode(text);
    var buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }
  function salt() { var a = new Uint8Array(8); crypto.getRandomValues(a); return Array.from(a).map(function (b) { return b.toString(16).padStart(2, "0"); }).join(""); }

  var STORE = {
    mode: "demo",
    /* property text overrides: { headline, subhead, description: [] } */
    getText: function (pid) { return read("text_" + pid, null); },
    setText: function (pid, t) { return write("text_" + pid, t); },
    clearText: function (pid) { return write("text_" + pid, null); },
    /* CSV text */
    getRatesCsv: function () { return read("rates_csv", null); },
    setRatesCsv: function (t) { return write("rates_csv", t); },
    getAvailabilityCsv: function () { return read("availability_csv", null); },
    setAvailabilityCsv: function (t) { return write("availability_csv", t); },
    clearCsv: function () { write("rates_csv", null); write("availability_csv", null); },
    hasOverrides: function (pid) { return !!(read("text_" + pid, null) || read("rates_csv", null) || read("availability_csv", null)); },

    /* users (demo) */
    users: function () { return read("users", []); },
    findUser: function (email) { email = String(email || "").trim().toLowerCase(); return this.users().filter(function (u) { return u.email === email; })[0] || null; },
    register: async function (name, email, password) {
      email = String(email || "").trim().toLowerCase();
      if (!name || !email || !password) return { ok: false, error: "Fill in name, email and password." };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "That email does not look right." };
      if (password.length < 8) return { ok: false, error: "Use at least 8 characters for the password." };
      if (this.findUser(email)) return { ok: false, error: "That email is already registered. Sign in instead." };
      var s = salt(), h = await hash(s + password);
      var u = { name: String(name).trim(), email: email, salt: s, hash: h, created: new Date().toISOString() };
      var all = this.users(); all.push(u); write("users", all);
      write("session", { email: email, since: new Date().toISOString() });
      return { ok: true, user: { name: u.name, email: u.email } };
    },
    signIn: async function (email, password) {
      var u = this.findUser(email);
      if (!u) return { ok: false, error: "No account with that email." };
      var h = await hash(u.salt + password);
      if (h !== u.hash) return { ok: false, error: "Wrong password." };
      write("session", { email: u.email, since: new Date().toISOString() });
      return { ok: true, user: { name: u.name, email: u.email } };
    },
    signOut: function () { write("session", null); },
    current: function () { var s = read("session", null); if (!s) return null; var u = this.findUser(s.email); return u ? { name: u.name, email: u.email, created: u.created } : null; },
    deleteAccount: function () {
      var s = read("session", null); if (!s) return false;
      write("users", this.users().filter(function (u) { return u.email !== s.email; }));
      write("session", null); return true;
    },

    /* owner gate (demo): passcode from data/site_text.js admin.demo_passcode */
    isAdmin: function () { return read("admin", false) === true; },
    adminSignIn: function (code) { var want = ((window.SDO_SITE || {}).admin || {}).demo_passcode || ""; if (code && code === want) { write("admin", true); return true; } return false; },
    adminSignOut: function () { write("admin", null); }
  };
  window.SDO_STORE = STORE;
})();
