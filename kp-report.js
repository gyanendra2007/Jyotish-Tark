/* Jyotish Tark — KP (Krishnamurti Paddhati) reports.
   JTKPReport.build({ name, dob, time, place, lat, lng, lang:"hi"|"en", paid:bool, orderId })
   Free  = KP chart: chart, planet & cusp tables with star/sub lords, dasha, ruling planets, a short glimpse.
   Paid  = everything + significators, 14 life areas by cuspal sub-lord, period timing, 3-year dasha guide, remedies.
   Wording is cautious: KP shows promise and timing tendencies, not guarantees. */
(function () {
  "use strict";
  const PH = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const PA = { Sun: ["सू", "Su"], Moon: ["चं", "Mo"], Mars: ["मं", "Ma"], Mercury: ["बु", "Me"], Jupiter: ["गु", "Ju"], Venus: ["शु", "Ve"], Saturn: ["श", "Sa"], Rahu: ["रा", "Ra"], Ketu: ["के", "Ke"] };
  const SH = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const SE = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const NH = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"];
  const NE = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const MH = ["जन", "फ़र", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"];
  const ME = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // what each house is about (for dasha themes)
  const HT = {
    1: ["स्वयं, सेहत और आत्मविश्वास", "self, health and confidence"], 2: ["धन, परिवार और वाणी", "money, family and speech"], 3: ["साहस, संचार और छोटी यात्राएँ", "courage, communication and short trips"],
    4: ["घर, माता, वाहन और पढ़ाई", "home, mother, vehicle and studies"], 5: ["बुद्धि, प्रेम, संतान और रचनात्मकता", "intellect, romance, children and creativity"], 6: ["नौकरी, प्रतियोगिता और ऋण", "service, competition and loans"],
    7: ["विवाह, साझेदारी और समझौते", "marriage, partnership and agreements"], 8: ["अचानक बदलाव और बाधाएँ", "sudden changes and obstacles"], 9: ["भाग्य, धर्म, गुरु और लंबी यात्रा", "fortune, dharma, teachers and long travel"],
    10: ["कर्म, करियर और प्रतिष्ठा", "work, career and status"], 11: ["लाभ, इच्छापूर्ति और मित्र", "gains, wishes and friends"], 12: ["खर्च, विदेश, निवेश और विश्राम", "expenses, foreign lands, investment and rest"],
  };

  // life areas judged by the cuspal sub-lord (KP rules)
  const AREAS = [
    { h: 1, pos: [1, 5, 11], neg: [6, 8, 12], t: ["स्वास्थ्य, ऊर्जा और व्यक्तित्व", "Health, energy and personality"],
      w: ["पहले भाव का उप-स्वामी आपके शरीर की ऊर्जा, आत्मविश्वास और जीवन के प्रति दृष्टिकोण को बताता है।", "The sub-lord of the 1st cusp shows your physical energy, confidence and outlook on life."],
      tip: ["नियमित दिनचर्या, पर्याप्त नींद और व्यायाम आपकी ऊर्जा का आधार हैं। किसी भी स्वास्थ्य समस्या में डॉक्टर की सलाह ही अंतिम है — ज्योतिष केवल सावधानी का संकेत देता है।", "A regular routine, enough sleep and exercise are the base of your energy. For any health problem the doctor's advice is final — astrology only gives a signal for care."] },
    { h: 2, pos: [2, 6, 11], neg: [5, 8, 12], t: ["धन, बचत और परिवार", "Money, savings and family"],
      w: ["दूसरे भाव का उप-स्वामी धन संचय, बैंक बैलेंस, परिवार और वाणी का संकेतक है।", "The sub-lord of the 2nd cusp indicates accumulated wealth, bank balance, family and speech."],
      tip: ["हर महीने आय का एक तय हिस्सा अलग रखें और जोखिम भरे निवेश से पहले सलाह लें।", "Set aside a fixed part of income every month and take advice before risky investments."] },
    { h: 3, pos: [3, 9, 11], neg: [4, 8, 12], t: ["साहस, भाई-बहन और संचार", "Courage, siblings and communication"],
      w: ["तीसरा भाव पराक्रम, भाई-बहन, लेखन, मीडिया, छोटी यात्राओं और दस्तावेज़ों का है।", "The 3rd house rules initiative, siblings, writing, media, short trips and documents."],
      tip: ["अपने विचार लिखने, बोलने और सीखने की आदत डालें — संचार आपकी प्रगति का माध्यम है।", "Build the habit of writing, speaking and learning — communication is a channel of your growth."] },
    { h: 4, pos: [4, 9, 11], neg: [3, 8, 12], t: ["शिक्षा", "Education"],
      w: ["KP में चौथे भाव का उप-स्वामी बुनियादी शिक्षा का, और 9-11 भाव से उसका जुड़ाव शिक्षा में सफलता का संकेत है। 3, 8, 12 से जुड़ाव पढ़ाई में रुकावट या विषय बदलने का संकेत देता है।", "In KP the 4th-cusp sub-lord shows basic education; its link with houses 9 and 11 shows success. A link with 3, 8 or 12 shows breaks or a change of subject."],
      tip: ["नियमित अभ्यास और एक लक्ष्य पर टिके रहना ज़रूरी है; बार-बार विषय बदलने से बचें।", "Regular practice and staying on one goal matter; avoid changing subjects often."] },
    { h: 4, pos: [4, 11, 12], neg: [3, 8], t: ["मकान, भूमि और वाहन", "House, land and vehicle"],
      w: ["मकान या वाहन ख़रीदने के लिए चौथे भाव के उप-स्वामी का 4, 11 और 12 (निवेश) से जुड़ाव देखा जाता है। 3 भाव संपत्ति बेचने या बदलने का संकेत है।", "For buying a house or vehicle the 4th-cusp sub-lord should link with 4, 11 and 12 (investment). House 3 indicates selling or changing property."],
      tip: ["संपत्ति के काग़ज़ात की पूरी जाँच करें और ख़रीद अनुकूल दशा काल में करें।", "Check property papers fully and buy during a supportive period."] },
    { h: 5, pos: [2, 5, 11], neg: [1, 4, 10], t: ["संतान", "Children"],
      w: ["पाँचवें भाव का उप-स्वामी संतान सुख का संकेतक है। 2, 5, 11 से जुड़ाव अनुकूल माना जाता है; 1, 4, 10 से जुड़ाव देरी का संकेत देता है।", "The 5th-cusp sub-lord indicates children. A link with 2, 5 and 11 is favourable; with 1, 4 and 10 it indicates delay."],
      tip: ["यह विषय संवेदनशील है — ज्योतिष केवल समय का संकेत देता है। चिकित्सा संबंधी हर निर्णय डॉक्टर की सलाह से ही लें।", "This is a sensitive subject — astrology only indicates timing. Take every medical decision with a doctor's advice."] },
    { h: 5, pos: [5, 7, 11], neg: [6, 10, 12], t: ["प्रेम और प्रेम विवाह", "Love and love marriage"],
      w: ["पाँचवाँ भाव प्रेम का है। जब इसका उप-स्वामी 5, 7 और 11 से जुड़ा हो, तो प्रेम संबंध का विवाह में बदलना संभव माना जाता है।", "The 5th house is romance. When its sub-lord links with 5, 7 and 11, a relationship turning into marriage is considered possible."],
      tip: ["रिश्ते में ईमानदारी और परिवार से खुली बात सबसे बड़ा उपाय है।", "Honesty in the relationship and open talk with family are the best remedy."] },
    { h: 6, pos: [2, 6, 10, 11], neg: [5, 8, 12], t: ["नौकरी, प्रतियोगिता और ऋण", "Job, competition and loans"],
      w: ["छठा भाव नौकरी, सेवा, प्रतियोगी परीक्षा और ऋण चुकाने का है। 2, 6, 10, 11 से जुड़ाव नौकरी मिलने और प्रतियोगिता में जीत का संकेत है।", "The 6th house is service, competitive exams and repaying loans. A link with 2, 6, 10 and 11 indicates getting a job and winning competition."],
      tip: ["ऋण केवल ज़रूरत पर लें और समय पर चुकाएँ; प्रतियोगिता में निरंतर तैयारी ही सफलता देती है।", "Borrow only when needed and repay on time; steady preparation wins competition."] },
    { h: 7, pos: [2, 7, 11], neg: [1, 6, 10], t: ["विवाह और वैवाहिक जीवन", "Marriage and married life"],
      w: ["KP में सातवें भाव का उप-स्वामी विवाह का मुख्य निर्णायक है। 2, 7, 11 से जुड़ाव विवाह का वादा करता है; 1, 6, 10 से जुड़ाव देरी या मतभेद का संकेत देता है।", "In KP the 7th-cusp sub-lord is the main judge of marriage. A link with 2, 7 and 11 promises marriage; with 1, 6 and 10 it indicates delay or differences."],
      tip: ["विवाह का निर्णय आपसी समझ, परिवार और पूर्ण कुंडली मिलान से लें। विवाहित हों तो धैर्य और संवाद रिश्ते को मज़बूत रखते हैं।", "Decide marriage with mutual understanding, family and full kundali matching. If married, patience and conversation keep the bond strong."] },
    { h: 7, pos: [7, 10, 11], neg: [6, 8, 12], t: ["व्यवसाय और साझेदारी", "Business and partnership"],
      w: ["सातवाँ भाव साझेदारी और ग्राहकों का भी है। 7, 10, 11 से जुड़ाव व्यापार और साझेदारी में लाभ का संकेत देता है।", "The 7th house is also partnership and clients. A link with 7, 10 and 11 indicates gain in business and partnership."],
      tip: ["हर साझेदारी लिखित समझौते और साफ़ हिसाब से करें।", "Make every partnership with a written agreement and clear accounts."] },
    { h: 9, pos: [9, 11, 3], neg: [8, 12], t: ["भाग्य, उच्च शिक्षा और धर्म", "Fortune, higher learning and dharma"],
      w: ["नौवाँ भाव भाग्य, उच्च शिक्षा, गुरु, पिता और धार्मिक यात्राओं का है।", "The 9th house is fortune, higher learning, teachers, father and pilgrimages."],
      tip: ["गुरुजनों और पिता का सम्मान, और सीखते रहना भाग्य को सक्रिय करता है।", "Respect for teachers and father, and continuous learning, activate fortune."] },
    { h: 10, pos: [2, 6, 10, 11], neg: [5, 8, 12], t: ["करियर, पद और प्रतिष्ठा", "Career, position and status"],
      w: ["दसवें भाव का उप-स्वामी करियर की दिशा, पदोन्नति और समाज में प्रतिष्ठा बताता है। 2, 6, 10, 11 से जुड़ाव उन्नति का संकेत है।", "The 10th-cusp sub-lord shows career direction, promotion and status. A link with 2, 6, 10 and 11 indicates progress."],
      tip: ["अपने कौशल को लगातार बढ़ाएँ और अनुकूल दशा काल में बड़े कदम उठाएँ।", "Keep building your skills and take big steps in supportive periods."] },
    { h: 11, pos: [2, 6, 11], neg: [5, 8, 12], t: ["लाभ और इच्छापूर्ति", "Gains and fulfilment of wishes"],
      w: ["ग्यारहवाँ भाव हर प्रकार के लाभ, आय और इच्छाओं की पूर्ति का है। KP में किसी भी काम की सफलता के लिए 11 भाव का जुड़ाव ज़रूरी माना जाता है।", "The 11th house is every kind of gain, income and wish fulfilment. In KP a link with house 11 is needed for success in any matter."],
      tip: ["अच्छे मित्रों और संपर्कों का दायरा बढ़ाएँ — लाभ अक्सर इन्हीं से आता है।", "Grow a circle of good friends and contacts — gains often come through them."] },
    { h: 12, pos: [3, 9, 12], neg: [4, 11], t: ["विदेश यात्रा और विदेश में बसना", "Foreign travel and settling abroad"],
      w: ["विदेश के लिए बारहवें भाव का उप-स्वामी 3, 9, 12 से जुड़ा होना चाहिए। चौथा भाव (अपना घर) जुड़ा हो तो विदेश जाकर लौटने का संकेत होता है।", "For foreign lands the 12th-cusp sub-lord should link with 3, 9 and 12. If house 4 (home) is linked, it indicates going and returning."],
      tip: ["वीज़ा और नौकरी के काग़ज़ सही रखें; अनुकूल दशा काल में आवेदन करें।", "Keep visa and job papers in order; apply during a supportive period."] },
  ];

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function stampSvg(size) {
    const k = "#7A1F1F", s = size || 150;
    const star = (cx, cy) => `<path d="M${cx} ${cy - 5}L${cx + 1.5} ${cy - 1.5}L${cx + 5} ${cy}L${cx + 1.5} ${cy + 1.5}L${cx} ${cy + 5}L${cx - 1.5} ${cy + 1.5}L${cx - 5} ${cy}L${cx - 1.5} ${cy - 1.5}Z" fill="${k}"/>`;
    return `<svg width="${s}" height="${s}" viewBox="0 0 200 200" role="img" aria-label="Jyotish Tark"><defs><path id="kpT" d="M 38 100 A 62 62 0 0 1 162 100"/><path id="kpB" d="M 22 100 A 78 78 0 0 0 178 100"/></defs><circle cx="100" cy="100" r="96" fill="none" stroke="${k}" stroke-width="4.5"/><circle cx="100" cy="100" r="89.5" fill="none" stroke="${k}" stroke-width="1.2"/><circle cx="100" cy="100" r="85" fill="none" stroke="${k}" stroke-width="1.6" stroke-dasharray="0.1 3.6" stroke-linecap="round"/><circle cx="100" cy="100" r="50" fill="none" stroke="${k}" stroke-width="1.2"/><circle cx="100" cy="100" r="46" fill="none" stroke="${k}" stroke-width="2.6"/><text font-family="'Tiro Devanagari Hindi',serif" font-size="19" fill="${k}" letter-spacing="1.5"><textPath href="#kpT" startOffset="50%" text-anchor="middle">ज्योतिष तर्क</textPath></text><text font-family="Mukta,sans-serif" font-size="11.5" font-weight="700" fill="${k}" letter-spacing="2.2"><textPath href="#kpB" startOffset="50%" text-anchor="middle">JYOTISH TARK · LUCKNOW</textPath></text>${star(29, 100)}${star(171, 100)}<text x="100" y="117" text-anchor="middle" font-family="'Tiro Devanagari Hindi',serif" font-size="48" fill="${k}">ॐ</text><text x="100" y="134" text-anchor="middle" font-family="Mukta,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.2" fill="${k}">॥ शुभम् भवतु ॥</text></svg>`;
  }
  function mandalaSvg() {
    let g = "";
    for (let i = 0; i < 16; i++) g += `<ellipse cx="100" cy="47" rx="9.5" ry="27" transform="rotate(${i * 22.5} 100 100)" fill="none" stroke="#E9C46A" stroke-width="1"/>`;
    for (let i = 0; i < 16; i++) g += `<ellipse cx="100" cy="66" rx="6" ry="15" transform="rotate(${i * 22.5 + 11.25} 100 100)" fill="rgba(233,196,106,.12)" stroke="#E9C46A" stroke-width=".8"/>`;
    for (let i = 0; i < 48; i++) { const a = i * 7.5 * Math.PI / 180; g += `<circle cx="${(100 + 93 * Math.sin(a)).toFixed(2)}" cy="${(100 - 93 * Math.cos(a)).toFixed(2)}" r="1.3" fill="#E9C46A"/>`; }
    return `<svg viewBox="0 0 200 200" width="210" height="210" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="none" stroke="#E9C46A" stroke-width="1.4"/><circle cx="100" cy="100" r="88" fill="none" stroke="#E9C46A" stroke-width=".6"/>${g}<circle cx="100" cy="100" r="42" fill="#5A1414" stroke="#E9C46A" stroke-width="1.6"/><text x="100" y="114" text-anchor="middle" font-family="Mukta,sans-serif" font-weight="700" font-size="34" fill="#F7E7C1">KP</text></svg>`;
  }

  function build(o) {
    const K = window.JTKP;
    if (!K) throw new Error("KP engine not loaded");
    const hi = o.lang !== "en", L = (h, e) => (hi ? h : e), H = (pr) => (pr ? pr[hi ? 0 : 1] : "");
    const paid = !!o.paid;
    const c = K.compute({ dob: o.dob, time: o.time, lat: o.lat, lng: o.lng, tzZone: o.tzZone });
    const P = c.planets, now = new Date();
    const pn = (p) => (hi ? PH[p] : p), sn = (i) => (hi ? SH[i - 1] : SE[i - 1]), nk = (i) => (hi ? NH[i - 1] : NE[i - 1]);
    const dms = (x) => { const d = Math.floor(x), m = Math.floor((x - d) * 60), s = Math.round(((x - d) * 60 - m) * 60); return `${String(d).padStart(2, "0")}°${String(m).padStart(2, "0")}'${String(s === 60 ? 59 : s).padStart(2, "0")}"`; };
    const my = (d) => `${(hi ? MH : ME)[d.getMonth()]} ${d.getFullYear()}`;
    const dmy = (d) => `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
    const hs = (arr) => (arr && arr.length ? arr.join(", ") : "—");
    const [by, bm, bd] = o.dob.split("-").map(Number);
    const dob = `${String(bd).padStart(2, "0")}-${String(bm).padStart(2, "0")}-${by}`;
    const cur = K.currentDasha(c.dasha, now);
    const RP = K.rulingPlanets(now, c.lat, c.lng);
    const rno = o.orderId || ("JTKP-" + String(by).slice(2) + String(bm).padStart(2, "0") + String(bd).padStart(2, "0") + "-" + String(o.time || "").replace(":", ""));
    const today = dmy(now);
    const CH = [];
    const add = (t, h) => CH.push([t, h]);

    // ---------- verdict helpers ----------
    const inter = (a, b) => a.filter((x) => b.includes(x));
    function judge(A) {
      const csl = c.cusps[A.h].sub, s = c.sig[csl];
      const pStar = inter(s.viaStar, A.pos), nStar = inter(s.viaStar, A.neg), pSelf = inter(s.self, A.pos);
      let k = "weak";
      if (pStar.length && !nStar.length) k = "good"; else if (pStar.length) k = "mixed"; else if (pSelf.length) k = "mid";
      return { csl, star: P[csl].star, s, k, pStar, nStar };
    }
    const VK = {
      good: [["प्रबल वादा", "Strong promise"], "v-good"],
      mixed: [["वादा है — बाधाओं के साथ", "Promised — with obstacles"], "v-mixed"],
      mid: [["सामान्य / आंशिक", "Moderate / partial"], "v-mid"],
      weak: [["अधिक प्रयास आवश्यक", "Needs more effort"], "v-weak"],
    };
    const vText = (k, t) => ({
      good: L(`${t} के लिए उप-स्वामी अपने नक्षत्र स्वामी के माध्यम से अनुकूल भावों से जुड़ा है और विरोधी भावों से नहीं। KP के अनुसार यह इस विषय का स्पष्ट वादा है — अनुकूल दशा आने पर परिणाम मिलने की संभावना अच्छी है।`, `For ${t.toLowerCase()} the sub-lord connects, through its star lord, with the favourable houses and not with the opposing ones. In KP this is a clear promise — results are likely when a supportive period runs.`),
      mixed: L(`${t} का वादा है, पर उप-स्वामी विरोधी भावों से भी जुड़ा है। इसका अर्थ है कि परिणाम मिलेगा, पर देरी, बदलाव या कुछ संघर्ष के बाद। धैर्य और सही समय का चुनाव यहाँ सबसे महत्वपूर्ण है।`, `${t} is promised, but the sub-lord is also linked to opposing houses. Results come, but after delay, change or some struggle. Patience and choosing the right time matter most here.`),
      mid: L(`${t} के लिए उप-स्वामी स्वयं अनुकूल भावों से जुड़ा है, पर उसके नक्षत्र स्वामी का समर्थन कमज़ोर है। परिणाम मध्यम रहते हैं और मेहनत के अनुपात में मिलते हैं।`, `For ${t.toLowerCase()} the sub-lord itself touches the favourable houses, but its star lord gives weak support. Results are moderate and come in proportion to effort.`),
      weak: L(`${t} के लिए उप-स्वामी अनुकूल भावों से सीधा नहीं जुड़ता। यह "नहीं होगा" का संकेत नहीं है — बल्कि यह बताता है कि इस विषय में स्वाभाविक सहजता कम है और अधिक प्रयास, धैर्य और सही मार्गदर्शन चाहिए।`, `For ${t.toLowerCase()} the sub-lord does not directly connect with the favourable houses. This is not a "never" — it shows less natural ease here, so more effort, patience and right guidance are needed.`),
    }[k]);

    // supportive periods (antardasha level) in the next 20 years
    function periods(A, max) {
      const until = now.getTime() + 20 * 365.25 * 864e5, out = [];
      for (const m of c.dasha.md) for (const a of m.ad) {
        if (a.end < now || a.start > until) continue;
        const mOk = inter(c.sig[m.lord].all, A.pos).length, aOk = inter(c.sig[a.lord].all, A.pos);
        const aNeg = inter(c.sig[a.lord].viaStar, A.neg);
        if (mOk && aOk.length) out.push({ m: m.lord, a: a.lord, s: a.start < now ? now : a.start, e: a.end, n: aOk.length - (aNeg.length ? 1 : 0) });
      }
      return out.sort((x, y) => y.n - x.n || x.s - y.s).slice(0, max).sort((x, y) => x.s - y.s);
    }

    // ---------- North Indian chart (KP houses) ----------
    function chart() {
      const cen = { 1: [200, 95], 2: [100, 36], 3: [36, 100], 4: [100, 205], 5: [36, 300], 6: [100, 362], 7: [200, 305], 8: [300, 362], 9: [364, 300], 10: [300, 205], 11: [364, 100], 12: [300, 36] };
      const num = { 1: [200, 165], 2: [100, 80], 3: [80, 100], 4: [162, 200], 5: [80, 300], 6: [100, 322], 7: [200, 240], 8: [300, 322], 9: [320, 300], 10: [238, 200], 11: [320, 100], 12: [300, 80] };
      let t = "";
      for (let h = 1; h <= 12; h++) {
        const list = K.PL.filter((p) => P[p].house === h).map((p) => H(PA[p]) + (P[p].retro ? "ᴿ" : ""));
        const [x, y] = cen[h], [nx, ny] = num[h];
        t += `<text x="${nx}" y="${ny + 4}" class="cn">${c.cusps[h].sign}</text>`;
        list.forEach((s, i) => { const row = Math.floor(i / 2), col = i % 2, cnt = Math.min(2, list.length - row * 2); t += `<text x="${x + (cnt === 2 ? (col ? 15 : -15) : 0)}" y="${y + row * 17 - (list.length > 2 ? 8 : 0)}" class="cp">${s}</text>`; });
      }
      return `<svg viewBox="0 0 400 400" class="nchart" role="img" aria-label="${L("KP कुंडली", "KP chart")}"><rect x="2" y="2" width="396" height="396" fill="#FFFCF5" stroke="#7A1F1F" stroke-width="3"/><path d="M2 2L398 398M398 2L2 398M200 2L398 200L200 398L2 200Z" fill="none" stroke="#7A1F1F" stroke-width="2"/>${t}</svg>`;
    }

    // ---------- chapters ----------
    const det = `<table class="t kv"><tbody>
      <tr><td>${L("नाम", "Name")}</td><td><b>${esc(o.name)}</b></td><td>${L("जन्मतिथि", "Date of birth")}</td><td><b>${dob}</b></td></tr>
      <tr><td>${L("जन्म समय", "Time of birth")}</td><td><b>${esc(o.time)}</b></td><td>${L("जन्म स्थान", "Place of birth")}</td><td><b>${esc(o.place || "")}</b></td></tr>
      <tr><td>${L("अक्षांश / देशांतर", "Latitude / longitude")}</td><td>${(+c.lat).toFixed(2)}° / ${(+c.lng).toFixed(2)}°</td><td>${L("समय क्षेत्र", "Time zone")}</td><td>${esc(c.tz.tzLabel || "")}</td></tr>
      <tr><td>${L("अयनांश", "Ayanamsa")}</td><td>KP (${L("कृष्णमूर्ति", "Krishnamurti")}) ${dms(c.ayanamsa)}</td><td>${L("भाव पद्धति", "House system")}</td><td>${L("प्लेसिडस", "Placidus")}</td></tr>
    </tbody></table>`;

    add(L("KP पद्धति और आपका जन्म विवरण", "KP system and your birth details"), `
      <p>${L("कृष्णमूर्ति पद्धति (KP) को प्रोफ़ेसर के. एस. कृष्णमूर्ति ने विकसित किया। यह वैदिक ज्योतिष पर आधारित है, पर इसमें हर भाव और ग्रह को राशि और नक्षत्र से आगे “उप-स्वामी” (Sub Lord) तक बाँटा जाता है। इसी सूक्ष्म विभाजन के कारण KP घटनाओं के होने या न होने और उनके समय का आकलन अधिक स्पष्ट रूप से करने के लिए जानी जाती है।", "Krishnamurti Paddhati (KP) was developed by Prof. K. S. Krishnamurti. It is based on Vedic astrology, but divides every house and planet beyond sign and nakshatra down to the “sub-lord”. This fine division is why KP is known for judging more clearly whether an event will happen and when.")}</p>
      ${det}
      <div class="box"><b>${L("KP के तीन मूल नियम", "Three basic rules of KP")}</b><ol>
        <li>${L("ग्रह अपने <b>नक्षत्र स्वामी</b> के भावों का फल देता है — यानी परिणाम “क्या” मिलेगा, यह नक्षत्र स्वामी बताता है।", "A planet gives the results of the houses of its <b>star lord</b> — the star lord tells “what” the result will be.")}</li>
        <li>${L("<b>उप-स्वामी</b> तय करता है कि वह परिणाम अनुकूल होगा या नहीं।", "The <b>sub-lord</b> decides whether that result will be favourable or not.")}</li>
        <li>${L("किसी भाव के <b>आरंभ बिंदु (कस्प) का उप-स्वामी</b> बताता है कि उस भाव से जुड़ा विषय जीवन में मिलने का वादा है या नहीं; और दशा-भुक्ति बताती है कि कब।", "The <b>sub-lord of a house cusp</b> tells whether the matters of that house are promised in life; the dasha periods tell when.")}</li></ol></div>
      <p class="sm">${L("KP जन्म समय के प्रति बहुत संवेदनशील है — लग्न का उप-स्वामी कुछ ही मिनटों में बदल सकता है। इसलिए सटीक जन्म समय (अस्पताल रिकॉर्ड या जन्म प्रमाणपत्र से) ही प्रयोग करें।", "KP is very sensitive to birth time — the sub-lord of the ascendant can change within a few minutes. Use an exact birth time (from hospital records or the birth certificate).")}</p>`);

    const prow = K.PL.map((p) => { const x = P[p]; return `<tr><td><b>${pn(p)}</b>${x.retro ? ` <small>(${L("वक्री", "R")})</small>` : ""}</td><td>${sn(x.sign)}</td><td>${dms(x.deg)}</td><td>${nk(x.nak)} ${x.pada}</td><td>${pn(x.signLord)}</td><td>${pn(x.star)}</td><td><b>${pn(x.sub)}</b></td>${paid ? `<td>${pn(x.subSub)}</td>` : ""}<td class="n">${x.house}</td></tr>`; }).join("");
    const crow = Array.from({ length: 12 }, (_, i) => i + 1).map((h) => { const x = c.cusps[h]; return `<tr><td class="n">${h}</td><td>${sn(x.sign)}</td><td>${dms(x.deg)}</td><td>${nk(x.nak)}</td><td>${pn(x.signLord)}</td><td>${pn(x.star)}</td><td><b>${pn(x.sub)}</b></td>${paid ? `<td>${pn(x.subSub)}</td>` : ""}</tr>`; }).join("");

    add(L("KP कुंडली — भाव चलित (प्लेसिडस)", "KP chart — Placidus houses"), `
      <div class="chw">${chart()}<div><p>${L("यह कुंडली KP के प्लेसिडस भावों पर बनी है। हर खाने में लिखी संख्या उस भाव के आरंभ बिंदु (कस्प) की राशि है, और ग्रह उसी भाव में दिखाए गए हैं जिसमें वे KP गणना से आते हैं — इसलिए यह सामान्य राशि-कुंडली से थोड़ी अलग हो सकती है।", "This chart uses KP Placidus houses. The number in each box is the sign of that house cusp, and planets are shown in the house they fall in by KP calculation — so it can differ a little from the ordinary sign chart.")}</p>
      <table class="t kv"><tbody><tr><td>${L("लग्न", "Ascendant")}</td><td><b>${sn(c.cusps[1].sign)} ${dms(c.cusps[1].deg)}</b></td></tr><tr><td>${L("लग्न नक्षत्र", "Ascendant star")}</td><td><b>${nk(c.cusps[1].nak)}</b> (${pn(c.cusps[1].star)})</td></tr><tr><td>${L("लग्न उप-स्वामी", "Ascendant sub-lord")}</td><td><b>${pn(c.cusps[1].sub)}</b></td></tr><tr><td>${L("चंद्र राशि / नक्षत्र", "Moon sign / star")}</td><td><b>${sn(P.Moon.sign)} · ${nk(P.Moon.nak)}</b></td></tr></tbody></table>
      <p class="sm">${L("ᴿ = वक्री ग्रह। सू सूर्य, चं चंद्र, मं मंगल, बु बुध, गु गुरु, शु शुक्र, श शनि, रा राहु, के केतु।", "ᴿ = retrograde. Su Sun, Mo Moon, Ma Mars, Me Mercury, Ju Jupiter, Ve Venus, Sa Saturn, Ra Rahu, Ke Ketu.")}</p></div></div>`);

    add(L("ग्रह — राशि, नक्षत्र और उप-स्वामी", "Planets — sign, star and sub-lord"), `
      <table class="t sm2"><thead><tr><th>${L("ग्रह", "Planet")}</th><th>${L("राशि", "Sign")}</th><th>${L("अंश", "Degree")}</th><th>${L("नक्षत्र पद", "Star · pada")}</th><th>${L("राशि स्वामी", "Sign lord")}</th><th>${L("नक्षत्र स्वामी", "Star lord")}</th><th>${L("उप-स्वामी", "Sub lord")}</th>${paid ? `<th>${L("उप-उप", "Sub-sub")}</th>` : ""}<th>${L("भाव", "House")}</th></tr></thead><tbody>${prow}</tbody></table>
      <h3>${L("भाव आरंभ बिंदु (कस्प)", "House cusps")}</h3>
      <table class="t sm2"><thead><tr><th>${L("भाव", "House")}</th><th>${L("राशि", "Sign")}</th><th>${L("अंश", "Degree")}</th><th>${L("नक्षत्र", "Star")}</th><th>${L("राशि स्वामी", "Sign lord")}</th><th>${L("नक्षत्र स्वामी", "Star lord")}</th><th>${L("उप-स्वामी", "Sub lord")}</th>${paid ? `<th>${L("उप-उप", "Sub-sub")}</th>` : ""}</tr></thead><tbody>${crow}</tbody></table>`);

    if (paid) {
      const own = (p) => (c.owns[p].length ? c.owns[p].join(", ") : "—");
      const srow = K.PL.map((p) => `<tr><td><b>${pn(p)}</b></td><td class="n">${P[p].house}</td><td>${own(p)}</td><td>${pn(P[p].star)}</td><td>${hs(c.sig[p].viaStar)}</td><td><b>${hs(c.sig[p].all)}</b></td></tr>`).join("");
      const hrow = Array.from({ length: 12 }, (_, i) => i + 1).map((h) => { const s = c.houseSig[h], f = (a) => (a.length ? a.map(pn).join(", ") : "—"); return `<tr><td class="n">${h}</td><td>${f(s.A)}</td><td>${f(s.B)}</td><td>${f(s.C)}</td><td>${f(s.D)}</td></tr>`; }).join("");
      add(L("कारक ग्रह (Significators)", "Significators"), `
        <p>${L("KP में हर ग्रह कुछ भावों का “कारक” होता है — यानी अपनी दशा में वह उन्हीं भावों के फल देता है। सबसे अधिक बल नक्षत्र स्वामी के भावों का होता है, फिर ग्रह के अपने भावों का।", "In KP every planet is a “significator” of some houses — in its period it gives the results of those houses. The star lord's houses carry the most weight, then the planet's own houses.")}</p>
        <table class="t sm2"><thead><tr><th>${L("ग्रह", "Planet")}</th><th>${L("स्थित भाव", "In house")}</th><th>${L("स्वामित्व", "Owns")}</th><th>${L("नक्षत्र स्वामी", "Star lord")}</th><th>${L("नक्षत्र स्वामी से भाव", "Houses via star lord")}</th><th>${L("कुल कारक भाव", "All houses signified")}</th></tr></thead><tbody>${srow}</tbody></table>
        <h3>${L("भाव अनुसार चार स्तर के कारक", "Four-level significators by house")}</h3>
        <table class="t sm2"><thead><tr><th>${L("भाव", "House")}</th><th>A · ${L("स्थित ग्रहों के नक्षत्र में", "in star of occupants")}</th><th>B · ${L("भाव में स्थित", "occupants")}</th><th>C · ${L("स्वामी के नक्षत्र में", "in star of owner")}</th><th>D · ${L("भाव स्वामी", "owner")}</th></tr></thead><tbody>${hrow}</tbody></table>
        <p class="sm">${L("A स्तर सबसे बलवान और D सबसे कमज़ोर माना जाता है। राहु-केतु अपनी राशि के स्वामी के प्रतिनिधि (एजेंट) के रूप में भी फल देते हैं।", "Level A is strongest and D weakest. Rahu and Ketu also act as agents of their sign lord.")}</p>`);
    }

    // ---------- life areas ----------
    const verdicts = AREAS.map((A) => ({ A, j: judge(A) }));
    const vBadge = (k) => `<span class="vb ${VK[k][1]}">${H(VK[k][0])}</span>`;
    if (paid) {
      const sumRows = verdicts.map(({ A, j }) => `<tr><td>${H(A.t)}</td><td class="n">${A.h}</td><td>${pn(j.csl)}</td><td>${vBadge(j.k)}</td></tr>`).join("");
      add(L("जीवन के 14 विषय — एक नज़र में", "14 areas of life — at a glance"), `
        <p>${L("नीचे हर विषय के लिए संबंधित भाव के उप-स्वामी (CSL) का निर्णय है। अगले अध्यायों में हर विषय का विस्तृत विश्लेषण और अनुकूल समय दिया गया है।", "Below is the verdict of the cuspal sub-lord (CSL) for each subject. The following chapters give each one in detail with supportive periods.")}</p>
        <table class="t"><thead><tr><th>${L("विषय", "Area")}</th><th>${L("भाव", "Cusp")}</th><th>${L("उप-स्वामी", "Sub lord")}</th><th>${L("निर्णय", "Verdict")}</th></tr></thead><tbody>${sumRows}</tbody></table>
        <div class="box"><b>${L("इन निर्णयों को कैसे समझें", "How to read these verdicts")}</b><p>${L("“प्रबल वादा” का अर्थ है स्वाभाविक सहजता; “बाधाओं के साथ” का अर्थ है देरी या संघर्ष के बाद परिणाम; “सामान्य” का अर्थ है मेहनत के अनुपात में फल; और “अधिक प्रयास आवश्यक” का अर्थ है कि इस विषय में सावधानी और धैर्य रखें। कोई भी निर्णय अंतिम भाग्य नहीं है — कर्म और सही समय परिणाम बदलते हैं।", "“Strong promise” means natural ease; “with obstacles” means results after delay or struggle; “moderate” means results in proportion to effort; and “needs more effort” means be careful and patient here. No verdict is final destiny — action and right timing change results.")}</p></div>`);

      const parts = [[0, 3], [3, 7], [7, 10], [10, 14]], titles = [["स्वयं, धन, संचार और शिक्षा", "Self, money, communication and education"], ["घर, संतान, प्रेम और नौकरी", "Home, children, love and job"], ["विवाह, साझेदारी और भाग्य", "Marriage, partnership and fortune"], ["करियर, लाभ और विदेश", "Career, gains and foreign lands"]];
      parts.forEach(([a, b], pi) => {
        add(L(`विस्तृत विश्लेषण — ${titles[pi][0]}`, `Detailed analysis — ${titles[pi][1]}`), verdicts.slice(a, b).map(({ A, j }) => {
          const per = periods(A, 4);
          return `<div class="area"><h3>${H(A.t)} <small>· ${L("भाव", "cusp")} ${A.h}</small> ${vBadge(j.k)}</h3>
            <p>${H(A.w)}</p>
            <p class="calc">${L(`उप-स्वामी <b>${pn(j.csl)}</b> → नक्षत्र स्वामी <b>${pn(j.star)}</b> → कारक भाव <b>${hs(j.s.viaStar)}</b>; स्वयं ${hs(j.s.self)}। अनुकूल भाव ${A.pos.join(", ")} · विरोधी भाव ${A.neg.join(", ")}।`, `Sub-lord <b>${j.csl}</b> → star lord <b>${j.star}</b> → houses <b>${hs(j.s.viaStar)}</b>; itself ${hs(j.s.self)}. Favourable ${A.pos.join(", ")} · opposing ${A.neg.join(", ")}.`)}</p>
            <p>${vText(j.k, H(A.t))}</p>
            ${per.length ? `<p><b>${L("अगले वर्षों में सहायक समय (दशा–भुक्ति)", "Supportive periods ahead (dasha–bhukti)")}:</b></p><ul class="per">${per.map((x) => `<li>${pn(x.m)}–${pn(x.a)} · ${my(x.s)} – ${my(x.e)}</li>`).join("")}</ul>` : `<p class="sm">${L("अगले 20 वर्षों में इस विषय के लिए दशा और भुक्ति दोनों का एक साथ प्रबल समर्थन नहीं दिखता; ऐसे में गोचर और प्रश्न कुंडली से समय देखा जाता है।", "In the next 20 years no period shows strong support from both dasha and bhukti for this subject; timing is then checked by transits and a horary chart.")}</p>`}
            <p class="tip">💡 ${H(A.tip)}</p></div>`;
        }).join(""));
      });
    }

    // ---------- dasha ----------
    const mdRows = c.dasha.md.slice(0, 9).map((m) => `<tr${cur && m === cur.md ? ' class="cur"' : ""}><td><b>${pn(m.lord)}</b></td><td>${dmy(m.start)}</td><td>${dmy(m.end)}</td>${paid ? `<td>${hs(c.sig[m.lord].all)}</td>` : ""}</tr>`).join("");
    const theme = (p) => c.sig[p].viaStar.slice(0, 3).map((h) => H(HT[h])).join("; ");
    let dashaHtml = `<p>${L(`जन्म के समय चंद्रमा ${nk(P.Moon.nak)} नक्षत्र में था, इसलिए जीवन की शुरुआत ${pn(c.dasha.balance.lord)} की महादशा से हुई (शेष लगभग ${c.dasha.balance.years.toFixed(1)} वर्ष)। KP में दशा की गणना KP अयनांश और 365.25 दिन के वर्ष से की गई है।`, `At birth the Moon was in ${nk(P.Moon.nak)}, so life began in the ${c.dasha.balance.lord} period (about ${c.dasha.balance.years.toFixed(1)} years remaining). Dashas are calculated with KP ayanamsa and a 365.25-day year.`)}</p>
      <table class="t"><thead><tr><th>${L("महादशा", "Mahadasha")}</th><th>${L("आरंभ", "From")}</th><th>${L("समाप्ति", "To")}</th>${paid ? `<th>${L("कारक भाव", "Houses signified")}</th>` : ""}</tr></thead><tbody>${mdRows}</tbody></table>`;
    if (cur) {
      dashaHtml += `<div class="box"><b>${L("अभी चल रहा समय", "Running now")}</b><p>${L(`महादशा <b>${pn(cur.md.lord)}</b> · अंतर्दशा <b>${pn(cur.ad.lord)}</b> (${dmy(cur.ad.start)} से ${dmy(cur.ad.end)}) · प्रत्यंतर <b>${pn(cur.pd.lord)}</b> (${dmy(cur.pd.end)} तक)`, `Mahadasha <b>${cur.md.lord}</b> · bhukti <b>${cur.ad.lord}</b> (${dmy(cur.ad.start)} to ${dmy(cur.ad.end)}) · antara <b>${cur.pd.lord}</b> (till ${dmy(cur.pd.end)})`)}</p>
        <p>${L(`इस समय मुख्य रूप से इन विषयों पर ध्यान रहता है: <b>${theme(cur.ad.lord)}</b>।`, `This time mainly brings focus on: <b>${theme(cur.ad.lord)}</b>.`)}</p></div>`;
    }
    if (paid && cur) {
      const adRows = cur.md.ad.map((a) => `<tr${a === cur.ad ? ' class="cur"' : ""}><td><b>${pn(cur.md.lord)}–${pn(a.lord)}</b></td><td>${dmy(a.start)}</td><td>${dmy(a.end)}</td><td>${hs(c.sig[a.lord].all)}</td></tr>`).join("");
      const pdRows = cur.ad.pd.map((p) => `<tr${p === cur.pd ? ' class="cur"' : ""}><td>${pn(p.lord)}</td><td>${dmy(p.start)}</td><td>${dmy(p.end)}</td><td>${hs(c.sig[p.lord].viaStar)}</td></tr>`).join("");
      dashaHtml += `<h3>${L(`${pn(cur.md.lord)} महादशा की सभी अंतर्दशाएँ`, `All bhuktis of the ${cur.md.lord} mahadasha`)}</h3>
        <table class="t sm2"><thead><tr><th>${L("दशा–भुक्ति", "Dasha–bhukti")}</th><th>${L("आरंभ", "From")}</th><th>${L("समाप्ति", "To")}</th><th>${L("कारक भाव", "Houses")}</th></tr></thead><tbody>${adRows}</tbody></table>
        <h3>${L("वर्तमान अंतर्दशा के प्रत्यंतर", "Antaras of the current bhukti")}</h3>
        <table class="t sm2"><thead><tr><th>${L("प्रत्यंतर", "Antara")}</th><th>${L("आरंभ", "From")}</th><th>${L("समाप्ति", "To")}</th><th>${L("मुख्य भाव", "Main houses")}</th></tr></thead><tbody>${pdRows}</tbody></table>`;
    }
    add(L("विंशोत्तरी दशा", "Vimshottari dasha"), dashaHtml);

    if (paid) {
      // next 3 years, bhukti by bhukti
      const end3 = now.getTime() + 3 * 365.25 * 864e5, rows = [];
      for (const m of c.dasha.md) for (const a of m.ad) for (const p of a.pd) {
        if (p.end < now || p.start > end3) continue;
        rows.push({ m: m.lord, a: a.lord, p: p.lord, s: p.start < now ? now : p.start, e: p.end });
      }
      const good = (h) => [2, 6, 10, 11].includes(h), care = (h) => [8, 12].includes(h);
      const items = rows.map((r) => {
        const hsAll = [...new Set(c.sig[r.a].viaStar.concat(c.sig[r.p].viaStar))].sort((x, y) => x - y);
        const g = hsAll.filter(good).length, w = hsAll.filter(care).length;
        const tone = g >= 2 && !w ? ["अनुकूल", "Supportive", "t-good"] : w && g < 2 ? ["सावधानी", "Be careful", "t-care"] : ["मिश्रित", "Mixed", "t-mid"];
        return `<tr><td>${my(r.s)} – ${my(r.e)}</td><td>${pn(r.a)}–${pn(r.p)}</td><td>${hsAll.slice(0, 4).map((h) => H(HT[h]).split(",")[0]).join(" · ")}</td><td class="${tone[2]}"><b>${hi ? tone[0] : tone[1]}</b></td></tr>`;
      }).join("");
      add(L("अगले 3 वर्ष — समय-समय पर क्या रहेगा", "Next 3 years — what each phase brings"), `
        <p>${L("नीचे अगले तीन वर्षों के प्रत्यंतर काल दिए हैं। हर काल में अंतर्दशा और प्रत्यंतर के स्वामी जिन भावों के कारक हैं, उनसे उस समय के मुख्य विषय बनते हैं। 2, 6, 10, 11 भाव धन और काम के लिए अनुकूल, और 8, 12 भाव सावधानी के माने जाते हैं।", "Below are the antara periods of the next three years. The houses signified by the bhukti and antara lords shape the main themes of each phase. Houses 2, 6, 10 and 11 are supportive for money and work; 8 and 12 call for care.")}</p>
        <table class="t sm2"><thead><tr><th>${L("समय", "Period")}</th><th>${L("भुक्ति–प्रत्यंतर", "Bhukti–antara")}</th><th>${L("मुख्य विषय", "Main themes")}</th><th>${L("स्वभाव", "Tone")}</th></tr></thead><tbody>${items}</tbody></table>
        <p class="sm">${L("“सावधानी” का अर्थ अशुभ नहीं है — उस समय खर्च, यात्रा, स्वास्थ्य और बड़े जोखिमों में सावधानी रखें। अंतिम पुष्टि गोचर से होती है।", "“Be careful” does not mean bad — be careful with expenses, travel, health and big risks then. Final confirmation comes from transits.")}</p>`);
    }

    // ---------- ruling planets ----------
    const rp = [[L("वार स्वामी", "Day lord"), RP.day], [L("चंद्र राशि स्वामी", "Moon sign lord"), RP.moonSign], [L("चंद्र नक्षत्र स्वामी", "Moon star lord"), RP.moonStar], [L("चंद्र उप-स्वामी", "Moon sub lord"), RP.moonSub], [L("लग्न राशि स्वामी", "Lagna sign lord"), RP.lagnaSign], [L("लग्न नक्षत्र स्वामी", "Lagna star lord"), RP.lagnaStar], [L("लग्न उप-स्वामी", "Lagna sub lord"), RP.lagnaSub]];
    const rset = [...new Set(rp.map((x) => x[1]))];
    add(L("शासक ग्रह (Ruling Planets)", "Ruling planets"), `
      <p>${L(`शासक ग्रह KP की एक विशेष विधि है। जिस क्षण कोई प्रश्न पूछा जाता है या निर्णय लिया जाता है, उस समय के वार, चंद्र और लग्न के स्वामी उस विषय के परिणाम और समय की पुष्टि करते हैं। नीचे के शासक ग्रह इस रिपोर्ट के बनने के समय (${today}) और आपके जन्म स्थान के अनुसार हैं।`, `Ruling planets are a special KP method. At the moment a question is asked or a decision made, the lords of the day, Moon and ascendant confirm the outcome and timing. The ruling planets below are for the time this report was made (${today}) at your birth place.`)}</p>
      <table class="t kv"><tbody>${rp.map(([a, b]) => `<tr><td>${a}</td><td><b>${pn(b)}</b></td></tr>`).join("")}</tbody></table>
      <p><b>${L("शासक ग्रह", "Ruling planets")}:</b> ${rset.map(pn).join(", ")}</p>
      ${paid ? `<p>${L("उपयोग: किसी विषय की दशा-भुक्ति चुनते समय उन ग्रहों को प्राथमिकता दें जो जन्म कुंडली में उस विषय के कारक भी हों और शासक ग्रहों में भी हों। विवाह, नौकरी या यात्रा का प्रश्न जिस दिन मन में आए, उस दिन के शासक ग्रह देखकर ज्योतिषी समय की पुष्टि करता है।", "Use: when picking the period for a matter, give priority to planets that signify it in the birth chart and are also among the ruling planets. When a question on marriage, job or travel comes to mind, an astrologer checks that day's ruling planets to confirm timing.")}</p>` : ""}`);

    if (!paid) {
      const pick = [8, 11, 1].map((i) => verdicts[i]);
      add(L("एक झलक — विवाह, करियर और धन", "A glimpse — marriage, career and money"), `
        ${pick.map(({ A, j }) => `<div class="area"><h3>${H(A.t)} ${vBadge(j.k)}</h3><p class="calc">${L(`भाव ${A.h} का उप-स्वामी ${pn(j.csl)} · नक्षत्र स्वामी ${pn(j.star)} · कारक भाव ${hs(j.s.viaStar)}`, `Cusp ${A.h} sub-lord ${j.csl} · star lord ${j.star} · houses ${hs(j.s.viaStar)}`)}</p></div>`).join("")}
        <div class="box up"><b>${L("₹299 की विस्तृत KP रिपोर्ट में", "In the ₹299 detailed KP report")}</b><ul>
          <li>${L("जीवन के 14 विषयों का उप-स्वामी विश्लेषण — विवाह, नौकरी, करियर, धन, संतान, शिक्षा, मकान, विदेश आदि", "Sub-lord analysis of 14 areas — marriage, job, career, money, children, education, property, foreign lands and more")}</li>
          <li>${L("हर विषय के लिए अगले 20 वर्षों के सहायक दशा-भुक्ति काल", "Supportive dasha periods for each area over the next 20 years")}</li>
          <li>${L("चार स्तर के कारक ग्रह, उप-उप स्वामी और अगले 3 वर्षों का प्रत्यंतर अनुसार मार्गदर्शन", "Four-level significators, sub-sub lords and a phase-by-phase guide for the next 3 years")}</li></ul>
          <p>${L("jyotishtark.in/kp-astrology.html पर भुगतान करें — PDF तुरंत मिलेगी।", "Pay at jyotishtark.in/kp-astrology.html — you get the PDF instantly.")}</p></div>`);
    } else {
      const strong = verdicts.filter((v) => v.j.k === "good").map((v) => H(v.A.t)), careA = verdicts.filter((v) => v.j.k === "weak").map((v) => H(v.A.t));
      const best = K.PL.map((p) => ({ p, n: inter(c.sig[p].viaStar, [2, 6, 10, 11]).length - inter(c.sig[p].viaStar, [8, 12]).length })).sort((a, b) => b.n - a.n)[0].p;
      const REM = { Sun: ["रविवार को सूर्य को जल अर्पण और पिता का सम्मान", "Offer water to the Sun on Sundays and respect your father"], Moon: ["सोमवार को शिव पूजा और माता की सेवा", "Worship Shiva on Mondays and serve your mother"], Mars: ["मंगलवार को हनुमान चालीसा और भाइयों से मधुर संबंध", "Recite the Hanuman Chalisa on Tuesdays and keep good ties with brothers"], Mercury: ["बुधवार को गणेश पूजा और वाणी पर संयम", "Worship Ganesha on Wednesdays and keep your speech gentle"], Jupiter: ["गुरुवार को विष्णु पूजा और गुरुजनों का सम्मान", "Worship Vishnu on Thursdays and respect teachers"], Venus: ["शुक्रवार को लक्ष्मी पूजा और स्त्रियों का सम्मान", "Worship Lakshmi on Fridays and respect women"], Saturn: ["शनिवार को ज़रूरतमंद की मदद और अनुशासन", "Help the needy on Saturdays and keep discipline"], Rahu: ["माँ दुर्गा की उपासना और नशे से दूरी", "Worship Durga and stay away from intoxicants"], Ketu: ["गणेश उपासना, ध्यान और कुत्तों की सेवा", "Worship Ganesha, meditate and care for dogs"] };
      add(L("उपाय और ज्योतिषी की टिप्पणी", "Remedies and astrologer's note"), `
        <p>${L("KP में उपायों का उद्देश्य उन ग्रहों को सक्रिय करना है जो शुभ भावों के कारक हैं, और चल रही दशा के स्वामी को संतुलित रखना है। नीचे के उपाय सरल हैं और कोई महँगा अनुष्ठान आवश्यक नहीं है।", "In KP, remedies aim to activate the planets that signify good houses and to keep the running period lord balanced. The remedies below are simple; no costly ritual is needed.")}</p>
        <ol class="rem">
          <li><b>${L(`आपका सबसे सहायक ग्रह — ${pn(best)}`, `Your most supportive planet — ${best}`)}:</b> ${H(REM[best])}.</li>
          ${cur ? `<li><b>${L(`वर्तमान महादशा स्वामी — ${pn(cur.md.lord)}`, `Current mahadasha lord — ${cur.md.lord}`)}:</b> ${H(REM[cur.md.lord])}.</li>` : ""}
          ${cur && cur.ad.lord !== cur.md.lord ? `<li><b>${L(`वर्तमान अंतर्दशा स्वामी — ${pn(cur.ad.lord)}`, `Current bhukti lord — ${cur.ad.lord}`)}:</b> ${H(REM[cur.ad.lord])}.</li>` : ""}
          <li>${L("महत्वपूर्ण काम — नौकरी आवेदन, विवाह की बात, संपत्ति ख़रीद — ऊपर बताए गए सहायक दशा काल में और शासक ग्रहों के दिन करें।", "Do important things — job applications, marriage talks, property purchase — in the supportive periods above and on days of your ruling planets.")}</li>
          <li>${L("रत्न धारण करने से पहले व्यक्तिगत परामर्श अवश्य लें; KP में गलत रत्न लाभ के बजाय नुकसान कर सकता है।", "Take personal advice before wearing any gemstone; in KP a wrong stone can harm rather than help.")}</li>
        </ol>
        <h3>${L("ज्योतिषी की टिप्पणी", "Astrologer's note")}</h3>
        <div class="note"><p>${L(`${esc(o.name)} जी, आपका लग्न ${sn(c.cusps[1].sign)} है और लग्न का उप-स्वामी ${pn(c.cusps[1].sub)} है। ${strong.length ? `आपकी कुंडली में ${strong.slice(0, 3).join(", ")} जैसे विषयों का स्पष्ट वादा दिखता है।` : "आपकी कुंडली में अधिकांश विषय मेहनत और सही समय से फल देने वाले हैं।"} ${careA.length ? `${careA.slice(0, 2).join(" और ")} में धैर्य और अधिक प्रयास रखें।` : ""} ${cur ? `अभी ${pn(cur.md.lord)}–${pn(cur.ad.lord)} का समय चल रहा है, जो ${theme(cur.ad.lord)} पर ध्यान दिलाता है।` : ""}`, `${esc(o.name)}, your ascendant is ${sn(c.cusps[1].sign)} and its sub-lord is ${c.cusps[1].sub}. ${strong.length ? `Your chart shows a clear promise for areas such as ${strong.slice(0, 3).join(", ").toLowerCase()}.` : "In your chart most areas give results through effort and right timing."} ${careA.length ? `Keep patience and extra effort in ${careA.slice(0, 2).join(" and ").toLowerCase()}.` : ""} ${cur ? `The ${cur.md.lord}–${cur.ad.lord} period is running now, which brings focus on ${theme(cur.ad.lord)}.` : ""}`)}</p>
        <p>${L("KP संभावना और समय का संकेत देती है, निश्चित भविष्य नहीं। बड़े निर्णय — विवाह, निवेश, नौकरी या स्वास्थ्य — से पहले अपनी परिस्थिति और संबंधित विशेषज्ञ की सलाह अवश्य लें। किसी विषय पर गहराई से प्रश्न हो तो व्यक्तिगत परामर्श लें। शुभम् भवतु।", "KP indicates possibility and timing, not a fixed future. Before big decisions — marriage, investment, job or health — consider your situation and take advice from the right expert. For a deeper question on any matter, take a personal consultation. Best wishes.")}</p></div>`);
    }

    // ---------- document ----------
    const title = paid ? L("विस्तृत KP कुंडली रिपोर्ट", "Detailed KP Horoscope Report") : L("KP कुंडली", "KP Horoscope");
    const toc = CH.map((x, i) => `<li><span>${L("अध्याय", "Chapter")} ${i + 1}</span>${x[0]}</li>`).join("");
    const box = (l, v, s) => `<div class="cb"><small>${l}</small><b>${v}</b><span>${s}</span></div>`;
    const ftr = `${L("ज्योतिष तर्क · KP", "Jyotish Tark · KP")} · ${String(o.name || "").replace(/["\\\n]/g, "")} · ${dob}`;
    const pgCss = `@page{@bottom-left{content:"${ftr}";font:600 8.5pt Mukta,sans-serif;color:#7A1F1F}@bottom-right{content:"${L("पृष्ठ", "Page")} " counter(page);font:600 8.5pt Mukta,sans-serif;color:#7A1F1F}}@page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    const body = CH.map((x, i) => `<section class="ch"><p class="chn">${L("अध्याय", "Chapter")} ${i + 1}</p><h2>${x[0]}</h2>${x[1]}</section>`).join("");
    return `<!doctype html><html lang="${hi ? "hi" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(o.name)} — Jyotish Tark</title>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
<style>${CSS}${pgCss}</style></head><body>
<section class="cover"><div class="fr"></div><div class="fr2"></div>${mandalaSvg()}
  <p class="k">॥ ${L("ज्योतिष तर्क", "JYOTISH TARK")} ॥</p><h1>${esc(title)}</h1>
  <p class="sub">${L("कृष्णमूर्ति पद्धति · प्लेसिडस भाव · उप-स्वामी विश्लेषण", "Krishnamurti Paddhati · Placidus houses · sub-lord analysis")}</p>
  <p class="nm">${esc(o.name)}</p><p class="dob">${dob} · ${esc(o.time)} · ${esc(o.place || "")}</p>
  <div class="cgrid">${box(L("लग्न", "Ascendant"), sn(c.cusps[1].sign), L("उप-स्वामी ", "sub ") + pn(c.cusps[1].sub))}${box(L("चंद्र नक्षत्र", "Moon star"), nk(P.Moon.nak), pn(P.Moon.star))}${box(L("महादशा", "Mahadasha"), cur ? pn(cur.md.lord) : "—", cur ? L("भुक्ति ", "bhukti ") + pn(cur.ad.lord) : "")}${box(L("शासक ग्रह", "Ruling"), rset.slice(0, 3).map((p) => H(PA[p])).join(" "), today)}</div>
  <div class="seal">${stampSvg(110)}</div>
  <p class="ft">${L("रिपोर्ट क्रमांक", "Report no.")} ${esc(rno)} · ${L("तैयार", "Prepared")}: ${today}<br>jyotishtark.in · ${L("ज्योतिषी ज्ञानेंद्र सिंह तोमर, लखनऊ", "Astrologer Gyanendra Singh Tomar, Lucknow")}</p>
</section>
<section class="toc"><h2>${L("विषय सूची", "Contents")}</h2><ol>${toc}</ol>
  <div class="box"><b>${L("इस रिपोर्ट को कैसे पढ़ें", "How to read this report")}</b><p>${paid ? L("पहले अध्याय 1 में KP के तीन मूल नियम पढ़ें। फिर “जीवन के 14 विषय — एक नज़र में” देखें और उसके बाद अपने रुचि के विषय का विस्तृत विश्लेषण पढ़ें। दशा और अगले 3 वर्षों के अध्याय बताते हैं कि कौन-सा समय किस काम के लिए अच्छा है।", "First read the three basic KP rules in chapter 1. Then see “14 areas of life — at a glance” and read the detailed analysis of the areas you care about. The dasha and next-3-years chapters show which time suits which work.") : L("यह आपकी मूल KP कुंडली है — ग्रहों और भावों के नक्षत्र स्वामी और उप-स्वामी, दशा और शासक ग्रह। जीवन के हर विषय का विस्तृत विश्लेषण ₹299 की विस्तृत रिपोर्ट में है।", "This is your basic KP chart — star lords and sub-lords of planets and houses, dasha and ruling planets. A detailed analysis of every area of life is in the ₹299 detailed report.")}</p></div>
  <p class="sm">${L("गणना: KP (कृष्णमूर्ति) अयनांश, प्लेसिडस भाव, मीन राहु, विंशोत्तरी दशा। ग्रह स्थिति astronomy-engine से, स्विस एफ़ेमेरिस से मिलान की गई।", "Calculation: KP (Krishnamurti) ayanamsa, Placidus houses, mean Rahu, Vimshottari dasha. Planet positions from astronomy-engine, checked against the Swiss Ephemeris.")}</p></section>
${body}
<section class="close">${stampSvg(100)}<div><p><b>${L("ज्योतिष तर्क, लखनऊ", "Jyotish Tark, Lucknow")}</b><br>jyotishtark.in · WhatsApp +91 83185 13814</p>
<p class="sm">${L("यह रिपोर्ट KP ज्योतिष पर आधारित सामान्य मार्गदर्शन है। यह किसी परिणाम की गारंटी नहीं है और चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है।", "This report is general guidance based on KP astrology. It does not guarantee any result and is not a substitute for medical, legal or financial advice.")}</p></div></section>
</body></html>`;
  }

  const CSS = `@page{size:A4;margin:14mm 13mm 16mm}@page:first{margin:0}
*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#2B1810;font-family:Mukta,'Noto Sans Devanagari',sans-serif;font-size:11.2pt;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@media screen{body{max-width:210mm;margin:0 auto;padding:0 0 10mm;background:#fff}.ch,.toc,.close{padding-left:12mm;padding-right:12mm}}
.cover{width:210mm;height:297mm;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 38%,#8E2A2A 0%,#5A1414 55%,#3A0B0B 100%);color:#F7E7C1;text-align:center;break-after:page;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20mm}
.cover .fr{position:absolute;inset:9mm;border:1.6px solid #E9C46A;border-radius:3mm}.cover .fr2{position:absolute;inset:12mm;border:.6px solid #E9C46A;border-radius:2mm}
.cover .k{letter-spacing:.3em;font-size:11pt;color:#E9C46A;font-weight:700;margin:10px 0 4px}
.cover h1{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:32pt;margin:4px 0;color:#FBEFD0;line-height:1.2}.cover .sub{margin:0;color:#F3DFAE;font-size:11pt}
.cover .nm{font-family:'Tiro Devanagari Hindi',serif;font-size:23pt;margin:12px 0 2px;color:#fff}.cover .dob{font-size:12pt;color:#F3DFAE;margin:0}
.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin:9mm 0 7mm;width:160mm}
.cb{border:1px solid #E9C46A;border-radius:3mm;padding:3.5mm 2mm;background:rgba(0,0,0,.18)}.cb small{display:block;font-size:9.5pt;color:#E9C46A;font-weight:700}.cb b{display:block;font-size:16pt;line-height:1.25;color:#fff;margin:1mm 0}.cb span{font-size:9.5pt;color:#F3DFAE}
.seal{background:#FBF4E4;border-radius:50%;padding:3mm;display:inline-block}
.cover .ft{position:absolute;bottom:15mm;left:0;right:0;font-size:9.8pt;color:#E9C46A;line-height:1.6}
.toc{break-after:page;padding-top:2mm}.toc ol{list-style:none;padding:0;margin:2mm 0 4mm}.toc li{padding:1.1mm 0;border-bottom:1px dotted #D9C6A0;font-size:11pt;line-height:1.45}.toc li span{display:inline-block;width:26mm;color:#7A5410;font-size:10pt}
.ch{margin-top:8mm;padding-top:4mm;border-top:2px solid #C9A227}.toc+.ch{margin-top:0;border-top:0;padding-top:0}
.chn{break-after:avoid;margin:0;color:#B8892B;font-weight:700;letter-spacing:.08em;font-size:10pt;text-transform:uppercase}
h2{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;color:#7A1F1F;font-size:19pt;margin:1mm 0 4mm;padding-bottom:2mm;border-bottom:.8px solid #E3D3B0;line-height:1.3;break-after:avoid}
h3{font-size:12.5pt;color:#7A1F1F;margin:4.5mm 0 1.5mm;break-after:avoid}h3 small{font-weight:400;color:#6B5444;font-size:10pt}
p{margin:1.5mm 0}ul,ol{margin:1.5mm 0;padding-left:6mm}li{margin:1mm 0}.sm{font-size:9.6pt;color:#5B4B37}
table.t{width:100%;border-collapse:collapse;margin:2mm 0 3mm;font-size:10.6pt}table.t th{background:#7A1F1F;color:#fff;text-align:left;padding:1.8mm 2mm;font-weight:600}table.t td{border-bottom:1px solid #EADCC0;padding:1.6mm 2mm;vertical-align:top}table.t tr{break-inside:avoid}table.t td.n{font-weight:700;color:#7A1F1F;white-space:nowrap}table.t tr.cur td{background:#FFF6DD}
table.sm2{font-size:9.8pt}table.sm2 th{font-size:9.4pt}table.kv td:nth-child(odd){color:#6B5444;width:22%}
.box{border:1px solid #EADCC0;background:#FBF6EC;border-radius:2mm;padding:3mm 4mm;margin:2.5mm 0;break-inside:avoid}.box.up{border-color:#C9A227;background:#FFF8E6}
.note{border:.5mm solid #C9A227;border-radius:2mm;background:#FBF6EC;padding:4mm 5mm}
.chw{display:grid;grid-template-columns:86mm 1fr;gap:6mm;align-items:start}.nchart{width:86mm;height:86mm}.nchart .cn{font:600 13px Mukta,sans-serif;fill:#B8892B;text-anchor:middle}.nchart .cp{font:700 14px Mukta,sans-serif;fill:#7A1F1F;text-anchor:middle}
.area{border-left:3px solid #C9A227;padding:1mm 0 1mm 4mm;margin:4mm 0 5mm}.area h3{margin-top:1mm}.calc{font-size:9.8pt;color:#4A3628;background:#FBF6EC;border-radius:1.5mm;padding:1.5mm 2.5mm}.tip{color:#14532D}
.vb{display:inline-block;font-size:9pt;font-weight:700;border-radius:10mm;padding:.3mm 2.5mm;margin-left:1.5mm;vertical-align:middle}.v-good{background:#DCFCE7;color:#14532D}.v-mixed{background:#FEF3C7;color:#7A4A06}.v-mid{background:#E0E7FF;color:#1E3A8A}.v-weak{background:#FEE2E2;color:#7F1D1D}
.per{columns:2;column-gap:6mm}.per li{break-inside:avoid}.t-good{color:#14532D}.t-care{color:#9A3412}.t-mid{color:#1E3A8A}
.rem li{margin:1.5mm 0}
.close{margin-top:9mm;display:flex;gap:6mm;align-items:center;border-top:1.5px solid #C9A227;padding-top:5mm;break-inside:avoid}`;

  window.JTKPReport = { build };
})();
