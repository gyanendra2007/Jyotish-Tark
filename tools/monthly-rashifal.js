#!/usr/bin/env node
/* ==========================================================================
   Jyotish Tark — monthly rashifal generator
   Writes ../masik-rashifal-<month>-<year>.html for the given month, from the
   real sidereal planet positions (same engine and same gochar rules as the
   weekly rashifal in tools/weekly-rashifal.js).

   Usage (from the repo root):
     ASTRO_JS=astronomy.min.js node tools/monthly-rashifal.js 2026-12
   Then add the page to sitemap.xml and rashifal.html, review, commit, push.
   ========================================================================== */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");

// reuse the weekly generator's engine set-up, names and gochar rules (everything before its "week" section)
const WSRC = fs.readFileSync(path.join(__dirname, "weekly-rashifal.js"), "utf8");
const PREFIX = WSRC.slice(WSRC.indexOf('const fs = require'), WSRC.indexOf("// ---------- week ----------")).replace('const fs = require("fs"), path = require("path"), vm = require("vm");', "").replace('const ROOT = path.resolve(__dirname, "..");', "");
global.require = require; global.__dirname = __dirname; global.fs = fs; global.path = path; global.vm = vm; global.ROOT = ROOT; global.process = process;
vm.runInThisContext(PREFIX + "\n;globalThis.__W = { K, LKO, RASHI, RASHI_EN, SYM, PAGE2027, PN, MON, COLOR, NUM, ov, hFrom, FAV, W, fav, GEN, LOVEV, REM };", { filename: "weekly-prefix.js" });
const { K, LKO, RASHI, RASHI_EN, SYM, PAGE2027, PN, MON, COLOR, NUM, ov, hFrom, FAV, W, fav, GEN, LOVEV, REM } = globalThis.__W;

const MON_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const MON_EN_T = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const arg = process.argv[2] || new Date().toISOString().slice(0, 7);
const [Y, M] = arg.split("-").map(Number);
const nDays = new Date(Date.UTC(Y, M, 0)).getUTCDate();
const days = [...Array(nDays)].map((_, i) => new Date(Date.UTC(Y, M - 1, i + 1)));
const iso = (t) => t.toISOString().slice(0, 10);
const at = (t, hh) => K.compute({ dob: iso(t), time: hh, ...LKO }).planets;
const dl = (t) => `${t.getUTCDate()} ${MON[t.getUTCMonth()]}`;
const monthName = `${MON[M - 1]} ${Y}`;

// ---------- the sky this month ----------
const PL = ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"];
const noon = days.map((t) => at(t, "12:00"));
const prev = at(new Date(days[0].getTime() - 864e5), "12:00");
const events = [];      // {p, day(index), to(sign) | retro}
PL.forEach((p) => {
  let a = prev[p];
  noon.forEach((P, i) => {
    const b = P[p];
    if (b.sign !== a.sign) {
      let lo = new Date(days[i].getTime() - 12 * 36e5), hi = new Date(days[i].getTime() + 12 * 36e5);
      for (let k = 0; k < 7; k++) { const md = new Date((lo.getTime() + hi.getTime()) / 2); const hh = String(md.getUTCHours()).padStart(2, "0") + ":" + String(md.getUTCMinutes()).padStart(2, "0"); if (at(md, hh)[p].sign === b.sign) hi = md; else lo = md; }
      events.push({ p, i: hi.getUTCDate() - 1, from: a.sign, to: b.sign, date: hi, txt: `${dl(hi)} — ${PN[p]} ${RASHI[b.sign - 1]} राशि में प्रवेश करेंगे` });
    }
    if (p !== "Rahu" && b.retro !== a.retro) events.push({ p, i, retro: b.retro, txt: `${dl(days[i])} — ${PN[p]} ${b.retro ? "वक्री" : "मार्गी"} होंगे (${RASHI[b.sign - 1]} राशि में)` });
    a = b;
  });
});
events.sort((x, y) => x.i - y.i);
const first = noon[0], last = noon[nDays - 1], mid = noon[14];
const sky = PL.map((p) => `${PN[p]} — ${RASHI[first[p].sign - 1]}${first[p].sign !== last[p].sign ? ` → ${RASHI[last[p].sign - 1]}` : ""}${mid[p].retro && p !== "Rahu" ? " (वक्री)" : ""}`).concat([`केतु — ${RASHI[mid.Ketu.sign - 1]}`]);

// Moon sign each day at 06:00 IST
const moon = days.map((t) => ({ t, sign: at(t, "06:00").Moon.sign }));
const ranges = (list) => {   // consecutive days → "3–5 दिसंबर"
  const out = []; let s = null, p = null;
  list.forEach((x) => { const d = x.t.getUTCDate(); if (s !== null && d === p + 1) { p = d; } else { if (s !== null) out.push([s, p]); s = d; p = d; } });
  if (s !== null) out.push([s, p]);
  return out.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`) + ` ${MON[M - 1]}`);
};

// ---------- per rashi ----------
function phase(R, p) {     // a fast planet that changes sign this month: before / after
  const e = events.find((x) => x.p === p && x.to);
  const h0 = hFrom(R, first[p].sign);
  if (!e) return `${PN[p]} पूरे महीने ${ov(h0)} भाव में — ${GEN[p][h0 - 1]}।`;
  const h1 = hFrom(R, e.to);
  return `${dl(e.date)} तक ${PN[p]} ${ov(h0)} भाव में (${GEN[p][h0 - 1]}), फिर ${ov(h1)} भाव में — ${GEN[p][h1 - 1]}।`;
}
function forRashi(R) {
  const H = {}; [...PL, "Ketu"].forEach((p) => { H[p] = hFrom(R, mid[p].sign); });
  let score = 0;
  Object.keys(W).forEach((p) => { score += (fav(p, H[p]) ? 1 : -1) * W[p]; });
  const stars = Math.max(2, Math.min(5, Math.round(3 + score / 6)));
  const md = moon.map((x) => ({ ...x, h: hFrom(R, x.sign) }));
  const ch8 = md.filter((x) => x.h === 8);
  const order = { 11: 6, 10: 5, 1: 4, 7: 3, 3: 2, 6: 1 };
  const good = md.filter((x) => order[x.h]).sort((a, b) => (order[b.h] - order[a.h]) || (a.t - b.t)).slice(0, 6).sort((a, b) => a.t - b.t);

  const g = [phase(R, "Sun"),
    `पूरे महीने की पृष्ठभूमि में ${PN.Jupiter} ${ov(H.Jupiter)} भाव (${GEN.Jupiter[H.Jupiter - 1]}) और ${PN.Saturn} ${ov(H.Saturn)} भाव (${GEN.Saturn[H.Saturn - 1]})।`,
    `राहु ${ov(H.Rahu)} भाव में — ${GEN.Rahu[H.Rahu - 1]}।`].join(" ");
  const career = [phase(R, "Mercury"), (fav("Saturn", H.Saturn) ? "मेहनत का फल धीरे-धीरे पर पक्का मिलेगा।" : "काम में धैर्य रखें; जल्दबाज़ी में बड़े बदलाव से बचें।")].join(" ");
  const monP = ["Jupiter", "Venus", "Mercury"].find((p) => [2, 11].includes(H[p]));
  const expP = ["Mars", "Sun", "Rahu", "Saturn"].find((p) => [12, 8, 2].includes(H[p]));
  const money = `${phase(R, "Mars")} ${monP ? `${PN[monP]} ${ov(H[monP])} भाव से धन के मामलों में सहारा मिलेगा।` : expP ? `${PN[expP]} ${ov(H[expP])} भाव में होने से ख़र्च पर नज़र रखें।` : "आय-व्यय सामान्य रहेगा; बचत की योजना बनाएँ।"}`;
  const loveBad = ["Mars", "Rahu", "Saturn"].find((p) => [5, 7].includes(H[p]));
  const ve = events.find((x) => x.p === "Venus" && x.to);
  const love = ve ? `${dl(ve.date)} तक ${PN.Venus} ${ov(hFrom(R, first.Venus.sign))} भाव में (${LOVEV[hFrom(R, first.Venus.sign) - 1]}), फिर ${ov(hFrom(R, ve.to))} भाव में — ${LOVEV[hFrom(R, ve.to) - 1]}।` : `${PN.Venus} ${ov(H.Venus)} भाव में — ${LOVEV[H.Venus - 1]}।`;
  const loveX = loveBad ? ` ${PN[loveBad]} ${ov(H[loveBad])} भाव में होने से रिश्तों में धैर्य और साफ़ बातचीत रखें।` : "";
  const hp = ["Mars", "Saturn", "Sun", "Rahu"].find((p) => [1, 8, 12, 6].includes(H[p]) && !fav(p, H[p]));
  const BODY = { Mars: "चोट, बुखार और रक्तचाप", Saturn: "जोड़ों, कमर और थकान", Sun: "आँखों, सिर और ऊर्जा", Rahu: "नींद, पेट और बेचैनी" };
  const health = `${hp ? `${PN[hp]} ${ov(H[hp])} भाव में — ${BODY[hp]} पर ध्यान दें। ` : "सेहत सामान्य रहेगी। "}नींद, पानी और नियमित दिनचर्या बनाए रखें; कोई तकलीफ़ हो तो डॉक्टर से मिलें।`;
  const weak = ["Saturn", "Jupiter", "Rahu", "Mars", "Sun", "Mercury", "Venus"].find((p) => !fav(p, H[p])) || "Jupiter";
  const L = LORD[R - 1];
  return { R, stars, g, career, money, love: love + loveX, health, good: good.map((x) => dl(x.t)), caution: ranges(ch8), color: COLOR[L], num: NUM[L], remedy: `${REM[weak]} (${PN[weak]} ${ov(H[weak])} भाव में)` };
}
const out = [...Array(12)].map((_, i) => forRashi(i + 1));

// ---------- page ----------
const SRC = fs.readFileSync(path.join(ROOT, "kp-astrology.html"), "utf8");
const HEAD_TOP = SRC.slice(0, SRC.indexOf("<title>"));
const HEADER = SRC.slice(SRC.indexOf('<header class="jt-header'), SRC.indexOf("</header>") + 9).replace(/ aria-current="page"/g, "");
const FOOTER = SRC.slice(SRC.indexOf('<footer class="jt-footer'), SRC.indexOf("</footer>") + 9);
const ICONS = SRC.split("\n").filter((l) => /rel="icon"|apple-touch-icon/.test(l)).map((l) => l.trim()).join("\n");
const SITEJS = (SRC.match(/jt-site\.js\?v=\d+/) || ["jt-site.js?v=1"])[0];
const THEME = (SRC.match(/jt-theme\.css\?v=\d+/) || ["jt-theme.css?v=1"])[0];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const slug = `masik-rashifal-${MON_EN[M - 1]}-${Y}`;
const url = `https://jyotishtark.in/${slug}.html`;
const title = `मासिक राशिफल ${monthName} — सभी 12 राशियाँ | ${MON_EN_T[M - 1]} ${Y} Rashifal | Jyotish Tark`;
const desc = `${monthName} का मासिक राशिफल: मेष से मीन तक सभी 12 राशियों का करियर, धन, प्रेम, सेहत, शुभ तिथियाँ, सावधानी के दिन और उपाय — इस महीने के वास्तविक ग्रह-गोचर से।`;
const FAQ = [
  ["मासिक राशिफल किस राशि से देखें?", "वैदिक ज्योतिष में राशिफल चंद्र राशि (जन्म राशि) से देखा जाता है। अपनी चंद्र राशि न पता हो तो <a href=\"kundali-form.html\">मुफ़्त कुंडली</a> बनाकर देख लें।"],
  ["यह राशिफल कैसे बनता है?", `${monthName} के वास्तविक ग्रह-गोचर से (KP अयनांश, लखनऊ के समय से): सूर्य, बुध, शुक्र, मंगल के राशि-परिवर्तन की तारीख़ें, गुरु-शनि-राहु की स्थिति, और हर दिन चंद्रमा की राशि। हर ग्रह का फल आपकी राशि से उसके भाव के शास्त्रीय गोचर नियमों से लिखा गया है।`],
  ["सावधानी के दिन क्या हैं?", "जब चंद्रमा आपकी राशि से आठवें भाव में होता है (चंद्राष्टम), परंपरा में उन दिनों बड़े नए काम, यात्रा या विवाद टालने की सलाह दी जाती है।"],
  ["क्या यह सबके लिए एक जैसा सही होगा?", "यह राशि पर आधारित सामान्य फल है। व्यक्तिगत फल आपकी पूरी कुंडली, दशा और लग्न पर निर्भर करता है — इसे मार्गदर्शन मानें, गारंटी नहीं।"]
];
const ld = { "@context": "https://schema.org", "@graph": [
  { "@type": "Article", "headline": `मासिक राशिफल ${monthName}`, "description": desc, "inLanguage": "hi-IN", "datePublished": iso(new Date()), "dateModified": iso(new Date()), "author": { "@type": "Person", "name": "Gyanendra Singh Tomar" }, "publisher": { "@type": "Organization", "name": "Jyotish Tark", "logo": { "@type": "ImageObject", "url": "https://jyotishtark.in/logo.png" } }, "mainEntityOfPage": url },
  { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jyotishtark.in/" }, { "@type": "ListItem", "position": 2, "name": "राशिफल", "item": "https://jyotishtark.in/rashifal.html" }, { "@type": "ListItem", "position": 3, "name": `मासिक राशिफल ${monthName}`, "item": url }] },
  { "@type": "FAQPage", "mainEntity": FAQ.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a.replace(/<[^>]+>/g, "") } })) }] };
const st = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const card = (r) => `<article class="wr-card" id="${RASHI_EN[r.R - 1].toLowerCase()}">
  <header><span class="wr-sym" aria-hidden="true">${SYM[r.R - 1]}</span><div><h2>${RASHI[r.R - 1]} राशिफल ${MON[M - 1]} <small>${RASHI_EN[r.R - 1]}</small></h2><span class="wr-st" aria-label="${r.stars} में से 5">${st(r.stars)}</span></div></header>
  <p>${r.g}</p>
  <dl><dt>💼 करियर</dt><dd>${r.career}</dd><dt>💰 धन</dt><dd>${r.money}</dd><dt>❤️ प्रेम व परिवार</dt><dd>${r.love}</dd><dt>🩺 सेहत</dt><dd>${r.health}</dd></dl>
  <ul class="wr-mini"><li><b>शुभ तिथियाँ:</b> ${r.good.join(", ") || "—"}</li>${r.caution.length ? `<li><b>सावधानी (चंद्राष्टम):</b> ${r.caution.join(", ")}</li>` : ""}<li><b>शुभ रंग:</b> ${r.color}</li><li><b>शुभ अंक:</b> ${r.num}</li></ul>
  <p class="wr-rem"><b>उपाय:</b> ${r.remedy}</p>
  <p class="wr-more"><a href="${PAGE2027[r.R - 1]}-rashifal-2027.html">${RASHI[r.R - 1]} राशिफल 2027 →</a></p>
</article>`;
const html = `${HEAD_TOP}<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="मासिक राशिफल ${monthName}, ${MON[M - 1]} राशिफल ${Y}, ${MON_EN[M - 1]} rashifal ${Y}, masik rashifal, monthly horoscope hindi, ${RASHI.map((r) => r + " राशिफल " + MON[M - 1]).join(", ")}">
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
    .wr-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin:10px 0 24px}
    .wr-card{background:#fff;border:1px solid var(--ln);border-radius:18px;padding:18px;scroll-margin-top:90px}
    .wr-card header{display:flex;gap:12px;align-items:center;margin-bottom:.4rem}
    .wr-sym{width:52px;height:52px;border-radius:50%;background:var(--mr);color:#F5C46B;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex:0 0 52px}
    .wr-card h2{font-size:1.35rem;margin:0;color:var(--mrd)}.wr-card h2 small{font-size:.9rem;color:var(--mu);font-family:'Mukta',sans-serif}
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
    <nav class="wr-crumb" aria-label="Breadcrumb"><a href="index.html">होम</a> / <a href="rashifal.html">राशिफल</a> / मासिक राशिफल ${monthName}</nav>
    <h1>मासिक राशिफल: ${monthName}</h1>
    <p>${monthName} के वास्तविक ग्रह-गोचर से सभी 12 राशियों का फल — करियर, धन, प्रेम, सेहत, शुभ तिथियाँ, सावधानी के दिन और उपाय। अपनी चंद्र राशि (जन्म राशि) चुनें।</p>
    <nav class="wr-jump" aria-label="राशि चुनें">${RASHI.map((r, i) => `<a href="#${RASHI_EN[i].toLowerCase()}">${SYM[i]} ${r}</a>`).join("")}</nav>
  </div></section>
  <div class="wr-wrap">
    <div class="wr-box"><h2>${MON[M - 1]} में ग्रहों की चाल</h2>
      ${events.length ? `<ul>${events.map((e) => `<li><b>${e.txt}</b></li>`).join("")}</ul>` : "<p>इस महीने कोई बड़ा ग्रह राशि नहीं बदल रहा।</p>"}
      <p style="margin:.4rem 0"><b>महीने भर ग्रहों की स्थिति:</b> ${sky.join(" · ")}</p>
    </div>
    <div class="wr-grid">${out.map(card).join("")}</div>
    <div class="wr-cta"><b>अपनी कुंडली के अनुसार सटीक भविष्य?</b> राशिफल सबके लिए एक जैसा होता है; आपकी दशा और ग्रह अलग हैं। <a href="kundali-form.html">मुफ़्त कुंडली बनाएँ</a> · <a href="mera-2027.html">वर्षफल 2027 रिपोर्ट</a> · <a href="weekly-rashifal.html">साप्ताहिक राशिफल</a></div>
    <div class="wr-faq"><h2 style="font-size:1.4rem;color:#5A1414">अक्सर पूछे जाने वाले प्रश्न</h2>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    <p style="font-size:14px;color:#6B5444;margin:16px 0 28px">यह राशिफल चंद्र राशि से गोचर (KP अयनांश, लखनऊ के समय) पर आधारित सामान्य मार्गदर्शन है, गारंटी नहीं। स्वास्थ्य, धन या कानूनी बड़े निर्णयों में विशेषज्ञ की सलाह लें।</p>
  </div>
</main>
${FOOTER}
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, slug + ".html"), html);
console.log(slug + ".html written | events:", events.length);
events.forEach((e) => console.log("  ", e.txt));
out.forEach((r) => console.log(RASHI[r.R - 1], r.stars, "| good:", r.good.join(", "), "| caution:", r.caution.join(", ")));
