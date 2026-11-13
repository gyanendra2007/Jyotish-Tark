/* Jyotish Tark — Guna milan (Ashtakoot, 36 guna) + quick compatibility check */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  const person = (p, t) => `<fieldset class="jc-full" style="border:1px solid #E8DCC4;border-radius:14px;padding:12px 14px;margin:0"><legend style="font-weight:800;color:#7A1F1F;padding:0 6px">${t}</legend><div class="jc-f">${C.fields(p, { nameReq: false, timeReq: true })}</div></fieldset>`;
  const personQ = (p, t) => `<fieldset class="jc-full" style="border:1px solid #E8DCC4;border-radius:14px;padding:12px 14px;margin:0"><legend style="font-weight:800;color:#7A1F1F;padding:0 6px">${t}</legend><div class="jc-f">${C.fields(p, { time: false, place: false })}</div></fieldset>`;
  host.innerHTML = `<div class="jc-tabs" role="group" aria-label="मिलान का तरीका"><button class="jc-tab" type="button" data-m="full" aria-pressed="true">पूरा गुण मिलान (36 गुण)</button><button class="jc-tab" type="button" data-m="quick" aria-pressed="false">Quick vibe check — सिर्फ़ जन्मतिथि</button><button class="jc-tab" type="button" data-m="invite" aria-pressed="false">💌 Partner को लिंक भेजें</button></div>
    <div id="gmInvite" hidden>
      <p style="margin:.2rem 0 .8rem">अपना विवरण भरें और लिंक अपने partner को भेजें। वे अपनी जन्मतिथि डालेंगे और आप दोनों का गुण मिलान खुल जाएगा। <b>आपका विवरण किसी सर्वर पर सेव नहीं होता</b> — वह सिर्फ़ लिंक के अंदर रहता है।</p>
      <form id="ivForm" class="jc-f" novalidate>
        <label>मैं हूँ *<select id="ivSelf"><option value="m">लड़का</option><option value="f">लड़की</option></select></label>
        ${C.fields("iv", { nameReq: true, timeReq: false })}
        <div class="jc-full"><button class="jc-btn" type="submit">💌 मिलान का लिंक बनाएँ</button><p class="jc-err" id="ivErr" hidden></p></div>
      </form>
      <div id="ivOut"></div>
    </div>
    <form id="gmForm" class="jc-f" novalidate>
      <div class="jc-full jc-f" id="gmFull">${person("gb", "👨 वर (लड़का)")}${person("gg", "👩 कन्या (लड़की)")}</div>
      <div class="jc-full jc-f" id="gmQuick" hidden>${personQ("qa", "पहला व्यक्ति (लड़का)")}${personQ("qb", "दूसरा व्यक्ति (लड़की)")}</div>
      <div class="jc-full"><button class="jc-btn" type="submit" id="gmBtn">गुण मिलान करें</button><p class="jc-note" id="gmHint">वैदिक अष्टकूट मिलान दोनों के जन्म-नक्षत्र से होता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।</p><p class="jc-err" id="gmErr" hidden></p></div>
    </form><div id="gmRes" class="jc-res" aria-live="polite"></div>`;
  ["gb", "gg", "iv"].forEach((p) => C.placeSearch($("#" + p + "Place"), $("#" + p + "PlaceList")));
  let mode = "full";
  host.querySelectorAll(".jc-tab").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    host.querySelectorAll(".jc-tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#gmFull").hidden = mode !== "full"; $("#gmQuick").hidden = mode !== "quick";
    $("#gmForm").hidden = mode === "invite"; $("#gmInvite").hidden = mode !== "invite";
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

  // ---------- partner invite: data travels only inside the link (#inv= / #res=) ----------
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const dec = (s) => { try { return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))))); } catch (e) { return null; } };
  const pack = (o, g) => ({ n: o.name || "", d: o.dob, t: o.time || "", p: o.place || "", la: isNaN(o.lat) ? "" : +(+o.lat).toFixed(4), lo: isNaN(o.lng) ? "" : +(+o.lng).toFixed(4), g });
  const unpack = (x) => ({ name: x.n || "", dob: x.d, time: x.t || "", place: x.p || "", lat: x.la === "" ? NaN : +x.la, lng: x.lo === "" ? NaN : +x.lo });
  const exact = (o) => !!(o.time && !isNaN(o.lat));
  const pageUrl = () => location.href.split("#")[0].split("?")[0];
  function runPair(A, B) { // A, B packed; returns after rendering
    const boy = A.g === "m" ? A : B, girl = A.g === "m" ? B : A, ob = unpack(boy), og = unpack(girl);
    C.ready(() => {
      try {
        if (exact(ob) && exact(og)) { const rb = C.chart(ob), rg = C.chart(og); show(ob, og, C.moonInfo(rb.P), C.moonInfo(rg.P), { ma: rb.X.manglik, mb: rg.X.manglik }); }
        else {
          const mb = exact(ob) ? { mid: C.moonInfo(C.chart(ob).P), x: false } : (() => { const d = C.dayMoon(ob.dob); return { mid: d.mid, x: d.nakChanges || d.signChanges }; })();
          const mg = exact(og) ? { mid: C.moonInfo(C.chart(og).P), x: false } : (() => { const d = C.dayMoon(og.dob); return { mid: d.mid, x: d.nakChanges || d.signChanges }; })();
          show(ob, og, mb.mid, mg.mid, { approx: [mb.x, mg.x], quick: true });
        }
        const res = $("#gmRes");
        res.insertAdjacentHTML("afterbegin", `<div class="jc-up" style="margin:0 0 14px"><b>💌 ${esc(A.n || "आपके partner")} ❤ ${esc(B.n || "आप")}</b> — यह रिज़ल्ट दोनों के लिए है।</div>`);
        res.insertAdjacentHTML("beforeend", `<div class="jc-act" id="ivBack"></div>`);
        const link = pageUrl() + "#res=" + enc([A, B]);
        const back = $("#ivBack");
        back.innerHTML = `<a class="jc-btn g" target="_blank" rel="noopener" href="${C.waShare(`हमारा कुंडली मिलान रिज़ल्ट आ गया ❤️ ${link}`)}">${esc(A.n || "Partner")} को रिज़ल्ट भेजें</a><a class="jc-btn l" href="${pageUrl()}#invite">💌 किसी और के साथ मिलान करें</a>`;
        C.track("milan_invite_result", {});
      } catch (er) { $("#gmRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    });
  }
  $("#ivForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const { o, miss } = C.read("iv", { name: true }), err = $("#ivErr");
    if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true;
    const link = pageUrl() + "#inv=" + enc(pack(o, $("#ivSelf").value));
    const msg = `${o.name} ने Jyotish Tark पर आपके साथ कुंडली मिलान शुरू किया है ❤️ अपनी जन्मतिथि डालिए और हमारा गुण मिलान देखिए: ${link}`;
    $("#ivOut").innerHTML = `<div class="jc-big"><div class="v">💌</div><div class="t"><b>आपका लिंक तैयार है!</b><br>इसे अपने partner को भेजें — वे अपना विवरण डालेंगे और रिज़ल्ट खुल जाएगा। फिर वे “रिज़ल्ट भेजें” दबाकर आपको भी दिखा सकते हैं।</div></div>
      <div class="jc-act"><a class="jc-btn g" target="_blank" rel="noopener" href="${C.waShare(msg)}">WhatsApp पर भेजें</a><button class="jc-btn l" type="button" id="ivCopy">लिंक कॉपी करें</button></div>
      <p class="jc-note">जन्म समय और स्थान भरने पर 36 गुण का सटीक मिलान होता है; केवल जन्मतिथि पर अनुमानित मिलान।</p>`;
    $("#ivCopy").addEventListener("click", async () => { try { await navigator.clipboard.writeText(link); $("#ivCopy").textContent = "✓ कॉपी हो गया"; } catch (er) { prompt("लिंक कॉपी करें:", link); } });
    C.track("milan_invite_create", { exact: exact(o) });
  });
  function boot() {
    const h = location.hash;
    if (h === "#invite") { const b = host.querySelector('[data-m="invite"]'); if (b) b.click(); return; }
    if (h.startsWith("#res=")) { const v = dec(h.slice(5)); if (Array.isArray(v) && v[0] && v[1]) { host.querySelector(".jc-tabs").hidden = true; $("#gmForm").hidden = true; runPair(v[0], v[1]); } return; }
    if (!h.startsWith("#inv=")) return;
    const A = dec(h.slice(5)); if (!A || !A.d) return;
    host.querySelector(".jc-tabs").hidden = true; $("#gmForm").hidden = true;
    const other = A.g === "m" ? "f" : "m";
    host.insertAdjacentHTML("afterbegin", `<div class="jc-big" style="margin-bottom:14px"><div class="v">💌</div><div class="t"><b>${esc(A.n || "किसी")} ने आपके साथ कुंडली मिलान शुरू किया है!</b><br>अपना विवरण भरें — आप दोनों का गुण मिलान तुरंत खुलेगा। (${other === "f" ? "आप: लड़की" : "आप: लड़का"})</div></div>
      <form id="rvForm" class="jc-f" novalidate>${C.fields("rv", { timeReq: false })}<div class="jc-full"><button class="jc-btn" type="submit">❤️ हमारा मिलान देखें</button><p class="jc-note">समय और स्थान भरने से मिलान सटीक होगा।</p><p class="jc-err" id="rvErr" hidden></p></div></form>`);
    C.placeSearch($("#rvPlace"), $("#rvPlaceList"));
    $("#rvForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const { o, miss } = C.read("rv", {}), err = $("#rvErr");
      if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
      err.hidden = true; $("#gmRes").innerHTML = `<p>गणना हो रही है…</p>`;
      runPair(A, pack(o, other));
    });
    C.track("milan_invite_open", {});
  }
  boot();
})();
