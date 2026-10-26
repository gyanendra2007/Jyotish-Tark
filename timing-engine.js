/**
 * ============================================================================
 * JYOTISH TARK — VIMSHOTTARI DASHA & DOUBLE-TRANSIT TIMING ENGINE
 * File: timing-engine.js • v1.0 (Pure Parashari Dasha + Gochara Engine)
 * ============================================================================
 */

(function () {
  "use strict";

  const RASHI_LORDS = [
    null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
  ];
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

  function evaluateAntardashaWindow(ad, chart, findings, domainCfg) {
    const ascRashi = chart.Asc.rashi || chart.Asc.d1;
    const targetSign = rashiOfHouse(ascRashi, domainCfg.primaryHouse);
    const targetLordKey = RASHI_LORDS[targetSign];
    const targetLordRashi = chart[targetLordKey].rashi || chart[targetLordKey].d1;

    const adPlanet = chart[ad.lord];
    const mdPlanet = chart[ad.mdLord];
    const adHouse = adPlanet.house || houseFrom(ascRashi, adPlanet.rashi || adPlanet.d1);
    const mdHouse = mdPlanet.house || houseFrom(ascRashi, mdPlanet.rashi || mdPlanet.d1);

    let score = 0;
    const reasonsEn = [];
    const reasonsHi = [];

    if (ad.lord === targetLordKey) {
      score += 35;
      reasonsEn.push(`Antardasha lord ${ad.lord} directly rules the ${domainCfg.primaryHouse}th house`);
      reasonsHi.push(`अंतर्दशानाथ ${ad.lord} स्वयं ${domainCfg.primaryHouse}वें भाव के स्वामी हैं`);
    } else if (domainCfg.houses.includes(adHouse)) {
      score += 28;
      reasonsEn.push(`Antardasha lord ${ad.lord} occupies House ${adHouse}`);
      reasonsHi.push(`अंतर्दशानाथ ${ad.lord} ${adHouse}वें भाव में स्थित हैं`);
    }

    const adOwnedHouses = [];
    for (let h = 1; h <= 12; h++) {
      if (RASHI_LORDS[rashiOfHouse(ascRashi, h)] === ad.lord) adOwnedHouses.push(h);
    }
    if (adOwnedHouses.some(h => domainCfg.houses.includes(h)) && ad.lord !== targetLordKey) {
      score += 20;
      reasonsEn.push(`${ad.lord} rules supporting House ${adOwnedHouses.join("/")}`);
      reasonsHi.push(`${ad.lord} सहायक भाव (${adOwnedHouses.join("/")}) के स्वामी हैं`);
    }

    if (doesPlanetAspectRashi(ad.lord, adPlanet.rashi || adPlanet.d1, targetSign)) {
      score += 15;
      reasonsEn.push(`${ad.lord} casts a direct Parashari aspect on the ${domainCfg.primaryHouse}th house`);
      reasonsHi.push(`${ad.lord} की सीधी दृष्टि ${domainCfg.primaryHouse}वें भाव पर है`);
    }

    if (domainCfg.karakas.includes(ad.lord)) {
      score += 12;
      reasonsEn.push(`${ad.lord} is the natural Karaka for ${domainCfg.nameEn}`);
      reasonsHi.push(`${ad.lord} ${domainCfg.nameHi} के नैसर्गिक कारक हैं`);
    }

    if (domainCfg.houses.includes(mdHouse) || (mdPlanet.rashi || mdPlanet.d1) === targetSign || ad.mdLord === targetLordKey) {
      score += 10;
    }

    const vargaRashi = adPlanet[domainCfg.vargaKey];
    if (vargaRashi && [1, 4, 5, 7, 9, 10, 11].includes(houseFrom(chart.Asc[domainCfg.vargaKey] || 1, vargaRashi))) {
      score += 12;
    }

    const midTimeMs = (ad.start.getTime() + ad.end.getTime()) / 2;
    const sampleDates = [
      new Date(ad.start.getTime() + 30 * 86400000),
      new Date(midTimeMs),
      new Date(ad.end.getTime() - 30 * 86400000)
    ];

    let jupTouches = false;
    let satTouches = false;
    sampleDates.forEach(dt => {
      const { jupiterRashi, saturnRashi } = getTransitJupiterAndSaturnRashi(dt);
      if (doesPlanetAspectRashi("Jupiter", jupiterRashi, targetSign) ||
          doesPlanetAspectRashi("Jupiter", jupiterRashi, targetLordRashi)) {
        jupTouches = true;
      }
      if (doesPlanetAspectRashi("Saturn", saturnRashi, targetSign) ||
          doesPlanetAspectRashi("Saturn", saturnRashi, targetLordRashi)) {
        satTouches = true;
      }
    });

    if (jupTouches && satTouches) {
      score += 28;
      reasonsEn.push(`Double Transit of Jupiter & Saturn activates the ${domainCfg.primaryHouse}th house/lord`);
      reasonsHi.push(`गोचर में गुरु और शनि का 'डबल ट्रांजिट' ${domainCfg.primaryHouse}वें भाव व उसके स्वामी को जागृत कर रहा है`);
    } else if (jupTouches) {
      score += 16;
      reasonsEn.push(`Transiting Jupiter aspects the ${domainCfg.primaryHouse}th axis`);
      reasonsHi.push(`गोचर के बृहस्पति ${domainCfg.primaryHouse}वें भाव पर शुभ दृष्टि डाल रहे हैं`);
    }

    const fmt = (d) => d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    const confidence = score >= 68 ? "HIGH" : (score >= 48 ? "MODERATE" : "LOW");

    return {
      mdLord: ad.mdLord,
      adLord: ad.lord,
      start: ad.start,
      end: ad.end,
      startYear: ad.start.getFullYear(),
      endYear: ad.end.getFullYear(),
      periodStr: `${fmt(ad.start)} – ${fmt(ad.end)}`,
      adLabel: `${ad.mdLord}–${ad.lord} (${fmt(ad.start)} – ${fmt(ad.end)})`,
      score,
      confidence,
      doubleTransitActive: jupTouches && satTouches,
      reasonsEn,
      reasonsHi
    };
  }

  function findDomainTimingWindows(chart, dashaTree, findings, birthYear) {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (!chart.isFullChartMode || !dashaTree || !Array.isArray(dashaTree.fullSeq)) {
      return {
        isDobOnly: true,
        career:     { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        marriage:   { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
        childbirth: { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" }
      };
    }

    const allAds = [];
    dashaTree.fullSeq.forEach(md => {
      (md.antardashas || []).forEach(ad => {
        if (ad.end >= now && ad.start.getFullYear() <= currentYear + 5) {
          allAds.push({
            ...ad,
            start: ad.start < now ? now : ad.start
          });
        }
      });
    });

    const configs = {
      career: {
        nameEn: "Career & Authority", nameHi: "करियर एवं पदोन्नति",
        primaryHouse: 10, houses: [10, 11, 6, 2, 1],
        karakas: ["Sun", "Saturn", "Mercury", "Jupiter"], vargaKey: "d10",
        minYear: currentYear
      },
      marriage: {
        nameEn: "Marriage & Partnership", nameHi: "विवाह एवं साझेदारी",
        primaryHouse: 7, houses: [7, 2, 11, 1],
        karakas: ["Venus", "Jupiter"], vargaKey: "d9",
        minYear: Math.max(currentYear, birthYear + 21)
      },
      childbirth: {
        nameEn: "Progeny & Childbirth", nameHi: "संतान प्राप्ति",
        primaryHouse: 5, houses: [5, 9, 11, 2],
        karakas: ["Jupiter", "Moon"], vargaKey: "d7",
        minYear: Math.max(currentYear, birthYear + 22)
      }
    };

    const pickTopWindows = (cfg) => {
      const candidates = allAds
        .filter(ad => ad.end.getFullYear() >= cfg.minYear)
        .map(ad => evaluateAntardashaWindow(ad, chart, findings, cfg))
        .filter(res => res.score >= 48)
        .sort((a, b) => b.score - a.score);

      if (candidates.length === 0) {
        return {
          hasStrongWindow: false,
          confidence: "NONE",
          primaryWindow: null,
          secondaryWindow: null,
          labelEn: "No strong window in immediate 36 months (Consolidation Phase)",
          labelHi: "आगामी 36 महीनों में कोई प्रबल दशा-गोचर खिड़की नहीं (समेकन चरण)"
        };
      }

      const primary = candidates[0];
      const secondary = candidates.find(c => c.adLabel !== primary.adLabel) || null;
      return {
        hasStrongWindow: true,
        confidence: primary.confidence,
        primaryWindow: primary,
        secondaryWindow: secondary,
        labelEn: `${primary.periodStr} (${primary.mdLord}–${primary.adLord} AD • ${primary.confidence} Confidence)`,
        labelHi: `${primary.periodStr} (${primary.mdLord}–${primary.adLord} अंतर्दशा • ${primary.confidence === "HIGH" ? "उच्च" : "मध्यम"} प्रबलता)`
      };
    };

    return {
      isDobOnly: false,
      career:     pickTopWindows(configs.career),
      marriage:   pickTopWindows(configs.marriage),
      childbirth: pickTopWindows(configs.childbirth)
    };
  }

  window.TimingEngine = {
    findDomainTimingWindows,
    evaluateAntardashaWindow,
    getTransitJupiterAndSaturnRashi
  };
})();
