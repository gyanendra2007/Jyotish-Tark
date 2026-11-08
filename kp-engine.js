/* Jyotish Tark — KP (Krishnamurti Paddhati) calculation engine.
   Uses the site's astronomy (birth-chart-calculator.js + astronomy-engine) for planet positions,
   then applies KP rules: Krishnamurti ayanamsa, Placidus house cusps, sign / star / sub / sub-sub lords,
   4-level significators, cuspal sub-lord promise, Vimshottari dasha and ruling planets.
   Checked against Swiss Ephemeris (SIDM_KRISHNAMURTI, Placidus). */
(function () {
  "use strict";
  const R = Math.PI / 180;
  const norm = (x) => ((x % 360) + 360) % 360;
  const PL = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const SEQ = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const YRS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
  const SIGN_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const NAK = 40 / 3;
  const YEAR_MS = 365.25 * 864e5;

  // Krishnamurti (new) ayanamsa — matches Swiss Ephemeris SIDM_KRISHNAMURTI to < 1".
  function kpAyanamsa(date) {
    const jd = date.getTime() / 864e5 + 2440587.5;
    const T = (jd - 2451545.0) / 36525;
    // value at J2000 + general precession in longitude (IAU 2006)
    return 23.76024 + (5028.796195 * T + 1.1054348 * T * T) / 3600;
  }

  function lords(lon) {
    lon = norm(lon);
    const sign = Math.floor(lon / 30);
    const n = Math.min(26, Math.floor(lon / NAK));
    let pos = lon - n * NAK, i = n % 9;
    const star = SEQ[i];
    let sub = star, subStart = 0, subSpan = NAK;
    for (let k = 0; k < 9; k++) {
      const p = SEQ[(i + k) % 9], span = (YRS[p] / 120) * NAK;
      if (pos < span || k === 8) { sub = p; subStart = n * NAK + (lon - n * NAK - pos); subSpan = span; i = (i + k) % 9; break; }
      pos -= span;
    }
    // sub-sub inside the sub
    let pos2 = pos, ss = sub;
    for (let k = 0; k < 9; k++) {
      const p = SEQ[(i + k) % 9], span = (YRS[p] / 120) * subSpan;
      if (pos2 < span || k === 8) { ss = p; break; }
      pos2 -= span;
    }
    return { sign: sign + 1, signLord: SIGN_LORD[sign], nak: n + 1, star, sub, subSub: ss, pada: Math.min(4, Math.floor((lon - n * NAK) / (NAK / 4)) + 1), deg: lon % 30 };
  }

  function sidereal(date) {
    const jd = date.getTime() / 864e5 + 2440587.5, T = (jd - 2451545.0) / 36525;
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
    return { jd, T, gmst: norm(gmst), eps: 23.4392911 - 0.0130042 * T };
  }

  // Placidus cusps (tropical). Returns array index 1..12.
  function placidus(date, lat, lng) {
    const { gmst, eps } = sidereal(date);
    const ramc = norm(gmst + lng), e = eps * R, phi = lat * R;
    const lonFromRA = (ra) => norm(Math.atan2(Math.sin(ra * R), Math.cos(ra * R) * Math.cos(e)) / R);
    const asc = norm(Math.atan2(Math.cos(ramc * R), -(Math.sin(ramc * R) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) / R);
    const mc = lonFromRA(ramc);
    function cusp(f, upper) {
      let ra = upper ? ramc + f * 90 : ramc + 180 - f * 90;
      for (let it = 0; it < 60; it++) {
        const lam = lonFromRA(ra), dec = Math.asin(Math.sin(e) * Math.sin(lam * R));
        const x = Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dec)));
        const dsa = Math.acos(x) / R;
        const nra = upper ? ramc + f * dsa : ramc + 180 - f * (180 - dsa);
        if (Math.abs(nra - ra) < 1e-8) { ra = nra; break; }
        ra = nra;
      }
      return lonFromRA(ra);
    }
    const c = [];
    c[1] = asc; c[10] = mc; c[11] = cusp(1 / 3, true); c[12] = cusp(2 / 3, true); c[2] = cusp(2 / 3, false); c[3] = cusp(1 / 3, false);
    c[4] = norm(mc + 180); c[7] = norm(asc + 180); c[5] = norm(c[11] + 180); c[6] = norm(c[12] + 180); c[8] = norm(c[2] + 180); c[9] = norm(c[3] + 180);
    return c;
  }

  function houseOf(lon, cusps) {
    for (let h = 1; h <= 12; h++) {
      const a = cusps[h], b = cusps[h === 12 ? 1 : h + 1], span = norm(b - a);
      if (norm(lon - a) < span) return h;
    }
    return 1;
  }

  function dashaTree(moonLon, birth) {
    const n = Math.floor(norm(moonLon) / NAK), frac = (norm(moonLon) - n * NAK) / NAK;
    let i = n % 9;
    let start = birth.getTime() - frac * YRS[SEQ[i]] * YEAR_MS;
    const md = [];
    for (let k = 0; k < 10; k++) {
      const L = SEQ[(i + k) % 9], len = YRS[L] * YEAR_MS, s = start;
      const ad = [];
      let as = s;
      for (let j = 0; j < 9; j++) {
        const A = SEQ[(i + k + j) % 9], alen = (len * YRS[A]) / 120;
        const pd = [];
        let ps = as;
        for (let q = 0; q < 9; q++) { const P = SEQ[(i + k + j + q) % 9], plen = (alen * YRS[P]) / 120; pd.push({ lord: P, start: new Date(ps), end: new Date(ps + plen) }); ps += plen; }
        ad.push({ lord: A, start: new Date(as), end: new Date(as + alen), pd });
        as += alen;
      }
      md.push({ lord: L, start: new Date(s), end: new Date(s + len), ad });
      start += len;
    }
    return { md, balance: { lord: SEQ[i], years: (1 - frac) * YRS[SEQ[i]] } };
  }

  function currentDasha(tree, when) {
    const t = when.getTime();
    for (const m of tree.md) if (t >= m.start && t < m.end) for (const a of m.ad) if (t >= a.start && t < a.end) for (const p of a.pd) if (t >= p.start && t < p.end) return { md: m, ad: a, pd: p };
    return null;
  }

  function utcFrom(dob, time, lat, lng, tzZone) {
    const [y, mo, d] = dob.split("-").map(Number), [hh, mm] = (time || "12:00").split(":").map(Number);
    const B = window.BirthChartCalculator;
    const tz = B && B.resolveHistoricalTzOffsetMinutes ? B.resolveHistoricalTzOffsetMinutes({ year: y, month: mo, day: d, hour: hh, minute: mm, lat, lng, tzZone, defaultTzMins: 330 }) : { tzMinutes: 330, tzLabel: "IST" };
    return { date: new Date(Date.UTC(y, mo - 1, d, hh, mm || 0, 0) - tz.tzMinutes * 60000), tz };
  }

  function positions(date) {
    const B = window.BirthChartCalculator;
    if (!B || !B._internal) throw new Error("engine not loaded");
    const r = B._internal.getTropicalLongitudesSpeedAndRetro(date, "mean");
    const ay = kpAyanamsa(date), out = {};
    PL.forEach((p) => { out[p] = { lon: norm(r.longitudes[p] - ay), retro: !!r.retro[p] }; });
    return { pos: out, ay };
  }

  function compute(o) {
    const lat = +o.lat, lng = +o.lng;
    const { date, tz } = utcFrom(o.dob, o.time, lat, lng, o.tzZone);
    const { pos, ay } = positions(date);
    const tc = placidus(date, lat, lng), cusps = [];
    for (let h = 1; h <= 12; h++) cusps[h] = norm(tc[h] - ay);

    const planets = {};
    PL.forEach((p) => { const L = lords(pos[p].lon); planets[p] = { name: p, lon: pos[p].lon, retro: pos[p].retro, house: houseOf(pos[p].lon, cusps), ...L }; });
    const cuspInfo = [];
    for (let h = 1; h <= 12; h++) cuspInfo[h] = { house: h, lon: cusps[h], ...lords(cusps[h]) };

    // ownership by cusp signs (KP): a planet owns the houses whose cusps fall in its signs
    const owns = {}; PL.forEach((p) => (owns[p] = []));
    for (let h = 1; h <= 12; h++) owns[cuspInfo[h].signLord].push(h);
    const occ = (p) => [planets[p].house];
    const isNode = (p) => p === "Rahu" || p === "Ketu";
    // houses signified by a planet "itself": occupancy + ownership (nodes: + sign lord's houses as agent)
    const own = {};
    PL.forEach((p) => {
      const s = new Set(occ(p).concat(owns[p]));
      if (isNode(p)) { const d = planets[p].signLord; occ(d).concat(owns[d]).forEach((h) => s.add(h)); }
      own[p] = s;
    });
    // full signification: star lord's houses (stronger) + own houses
    const sig = {};
    PL.forEach((p) => {
      const st = planets[p].star;
      sig[p] = { viaStar: [...own[st]].sort((a, b) => a - b), self: [...own[p]].sort((a, b) => a - b) };
      sig[p].all = [...new Set(sig[p].viaStar.concat(sig[p].self))].sort((a, b) => a - b);
    });

    // 4-level house significators
    const houseSig = [];
    for (let h = 1; h <= 12; h++) {
      const occupants = PL.filter((p) => planets[p].house === h);
      const owners = PL.filter((p) => owns[p].includes(h));
      const inStarOf = (list) => PL.filter((p) => list.includes(planets[p].star));
      houseSig[h] = { A: inStarOf(occupants), B: occupants, C: inStarOf(owners), D: owners };
    }

    const tree = dashaTree(planets.Moon.lon, date);
    return { input: o, birthUTC: date, tz, ayanamsa: ay, planets, cusps: cuspInfo, owns, sig, houseSig, dasha: tree, lat, lng };
  }

  // Ruling planets at a moment for a place
  function rulingPlanets(when, lat, lng) {
    const { pos } = positions(when);
    const ay = kpAyanamsa(when);
    const asc = norm(placidus(when, lat, lng)[1] - ay);
    const m = lords(pos.Moon.lon), a = lords(asc);
    const local = new Date(when.getTime() + 330 * 60000);
    const DAY = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    return { when, day: DAY[local.getUTCDay()], moonSign: m.signLord, moonStar: m.star, moonSub: m.sub, lagnaSign: a.signLord, lagnaStar: a.star, lagnaSub: a.sub, asc, moon: pos.Moon.lon };
  }

  window.JTKP = { compute, rulingPlanets, currentDasha, lords, placidus, kpAyanamsa, PL, SEQ, YRS, SIGN_LORD, NAK };
})();
