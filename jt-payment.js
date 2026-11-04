/* ==========================================================================
   JYOTISH TARK — KUNDALI PAYMENT SCREEN
   Default: ₹2,100 handmade kundali (order form on kundali-form.html).
   An order may carry its own amount / product / delivery (e.g. the ₹1,100
   sampurna kundali from sampurna-preview.js).
   Edit only the settings block below.
   ========================================================================== */
window.JT_PAY = Object.assign({
  upiId: "8318513814@ptsbi",          // from your QR code
  payeeName: "GYANENDRA SINGH TOMAR",
  amount: 2100,
  product: "हस्तनिर्मित कुंडली",
  delivery: "भुगतान मिलने के बाद ज्योतिषी ज्ञानेंद्र सिंह तोमर स्वयं आपकी कुंडली तैयार करके 5–7 दिन में WhatsApp व ईमेल पर भेजेंगे।",
  whatsapp: "918318513814",
  qrImage: "qr-code.png",
  // Optional: paste a Razorpay / Cashfree payment-page link here later.
  // When filled in, a "Pay online (Card / UPI / Net Banking)" button appears first.
  onlinePayLink: ""
}, window.JT_PAY || {});

(function () {
  "use strict";
  const P = window.JT_PAY;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isPhone = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  function newOrderId() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `JT${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rnd}`;
  }

  const amt = (o) => (o && o.amount) || P.amount;
  const inr = (n) => Number(n).toLocaleString("en-IN");

  function upiLink(orderId, amount) {
    // UPI apps expect the "@" in the UPI ID unencoded
    return `upi://pay?pa=${P.upiId}&pn=${encodeURIComponent(P.payeeName)}&am=${amount || P.amount}&cu=INR&tn=${encodeURIComponent("Kundali " + orderId)}`;
  }

  function whatsappText(o) {
    return [
      `🙏 Namaste Acharya ji — ₹${amt(o)} ${o.product || P.product} order`,
      `Order ID: ${o.orderId}`,
      `Name: ${o.name || "-"}`,
      `DOB: ${o.dob || "-"}  Time: ${o.tob || "-"}`,
      `Place: ${o.pob || "-"}`,
      `Phone: ${o.phone || "-"}  Email: ${o.email || "-"}`,
      ``,
      `I have paid ₹${amt(o)}. Payment screenshot attached.`
    ].join("\n");
  }

  const CSS = `
  .jtp{background:linear-gradient(135deg,#1e1b4b,#0f172a);border:1px solid rgba(251,191,36,.45);border-radius:1.1rem;padding:1.4rem;color:#f3f4f6;text-align:left;font-weight:400;font-size:1rem;line-height:1.55}
  .jtp h3{margin:0 0 .25rem;font-size:1.3rem;color:#fff;font-weight:700}
  .jtp .jtp-sub{margin:0 0 1rem;color:#cbd5e1;font-size:.95rem}
  .jtp .jtp-id{display:inline-block;font-family:ui-monospace,Consolas,monospace;background:rgba(251,191,36,.15);color:#fbbf24;border-radius:.4rem;padding:.1rem .5rem;font-weight:700}
  .jtp ol{margin:0;padding:0;list-style:none;display:grid;gap:1rem;counter-reset:s}
  .jtp li{display:grid;grid-template-columns:2rem 1fr;gap:.75rem;align-items:start;counter-increment:s}
  .jtp li::before{content:counter(s);width:2rem;height:2rem;border-radius:50%;background:#f59e0b;color:#1f2937;font-weight:800;display:flex;align-items:center;justify-content:center}
  .jtp .jtp-pay{display:flex;flex-wrap:wrap;gap:1rem;align-items:center}
  .jtp .jtp-qr{width:160px;height:160px;background:#fff;border-radius:.6rem;padding:.4rem;box-sizing:border-box;flex-shrink:0}
  .jtp .jtp-qr img{width:100%;height:100%;object-fit:contain;display:block}
  .jtp .jtp-amt{font-size:1.6rem;font-weight:800;color:#fbbf24}
  .jtp .jtp-upi{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:.35rem 0}
  .jtp code{font-family:ui-monospace,Consolas,monospace;background:#0b1222;border:1px solid #334155;border-radius:.4rem;padding:.3rem .55rem;color:#fff;word-break:break-all}
  .jtp .jtp-btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border:0;border-radius:999px;padding:.7rem 1.2rem;font-weight:700;cursor:pointer;text-decoration:none;font-size:.95rem;font-family:inherit}
  .jtp .jtp-gold{background:linear-gradient(135deg,#f59e0b,#d97706);color:#1f2937}
  .jtp .jtp-green{background:#16a34a;color:#fff}
  .jtp .jtp-ghost{background:transparent;color:#e2e8f0;border:1px solid #475569;padding:.35rem .8rem;font-size:.85rem}
  .jtp .jtp-note{font-size:.85rem;color:#94a3b8;margin:.4rem 0 0}
  .jtp .jtp-warn{font-size:.9rem;color:#fca5a5;margin:0 0 .9rem}
  .jtp .jtp-btn:focus-visible{outline:3px solid #fbbf24;outline-offset:2px}
  @media (max-width:520px){.jtp .jtp-qr{width:140px;height:140px}}
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
      ${opts.emailFailed ? `<p class="jtp-warn">ईमेल से विवरण नहीं जा सका — कोई बात नहीं, नीचे तीसरे चरण का WhatsApp संदेश आपका पूरा विवरण भेज देगा।</p>` : ""}
      <ol>
        <li><div>
          <b>₹${A} भुगतान करें</b>
          ${P.onlinePayLink ? `<div style="margin:.5rem 0"><a class="jtp-btn jtp-gold" href="${esc(P.onlinePayLink)}" target="_blank" rel="noopener">💳 ऑनलाइन भुगतान (Card / UPI / Net Banking)</a></div><p class="jtp-note">या UPI से सीधे:</p>` : ""}
          <div class="jtp-pay">
            <div class="jtp-qr"><img src="${esc(P.qrImage)}" alt="UPI QR code — ${esc(P.payeeName)}" width="160" height="160"></div>
            <div>
              <div class="jtp-amt">₹${A}</div>
              <div class="jtp-upi"><code id="jtpUpi">${esc(P.upiId)}</code><button type="button" class="jtp-btn jtp-ghost" id="jtpCopy">UPI ID कॉपी करें</button></div>
              ${isPhone() ? `<a class="jtp-btn jtp-gold" href="${esc(upiLink(order.orderId, amt(order)))}">📱 UPI ऐप से भुगतान करें</a>` : ""}
              <p class="jtp-note">GPay, PhonePe, Paytm या किसी भी UPI ऐप से QR स्कैन करें और राशि ₹${A} भरें।</p>
            </div>
          </div>
        </div></li>
        <li><div>
          <b>भुगतान का स्क्रीनशॉट WhatsApp पर भेजें</b>
          <p class="jtp-note" style="margin:.2rem 0 .6rem">आपका ऑर्डर नंबर और जन्म-विवरण संदेश में पहले से भरा होगा — बस स्क्रीनशॉट जोड़कर भेजें।</p>
          <a class="jtp-btn jtp-green" href="${esc(wa)}" target="_blank" rel="noopener">💬 WhatsApp पर भेजें</a>
        </div></li>
        <li><div>
          <b>आपकी कुंडली</b>
          <p class="jtp-note" style="margin:.2rem 0 0">${esc(order.delivery || P.delivery)}</p>
        </div></li>
      </ol>
    </div>`;
    const btn = host.querySelector("#jtpCopy");
    btn.addEventListener("click", () => {
      const done = () => { btn.textContent = "कॉपी हो गया ✓"; setTimeout(() => { btn.textContent = "UPI ID कॉपी करें"; }, 2500); };
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(host.querySelector("#jtpUpi")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(P.upiId).then(done, fallback);
      else fallback();
    });
    try { sessionStorage.setItem("jt-last-order", JSON.stringify(order)); } catch (e) { /* ignore */ }
    host.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.JTPay = { render, newOrderId, upiLink };
})();
