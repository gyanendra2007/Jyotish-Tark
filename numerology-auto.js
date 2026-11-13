/* Jyotish Tark — automatic delivery of the ₹299 detailed numerology report.
   The paid card saves name + date of birth + language in this browser before Cashfree;
   Cashfree's success redirect brings the customer to numerology.html?jtpaid=nm, where the
   report is built and shown with a PDF button. */
(function () {
  "use strict";
  const q = new URLSearchParams(location.search);
  if (q.get("jtpaid") !== "nm") return;
  const WA = "918318513814", KEY = "jt-nm-order";
  let order = null;
  try { order = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { order = null; }
  if (order && Date.now() - (order.ts || 0) > 30 * 864e5) order = null;
  const en = order && order.lang === "en";
  const T = (h, e) => (en ? e : h);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = (t) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);

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
  html.jtx-on .jt-bot,html.jtx-on .jt-ad{display:none!important}`;

  function overlay(html) {
    let ov = document.getElementById("jtxOv");
    if (!ov) { ov = document.createElement("div"); ov.id = "jtxOv"; ov.className = "jtx-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov); }
    ov.innerHTML = `<div class="jtx-card" aria-live="polite">${html}</div>`;
  }
  function help(title, msg) {
    overlay(`<h2>${title}</h2><p>${msg}</p><a class="jtx-btn g" href="${wa(T("नमस्ते, मैंने ₹299 अंक ज्योतिष रिपोर्ट का भुगतान किया है। कृपया मेरी रिपोर्ट भेजें।", "Hello, I have paid for the ₹299 numerology report. Please send my report."))}" target="_blank" rel="noopener">${T("WhatsApp पर संदेश भेजें", "Message us on WhatsApp")}</a>`);
  }
  function printHtml(html, frame) {
    let w = null;
    try { w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank"); } catch (e) { w = null; }
    if (w) { w.addEventListener("load", () => setTimeout(() => { try { w.focus(); w.print(); } catch (e) { /* ignore */ } }, 700)); return; }
    const fw = frame.contentWindow; fw.focus(); fw.print();
  }

  function show() {
    let html;
    try { html = window.JTNumPro.build({ dob: order.dob, name: order.name, lang: order.lang }); }
    catch (e) { help(T("रिपोर्ट अपने-आप नहीं बन सकी", "The report could not be made automatically"), T("आपका भुगतान सुरक्षित है। WhatsApp पर संदेश भेजें — रिपोर्ट वहीं भेज दी जाएगी।", "Your payment is safe. Message us on WhatsApp and we will send the report there.")); return; }
    const ov = document.getElementById("jtxOv"); if (ov) ov.remove();
    const v = document.createElement("div");
    v.className = "jtx-view";
    v.innerHTML = `<div class="jtx-top"><b>${T("आपकी विस्तृत अंक ज्योतिष रिपोर्ट तैयार है 🙏", "Your detailed numerology report is ready 🙏")}<small>${T("\"PDF डाउनलोड करें\" दबाएँ, फिर प्रिंट विंडो में \"Save as PDF\" चुनें।", "Press \"Download PDF\", then choose \"Save as PDF\" in the print window.")}</small></b>
      <button type="button" class="jtx-btn g" id="jtxPdf">${T("PDF डाउनलोड करें", "Download PDF")}</button>
      <a class="jtx-btn l" href="${wa(T(`नमस्ते, मेरी अंक ज्योतिष रिपोर्ट बन गई है (नाम ${order.name})। मुझे एक प्रश्न पूछना है।`, `Hello, my numerology report is ready (name ${order.name}). I have a question.`))}" target="_blank" rel="noopener">${T("WhatsApp सहायता", "WhatsApp help")}</a>
      <button type="button" class="jtx-btn l" id="jtxClose">${T("बंद करें", "Close")}</button></div><iframe title="${T("अंक ज्योतिष रिपोर्ट", "Numerology report")}"></iframe>`;
    document.body.appendChild(v);
    const fr = v.querySelector("iframe");
    fr.addEventListener("load", () => { try { const w = fr.clientWidth; if (w < 820) { const s = fr.contentDocument.createElement("style"); s.textContent = `@media screen{html{zoom:${(w / 820).toFixed(3)}}}`; fr.contentDocument.head.appendChild(s); } } catch (e) { /* ignore */ } });
    fr.srcdoc = html;
    v.querySelector("#jtxPdf").addEventListener("click", () => { printHtml(html, fr); try { if (window.gtag) window.gtag("event", "numerology_pro_pdf", {}); } catch (e) { /* ignore */ } });
    v.querySelector("#jtxClose").addEventListener("click", () => { v.remove(); document.documentElement.classList.remove("jtx-on"); });
    if (window.JTRef && order.promo !== 100) window.JTRef.after("nm", order.lang);
    try {
      if (!order.delivered) {
        order.delivered = Date.now(); localStorage.setItem(KEY, JSON.stringify(order));
        if (window.gtag) window.gtag("event", "purchase", { value: order.promo === 100 ? 0 : order.promo === 50 ? 149 : order.ref ? 269 : 299, currency: "INR", items: [{ item_name: "Numerology report" }] });
      }
    } catch (e) { /* ignore */ }
  }

  function start() {
    if (window.JTCheckout && window.JTCheckout.enabled() && !window.__nmVerified) {
      window.JTCheckout.confirm("nm", (so, oid) => {
        order = { dob: so.dob, name: so.name, lang: so.lang || "hi", ts: Date.now(), oid, promo: Number(so.amount) === 0 ? 100 : 0 };
        try { localStorage.setItem(KEY, JSON.stringify(order)); } catch (e) { /* ignore */ }
        window.__nmVerified = true; start();
      }, order && order.lang);
      return;
    }
    const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    document.documentElement.classList.add("jtx-on");
    if (!order || !order.dob || !order.name) {
      help(T("भुगतान के लिए धन्यवाद 🙏", "Thank you for your payment 🙏"), T("इस फ़ोन/ब्राउज़र में आपका नाम और जन्मतिथि नहीं मिली (शायद भुगतान किसी दूसरे फ़ोन से हुआ)। WhatsApp पर अपना नाम भेजें — रिपोर्ट वहीं भेज दी जाएगी।", "We could not find your name and date of birth in this browser (perhaps you paid from another phone). Send your name on WhatsApp and we will send the report there."));
      return;
    }
    overlay(`<div class="jtx-spin" aria-hidden="true"></div><h2>${T("आपकी रिपोर्ट बन रही है…", "Your report is being prepared…")}</h2><p>${T(`भुगतान के लिए धन्यवाद, ${esc(order.name)} जी।`, `Thank you for your payment, ${esc(order.name)}.`)}</p>`);
    let tries = 0;
    (function wait() { if (window.JTNumPro && window.JT_NM && window.NM_CONTENT && window.NM_PRO && window.NM_PRO2) setTimeout(show, 500); else if (++tries < 60) setTimeout(wait, 150); else help(T("रिपोर्ट अपने-आप नहीं बन सकी", "The report could not be made automatically"), T("आपका भुगतान सुरक्षित है। WhatsApp पर संदेश भेजें।", "Your payment is safe. Please message us on WhatsApp.")); })();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 50)); else setTimeout(start, 50);
})();
