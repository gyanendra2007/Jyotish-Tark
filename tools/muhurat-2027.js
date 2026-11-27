#!/usr/bin/env node
/* ==========================================================================
   Jyotish Tark — Griha Pravesh + Vahan Kharid muhurat pages and the
   "Shubh Muhurat <year>" hub. Uses tools/muhurat-core.js.

   Usage (repo root):  node tools/muhurat-2027.js [year]
   Writes griha-pravesh-muhurat-<y>.html, vahan-kharid-muhurat-<y>.html,
   shubh-muhurat-<y>.html (hub also lists vivah-muhurat-<y>.html).

   Cross-checked Nov 2026 with ganeshaspeaks.com 2027 lists: every griha
   pravesh date of theirs that falls outside kharmas, chaturmas and Paush
   (amanta) — the periods their own page says to avoid — matches ours,
   apart from tithi-rule differences (e.g. 27 Feb ashtami). Vehicle dates
   overlap heavily; they allow all weekdays, we use Mon/Wed/Thu/Fri.
   ========================================================================== */
"use strict";
const fs = require("fs"), path = require("path");
const C = require("./muhurat-core.js");
const { MON, MON_EN, VAR, NAK, ROOT } = C;
const YEAR = Number(process.argv[2] || 2027);
if (!C.CHATUR[YEAR]) { console.error("Add chaturmas dates for", YEAR, "in muhurat-core.js"); process.exit(1); }

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const today = new Date(Date.now() + C.IST).toISOString().slice(0, 10);
const todayHi = `${Number(today.slice(8))} ${MON[Number(today.slice(5, 7)) - 1]} ${today.slice(0, 4)}`;
const WA = (msg) => "https://wa.me/918318513814?text=" + encodeURIComponent(msg);
const nakNames = (ids) => ids.map((i) => NAK[i]).join(", ");
const TI_NAMES = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"];

// ---------- shell from the vivah 2026 page ----------
const SRC = fs.readFileSync(path.join(ROOT, "vivah-muhurat-2026.html"), "utf8");
function shell({ slug, title, h1, desc, crumb, faq, waMsg }) {
  const URL = "https://jyotishtark.in/" + slug;
  let head = SRC.slice(0, SRC.indexOf("<main")), tail = SRC.slice(SRC.indexOf("</main>") + 7);
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: h1, description: desc, inLanguage: "hi-IN", datePublished: today, dateModified: today, mainEntityOfPage: URL, image: "https://jyotishtark.in/logo.png", author: { "@type": "Person", name: "Gyanendra Singh Tomar", url: "https://jyotishtark.in/about.html" }, publisher: { "@type": "Organization", name: "Jyotish Tark", logo: { "@type": "ImageObject", url: "https://jyotishtark.in/logo.png" } } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "होम", item: "https://jyotishtark.in/" }, { "@type": "ListItem", position: 2, name: "पंचांग", item: "https://jyotishtark.in/panchang.html" }, { "@type": "ListItem", position: 3, name: crumb, item: URL }] },
    ...(faq && faq.length ? [{ "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) }] : []),
  ] };
  head = head
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(h1)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${URL}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  tail = tail.replace(/https:\/\/wa\.me\/918318513814\?text=[^"]*/, WA(waMsg));
  return (main) => head + main + tail;
}

// ---------- shared pieces ----------
function tagsFor(d, i, list, obs) {
  const t = [];
  const sunset = C.A.SearchRiseSet(C.A.Body.Sun, obs, -1, new Date(d.rise), 1).date.getTime();
  if (d.segs.every((s) => s.s >= sunset - 15 * 60000)) t.push("केवल रात का समय");
  else if (d.segs.every((s) => s.e <= d.rise + 6 * 3600e3)) t.push("केवल सुबह");
  if (C.hours(d) < 2 && !t.length) t.push("छोटा मुहूर्त — समय पहले तय करें");
  if (C.hours(d) >= 20) t.push("लगभग पूरा दिन");
  const nx = list[i + 1];
  if (nx && nx.rise - d.next > 25 * 86400e3) t.push("इसके बाद लंबा विराम");
  if (i > 0 && d.rise - list[i - 1].next > 25 * 86400e3) t.push("विराम के बाद पहला मुहूर्त");
  return t;
}
function card(d, i, list, obs) {
  const tg = tagsFor(d, i, list, obs);
  return `        <article class="vm-card">
          <div class="vm-date"><b>${C.dnum(d.rise)}</b><span>${MON[C.mIdx(d.rise)]}</span><small>${VAR[C.ist(d.rise).getUTCDay()]}</small></div>
          <dl>
            <dt>शुभ समय</dt><dd>${C.timeText(d)}</dd>
            <dt>नक्षत्र</dt><dd>${C.nakText(d)}</dd>
            <dt>तिथि</dt><dd>${C.tithiText(d)}</dd>
          </dl>
          ${tg.length ? `<p class="vm-tag">${tg.join(" · ")}</p>` : ""}
        </article>`;
}
function monthData(list) {
  const by = MON.map(() => []);
  list.forEach((d, i) => by[C.mIdx(d.rise)].push({ d, i }));
  return { by, counts: by.map((x) => x.length), withM: MON.map((m, i) => i).filter((i) => by[i].length), without: MON.map((m, i) => i).filter((i) => !by[i].length) };
}
function monthSections(list, M, label) {
  const obs = C.base(YEAR).obs;
  return M.withM.map((i) => `    <section class="rs-sec" id="${MON_EN[i]}">
      <h2>${MON[i]} ${YEAR} ${label} (${M.counts[i]} ${M.counts[i] === 1 ? "तारीख" : "तारीखें"})</h2>
      <p class="rs-note">शुभ तारीखें: <b>${M.by[i].map((x) => C.dnum(x.d.rise)).join(", ")} ${MON[i]}</b></p>
      <div class="vm-list">
${M.by[i].map((x) => card(x.d, x.i, list, obs)).join("\n")}
      </div>
    </section>`).join("\n\n");
}
function fullTable(list, caption) {
  return `      <div class="vm-table-wrap">
        <table class="vm-table">
          <caption>${caption}</caption>
          <thead><tr><th scope="col">तारीख</th><th scope="col">दिन</th><th scope="col">शुभ समय</th><th scope="col">नक्षत्र</th><th scope="col">तिथि</th></tr></thead>
          <tbody>${list.map((d) => `<tr><td>${C.dnum(d.rise)} ${MON[C.mIdx(d.rise)]} ${YEAR}</td><td>${VAR[C.ist(d.rise).getUTCDay()]}</td><td>${C.timeText(d)}</td><td>${C.nakText(d)}</td><td>${C.tithiText(d)}</td></tr>`).join("")}</tbody>
        </table>
      </div>`;
}
const faqHtml = (faq) => `    <section class="rs-sec" id="faq">
      <h2>अक्सर पूछे जाने वाले प्रश्न</h2>
      <div class="rs-faq">
        ${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n        ")}
      </div>
    </section>`;
function band(h, p, waMsg, btn) {
  return `    <section class="rs-band" aria-label="परामर्श">
      <div>
        <h2>${h}</h2>
        <p>${p}</p>
      </div>
      <div class="rs-row">
        <a class="rs-btn ivory" href="${WA(waMsg)}" target="_blank" rel="noopener">${btn}</a>
        <a class="rs-btn ghost" href="panchang.html">आज का पंचांग</a>
      </div>
    </section>`;
}
const seeAlso = (cards) => `    <section class="rs-sec" aria-labelledby="rel">
      <h2 id="rel">यह भी देखें</h2>
      <div class="fx-days">
        ${cards.map(([href, d, b, s]) => `<a href="${href}"><span class="fx-d">${d}</span><b>${b}</b><small>${s}</small></a>`).join("\n        ")}
      </div>
      <p class="rs-updated">लेखक: <a href="about.html">ज्योतिषी ज्ञानेंद्र सिंह तोमर</a>, Jyotish Tark, लखनऊ · अपडेट: ${todayHi} · समय लखनऊ (IST) के लिए, लाहिड़ी अयनांश। रोज़ का <a href="panchang.html">पंचांग यहाँ देखें</a>।</p>
    </section>`;
const hero = (kicker, h1a, h1b, lead, M) => `    <section class="rs-hero fx-hero">
      <div>
        <p class="rs-kicker">${kicker}</p>
        <h1>${h1a} — <span>${h1b}</span></h1>
        <p class="rs-lead">${lead}</p>
        <p class="fx-date">${M.withM.map((i) => `${MON[i]}: <b>${M.counts[i]}</b>`).join(" · ")}</p>
      </div>
    </section>`;
const toc = (M, extra) => `    <nav class="rs-toc" aria-label="इस पेज पर"><strong>इस पेज पर:</strong>${M.withM.map((i) => `<a href="#${MON_EN[i]}">${MON[i]}</a>`).join("")}${extra.map(([h, t]) => `<a href="#${h}">${t}</a>`).join("")}</nav>`;
const crumbNav = (name) => `    <nav class="rs-crumb" aria-label="Breadcrumb"><a href="https://jyotishtark.in/">होम</a> / <a href="shubh-muhurat-${YEAR}.html">शुभ मुहूर्त ${YEAR}</a> / <span>${name}</span></nav>`;

// key periods
const S_MAKAR = C.sankrantiOf(YEAR, 9), S_MEEN = C.sankrantiOf(YEAR, 11), S_MESH = C.sankrantiOf(YEAR, 0), S_DHANU = C.sankrantiOf(YEAR, 8);
const GA = C.astaRanges(YEAR, "g"), SA = C.astaRanges(YEAR, "s");
const CH = C.CHATUR[YEAR];
const masaStart = (idx) => { const B = C.base(YEAR); const m = B.minutes.find((x) => x.masa === idx && C.ist(x.t).getUTCFullYear() === YEAR); return m && m.t; };
const masaEnd = (idx) => { const B = C.base(YEAR); let last = null; for (const x of B.minutes) if (x.masa === idx && C.ist(x.t).getUTCFullYear() === YEAR && (!last || x.t - last < 3 * 86400e3)) last = x.t; return last; };

// ======================= GRIHA PRAVESH =======================
const G_NAK = [3, 4, 11, 13, 16, 20, 25, 26], G_TI = [1, 2, 4, 6, 9, 10, 11, 12];
const GR = { nak: new Set(G_NAK), tithi: (t) => G_TI.includes(t % 15), vara: (d) => d !== 0 && d !== 2, masa: (m) => m !== 9, kharmas: 1, chaturmas: 1, asta: 1, bhadra: 1, yoga: 1, gandanta: 1 };
const GL = C.compute(YEAR, GR), GM = monthData(GL);
{
  const slug = `griha-pravesh-muhurat-${YEAR}.html`;
  const total = GL.length;
  const summary = GM.withM.map((i) => `${MON[i]} ${GM.counts[i]}`).join(", ");
  const top = [...GM.withM].sort((a, b) => GM.counts[b] - GM.counts[a])[0];
  const first = GL[0], lastPre = GL.filter((d) => C.civil(d.rise) < CH[0]).pop();
  const paushEnd = masaEnd(9) && C.civil(masaEnd(9)) < `${YEAR}-03-01` ? masaEnd(9) : null;
  const closed = [
    [`1 जनवरी – ${C.fdt(S_MAKAR.t, true)}`, "खरमास (सूर्य धनु राशि में)।"],
    ...(paushEnd ? [[`${C.fdt(S_MAKAR.t)} – ${C.fdt(paushEnd)}`, "पौष मास (अमांत) — परंपरा में नए घर में प्रवेश के लिए पौष मास वर्जित माना जाता है, इसलिए खरमास खत्म होने के बाद भी कुछ दिन रुकना होता है।"]] : []),
    [`${C.fdt(S_MEEN.t, true)} – ${C.fdt(S_MESH.t, true)}`, "मीन खरमास (सूर्य मीन राशि में)।"],
    ...SA.map((r) => [`${C.fdt(r.s)} – ${C.fdt(r.e)}`, "शुक्र अस्त (सूर्य से 10° के भीतर)।"]),
    [`${C.fd(CH[0])} – ${C.fd(CH[1])}`, "चातुर्मास — देवशयनी से देवउठनी एकादशी तक। इसमें नए घर का गृह प्रवेश नहीं किया जाता।"],
    ...GA.map((r) => [`${C.fdt(r.s)} – ${C.fdt(r.e)}`, "गुरु अस्त (सूर्य से 11° के भीतर), चातुर्मास के अंदर।"]),
    [`${C.fdt(S_DHANU.t, true)} से`, `खरमास फिर शुरू, जनवरी ${YEAR + 1} में मकर संक्रांति तक।`],
  ];
  const faq = [
    ...GM.withM.map((i) => [`${MON[i]} ${YEAR} में गृह प्रवेश के शुभ मुहूर्त कौन से हैं?`, `${MON[i]} ${YEAR} में ${GM.counts[i]} शुभ तारीखें हैं — ${GM.by[i].map((x) => `${C.dnum(x.d.rise)} ${MON[i]} (${VAR[C.ist(x.d.rise).getUTCDay()]})`).join(", ")}।`]),
    [`जनवरी ${YEAR} में गृह प्रवेश का मुहूर्त क्यों नहीं है?`, `${C.fdt(S_MAKAR.t)} तक खरमास है, और उसके बाद ${paushEnd ? C.fdt(paushEnd) : "फरवरी की शुरुआत"} तक पौष मास है। परंपरा में दोनों समय नए घर के गृह प्रवेश के लिए वर्जित माने जाते हैं, इसलिए पहला मुहूर्त ${C.fdt(first.rise)} को है।`],
    [`जुलाई से अक्टूबर ${YEAR} में गृह प्रवेश क्यों नहीं है?`, `${C.fd(CH[0])} से ${C.fd(CH[1])} तक चातुर्मास है, और इसी बीच शुक्र व गुरु अस्त भी रहते हैं। ${C.fdt(lastPre.rise)} के बाद अगला मुहूर्त देवउठनी के बाद नवंबर में है।`],
    ["क्या किराये के घर में जाने के लिए भी यही मुहूर्त देखें?", "यह सूची नए घर में पहली बार प्रवेश (अपूर्व गृह प्रवेश) के लिए है, जिसके नियम सबसे सख्त हैं। किराये के घर में जाने या लंबे समय बाद अपने घर लौटने के लिए नियम हल्के होते हैं, इसलिए उनके लिए और भी दिन मिल सकते हैं। ऐसी स्थिति में अपनी तारीख ज्योतिषी से पूछ लें।"],
    ["मंगलवार और रविवार को गृह प्रवेश क्यों नहीं दिया गया?", "मुहूर्त ग्रंथों में नए घर के प्रवेश के लिए सोमवार, बुधवार, गुरुवार, शुक्रवार और शनिवार शुभ माने गए हैं। मंगलवार और रविवार को आम तौर पर छोड़ा जाता है, इसलिए इस सूची में वे दिन नहीं हैं।"],
    ["क्या ये समय हर शहर के लिए एक जैसे हैं?", "तारीखें लगभग पूरे भारत में एक ही रहती हैं, पर शुरुआत और अंत का समय सूर्योदय के अनुसार शहर-शहर कुछ मिनट बदलता है। ऊपर दिए समय लखनऊ के हैं।"],
    ["दूसरी वेबसाइट पर ज़्यादा तारीखें क्यों दिखती हैं?", "कुछ सूचियों में खरमास (जैसे 1 जनवरी या मार्च के आख़िरी दिन) और चातुर्मास (नवंबर की शुरुआत) की तारीखें भी होती हैं, जबकि वही वेबसाइटें खुद लिखती हैं कि इन समयों में गृह प्रवेश नहीं करना चाहिए। हमने केवल वही तारीखें दी हैं जो नीचे लिखे सभी नियमों पर खरी उतरती हैं।"],
  ];
  const desc = `गृह प्रवेश मुहूर्त ${YEAR}: कुल ${total} शुभ तारीखें — ${summary}। लखनऊ के अनुसार समय, नक्षत्र, तिथि, और खरमास, पौष, चातुर्मास के कारण कब गृह प्रवेश नहीं होगा।`;
  const h1 = `गृह प्रवेश मुहूर्त ${YEAR} — पूरे साल की शुभ तारीखें`;
  const waMsg = `नमस्ते, मुझे गृह प्रवेश मुहूर्त ${YEAR} के लिए अपनी कुंडली के अनुसार तारीख और लग्न निकलवाना है।`;
  const wrap = shell({ slug, title: `गृह प्रवेश मुहूर्त ${YEAR}: नए घर में प्रवेश की शुभ तारीखें व समय (लखनऊ) | Jyotish Tark`, h1, desc, crumb: `गृह प्रवेश मुहूर्त ${YEAR}`, faq, waMsg });
  const main = `<main id="main" class="rs-page fx-page">
${crumbNav(`गृह प्रवेश मुहूर्त ${YEAR}`)}

${hero("॥ नूतन गृह प्रवेश · वास्तु पूजन ॥", `गृह प्रवेश मुहूर्त ${YEAR}`, "पूरे साल की शुभ तारीखें", `${YEAR} में नए घर में प्रवेश के लिए कुल <b>${total} शुभ तारीखें</b> हैं। खरमास और पौष मास के कारण पहला मुहूर्त ${C.fdt(first.rise)} को है। सबसे ज़्यादा मुहूर्त ${MON[top]} में हैं। ${C.fdt(lastPre.rise)} के बाद चातुर्मास के कारण नवंबर तक विराम रहेगा। नीचे हर तारीख का लखनऊ के अनुसार समय, नक्षत्र और तिथि दी गई है।`, GM)}

${toc(GM, [["table", "पूरी सूची"], ["kab-nahi", "कब नहीं"], ["niyam", "मुहूर्त कैसे चुना"], ["vidhi", "क्या करें"], ["faq", "प्रश्न-उत्तर"]])}

${monthSections(GL, GM, "गृह प्रवेश मुहूर्त")}

    <section class="rs-sec" id="table">
      <h2>एक नज़र में — सभी ${total} मुहूर्त</h2>
      <p class="rs-note">रात 12 बजे के बाद वाला समय पंचांग में उसी दिन का माना जाता है, क्योंकि पंचांग का दिन सूर्योदय से अगले सूर्योदय तक चलता है।</p>
${fullTable(GL, `गृह प्रवेश मुहूर्त ${YEAR}, लखनऊ (IST)`)}
    </section>

    <section class="rs-sec" id="kab-nahi">
      <h2>${YEAR} में कब गृह प्रवेश नहीं होगा</h2>
      <div class="vm-table-wrap">
        <table class="vm-table">
          <thead><tr><th scope="col">अवधि</th><th scope="col">कारण</th></tr></thead>
          <tbody>${closed.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <p class="rs-note">${GM.without.map((i) => MON[i]).join(", ")} ${YEAR} में नए घर के गृह प्रवेश का एक भी मुहूर्त नहीं है।</p>
    </section>

    <section class="rs-sec" id="niyam">
      <h2>ये मुहूर्त कैसे निकाले गए</h2>
      <p>हर मिनट को हमारे पंचांग इंजन से लखनऊ (26.85° N, 80.95° E) के लिए लाहिड़ी अयनांश से जांचा गया है। एक समय तभी शुभ माना गया जब ये सभी शर्तें पूरी हों:</p>
      <ol class="fx-steps">
        <li><strong>शुभ नक्षत्र:</strong> ${nakNames(G_NAK)}।</li>
        <li><strong>शुभ तिथि:</strong> ${G_TI.map((t) => TI_NAMES[t]).join(", ")} (दोनों पक्ष)। रिक्ता तिथियां (चतुर्थी, नवमी, चतुर्दशी), अमावस्या, अष्टमी और पूर्णिमा छोड़ी गईं।</li>
        <li><strong>वार:</strong> सोमवार, बुधवार, गुरुवार, शुक्रवार या शनिवार — मंगलवार और रविवार नहीं।</li>
        <li><strong>भद्रा, अशुभ योग और गंडांत नहीं:</strong> विष्टि करण, व्यतीपात, वैधृति, विष्कम्भ, अतिगण्ड, शूल, गण्ड, व्याघात, वज्र, परिघ योग और नक्षत्र-संधि का समय हटाया गया।</li>
        <li><strong>समय:</strong> खरमास, पौष मास, चातुर्मास, और गुरु या शुक्र अस्त का समय छोड़ा गया।</li>
        <li><strong>30 मिनट से छोटे समय छोड़े गए।</strong></li>
      </ol>
      <p class="rs-note">यह सामान्य पंचांग मुहूर्त है। घर में प्रवेश का सटीक लग्न (स्थिर लग्न बेहतर माना जाता है) और परिवार के मुखिया की कुंडली के अनुसार चंद्र बल देखकर अंतिम समय तय किया जाता है।</p>
    </section>

    <section class="rs-sec" id="vidhi">
      <h2>गृह प्रवेश के दिन परंपरा में क्या किया जाता है</h2>
      <div class="fx-two">
        <div class="rs-card"><h3>प्रवेश से पहले</h3><ul><li>घर की पूरी सफ़ाई, दरवाज़े पर तोरण और रंगोली</li><li>मुहूर्त के समय से पहले पूजा की सामग्री और पंडित तय कर लें</li><li>कलश में जल, आम के पत्ते और नारियल तैयार रखें</li></ul></div>
        <div class="rs-card"><h3>प्रवेश के समय</h3><ul><li>गणेश पूजन और कलश के साथ प्रवेश</li><li>परंपरा के अनुसार पहले दायां पैर अंदर रखा जाता है</li><li>वास्तु पूजन, नवग्रह शांति या हवन — परिवार की परंपरा के अनुसार</li><li>रसोई में पहले दिन दूध उबालना या मीठा बनाना</li></ul></div>
      </div>
    </section>

${faqHtml(faq)}

${band("अपनी कुंडली के अनुसार गृह प्रवेश का समय निकलवाएं", "परिवार के मुखिया की जन्म तिथि, समय, स्थान और घर का शहर भेजें। ज्योतिषी ज्ञानेंद्र सिंह तोमर इन तारीखों में से आपके लिए उपयुक्त दिन और प्रवेश का लग्न बताएंगे।", waMsg, "समय निकलवाएं")}

${seeAlso([[`shubh-muhurat-${YEAR}.html`, "सभी मुहूर्त", `शुभ मुहूर्त ${YEAR}`, "विवाह, गृह प्रवेश, वाहन"], [`vivah-muhurat-${YEAR}.html`, "पूरा वर्ष", `विवाह मुहूर्त ${YEAR}`, "सभी शुभ तारीखें"], [`vahan-kharid-muhurat-${YEAR}.html`, "पूरा वर्ष", `वाहन खरीद मुहूर्त ${YEAR}`, "गाड़ी लेने के शुभ दिन"], ["vastu-shastra.html", "लेख", "वास्तु", "घर और दिशाएं"]])}
  </main>`;
  fs.writeFileSync(path.join(ROOT, slug), wrap(main));
  console.log("wrote", slug, "—", total, "dates:", summary);
}

// ======================= VAHAN KHARID =======================
const V_NAK = [0, 3, 4, 6, 7, 12, 13, 14, 16, 21, 22, 23, 26];
const VR = { nak: new Set(V_NAK), tithi: (t) => t !== 0 && ![3, 7, 8, 13].includes(t % 15), vara: (d) => [1, 3, 4, 5].includes(d), bhadra: 1, yoga: 1, gandanta: 1 };
const VL = C.compute(YEAR, VR), VM = monthData(VL);
{
  const slug = `vahan-kharid-muhurat-${YEAR}.html`;
  const total = VL.length, summary = VM.withM.map((i) => `${MON[i]} ${VM.counts[i]}`).join(", ");
  const faq = [
    ...VM.withM.map((i) => [`${MON[i]} ${YEAR} में गाड़ी खरीदने के शुभ दिन कौन से हैं?`, `${MON[i]} ${YEAR} में ${VM.counts[i]} शुभ तारीखें हैं — ${VM.by[i].map((x) => `${C.dnum(x.d.rise)} ${MON[i]}`).join(", ")}।`]),
    ["क्या खरमास और चातुर्मास में गाड़ी खरीद सकते हैं?", "विवाह और गृह प्रवेश की तरह वाहन खरीदने पर खरमास या चातुर्मास की रोक आम तौर पर नहीं मानी जाती। इसलिए इस सूची में पूरे साल की तारीखें हैं। अगर आपके परिवार में इन महीनों को टालने की परंपरा है, तो उसे मानें।"],
    ["गाड़ी की डिलीवरी या बुकिंग — मुहूर्त किसका देखें?", "परंपरा में मुहूर्त उस समय का देखा जाता है जब वाहन पहली बार घर लाया जाता है या पहली बार चलाया जाता है (डिलीवरी)। बुकिंग किसी भी दिन की जा सकती है।"],
    ["मंगलवार, शनिवार और रविवार क्यों नहीं दिए गए?", "मुहूर्त ग्रंथों में वाहन के लिए सोमवार, बुधवार, गुरुवार और शुक्रवार सबसे शुभ माने गए हैं, इसलिए यह सूची इन्हीं चार दिनों की है। कुछ पंचांग रविवार को भी लेते हैं।"],
    ["क्या ये समय हर शहर के लिए एक जैसे हैं?", "तारीखें लगभग पूरे भारत में एक ही रहती हैं, पर शुरुआत और अंत का समय शहर-शहर कुछ मिनट बदलता है। ऊपर दिए समय लखनऊ के हैं।"],
  ];
  const desc = `वाहन खरीद मुहूर्त ${YEAR}: कार, बाइक या कोई भी गाड़ी खरीदने की कुल ${total} शुभ तारीखें — ${summary}। लखनऊ के अनुसार समय, नक्षत्र और तिथि।`;
  const h1 = `वाहन खरीद मुहूर्त ${YEAR} — गाड़ी लेने के शुभ दिन`;
  const waMsg = `नमस्ते, मुझे वाहन खरीद मुहूर्त ${YEAR} के लिए अपनी कुंडली के अनुसार तारीख निकलवानी है।`;
  const wrap = shell({ slug, title: `वाहन खरीद मुहूर्त ${YEAR}: कार-बाइक खरीदने की शुभ तारीखें व समय (लखनऊ) | Jyotish Tark`, h1, desc, crumb: `वाहन खरीद मुहूर्त ${YEAR}`, faq, waMsg });
  const main = `<main id="main" class="rs-page fx-page">
${crumbNav(`वाहन खरीद मुहूर्त ${YEAR}`)}

${hero("॥ नया वाहन · शुभ दिन ॥", `वाहन खरीद मुहूर्त ${YEAR}`, "गाड़ी लेने के शुभ दिन", `${YEAR} में कार, बाइक या कोई भी वाहन घर लाने के लिए कुल <b>${total} शुभ तारीखें</b> हैं — हर महीने कुछ न कुछ दिन। नीचे हर तारीख का लखनऊ के अनुसार समय, नक्षत्र और तिथि दी गई है। डिलीवरी इसी समय के भीतर लें।`, VM)}

${toc(VM, [["table", "पूरी सूची"], ["niyam", "मुहूर्त कैसे चुना"], ["faq", "प्रश्न-उत्तर"]])}

${monthSections(VL, VM, "वाहन खरीद मुहूर्त")}

    <section class="rs-sec" id="table">
      <h2>एक नज़र में — सभी ${total} मुहूर्त</h2>
${fullTable(VL, `वाहन खरीद मुहूर्त ${YEAR}, लखनऊ (IST)`)}
    </section>

    <section class="rs-sec" id="niyam">
      <h2>ये मुहूर्त कैसे निकाले गए</h2>
      <p>हर मिनट को हमारे पंचांग इंजन से लखनऊ (26.85° N, 80.95° E) के लिए लाहिड़ी अयनांश से जांचा गया है। एक समय तभी शुभ माना गया जब ये सभी शर्तें पूरी हों:</p>
      <ol class="fx-steps">
        <li><strong>शुभ नक्षत्र:</strong> ${nakNames(V_NAK)}।</li>
        <li><strong>तिथि:</strong> रिक्ता तिथियां (चतुर्थी, नवमी, चतुर्दशी), अष्टमी, अमावस्या और शुक्ल प्रतिपदा छोड़ी गईं।</li>
        <li><strong>वार:</strong> सोमवार, बुधवार, गुरुवार या शुक्रवार।</li>
        <li><strong>भद्रा, अशुभ योग और गंडांत नहीं:</strong> विष्टि करण, व्यतीपात, वैधृति, विष्कम्भ, अतिगण्ड, शूल, गण्ड, व्याघात, वज्र, परिघ योग और नक्षत्र-संधि का समय हटाया गया।</li>
        <li><strong>30 मिनट से छोटे समय छोड़े गए।</strong></li>
      </ol>
      <p class="rs-note">मुहूर्त एक परंपरा है; गाड़ी की सुरक्षा के लिए सबसे ज़रूरी है सही बीमा, समय पर सर्विस और सावधानी से चलाना।</p>
    </section>

${faqHtml(faq)}

${band("अपनी कुंडली के अनुसार वाहन खरीदने का दिन निकलवाएं", "जन्म तिथि, समय और स्थान भेजें। ज्योतिषी ज्ञानेंद्र सिंह तोमर इन तारीखों में से आपके लिए उपयुक्त दिन बताएंगे।", waMsg, "दिन निकलवाएं")}

${seeAlso([[`shubh-muhurat-${YEAR}.html`, "सभी मुहूर्त", `शुभ मुहूर्त ${YEAR}`, "विवाह, गृह प्रवेश, वाहन"], [`griha-pravesh-muhurat-${YEAR}.html`, "पूरा वर्ष", `गृह प्रवेश मुहूर्त ${YEAR}`, "नए घर के शुभ दिन"], [`vivah-muhurat-${YEAR}.html`, "पूरा वर्ष", `विवाह मुहूर्त ${YEAR}`, "सभी शुभ तारीखें"], ["panchang.html", "रोज़", "आज का पंचांग", "तिथि, नक्षत्र, राहुकाल"]])}
  </main>`;
  fs.writeFileSync(path.join(ROOT, slug), wrap(main));
  console.log("wrote", slug, "—", total, "dates:", summary);
}

// ======================= generic page (mundan, namkaran) =======================
function genericPage(cfg) {
  const { slug, list: L_, M, label, kicker, h1a, h1b, lead, rules, closed, faq, waMsg, bandH, bandP, bandBtn, see, extra } = cfg;
  const total = L_.length, summary = M.withM.map((i) => `${MON[i]} ${M.counts[i]}`).join(", ");
  const desc = cfg.desc(total, summary);
  const wrap = shell({ slug, title: cfg.title, h1: `${h1a} — ${h1b}`, desc, crumb: h1a, faq, waMsg });
  const main = `<main id="main" class="rs-page fx-page">
${crumbNav(h1a)}

${hero(kicker, h1a, h1b, lead(total), M)}

${toc(M, [["table", "पूरी सूची"], ...(closed ? [["kab-nahi", "कब नहीं"]] : []), ["niyam", "मुहूर्त कैसे चुना"], ["faq", "प्रश्न-उत्तर"]])}

${monthSections(L_, M, label)}

    <section class="rs-sec" id="table">
      <h2>एक नज़र में — सभी ${total} मुहूर्त</h2>
      <p class="rs-note">रात 12 बजे के बाद वाला समय पंचांग में उसी दिन का माना जाता है, क्योंकि पंचांग का दिन सूर्योदय से अगले सूर्योदय तक चलता है।</p>
${fullTable(L_, `${h1a}, लखनऊ (IST)`)}
    </section>
${closed ? `
    <section class="rs-sec" id="kab-nahi">
      <h2>${YEAR} में कब ${label.replace(" मुहूर्त", "")} नहीं होगा</h2>
      <div class="vm-table-wrap">
        <table class="vm-table">
          <thead><tr><th scope="col">अवधि</th><th scope="col">कारण</th></tr></thead>
          <tbody>${closed.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>` : ""}

    <section class="rs-sec" id="niyam">
      <h2>ये मुहूर्त कैसे निकाले गए</h2>
      <p>हर मिनट को हमारे पंचांग इंजन से लखनऊ (26.85° N, 80.95° E) के लिए लाहिड़ी अयनांश से जांचा गया है। एक समय तभी शुभ माना गया जब ये सभी शर्तें पूरी हों:</p>
      <ol class="fx-steps">
${rules.map((r) => `        <li>${r}</li>`).join("\n")}
        <li><strong>30 मिनट से छोटे समय छोड़े गए।</strong></li>
      </ol>
    </section>
${extra || ""}
${faqHtml(faq)}

${band(bandH, bandP, waMsg, bandBtn)}

${seeAlso(see)}
  </main>`;
  fs.writeFileSync(path.join(ROOT, slug), wrap(main));
  console.log("wrote", slug, "—", total, "dates:", summary);
}
const COMMON_RULE = "<strong>भद्रा, अशुभ योग और गंडांत नहीं:</strong> विष्टि करण, व्यतीपात, वैधृति, विष्कम्भ, अतिगण्ड, शूल, गण्ड, व्याघात, वज्र, परिघ योग और नक्षत्र-संधि का समय हटाया गया।";

// ---- MUNDAN ----
const MU_NAK = [0, 4, 6, 7, 12, 13, 14, 17, 21, 22, 23, 26], MU_TI = [1, 2, 4, 6, 9, 10, 12];
const MUR = { nak: new Set(MU_NAK), tithi: (t) => t < 15 ? MU_TI.includes(t % 15) : MU_TI.includes(t % 15) && (t % 15) <= 9, vara: (d) => [1, 3, 4, 5].includes(d), kharmas: 1, chaturmas: 1, asta: 1, bhadra: 1, yoga: 1, gandanta: 1 };
const MUL = C.compute(YEAR, MUR), MUM = monthData(MUL);
genericPage({
  slug: `mundan-muhurat-${YEAR}.html`, list: MUL, M: MUM, label: "मुंडन मुहूर्त",
  title: `मुंडन मुहूर्त ${YEAR}: बच्चे के मुंडन संस्कार की शुभ तारीखें व समय (लखनऊ) | Jyotish Tark`,
  desc: (t, s) => `मुंडन मुहूर्त ${YEAR}: चूड़ाकर्म संस्कार की कुल ${t} शुभ तारीखें — ${s}। लखनऊ के अनुसार समय, नक्षत्र और तिथि, और खरमास-चातुर्मास में कब नहीं।`,
  kicker: "॥ चूड़ाकर्म संस्कार ॥", h1a: `मुंडन मुहूर्त ${YEAR}`, h1b: "बच्चे के मुंडन की शुभ तारीखें",
  lead: (t) => `${YEAR} में मुंडन (चूड़ाकर्म) संस्कार के लिए कुल <b>${t} शुभ तारीखें</b> हैं। खरमास, चातुर्मास और गुरु-शुक्र अस्त के समय मुंडन नहीं किया जाता, इसलिए जुलाई से नवंबर की शुरुआत तक विराम है। नीचे हर तारीख का लखनऊ के अनुसार समय, नक्षत्र और तिथि दी गई है।`,
  rules: [
    `<strong>शुभ नक्षत्र:</strong> ${nakNames(MU_NAK)}।`,
    "<strong>तिथि:</strong> द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी, एकादशी और त्रयोदशी। कृष्ण पक्ष में केवल दशमी तक।",
    "<strong>वार:</strong> सोमवार, बुधवार, गुरुवार या शुक्रवार।",
    COMMON_RULE,
    "<strong>समय:</strong> खरमास, चातुर्मास, और गुरु या शुक्र अस्त का समय छोड़ा गया।",
  ],
  closed: [
    [`1 जनवरी – ${C.fdt(S_MAKAR.t, true)}`, "खरमास (सूर्य धनु राशि में)।"],
    [`${C.fdt(S_MEEN.t, true)} – ${C.fdt(S_MESH.t, true)}`, "मीन खरमास (सूर्य मीन राशि में)।"],
    ...SA.map((r) => [`${C.fdt(r.s)} – ${C.fdt(r.e)}`, "शुक्र अस्त।"]),
    [`${C.fd(CH[0])} – ${C.fd(CH[1])}`, "चातुर्मास (देवशयनी से देवउठनी एकादशी तक)।"],
    ...GA.map((r) => [`${C.fdt(r.s)} – ${C.fdt(r.e)}`, "गुरु अस्त, चातुर्मास के अंदर।"]),
    [`${C.fdt(S_DHANU.t, true)} से`, `खरमास फिर शुरू, जनवरी ${YEAR + 1} तक।`],
  ],
  extra: `
    <section class="rs-sec" id="umar">
      <h2>मुंडन किस उम्र में किया जाता है</h2>
      <p>परंपरा में मुंडन बच्चे के पहले, तीसरे या पाँचवें वर्ष में — यानी विषम वर्ष में — करना शुभ माना जाता है। कई परिवार कुल-देवता के स्थान या किसी तीर्थ पर मुंडन करवाते हैं, तो कई परिवारों की अपनी अलग परंपरा होती है। अपने परिवार की रीति को प्राथमिकता दें।</p>
      <p class="rs-note">बच्चे का स्वास्थ्य सबसे पहले है। अगर बच्चा बीमार है या उसे सर्दी-बुखार है, तो मुहूर्त के लिए ज़िद न करें — अगली शुभ तारीख चुनें, और ज़रूरत हो तो डॉक्टर से पूछ लें।</p>
    </section>
`,
  faq: [
    ...MUM.withM.map((i) => [`${MON[i]} ${YEAR} में मुंडन के शुभ मुहूर्त कौन से हैं?`, `${MON[i]} ${YEAR} में ${MUM.counts[i]} शुभ तारीखें हैं — ${MUM.by[i].map((x) => `${C.dnum(x.d.rise)} ${MON[i]} (${VAR[C.ist(x.d.rise).getUTCDay()]})`).join(", ")}।`]),
    ["दूसरी वेबसाइट पर मार्च के आख़िरी दिन और जुलाई की तारीखें क्यों दिखती हैं?", `${C.fdt(S_MEEN.t)} से ${C.fdt(S_MESH.t)} तक मीन खरमास है और ${SA[0] ? C.fdt(SA[0].s) : "जुलाई"} से शुक्र अस्त है। परंपरा में इन समयों में मुंडन जैसे संस्कार नहीं किए जाते, इसलिए हमने ये दिन नहीं दिए।`],
    ["क्या ये समय हर शहर के लिए एक जैसे हैं?", "तारीखें लगभग पूरे भारत में एक ही रहती हैं, पर शुरुआत और अंत का समय शहर-शहर कुछ मिनट बदलता है। ऊपर दिए समय लखनऊ के हैं।"],
  ],
  waMsg: `नमस्ते, मुझे अपने बच्चे के मुंडन (${YEAR}) के लिए शुभ तारीख निकलवानी है।`,
  bandH: "बच्चे की कुंडली के अनुसार मुंडन की तारीख निकलवाएं", bandP: "बच्चे की जन्म तिथि, समय और स्थान भेजें। ज्योतिषी ज्ञानेंद्र सिंह तोमर इन तारीखों में से उपयुक्त दिन बताएंगे।", bandBtn: "तारीख निकलवाएं",
  see: [[`shubh-muhurat-${YEAR}.html`, "सभी मुहूर्त", `शुभ मुहूर्त ${YEAR}`, "विवाह, गृह प्रवेश, वाहन"], [`namkaran-muhurat-${YEAR}.html`, "पूरा वर्ष", `नामकरण मुहूर्त ${YEAR}`, "बच्चे के नामकरण के दिन"], ["naam-akshar-calculator.html", "मुफ़्त टूल", "नाम अक्षर", "नक्षत्र से नाम का पहला अक्षर"], ["panchang.html", "रोज़", "आज का पंचांग", "तिथि, नक्षत्र, राहुकाल"]],
});

// ---- NAMKARAN ----
const NA_NAK = [0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26], NA_TI = [1, 2, 4, 6, 9, 10, 11, 12];
const NAR = { nak: new Set(NA_NAK), tithi: (t) => NA_TI.includes(t % 15), vara: (d) => [1, 3, 4, 5].includes(d), bhadra: 1, yoga: 1, gandanta: 1 };
const NAL = C.compute(YEAR, NAR), NAM = monthData(NAL);
genericPage({
  slug: `namkaran-muhurat-${YEAR}.html`, list: NAL, M: NAM, label: "नामकरण मुहूर्त",
  title: `नामकरण मुहूर्त ${YEAR}: बच्चे के नामकरण संस्कार की शुभ तारीखें व समय (लखनऊ) | Jyotish Tark`,
  desc: (t, s) => `नामकरण मुहूर्त ${YEAR}: बच्चे के नामकरण संस्कार की कुल ${t} शुभ तारीखें — ${s}। लखनऊ के अनुसार समय, नक्षत्र और तिथि।`,
  kicker: "॥ नामकरण संस्कार ॥", h1a: `नामकरण मुहूर्त ${YEAR}`, h1b: "बच्चे के नामकरण की शुभ तारीखें",
  lead: (t) => `परंपरा में नामकरण जन्म के 11वें या 12वें दिन होता है। अगर उस दिन संभव न हो, तो ${YEAR} में नामकरण के लिए कुल <b>${t} शुभ तारीखें</b> हैं — हर महीने कुछ न कुछ दिन। नीचे हर तारीख का लखनऊ के अनुसार समय, नक्षत्र और तिथि दी गई है।`,
  rules: [
    `<strong>शुभ नक्षत्र:</strong> ${nakNames(NA_NAK)}।`,
    "<strong>तिथि:</strong> द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी, एकादशी, द्वादशी और त्रयोदशी (दोनों पक्ष)।",
    "<strong>वार:</strong> सोमवार, बुधवार, गुरुवार या शुक्रवार।",
    COMMON_RULE,
  ],
  closed: null,
  extra: `
    <section class="rs-sec" id="naam">
      <h2>नाम का पहला अक्षर कैसे चुनें</h2>
      <p>परंपरा में नाम का पहला अक्षर बच्चे के जन्म-नक्षत्र के चरण से लिया जाता है। बच्चे की जन्म तिथि, समय और स्थान से <a href="naam-akshar-calculator.html">नाम अक्षर कैलकुलेटर</a> पर मुफ़्त में अक्षर देखें, और <a href="naam-akshar-calculator.html">उसी अक्षर से शुरू होने वाले नाम</a> चुनें।</p>
      <p class="rs-note">खरमास और चातुर्मास में भी नामकरण किया जाता है, क्योंकि यह जन्म से जुड़ा संस्कार है — इसलिए यह सूची पूरे साल की है।</p>
    </section>
`,
  faq: [
    ...NAM.withM.map((i) => [`${MON[i]} ${YEAR} में नामकरण के शुभ मुहूर्त कौन से हैं?`, `${MON[i]} ${YEAR} में ${NAM.counts[i]} शुभ तारीखें हैं — ${NAM.by[i].map((x) => `${C.dnum(x.d.rise)} ${MON[i]}`).join(", ")}।`]),
    ["नामकरण किस दिन करना चाहिए?", "परंपरा में जन्म के 11वें या 12वें दिन नामकरण होता है। उस दिन के लिए अलग से मुहूर्त देखने की ज़रूरत आम तौर पर नहीं मानी जाती। बाद में करना हो, तो ऊपर की तारीखों में से चुनें।"],
    ["क्या ये समय हर शहर के लिए एक जैसे हैं?", "तारीखें लगभग पूरे भारत में एक ही रहती हैं, पर शुरुआत और अंत का समय शहर-शहर कुछ मिनट बदलता है। ऊपर दिए समय लखनऊ के हैं।"],
  ],
  waMsg: `नमस्ते, मुझे अपने बच्चे के नामकरण (${YEAR}) के लिए शुभ तारीख और नाम अक्षर जानना है।`,
  bandH: "बच्चे की कुंडली और नाम अक्षर निकलवाएं", bandP: "बच्चे की जन्म तिथि, समय और स्थान भेजें। ज्योतिषी ज्ञानेंद्र सिंह तोमर नाम का शुभ अक्षर और नामकरण की तारीख बताएंगे।", bandBtn: "नाम अक्षर पूछें",
  see: [[`shubh-muhurat-${YEAR}.html`, "सभी मुहूर्त", `शुभ मुहूर्त ${YEAR}`, "विवाह, गृह प्रवेश, वाहन"], [`mundan-muhurat-${YEAR}.html`, "पूरा वर्ष", `मुंडन मुहूर्त ${YEAR}`, "चूड़ाकर्म संस्कार"], ["naam-akshar-calculator.html", "मुफ़्त टूल", "नाम अक्षर", "नक्षत्र से नाम का पहला अक्षर"], ["kundali-form.html", "मुफ़्त", "जन्म कुंडली", "बच्चे की कुंडली बनाएं"]],
});

// ======================= HUB =======================
{
  const slug = `shubh-muhurat-${YEAR}.html`;
  const vivah = fs.readFileSync(path.join(ROOT, `vivah-muhurat-${YEAR}.html`), "utf8");
  const vTotal = (vivah.match(/कुल <b>(\d+) शुभ तारीखें<\/b>/) || [])[1];
  const vMonths = [...vivah.matchAll(/<section class="rs-sec" id="([a-z]+)">\s*<h2>[^<]*?\((\d+) तारीखें\)/g)].map((m) => [MON_EN.indexOf(m[1]), Number(m[2])]);
  const row = (name, href, counts) => `<tr><th scope="row"><a href="${href}">${name}</a></th>${MON.map((m, i) => { const c = counts[i] || 0; return `<td${c ? "" : ' class="mz"'}>${c || "–"}</td>`; }).join("")}</tr>`;
  const vc = MON.map(() => 0); vMonths.forEach(([i, n]) => { if (i >= 0) vc[i] = n; });
  const desc = `शुभ मुहूर्त ${YEAR}: विवाह (${vTotal} तारीखें), गृह प्रवेश (${GL.length}), वाहन खरीद (${VL.length}), मुंडन (${MUL.length}) और नामकरण (${NAL.length}) के पूरे साल के मुहूर्त एक जगह — महीने के हिसाब से, लखनऊ के समय के साथ।`;
  const h1 = `शुभ मुहूर्त ${YEAR} — विवाह, गृह प्रवेश, वाहन`;
  const wrap = shell({ slug, title: `शुभ मुहूर्त ${YEAR}: विवाह, गृह प्रवेश, वाहन खरीद की सभी तारीखें | Jyotish Tark`, h1, desc, crumb: `शुभ मुहूर्त ${YEAR}`, faq: [], waMsg: `नमस्ते, मुझे ${YEAR} के किसी शुभ काम के लिए मुहूर्त निकलवाना है।` });
  const main = `<main id="main" class="rs-page fx-page">
    <nav class="rs-crumb" aria-label="Breadcrumb"><a href="https://jyotishtark.in/">होम</a> / <a href="panchang.html">पंचांग</a> / <span>शुभ मुहूर्त ${YEAR}</span></nav>

    <section class="rs-hero fx-hero">
      <div>
        <p class="rs-kicker">॥ शुभस्य शीघ्रम् ॥</p>
        <h1>शुभ मुहूर्त ${YEAR} — <span>विवाह, गृह प्रवेश, वाहन, मुंडन, नामकरण</span></h1>
        <p class="rs-lead">${YEAR} के बड़े शुभ कामों के पूरे साल के मुहूर्त एक जगह। हर तारीख हमारे पंचांग इंजन से लखनऊ के लिए निकाली गई है, और हर पेज पर लिखा है कि कौन से नियम लगाए गए।</p>
      </div>
    </section>

    <section class="rs-sec">
      <h2>मुहूर्त चुनें</h2>
      <div class="fx-days">
        <a href="vivah-muhurat-${YEAR}.html"><span class="fx-d">${vTotal} तारीखें</span><b>विवाह मुहूर्त ${YEAR}</b><small>शादी की शुभ तारीखें व समय</small></a>
        <a href="griha-pravesh-muhurat-${YEAR}.html"><span class="fx-d">${GL.length} तारीखें</span><b>गृह प्रवेश मुहूर्त ${YEAR}</b><small>नए घर में प्रवेश</small></a>
        <a href="vahan-kharid-muhurat-${YEAR}.html"><span class="fx-d">${VL.length} तारीखें</span><b>वाहन खरीद मुहूर्त ${YEAR}</b><small>कार, बाइक, कोई भी वाहन</small></a>
        <a href="mundan-muhurat-${YEAR}.html"><span class="fx-d">${MUL.length} तारीखें</span><b>मुंडन मुहूर्त ${YEAR}</b><small>चूड़ाकर्म संस्कार</small></a>
        <a href="namkaran-muhurat-${YEAR}.html"><span class="fx-d">${NAL.length} तारीखें</span><b>नामकरण मुहूर्त ${YEAR}</b><small>बच्चे का नामकरण</small></a>
        <a href="gochar-2027.html"><span class="fx-d">${YEAR}</span><b>गोचर ${YEAR}</b><small>शनि, गुरु, राहु-केतु, मंगल</small></a>
      </div>
    </section>

    <section class="rs-sec">
      <h2>किस महीने में कितने मुहूर्त</h2>
      <p class="rs-note">मुहूर्त के नाम पर क्लिक करके पूरी सूची देखें। "–" का मतलब है उस महीने कोई मुहूर्त नहीं।</p>
      <div class="vm-table-wrap">
        <table class="vm-table">
          <caption>शुभ मुहूर्त ${YEAR}: महीने के हिसाब से संख्या</caption>
          <thead><tr><th scope="col">मुहूर्त</th>${MON.map((m) => `<th scope="col">${m}</th>`).join("")}</tr></thead>
          <tbody>${row("विवाह", `vivah-muhurat-${YEAR}.html`, vc)}${row("गृह प्रवेश", `griha-pravesh-muhurat-${YEAR}.html`, GM.counts)}${row("वाहन", `vahan-kharid-muhurat-${YEAR}.html`, VM.counts)}${row("मुंडन", `mundan-muhurat-${YEAR}.html`, MUM.counts)}${row("नामकरण", `namkaran-muhurat-${YEAR}.html`, NAM.counts)}</tbody>
        </table>
      </div>
    </section>

    <section class="rs-sec">
      <h2>${YEAR} में मांगलिक कामों पर विराम</h2>
      <ul>
        <li><b>खरमास:</b> 1 जनवरी – ${C.fdt(S_MAKAR.t)}, फिर ${C.fdt(S_MEEN.t)} – ${C.fdt(S_MESH.t)} (मीन), और ${C.fdt(S_DHANU.t)} से साल के अंत तक।</li>
        <li><b>चातुर्मास:</b> ${C.fd(CH[0])} (देवशयनी एकादशी) – ${C.fd(CH[1])} (देवउठनी एकादशी)।</li>
        ${SA.map((r) => `<li><b>शुक्र अस्त:</b> ${C.fdt(r.s)} – ${C.fdt(r.e)}</li>`).join("")}${GA.map((r) => `<li><b>गुरु अस्त:</b> ${C.fdt(r.s)} – ${C.fdt(r.e)}</li>`).join("")}
      </ul>
      <p class="rs-note">इन समयों में विवाह, गृह प्रवेश और मुंडन नहीं होते। वाहन खरीदने और नामकरण पर यह रोक आम तौर पर नहीं मानी जाती।</p>
    </section>

${band("किसी भी शुभ काम का मुहूर्त अपनी कुंडली से निकलवाएं", "सामान्य मुहूर्त सबके लिए एक जैसे होते हैं। आपके लिए सबसे अच्छा दिन और समय आपकी कुंडली के चंद्र बल, तारा बल और लग्न से तय होता है।", `नमस्ते, मुझे ${YEAR} के किसी शुभ काम के लिए मुहूर्त निकलवाना है।`, "मुहूर्त पूछें")}

${seeAlso([["panchang.html", "रोज़", "आज का पंचांग", "तिथि, नक्षत्र, राहुकाल"], [`tyohar-${YEAR}.html`, YEAR, `त्योहार ${YEAR}`, "पूरा त्योहार कैलेंडर"], ["kundali-milan.html", "मुफ़्त टूल", "कुंडली मिलान", "36 गुण"], [`rashifal-${YEAR}.html`, YEAR, `राशिफल ${YEAR}`, "12 राशियों का वार्षिक फल"]])}
  </main>`;
  fs.writeFileSync(path.join(ROOT, slug), wrap(main));
  console.log("wrote", slug);
}
