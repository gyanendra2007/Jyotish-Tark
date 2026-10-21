/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js • v6.0 (Dual-Mode Edition)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Two modes:
 *  1. Numerology mode — 8-chapter reading from Name + DOB + Chaldean + Mulank/Bhagyank
 *  2. Vedic mode — 12-chapter full precision (Lagna, D1/D9, Dasha, Ashtakavarga)
 * Mode is set by form: window.__jtMode = "numerology" | "vedic"
 * Vedic data injected via: window.__jtVedicData = { chart, dasha, chalit, shadbala, d1SVG, d9SVG }
 * ============================================================================
 */

(function () {
  "use strict";

  window.__jtMode = window.__jtMode || "numerology";
  window.__jtVedicData = window.__jtVedicData || null;

  // ==========================================================================
  // 1. CORE DATABASES
  // ==========================================================================
  const CHALDEAN_MAP = {
    A:1, I:1, J:1, Q:1, Y:1, B:2, K:2, R:2, C:3, G:3, L:3, S:3,
    D:4, M:4, T:4, E:5, H:5, N:5, X:5, U:6, V:6, W:6, O:7, Z:7, F:8, P:8
  };

  const RASHI_DATA = {
    1:{id:1,en:"Mesha (Aries)",hi:"मेष",lord:"Mars",lordHi:"मंगल",element:"Fire",quality:"Movable",direction:"East",directionHi:"पूर्व",temperamentEn:"independent, pioneering, action-driven",temperamentHi:"स्वतंत्र, अग्रणी, कर्मठ",bodyBuildEn:"athletic build, sharp features, intense gaze",bodyBuildHi:"ऊर्जावान शरीर, तेज आंखें"},
    2:{id:2,en:"Vrishabha (Taurus)",hi:"वृषभ",lord:"Venus",lordHi:"शुक्र",element:"Earth",quality:"Fixed",direction:"South",directionHi:"दक्षिण",temperamentEn:"grounded, loyal, patient, pleasure-loving",temperamentHi:"स्थिर, वफादार, धैर्यवान",bodyBuildEn:"graceful features, expressive eyes, magnetic presence",bodyBuildHi:"सौम्य चेहरा, आकर्षक आंखें"},
    3:{id:3,en:"Mithuna (Gemini)",hi:"मिथुन",lord:"Mercury",lordHi:"बुध",element:"Air",quality:"Dual",direction:"West",directionHi:"पश्चिम",temperamentEn:"intelligent, adaptable, curious, witty",temperamentHi:"तीव्र बुद्धि, वाक्पटु, जिज्ञासु",bodyBuildEn:"youthful appearance, sparkling eyes, expressive hands",bodyBuildHi:"युवा चेहरा, चंचल आंखें"},
    4:{id:4,en:"Karka (Cancer)",hi:"कर्क",lord:"Moon",lordHi:"चंद्रमा",element:"Water",quality:"Movable",direction:"North",directionHi:"उत्तर",temperamentEn:"intuitive, nurturing, protective, sensitive",temperamentHi:"संवेदनशील, अंतर्ज्ञानी, रक्षात्मक",bodyBuildEn:"soft complexion, soulful eyes, gentle presence",bodyBuildHi:"सौम्य आभा, भावुक आंखें"},
    5:{id:5,en:"Simha (Leo)",hi:"सिंह",lord:"Sun",lordHi:"सूर्य",element:"Fire",quality:"Fixed",direction:"East",directionHi:"पूर्व",temperamentEn:"regal, generous, proud, commanding",temperamentHi:"स्वाभिमानी, उदार, नेतृत्वकारी",bodyBuildEn:"commanding posture, broad forehead, radiant aura",bodyBuildHi:"रौबदार व्यक्तित्व, तेजस्वी माथा"},
    6:{id:6,en:"Kanya (Virgo)",hi:"कन्या",lord:"Mercury",lordHi:"बुध",element:"Earth",quality:"Dual",direction:"South",directionHi:"दक्षिण",temperamentEn:"analytical, perfectionist, practical, observant",temperamentHi:"विश्लेषक, पूर्णतावादी, तार्किक",bodyBuildEn:"neat refined features, intelligent eyes, poised",bodyBuildHi:"सुव्यवस्थित व्यक्तित्व, तीक्ष्ण आंखें"},
    7:{id:7,en:"Tula (Libra)",hi:"तुला",lord:"Venus",lordHi:"शुक्र",element:"Air",quality:"Movable",direction:"West",directionHi:"पश्चिम",temperamentEn:"diplomatic, charming, just, aesthetic",temperamentHi:"न्यायप्रिय, आकर्षक, सौंदर्य-प्रेमी",bodyBuildEn:"proportionate features, warm smile, graceful",bodyBuildHi:"आकर्षक चेहरा, मोहक मुस्कान"},
    8:{id:8,en:"Vrishchika (Scorpio)",hi:"वृश्चिक",lord:"Mars",lordHi:"मंगल",element:"Water",quality:"Fixed",direction:"North",directionHi:"उत्तर",temperamentEn:"intense, investigative, transformative",temperamentHi:"गूढ़, रहस्यमयी, गहन शोधी",bodyBuildEn:"hypnotic eyes, magnetic aura, strong jawline",bodyBuildHi:"चुंबकीय आंखें, रहस्यमयी आभा"},
    9:{id:9,en:"Dhanu (Sagittarius)",hi:"धनु",lord:"Jupiter",lordHi:"गुरु",element:"Fire",quality:"Dual",direction:"East",directionHi:"पूर्व",temperamentEn:"philosophical, truth-seeking, dharmic, visionary",temperamentHi:"सत्यवादी, दूरदर्शी, धर्मी",bodyBuildEn:"tall frame, bright forehead, optimistic",bodyBuildHi:"तेजस्वी ललाट, प्रभावशाली कद"},
    10:{id:10,en:"Makara (Capricorn)",hi:"मकर",lord:"Saturn",lordHi:"शनि",element:"Earth",quality:"Movable",direction:"South",directionHi:"दक्षिण",temperamentEn:"strategic, disciplined, self-made, relentless",temperamentHi:"कर्मप्रधान, रणनीतिकार, धैर्यवान",bodyBuildEn:"defined bone structure, composed, mature",bodyBuildHi:"परिपक्व व्यक्तित्व, गहरी आंखें"},
    11:{id:11,en:"Kumbha (Aquarius)",hi:"कुंभ",lord:"Saturn",lordHi:"शनि",element:"Air",quality:"Fixed",direction:"West",directionHi:"पश्चिम",temperamentEn:"unconventional, humanitarian, futuristic",temperamentHi:"लीक से हटकर, दार्शनिक, जनकल्याणकारी",bodyBuildEn:"distinctive features, visionary gaze, intellectual",bodyBuildHi:"बुद्धिजीवी आभा, विचारशील आंखें"},
    12:{id:12,en:"Meena (Pisces)",hi:"मीन",lord:"Jupiter",lordHi:"गुरु",element:"Water",quality:"Dual",direction:"North",directionHi:"उत्तर",temperamentEn:"spiritual, empathetic, imaginative, intuitive",temperamentHi:"आध्यात्मिक, परोपकारी, कल्पनाशील",bodyBuildEn:"dreamy eyes, serene aura, soothing voice",bodyBuildHi:"शांत आंखें, दिव्य आभा"}
  };

  const NAKSHATRA_DATA = {
    1:{name:"Ashwini (अश्विनी)",ruler:"Ketu",traitEn:"rapid healing, pioneering speed",traitHi:"तीव्र निर्णय, आरोग्य शक्ति"},
    2:{name:"Bharani (भरणी)",ruler:"Venus",traitEn:"creative intensity, fearless truth",traitHi:"गहन सृजन शक्ति, सत्य निष्ठा"},
    3:{name:"Krittika (कृत्तिका)",ruler:"Sun",traitEn:"razor-sharp discernment, protective fire",traitHi:"अग्नि जैसा तेज, स्पष्टवादिता"},
    4:{name:"Rohini (रोहिणी)",ruler:"Moon",traitEn:"magnetic charm, wealth creation",traitHi:"अद्भुत आकर्षण, धन-संपदा"},
    5:{name:"Mrigashira (मृगशिरा)",ruler:"Mars",traitEn:"intellectual quest, research",traitHi:"ज्ञान की खोज, शोध प्रवृत्ति"},
    6:{name:"Ardra (आर्द्रा)",ruler:"Rahu",traitEn:"storm-to-clarity genius",traitHi:"संघर्ष के बाद सफलता"},
    7:{name:"Punarvasu (पुनर्वसु)",ruler:"Jupiter",traitEn:"divine bounce-back, renewal",traitHi:"संकट से वापसी की शक्ति"},
    8:{name:"Pushya (पुष्य)",ruler:"Saturn",traitEn:"nourishment, dharmic discipline",traitHi:"धर्म, अनुशासन, राजयोग"},
    9:{name:"Ashlesha (आश्लेषा)",ruler:"Mercury",traitEn:"psychological insight, strategic",traitHi:"मन पढ़ने की शक्ति, कूटनीति"},
    10:{name:"Magha (मघा)",ruler:"Ketu",traitEn:"royal ancestral authority",traitHi:"पितृ कृपा, राजसी स्वाभिमान"},
    11:{name:"Purva Phalguni (पूर्वा फाल्गुनी)",ruler:"Venus",traitEn:"charismatic warmth, creativity",traitHi:"सौभाग्य, कलात्मक आकर्षण"},
    12:{name:"Uttara Phalguni (उत्तरा फाल्गुनी)",ruler:"Sun",traitEn:"committed partnerships, sovereignty",traitHi:"वचनबद्धता, स्व-अर्जित प्रतिष्ठा"},
    13:{name:"Hasta (हस्त)",ruler:"Moon",traitEn:"manifestation through skill",traitHi:"कर्म-कौशल, भाग्य निर्माण"},
    14:{name:"Chitra (चित्रा)",ruler:"Mars",traitEn:"architectural perfection",traitHi:"सृजन कौशल, सौंदर्य बोध"},
    15:{name:"Swati (स्वाती)",ruler:"Rahu",traitEn:"independence, business diplomacy",traitHi:"स्वतंत्रता, व्यापारिक चतुरता"},
    16:{name:"Vishakha (विशाखा)",ruler:"Jupiter",traitEn:"single-pointed ambition, conquest",traitHi:"लक्ष्य पर एकाग्र, विजय"},
    17:{name:"Anuradha (अनुराधा)",ruler:"Saturn",traitEn:"lotus-in-mud resilience",traitHi:"कठिन परिस्थिति में खिलना"},
    18:{name:"Jyeshtha (ज्येष्ठा)",ruler:"Mercury",traitEn:"protective seniority, crisis command",traitHi:"संकटमोचक नेतृत्व, गूढ़ विद्या"},
    19:{name:"Mula (मूल)",ruler:"Ketu",traitEn:"root-truth extraction, rebuilding",traitHi:"जड़ तक पहुंचने की शक्ति"},
    20:{name:"Purva Ashadha (पूर्वाषाढ़ा)",ruler:"Venus",traitEn:"invincible conviction",traitHi:"अजेय आत्मविश्वास"},
    21:{name:"Uttara Ashadha (उत्तराषाढ़ा)",ruler:"Sun",traitEn:"permanent victory, peak authority",traitHi:"स्थायी विजय, अजेय सफलता"},
    22:{name:"Shravana (श्रवण)",ruler:"Moon",traitEn:"master listening, scholarship",traitHi:"श्रवण शक्ति, उच्च विद्या"},
    23:{name:"Dhanishta (धनिष्ठा)",ruler:"Mars",traitEn:"impeccable timing, wealth rhythm",traitHi:"धन संचय, सटीक समय"},
    24:{name:"Shatabhisha (शतभिषा)",ruler:"Rahu",traitEn:"hundred-healer diagnostic power",traitHi:"सूक्ष्म निदान, स्वतंत्र चिंतन"},
    25:{name:"Purva Bhadrapada (पूर्वा भाद्रपद)",ruler:"Jupiter",traitEn:"transformational fire, spiritual wealth",traitHi:"आध्यात्मिक तेज, असाधारण धन"},
    26:{name:"Uttara Bhadrapada (उत्तरा भाद्रपद)",ruler:"Saturn",traitEn:"ocean-floor stability, legacy",traitHi:"गहरा धैर्य, स्थायी विरासत"},
    27:{name:"Revati (रेवती)",ruler:"Mercury",traitEn:"compassionate soul, safe passage",traitHi:"करुणा, सौभाग्यशाली यात्रा"}
  };

  const PLANET_META = {
    Sun:{en:"Sun",hi:"सूर्य",karakaEn:"Soul, authority, father, dignity",karakaHi:"आत्मा, स्वाभिमान, पिता",exalted:1,debilitated:7,own:[5],aspects:[7]},
    Moon:{en:"Moon",hi:"चंद्रमा",karakaEn:"Mind, emotions, mother, intuition",karakaHi:"मन, भावनाएं, माता",exalted:2,debilitated:8,own:[4],aspects:[7]},
    Mars:{en:"Mars",hi:"मंगल",karakaEn:"Courage, willpower, land, siblings",karakaHi:"साहस, भूमि-संपत्ति, भाई",exalted:10,debilitated:4,own:[1,8],aspects:[4,7,8]},
    Mercury:{en:"Mercury",hi:"बुध",karakaEn:"Intellect, speech, trade, logic",karakaHi:"बुद्धि, वाणी, व्यापार",exalted:6,debilitated:12,own:[3,6],aspects:[7]},
    Jupiter:{en:"Jupiter",hi:"गुरु",karakaEn:"Wisdom, wealth, dharma, children",karakaHi:"ज्ञान, भाग्य, संतान",exalted:4,debilitated:10,own:[9,12],aspects:[5,7,9]},
    Venus:{en:"Venus",hi:"शुक्र",karakaEn:"Love, beauty, spouse, luxury",karakaHi:"प्रेम, वैवाहिक सुख, वैभव",exalted:12,debilitated:6,own:[2,7],aspects:[7]},
    Saturn:{en:"Saturn",hi:"शनि",karakaEn:"Karma, discipline, longevity",karakaHi:"कर्मफल, न्याय, दीर्घायु",exalted:7,debilitated:1,own:[10,11],aspects:[3,7,10]},
    Rahu:{en:"Rahu",hi:"राहु",karakaEn:"Ambition, foreign, illusion",karakaHi:"महत्वाकांक्षा, विदेश, माया",exalted:2,debilitated:8,own:[11],aspects:[5,7,9]},
    Ketu:{en:"Ketu",hi:"केतु",karakaEn:"Detachment, occult, spiritual",karakaHi:"वैराग्य, गूढ़ विद्या, मोक्ष",exalted:8,debilitated:2,own:[8],aspects:[5,7,9]}
  };

  const BHAVA_MEANINGS = {
    1:{en:"1st House — self, body, brain, life direction",hi:"प्रथम भाव — व्यक्तित्व, शरीर, आत्मबल"},
    2:{en:"2nd House — wealth, speech, family",hi:"द्वितीय भाव — धन, वाणी, कुटुंब"},
    3:{en:"3rd House — courage, siblings, communication",hi:"तृतीय भाव — साहस, भाई-बहन, संवाद"},
    4:{en:"4th House — mother, home, peace",hi:"चतुर्थ भाव — माता, घर, शांति"},
    5:{en:"5th House — intelligence, children, romance",hi:"पंचम भाव — बुद्धि, संतान, प्रेम"},
    6:{en:"6th House — competition, debt, disease",hi:"षष्ठ भाव — प्रतियोगिता, ऋण, रोग"},
    7:{en:"7th House — spouse, marriage, partnership",hi:"सप्तम भाव — जीवनसाथी, विवाह"},
    8:{en:"8th House — transformation, secrets, longevity",hi:"अष्टम भाव — परिवर्तन, रहस्य, आयु"},
    9:{en:"9th House — fortune, dharma, guru",hi:"नवम भाव — भाग्य, धर्म, गुरु"},
    10:{en:"10th House — career, status, command",hi:"दशम भाव — करियर, सत्ता, पद"},
    11:{en:"11th House — gains, networks, wishes",hi:"एकादश भाव — लाभ, नेटवर्क, इच्छा"},
    12:{en:"12th House — foreign, sleep, moksha",hi:"द्वादश भाव — विदेश, निद्रा, मोक्ष"}
  };

  const MULANK_ARCHETYPES = {
    1:{ruler:"Sun (सूर्य)",psychEn:"Governed by Number 1, you carry an innate refusal to be second-best. Outsiders see your composure, but few realize the silent pressure you put on yourself to stay self-reliant.",psychHi:"मूलांक 1 से आपकी आत्मा में जन्मजात नेतृत्व है। लोग बाहर से आपको मजबूत समझते हैं, पर भीतर आप अकेले सब सुलझाने का भारी दबाव झेलते हैं।"},
    2:{ruler:"Moon (चंद्रमा)",psychEn:"Governed by Number 2, your mind acts like a high-frequency emotional radar. You sense people's true intentions within seconds, but you also overthink small shifts in their tone.",psychHi:"मूलांक 2 से आपका मन संवेदनशील रडार जैसा है। कुछ ही पलों में आप असली नीयत भांप लेते हैं, पर छोटे बदलाव को रात तक सोचते हैं।"},
    3:{ruler:"Jupiter (गुरु)",psychEn:"Ruled by Number 3, you possess a rare combination of knowledge-hunger and ethical pride. People come to you for advice, yet when you need counsel, few match your maturity.",psychHi:"मूलांक 3 से ज्ञान, स्वाभिमान और महत्वाकांक्षा का संगम है। संकट में लोग आपसे सलाह लेते हैं, पर आपके स्तर का साथी कम मिलता है।"},
    4:{ruler:"Rahu (राहु)",psychEn:"Governed by Number 4, your life never follows a straight line. You question outdated rules and often feel misunderstood by family. Sudden breakthroughs are your signature.",psychHi:"मूलांक 4 से आपका जीवन सीधी लकीर पर नहीं चलता। आपकी सोच रूढ़ियों से आगे होती है, और सफलता हमेशा अचानक आती है।"},
    5:{ruler:"Mercury (बुध)",psychEn:"Ruled by Number 5, your brain processes logic at lightning speed. Even after major setbacks, you bounce back quickly. Inwardly, your nervous system rarely switches off.",psychHi:"मूलांक 5 से आपका मस्तिष्क बिजली की गति से गणना करता है। बड़ी असफलता के बाद भी आप तुरंत संभलते हैं, पर दिमाग रात को भी शांत नहीं होता।"},
    6:{ruler:"Venus (शुक्र)",psychEn:"Governed by Number 6, you carry natural magnetism, aesthetic refinement, and deep family devotion. Your hidden vulnerability is sacrificing yourself for others' peace.",psychHi:"मूलांक 6 से स्वाभाविक आकर्षण, कलात्मकता और अपनों के प्रति समर्पण है। सबसे बड़ी कमजोरी—रिश्तों की गरिमा के लिए खुद का सुकून दांव पर लगा देना।"},
    7:{ruler:"Ketu (केतु)",psychEn:"Ruled by Number 7, you are an old soul. Your prophetic intuition—dreams and gut feelings—comes true weeks later. You feel detached even in a crowd.",psychHi:"मूलांक 7 से आपकी अंतरात्मा गहरी है। सिक्स्थ सेंस इतना प्रबल है कि भविष्य का आभास पहले हो जाता है। भीड़ में भी भीतर एकांत महसूस होता है।"},
    8:{ruler:"Saturn (शनि)",psychEn:"Governed by Number 8, you are forged in the fire of real-world experience. Nothing comes on a silver platter. People misread your composure as coldness, but you carry the deepest duty toward those you love.",psychHi:"मूलांक 8 से आपका जीवन संघर्ष की भट्टी में तपकर कुंदन बनता है। लोग बाहर से कठोर समझते हैं, पर भीतर आप अत्यंत न्यायप्रिय और जिम्मेदार हैं।"},
    9:{ruler:"Mars (मंगल)",psychEn:"Ruled by Number 9, your bloodstream runs on courage and protective fire. Your exterior is armor-tough, but internally you have a surprisingly soft heart that gets wounded by betrayal.",psychHi:"मूलांक 9 से अदम्य साहस और स्पष्टवादिता है। बाहर से सख्त दिखते हैं, पर भीतर भावुक हैं और विश्वासघात से गहरा आघात महसूस करते हैं।"}
  };

  const VIMSHOTTARI_ORDER = [
    {lord:"Ketu",years:7,hi:"केतु"},{lord:"Venus",years:20,hi:"शुक्र"},{lord:"Sun",years:6,hi:"सूर्य"},
    {lord:"Moon",years:10,hi:"चंद्र"},{lord:"Mars",years:7,hi:"मंगल"},{lord:"Rahu",years:18,hi:"राहु"},
    {lord:"Jupiter",years:16,hi:"गुरु"},{lord:"Saturn",years:19,hi:"शनि"},{lord:"Mercury",years:17,hi:"बुध"}
  ];

  const ASHTAKAVARGA_RULES = {
    Sun:{Sun:[1,2,4,7,8,9,10,11],Moon:[3,6,10,11],Mars:[1,2,4,7,8,9,10,11],Mercury:[3,5,6,9,10,11,12],Jupiter:[5,6,9,11],Venus:[6,7,12],Saturn:[1,2,4,7,8,9,10,11],Asc:[3,4,6,10,11,12]},
    Moon:{Sun:[3,6,7,8,10,11],Moon:[1,3,6,7,10,11],Mars:[2,3,5,6,9,10,11],Mercury:[1,3,4,5,7,8,10,11],Jupiter:[1,4,7,8,10,11,12],Venus:[3,4,5,7,9,10,11],Saturn:[3,5,6,11],Asc:[3,6,10,11]},
    Mars:{Sun:[3,5,6,10,11],Moon:[3,6,11],Mars:[1,2,4,7,8,10,11],Mercury:[3,5,6,11],Jupiter:[6,10,11,12],Venus:[6,8,11,12],Saturn:[1,4,7,8,9,10,11],Asc:[1,3,6,10,11]},
    Mercury:{Sun:[5,6,9,11,12],Moon:[2,4,6,8,10,11],Mars:[1,2,4,7,8,9,10,11],Mercury:[1,3,5,6,9,10,11,12],Jupiter:[6,8,11,12],Venus:[1,2,3,4,5,8,9,11],Saturn:[1,2,4,7,8,9,10,11],Asc:[1,2,4,6,8,10,11]},
    Jupiter:{Sun:[1,2,3,4,7,8,9,10,11],Moon:[2,5,7,9,11],Mars:[1,2,4,7,8,10,11],Mercury:[1,2,4,5,6,9,10,11],Jupiter:[1,2,3,4,7,8,10,11],Venus:[2,5,6,9,10,11],Saturn:[3,5,6,12],Asc:[1,2,4,5,6,7,9,10,11]},
    Venus:{Sun:[8,11,12],Moon:[1,2,3,4,5,8,9,11,12],Mars:[3,5,6,9,11,12],Mercury:[3,5,6,9,11],Jupiter:[5,8,9,10,11],Venus:[1,2,3,4,5,8,9,10,11],Saturn:[3,4,5,8,9,10,11],Asc:[1,2,3,4,5,8,9,11]},
    Saturn:{Sun:[1,2,4,7,8,10,11],Moon:[3,6,11],Mars:[3,5,6,10,11,12],Mercury:[6,8,9,10,11,12],Jupiter:[5,6,11,12],Venus:[6,11,12],Saturn:[3,5,6,11],Asc:[1,3,4,6,10,11]}
  };

  // ==========================================================================
  // 2. MATH HELPERS
  // ==========================================================================
  function reduceToSingleDigit(num) {
    let n = Math.abs(parseInt(num, 10) || 0);
    while (n > 9) n = String(n).split("").reduce((a, d) => a + parseInt(d, 10), 0);
    return n === 0 ? 1 : n;
  }

  function calculateChaldeanName(fullName) {
    const clean = (fullName || "Seeker").toUpperCase().replace(/[^A-Z]/g, "");
    let compound = 0;
    const breakdown = [];
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      const val = CHALDEAN_MAP[ch] || 1;
      compound += val;
      breakdown.push(`${ch}(${val})`);
    }
    if (compound === 0) compound = 14;
    return { compound, single: reduceToSingleDigit(compound), breakdown: breakdown.slice(0, 14).join(" + ") + (breakdown.length > 14 ? " ..." : "") };
  }

  function calculateNumerologyFromDob(dobStr) {
    const parts = (dobStr || "1998-01-24").split("-");
    const year = parseInt(parts[0], 10) || 1998;
    const month = parseInt(parts[1], 10) || 1;
    const day = parseInt(parts[2], 10) || 24;
    const mulank = reduceToSingleDigit(day);
    const allDigits = `${parts[0]}${parts[1]}${parts[2]}`.replace(/\D/g, "");
    const rawSum = allDigits.split("").reduce((a, b) => a + parseInt(b, 10), 0);
    const bhagyank = reduceToSingleDigit(rawSum);
    const now = new Date();
    let age = now.getFullYear() - year;
    const mDiff = (now.getMonth() + 1) - month;
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < day)) age--;
    age = Math.max(1, age);
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(day + month + reduceToSingleDigit(currentYear));
    return { year, month, day, mulank, bhagyank, rawSum, age, currentYear, personalYear };
  }

  function getBhavaFrom(ref, target) { return ((target - ref + 12) % 12) + 1; }
  function getRashiOfBhava(ref, h) { return ((ref + h - 2) % 12) + 1; }
  function getLordKeyOfRashi(r) { return RASHI_DATA[r].lord; }

  const VALID_NAKS_FOR_RASHI = {
    1:[1,2,3],2:[3,4,5],3:[5,6,7],4:[7,8,9],5:[10,11,12],6:[12,13,14],
    7:[14,15,16],8:[16,17,18],9:[19,20,21],10:[21,22,23],11:[23,24,25],12:[25,26,27]
  };

  // ==========================================================================
  // 3. VEDIC ANALYSIS
  // ==========================================================================
  function evaluatePlanetDignity(k, pData) {
    const meta = PLANET_META[k];
    const isVargottama = pData.d1 === pData.d9;
    const isExaltedD1 = pData.d1 === meta.exalted;
    const isDebilitatedD1 = pData.d1 === meta.debilitated;
    const isOwnD1 = meta.own.includes(pData.d1);
    const isExaltedD9 = pData.d9 === meta.exalted;
    const isDebilitatedD9 = pData.d9 === meta.debilitated;
    const isOwnD9 = meta.own.includes(pData.d9);
    let statusEn = "Balanced", statusHi = "सामान्य", badgeClass = "bg-purple-500/20 text-purple-200 border-purple-400/40";
    if (isExaltedD1 && isVargottama) { statusEn = "Supreme Uchcha Vargottama"; statusHi = "सर्वोच्च उच्च वर्गोत्तम"; badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400"; }
    else if (isExaltedD1) { statusEn = "Exalted (Uchcha)"; statusHi = "उच्च (Uchcha)"; badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50"; }
    else if (isOwnD1) { statusEn = "Swakshetra (Own Sign)"; statusHi = "स्वराशिस्थ"; badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50"; }
    else if (isDebilitatedD1 && (isExaltedD9 || isOwnD9)) { statusEn = "Neechabhanga Raja Yoga"; statusHi = "नीचभंग राजयोग"; badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50"; }
    else if (isDebilitatedD1) { statusEn = "Debilitated (Neecha)"; statusHi = "नीचस्थ"; badgeClass = "bg-red-500/25 text-red-200 border-red-400/50"; }
    else if (isVargottama) { statusEn = "Vargottama"; statusHi = "वर्गोत्तम"; badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50"; }
    return { isVargottama, isExaltedD1, isDebilitatedD1, isOwnD1, isExaltedD9, isDebilitatedD9, isOwnD9, statusEn, statusHi, badgeClass };
  }

  function analyzeAllPlanetsAndAspects(chart) {
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const ascRashi = chart.Asc.d1;
    const results = {};
    pKeys.forEach(k => {
      const p = chart[k];
      const meta = PLANET_META[k];
      const bhava = getBhavaFrom(ascRashi, p.d1);
      const d9Bhava = getBhavaFrom(chart.Asc.d9, p.d9);
      const dignity = evaluatePlanetDignity(k, p);
      const ownedHouses = [];
      for (let h = 1; h <= 12; h++) {
        const r = getRashiOfBhava(ascRashi, h);
        if (RASHI_DATA[r].lord === k) ownedHouses.push(h);
      }
      const conjunctWith = pKeys.filter(o => o !== k && chart[o].d1 === p.d1);
      const aspectedTargets = meta.aspects.map(nth => {
        const targetRashi = ((p.d1 + nth - 2) % 12) + 1;
        return { nthAspect: nth, targetRashi, targetBhava: getBhavaFrom(ascRashi, targetRashi), planetsThere: pKeys.filter(o => o !== k && chart[o].d1 === targetRashi) };
      });
      const aspectedBy = [];
      pKeys.forEach(o => {
        if (o === k) return;
        PLANET_META[o].aspects.forEach(nth => {
          const hitRashi = ((chart[o].d1 + nth - 2) % 12) + 1;
          if (hitRashi === p.d1) aspectedBy.push({ fromPlanet: o, nthAspect: nth });
        });
      });
      results[k] = { key: k, meta, d1: p.d1, d9: p.d9, nak: p.nak, retro: p.retro, bhava, d9Bhava, dignity, ownedHouses, conjunctWith, aspectedTargets, aspectedBy };
    });
    return results;
  }

  function computeRealAshtakavarga(chart) {
    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const refs8 = [...planets7, "Asc"];
    const bavByRashi = {}, savByRashi = new Array(13).fill(0), planetTotals = {};
    planets7.forEach(planet => {
      const counts = new Array(13).fill(0);
      let pSum = 0;
      refs8.forEach(refKey => {
        const refRashi = chart[refKey].d1;
        (ASHTAKAVARGA_RULES[planet][refKey] || []).forEach(nth => {
          const targetRashi = ((refRashi + nth - 2) % 12) + 1;
          counts[targetRashi]++;
          pSum++;
        });
      });
      bavByRashi[planet] = counts;
      planetTotals[planet] = pSum;
      for (let r = 1; r <= 12; r++) savByRashi[r] += counts[r];
    });
    const ascRashi = chart.Asc.d1;
    const houseSav = {}, houseBav = {};
    let grandTotalSav = 0;
    planets7.forEach(p => { houseBav[p] = {}; });
    for (let h = 1; h <= 12; h++) {
      const rashiOfH = getRashiOfBhava(ascRashi, h);
      houseSav[h] = savByRashi[rashiOfH];
      grandTotalSav += houseSav[h];
      planets7.forEach(p => { houseBav[p][h] = bavByRashi[p][rashiOfH]; });
    }
    return { houseSav, houseBav, savByRashi, bavByRashi, planetTotals, grandTotalSav };
  }

  function computeSpecialLagnasAndBindus(chart) {
    const ascRashi = chart.Asc.d1;
    const lagnaLordKey = getLordKeyOfRashi(ascRashi);
    const lagnaLordRashi = chart[lagnaLordKey].d1;
    const distToLord = getBhavaFrom(ascRashi, lagnaLordRashi);
    let arudhaRashi = ((lagnaLordRashi + distToLord - 2) % 12) + 1;
    const rawArudhaHouse = getBhavaFrom(ascRashi, arudhaRashi);
    let arudhaExceptionApplied = false;
    if (rawArudhaHouse === 1 || rawArudhaHouse === 7) {
      arudhaRashi = ((arudhaRashi + 9 - 1) % 12) + 1;
      arudhaExceptionApplied = true;
    }
    const arudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);

    const rashi12th = getRashiOfBhava(ascRashi, 12);
    const lord12thKey = getLordKeyOfRashi(rashi12th);
    const lord12thRashi = chart[lord12thKey].d1;
    const dist12 = getBhavaFrom(rashi12th, lord12thRashi);
    let upapadaRashi = ((lord12thRashi + dist12 - 2) % 12) + 1;
    const rawUlDiff = getBhavaFrom(rashi12th, upapadaRashi);
    if (rawUlDiff === 1 || rawUlDiff === 7) upapadaRashi = ((upapadaRashi + 8) % 12) + 1;

    const charaCandidates = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    let atmakarakaKey = "Sun";
    let maxScore = -1;
    charaCandidates.forEach(pKey => {
      const p = chart[pKey];
      const validNaks = VALID_NAKS_FOR_RASHI[p.d1] || [1,2,3];
      const nkIdx = Math.max(0, validNaks.indexOf(p.nak));
      const d9Off = ((p.d9 - p.d1 + 12) % 12);
      const score = nkIdx * 10 + d9Off + (p.d1 === p.d9 ? 5 : 0);
      if (score > maxScore) { maxScore = score; atmakarakaKey = pKey; }
    });
    const karakamsaRashi = chart[atmakarakaKey].d9;
    const ashtakavarga = computeRealAshtakavarga(chart);
    return { chandraLagna: chart.Moon.d1, suryaLagna: chart.Sun.d1, navamsaLagna: chart.Asc.d9, arudhaRashi, arudhaHouseFromLagna, arudhaExceptionApplied, upapadaRashi, atmakarakaKey, karakamsaRashi, houseBindus: ashtakavarga.houseSav, houseBav: ashtakavarga.houseBav, planetTotals: ashtakavarga.planetTotals, grandTotalSav: asthavarga() };

    function asthavarga() { return ashtakavarga.grandTotalSav; }
  }

  function resolveActiveDasha(chart, numData) {
    const manualOn = document.getElementById("enableDashaToggle") && document.getElementById("enableDashaToggle").checked;
    const mdSelect = document.getElementById("currentMD")?.value || "auto";
    const adSelect = document.getElementById("currentAD")?.value || "auto";
    const moonNakId = chart.Moon.nak || 1;
    const birthDashaRuler = NAKSHATRA_DATA[moonNakId].ruler;
    const startIdx = VIMSHOTTARI_ORDER.findIndex(v => v.lord === birthDashaRuler);
    const birthFrac = 0.55 + ((numData.day % 10) * 0.045);
    let ageCursor = VIMSHOTTARI_ORDER[startIdx].years * birthFrac;
    let currentIdx = startIdx;
    let yearsIntoMD = numData.age;
    if (numData.age > ageCursor) {
      let rem = numData.age - ageCursor;
      currentIdx = (startIdx + 1) % 9;
      while (rem > VIMSHOTTARI_ORDER[currentIdx].years) {
        rem -= VIMSHOTTARI_ORDER[currentIdx].years;
        currentIdx = (currentIdx + 1) % 9;
      }
      yearsIntoMD = rem;
    }
    const autoMD = VIMSHOTTARI_ORDER[currentIdx].lord;
    const mdTotalYears = VIMSHOTTARI_ORDER[currentIdx].years;
    let acc = 0, autoAD = autoMD;
    for (let i = 0; i < 9; i++) {
      const adObj = VIMSHOTTARI_ORDER[(currentIdx + i) % 9];
      const dur = (mdTotalYears * adObj.years) / 120;
      if (yearsIntoMD <= acc + dur || i === 8) { autoAD = adObj.lord; break; }
      acc += dur;
    }
    const nextMD = VIMSHOTTARI_ORDER[(currentIdx + 1) % 9].lord;
    return {
      md: (manualOn && mdSelect !== "auto") ? mdSelect : autoMD,
      ad: (manualOn && adSelect !== "auto") ? adSelect : autoAD,
      nextMD, isManualDasha: Boolean(manualOn && (mdSelect !== "auto" || adSelect !== "auto")),
      birthDashaRuler
    };
  }

  // ==========================================================================
  // 4. NARRATIVE HELPERS
  // ==========================================================================
  function houseThemeShort(bhavaNum, lang) {
    const themes = {
      1:{en:"identity, vitality, self-projection",hi:"पहचान, शारीरिक ऊर्जा, आत्मबल"},
      2:{en:"savings, speech, family lineage",hi:"संचित धन, वाणी, कुल परंपरा"},
      3:{en:"courage, communication, siblings",hi:"साहस, संवाद, भाई-बहन"},
      4:{en:"inner peace, mother, real estate",hi:"मानसिक शांति, माता, भूमि"},
      5:{en:"intelligence, exams, romance",hi:"बुद्धि, परीक्षा, प्रेम"},
      6:{en:"competition, service, debt",hi:"प्रतियोगिता, सेवा, ऋण"},
      7:{en:"marriage, partner, public image",hi:"विवाह, जीवनसाथी, छवि"},
      8:{en:"transformation, research, secrets",hi:"परिवर्तन, शोध, रहस्य"},
      9:{en:"fortune, dharma, guru",hi:"भाग्य, धर्म, गुरु"},
      10:{en:"career, status, authority",hi:"करियर, पद, सत्ता"},
      11:{en:"gains, networks, wishes",hi:"लाभ, नेटवर्क, इच्छा"},
      12:{en:"foreign, sleep, liberation",hi:"विदेश, निद्रा, मुक्ति"}
    };
    return lang === "hi" ? themes[bhavaNum].hi : themes[bhavaNum].en;
  }

  // ==========================================================================
  // 5. NUMEROLOGY CHAPTERS (8)
  // ==========================================================================
  function buildCh1Numerology(ctx) {
    const { lang, name, numData, chaldean } = ctx;
    const ma = MULANK_ARCHETYPES[numData.mulank];
    const ba = MULANK_ARCHETYPES[numData.bhagyank];

    if (lang === "hi") {
      return `
        <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-4 mb-5">
          <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2"><i class="fas fa-hashtag mr-1.5"></i>आपका अंक-हस्ताक्षर</div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">मूलांक</span><strong class="text-amber-300">${numData.mulank} (${ma.ruler})</strong></div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">भाग्यांक</span><strong class="text-purple-300">${numData.bhagyank} (${ba.ruler})</strong></div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">चैल्डियन</span><strong class="text-pink-300">${chaldean.compound} → ${chaldean.single}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">व्यक्तिगत वर्ष</span><strong class="text-emerald-300">${numData.personalYear}</strong></div>
          </div>
        </div>
        <p>प्रिय <strong>${name}</strong>, चैल्डियन अंकशास्त्र के अनुसार आपका व्यक्तित्व तीन स्तंभों पर टिका है: <strong>मूलांक ${numData.mulank}</strong>, <strong>भाग्यांक ${numData.bhagyank}</strong>, और आपके नाम का <strong>चैल्डियन स्पंदन (${chaldean.compound} → ${chaldean.single})</strong>।</p>
        <p><strong>1. आपका मूल स्वभाव:</strong> ${ma.psychHi}</p>
        <p><strong>2. आपका भाग्य-पथ:</strong> ${ba.psychHi} मूलांक और भाग्यांक का यह संगम बताता है कि 24–28 वर्ष के बाद आपके भीतर गहराई और यथार्थबोध कैसे परिपक्व होता है।</p>
        <p><strong>3. आपके नाम की चैल्डियन तरंग:</strong> आपके नाम के अक्षरों का कंपाउंड <strong>${chaldean.compound}</strong> (मूल <strong>${chaldean.single}</strong>) बनता है। ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? "यह शुभ संयोग है—नाम का अंक जन्म-अंकों के साथ सीधा तालमेल बनाता है।"
            : `ध्यान दें: आपकी जन्म-ऊर्जा ${numData.mulank}/${numData.bhagyank} पर चलती है, पर नाम की तरंग ${chaldean.single} है। यही कारण है कि कई बार आपका पूरा प्रयास दिखता नहीं।`
        }</p>
        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> आपकी अनकही मानसिक बनावट:</div>
          <p class="text-sm mb-0">आपके भीतर एक साथ दो समानांतर परतें काम कर रही हैं—बाहरी शांति और भीतरी सजगता। जब कोई आपको आसानी से समझ जाने का दावा करता है, तो असल में वह आपकी सतह तक ही पहुंच पाया है।</p>
        </div>
      `;
    }
    return `
      <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-4 mb-5">
        <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2"><i class="fas fa-hashtag mr-1.5"></i>Your Number Signature</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">Mulank</span><strong class="text-amber-300">${numData.mulank} (${ma.ruler})</strong></div>
          <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">Bhagyank</span><strong class="text-purple-300">${numData.bhagyank} (${ba.ruler})</strong></div>
          <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">Chaldean</span><strong class="text-pink-300">${chaldean.compound} → ${chaldean.single}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900/80 border border-white/10"><span class="text-gray-400 block">Personal Year</span><strong class="text-emerald-300">${numData.personalYear}</strong></div>
        </div>
      </div>
      <p>Dear <strong>${name}</strong>, in Chaldean numerology your personality stands on three pillars: your <strong>Mulank ${numData.mulank}</strong>, your <strong>Bhagyank ${numData.bhagyank}</strong>, and the <strong>Chaldean vibration of your name (${chaldean.compound} → ${chaldean.single})</strong>.</p>
      <p><strong>1. Your Innate Nature:</strong> ${ma.psychEn}</p>
      <p><strong>2. Your Destiny Path:</strong> ${ba.psychEn} This combination reveals how your inner depth and realistic outlook mature after ages 24–28.</p>
      <p><strong>3. The Vibration of Your Name:</strong> Your name sums to compound <strong>${chaldean.compound}</strong> (root <strong>${chaldean.single}</strong>). ${
        chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
          ? "This is an auspicious alignment—your name vibration harmonizes with your birth numbers."
          : `Note: your birth energy runs at ${numData.mulank}/${numData.bhagyank}, but your name broadcasts ${chaldean.single}. This explains why your full effort sometimes goes unnoticed.`
      }</p>
      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> Your Unspoken Mental Architecture:</div>
        <p class="text-sm mb-0">Two parallel layers operate within you—outer composure and inner vigilance. When someone claims they understand you easily, they have actually only reached your surface.</p>
      </div>
    `;
  }

  function buildCh2Numerology(ctx) {
    const { lang, numData } = ctx;
    const m = numData.mulank;
    const map = {
      1:{en:"You learn fastest through leadership and being the first to try something new.",hi:"आप नेतृत्व और पहली बार कुछ आज़माने से सबसे तेज सीखते हैं।"},
      2:{en:"Your brain learns through association and collaborative discussion.",hi:"आपका मस्तिष्क साहचर्य और साथी से चर्चा से सबसे तेज सीखता है।"},
      3:{en:"You thrive in broad, exploratory learning—philosophy, language, art, strategy.",hi:"आप विस्तृत, खोजी अध्ययन में पनपते हैं।"},
      4:{en:"You learn through structure, technical depth, and repetition.",hi:"आप संरचना, तकनीकी गहराई और पुनरावृत्ति से सीखते हैं।"},
      5:{en:"You are a rapid, multi-track learner. Curiosity fuels you.",hi:"आप तीव्र, बहु-आयामी शिक्षार्थी हैं।"},
      6:{en:"You learn through aesthetic and human connection.",hi:"आप सौंदर्य और मानवीय जुड़ाव से सीखते हैं।"},
      7:{en:"Your intellect operates at research level—you must dissect ideas to their root.",hi:"आपका मस्तिष्क शोध स्तर पर काम करता है।"},
      8:{en:"You are a strategic learner—you need to see the real-world payoff.",hi:"आप रणनीतिक शिक्षार्थी हैं।"},
      9:{en:"You learn through experience and humanitarian perspective.",hi:"आप अनुभव और मानवीय दृष्टिकोण से सीखते हैं।"}
    };
    const info = map[m] || map[5];
    if (lang === "hi") {
      return `<p><strong>आपकी सीखने की शैली (मूलांक ${m}):</strong> ${info.hi}</p>
      <p><strong>करियर-अनुकूल क्षेत्र:</strong> आपका भाग्यांक ${numData.bhagyank} बताता है कि आप प्रबंधन, सलाह, विश्लेषण या जन-संपर्क वाले क्षेत्रों में उभरेंगे।</p>
      <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 mt-4">
        <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i>मेधा जागृत करने का अंक-सूत्र:</div>
        <p class="text-sm mb-0">25 मिनट के छोटे स्प्रिंट में पढ़ें, बीच में 5 मिनट का ब्रेक लें।</p>
      </div>`;
    }
    return `<p><strong>Your Learning Style (Mulank ${m}):</strong> ${info.en}</p>
    <p><strong>Career-Aligned Fields:</strong> Your Bhagyank ${numData.bhagyank} indicates you naturally excel in management, advisory, analytical, or people-facing roles.</p>
    <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 mt-4">
      <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i>Number-Based Study Optimization:</div>
      <p class="text-sm mb-0">Study in short 25-minute sprints with 5-minute breaks. Your brain commits material to memory best under mild pressure.</p>
    </div>`;
  }

  function buildCh3Numerology(ctx) {
    const { lang, numData } = ctx;
    const b = numData.bhagyank;
    const map = {
      1:{en:"Leadership, administration, entrepreneurship, government.",hi:"नेतृत्व, प्रशासन, उद्यमिता, सरकारी सेवा।"},
      2:{en:"Counseling, HR, diplomacy, healthcare, hospitality.",hi:"परामर्श, मानव संसाधन, कूटनीति, स्वास्थ्य सेवा।"},
      3:{en:"Teaching, writing, media, law, philosophy.",hi:"शिक्षण, लेखन, मीडिया, कानून, दर्शन।"},
      4:{en:"Engineering, IT, finance, accounting.",hi:"इंजीनियरिंग, आईटी, वित्त, लेखांकन।"},
      5:{en:"Business, sales, marketing, journalism, events.",hi:"व्यापार, बिक्री, विपणन, पत्रकारिता।"},
      6:{en:"Design, aesthetics, family business, entertainment.",hi:"डिज़ाइन, सौंदर्य, पारिवारिक व्यवसाय, मनोरंजन।"},
      7:{en:"Research, analytics, spirituality, medicine.",hi:"शोध, विश्लेषण, आध्यात्मिकता, चिकित्सा।"},
      8:{en:"Executive management, law, real estate, banking.",hi:"कार्यकारी प्रबंधन, कानून, रियल एस्टेट, बैंकिंग।"},
      9:{en:"Defense, sports, humanitarian work, emergency services.",hi:"रक्षा, खेल, मानवीय कार्य, आपातकालीन सेवा।"}
    };
    const info = map[b] || map[5];
    if (lang === "hi") {
      return `<p><strong>आपका भाग्य-करियर क्षेत्र (भाग्यांक ${b}):</strong> ${info.hi}</p>
      <p><strong>आपकी कार्यशैली:</strong> आप <strong>मूलांक ${numData.mulank}</strong> की ऊर्जा से काम करते हैं—स्वायत्तता मिलते ही आप 10 गुना परिणाम देते हैं।</p>
      <p><strong>सफलता के वर्ष:</strong> 26–28, 32–34, और 38–40 वर्ष।</p>`;
    }
    return `<p><strong>Your Destiny-Aligned Career Field (Bhagyank ${b}):</strong> ${info.en}</p>
    <p><strong>Your Working Style:</strong> You operate on <strong>Mulank ${numData.mulank}</strong> energy—you deliver 10× results when given autonomy and respect.</p>
    <p><strong>Career Peak Years:</strong> Around ages 26–28, 32–34, and 38–40.</p>`;
  }

  function buildCh4Numerology(ctx) {
    const { lang, numData } = ctx;
    if (lang === "hi") {
      return `<p><strong>धन-प्रवाह (मूलांक ${numData.mulank} + भाग्यांक ${numData.bhagyank}):</strong> आपकी आय कभी पूरी तरह रुकती नहीं—जब भी बड़ी आवश्यकता होती है, व्यवस्था बन जाती है।</p>
      <p><strong>धन लीक का अंक-रहस्य:</strong> जब भी खाते में बचत बढ़ती है, उसी समय कोई अप्रत्याशित खर्च आ जाता है।</p>
      <p><strong>समृद्धि का अंक-सूत्र:</strong> पैसे को नकद न रखें—सोना, संपत्ति, लंबी अवधि की इक्विटी में बदल दें।</p>`;
    }
    return `<p><strong>Money Flow Pattern (Mulank ${numData.mulank} + Bhagyank ${numData.bhagyank}):</strong> Your income never fully stops—whenever a major need arises, provision finds its way.</p>
    <p><strong>The Number-Based Money Leak:</strong> Every time your account builds a comfortable cushion, an unexpected expense appears.</p>
    <p><strong>Prosperity Formula:</strong> Never let surplus cash sit idle—convert it into gold, real estate, or long-term equity.</p>`;
  }

  function buildCh5Numerology(ctx) {
    const { lang, numData } = ctx;
    const m = numData.mulank, b = numData.bhagyank;
    const milestones = [18+m, 21+(b%5)+m, 24+m%4, 27+b%3, 30+m%3, 33+m%3, 36, 42, 48].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b).slice(0,7);
    const py = numData.personalYear;
    const pyTheme = {
      1:"New beginnings", 2:"Partnership", 3:"Expression", 4:"Foundation",
      5:"Change", 6:"Family", 7:"Reflection", 8:"Power", 9:"Completion"
    };
    const pyThemeHi = {
      1:"नई शुरुआत", 2:"साझेदारी", 3:"अभिव्यक्ति", 4:"नींव",
      5:"बदलाव", 6:"परिवार", 7:"चिंतन", 8:"सत्ता", 9:"समापन"
    };
    if (lang === "hi") {
      return `<p><strong>आपका भाग्य-चक्र:</strong> आपके अंक-संगम (${m}–${b}) से बड़े मोड़ हर 3–4 वर्ष पर आते हैं।</p>
      <p><strong>निर्णायक वर्ष:</strong> <strong>${milestones.join(", ")}वें वर्ष</strong>।</p>
      <p><strong>व्यक्तिगत वर्ष (${numData.currentYear}):</strong> यह आपका Personal Year ${py} है—${pyThemeHi[py] || "संतुलन"} का वर्ष।</p>`;
    }
    return `<p><strong>Your Fortune Cycle:</strong> Major life shifts arrive every 3–4 years.</p>
    <p><strong>Turning-Point Years:</strong> Ages <strong>${milestones.join(", ")}</strong>.</p>
    <p><strong>Personal Year (${numData.currentYear}):</strong> This is your Personal Year ${py}—${pyTheme[py] || "Balance"} year.</p>`;
  }

  function buildCh6Numerology(ctx) {
    const { lang, numData } = ctx;
    const m = numData.mulank;
    const map = {
      1:{en:"You love fiercely and protectively but struggle to say 'I need you' out loud.",hi:"आप तीव्र और रक्षात्मक प्रेम करते हैं पर 'मुझे तुम्हारी जरूरत है' कहने में कठिनाई होती है।"},
      2:{en:"You are deeply romantic and absorb the mood of your partner.",hi:"आप गहरे रोमांटिक हैं और साथी के मूड को सोख लेते हैं।"},
      3:{en:"You fall in love with ideas, conversations, and shared dreams.",hi:"आप विचार, संवाद और साझा सपनों से प्रेम करते हैं।"},
      4:{en:"You express love through loyalty, reliability, and building a life.",hi:"आप प्रेम को निष्ठा, विश्वसनीयता और जीवन बनाने से व्यक्त करते हैं।"},
      5:{en:"You need intellectual and physical freedom in love.",hi:"प्रेम में आपको बौद्धिक और शारीरिक स्वतंत्रता चाहिए।"},
      6:{en:"You love with your whole being—almost parentally.",hi:"आप पूरी आत्मा से प्रेम करते हैं।"},
      7:{en:"You need a partner who respects your solitude.",hi:"आपको ऐसा साथी चाहिए जो आपके एकांत का सम्मान करे।"},
      8:{en:"You show love through provision and commitment.",hi:"आप प्रेम को व्यवस्था और प्रतिबद्धता से दिखाते हैं।"},
      9:{en:"You love without limits and forgive repeatedly.",hi:"आप बिना सीमा के प्रेम करते हैं और बार-बार माफ करते हैं।"}
    };
    const info = map[m] || map[6];
    if (lang === "hi") return `<p><strong>आपका प्रेम-स्वभाव (मूलांक ${m}):</strong> ${info.hi}</p>`;
    return `<p><strong>Your Love Nature (Mulank ${m}):</strong> ${info.en}</p>`;
  }

  function buildCh7Numerology(ctx) {
    const { lang, gender, numData } = ctx;
    const b = numData.bhagyank;
    const desc = {
      1:"respects your autonomy, has their own ambitions",
      2:"calm, emotionally steady, does not drain your sensitivity",
      3:"curious, intellectually playful, matches your conversational depth",
      4:"practical, stable, family-oriented",
      5:"equally independent and adventurous",
      6:"harmonious, family-oriented, values physical affection",
      7:"spiritually inclined, intellectually deep, respects silence",
      8:"ambitious, competent, your equal",
      9:"needs healing, may need your strength"
    };
    const descHi = {
      1:"आपकी स्वायत्तता का सम्मान करे, अपनी महत्वाकांक्षाएं रखे",
      2:"शांत, भावनात्मक रूप से स्थिर साथी",
      3:"जिज्ञासु, बौद्धिक रूप से चंचल",
      4:"व्यावहारिक, स्थिर, परिवार-उन्मुख",
      5:"उतना ही स्वतंत्र और रोमांचक",
      6:"सामंजस्यपूर्ण, परिवार-उन्मुख",
      7:"आध्यात्मिक रूप से झुके, गहरे",
      8:"महत्वाकांक्षी, सक्षम, आपके बराबर",
      9:"उपचार चाहिए, आपके बल की जरूरत"
    };
    const isFemale = gender === "female";
    if (lang === "hi") {
      return `<p><strong>आपके भावी जीवनसाथी का स्वभाव (भाग्यांक ${b}):</strong> ${descHi[b] || descHi[6]}।</p>
      <p><strong>${isFemale ? "पति" : "पत्नी"} के संभावित लक्षण:</strong> आपके अंक-संगम से जीवनसाथी स्वभाव से ${b === 8 || b === 4 ? "व्यावहारिक, स्थिर" : b === 3 || b === 5 ? "अभिव्यक्तिपूर्ण, हंसमुख" : b === 2 || b === 6 ? "भावुक, सौम्य" : "विचारशील, गहरे"} होंगे।</p>
      <p><strong>विवाह-पश्चात प्रभाव:</strong> विवाह के 1–2 वर्ष के भीतर स्थिरता और परिपक्वता आती है।</p>
      <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-400/30 mt-4">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-info-circle mr-1.5"></i>सटीक भविष्यवाणी हेतु:</div>
        <p class="text-sm mb-0">जीवनसाथी का सटीक रंग-रूप, दिशा, विवाह-वर्ष जानने हेतु जन्म समय व स्थान आवश्यक है।</p>
      </div>`;
    }
    return `<p><strong>Your Ideal Partner's Temperament (Bhagyank ${b}):</strong> ${desc[b] || desc[6]}.</p>
    <p><strong>Likely ${isFemale ? "Husband" : "Wife"} Characteristics:</strong> Your number indicates a life partner who is inherently ${b === 8 || b === 4 ? "practical, stable, and responsible" : b === 3 || b === 5 ? "expressive, cheerful, and curious" : b === 2 || b === 6 ? "emotional, gentle, and family-loving" : "thoughtful, deep, and freedom-loving"}.</p>
    <p><strong>Post-Marriage Impact:</strong> You'll experience a stability and maturity upgrade within 1–2 years of marriage.</p>
    <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-400/30 mt-4">
      <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-info-circle mr-1.5"></i>For Exact Partner Prediction:</div>
      <p class="text-sm mb-0">To know your partner's exact appearance, direction, and precise marriage timing, add your exact birth time and place.</p>
    </div>`;
  }

  function buildCh10Numerology(ctx) {
    const { lang, numData } = ctx;
    const py = numData.personalYear;
    const m = numData.mulank;
    const themeHi = { 1:"नई शुरुआत और स्वतंत्रता", 2:"साझेदारी और धैर्य", 3:"अभिव्यक्ति और रचना", 4:"अनुशासन और नींव", 5:"बदलाव और गति", 6:"परिवार और जिम्मेदारी", 7:"आत्म-चिंतन", 8:"करियर और धन", 9:"समापन और मुक्ति" };
    const themeEn = { 1:"New beginnings and independence", 2:"Partnership and patience", 3:"Expression and creation", 4:"Discipline and foundation", 5:"Change and movement", 6:"Family and responsibility", 7:"Self-reflection", 8:"Career and wealth", 9:"Completion and release" };
    if (lang === "hi") {
      return `<p><strong>व्यक्तिगत वर्ष चक्र ${py} (${numData.currentYear}):</strong> यह वर्ष आपके मूलांक ${m} की ऊर्जा से संचालित है।</p>
      <p><strong>मुख्य विषय:</strong> ${themeHi[py] || "संतुलन"}।</p>
      <p><strong>अगले वर्ष का संकेत:</strong> Personal Year ${(py % 9) + 1}।</p>
      <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-400/30 mt-4">
        <div class="font-bold text-cyan-300 text-sm mb-1"><i class="fas fa-hourglass-half mr-1.5"></i>सटीक महादशा/अंतर्दशा हेतु:</div>
        <p class="text-sm mb-0">विंशोत्तरी महादशा जानने के लिए जन्म समय व स्थान आवश्यक है।</p>
      </div>`;
    }
    return `<p><strong>Personal Year Cycle ${py} (${numData.currentYear}):</strong> This year is driven by Mulank ${m} energy.</p>
    <p><strong>Main Theme:</strong> ${themeEn[py] || "Balance"}.</p>
    <p><strong>Next Year Signal:</strong> Personal Year ${(py % 9) + 1}.</p>
    <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-400/30 mt-4">
      <div class="font-bold text-cyan-300 text-sm mb-1"><i class="fas fa-hourglass-half mr-1.5"></i>For Precise Dasha:</div>
      <p class="text-sm mb-0">To know your Vimshottari Mahadasha-Antardasha, enter your exact birth time and place.</p>
    </div>`;
  }

  function buildCh11Numerology(ctx) {
    const { lang, name, numData, chaldean } = ctx;
    if (lang === "hi") {
      return `<p>प्रिय <strong>${name}</strong>, ऊपर की अंक-आधारित रीडिंग में आपने अपनी प्रतिभा देखी। <strong>अब कठोर सत्य:</strong> यदि इतनी क्षमता है तो कुछ चीजें क्यों अंतिम क्षण पर अटकती हैं?</p>
      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
        <div class="font-bold text-red-300 text-base"><i class="fas fa-biohazard mr-2"></i>3 अंक-जनित अवरोध</div>
        <p class="text-sm mb-0"><strong>1. नाम-अंक vs जन्म-अंक घर्षण:</strong> आपकी जन्म-तरंग ${numData.mulank}/${numData.bhagyank} पर चलती है, पर नाम ${chaldean.single} है।</p>
        <p class="text-sm mb-0"><strong>2. 'पर्याप्त नहीं' की भावना:</strong> आप अपनी उपलब्धियों को कम आंकते हैं।</p>
        <p class="text-sm mb-0"><strong>3. भावनात्मक बोझ:</strong> आप अपनी पीड़ा अकेले उठाते हैं।</p>
      </div>
      <p class="text-amber-200 font-semibold mb-0">⚠️ <strong>अगला कदम:</strong> पूर्ण वैदिक कुंडली बनवाकर सटीक ग्रह-दशा अवरोध जानें।</p>`;
    }
    return `<p>Dear <strong>${name}</strong>, in the numerology reading above you saw your strengths. <strong>Now a hard truth:</strong> if you carry this much capability, why do certain things stall at the finishing line?</p>
    <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
      <div class="font-bold text-red-300 text-base"><i class="fas fa-biohazard mr-2"></i>3 Number-Born Blockages</div>
      <p class="text-sm mb-0"><strong>1. Name-Number vs Birth-Number Friction:</strong> Your birth vibration runs at ${numData.mulank}/${numData.bhagyank}, but your name broadcasts ${chaldean.single}.</p>
      <p class="text-sm mb-0"><strong>2. The 'Never Enough' Inner Voice:</strong> You consistently undervalue your own achievements.</p>
      <p class="text-sm mb-0"><strong>3. Emotional Burdens Kept Silent:</strong> You hold your hurt alone.</p>
    </div>
    <p class="text-amber-200 font-semibold mb-0">⚠️ <strong>Next Step:</strong> Add birth time and place to unlock your full Vedic chart and identify precise planetary blockages.</p>`;
  }

  // ==========================================================================
  // 6. VEDIC CHAPTERS (12) — condensed but full
  // ==========================================================================
  function buildChapter1Personality(ctx) {
    const { lang, name, numData, chaldean, chart, planetAnalysis } = ctx;
    const asc = RASHI_DATA[chart.Asc.d1];
    const moon = RASHI_DATA[chart.Moon.d1];
    const sun = RASHI_DATA[chart.Sun.d1];
    const nak = NAKSHATRA_DATA[chart.Moon.nak];
    const ma = MULANK_ARCHETYPES[numData.mulank];
    const lagnaLordInfo = planetAnalysis[asc.lord];

    const sigRow = (labelEn, labelHi, value) => `
      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-white/10 min-w-0 break-words">
        <div class="text-[10px] uppercase text-gray-400 font-bold">${lang === "hi" ? labelHi : labelEn}</div>
        <div class="text-xs sm:text-sm font-bold text-amber-200 mt-0.5 break-words">${value}</div>
      </div>`;

    const signatureCard = `
      <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-3.5 sm:p-5 mb-6">
        <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2.5"><i class="fas fa-fingerprint mr-1.5"></i>${lang === "hi" ? "आपका जन्म-चिह्न" : "Your Master Birth Signature"}</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${sigRow("Ascendant (Lagna)", "लग्न", `${lang === "hi" ? asc.hi : asc.en} <span class="text-gray-400 text-xs">(${asc.lordHi})</span>`)}
          ${sigRow("Moon Rashi", "चंद्र राशि", `${lang === "hi" ? moon.hi : moon.en}`)}
          ${sigRow("Janma Nakshatra", "जन्म नक्षत्र", `${nak.name} <span class="text-gray-400 text-xs">(${nak.ruler})</span>`)}
          ${sigRow("Sun Rashi", "सूर्य राशि", `${lang === "hi" ? sun.hi : sun.en}`)}
          ${sigRow("Mulank", "मूलांक", `${numData.mulank} — ${ma.ruler}`)}
          ${sigRow("Bhagyank", "भाग्यांक", `${numData.bhagyank}`)}
          ${sigRow("Chaldean Name", "चैल्डियन नाम", `${chaldean.compound} → ${chaldean.single}`)}
          ${sigRow("Current Age", "आयु", `${numData.age} Yrs / PY-${numData.personalYear}`)}
        </div>
      </div>`;

    if (lang === "hi") {
      return signatureCard + `
        <p>प्रिय <strong>${name}</strong>, आपका व्यक्तित्व चार स्तंभों का संगम है: <strong>मूलांक ${numData.mulank}</strong>, <strong>भाग्यांक ${numData.bhagyank}</strong>, <strong>${asc.hi} लग्न</strong>, और <strong>${nak.name} नक्षत्र</strong>।</p>
        <p><strong>1. आपका अनकहा मानसिक सच:</strong> ${ma.psychHi} आपके ${asc.hi} लग्न के कारण आपकी कार्यशैली ${asc.temperamentHi} है। लग्नेश ${asc.lordHi} ${lagnaLordInfo.bhava}वें भाव में बैठकर आपकी पूरी जीवन-ऊर्जा ${houseThemeShort(lagnaLordInfo.bhava, "hi")} के इर्द-गिर्द केंद्रित कर रहे हैं।</p>
        <p><strong>2. बाहरी मुखौटा बनाम भीतरी मन:</strong> दुनिया आपको ${asc.temperamentHi} समझती है, परंतु भीतर आपका मन <strong>${moon.hi} + ${nak.name}</strong> से संचालित है—जो आपको ${nak.traitHi} देता है।</p>
        <p><strong>3. चैल्डियन नाम (${chaldean.compound} → ${chaldean.single}):</strong> आपके नाम का कंपाउंड ${chaldean.compound} है। ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? "यह शुभ संयोग है—नाम जन्म-अंकों से तालमेल बनाता है।"
            : `जन्म-ऊर्जा ${numData.mulank}/${numData.bhagyank} पर चलती है, पर नाम ${chaldean.single}—इसीलिए कई बार श्रेय नहीं मिलता।`
        }</p>
        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> आपका गुप्त रडार:</div>
          <p class="text-sm mb-0">आप झूठ और दिखावे को तुरंत पकड़ लेते हैं। कई बार आपने संबंध बचाने के लिए जानबूझकर अनजान बनने का अभिनय किया है—पर एक बार कोई अंतिम मर्यादा लांघता है, आप उसे हमेशा के लिए हटा देते हैं।</p>
        </div>`;
    }
    return signatureCard + `
      <p>Dear <strong>${name}</strong>, your personality weaves four threads: <strong>Mulank ${numData.mulank}</strong>, <strong>Bhagyank ${numData.bhagyank}</strong>, <strong>${asc.en} Lagna</strong>, and the <strong>${nak.name} nakshatra</strong> of your Moon.</p>
      <p><strong>1. Your Unspoken Reality:</strong> ${ma.psychEn} With ${asc.en} Lagna, your outward style is ${asc.temperamentEn}. Your Lagna Lord ${asc.lord} in your ${lagnaLordInfo.bhava}th house pulls your life energy around ${houseThemeShort(lagnaLordInfo.bhava, "en")}.</p>
      <p><strong>2. Outer Mask vs Inner Mind:</strong> The world reads you as ${asc.temperamentEn}, but internally your mind lives inside <strong>${moon.en} under ${nak.name}</strong>—wiring you with ${nak.traitEn}.</p>
      <p><strong>3. Chaldean Name (${chaldean.compound} → ${chaldean.single}):</strong> Your name vibrates at compound <strong>${chaldean.compound}</strong>. ${
        chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
          ? "This is a harmonious alignment with your birth numbers."
          : `Your birth frequency (${numData.mulank}/${numData.bhagyank}) differs from your name frequency (${chaldean.single})—which is why full effort sometimes goes unnoticed.`
      }</p>
      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> Your Silent X-Ray Detector:</div>
        <p class="text-sm mb-0">You detect fake behavior instantly. Many times you have pretended not to notice someone's opportunism to keep peace—but once someone crosses your final boundary, you simply shut the door permanently.</p>
      </div>`;
  }

  function buildChapter2Education(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5 = planetAnalysis[rashi5.lord];
    const merc = planetAnalysis.Mercury;
    const jup = planetAnalysis.Jupiter;
    const bindu5 = specialLagnas.houseBindus[5];
    const mercNak = NAKSHATRA_DATA[merc.nak];
    if (lang === "hi") {
      return `<p>आपके पंचम भाव (मेधा) में <strong>${rashi5.hi}</strong> है, पंचमेश <strong>${rashi5.lordHi}</strong> ${lord5.bhava}वें भाव में, बुध ${RASHI_DATA[merc.d1].hi} (${merc.bhava}वां), गुरु ${RASHI_DATA[jup.d1].hi} (${jup.bhava}वां)—पंचम भाव को ${bindu5} अष्टकवर्ग बिंदु।</p>
      <p><strong>आपकी सीखने की शैली:</strong> आपका मस्तिष्क रटने के लिए नहीं, बल्कि मूल सिद्धांत पकड़ने के लिए बना है। डेडलाइन पर आप 3 महीने का काम 15 दिन में कर सकते हैं, पर सामान्य दिनों में ध्यान भटकता है।</p>
      <p><strong>करियर-अनुकूल क्षेत्र:</strong> डेटा/टेक्नोलॉजी, प्रशासनिक सेवाएं, वित्त, कानून, मनोविज्ञान, चिकित्सा।</p>
      <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 mt-4">
        <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i>मेधा सूत्र:</div>
        <p class="text-sm mb-0"><strong>${rashi5.directionHi}</strong> मुख करके पढ़ें, 45-मिनट स्प्रिंट में लिखकर अभ्यास करें।</p>
      </div>`;
    }
    return `<p>Your 5th house of Medha holds <strong>${rashi5.en}</strong>, with its ruler <strong>${rashi5.lord}</strong> in the ${lord5.bhava}th house, <strong>Mercury in ${RASHI_DATA[merc.d1].en} (${merc.bhava}th under ${mercNak.name})</strong>, and <strong>Jupiter in ${RASHI_DATA[jup.d1].en} (${jup.bhava}th)</strong>—with <strong>${bindu5} Ashtakavarga bindus</strong>.</p>
    <p><strong>Your Learning Style:</strong> Your brain is wired to grasp core logic, not rote memorization. Under deadline pressure, you can compress months into days—but on routine days, focus scatters.</p>
    <p><strong>Career-Aligned Fields:</strong> Data/technology, administrative services, finance, law, psychology, medicine.</p>
    <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 mt-4">
      <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i>Vedic Focus Optimization:</div>
      <p class="text-sm mb-0">Face <strong>${rashi5.direction}</strong> while studying, work in 45-minute written-recall sprints.</p>
    </div>`;
  }

  function buildChapter3Career(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi10 = RASHI_DATA[getRashiOfBhava(asc, 10)];
    const lord10 = planetAnalysis[rashi10.lord];
    const sat = planetAnalysis.Saturn;
    const sun = planetAnalysis.Sun;
    const bindu10 = specialLagnas.houseBindus[10];
    const bindu6 = specialLagnas.houseBindus[6];
    const bindu11 = specialLagnas.houseBindus[11];
    if (lang === "hi") {
      return `<p>दशम भाव में <strong>${rashi10.hi}</strong>, दशमेश <strong>${rashi10.lordHi}</strong> ${lord10.bhava}वें भाव में। शनि ${RASHI_DATA[sat.d1].hi} (${sat.bhava}वां), सूर्य ${RASHI_DATA[sun.d1].hi} (${sun.bhava}वां)।</p>
      <p><strong>नौकरी बनाम स्वतंत्रता:</strong> दशम भाव को <strong>${bindu10} बिंदु</strong>, षष्ठ को <strong>${bindu6} बिंदु</strong>, एकादश को <strong>${bindu11} बिंदु</strong>। ${
        bindu10 >= bindu6
          ? "आपको स्वायत्तता और निर्णय-शक्ति मिलते ही 10 गुना परिणाम देते हैं।"
          : "आप संगठनात्मक ढांचे में रहकर तेजी से ऊपर उठ सकते हैं।"
      }</p>
      <p><strong>सफलता के वर्ष:</strong> ${numData.mulank === 8 || numData.bhagyank === 8 ? "28, 32, 35" : "26, 29, 33"}वें वर्ष।</p>
      <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i>सर्वोत्तम करियर:</div>
        <p class="text-xs md:text-sm mb-0">प्रशासनिक नेतृत्व, टेक्नोलॉजी, चिकित्सा, बैंकिंग, कंसल्टेंसी, उद्यमिता।</p>
      </div>`;
    }
    return `<p>Your 10th house holds <strong>${rashi10.en}</strong>, with ruler <strong>${rashi10.lord}</strong> in the ${lord10.bhava}th house. <strong>Saturn in ${RASHI_DATA[sat.d1].en} (${sat.bhava}th)</strong>, <strong>Sun in ${RASHI_DATA[sun.d1].en} (${sun.bhava}th)</strong>.</p>
    <p><strong>Job vs Independent:</strong> 10th: <strong>${bindu10}</strong>, 6th: <strong>${bindu6}</strong>, 11th: <strong>${bindu11}</strong>. ${
      bindu10 >= bindu6
        ? "You deliver 10× results when given autonomy and command."
        : "You rise fastest within structured organizations."
    }</p>
    <p><strong>Career Peak Ages:</strong> ${numData.mulank === 8 || numData.bhagyank === 8 ? "28, 32, 35" : "26, 29, 33"}.</p>
    <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
      <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i>Best Career Sectors:</div>
      <p class="text-xs md:text-sm mb-0">Executive administration, technology, medicine, finance, consulting, entrepreneurship.</p>
    </div>`;
  }

  function buildChapter4Wealth(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi2 = RASHI_DATA[getRashiOfBhava(asc, 2)];
    const rashi11 = RASHI_DATA[getRashiOfBhava(asc, 11)];
    const rashi12 = RASHI_DATA[getRashiOfBhava(asc, 12)];
    const lord2 = planetAnalysis[rashi2.lord];
    const lord11 = planetAnalysis[rashi11.lord];
    const bindu2 = specialLagnas.houseBindus[2];
    const bindu11 = specialLagnas.houseBindus[11];
    const bindu12 = specialLagnas.houseBindus[12];
    if (lang === "hi") {
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3 rounded-xl bg-slate-950/80 border border-emerald-400/30"><div class="text-xs text-emerald-300 font-bold">11वां भाव (${rashi11.hi})</div><div class="text-lg font-extrabold text-white">${bindu11} बिंदु</div></div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-amber-400/30"><div class="text-xs text-amber-300 font-bold">2रा भाव (${rashi2.hi})</div><div class="text-lg font-extrabold text-white">${bindu2} बिंदु</div></div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-rose-400/30"><div class="text-xs text-rose-300 font-bold">12वां भाव (${rashi12.hi})</div><div class="text-lg font-extrabold text-white">${bindu12} बिंदु</div></div>
      </div>
      <p>11वें भाव के स्वामी <strong>${rashi11.lordHi}</strong> ${lord11.bhava}वें भाव में, 2रे भाव के स्वामी <strong>${rashi2.lordHi}</strong> ${lord2.bhava}वें भाव में।</p>
      <p><strong>मनी लीक पैटर्न:</strong> बचत बढ़ते ही अप्रत्याशित खर्च आ जाता है।</p>
      <p><strong>समृद्धि सूत्र:</strong> धन आते ही भूमि, स्वर्ण, या इक्विटी में लॉक करें।</p>`;
    }
    return `<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      <div class="p-3 rounded-xl bg-slate-950/80 border border-emerald-400/30"><div class="text-xs text-emerald-300 font-bold">11th (${rashi11.en})</div><div class="text-lg font-extrabold text-white">${bindu11} bindus</div></div>
      <div class="p-3 rounded-xl bg-slate-950/80 border border-amber-400/30"><div class="text-xs text-amber-300 font-bold">2nd (${rashi2.en})</div><div class="text-lg font-extrabold text-white">${bindu2} bindus</div></div>
      <div class="p-3 rounded-xl bg-slate-950/80 border border-rose-400/30"><div class="text-xs text-rose-300 font-bold">12th (${rashi12.en})</div><div class="text-lg font-extrabold text-white">${bindu12} bindus</div></div>
    </div>
    <p>11th lord <strong>${rashi11.lord}</strong> in the ${lord11.bhava}th house, 2nd lord <strong>${rashi2.lord}</strong> in the ${lord2.bhava}th house.</p>
    <p><strong>Money Leak Pattern:</strong> Every time savings build, an unexpected expense appears.</p>
    <p><strong>Wealth Formula:</strong> Convert surplus into land, gold, or equity—never leave cash idle.</p>`;
  }

  function buildChapter5Luck(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi9 = RASHI_DATA[getRashiOfBhava(asc, 9)];
    const lord9 = planetAnalysis[rashi9.lord];
    const bindu9 = specialLagnas.houseBindus[9];
    const m = numData.mulank, b = numData.bhagyank;
    const milestones = Array.from(new Set([18+m, 21+(b%5), 24+(m%4), 27+(b%3), 30+(lord9.bhava%4), 33+(m%3), 36, 42])).sort((x,y)=>x-y);
    if (lang === "hi") {
      return `<p>नवम भाव में <strong>${rashi9.hi}</strong>, भाग्येश <strong>${rashi9.lordHi}</strong> ${lord9.bhava}वें भाव में, ${bindu9} बिंदु।</p>
      <p><strong>भाग्य:</strong> '99% पर अटकने' का रहस्य—हर रुकावट पीछे रक्षा थी।</p>
      <p><strong>निर्णायक वर्ष:</strong> ${milestones.join(", ")}।</p>
      <p><strong>व्यक्तिगत वर्ष:</strong> ${numData.currentYear} में Personal Year ${numData.personalYear}।</p>`;
    }
    return `<p>Your 9th house holds <strong>${rashi9.en}</strong>, Bhagyasthan lord <strong>${rashi9.lord}</strong> in the ${lord9.bhava}th house, ${bindu9} bindus.</p>
    <p><strong>Fortune:</strong> The "99th-percentile test" pattern—each delay was cosmic protection.</p>
    <p><strong>Decisive Ages:</strong> ${milestones.join(", ")}.</p>
    <p><strong>Personal Year:</strong> ${numData.currentYear} runs as PY-${numData.personalYear}.</p>`;
  }

  function buildChapter6Love(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5 = planetAnalysis[rashi5.lord];
    const ven = planetAnalysis.Venus;
    const rahu = planetAnalysis.Rahu;
    const karmicLove = ven.conjunctWith.includes("Rahu") || rahu.bhava === 5 || rahu.bhava === 7;
    if (lang === "hi") {
      return `<p>पंचम भाव में <strong>${rashi5.hi}</strong>, पंचमेश <strong>${rashi5.lordHi}</strong> ${lord5.bhava}वें भाव, शुक्र ${RASHI_DATA[ven.d1].hi} (${ven.bhava}वां, D9 ${RASHI_DATA[ven.d9].hi})।</p>
      <p><strong>आपका प्रेम पैटर्न:</strong> आप सतही संबंध नहीं बना सकते—जब जुड़ते हैं तो पूरी आत्मा से जुड़ते हैं।</p>
      <p><strong>भावनात्मक असंतुलन:</strong> आप 100% देते हैं, बदले में 30% मिलता है।</p>
      <p>${karmicLove ? "शुक्र-राहु के प्रभाव से जीवन में एक गहरा कार्मिक प्रेम-प्रसंग आएगा—ताकि आप आत्म-सम्मान पहचानें।" : "सच्चा प्रेम तभी खिलेगा जब बौद्धिक और आत्मिक स्तर मिलेगा।"}</p>`;
    }
    return `<p>5th house holds <strong>${rashi5.en}</strong>, ruler <strong>${rashi5.lord}</strong> in the ${lord5.bhava}th, Venus in ${RASHI_DATA[ven.d1].en} (${ven.bhava}th, D9 ${RASHI_DATA[ven.d9].en}).</p>
    <p><strong>Your Love Pattern:</strong> You cannot do shallow romance—you love with fierce loyalty.</p>
    <p><strong>Emotional Imbalance:</strong> You give 100%, receive 30%.</p>
    <p>${karmicLove ? "Venus-Rahu karmic influence brings one deep transformative love—specifically to awaken your self-worth." : "True love blooms when intellectual and spiritual levels align."}</p>`;
  }

  function buildChapter7Partner(ctx) {
    const { lang, gender, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi7 = RASHI_DATA[getRashiOfBhava(asc, 7)];
    const lord7 = planetAnalysis[rashi7.lord];
    const d9R7 = RASHI_DATA[getRashiOfBhava(chart.Asc.d9, 7)];
    const ulRashi = RASHI_DATA[specialLagnas.upapadaRashi];
    const skKey = gender === "female" ? "Jupiter" : "Venus";
    const sk = planetAnalysis[skKey];
    const lord7Nak = NAKSHATRA_DATA[lord7.nak];
    const bindu7 = specialLagnas.houseBindus[7];
    const dir1En = rashi7.direction;
    const dir2En = d9R7.direction !== dir1En ? d9R7.direction : rashi7.direction;
    if (lang === "hi") {
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3 rounded-xl bg-slate-950/80 border border-rose-400/30"><div class="text-xs text-rose-300 font-bold">7वां भाव (D1)</div><div class="text-sm font-bold text-white">${rashi7.hi} (${rashi7.lordHi})</div></div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-pink-400/30"><div class="text-xs text-pink-300 font-bold">D9 7वां</div><div class="text-sm font-bold text-white">${d9R7.hi} • ${sk.meta.hi}</div></div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-amber-400/30"><div class="text-xs text-amber-300 font-bold">UL</div><div class="text-sm font-bold text-white">${ulRashi.hi} (${bindu7} बिंदु)</div></div>
      </div>
      <p><strong>रंग-रूप:</strong> ${rashi7.bodyBuildHi}।</p>
      <p><strong>स्वभाव:</strong> बाहर से ${rashi7.temperamentHi}, भीतर से ${d9R7.temperamentHi}।</p>
      <p><strong>दिशा:</strong> ${dir1En === dir2En ? rashi7.directionHi : rashi7.directionHi + " अथवा " + d9R7.directionHi}।</p>
      <p>${bindu7 < 26 ? "विवाह के शुरुआती चरण में अहं से बचें।" : "जीवनसाथी कठिन समय में ढाल साबित होगा।"}</p>
      <p><strong>विवाह-पश्चात:</strong> 18–24 महीनों में आर्थिक स्तर में बड़ा उछाल।</p>`;
    }
    return `<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      <div class="p-3 rounded-xl bg-slate-950/80 border border-rose-400/30"><div class="text-xs text-rose-300 font-bold">7th (D1)</div><div class="text-sm font-bold text-white">${rashi7.en} (${rashi7.lord})</div></div>
      <div class="p-3 rounded-xl bg-slate-950/80 border border-pink-400/30"><div class="text-xs text-pink-300 font-bold">D9 7th</div><div class="text-sm font-bold text-white">${d9R7.en} • ${skKey}</div></div>
      <div class="p-3 rounded-xl bg-slate-950/80 border border-amber-400/30"><div class="text-xs text-amber-300 font-bold">UL</div><div class="text-sm font-bold text-white">${ulRashi.en} (${bindu7} bindus)</div></div>
    </div>
    <p><strong>Appearance:</strong> ${rashi7.bodyBuildEn}.</p>
    <p><strong>Nature:</strong> Outwardly ${rashi7.temperamentEn}, inwardly ${d9R7.temperamentEn}.</p>
    <p><strong>Direction:</strong> ${dir1En === dir2En ? rashi7.direction : rashi7.direction + " or " + d9R7.direction}.</p>
    <p>${bindu7 < 26 ? "Early marriage phase needs ego-awareness and clear communication." : "Partner will be your strongest ally in tough times."}</p>
    <p><strong>Post-Marriage:</strong> Financial and social elevation within 18–24 months.</p>`;
  }

  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const ascRashi = chart.Asc.d1;
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const modeBanner = chart.isFullChartMode
      ? `<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs text-emerald-200 mb-4"><i class="fas fa-check-circle mr-1.5"></i>${lang === "hi" ? "पूर्ण कुंडली मोड सक्रिय" : "Full chart mode active"}</div>`
      : "";
    const cards = pKeys.map(k => {
      const info = planetAnalysis[k];
      const d1 = RASHI_DATA[info.d1];
      const d9 = RASHI_DATA[info.d9];
      const nak = NAKSHATRA_DATA[info.nak];
      const bav = specialLagnas.houseBav[k] ? specialLagnas.houseBav[k][info.bhava] : "—";
      const yuti = info.conjunctWith.length > 0
        ? (lang === "hi" ? `युति: ${info.conjunctWith.map(c => PLANET_META[c].hi).join(", ")}` : `Yuti: ${info.conjunctWith.map(c => PLANET_META[c].en).join(", ")}`)
        : (lang === "hi" ? "बिना युति" : "Unconjunct");
      const outAspects = info.aspectedTargets.map(t => `${t.nthAspect}→H${t.targetBhava}`).join(", ");
      if (lang === "hi") {
        return `<div class="p-4 rounded-2xl bg-slate-950/85 border border-white/15 space-y-2">
          <div class="flex justify-between items-start gap-2 pb-2 border-b border-white/10">
            <div><h4 class="text-lg font-bold text-white">${info.meta.hi}</h4>
              <p class="text-xs text-amber-300">${info.bhava}वां भाव • ${d1.hi} • ${nak.name}</p></div>
            <span class="px-2 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusHi}</span>
          </div>
          <p class="text-sm mb-0"><strong>D9:</strong> ${info.d9Bhava}वां भाव — ${d9.hi}।</p>
          <p class="text-sm mb-0"><strong>${yuti}</strong></p>
          <p class="text-sm mb-0"><strong>दृष्टि:</strong> ${outAspects} • BAV ${bav}/8</p>
        </div>`;
      }
      return `<div class="p-4 rounded-2xl bg-slate-950/85 border border-white/15 space-y-2">
        <div class="flex justify-between items-start gap-2 pb-2 border-b border-white/10">
          <div><h4 class="text-lg font-bold text-white">${info.meta.en}</h4>
            <p class="text-xs text-amber-300">${info.bhava}th House • ${d1.en} • ${nak.name}</p></div>
          <span class="px-2 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusEn}</span>
        </div>
        <p class="text-sm mb-0"><strong>D9:</strong> ${info.d9Bhava}th — ${d9.en}</p>
        <p class="text-sm mb-0"><strong>${yuti}</strong></p>
        <p class="text-sm mb-0"><strong>Aspects:</strong> ${outAspects} • BAV ${bav}/8</p>
      </div>`;
    }).join("");
    return modeBanner + `<div class="space-y-3">${cards}</div>`;
  }

  function buildChapter9SpecialLagnas(ctx) {
    const { lang, specialLagnas } = ctx;
    const chandra = RASHI_DATA[specialLagnas.chandraLagna];
    const surya = RASHI_DATA[specialLagnas.suryaLagna];
    const navamsa = RASHI_DATA[specialLagnas.navamsaLagna];
    const arudha = RASHI_DATA[specialLagnas.arudhaRashi];
    const karakamsa = RASHI_DATA[specialLagnas.karakamsaRashi];
    const akMeta = PLANET_META[specialLagnas.atmakarakaKey];
    const bindus = specialLagnas.houseBindus;
    const bav = specialLagnas.houseBav;
    const pTotals = specialLagnas.planetTotals;
    const houseArr = Object.keys(bindus).map(h => ({ h: parseInt(h, 10), b: bindus[h] }));
    const savGrid = houseArr.map(({ h, b }) => {
      const col = b >= 30 ? "border-emerald-400/50 text-emerald-300" : b <= 24 ? "border-rose-400/50 text-rose-300" : b <= 27 ? "border-amber-400/40 text-amber-300" : "border-white/15 text-gray-200";
      return `<div class="p-2 rounded-xl bg-slate-950/90 border ${col} text-center"><div class="text-[10px] text-gray-400">${lang === "hi" ? "भाव" : "H"} ${h}</div><div class="text-base font-extrabold">${b}</div></div>`;
    }).join("");
    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const ps = { Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa" };
    const headerCells = planets7.map(p => `<th class="py-1.5 px-1.5 text-center text-amber-300">${ps[p]}</th>`).join("");
    const bavRows = houseArr.map(({ h }) => {
      const cells = planets7.map(p => {
        const v = bav[p][h];
        const col = v >= 5 ? "text-emerald-300" : v <= 2 ? "text-rose-300" : "text-gray-300";
        return `<td class="py-1.5 px-1.5 text-center font-bold ${col}">${v}</td>`;
      }).join("");
      return `<tr><td class="py-1.5 px-2 text-gray-300 font-bold">${h}</td>${cells}<td class="py-1.5 px-2 text-center font-extrabold text-amber-300">${bindus[h]}</td></tr>`;
    }).join("");
    const totalFooter = planets7.map(p => `<td class="py-2 px-1.5 text-center font-extrabold text-amber-300">${pTotals[p]}</td>`).join("");

    if (lang === "hi") {
      return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-blue-400/30"><h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>चंद्र लग्न (${chandra.hi})</h4><p class="text-sm">मन की धुरी—गोचर साढ़ेसाती यहीं से संचालित।</p></div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30"><h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>सूर्य लग्न (${surya.hi})</h4><p class="text-sm">आत्मा, पिता, प्रशासनिक अधिकार।</p></div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30"><h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>नवांश (${navamsa.hi}) • कारकांश (${karakamsa.hi})</h4><p class="text-sm">आत्मकारक ${akMeta.hi} से निर्मित। 30+ व विवाह के बाद फल।</p></div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30"><h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>आरूढ़ लग्न (${arudha.hi})</h4><p class="text-sm">लग्न से ${specialLagnas.arudhaHouseFromLagna}वां—सार्वजनिक छवि।</p></div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
        <div class="flex justify-between items-center mb-3"><h4 class="text-base font-bold text-amber-300"><i class="fas fa-th mr-2"></i>337-बिंदु सर्वाष्टकवर्ग (SAV)</h4><span class="text-xs text-emerald-300 font-bold">कुल: ${specialLagnas.grandTotalSav}/337</span></div>
        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">${savGrid}</div>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs"><thead class="bg-slate-950 text-amber-300"><tr><th class="py-1.5 px-2">भाव</th>${headerCells}<th class="py-1.5 px-2">SAV</th></tr></thead>
          <tbody class="bg-slate-900/60 divide-y divide-white/5">${bavRows}</tbody>
          <tfoot><tr class="bg-slate-950 border-t border-amber-400/40"><td class="py-2 px-2 font-bold text-amber-300">कुल</td>${totalFooter}<td class="py-2 px-2 text-center font-extrabold text-emerald-300">${specialLagnas.grandTotalSav}</td></tr></tfoot></table>
        </div>
      </div>`;
    }
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 rounded-2xl bg-slate-950/85 border border-blue-400/30"><h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>Chandra Lagna (${chandra.en})</h4><p class="text-sm">Operating system of the mind—transits and Sade-Sati register here.</p></div>
      <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30"><h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>Surya Lagna (${surya.en})</h4><p class="text-sm">Soul, father, executive authority.</p></div>
      <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30"><h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>Navamsa (${navamsa.en}) • Karakamsa (${karakamsa.en})</h4><p class="text-sm">Via Atmakaraka ${akMeta.en}. Fruit after age 30 & marriage.</p></div>
      <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30"><h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>Arudha Lagna (${arudha.en})</h4><p class="text-sm">${specialLagnas.arudhaHouseFromLagna}th from Lagna—public perception.</p></div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
      <div class="flex justify-between items-center mb-3"><h4 class="text-base font-bold text-amber-300"><i class="fas fa-th mr-2"></i>337-Bindu Sarvashtakavarga (SAV)</h4><span class="text-xs text-emerald-300 font-bold">Total: ${specialLagnas.grandTotalSav}/337</span></div>
      <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">${savGrid}</div>
      <div class="overflow-x-auto rounded-xl border border-white/15">
        <table class="w-full text-xs"><thead class="bg-slate-950 text-amber-300"><tr><th class="py-1.5 px-2">House</th>${headerCells}<th class="py-1.5 px-2">SAV</th></tr></thead>
        <tbody class="bg-slate-900/60 divide-y divide-white/5">${bavRows}</tbody>
        <tfoot><tr class="bg-slate-950 border-t border-amber-400/40"><td class="py-2 px-2 font-bold text-amber-300">Total</td>${totalFooter}<td class="py-2 px-2 text-center font-extrabold text-emerald-300">${specialLagnas.grandTotalSav}</td></tr></tfoot></table>
      </div>
    </div>`;
  }

  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData } = ctx;
    const md = planetAnalysis[dasha.md];
    const ad = planetAnalysis[dasha.ad];
    const mdRashi = RASHI_DATA[md.d1];
    const adRashi = RASHI_DATA[ad.d1];
    const relH = getBhavaFrom(md.d1, ad.d1);
    const diffAxis = relH === 6 || relH === 8 || relH === 12;
    if (lang === "hi") {
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40"><div class="text-xs text-cyan-300 font-bold">महादशा</div><div class="text-xl font-extrabold text-white">${md.meta.hi}</div><div class="text-xs text-gray-400">${md.bhava}वां भाव (${mdRashi.hi})</div></div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40"><div class="text-xs text-purple-300 font-bold">अंतर्दशा</div><div class="text-xl font-extrabold text-white">${ad.meta.hi}</div><div class="text-xs text-gray-400">${ad.bhava}वां भाव (${adRashi.hi})</div></div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40"><div class="text-xs text-amber-300 font-bold">दशा-भुक्ति संबंध</div><div class="text-xl font-extrabold text-white">${relH}वां</div></div>
      </div>
      <p><strong>${md.meta.hi} महादशा:</strong> ${md.bhava}वें भाव (${BHAVA_MEANINGS[md.bhava].hi}) में—पिछले समय से फोकस ${houseThemeShort(md.bhava, "hi")} पर रहा।</p>
      <p><strong>${ad.meta.hi} अंतर्दशा:</strong> ${ad.bhava}वें भाव में—${
        diffAxis
          ? `महादशानाथ से ${relH}वें कोण पर होने से मानसिक थकान, रात को विचारों का द्वंद्व।`
          : `महादशानाथ से ${relH}वें संबंध से रुकी योजनाएं गति पकड़ेंगी।`
      }</p>
      <p><strong>आगामी 12–18 महीने:</strong> गोचर गुरु-शनि से करियर, आर्थिक या विवाह का बड़ा निर्णय आएगा।</p>`;
    }
    return `<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40"><div class="text-xs text-cyan-300 font-bold">Mahadasha</div><div class="text-xl font-extrabold text-white">${md.meta.en}</div><div class="text-xs text-gray-400">${md.bhava}th House (${mdRashi.en})</div></div>
      <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40"><div class="text-xs text-purple-300 font-bold">Antardasha</div><div class="text-xl font-extrabold text-white">${ad.meta.en}</div><div class="text-xs text-gray-400">${ad.bhava}th House (${adRashi.en})</div></div>
      <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40"><div class="text-xs text-amber-300 font-bold">Dasha-Bhukti Angle</div><div class="text-xl font-extrabold text-white">${relH}th</div></div>
    </div>
    <p><strong>${md.meta.en} Mahadasha:</strong> In the ${md.bhava}th house (${BHAVA_MEANINGS[md.bhava].en})—your focus has been on ${houseThemeShort(md.bhava, "en")}.</p>
    <p><strong>${ad.meta.en} Antardasha:</strong> In the ${ad.bhava}th house—${
      diffAxis
        ? `at a ${relH}th angle from Mahadasha lord, causing mental fatigue and pre-completion delays.`
        : `at a ${relH}th angle from Mahadasha lord, pushing stalled plans toward breakthrough.`
    }</p>
    <p><strong>Next 12–18 Months:</strong> Jupiter and Saturn transits activate your ${md.bhava}th/${ad.bhava}th axis—a defining career, financial, or relationship decision arrives.</p>`;
  }

  function buildChapter11HiddenTraps(ctx) {
    const { lang, name, chart, planetAnalysis, specialLagnas, dasha } = ctx;
    const asc = chart.Asc.d1;
    const rahu = planetAnalysis.Rahu;
    const ketu = planetAnalysis.Ketu;
    const sat = planetAnalysis.Saturn;
    let weakH = 1, minB = 99;
    Object.keys(specialLagnas.houseBindus).forEach(h => {
      if (specialLagnas.houseBindus[h] < minB) { minB = specialLagnas.houseBindus[h]; weakH = parseInt(h, 10); }
    });
    if (lang === "hi") {
      return `<p>प्रिय <strong>${name}</strong>, ऊपर के अध्यायों में आपने अपनी प्रतिभा देखी। <strong>अब कठोर सत्य:</strong> यदि इतनी क्षमता है तो कुछ क्यों अटकता है?</p>
      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
        <div class="font-bold text-red-300 text-base"><i class="fas fa-biohazard mr-2"></i>3 गुप्त अवरोध</div>
        <p class="text-sm mb-0"><strong>1. राहु-केतु ${rahu.bhava}/${ketu.bhava}:</strong> सफलता के करीब मानसिक धुंध।</p>
        <p class="text-sm mb-0"><strong>2. शनि ${sat.bhava}वें भाव में:</strong> धैर्य की कड़ी परीक्षा।</p>
        <p class="text-sm mb-0"><strong>3. ${weakH}वां भाव (केवल ${minB} बिंदु):</strong> सबसे कमजोर कड़ी वर्तमान ${PLANET_META[dasha.md].hi}–${PLANET_META[dasha.ad].hi} दशा में।</p>
      </div>
      <p class="text-amber-200 font-semibold mb-0">⚠️ <strong>बिना सटीक अंशबल जांचे रत्न न पहनें।</strong> संपूर्ण हस्तनिर्मित कुंडली हेतु आचार्य ज्ञानेंद्र सिंह तोमर जी से संपर्क करें।</p>`;
    }
    return `<p>Dear <strong>${name}</strong>, in the chapters above you saw your strengths. <strong>Now the hard truth:</strong> if you carry this much capability, why do certain things stall?</p>
    <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
      <div class="font-bold text-red-300 text-base"><i class="fas fa-biohazard mr-2"></i>3 Hidden Blockages</div>
      <p class="text-sm mb-0"><strong>1. Rahu-Ketu ${rahu.bhava}/${ketu.bhava}:</strong> Mental fog right before success.</p>
      <p class="text-sm mb-0"><strong>2. Saturn in ${sat.bhava}th:</strong> Deep patience test.</p>
      <p class="text-sm mb-0"><strong>3. House ${weakH} (only ${minB} bindus):</strong> Weakest link during ${dasha.md}–${dasha.ad} dasha.</p>
    </div>
    <p class="text-amber-200 font-semibold mb-0">⚠️ <strong>Never wear gemstones without exact Shadbala analysis.</strong> For full hand-crafted Kundali, contact Gyanendra S. Tomar.</p>`;
  }

  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart } = ctx;
    const jupRashi = RASHI_DATA[chart.Jupiter.d1];
    const headingEl = document.getElementById("dakshinaHeading");
    const textEl = document.getElementById("contentDakshinaText");
    if (!headingEl || !textEl) return;
    if (lang === "hi") {
      headingEl.innerHTML = `गुरु-दक्षिणा संकल्प 🙏`;
      textEl.innerHTML = `<p class="hindi">प्रिय <strong>${name}</strong>, आपकी कुंडली में देवगुरु बृहस्पति <strong>${jupRashi.hi}</strong> से भाग्य नियंत्रित कर रहे हैं। वैदिक परंपरा के अनुसार बिना गुरु-दक्षिणा के उस ज्ञान का पूर्ण शुभ फल जागृत नहीं होता। यदि इस रीडिंग ने आपके मन के अनकहे सच को छुआ है, तो <strong>(₹51, ₹101, ₹251 या ₹501)</strong> की गुरु-दक्षिणा अर्पित करें।</p>`;
    } else {
      headingEl.innerHTML = `Honor the Sacred Law of Guru Dakshina 🙏`;
      textEl.innerHTML = `<p>Dear <strong>${name}</strong>, in your chart Jupiter (Brihaspati) operates through <strong>${jupRashi.en}</strong>. In Vedic tradition, receiving this knowledge without a Guru Dakshina (voluntary Energy Exchange) prevents the full grace from activating. If this reading touched you, please offer <strong>₹51, ₹101, ₹251, or ₹501</strong> per your Shraddha via the QR code.</p>`;
    }
  }

  // ==========================================================================
  // 7. HEADINGS + ORCHESTRATION
  // ==========================================================================
  function updateHeadingsForMode(lang, ctx) {
    const isNum = ctx.mode === "numerology";
    const numLabelsHi = {
      ch1Tag: "अध्याय 01 • चैल्डियन अंक ज्योतिष", ch1Title: "आपका अंक-जनित व्यक्तित्व एवं मूलांक चरित्र",
      ch2Tag: "अध्याय 02 • बुद्धि एवं शिक्षा", ch2Title: "आपकी सीखने की शैली एवं बुद्धि-प्रकार",
      ch3Tag: "अध्याय 03 • करियर", ch3Title: "आपकी व्यावसायिक दिशा एवं सफलता",
      ch4Tag: "अध्याय 04 • धन एवं संचय", ch4Title: "धन-प्रवाह एवं समृद्धि-चक्र",
      ch5Tag: "अध्याय 05 • भाग्य एवं समय", ch5Title: "भाग्योदय वर्ष एवं व्यक्तिगत वर्ष चक्र",
      ch6Tag: "अध्याय 06 • प्रेम", ch6Title: "आपका प्रेम-स्वभाव एवं संबंध पैटर्न",
      ch7Tag: "अध्याय 07 • जीवनसाथी", ch7Title: "आपके जीवनसाथी का संभावित स्वभाव",
      ch8Tag: "", ch8Title: "", ch9Tag: "", ch9Title: "",
      ch10Tag: "अध्याय 08 • व्यक्तिगत वर्ष", ch10Title: `वर्ष ${ctx.numData.currentYear} का प्रभाव`,
      ch11Title: "⚠️ 3 अंक-जनित अवरोध"
    };
    const numLabelsEn = {
      ch1Tag: "Chapter 01 • Chaldean Numerology", ch1Title: "Your Number-Born Personality & Psychic Character",
      ch2Tag: "Chapter 02 • Intellect & Learning", ch2Title: "Your Learning Style & Intelligence Type",
      ch3Tag: "Chapter 03 • Career", ch3Title: "Your Professional Direction & Success",
      ch4Tag: "Chapter 04 • Wealth", ch4Title: "Money Flow & Prosperity Cycles",
      ch5Tag: "Chapter 05 • Destiny & Cycles", ch5Title: "Golden Years & Personal Year Cycle",
      ch6Tag: "Chapter 06 • Love", ch6Title: "Your Love Nature & Relationship Patterns",
      ch7Tag: "Chapter 07 • Partner", ch7Title: "Your Partner's Likely Temperament",
      ch8Tag: "", ch8Title: "", ch9Tag: "", ch9Title: "",
      ch10Tag: "Chapter 08 • Personal Year", ch10Title: `Year ${ctx.numData.currentYear} Influence`,
      ch11Title: "⚠️ 3 Number-Born Blockages"
    };
    if (isNum) {
      const labels = lang === "hi" ? numLabelsHi : numLabelsEn;
      Object.keys(labels).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = labels[id];
      });
    } else {
      const vedLabels = lang === "hi" ? {
        ch1Tag: "अध्याय 01 • आंतरिक मनोविज्ञान", ch1Title: "आपका अनकहा व्यक्तित्व",
        ch2Tag: "अध्याय 02 • मेधा एवं शिक्षा", ch2Title: "शिक्षा एवं बौद्धिक डीएनए",
        ch3Tag: "अध्याय 03 • कर्म", ch3Title: "करियर एवं कार्यक्षेत्र",
        ch4Tag: "अध्याय 04 • धन", ch4Title: "धन योग एवं संपत्ति",
        ch5Tag: "अध्याय 05 • भाग्य", ch5Title: "भाग्य एवं निर्णायक वर्ष",
        ch6Tag: "अध्याय 06 • प्रेम", ch6Title: "प्रेम एवं भावनात्मक पैटर्न",
        ch7Tag: "अध्याय 07 • जीवनसाथी", ch7Title: "भावी जीवनसाथी",
        ch8Tag: "अध्याय 08 • नवग्रह", ch8Title: "सभी 9 ग्रह एवं दृष्टियां",
        ch9Tag: "अध्याय 09 • विशेष लग्न", ch9Title: "विशेष लग्न एवं अष्टकवर्ग",
        ch10Tag: "अध्याय 10 • समय चक्र", ch10Title: "महादशा एवं अंतर्दशा",
        ch11Title: "⚠️ 3 गुप्त ग्रह-अवरोध"
      } : {
        ch1Tag: "Chapter 01 • Inner Psychology", ch1Title: "Your Unspoken Personality",
        ch2Tag: "Chapter 02 • Intellect", ch2Title: "Education & Intellectual DNA",
        ch3Tag: "Chapter 03 • Karma", ch3Title: "Career & Professional Destiny",
        ch4Tag: "Chapter 04 • Wealth", ch4Title: "Wealth & Asset Flow",
        ch5Tag: "Chapter 05 • Destiny", ch5Title: "Luck & Turning Points",
        ch6Tag: "Chapter 06 • Love", ch6Title: "Love & Emotional Patterns",
        ch7Tag: "Chapter 07 • Partner", ch7Title: "Future Life Partner",
        ch8Tag: "Chapter 08 • Planets", ch8Title: "All 9 Planets & Aspects",
        ch9Tag: "Chapter 09 • Special Lagnas", ch9Title: "Special Lagnas & Ashtakavarga",
        ch10Tag: "Chapter 10 • Time Phase", ch10Title: "Mahadasha & Antardasha",
        ch11Title: "⚠️ 3 Hidden Astrological Traps"
      };
      Object.keys(vedLabels).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = vedLabels[id];
      });
    }

    // Update masthead
    const badge = document.getElementById("dossierBadgeMode");
    const nameEl = document.getElementById("dossierHeaderName");
    const subEl = document.getElementById("dossierHeaderSubtext");
    if (badge) {
      badge.innerHTML = ctx.mode === "vedic"
        ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "पूर्ण वैदिक कुंडली" : "Full Vedic Chart"}`
        : `<i class="fas fa-hashtag mr-1.5"></i> ${lang === "hi" ? "चैल्डियन अंक रीडिंग" : "Chaldean Numerology Reading"}`;
    }
    if (nameEl) nameEl.textContent = lang === "hi" ? `${ctx.name} की व्यक्तिगत कुंडली` : `${ctx.name}'s Personal Dossier`;
    if (subEl) {
      if (ctx.mode === "vedic") {
        const ascN = lang === "hi" ? RASHI_DATA[ctx.chart.Asc.d1].hi : RASHI_DATA[ctx.chart.Asc.d1].en;
        const moonN = lang === "hi" ? RASHI_DATA[ctx.chart.Moon.d1].hi : RASHI_DATA[ctx.chart.Moon.d1].en;
        subEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob}</strong> • लग्न: <strong>${ascN}</strong> • चंद्र: <strong>${moonN}</strong> • दशा: <strong>${ctx.dasha.md}–${ctx.dasha.ad}</strong>`
          : `DOB: <strong>${ctx.dob}</strong> • Lagna: <strong>${ascN}</strong> • Moon: <strong>${moonN}</strong> • Dasha: <strong>${ctx.dasha.md}–${ctx.dasha.ad}</strong>`;
      } else {
        subEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob}</strong> • मूलांक: <strong>${ctx.numData.mulank}</strong> • भाग्यांक: <strong>${ctx.numData.bhagyank}</strong> • चैल्डियन: <strong>${ctx.chaldean.compound}→${ctx.chaldean.single}</strong>`
          : `DOB: <strong>${ctx.dob}</strong> • Mulank: <strong>${ctx.numData.mulank}</strong> • Bhagyank: <strong>${ctx.numData.bhagyank}</strong> • Chaldean: <strong>${ctx.chaldean.compound}→${ctx.chaldean.single}</strong>`;
      }
    }
  }

  function renderCalibrationBanner(ctx) {
    const el = document.getElementById("calibrationBanner");
    if (!el) return;
    if (ctx.mode === "numerology") {
      el.innerHTML = `<div class="p-3 rounded-xl bg-purple-950/60 border border-purple-400/40 text-xs text-purple-200 flex items-start gap-2">
        <i class="fas fa-info-circle mt-0.5 text-purple-400"></i>
        <div><strong>${ctx.lang === 'hi' ? 'अंक-आधारित रीडिंग' : 'Numerology-based Reading'}:</strong>
        ${ctx.lang === 'hi' ? 'लग्न, चार्ट, महादशा हेतु जन्म समय व स्थान आवश्यक।' : 'For Lagna, charts, and dasha — enter birth time + place.'}</div>
      </div>`;
    } else {
      const asc = RASHI_DATA[ctx.chart.Asc.d1].en;
      const moon = RASHI_DATA[ctx.chart.Moon.d1].en;
      el.innerHTML = `<div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs text-emerald-200 flex items-start gap-2">
        <i class="fas fa-check-circle mt-0.5 text-emerald-400"></i>
        <div><strong>${ctx.lang === 'hi' ? '✦ सटीक जन्म-समय कुंडली' : '✦ Exact Birth Chart Active'}:</strong>
        Lagna: <strong>${asc}</strong> · Moon: <strong>${moon}</strong> · Dasha: <strong>${ctx.dasha.md}–${ctx.dasha.ad}</strong></div>
      </div>`;
    }
  }

  function renderModeToggle(ctx) {
    const el = document.getElementById("modeToggleContainer");
    if (!el) return;
    if (!window.__jtVedicData) { el.innerHTML = ""; el.classList.add("hidden"); return; }
    el.classList.remove("hidden");
    const isNum = ctx.mode === "numerology";
    el.innerHTML = `<div class="flex items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-white/15 w-fit">
      <button onclick="switchDossierView('numerology')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${isNum ? 'bg-purple-600 text-white' : 'text-gray-300'}">
        ${ctx.lang === 'hi' ? 'अंक रीडिंग' : 'Numerology'}
      </button>
      <button onclick="switchDossierView('vedic')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${!isNum ? 'bg-amber-500 text-slate-950' : 'text-gray-300'}">
        ${ctx.lang === 'hi' ? '✦ वैदिक चार्ट' : '✦ Vedic Chart'}
      </button>
    </div>`;
  }

  function renderVedicExtraSections(ctx) {
    const el = document.getElementById("vedicChartsContainer");
    if (!el) return;
    if (ctx.mode !== "vedic" || !ctx.vedicData) { el.innerHTML = ""; el.classList.add("hidden"); return; }
    el.classList.remove("hidden");
    const vd = ctx.vedicData;
    el.innerHTML = `
      <div class="rounded-3xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-white/10">
          <h3 class="text-lg md:text-2xl font-bold text-white"><i class="fas fa-star text-amber-400 mr-2"></i>${ctx.lang === 'hi' ? 'जन्म चार्ट (D1 + D9)' : 'Birth Charts (D1 + D9)'}</h3>
          <button onclick="saveChartAsPNG('d1ChartWrapper','D1-Chart')" class="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold">
            <i class="fas fa-download mr-1"></i>${ctx.lang === 'hi' ? 'PNG' : 'Save PNG'}
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div id="d1ChartWrapper" class="rounded-xl overflow-hidden border border-purple-400/30 bg-white p-1">${vd.d1SVG}</div>
          <div id="d9ChartWrapper" class="rounded-xl overflow-hidden border border-amber-400/30 bg-white p-1">${vd.d9SVG}</div>
        </div>
        <p class="text-[11px] text-center text-gray-400 mt-3">${ctx.lang === 'hi' ? 'D1 = भौतिक जीवन · D9 = 30 वर्ष एवं विवाह के बाद' : 'D1 = physical life · D9 = after age 30 & marriage'}</p>
      </div>
      <div class="rounded-3xl bg-slate-950/90 border border-cyan-400/40 p-4 md:p-6 mb-6">
        <h3 class="text-lg md:text-2xl font-bold text-white mb-3"><i class="fas fa-bolt text-cyan-400 mr-2"></i>${ctx.lang === 'hi' ? 'ग्रह-बल' : 'Planet Strength'}</h3>
        ${window.VedicChartAnalyzer.renderShadbalaBars(vd.shadbala, ctx.lang)}
      </div>
      <div class="rounded-3xl bg-slate-950/90 border border-indigo-400/40 p-4 md:p-6 mb-6">
        <h3 class="text-lg md:text-2xl font-bold text-white mb-3"><i class="fas fa-columns text-indigo-400 mr-2"></i>${ctx.lang === 'hi' ? 'चलित तालिका' : 'Bhava Chalit'}</h3>
        ${window.VedicChartAnalyzer.renderChalitTable(vd.chalit, ctx.lang)}
      </div>
      <div class="rounded-3xl bg-slate-950/90 border border-emerald-400/40 p-4 md:p-6 mb-6">
        <h3 class="text-lg md:text-2xl font-bold text-white mb-3"><i class="fas fa-hourglass-half text-emerald-400 mr-2"></i>${ctx.lang === 'hi' ? 'विंशोत्तरी दशा सारणी' : 'Vimshottari Dasha Timeline'}</h3>
        ${window.VedicChartAnalyzer.renderDashaTimeline(vd.dasha, ctx.lang)}
      </div>
    `;
  }

  function hideNonApplicableChapters(ctx) {
    const isNum = ctx.mode === "numerology";
    const ch8 = document.getElementById("chapter-planets");
    const ch9 = document.getElementById("chapter-lagnas");
    if (ch8) ch8.style.display = isNum ? "none" : "";
    if (ch9) ch9.style.display = isNum ? "none" : "";
    const nav = document.querySelector(".chapter-nav-pill")?.parentElement;
    if (nav) {
      nav.innerHTML = isNum
        ? `<a href="#chapter-personality" class="chapter-nav-pill">1. ${ctx.lang === 'hi' ? 'व्यक्तित्व' : 'Personality'}</a>
           <a href="#chapter-education" class="chapter-nav-pill">2. ${ctx.lang === 'hi' ? 'शिक्षा' : 'Education'}</a>
           <a href="#chapter-career" class="chapter-nav-pill">3. ${ctx.lang === 'hi' ? 'करियर' : 'Career'}</a>
           <a href="#chapter-wealth" class="chapter-nav-pill">4. ${ctx.lang === 'hi' ? 'धन' : 'Wealth'}</a>
           <a href="#chapter-luck" class="chapter-nav-pill">5. ${ctx.lang === 'hi' ? 'भाग्य' : 'Luck'}</a>
           <a href="#chapter-love" class="chapter-nav-pill">6. ${ctx.lang === 'hi' ? 'प्रेम' : 'Love'}</a>
           <a href="#chapter-partner" class="chapter-nav-pill">7. ${ctx.lang === 'hi' ? 'जीवनसाथी' : 'Partner'}</a>
           <a href="#chapter-timephase" class="chapter-nav-pill">8. ${ctx.lang === 'hi' ? 'व्यक्तिगत वर्ष' : 'Personal Year'}</a>
           <a href="#chapter-traps" class="chapter-nav-pill text-red-300">⚠️ ${ctx.lang === 'hi' ? 'अवरोध' : 'Traps'}</a>
           <a href="#chapter-dakshina" class="chapter-nav-pill text-amber-300">🙏 ${ctx.lang === 'hi' ? 'दक्षिणा' : 'Dakshina'}</a>`
        : `<a href="#chapter-personality" class="chapter-nav-pill">1. Personality</a>
           <a href="#chapter-education" class="chapter-nav-pill">2. Education</a>
           <a href="#chapter-career" class="chapter-nav-pill">3. Career</a>
           <a href="#chapter-wealth" class="chapter-nav-pill">4. Wealth</a>
           <a href="#chapter-luck" class="chapter-nav-pill">5. Luck</a>
           <a href="#chapter-love" class="chapter-nav-pill">6. Love</a>
           <a href="#chapter-partner" class="chapter-nav-pill">7. Partner</a>
           <a href="#chapter-planets" class="chapter-nav-pill">8. Planets</a>
           <a href="#chapter-lagnas" class="chapter-nav-pill">9. Lagnas</a>
           <a href="#chapter-timephase" class="chapter-nav-pill">10. Dasha</a>
           <a href="#chapter-traps" class="chapter-nav-pill text-red-300">⚠️ Traps</a>
           <a href="#chapter-dakshina" class="chapter-nav-pill text-amber-300">🙏 Dakshina</a>`;
    }
  }

  function updateReadingMetricsBadge(lang) {
    const c = document.getElementById("masterDossierOutput");
    const b = document.getElementById("readingTimeEstimate");
    if (!c || !b) return;
    const wc = (c.innerText || "").trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(20, Math.min(48, Math.round(wc / 130) + 8));
    b.innerHTML = lang === "hi" ? `~${mins} मिनट` : `~${mins} Mins`;
  }

  // Expose switcher
  window.switchDossierView = function(mode) {
    if (!window.__jtVedicData) { alert("Vedic chart data not available."); return; }
    window.__jtMode = mode;
    window.generateCompleteLifeDossier(null, { preserveScroll: true });
  };

  window.saveChartAsPNG = function(id, prefix) {
    const el = document.getElementById(id);
    if (!el || typeof html2canvas !== "function") { alert("Image export not available."); return; }
    html2canvas(el, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `Jyotish_Tark_${prefix}.png`;
      a.click();
    });
  };

  // ==========================================================================
  // 8. MASTER ENTRY POINT
  // ==========================================================================
  window.generateCompleteLifeDossier = function (event, options) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    const preserveScroll = options && options.preserveScroll === true;

    const nameInput = document.getElementById("userName")?.value.trim() || "Seeker";
    const dobInput = document.getElementById("userDob")?.value || "1998-01-24";
    const langInput = document.getElementById("reportLang")?.value || "en";
    const genderInput = document.getElementById("userGender")?.value || "male";

    const chaldean = calculateChaldeanName(nameInput);
    const numData = calculateNumerologyFromDob(dobInput);

    const mode = (window.__jtMode === "vedic" && window.__jtVedicData) ? "vedic" : "numerology";

    let chart, planetAnalysis, specialLagnas, dasha, vedicData;

    if (mode === "vedic") {
      vedicData = window.__jtVedicData;
      // Convert birth-chart-calculator output to kundali-engine format
      const converted = { isFullChartMode: true };
      ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].forEach(k => {
        converted[k] = {
          d1: vedicData.chart[k].rashi,
          nak: vedicData.chart[k].nakshatra,
          d9: vedicData.chart[k].d9,
          retro: vedicData.chart[k].retro
        };
      });
      chart = converted;
      planetAnalysis = analyzeAllPlanetsAndAspects(chart);
      specialLagnas = computeSpecialLagnasAndBindus(chart);
      dasha = {
        md: vedicData.dasha.mahadasha,
        ad: vedicData.dasha.antardasha,
        nextMD: null,
        isManualDasha: false,
        birthDashaRuler: NAKSHATRA_DATA[chart.Moon.nak].ruler
      };
    } else {
      chart = null;
      planetAnalysis = null;
      specialLagnas = null;
      dasha = null;
    }

    const ctx = { name: nameInput, dob: dobInput, lang: langInput, gender: genderInput, chaldean, numData, chart, planetAnalysis, specialLagnas, dasha, mode, vedicData };
    window.__jyotishLastCtx = ctx;

    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    updateHeadingsForMode(langInput, ctx);

    if (mode === "numerology") {
      setHtml("contentPersonality", buildCh1Numerology(ctx));
      setHtml("contentEducation", buildCh2Numerology(ctx));
      setHtml("contentCareer", buildCh3Numerology(ctx));
      setHtml("contentWealth", buildCh4Numerology(ctx));
      setHtml("contentLuck", buildCh5Numerology(ctx));
      setHtml("contentLove", buildCh6Numerology(ctx));
      setHtml("contentPartner", buildCh7Numerology(ctx));
      setHtml("contentPlanetsAspects", "");
      setHtml("contentSpecialLagnas", "");
      setHtml("contentTimePhase", buildCh10Numerology(ctx));
      setHtml("contentHiddenTraps", buildCh11Numerology(ctx));
    } else {
      setHtml("contentPersonality", buildChapter1Personality(ctx));
      setHtml("contentEducation", buildChapter2Education(ctx));
      setHtml("contentCareer", buildChapter3Career(ctx));
      setHtml("contentWealth", buildChapter4Wealth(ctx));
      setHtml("contentLuck", buildChapter5Luck(ctx));
      setHtml("contentLove", buildChapter6Love(ctx));
      setHtml("contentPartner", buildChapter7Partner(ctx));
      setHtml("contentPlanetsAspects", buildChapter8PlanetsAndAspects(ctx));
      setHtml("contentSpecialLagnas", buildChapter9SpecialLagnas(ctx));
      setHtml("contentTimePhase", buildChapter10TimePhase(ctx));
      setHtml("contentHiddenTraps", buildChapter11HiddenTraps(ctx));
    }

    updateChapter12Dakshina(ctx);
    renderVedicExtraSections(ctx);
    renderCalibrationBanner(ctx);
    renderModeToggle(ctx);
    hideNonApplicableChapters(ctx);

    const mName = document.getElementById("name");
    const mDob = document.getElementById("dob");
    const mGender = document.getElementById("gender");
    if (mName) mName.value = nameInput;
    if (mDob) mDob.value = dobInput;
    if (mGender) mGender.value = genderInput;

    const outputContainer = document.getElementById("masterDossierOutput");
    if (outputContainer) {
      outputContainer.classList.remove("hidden");
      updateReadingMetricsBadge(langInput);
      if (!preserveScroll) {
        setTimeout(() => outputContainer.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.getElementById("reportLang");
    if (langSelect) {
      langSelect.addEventListener("change", () => {
        const outputContainer = document.getElementById("masterDossierOutput");
        if (outputContainer && !outputContainer.classList.contains("hidden")) {
          window.generateCompleteLifeDossier(null, { preserveScroll: true });
        }
      });
    }
  });

})();
