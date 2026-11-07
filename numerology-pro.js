/* Jyotish Tark — ₹299 detailed numerology report (20+ A4 pages, Hindi or English).
   Uses the calculations of numerology-tools.js (window.JT_NM) and the texts of
   numerology-content.js (NM_CONTENT) + numerology-pro-content.js (NM_PRO).
   window.JTNumPro.build({ dob, name, lang, orderId }) → complete printable HTML document. */
(function () {
  "use strict";

  function build(o) {
    const N = window.JT_NM, C = window.NM_CONTENT || {}, X = window.NM_PRO || {};
    if (!N) throw new Error("numerology engine missing");
    const lang = o.lang === "en" ? "en" : "hi";
    return N.withLang(lang, () => make(N, C, X, lang, o));
  }

  function make(N, C, X, lang, o) {
    const hi = lang === "hi", L = (h, e) => (hi ? h : e), H = (pair) => (pair ? pair[hi ? 0 : 1] : ""), esc = N.esc, pl = N.pl, root = N.root;
    const M = N.model(o.dob, (o.name || "").trim());
    if (!M) throw new Error(L("जन्मतिथि सही नहीं है।", "Invalid date of birth."));
    const { p, nn, Y, cnt } = M;
    const S = N.sections(M), sec = (k) => { const s = S[k]; return s ? s[1] : ""; };
    // section order in sections(): 0 nature,1 life,2 career,3 love,4 money,5 family,6 health,7 weak,8 name?,then lucky,year,months,loshu,how
    const off = nn ? 1 : 0, iLucky = 8 + off, iYear = 9 + off, iMonths = 10 + off, iLoshu = 11 + off, iHow = 12 + off;
    const kw = (n) => H(C.KW && C.KW[n]);
    const D = C.DEEP[p.mulank][lang], DB = C.DEEP[p.bhagyank][lang];

    // ---- extra numbers ----
    const letters = String(M.name || "").toUpperCase().replace(/[^A-Z]/g, "").split("");
    const vow = letters.filter((c) => "AEIOU".includes(c)), con = letters.filter((c) => !"AEIOU".includes(c));
    const sumL = (arr) => arr.reduce((a, c) => a + (N.CHALD[c] || 0), 0);
    const soul = vow.length ? (root(sumL(vow)) || 9) : null, pers = con.length ? (root(sumL(con)) || 9) : null;
    const nameRoot = nn ? nn.root : null;
    const matur = nameRoot ? (root(p.bhagyank + nameRoot) || 9) : null;
    const lpRaw = p.parts[0] + p.parts[1] + p.parts[2];
    const karmic = [13, 14, 16, 19].filter((k) => p.d === k || lpRaw === k || (nn && nn.comp === k));
    const bdc = p.d > 9 ? N.compound(p.d) : null;
    const m1 = root(p.mo) || 9, d1 = root(p.d) || 9, y1 = root(N.sumDigits(p.y)) || 9, lp1 = p.bhagyank;
    const pin = [root(m1 + d1) || 9, root(d1 + y1) || 9, 0, root(m1 + y1) || 9]; pin[2] = root(pin[0] + pin[1]) || 9;
    const ch = [Math.abs(m1 - d1), Math.abs(d1 - y1), 0, Math.abs(m1 - y1)]; ch[2] = Math.abs(ch[0] - ch[1]);
    const a1 = 36 - lp1, ages = [[0, a1], [a1 + 1, a1 + 9], [a1 + 10, a1 + 18], [a1 + 19, null]];
    const ageNow = Y - p.y, curPin = ages.findIndex(([s, e]) => ageNow >= s && (e === null || ageNow <= e));
    const pyOf = (yr) => root(p.d + p.mo + root(yr)) || 9;
    const luckyDates = Array.from({ length: 31 }, (_, i) => i + 1).filter((d) => N.LUCKY[p.mulank].includes(root(d) || 9));
    const sugg = nn ? N.nameSuggestions(M.name, p) : [];
    const nameOk = nn && M.ok && !(M.ncp && M.ncp[2] === "care");
    const today = new Date(), dstr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const rno = o.orderId || ("JTN-" + String(p.y).slice(2) + String(p.mo).padStart(2, "0") + String(p.d).padStart(2, "0") + "-" + (nn ? nn.comp : 0));
    const pd = (n) => `${n} <small>(${pl(n)})</small>`;
    const Y2 = window.NM_PRO2 || {}, Z = (k, n) => H(Y2[k] && (n == null ? Y2[k] : Y2[k][n]));
    const ZL = (k, n, c) => { const a = Z(k, n); return Array.isArray(a) && a.length ? `<ul class="ck${c ? " " + c : ""}">${a.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""; };
    const mu = p.mulank, bh = p.bhagyank;

    // ---- chapters ----
    const CH = [];
    const add = (title, html) => CH.push([title, html]);

    add(L("आपके मुख्य अंक — एक नज़र में", "Your core numbers at a glance"), `
      <p>${L("अंक ज्योतिष में जन्मतिथि और नाम से कुछ मुख्य अंक निकाले जाते हैं। हर अंक जीवन के एक अलग पहलू को दर्शाता है। नीचे की तालिका आपकी पूरी रिपोर्ट का सार है; आगे के अध्यायों में हर अंक को विस्तार से समझाया गया है।", "In numerology a few core numbers are worked out from the date of birth and the name. Each one describes a different side of life. The table below is the summary of your whole report; the following chapters explain each number in detail.")}</p>
      <table class="t"><thead><tr><th>${L("अंक", "Number")}</th><th>${L("मान", "Value")}</th><th>${L("ग्रह", "Planet")}</th><th>${L("क्या बताता है", "What it shows")}</th></tr></thead><tbody>
        <tr><td><b>${L("मूलांक", "Birth number")}</b></td><td class="n">${p.mulank}</td><td>${pl(p.mulank)}</td><td>${L("आपका स्वभाव — ", "Your nature — ")}${kw(p.mulank)}</td></tr>
        <tr><td><b>${L("भाग्यांक", "Life path")}</b></td><td class="n">${p.lp}</td><td>${pl(p.bhagyank)}</td><td>${L("जीवन की दिशा — ", "Direction of life — ")}${kw(p.bhagyank)}</td></tr>
        ${nn ? `<tr><td><b>${L("नामांक", "Name number")}</b></td><td class="n">${nn.comp} → ${nn.root}</td><td>${pl(nn.root)}</td><td>${L("नाम का प्रभाव — ", "Effect of the name — ")}${kw(nn.root)}</td></tr>` : ""}
        ${soul ? `<tr><td><b>${L("आत्मांक (इच्छा अंक)", "Soul urge")}</b></td><td class="n">${soul}</td><td>${pl(soul)}</td><td>${L("मन की गहरी इच्छा", "Your inner desire")}</td></tr>` : ""}
        ${pers ? `<tr><td><b>${L("बाह्यांक (व्यक्तित्व अंक)", "Personality")}</b></td><td class="n">${pers}</td><td>${pl(pers)}</td><td>${L("लोग आपको कैसे देखते हैं", "How others see you")}</td></tr>` : ""}
        ${matur ? `<tr><td><b>${L("परिपक्वता अंक", "Maturity number")}</b></td><td class="n">${matur}</td><td>${pl(matur)}</td><td>${L("उम्र के साथ उभरने वाले गुण", "Qualities that grow with age")}</td></tr>` : ""}
        <tr><td><b>${L(`व्यक्तिगत वर्ष ${Y}`, `Personal year ${Y}`)}</b></td><td class="n">${M.py}</td><td>${pl(M.py)}</td><td>${H(N.PM[M.py])}</td></tr>
        <tr><td><b>${L(`व्यक्तिगत वर्ष ${Y + 1}`, `Personal year ${Y + 1}`)}</b></td><td class="n">${pyOf(Y + 1)}</td><td>${pl(pyOf(Y + 1))}</td><td>${H(N.PM[pyOf(Y + 1)])}</td></tr>
      </tbody></table>
      <h3>${L("आपकी गणना कैसे हुई", "How your numbers were calculated")}</h3>${sec(iHow)}
      ${soul || pers ? `<p class="sm">${L("आत्मांक नाम के स्वरों (A, E, I, O, U) और बाह्यांक व्यंजनों के कैल्डियन मानों के योग से निकाला गया है। परिपक्वता अंक = भाग्यांक + नामांक।", "Soul urge is the total of the vowels (A, E, I, O, U) of the name and personality the total of the consonants, using Chaldean values. Maturity number = life path + name number.")}</p>` : ""}`);

    add(L(`आपका स्वभाव — मूलांक ${p.mulank}`, `Your nature — birth number ${p.mulank}`), sec(0) +
      (Z("STR", mu) ? `<h3>${L("आपकी पाँच प्राकृतिक ताकतें", "Your five natural strengths")}</h3>${ZL("STR", mu)}` : "") +
      (Z("SOCIAL", mu) ? `<h3>${L("दोस्ती, समाज और बातचीत", "Friendship, society and communication")}</h3><p>${Z("SOCIAL", mu)}</p>` : "") +
      `<h3>${L("कमज़ोरियाँ और सुधार", "Weak spots and how to fix them")}</h3>` + sec(7) +
      (Z("STRESS", mu) ? `<h3>${L("तनाव के समय आप — और क्या मदद करता है", "You under stress — and what helps")}</h3><div class="box"><p>${Z("STRESS", mu)}</p></div>` : ""));

    add(L(`जीवन की दिशा — भाग्यांक ${p.lp}`, `Direction of life — life path ${p.lp}`), sec(1) +
      (p.bhagyank !== p.mulank ? `<h3>${L(`भाग्यांक ${p.bhagyank} (${pl(p.bhagyank)}) का प्रभाव`, `Influence of ${p.bhagyank} (${pl(p.bhagyank)})`)}</h3><p>${DB.nat}</p><p>${DB.out}</p>` : "") +
      (bh !== mu && Z("STR", bh) ? `<h3>${L(`भाग्यांक ${bh} से मिलने वाले गुण`, `Qualities life path ${bh} brings`)}</h3>${ZL("STR", bh)}` : "") +
      `<p class="sm">${L("मूलांक बताता है कि आप कैसे हैं, और भाग्यांक बताता है कि जीवन आपको किस ओर ले जाता है। दोनों का तालमेल जितना अच्छा हो, जीवन उतना सहज चलता है।", "The birth number shows who you are; the life path shows where life takes you. The better they agree, the smoother life runs.")}</p>`);

    if (nn) {
      const rows = letters.map((c) => `<span class="lt"><b>${c}</b><small>${N.CHALD[c] || 0}</small></span>`).join("");
      const m1x = N.match(p.mulank, nn.root), m2x = N.match(p.bhagyank, nn.root);
      add(L("आपके नाम का विश्लेषण", "Analysis of your name"), `
        <p>${L("कैल्डियन अंक पद्धति में हर अक्षर का एक मान होता है। नाम के सभी अक्षरों का योग आपका नामांक है — यह बताता है कि आपका नाम लोगों पर कैसा प्रभाव डालता है।", "In the Chaldean system every letter has a value. The total of all letters of your name is your name number — it shows the effect your name has on people.")}</p>
        <div class="lts">${rows}</div>
        <p><b>${esc(M.name)}</b> = ${nn.comp} → <b>${nn.root}</b> (${pl(nn.root)})</p>
        ${M.ncp ? `<div class="box"><b>${L("संयुक्त अंक", "Compound number")} ${nn.comp} — "${N.cName(M.ncp)}"</b><p>${N.cText(M.ncp)}</p></div>` : ""}
        <table class="t"><tbody><tr><td>${L("मूलांक", "Birth number")} ${p.mulank} ${L("के साथ", "with")} ${L("नामांक", "name number")} ${nn.root}</td><td><b>${m1x.t}</b></td></tr>
        <tr><td>${L("भाग्यांक", "Life path")} ${p.bhagyank} ${L("के साथ", "with")} ${L("नामांक", "name number")} ${nn.root}</td><td><b>${m2x.t}</b></td></tr></tbody></table>
        <p>${nameOk ? L("आपका नामांक आपके मूल अंकों के अनुकूल है। नाम बदलने की आवश्यकता नहीं है — इसी स्पेलिंग का हस्ताक्षर, विज़िटिंग कार्ड और दस्तावेज़ों में एक जैसा प्रयोग करें।", "Your name number suits your core numbers. There is no need to change the name — use this same spelling consistently in your signature, cards and documents.") : L("आपका नामांक आपके मूल अंकों से पूरा मेल नहीं खाता। इसका अर्थ यह नहीं कि नाम अशुभ है, पर स्पेलिंग में छोटा-सा बदलाव (“नाम सुधार के सुझाव” अध्याय देखें) तालमेल बेहतर कर सकता है।", "Your name number does not fully agree with your core numbers. This does not mean the name is unlucky, but a small spelling change (see the chapter “Name correction suggestions”) can improve the harmony.")}</p>`);
    }

    if (soul || pers || matur) add(L("मन, व्यक्तित्व और परिपक्वता", "Inner self, personality and maturity"), `
      ${soul ? `<h3>${L("आत्मांक", "Soul urge")} ${pd(soul)}</h3><p>${H(X.SOUL[soul])}</p>` : ""}
      ${pers ? `<h3>${L("बाह्यांक — लोग आपको कैसे देखते हैं", "Personality — how people see you")} ${pd(pers)}</h3><p>${H(X.PERS[pers])}</p>` : ""}
      ${matur ? `<h3>${L("परिपक्वता अंक", "Maturity number")} ${pd(matur)}</h3><p>${H(X.MATUR[matur])}</p>` : ""}
      ${soul && pers && soul !== pers ? `<p class="sm">${L("जब मन की इच्छा (आत्मांक) और बाहरी छवि (बाह्यांक) अलग हों, तो लोग कभी-कभी आपको पूरी तरह नहीं समझ पाते। अपनी असली इच्छा अपनों से खुलकर कहें।", "When your inner wish (soul urge) and outer image (personality) differ, people may not fully understand you. Tell your close ones what you really want.")}</p>` : ""}`);

    add(L("जन्म दिवस और कर्म अंक", "Birthday and karmic numbers"), `
      <h3>${L("जन्म दिवस अंक", "Birthday number")} ${p.d}</h3>
      ${bdc ? `<div class="box"><b>${p.d} — "${N.cName(bdc)}"</b><p>${N.cText(bdc)}</p></div>` : `<p>${L(`आपकी जन्म तारीख ${p.d} एक अंक की है, इसलिए इसका प्रभाव सीधे मूलांक ${p.mulank} जैसा ही है — मूलांक के गुण आपमें स्पष्ट दिखते हैं।`, `Your birth day ${p.d} is a single digit, so it acts just like birth number ${p.mulank} — the qualities of the birth number show clearly in you.`)}</p>`}
      <p>${L("जन्म दिवस अंक आपकी एक विशेष प्रतिभा बताता है, जो बचपन से आपके साथ है।", "The birthday number shows a special talent that has been with you since childhood.")}</p>
      <h3>${L("कर्म ऋण अंक", "Karmic debt numbers")}</h3>
      ${karmic.length ? karmic.map((k) => `<div class="box"><p>${H(X.KARMIC[k])}</p></div>`).join("") : `<p>${L("आपकी जन्मतिथि और नाम में कोई कर्म ऋण अंक (13, 14, 16, 19) नहीं है। यह अच्छा संकेत है — आपको पिछले कर्मों का कोई विशेष बोझ नहीं उठाना है।", "There is no karmic debt number (13, 14, 16, 19) in your date of birth or name. This is a good sign — you carry no special burden of past actions.")}</p>`}
      <p class="sm">${L("कर्म ऋण अंक डराने के लिए नहीं, बल्कि जीवन का एक पाठ समझने के लिए होते हैं।", "Karmic numbers are not meant to frighten — they point to a lesson of life.")}</p>`);

    add(L("लो शू ग्रिड — आपका अंक चक्र", "Lo Shu grid — your number chart"), sec(iLoshu));

    const present = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => cnt[n]);
    add(L("मौजूद अंकों को और मज़बूत करें", "Strengthen the numbers you have"), `
      <p>${L("ग्रिड में जो अंक मौजूद हैं, वे आपकी प्राकृतिक ताकत हैं। नीचे के छोटे उपाय इन्हें और प्रभावी बनाते हैं। अपनी सुविधा से कोई दो-तीन उपाय चुनकर नियमित करें।", "The numbers present in your grid are your natural strengths. The small practices below make them even more effective. Pick two or three that suit you and do them regularly.")}</p>
      <div class="g2">${present.map((n) => `<div class="box"><b>${n} · ${pl(n)}</b>${cnt[n] > 1 ? ` <small>(${cnt[n]} ${L("बार", "times")})</small>` : ""}<p>${H(X.ENH[n])}</p></div>`).join("")}</div>`);

    add(L("करियर और धन", "Career and money"), `<h3>${L("करियर", "Career")}</h3>${sec(2)}
      ${Z("CAREERS", mu) ? `<div class="box"><b>${L(`मूलांक ${mu} के लिए उपयुक्त क्षेत्र`, `Suitable fields for birth number ${mu}`)}</b><p>${Z("CAREERS", mu)}</p>${bh !== mu && Z("CAREERS", bh) ? `<b>${L(`भाग्यांक ${bh} के अनुसार`, `By life path ${bh}`)}</b><p>${Z("CAREERS", bh)}</p>` : ""}</div>` : ""}
      ${Z("BIZ", mu) ? `<h3>${L("नौकरी या व्यवसाय?", "Job or business?")}</h3><p>${Z("BIZ", mu)}</p>` : ""}<h3>${L("धन", "Money")}</h3>${sec(4)}
      ${p.bhagyank !== p.mulank ? `<h3>${L(`भाग्यांक ${p.bhagyank} के अनुसार करियर`, `Career by life path ${p.bhagyank}`)}</h3><p>${DB.career}</p>` : ""}`);

    const cmp = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => { const m = N.match(mu, n); return `<tr><td class="n">${n}</td><td>${pl(n)}</td><td class="m-${m.k}"><b>${m.t}</b></td>${Z("PTRAIT", n) ? `<td>${L(`मूलांक ${n} का साथी`, `A number-${n} partner`)} ${Z("PTRAIT", n)}</td>` : ""}</tr>`; }).join("");
    const best = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => N.match(mu, n).k === "good"), mid = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => N.match(mu, n).k === "mid");
    add(L("प्रेम, विवाह और जीवनसाथी", "Love, marriage and your life partner"), `${sec(3)}
      ${Z("LOVESTYLE", mu) ? `<h3>${L("आप प्रेम कैसे करते हैं", "How you love")}</h3><p>${Z("LOVESTYLE", mu)}</p>` : ""}
      ${bh !== mu && Z("LOVESTYLE", bh) ? `<h3>${L(`भाग्यांक ${bh} का रिश्तों पर प्रभाव`, `How life path ${bh} shapes your relationships`)}</h3><p>${Z("LOVESTYLE", bh)}</p>` : ""}
      ${Z("PNEED", mu) ? `<h3>${L("आपके लिए आदर्श जीवनसाथी के गुण", "Qualities of your ideal life partner")}</h3><div class="box"><p>${Z("PNEED", mu)}</p></div>` : ""}
      ${Z("LOVECH", mu) ? `<h3>${L("रिश्ते में आपकी चुनौती", "Your challenge in a relationship")}</h3><p>${Z("LOVECH", mu)}</p>` : ""}
      ${Z("LOVETIPS", mu) ? `<h3>${L("प्रेम को मज़बूत करने के तीन उपाय", "Three ways to strengthen your love")}</h3>${ZL("LOVETIPS", mu, "one")}` : ""}
      <h3>${L(`मूलांक ${mu} का दूसरे मूलांकों से मेल — और हर साथी क्या लाता है`, `How birth number ${mu} matches others — and what each partner brings`)}</h3>
      <table class="t"><thead><tr><th>${L("मूलांक", "No.")}</th><th>${L("ग्रह", "Planet")}</th><th>${L("मेल", "Match")}</th>${Y2.PTRAIT ? `<th>${L("साथी के गुण", "What the partner brings")}</th>` : ""}</tr></thead><tbody>${cmp}</tbody></table>
      ${best.length ? `<p><b>${L("सबसे सहज मेल", "Easiest matches")}:</b> ${L("मूलांक", "birth numbers")} ${best.join(", ")} — ${L("इनके साथ स्वभाव जल्दी मिलता है।", "your temperaments agree quickly.")}</p>` : ""}
      ${mid.length && Z("PCARE") ? `<p><b>${L("सामान्य मेल", "Average matches")} (${mid.join(", ")}):</b> ${Z("PCARE")}</p>` : ""}
      <div class="box"><b>${L("साथी का मूलांक कैसे निकालें", "How to find a partner's birth number")}</b><p>${L("साथी की जन्म तारीख़ (केवल दिन) के अंकों को जोड़कर एक अंक बनाएँ। जैसे 23 तारीख़ → 2+3 = 5। फिर ऊपर की तालिका में वह पंक्ति देखें।", "Add the digits of the partner's day of birth to get one digit. For example the 23rd → 2+3 = 5. Then see that row in the table above.")}</p></div>
      <p class="sm">${L("अंक मेल स्वभाव का संकेत है, भाग्य का फ़ैसला नहीं। कोई भी मेल 'बुरा' नहीं होता — समझ, सम्मान और बातचीत से हर रिश्ता मज़बूत होता है। विवाह के निर्णय में आपसी समझ, परिवार और कुंडली मिलान अधिक महत्वपूर्ण हैं।", "Number matching shows temperament, not destiny. No match is 'bad' — understanding, respect and conversation make every relationship stronger. Mutual understanding, family and kundali matching matter more in a marriage decision.")}</p>`);

    add(L("परिवार और सेहत", "Family and wellbeing"), `<h3>${L("परिवार", "Family")}</h3>${sec(5)}<h3>${L("सेहत की प्रवृत्ति", "Wellbeing tendencies")}</h3>${sec(6)}`);

    if (Z("SPIRIT", mu)) add(L("आध्यात्मिक मार्ग और ग्रह-उपासना", "Spiritual path and planetary worship"), `<p>${Z("SPIRIT", mu)}</p>
      ${bh !== mu && Z("SPIRIT", bh) ? `<h3>${L(`भाग्यांक ${bh} के लिए`, `For life path ${bh}`)}</h3><p>${Z("SPIRIT", bh)}</p>` : ""}
      <p class="sm">${L("उपासना मन को स्थिर करती है और अनुशासन देती है। इसे भय से नहीं, श्रद्धा और नियमितता से करें; कोई महँगा अनुष्ठान आवश्यक नहीं है।", "Worship steadies the mind and builds discipline. Do it with faith and regularity, not fear; no costly ritual is needed.")}</p>`);

    const LS = C.LS && C.LS[p.mulank];
    add(L("आपके लिए शुभ", "Lucky for you"), `${sec(iLucky)}
      <table class="t"><tbody>
        <tr><td>${L("हर महीने की शुभ तारीखें", "Lucky dates every month")}</td><td><b>${luckyDates.join(", ")}</b></td></tr>
        <tr><td>${L("शुभ दिन", "Lucky days")}</td><td><b>${H(N.DAYS[p.mulank])}</b></td></tr>
        <tr><td>${L("शुभ रंग", "Lucky colours")}</td><td><b>${H(N.COLORS[p.mulank])}</b></td></tr>
        ${LS && LS.dir ? `<tr><td>${L(`अंक ${p.mulank} की दिशा`, `Direction of ${p.mulank}`)}</td><td><b>${H(LS.dir)}</b></td></tr>` : ""}
        <tr><td>${L("रुद्राक्ष", "Rudraksha")}</td><td><b>${H(N.RUDRA[p.mulank])}</b></td></tr>
      </tbody></table>
      <p class="sm">${L("महत्वपूर्ण काम — इंटरव्यू, नई शुरुआत, बड़ी ख़रीद — संभव हो तो शुभ तारीख और शुभ दिन पर करें। रत्न या रुद्राक्ष धारण करने से पहले व्यक्तिगत परामर्श अवश्य लें।", "Where possible, do important things — interviews, new starts, big purchases — on a lucky date and day. Take personal advice before wearing any gemstone or rudraksha.")}</p>`);

    const prow = pin.map((n, i) => `<tr${i === curPin ? ' class="cur"' : ""}><td>${i + 1}</td><td>${ages[i][0]}–${ages[i][1] === null ? L("आगे", "on") : ages[i][1]} ${L("वर्ष", "yrs")}</td><td class="n">${n}</td><td>${H(X.PINN[n])}</td><td class="n">${ch[i]}</td></tr>`).join("");
    add(L("जीवन के चार चरण — शिखर और चुनौतियाँ", "The four stages of life — pinnacles and challenges"), `
      <p>${L("अंक ज्योतिष में जीवन को चार बड़े चरणों में बाँटा जाता है। हर चरण का एक 'शिखर अंक' होता है जो उस समय के अवसर बताता है, और एक 'चुनौती अंक' जो सीखने का पाठ बताता है।", "Numerology divides life into four big stages. Each has a 'pinnacle number' showing the opportunities of that time, and a 'challenge number' showing the lesson to learn.")}</p>
      <table class="t"><thead><tr><th>#</th><th>${L("आयु", "Age")}</th><th>${L("शिखर", "Pinnacle")}</th><th>${L("इस चरण का स्वभाव", "Nature of this stage")}</th><th>${L("चुनौती", "Challenge")}</th></tr></thead><tbody>${prow}</tbody></table>
      ${curPin >= 0 ? `<h3>${L(`अभी आप चरण ${curPin + 1} में हैं (आयु लगभग ${ageNow})`, `You are now in stage ${curPin + 1} (age about ${ageNow})`)}</h3><p>${H(X.PINN[pin[curPin]])}</p><p><b>${L("इस चरण की चुनौती", "Challenge of this stage")}:</b> ${H(X.CHAL[ch[curPin]])}</p>` : ""}
      <h3>${L("आपकी मुख्य जीवन-चुनौती", "Your main life challenge")} (${ch[2]})</h3><p>${H(X.CHAL[ch[2]])}</p>`);

    const cyc = Array.from({ length: 9 }, (_, i) => Y + i).map((yr) => { const n = pyOf(yr); return `<tr${yr === Y ? ' class="cur"' : ""}><td>${yr}</td><td class="n">${n}</td><td>${H(N.PM[n])}</td></tr>`; }).join("");
    add(L(`वर्षफल — ${Y} और ${Y + 1}`, `Year ahead — ${Y} and ${Y + 1}`), `
      <h3>${Y} — ${L("व्यक्तिगत वर्ष", "personal year")} ${M.py}</h3>${sec(iYear)}
      <h3>${Y + 1} — ${L("व्यक्तिगत वर्ष", "personal year")} ${pyOf(Y + 1)}</h3><p>${H(C.PY2 && C.PY2[pyOf(Y + 1)])}</p>
      <h3>${L("आपका 9 वर्ष का चक्र", "Your 9-year cycle")}</h3>
      <table class="t"><thead><tr><th>${L("वर्ष", "Year")}</th><th>${L("अंक", "No.")}</th><th>${L("मुख्य विषय", "Main theme")}</th></tr></thead><tbody>${cyc}</tbody></table>
      <p class="sm">${L("व्यक्तिगत वर्ष 1 नई शुरुआत का और 9 पूर्णता का वर्ष होता है। अपने बड़े काम इसी चक्र के अनुसार योजना बनाकर करें।", "Personal year 1 is for new starts and 9 for completion. Plan your big moves along this cycle.")}</p>`);

    add(L("अगले 12 महीने — महीनेवार", "The next 12 months — month by month"), sec(iMonths));

    const fav = N.LUCKY[p.mulank].filter((x) => N.LUCKY[p.bhagyank].includes(x));
    add(L("नाम सुधार के सुझाव", "Name correction suggestions"), `
      <p>${nameOk ? L("आपका वर्तमान नाम आपके मूल अंकों के अनुकूल है, इसलिए नाम बदलने की आवश्यकता नहीं है। नीचे के विकल्प केवल जानकारी के लिए हैं।", "Your present name suits your core numbers, so no change is needed. The options below are for information only.") : L("नीचे के विकल्पों में पहले नाम की स्पेलिंग में केवल एक अक्षर का बदलाव है, ताकि नाम का उच्चारण वही रहे और नामांक आपके अनुकूल हो जाए।", "In the options below only one letter of the first name changes, so the name sounds the same while the name number becomes favourable.")}</p>
      <p><b>${L("आपके लिए अनुकूल नामांक", "Favourable name numbers for you")}:</b> ${(fav.length ? fav : N.LUCKY[p.mulank]).join(", ")}</p>
      ${sugg.length ? `<table class="t"><thead><tr><th>${L("स्पेलिंग", "Spelling")}</th><th>${L("योग", "Total")}</th><th>${L("नामांक", "Name no.")}</th></tr></thead><tbody>${sugg.map((s) => `<tr><td><b>${esc(s.full)}</b></td><td>${s.comp}</td><td class="n">${s.root} <small>(${pl(s.root)})</small></td></tr>`).join("")}</tbody></table>` : `<p>${L("एक अक्षर के बदलाव से कोई बेहतर विकल्प नहीं मिला — आपका वर्तमान नाम ही उचित है।", "No better option was found with a one-letter change — your present name is fine.")}</p>`}
      <div class="box warn"><b>${L("ज़रूरी सूचना", "Important")}</b><p>${L("ये सुझाव केवल अंक-गणना पर आधारित हैं। आधिकारिक दस्तावेज़ों में नाम बदलना कानूनी प्रक्रिया है — पहले सोच-समझकर निर्णय लें। केवल हस्ताक्षर, विज़िटिंग कार्ड या सोशल मीडिया पर नई स्पेलिंग का प्रयोग भी किया जा सकता है। नाम बदलना सफलता की गारंटी नहीं है।", "These suggestions are based only on number calculation. Changing a name in official documents is a legal process — decide carefully. You may also use the new spelling only for signature, cards or social media. A name change is not a guarantee of success.")}</p></div>`);

    add(L("मोबाइल, गाड़ी और मकान नंबर", "Mobile, vehicle and house numbers"), `
      <p>${L("किसी नंबर का अंक निकालने के लिए उसके सभी अंकों को जोड़ें और एक अंक तक घटाएँ। उदाहरण: 98765 43210 → 9+8+7+6+5+4+3+2+1+0 = 45 → 4+5 = 9।", "To find the number of a mobile, vehicle or house, add all its digits and reduce to one digit. Example: 98765 43210 → 9+8+7+6+5+4+3+2+1+0 = 45 → 4+5 = 9.")}</p>
      <table class="t"><tbody>
        <tr><td>${L("आपके लिए अच्छे योग", "Good totals for you")}</td><td><b>${N.LUCKY[p.mulank].join(", ")}</b></td></tr>
        <tr><td>${L("सामान्य / सावधानी वाले योग", "Average / be careful")}</td><td><b>${[1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !N.LUCKY[p.mulank].includes(n)).join(", ")}</b></td></tr>
      </tbody></table>
      <ul><li>${L("मोबाइल नंबर के अंतिम चार अंकों में बार-बार 0 या 4-8 का जोड़ा कम रहे तो बेहतर है।", "It is better if the last four digits of a mobile number do not repeat 0 or the pair 4-8 too often.")}</li>
      <li>${L("गाड़ी के लिए अक्षरों को छोड़कर केवल अंकों का योग देखें।", "For a vehicle, add only the digits, ignore the letters.")}</li>
      <li>${L("नया नंबर लेना संभव न हो तो चिंता न करें — शुभ रंग का कवर या नेमप्लेट भी संतुलन देता है।", "If changing the number is not possible, do not worry — a cover or nameplate in your lucky colour also helps balance.")}</li></ul>
      <p class="sm">${L("अपने मोबाइल नंबर की पूरी जाँच मुफ़्त में jyotishtark.in/numerology.html पर करें।", "Check your mobile number in full, free, at jyotishtark.in/numerology.html.")}</p>`);

    const miss = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !cnt[n]);
    add(L("उपाय — सार", "Remedies — summary"), `
      <ol class="rem">
        <li>${H(X.ENH[p.mulank])}</li>
        ${p.bhagyank !== p.mulank ? `<li>${H(X.ENH[p.bhagyank])}</li>` : ""}
        ${miss.slice(0, 3).map((n) => C.LS && C.LS[n] ? `<li><b>${L(`अंक ${n} की कमी`, `Missing ${n}`)}:</b> ${H(C.LS[n].hi ? [C.LS[n].hi[1], C.LS[n].en[1]] : null)}</li>` : "").join("")}
        <li>${L(`महत्वपूर्ण काम हर महीने की ${luckyDates.slice(0, 4).join(", ")} तारीख़ के आसपास रखें।`, `Keep important work near the ${luckyDates.slice(0, 4).join(", ")} of each month.`)}</li>
        <li>${L("सबसे बड़ा उपाय — सच्चाई, अनुशासन, बड़ों का सम्मान और ज़रूरतमंद की मदद।", "The biggest remedy — honesty, discipline, respect for elders and helping those in need.")}</li>
      </ol>
      <h3>${L("ज्योतिषी की टिप्पणी", "Astrologer's note")}</h3>
      <div class="note"><p>${L(`${esc(M.name)} जी, आपका मूलांक ${p.mulank} (${pl(p.mulank)}) आपको ${kw(p.mulank)} का गुण देता है और भाग्यांक ${p.lp} जीवन को ${kw(p.bhagyank)} की ओर ले जाता है। ${Y} में आपका व्यक्तिगत वर्ष ${M.py} है — ${H(N.PM[M.py])} का समय।`, `${esc(M.name)}, your birth number ${p.mulank} (${pl(p.mulank)}) gives you the quality of ${kw(p.mulank)}, and life path ${p.lp} leads your life towards ${kw(p.bhagyank)}. In ${Y} your personal year is ${M.py} — a time of ${H(N.PM[M.py]).toLowerCase()}.`)}</p>
      <p>${L("अंक केवल प्रवृत्ति और समय का संकेत देते हैं, निश्चित भविष्य नहीं। अपनी ताकत पहचानें, कमज़ोरियों पर धीरे-धीरे काम करें और बड़े निर्णय — विवाह, निवेश, नौकरी या स्वास्थ्य — से पहले अपनी परिस्थिति और संबंधित विशेषज्ञ की सलाह अवश्य लें। शुभम् भवतु।", "Numbers show tendencies and timing, not a fixed future. Know your strengths, work slowly on your weak spots, and before big decisions — marriage, investment, job or health — consider your situation and take advice from the right expert. Best wishes.")}</p></div>`);

    // ---- document ----
    const toc = CH.map((c, i) => `<li><span>${L("अध्याय", "Chapter")} ${i + 1}</span>${c[0]}</li>`).join("");
    const box = (lbl, n, sub) => `<div class="cb"><small>${lbl}</small><b>${n}</b><span>${sub}</span></div>`;
    const title = L("विस्तृत अंक ज्योतिष रिपोर्ट", "Detailed Numerology Report");
    const ftr = `${L("ज्योतिष तर्क · अंक ज्योतिष", "Jyotish Tark · Numerology")} · ${String(M.name || "").replace(/["\\\n]/g, "")} · ${p.d}-${p.mo}-${p.y}`;
    const pgCss = `@page{@bottom-left{content:"${ftr}";font:600 8.5pt Mukta,sans-serif;color:#7A1F1F}@bottom-right{content:"${L("पृष्ठ", "Page")} " counter(page);font:600 8.5pt Mukta,sans-serif;color:#7A1F1F}}@page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    const body = CH.map((c, i) => `<section class="ch"><p class="chn">${L("अध्याय", "Chapter")} ${i + 1}</p><h2>${c[0]}</h2>${c[1]}</section>`).join("");
    return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(M.name || "")} — Jyotish Tark</title>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
<style>${CSS}${pgCss}</style></head><body><div class="wrap">
<section class="cover"><div class="fr"></div><div class="fr2"></div>
  ${N.mandalaSvg()}
  <p class="k">॥ ${L("ज्योतिष तर्क", "JYOTISH TARK")} ॥</p>
  <h1>${esc(title)}</h1>
  <p class="nm">${esc(M.name || "")}</p>
  <p class="dob">${L("जन्मतिथि", "Date of birth")}: ${p.d}-${p.mo}-${p.y}</p>
  <div class="cgrid">${box(L("मूलांक", "Birth no."), p.mulank, pl(p.mulank))}${box(L("भाग्यांक", "Life path"), p.lp, pl(p.bhagyank))}${box(L("नामांक", "Name no."), nn ? nn.root : "—", nn ? pl(nn.root) : "")}${box(L(`वर्ष ${Y}`, `Year ${Y}`), M.py, H(N.PM[M.py]))}</div>
  <div class="seal">${N.stampSvg(118)}</div>
  <p class="ft">${L("रिपोर्ट क्रमांक", "Report no.")} ${esc(rno)} · ${L("तैयार", "Prepared")}: ${dstr}<br>jyotishtark.in · ${L("ज्योतिषी ज्ञानेंद्र सिंह तोमर, लखनऊ", "Astrologer Gyanendra Singh Tomar, Lucknow")}</p>
</section>
<section class="toc"><h2>${L("विषय सूची", "Contents")}</h2><ol>${toc}</ol>
  <div class="box"><b>${L("इस रिपोर्ट को कैसे पढ़ें", "How to read this report")}</b><p>${L("पहले अध्याय 1 की तालिका देखें — यह पूरी रिपोर्ट का सार है। फिर अपने स्वभाव, करियर और वर्षफल के अध्याय पढ़ें। उपाय अध्याय के अंत में दिए हैं; उन्हें श्रद्धा और नियमितता से करें।", "Start with the table in chapter 1 — it is the summary of the whole report. Then read the chapters on your nature, career and year ahead. Remedies are at the end; follow them with faith and regularity.")}</p></div>
  <p class="sm">${L("यह रिपोर्ट कैल्डियन अंक पद्धति, लो शू ग्रिड और पारंपरिक ग्रह-मैत्री पर आधारित है।", "This report is based on the Chaldean number system, the Lo Shu grid and traditional planetary friendships.")}</p></section>
${body}
<section class="close">${N.stampSvg(104)}<div><p><b>${L("ज्योतिष तर्क, लखनऊ", "Jyotish Tark, Lucknow")}</b><br>jyotishtark.in · WhatsApp +91 83185 13814</p>
<p class="sm">${L("यह रिपोर्ट अंक ज्योतिष पर आधारित सामान्य मार्गदर्शन है। यह किसी परिणाम की गारंटी नहीं है और चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है।", "This report is general guidance based on numerology. It does not guarantee any result and is not a substitute for medical, legal or financial advice.")}</p></div></section>
</div></body></html>`;
  }

  const CSS = `@page{size:A4;margin:14mm 13mm 15mm}@page:first{margin:0}
*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#2B1810;font-family:Mukta,'Noto Sans Devanagari',sans-serif;font-size:11.5pt;line-height:1.65;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{width:210mm;height:297mm;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 38%,#8E2A2A 0%,#5A1414 55%,#3A0B0B 100%);color:#F7E7C1;text-align:center;break-after:page;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22mm}
.cover .fr{position:absolute;inset:9mm;border:1.6px solid #E9C46A;border-radius:3mm}.cover .fr2{position:absolute;inset:12mm;border:.6px solid #E9C46A;border-radius:2mm}
.cover .k{letter-spacing:.3em;font-size:11pt;color:#E9C46A;font-weight:700;margin:12px 0 4px}
.cover h1{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:34pt;margin:6px 0;color:#FBEFD0;line-height:1.2}
.cover .nm{font-family:'Tiro Devanagari Hindi',serif;font-size:24pt;margin:12px 0 2px;color:#fff}.cover .dob{font-size:12.5pt;color:#F3DFAE;margin:0}
.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin:10mm 0 7mm;width:156mm}
.cb{border:1px solid #E9C46A;border-radius:3mm;padding:4mm 2mm;background:rgba(0,0,0,.18)}.cb small{display:block;font-size:9.5pt;color:#E9C46A;font-weight:700}.cb b{display:block;font-size:26pt;line-height:1.15;color:#fff}.cb span{font-size:9.5pt;color:#F3DFAE}
.seal{background:#FBF4E4;border-radius:50%;padding:3mm;display:inline-block}
.cover .ft{position:absolute;bottom:15mm;left:0;right:0;font-size:9.8pt;color:#E9C46A;line-height:1.6}
.ch{margin-top:9mm;padding-top:4mm;border-top:2px solid #C9A227}.toc{break-after:page}.toc+.ch{margin-top:0;border-top:0;padding-top:0}.toc ol{list-style:none;padding:0;margin:2mm 0 4mm}.toc li{padding:1.1mm 0;border-bottom:1px dotted #D9C6A0;font-size:11pt;line-height:1.45}.toc li span{display:inline-block;width:26mm;color:#7A5410;font-size:10pt}
.hd{display:flex;justify-content:space-between;border-bottom:1.5px solid #C9A227;padding-bottom:2mm;margin-bottom:4mm;font-size:9.5pt;color:#7A1F1F;font-weight:700}
.chn{break-after:avoid;margin:0;color:#B8892B;font-weight:700;letter-spacing:.08em;font-size:10pt;text-transform:uppercase}
h2{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;color:#7A1F1F;font-size:19pt;margin:1mm 0 4mm;padding-bottom:2mm;border-bottom:.8px solid #E3D3B0;line-height:1.3;break-after:avoid}
h3{font-size:13pt;color:#7A1F1F;margin:5mm 0 1.5mm;break-after:avoid}h3 small{font-weight:400;color:#6B5444}
p{margin:1.5mm 0}ul,ol{margin:1.5mm 0;padding-left:6mm}li{margin:1mm 0}.sm,.nm-small{font-size:9.8pt;color:#5B4B37}
table.t{width:100%;border-collapse:collapse;margin:2mm 0 3mm;font-size:10.8pt;break-inside:auto}table.t th{background:#7A1F1F;color:#fff;text-align:left;padding:2mm 2.5mm;font-weight:600}table.t td{border-bottom:1px solid #EADCC0;padding:2mm 2.5mm;vertical-align:top}table.t tr{break-inside:avoid}table.t td.n{font-weight:700;color:#7A1F1F;white-space:nowrap}table.t tr.cur td{background:#FFF6DD}
.m-good{color:#14532D}.m-ok{color:#1D4ED8}.m-mid{color:#6B5444}
.box{border:1px solid #EADCC0;background:#FBF6EC;border-radius:2mm;padding:3mm 4mm;margin:2mm 0;break-inside:avoid}.box.warn{border-color:#E7B4A0;background:#FFF5F0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.lts{display:flex;flex-wrap:wrap;gap:1.5mm;margin:2mm 0}.lt{border:1px solid #D9BE85;background:#FBF1DC;border-radius:1.5mm;min-width:9mm;text-align:center;padding:1mm 1.5mm}.lt b{display:block;font-size:12pt;color:#7A1F1F;line-height:1.2}.lt small{font-size:9pt}
.note{border:.5mm solid #C9A227;border-radius:2mm;background:#FBF6EC;padding:4mm 5mm;font-size:11.5pt}
.rem li{margin:1.5mm 0}.ck{list-style:none;padding-left:0;columns:2;column-gap:6mm}.ck.one{columns:1}.ck li{padding-left:5mm;position:relative;break-inside:avoid}.ck li::before{content:"✦";position:absolute;left:0;color:#B8892B;font-size:9pt}
.nm-two,.nm-kv{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:2mm 0}.nm-kv{grid-template-columns:repeat(3,1fr)}
.nm-two div,.nm-kv div{background:#FBF6EC;border:1px solid #EADCC0;border-radius:2mm;padding:2mm 3mm;break-inside:avoid}.nm-two small,.nm-kv small{display:block;font-size:9pt;color:#6B5444}
.nm-fix li b{display:block}.nm-fix li span{color:#4A3628}
.nm-months{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.nm-mo{border:1px solid #EADCC0;border-left:3px solid #C9A227;border-radius:2mm;padding:2.5mm 3mm;break-inside:avoid}.nm-mo h5{margin:0 0 1mm;font-size:11pt;color:#7A1F1F}.nm-mo h5 span{font-weight:400;color:#6B5444;font-size:9.5pt}.nm-mo p{margin:.8mm 0;font-size:10.2pt}.nm-lucky b{color:#14532D}
.nm-lsw{display:grid;grid-template-columns:52mm 1fr;gap:5mm;align-items:start}.nm-lsg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5mm}
.nm-ls{aspect-ratio:1;border:1px solid #D9BE85;background:#FBF1DC;border-radius:2mm;display:grid;place-items:center;align-content:center;text-align:center}.nm-ls b{font-size:14pt;color:#7A1F1F}.nm-ls small{font-size:8pt;color:#6B5444}.nm-ls0{background:#fff;border-style:dashed}.nm-ls0 b{color:#B3A48C}
.nm-subh{font-size:11.5pt;color:#7A1F1F;margin:4mm 0 1.5mm}.nm-rem{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.nm-rem>div{border:1px solid #EADCC0;border-radius:2mm;padding:2.5mm 3mm;break-inside:avoid}.nm-rem h6{margin:0 0 1mm;font-size:11pt;color:#7A1F1F}.nm-rem p,.nm-rem li{font-size:10pt}
.nm-sugg{display:flex;flex-wrap:wrap;gap:3mm}.nm-sugg span{border:1px solid #BBF7D0;background:#F0FDF4;border-radius:2mm;padding:2mm 4mm;text-align:center}.nm-sugg b{display:block;color:#14532D}.nm-sugg small{font-size:9pt}
.nm-steps li{margin:1.2mm 0}.nm-chip{font-weight:700}
.close{break-before:avoid;margin-top:10mm;display:flex;gap:6mm;align-items:center;border-top:1.5px solid #C9A227;padding-top:5mm;break-inside:avoid}
@media screen{body{background:#EDE6DA}.wrap{width:210mm;margin:0 auto}.ch,.close{background:#fff;padding:12mm 13mm;margin:6mm 0;box-shadow:0 2px 12px rgba(0,0,0,.15)}}
@media print{.wrap{width:auto}}`;

  window.JTNumPro = { build };
})();
