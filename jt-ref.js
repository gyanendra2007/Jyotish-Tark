/* ==========================================================================
   JYOTISH TARK — "दोस्त को भेजें" referral
   - A customer who received a paid report gets their own code (JTxxxxx) and a link.
   - A friend who opens that link (?ref=JTxxxxx) gets 10% off the automatic reports
     through the referral Cashfree forms below (the code is pre-noted for the
     "Referral code" field on that form).
   - 3 paid friends = 1 free report; claimed on WhatsApp (owner checks the
     "Referral code" column in Cashfree).
   No backend: codes live in localStorage on each phone.
   ========================================================================== */
window.JTRef = (function () {
  "use strict";
  // Set a form link once it exists in Cashfree; a product without a link shows no friend discount.
  const FORMS = {
    kp: { link: "https://payments.cashfree.com/forms/jyotishtarkkpref", price: 269, full: 299, name: "KP रिपोर्ट" },
    nm: { link: "https://payments.cashfree.com/forms/jyotishtarknumerologyref", price: 269, full: 299, name: "अंक ज्योतिष रिपोर्ट" },
    sampurna: { link: "https://payments.cashfree.com/forms/sampurnakundaliref", price: 991, full: 1101, name: "सम्पूर्ण कुंडली" }
  };
  const PAGE = { kp: "kp-astrology.html", nm: "numerology.html", sampurna: "kundali-form.html" };
  const WA = "918318513814";
  const RX = /^JT[A-HJ-NP-Z2-9]{5}$/;
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } } };
  function mine() {
    let c = ls.get("jt_ref_me");
    if (!c || !RX.test(c)) {
      const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const r = new Uint8Array(5);
      try { crypto.getRandomValues(r); } catch (e) { for (let i = 0; i < 5; i++) r[i] = Math.random() * 256; }
      c = "JT" + [...r].map((b) => A[b % A.length]).join(""); ls.set("jt_ref_me", c);
    }
    return c;
  }
  function capture() {
    let q = ""; try { q = (new URLSearchParams(location.search).get("ref") || "").toUpperCase().trim(); } catch (e) { /* */ }
    if (RX.test(q) && q !== ls.get("jt_ref_me")) { ls.set("jt_ref_in", JSON.stringify({ c: q, t: Date.now() })); try { if (window.gtag) window.gtag("event", "ref_open", { code: q }); } catch (e) { /* */ } }
  }
  function code() {
    try { const o = JSON.parse(ls.get("jt_ref_in") || "null"); if (o && RX.test(o.c) && Date.now() - o.t < 60 * 864e5 && o.c !== ls.get("jt_ref_me")) return o.c; } catch (e) { /* */ }
    return "";
  }
  const offer = (p) => (code() && FORMS[p] && FORMS[p].link ? FORMS[p] : null);
  const link = (p) => { const f = offer(p); return f ? f.link : null; };
  function note(p, lang) {
    const f = offer(p); if (!f) return "";
    const en = lang === "en";
    return `<div class="jtref-n">🎁 ${en ? `Friend's code <b>${code()}</b> applied — 10% off, only <b>₹${f.price}</b> <s>₹${f.full}</s>. ${window.JTCheckout && window.JTCheckout.enabled() ? "The discount applies automatically." : `On the payment page, write <b>${code()}</b> in “Referral code”.`}` : `मित्र का कोड <b>${code()}</b> लागू — 10% छूट, केवल <b>₹${f.price}</b> <s>₹${f.full}</s>। ${window.JTCheckout && window.JTCheckout.enabled() ? "छूट अपने-आप लगेगी।" : `भुगतान पेज पर “Referral code” में <b>${code()}</b> लिखें।`}`}</div>`;
  }
  const CSS = `.jtref-n{margin:10px 0;padding:10px 12px;border:1.5px dashed #4F9D63;border-radius:12px;background:#EEF8F0;color:#14532D;font-size:15px;line-height:1.5}
  .jtref{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:460px;margin:0 auto;background:#FFFBF2;border:2px solid #E6C98A;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.3);padding:14px 16px;color:#2B1810;font-family:Mukta,sans-serif}
  .jtref h4{margin:0 0 4px;font-size:18px;color:#7A1F1F}.jtref p{margin:4px 0;font-size:15px;line-height:1.45}
  .jtref .c{display:inline-block;font-weight:800;letter-spacing:1px;background:#7A1F1F;color:#fff;border-radius:8px;padding:2px 10px}
  .jtref .a{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.jtref .a a,.jtref .a button{flex:1 1 130px;min-height:44px;border:0;border-radius:10px;font:inherit;font-weight:700;cursor:pointer;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;padding:6px 10px}
  .jtref .w{background:#1F8F4E;color:#fff}.jtref .k{background:#F1E6CF;color:#5A1414}.jtref .x{position:absolute;top:6px;right:10px;background:none;border:0;font-size:22px;cursor:pointer;color:#7A1F1F}`;
  function css() { if (!document.getElementById("jtref-css")) { const s = document.createElement("style"); s.id = "jtref-css"; s.textContent = CSS; document.head.appendChild(s); } }
  // Called after a paid report has been delivered.
  function after(p, lang) {
    css();
    if (document.getElementById("jtref")) return;
    const me = mine(), en = lang === "en", url = `https://jyotishtark.in/${PAGE[p] || ""}?ref=${me}`;
    const any = Object.values(FORMS).some((f) => f.link);
    const msg = en ? `I got my ${p === "nm" ? "numerology" : "astrology"} report from Jyotish Tark. With my link you get 10% off: ${url}` : `मैंने ज्योतिष तर्क से अपनी ${FORMS[p] ? FORMS[p].name : "रिपोर्ट"} बनवाई। मेरे लिंक से आपको 10% छूट मिलेगी: ${url}`;
    const d = document.createElement("div"); d.className = "jtref"; d.id = "jtref"; d.setAttribute("role", "dialog");
    d.innerHTML = `<button class="x" type="button" aria-label="बंद करें">×</button>
      <h4>🎁 ${en ? "Share & get a free report" : "दोस्तों को भेजें, मुफ़्त रिपोर्ट पाएँ"}</h4>
      <p>${en ? "Your code" : "आपका कोड"}: <span class="c">${me}</span></p>
      <p>${any ? (en ? "Friends get <b>10% off</b>. When <b>3 friends</b> buy with your code, your next report is <b>free</b>." : "आपके लिंक से दोस्तों को <b>10% छूट</b>। <b>3 दोस्त</b> रिपोर्ट लें तो आपकी अगली रिपोर्ट <b>मुफ़्त</b>।") : (en ? "When <b>3 friends</b> buy with your link, your next report is <b>free</b>." : "आपके लिंक से <b>3 दोस्त</b> रिपोर्ट लें तो आपकी अगली रिपोर्ट <b>मुफ़्त</b>।")}</p>
      <div class="a"><a class="w" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}">WhatsApp ${en ? "share" : "पर भेजें"}</a><button class="k" type="button">${en ? "Copy link" : "लिंक कॉपी"}</button></div>
      <p style="font-size:13px;opacity:.8;margin-top:8px">${en ? "Reward claim" : "इनाम के लिए"}: <a href="https://wa.me/${WA}?text=${encodeURIComponent((en ? "My referral code is " : "मेरा रेफ़रल कोड ") + me + (en ? " — please check my 3 referrals." : " है — मेरे 3 रेफ़रल जाँच लें।"))}" target="_blank" rel="noopener">WhatsApp ${en ? "us" : "करें"}</a></p>`;
    d.querySelector(".x").addEventListener("click", () => d.remove());
    d.querySelector(".k").addEventListener("click", async (e) => { try { await navigator.clipboard.writeText(url); e.target.textContent = en ? "Copied ✓" : "कॉपी हो गया ✓"; } catch (er) { prompt("Link", url); } });
    setTimeout(() => document.body.appendChild(d), 2500);
    try { if (window.gtag) window.gtag("event", "ref_card", { product: p }); } catch (e) { /* */ }
  }
  capture();
  return { FORMS, mine, code, link, note, offer, after, css };
})();
