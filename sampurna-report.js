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

  // Rubber-stamp style seal (maroon); size in px
  function stampSvg(size, col) {
    const s = size || 170, k = col || "#7A1F1F";
    const star = (cx, cy) => `<path d="M${cx} ${cy - 5}L${cx + 1.5} ${cy - 1.5}L${cx + 5} ${cy}L${cx + 1.5} ${cy + 1.5}L${cx} ${cy + 5}L${cx - 1.5} ${cy + 1.5}L${cx - 5} ${cy}L${cx - 1.5} ${cy - 1.5}Z" fill="${k}"/>`;
    return `<svg class="stamp" width="${s}" height="${s}" viewBox="0 0 200 200" role="img" aria-label="ज्योतिष तर्क मुहर">
      <defs><path id="stT" d="M 38 100 A 62 62 0 0 1 162 100"/><path id="stB" d="M 22 100 A 78 78 0 0 0 178 100"/></defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="${k}" stroke-width="4.5"/>
      <circle cx="100" cy="100" r="89.5" fill="none" stroke="${k}" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="${k}" stroke-width="1.6" stroke-dasharray="0.1 3.6" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="50" fill="none" stroke="${k}" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="46" fill="none" stroke="${k}" stroke-width="2.6"/>
      <text font-family="'Tiro Devanagari Hindi',serif" font-size="19" fill="${k}" letter-spacing="1.5"><textPath href="#stT" startOffset="50%" text-anchor="middle">ज्योतिष तर्क</textPath></text>
      <text font-family="Mukta,sans-serif" font-size="11.5" font-weight="700" fill="${k}" letter-spacing="2.2"><textPath href="#stB" startOffset="50%" text-anchor="middle">JYOTISH TARK · LUCKNOW</textPath></text>
      ${star(29, 100)}${star(171, 100)}
      <text x="100" y="117" text-anchor="middle" font-family="'Tiro Devanagari Hindi',serif" font-size="48" fill="${k}">ॐ</text>
      <text x="100" y="134" text-anchor="middle" font-family="Mukta,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.2" fill="${k}">॥ शुभम् भवतु ॥</text>
    </svg>`;
  }
  // Gold mandala with ॐ for the cover
  function mandalaSvg() {
    let g = "";
    for (let i = 0; i < 16; i++) g += `<ellipse cx="100" cy="47" rx="9.5" ry="27" transform="rotate(${i * 22.5} 100 100)" fill="none" stroke="#E9C46A" stroke-width="1"/>`;
    for (let i = 0; i < 16; i++) g += `<ellipse cx="100" cy="66" rx="6" ry="15" transform="rotate(${i * 22.5 + 11.25} 100 100)" fill="rgba(233,196,106,.12)" stroke="#E9C46A" stroke-width=".8"/>`;
    for (let i = 0; i < 48; i++) { const a = i * 7.5 * Math.PI / 180; g += `<circle cx="${(100 + 93 * Math.sin(a)).toFixed(2)}" cy="${(100 - 93 * Math.cos(a)).toFixed(2)}" r="1.3" fill="#E9C46A"/>`; }
    return `<svg class="mandala" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="none" stroke="#E9C46A" stroke-width="1.4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#E9C46A" stroke-width=".6"/>
      ${g}
      <circle cx="100" cy="100" r="42" fill="#5A1414" stroke="#E9C46A" stroke-width="1.6"/>
      <circle cx="100" cy="100" r="37" fill="none" stroke="#E9C46A" stroke-width=".6" stroke-dasharray="2 2"/>
      <text x="100" y="121" text-anchor="middle" font-family="'Tiro Devanagari Hindi',serif" font-size="56" fill="#F7E7C1">ॐ</text>
    </svg>`;
  }
  const corner = (cls) => `<svg class="corner ${cls}" viewBox="0 0 60 60" aria-hidden="true"><path d="M4 56V4h52" fill="none" stroke="#E9C46A" stroke-width="2"/><path d="M10 56V10h46" fill="none" stroke="#E9C46A" stroke-width=".8"/><path d="M4 4l10 10M14 4h6M4 14v6" stroke="#E9C46A" stroke-width="1.2"/><circle cx="18" cy="18" r="3.2" fill="#E9C46A"/><path d="M18 9l2.2 6.8L27 18l-6.8 2.2L18 27l-2.2-6.8L9 18l6.8-2.2z" fill="none" stroke="#E9C46A" stroke-width=".9"/></svg>`;

  function kvTable(rows) {
    return `<table class="kv">${rows.filter((r) => r && r[1] !== undefined && r[1] !== "").map((r) => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</table>`;
  }
  const chapter = (n, title, body, sub, newPage) => `<section class="ch${newPage ? " np" : ""}"><div class="chh"><span class="chn">अध्याय ${n}</span><h2>${title}</h2>${sub ? `<p class="chs">${sub}</p>` : ""}</div>${body}</section>`;
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
    if (opts.gender) ctx.gender = opts.gender;
    const status = opts.status || "single";
    const STATUS = { single: "अविवाहित", married: "विवाहित", divorced: "तलाक़शुदा", widowed: "विधुर / विधवा" };
    const rashiName = (opts.rashiName || "").trim();
    const A = window.JTAnalysis;
    const gender = ctx.gender === "female" ? "स्त्री" : (ctx.gender === "male" ? "पुरुष" : "—");
    const meta = c.meta || {};
    const today = dmy(Date.now());
    const reportNo = opts.orderId || (m && m.reportId) || "";
    const rk = RASHI_AKSHAR[moonR];

    // ---------------- cover ----------------
    const cover = `<section class="cover">
      <div class="frame"></div><div class="frame2"></div>
      ${corner("tl")}${corner("tr")}${corner("bl")}${corner("br")}
      <div class="cin">
        <p class="ganesh">॥ श्री गणेशाय नमः ॥</p>
        ${mandalaSvg()}
        <h1>सम्पूर्ण जन्म कुंडली</h1>
        <p class="csub">वैदिक जन्मपत्रिका · लाहिड़ी अयनांश · विंशोत्तरी दशा</p>
        <div class="plaque"><span>जातक</span><b>${esc(ctx.name)}</b>${rashiName ? `<em>राशि नाम: ${esc(rashiName)}</em>` : ""}</div>
        <div class="cgrid">
          <div><small>जन्म तिथि</small><b>${dobTxt}</b></div>
          <div><small>जन्म समय</small><b>${esc(tob)}</b></div>
          <div><small>जन्म स्थान</small><b>${esc(pob)}</b></div>
          <div><small>लग्न · राशि · नक्षत्र</small><b>${RASHI[ascR]} · ${RASHI[moonR]} · ${NAK[moonNak - 1]}</b></div>
        </div>
        <div class="cbottom"><div class="seal">${stampSvg(150)}</div>
          <p class="cfoot">ज्योतिष तर्क, लखनऊ · jyotishtark.in<br>${reportNo ? `रिपोर्ट क्रमांक ${esc(reportNo)} · ` : ""}${today}</p></div>
      </div>
    </section>`;

    // ---------------- contents ----------------
    const CH = ["जन्म विवरण, पंचांग, अवकहड़ा व नामाक्षर", "कुंडली चक्र — लग्न, चंद्र, चलित, नवांश, दशमांश, सप्तांश", "ग्रह स्पष्ट, भाव तालिका, षड्बल व अष्टकवर्ग", "आपका स्वभाव व व्यक्तित्व", "नौ ग्रहों का विस्तृत फल", "12 भावों का विस्तृत विश्लेषण", "शिक्षा व बुद्धि", "करियर व कार्यक्षेत्र", "धन, आय, संपत्ति व भाग्य", "विवाह व जीवनसाथी", "परिवार व संतान", "स्वास्थ्य व प्रकृति", "विदेश, यात्रा व आध्यात्मिकता", "दशा फल — वर्तमान व अगली महादशा", "अगले 10 वर्ष — वर्षवार संकेत", "योग व दोष", "वर्षफल 2027, उपाय व रत्न-विचार"];
    const toc = `<section class="toc"><h2>विषय सूची</h2><ol>${CH.map((t) => `<li>${t}</li>`).join("")}<li class="tnote">ज्योतिषी की टिप्पणी व आवश्यक सूचना</li></ol>
      <div class="howto"><h3>इस कुंडली के बारे में</h3><p>यह कुंडली लाहिड़ी अयनांश, उत्तर भारतीय शैली और विंशोत्तरी दशा पद्धति से तैयार की गई है। गणना आपके जन्म समय (${esc(tob)}) और जन्म स्थान (${esc(pob)}) पर आधारित है — जन्म समय में कुछ मिनट का अंतर भी लग्न और दशा की तारीखें बदल सकता है।</p><p>ज्योतिष जीवन की प्रवृत्तियाँ और समय के संकेत बताता है, गारंटी नहीं। स्वास्थ्य, क़ानून या धन से जुड़े बड़े फ़ैसलों में संबंधित विशेषज्ञ की सलाह अवश्य लें।</p></div></section>`;

    // ---------------- ch 1 ----------------
    const nakLord = NAK_LORD[(moonNak - 1) % 9];
    const ch1 = chapter(1, CH[0], `
      <div class="two"><div>${kvTable([
        ["नाम", esc(ctx.name)], ["लिंग", gender], ["वैवाहिक स्थिति", STATUS[status] || ""], ["जन्म तिथि", dobTxt], ["वार", esc(sv.vedicVaraHi || hi(p.varaHi))], ["जन्म समय", esc(tob)], ["जन्म स्थान", esc(pob)],
        ["अक्षांश / देशांतर", meta.lat != null ? `${Number(meta.lat).toFixed(2)}°, ${Number(meta.lng).toFixed(2)}°` : ""], ["अयनांश (लाहिड़ी)", meta.ayanamsa != null ? `${Number(meta.ayanamsa).toFixed(2)}°` : ""],
        ["सूर्योदय / सूर्यास्त", sv.sunriseStr ? `${sv.sunriseStr} / ${sv.sunsetStr}` : ""], ["विक्रम / शक संवत", sv.vikramSamvat ? `${sv.vikramSamvat} / ${sv.shakaSamvat}` : ""], ["ऋतु · अयन", sv.rituHi ? `${sv.rituHi} · ${sv.ayanaHi}` : ""]])}</div>
      <div>${kvTable([
        ["लग्न", `${RASHI[ascR]} (स्वामी ${PL[LORD[ascR]]})`], ["राशि", `${RASHI[moonR]} (स्वामी ${PL[LORD[moonR]]})`], ["नक्षत्र — चरण", `${NAK[moonNak - 1]} — ${c.Moon.pada || (m && m.moonPada) || ""}`], ["नक्षत्र स्वामी", PL[nakLord]],
        ["तिथि", esc(String(p.tithiHi || "").replace(/\s*\(.*?\)/g, ""))], ["योग", esc(hi(p.yogaName))], ["करण", esc(hi(p.karanaName))], ["वर्ण", esc(hi(p.varna))], ["योनि", esc(hi(p.yoni))], ["गण", esc(hi(p.gana))], ["नाड़ी", esc(hi(p.nadi))], ["पाया", esc(String(p.payaHi || "").split(" (")[0])]])}</div></div>
      <div class="blk akshar"><h3>नामाक्षर व राशि नाम</h3>
        <div class="two"><div>${kvTable([["जन्म राशि", RASHI[moonR]], ["नक्षत्र — चरण", `${NAK[moonNak - 1]} — ${c.Moon.pada || (m && m.moonPada) || ""}`], ["नक्षत्र चरण का अक्षर", `<b class="big">${esc((m && m.syllable) || "")}</b>`], ["नक्षत्र देवता", esc((m && m.aksh && m.aksh.devataHi) || "")], ["राशि के सभी अक्षर", rk.a]])}</div>
        <div>${rashiName ? `<div class="rname"><small>ज्योतिषी द्वारा चुना गया राशि नाम</small><b>${esc(rashiName)}</b></div>` : ""}<p>पारंपरिक रूप से राशि नाम (नामकरण का नाम) जन्म नक्षत्र के चरण के अक्षर से रखा जाता है; उसी राशि के दूसरे अक्षरों से भी नाम रखा जा सकता है।</p>
        ${(() => { const NN = (window.JT_NAK_NAMES || {})[moonNak]; if (!NN) return ""; const list = (ctx.gender === "female" ? NN.g : NN.b).split(",").map((x) => x.trim()).filter(Boolean); return `<p><b>${NAK[moonNak - 1]} नक्षत्र के कुछ ${ctx.gender === "female" ? "बालिका" : "बालक"} नाम:</b> ${list.slice(0, 14).join(", ")}</p>`; })()}</div></div></div>
      <div class="blk"><h3>आपके शुभ अंक, रंग, दिन और देवता</h3>${A.lucky(ctx, vd, m)}</div>`, "आपके जन्म के समय का पंचांग, अवकहड़ा चक्र और नाम का अक्षर", true);

    // ---------------- ch 2 ----------------
    const nm = (ctx.name || "").trim();
    const strip = (x) => { if (!x || !nm) return x || ""; [nm.substring(0, 26), nm.substring(0, 22), esc(nm.substring(0, 26)), esc(nm.substring(0, 22))].forEach((t) => { if (t) x = x.split(">" + t + "<").join("><"); }); return x; };
    const svg = (s) => (s ? `<div class="chart">${strip(s)}</div>` : "");
    const helpers = window.__jtClassicalHelpers || {};
    let chandra = "";
    try { chandra = helpers.renderChandraAndChalitSvgCharts ? helpers.renderChandraAndChalitSvgCharts(ctx) : ""; } catch (e) { chandra = ""; }
    const chD = document.createElement("div"); chD.innerHTML = chandra;
    const extraSvgs = [...chD.querySelectorAll("svg")].map((s) => s.outerHTML);
    const ch2 = chapter(2, CH[1], `
      <div class="charts">${svg(vd.d1SVG)}${extraSvgs[0] ? svg(extraSvgs[0]) : ""}</div>
      <p class="cap">जन्म लग्न कुंडली (D1) — शरीर, स्वभाव और जीवन के 12 भाव · चंद्र कुंडली — मन और गोचर का विचार</p>
      ${extraSvgs[1] ? `<div class="charts one">${svg(extraSvgs[1])}</div><p class="cap">श्रीपति भाव चलित — भावों की सटीक सीमा के अनुसार ग्रहों का फल-स्थान</p>` : ""}
      <div class="cont"><span>अध्याय 2 (जारी)</span> वर्ग कुंडलियाँ</div>
      <div class="charts">${svg(vd.d9SVG)}${svg(vd.d10SVG)}</div>
      <p class="cap">नवांश (D9) — विवाह, धर्म और ग्रहों का वास्तविक बल · दशमांश (D10) — करियर और कर्म</p>
      <div class="charts one">${svg(vd.d7SVG)}</div><p class="cap">सप्तांश (D7) — संतान का विचार</p>`, "उत्तर भारतीय शैली में आपकी मुख्य कुंडलियाँ", true);

    // ---------------- ch 3 ----------------
    const rows = ["Asc"].concat(P9).map((k) => {
      const q = c[k] || {};
      const nk = q.nakshatra || (Math.floor(norm(q.longitude) / (360 / 27)) + 1);
      const flags = [q.retro && !["Rahu", "Ketu", "Asc"].includes(k) ? "वक्री" : "", q.combust ? "अस्त" : "", k !== "Asc" && q.d9 === sgn(q) ? "वर्गोत्तम" : ""].filter(Boolean).join(", ");
      return `<tr><td><b>${PL[k]}</b></td><td>${RASHI[sgn(q)]}</td><td>${esc(q.formattedDMS || q.formattedDeg || "")}</td><td>${NAK[nk - 1] || ""} (${q.pada || ""})</td><td>${k === "Asc" ? 1 : house(k)}</td><td>${q.d9 ? RASHI[q.d9] : ""}</td><td>${k === "Asc" ? "—" : esc((q.dignityInfo && q.dignityInfo.hi) || "")}</td><td>${esc(flags || "—")}</td></tr>`;
    }).join("");
    const lordRows = Array.from({ length: 12 }, (_, i) => { const h = i + 1, l = lordOf(h); return `<tr><td>${ORD[h]} भाव</td><td>${RASHI[((ascR + h - 2) % 12) + 1]}</td><td>${PL[l]}</td><td>${ORD[house(l)]} भाव</td><td>${P9.filter((k) => house(k) === h).map((k) => PL[k]).join(", ") || "—"}</td><td>${m && m.sav && m.sav[h] != null ? m.sav[h] : ""}</td></tr>`; }).join("");
    const ch3 = chapter(3, CH[2], `
      <h3>ग्रह स्पष्ट (निरयण, लाहिड़ी)</h3>
      <table class="grid"><thead><tr><th>ग्रह</th><th>राशि</th><th>अंश</th><th>नक्षत्र (चरण)</th><th>भाव</th><th>नवांश</th><th>स्थिति</th><th>विशेष</th></tr></thead><tbody>${rows}</tbody></table>
      ${vd.shadbala ? `<h3>षड्बल व अवस्था — ग्रहों का वास्तविक बल</h3><table class="grid"><thead><tr><th>ग्रह</th><th>षड्बल (100 में)</th><th>अवस्था</th><th>भाव चलित</th><th>निष्कर्ष</th></tr></thead><tbody>${["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"].map((k) => { const v = vd.shadbala[k], q = c[k] || {}; return `<tr><td><b>${PL[k]}</b></td><td><span class="bar"><i style="width:${Math.max(6, Math.min(100, v || 0))}%"></i></span> ${v != null ? v : "—"}</td><td>${esc(q.avasthaHi || "—")}</td><td>${q.chalitHouse ? ORD[q.chalitHouse] + " भाव" : "—"}</td><td>${v >= 60 ? "बलवान" : (v >= 45 ? "मध्यम" : "कम बल")}</td></tr>`; }).join("")}</tbody></table>` : ""}
      <h3>भाव, राशि, भावेश, भाव में ग्रह और अष्टकवर्ग बिंदु</h3>
      <table class="grid"><thead><tr><th>भाव</th><th>राशि</th><th>भावेश</th><th>भावेश कहाँ</th><th>भाव में ग्रह</th><th>बिंदु</th></tr></thead><tbody>${lordRows}</tbody></table>
      <p class="note">अष्टकवर्ग: 28 से अधिक बिंदु वाला भाव बलवान, 25 से कम वाला कमज़ोर माना जाता है।</p>
      ${m ? `<p class="cap">आत्मकारक: <b>${PL[m.ak] || ""}</b>${m.amk ? ` · अमात्यकारक: <b>${PL[m.amk]}</b>` : ""}${m.dk ? ` · दाराकारक: <b>${PL[m.dk]}</b>` : ""}</p>` : ""}`, "हर ग्रह की राशि, अंश, नक्षत्र, भाव और बल", true);

    // ---------------- ch 4–13 from the analysis engine ----------------
    const ch4 = chapter(4, CH[3], A.personality(ctx, vd, m), `लग्न ${RASHI[ascR]} · राशि ${RASHI[moonR]} · नक्षत्र ${NAK[moonNak - 1]}`, true);
    const ch5 = chapter(5, CH[4], `<p class="intro">नीचे हर ग्रह की स्थिति, उसका भीतरी बल (नवांश, षड्बल, अवस्था), वह किन भावों का स्वामी है, किस नक्षत्र से रंग लेता है और उसकी दशा में क्या होगा — यह सब आपके जीवन की भाषा में समझाया गया है।</p>` + A.planets(ctx, vd, m).map((x) => `<div class="pl ${x.tone}"><h4>${x.title} <span class="tag ${x.tone}">${A.TAG[x.tone]}</span></h4>${x.html}</div>`).join(""), "हर ग्रह आपके जीवन में क्या फल देता है", true);
    const LV = { good: ["बलवान", "g"], mid: ["सामान्य", "m"], weak: ["ध्यान दें", "w"] };
    const ch6 = chapter(6, CH[5], `<p class="intro">कुंडली के 12 भाव जीवन के 12 क्षेत्र हैं। हर भाव का निष्कर्ष उसके अष्टकवर्ग बिंदु, स्वामी की स्थिति, भाव में बैठे और उसे देखने वाले ग्रहों को मिलाकर निकाला गया है; साथ में चंद्र कुंडली से मन के स्तर का फल और उस भाव के अलग-अलग विषयों की स्थिति दी गई है।</p>` + A.houses(ctx, vd, m).map((x) => `<div class="hs"><h4>${x.title} <span class="lv ${LV[x.lvl][1]}">${LV[x.lvl][0]}</span></h4><p class="sub">${x.sub}</p>${x.html}</div>`).join(""), "जीवन के 12 क्षेत्रों का फल — भाव, भावेश, ग्रह और अष्टकवर्ग के आधार पर", true);
    const ch7 = chapter(7, CH[6], A.education(ctx, vd, m), "चतुर्थ, पंचम, नवम भाव, बुध और गुरु");
    const ch8 = chapter(8, CH[7], A.career(ctx, vd, m), "दशम भाव, चंद्र से दशम, दशमांश (D10), सूर्य-शनि और अमात्यकारक");
    const ch9 = chapter(9, CH[8], A.wealth(ctx, vd, m), "द्वितीय, एकादश, चतुर्थ, अष्टम, द्वादश और नवम भाव");
    const ch10 = chapter(10, CH[9], A.marriage(ctx, vd, m, status), `सप्तम भाव, ${ctx.gender === "female" ? "गुरु" : "शुक्र"}, नवांश (D9), दाराकारक और उपपद · वैवाहिक स्थिति: ${STATUS[status] || ""}`, true);
    const ch11 = chapter(11, CH[10], `${A.family(ctx, vd, m)}<h3>संतान</h3>${A.children(ctx, vd, m, status)}`, "नवम, चतुर्थ, तृतीय, एकादश और पंचम भाव, सप्तांश (D7)");
    const ch12 = chapter(12, CH[11], A.health(ctx, vd, m), "लग्न, षष्ठ, अष्टम भाव, लग्नेश व चंद्र — आयुर्वेदिक ज्योतिष के संकेत");
    const ch13 = chapter(13, CH[12], A.travelSpirit(ctx, vd, m), "द्वादश, नवम, तृतीय भाव, राहु-केतु और गुरु");

    // ---------------- ch 14: dasha ----------------
    const seq = (ctx.dasha && ctx.dasha.fullSeq) || [];
    const now = Date.now();
    const mdRows = seq.map((x) => `<tr${ms(x.start) <= now && ms(x.end) >= now ? ' class="now"' : ""}><td><b>${PL[x.lord]}</b></td><td>${dmy(x.start)}</td><td>${dmy(x.end)}</td><td>${Math.max(0, Math.floor((ms(x.start) - ms(new Date(ctx.dob))) / 31557600000))}–${Math.floor((ms(x.end) - ms(new Date(ctx.dob))) / 31557600000)}</td></tr>`).join("");
    const curMd = seq.findIndex((x) => ms(x.start) <= now && ms(x.end) >= now);
    const adBlock = (md) => md ? `<h3>${PL[md.lord]} महादशा की अंतर्दशाएँ</h3><table class="grid"><thead><tr><th>अंतर्दशा</th><th>आरंभ</th><th>समाप्ति</th></tr></thead><tbody>${(md.antardashas || []).map((a) => `<tr${ms(a.start) <= now && ms(a.end) >= now ? ' class="now"' : ""}><td>${PL[md.lord]}–${PL[a.lord]}</td><td>${dmy(a.start)}</td><td>${dmy(a.end)}</td></tr>`).join("")}</tbody></table>` : "";
    const ch14 = chapter(14, CH[13], `
      ${A.dashaDeep(ctx, vd, m)}
      <h3>जीवन के मुख्य पड़ाव (महादशा के अनुसार)</h3>
      ${A.lifePhases(ctx, vd, m)}
      <h3>विंशोत्तरी महादशा क्रम (120 वर्ष)</h3>
      <table class="grid"><thead><tr><th>महादशा</th><th>आरंभ</th><th>समाप्ति</th><th>आयु (वर्ष)</th></tr></thead><tbody>${mdRows}</tbody></table>
      ${curMd >= 0 ? adBlock(seq[curMd]) : ""}`, "वर्तमान और अगली महादशा की हर अंतर्दशा का फल, जीवन के पड़ाव और पूरी दशा-तालिका", true);

    // ---------------- ch 15: next 10 years ----------------
    const X = A.make(ctx, vd, m);
    const Y0 = new Date().getFullYear() + 1;
    const yearRows = [];
    for (let y = Y0; y < Y0 + 10; y++) {
      const T = transitsFor(y);
      if (!T) break;
      const dom = (b) => T[b].slice().sort((p1, p2) => (p2.to - p2.from) - (p1.to - p1.from))[0].r;
      const jr = dom("Jupiter"), sr = dom("Saturn");
      const jh = houseFrom(moonR, jr), sh = houseFrom(moonR, sr);
      const mid = Date.UTC(y, 6, 1);
      let md = null, ad = null;
      seq.forEach((x) => { if (ms(x.start) <= mid && ms(x.end) >= mid) { md = x; (x.antardashas || []).forEach((a) => { if (ms(a.start) <= mid && ms(a.end) >= mid) ad = a; }); } });
      const tAd = ad ? A.mdTone(X, ad.lord) : "mixed", tMd = md ? A.mdTone(X, md.lord) : "mixed";
      let sc = (GOCHAR.Jupiter.good.includes(jh) ? 1 : -0.4) + (GOCHAR.Saturn.good.includes(sh) ? 1 : ([12, 1, 2, 4, 8].includes(sh) ? -0.8 : -0.2)) + ({ good: 1, care: -1, mixed: 0 })[tAd] + ({ good: 0.5, care: -0.5, mixed: 0 })[tMd];
      const v = sc >= 1.8 ? ["बहुत अनुकूल", "good"] : (sc >= 0.6 ? ["अनुकूल", "good"] : (sc >= -0.6 ? ["मिश्रित", "mixed"] : ["सावधानी", "care"]));
      const ss = [12, 1, 2].includes(sh) ? " · शनि की साढ़ेसाती" : ([4, 8].includes(sh) ? " · शनि की ढैया" : "");
      const focus = ad ? A.topicsOf(X, ad.lord).slice(0, 2).join("; ") : "";
      yearRows.push(`<div class="yr ${v[1]}"><h4>${y} <span class="tag ${v[1]}">${v[0]}</span><span class="muted"> ${md && ad ? `${PL[md.lord]}–${PL[ad.lord]} दशा` : ""}${ss}</span></h4>
        <p><b>मुख्य विषय:</b> ${focus || "—"}। <b>गुरु</b> ${RASHI[jr]} में (चंद्र से ${jh}) — ${GOCHAR.Jupiter.t[jh]} <b>शनि</b> ${RASHI[sr]} में (चंद्र से ${sh}) — ${GOCHAR.Saturn.t[sh]}</p>
        <p class="tip">${v[1] === "good" ? "इस वर्ष नए काम, निवेश, विवाह-संबंधी बातचीत या बड़े फ़ैसलों के लिए अच्छा समय है।" : (v[1] === "care" ? "इस वर्ष धैर्य रखें — सेहत, ख़र्च और विवाद पर ध्यान दें; बड़े जोखिम टालें और उपाय नियमित करें।" : "इस वर्ष अच्छे-बुरे दोनों अनुभव होंगे — योजना बनाकर चलें और अवसर आने पर पीछे न हटें।")}</p></div>`);
    }
    const ch15 = chapter(15, CH[14], `<p class="intro">हर वर्ष का संकेत तीन बातों को मिलाकर निकाला गया है — उस वर्ष चल रही दशा-अंतर्दशा, आपकी चंद्र राशि से गुरु का गोचर और शनि का गोचर। ये सामान्य दिशा बताते हैं; किसी विशेष घटना के सटीक समय के लिए परामर्श लें।</p>${yearRows.join("")}`, `${Y0} से ${Y0 + 9} तक — दशा और गुरु-शनि गोचर के आधार पर`, true);

    // ---------------- ch 16: yogas & doshas ----------------
    const YD = A.yogas(ctx, vd, m);
    const tr = m && m.transit;
    const ss = tr && tr.sadeSati;
    const ssTxt = ss ? (ss.current ? `अभी शनि की साढ़ेसाती चल रही है (${my(ss.current.start)} – ${my(ss.current.end)})। यह समय मेहनत, धैर्य और अनुशासन का है — इसी दौर में व्यक्ति सबसे ज़्यादा परिपक्व होता है।` : (ss.next ? `अगली साढ़ेसाती लगभग ${my(ss.next.start)} से ${my(ss.next.end)} तक रहेगी।` : "")) + (ss.prev ? ` पिछली साढ़ेसाती ${my(ss.prev.start)} – ${my(ss.prev.end)} में थी।` : "") : "";
    const ch16 = chapter(16, CH[15], `
      <h3>आपकी कुंडली के शुभ योग</h3>
      ${YD.yogas.length ? YD.yogas.map((y) => `<div class="yg"><h4>${y.t}</h4><p>${y.d}</p></div>`).join("") : "<p>कुंडली में कोई प्रमुख शास्त्रीय योग नहीं बनता — ऐसी कुंडली में ग्रहों की दशा और मेहनत ही मुख्य फल देती है।</p>"}
      <h3>दोष और ध्यान देने योग्य बातें</h3>
      ${YD.doshas.length ? YD.doshas.map((y) => `<div class="yg care"><h4>${y.t}</h4><p>${y.d}</p></div>`).join("") : "<p>कुंडली में मांगलिक, कालसर्प जैसा कोई प्रमुख दोष नहीं है।</p>"}
      ${ssTxt ? `<div class="yg"><h4>शनि की साढ़ेसाती</h4><p>${ssTxt}</p></div>` : ""}`, "शुभ योग कब और कैसे फल देंगे, दोषों का सही अर्थ और सरल उपाय");

    // ---------------- ch 17: 2027, remedies, gems ----------------
    const Y = 2027, T27 = transitsFor(Y);
    const gRows = T27 ? ["Jupiter", "Saturn", "Rahu"].map((b) => T27[b].map((sgm) => {
      const hm = houseFrom(moonR, sgm.r), ha = houseFrom(ascR, sgm.r), good = GOCHAR[b].good.includes(hm);
      return `<tr><td><b>${PL[b]}</b></td><td>${RASHI[sgm.r]}</td><td>${dmy(sgm.from)} – ${dmy(sgm.to)}</td><td>चंद्र से ${hm} · लग्न से ${ha}</td><td class="${good ? "g" : "c"}">${GOCHAR[b].t[hm]}</td></tr>`;
    }).join("")).join("") : "";
    const in27 = [];
    seq.forEach((md) => (md.antardashas || []).forEach((a) => { if (ms(a.end) >= Date.UTC(Y, 0, 1) && ms(a.start) <= Date.UTC(Y, 11, 31)) in27.push(`${PL[md.lord]}–${PL[a.lord]} (${my(a.start)} – ${my(a.end)})`); }));
    const lagL = LORD[ascR], l5 = lordOf(5), l9 = lordOf(9);
    const GEM = { Sun: "माणिक्य", Moon: "मोती", Mars: "मूँगा", Mercury: "पन्ना", Jupiter: "पुखराज", Venus: "हीरा / ओपल", Saturn: "नीलम", Rahu: "गोमेद", Ketu: "लहसुनिया" };
    const avoid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((k) => ![lagL, l5, l9].includes(k) && X.owns(k).length && X.owns(k).every((h) => [3, 6, 8, 11, 12].includes(h)));
    const ch17 = chapter(17, CH[16], `
      <h3>वर्षफल ${Y}</h3>
      <p>${Y} में आपकी दशा: <b>${in27.join(" · ") || "—"}</b>।</p>
      ${gRows ? `<table class="grid"><thead><tr><th>ग्रह</th><th>गोचर राशि</th><th>अवधि (लगभग)</th><th>भाव</th><th>फल</th></tr></thead><tbody>${gRows}</tbody></table><p class="note">गोचर का फल चंद्र राशि से गिना गया है; हरा = अनुकूल, नारंगी = सावधानी।</p>` : ""}
      <h3>आपके लिए उपाय</h3>
      <p class="intro">ये उपाय आपके लग्नेश, अभी चल रही दशा-अंतर्दशा और कमज़ोर ग्रहों को देखकर चुने गए हैं। श्रद्धा और नियमितता उपाय की सबसे बड़ी शर्त है — एक साथ बहुत सारे उपाय करने के बजाय एक-दो उपाय रोज़ करें।</p>
      ${A.remedies(ctx, vd, m)}
      <div class="yg"><h4>रत्न-विचार</h4><p>आपकी कुंडली के शुभ (त्रिकोण) ग्रह हैं — लग्नेश <b>${PL[lagL]}</b> (${GEM[lagL]}), पंचमेश <b>${PL[l5]}</b> (${GEM[l5]}) और नवमेश <b>${PL[l9]}</b> (${GEM[l9]})। सामान्यतः इन्हीं के रत्न विचारणीय होते हैं।${avoid.length ? ` <b>${avoid.map((k) => `${PL[k]} (${GEM[k]})`).join(", ")}</b> केवल अशुभ भावों के स्वामी होने से इनके रत्न बिना विशेष परामर्श के न पहनें।` : ""} रत्न केवल ज्योतिषी से सलाह लेकर, सही वज़न व धातु में और परीक्षण के बाद ही पहनें।</p></div>`, "आने वाले वर्ष के गोचर, आपके लिए चुने गए उपाय और रत्न");

    // ---------------- note & close ----------------
    const note = (opts.note || "").trim();
    const close = `<section class="ch close keep"><div class="chh"><h2>ज्योतिषी की टिप्पणी</h2></div>
      ${note ? `<div class="note-box">${esc(note).replace(/\n/g, "<br>")}</div>` : `<div class="note-box empty"></div>`}
      <div class="blk"><h3>आवश्यक सूचना</h3><ul>
        <li>यह कुंडली आपके दिए जन्म विवरण पर आधारित है। जन्म समय ग़लत होने पर लग्न, भाव और दशा की तारीखें बदल सकती हैं।</li>
        <li>ज्योतिष मार्गदर्शन है, गारंटी नहीं। स्वास्थ्य, क़ानून या धन से जुड़े फ़ैसलों में संबंधित विशेषज्ञ की सलाह अवश्य लें।</li>
        <li>किसी भी प्रश्न के लिए: WhatsApp / कॉल <b>+91 83185 13814</b> · jyotishtark@gmail.com · jyotishtark.in</li></ul></div>
      <div class="sign">${stampSvg(150)}<p>ज्योतिष तर्क, लखनऊ<br>${today}</p></div></section>`;

    const NAME = esc(ctx.name).replace(/"/g, "");
    const CSS = `
      @page { size: A4; margin: 19mm 14mm 16mm;
        @top-left { content: "ज्योतिष तर्क"; font: 600 9pt Mukta, sans-serif; color: #7A1F1F; border-bottom: .35mm solid #C9A227; vertical-align: bottom; padding-bottom: 1.5mm; }
        @top-center { content: ""; border-bottom: .35mm solid #C9A227; }
        @top-right { content: "सम्पूर्ण जन्म कुंडली · ${NAME}"; font: 9pt Mukta, sans-serif; color: #6B5444; border-bottom: .35mm solid #C9A227; vertical-align: bottom; padding-bottom: 1.5mm; }
        @bottom-center { content: "— " counter(page) " —"; font: 9pt Mukta, sans-serif; color: #7A1F1F; }
        @bottom-right { content: "jyotishtark.in"; font: 8pt Mukta, sans-serif; color: #8A7A6A; } }
      @page :first { margin: 0; @top-left { content: none; border: 0; } @top-center { content: none; border: 0; } @top-right { content: none; border: 0; } @bottom-center { content: none; } @bottom-right { content: none; } }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; background: #FFFFFF; color: #2B1810; font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif; font-size: 11pt; line-height: 1.58; orphans: 3; widows: 3; }
      h1, h2, h3 { font-family: 'Tiro Devanagari Hindi', serif; font-weight: 400; color: #7A1F1F; line-height: 1.3; }
      /* cover */
      .cover { position: relative; width: 210mm; height: 297mm; overflow: hidden; break-after: page; color: #F7E7C1; background: radial-gradient(circle at 50% 30%, #93302A 0%, #6E1C17 48%, #4A110E 100%); }
      .frame { position: absolute; inset: 9mm; border: 1.1mm solid #C9A227; }
      .frame2 { position: absolute; inset: 12mm; border: .35mm solid #E9C46A; }
      .corner { position: absolute; width: 22mm; height: 22mm; }
      .corner.tl { top: 6mm; left: 6mm; } .corner.tr { top: 6mm; right: 6mm; transform: scaleX(-1); }
      .corner.bl { bottom: 6mm; left: 6mm; transform: scaleY(-1); } .corner.br { bottom: 6mm; right: 6mm; transform: scale(-1, -1); }
      .cin { position: absolute; inset: 16mm 18mm; display: flex; flex-direction: column; align-items: center; text-align: center; }
      .ganesh { margin: 4mm 0 4mm; font-family: 'Tiro Devanagari Hindi', serif; font-size: 15pt; color: #F1D38A; letter-spacing: .05em; }
      .mandala { width: 78mm; height: 78mm; }
      .cover h1 { margin: 6mm 0 1mm; font-size: 38pt; color: #F1D38A; text-shadow: 0 .4mm 0 #3A0C0A; }
      .csub { margin: 0; font-size: 11pt; letter-spacing: .12em; color: #E9D7A8; }
      .plaque { margin: 7mm 0 6mm; min-width: 120mm; padding: 3mm 10mm 3.5mm; background: #FBF2DC; border: .6mm solid #C9A227; outline: .3mm solid #FBF2DC; outline-offset: .8mm; border-radius: 2mm; color: #5A1414; }
      .plaque span { display: block; font-size: 9pt; letter-spacing: .2em; color: #8A6416; }
      .plaque b { display: block; font-family: 'Tiro Devanagari Hindi', serif; font-weight: 400; font-size: 24pt; line-height: 1.25; }
      .cgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm; width: 150mm; }
      .cgrid div { padding: 2.5mm 4mm; border: .3mm solid rgba(233,196,106,.7); border-radius: 1.5mm; background: rgba(0,0,0,.14); text-align: left; }
      .cgrid small { display: block; font-size: 8.5pt; letter-spacing: .08em; color: #E9C46A; }
      .cgrid b { font-size: 12pt; color: #FFF6DF; font-weight: 600; }
      .cbottom { margin-top: auto; display: flex; flex-direction: column; align-items: center; }
      .seal { width: 44mm; height: 44mm; border-radius: 50%; background: #FBF2DC; border: .6mm solid #C9A227; display: flex; align-items: center; justify-content: center; }
      .seal .stamp { width: 40mm; height: 40mm; transform: rotate(-8deg); }
      .cfoot { margin: 3mm 0 0; font-size: 9.5pt; line-height: 1.5; color: #E9D7A8; }
      /* contents */
      .toc { break-before: page; }
      .toc h2 { font-size: 22pt; margin: 0 0 3mm; border-bottom: .6mm solid #C9A227; padding-bottom: 2mm; text-align: center; }
      .toc ol { margin: 0 auto; padding: 0; list-style: none; counter-reset: c; max-width: 150mm; }
      .toc li { counter-increment: c; display: flex; gap: 4mm; align-items: baseline; padding: 1.5mm 0; border-bottom: .2mm dotted #CDB993; font-size: 11.5pt; }
      .toc li::before { content: "अध्याय " counter(c); flex: none; width: 22mm; font-size: 9.5pt; font-weight: 700; color: #8A6416; }
      .toc .tnote::before { content: "अंत में"; }
      .howto { margin: 9mm auto 0; max-width: 150mm; padding: 5mm 6mm; background: #FBF6EC; border: .3mm solid #E0CFAE; border-left: 1.2mm solid #C9A227; }
      .howto h3 { margin: 0 0 2mm; font-size: 13.5pt; border: 0; }
      .howto p { margin: 1.5mm 0; font-size: 10.5pt; }
      /* chapters */
      .ch { margin-top: 9mm; }
      .ch.np { break-before: page; margin-top: 0; }
      .chh { margin: 0 0 4mm; padding: 3.5mm 5mm 3.8mm; background: #7A1F1F; color: #FFFFFF; border-radius: 1.5mm; border-bottom: 1mm solid #C9A227; break-after: avoid; break-inside: avoid; }
      .chh .chn { display: block; font-size: 9pt; font-weight: 700; letter-spacing: .14em; color: #F1D38A; }
      .chh h2 { margin: .5mm 0 0; color: #FFFFFF; font-size: 18pt; }
      .chh .chs { margin: .5mm 0 0; font-size: 9.8pt; color: #F3E9D6; }
      h3 { margin: 4.5mm 0 2mm; font-size: 13.5pt; border-bottom: .3mm solid #E0CFAE; padding-bottom: 1mm; break-after: avoid; }
      .cont { break-before: page; margin: 0 0 4mm; padding: 2mm 4mm; border-left: 1.2mm solid #C9A227; background: #FBF6EC; font-family: 'Tiro Devanagari Hindi', serif; font-size: 14pt; color: #7A1F1F; }
      .cont span { display: block; font-family: Mukta, sans-serif; font-size: 8.5pt; font-weight: 700; letter-spacing: .1em; color: #8A6416; }
      .two { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
      table { width: 100%; border-collapse: collapse; margin: 2mm 0 3.5mm; font-size: 9.8pt; }
      th, td { border: .25mm solid #E0CFAE; padding: 1.5mm 2mm; text-align: left; vertical-align: top; }
      thead th, .grid th { background: #F3E9D6; color: #5A1414; font-weight: 700; }
      thead { display: table-header-group; }
      tr { break-inside: avoid; }
      tr.now td { background: #FFF4D6; font-weight: 700; }
      .kv th { width: 42%; background: #FBF6EC; color: #5A1414; font-weight: 600; }
      .kv td { font-weight: 600; }
      .big { font-size: 15pt; color: #7A1F1F; }
      .charts { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin: 1mm 0; }
      .charts.one { grid-template-columns: 1fr; width: 50%; margin: 1mm auto; }
      .chart { break-inside: avoid; }
      .chart svg { width: 100%; height: auto; display: block; }
      .cap { margin: 1mm 0 3.5mm; font-size: 9.5pt; color: #6B5444; text-align: center; }
      .blk { margin: 3.5mm 0; }
      .src p { margin: 1.4mm 0; }
      .src h3, .src h4, .src h5 { font-family: 'Mukta', sans-serif; font-weight: 700; font-size: 11.2pt; color: #5A1414; border: 0; margin: 3mm 0 1mm; padding: 0; break-after: avoid; }
      .src div { margin: 1.4mm 0; }
      .src li, .blk li { break-inside: avoid; margin: .8mm 0; }
      .src ul, .blk ul { margin: 1mm 0; padding-left: 6mm; }
      .src strong, .src b { color: #2B1810; }
      .src svg { max-width: 100%; height: auto; }
      .src table { font-size: 9.2pt; }
      .bx { border: .25mm solid #E8DCC4; border-radius: 1.5mm; padding: 2mm 3mm; background: #FFFDF7; }
      .bx .bx { background: #FFFFFF; }
      .keep { break-inside: avoid; }
      .muted { color: #6B5444; }
      .plaque em { display: block; font-style: normal; font-size: 11pt; color: #8A6416; margin-top: .5mm; }
      .rname { margin: 0 0 3mm; padding: 2.5mm 4mm; border: .5mm solid #C9A227; border-radius: 2mm; background: #FBF6EC; }
      .rname small { display: block; font-size: 9pt; color: #8A6416; } .rname b { font-family: 'Tiro Devanagari Hindi', serif; font-weight: 400; font-size: 18pt; color: #7A1F1F; }
      h4 { margin: 0 0 1.2mm; font-family: 'Mukta', sans-serif; font-weight: 700; font-size: 11.8pt; color: #5A1414; break-after: avoid; }
      .pl, .hs, .yg, .ad { margin: 0 0 3mm; padding: 2.8mm 4mm 2.2mm; border: .25mm solid #E8DCC4; border-left: 1.2mm solid #C9A227; border-radius: 1.5mm; background: #FFFDF7; }
      .pl p, .hs p, .yg p, .ad p { margin: 1mm 0; }
      .hs .sub { margin: 0 0 1mm; font-size: 9.6pt; color: #8A6416; font-weight: 600; }
      .conn { font-size: 9.4pt; }
      .lv { float: right; font-size: 8.8pt; padding: .3mm 2.5mm; border-radius: 3mm; font-weight: 700; }
      .lv.g { background: #DCFCE7; color: #14532D; } .lv.m { background: #FEF3C7; color: #78350F; } .lv.w { background: #FFE4E6; color: #9F1239; }
      .yg.care { border-left-color: #C2410C; }
      .ad.good { border-left-color: #15803D; } .ad.care { border-left-color: #C2410C; }
      td .lv { float: none; } .intro { color: #4A3B2A; font-size: 10.2pt; background: #FBF5E6; padding: 2mm 3.5mm; border-radius: 1.5mm; }
      table.kv.mini { font-size: 9pt; margin: 0 0 1.5mm; } table.kv.mini th { width: auto; white-space: nowrap; }
      .bar { display: inline-block; width: 22mm; height: 2.2mm; background: #EFE6D2; border-radius: 1mm; vertical-align: middle; overflow: hidden; } .bar i { display: block; height: 100%; background: linear-gradient(90deg,#C9A227,#7A1F1F); }
      .tip { background: #F3F8EE; border-radius: 1.2mm; padding: 1.4mm 2.5mm; } .why { font-size: 9.4pt; color: #5B4B37; }
      table.grid.sub { font-size: 9.2pt; margin: 1.5mm 0; } ol.rank li { margin: 0 0 1.6mm; }
      .pl.good { border-left-color: #15803D; } .pl.care { border-left-color: #C2410C; }
      .yr { margin: 0 0 2.6mm; padding: 2.4mm 4mm 1.8mm; border: .25mm solid #E8DCC4; border-left: 1.2mm solid #C9A227; border-radius: 1.5mm; background: #FFFDF7; } .yr h4 { margin: 0 0 1mm; } .yr p { margin: .8mm 0; } .yr.good { border-left-color: #15803D; } .yr.care { border-left-color: #C2410C; }
      .md.good { border-left: 1.2mm solid #15803D; } .md.care { border-left: 1.2mm solid #C2410C; }
 padding: .2mm 2mm; border-radius: 3mm; font-weight: 700; }
      .tag.good { background: #DCFCE7; color: #14532D; } .tag.care { background: #FFE4E6; color: #9F1239; } .tag.mixed { background: #FEF3C7; color: #78350F; }
      .pbox { padding: 3mm 4mm; border-radius: 1.5mm; border: .25mm solid #E8DCC4; } .pbox.good { background: #F0FDF4; } .pbox.care { background: #FFF7ED; }
      .pbox h4 { margin-top: 0; }
      .note { font-size: 9.4pt; color: #6B5444; }
      td.g { background: #EEF8EE; } td.c { background: #FFF4E8; }
      .note-box { min-height: 60mm; padding: 6mm; border: .5mm solid #C9A227; border-radius: 2mm; background: #FBF6EC; font-size: 12pt; }
      .sign { margin-top: 10mm; display: flex; justify-content: flex-end; align-items: center; gap: 6mm; }
      .sign .stamp { transform: rotate(-8deg); }
      .sign p { margin: 0; font-size: 10.5pt; color: #6B5444; text-align: right; }
      @media screen { body { background: #EDE6D9; } .page-wrap { width: 210mm; margin: 8mm auto; background: #FFFFFF; padding: 0 14mm 14mm; box-shadow: 0 4px 20px rgba(0,0,0,.15); } .cover { margin: 0 -14mm; } .ch.np, .toc { border-top: 2px dashed #CDB993; padding-top: 8mm; margin-top: 10mm; } }
      @media print { .page-wrap { padding: 0; } }`;

    const base = new URL(".", location.href).href;
    return `<!doctype html><html lang="hi"><head><meta charset="utf-8"><base href="${esc(base)}">
      <title>Sampurna-Kundali-${esc((ctx.name || "").replace(/\s+/g, "-"))}${reportNo ? "-" + esc(reportNo) : ""}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Mukta:wght@400;600;700&display=swap">
      <style>${CSS}</style></head><body><div class="page-wrap">
      ${cover}${toc}${ch1}${ch2}${ch3}${ch4}${ch5}${ch6}${ch7}${ch8}${ch9}${ch10}${ch11}${ch12}${ch13}${ch14}${ch15}${ch16}${ch17}${close}
      </div><script>(function(){var mm=96/25.4;function k(){document.querySelectorAll(".bx,.two,table.kv,.akshar,.pl,.hs,.yg,.ad,.pbox,.yr,table.sub,ol.rank li").forEach(function(e){if(e.getBoundingClientRect().height<70*mm)e.classList.add("keep")});}if(document.readyState==="complete")k();else window.addEventListener("load",k);})();<\/script></body></html>`;
  }

  window.JTSampurnaReport = { build };
})();
