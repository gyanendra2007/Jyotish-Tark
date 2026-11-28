/* Jyotish Tark — site search with live suggestions (Hindi + Hinglish).
   - Adds a 🔍 button to the site header on every page (overlay search).
   - Any <input data-jt-search> gets a suggestion dropdown too (e.g. bhakti page).
   Index: search-index.js (built by tools/search/build_index.py), loaded on first use. */
(function () {
  "use strict";
  if (window.JTSearch) return;
  var IDX = null, loading = null;
  // English pages: English labels; results open the English page when there is one, otherwise the
  // English "this page is in Hindi" note (window.JT_EN is set by jt-site.js)
  var EN = (document.documentElement.getAttribute("lang") || "") === "en" && /\/en\//.test(location.pathname);
  var L = EN ? { none: 'No page found — try another word (e.g. "hanuman", "aarti", "panchang")', label: "Search the website", head: "🔍 Search the whole website",
      ph: "e.g. hanuman chalisa, ekadashi, panchang, kundali…", hint: "Type in English or Hindi. Most pages are in Hindi; pages marked EN open in English.", close: "Close", btn: "Search" }
    : { none: 'कोई पेज नहीं मिला — दूसरा शब्द लिखें (जैसे "हनुमान", "aarti", "panchang")', label: "वेबसाइट पर खोजें", head: "🔍 पूरी वेबसाइट में खोजें",
      ph: "जैसे: हनुमान चालीसा, ekadashi, aaj ka panchang, कुंडली…", hint: "", close: "बंद करें", btn: "खोजें" };
  function enInfo(u) {
    var J = window.JT_EN; if (!EN || !J) return null;
    var f = String(u || "").replace(/^\/+/, "").split("#")[0], root = J.root || "/";
    if (Object.prototype.hasOwnProperty.call(J.map, f)) return { href: root + J.map[f], en: true, t: (J.titles || {})[f] };
    if (J.hindiOnly.indexOf(f) >= 0) return { href: root + "en/" + f, en: false };
    return { href: root + "en/hindi-only.html?p=" + encodeURIComponent(f), en: false };
  }
  function load() {
    if (IDX) return Promise.resolve(IDX);
    if (loading) return loading;
    loading = new Promise(function (res) {
      var s = document.createElement("script"); s.src = (window.JT_BASE || "") + "search-index.js?v=9"; s.async = true;
      s.onload = function () { IDX = (window.JT_SEARCH || []).map(prep); res(IDX); };
      s.onerror = function () { IDX = []; res(IDX); };
      document.head.appendChild(s);
    });
    return loading;
  }
  // normalise so common spelling variants match: "hanumaan"≈"hanuman", "chaalisa"≈"chalisa", ँ≈ं, nukta ignored
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFC")
      .replace(/[़]/g, "").replace(/ँ/g, "ं").replace(/[नमङणञ]्(?=[क-ह])/g, "ं")
      .replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u").replace(/sh/g, "s").replace(/w/g, "v").replace(/ph/g, "f")
      .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  }
  // consonant skeleton for Roman words, so spelling variants match: mahalaxmi≈mahalakshmi, astkam≈ashtakam, sunderkand≈sundarkand
  function skel(w) {
    if (!/^[a-z0-9]+$/.test(w)) return "";
    return w.replace(/x/g, "ks").replace(/q/g, "k").replace(/z/g, "j").replace(/ck/g, "k").replace(/(?<=.)[nm](?=[bcdfgjklpqrstvz])/g, "").replace(/[aeiouyh]/g, "").replace(/(.)\1+/g, "$1");
  }
  function prep(r) {
    var kw = norm(r[1] + " " + r[3]).split(" "), sk = [];
    for (var i = 0; i < kw.length; i++) { var s = skel(kw[i]); if (s.length >= 2) sk.push(s); }
    var sl = norm(r[0].split("#")[0].replace(/\.html$/, "").replace(/-/g, " "));
    return { u: r[0], t: r[1], c: r[2], tt: norm(r[1]), tw: norm(r[1]).split(" "), kw: kw, sk: sk, sl: sl, sks: sl.split(" ").map(skel).join(" ") };
  }
  function search(q, n) {
    var qs = norm(q).split(" ").filter(Boolean); if (!qs.length || !IDX) return [];
    var out = [], part = [];
    for (var i = 0; i < IDX.length; i++) {
      var r = IDX[i], sc = 0, ok = true, hits = 0;
      for (var j = 0; j < qs.length; j++) {
        var w = qs[j], hitT = false, hitK = false, sub = false;
        for (var a = 0; a < r.tw.length; a++) if (r.tw[a].indexOf(w) === 0) { hitT = true; break; }
        if (!hitT) for (var b = 0; b < r.kw.length; b++) if (r.kw[b].indexOf(w) === 0) { hitK = true; break; } else if (w.length >= 5 && r.kw[b].indexOf(w) > 0) { hitK = sub = true; }
        if (!hitT && !hitK && w.length >= 2) { var ws = skel(w); if (ws.length >= 2) for (var c = 0; c < r.sk.length; c++) if (r.sk[c].indexOf(ws) === 0) { hitK = sub = true; break; } }
        if (!hitT && !hitK) { ok = false; continue; }
        hits++; sc += hitT ? 3 : sub ? 0.6 : 1;
      }
      if (!ok) { if (hits) part.push([hits * 2 + sc / 10 - r.t.length / 300, r]); continue; }
      var qj = qs.join(" "), qsk = qs.map(skel).join(" ");
      if (r.tt.indexOf(qj) === 0) sc += 5;
      if (r.sl === qj || (qsk.replace(/ /g, "") && r.sks === qsk)) sc += 8; else if (r.sl.indexOf(qj) === 0) sc += 2;
      if (r.c === "पंचांग" && r.u !== "panchang.html" && qs.length < 2) sc -= 1.5; // city pages after main pages, unless the city is typed
      if (r.c === "पेज") sc -= 0.5;
      sc -= r.t.length / 200;
      out.push([sc, r]);
    }
    if (!out.length) out = part; // nothing matched every word → closest pages
    out.sort(function (x, y) { return y[0] - x[0]; });
    return out.slice(0, n || 8).map(function (x) { return x[1]; });
  }
  var css = ".jts-wrap{position:relative}.jts-list{position:absolute;left:0;right:0;top:100%;margin:6px 0 0;padding:6px;list-style:none;background:#fff;border:1px solid #e3d5b8;border-radius:14px;box-shadow:0 12px 30px rgba(60,30,10,.18);z-index:2147483100;max-height:min(60vh,440px);overflow:auto;text-align:left}" +
    ".jts-list li a{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;color:#2b1d14;text-decoration:none;font-size:16px;line-height:1.3}.jts-list li a[aria-selected=true],.jts-list li a:hover{background:#fff3d6}" +
    ".jts-c{flex:none;font-size:12px;font-weight:700;color:#7a1f1f;background:#fbecd0;border-radius:999px;padding:2px 8px}.jts-none{padding:10px;color:#6b5a4a;font-size:15px}" +
    ".jts-btn{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;border:1px solid rgba(122,31,31,.25);background:#fff;color:#7a1f1f;font-size:18px;cursor:pointer;flex:none;margin:0 8px}" +
    ".jts-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(20,10,5,.55);display:flex;justify-content:center;align-items:flex-start;padding:70px 14px 14px}.jts-box{width:100%;max-width:640px;background:#fffdf8;border-radius:18px;padding:14px;box-shadow:0 20px 50px rgba(0,0,0,.3)}" +
    ".jts-box input{width:100%;font:inherit;font-size:18px;padding:12px 14px;border-radius:12px;border:2px solid #c9a227;outline:none;background:#fff;color:#2b1d14}.jts-box .jts-list{position:static;box-shadow:none;border:0;margin-top:8px;max-height:60vh}" +
    ".jts-top{display:flex;justify-content:space-between;align-items:center;margin:0 2px 8px;color:#7a1f1f;font-weight:700}.jts-x{border:0;background:none;font-size:26px;line-height:1;cursor:pointer;color:#7a1f1f}.jts-hint{font-size:13px;color:#6b5a4a;margin:8px 2px 0}";
  function addCss() { if (document.getElementById("jts-css")) return; var s = document.createElement("style"); s.id = "jts-css"; s.textContent = css; document.head.appendChild(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function attach(input, opts) {
    if (!input || input.__jts) return; input.__jts = 1; opts = opts || {}; addCss();
    var list = document.createElement("ul"); list.className = "jts-list"; list.setAttribute("role", "listbox"); list.hidden = true;
    var id = "jts" + Math.random().toString(36).slice(2, 7); list.id = id;
    input.setAttribute("role", "combobox"); input.setAttribute("aria-autocomplete", "list"); input.setAttribute("aria-controls", id); input.setAttribute("aria-expanded", "false"); input.setAttribute("autocomplete", "off");
    var host = opts.container || input.parentNode;
    if (!opts.container) { host.classList.add("jts-wrap"); }
    host.appendChild(list);
    var sel = -1, items = [];
    function render() {
      var q = input.value.trim();
      if (!q) { list.hidden = true; input.setAttribute("aria-expanded", "false"); return; }
      load().then(function () {
        if (input.value.trim() !== q) return;
        items = search(q, opts.max || 8); sel = -1;
        list.innerHTML = items.length ? items.map(function (r, i) { var e = enInfo(r.u); return '<li role="none"><a role="option" id="' + id + i + '" href="' + (e ? e.href : r.u) + '"><span class="jts-c">' + esc(e ? (e.en ? "EN" : "हिंदी") : r.c) + '</span><span' + (e && !e.en ? ' lang="hi"' : "") + ">" + esc((e && e.t) || r.t) + "</span></a></li>"; }).join("")
          : '<li class="jts-none">' + esc(L.none) + "</li>";
        list.hidden = false; input.setAttribute("aria-expanded", "true");
      });
    }
    function mark() { var as = list.querySelectorAll("a[role=option]"); for (var i = 0; i < as.length; i++) as[i].setAttribute("aria-selected", i === sel ? "true" : "false"); if (as[sel]) { as[sel].scrollIntoView({ block: "nearest" }); input.setAttribute("aria-activedescendant", as[sel].id); } }
    input.addEventListener("input", render);
    input.addEventListener("focus", function () { load(); if (input.value.trim()) render(); });
    input.addEventListener("keydown", function (e) {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); mark(); }
      else if (e.key === "Enter") { var r = items[sel >= 0 ? sel : 0]; if (r) { e.preventDefault(); var x = enInfo(r.u); location.href = x ? x.href : r.u; } }
      else if (e.key === "Escape") { list.hidden = true; input.setAttribute("aria-expanded", "false"); }
    });
    if (!opts.container) document.addEventListener("click", function (e) { if (!host.contains(e.target)) { list.hidden = true; input.setAttribute("aria-expanded", "false"); } });
    list.addEventListener("click", function (e) { var a = e.target.closest("a"); if (a) try { if (window.gtag) gtag("event", "site_search", { search_term: input.value, page: a.getAttribute("href") }); } catch (x) {} });
  }

  function overlay() {
    addCss();
    var ov = document.createElement("div"); ov.className = "jts-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", L.label);
    ov.innerHTML = '<div class="jts-box"><div class="jts-top"><span>' + esc(L.head) + '</span><button class="jts-x" type="button" aria-label="' + esc(L.close) + '">×</button></div>' +
      '<input type="search" placeholder="' + esc(L.ph) + '"><div class="jts-res"></div><p class="jts-hint">' + esc(L.hint || "हिंदी या English (Hinglish) — दोनों में लिखें। एक अक्षर से ही सुझाव आने लगेंगे।") + '</p></div>';
    document.body.appendChild(ov);
    var inp = ov.querySelector("input"); attach(inp, { container: ov.querySelector(".jts-res"), max: 12 });
    function close() { ov.remove(); document.removeEventListener("keydown", k); }
    function k(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", k);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    ov.querySelector(".jts-x").onclick = close;
    setTimeout(function () { inp.focus(); }, 30);
  }
  function headerButton() {
    var bars = document.querySelectorAll("[data-jts-open]");
    if (bars.length) { for (var i = 0; i < bars.length; i++) bars[i].onclick = overlay; return; }
    var row = document.querySelector(".jt-header-row") || document.querySelector("header .jt-wrap") || null;
    if (!row || row.querySelector(".jts-btn")) return;
    addCss();
    var b = document.createElement("button"); b.type = "button"; b.className = "jts-btn"; b.setAttribute("aria-label", L.label); b.title = L.btn; b.textContent = "🔍";
    b.onclick = overlay;
    var toggle = row.querySelector(".jt-nav-toggle, .jt-menu-btn, button[aria-controls]");
    if (toggle) row.insertBefore(b, toggle); else row.appendChild(b);
  }
  function init() { headerButton(); document.querySelectorAll("input[data-jt-search]").forEach(function (i) { attach(i); }); }
  window.JTSearch = { attach: attach, open: overlay, search: function (q) { return load().then(function () { return search(q); }); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
