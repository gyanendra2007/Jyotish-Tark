/**
 * ============================================================================
 * JYOTISH TARK — FULL LIFE-SPAN PARASHARI DASHA, DOUBLE-TRANSIT & AGE ENGINE
 * File: timing-engine.js • v2.0 (100% Dynamic Age-to-Complete Edition)
 * ============================================================================
 * UPGRADES IN v2.0:
 * 1. Full 120-Year Vimshottari Scanner (Never clips future windows for children!)
 * 2. Classical Parashari Marriage Age Formula (Early vs. Delayed Marriage Modifiers
 *    from 7th House, 7th Lord, Venus/Jupiter, D9 Navamsa, Saturn/Rahu/Mars aspects)
 * 3. 7-Domain Age-to-Complete Calculator:
 *    - Higher Education & Competitive Exams (Age 15–25)
 *    - Career Ignition / First Job (Age 21–28)
 *    - Career Peak & Executive Authority (Age 26–50)
 *    - Marriage & Sacred Partnership (Biological/Legal + Classical Parashari Window)
 *    - Progeny / Childbirth (Post-Marriage Window + 5th/D7 Activation)
 *    - Property, Land & Vehicle Acquisition (4th House + Mars/Venus + D4)
 *    - Golden Wealth & Treasury Expansion (2nd/11th House + Dhana Yoga Activation)
 * 4. Life-Stage Classifier (Bala 0-12, Vidyarthi 13-20, Yuva 21-35, Grihastha 36-55, Pragya 56+)
 * ============================================================================
 */

(function () {
  "use strict";

  const RASHI_LORDS = [
    null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
  ];

  const RASHI_NAMES_EN = [
    null, "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const RASHI_NAMES_HI = [
    null, "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
  ];

  const PLANET_HI = {
    Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
    Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
  };

  const EXALTED_SIGN = {
    Sun: 1, Moon: 2, Mars: 10, Mercury: 6,
    Jupiter: 4, Venus: 12, Saturn: 7, Rahu: 2, Ketu: 8
  };
  const OWN_SIGNS = {
    Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6],
    Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11], Rahu: [11], Ketu: [8]
  };

  const PARASHARI_ASPECTS = {
    Sun: [7], Moon: [7], Mercury: [7], Venus: [7],
    Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10],
    Rahu: [5, 7, 9], Ketu: [5, 7, 9]
  };

  function norm360(d) {
    return ((Number(d || 0) % 360) + 360) % 360;
  }

  function houseFrom(refRashi, targetRashi) {
    return ((targetRashi - refRashi + 12) % 12) + 1;
  }

  function rashiOfHouse(ascRashi, houseNum) {
    return ((ascRashi + houseNum - 2) % 12) + 1;
  }

  function doesPlanetAspectRashi(planetKey, fromRashi, targetRashi) {
    if (fromRashi === targetRashi) return true;
    const nth = houseFrom(fromRashi, targetRashi);
    return (PARASHARI_ASPECTS[planetKey] || [7]).includes(nth);
  }

  function isStrongInSign(planet, rashi) {
    return EXALTED_SIGN[planet] === rashi || (OWN_SIGNS[planet] || []).includes(rashi);
  }

  // ==========================================================================
  // 1. LIFE-STAGE CLASSIFIER (ADAPTS ENTIRE KUNDALI TO NATIVE'S EXACT AGE)
  // ==========================================================================
  function classifyLifeStage(birthDateStr) {
    const parts = (birthDateStr || "1998-01-24").split("-").map(Number);
    const bYear = parts[0] || 1998;
    const bMonth = parts[1] || 1;
    const bDay = parts[2] || 24;

    const now = new Date();
    const birthDate = new Date(Date.UTC(bYear, bMonth - 1, bDay));
    const diffMs = Math.max(0, now.getTime() - birthDate.getTime());
    const exactAgeYears = Number((diffMs / (365.25 * 86400000)).toFixed(2));
    const integerAge = Math.max(0, Math.floor(exactAgeYears));
    const monthsRemainder = Math.max(0, Math.floor((exactAgeYears - integerAge) * 12));

    let code = "YUVA_KARMA";
    let badgeEn = "Prime Career & Family-Building Stage";
    let badgeHi = "युवा कर्म, करियर एवं गृहस्थ निर्माण चरण";

    if (exactAgeYears < 13) {
      code = "BALA";
      badgeEn = `Childhood Foundation Stage (Age ${integerAge} Yrs ${monthsRemainder} Mos)`;
      badgeHi = `बाल्यावस्था एवं संस्कार-नींव चरण (आयु ${integerAge} वर्ष ${monthsRemainder} माह)`;
    } else if (exactAgeYears < 21) {
      code = "VIDYARTHI";
      badgeEn = `Student & Academic Specialization Stage (Age ${integerAge} Yrs)`;
      badgeHi = `विद्यार्थी, उच्च शिक्षा एवं कौशल निर्माण चरण (आयु ${integerAge} वर्ष)`;
    } else if (exactAgeYears < 36) {
      code = "YUVA_KARMA";
      badgeEn = `Career Ascent, Marriage & Establishment Stage (Age ${integerAge} Yrs)`;
      badgeHi = `युवा करियर उत्थान, विवाह एवं स्थायित्व चरण (आयु ${integerAge} वर्ष)`;
    } else if (exactAgeYears < 56) {
      code = "GRIHASTHA_PRABALYA";
      badgeEn = `Executive Command, Wealth & Family Maturity Stage (Age ${integerAge} Yrs)`;
      badgeHi = `प्रौढ़ नेतृत्व, संपत्ति विस्तार एवं पारिवारिक शिखर चरण (आयु ${integerAge} वर्ष)`;
    } else {
      code = "VANAPRASTHA_PRAGYA";
      badgeEn = `Senior Wisdom, Legacy & Health Mastery Stage (Age ${integerAge} Yrs)`;
      badgeHi = `वरिष्ठ प्रज्ञा, विरासत, दीर्घायु एवं आध्यात्मिक शांति चरण (आयु ${integerAge} वर्ष)`;
    }

    return {
      code,
      exactAgeYears,
      integerAge,
      monthsRemainder,
      birthYear: bYear,
      birthDateMs: birthDate.getTime(),
      badgeEn,
      badgeHi
    };
  }

  // ==========================================================================
  // 2. EPHEMERIS TRANSIT JUPITER & SATURN FOR ANY PAST OR FUTURE DATE
  // ==========================================================================
  function getTransitJupiterAndSaturnRashi(dateObj) {
    if (window.BirthChartCalculator && window.BirthChartCalculator._internal) {
      try {
        const trop = window.BirthChartCalculator._internal.getTropicalLongitudes(dateObj);
        const ayan = window.BirthChartCalculator._internal.lahiriAyanamsa(dateObj);
        return {
          jupiterRashi: Math.floor(norm360(trop.Jupiter - ayan) / 30) + 1,
          saturnRashi:  Math.floor(norm360(trop.Saturn - ayan) / 30) + 1
        };
      } catch (e) {}
    }
    const daysSinceJ2000 = (dateObj.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
    const jupLon = norm360(10.2 + daysSinceJ2000 * 0.083085);
    const satLon = norm360(26.0 + daysSinceJ2000 * 0.033459);
    return {
      jupiterRashi: Math.floor(jupLon / 30) + 1,
      saturnRashi:  Math.floor(satLon / 30) + 1
    };
  }

  // ==========================================================================
  // 3. PARASHARI MARRIAGE AGE BASELINE CALCULATOR (EARLY VS DELAYED MODIFIERS)
  // ==========================================================================
  function computeParashariMarriageAgeBaseline(chart, gender) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1 || 1;
    const sign7 = rashiOfHouse(ascRashi, 7);
    const lord7Key = RASHI_LORDS[sign7];
    const lord7 = chart[lord7Key];
    const karakaKey = gender === "female" ? "Jupiter" : "Venus";
    const karaka = chart[karakaKey];

    // Base biological/social Parashari baseline in modern era
    let minAge = gender === "female" ? 21 : 22;
    let idealCenterAge = gender === "female" ? 24.5 : 26.0;
    const delayReasonsEn = [];
    const delayReasonsHi = [];
    const earlyReasonsEn = [];
    const earlyReasonsHi = [];

    // 1. Check Saturn influence on 7th house, 7th lord, or Marriage Karaka (Classic Parashari Delay)
    const satRashi = chart.Saturn.rashi || chart.Saturn.d1;
    const satAspects7th = doesPlanetAspectRashi("Saturn", satRashi, sign7);
    const satAspects7thLord = doesPlanetAspectRashi("Saturn", satRashi, lord7.rashi || lord7.d1);
    const satIs7thLord = (lord7Key === "Saturn");

    if (satAspects7th || satAspects7thLord || satIs7thLord) {
      idealCenterAge += 3.0;
      minAge += 2;
      delayReasonsEn.push(`Saturn influences the 7th axis (${satIs7thLord ? "rules 7th house" : "aspects 7th house/lord"}), favoring mature marriage around/after age ${Math.round(idealCenterAge)}`);
      delayReasonsHi.push(`शनि का सप्तम अक्ष/सप्तमेश से संबंध (${satIs7thLord ? "सप्तमेश शनि" : "सप्तम पर शनि दृष्टि"}) परिपक्व आयु (~${Math.round(idealCenterAge)}+ वर्ष) में स्थायी विवाह देता है`);
    }

    // 2. Check Rahu/Ketu or Mars (Manglik) influence on 7th house
    const marsRashi = chart.Mars.rashi || chart.Mars.d1;
    const rahuRashi = chart.Rahu.rashi || chart.Rahu.d1;
    if (marsRashi === sign7 || houseFrom(ascRashi, marsRashi) === 8) {
      idealCenterAge += 1.5;
      delayReasonsEn.push("Mars influences the 7th/8th marital axis, advising marriage after Mars maturity begins (~27–28+)");
      delayReasonsHi.push("मंगल का सप्तम/अष्टम भाव से संबंध होने के कारण परिपक्वता के साथ विवाह अधिक सुखद रहता है");
    }
    if (rahuRashi === sign7 || chart.Ketu.rashi === sign7) {
      idealCenterAge += 1.0;
      delayReasonsEn.push("Nodal axis (Rahu-Ketu) in 1st-7th house brings unconventional timing");
      delayReasonsHi.push("लग्न-सप्तम अक्ष में राहु-केतु की उपस्थिति विवाह समय में अनूठा मोड़ लाती है");
    }

    // 3. Check Early/Timely Marriage Accelerators (Venus, Jupiter, Mercury, Moon in/aspecting 7th or 7th Lord in Kendra/Trikona)
    const jupRashi = chart.Jupiter.rashi || chart.Jupiter.d1;
    const venRashi = chart.Venus.rashi || chart.Venus.d1;
    if (doesPlanetAspectRashi("Jupiter", jupRashi, sign7) && !satAspects7th) {
      idealCenterAge -= 1.5;
      earlyReasonsEn.push("Benefic Jupiter directly blesses the 7th house, supporting timely dharmic marriage");
      earlyReasonsHi.push("देवगुरु बृहस्पति की सप्तम भाव पर शुभ दृष्टि समय पर विवाह योग को बल देती है");
    }
    if ([1, 2, 5, 7, 9, 11].includes(lord7.house) && isStrongInSign(lord7Key, lord7.rashi)) {
      idealCenterAge -= 1.0;
      earlyReasonsEn.push(`7th lord ${lord7Key} is strong in House ${lord7.house}`);
      earlyReasonsHi.push(`सप्तमेश ${PLANET_HI[lord7Key]} ${lord7.house}वें भाव में बलवान है`);
    }
    if (karaka.combust || lord7.combust) {
      idealCenterAge += 1.2;
      delayReasonsEn.push(`${lord7.combust ? `7th lord ${lord7Key}` : karakaKey} is combust, requiring Dasha-transit activation to unlock`);
      delayReasonsHi.push(`${lord7.combust ? `सप्तमेश ${PLANET_HI[lord7Key]}` : PLANET_HI[karakaKey]} अस्त होने से दशा-गोचर के पूर्ण सक्रिय होने पर ही विवाह फलित होता है`);
    }

    idealCenterAge = Math.max(minAge + 1, Math.min(33, Number(idealCenterAge.toFixed(1))));

    return {
      minEligibleAge: minAge,
      idealCenterAge,
      idealRangeStr: `${Math.floor(idealCenterAge - 1)}–${Math.ceil(idealCenterAge + 2)}`,
      delayReasonsEn,
      delayReasonsHi,
      earlyReasonsEn,
      earlyReasonsHi
    };
  }

  // ==========================================================================
  // 4. EVALUATE ANY ANTARDASHA WINDOW WITH PRATYANTARDASHA PINPOINTING
  // ==========================================================================
  function evaluateAntardashaWindow(ad, chart, domainCfg, birthDateMs) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const moonRashi = chart.Moon.rashi || chart.Moon.d1;
    const targetSign = rashiOfHouse(ascRashi, domainCfg.primaryHouse);
    const targetLordKey = RASHI_LORDS[targetSign];
    const targetLordRashi = chart[targetLordKey].rashi || chart[targetLordKey].d1;

    const adPlanet = chart[ad.lord];
    const mdPlanet = chart[ad.mdLord];
    const adHouse = adPlanet.house || houseFrom(ascRashi, adPlanet.rashi || adPlanet.d1);
    const mdHouse = mdPlanet.house || houseFrom(ascRashi, mdPlanet.rashi || mdPlanet.d1);

    const startAge = Number(((ad.start.getTime() - birthDateMs) / (365.25 * 86400000)).toFixed(1));
    const endAge   = Number(((ad.end.getTime() - birthDateMs) / (365.25 * 86400000)).toFixed(1));
    const midAge   = Number(((startAge + endAge) / 2).toFixed(1));

    let score = 0;
    const reasonsEn = [];
    const reasonsHi = [];

    // 1. Direct Primary House Lord (Highest Parashari Authority)
    if (ad.lord === targetLordKey) {
      score += 36;
      reasonsEn.push(`Antardasha lord ${ad.lord} is the direct ruler of the ${domainCfg.primaryHouse}th house (${RASHI_NAMES_EN[targetSign]})`);
      reasonsHi.push(`अंतर्दशानाथ ${PLANET_HI[ad.lord]} स्वयं ${domainCfg.primaryHouse}वें भाव (${RASHI_NAMES_HI[targetSign]}) के स्वामी हैं`);
    }
    if (ad.mdLord === targetLordKey) {
      score += 22;
      reasonsEn.push(`Mahadasha lord ${ad.mdLord} rules the ${domainCfg.primaryHouse}th house`);
      reasonsHi.push(`महादशानाथ ${PLANET_HI[ad.mdLord]} ${domainCfg.primaryHouse}वें भाव के स्वामी हैं`);
    }

    // 2. Placement in Domain Houses (D1 or Sripati Chalit)
    const adChalitH = adPlanet.chalitHouse || adHouse;
    if (domainCfg.houses.includes(adHouse) || domainCfg.houses.includes(adChalitH)) {
      score += (adHouse === domainCfg.primaryHouse ? 32 : 24);
      reasonsEn.push(`Antardasha lord ${ad.lord} occupies House ${adHouse}`);
      reasonsHi.push(`अंतर्दशानाथ ${PLANET_HI[ad.lord]} ${adHouse}वें भाव में स्थित हैं`);
    }
    if (domainCfg.houses.includes(mdHouse)) {
      score += 12;
    }

    // 3. Rules Supporting Domain Houses
    const adOwnedHouses = [];
    for (let h = 1; h <= 12; h++) {
      if (RASHI_LORDS[rashiOfHouse(ascRashi, h)] === ad.lord) adOwnedHouses.push(h);
    }
    const matchingOwned = adOwnedHouses.filter(h => domainCfg.houses.includes(h));
    if (matchingOwned.length > 0 && ad.lord !== targetLordKey) {
      score += 20;
      reasonsEn.push(`${ad.lord} rules supporting House ${matchingOwned.join("/")}`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} सहायक भाव (${matchingOwned.join("/")}) के स्वामी हैं`);
    }

    // 4. Direct Parashari Aspect on Primary House or Primary Lord
    if (doesPlanetAspectRashi(ad.lord, adPlanet.rashi || adPlanet.d1, targetSign)) {
      score += 16;
      reasonsEn.push(`${ad.lord} casts a direct Parashari aspect on the ${domainCfg.primaryHouse}th house`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} की सीधी पाराशरी दृष्टि ${domainCfg.primaryHouse}वें भाव पर है`);
    }

    // 5. Natural Karaka for the Domain
    if (domainCfg.karakas.includes(ad.lord)) {
      score += 15;
      reasonsEn.push(`${ad.lord} is the natural Karaka for ${domainCfg.nameEn}`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} ${domainCfg.nameHi} के नैसर्गिक कारक हैं`);
    }

    // 6. Divisional Varga (D9 / D10 / D7 / D4) Strength Confirmation
    const vargaRashi = adPlanet[domainCfg.vargaKey];
    const ascVarga = chart.Asc[domainCfg.vargaKey] || 1;
    if (vargaRashi) {
      const vargaH = houseFrom(ascVarga, vargaRashi);
      if ([1, 4, 5, 7, 9, 10, 11].includes(vargaH) || isStrongInSign(ad.lord, vargaRashi)) {
        score += 14;
        reasonsEn.push(`Fortified in ${domainCfg.vargaKey.toUpperCase()} divisional chart (House ${vargaH})`);
        reasonsHi.push(`वर्ग कुंडली (${domainCfg.vargaKey.toUpperCase()}) के शुभ भाव (${vargaH}वें) में पुष्ट`);
      }
    }

    // 7. Ideal Parashari Age Proximity Bonus (Ensures Marriage/Career peak aligns with classical maturity)
    if (domainCfg.idealCenterAge) {
      const distFromIdeal = Math.abs(midAge - domainCfg.idealCenterAge);
      if (distFromIdeal <= 2.5) score += 16;
      else if (distFromIdeal <= 5.0) score += 8;
      else if (distFromIdeal > 10.0) score -= 10;
    }

    // 8. Double Transit of Jupiter & Saturn Verification across the AD Window
    const midTimeMs = (ad.start.getTime() + ad.end.getTime()) / 2;
    const sampleDates = [
      new Date(ad.start.getTime() + 20 * 86400000),
      new Date(midTimeMs),
      new Date(ad.end.getTime() - 20 * 86400000)
    ];

    let jupTouches = false;
    let satTouches = false;
    let bestTransitYear = ad.start.getFullYear();

    sampleDates.forEach(dt => {
      const { jupiterRashi, saturnRashi } = getTransitJupiterAndSaturnRashi(dt);
      const jHit = doesPlanetAspectRashi("Jupiter", jupiterRashi, targetSign) ||
                   doesPlanetAspectRashi("Jupiter", jupiterRashi, targetLordRashi) ||
                   [1, 5, 7, 9, 11].includes(houseFrom(moonRashi, jupiterRashi));
      const sHit = doesPlanetAspectRashi("Saturn", saturnRashi, targetSign) ||
                   doesPlanetAspectRashi("Saturn", saturnRashi, targetLordRashi);
      if (jHit) {
        jupTouches = true;
        bestTransitYear = dt.getFullYear();
      }
      if (sHit) satTouches = true;
    });

    if (jupTouches && satTouches) {
      score += 26;
      reasonsEn.push(`Double Transit (Gochara) of Jupiter & Saturn simultaneously activates the ${domainCfg.primaryHouse}th axis`);
      reasonsHi.push(`गोचर में गुरु और शनि का 'डबल ट्रांजिट' ${domainCfg.primaryHouse}वें भाव व भावेश को एक साथ जागृत कर रहा है`);
    } else if (jupTouches) {
      score += 15;
      reasonsEn.push(`Transiting Jupiter blesses the ${domainCfg.primaryHouse}th house/Moon axis (${bestTransitYear})`);
      reasonsHi.push(`गोचर के बृहस्पति ${domainCfg.primaryHouse}वें भाव/चंद्र अक्ष पर शुभ दृष्टि डाल रहे हैं (${bestTransitYear})`);
    }

    // 9. Pinpoint Best Pratyantardasha (PD) Inside This Antardasha
    let bestPD = null;
    if (Array.isArray(ad.pratyantardashas) && ad.pratyantardashas.length > 0) {
      const scoredPds = ad.pratyantardashas.map(pd => {
        let pdScore = 0;
        const pdPlanet = chart[pd.lord];
        const pdH = pdPlanet?.house || 1;
        if (pd.lord === targetLordKey) pdScore += 30;
        if (domainCfg.houses.includes(pdH)) pdScore += 20;
        if (domainCfg.karakas.includes(pd.lord)) pdScore += 15;
        return { pd, pdScore };
      }).sort((a, b) => b.pdScore - a.pdScore);
      bestPD = scoredPds[0].pd;
    }

    const fmt = (d) => d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    const confidence = score >= 72 ? "HIGH" : (score >= 52 ? "MODERATE" : "STANDARD");
    const ageSpanStr = Math.floor(startAge) === Math.floor(endAge)
      ? `Age ${Math.floor(startAge)}`
      : `Age ${Math.max(1, Math.floor(startAge))}–${Math.ceil(endAge)}`;
    const ageSpanHi = Math.floor(startAge) === Math.floor(endAge)
      ? `आयु ${Math.floor(startAge)} वर्ष`
      : `आयु ${Math.max(1, Math.floor(startAge))}–${Math.ceil(endAge)} वर्ष`;

    const pdStrEn = bestPD ? `${bestPD.mdLord}–${bestPD.adLord}–${bestPD.lord} PD (${fmt(bestPD.start)} – ${fmt(bestPD.end)})` : null;
    const pdStrHi = bestPD ? `${PLANET_HI[bestPD.mdLord]}–${PLANET_HI[bestPD.adLord]}–${PLANET_HI[bestPD.lord]} प्रत्यंतर (${fmt(bestPD.start)} – ${fmt(bestPD.end)})` : null;

    return {
      mdLord: ad.mdLord,
      adLord: ad.lord,
      pdLord: bestPD ? bestPD.lord : ad.lord,
      start: ad.start,
      end: ad.end,
      startYear: ad.start.getFullYear(),
      endYear: ad.end.getFullYear(),
      startAge,
      endAge,
      midAge,
      ageSpanEn: ageSpanStr,
      ageSpanHi,
      periodStr: `${fmt(ad.start)} – ${fmt(ad.end)}`,
      adLabel: `${ad.mdLord}–${ad.lord} (${fmt(ad.start)} – ${fmt(ad.end)})`,
      adLabelHi: `${PLANET_HI[ad.mdLord]}–${PLANET_HI[ad.lord]} (${fmt(ad.start)} – ${fmt(ad.end)})`,
      pdLabelEn: pdStrEn,
      pdLabelHi: pdStrHi,
      score,
      confidence,
      doubleTransitActive: jupTouches && satTouches,
      reasonsEn,
      reasonsHi
    };
  }

  // ==========================================================================
  // 5. MASTER FULL-LIFESPAN TIMING & AGE-TO-COMPLETE ENGINE
  // ==========================================================================
  function findDomainTimingWindows(chart, dashaTree, findings, birthYear, genderInput) {
    const dobStr = chart?.meta?.dob || `${birthYear || 1998}-01-24`;
    const lifeStage = classifyLifeStage(dobStr);
    const gender = genderInput || "male";

    if (!chart.isFullChartMode || !dashaTree || !Array.isArray(dashaTree.fullSeq)) {
      return {
        isDobOnly: true,
        lifeStage,
        education:  { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        careerIgnition: { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        career:     { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        marriage:   { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        childbirth: { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        property:   { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        wealthPeak: { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" }
      };
    }

    // Flatten ALL Antardashas across the entire 120-year life span (Never clip at +5 years!)
    const allLifeAds = [];
    dashaTree.fullSeq.forEach(md => {
      (md.antardashas || []).forEach(ad => {
        const startAge = (ad.start.getTime() - lifeStage.birthDateMs) / (365.25 * 86400000);
        const endAge   = (ad.end.getTime() - lifeStage.birthDateMs) / (365.25 * 86400000);
        if (endAge >= 1 && startAge <= 88) {
          allLifeAds.push(ad);
        }
      });
    });

    const marriageBaseline = computeParashariMarriageAgeBaseline(chart, gender);
    const curAge = lifeStage.exactAgeYears;

    // Dynamic Domain Configurations (Adapts to whether user is a 10-yr-old child or 35-yr-old adult)
    const configs = {
      education: {
        key: "education",
        nameEn: "Higher Education & Competitive Exam Breakthrough",
        nameHi: "उच्च शिक्षा एवं प्रतियोगी परीक्षा सफलता",
        primaryHouse: 5, houses: [5, 4, 9, 1, 11],
        karakas: ["Mercury", "Jupiter", "Sun"], vargaKey: "d9",
        minAge: curAge < 15 ? 15 : Math.max(15, curAge - 1),
        maxAge: Math.max(27, curAge + 6),
        idealCenterAge: 19.5
      },
      careerIgnition: {
        key: "careerIgnition",
        nameEn: "First Career Ignition & Independent Income",
        nameHi: "प्रथम करियर आरंभ, नौकरी एवं स्वतंत्र आय",
        primaryHouse: 10, houses: [10, 6, 11, 2, 1],
        karakas: ["Saturn", "Sun", "Mercury", "Mars"], vargaKey: "d10",
        minAge: 20.5,
        maxAge: 29.5,
        idealCenterAge: 23.5
      },
      career: {
        key: "career",
        nameEn: "Career Authority, Promotion & Executive Rise",
        nameHi: "करियर शिखर, पदोन्नति एवं राजयोग उत्थान",
        primaryHouse: 10, houses: [10, 11, 9, 1, 2],
        karakas: ["Sun", "Saturn", "Jupiter", "Mercury"], vargaKey: "d10",
        minAge: Math.max(22, curAge - 0.5),
        maxAge: Math.max(42, curAge + 12),
        idealCenterAge: Math.max(28, curAge + 3)
      },
      marriage: {
        key: "marriage",
        nameEn: "Marriage & Sacred Partnership (Vivaha Yoga)",
        nameHi: "विवाह एवं वैवाहिक गठबंधन (विवाह योग)",
        primaryHouse: 7, houses: [7, 2, 11, 1, 5],
        karakas: ["Venus", "Jupiter", "Moon"], vargaKey: "d9",
        minAge: curAge < 27 ? marriageBaseline.minEligibleAge : Math.max(marriageBaseline.minEligibleAge, curAge - 0.5),
        maxAge: Math.max(38, curAge + 10),
        idealCenterAge: curAge < 27 ? marriageBaseline.idealCenterAge : Math.max(marriageBaseline.idealCenterAge, curAge + 2)
      },
      property: {
        key: "property",
        nameEn: "Land, Home Construction & Vehicle Yoga (Bhumi-Vahana)",
        nameHi: "भूमि-भवन निर्माण एवं वाहन सुख योग",
        primaryHouse: 4, houses: [4, 11, 2, 9, 10],
        karakas: ["Mars", "Venus", "Moon", "Saturn"], vargaKey: "d4",
        minAge: Math.max(25, curAge - 0.5),
        maxAge: Math.max(52, curAge + 14),
        idealCenterAge: Math.max(32, curAge + 4)
      },
      wealthPeak: {
        key: "wealthPeak",
        nameEn: "Major Wealth & Treasury Multiplication (Dhana Yoga)",
        nameHi: "वृहद् धन-संपदा एवं कोष वृद्धि (धन योग)",
        primaryHouse: 11, houses: [11, 2, 9, 5, 10],
        karakas: ["Jupiter", "Venus", "Mercury"], vargaKey: "d2",
        minAge: Math.max(24, curAge - 0.5),
        maxAge: Math.max(55, curAge + 15),
        idealCenterAge: Math.max(34, curAge + 5)
      }
    };

    const pickDomainWindows = (cfg) => {
      const evaluated = allLifeAds
        .filter(ad => {
          const sAge = (ad.start.getTime() - lifeStage.birthDateMs) / (365.25 * 86400000);
          const eAge = (ad.end.getTime() - lifeStage.birthDateMs) / (365.25 * 86400000);
          return eAge >= cfg.minAge && sAge <= cfg.maxAge;
        })
        .map(ad => evaluateAntardashaWindow(ad, chart, cfg, lifeStage.birthDateMs))
        .sort((a, b) => b.score - a.score);

      if (evaluated.length === 0) {
        return {
          hasStrongWindow: false,
          confidence: "NONE",
          primaryWindow: null,
          secondaryWindow: null,
          labelEn: "Requires Extended Dasha Scan",
          labelHi: "विस्तृत दशा समीक्षा आवश्यक"
        };
      }

      const primary = evaluated[0];
      const secondary = evaluated.find(c => c.adLabel !== primary.adLabel && Math.abs(c.midAge - primary.midAge) >= 1.2) || evaluated[1] || null;
      const isFutureRelativeToNow = primary.end.getTime() > Date.now();

      return {
        hasStrongWindow: true,
        isFutureRelativeToNow,
        confidence: primary.confidence,
        primaryWindow: primary,
        secondaryWindow: secondary,
        ageSpanEn: primary.ageSpanEn,
        ageSpanHi: primary.ageSpanHi,
        labelEn: `${primary.ageSpanEn} (${primary.periodStr} • ${primary.mdLord}–${primary.adLord} AD)`,
        labelHi: `${primary.ageSpanHi} (${primary.periodStr} • ${PLANET_HI[primary.mdLord]}–${PLANET_HI[primary.adLord]} अंतर्दशा)`
      };
    };

    const eduRes      = pickDomainWindows(configs.education);
    const carInitRes  = pickDomainWindows(configs.careerIgnition);
    const careerRes   = pickDomainWindows(configs.career);
    const marriageRes = pickDomainWindows(configs.marriage);
    const propRes     = pickDomainWindows(configs.property);
    const wealthRes   = pickDomainWindows(configs.wealthPeak);

    // Childbirth window must logically follow Marriage window (or start >= 23)
    const minChildAge = marriageRes.primaryWindow
      ? Math.max(22.5, marriageRes.primaryWindow.startAge + 1.0, curAge < 22 ? 22.5 : curAge - 0.5)
      : Math.max(23, curAge - 0.5);

    const childbirthCfg = {
      key: "childbirth",
      nameEn: "Progeny & Childbirth Blessing (Santan Yoga)",
      nameHi: "संतान प्राप्ति एवं वंश-वृद्धि योग",
      primaryHouse: 5, houses: [5, 9, 11, 2, 1],
      karakas: ["Jupiter", "Moon", "Venus"], vargaKey: "d7",
      minAge: minChildAge,
      maxAge: Math.max(41, minChildAge + 12),
      idealCenterAge: minChildAge + 2.5
    };
    const childbirthRes = pickDomainWindows(childbirthCfg);

    return {
      isDobOnly: false,
      lifeStage,
      marriageBaseline,
      education:      eduRes,
      careerIgnition: carInitRes,
      career:         careerRes,
      marriage:       marriageRes,
      childbirth:     childbirthRes,
      property:       propRes,
      wealthPeak:     wealthRes
    };
  }

  // ==========================================================================
  // 6. RENDER FULL LIFE-MILESTONE & AGE-TO-COMPLETE ROADMAP TABLE
  // ==========================================================================
  function renderLifeMilestoneRoadmap(ctx) {
    const { lang, chart, timeline, findings } = ctx;
    if (!chart.isFullChartMode || !timeline || !timeline.lifeStage) return "";

    const ls = timeline.lifeStage;
    const mb = timeline.marriageBaseline;

    const milestones = [
      {
        icon: "fa-graduation-cap",
        color: "text-blue-300",
        titleEn: "Higher Education & Exam Breakthrough (5th/9th Axis)",
        titleHi: "उच्च शिक्षा एवं प्रतियोगी परीक्षा सफलता (पंचम/नवम अक्ष)",
        data: timeline.education
      },
      {
        icon: "fa-rocket",
        color: "text-cyan-300",
        titleEn: "First Career Ignition & Independent Income (10th/6th Axis)",
        titleHi: "प्रथम करियर आरंभ, नौकरी एवं स्वतंत्र आय (दशम/षष्ठ अक्ष)",
        data: timeline.careerIgnition
      },
      {
        icon: "fa-briefcase",
        color: "text-amber-300",
        titleEn: "Peak Career Authority & Promotion Window (D10 Dasamsa)",
        titleHi: "करियर शिखर, पदोन्नति एवं राजयोग उत्थान (दशमांश D10)",
        data: timeline.career
      },
      {
        icon: "fa-ring",
        color: "text-pink-300",
        titleEn: "Marriage & Sacred Partnership (7th House & D9 Navamsa)",
        titleHi: "विवाह एवं जीवनसाथी मिलन आयु (सप्तम भाव एवं नवांश D9)",
        data: timeline.marriage
      },
      {
        icon: "fa-baby",
        color: "text-emerald-300",
        titleEn: "Progeny & Childbirth Window (5th House & D7 Saptamsa)",
        titleHi: "संतान प्राप्ति एवं वंश-वृद्धि आयु (पंचम भाव एवं सप्तांश D7)",
        data: timeline.childbirth
      },
      {
        icon: "fa-home",
        color: "text-purple-300",
        titleEn: "Property, Land & Vehicle Acquisition (4th House & D4)",
        titleHi: "भूमि-भवन निर्माण एवं वाहन सुख आयु (चतुर्थ भाव एवं D4)",
        data: timeline.property
      },
      {
        icon: "fa-coins",
        color: "text-yellow-300",
        titleEn: "Major Wealth & Treasury Expansion (2nd/11th Dhana Axis)",
        titleHi: "वृहद् धन-संपदा एवं कोष उत्थान आयु (धनेश-लाभेश अक्ष)",
        data: timeline.wealthPeak
      }
    ];

    const rowsHtml = milestones.map(m => {
      const d = m.data;
      if (!d || !d.primaryWindow) return "";
      const pw = d.primaryWindow;
      const sw = d.secondaryWindow;

      const isCompleted = pw.endAge < ls.exactAgeYears;
      const isCurrent   = pw.startAge <= ls.exactAgeYears && pw.endAge >= ls.exactAgeYears;

      const statusBadge = isCurrent
        ? `<span class="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px]">${lang === "hi" ? "सक्रिय (ACTIVE NOW)" : "ACTIVE NOW"}</span>`
        : isCompleted
          ? `<span class="px-2 py-0.5 rounded bg-slate-700 text-gray-200 font-bold text-[10px]">${lang === "hi" ? "संपन्न (PAST MILESTONE)" : "COMPLETED WINDOW"}</span>`
          : `<span class="px-2 py-0.5 rounded bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold text-[10px]">${lang === "hi" ? "आगामी (UPCOMING)" : "UPCOMING"}</span>`;

      const reasonStr = (lang === "hi" ? pw.reasonsHi : pw.reasonsEn).slice(0, 2).join(" • ");
      const pdNote = lang === "hi"
        ? (pw.pdLabelHi ? `<div class="text-[11px] text-emerald-300 font-semibold mt-0.5">↳ सूक्ष्म प्रत्यंतर: ${pw.pdLabelHi}</div>` : "")
        : (pw.pdLabelEn ? `<div class="text-[11px] text-emerald-300 font-semibold mt-0.5">↳ Peak PD: ${pw.pdLabelEn}</div>` : "");

      const secNote = sw
        ? `<div class="text-[11px] text-purple-200 mt-0.5">${lang === "hi" ? `द्वितीय योग: ${sw.ageSpanHi} (${sw.periodStr} • ${PLANET_HI[sw.mdLord]}–${PLANET_HI[sw.adLord]})` : `2nd Window: ${sw.ageSpanEn} (${sw.periodStr} • ${sw.mdLord}–${sw.adLord})`}</div>`
        : "";

      return `
        <tr class="hover:bg-white/5">
          <td class="py-2.5 px-3 font-bold text-white">
            <div class="flex items-center gap-2">
              <i class="fas ${m.icon} ${m.color}"></i>
              <span>${lang === "hi" ? m.titleHi : m.titleEn}</span>
            </div>
            <div class="mt-1">${statusBadge}</div>
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="text-sm font-extrabold text-amber-300 whitespace-nowrap">${lang === "hi" ? pw.ageSpanHi : pw.ageSpanEn}</div>
            <div class="text-[11px] font-mono text-purple-200 whitespace-nowrap">${pw.periodStr}</div>
          </td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-cyan-200 text-xs">${lang === "hi" ? pw.adLabelHi : pw.adLabel}</div>
            ${pdNote}
            ${secNote}
          </td>
          <td class="py-2.5 px-3 text-xs text-gray-200">${reasonStr}</td>
        </tr>
      `;
    }).join("");

    const marriageNoteHtml = mb ? (lang === "hi"
      ? `<div class="p-3 rounded-xl bg-slate-900/90 border border-pink-400/35 text-xs text-gray-200 mt-3">
          💍 <strong class="text-pink-300">पाराशरी विवाह-आयु सूत्र निदान (आदर्श आयु: ${mb.idealRangeStr} वर्ष):</strong>
          ${[...mb.earlyReasonsHi, ...mb.delayReasonsHi].join("; ") || "सप्तमेश एवं नवांश की संतुलित स्थिति समय पर विवाह का संकेत देती है"}।
        </div>`
      : `<div class="p-3 rounded-xl bg-slate-900/90 border border-pink-400/35 text-xs text-gray-200 mt-3">
          💍 <strong class="text-pink-300">Parashari Marriage-Age Formula Verdict (Baseline: Age ${mb.idealRangeStr}):</strong>
          ${[...mb.earlyReasonsEn, ...mb.delayReasonsEn].join("; ") || "Balanced 7th house and Navamsa disposition indicates timely marriage"}.
        </div>`) : "";

    return `
      <div class="pdf-keep-together rounded-3xl bg-slate-950/95 border-2 border-amber-400/50 p-4 md:p-6 mt-5 shadow-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/10">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block">
              <i class="fas fa-hourglass-half mr-1"></i>${lang === "hi" ? "पाराशरी जीवन-चक्र एवं आयु-निर्धारण सारणी" : "Dynamic Parashari Life-Milestone & Age-to-Complete Matrix"}
            </span>
            <h3 class="text-lg md:text-xl font-bold text-white mt-0.5">
              ${lang === "hi" ? "शिक्षा, नौकरी, विवाह, संतान एवं संपत्ति की सटीक आयु व दशा-गोचर कालखंड" : "Exact Age & Dasha-Transit Windows for Education, Career, Marriage, Progeny & Wealth"}
            </h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-purple-600/30 border border-purple-400/50 text-amber-200 text-xs font-extrabold self-start sm:self-auto">
            ${lang === "hi" ? ls.badgeHi : ls.badgeEn}
          </span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-900 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-2.5 px-3 text-left">${lang === "hi" ? "जीवन का प्रमुख पड़ाव (Life Milestone)" : "Life Milestone & House Axis"}</th>
                <th class="py-2.5 px-3 text-center">${lang === "hi" ? "फलीभूत होने की आयु एवं वर्ष" : "Completion Age & Years"}</th>
                <th class="py-2.5 px-3 text-left">${lang === "hi" ? "सक्रिय महादशा–अंतर्दशा–प्रत्यंतर" : "Activating MD–AD–PD Window"}</th>
                <th class="py-2.5 px-3 text-left">${lang === "hi" ? "पाराशरी सूत्र एवं डबल-ट्रांजिट प्रमाण" : "Parashari & Double-Transit Basis"}</th>
              </tr>
            </thead>
            <tbody class="bg-slate-950/70 divide-y divide-white/10">${rowsHtml}</tbody>
          </table>
        </div>
        ${marriageNoteHtml}
      </div>
    `;
  }

  window.TimingEngine = {
    classifyLifeStage,
    computeParashariMarriageAgeBaseline,
    findDomainTimingWindows,
    evaluateAntardashaWindow,
    getTransitJupiterAndSaturnRashi,
    renderLifeMilestoneRoadmap
  };
})();
