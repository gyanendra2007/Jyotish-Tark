/**
 * ============================================================================
 * VEDIC CHART ANALYZER — Engine 4
 * Consumes exact sidereal longitudes from birth-chart-calculator.js
 * Produces: D1 SVG chart, D9 SVG chart, Chalit (Bhava) chart, Shadbala-lite,
 *           Vimshottari Mahadasha+Antardasha with real calendar dates.
 * ============================================================================
 */

(function () {
  "use strict";

  const RASHI_NAMES_EN = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
  const RASHI_NAMES_HI = ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"];
  const NAKSHATRA_LORDS = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"]; // repeated 3x
  const VIMSHOTTARI_YEARS = { Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17 };
  const VIMSHOTTARI_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];

  const PLANET_SHORT = { Asc:"As", Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa", Rahu:"Ra", Ketu:"Ke" };

  // ========================================================================
  // 1. VIMSHOTTARI DASHAS — from exact Moon longitude
  // ========================================================================
  function computeDashaTree(moonSiderealLon, birthUTC) {
    const nakWidth = 360 / 27; // 13°20'
    const norm = ((moonSiderealLon % 360) + 360) % 360;
    const nakIdx = Math.floor(norm / nakWidth);
    const posInNak = norm % nakWidth;
    const fractionRemaining = 1 - (posInNak / nakWidth);

    const startLord = NAKSHATRA_LORDS[nakIdx % 9];
    const startIdx = VIMSHOTTARI_ORDER.indexOf(startLord);
    const startYears = VIMSHOTTARI_YEARS[startLord];
    const balanceYears = startYears * fractionRemaining;

    // 9 Mahadashas
    const mdSeq = [];
    let cursor = new Date(birthUTC.getTime());
    let firstDuration = balanceYears;

    for (let i = 0; i < 9; i++) {
      const lord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
      const years = (i === 0) ? firstDuration : VIMSHOTTARI_YEARS[lord];
      const end = new Date(cursor.getTime() + years * 365.25 * 86400000);

      // Compute 9 Antardashas inside
      const adSeq = [];
      let adCursor = new Date(cursor.getTime());
      const mdLordIdx = VIMSHOTTARI_ORDER.indexOf(lord);
      for (let j = 0; j < 9; j++) {
        const adLord = VIMSHOTTARI_ORDER[(mdLordIdx + j) % 9];
        const adYears = (years * VIMSHOTTARI_YEARS[adLord]) / 120;
        const adEnd = new Date(adCursor.getTime() + adYears * 365.25 * 86400000);
        adSeq.push({ lord: adLord, start: new Date(adCursor), end: adEnd });
        adCursor = adEnd;
      }

      mdSeq.push({ lord, start: new Date(cursor), end, years, antardashas: adSeq });
      cursor = end;
    }

    // Find currently active
    const now = new Date();
    let activeMD = mdSeq[0];
    for (const md of mdSeq) {
      if (now >= md.start && now <= md.end) { activeMD = md; break; }
    }
    let activeAD = activeMD.antardashas[0];
    for (const ad of activeMD.antardashas) {
      if (now >= ad.start && now <= ad.end) { activeAD = ad; break; }
    }

    return { mahadasha: activeMD.lord, antardasha: activeAD.lord, mdActive: activeMD, adActive: activeAD, fullSeq: mdSeq };
  }

  // ========================================================================
  // 2. CHALIT (Bhava Chalit) — Placidus cusps, reassign planets to bhavas
  // ========================================================================
  function computeChalit(chart) {
    // Equal-house cusp method (simplest and most widely used for Chalit)
    const ascLon = chart.Asc.longitude;
    const cusps = [];
    for (let h = 0; h < 12; h++) {
      cusps.push((ascLon + h * 30) % 360);
    }

    const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const chalit = {};

    planets.forEach(p => {
      const lon = chart[p].longitude;
      // Find which bhava the planet falls into
      for (let h = 0; h < 12; h++) {
        const start = cusps[h];
        const end = cusps[(h + 1) % 12];
        const inBhava = (start < end)
          ? (lon >= start && lon < end)
          : (lon >= start || lon < end);
        if (inBhava) {
          chalit[p] = { bhava: h + 1, rashiBhava: chart[p].rashi };
          break;
        }
      }
    });

    return { cusps, chalit };
  }

  // ========================================================================
  // 3. SHADBALA-LITE — Simplified planet strength score (0-100)
  // ========================================================================
  const DIGNITY_SCORE = { exalted: 100, own: 85, friendly: 65, neutral: 50, enemy: 30, debilitated: 10 };
  const OWN_SIGNS = { Sun:[5], Moon:[4], Mars:[1,8], Mercury:[3,6], Jupiter:[9,12], Venus:[2,7], Saturn:[10,11], Rahu:[11], Ketu:[8] };
  const EXALTED = { Sun:1, Moon:2, Mars:10, Mercury:6, Jupiter:4, Venus:12, Saturn:7, Rahu:2, Ketu:8 };
  const DEBILITATED = { Sun:7, Moon:8, Mars:4, Mercury:12, Jupiter:10, Venus:6, Saturn:1, Rahu:8, Ketu:2 };
  const FRIENDS = {
    Sun:["Moon","Mars","Jupiter"], Moon:["Sun","Mercury"], Mars:["Sun","Moon","Jupiter"],
    Mercury:["Sun","Venus"], Jupiter:["Sun","Moon","Mars"], Venus:["Mercury","Saturn"],
    Saturn:["Mercury","Venus"], Rahu:["Venus","Saturn","Mercury"], Ketu:["Mars","Jupiter"]
  };

  function computeShadbalaLite(chart) {
    const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const scores = {};
    const ascSign = chart.Asc.rashi;

    planets.forEach(p => {
      let score = 50; // neutral baseline

      // Dignity
      const rashi = chart[p].rashi;
      if (EXALTED[p] === rashi) score += 30;
      else if (DEBILITATED[p] === rashi) score -= 30;
      else if ((OWN_SIGNS[p] || []).includes(rashi)) score += 20;

      // Kendra placement (1, 4, 7, 10 from Lagna)
      const houseFromAsc = ((rashi - ascSign + 12) % 12) + 1;
      if ([1,4,7,10].includes(houseFromAsc)) score += 10;
      if ([5,9].includes(houseFromAsc)) score += 8;

      // Retrograde adds cheshta bala
      if (chart[p].retro && !["Rahu","Ketu"].includes(p)) score += 8;

      // Lagna lord bonus
      if ((RASHI_NAMES_EN[ascSign-1] === "Mesha" && p === "Mars") ||
          (RASHI_NAMES_EN[ascSign-1] === "Vrishabha" && p === "Venus") ||
          (RASHI_NAMES_EN[ascSign-1] === "Mithuna" && p === "Mercury") ||
          (RASHI_NAMES_EN[ascSign-1] === "Karka" && p === "Moon") ||
          (RASHI_NAMES_EN[ascSign-1] === "Simha" && p === "Sun") ||
          (RASHI_NAMES_EN[ascSign-1] === "Kanya" && p === "Mercury") ||
          (RASHI_NAMES_EN[ascSign-1] === "Tula" && p === "Venus") ||
          (RASHI_NAMES_EN[ascSign-1] === "Vrishchika" && p === "Mars") ||
          (RASHI_NAMES_EN[ascSign-1] === "Dhanu" && p === "Jupiter") ||
          (RASHI_NAMES_EN[ascSign-1] === "Makara" && p === "Saturn") ||
          (RASHI_NAMES_EN[ascSign-1] === "Kumbha" && p === "Saturn") ||
          (RASHI_NAMES_EN[ascSign-1] === "Meena" && p === "Jupiter")) {
        score += 5;
      }

      scores[p] = Math.max(5, Math.min(100, score));
    });

    return scores;
  }

  // ========================================================================
  // 4. D1 NORTH INDIAN SVG CHART
  // ========================================================================
  function renderD1NorthChart(chart, opts) {
    const lang = opts?.lang || "en";
    const userName = opts?.userName || "";
    const rashiNames = lang === "hi" ? RASHI_NAMES_HI : RASHI_NAMES_EN;
    const ascRashi = chart.Asc.rashi;
    const size = 520;

    // North Indian diamond layout: house 1 at top-center, moving counter-clockwise
    // Houses 1-12 are visual slots; each slot maps to a rashi by house# from ascendant
    const houseRashis = [];
    for (let h = 1; h <= 12; h++) {
      houseRashis[h] = ((ascRashi + h - 2) % 12) + 1;
    }

    // Planet positions grouped by house
    const planetsByHouse = {};
    const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    planets.forEach(p => {
      const rashi = chart[p].rashi;
      // Find house# from Ascendant
      const h = ((rashi - ascRashi + 12) % 12) + 1;
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push(p);
    });

    // North Indian diamond polygon coordinates (unit: 0-520)
    // Structure: 4 concentric diamonds, each split into 4-8 triangles
    const cx = size/2, cy = size/2;
    const R1 = size * 0.47;  // outer
    const R2 = size * 0.33;  // mid-outer
    const R3 = size * 0.18;  // mid-inner
    const R4 = size * 0.07;  // centre

    // 12 house positions with centers and small text offsets
    const houseLayout = [
      { h: 1,  x: cx,         y: cy - R2*1.15 },   // top-center
      { h: 2,  x: cx - R2*0.72, y: cy - R2*0.72 }, // top-left
      { h: 3,  x: cx - R2*1.15, y: cy },           // left-top
      { h: 4,  x: cx - R2*0.72, y: cy + R2*0.72 }, // left-bottom
      { h: 5,  x: cx - R2*0.4,  y: cy + R1*0.72 }, // bottom-left
      { h: 6,  x: cx - R2*0.18, y: cy + R1*0.9  }, // bottom-left-center
      { h: 7,  x: cx,           y: cy + R2*1.15 }, // bottom-center
      { h: 8,  x: cx + R2*0.18, y: cy + R1*0.9  }, // bottom-right-center
      { h: 9,  x: cx + R2*0.4,  y: cy + R1*0.72 }, // bottom-right
      { h: 10, x: cx + R2*0.72, y: cy + R2*0.72 }, // right-bottom
      { h: 11, x: cx + R2*1.15, y: cy },           // right-top
      { h: 12, x: cx + R2*0.72, y: cy - R2*0.72 }  // top-right
    ];

    const houseCells = houseLayout.map(({h, x, y}) => {
      const rashiId = houseRashis[h];
      const planetsHere = planetsByHouse[h] || [];
      const planetLines = planetsHere.map(p => {
        const degreeStr = chart[p].longitude ? Math.round(chart[p].longitude % 30) + "°" : "";
        const retroMark = chart[p].retro && !["Rahu","Ketu"].includes(p) ? " R" : "";
        return `${PLANET_SHORT[p]} ${degreeStr}${retroMark}`;
      });
      const rashiNumLabel = rashiId;
      return `
        <g>
          <text x="${x}" y="${y - 12}" font-size="9" fill="#7c3aed" text-anchor="middle" font-weight="600">${rashiNumLabel}</text>
          ${planetLines.map((line, i) =>
            `<text x="${x}" y="${y + 2 + i*13}" font-size="11" fill="#0f172a" text-anchor="middle" font-weight="700">${line}</text>`
          ).join("")}
        </g>
      `;
    }).join("");

    return `
      <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
        <defs>
          <linearGradient id="d1Border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7e22ce;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="d1Bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#faf5ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Outer border -->
        <rect x="5" y="5" width="${size-10}" height="${size-10}" fill="url(#d1Bg)" stroke="url(#d1Border)" stroke-width="3" rx="8"/>
        <!-- Diamond outline (rotated square) -->
        <polygon points="${cx},${cy-R1} ${cx+R1},${cy} ${cx},${cy+R1} ${cx-R1},${cy}" fill="none" stroke="#7e22ce" stroke-width="2"/>
        <!-- Inner diamond grid -->
        <line x1="${cx-R1}" y1="${cy}" x2="${cx}" y2="${cy-R1}" stroke="#a855f7" stroke-width="1.2"/>
        <line x1="${cx}" y1="${cy-R1}" x2="${cx+R1}" y2="${cy}" stroke="#a855f7" stroke-width="1.2"/>
        <line x1="${cx+R1}" y1="${cy}" x2="${cx}" y2="${cy+R1}" stroke="#a855f7" stroke-width="1.2"/>
        <line x1="${cx}" y1="${cy+R1}" x2="${cx-R1}" y2="${cy}" stroke="#a855f7" stroke-width="1.2"/>
        <line x1="${cx}" y1="${cy-R1}" x2="${cx}" y2="${cy+R1}" stroke="#c084fc" stroke-width="0.8" opacity="0.5"/>
        <line x1="${cx-R1}" y1="${cy}" x2="${cx+R1}" y2="${cy}" stroke="#c084fc" stroke-width="0.8" opacity="0.5"/>
        <!-- Inner diamond -->
        <polygon points="${cx},${cy-R2} ${cx+R2},${cy} ${cx},${cy+R2} ${cx-R2},${cy}" fill="none" stroke="#a855f7" stroke-width="1"/>
        <!-- Center small diamond -->
        <polygon points="${cx},${cy-R3} ${cx+R3},${cy} ${cx},${cy+R3} ${cx-R3},${cy}" fill="#fef9c3" stroke="#f59e0b" stroke-width="1.5"/>
        <!-- House numbers and planets -->
        ${houseCells}
        <!-- Logo watermark (top-left, outside diamond) -->
        <g opacity="0.75">
          <rect x="14" y="14" width="100" height="24" fill="#ffffff" stroke="#f59e0b" stroke-width="1" rx="4"/>
          <text x="18" y="31" font-size="10" fill="#7e22ce" font-weight="800" letter-spacing="1.2">JYOTISH TARK</text>
        </g>
        <!-- Chart label (top-right) -->
        <g>
          <text x="${size-16}" y="26" font-size="10" fill="#7e22ce" text-anchor="end" font-weight="700">D1 · Rashi (Lagna)</text>
          <text x="${size-16}" y="38" font-size="9" fill="#6b7280" text-anchor="end">${userName.substring(0,24)}</text>
        </g>
      </svg>
    `;
  }

  // ========================================================================
  // 5. D9 SOUTH INDIAN SVG CHART
  // ========================================================================
  function renderD9SouthChart(chart, opts) {
    const lang = opts?.lang || "en";
    const userName = opts?.userName || "";
    const size = 520;
    const cellSize = size / 4;

    // South Indian layout: fixed rashi positions (Mesha top-left of second row from top...)
    // Standard: 4x4 grid, outer 12 cells hold rashis in fixed clockwise order
    // Layout positions for rashi 1-12 (Mesha=1)
    const rashiPositions = {
      1:  { row: 0, col: 1 }, // Mesha
      2:  { row: 0, col: 2 }, // Vrishabha
      3:  { row: 1, col: 3 }, // Mithuna
      4:  { row: 2, col: 3 }, // Karka
      5:  { row: 3, col: 2 }, // Simha
      6:  { row: 3, col: 1 }, // Kanya
      7:  { row: 2, col: 0 }, // Tula
      8:  { row: 1, col: 0 }, // Vrishchika
      9:  { row: 0, col: 0 }, // Dhanu
      10: { row: 0, col: 0 }, // (placeholder — actually Pisces is bottom-left)
      // Wait — the standard South Indian chart layout:
      // row 0: 12(Meena) | 1(Mesha) | 2(Vrishabha) | 3(Mithuna)
      // row 1: 11(Kumbha) |   —      |   —        | 4(Karka)
      // row 2: 10(Makara) |   —      |   —        | 5(Simha)
      // row 3: 9(Dhanu)   | 8(Vrish.)| 7(Tula)    | 6(Kanya)
    };
    // Correct South Indian layout
    const layout = {
      12: { row: 0, col: 0 }, // Meena
      1:  { row: 0, col: 1 }, // Mesha
      2:  { row: 0, col: 2 }, // Vrishabha
      3:  { row: 0, col: 3 }, // Mithuna
      11: { row: 1, col: 0 }, // Kumbha
      4:  { row: 1, col: 3 }, // Karka
      10: { row: 2, col: 0 }, // Makara
      5:  { row: 2, col: 3 }, // Simha
      9:  { row: 3, col: 0 }, // Dhanu
      8:  { row: 3, col: 1 }, // Vrishchika
      7:  { row: 3, col: 2 }, // Tula
      6:  { row: 3, col: 3 }  // Kanya
    };

    // Group D9 planets by D9 rashi
    const d9PlanetsByRashi = {};
    const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    planets.forEach(p => {
      const d9Rashi = chart[p].d9;
      if (!d9PlanetsByRashi[d9Rashi]) d9PlanetsByRashi[d9Rashi] = [];
      d9PlanetsByRashi[d9Rashi].push(p);
    });
    const ascD9 = chart.Asc.d9;
    // Ascendant marker in D9 chart
    if (!d9PlanetsByRashi[ascD9]) d9PlanetsByRashi[ascD9] = [];
    d9PlanetsByRashi[ascD9].unshift("Asc");

    const cells = Object.keys(layout).map(rashiIdStr => {
      const rashiId = parseInt(rashiIdStr, 10);
      const { row, col } = layout[rashiId];
      const x = col * cellSize;
      const y = row * cellSize;
      const planetsHere = d9PlanetsByRashi[rashiId] || [];
      const label = `${rashiId}`;
      return `
        <g>
          <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${planetsHere.length ? '#fef9c3' : '#faf5ff'}" stroke="#a855f7" stroke-width="1"/>
          <text x="${x + 6}" y="${y + 14}" font-size="10" fill="#7c3aed" font-weight="600">${label}</text>
          ${planetsHere.map((p, i) =>
            `<text x="${x + cellSize/2}" y="${y + 34 + i*14}" font-size="12" fill="#0f172a" text-anchor="middle" font-weight="700">${PLANET_SHORT[p]}</text>`
          ).join("")}
        </g>
      `;
    }).join("");

    // Center blank area (2x2 middle grid)
    const centerBlank = `
      <rect x="${cellSize}" y="${cellSize}" width="${cellSize*2}" height="${cellSize*2}" fill="#f9fafb" stroke="#a855f7" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="${size/2}" y="${size/2 - 6}" font-size="14" fill="#7e22ce" text-anchor="middle" font-weight="800">D9</text>
      <text x="${size/2}" y="${size/2 + 12}" font-size="11" fill="#6b7280" text-anchor="middle">Navamsa</text>
      <text x="${size/2}" y="${size/2 + 28}" font-size="9" fill="#9ca3af" text-anchor="middle">${userName.substring(0,20)}</text>
    `;

    return `
      <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
        <defs>
          <linearGradient id="d9Border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7e22ce;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="${size-10}" height="${size-10}" fill="#ffffff" stroke="url(#d9Border)" stroke-width="3" rx="8"/>
        ${cells}
        ${centerBlank}
        <!-- Logo watermark top-left -->
        <g opacity="0.75">
          <rect x="14" y="14" width="100" height="24" fill="#ffffff" stroke="#f59e0b" stroke-width="1" rx="4"/>
          <text x="18" y="31" font-size="10" fill="#7e22ce" font-weight="800" letter-spacing="1.2">JYOTISH TARK</text>
        </g>
        <text x="${size-16}" y="26" font-size="10" fill="#7e22ce" text-anchor="end" font-weight="700">D9 · Navamsa</text>
      </svg>
    `;
  }

  // ========================================================================
  // 6. CHALIT TABLE
  // ========================================================================
  function renderChalitTable(chalit, lang) {
    const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const rows = planets.map(p => {
      const d = chalit.chalit[p] || {};
      return `<tr>
        <td class="py-2 px-3 font-bold text-white">${PLANET_SHORT[p]}</td>
        <td class="py-2 px-3 text-center text-amber-300">${d.bhava || "—"}</td>
        <td class="py-2 px-3 text-center text-gray-300">${d.rashiBhava || "—"}</td>
        <td class="py-2 px-3 text-center ${d.bhava === d.rashiBhava ? 'text-emerald-300' : 'text-rose-300'}">${d.bhava === d.rashiBhava ? (lang === "hi" ? "स्थिर" : "Stable") : (lang === "hi" ? "स्थानांतरित" : "Shifted")}</td>
      </tr>`;
    }).join("");

    return `
      <div class="overflow-x-auto rounded-xl border border-white/15">
        <table class="w-full text-xs md:text-sm">
          <thead class="bg-slate-950 text-amber-300">
            <tr>
              <th class="py-2 px-3 text-left">${lang === "hi" ? "ग्रह" : "Planet"}</th>
              <th class="py-2 px-3 text-center">${lang === "hi" ? "चलित भाव" : "Chalit Bhava"}</th>
              <th class="py-2 px-3 text-center">${lang === "hi" ? "राशि भाव" : "Rashi Bhava"}</th>
              <th class="py-2 px-3 text-center">${lang === "hi" ? "स्थिति" : "Status"}</th>
            </tr>
          </thead>
          <tbody class="bg-slate-900/60 divide-y divide-white/5">${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ========================================================================
  // 7. SHADBALA STRENGTH BARS
  // ========================================================================
  function renderShadbalaBars(scores, lang) {
    const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    return planets.map(p => {
      const v = scores[p] || 50;
      const color = v >= 75 ? "from-emerald-500 to-green-400"
                  : v >= 50 ? "from-amber-500 to-yellow-400"
                  : v >= 30 ? "from-orange-500 to-amber-400"
                  : "from-rose-500 to-red-400";
      return `<div class="flex items-center gap-3 mb-2">
        <span class="text-xs font-bold text-white w-8">${PLANET_SHORT[p]}</span>
        <div class="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
          <div class="bg-gradient-to-r ${color} h-full rounded-full" style="width:${v}%"></div>
        </div>
        <span class="text-xs font-bold text-amber-300 w-10 text-right">${v}%</span>
      </div>`;
    }).join("");
  }

  // ========================================================================
  // 8. DASHA TIMELINE
  // ========================================================================
  function renderDashaTimeline(dashaTree, lang) {
    const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const mdItems = dashaTree.fullSeq.map(md => {
      const isActive = md === dashaTree.mdActive;
      const bgClass = isActive ? "bg-amber-500/20 border-amber-400" : "bg-slate-900/60 border-white/10";
      const adRows = isActive ? md.antardashas.map(ad => {
        const adActive = ad === dashaTree.adActive;
        return `<div class="flex justify-between text-[11px] py-1 ${adActive ? 'text-amber-300 font-bold' : 'text-gray-400'}">
          <span>${adActive ? '▸ ' : ''}${ad.lord}</span>
          <span>${fmt(ad.start)} → ${fmt(ad.end)}</span>
        </div>`;
      }).join("") : "";
      return `<div class="p-3 rounded-lg border ${bgClass} mb-2">
        <div class="flex justify-between items-center mb-1">
          <span class="font-bold text-sm text-white">${md.lord} ${isActive ? '← ' + (lang === 'hi' ? 'सक्रिय' : 'ACTIVE') : ''}</span>
          <span class="text-[11px] text-gray-400">${fmt(md.start)} → ${fmt(md.end)}</span>
        </div>
        ${adRows}
      </div>`;
    }).join("");
    return `<div class="space-y-2 max-h-96 overflow-y-auto pr-2">${mdItems}</div>`;
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
    renderChalitTable,
    renderShadbalaBars,
    renderDashaTimeline
  };
})();
