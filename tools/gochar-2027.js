#!/usr/bin/env node
/* ==========================================================================
   Jyotish Tark — Gochar (transit) 2027 pages
   Writes shani-, guru-, rahu-ketu-, mangal-gochar-2027.html and gochar-2027.html
   from the site's own engine (birth-chart-calculator.js: Lahiri ayanamsa,
   mean node), scanning every day of the year and narrowing each sign change
   and retro/direct station by bisection. Times are IST.

   Usage (from the repo root):  node tools/gochar-2027.js [year]
   Cross-checked Nov 2026 against astromitra.com and ganeshaspeaks.com
   (same dates; times differ by a few minutes, so pages show part of day only).
   ========================================================================== */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const YEAR = Number(process.argv[2] || 2027);

global.window = global;
global.document = { readyState: "complete", addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; }, head: { appendChild() {} }, body: { appendChild() {} } };
vm.runInThisContext(fs.readFileSync(path.join(ROOT, "astronomy.min.js"), "utf8"));
require(path.join(ROOT, "birth-chart-calculator.js"));
const I = window.BirthChartCalculator._internal;
const sid = (d) => { const r = I.getTropicalLongitudesSpeedAndRetro(d, "mean"), a = I.lahiriAyanamsa(d), o = {}; for (const k in r.longitudes) o[k] = { lon: ((r.longitudes[k] - a) % 360 + 360) % 360, retro: r.retro[k] }; return o; };
const sign = (l) => Math.floor(l / 30) + 1;

const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
const RASHI_EN = ["Mesh", "Vrishabh", "Mithun", "Kark", "Singh", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"];
const SYM = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const SLUG = ["mesh", "vrishabh", "mithun", "kark", "singh", "kanya", "tula", "vrishchik", "dhanu", "makar", "kumbh", "meen"];
const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const ov = (h) => ["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"][h - 1];
const hFrom = (a, b) => ((b - a + 12) % 12) + 1;
const FAV = { Mars: [3, 6, 11], Jupiter: [2, 5, 7, 9, 11], Saturn: [3, 6, 11], Rahu: [3, 6, 11], Ketu: [3, 6, 11] };

// ---------- detailed effects by house from the Moon sign (classical gochar, written plainly) ----------
const D = {
  Saturn: [
    "साढ़ेसाती का शिखर (दूसरा चरण)। ज़िम्मेदारियाँ और मेहनत बढ़ेगी, थकान और मन पर दबाव रह सकता है। अनुशासन, धैर्य और नियमित दिनचर्या से यही समय मज़बूत नींव बनाता है।",
    "साढ़ेसाती का अंतिम चरण। धन और परिवार के मामलों में संयम रखें, वाणी कठोर न होने दें। बचत की आदत डालें; धीरे-धीरे दबाव कम होगा।",
    "शुभ गोचर। मेहनत का पक्का फल, साहस और आत्मविश्वास बढ़ेगा। नौकरी-व्यापार में आगे बढ़ने और छोटी यात्राओं से लाभ के योग।",
    "शनि की ढैय्या (कंटक शनि)। घर, वाहन और मन की शांति पर दबाव; माता की सेहत का ध्यान रखें। संपत्ति के बड़े फ़ैसले सोच-समझकर लें।",
    "पढ़ाई और संतान से जुड़ी चिंता या देरी हो सकती है; प्रेम संबंधों में धैर्य रखें। सट्टे-जुए और जल्दबाज़ी के निवेश से दूर रहें।",
    "शुभ गोचर। शत्रुओं और प्रतियोगिता पर जीत, नौकरी में स्थिरता, पुराने कर्ज़ चुकाने का अच्छा समय। सेहत में भी सुधार।",
    "रिश्तों और साझेदारी में ज़िम्मेदारी बढ़ेगी; जीवनसाथी से धैर्य से बात करें। व्यापार में अनुबंध ध्यान से पढ़ें।",
    "शनि की ढैय्या (अष्टम शनि)। सेहत, अचानक बदलाव और जोखिम भरे कामों में सावधानी। नियमित जाँच करवाएँ और कर्ज़ लेने से बचें।",
    "भाग्य धीमा लगेगा; पिता, गुरु या बड़ों से वैचारिक मतभेद टालें। धर्म-कर्म और लंबी योजना में मेहनत रंग लाएगी।",
    "काम का बोझ बढ़ेगा, पर मेहनत से पद और प्रतिष्ठा पक्की होगी। वरिष्ठों से टकराव न करें, नियमों का पालन करें।",
    "शुभ गोचर। लंबे समय से रुके लाभ मिलेंगे, आय के नए स्रोत और बड़े लोगों से संपर्क। इच्छाएँ पूरी होने के योग।",
    "साढ़ेसाती का आरंभ (पहला चरण)। ख़र्च, यात्राएँ और नींद की कमी हो सकती है। फ़िज़ूलख़र्ची रोकें और बचत की योजना बनाएँ।"
  ],
  Jupiter: [
    "गुरु आपकी राशि में — ज्ञान और सम्मान बढ़ेगा, पर ज़िम्मेदारियाँ भी। सेहत, वज़न और खान-पान पर ध्यान दें।",
    "शुभ गोचर। धन संचय, परिवार में शुभ कार्य और वाणी से लाभ के योग। रुका पैसा मिल सकता है।",
    "मेहनत ज़्यादा और फल धीरे मिलेगा; भाई-बहनों से सहयोग लें। छोटी यात्राएँ और नए कौशल सीखना लाभ देगा।",
    "घर-परिवार की ज़िम्मेदारियाँ और चिंता; माता की सेहत का ध्यान। घर या वाहन की योजना सोच-समझकर बनाएँ।",
    "बहुत शुभ गोचर। पढ़ाई, संतान, प्रेम और रचनात्मक कामों के लिए अच्छा समय; सही सलाह मिलेगी।",
    "काम का दबाव, प्रतियोगिता और ख़र्च बढ़ सकते हैं; सेहत पर ध्यान दें। उधार देने से बचें।",
    "शुभ गोचर। विवाह, साझेदारी, नए अनुबंध और मान-सम्मान के योग। जीवनसाथी से सहयोग मिलेगा।",
    "रुकावटें और अनचाहे ख़र्च; धैर्य रखें और जोखिम न लें। शोध, अध्यात्म और बीमा के काम ठीक रहेंगे।",
    "बहुत शुभ गोचर। भाग्य प्रबल, धार्मिक यात्रा, गुरु और पिता का साथ। बड़े फ़ैसलों के लिए अच्छा समय।",
    "करियर में बदलाव या स्थान परिवर्तन के योग; सोच-समझकर निर्णय लें। काम में ईमानदारी से प्रतिष्ठा बनेगी।",
    "बहुत शुभ गोचर। आय, लाभ, मित्रों और बड़े लोगों से सहयोग; इच्छाएँ पूरी होने के प्रबल योग।",
    "ख़र्च और यात्राएँ बढ़ेंगी; दान-पुण्य और अध्यात्म से शांति। बचत की योजना बनाकर चलें।"
  ],
  Rahu: [
    "मन में भ्रम और बेचैनी; बड़े निर्णय जल्दी न लें। सेहत और छवि का ध्यान रखें, शॉर्टकट से बचें।",
    "वाणी और खान-पान पर नियंत्रण रखें; परिवार में ग़लतफ़हमी से बचें। पैसों के लेन-देन लिखित में रखें।",
    "शुभ गोचर। साहस, नए संपर्क, मीडिया-ऑनलाइन काम और छोटी यात्राओं से लाभ।",
    "घर में अशांति या बदलाव; संपत्ति के काग़ज़ ध्यान से जाँचें। माता की सेहत का ध्यान रखें।",
    "सट्टा, जुआ और शॉर्टकट से बचें; पढ़ाई में ध्यान भटक सकता है। प्रेम संबंधों में पारदर्शिता रखें।",
    "शुभ गोचर। विरोधियों और प्रतियोगिता पर विजय, नौकरी में मज़बूती, कर्ज़ से राहत।",
    "रिश्तों और साझेदारी में ग़लतफ़हमी; अनुबंध और साझेदारी में पारदर्शिता रखें।",
    "छिपे जोखिम और अचानक बदलाव; सेहत की जाँच करवाएँ, जोखिम भरे निवेश से बचें।",
    "परंपरा से हटकर सोच; बड़ों और गुरु से बहस टालें। लंबी यात्राएँ सोच-समझकर करें।",
    "करियर में अचानक बदलाव या नया क्षेत्र; दफ़्तर की राजनीति से दूर रहें।",
    "शुभ गोचर। अप्रत्याशित लाभ, बड़ा नेटवर्क और इच्छा-पूर्ति के योग।",
    "फ़िज़ूलख़र्च, नींद की कमी और विदेश/दूर स्थानों से जुड़े काम; ख़र्च पर नियंत्रण रखें।"
  ],
  Ketu: [
    "मन में उदासीनता या अकेलापन; सेहत और आत्मविश्वास पर ध्यान दें। ध्यान-योग लाभ देगा।",
    "वाणी में कड़वाहट और परिवार से दूरी से बचें; खान-पान संतुलित रखें।",
    "शुभ गोचर। साहस, मेहनत और आध्यात्मिक रुचि बढ़ेगी; रुके काम पूरे होंगे।",
    "घर में असंतोष या स्थान बदलने का मन; माता की सेहत का ध्यान रखें।",
    "पढ़ाई और संतान से जुड़ी चिंता; प्रेम में दूरी — धैर्य से बात करें।",
    "शुभ गोचर। विरोधियों पर विजय, पुरानी बीमारी या कर्ज़ से राहत।",
    "जीवनसाथी या साझेदार से दूरी या ग़लतफ़हमी; रिश्तों को समय दें।",
    "अचानक बदलाव और छिपी परेशानियाँ; सेहत और यात्रा में सावधानी। अध्यात्म और शोध के लिए ठीक।",
    "धर्म-अध्यात्म में रुचि; बड़ों से मतभेद टालें।",
    "काम से मन उचट सकता है; करियर के फ़ैसले जल्दबाज़ी में न लें।",
    "शुभ गोचर। पुराने कामों से लाभ और इच्छा-पूर्ति के योग।",
    "ख़र्च, एकांत और आध्यात्मिक यात्राएँ; नींद पूरी करें।"
  ],
  Mars: [
    "ऊर्जा भरपूर, पर गुस्से, जल्दबाज़ी और चोट से बचें।", "वाणी में कठोरता से बचें; पैसों पर विवाद टालें।", "शुभ गोचर। साहस, खेल और मेहनत का सीधा फल।",
    "घर में तनाव या मरम्मत का ख़र्च; वाहन सावधानी से चलाएँ।", "प्रेम में बहस और निवेश में जल्दबाज़ी से बचें।", "शुभ गोचर। शत्रुओं और प्रतियोगिता पर विजय; कर्ज़ चुकाने का अच्छा समय।",
    "रिश्तों में गर्मी; साझेदारी में साफ़ बात करें।", "चोट और दुर्घटना से सावधान; जोखिम भरे काम टालें।", "लंबी यात्रा या बड़ों से बहस — धैर्य से काम लें।",
    "काम में तेज़ी, पर वरिष्ठों से टकराव न करें।", "शुभ गोचर। मेहनत से लाभ; ज़मीन-जायदाद के काम बनेंगे।", "ख़र्च और नींद की कमी; गुप्त विरोध से सावधान।"
  ]
};
const REM = {
  Saturn: "शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएँ, “ॐ शं शनैश्चराय नमः” का जप करें, और ज़रूरतमंदों व मज़दूरों की मदद करें।",
  Jupiter: "गुरुवार को पीली दाल, केले या हल्दी का दान करें, गुरुजनों का सम्मान करें और “ॐ बृं बृहस्पतये नमः” का जप करें।",
  Rahu: "शनिवार को “ॐ रां राहवे नमः” का जप करें, नशे और शॉर्टकट से दूर रहें, और दुर्गा माँ की उपासना करें।",
  Ketu: "गणेश जी की उपासना करें, “ॐ कें केतवे नमः” का जप करें और कुत्तों को रोटी दें।",
  Mars: "मंगलवार को हनुमान चालीसा पढ़ें, गुस्से पर संयम रखें और मसूर की दाल का दान करें।"
};
const PN = { Saturn: "शनि", Jupiter: "गुरु (बृहस्पति)", Rahu: "राहु", Ketu: "केतु", Mars: "मंगल" };

// ---------- scan the year ----------
const ist = (ms) => new Date(ms + 330 * 60000);   // shift so UTC fields read as IST
const part = (d) => { const h = d.getUTCHours(); return h < 5 ? "तड़के" : h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 20 ? "शाम" : "रात"; };
const dtxt = (ms) => { const d = ist(ms); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const dtxtP = (ms) => { const d = ist(ms); return `${dtxt(ms)} (${part(d)})`; };
const yStart = Date.UTC(YEAR, 0, 1) - 330 * 60000, yEnd = Date.UTC(YEAR + 1, 0, 1) - 330 * 60000;
function scan(p) {
  const at = (ms) => { const s = sid(new Date(ms)); return p === "Ketu" ? { lon: (s.Rahu.lon + 180) % 360, retro: true } : s[p]; };
  const ev = [];
  let prev = at(yStart);
  const startSign = sign(prev.lon), startRetro = prev.retro;
  for (let t = yStart + 864e5; t <= yEnd; t += 864e5) {
    const cur = at(t);
    const bis = (test) => { let lo = t - 864e5, hi = t; for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (test(at(m))) hi = m; else lo = m; } return hi; };
    if (sign(cur.lon) !== sign(prev.lon)) { const s = sign(cur.lon); ev.push({ type: "enter", sign: s, from: sign(prev.lon), ms: bis((x) => sign(x.lon) === s) }); }
    if (!["Rahu", "Ketu"].includes(p) && cur.retro !== prev.retro) { const r = cur.retro; ev.push({ type: r ? "retro" : "direct", sign: sign(cur.lon), ms: bis((x) => x.retro === r) }); }
    prev = cur;
  }
  // nearest sign changes before and after the year (context for slow planets)
  const near = (from, to, step) => { let a0 = at(from); for (let t = from + step; step > 0 ? t <= to : t >= to; t += step) { const c = at(t); if (sign(c.lon) !== sign(a0.lon)) { let lo = Math.min(t, t - step), hi = Math.max(t, t - step); const target = step > 0 ? sign(c.lon) : sign(a0.lon); for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (sign(at(m).lon) === target) hi = m; else lo = m; } return { sign: target, from: step > 0 ? sign(a0.lon) : sign(c.lon), ms: hi }; } a0 = c; } return null; };
  const before = near(yStart, yStart - 900 * 864e5, -864e5), after = near(yEnd, yEnd + 900 * 864e5, 864e5);
  // periods by sign within the year
  const periods = []; let s0 = startSign, from = yStart;
  ev.filter((e) => e.type === "enter").forEach((e) => { periods.push({ sign: s0, from, to: e.ms }); s0 = e.sign; from = e.ms; });
  periods.push({ sign: s0, from, to: yEnd });
  return { ev, periods, startSign, startRetro, before, after };
}

// ---------- page frame (same header/footer as the rest of the site) ----------
const SRC = fs.readFileSync(path.join(ROOT, "kp-astrology.html"), "utf8");
const HEAD_TOP = SRC.slice(0, SRC.indexOf("<title>"));
const HEADER = SRC.slice(SRC.indexOf('<header class="jt-header'), SRC.indexOf("</header>") + 9).replace(/ aria-current="page"/g, "");
const FOOTER = SRC.slice(SRC.indexOf('<footer class="jt-footer'), SRC.indexOf("</footer>") + 9);
const ICONS = SRC.split("\n").filter((l) => /rel="icon"|apple-touch-icon/.test(l)).map((l) => l.trim()).join("\n");
const SITEJS = (SRC.match(/jt-site\.js\?v=\d+/) || ["jt-site.js?v=1"])[0];
const THEME = (SRC.match(/jt-theme\.css\?v=\d+/) || ["jt-theme.css?v=1"])[0];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const today = new Date().toISOString().slice(0, 10);
const CSS = `<style>
.gc{--mr:#7A1F1F;--mrd:#5A1414;--ln:#E8DCC4;--ink:#2B1810;--bd:#4A3628;--mu:#6B5444;color:var(--ink);font-family:'Mukta',system-ui,sans-serif;font-size:17px;line-height:1.65}
.gc-wrap{max-width:1080px;margin:0 auto;padding:0 16px}
.gc-hero{background:radial-gradient(900px 400px at 85% 10%,#F6DFB8 0,transparent 60%),linear-gradient(180deg,#FBF6EC,#F5EBD8);border-bottom:1px solid var(--ln);padding:24px 0 28px}
.gc-hero h1{font-size:clamp(1.7rem,4vw,2.6rem);line-height:1.2;margin:.4rem 0 .5rem;color:var(--mrd)!important}
.gc-hero p{margin:0;color:var(--bd);max-width:780px}
.gc-crumb{font-size:14px;color:var(--mu)}.gc-crumb a{color:var(--mr)}
.gc-box{background:#fff;border:1px solid var(--ln);border-radius:16px;padding:16px 18px;margin:20px 0}
.gc-box h2{font-size:1.35rem;color:var(--mrd);margin:0 0 .6rem}
.gc ul{list-style:disc;padding-left:1.3rem}.gc li{margin:.2rem 0}
.gc-tbl{width:100%;border-collapse:collapse;font-size:15.5px}.gc-tbl th{background:var(--mr);color:#fff!important;text-align:left;padding:.5rem .7rem;font-weight:600}.gc-tbl td{border-bottom:1px solid var(--ln);padding:.5rem .7rem;vertical-align:top}
.gc-jump{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}.gc-jump a{background:#fff;border:1px solid #E6C98A;border-radius:999px;padding:.3rem .8rem;font-weight:700;color:var(--mrd)!important;text-decoration:none!important}
.gc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:10px 0 24px}
.gc-card{background:#fff;border:1px solid var(--ln);border-radius:18px;padding:16px 18px;scroll-margin-top:90px}
.gc-card header{display:flex;gap:12px;align-items:center;margin-bottom:.3rem}
.gc-sym{width:48px;height:48px;border-radius:50%;background:var(--mr);color:#F5C46B;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex:0 0 48px}
.gc-card h3{font-size:1.3rem;margin:0;color:var(--mrd)}
.gc-tag{display:inline-block;font-size:13.5px;font-weight:700;border-radius:999px;padding:1px 10px;margin:2px 4px 2px 0}
.gc-tag.g{background:#E8F6EC;color:#14532D;border:1px solid #9AD3AB}.gc-tag.b{background:#FDECEA;color:#7F1D1D;border:1px solid #F3B4AB}.gc-tag.n{background:#FBF6EC;color:#6B5444;border:1px solid #E6D7B8}
.gc-per{margin:.5rem 0 0;padding:.5rem 0 0;border-top:1px dashed var(--ln)}.gc-per b{color:var(--mrd)}
.gc-faq details{background:#fff;border:1px solid var(--ln);border-radius:12px;margin:0 0 8px;padding:0 14px}.gc-faq summary{cursor:pointer;font-weight:700;padding:12px 0}.gc-faq p{margin:0 0 12px}
.gc-cta{background:var(--mr);color:#FBF6EC;border-radius:16px;padding:16px 18px;margin:0 0 24px}.gc-cta a{color:#F1D99A;font-weight:700}
.gc-hub{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.gc-hub a{display:block;background:#fff;border:1px solid var(--ln);border-radius:16px;padding:16px;text-decoration:none!important;color:var(--ink)!important}.gc-hub a b{display:block;font-size:1.25rem;color:var(--mrd)}
@media (max-width:760px){.gc-grid,.gc-hub{grid-template-columns:minmax(0,1fr)}}
</style>`;
function page(slug, title, desc, keywords, h1, crumb, body, faq) {
  const url = `https://jyotishtark.in/${slug}.html`;
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", "headline": h1, "description": desc, "inLanguage": "hi-IN", "datePublished": today, "dateModified": today, "author": { "@type": "Person", "name": "Gyanendra Singh Tomar" }, "publisher": { "@type": "Organization", "name": "Jyotish Tark", "logo": { "@type": "ImageObject", "url": "https://jyotishtark.in/logo.png" } }, "mainEntityOfPage": url },
    { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jyotishtark.in/" }, { "@type": "ListItem", "position": 2, "name": `गोचर ${YEAR}`, "item": `https://jyotishtark.in/gochar-${YEAR}.html` }].concat(slug === `gochar-${YEAR}` ? [] : [{ "@type": "ListItem", "position": 3, "name": h1, "item": url }]) },
    { "@type": "FAQPage", "mainEntity": faq.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a.replace(/<[^>]+>/g, "") } })) }] };
  return `${HEAD_TOP}<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="${esc(keywords)}">
    <meta name="author" content="Gyanendra Singh Tomar - Jyotish Tark">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="article"><meta property="og:image" content="https://jyotishtark.in/logo.png">
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Mukta:wght@400;500;600;700;800&display=swap">
    <link rel="stylesheet" href="tailwind.css?v=1">
    <link rel="stylesheet" href="${THEME}">
    <script src="${SITEJS}" defer></script>
    ${ICONS}
    ${CSS}
</head>
<body class="min-h-screen">
${HEADER}
<main id="main" class="gc">
  <section class="gc-hero"><div class="gc-wrap">
    <nav class="gc-crumb" aria-label="Breadcrumb"><a href="index.html">होम</a> / ${crumb}</nav>
    <h1>${h1}</h1>
    ${body.intro}
  </div></section>
  <div class="gc-wrap">
    ${body.main}
    <div class="gc-cta"><b>आपकी अपनी कुंडली पर असर?</b> गोचर का फल आपकी चंद्र राशि के साथ-साथ लग्न, दशा और जन्म के ग्रहों पर भी निर्भर करता है। <a href="kundali-form.html">मुफ़्त कुंडली बनाएँ</a> · <a href="sade-sati-calculator.html">साढ़ेसाती कैलकुलेटर</a> · <a href="mera-${YEAR}.html">वर्षफल ${YEAR} रिपोर्ट</a></div>
    <div class="gc-faq"><h2 style="font-size:1.4rem;color:#5A1414">अक्सर पूछे जाने वाले प्रश्न</h2>${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    <p style="font-size:14px;color:#6B5444;margin:16px 0 28px">तारीख़ें लाहिड़ी अयनांश (निरयण) से भारतीय समय (IST) में, ज्योतिष तर्क के अपने खगोलीय गणना इंजन से निकाली गई हैं; अलग पंचांगों में समय में कुछ मिनट का अंतर हो सकता है। फल चंद्र राशि से शास्त्रीय गोचर नियमों पर आधारित सामान्य मार्गदर्शन है, गारंटी नहीं।</p>
  </div>
</main>
${FOOTER}
</body>
</html>
`;
}
const evTxt = (p, e) => e.type === "enter" ? `${PN[p]} ${RASHI[e.sign - 1]} राशि में प्रवेश करेंगे${e.from ? ` (${RASHI[e.from - 1]} से)` : ""}` : `${PN[p]} ${e.type === "retro" ? "वक्री होंगे" : "मार्गी होंगे"} (${RASHI[e.sign - 1]} राशि में)`;
const tag = (p, h) => FAV[p].includes(h) ? '<span class="gc-tag g">अनुकूल</span>' : '<span class="gc-tag b">सावधानी</span>';
const perTxt = (per) => `${per.from <= yStart + 1 ? `1 जनवरी` : dtxt(per.from).replace(` ${YEAR}`, "")} – ${per.to >= yEnd - 1 ? `31 दिसंबर ${YEAR}` : dtxt(per.to)}`;

// ---------- one planet page ----------
function planetPage(p, slug, nameShort, enName, extraIntro) {
  const S = scan(p), K = p === "Rahu" ? scan("Ketu") : null;
  const all = S.ev.map((e) => ({ p, e })).concat(K ? K.ev.map((e) => ({ p: "Ketu", e })) : []).sort((a, b) => a.e.ms - b.e.ms);
  let rows = all.length ? all.map(({ p: q, e }) => `<tr><td>${dtxtP(e.ms)}</td><td>${evTxt(q, e)}</td></tr>`).join("") : `<tr><td colspan="2">${YEAR} में ${PN[p]}${K ? " और केतु" : ""} राशि नहीं बदलेंगे।</td></tr>`;
  const ctx = [];
  if (["Saturn", "Jupiter", "Rahu"].includes(p)) {
    if (S.before) ctx.push(`<tr><td>${dtxtP(S.before.ms)}</td><td>(पिछला) ${evTxt(p, { type: "enter", sign: S.before.sign, from: S.before.from }).replace("प्रवेश करेंगे", "प्रवेश किया")}${K && K.before ? `; केतु ${RASHI[K.before.sign - 1]} में` : ""}</td></tr>`);
    if (S.after) ctx.push(`<tr><td>${dtxtP(S.after.ms)}</td><td>(अगला) ${evTxt(p, { type: "enter", sign: S.after.sign, from: S.after.from })}${K && K.after ? `; केतु ${RASHI[K.after.sign - 1]} में` : ""}</td></tr>`);
  }
  if (ctx.length) rows = (S.before ? ctx[0] : "") + rows + (S.after ? ctx[ctx.length - 1] : "");
  const startLine = `1 जनवरी ${YEAR} को ${PN[p]} ${RASHI[S.startSign - 1]} राशि में${S.startRetro && !["Rahu", "Ketu"].includes(p) ? " (वक्री)" : ""} हैं${K ? ` और केतु ${RASHI[K.startSign - 1]} राशि में` : ""}।`;
  const cards = RASHI.map((r, i) => {
    const R = i + 1;
    const pers = S.periods.map((per) => { const h = hFrom(R, per.sign); return `<div class="gc-per"><b>${perTxt(per)}</b> — ${PN[p]} ${RASHI[per.sign - 1]} में, आपकी राशि से ${ov(h)} भाव ${tag(p, h)}<br>${D[p][h - 1]}</div>`; }).join("");
    const kets = K ? K.periods.map((per) => { const h = hFrom(R, per.sign); return `<div class="gc-per"><b>केतु</b> ${RASHI[per.sign - 1]} में, आपकी राशि से ${ov(h)} भाव ${tag("Ketu", h)}<br>${D.Ketu[h - 1]}</div>`; }).join("") : "";
    let sat = "";
    if (p === "Saturn") {
      const st = S.periods.map((per) => { const h = hFrom(R, per.sign); return h === 12 ? "साढ़ेसाती — पहला चरण" : h === 1 ? "साढ़ेसाती — दूसरा चरण (शिखर)" : h === 2 ? "साढ़ेसाती — अंतिम चरण" : h === 4 ? "ढैय्या (कंटक)" : h === 8 ? "ढैय्या (अष्टम)" : ""; });
      const uniq = [...new Set(st.filter(Boolean))];
      sat = uniq.length ? `<p style="margin:.3rem 0 0">${uniq.map((u) => `<span class="gc-tag b">${u}</span>`).join("")}</p>` : `<p style="margin:.3rem 0 0"><span class="gc-tag n">${YEAR} में साढ़ेसाती/ढैय्या नहीं</span></p>`;
    }
    const anyBad = S.periods.some((per) => !FAV[p].includes(hFrom(R, per.sign)));
    return `<article class="gc-card" id="${SLUG[i]}"><header><span class="gc-sym" aria-hidden="true">${SYM[i]}</span><div><h3>${r} राशि <small style="font-size:.85rem;color:#6B5444">${RASHI_EN[i]}</small></h3></div></header>${sat}${pers}${kets}${anyBad ? `<p style="margin:.6rem 0 0;font-size:15.5px"><b>उपाय:</b> ${REM[p]}${K ? " " + REM.Ketu : ""}</p>` : ""}</article>`;
  }).join("");
  let summary = "";
  if (p === "Saturn") {
    const lists = S.periods.map((per) => ({ per, sade: [per.sign - 1, per.sign, per.sign + 1].map((s) => ((s - 1 + 12) % 12) + 1), dhaiya: [((per.sign - 4 + 12) % 12) + 1, ((per.sign - 8 + 12) % 12) + 1] }));
    summary = `<div class="gc-box"><h2>${YEAR} में साढ़ेसाती और ढैय्या किन राशियों पर?</h2><div style="overflow-x:auto"><table class="gc-tbl"><thead><tr><th>अवधि</th><th>शनि</th><th>साढ़ेसाती</th><th>ढैय्या</th></tr></thead><tbody>${lists.map((x) => `<tr><td>${perTxt(x.per)}</td><td>${RASHI[x.per.sign - 1]}</td><td>${x.sade.map((s) => RASHI[s - 1]).join(", ")}</td><td>${x.dhaiya.map((s) => RASHI[s - 1]).join(", ")}</td></tr>`).join("")}</tbody></table></div><p style="margin:.5rem 0 0;font-size:15.5px">साढ़ेसाती = शनि चंद्र राशि से 12वें, पहले या दूसरे भाव में; ढैय्या = चौथे या आठवें भाव में। अपनी तारीख़ें जानने के लिए <a href="sade-sati-calculator.html">साढ़ेसाती कैलकुलेटर</a> देखें।</p></div>`;
  }
  if (p === "Mars") {
    summary = `<div class="gc-box"><h2>${YEAR} में मंगल किस राशि में कब?</h2><div style="overflow-x:auto"><table class="gc-tbl"><thead><tr><th>अवधि</th><th>मंगल की राशि</th></tr></thead><tbody>${S.periods.map((per) => `<tr><td>${perTxt(per)}</td><td>${RASHI[per.sign - 1]}</td></tr>`).join("")}</tbody></table></div></div>`;
  }
  const year = YEAR;
  const titleMap = { Saturn: `शनि गोचर ${year}: तारीख़ें, साढ़ेसाती-ढैय्या और सभी 12 राशियों पर असर`, Jupiter: `गुरु गोचर ${year} (बृहस्पति): तारीख़ें और सभी 12 राशियों पर असर`, Rahu: `राहु-केतु गोचर ${year}: तारीख़ें और सभी 12 राशियों पर असर`, Mars: `मंगल गोचर ${year}: हर राशि-परिवर्तन की तारीख़ और 12 राशियों पर असर` };
  const h1 = titleMap[p];
  const firstEnter = S.ev.find((e) => e.type === "enter");
  const desc = `${nameShort} गोचर ${year} — ${startLine}${firstEnter ? ` ${dtxt(firstEnter.ms)} को ${RASHI[firstEnter.sign - 1]} राशि में प्रवेश।` : ""} वक्री-मार्गी तारीख़ें और मेष से मीन तक सभी राशियों पर असर व उपाय।`.slice(0, 300);
  const faq = [
    [`${nameShort} गोचर ${year} कब है?`, `${startLine} ${all.filter((x) => x.e.type === "enter").map((x) => `${dtxtP(x.e.ms)} — ${evTxt(x.p, x.e)}`).join("; ") || `${year} में राशि परिवर्तन नहीं।`}`],
    [`${nameShort} गोचर का असर किस राशि से देखें?`, "गोचर का फल चंद्र राशि (जन्म राशि) से देखा जाता है। अपनी चंद्र राशि न पता हो तो <a href=\"kundali-form.html\">मुफ़्त कुंडली</a> बनाकर देख लें।"],
    ["क्या यह फल सबके लिए एक जैसा होगा?", "नहीं। यह राशि पर आधारित सामान्य फल है। व्यक्तिगत फल आपकी कुंडली में ग्रह की स्थिति, दशा और अष्टकवर्ग पर भी निर्भर करता है।"]
  ];
  if (p === "Saturn") faq.push([`${year} में किन राशियों पर साढ़ेसाती है?`, S.periods.map((per) => `${perTxt(per)}: ${[per.sign - 1, per.sign, per.sign + 1].map((s) => RASHI[((s - 1 + 12) % 12)]).join(", ")}`).join("; ")]);
  const intro = `<p>${startLine} ${extraIntro} नीचे ${year} की सभी तारीख़ें (भारतीय समय) और मेष से मीन तक हर राशि पर असर व उपाय दिए गए हैं।</p><nav class="gc-jump" aria-label="राशि चुनें">${RASHI.map((r, i) => `<a href="#${SLUG[i]}">${SYM[i]} ${r}</a>`).join("")}</nav>`;
  const main = `<div class="gc-box"><h2>${nameShort} गोचर ${year} — तारीख़ें</h2><div style="overflow-x:auto"><table class="gc-tbl"><thead><tr><th>तारीख़</th><th>घटना</th></tr></thead><tbody>${rows}</tbody></table></div></div>${summary}<h2 style="font-size:1.45rem;color:#5A1414;margin:22px 0 6px">${year} में हर राशि पर असर</h2><div class="gc-grid">${cards}</div><p style="margin:0 0 20px"><a href="gochar-${year}.html" style="color:#7A1F1F;font-weight:700">← सभी ग्रहों का गोचर ${year}</a></p>`;
  const kw = `${nameShort} गोचर ${year}, ${enName} transit ${year}, ${slug.replace(/-/g, " ")}, ${RASHI.map((r) => r + " राशि " + nameShort + " गोचर").join(", ")}`;
  fs.writeFileSync(path.join(ROOT, slug + ".html"), page(slug, `${h1} | Jyotish Tark`, desc, kw, h1, `<a href="gochar-${year}.html">गोचर ${year}</a> / ${nameShort} गोचर`, { intro, main }, faq));
  return { slug, h1, all, startLine };
}

const pages = [
  planetPage("Saturn", `shani-gochar-${YEAR}`, "शनि", "Saturn", "शनि सबसे धीमे चलने वाले ग्रह हैं, इसलिए इनका गोचर कर्म, अनुशासन, करियर और साढ़ेसाती-ढैय्या के लिए सबसे अहम माना जाता है।"),
  planetPage("Jupiter", `guru-gochar-${YEAR}`, "गुरु", "Jupiter", "गुरु (बृहस्पति) विवाह, संतान, धन, ज्ञान और भाग्य के कारक हैं; इनका गोचर साल भर के शुभ अवसरों की दिशा बताता है।"),
  planetPage("Rahu", `rahu-ketu-gochar-${YEAR}`, "राहु-केतु", "Rahu Ketu", "राहु-केतु हमेशा उल्टी (वक्री) चाल से एक-दूसरे के ठीक सामने चलते हैं और लगभग डेढ़ साल एक राशि में रहते हैं।"),
  planetPage("Mars", `mangal-gochar-${YEAR}`, "मंगल", "Mars", "मंगल ऊर्जा, साहस, ज़मीन-जायदाद और विवाद के कारक हैं; ये लगभग डेढ़ महीने में राशि बदलते हैं।")
];

// ---------- hub ----------
const hubFaq = [[`गोचर ${YEAR} क्या है?`, "गोचर का अर्थ है ग्रहों का वर्तमान आकाश में चलना। किसी ग्रह का आपकी चंद्र राशि से किस भाव में होना उस समय के शुभ-अशुभ फल की दिशा बताता है।"], [`${YEAR} के सबसे बड़े गोचर कौन-से हैं?`, pages.map((x) => x.all.filter((a) => a.e.type === "enter" && ["Saturn", "Jupiter", "Rahu"].includes(a.p)).map((a) => `${dtxt(a.e.ms)}: ${evTxt(a.p, a.e)}`).join("; ")).filter(Boolean).join("; ")]];
const allEv = pages.flatMap((x) => x.all).sort((a, b) => a.e.ms - b.e.ms);
const hubIntro = `<p>${YEAR} में शनि, गुरु, राहु-केतु और मंगल कब राशि बदलेंगे, कब वक्री-मार्गी होंगे और इसका आपकी राशि पर क्या असर होगा — ज्योतिष तर्क के अपने खगोलीय गणना इंजन से निकाली गई सटीक तारीख़ें।</p>`;
const hubMain = `<div class="gc-hub">${pages.map((x) => `<a href="${x.slug}.html"><b>${x.h1.split(":")[0]}</b>${x.startLine}<br><span style="color:#7A1F1F;font-weight:700">पढ़ें →</span></a>`).join("")}</div>
<div class="gc-box"><h2>${YEAR} के सभी बड़े गोचर — एक नज़र में</h2><div style="overflow-x:auto"><table class="gc-tbl"><thead><tr><th>तारीख़</th><th>घटना</th></tr></thead><tbody>${allEv.map(({ p, e }) => `<tr><td>${dtxtP(e.ms)}</td><td>${evTxt(p, e)}</td></tr>`).join("")}</tbody></table></div></div>`;
fs.writeFileSync(path.join(ROOT, `gochar-${YEAR}.html`), page(`gochar-${YEAR}`, `ग्रह गोचर ${YEAR}: शनि, गुरु, राहु-केतु, मंगल — सभी तारीख़ें और राशियों पर असर | Jyotish Tark`, `ग्रह गोचर ${YEAR}: शनि, गुरु (बृहस्पति), राहु-केतु और मंगल के राशि परिवर्तन, वक्री-मार्गी होने की तारीख़ें और मेष से मीन तक सभी राशियों पर असर।`, `गोचर ${YEAR}, grah gochar ${YEAR}, planetary transit ${YEAR}, शनि गोचर ${YEAR}, गुरु गोचर ${YEAR}, राहु केतु गोचर ${YEAR}, मंगल गोचर ${YEAR}`, `ग्रह गोचर ${YEAR}`, `गोचर ${YEAR}`, { intro: hubIntro, main: hubMain }, hubFaq));
console.log("written:", pages.map((x) => x.slug).join(", "), `gochar-${YEAR}`);
allEv.forEach(({ p, e }) => console.log(" ", dtxtP(e.ms), "—", evTxt(p, e)));
