/* ==========================================================================
   JYOTISH TARK — ₹1,100 SAMPURNA KUNDALI: printable A4 report (Hindi)
   Built from the same calculations as the free dossier on kundali-form.html:
   window.__jyotishLastCtx, window.__jtVedicData, FreeReport._internal.buildModel
   and the chapter sections the dossier has just rendered.
   API: JTSampurnaReport.build({ note, orderId }) → full HTML document string
   ========================================================================== */
(function () {
  "use strict";
  const RASHI = [null, "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const LORD = [null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const PL = { Asc: "लग्न", Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const NAK = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"];
  const NAK_LORD = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const P9 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const ORD = [null, "प्रथम", "द्वितीय", "तृतीय", "चतुर्थ", "पंचम", "षष्ठ", "सप्तम", "अष्टम", "नवम", "दशम", "एकादश", "द्वादश"];

  // Name letters (नामाक्षर) of each rashi and a few common names that start with them
  const RASHI_AKSHAR = {
    1: { a: "चू, चे, चो, ला, ली, लू, ले, लो, अ", b: "अर्जुन, अमन, लक्ष्य, लोकेश, चेतन, लव", g: "अनन्या, अदिति, लता, लीना, चेतना, लोपा" },
    2: { a: "इ, उ, ए, ओ, वा, वी, वू, वे, वो", b: "उदय, ईशान, ओम, वरुण, विवेक, विनय", g: "उमा, ईशा, ओजस्वी, वाणी, विधि, वेदिका" },
    3: { a: "का, की, कू, घ, ङ, छ, के, को, ह", b: "कार्तिक, कुणाल, केशव, कुश, हर्ष, कौशल", g: "किरण, कोमल, कविता, केतकी, छाया, हर्षिता" },
    4: { a: "ही, हू, हे, हो, डा, डी, डू, डे, डो", b: "हितेश, हिमांशु, हेमंत, होमेश, हृदय", g: "हिना, हेमा, हेतल, हिमानी, होली" },
    5: { a: "मा, मी, मू, मे, मो, टा, टी, टू, टे", b: "मनीष, मोहन, मयंक, मुकेश, मेघ, मीत", g: "माधुरी, मीरा, मेघा, मोनिका, मानसी, मुस्कान" },
    6: { a: "टो, पा, पी, पू, ष, ण, ठ, पे, पो", b: "पवन, पंकज, पीयूष, पुनीत, पूरन, पोरस", g: "पूजा, पायल, पल्लवी, पूनम, पीहू, पारुल" },
    7: { a: "रा, री, रू, रे, रो, ता, ती, तू, ते", b: "राहुल, रवि, रोहित, रूपेश, तरुण, तेजस", g: "रानी, रीना, रूपा, रेखा, रोशनी, तारा" },
    8: { a: "तो, ना, नी, नू, ने, नो, या, यी, यू", b: "नमन, नितिन, नीरज, नरेश, नवीन, यश", g: "नेहा, नीतू, नम्रता, नंदिनी, नूतन, यामिनी" },
    9: { a: "ये, यो, भा, भी, भू, धा, फा, ढा, भे", b: "भरत, भावेश, भूपेंद्र, धनंजय, योगेश, धर्मेंद्र", g: "भावना, भूमि, भारती, धारा, योगिता, धन्या" },
    10: { a: "भो, जा, जी, खी, खू, खे, खो, गा, गी", b: "जय, जगदीश, जीवन, जयेश, गणेश, गिरीश", g: "जया, जाह्नवी, जागृति, गीता, गायत्री, खुशी" },
    11: { a: "गू, गे, गो, सा, सी, सू, से, सो, दा", b: "सागर, सुरेश, सोहन, सचिन, गोपाल, दामोदर", g: "सरिता, सीमा, सोनम, सुमन, सुधा, गुंजन" },
    12: { a: "दी, दू, थ, झ, ञ, दे, दो, चा, ची", b: "दीपक, दिनेश, दुष्यंत, देवेंद्र, चंदन, चिराग", g: "दीपिका, दिव्या, देविका, दीक्षा, चांदनी, चित्रा" }
  };

  // Transit (gochar) results counted from the Moon sign — classical general results, our wording
  const GOCHAR = {
    Jupiter: { good: [2, 5, 7, 9, 11], t: [null, "मन में नए विचार; स्थान-परिवर्तन व ख़र्च संभव।", "धन, परिवार और वाणी के लिए अनुकूल।", "प्रयास अधिक, लाभ छोटे-छोटे।", "घर-परिवार की ज़िम्मेदारियाँ और मन की चिंता।", "संतान, शिक्षा और बुद्धि के लिए शुभ।", "स्वास्थ्य और विरोधियों पर ध्यान दें।", "विवाह, साझेदारी और सम्मान के योग।", "रुकावटें — धैर्य से काम लें।", "भाग्योदय, धर्म-यात्रा और बड़ों का आशीर्वाद।", "कार्यक्षेत्र में बदलाव और नई ज़िम्मेदारी।", "लाभ, इच्छापूर्ति और नए संपर्क।", "ख़र्च, विदेश या आध्यात्मिक यात्रा।"] },
    Saturn: { good: [3, 6, 11], t: [null, "साढ़ेसाती का मध्य चरण — मेहनत, धैर्य और सेहत पर ध्यान।", "साढ़ेसाती का अंतिम चरण — धन व परिवार में संयम।", "साहस और मेहनत का फल — शुभ।", "ढैय्या — घर, माता और मन की शांति पर ध्यान।", "संतान व पढ़ाई में देरी — धैर्य रखें।", "विरोधियों और रोग पर विजय — शुभ।", "साझेदारी में धैर्य, लंबी यात्राएँ।", "ढैय्या — सेहत और जोखिम वाले कामों में सावधानी।", "भाग्य में देरी, मेहनत से प्रगति।", "काम का बोझ और ज़िम्मेदारी बढ़ेगी।", "लाभ और स्थिरता — शुभ।", "साढ़ेसाती का पहला चरण — ख़र्च और नींद पर ध्यान।"] },
    Rahu: { good: [3, 6, 11], t: [null, "भ्रम और अधीरता से बचें।", "वाणी और धन में सावधानी।", "साहस और नए प्रयोग — शुभ।", "घर में अशांति से बचें।", "निर्णय सोच-समझकर लें।", "प्रतियोगिता में जीत — शुभ।", "साझेदारी में बात साफ़ रखें।", "अचानक बदलाव — सावधानी रखें।", "विचारों और आस्था में बदलाव।", "कार्यक्षेत्र में तेज़ बदलाव।", "अचानक लाभ — शुभ।", "ख़र्च और विदेश से जुड़े विषय।"] }
  };

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sgn = (p) => (p && (p.rashi || p.d1)) || 1;
  const norm = (x) => ((x % 360) + 360) % 360;
  const ms = (d) => (d instanceof Date ? d.getTime() : Number(new Date(d)));
  const my = (t) => { const d = new Date(ms(t)); return `${MON[d.getMonth()]} ${d.getFullYear()}`; };
  const dmy = (t) => { const d = new Date(ms(t)); return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`; };
  const hi = (s) => String(s || "").replace(/^.*\(|\)$/g, "").trim();
  const val = (id) => ((document.getElementById(id) || {}).value || "").trim();
  const houseFrom = (ref, target) => ((target - ref + 12) % 12) + 1;

  // ---- take a rendered dossier section and make it print-clean ----
  function clean(id) {
    const src = document.getElementById(id);
    if (!src || !src.innerHTML.trim()) return "";
    const d = document.createElement("div");
    d.innerHTML = src.innerHTML;
    d.querySelectorAll("script,style,button,input,select,textarea,form,i.fas,i.fab,i.far,.no-print,[id*='Whatsapp'],[id*='whatsapp'],a[href*='wa.me'],a[href*='rudraksha']").forEach((e) => e.remove());
    d.querySelectorAll("*").forEach((e) => {
      if (e.closest("svg")) return;
      const cls = e.getAttribute("class") || "";
      let st = "";
      const gc = [...cls.matchAll(/(?:^|\s)(?:[a-z0-9]+:)?grid-cols-(\d+)/g)].map((x) => +x[1]);
      if (/(?:^|\s)grid(?:\s|$)/.test(cls) && gc.length) st = `display:grid;grid-template-columns:repeat(${Math.min(Math.max(...gc), 12)},minmax(0,1fr));gap:2mm`;
      else if (/(?:^|\s)(?:[a-z0-9]+:)?flex(?:\s|$)/.test(cls) && !/flex-col/.test(cls) && e.tagName === "DIV") st = "display:flex;flex-wrap:wrap;gap:1.5mm 3mm;align-items:baseline";
      const boxed = e.tagName === "DIV" && /(?:^|\s)(?:border(?:-[a-z0-9/-]+)?|rounded(?:-[a-z0-9]+)?)(?:\s|$)/.test(cls);
      e.removeAttribute("class"); e.removeAttribute("style"); e.removeAttribute("id"); e.removeAttribute("onclick");
      if (st) e.setAttribute("style", st);
      if (boxed) e.setAttribute("class", "bx");
      [...e.attributes].forEach((a) => { if (a.name.startsWith("data-") || a.name.startsWith("aria-")) e.removeAttribute(a.name); });
    });
    d.querySelectorAll("a").forEach((a) => { const s = document.createElement("span"); s.innerHTML = a.innerHTML; a.replaceWith(s); });
    for (let i = 0; i < 3; i++) d.querySelectorAll("div,span,p").forEach((e) => { if (!e.textContent.trim() && !e.querySelector("svg,img,table")) e.remove(); });
    return d.innerHTML;
  }

  // ---- sidereal transit of slow planets through a year (Lahiri, approx. — enough for sign changes) ----
  function transitsFor(year) {
    const A = window.Astronomy;
    if (!A) return null;
    const ayan = (d) => 23.853 + ((d - Date.UTC(2000, 0, 1, 12)) / 864e5 / 365.25) * 0.013969;
    const lon = (body, d) => {
      if (body === "Rahu") { const T = (d - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525; return norm(125.0445479 - 1934.1362891 * T - ayan(d)); }
      return norm(A.Ecliptic(A.GeoVector(A.Body[body], new Date(d), true)).elon - ayan(d));
    };
    const out = {};
    ["Jupiter", "Saturn", "Rahu"].forEach((b) => {
      const segs = [];
      for (let t = Date.UTC(year, 0, 1); t <= Date.UTC(year, 11, 31); t += 864e5 * 2) {
        const r = Math.floor(lon(b, t) / 30) + 1;
        if (!segs.length || segs[segs.length - 1].r !== r) segs.push({ r, from: t, to: t });
        else segs[segs.length - 1].to = t;
      }
      out[b] = segs;
    });
    return out;
  }

  function stampSvg(size) {
    const s = size || 170;
    return `<svg class="stamp" width="${s}" height="${s}" viewBox="0 0 200 200" role="img" aria-label="ज्योतिष तर्क मुहर">
      <defs><path id="stTop" d="M 30 100 A 70 70 0 0 1 170 100"/><path id="stBot" d="M 26 100 A 74 74 0 0 0 174 100"/></defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="#7A1F1F" stroke-width="4"/>
      <circle cx="100" cy="100" r="86" fill="none" stroke="#7A1F1F" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="52" fill="none" stroke="#7A1F1F" stroke-width="1.5"/>
      <text font-family="Mukta,sans-serif" font-size="19" font-weight="700" fill="#7A1F1F" letter-spacing="2"><textPath href="#stTop" startOffset="50%" text-anchor="middle">ज्योतिष तर्क</textPath></text>
      <text font-family="Mukta,sans-serif" font-size="12" font-weight="700" fill="#7A1F1F" letter-spacing="1.6"><textPath href="#stBot" startOffset="50%" text-anchor="middle">★ JYOTISH TARK · LUCKNOW ★</textPath></text>
      <image href="logo.png" x="56" y="56" width="88" height="88"/>
    </svg>`;
  }

  function kvTable(rows) {
    return `<table class="kv">${rows.filter((r) => r && r[1] !== undefined && r[1] !== "").map((r) => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</table>`;
  }
  const chapter = (n, title, body, sub) => `<section class="ch"><div class="chh"><span class="chn">अध्याय ${n}</span><h2>${title}</h2>${sub ? `<p class="chs">${sub}</p>` : ""}</div>${body}</section>`;
  const block = (title, html) => (html && html.replace(/<[^>]+>/g, "").trim() ? `<div class="blk">${title ? `<h3>${title}</h3>` : ""}<div class="src">${html}</div></div>` : "");

  function build(opts) {
    opts = opts || {};
    const ctx = window.__jyotishLastCtx, vd = ctx && (ctx.vedicData || window.__jtVedicData);
    if (!ctx || !vd || !ctx.chart || !ctx.chart.isFullChartMode) throw new Error("पहले जन्म समय व स्थान सहित कुंडली बनाएँ।");
    const FR = window.FreeReport && window.FreeReport._internal;
    const m = FR ? FR.buildModel(ctx, vd) : null;
    const c = vd.chart, p = vd.panchang || {}, sv = (m && m.samvat) || {};
    const ascR = sgn(c.Asc), moonR = sgn(c.Moon);
    const house = (k) => houseFrom(ascR, sgn(c[k]));
    const lordOf = (h) => LORD[((ascR + h - 2) % 12) + 1];
    const moonNak = c.Moon.nakshatra || (Math.floor(norm(c.Moon.longitude) / (360 / 27)) + 1);
    const d = (ctx.dob || "").split("-");
    const dobTxt = d.length === 3 ? `${Number(d[2])} ${MON[Number(d[1]) - 1]} ${d[0]}` : esc(ctx.dob);
    const tob = val("birthTime"), pob = val("birthPlace");
    const gender = ctx.gender === "female" ? "स्त्री" : (ctx.gender === "male" ? "पुरुष" : "—");
    const meta = c.meta || {};
    const today = dmy(Date.now());
    const reportNo = opts.orderId || (m && m.reportId) || "";
    const rk = RASHI_AKSHAR[moonR];

    // ---------------- cover ----------------
    const cover = `<section class="cover">
      <div class="om">ॐ</div>
      <p class="ganesh">॥ श्री गणेशाय नमः ॥</p>
      <h1>सम्पूर्ण जन्म कुंडली</h1>
      <p class="cname">${esc(ctx.name)}</p>
      <table class="cdet"><tr><th>जन्म तिथि</th><td>${dobTxt}</td></tr><tr><th>जन्म समय</th><td>${esc(tob)}</td></tr><tr><th>जन्म स्थान</th><td>${esc(pob)}</td></tr><tr><th>लग्न · राशि · नक्षत्र</th><td>${RASHI[ascR]} · ${RASHI[moonR]} · ${NAK[moonNak - 1]}</td></tr></table>
      <div class="cstamp">${stampSvg(190)}</div>
      <p class="cfoot">ज्योतिष तर्क · लखनऊ · jyotishtark.in${reportNo ? ` · रिपोर्ट क्रमांक ${esc(reportNo)}` : ""} · ${today}</p>
    </section>`;

    // ---------------- contents ----------------
    const CH = ["जन्म विवरण, पंचांग, अवकहड़ा व नामाक्षर", "कुंडली चक्र — लग्न, चंद्र, चलित, नवांश, दशमांश, सप्तांश", "ग्रह स्पष्ट, ग्रहों का विस्तृत फल व अष्टकवर्ग", "स्वभाव व व्यक्तित्व", "शिक्षा व बुद्धि", "करियर व व्यवसाय", "धन, संपत्ति व भाग्य", "जीवनसाथी व विवाह", "संतान व स्वास्थ्य संकेत", "विंशोत्तरी दशा व समय-रेखा", "योग, दोष, साढ़ेसाती व वर्षफल 2027", "उपाय, मंत्र, दान व रत्न-विचार"];
    const toc = `<section class="toc"><h2>विषय सूची</h2><ol>${CH.map((t) => `<li>${t}</li>`).join("")}<li class="tnote">ज्योतिषी की टिप्पणी व आवश्यक सूचना</li></ol>
      <div class="howto"><h3>इस कुंडली के बारे में</h3><p>यह कुंडली लाहिड़ी अयनांश, उत्तर भारतीय शैली और विंशोत्तरी दशा पद्धति से तैयार की गई है। गणना आपके जन्म समय (${esc(tob)}) और जन्म स्थान (${esc(pob)}) पर आधारित है — जन्म समय में कुछ मिनट का अंतर भी लग्न और दशा की तारीखें बदल सकता है।</p><p>ज्योतिष जीवन की प्रवृत्तियाँ और समय के संकेत बताता है, गारंटी नहीं। स्वास्थ्य, क़ानून या धन से जुड़े बड़े फ़ैसलों में संबंधित विशेषज्ञ की सलाह अवश्य लें।</p></div></section>`;

    // ---------------- ch 1 ----------------
    const nakLord = NAK_LORD[(moonNak - 1) % 9];
    const ch1 = chapter(1, CH[0], `
      <div class="two"><div>${kvTable([
        ["नाम", esc(ctx.name)], ["लिंग", gender], ["जन्म तिथि", dobTxt], ["वार", esc(sv.vedicVaraHi || hi(p.varaHi))], ["जन्म समय", esc(tob)], ["जन्म स्थान", esc(pob)],
        ["अक्षांश / देशांतर", meta.lat != null ? `${Number(meta.lat).toFixed(2)}°, ${Number(meta.lng).toFixed(2)}°` : ""], ["अयनांश (लाहिड़ी)", meta.ayanamsa != null ? `${Number(meta.ayanamsa).toFixed(2)}°` : ""],
        ["सूर्योदय / सूर्यास्त", sv.sunriseStr ? `${sv.sunriseStr} / ${sv.sunsetStr}` : ""], ["विक्रम / शक संवत", sv.vikramSamvat ? `${sv.vikramSamvat} / ${sv.shakaSamvat}` : ""], ["ऋतु · अयन", sv.rituHi ? `${sv.rituHi} · ${sv.ayanaHi}` : ""]])}</div>
      <div>${kvTable([
        ["लग्न", `${RASHI[ascR]} (स्वामी ${PL[LORD[ascR]]})`], ["राशि", `${RASHI[moonR]} (स्वामी ${PL[LORD[moonR]]})`], ["नक्षत्र — चरण", `${NAK[moonNak - 1]} — ${c.Moon.pada || (m && m.moonPada) || ""}`], ["नक्षत्र स्वामी", PL[nakLord]],
        ["तिथि", esc(String(p.tithiHi || "").replace(/\s*\(.*?\)/g, ""))], ["योग", esc(hi(p.yogaName))], ["करण", esc(hi(p.karanaName))], ["वर्ण", esc(hi(p.varna))], ["योनि", esc(hi(p.yoni))], ["गण", esc(hi(p.gana))], ["नाड़ी", esc(hi(p.nadi))], ["पाया", esc(String(p.payaHi || "").split(" (")[0])]])}</div></div>
      <div class="blk akshar"><h3>नामाक्षर व राशि नाम</h3>
        <div class="two"><div>${kvTable([["जन्म राशि", RASHI[moonR]], ["नक्षत्र चरण का अक्षर", `<b class="big">${esc((m && m.syllable) || "")}</b>`], ["नक्षत्र देवता", esc((m && m.aksh && m.aksh.devataHi) || "")], ["राशि के सभी अक्षर", rk.a]])}</div>
        <div><p>पारंपरिक रूप से नाम जन्म नक्षत्र के चरण के अक्षर से रखा जाता है; उसी राशि के दूसरे अक्षरों से भी नाम रखा जा सकता है।</p>
        <p><b>इस राशि के कुछ नाम (बालक):</b> ${rk.b}</p><p><b>इस राशि के कुछ नाम (बालिका):</b> ${rk.g}</p></div></div></div>`, "आपके जन्म के समय का पंचांग, अवकहड़ा चक्र और नाम का अक्षर");

    // ---------------- ch 2 ----------------
    const svg = (s) => (s ? `<div class="chart">${s}</div>` : "");
    const helpers = window.__jtClassicalHelpers || {};
    let chandra = "";
    try { chandra = helpers.renderChandraAndChalitSvgCharts ? helpers.renderChandraAndChalitSvgCharts(ctx) : ""; } catch (e) { chandra = ""; }
    const chD = document.createElement("div"); chD.innerHTML = chandra;
    const extraSvgs = [...chD.querySelectorAll("svg")].map((s) => s.outerHTML);
    const ch2 = chapter(2, CH[1], `
      <div class="charts">${svg(vd.d1SVG)}${extraSvgs[0] ? svg(extraSvgs[0]) : ""}</div>
      <p class="cap">बाएँ: जन्म लग्न कुंडली (D1) — शरीर, स्वभाव और जीवन के सभी 12 भाव। दाएँ: चंद्र कुंडली — मन और गोचर का विचार।</p>
      ${extraSvgs[1] ? `<div class="charts one">${svg(extraSvgs[1])}</div><p class="cap">श्रीपति भाव चलित — भावों की सटीक सीमा के अनुसार ग्रहों का फल-स्थान।</p>` : ""}
      <div class="charts pb">${svg(vd.d9SVG)}${svg(vd.d10SVG)}</div>
      <p class="cap">नवांश (D9) — विवाह, धर्म और ग्रहों का वास्तविक बल · दशमांश (D10) — करियर और कर्म।</p>
      <div class="charts one">${svg(vd.d7SVG)}</div><p class="cap">सप्तांश (D7) — संतान का विचार।</p>`, "उत्तर भारतीय शैली में आपकी मुख्य कुंडलियाँ");

    // ---------------- ch 3 ----------------
    const rows = ["Asc"].concat(P9).map((k) => {
      const q = c[k] || {};
      const nk = q.nakshatra || (Math.floor(norm(q.longitude) / (360 / 27)) + 1);
      const flags = [q.retro && !["Rahu", "Ketu", "Asc"].includes(k) ? "वक्री" : "", q.combust ? "अस्त" : "", k !== "Asc" && q.d9 === sgn(q) ? "वर्गोत्तम" : ""].filter(Boolean).join(", ");
      return `<tr><td><b>${PL[k]}</b></td><td>${RASHI[sgn(q)]}</td><td>${esc(q.formattedDMS || q.formattedDeg || "")}</td><td>${NAK[nk - 1] || ""} (${q.pada || ""})</td><td>${k === "Asc" ? 1 : house(k)}</td><td>${q.d9 ? RASHI[q.d9] : ""}</td><td>${k === "Asc" ? "—" : esc((q.dignityInfo && q.dignityInfo.hi) || "")}</td><td>${esc(flags || "—")}</td></tr>`;
    }).join("");
    const lordRows = Array.from({ length: 12 }, (_, i) => { const h = i + 1, l = lordOf(h); return `<tr><td>${ORD[h]} भाव</td><td>${RASHI[((ascR + h - 2) % 12) + 1]}</td><td>${PL[l]}</td><td>${ORD[house(l)]} भाव</td><td>${P9.filter((k) => house(k) === h).map((k) => PL[k]).join(", ") || "—"}</td></tr>`; }).join("");
    const ch3 = chapter(3, CH[2], `
      <h3>ग्रह स्पष्ट (निरयण, लाहिड़ी)</h3>
      <table class="grid"><thead><tr><th>ग्रह</th><th>राशि</th><th>अंश</th><th>नक्षत्र (चरण)</th><th>भाव</th><th>नवांश</th><th>स्थिति</th><th>विशेष</th></tr></thead><tbody>${rows}</tbody></table>
      <h3>भाव, राशि, भावेश और भाव में ग्रह</h3>
      <table class="grid"><thead><tr><th>भाव</th><th>राशि</th><th>भावेश</th><th>भावेश कहाँ</th><th>भाव में ग्रह</th></tr></thead><tbody>${lordRows}</tbody></table>
      ${m ? `<p class="cap">आत्मकारक: <b>${PL[m.ak] || ""}</b>${m.amk ? ` · अमात्यकारक: <b>${PL[m.amk]}</b>` : ""}${m.dk ? ` · दाराकारक: <b>${PL[m.dk]}</b>` : ""}</p>` : ""}
      ${block("सभी 9 ग्रहों का विस्तृत फल", clean("contentPlanetsAspects"))}
      ${block("विशेष लग्न, अष्टकवर्ग और 12 भाव", clean("contentSpecialLagnas"))}`, "हर ग्रह की राशि, अंश, नक्षत्र, भाव और बल");

    // ---------------- ch 4–9 from the dossier ----------------
    const ch4 = chapter(4, CH[3], block("", clean("contentPersonality")), `लग्न ${RASHI[ascR]} · राशि ${RASHI[moonR]} · नक्षत्र ${NAK[moonNak - 1]}`);
    const ch5 = chapter(5, CH[4], block("", clean("contentEducation")), "पंचम भाव, बुध और गुरु का विचार");
    const ch6 = chapter(6, CH[5], block("", clean("contentCareer")), "दशम भाव, दशमांश (D10) और अष्टकवर्ग के आधार पर");
    const ch7 = chapter(7, CH[6], block("धन व संपत्ति", clean("contentWealth")) + block("भाग्य", clean("contentLuck")), "द्वितीय, एकादश और नवम भाव");
    const ch8 = chapter(8, CH[7], block("प्रेम व स्वभाव", clean("contentLove")) + block("विवाह, जीवनसाथी व नवांश", clean("contentPartner")), "सप्तम भाव, शुक्र और नवांश (D9)");
    const health = m && m.areas ? m.areas.find((a) => a.key === "health") : null;
    const ch9 = chapter(9, CH[8], block("संतान", clean("contentChildbirth")) +
      (health ? `<div class="blk"><h3>स्वास्थ्य संकेत</h3><ul>${health.lines.map((l) => `<li>${l}</li>`).join("")}</ul><p class="note">यह ज्योतिषीय संकेत है, चिकित्सा सलाह नहीं। किसी भी तकलीफ़ में पहले डॉक्टर से मिलें।</p></div>` : ""), "पंचम भाव, सप्तांश (D7) और लग्न-चंद्र का बल");

    // ---------------- ch 10: dasha ----------------
    const seq = (ctx.dasha && ctx.dasha.fullSeq) || [];
    const now = Date.now();
    const mdRows = seq.map((x) => `<tr${ms(x.start) <= now && ms(x.end) >= now ? ' class="now"' : ""}><td><b>${PL[x.lord]}</b></td><td>${dmy(x.start)}</td><td>${dmy(x.end)}</td><td>${Math.max(0, Math.floor((ms(x.start) - ms(new Date(ctx.dob))) / 31557600000))}–${Math.floor((ms(x.end) - ms(new Date(ctx.dob))) / 31557600000)}</td></tr>`).join("");
    const curMd = seq.findIndex((x) => ms(x.start) <= now && ms(x.end) >= now);
    const adBlock = (md) => md ? `<h3>${PL[md.lord]} महादशा की अंतर्दशाएँ</h3><table class="grid"><thead><tr><th>अंतर्दशा</th><th>आरंभ</th><th>समाप्ति</th></tr></thead><tbody>${(md.antardashas || []).map((a) => `<tr${ms(a.start) <= now && ms(a.end) >= now ? ' class="now"' : ""}><td>${PL[md.lord]}–${PL[a.lord]}</td><td>${dmy(a.start)}</td><td>${dmy(a.end)}</td></tr>`).join("")}</tbody></table>` : "";
    const ch10 = chapter(10, CH[9], `
      <h3>विंशोत्तरी महादशा क्रम (120 वर्ष)</h3>
      <table class="grid"><thead><tr><th>महादशा</th><th>आरंभ</th><th>समाप्ति</th><th>आयु (वर्ष)</th></tr></thead><tbody>${mdRows}</tbody></table>
      ${curMd >= 0 ? adBlock(seq[curMd]) + adBlock(seq[curMd + 1]) : ""}
      ${block("वर्तमान दशा, अंतर्दशा और जीवन की प्रमुख घटनाओं का समय", clean("contentTimePhase"))}`, "महादशा-अंतर्दशा की तारीखें और उनका फल");

    // ---------------- ch 11: yogas, doshas, 2027 ----------------
    const ys = (m && m.yogas) || [], cs = (m && m.cons) || [];
    const tr = m && m.transit;
    const ss = tr && tr.sadeSati;
    const ssTxt = ss ? (ss.current ? `अभी साढ़ेसाती चल रही है (${my(ss.current.start)} – ${my(ss.current.end)})।` : (ss.next ? `अगली साढ़ेसाती: ${my(ss.next.start)} से ${my(ss.next.end)} तक (लगभग)।` : "")) + (ss.prev ? ` पिछली साढ़ेसाती: ${my(ss.prev.start)} – ${my(ss.prev.end)}।` : "") : "";
    const Y = 2027, T = transitsFor(Y);
    const gRows = T ? ["Jupiter", "Saturn", "Rahu"].map((b) => T[b].map((sgm) => {
      const hm = houseFrom(moonR, sgm.r), ha = houseFrom(ascR, sgm.r), good = GOCHAR[b].good.includes(hm);
      return `<tr><td><b>${PL[b]}</b></td><td>${RASHI[sgm.r]}</td><td>${dmy(sgm.from)} – ${dmy(sgm.to)}</td><td>चंद्र से ${hm} · लग्न से ${ha}</td><td class="${good ? "g" : "c"}">${GOCHAR[b].t[hm]}</td></tr>`;
    }).join("")).join("") : "";
    const in27 = [];
    seq.forEach((md) => (md.antardashas || []).forEach((a) => { if (ms(a.end) >= Date.UTC(Y, 0, 1) && ms(a.start) <= Date.UTC(Y, 11, 31)) in27.push(`${PL[md.lord]}–${PL[a.lord]} (${my(a.start)} – ${my(a.end)})`); }));
    const ch11 = chapter(11, CH[10], `
      <h3>कुंडली के शुभ योग</h3>
      ${ys.length ? `<ul>${ys.map((y) => `<li><b>${y.title}</b> — ${y.desc}</li>`).join("")}</ul>` : "<p>विशेष योग नहीं मिले।</p>"}
      <h3>ध्यान देने योग्य बिंदु</h3>
      ${cs.length ? `<ul>${cs.map((x) => `<li><b>${x.title}</b>${x.basis ? ` <span class="muted">(${x.basis})</span>` : ""} — ${x.effect || ""}</li>`).join("")}</ul>` : "<p>कोई विशेष संवेदनशील बिंदु नहीं।</p>"}
      ${ssTxt ? `<div class="blk"><h3>शनि की साढ़ेसाती</h3><p>${ssTxt}</p></div>` : ""}
      <div class="blk yr"><h3>वर्षफल ${Y} — गोचर और दशा</h3>
        <p>${Y} में आपकी दशा: <b>${in27.join(" · ") || "—"}</b>।</p>
        ${gRows ? `<table class="grid"><thead><tr><th>ग्रह</th><th>गोचर राशि</th><th>अवधि (लगभग)</th><th>भाव</th><th>सामान्य फल</th></tr></thead><tbody>${gRows}</tbody></table><p class="note">गोचर का फल चंद्र राशि से गिना गया है; हरा = अनुकूल, नारंगी = सावधानी। तारीखें कुछ दिन आगे-पीछे हो सकती हैं।</p>` : ""}
      </div>`, "शुभ योग, दोष-विचार और आने वाले वर्ष के संकेत");

    // ---------------- ch 12: remedies ----------------
    const lagL = LORD[ascR], l5 = lordOf(5), l9 = lordOf(9);
    const GEM = { Sun: "माणिक्य", Moon: "मोती", Mars: "मूँगा", Mercury: "पन्ना", Jupiter: "पुखराज", Venus: "हीरा / ओपल", Saturn: "नीलम", Rahu: "गोमेद", Ketu: "लहसुनिया" };
    const ch12 = chapter(12, CH[11], `
      ${block("लग्नेश, दशानाथ और संवेदनशील ग्रहों के उपाय", clean("contentHiddenTraps"))}
      <div class="blk"><h3>रत्न-विचार</h3>
        <p>लग्नेश <b>${PL[lagL]}</b> (${GEM[lagL]}), पंचमेश <b>${PL[l5]}</b> (${GEM[l5]}) और नवमेश <b>${PL[l9]}</b> (${GEM[l9]}) — ये आपकी कुंडली के शुभ (त्रिकोण) ग्रह हैं, इसलिए सामान्यतः इन्हीं के रत्न विचारणीय होते हैं।</p>
        <p class="note">रत्न केवल पूरी कुंडली देखकर, सही वज़न व धातु में और परीक्षण के बाद ही पहनें — ग़लत रत्न लाभ के स्थान पर हानि कर सकता है। रत्न पहनने से पहले ज्योतिषी से सलाह लें।</p></div>`, "मंत्र, दान, व्रत और रत्न-विचार");

    // ---------------- note & close ----------------
    const note = (opts.note || "").trim();
    const close = `<section class="ch close"><div class="chh"><h2>ज्योतिषी की टिप्पणी</h2></div>
      ${note ? `<div class="note-box">${esc(note).replace(/\n/g, "<br>")}</div>` : `<div class="note-box empty"></div>`}
      <div class="blk"><h3>आवश्यक सूचना</h3><ul>
        <li>यह कुंडली आपके दिए जन्म विवरण पर आधारित है। जन्म समय ग़लत होने पर लग्न, भाव और दशा की तारीखें बदल सकती हैं।</li>
        <li>ज्योतिष मार्गदर्शन है, गारंटी नहीं। स्वास्थ्य, क़ानून या धन से जुड़े फ़ैसलों में संबंधित विशेषज्ञ की सलाह अवश्य लें।</li>
        <li>किसी भी प्रश्न के लिए: WhatsApp / कॉल <b>+91 83185 13814</b> · jyotishtark@gmail.com · jyotishtark.in</li></ul></div>
      <div class="sign">${stampSvg(150)}<p>ज्योतिष तर्क, लखनऊ<br>${today}</p></div></section>`;

    const CSS = `
      @page { size: A4; margin: 15mm 14mm 17mm; @bottom-center { content: "ज्योतिष तर्क · सम्पूर्ण कुंडली · ${esc(ctx.name).replace(/"/g, "")} · पेज " counter(page); font: 9pt Mukta, sans-serif; color: #6B5444; } }
      @page :first { margin: 12mm; @bottom-center { content: none; } }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; background: #FFFFFF; color: #2B1810; font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; font-size: 11.2pt; line-height: 1.6; }
      h1, h2, h3 { font-family: 'Tiro Devanagari Hindi', serif; font-weight: 400; color: #7A1F1F; line-height: 1.3; }
      .cover { height: 271mm; border: 3px double #B8892B; outline: 1px solid #7A1F1F; outline-offset: 4px; padding: 14mm 12mm; text-align: center; display: flex; flex-direction: column; align-items: center; background: #FBF6EC; }
      .om { font-family: 'Tiro Devanagari Hindi', serif; font-size: 70pt; color: #7A1F1F; line-height: 1; }
      .ganesh { margin: 4mm 0 0; font-family: 'Tiro Devanagari Hindi', serif; font-size: 15pt; color: #8A6416; }
      .cover h1 { margin: 8mm 0 2mm; font-size: 34pt; }
      .cname { margin: 0 0 8mm; font-size: 22pt; font-weight: 700; color: #2B1810; }
      .cdet { border-collapse: collapse; font-size: 12.5pt; min-width: 120mm; }
      .cdet th, .cdet td { padding: 2.2mm 4mm; border-bottom: 1px dotted #CDB993; text-align: left; }
      .cdet th { color: #6B5444; font-weight: 600; width: 45mm; }
      .cstamp { margin-top: auto; }
      .cfoot { margin: 6mm 0 0; font-size: 10pt; color: #6B5444; }
      .stamp { display: inline-block; opacity: .92; }
      .toc { break-before: page; }
      .toc h2 { font-size: 24pt; margin: 0 0 6mm; border-bottom: 2px solid #B8892B; padding-bottom: 2mm; }
      .toc ol { margin: 0; padding-left: 8mm; font-size: 13pt; line-height: 2.1; }
      .toc .tnote { list-style: none; margin-left: -8mm; color: #6B5444; }
      .howto { margin-top: 10mm; padding: 5mm 6mm; background: #FBF6EC; border: 1px solid #E8DCC4; border-radius: 3mm; }
      .howto h3 { margin: 0 0 2mm; font-size: 14pt; }
      .ch { break-before: page; }
      .chh { margin: 0 0 5mm; padding: 4mm 5mm; background: #7A1F1F; color: #FFFFFF; border-radius: 2mm; border-bottom: 3px double #B8892B; }
      .chh .chn { display: block; font-size: 9.5pt; font-weight: 700; letter-spacing: .08em; color: #F1D99A; }
      .chh h2 { margin: 1mm 0 0; color: #FFFFFF; font-size: 19pt; }
      .chh .chs { margin: 1mm 0 0; font-size: 10pt; color: #F3E9D6; }
      h3 { margin: 5mm 0 2mm; font-size: 14pt; border-bottom: 1px solid #E8DCC4; padding-bottom: 1mm; }
      .two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
      table { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm; font-size: 10pt; }
      th, td { border: 1px solid #E0CFAE; padding: 1.6mm 2mm; text-align: left; vertical-align: top; }
      thead th, .grid th { background: #F3E9D6; color: #5A1414; font-weight: 700; }
      tr { break-inside: avoid; }
      tr.now td { background: #FFF4D6; font-weight: 700; }
      .kv th { width: 42%; background: #FBF6EC; color: #5A1414; font-weight: 600; }
      .kv td { font-weight: 600; }
      .big { font-size: 15pt; color: #7A1F1F; }
      .charts { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin: 2mm 0; }
      .charts.one { grid-template-columns: 1fr; width: 60%; margin-left: auto; margin-right: auto; }
      .charts.pb { break-before: page; }
      .chart svg { width: 100%; height: auto; display: block; }
      .cap { margin: 1mm 0 4mm; font-size: 9.8pt; color: #6B5444; text-align: center; }
      .blk { margin: 4mm 0; }
      .src p { margin: 1.5mm 0; }
      .src h3, .src h4, .src h5 { font-family: 'Mukta', sans-serif; font-weight: 700; font-size: 11.5pt; color: #5A1414; border: 0; margin: 3mm 0 1mm; padding: 0; }
      .src div { margin: 1.5mm 0; }
      .src > div > div, .src li { break-inside: avoid; }
      .src ul, .blk ul { margin: 1mm 0; padding-left: 6mm; }
      .src strong, .src b { color: #2B1810; }
      .src svg { max-width: 100%; height: auto; }
      .src table { font-size: 9.4pt; }
      .bx { border: 1px solid #E8DCC4; border-radius: 2mm; padding: 2mm 3mm; background: #FFFDF7; break-inside: avoid; }
      .bx .bx { background: #FFFFFF; }
      .muted { color: #6B5444; }
      .note { font-size: 9.6pt; color: #6B5444; }
      td.g { background: #EEF8EE; } td.c { background: #FFF4E8; }
      .note-box { min-height: 70mm; padding: 6mm; border: 1.5px solid #B8892B; border-radius: 3mm; background: #FBF6EC; font-size: 12pt; white-space: normal; }
      .sign { margin-top: 10mm; text-align: right; }
      .sign p { margin: 2mm 0 0; font-size: 10.5pt; color: #6B5444; }
      @media screen { body { background: #EDE6D9; } .page-wrap { max-width: 210mm; margin: 8mm auto; background: #FFFFFF; padding: 14mm; box-shadow: 0 4px 20px rgba(0,0,0,.15); } .ch, .toc { border-top: 2px dashed #CDB993; margin-top: 12mm; padding-top: 8mm; } }
      @media print { .page-wrap { padding: 0; } }`;

    const base = new URL(".", location.href).href;
    return `<!doctype html><html lang="hi"><head><meta charset="utf-8"><base href="${esc(base)}">
      <title>Sampurna-Kundali-${esc((ctx.name || "").replace(/\s+/g, "-"))}${reportNo ? "-" + esc(reportNo) : ""}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Mukta:wght@400;600;700&display=swap">
      <style>${CSS}</style></head><body><div class="page-wrap">
      ${cover}${toc}${ch1}${ch2}${ch3}${ch4}${ch5}${ch6}${ch7}${ch8}${ch9}${ch10}${ch11}${ch12}${close}
      </div></body></html>`;
  }

  window.JTSampurnaReport = { build };
})();
