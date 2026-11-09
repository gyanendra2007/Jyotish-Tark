/* ==========================================================================
   JYOTISH TARK — RUDRAKSHA STORE
   Product data comes from window.JTR_DATA (written into rudraksha.html).
   Payments: one fixed-amount Cashfree payment form per product + option.
   SETTINGS — edit only this block:
     cashfreeReady : set to true once all forms below exist in Cashfree.
     forms         : Cashfree form code for each product; "<id>" = without
                     certificate, "<id>-c" = with certificate.
                     Leave a code "" to hide online payment for that option.
   In every Cashfree form set the "redirect URL after payment" to
     https://jyotishtark.in/rudraksha.html?jtpaid=rud
   ========================================================================== */
window.JTR_PAY = Object.assign({
  cashfreeReady: true,
  base: "https://payments.cashfree.com/forms/",
  whatsapp: "918318513814",
  forms: {
    "5": "jtr-5mukhi", "5-c": "jtr-5mukhi-cert",
    "4": "jtr-4mukhi", "4-c": "jtr-4mukhi-cert",
    "3": "jtr-3mukhi", "3-c": "jtr-3mukhi-cert",
    "6": "jtr-6mukhi", "6-c": "jtr-6mukhi-cert",
    "7": "jtr-7mukhi", "7-c": "jtr-7mukhi-cert",
    "8": "jtr-8mukhi", "8-c": "jtr-8mukhi-cert",
    "9": "jtr-9mukhi", "9-c": "jtr-9mukhi-cert",
    "2": "jtr-2mukhi", "2-c": "jtr-2mukhi-cert",
    "gs": "jtr-gaurishankar", "gs-c": "jtr-gaurishankar-cert",
    "vidya": "jtr-vidya-combo", "vidya-c": "jtr-vidya-combo-cert",
    "dhan": "jtr-dhan-combo", "dhan-c": "jtr-dhan-combo-cert",
    "shakti": "jtr-shakti-combo", "shakti-c": "jtr-shakti-combo-cert",
    "vivah": "jtr-vivah-combo", "vivah-c": "jtr-vivah-combo-cert",
    "saraswati": "jtr-saraswati-bandh", "saraswati-c": "jtr-saraswati-bandh-cert",
    "business": "jtr-business-bandh", "business-c": "jtr-business-bandh-cert",
    "swasthya": "jtr-swasthya-bandh", "swasthya-c": "jtr-swasthya-bandh-cert",
    "water": "jtr-water-beads", "water-c": "jtr-water-beads-cert"
  }
}, window.JTR_PAY || {});

(function () {
  "use strict";
  const D = window.JTR_DATA, CFG = window.JTR_PAY;
  if (!D) return;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const inr = (n) => Number(n).toLocaleString("en-IN");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const track = (name, p) => { try { window.gtag && gtag("event", name, p || {}); } catch (e) {} };

  const total = (id, cert) => D.items[id].price + (cert ? D.items[id].cert : 0);
  const formUrl = (id, cert) => { const code = CFG.forms[id + (cert ? "-c" : "")]; return CFG.cashfreeReady && code ? CFG.base + code : ""; };
  const certOf = (id) => { const r = $(`input[name="c-${id}"]:checked`); return !!(r && r.value === "1"); };
  const imgOf = (id) => { const im = $(`#p-${id} .rd-img img`); return im ? im.getAttribute("src") : "images/rud-five.webp"; };

  // ---------- card price toggles ----------
  $$(".rd-card").forEach((card) => {
    const id = card.dataset.id;
    $$(`input[name="c-${id}"]`, card).forEach((r) => r.addEventListener("change", () => {
      $(".rd-buyamt", card).textContent = "₹" + inr(total(id, certOf(id)));
    }));
  });

  // ---------- filters ----------
  function filter(f) {
    $$(".rd-tab").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
    let n = 0;
    $$(".rd-card").forEach((c) => { const ok = f === "all" || c.dataset.cat.split(" ").includes(f); c.hidden = !ok; if (ok) n++; });
    const singles = $$("#singles .rd-card").some((c) => !c.hidden), combos = $$("#combogrid .rd-card").some((c) => !c.hidden);
    $("#singles").hidden = !singles; $("#combos").hidden = !combos; $("#combos").nextElementSibling.hidden = !combos; $("#combogrid").hidden = !combos;
    $("#noitems").hidden = n > 0;
  }
  $$(".rd-tab").forEach((b) => b.addEventListener("click", () => filter(b.dataset.f)));

  // ---------- finder ----------
  $$(".rd-q").forEach((b) => b.addEventListener("click", () => {
    filter("all");
    const card = $("#p-" + b.dataset.go);
    $$(".rd-hl").forEach((c) => c.classList.remove("rd-hl"));
    if (card) { card.classList.add("rd-hl"); card.scrollIntoView({ behavior: "smooth", block: "center" }); }
    track("rudraksha_finder", { item: b.dataset.go });
  }));

  // ---------- order dialog ----------
  const dlg = $("#rdDlg"), body = $("#rdDlgBody");
  const open = () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); };
  const close = () => { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); };
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) close(); });

  function newId() {
    const d = new Date(), p = (n) => String(n).padStart(2, "0");
    return `JTR${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function waText(o) {
    const it = D.items[o.id];
    return [
      `🙏 नमस्ते Jyotish Tark — रुद्राक्ष ऑर्डर`,
      `Order ID: ${o.oid}`,
      `📿 ${it.name}${it.sub ? ` (${it.sub})` : ""}`,
      `सर्टिफिकेट: ${o.cert ? "हाँ, लैब सर्टिफिकेट सहित" : "नहीं"}`,
      `कुल राशि: ₹${inr(o.amt)}`,
      `भुगतान: ${o.pay === "cod" ? "कैश ऑन डिलीवरी" : "ऑनलाइन (Cashfree)"}`,
      ``,
      `नाम: ${o.name}`, `मोबाइल: ${o.phone}`, `पता: ${o.addr}`, `शहर: ${o.city}  पिन: ${o.pin}`, `राज्य: ${o.state}`
    ].join("\n");
  }
  const waLink = (o) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(waText(o))}`;

  function showForm(id, cert) {
    const it = D.items[id], last = store.get("jtr_addr") || {};
    const onlineAny = !!(formUrl(id, false) || formUrl(id, true));
    body.innerHTML = `
      <div class="rd-sum"><img src="${esc(imgOf(id))}" alt=""><div><b>${esc(it.name)}</b><br><small>${esc(it.sub)} · मुफ़्त: ${esc(it.gift)}, लाल धागा, धारण विधि</small></div></div>
      <div class="rd-opt" role="radiogroup" aria-label="सर्टिफिकेट">
        <label class="rd-pill"><input type="radio" name="dc" value="0" ${cert ? "" : "checked"}><span><small>बिना सर्टिफिकेट</small><b>₹${inr(total(id, false))}</b></span></label>
        <label class="rd-pill"><input type="radio" name="dc" value="1" ${cert ? "checked" : ""}><span><small>लैब सर्टिफिकेट सहित</small><b>₹${inr(total(id, true))}</b></span><em>+₹${inr(it.cert)}</em></label>
      </div>
      <form class="rd-f" id="rdForm" novalidate>
        <label>नाम<input name="name" autocomplete="name" required value="${esc(last.name || "")}"></label>
        <label>मोबाइल नंबर<input name="phone" type="tel" inputmode="numeric" autocomplete="tel" required maxlength="13" value="${esc(last.phone || "")}"></label>
        <label class="rd-full">पूरा पता (मकान नं., गली, मोहल्ला)<textarea name="addr" rows="2" autocomplete="street-address" required>${esc(last.addr || "")}</textarea></label>
        <label>शहर<input name="city" autocomplete="address-level2" required value="${esc(last.city || "")}"></label>
        <label>पिनकोड<input name="pin" inputmode="numeric" autocomplete="postal-code" required maxlength="6" value="${esc(last.pin || "")}"></label>
        <label class="rd-full">राज्य<input name="state" autocomplete="address-level1" required value="${esc(last.state || "")}"></label>
        <div class="rd-full rd-pay" role="radiogroup" aria-label="भुगतान का तरीका">
          <label class="rd-pill"><input type="radio" name="pay" value="online" ${onlineAny ? "checked" : "disabled"}><span><small>${onlineAny ? "UPI · कार्ड · नेट-बैंकिंग" : "जल्द उपलब्ध"}</small><b>ऑनलाइन भुगतान</b></span></label>
          <label class="rd-pill"><input type="radio" name="pay" value="cod" ${onlineAny ? "" : "checked"}><span><small>डिलीवरी पर भुगतान</small><b>कैश ऑन डिलीवरी</b></span></label>
        </div>
        <div class="rd-full rd-tot"><span>कुल राशि <small>(मुफ़्त डिलीवरी)</small></span><b id="rdTot">₹${inr(total(id, cert))}</b></div>
        <p class="rd-full rd-err" id="rdErr" role="alert"></p>
        <button class="rd-buy rd-full" type="submit">आगे बढ़ें <span class="rd-buyamt" id="rdTot2">₹${inr(total(id, cert))}</span></button>
        <p class="rd-full rd-note">आपकी जानकारी केवल डिलीवरी के लिए उपयोग होती है। एक से अधिक दाने या विशेष माला के लिए WhatsApp करें।</p>
      </form>`;
    const curCert = () => $('input[name="dc"]:checked', body).value === "1";
    const upd = () => {
      const c = curCert(), a = "₹" + inr(total(id, c));
      $("#rdTot").textContent = a; $("#rdTot2").textContent = a;
      const on = $('input[name="pay"][value="online"]', body), ok = !!formUrl(id, c);
      on.disabled = !ok; if (!ok && on.checked) $('input[name="pay"][value="cod"]', body).checked = true;
      on.nextElementSibling.querySelector("small").textContent = ok ? "UPI · कार्ड · नेट-बैंकिंग" : "जल्द उपलब्ध";
    };
    $$('input[name="dc"]', body).forEach((r) => r.addEventListener("change", upd));
    upd();
    $("#rdForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target), v = (k) => String(f.get(k) || "").trim();
      const o = { id, cert: curCert(), name: v("name"), phone: v("phone").replace(/[^\d+]/g, ""), addr: v("addr"), city: v("city"), pin: v("pin"), state: v("state"), pay: v("pay") || "cod" };
      const bad = !o.name ? "नाम भरें।" : !/^(\+?91)?[6-9]\d{9}$/.test(o.phone) ? "सही 10 अंकों का मोबाइल नंबर भरें।" : o.addr.length < 8 ? "पूरा पता भरें।" : !o.city ? "शहर भरें।" : !/^\d{6}$/.test(o.pin) ? "6 अंकों का पिनकोड भरें।" : !o.state ? "राज्य भरें।" : "";
      if (bad) { $("#rdErr").textContent = bad; return; }
      o.oid = newId(); o.amt = total(id, o.cert); o.at = Date.now();
      store.set("jtr_addr", { name: o.name, phone: o.phone, addr: o.addr, city: o.city, pin: o.pin, state: o.state });
      store.set("jtr_last", o);
      track("rudraksha_order", { item: id, cert: o.cert, pay: o.pay, value: o.amt });
      if (o.pay === "online") showPay(o); else showCod(o);
    });
    open();
    track("rudraksha_open", { item: id });
  }

  function showPay(o) {
    const it = D.items[o.id];
    $("#rdDlgT").textContent = "ऑनलाइन भुगतान";
    body.innerHTML = `<div class="rd-ok">
      <p>ऑर्डर नंबर <span class="rd-oid">${esc(o.oid)}</span> — ${esc(it.name)}${o.cert ? " (सर्टिफिकेट सहित)" : ""}</p>
      <ol>
        <li><b>₹${inr(o.amt)} का भुगतान करें।</b> Cashfree का सुरक्षित पेज खुलेगा — वहाँ ‘Order ID’ में <span class="rd-oid">${esc(o.oid)}</span> लिखें।<br>
          <a class="rd-btn rd-btn-p" style="margin-top:.6rem" href="${esc(formUrl(o.id, o.cert))}" target="_blank" rel="noopener" id="rdPayBtn"><i class="fas fa-lock"></i> ₹${inr(o.amt)} ऑनलाइन भुगतान करें</a></li>
        <li><b>भुगतान के बाद पता WhatsApp पर भेजें</b> ताकि डिलीवरी तुरंत शुरू हो सके।<br>
          <a class="rd-btn rd-btn-p rd-wa" style="margin-top:.6rem" href="${esc(waLink(o))}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> ऑर्डर विवरण भेजें</a></li>
      </ol>
      <p class="rd-note">भुगतान में कोई दिक्कत हो तो WhatsApp करें: +91 83185 13814। आप कैश ऑन डिलीवरी भी चुन सकते हैं।</p></div>`;
    $("#rdPayBtn").addEventListener("click", () => track("rudraksha_pay_click", { item: o.id, value: o.amt }));
  }

  function showCod(o) {
    const it = D.items[o.id];
    $("#rdDlgT").textContent = "कैश ऑन डिलीवरी";
    body.innerHTML = `<div class="rd-ok">
      <p>ऑर्डर नंबर <span class="rd-oid">${esc(o.oid)}</span> — ${esc(it.name)}${o.cert ? " (सर्टिफिकेट सहित)" : ""}, ₹${inr(o.amt)}</p>
      <p><b>आख़िरी कदम:</b> नीचे के बटन से ऑर्डर WhatsApp पर भेजें। हम कॉल या संदेश से पुष्टि करके दाना भेज देंगे; भुगतान डिलीवरी के समय करें।</p>
      <a class="rd-btn rd-btn-p rd-wa" href="${esc(waLink(o))}" target="_blank" rel="noopener" id="rdCodBtn"><i class="fab fa-whatsapp"></i> WhatsApp पर ऑर्डर भेजें</a>
      <p class="rd-note">WhatsApp न हो तो इसी नंबर पर कॉल करें: +91 83185 13814 और ऑर्डर नंबर बताएँ।</p></div>`;
    $("#rdCodBtn").addEventListener("click", () => track("rudraksha_cod_sent", { item: o.id, value: o.amt }));
  }

  $$("[data-buy]").forEach((b) => b.addEventListener("click", () => { $("#rdDlgT").textContent = "ऑर्डर करें"; showForm(b.dataset.buy, certOf(b.dataset.buy)); }));

  // ---------- return from Cashfree ----------
  if (new URLSearchParams(location.search).get("jtpaid") === "rud") {
    const o = store.get("jtr_last");
    $("#rdDlgT").textContent = "भुगतान के लिए धन्यवाद";
    body.innerHTML = o && D.items[o.id] ? `<div class="rd-ok">
      <p>🙏 आपका भुगतान Cashfree से पूरा हुआ। ऑर्डर नंबर <span class="rd-oid">${esc(o.oid)}</span> — ${esc(D.items[o.id].name)}, ₹${inr(o.amt)}।</p>
      <p>अगर आपने अभी तक पता नहीं भेजा है, तो कृपया यह बटन दबाएँ:</p>
      <a class="rd-btn rd-btn-p rd-wa" href="${esc(waLink(o))}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> ऑर्डर विवरण WhatsApp पर भेजें</a>
      <p class="rd-note">दाना अभिमंत्रित करके ${o.cert ? "लैब सर्टिफिकेट के साथ 5–9" : "3–5"} दिन में भेजा जाएगा।</p></div>`
      : `<div class="rd-ok"><p>🙏 भुगतान के लिए धन्यवाद। कृपया भुगतान का स्क्रीनशॉट और डिलीवरी पता WhatsApp पर भेजें।</p><a class="rd-btn rd-btn-p rd-wa" href="https://wa.me/${CFG.whatsapp}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp खोलें</a></div>`;
    open();
    track("rudraksha_paid_return", o ? { item: o.id, value: o.amt } : {});
  }
})();
