/**
 * ============================================================================
 * JYOTISH TARK — VEDIC CHART ANALYZER & SVG RENDERER (Engine 4)
 * File: vedic-chart-analyzer.js • v6.5 (True North/South SVG & Midpoint Chalit)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Consumes exact sidereal longitudes from birth-chart-calculator.js
 * Produces:
 * - Authentic North Indian D1 Lagna SVG Chart (with degrees & retro markers)
 * - Authentic South Indian D9 Navamsa SVG Chart
 * - Midpoint Bhava Chalit (ascLon ± 15°) with House-Shift Detection
 * - Shadbala-Lite Planetary Strength Meter (0–100%)
 * - Full 120-Year Vimshottari Mahadasha & Antardasha Calendar Timeline
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

  // ========================================================================
  // 1. VIMSHOTTARI MAHADASHA & ANTARDASHA CALENDAR TREE (From Exact Moon Lon)
  // ========================================================================
  function computeDashaTree(moonSiderealLon, birthUTC) {
    const nakWidth = 360 / 27; // 13.333333°
    const norm = ((moonSiderealLon % 360) + 360) % 360;
    const nakIdx = Math.min(26, Math.floor(norm / nakWidth));
    const posInNak = norm % nakWidth;
    const fractionRemaining = Math.max(0.01, Math.min(1, 1 - (posInNak / nakWidth)));

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

      // For the birth Mahadasha (i === 0), its theoretical start was before birth
      const theoreticalMdStartMs = (i === 0)
        ? birthTimeMs - (elapsedYearsAtBirth * 365.2425 * 86400000)
        : cursorMs;
      const mdEndMs = theoreticalMdStartMs + (fullYears * 365.2425 * 86400000);
      const effectiveMdStartMs = (i === 0) ? birthTimeMs : theoreticalMdStartMs;

      // Compute all 9 Antardashas using full Mahadasha years, clipped to birth date
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
    let activeMD = mdSeq[0];
    for (const md of mdSeq) {
      if (now >= md.start && now <= md.end) {
        activeMD = md;
        break;
      }
    }
    let activeAD = activeMD.antardashas[0] || { lord: activeMD.lord, start: activeMD.start, end: activeMD.end };
    for (const ad of activeMD.antardashas) {
      if (now >= ad.start && now <= ad.end) {
        activeAD = ad;
        break;
      }
    }

    return {
      mahadasha: activeMD.lord,
      antardasha: activeAD.lord,
      mdActive: activeMD,
      adActive: activeAD,
      fullSeq: mdSeq
    };
  }

  // ========================================================================
  // 2. MIDPOINT BHAVA CHALIT (Ascendant = Bhava Madhya, Cusps at ±15°)
  // ========================================================================
  function computeChalit(chart) {
    const ascLon = chart.Asc.longitude || 0;
    const ascRashi = chart.Asc.rashi || 1;

    // Each Bhava h (1..12) has its midpoint at ascLon + (h-1)*30°
    // Bhava Sandhi (start) = midpoint - 15°, end = midpoint + 15°
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
  // 3. SHADBALA-LITE — Multi-Factor Planetary Strength Score (0–100%)
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

      // 1. Sthana Bala (D1 + D9 Dignity & Vargottama)
      if (EXALTED[p] === rashi) score += 26;
      else if (DEBILITATED[p] === rashi) score -= 24;
      else if ((OWN_SIGNS[p] || []).includes(rashi)) score += 18;

      if (EXALTED[p] === d9 || (OWN_SIGNS[p] || []).includes(d9)) score += 10;
      else if (DEBILITATED[p] === d9) score -= 8;

      if (rashi === d9) score += 9; // Vargottama bonus

      // 2. Digbala (Directional Strength)
      if (DIGBALA_HOUSE[p] === houseFromAsc) score += 12;
      else if ([1, 4, 7, 10].includes(houseFromAsc)) score += 6;
      else if ([5, 9].includes(houseFromAsc)) score += 5;

      // 3. Cheshta Bala (Retrograde Boost)
      if (chart[p].retro) score += 8;

      scores[p] = Math.max(18, Math.min(99, Math.round(score)));
    });

    return scores;
  }

  // ========================================================================
  // 4. AUTHENTIC NORTH INDIAN DIAMOND SVG CHART (D1 LAGNA KUNDALI)
  // ========================================================================
  function renderD1NorthChart(chart, opts) {
    const lang = opts?.lang || "en";
    const userName = opts?.userName || "";
    const ascRashi = chart.Asc.rashi || 1;
    const S = 520;
    const M = 16; // Outer margin
    const W = S - 2 * M;
    const cx = S / 2;
    const cy = S / 2;

    // House Rashi numbers (1..12 counter-clockwise starting from top diamond)
    const houseRashis = {};
    for (let h = 1; h <= 12; h++) {
      houseRashis[h] = ((ascRashi + h - 2) % 12) + 1;
    }

    // Group planets by house
    const planetsByHouse = {};
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    planets.forEach(p => {
      const rashi = chart[p].rashi;
      const h = ((rashi - ascRashi + 12) % 12) + 1;
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push(p);
    });

    // Exact Geometric Centers for all 12 North Indian Compartments
    // Corners: TL(16,16), TR(504,16), BR(504,504), BL(16,504)
    // Midpoints: TM(260,16), RM(504,260), BM(260,504), LM(16,260)
    // Inner Quarter Intersections: Q_TL(138,138), Q_TR(382,138), Q_BR(382,382), Q_BL(138,382)
    const houseCoords = {
      1:  { rx: 260, ry: 222, px: 260, py: 120 }, // Top Central Diamond (Lagna)
      2:  { rx: 138, ry: 112, px: 138, py: 52  }, // Top-Left Upper Triangle
      3:  { rx: 112, ry: 138, px: 56,  py: 130 }, // Left-Top Outer Triangle
      4:  { rx: 222, ry: 260, px: 130, py: 252 }, // Left Central Diamond
      5:  { rx: 112, ry: 382, px: 56,  py: 374 }, // Left-Bottom Outer Triangle
      6:  { rx: 138, ry: 408, px: 138, py: 454 }, // Bottom-Left Lower Triangle
      7:  { rx: 260, ry: 298, px: 260, py: 382 }, // Bottom Central Diamond
      8:  { rx: 382, ry: 408, px: 382, py: 454 }, // Bottom-Right Lower Triangle
      9:  { rx: 408, ry: 382, px: 462, py: 374 }, // Right-Bottom Outer Triangle
      10: { rx: 298, ry: 260, px: 390, py: 252 }, // Right Central Diamond
      11: { rx: 408, ry: 138, px: 462, py: 130 }, // Right-Top Outer Triangle
      12: { rx: 382, ry: 112, px: 382, py: 52  }  // Top-Right Upper Triangle
    };

    const houseElements = Object.keys(houseCoords).map(hStr => {
      const h = parseInt(hStr, 10);
      const { rx, ry, px, py } = houseCoords[h];
      const rashiNum = houseRashis[h];
      const pList = planetsByHouse[h] || [];

      const labels = pList.map(p => {
        const deg = chart[p].longitude !== undefined ? Math.floor(chart[p].longitude % 30) + "°" : "";
        const rMark = (chart[p].retro && p !== "Rahu" && p !== "Ketu") ? "*" : "";
        const pName = lang === "hi" ? PLANET_HI[p] : PLANET_SHORT[p];
        return `${pName} ${deg}${rMark}`;
      });

      // Arrange up to 2 planets per line if crowded
      const lines = [];
      for (let i = 0; i < labels.length; i += 2) {
        lines.push(labels.slice(i, i + 2).join("  "));
      }

      const startY = py - ((lines.length - 1) * 7);

      return `
        <g>
          <!-- Rashi Number Badge -->
          <circle cx="${rx}" cy="${ry - 4}" r="10" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>
          <text x="${rx}" y="${ry}" font-size="10" fill="#92400e" text-anchor="middle" font-weight="800">${rashiNum}</text>
          ${h === 1 ? `<text x="${px}" y="${py - 28}" font-size="10" fill="#7e22ce" text-anchor="middle" font-weight="800">${lang === "hi" ? "लग्न (Asc)" : "LAGNA"}</text>` : ""}
          ${lines.map((ln, idx) => `
            <text x="${px}" y="${startY + idx * 14}" font-size="11" fill="#0f172a" text-anchor="middle" font-weight="700">${ln}</text>
          `).join("")}
        </g>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;font-family:'Inter','Hind',sans-serif;">
        <defs>
          <linearGradient id="d1BgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fffbeb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#faf5ff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Outer Square Background -->
        <rect x="${M}" y="${M}" width="${W}" height="${W}" fill="url(#d1BgGrad)" stroke="#7e22ce" stroke-width="3" rx="6"/>
        <!-- 2 Corner-to-Corner Diagonals -->
        <line x1="${M}" y1="${M}" x2="${S - M}" y2="${S - M}" stroke="#9333ea" stroke-width="1.8"/>
        <line x1="${S - M}" y1="${M}" x2="${M}" y2="${S - M}" stroke="#9333ea" stroke-width="1.8"/>
        <!-- Inner Midpoint Diamond -->
        <polygon points="${cx},${M} ${S - M},${cy} ${cx},${S - M} ${M},${cy}" fill="none" stroke="#d97706" stroke-width="2.2"/>
        <!-- House Contents -->
        ${houseElements}
        <!-- Bottom Watermark Bar -->
        <text x="${M + 8}" y="${S - 4}" font-size="9" fill="#6b21a8" font-weight="700">JYOTISH TARK • D1 LAGNA CHART (* = Retrograde)</text>
        <text x="${S - M - 8}" y="${S - 4}" font-size="9" fill="#6b7280" text-anchor="end">${userName.substring(0, 26)}</text>
      </svg>
    `;
  }

  // ========================================================================
  // 5. AUTHENTIC SOUTH INDIAN SVG CHART (D9 NAVAMSA KUNDALI)
  // ========================================================================
  function renderD9SouthChart(chart, opts) {
    const lang = opts?.lang || "en";
    const userName = opts?.userName || "";
    const S = 520;
    const M = 16;
    const W = S - 2 * M;
    const cell = W / 4;

    const layout = {
      12: { row: 0, col: 0 }, 1:  { row: 0, col: 1 }, 2:  { row: 0, col: 2 }, 3:  { row: 0, col: 3 },
      11: { row: 1, col: 0 },                                                 4:  { row: 1, col: 3 },
      10: { row: 2, col: 0 },                                                 5:  { row: 2, col: 3 },
      9:  { row: 3, col: 0 }, 8:  { row: 3, col: 1 }, 7:  { row: 3, col: 2 }, 6:  { row: 3, col: 3 }
    };

    const d9PlanetsByRashi = {};
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    planets.forEach(p => {
      const d9R = chart[p].d9;
      if (!d9PlanetsByRashi[d9R]) d9PlanetsByRashi[d9R] = [];
      d9PlanetsByRashi[d9R].push(p);
    });
    const ascD9 = chart.Asc.d9 || 1;

    const rashiNames = lang === "hi" ? RASHI_NAMES_HI : RASHI_NAMES_EN;

    const cellsHtml = Object.keys(layout).map(rStr => {
      const rId = parseInt(rStr, 10);
      const { row, col } = layout[rId];
      const x = M + col * cell;
      const y = M + row * cell;
      const pHere = d9PlanetsByRashi[rId] || [];
      const isAsc = (rId === ascD9);

      const pLabels = pHere.map(p => lang === "hi" ? PLANET_HI[p] : PLANET_SHORT[p]);
      const lines = [];
      for (let i = 0; i < pLabels.length; i += 2) {
        lines.push(pLabels.slice(i, i + 2).join("  "));
      }

      return `
        <g>
          <rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${isAsc ? '#fef3c7' : (pHere.length ? '#faf5ff' : '#ffffff')}" stroke="#9333ea" stroke-width="1.5"/>
          ${isAsc ? `<line x1="${x}" y1="${y + 22}" x2="${x + 22}" y2="${y}" stroke="#d97706" stroke-width="2.5"/>` : ""}
          <text x="${x + 6}" y="${y + 14}" font-size="9.5" fill="#7e22ce" font-weight="700">${rId}. ${rashiNames[rId - 1]}</text>
          ${isAsc ? `<text x="${x + cell - 6}" y="${y + 14}" font-size="9.5" fill="#b45309" text-anchor="end" font-weight="800">${lang === "hi" ? "लग्न" : "ASC"}</text>` : ""}
          ${lines.map((ln, idx) => `
            <text x="${x + cell / 2}" y="${y + 44 + idx * 16}" font-size="12" fill="#0f172a" text-anchor="middle" font-weight="700">${ln}</text>
          `).join("")}
        </g>
      `;
    }).join("");

    const centerBox = `
      <rect x="${M + cell}" y="${M + cell}" width="${cell * 2}" height="${cell * 2}" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
      <text x="${S / 2}" y="${S / 2 - 22}" font-size="13" fill="#7e22ce" text-anchor="middle" font-weight="800" letter-spacing="1.5">JYOTISH TARK</text>
      <text x="${S / 2}" y="${S / 2 + 2}" font-size="18" fill="#111827" text-anchor="middle" font-weight="800">${lang === "hi" ? "नवांश कुंडली (D9)" : "NAVAMSA CHART (D9)"}</text>
      <text x="${S / 2}" y="${S / 2 + 22}" font-size="11" fill="#b45309" text-anchor="middle" font-weight="700">${lang === "hi" ? "D9 लग्न: " + rashiNames[ascD9 - 1] : "D9 Asc: " + rashiNames[ascD9 - 1]}</text>
      <text x="${S / 2}" y="${S / 2 + 40}" font-size="10" fill="#6b7280" text-anchor="middle">${userName.substring(0, 26)}</text>
    `;

    return `
      <svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;font-family:'Inter','Hind',sans-serif;">
        <rect x="${M}" y="${M}" width="${W}" height="${W}" fill="#ffffff" stroke="#7e22ce" stroke-width="3" rx="6"/>
        ${cellsHtml}
        ${centerBox}
      </svg>
    `;
  }

  // ========================================================================
  // 6. BHAVA CHALIT TABLE RENDERER
  // ========================================================================
  function renderChalitTable(chalit, lang) {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const rows = planets.map(p => {
      const d = chalit.chalit[p] || {};
      const pLabel = lang === "hi" ? `${PLANET_HI[p]} (${PLANET_SHORT[p]})` : `${p} (${PLANET_SHORT[p]})`;
      const isSame = !d.shifted;
      return `<tr class="hover:bg-white/5">
        <td class="py-2 px-3 font-bold text-white">${pLabel}</td>
        <td class="py-2 px-3 text-center text-purple-200 font-mono">${d.degStr || "—"}</td>
        <td class="py-2 px-3 text-center text-gray-300">${lang === "hi" ? `भाव ${d.rashiBhava}` : `House ${d.rashiBhava}`}</td>
        <td class="py-2 px-3 text-center font-bold text-amber-300">${lang === "hi" ? `भाव ${d.bhava}` : `House ${d.bhava}`}</td>
        <td class="py-2 px-3 text-center font-semibold ${isSame ? 'text-emerald-300' : 'text-rose-300'}">
          ${isSame
            ? (lang === "hi" ? "✓ स्थिर (Same House)" : "✓ Unshifted (Full Fruit)")
            : (lang === "hi" ? `⇄ भाव ${d.bhava} में स्थानांतरित` : `⇄ Shifted to H-${d.bhava}`)}
        </td>
      </tr>`;
    }).join("");

    return `
      <div class="overflow-x-auto rounded-xl border border-white/15">
        <table class="w-full text-xs md:text-sm">
          <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
            <tr>
              <th class="py-2.5 px-3 text-left">${lang === "hi" ? "ग्रह (Planet)" : "Planet"}</th>
              <th class="py-2.5 px-3 text-center">${lang === "hi" ? "अंश (Degree)" : "Degree"}</th>
              <th class="py-2.5 px-3 text-center">${lang === "hi" ? "लग्न भाव (D1)" : "Rashi House (D1)"}</th>
              <th class="py-2.5 px-3 text-center">${lang === "hi" ? "चलित भाव (Chalit)" : "Chalit House"}</th>
              <th class="py-2.5 px-3 text-center">${lang === "hi" ? "प्रभाव (Status)" : "Bhava Status"}</th>
            </tr>
          </thead>
          <tbody class="bg-slate-900/60 divide-y divide-white/5">${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ========================================================================
  // 7. SHADBALA STRENGTH BARS RENDERER
  // ========================================================================
  function renderShadbalaBars(scores, lang) {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    return planets.map(p => {
      const v = scores[p] || 50;
      const color = v >= 75 ? "from-emerald-500 to-green-400"
                  : v >= 55 ? "from-amber-500 to-yellow-400"
                  : v >= 38 ? "from-orange-500 to-amber-400"
                  : "from-rose-500 to-red-400";
      const label = lang === "hi" ? `${PLANET_HI[p]} (${PLANET_SHORT[p]})` : `${p}`;
      return `<div class="flex items-center gap-3 mb-2.5">
        <span class="text-xs font-bold text-white w-20 shrink-0">${label}</span>
        <div class="flex-1 bg-slate-900 rounded-full h-3.5 overflow-hidden border border-white/10">
          <div class="bg-gradient-to-r ${color} h-full rounded-full" style="width:${v}%"></div>
        </div>
        <span class="text-xs font-extrabold text-amber-300 w-12 text-right">${v}%</span>
      </div>`;
    }).join("");
  }

  // ========================================================================
  // 8. VIMSHOTTARI DASHA ACCORDION TIMELINE (Expandable 9 Mahadashas)
  // ========================================================================
  function renderDashaTimeline(dashaTree, lang) {
    const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const mdItems = dashaTree.fullSeq.map((md, idx) => {
      const isActive = (md === dashaTree.mdActive);
      const borderClass = isActive ? "bg-amber-500/15 border-amber-400" : "bg-slate-900/60 border-white/10";
      const mdTitle = lang === "hi" ? `${PLANET_HI[md.lord]} महादशा (${md.lord})` : `${md.lord} Mahadasha`;

      const adRows = md.antardashas.map(ad => {
        const adActive = isActive && (ad === dashaTree.adActive);
        return `<div class="flex justify-between items-center text-xs py-1.5 px-2 rounded ${adActive ? 'bg-amber-500/25 text-amber-200 font-bold border border-amber-400/40' : 'text-gray-300 hover:bg-white/5'}">
          <span>${adActive ? '▸ ' : ''}${md.lord} – ${ad.lord} ${adActive ? (lang === 'hi' ? '(वर्तमान में सक्रिय)' : '(ACTIVE NOW)') : ''}</span>
          <span class="font-mono text-[11px]">${fmt(ad.start)} → ${fmt(ad.end)}</span>
        </div>`;
      }).join("");

      return `
        <details class="rounded-xl border ${borderClass} p-3.5 transition" ${isActive ? "open" : ""}>
          <summary class="flex flex-wrap justify-between items-center cursor-pointer list-none gap-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-chevron-right text-xs text-amber-400"></i>
              <span class="font-bold text-sm text-white">${mdTitle}</span>
              ${isActive ? `<span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">${lang === "hi" ? "सक्रिय महादशा" : "ACTIVE MD"}</span>` : ""}
            </div>
            <span class="text-xs font-mono text-purple-200">${fmt(md.start)} → ${fmt(md.end)}</span>
          </summary>
          <div class="mt-3 pt-2.5 border-t border-white/10 space-y-1">
            ${adRows}
          </div>
        </details>
      `;
    }).join("");

    return `<div class="space-y-2.5">${mdItems}</div>`;
  }

  // ========================================================================
  // 9. PUBLIC API
  // ========================================================================
  window.VedicChartAnalyzer = {
    analyze: function (birthChartResult, opts) {
      const chart = birthChartResult;
      const dasha = computeDashaTree(chart.Moon.longitude, chart.meta.birthUTC);
      const chalit = computeChalit(chart);
      const shadbala = computeShadbalaLite(chart);
      const d1SVG = renderD1NorthChart(chart, opts);
      const d9SVG = renderD9SouthChart(chart, opts);
      return { dasha, chalit, shadbala, d1SVG, d9SVG, chart };
    },
    renderD1NorthChart,
    renderD9SouthChart,
    renderChalitTable,
    renderShadbalaBars,
    renderDashaTimeline
  };
})();
