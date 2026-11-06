/* ==========================================================================
   JYOTISH TARK — ₹1,101 SAMPURNA KUNDALI PREVIEW (traditional patri style)
   Shown below the free dossier on kundali-form.html. Visible parts use the
   visitor's real computed chart; locked parts show only placeholder bars —
   the real 30-page report is prepared after payment, so nothing hidden here
   can be "un-blurred".
   Needs: free-report.js (FreeReport._internal.buildModel), jt-payment.js
   ========================================================================== */
(function () {
  "use strict";
  const PRICE = 1101, HAND = 2100;
  const PAY_LINK = "https://payments.cashfree.com/forms/sampurnakundali";
  const RASHI = [null, "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const PL = { Asc: "लग्न", Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const PS = { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" };
  const NAK = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"];
  const MON = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const ORD = [null, "पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"];
  const P9 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sgn = (p) => (p && (p.rashi || p.d1)) || 1;
  const norm = (x) => ((x % 360) + 360) % 360;
  const nakOf = (p) => (p && (p.nakshatra || p.nak)) || (Math.floor(norm(p && p.longitude) / (360 / 27)) + 1);
  const deg = (p) => { const d = (p && typeof p.degInSign === "number") ? p.degInSign : (norm(p && p.longitude) % 30); const a = Math.floor(d), b = Math.floor((d - a) * 60); return `${String(a).padStart(2, "0")}°${String(b).padStart(2, "0")}′`; };
  const ms = (d) => (d instanceof Date ? d.getTime() : Number(d));
  const my = (t) => { const d = new Date(ms(t)); return `${MON[d.getMonth()]} ${d.getFullYear()}`; };
  const hi = (s) => String(s || "").replace(/^.*\(|\)$/g, "").trim();
  const rashiOfHouse = (asc, h) => ((asc + h - 2) % 12) + 1;
  const strip = (h) => String(h || "").replace(/<[^>]+>/g, "").trim();

  const LOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const bars = (ws) => `<div class="sp-bl" aria-hidden="true">${ws.map((w) => `<div class="sp-bar" style="width:${w}%"></div>`).join("")}</div>`;
  const lock = (t) => `<p class="sp-lock">${LOCK}<span>${t}</span></p>`;

  const CSS = `
  .sp{max-width:760px;margin:0 auto;background:#F6EEDC;color:#2B1810;border-radius:6px;font-family:'Mukta',system-ui,sans-serif;overflow:hidden;border:3px double #B8892B;text-align:left}
  .sp *{box-sizing:border-box}
  .sp-top{background:#7A1F1F;color:#FBF6EC;text-align:center;padding:22px 18px 18px;border-bottom:4px double #B8892B}
  .sp-top .sp-om{margin:0;font-family:'Tiro Devanagari Hindi',serif;color:#F1D99A;font-size:17px}
  .sp-top h2{margin:6px 0 2px;font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:32px;color:#FFFFFF;line-height:1.25}
  .sp-top p{margin:0;color:#F3E9D6;font-size:15px}
  .sp-pill{display:inline-block;margin-top:10px;padding:3px 12px;border:1px solid #F1D99A;border-radius:999px;color:#F1D99A;font-size:13.5px}
  .sp-ok{margin:16px;padding:14px 16px;background:#FFFFFF;border:2px solid #B8892B;border-radius:4px;display:flex;gap:12px;align-items:center}
  .sp-ok b{font-size:17px;color:#2B1810}.sp-ok span{display:block;font-size:15px;color:#4A3628}
  .sp-sec{margin:0 16px 14px;padding:16px;background:#FFFDF7;border:1px solid #D9C6A0;border-radius:4px}
  .sp-sec.hl{border:2px solid #B8892B}
  .sp-sec h3{margin:0 0 10px;font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:21px;color:#7A1F1F;display:flex;align-items:center;gap:10px;line-height:1.3}
  .sp-n{flex:none;display:inline-flex;width:28px;height:28px;border-radius:50%;border:1.5px solid #B8892B;color:#7A5410;font:700 14px 'Mukta',sans-serif;align-items:center;justify-content:center}
  .sp-pg{margin-left:auto;font:600 13px 'Mukta',sans-serif;color:#6B5444;white-space:nowrap}
  .sp-kv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 14px}
  .sp-kv div{border-bottom:1px dotted #D9C6A0;padding-bottom:6px;min-width:0}
  .sp-kv small{display:block;font-size:13px;color:#6B5444}
  .sp-kv b{font-size:16px;color:#2B1810;font-weight:600;overflow-wrap:anywhere}
  .sp p.sp-t{margin:0 0 6px;font-size:16px;line-height:1.65;color:#2B1810}
  .sp-bl{filter:blur(5px);user-select:none;pointer-events:none;margin-top:6px}
  .sp-bar{height:11px;border-radius:6px;background:#CDB993;margin:9px 0}
  .sp-lock{display:flex;align-items:center;gap:8px;margin:10px 0 0;padding:9px 12px;background:#F3E9D6;border-radius:4px;font-size:15px;color:#5A1414;font-weight:600}
  .sp table{width:100%;border-collapse:collapse;font-size:15px}
  .sp th{background:#F3E9D6;color:#5A1414;font-weight:700;text-align:left;padding:7px 6px;border-bottom:1px solid #D9C6A0}
  .sp td{padding:7px 6px;border-bottom:1px solid #EADCC0;color:#2B1810}
  .sp-chart{display:block;width:100%;max-width:340px;margin:0 auto;background:#FFFFFF}
  .sp-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .sp-cta{margin:4px 16px 0;padding:22px 18px;background:#7A1F1F;color:#FFFFFF;border-radius:4px;border:3px double #B8892B;text-align:center}
  .sp-cta .k{margin:0;font-size:15px;color:#F1D99A}
  .sp-cta .p{margin:6px 0 2px;font-family:'Tiro Devanagari Hindi',serif;font-size:44px;color:#FFFFFF;line-height:1.1}
  .sp-cta ol{margin:12px auto 16px;padding-left:22px;text-align:left;font-size:16px;line-height:1.8;color:#FBF6EC;max-width:420px}
  .sp-btn{display:block;width:100%;max-width:420px;margin:0 auto;padding:14px;border:0;border-radius:4px;background:#F1D99A;color:#5A1414;font:700 18px 'Mukta',sans-serif;cursor:pointer;text-decoration:none}
  .sp-btn:hover{background:#FBE7B0}
  .sp-btn:focus-visible,.sp a:focus-visible{outline:3px solid #FFFFFF;outline-offset:2px}
  .sp-hand{margin:14px 16px 0;padding:14px 16px;background:#FFFDF7;border:1px solid #D9C6A0;border-radius:4px}
  .sp-hand b{font-size:16.5px}.sp-hand p{margin:4px 0 0;font-size:15px;color:#4A3628;line-height:1.6}
  .sp-hand a{color:#7A1F1F;font-weight:700}
  .sp-foot{margin:14px 16px 18px;font-size:13px;color:#6B5444;line-height:1.6;text-align:center}
  .sp-pay{margin:14px 16px 0}
  @media (max-width:480px){.sp-top h2{font-size:27px}.sp-kv{gap:8px 10px}.sp table{font-size:14px}.sp th,.sp td{padding:6px 4px}.sp-pg{display:none}}
  @media print{#chapter-sampurna{display:none!important}}
  `;
  function css() {
    if (document.getElementById("sp-css")) return;
    const s = document.createElement("style"); s.id = "sp-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  // North-Indian chart: house h text positions
  const NUM = [null, [150, 132], [75, 64], [62, 80], [134, 154], [62, 229], [75, 242], [150, 178], [225, 242], [238, 229], [168, 154], [238, 80], [225, 64]];
  const PLP = [null, [150, 100], [75, 36], [28, 80], [80, 154], [28, 226], [75, 278], [150, 214], [225, 278], [272, 226], [222, 154], [272, 80], [225, 36]];
  function chartSvg(m, blank) {
    let nums = "", pls = "";
    const desc = [];
    for (let h = 1; h <= 12; h++) {
      const r = rashiOfHouse(m.ascR, h);
      nums += `<text x="${NUM[h][0]}" y="${NUM[h][1]}">${r}</text>`;
      if (blank) continue;
      const occ = m.occupants(h);
      if (occ.length) desc.push(`${ORD[h]} भाव में ${occ.map((k) => PL[k]).join(", ")}`);
      const [x, y] = PLP[h];
      const side = [3, 5, 9, 11].includes(h);
      const lines = side ? occ.map((k) => PS[k]) : [occ.map((k) => PS[k]).join(" ")];
      const fs = (!side && occ.length > 2) ? 13 : 15;
      pls += lines.filter(Boolean).map((t, i) => `<text x="${x}" y="${y + (i - (lines.length - 1) / 2) * 20}" font-size="${fs}">${t}</text>`).join("");
    }
    const label = blank ? "" : `role="img" aria-label="लग्न कुंडली: ${RASHI[m.ascR]} लग्न। ${desc.join("; ")}।"`;
    return `<svg viewBox="0 0 300 300" class="sp-chart" ${blank ? 'aria-hidden="true"' : label}>
      <rect x="2" y="2" width="296" height="296" fill="#FFFFFF" stroke="#7A1F1F" stroke-width="2.5"/>
      <path d="M2 2L298 298M298 2L2 298M150 2L2 150L150 298L298 150Z" fill="none" stroke="#7A1F1F" stroke-width="1.6"/>
      <g font-family="Mukta,sans-serif" font-size="11" fill="#7A5410" text-anchor="middle">${nums}</g>
      ${blank ? "" : `<g font-family="Mukta,sans-serif" font-weight="700" fill="#2B1810" text-anchor="middle"><text x="150" y="80" fill="#7A1F1F" font-size="14">लग्न</text>${pls}</g>`}
    </svg>`;
  }

  function sec(n, title, pages, body, hl) {
    return `<section class="sp-sec${hl ? " hl" : ""}"><h3><span class="sp-n">${n}</span>${title}</h3>${body}</section>`;
  }

  function build(ctx) {
    const FR = window.FreeReport && window.FreeReport._internal;
    if (!FR || !ctx || !ctx.chart) return null;
    let m;
    try { m = FR.buildModel(ctx, ctx.vedicData || window.__jtVedicData); } catch (e) { console.warn("sampurna preview:", e); return null; }
    const c = m.chart, full = m.full;
    const val = (id) => ((document.getElementById(id) || {}).value || "").trim();
    const tob = val("birthTime"), pob = val("birthPlace");
    const d = ctx.dob ? ctx.dob.split("-") : [];
    const dobTxt = d.length === 3 ? `${Number(d[2])} ${MON[Number(d[1]) - 1]} ${d[0]}` : esc(ctx.dob);
    const p = m.panchang || {};
    const area = (k) => (m.areas || []).find((a) => a.key === k);
    const firstLine = (k) => { const a = area(k); return a && a.lines && a.lines[0] ? strip(a.lines[0]) : ""; };
    const out = [];

    out.push(`<div class="sp-top"><p class="sp-om">॥ श्री गणेशाय नमः ॥</p><h2>सम्पूर्ण जन्म कुंडली</h2><p>${esc(ctx.name)} · ज्योतिष तर्क, लखनऊ</p><span class="sp-pill">35+ पेज · 17 अध्याय · PDF</span></div>`);
    out.push(`<div class="sp-ok"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg><div><b>आपकी कुंडली की गणना पूरी हो गई है</b><span>हर अध्याय की कुछ बातें नीचे खुली हैं — पूरी रिपोर्ट ₹${PRICE.toLocaleString("en-IN")} में, 24 घंटे के अंदर।</span></div></div>`);

    out.push(sec(1, "जन्म विवरण व अवकहड़ा चक्र", "1–2", `<div class="sp-kv">
      <div><small>नाम</small><b>${esc(ctx.name)}</b></div>
      <div><small>जन्म तिथि</small><b>${dobTxt}</b></div>
      <div><small>जन्म समय</small><b>${esc(tob || "—")}</b></div>
      <div><small>जन्म स्थान</small><b>${esc(pob || "—")}</b></div>
      ${full ? `<div><small>लग्न</small><b>${RASHI[m.ascR]}</b></div>` : ""}
      <div><small>राशि</small><b>${RASHI[m.moonR]}</b></div>
      <div><small>नक्षत्र — चरण</small><b>${NAK[m.moonNak - 1]} — ${m.moonPada}</b></div>
      ${p.tithiHi ? `<div><small>तिथि</small><b>${esc(p.tithiHi.replace(/\s*\(.*?\)/g, ""))}</b></div>` : ""}
      ${p.gana ? `<div><small>गण</small><b>${esc(hi(p.gana))}</b></div>` : ""}
      ${p.nadi ? `<div><small>नाड़ी</small><b>${esc(hi(p.nadi))}</b></div>` : ""}
      ${p.yoni ? `<div><small>योनि</small><b>${esc(hi(p.yoni))}</b></div>` : ""}
      ${m.syllable ? `<div><small>नामाक्षर</small><b>${esc(m.syllable)}</b></div>` : ""}
    </div>`));

    out.push(sec(2, "लग्न, चंद्र व नवांश कुंडली", "3–4", full
      ? `${chartSvg(m, false)}<p class="sp-t" style="text-align:center;font-size:14px;color:#6B5444;margin-top:8px">लग्न कुंडली (D1) · उत्तर भारतीय शैली · अंक = राशि</p>
         <div class="sp-2 sp-bl" aria-hidden="true">${chartSvg(m, true)}${chartSvg(m, true)}</div>${lock("नवांश (D9), चंद्र कुंडली, दशमांश (D10) व सप्तांश (D7)")}`
      : `<p class="sp-t">जन्म समय के बिना लग्न कुंडली नहीं बनती। जन्म समय डालकर कुंडली दोबारा बनाएँ, या पूरी कुंडली ऑर्डर करते समय बताएँ — ज्योतिषी जन्म-समय शोधन भी करते हैं।</p>${bars([90, 70])}`));

    const keys = ["Asc", "Sun", "Moon"].filter((k) => full || k !== "Asc");
    const rows = keys.map((k) => { const q = c[k] || {}; return `<tr><td>${PL[k]}</td><td>${RASHI[sgn(q)]}</td><td>${deg(q)}</td><td>${NAK[nakOf(q) - 1] || "—"}</td><td>${full ? (k === "Asc" ? 1 : m.house(k)) : "—"}</td></tr>`; }).join("");
    out.push(sec(3, "ग्रह स्पष्ट, भाव-स्वामी व दृष्टि", "5–6", `<table><thead><tr><th scope="col">ग्रह</th><th scope="col">राशि</th><th scope="col">अंश</th><th scope="col">नक्षत्र</th><th scope="col">भाव</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="sp-bl" aria-hidden="true"><table><tbody>${["मंगल", "बुध", "गुरु", "शुक्र", "शनि", "राहु", "केतु"].map((n) => `<tr><td>${n}</td><td>xxxx</td><td>00°00′</td><td>xxxxxx</td><td>0</td></tr>`).join("")}</tbody></table></div>
      ${lock("बाकी 7 ग्रह, उच्च-नीच, वक्री, भाव-स्वामी व ग्रह-दृष्टि")}`));

    const lagLord = full ? m.lordOf(1) : null;
    out.push(sec(4, "स्वभाव व व्यक्तित्व", "7–8", `<p class="sp-t">${full ? `लग्न <b>${RASHI[m.ascR]}</b>, लग्नेश <b>${PL[lagLord]}</b> ${ORD[m.house(lagLord)]} भाव में; मन की राशि <b>${RASHI[m.moonR]}</b> और जन्म नक्षत्र <b>${NAK[m.moonNak - 1]}</b>।` : `मन की राशि <b>${RASHI[m.moonR]}</b> और जन्म नक्षत्र <b>${NAK[m.moonNak - 1]}</b>।`}</p>${bars([94, 78, 86])}${lock("स्वभाव की ताकत, कमज़ोरियाँ और आत्मकारक का अर्थ")}`));

    const topic = (n, title, pages, k, lockTxt) => {
      const l = firstLine(k);
      return sec(n, title, pages, `${l ? `<p class="sp-t">${esc(l)}</p>` : ""}${bars([92, 74, 84])}${lock(lockTxt)}`);
    };
    out.push(topic(5, "शिक्षा व बुद्धि", "9–10", "education", "पढ़ाई के लिए अनुकूल विषय, प्रतियोगी परीक्षा व उच्च शिक्षा के योग"));
    out.push(topic(6, "करियर व व्यवसाय", "11–13", "career", "नौकरी या व्यापार, अनुकूल क्षेत्र, तरक्की और बदलाव के वर्ष"));
    out.push(topic(7, "धन व संपत्ति", "14–15", "wealth", "धन योग, बचत-निवेश की प्रवृत्ति, भूमि-वाहन के योग"));

    if (full) {
      const l7 = m.lordOf(7), h7 = m.house(l7), occ7 = m.occupants(7);
      const r7 = rashiOfHouse(m.ascR, 7);
      out.push(sec(8, "जीवनसाथी व विवाह", "16–18", `<div class="sp-kv" style="margin-bottom:10px">
          <div><small>सप्तम भाव</small><b>${RASHI[r7]} राशि</b></div>
          <div><small>सप्तमेश</small><b>${PL[l7]} · ${ORD[h7]} भाव</b></div>
          <div><small>सप्तम में ग्रह</small><b>${occ7.length ? occ7.map((k) => PL[k]).join(", ") : "कोई नहीं"}</b></div>
          <div><small>शुक्र (विवाह कारक)</small><b>${ORD[m.house("Venus")]} भाव, ${RASHI[m.sg("Venus")]}</b></div>
        </div>${firstLine("marriage") ? `<p class="sp-t">${esc(firstLine("marriage"))}</p>` : ""}${bars([90, 72, 84])}${lock("जीवनसाथी का स्वभाव, विवाह का संभावित समय, नवांश व मांगलिक विचार")}`, true));
    } else {
      out.push(sec(8, "जीवनसाथी व विवाह", "16–18", `${bars([90, 72, 84])}${lock("जन्म समय से सप्तम भाव, विवाह का समय व मांगलिक विचार")}`, true));
    }
    out.push(topic(9, "परिवार व संतान", "19", "children", "संतान योग, पंचम भाव व सप्तांश (D7) का विचार"));
    out.push(sec(10, "स्वास्थ्य, विदेश व आध्यात्मिकता", "20", `${firstLine("health") ? `<p class="sp-t">${esc(firstLine("health"))}</p>` : ""}${bars([88, 70])}${lock("ध्यान रखने योग्य वर्ष व सामान्य सावधानियाँ")}<p class="sp-t" style="font-size:13.5px;color:#6B5444;margin-top:8px">ज्योतिषीय संकेत हैं, चिकित्सा सलाह नहीं।</p>`));

    const ds = m.dasha;
    out.push(sec(11, "दशा फल व अगले 10 वर्ष (वर्षवार)", "21–25", ds && ds.md && ds.ad
      ? `<p class="sp-t">अभी चल रही: <b style="color:#7A1F1F">${PL[ds.md.lord]} महादशा</b> (${my(ds.md.start)} – ${my(ds.md.end)}) · <b style="color:#7A1F1F">${PL[ds.ad.lord]} अंतर्दशा</b> (${my(ds.ad.start)} – ${my(ds.ad.end)})</p>
         <div class="sp-bl" aria-hidden="true"><div style="display:flex;height:24px;border-radius:4px;overflow:hidden"><div style="flex:3;background:#B8892B"></div><div style="flex:1;background:#7A1F1F"></div><div style="flex:2;background:#CDB993"></div><div style="flex:3;background:#8A6416"></div></div>${bars([88, 70])}</div>${lock("आने वाली हर अंतर्दशा की तारीख, उसका फल और वर्ष-वार समय-रेखा")}`
      : `${bars([90, 70, 80])}${lock("दशा की सटीक तारीखें जन्म समय से निकलती हैं")}`));

    const ys = m.yogas || [];
    const cs = m.cons || [];
    out.push(sec(12, "योग, दोष, वर्षफल 2027 व उपाय", "26–30", `<p class="sp-t">${ys.length ? `आपकी कुंडली में <b style="color:#7A1F1F">${ys.length} शुभ योग</b> मिले — जिनमें एक <b>${esc(strip(ys[0].title))}</b> है।` : "आपकी कुंडली के योग और उनका फल पूरी रिपोर्ट में।"}${cs.length ? ` साथ ही <b>${cs.length} संवेदनशील बिंदु</b> जिन पर ध्यान देना है।` : ""}</p>${bars([72, 90, 58, 80])}${lock("सभी योगों का फल, दोष-विचार, 2027 का वर्षफल, मंत्र, दान व रत्न-विचार")}`));

    out.push(`<section class="sp-cta"><p class="k">पूरी सम्पूर्ण कुंडली — 35+ पेज, PDF में</p><p class="p">₹${PRICE.toLocaleString("en-IN")}</p>
      <ol><li>₹${PRICE.toLocaleString("en-IN")} ऑनलाइन (Card / UPI / Net Banking) या सीधे UPI से भुगतान करें</li><li>UPI से भुगतान किया हो तो स्क्रीनशॉट WhatsApp पर भेजें</li><li>24 घंटे के अंदर पूरी कुंडली PDF में पाएँ</li></ol>
      <button type="button" class="sp-btn" id="spPayBtn">₹${PRICE.toLocaleString("en-IN")} भुगतान करें</button></section>
      <div class="sp-pay" id="spPayHost" aria-live="polite"></div>
      <div class="sp-hand"><b>ज्योतिषी द्वारा हस्तनिर्मित कुंडली — ₹${HAND.toLocaleString("en-IN")}</b><p>ज्योतिषी ज्ञानेंद्र सिंह तोमर स्वयं आपकी कुंडली का अध्ययन करके लिखते हैं · 5–7 दिन में · <a href="#" id="spHandBtn">ऑर्डर करें</a></p></div>
      <p class="sp-foot">ज्योतिष मार्गदर्शन है, गारंटी नहीं। स्वास्थ्य संबंधी किसी भी विषय में डॉक्टर की सलाह सबसे पहले।</p>`);

    return { html: out.join(""), order: { name: ctx.name, dob: ctx.dob, tob: tob, pob: pob } };
  }

  // The ₹1,101 preview lives in its own workspace (#sampurnaWorkspaceContainer);
  // the free dossier only gets a small link card to it.
  function teaser() {
    let card = document.getElementById("chapter-sampurna");
    if (!card) {
      card = document.createElement("article");
      card.id = "chapter-sampurna";
      card.className = "no-print";
      card.innerHTML = `<div class="sp" style="border-width:2px"><div class="sp-ok" style="margin:14px;flex-wrap:wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg><div style="flex:1;min-width:200px"><b>आपकी सम्पूर्ण कुंडली (₹1,101) का प्रीव्यू तैयार है</b><span>35+ पेज · 17 अध्याय · 24 घंटे के अंदर PDF — अलग पेज पर देखें</span></div><button type="button" class="sp-btn" style="max-width:260px;margin:0" data-sp-open>प्रीव्यू देखें</button></div></div>`;
    }
    const dk = document.getElementById("chapter-dakshina");
    const out = document.getElementById("masterDossierOutput");
    if (dk && dk.parentNode) { if (card.nextElementSibling !== dk) dk.parentNode.insertBefore(card, dk); }
    else if (out && !card.parentNode) out.appendChild(card);
  }

  function mount(ctx) {
    const host = document.getElementById("spPreviewHost");
    if (!host) return;
    const res = build(ctx);
    if (!res) { host.innerHTML = ""; return; }
    css();
    teaser();
    host.innerHTML = `<div class="sp">${res.html}</div>`;
    const pay = host.querySelector("#spPayBtn");
    pay.addEventListener("click", () => {
      const payHost = host.querySelector("#spPayHost");
      if (!window.JTPay) { payHost.innerHTML = `<p class="sp-lock">UPI 8318513814@ptsbi पर ₹${PRICE} भेजें और स्क्रीनशॉट WhatsApp 8318513814 पर भेजें।</p>`; return; }
      const order = Object.assign({ orderId: window.JTPay.newOrderId(), amount: PRICE, payLink: PAY_LINK, product: "सम्पूर्ण कुंडली", delivery: "24 घंटे के अंदर पूरी कुंडली PDF में WhatsApp पर भेजी जाएगी।" }, res.order);
      const pl = document.getElementById("birthPlace") || { dataset: {} };
      const g = (document.getElementById("userGender") || {}).value || "";
      const u = new URLSearchParams({ jtadmin: "1", o: order.orderId, n: order.name || "", g: g, m: (document.getElementById("spMarital") || {}).value || "", d: order.dob || "", t: order.tob || "", p: order.pob || "", lat: pl.dataset.lat || "", lng: pl.dataset.lng || "" });
      order.adminLink = "https://jyotishtark.in/kundali-form.html?" + u.toString();
      window.JTPay.render(payHost, order);
      try { if (window.gtag) window.gtag("event", "begin_checkout", { value: PRICE, currency: "INR", items: [{ item_name: "Sampurna Kundali" }] }); } catch (e) { /* ignore */ }
    });
    host.querySelector("#spHandBtn").addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof window.switchWorkspaceMode === "function") window.switchWorkspaceMode("manual");
    });
    if (window.__jtWorkspace === "sampurna") {
      const ws = document.getElementById("sampurnaWorkspaceContainer");
      if (ws) ws.classList.add("sp-has-preview");
      setTimeout(() => host.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sp-open]");
    if (!b) return;
    e.preventDefault();
    if (typeof window.jtGoSampurna === "function") window.jtGoSampurna();
  });

  document.addEventListener("jt:dossier-ready", (e) => { try { mount(e.detail || window.__jyotishLastCtx); } catch (err) { console.warn("sampurna preview:", err); } });
  window.JTSampurna = { mount };
})();
