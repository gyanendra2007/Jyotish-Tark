/* Jyotish Tark — KP page: form, place search, free KP chart PDF, ₹299 paid report via Cashfree,
   owner promo code (100% off) and automatic delivery after payment (?jtpaid=kp). */
(function () {
  "use strict";
  const PAY = "https://payments.cashfree.com/forms/jyotishtarkkp";
  const WA = "918318513814", KEY = "jt-kp-order";
  // SHA-256 of the owner's promo code (the code itself is not stored in the page)
  const PROMO_HASH = "f0bc24ddac32c6f318381a0fec3ae4e09d23557a0ef3049d0f7b9bb2835da189";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = (t) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  const ga = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* ignore */ } };

  const CSS = `
  .jtx-ov{position:fixed;inset:0;z-index:300;background:rgba(20,10,5,.78);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Mukta',system-ui,sans-serif}
  .jtx-card{width:100%;max-width:460px;background:#FBF6EC;border:3px double #B8892B;border-radius:16px;padding:22px;color:#2B1810;text-align:center}
  .jtx-card h2{margin:0 0 8px;font-size:23px;color:#7A1F1F;line-height:1.3}.jtx-card p{margin:0 0 12px;font-size:16px;color:#4A3628;line-height:1.6}
  .jtx-spin{width:42px;height:42px;margin:6px auto 14px;border:4px solid #E9D9B4;border-top-color:#7A1F1F;border-radius:50%;animation:jtxs 1s linear infinite}
  @keyframes jtxs{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.jtx-spin{animation:none}}
  .jtx-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border:0;border-radius:10px;background:#7A1F1F;color:#FFFFFF;font:inherit;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none}
  .jtx-btn.g{background:#15803D}.jtx-btn.l{background:#FFFFFF;color:#7A1F1F;border:1.5px solid #7A1F1F}.jtx-btn:focus-visible{outline:3px solid #B8892B;outline-offset:2px}
  .jtx-view{position:fixed;inset:0;z-index:310;background:#3B2A20;display:flex;flex-direction:column}
  .jtx-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:#7A1F1F;color:#FFFFFF;font-family:'Mukta',system-ui,sans-serif}
  .jtx-top b{flex:1 1 220px;font-size:16px;line-height:1.35}.jtx-top small{display:block;font-weight:400;font-size:13px;color:#F3E9D6}
  .jtx-view iframe{flex:1;width:100%;border:0;background:#EDE6D9}
  html.jtx-on .jt-bot,html.jtx-on .jt-ad,html.jtx-on .whatsapp-float{display:none!important}`;
  let cssDone = false;
  function css() { if (cssDone) return; cssDone = true; const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); }

  function overlay(html) {
    css(); document.documentElement.classList.add("jtx-on");
    let ov = $("jtxOv");
    if (!ov) { ov = document.createElement("div"); ov.id = "jtxOv"; ov.className = "jtx-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov); }
    ov.innerHTML = `<div class="jtx-card" aria-live="polite">${html}</div>`;
  }
  function closeOverlay() { const ov = $("jtxOv"); if (ov) ov.remove(); }

  function printHtml(html, frame) {
    let w = null;
    try { w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank"); } catch (e) { w = null; }
    if (w) { w.addEventListener("load", () => setTimeout(() => { try { w.focus(); w.print(); } catch (e) { /* ignore */ } }, 700)); return; }
    const fw = frame.contentWindow; fw.focus(); fw.print();
  }

  function viewer(html, o, paid) {
    css(); closeOverlay(); document.documentElement.classList.add("jtx-on");
    const en = o.lang === "en", T = (h, e) => (en ? e : h);
    const v = document.createElement("div");
    v.className = "jtx-view";
    v.innerHTML = `<div class="jtx-top"><b>${paid ? T("आपकी विस्तृत KP जन्म कुण्डली तैयार है 🙏", "Your detailed KP Janm Kundali is ready 🙏") : T("आपकी मुफ़्त KP कुंडली तैयार है", "Your free KP chart is ready")}<small>${T("\"PDF डाउनलोड करें\" दबाएँ, फिर प्रिंट विंडो में \"Save as PDF\" चुनें।", "Press \"Download PDF\", then choose \"Save as PDF\" in the print window.")}</small></b>
      <button type="button" class="jtx-btn g" id="jtxPdf">${T("PDF डाउनलोड करें", "Download PDF")}</button>
      <a class="jtx-btn l" href="${wa(T(`नमस्ते, मेरी KP रिपोर्ट बन गई है (नाम ${o.name})। मुझे एक प्रश्न पूछना है।`, `Hello, my KP report is ready (name ${o.name}). I have a question.`))}" target="_blank" rel="noopener">${T("WhatsApp सहायता", "WhatsApp help")}</a>
      <button type="button" class="jtx-btn l" id="jtxClose">${T("बंद करें", "Close")}</button></div><iframe title="${T("KP रिपोर्ट", "KP report")}"></iframe>`;
    document.body.appendChild(v);
    const fr = v.querySelector("iframe");
    fr.addEventListener("load", () => { try { const w = fr.clientWidth; if (w < 820) { const s = fr.contentDocument.createElement("style"); s.textContent = `@media screen{html{zoom:${(w / 820).toFixed(3)}}}`; fr.contentDocument.head.appendChild(s); } } catch (e) { /* ignore */ } });
    fr.srcdoc = html;
    v.querySelector("#jtxPdf").addEventListener("click", () => { printHtml(html, fr); ga(paid ? "kp_paid_pdf" : "kp_free_pdf"); });
    v.querySelector("#jtxClose").addEventListener("click", () => { v.remove(); document.documentElement.classList.remove("jtx-on"); });
    v.querySelector("#jtxPdf").focus();
  }

  function ready(cb, fail) {
    let n = 0;
    (function w() { if (window.JTKP && window.JTKPX && window.KPT && window.JTKPReport && window.BirthChartCalculator && typeof Astronomy !== "undefined") cb(); else if (++n < 100) setTimeout(w, 150); else fail(); })();
  }

  // ---------- form ----------
  function readForm(needAll) {
    const f = $("kpForm"); if (!f) return null;
    const o = { name: f.kpName.value.trim(), dob: f.kpDob.value, time: f.kpTime.value, place: f.kpPlace.value.trim(), lat: parseFloat(f.kpPlace.dataset.lat), lng: parseFloat(f.kpPlace.dataset.lng), lang: (f.querySelector("input[name=kpLang]:checked") || {}).value || "hi", gender: f.kpGender ? f.kpGender.value : "", status: f.kpStatus ? f.kpStatus.value : "single" };
    const err = $("kpErr");
    const miss = [];
    if (!o.name) miss.push("नाम");
    if (!o.dob) miss.push("जन्मतिथि");
    if (!o.time) miss.push("जन्म समय");
    if (!o.place || isNaN(o.lat)) miss.push("जन्म स्थान (सूची से चुनें)");
    if (miss.length && needAll !== false) {
      err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false;
      const first = !o.name ? f.kpName : !o.dob ? f.kpDob : !o.time ? f.kpTime : f.kpPlace; first.focus();
      return null;
    }
    err.hidden = true;
    return o;
  }

  function placeSearch() {
    const inp = $("kpPlace"), list = $("kpPlaceList"); if (!inp) return;
    let items = [], act = -1;
    const pick = (p) => { inp.value = p.label; inp.dataset.lat = p.lat; inp.dataset.lng = p.lng; list.hidden = true; inp.setAttribute("aria-expanded", "false"); };
    const render = () => {
      list.innerHTML = items.map((p, i) => `<li role="option" id="kpo${i}" aria-selected="${i === act}" data-i="${i}">${esc(p.label)}</li>`).join("");
      list.hidden = !items.length; inp.setAttribute("aria-expanded", String(!!items.length));
      if (act >= 0) inp.setAttribute("aria-activedescendant", "kpo" + act); else inp.removeAttribute("aria-activedescendant");
    };
    let tm = null;
    inp.addEventListener("input", () => {
      delete inp.dataset.lat; delete inp.dataset.lng; act = -1;
      const q = inp.value.trim();
      items = q && window.BirthChartCalculator ? window.BirthChartCalculator.searchPlaces(q, 8) : [];
      render();
      if (tm) clearTimeout(tm);
      if (q.length >= 3 && items.length < 3) tm = setTimeout(async () => {
        try {
          const r = await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + encodeURIComponent(q), { headers: { "Accept-Language": "en" } });
          const d = r.ok ? await r.json() : [];
          items = items.concat(d.map((x) => ({ label: x.display_name.split(",").slice(0, 3).join(","), lat: +x.lat, lng: +x.lon }))).slice(0, 8); render();
        } catch (e) { /* ignore */ }
      }, 350);
    });
    inp.addEventListener("keydown", (e) => {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); act = (act + 1) % items.length; render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); act = (act - 1 + items.length) % items.length; render(); }
      else if (e.key === "Enter" && act >= 0) { e.preventDefault(); pick(items[act]); }
      else if (e.key === "Escape") { list.hidden = true; }
    });
    list.addEventListener("mousedown", (e) => { const li = e.target.closest("li"); if (li) { e.preventDefault(); pick(items[+li.dataset.i]); } });
    inp.addEventListener("blur", () => setTimeout(() => { list.hidden = true; }, 150));
  }

  function buildAndShow(o, paid, orderId) {
    overlay(`<div class="jtx-spin" aria-hidden="true"></div><h2>${o.lang === "en" ? "Your KP report is being prepared…" : "आपकी KP रिपोर्ट बन रही है…"}</h2><p>${esc(o.name)}</p>`);
    ready(() => setTimeout(() => {
      let html;
      try { html = window.JTKPReport.build({ ...o, paid, orderId }); }
      catch (e) { overlay(`<h2>रिपोर्ट नहीं बन सकी</h2><p>${esc(e.message || e)}</p><a class="jtx-btn g" href="${wa("नमस्ते, मेरी KP रिपोर्ट अपने-आप नहीं बनी। कृपया मदद करें।")}" target="_blank" rel="noopener">WhatsApp पर संदेश भेजें</a> <button class="jtx-btn l" type="button" onclick="this.closest('.jtx-ov').remove();document.documentElement.classList.remove('jtx-on')">बंद करें</button>`); return; }
      viewer(html, o, paid);
    }, 300), () => overlay(`<h2>पेज पूरा लोड नहीं हुआ</h2><p>कृपया इंटरनेट जाँचकर पेज दोबारा खोलें।</p><button class="jtx-btn" type="button" onclick="location.reload()">दोबारा खोलें</button>`));
  }

  async function sha256(t) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  function saveOrder(o, extra) {
    const order = { ...o, ...extra, ts: Date.now(), oid: "JTKP-" + Date.now().toString(36).toUpperCase() };
    try { localStorage.setItem(KEY, JSON.stringify(order)); } catch (e) { /* ignore */ }
    return order;
  }

  function init() {
    placeSearch();
    const f = $("kpForm"); if (!f) return;
    f.addEventListener("input", () => { const e = $("kpErr"); if (e && !e.hidden && readForm(false)) { const o = readForm(false); if (o.name && o.dob && o.time && !isNaN(o.lat)) e.hidden = true; } });
    f.addEventListener("submit", (e) => { e.preventDefault(); const o = readForm(); if (o) { ga("kp_free"); buildAndShow(o, false); } });
    const pay = $("kpPay");
    if (pay && window.JTRef && window.JTRef.offer("kp")) { pay.insertAdjacentHTML("beforebegin", window.JTRef.note("kp")); pay.textContent = "💳 ₹269 भुगतान करें (मित्र छूट) — Card / UPI"; }
    if (pay) pay.addEventListener("click", (e) => {
      e.preventDefault();
      const o = readForm(); if (!o) { $("kpForm").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      const rl = window.JTRef && window.JTRef.link("kp");
      saveOrder(o, rl ? { ref: window.JTRef.code() } : {}); ga("begin_checkout", { value: rl ? 269 : 299, currency: "INR", items: [{ item_name: "KP report" }] });
      location.href = rl || PAY;
    });
    const pf = $("kpPromoForm");
    if (pf) pf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = $("kpPromoMsg"), code = pf.kpPromo.value.trim().toUpperCase();
      if (!code) { msg.textContent = "कृपया कोड लिखें।"; return; }
      let off = 0;
      try { off = window.JTPromo ? await window.JTPromo.check(code) : ((await sha256(code)) === PROMO_HASH ? 100 : 0); } catch (er) { off = 0; }
      if (!off) { msg.textContent = "यह कोड मान्य नहीं है।"; return; }
      const o = readForm(); if (!o) { msg.textContent = "कोड सही है — पहले ऊपर का विवरण भरें।"; return; }
      if (off === 50) {
        const h = window.JTPromo.HALF.kp;
        saveOrder(o, { promo: 50 }); ga("kp_promo50"); ga("begin_checkout", { value: h.price, currency: "INR", items: [{ item_name: "KP report (50% promo)" }] });
        msg.textContent = `कोड सही है — 50% छूट। ₹${h.price} का भुगतान पेज खुल रहा है…`;
        setTimeout(() => { location.href = h.link; }, 600);
        return;
      }
      msg.textContent = "कोड लागू — रिपोर्ट बन रही है।";
      const ord = saveOrder(o, { promo: 1, delivered: Date.now() });
      ga("kp_promo");
      buildAndShow(o, true, ord.oid + "-P");
    });
  }

  // ---------- after Cashfree payment ----------
  function afterPay() {
    let order = null;
    try { order = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { order = null; }
    if (order && Date.now() - (order.ts || 0) > 30 * 864e5) order = null;
    if (!order || !order.dob || !order.time || isNaN(order.lat)) {
      overlay(`<h2>भुगतान के लिए धन्यवाद 🙏</h2><p>इस फ़ोन/ब्राउज़र में आपका जन्म विवरण नहीं मिला (शायद भुगतान किसी दूसरे फ़ोन से हुआ)। WhatsApp पर अपना नाम, जन्मतिथि, समय और स्थान भेजें — रिपोर्ट वहीं भेज दी जाएगी।</p><a class="jtx-btn g" href="${wa("नमस्ते, मैंने ₹299 KP रिपोर्ट का भुगतान किया है। मेरा विवरण: ")}" target="_blank" rel="noopener">WhatsApp पर संदेश भेजें</a>`);
      return;
    }
    buildAndShow(order, true, order.oid);
    if (window.JTRef) window.JTRef.after("kp", order.lang);
    try { if (!order.delivered) { order.delivered = Date.now(); localStorage.setItem(KEY, JSON.stringify(order)); ga("purchase", { transaction_id: order.oid, value: order.promo === 50 ? 149 : order.ref ? 269 : 299, currency: "INR", items: [{ item_name: "KP report" }] }); } } catch (e) { /* ignore */ }
  }

  function start() {
    init();
    if (new URLSearchParams(location.search).get("jtpaid") === "kp") afterPay();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
