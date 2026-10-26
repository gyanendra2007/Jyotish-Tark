/**
 * ============================================================================
 * JYOTISH TARK — FINDINGS-TO-PROSE NARRATIVE ENGINE
 * File: narrative-rules.js • v1.0 (100% Fact-Driven, Zero Generic Boilerplate)
 * ============================================================================
 * Maps structured astrological facts from `FindingsEngine`, `TimingEngine`, and
 * `VedicChartAnalyzer` into classical, ethical Hindi & English paragraphs.
 * Rule: If a finding is not present in the chart, no paragraph is emitted.
 * ============================================================================
 */

(function () {
  "use strict";

  const RASHI_EN = [
    null, "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];
  const RASHI_HI = [
    null, "मेष (Aries)", "वृषभ (Taurus)", "मिथुन (Gemini)", "कर्क (Cancer)",
    "सिंह (Leo)", "कन्या (Virgo)", "तुला (Libra)", "वृश्चिक (Scorpio)",
    "धनु (Sagittarius)", "मकर (Capricorn)", "कुंभ (Aquarius)", "मीन (Pisces)"
  ];
  const RASHI_LORDS = [
    null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
  ];
  const PLANET_HI = {
    Sun: "सूर्य", Moon: "चंद्रमा", Mars: "मंगल", Mercury: "बुध",
    Jupiter: "बृहस्पति (गुरु)", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
  };

  const HOUSE_DOMAIN_EN = {
    1:  "self-vitality, personal constitution, and independent leadership",
    2:  "accumulated family wealth, speech authority, and treasury",
    3:  "self-made initiative, courage, communication, and younger siblings",
    4:  "inner emotional peace, maternal lineage, land/property, and vehicles",
    5:  "analytical intelligence, Purva-Punya merit, scholarship, and progeny",
    6:  "competitive stamina, daily service discipline, litigation, and health recovery",
    7:  "marriage partnership, legal contracts, and public interactions",
    8:  "deep research, longevity, sudden transformations, and joint/in-law assets",
    9:  "Dharma, higher wisdom, paternal/guru grace, and long-distance fortune",
    10: "Karmic command, institutional reputation, and career authority",
    11: "income multiplication, network gains, and elder siblings",
    12: "distant/foreign lands, spiritual contemplation, and capital expenditures"
  };

  const HOUSE_DOMAIN_HI = {
    1:  "आत्मबल, शारीरिक गठन और स्वतंत्र नेतृत्व",
    2:  "संचित कोष, वाणी के प्रभाव और कुटुंब परंपरा",
    3:  "स्व-पराक्रम, साहस, संवाद कौशल और छोटे भाई-बहन",
    4:  "मानसिक शांति, माता, भूमि-भवन और वाहन सुख",
    5:  "तीव्र मेधा, पूर्वजन्म के पुण्य (प्रारब्ध), उच्च शिक्षा और संतान",
    6:  "प्रतियोगी क्षमता, सेवा-अनुशासन, शत्रु-विजय और स्वास्थ्य",
    7:  "वैवाहिक साझेदारी, अनुबंध और सामाजिक छवि",
    8:  "गहन शोध, आयुष्य, आकस्मिक परिवर्तन और गुप्त/ससुराल संपदा",
    9:  "धर्म, उच्च ज्ञान, गुरु/पिता की कृपा और भाग्योदय",
    10: "कर्म-सत्ता, पद-प्रतिष्ठा और कार्यक्षेत्र के अधिकार",
    11: "आय-वृद्धि, बड़े आर्थिक लाभ और प्रभावशाली नेटवर्क",
    12: "सुदूर/विदेश संपर्क, आध्यात्मिक चिंतन और पूंजीगत व्यय"
  };

  function renderYogaBadgesHtml(yogas, lang) {
    if (!Array.isArray(yogas) || yogas.length === 0) return "";
    const items = yogas.map(y => `
      <div class="p-3.5 rounded-xl bg-slate-900/90 border border-amber-400/35">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="font-bold text-amber-300 text-xs md:text-sm">✦ ${lang === "hi" ? y.titleHi : y.titleEn}</span>
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px] font-mono">Score: ${y.score}</span>
        </div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${lang === "hi" ? y.summaryHi : y.summaryEn}</p>
      </div>
    `).join("");
    return `<div class="space-y-2.5 my-4">${items}</div>`;
  }

  function renderSandhiAlertIfPresent(chart, lang) {
    if (!chart.isFullChartMode) return "";
    const alerts = [];
    if (chart.Asc && chart.Asc.isSandhi) {
      alerts.push(lang === "hi"
        ? `⚠️ <strong>लग्न संधि सूचना (${chart.Asc.formattedDMS || chart.Asc.formattedDeg}):</strong> आपका उदय लग्न राशि की सीमा के 1° के भीतर है। जन्म समय में 4–5 मिनट का अंतर होने पर लग्न राशि बदल सकती है।`
        : `⚠️ <strong>Lagna Sandhi Sensitivity (${chart.Asc.formattedDMS || chart.Asc.formattedDeg}):</strong> Your Ascendant lies within 1° of a sign boundary. A 4–5 minute variation in birth time can shift house cusps.`);
    }
    if (chart.Moon && chart.Moon.isGandanta) {
      alerts.push(lang === "hi"
        ? `⚠️ <strong>चंद्र गंडांत बिंदु:</strong> आपका जन्म चंद्रमा जल और अग्नि राशि की संधि (गंडांत) में स्थित है, जो गहन अंतर्ज्ञान और तीव्र भावनात्मक संवेदनशीलता देता है।`
        : `⚠️ <strong>Lunar Gandanta Junction:</strong> Your natal Moon sits at a water-fire nakshatra junction (Gandanta), giving deep spiritual intuition alongside heightened emotional sensitivity.`);
    }
    if (!alerts.length) return "";
    return `<div class="p-3.5 rounded-xl bg-amber-950/70 border border-amber-400/50 text-xs md:text-sm text-amber-100 space-y-1.5 mb-4">${alerts.map(a => `<div>${a}</div>`).join("")}</div>`;
  }

  // ========================================================================
  // CHAPTER 1: PERSONALITY, LAGNA LORD, MOON NAKSHATRA & ATMAKARAKA
  // ========================================================================
  function renderChapter1Personality(ctx) {
    const { lang, name, chart, findings, specialLagnas } = ctx;
    const isFull = chart.isFullChartMode;
    const moonR = chart.Moon.rashi || chart.Moon.d1;
    const sunR  = chart.Sun.rashi  || chart.Sun.d1;
    const moonDeg = chart.Moon.formattedDMS || chart.Moon.formattedDeg || "";
    const sunDeg  = chart.Sun.formattedDMS  || chart.Sun.formattedDeg  || "";

    // DOB-Only Mode: Strictly Moon, Nakshatra, and Sun Sign (No fake Lagna!)
    if (!isFull) {
      const shiftWarnHi = chart.moonShiftedSignThatDay
        ? `<div class="p-3 rounded-xl bg-amber-950/70 border border-amber-400/50 text-xs text-amber-200 mb-3">⚠️ <strong>चंद्र राशि संधि सूचना:</strong> आपके जन्म के दिन चंद्रमा ने <strong>${RASHI_HI[chart.moonStartRashi]}</strong> से <strong>${RASHI_HI[chart.moonEndRashi]}</strong> में प्रवेश किया था। सटीक नक्षत्र-चरण और लग्न जानने हेतु ऊपर जन्म समय भरें।</div>`
        : "";
      const shiftWarnEn = chart.moonShiftedSignThatDay
        ? `<div class="p-3 rounded-xl bg-amber-950/70 border border-amber-400/50 text-xs text-amber-200 mb-3">⚠️ <strong>Moon Sign Transition Note:</strong> On your birth date, the Moon moved from <strong>${RASHI_EN[chart.moonStartRashi]}</strong> into <strong>${RASHI_EN[chart.moonEndRashi]}</strong>. Enter your birth time above to lock the exact Nakshatra pada and Rising Lagna.</div>`
        : "";

      if (lang === "hi") {
        return `
          ${shiftWarnHi}
          <p>प्रिय <strong>${name}</strong>, जन्म समय के अभाव में यह विश्लेषण पूर्णतः आपकी <strong>चंद्र राशि (${RASHI_HI[moonR]} ${moonDeg})</strong>, <strong>जन्म नक्षत्र (${ctx.displayMoonNak})</strong> और <strong>सूर्य राशि (${RASHI_HI[sunR]} ${sunDeg})</strong> के वास्तविक पंचांगीय अंशों पर आधारित है।</p>
          <p><strong>1. चंद्र राशि (${RASHI_HI[moonR]}) एवं मानसिक संरचना:</strong> आपका चंद्रमा ${RASHI_HI[moonR]} में (${PLANET_HI[RASHI_LORDS[moonR]]} के स्वामित्व में) स्थित है। वहीं आपका जन्म सूर्य ${RASHI_HI[sunR]} में है, जो आपके बाहरी संकल्प और कार्यशैली को ${PLANET_HI[RASHI_LORDS[sunR]]} की ऊर्जा प्रदान करता है।</p>
        `;
      }
      return `
        ${shiftWarnEn}
        <p>Dear <strong>${name}</strong>, because no birth time was provided, this reading is strictly anchored to your astronomical <strong>Moon Sign (${RASHI_EN[moonR]} ${moonDeg})</strong>, <strong>Janma Nakshatra (${ctx.displayMoonNak})</strong>, and <strong>Natal Sun (${RASHI_EN[sunR]} ${sunDeg})</strong> without assuming a speculative Ascendant.</p>
        <p><strong>1. Lunar Mind (${RASHI_EN[moonR]}) & Solar Core (${RASHI_EN[sunR]}):</strong> Your emotional processing is governed by ${RASHI_LORDS[moonR]} (ruler of ${RASHI_EN[moonR]}), while your outer vitality operates through ${RASHI_LORDS[sunR]} (ruler of ${RASHI_EN[sunR]}).</p>
      `;
    }

    // Full Birth-Time Mode
    const ascR = chart.Asc.rashi || chart.Asc.d1;
    const lagnaLordKey = RASHI_LORDS[ascR];
    const lagnaLord = chart[lagnaLordKey];
    const akKey = findings?.charaKarakas?.atmakaraka || specialLagnas.atmakarakaKey;
    const akPlanet = chart[akKey];
    const persYogas = (findings?.allYogas || []).filter(y => y.domains.includes("personality"));

    if (lang === "hi") {
      return `
        ${renderSandhiAlertIfPresent(chart, "hi")}
        <p>
          <strong>1. उदय लग्न (${RASHI_HI[ascR]} ${chart.Asc.formattedDMS || chart.Asc.formattedDeg}) एवं लग्नेश (${PLANET_HI[lagnaLordKey]}):</strong>
          आपकी जन्म कुंडली में <strong>${RASHI_HI[ascR]} लग्न</strong> उदित है और लग्नेश <strong>${PLANET_HI[lagnaLordKey]} (${lagnaLord.formattedDMS || lagnaLord.formattedDeg})</strong> <strong>${lagnaLord.house}वें भाव (${RASHI_HI[lagnaLord.rashi]})</strong> में स्थित हैं। पाराशरी सिद्धांत के अनुसार लग्नेश का ${lagnaLord.house}वें भाव में बैठना आपके संपूर्ण जीवन-प्रवाह को <em>${HOUSE_DOMAIN_HI[lagnaLord.house]}</em> पर केंद्रित करता है।
          ${lagnaLord.isVargottama ? `लग्नेश वर्गोत्तम होने से आपको असाधारण आंतरिक दृढ़ता प्राप्त है।` : `नवांश (D9) में लग्नेश ${RASHI_HI[lagnaLord.d9]} राशि में स्थित हैं।`}
        </p>
        <p>
          <strong>2. चंद्र राशि (${RASHI_HI[moonR]} • ${ctx.displayMoonNak}, चरण ${chart.Moon.pada || 1}) एवं आत्मकारक (${PLANET_HI[akKey]}):</strong>
          आपका मन ${chart.Moon.house}वें भाव में स्थित <strong>${RASHI_HI[moonR]} के चंद्रमा (${moonDeg})</strong> से संचालित होता है। जैमिनी सूत्र के अनुसार आपकी कुंडली में सर्वोच्च अंशों पर स्थित ग्रह <strong>${PLANET_HI[akKey]} (${akPlanet.formattedDMS || akPlanet.formattedDeg})</strong> आपके <strong>आत्मकारक</strong> हैं और नवांश में <strong>${RASHI_HI[akPlanet.d9]} (कारकांश)</strong> में जाकर आपकी आत्मा की मूल दिशा तय करते हैं।
        </p>
        ${renderYogaBadgesHtml(persYogas, "hi")}
      `;
    }

    return `
      ${renderSandhiAlertIfPresent(chart, "en")}
      <p>
        <strong>1. Rising Ascendant (${RASHI_EN[ascR]} ${chart.Asc.formattedDMS || chart.Asc.formattedDeg}) & Lagna Lord (${lagnaLordKey}):</strong>
        Your chart rises in <strong>${RASHI_EN[ascR]}</strong> with Ascendant lord <strong>${lagnaLordKey} (${lagnaLord.formattedDMS || lagnaLord.formattedDeg})</strong> placed in <strong>House ${lagnaLord.house} (${RASHI_EN[lagnaLord.rashi]})</strong>. In Parashari Jyotish, the 1st lord in the ${lagnaLord.house}th house directs your primary life focus toward <em>${HOUSE_DOMAIN_EN[lagnaLord.house]}</em>.
        ${lagnaLord.isVargottama ? `Because ${lagnaLordKey} is Vargottama (occupying ${RASHI_EN[lagnaLord.rashi]} in both D1 and D9), your core constitution carries high inner resilience.` : `In Navamsa (D9), your Lagna lord moves into ${RASHI_EN[lagnaLord.d9]}.`}
      </p>
      <p>
        <strong>2. Lunar Mind (${RASHI_EN[moonR]} • ${ctx.displayMoonNak} Pada ${chart.Moon.pada || 1}) & Jaimini Atmakaraka (${akKey}):</strong>
        Your Natal Moon sits in <strong>House ${chart.Moon.house} (${moonDeg})</strong>. By exact degree advancement within its sign, <strong>${akKey} (${akPlanet.formattedDMS || akPlanet.formattedDeg})</strong> is your Jaimini <strong>Atmakaraka</strong>, placing your Karakamsa in <strong>${RASHI_EN[akPlanet.d9]}</strong> in the D9 chart.
      </p>
      ${renderYogaBadgesHtml(persYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 2: EDUCATION, 5TH HOUSE, MERCURY & JUPITER
  // ========================================================================
  function renderChapter2Education(ctx) {
    const { lang, chart, findings } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const edu = findings.domainChecks.education;
    const lord5 = chart[edu.lord];
    const merc = chart.Mercury;
    const jup  = chart.Jupiter;
    const eduYogas = (findings.allYogas || []).filter(y => y.domains.includes("education"));

    if (lang === "hi") {
      return `
        <p>
          <strong>1. पंचम भाव (${RASHI_HI[edu.sign]}) एवं पंचमेश (${PLANET_HI[edu.lord]}):</strong>
          आपकी कुंडली में बुद्धि व शिक्षा के पंचम भाव के स्वामी <strong>${PLANET_HI[edu.lord]} (${lord5.formattedDMS || lord5.formattedDeg})</strong> <strong>${lord5.house}वें भाव (${RASHI_HI[lord5.rashi]})</strong> में स्थित हैं, जो आपकी बौद्धिक क्षमता को सीधे <em>${HOUSE_DOMAIN_HI[lord5.house]}</em> से जोड़ते हैं (पंचम भाव सर्वाष्टकवर्ग: <strong>${edu.savBindus} बिंदु</strong>)।
        </p>
        <p>
          <strong>2. बुध (${RASHI_HI[merc.rashi]}) एवं गुरु (${RASHI_HI[jup.rashi]}) की स्थिति:</strong>
          तर्क-कारक बुध ${merc.house}वें भाव में (${merc.dignityInfo?.hi || ""}${merc.combust ? ", सूर्य से अस्त" : ""}${merc.retro ? ", वक्री" : ""}) तथा ज्ञान-कारक गुरु ${jup.house}वें भाव में (${jup.dignityInfo?.hi || ""}) स्थित हैं।
          ${edu.primaryAfflictor ? `पंचम अक्ष पर <strong>${PLANET_HI[edu.primaryAfflictor.planet]}</strong> का प्रभाव (${edu.primaryAfflictor.reasonHi}) तकनीकी/विश्लेषणात्मक विषयों में गहरी पकड़ देता है, किंतु औपचारिक शिक्षा में एकाग्रता बनाए रखने के लिए अनुशासन मांगता है।` : `पंचम अक्ष क्रूर ग्रहों के अवरोध से मुक्त होने के कारण आपकी अध्ययन एवं विश्लेषण क्षमता स्पष्ट और स्थिर है।`}
        </p>
        ${renderYogaBadgesHtml(eduYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>1. 5th House of Intellect (${RASHI_EN[edu.sign]}) & 5th Lord (${edu.lord}):</strong>
        Your 5th house is ruled by <strong>${edu.lord} (${lord5.formattedDMS || lord5.formattedDeg})</strong>, which is placed in <strong>House ${lord5.house} (${RASHI_EN[lord5.rashi]})</strong>—channeling your scholarship and analytical memory into <em>${HOUSE_DOMAIN_EN[lord5.house]}</em> (5th House SAV: <strong>${edu.savBindus} bindus</strong>).
      </p>
      <p>
        <strong>2. Mercury (${RASHI_EN[merc.rashi]}) & Jupiter (${RASHI_EN[jup.rashi]}) Alignment:</strong>
        Mercury occupies House ${merc.house} (${merc.dignityInfo?.en || ""}${merc.combust ? ", Combust" : ""}${merc.retro ? ", Retrograde" : ""}) while Jupiter sits in House ${jup.house} (${jup.dignityInfo?.en || ""}).
        ${edu.primaryAfflictor ? `Because <strong>${edu.primaryAfflictor.planet}</strong> ${edu.primaryAfflictor.reasonEn}, your chart favors applied technical/investigative mastery over rote academic theory.` : `With your 5th axis free from malefic affliction, your intellectual focus remains steady and structured.`}
      </p>
      ${renderYogaBadgesHtml(eduYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 3: CAREER, 10TH HOUSE, D10 DASAMSA & SHADBALA
  // ========================================================================
  function renderChapter3Career(ctx) {
    const { lang, chart, findings, specialLagnas } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const car = findings.domainChecks.career;
    const lord10 = chart[car.lord];
    const d10Asc = chart.Asc.d10 || 1;
    const lord10InD10 = lord10.d10 || 1;
    const bindu10 = specialLagnas.houseBindus[10];
    const bindu6  = specialLagnas.houseBindus[6];
    const bindu11 = specialLagnas.houseBindus[11];
    const careerYogas = (findings.allYogas || []).filter(y => y.domains.includes("career"));
    const shadbala10 = chart._shadbalaDetails?.[car.lord];

    if (lang === "hi") {
      return `
        <p>
          <strong>1. दशम भाव (${RASHI_HI[car.sign]}) एवं दशमेश (${PLANET_HI[car.lord]}) का D1 व D10 (दशमांश) विश्लेषण:</strong>
          आपकी लग्न कुंडली में कर्मेश <strong>${PLANET_HI[car.lord]} (${lord10.formattedDMS || lord10.formattedDeg})</strong> <strong>${lord10.house}वें भाव (${RASHI_HI[lord10.rashi]})</strong> में स्थित होकर आपके करियर को सीधे <em>${HOUSE_DOMAIN_HI[lord10.house]}</em> से जोड़ते हैं। दशमांश कुंडली (D10 — ${RASHI_HI[d10Asc]} लग्न) में दशमेश <strong>${RASHI_HI[lord10InD10]}</strong> राशि में स्थित हैं${shadbala10 ? ` तथा षड्बल में इनका बल <strong>${shadbala10.rupas} रूप</strong> (आवश्यक न्यूनतम: ${shadbala10.requiredRupas} रूप) है` : ""}।
        </p>
        <p>
          <strong>2. सर्वाष्टकवर्ग कर्म-लाभ अनुपात (10H: ${bindu10} • 6H: ${bindu6} • 11H: ${bindu11} बिंदु):</strong>
          ${bindu10 >= 30
            ? `दशम भाव में ${bindu10} बिंदु होने से कार्यक्षेत्र में आपको स्वाभाविक अधिकार और उच्च दृश्यता प्राप्त होती है।`
            : `दशम भाव में ${bindu10} और षष्ठ भाव में ${bindu6} बिंदु होने से प्रारंभिक करियर में कड़ी प्रतिस्पर्धा और परिश्रम के बाद पद-स्थायित्व मिलता है।`}
          ${lord10.chalitHouse && lord10.chalitHouse !== lord10.house
            ? ` श्रीपति भाव चलित में दशमेश ${lord10.chalitHouse}वें भाव का फल भी सक्रिय कर रहे हैं।`
            : ""}
        </p>
        ${renderYogaBadgesHtml(careerYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>1. 10th House (${RASHI_EN[car.sign]}), 10th Lord (${car.lord}) & D10 Dasamsa Confirmation:</strong>
        Your 10th lord <strong>${car.lord} (${lord10.formattedDMS || lord10.formattedDeg})</strong> occupies <strong>House ${lord10.house} (${RASHI_EN[lord10.rashi]})</strong>, linking your professional authority directly to <em>${HOUSE_DOMAIN_EN[lord10.house]}</em>. In your Dasamsa chart (D10 — ${RASHI_EN[d10Asc]} Ascendant), ${car.lord} is placed in <strong>${RASHI_EN[lord10InD10]}</strong>${shadbala10 ? ` with a Shadbala strength of <strong>${shadbala10.rupas} Rupas</strong> (required minimum: ${shadbala10.requiredRupas} Rupas)` : ""}.
      </p>
      <p>
        <strong>2. Sarvashtakavarga Karma-Labha Ratio (10H: ${bindu10} • 6H: ${bindu6} • 11H: ${bindu11} Bindus):</strong>
        ${bindu10 >= 30
          ? `With ${bindu10} bindus in the 10th house, your chart carries strong institutional command and executive visibility.`
          : `With ${bindu10} bindus in the 10th house and ${bindu6} in the 6th, your authority is forged through structured problem-solving and competitive endurance.`}
        ${lord10.chalitHouse && lord10.chalitHouse !== lord10.house
          ? ` In Sripati Bhava Chalit, your 10th lord shifts into House ${lord10.chalitHouse}, blending its results with that bhava.`
          : ""}
      </p>
      ${renderYogaBadgesHtml(careerYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 4: WEALTH, 2ND & 11TH LORDS, D2 HORA & DHANA YOGAS
  // ========================================================================
  function renderChapter4Wealth(ctx) {
    const { lang, chart, findings, specialLagnas } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const w2  = findings.domainChecks.wealth;
    const g11 = findings.domainChecks.gains;
    const lord2  = chart[w2.lord];
    const lord11 = chart[g11.lord];
    const bindu2  = specialLagnas.houseBindus[2];
    const bindu11 = specialLagnas.houseBindus[11];
    const bindu12 = specialLagnas.houseBindus[12];
    const wealthYogas = (findings.allYogas || []).filter(y => y.domains.includes("wealth"));

    if (lang === "hi") {
      return `
        <p>
          <strong>1. धनेश (${PLANET_HI[w2.lord]}) एवं लाभेश (${PLANET_HI[g11.lord]}) का पाराशरी समीकरण:</strong>
          आपकी कुंडली में द्वितीय भाव (${RASHI_HI[w2.sign]}) के स्वामी <strong>${PLANET_HI[w2.lord]}</strong> <strong>${lord2.house}वें भाव</strong> में तथा एकादश भाव (${RASHI_HI[g11.sign]}) के स्वामी <strong>${PLANET_HI[g11.lord]}</strong> <strong>${lord11.house}वें भाव</strong> में स्थित हैं। आपकी आय का मुख्य स्रोत <em>${HOUSE_DOMAIN_HI[lord11.house]}</em> से तथा धन-संचय <em>${HOUSE_DOMAIN_HI[lord2.house]}</em> के माध्यम से निर्मित होता है।
        </p>
        <p>
          <strong>2. धन-प्रवाह बनाम व्यय अष्टकवर्ग (लाभ 11H: ${bindu11} • कोष 2H: ${bindu2} • व्यय 12H: ${bindu12} बिंदु):</strong>
          ${bindu11 > bindu12
            ? `एकादश भाव (${bindu11} बिंदु) का बल द्वादश भाव (${bindu12} बिंदु) से अधिक होने के कारण आपकी शुद्ध बचत और संपत्ति निर्माण की गति सकारात्मक है।`
            : `द्वादश भाव (${bindu12} बिंदु) के बिंदु उच्च होने से तरल नकदी (Liquid Cash) के स्थान पर दीर्घकालिक संपत्ति या योजनाबद्ध निवेश में धन रखना अधिक सुरक्षित है।`}
        </p>
        ${renderYogaBadgesHtml(wealthYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>1. 2nd Lord (${w2.lord}) & 11th Lord (${g11.lord}) Artha Synthesis:</strong>
        Your 2nd house of treasury (${RASHI_EN[w2.sign]}) is ruled by <strong>${w2.lord}</strong> in <strong>House ${lord2.house}</strong>, while your 11th house of gains (${RASHI_EN[g11.sign]}) is ruled by <strong>${g11.lord}</strong> in <strong>House ${lord11.house}</strong>. Consequently, your primary income flows through <em>${HOUSE_DOMAIN_EN[lord11.house]}</em> and consolidates via <em>${HOUSE_DOMAIN_EN[lord2.house]}</em>.
      </p>
      <p>
        <strong>2. Savashtakavarga Treasury Balance (11H Gains: ${bindu11} • 2H Treasury: ${bindu2} • 12H Outflow: ${bindu12} Bindus):</strong>
        ${bindu11 > bindu12
          ? `Because your 11th house (${bindu11} bindus) outweighs your 12th house of expenditure (${bindu12} bindus), your chart supports strong net capital retention.`
          : `Because your 12th house holds ${bindu12} bindus relative to ${bindu2} in the 2nd house, idle liquid cash tends to disperse unless channeled into structured long-term investments.`}
      </p>
      ${renderYogaBadgesHtml(wealthYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 5: FORTUNE (9TH HOUSE IN FULL MODE / JUPITER IN DOB-ONLY MODE)
  // ========================================================================
  function renderChapter5Luck(ctx) {
    const { lang, chart, findings } = ctx;
    const jup = chart.Jupiter;

    if (!chart.isFullChartMode) {
      if (lang === "hi") {
        return `<p><strong>देवगुरु बृहस्पति एवं भाग्य-चक्र (DOB-Only Mode):</strong> आपके जन्म समय पर बृहस्पति <strong>${RASHI_HI[jup.rashi]} (${jup.formattedDMS || jup.formattedDeg})</strong> में स्थित हैं। बृहस्पति का गोचर जब आपके जन्म चंद्र (${RASHI_HI[chart.Moon.rashi]}) से 1, 5, 7, 9 या 11वें स्थान पर आता है, तब आपके जीवन में महत्वपूर्ण उन्नति के द्वार खुलते हैं।</p>`;
      }
      return `<p><strong>Natal Jupiter & Fortune Cycles (DOB-Only Mode):</strong> On your birth date, Jupiter is placed in <strong>${RASHI_EN[jup.rashi]} (${jup.formattedDMS || jup.formattedDeg})</strong>. Your strongest fortune expansions occur during years when transiting Jupiter aspects your Natal Moon in ${RASHI_EN[chart.Moon.rashi]} (houses 1, 5, 7, 9, and 11 from Moon).</p>`;
    }

    const ascR = chart.Asc.rashi || chart.Asc.d1;
    const sign9 = ((ascR + 7) % 12) + 1;
    const lord9Key = RASHI_LORDS[sign9];
    const lord9 = chart[lord9Key];
    const luckYogas = (findings?.allYogas || []).filter(y => y.domains.includes("luck"));

    if (lang === "hi") {
      return `
        <p>
          <strong>भाग्येश (${PLANET_HI[lord9Key]}) की ${lord9.house}वें भाव में स्थिति:</strong>
          आपकी कुंडली में नवम भाव (${RASHI_HI[sign9]}) के स्वामी <strong>${PLANET_HI[lord9Key]} (${lord9.formattedDMS || lord9.formattedDeg})</strong> <strong>${lord9.house}वें भाव (${RASHI_HI[lord9.rashi]})</strong> में तथा नवांश (D9) में <strong>${RASHI_HI[lord9.d9]}</strong> राशि में स्थित हैं। इसका सीधा अर्थ है कि आपका भाग्योदय <em>${HOUSE_DOMAIN_HI[lord9.house]}</em> के माध्यम से सक्रिय होता है।
        </p>
        ${renderYogaBadgesHtml(luckYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>9th Lord of Dharma & Grace (${lord9Key}) in House ${lord9.house}:</strong>
        Your 9th house (${RASHI_EN[sign9]}) is governed by <strong>${lord9Key} (${lord9.formattedDMS || lord9.formattedDeg})</strong>, seated in <strong>House ${lord9.house} (${RASHI_EN[lord9.rashi]})</strong> and in <strong>${RASHI_EN[lord9.d9]}</strong> in the D9 Navamsa. Your fortune unlocks directly through <em>${HOUSE_DOMAIN_EN[lord9.house]}</em>.
      </p>
      ${renderYogaBadgesHtml(luckYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 6: LOVE & EMOTIONAL CHEMISTRY (VENUS & MOON)
  // ========================================================================
  function renderChapter6Love(ctx) {
    const { lang, chart } = ctx;
    const ven  = chart.Venus;
    const moon = chart.Moon;

    if (lang === "hi") {
      return `
        <p>
          <strong>शुक्र (${RASHI_HI[ven.rashi]} ${ven.formattedDMS || ven.formattedDeg}) एवं चंद्र (${RASHI_HI[moon.rashi]}) का भावनात्मक समन्वय:</strong>
          आपकी पत्रिका में प्रेम व सौंदर्य के कारक शुक्र <strong>${RASHI_HI[ven.rashi]}</strong> (${ven.dignityInfo?.hi || ""}${ven.combust ? ", अस्त" : ""}${ven.retro ? ", वक्री" : ""}) में तथा चंद्रमा <strong>${RASHI_HI[moon.rashi]}</strong> में स्थित हैं। नवांश (D9) में शुक्र <strong>${RASHI_HI[ven.d9]}</strong> राशि में स्थित होकर आपके अंतरंग संबंधों में निष्ठा और वैचारिक तालमेल को प्राथमिकता देते हैं।
        </p>
      `;
    }

    return `
      <p>
        <strong>Venus (${RASHI_EN[ven.rashi]} ${ven.formattedDMS || ven.formattedDeg}) & Lunar Chemistry (${RASHI_EN[moon.rashi]}):</strong>
        With relational karaka Venus placed in <strong>${RASHI_EN[ven.rashi]}</strong> (${ven.dignityInfo?.en || ""}${ven.combust ? ", Combust" : ""}${ven.retro ? ", Retrograde" : ""}) and moving into <strong>${RASHI_EN[ven.d9]}</strong> in Navamsa (D9), your emotional bonding is shaped by ${RASHI_LORDS[ven.rashi]} and ${RASHI_LORDS[moon.rashi]}.
      </p>
    `;
  }

  // ========================================================================
  // CHAPTER 7: MARRIAGE, 7TH LORD, D9 NAVAMSA, DARAKARAKA & MANGLIK CHECK
  // ========================================================================
  function renderChapter7Partner(ctx) {
    const { lang, gender, chart, findings, specialLagnas } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";

    const mar = findings.domainChecks.marriage;
    const lord7 = chart[mar.lord];
    const dkKey = findings.charaKarakas?.darakaraka || "Venus";
    const dkPlanet = chart[dkKey];
    const karakaKey = gender === "female" ? "Jupiter" : "Venus";
    const karaka = chart[karakaKey];
    const ulRashi = specialLagnas.upapadaRashi;
    const manglik = findings.manglik;

    let manglikHtml = "";
    if (manglik) {
      if (!manglik.isManglik && !manglik.isChandraManglik) {
        manglikHtml = lang === "hi"
          ? `<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mt-3">✓ <strong>मांगलिक दोष स्थिति:</strong> आपकी लग्न कुंडली में मंगल ${chart.Mars.house}वें भाव में होने से कुंडली मांगलिक दोष से पूर्णतः मुक्त है।</div>`
          : `<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mt-3">✓ <strong>Manglik Dosha Status:</strong> With Mars in House ${chart.Mars.house}, your chart is completely free from Kuja/Manglik Dosha.</div>`;
      } else if (manglik.isCancelled) {
        manglikHtml = lang === "hi"
          ? `<div class="p-3 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mt-3">ℹ️ <strong>मांगलिक दोष परिहार (Cancelled Kuja Dosha):</strong> मंगल ${manglik.marsFromLagna}वें भाव में स्थित है, परंतु शास्त्रीय नियमों (${manglik.reasonsHi.join("; ")}) के कारण मांगलिक दोष का परिहार हो रहा है।</div>`
          : `<div class="p-3 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mt-3">ℹ️ <strong>Manglik Dosha Cancellation (Parihara):</strong> Although Mars occupies House ${manglik.marsFromLagna}, classical cancellation applies because ${manglik.reasonsEn.join("; ")}.</div>`;
      } else {
        manglikHtml = lang === "hi"
          ? `<div class="p-3 rounded-xl bg-rose-950/70 border border-rose-400/50 text-xs md:text-sm text-rose-200 mt-3">⚠️ <strong>सक्रिय मांगलिक विचार:</strong> मंगल लग्न से ${manglik.marsFromLagna}वें एवं चंद्र से ${manglik.marsFromMoon}वें भाव में स्थित है। विवाह पूर्व अष्टकूट और मंगल संतुलन का मिलान आवश्यक है।</div>`
          : `<div class="p-3 rounded-xl bg-rose-950/70 border border-rose-400/50 text-xs md:text-sm text-rose-200 mt-3">⚠️ <strong>Active Kuja/Manglik Consideration:</strong> Mars occupies the ${manglik.marsFromLagna}th from Lagna and ${manglik.marsFromMoon}th from Moon. Proper chart matching (Ashtakoota & Kuja balance) is advised prior to marriage.</div>`;
      }
    }

    if (lang === "hi") {
      return `
        <p>
          <strong>1. सप्तम भाव (${RASHI_HI[mar.sign]}), सप्तमेश (${PLANET_HI[mar.lord]}) एवं नवांश (D9) पुष्टि:</strong>
          आपकी कुंडली में सप्तमेश <strong>${PLANET_HI[mar.lord]} (${lord7.formattedDMS || lord7.formattedDeg})</strong> लग्न कुंडली के <strong>${lord7.house}वें भाव (${RASHI_HI[lord7.rashi]})</strong> में तथा नवांश कुंडली (D9) में <strong>${RASHI_HI[lord7.d9]}</strong> राशि में स्थित हैं। सप्तमेश का ${lord7.house}वें भाव में होना वैवाहिक जीवन को <em>${HOUSE_DOMAIN_HI[lord7.house]}</em> से जोड़ता है।
        </p>
        <p>
          <strong>2. जैमिनी दाराकारक (${PLANET_HI[dkKey]}), उपपद लग्न (${RASHI_HI[ulRashi]}) एवं नैसर्गिक कारक (${PLANET_HI[karakaKey]}):</strong>
          सबसे कम अंशों वाला ग्रह <strong>${PLANET_HI[dkKey]} (${dkPlanet.formattedDMS || dkPlanet.formattedDeg})</strong> आपका जैमिनी <strong>दाराकारक</strong> है और आपका उपपद लग्न (UL) <strong>${RASHI_HI[ulRashi]}</strong> में स्थित है, जो आपके जीवनसाथी की पृष्ठभूमि और स्वभाव पर ${PLANET_HI[RASHI_LORDS[ulRashi]]} तथा ${PLANET_HI[dkKey]} की छाप दर्शाता है।
        </p>
        ${manglikHtml}
      `;
    }

    return `
      <p>
        <strong>1. 7th House (${RASHI_EN[mar.sign]}), 7th Lord (${mar.lord}) & D9 Navamsa Disposition:</strong>
        Your 7th lord <strong>${mar.lord} (${lord7.formattedDMS || lord7.formattedDeg})</strong> is placed in <strong>House ${lord7.house} (${RASHI_EN[lord7.rashi]})</strong> in D1 and moves into <strong>${RASHI_EN[lord7.d9]}</strong> in your D9 Navamsa. Having the 7th lord in House ${lord7.house} links your marital partnership directly with <em>${HOUSE_DOMAIN_EN[lord7.house]}</em>.
      </p>
      <p>
        <strong>2. Jaimini Darakaraka (${dkKey}), Upapada Lagna (${RASHI_EN[ulRashi]}) & Spouse Karaka (${karakaKey}):</strong>
        By lowest degree in its sign, <strong>${dkKey} (${dkPlanet.formattedDMS || dkPlanet.formattedDeg})</strong> serves as your Jaimini <strong>Darakaraka</strong>, while your Upapada Lagna (UL) falls in <strong>${RASHI_EN[ulRashi]}</strong>—coloring your partner's temperament with the qualities of ${dkKey} and ${RASHI_LORDS[ulRashi]}.
      </p>
      ${manglikHtml}
    `;
  }

  // ========================================================================
  // CHAPTER 8: PROGENY, 5TH LORD, JUPITER & D7 SAPTAMSA
  // ========================================================================
  function renderChapter8Childbirth(ctx) {
    const { lang, chart, findings } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const ch = findings.domainChecks.childbirth;
    const lord5 = chart[ch.lord];
    const d7Asc = chart.Asc.d7 || 1;
    const jup = chart.Jupiter;

    if (lang === "hi") {
      return `
        <p>
          <strong>1. पंचमेश (${PLANET_HI[ch.lord]}), संतान कारक गुरु एवं सप्तांश (D7 — ${RASHI_HI[d7Asc]} लग्न) विश्लेषण:</strong>
          आपकी लग्न कुंडली में पंचमेश <strong>${PLANET_HI[ch.lord]}</strong> ${lord5.house}वें भाव में हैं और सप्तांश कुंडली (D7) में <strong>${RASHI_HI[lord5.d7 || lord5.d9]}</strong> राशि में स्थित हैं। संतान कारक बृहस्पति D1 में ${jup.house}वें भाव (${RASHI_HI[jup.rashi]}) तथा D7 में ${RASHI_HI[jup.d7 || jup.d9]} राशि में हैं।
          ${ch.primaryAfflictor
            ? `पंचम अक्ष पर <strong>${PLANET_HI[ch.primaryAfflictor.planet]}</strong> का प्रभाव (${ch.primaryAfflictor.reasonHi}) होने से संतान प्राप्ति के समय धैर्य एवं चिकित्सीय/वैदिक सावधानी उपयोगी रहेगी।`
            : `पंचम अक्ष और सप्तांश में शुभ बल होने से संतान योग सुदृढ़ है।`}
        </p>
      `;
    }

    return `
      <p>
        <strong>1. 5th Lord (${ch.lord}), Putra-Karaka Jupiter & D7 Saptamsa (${RASHI_EN[d7Asc]} Ascendant):</strong>
        Your 5th lord <strong>${ch.lord}</strong> sits in House ${lord5.house} in D1 and occupies <strong>${RASHI_EN[lord5.d7 || lord5.d9]}</strong> in your Saptamsa (D7) chart, while Putra-karaka Jupiter occupies House ${jup.house} (${RASHI_EN[jup.rashi]}) in D1 and <strong>${RASHI_EN[jup.d7 || jup.d9]}</strong> in D7.
        ${ch.primaryAfflictor
          ? `Because natal <strong>${ch.primaryAfflictor.planet}</strong> ${ch.primaryAfflictor.reasonEn}, mindful medical and transit timing is recommended when planning progeny.`
          : `With your 5th axis and D7 Saptamsa well-supported, progeny indications are clear and favorable.`}
      </p>
    `;
  }

  // ========================================================================
  // CHAPTER 12: ETHICAL DIAGNOSTIC SUMMARY (NO FEAR-MONGERING)
  // ========================================================================
  function renderChapter12Diagnostic(ctx) {
    const { lang, chart, findings, specialLagnas } = ctx;
    if (!chart.isFullChartMode || !findings) return "";

    const matrix = findings.functionalMatrix;
    const badhakaPlanet = chart[matrix.badhakesh];
    const combustList = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter(k => chart[k]?.combust);
    const debilList   = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter(k => chart[k]?.dignityInfo?.code === "DEBILITATED");

    let minH = 1, minB = 99;
    Object.keys(specialLagnas.houseBindus).forEach(h => {
      if (specialLagnas.houseBindus[h] < minB) {
        minB = specialLagnas.houseBindus[h];
        minH = Number(h);
      }
    });

    if (lang === "hi") {
      return `
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/40 space-y-3">
          <div class="font-bold text-amber-300 text-base">
            <i class="fas fa-compass mr-2"></i>आपकी कुंडली के प्रमुख तकनीकी संवेदनशील बिंदु (Chart Sensitivity Summary):
          </div>
          <p class="text-sm mb-0">
            <strong>1. बाधकेश स्थिति (${matrix.badhakaHouse}वेश ${PLANET_HI[matrix.badhakesh]}):</strong>
            ${RASHI_HI[findings.ascRashi]} लग्न के लिए ${matrix.badhakaHouse}वां भाव बाधक स्थान है और इसके स्वामी <strong>${PLANET_HI[matrix.badhakesh]}</strong> ${badhakaPlanet.house}वें भाव (${RASHI_HI[badhakaPlanet.rashi]}) में स्थित हैं।
          </p>
          ${combustList.length ? `<p class="text-sm mb-0"><strong>2. अस्त ग्रह (Combustion):</strong> आपकी पत्रिका में <strong>${combustList.map(k => PLANET_HI[k]).join(", ")}</strong> सूर्य के निकट होने से अस्त हैं, जिनके फलों को शांत एवं सात्विक उपायों से बल दिया जा सकता है।</p>` : ""}
          ${debilList.length ? `<p class="text-sm mb-0"><strong>3. राशि बल संवेदनशीलता:</strong> <strong>${debilList.map(k => PLANET_HI[k]).join(", ")}</strong> नीच राशि में स्थित हैं, अतः इनसे संबंधित निर्णयों में धैर्य आवश्यक है।</p>` : ""}
          <p class="text-sm mb-0">
            <strong>• सर्वाष्टकवर्ग न्यूनतम बिंदु भाव:</strong> आपके <strong>${minH}वें भाव</strong> में सबसे कम (<strong>${minB} बिंदु</strong>) हैं, इसलिए गोचर के समय इस भाव से जुड़े विषयों में संतुलित दृष्टिकोण रखें।
          </p>
        </div>
      `;
    }

    return `
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/40 space-y-3">
        <div class="font-bold text-amber-300 text-base">
          <i class="fas fa-compass mr-2"></i>Technical Sensitivity Audit of Your Chart:
        </div>
        <p class="text-sm mb-0">
          <strong>1. Badhakesh Placement (${matrix.badhakaHouse}th Lord ${matrix.badhakesh}):</strong>
          For ${RASHI_EN[findings.ascRashi]} Ascendant, House ${matrix.badhakaHouse} is the Badhaka Sthana and its ruler <strong>${matrix.badhakesh}</strong> sits in House ${badhakaPlanet.house} (${RASHI_EN[badhakaPlanet.rashi]}).
        </p>
        ${combustList.length ? `<p class="text-sm mb-0"><strong>2. Combust Planets (Asta):</strong> <strong>${combustList.join(", ")}</strong> ${combustList.length > 1 ? "are" : "is"} within the combustion orb of the Sun, requiring patience when their houses are activated.</p>` : ""}
        ${debilList.length ? `<p class="text-sm mb-0"><strong>3. Sign Dignity Note:</strong> <strong>${debilList.join(", ")}</strong> ${debilList.length > 1 ? "occupy" : "occupies"} a debilitation sign in D1.</p>` : ""}
        <p class="text-sm mb-0">
          <strong>• Lowest Sarvashtakavarga Reservoir:</strong> House <strong>${minH}</strong> holds <strong>${minB} bindus</strong> (${HOUSE_DOMAIN_EN[minH]}), indicating where steady planning works better than impulsive risk.
        </p>
      </div>
    `;
  }

  window.NarrativeRules = {
    renderChapter1Personality,
    renderChapter2Education,
    renderChapter3Career,
    renderChapter4Wealth,
    renderChapter5Luck,
    renderChapter6Love,
    renderChapter7Partner,
    renderChapter8Childbirth,
    renderChapter12Diagnostic
  };
})();
