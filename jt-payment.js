/* ==========================================================================
   JYOTISH TARK — KUNDALI PAYMENT SCREEN
   All payments go through Cashfree payment forms (no direct UPI ID / QR).
   Default: ₹2,100 handmade kundali (order form on kundali-form.html).
   An order may carry its own amount / product / delivery (e.g. the ₹1,101
   sampurna kundali from sampurna-preview.js).
   Edit only the settings block below.
   ========================================================================== */
window.JT_PAY = Object.assign({
  amount: 2100,
  product: "हस्तनिर्मित कुंडली",
  delivery: "भुगतान मिलने के बाद ज्योतिषी ज्ञानेंद्र सिंह तोमर स्वयं आपकी कुंडली तैयार करके 5–7 दिन में WhatsApp व ईमेल पर भेजेंगे।",
  whatsapp: "918318513814",
  // Cashfree payment form for the default product (an order may carry its own payLink)
  onlinePayLink: "https://payments.cashfree.com/forms/handmadekundali"
}, window.JT_PAY || {});

(function () {
  "use strict";
  const P = window.JT_PAY;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function newOrderId() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `JT${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rnd}`;
  }

  const amt = (o) => (o && o.amount) || P.amount;
  // per-order link (e.g. Cashfree form for the sampurna kundali); the global link only for the default product
  const payLink = (o) => (o && o.payLink) || P.onlinePayLink;
  const inr = (n) => Number(n).toLocaleString("en-IN");

  function whatsappText(o) {
    return [
      `🙏 Namaste Acharya ji — ₹${amt(o)} ${o.product || P.product} order`,
      `Order ID: ${o.orderId}`,
      `Name: ${o.name || "-"}`,
      `DOB: ${o.dob || "-"}  Time: ${o.tob || "-"}`,
      `Place: ${o.pob || "-"}`,
      `Phone: ${o.phone || "-"}  Email: ${o.email || "-"}`,
      ``,
      `Paid online through Cashfree (order ID entered in the payment form).`
    ].concat(o.adminLink ? ["", `रिपोर्ट लिंक (ज्योतिष तर्क उपयोग हेतु): ${o.adminLink}`] : []).join("\n");
  }

  const CSS = `
  .jtp{background:linear-gradient(135deg,#1e1b4b,#0f172a);border:1px solid rgba(251,191,36,.45);border-radius:1.1rem;padding:1.4rem;color:#f3f4f6;text-align:left;font-weight:400;font-size:1rem;line-height:1.55}
  .jtp h3{margin:0 0 .25rem;font-size:1.3rem;color:#fff;font-weight:700}
  .jtp .jtp-sub{margin:0 0 1rem;color:#cbd5e1;font-size:.95rem}
  .jtp .jtp-id{display:inline-block;font-family:ui-monospace,Consolas,monospace;background:rgba(251,191,36,.15);color:#fbbf24;border-radius:.4rem;padding:.1rem .5rem;font-weight:700}
  .jtp ol{margin:0;padding:0;list-style:none;display:grid;gap:1rem;counter-reset:s}
  .jtp li{display:grid;grid-template-columns:2rem 1fr;gap:.75rem;align-items:start;counter-increment:s}
  .jtp li::before{content:counter(s);width:2rem;height:2rem;border-radius:50%;background:#f59e0b;color:#1f2937;font-weight:800;display:flex;align-items:center;justify-content:center}
  .jtp .jtp-amt{font-size:1.6rem;font-weight:800;color:#fbbf24}
  .jtp code{font-family:ui-monospace,Consolas,monospace;background:#0b1222;border:1px solid #334155;border-radius:.4rem;padding:.3rem .55rem;color:#fff;word-break:break-all}
  .jtp .jtp-btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border:0;border-radius:999px;padding:.7rem 1.2rem;font-weight:700;cursor:pointer;text-decoration:none;font-size:.95rem;font-family:inherit}
  .jtp .jtp-gold{background:linear-gradient(135deg,#f59e0b,#d97706);color:#1f2937}
  .jtp .jtp-green{background:#16a34a;color:#fff}
  .jtp .jtp-ghost{background:transparent;color:#e2e8f0;border:1px solid #475569;padding:.35rem .8rem;font-size:.85rem}
  .jtp .jtp-note{font-size:.85rem;color:#94a3b8;margin:.4rem 0 0}
  .jtp .jtp-warn{font-size:.9rem;color:#fca5a5;margin:0 0 .9rem}
  .jtp .jtp-btn:focus-visible{outline:3px solid #fbbf24;outline-offset:2px}
  `;
  function css() {
    if (document.getElementById("jtp-css")) return;
    const s = document.createElement("style"); s.id = "jtp-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  // host: element to fill; order: {orderId,name,dob,tob,pob,phone,email}; opts: {emailFailed:bool}
  function render(host, order, opts) {
    css();
    opts = opts || {};
    const wa = `https://wa.me/${P.whatsapp}?text=${encodeURIComponent(whatsappText(order))}`;
    const A = inr(amt(order));
    host.innerHTML = `<div class="jtp" role="region" aria-label="₹${A} भुगतान">
      <h3>✅ ${esc(order.product || P.product)} — अब ₹${A} का भुगतान करें</h3>
      <p class="jtp-sub">ऑर्डर नंबर <span class="jtp-id">${esc(order.orderId)}</span> — इसे संभाल कर रखें।</p>
      ${opts.emailFailed ? `<p class="jtp-warn">ईमेल से विवरण नहीं जा सका — कोई बात नहीं, भुगतान फ़ॉर्म में भरा जन्म विवरण हम तक पहुँच जाएगा।</p>` : ""}
      <ol>
        <li><div>
          <b>₹${A} का सुरक्षित ऑनलाइन भुगतान करें</b>
          <div class="jtp-amt" style="margin:.2rem 0 .5rem">₹${A}</div>
          <a class="jtp-btn jtp-gold" id="jtpOnline" href="${esc(payLink(order))}" target="_blank" rel="noopener">💳 भुगतान करें — Card / UPI / Net Banking</a>
          <p class="jtp-note">Cashfree का सुरक्षित पेमेंट पेज खुलेगा। उसमें अपना नाम, फ़ोन, जन्म विवरण और ऑर्डर नंबर <b>${esc(order.orderId)}</b> भरें। भुगतान की रसीद आपके ईमेल पर आएगी — स्क्रीनशॉट भेजने की ज़रूरत नहीं।</p>
        </div></li>
        <li><div>
          <b>आपकी ${esc(order.product || P.product)}</b>
          <p class="jtp-note" style="margin:.2rem 0 .6rem">${esc(order.delivery || P.delivery)}</p>
          <a class="jtp-btn jtp-ghost" href="${esc(wa)}" target="_blank" rel="noopener">💬 ऑर्डर विवरण WhatsApp पर भेजें (वैकल्पिक)</a>
        </div></li>
      </ol>
    </div>`;
    host.querySelector("#jtpOnline").addEventListener("click", () => {
      try { if (window.gtag) window.gtag("event", "cashfree_open", { value: amt(order), currency: "INR", item_name: order.product || P.product }); } catch (e) { /* ignore */ }
    });
    try { sessionStorage.setItem("jt-last-order", JSON.stringify(order)); } catch (e) { /* ignore */ }
    host.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.JTPay = { render, newOrderId };
})();
