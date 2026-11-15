/* Jyotish Tark — ₹199 mobile number numerology report.
   Uses the same calculation as the free check (window.JT_NM.numCalc in numerology-tools.js),
   so the paid report never disagrees with the free result.
   - JTMobileReport.after(data)  → shows the ₹199 offer under the free result
   - JTMobileReport.build(o)     → complete printable A4 HTML (cover + 8 chapters)
   - ?jtpaid=mobile&order_id=…   → verifies payment, then opens the report with a PDF button
   Tone: safe and calm — no number is called "unlucky", no one is told they must change it;
   remedies are simple (colour, mantra, small daan, habits). */
(function () {
  "use strict";
  const PRICE = 199, WA = "918318513814", KEY = "jt-mob-order";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ga = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* ignore */ } };
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } } };

  // ---------- texts ----------
  // what each digit brings to a phone number: [quality, when it repeats 3+ times, when it is missing]
  const DIG = {
    0: [["शून्य — खुलापन और ठहराव; अपने आप में कोई ग्रह नहीं", "बहुत ज़्यादा शून्य नंबर के असर को हल्का कर देते हैं — परिणाम धीमे लग सकते हैं", ""], ["Zero — openness and pause; it has no planet of its own", "Many zeros soften the number's effect — results may feel slow", ""]],
    1: [["सूर्य — आत्मविश्वास, पहचान, पहल", "हावी होने या ज़िद की आदत बढ़ सकती है — विनम्र रहें", "अपनी बात खुलकर रखने में झिझक"], ["Sun — confidence, identity, initiative", "Can make you dominating or stubborn — stay humble", "Hesitation in speaking up for yourself"]],
    2: [["चंद्र — भावना, सहयोग, भरोसा", "मूड जल्दी बदल सकता है, बातें दिल पर ले सकते हैं", "धैर्य और दूसरों की भावना समझने पर ध्यान दें"], ["Moon — feeling, cooperation, trust", "Moods may swing; you may take things to heart", "Work on patience and understanding others"]],
    3: [["गुरु — ज्ञान, सलाह, सम्मान", "दूसरों को ज़्यादा सलाह देना या उन पर ज़्यादा ख़र्च", "बड़ों और गुरुजनों से मार्गदर्शन लेते रहें"], ["Jupiter — wisdom, advice, respect", "Too much advice-giving or spending on others", "Keep seeking guidance from elders and mentors"]],
    4: [["राहु — नई तकनीक, नेटवर्क, अचानक बदलाव", "भ्रम और अचानक उतार-चढ़ाव — हर बात लिखित में रखें", "काम में व्यवस्था और नियमितता बनाएँ"], ["Rahu — technology, networks, sudden change", "Confusion and sudden ups and downs — keep things in writing", "Build order and routine in work"]],
    5: [["बुध — बातचीत, व्यापार, संपर्क", "बेचैनी, एक साथ बहुत सारी बातें — फ़ोकस रखें", "बातचीत और संपर्क बढ़ाने पर ध्यान दें"], ["Mercury — communication, trade, contacts", "Restlessness, too many things at once — stay focused", "Put effort into communication and contacts"]],
    6: [["शुक्र — आकर्षण, सुख, परिवार", "आराम और ख़र्च की आदत बढ़ सकती है", "परिवार और अपने लिए सुख का समय निकालें"], ["Venus — charm, comfort, family", "Comfort and spending may grow", "Make time for family and your own comfort"]],
    7: [["केतु — अंतर्ज्ञान, शोध, शांति", "अकेलापन या दुनिया से कटाव महसूस हो सकता है", "रोज़ कुछ मिनट शांत बैठने की आदत डालें"], ["Ketu — intuition, research, calm", "May bring a sense of isolation", "Sit quietly for a few minutes each day"]],
    8: [["शनि — मेहनत, धैर्य, टिकाऊ परिणाम", "देरी और भारीपन — काम अधिक, परिणाम धीरे", "बचत और अनुशासन की आदत डालें"], ["Saturn — hard work, patience, lasting results", "Delays and heaviness — more effort, slower results", "Build saving habits and discipline"]],
    9: [["मंगल — ऊर्जा, साहस, तेज़ी", "ग़ुस्सा और बहस बढ़ सकती है — गर्मी में फ़ैसले न लें", "काम में जोश और पहल बढ़ाएँ"], ["Mars — energy, courage, speed", "Anger and arguments may rise — avoid decisions in heat", "Bring more drive and initiative"]]
  };
  // life areas by the number's total: [work & business, money, relationships & talk, mind & health habits]
  const AREA = {
    1: [["अपनी पहचान वाले काम, प्रशासन, ख़ुद का व्यवसाय और टीम लीड करने में यह नंबर साथ देता है। सरकारी या बड़े लोगों से जुड़े काम में आपकी बात सुनी जाती है।", "आमदनी आपकी पहल से जुड़ी रहती है — नया काम शुरू करने पर पैसा आता है। दिखावे के ख़र्च से बचें।", "लोग आपको भरोसेमंद मानते हैं, पर बातचीत में आदेश का लहजा रिश्तों में दूरी ला सकता है।", "आत्मविश्वास अच्छा रहता है। सुबह जल्दी उठना और धूप में कुछ समय बिताना इस नंबर के लिए अच्छी आदत है।"],
        ["This number supports work that carries your name — administration, your own business, leading a team. Senior people and officials tend to listen to you.", "Income follows your initiative — new ventures bring money. Avoid spending for show.", "People see you as dependable, but a commanding tone can create distance.", "Confidence stays good. Rising early and some morning sunlight are good habits for this number."]],
    2: [["सेवा, काउंसलिंग, कला, खान-पान, होटल और लोगों से जुड़े काम में यह नंबर सहयोग दिलाता है। साझेदारी में अच्छा।", "पैसा धीरे पर लगातार आता है। भावनाओं में आकर उधार देने से बचें।", "रिश्तों में अपनापन और भरोसा बढ़ाता है। लोग आपसे दिल की बात करते हैं।", "मन संवेदनशील रहता है — पर्याप्त नींद और पानी, और दिन में थोड़ा शांत समय ज़रूरी है।"],
        ["Supports service, counselling, arts, food, hospitality and people-facing work. Good for partnerships.", "Money comes slowly but steadily. Avoid lending under emotional pressure.", "Builds warmth and trust in relationships; people open up to you.", "The mind stays sensitive — enough sleep, water and a little quiet time each day help."]],
    3: [["शिक्षा, सलाह, क़ानून, वित्त, धर्म-अध्यात्म और मार्गदर्शन के काम में सम्मान दिलाता है।", "पैसों के मामले में समझदारी आती है; किसी की गारंटी लेने या बिना सोचे उधार देने से बचें।", "लोग आपसे सलाह लेते हैं और आपका आदर करते हैं। बड़ों से संबंध अच्छे रहते हैं।", "ज्ञान की ओर रुचि रहती है। खान-पान में मीठा और तला-भुना कम रखें।"],
        ["Brings respect in teaching, advice, law, finance, spirituality and guidance roles.", "Brings good sense with money; avoid standing guarantee or lending without thought.", "People seek your advice and respect you; relations with elders stay good.", "Interest in learning grows. Go easy on sweets and fried food."]],
    4: [["आईटी, तकनीक, सोशल मीडिया, रिसर्च, नेटवर्किंग और नए तरीक़ों वाले काम में यह नंबर तेज़ी देता है।", "आमदनी में उतार-चढ़ाव संभव है — हर लेन-देन लिखित में रखें और जोखिम भरे निवेश सोचकर करें।", "बहुत लोगों से संपर्क बनते हैं, पर हर किसी पर जल्दी भरोसा न करें।", "दिमाग़ तेज़ चलता है — स्क्रीन टाइम सीमित रखें और सोने का समय तय रखें।"],
        ["Gives pace to IT, technology, social media, research, networking and unconventional work.", "Income may swing — keep every deal in writing and think twice before risky investments.", "Brings many contacts, but don't trust everyone quickly.", "The mind runs fast — limit screen time and keep a fixed bedtime."]],
    5: [["व्यापार, सेल्स, मार्केटिंग, मीडिया, यात्रा और ऑनलाइन काम के लिए यह सबसे लोकप्रिय नंबर माना जाता है।", "पैसे का लेन-देन तेज़ रहता है; आमदनी के कई रास्ते बनते हैं। ख़र्च का हिसाब रखें।", "बातचीत में चतुराई और मिठास आती है; नए लोगों से जल्दी जुड़ते हैं।", "बेचैनी हो सकती है — एक समय में एक काम और फ़ोन से थोड़ी दूरी अच्छी आदत है।"],
        ["Considered the most popular number for business, sales, marketing, media, travel and online work.", "Money moves fast and several income streams open; keep track of spending.", "Talk becomes smart and pleasant; you connect with new people easily.", "Restlessness can rise — one task at a time and short breaks from the phone help."]],
    6: [["फ़ैशन, ब्यूटी, डिज़ाइन, होटल, ज्वेलरी, कला और ग्राहक सेवा में यह नंबर आकर्षण देता है।", "सुख-सुविधा मिलती है, पर ख़र्च भी बढ़ता है — हर महीने थोड़ी बचत तय करें।", "रिश्तों और परिवार में मिठास लाता है; लोग आपके साथ सहज महसूस करते हैं।", "आराम पसंद रहता है — रोज़ थोड़ा टहलना और मीठे पर नियंत्रण अच्छा है।"],
        ["Adds charm to fashion, beauty, design, hotels, jewellery, arts and customer service.", "Brings comfort, but spending rises too — fix a small monthly saving.", "Brings sweetness to family and relationships; people feel at ease with you.", "Love of comfort grows — a daily walk and less sugar help."]],
    7: [["लेखन, शोध, विज्ञान, अध्यात्म, विश्लेषण और शांत निजी काम में यह नंबर गहराई देता है। तेज़ सेल्स के लिए धीमा माना जाता है।", "पैसा अचानक आ-जा सकता है; लंबी योजना और बचत रखें।", "आप कम पर गहरे रिश्ते रखते हैं। ज़रूरी बातें खुलकर कहने की आदत डालें।", "मन अंदर की ओर जाता है — ध्यान या प्रार्थना से शांति मिलती है।"],
        ["Gives depth to writing, research, science, spirituality and quiet private work; considered slow for fast sales.", "Money may come and go suddenly; keep long-term plans and savings.", "You keep few but deep relationships; practise saying important things openly.", "The mind turns inward — meditation or prayer brings calm."]],
    8: [["क़ानून, उद्योग, निर्माण, रियल एस्टेट और लंबी मेहनत वाले काम में यह नंबर टिकाऊ परिणाम देता है — देर से, पर पक्के।", "धन धीरे-धीरे जमता है। जल्दी अमीर बनने वाली योजनाओं से दूर रहें।", "लोग आपको गंभीर और ज़िम्मेदार मानते हैं; बातचीत में थोड़ी नरमी रिश्ते आसान बनाती है।", "थकान और बोझ महसूस हो सकता है — नियमित दिनचर्या और पूरी नींद रखें।"],
        ["Gives lasting results in law, industry, construction, real estate and long-effort work — late but solid.", "Wealth builds slowly. Stay away from get-rich-quick schemes.", "People see you as serious and responsible; a softer tone makes relations easier.", "You may feel tired or burdened — keep a regular routine and full sleep."]],
    9: [["खेल, सुरक्षा, पुलिस-सेना, ज़मीन-जायदाद, इंजीनियरिंग और प्रतियोगिता वाले काम में यह नंबर जोश देता है।", "आमदनी हिम्मत से जुड़ी रहती है; ग़ुस्से या जल्दबाज़ी में पैसे के फ़ैसले न लें।", "आप साफ़ बोलते हैं; ग़ुस्से में बात करने से बचें, रिश्ते मज़बूत रहेंगे।", "ऊर्जा अधिक रहती है — व्यायाम इस ऊर्जा को सही दिशा देता है।"],
        ["Adds drive to sports, security, police and defence, property, engineering and competitive work.", "Income follows courage; avoid money decisions in anger or haste.", "You speak plainly; avoid talking in anger and relationships stay strong.", "Energy runs high — exercise channels it well."]]
  };
  // simple daan by the planet of a number
  const DAAN = {
    1: ["रविवार को गेहूँ या गुड़ का दान", "Donate wheat or jaggery on Sunday"], 2: ["सोमवार को चावल या दूध का दान", "Donate rice or milk on Monday"],
    3: ["गुरुवार को चने की दाल या हल्दी का दान", "Donate chana dal or turmeric on Thursday"], 4: ["शनिवार को किसी ज़रूरतमंद को भोजन", "Feed someone in need on Saturday"],
    5: ["बुधवार को हरी मूँग का दान या गाय को हरा चारा", "Donate green moong or feed a cow greens on Wednesday"], 6: ["शुक्रवार को सफ़ेद मिठाई या चावल का दान", "Donate white sweets or rice on Friday"],
    7: ["किसी भी दिन कुत्ते को रोटी खिलाएँ", "Feed a dog a roti on any day"], 8: ["शनिवार को सरसों का तेल या काले तिल का दान", "Donate mustard oil or black sesame on Saturday"],
    9: ["मंगलवार को मसूर की दाल या गुड़ का दान", "Donate masoor dal or jaggery on Tuesday"]
  };

  // ---------- the report ----------
  function build(o) {
    const N = window.JT_NM, CN = window.NM_CONTENT || {};
    if (!N || !N.numCalc) throw new Error("numerology engine missing");
    const lang = o.lang === "en" ? "en" : "hi";
    return N.withLang(lang, () => make(N, CN, lang, o));
  }

  function make(N, CN, lang, o) {
    const hi = lang === "hi", L = (h, e) => (hi ? h : e), H = (pair) => (pair ? pair[hi ? 0 : 1] : ""), pl = N.pl;
    const digits = String(o.mobile || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (digits.length !== 10) throw new Error("mobile");
    const X = N.numCalc(digits, o.dob, o.name, o.purpose || "personal");
    const { D, total, r, counts, last, p, nn, cp, pairs, pc, score, sc, band, sugg } = X;
    if (!p) throw new Error("dob");
    const MOB = N.MOBILE()[r][hi ? 0 : 1], A = AREA[r][hi ? 0 : 1];
    const m1 = N.match(p.mulank, r), m2 = N.match(p.bhagyank, r), mn = nn ? N.match(nn.root, r) : null;
    const shown = `${digits.slice(0, 5)} ${digits.slice(5)}`;
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !counts[d]);
    const heavy = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => counts[d] >= 3);
    const enemies = pairs.filter((x) => x.k === "e").map((x) => `${x.a}${x.b}`);
    const mixed = pairs.filter((x) => x.k === "m").map((x) => `${x.a}${x.b}`);
    const last4 = digits.slice(-4), l4 = N.root(N.sumDigits(last4)) || 9;
    const dstr = new Date().toLocaleDateString(hi ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });
    const rno = o.oid || ("JTM" + Date.now().toString(36).toUpperCase());
    const relWord = (m) => ({ good: L("उत्तम", "Excellent"), ok: L("अच्छा", "Good"), mid: L("सामान्य", "Average") }[m.k]);
    const relCls = (m) => "m-" + m.k;
    const LS = (CN.LS || {});
    const mantraOf = (n) => (LS[n] && LS[n].mantra) || "";
    const dayOf = (n) => (LS[n] ? H(LS[n].day) : "");
    const weakTotal = m1.k === "mid" && m2.k === "mid";
    const remPlanet = weakTotal ? r : p.mulank; // calm the number's planet if it doesn't match; else strengthen your own
    const purposeTxt = { personal: L("निजी", "Personal"), business: L("व्यापार / सेल्स", "Business / sales"), job: L("नौकरी", "Job"), creative: L("कला / रचनात्मक काम", "Creative work") }[X.purpose] || L("निजी", "Personal");

    // verdict — always calm
    const verdict = score >= 62 ? L("यह नंबर आपके लिए अनुकूल है। इसे बदलने की कोई ज़रूरत नहीं — नीचे दिए छोटे उपाय इसका अच्छा असर और बढ़ाएँगे।", "This number suits you. There is no need to change it — the small remedies below will add to its good effect.")
      : score >= 45 ? L("यह नंबर ठीक है। इसे बदलने की ज़रूरत नहीं — नीचे दिए आसान उपायों से संतुलन बना रहेगा।", "This number is fine. No need to change it — the easy remedies below keep it balanced.")
        : L("यह नंबर आपके अंकों से कम मेल खाता है — पर घबराने की बात नहीं। नीचे दिए आसान उपाय संतुलन देते हैं। भविष्य में नया नंबर लेना हो, तो अध्याय 7 देखें।", "This number is a weaker match with your numbers — but there is nothing to worry about. The easy remedies below bring balance. If you take a new number in future, see chapter 7.");

    const pairStrip = D.map((d, i) => { const k = i < D.length - 1 && d && D[i + 1] ? N.pairKind(d, D[i + 1]) : null; return `<span class="dg">${d}</span>${i < D.length - 1 ? `<span class="lk lk-${k || 0}"></span>` : ""}`; }).join("");
    const digRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => {
      const c = counts[d], T = DIG[d][hi ? 0 : 1];
      const note = c >= 3 ? T[1] : c === 0 ? (d === 0 ? L("शून्य नहीं है — अच्छी बात।", "No zero — good.") : T[2]) : L("संतुलित", "Balanced");
      return `<tr><td class="n">${d}</td><td>${d ? pl(d) : "—"}</td><td class="c">${c}</td><td>${T[0]}</td><td>${note}</td></tr>`;
    }).join("");
    const grid = N.LOSHU.map((d) => `<div class="ls${counts[d] ? "" : " ls0"}"><b>${counts[d] ? String(d).repeat(Math.min(counts[d], 4)) : d}</b><small>${pl(d)}</small></div>`).join("");

    // remedies (simple, safe)
    const rem = [];
    rem.push([L("शुभ रंग", "Lucky colour"), L(`फ़ोन का कवर या वॉलपेपर अपने शुभ रंगों में रखें: <b>${H(N.COLORS[p.mulank])}</b>। यह सबसे आसान और रोज़ साथ रहने वाला उपाय है।`, `Keep your phone cover or wallpaper in your lucky colours: <b>${H(N.COLORS[p.mulank])}</b>. It is the easiest remedy and stays with you every day.`)]);
    if (mantraOf(remPlanet)) rem.push([L("मंत्र", "Mantra"), L(`हर ${dayOf(remPlanet)} सुबह <b>${mantraOf(remPlanet)}</b> का 11 बार जाप करें (${pl(remPlanet)})। ${weakTotal ? "यह नंबर के ग्रह को आपके अनुकूल करता है।" : "यह आपके अपने मूलांक के ग्रह को मज़बूत रखता है।"}`, `Every ${dayOf(remPlanet)} morning, chant <b>${mantraOf(remPlanet)}</b> 11 times (${pl(remPlanet)}). ${weakTotal ? "This calms the number's planet for you." : "This keeps your own birth number's planet strong."}`)]);
    rem.push([L("शुभ अंक साथ रखें", "Keep your lucky number close"), L(`अपना शुभ अंक <b>${sugg[0]}</b> किसी छोटे काग़ज़ पर लिखकर फ़ोन के कवर के अंदर रखें, या फ़ोन के लॉक-स्क्रीन पर रखें।`, `Write your lucky number <b>${sugg[0]}</b> on a small slip and keep it inside the phone cover, or put it on your lock screen.`)]);
    if (weakTotal || enemies.length >= 2) rem.push([L("छोटा दान", "Small daan"), L(`${DAAN[r][0]} — महीने में एक बार काफ़ी है।`, `${DAAN[r][1]} — once a month is enough.`)]);
    rem.push([L("ज़रूरी बातचीत का समय", "Timing for important calls"), L(`डील, इंटरव्यू या ज़रूरी बातचीत के लिए <b>${H(N.DAYS[p.mulank])}</b> और महीने की <b>${[1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => N.LUCKY[p.mulank].includes(x)).join(", ")}</b> अंक वाली तारीख़ें चुनें (जैसे ${N.LUCKY[p.mulank].slice(0, 2).map((x) => `${x}, ${x + 9}, ${x + 18}`).join("; ")})।`, `For deals, interviews or important calls, prefer <b>${H(N.DAYS[p.mulank])}</b> and dates that reduce to <b>${N.LUCKY[p.mulank].join(", ")}</b> (e.g. ${N.LUCKY[p.mulank].slice(0, 2).map((x) => `${x}, ${x + 9}, ${x + 18}`).join("; ")}).`)]);
    if (counts[0] >= 3) rem.push([L("ज़्यादा शून्य के लिए", "For many zeros"), L("फ़ोन में अपना नाम (Owner name) पूरा और सही लिखें और फ़ोन साफ़-सुथरा रखें — शून्य का खालीपन इससे भरता माना जाता है।", "Set your full, correct name as the phone's owner name and keep the phone clean — this is believed to fill the 'emptiness' of zeros.")]);
    const watch = String(MOB[3]).replace(/[।.]\s*$/, "");
    rem.push([L("आदत", "Habit"), L(`${watch} — इस नंबर के साथ यही सबसे बड़ी सावधानी है।`, `${watch} — this is the main thing to watch with this number.`)]);

    const toc = [L("एक नज़र में", "At a glance"), L("नंबर और आप — मेल", "You and your number — the match"), L("नंबर का स्वभाव", "Nature of the number"), L("अंक-दर-अंक विश्लेषण", "Digit-by-digit analysis"), L("जीवन के क्षेत्रों पर असर", "Effect on areas of life"), L("आसान उपाय", "Easy remedies"), L("नया नंबर लेना हो तो", "If you take a new number"), L("शुभ दिन, रंग और अंक", "Lucky days, colours and numbers")];
    const ch = (i, body) => `<section class="ch"><p class="chn">${L("अध्याय", "Chapter")} ${i + 1}</p><h2>${toc[i]}</h2>${body}</section>`;
    const box = (k, v, s) => `<div class="cb"><small>${k}</small><b>${v}</b><span>${s || ""}</span></div>`;

    const body = [
      ch(0, `<div class="sum"><div class="ring" style="--p:${score}"><div><b>${score}</b><small>/100</small></div></div>
        <div><p class="big">${L("आपका नंबर", "Your number")}: <b>${shown}</b></p><p>${L("कुल योग", "Total")}: <b>${total} → ${r}</b> (${pl(r)}) · ${L("अनुकूलता", "Match")}: <b class="${band[1] === "good" ? "m-good" : band[1] === "ok" ? "m-ok" : "m-mid"}">${band[0]}</b></p><p>${verdict}</p></div></div>
        <table class="t"><tr><th>${L("बिंदु", "Point")}</th><th>${L("परिणाम", "Result")}</th></tr>
        <tr><td>${L("नंबर का ग्रह", "Planet of the number")}</td><td><b>${pl(r)}</b> — ${MOB[0]}</td></tr>
        <tr><td>${L(`मूलांक ${p.mulank} (${pl(p.mulank)}) से मेल`, `Match with birth no. ${p.mulank} (${pl(p.mulank)})`)}</td><td class="${relCls(m1)}"><b>${relWord(m1)}</b></td></tr>
        <tr><td>${L(`भाग्यांक ${p.bhagyank} (${pl(p.bhagyank)}) से मेल`, `Match with life path ${p.bhagyank} (${pl(p.bhagyank)})`)}</td><td class="${relCls(m2)}"><b>${relWord(m2)}</b></td></tr>
        ${mn ? `<tr><td>${L(`नामांक ${nn.root} से मेल`, `Match with name no. ${nn.root}`)}</td><td class="${relCls(mn)}"><b>${relWord(mn)}</b></td></tr>` : ""}
        <tr><td>${L("सबसे अच्छा उपयोग", "Best used for")}</td><td>${MOB[2]}</td></tr>
        <tr><td>${L("मुख्य सावधानी", "Main caution")}</td><td>${MOB[3]}</td></tr>
        <tr><td>${L("सबसे आसान उपाय", "Easiest remedy")}</td><td>${L(`${H(N.COLORS[p.mulank])} रंग का फ़ोन कवर`, `A phone cover in ${H(N.COLORS[p.mulank])}`)}</td></tr></table>`),
      ch(1, `<p>${L("मोबाइल नंबर अंक ज्योतिष में सबसे ज़रूरी बात यह है कि नंबर का कुल योग आपके अपने अंकों — मूलांक (जन्म की तारीख़) और भाग्यांक (पूरी जन्मतिथि का योग) — से कितना मेल खाता है।", "In mobile numerology the most important point is how well the number's total matches your own numbers — the birth number (day of birth) and the life path number (the whole date of birth).")}</p>
        <div class="g3">${box(L("मूलांक", "Birth no."), p.mulank, pl(p.mulank))}${box(L("भाग्यांक", "Life path"), p.bhagyank, pl(p.bhagyank))}${box(L("नंबर का योग", "Number total"), r, pl(r))}</div>
        <h3>${L(`मूलांक ${p.mulank} और योग ${r}`, `Birth no. ${p.mulank} and total ${r}`)} — <span class="${relCls(m1)}">${relWord(m1)}</span></h3>
        <p>${m1.k === "good" ? L(`${pl(p.mulank)} और ${pl(r)} एक-दूसरे के अनुकूल हैं। यह नंबर आपके स्वभाव के साथ सहजता से चलता है।`, `${pl(p.mulank)} and ${pl(r)} support each other. This number moves easily with your nature.`) : m1.k === "ok" ? L(`${pl(p.mulank)} और ${pl(r)} का मेल अच्छा है — एक तरफ़ से पूरा सहयोग मिलता है।`, `${pl(p.mulank)} and ${pl(r)} make a good match — support flows well in at least one direction.`) : L(`${pl(p.mulank)} और ${pl(r)} का मेल सामान्य है — न ज़्यादा लाभ, न हानि। उपाय से संतुलन बनता है।`, `${pl(p.mulank)} and ${pl(r)} are an average match — neither strong gain nor harm. Remedies bring balance.`)}</p>
        <h3>${L(`भाग्यांक ${p.bhagyank} और योग ${r}`, `Life path ${p.bhagyank} and total ${r}`)} — <span class="${relCls(m2)}">${relWord(m2)}</span></h3>
        <p>${m2.k === "mid" ? L("भाग्यांक से सामान्य मेल का अर्थ है कि बड़े लक्ष्यों में यह नंबर अपने आप तेज़ी नहीं देता — मेहनत और सही समय का चुनाव ज़्यादा काम आएगा।", "An average match with the life path means this number does not by itself speed up big goals — effort and good timing matter more.") : L("भाग्यांक से अच्छा मेल बताता है कि यह नंबर आपके लंबे लक्ष्यों और जीवन की दिशा का साथ देता है।", "A good match with the life path shows this number supports your long-term goals and life direction.")}</p>
        ${nn ? `<h3>${L(`नामांक ${nn.root} (${esc(o.name)})`, `Name number ${nn.root} (${esc(o.name)})`)} — <span class="${relCls(mn)}">${relWord(mn)}</span></h3><p>${L("नाम का अंक दिखाता है कि लोग आपको किस रूप में पहचानते हैं; नंबर का योग इससे मेल खाए तो फ़ोन पर आपकी बात का असर बढ़ता है।", "The name number shows how people know you; when the phone total matches it, your words carry more weight on calls.")}</p>` : ""}
        <h3>${L("स्कोर कैसे बना", "How the score was worked out")}</h3>
        <table class="t">${sc.map(([l, v]) => `<tr><td>${l}</td><td style="text-align:right"><b>${v > 0 ? "+" : ""}${v}</b></td></tr>`).join("")}<tr><td><b>${L("कुल", "Total")}</b></td><td style="text-align:right"><b>${score}/100</b></td></tr></table>
        <p class="sm">${L(`नंबर का उपयोग: ${purposeTxt}। स्कोर ग्रह-मैत्री, शुभ अंकों और अंकों के जोड़ों पर आधारित है।`, `Use of the number: ${purposeTxt}. The score is based on planetary friendship, lucky numbers and digit pairs.`)}</p>`),
      ch(2, `<h3>${L(`योग ${r} — ${pl(r)}`, `Total ${r} — ${pl(r)}`)}: ${MOB[0]}</h3><p>${MOB[1]}</p>
        <div class="g2"><div class="box"><b>${L("किस काम के लिए अच्छा", "Good for")}</b><p>${MOB[2]}</p></div><div class="box"><b>${L("ध्यान दें", "Watch out")}</b><p>${MOB[3]}</p></div></div>
        ${cp ? `<h3>${L(`संयुक्त अंक ${total}`, `Compound number ${total}`)} — "${N.cName(cp)}"</h3><p>${N.cText(cp)}</p><p class="sm">${L("संयुक्त अंक (10 से 52) की व्याख्या कीरो की पद्धति पर आधारित है। यह मूल योग के असर में रंग भरता है, उसे बदलता नहीं।", "Compound meanings (10–52) follow Cheiro's method. They colour the main total's effect; they do not replace it.")}</p>` : `<p class="sm">${L(`कुल योग ${total} है, जिसका संयुक्त अंक-अर्थ अलग से नहीं देखा जाता — मूल योग ${r} ही मुख्य है।`, `The total is ${total}; no separate compound meaning applies — the main total ${r} is what counts.`)}</p>`}
        <h3>${L(`आख़िरी अंक ${last}`, `Last digit ${last}`)}</h3><p>${last === 0 ? L("नंबर शून्य पर ख़त्म होता है। शून्य अपने आप में अशुभ नहीं, पर इसे नंबर का अंत 'खुला' छोड़ने वाला माना जाता है — शुभ रंग का उपाय यहाँ अच्छा काम करता है।", "The number ends in zero. Zero is not unlucky by itself, but it is said to leave the number's ending 'open' — the lucky-colour remedy works well here.") : L(`आख़िरी अंक ${last} (${pl(last)}) — ${DIG[last][0][0].split(" — ")[1]}। ${N.LUCKY[p.mulank].includes(last) ? "यह आपके शुभ अंकों में है — अच्छी बात।" : "यह आपके शुभ अंकों में नहीं, पर इससे कोई नुकसान नहीं माना जाता।"}`, `Last digit ${last} (${pl(last)}) — ${DIG[last][1][0].split(" — ")[1]}. ${N.LUCKY[p.mulank].includes(last) ? "It is one of your lucky numbers — good." : "It is not among your lucky numbers, but that causes no harm."}`)}</p>
        <h3>${L(`आख़िरी 4 अंक (${last4})`, `Last 4 digits (${last4})`)}</h3><p>${last4.split("").join(" + ")} = ${N.sumDigits(last4)} → <b>${l4} (${pl(l4)})</b>. ${L("कुछ अंक ज्योतिषी आख़िरी चार अंकों को भी देखते हैं।", "Some numerologists also look at the last four digits.")} ${N.LUCKY[p.mulank].includes(l4) ? L("यह भी आपके अनुकूल है।", "This also suits you.") : L("यह सामान्य है।", "This is neutral.")}</p>`),
      ch(3, `<h3>${L("अंकों की गिनती", "Digit count")}</h3>
        <table class="t"><tr><th>${L("अंक", "Digit")}</th><th>${L("ग्रह", "Planet")}</th><th>${L("कितनी बार", "Times")}</th><th>${L("क्या देता है", "What it brings")}</th><th>${L("आपके नंबर में", "In your number")}</th></tr>${digRows}</table>
        <div class="lsw"><div class="lsg">${grid}</div><div><h3 style="margin-top:0">${L("आपके नंबर का लो शू ग्रिड", "Lo Shu grid of your number")}</h3><p>${L("ग्रिड में नंबर के अंक उनकी पारंपरिक जगह पर रखे गए हैं।", "The digits of your number sit in their traditional places.")} ${missing.length ? L(`जो अंक नहीं हैं: <b>${missing.join(", ")}</b> — इनके गुणों पर थोड़ा ध्यान देना अच्छा है (ऊपर तालिका देखें)।`, `Missing: <b>${missing.join(", ")}</b> — it helps to give a little attention to their qualities (see the table above).`) : L("आपके नंबर में 1 से 9 तक सभी अंक हैं — बहुत संतुलित।", "Your number has every digit from 1 to 9 — very balanced.")} ${heavy.length ? L(`ज़्यादा बार आने वाले अंक: <b>${heavy.join(", ")}</b>।`, `Repeated digits: <b>${heavy.join(", ")}</b>.`) : ""}</p></div></div>
        <div class="keep"><h3>${L("अंकों की आपसी दोस्ती", "How neighbouring digits get along")}</h3><div class="strip">${pairStrip}</div>
        <p class="sm"><span class="key lk-f"></span>${L("मित्र", "friendly")} <span class="key lk-n"></span>${L("सम", "neutral")} <span class="key lk-m"></span>${L("मिश्रित", "mixed")} <span class="key lk-e"></span>${L("शत्रु", "enemy")}</p>
        <p>${L(`पास-पास के ${pairs.length} जोड़ों में ${pc.f} मित्र, ${pc.n} सम, ${pc.m} मिश्रित और ${pc.e} शत्रु जोड़े हैं।`, `Of ${pairs.length} neighbouring pairs, ${pc.f} are friendly, ${pc.n} neutral, ${pc.m} mixed and ${pc.e} enemy.`)} ${enemies.length ? L(`शत्रु जोड़े (${enemies.join(", ")}) से कभी-कभी काम में रुकावट या बातचीत में खिंचाव का संकेत माना जाता है — यह छोटी बात है और उपायों से संभल जाती है।`, `Enemy pairs (${enemies.join(", ")}) are read as occasional friction in work or talk — a minor point that remedies handle.`) : L("कोई शत्रु जोड़ा नहीं — अंक आपस में अच्छा तालमेल रखते हैं।", "No enemy pairs — the digits work well together.")} ${mixed.length ? L(`मिश्रित जोड़े: ${mixed.join(", ")}।`, `Mixed pairs: ${mixed.join(", ")}.`) : ""}</p></div>`),
      ch(4, `<p>${L(`योग ${r} (${pl(r)}) का असर जीवन के अलग-अलग क्षेत्रों में ऐसा माना जाता है:`, `The total ${r} (${pl(r)}) is read like this across areas of life:`)}</p>
        <div class="g2"><div class="box"><b>💼 ${L("काम और व्यापार", "Work and business")}</b><p>${A[0]}</p></div><div class="box"><b>💰 ${L("धन", "Money")}</b><p>${A[1]}</p></div>
        <div class="box"><b>🤝 ${L("रिश्ते और बातचीत", "Relationships and talk")}</b><p>${A[2]}</p></div><div class="box"><b>🧘 ${L("मन और आदतें", "Mind and habits")}</b><p>${A[3]}</p></div></div>
        ${X.purpose !== "personal" ? `<div class="box"><b>${L(`आपका उपयोग: ${purposeTxt}`, `Your use: ${purposeTxt}`)}</b><p>${N.PURPOSE[X.purpose].includes(r) ? L(`योग ${r} इस उपयोग के लिए अच्छा माना जाता है।`, `Total ${r} is considered good for this use.`) : L(`इस उपयोग के लिए ${N.PURPOSE[X.purpose].join(", ")} योग ज़्यादा अच्छे माने जाते हैं — पर आपके मूलांक से मेल सबसे ज़रूरी है, और उपाय काफ़ी हैं।`, `For this use, totals ${N.PURPOSE[X.purpose].join(", ")} are considered better — but the match with your birth number matters most, and the remedies are enough.`)}</p></div>` : ""}
        <p class="sm">${L("ये सामान्य संकेत हैं। आपकी कुंडली, मेहनत और परिस्थितियाँ इनसे ज़्यादा असर रखती हैं।", "These are general indications. Your horoscope, effort and circumstances matter more.")}</p>`),
      ch(5, `<div class="note">${score >= 45 ? L("आपका नंबर ठीक है — इसे बदलने की ज़रूरत नहीं। ये उपाय इसके अच्छे असर को बढ़ाने के लिए हैं।", "Your number is fine — no need to change it. These remedies add to its good effect.") : L("नंबर बदलना ज़रूरी नहीं। ये आसान उपाय ही संतुलन के लिए काफ़ी माने जाते हैं।", "Changing the number is not necessary. These easy remedies are considered enough for balance.")}</div>
        <ol class="rem">${rem.map(([t, d]) => `<li><b>${t}:</b> ${d}</li>`).join("")}</ol>
        <p class="sm">${L("उपाय श्रद्धा और सकारात्मक आदत के लिए हैं; इनमें कोई ख़र्च या डर की बात नहीं। कोई भी उपाय पैसों, स्वास्थ्य या क़ानूनी मामलों में विशेषज्ञ की सलाह की जगह नहीं लेता।", "Remedies are for faith and positive habit; they involve no big expense and nothing to fear. No remedy replaces expert advice on money, health or legal matters.")}</p>`),
      ch(6, `<p>${L("अभी नंबर बदलना ज़रूरी नहीं। पर जब भी नया नंबर (नई सिम, बिज़नेस नंबर) लें, तो यह चेकलिस्ट काम आएगी:", "You don't need to change now. But whenever you take a new number (new SIM, business line), this checklist helps:")}</p>
        <h3>${L("आपके लिए सबसे अच्छे कुल योग", "Best totals for you")}</h3><div class="sugg">${sugg.map((x) => `<span${x === r ? ' class="on"' : ""}><b>${x}</b><small>${pl(x)}</small></span>`).join("")}</div>
        <ul class="ck one"><li>${L(`कुल योग ऊपर दिए अंकों में से हो (सबसे पहले ${sugg[0]})।`, `Total should be one of the numbers above (first choice ${sugg[0]}).`)}</li>
        <li>${L("नंबर 0 पर ख़त्म न हो, और उसमें 3 से ज़्यादा शून्य न हों।", "The number should not end in 0, and should not have more than 3 zeros.")}</li>
        <li>${L(`आख़िरी अंक आपके शुभ अंकों में से हो: ${N.LUCKY[p.mulank].join(", ")}।`, `The last digit should be one of your lucky numbers: ${N.LUCKY[p.mulank].join(", ")}.`)}</li>
        <li>${L("एक ही अंक 4 या ज़्यादा बार लगातार न आए (जैसे 8888), जब तक वह आपका शुभ अंक न हो।", "Avoid one digit 4+ times in a row (like 8888) unless it is your lucky number.")}</li>
        <li>${L("नया नंबर लेने से पहले उसे इसी साइट के मुफ़्त टूल में जाँच लें — स्कोर 62 या ऊपर अच्छा है।", "Check the new number in the free tool on this site first — a score of 62 or more is good.")}</li></ul>`),
      ch(7, `<div class="kv"><div><small>${L("शुभ अंक", "Lucky numbers")}</small><b>${N.LUCKY[p.mulank].join(", ")}</b></div><div><small>${L("शुभ रंग", "Lucky colours")}</small><b>${H(N.COLORS[p.mulank])}</b></div><div><small>${L("शुभ दिन", "Lucky days")}</small><b>${H(N.DAYS[p.mulank])}</b></div>
        <div><small>${L("आपके ग्रह का मंत्र", "Your planet's mantra")}</small><b>${mantraOf(p.mulank)}</b></div><div><small>${L("रुद्राक्ष", "Rudraksha")}</small><b>${H(N.RUDRA[p.mulank])}</b></div><div><small>${L("नंबर का ग्रह", "Number's planet")}</small><b>${pl(r)}</b></div></div>
        <p>${L("किसी भी प्रश्न के लिए WhatsApp करें — रिपोर्ट से जुड़े सवालों का जवाब हम देते हैं।", "WhatsApp us with any question about this report — we answer.")}</p>`)
    ].join("");

    const title = L("मोबाइल नंबर अंक ज्योतिष रिपोर्ट", "Mobile Number Numerology Report");
    const ftr = `${L("ज्योतिष तर्क · मोबाइल नंबर रिपोर्ट", "Jyotish Tark · Mobile number report")} · ${String(o.name || "").replace(/["\\\n]/g, "")}`;
    const pgCss = `@page{@bottom-left{content:"${ftr}";font:600 8.5pt Mukta,sans-serif;color:#7A1F1F}@bottom-right{content:"${L("पृष्ठ", "Page")} " counter(page);font:600 8.5pt Mukta,sans-serif;color:#7A1F1F}}@page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    const numBoxes = digits.split("").map((d, i) => `<span class="nb${i === 5 ? " gap" : ""}">${d}</span>`).join("");
    return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(o.name || "")} — Jyotish Tark</title>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
<style>${CSS}${pgCss}</style></head><body><div class="wrap">
<section class="cover"><div class="fr"></div><div class="fr2"></div>
  <div class="mand">${N.mandalaSvg()}</div>
  <img class="logo" src="https://jyotishtark.in/logo.png" alt="">
  <p class="k">॥ ${L("ज्योतिष तर्क", "JYOTISH TARK")} ॥</p>
  <h1>${esc(title)}</h1>
  <div class="phone"><div class="scr"><small>${L("आपका नंबर", "Your number")}</small><div class="nums">${numBoxes}</div><div class="tot">${total} → <b>${r}</b> · ${pl(r)}</div></div></div>
  <p class="nm">${esc(o.name || "")}</p>
  <p class="dob">${L("जन्मतिथि", "Date of birth")}: ${p.d}-${p.mo}-${p.y}</p>
  <div class="cgrid">${box(L("मूलांक", "Birth no."), p.mulank, pl(p.mulank))}${box(L("भाग्यांक", "Life path"), p.bhagyank, pl(p.bhagyank))}${box(L("अनुकूलता", "Match"), score, band[0])}</div>
  <div class="by"><img src="https://jyotishtark.in/images/profile.jpg?v=2" alt=""><div><b>${L("आचार्य ज्ञानेन्द्र सिंह तोमर", "Acharya Gyanendra Singh Tomar")}</b><span>${L("ज्योतिष तर्क, लखनऊ", "Jyotish Tark, Lucknow")}</span></div></div>
  <p class="ft">${L("रिपोर्ट क्रमांक", "Report no.")} ${esc(rno)} · ${L("तैयार", "Prepared")}: ${dstr} · jyotishtark.in</p>
</section>
<section class="toc"><h2>${L("विषय सूची", "Contents")}</h2><ol>${toc.map((t, i) => `<li><span>${L("अध्याय", "Chapter")} ${i + 1}</span>${t}</li>`).join("")}</ol>
  <div class="box"><b>${L("इस रिपोर्ट को कैसे पढ़ें", "How to read this report")}</b><p>${L("अध्याय 1 पूरी रिपोर्ट का सार है। अध्याय 6 के उपाय सबसे काम के हैं — इन्हें आज से शुरू कर सकते हैं।", "Chapter 1 is the summary of the whole report. The remedies in chapter 6 are the most useful — you can start them today.")}</p></div>
  <p class="sm">${L("यह रिपोर्ट कैल्डियन अंक पद्धति, लो शू ग्रिड और पारंपरिक ग्रह-मैत्री पर आधारित है — वही गणना जो हमारी साइट के मुफ़्त टूल में है, पर पूरे विस्तार से।", "This report uses the Chaldean number system, the Lo Shu grid and traditional planetary friendship — the same calculation as our free tool, in full detail.")}</p></section>
${body}
<section class="close">${N.stampSvg(100)}<div><p><b>${L("ज्योतिष तर्क, लखनऊ", "Jyotish Tark, Lucknow")}</b><br>jyotishtark.in · WhatsApp +91 83185 13814</p>
<p class="sm">${L("यह रिपोर्ट अंक ज्योतिष पर आधारित सामान्य मार्गदर्शन है। यह किसी परिणाम की गारंटी नहीं है और चिकित्सा, क़ानूनी या वित्तीय सलाह की जगह नहीं लेती।", "This report is general guidance based on numerology. It does not guarantee any result and is not a substitute for medical, legal or financial advice.")}</p></div></section>
</div></body></html>`;
  }

  const CSS = `@page{size:A4;margin:14mm 13mm 15mm}@page:first{margin:0}
*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#2B1810;font-family:Mukta,'Noto Sans Devanagari',sans-serif;font-size:11.5pt;line-height:1.65;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{width:210mm;height:297mm;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 36%,#8E2A2A 0%,#5A1414 55%,#3A0B0B 100%);color:#F7E7C1;text-align:center;break-after:page;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18mm 22mm 26mm}
.cover .fr{position:absolute;inset:9mm;border:1.6px solid #E9C46A;border-radius:3mm}.cover .fr2{position:absolute;inset:12mm;border:.6px solid #E9C46A;border-radius:2mm}
.cover .mand{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:170mm;opacity:.22}.cover .mand svg{width:100%;height:auto}
.cover>*:not(.fr):not(.fr2):not(.mand):not(.ft){position:relative}
.cover .logo{width:24mm;height:24mm;border-radius:50%;background:#FBF4E4;padding:1.5mm;margin-bottom:2mm}
.cover .k{letter-spacing:.3em;font-size:10.5pt;color:#E9C46A;font-weight:700;margin:2mm 0 1mm}
.cover h1{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:29pt;margin:1mm 0 6mm;color:#FBEFD0;line-height:1.2}
.phone{width:120mm;border:2.2mm solid #1B0707;border-radius:9mm;background:#1B0707;box-shadow:0 0 0 .5mm #E9C46A,0 4mm 10mm rgba(0,0,0,.45)}
.phone .scr{border-radius:6mm;background:linear-gradient(160deg,#FBF1DC,#EED9A8);padding:5mm 4mm 4.5mm;color:#5A1414}
.phone small{display:block;font-size:9.5pt;font-weight:700;letter-spacing:.08em;color:#8A5A1A}
.nums{display:flex;justify-content:center;gap:1.4mm;margin:2.5mm 0}.nb{width:9.2mm;height:12mm;border-radius:1.6mm;background:#7A1F1F;color:#FBEFD0;font:700 17pt/12mm Mukta,sans-serif;text-align:center}.nb.gap{margin-left:3mm}
.tot{font-size:12pt;color:#5A1414}.tot b{font-size:15pt}
.cover .nm{font-family:'Tiro Devanagari Hindi',serif;font-size:22pt;margin:7mm 0 1mm;color:#fff}.cover .dob{font-size:12pt;color:#F3DFAE;margin:0}
.cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin:6mm 0 6mm;width:130mm}
.cb{border:1px solid #E9C46A;border-radius:3mm;padding:3mm 2mm;background:rgba(0,0,0,.18)}.cb small{display:block;font-size:9.5pt;color:#E9C46A;font-weight:700}.cb b{display:block;font-size:22pt;line-height:1.15;color:#fff}.cb span{font-size:9.5pt;color:#F3DFAE}
.by{display:flex;align-items:center;gap:3mm;text-align:left;background:rgba(0,0,0,.2);border:1px solid rgba(233,196,106,.6);border-radius:12mm;padding:1.8mm 6mm 1.8mm 1.8mm}.by img{width:14mm;height:14mm;border-radius:50%;object-fit:cover;border:.6mm solid #E9C46A}.by b{display:block;font-size:11.5pt;color:#FBEFD0}.by span{font-size:9.5pt;color:#E9C46A}
.cover .ft{position:absolute;bottom:17mm;left:0;right:0;font-size:9.6pt;color:#E9C46A}
.toc{break-after:page}.toc ol{list-style:none;padding:0;margin:2mm 0 4mm}.toc li{padding:1.6mm 0;border-bottom:1px dotted #D9C6A0}.toc li span{display:inline-block;width:26mm;color:#7A5A2A;font-size:10pt}
.ch{margin-top:9mm;padding-top:4mm;border-top:2px solid #C9A227}.toc+.ch{margin-top:0;border-top:0;padding-top:0}
.chn{margin:0;color:#B8892B;font-weight:700;letter-spacing:.08em;font-size:10pt;text-transform:uppercase;break-after:avoid}
h2{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;color:#7A1F1F;font-size:19pt;margin:1mm 0 4mm;padding-bottom:2mm;border-bottom:.8px solid #E3D3B0;line-height:1.3;break-after:avoid}
h3{font-size:13pt;color:#7A1F1F;margin:5mm 0 1.5mm;break-after:avoid}
p{margin:1.5mm 0}ul,ol{margin:1.5mm 0;padding-left:6mm}li{margin:1.2mm 0}.sm{font-size:9.8pt;color:#5B4B37}
table.t{width:100%;border-collapse:collapse;margin:2mm 0 3mm;font-size:10.6pt}table.t th{background:#7A1F1F;color:#fff;text-align:left;padding:2mm 2.5mm;font-weight:600}table.t td{border-bottom:1px solid #EADCC0;padding:1.8mm 2.5mm;vertical-align:top}table.t tr{break-inside:avoid}table.t td.n{font-weight:800;color:#7A1F1F;font-size:12pt}table.t td.c{text-align:center;font-weight:700}
.m-good{color:#14532D}.m-ok{color:#1D4ED8}.m-mid{color:#6B5444}
.box{border:1px solid #EADCC0;background:#FBF6EC;border-radius:2mm;padding:3mm 4mm;margin:2mm 0;break-inside:avoid}.box p{margin:1mm 0 0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:3mm 0}
.g3 .cb{background:#7A1F1F;border-color:#C9A227;text-align:center}.g3 .cb small{color:#F3DFAE}
.sum{display:grid;grid-template-columns:36mm 1fr;gap:5mm;align-items:center;margin-bottom:3mm}.sum .big{font-size:13pt;margin:0}
.ring{width:34mm;height:34mm;border-radius:50%;background:conic-gradient(#7A1F1F calc(var(--p)*1%),#EADCC0 0);display:grid;place-items:center}.ring>div{width:26mm;height:26mm;border-radius:50%;background:#fff;display:grid;place-items:center;align-content:center;text-align:center}.ring b{font-size:20pt;color:#7A1F1F;line-height:1}.ring small{font-size:9pt;color:#6B5444}
.lsw{display:grid;grid-template-columns:50mm 1fr;gap:5mm;align-items:start;margin-top:4mm;break-inside:avoid}.lsg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5mm}
.ls{aspect-ratio:1;border:1px solid #D9BE85;background:#FBF1DC;border-radius:2mm;display:grid;place-items:center;align-content:center;text-align:center}.ls b{font-size:13pt;color:#7A1F1F;letter-spacing:.05em}.ls small{font-size:8pt;color:#6B5444}.ls0{background:#fff;border-style:dashed}.ls0 b{color:#C8BBA5}
.strip{display:flex;flex-wrap:wrap;align-items:center;margin:2mm 0}.dg{width:8.5mm;height:10mm;border:1px solid #D9BE85;border-radius:1.5mm;background:#FBF1DC;display:grid;place-items:center;font-weight:800;color:#7A1F1F;font-size:13pt}
.lk{width:5mm;height:1.6mm;border-radius:1mm;background:#D6CBB8}.lk-f{background:#16A34A}.lk-n{background:#93A3B8}.lk-m{background:#E0A526}.lk-e{background:#DC2626}
.key{display:inline-block;width:5mm;height:2mm;border-radius:1mm;margin:0 1mm 0 3mm;vertical-align:middle}
.note{border:.5mm solid #C9A227;border-radius:2mm;background:#FBF6EC;padding:3.5mm 5mm;margin-bottom:3mm}
.rem li{margin:2.2mm 0;padding-left:1mm}
.sugg{display:flex;flex-wrap:wrap;gap:3mm;margin:2mm 0 3mm}.sugg span{border:1px solid #BBF7D0;background:#F0FDF4;border-radius:2mm;padding:2mm 5mm;text-align:center}.sugg span.on{border-color:#14532D;box-shadow:0 0 0 .4mm #14532D inset}.sugg b{display:block;color:#14532D;font-size:15pt}.sugg small{font-size:9pt}
.ck{list-style:none;padding-left:0}.ck li{padding-left:5mm;position:relative}.ck li::before{content:"✦";position:absolute;left:0;color:#B8892B;font-size:9pt}
.kv{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:2mm 0 4mm}.kv div{background:#FBF6EC;border:1px solid #EADCC0;border-radius:2mm;padding:2.5mm 3mm}.kv small{display:block;font-size:9pt;color:#6B5444}.kv b{color:#7A1F1F}
.keep,.strip,.sum,.g3,.kv,.sugg,.cb,.rem li{break-inside:avoid;page-break-inside:avoid}
.close{margin-top:10mm;display:flex;gap:6mm;align-items:center;border-top:1.5px solid #C9A227;padding-top:5mm;break-inside:avoid}
@media screen{body{background:#EDE6DA}.wrap{width:210mm;margin:0 auto}.toc,.ch,.close{background:#fff;padding:12mm 13mm;margin:6mm 0;box-shadow:0 2px 12px rgba(0,0,0,.15)}}
@media print{.wrap{width:auto}}`;

  // ---------- offer card under the free result ----------
  const OCSS = `.mr-offer{margin:18px 0 6px;border:2px solid #C9A227;border-radius:18px;background:linear-gradient(135deg,#FFF8EA,#FBEFD6);padding:18px;display:grid;grid-template-columns:150px 1fr;gap:18px;align-items:center;color:#2B1810}
.mr-offer h4{margin:0 0 6px;font-size:21px;color:#7A1F1F;line-height:1.3}.mr-offer ul{margin:6px 0 10px;padding-left:20px;font-size:15px;line-height:1.6}
.mr-cv{border-radius:10px;background:radial-gradient(ellipse at 50% 36%,#8E2A2A,#3A0B0B);color:#F7E7C1;text-align:center;padding:12px 8px;border:2px solid #E9C46A;box-shadow:0 6px 16px rgba(0,0,0,.25);font-size:11px;line-height:1.3}
.mr-cv b{display:block;font-size:13px;color:#FBEFD0;margin:4px 0 8px}.mr-cv .n{display:flex;justify-content:center;gap:2px;margin:6px 0}.mr-cv .n span{background:#7A1F1F;border:1px solid #E9C46A;border-radius:3px;width:11px;font-weight:700;color:#FBEFD0}
.mr-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.mr-row label{flex:1 1 200px;font-size:14px;font-weight:600}.mr-row input,.mr-row select{display:block;width:100%;margin-top:4px;padding:11px 12px;border:1px solid #D9BE85;border-radius:10px;font:inherit;font-size:16px;background:#fff;color:#2B1810}
.mr-buy{min-height:50px;padding:10px 22px;border:0;border-radius:12px;background:#7A1F1F;color:#fff;font:inherit;font-size:18px;font-weight:800;cursor:pointer}.mr-buy:hover{background:#5E1515}.mr-buy:focus-visible{outline:3px solid #C9A227;outline-offset:2px}
.mr-price{font-size:26px;font-weight:800;color:#7A1F1F}.mr-price s{font-size:16px;color:#8A7A66;font-weight:600;margin-left:6px}.mr-err{color:#B91C1C;font-size:14px;margin:6px 0 0;min-height:1em}.mr-sm{font-size:13px;color:#6B5444;margin:8px 0 0}
@media(max-width:600px){.mr-offer{grid-template-columns:1fr}.mr-cv{max-width:170px;margin:0 auto}}`;

  function after(d) {
    const out = document.getElementById("nmMobOut");
    if (!out || !d || !d.digits || d.digits.length !== 10) return;
    if (!document.getElementById("mr-css")) { const s = document.createElement("style"); s.id = "mr-css"; s.textContent = OCSS; document.head.appendChild(s); }
    const en = d.lang === "en", T = (h, e) => (en ? e : h);
    const box = document.createElement("div");
    box.className = "mr-offer"; box.id = "mrOffer";
    box.innerHTML = `<div class="mr-cv" aria-hidden="true">॥ ${T("ज्योतिष तर्क", "JYOTISH TARK")} ॥<b>${T("मोबाइल नंबर रिपोर्ट", "Mobile Number Report")}</b><div class="n">${d.digits.split("").map((x) => `<span>${x}</span>`).join("")}</div>${T("8 अध्याय · PDF", "8 chapters · PDF")}</div>
      <div><h4>${T(`पूरी रिपोर्ट — केवल ₹${PRICE}`, `Full report — only ₹${PRICE}`)}</h4>
      <ul><li>${T("सुंदर कवर पेज के साथ 8 अध्याय की PDF", "8-chapter PDF with a beautiful cover page")}</li><li>${T("मूलांक, भाग्यांक और नाम से पूरा मेल, स्कोर का पूरा हिसाब", "Full match with birth, life path and name numbers, score explained")}</li><li>${T("अंक-दर-अंक विश्लेषण, लो शू ग्रिड, काम-धन-रिश्तों पर असर", "Digit-by-digit analysis, Lo Shu grid, effect on work, money and relationships")}</li><li>${T("बहुत आसान उपाय — नंबर बदले बिना", "Very simple remedies — without changing your number")}</li></ul>
      <div class="mr-row"><label>${T("रिपोर्ट पर नाम", "Name on the report")}<input id="mrName" type="text" autocomplete="name" maxlength="60" value="${esc(d.name || "")}" placeholder="${T("जैसे Rahul Sharma", "e.g. Rahul Sharma")}"></label>
      <label style="flex:0 1 150px">${T("रिपोर्ट की भाषा", "Report language")}<select id="mrLang"><option value="hi"${en ? "" : " selected"}>हिंदी</option><option value="en"${en ? " selected" : ""}>English</option></select></label></div>
      ${d.dob ? "" : `<div class="mr-row" style="margin-top:8px"><label>${T("जन्मतिथि (ज़रूरी)", "Date of birth (required)")}<input id="mrDob" type="date"></label></div>`}
      <p class="mr-err" id="mrErr" aria-live="polite"></p>
      <div class="mr-row"><span class="mr-price">₹${PRICE}<s>₹499</s></span><button type="button" class="mr-buy" id="mrBuy">${T(`₹${PRICE} में रिपोर्ट पाएँ →`, `Get the report for ₹${PRICE} →`)}</button></div>
      <div data-promo></div>
      <p class="mr-sm">${T("UPI, कार्ड, नेट बैंकिंग · भुगतान के तुरंत बाद इसी पेज पर रिपोर्ट खुलेगी · बाद में 'मेरी रिपोर्ट' पेज से दोबारा डाउनलोड करें", "UPI, card, net banking · the report opens on this page right after paying · download again later from 'My report'")}</p></div>`;
    const old = document.getElementById("mrOffer"); if (old) old.remove();
    const anchor = out.querySelector(".nm-actions");
    if (anchor) anchor.parentNode.insertBefore(box, anchor); else out.appendChild(box);
    const read = () => {
      const name = box.querySelector("#mrName").value.trim(), lang = box.querySelector("#mrLang").value, dob = d.dob || (box.querySelector("#mrDob") || {}).value || "";
      const err = box.querySelector("#mrErr"); err.textContent = "";
      if (name.length < 2) { err.textContent = T("कृपया रिपोर्ट के लिए नाम लिखें।", "Please enter a name for the report."); box.querySelector("#mrName").focus(); return null; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) { err.textContent = T("कृपया जन्मतिथि भरें — रिपोर्ट के लिए ज़रूरी है।", "Please enter the date of birth — the report needs it."); return null; }
      ls.set(KEY, JSON.stringify({ mobile: d.digits, dob, name, purpose: d.purpose || "personal", lang, ts: Date.now() }));
      return { name, dob, lang, extra: { mobile: d.digits, purpose: d.purpose || "personal" } };
    };
    if (window.JTPromo && window.JTCheckout && window.JTCheckout.enabled()) window.JTPromo.ui(box.querySelector("[data-promo]"), "mobile", (off, h, msg, code) => {
      const o = read(); if (!o) { msg.textContent = T("कोड सही है — पहले ऊपर नाम और जन्मतिथि भरें।", "Code accepted — first fill in the name and date of birth above."); return false; }
      ga("mobile_report_promo", { off });
      window.JTCheckout.pay("mobile", o, { promo: code, title: T("प्रोमो कोड से रिपोर्ट", "Report with promo code"), lang: o.lang });
      return false;
    }, d.lang);
    box.querySelector("#mrBuy").addEventListener("click", () => {
      const o = read(); if (!o) return;
      const { name, dob, lang } = o;
      ga("mobile_report_click", { score: d.score });
      if (window.JTCheckout && window.JTCheckout.enabled()) window.JTCheckout.pay("mobile", o, { title: T("मोबाइल नंबर रिपोर्ट — ₹199", "Mobile number report — ₹199"), lang });
      else location.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(T(`नमस्ते, मुझे ₹199 की मोबाइल नंबर रिपोर्ट चाहिए। नंबर: ${d.digits}, नाम: ${name}, जन्मतिथि: ${dob}`, `Hello, I want the ₹199 mobile number report. Number: ${d.digits}, name: ${name}, DOB: ${dob}`));
    });
  }

  // ---------- delivery after payment ----------
  function viewer(html, o) {
    const en = o.lang === "en", T = (h, e) => (en ? e : h);
    if (!document.getElementById("mrv-css")) { const s = document.createElement("style"); s.id = "mrv-css"; s.textContent = `.mrv{position:fixed;inset:0;z-index:2147483000;background:#3B2A20;display:flex;flex-direction:column}.mrv-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:#7A1F1F;color:#fff;font-family:Mukta,system-ui,sans-serif}.mrv-top b{flex:1 1 220px;font-size:16px;line-height:1.35}.mrv-top small{display:block;font-weight:400;font-size:13px;color:#F3E9D6}.mrv-b{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:8px 16px;border:0;border-radius:10px;background:#15803D;color:#fff;font:inherit;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none}.mrv-b.l{background:#fff;color:#7A1F1F}.mrv iframe{flex:1;width:100%;border:0;background:#EDE6D9}html.mrv-on .jt-bot,html.mrv-on .jt-ad,html.mrv-on .whatsapp-float{display:none!important}`; document.head.appendChild(s); }
    document.documentElement.classList.add("mrv-on");
    const v = document.createElement("div"); v.className = "mrv";
    v.innerHTML = `<div class="mrv-top"><b>${T("आपकी मोबाइल नंबर रिपोर्ट तैयार है 🙏", "Your mobile number report is ready 🙏")}<small>${T("\"PDF डाउनलोड करें\" दबाएँ, फिर प्रिंट विंडो में \"Save as PDF\" चुनें।", "Press \"Download PDF\", then choose \"Save as PDF\" in the print window.")}</small></b>
      <button type="button" class="mrv-b" data-pdf>${T("PDF डाउनलोड करें", "Download PDF")}</button>
      <a class="mrv-b l" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(T(`नमस्ते, मेरी मोबाइल नंबर रिपोर्ट के बारे में एक प्रश्न है (ऑर्डर ${o.oid || "—"})।`, `Hello, I have a question about my mobile number report (order ${o.oid || "—"}).`))}">${T("WhatsApp सहायता", "WhatsApp help")}</a>
      <button type="button" class="mrv-b l" data-x>${T("बंद करें", "Close")}</button></div><iframe title="${T("मोबाइल नंबर रिपोर्ट", "Mobile number report")}"></iframe>`;
    document.body.appendChild(v);
    const fr = v.querySelector("iframe");
    fr.addEventListener("load", () => { try { const w = fr.clientWidth; if (w < 820) { const s = fr.contentDocument.createElement("style"); s.textContent = `@media screen{html{zoom:${(w / 820).toFixed(3)}}}`; fr.contentDocument.head.appendChild(s); } } catch (e) { /* ignore */ } });
    fr.srcdoc = html;
    v.querySelector("[data-pdf]").addEventListener("click", () => {
      let w = null;
      try { w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank"); } catch (e) { w = null; }
      if (w) w.addEventListener("load", () => setTimeout(() => { try { w.focus(); w.print(); } catch (e) { /* ignore */ } }, 800));
      else { fr.contentWindow.focus(); fr.contentWindow.print(); }
      ga("mobile_report_pdf", {});
    });
    v.querySelector("[data-x]").addEventListener("click", () => { v.remove(); document.documentElement.classList.remove("mrv-on"); });
  }
  function deliver() {
    const q = new URLSearchParams(location.search);
    if (q.get("jtpaid") !== "mobile" || !window.JTCheckout) return;
    let saved = null; try { saved = JSON.parse(ls.get(KEY) || "null"); } catch (e) { saved = null; }
    window.JTCheckout.confirm("mobile", (so, oid) => {
      const ex = so.extra || {};
      const o = { mobile: ex.mobile || (saved && saved.mobile), purpose: ex.purpose || (saved && saved.purpose) || "personal", dob: so.dob || (saved && saved.dob), name: so.name || (saved && saved.name), lang: so.lang || (saved && saved.lang) || "hi", oid };
      let tries = 0;
      (function wait() {
        if (!(window.JT_NM && window.JT_NM.numCalc && window.NM_CONTENT)) { if (++tries < 60) setTimeout(wait, 150); return; }
        let html;
        try { html = build(o); } catch (e) {
          alert(o.lang === "en" ? "The report could not be made automatically. Your payment is safe — please WhatsApp +91 83185 13814." : "रिपोर्ट अपने-आप नहीं बन सकी। आपका भुगतान सुरक्षित है — कृपया WhatsApp करें: 83185 13814");
          return;
        }
        viewer(html, o);
        if (!(saved && saved.oid === oid)) { ls.set(KEY, JSON.stringify(Object.assign({}, o, { oid, ts: Date.now() }))); ga("purchase", { value: Number(so.amount) || PRICE, currency: "INR", transaction_id: oid, items: [{ item_name: "Mobile number report" }] }); }
      })();
    }, saved && saved.lang);
  }

  window.JTMobileReport = { after, build, PRICE };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(deliver, 60)); else setTimeout(deliver, 60);
})();
