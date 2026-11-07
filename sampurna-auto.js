/* Jyotish Tark — automatic delivery of the ₹1,101 Sampurna Kundali.
   The preview saves the customer's details in this browser before sending them to Cashfree.
   Cashfree's success redirect brings them back to kundali-form.html?jtpaid=sampurna; this script
   rebuilds the chart from the saved details and opens the full report with a PDF button. */
(function () {
  "use strict";
  const q = new URLSearchParams(location.search);
  if (q.get("jtpaid") !== "sampurna" || q.has("jtadmin")) return;
  const WA = "918318513814";
  const KEY = "jt-sampurna-order";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let order = null;
  try { order = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { order = null; }
  if (order && Date.now() - (order.ts || 0) > 30 * 864e5) order = null;

  const CSS = `
  .jtx-ov{position:fixed;inset:0;z-index:300;background:rgba(20,10,5,.78);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Mukta',system-ui,sans-serif}
  .jtx-card{width:100%;max-width:460px;background:#FBF6EC;border:3px double #B8892B;border-radius:16px;padding:22px;color:#2B1810;text-align:center}
  .jtx-card h2{margin:0 0 8px;font-size:23px;color:#7A1F1F;line-height:1.3}
  .jtx-card p{margin:0 0 12px;font-size:16px;color:#4A3628;line-height:1.6}
  .jtx-spin{width:42px;height:42px;margin:6px auto 14px;border:4px solid #E9D9B4;border-top-color:#7A1F1F;border-radius:50%;animation:jtxs 1s linear infinite}
  @keyframes jtxs{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion:reduce){.jtx-spin{animation:none}}
  .jtx-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border:0;border-radius:10px;background:#7A1F1F;color:#FFFFFF;font:inherit;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none}
  .jtx-btn.g{background:#15803D}.jtx-btn.l{background:#FFFFFF;color:#7A1F1F;border:1.5px solid #7A1F1F}
  .jtx-btn:focus-visible{outline:3px solid #B8892B;outline-offset:2px}
  .jtx-view{position:fixed;inset:0;z-index:310;background:#3B2A20;display:flex;flex-direction:column}
  .jtx-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:#7A1F1F;color:#FFFFFF;font-family:'Mukta',system-ui,sans-serif}
  .jtx-top b{flex:1 1 220px;font-size:16px;line-height:1.35}.jtx-top small{display:block;font-weight:400;font-size:13px;color:#F3E9D6}
  .jtx-view iframe{flex:1;width:100%;border:0;background:#EDE6D9}
  html.jtx-on .jt-bot,html.jtx-on .jt-ad{display:none!important}`;

  function css() { const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); document.documentElement.classList.add("jtx-on"); }
  function overlay(html) {
    let ov = document.getElementById("jtxOv");
    if (!ov) { ov = document.createElement("div"); ov.id = "jtxOv"; ov.className = "jtx-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov); }
    ov.innerHTML = `<div class="jtx-card" aria-live="polite">${html}</div>`;
    return ov;
  }
  const waLink = (txt) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(txt);

  function noOrder() {
    overlay(`<h2>भुगतान के लिए धन्यवाद 🙏</h2>
      <p>इस फ़ोन/ब्राउज़र में आपका जन्म विवरण नहीं मिला (शायद भुगतान किसी दूसरे फ़ोन या ब्राउज़र से हुआ)। चिंता न करें — WhatsApp पर अपना नाम भेजें, आपकी सम्पूर्ण कुंडली वहीं भेज दी जाएगी।</p>
      <a class="jtx-btn g" href="${waLink("नमस्ते, मैंने सम्पूर्ण कुंडली (₹1,101) का भुगतान किया है। कृपया मेरी कुंडली भेजें।")}" target="_blank" rel="noopener">WhatsApp पर संदेश भेजें</a>`);
  }

  function fail(msg) {
    overlay(`<h2>कुंडली अपने-आप नहीं बन सकी</h2><p>${esc(msg)}</p><p>आपका भुगतान सुरक्षित है। WhatsApp पर संदेश भेजें — कुंडली वहीं भेज दी जाएगी।</p>
      <a class="jtx-btn g" href="${waLink(`नमस्ते, मैंने सम्पूर्ण कुंडली का भुगतान किया है (ऑर्डर ${order.o || ""}, नाम ${order.n || ""})। कुंडली अपने-आप नहीं बनी, कृपया भेजें।`)}" target="_blank" rel="noopener">WhatsApp पर संदेश भेजें</a>`);
  }

  function fill() {
    const set = (id, v) => { const el = document.getElementById(id); if (el && v != null && v !== "") el.value = v; };
    set("userName", order.n); set("userDob", order.d); set("birthTime", order.t); set("userGender", order.g);
    set("reportLang", "hi");
    const pl = document.getElementById("birthPlace");
    if (pl && order.p) { pl.value = order.p; if (order.lat) { pl.dataset.lat = order.lat; pl.dataset.lng = order.lng; } }
    const acc = document.getElementById("timeAccuracy"); if (acc) { acc.disabled = false; acc.value = "exact"; }
    if (typeof window.switchWorkspaceMode === "function") window.switchWorkspaceMode("instant");
    if (typeof window.handleDossierSubmit !== "function") throw new Error("पेज पूरा लोड नहीं हुआ।");
    window.handleDossierSubmit(null);
  }

  function printHtml(html, frame) {
    // A separate tab prints most reliably on phones; fall back to the on-page frame.
    let w = null;
    try { w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank"); } catch (e) { w = null; }
    if (w) { w.addEventListener("load", () => setTimeout(() => { try { w.focus(); w.print(); } catch (e) { /* ignore */ } }, 600)); return; }
    const fw = frame.contentWindow;
    const go = () => { fw.focus(); fw.print(); };
    if (fw.document.fonts && fw.document.fonts.ready) fw.document.fonts.ready.then(go); else go();
  }

  let shown = false;
  function show() {
    if (shown) return;
    let html;
    try { html = window.JTSampurnaReport.build({ orderId: order.o || "", gender: order.g === "female" ? "female" : "male", status: order.m || "single" }); }
    catch (e) { fail(e.message || String(e)); return; }
    shown = true;
    const ov = document.getElementById("jtxOv"); if (ov) ov.remove();
    const v = document.createElement("div");
    v.className = "jtx-view";
    v.innerHTML = `<div class="jtx-top"><b>आपकी सम्पूर्ण कुंडली तैयार है 🙏<small>"PDF डाउनलोड करें" दबाएँ, फिर प्रिंट विंडो में "Save as PDF" चुनें।</small></b>
      <button type="button" class="jtx-btn g" id="jtxPdf">PDF डाउनलोड करें</button>
      <a class="jtx-btn l" href="${waLink(`नमस्ते, मेरी सम्पूर्ण कुंडली बन गई है (ऑर्डर ${order.o || ""}, नाम ${order.n || ""})। मुझे एक प्रश्न पूछना है।`)}" target="_blank" rel="noopener">WhatsApp सहायता</a>
      <button type="button" class="jtx-btn l" id="jtxClose">बंद करें</button></div>
      <iframe title="सम्पूर्ण कुंडली"></iframe>`;
    document.body.appendChild(v);
    const fr = v.querySelector("iframe");
    fr.addEventListener("load", () => {
      // fit the A4 pages to a phone screen (screen only; printing keeps full size)
      try { const w = fr.clientWidth; if (w < 820) { const s = fr.contentDocument.createElement("style"); s.textContent = `@media screen{html{zoom:${(w / 820).toFixed(3)}}}`; fr.contentDocument.head.appendChild(s); } } catch (e) { /* ignore */ }
    });
    fr.srcdoc = html;
    v.querySelector("#jtxPdf").addEventListener("click", () => {
      printHtml(html, fr);
      try { if (window.gtag) window.gtag("event", "sampurna_pdf", { order: order.o || "" }); } catch (e) { /* ignore */ }
    });
    v.querySelector("#jtxClose").addEventListener("click", () => { v.remove(); document.documentElement.classList.remove("jtx-on"); });
    try {
      if (!order.delivered) {
        order.delivered = Date.now(); localStorage.setItem(KEY, JSON.stringify(order));
        if (window.gtag) window.gtag("event", "purchase", { transaction_id: order.o || "", value: 1101, currency: "INR", items: [{ item_name: "Sampurna Kundali" }] });
      }
    } catch (e) { /* ignore */ }
  }

  function start() {
    css();
    if (!order || !order.n || !order.d || !order.t || !order.lat) { noOrder(); return; }
    overlay(`<div class="jtx-spin" aria-hidden="true"></div><h2>आपकी सम्पूर्ण कुंडली बन रही है…</h2><p>भुगतान के लिए धन्यवाद, ${esc(order.n)} जी। कृपया यह पेज बंद न करें — इसमें कुछ सेकंड लगते हैं।</p>`);
    document.addEventListener("jt:dossier-ready", () => setTimeout(show, 400));
    try { fill(); } catch (e) { fail(e.message || String(e)); return; }
    setTimeout(() => { if (!shown && window.__jyotishLastCtx) show(); }, 9000);
    setTimeout(() => { if (!shown) fail("कुंडली बनने में बहुत समय लग रहा है।"); }, 30000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 80));
  else setTimeout(start, 80);
})();
