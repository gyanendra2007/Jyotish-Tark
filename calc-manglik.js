/* Jyotish Tark — Manglik dosh calculator (uses jt-calc.js + kp-engine + kp-extra) */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  host.innerHTML = `<form id="mgForm" class="jc-f" novalidate>${C.fields("mg", { placeFull: true })}
    <div class="jc-full"><button class="jc-btn" type="submit">मंगल दोष जाँचें</button><p class="jc-note">मांगलिक दोष लग्न (जन्म समय) से देखा जाता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।</p><p class="jc-err" id="mgErr" hidden></p></div></form>
    <div id="mgRes" class="jc-res" aria-live="polite"></div>`;
  C.placeSearch($("#mgPlace"), $("#mgPlaceList"));
  const MCAN = {
    ownSign: "मंगल अपनी (मेष/वृश्चिक) या उच्च (मकर) राशि में है — शास्त्रों के अनुसार दोष का प्रभाव कम होता है।",
    jupiterAspect: "गुरु की मंगल पर दृष्टि या युति है — यह मांगलिक दोष को काफ़ी शांत करने वाला नियम माना जाता है।",
    jupiterStar: "मंगल गुरु के नक्षत्र में है — मंगल का स्वभाव सौम्य माना जाता है।",
    beneficKendra: "गुरु या शुक्र केंद्र (1, 4, 7, 10 भाव) में है — यह दोष को संतुलित करता है।"
  };
  const HT = { 1: "लग्न (पहले भाव) में मंगल — स्वभाव में तेज़ी और जल्दी गुस्सा; बहस में संयम ज़रूरी।", 4: "चौथे भाव में मंगल — घर के माहौल में बेचैनी; घर के फ़ैसले मिलकर लें।", 7: "सातवें भाव में मंगल — जीवनसाथी ऊर्जावान पर ज़िद्दी; बहस को जीत-हार न बनाएँ।", 8: "आठवें भाव में मंगल — ससुराल और साझे धन में सावधानी; पारदर्शिता रखें।", 12: "बारहवें भाव में मंगल — खर्च, नींद और दूरी; साथ में बजट बनाएँ।" };
  const MH = [1, 4, 7, 8, 12];

  $("#mgForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const { o, miss } = C.read("mg", { time: true, place: true });
    const err = $("#mgErr");
    if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true;
    $("#mgRes").innerHTML = `<p>गणना हो रही है…</p>`;
    C.ready(() => {
      let r; try { r = C.chart(o); } catch (er) { $("#mgRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; return; }
      show(o, r);
    }, () => { $("#mgRes").innerHTML = `<p class="jc-err">पेज पूरा लोड नहीं हुआ — इंटरनेट जाँचकर दोबारा कोशिश करें।</p>`; });
  });

  function show(o, { X, P }) {
    const M = X.manglik, mars = P.Mars;
    const nm = o.name || "आप";
    const lvl = M.level;
    const title = lvl === "none" ? "मांगलिक नहीं" : lvl === "mild" ? "आंशिक / हल्का मांगलिक" : "मांगलिक";
    const ageNow = (Date.now() - new Date(o.dob)) / (365.25 * 864e5);
    const rows = [["लग्न से", M.from.lagna, M.flags.lagna], ["चंद्र से", M.from.moon, M.flags.moon], ["शुक्र से", M.from.venus, M.flags.venus]];
    const desc = lvl === "none" ? `${esc(nm)} की कुण्डली में मंगल लग्न, चंद्र और शुक्र — तीनों से 1, 4, 7, 8 या 12वें भाव में नहीं है। <b>मांगलिक दोष नहीं है।</b>`
      : lvl === "mild" ? `मंगल ${rows.filter((x) => x[2]).map((x) => x[0]).join(" और ")} दोष वाले भाव में है${M.cancel.length ? ", और दोष कम करने वाले कारक भी मौजूद हैं" : ""}। इसे <b>हल्का (आंशिक) मांगलिक</b> माना जाता है — डरने की ज़रूरत नहीं।`
        : `मंगल ${rows.filter((x) => x[2]).map((x) => x[0]).join(", ")} दोष वाले भाव में है। <b>कुण्डली मांगलिक है।</b> विवाह के लिए कुण्डली मिलान में इसका ध्यान रखा जाता है।`;
    $("#mgRes").innerHTML = `
      <div class="jc-big${lvl === "none" ? " ok" : ""}"><div class="v">${title}</div><div class="t">${desc}</div></div>
      <div class="jc-tw"><table class="jc-tbl"><thead><tr><th>किससे देखा</th><th>मंगल किस भाव में</th><th>परिणाम</th></tr></thead><tbody>
      ${rows.map(([a, h, f]) => `<tr><td>${a}</td><td>${C.ov(h)} भाव</td><td><b>${f ? "दोष वाला भाव" : "दोष नहीं"}</b></td></tr>`).join("")}</tbody></table></div>
      <p><b>मंगल की स्थिति:</b> ${C.RASHI[mars.sign - 1]} राशि में, ${C.NAK[mars.nak - 1]} नक्षत्र, लग्न से ${C.ov(X.rh.Mars)} भाव${mars.retro ? " (वक्री)" : ""}। ${HT[X.rh.Mars] || ""}</p>
      ${lvl !== "none" && M.cancel.length ? `<h3>दोष कम करने वाले कारक (परिहार)</h3><ul>${M.cancel.map((k) => `<li>${MCAN[k]}</li>`).join("")}</ul>` : ""}
      ${lvl !== "none" ? `<h3>सलाह</h3><ul>
        <li>${ageNow >= 28 ? "आपकी आयु 28 वर्ष से अधिक है — परंपरा में इसके बाद मंगल दोष का प्रभाव पहले ही काफ़ी कम माना जाता है।" : `परंपरा में 28 वर्ष की आयु के बाद दोष का प्रभाव कम माना जाता है — आपके लिए लगभग ${new Date(o.dob).getFullYear() + 28} के बाद।`}</li>
        <li>${lvl === "full" ? "ऐसे साथी से मिलान अच्छा माना जाता है जिसकी कुण्डली में भी मंगल या शनि 1, 4, 7, 8, 12वें भाव में हो।" : "सामान्य गुण मिलान के समय साथी की कुण्डली में मंगल देख लेना पर्याप्त है।"} केवल इस एक कारण से अच्छा रिश्ता न छोड़ें — पूरी कुण्डली मिलान करवाएँ।</li>
        <li>पारंपरिक उपाय: मंगलवार को हनुमान चालीसा, मसूर दाल का दान, गुस्से पर संयम और नियमित व्यायाम।</li></ul>` : ""}
      <div class="jc-act">
        <button class="jc-btn" type="button" id="mgShare">📲 रिज़ल्ट शेयर करें</button>
        <a class="jc-btn l" href="guna-milan-calculator.html">❤️ गुण मिलान करें</a>
        <a class="jc-btn l" href="consultation.html">ज्योतिषी से पूछें</a>
      </div>
      <div class="jc-up"><b>पूरी कुण्डली चाहिए?</b> विवाह का समय, जीवनसाथी, करियर और 25 वर्ष की दशा — <a href="kp-astrology.html">KP विस्तृत रिपोर्ट ₹299 →</a></div>
      <p class="jc-note">यह गणना लग्न, चंद्र और शुक्र — तीनों से 1, 4, 7, 8, 12 भाव के पारंपरिक नियम पर है। कुछ परंपराएँ 2रे भाव को भी गिनती हैं। विवाह जैसे निर्णय में पूरी कुण्डली मिलान करवाएँ।</p>`;
    $("#mgShare").addEventListener("click", () => C.share({ title: "मंगल दोष जाँच", sub: o.name || "", big: lvl === "none" ? "✓" : lvl === "mild" ? "आंशिक" : "मांगलिक", bigSize: lvl === "none" ? 160 : 90, bigSub: title, lines: rows.map(([a, h, f]) => `${a}: मंगल ${C.ov(h)} भाव — ${f ? "दोष" : "ठीक"}`).concat(M.cancel.length && lvl !== "none" ? [`${M.cancel.length} परिहार (दोष कम करने वाले कारक)`] : []) }, "manglik-result"));
    $("#mgRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track("calc_manglik", { level: lvl });
  }
})();
