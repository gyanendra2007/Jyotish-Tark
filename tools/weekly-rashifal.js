#!/usr/bin/env node
/* ==========================================================================
   Jyotish Tark — weekly rashifal generator
   Writes ../weekly-rashifal.html for the week (Monday–Sunday) that contains
   the given date, from the real sidereal planet positions (KP ayanamsa).

   Usage (from the repo root):
     npm i --no-save astronomy-engine@2.1.19      # once
     node tools/weekly-rashifal.js 2026-11-16     # any date in the wanted week
   Or point ASTRO_JS to astronomy.browser.min.js instead of installing.
   Review the page, then commit and push.
   ========================================================================== */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");

// ---------- load the site's own engine ----------
global.window = global;
global.document = { readyState: "complete", addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; }, head: { appendChild() {} }, body: { appendChild() {} } };
if (process.env.ASTRO_JS) vm.runInThisContext(fs.readFileSync(process.env.ASTRO_JS, "utf8"));
else global.Astronomy = require("astronomy-engine");
require(path.join(ROOT, "birth-chart-calculator.js"));
require(path.join(ROOT, "kp-engine.js"));
const K = window.JTKP;
const LKO = { lat: 26.8467, lng: 80.9462 };

// ---------- names ----------
const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
const RASHI_EN = ["Mesh", "Vrishabh", "Mithun", "Kark", "Singh", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"];
const SYM = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PAGE2027 = ["mesh", "vrishabh", "mithun", "kark", "singh", "kanya", "tula", "vrishchik", "dhanu", "makar", "kumbh", "meen"];
const PN = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
const DAY = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const DAYLORD = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const COLOR = { Sun: "सुनहरा / नारंगी", Moon: "सफ़ेद / क्रीम", Mars: "लाल", Mercury: "हरा", Jupiter: "पीला", Venus: "गुलाबी / हल्का नीला", Saturn: "गहरा नीला / काला" };
const NUM = { Sun: 1, Moon: 2, Jupiter: 3, Mercury: 5, Venus: 6, Saturn: 8, Mars: 9 };
const ov = (h) => ["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"][h - 1];
const hFrom = (a, b) => ((b - a + 12) % 12) + 1;

// classical gochar: favourable houses counted from the Moon sign
const FAV = { Sun: [3, 6, 10, 11], Moon: [1, 3, 6, 7, 10, 11], Mars: [3, 6, 11], Mercury: [2, 4, 6, 8, 10, 11], Jupiter: [2, 5, 7, 9, 11], Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12], Saturn: [3, 6, 11], Rahu: [3, 6, 11], Ketu: [3, 6, 11] };
const W = { Jupiter: 3, Saturn: 3, Rahu: 1.5, Ketu: 1, Sun: 1.5, Mars: 1.5, Mercury: 1, Venus: 1 };
const fav = (p, h) => FAV[p].includes(h);

const GEN = {
  Sun: ["आत्मविश्वास ऊँचा रहेगा, पर अहं और थकान पर ध्यान दें", "धन और वाणी में सावधानी; परिवार में कड़वे शब्द न बोलें", "साहस और पहल का समय — रुके काम आगे बढ़ेंगे", "घर-परिवार में व्यस्तता, मन कुछ बेचैन रह सकता है", "बच्चों और पढ़ाई पर ध्यान; जल्दबाज़ी के फ़ैसले टालें", "प्रतियोगिता और विरोधियों पर जीत; सेहत में सुधार", "जीवनसाथी या साझेदार से मतभेद संभव — धैर्य रखें", "अचानक खर्च या थकान; यात्रा में सावधानी", "पिता या बड़ों से वैचारिक मतभेद; धार्मिक कार्यों में रुचि", "करियर में मान-सम्मान और अधिकारियों से सहयोग", "आय और लाभ के अवसर; प्रभावशाली लोगों से संपर्क", "खर्च अधिक और नींद कम; दूर स्थानों से जुड़ा काम"],
  Mars: ["ऊर्जा भरपूर, पर गुस्से और चोट से बचें", "वाणी में कठोरता से बचें; पैसों पर विवाद टालें", "साहस, खेल और मेहनत का सीधा फल", "घर में तनाव या मरम्मत का खर्च; वाहन सावधानी से चलाएँ", "प्रेम में बहस और निवेश में जल्दबाज़ी से बचें", "शत्रुओं और प्रतियोगिता पर विजय; कर्ज़ चुकाने का अच्छा समय", "रिश्तों में गर्मी; साझेदारी में साफ़ बात करें", "चोट और दुर्घटना से सावधान; जोखिम भरे काम टालें", "लंबी यात्रा या बड़ों से बहस — धैर्य से काम लें", "काम में तेज़ी, पर वरिष्ठों से टकराव न करें", "मेहनत से लाभ; ज़मीन-जायदाद के काम बनेंगे", "खर्च और नींद की कमी; गुप्त विरोध से सावधान"],
  Mercury: ["बातचीत में जल्दबाज़ी से ग़लतफ़हमी; काग़ज़ ध्यान से पढ़ें", "वाणी और हिसाब-किताब से धन लाभ", "छोटी यात्राएँ और भाई-बहन से जुड़े काम; सौदे में सावधानी", "पढ़ाई, घर और परिवार में सुखद माहौल", "पढ़ाई में ध्यान भटक सकता है; बच्चों से धैर्य से बात करें", "परीक्षा, प्रतियोगिता और नौकरी के काम सफल", "साझेदार से बहस में शब्द सँभालें", "शोध, बीमा या अचानक लाभ के योग", "योजनाओं में रुकावट; गुरुजनों की सलाह लें", "काम में सफलता; प्रेज़ेंटेशन और लिखित काम अच्छे", "मित्रों और नेटवर्क से लाभ", "खर्च और भूलने की आदत पर ध्यान; दस्तावेज़ सँभालकर रखें"],
  Venus: ["आकर्षण, सुख-सुविधा और प्रसन्नता बढ़ेगी", "धन, स्वादिष्ट भोजन और परिवार में मिठास", "मित्रों के साथ आनंद; कला-संगीत में रुचि", "घर की सजावट, वाहन या सुख-साधन", "प्रेम संबंधों में मधुरता; रचनात्मक काम सफल", "रिश्तों में छोटी नाराज़गी; खान-पान पर ध्यान", "दाम्पत्य में अपेक्षाएँ बढ़ेंगी; दिखावे पर खर्च टालें", "अचानक लाभ या ससुराल से सहयोग", "भाग्य का साथ; यात्रा और शुभ कार्य", "कार्यस्थल पर मनमुटाव से बचें", "आय, उपहार और सामाजिक लाभ", "आराम, यात्रा और सुख-साधनों पर खर्च"],
  Jupiter: ["ज़िम्मेदारियाँ बढ़ेंगी; सेहत और वज़न पर ध्यान", "धन संचय और परिवार में शुभ कार्य के योग", "मेहनत अधिक, फल धीरे", "घर-परिवार की चिंता; माता के स्वास्थ्य का ध्यान", "पढ़ाई, संतान और प्रेम के लिए बहुत शुभ समय", "काम का दबाव और खर्च; सेहत पर ध्यान", "विवाह, साझेदारी और मान-सम्मान के योग", "रुकावटें और अनचाहे खर्च — धैर्य रखें", "भाग्य प्रबल; धार्मिक और शुभ कार्य", "करियर में बदलाव या स्थान परिवर्तन — सोच-समझकर निर्णय", "आय और इच्छा-पूर्ति के प्रबल योग", "खर्च और यात्राएँ; दान-पुण्य से शांति"],
  Saturn: ["साढ़ेसाती का शिखर — मेहनत ज़्यादा, धैर्य ज़रूरी", "साढ़ेसाती का अंतिम चरण — धन और परिवार में संयम", "मेहनत का पक्का फल; साहस बढ़ेगा", "ढैय्या — घर और मन पर दबाव; माता की सेहत का ध्यान", "पढ़ाई और संतान से जुड़ी चिंता; धैर्य से काम लें", "शत्रुओं पर जीत, नौकरी में स्थिरता", "रिश्तों और साझेदारी में ज़िम्मेदारी बढ़ेगी", "ढैय्या — सेहत और अचानक बदलावों में सावधानी", "भाग्य धीमा; पिता या गुरु से मतभेद टालें", "काम का बोझ, पर मेहनत से पद पक्का", "लंबे समय से रुके लाभ मिलेंगे", "साढ़ेसाती का आरंभ — खर्च और नींद पर ध्यान"],
  Rahu: ["मन में भ्रम — बड़े निर्णय जल्दी न लें", "वाणी और खान-पान पर नियंत्रण रखें", "साहस और नए संपर्कों से लाभ", "घर में अशांति; संपत्ति के काग़ज़ जाँचें", "सट्टे और शॉर्टकट से बचें", "विरोधियों पर विजय", "रिश्तों में ग़लतफ़हमी; साझेदारी में पारदर्शिता रखें", "छिपे जोखिम; सेहत की जाँच करवाएँ", "परंपरा से हटकर सोच; बड़ों से बहस टालें", "करियर में अचानक बदलाव; दफ़्तर की राजनीति से दूर रहें", "अप्रत्याशित लाभ और बड़ा नेटवर्क", "फ़िज़ूलखर्च और नींद की कमी"]
};
const LOVEV = ["आकर्षण बढ़ेगा; रिश्तों में गर्मजोशी", "परिवार के साथ अच्छा समय और घर में मिठास", "दोस्ती से प्रेम की शुरुआत संभव", "घर में सुख और जीवनसाथी के साथ आराम", "प्रेम संबंधों के लिए बहुत अच्छा समय", "छोटी बातों पर नाराज़गी — शिकायत के बजाय बातचीत करें", "जीवनसाथी की अपेक्षाएँ बढ़ेंगी; दिखावे से बचें", "रिश्तों में गहराई; ससुराल से सहयोग", "साथ में यात्रा या धार्मिक कार्य का योग", "काम के कारण रिश्तों को समय कम — थोड़ा समय ज़रूर निकालें", "मित्रों से मेल-जोल; नए रिश्ते की शुरुआत संभव", "एकांत में साथ समय और आराम का योग"];
const REM = { Sun: "रविवार सुबह सूर्य को तांबे के लोटे से जल दें", Moon: "सोमवार को शिवलिंग पर जल और दूध चढ़ाएँ", Mars: "मंगलवार को हनुमान चालीसा पढ़ें; गुस्से पर संयम रखें", Mercury: "बुधवार को गाय को हरा चारा दें; गणेश जी को दूर्वा अर्पित करें", Jupiter: "गुरुवार को पीली दाल या केले का दान करें; बड़ों का आशीर्वाद लें", Venus: "शुक्रवार को सफ़ेद मिठाई या चावल का दान करें; घर साफ़-सुगंधित रखें", Saturn: "शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएँ; ज़रूरतमंदों की मदद करें", Rahu: "शनिवार को “ॐ रां राहवे नमः” का जप करें; नशे और शॉर्टकट से दूर रहें" };

// ---------- week ----------
const arg = process.argv[2] || new Date().toISOString().slice(0, 10);
const [y, m, d] = arg.split("-").map(Number);
const base = new Date(Date.UTC(y, m - 1, d));
const mon = new Date(base.getTime() - ((base.getUTCDay() + 6) % 7) * 864e5);
const days = [...Array(7)].map((_, i) => new Date(mon.getTime() + i * 864e5));
const iso = (t) => t.toISOString().slice(0, 10);
const at = (t, hh) => K.compute({ dob: iso(t), time: hh, ...LKO }).planets;
const label = (t) => `${t.getUTCDate()} ${MON[t.getUTCMonth()]}`;
const sun = days[6];
const range = `${mon.getUTCDate()}${mon.getUTCMonth() !== sun.getUTCMonth() ? " " + MON[mon.getUTCMonth()] : ""}–${sun.getUTCDate()} ${MON[sun.getUTCMonth()]} ${sun.getUTCFullYear()}`;

// Moon each day at 06:00 IST plus sign-change times (hourly scan)
const moonDays = days.map((t) => {
  const s6 = at(t, "06:00").Moon.sign; let change = null;
  for (let h = 7; h <= 29; h++) {
    const tt = new Date(t.getTime() + Math.floor(h / 24) * 864e5), hh = String(h % 24).padStart(2, "0") + ":00";
    const s = at(tt, hh).Moon.sign;
    if (s !== s6) { change = { to: s, time: h < 24 ? hh : "अगली सुबह " + hh }; break; }
  }
  return { t, sign: s6, change, dow: t.getUTCDay() };
});
// planet events across the week
const PL = ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"];
const noon = days.map((t) => at(t, "12:00"));
const prev = at(new Date(mon.getTime() - 864e5), "12:00");
const events = [];
PL.forEach((p) => {
  let a = prev[p];
  noon.forEach((P, i) => {
    const b = P[p];
    if (b.sign !== a.sign) {
      // Dates here carry IST wall-clock time in their UTC fields (that is how at() reads them)
      let lo = new Date(days[i].getTime() - 12 * 36e5), hi = new Date(days[i].getTime() + 12 * 36e5);
      for (let k = 0; k < 7; k++) { const md = new Date((lo.getTime() + hi.getTime()) / 2); const hh = String(md.getUTCHours()).padStart(2, "0") + ":" + String(md.getUTCMinutes()).padStart(2, "0"); if (at(md, hh)[p].sign === b.sign) hi = md; else lo = md; }
      const hr = hi.getUTCHours(), when = `${hi.getUTCDate()} ${MON[hi.getUTCMonth()]} (${hr < 12 ? "सुबह" : hr < 17 ? "दोपहर" : hr < 20 ? "शाम" : "रात"})`;
      events.push({ p, i, txt: `${when} — ${PN[p]} ${RASHI[b.sign - 1]} राशि में प्रवेश करेंगे` });
    }
    if (!["Rahu"].includes(p) && b.retro !== a.retro) events.push({ p, i, txt: `${label(days[i])} — ${PN[p]} ${b.retro ? "वक्री" : "मार्गी"} होंगे (${RASHI[b.sign - 1]} राशि में)` });
    a = b;
  });
});
const mid = noon[3];
const sky = PL.map((p) => `${PN[p]} — ${RASHI[mid[p].sign - 1]}${mid[p].retro && p !== "Rahu" ? " (वक्री)" : ""}`).concat([`केतु — ${RASHI[mid.Ketu.sign - 1]}`]);

// ---------- per rashi ----------
function forRashi(R) {
  const H = {}; [...PL, "Ketu"].forEach((p) => { H[p] = hFrom(R, mid[p].sign); });
  let score = 0;
  Object.keys(W).forEach((p) => { score += (fav(p, H[p]) ? 1 : -1) * W[p]; });
  const md = moonDays.map((x) => ({ ...x, h: hFrom(R, x.sign) }));
  const good = md.filter((x) => FAV.Moon.includes(x.h));
  const ch8 = md.filter((x) => x.h === 8);
  score += good.length * 0.35 - ch8.length * 0.6;
  const stars = Math.max(2, Math.min(5, Math.round(3 + score / 6)));
  const dname = (x) => `${DAY[x.dow]} (${label(x.t)})`;
  // best day: favourable Moon, prefer 11/10/1, weekday lord friendly to rashi lord
  const order = { 11: 6, 10: 5, 1: 4, 7: 3, 3: 2, 6: 1 };
  const best = good.slice().sort((a, b) => (order[b.h] || 0) - (order[a.h] || 0))[0] || md[0];
  const bl = DAYLORD[best.dow];

  // general: Sun + any planet that changes sign this week + Jupiter/Saturn background
  const ev = events.filter((e) => e.p !== "Sun" && e.txt.includes("प्रवेश")).map((e) => e.p);
  const fast = ["Sun", ...ev.filter((p) => p !== "Sun")].slice(0, 2);
  const g1 = fast.map((p) => `${PN[p]} ${ov(H[p])} भाव में — ${GEN[p][H[p] - 1]}।`).join(" ");
  const slow = Math.abs((fav("Jupiter", H.Jupiter) ? 1 : 0) - (fav("Saturn", H.Saturn) ? 1 : 0)) ? (fav("Jupiter", H.Jupiter) ? "Jupiter" : "Saturn") : "Jupiter";
  const g2 = `पृष्ठभूमि में ${PN.Jupiter} ${ov(H.Jupiter)} भाव (${GEN.Jupiter[H.Jupiter - 1]}) और ${PN.Saturn} ${ov(H.Saturn)} भाव (${GEN.Saturn[H.Saturn - 1]})।`;
  const g3 = `इस सप्ताह ${good.length} दिन चंद्रमा आपके लिए अनुकूल भावों में है${ch8.length ? `, जबकि ${ch8.map(dname).join(" और ")} चंद्र आठवें भाव में रहेगा` : ""}।`;

  // career
  const carC = ["Saturn", "Mercury", "Mars", "Sun"].filter((p) => !fast.includes(p));
  const carP = carC.find((p) => [10, 6, 11, 3].includes(H[p])) || carC.find((p) => [1, 2, 7, 12].includes(H[p])) || carC[0];
  const md10 = md.filter((x) => x.h === 10 || x.h === 11);
  const career = `${PN[carP]} ${ov(H[carP])} भाव में: ${GEN[carP][H[carP] - 1]}। ${fav(carP, H[carP]) ? `नए काम, मीटिंग या इंटरव्यू के लिए ${md10.length ? dname(md10[0]) : dname(best)} अच्छा रहेगा।` : `महत्वपूर्ण बातचीत ${dname(best)} को रखें, ${ch8.length ? dname(ch8[0]) + " को टालें" : "जल्दबाज़ी न करें"}।`}`;
  // money
  const monP = ["Jupiter", "Venus", "Mercury"].filter((p) => !fast.includes(p) && p !== carP).find((p) => [2, 11].includes(H[p]));
  const expP = ["Mars", "Sun", "Rahu", "Saturn"].filter((p) => p !== carP).find((p) => [12, 8, 2].includes(H[p]));
  const md11 = md.filter((x) => x.h === 11 || x.h === 2);
  const money = monP ? `${PN[monP]} ${ov(H[monP])} भाव में — ${GEN[monP][H[monP] - 1]}।${md11.length ? ` ${dname(md11[0])} आर्थिक काम के लिए शुभ।` : ""}` : expP ? `${PN[expP]} ${ov(H[expP])} भाव में होने से खर्च बढ़ सकता है — बजट बनाकर चलें, उधार देने से बचें।${md11.length ? ` लेन-देन के लिए ${dname(md11[0])} बेहतर है।` : ""}` : `आय सामान्य, खर्च नियंत्रण में रहेगा।${md11.length ? ` ${dname(md11[0])} पैसों से जुड़े काम निपटाएँ।` : " बड़े निवेश अगले सप्ताह तक टाल सकते हैं।"}`;
  // love & family
  const md7 = md.filter((x) => x.h === 7 || x.h === 5);
  const loveBad = ["Mars", "Rahu", "Saturn"].find((p) => [5, 7].includes(H[p]));
  const love = `${PN.Venus} ${ov(H.Venus)} भाव में — ${LOVEV[H.Venus - 1]}।${loveBad ? ` ${PN[loveBad]} ${ov(H[loveBad])} भाव में होने से ${loveBad === "Mars" ? "जल्दबाज़ी और गुस्से में बहस" : loveBad === "Saturn" ? "भावनाएँ कम व्यक्त होना" : "ग़लतफ़हमी"} संभव — खुलकर बात करें।` : ""}${md7.length ? ` साथ समय बिताने के लिए ${dname(md7[0])} अच्छा है।` : ""}`;
  // health
  const hp = ["Mars", "Saturn", "Sun", "Rahu"].find((p) => [1, 8, 12, 6].includes(H[p]) && !fav(p, H[p]));
  const BODY = { Mars: "चोट, बुखार और रक्तचाप", Saturn: "जोड़ों, कमर और थकान", Sun: "आँखों, सिर और ऊर्जा", Rahu: "नींद, पेट और बेचैनी" };
  const health = `${ch8.length ? `${ch8.map(dname).join(", ")} चंद्र आठवें भाव में — मन भारी या थकान हो सकती है; आराम और पानी पर ध्यान दें। ` : ""}${hp ? `${PN[hp]} ${ov(H[hp])} भाव में — ${BODY[hp]} का ध्यान रखें।` : "सेहत सामान्य रहेगी; नियमित दिनचर्या बनाए रखें।"}`;
  // remedy for the weakest heavy planet
  const weak = ["Saturn", "Jupiter", "Rahu", "Mars", "Sun", "Mercury", "Venus"].find((p) => !fav(p, H[p])) || "Jupiter";
  return { R, H, stars, g: [g1, g2, g3].join(" "), career, money, love, health, good: good.slice(0, 3).map(dname), caution: ch8.map(dname), color: COLOR[bl], num: NUM[bl], remedy: `${REM[weak]} (${PN[weak]} ${ov(H[weak])} भाव में)` };
}
const out = [...Array(12)].map((_, i) => forRashi(i + 1));

// ---------- page ----------
const SRC = fs.readFileSync(path.join(ROOT, "kp-astrology.html"), "utf8");
const HEAD_TOP = SRC.slice(0, SRC.indexOf("<title>"));
const HEADER = SRC.slice(SRC.indexOf('<header class="jt-header'), SRC.indexOf("</header>") + 9).replace(/ aria-current="page"/g, "");
const FOOTER = SRC.slice(SRC.indexOf('<footer class="jt-footer'), SRC.indexOf("</footer>") + 9);
const ICONS = SRC.split("\n").filter((l) => /rel="icon"|apple-touch-icon/.test(l)).map((l) => l.trim()).join("\n");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const title = `साप्ताहिक राशिफल ${range} — सभी 12 राशियाँ | Jyotish Tark`;
const desc = `साप्ताहिक राशिफल ${range}: मेष से मीन तक सभी 12 राशियों का करियर, धन, प्रेम, सेहत, शुभ दिन, सावधानी के दिन, शुभ रंग-अंक और उपाय — इस सप्ताह के वास्तविक ग्रह-गोचर से।`;
const url = "https://jyotishtark.in/weekly-rashifal.html";
const FAQ = [
  ["साप्ताहिक राशिफल किस राशि से देखें?", "वैदिक ज्योतिष में राशिफल चंद्र राशि (जन्म राशि) से देखा जाता है। अपनी राशि न पता हो तो <a href=\"kundali-form.html\">मुफ़्त कुंडली</a> बनाएँ या <a href=\"naam-akshar-calculator.html\">नाम अक्षर तालिका</a> से नाम राशि देखें।"],
  ["यह राशिफल कैसे बनता है?", "इस सप्ताह के वास्तविक ग्रह-गोचर (KP अयनांश, लखनऊ) से: सूर्य, मंगल, बुध, शुक्र, गुरु, शनि और राहु आपकी राशि से किस भाव में हैं, और हर दिन चंद्रमा किस भाव में है। शुभ दिन वे हैं जब चंद्रमा आपकी राशि से 1, 3, 6, 7, 10 या 11वें भाव में हो।"],
  ["सावधानी के दिन क्या हैं?", "जब चंद्रमा आपकी राशि से आठवें भाव में होता है (चंद्राष्टम), तो परंपरा में बड़े निर्णय, यात्रा और विवाद टालने की सलाह दी जाती है।"],
  ["क्या यह सबके लिए एक जैसा सही होगा?", "यह राशि (गोचर) पर आधारित सामान्य फल है। व्यक्तिगत फल आपकी कुंडली की दशा और ग्रहों पर निर्भर करता है — इसके लिए अपनी कुंडली दिखाएँ।"]
];
const ld = { "@context": "https://schema.org", "@graph": [
  { "@type": "Article", "headline": `साप्ताहिक राशिफल ${range}`, "description": desc, "inLanguage": "hi-IN", "datePublished": iso(new Date(mon.getTime() - 2 * 864e5)), "dateModified": iso(new Date()), "author": { "@type": "Person", "name": "ज्ञानेंद्र सिंह तोमर" }, "publisher": { "@type": "Organization", "name": "Jyotish Tark", "logo": { "@type": "ImageObject", "url": "https://jyotishtark.in/logo.png" } }, "mainEntityOfPage": url },
  { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jyotishtark.in/" }, { "@type": "ListItem", "position": 2, "name": "राशिफल", "item": "https://jyotishtark.in/rashifal.html" }, { "@type": "ListItem", "position": 3, "name": "साप्ताहिक राशिफल", "item": url }] },
  { "@type": "FAQPage", "mainEntity": FAQ.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a.replace(/<[^>]+>/g, "") } })) }] };
const st = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const card = (r) => `<article class="wr-card" id="${RASHI_EN[r.R - 1].toLowerCase()}">
  <header><span class="wr-sym" aria-hidden="true">${SYM[r.R - 1]}</span><div><h2>${RASHI[r.R - 1]} <small>${RASHI_EN[r.R - 1]}</small></h2><span class="wr-st" aria-label="${r.stars} में से 5">${st(r.stars)}</span></div></header>
  <p>${r.g}</p>
  <dl><dt>💼 करियर</dt><dd>${r.career}</dd><dt>💰 धन</dt><dd>${r.money}</dd><dt>❤️ प्रेम व परिवार</dt><dd>${r.love}</dd><dt>🩺 सेहत</dt><dd>${r.health}</dd></dl>
  <ul class="wr-mini"><li><b>शुभ दिन:</b> ${r.good.join(", ") || "—"}</li>${r.caution.length ? `<li><b>सावधानी:</b> ${r.caution.join(", ")}</li>` : ""}<li><b>शुभ रंग:</b> ${r.color}</li><li><b>शुभ अंक:</b> ${r.num}</li></ul>
  <p class="wr-rem"><b>उपाय:</b> ${r.remedy}</p>
  <p class="wr-more"><a href="${PAGE2027[r.R - 1]}-rashifal-2027.html">${RASHI[r.R - 1]} राशिफल 2027 →</a></p>
</article>`;
const html = `${HEAD_TOP}<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="साप्ताहिक राशिफल, weekly rashifal, saptahik rashifal, इस सप्ताह का राशिफल, weekly horoscope hindi, मेष साप्ताहिक राशिफल, ${range}">
    <meta name="author" content="Gyanendra Singh Tomar - Jyotish Tark">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="article"><meta property="og:image" content="https://jyotishtark.in/logo.png"><meta property="og:locale" content="hi_IN"><meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Mukta:wght@400;500;600;700;800&display=swap">
    <link rel="stylesheet" href="tailwind.css?v=1">
    <link rel="stylesheet" href="jt-theme.css?v=5">
    <script src="jt-site.js?v=11" defer></script>
    ${ICONS}
    <style>
    .wr{--mr:#7A1F1F;--mrd:#5A1414;--ln:#E8DCC4;--ink:#2B1810;--bd:#4A3628;--mu:#6B5444;color:var(--ink);font-family:'Mukta',system-ui,sans-serif;font-size:17px;line-height:1.65}
    .wr-wrap{max-width:1080px;margin:0 auto;padding:0 16px}
    .wr-hero{background:radial-gradient(900px 400px at 85% 10%,#F6DFB8 0,transparent 60%),linear-gradient(180deg,#FBF6EC,#F5EBD8);border-bottom:1px solid var(--ln);padding:24px 0 28px}
    .wr-hero h1{font-size:clamp(1.7rem,4vw,2.6rem);line-height:1.2;margin:.4rem 0 .5rem;color:var(--mrd)!important}
    .wr-hero p{margin:0;color:var(--bd);max-width:760px}
    .wr-crumb{font-size:14px;color:var(--mu)}.wr-crumb a{color:var(--mr)}
    .wr-jump{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0}.wr-jump a{background:#fff;border:1px solid #E6C98A;border-radius:999px;padding:.3rem .8rem;font-weight:700;color:var(--mrd)!important;text-decoration:none!important}
    .wr-box{background:#fff;border:1px solid var(--ln);border-radius:16px;padding:16px 18px;margin:20px 0}
    .wr-box h2{font-size:1.3rem;color:var(--mrd);margin:0 0 .5rem}
    .wr ul{list-style:disc;padding-left:1.3rem}.wr li{margin:.2rem 0}
    .wr-tbl{width:100%;border-collapse:collapse;font-size:15.5px}.wr-tbl th{background:var(--mr);color:#fff!important;text-align:left;padding:.5rem .7rem;font-weight:600}.wr-tbl td{border-bottom:1px solid var(--ln);padding:.5rem .7rem}
    .wr-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin:10px 0 24px}
    .wr-card{background:#fff;border:1px solid var(--ln);border-radius:18px;padding:18px;scroll-margin-top:90px}
    .wr-card header{display:flex;gap:12px;align-items:center;margin-bottom:.4rem}
    .wr-sym{width:52px;height:52px;border-radius:50%;background:var(--mr);color:#F5C46B;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex:0 0 52px}
    .wr-card h2{font-size:1.45rem;margin:0;color:var(--mrd)}.wr-card h2 small{font-size:.9rem;color:var(--mu);font-family:'Mukta',sans-serif}
    .wr-st{color:#C2410C;letter-spacing:2px}
    .wr-card dl{margin:.6rem 0;display:grid;grid-template-columns:auto 1fr;gap:6px 12px}.wr-card dt{font-weight:700;white-space:nowrap}.wr-card dd{margin:0;color:var(--bd)}
    .wr-mini{background:#FBF6EC;border-radius:12px;padding:.6rem .8rem .6rem 1.8rem;margin:.6rem 0;font-size:15.5px}
    .wr-rem{font-size:15.5px;margin:.4rem 0}.wr-more{margin:.3rem 0 0}.wr-more a{color:var(--mr);font-weight:700}
    .wr-faq details{background:#fff;border:1px solid var(--ln);border-radius:12px;margin:0 0 8px;padding:0 14px}.wr-faq summary{cursor:pointer;font-weight:700;padding:12px 0}.wr-faq p{margin:0 0 12px}
    .wr-cta{background:var(--mr);color:#FBF6EC;border-radius:16px;padding:16px 18px;margin:0 0 24px}.wr-cta a{color:#F1D99A;font-weight:700}
    @media (max-width:760px){.wr-grid{grid-template-columns:1fr}.wr-card dl{grid-template-columns:1fr}.wr-card dt{margin-top:4px}}
    </style>
</head>
<body class="min-h-screen">
${HEADER}
<main id="main" class="wr">
  <section class="wr-hero"><div class="wr-wrap">
    <nav class="wr-crumb" aria-label="Breadcrumb"><a href="index.html">होम</a> / <a href="rashifal.html">राशिफल</a> / साप्ताहिक राशिफल</nav>
    <h1>साप्ताहिक राशिफल: ${range}</h1>
    <p>इस सप्ताह (सोमवार से रविवार) के वास्तविक ग्रह-गोचर से सभी 12 राशियों का फल — करियर, धन, प्रेम, सेहत, शुभ दिन और सावधानी के दिन। अपनी <b>चंद्र राशि</b> चुनें:</p>
    <nav class="wr-jump" aria-label="राशि चुनें">${RASHI.map((r, i) => `<a href="#${RASHI_EN[i].toLowerCase()}">${SYM[i]} ${r}</a>`).join("")}</nav>
  </div></section>
  <div class="wr-wrap">
    <div class="wr-box"><h2>इस सप्ताह का आकाश</h2>
      ${events.length ? `<ul>${events.map((e) => `<li><b>${e.txt}</b></li>`).join("")}</ul>` : "<p>इस सप्ताह कोई बड़ा ग्रह राशि नहीं बदल रहा।</p>"}
      <p style="margin:.4rem 0"><b>ग्रहों की स्थिति:</b> ${sky.join(" · ")}</p>
      <div style="overflow-x:auto"><table class="wr-tbl"><thead><tr><th>दिन</th><th>चंद्र राशि (सुबह 6 बजे)</th><th>राशि परिवर्तन</th></tr></thead><tbody>
      ${moonDays.map((x) => `<tr><td>${DAY[x.dow]}, ${label(x.t)}</td><td>${RASHI[x.sign - 1]}</td><td>${x.change ? `${x.change.time} के आसपास ${RASHI[x.change.to - 1]} में` : "—"}</td></tr>`).join("")}</tbody></table></div>
    </div>
    <div class="wr-grid">${out.map(card).join("")}</div>
    <div class="wr-cta"><b>अपनी कुंडली के अनुसार सटीक भविष्य?</b> राशिफल सबके लिए एक जैसा होता है; आपकी दशा और ग्रह अलग हैं — <a href="kundali-form.html">मुफ़्त कुंडली बनाएँ</a> · <a href="kp-astrology.html">KP विस्तृत रिपोर्ट ₹299</a> · <a href="rashifal.html">आज का राशिफल</a></div>
    <div class="wr-faq"><h2 style="font-size:1.4rem;color:#5A1414">अक्सर पूछे जाने वाले प्रश्न</h2>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    <p style="font-size:14px;color:#6B5444;margin:16px 0 28px">यह राशिफल चंद्र राशि से गोचर (KP अयनांश, लखनऊ के समय) पर आधारित सामान्य मार्गदर्शन है, गारंटी नहीं। अगला राशिफल हर सोमवार से पहले अपडेट होता है।</p>
  </div>
</main>
${FOOTER}
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, "weekly-rashifal.html"), html);
console.log("weekly-rashifal.html written for", range, "| events:", events.length);
out.forEach((r) => console.log(RASHI[r.R - 1], r.stars, "good:", r.good.join(", "), "| caution:", r.caution.join(", ")));
