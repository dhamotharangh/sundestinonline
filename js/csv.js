/* SunDestin Online — CSV parsing and validation shared by the site and the upload page.
   Rates CSV columns:        property_id,start,end,season,label,nightly,min_nights   (start and end inclusive)
   Availability CSV columns: property_id,checkin,checkout,status,note               (checkout exclusive, like a booking) */
(function () {
  "use strict";
  var ISO = /^\d{4}-\d{2}-\d{2}$/;

  function parse(text) {
    var rows = [], row = [], cell = "", q = false, i, c;
    text = String(text).replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    rows = rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ""; }); });
    if (!rows.length) return { header: [], records: [] };
    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    var records = rows.slice(1).map(function (r, n) {
      var o = { _line: n + 2 };
      header.forEach(function (h, j) { o[h] = (r[j] || "").trim(); });
      return o;
    });
    return { header: header, records: records };
  }

  function validateRates(parsed) {
    var errors = [], need = ["property_id", "start", "end", "season", "label", "nightly", "min_nights"];
    need.forEach(function (h) { if (parsed.header.indexOf(h) < 0) errors.push("Missing column: " + h); });
    if (errors.length) return { errors: errors, rows: [] };
    var rows = [];
    parsed.records.forEach(function (r) {
      var e = [];
      if (!r.property_id) e.push("property_id is empty");
      if (!ISO.test(r.start)) e.push("start must be YYYY-MM-DD");
      if (!ISO.test(r.end)) e.push("end must be YYYY-MM-DD");
      if (ISO.test(r.start) && ISO.test(r.end) && r.end < r.start) e.push("end is before start");
      if (!(+r.nightly > 0)) e.push("nightly must be a number above 0");
      if (!(+r.min_nights >= 1)) e.push("min_nights must be 1 or more");
      if (!r.season) e.push("season is empty");
      if (e.length) errors.push("Line " + r._line + ": " + e.join("; "));
      else rows.push({ property_id: r.property_id, start: r.start, end: r.end, season: r.season.toLowerCase(), label: r.label || r.season, nightly: +r.nightly, min: +r.min_nights });
    });
    rows.sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    for (var i = 1; i < rows.length; i++) {
      if (rows[i].property_id === rows[i - 1].property_id && rows[i].start <= rows[i - 1].end)
        errors.push("Overlap: " + rows[i - 1].label + " (" + rows[i - 1].start + " to " + rows[i - 1].end + ") and " + rows[i].label + " (" + rows[i].start + " to " + rows[i].end + ")");
    }
    return { errors: errors, rows: rows };
  }

  function validateAvailability(parsed) {
    var errors = [], need = ["property_id", "checkin", "checkout", "status"];
    need.forEach(function (h) { if (parsed.header.indexOf(h) < 0) errors.push("Missing column: " + h); });
    if (errors.length) return { errors: errors, rows: [] };
    var rows = [];
    parsed.records.forEach(function (r) {
      var e = [];
      if (!r.property_id) e.push("property_id is empty");
      if (!ISO.test(r.checkin)) e.push("checkin must be YYYY-MM-DD");
      if (!ISO.test(r.checkout)) e.push("checkout must be YYYY-MM-DD");
      if (ISO.test(r.checkin) && ISO.test(r.checkout) && r.checkout <= r.checkin) e.push("checkout must be after checkin");
      var st = (r.status || "booked").toLowerCase();
      if (["booked", "blocked", "hold"].indexOf(st) < 0) e.push("status must be booked, blocked or hold");
      if (e.length) errors.push("Line " + r._line + ": " + e.join("; "));
      else rows.push({ property_id: r.property_id, checkin: r.checkin, checkout: r.checkout, status: st, note: r.note || "" });
    });
    rows.sort(function (a, b) { return a.checkin < b.checkin ? -1 : 1; });
    return { errors: errors, rows: rows };
  }

  function toCsv(header, rows) {
    var esc = function (v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return header.join(",") + "\n" + rows.map(function (r) { return header.map(function (h) { return esc(r[h]); }).join(","); }).join("\n") + "\n";
  }

  /* date helpers */
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function nightsBetween(a, b) { var s = new Set(); for (var d = new Date(a + "T12:00"); iso(d) < b; d = addDays(d, 1)) s.add(iso(d)); return s; }

  window.SDO_CSV = { parse: parse, validateRates: validateRates, validateAvailability: validateAvailability, toCsv: toCsv, iso: iso, addDays: addDays, nightsBetween: nightsBetween };
})();
