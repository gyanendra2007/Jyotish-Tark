/**
 * ============================================================================
 * JYOTISH TARK — PARASHARI DASHA, DOUBLE-TRANSIT & AGE ENGINE
 * File: timing-engine.js • v3.0 (Accuracy Fix Edition)
 * ============================================================================
 * FIXES IN v3.0 (vs v2.0):
 * 1. Exact ages from DOB in ms (no year-only maths); age spans use floor–floor
 *    ("20–21", not "20–22").
 * 2. Double transit is now STRICT: Jupiter AND Saturn must both aspect (or
 *    occupy) the domain house or its lord, measured from the Lagna, in the
 *    SAME month. The exact month is reported. Previously almost every window
 *    was flagged "double transit".
 * 3. Domain exclusivity: an antardasha that already won one domain is
 *    penalised for the others, so education, career, marriage and childbirth
 *    no longer all print the same window.
 * 4. Childbirth search starts after the marriage window and never reuses the
 *    marriage antardasha.
 * 5. House-lord weight raised, karaka weight lowered (karakas no longer
 *    dominate every domain).
 * 6. Pratyantardashas shorter than 60 days are never shown as "peak PD".
 * 7. Education & first-career windows are fixed life-stage windows
 *    (15–26, 20.5–29.5). Past windows are returned with isPast=true and are
 *    rendered as a VERIFICATION QUESTION, not as a stated fact.
 * 8. Transit look-ups cached by month (fast enough for the browser).
 * Public API unchanged: window.TimingEngine.{classifyLifeStage,
 *   computeParashariMarriageAgeBaseline, findDomainTimingWindows,
 *   evaluateAntardashaWindow, getTransitJupiterAndSaturnRashi,
 *   renderLifeMilestoneRoadmap}
 * ============================================================================
 */

(function () {
  "use strict";

  const DAY_MS = 86400000;
  const YEAR_MS = 365.25 * DAY_MS;

  const RASHI_LORDS = [null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const RASHI_NAMES_EN = [null, "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const RASHI_NAMES_HI = [null, "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const PLANET_HI = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const HOUSE_ORD_HI = ["", "प्रथम", "द्वितीय", "तृतीय", "चतुर्थ", "पंचम", "षष्ठ", "सप्तम", "अष्टम", "नवम", "दशम", "एकादश", "द्वादश"];
  const MON_HI = ["जन॰", "फ़र॰", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अग॰", "सित॰", "अक्टू॰", "नव॰", "दिस॰"];
  const MON_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const EXALTED_SIGN = { Sun: 1, Moon: 2, Mars: 10, Mercury: 6, Jupiter: 4, Venus: 12, Saturn: 7, Rahu: 2, Ketu: 8 };
  const OWN_SIGNS = { Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6], Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11], Rahu: [11], Ketu: [8] };
  const PARASHARI_ASPECTS = { Sun: [7], Moon: [7], Mercury: [7], Venus: [7], Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10], Rahu: [5, 7, 9], Ketu: [5, 7, 9] };

  const norm360 = (d) => (((Number(d) || 0) % 360) + 360) % 360;
  const houseFrom = (ref, t) => ((t - ref + 12) % 12) + 1;
  const rashiOfHouse = (asc, h) => ((asc + h - 2) % 12) + 1;
  const sgn = (p) => (p && (p.rashi || p.d1)) || 1;
  const ordEn = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  function doesPlanetAspectRashi(planetKey, fromRashi, targetRashi) {
    if (fromRashi === targetRashi) return true;
    return (PARASHARI_ASPECTS[planetKey] || [7]).includes(houseFrom(fromRashi, targetRashi));
  }
  function isStrongInSign(planet, rashi) {
    return EXALTED_SIGN[planet] === rashi || (OWN_SIGNS[planet] || []).includes(rashi);
  }
  const fmtMY = (d) => d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  const fmtMYHi = (d) => `${MON_HI[d.getMonth()]} ${d.getFullYear()}`;
  const fmtMonth = (d, lang) => (lang === "hi" ? fmtMYHi(d) : `${MON_EN[d.getMonth()]} ${d.getFullYear()}`);

  function ageSpan(startAge, endAge) {
    const a = Math.max(0, Math.floor(startAge)), b = Math.max(0, Math.floor(endAge));
    return a === b ? { en: `Age ${a}`, hi: `आयु ${a} वर्ष` } : { en: `Age ${a}–${b}`, hi: `आयु ${a}–${b} वर्ष` };
  }

  // ==========================================================================
  // 1. LIFE-STAGE CLASSIFIER
  // ==========================================================================
  function classifyLifeStage(birthDateStr, birthMsOverride) {
    const parts = (birthDateStr || "1998-01-24").split("-").map(Number);
    const bYear = parts[0] || 1998, bMonth = parts[1] || 1, bDay = parts[2] || 24;
    const birthMs = (typeof birthMsOverride === "number" && !isNaN(birthMsOverride)) ? birthMsOverride : Date.UTC(bYear, bMonth - 1, bDay);
    const exactAgeYears = Number((Math.max(0, Date.now() - birthMs) / YEAR_MS).toFixed(2));
    const integerAge = Math.floor(exactAgeYears);
    const monthsRemainder = Math.max(0, Math.floor((exactAgeYears - integerAge) * 12));

    let code, badgeEn, badgeHi;
    if (exactAgeYears < 13) {
      code = "BALA";
      badgeEn = `Childhood Foundation Stage (Age ${integerAge} Yrs ${monthsRemainder} Mos)`;
      badgeHi = `बाल्यावस्था एवं संस्कार-नींव चरण (आयु ${integerAge} वर्ष ${monthsRemainder} माह)`;
    } else if (exactAgeYears < 21) {
      code = "VIDYARTHI";
      badgeEn = `Student & Specialisation Stage (Age ${integerAge})`;
      badgeHi = `विद्यार्थी एवं कौशल-निर्माण चरण (आयु ${integerAge} वर्ष)`;
    } else if (exactAgeYears < 36) {
      code = "YUVA_KARMA";
      badgeEn = `Career, Marriage & Establishment Stage (Age ${integerAge})`;
      badgeHi = `करियर, विवाह एवं स्थायित्व चरण (आयु ${integerAge} वर्ष)`;
    } else if (exactAgeYears < 56) {
      code = "GRIHASTHA_PRABALYA";
      badgeEn = `Leadership, Wealth & Family Maturity Stage (Age ${integerAge})`;
      badgeHi = `नेतृत्व, संपत्ति एवं पारिवारिक परिपक्वता चरण (आयु ${integerAge} वर्ष)`;
    } else {
      code = "VANAPRASTHA_PRAGYA";
      badgeEn = `Wisdom, Legacy & Health Stage (Age ${integerAge})`;
      badgeHi = `प्रज्ञा, विरासत एवं स्वास्थ्य चरण (आयु ${integerAge} वर्ष)`;
    }
    return { code, exactAgeYears, integerAge, monthsRemainder, birthYear: bYear, birthDateMs: birthMs, badgeEn, badgeHi };
  }

  // ==========================================================================
  // 2. TRANSIT JUPITER & SATURN (SIDEREAL), CACHED BY MONTH
  // ==========================================================================
  const transitCache = new Map();
  function getTransitJupiterAndSaturnRashi(dateObj) {
    const key = `${dateObj.getUTCFullYear()}-${dateObj.getUTCMonth()}`;
    if (transitCache.has(key)) return transitCache.get(key);
    let out = null;
    if (window.BirthChartCalculator && window.BirthChartCalculator._internal) {
      try {
        const trop = window.BirthChartCalculator._internal.getTropicalLongitudes(dateObj);
        const ayan = window.BirthChartCalculator._internal.lahiriAyanamsa(dateObj);
        out = {
          jupiterRashi: Math.floor(norm360(trop.Jupiter - ayan) / 30) + 1,
          saturnRashi: Math.floor(norm360(trop.Saturn - ayan) / 30) + 1
        };
      } catch (e) { out = null; }
    }
    if (!out) {
      const d = (dateObj.getTime() - Date.UTC(2000, 0, 1, 12)) / DAY_MS;
      out = {
        jupiterRashi: Math.floor(norm360(10.5 + d * 0.083091) / 30) + 1,
        saturnRashi: Math.floor(norm360(16.5 + d * 0.033459) / 30) + 1,
        approximate: true
      };
    }
    transitCache.set(key, out);
    return out;
  }

  // ==========================================================================
  // 3. PARASHARI MARRIAGE-AGE BASELINE
  // ==========================================================================
  function computeParashariMarriageAgeBaseline(chart, gender) {
    const ascRashi = sgn(chart.Asc);
    const sign7 = rashiOfHouse(ascRashi, 7);
    const lord7Key = RASHI_LORDS[sign7];
    const lord7 = chart[lord7Key];
    const karakaKey = gender === "female" ? "Jupiter" : "Venus";
    const karaka = chart[karakaKey];

    let minAge = gender === "female" ? 21 : 22;
    let idealCenterAge = gender === "female" ? 24.5 : 26.0;
    const delayReasonsEn = [], delayReasonsHi = [], earlyReasonsEn = [], earlyReasonsHi = [];

    const satRashi = sgn(chart.Saturn);
    const satAspects7th = doesPlanetAspectRashi("Saturn", satRashi, sign7);
    const satAspects7thLord = doesPlanetAspectRashi("Saturn", satRashi, sgn(lord7));
    const satIs7thLord = lord7Key === "Saturn";
    if (satAspects7th || satAspects7thLord || satIs7thLord) {
      idealCenterAge += 3.0; minAge += 2;
      delayReasonsEn.push(`Saturn is linked to the 7th axis (${satIs7thLord ? "it rules the 7th" : "it aspects the 7th or its lord"}), favouring a mature-age marriage`);
      delayReasonsHi.push(`शनि का सप्तम अक्ष से संबंध (${satIs7thLord ? "सप्तमेश शनि" : "सप्तम/सप्तमेश पर शनि दृष्टि"}) — परिपक्व आयु में स्थायी विवाह`);
    }
    const marsH = houseFrom(ascRashi, sgn(chart.Mars));
    if (marsH === 7 || marsH === 8) {
      idealCenterAge += 1.5;
      delayReasonsEn.push(`Mars in the ${ordEn(marsH)} house advises marriage after Mars matures (~28)`);
      delayReasonsHi.push(`मंगल ${HOUSE_ORD_HI[marsH]} भाव में — 28 वर्ष के आसपास के बाद विवाह अधिक सुखद`);
    }
    if (sgn(chart.Rahu) === sign7 || sgn(chart.Ketu) === sign7) {
      idealCenterAge += 1.0;
      delayReasonsEn.push("Rahu/Ketu on the 7th brings unconventional timing");
      delayReasonsHi.push("सप्तम में राहु/केतु — विवाह-समय में अनपेक्षित मोड़");
    }
    if (doesPlanetAspectRashi("Jupiter", sgn(chart.Jupiter), sign7) && !satAspects7th) {
      idealCenterAge -= 1.5;
      earlyReasonsEn.push("Jupiter blesses the 7th house, supporting timely marriage");
      earlyReasonsHi.push("सप्तम पर गुरु की शुभ दृष्टि — समय पर विवाह को बल");
    }
    if ([1, 2, 5, 7, 9, 11].includes(houseFrom(ascRashi, sgn(lord7))) && isStrongInSign(lord7Key, sgn(lord7))) {
      idealCenterAge -= 1.0;
      earlyReasonsEn.push(`7th lord ${lord7Key} is strong and well placed`);
      earlyReasonsHi.push(`सप्तमेश ${PLANET_HI[lord7Key]} बलवान एवं शुभ स्थान में`);
    }
    if ((karaka && karaka.combust) || (lord7 && lord7.combust)) {
      idealCenterAge += 1.2;
      delayReasonsEn.push(`${lord7 && lord7.combust ? `7th lord ${lord7Key}` : karakaKey} is combust`);
      delayReasonsHi.push(`${lord7 && lord7.combust ? `सप्तमेश ${PLANET_HI[lord7Key]}` : PLANET_HI[karakaKey]} अस्त`);
    }
    idealCenterAge = Math.max(minAge + 1, Math.min(33, Number(idealCenterAge.toFixed(1))));
    return {
      minEligibleAge: minAge,
      idealCenterAge,
      idealRangeStr: `${Math.floor(idealCenterAge - 1)}–${Math.ceil(idealCenterAge + 1)}`,
      delayReasonsEn, delayReasonsHi, earlyReasonsEn, earlyReasonsHi
    };
  }

  // ==========================================================================
  // 4. EVALUATE ONE ANTARDASHA FOR ONE DOMAIN
  // ==========================================================================
  function evaluateAntardashaWindow(ad, chart, cfg, birthDateMs) {
    const ascRashi = sgn(chart.Asc);
    const targetSign = rashiOfHouse(ascRashi, cfg.primaryHouse);
    const targetLordKey = RASHI_LORDS[targetSign];
    const targetLordRashi = sgn(chart[targetLordKey]);
    const adPlanet = chart[ad.lord];
    const adHouse = houseFrom(ascRashi, sgn(adPlanet));
    const mdHouse = houseFrom(ascRashi, sgn(chart[ad.mdLord]));

    const startMs = ad.start.getTime(), endMs = ad.end.getTime();
    const startAge = (startMs - birthDateMs) / YEAR_MS;
    const endAge = (endMs - birthDateMs) / YEAR_MS;
    const midAge = (startAge + endAge) / 2;

    let score = 0;
    const reasonsEn = [], reasonsHi = [];
    const H = cfg.primaryHouse;

    // 1. Lord of the primary house (strongest Parashari factor)
    if (ad.lord === targetLordKey) {
      score += 40;
      reasonsEn.push(`Sub-period lord ${ad.lord} rules the ${ordEn(H)} house`);
      reasonsHi.push(`अंतर्दशानाथ ${PLANET_HI[ad.lord]} स्वयं ${HOUSE_ORD_HI[H]} भाव के स्वामी`);
    }
    if (ad.mdLord === targetLordKey) {
      score += 22;
      reasonsEn.push(`Main-period lord ${ad.mdLord} rules the ${ordEn(H)} house`);
      reasonsHi.push(`महादशानाथ ${PLANET_HI[ad.mdLord]} ${HOUSE_ORD_HI[H]} भाव के स्वामी`);
    }
    // 2. Placement
    const chalitH = adPlanet.chalitHouse || adHouse;
    if (cfg.houses.includes(adHouse) || cfg.houses.includes(chalitH)) {
      score += adHouse === H ? 30 : 18;
      reasonsEn.push(`${ad.lord} occupies the ${ordEn(adHouse)} house`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} ${HOUSE_ORD_HI[adHouse]} भाव में स्थित`);
    }
    if (cfg.houses.includes(mdHouse)) score += 8;
    if ([6, 8, 12].includes(adHouse) && !cfg.houses.includes(adHouse)) score -= 12;
    // 3. Supporting lordship
    const owned = [];
    for (let h = 1; h <= 12; h++) if (RASHI_LORDS[rashiOfHouse(ascRashi, h)] === ad.lord) owned.push(h);
    const supp = owned.filter((h) => cfg.houses.includes(h) && h !== H);
    if (supp.length && ad.lord !== targetLordKey) {
      score += 16;
      reasonsEn.push(`${ad.lord} rules supporting house ${supp.join("/")}`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} सहायक भाव (${supp.map((h) => HOUSE_ORD_HI[h]).join("/")}) के स्वामी`);
    }
    // 4. Aspect on primary house
    if (adHouse !== H && doesPlanetAspectRashi(ad.lord, sgn(adPlanet), targetSign)) {
      score += 12;
      reasonsEn.push(`${ad.lord} aspects the ${ordEn(H)} house`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} की ${HOUSE_ORD_HI[H]} भाव पर दृष्टि`);
    }
    // 5. Karaka (lighter weight than before)
    if (cfg.karakas.includes(ad.lord)) {
      score += 10;
      reasonsEn.push(`${ad.lord} is a natural significator of ${cfg.nameEn.toLowerCase()}`);
      reasonsHi.push(`${PLANET_HI[ad.lord]} ${cfg.nameHi} के नैसर्गिक कारक`);
    }
    // 6. Varga confirmation
    const vargaRashi = adPlanet[cfg.vargaKey];
    const ascVarga = chart.Asc[cfg.vargaKey];
    if (vargaRashi && ascVarga) {
      const vh = houseFrom(ascVarga, vargaRashi);
      if ([1, 4, 5, 7, 9, 10, 11].includes(vh) || isStrongInSign(ad.lord, vargaRashi)) {
        score += 12;
        reasonsEn.push(`supported in ${cfg.vargaKey.toUpperCase()} (${ordEn(vh)} house)`);
        reasonsHi.push(`${cfg.vargaKey.toUpperCase()} के ${HOUSE_ORD_HI[vh]} भाव में पुष्ट`);
      }
    }
    // 7. Age proximity
    if (cfg.idealCenterAge) {
      const dist = Math.abs(midAge - cfg.idealCenterAge);
      if (dist <= 2.5) score += 14; else if (dist <= 5) score += 6; else if (dist > 10) score -= 12;
    }
    // 8. STRICT double transit, month by month, from the Lagna
    let doubleMonth = null, jupMonth = null;
    for (let t = startMs + 15 * DAY_MS; t < endMs; t += 30 * DAY_MS) {
      const dt = new Date(t);
      const { jupiterRashi, saturnRashi } = getTransitJupiterAndSaturnRashi(dt);
      const j = doesPlanetAspectRashi("Jupiter", jupiterRashi, targetSign) || doesPlanetAspectRashi("Jupiter", jupiterRashi, targetLordRashi);
      const s = doesPlanetAspectRashi("Saturn", saturnRashi, targetSign) || doesPlanetAspectRashi("Saturn", saturnRashi, targetLordRashi);
      if (j && !jupMonth) jupMonth = dt;
      if (j && s) { doubleMonth = dt; break; }
    }
    if (doubleMonth) {
      score += 22;
      reasonsEn.push(`Jupiter–Saturn double transit on the ${ordEn(H)} house/lord from ${fmtMY(doubleMonth)}`);
      reasonsHi.push(`${fmtMYHi(doubleMonth)} से गुरु-शनि का दोहरा गोचर ${HOUSE_ORD_HI[H]} भाव/भावेश पर`);
    } else if (jupMonth) {
      score += 8;
      reasonsEn.push(`transit Jupiter supports the ${ordEn(H)} house from ${fmtMY(jupMonth)}`);
      reasonsHi.push(`${fmtMYHi(jupMonth)} से गोचर गुरु का ${HOUSE_ORD_HI[H]} भाव को समर्थन`);
    }

    // 9. Peak pratyantardasha (only PDs ≥ 60 days)
    let bestPD = null;
    if (Array.isArray(ad.pratyantardashas) && ad.pratyantardashas.length) {
      const scored = ad.pratyantardashas
        .filter((pd) => pd.end.getTime() - pd.start.getTime() >= 60 * DAY_MS)
        .map((pd) => {
          const pdH = houseFrom(ascRashi, sgn(chart[pd.lord]));
          let s = 0;
          if (pd.lord === targetLordKey) s += 30;
          if (cfg.houses.includes(pdH)) s += 18;
          if (cfg.karakas.includes(pd.lord)) s += 10;
          if (doubleMonth && pd.start.getTime() <= doubleMonth.getTime() && pd.end.getTime() >= doubleMonth.getTime()) s += 12;
          return { pd, s };
        }).sort((a, b) => b.s - a.s);
      if (scored.length && scored[0].s > 0) bestPD = scored[0].pd;
    }

    const span = ageSpan(startAge, endAge);
    const isPast = endMs < Date.now();
    return {
      key: `${ad.mdLord}-${ad.lord}-${startMs}`,
      mdLord: ad.mdLord, adLord: ad.lord, pdLord: bestPD ? bestPD.lord : null,
      start: ad.start, end: ad.end,
      startYear: ad.start.getFullYear(), endYear: ad.end.getFullYear(),
      startAge: Number(startAge.toFixed(1)), endAge: Number(endAge.toFixed(1)), midAge: Number(midAge.toFixed(1)),
      ageSpanEn: span.en, ageSpanHi: span.hi,
      periodStr: `${fmtMY(ad.start)} – ${fmtMY(ad.end)}`,
      periodStrHi: `${fmtMYHi(ad.start)} – ${fmtMYHi(ad.end)}`,
      adLabel: `${ad.mdLord}–${ad.lord} (${fmtMY(ad.start)} – ${fmtMY(ad.end)})`,
      adLabelHi: `${PLANET_HI[ad.mdLord]}–${PLANET_HI[ad.lord]} (${fmtMYHi(ad.start)} – ${fmtMYHi(ad.end)})`,
      pdLabelEn: bestPD ? `${bestPD.mdLord}–${bestPD.adLord}–${bestPD.lord} (${fmtMY(bestPD.start)} – ${fmtMY(bestPD.end)})` : null,
      pdLabelHi: bestPD ? `${PLANET_HI[bestPD.mdLord]}–${PLANET_HI[bestPD.adLord]}–${PLANET_HI[bestPD.lord]} (${fmtMYHi(bestPD.start)} – ${fmtMYHi(bestPD.end)})` : null,
      score,
      confidence: score >= 80 ? "HIGH" : (score >= 55 ? "MODERATE" : "STANDARD"),
      doubleTransitActive: Boolean(doubleMonth),
      doubleTransitMonth: doubleMonth,
      isPast,
      reasonsEn, reasonsHi
    };
  }

  // ==========================================================================
  // 5. MASTER LIFESPAN TIMING ENGINE
  // ==========================================================================
  function findDomainTimingWindows(chart, dashaTree, findings, birthYear, genderInput) {
    const dobStr = (chart && chart.meta && chart.meta.dob) || `${birthYear || 1998}-01-01`;
    const birthMs = chart && chart.meta && chart.meta.birthUTC ? new Date(chart.meta.birthUTC).getTime() : undefined;
    const lifeStage = classifyLifeStage(dobStr, birthMs);
    const gender = genderInput || "male";

    if (!chart.isFullChartMode || !dashaTree || !Array.isArray(dashaTree.fullSeq)) {
      const none = { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" };
      return { isDobOnly: true, lifeStage, education: none, careerIgnition: none, career: none, marriage: none, childbirth: none, property: none, wealthPeak: none };
    }

    const allAds = [];
    dashaTree.fullSeq.forEach((md) => (md.antardashas || []).forEach((ad) => {
      const s = (ad.start.getTime() - lifeStage.birthDateMs) / YEAR_MS;
      const e = (ad.end.getTime() - lifeStage.birthDateMs) / YEAR_MS;
      if (e >= 1 && s <= 88) allAds.push(ad);
    }));

    const mb = computeParashariMarriageAgeBaseline(chart, gender);
    const cur = lifeStage.exactAgeYears;
    const usedPrimary = new Map();

    const configs = {
      education: {
        nameEn: "Higher Education & Exams", nameHi: "उच्च शिक्षा एवं प्रतियोगी परीक्षा",
        primaryHouse: 5, houses: [5, 4, 9, 2], karakas: ["Mercury", "Jupiter"], vargaKey: "d9",
        minAge: 15, maxAge: 26, idealCenterAge: 19.5
      },
      careerIgnition: {
        nameEn: "First Job & Independent Income", nameHi: "प्रथम नौकरी एवं स्वतंत्र आय",
        primaryHouse: 10, houses: [10, 6, 11, 2], karakas: ["Saturn", "Sun", "Mercury"], vargaKey: "d10",
        minAge: 20.5, maxAge: 29.5, idealCenterAge: 23.5
      },
      career: {
        nameEn: "Career Peak & Promotion", nameHi: "करियर शिखर एवं पदोन्नति",
        primaryHouse: 10, houses: [10, 11, 9, 1], karakas: ["Sun", "Saturn", "Jupiter"], vargaKey: "d10",
        minAge: Math.max(24, cur - 0.5), maxAge: Math.max(45, cur + 12), idealCenterAge: Math.max(30, cur + 3)
      },
      marriage: {
        nameEn: "Marriage", nameHi: "विवाह",
        primaryHouse: 7, houses: [7, 2, 11], karakas: [gender === "female" ? "Jupiter" : "Venus", "Venus"], vargaKey: "d9",
        minAge: cur < mb.minEligibleAge ? mb.minEligibleAge : Math.max(mb.minEligibleAge, cur - 0.5),
        maxAge: Math.max(38, cur + 10),
        idealCenterAge: cur < mb.idealCenterAge ? mb.idealCenterAge : cur + 2
      },
      property: {
        nameEn: "Property & Vehicles", nameHi: "भूमि-भवन एवं वाहन",
        primaryHouse: 4, houses: [4, 11, 2], karakas: ["Mars", "Venus"], vargaKey: "d4",
        minAge: Math.max(25, cur - 0.5), maxAge: Math.max(52, cur + 14), idealCenterAge: Math.max(33, cur + 4)
      },
      wealthPeak: {
        nameEn: "Major Wealth Growth", nameHi: "वृहद् धन-वृद्धि",
        primaryHouse: 11, houses: [11, 2, 9, 5], karakas: ["Jupiter", "Mercury"], vargaKey: "d2",
        minAge: Math.max(24, cur - 0.5), maxAge: Math.max(55, cur + 15), idealCenterAge: Math.max(35, cur + 5)
      }
    };

    const pick = (cfg, excludeKeys) => {
      const evaluated = allAds
        .filter((ad) => {
          const s = (ad.start.getTime() - lifeStage.birthDateMs) / YEAR_MS;
          const e = (ad.end.getTime() - lifeStage.birthDateMs) / YEAR_MS;
          return e >= cfg.minAge && s <= cfg.maxAge;
        })
        .map((ad) => evaluateAntardashaWindow(ad, chart, cfg, lifeStage.birthDateMs))
        .filter((w) => !(excludeKeys || []).includes(w.key))
        .map((w) => { const used = usedPrimary.get(w.key) || 0; return { ...w, score: w.score - used * 18 }; })
        .sort((a, b) => b.score - a.score);

      if (!evaluated.length) {
        return { hasStrongWindow: false, confidence: "NONE", primaryWindow: null, secondaryWindow: null, labelEn: "Requires extended dasha review", labelHi: "विस्तृत दशा समीक्षा आवश्यक" };
      }
      const primary = evaluated[0];
      usedPrimary.set(primary.key, (usedPrimary.get(primary.key) || 0) + 1);
      const secondary = evaluated.find((c) => c.key !== primary.key && Math.abs(c.midAge - primary.midAge) >= 1.2) || null;
      return {
        hasStrongWindow: true,
        isFutureRelativeToNow: !primary.isPast,
        isPast: primary.isPast,
        confidence: primary.confidence,
        primaryWindow: primary,
        secondaryWindow: secondary,
        ageSpanEn: primary.ageSpanEn,
        ageSpanHi: primary.ageSpanHi,
        labelEn: `${primary.ageSpanEn} (${primary.periodStr} • ${primary.mdLord}–${primary.adLord})`,
        labelHi: `${primary.ageSpanHi} (${primary.periodStrHi} • ${PLANET_HI[primary.mdLord]}–${PLANET_HI[primary.adLord]})`
      };
    };

    const marriageRes = pick(configs.marriage);
    const eduRes = pick(configs.education);
    const carInitRes = pick(configs.careerIgnition);
    const careerRes = pick(configs.career);

    const mw = marriageRes.primaryWindow;
    const childMin = mw ? Math.max(mw.startAge + 1.0, cur - 0.5, 22.5) : Math.max(23, cur - 0.5);
    const childbirthRes = pick({
      nameEn: "Children", nameHi: "संतान",
      primaryHouse: 5, houses: [5, 9, 11], karakas: ["Jupiter"], vargaKey: "d7",
      minAge: childMin, maxAge: Math.max(42, childMin + 12), idealCenterAge: childMin + 2.5
    }, mw ? [mw.key] : []);
    const propRes = pick(configs.property);
    const wealthRes = pick(configs.wealthPeak);

    return {
      isDobOnly: false, lifeStage, marriageBaseline: mb,
      education: eduRes, careerIgnition: carInitRes, career: careerRes,
      marriage: marriageRes, childbirth: childbirthRes, property: propRes, wealthPeak: wealthRes
    };
  }

  // ==========================================================================
  // 6. ROADMAP TABLE (SCREEN DOSSIER) — PAST ROWS BECOME VERIFICATION QUESTIONS
  // ==========================================================================
  function renderLifeMilestoneRoadmap(ctx) {
    const { lang, chart, timeline } = ctx;
    if (!chart.isFullChartMode || !timeline || !timeline.lifeStage) return "";
    const L = (hi, en) => (lang === "hi" ? hi : en);
    const ls = timeline.lifeStage, mb = timeline.marriageBaseline;
    const now = Date.now();

    const rows = [
      ["fa-graduation-cap", "text-blue-300", L("उच्च शिक्षा एवं प्रतियोगी परीक्षा", "Higher Education & Exams"), timeline.education],
      ["fa-rocket", "text-cyan-300", L("प्रथम नौकरी एवं स्वतंत्र आय", "First Job & Independent Income"), timeline.careerIgnition],
      ["fa-briefcase", "text-amber-300", L("करियर शिखर एवं पदोन्नति", "Career Peak & Promotion"), timeline.career],
      ["fa-ring", "text-pink-300", L("विवाह", "Marriage"), timeline.marriage],
      ["fa-baby", "text-emerald-300", L("संतान", "Children"), timeline.childbirth],
      ["fa-home", "text-purple-300", L("भूमि-भवन एवं वाहन", "Property & Vehicles"), timeline.property],
      ["fa-coins", "text-yellow-300", L("वृहद् धन-वृद्धि", "Major Wealth Growth"), timeline.wealthPeak]
    ].map(([icon, color, title, d]) => {
      if (!d || !d.primaryWindow) return "";
      const pw = d.primaryWindow, sw = d.secondaryWindow;
      const active = pw.start.getTime() <= now && pw.end.getTime() >= now;
      const badge = active
        ? `<span class="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px]">${L("अभी सक्रिय", "ACTIVE NOW")}</span>`
        : pw.isPast
          ? `<span class="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-100 border border-indigo-300/40 font-bold text-[10px]">${L("सत्यापन हेतु", "VERIFY")}</span>`
          : `<span class="px-2 py-0.5 rounded bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold text-[10px]">${L("आगामी", "UPCOMING")}</span>`;
      const reason = pw.isPast
        ? L(`क्या ${pw.periodStrHi} के बीच इस क्षेत्र में कोई बड़ा निर्णय/घटना हुई? हाँ = जन्म-समय सटीक।`, `Did a major event in this area happen during ${pw.periodStr}? Yes = birth time confirmed.`)
        : (L(pw.reasonsHi, pw.reasonsEn) || []).slice(0, 2).join(" • ");
      const pd = pw.pdLabelEn ? `<div class="text-[11px] text-emerald-300 font-semibold mt-0.5">↳ ${L(`प्रबल प्रत्यंतर: ${pw.pdLabelHi}`, `Peak PD: ${pw.pdLabelEn}`)}</div>` : "";
      const sec = sw ? `<div class="text-[11px] text-purple-200 mt-0.5">${L(`द्वितीय: ${sw.ageSpanHi} (${sw.periodStrHi})`, `2nd: ${sw.ageSpanEn} (${sw.periodStr})`)}</div>` : "";
      return `
        <tr class="hover:bg-white/5">
          <td class="py-2.5 px-3 font-bold text-white"><div class="flex items-center gap-2"><i class="fas ${icon} ${color}"></i><span>${title}</span></div><div class="mt-1">${badge}</div></td>
          <td class="py-2.5 px-3 text-center"><div class="text-sm font-extrabold text-amber-300 whitespace-nowrap">${L(pw.ageSpanHi, pw.ageSpanEn)}</div><div class="text-[11px] font-mono text-purple-200 whitespace-nowrap">${L(pw.periodStrHi, pw.periodStr)}</div></td>
          <td class="py-2.5 px-3"><div class="font-bold text-cyan-200 text-xs">${L(pw.adLabelHi, pw.adLabel)}</div>${pd}${sec}</td>
          <td class="py-2.5 px-3 text-xs text-gray-200">${reason}</td>
        </tr>`;
    }).join("");

    const mbNote = mb ? `
      <div class="p-3 rounded-xl bg-slate-900/90 border border-pink-400/35 text-xs text-gray-200 mt-3">
        💍 <strong class="text-pink-300">${L(`विवाह-आयु आधार (लगभग ${mb.idealRangeStr} वर्ष):`, `Marriage-age baseline (approx. ${mb.idealRangeStr}):`)}</strong>
        ${(L([...mb.earlyReasonsHi, ...mb.delayReasonsHi], [...mb.earlyReasonsEn, ...mb.delayReasonsEn]).join("; ")) || L("सप्तम भाव संतुलित — समय पर विवाह", "Balanced 7th house — timely marriage")}।
      </div>` : "";

    return `
      <div class="pdf-keep-together rounded-3xl bg-slate-950/95 border-2 border-amber-400/50 p-4 md:p-6 mt-5 shadow-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/10">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block"><i class="fas fa-hourglass-half mr-1"></i>${L("जीवन-चक्र संभावित कालखंड", "Life-Milestone Probable Windows")}</span>
            <h3 class="text-lg md:text-xl font-bold text-white mt-0.5">${L("शिक्षा, करियर, विवाह, संतान व संपत्ति — दशा-गोचर आधारित संभावित आयु", "Education, Career, Marriage, Children & Wealth — Dasha-Transit Probable Ages")}</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-purple-600/30 border border-purple-400/50 text-amber-200 text-xs font-extrabold self-start sm:self-auto">${L(ls.badgeHi, ls.badgeEn)}</span>
        </div>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-900 text-amber-300 border-b border-white/10"><tr>
              <th class="py-2.5 px-3 text-left">${L("जीवन-पड़ाव", "Milestone")}</th>
              <th class="py-2.5 px-3 text-center">${L("संभावित आयु व अवधि", "Probable Age & Period")}</th>
              <th class="py-2.5 px-3 text-left">${L("दशा", "Dasha")}</th>
              <th class="py-2.5 px-3 text-left">${L("आधार", "Basis")}</th>
            </tr></thead>
            <tbody class="bg-slate-950/70 divide-y divide-white/10">${rows}</tbody>
          </table>
        </div>
        ${mbNote}
      </div>`;
  }

  window.TimingEngine = {
    classifyLifeStage,
    computeParashariMarriageAgeBaseline,
    findDomainTimingWindows,
    evaluateAntardashaWindow,
    getTransitJupiterAndSaturnRashi,
    renderLifeMilestoneRoadmap,
    _ageSpan: ageSpan,
    _fmtMonth: fmtMonth
  };
})();
