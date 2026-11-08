/* SunDestin Online — one script for every page. Vanilla JS, no dependencies.
   Fills the HTML layout from the data files:
     data/site_text.js   → window.SDO_SITE        (site-wide text)
     data/properties.js  → window.SDO_PROPERTIES  (per-property content)
     data/rates.csv, data/availability.csv         (via js/csv.js)
   Slots:  <el data-t="site.hero.title"> or data-t="p.headline"   → text
   Blocks: <el data-block="hero_line">                            → rendered lists
   Names: snake_case, object first then part (gallery_tile, quote_calendar). */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var C = window.SDO_CSV, ST = window.SDO_STORE;
  /* language: "en" (data/site_text.js) or "es" (data/site_text_es.js merged over it) */
  var LANG = "en";
  try { LANG = localStorage.getItem("sdo_lang") || "en"; } catch (e) {}
  if (LANG !== "es" || !window.SDO_SITE_ES) LANG = "en";
  function merge(a, b) { var o = Object.assign({}, a); Object.keys(b || {}).forEach(function (k) { o[k] = (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a && typeof a[k] === "object" && !Array.isArray(a[k])) ? merge(a[k], b[k]) : b[k]; }); return o; }
  var S = LANG === "es" ? merge(window.SDO_SITE, window.SDO_SITE_ES) : (window.SDO_SITE || {});
  var LOCALE = LANG === "es" ? "es-ES" : "en-US";
  document.documentElement.lang = LANG;
  var props = window.SDO_PROPERTIES || [];
  var qs = new URLSearchParams(location.search);
  var P = props.filter(function (p) { return p.id === qs.get("p"); })[0] ||
          props.filter(function (p) { return p.featured; })[0] || props[0] || {};
  /* owner edits saved from admin.html (demo: this browser) override the data file (English text) */
  var ov = ST && P.id ? ST.getText(P.id) : null;
  if (ov) P = Object.assign({}, P, ov);
  /* Spanish property text */
  if (LANG === "es" && window.SDO_PROPERTIES_ES && window.SDO_PROPERTIES_ES[P.id]) {
    var E = window.SDO_PROPERTIES_ES[P.id];
    P = merge(P, E);
    if (E.photo_tags) P.photos = (P.photos || []).map(function (ph) { return Object.assign({}, ph, { tag: E.photo_tags[ph.tag] || ph.tag }); });
    if (E.nearby_dist) P.nearby = (P.nearby || []).map(function (n, i) { return [n[0], E.nearby_dist[i] || n[1], n[2], n[3]]; });
  }
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
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
  var yr = $("#footer_year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ── 2. Icons (stroke SVG, currentColor) ── */
  var I = {
    beach: '<path d="M3 20h18M4 17c3-2 6-2 9 0M12 3a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8zM12 11v6"/>',
    kitchen: '<path d="M4 4h16v16H4zM4 11h16M9 4v7M15 11v9"/>',
    wifi: '<path d="M2 9a16 16 0 0 1 20 0M5.5 12.5a11 11 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01"/>',
    pool: '<path d="M3 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M3 20c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M8 13V5a2 2 0 0 1 4 0M14 13V5a2 2 0 0 1 4 0"/>',
    key: '<path d="M14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM13 13l7 7M17 17l2-2"/>',
    check: '<path d="M5 12l5 5 9-10"/>'
  };
  function icon(k) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[k] || I.check) + "</svg>";
  }

  /* ── 3. Blocks ── */
  var B = {};
  B.site_logo = function (el) { el.innerHTML = esc(S.brand.name) + " <span>" + esc(S.brand.accent) + "</span>"; };
  B.site_nav = function (el) {
    var pre = el.getAttribute("data-prefix") || "";
    el.innerHTML = (S.nav || []).map(function (n) {
      var href = n[1].charAt(0) === "#" ? pre + n[1] : n[1];
      return '<a href="' + esc(href) + '">' + esc(n[0]) + "</a>";
    }).join("");
  };
  B.site_lang = function (el) {
    el.innerHTML = '<button type="button" data-lang="en"' + (LANG === "en" ? ' class="on"' : "") + '>EN</button><button type="button" data-lang="es"' + (LANG === "es" ? ' class="on"' : "") + ">ES</button>";
    $$("button", el).forEach(function (b) { b.addEventListener("click", function () { try { localStorage.setItem("sdo_lang", b.getAttribute("data-lang")); } catch (e) {} location.reload(); }); });
  };
  B.site_account = function (el) {
    var pre = el.getAttribute("data-prefix") || "", u = ST ? ST.current() : null;
    el.href = pre + "register.html";
    el.textContent = u ? fmt(S.account_link || "Hi, {user}", { user: (u.name || "").split(" ")[0] }) : (S.signin_link || "Sign in");
    el.classList.toggle("on", !!u);
  };
  B.site_theme = function (el) {
    var colors = { emerald_water: "#0FA3A3", deep_gulf: "#1D7FA8", sunset_sand: "#E8893D", night_swim: "#0B1A26" };
    el.innerHTML = (S.themes || []).map(function (t) {
      return '<button type="button" class="theme_dot" data-theme="' + esc(t[0]) + '" title="' + esc(t[1]) + '" aria-label="' + esc(t[1]) + '" style="background:' + (colors[t[0]] || "#999") + '"></button>';
    }).join("");
    var head = el.classList.contains("site_theme_head");
    $$(".theme_dot", el).forEach(function (b) {
      b.addEventListener("click", function () {
        /* header: a tap on the lone dot opens the fan first; a pick closes it */
        if (head && b.classList.contains("on") && !el.classList.contains("open") && !el.matches(":hover")) { el.classList.add("open"); return; }
        applyTheme(b.getAttribute("data-theme")); el.classList.remove("open");
      });
    });
    if (head) document.addEventListener("click", function (e) { if (!el.contains(e.target)) el.classList.remove("open"); });
  };
  B.location_note = function (el) { el.textContent = fmt((S.location || {}).ring_note || "", { miles: P.map_ring_miles || 3 }); };
  B.hero_chips = function (el) {
    var f = P.facts || {};
    var W = LANG === "es" ? ["dormitorio", "dormitorios", "baño", "baños", "Capacidad "] : ["bedroom", "bedrooms", "bath", "baths", "Sleeps "];
    el.innerHTML = [f.bedrooms + " " + (f.bedrooms === 1 ? W[0] : W[1]), f.bathrooms + " " + (f.bathrooms === 1 ? W[2] : W[3]), W[4] + f.sleeps, f.floor, f.view]
      .map(function (c) { return '<span class="hero_chip">' + esc(c) + "</span>"; }).join("");
  };
  B.hero_img = function (el) { el.src = P.hero; el.alt = ((P.photos || [])[0] || {}).alt || P.name; };
  B.hero_line = function (el) { el.innerHTML = (S.hero.line || []).map(function (t, i) { return '<span class="hero_pill' + (i === 1 ? " on" : "") + '">' + esc(t) + "</span>"; }).join(""); };
  B.condo_desc = function (el) { el.innerHTML = (P.description || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); };
  B.condo_facts = function (el) {
    var FL = S.condo.fact_labels, f = P.facts;
    el.innerHTML = [["bedrooms", f.bedrooms], ["bathrooms", f.bathrooms], ["sleeps", f.sleeps], ["floor", f.floor], ["view", f.view], ["complex", P.complex]]
      .map(function (x) { return "<div><dt>" + esc(FL[x[0]]) + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("") +
      '<div class="wide"><dt>' + esc(FL.beds) + "</dt><dd><ul>" + (P.beds || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></dd></div>" +
      '<div class="wide"><dt>' + esc(FL.address) + "</dt><dd>" + esc(P.address) + "</dd></div>";
  };
  B.amenity_groups = function (el) {
    el.innerHTML = (P.amenity_groups || []).map(function (g) {
      return '<div class="amenity_group">' + icon(g[1]) + "<h3>" + esc(g[0]) + "</h3><ul>" + g[2].map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>";
    }).join("");
  };
  function occOptions(from, to, sel) { var h = ""; for (var i = from; i <= to; i++) h += "<option" + (i === sel ? " selected" : "") + ">" + i + "</option>"; return h; }
  B.inquiry_occupancy = function (el) {
    var n = (P.facts || {}).sleeps || 6;
    $("#inquiry_guests", el).innerHTML = occOptions(1, n, 2);
    $("#inquiry_children", el).innerHTML = occOptions(0, n - 1, 0);
    var g = $("#inquiry_guests", el), c = $("#inquiry_children", el);
    function cap() { var max = n - (+g.value); if (+c.value > max) c.value = max; $$("option", c).forEach(function (o) { o.disabled = +o.value > max; }); }
    g.addEventListener("change", cap); c.addEventListener("change", cap); cap();
  };
  B.inquiry_placeholder = function (el) { el.placeholder = S.inquiry.placeholder || ""; };
  B.quote_occupancy = function (el) {
    var n = (P.facts || {}).sleeps || 6, R2 = S.rates || {};
    el.innerHTML = '<div class="occ_line"><span>' + esc(R2.guests_label || "Guests") + '</span><select id="quote_guests">' + occOptions(1, n, 2) + "</select></div>" +
                   '<div class="occ_line"><span>' + esc(R2.children_label || "Children") + '</span><select id="quote_children">' + occOptions(0, n - 1, 0) + "</select></div>";
    var g = $("#quote_guests", el), c = $("#quote_children", el);
    function sync() {
      var max = n - (+g.value); if (+c.value > max) c.value = max;
      $$("option", c).forEach(function (o) { o.disabled = +o.value > max; });
      var fg = $("#inquiry_guests"), fc = $("#inquiry_children");
      if (fg) { fg.value = g.value; } if (fc) { fc.value = c.value; $$("option", fc).forEach(function (o) { o.disabled = +o.value > max; }); }
    }
    g.addEventListener("change", sync); c.addEventListener("change", sync); sync();
  };
  B.faq_list = function (el) {
    el.innerHTML = (P.faq || []).map(function (q) { return "<details><summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>"; }).join("");
  };
  B.footer_links = function (el) {
    var pre = el.getAttribute("data-prefix") || "";
    el.innerHTML = (S.footer.links || []).map(function (l) {
      var href = l[1].charAt(0) === "#" ? pre + l[1] : l[1];
      return '<a href="' + esc(href) + '">' + esc(l[0]) + "</a>";
    }).join("");
  };
  $$("[data-block]").forEach(function (el) { var fn = B[el.getAttribute("data-block")]; if (fn) fn(el); });

  /* ── 4. Theme dropdown (remembered per visitor) ── */
  var THEMES = S.themes || [["emerald_water", "Emerald water"]];
  function applyTheme(t) {
    if (t === THEMES[0][0]) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    $$(".theme_dot").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-theme") === t); });
    try { localStorage.setItem("sdo_theme", t); } catch (e) {}
  }
  (function initTheme() {
    var saved = THEMES[0][0];
    try { saved = localStorage.getItem("sdo_theme") || saved; } catch (e) {}
    if (!THEMES.some(function (t) { return t[0] === saved; })) saved = THEMES[0][0];
    applyTheme(saved);
  })();

  /* ── 5. Active section + reveal on scroll ── */
  var secs = $$("section[id]");
  if (secs.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$(".site_nav a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
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

  /* ── 6. Gallery: grid + filters + viewer ── */
  var grid = $("#gallery_grid"), filters = $("#gallery_filters");
  var viewerIndex = 0, shown = P.photos || [];
  function renderGrid(list) {
    shown = list;
    var spans = ["w2 h2", "", "", "w2", "", "", "", ""], max = 8;
    grid.innerHTML = list.slice(0, max).map(function (ph, i) {
      return '<button class="gallery_tile ' + (spans[i] || "") + '" data-i="' + i + '" aria-label="' + esc(ph.alt) + '">' +
        '<img src="' + esc(ph.src) + '" alt="' + esc(ph.alt) + '" loading="' + (i < 2 ? "eager" : "lazy") + '">' +
        '<span class="cap">' + esc(ph.tag) + "</span></button>";
    }).join("");
    $$(".gallery_tile", grid).forEach(function (t) { t.addEventListener("click", function () { openViewer(+t.getAttribute("data-i")); }); });
    var seeAll = $("#gallery_see_all");
    if (seeAll) { seeAll.textContent = fmt(S.gallery.see_all, { n: list.length }) + " ›"; seeAll.onclick = function () { openViewer(0); }; }
  }
  if (grid && P.photos) {
    var tags = [];
    P.photos.forEach(function (p) { if (tags.indexOf(p.tag) < 0) tags.push(p.tag); });
    filters.innerHTML = ['<button class="on" data-tag="">' + esc(S.gallery.all_label) + " " + P.photos.length + "</button>"].concat(tags.map(function (t) {
      return '<button data-tag="' + esc(t) + '">' + esc(t) + "</button>";
    })).join("");
    $$("button", filters).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", filters).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var t = b.getAttribute("data-tag");
        renderGrid(t ? P.photos.filter(function (p) { return p.tag === t; }) : P.photos);
      });
    });
    renderGrid(P.photos);
  }
  var viewer = $("#gallery_viewer");
  function showViewer(i) {
    viewerIndex = (i + shown.length) % shown.length;
    var ph = shown[viewerIndex];
    $("img", viewer).src = ph.src; $("img", viewer).alt = ph.alt;
    $(".cap", viewer).textContent = ph.alt;
    $(".count", viewer).textContent = (viewerIndex + 1) + " / " + shown.length;
  }
  function openViewer(i) { viewer.classList.add("open"); document.body.style.overflow = "hidden"; showViewer(i); $(".x", viewer).focus(); }
  function closeViewer() { viewer.classList.remove("open"); document.body.style.overflow = ""; }
  if (viewer) {
    $(".x", viewer).addEventListener("click", closeViewer);
    $(".prev", viewer).addEventListener("click", function () { showViewer(viewerIndex - 1); });
    $(".next", viewer).addEventListener("click", function () { showViewer(viewerIndex + 1); });
    viewer.addEventListener("click", function (e) { if (e.target === viewer) closeViewer(); });
    document.addEventListener("keydown", function (e) {
      if (!viewer.classList.contains("open")) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") showViewer(viewerIndex - 1);
      if (e.key === "ArrowRight") showViewer(viewerIndex + 1);
    });
    var tx = null;
    viewer.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40) showViewer(viewerIndex + (dx < 0 ? 1 : -1));
    });
  }

  /* ── 7. Rates: CSV first, properties.js fallback ── */
  var R = S.rates || {};
  var sz = {}; (P.seasons || []).forEach(function (s) { sz[s.key] = s; });
  var rateRows = null, bookedNights = new Set();
  var previewMode = false;
  function monthSeasonFallback(d) {
    var mmdd = (d.getMonth() + 1 + "").padStart(2, "0") + "-" + (d.getDate() + "").padStart(2, "0");
    var hol = (P.holiday_ranges || []).some(function (r) { return r[0] <= r[1] ? (mmdd >= r[0] && mmdd <= r[1]) : (mmdd >= r[0] || mmdd <= r[1]); });
    var k = hol && sz.holiday ? "holiday" : P.month_season[d.getMonth()];
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
  function colorFor(k) { return sz[k] ? sz[k].color : "var(--season_off)"; }
  function fmtDate(s) { return new Date(s + "T12:00").toLocaleDateString(LOCALE, { month: "short", day: "numeric" }); }

  /* upcoming rate ranges, one per label, for the season band and package cards */
  function upcomingRanges() {
    var today = C.iso(new Date());
    if (rateRows) return rateRows.filter(function (r) { return r.end >= today; });
    return (P.seasons || []).map(function (s) { return { season: s.key, label: s.label, when: s.when, nightly: s.nightly, min: s.min }; });
  }
  var band = $("#season_band");
  function renderRates() {
    if (!band) return;
    var y = new Date().getFullYear();
    band.innerHTML = Array.apply(null, Array(12)).map(function (_, m) {
      var r = rateFor(new Date(y, m, 15));
      return '<span style="background:' + (r ? colorFor(r.season) : "var(--line)") + '" title="' + esc(r ? r.label : "no rate") + '"></span>';
    }).join("");
    $("#season_months").innerHTML = (LANG === "es" ? "EFMAMJJASOND" : "JFMAMJJASOND").split("").map(function (m) { return "<span>" + m + "</span>"; }).join("");
    var rows = upcomingRanges(), seen = {}, legend = [];
    rows.forEach(function (r) { if (!seen[r.season]) { seen[r.season] = 1; legend.push(r.season); } });
    $("#season_legend").innerHTML = legend.map(function (k) { return '<span><i style="background:' + colorFor(k) + '"></i>' + esc(sz[k] ? sz[k].label : k) + "</span>"; }).join("");
    var all = rows.map(function (r) { return r.nightly; });
    $("#rate_from").textContent = all.length ? money(Math.min.apply(null, all)) : "$—";
    var note = $("#rate_note");
    if (note) note.textContent = (previewMode ? (R.preview_note || "") : "") + (rateRows ? (R.csv_note || "") : (P.rates_note || ""));
    renderPackages(rows);
  }

  /* package cards: one per label, "min nights from $X incl. cleaning" */
  var packages = $("#package_list");
  function renderPackages(rows) {
    if (!packages) return;
    var today = C.iso(new Date()), byLabel = {}, order = [];
    rows.forEach(function (r) {
      var k = r.label;
      if (!byLabel[k]) { byLabel[k] = r; order.push(k); }
    });
    packages.innerHTML = order.map(function (k) {
      var r = byLabel[k], price = r.min * r.nightly + (P.fees.cleaning || 0);
      var when = r.start ? fmtDate(r.start < today ? today : r.start) + " – " + fmtDate(r.end) : (r.when || "");
      return '<button class="package_card" data-start="' + esc(r.start < today ? today : (r.start || "")) + '" data-min="' + r.min + '">' +
        '<i style="background:' + colorFor(r.season) + '"></i><div><b>' + esc(r.label) + "</b><small>" + esc(when) + " · " + r.min + " " + esc(R.nights_word) + "</small></div>" +
        '<div class="price">' + money(price) + "</div></button>";
    }).join("");
    $$(".package_card", packages).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".package_card", packages).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var start = b.getAttribute("data-start"), min = +b.getAttribute("data-min");
        if (!start) return;
        /* first free run of `min` nights from the package start */
        var d = new Date(start + "T12:00"), tries = 0;
        while (tries < 120) {
          var ok = true;
          for (var i = 0; i < min; i++) if (bookedNights.has(C.iso(C.addDays(d, i)))) { ok = false; break; }
          if (ok) break;
          d = C.addDays(d, 1); tries++;
        }
        qin.value = C.iso(d); qout.value = C.iso(C.addDays(d, min)); qout.min = qin.value;
        calMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        quote(); renderCal();
        $("#quote_card").scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }

  /* ── 8. Two-month calendar with click or drag selection ── */
  var qin = $("#quote_checkin"), qout = $("#quote_checkout"), qres = $("#quote_result"), cal = $("#quote_calendar");
  var calMonth = new Date(); calMonth.setDate(1);
  var dragStart = null, dragHover = null;
  function monthHtml(y, m, which) {
    var first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    var today = C.iso(new Date()), qi = qin.value, qo = qout.value;
    var selA = qi, selB = qo;
    if (dragStart && dragHover) { selA = dragStart < dragHover ? dragStart : dragHover; selB = dragStart < dragHover ? dragHover : dragStart; }
    var h = '<div class="cal_month' + (which === 1 ? " second" : "") + '"><div class="cal_head">' +
      '<button type="button" class="cal_nav" data-d="-1" aria-label="Previous month"' + (which === 1 ? " disabled" : "") + ">‹</button><b>" +
      first.toLocaleDateString(LOCALE, { month: "long", year: "numeric" }) +
      '</b><button type="button" class="cal_nav" data-d="1" aria-label="Next month"' + (which === 0 ? " disabled" : "") + ">›</button></div>";
    h += '<div class="cal_grid">' + (LANG === "es" ? "DLMXJVS" : "SMTWTFS").split("").map(function (d) { return '<span class="dow">' + d + "</span>"; }).join("");
    for (var i = 0; i < first.getDay(); i++) h += "<span></span>";
    for (var d = 1; d <= days; d++) {
      var s = C.iso(new Date(y, m, d)), cls = "cal_day", r = rateFor(new Date(y, m, d)), dis = false;
      if (s < today) { cls += " past"; dis = true; }
      else if (bookedNights.has(s)) { cls += " booked"; dis = true; }
      if (selA && selB && s >= selA && s <= selB) cls += " sel"; else if (selA && !selB && s === selA) cls += " sel";
      if (s === selA) cls += " in";
      if (selB && s === selB) cls += " out";
      var outOk = cls.indexOf("booked") > -1 && qi && !qo && s > qi && !bookedNights.has(C.iso(C.addDays(new Date(s + "T12:00"), -1)));
      if (outOk) { dis = false; cls += " out_ok"; }
      /* after a check-in is chosen, days closer than the minimum stay cannot be the check-out */
      if (qi && !qo && s > qi && !dis && Math.round((new Date(s + "T12:00") - new Date(qi + "T12:00")) / 864e5) < (P.min_nights || 1)) { dis = true; cls += " too_soon"; }
      h += '<button type="button" class="' + cls + '" data-day="' + s + '"' + (dis ? " disabled" : "") + "><span>" + d + "</span>" + (r && cls.indexOf("booked") < 0 && cls.indexOf("past") < 0 ? "<i>" + money(r.nightly) + "</i>" : "") + "</button>";
    }
    return h + "</div></div>";
  }
  function renderCal() {
    if (!cal) return;
    var y = calMonth.getFullYear(), m = calMonth.getMonth();
    cal.innerHTML = monthHtml(y, m, 0) + monthHtml(y + (m === 11 ? 1 : 0), (m + 1) % 12, 1);
    $$(".cal_nav", cal).forEach(function (b) { b.addEventListener("click", function () { calMonth.setMonth(calMonth.getMonth() + +b.getAttribute("data-d")); renderCal(); }); });
    $$(".cal_day:not([disabled])", cal).forEach(function (b) {
      var s = b.getAttribute("data-day");
      b.addEventListener("click", function () { pick(s); });
      b.addEventListener("mousedown", function (e) { e.preventDefault(); dragStart = s; dragHover = null; });
      b.addEventListener("mouseenter", function () { if (dragStart && dragStart !== s) { dragHover = s; renderCal(); } });
    });
  }
  function pick(s) {
    if (!qin.value || (qin.value && qout.value) || s <= qin.value) { qin.value = s; qout.value = ""; qout.min = s; }
    else qout.value = s;
    quote(); renderCal();
  }
  document.addEventListener("mouseup", function () {
    if (!dragStart) return;
    if (dragHover && dragHover !== dragStart) {
      var a = dragStart < dragHover ? dragStart : dragHover, b = dragStart < dragHover ? dragHover : dragStart;
      qin.value = a; qout.value = b; qout.min = a;
      dragStart = null; dragHover = null; quote(); renderCal();
    } else { dragStart = null; dragHover = null; }
  });

  function quote() {
    if (!qres) return;
    $$(".package_card.on", packages).forEach(function (x) { x.classList.remove("on"); });
    if (!qin.value || !qout.value) { qres.innerHTML = '<span class="hint">' + esc(R.empty_hint) + "</span>"; return; }
    var a = new Date(qin.value + "T12:00"), b = new Date(qout.value + "T12:00");
    var nights = Math.round((b - a) / 864e5), MIN = P.min_nights || 1;
    if (nights < 1) { qres.innerHTML = '<span class="hint">' + esc(R.order_hint) + "</span>"; return; }
    if (nights < MIN) { qres.innerHTML = '<span class="hint warn">' + esc(fmt(R.min_hard, { min: MIN })) + "</span>"; return; }
    var sub = 0, mins = 0, lines = {}, order = [], clash = 0, missing = 0;
    for (var d = new Date(a); d < b; d.setDate(d.getDate() + 1)) {
      if (bookedNights.has(C.iso(d))) clash++;
      var r = rateFor(d);
      if (!r) { missing++; continue; }
      sub += r.nightly; mins = Math.max(mins, r.min);
      if (!lines[r.label]) { lines[r.label] = { nightly: r.nightly, n: 0 }; order.push(r.label); }
      lines[r.label].n++;
    }
    if (clash) { qres.innerHTML = '<span class="hint warn">' + esc(fmt(R.booked_hint, { n: clash })) + "</span>"; return; }
    if (missing) { qres.innerHTML = '<span class="hint warn">' + esc(R.no_rate_hint) + "</span>"; return; }
    var tax = (sub + P.fees.cleaning) * P.fees.tax_rate;
    var html = order.map(function (k) { var ln = lines[k]; return "<div><span>" + ln.n + " × " + esc(k) + " @ " + money(ln.nightly) + "</span><span>" + money(ln.n * ln.nightly) + "</span></div>"; }).join("");
    html += "<div><span>" + esc(R.cleaning) + "</span><span>" + money(P.fees.cleaning) + "</span></div>";
    html += "<div><span>" + esc(R.taxes) + " (" + Math.round(P.fees.tax_rate * 100) + "%)</span><span>" + money(tax) + "</span></div>";
    html += '<div class="tot"><span>' + nights + " " + esc(R.nights_word) + "</span><span>" + money(sub + P.fees.cleaning + tax) + "</span></div>";
    if (nights < mins) html += '<span class="hint">' + esc(fmt(R.min_hint, { min: mins })) + "</span>";
    html += '<span class="hint">' + esc(R.estimate_hint) + "</span>";
    qres.innerHTML = html;
    var fi = $("#inquiry_checkin"), fo = $("#inquiry_checkout");
    if (fi && fo) { fi.value = qin.value; fo.value = qout.value; }
  }
  if (qin) {
    var today = new Date().toISOString().slice(0, 10);
    qin.min = today; qout.min = today;
    qin.addEventListener("change", function () { qout.min = qin.value; quote(); renderCal(); });
    qout.addEventListener("change", function () { quote(); renderCal(); });
  }

  /* load CSVs: localStorage preview (set by rates_upload.html) wins, then data/*.csv, then properties.js */
  function applyRatesText(t) { var v = C.validateRates(C.parse(t)); var rows = v.rows.filter(function (r) { return r.property_id === P.id; }); if (!v.errors.length && rows.length) rateRows = rows; }
  function applyAvailText(t) {
    var v = C.validateAvailability(C.parse(t)); if (v.errors.length) return;
    bookedNights = new Set();
    v.rows.filter(function (r) { return r.property_id === P.id; }).forEach(function (r) { C.nightsBetween(r.checkin, r.checkout).forEach(function (n) { bookedNights.add(n); }); });
  }
  function fetchText(url) { return fetch(url, { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : null; }).catch(function () { return null; }); }
  if (C && (band || cal)) (function loadData() {
    var pr = ST ? ST.getRatesCsv() : null, pa = ST ? ST.getAvailabilityCsv() : null;
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

  /* ── 9. Location: OpenStreetMap, numbered pins that match the list; hover highlights both ── */
  var map = $("#location_map"), nearList = $("#location_nearby");
  function pinNo(i) { var n = 0; for (var k = 0; k <= i; k++) if ((P.nearby[k] || [])[2]) n++; return n; }
  if (map && nearList) {
    nearList.innerHTML = (P.nearby || []).map(function (n, i) {
      return '<div class="near_row' + (n[2] ? " has_pin" : "") + '" data-i="' + i + '"><i class="near_num' + (n[2] ? "" : " home") + '">' + (n[2] ? pinNo(i) : "") + "</i><span class=\"near_name\">" + esc(n[0]) + '</span><span class="near_dist">' + esc(n[1]) + "</span></div>";
    }).join("");
    if (window.L && P.lat) {
      var lmap = L.map(map, { scrollWheelZoom: false }).setView([P.lat, P.lng], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(lmap);
      L.marker([P.lat, P.lng], { icon: L.divIcon({ className: "pin_home", html: '<svg viewBox="0 0 32 44" width="32" height="44" aria-hidden="true"><path d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 43 16 43s15-16 15-27.2C31 7.6 24.3 1 16 1z" fill="#F26B3A" stroke="#fff" stroke-width="2"/><path d="M9 17l7-6 7 6v8h-5v-5h-4v5H9z" fill="#fff"/></svg>', iconSize: [32, 44], iconAnchor: [16, 43], popupAnchor: [0, -40] }), zIndexOffset: 1000 })
        .addTo(lmap).bindPopup("<b>" + esc(P.name) + "</b><br>" + esc(P.address));
      /* radius ring around the condo (miles set in properties.js map_ring_miles) */
      var ring = L.circle([P.lat, P.lng], { radius: (P.map_ring_miles || 3) * 1609.34, color: "#0FA3A3", weight: 1.5, dashArray: "6 6", fillColor: "#0FA3A3", fillOpacity: 0.06, interactive: false }).addTo(lmap);
      var pins = [], bounds = [[P.lat, P.lng]];
      (P.nearby || []).forEach(function (n, i) {
        if (!n[2]) return;
        var m = L.marker([n[2], n[3]], { icon: L.divIcon({ className: "pin", html: "<span>" + pinNo(i) + "</span>", iconSize: [28, 28], iconAnchor: [14, 14] }) })
          .addTo(lmap).bindPopup("<b>" + esc(n[0]) + "</b><br>" + esc(n[1]));
        pins[i] = m;
        if (Math.abs(n[2] - P.lat) < 0.06 && Math.abs(n[3] - P.lng) < 0.08) bounds.push([n[2], n[3]]);
        m.on("mouseover", function () { hi(i, true); }); m.on("mouseout", function () { hi(i, false); });
        m.on("click", function () { $$(".near_row.hover", nearList).forEach(function (x) { hi(+x.getAttribute("data-i"), false); }); hi(i, true); var r = $('.near_row[data-i="' + i + '"]', nearList); if (r) r.scrollIntoView({ block: "nearest", behavior: "smooth" }); });
      });
      var fit = ring.getBounds(); bounds.forEach(function (b) { fit.extend(b); });
      lmap.fitBounds(fit, { padding: [12, 12] });
      function hi(i, on) {
        var r = $('.near_row[data-i="' + i + '"]', nearList); if (r) r.classList.toggle("hover", on);
        var el = pins[i] && pins[i].getElement(); if (el) el.classList.toggle("hover", on);
      }
      $$(".near_row.has_pin", nearList).forEach(function (d) {
        var i = +d.getAttribute("data-i");
        d.addEventListener("mouseenter", function () { hi(i, true); });
        d.addEventListener("mouseleave", function () { hi(i, false); });
        d.addEventListener("click", function () {
          $$(".near_row.hover", nearList).forEach(function (x) { if (x !== d) hi(+x.getAttribute("data-i"), false); });
          hi(i, true);
          var m = pins[i]; if (m) { lmap.panTo(m.getLatLng()); m.openPopup(); }
        });
      });
      map.addEventListener("click", function () { lmap.scrollWheelZoom.enable(); });
    } else {
      map.innerHTML = '<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map of ' + esc(P.name) + '" src="https://www.google.com/maps?q=' + encodeURIComponent(P.address) + '&z=15&output=embed"></iframe>';
    }
  }

  /* ── 10. Reviews: data file + guest reviews (demo), scroll strip, add / edit ── */
  var rv = $("#review_list"), RV = S.reviews || {}, rvTools = $("#review_tools"), rvForm = $("#review_form");
  function allReviews() { var mine = ST ? ST.reviews(P.id) : []; return mine.map(function (r) { return Object.assign({ demo: true }, r); }).concat(P.reviews || []); }
  function renderReviews() {
    if (!rv) return;
    var list = allReviews();
    if (list.length) {
      rv.className = "review_list";
      rv.innerHTML = list.map(function (r) {
        return '<blockquote><div class="stars">' + "★★★★★".slice(0, r.stars || 5) + "</div>" + esc(r.text) + "<cite>" + esc(r.name) + (r.when ? " · " + esc(r.when) : "") + (r.demo ? ' · <i>' + esc(RV.demo_tag) + "</i>" : "") + "</cite></blockquote>";
      }).join("");
    } else {
      rv.className = "review_empty";
      rv.innerHTML = esc(RV.empty) + " " + ((P.review_links || []).length
        ? esc(RV.empty_links) + " " + P.review_links.map(function (l) { return '<a href="' + esc(l[1]) + '" rel="noopener" target="_blank">' + esc(l[0]) + "</a>"; }).join(" and ") + "."
        : esc(RV.empty_no_links));
    }
    var nav = $("#review_nav"); if (nav) nav.hidden = list.length < 2;
    if (rvTools && ST) {
      var u = ST.current(), mine = ST.myReview(P.id);
      rvTools.innerHTML = u
        ? '<button class="btn btn_ghost" type="button" id="review_open">' + esc(mine ? RV.edit_btn : RV.add_btn) + "</button>"
        : '<span class="muted" style="font-size:14px">' + esc(RV.signin_hint) + ' <a href="register.html">' + esc(RV.signin_link) + "</a></span>";
      var open = $("#review_open");
      if (open) open.addEventListener("click", function () {
        rvForm.hidden = false;
        rvForm.elements.stars.value = mine ? mine.stars : 5; rvForm.elements.text.value = mine ? mine.text : ""; rvForm.elements.when.value = mine ? mine.when : "";
        $("#review_delete").hidden = !mine;
        rvForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }
  if (rvForm && ST) {
    rvForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = ST.saveReview(P.id, rvForm.elements.stars.value, rvForm.elements.text.value, rvForm.elements.when.value);
      var m = $("#review_msg"); m.textContent = r.ok ? RV.saved : r.error; m.className = "review_msg " + (r.ok ? "ok" : "err");
      if (r.ok) { rvForm.hidden = true; renderReviews(); }
    });
    $("#review_cancel").addEventListener("click", function () { rvForm.hidden = true; });
    $("#review_delete").addEventListener("click", function () { if (confirm("Delete your review?")) { ST.deleteReview(P.id); rvForm.hidden = true; renderReviews(); } });
    $$("#review_nav button").forEach(function (b) {
      b.addEventListener("click", function () { rv.scrollBy({ left: (+b.getAttribute("data-d")) * (rv.clientWidth * 0.8), behavior: "smooth" }); });
    });
  }
  renderReviews();

  /* ── 11. Inquiry form → email ── */
  var form = $("#inquiry_form");
  if (form) {
    /* signed in: name and email come from the account */
    (function () {
      var u = ST ? ST.current() : null; if (!u) return;
      var n = $("#inquiry_name"), m = $("#inquiry_email");
      if (n && !n.value) n.value = u.name || "";
      if (m && !m.value) m.value = u.email || "";
    })();
    $$("[data-contact]").forEach(function (el) {
      var k = el.getAttribute("data-contact"), v = (P.contact || {})[k];
      if (!v) { el.style.display = "none"; return; }
      el.href = k === "email" ? "mailto:" + v : k === "phone" ? "tel:" + v.replace(/[^+\d]/g, "") : "https://wa.me/" + v.replace(/[^\d]/g, "");
      el.textContent = v;
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements, kids = f.children ? +f.children.value : 0;
      var v = { "in": f.checkin.value, out: f.checkout.value, guests: f.guests.value + " " + esc(S.rates.guests_label).toLowerCase() + (kids ? ", " + kids + " " + esc(S.rates.children_label).toLowerCase() : ""), message: f.message.value || "", guest: f.name.value, guestEmail: f.email.value, email: P.contact.email };
      window.location.href = "mailto:" + P.contact.email + "?subject=" + encodeURIComponent(fmt(S.inquiry.mail_subject, v)) + "&body=" + encodeURIComponent(fmt(S.inquiry.mail_body, v));
      $("#inquiry_sent").textContent = fmt(S.inquiry.sent, v);
    });
  }

  /* ── 12. Property cards (properties.html) ── */
  var cards = $("#property_cards"), LST = S.list || {};
  if (cards) {
    cards.innerHTML = props.map(function (p) {
      var from = Math.min.apply(null, p.seasons.map(function (s) { return s.nightly; }));
      return '<a class="property_card" href="' + (p.featured ? "index.html" : "index.html?p=" + esc(p.id)) + '"><img src="' + esc(p.hero) + '" alt="' + esc(p.name) + '" loading="lazy"><div class="body"><h3>' + esc(p.name) + "</h3>" +
        '<div class="meta">' + p.facts.bedrooms + " BR · " + p.facts.bathrooms + " BA · sleeps " + p.facts.sleeps + " · " + esc(p.facts.view) + '</div><span class="from">' + esc(LST.from) + " " + money(from) + " " + esc(LST.per_night) + "</span></div></a>";
    }).join("");
  }
})();
