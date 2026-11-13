/* Jyotish Tark — partner dashboard (code + PIN) and "get my report again" (order ID + phone).
   Both talk to the order backend through JTCheckout. */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C, CO = window.JTCheckout;
  C.css();
  const host = $("#calcHost"), mode = host.dataset.mode || document.body.dataset.mode;
  const off = !CO || !CO.enabled();
  const PAGE = { kp: "kp-astrology.html", nm: "numerology.html", sampurna: "kundali-form.html", prashna: "kundali-se-poochho.html" };
  const inp = (id, label, type, ph, ac) => `<label>${label}<input id="${id}" type="${type}" placeholder="${ph}" autocomplete="${ac || "off"}" style="width:100%;font:inherit;font-size:16px;border:1.5px solid #D9C6A0;border-radius:10px;padding:.55rem .75rem;min-height:46px"></label>`;

  if (mode === "report") {
    host.innerHTML = `<form id="mrF" class="jc-f" novalidate>${inp("mrO", "ऑर्डर नंबर *", "text", "जैसे JTKP2611131530ABCD")}${inp("mrP", "भुगतान वाला मोबाइल नंबर *", "tel", "98XXXXXXXX", "tel")}
      <div class="jc-full"><button class="jc-btn" type="submit">मेरी रिपोर्ट खोलें</button><p class="jc-note">ऑर्डर नंबर Cashfree की रसीद (SMS / ईमेल) और रिपोर्ट के पहले पेज पर लिखा होता है।</p><p class="jc-err" id="mrE" hidden></p></div></form>`;
    $("#mrF").addEventListener("submit", async (e) => {
      e.preventDefault();
      const oid = $("#mrO").value.trim().toUpperCase(), ph = $("#mrP").value.trim(), er = $("#mrE");
      if (!oid || ph.replace(/\D/g, "").length < 8) { er.textContent = "कृपया ऑर्डर नंबर और मोबाइल नंबर भरें।"; er.hidden = false; return; }
      if (off) { er.innerHTML = `यह सुविधा जल्द शुरू हो रही है। अभी अपनी रिपोर्ट के लिए <a href="https://wa.me/918318513814?text=${encodeURIComponent("नमस्ते, मुझे अपनी रिपोर्ट दोबारा चाहिए। ऑर्डर: " + oid)}">WhatsApp करें</a>।`; er.hidden = false; return; }
      er.hidden = true; e.submitter && (e.submitter.disabled = true);
      try {
        const r = await CO.lookup(oid, ph);
        if (r && r.ok && r.paid && PAGE[r.order.product]) { location.href = `${PAGE[r.order.product]}?jtpaid=${r.order.product}&order_id=${encodeURIComponent(oid)}`; return; }
        er.textContent = r && r.error === "phone" ? "यह मोबाइल नंबर इस ऑर्डर से मेल नहीं खाता।" : r && r.error === "not found" ? "यह ऑर्डर नंबर नहीं मिला — दोबारा जाँचें।" : "इस ऑर्डर का भुगतान पूरा नहीं दिखता। मदद के लिए WhatsApp करें: 83185 13814";
      } catch (x) { er.textContent = "इंटरनेट की समस्या — दोबारा कोशिश करें।"; }
      er.hidden = false; e.submitter && (e.submitter.disabled = false);
    });
    return;
  }

  // ---------- partner dashboard ----------
  host.innerHTML = `<form id="ptF" class="jc-f" novalidate>${inp("ptC", "पार्टनर कोड *", "text", "जैसे SHARMAJI")}${inp("ptP", "PIN *", "password", "4–6 अंक", "current-password")}
    <div class="jc-full"><button class="jc-btn" type="submit">मेरी बिक्री देखें</button><p class="jc-err" id="ptE" hidden></p></div></form><div id="ptR" class="jc-res"></div>`;
  $("#ptF").addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = $("#ptC").value.trim().toUpperCase(), pin = $("#ptP").value.trim(), er = $("#ptE");
    if (!code || !pin) { er.textContent = "कृपया कोड और PIN भरें।"; er.hidden = false; return; }
    if (off) { er.textContent = "पार्टनर डैशबोर्ड जल्द शुरू हो रहा है।"; er.hidden = false; return; }
    er.hidden = true;
    try {
      const r = await CO.post("partner", { code, pin });
      if (!r || !r.ok) { er.textContent = "कोड या PIN सही नहीं है।"; er.hidden = false; return; }
      const link = (pg) => `https://jyotishtark.in/${pg}?p=${encodeURIComponent(code)}`;
      $("#ptR").innerHTML = `<div class="jc-big ok"><div class="v">${r.count}</div><div class="t"><b>नमस्ते ${esc(r.name)} जी</b><br>आपके कोड से <b>${r.count}</b> भुगतान हुए — बिक्री ₹${r.sales.toLocaleString("en-IN")}, आपका कमीशन (${r.commissionPct}%) <b>₹${r.commission.toLocaleString("en-IN")}</b>।</div></div>
        <h3>आपके लिंक (ग्राहक को 10% छूट)</h3><div class="jc-tw"><table class="jc-tbl"><tbody>
        ${[["होम पेज", ""], ["सम्पूर्ण कुंडली ₹1,101", "kundali-form.html"], ["KP रिपोर्ट ₹299", "kp-astrology.html"], ["अंक ज्योतिष रिपोर्ट ₹299", "numerology.html"], ["रुद्राक्ष", "rudraksha.html"], ["गुण मिलान (मुफ़्त)", "guna-milan-calculator.html"]].map(([t, pg]) => `<tr><td>${t}</td><td style="word-break:break-all"><code>${link(pg)}</code></td></tr>`).join("")}</tbody></table></div>
        <h3>हाल की बिक्री</h3>${r.rows.length ? `<div class="jc-tw"><table class="jc-tbl"><thead><tr><th>तारीख़</th><th>उत्पाद</th><th>राशि</th><th>कमीशन</th></tr></thead><tbody>${r.rows.map((x) => `<tr><td>${esc(x.date)}</td><td>${esc(x.product)}</td><td>${x.currency === "USD" ? "$" : "₹"}${x.amount}</td><td>${x.currency === "USD" ? "$" : "₹"}${x.commission}</td></tr>`).join("")}</tbody></table></div>` : "<p>अभी कोई बिक्री नहीं — ऊपर के लिंक अपने ग्राहकों को भेजें।</p>"}
        <p class="jc-note">कमीशन हर महीने की 5 तारीख़ तक पिछले महीने की पक्की बिक्री पर UPI से भेजा जाता है।</p>`;
      C.track("partner_dash", { code });
    } catch (x) { er.textContent = "इंटरनेट की समस्या — दोबारा कोशिश करें।"; er.hidden = false; }
  });
})();
