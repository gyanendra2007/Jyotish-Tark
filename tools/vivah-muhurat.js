#!/usr/bin/env node
/* ==========================================================================
   Jyotish Tark — Vivah Muhurat page for a whole year (default 2027)
   Writes vivah-muhurat-<year>.html, using the shell (header/footer) of
   vivah-muhurat-2026.html.

   Method (same rules as the 2026 page, which this script reproduces exactly
   for Nov–Dec 2026): astronomy-engine positions, Lahiri ayanamsa, minute-by-
   minute scan, Lucknow sunrise days. A minute is shubh only when ALL hold:
     - nakshatra in VIVAH_NAK, and not a gandanta pada
     - tithi not Amavasya / Krishna Chaturdashi
     - not Bhadra (Vishti karana)
     - yoga not one of the 9 ashubh yogas
     - Sun not in Dhanu / Meen (kharmas)
     - not between Devshayani and Devuthani Ekadashi (chaturmas, inclusive)
     - Jupiter > 11° and Venus > 10° from the Sun (not asta)
   Windows shorter than 30 minutes are dropped.

   Usage (repo root):  node tools/vivah-muhurat.js [year]
   Cross-checked Nov 2026 against ganeshaspeaks.com 2027 list (dates and times
   agree within minutes except where noted on the page: 6/7–12 Jul, which we
   drop because Venus is combust — also confirmed by vedicmarga.com).
   ========================================================================== */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const YEAR = Number(process.argv[2] || 2027);
vm.runInThisContext(fs.readFileSync(path.join(ROOT, "astronomy.min.js"), "utf8"));
const A = global.Astronomy;

// Devshayani / Devuthani (smarta) — same verified list as panchang-engine.js EKLIST
const CHATUR = { 2027: ["2027-07-14", "2027-11-10"] };
if (!CHATUR[YEAR]) { console.error("Add Devshayani/Devuthani dates for", YEAR); process.exit(1); }

const LOC = { lat: 26.8467, lng: 80.9462 };
const IST = 5.5 * 3600e3;
function lahiri(date) { const jd = date.getTime() / 86400000 + 2440587.5, T = (jd - 2451545) / 36525; const om = (125.04452 - 1934.136261 * T) * Math.PI / 180; return 23.853056 + (50.290966 * T * 100) / 3600 + 0.000111 * T * T + (-17.2 * Math.sin(om)) / 3600; }
const norm = (x) => ((x % 360) + 360) % 360;
const trop = (b, d) => norm(A.Ecliptic(A.GeoVector(b, d, true)).elon);
const sunS = (d) => norm(trop(A.Body.Sun, d) - lahiri(d)), moonS = (d) => norm(trop(A.Body.Moon, d) - lahiri(d));
const elong = (d) => norm(trop(A.Body.Moon, d) - trop(A.Body.Sun, d));

const NAK = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"];
const TITHI = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"];
const MON = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const MON_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const VAR = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const VIVAH_NAK = new Set([3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26]);
const BAD_YOGA = new Set([0, 5, 8, 9, 12, 14, 16, 18, 26]);
const GANDANTA = new Set([35, 71, 107, 0, 36, 72]); // pada index: last of Ashlesha/Jyeshtha/Revati, first of Ashwini/Magha/Mula

const t0 = Date.parse(`${YEAR}-01-01T00:00:00+05:30`) - 86400e3, t1 = Date.parse(`${YEAR + 1}-01-01T00:00:00+05:30`) + 86400e3;
const CH0 = Date.parse(`${CHATUR[YEAR][0]}T00:00:00+05:30`), CH1 = Date.parse(`${CHATUR[YEAR][1]}T00:00:00+05:30`) + 86400e3;

// ---- daily asta check (noon IST) ----
const astaDay = {};
for (let t = t0; t < t1; t += 86400e3) {
  const d = new Date(t + 6.5 * 3600e3);
  astaDay[Math.floor((t + IST) / 86400e3)] = { g: A.AngleFromSun(A.Body.Jupiter, d) < 11, s: A.AngleFromSun(A.Body.Venus, d) < 10 };
}
const dayKey = (t) => Math.floor((t + IST) / 86400e3);

// ---- minute scan ----
process.stderr.write("scanning " + YEAR + " … ");
const minutes = [];
let prevState = null, sankranti = [];
let prevSr = null;
for (let t = t0; t < t1; t += 60000) {
  const d = new Date(t), m = moonS(d), s = sunS(d), e = elong(d);
  const pada = Math.floor(m / (360 / 108)), ti = Math.floor(e / 12), yo = Math.floor(norm(s + m) / (360 / 27)), kar = Math.floor(e / 6), sr = Math.floor(s / 30);
  if (prevSr !== null && sr !== prevSr) sankranti.push({ t, sr });
  prevSr = sr;
  let bad = "";
  if (!VIVAH_NAK.has(pada >> 2)) bad = "nak"; else if (GANDANTA.has(pada)) bad = "gandanta";
  else if (ti === 29 || ti === 28) bad = "tithi";
  else if (sr === 8 || sr === 11) bad = "kharmas";
  else if (t >= CH0 && t < CH1) bad = "chaturmas";
  else if (astaDay[dayKey(t)].g) bad = "guru";
  else if (astaDay[dayKey(t)].s) bad = "shukra";
  else if (kar > 0 && kar < 57 && (kar - 1) % 7 === 6) bad = "bhadra";
  else if (BAD_YOGA.has(yo)) bad = "yoga";
  minutes.push({ t, ok: !bad, nak: pada >> 2, ti });
}
process.stderr.write("done\n");

// ---- windows ----
let wins = [];
for (const m of minutes) {
  if (!m.ok) continue;
  const w = wins[wins.length - 1];
  if (w && w.e === m.t) { w.e = m.t + 60000; w.nak.add(m.nak); w.ti.add(m.ti); }
  else wins.push({ s: m.t, e: m.t + 60000, nak: new Set([m.nak]), ti: new Set([m.ti]) });
}
wins = wins.filter((w) => w.e - w.s >= 30 * 60000);

// ---- Lucknow sunrises ----
const obs = new A.Observer(LOC.lat, LOC.lng, 100);
const rises = [];
for (let t = t0 - 86400e3; t < t1 + 86400e3; t += 86400e3) {
  const r = A.SearchRiseSet(A.Body.Sun, obs, +1, new Date(Date.parse(new Date(t + IST).toISOString().slice(0, 10) + "T00:00:00+05:30")), 1.5).date.getTime();
  rises.push(r);
}
function sunriseDay(t) { let r = rises[0]; for (const x of rises) { if (x <= t) r = x; else break; } return r; }
function nextRise(t) { for (const x of rises) if (x > t) return x; }

// split windows at sunrise; segment info per minute range
function info(s, e) {
  const nak = [], ti = [];
  for (const m of minutes) { if (m.t < s) continue; if (m.t >= e) break; if (m.ok) { if (!nak.includes(m.nak)) nak.push(m.nak); if (!ti.includes(m.ti)) ti.push(m.ti); } }
  return { nak, ti };
}
const days = new Map(); // key sunrise ms → {rise, next, segs:[]}
for (const w of wins) {
  let s = w.s;
  while (s < w.e) {
    const r = sunriseDay(s), nr = nextRise(s), e = Math.min(w.e, nr);
    if (e - s >= 30 * 60000) {
      if (!days.has(r)) days.set(r, { rise: r, next: nr, segs: [] });
      days.get(r).segs.push({ s, e, ...info(s, e) });
    }
    s = e;
  }
}
const list = [...days.values()].filter((d) => { const y = new Date(d.rise + IST).getUTCFullYear(); return y === YEAR; }).sort((a, b) => a.rise - b.rise);

// ---- formatting ----
const ist = (t) => new Date(t + IST);
function hm(t) { const d = ist(t + 30000); let H = d.getUTCHours(), M = d.getUTCMinutes(); const ap = H >= 12 ? "PM" : "AM"; H = H % 12 || 12; return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")} ${ap}`; }
const dnum = (t) => ist(t).getUTCDate(), mIdx = (t) => ist(t).getUTCMonth();
const civil = (t) => ist(t).toISOString().slice(0, 10);
function segText(day, sg) {
  const sameStartDay = civil(sg.s) === civil(day.rise), sameEndDay = civil(sg.e) === civil(day.rise);
  const fullDay = sg.s - day.rise < 120000 && day.next - sg.e < 120000;
  let a = hm(sg.s) + (sameStartDay ? "" : ` (${dnum(sg.s)} ${MON[mIdx(sg.s)]} की भोर)`);
  let b = hm(sg.e) + (sameEndDay || !sameStartDay ? "" : ` (${dnum(sg.e)} ${MON[mIdx(sg.e)]})`);
  return `${a} से ${b} तक` + (fullDay ? " — पूरा दिन-रात" : "");
}
function timeText(day) { return day.segs.map((sg) => segText(day, sg)).join(", फिर "); }
const nakText = (day) => [...new Set(day.segs.flatMap((s) => s.nak))].map((n) => NAK[n]).join(", ");
function tithiText(day) {
  const ts = [...new Set(day.segs.flatMap((s) => s.ti))];
  const pk = (x) => (x < 15 ? "शुक्ल" : "कृष्ण");
  if (ts.every((x) => pk(x) === pk(ts[0]))) return pk(ts[0]) + " " + ts.map((x) => TITHI[x % 15]).join(", ");
  return ts.map((x) => pk(x) + " " + TITHI[x % 15]).join(", ");
}
const hours = (day) => day.segs.reduce((a, s) => a + (s.e - s.s), 0) / 3600e3;
function tags(day, i, arr) {
  const t = [];
  const sunset = A.SearchRiseSet(A.Body.Sun, obs, -1, new Date(day.rise), 1).date.getTime();
  if (day.segs.every((s) => s.s >= sunset - 15 * 60000)) t.push("केवल रात का मुहूर्त");
  else if (day.segs.every((s) => s.e <= day.rise + 6 * 3600e3)) t.push("केवल सुबह");
  if (hours(day) < 2 && !t.length) t.push("छोटा मुहूर्त — समय पहले तय करें");
  if (i === 0) t.push("खरमास के बाद पहला मुहूर्त");
  const nx = arr[i + 1];
  if (nx && nx.rise - day.next > 25 * 86400e3) t.push("इसके बाद लंबा विराम");
  if (i > 0 && day.rise - arr[i - 1].next > 25 * 86400e3) t.push("विराम के बाद पहला मुहूर्त");
  if (i === arr.length - 1) t.push("वर्ष का अंतिम मुहूर्त");
  return t;
}

const byMonth = MON.map(() => []);
list.forEach((d, i) => byMonth[mIdx(d.rise)].push({ d, i }));
const counts = byMonth.map((x) => x.length), total = list.length;

// ---- closed periods (for the "kab nahi" section) ----
const sk = (r) => sankranti.find((x) => x.sr === r && x.t > t0 + 86400e3 && x.t < t1 - 86400e3);
const fdt = (t, withTime) => `${dnum(t)} ${MON[mIdx(t)]}` + (withTime ? ` (${hm(t)})` : "");
const S_MAKAR = sk(9), S_MEEN = sk(11), S_MESH = sk(0), S_DHANU = sk(8);
function astaRanges(key) {
  const out = []; let cur = null;
  for (const k of Object.keys(astaDay).map(Number).sort((a, b) => a - b)) {
    const v = astaDay[k][key], t = k * 86400e3 - IST;
    if (v && !cur) cur = { s: t }; if (!v && cur) { cur.e = t - 86400e3; out.push(cur); cur = null; }
  }
  return out.filter((r) => ist(r.s).getUTCFullYear() === YEAR);
}
const GA = astaRanges("g"), SA = astaRanges("s");
const fd = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MON[m - 1]}`; };

// ---- HTML ----
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const dateList = (arr) => arr.map((x) => dnum(x.d.rise)).join(", ");
function card(x) {
  const d = x.d, tg = tags(d, x.i, list);
  return `        <article class="vm-card">
          <div class="vm-date"><b>${dnum(d.rise)}</b><span>${MON[mIdx(d.rise)]}</span><small>${VAR[ist(d.rise).getUTCDay()]}</small></div>
          <dl>
            <dt>शुभ समय</dt><dd>${timeText(d)}</dd>
            <dt>नक्षत्र</dt><dd>${nakText(d)}</dd>
            <dt>तिथि</dt><dd>${tithiText(d)}</dd>
          </dl>
          ${tg.length ? `<p class="vm-tag">${tg.join(" · ")}</p>` : ""}
        </article>`;
}
const monthsWith = MON.map((m, i) => i).filter((i) => counts[i]);
const monthsWithout = MON.map((m, i) => i).filter((i) => !counts[i]);

const summary = monthsWith.map((i) => `${MON[i]} ${counts[i]}`).join(", ");
const TITLE = `विवाह मुहूर्त ${YEAR}: पूरे साल की शुभ शादी की तारीखें व समय (लखनऊ) | Jyotish Tark`;
const H1 = `विवाह मुहूर्त ${YEAR} — पूरे साल की शुभ तारीखें`;
const DESC = `विवाह मुहूर्त ${YEAR}: कुल ${total} शुभ तारीखें — ${summary}। हर तारीख का लखनऊ के अनुसार समय, नक्षत्र, तिथि, और खरमास, चातुर्मास व शुक्र अस्त के कारण कब शादी नहीं होगी।`;

const monthSecs = monthsWith.map((i) => `    <section class="rs-sec" id="${MON_EN[i]}">
      <h2>${MON[i]} ${YEAR} विवाह मुहूर्त (${counts[i]} तारीखें)</h2>
      <p class="rs-note">शुभ तारीखें: <b>${dateList(byMonth[i])} ${MON[i]}</b></p>
      <div class="vm-list">
${byMonth[i].map(card).join("\n")}
      </div>
    </section>`).join("\n\n");

const tableRows = list.map((d) => `<tr><td>${dnum(d.rise)} ${MON[mIdx(d.rise)]} ${YEAR}</td><td>${VAR[ist(d.rise).getUTCDay()]}</td><td>${timeText(d)}</td><td>${nakText(d)}</td><td>${tithiText(d)}</td></tr>`).join("");

const top2 = MON.map((m, i) => i).sort((a, b) => counts[b] - counts[a]).slice(0, 2).sort((a, b) => a - b).map((i) => MON[i]).join(" और ");
const lastPre = list.filter((d) => d.rise < CH0).pop();
const closedRaw = [
  [`1 जनवरी – ${fdt(S_MAKAR.t, true)}`, `खरमास (सूर्य धनु राशि में)। ${fdt(S_MAKAR.t)} को मकर संक्रांति के साथ खत्म।`],
  [`${fdt(S_MEEN.t, true)} – ${fdt(S_MESH.t, true)}`, `मीन खरमास (सूर्य मीन राशि में)। मेष संक्रांति के बाद ${fd(civil(byMonth[3][0].d.rise))} से मुहूर्त फिर शुरू।`],
  ...SA.map((r) => [`${fdt(r.s)} – ${fdt(r.e)}`, `शुक्र अस्त (सूर्य से 10° के भीतर)। विवाह में शुक्र का उदित होना ज़रूरी माना जाता है।`]),
  [`${fd(CHATUR[YEAR][0])} – ${fd(CHATUR[YEAR][1])}`, `चातुर्मास — देवशयनी एकादशी से देवउठनी एकादशी तक। देवउठनी के अगले दिन से शादियां फिर शुरू।`],
  ...GA.map((r) => [`${fdt(r.s)} – ${fdt(r.e)}`, `गुरु अस्त (सूर्य से 11° के भीतर)। यह समय चातुर्मास के अंदर ही पड़ता है।`]),
  [`${fdt(S_DHANU.t, true)} से`, `खरमास फिर शुरू (धनु संक्रांति), जो जनवरी ${YEAR + 1} में मकर संक्रांति तक रहेगा।`],
];

const closed = closedRaw; // already ordered below
const faq = [
  ...monthsWith.map((i) => [`${MON[i]} ${YEAR} में शादी की शुभ तारीखें कौन सी हैं?`, `${MON[i]} ${YEAR} में विवाह के ${counts[i]} शुभ मुहूर्त हैं — ${byMonth[i].map((x) => `${dnum(x.d.rise)} ${MON[i]} (${VAR[ist(x.d.rise).getUTCDay()]})`).join(", ")}।`]),
  [`अगस्त, सितंबर और अक्टूबर ${YEAR} में शादी क्यों नहीं है?`, `${fd(CHATUR[YEAR][0])} (देवशयनी एकादशी) से ${fd(CHATUR[YEAR][1])} (देवउठनी एकादशी) तक चातुर्मास है। इसी दौरान शुक्र और गुरु दोनों कुछ समय अस्त भी रहते हैं। इसलिए इन महीनों में विवाह मुहूर्त नहीं हैं।`],
  [`जुलाई ${YEAR} में कुछ पंचांग 7 से 12 जुलाई की तारीखें देते हैं, यहाँ क्यों नहीं हैं?`, `हमारी गणना में शुक्र ${fdt(SA[0].s)} से ${fdt(SA[0].e)} तक अस्त है (सूर्य से 10° के भीतर)। शुक्र अस्त में विवाह वर्जित माना जाता है, इसलिए वे तारीखें नहीं दी गईं। कुछ पंचांग शुक्र अस्त के लिए कम अंश लेते हैं, इसलिए उनकी सूची में ये दिन आ जाते हैं। ऐसे दिन चुनने से पहले अपने पंडित या ज्योतिषी से पूछ लें।`],
  [`मीन खरमास ${YEAR} कब है?`, `सूर्य ${fdt(S_MEEN.t, true)} को मीन राशि में जाएंगे और ${fdt(S_MESH.t, true)} को मेष में। इस बीच शादी के मुहूर्त नहीं हैं।`],
  [`क्या ये मुहूर्त हर शहर के लिए एक जैसे हैं?`, `तारीखें लगभग पूरे भारत में एक ही रहती हैं, पर शुरुआत और अंत का समय सूर्योदय के अनुसार शहर-शहर कुछ मिनट बदलता है। ऊपर दिए समय लखनऊ के हैं।`],
  [`क्या केवल पंचांग मुहूर्त देखकर शादी की तारीख तय कर सकते हैं?`, `पंचांग मुहूर्त पहला कदम है। अंतिम तारीख और फेरों का लग्न वर-वधू की कुंडली देखकर तय होता है — कन्या के लिए गुरु बल, वर के लिए सूर्य बल, दोनों के लिए चंद्र बल, और कुंडली मिलान।`],
];

const src = fs.readFileSync(path.join(ROOT, "vivah-muhurat-2026.html"), "utf8");
let head = src.slice(0, src.indexOf("<main"));
let tail = src.slice(src.indexOf("</main>") + 7);
const SLUG = `vivah-muhurat-${YEAR}.html`, URL = "https://jyotishtark.in/" + SLUG;
const today = new Date().toISOString().slice(0, 10);
const ld = { "@context": "https://schema.org", "@graph": [
  { "@type": "Article", headline: H1, description: DESC, inLanguage: "hi-IN", datePublished: today, dateModified: today, mainEntityOfPage: URL, image: "https://jyotishtark.in/logo.png", author: { "@type": "Person", name: "Gyanendra Singh Tomar", url: "https://jyotishtark.in/about.html" }, publisher: { "@type": "Organization", name: "Jyotish Tark", logo: { "@type": "ImageObject", url: "https://jyotishtark.in/logo.png" } } },
  { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "होम", item: "https://jyotishtark.in/" }, { "@type": "ListItem", position: 2, name: "पंचांग", item: "https://jyotishtark.in/panchang.html" }, { "@type": "ListItem", position: 3, name: `विवाह मुहूर्त ${YEAR}`, item: URL }] },
  { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
] };
head = head
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(TITLE)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(DESC)}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL}">`)
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(H1)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(DESC)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${URL}">`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
const WA = "https://wa.me/918318513814?text=" + encodeURIComponent(`नमस्ते, मुझे विवाह मुहूर्त ${YEAR} के लिए वर-वधू की कुंडली के अनुसार तारीख निकलवानी है।`);
tail = tail.replace(/https:\/\/wa\.me\/918318513814\?text=[^"]*/, WA);

const main = `<main id="main" class="rs-page fx-page">
    <nav class="rs-crumb" aria-label="Breadcrumb"><a href="https://jyotishtark.in/">होम</a> / <a href="panchang.html">पंचांग</a> / <span>विवाह मुहूर्त ${YEAR}</span></nav>

    <section class="rs-hero fx-hero">
      <div>
        <p class="rs-kicker">॥ शुभ विवाह · पूरे वर्ष के मुहूर्त ॥</p>
        <h1>विवाह मुहूर्त ${YEAR} — <span>पूरे साल की शुभ तारीखें</span></h1>
        <p class="rs-lead">${YEAR} में विवाह के लिए कुल <b>${total} शुभ तारीखें</b> हैं। ${fdt(S_MAKAR.t)} को खरमास खत्म होते ही शादियां शुरू होंगी। ${top2} में सबसे ज़्यादा मुहूर्त हैं। ${fd(civil(lastPre.rise))} के बाद शुक्र अस्त और चातुर्मास के कारण लंबा विराम रहेगा, और देवउठनी (${fd(CHATUR[YEAR][1])}) के बाद नवंबर-दिसंबर में फिर मुहूर्त हैं। नीचे हर तारीख का लखनऊ के अनुसार समय, नक्षत्र और तिथि दी गई है।</p>
        <p class="fx-date">${monthsWith.map((i) => `${MON[i]}: <b>${counts[i]}</b>`).join(" · ")}</p>
      </div>
    </section>

    <nav class="rs-toc" aria-label="इस पेज पर"><strong>इस पेज पर:</strong>${monthsWith.map((i) => `<a href="#${MON_EN[i]}">${MON[i]}</a>`).join("")}<a href="#table">पूरी सूची</a><a href="#kab-nahi">कब शादी नहीं</a><a href="#niyam">मुहूर्त कैसे चुना</a><a href="#faq">प्रश्न-उत्तर</a></nav>

${monthSecs}

    <section class="rs-sec" id="table">
      <h2>एक नज़र में — सभी ${total} मुहूर्त</h2>
      <p class="rs-note">रात 12 बजे के बाद वाला समय पंचांग में उसी दिन का माना जाता है, क्योंकि पंचांग का दिन सूर्योदय से अगले सूर्योदय तक चलता है।</p>
      <div class="vm-table-wrap">
        <table class="vm-table">
          <caption>विवाह मुहूर्त ${YEAR}, लखनऊ (IST)</caption>
          <thead><tr><th scope="col">तारीख</th><th scope="col">दिन</th><th scope="col">शुभ समय</th><th scope="col">नक्षत्र</th><th scope="col">तिथि</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </section>

    <section class="rs-sec" id="kab-nahi">
      <h2>${YEAR} में कब शादी नहीं होगी</h2>
      <p>इन अवधियों में पंचांग के अनुसार विवाह मुहूर्त नहीं बनते (समय लखनऊ के अनुसार):</p>
      <div class="vm-table-wrap">
        <table class="vm-table">
          <thead><tr><th scope="col">अवधि</th><th scope="col">कारण</th></tr></thead>
          <tbody>${closed.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <p class="rs-note">${monthsWithout.map((i) => MON[i]).join(", ")} ${YEAR} में एक भी विवाह मुहूर्त नहीं है।</p>
    </section>

    <section class="rs-sec" id="niyam">
      <h2>ये मुहूर्त कैसे निकाले गए</h2>
      <p>हर मिनट को हमारे पंचांग इंजन से लखनऊ (26.85° N, 80.95° E) के लिए लाहिड़ी अयनांश से जांचा गया है। एक समय तभी शुभ माना गया जब ये सभी शर्तें पूरी हों:</p>
      <ol class="fx-steps">
        <li><strong>शुभ नक्षत्र:</strong> रोहिणी, मृगशिरा, मघा, उत्तराफाल्गुनी, हस्त, स्वाति, अनुराधा, मूल, उत्तराषाढ़ा, उत्तराभाद्रपद या रेवती।</li>
        <li><strong>तिथि दोष नहीं:</strong> अमावस्या और कृष्ण चतुर्दशी छोड़ी गईं।</li>
        <li><strong>भद्रा (विष्टि करण) नहीं:</strong> भद्रा के समय को मुहूर्त से बाहर रखा गया।</li>
        <li><strong>अशुभ योग नहीं:</strong> व्यतीपात, वैधृति, विष्कम्भ, अतिगण्ड, शूल, गण्ड, व्याघात, वज्र और परिघ योग का समय हटाया गया।</li>
        <li><strong>गंडांत नहीं:</strong> नक्षत्रों के संधि-भाग (जैसे रेवती का अंतिम चरण, मूल का पहला चरण) छोड़े गए।</li>
        <li><strong>गुरु-शुक्र उदित, खरमास व चातुर्मास नहीं:</strong> गुरु सूर्य से 11° और शुक्र 10° से ज़्यादा दूर हों; सूर्य धनु या मीन में न हों; देवशयनी से देवउठनी तक का समय छोड़ा गया।</li>
        <li><strong>30 मिनट से छोटे समय छोड़े गए</strong>, क्योंकि उनमें फेरे पूरे करना व्यावहारिक नहीं।</li>
      </ol>
      <p class="rs-note">तारीखों की सूची को प्रकाशित पंचांगों से मिलाया गया है; ज़्यादातर तारीखें और समय कुछ मिनट के अंतर से मेल खाते हैं। अलग-अलग परंपराओं में नियम थोड़े अलग होते हैं, इसलिए किसी दूसरे पंचांग में एक-दो तारीख कम या ज़्यादा दिख सकती है।</p>
    </section>

    <section class="rs-sec" id="kundali">
      <h2>अपनी कुंडली के अनुसार सही तारीख कैसे चुनें</h2>
      <p>ऊपर दिए मुहूर्त सबके लिए सामान्य हैं। इनमें से आपके लिए कौन सी तारीख सबसे अच्छी है, यह वर और कन्या की कुंडली से तय होता है:</p>
      <div class="fx-two">
        <div class="rs-card"><h3>कुंडली में क्या देखा जाता है</h3><ul><li>कन्या के लिए गुरु बल, वर के लिए सूर्य बल</li><li>दोनों के लिए उस दिन का चंद्र बल और तारा बल</li><li>फेरों के लिए स्थिर या शुभ लग्न का सटीक समय</li><li><a href="kundali-milan.html">अष्टकूट गुण मिलान</a>, मंगल दोष और नाड़ी दोष</li></ul></div>
        <div class="rs-card"><h3>व्यावहारिक सुझाव</h3><ul><li>मई-जून के मुहूर्तों पर भीड़ ज़्यादा रहेगी — वेन्यू और पंडित कुछ महीने पहले बुक करें</li><li>छोटे मुहूर्त (1–3 घंटे) में फेरे का समय पहले तय कर लें</li><li>रात के मुहूर्त में फेरे भोर से पहले पूरे होने चाहिए</li></ul></div>
      </div>
    </section>

    <section class="rs-sec" id="faq">
      <h2>अक्सर पूछे जाने वाले प्रश्न</h2>
      <div class="rs-faq">
        ${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
      </div>
    </section>

    <section class="rs-band" aria-label="परामर्श">
      <div>
        <h2>वर-वधू की कुंडली से विवाह की तारीख निकलवाएं</h2>
        <p>दोनों की जन्म तिथि, समय और स्थान भेजें। ज्योतिषी ज्ञानेंद्र सिंह तोमर स्वयं कुंडली मिलान करके इन मुहूर्तों में से आपके लिए सबसे उपयुक्त तारीख और फेरों का लग्न बताएंगे।</p>
      </div>
      <div class="rs-row">
        <a class="rs-btn ivory" href="kundali-milan.html">मुफ़्त कुंडली मिलान</a>
        <a class="rs-btn ghost" href="${WA}" target="_blank" rel="noopener">तारीख निकलवाएं</a>
      </div>
    </section>

    <section class="rs-sec" aria-labelledby="rel">
      <h2 id="rel">यह भी देखें</h2>
      <div class="fx-days">
        <a href="vivah-muhurat-2026.html"><span class="fx-d">नवंबर–दिसंबर 2026</span><b>विवाह मुहूर्त 2026</b><small>इस साल की बची तारीखें</small></a>
        <a href="kundali-milan.html"><span class="fx-d">मुफ़्त टूल</span><b>कुंडली मिलान</b><small>36 गुण, मंगल व नाड़ी दोष</small></a>
        <a href="griha-pravesh-muhurat-${YEAR}.html"><span class="fx-d">पूरा वर्ष</span><b>गृह प्रवेश मुहूर्त ${YEAR}</b><small>नए घर के शुभ दिन</small></a>
        <a href="shubh-muhurat-${YEAR}.html"><span class="fx-d">सभी मुहूर्त</span><b>शुभ मुहूर्त ${YEAR}</b><small>विवाह, गृह प्रवेश, वाहन</small></a>
        <a href="mangal-dosha-nivaran.html"><span class="fx-d">लेख</span><b>मंगल दोष</b><small>पहचान और सही उपाय</small></a>
      </div>
      <p class="rs-updated">लेखक: <a href="about.html">ज्योतिषी ज्ञानेंद्र सिंह तोमर</a>, Jyotish Tark, लखनऊ · अपडेट: ${Number(today.slice(8))} ${MON[Number(today.slice(5, 7)) - 1]} ${today.slice(0, 4)} · समय लखनऊ (IST) के लिए, लाहिड़ी अयनांश। रोज़ का <a href="panchang.html">पंचांग यहाँ देखें</a>।</p>
    </section>
  </main>`;

fs.writeFileSync(path.join(ROOT, SLUG), head + main + tail);
console.log("wrote", SLUG, "—", total, "dates:", summary);
