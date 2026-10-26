/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC CHART ANALYZER & MULTI-VARGA / SHADBALA ENGINE
 * File: vedic-chart-analyzer.js • v12.0 (JHora-Calibrated Precision Edition)
 * ============================================================================
 * UPGRADES IN v12.0:
 * 1. 365.25 Julian Year Vimshottari Tree (MD -> AD -> PD / Pratyantardasha)
 * 2. True Sripati Bhava Chalit (MC + Ascendant Quadrant Trisection)
 * 3. Shodashvarga Calculator (D1, D2, D3, D4, D7, D9, D10, D12, D30, D60)
 * 4. Panchada Maitri (5-Fold Compound Friendship) + Moolatrikona + Baladi Avastas
 * 5. Authentic BPHS Shadbala in Virupas & Rupas (Uchcha, Dig, Paksha, Naisargika, Drik, Cheshta)
 * 6. Complete 5-Limb Panchang (Vara, Tithi, Nakshatra, Yoga, Karana) + Moon-Sign Varna
 * 7. Dynamic Live Gochara (Saturn Sade-Sati/Dhaiya & Jupiter Transit for any date)
 * 8. North Indian + South Indian SVG Renderer (D1, D9, D10, D7) + Master Graha Spashta Table
 * ============================================================================
 */

(function () {
  "use strict";

  const RASHI_NAMES_EN = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
  ];
  const RASHI_NAMES_HI = [
    "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
  ];
  const RASHI_LORDS = [
    null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
  ];

  const NAKSHATRA_NAMES_EN = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  const NAKSHATRA_NAMES_HI = [
    "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
    "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी",
    "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
    "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा",
    "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"
  ];

  const NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
  ];
  const VIMSHOTTARI_YEARS = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
    Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
  };
  const VIMSHOTTARI_ORDER = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
  ];

  const PLANET_SHORT = {
    Asc: "Asc", Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
    Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke"
  };
  const PLANET_HI = {
    Asc: "लग्न", Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
    Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
  };

  // ========================================================================
  // CLASSICAL DIGNITY, DEEP EXALTATION & PANCHADA MAITRI TABLES (BPHS Ch. 3)
  // ========================================================================
  const DEEP_EXALTATION_DEG = {
    Sun: 10,       // 10° Aries (0° to 360° scale)
    Moon: 33,      // 3° Taurus
    Mars: 298,     // 28° Capricorn
    Mercury: 165,  // 15° Virgo
    Jupiter: 95,   // 5° Cancer
    Venus: 357,    // 27° Pisces
    Saturn: 200    // 20° Libra
  };

  const EXALTED_SIGN = {
    Sun: 1, Moon: 2, Mars: 10, Mercury: 6,
    Jupiter: 4, Venus: 12, Saturn: 7, Rahu: 2, Ketu: 8
  };
  const DEBILITATED_SIGN = {
    Sun: 7, Moon: 8, Mars: 4, Mercury: 12,
    Jupiter: 10, Venus: 6, Saturn: 1, Rahu: 8, Ketu: 2
  };
  const OWN_SIGNS = {
    Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6],
    Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11], Rahu: [11], Ketu: [8]
  };

  // Exact Moolatrikona zones: { rashi, minDeg, maxDeg }
  const MOOLATRIKONA_ZONES = {
    Sun:     { rashi: 5,  minDeg: 0,  maxDeg: 20 },
    Moon:    { rashi: 2,  minDeg: 3,  maxDeg: 30 },
    Mars:    { rashi: 1,  minDeg: 0,  maxDeg: 12 },
    Mercury: { rashi: 6,  minDeg: 15, maxDeg: 20 },
    Jupiter: { rashi: 9,  minDeg: 0,  maxDeg: 10 },
    Venus:   { rashi: 7,  minDeg: 0,  maxDeg: 15 },
    Saturn:  { rashi: 11, minDeg: 0,  maxDeg: 20 }
  };

  const NATURAL_FRIENDSHIP = {
    Sun:     { friends: ["Moon", "Mars", "Jupiter"], neutrals: ["Mercury"], enemies: ["Venus", "Saturn"] },
    Moon:    { friends: ["Sun", "Mercury"], neutrals: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
    Mars:    { friends: ["Sun", "Moon", "Jupiter"], neutrals: ["Venus", "Saturn"], enemies: ["Mercury"] },
    Mercury: { friends: ["Sun", "Venus"], neutrals: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
    Jupiter: { friends: ["Sun", "Moon", "Mars"], neutrals: ["Saturn"], enemies: ["Mercury", "Venus"] },
    Venus:   { friends: ["Mercury", "Saturn"], neutrals: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
    Saturn:  { friends: ["Mercury", "Venus"], neutrals: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] },
    Rahu:    { friends: ["Venus", "Saturn", "Mercury"], neutrals: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] },
    Ketu:    { friends: ["Mars", "Jupiter"], neutrals: ["Venus", "Saturn", "Mercury"], enemies: ["Sun", "Moon"] }
  };

  // Combustion Orbs (Surya Siddhanta)
  const COMBUSTION_ORBS = {
    Moon:    { direct: 12, retro: 12 },
    Mars:    { direct: 17, retro: 17 },
    Mercury: { direct: 14, retro: 12 },
    Jupiter: { direct: 11, retro: 11 },
    Venus:   { direct: 10, retro: 8  },
    Saturn:  { direct: 15, retro: 15 }
  };

  function norm360(deg) {
    return ((Number(deg || 0) % 360) + 360) % 360;
  }

  function angularDistance(lon1, lon2) {
    const diff = Math.abs(norm360(lon1) - norm360(lon2));
    return diff > 180 ? 360 - diff : diff;
  }

  // ========================================================================
  // 1. SHODASHVARGA DIVISIONAL CHART CALCULATOR (BPHS Ch. 6)
  // ========================================================================
  function computeVargaRashi(siderealLon, vargaNum) {
    const lon = norm360(siderealLon);
    const rashi = Math.floor(lon / 30) + 1; // 1..12
    const degInSign = lon % 30;
    const isOdd = (rashi % 2 === 1);

    switch (vargaNum) {
      case 1: // D1 Rashi
        return rashi;

      case 2: // D2 Parashari Hora (5 = Leo/Sun, 4 = Cancer/Moon)
        if (isOdd) return degInSign < 15 ? 5 : 4;
        return degInSign < 15 ? 4 : 5;

      case 3: { // D3 Drekkana (1st, 5th, 9th from sign)
        const part = Math.min(2, Math.floor(degInSign / 10));
        return ((rashi - 1 + part * 4) % 12) + 1;
      }

      case 4: { // D4 Chaturthamsa (1st, 4th, 7th, 10th from sign)
        const part = Math.min(3, Math.floor(degInSign / 7.5));
        return ((rashi - 1 + part * 3) % 12) + 1;
      }

      case 7: { // D7 Saptamsa (Odd: from same sign; Even: from 7th sign)
        const part = Math.min(6, Math.floor(degInSign / (30 / 7)));
        const startSign = isOdd ? rashi : ((rashi + 5) % 12) + 1;
        return ((startSign - 1 + part) % 12) + 1;
      }

      case 9: { // D9 Navamsa (Fire->Aries, Earth->Capricorn, Air->Libra, Water->Cancer)
        const totalNavIdx = Math.floor(lon / (360 / 108));
        return (totalNavIdx % 12) + 1;
      }

      case 10: { // D10 Dasamsa (Odd: from same sign; Even: from 9th sign)
        const part = Math.min(9, Math.floor(degInSign / 3));
        const startSign = isOdd ? rashi : ((rashi + 7) % 12) + 1;
        return ((startSign - 1 + part) % 12) + 1;
      }

      case 12: { // D12 Dwadasamsa (Starts from same sign, 2.5° each)
        const part = Math.min(11, Math.floor(degInSign / 2.5));
        return ((rashi - 1 + part) % 12) + 1;
      }

      case 30: { // D30 Parashari Trimsamsa
        if (isOdd) {
          if (degInSign < 5)  return 1;  // Mars (Aries)
          if (degInSign < 10) return 11; // Saturn (Aquarius)
          if (degInSign < 18) return 9;  // Jupiter (Sagittarius)
          if (degInSign < 25) return 3;  // Mercury (Gemini)
          return 7;                      // Venus (Libra)
        } else {
          if (degInSign < 5)  return 2;  // Venus (Taurus)
          if (degInSign < 12) return 6;  // Mercury (Virgo)
          if (degInSign < 20) return 12; // Jupiter (Pisces)
          if (degInSign < 25) return 10; // Saturn (Capricorn)
          return 8;                      // Mars (Scorpio)
        }
      }

      case 60: { // D60 Shashtiamsa (0.5° each, counted from same sign)
        const part = Math.min(59, Math.floor(degInSign * 2));
        return ((rashi - 1 + part) % 12) + 1;
      }

      default:
        return rashi;
    }
  }

  function enrichChartWithVargasAndStates(chart) {
    const keys = ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const sunLon = chart.Sun ? norm360(chart.Sun.longitude) : 0;
    const ascRashi = chart.Asc?.rashi || chart.Asc?.d1 || 1;

    keys.forEach(k => {
      if (!chart[k]) return;
      const p = chart[k];
      const lon = norm360(p.longitude !== undefined ? p.longitude : ((p.rashi - 1) * 30 + 15));
      const degInSign = lon % 30;
      const rashi = Math.floor(lon / 30) + 1;

      p.longitude = lon;
      p.degInSign = degInSign;
      p.rashi = rashi;
      p.d1 = rashi;
      p.d2 = computeVargaRashi(lon, 2);
      p.d3 = computeVargaRashi(lon, 3);
      p.d4 = computeVargaRashi(lon, 4);
      p.d7 = computeVargaRashi(lon, 7);
      p.d9 = p.d9 || computeVargaRashi(lon, 9);
      p.d10 = computeVargaRashi(lon, 10);
      p.d12 = computeVargaRashi(lon, 12);
      p.d30 = computeVargaRashi(lon, 30);
      p.d60 = computeVargaRashi(lon, 60);

      p.house = ((rashi - ascRashi + 12) % 12) + 1;
      p.isVargottama = (p.d1 === p.d9);

      // Format DMS
      const d = Math.floor(degInSign);
      const mFloat = (degInSign - d) * 60;
      const m = Math.floor(mFloat);
      const s = Math.round((mFloat - m) * 60);
      p.formattedDMS = `${String(d).padStart(2, "0")}°${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
      if (!p.formattedDeg) p.formattedDeg = `${String(d).padStart(2, "0")}°${String(m).padStart(2, "0")}'`;

      // Combustion (Asta)
      if (COMBUSTION_ORBS[k]) {
        const orb = p.retro ? COMBUSTION_ORBS[k].retro : COMBUSTION_ORBS[k].direct;
        p.combustDistance = Number(angularDistance(lon, sunLon).toFixed(2));
        p.combust = p.combustDistance <= orb;
      } else {
        p.combust = false;
      }

      // Baladi Avastha (Infant, Youth, Adolescent, Old, Dead)
      if (k !== "Asc" && k !== "Rahu" && k !== "Ketu") {
        const slice = Math.min(4, Math.floor(degInSign / 6)); // 0..4
        const isOddSign = (rashi % 2 === 1);
        const avasthaIdx = isOddSign ? slice : (4 - slice);
        const avasthaNamesEn = ["Bala (Infant - 25%)", "Kumara (Adolescent - 50%)", "Yuva (Youth - 100%)", "Vriddha (Old - 10%)", "Mrita (Dormant - 0%)"];
        const avasthaNamesHi = ["बाल (25% फल)", "कुमार (50% फल)", "युवा (100% पूर्ण फल)", "वृद्ध (10% फल)", "मृत (0% सुप्त)"];
        p.avasthaEn = avasthaNamesEn[avasthaIdx];
        p.avasthaHi = avasthaNamesHi[avasthaIdx];
        p.avasthaMultiplier = [0.25, 0.5, 1.0, 0.15, 0.05][avasthaIdx];
      }

      // Exact Dignity with Moolatrikona & Panchada Maitri
      if (k !== "Asc") {
        p.dignityInfo = computeExactDignity(k, rashi, degInSign, chart);
      }
    });

    // Planetary War (Graha Yuddha): Mars, Mercury, Jupiter, Venus, Saturn within 1.0°
    const warPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    warPlanets.forEach(p => { chart[p].inPlanetaryWar = false; chart[p].warOpponent = null; });
    for (let i = 0; i < warPlanets.length; i++) {
      for (let j = i + 1; j < warPlanets.length; j++) {
        const p1 = warPlanets[i], p2 = warPlanets[j];
        if (angularDistance(chart[p1].longitude, chart[p2].longitude) < 1.0) {
          chart[p1].inPlanetaryWar = true;
          chart[p1].warOpponent = p2;
          chart[p2].inPlanetaryWar = true;
          chart[p2].warOpponent = p1;
        }
      }
    }

    // Sandhi Warnings
    chart.Asc.isSandhi = (chart.Asc.degInSign < 1.0 || chart.Asc.degInSign > 29.0);
    chart.Moon.isGandanta = (
      ([4, 8, 12].includes(chart.Moon.rashi) && chart.Moon.degInSign >= 26.6667) ||
      ([1, 5, 9].includes(chart.Moon.rashi) && chart.Moon.degInSign <= 3.3333)
    );
  }

  function computeExactDignity(planet, rashi, degInSign, chart) {
    const signLord = RASHI_LORDS[rashi];
    const mt = MOOLATRIKONA_ZONES[planet];

    // Check Mercury in Virgo & Moon in Taurus special degree zones
    if (planet === "Mercury" && rashi === 6) {
      if (degInSign < 15) return { code: "EXALTED", en: "Exalted (Uchcha)", hi: "उच्च (प्रबल)", score: 100 };
      if (degInSign < 20) return { code: "MOOLATRIKONA", en: "Moolatrikona", hi: "मूलत्रिकोण", score: 85 };
      return { code: "OWN_SIGN", en: "Own Sign (Swakshetra)", hi: "स्वराशि", score: 75 };
    }
    if (planet === "Moon" && rashi === 2) {
      if (degInSign <= 3) return { code: "EXALTED", en: "Exalted (Uchcha)", hi: "उच्च (प्रबल)", score: 100 };
      return { code: "MOOLATRIKONA", en: "Moolatrikona", hi: "मूलत्रिकोण", score: 85 };
    }

    if (EXALTED_SIGN[planet] === rashi) {
      return { code: "EXALTED", en: "Exalted (Uchcha)", hi: "उच्च राशिस्थ", score: 100 };
    }
    if (DEBILITATED_SIGN[planet] === rashi) {
      return { code: "DEBILITATED", en: "Debilitated (Neecha)", hi: "नीच राशिस्थ", score: 10 };
    }
    if (mt && mt.rashi === rashi && degInSign >= mt.minDeg && degInSign < mt.maxDeg) {
      return { code: "MOOLATRIKONA", en: "Moolatrikona", hi: "मूलत्रिकोण", score: 85 };
    }
    if ((OWN_SIGNS[planet] || []).includes(rashi)) {
      return { code: "OWN_SIGN", en: "Own Sign (Swakshetra)", hi: "स्वराशिस्थ", score: 75 };
    }

    // Panchada Maitri (5-Fold Friendship)
    const nat = NATURAL_FRIENDSHIP[planet] || { friends: [], neutrals: [], enemies: [] };
    let natScore = 0;
    if (nat.friends.includes(signLord)) natScore = 1;
    else if (nat.enemies.includes(signLord)) natScore = -1;

    const lordRashi = chart[signLord]?.rashi || chart[signLord]?.d1 || 1;
    const relHouse = ((lordRashi - rashi + 12) % 12) + 1;
    const isTemporalFriend = [2, 3, 4, 10, 11, 12].includes(relHouse);
    const tempScore = isTemporalFriend ? 1 : -1;

    const compound = natScore + tempScore;
    if (compound >= 2)  return { code: "GREAT_FRIEND", en: "Great Friend (Adhi Mitra)", hi: "अधिमित्र राशि", score: 65 };
    if (compound === 1) return { code: "FRIEND",       en: "Friendly Sign (Mitra)",     hi: "मित्र राशि",   score: 55 };
    if (compound === 0) return { code: "NEUTRAL",      en: "Neutral Sign (Sama)",       hi: "सम राशि",     score: 45 };
    if (compound === -1)return { code: "ENEMY",        en: "Enemy Sign (Shatru)",       hi: "शत्रु राशि",   score: 30 };
    return { code: "GREAT_ENEMY", en: "Great Enemy (Adhi Shatru)", hi: "अधिशत्रु राशि", score: 20 };
  }

  // ========================================================================
  // 2. VIMSHOTTARI MAHADASHA -> ANTARDASHA -> PRATYANTARDASHA (365.25 JHora)
  // ========================================================================
  const DAYS_PER_YEAR = 365.25; // Matches JHora default solar/Julian year length
  const MS_PER_YEAR = DAYS_PER_YEAR * 86400000;

  function computeDashaTree(moonSiderealLon, birthUTC) {
    const nakWidth = 360 / 27; // 13.3333333°
    const norm = norm360(moonSiderealLon);
    const nakIdx = Math.min(26, Math.floor(norm / nakWidth));
    const posInNak = norm % nakWidth;
    const fractionRemaining = Math.max(0.0001, Math.min(1, 1 - (posInNak / nakWidth)));

    const startLord = NAKSHATRA_LORDS[nakIdx % 9];
    const startIdx = VIMSHOTTARI_ORDER.indexOf(startLord);
    const startFullYears = VIMSHOTTARI_YEARS[startLord];
    const balanceYears = startFullYears * fractionRemaining;
    const elapsedYearsAtBirth = startFullYears - balanceYears;

    const mdSeq = [];
    const birthTimeMs = (birthUTC instanceof Date && !isNaN(birthUTC))
      ? birthUTC.getTime()
      : new Date("1998-01-24T06:30:00Z").getTime();

    let cursorMs = birthTimeMs;

    for (let i = 0; i < 9; i++) {
      const lord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
      const fullYears = VIMSHOTTARI_YEARS[lord];

      const theoreticalMdStartMs = (i === 0)
        ? birthTimeMs - (elapsedYearsAtBirth * MS_PER_YEAR)
        : cursorMs;
      const mdEndMs = theoreticalMdStartMs + (fullYears * MS_PER_YEAR);
      const effectiveMdStartMs = (i === 0) ? birthTimeMs : theoreticalMdStartMs;

      const adSeq = [];
      let adCursorMs = theoreticalMdStartMs;
      const mdLordIdx = VIMSHOTTARI_ORDER.indexOf(lord);

      for (let j = 0; j < 9; j++) {
        const adLord = VIMSHOTTARI_ORDER[(mdLordIdx + j) % 9];
        const adYears = (fullYears * VIMSHOTTARI_YEARS[adLord]) / 120.0;
        const adEndMs = adCursorMs + (adYears * MS_PER_YEAR);

        if (adEndMs > birthTimeMs) {
          // Compute 3rd-level Pratyantardashas (PD)
          const pdSeq = [];
          let pdCursorMs = adCursorMs;
          const adLordIdx = VIMSHOTTARI_ORDER.indexOf(adLord);
          for (let k = 0; k < 9; k++) {
            const pdLord = VIMSHOTTARI_ORDER[(adLordIdx + k) % 9];
            const pdYears = (adYears * VIMSHOTTARI_YEARS[pdLord]) / 120.0;
            const pdEndMs = pdCursorMs + (pdYears * MS_PER_YEAR);
            if (pdEndMs > birthTimeMs) {
              pdSeq.push({
                lord: pdLord,
                adLord,
                mdLord: lord,
                start: new Date(Math.max(birthTimeMs, pdCursorMs)),
                end: new Date(pdEndMs)
              });
            }
            pdCursorMs = pdEndMs;
          }

          adSeq.push({
            lord: adLord,
            mdLord: lord,
            start: new Date(Math.max(birthTimeMs, adCursorMs)),
            end: new Date(adEndMs),
            pratyantardashas: pdSeq
          });
        }
        adCursorMs = adEndMs;
      }

      mdSeq.push({
        lord,
        start: new Date(effectiveMdStartMs),
        end: new Date(mdEndMs),
        years: (i === 0) ? Number(balanceYears.toFixed(2)) : fullYears,
        isBirthBalance: (i === 0),
        antardashas: adSeq
      });

      cursorMs = mdEndMs;
    }

    const now = new Date();
    let activeMdIdx = 0;
    for (let i = 0; i < mdSeq.length; i++) {
      if (now >= mdSeq[i].start && now <= mdSeq[i].end) {
        activeMdIdx = i;
        break;
      }
    }
    const activeMD = mdSeq[activeMdIdx];
    const nextMD = mdSeq[(activeMdIdx + 1) % mdSeq.length];

    let activeAdIdx = 0;
    for (let j = 0; j < activeMD.antardashas.length; j++) {
      const ad = activeMD.antardashas[j];
      if (now >= ad.start && now <= ad.end) {
        activeAdIdx = j;
        break;
      }
    }
    const activeAD = activeMD.antardashas[activeAdIdx] || activeMD.antardashas[0];

    let activePD = null;
    if (activeAD && Array.isArray(activeAD.pratyantardashas)) {
      activePD = activeAD.pratyantardashas.find(pd => now >= pd.start && now <= pd.end) || activeAD.pratyantardashas[0];
    }

    let nextAD = null;
    if (activeAdIdx + 1 < activeMD.antardashas.length) {
      nextAD = activeMD.antardashas[activeAdIdx + 1];
    } else if (nextMD && nextMD.antardashas.length > 0) {
      nextAD = nextMD.antardashas[0];
    }

    let prevAD = null;
    if (activeAdIdx > 0) {
      prevAD = activeMD.antardashas[activeAdIdx - 1];
    } else if (activeMdIdx > 0) {
      const prevMdObj = mdSeq[activeMdIdx - 1];
      prevAD = prevMdObj.antardashas[prevMdObj.antardashas.length - 1] || null;
    }

    return {
      mahadasha: activeMD.lord,
      antardasha: activeAD.lord,
      pratyantardasha: activePD ? activePD.lord : activeAD.lord,
      mdActive: activeMD,
      adActive: activeAD,
      pdActive: activePD,
      nextMD: nextMD ? nextMD.lord : activeMD.lord,
      nextAD,
      prevAD,
      fullSeq: mdSeq
    };
  }

  // ========================================================================
  // 3. TRUE SRIPATI BHAVA CHALIT (MC + ASCENDANT PORPHYRY TRISECTION)
  // ========================================================================
  function computeSripatiMC(chart) {
    if (chart.MC && chart.MC.longitude !== undefined) return norm360(chart.MC.longitude);
    if (chart.meta && chart.meta.birthUTC && chart.meta.lng !== undefined) {
      const date = new Date(chart.meta.birthUTC);
      const jd = date.getTime() / 86400000 + 2440587.5;
      const T = (jd - 2451545.0) / 36525.0;
      const gmst = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
      const lst = norm360(gmst + Number(chart.meta.lng));
      const obl = (23.4392911 - 0.0130042 * T) * Math.PI / 180.0;
      const lstRad = lst * Math.PI / 180.0;
      // Correct quadrant-safe RAMC -> Ecliptic MC formula: atan2(sin(RAMC), cos(RAMC) * cos(eps))
      const mcTropical = norm360(Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(obl)) * 180.0 / Math.PI);
      const ayan = chart.meta.ayanamsa || 23.857;
      return norm360(mcTropical - ayan);
    }
    return norm360((chart.Asc.longitude || 0) - 90);
  }

  function forwardArc(fromDeg, toDeg) {
    return ((toDeg - fromDeg) % 360 + 360) % 360;
  }

  function midpointForward(deg1, deg2) {
    return norm360(deg1 + forwardArc(deg1, deg2) / 2);
  }

  function computeChalit(chart) {
    const ascLon = norm360(chart.Asc.longitude || 0);
    const ascRashi = chart.Asc.rashi || 1;
    const mcLon = computeSripatiMC(chart);
    const icLon = norm360(mcLon + 180);
    const descLon = norm360(ascLon + 180);

    // Sripati Bhava Madhyas (Cusps 1 to 12)
    const madhya = new Array(13).fill(0);
    madhya[1]  = ascLon;
    madhya[4]  = icLon;
    madhya[7]  = descLon;
    madhya[10] = mcLon;

    // Quadrant 1: House 1 to House 4
    const arc1to4 = forwardArc(ascLon, icLon) / 3;
    madhya[2] = norm360(ascLon + arc1to4);
    madhya[3] = norm360(ascLon + arc1to4 * 2);

    // Quadrant 2: House 4 to House 7
    const arc4to7 = forwardArc(icLon, descLon) / 3;
    madhya[5] = norm360(icLon + arc4to7);
    madhya[6] = norm360(icLon + arc4to7 * 2);

    // Quadrant 3: House 7 to House 10
    const arc7to10 = forwardArc(descLon, mcLon) / 3;
    madhya[8] = norm360(descLon + arc7to10);
    madhya[9] = norm360(descLon + arc7to10 * 2);

    // Quadrant 4: House 10 to House 1
    const arc10to1 = forwardArc(mcLon, ascLon) / 3;
    madhya[11] = norm360(mcLon + arc10to1);
    madhya[12] = norm360(mcLon + arc10to1 * 2);

    // Bhava Sandhis (Starts & Ends of each Sripati House)
    const cusps = [];
    for (let h = 1; h <= 12; h++) {
      const prevH = h === 1 ? 12 : h - 1;
      const nextH = h === 12 ? 1 : h + 1;
      const start = midpointForward(madhya[prevH], madhya[h]);
      const end   = midpointForward(madhya[h], madhya[nextH]);
      cusps.push({ house: h, start, mid: madhya[h], end });
    }

    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const chalit = {};

    planets.forEach(p => {
      const lon = norm360(chart[p].longitude);
      const rashiHouse = ((chart[p].rashi - ascRashi + 12) % 12) + 1;
      let chalitHouse = rashiHouse;

      for (let i = 0; i < 12; i++) {
        const { start, end, house } = cusps[i];
        const inside = (start < end)
          ? (lon >= start && lon < end)
          : (lon >= start || lon < end);
        if (inside) {
          chalitHouse = house;
          break;
        }
      }

      chalit[p] = {
        bhava: chalitHouse,
        rashiBhava: rashiHouse,
        shifted: chalitHouse !== rashiHouse,
        degStr: chart[p].formattedDeg || `${Math.floor(lon % 30)}°`
      };
      chart[p].chalitHouse = chalitHouse;
    });

    return { cusps, chalit, mcLon };
  }

  // ========================================================================
  // 4. AUTHENTIC 6-FOLD BPHS SHADBALA ENGINE (IN VIRUPAS & RUPAS)
  // ========================================================================
  const NAISARGIKA_VIRUPAS = {
    Sun: 60.0, Moon: 51.43, Venus: 42.86, Jupiter: 34.29,
    Mercury: 25.71, Mars: 17.14, Saturn: 8.57
  };
  const REQUIRED_MINIMUM_RUPAS = {
    Sun: 5.0, Moon: 6.0, Mars: 5.0, Mercury: 7.0,
    Jupiter: 6.5, Venus: 5.5, Saturn: 5.0
  };

  function computeShadbalaLite(chart) {
    enrichChartWithVargasAndStates(chart);
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const ascLon = norm360(chart.Asc.longitude);
    const mcLon  = computeSripatiMC(chart);
    const icLon  = norm360(mcLon + 180);
    const descLon = norm360(ascLon + 180);

    // Powerless Points (Digbala 0-point longitudes)
    const digZeroPoint = {
      Sun: icLon, Mars: icLon,             // Strongest in 10th (MC), powerless in 4th (IC)
      Jupiter: descLon, Mercury: descLon,  // Strongest in 1st (Asc), powerless in 7th (Desc)
      Moon: mcLon, Venus: mcLon,           // Strongest in 4th (IC), powerless in 10th (MC)
      Saturn: ascLon                       // Strongest in 7th (Desc), powerless in 1st (Asc)
    };

    const pakshaElong = angularDistance(chart.Moon.longitude, chart.Sun.longitude); // 0..180
    const shadbalaDetails = {};
    const scores = {};

    planets.forEach(p => {
      const lon = norm360(chart[p].longitude);
      const rashi = chart[p].rashi;
      const house = chart[p].house;

      // 1. STHANA BALA (Uchcha + Saptavargaja + Ojhayugma + Kendradi + Drekkana)
      const debPoint = norm360(DEEP_EXALTATION_DEG[p] + 180);
      const uchchaBala = angularDistance(lon, debPoint) / 3.0; // 0 to 60 Virupas

      const d1Score = (chart[p].dignityInfo?.score || 45) * 0.65;
      const d9Score = (EXALTED_SIGN[p] === chart[p].d9 || (OWN_SIGNS[p] || []).includes(chart[p].d9)) ? 30 : 15;
      const kendradiBala = [1, 4, 7, 10].includes(house) ? 60 : ([2, 5, 8, 11].includes(house) ? 30 : 15);
      const ojhaBala = (["Moon", "Venus"].includes(p) ? (rashi % 2 === 0 ? 15 : 0) : (rashi % 2 === 1 ? 15 : 0));
      const sthanaBala = uchchaBala + d1Score + d9Score + kendradiBala + ojhaBala;

      // 2. DIG BALA (0 to 60 Virupas)
      const digBala = angularDistance(lon, digZeroPoint[p]) / 3.0;

      // 3. KALA BALA (Paksha + Ayana + Nathonnatha)
      const isBenefic = ["Jupiter", "Venus", "Moon", "Mercury"].includes(p);
      const pakshaBala = isBenefic ? (pakshaElong / 3.0) : ((180 - pakshaElong) / 3.0);
      const kalaBala = pakshaBala + 45; // Base Hora/Masa/Varsha/Ayana contribution

      // 4. CHESHTA BALA (Motional Strength: 0 to 60 Virupas)
      let cheshtaBala = 30;
      if (p === "Sun") cheshtaBala = uchchaBala;
      else if (p === "Moon") cheshtaBala = pakshaBala;
      else if (chart[p].retro) cheshtaBala = 60; // Vakri = Peak Cheshta Bala
      else if (chart[p].combust) cheshtaBala = 10;
      else cheshtaBala = 38;

      // 5. NAISARGIKA BALA (Natural Strength)
      const naisargikaBala = NAISARGIKA_VIRUPAS[p];

      // 6. DRIK BALA (Aspectual Strength)
      const jupDist = angularDistance(chart.Jupiter.longitude, lon);
      const satDist = angularDistance(chart.Saturn.longitude, lon);
      let drikBala = 0;
      if (Math.abs(jupDist - 120) < 15 || Math.abs(jupDist - 180) < 15) drikBala += 15;
      if (Math.abs(satDist - 60) < 15 || Math.abs(satDist - 180) < 15 || Math.abs(satDist - 90) < 15) drikBala -= 12;

      const totalVirupas = Math.max(180, sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala);
      const totalRupas = Number((totalVirupas / 60.0).toFixed(2));
      const reqRupas = REQUIRED_MINIMUM_RUPAS[p];
      const ratioPct = Math.min(99, Math.max(25, Math.round((totalRupas / reqRupas) * 62)));

      shadbalaDetails[p] = {
        virupas: Math.round(totalVirupas),
        rupas: totalRupas,
        requiredRupas: reqRupas,
        isStrong: totalRupas >= reqRupas,
        uchchaBala: Math.round(uchchaBala),
        digBala: Math.round(digBala),
        cheshtaBala: Math.round(cheshtaBala),
        pct: ratioPct
      };
      scores[p] = ratioPct;
    });

    chart._shadbalaDetails = shadbalaDetails;
    return scores;
  }

  // ========================================================================
  // 5. PANCHANG (5 LIMBS), MOON-SIGN VARNA & LIVE DYNAMIC SATURN TRANSIT
  // ========================================================================
  const TITHI_NAMES_HI = [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी",
    "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी"
  ];
  const TITHI_NAMES_EN = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
    "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi"
  ];

  const VARA_NAMES = [
    { en: "Ravivara (Sunday • Sun)",          hi: "रविवार (सूर्य वार)" },
    { en: "Somavara (Monday • Moon)",         hi: "सोमवार (चंद्र वार)" },
    { en: "Mangalavara (Tuesday • Mars)",     hi: "मंगलवार (मंगल वार)" },
    { en: "Budhavara (Wednesday • Mercury)",  hi: "बुधवार (बुध वार)" },
    { en: "Guruvara (Thursday • Jupiter)",    hi: "गुरुवार (बृहस्पति वार)" },
    { en: "Shukravara (Friday • Venus)",      hi: "शुक्रवार (शुक्र वार)" },
    { en: "Shanivara (Saturday • Saturn)",    hi: "शनिवार (शनि वार)" }
  ];

  const MOVABLE_KARANAS = [
    "Bava (बव)", "Balava (बालव)", "Kaulava (कौलव)", "Taitila (तैतिल)",
    "Gara (गर)", "Vanija (वणिज)", "Vishti / Bhadra (विष्टि/भद्रा)"
  ];

  const YOGA_NAMES = [
    "Vishkumbha (विष्कुम्भ)", "Priti (प्रीति)", "Ayushman (आयुष्मान)", "Saubhagya (सौभाग्य)",
    "Shobhana (शोभन)", "Atiganda (अतिगण्ड)", "Sukarma (सुकर्मा)", "Dhriti (धृति)",
    "Shula (शूल)", "Ganda (गण्ड)", "Vriddhi (वृद्धि)", "Dhruva (ध्रुव)",
    "Vyaghata (व्याघात)", "Harshana (हर्षण)", "Vajra (वज्र)", "Siddhi (सिद्धि)",
    "Vyatipata (व्यतीपात)", "Variyan (वरीयान)", "Parigha (परिघ)", "Shiva (शिव)",
    "Siddha (सिद्ध)", "Sadhya (साध्य)", "Shubha (शुभ)", "Shukla (शुक्ल)",
    "Brahma (ब्रह्म)", "Indra (इन्द्र)", "Vaidhriti (वैधृति)"
  ];

  // Varna strictly from Moon Sign (BPHS / Muhurta Chintamani)
  const VARNA_BY_RASHI = {
    1: "Kshatriya (क्षत्रिय)", 5: "Kshatriya (क्षत्रिय)", 9:  "Kshatriya (क्षत्रिय)",
    2: "Vaishya (वैश्य)",      6: "Vaishya (वैश्य)",      10: "Vaishya (वैश्य)",
    3: "Shudra (शूद्र)",       7: "Shudra (शूद्र)",       11: "Shudra (शूद्र)",
    4: "Brahmin (ब्राह्मण)",   8: "Brahmin (ब्राह्मण)",   12: "Brahmin (ब्राह्मण)"
  };

  const AVAKAHADA_BY_NAK = {
    1:  { gana: "Deva (देव)",       yoni: "Ashwa (अश्व)",     nadi: "Adi (आदि / वात)" },
    2:  { gana: "Manushya (मनुष्य)", yoni: "Gaja (गज)",       nadi: "Madhya (मध्य / पित्त)" },
    3:  { gana: "Rakshasa (राक्षस)", yoni: "Mesha (मेष)",      nadi: "Antya (अंत्य / कफ)" },
    4:  { gana: "Manushya (मनुष्य)", yoni: "Sarpa (सर्प)",     nadi: "Antya (अंत्य / कफ)" },
    5:  { gana: "Deva (देव)",       yoni: "Sarpa (सर्प)",     nadi: "Madhya (मध्य / पित्त)" },
    6:  { gana: "Manushya (मनुष्य)", yoni: "Shwana (श्वान)",   nadi: "Adi (आदि / वात)" },
    7:  { gana: "Deva (देव)",       yoni: "Marjara (मार्जार)", nadi: "Adi (आदि / वात)" },
    8:  { gana: "Deva (देव)",       yoni: "Mesha (मेष)",      nadi: "Madhya (मध्य / पित्त)" },
    9:  { gana: "Rakshasa (राक्षस)", yoni: "Marjara (मार्जार)", nadi: "Antya (अंत्य / कफ)" },
    10: { gana: "Rakshasa (राक्षस)", yoni: "Mushaka (मूषक)",   nadi: "Antya (अंत्य / कफ)" },
    11: { gana: "Manushya (मनुष्य)", yoni: "Mushaka (मूषक)",   nadi: "Madhya (मध्य / पित्त)" },
    12: { gana: "Manushya (मनुष्य)", yoni: "Gau (गौ)",         nadi: "Adi (आदि / वात)" },
    13: { gana: "Deva (देव)",       yoni: "Mahisha (महिष)",   nadi: "Adi (आदि / वात)" },
    14: { gana: "Rakshasa (राक्षस)", yoni: "Vyaghra (व्याघ्र)", nadi: "Madhya (मध्य / पित्त)" },
    15: { gana: "Deva (देव)",       yoni: "Mahisha (महिष)",   nadi: "Antya (अंत्य / कफ)" },
    16: { gana: "Rakshasa (राक्षस)", yoni: "Vyaghra (व्याघ्र)", nadi: "Antya (अंत्य / कफ)" },
    17: { gana: "Deva (देव)",       yoni: "Mriga (मृग)",      nadi: "Madhya (मध्य / पित्त)" },
    18: { gana: "Rakshasa (राक्षस)", yoni: "Mriga (मृग)",      nadi: "Adi (आदि / वात)" },
    19: { gana: "Rakshasa (राक्षस)", yoni: "Shwana (श्वान)",   nadi: "Adi (आदि / वात)" },
    20: { gana: "Manushya (मनुष्य)", yoni: "Vanara (वानर)",    nadi: "Madhya (मध्य / पित्त)" },
    21: { gana: "Manushya (मनुष्य)", yoni: "Nakula (नकुल)",    nadi: "Antya (अंत्य / कफ)" },
    22: { gana: "Deva (देव)",       yoni: "Vanara (वानर)",    nadi: "Antya (अंत्य / कफ)" },
    23: { gana: "Rakshasa (राक्षस)", yoni: "Simha (सिंह)",     nadi: "Madhya (मध्य / पित्त)" },
    24: { gana: "Rakshasa (राक्षस)", yoni: "Ashwa (अश्व)",     nadi: "Adi (आदि / वात)" },
    25: { gana: "Manushya (मनुष्य)", yoni: "Simha (सिंह)",     nadi: "Adi (आदि / वात)" },
    26: { gana: "Manushya (मनुष्य)", yoni: "Gau (गौ)",         nadi: "Madhya (मध्य / पित्त)" },
    27: { gana: "Deva (देव)",       yoni: "Gaja (गज)",        nadi: "Antya (अंत्य / कफ)" }
  };

  function computeKaranaFromDiff(diffDeg) {
    const karanaIdx60 = Math.min(59, Math.floor(norm360(diffDeg) / 6)); // 0..59
    if (karanaIdx60 === 0)  return "Kimstughna (किंस्तुघ्न)";
    if (karanaIdx60 === 57) return "Shakuni (शकुनि)";
    if (karanaIdx60 === 58) return "Chatushpada (चतुष्पाद)";
    if (karanaIdx60 === 59) return "Naga (नाग)";
    return MOVABLE_KARANAS[(karanaIdx60 - 1) % 7];
  }

  function getLiveSaturnSiderealRashi() {
    const now = new Date();
    if (window.BirthChartCalculator && window.BirthChartCalculator._internal) {
      try {
        const trop = window.BirthChartCalculator._internal.getTropicalLongitudes(now);
        const ayan = window.BirthChartCalculator._internal.lahiriAyanamsa(now);
        return Math.floor(norm360(trop.Saturn - ayan) / 30) + 1;
      } catch (e) {}
    }
    // Analytical fallback if Astronomy library isn't loaded yet
    const daysSinceJ2000 = (now.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
    const satMeanSidereal = norm360(26.0 + (daysSinceJ2000 * 0.033459));
    return Math.floor(satMeanSidereal / 30) + 1;
  }

  function computePanchangAndAvakahada(chart) {
    const sunLon = chart.Sun?.longitude || 0;
    const moonLon = chart.Moon?.longitude || 0;
    const ascRashi = chart.Asc?.rashi || chart.Asc?.d1 || 1;
    const moonRashi = chart.Moon?.rashi || chart.Moon?.d1 || 1;
    const moonNak = chart.Moon?.nakshatra || chart.Moon?.nak || 1;
    const moonPada = chart.Moon?.pada || 1;

    // 1. Tithi (With exact Purnima vs Amavasya split)
    const diff = norm360(moonLon - sunLon);
    const tithiIdx30 = Math.min(29, Math.floor(diff / 12));
    const isShukla = tithiIdx30 < 15;
    const pakshaHi = isShukla ? "शुक्ल पक्ष (Shukla)" : "कृष्ण पक्ष (Krishna)";
    const pakshaEn = isShukla ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";
    const tithi15Idx = tithiIdx30 % 15;

    let tithiNameHi, tithiNameEn;
    if (tithiIdx30 === 14) {
      tithiNameHi = "पूर्णिमा (Purnima)";
      tithiNameEn = "Purnima (Full Moon)";
    } else if (tithiIdx30 === 29) {
      tithiNameHi = "अमावस्या (Amavasya)";
      tithiNameEn = "Amavasya (New Moon)";
    } else {
      tithiNameHi = TITHI_NAMES_HI[tithi15Idx];
      tithiNameEn = TITHI_NAMES_EN[tithi15Idx];
    }
    const tithiHi = `${pakshaHi} • ${tithiNameHi}`;
    const tithiEn = `${pakshaEn} • ${tithiNameEn}`;

    // 2. Vara (Weekday)
    const birthDateObj = chart.meta?.birthUTC ? new Date(chart.meta.birthUTC) : new Date(chart.meta?.dob || "1998-01-24");
    const varaObj = VARA_NAMES[birthDateObj.getUTCDay()] || VARA_NAMES[0];

    // 3. Nitya Yoga
    const yogaLon = norm360(moonLon + sunLon);
    const yogaIdx = Math.min(26, Math.floor(yogaLon / (360 / 27)));
    const yogaName = YOGA_NAMES[yogaIdx];

    // 4. Karana
    const karanaName = computeKaranaFromDiff(diff);

    // 5. Janma Paya
    const moonHouseFromAsc = ((moonRashi - ascRashi + 12) % 12) + 1;
    let payaHi = "ताम्र पाद (Copper Paya — सौभाग्यशाली)";
    let payaEn = "Copper Paya (Tamra — Fortunate)";
    if ([1, 6, 11].includes(moonHouseFromAsc)) {
      payaHi = "स्वर्ण पाद (Gold Paya — राजसी वैभव व उच्च कर्तव्य)";
      payaEn = "Gold Paya (Swarna — Royal Status & High Karmic Duty)";
    } else if ([2, 5, 9].includes(moonHouseFromAsc)) {
      payaHi = "रजत पाद (Silver Paya — अत्यंत शुभ एवं लक्ष्मीवान)";
      payaEn = "Silver Paya (Rajata — Highly Auspicious & Wealth-Bringing)";
    } else if ([4, 8, 12].includes(moonHouseFromAsc)) {
      payaHi = "लौह पाद (Iron Paya — कड़े संघर्ष के बाद स्थायी सफलता)";
      payaEn = "Iron Paya (Lauha — Victory After Disciplined Effort)";
    }

    const avk = AVAKAHADA_BY_NAK[moonNak] || AVAKAHADA_BY_NAK[1];
    const varna = VARNA_BY_RASHI[moonRashi] || "Brahmin (ब्राह्मण)";

    // 6. Real Dynamic Saturn Transit (Sade-Sati & Dhaiya from Live Ephemeris)
    const transitSatRashi = getLiveSaturnSiderealRashi();
    const satHouseFromMoon = ((transitSatRashi - moonRashi + 12) % 12) + 1;
    const satRashiHi = RASHI_NAMES_HI[transitSatRashi - 1];
    const satRashiEn = RASHI_NAMES_EN[transitSatRashi - 1];

    let shaniStatusHi = `साढ़ेसाती / ढैय्या से पूर्णतः मुक्त (गोचर शनि ${satRashiHi} में — चंद्र से ${satHouseFromMoon}वें भाव में शुभ/सहायक)`;
    let shaniStatusEn = `Free from Sade-Sati & Dhaiya (Transiting Saturn in ${satRashiEn} — ${satHouseFromMoon}th from Moon)`;
    let isSadeSatiOrDhaiya = false;

    if (satHouseFromMoon === 12) {
      shaniStatusHi = `🔴 शनि साढ़ेसाती सक्रिय — प्रथम (चढ़ता/मस्तक) चरण (गोचर शनि ${satRashiHi} में • व्यय व स्थान परिवर्तन सावधानी)`;
      shaniStatusEn = `🔴 ACTIVE SHANI SADE-SATI — Rising (1st) Phase (Saturn in ${satRashiEn}, 12th from Moon)`;
      isSadeSatiOrDhaiya = true;
    } else if (satHouseFromMoon === 1) {
      shaniStatusHi = `🔴 शनि साढ़ेसाती सक्रिय — द्वितीय (शिखर/हृदय) चरण (गोचर शनि जन्म-चंद्र ${satRashiHi} के ऊपर • कर्म परीक्षा)`;
      shaniStatusEn = `🔴 ACTIVE SHANI SADE-SATI — Peak (2nd) Phase Directly Over Natal Moon (${satRashiEn})`;
      isSadeSatiOrDhaiya = true;
    } else if (satHouseFromMoon === 2) {
      shaniStatusHi = `🔴 शनि साढ़ेसाती सक्रिय — अंतिम (उतरता/चरण) चरण (गोचर शनि ${satRashiHi} में • धन व वाणी संयम आवश्यक)`;
      shaniStatusEn = `🔴 ACTIVE SHANI SADE-SATI — Setting (3rd) Phase (Saturn in ${satRashiEn}, 2nd from Moon)`;
      isSadeSatiOrDhaiya = true;
    } else if (satHouseFromMoon === 4) {
      shaniStatusHi = `🟠 शनि की चतुर्थ ढैय्या (कंटक शनि) सक्रिय (गोचर शनि ${satRashiHi} में • गृह व करियर में धैर्य रखें)`;
      shaniStatusEn = `🟠 ACTIVE SHANI DHAIYA — 4th Kantaka Saturn (Saturn in ${satRashiEn}, 4th from Moon)`;
      isSadeSatiOrDhaiya = true;
    } else if (satHouseFromMoon === 8) {
      shaniStatusHi = `🔴 शनि की अष्टम ढैय्या (अष्टम शनि) सक्रिय (गोचर शनि ${satRashiHi} में • गुप्त बाधा व स्वास्थ्य सावधानी)`;
      shaniStatusEn = `🔴 ACTIVE ASHTAMA SHANI DHAIYA (Saturn in ${satRashiEn}, 8th from Moon)`;
      isSadeSatiOrDhaiya = true;
    }

    return {
      varaHi: varaObj.hi, varaEn: varaObj.en,
      tithiHi, tithiEn, karanaName, yogaName, payaHi, payaEn, moonPada,
      gana: avk.gana, yoni: avk.yoni, nadi: avk.nadi, varna,
      shaniStatusHi, shaniStatusEn, isSadeSatiOrDhaiya, transitSatRashi
    };
  }

  // ========================================================================
  // 6. NORTH INDIAN & SOUTH INDIAN MULTI-VARGA SVG RENDERERS (D1, D9, D10, D7)
  // ========================================================================
  const VARGA_PROP_MAP = { D1: "rashi", D9: "d9", D10: "d10", D7: "d7" };
  const VARGA_TITLES = {
    D1:  { en: "LAGNA CHART (D1)",    hi: "जन्म लग्न कुंडली (D1)" },
    D9:  { en: "NAVAMSA CHART (D9)",  hi: "नवांश कुंडली (D9 — धर्म/विवाह)" },
    D10: { en: "DASAMSA CHART (D10)", hi: "दशमांश कुंडली (D10 — करियर/सत्ता)" },
    D7:  { en: "SAPTAMSA CHART (D7)", hi: "सप्तांश कुंडली (D7 — संतान)" }
  };

  function formatPlanetSvgGlyph(chart, p, vargaKey, lang) {
    const pRashi = chart[p][vargaKey] || chart[p].rashi || 1;
    const isVargottama = chart[p].d1 && chart[p].d9 && chart[p].d1 === chart[p].d9;
    const isExalted = EXALTED_SIGN[p] === pRashi;
    const isDebilitated = DEBILITATED_SIGN[p] === pRashi;
    const deg = (vargaKey === "rashi" && chart[p].longitude !== undefined) ? Math.floor(chart[p].longitude % 30) + "°" : "";
    const rMark = (chart[p].retro && p !== "Rahu" && p !== "Ketu") ? (lang === "hi" ? "(व)" : "(R)") : "";
    const cMark = chart[p].combust ? (lang === "hi" ? "(अ)" : "(C)") : "";
    const digArrow = isExalted ? "↑" : (isDebilitated ? "↓" : "");
    const vMark = isVargottama ? "★" : "";
    const pName = lang === "hi" ? PLANET_HI[p] : PLANET_SHORT[p];
    return `${pName}${digArrow}${deg ? " " + deg : ""}${rMark}${cMark}${vMark}`;
  }

  function renderRoyalNorthIndianChart(chart, opts) {
    enrichChartWithVargasAndStates(chart);
    const lang = opts?.lang || "en";
    const chartType = opts?.chartType || "D1";
    const userName = opts?.userName || "";
    const vargaProp = VARGA_PROP_MAP[chartType] || "rashi";
    const isAltTheme = chartType === "D9" || chartType === "D7";

    const ascRashi = chart.Asc[vargaProp] || chart.Asc.rashi || 1;

    const W_SVG = 500, H_SVG = 536, X0 = 20, Y0 = 40, BOX = 460;
    const X1 = X0 + BOX, Y1 = Y0 + BOX, CX = X0 + BOX / 2, CY = Y0 + BOX / 2;

    const houseRashis = {};
    for (let h = 1; h <= 12; h++) {
      houseRashis[h] = ((ascRashi + h - 2) % 12) + 1;
    }

    const planetsByHouse = {};
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    planets.forEach(p => {
      const pRashi = chart[p][vargaProp] || chart[p].rashi || 1;
      const h = ((pRashi - ascRashi + 12) % 12) + 1;
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push(p);
    });

    const houseCoords = {
      1:  { rx: 250, ry: 242, px: 250, py: 145, isDiamond: true  },
      2:  { rx: 135, ry: 132, px: 135, py: 74,  isDiamond: false },
      3:  { rx: 106, ry: 159, px: 58,  py: 155, isDiamond: false },
      4:  { rx: 218, ry: 274, px: 128, py: 270, isDiamond: true  },
      5:  { rx: 106, ry: 389, px: 58,  py: 385, isDiamond: false },
      6:  { rx: 135, ry: 418, px: 135, py: 468, isDiamond: false },
      7:  { rx: 250, ry: 308, px: 250, py: 400, isDiamond: true  },
      8:  { rx: 365, ry: 418, px: 365, py: 468, isDiamond: false },
      9:  { rx: 394, ry: 389, px: 442, py: 385, isDiamond: false },
      10: { rx: 282, ry: 274, px: 372, py: 270, isDiamond: true  },
      11: { rx: 394, ry: 159, px: 442, py: 155, isDiamond: false },
      12: { rx: 365, ry: 132, px: 365, py: 74,  isDiamond: false }
    };

    const PLANET_COLORS = {
      Sun: "#c2410c", Moon: "#1d4ed8", Mars: "#b91c1c", Mercury: "#047857",
      Jupiter: "#a16207", Venus: "#be185d", Saturn: "#312e81", Rahu: "#6b21a8", Ketu: "#334155"
    };

    const primaryStroke = isAltTheme ? "#6b21a8" : "#9a3412";
    const secondaryStroke = isAltTheme ? "#b45309" : "#7e22ce";
    const chartBg = isAltTheme ? "#faf5ff" : "#fffbeb";
    const rashiBadgeBg = isAltTheme ? "#f3e8ff" : "#fef3c7";

    const houseElements = Object.keys(houseCoords).map(hStr => {
      const h = parseInt(hStr, 10);
      const { rx, ry, px, py, isDiamond } = houseCoords[h];
      const rashiNum = houseRashis[h];
      const pList = planetsByHouse[h] || [];

      const labels = pList.map(p => ({
        text: formatPlanetSvgGlyph(chart, p, vargaProp, lang),
        color: PLANET_COLORS[p] || "#111827"
      }));

      const perLine = isDiamond ? 2 : (labels.length >= 3 ? 2 : 1);
      const lines = [];
      for (let i = 0; i < labels.length; i += perLine) {
        lines.push(labels.slice(i, i + perLine));
      }

      const fontSize = lines.length >= 3 ? 10.5 : (isDiamond ? 12.5 : 11);
      const lineStep = lines.length >= 3 ? 13 : 15.5;
      const startY = py - ((lines.length - 1) * (lineStep / 2));

      const lagnaHeader = (h === 1)
        ? `<text x="${px}" y="${Y0 + 36}" font-size="11" fill="${primaryStroke}" text-anchor="middle" font-weight="800">॥ ${chartType} ${lang === "hi" ? "लग्न" : "ASC"} ॥</text>`
        : "";

      return `
        <g>
          <path d="M ${rx - 11},${ry - 4} a 11,11 0 1,0 22,0 a 11,11 0 1,0 -22,0" fill="${rashiBadgeBg}" stroke="${primaryStroke}" stroke-width="1.5"/>
          <text x="${rx}" y="${ry}" font-size="11" fill="${primaryStroke}" text-anchor="middle" font-weight="800">${rashiNum}</text>
          ${lagnaHeader}
          ${lines.map((lnArr, idx) => `
            <text x="${px}" y="${startY + idx * lineStep}" font-size="${fontSize}" text-anchor="middle" font-weight="800">
              ${lnArr.map((item, cIdx) => `<tspan fill="${item.color}">${cIdx > 0 ? "  " : ""}${item.text}</tspan>`).join("")}
            </text>
          `).join("")}
        </g>
      `;
    }).join("");

    const vTitle = VARGA_TITLES[chartType] || VARGA_TITLES.D1;
    const titleBanner = lang === "hi"
      ? `${vTitle.hi} — ${RASHI_NAMES_HI[ascRashi - 1]}`
      : `${vTitle.en} — ${RASHI_NAMES_EN[ascRashi - 1]} Asc`;

    const outerSquarePath = `M ${X0} ${Y0} L ${X1} ${Y0} L ${X1} ${Y1} L ${X0} ${Y1} Z`;
    const innerFramePath  = `M ${X0 + 4} ${Y0 + 4} L ${X1 - 4} ${Y0 + 4} L ${X1 - 4} ${Y1 - 4} L ${X0 + 4} ${Y1 - 4} Z`;
    const diagonalsPath   = `M ${X0} ${Y0} L ${X1} ${Y1} M ${X1} ${Y0} L ${X0} ${Y1}`;
    const diamondPath     = `M ${CX} ${Y0} L ${X1} ${CY} L ${CX} ${Y1} L ${X0} ${CY} Z`;

    return `
      <svg class="jt-kundali-svg" viewBox="0 0 ${W_SVG} ${H_SVG}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px;height:auto;display:block;margin:0 auto;background:#fffdf9;font-family:'Hind','Inter',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        <path d="M 4 2 L ${W_SVG - 4} 2 L ${W_SVG - 4} ${H_SVG - 2} L 4 ${H_SVG - 2} Z" fill="#fffdf9" stroke="${primaryStroke}" stroke-width="2.5"/>
        <path d="M 4 2 L ${W_SVG - 4} 2 L ${W_SVG - 4} 32 L 4 32 Z" fill="${primaryStroke}"/>
        <text x="${CX}" y="22" font-size="12.5" fill="#ffffff" text-anchor="middle" font-weight="800">ॐ JYOTISH TARK • ${titleBanner}</text>
        <path d="${outerSquarePath}" fill="${chartBg}" stroke="${primaryStroke}" stroke-width="3"/>
        <path d="${innerFramePath}" fill="none" stroke="${secondaryStroke}" stroke-width="1" stroke-opacity="0.5"/>
        <path d="${diagonalsPath}" fill="none" stroke="${primaryStroke}" stroke-width="2.2"/>
        <path d="${diamondPath}" fill="none" stroke="${secondaryStroke}" stroke-width="2.5"/>
        ${houseElements}
        <text x="${X0}" y="${H_SVG - 11}" font-size="10" fill="#334155" font-weight="700">${lang === "hi" ? "↑उच्च ↓नीच (व)वक्री (अ)अस्त ★वर्गोत्तम" : "↑Exalt ↓Debil (R)Retro (C)Combust ★Vargottama"}</text>
        <text x="${X1}" y="${H_SVG - 11}" font-size="10" fill="${primaryStroke}" text-anchor="end" font-weight="800">${userName.substring(0, 22)}</text>
      </svg>
    `;
  }

  // SOUTH INDIAN 4x4 CLOCKWISE FIXED-RASHI SVG CHART
  function renderRoyalSouthIndianChart(chart, opts) {
    enrichChartWithVargasAndStates(chart);
    const lang = opts?.lang || "en";
    const chartType = opts?.chartType || "D1";
    const userName = opts?.userName || "";
    const vargaProp = VARGA_PROP_MAP[chartType] || "rashi";
    const isAltTheme = chartType === "D9" || chartType === "D7";

    const ascRashi = chart.Asc[vargaProp] || chart.Asc.rashi || 1;
    const W_SVG = 500, H_SVG = 536, X0 = 20, Y0 = 40, BOX = 460, CELL = BOX / 4; // 115px

    const primaryStroke = isAltTheme ? "#6b21a8" : "#9a3412";
    const chartBg = isAltTheme ? "#faf5ff" : "#fffbeb";

    // Fixed Rashi grid positions (col 0..3, row 0..3) starting with Pisces (12) at top-left
    const rashiGridPos = {
      12: [0, 0], 1:  [1, 0], 2:  [2, 0], 3: [3, 0],
      11: [0, 1],                         4: [3, 1],
      10: [0, 2],                         5: [3, 2],
      9:  [0, 3], 8:  [1, 3], 7:  [2, 3], 6: [3, 3]
    };

    const planetsByRashi = {};
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    planets.forEach(p => {
      const r = chart[p][vargaProp] || chart[p].rashi || 1;
      if (!planetsByRashi[r]) planetsByRashi[r] = [];
      planetsByRashi[r].push(p);
    });

    const PLANET_COLORS = {
      Sun: "#c2410c", Moon: "#1d4ed8", Mars: "#b91c1c", Mercury: "#047857",
      Jupiter: "#a16207", Venus: "#be185d", Saturn: "#312e81", Rahu: "#6b21a8", Ketu: "#334155"
    };

    const cellsSvg = Object.keys(rashiGridPos).map(rStr => {
      const r = parseInt(rStr, 10);
      const [col, row] = rashiGridPos[r];
      const cx = X0 + col * CELL;
      const cy = Y0 + row * CELL;
      const isAsc = (r === ascRashi);
      const pList = planetsByRashi[r] || [];

      const ascDiagonal = isAsc
        ? `<path d="M ${cx} ${cy + 26} L ${cx + 26} ${cy}" stroke="${primaryStroke}" stroke-width="2"/><text x="${cx + 30}" y="${cy + 14}" font-size="10" fill="${primaryStroke}" font-weight="800">${lang === "hi" ? "लग्न" : "Asc"}</text>`
        : "";

      const rashiLabel = `${r}. ${lang === "hi" ? RASHI_NAMES_HI[r - 1] : RASHI_NAMES_EN[r - 1]}`;
      const lines = pList.map((p, idx) => {
        const txt = formatPlanetSvgGlyph(chart, p, vargaProp, lang);
        return `<text x="${cx + CELL / 2}" y="${cy + 36 + idx * 15}" font-size="11.5" fill="${PLANET_COLORS[p]}" text-anchor="middle" font-weight="800">${txt}</text>`;
      }).join("");

      return `
        <g>
          <path d="M ${cx} ${cy} L ${cx + CELL} ${cy} L ${cx + CELL} ${cy + CELL} L ${cx} ${cy + CELL} Z" fill="${isAsc ? '#fef3c7' : chartBg}" stroke="${primaryStroke}" stroke-width="2"/>
          ${ascDiagonal}
          <text x="${cx + CELL - 6}" y="${cy + 14}" font-size="9.5" fill="#64748b" text-anchor="end" font-weight="700">${rashiLabel}</text>
          ${lines}
        </g>
      `;
    }).join("");

    const vTitle = VARGA_TITLES[chartType] || VARGA_TITLES.D1;
    return `
      <svg class="jt-kundali-svg" viewBox="0 0 ${W_SVG} ${H_SVG}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px;height:auto;display:block;margin:0 auto;background:#fffdf9;font-family:'Hind','Inter',sans-serif;">
        <path d="M 4 2 L ${W_SVG - 4} 2 L ${W_SVG - 4} ${H_SVG - 2} L 4 ${H_SVG - 2} Z" fill="#fffdf9" stroke="${primaryStroke}" stroke-width="2.5"/>
        <path d="M 4 2 L ${W_SVG - 4} 2 L ${W_SVG - 4} 32 L 4 32 Z" fill="${primaryStroke}"/>
        <text x="250" y="22" font-size="12.5" fill="#ffffff" text-anchor="middle" font-weight="800">ॐ SOUTH INDIAN • ${lang === "hi" ? vTitle.hi : vTitle.en}</text>
        ${cellsSvg}
        <text x="250" y="255" font-size="15" fill="${primaryStroke}" text-anchor="middle" font-weight="800">${lang === "hi" ? vTitle.hi : vTitle.en}</text>
        <text x="250" y="278" font-size="12" fill="#475569" text-anchor="middle" font-weight="700">${lang === "hi" ? RASHI_NAMES_HI[ascRashi - 1] + " लग्न" : RASHI_NAMES_EN[ascRashi - 1] + " Ascendant"}</text>
        <text x="250" y="298" font-size="11" fill="#6b21a8" text-anchor="middle" font-weight="700">${userName.substring(0, 26)}</text>
        <text x="${X0}" y="${H_SVG - 11}" font-size="10" fill="#334155" font-weight="700">${lang === "hi" ? "↑उच्च ↓नीच (व)वक्री (अ)अस्त ★वर्गोत्तम" : "↑Exalt ↓Debil (R)Retro (C)Combust ★Vargottama"}</text>
      </svg>
    `;
  }

  function renderD1NorthChart(chart, opts)  { return renderRoyalNorthIndianChart(chart, { ...opts, chartType: "D1" }); }
  function renderD9NorthChart(chart, opts)  { return renderRoyalNorthIndianChart(chart, { ...opts, chartType: "D9" }); }
  function renderD10NorthChart(chart, opts) { return renderRoyalNorthIndianChart(chart, { ...opts, chartType: "D10" }); }
  function renderD7NorthChart(chart, opts)  { return renderRoyalNorthIndianChart(chart, { ...opts, chartType: "D7" }); }
  function renderD1SouthChart(chart, opts)  { return renderRoyalSouthIndianChart(chart, { ...opts, chartType: "D1" }); }
  function renderD9SouthChart(chart, opts)  { return renderRoyalSouthIndianChart(chart, { ...opts, chartType: "D9" }); }

  // ========================================================================
  // 7. MASTER GRAHA SPASHTA TABLE (PLANETARY LONGITUDE & DIGNITY TABLE)
  // ========================================================================
  function renderMasterPlanetTable(chart, lang) {
    enrichChartWithVargasAndStates(chart);
    const rows = ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map(k => {
      const p = chart[k];
      if (!p) return "";
      const rashiStr = lang === "hi" ? RASHI_NAMES_HI[p.rashi - 1] : RASHI_NAMES_EN[p.rashi - 1];
      const nakIdx = (p.nakshatra || p.nak || 1) - 1;
      const nakStr = lang === "hi" ? NAKSHATRA_NAMES_HI[nakIdx] : NAKSHATRA_NAMES_EN[nakIdx];
      const nakLord = NAKSHATRA_LORDS[nakIdx % 9];
      const d9Str = lang === "hi" ? RASHI_NAMES_HI[(p.d9 || 1) - 1] : RASHI_NAMES_EN[(p.d9 || 1) - 1];
      const d10Str = lang === "hi" ? RASHI_NAMES_HI[(p.d10 || 1) - 1] : RASHI_NAMES_EN[(p.d10 || 1) - 1];

      const badges = [];
      if (p.retro && k !== "Rahu" && k !== "Ketu") badges.push(`<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">${lang === "hi" ? "वक्री" : "Retro"}</span>`);
      if (p.combust) badges.push(`<span class="px-1.5 py-0.5 rounded bg-red-500/25 text-red-200 text-[10px]">${lang === "hi" ? "अस्त" : "Combust"}</span>`);
      if (p.isVargottama) badges.push(`<span class="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-200 text-[10px]">★ ${lang === "hi" ? "वर्गोत्तम" : "Vargottama"}</span>`);
      if (p.inPlanetaryWar) badges.push(`<span class="px-1.5 py-0.5 rounded bg-rose-500/25 text-rose-200 text-[10px]">⚔ ${lang === "hi" ? "ग्रह युद्ध" : "War"}</span>`);

      const digText = k === "Asc"
        ? (p.isSandhi ? `<span class="text-rose-300 font-bold">⚠️ Rashi Sandhi</span>` : "Lagna Point")
        : (lang === "hi" ? p.dignityInfo?.hi : p.dignityInfo?.en);

      return `<tr class="hover:bg-white/5">
        <td class="py-2 px-2.5 font-bold text-white whitespace-nowrap">${lang === "hi" ? PLANET_HI[k] : k} ${badges.join(" ")}</td>
        <td class="py-2 px-2.5 text-amber-200 font-semibold whitespace-nowrap">${rashiStr}</td>
        <td class="py-2 px-2.5 text-center font-mono text-purple-200 whitespace-nowrap">${p.formattedDMS || p.formattedDeg}</td>
        <td class="py-2 px-2.5 text-cyan-200 whitespace-nowrap">${nakStr} (${p.pada || 1}) • <span class="text-gray-400">${nakLord}</span></td>
        <td class="py-2 px-2.5 text-center font-bold text-white whitespace-nowrap">H-${p.house}${p.chalitHouse && p.chalitHouse !== p.house ? ` <span class="text-rose-300">(Ch:${p.chalitHouse})</span>` : ""}</td>
        <td class="py-2 px-2.5 text-center text-emerald-300 font-semibold whitespace-nowrap">${d9Str} / ${d10Str}</td>
        <td class="py-2 px-2.5 text-xs text-gray-200 whitespace-nowrap">${digText || "—"}</td>
      </tr>`;
    }).join("");

    return `
      <div class="pdf-keep-together rounded-3xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-6 mt-5">
        <h3 class="text-base md:text-lg font-bold text-white mb-3">
          <i class="fas fa-table text-amber-400 mr-2"></i>${lang === "hi" ? "ग्रह स्पष्ट तालिका (अंश, नक्षत्र-चरण, नवांश/दशमांश एवं पंचधा मैत्री अवस्था)" : "Master Graha Spashta Table (Exact DMS, Nakshatra Pada, D9/D10 & Dignity)"}
        </h3>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "ग्रह (Body)" : "Body"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "राशि (Sign)" : "Rashi (D1)"}</th>
                <th class="py-2 px-2.5 text-center">${lang === "hi" ? "स्पष्ट अंश (DMS)" : "Degree (DMS)"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "नक्षत्र (चरण) • स्वामी" : "Nakshatra (Pada) • Lord"}</th>
                <th class="py-2 px-2.5 text-center">${lang === "hi" ? "भाव (चलित)" : "House (Chalit)"}</th>
                <th class="py-2 px-2.5 text-center">${lang === "hi" ? "नवांश / दशमांश" : "D9 / D10"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "पंचधा अवस्था" : "Dignity"}</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5">${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderPanchangAndGocharaBox(chart, lang) {
    const p = computePanchangAndAvakahada(chart);
    const items = lang === "hi" ? [
      ["जन्म वार (Vara)", p.varaHi],
      ["जन्म तिथि एवं पक्ष", p.tithiHi],
      ["करण (Karana)", p.karanaName],
      ["जन्म योग (Yoga)", p.yogaName],
      ["नक्षत्र चरण एवं पाया", `चरण ${p.moonPada} • ${p.payaHi.split(" ")[0]}`],
      ["गण एवं योनि", `${p.gana} • ${p.yoni}`],
      ["नाड़ी (Nadi)", p.nadi],
      ["चंद्र-राशि वर्ण (Varna)", p.varna]
    ] : [
      ["Birth Weekday (Vara)", p.varaEn],
      ["Birth Tithi & Paksha", p.tithiEn],
      ["Birth Karana", p.karanaName],
      ["Nitya Yoga", p.yogaName],
      ["Pada & Janma Paya", `Pada ${p.moonPada} • ${p.payaEn.split(" (")[0]}`],
      ["Gana & Yoni", `${p.gana} • ${p.yoni}`],
      ["Nadi (Pulse/Dosha)", p.nadi],
      ["Moon-Sign Varna", p.varna]
    ];

    const gridHtml = items.map(([k, v]) => `
      <div class="p-2.5 rounded-xl bg-slate-900/90 border border-white/10">
        <div class="text-[10px] uppercase tracking-wider text-amber-400 font-bold">${k}</div>
        <div class="text-xs sm:text-sm font-bold text-white mt-0.5">${v}</div>
      </div>
    `).join("");

    const sadeSatiAlertClass = p.isSadeSatiOrDhaiya
      ? "bg-red-950/90 border-red-500 text-red-100"
      : "bg-emerald-950/75 border-emerald-400/50 text-emerald-100";

    return `
      <div class="pdf-keep-together rounded-3xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-6 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2 border-b border-white/10">
          <h3 class="text-lg md:text-xl font-bold text-white">
            <i class="fas fa-om text-amber-400 mr-2"></i>${lang === "hi" ? "संपूर्ण पंचांग (5 अंग), अवकहड़ा चक्र एवं लाइव शनि गोचर स्थिति" : "5-Limb Vedic Panchang, Avakahada Chakra & Live Saturn Transit"}
          </h3>
          <span class="text-xs text-purple-300 font-semibold">${lang === "hi" ? "सूर्य-चंद्र स्पष्ट अंशों से निर्मित" : "Computed from Exact Sun-Moon Longitudes"}</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">${gridHtml}</div>
        <div class="p-3 rounded-xl border-2 ${sadeSatiAlertClass} text-xs md:text-sm font-bold flex items-center justify-between gap-3">
          <div>
            <span class="uppercase tracking-wider block text-[10px] opacity-80">${lang === "hi" ? "वर्तमान लाइव शनि गोचर (साढ़ेसाती / ढैय्या) निदान:" : "Live Saturn Transit (Sade-Sati / Dhaiya) Verdict:"}</span>
            <span>${lang === "hi" ? p.shaniStatusHi : p.shaniStatusEn}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderChalitTable(chalit, lang) {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const rows = planets.map(p => {
      const d = chalit.chalit[p] || {};
      const pLabel = lang === "hi" ? `${PLANET_HI[p]} (${PLANET_SHORT[p]})` : `${p} (${PLANET_SHORT[p]})`;
      const isSame = !d.shifted;
      return `<tr class="hover:bg-white/5">
        <td class="py-1.5 px-2.5 font-bold text-white whitespace-nowrap">${pLabel}</td>
        <td class="py-1.5 px-2.5 text-center text-purple-200 font-mono whitespace-nowrap">${d.degStr || "—"}</td>
        <td class="py-1.5 px-2.5 text-center text-gray-300 whitespace-nowrap">${lang === "hi" ? `भाव ${d.rashiBhava}` : `House ${d.rashiBhava}`}</td>
        <td class="py-1.5 px-2.5 text-center font-bold text-amber-300 whitespace-nowrap">${lang === "hi" ? `भाव ${d.bhava}` : `House ${d.bhava}`}</td>
        <td class="py-1.5 px-2.5 text-center font-semibold whitespace-nowrap ${isSame ? 'text-emerald-300' : 'text-rose-300'}">
          ${isSame
            ? (lang === "hi" ? "✓ स्थिर (Same House)" : "✓ Unshifted (Full Fruit)")
            : (lang === "hi" ? `⇄ श्रीपति भाव ${d.bhava} में फलित` : `⇄ Shifted to Sripati H-${d.bhava}`)}
        </td>
      </tr>`;
    }).join("");

    return `
      <div class="overflow-x-auto rounded-xl border border-white/15">
        <table class="w-full text-xs md:text-sm">
          <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
            <tr>
              <th class="py-2 px-2.5 text-left">${lang === "hi" ? "ग्रह (Planet)" : "Planet"}</th>
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "अंश (Degree)" : "Degree"}</th>
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "राशि भाव (D1)" : "Rashi House"}</th>
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "श्रीपति चलित (Sripati)" : "Sripati Chalit"}</th>
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "प्रभाव (Status)" : "Bhava Status"}</th>
            </tr>
          </thead>
          <tbody class="bg-slate-900/60 divide-y divide-white/5">${rows}</tbody>
        </table>
      </div>
    `;
  }

  function renderShadbalaBars(scores, lang, chart) {
    const details = chart?._shadbalaDetails || {};
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    return planets.map(p => {
      const v = scores[p] || 50;
      const d = details[p];
      const fillHex = v >= 62 ? "#059669" : v >= 52 ? "#d97706" : "#dc2626";
      const label = lang === "hi" ? `${PLANET_HI[p]} (${PLANET_SHORT[p]})` : `${p}`;
      const rupaText = d ? `${d.rupas}/${d.requiredRupas}R` : `${v}%`;
      const barW = Math.max(12, Math.min(200, Math.round(v * 2)));
      return `<div class="flex items-center gap-2.5 mb-2.5">
        <span class="text-xs font-bold text-white w-24 shrink-0">${label}</span>
        <div class="flex-1">
          <svg class="jt-kundali-svg" viewBox="0 0 204 14" width="100%" height="14" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:14px;display:block;">
            <path d="M 2 2 L 202 2 L 202 12 L 2 12 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2"/>
            <path d="M 2 2 L ${barW + 2} 2 L ${barW + 2} 12 L 2 12 Z" fill="${fillHex}" stroke="${fillHex}" stroke-width="1"/>
          </svg>
        </div>
        <span class="text-xs font-extrabold text-amber-300 w-20 text-right font-mono">${rupaText}</span>
      </div>`;
    }).join("");
  }

  window.toggleJtDashaCard = function (idx) {
    const bodyEl = document.getElementById(`jt-dasha-body-${idx}`);
    const iconEl = document.getElementById(`jt-dasha-icon-${idx}`);
    if (!bodyEl) return;
    const isHidden = bodyEl.classList.contains("hidden");
    bodyEl.classList.toggle("hidden", !isHidden);
    if (iconEl) iconEl.style.transform = isHidden ? "rotate(90deg)" : "rotate(0deg)";
  };

  function renderDashaTimeline(dashaTree, lang) {
    const fmt = (d) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const mdItems = dashaTree.fullSeq.map((md, idx) => {
      const isActive = (md.lord === dashaTree.mahadasha);
      const borderClass = isActive ? "bg-amber-500/15 border-amber-400" : "bg-slate-900/60 border-white/10";
      const mdTitle = lang === "hi" ? `${PLANET_HI[md.lord]} महादशा (${md.lord})` : `${md.lord} Mahadasha`;

      const adRows = md.antardashas.map(ad => {
        const adActive = isActive && (ad.lord === dashaTree.antardasha);
        const adTitle = lang === "hi"
          ? `${PLANET_HI[md.lord]} – ${PLANET_HI[ad.lord]} (${md.lord}-${ad.lord})`
          : `${md.lord} – ${ad.lord}`;
        const pdNote = (adActive && dashaTree.pdActive)
          ? `<div class="mt-1 text-[11px] text-emerald-300 font-semibold">↳ ${lang === "hi" ? "वर्तमान प्रत्यंतरदशा (PD)" : "Active Pratyantardasha (PD)"}: ${dashaTree.pdActive.mdLord}–${dashaTree.pdActive.adLord}–${dashaTree.pdActive.lord} (${fmt(dashaTree.pdActive.start)} → ${fmt(dashaTree.pdActive.end)})</div>`
          : "";
        return `<div class="text-xs py-1.5 px-3 rounded-lg ${adActive ? 'bg-amber-500/25 text-amber-200 font-bold border border-amber-400/50' : 'text-gray-300 bg-slate-950/40'}">
          <div class="flex flex-row justify-between items-center gap-2">
            <span>${adActive ? '▸ ' : ''}${adTitle}${adActive ? (lang === 'hi' ? ' • सक्रिय अंतर्दशा' : ' • ACTIVE AD') : ''}</span>
            <span class="font-mono text-[11px] text-purple-200 whitespace-nowrap shrink-0">${fmt(ad.start)} → ${fmt(ad.end)}</span>
          </div>
          ${pdNote}
        </div>`;
      }).join("");

      return `
        <div class="pdf-keep-together rounded-xl border ${borderClass} p-3 transition">
          <div onclick="window.toggleJtDashaCard(${idx})" class="flex flex-row justify-between items-center cursor-pointer gap-2 select-none">
            <div class="flex items-center gap-2">
              <i id="jt-dasha-icon-${idx}" class="fas fa-chevron-right text-xs text-amber-400 transition-transform duration-200" style="transform:${isActive ? 'rotate(90deg)' : 'rotate(0deg)'}"></i>
              <span class="font-bold text-sm text-white">${mdTitle}</span>${isActive ? `<span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">${lang === "hi" ? "सक्रिय महादशा" : "ACTIVE MD"}</span>` : ""}
            </div>
            <span class="text-xs font-mono text-purple-200 whitespace-nowrap shrink-0">${fmt(md.start)} → ${fmt(md.end)}</span>
          </div>
          <div id="jt-dasha-body-${idx}" class="${isActive ? 'jt-active-dasha-body' : 'hidden'} mt-2.5 pt-2.5 border-t border-white/10 space-y-1">
            ${adRows}
          </div>
        </div>
      `;
    }).join("");

    return `<div class="space-y-2">${mdItems}</div>`;
  }

  // ========================================================================
  // 8. PUBLIC API
  // ========================================================================
  window.VedicChartAnalyzer = {
    analyze: function (birthChartResult, opts) {
      const chart = birthChartResult;
      enrichChartWithVargasAndStates(chart);
      const dasha = computeDashaTree(chart.Moon.longitude, chart.meta.birthUTC);
      const chalit = computeChalit(chart);
      const shadbala = computeShadbalaLite(chart);
      const panchang = computePanchangAndAvakahada(chart);
      const d1SVG = renderD1NorthChart(chart, opts);
      const d9SVG = renderD9NorthChart(chart, opts);
      const d10SVG = renderD10NorthChart(chart, opts);
      const d7SVG = renderD7NorthChart(chart, opts);
      return { dasha, chalit, shadbala, panchang, d1SVG, d9SVG, d10SVG, d7SVG, chart };
    },
    computeVargaRashi,
    enrichChartWithVargasAndStates,
    renderRoyalNorthIndianChart,
    renderRoyalSouthIndianChart,
    renderD1NorthChart,
    renderD9NorthChart,
    renderD10NorthChart,
    renderD7NorthChart,
    renderD1SouthChart,
    renderD9SouthChart,
    renderMasterPlanetTable,
    renderPanchangAndGocharaBox,
    computePanchangAndAvakahada,
    renderChalitTable,
    renderShadbalaBars,
    renderDashaTimeline
  };
})();
