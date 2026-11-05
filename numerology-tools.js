/* Jyotish Tark — numerology.html extra tools:
   1) mobile / vehicle / house number numerology   2) mulank milan
   3) extra chapters for the main report: Lo Shu grid, personal months, "how it was calculated".
   General numerology guidance only. Lucky-number sets match the page's main calculator;
   planet friendships are Parashari natural friendships (Rahu ≈ Saturn, Ketu ≈ Mars);
   compound-number meanings follow Cheiro's "Book of Numbers" (1926), in our own words. */
(function () {
  "use strict";
  const PLANET = { 1: "सूर्य", 2: "चंद्र", 3: "गुरु", 4: "राहु", 5: "बुध", 6: "शुक्र", 7: "केतु", 8: "शनि", 9: "मंगल" };
  const LUCKY = { 1: [1, 2, 3, 9], 2: [1, 2, 5, 7], 3: [1, 2, 3, 9], 4: [1, 4, 5, 6, 8], 5: [1, 3, 5, 6], 6: [3, 5, 6, 8, 9], 7: [1, 2, 4, 5, 7], 8: [3, 4, 5, 6, 8], 9: [1, 3, 6, 9] };
  const MOBILE = {
    1: { name: "नेतृत्व और पहचान", nature: "सूर्य का यह अंक आत्मविश्वास, पहल और पहचान देता है। ऐसे नंबर से बातचीत में अधिकार और स्पष्टता झलकती मानी जाती है — लोग आपकी बात को गंभीरता से लेते हैं।", good: "अपना व्यवसाय, प्रशासन, सरकारी काम, मैनेजर, टीम लीडर, राजनीति, डॉक्टर", care: "अहंकार और जल्दबाज़ी के फ़ैसलों से बचें; साझेदारी में दूसरों की राय भी सुनें।" },
    2: { name: "सहयोग और भावना", nature: "चंद्र का यह अंक कोमलता, सहयोग और रिश्तों का है। लोगों से जुड़ाव और भरोसा बनाने में मददगार माना जाता है — बातचीत में अपनापन झलकता है।", good: "सेवा क्षेत्र, नर्सिंग, काउंसलिंग, कला-संगीत, होटल-फ़ूड, डेयरी व जल से जुड़े काम", care: "मन जल्दी बदलना और फ़ैसलों में देरी — ज़रूरी कामों की समय-सीमा तय रखें।" },
    3: { name: "ज्ञान और मार्गदर्शन", nature: "गुरु का यह अंक ज्ञान, सलाह और सम्मान का है। ऐसे नंबर वाले व्यक्ति की सलाह पर लोग भरोसा करते हैं, ऐसा माना जाता है।", good: "शिक्षक, कोचिंग, वकील, बैंक-वित्त, सलाहकार, धार्मिक व सामाजिक काम", care: "ज़्यादा भरोसे में आकर किसी को उधार या गारंटी देने से बचें।" },
    4: { name: "बदलाव और नई सोच", nature: "राहु का यह अंक अचानक बदलाव, तकनीक और लीक से हटकर सोचने का है। नए विचार और नेटवर्क बनते हैं, पर उतार-चढ़ाव भी रहता है।", good: "आईटी-तकनीक, सोशल मीडिया, रिसर्च, इंजीनियरिंग, विदेश से जुड़ा काम", care: "बातचीत में ग़लतफ़हमी और अचानक ख़र्च की संभावना — लेन-देन लिखित में रखें।" },
    5: { name: "संचार और व्यापार", nature: "बुध का यह अंक बातचीत, व्यापार, नेटवर्किंग और तेज़ी का है। मोबाइल नंबर के लिए सबसे लोकप्रिय योग माना जाता है — कॉल और संदेश से काम बनते हैं।", good: "सेल्स, मार्केटिंग, व्यापार, एजेंसी, मीडिया, टूर-ट्रैवल, अकाउंट्स, ऑनलाइन काम", care: "बहुत सारे काम एक साथ शुरू करने से बचें; वादे उतने ही करें जितने निभा सकें।" },
    6: { name: "आकर्षण और सुख", nature: "शुक्र का यह अंक सुंदरता, आकर्षण, परिवार और ग्राहकों से अच्छे संबंध का है। बातचीत में मिठास और लोगों को अपनी ओर खींचने की क्षमता देता है।", good: "फ़ैशन, ब्यूटी, डिज़ाइन, कला-फ़िल्म, होटल, ज्वेलरी, वाहन व लग्ज़री व्यवसाय", care: "दिखावे और ज़रूरत से ज़्यादा ख़र्च पर नियंत्रण रखें।" },
    7: { name: "चिंतन और शोध", nature: "केतु का यह अंक गहराई, अंतर्ज्ञान, शोध और आध्यात्म का है। निजी और शांत काम के लिए अच्छा माना जाता है।", good: "लेखन, शोध, विज्ञान, ज्योतिष-आध्यात्म, डेटा-विश्लेषण, विदेश सेवा", care: "व्यापार या सेल्स के लिए यह योग धीमा माना जाता है; बातचीत में स्पष्टता रखें।" },
    8: { name: "मेहनत और धैर्य", nature: "शनि का यह अंक अनुशासन, ज़िम्मेदारी और लंबी मेहनत का है। परिणाम देर से पर टिकाऊ आते हैं, ऐसा माना जाता है।", good: "क़ानून, प्रशासन, उद्योग, निर्माण, रियल एस्टेट, खनन, लंबे प्रोजेक्ट", care: "जल्दी परिणाम चाहने वालों को धैर्य रखना होगा; काम का बोझ बढ़ सकता है।" },
    9: { name: "ऊर्जा और साहस", nature: "मंगल का यह अंक जोश, साहस, प्रतियोगिता और तेज़ी से काम करने का है। मुश्किल बातचीत में भी हिम्मत देता है।", good: "खेल, फ़िटनेस, सेना-पुलिस, सुरक्षा, ज़मीन-जायदाद, इंजीनियरिंग, सर्जरी", care: "गुस्से में बात करने और जल्दबाज़ी से बचें; बहस को झगड़े में न बदलने दें।" }
  };
  // general leaning of each total for 4 life areas (1–5), taken from the planet's nature above
  const AREA = { 1: [4, 5, 3, 3], 2: [2, 3, 5, 3], 3: [3, 5, 4, 4], 4: [3, 3, 2, 3], 5: [5, 4, 4, 5], 6: [5, 3, 5, 5], 7: [2, 3, 2, 2], 8: [3, 4, 2, 4], 9: [3, 4, 2, 3] };
  const AREA_N = ["व्यापार", "नौकरी व करियर", "रिश्ते व प्रेम", "धन व बचत"];
  // Cheiro compound numbers 10–52 (own-words summary). k: good / care / mid
  const C = {
    10: ["भाग्य चक्र", "good", "मान-सम्मान और भरोसे का अंक — योजनाएँ पूरी होने और नाम बनने का संकेत।"],
    11: ["छिपी चुनौतियाँ", "care", "भरोसेमंद दिखने वाले लोगों से धोखे और अचानक परीक्षा का संकेत — सावधानी से चलें।"],
    12: ["त्याग", "care", "दूसरों के लिए अपना हित छोड़ने और चिंता का अंक — अपनी सीमाएँ तय रखें।"],
    13: ["परिवर्तन", "care", "अचानक बदलाव और उथल-पुथल का अंक — यह अपशकुन नहीं, पर योजना बदलने के लिए तैयार रहें।"],
    14: ["गति और जोखिम", "care", "यात्रा, व्यापार और लेन-देन में तेज़ी, पर जल्दबाज़ी और जोखिम से नुकसान का संकेत।"],
    15: ["आकर्षण और लाभ", "good", "धन, उपहार और दूसरों की मदद पाने का अंक — कीरो इसे भाग्यशाली मानते हैं।"],
    16: ["टूटता क़िला", "care", "अचानक रुकावट और योजनाओं के बिगड़ने की चेतावनी — पहले से तैयारी रखें।"],
    17: ["जादूगर का तारा", "good", "शांति, सम्मान और लंबे समय तक नाम रहने का अंक — बहुत शुभ माना जाता है।"],
    18: ["संघर्ष", "care", "विवाद, धोखे और भौतिक उलझनों का संकेत — क़ानूनी और पारिवारिक मामलों में सावधानी।"],
    19: ["सूर्य का राजकुमार", "good", "सफलता, सम्मान और ख़ुशी का अंक — सबसे शुभ अंकों में से एक।"],
    20: ["जागरण", "good", "नई शुरुआत और बड़े उद्देश्य का अंक — भौतिक लाभ में कुछ देरी संभव।"],
    21: ["विश्व का मुकुट", "good", "उन्नति, सम्मान और लंबे प्रयास के बाद जीत का अंक — बहुत शुभ।"],
    22: ["भ्रम", "care", "ग़लत लोगों पर भरोसे और भ्रम में फ़ैसलों की चेतावनी — निर्णय सोच-समझकर लें।"],
    23: ["सिंह का राजसी तारा", "good", "सफलता, बड़ों की मदद और योजनाओं में जीत का अंक — बहुत शुभ।"],
    24: ["सहयोग और प्रेम", "good", "बड़े लोगों का सहयोग और प्रेम-संबंधों में लाभ का अंक।"],
    25: ["अनुभव से शक्ति", "good", "कठिन अनुभवों से सीखकर आगे बढ़ने का अंक — शुरुआती परीक्षा, बाद में सफलता।"],
    26: ["साझेदारी की चेतावनी", "care", "साझेदारी और दूसरों की ग़लत सलाह से नुकसान की चेतावनी — साझेदार सोच-समझकर चुनें।"],
    27: ["राजदंड", "good", "अधिकार, नेतृत्व और बुद्धि से मिलने वाले फल का अंक — शुभ।"],
    28: ["विरोधाभास", "care", "बड़ी संभावनाओं के बाद दूसरों पर भरोसे से नुकसान का संकेत — क़ानूनी व आर्थिक सावधानी।"],
    29: ["अनिश्चितता", "care", "धोखे, परीक्षा और रिश्तों में अनबन की चेतावनी — भरोसे से पहले परखें।"],
    30: ["गहरी सोच", "mid", "विचारशीलता और मानसिक श्रेष्ठता का अंक — परिणाम आपकी इच्छाशक्ति पर निर्भर।"],
    31: ["एकांत", "mid", "आत्मनिर्भर पर अकेले रहने वाला अंक — भौतिक रूप से बहुत भाग्यशाली नहीं माना जाता।"],
    32: ["संवाद का जादू", "good", "लोगों और योजनाओं को जोड़ने वाला अंक — अपनी समझ पर चलें तो शुभ।"],
    37: ["प्रेम और मित्रता", "good", "अच्छी साझेदारी, प्रेम और मित्रता का अंक — शुभ।"],
    43: ["उथल-पुथल", "care", "संघर्ष और योजनाओं के बिखरने की चेतावनी — धैर्य रखें।"],
    51: ["योद्धा", "good", "अचानक उन्नति और नेतृत्व का अंक — शुभ, पर विरोधियों से सावधान।"]
  };
  const CMAP = { 33: 24, 34: 25, 35: 26, 36: 27, 38: 29, 39: 30, 40: 31, 41: 32, 42: 24, 44: 26, 45: 27, 46: 37, 47: 29, 48: 30, 49: 31, 50: 32, 52: 43 };
  const compound = (n) => (C[n] ? C[n] : (CMAP[n] ? C[CMAP[n]] : null));
  const ENDING = {
    0: "शून्य का कोई ग्रह नहीं — यह पिछले अंक के प्रभाव को बढ़ाता या धीमा करता माना जाता है।",
    1: "सूर्य — पहचान और आत्मविश्वास देने वाला अंत।", 2: "चंद्र — मधुर बातचीत और सहयोग वाला अंत।", 3: "गुरु — सम्मान और सलाह वाला अंत।",
    4: "राहु — नई सोच, पर अनिश्चितता वाला अंत।", 5: "बुध — व्यापार और संचार के लिए अच्छा अंत।", 6: "शुक्र — आकर्षण और ग्राहकों के लिए अच्छा अंत।",
    7: "केतु — शांत और निजी काम वाला अंत।", 8: "शनि — धीमा पर स्थिर अंत।", 9: "मंगल — ऊर्जा और तेज़ी वाला अंत।"
  };
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
  const reduceSteps = (n) => { const st = [String(n)]; while (n > 9) { const d = String(n).split(""); n = d.reduce((a, b) => a + Number(b), 0); st.push(`${d.join(" + ")} = ${n}`); } return st.join(" → "); };
  function fromDob(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    if (!m) return null;
    return { mulank: root(Number(m[3])), bhagyank: root(sumDigits(m[1] + m[2] + m[3])), d: Number(m[3]), mo: Number(m[2]), y: Number(m[1]), raw: m };
  }
  function match(a, b) {
    const ab = LUCKY[a].includes(b), ba = LUCKY[b].includes(a);
    if (ab && ba) return { k: "good", t: "उत्तम मेल", d: "दोनों अंक एक-दूसरे के अनुकूल माने जाते हैं।" };
    if (ab || ba) return { k: "ok", t: "अच्छा मेल", d: "एक अंक दूसरे के अनुकूल है — सामान्यतः ठीक माना जाता है।" };
    return { k: "mid", t: "सामान्य मेल", d: "दोनों अंक एक-दूसरे की अनुकूल सूची में नहीं हैं — आपसी समझ और धैर्य से संतुलन बनता है।" };
  }
  const chip = (m) => `<span class="nm-chip nm-${m.k}">${m.t}</span>`;
  const track = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* ignore */ } };

  // ---------------- 1) number numerology ----------------
  function mobile(e) {
    e.preventDefault();
    const f = e.target, out = document.getElementById("nmMobOut");
    const kind = (f.kind && f.kind.value) || "mobile";
    let raw = (f.mob.value || "").toUpperCase();
    let digits = raw.replace(/\D/g, "");
    if (kind === "mobile") {
      digits = digits.replace(/^(91|0)(?=\d{10}$)/, "");
      if (digits.length !== 10) { out.innerHTML = `<p class="nm-err" role="alert">कृपया 10 अंकों का मोबाइल नंबर लिखें।</p>`; f.mob.focus(); return; }
    } else if (!digits.length || digits.length > 12) {
      out.innerHTML = `<p class="nm-err" role="alert">कृपया ${kind === "vehicle" ? "गाड़ी का नंबर (जैसे UP32 AB 1234)" : "मकान/फ़्लैट नंबर"} सही लिखें।</p>`; f.mob.focus(); return;
    }
    const D = digits.split("").map(Number);
    const total = D.reduce((a, b) => a + b, 0), r = root(total) || 9;
    const counts = Array.from({ length: 10 }, (_, d) => D.filter((x) => x === d).length);
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !counts[d]);
    const heavy = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => counts[d] >= 3);
    const last = D[D.length - 1];
    const p = fromDob(f.dob.value);
    const nm = (f.nm && f.nm.value || "").toUpperCase().replace(/[^A-Z]/g, "");
    const namank = nm ? root(nm.split("").reduce((a, c) => a + (CHALD[c] || 0), 0)) : null;
    const purpose = f.purpose ? f.purpose.value : "personal";
    const cp = total >= 10 && total <= 52 ? compound(total) : null;
    const last4 = kind === "vehicle" && digits.length > 4 ? digits.slice(-4) : null;
    const pairs = [];
    for (let i = 0; i < D.length - 1; i++) { const a = D[i], b = D[i + 1]; if (a && b) pairs.push({ a, b, k: pairKind(a, b) }); }
    const pc = { f: 0, n: 0, m: 0, e: 0 }; pairs.forEach((x) => pc[x.k]++);
    const pairLbl = { f: "मित्र", n: "सम", m: "मिश्रित", e: "शत्रु" };

    // transparent score
    let score = null; const sc = [];
    if (p) {
      const pts = { good: 15, ok: 8, mid: 0 };
      const m1 = match(p.mulank, r), m2 = match(p.bhagyank, r);
      sc.push(["आधार अंक", 45]);
      sc.push([`कुल योग ${r} बनाम मूलांक ${p.mulank} (${m1.t})`, pts[m1.k]]);
      sc.push([`कुल योग ${r} बनाम भाग्यांक ${p.bhagyank} (${m2.t})`, pts[m2.k]]);
      if (last) sc.push([`आख़िरी अंक ${last} ${LUCKY[p.mulank].includes(last) ? "मूलांक के अनुकूल" : "मूलांक की सूची में नहीं"}`, LUCKY[p.mulank].includes(last) ? 6 : 0]);
      else sc.push(["आख़िरी अंक 0", -2]);
      const pp = Math.round((pc.f * 2 + pc.n * 0.5 - pc.m * 1 - pc.e * 2.5) * 10) / 10;
      sc.push([`अंकों के जोड़े (मित्र ${pc.f}, सम ${pc.n}, मिश्रित ${pc.m}, शत्रु ${pc.e})`, pp]);
      if (counts[0] >= 3) sc.push([`शून्य ${counts[0]} बार`, -3]);
      if (namank) { const m3 = match(namank, r); sc.push([`कुल योग बनाम नामांक ${namank} (${m3.t})`, { good: 6, ok: 3, mid: 0 }[m3.k]]); }
      if (PURPOSE[purpose] && PURPOSE[purpose].length) sc.push([`चुने गए उपयोग के लिए योग ${r} ${PURPOSE[purpose].includes(r) ? "उपयुक्त" : "विशेष नहीं"}`, PURPOSE[purpose].includes(r) ? 5 : 0]);
      if (cp) sc.push([`संयुक्त अंक ${total} (${cp[0]})`, cp[1] === "good" ? 4 : (cp[1] === "care" ? -4 : 0)]);
      score = Math.round(Math.max(20, Math.min(97, sc.reduce((a, x) => a + x[1], 0))));
      if (match(p.mulank, r).k === "mid" && match(p.bhagyank, r).k === "mid" && score > 58) { sc.push(["मूलांक और भाग्यांक दोनों से केवल सामान्य मेल — अधिकतम सीमा 58", 58 - score]); score = 58; }
    }
    const band = score == null ? null : (score >= 80 ? ["बहुत अनुकूल", "good"] : (score >= 62 ? ["अनुकूल", "good"] : (score >= 45 ? ["सामान्य", "ok"] : ["कम अनुकूल", "mid"])));
    const M = MOBILE[r];
    let sugg = [];
    if (p) {
      const common = LUCKY[p.mulank].filter((x) => LUCKY[p.bhagyank].includes(x));
      sugg = (common.length ? common : LUCKY[p.mulank]).slice();
      const pur = PURPOSE[purpose] || [];
      if (pur.length) sugg.sort((a, b) => (pur.includes(b) ? 1 : 0) - (pur.includes(a) ? 1 : 0));
    }
    const label = kind === "mobile" ? "मोबाइल नंबर" : (kind === "vehicle" ? "गाड़ी नंबर" : "मकान नंबर");
    const shown = kind === "mobile" ? `${digits.slice(0, 5)} ${digits.slice(5)}` : raw.replace(/[^A-Z0-9 -]/g, "").trim();
    const summary = `आपका ${label} <b>${PLANET[r]} (अंक ${r})</b> का है — ${M.name} का अंक।` + (p ? ` आपके मूलांक ${p.mulank} के साथ इसका <b>${match(p.mulank, r).t}</b> और भाग्यांक ${p.bhagyank} के साथ <b>${match(p.bhagyank, r).t}</b> है।` : "") + (cp ? ` संयुक्त अंक ${total} "${cp[0]}" ${cp[1] === "good" ? "शुभ" : (cp[1] === "care" ? "सावधानी वाला" : "सामान्य")} माना जाता है।` : "");
    const keep = score == null ? "" : (score >= 62 ? "यह नंबर आपके लिए अनुकूल है — इसे बदलने की ज़रूरत नहीं।" : (score >= 45 ? "यह नंबर ठीक-ठाक है — चालू नंबर बदलना ज़रूरी नहीं; नया नंबर लें तो नीचे सुझाए योग देखें।" : "यह नंबर आपके अंकों से कम मेल खाता है — अगली बार नया नंबर लेते समय नीचे सुझाए योग वाला नंबर चुनें।"));
    const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<div class="nm-g${counts[d] ? "" : " nm-g0"}${counts[d] >= 3 ? " nm-g3" : ""}"><b>${d}</b><small>${d ? PLANET[d] : "शून्य"}</small><span>${counts[d] ? counts[d] + "×" : "—"}</span></div>`).join("");
    const bars = AREA[r].map((v, i) => `<div class="nm-bar"><span>${AREA_N[i]}</span><i><em style="width:${v * 20}%"></em></i><b>${["", "कमज़ोर", "साधारण", "ठीक", "अच्छा", "बहुत अच्छा"][v]}</b></div>`).join("");
    const strip = D.map((d, i) => { const k = i < D.length - 1 && d && D[i + 1] ? pairKind(d, D[i + 1]) : null; return `<span class="nm-dg">${d}</span>${k ? `<span class="nm-lk nm-p${k}" title="${pairLbl[k]}"></span>` : (i < D.length - 1 ? '<span class="nm-lk nm-p0"></span>' : "")}`; }).join("");
    const waText = `मेरे ${label} का अंक ज्योतिष: कुल योग ${total} → ${r} (${PLANET[r]} — ${M.name})${score != null ? `, मेल स्कोर ${score}/100` : ""}। आप भी अपना नंबर जाँचें: https://jyotishtark.in/numerology.html#mobile-number-numerology`;
    const steps = `${D.join(" + ")} = ${total}${total > 9 ? " → " + reduceSteps(total).split(" → ").slice(1).join(" → ") : ""}`;

    out.innerHTML = `<div class="nm-res nm-mobrep">
      <div class="nm-hero">
        <div class="nm-ring" style="--p:${score == null ? 0 : score}"><div><b>${r}</b><small>${PLANET[r]}</small></div></div>
        <div class="nm-hero-t">
          <small>${label} ${esc(shown)}</small>
          <h3>${M.name}${score != null ? ` <span class="nm-chip nm-${band[1]}">${score}/100 · ${band[0]}</span>` : ""}</h3>
          <p>${summary}</p>
          ${keep ? `<p class="nm-verdict">${keep}</p>` : `<p class="nm-note"><b>जन्मतिथि भी डालें</b> — तब यह नंबर आपके मूलांक-भाग्यांक से कितना मेल खाता है, उसका स्कोर और सुझाव भी दिखेंगे।</p>`}
        </div>
      </div>
      <div class="nm-badges">
        <span><small>कुल योग</small><b>${total}${total > 9 ? " → " + r : ""}</b></span>
        ${p ? `<span><small>मूलांक ${p.mulank} से</small>${chip(match(p.mulank, r))}</span><span><small>भाग्यांक ${p.bhagyank} से</small>${chip(match(p.bhagyank, r))}</span>` : ""}
        ${namank ? `<span><small>नामांक ${namank} से</small>${chip(match(namank, r))}</span>` : ""}
        <span><small>आख़िरी अंक</small><b>${last} ${last ? "· " + PLANET[last] : ""}</b></span>
        <span><small>शून्य</small><b>${counts[0]}</b></span>
      </div>

      <div class="nm-card"><h4>✦ इस नंबर का स्वभाव</h4><p>${M.nature}</p>
        <div class="nm-kv"><div><small>किन कामों के लिए अच्छा</small><b>${M.good}</b></div><div><small>सावधानी</small><b>${M.care}</b></div></div></div>

      <div class="nm-card"><h4>✦ जीवन के क्षेत्रों में इसका झुकाव</h4>${bars}<p class="nm-small">अंक ${r} के स्वामी ${PLANET[r]} के स्वभाव के आधार पर सामान्य झुकाव।</p></div>

      ${cp ? `<div class="nm-card nm-c-${cp[1]}"><h4>✦ संयुक्त अंक ${total} — "${cp[0]}"</h4><p>${cp[2]}</p><p class="nm-small">कीरो (Cheiro) की चैल्डियन पद्धति में 10 से 52 तक के संयुक्त अंकों का अलग अर्थ होता है। मूल अंक ${r} नंबर का स्वभाव बताता है, संयुक्त अंक उसकी दिशा।</p></div>` : (total > 52 ? `<div class="nm-card"><h4>✦ संयुक्त अंक ${total}</h4><p class="nm-small">कीरो पद्धति में 52 से बड़े योग का अलग अर्थ नहीं दिया जाता — यहाँ मूल अंक ${r} ही देखा जाता है।</p></div>` : "")}

      ${last4 ? `<div class="nm-card"><h4>✦ आख़िरी 4 अंक (${last4})</h4><p>कुछ अंक ज्योतिषी गाड़ी नंबर के केवल आख़िरी 4 अंक जोड़ते हैं: ${last4.split("").join(" + ")} = ${sumDigits(last4)} → <b>${root(sumDigits(last4)) || 9} (${PLANET[root(sumDigits(last4)) || 9]})</b>।${p ? ` यह आपके मूलांक से ${match(p.mulank, root(sumDigits(last4)) || 9).t} है।` : ""}</p></div>` : ""}

      <div class="nm-card"><h4>✦ अंकों की आपसी दोस्ती</h4>
        <div class="nm-strip" aria-label="अंकों के जोड़े">${strip}</div>
        <p class="nm-small"><span class="nm-key nm-pf"></span>मित्र <span class="nm-key nm-pn"></span>सम <span class="nm-key nm-pm"></span>मिश्रित <span class="nm-key nm-pe"></span>शत्रु — साथ आने वाले अंकों के ग्रहों की पाराशरी मित्रता (शून्य वाले जोड़े नहीं गिने जाते)।</p>
        <p>${pc.e ? `इस नंबर में <b>${pc.e}</b> शत्रु-जोड़े ${pairs.filter((x) => x.k === "e").map((x) => x.a + "" + x.b).join(", ")} हैं — इन ग्रहों में टकराव से बातचीत या लेन-देन में रुकावट का संकेत माना जाता है।` : "इस नंबर में कोई शत्रु-जोड़ा नहीं है — यह अच्छी बात है।"} ${pc.f >= 3 ? `${pc.f} मित्र-जोड़े नंबर को सहज बनाते हैं।` : ""}</p></div>

      <div class="nm-card"><h4>✦ अंकों का चार्ट</h4><div class="nm-grid">${grid}</div>
        <p class="nm-note">${missing.length ? `इस नंबर में <b>${missing.join(", ")}</b> (${missing.map((d) => PLANET[d]).join(", ")}) ${missing.length > 1 ? "नहीं हैं" : "नहीं है"}।` : "इस नंबर में 1 से 9 तक सभी अंक मौजूद हैं।"} ${heavy.length ? heavy.map((d) => `${d} (${PLANET[d]}) ${counts[d]} बार है — इस ग्रह का प्रभाव प्रबल माना जाता है।`).join(" ") : ""} ${counts[0] >= 3 ? `शून्य ${counts[0]} बार है — ज़्यादा शून्य प्रभाव को धीमा करने वाले माने जाते हैं।` : ""}</p>
        <p class="nm-small">आख़िरी अंक ${last}: ${ENDING[last]}</p></div>

      ${p ? `<div class="nm-card"><h4>✦ आपके लिए सबसे अच्छे कुल योग</h4><div class="nm-sugg">${sugg.map((x) => `<span${x === r ? ' class="on"' : ""}><b>${x}</b><small>${PLANET[x]}</small></span>`).join("")}</div>
        <p class="nm-small">ये योग आपके मूलांक ${p.mulank} और भाग्यांक ${p.bhagyank} दोनों के अनुकूल हैं${PURPOSE[purpose] && PURPOSE[purpose].length ? " और आपके चुने हुए उपयोग के हिसाब से क्रम में हैं" : ""}। नया नंबर लेते समय ऐसा नंबर चुनें जिसका योग इनमें से हो, अंत 0 पर न हो और शत्रु-जोड़े कम हों।</p></div>` : ""}

      ${score != null ? `<details class="nm-how"><summary>स्कोर ${score} कैसे बना?</summary><table class="nm-tbl">${sc.map(([l, v]) => `<tr><td>${l}</td><td style="text-align:right"><b>${v > 0 ? "+" : ""}${v}</b></td></tr>`).join("")}<tr><td><b>कुल (20 से 97 के बीच सीमित)</b></td><td style="text-align:right"><b>${score}</b></td></tr></table></details>` : ""}
      <details class="nm-how"><summary>गणना कैसे हुई?</summary><p class="nm-ex">${steps}</p><p class="nm-small">${kind === "vehicle" ? "गाड़ी नंबर के अक्षर छोड़कर सभी अंक जोड़े गए हैं।" : "सभी अंक जोड़कर योग को एक अंक तक लाया गया है।"}</p></details>

      <div class="nm-actions">
        <a class="nm-btn nm-wa" href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">WhatsApp पर शेयर करें</a>
        <button type="button" class="nm-btn nm-ghost" data-nm-again>दूसरा नंबर जाँचें</button>
      </div>
      <p class="nm-small">अंक ज्योतिष के सामान्य संकेत — गारंटी नहीं। केवल अंक ज्योतिष के लिए चालू नंबर बदलना ज़रूरी नहीं; आपका नंबर इस वेबसाइट पर सेव नहीं होता। व्यक्तिगत सलाह: <a href="consultation.html">ज्योतिषी से बात करें</a> — पहले 5 मिनट मुफ़्त।</p></div>`;
    const again = out.querySelector("[data-nm-again]");
    if (again) again.addEventListener("click", () => { f.mob.value = ""; f.mob.focus(); f.scrollIntoView({ behavior: "smooth", block: "center" }); });
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    track("mobile_numerology", { kind: kind, root: r, score: score });
  }

  function milan(e) {
    e.preventDefault();
    const f = e.target, out = document.getElementById("nmMilOut");
    const a = fromDob(f.d1.value), b = fromDob(f.d2.value);
    if (!a || !b) { out.innerHTML = `<p class="nm-err" role="alert">कृपया दोनों जन्मतिथियाँ भरें।</p>`; return; }
    const m1 = match(a.mulank, b.mulank), m2 = match(a.bhagyank, b.bhagyank);
    const m3 = match(a.mulank, b.bhagyank), m4 = match(a.bhagyank, b.mulank);
    const score = { good: 2, ok: 1, mid: 0 }; const s = score[m1.k] + score[m2.k];
    const r1 = pairKind(a.mulank, b.mulank);
    const verdict = s >= 3 ? "अंकों के हिसाब से बहुत अच्छा मेल" : (s >= 2 ? "अंकों के हिसाब से अच्छा मेल" : (s === 1 ? "सामान्य मेल — समझदारी से अच्छा निभ सकता है" : "अंक अलग स्वभाव दिखाते हैं — एक-दूसरे को समझने पर ज़्यादा ध्यान दें"));
    out.innerHTML = `<div class="nm-res">
      <div class="nm-row"><span>मूलांक ${a.mulank} (${PLANET[a.mulank]}) और ${b.mulank} (${PLANET[b.mulank]}) — स्वभाव का मेल</span>${chip(m1)}</div>
      <div class="nm-row"><span>भाग्यांक ${a.bhagyank} (${PLANET[a.bhagyank]}) और ${b.bhagyank} (${PLANET[b.bhagyank]}) — जीवन की दिशा का मेल</span>${chip(m2)}</div>
      <div class="nm-row"><span>पहले का मूलांक बनाम दूसरे का भाग्यांक</span>${chip(m3)}</div>
      <div class="nm-row"><span>पहले का भाग्यांक बनाम दूसरे का मूलांक</span>${chip(m4)}</div>
      <div class="nm-row"><span>दोनों मूलांक-ग्रहों की आपसी मित्रता</span><b>${{ f: "मित्र", n: "सम", m: "मिश्रित", e: "शत्रु" }[r1]}</b></div>
      <p class="nm-verdict">${verdict}</p>
      <p class="nm-small">विवाह के लिए अंक मिलान केवल एक सामान्य संकेत है। पूरा विचार कुंडली मिलान (36 गुण, मंगल दोष, नाड़ी) से होता है — <a href="kundali-milan.html">मुफ़्त कुंडली मिलान करें</a>।</p></div>`;
    track("mulank_milan", {});
  }

  // ---------------- 3) extra chapters for the main report ----------------
  const LOSHU = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  const PLANES = [
    [[4, 9, 2], "मानसिक तल (4-9-2)", "तेज़ बुद्धि, याददाश्त और योजना बनाने की क्षमता।"],
    [[3, 5, 7], "भावनात्मक तल (3-5-7)", "भावनात्मक संतुलन, संवेदनशीलता और आध्यात्मिक समझ।"],
    [[8, 1, 6], "व्यावहारिक तल (8-1-6)", "व्यावहारिक सोच, मेहनत और भौतिक सफलता।"],
    [[4, 3, 8], "विचार तल (4-3-8)", "नए विचार, योजना और व्यवस्था की क्षमता।"],
    [[9, 5, 1], "इच्छाशक्ति तल (9-5-1)", "दृढ़ संकल्प — जो ठान लें, उसे पूरा करने की ताक़त।"],
    [[2, 7, 6], "कर्म तल (2-7-6)", "विचारों को काम में बदलने की क्षमता।"],
    [[4, 5, 6], "स्वर्ण योग (4-5-6)", "सफलता और समृद्धि का शुभ संकेत।"],
    [[2, 5, 8], "संपत्ति योग (2-5-8)", "घर, ज़मीन और संपत्ति बनाने का शुभ संकेत।"]
  ];
  const MISS = {
    1: "अपनी बात खुलकर कहने और आत्मविश्वास पर काम करें — सुबह की धूप और दिन की योजना बनाना सहायक है।",
    2: "धैर्य और दूसरों की भावनाएँ समझने पर ध्यान दें — जल्दबाज़ी में प्रतिक्रिया न दें।",
    3: "कल्पना और ज्ञान बढ़ाने के लिए नियमित पढ़ाई और बड़ों से सीखने की आदत रखें।",
    4: "अनुशासन, व्यवस्था और समय-पालन की ज़रूरत — काम लिखकर और क्रम से करें।",
    5: "जीवन में संतुलन और स्थिरता पर ध्यान दें — एक साथ बहुत काम न पकड़ें।",
    6: "परिवार और घर की ज़िम्मेदारी में भागीदारी बढ़ाएँ — रिश्तों को समय दें।",
    7: "निराशा से सीखने और अकेले में सोचने की आदत — ध्यान और आत्म-चिंतन सहायक है।",
    8: "पैसे के हिसाब और बारीक़ी पर ध्यान दें — बजट और बचत की आदत बनाएँ।",
    9: "बड़े लक्ष्य रखने और दूसरों के लिए कुछ करने की भावना बढ़ाएँ।"
  };
  const PM = { 1: "नई शुरुआत", 2: "धैर्य व सहयोग", 3: "रचनात्मकता व मेल-जोल", 4: "मेहनत व व्यवस्था", 5: "बदलाव व यात्रा", 6: "परिवार व ज़िम्मेदारी", 7: "आत्म-चिंतन व सीख", 8: "धन व उपलब्धि", 9: "समापन व सफ़ाई" };
  const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

  function reportExtras(st) {
    const res = document.getElementById("result");
    if (!res || !st || !st.dob) return;
    let host = document.getElementById("nmRepExtra");
    if (!host) {
      host = document.createElement("div"); host.id = "nmRepExtra"; host.className = "nm-rep";
      const act = res.querySelector(".border-t.border-white\\/10") || res.lastElementChild;
      const pm = document.getElementById("personalizedMessage");
      (pm && pm.parentNode ? pm.parentNode : res).insertBefore(host, pm ? pm.nextSibling : act);
    }
    const p = fromDob(st.dob); if (!p) return;
    const dd = p.raw[3], mm = p.raw[2], yy = p.raw[1];
    // Lo Shu: DOB digits (no zero) + bhagyank always + mulank when date is two-digit
    const ds = (dd + mm + yy).split("").map(Number).filter((x) => x);
    const add = [st.baseBhagyank || p.bhagyank]; if (p.d > 9) add.push(st.mulank || p.mulank);
    const all = ds.concat(add);
    const cnt = Array.from({ length: 10 }, (_, d) => all.filter((x) => x === d).length);
    const gridHtml = LOSHU.map((row) => row.map((n) => `<div class="nm-ls${cnt[n] ? "" : " nm-ls0"}"><b>${cnt[n] ? String(n).repeat(cnt[n]) : "·"}</b><small>${PLANET[n]}</small></div>`).join("")).join("");
    const done = PLANES.filter(([s]) => s.every((n) => cnt[n]));
    const miss = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !cnt[n]);
    const rep = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => cnt[n] >= 3);
    // personal months for next 12 months
    const now = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const dt = new Date(now.getFullYear(), now.getMonth() + i, 1), Y = dt.getFullYear(), Mo = dt.getMonth() + 1;
      const py = root(root(p.d) + root(p.mo) + root(Y)) || 9;
      const pmn = root(py + root(Mo)) || 9;
      months.push(`<span class="nm-pmc${i === 0 ? " on" : ""}"><small>${MON[Mo - 1]} ${Y}</small><b>${pmn}</b><em>${PM[pmn]}</em></span>`);
    }
    // how it was calculated
    const rm = (n) => (typeof window.reduceToSingleOrMaster === "function" ? window.reduceToSingleOrMaster(n) : root(n));
    const chal = st.chaldean;
    host.innerHTML = `
      <div class="nm-rcard">
        <h4>लो शू ग्रिड — आपकी जन्मतिथि का अंक चक्र</h4>
        <div class="nm-lsw"><div class="nm-lsg">${gridHtml}</div>
        <div><p>आपकी जन्मतिथि के अंक (${ds.join(", ")}) के साथ भाग्यांक ${add[0]}${p.d > 9 ? ` और मूलांक ${add[1]}` : ""} जोड़कर यह ग्रिड बना है। जो अंक जितनी बार है, उसका गुण उतना प्रबल माना जाता है।</p>
        ${done.length ? `<p><b>पूरे तल (योग):</b></p><ul>${done.map(([, n, t]) => `<li><b>${n}</b> — ${t}</li>`).join("")}</ul>` : "<p>आपके ग्रिड में कोई पूरा तल (तीनों अंक एक लाइन में) नहीं बनता — इसका मतलब कमज़ोरी नहीं; आपकी ताक़त अलग-अलग अंकों में बिखरी है।</p>"}</div></div>
        ${miss.length ? `<p><b>जो अंक ग्रिड में नहीं हैं:</b></p><ul>${miss.map((n) => `<li><b>${n} (${PLANET[n]})</b> — ${MISS[n]}</li>`).join("")}</ul>` : "<p>आपके ग्रिड में 1 से 9 तक सभी अंक हैं — यह दुर्लभ और संतुलित स्थिति है।</p>"}
        ${rep.length ? `<p>${rep.map((n) => `अंक ${n} (${PLANET[n]}) ${cnt[n]} बार है — इस ग्रह के गुण बहुत प्रबल हैं, उनमें संतुलन रखें।`).join(" ")}</p>` : ""}
      </div>
      <div class="nm-rcard">
        <h4>आने वाले 12 महीने — आपके व्यक्तिगत माह</h4>
        <div class="nm-pm">${months.join("")}</div>
        <p class="nm-small">व्यक्तिगत माह = व्यक्तिगत वर्ष + महीने का अंक। यह बताता है कि किस महीने किस तरह के काम सहज रहेंगे — जैसे 1 वाले महीने में नई शुरुआत, 8 वाले में धन और उपलब्धि।</p>
      </div>
      <div class="nm-rcard">
        <h4>आपकी गणना कैसे हुई</h4>
        <ol class="nm-steps">
          <li><b>मूलांक:</b> जन्म की तारीख ${p.d}${p.d > 9 ? " → " + reduceSteps(p.d).split(" → ").slice(1).join(" → ") : ""} → मूलांक <b>${st.mulank}</b> (${PLANET[st.mulank]})</li>
          <li><b>भाग्यांक:</b> तारीख ${p.d} → ${rm(p.d)}, महीना ${p.mo} → ${rm(p.mo)}, वर्ष ${yy} → ${rm(p.y)}; फिर ${rm(p.d)} + ${rm(p.mo)} + ${rm(p.y)} = ${rm(p.d) + rm(p.mo) + rm(p.y)} → भाग्यांक <b>${st.lifePathNumber}</b>${st.lifePathNumber > 9 ? ` — यह मास्टर अंक है, इसलिए इसे और नहीं घटाया जाता (मूल अंक ${st.baseBhagyank})` : ""} (${PLANET[st.baseBhagyank]})</li>
          ${chal ? `<li><b>नामांक (चैल्डियन):</b> ${esc(String(chal.breakdown).replace(/\s*=\s*\d+(\s*→\s*\d+)*\s*$/, ""))} = ${chal.compound} → नामांक <b>${chal.root}</b> (${PLANET[chal.root] || ""})</li>` : `<li><b>नामांक:</b> नाम लिखने पर हर अंग्रेज़ी अक्षर का चैल्डियन अंक जोड़ा जाता है।</li>`}
          <li><b>व्यक्तिगत वर्ष ${now.getFullYear()}:</b> तारीख ${p.d} + महीना ${p.mo} + वर्ष का अंक ${root(now.getFullYear())} = ${p.d + p.mo + root(now.getFullYear())} → व्यक्तिगत वर्ष <b>${st.personalYear}</b></li>
        </ol>
        <p class="nm-small">पूरी विधि उदाहरण के साथ पेज के आख़िर में <a href="#kaise-nikale">"मूलांक, भाग्यांक और नामांक कैसे निकालें"</a> में दी गई है।</p>
      </div>`;
  }

  function hookReport() {
    if (typeof window.displayResults !== "function" || window.displayResults.__nm) return;
    const orig = window.displayResults;
    const wrapped = function (st) { orig.apply(this, arguments); try { reportExtras(st); } catch (err) { /* never break the report */ } };
    wrapped.__nm = true;
    window.displayResults = wrapped;
  }

  function init() {
    const a = document.getElementById("nmMobForm"), b = document.getElementById("nmMilForm");
    if (a) {
      a.addEventListener("submit", mobile);
      const k = a.kind, inp = a.mob;
      if (k && inp) k.addEventListener("change", () => {
        inp.placeholder = k.value === "vehicle" ? "जैसे UP32 AB 1234" : (k.value === "house" ? "जैसे 302" : "जैसे 98765 43210");
        inp.setAttribute("inputmode", k.value === "vehicle" ? "text" : "numeric");
        inp.maxLength = k.value === "vehicle" ? 16 : 17;
      });
    }
    if (b) b.addEventListener("submit", milan);
    hookReport();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
