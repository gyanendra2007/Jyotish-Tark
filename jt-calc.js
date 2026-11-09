/* ==========================================================================
   JYOTISH TARK — shared engine for the free calculators
   (Manglik, Sade Sati, Naam akshar, Kaal sarp, Guna milan / compatibility)
   Needs on the page (deferred, in this order): astronomy-engine, birth-chart-calculator.js,
   kp-engine.js, kp-extra.js, then this file.
   Sidereal positions come from kp-engine (KP ayanamsa, Swiss-Ephemeris-checked).
   ========================================================================== */
window.JTCalc = (function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const RASHI_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const NAK = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"];
  const PN = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const my = (d) => `${MON[d.getMonth()]} ${d.getFullYear()}`;
  const dmy = (d) => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
  const ov = (h) => `${h}${({ 1: "ले", 2: "रे", 3: "रे", 4: "थे", 6: "ठे" })[h] || "वें"}`;
  const track = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* ignore */ } };

  // ---------- naam akshar: 4 syllables per nakshatra pada ----------
  const PADA = [["चू", "चे", "चो", "ला"], ["ली", "लू", "ले", "लो"], ["अ", "इ", "उ", "ए"], ["ओ", "वा", "वी", "वू"], ["वे", "वो", "का", "की"], ["कू", "घ", "ङ", "छ"], ["के", "को", "हा", "ही"], ["हू", "हे", "हो", "डा"], ["डी", "डू", "डे", "डो"], ["मा", "मी", "मू", "मे"], ["मो", "टा", "टी", "टू"], ["टे", "टो", "पा", "पी"], ["पू", "ष", "ण", "ठ"], ["पे", "पो", "रा", "री"], ["रू", "रे", "रो", "ता"], ["ती", "तू", "ते", "तो"], ["ना", "नी", "नू", "ने"], ["नो", "या", "यी", "यू"], ["ये", "यो", "भा", "भी"], ["भू", "धा", "फा", "ढा"], ["भे", "भो", "जा", "जी"], ["खी", "खू", "खे", "खो"], ["गा", "गी", "गू", "गे"], ["गो", "सा", "सी", "सू"], ["से", "सो", "दा", "दी"], ["दू", "थ", "झ", "ञ"], ["दे", "दो", "चा", "ची"]];
  const RASHI_AKSHAR = [["चू", "चे", "चो", "ला", "ली", "लू", "ले", "लो", "अ"], ["इ", "उ", "ए", "ओ", "वा", "वी", "वू", "वे", "वो"], ["का", "की", "कू", "घ", "ङ", "छ", "के", "को", "हा"], ["ही", "हू", "हे", "हो", "डा", "डी", "डू", "डे", "डो"], ["मा", "मी", "मू", "मे", "मो", "टा", "टी", "टू", "टे"], ["टो", "पा", "पी", "पू", "ष", "ण", "ठ", "पे", "पो"], ["रा", "री", "रू", "रे", "रो", "ता", "ती", "तू", "ते"], ["तो", "ना", "नी", "नू", "ने", "नो", "या", "यी", "यू"], ["ये", "यो", "भा", "भी", "भू", "धा", "फा", "ढा", "भे"], ["भो", "जा", "जी", "खी", "खू", "खे", "खो", "गा", "गी"], ["गू", "गे", "गो", "सा", "सी", "सू", "से", "सो", "दा"], ["दी", "दू", "थ", "झ", "ञ", "दे", "दो", "चा", "ची"]];

  // ---------- ashtakoot (36 guna) tables ----------
  const VARNA = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]; // 4 Brahmin, 3 Kshatriya, 2 Vaishya, 1 Shudra
  const VARNA_N = { 4: "ब्राह्मण", 3: "क्षत्रिय", 2: "वैश्य", 1: "शूद्र" };
  const VASHYA_N = ["चतुष्पद", "मानव", "जलचर", "वनचर", "कीट"];
  const vashyaOf = (sign, deg) => [0, 0, 1, 2, 3, 1, 1, 4, deg < 15 ? 1 : 0, deg < 15 ? 0 : 2, 1, 2][sign - 1];
  const VASHYA_M = [[2, 1, 1, 0.5, 1], [1, 2, 0.5, 0, 1], [1, 0.5, 2, 1, 1], [0.5, 0, 1, 2, 0], [1, 1, 1, 0, 2]];
  const YONI_OF = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
  const YONI_N = ["अश्व", "गज", "मेष (बकरा)", "सर्प", "श्वान", "मार्जार", "मूषक", "गौ", "महिष", "व्याघ्र", "मृग", "वानर", "नकुल", "सिंह"];
  const YONI_M = [[4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1], [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0], [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1], [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2], [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1], [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1], [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2], [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1], [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1], [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1], [3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1], [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2], [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2], [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4]];
  const FR = { Sun: { f: ["Moon", "Mars", "Jupiter"], e: ["Venus", "Saturn"] }, Moon: { f: ["Sun", "Mercury"], e: [] }, Mars: { f: ["Sun", "Moon", "Jupiter"], e: ["Mercury"] }, Mercury: { f: ["Sun", "Venus"], e: ["Moon"] }, Jupiter: { f: ["Sun", "Moon", "Mars"], e: ["Mercury", "Venus"] }, Venus: { f: ["Mercury", "Saturn"], e: ["Sun", "Moon"] }, Saturn: { f: ["Mercury", "Venus"], e: ["Sun", "Moon", "Mars"] } };
  const rel = (a, b) => (a === b ? 2 : FR[a].f.includes(b) ? 2 : FR[a].e.includes(b) ? 0 : 1); // 2 friend, 1 neutral, 0 enemy
  const GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0]; // 0 Deva 1 Manushya 2 Rakshasa
  const GANA_N = ["देव", "मनुष्य", "राक्षस"];
  const GANA_M = [[6, 6, 1], [5, 6, 0], [1, 0, 6]];
  const NADI = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
  const NADI_N = ["आदि", "मध्य", "अंत्य"];

  // m = { sign 1-12, nak 1-27, deg (in sign) }
  function ashtakoot(boy, girl) {
    const K = [];
    const vb = VARNA[boy.sign - 1], vg = VARNA[girl.sign - 1];
    K.push({ k: "वर्ण", max: 1, s: vb >= vg ? 1 : 0, b: VARNA_N[vb], g: VARNA_N[vg], m: "कर्म और अहं का तालमेल" });
    const wb = vashyaOf(boy.sign, boy.deg), wg = vashyaOf(girl.sign, girl.deg);
    K.push({ k: "वश्य", max: 2, s: VASHYA_M[wb][wg], b: VASHYA_N[wb], g: VASHYA_N[wg], m: "आपसी आकर्षण और प्रभाव" });
    const t1 = ((boy.nak - girl.nak + 27) % 27 + 1) % 9, t2 = ((girl.nak - boy.nak + 27) % 27 + 1) % 9;
    const tara = ([3, 5, 7].includes(t1) ? 0 : 1.5) + ([3, 5, 7].includes(t2) ? 0 : 1.5);
    K.push({ k: "तारा", max: 3, s: tara, b: NAK[boy.nak - 1], g: NAK[girl.nak - 1], m: "भाग्य और स्वास्थ्य का साथ" });
    const yb = YONI_OF[boy.nak - 1], yg = YONI_OF[girl.nak - 1];
    K.push({ k: "योनि", max: 4, s: YONI_M[yb][yg], b: YONI_N[yb], g: YONI_N[yg], m: "स्वभाव और शारीरिक अनुकूलता" });
    const lb = LORD[boy.sign - 1], lg = LORD[girl.sign - 1], r1 = rel(lb, lg), r2 = rel(lg, lb);
    const gm = lb === lg ? 5 : r1 + r2 === 4 ? 5 : r1 + r2 === 3 ? 4 : r1 + r2 === 2 ? (r1 === 1 ? 3 : 1) : r1 + r2 === 1 ? 0.5 : 0;
    K.push({ k: "ग्रह मैत्री", max: 5, s: gm, b: PN[lb], g: PN[lg], m: "सोच और मानसिक मेल" });
    const gb = GANA[boy.nak - 1], gg = GANA[girl.nak - 1];
    K.push({ k: "गण", max: 6, s: GANA_M[gb][gg], b: GANA_N[gb], g: GANA_N[gg], m: "स्वभाव और व्यवहार" });
    const n = ((boy.sign - girl.sign + 12) % 12) + 1;
    const bhak = [2, 12, 5, 9, 6, 8].includes(n) ? 0 : 7;
    K.push({ k: "भकूट", max: 7, s: bhak, b: RASHI[boy.sign - 1], g: RASHI[girl.sign - 1], m: "प्रेम, परिवार और समृद्धि" });
    const nb = NADI[boy.nak - 1], ng = NADI[girl.nak - 1];
    K.push({ k: "नाड़ी", max: 8, s: nb === ng ? 0 : 8, b: NADI_N[nb], g: NADI_N[ng], m: "स्वास्थ्य और संतान" });
    const total = K.reduce((a, x) => a + x.s, 0);
    // classical exceptions (parihar)
    const notes = [];
    if (nb === ng) {
      if (boy.sign === girl.sign && boy.nak !== girl.nak) notes.push("नाड़ी दोष है, पर दोनों की राशि एक और नक्षत्र अलग हैं — शास्त्रों में इसे नाड़ी दोष का परिहार माना गया है।");
      else if (boy.nak === girl.nak && boy.sign !== girl.sign) notes.push("नाड़ी दोष है, पर नक्षत्र एक और राशि अलग है — इसे परिहार माना जाता है।");
      else if (boy.nak === girl.nak && boy.pada && girl.pada && boy.pada !== girl.pada) notes.push("नाड़ी दोष है, पर नक्षत्र एक होते हुए चरण अलग हैं — इसे आंशिक परिहार माना जाता है।");
      else notes.push("नाड़ी दोष (0/8) है। परंपरा में इसे गंभीरता से देखा जाता है — पूरी कुंडली मिलान और विशेषज्ञ की सलाह अवश्य लें।");
    }
    if (bhak === 0) {
      if (lb === lg || rel(lb, lg) === 2 && rel(lg, lb) === 2) notes.push("भकूट दोष है, पर दोनों राशियों के स्वामी एक या मित्र हैं — इसे भकूट दोष का परिहार माना जाता है।");
      else notes.push(`भकूट दोष (${n === 2 || n === 12 ? "2-12" : n === 5 || n === 9 ? "5-9" : "6-8"}) है — परिवार और धन से जुड़े विषयों में समझदारी चाहिए।`);
    }
    if (GANA_M[gb][gg] <= 1 && gb !== gg) notes.push("गण दोष है — स्वभाव में अंतर के कारण धैर्य और संवाद ज़रूरी है।");
    return { K, total, notes };
  }
  const verdict = (t) => (t >= 32 ? ["उत्तम", "बहुत अच्छा मिलान"] : t >= 25 ? ["बहुत अच्छा", "अच्छा मिलान"] : t >= 18 ? ["मध्यम", "विवाह योग्य माना जाता है"] : ["कमज़ोर", "18 से कम — परंपरा में अनुशंसित नहीं"]);

  // ---------- chart ----------
  function ready(fn, fail) {
    let n = 0;
    (function wait() {
      if (window.Astronomy && window.BirthChartCalculator && window.JTKP && window.JTKPX) return fn();
      if (++n > 150) return fail && fail();
      setTimeout(wait, 100);
    })();
  }
  function chart(o) {
    const c = window.JTKP.compute({ dob: o.dob, time: o.time || "12:00", lat: o.lat, lng: o.lng });
    const X = window.JTKPX.compute(c, { lang: "hi", dob: o.dob, time: o.time || "12:00", lat: o.lat, lng: o.lng });
    return { c, X, P: c.planets };
  }
  const moonInfo = (P) => { const m = P.Moon, deg = ((m.lon % 30) + 30) % 30; return { sign: m.sign, nak: m.nak, deg, pada: Math.floor(((m.lon % (40 / 3)) + 40 / 3) % (40 / 3) / (10 / 3)) + 1 }; };
  // Moon range over a whole day (for date-only inputs)
  function dayMoon(dob) {
    const LKO = { lat: 26.8467, lng: 80.9462 };
    const a = chart({ dob, time: "00:01", ...LKO }), b = chart({ dob, time: "23:59", ...LKO }), m = chart({ dob, time: "12:00", ...LKO });
    const A = moonInfo(a.P), B = moonInfo(b.P), M = moonInfo(m.P);
    return { mid: M, signChanges: A.sign !== B.sign, nakChanges: A.nak !== B.nak, start: A, end: B };
  }

  // ---------- form ----------
  const CSS = `
  .jc{--mr:#7A1F1F;--mrd:#5A1414;--sf:#C2410C;--gd:#B8892B;--ln:#E8DCC4;--iv:#FBF6EC;--ink:#2B1810;--bd:#4A3628;--mu:#6B5444;color:var(--ink);font-family:'Mukta',system-ui,sans-serif;font-size:17px;line-height:1.6}
  .jc *{box-sizing:border-box}
  .jc-wrap{max-width:980px;margin:0 auto;padding:0 16px}
  .jc-hero{background:radial-gradient(900px 400px at 85% 10%,#F6DFB8 0,transparent 60%),linear-gradient(180deg,#FBF6EC,#F5EBD8);border-bottom:1px solid var(--ln);padding:26px 0 30px}
  .jc-crumb{font-size:14px;color:var(--mu)}.jc-crumb a{color:var(--mr)}
  .jc-hero h1{font-size:clamp(1.8rem,4.2vw,2.8rem);line-height:1.2;margin:.4rem 0 .6rem;color:var(--mrd)!important}
  .jc-hero p{margin:0;color:var(--bd);max-width:720px;font-size:1.06rem}
  .jc-card{background:#fff;border:1px solid var(--ln);border-radius:18px;padding:20px;margin:22px 0;box-shadow:0 10px 30px rgba(90,20,20,.06)}
  .jc-card h2{font-size:1.45rem;margin:0 0 .6rem;color:var(--mrd)}
  .jc-f{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  .jc-f label{display:flex;flex-direction:column;font-weight:600;font-size:15px;color:var(--bd);position:relative}
  .jc-f input,.jc-f select{font:inherit;font-weight:400;border:1.5px solid #D9C6A0;border-radius:10px;padding:.6rem .75rem;margin-top:.25rem;background:#fff;color:var(--ink);min-height:48px;width:100%}
  .jc-f input:focus,.jc-f select:focus{border-color:var(--mr);outline:none;box-shadow:0 0 0 3px rgba(122,31,31,.12)}
  .jc-full{grid-column:1/-1}
  .jc-pl{position:absolute;top:100%;left:0;right:0;z-index:20;list-style:none;margin:2px 0 0;padding:4px;background:#fff;border:1px solid #D9C6A0;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.12);max-height:240px;overflow:auto}
  .jc-pl li{padding:.5rem .6rem;border-radius:8px;cursor:pointer;font-weight:400}.jc-pl li[aria-selected=true],.jc-pl li:hover{background:#FBF0DC}
  .jc-btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;border:0;border-radius:12px;background:var(--mr);color:#fff!important;font:inherit;font-weight:700;padding:.75rem 1.4rem;min-height:48px;cursor:pointer;text-decoration:none!important}
  .jc-btn:hover{background:var(--mrd)}.jc-btn.g{background:#15803D}.jc-btn.l{background:#fff;color:var(--mr)!important;border:1.5px solid var(--mr)}
  .jc-err{color:#B91C1C;font-weight:600;margin:.5rem 0 0}
  .jc-note{font-size:14px;color:var(--mu);margin:.5rem 0 0}
  .jc-res{margin-top:18px}
  .jc-res h3{font-family:'Tiro Devanagari Hindi',serif;font-size:1.2rem;color:var(--mr);margin:1.1rem 0 .4rem;font-weight:400}
  .jc ul{list-style:disc;padding-left:1.3rem;margin:.4rem 0}.jc ol{list-style:decimal;padding-left:1.3rem}.jc li{margin:.25rem 0}
  .jc-res .jc-tbl{margin-top:4px}.jc a:not(.jc-btn){color:var(--mr);text-decoration:underline}.jc-up a,.jc-more a{text-decoration:none!important}.jc-up a{color:#F1D99A!important}
  .jc-big{display:flex;flex-wrap:wrap;gap:16px;align-items:center;border-radius:16px;padding:18px;background:linear-gradient(135deg,#FFF7E6,#FDEBD0);border:2px solid var(--gd)}
  .jc-big .v{font-size:2.2rem;font-weight:800;color:var(--mr);line-height:1.1}.jc-big .t{flex:1 1 260px}.jc-big .t b{font-size:1.25rem}
  .jc-big.ok{background:linear-gradient(135deg,#F0FAF2,#E3F4E7);border-color:#4F9D63}.jc-big.ok .v{color:#15803D}
  .jc-tbl{width:100%;border-collapse:collapse;margin:12px 0;font-size:15.5px}
  .jc-tbl th{background:var(--mr);color:#fff!important;text-align:left;padding:.55rem .7rem;font-weight:600}
  .jc-tbl td{border-bottom:1px solid var(--ln);padding:.55rem .7rem;vertical-align:top}.jc-tbl tr:nth-child(even) td{background:#FDFAF3}
  .jc-tw{overflow-x:auto}
  .jc-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.jc-chip{background:#FBF0DC;border:1px solid #E6C98A;border-radius:999px;padding:.25rem .8rem;font-weight:700;color:var(--mrd)}
  .jc-act{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
  .jc-up{margin-top:16px;padding:14px 16px;border-radius:14px;background:var(--mr);color:#FBF6EC}.jc-up b{color:#fff}.jc-up a{color:#F1D99A;font-weight:700}
  .jc-sec h2{font-size:1.5rem;color:var(--mrd);margin:1.6rem 0 .5rem}.jc-sec h3{font-size:1.15rem;margin:1rem 0 .3rem;color:var(--mr)}
  .jc-sec p,.jc-sec li{color:var(--bd)}
  .jc-faq details{background:#fff;border:1px solid var(--ln);border-radius:12px;margin:0 0 8px;padding:0 14px}.jc-faq summary{cursor:pointer;font-weight:700;padding:12px 0}.jc-faq p{margin:0 0 12px}
  .jc-more{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0 30px}.jc-more a{display:block;background:#fff;border:1px solid var(--ln);border-radius:14px;padding:14px;text-decoration:none!important;color:var(--ink)!important}.jc-more a b{color:var(--mr);display:block}.jc-more a:hover{border-color:var(--gd)}
  .jc-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}.jc-tab{border:1.5px solid #D9C6A0;background:#fff;border-radius:999px;padding:.45rem 1rem;font:inherit;font-weight:700;color:var(--bd);cursor:pointer}.jc-tab[aria-pressed=true]{background:var(--mr);border-color:var(--mr);color:#fff}
  @media (max-width:700px){.jc-f{grid-template-columns:1fr}.jc-more{grid-template-columns:1fr}.jc-card{padding:16px}}`;
  function css() { if (document.getElementById("jc-css")) return; const s = document.createElement("style"); s.id = "jc-css"; s.textContent = CSS; document.head.appendChild(s); }

  // fields: name (optional), dob, time, place. p = id prefix
  function fields(p, o) {
    o = o || {};
    return `${o.name === false ? "" : `<label>${o.nameLabel || "नाम"}${o.nameReq ? " *" : ""}<input id="${p}Name" type="text" autocomplete="${o.ac === false ? "off" : "name"}" placeholder="${o.namePh || "जैसे Rahul Sharma"}"></label>`}
      <label>जन्मतिथि *<input id="${p}Dob" type="date" required></label>
      ${o.time === false ? "" : `<label>जन्म समय${o.timeReq === false ? " (पता हो तो)" : " *"}<input id="${p}Time" type="time"></label>`}
      ${o.place === false ? "" : `<label${o.placeFull ? ' class="jc-full"' : ""}>जन्म स्थान${o.timeReq === false ? " (पता हो तो)" : " *"}<input id="${p}Place" type="text" placeholder="शहर के 2-3 अक्षर, जैसे Luc" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${p}PlaceList"><ul class="jc-pl" id="${p}PlaceList" role="listbox" hidden></ul></label>`}`;
  }
  function placeSearch(inp, list) {
    if (!inp) return;
    let items = [], act = -1, tm = null;
    const pick = (x) => { inp.value = x.label; inp.dataset.lat = x.lat; inp.dataset.lng = x.lng; list.hidden = true; inp.setAttribute("aria-expanded", "false"); };
    const render = () => {
      list.innerHTML = items.map((x, i) => `<li role="option" id="${list.id}${i}" aria-selected="${i === act}" data-i="${i}">${esc(x.label)}</li>`).join("");
      list.hidden = !items.length; inp.setAttribute("aria-expanded", String(!!items.length));
    };
    inp.addEventListener("input", () => {
      delete inp.dataset.lat; delete inp.dataset.lng; act = -1;
      const q = inp.value.trim();
      items = q && window.BirthChartCalculator ? window.BirthChartCalculator.searchPlaces(q, 8) : [];
      render();
      if (tm) clearTimeout(tm);
      if (q.length >= 3 && items.length < 3) tm = setTimeout(async () => {
        try {
          const r = await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + encodeURIComponent(q), { headers: { "Accept-Language": "en" } });
          const d = r.ok ? await r.json() : [];
          items = items.concat(d.map((x) => ({ label: x.display_name.split(",").slice(0, 3).join(","), lat: +x.lat, lng: +x.lon }))).slice(0, 8); render();
        } catch (e) { /* ignore */ }
      }, 350);
    });
    inp.addEventListener("keydown", (e) => {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); act = (act + 1) % items.length; render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); act = (act - 1 + items.length) % items.length; render(); }
      else if (e.key === "Enter" && act >= 0) { e.preventDefault(); pick(items[act]); }
      else if (e.key === "Escape") list.hidden = true;
    });
    list.addEventListener("mousedown", (e) => { const li = e.target.closest("li"); if (li) { e.preventDefault(); pick(items[+li.dataset.i]); } });
    inp.addEventListener("blur", () => setTimeout(() => { list.hidden = true; }, 150));
  }
  // read prefix fields; req = {time:true, place:true}
  function read(p, req) {
    req = req || {};
    const g = (id) => document.getElementById(p + id);
    const pl = g("Place");
    const o = { name: g("Name") ? g("Name").value.trim() : "", dob: g("Dob").value, time: g("Time") ? g("Time").value : "", place: pl ? pl.value.trim() : "", lat: pl ? parseFloat(pl.dataset.lat) : NaN, lng: pl ? parseFloat(pl.dataset.lng) : NaN };
    const miss = [];
    if (req.name && !o.name) miss.push("नाम");
    if (!o.dob) miss.push("जन्मतिथि");
    if (req.time && !o.time) miss.push("जन्म समय");
    if (req.place && (!o.place || isNaN(o.lat))) miss.push("जन्म स्थान (सूची से चुनें)");
    if (o.place && isNaN(o.lat) && !miss.some((m) => m.startsWith("जन्म स्थान"))) miss.push("जन्म स्थान (सूची में से चुनें)");
    return { o, miss };
  }

  // ---------- share card (1080x1350 PNG) ----------
  function shareCard(d) {
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const x = cv.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7A1F1F"); g.addColorStop(1, "#3B0F0F"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = "#E6C98A"; x.lineWidth = 6; x.strokeRect(36, 36, W - 72, H - 72); x.lineWidth = 2; x.strokeRect(54, 54, W - 108, H - 108);
    x.textAlign = "center"; x.fillStyle = "#F1D99A"; x.font = "700 40px Mukta, sans-serif"; x.fillText("ज्योतिष तर्क · JYOTISH TARK", W / 2, 140);
    x.fillStyle = "#FBF6EC"; x.font = "600 46px Mukta, sans-serif"; x.fillText(d.title || "", W / 2, 240);
    if (d.sub) { x.font = "400 36px Mukta, sans-serif"; x.fillStyle = "#F6DDB8"; x.fillText(d.sub, W / 2, 300); }
    x.beginPath(); x.arc(W / 2, 560, 200, 0, Math.PI * 2); x.fillStyle = "rgba(255,255,255,.08)"; x.fill(); x.strokeStyle = "#E6C98A"; x.lineWidth = 4; x.stroke();
    x.fillStyle = "#FFFFFF"; x.font = `800 ${d.bigSize || 120}px Mukta, sans-serif`; x.fillText(d.big || "", W / 2, 560 + (d.bigSize || 120) / 3);
    if (d.bigSub) { x.font = "600 38px Mukta, sans-serif"; x.fillStyle = "#F1D99A"; x.fillText(d.bigSub, W / 2, 700); }
    x.font = "400 38px Mukta, sans-serif"; x.fillStyle = "#FBF6EC";
    let y = 860;
    (d.lines || []).slice(0, 6).forEach((t) => {
      // wrap
      const words = String(t).split(" "); let line = "";
      words.forEach((w) => { const tt = line ? line + " " + w : w; if (x.measureText(tt).width > W - 200) { x.fillText(line, W / 2, y); y += 54; line = w; } else line = tt; });
      if (line) { x.fillText(line, W / 2, y); y += 66; }
    });
    x.fillStyle = "#F1D99A"; x.font = "700 42px Mukta, sans-serif"; x.fillText("jyotishtark.in", W / 2, H - 110);
    x.font = "400 28px Mukta, sans-serif"; x.fillStyle = "#F6DDB8"; x.fillText(d.foot || "मुफ़्त ज्योतिष कैलकुलेटर", W / 2, H - 70);
    return cv;
  }
  async function share(d, file) {
    const cv = shareCard(d);
    const blob = await new Promise((r) => cv.toBlob(r, "image/png"));
    const f = new File([blob], (file || "jyotish-tark") + ".png", { type: "image/png" });
    track("calc_share", { file });
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: d.title, text: (d.text || d.title) + " — jyotishtark.in" }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
  }
  const waShare = (t) => `https://wa.me/?text=${encodeURIComponent(t)}`;

  return { $, esc, css, fields, placeSearch, read, ready, chart, moonInfo, dayMoon, ashtakoot, verdict, share, waShare, track, RASHI, RASHI_EN, NAK, PN, LORD, PADA, RASHI_AKSHAR, MON, my, dmy, ov, VARNA_N, GANA, GANA_N, NADI, NADI_N, YONI_OF, YONI_N };
})();
