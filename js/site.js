/* SunDestin Online — one script for every page. Vanilla JS, no dependencies.
   Fills the HTML layout from two data files:
     data/site.js        → window.SDO_SITE        (site-wide text)
     data/properties.js  → window.SDO_PROPERTIES  (per-property content)
   Slots:  <el data-t="site.hero.title"> or data-t="p.headline"  → text
   Blocks: <el data-block="why">                                  → rendered lists */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var S = window.SDO_SITE || {};
  var props = window.SDO_PROPERTIES || [];
  var qs = new URLSearchParams(location.search);
  var P = props.filter(function (p) { return p.id === qs.get("p"); })[0] ||
          props.filter(function (p) { return p.featured; })[0] || props[0] || {};
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  function get(path) {
    var root = path.indexOf("p.") === 0 ? P : S;
    return path.replace(/^(site|p)\./, "").split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, root);
  }
  function fmt(str, vars) {
    return String(str == null ? "" : str).replace(/\{(\w+)\}/g, function (m, k) {
      if (vars && vars[k] != null) return vars[k];
      if (k === "name") return P.name || "";
      return m;
    });
  }

  /* ── 1. Text slots ── */
  $$("[data-t]").forEach(function (el) { var v = get(el.getAttribute("data-t")); if (v != null) el.textContent = fmt(v); });
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* ── 2. Icons (stroke SVG, currentColor) ── */
  var I = {
    balcony: '<path d="M3 11h18M5 11v8M19 11v8M9 11v8M14 11v8M3 19h18M7 11V6a5 5 0 0 1 10 0v5"/>',
    pool: '<path d="M3 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M3 20c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M8 13V5a2 2 0 0 1 4 0M14 13V5a2 2 0 0 1 4 0"/>',
    beach: '<path d="M3 20h18M4 17c3-2 6-2 9 0M12 3a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8zM12 11v6"/>',
    chair: '<path d="M4 12l8-8 8 8M12 4v16M6 20h12M4 12c0 4 3 7 8 7"/>',
    kitchen: '<path d="M4 4h16v16H4zM4 11h16M9 4v7M15 11v9"/>',
    bar: '<path d="M4 8h16l-2 11H6zM9 3h6M12 3v5"/>',
    tv: '<path d="M3 5h18v12H3zM8 21h8M12 17v4"/>',
    wifi: '<path d="M2 9a16 16 0 0 1 20 0M5.5 12.5a11 11 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01"/>',
    parking: '<path d="M5 20V4h7a4 4 0 0 1 0 8H5"/>',
    ac: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>',
    linens: '<path d="M3 11v8h18v-8M3 11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>',
    coffee: '<path d="M4 8h12v6a5 5 0 0 1-10 0zM16 9h2a2 2 0 0 1 0 4h-2M6 20h10"/>',
    dish: '<path d="M4 4h16v16H4zM4 9h16M8 13h.01M12 13h.01M16 13h.01"/>',
    hair: '<path d="M4 9a5 5 0 0 1 5-5h10l-2 10H9a5 5 0 0 1-5-5zM13 14l-3 6"/>',
    stairs: '<path d="M4 20h4v-4h4v-4h4V8h4"/>',
    gate: '<path d="M4 20V6M20 20V6M4 9h16M4 15h16M8 6v14M12 6v14M16 6v14"/>',
    key: '<path d="M14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM13 13l7 7M17 17l2-2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>',
    check: '<path d="M5 12l5 5 9-10"/>'
  };
  function icon(k) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[k] || I.check) + "</svg>";
  }

  /* ── 3. Blocks ── */
  var B = {};
  B.logo = function (el) { el.innerHTML = esc(S.brand.name) + " <span>" + esc(S.brand.accent) + "</span>"; };
  B.nav = function (el) {
    var pre = el.getAttribute("data-prefix") || "";
    el.innerHTML = (S.nav || []).map(function (n) {
      var href = n[1].charAt(0) === "#" ? pre + n[1] : n[1];
      return '<a href="' + esc(href) + '"' + (location.pathname.indexOf(n[1]) > -1 ? ' class="active"' : "") + ">" + esc(n[0]) + "</a>";
    }).join("") + '<label class="theme"><span>' + esc(S.themeLabel || "Theme") + '</span> <select class="theme-pick" aria-label="Colour theme"></select></label>';
  };
  B.chips = function (el) {
    var f = P.facts || {};
    el.innerHTML = [f.bedrooms + (f.bedrooms === 1 ? " bedroom" : " bedrooms"), f.bathrooms + (f.bathrooms === 1 ? " bath" : " baths"), "Sleeps " + f.sleeps, f.floor, f.view]
      .map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join("");
  };
  B["hero-img"] = function (el) { el.src = P.hero; el.alt = ((P.photos || [])[0] || {}).alt || P.name; };
  B.why = function (el) {
    el.innerHTML = (S.why || []).map(function (w) { return "<div>" + icon(w[0]) + "<h3>" + esc(w[1]) + "</h3><p>" + esc(w[2]) + "</p></div>"; }).join("");
  };
  B.description = function (el) { el.innerHTML = (P.description || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); };
  B.facts = function (el) {
    var L = S.condo.factLabels, f = P.facts;
    el.innerHTML = [["bedrooms", f.bedrooms], ["bathrooms", f.bathrooms], ["sleeps", f.sleeps], ["floor", f.floor], ["view", f.view], ["complex", P.complex]]
      .map(function (x) { return "<div><dt>" + esc(L[x[0]]) + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("") +
      '<div class="beds"><dt>' + esc(L.beds) + "</dt><dd><ul>" + (P.beds || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></dd></div>" +
      '<div class="beds"><dt>' + esc(L.address) + "</dt><dd>" + esc(P.address) + "</dd></div>";
  };
  B["rate-cols"] = function (el) { el.innerHTML = S.rates.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join(""); };
  B.guests = function (el) {
    var n = (P.facts || {}).sleeps || 6, h = "";
    for (var i = 1; i <= n; i++) h += "<option" + (i === Math.min(4, n) ? " selected" : "") + ">" + i + "</option>";
    el.innerHTML = h;
  };
  B["msg-placeholder"] = function (el) { el.placeholder = S.book.placeholder || ""; };
  B.faq = function (el) {
    el.innerHTML = (P.faq || []).map(function (q) { return "<details><summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>"; }).join("");
  };
  B["footer-cols"] = function (el) {
    var pre = el.getAttribute("data-prefix") || "";
    el.innerHTML = (S.footer.cols || []).map(function (c) {
      return "<div><h4>" + esc(c[0]) + "</h4>" + c[1].map(function (l) {
        var href = l[1].charAt(0) === "#" ? pre + l[1] : l[1];
        return '<a href="' + esc(href) + '">' + esc(l[0]) + "</a>";
      }).join("") + "</div>";
    }).join("");
  };
  $$("[data-block]").forEach(function (el) { var fn = B[el.getAttribute("data-block")]; if (fn) fn(el); });

  /* ── 4. Theme dropdown (persists per visitor) ── */
  var THEMES = S.themes || [["emerald", "Emerald water"]];
  function applyTheme(t) {
    if (t === THEMES[0][0]) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    $$("select.theme-pick").forEach(function (s) { s.value = t; });
    try { localStorage.setItem("sdo-theme", t); } catch (e) {}
  }
  (function initTheme() {
    var saved = THEMES[0][0];
    try { saved = localStorage.getItem("sdo-theme") || saved; } catch (e) {}
    if (!THEMES.some(function (t) { return t[0] === saved; })) saved = THEMES[0][0];
    $$("select.theme-pick").forEach(function (s) {
      s.innerHTML = THEMES.map(function (t) { return '<option value="' + esc(t[0]) + '">' + esc(t[1]) + "</option>"; }).join("");
      s.addEventListener("change", function () { applyTheme(s.value); });
    });
    applyTheme(saved);
  })();

  /* ── 5. Mobile menu, active section, reveal ── */
  var menuBtn = $(".menu-btn"), nav = $(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { nav.classList.toggle("open"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); }); });
  }
  var secs = $$("section[id]");
  if (secs.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$(".nav a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  }
  var rev = $$(".reveal");
  if (rev.length && "IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { ro.observe(el); });
  } else rev.forEach(function (el) { el.classList.add("in"); });

  /* ── 6. Gallery: bento + filters + lightbox ── */
  var bento = $("#bento"), filters = $("#filters");
  var lbIndex = 0, shown = P.photos || [];
  function renderBento(list) {
    shown = list;
    var spans = ["w2 h2", "", "", "w2", "", ""], max = 6;
    bento.innerHTML = list.slice(0, max).map(function (ph, i) {
      return '<button class="tile ' + (spans[i] || "") + '" data-i="' + i + '" aria-label="' + esc(ph.alt) + '">' +
        '<img src="' + esc(ph.src) + '" alt="' + esc(ph.alt) + '" loading="' + (i < 2 ? "eager" : "lazy") + '">' +
        '<span class="cap">' + esc(ph.tag) + "</span></button>";
    }).join("") + (list.length > max ? '<button class="tile more" data-i="' + max + '">+' + (list.length - max) + " " + esc(S.photos.moreLabel) + "</button>" : "");
    $$(".tile", bento).forEach(function (t) { t.addEventListener("click", function () { openLb(+t.getAttribute("data-i")); }); });
  }
  if (bento && P.photos) {
    var tags = [];
    P.photos.forEach(function (p) { if (tags.indexOf(p.tag) < 0) tags.push(p.tag); });
    filters.innerHTML = ['<button class="on" data-tag="">' + esc(S.photos.allLabel) + " " + P.photos.length + "</button>"].concat(tags.map(function (t) {
      return '<button data-tag="' + esc(t) + '">' + esc(t) + "</button>";
    })).join("");
    $$("button", filters).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", filters).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var t = b.getAttribute("data-tag");
        renderBento(t ? P.photos.filter(function (p) { return p.tag === t; }) : P.photos);
      });
    });
    renderBento(P.photos);
  }
  var lb = $("#lightbox");
  function showLb(i) {
    lbIndex = (i + shown.length) % shown.length;
    var ph = shown[lbIndex];
    $("img", lb).src = ph.src; $("img", lb).alt = ph.alt;
    $(".lcap", lb).textContent = ph.alt;
    $(".count", lb).textContent = (lbIndex + 1) + " / " + shown.length;
  }
  function openLb(i) { lb.classList.add("open"); document.body.style.overflow = "hidden"; showLb(i); $(".x", lb).focus(); }
  function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  if (lb) {
    $(".x", lb).addEventListener("click", closeLb);
    $(".prev", lb).addEventListener("click", function () { showLb(lbIndex - 1); });
    $(".next", lb).addEventListener("click", function () { showLb(lbIndex + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
    });
    var tx = null;
    lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1));
    });
  }

  /* ── 7. Amenities ── */
  var am = $("#amenities");
  if (am) am.innerHTML = (P.amenities || []).map(function (a) { return '<div class="am">' + icon(a[1]) + "<span>" + esc(a[0]) + "</span></div>"; }).join("");

  /* ── 8. Rates + availability: CSV first, properties.js fallback ── */
  var C = window.SDO_CSV, R = S.rates || {}, band = $("#band");
  var sz = {}; (P.seasons || []).forEach(function (s) { sz[s.key] = s; });
  var rateRows = null, bookedNights = new Set(), avRows = [];
  var calMonth = new Date(); calMonth.setDate(1);
  var previewMode = false;

  function monthSeasonFallback(d) {
    var mmdd = (d.getMonth() + 1 + "").padStart(2, "0") + "-" + (d.getDate() + "").padStart(2, "0");
    var hol = (P.holidayRanges || []).some(function (r) { return r[0] <= r[1] ? (mmdd >= r[0] && mmdd <= r[1]) : (mmdd >= r[0] || mmdd <= r[1]); });
    var k = hol && sz.holiday ? "holiday" : P.monthSeason[d.getMonth()];
    return { season: k, label: sz[k].label, nightly: sz[k].nightly, min: sz[k].min };
  }
  function rateFor(d) {
    var s = C.iso(d);
    if (rateRows) {
      for (var i = 0; i < rateRows.length; i++) if (s >= rateRows[i].start && s <= rateRows[i].end) return rateRows[i];
      return null;
    }
    return monthSeasonFallback(d);
  }
  function colorFor(k) { return sz[k] ? sz[k].color : "var(--season-off)"; }
  function fmtRange(a, b) {
    var f = function (s) { var d = new Date(s + "T12:00"); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); };
    return f(a) + " – " + f(b);
  }

  function renderRates() {
    if (!band) return;
    var y = new Date().getFullYear(), legend = {}, order = [];
    band.innerHTML = Array.apply(null, Array(12)).map(function (_, m) {
      var r = rateFor(new Date(y, m, 15));
      return '<span style="background:' + (r ? colorFor(r.season) : "var(--line)") + '" title="' + esc(r ? r.label : "no rate") + '"></span>';
    }).join("");
    $("#months").innerHTML = "JFMAMJJASOND".split("").map(function (m) { return "<span>" + m + "</span>"; }).join("");
    var rows = rateRows ? rateRows.filter(function (r) { return r.end >= C.iso(new Date()); }) : (P.seasons || []).map(function (s) { return { season: s.key, label: s.label, when: s.when, nightly: s.nightly, min: s.min }; });
    rows.forEach(function (r) {
      var k = r.season + "|" + r.label;
      if (!legend[k]) { legend[k] = { season: r.season, label: r.label, nightly: r.nightly, min: r.min, when: r.when || [] }; order.push(k); }
      if (!r.when) legend[k].when.push(fmtRange(r.start, r.end));
    });
    var seen = {};
    $("#legend").innerHTML = order.filter(function (k) { var s = legend[k].season; if (seen[s]) return false; seen[s] = 1; return true; })
      .map(function (k) { return '<span><i style="background:' + colorFor(legend[k].season) + '"></i>' + esc(sz[legend[k].season] ? sz[legend[k].season].label : legend[k].label) + "</span>"; }).join("");
    $("#rtable tbody").innerHTML = order.map(function (k) {
      var L = legend[k], when = Array.isArray(L.when) ? L.when.slice(0, 3).join(" · ") + (L.when.length > 3 ? " …" : "") : L.when;
      return "<tr><td><b style='color:" + colorFor(L.season) + "'>●</b>&nbsp; " + esc(L.label) + '<br><span class="muted" style="font-size:13px">' + esc(when) + "</span></td><td>" + L.min + " " + esc(R.nightsWord) + "</td><td><b>" + money(L.nightly) + "</b> / night</td></tr>";
    }).join("");
    var all = rows.map(function (r) { return r.nightly; });
    $("#from").textContent = all.length ? money(Math.min.apply(null, all)) : "$—";
    var note = $("#rates-note");
    if (note) note.textContent = (previewMode ? (R.previewNote || "") : "") + (rateRows ? (R.csvNote || "") : (P.ratesNote || ""));
  }

  /* availability calendar inside the quote card */
  var qin = $("#q-in"), qout = $("#q-out"), qres = $("#q-res"), cal = $("#cal");
  function renderCal() {
    if (!cal) return;
    var y = calMonth.getFullYear(), m = calMonth.getMonth(), first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    var today = C.iso(new Date()), qi = qin.value, qo = qout.value;
    var h = '<div class="cal-head"><button type="button" class="cal-nav" data-d="-1" aria-label="Previous month">‹</button><b>' + first.toLocaleDateString("en-US", { month: "long", year: "numeric" }) + '</b><button type="button" class="cal-nav" data-d="1" aria-label="Next month">›</button></div>';
    h += '<div class="cal-grid">' + "SMTWTFS".split("").map(function (d) { return '<span class="dow">' + d + "</span>"; }).join("");
    for (var i = 0; i < first.getDay(); i++) h += "<span></span>";
    for (var d = 1; d <= days; d++) {
      var s = C.iso(new Date(y, m, d)), cls = "day", r = rateFor(new Date(y, m, d)), dis = false;
      if (s < today) { cls += " past"; dis = true; }
      else if (bookedNights.has(s)) { cls += " booked"; dis = true; }
      if (qi && qo && s >= qi && s < qo) cls += " sel"; else if (qi && !qo && s === qi) cls += " sel";
      if (s === qi) cls += " in";
      if (qo && s === C.iso(C.addDays(new Date(qo + "T12:00"), -1))) cls += " out";
      h += '<button type="button" class="' + cls + '" data-day="' + s + '"' + (dis ? " disabled" : "") + "><span>" + d + "</span>" + (r && !dis ? "<i>" + money(r.nightly) + "</i>" : "") + "</button>";
    }
    h += "</div>";
    h += '<div class="cal-legend"><span><i class="l-free"></i>' + esc(R.legendFree || "Available") + '</span><span><i class="l-booked"></i>' + esc(R.legendBooked || "Booked") + '</span><span><i class="l-sel"></i>' + esc(R.legendSel || "Your dates") + "</span></div>";
    cal.innerHTML = h;
    $$(".cal-nav", cal).forEach(function (b) { b.addEventListener("click", function () { calMonth.setMonth(calMonth.getMonth() + +b.getAttribute("data-d")); renderCal(); }); });
    $$(".day:not([disabled])", cal).forEach(function (b) {
      b.addEventListener("click", function () {
        var s = b.getAttribute("data-day");
        if (!qin.value || (qin.value && qout.value) || s <= qin.value) { qin.value = s; qout.value = ""; qout.min = s; }
        else qout.value = s;
        quote(); renderCal();
      });
    });
  }

  function quote() {
    if (!qres) return;
    if (!qin.value || !qout.value) { qres.innerHTML = '<span class="hint">' + esc(R.emptyHint) + "</span>"; return; }
    var a = new Date(qin.value + "T12:00"), b = new Date(qout.value + "T12:00");
    var nights = Math.round((b - a) / 864e5);
    if (nights < 1) { qres.innerHTML = '<span class="hint">' + esc(R.orderHint) + "</span>"; return; }
    var sub = 0, mins = 0, lines = {}, order = [], clash = 0, missing = 0;
    for (var d = new Date(a); d < b; d.setDate(d.getDate() + 1)) {
      if (bookedNights.has(C.iso(d))) clash++;
      var r = rateFor(d);
      if (!r) { missing++; continue; }
      sub += r.nightly; mins = Math.max(mins, r.min);
      if (!lines[r.season]) { lines[r.season] = { label: r.label, nightly: r.nightly, n: 0 }; order.push(r.season); }
      lines[r.season].n++;
    }
    if (clash) { qres.innerHTML = '<span class="hint warn">' + esc(fmt(R.bookedHint || "{n} of those nights are already booked. Try other dates.", { n: clash })) + "</span>"; return; }
    if (missing) { qres.innerHTML = '<span class="hint warn">' + esc(R.noRateHint || "No rate is published for part of those dates yet. Ask the owner.") + "</span>"; return; }
    var tax = (sub + P.fees.cleaning) * P.fees.taxRate;
    var html = order.map(function (k) { var L = lines[k]; return "<div><span>" + L.n + " × " + esc(L.label) + " @ " + money(L.nightly) + "</span><span>" + money(L.n * L.nightly) + "</span></div>"; }).join("");
    html += "<div><span>" + esc(R.cleaning) + "</span><span>" + money(P.fees.cleaning) + "</span></div>";
    html += "<div><span>" + esc(R.taxes) + " (" + Math.round(P.fees.taxRate * 100) + "%)</span><span>" + money(tax) + "</span></div>";
    html += '<div class="tot"><span>' + nights + " " + esc(R.nightsWord) + "</span><span>" + money(sub + P.fees.cleaning + tax) + "</span></div>";
    if (nights < mins) html += '<span class="hint">' + esc(fmt(R.minHint, { min: mins })) + "</span>";
    html += '<span class="hint">' + esc(R.estimateHint) + "</span>";
    qres.innerHTML = html;
    var fi = $("#f-in"), fo = $("#f-out");
    if (fi && fo) { fi.value = qin.value; fo.value = qout.value; }
  }
  if (qin) {
    var today = new Date().toISOString().slice(0, 10);
    qin.min = today; qout.min = today;
    qin.addEventListener("change", function () { qout.min = qin.value; quote(); renderCal(); });
    qout.addEventListener("change", function () { quote(); renderCal(); });
  }

  /* load CSVs: localStorage preview (set by admin.html) wins, then data/*.csv, then properties.js */
  function applyRatesText(t) { var v = C.validateRates(C.parse(t)); var rows = v.rows.filter(function (r) { return r.property_id === P.id; }); if (!v.errors.length && rows.length) rateRows = rows; }
  function applyAvailText(t) {
    var v = C.validateAvailability(C.parse(t)); if (v.errors.length) return;
    avRows = v.rows.filter(function (r) { return r.property_id === P.id; });
    bookedNights = new Set(); avRows.forEach(function (r) { C.nightsBetween(r.checkin, r.checkout).forEach(function (n) { bookedNights.add(n); }); });
  }
  function fetchText(url) { return fetch(url, { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : null; }).catch(function () { return null; }); }
  if (C && (band || cal)) (function loadData() {
    var pr = null, pa = null;
    try { pr = localStorage.getItem("sdo-preview-rates"); pa = localStorage.getItem("sdo-preview-availability"); } catch (e) {}
    if (pr || pa) {
      previewMode = true;
      if (pr) applyRatesText(pr); if (pa) applyAvailText(pa);
      renderRates(); quote(); renderCal(); return;
    }
    renderRates(); quote(); renderCal();
    Promise.all([fetchText("data/rates.csv"), fetchText("data/availability.csv")]).then(function (t) {
      if (t[0]) applyRatesText(t[0]); if (t[1]) applyAvailText(t[1]);
      renderRates(); quote(); renderCal();
    });
  })();

  /* ── 9. Location ── */
  var map = $("#map-embed");
  if (map) {
    map.innerHTML = '<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map of ' + esc(P.name) + '" src="https://www.google.com/maps?q=' + encodeURIComponent(P.address) + '&z=15&output=embed"></iframe>';
    $("#near").innerHTML = (P.nearby || []).map(function (n) { return "<div>" + esc(n[0]) + "<span>" + esc(n[1]) + "</span></div>"; }).join("");
  }

  /* ── 10. Reviews ── */
  var rv = $("#reviews-grid"), RV = S.reviews || {};
  if (rv) {
    if ((P.reviews || []).length) {
      rv.innerHTML = P.reviews.map(function (r) {
        return '<blockquote><div class="stars">' + "★★★★★".slice(0, r.stars || 5) + "</div>" + esc(r.text) + "<cite>" + esc(r.name) + (r.when ? " · " + esc(r.when) : "") + "</cite></blockquote>";
      }).join("");
    } else {
      rv.className = "rev-empty";
      rv.innerHTML = esc(RV.empty) + " " + ((P.reviewLinks || []).length
        ? esc(RV.emptyLinks) + " " + P.reviewLinks.map(function (l) { return '<a href="' + esc(l[1]) + '" rel="noopener" target="_blank">' + esc(l[0]) + "</a>"; }).join(" and ") + "."
        : esc(RV.emptyNoLinks));
    }
  }

  /* ── 11. Inquiry form → email ── */
  var form = $("#inquiry");
  if (form) {
    $$("[data-contact]").forEach(function (el) {
      var k = el.getAttribute("data-contact"), v = (P.contact || {})[k];
      if (!v) { el.style.display = "none"; return; }
      el.href = k === "email" ? "mailto:" + v : k === "phone" ? "tel:" + v.replace(/[^+\d]/g, "") : "https://wa.me/" + v.replace(/[^\d]/g, "");
      el.textContent = v;
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements, v = { "in": f.checkin.value, out: f.checkout.value, guests: f.guests.value, message: f.message.value || "", guest: f.name.value, guestEmail: f.email.value, email: P.contact.email };
      window.location.href = "mailto:" + P.contact.email + "?subject=" + encodeURIComponent(fmt(S.book.mailSubject, v)) + "&body=" + encodeURIComponent(fmt(S.book.mailBody, v));
      $("#form-ok").textContent = fmt(S.book.sent, v);
    });
  }

  /* ── 12. Property cards (properties.html) ── */
  var cards = $("#cards"), L = S.list || {};
  if (cards) {
    cards.innerHTML = props.map(function (p) {
      var from = Math.min.apply(null, p.seasons.map(function (s) { return s.nightly; }));
      return '<a class="card" href="' + (p.featured ? "index.html" : "index.html?p=" + esc(p.id)) + '"><img src="' + esc(p.hero) + '" alt="' + esc(p.name) + '" loading="lazy"><div class="body"><h3>' + esc(p.name) + "</h3>" +
        '<div class="meta">' + p.facts.bedrooms + " BR · " + p.facts.bathrooms + " BA · sleeps " + p.facts.sleeps + " · " + esc(p.facts.view) + '</div><span class="from">' + esc(L.from) + " " + money(from) + " " + esc(L.perNight) + "</span></div></a>";
    }).join("");
  }
})();
