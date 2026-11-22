/* ==========================================================================
   JYOTISH TARK — verified checkout for the automatic reports
   The browser never decides that a report is paid. It asks our order backend
   (Google Apps Script, see tools/apps-script) to create a Cashfree order, opens
   Cashfree checkout, and after the customer returns asks the backend again;
   the report unlocks only if Cashfree says the order is PAID.
   Also: partner codes (?p=CODE), visitors outside India (USD prices), leads.
   Until API is set, pages keep using the old Cashfree payment forms.
   ========================================================================== */
window.JTCheckout = (function () {
  "use strict";
  const API = "https://script.google.com/macros/s/AKfycbw1dACJE9HKwOxwmsMlTJQWP3mQ2BsoIXme2FpHO1WnWut2O3_4slsNQkM1RlKCfgNr/exec"; // order backend (Apps Script). Empty = old payment forms.
  const SDK = "https://sdk.cashfree.com/js/v3/cashfree.js";
  const PRICES = { kp: { inr: 299, usd: 19 }, nm: { inr: 299, usd: 19 }, sampurna: { inr: 1101, usd: null }, prashna: { inr: 101, usd: 9 }, mobile: { inr: 199, usd: null }, vp: { inr: 299, usd: null } };
  const PAGE = { kp: "kp-astrology.html", nm: "numerology.html", sampurna: "kundali-form.html", prashna: "kundali-se-poochho.html", mobile: "mobile-number-numerology.html", vp: "mera-2027.html", rud: "rudraksha.html" };
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* */ } } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ga = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* */ } };
  const enabled = () => !!API;

  // ---------- visitors outside India ----------
  function nri() {
    const o = ls.get("jt_cur"); if (o === "USD") return true; if (o === "INR") return false;
    let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* */ }
    return !!tz && !/^Asia\/(Kolkata|Calcutta)$/.test(tz);
  }
  const currency = () => "INR"; // everyone pays in ₹; foreign cards are converted by the card's bank
  const USD_RATE = 94; // approx. ₹ per US$ (Nov 2026), only for the "about $" hint
  const price = (p, off) => { const c = currency(p), base = c === "USD" ? PRICES[p].usd : PRICES[p].inr, v = off ? (c === "USD" ? Math.round(base * (100 - off)) / 100 : Math.round(base * (100 - off) / 100)) : base; return { c, v, txt: c === "USD" ? "$" + v : "₹" + v.toLocaleString("en-IN"), base: c === "USD" ? "$" + base : "₹" + base.toLocaleString("en-IN") }; };
  const setCurrency = (c) => { ls.set("jt_cur", c); };

  // ---------- partner code (?p=CODE) ----------
  function capturePartner() {
    let q = ""; try { q = (new URLSearchParams(location.search).get("p") || "").toUpperCase().trim(); } catch (e) { /* */ }
    if (q === "OFF") { ls.set("jt_partner", ""); return; }  // ?p=off clears a saved partner code (handy for testing)
    if (!/^[A-Z0-9]{3,12}$/.test(q)) return;
    ls.set("jt_partner", JSON.stringify({ c: q, t: Date.now() }));
    ga("partner_open", { code: q });
    if (enabled()) checkPartner(q).then(banner).catch(() => { /* */ });
  }
  function checkPartner(code) {
    return post("partnerCheck", { code }).then((r) => {
      if (r && r.ok) { const o = { c: code, t: Date.now(), n: r.name, d: Number(r.discount) || 0 }; ls.set("jt_partner", JSON.stringify(o)); return o; }
      return null;
    });
  }
  // a slim strip so a visitor who came through a partner link sees the discount before paying
  const PAGE_PRODUCT = { "kp-astrology.html": "kp", "numerology.html": "nm", "kundali-form.html": "sampurna", "mobile-number-numerology.html": "mobile", "mera-2027.html": "vp", "kundali-se-poochho.html": "prashna" };
  function banner() {
    const pt = partner();
    if (!pt || !pt.d || document.getElementById("jcoBan") || /rudraksha/.test(location.pathname)) return; // partner discount is for reports only
    try { if (sessionStorage.getItem("jco_ban_x")) return; } catch (e) { /* */ }
    const en = document.documentElement.lang === "en", T = (h, e) => (en ? e : h);
    const prod = PAGE_PRODUCT[(location.pathname.split("/").pop() || "index.html")];
    const pr = prod ? price(prod, pt.d) : null;
    const st = document.createElement("style"); st.textContent = `.jco-ban{position:relative;z-index:60;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 10px;padding:9px 44px 9px 14px;background:linear-gradient(90deg,#14532D,#15803D);color:#fff;font:600 15px/1.4 Mukta,system-ui,sans-serif;text-align:center}.jco-ban b{color:#FDE68A}.jco-ban s{opacity:.75}.jco-ban button{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:8px;background:rgba(255,255,255,.15);color:#fff;font-size:18px;cursor:pointer}`;
    document.head.appendChild(st);
    const b = document.createElement("div"); b.id = "jcoBan"; b.className = "jco-ban"; b.setAttribute("role", "status");
    b.innerHTML = `<span>🎁 ${pt.n ? T(`${esc(pt.n)} जी के लिंक से —`, `Via ${esc(pt.n)} —`) : ""} ${T(`सभी रिपोर्ट पर <b>${pt.d}% छूट</b>`, `<b>${pt.d}% off</b> all reports`)}${pr ? T(` · इस पेज की रिपोर्ट <s>${pr.base}</s> <b>${pr.txt}</b>`, ` · this report <s>${pr.base}</s> <b>${pr.txt}</b>`) : ""} · ${T("भुगतान के समय अपने-आप लगेगी", "applied automatically at payment")}</span><button type="button" aria-label="${T("बंद करें", "Close")}">×</button>`;
    b.querySelector("button").addEventListener("click", () => { b.remove(); try { sessionStorage.setItem("jco_ban_x", "1"); } catch (e) { /* */ } });
    document.body.insertBefore(b, document.body.firstChild);
  }
  // a partner link counts for PARTNER_HOURS after it was opened; then the visitor sees normal prices again
  const PARTNER_HOURS = 24;
  function partner() { try { const o = JSON.parse(ls.get("jt_partner") || "null"); if (o && o.c && Date.now() - o.t < PARTNER_HOURS * 36e5) return o; if (o) ls.set("jt_partner", ""); } catch (e) { /* */ } return null; }

  // ---------- backend ----------
  function post(action, body) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(Object.assign({ action }, body || {})) }).then((r) => r.json());
  }
  const verify = (oid) => post("verify", { order_id: oid });
  const lookup = (oid, phone) => post("lookup", { order_id: oid, phone });
  const lead = (type, data) => { if (!enabled()) return Promise.resolve(); return post("lead", Object.assign({ type, page: location.pathname }, data || {})).catch(() => { /* */ }); };
  function loadSdk() {
    return new Promise((res, rej) => {
      if (window.Cashfree) return res(window.Cashfree);
      const s = document.createElement("script"); s.src = SDK; s.onload = () => res(window.Cashfree); s.onerror = () => rej(new Error("sdk")); document.head.appendChild(s);
    });
  }

  // ---------- contact modal + pay ----------
  const CSS = `.jco{position:fixed;inset:0;z-index:2147483100;background:rgba(20,10,5,.7);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Mukta,system-ui,sans-serif}
  .jco-c{width:100%;max-width:440px;background:#FBF6EC;border:3px double #B8892B;border-radius:16px;padding:20px;color:#2B1810;max-height:92vh;overflow:auto}
  .jco-c h3{margin:0 0 4px;color:#7A1F1F;font-size:21px}.jco-c p{margin:4px 0 10px;font-size:15px;line-height:1.5;color:#4A3628}
  .jco-c label{display:block;font-weight:600;font-size:15px;margin:8px 0 2px}.jco-c input,.jco-c textarea{width:100%;font:inherit;font-size:16px;border:1.5px solid #D9C6A0;border-radius:10px;padding:.55rem .75rem;min-height:46px;background:#fff;color:#2B1810;box-sizing:border-box}
  .jco-b{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}.jco-b button{flex:1 1 140px;min-height:48px;border:0;border-radius:10px;font:inherit;font-weight:700;font-size:16px;cursor:pointer;background:#7A1F1F;color:#fff}.jco-b button.l{background:#fff;color:#7A1F1F;border:1.5px solid #7A1F1F}
  .jco-e{color:#B42318;font-weight:600;min-height:1.2em}.jco-p{font-size:26px;font-weight:800;color:#7A1F1F}.jco-p s{font-size:16px;color:#8A7A6A;font-weight:500;margin-left:6px}
  .jco-s{width:42px;height:42px;margin:6px auto 14px;border:4px solid #E9D9B4;border-top-color:#7A1F1F;border-radius:50%;animation:jcos 1s linear infinite}@keyframes jcos{to{transform:rotate(360deg)}}.jco-c.ctr{text-align:center}.jco-c a.wa{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:8px 16px;border-radius:10px;background:#15803D;color:#fff;font-weight:700;text-decoration:none;margin-top:6px}
  .jco-cd{display:flex;gap:8px}.jco-cd input{flex:1;text-transform:uppercase}.jco-cd button{flex:0 0 auto;min-height:46px;padding:0 16px;border:1.5px solid #7A1F1F;border-radius:10px;background:#fff;color:#7A1F1F;font:inherit;font-weight:700;cursor:pointer}.jco-cm{min-height:1.1em;font-size:14px!important;margin:4px 0 0!important;font-weight:600;color:#14532D!important}
  .jco-cur{font-size:13px;margin-top:6px}.jco-cur a{color:#7A1F1F;cursor:pointer;text-decoration:underline}`;
  function css() { if (!document.getElementById("jco-css")) { const s = document.createElement("style"); s.id = "jco-css"; s.textContent = CSS; document.head.appendChild(s); } }

  /* pay(product, details, opts)
     details: {name, dob, time, place, lat, lng, gender, marital, lang, extra}
     opts: {promo, title, question(true = ask for a question), lang} */
  function pay(product, d, opts) {
    opts = opts || {}; css();
    const en = (opts.lang || d.lang) === "en", T = (h, e) => (en ? e : h);
    const ref = window.JTRef ? window.JTRef.code() : "", own = window.JTRef ? (ls.get("jt_ref_me") || "") : "", pt = partner();
    // one discount at a time: promo code > partner code > friend referral (the server applies the same order)
    const st = { promo: opts.promo || "", promoOff: 0, pt: pt && pt.d != null ? pt : null };
    const curOff = () => (st.promo ? st.promoOff : st.pt ? st.pt.d : ref ? 10 : 0);
    const off = curOff();
    const pr = price(product, off), saved = JSON.parse(ls.get("jt_contact") || "{}");
    const ov = document.createElement("div"); ov.className = "jco"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.innerHTML = `<div class="jco-c"><h3>${esc(opts.title || T("भुगतान", "Payment"))}</h3>
      <div data-price></div>
      ${opts.promo ? "" : `<label for="jcoCd">${T("कूपन / पार्टनर कोड (अगर है)", "Coupon / partner code (if any)")}</label><div class="jco-cd"><input id="jcoCd" type="text" autocomplete="off" autocapitalize="characters" maxlength="20" placeholder="${T("जैसे DEV20", "e.g. DEV20")}" value="${esc(st.pt ? st.pt.c : "")}"><button type="button" data-cd>${T("लागू करें", "Apply")}</button></div><p class="jco-cm" aria-live="polite"></p>`}
      ${nri() ? `<p class="jco-cur">${T(`विदेश से? कीमत ₹ में है (लगभग $${Math.max(1, Math.round(pr.v / USD_RATE))})। NRE/NRO खाते वाला UPI — विदेशी मोबाइल नंबर पर भी — या भारतीय कार्ड से भुगतान करें। केवल विदेशी कार्ड हो तो <a href="https://wa.me/918318513814?text=${encodeURIComponent("नमस्ते, मैं विदेश से रिपोर्ट लेना चाहता/चाहती हूँ — भुगतान का तरीका बताएँ।")}" target="_blank" rel="noopener">WhatsApp करें</a>।`, `Abroad? The price is in ₹ (about $${Math.max(1, Math.round(pr.v / USD_RATE))}). Pay with UPI from an NRE/NRO account — international mobile numbers work too — or an Indian card. Only have a foreign card? <a href="https://wa.me/918318513814?text=${encodeURIComponent("Hello, I am abroad and want a report. How can I pay?")}" target="_blank" rel="noopener">WhatsApp us</a>.`)}</p>` : ""}
      ${opts.question ? `<label for="jcoQ">${T("आपका प्रश्न", "Your question")}</label><textarea id="jcoQ" rows="3" maxlength="600" placeholder="${T("जैसे: मेरी सरकारी नौकरी कब लगेगी?", "e.g. When will I get a government job?")}"></textarea>` : ""}
      <label for="jcoPh">${T("मोबाइल नंबर (WhatsApp)", "Mobile number (WhatsApp)")}</label><input id="jcoPh" type="tel" inputmode="tel" autocomplete="tel" placeholder="${pr.c === "USD" ? "+1 415 555 0100" : "98XXXXXXXX"}" value="${esc(saved.p || "")}">
      <label for="jcoEm">${T("ईमेल (रसीद के लिए, वैकल्पिक)", "Email (for the receipt, optional)")}</label><input id="jcoEm" type="email" autocomplete="email" value="${esc(saved.e || "")}">
      <p class="jco-e" aria-live="polite"></p>
      <div class="jco-b"><button type="button" class="l" data-x>${T("रद्द करें", "Cancel")}</button><button type="button" data-go>${T("भुगतान पर जाएँ", "Continue to pay")}</button></div>
      <p style="font-size:13px;margin-top:10px">${T("Cashfree का सुरक्षित पेज — UPI, कार्ड, नेट बैंकिंग। भुगतान के बाद आप अपने-आप इसी पेज पर लौटेंगे।", "Secure Cashfree checkout — UPI, cards, net banking. You return here automatically after paying.")}</p></div>`;
    document.body.appendChild(ov);
    const err = ov.querySelector(".jco-e"), go = ov.querySelector("[data-go]");
    const priceBox = ov.querySelector("[data-price]"), cdIn = ov.querySelector("#jcoCd"), cdMsg = ov.querySelector(".jco-cm");
    const showPrice = () => {
      const o = curOff(), p2 = price(product, o);
      const why = st.promo ? (st.promoOff ? T(`प्रोमो कोड — ${o}% छूट`, `Promo code — ${o}% off`) : T("प्रोमो कोड लागू होगा।", "Your promo code will be applied.")) : st.pt ? T(`पार्टनर कोड ${esc(st.pt.c)} — ${o}% छूट`, `Partner code ${esc(st.pt.c)} — ${o}% off`) : ref ? T(`मित्र का कोड ${esc(ref)} — 10% छूट`, `Friend's code ${esc(ref)} — 10% off`) : "";
      priceBox.innerHTML = (opts.promo && !st.promoOff ? "" : `<div class="jco-p">${o >= 100 ? T("मुफ़्त", "Free") : p2.txt}${o ? `<s>${p2.base}</s>` : ""}</div>`) + (why ? `<p>${why}</p>` : "");
    };
    showPrice();
    // checks a typed code: our promo codes first (checked locally by hash), then partner codes (server)
    async function applyCode() {
      if (!cdIn) return true;
      const c = cdIn.value.trim().toUpperCase().replace(/\s+/g, "");
      cdMsg.textContent = "";
      if (!c) { st.promo = ""; st.promoOff = 0; showPrice(); return true; }
      if (st.pt && st.pt.c === c && !st.promo) { showPrice(); return true; }
      const po = window.JTPromo ? await window.JTPromo.check(c) : 0;
      if (po) { st.promo = c; st.promoOff = po; showPrice(); cdMsg.textContent = T("✓ कोड लागू हो गया।", "✓ Code applied."); return true; }
      cdMsg.textContent = T("जाँच रहे हैं…", "Checking…");
      let o = null; try { o = await checkPartner(c); } catch (e) { o = null; }
      if (o) { st.promo = ""; st.promoOff = 0; st.pt = o; showPrice(); cdMsg.textContent = T(`✓ ${o.n ? esc(o.n) + " जी का " : ""}कोड लागू हो गया।`, `✓ ${o.n ? esc(o.n) + "'s " : ""}code applied.`); ga("partner_code_typed", { code: c }); return true; }
      if (!window.JTPromo) { st.promo = c; st.promoOff = 0; st.pt = null; showPrice(); cdMsg.textContent = T("कोड भुगतान शुरू करते समय जाँचा जाएगा।", "The code will be checked when you continue."); return true; }
      cdMsg.textContent = T("यह कोड मान्य नहीं है।", "This code is not valid."); return false;
    }
    if (cdIn) {
      ov.querySelector("[data-cd]").addEventListener("click", applyCode);
      cdIn.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } });
      if (pt && pt.d == null) checkPartner(pt.c).then((o) => { if (o && !st.promo) { st.pt = o; showPrice(); } }).catch(() => { /* */ });
    }
    ov.querySelector("[data-x]").addEventListener("click", () => ov.remove());
    ov.querySelectorAll("[data-c]").forEach((a) => a.addEventListener("click", () => { setCurrency(a.dataset.c); ov.remove(); pay(product, d, opts); }));
    go.addEventListener("click", async () => {
      const phone = ov.querySelector("#jcoPh").value.trim(), email = ov.querySelector("#jcoEm").value.trim(), q = opts.question ? ov.querySelector("#jcoQ").value.trim() : "";
      const digits = phone.replace(/\D/g, "");
      if (opts.question && q.length < 5) { err.textContent = T("कृपया अपना प्रश्न लिखें।", "Please write your question."); return; }
      if (!(digits.length === 10 || (phone.startsWith("+") && digits.length >= 8) || (digits.length === 12 && digits.startsWith("91")))) { err.textContent = T("कृपया सही मोबाइल नंबर लिखें (विदेश का नंबर + के साथ)।", "Please enter a valid mobile number (international with +)."); return; }
      if (cdIn && cdIn.value.trim() && !(await applyCode())) return;
      ls.set("jt_contact", JSON.stringify({ p: phone, e: email }));
      go.disabled = true; go.textContent = T("कृपया रुकें…", "Please wait…"); err.textContent = "";
      const extra = Object.assign({}, d.extra || {}, q ? { question: q } : {});
      let r;
      try { r = await post("create", { product, currency: pr.c, name: d.name, phone, email, dob: d.dob, time: d.time, place: d.place, lat: d.lat, lng: d.lng, gender: d.gender, marital: d.marital, lang: d.lang, promo: st.promo || "", ref: !st.promo && !st.pt ? ref : "", partner: !st.promo && st.pt ? st.pt.c : "", own, extra }); }
      catch (e) { r = { ok: false, error: "network" }; }
      if (!r || !r.ok) {
        go.disabled = false; go.textContent = T("भुगतान पर जाएँ", "Continue to pay");
        err.textContent = r && r.error === "unknown product" ? T("यह रिपोर्ट अभी सर्वर पर चालू नहीं हुई है — कृपया WhatsApp करें: 83185 13814", "This report is not live on the server yet — please WhatsApp +91 83185 13814.") : r && r.error === "promo" ? T("यह प्रोमो कोड मान्य नहीं है।", "This promo code is not valid.") : r && r.error === "phone" ? T("मोबाइल नंबर सही नहीं है।", "The mobile number is not valid.") : r && r.error === "cashfree" && r.currency === "USD" ? T("USD भुगतान अभी उपलब्ध नहीं — ₹ में भुगतान करें (विदेशी कार्ड भी चलते हैं)।", "USD checkout is not available right now — please pay in ₹ (international cards work).") : T("भुगतान शुरू नहीं हो सका। दोबारा कोशिश करें या WhatsApp करें: 83185 13814", "Could not start the payment. Try again or WhatsApp +91 83185 13814.");
        ga("checkout_error", { product, e: r && r.error });
        return;
      }
      ga("begin_checkout", { value: r.amount || 0, currency: r.currency || pr.c, items: [{ item_name: product }] });
      if (r.free) { location.href = `${PAGE[product]}?jtpaid=${product}&order_id=${encodeURIComponent(r.order_id)}`; return; }
      try { const cf = (await loadSdk())({ mode: r.mode === "sandbox" ? "sandbox" : "production" }); cf.checkout({ paymentSessionId: r.payment_session_id, redirectTarget: "_self" }); }
      catch (e) { go.disabled = false; go.textContent = T("भुगतान पर जाएँ", "Continue to pay"); err.textContent = T("भुगतान पेज नहीं खुल सका — इंटरनेट जाँचें।", "Checkout could not open — check your connection."); }
    });
    setTimeout(() => { const f = ov.querySelector(opts.question ? "#jcoQ" : "#jcoPh"); if (f) f.focus(); }, 50);
  }

  /* After Cashfree sends the customer back (?jtpaid=…&order_id=…): confirm with the backend,
     then call onPaid(order, orderId) with the birth details saved at checkout. */
  function confirm(product, onPaid, lang) {
    css();
    const en = lang === "en", T = (h, e) => (en ? e : h), oid = orderParam();
    let tries = 0;
    const ov = document.createElement("div"); ov.className = "jco"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov);
    const waL = (t) => `https://wa.me/918318513814?text=${encodeURIComponent(t)}`;
    const show = (h) => { ov.innerHTML = `<div class="jco-c ctr" aria-live="polite">${h}</div>`; };
    const fail = (title, msg) => { show(`<h3>${title}</h3><p>${msg}</p><div class="jco-b"><button type="button" data-r>${T("दोबारा जाँचें", "Check again")}</button></div><a class="wa" href="${waL(T(`नमस्ते, मैंने भुगतान किया है पर रिपोर्ट नहीं खुली। ऑर्डर: ${oid || "—"}`, `Hello, I paid but the report did not open. Order: ${oid || "—"}`))}" target="_blank" rel="noopener">WhatsApp ${T("पर मदद", "for help")}</a>`); const b = oid && ov.querySelector("[data-r]"); if (!oid && ov.querySelector("[data-r]")) ov.querySelector("[data-r]").remove(); if (b) b.addEventListener("click", () => { tries = 0; run(); }); };
    if (!oid) { fail(T("भुगतान की पुष्टि नहीं हो सकी", "Payment could not be confirmed"), T("इस लिंक में ऑर्डर नंबर नहीं है। अगर आपका पैसा कटा है तो भुगतान का स्क्रीनशॉट WhatsApp पर भेजें — रिपोर्ट तुरंत भेज दी जाएगी।", "This link has no order number. If money was deducted, send the payment screenshot on WhatsApp and we will send the report right away.")); return; }
    const run = () => {
      show(`<div class="jco-s" aria-hidden="true"></div><h3>${T("भुगतान की पुष्टि हो रही है…", "Confirming your payment…")}</h3><p>${T("कृपया यह पेज बंद न करें।", "Please keep this page open.")}</p>`);
      verify(oid).then((r) => {
        if (r && r.ok && r.paid) { ov.remove(); ga("purchase_verified", { product, transaction_id: oid }); try { const k = "jt-buy-" + oid; if (!localStorage.getItem(k)) { localStorage.setItem(k, "1"); const o = r.order || {}, amt = Number(o.amount) || ((PRICES[product] || {}).inr || 0); if (amt > 0) ga("purchase", { transaction_id: oid, value: amt, currency: o.currency || "INR", items: [{ item_name: product, price: amt, quantity: 1 }] }); } } catch (e) { /* ignore */ } onPaid(r.order, oid); return; }
        if (r && r.ok === false) { fail(T("यह ऑर्डर नहीं मिला", "Order not found"), T("इस ऑर्डर नंबर का कोई भुगतान नहीं मिला। अगर आपका पैसा कटा है तो भुगतान का स्क्रीनशॉट WhatsApp पर भेजें।", "No payment was found for this order number. If money was deducted, send the payment screenshot on WhatsApp.")); return; }
        if (tries++ < 5) { setTimeout(run, 3000); return; }
        fail(T("भुगतान अभी पूरा नहीं हुआ", "Payment not completed yet"), T("Cashfree से अभी भुगतान की पुष्टि नहीं मिली। कुछ मिनट बाद “दोबारा जाँचें” दबाएँ। पैसा कट गया हो तो WhatsApp करें।", "Cashfree has not confirmed the payment yet. Tap “Check again” in a few minutes. If money was deducted, WhatsApp us."));
      }).catch(() => { if (tries++ < 5) setTimeout(run, 3000); else fail(T("इंटरनेट की समस्या", "Connection problem"), T("पुष्टि नहीं हो सकी — इंटरनेट जाँचकर दोबारा कोशिश करें।", "Could not confirm — check your connection and try again.")); });
    };
    run();
  }
  const orderParam = () => { try { return new URLSearchParams(location.search).get("order_id") || ""; } catch (e) { return ""; } };

  capturePartner();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner); else banner();
  /* start(product, body) — create the order and open Cashfree straight away (for pages that collect
     the contact details themselves, e.g. the rudraksha order form). Resolves with the server reply
     when no redirect happens (error, cod, free). */
  async function start(product, b) {
    let r;
    try { r = await post("create", Object.assign({ product, currency: "INR" }, b)); } catch (e) { r = { ok: false, error: "network" }; }
    if (!r || !r.ok || r.cod || r.free) return r;
    ga("begin_checkout", { value: r.amount || 0, currency: "INR", items: [{ item_name: product }] });
    try { const cf = (await loadSdk())({ mode: r.mode === "sandbox" ? "sandbox" : "production" }); cf.checkout({ paymentSessionId: r.payment_session_id, redirectTarget: "_self" }); return Object.assign({ redirect: true }, r); }
    catch (e) { return { ok: false, error: "sdk" }; }
  }
  return { API, enabled, pay, start, confirm, verify, lookup, lead, post, price, currency, nri, setCurrency, partner, checkPartner, orderParam, PRICES };
})();
