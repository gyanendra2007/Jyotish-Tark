/* Jyotish Tark — Kaal sarp dosh check */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  host.innerHTML = `<form id="ksForm" class="jc-f" novalidate>${C.fields("ks", { placeFull: true })}
    <div class="jc-full"><button class="jc-btn" type="submit">काल सर्प दोष जाँचें</button><p class="jc-note">दोष का प्रकार राहु के भाव से तय होता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।</p><p class="jc-err" id="ksErr" hidden></p></div></form>
    <div id="ksRes" class="jc-res" aria-live="polite"></div>`;
  C.placeSearch($("#ksPlace"), $("#ksPlaceList"));
  const TYPES = { 1: ["अनंत", "स्वास्थ्य, आत्मविश्वास और पहचान से जुड़े संघर्ष"], 2: ["कुलिक", "धन, वाणी और परिवार में उतार-चढ़ाव"], 3: ["वासुकि", "भाई-बहन, साहस और प्रयासों में रुकावट"], 4: ["शंखपाल", "घर, माता, वाहन और मन की शांति"], 5: ["पद्म", "शिक्षा, संतान और प्रेम संबंध"], 6: ["महापद्म", "शत्रु, रोग, कर्ज़ और प्रतियोगिता"], 7: ["तक्षक", "विवाह, साझेदारी और जीवनसाथी"], 8: ["कर्कोटक", "अचानक घटनाएँ, विरासत और आयु"], 9: ["शंखचूड़", "भाग्य, पिता और धर्म-कर्म"], 10: ["घातक", "करियर, पद और प्रतिष्ठा"], 11: ["विषधर", "आय, मित्र और बड़े भाई-बहन"], 12: ["शेषनाग", "खर्च, नींद, विदेश और गुप्त शत्रु"] };
  const PL7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const norm = (x) => ((x % 360) + 360) % 360;

  $("#ksForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const { o, miss } = C.read("ks", { time: true, place: true }), err = $("#ksErr");
    if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true; $("#ksRes").innerHTML = `<p>गणना हो रही है…</p>`;
    C.ready(() => {
      try { show(o, C.chart(o)); } catch (er) { $("#ksRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    }, () => { $("#ksRes").innerHTML = `<p class="jc-err">पेज पूरा लोड नहीं हुआ — दोबारा कोशिश करें।</p>`; });
  });

  function show(o, { X, P }) {
    const rl = P.Rahu.lon;
    const pos = PL7.map((p) => ({ p, d: norm(P[p].lon - rl) })); // 0–180 = Rahu→Ketu side (zodiac order)
    const side = pos.filter((x) => x.d < 180).length;
    const out = side >= 4 ? pos.filter((x) => x.d >= 180) : pos.filter((x) => x.d < 180);
    const full = out.length === 0, partial = out.length === 1;
    const rh = X.rh.Rahu, T = TYPES[rh];
    const status = full ? "पूर्ण काल सर्प योग" : partial ? "आंशिक काल सर्प योग" : "काल सर्प दोष नहीं";
    const body = full ? `सातों ग्रह (सूर्य से शनि) राहु और केतु के एक ही ओर हैं। राहु लग्न से ${C.ov(rh)} भाव में है, इसलिए परंपरा में इसे <b>“${T[0]}” काल सर्प</b> कहा जाता है — इसका संबंध <b>${T[1]}</b> से माना जाता है।`
      : partial ? `छह ग्रह राहु-केतु के एक ओर हैं, केवल <b>${C.PN[out[0].p]}</b> बाहर है। इसे आंशिक काल सर्प माना जाता है; प्रभाव पूर्ण योग से काफ़ी कम माना जाता है। (राहु ${C.ov(rh)} भाव में — “${T[0]}” प्रकार।)`
        : `${o.name ? esc(o.name) + " की" : "आपकी"} कुण्डली में ग्रह राहु-केतु के दोनों ओर बँटे हैं (${7 - out.length} एक ओर, ${out.length} दूसरी ओर)। <b>काल सर्प दोष नहीं है।</b>`;
    $("#ksRes").innerHTML = `<div class="jc-big${!full && !partial ? " ok" : ""}"><div class="v">${full ? "हाँ" : partial ? "आंशिक" : "नहीं"}</div><div class="t"><b>${status}</b><br>${body}</div></div>
      <h3>राहु-केतु अक्ष और ग्रह</h3>
      <p>राहु: ${C.RASHI[P.Rahu.sign - 1]} राशि (${C.ov(rh)} भाव) · केतु: ${C.RASHI[P.Ketu.sign - 1]} राशि (${C.ov(X.rh.Ketu)} भाव)</p>
      <div class="jc-tw"><table class="jc-tbl"><thead><tr><th>ग्रह</th><th>राशि</th><th>भाव</th><th>राहु से केतु की ओर?</th></tr></thead><tbody>
      ${pos.map((x) => `<tr><td><b>${C.PN[x.p]}</b></td><td>${C.RASHI[P[x.p].sign - 1]}</td><td>${C.ov(X.rh[x.p])}</td><td>${x.d < 180 ? "राहु → केतु वाली ओर" : "केतु → राहु वाली ओर"}</td></tr>`).join("")}</tbody></table></div>
      ${full || partial ? `<h3>सरल पारंपरिक उपाय</h3><ul><li>सोमवार को शिवलिंग पर जल और “ॐ नमः शिवाय” का जप; महामृत्युंजय मंत्र।</li><li>नाग पंचमी या किसी शुभ दिन काल सर्प शांति पूजा (उज्जैन, त्र्यंबकेश्वर जैसे स्थानों पर परंपरा है)।</li><li>राहु के लिए आठ मुखी और केतु के लिए नौ मुखी रुद्राक्ष परंपरा में धारण किए जाते हैं — <a href="rudraksha.html">देखें</a>।</li></ul><p>विस्तार से पढ़ें: <a href="kaalsarp-dosha-remedies.html">काल सर्प दोष — अर्थ, प्रकार और उपाय</a></p>` : ""}
      <div class="jc-act"><button class="jc-btn" type="button" id="ksShare">📲 रिज़ल्ट शेयर करें</button><a class="jc-btn l" href="consultation.html">ज्योतिषी से पूछें</a></div>
      <div class="jc-up"><b>डरने से पहले पूरी कुण्डली देखें।</b> काल सर्प का असर बाकी ग्रहों के बल पर निर्भर करता है — <a href="kp-astrology.html">KP विस्तृत रिपोर्ट ₹299 →</a></div>
      <p class="jc-note">ध्यान दें: काल सर्प योग का वर्णन बृहत् पाराशर होरा शास्त्र जैसे मूल ग्रंथों में नहीं मिलता; यह बाद की परंपरा है। बहुत से सफल लोगों की कुण्डली में यह योग होता है — इसे भाग्य का फ़ैसला न मानें।</p>`;
    $("#ksShare").addEventListener("click", () => C.share({ title: "काल सर्प दोष जाँच", sub: o.name || "", big: full ? "हाँ" : partial ? "आंशिक" : "नहीं", bigSize: 120, bigSub: full || partial ? `“${T[0]}” प्रकार` : "दोष नहीं", lines: [`राहु ${C.ov(rh)} भाव · केतु ${C.ov(X.rh.Ketu)} भाव`, full || partial ? T[1] : "ग्रह राहु-केतु के दोनों ओर"] }, "kaal-sarp"));
    $("#ksRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track("calc_kaalsarp", { full, partial });
  }
})();
