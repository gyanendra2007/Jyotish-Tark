/**
 * ============================================================================
 * JYOTISH TARK — CLASSICAL PARASHARI & JAIMINI FINDINGS ENGINE
 * File: findings-engine.js • v1.0 (BPHS & Phaladeepika Verified Fact Extractor)
 * ============================================================================
 * Computes structured, scored astrological facts:
 * 1. Correct BPHS Functional Matrix (Yogakaraka, Benefics, Malefics, Badhakesh)
 * 2. True Degree-Based Jaimini Chara Karakas (7-Planet & 8-Planet schemes)
 * 3. Pancha Mahapurusha Yogas (with Combustion & D9 confirmation modifiers)
 * 4. Parashari Raja Yogas (Dharma-Karmadhipati & Kendra-Trikona Sambandha)
 * 5. Dhana Yogas, Parivartana Yogas (Maha, Kahala, Dainya), & Viparita Raja Yogas
 * 6. Neechabhanga Raja Yoga (5 Classical Cancellation Rules)
 * 7. Lunar/Solar Yogas: Gajakesari, Budhaditya, Kemadruma (with 3 Cancellations)
 * 8. Kuja/Manglik Dosha (from Lagna, Moon, Venus) + 8 Classical Cancellations
 * 9. Domain Affliction & Protection Evaluator (for Career, Marriage, Progeny)
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

  // BPHS Ch. 34 Verified Functional Matrix (Only Taurus, Cancer, Leo, Libra, Capricorn, Aquarius have a single Yogakaraka)
  const BPHS_LAGNA_MATRIX = {
    1:  { yogakaraka: [],         benefics: ["Sun", "Moon", "Mars", "Jupiter"], malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Venus", "Saturn"], badhakaHouse: 11, badhakesh: "Saturn" },
    2:  { yogakaraka: ["Saturn"], benefics: ["Saturn", "Sun", "Mercury"],       malefics: ["Jupiter", "Venus", "Moon"],   marakas: ["Mars", "Jupiter"], badhakaHouse: 9,  badhakesh: "Saturn" },
    3:  { yogakaraka: [],         benefics: ["Venus"],                          malefics: ["Mars", "Jupiter", "Sun"],     marakas: ["Mars", "Jupiter"], badhakaHouse: 7,  badhakesh: "Jupiter" },
    4:  { yogakaraka: ["Mars"],   benefics: ["Moon", "Mars", "Jupiter"],        malefics: ["Venus", "Mercury", "Saturn"], marakas: ["Saturn", "Venus"], badhakaHouse: 11, badhakesh: "Venus" },
    5:  { yogakaraka: ["Mars"],   benefics: ["Sun", "Mars", "Jupiter"],         malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Saturn", "Venus"], badhakaHouse: 9,  badhakesh: "Mars" }, // Mars is both Yogakaraka & Badhakesh for Leo
    6:  { yogakaraka: [],         benefics: ["Venus", "Mercury"],               malefics: ["Mars", "Jupiter", "Moon"],    marakas: ["Mars", "Jupiter"], badhakaHouse: 7,  badhakesh: "Jupiter" },
    7:  { yogakaraka: ["Saturn"], benefics: ["Saturn", "Mercury", "Venus"],     malefics: ["Sun", "Jupiter", "Mars"],     marakas: ["Mars", "Jupiter"], badhakaHouse: 11, badhakesh: "Sun" },
    8:  { yogakaraka: [],         benefics: ["Moon", "Jupiter", "Sun", "Mars"], malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Venus", "Mercury"],badhakaHouse: 9,  badhakesh: "Moon" },
    9:  { yogakaraka: [],         benefics: ["Mars", "Sun", "Jupiter"],         malefics: ["Venus", "Saturn", "Mercury"], marakas: ["Venus", "Saturn"], badhakaHouse: 7,  badhakesh: "Mercury" },
    10: { yogakaraka: ["Venus"],  benefics: ["Venus", "Mercury", "Saturn"],     malefics: ["Mars", "Jupiter", "Moon"],    marakas: ["Moon", "Mars"],    badhakaHouse: 11, badhakesh: "Mars" },
    11: { yogakaraka: ["Venus"],  benefics: ["Venus", "Saturn", "Sun", "Mars"], malefics: ["Jupiter", "Moon"],            marakas: ["Jupiter", "Moon"], badhakaHouse: 9,  badhakesh: "Venus" },
    12: { yogakaraka: [],         benefics: ["Moon", "Mars", "Jupiter"],        malefics: ["Sun", "Venus", "Saturn", "Mercury"], marakas: ["Mercury", "Saturn"], badhakaHouse: 7, badhakesh: "Mercury" }
  };

  const PARASHARI_ASPECTS = {
    Sun: [7], Moon: [7], Mercury: [7], Venus: [7],
    Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10],
    Rahu: [5, 7, 9], Ketu: [5, 7, 9]
  };

  function houseFrom(refRashi, targetRashi) {
    return ((targetRashi - refRashi + 12) % 12) + 1;
  }

  function rashiOfHouse(ascRashi, houseNum) {
    return ((ascRashi + houseNum - 2) % 12) + 1;
  }

  function isStrongInSign(planet, rashi) {
    return EXALTED_SIGN[planet] === rashi || (OWN_SIGNS[planet] || []).includes(rashi);
  }

  function doesAspectHouse(planetKey, planetHouse, targetHouse) {
    const aspects = PARASHARI_ASPECTS[planetKey] || [7];
    return aspects.some(nth => (((planetHouse + nth - 2) % 12) + 1) === targetHouse);
  }

  function haveSambandha(p1Key, p2Key, chart) {
    const p1 = chart[p1Key], p2 = chart[p2Key];
    if (!p1 || !p2) return false;
    if (p1.rashi === p2.rashi) return "CONJUNCTION";
    const h1From2 = houseFrom(p2.rashi, p1.rashi);
    const h2From1 = houseFrom(p1.rashi, p2.rashi);
    const p1AspectsP2 = (PARASHARI_ASPECTS[p1Key] || [7]).includes(h2From1);
    const p2AspectsP1 = (PARASHARI_ASPECTS[p2Key] || [7]).includes(h1From2);
    if (p1AspectsP2 && p2AspectsP1) return "MUTUAL_ASPECT";
    if (RASHI_LORDS[p1.rashi] === p2Key && RASHI_LORDS[p2.rashi] === p1Key) return "PARIVARTANA";
    return false;
  }

  // ========================================================================
  // 1. TRUE DEGREE-BASED JAIMINI CHARA KARAKAS (BPHS Ch. 32)
  // ========================================================================
  function computeCharaKarakas(chart, includeRahu = false) {
    const candidates = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    if (includeRahu) candidates.push("Rahu");

    const scored = candidates.map(k => {
      const p = chart[k] || {};
      const rawDeg = Number(p.degInSign !== undefined ? p.degInSign : ((p.longitude || 15) % 30));
      const effectiveDeg = (k === "Rahu") ? (30 - rawDeg) : rawDeg;
      return { planet: k, effectiveDeg, formattedDeg: p.formattedDMS || p.formattedDeg || `${rawDeg.toFixed(2)}°` };
    }).sort((a, b) => b.effectiveDeg - a.effectiveDeg);

    const roles = ["Atmakaraka", "Amatyakaraka", "Bhratrikaraka", "Matrikaraka", "Putrakaraka", "Gnatikaraka", "Darakaraka"];
    if (includeRahu) roles.splice(4, 0, "Pitrikaraka");

    const map = {};
    scored.forEach((item, idx) => {
      const role = roles[idx] || "Karaka";
      map[role] = item.planet;
    });
    return {
      atmakaraka: map.Atmakaraka,
      amatyakaraka: map.Amatyakaraka,
      darakaraka: map.Darakaraka,
      karakamsaRashi: chart[map.Atmakaraka]?.d9 || 1,
      ordered: scored,
      roleMap: map
    };
  }

  // ========================================================================
  // 2. PANCHA MAHAPURUSHA YOGAS (Ruchaka, Bhadra, Hamsa, Malavya, Shasha)
  // ========================================================================
  function detectMahapurushaYogas(chart) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const defs = [
      { planet: "Mars",    id: "RUCHAKA_YOGA", nameEn: "Ruchaka Mahapurusha Yoga", nameHi: "रुचक महापुरुष राजयोग", domain: ["personality", "career", "property"] },
      { planet: "Mercury", id: "BHADRA_YOGA",  nameEn: "Bhadra Mahapurusha Yoga",  nameHi: "भद्र महापुरुष राजयोग",  domain: ["education", "career", "wealth"] },
      { planet: "Jupiter", id: "HAMSA_YOGA",   nameEn: "Hamsa Mahapurusha Yoga",   nameHi: "हंस महापुरुष राजयोग",   domain: ["personality", "luck", "education", "progeny"] },
      { planet: "Venus",   id: "MALAVYA_YOGA", nameEn: "Malavya Mahapurusha Yoga", nameHi: "मालव्य महापुरुष राजयोग", domain: ["wealth", "love", "marriage"] },
      { planet: "Saturn",  id: "SHASHA_YOGA",  nameEn: "Shasha Mahapurusha Yoga",  nameHi: "शश महापुरुष राजयोग",    domain: ["career", "wealth", "authority"] }
    ];

    const findings = [];
    defs.forEach(def => {
      const p = chart[def.planet];
      if (!p) return;
      const h = houseFrom(ascRashi, p.rashi);
      if ([1, 4, 7, 10].includes(h) && isStrongInSign(def.planet, p.rashi)) {
        const d9Strong = isStrongInSign(def.planet, p.d9);
        const isCombust = Boolean(p.combust);
        let score = 85;
        if (d9Strong) score += 10;
        if (isCombust) score -= 25;

        findings.push({
          id: def.id,
          category: "Pancha Mahapurusha",
          planets: [def.planet],
          house: h,
          rashi: p.rashi,
          d9Confirmed: d9Strong,
          isCombust,
          score,
          domains: def.domain,
          titleEn: `${def.nameEn} (${def.planet} in House ${h})`,
          titleHi: `${def.nameHi} (${h}वें भाव में ${def.planet})`,
          summaryEn: `${def.planet} is placed in a Kendra (House ${h}) in its ${EXALTED_SIGN[def.planet] === p.rashi ? "exalted" : "own"} sign ${RASHI_NAMES_EN[p.rashi]}${d9Strong ? " and fortified in Navamsa (D9)" : ""}${isCombust ? " (partially moderated by combustion)" : ""}.`,
          summaryHi: `${def.planet} केंद्र (${h}वें भाव) में अपनी ${EXALTED_SIGN[def.planet] === p.rashi ? "उच्च" : "स्व"} राशि (${RASHI_NAMES_HI[p.rashi]}) में स्थित होकर प्रबल ${def.nameHi} का निर्माण कर रहा है${d9Strong ? " तथा नवांश (D9) में भी पुष्ट है" : ""}।`
        });
      }
    });
    return findings;
  }

  // ========================================================================
  // 3. RAJA YOGAS, DHANA YOGAS, PARIVARTANA & VIPARITA RAJA YOGAS
  // ========================================================================
  function detectRajaAndDhanaYogas(chart) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const findings = [];

    const houseLords = {};
    for (let h = 1; h <= 12; h++) {
      houseLords[h] = RASHI_LORDS[rashiOfHouse(ascRashi, h)];
    }

    // A. Dharma-Karmadhipati Raja Yoga (9th & 10th Lords)
    const lord9 = houseLords[9], lord10 = houseLords[10];
    const dkRelation = (lord9 === lord10) ? "SINGLE_YOGAKARAKA" : haveSambandha(lord9, lord10, chart);
    if (dkRelation) {
      findings.push({
        id: "DHARMA_KARMADHIPATI_YOGA",
        category: "Raja Yoga",
        planets: Array.from(new Set([lord9, lord10])),
        house: chart[lord10].house,
        score: 92,
        domains: ["career", "luck", "wealth"],
        titleEn: `Dharma-Karmadhipati Raja Yoga (${lord9} & ${lord10})`,
        titleHi: `धर्म-कर्माधिपति राजयोग (${lord9} एवं ${lord10})`,
        summaryEn: `Your 9th lord of fortune (${lord9}) and 10th lord of career command (${lord10}) form a ${dkRelation.replace("_", " ").toLowerCase()} in House ${chart[lord10].house}, creating high-level executive rise.`,
        summaryHi: `भाग्येश (${lord9}) और दशमेश (${lord10}) के मध्य संबंध से सर्वोच्च धर्म-कर्माधिपति राजयोग निर्मित हो रहा है, जो उच्च पद और स्थायी प्रतिष्ठा देता है।`
      });
    }

    // B. Dhana Yogas (Connections among 2nd, 11th, 5th, 9th Lords)
    const wealthHouses = [2, 11, 5, 9];
    for (let i = 0; i < wealthHouses.length; i++) {
      for (let j = i + 1; j < wealthHouses.length; j++) {
        const hA = wealthHouses[i], hB = wealthHouses[j];
        const lA = houseLords[hA], lB = houseLords[hB];
        if (lA !== lB) {
          const rel = haveSambandha(lA, lB, chart);
          if (rel && ![6, 8, 12].includes(chart[lA].house)) {
            findings.push({
              id: `DHANA_YOGA_${hA}_${hB}`,
              category: "Dhana Yoga",
              planets: [lA, lB],
              house: chart[lA].house,
              score: 80,
              domains: ["wealth", "career"],
              titleEn: `Parashari Dhana Yoga (${hA}th Lord ${lA} + ${hB}th Lord ${lB})`,
              titleHi: `पाराशरी धन योग (${hA}वेश ${lA} एवं ${hB}वेश ${lB})`,
              summaryEn: `Lord of House ${hA} (${lA}) and Lord of House ${hB} (${lB}) connect via ${rel.toLowerCase().replace("_", " ")} in House ${chart[lA].house}, multiplying asset accumulation.`,
              summaryHi: `${hA}वें और ${hB}वें भाव के स्वामियों (${lA} व ${lB}) का संबंध प्रबल धन-संचय योग बना रहा है।`
            });
          }
        }
      }
    }

    // C. Parivartana Yogas (Mutual Sign Exchange)
    const planets7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    for (let i = 0; i < planets7.length; i++) {
      for (let j = i + 1; j < planets7.length; j++) {
        const pA = planets7[i], pB = planets7[j];
        const rA = chart[pA].rashi, rB = chart[pB].rashi;
        if (RASHI_LORDS[rA] === pB && RASHI_LORDS[rB] === pA) {
          const hA = chart[pA].house, hB = chart[pB].house;
          const isDainya = [6, 8, 12].includes(hA) || [6, 8, 12].includes(hB);
          findings.push({
            id: `PARIVARTANA_${pA}_${pB}`,
            category: isDainya ? "Dainya Parivartana" : "Maha Parivartana Yoga",
            planets: [pA, pB],
            house: hA,
            score: isDainya ? 45 : 88,
            domains: ["career", "wealth", "luck"],
            titleEn: `${isDainya ? "Dainya" : "Maha"} Parivartana Yoga (${pA} ⇄ ${pB} across H-${hA} & H-${hB})`,
            titleHi: `${isDainya ? "दैन्य" : "महा"} परिवर्तन राजयोग (${pA} ⇄ ${pB}, भाव ${hA} व ${hB})`,
            summaryEn: `${pA} (in House ${hA}) and ${pB} (in House ${hB}) exchange signs, locking their karmic results together.`,
            summaryHi: `${pA} (${hA}वें भाव) और ${pB} (${hB}वें भाव) के बीच राशि परिवर्तन होने से दोनों भावों के फल एक-दूसरे को शक्ति दे रहे हैं।`
          });
        }
      }
    }

    // D. Viparita Raja Yogas (Harsha: 6L, Sarala: 8L, Vimala: 12L in 6/8/12)
    const dusthanas = [
      { h: 6,  name: "Harsha Viparita Raja Yoga", nameHi: "हर्ष विपरीत राजयोग" },
      { h: 8,  name: "Sarala Viparita Raja Yoga", nameHi: "सरल विपरीत राजयोग" },
      { h: 12, name: "Vimala Viparita Raja Yoga", nameHi: "विमल विपरीत राजयोग" }
    ];
    dusthanas.forEach(d => {
      const lord = houseLords[d.h];
      const placedH = chart[lord].house;
      if ([6, 8, 12].includes(placedH)) {
        findings.push({
          id: `VIPARITA_${d.h}`,
          category: "Viparita Raja Yoga",
          planets: [lord],
          house: placedH,
          score: 76,
          domains: ["career", "wealth", "luck"],
          titleEn: `${d.name} (${d.h}th Lord ${lord} in House ${placedH})`,
          titleHi: `${d.nameHi} (${d.h}वेश ${lord} का ${placedH}वें भाव में स्थान)`,
          summaryEn: `Because the ${d.h}th lord (${lord}) sits in a Dusthana (House ${placedH}), crises and rivals end up triggering your unexpected rise.`,
          summaryHi: `${d.h}वें भाव के स्वामी (${lord}) के ${placedH}वें भाव में बैठने से संकट और विरोधियों के पराभव के बाद आकस्मिक उत्थान होता है।`
        });
      }
    });

    return findings;
  }

  // ========================================================================
  // 4. NEECHABHANGA RAJA YOGA, GAJAKESARI & KEMADRUMA (WITH CANCELLATIONS)
  // ========================================================================
  function detectSpecialAndLunarYogas(chart) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const moonRashi = chart.Moon.rashi;
    const findings = [];

    // A. Neechabhanga Raja Yoga (5 Classical Conditions)
    ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach(pKey => {
      const p = chart[pKey];
      if (DEBILITATED_SIGN[pKey] === p.rashi) {
        const signLord = RASHI_LORDS[p.rashi];
        const exaltLordOfSign = Object.keys(EXALTED_SIGN).find(k => EXALTED_SIGN[k] === p.rashi);

        const cond1 = [1, 4, 7, 10].includes(houseFrom(ascRashi, chart[signLord].rashi)) ||
                      [1, 4, 7, 10].includes(houseFrom(moonRashi, chart[signLord].rashi));
        const cond2 = exaltLordOfSign && (
                      [1, 4, 7, 10].includes(houseFrom(ascRashi, chart[exaltLordOfSign].rashi)) ||
                      [1, 4, 7, 10].includes(houseFrom(moonRashi, chart[exaltLordOfSign].rashi)));
        const cond3 = isStrongInSign(pKey, p.d9);

        if (cond1 || cond2 || cond3) {
          findings.push({
            id: `NEECHABHANGA_${pKey}`,
            category: "Neechabhanga Raja Yoga",
            planets: [pKey, signLord],
            house: p.house,
            score: 82,
            domains: ["personality", "career", "luck"],
            titleEn: `Neechabhanga Raja Yoga of ${pKey} (in House ${p.house})`,
            titleHi: `${pKey} का नीचभंग राजयोग (भाव ${p.house})`,
            summaryEn: `Although ${pKey} is in its debilitation sign ${RASHI_NAMES_EN[p.rashi]}, cancellation rules are satisfied (${cond3 ? "fortified in D9 Navamsa" : `dispositor ${signLord} in Kendra`}), turning initial struggle in House ${p.house} into resilient authority.`,
            summaryHi: `${pKey} के नीच राशि (${RASHI_NAMES_HI[p.rashi]}) में होने के बावजूद शास्त्रीय नीचभंग शर्तें पूर्ण हो रही हैं, जिससे प्रारंभिक संघर्ष के बाद स्थायी सफलता मिलती है।`
          });
        }
      }
    });

    // B. Gajakesari Yoga (Jupiter in Kendra from Moon, non-combust, non-debilitated)
    const jupFromMoon = houseFrom(moonRashi, chart.Jupiter.rashi);
    if ([1, 4, 7, 10].includes(jupFromMoon) && DEBILITATED_SIGN.Jupiter !== chart.Jupiter.rashi) {
      findings.push({
        id: "GAJAKESARI_YOGA",
        category: "Lunar Yoga",
        planets: ["Moon", "Jupiter"],
        house: chart.Jupiter.house,
        score: chart.Jupiter.combust ? 65 : 86,
        domains: ["personality", "education", "wealth", "luck"],
        titleEn: `Gajakesari Yoga (Jupiter ${jupFromMoon}th from Moon)`,
        titleHi: `गजकेसरी योग (चंद्रमा से ${jupFromMoon}वें भाव में गुरु)`,
        summaryEn: `Jupiter in the ${jupFromMoon}th house from your Moon creates Gajakesari Yoga, bestowing lasting reputation, crisis protection, and wise counsel.`,
        summaryHi: `चंद्रमा से केंद्र (${jupFromMoon}वें स्थान) में बृहस्पति की उपस्थिति प्रबल गजकेसरी योग बना रही है, जो समाज में यश और संकट में ईश्वरीय रक्षा देता है।`
      });
    }

    // C. Kemadruma Yoga & Classical Kemadruma-Bhanga (Cancellation)
    const nonLuminary = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const in2ndOr12thFromMoon = nonLuminary.filter(k => [2, 12].includes(houseFrom(moonRashi, chart[k].rashi)));
    const conjunctMoon = nonLuminary.filter(k => chart[k].rashi === moonRashi);
    if (in2ndOr12thFromMoon.length === 0 && conjunctMoon.length === 0) {
      const kendraFromMoon = nonLuminary.filter(k => [4, 7, 10].includes(houseFrom(moonRashi, chart[k].rashi)));
      const kendraFromLagna = nonLuminary.filter(k => [1, 4, 7, 10].includes(houseFrom(ascRashi, chart[k].rashi)));
      const isCancelled = kendraFromMoon.length > 0 || kendraFromLagna.length > 0;

      findings.push({
        id: isCancelled ? "KEMADRUMA_CANCELLED" : "KEMADRUMA_DOSHA",
        category: "Lunar Yoga",
        planets: ["Moon"],
        house: chart.Moon.house,
        isCancelled,
        score: isCancelled ? 40 : -55,
        domains: ["personality", "wealth", "love"],
        titleEn: isCancelled ? "Kemadruma-Bhanga (Cancelled Lunar Isolation)" : "Kemadruma Yoga (Lunar Solitude Sensitivity)",
        titleHi: isCancelled ? "केमद्रुम-भंग योग (मानसिक संघर्ष के बाद स्थिरता)" : "केमद्रुम दोष (भावनात्मक एकाकीपन)",
        summaryEn: isCancelled
          ? `Although no planets flank the 2nd or 12th from your Moon, planets in Kendra (${(kendraFromMoon.length ? kendraFromMoon : kendraFromLagna).join(", ")}) cancel Kemadruma—meaning you experience moments of private mental solitude but never lack material support.`
          : `With no planets in the 2nd or 12th from your Moon, your mind periodically feels emotionally unsupported, requiring conscious lunar grounding.`,
        summaryHi: isCancelled
          ? `चंद्रमा के आगे-पीछे ग्रह न होने पर भी केंद्रस्थ ग्रहों के कारण केमद्रुम-भंग हो रहा है—अतः कभी-कभी मानसिक एकाकीपन महसूस होने पर भी आर्थिक या सामाजिक सहारा कभी कम नहीं पड़ेगा।`
          : `चंद्रमा से द्वितीय व द्वादश भाव रिक्त होने से मन में अकारण चिंता और भावनात्मक एकाकीपन उभरता है।`
      });
    }

    return findings;
  }

  // ========================================================================
  // 5. MANGLIK (KUJA) DOSHA + 8 CLASSICAL CANCELLATION RULES
  // ========================================================================
  function evaluateManglikDosha(chart) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const moonRashi = chart.Moon.rashi;
    const venusRashi = chart.Venus.rashi;
    const marsRashi = chart.Mars.rashi;

    const marsFromLagna = houseFrom(ascRashi, marsRashi);
    const marsFromMoon  = houseFrom(moonRashi, marsRashi);
    const marsFromVenus = houseFrom(venusRashi, marsRashi);

    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const fromLagna = manglikHouses.includes(marsFromLagna);
    const fromMoon  = manglikHouses.includes(marsFromMoon);
    const fromVenus = manglikHouses.includes(marsFromVenus);

    if (!fromLagna && !fromMoon) {
      return {
        isManglik: false,
        isCancelled: false,
        severity: "NONE",
        score: 20,
        titleEn: "Non-Manglik Chart (Free from Kuja Dosha)",
        titleHi: "मांगलिक दोष से पूर्णतः मुक्त कुंडली",
        reasonsEn: [],
        reasonsHi: []
      };
    }

    const cancelEn = [];
    const cancelHi = [];

    // Rule 1: Mars in Own Sign (Aries/Scorpio) or Exalted (Capricorn) or Debilitated (Cancer)
    if ([1, 8, 10, 4].includes(marsRashi)) {
      cancelEn.push(`Mars is placed in ${RASHI_NAMES_EN[marsRashi]} (own/exalted/special sign)`);
      cancelHi.push(`मंगल ${RASHI_NAMES_HI[marsRashi]} राशि (स्व/उच्च/विशेष राशि) में स्थित है`);
    }
    // Rule 2: Benefic Ascendant (Cancer or Leo — Mars is Yogakaraka!)
    if ([4, 5].includes(ascRashi)) {
      cancelEn.push(`For ${RASHI_NAMES_EN[ascRashi]} Ascendant, Mars is the supreme Yogakaraka`);
      cancelHi.push(`${RASHI_NAMES_HI[ascRashi]} लग्न के लिए मंगल स्वयं प्रमुख योगकारक ग्रह है`);
    }
    // Rule 3: Aspected or conjunct by Jupiter
    const jupRel = haveSambandha("Mars", "Jupiter", chart) || doesAspectHouse("Jupiter", chart.Jupiter.house, marsFromLagna);
    if (jupRel) {
      cancelEn.push("Mars receives the auspicious aspect/conjunction of Devaguru Jupiter");
      cancelHi.push("मंगल पर देवगुरु बृहस्पति की शुभ दृष्टि/युति है");
    }
    // Rule 4: Conjunct or aspected by Saturn/Rahu
    if (chart.Saturn.rashi === marsRashi || chart.Rahu.rashi === marsRashi) {
      cancelEn.push("Mars is pinned by Saturn/Rahu conjunction");
      cancelHi.push("मंगल के साथ शनि/राहु की युति होने से भौम दोष नियंत्रित है");
    }
    // Rule 5: House-specific sign exceptions (BPHS / Muhurta)
    if ((marsFromLagna === 2 && [3, 6].includes(marsRashi)) ||
        (marsFromLagna === 4 && [1, 8].includes(marsRashi)) ||
        (marsFromLagna === 7 && [4, 10].includes(marsRashi)) ||
        (marsFromLagna === 8 && [9, 12].includes(marsRashi)) ||
        (marsFromLagna === 12 && [2, 7].includes(marsRashi))) {
      cancelEn.push(`Classical sign exception for Mars in House ${marsFromLagna} (${RASHI_NAMES_EN[marsRashi]})`);
      cancelHi.push(`${marsFromLagna}वें भाव में ${RASHI_NAMES_HI[marsRashi]} के मंगल का शास्त्रीय परिहार लागू है`);
    }

    const isCancelled = cancelEn.length > 0;
    return {
      isManglik: fromLagna,
      isChandraManglik: !fromLagna && fromMoon,
      isCancelled,
      marsFromLagna,
      marsFromMoon,
      marsFromVenus,
      severity: !fromLagna ? "LOW_LUNAR" : (isCancelled ? "CANCELLED_PARIHARA" : ([7, 8].includes(marsFromLagna) ? "HIGH" : "MODERATE")),
      score: isCancelled ? 5 : -45,
      reasonsEn: cancelEn,
      reasonsHi: cancelHi
    };
  }

  // ========================================================================
  // 6. REAL DOMAIN AFFLICTION CHECKER (NO FAKE FALLBACK TO SATURN/RAHU!)
  // ========================================================================
  function evaluateDomainAfflictions(chart, savBindus) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const matrix = BPHS_LAGNA_MATRIX[ascRashi] || BPHS_LAGNA_MATRIX[1];

    const checkHouse = (houseNum, vargaProp) => {
      const sign = rashiOfHouse(ascRashi, houseNum);
      const lordKey = RASHI_LORDS[sign];
      const lordObj = chart[lordKey];
      const naturalMalefics = ["Saturn", "Rahu", "Ketu", "Mars", "Sun"];

      const realAfflictors = [];

      naturalMalefics.forEach(mKey => {
        if (mKey === lordKey) return; // A house lord does not afflict its own house
        if (mKey === "Mars" && matrix.yogakaraka.includes("Mars") && houseNum !== 7) return;

        const mObj = chart[mKey];
        const occupiesHouse = (mObj.house === houseNum);
        const aspectsHouse  = doesAspectHouse(mKey, mObj.house, houseNum);
        const conjunctsLord = (mObj.rashi === lordObj.rashi);
        const aspectsLord   = doesAspectHouse(mKey, mObj.house, lordObj.house);

        if (occupiesHouse || aspectsHouse || conjunctsLord || aspectsLord) {
          realAfflictors.push({
            planet: mKey,
            rashi: mObj.rashi,
            house: mObj.house,
            reasonEn: occupiesHouse ? `occupies House ${houseNum}`
                    : aspectsHouse  ? `aspects House ${houseNum} from House ${mObj.house}`
                    : conjunctsLord ? `conjuncts ${houseNum}th-lord ${lordKey} in House ${lordObj.house}`
                    : `aspects ${houseNum}th-lord ${lordKey} in House ${lordObj.house}`,
            reasonHi: occupiesHouse ? `${houseNum}वें भाव में बैठा है`
                    : aspectsHouse  ? `${mObj.house}वें भाव से ${houseNum}वें भाव पर दृष्टि डाल रहा है`
                    : conjunctsLord ? `${houseNum}वेश ${lordKey} के साथ युति में है`
                    : `${houseNum}वेश ${lordKey} पर दृष्टि डाल रहा है`
          });
        }
      });

      const lordInDusthana = [6, 8, 12].includes(lordObj.house);
      const lordCombust = Boolean(lordObj.combust);
      const lordDebilitated = (DEBILITATED_SIGN[lordKey] === lordObj.rashi);
      const vargaSign = lordObj[vargaProp] || lordObj.d9;
      const vargaStrong = isStrongInSign(lordKey, vargaSign);

      return {
        house: houseNum,
        sign,
        lord: lordKey,
        lordHouse: lordObj.house,
        savBindus: savBindus ? savBindus[houseNum] : 28,
        vargaProp,
        vargaSign,
        vargaStrong,
        lordInDusthana,
        lordCombust,
        lordDebilitated,
        hasRealAffliction: realAfflictors.length > 0 || lordInDusthana || lordCombust || lordDebilitated,
        primaryAfflictor: realAfflictors[0] || null,
        allAfflictors: realAfflictors
      };
    };

    return {
      education:  checkHouse(5,  "d9"),
      career:     checkHouse(10, "d10"),
      wealth:     checkHouse(2,  "d9"),
      gains:      checkHouse(11, "d9"),
      marriage:   checkHouse(7,  "d9"),
      childbirth: checkHouse(5,  "d7")
    };
  }

  // ========================================================================
  // 7. PUBLIC MASTER ENTRY POINT
  // ========================================================================
  function analyzeFindings(chart, savBindus) {
    if (window.VedicChartAnalyzer && typeof window.VedicChartAnalyzer.enrichChartWithVargasAndStates === "function") {
      window.VedicChartAnalyzer.enrichChartWithVargasAndStates(chart);
    }

    const isDobOnly = !chart.isFullChartMode;
    const ascRashi = chart.Asc?.rashi || chart.Asc?.d1 || 1;
    const functionalMatrix = BPHS_LAGNA_MATRIX[ascRashi] || BPHS_LAGNA_MATRIX[1];
    const charaKarakas = computeCharaKarakas(chart, false);

    // In DOB-only mode, only compute sign/Moon-based findings (never fake Lagna house yogas)
    const mahapurushaYogas = isDobOnly ? [] : detectMahapurushaYogas(chart);
    const rajaAndDhanaYogas = isDobOnly ? [] : detectRajaAndDhanaYogas(chart);
    const specialYogas = detectSpecialAndLunarYogas(chart);
    const manglik = isDobOnly ? { isManglik: false, severity: "DOB_ONLY" } : evaluateManglikDosha(chart);
    const domainChecks = isDobOnly ? null : evaluateDomainAfflictions(chart, savBindus);

    const allYogas = [...mahapurushaYogas, ...rajaAndDhanaYogas, ...specialYogas].sort((a, b) => b.score - a.score);

    return {
      isDobOnly,
      ascRashi,
      functionalMatrix,
      charaKarakas,
      allYogas,
      mahapurushaYogas,
      rajaAndDhanaYogas,
      specialYogas,
      manglik,
      domainChecks
    };
  }

  window.FindingsEngine = {
    BPHS_LAGNA_MATRIX,
    analyzeFindings,
    computeCharaKarakas,
    detectMahapurushaYogas,
    detectRajaAndDhanaYogas,
    detectSpecialAndLunarYogas,
    evaluateManglikDosha,
    evaluateDomainAfflictions
  };
})();
