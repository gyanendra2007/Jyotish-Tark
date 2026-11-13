/* Jyotish Tark — "आपका 2027": personal year card from real 2027 transits + numerology year */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  host.innerHTML = `<div class="jc-tabs" role="group" aria-label="कैसे देखें"><button class="jc-tab" type="button" data-m="birth" aria-pressed="true">जन्म विवरण से</button><button class="jc-tab" type="button" data-m="rashi" aria-pressed="false">मुझे अपनी राशि पता है</button></div>
    <form id="yrForm" class="jc-f" novalidate>
      <div class="jc-full jc-f" id="yrBirth">${C.fields("yr", { timeReq: false })}</div>
      <label class="jc-full" id="yrRashiL" hidden>आपकी चंद्र राशि *<select id="yrRashi"><option value="">— राशि चुनें —</option>${C.RASHI.map((r, i) => `<option value="${i + 1}">${r} (${C.RASHI_EN[i]})</option>`).join("")}</select></label>
      <div class="jc-full"><button class="jc-btn" type="submit">✨ मेरा 2027 देखें</button><p class="jc-err" id="yrErr" hidden></p></div>
    </form><div id="yrRes" class="jc-res" aria-live="polite"></div>`;
  C.placeSearch($("#yrPlace"), $("#yrPlaceList"));
  let mode = "birth";
  host.querySelectorAll(".jc-tab").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m; host.querySelectorAll(".jc-tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#yrBirth").hidden = mode !== "birth"; $("#yrRashiL").hidden = mode !== "rashi";
  }));
  const MON = C.MON;
  const SLUG = ["mesh", "vrishabh", "mithun", "kark", "singh", "kanya", "tula", "vrishchik", "dhanu", "makar", "kumbh", "meen"];
  const hFrom = (a, b) => ((b - a + 12) % 12) + 1;
  const FAV = { Sun: [3, 6, 10, 11], Mars: [3, 6, 11], Mercury: [2, 4, 6, 8, 10, 11], Jupiter: [2, 5, 7, 9, 11], Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12], Saturn: [3, 6, 11], Rahu: [3, 6, 11] };
  const W = { Jupiter: 3, Saturn: 3, Rahu: 1.5, Mars: 1, Sun: 1, Venus: 0.7, Mercury: 0.5 };
  const ORD = ["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"];
  const JUP = ["ज़िम्मेदारियाँ और आत्मविकास; सेहत-वज़न पर ध्यान", "धन संचय, परिवार में शुभ कार्य", "मेहनत अधिक, फल धीरे; भाई-बहनों से सहयोग", "घर-परिवार पर ध्यान; माता की सेहत", "पढ़ाई, संतान और प्रेम के लिए बहुत शुभ", "काम का दबाव, कर्ज़ और खर्च पर नियंत्रण", "विवाह, साझेदारी और मान-सम्मान के योग", "रुकावटें और अनचाहे खर्च — धैर्य", "भाग्य प्रबल; तीर्थ, गुरु और उच्च शिक्षा", "करियर में बदलाव — सोच-समझकर निर्णय", "आय, लाभ और इच्छा-पूर्ति के प्रबल योग", "खर्च, यात्रा और आध्यात्मिकता"];
  const SAT = ["साढ़ेसाती का शिखर — मेहनत ज़्यादा, धैर्य ज़रूरी", "साढ़ेसाती का अंतिम चरण — धन-परिवार में संयम", "मेहनत का पक्का फल; साहस बढ़ेगा", "ढैय्या (कंटक शनि) — घर और मन पर दबाव", "पढ़ाई-संतान से जुड़ी चिंता; धैर्य", "शत्रुओं पर जीत, नौकरी में स्थिरता", "रिश्तों और साझेदारी में ज़िम्मेदारी", "ढैय्या (अष्टम शनि) — सेहत और अचानक बदलावों में सावधानी", "भाग्य धीमा; बड़ों से मतभेद टालें", "काम का बोझ, पर मेहनत से पद पक्का", "लंबे समय से रुके लाभ मिलेंगे", "साढ़ेसाती का आरंभ — खर्च और नींद पर ध्यान"];
  const RAH = ["मन में भ्रम — बड़े निर्णय सोच-समझकर", "वाणी और खान-पान पर नियंत्रण", "साहस और नए संपर्कों से लाभ", "घर में अशांति; संपत्ति के काग़ज़ जाँचें", "सट्टे और शॉर्टकट से बचें", "विरोधियों पर विजय", "रिश्तों में ग़लतफ़हमी से बचें", "छिपे जोखिम; सेहत की जाँच", "परंपरा से हटकर सोच", "करियर में अचानक बदलाव", "अप्रत्याशित लाभ और बड़ा नेटवर्क", "फ़िज़ूलखर्च और विदेश से जुड़ाव"];
  const PY = { 1: ["नई शुरुआत", "नई योजनाएँ, नया काम, आत्मनिर्भरता — जो बोएँगे वह 9 साल चलेगा।", "लाल / सुनहरा"], 2: ["साझेदारी", "धैर्य, रिश्ते और सहयोग का साल; जल्दबाज़ी नहीं, तालमेल।", "सफ़ेद / क्रीम"], 3: ["अभिव्यक्ति", "रचनात्मकता, सामाजिक मेल-जोल और अपनी बात कहने का साल।", "पीला"], 4: ["नींव", "मेहनत, अनुशासन और मज़बूत नींव बनाने का साल।", "नीला-ग्रे"], 5: ["बदलाव", "यात्रा, बदलाव और नए अनुभवों का साल; लचीले रहें।", "हरा"], 6: ["परिवार", "घर, प्रेम, ज़िम्मेदारी और सेवा का साल।", "गुलाबी"], 7: ["आत्मचिंतन", "सीखने, शोध और भीतर झाँकने का साल; अकेले समय की ज़रूरत।", "आसमानी / बैंगनी"], 8: ["उपलब्धि", "धन, पद और बड़े लक्ष्यों का साल; मेहनत का हिसाब मिलेगा।", "गहरा नीला"], 9: ["समापन", "पुराना छोड़ने, पूरा करने और देने का साल; अगले चक्र की तैयारी।", "लाल / मैरून"] };
  const red = (n) => { while (n > 9) n = String(n).split("").reduce((a, b) => a + +b, 0); return n; };

  $("#yrForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#yrErr"); let o = { name: "" }, R = 0;
    if (mode === "rashi") { R = +$("#yrRashi").value; if (!R) { err.textContent = "कृपया अपनी राशि चुनें।"; err.hidden = false; return; } }
    else { const r = C.read("yr", {}); o = r.o; if (r.miss.length) { err.textContent = "कृपया भरें: " + r.miss.join(", ") + "।"; err.hidden = false; return; } }
    err.hidden = true; $("#yrRes").innerHTML = `<p>2027 के ग्रह-गोचर की गणना हो रही है…</p>`;
    C.ready(() => setTimeout(() => {
      try {
        let note = "";
        if (mode === "birth") {
          if (o.time && !isNaN(o.lat)) R = C.chart(o).P.Moon.sign;
          else { const d = C.dayMoon(o.dob); R = d.mid.sign; if (d.signChanges) note = "उस दिन चंद्रमा ने राशि बदली थी — सटीक राशि के लिए जन्म समय भरें।"; }
        }
        show(R, o, note);
      } catch (er) { $("#yrRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    }, 30));
  });

  const pos = (d) => window.JTKP.compute({ dob: d, time: "12:00", lat: 26.8467, lng: 80.9462 }).planets;
  let CACHE = null;
  function year() {
    if (CACHE) return CACHE;
    const months = [...Array(12)].map((_, m) => pos(`2027-${String(m + 1).padStart(2, "0")}-15`));
    const ev = []; let prev = pos("2026-12-31");
    for (let t = Date.UTC(2027, 0, 1); t <= Date.UTC(2027, 11, 31); t += 2 * 864e5) {
      const d = new Date(t), P = pos(d.toISOString().slice(0, 10));
      ["Jupiter", "Saturn", "Rahu"].forEach((p) => { if (P[p].sign !== prev[p].sign) ev.push({ p, d, sign: P[p].sign }); });
      prev = P;
    }
    CACHE = { months, ev, start: pos("2027-01-01") };
    return CACHE;
  }
  function show(R, o, note) {
    const Y = year();
    const ms = Y.months.map((P, i) => { let s = 0; Object.keys(W).forEach((p) => { s += (FAV[p].includes(hFrom(R, P[p].sign)) ? 1 : -1) * W[p]; }); return { i, s, P }; });
    const sorted = ms.slice().sort((a, b) => b.s - a.s);
    const best = sorted.slice(0, 3).sort((a, b) => a.i - b.i), hard = sorted.slice(-2).sort((a, b) => a.i - b.i);
    const avg = ms.reduce((a, x) => a + x.s, 0) / 12, lo = Math.min(...ms.map((x) => x.s)), hi = Math.max(...ms.map((x) => x.s));
    const jH = hFrom(R, Y.start.Jupiter.sign), sH = hFrom(R, Y.start.Saturn.sign);
    const ss = [12, 1, 2].includes(sH) || Y.ev.some((e) => e.p === "Saturn" && [12, 1, 2].includes(hFrom(R, e.sign)));
    const theme = avg >= 3 ? "उन्नति का वर्ष" : FAV.Jupiter.includes(jH) ? "अवसरों का वर्ष" : ss ? "धैर्य और मज़बूती का वर्ष" : avg >= -1 ? "संतुलन का वर्ष" : "मेहनत और तैयारी का वर्ष";
    const py = o.dob ? red(+o.dob.slice(8, 10) + +o.dob.slice(5, 7) + 2 + 0 + 2 + 7) : 0;
    const P0 = PY[py];
    const evRows = Y.ev.map((e) => { const h = hFrom(R, e.sign), T = e.p === "Jupiter" ? JUP : e.p === "Saturn" ? SAT : RAH; return `<li><b>${C.dmy(e.d)} के आसपास — ${C.PN[e.p]} ${C.RASHI[e.sign - 1]} राशि में</b> (आपकी राशि से ${ORD[h - 1]} भाव): ${T[h - 1]}।</li>`; });
    const nm = o.name || "आप";
    const R0 = C.RASHI[R - 1];
    $("#yrRes").innerHTML = `${note ? `<p class="jc-note">⚠️ ${esc(note)}</p>` : ""}
      <div class="jc-big${avg >= 0 ? " ok" : ""}"><div class="v" style="font-size:1.9rem">${theme}</div><div class="t"><b>${esc(nm)} का 2027 (${R0} राशि)</b><br>साल की शुरुआत में गुरु आपकी राशि से ${ORD[jH - 1]} भाव (${JUP[jH - 1]}) और शनि ${ORD[sH - 1]} भाव (${SAT[sH - 1]}) में।</div></div>
      <h3>2027 के बड़े ग्रह-परिवर्तन और आप पर असर</h3>${evRows.length ? `<ul>${evRows.join("")}</ul>` : "<p>2027 में गुरु, शनि या राहु राशि नहीं बदलते — पूरा साल ऊपर वाली स्थिति रहेगी।</p>"}
      <h3>सबसे अच्छे महीने</h3><div class="jc-chips">${best.map((x) => `<span class="jc-chip" style="background:#E3F4E7;border-color:#4F9D63;color:#14532D">✨ ${MON[x.i]}</span>`).join("")}</div>
      <p class="jc-note">इन महीनों में ग्रह आपकी राशि के लिए सबसे अनुकूल भावों में हैं — नई शुरुआत, इंटरव्यू, ख़रीदारी या शुभ कार्य के लिए उपयोग करें।</p>
      <h3>सावधानी वाले महीने</h3><div class="jc-chips">${hard.map((x) => `<span class="jc-chip">⚠️ ${MON[x.i]}</span>`).join("")}</div>
      <p class="jc-note">इन महीनों में बड़े जोखिम, विवाद और जल्दबाज़ी के फ़ैसले टालें; सेहत और खर्च पर ध्यान दें।</p>
      <h3>महीनेवार ग्राफ़</h3><p class="jc-note">ऊँचा = आपके लिए अधिक अनुकूल। हरा = सबसे अच्छे, नारंगी = सावधानी वाले महीने।</p><div style="display:grid;grid-template-columns:repeat(12,1fr);gap:4px;align-items:end;height:120px;margin:6px 0 4px">${ms.map((x) => { const v = Math.round(15 + 85 * (x.s - lo) / (hi - lo || 1)); const c = best.includes(x) ? "#4F9D63" : hard.includes(x) ? "#C2410C" : "#D9B56A"; return `<div title="${MON[x.i]}" style="height:${v}%;border-radius:6px 6px 0 0;background:${c}"></div>`; }).join("")}</div><div style="display:grid;grid-template-columns:repeat(12,1fr);gap:4px;font-size:12px;text-align:center">${MON.map((m) => m.slice(0, 3)).join("</div><div>").replace(/^/, "<div>")}</div></div>
      ${P0 ? `<h3>अंक ज्योतिष: आपका पर्सनल ईयर ${py} — “${P0[0]}”</h3><p>${P0[1]} <b>2027 का शुभ रंग:</b> ${P0[2]}।</p>` : ""}
      <div class="jc-act"><button class="jc-btn" type="button" id="yrShare">📲 मेरा 2027 कार्ड शेयर करें</button><a class="jc-btn l" href="${SLUG[R - 1]}-rashifal-2027.html">${R0} राशिफल 2027 विस्तार से</a></div>
      <div class="jc-up"><b>राशि सबकी एक जैसी होती है, कुण्डली नहीं।</b> 2027 में आपकी अपनी दशा कैसी है? — <a href="kp-astrology.html">KP विस्तृत रिपोर्ट ₹299 →</a> · <a href="numerology.html#nm-sample">अंक ज्योतिष रिपोर्ट →</a></div>
      <p class="jc-note">यह गणना 2027 के वास्तविक ग्रह-गोचर (KP अयनांश) को आपकी चंद्र राशि से देखकर की गई है। यह सामान्य मार्गदर्शन है, गारंटी नहीं।</p>`;
    $("#yrShare").addEventListener("click", () => C.share({ title: "मेरा 2027 ✨", sub: `${o.name ? o.name + " · " : ""}${R0} राशि`, big: theme.replace(" का वर्ष", ""), bigSize: theme.length > 14 ? 70 : 84, bigSub: "का वर्ष", lines: [`अच्छे महीने: ${best.map((x) => MON[x.i]).join(", ")}`, `सावधानी: ${hard.map((x) => MON[x.i]).join(", ")}`].concat(P0 ? [`पर्सनल ईयर ${py} — ${P0[0]} · रंग: ${P0[2]}`] : []), foot: "आप भी देखें — मुफ़्त “आपका 2027”" }, "mera-2027"));
    $("#yrRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track("calc_2027", { rashi: R });
  }
})();
