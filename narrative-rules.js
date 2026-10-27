/**
 * ============================================================================
 * JYOTISH TARK — AGE-ADAPTIVE PARASHARI FINDINGS-TO-PROSE NARRATIVE ENGINE
 * File: narrative-rules.js • v2.0 (100% Dynamic Life-Stage & Age-to-Complete)
 * ============================================================================
 * UPGRADES IN v2.0:
 * 1. Zero Static Age-Blind Prose: Adapts tone and predictions for a 10-year-old
 *    child, 17-year-old student, 26-year-old seeker, or 55-year-old veteran.
 * 2. Every chapter explicitly outputs the exact "Age to Complete" + Mahadasha-
 *    Antardasha-Pratyantardasha + Double-Transit window from `TimingEngine`.
 * 3. Strictly grounded in BPHS (Brihat Parashara Hora Shastra) & Jaimini Sutras.
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
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px] font-mono">BPHS Score: ${y.score}</span>
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
        ? `⚠️ <strong>लग्न संधि सूचना (${chart.Asc.formattedDMS || chart.Asc.formattedDeg}):</strong> उदय लग्न राशि की सीमा के 1° के भीतर है। जन्म समय में 4–5 मिनट का अंतर होने पर लग्न राशि बदल सकती है।`
        : `⚠️ <strong>Lagna Sandhi Sensitivity (${chart.Asc.formattedDMS || chart.Asc.formattedDeg}):</strong> Rising Ascendant lies within 1° of a sign boundary. A 4–5 minute variation in birth time can shift house cusps.`);
    }
    if (chart.Moon && chart.Moon.isGandanta) {
      alerts.push(lang === "hi"
        ? `⚠️ <strong>चंद्र गंडांत बिंदु:</strong> जन्म चंद्रमा जल और अग्नि राशि की संधि (गंडांत) में स्थित है, जो गहन अंतर्ज्ञान और तीव्र भावनात्मक संवेदनशीलता देता है।`
        : `⚠️ <strong>Lunar Gandanta Junction:</strong> Natal Moon sits at a water-fire nakshatra junction (Gandanta), giving deep spiritual intuition alongside heightened emotional sensitivity.`);
    }
    if (!alerts.length) return "";
    return `<div class="p-3.5 rounded-xl bg-amber-950/70 border border-amber-400/50 text-xs md:text-sm text-amber-100 space-y-1.5 mb-4">${alerts.map(a => `<div>${a}</div>`).join("")}</div>`;
  }

  function renderMilestoneCalloutBox(winObj, titleHi, titleEn, lang) {
    if (!winObj || !winObj.primaryWindow) return "";
    const pw = winObj.primaryWindow;
    const sw = winObj.secondaryWindow;
    const reasons = (lang === "hi" ? pw.reasonsHi : pw.reasonsEn).join("; ");

    if (lang === "hi") {
      return `
        <div class="p-4 rounded-2xl bg-slate-950/95 border-l-4 border-amber-400 border border-amber-400/40 my-3.5 space-y-1.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs md:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
              <i class="fas fa-calendar-check mr-1.5"></i>${titleHi} — सटीक आयु एवं दशा कालखंड:
            </span>
            <span class="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs">
              ${pw.ageSpanHi} (${pw.periodStr})
            </span>
          </div>
          <p class="text-xs md:text-sm text-gray-100 mb-0">
            <strong>सक्रिय दशा सूत्र:</strong> यह योग <strong>${pw.adLabelHi}</strong>${pw.pdLabelHi ? ` [विशेषकर <strong>${pw.pdLabelHi}</strong>]` : ""} में पूर्ण रूप से फलीभूत होगा, क्योंकि <em>${reasons}</em>।
            ${sw ? `<br><span class="text-purple-200"><strong>द्वितीय प्रबल कालखंड:</strong> ${sw.ageSpanHi} (${sw.periodStr} • ${sw.adLabelHi})।</span>` : ""}
          </p>
        </div>
      `;
    }

    return `
      <div class="p-4 rounded-2xl bg-slate-950/95 border-l-4 border-amber-400 border border-amber-400/40 my-3.5 space-y-1.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs md:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
            <i class="fas fa-calendar-check mr-1.5"></i>${titleEn} — Exact Completion Age & Window:
          </span>
          <span class="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs">
            ${pw.ageSpanEn} (${pw.periodStr})
          </span>
        </div>
        <p class="text-xs md:text-sm text-gray-100 mb-0">
          <strong>Activating Dasha Rule:</strong> Fructifies during <strong>${pw.adLabel}</strong>${pw.pdLabelEn ? ` [specifically <strong>${pw.pdLabelEn}</strong>]` : ""} because <em>${reasons}</em>.
          ${sw ? `<br><span class="text-purple-200"><strong>Secondary Window:</strong> ${sw.ageSpanEn} (${sw.periodStr} • ${sw.adLabel}).</span>` : ""}
        </p>
      </div>
    `;
  }

  // ========================================================================
  // CHAPTER 1: PERSONALITY, LAGNA LORD, MOON NAKSHATRA & ATMAKARAKA
  // ========================================================================
  function renderChapter1Personality(ctx) {
    const { lang, name, chart, findings, specialLagnas, timeline } = ctx;
    const isFull = chart.isFullChartMode;
    const moonR = chart.Moon.rashi || chart.Moon.d1;
    const sunR  = chart.Sun.rashi  || chart.Sun.d1;
    const moonDeg = chart.Moon.formattedDMS || chart.Moon.formattedDeg || "";
    const sunDeg  = chart.Sun.formattedDMS  || chart.Sun.formattedDeg  || "";
    const ls = timeline?.lifeStage || { code: "YUVA_KARMA", integerAge: ctx.numData?.age || 25 };

    if (!isFull) {
      if (lang === "hi") {
        return `
          <p>प्रिय <strong>${name} (वर्तमान आयु: ${ls.integerAge} वर्ष)</strong>, जन्म समय के अभाव में यह विश्लेषण पूर्णतः आपकी <strong>चंद्र राशि (${RASHI_HI[moonR]} ${moonDeg})</strong>, <strong>जन्म नक्षत्र (${ctx.displayMoonNak})</strong> और <strong>सूर्य राशि (${RASHI_HI[sunR]} ${sunDeg})</strong> के वास्तविक पंचांगीय अंशों पर आधारित है।</p>
          <p><strong>1. चंद्र राशि (${RASHI_HI[moonR]}) एवं मानसिक संरचना:</strong> आपका चंद्रमा ${RASHI_HI[moonR]} में (${PLANET_HI[RASHI_LORDS[moonR]]} के स्वामित्व में) स्थित है। वहीं आपका जन्म सूर्य ${RASHI_HI[sunR]} में है, जो आपके संकल्प और कार्यशैली को ${PLANET_HI[RASHI_LORDS[sunR]]} की ऊर्जा प्रदान करता है।</p>
        `;
      }
      return `
        <p>Dear <strong>${name} (Current Age: ${ls.integerAge} Years)</strong>, because no birth time was provided, this reading is anchored to your astronomical <strong>Moon Sign (${RASHI_EN[moonR]} ${moonDeg})</strong>, <strong>Janma Nakshatra (${ctx.displayMoonNak})</strong>, and <strong>Natal Sun (${RASHI_EN[sunR]} ${sunDeg})</strong>.</p>
        <p><strong>1. Lunar Mind (${RASHI_EN[moonR]}) & Solar Core (${RASHI_EN[sunR]}):</strong> Your emotional processing is governed by ${RASHI_LORDS[moonR]} (ruler of ${RASHI_EN[moonR]}), while your outer vitality operates through ${RASHI_LORDS[sunR]} (ruler of ${RASHI_EN[sunR]}).</p>
      `;
    }

    const ascR = chart.Asc.rashi || chart.Asc.d1;
    const lagnaLordKey = RASHI_LORDS[ascR];
    const lagnaLord = chart[lagnaLordKey];
    const akKey = findings?.charaKarakas?.atmakaraka || specialLagnas.atmakarakaKey;
    const akPlanet = chart[akKey];
    const persYogas = (findings?.allYogas || []).filter(y => y.domains.includes("personality"));

    // Life-Stage specific opening guidance
    let stageBannerHi = "";
    let stageBannerEn = "";
    if (ls.code === "BALA") {
      stageBannerHi = `<div class="p-3.5 rounded-xl bg-indigo-950/80 border border-indigo-400/50 text-xs md:text-sm text-indigo-100 mb-4">🧒 <strong>बाल-कुंडली विशेष मार्गदर्शन (आयु ${ls.integerAge} वर्ष):</strong> चूंकि जातक अभी बाल्यावस्था में है, अतः पाराशरी नियमों के अनुसार प्रथम 12 वर्षों में चंद्र-बल, लग्नेश की रोग-प्रतिरोधक क्षमता, स्मरण-शक्ति विकास और आगामी शिक्षा/करियर/विवाह की सटीक आयु का निर्धारण नीचे किया गया है।</div>`;
      stageBannerEn = `<div class="p-3.5 rounded-xl bg-indigo-950/80 border border-indigo-400/50 text-xs md:text-sm text-indigo-100 mb-4">🧒 <strong>Child Horoscope Mode Active (Current Age: ${ls.integerAge} Years):</strong> Because the native is in childhood (Bala Avastha), this Parashari reading focuses on foundational immunity, cognitive development, schooling stream selection, and exact future ages when career, marriage, and wealth yogas will unlock.</div>`;
    } else if (ls.code === "VIDYARTHI") {
      stageBannerHi = `<div class="p-3.5 rounded-xl bg-blue-950/80 border border-blue-400/50 text-xs md:text-sm text-blue-100 mb-4">🎓 <strong>विद्यार्थी अवस्था विश्लेषण (आयु ${ls.integerAge} वर्ष):</strong> यह कालखंड उच्च शिक्षा, प्रतियोगी परीक्षा और करियर की नींव रखने का है।</div>`;
      stageBannerEn = `<div class="p-3.5 rounded-xl bg-blue-950/80 border border-blue-400/50 text-xs md:text-sm text-blue-100 mb-4">🎓 <strong>Student & Academic Stage Active (Age ${ls.integerAge} Years):</strong> Calibrated for higher education, competitive entrance breakthroughs, and upcoming career ignition.</div>`;
    }

    if (lang === "hi") {
      return `
        ${renderSandhiAlertIfPresent(chart, "hi")}
        ${stageBannerHi}
        <p>
          <strong>1. उदय लग्न (${RASHI_HI[ascR]} ${chart.Asc.formattedDMS || chart.Asc.formattedDeg}) एवं लग्नेश (${PLANET_HI[lagnaLordKey]}):</strong>
          <strong>${name} (आयु ${ls.integerAge} वर्ष)</strong> की जन्म कुंडली में <strong>${RASHI_HI[ascR]} लग्न</strong> उदित है और लग्नेश <strong>${PLANET_HI[lagnaLordKey]} (${lagnaLord.formattedDMS || lagnaLord.formattedDeg}, अवस्था: ${lagnaLord.avasthaHi || "सक्रिय"})</strong> <strong>${lagnaLord.house}वें भाव (${RASHI_HI[lagnaLord.rashi]})</strong> में स्थित हैं। पाराशरी सिद्धांत के अनुसार लग्नेश का ${lagnaLord.house}वें भाव में बैठना जीवन के मूल केंद्र को <em>${HOUSE_DOMAIN_HI[lagnaLord.house]}</em> से जोड़ता है।
          ${lagnaLord.isVargottama ? `लग्नेश वर्गोत्तम होने से जातक को असाधारण आंतरिक दृढ़ता और दीर्घायु बल प्राप्त है।` : `नवांश (D9) में लग्नेश ${RASHI_HI[lagnaLord.d9]} राशि में स्थित हैं।`}
        </p>
        <p>
          <strong>2. चंद्र राशि (${RASHI_HI[moonR]} • ${ctx.displayMoonNak}, चरण ${chart.Moon.pada || 1}) एवं जैमिनी आत्मकारक (${PLANET_HI[akKey]}):</strong>
          मन का संचालन ${chart.Moon.house}वें भाव में स्थित <strong>${RASHI_HI[moonR]} के चंद्रमा (${moonDeg})</strong> से होता है। जैमिनी सूत्र के अनुसार कुंडली में सर्वोच्च अंशों पर स्थित ग्रह <strong>${PLANET_HI[akKey]} (${akPlanet.formattedDMS || akPlanet.formattedDeg})</strong> <strong>आत्मकारक</strong> हैं और नवांश में <strong>${RASHI_HI[akPlanet.d9]} (कारकांश)</strong> में जाकर आत्मा की मूल दिशा तय करते हैं।
        </p>
        ${renderYogaBadgesHtml(persYogas, "hi")}
      `;
    }

    return `
      ${renderSandhiAlertIfPresent(chart, "en")}
      ${stageBannerEn}
      <p>
        <strong>1. Rising Ascendant (${RASHI_EN[ascR]} ${chart.Asc.formattedDMS || chart.Asc.formattedDeg}) & Lagna Lord (${lagnaLordKey}):</strong>
        <strong>${name}'s (Age ${ls.integerAge})</strong> chart rises in <strong>${RASHI_EN[ascR]}</strong> with Ascendant lord <strong>${lagnaLordKey} (${lagnaLord.formattedDMS || lagnaLord.formattedDeg}, State: ${lagnaLord.avasthaEn || "Active"})</strong> placed in <strong>House ${lagnaLord.house} (${RASHI_EN[lagnaLord.rashi]})</strong>. In Parashari Jyotish, the 1st lord in the ${lagnaLord.house}th house directs primary life energy toward <em>${HOUSE_DOMAIN_EN[lagnaLord.house]}</em>.
        ${lagnaLord.isVargottama ? `Because ${lagnaLordKey} is Vargottama (occupying ${RASHI_EN[lagnaLord.rashi]} in both D1 and D9), the core constitution carries high inner resilience.` : `In Navamsa (D9), the Lagna lord moves into ${RASHI_EN[lagnaLord.d9]}.`}
      </p>
      <p>
        <strong>2. Lunar Mind (${RASHI_EN[moonR]} • ${ctx.displayMoonNak} Pada ${chart.Moon.pada || 1}) & Jaimini Atmakaraka (${akKey}):</strong>
        The Natal Moon sits in <strong>House ${chart.Moon.house} (${moonDeg})</strong>. By exact degree advancement within its sign, <strong>${akKey} (${akPlanet.formattedDMS || akPlanet.formattedDeg})</strong> is the Jaimini <strong>Atmakaraka</strong>, placing the Karakamsa in <strong>${RASHI_EN[akPlanet.d9]}</strong> in the D9 chart.
      </p>
      ${renderYogaBadgesHtml(persYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 2: EDUCATION, 5TH HOUSE, MERCURY, JUPITER & EXACT ACADEMIC AGE
  // ========================================================================
  function renderChapter2Education(ctx) {
    const { lang, chart, findings, timeline } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const edu = findings.domainChecks.education;
    const lord5 = chart[edu.lord];
    const merc = chart.Mercury;
    const jup  = chart.Jupiter;
    const eduYogas = (findings.allYogas || []).filter(y => y.domains.includes("education"));
    const eduWinHtml = renderMilestoneCalloutBox(timeline?.education, "उच्च शिक्षा एवं प्रतियोगी सफलता योग", "Higher Education & Exam Breakthrough Window", lang);

    if (lang === "hi") {
      return `
        <p>
          <strong>1. पंचम भाव (${RASHI_HI[edu.sign]}) एवं पंचमेश (${PLANET_HI[edu.lord]}):</strong>
          बुद्धि व विद्या के पंचम भाव के स्वामी <strong>${PLANET_HI[edu.lord]} (${lord5.formattedDMS || lord5.formattedDeg})</strong> <strong>${lord5.house}वें भाव (${RASHI_HI[lord5.rashi]})</strong> में स्थित हैं, जो बौद्धिक क्षमता को सीधे <em>${HOUSE_DOMAIN_HI[lord5.house]}</em> से जोड़ते हैं (पंचम भाव सर्वाष्टकवर्ग: <strong>${edu.savBindus} बिंदु</strong>)।
        </p>
        <p>
          <strong>2. बुध (${RASHI_HI[merc.rashi]}) एवं गुरु (${RASHI_HI[jup.rashi]}) की स्थिति:</strong>
          तर्क-कारक बुध ${merc.house}वें भाव में (${merc.dignityInfo?.hi || ""}${merc.combust ? ", सूर्य से अस्त" : ""}${merc.retro ? ", वक्री" : ""}) तथा प्रज्ञा-कारक गुरु ${jup.house}वें भाव में (${jup.dignityInfo?.hi || ""}) स्थित हैं।
          ${edu.primaryAfflictor ? `पंचम अक्ष पर <strong>${PLANET_HI[edu.primaryAfflictor.planet]}</strong> का प्रभाव (${edu.primaryAfflictor.reasonHi}) तकनीकी, प्रयोगात्मक व विश्लेषणात्मक विषयों (STEM/Law/Finance/Research) में गहरी पकड़ देता है।` : `पंचम अक्ष क्रूर ग्रहों के अवरोध से मुक्त होने के कारण अध्ययन एवं विश्लेषण क्षमता स्पष्ट और स्थिर है।`}
        </p>
        ${eduWinHtml}
        ${renderYogaBadgesHtml(eduYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>1. 5th House of Intellect (${RASHI_EN[edu.sign]}) & 5th Lord (${edu.lord}):</strong>
        The 5th house is ruled by <strong>${edu.lord} (${lord5.formattedDMS || lord5.formattedDeg})</strong>, placed in <strong>House ${lord5.house} (${RASHI_EN[lord5.rashi]})</strong>—channeling scholarship and analytical memory into <em>${HOUSE_DOMAIN_EN[lord5.house]}</em> (5th House SAV: <strong>${edu.savBindus} bindus</strong>).
      </p>
      <p>
        <strong>2. Mercury (${RASHI_EN[merc.rashi]}) & Jupiter (${RASHI_EN[jup.rashi]}) Alignment:</strong>
        Mercury occupies House ${merc.house} (${merc.dignityInfo?.en || ""}${merc.combust ? ", Combust" : ""}${merc.retro ? ", Retrograde" : ""}) while Jupiter sits in House ${jup.house} (${jup.dignityInfo?.en || ""}).
        ${edu.primaryAfflictor ? `Because <strong>${edu.primaryAfflictor.planet}</strong> ${edu.primaryAfflictor.reasonEn}, the chart favors applied technical/investigative mastery over rote academic theory.` : `With the 5th axis free from malefic affliction, intellectual focus remains steady and structured.`}
      </p>
      ${eduWinHtml}
      ${renderYogaBadgesHtml(eduYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 3: CAREER, 10TH HOUSE, D10 DASAMSA & EXACT JOB/RISE AGE
  // ========================================================================
  function renderChapter3Career(ctx) {
    const { lang, chart, findings, specialLagnas, timeline } = ctx;
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

    const ignitionBox = renderMilestoneCalloutBox(timeline?.careerIgnition, "प्रथम नौकरी / स्वतंत्र करियर आरंभ आयु", "First Career Ignition & Job Entry Age", lang);
    const peakBox     = renderMilestoneCalloutBox(timeline?.career, "करियर शिखर, पदोन्नति एवं राजयोग उत्थान आयु", "Peak Career Authority & Promotion Window", lang);

    if (lang === "hi") {
      return `
        <p>
          <strong>1. दशम भाव (${RASHI_HI[car.sign]}) एवं दशमेश (${PLANET_HI[car.lord]}) का D1 व D10 (दशमांश) विश्लेषण:</strong>
          लग्न कुंडली में कर्मेश <strong>${PLANET_HI[car.lord]} (${lord10.formattedDMS || lord10.formattedDeg})</strong> <strong>${lord10.house}वें भाव (${RASHI_HI[lord10.rashi]})</strong> में स्थित होकर आजीविका को सीधे <em>${HOUSE_DOMAIN_HI[lord10.house]}</em> से जोड़ते हैं। दशमांश कुंडली (D10 — ${RASHI_HI[d10Asc]} लग्न) में दशमेश <strong>${RASHI_HI[lord10InD10]}</strong> राशि में स्थित हैं${shadbala10 ? ` तथा षड्बल में इनका बल <strong>${shadbala10.rupas} रूप</strong> (आवश्यक न्यूनतम: ${shadbala10.requiredRupas} रूप) है` : ""}।
        </p>
        <p>
          <strong>2. सर्वाष्टकवर्ग कर्म-लाभ अनुपात (10H: ${bindu10} • 6H: ${bindu6} • 11H: ${bindu11} बिंदु):</strong>
          ${bindu10 >= 30
            ? `दशम भाव में ${bindu10} बिंदु होने से कार्यक्षेत्र में स्वाभाविक अधिकार और उच्च प्रशासनिक/नेतृत्व दृश्यता प्राप्त होती है।`
            : `दशम भाव में ${bindu10} और षष्ठ भाव में ${bindu6} बिंदु होने से प्रतिस्पर्धा और तकनीकी दक्षता के बल पर स्थायी पद प्राप्त होता है।`}
          ${lord10.chalitHouse && lord10.chalitHouse !== lord10.house
            ? ` श्रीपति भाव चलित में दशमेश ${lord10.chalitHouse}वें भाव का फल भी सक्रिय कर रहे हैं।`
            : ""}
        </p>
        ${ignitionBox}
        ${peakBox}
        ${renderYogaBadgesHtml(careerYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>1. 10th House (${RASHI_EN[car.sign]}), 10th Lord (${car.lord}) & D10 Dasamsa Confirmation:</strong>
        The 10th lord <strong>${car.lord} (${lord10.formattedDMS || lord10.formattedDeg})</strong> occupies <strong>House ${lord10.house} (${RASHI_EN[lord10.rashi]})</strong>, linking professional authority directly to <em>${HOUSE_DOMAIN_EN[lord10.house]}</em>. In the Dasamsa chart (D10 — ${RASHI_EN[d10Asc]} Ascendant), ${car.lord} is placed in <strong>${RASHI_EN[lord10InD10]}</strong>${shadbala10 ? ` with a Shadbala strength of <strong>${shadbala10.rupas} Rupas</strong> (required minimum: ${shadbala10.requiredRupas} Rupas)` : ""}.
      </p>
      <p>
        <strong>2. Sarvashtakavarga Karma-Labha Ratio (10H: ${bindu10} • 6H: ${bindu6} • 11H: ${bindu11} Bindus):</strong>
        ${bindu10 >= 30
          ? `With ${bindu10} bindus in the 10th house, the chart carries strong institutional command and executive visibility.`
          : `With ${bindu10} bindus in the 10th house and ${bindu6} in the 6th, authority is forged through structured problem-solving and competitive endurance.`}
        ${lord10.chalitHouse && lord10.chalitHouse !== lord10.house
          ? ` In Sripati Bhava Chalit, the 10th lord shifts into House ${lord10.chalitHouse}, blending its results with that bhava.`
          : ""}
      </p>
      ${ignitionBox}
      ${peakBox}
      ${renderYogaBadgesHtml(careerYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 4: WEALTH, 2ND & 11TH LORDS, D4 PROPERTY & EXACT WEALTH AGE
  // ========================================================================
  function renderChapter4Wealth(ctx) {
    const { lang, chart, findings, specialLagnas, timeline } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const w2  = findings.domainChecks.wealth;
    const g11 = findings.domainChecks.gains;
    const lord2  = chart[w2.lord];
    const lord11 = chart[g11.lord];
    const bindu2  = specialLagnas.houseBindus[2];
    const bindu11 = specialLagnas.houseBindus[11];
    const bindu12 = specialLagnas.houseBindus[12];
    const wealthYogas = (findings.allYogas || []).filter(y => y.domains.includes("wealth"));

    const wealthWinBox = renderMilestoneCalloutBox(timeline?.wealthPeak, "वृहद् धन-उत्थान एवं कोष वृद्धि आयु", "Major Wealth & Treasury Multiplication Age", lang);
    const propWinBox   = renderMilestoneCalloutBox(timeline?.property, "भूमि-भवन निर्माण एवं वाहन सुख आयु", "Property, Land & Vehicle Acquisition Age", lang);

    if (lang === "hi") {
      return `
        <p>
          <strong>1. धनेश (${PLANET_HI[w2.lord]}) एवं लाभेश (${PLANET_HI[g11.lord]}) का पाराशरी समीकरण:</strong>
          द्वितीय भाव (${RASHI_HI[w2.sign]}) के स्वामी <strong>${PLANET_HI[w2.lord]}</strong> <strong>${lord2.house}वें भाव</strong> में तथा एकादश भाव (${RASHI_HI[g11.sign]}) के स्वामी <strong>${PLANET_HI[g11.lord]}</strong> <strong>${lord11.house}वें भाव</strong> में स्थित हैं। आय का मुख्य स्रोत <em>${HOUSE_DOMAIN_HI[lord11.house]}</em> से तथा धन-संचय <em>${HOUSE_DOMAIN_HI[lord2.house]}</em> के माध्यम से निर्मित होता है।
        </p>
        <p>
          <strong>2. धन-प्रवाह बनाम व्यय अष्टकवर्ग (लाभ 11H: ${bindu11} • कोष 2H: ${bindu2} • व्यय 12H: ${bindu12} बिंदु):</strong>
          ${bindu11 > bindu12
            ? `एकादश भाव (${bindu11} बिंदु) का बल द्वादश भाव (${bindu12} बिंदु) से अधिक होने के कारण शुद्ध बचत और संपत्ति निर्माण की गति प्रबल है।`
            : `द्वादश भाव (${bindu12} बिंदु) के बिंदु उच्च होने से तरल नकदी (Liquid Cash) के स्थान पर अचल संपत्ति, भूमि या दीर्घकालिक निवेश में धन रखना अधिक सुरक्षित है।`}
        </p>
        ${wealthWinBox}
        ${propWinBox}
        ${renderYogaBadgesHtml(wealthYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>1. 2nd Lord (${w2.lord}) & 11th Lord (${g11.lord}) Artha Synthesis:</strong>
        The 2nd house of treasury (${RASHI_EN[w2.sign]}) is ruled by <strong>${w2.lord}</strong> in <strong>House ${lord2.house}</strong>, while the 11th house of gains (${RASHI_EN[g11.sign]}) is ruled by <strong>${g11.lord}</strong> in <strong>House ${lord11.house}</strong>. Primary income flows through <em>${HOUSE_DOMAIN_EN[lord11.house]}</em> and consolidates via <em>${HOUSE_DOMAIN_EN[lord2.house]}</em>.
      </p>
      <p>
        <strong>2. Savashtakavarga Treasury Balance (11H Gains: ${bindu11} • 2H Treasury: ${bindu2} • 12H Outflow: ${bindu12} Bindus):</strong>
        ${bindu11 > bindu12
          ? `Because the 11th house (${bindu11} bindus) outweighs the 12th house of expenditure (${bindu12} bindus), the chart supports strong net capital retention.`
          : `Because the 12th house holds ${bindu12} bindus relative to ${bindu2} in the 2nd house, idle liquid cash tends to disperse unless locked into real estate or long-term compounding assets.`}
      </p>
      ${wealthWinBox}
      ${propWinBox}
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
        return `<p><strong>देवगुरु बृहस्पति एवं भाग्य-चक्र (DOB-Only Mode):</strong> जन्म समय पर बृहस्पति <strong>${RASHI_HI[jup.rashi]} (${jup.formattedDMS || jup.formattedDeg})</strong> में स्थित हैं। बृहस्पति का गोचर जब जन्म चंद्र (${RASHI_HI[chart.Moon.rashi]}) से 1, 5, 7, 9 या 11वें स्थान पर आता है, तब जीवन में महत्वपूर्ण भाग्योदय के द्वार खुलते हैं।</p>`;
      }
      return `<p><strong>Natal Jupiter & Fortune Cycles (DOB-Only Mode):</strong> On the birth date, Jupiter is placed in <strong>${RASHI_EN[jup.rashi]} (${jup.formattedDMS || jup.formattedDeg})</strong>. Strongest fortune expansions occur during years when transiting Jupiter aspects the Natal Moon in ${RASHI_EN[chart.Moon.rashi]} (houses 1, 5, 7, 9, and 11 from Moon).</p>`;
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
          कुंडली में नवम भाव (${RASHI_HI[sign9]}) के स्वामी <strong>${PLANET_HI[lord9Key]} (${lord9.formattedDMS || lord9.formattedDeg})</strong> <strong>${lord9.house}वें भाव (${RASHI_HI[lord9.rashi]})</strong> में तथा नवांश (D9) में <strong>${RASHI_HI[lord9.d9]}</strong> राशि में स्थित हैं। इसका सीधा अर्थ है कि भाग्योदय <em>${HOUSE_DOMAIN_HI[lord9.house]}</em> के माध्यम से सक्रिय होता है।
        </p>
        ${renderYogaBadgesHtml(luckYogas, "hi")}
      `;
    }

    return `
      <p>
        <strong>9th Lord of Dharma & Grace (${lord9Key}) in House ${lord9.house}:</strong>
        The 9th house (${RASHI_EN[sign9]}) is governed by <strong>${lord9Key} (${lord9.formattedDMS || lord9.formattedDeg})</strong>, seated in <strong>House ${lord9.house} (${RASHI_EN[lord9.rashi]})</strong> and in <strong>${RASHI_EN[lord9.d9]}</strong> in the D9 Navamsa. Fortune unlocks directly through <em>${HOUSE_DOMAIN_EN[lord9.house]}</em>.
      </p>
      ${renderYogaBadgesHtml(luckYogas, "en")}
    `;
  }

  // ========================================================================
  // CHAPTER 6: EMOTIONAL HARMONY & RELATIONAL DISPOSITION (AGE-ADAPTIVE)
  // ========================================================================
  function renderChapter6Love(ctx) {
    const { lang, chart, timeline } = ctx;
    const ven  = chart.Venus;
    const moon = chart.Moon;
    const ls = timeline?.lifeStage || { code: "YUVA_KARMA", integerAge: 25 };

    if (ls.code === "BALA") {
      if (lang === "hi") {
        return `
          <p>
            <strong>बाल-मनोविज्ञान, पारिवारिक स्नेह एवं भावनात्मक संवेदनशीलता (चंद्र ${RASHI_HI[moon.rashi]} • शुक्र ${RASHI_HI[ven.rashi]}):</strong>
            जातक की वर्तमान आयु <strong>${ls.integerAge} वर्ष</strong> है। इस बाल्यावस्था में चंद्रमा (${RASHI_HI[moon.rashi]}) और शुक्र (${RASHI_HI[ven.rashi]}) बच्चे के अपने माता-पिता, भाई-बहन और मित्रों के साथ भावनात्मक जुड़ाव तथा कलात्मक/रचनात्मक अभिरुचि को दर्शाते हैं। जातक को डांट या कठोर दबाव के बजाय तार्किक संवाद और स्नेहपूर्ण वातावरण में सिखाना उसकी मेधा को दोगुना निखारता है। युवावस्था (21+ वर्ष) में प्रवेश करने पर नवांश का शुक्र (${RASHI_HI[ven.d9]}) उसके वैवाहिक सामंजस्य को दिशा देगा।
          </p>
        `;
      }
      return `
        <p>
          <strong>Childhood Emotional Bonding, Creative Sensitivity & Family Harmony (Moon in ${RASHI_EN[moon.rashi]} • Venus in ${RASHI_EN[ven.rashi]}):</strong>
          At <strong>age ${ls.integerAge}</strong>, Moon (${RASHI_EN[moon.rashi]}) and Venus (${RASHI_EN[ven.rashi]}) govern the child's emotional security with parents, artistic curiosity, and social temperament among peers. Gentle encouragement rather than harsh criticism unlocks the child's best confidence. In adulthood (age 21+), D9 Venus in <strong>${RASHI_EN[ven.d9]}</strong> will shape mature relational harmony.
        </p>
      `;
    }

    if (lang === "hi") {
      return `
        <p>
          <strong>शुक्र (${RASHI_HI[ven.rashi]} ${ven.formattedDMS || ven.formattedDeg}) एवं चंद्र (${RASHI_HI[moon.rashi]}) का भावनात्मक समन्वय:</strong>
          पत्रिका में प्रेम व सामंजस्य के कारक शुक्र <strong>${RASHI_HI[ven.rashi]}</strong> (${ven.dignityInfo?.hi || ""}${ven.combust ? ", अस्त" : ""}${ven.retro ? ", वक्री" : ""}) में तथा चंद्रमा <strong>${RASHI_HI[moon.rashi]}</strong> में स्थित हैं। नवांश (D9) में शुक्र <strong>${RASHI_HI[ven.d9]}</strong> राशि में स्थित होकर अंतरंग संबंधों में निष्ठा और वैचारिक तालमेल को प्राथमिकता देते हैं।
        </p>
      `;
    }

    return `
      <p>
        <strong>Venus (${RASHI_EN[ven.rashi]} ${ven.formattedDMS || ven.formattedDeg}) & Lunar Chemistry (${RASHI_EN[moon.rashi]}):</strong>
        With relational karaka Venus placed in <strong>${RASHI_EN[ven.rashi]}</strong> (${ven.dignityInfo?.en || ""}${ven.combust ? ", Combust" : ""}${ven.retro ? ", Retrograde" : ""}) and moving into <strong>${RASHI_EN[ven.d9]}</strong> in Navamsa (D9), emotional bonding is shaped by ${RASHI_LORDS[ven.rashi]} and ${RASHI_LORDS[moon.rashi]}.
      </p>
    `;
  }

  // ========================================================================
  // CHAPTER 7: MARRIAGE, 7TH LORD, D9 NAVAMSA, MANGLIK & EXACT MARRIAGE AGE
  // ========================================================================
  function renderChapter7Partner(ctx) {
    const { lang, gender, chart, findings, specialLagnas, timeline } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";

    const mar = findings.domainChecks.marriage;
    const lord7 = chart[mar.lord];
    const dkKey = findings.charaKarakas?.darakaraka || "Venus";
    const dkPlanet = chart[dkKey];
    const karakaKey = gender === "female" ? "Jupiter" : "Venus";
    const ulRashi = specialLagnas.upapadaRashi;
    const manglik = findings.manglik;
    const mb = timeline?.marriageBaseline;
    const marriageWinBox = renderMilestoneCalloutBox(timeline?.marriage, "विवाह एवं पाणिग्रहण संस्कार आयु", "Exact Marriage Age & Vivaha Dasha Window", lang);

    let manglikHtml = "";
    if (manglik) {
      if (!manglik.isManglik && !manglik.isChandraManglik) {
        manglikHtml = lang === "hi"
          ? `<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mt-3">✓ <strong>मांगलिक दोष स्थिति:</strong> लग्न कुंडली में मंगल ${chart.Mars.house}वें भाव में होने से कुंडली मांगलिक दोष से पूर्णतः मुक्त है।</div>`
          : `<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mt-3">✓ <strong>Manglik Dosha Status:</strong> With Mars in House ${chart.Mars.house}, the chart is completely free from Kuja/Manglik Dosha.</div>`;
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
          कुंडली में सप्तमेश <strong>${PLANET_HI[mar.lord]} (${lord7.formattedDMS || lord7.formattedDeg})</strong> लग्न कुंडली के <strong>${lord7.house}वें भाव (${RASHI_HI[lord7.rashi]})</strong> में तथा नवांश कुंडली (D9) में <strong>${RASHI_HI[lord7.d9]}</strong> राशि में स्थित हैं। सप्तमेश का ${lord7.house}वें भाव में होना वैवाहिक जीवन को <em>${HOUSE_DOMAIN_HI[lord7.house]}</em> से जोड़ता है।
          ${mb ? ` पाराशरी विवाह-आयु गणना के अनुसार सप्तम अक्ष और कारक ग्रहों का संतुलन <strong>${mb.idealRangeStr} वर्ष की आयु</strong> के आसपास विवाह के लिए सर्वाधिक अनुकूल है।` : ""}
        </p>
        <p>
          <strong>2. जैमिनी दाराकारक (${PLANET_HI[dkKey]}), उपपद लग्न (${RASHI_HI[ulRashi]}) एवं नैसर्गिक कारक (${PLANET_HI[karakaKey]}):</strong>
          सबसे कम अंशों वाला ग्रह <strong>${PLANET_HI[dkKey]} (${dkPlanet.formattedDMS || dkPlanet.formattedDeg})</strong> जैमिनी <strong>दाराकारक</strong> है और उपपद लग्न (UL) <strong>${RASHI_HI[ulRashi]}</strong> में स्थित है, जो जीवनसाथी की पृष्ठभूमि और स्वभाव पर ${PLANET_HI[RASHI_LORDS[ulRashi]]} तथा ${PLANET_HI[dkKey]} की छाप दर्शाता है।
        </p>
        ${marriageWinBox}
        ${manglikHtml}
      `;
    }

    return `
      <p>
        <strong>1. 7th House (${RASHI_EN[mar.sign]}), 7th Lord (${mar.lord}) & D9 Navamsa Disposition:</strong>
        The 7th lord <strong>${mar.lord} (${lord7.formattedDMS || lord7.formattedDeg})</strong> is placed in <strong>House ${lord7.house} (${RASHI_EN[lord7.rashi]})</strong> in D1 and moves into <strong>${RASHI_EN[lord7.d9]}</strong> in the D9 Navamsa. Having the 7th lord in House ${lord7.house} links marital partnership directly with <em>${HOUSE_DOMAIN_EN[lord7.house]}</em>.
        ${mb ? ` By Parashari marriage-age evaluation, the 7th axis and karaka disposition point to an ideal marriage baseline around <strong>Age ${mb.idealRangeStr}</strong>.` : ""}
      </p>
      <p>
        <strong>2. Jaimini Darakaraka (${dkKey}), Upapada Lagna (${RASHI_EN[ulRashi]}) & Spouse Karaka (${karakaKey}):</strong>
        By lowest degree in its sign, <strong>${dkKey} (${dkPlanet.formattedDMS || dkPlanet.formattedDeg})</strong> serves as the Jaimini <strong>Darakaraka</strong>, while the Upapada Lagna (UL) falls in <strong>${RASHI_EN[ulRashi]}</strong>—coloring the partner's temperament with the qualities of ${dkKey} and ${RASHI_LORDS[ulRashi]}.
      </p>
      ${marriageWinBox}
      ${manglikHtml}
    `;
  }

  // ========================================================================
  // CHAPTER 8: PROGENY, 5TH LORD, JUPITER, D7 SAPTAMSA & EXACT PROGENY AGE
  // ========================================================================
  function renderChapter8Childbirth(ctx) {
    const { lang, chart, findings, timeline } = ctx;
    if (!chart.isFullChartMode || !findings?.domainChecks) return "";
    const ch = findings.domainChecks.childbirth;
    const lord5 = chart[ch.lord];
    const d7Asc = chart.Asc.d7 || 1;
    const jup = chart.Jupiter;
    const babyWinBox = renderMilestoneCalloutBox(timeline?.childbirth, "संतान प्राप्ति एवं वंश-वृद्धि आयु", "Progeny & Childbirth Completion Age", lang);

    if (lang === "hi") {
      return `
        <p>
          <strong>1. पंचमेश (${PLANET_HI[ch.lord]}), संतान कारक गुरु एवं सप्तांश (D7 — ${RASHI_HI[d7Asc]} लग्न) विश्लेषण:</strong>
          लग्न कुंडली में पंचमेश <strong>${PLANET_HI[ch.lord]}</strong> ${lord5.house}वें भाव में हैं और सप्तांश कुंडली (D7) में <strong>${RASHI_HI[lord5.d7 || lord5.d9]}</strong> राशि में स्थित हैं। संतान कारक बृहस्पति D1 में ${jup.house}वें भाव (${RASHI_HI[jup.rashi]}) तथा D7 में ${RASHI_HI[jup.d7 || jup.d9]} राशि में हैं।
          ${ch.primaryAfflictor
            ? `पंचम अक्ष पर <strong>${PLANET_HI[ch.primaryAfflictor.planet]}</strong> का प्रभाव (${ch.primaryAfflictor.reasonHi}) होने से संतान योजना के समय धैर्य एवं चिकित्सीय/वैदिक सावधानी उपयोगी रहेगी।`
            : `पंचम अक्ष और सप्तांश में शुभ बल होने से संतान सुख का योग सुदृढ़ है।`}
        </p>
        ${babyWinBox}
      `;
    }

    return `
      <p>
        <strong>1. 5th Lord (${ch.lord}), Putra-Karaka Jupiter & D7 Saptamsa (${RASHI_EN[d7Asc]} Ascendant):</strong>
        The 5th lord <strong>${ch.lord}</strong> sits in House ${lord5.house} in D1 and occupies <strong>${RASHI_EN[lord5.d7 || lord5.d9]}</strong> in the Saptamsa (D7) chart, while Putra-karaka Jupiter occupies House ${jup.house} (${RASHI_EN[jup.rashi]}) in D1 and <strong>${RASHI_EN[jup.d7 || jup.d9]}</strong> in D7.
        ${ch.primaryAfflictor
          ? `Because natal <strong>${ch.primaryAfflictor.planet}</strong> ${ch.primaryAfflictor.reasonEn}, mindful medical and transit timing is recommended when planning progeny.`
          : `With the 5th axis and D7 Saptamsa well-supported, progeny indications are clear and favorable.`}
      </p>
      ${babyWinBox}
    `;
  }

  // ========================================================================
  // CHAPTER 12: ETHICAL DIAGNOSTIC SUMMARY
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
            <i class="fas fa-compass mr-2"></i>कुंडली के प्रमुख तकनीकी संवेदनशील बिंदु (Chart Sensitivity Summary):
          </div>
          <p class="text-sm mb-0">
            <strong>1. बाधकेश स्थिति (${matrix.badhakaHouse}वेश ${PLANET_HI[matrix.badhakesh]}):</strong>
            ${RASHI_HI[findings.ascRashi]} लग्न के लिए ${matrix.badhakaHouse}वां भाव बाधक स्थान है और इसके स्वामी <strong>${PLANET_HI[matrix.badhakesh]}</strong> ${badhakaPlanet.house}वें भाव (${RASHI_HI[badhakaPlanet.rashi]}) में स्थित हैं।
          </p>
          ${combustList.length ? `<p class="text-sm mb-0"><strong>2. अस्त ग्रह (Combustion):</strong> पत्रिका में <strong>${combustList.map(k => PLANET_HI[k]).join(", ")}</strong> सूर्य के निकट होने से अस्त हैं, जिनके फलों को शांत एवं सात्विक उपायों से बल दिया जा सकता है।</p>` : ""}
          ${debilList.length ? `<p class="text-sm mb-0"><strong>3. राशि बल संवेदनशीलता:</strong> <strong>${debilList.map(k => PLANET_HI[k]).join(", ")}</strong> नीच राशि में स्थित हैं, अतः इनसे संबंधित निर्णयों में धैर्य आवश्यक है।</p>` : ""}
          <p class="text-sm mb-0">
            <strong>• सर्वाष्टकवर्ग न्यूनतम बिंदु भाव:</strong> <strong>${minH}वें भाव</strong> में सबसे कम (<strong>${minB} बिंदु</strong>) हैं, इसलिए गोचर के समय इस भाव से जुड़े विषयों में संतुलित दृष्टिकोण रखें।
          </p>
        </div>
      `;
    }

    return `
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/40 space-y-3">
        <div class="font-bold text-amber-300 text-base">
          <i class="fas fa-compass mr-2"></i>Technical Sensitivity Audit of the Chart:
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
    renderChapter12Diagnostic,
    renderMilestoneCalloutBox
  };
})();
