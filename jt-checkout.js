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
  // ---- UPI (Cashfree closed our account in Nov 2026; customers now pay straight to this UPI ID) ----
  // the UPI ID itself is set once, at the top of jt-site.js (window.JT_UPI)
  const upiCfg = () => window.JT_UPI || { id: "", name: "Jyotish Tark" };
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
  .jco-upi{text-align:center}.jco-upi .qr{display:inline-block;padding:8px;background:#fff;border:1px solid #D9C6A0;border-radius:12px;margin:6px 0}.jco-upi .qr svg{display:block;width:200px;height:200px}
  .jco-upi a.app{display:flex;align-items:center;justify-content:center;min-height:50px;border-radius:10px;background:#7A1F1F;color:#fff;font-weight:700;font-size:17px;text-decoration:none;margin:8px 0 4px}
  .jco-upi .id{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:15px;margin:4px 0}.jco-upi .id code{font-size:16px;font-weight:700;background:#fff;border:1px dashed #B8892B;border-radius:8px;padding:4px 10px;user-select:all}
  .jco-upi .id button{border:1.5px solid #7A1F1F;background:#fff;color:#7A1F1F;border-radius:8px;padding:4px 10px;font:inherit;font-weight:700;cursor:pointer}
  .jco-upi .st{margin:14px 0 4px;padding-top:12px;border-top:1px dashed #D9C6A0;text-align:left}.jco-upi .sm{font-size:13px!important;color:#6B5444!important}
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
      <p style="font-size:13px;margin-top:10px">${T("सुरक्षित ऑनलाइन भुगतान। भुगतान की पुष्टि के बाद रिपोर्ट इसी वेबसाइट पर खुलेगी।", "Secure online payment. Your report opens on this website once the payment is confirmed.")}</p></div>`;
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
        // server problem → still let the customer pay by UPI and send the screenshot on WhatsApp (we send the report)
        if (window.JTUPIBox && !(r && /^(phone|name|promo|item|partner)$/.test(String(r.error || "")))) {
          const nm = { kp: "KP रिपोर्ट", nm: "अंक ज्योतिष रिपोर्ट", sampurna: "सम्पूर्ण कुंडली", prashna: "एक प्रश्न", mobile: "मोबाइल नंबर रिपोर्ट", vp: "वर्षफल 2027 रिपोर्ट" }[product] || product;
          const amt = price(product, curOff()).v;
          const msg = `नमस्ते, मैंने ${nm} के लिए ₹${amt} UPI से भेजे हैं (स्क्रीनशॉट साथ में)।\nनाम: ${d.name || ""}\nजन्म तिथि: ${d.dob || ""}${d.time ? "\nजन्म समय: " + d.time : ""}${d.place ? "\nजन्म स्थान: " + d.place : ""}${q ? "\nप्रश्न: " + q : ""}\nमोबाइल: ${phone}\n(jyotishtark.in से)`;
          ov.remove();
          window.JTUPIBox({ amount: amt, title: nm, msg, note: "JT " + product });
          return;
        }
        return;
      }
      ga("begin_checkout", { value: r.amount || 0, currency: r.currency || pr.c, items: [{ item_name: product }] });
      if (r.free) { location.href = `${PAGE[product]}?jtpaid=${product}&order_id=${encodeURIComponent(r.order_id)}`; return; }
      if (r.upi) { upiScreen(ov, r, product, en); return; }
      if (r.razorpay) {
        const ok = await openRazorpay(r, product, en, () => { go.disabled = false; go.textContent = T("भुगतान पर जाएँ", "Continue to pay"); });
        if (!ok) { go.disabled = false; go.textContent = T("भुगतान पर जाएँ", "Continue to pay"); err.textContent = T("भुगतान पेज नहीं खुल सका — इंटरनेट जाँचें।", "Checkout could not open — check your connection."); }
        return;
      }
      try { const cf = (await loadSdk())({ mode: r.mode === "sandbox" ? "sandbox" : "production" }); cf.checkout({ paymentSessionId: r.payment_session_id, redirectTarget: "_self" }); }
      catch (e) { go.disabled = false; go.textContent = T("भुगतान पर जाएँ", "Continue to pay"); err.textContent = T("भुगतान पेज नहीं खुल सका — इंटरनेट जाँचें।", "Checkout could not open — check your connection."); }
    });
    setTimeout(() => { const f = ov.querySelector(opts.question ? "#jcoQ" : "#jcoPh"); if (f) f.focus(); }, 50);
  }

  /* UPI screen: QR + "pay in UPI app" button + UPI ID. After paying, the customer taps
     "भुगतान हो गया" and the report opens at once (the order is noted as "UPI — not checked" so it
     can be matched with the bank SMS later). Customers outside India / without UPI are sent to
     WhatsApp for bank details; their report is sent on WhatsApp. */
  function upiScreen(ov, r, product, en) {
    const T = (h, e) => (en ? e : h), oid = r.order_id, amt = Number(r.amount) || 0;
    const rs = amt % 1 ? amt.toFixed(2) : String(amt), paise = amt % 1 ? "." + amt.toFixed(2).split(".")[1] : "";
    const back = `${SITE_ROOT()}${PAGE[product] || ""}?jtpaid=${product}&order_id=${encodeURIComponent(oid)}`;
    const waL = (t) => `https://wa.me/918318513814?text=${encodeURIComponent(t)}`;
    const NAME = { kp: "KP Report", nm: "Numerology Report", sampurna: "Sampurna Kundali", prashna: "One Question", mobile: "Mobile Number Report", vp: "Varshphal 2027", rud: "Rudraksha" }[product] || product;
    let tzIndia = true; try { tzIndia = /Calcutta|Kolkata/.test(Intl.DateTimeFormat().resolvedOptions().timeZone || ""); } catch (e) { /* */ }
    ls.set("jt_upi_last", JSON.stringify({ o: oid, p: product, a: amt, t: Date.now() }));
    ga("upi_shown", { product, value: amt, currency: "INR", abroad: tzIndia ? 0 : 1 });
    const box = ov.querySelector(".jco-c") || ov.appendChild(document.createElement("div"));
    box.className = "jco-c jco-upi";
    const UPI_ID = upiCfg().id, UPI_NAME = upiCfg().name || "Jyotish Tark";
    const nriMsg = T(`नमस्ते, मैं भारत के बाहर से हूँ / मेरे पास UPI नहीं है। मुझे ${NAME} (₹${rs}) चाहिए। कृपया भुगतान के लिए खाते का विवरण भेजें।\nऑर्डर: ${oid}`, `Hello, I am outside India / I don't have UPI. I would like the ${NAME} (₹${rs}). Please send me your account details for payment.\nOrder: ${oid}`);
    const nri = `<div class="st" style="text-align:center"><p style="margin:0 0 4px;font-weight:700">${T("भारत के बाहर हैं, या भारतीय UPI नहीं है?", "Outside India, or no Indian UPI?")}</p>
      <p class="sm" style="margin:0">${T("WhatsApp करें — हम खाते का विवरण भेजेंगे। भुगतान के बाद आपकी रिपोर्ट WhatsApp पर भेजी जाएगी।", "Message us on WhatsApp — we will send our account details. After payment your report is sent to you on WhatsApp.")}</p>
      <a class="wa" href="${waL(nriMsg)}" target="_blank" rel="noopener" data-nri>${T("WhatsApp पर खाते का विवरण माँगें", "Ask for account details on WhatsApp")}</a></div>`;
    if (!UPI_ID) {
      box.innerHTML = `<h3>${T("भुगतान", "Payment")} — ₹${rs}</h3><p>${T("ऑर्डर नंबर", "Order number")}: <b>${esc(oid)}</b></p>${nri}<div class="jco-b"><button type="button" class="l" data-x>${T("बंद करें", "Close")}</button></div>`;
      box.querySelector("[data-x]").addEventListener("click", () => ov.remove());
      return;
    }
    const uri = `upi://pay?pa=${String(UPI_ID).replace(/[^A-Za-z0-9.\-_@]/g, "")}&pn=${encodeURIComponent(UPI_NAME)}&am=${amt.toFixed(2)}&cu=INR&tn=${encodeURIComponent(oid)}`;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    const upiPart = `<h3>${T("UPI से भुगतान करें", "Pay by UPI")}</h3>
      <p class="jco-p" style="margin:2px 0">₹${rs}</p><p class="sm">${esc(NAME)} · ${T("ऑर्डर", "Order")}: ${esc(oid)}</p>
      ${mobile ? `<a class="app" href="${uri}" data-app>${T(`UPI ऐप से ₹${rs} भुगतान करें`, `Pay ₹${rs} in your UPI app`)}</a><p class="sm">PhonePe · Google Pay · Paytm · BHIM</p>` : ""}
      <div class="qr">${window.JTQR ? window.JTQR(uri, 200) : ""}</div>
      <p class="sm">${mobile ? T("दूसरे फ़ोन से स्कैन करें, या स्क्रीनशॉट लेकर UPI ऐप में गैलरी से स्कैन करें।", "Scan from another phone, or screenshot it and scan from the gallery in your UPI app.") : T("फ़ोन के किसी भी UPI ऐप से स्कैन करें।", "Scan with any UPI app on your phone.")}</p>
      <div class="id"><span>UPI ID:</span><code>${esc(UPI_ID)}</code><button type="button" data-cp>${T("कॉपी", "Copy")}</button></div>
      ${paise ? `<p class="sm" style="margin-top:6px">${T(`कृपया ठीक <b>₹${rs}</b> ही भेजें — अंत के पैसे (${paise}) से आपका भुगतान अपने-आप पहचाना जाता है।`, `Please send exactly <b>₹${rs}</b> — the paise (${paise}) let us recognise your payment automatically.`)}</p>` : ""}
      <div class="st"><p style="margin:0 0 6px">${T(`<b>₹${rs}</b> भेजने के बाद नीचे दबाएँ — भुगतान की पुष्टि होते ही रिपोर्ट अपने-आप खुल जाएगी (आम तौर पर 1–2 मिनट)।`, `After sending <b>₹${rs}</b>, tap below — your report opens by itself as soon as the payment is confirmed (usually 1–2 minutes).`)}</p>
      <p class="jco-e" role="alert"></p>
      <div class="jco-b"><button type="button" data-s disabled>${T("✓ भुगतान हो गया — रिपोर्ट खोलें", "✓ I have paid — open my report")}</button></div></div>`;
    box.innerHTML = (tzIndia ? upiPart + nri : nri + upiPart) +
      `<p class="sm" style="margin-top:10px">${T("कोई दिक्कत? ", "Any problem? ")}<a href="${waL(T(`नमस्ते, ₹${rs} के भुगतान में मदद चाहिए। ऑर्डर: ${oid}`, `Hello, I need help paying ₹${rs}. Order: ${oid}`))}" target="_blank" rel="noopener">WhatsApp 83185 13814</a></p>`;
    const err = box.querySelector(".jco-e"), sb = box.querySelector("[data-s]");
    const app = box.querySelector("[data-app]"); if (app) app.addEventListener("click", () => ga("upi_app_open", { product }));
    const nb = box.querySelector("[data-nri]"); if (nb) nb.addEventListener("click", () => ga("generate_lead", { lead_type: "nri_payment", product, value: amt, currency: "INR" }));
    box.querySelector("[data-cp]").addEventListener("click", (e) => { try { navigator.clipboard.writeText(UPI_ID); e.target.textContent = "✓"; } catch (x) { /* */ } });
    // the "paid" button wakes up after a few seconds, so it is not tapped before paying
    let left = 5; const label = sb.textContent;
    const tick = () => { if (!document.body.contains(sb)) return; if (left <= 0) { sb.disabled = false; sb.textContent = label; return; } sb.textContent = `${label} (${left})`; left--; setTimeout(tick, 1000); };
    tick();
    // keep checking quietly while the QR is open; the bank SMS marks the order paid
    let done = false, quiet = 0;
    const opened = () => { if (done) return; done = true; ga("upi_auto_confirmed", { product, value: amt, currency: "INR" }); location.href = back; };
    const check = () => verify(oid).then((v) => { if (v && v.ok && v.paid) opened(); }).catch(() => {});
    const bg = () => { if (done || !document.body.contains(ov)) return; check(); if (quiet++ < 220) setTimeout(bg, 8000); };
    setTimeout(bg, 15000);
    sb.addEventListener("click", async () => {
      sb.disabled = true; err.textContent = "";
      try { await post("claim", { order_id: oid }); } catch (e) { /* the SMS still confirms it */ }
      ga("upi_claim", { product, value: amt, currency: "INR" });
      const st = sb.closest(".st");
      st.innerHTML = `<div class="jco-s" aria-hidden="true"></div><p style="text-align:center;margin:0"><b>${T("भुगतान की पुष्टि हो रही है…", "Confirming your payment…")}</b><br><span class="sm">${T("यह पेज खुला रखें — पुष्टि होते ही रिपोर्ट अपने-आप खुलेगी।", "Keep this page open — the report opens by itself once confirmed.")}</span></p>`;
      let n = 0;
      const fast = () => {
        if (done || !document.body.contains(ov)) return;
        check().then(() => {
          if (done) return;
          if (n++ < 60) { setTimeout(fast, 4000); return; }
          st.innerHTML = `<p style="margin:0"><b>${T("पुष्टि में थोड़ी देर हो रही है", "Confirmation is taking a little longer")}</b></p>
            <p class="sm">${T("चिंता न करें — भुगतान की पुष्टि होते ही आपकी रिपोर्ट इस लिंक पर खुलेगी (इसे सँभाल लें):", "Don't worry — once the payment is confirmed your report opens at this link (save it):")}<br><a href="${back}" style="word-break:break-all">${back}</a></p>
            <a class="wa" href="${waL(T(`नमस्ते, मैंने ${NAME} के लिए ₹${rs} UPI से भेजे हैं (स्क्रीनशॉट साथ में)। ऑर्डर: ${oid}`, `Hello, I paid ₹${rs} by UPI for the ${NAME} (screenshot attached). Order: ${oid}`))}" target="_blank" rel="noopener">${T("WhatsApp पर स्क्रीनशॉट भेजें", "Send the screenshot on WhatsApp")}</a>`;
          setTimeout(bg, 8000);
        });
      };
      fast();
    });
  }
/* Razorpay checkout. After a successful payment the customer goes to the product page with
     ?jtpaid=…&order_id=…, where confirm() asks our backend — which asks Razorpay — before unlocking. */
  let rzpLoading = null;
  function loadRazorpay() {
    if (window.Razorpay) return Promise.resolve(window.Razorpay);
    if (!rzpLoading) rzpLoading = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = () => res(window.Razorpay); s.onerror = () => { rzpLoading = null; rej(new Error("rzp")); }; document.head.appendChild(s); });
    return rzpLoading;
  }
  async function openRazorpay(r, product, en, onClose) {
    let R; try { R = await loadRazorpay(); } catch (e) { return false; }
    if (!R) return false;
    const back = `${SITE_ROOT()}${PAGE[product] || ""}?jtpaid=${product}&order_id=${encodeURIComponent(r.order_id)}`;
    try {
      const rz = new R({
        key: r.key_id, order_id: r.rzp_order_id, amount: Math.round((Number(r.amount) || 0) * 100), currency: r.currency || "INR",
        name: "Jyotish Tark", description: r.desc || product, image: SITE_ROOT() + "logo.png",
        prefill: { name: r.name || "", contact: r.phone || "", email: r.email || "" },
        notes: { order: r.order_id }, theme: { color: "#7A1F1F" },
        handler: () => { ga("rzp_success", { product }); location.href = back; },
        modal: { ondismiss: () => { ga("rzp_dismiss", { product }); if (onClose) onClose(); } }
      });
      rz.on("payment.failed", () => ga("rzp_failed", { product }));
      rz.open();
      return true;
    } catch (e) { return false; }
  }
  const SITE_ROOT = () => { try { return location.origin.indexOf("http") === 0 ? location.origin + "/" : "https://jyotishtark.in/"; } catch (e) { return "https://jyotishtark.in/"; } };

  /* A gentle, one-time request for an honest review, a little after the report opens. */
  function askReview(oid, en) {
    const k = "jt-rev-ask-" + oid;
    if (ls.get(k)) return;
    ls.set(k, "1");
    const G = "https://g.page/r/CZT7zaDR-9K8EAI/review", T = (h, e) => (en ? e : h);
    setTimeout(() => {
      if (document.getElementById("jtRevAsk")) return;
      const d = document.createElement("div");
      d.id = "jtRevAsk"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", T("अपना अनुभव लिखें", "Write a review"));
      d.style.cssText = "position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147483100;max-width:440px;margin:0 auto;background:#FBF6EC;border:2px solid #B8892B;border-radius:14px;padding:14px 16px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:Mukta,system-ui,sans-serif;color:#2B1810";
      d.innerHTML = `<b style="font-size:17px;color:#7A1F1F">${T("रिपोर्ट कैसी लगी?", "How was your report?")}</b>
        <p style="margin:4px 0 10px;font-size:15px;line-height:1.5">${T("आपका सच्चा अनुभव — अच्छा या सुधार लायक — दूसरों को सही फ़ैसला लेने में मदद करता है। 1 मिनट लगेगा।", "Your honest experience — good or needs work — helps others decide. Takes a minute.")}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a href="${G}" target="_blank" rel="noopener" data-r="google" style="flex:1 1 160px;display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:10px;background:#7A1F1F;color:#fff;font-weight:700;text-decoration:none">${T("Google पर लिखें", "Review on Google")}</a>
        <a href="index.html#jt-reviews" target="_blank" rel="noopener" data-r="site" style="flex:1 1 140px;display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:10px;border:1.5px solid #7A1F1F;color:#7A1F1F;font-weight:700;text-decoration:none;background:#fff">${T("वेबसाइट पर लिखें", "Review on website")}</a></div>
        <button type="button" data-x style="margin-top:8px;width:100%;min-height:36px;border:0;background:transparent;color:#6B5444;font:inherit;cursor:pointer">${T("बाद में", "Later")}</button>`;
      document.body.appendChild(d);
      d.querySelector("[data-x]").addEventListener("click", () => d.remove());
      d.querySelectorAll("[data-r]").forEach((a) => a.addEventListener("click", () => { ga("review_ask_click", { where: a.getAttribute("data-r") }); setTimeout(() => d.remove(), 300); }));
      ga("review_ask_shown", {});
    }, 90000);
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
        if (r && r.ok && r.paid) { ov.remove(); ga("purchase_verified", { product, transaction_id: oid }); try { const k = "jt-buy-" + oid; if (!localStorage.getItem(k)) { localStorage.setItem(k, "1"); const o = r.order || {}, amt = Number(o.amount) || ((PRICES[product] || {}).inr || 0); if (amt > 0) ga("purchase", { transaction_id: oid, value: amt, currency: o.currency || "INR", items: [{ item_name: product, price: amt, quantity: 1 }] }); } } catch (e) { /* ignore */ } onPaid(r.order, oid); askReview(oid, lang === "en"); return; }
        if (r && r.ok === false) { fail(T("यह ऑर्डर नहीं मिला", "Order not found"), T("इस ऑर्डर नंबर का कोई भुगतान नहीं मिला। अगर आपका पैसा कटा है तो भुगतान का स्क्रीनशॉट WhatsApp पर भेजें।", "No payment was found for this order number. If money was deducted, send the payment screenshot on WhatsApp.")); return; }
        if (r && r.ok && /^UPI/.test(r.status || "")) { fail(T("भुगतान की जाँच हो रही है", "Your payment is being checked"), T("आपके UPI भुगतान की पुष्टि अभी नहीं हुई है। पुष्टि होते ही यही लिंक खोलने पर रिपोर्ट खुल जाएगी — कुछ मिनट बाद पेज दोबारा खोलें। भुगतान कर दिया है और देर हो रही है, तो WhatsApp पर भुगतान का स्क्रीनशॉट भेजें — रिपोर्ट वहीं भेज दी जाएगी।", "Your UPI payment is not confirmed yet. Once it is, this same link opens your report — open it again in a few minutes. If you have paid and it is taking long, WhatsApp us the payment screenshot and we will send the report there.")); return; }
        if (tries++ < 5) { setTimeout(run, 3000); return; }
        fail(T("भुगतान अभी पूरा नहीं हुआ", "Payment not completed yet"), T("भुगतान की पुष्टि अभी नहीं मिली। कुछ मिनट बाद “दोबारा जाँचें” दबाएँ। पैसा कट गया हो तो WhatsApp करें।", "The payment is not confirmed yet. Tap “Check again” in a few minutes. If money was deducted, WhatsApp us."));
      }).catch(() => { if (tries++ < 5) setTimeout(run, 3000); else fail(T("इंटरनेट की समस्या", "Connection problem"), T("पुष्टि नहीं हो सकी — इंटरनेट जाँचकर दोबारा कोशिश करें।", "Could not confirm — check your connection and try again.")); });
    };
    run();
  }
  const orderParam = () => { try { return new URLSearchParams(location.search).get("order_id") || ""; } catch (e) { return ""; } };

  if (!window.JTQR) { try { const s = document.createElement("script"); s.src = "jt-qr.js?v=1"; s.defer = true; document.head.appendChild(s); } catch (e) { /* */ } }
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
    if (r.razorpay) { const ok = await openRazorpay(r, product, b && b.lang === "en", () => { /* closed */ }); return ok ? Object.assign({ redirect: true }, r) : { ok: false, error: "sdk" }; }
    if (r.upi) { css(); const ov = document.createElement("div"); ov.className = "jco"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov); upiScreen(ov, r, product, b && b.lang === "en"); return Object.assign({ redirect: true }, r); }
    try { const cf = (await loadSdk())({ mode: r.mode === "sandbox" ? "sandbox" : "production" }); cf.checkout({ paymentSessionId: r.payment_session_id, redirectTarget: "_self" }); return Object.assign({ redirect: true }, r); }
    catch (e) { return { ok: false, error: "sdk" }; }
  }
  return { API, enabled, pay, start, confirm, verify, lookup, lead, post, price, currency, nri, setCurrency, partner, checkPartner, orderParam, PRICES };
})();
