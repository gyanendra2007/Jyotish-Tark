/* Jyotish Tark — extra calculations for the detailed KP Janm Kundali:
   panchang, avakahada, sign (rashi) chart houses, Vedic aspects, yogas, manglik check,
   Saturn sade sati periods and slow-planet transits. Uses astronomy-engine + kp-engine. */
(function () {
  "use strict";
  const norm = (x) => ((x % 360) + 360) % 360;
  const PL7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const SIGN_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const EXALT = { Sun: 1, Moon: 2, Mars: 10, Mercury: 6, Jupiter: 4, Venus: 12, Saturn: 7, Rahu: 2, Ketu: 8 };
  const DEBIL = { Sun: 7, Moon: 8, Mars: 4, Mercury: 12, Jupiter: 10, Venus: 6, Saturn: 1, Rahu: 8, Ketu: 2 };
  const OWN = { Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6], Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11], Rahu: [], Ketu: [] };
  const GANA = "DMRMDMDDRRMMDRDRDRRMMDRRMMD";
  const YONI = ["अश्व", "गज", "मेष", "सर्प", "सर्प", "श्वान", "मार्जार", "मेष", "मार्जार", "मूषक", "मूषक", "गौ", "महिष", "व्याघ्र", "महिष", "व्याघ्र", "मृग", "मृग", "श्वान", "वानर", "नकुल", "वानर", "सिंह", "अश्व", "सिंह", "गौ", "गज"];
  const YONI_EN = ["Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat", "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer", "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"];
  const NADI = "AMNNMAAMNNMAAMNNMAAMNNMAAMN";
  const SYL = [["चु", "चे", "चो", "ला"], ["ली", "लू", "ले", "लो"], ["अ", "ई", "उ", "ए"], ["ओ", "वा", "वी", "वू"], ["वे", "वो", "का", "की"], ["कु", "घ", "ङ", "छ"], ["के", "को", "हा", "ही"], ["हु", "हे", "हो", "डा"], ["डी", "डू", "डे", "डो"], ["मा", "मी", "मू", "मे"], ["मो", "टा", "टी", "टू"], ["टे", "टो", "पा", "पी"], ["पू", "ष", "ण", "ठ"], ["पे", "पो", "रा", "री"], ["रू", "रे", "रो", "ता"], ["ती", "तू", "ते", "तो"], ["ना", "नी", "नू", "ने"], ["नो", "या", "यी", "यू"], ["ये", "यो", "भा", "भी"], ["भू", "धा", "फा", "ढा"], ["भे", "भो", "जा", "जी"], ["खी", "खू", "खे", "खो"], ["गा", "गी", "गू", "गे"], ["गो", "सा", "सी", "सू"], ["से", "सो", "दा", "दी"], ["दू", "थ", "झ", "ञ"], ["दे", "दो", "चा", "ची"]];
  const SYL_EN = [["Chu", "Che", "Cho", "La"], ["Li", "Lu", "Le", "Lo"], ["A", "I", "U", "E"], ["O", "Va", "Vi", "Vu"], ["Ve", "Vo", "Ka", "Ki"], ["Ku", "Gha", "Na", "Chha"], ["Ke", "Ko", "Ha", "Hi"], ["Hu", "He", "Ho", "Da"], ["Di", "Du", "De", "Do"], ["Ma", "Mi", "Mu", "Me"], ["Mo", "Ta", "Ti", "Tu"], ["Te", "To", "Pa", "Pi"], ["Pu", "Sha", "Na", "Tha"], ["Pe", "Po", "Ra", "Ri"], ["Ru", "Re", "Ro", "Ta"], ["Ti", "Tu", "Te", "To"], ["Na", "Ni", "Nu", "Ne"], ["No", "Ya", "Yi", "Yu"], ["Ye", "Yo", "Bha", "Bhi"], ["Bhu", "Dha", "Pha", "Dha"], ["Bhe", "Bho", "Ja", "Ji"], ["Khi", "Khu", "Khe", "Kho"], ["Ga", "Gi", "Gu", "Ge"], ["Go", "Sa", "Si", "Su"], ["Se", "So", "Da", "Di"], ["Du", "Tha", "Jha", "Na"], ["De", "Do", "Cha", "Chi"]];
  const TITHI_H = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी"];
  const TITHI_E = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi"];
  const YOGA_H = ["विष्कुम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्मा", "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र", "सिद्धि", "व्यतीपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "ऐन्द्र", "वैधृति"];
  const YOGA_E = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const BAD_YOGA = [0, 5, 8, 9, 12, 14, 16, 18, 26];
  const KAR_H = ["बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि"], KAR_E = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
  const MASA_H = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"];
  const MASA_E = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];
  const VAR_H = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"], VAR_E = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const sgn = (lon) => Math.floor(norm(lon) / 30) + 1;
  const hFrom = (fromSign, sign) => ((sign - fromSign + 12) % 12) + 1;

  function bodyLon(body, date) {
    const A = window.Astronomy, ay = window.JTKP.kpAyanamsa(date);
    if (body === "Rahu") { const T = (date.getTime() / 864e5 + 2440587.5 - 2451545) / 36525; return norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T - ay); }
    return norm(A.Ecliptic(A.GeoVector(A.Body[body], date, true)).elon - ay);
  }

  // sign segments of a slow planet between two dates (step in days)
  function signSegments(body, from, to, step) {
    const segs = [];
    for (let t = from.getTime(); t <= to.getTime(); t += (step || 4) * 864e5) {
      const s = sgn(bodyLon(body, new Date(t)));
      const last = segs[segs.length - 1];
      if (!last || last.sign !== s) segs.push({ sign: s, start: new Date(t), end: new Date(t) }); else last.end = new Date(t);
    }
    return segs;
  }

  function sadeSati(moonSign, from, to) {
    const segs = signSegments("Saturn", from, to, 4);
    const rel = (s) => { const h = hFrom(moonSign, s); return h === 12 ? 1 : h === 1 ? 2 : h === 2 ? 3 : 0; };
    // group continuous stretches where Saturn is in 12th/1st/2nd from Moon
    const eps = []; let cur = null;
    segs.forEach((g) => {
      const ph = rel(g.sign);
      if (ph) {
        if (!cur || g.start - cur.end > 400 * 864e5) { cur = { start: g.start, end: g.end, phases: [] }; eps.push(cur); }
        cur.end = g.end;
        const lp = cur.phases[cur.phases.length - 1];
        if (lp && lp.ph === ph) lp.end = g.end; else cur.phases.push({ ph, sign: g.sign, start: g.start, end: g.end });
      } else if (cur && g.end - g.start > 400 * 864e5) cur = null;
    });
    // dhaiya (Saturn in 4th or 8th from Moon)
    const dh = segs.filter((g) => [4, 8].includes(hFrom(moonSign, g.sign)) && g.end - g.start > 60 * 864e5).map((g) => ({ h: hFrom(moonSign, g.sign), sign: g.sign, start: g.start, end: g.end }));
    return { episodes: eps, dhaiya: dh };
  }

  function sunriseSet(dateUTCmidnightLocal, lat, lng) {
    const A = window.Astronomy;
    try {
      const obs = new A.Observer(lat, lng, 0);
      const r = A.SearchRiseSet(A.Body.Sun, obs, +1, dateUTCmidnightLocal, 1.2), s = A.SearchRiseSet(A.Body.Sun, obs, -1, dateUTCmidnightLocal, 1.2);
      return { rise: r ? r.date : null, set: s ? s.date : null };
    } catch (e) { return { rise: null, set: null }; }
  }

  function compute(c, o) {
    const P = c.planets, birth = c.birthUTC, tzMin = (c.tz && c.tz.tzMinutes) || 330;
    const [by, bm, bd] = o.dob.split("-").map(Number);
    const localMid = new Date(Date.UTC(by, bm - 1, bd) - tzMin * 60000);
    const ss = sunriseSet(localMid, c.lat, c.lng);
    const localDow = new Date(Date.UTC(by, bm - 1, bd)).getUTCDay();
    const vaar = ss.rise && birth < ss.rise ? (localDow + 6) % 7 : localDow;

    // panchang
    const diff = norm(P.Moon.lon - P.Sun.lon);
    const tIdx = Math.floor(diff / 12), paksha = tIdx < 15 ? 0 : 1, tNum = tIdx % 15;
    const tithiH = tIdx === 14 ? "पूर्णिमा" : tIdx === 29 ? "अमावस्या" : `${paksha ? "कृष्ण" : "शुक्ल"} पक्ष ${TITHI_H[tNum]}`;
    const tithiE = tIdx === 14 ? "Purnima" : tIdx === 29 ? "Amavasya" : `${paksha ? "Krishna" : "Shukla"} ${TITHI_E[tNum]}`;
    const yIdx = Math.floor(norm(P.Sun.lon + P.Moon.lon) / (40 / 3));
    const k60 = Math.floor(diff / 6);
    const kar = k60 === 0 ? ["किंस्तुघ्न", "Kimstughna"] : k60 >= 57 ? [["शकुनि", "चतुष्पाद", "नाग"][k60 - 57], ["Shakuni", "Chatushpada", "Naga"][k60 - 57]] : [KAR_H[(k60 - 1) % 7], KAR_E[(k60 - 1) % 7]];
    // amanta month: sun sign at the previous new moon
    let masa = null;
    try {
      const A = window.Astronomy, nm = A.SearchMoonPhase(0, new Date(birth.getTime() - 31 * 864e5), 32);
      let t = nm ? nm.date : null;
      if (t && t > birth) t = null;
      if (t) { const nm2 = A.SearchMoonPhase(0, new Date(t.getTime() + 864e5), 32); if (nm2 && nm2.date <= birth) t = nm2.date; }
      if (t) masa = (sgn(bodyLon("Sun", t)) % 12); // Mesha sun at new moon -> Vaishakha(1); Meena -> Chaitra(0)
    } catch (e) { masa = null; }
    const vs = by + (masa != null && bm <= 4 && masa >= 9 ? 56 : 57);

    // avakahada
    const nk = P.Moon.nak, ms = P.Moon.sign;
    const varnaI = [1, 2, 3, 0][(ms - 1) % 4]; // 0 brahmin 1 kshatriya 2 vaishya 3 shudra
    const vashya = (() => { const d = P.Moon.deg; if ([1, 2].includes(ms)) return 0; if ([3, 6, 7, 11].includes(ms)) return 1; if ([4, 12].includes(ms)) return 2; if (ms === 5) return 3; if (ms === 8) return 4; if (ms === 9) return d < 15 ? 1 : 0; if (ms === 10) return d < 15 ? 0 : 2; return 1; })();
    const avak = {
      gana: GANA[nk - 1], yoni: [YONI[nk - 1], YONI_EN[nk - 1]], nadi: NADI[nk - 1], varna: varnaI, vashya, tatva: (ms - 1) % 4,
      syl: [SYL[nk - 1][P.Moon.pada - 1], SYL_EN[nk - 1][P.Moon.pada - 1]], sylAll: [SYL[nk - 1], SYL_EN[nk - 1]],
    };

    // sign-chart houses (from lagna sign), Vedic aspects
    const lagS = c.cusps[1].sign;
    const rh = {}; Object.keys(P).forEach((p) => (rh[p] = hFrom(lagS, P[p].sign)));
    const ASP = { Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10] };
    const aspectsOnSign = (sign) => PL7.filter((p) => (ASP[p] || [7]).some((a) => ((P[p].sign + a - 2) % 12) + 1 === sign));
    const aspectsOnPlanet = (q) => aspectsOnSign(P[q].sign).filter((p) => p !== q);
    const lordOfH = (h) => SIGN_LORD[(lagS + h - 2) % 12];
    const dign = (p) => (EXALT[p] === P[p].sign ? "ex" : DEBIL[p] === P[p].sign ? "deb" : (OWN[p] || []).includes(P[p].sign) ? "own" : "");
    const kendra = (h) => [1, 4, 7, 10].includes(h);

    // ---- yogas ----
    const Y = [];
    const add = (id, good, data) => Y.push({ id, good, data: data || {} });
    if (P.Sun.sign === P.Mercury.sign) add("budhaditya", true, { h: rh.Sun });
    if (kendra(hFrom(P.Moon.sign, P.Jupiter.sign))) add("gajakesari", true, { h: hFrom(P.Moon.sign, P.Jupiter.sign) });
    if (rh.Jupiter === 1) add("guruLagna", true);
    else if (kendra(rh.Jupiter)) add("guruKendra", true, { h: rh.Jupiter });
    const near = (k) => PL7.filter((p) => p !== "Moon" && p !== "Sun" && hFrom(P.Moon.sign, P[p].sign) === k);
    const s2 = near(2), s12 = near(12);
    if (s2.length && s12.length) add("durudhara", true, { a: s2, b: s12 });
    else if (s2.length) add("sunapha", true, { a: s2 });
    else if (s12.length) add("anapha", true, { a: s12 });
    const mmh = hFrom(P.Moon.sign, P.Mars.sign);
    if (mmh === 1 || mmh === 7) add("chandraMangal", true);
    const MP = { Mars: "ruchaka", Mercury: "bhadra", Jupiter: "hamsa", Venus: "malavya", Saturn: "shasha" };
    Object.keys(MP).forEach((p) => { if (kendra(rh[p]) && ["ex", "own"].includes(dign(p))) add(MP[p], true, { p, h: rh[p] }); });
    PL7.forEach((p) => {
      const d = dign(p);
      if (d === "ex" && !(MP[p] && kendra(rh[p]))) add("exalted", true, { p });
      if (d === "own" && !(MP[p] && kendra(rh[p]))) add("ownSign", true, { p });
      if (d === "deb") {
        const dl = SIGN_LORD[DEBIL[p] - 1], ex = Object.keys(EXALT).find((q) => EXALT[q] === DEBIL[p] && PL7.includes(q));
        const bh = kendra(rh[dl]) || kendra(hFrom(P.Moon.sign, P[dl].sign)) || (ex && kendra(rh[ex]));
        add(bh ? "neechaBhanga" : "debilitated", !!bh, { p });
      }
      if (P[p].star === p) add("ownStar", true, { p });
    });
    const l9 = lordOfH(9), l10 = lordOfH(10);
    if (l9 !== l10 && (P[l9].sign === P[l10].sign || (OWN[l9].includes(P[l10].sign) && OWN[l10].includes(P[l9].sign)))) add("dharmaKarma", true, { a: l9, b: l10 });
    const l2 = lordOfH(2), l11 = lordOfH(11);
    if (l2 !== l11 && P[l2].sign === P[l11].sign) add("dhana", true, { a: l2, b: l11 });
    if (aspectsOnPlanet("Moon").includes("Saturn") || P.Saturn.sign === P.Moon.sign) add("shaniChandra", false);
    if (BAD_YOGA.includes(yIdx)) add("nityaBad", false, { y: yIdx });
    // kaal sarp (all seven planets on one side of the Rahu–Ketu axis)
    const rl = P.Rahu.lon, side = PL7.map((p) => norm(P[p].lon - rl) < 180);
    if (side.every((x) => x) || side.every((x) => !x)) add("kaalSarp", false);

    // ---- manglik ----
    const MH = [1, 4, 7, 8, 12];
    const mFrom = { lagna: rh.Mars, moon: hFrom(P.Moon.sign, P.Mars.sign), venus: hFrom(P.Venus.sign, P.Mars.sign) };
    const mFlags = { lagna: MH.includes(mFrom.lagna), moon: MH.includes(mFrom.moon), venus: MH.includes(mFrom.venus) };
    const cancel = [];
    if (["ex", "own"].includes(dign("Mars"))) cancel.push("ownSign");
    if (aspectsOnPlanet("Mars").includes("Jupiter") || P.Jupiter.sign === P.Mars.sign) cancel.push("jupiterAspect");
    if (P.Mars.star === "Jupiter") cancel.push("jupiterStar");
    if (kendra(rh.Jupiter) || kendra(rh.Venus)) cancel.push("beneficKendra");
    const mCount = Object.values(mFlags).filter(Boolean).length;
    const manglik = { from: mFrom, flags: mFlags, count: mCount, cancel, level: !mFlags.lagna && !mFlags.moon ? (mFlags.venus ? "mild" : "none") : cancel.length >= 2 || mCount === 1 ? "mild" : "full" };

    return {
      panchang: { tithi: [tithiH, tithiE], paksha, tIdx, yoga: [YOGA_H[yIdx], YOGA_E[yIdx]], yIdx, karana: kar, vaar: [VAR_H[vaar], VAR_E[vaar]], vaarIdx: vaar, masa: masa != null ? [MASA_H[masa], MASA_E[masa]] : ["—", "—"], vs, rise: ss.rise, set: ss.set },
      avak, rh, aspectsOnSign, aspectsOnPlanet, lordOfH, dign, yogas: Y, manglik, lagS,
      sadeSati: (from, to) => sadeSati(P.Moon.sign, from, to), signSegments, bodyLon,
    };
  }

  window.JTKPX = { compute, SIGN_LORD, EXALT, DEBIL, OWN, YOGA_H, YOGA_E, sgn, hFrom };
})();
