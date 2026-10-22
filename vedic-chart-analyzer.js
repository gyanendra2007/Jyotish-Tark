/**
 * ============================================================================
 * JYOTISH TARK — VEDIC CHART ANALYZER & TRADITIONAL NORTH-INDIAN SVG ENGINE
 * File: vedic-chart-analyzer.js • v11.0 (100% Print-Proof <path> Kundali + Bars)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
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

  const TITHI_NAMES_HI = [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी",
    "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा/अमावस्या"
  ];
  const TITHI_NAMES_EN = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
    "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
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

  const AVAKAHADA_BY_NAK = {
    1:  { gana: "Deva (देव)",       yoni: "Ashwa (अश्व)",     nadi: "Adi (आदि / वात)",      varna: "Kshatriya" },
    2:  { gana: "Manushya (मनुष्य)", yoni: "Gaja (गज)",       nadi: "Madhya (मध्य / पित्त)", varna: "Kshatriya" },
    3:  { gana: "Rakshasa (राक्षस)", yoni: "Mesha (मेष)",      nadi: "Antya (अंत्य / कफ)",   varna: "Brahmin" },
    4:  { gana: "Manushya (मनुष्य)", yoni: "Sarpa (सर्प)",     nadi: "Antya (अंत्य / कफ)",   varna: "Shudra" },
    5:  { gana: "Deva (देव)",       yoni: "Sarpa (सर्प)",     nadi: "Madhya (मध्य / पित्त)", varna: "Vaishya" },
    6:  { gana: "Manushya (मनुष्य)", yoni: "Shwana (श्वान)",   nadi: "Adi (आदि / वात)",      varna: "Shudra" },
    7:  { gana: "Deva (देव)",       yoni: "Marjara (मार्जार)", nadi: "Adi (आदि / वात)",      varna: "Vaishya" },
    8:  { gana: "Deva (देव)",       yoni: "Mesha (मेष)",      nadi: "Madhya (मध्य / पित्त)", varna: "Kshatriya" },
    9:  { gana: "Rakshasa (राक्षस)", yoni: "Marjara (मार्जार)", nadi: "Antya (अंत्य / कफ)",   varna: "Shudra" },
    10: { gana: "Rakshasa (राक्षस)", yoni: "Mushaka (मूषक)",   nadi: "Antya (अंत्य / कफ)",   varna: "Kshatriya" },
    11: { gana: "Manushya (मनुष्य)", yoni: "Mushaka (मूषक)",   nadi: "Madhya (मध्य / पित्त)", varna: "Brahmin" },
    12: { gana: "Manushya (मनुष्य)", yoni: "Gau (गौ)",         nadi: "Adi (आदि / वात)",      varna: "Kshatriya" },
    13: { gana: "Deva (देव)",       yoni: "Mahisha (महिष)",   nadi: "Adi (आदि / वात)",      varna: "Vaishya" },
    14: { gana: "Rakshasa (राक्षस)", yoni: "Vyaghra (व्याघ्र)", nadi: "Madhya (मध्य / पित्त)", varna: "Vaishya" },
    15: { gana: "Deva (देव)",       yoni: "Mahisha (महिष)",   nadi: "Antya (अंत्य / कफ)",   varna: "Shudra" },
    16: { gana: "Rakshasa (राक्षस)", yoni: "Vyaghra (व्याघ्र)", nadi: "Antya (अंत्य / कफ)",   varna: "Brahmin" },
    17: { gana: "Deva (देव)",       yoni: "Mriga (मृग)",      nadi: "Madhya (मध्य / पित्त)", varna: "Shudra" },
    18: { gana: "Rakshasa (राक्षस)", yoni: "Mriga (मृग)",      nadi: "Adi (आदि / वात)",      varna: "Brahmin" },
    19: { gana: "Rakshasa (राक्षस)", yoni: "Shwana (श्वान)",   nadi: "Adi (आदि / वात)",      varna: "Kshatriya" },
    20: { gana: "Manushya (मनुष्य)", yoni: "Vanara (वानर)",    nadi: "Madhya (मध्य / पित्त)", varna: "Brahmin" },
    21: { gana: "Manushya (मनुष्य)", yoni: "Nakula (नकुल)",    nadi: "Antya (अंत्य / कफ)",   varna: "Kshatriya" },
    22: { gana: "Deva (देव)",       yoni: "Vanara (वानर)",    nadi: "Antya (अंत्य / कफ)",   varna: "Shudra" },
    23: { gana: "Rakshasa (राक्षस)", yoni: "Simha (सिंह)",     nadi: "Madhya (मध्य / पित्त)", varna: "Vaishya" },
    24: { gana: "Rakshasa (राक्षस)", yoni: "Ashwa (अश्व)",     nadi: "Adi (आदि / वात)",      varna: "Shudra" },
    25: { gana: "Manushya (मनुष्य)", yoni: "Simha (सिंह)",     nadi: "Adi (आदि / वात)",      varna: "Brahmin" },
    26: { gana: "Manushya (मनुष्य)", yoni: "Gau (गौ)",         nadi: "Madhya (मध्य / पित्त)", varna: "Kshatriya" },
    27: { gana: "Deva (देव)",       yoni: "Gaja (गज)",        nadi: "Antya (अंत्य / कफ)",   varna: "Shudra" }
  };

  // ========================================================================
  // 1. VIMSHOTTARI MAHADASHA & ANTARDASHA CALENDAR TREE
  // ========================================================================
  function computeDashaTree(moonSiderealLon, birthUTC) {
    const nakWidth = 360 / 27;
    const norm = ((moonSiderealLon % 360) + 360) % 360;
    const nakIdx = Math.min(26, Math.floor(norm / nakWidth));
    const posInNak = norm % nakWidth;
    const fractionRemaining = Math.max(0.005, Math.min(1, 1 - (posInNak / nakWidth)));

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
        ? birthTimeMs - (elapsedYearsAtBirth * 365.2425 * 86400000)
        : cursorMs;
      const mdEndMs = theoreticalMdStartMs + (fullYears * 365.2425 * 86400000);
      const effectiveMdStartMs = (i === 0) ? birthTimeMs : theoreticalMdStartMs;

      const adSeq = [];
      let adCursorMs = theoreticalMdStartMs;
      const mdLordIdx = VIMSHOTTARI_ORDER.indexOf(lord);

      for (let j = 0; j < 9; j++) {
        const adLord = VIMSHOTTARI_ORDER[(mdLordIdx + j) % 9];
        const adYears = (fullYears * VIMSHOTTARI_YEARS[adLord]) / 120.0;
        const adEndMs = adCursorMs + (adYears * 365.2425 * 86400000);

        if (adEndMs > birthTimeMs) {
          adSeq.push({
            lord: adLord,
            mdLord: lord,
            start: new Date(Math.max(birthTimeMs, adCursorMs)),
            end: new Date(adEndMs)
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
    const activeAD = activeMD.antardashas[activeAdIdx] || {
      lord: activeMD.lord,
      mdLord: activeMD.lord,
      start: activeMD.start,
      end: activeMD.end
    };

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
      mdActive: activeMD,
      adActive: activeAD,
      nextMD: nextMD ? nextMD.lord : activeMD.lord,
      nextAD,
      prevAD,
      fullSeq: mdSeq
    };
  }

  // ========================================================================
  // 2. MIDPOINT BHAVA CHALIT
  // ========================================================================
  function computeChalit(chart) {
    const ascLon = chart.Asc.longitude || 0;
    const ascRashi = chart.Asc.rashi || 1;

    const cusps = [];
    for (let h = 0; h < 12; h++) {
      const mid = ((ascLon + h * 30) % 360 + 360) % 360;
      const start = ((mid - 15) % 360 + 360) % 360;
      const end = ((mid + 15) % 360 + 360) % 360;
      cusps.push({ house: h + 1, start, mid, end });
    }

    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const chalit = {};

    planets.forEach(p => {
      const lon = ((chart[p].longitude % 360) + 360) % 360;
      const rashiHouse = ((chart[p].rashi - ascRashi + 12) % 12) + 1;
      let chalitHouse = rashiHouse;

      for (let h = 0; h < 12; h++) {
        const { start, end } = cusps[h];
        const inside = (start < end)
          ? (lon >= start && lon < end)
          : (lon >= start || lon < end);
        if (inside) {
          chalitHouse = h + 1;
          break;
        }
      }

      chalit[p] = {
        bhava: chalitHouse,
        rashiBhava: rashiHouse,
        shifted: chalitHouse !== rashiHouse,
        degStr: chart[p].formattedDeg || `${Math.floor(lon % 30)}°`
      };
    });

    return { cusps, chalit };
  }

  // ========================================================================
  // 3. SHADBALA-LITE PLANETARY STRENGTH METER
  // ========================================================================
  const OWN_SIGNS = {
    Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6],
    Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11], Rahu: [11], Ketu: [8]
  };
  const EXALTED = {
    Sun: 1, Moon: 2, Mars: 10, Mercury: 6,
    Jupiter: 4, Venus: 12, Saturn: 7, Rahu: 2, Ketu: 8
  };
  const DEBILITATED = {
    Sun: 7, Moon: 8, Mars: 4, Mercury: 12,
    Jupiter: 10, Venus: 6, Saturn: 1, Rahu: 8, Ketu: 2
  };
  const DIGBALA_HOUSE = {
    Sun: 10, Mars: 10, Jupiter: 1, Mercury: 1, Moon: 4, Venus: 4, Saturn: 7
  };

  function computeShadbalaLite(chart) {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const scores = {};
    const ascSign = chart.Asc.rashi;

    planets.forEach(p => {
      let score = 52;
      const rashi = chart[p].rashi;
      const d9 = chart[p].d9;
      const houseFromAsc = ((rashi - ascSign + 12) % 12) + 1;

      if (EXALTED[p] === rashi) score += 26;
      else if (DEBILITATED[p] === rashi) score -= 24;
      else if ((OWN_SIGNS[p] || []).includes(rashi)) score += 18;

      if (EXALTED[p] === d9 || (OWN_SIGNS[p] || []).includes(d9)) score += 10;
      else if (DEBILITATED[p] === d9) score -= 8;

      if (rashi === d9) score += 9;

      if (DIGBALA_HOUSE[p] === houseFromAsc) score += 12;
      else if ([1, 4, 7, 10].includes(houseFromAsc)) score += 6;
      else if ([5, 9].includes(houseFromAsc)) score += 5;

      if (chart[p].retro) score += 8;

      scores[p] = Math.max(18, Math.min(99, Math.round(score)));
    });

    return scores;
  }

  // ========================================================================
  // 4 & 5. 100% PRINT-PROOF NORTH-INDIAN KUNDALI SVG (USING <path> VECTORS)
  // ========================================================================
  function renderRoyalNorthIndianChart(chart, opts) {
    const lang = opts?.lang || "en";
    const chartType = opts?.chartType || "D1";
    const userName = opts?.userName || "";
    const isD9 = chartType === "D9";

    const ascRashi = isD9 ? (chart.Asc.d9 || 1) : (chart.Asc.rashi || chart.Asc.d1 || 1);

    const W_SVG = 500;
    const H_SVG = 536;
    const X0 = 20;
    const Y0 = 40;
    const BOX = 460;
    const X1 = X0 + BOX; // 480
    const Y1 = Y0 + BOX; // 500
    const CX = X0 + BOX / 2; // 250
    const CY = Y0 + BOX / 2; // 270

    const houseRashis = {};
    for (let h = 1; h <= 12; h++) {
      houseRashis[h] = ((ascRashi + h - 2) % 12) + 1;
    }

    const planetsByHouse = {};
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    planets.forEach(p => {
      const pRashi = isD9 ? (chart[p].d9 || 1) : (chart[p].rashi || chart[p].d1 || 1);
      const h = ((pRashi - ascRashi + 12) % 12) + 1;
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push(p);
    });

    // Coordinates for Rashi Number (rx, ry) and Planet Stack Center (px, py)
    const houseCoords = {
      1:  { rx: 250, ry: 242, px: 250, py: 145, isDiamond: true  }, // H1: Top Central Diamond
      2:  { rx: 135, ry: 132, px: 135, py: 74,  isDiamond: false }, // H2: Top-Left Upper Triangle
      3:  { rx: 106, ry: 159, px: 58,  py: 155, isDiamond: false }, // H3: Left-Top Outer Triangle
      4:  { rx: 218, ry: 274, px: 128, py: 270, isDiamond: true  }, // H4: Left Central Diamond
      5:  { rx: 106, ry: 389, px: 58,  py: 385, isDiamond: false }, // H5: Left-Bottom Outer Triangle
      6:  { rx: 135, ry: 418, px: 135, py: 468, isDiamond: false }, // H6: Bottom-Left Lower Triangle
      7:  { rx: 250, ry: 308, px: 250, py: 400, isDiamond: true  }, // H7: Bottom Central Diamond
      8:  { rx: 365, ry: 418, px: 365, py: 468, isDiamond: false }, // H8: Bottom-Right Lower Triangle
      9:  { rx: 394, ry: 389, px: 442, py: 385, isDiamond: false }, // H9: Right-Bottom Outer Triangle
      10: { rx: 282, ry: 274, px: 372, py: 270, isDiamond: true  }, // H10: Right Central Diamond
      11: { rx: 394, ry: 159, px: 442, py: 155, isDiamond: false }, // H11: Right-Top Outer Triangle
      12: { rx: 365, ry: 132, px: 365, py: 74,  isDiamond: false }  // H12: Top-Right Upper Triangle
    };

    const PLANET_COLORS = {
      Sun: "#c2410c", Moon: "#1d4ed8", Mars: "#b91c1c", Mercury: "#047857",
      Jupiter: "#a16207", Venus: "#be185d", Saturn: "#312e81", Rahu: "#6b21a8", Ketu: "#334155"
    };

    const primaryStroke = isD9 ? "#6b21a8" : "#9a3412";
    const secondaryStroke = isD9 ? "#b45309" : "#7e22ce";
    const chartBg = isD9 ? "#faf5ff" : "#fffbeb";
    const rashiBadgeBg = isD9 ? "#f3e8ff" : "#fef3c7";

    const houseElements = Object.keys(houseCoords).map(hStr => {
      const h = parseInt(hStr, 10);
      const { rx, ry, px, py, isDiamond } = houseCoords[h];
      const rashiNum = houseRashis[h];
      const pList = planetsByHouse[h] || [];

      const labels = pList.map(p => {
        const d1R = chart[p].rashi || chart[p].d1;
        const d9R = chart[p].d9;
        const isVargottama = d1R && d9R && d1R === d9R;
        const deg = (!isD9 && chart[p].longitude !== undefined) ? Math.floor(chart[p].longitude % 30) + "°" : "";
        const rMark = (chart[p].retro && p !== "Rahu" && p !== "Ketu") ? (lang === "hi" ? "(व)" : "*") : "";
        const vMark = isVargottama ? "★" : "";
        const pName = lang === "hi" ? PLANET_HI[p] : PLANET_SHORT[p];
        return {
          text: `${pName}${deg ? " " + deg : ""}${rMark}${vMark}`,
          color: PLANET_COLORS[p] || "#111827"
        };
      });

      const perLine = isDiamond ? 2 : (labels.length >= 3 ? 2 : 1);
      const lines = [];
      for (let i = 0; i < labels.length; i += perLine) {
        lines.push(labels.slice(i, i + perLine));
      }

      const fontSize = lines.length >= 3 ? 11 : (isDiamond ? 13 : 11.5);
      const lineStep = lines.length >= 3 ? 13.5 : 16;
      const startY = py - ((lines.length - 1) * (lineStep / 2));

      const lagnaHeader = (h === 1)
        ? `<text x="${px}" y="${Y0 + 36}" font-size="11" fill="${primaryStroke}" text-anchor="middle" font-weight="800">${isD9 ? (lang === "hi" ? "॥ नवांश लग्न ॥" : "॥ D9 LAGNA ॥") : (lang === "hi" ? "॥ जन्म लग्न ॥" : "॥ LAGNA (ASC) ॥")}</text>`
        : "";

      return `
        <g>
          <!-- Rashi Number Badge drawn as explicit <path> circle so print never drops it -->
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

    const titleBanner = isD9
      ? (lang === "hi" ? `नवांश कुंडली (D9) — ${RASHI_NAMES_HI[ascRashi - 1]} नवांश` : `NAVAMSA CHART (D9) — ${RASHI_NAMES_EN[ascRashi - 1]} Asc`)
      : (lang === "hi" ? `जन्म लग्न कुंडली (D1) — ${RASHI_NAMES_HI[ascRashi - 1]} लग्न` : `LAGNA CHART (D1) — ${RASHI_NAMES_EN[ascRashi - 1]} Asc`);

    // All Square Borders, Diagonals & Central Diamond encoded as explicit <path> vectors!
    const outerSquarePath = `M ${X0} ${Y0} L ${X1} ${Y0} L ${X1} ${Y1} L ${X0} ${Y1} Z`;
    const innerFramePath  = `M ${X0 + 4} ${Y0 + 4} L ${X1 - 4} ${Y0 + 4} L ${X1 - 4} ${Y1 - 4} L ${X0 + 4} ${Y1 - 4} Z`;
    const diagonalsPath   = `M ${X0} ${Y0} L ${X1} ${Y1} M ${X1} ${Y0} L ${X0} ${Y1}`;
    const diamondPath     = `M ${CX} ${Y0} L ${X1} ${CY} L ${CX} ${Y1} L ${X0} ${CY} Z`;

    return `
      <svg class="jt-kundali-svg" viewBox="0 0 ${W_SVG} ${H_SVG}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px;height:auto;display:block;margin:0 auto;background:#fffdf9;font-family:'Hind','Inter',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        <!-- Outer Card Frame -->
        <path d="M 4 2 L ${W_SVG - 4} 2 L ${W_SVG - 4} ${H_SVG - 2} L 4 ${H_SVG - 2} Z" fill="#fffdf9" stroke="${primaryStroke}" stroke-width="2.5"/>
        <!-- Top Title Banner -->
        <path d="M 4 2 L ${W_SVG - 4} 2 L ${W_SVG - 4} 32 L 4 32 Z" fill="${primaryStroke}"/>
        <text x="${CX}" y="22" font-size="13" fill="#ffffff" text-anchor="middle" font-weight="800">ॐ JYOTISH TARK • ${titleBanner}</text>

        <!-- Main Kundali Square & Inner Double Border -->
        <path d="${outerSquarePath}" fill="${chartBg}" stroke="${primaryStroke}" stroke-width="3"/>
        <path d="${innerFramePath}" fill="none" stroke="${secondaryStroke}" stroke-width="1" stroke-opacity="0.5"/>

        <!-- 2 Corner-to-Corner Diagonals -->
        <path d="${diagonalsPath}" fill="none" stroke="${primaryStroke}" stroke-width="2.2"/>

        <!-- Central Diamond (Connecting Midpoints of the 4 Sides) -->
        <path d="${diamondPath}" fill="none" stroke="${secondaryStroke}" stroke-width="2.5"/>

        <!-- House Numbers & Planets -->
        ${houseElements}

        <!-- Bottom Legend Bar -->
        <text x="${X0}" y="${H_SVG - 11}" font-size="10.5" fill="#334155" font-weight="700">${lang === "hi" ? "(व) = वक्री • ★ = वर्गोत्तम (D1=D9) • गोल अंक = राशि संख्या" : "* = Retrograde • ★ = Vargottama • Circle = Rashi No."}</text>
        <text x="${X1}" y="${H_SVG - 11}" font-size="10.5" fill="${primaryStroke}" text-anchor="end" font-weight="800">${userName.substring(0, 22)}</text>
      </svg>
    `;
  }

  function renderD1NorthChart(chart, opts) {
    return renderRoyalNorthIndianChart(chart, { ...opts, chartType: "D1" });
  }
  function renderD9NorthChart(chart, opts) {
    return renderRoyalNorthIndianChart(chart, { ...opts, chartType: "D9" });
  }
  const renderD9SouthChart = renderD9NorthChart;

  // ========================================================================
  // 6. PANCHANG, AVAKAHADA CHAKRA & 2026 LIVE SHANI SADE-SATI DETECTOR
  // ========================================================================
  function computePanchangAndAvakahada(chart) {
    const sunLon = chart.Sun?.longitude || 0;
    const moonLon = chart.Moon?.longitude || 0;
    const ascRashi = chart.Asc?.rashi || chart.Asc?.d1 || 1;
    const moonRashi = chart.Moon?.rashi || chart.Moon?.d1 || 1;
    const moonNak = chart.Moon?.nakshatra || chart.Moon?.nak || 1;
    const moonPada = chart.Moon?.pada || 1;

    const diff = ((moonLon - sunLon) % 360 + 360) % 360;
    const tithiIdx30 = Math.floor(diff / 12);
    const pakshaHi = tithiIdx30 < 15 ? "शुक्ल पक्ष (Shukla)" : "कृष्ण पक्ष (Krishna)";
    const pakshaEn = tithiIdx30 < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";
    const tithi15Idx = tithiIdx30 % 15;
    const tithiHi = `${pakshaHi} • ${TITHI_NAMES_HI[tithi15Idx]}`;
    const tithiEn = `${pakshaEn} • ${TITHI_NAMES_EN[tithi15Idx]}`;

    const yogaLon = ((moonLon + sunLon) % 360 + 360) % 360;
    const yogaIdx = Math.min(26, Math.floor(yogaLon / (360 / 27)));
    const yogaName = YOGA_NAMES[yogaIdx];

    const moonHouseFromAsc = ((moonRashi - ascRashi + 12) % 12) + 1;
    let payaHi = "ताम्र पाद (Copper Paya — सौभाग्यशाली)";
    let payaEn = "Copper Paya (Tamra — Fortunate)";
    if ([1, 6, 11].includes(moonHouseFromAsc)) {
      payaHi = "स्वर्ण पाद (Gold Paya — राजसी वैभव व थोड़ा स्वास्थ्य संघर्ष)";
      payaEn = "Gold Paya (Swarna — Royal Status & High Karmic Duty)";
    } else if ([2, 5, 9].includes(moonHouseFromAsc)) {
      payaHi = "रजत पाद (Silver Paya — अत्यंत शुभ एवं लक्ष्मीवान)";
      payaEn = "Silver Paya (Rajata — Highly Auspicious & Wealth-Bringing)";
    } else if ([4, 8, 12].includes(moonHouseFromAsc)) {
      payaHi = "लौह पाद (Iron Paya — कड़े संघर्ष के बाद स्थायी सफलता)";
      payaEn = "Iron Paya (Lauha — Requires Remedy; Victory After Struggle)";
    }

    const avk = AVAKAHADA_BY_NAK[moonNak] || AVAKAHADA_BY_NAK[1];

    let shaniStatusHi = "साढ़ेसाती / ढैय्या से पूर्णतः मुक्त (Shani Transit Supportive)";
    let shaniStatusEn = "Free from Sade-Sati & Dhaiya (Supportive Saturn Transit)";
    let isSadeSatiOrDhaiya = false;

    if (moonRashi === 11) {
      shaniStatusHi = "🔴 शनि साढ़ेसाती सक्रिय — अंतिम (उतरता) चरण (धन व वाणी संयम आवश्यक)";
      shaniStatusEn = "🔴 ACTIVE SHANI SADE-SATI — Setting (3rd) Phase in 2026";
      isSadeSatiOrDhaiya = true;
    } else if (moonRashi === 12) {
      shaniStatusHi = "🔴 शनि साढ़ेसाती सक्रिय — द्वितीय (शिखर/हृदय) चरण (मानसिक दबाव व कर्म परीक्षा)";
      shaniStatusEn = "🔴 ACTIVE SHANI SADE-SATI — Peak (2nd) Phase Directly Over Moon in 2026!";
      isSadeSatiOrDhaiya = true;
    } else if (moonRashi === 1) {
      shaniStatusHi = "🔴 शनि साढ़ेसाती सक्रिय — प्रथम (चढ़ता/मस्तक) चरण (अचानक खर्च व स्थान परिवर्तन)";
      shaniStatusEn = "🔴 ACTIVE SHANI SADE-SATI — Rising (1st) Phase in 2026";
      isSadeSatiOrDhaiya = true;
    } else if (moonRashi === 9) {
      shaniStatusHi = "🟠 शनि की चतुर्थ ढैय्या (कंटक शनि) सक्रिय — गृह व करियर में धैर्य रखें";
      shaniStatusEn = "🟠 ACTIVE SHANI DHAIYA (4th Kantaka Saturn) in 2026";
      isSadeSatiOrDhaiya = true;
    } else if (moonRashi === 5) {
      shaniStatusHi = "🔴 शनि की अष्टम ढैय्या (अष्टम शनि) सक्रिय — गुप्त बाधा व स्वास्थ्य सावधानी";
      shaniStatusEn = "🔴 ACTIVE ASHTAMA SHANI DHAIYA (8th Saturn Transit) in 2026";
      isSadeSatiOrDhaiya = true;
    }

    return {
      tithiHi, tithiEn, yogaName, payaHi, payaEn, moonPada,
      gana: avk.gana, yoni: avk.yoni, nadi: avk.nadi, varna: avk.varna,
      shaniStatusHi, shaniStatusEn, isSadeSatiOrDhaiya
    };
  }

  function renderPanchangAndGocharaBox(chart, lang) {
    const p = computePanchangAndAvakahada(chart);
    const items = lang === "hi" ? [
      ["जन्म तिथि एवं पक्ष", p.tithiHi],
      ["नक्षत्र चरण (Pada)", `चरण ${p.moonPada}`],
      ["जन्म योग (Yoga)", p.yogaName],
      ["जन्म पाया (Paya)", p.payaHi],
      ["गण (Gana)", p.gana],
      ["योनि (Yoni)", p.yoni],
      ["नाड़ी (Nadi — स्वास्थ्य)", p.nadi],
      ["वर्ण (Varna)", p.varna]
    ] : [
      ["Birth Tithi & Paksha", p.tithiEn],
      ["Nakshatra Pada", `Pada ${p.moonPada}`],
      ["Nitya Yoga", p.yogaName],
      ["Janma Paya (Footing)", p.payaEn],
      ["Gana (Temperament)", p.gana],
      ["Yoni (Symbol)", p.yoni],
      ["Nadi (Pulse/Dosha)", p.nadi],
      ["Varna", p.varna]
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
            <i class="fas fa-om text-amber-400 mr-2"></i>${lang === "hi" ? "पंचांग, अवकहड़ा चक्र एवं 2026 शनि साढ़ेसाती स्थिति" : "Vedic Panchang, Avakahada Chakra & 2026 Saturn Transit Status"}
          </h3>
          <span class="text-xs text-purple-300 font-semibold">${lang === "hi" ? "चंद्र-सूर्य स्पष्ट अंशों से निर्मित" : "Computed from Exact Sun-Moon Longitudes"}</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">${gridHtml}</div>
        <div class="p-3 rounded-xl border-2 ${sadeSatiAlertClass} text-xs md:text-sm font-bold flex items-center justify-between gap-3">
          <div>
            <span class="uppercase tracking-wider block text-[10px] opacity-80">${lang === "hi" ? "वर्ष 2026 गोचर (मीन के शनि एवं कुंभ-सिंह राहु-केतु) निदान:" : "2026 Live Transit (Saturn in Pisces & Rahu-Ketu Axis) Verdict:"}</span>
            <span>${lang === "hi" ? p.shaniStatusHi : p.shaniStatusEn}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========================================================================
  // 7. BHAVA CHALIT TABLE RENDERER
  // ========================================================================
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
            : (lang === "hi" ? `⇄ भाव ${d.bhava} में फलित` : `⇄ Shifted to H-${d.bhava}`)}
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
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "लग्न भाव (D1)" : "Rashi House (D1)"}</th>
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "चलित भाव (Chalit)" : "Chalit House"}</th>
              <th class="py-2 px-2.5 text-center">${lang === "hi" ? "प्रभाव (Status)" : "Bhava Status"}</th>
            </tr>
          </thead>
          <tbody class="bg-slate-900/60 divide-y divide-white/5">${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ========================================================================
  // 8. SHADBALA STRENGTH BARS RENDERER (100% PRINT-PROOF BORDER+PATH BARS)
  // ========================================================================
  function renderShadbalaBars(scores, lang) {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    return planets.map(p => {
      const v = scores[p] || 50;
      const fillHex = v >= 65 ? "#059669" : v >= 55 ? "#d97706" : "#dc2626";
      const label = lang === "hi" ? `${PLANET_HI[p]} (${PLANET_SHORT[p]})` : `${p}`;
      const barW = Math.max(12, Math.min(200, Math.round(v * 2)));
      return `<div class="flex items-center gap-3 mb-2.5">
        <span class="text-xs font-bold text-white w-24 shrink-0">${label}</span>
        <div class="flex-1">
          <svg class="jt-kundali-svg" viewBox="0 0 204 14" width="100%" height="14" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:14px;display:block;">
            <path d="M 2 2 L 202 2 L 202 12 L 2 12 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2"/>
            <path d="M 2 2 L ${barW + 2} 2 L ${barW + 2} 12 L 2 12 Z" fill="${fillHex}" stroke="${fillHex}" stroke-width="1"/>
          </svg>
        </div>
        <span class="text-xs font-extrabold text-amber-300 w-12 text-right">${v}%</span>
      </div>`;
    }).join("");
  }

  // ========================================================================
  // 9. ZERO-OVERLAP <div> ACCORDION VIMSHOTTARI DASHA TIMELINE
  // ========================================================================
  window.toggleJtDashaCard = function (idx) {
    const bodyEl = document.getElementById(`jt-dasha-body-${idx}`);
    const iconEl = document.getElementById(`jt-dasha-icon-${idx}`);
    if (!bodyEl) return;
    const isHidden = bodyEl.classList.contains("hidden");
    if (isHidden) {
      bodyEl.classList.remove("hidden");
      if (iconEl) iconEl.style.transform = "rotate(90deg)";
    } else {
      bodyEl.classList.add("hidden");
      if (iconEl) iconEl.style.transform = "rotate(0deg)";
    }
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
        return `<div class="flex flex-row justify-between items-center text-xs py-1.5 px-3 rounded-lg gap-2 ${adActive ? 'bg-amber-500/25 text-amber-200 font-bold border border-amber-400/50' : 'text-gray-300 bg-slate-950/40'}">
          <span>${adActive ? '▸ ' : ''}${adTitle}${adActive ? (lang === 'hi' ? ' • वर्तमान में सक्रिय' : ' • ACTIVE NOW') : ''}</span>
          <span class="font-mono text-[11px] text-purple-200 whitespace-nowrap shrink-0">${fmt(ad.start)} → ${fmt(ad.end)}</span>
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
  // 10. PUBLIC API
  // ========================================================================
  window.VedicChartAnalyzer = {
    analyze: function (birthChartResult, opts) {
      const chart = birthChartResult;
      const dasha = computeDashaTree(chart.Moon.longitude, chart.meta.birthUTC);
      const chalit = computeChalit(chart);
      const shadbala = computeShadbalaLite(chart);
      const panchang = computePanchangAndAvakahada(chart);
      const d1SVG = renderD1NorthChart(chart, opts);
      const d9SVG = renderD9NorthChart(chart, opts);
      return { dasha, chalit, shadbala, panchang, d1SVG, d9SVG, chart };
    },
    renderD1NorthChart,
    renderD9NorthChart,
    renderD9SouthChart,
    renderPanchangAndGocharaBox,
    computePanchangAndAvakahada,
    renderChalitTable,
    renderShadbalaBars,
    renderDashaTimeline
  };
})();
