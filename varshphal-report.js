/* Jyotish Tark — ₹299 personal Varshphal 2027 report (PDF via print).
   Built from the person's own birth chart (JTKP engine, KP ayanamsa — same as the free "आपका 2027" card):
   Vimshottari dasha periods running in 2027, Jupiter/Saturn/Rahu transits from Lagna and Moon,
   Sade Sati / Dhaiyya status, month-by-month guidance with good dates (Tara bala + Chandra bala),
   simple remedies. Tone: guidance, never guarantees.
   - JTVarshphal.offer(host, readFn) → shows the ₹299 offer box
   - ?jtpaid=vp&order_id=…          → verifies payment and opens the report */
(function () {
  "use strict";
  const PRICE = 299, WA = "918318513814", KEY = "jt-vp-order", YEAR = 2027;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ga = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* ignore */ } };
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } } };

  const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const NAK = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"];
  const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const VAR = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
  const PN = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const ORD = ["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"];
  const LORD = [null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const HOUSE = ["स्वयं, सेहत और व्यक्तित्व", "धन, परिवार और वाणी", "साहस, भाई-बहन, छोटी यात्राएँ और संपर्क", "घर, माता, वाहन और मन की शांति", "पढ़ाई, संतान, प्रेम और रचनात्मकता", "नौकरी, सेहत, प्रतियोगिता और कर्ज़", "विवाह, साझेदारी और व्यापार", "अचानक बदलाव, रिसर्च और छिपे विषय", "भाग्य, धर्म, पिता, उच्च शिक्षा और लंबी यात्रा", "करियर, पद और मान-सम्मान", "आय, लाभ, मित्र और इच्छा-पूर्ति", "खर्च, विदेश, नींद और आध्यात्मिकता"];
  const DASHA = {
    Sun: "पद, सम्मान, पिता और सरकारी कामों से जुड़ा समय। आत्मविश्वास और नेतृत्व बढ़ता है; अहंकार और ज़िद से बचना ज़रूरी।",
    Moon: "मन, परिवार, माता, यात्रा और लोगों से जुड़ाव का समय। भावनाओं में उतार-चढ़ाव हो सकता है; दिनचर्या और नींद सही रखें।",
    Mars: "ऊर्जा, साहस, ज़मीन-जायदाद और भाई-बहनों से जुड़ा समय। काम तेज़ी से होते हैं; जल्दबाज़ी, क्रोध और वाहन में सावधानी रखें।",
    Mercury: "पढ़ाई, व्यापार, लेखन, बातचीत और नए कौशल का समय। काग़ज़ी काम और छोटी यात्राएँ बढ़ती हैं; हिसाब-किताब साफ़ रखें।",
    Jupiter: "ज्ञान, गुरु, धर्म, संतान, विवाह और विस्तार का समय। अच्छे लोगों का मार्गदर्शन मिलता है; ज़्यादा भरोसे में आकर ख़र्च न बढ़ाएँ।",
    Venus: "प्रेम, विवाह, सुख-सुविधा, कला, वाहन और धन का समय। रिश्तों में मिठास आती है; भोग-विलास और फ़िज़ूलख़र्च पर नज़र रखें।",
    Saturn: "मेहनत, अनुशासन और ज़िम्मेदारी का समय। प्रगति धीमी पर पक्की होती है; धैर्य, नियम और बड़ों का सम्मान फल देता है।",
    Rahu: "अचानक बदलाव, विदेश, तकनीक और बड़ी महत्वाकांक्षा का समय। नए रास्ते खुलते हैं; शॉर्टकट, भ्रम और ग़लत संगत से बचें।",
    Ketu: "आत्मचिंतन, आध्यात्मिकता और रिसर्च का समय। किसी चीज़ से मन हट सकता है; बड़े फ़ैसले शांत मन से लें।"
  };
  const REM = {
    Sun: ["रविवार सुबह ताँबे के लोटे से सूर्य को जल दें", "“ॐ घृणि सूर्याय नमः” — 108 बार", "गेहूँ या गुड़ का दान; पिता और बड़ों का सम्मान"],
    Moon: ["सोमवार को शिवलिंग पर जल या दूध चढ़ाएँ", "“ॐ सोमाय नमः” — 108 बार", "चावल या दूध का दान; माता की सेवा"],
    Mars: ["मंगलवार को हनुमान चालीसा का पाठ", "“ॐ अं अंगारकाय नमः” — 108 बार", "मसूर दाल का दान; क्रोध पर नियंत्रण"],
    Mercury: ["बुधवार को गणेश जी को दूर्वा चढ़ाएँ", "“ॐ बुं बुधाय नमः” — 108 बार", "हरी मूँग का दान या गाय को हरा चारा"],
    Jupiter: ["गुरुवार को विष्णु जी की पूजा, केले के पेड़ में जल", "“ॐ बृं बृहस्पतये नमः” — 108 बार", "चने की दाल या हल्दी का दान; गुरुजनों का सम्मान"],
    Venus: ["शुक्रवार को लक्ष्मी जी की पूजा", "“ॐ शुं शुक्राय नमः” — 108 बार", "सफ़ेद मिठाई या चावल का दान; घर साफ़-सुथरा रखें"],
    Saturn: ["शनिवार शाम पीपल के नीचे सरसों के तेल का दीपक", "“ॐ शं शनैश्चराय नमः” — 108 बार", "काले तिल या सरसों के तेल का दान; मेहनतकश लोगों की मदद"],
    Rahu: ["शनिवार को दुर्गा चालीसा का पाठ", "“ॐ रां राहवे नमः” — 108 बार", "नारियल या सरसों का दान; नशे और ग़लत संगत से दूरी"],
    Ketu: ["गणेश जी की पूजा और गणेश चालीसा", "“ॐ कें केतवे नमः” — 108 बार", "कुत्तों को रोटी; ध्यान और प्राणायाम"]
  };
  const FAV = { Sun: [3, 6, 10, 11], Mars: [3, 6, 11], Mercury: [2, 4, 6, 8, 10, 11], Jupiter: [2, 5, 7, 9, 11], Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12], Saturn: [3, 6, 11], Rahu: [3, 6, 11] };
  const W = { Jupiter: 3, Saturn: 3, Rahu: 1.5, Mars: 1, Sun: 1, Venus: 0.7, Mercury: 0.5 };
  const hFrom = (from, sign) => ((sign - from + 12) % 12) + 1;
  const dmy = (d) => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
  const red = (n) => { while (n > 9) n = String(n).split("").reduce((a, b) => a + +b, 0); return n; };

  // ---------- calculation ----------
  function compute(o) {
    const K = window.JTKP, A = window.Astronomy;
    const c = K.compute({ dob: o.dob, time: o.time, lat: o.lat, lng: o.lng });
    const P = c.planets, L = c.cusps[1].sign, M = P.Moon.sign, nak = P.Moon.nak; // nak 1..27
    const pos = (d) => K.compute({ dob: d, time: "12:00", lat: 26.8467, lng: 80.9462 }).planets;
    const months = [...Array(12)].map((_, m) => pos(`${YEAR}-${String(m + 1).padStart(2, "0")}-22`));
    const ev = []; let prev = pos(`${YEAR - 1}-12-31`);
    for (let t = Date.UTC(YEAR, 0, 1); t <= Date.UTC(YEAR, 11, 31); t += 2 * 864e5) {
      const d = new Date(t), Q = pos(d.toISOString().slice(0, 10));
      ["Jupiter", "Saturn", "Rahu"].forEach((p) => { if (Q[p].sign !== prev[p].sign) ev.push({ p, d, sign: Q[p].sign }); });
      prev = Q;
    }
    const start = pos(`${YEAR}-01-01`);
    // dasha periods overlapping the year
    const y0 = Date.UTC(YEAR, 0, 1), y1 = Date.UTC(YEAR + 1, 0, 1), periods = [];
    c.dasha.md.forEach((md) => md.ad.forEach((ad) => { if (ad.end > y0 && ad.start < y1) periods.push({ md: md.lord, ad: ad.lord, s: ad.start, e: ad.end, pd: ad.pd.filter((p) => p.end > y0 && p.start < y1) }); }));
    // monthly scores (from Moon and from Lagna)
    const score = (from, Q) => Object.keys(W).reduce((s, p) => s + (FAV[p].includes(hFrom(from, Q[p].sign)) ? 1 : -1) * W[p], 0);
    const ms = months.map((Q, i) => ({ i, Q, s: score(M, Q) * 0.6 + score(L, Q) * 0.4 }));
    const rank = ms.slice().sort((a, b) => b.s - a.s).map((x) => x.i);
    ms.forEach((x) => { const r = rank.indexOf(x.i); x.stars = r < 3 ? 5 : r < 6 ? 4 : r < 9 ? 3 : 2; });
    // good dates: Tara bala + Chandra bala at 06:00 IST, avoiding Amavasya and Rikta tithis
    const ay = (d) => K.kpAyanamsa(d), norm = (x) => ((x % 360) + 360) % 360;
    const lon = (b, d) => norm(A.Ecliptic(A.GeoVector(b, d, true)).elon);
    const days = [...Array(12)].map(() => []);
    for (let t = Date.UTC(YEAR, 0, 1, 0, 30); t < y1; t += 864e5) {
      const d = new Date(t), mo = norm(lon(A.Body.Moon, d) - ay(d)), el = norm(lon(A.Body.Moon, d) - lon(A.Body.Sun, d));
      const dn = Math.floor(mo / (360 / 27)) + 1, ms2 = Math.floor(mo / 30) + 1, ti = Math.floor(el / 12) + 1; // tithi 1..30
      const tara = ((dn - nak + 27) % 27) % 9 + 1, cb = hFrom(M, ms2);
      const okT = [2, 4, 6, 8, 9].includes(tara), okC = [1, 3, 6, 7, 10, 11].includes(cb), rikta = [4, 9, 14, 19, 24, 29, 30].includes(ti);
      const ist = new Date(t + 330 * 60000);
      if (okT && okC && !rikta) days[ist.getUTCMonth()].push({ d: ist.getUTCDate(), w: ist.getUTCDay(), t: tara });
    }
    days.forEach((a, i) => { days[i] = a.sort((x, y) => [9, 8, 2, 6, 4].indexOf(x.t) - [9, 8, 2, 6, 4].indexOf(y.t)).slice(0, 5).sort((x, y) => x.d - y.d); });
    const satM = hFrom(M, start.Saturn.sign), jupL = hFrom(L, start.Jupiter.sign), jupM = hFrom(M, start.Jupiter.sign), satL = hFrom(L, start.Saturn.sign);
    return { c, P, L, M, nak, months, ev, start, periods, ms, days, satM, jupL, jupM, satL };
  }

  // ---------- text helpers ----------
  function natalHouse(R, p) { return hFrom(R.L, R.P[p].sign); }
  function owned(R, p) { const out = []; for (let h = 1; h <= 12; h++) if (LORD[((R.L + h - 2) % 12) + 1] === p) out.push(h); return out; }
  function sadeSati(R) {
    const out = [];
    const st = (h) => h === 12 ? "साढ़ेसाती का पहला चरण" : h === 1 ? "साढ़ेसाती का दूसरा (मुख्य) चरण" : h === 2 ? "साढ़ेसाती का अंतिम चरण" : h === 4 ? "शनि की ढैय्या (चौथा भाव)" : h === 8 ? "शनि की ढैय्या (आठवाँ भाव)" : "";
    const s0 = st(R.satM);
    out.push(s0 ? `2027 की शुरुआत में आप पर <b>${s0}</b> है।` : "2027 की शुरुआत में आप पर साढ़ेसाती या ढैय्या नहीं है।");
    R.ev.filter((e) => e.p === "Saturn").forEach((e) => { const s = st(hFrom(R.M, e.sign)); out.push(`${dmy(e.d)} के आसपास शनि ${RASHI[e.sign - 1]} राशि में आएँगे — ${s ? `इसके बाद <b>${s}</b> शुरू होगी` : "इसके बाद साढ़ेसाती/ढैय्या का असर नहीं रहेगा"}।`); });
    return out;
  }
  function area(R, houses, label) {
    const jup = [R.jupL].concat(R.ev.filter((e) => e.p === "Jupiter").map((e) => hFrom(R.L, e.sign)));
    const lines = [];
    const md = R.periods.length ? R.periods[0].md : null;
    if (jup.some((h) => houses.includes(h))) lines.push(`गुरु का गोचर साल के किसी हिस्से में आपके ${houses.map((h) => ORD[h - 1]).join("/")} भाव से जुड़ता है — ${label} के लिए यह अच्छा सहारा है।`);
    if (houses.includes(R.satL)) lines.push(`शनि ${ORD[R.satL - 1]} भाव में हैं — ${label} में मेहनत और ज़िम्मेदारी बढ़ेगी; धैर्य से किया काम लंबे समय तक टिकेगा।`);
    R.periods.forEach((x) => { const own = owned(R, x.ad), nh = natalHouse(R, x.ad); if (own.some((h) => houses.includes(h)) || houses.includes(nh)) lines.push(`${dmy(x.s)} से ${dmy(x.e)} तक ${PN[x.ad]} की अंतर्दशा ${label} को सक्रिय करती है।`); });
    if (md && (owned(R, md).some((h) => houses.includes(h)) || houses.includes(natalHouse(R, md)))) lines.push(`आपकी महादशा के स्वामी ${PN[md]} आपकी कुंडली में ${label} से जुड़े हैं — इस विषय पर पूरा साल ध्यान रहेगा।`);
    if (!lines.length) lines.push(`इस साल ${label} में कोई बहुत बड़ा ग्रह-परिवर्तन नहीं है — स्थिर गति से आगे बढ़ें और योजनाबद्ध रहें।`);
    return [...new Set(lines)];
  }
  function monthText(R, x) {
    const Q = x.Q, out = [];
    const sunH = hFrom(R.L, Q.Sun.sign);
    out.push(`<b>मुख्य विषय:</b> सूर्य आपके ${ORD[sunH - 1]} भाव में — ${HOUSE[sunH - 1]} पर ध्यान रहेगा।`);
    const mars = hFrom(R.M, Q.Mars.sign), ven = hFrom(R.L, Q.Venus.sign), mer = hFrom(R.M, Q.Mercury.sign);
    const good = [], care = [];
    (FAV.Mars.includes(mars) ? good : care).push(FAV.Mars.includes(mars) ? "नई पहल, मेहनत और प्रतियोगिता" : "जल्दबाज़ी, बहस और वाहन");
    (FAV.Venus.includes(ven) ? good : care).push(FAV.Venus.includes(ven) ? "रिश्ते, सुख-सुविधा और ख़रीदारी" : "रिश्तों में ग़लतफ़हमी और फ़िज़ूलख़र्च");
    (FAV.Mercury.includes(mer) ? good : care).push(FAV.Mercury.includes(mer) ? "बातचीत, पढ़ाई और काग़ज़ी काम" : "काग़ज़ों और वादों की जाँच");
    if (good.length) out.push(`<b>अनुकूल:</b> ${good.join("; ")}।`);
    if (care.length) out.push(`<b>सावधानी:</b> ${care.join("; ")}।`);
    const m0 = Date.UTC(YEAR, x.i, 1), m1 = Date.UTC(YEAR, x.i + 1, 1);
    R.periods.forEach((p) => { if (p.s >= m0 && p.s < m1) out.push(`<b>दशा:</b> ${p.s.getDate()} ${MON[x.i]} से ${PN[p.md]}–${PN[p.ad]} अंतर्दशा शुरू।`); });
    R.ev.forEach((e) => { if (e.d >= m0 && e.d < m1) out.push(`<b>बड़ा गोचर:</b> ${e.d.getDate()} ${MON[x.i]} के आसपास ${PN[e.p]} ${RASHI[e.sign - 1]} राशि में (लग्न से ${ORD[hFrom(R.L, e.sign) - 1]}, चंद्र से ${ORD[hFrom(R.M, e.sign) - 1]} भाव)।`); });
    return out;
  }

  // ---------- report HTML ----------
  const RCSS = `@page{size:A4;margin:14mm 13mm}*{box-sizing:border-box}body{margin:0;background:#EDE6D9;font-family:Mukta,'Noto Sans Devanagari',system-ui,sans-serif;color:#2B1810;font-size:14.5px;line-height:1.6}
.pg{width:210mm;min-height:297mm;margin:0 auto 10px;background:#FFFDF8;padding:16mm 15mm;page-break-after:always;position:relative}.pg:last-child{page-break-after:auto}
@media print{body{background:#fff}.pg{margin:0;width:auto;min-height:0;padding:0;box-shadow:none}}
h1,h2,h3{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;color:#7A1F1F;margin:0 0 8px}h2{font-size:24px;border-bottom:2px solid #C9A227;padding-bottom:6px;margin-bottom:12px}h3{font-size:18px;margin-top:14px}
.cov{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 50% 30%,#8F2A2A,#4A1010);color:#FBF0D8;border:3px solid #C9A227}
.cov .om{font-size:54px;color:#F1D99A;font-family:'Tiro Devanagari Hindi',serif}.cov h1{color:#fff;font-size:44px;margin:10px 0 4px}.cov .yr{font-size:90px;font-weight:800;color:#F1D99A;line-height:1}
.cov .nm{font-size:28px;margin-top:22px;color:#fff}.cov .meta{margin-top:10px;font-size:16px;color:#F6DDB8}.cov .ft{position:absolute;bottom:16mm;left:0;right:0;font-size:15px;color:#F1D99A}
table{width:100%;border-collapse:collapse;margin:6px 0 10px}td,th{border:1px solid #E8DCC4;padding:6px 8px;text-align:left;vertical-align:top}th{background:#FBF0DC}
.box{border:1px solid #E8DCC4;border-radius:10px;padding:10px 12px;margin:8px 0;background:#fff;break-inside:avoid}.mo{break-inside:avoid;border:1px solid #E8DCC4;border-radius:10px;padding:8px 12px;margin:0 0 8px;background:#fff}
.mo h3{margin:0 0 4px;display:flex;justify-content:space-between}.st{color:#C9A227;letter-spacing:1px}.dt{font-weight:700;color:#14532D}.sm{font-size:12.5px;color:#6B5444}ul{margin:4px 0 8px;padding-left:20px}`;
  function build(o) {
    const R = compute(o), nm = esc(o.name || "आप"), stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
    const md = R.periods.length ? R.periods[0].md : null;
    const py = red(+o.dob.slice(8, 10) + +o.dob.slice(5, 7) + 2 + 0 + 2 + 7);
    const bestM = R.ms.filter((x) => x.stars === 5).map((x) => MON[x.i]).join(", "), hardM = R.ms.filter((x) => x.stars === 2).map((x) => MON[x.i]).join(", ");
    const pdRows = R.periods.map((p) => `<tr><td><b>${PN[p.md]} – ${PN[p.ad]}</b></td><td>${dmy(p.s)} – ${dmy(p.e)}</td><td>${DASHA[p.ad]} <span class="sm">(${PN[p.ad]} आपकी कुंडली में ${ORD[natalHouse(R, p.ad) - 1]} भाव में${owned(R, p.ad).length ? `, ${owned(R, p.ad).map((h) => ORD[h - 1]).join(" व ")} भाव के स्वामी` : ""})</span></td></tr>`).join("");
    const evRows = R.ev.length ? R.ev.map((e) => `<li><b>${dmy(e.d)} के आसपास — ${PN[e.p]} ${RASHI[e.sign - 1]} राशि में:</b> लग्न से ${ORD[hFrom(R.L, e.sign) - 1]} भाव (${HOUSE[hFrom(R.L, e.sign) - 1]}), चंद्र से ${ORD[hFrom(R.M, e.sign) - 1]} भाव।</li>`).join("") : "<li>2027 में गुरु, शनि या राहु राशि नहीं बदलते।</li>";
    const remLords = [...new Set([md, R.periods.length ? R.periods[0].ad : null].concat([0, 1, 2].includes([12, 1, 2].indexOf(R.satM)) || [4, 8].includes(R.satM) ? ["Saturn"] : []).filter(Boolean))];
    const months = R.ms.map((x) => `<div class="mo"><h3><span>${MON[x.i]} ${YEAR}</span><span class="st" aria-label="${x.stars} में से 5">${stars(x.stars)}</span></h3>${monthText(R, x).map((t) => `<div>${t}</div>`).join("")}<div><b>अच्छी तारीखें:</b> <span class="dt">${R.days[x.i].length ? R.days[x.i].map((d) => `${d.d} (${VAR[d.w]})`).join(", ") : "—"}</span></div></div>`);
    const pages = [];
    pages.push(`<div class="pg cov"><div class="om">ॐ</div><div style="letter-spacing:3px;font-size:15px;color:#F1D99A">॥ ज्योतिष तर्क ॥</div><h1>व्यक्तिगत वर्षफल</h1><div class="yr">${YEAR}</div><div class="nm">${nm}</div>
      <div class="meta">जन्म: ${esc(o.dob.split("-").reverse().join("-"))}, ${esc(o.time)} · ${esc(o.place || "")}</div><div class="meta">लग्न: ${RASHI[R.L - 1]} · चंद्र राशि: ${RASHI[R.M - 1]} · नक्षत्र: ${NAK[R.nak - 1]}</div>
      <div class="ft">ज्योतिषी ज्ञानेंद्र सिंह तोमर · Jyotish Tark, लखनऊ · jyotishtark.in</div></div>`);
    pages.push(`<div class="pg"><h2>1. आपकी कुंडली और 2027 का सार</h2>
      <table><tr><th>लग्न</th><td>${RASHI[R.L - 1]}</td><th>चंद्र राशि</th><td>${RASHI[R.M - 1]}</td></tr><tr><th>जन्म नक्षत्र</th><td>${NAK[R.nak - 1]}</td><th>महादशा (2027)</th><td>${md ? PN[md] : "—"}</td></tr>
      <tr><th>साल की शुरुआत में गुरु</th><td>लग्न से ${ORD[R.jupL - 1]}, चंद्र से ${ORD[R.jupM - 1]} भाव</td><th>साल की शुरुआत में शनि</th><td>लग्न से ${ORD[R.satL - 1]}, चंद्र से ${ORD[R.satM - 1]} भाव</td></tr></table>
      <div class="box"><b>2027 एक नज़र में:</b> सबसे अनुकूल महीने — <b>${bestM}</b>; सावधानी वाले महीने — <b>${hardM}</b>। अंक ज्योतिष में आपका पर्सनल ईयर <b>${py}</b> है।</div>
      <h3>साढ़ेसाती / ढैय्या</h3><ul>${sadeSati(R).map((t) => `<li>${t}</li>`).join("")}</ul>
      <h3>2027 के बड़े ग्रह-परिवर्तन</h3><ul>${evRows}</ul>
      <p class="sm">यह रिपोर्ट आपकी जन्म तिथि, समय और स्थान से बनी कुंडली (KP अयनांश) और 2027 के वास्तविक ग्रह-गोचर पर आधारित है। गोचर लग्न और चंद्र राशि — दोनों से देखा गया है।</p></div>`);
    pages.push(`<div class="pg"><h2>2. 2027 में आपकी दशा</h2><p>विंशोत्तरी दशा बताती है कि जीवन के किस दौर में कौन-सा ग्रह प्रमुख है। 2027 में आपकी ${md ? `<b>${PN[md]} महादशा</b>` : "दशा"} चल रही है — ${md ? DASHA[md] : ""}</p>
      <table><tr><th>महादशा – अंतर्दशा</th><th>अवधि</th><th>इस दौरान</th></tr>${pdRows}</table>
      <h3>करियर और काम</h3><ul>${area(R, [10, 6, 2], "करियर और काम").map((t) => `<li>${t}</li>`).join("")}</ul>
      <h3>धन और बचत</h3><ul>${area(R, [2, 11], "धन और आय").map((t) => `<li>${t}</li>`).join("")}</ul></div>`);
    pages.push(`<div class="pg"><h2>3. रिश्ते, परिवार, सेहत और पढ़ाई</h2>
      <h3>विवाह और रिश्ते</h3><ul>${area(R, [7, 5], "रिश्ते और विवाह").map((t) => `<li>${t}</li>`).join("")}</ul>
      <h3>घर और परिवार</h3><ul>${area(R, [4, 2], "घर-परिवार").map((t) => `<li>${t}</li>`).join("")}</ul>
      <h3>सेहत और दिनचर्या</h3><ul>${area(R, [1, 6, 8], "सेहत और दिनचर्या").map((t) => `<li>${t}</li>`).join("")}<li>सेहत से जुड़ी किसी भी परेशानी में डॉक्टर की सलाह लें — ज्योतिष केवल सावधानी का संकेत देता है।</li></ul>
      <h3>पढ़ाई और भाग्य</h3><ul>${area(R, [5, 9], "पढ़ाई और भाग्य").map((t) => `<li>${t}</li>`).join("")}</ul></div>`);
    pages.push(`<div class="pg"><h2>4. महीनेवार फल — जनवरी से जून</h2><p class="sm">★ = महीने की अनुकूलता (5 सबसे अच्छी)। “अच्छी तारीखें” आपके जन्म नक्षत्र से तारा बल और चंद्र बल देखकर, अमावस्या व रिक्ता तिथि छोड़कर चुनी गई हैं — नए काम, इंटरव्यू, ख़रीदारी के लिए उपयोग करें (समय के लिए उस दिन का राहु काल देखें)।</p>${months.slice(0, 6).join("")}</div>`);
    pages.push(`<div class="pg"><h2>5. महीनेवार फल — जुलाई से दिसंबर</h2>${months.slice(6).join("")}</div>`);
    pages.push(`<div class="pg"><h2>6. आपके लिए सरल उपाय</h2><p>ये उपाय आपकी चल रही दशा${remLords.includes("Saturn") && md !== "Saturn" ? " और शनि की स्थिति" : ""} के अनुसार चुने गए हैं। इन्हें श्रद्धा से करें — ये मन को शांत और दिनचर्या को अनुशासित रखते हैं; किसी परिणाम की गारंटी नहीं।</p>
      ${remLords.map((p) => `<div class="box"><b>${PN[p]} के लिए</b><ul>${REM[p].map((t) => `<li>${t}</li>`).join("")}</ul></div>`).join("")}
      <h3>पूरे साल के लिए</h3><ul><li>हर एकादशी या पूर्णिमा को थोड़ा अन्न-दान करें।</li><li>सुबह 10 मिनट ध्यान या प्राणायाम।</li><li>बड़े फ़ैसले ऊपर दिए अच्छे महीनों और तारीखों में लें; सावधानी वाले महीनों में जल्दबाज़ी से बचें।</li></ul>
      <div class="box"><b>आगे का मार्गदर्शन:</b> किसी ख़ास प्रश्न (नौकरी, विवाह, व्यापार) पर विस्तार से जानने के लिए WhatsApp करें: <b>+91 83185 13814</b> · रोज़ का पंचांग: jyotishtark.in/panchang.html</div>
      <p class="sm" style="margin-top:14px">अस्वीकरण: यह रिपोर्ट वैदिक ज्योतिष के सामान्य नियमों और गणना पर आधारित मार्गदर्शन है, कोई गारंटी नहीं। स्वास्थ्य, क़ानूनी या वित्तीय निर्णय के लिए संबंधित विशेषज्ञ की सलाह लें। रिपोर्ट बनी: ${dmy(new Date())} · ऑर्डर: ${esc(o.oid || "—")}</p></div>`);
    return `<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>वर्षफल ${YEAR} — ${nm}</title><link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet"><style>${RCSS}</style></head><body>${pages.join("")}</body></html>`;
  }

  // ---------- offer ----------
  const OCSS = `.vp-offer{margin:22px 0;padding:18px;border:2px solid #C9A227;border-radius:16px;background:linear-gradient(135deg,#FFF8E6,#FFFDF8);display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:start}
.vp-cv{border-radius:10px;background:radial-gradient(circle at 50% 30%,#8F2A2A,#4A1010);color:#F1D99A;text-align:center;padding:18px 8px;font-family:'Tiro Devanagari Hindi',serif}.vp-cv b{display:block;color:#fff;font-size:20px}.vp-cv .y{font-size:40px;font-weight:800;font-family:Mukta,sans-serif}
.vp-offer h4{margin:0 0 6px;font-size:1.3rem;color:#7A1F1F}.vp-offer ul{margin:0 0 10px;padding-left:20px}.vp-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.vp-buy{min-height:50px;padding:10px 22px;border:0;border-radius:12px;background:#7A1F1F;color:#fff;font:inherit;font-size:18px;font-weight:800;cursor:pointer}.vp-price{font-size:26px;font-weight:800;color:#7A1F1F}.vp-price s{font-size:16px;color:#8A7A66;margin-left:6px}
.vp-err{color:#B91C1C;font-size:14px;margin:6px 0 0;min-height:1em}.vp-sm{font-size:13px;color:#6B5444;margin:8px 0 0}@media(max-width:600px){.vp-offer{grid-template-columns:1fr}.vp-cv{max-width:170px;margin:0 auto}}`;
  function offer(host, readFn) {
    if (!host) return;
    if (!document.getElementById("vp-css")) { const s = document.createElement("style"); s.id = "vp-css"; s.textContent = OCSS; document.head.appendChild(s); }
    const box = document.createElement("div"); box.className = "vp-offer"; box.id = "vpOffer";
    box.innerHTML = `<div class="vp-cv" aria-hidden="true">॥ ज्योतिष तर्क ॥<b>व्यक्तिगत वर्षफल</b><div class="y">${YEAR}</div>7 पेज · PDF</div>
      <div><h4>अपनी कुंडली से पूरा 2027 — केवल ₹${PRICE}</h4>
      <ul><li>2027 में आपकी <b>महादशा-अंतर्दशा</b> और हर दौर का असर</li><li>गुरु, शनि, राहु का गोचर — <b>लग्न और चंद्र दोनों से</b>; साढ़ेसाती / ढैय्या</li><li><b>12 महीनों का फल</b> — हर महीने की 5 अच्छी तारीखें आपके नक्षत्र से</li><li>करियर, धन, रिश्ते, सेहत, पढ़ाई और दशा के अनुसार सरल उपाय</li></ul>
      <p class="vp-sm" style="margin:0 0 8px">रिपोर्ट के लिए ऊपर फ़ॉर्म में <b>नाम, जन्म समय और जन्म स्थान</b> भरें।</p>
      <p class="vp-err" id="vpErr" aria-live="polite"></p>
      <div class="vp-row"><span class="vp-price">₹${PRICE}<s>₹699</s></span><button type="button" class="vp-buy" id="vpBuy">₹${PRICE} में रिपोर्ट पाएँ →</button></div><div data-promo></div>
      <p class="vp-sm">UPI, कार्ड, नेट बैंकिंग · भुगतान के तुरंत बाद इसी पेज पर रिपोर्ट खुलेगी · बाद में "मेरी रिपोर्ट" पेज से दोबारा पाएँ</p></div>`;
    const old = document.getElementById("vpOffer"); if (old) old.remove();
    host.appendChild(box);
    const read = () => {
      const r = readFn(), err = box.querySelector("#vpErr"); err.textContent = "";
      if (!r || r.miss.length) { err.textContent = "कृपया ऊपर भरें: " + ((r && r.miss) || ["नाम", "जन्म समय", "जन्म स्थान"]).join(", ") + "।"; return null; }
      const o = r.o; ls.set(KEY, JSON.stringify(Object.assign({}, o, { ts: Date.now() })));
      return { name: o.name, dob: o.dob, lang: "hi", extra: { time: o.time, place: o.place, lat: o.lat, lng: o.lng } };
    };
    if (window.JTPromo && window.JTCheckout && window.JTCheckout.enabled()) window.JTPromo.ui(box.querySelector("[data-promo]"), "vp", (off, h, msg, code) => {
      const o = read(); if (!o) { msg.textContent = "कोड सही है — पहले ऊपर नाम, जन्म समय और स्थान भरें।"; return false; }
      window.JTCheckout.pay("vp", o, { promo: code, title: "प्रोमो कोड से वर्षफल रिपोर्ट", lang: "hi" }); return false;
    }, "hi");
    box.querySelector("#vpBuy").addEventListener("click", () => {
      const o = read(); if (!o) return;
      ga("vp_report_click", {});
      if (window.JTCheckout && window.JTCheckout.enabled()) window.JTCheckout.pay("vp", o, { title: `वर्षफल ${YEAR} रिपोर्ट — ₹${PRICE}`, lang: "hi" });
      else location.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(`नमस्ते, मुझे ₹${PRICE} की वर्षफल ${YEAR} रिपोर्ट चाहिए। नाम: ${o.name}, जन्म: ${o.dob} ${o.extra.time}, ${o.extra.place}`);
    });
  }

  // ---------- delivery ----------
  function viewer(html, o) {
    if (!document.getElementById("vpv-css")) { const s = document.createElement("style"); s.id = "vpv-css"; s.textContent = `.vpv{position:fixed;inset:0;z-index:2147483000;background:#3B2A20;display:flex;flex-direction:column}.vpv-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:#7A1F1F;color:#fff;font-family:Mukta,system-ui,sans-serif}.vpv-top b{flex:1 1 220px;font-size:16px;line-height:1.35}.vpv-top small{display:block;font-weight:400;font-size:13px;color:#F3E9D6}.vpv-b{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:8px 16px;border:0;border-radius:10px;background:#15803D;color:#fff;font:inherit;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none}.vpv-b.l{background:#fff;color:#7A1F1F}.vpv iframe{flex:1;width:100%;border:0;background:#EDE6D9}html.vpv-on .whatsapp-float{display:none!important}`; document.head.appendChild(s); }
    document.documentElement.classList.add("vpv-on");
    const v = document.createElement("div"); v.className = "vpv";
    v.innerHTML = `<div class="vpv-top"><b>आपकी वर्षफल ${YEAR} रिपोर्ट तैयार है 🙏<small>"PDF डाउनलोड करें" दबाएँ, फिर प्रिंट विंडो में "Save as PDF" चुनें।</small></b><button type="button" class="vpv-b" data-pdf>PDF डाउनलोड करें</button><a class="vpv-b l" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`नमस्ते, मेरी वर्षफल रिपोर्ट के बारे में प्रश्न है (ऑर्डर ${o.oid || "—"})।`)}">WhatsApp सहायता</a><button type="button" class="vpv-b l" data-x>बंद करें</button></div><iframe title="वर्षफल रिपोर्ट"></iframe>`;
    document.body.appendChild(v);
    const fr = v.querySelector("iframe");
    fr.addEventListener("load", () => { try { const w = fr.clientWidth; if (w < 820) { const s = fr.contentDocument.createElement("style"); s.textContent = `@media screen{html{zoom:${(w / 820).toFixed(3)}}}`; fr.contentDocument.head.appendChild(s); } } catch (e) { /* ignore */ } });
    fr.srcdoc = html;
    v.querySelector("[data-pdf]").addEventListener("click", () => {
      let w = null; try { w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank"); } catch (e) { w = null; }
      if (w) w.addEventListener("load", () => setTimeout(() => { try { w.focus(); w.print(); } catch (e) { /* ignore */ } }, 900)); else { fr.contentWindow.focus(); fr.contentWindow.print(); }
      ga("vp_report_pdf", {});
    });
    v.querySelector("[data-x]").addEventListener("click", () => { v.remove(); document.documentElement.classList.remove("vpv-on"); });
  }
  function deliver() {
    const q = new URLSearchParams(location.search);
    if (q.get("jtpaid") !== "vp" || !window.JTCheckout) return;
    let saved = null; try { saved = JSON.parse(ls.get(KEY) || "null"); } catch (e) { saved = null; }
    window.JTCheckout.confirm("vp", (so, oid) => {
      const ex = so.extra || {}, s = saved || {};
      const o = { name: so.name || s.name, dob: so.dob || s.dob, time: ex.time || s.time, place: ex.place || s.place, lat: +(ex.lat != null ? ex.lat : s.lat), lng: +(ex.lng != null ? ex.lng : s.lng), oid };
      let tries = 0;
      (function wait() {
        if (!(window.JTKP && window.Astronomy && window.BirthChartCalculator)) { if (++tries < 80) setTimeout(wait, 150); return; }
        let html;
        try { if (!o.dob || !o.time || isNaN(o.lat)) throw new Error("data"); html = build(o); }
        catch (e) { alert("रिपोर्ट अपने-आप नहीं बन सकी। आपका भुगतान सुरक्षित है — कृपया WhatsApp करें: 83185 13814 (ऑर्डर " + oid + ")"); return; }
        viewer(html, o);
        if (!(saved && saved.oid === oid)) { ls.set(KEY, JSON.stringify(Object.assign({}, o, { ts: Date.now() }))); ga("purchase", { value: Number(so.amount) || PRICE, currency: "INR", transaction_id: oid, items: [{ item_name: "Varshphal 2027" }] }); }
      })();
    }, "hi");
  }

  window.JTVarshphal = { offer, build, compute, PRICE };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(deliver, 60)); else setTimeout(deliver, 60);
})();
