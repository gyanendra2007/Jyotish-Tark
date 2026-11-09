/* ==========================================================================
   JYOTISH TARK — PROMO CODES for the automatic paid reports
   (KP report, numerology report, sampurna kundali).
   Codes are stored only as SHA-256 hashes. To add or change a code, put the
   SHA-256 of the UPPER-CASE code in CODES with its discount (100 or 50).
     100 → the report is made at once, no payment.
     50  → the customer is sent to the half-price Cashfree form below.
   window.JTPromo.ui(host, product, onApply) draws a small "promo code" box.
   ========================================================================== */
window.JTPromo = (function () {
  "use strict";
  const CODES = {
    "b251f8f5de603aadf41602d17bdae5808745d0b637d6bc9f3275019d7878ca6a": 100,  // 100% code
    "507efaff3ce065c845ce1e303142f09f325fb7dfa848cfaeb6c93e3107e89fec": 50,   // 50% code
    "f0bc24ddac32c6f318381a0fec3ae4e09d23557a0ef3049d0f7b9bb2835da189": 100   // owner's earlier KP code
  };
  const HALF = {
    kp: { link: "https://payments.cashfree.com/forms/jyotishtarkkp50", price: 149, full: 299 },
    nm: { link: "https://payments.cashfree.com/forms/jyotishtarknumerology50", price: 149, full: 299 },
    sampurna: { link: "https://payments.cashfree.com/forms/sampurnakundali50", price: 550, full: 1101 }
  };
  async function sha256(t) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  async function check(code) {
    const c = String(code || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!c) return 0;
    try { return CODES[await sha256(c)] || 0; } catch (e) { return 0; }
  }
  const CSS = `.jtpr{margin-top:12px;border-top:1px dashed #D9C6A0;padding-top:8px;text-align:left}
  .jtpr summary{cursor:pointer;font-weight:600;color:#7A1F1F;min-height:40px;display:flex;align-items:center}
  .jtpr form{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
  .jtpr input{flex:1 1 160px;padding:10px 12px;border:1px solid #B9A88E;border-radius:10px;font:inherit;font-size:16px;text-transform:uppercase;min-height:46px;background:#fff;color:#2B1810}
  .jtpr button{min-height:46px;padding:8px 16px;border:0;border-radius:10px;background:#7A1F1F;color:#fff;font:inherit;font-weight:700;cursor:pointer}
  .jtpr p{margin:6px 0 0;font-weight:600;color:#4A3628}
  .sp-cta .jtpr{max-width:420px;margin:14px auto 0;border-top-color:rgba(241,217,154,.5)}.sp-cta .jtpr summary{color:#F1D99A}.sp-cta .jtpr p{color:#FBF6EC}.sp-cta .jtpr button{background:#F1D99A;color:#5A1414}`;
  function ui(host, product, onApply, lang) {
    if (!host) return;
    if (!document.getElementById("jtpr-css")) { const s = document.createElement("style"); s.id = "jtpr-css"; s.textContent = CSS; document.head.appendChild(s); }
    const en = lang === "en", T = (h, e) => (en ? e : h);
    host.innerHTML = `<details class="jtpr"><summary>${T("प्रोमो कोड है?", "Have a promo code?")}</summary>
      <form novalidate><input name="c" type="text" autocomplete="off" aria-label="${T("प्रोमो कोड", "Promo code")}" placeholder="${T("प्रोमो कोड", "Promo code")}"><button type="submit">${T("लागू करें", "Apply")}</button></form>
      <p aria-live="polite"></p></details>`;
    const f = host.querySelector("form"), msg = host.querySelector("p");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const off = await check(f.c.value);
      if (!f.c.value.trim()) { msg.textContent = T("कृपया कोड लिखें।", "Please enter a code."); return; }
      if (!off) { msg.textContent = T("यह कोड मान्य नहीं है।", "This code is not valid."); return; }
      const h = HALF[product];
      msg.textContent = off === 100 ? T("कोड सही है — 100% छूट।", "Code accepted — 100% off.") : T(`कोड सही है — 50% छूट, अब केवल ₹${h.price}।`, `Code accepted — 50% off, now only ₹${h.price}.`);
      try { if (window.gtag) window.gtag("event", "promo_apply", { product, off }); } catch (er) { /* ignore */ }
      const r = onApply(off, h, msg);
      if (r === false) return;
      if (off === 50) setTimeout(() => { location.href = h.link; }, 600);
    });
  }
  return { check, ui, HALF };
})();
