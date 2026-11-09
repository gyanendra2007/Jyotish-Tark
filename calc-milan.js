/* Jyotish Tark — Guna milan (Ashtakoot, 36 guna) + quick compatibility check */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  const person = (p, t) => `<fieldset class="jc-full" style="border:1px solid #E8DCC4;border-radius:14px;padding:12px 14px;margin:0"><legend style="font-weight:800;color:#7A1F1F;padding:0 6px">${t}</legend><div class="jc-f">${C.fields(p, { nameReq: false, timeReq: true })}</div></fieldset>`;
  const personQ = (p, t) => `<fieldset class="jc-full" style="border:1px solid #E8DCC4;border-radius:14px;padding:12px 14px;margin:0"><legend style="font-weight:800;color:#7A1F1F;padding:0 6px">${t}</legend><div class="jc-f">${C.fields(p, { time: false, place: false })}</div></fieldset>`;
  host.innerHTML = `<div class="jc-tabs" role="group" aria-label="मिलान का तरीका"><button class="jc-tab" type="button" data-m="full" aria-pressed="true">पूरा गुण मिलान (36 गुण)</button><button class="jc-tab" type="button" data-m="quick" aria-pressed="false">Quick vibe check — सिर्फ़ जन्मतिथि</button></div>
    <form id="gmForm" class="jc-f" novalidate>
      <div class="jc-full jc-f" id="gmFull">${person("gb", "👨 वर (लड़का)")}${person("gg", "👩 कन्या (लड़की)")}</div>
      <div class="jc-full jc-f" id="gmQuick" hidden>${personQ("qa", "पहला व्यक्ति (लड़का)")}${personQ("qb", "दूसरा व्यक्ति (लड़की)")}</div>
      <div class="jc-full"><button class="jc-btn" type="submit" id="gmBtn">गुण मिलान करें</button><p class="jc-note" id="gmHint">वैदिक अष्टकूट मिलान दोनों के जन्म-नक्षत्र से होता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।</p><p class="jc-err" id="gmErr" hidden></p></div>
    </form><div id="gmRes" class="jc-res" aria-live="polite"></div>`;
  ["gb", "gg"].forEach((p) => C.placeSearch($("#" + p + "Place"), $("#" + p + "PlaceList")));
  let mode = "full";
  host.querySelectorAll(".jc-tab").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    host.querySelectorAll(".jc-tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#gmFull").hidden = mode !== "full"; $("#gmQuick").hidden = mode !== "quick";
    $("#gmBtn").textContent = mode === "full" ? "गुण मिलान करें" : "Vibe check करें ✨";
    $("#gmHint").textContent = mode === "full" ? "वैदिक अष्टकूट मिलान दोनों के जन्म-नक्षत्र से होता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।" : "सिर्फ़ जन्मतिथि से चंद्र राशि का अनुमान लगाकर मिलान — मज़ेदार और जल्दी। विवाह के लिए “पूरा गुण मिलान” ही करें।";
  }));

  $("#gmForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#gmErr");
    const A = C.read(mode === "full" ? "gb" : "qa", mode === "full" ? { time: true, place: true } : {}), B = C.read(mode === "full" ? "gg" : "qb", mode === "full" ? { time: true, place: true } : {});
    const miss = A.miss.map((m) => "लड़का: " + m).concat(B.miss.map((m) => "लड़की: " + m));
    if (miss.length) { err.textContent = "कृपया भरें — " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true; $("#gmRes").innerHTML = `<p>गणना हो रही है…</p>`;
    C.ready(() => {
      try {
        if (mode === "full") {
          const ra = C.chart(A.o), rb = C.chart(B.o);
          show(A.o, B.o, C.moonInfo(ra.P), C.moonInfo(rb.P), { ma: ra.X.manglik, mb: rb.X.manglik });
        } else {
          const da = C.dayMoon(A.o.dob), db = C.dayMoon(B.o.dob);
          show(A.o, B.o, da.mid, db.mid, { approx: [da.nakChanges || da.signChanges, db.nakChanges || db.signChanges], quick: true });
        }
      } catch (er) { $("#gmRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    }, () => { $("#gmRes").innerHTML = `<p class="jc-err">पेज पूरा लोड नहीं हुआ — दोबारा कोशिश करें।</p>`; });
  });

  const VIBE = (t) => (t >= 32 ? "एक-दूसरे के लिए बने ✨ — दुर्लभ मेल" : t >= 25 ? "Strong match 💞 — थोड़ी समझ, बहुत सारा साथ" : t >= 18 ? "Theek-thaak 🙂 — कोशिश से रिश्ता खिलेगा" : "Opposites? 🤔 — पहले खुलकर बात, फिर फ़ैसला");
  const MLV = (m) => (m.level === "none" ? "मांगलिक नहीं" : m.level === "mild" ? "आंशिक मांगलिक" : "मांगलिक");

  function show(a, b, ma, mb, opt) {
    const { K, total, notes } = C.ashtakoot(ma, mb);
    const [v1, v2] = C.verdict(total);
    const na = a.name || "लड़का", nb = b.name || "लड़की";
    const pct = Math.round(total / 36 * 100);
    let mg = "";
    if (opt.ma) {
      const x = opt.ma.level !== "none", y = opt.mb.level !== "none";
      mg = `<h3>मंगल दोष मिलान</h3><p>${esc(na)}: <b>${MLV(opt.ma)}</b> · ${esc(nb)}: <b>${MLV(opt.mb)}</b> — ${x === y ? (x ? "दोनों मांगलिक हैं, इसलिए परंपरा में दोष आपस में संतुलित माना जाता है।" : "दोनों में मंगल दोष नहीं — इस दृष्टि से कोई बाधा नहीं।") : "एक मांगलिक और दूसरा नहीं — इसे पूरी कुण्डली देखकर ही तय करें; कई बार परिहार (दोष कम करने वाले कारक) मौजूद होते हैं। <a href=\"manglik-dosh-calculator.html\">मंगल दोष विस्तार से जाँचें</a>।"}</p>`;
    }
    $("#gmRes").innerHTML = `
      <div class="jc-big${total >= 18 ? " ok" : ""}"><div class="v">${total % 1 ? total.toFixed(1) : total}/36</div><div class="t"><b>${opt.quick ? VIBE(total) : `${v1} — ${v2}`}</b><br>${esc(na)} (${C.RASHI[ma.sign - 1]}, ${C.NAK[ma.nak - 1]}) और ${esc(nb)} (${C.RASHI[mb.sign - 1]}, ${C.NAK[mb.nak - 1]}) — ${pct}% अनुकूलता।</div></div>
      ${opt.quick && (opt.approx[0] || opt.approx[1]) ? `<p class="jc-note">⚠️ ${opt.approx[0] && opt.approx[1] ? "दोनों" : opt.approx[0] ? esc(na) : esc(nb)} के जन्मदिन पर चंद्रमा का नक्षत्र दिन में बदला था — इसलिए यह अनुमान है। सटीक मिलान के लिए “पूरा गुण मिलान” चुनें।</p>` : ""}
      <h3>अष्टकूट — आठों कूट का हिसाब</h3>
      <div class="jc-tw"><table class="jc-tbl"><thead><tr><th>कूट</th><th>क्या देखता है</th><th>${esc(na)}</th><th>${esc(nb)}</th><th>गुण</th></tr></thead><tbody>
      ${K.map((k) => `<tr><td><b>${k.k}</b></td><td>${k.m}</td><td>${esc(k.b)}</td><td>${esc(k.g)}</td><td><b>${k.s % 1 ? k.s.toFixed(1) : k.s}</b> / ${k.max}</td></tr>`).join("")}
      <tr><td colspan="4"><b>कुल</b></td><td><b>${total % 1 ? total.toFixed(1) : total} / 36</b></td></tr></tbody></table></div>
      ${notes.length ? `<h3>दोष और परिहार</h3><ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul>` : `<p>✓ नाड़ी, भकूट और गण — तीनों बड़े दोष नहीं हैं।</p>`}
      ${mg}
      <p><b>गुणों का पारंपरिक अर्थ:</b> 18 से कम — अनुशंसित नहीं · 18–24 — सामान्य · 25–32 — अच्छा · 33–36 — उत्तम।</p>
      <div class="jc-act"><button class="jc-btn" type="button" id="gmShare">📲 रिज़ल्ट शेयर करें</button><a class="jc-btn g" href="https://wa.me/918318513814?text=${encodeURIComponent(`नमस्ते, मुझे पूरी कुंडली मिलान करवानी है। गुण: ${total}/36`)}" target="_blank" rel="noopener">ज्योतिषी से पूरा मिलान करवाएँ</a></div>
      <div class="jc-up"><b>36 गुण ही सब कुछ नहीं।</b> विवाह में दोनों कुण्डलियों के सप्तम भाव, दशा और मंगल की स्थिति भी देखी जाती है — <a href="kundali-milan.html">पढ़ें: 36 गुण मिलने पर भी शादियाँ क्यों टूटती हैं</a></div>
      <p class="jc-note">यह गणना पारंपरिक अष्टकूट तालिकाओं से है (KP अयनांश से चंद्र नक्षत्र)। अलग-अलग पंचांगों में योनि और वश्य जैसे कूट की तालिकाओं में थोड़ा अंतर होता है, इसलिए कभी-कभी 1–2 गुण का फ़र्क दिख सकता है।</p>`;
    $("#gmShare").addEventListener("click", () => C.share({ title: opt.quick ? "Compatibility Vibe Check" : "गुण मिलान", sub: `${na} ❤ ${nb}`, big: `${total % 1 ? total.toFixed(1) : total}/36`, bigSize: 110, bigSub: opt.quick ? `${pct}% match` : v1, lines: [opt.quick ? VIBE(total) : v2, `${C.RASHI[ma.sign - 1]} + ${C.RASHI[mb.sign - 1]}`, `नाड़ी ${K[7].s}/8 · भकूट ${K[6].s}/7 · गण ${K[5].s}/6`] }, "guna-milan"));
    $("#gmRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track(opt.quick ? "calc_vibe" : "calc_milan", { total });
  }
})();
