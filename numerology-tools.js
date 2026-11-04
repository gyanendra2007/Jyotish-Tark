/* Jyotish Tark — numerology.html extra tools: mobile number numerology + mulank milan.
   General numerology guidance only; lucky-number sets match the page's main calculator. */
(function () {
  "use strict";
  const PLANET = { 1: "सूर्य", 2: "चंद्र", 3: "गुरु", 4: "राहु", 5: "बुध", 6: "शुक्र", 7: "केतु", 8: "शनि", 9: "मंगल" };
  const LUCKY = { 1: [1, 2, 3, 9], 2: [1, 2, 5, 7], 3: [1, 2, 3, 9], 4: [1, 4, 5, 6, 8], 5: [1, 3, 5, 6], 6: [3, 5, 6, 8, 9], 7: [1, 2, 4, 5, 7], 8: [3, 4, 5, 6, 8], 9: [1, 3, 6, 9] };
  // Mobile number totals 1–9: in-depth meaning (general numerology guidance, our own words)
  const MOBILE = {
    1: { name: "नेतृत्व और पहचान", nature: "यह अंक आत्मविश्वास, पहल और पहचान से जुड़ा है। ऐसे नंबर से की गई बातचीत में अधिकार और स्पष्टता झलकती मानी जाती है।", good: "अपना व्यवसाय, प्रशासन, सरकारी काम, मैनेजर, टीम लीडर, राजनीति, डॉक्टर", care: "अहंकार और जल्दबाज़ी में फ़ैसले से बचें; साझेदारी में दूसरों की राय भी सुनें।", for: "मूलांक 1, 2, 3, 9 वालों के लिए सबसे अनुकूल माना जाता है।" },
    2: { name: "सहयोग और भावना", nature: "यह अंक कोमलता, सहयोग और रिश्तों से जुड़ा है। लोगों से जुड़ाव और भरोसा बनाने में मददगार माना जाता है।", good: "सेवा क्षेत्र, नर्सिंग, काउंसलिंग, कला-संगीत, होटल-फ़ूड, डेयरी व जल से जुड़े काम", care: "मन जल्दी बदलना और फ़ैसलों में देर — ज़रूरी कामों के लिए समय-सीमा तय रखें।", for: "मूलांक 1, 2, 5, 7 वालों के लिए अनुकूल माना जाता है।" },
    3: { name: "ज्ञान और मार्गदर्शन", nature: "यह अंक ज्ञान, सलाह और सम्मान से जुड़ा है। लोग ऐसे नंबर वाले व्यक्ति की बात को गंभीरता से लेते हैं, ऐसा माना जाता है।", good: "शिक्षक, कोचिंग, वकील, बैंक-वित्त, सलाहकार, धार्मिक व सामाजिक काम", care: "ज़्यादा भरोसे में आकर किसी को उधार या गारंटी देने से बचें।", for: "मूलांक 1, 2, 3, 9 वालों के लिए सबसे अनुकूल माना जाता है।" },
    4: { name: "बदलाव और नई सोच", nature: "यह अंक अचानक बदलाव, तकनीक और लीक से हटकर सोचने से जुड़ा है। नए विचार और नेटवर्क बनते हैं, पर उतार-चढ़ाव भी रहता है।", good: "आईटी-तकनीक, सोशल मीडिया, रिसर्च, इंजीनियरिंग, विदेश से जुड़ा काम", care: "बातचीत में ग़लतफ़हमी और अचानक ख़र्च की संभावना — लेन-देन लिखित में रखें।", for: "मूलांक 1, 4, 5, 6, 8 वालों के लिए अनुकूल माना जाता है।" },
    5: { name: "संचार और व्यापार", nature: "यह अंक बुध का है — बातचीत, व्यापार, नेटवर्किंग और तेज़ी का अंक। मोबाइल नंबर के लिए सबसे लोकप्रिय योग माना जाता है।", good: "सेल्स, मार्केटिंग, व्यापार, एजेंसी, मीडिया, टूर-ट्रैवल, अकाउंट्स, ऑनलाइन काम", care: "बहुत सारे काम एक साथ शुरू करने से बचें; वादे उतने ही करें जितने निभा सकें।", for: "मूलांक 1, 3, 5, 6 वालों के लिए सबसे अनुकूल माना जाता है।" },
    6: { name: "आकर्षण और सुख", nature: "यह अंक शुक्र का है — सुंदरता, आकर्षण, परिवार और ग्राहकों से अच्छे संबंध का अंक।", good: "फ़ैशन, ब्यूटी, डिज़ाइन, कला-फ़िल्म, होटल, ज्वेलरी, वाहन व लग्ज़री व्यवसाय", care: "दिखावे और ज़रूरत से ज़्यादा ख़र्च पर नियंत्रण रखें।", for: "मूलांक 3, 5, 6, 8, 9 वालों के लिए अनुकूल माना जाता है।" },
    7: { name: "चिंतन और शोध", nature: "यह अंक केतु का है — गहराई, अंतर्ज्ञान, शोध और आध्यात्म का अंक। निजी और शांत काम के लिए अच्छा माना जाता है।", good: "लेखन, शोध, विज्ञान, ज्योतिष-आध्यात्म, डेटा-विश्लेषण, विदेश सेवा", care: "व्यापार या सेल्स के लिए यह योग धीमा माना जाता है; बातचीत में स्पष्टता रखें।", for: "मूलांक 1, 2, 4, 5, 7 वालों के लिए अनुकूल माना जाता है।" },
    8: { name: "मेहनत और धैर्य", nature: "यह अंक शनि का है — अनुशासन, ज़िम्मेदारी और लंबी मेहनत का अंक। परिणाम देर से पर टिकाऊ आते हैं, ऐसा माना जाता है।", good: "क़ानून, प्रशासन, उद्योग, निर्माण, रियल एस्टेट, खनन, लंबे प्रोजेक्ट", care: "जल्दी परिणाम चाहने वालों को धैर्य रखना होगा; काम का बोझ बढ़ सकता है।", for: "मूलांक 3, 4, 5, 6, 8 वालों के लिए अनुकूल माना जाता है।" },
    9: { name: "ऊर्जा और साहस", nature: "यह अंक मंगल का है — जोश, साहस, प्रतियोगिता और तेज़ी से काम करने का अंक।", good: "खेल, फ़िटनेस, सेना-पुलिस, सुरक्षा, ज़मीन-जायदाद, इंजीनियरिंग, सर्जरी", care: "गुस्से में बात करने और जल्दबाज़ी से बचें; बहस को झगड़े में न बदलने दें।", for: "मूलांक 1, 3, 6, 9 वालों के लिए सबसे अनुकूल माना जाता है।" }
  };
  // last digit of the number
  const ENDING = {
    0: "शून्य का कोई ग्रह नहीं — यह पिछले अंक के प्रभाव को बढ़ाता या धीमा करता माना जाता है।",
    1: "सूर्य — पहचान और आत्मविश्वास देने वाला अंत।", 2: "चंद्र — मधुर बातचीत और सहयोग वाला अंत।", 3: "गुरु — सम्मान और सलाह वाला अंत।",
    4: "राहु — नई सोच, पर अनिश्चितता वाला अंत।", 5: "बुध — व्यापार और संचार के लिए अच्छा अंत।", 6: "शुक्र — आकर्षण और ग्राहकों के लिए अच्छा अंत।",
    7: "केतु — शांत और निजी काम वाला अंत।", 8: "शनि — धीमा पर स्थिर अंत।", 9: "मंगल — ऊर्जा और तेज़ी वाला अंत।"
  };
  // Parashari natural friendship of the number planets (Rahu treated like Saturn, Ketu like Mars)
  const REL = {
    1: { f: [2, 3, 9], e: [6, 8, 4] }, 2: { f: [1, 5], e: [] }, 3: { f: [1, 2, 9, 7], e: [5, 6] },
    4: { f: [5, 6, 8], e: [1, 2, 9, 7] }, 5: { f: [1, 6], e: [2] }, 6: { f: [5, 8, 4], e: [1, 2] },
    7: { f: [1, 2, 3], e: [5, 4] }, 8: { f: [5, 6, 4], e: [1, 2, 9, 7] }, 9: { f: [1, 2, 3, 7], e: [5] }
  };
  const rel = (a, b) => (a === b ? "f" : (REL[a].f.includes(b) ? "f" : (REL[a].e.includes(b) ? "e" : "n")));
  function pairKind(a, b) {
    const x = rel(a, b), y = rel(b, a);
    if (x === "e" || y === "e") return (x === "e" && y === "e") ? "e" : "m";
    return (x === "f" && y === "f") ? "f" : "n";
  }
  const CHALD = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };
  const PURPOSE = { business: [5, 6, 1, 3], job: [1, 3, 5, 8], creative: [6, 2, 3, 5], personal: [] };
  const root = (n) => { n = Math.abs(Number(n) || 0); while (n > 9) n = String(n).split("").reduce((a, b) => a + Number(b), 0); return n; };
  const sumDigits = (s) => String(s).replace(/\D/g, "").split("").reduce((a, b) => a + Number(b), 0);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function fromDob(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    if (!m) return null;
    return { mulank: root(Number(m[3])), bhagyank: root(sumDigits(m[1] + m[2] + m[3])) };
  }
  function match(a, b) {
    const ab = LUCKY[a].includes(b), ba = LUCKY[b].includes(a);
    if (ab && ba) return { k: "good", t: "उत्तम मेल", d: "दोनों अंक एक-दूसरे के अनुकूल माने जाते हैं।" };
    if (ab || ba) return { k: "ok", t: "अच्छा मेल", d: "एक अंक दूसरे के अनुकूल है — सामान्यतः ठीक माना जाता है।" };
    return { k: "mid", t: "सामान्य मेल", d: "दोनों अंक एक-दूसरे की अनुकूल सूची में नहीं हैं — आपसी समझ और धैर्य से संतुलन बनता है।" };
  }
  const chip = (m) => `<span class="nm-chip nm-${m.k}">${m.t}</span>`;

  function mobile(e) {
    e.preventDefault();
    const f = e.target, out = document.getElementById("nmMobOut");
    const digits = (f.mob.value || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (digits.length !== 10) { out.innerHTML = `<p class="nm-err" role="alert">कृपया 10 अंकों का मोबाइल नंबर लिखें।</p>`; f.mob.focus(); return; }
    const D = digits.split("").map(Number);
    const total = D.reduce((a, b) => a + b, 0), r = root(total);
    const mid = total > 9 ? `${total} → ${String(total).split("").join(" + ")} = ${sumDigits(total)}${sumDigits(total) > 9 ? " → " + root(total) : ""}` : String(total);
    const counts = Array.from({ length: 10 }, (_, d) => D.filter((x) => x === d).length);
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !counts[d]);
    const last = D[9];
    const p = fromDob(f.dob.value);
    const nm = (f.nm && f.nm.value || "").toUpperCase().replace(/[^A-Z]/g, "");
    const namank = nm ? root(nm.split("").reduce((a, c) => a + (CHALD[c] || 0), 0)) : null;
    const purpose = f.purpose ? f.purpose.value : "personal";

    // adjacent pairs (zeros skipped)
    const pairs = [];
    for (let i = 0; i < 9; i++) { const a = D[i], b = D[i + 1]; if (a && b) pairs.push({ a, b, k: pairKind(a, b) }); }
    const pc = { f: 0, n: 0, m: 0, e: 0 }; pairs.forEach((x) => pc[x.k]++);
    const pairLbl = { f: "अनुकूल", n: "सामान्य", m: "मिश्रित", e: "चुनौती वाला" };

    // score (only meaningful with a birth date)
    let score = null, parts = [];
    if (p) {
      const pts = { good: 15, ok: 8, mid: 0 };
      const m1 = match(p.mulank, r), m2 = match(p.bhagyank, r);
      score = 45 + pts[m1.k] + pts[m2.k];
      parts.push(["कुल योग बनाम मूलांक", m1], ["कुल योग बनाम भाग्यांक", m2]);
      if (last && LUCKY[p.mulank].includes(last)) score += 6;
      score += pc.f * 2 + pc.n * 0.5 - pc.m * 1 - pc.e * 2.5;
      if (counts[0] >= 3) score -= 3;
      if (namank) { const m3 = match(namank, r); score += { good: 6, ok: 3, mid: 0 }[m3.k]; parts.push(["कुल योग बनाम नामांक", m3]); }
      if (PURPOSE[purpose] && PURPOSE[purpose].length) score += PURPOSE[purpose].includes(r) ? 5 : 0;
      score = Math.round(Math.max(20, Math.min(97, score)));
    }
    const band = score == null ? null : (score >= 80 ? ["बहुत अनुकूल", "good"] : (score >= 62 ? ["अनुकूल", "good"] : (score >= 45 ? ["सामान्य", "ok"] : ["कम अनुकूल", "mid"])));
    const M = MOBILE[r];

    // suggested totals for a new number
    let sugg = [];
    if (p) {
      const common = LUCKY[p.mulank].filter((x) => LUCKY[p.bhagyank].includes(x));
      sugg = (common.length ? common : LUCKY[p.mulank]).slice();
      const pur = PURPOSE[purpose] || [];
      if (pur.length) sugg.sort((a, b) => (pur.includes(b) ? 1 : 0) - (pur.includes(a) ? 1 : 0));
    }
    const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<div class="nm-g${counts[d] ? "" : " nm-g0"}"><b>${d}</b><small>${d ? PLANET[d] : "शून्य"}</small><span>${counts[d] ? counts[d] + " बार" : "नहीं"}</span></div>`).join("");

    out.innerHTML = `<div class="nm-res nm-mobrep">
      <div class="nm-big"><small>नंबर ${esc(digits.slice(0, 5))} ${esc(digits.slice(5))} का कुल योग</small><b>${r}</b><span>${PLANET[r]} · ${M.name}</span></div>
      <p class="nm-small">गणना: ${D.join(" + ")} = ${mid}</p>
      ${score != null ? `<div class="nm-score"><div class="nm-score-n"><b>${score}</b><small>/ 100</small></div><div><span class="nm-chip nm-${band[1]}">${band[0]}</span><p class="nm-small" style="margin:6px 0 0">आपकी जन्मतिथि${namank ? ", नाम" : ""} और नंबर के अंकों के मेल पर आधारित अंक-मेल स्कोर</p></div></div>` : `<p class="nm-note"><b>अपनी जन्मतिथि भी डालें</b> — तब यह नंबर आपके मूलांक और भाग्यांक से कितना मेल खाता है, उसका स्कोर भी दिखेगा।</p>`}

      <h3>1. इस नंबर का स्वभाव — अंक ${r} (${PLANET[r]})</h3>
      <p>${M.nature}</p>
      <div class="nm-kv"><div><small>किन कामों के लिए अच्छा</small><b>${M.good}</b></div><div><small>सावधानी</small><b>${M.care}</b></div></div>
      <p class="nm-note">${M.for}</p>

      ${p ? `<h3>2. आपके अंकों से मेल</h3>
      ${parts.map(([l, m]) => `<div class="nm-row"><span>${l}</span>${chip(m)}</div>`).join("")}
      <div class="nm-row"><span>आपका मूलांक / भाग्यांक${namank ? " / नामांक" : ""}</span><b>${p.mulank} (${PLANET[p.mulank]}) / ${p.bhagyank} (${PLANET[p.bhagyank]})${namank ? ` / ${namank} (${PLANET[namank]})` : ""}</b></div>` : ""}

      <h3>${p ? 3 : 2}. आख़िरी अंक — ${last}</h3>
      <p>${ENDING[last]}${p && last ? (LUCKY[p.mulank].includes(last) ? " यह आपके मूलांक के अनुकूल अंकों में है।" : " यह आपके मूलांक की अनुकूल सूची में नहीं है।") : ""}</p>

      <h3>${p ? 4 : 3}. अंकों का चार्ट — कौन-सा अंक कितनी बार</h3>
      <div class="nm-grid">${grid}</div>
      <p class="nm-note">${missing.length ? `इस नंबर में <b>${missing.join(", ")}</b> (${missing.map((d) => PLANET[d]).join(", ")}) ${missing.length > 1 ? "नहीं हैं" : "नहीं है"}।` : "इस नंबर में 1 से 9 तक सभी अंक मौजूद हैं।"} ${counts[0] >= 3 ? `शून्य ${counts[0]} बार है — ज़्यादा शून्य को प्रभाव कम करने वाला माना जाता है।` : ""} ${counts.map((c, d) => (c >= 3 && d ? `${d} (${PLANET[d]}) ${c} बार है — इस ग्रह का प्रभाव ज़्यादा माना जाता है।` : "")).filter(Boolean).join(" ")}</p>

      <h3>${p ? 5 : 4}. आसपास के अंकों के जोड़े</h3>
      <p class="nm-small" style="margin-top:0">नंबर में साथ-साथ आने वाले अंकों के ग्रहों की आपसी मित्रता (शून्य वाले जोड़े छोड़े गए):</p>
      <div class="nm-pairs">${pairs.map((x) => `<span class="nm-pair nm-p${x.k}">${x.a}${x.b}<small>${pairLbl[x.k]}</small></span>`).join("") || "<span class='nm-small'>—</span>"}</div>
      <p class="nm-note">अनुकूल ${pc.f} · सामान्य ${pc.n} · मिश्रित ${pc.m} · चुनौती वाले ${pc.e}</p>

      <h3>${p ? 6 : 5}. सुझाव</h3>
      <ul>
        ${p ? `<li>नया नंबर लेते समय कुल योग <b>${sugg.join(", ")}</b> वाला नंबर आपके लिए अनुकूल माना जाता है${PURPOSE[purpose] && PURPOSE[purpose].length ? " (आपके चुने हुए उपयोग के हिसाब से क्रम में)" : ""}।</li>` : ""}
        <li>आख़िरी अंक 0 या बहुत सारे शून्य वाले नंबर की जगह ऐसा नंबर चुनें जिसका अंत आपके अनुकूल अंक पर हो।</li>
        <li>केवल अंक ज्योतिष के लिए चालू नंबर बदलना ज़रूरी नहीं — काम, पहचान और सुविधा ज़्यादा ज़रूरी हैं।</li>
      </ul>
      <p class="nm-small">अंक ज्योतिष के सामान्य संकेत — गारंटी नहीं। आपका नंबर इस वेबसाइट पर सेव नहीं होता।</p>
      <p class="nm-small">व्यक्तिगत सलाह चाहिए? <a href="consultation.html">ज्योतिषी से बात करें</a> — पहले 5 मिनट मुफ़्त।</p></div>`;
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    try { if (window.gtag) window.gtag("event", "mobile_numerology", { root: r, score: score }); } catch (err) { /* ignore */ }
  }

  function milan(e) {
    e.preventDefault();
    const f = e.target, out = document.getElementById("nmMilOut");
    const a = fromDob(f.d1.value), b = fromDob(f.d2.value);
    if (!a || !b) { out.innerHTML = `<p class="nm-err" role="alert">कृपया दोनों जन्मतिथियाँ भरें।</p>`; return; }
    const m1 = match(a.mulank, b.mulank), m2 = match(a.bhagyank, b.bhagyank);
    const score = { good: 2, ok: 1, mid: 0 }; const s = score[m1.k] + score[m2.k];
    const verdict = s >= 3 ? "अंकों के हिसाब से बहुत अच्छा मेल" : (s >= 2 ? "अंकों के हिसाब से अच्छा मेल" : (s === 1 ? "सामान्य मेल — समझदारी से अच्छा निभ सकता है" : "अंक अलग स्वभाव दिखाते हैं — एक-दूसरे को समझने पर ज़्यादा ध्यान दें"));
    out.innerHTML = `<div class="nm-res">
      <div class="nm-row"><span>मूलांक ${a.mulank} (${PLANET[a.mulank]}) और ${b.mulank} (${PLANET[b.mulank]})</span>${chip(m1)}</div>
      <div class="nm-row"><span>भाग्यांक ${a.bhagyank} (${PLANET[a.bhagyank]}) और ${b.bhagyank} (${PLANET[b.bhagyank]})</span>${chip(m2)}</div>
      <p class="nm-verdict">${verdict}</p>
      <p class="nm-small">विवाह के लिए अंक मिलान केवल एक सामान्य संकेत है। पूरा विचार कुंडली मिलान (36 गुण, मंगल दोष, नाड़ी) से होता है — <a href="kundali-milan.html">मुफ़्त कुंडली मिलान करें</a>।</p></div>`;
  }

  function init() {
    const a = document.getElementById("nmMobForm"), b = document.getElementById("nmMilForm");
    if (a) a.addEventListener("submit", mobile);
    if (b) b.addEventListener("submit", milan);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
