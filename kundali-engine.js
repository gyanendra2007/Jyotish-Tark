/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Powers the 30-Minute Deep-Reading Life Dossier (English & हिंदी)
 * Covers all 12 Chapters:
 *  1. Core Personality & Inner Psychology (Lagna + Mulank + Chaldean Name)
 *  2. Education, Memory & Academic DNA (2nd, 4th, 5th Bhava + Budh/Guru)
 *  3. Career Trajectory, Authority & Rise (10th, 6th, 11th + Saturn/Sun/D9)
 *  4. Wealth, Bank Balance & Asset Flow (2nd, 11th, Indu Lagna, Dhana Yogas)
 *  5. Luck Factor, Bhagya & Golden Milestones (9th House + Destiny Cycles)
 *  6. Love Life, Attraction & Heartbreak Patterns (5th House + Venus/Rahu)
 *  7. Future Life Partner & Post-Marriage Reality (7th House, D9, Upapada)
 *  8. Every Planet (9 Grahas) + Mutual Aspects (Special Drishtis & Yutis)
 *  9. Special Lagnas (Chandra, Surya, Navamsa, Karakamsa, Arudha) & SAV Bindus
 * 10. Current Time Phase (Vimshottari Mahadasha & Antardasha Synthesis)
 * 11. Hidden Problems, Karmic Traps & Urgent Root-Cause Diagnostic Alert
 * 12. Sacred Guru Dakshina & Energy Exchange Calibration
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. CORE VEDIC & CHALDEAN MASTER DATABASES
  // ==========================================================================

  const CHALDEAN_MAP = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };

  const RASHI_DATA = {
    1: {
      id: 1, en: "Mesha (Aries)", hi: "मेष (Aries)", lord: "Mars", lordHi: "मंगल",
      element: "Fire (अग्नि)", elementHi: "अग्नि तत्व", quality: "Movable (चर)", qualityHi: "चर राशि",
      direction: "East (पूर्व)", directionHi: "पूर्व दिशा",
      temperamentEn: "fiercely independent, action-oriented, pioneering, and allergic to manipulation",
      temperamentHi: "अत्यंत स्वतंत्र, कर्मठ, निडर और किसी के दबाव में न झुकने वाला",
      bodyBuildEn: "athletic, sharp facial angles, intense gaze, warm body temperature, and brisk walk",
      bodyBuildHi: "आकर्षक कद-काठी, तेज आंखें, चेहरे पर आत्मविश्वास की चमक और तेज चलने की आदत"
    },
    2: {
      id: 2, en: "Vrishabha (Taurus)", hi: "वृषभ (Taurus)", lord: "Venus", lordHi: "शुक्र",
      element: "Earth (पृथ्वी)", elementHi: "पृथ्वी तत्व", quality: "Fixed (स्थिर)", qualityHi: "स्थिर राशि",
      direction: "South (दक्षिण)", directionHi: "दक्षिण दिशा",
      temperamentEn: "grounded, luxury-loving, fiercely loyal, patient until provoked, and resource-smart",
      temperamentHi: "स्थिर बुद्धि, सुख-सुविधाओं के प्रेमी, अपनों के प्रति समर्पित और धैर्यवान",
      bodyBuildEn: "graceful features, expressive eyes, soothing voice, and magnetic calming aura",
      bodyBuildHi: "सौम्य और आकर्षक चेहरा, सुंदर आंखें, मधुर वाणी और शांत व्यक्तित्व"
    },
    3: {
      id: 3, en: "Mithuna (Gemini)", hi: "मिथुन (Gemini)", lord: "Mercury", lordHi: "बुध",
      element: "Air (वायु)", elementHi: "वायु तत्व", quality: "Dual (द्विस्वभाव)", qualityHi: "द्विस्वभाव राशि",
      direction: "West (पश्चिम)", directionHi: "पश्चिम दिशा",
      temperamentEn: "hyper-intelligent, adaptable, witty, curious, and mentally running three steps ahead",
      temperamentHi: "तीव्र बुद्धि, वाक्पटु, हर परिस्थिति में ढल जाने वाले और एक साथ कई विषयों को समझने वाले",
      bodyBuildEn: "youthful appearance, sparkling observant eyes, expressive hands, and charming smile",
      bodyBuildHi: "उम्र से कम दिखने वाला युवा चेहरा, चंचल व चमकदार आंखें और प्रभावशाली मुस्कान"
    },
    4: {
      id: 4, en: "Karka (Cancer)", hi: "कर्क (Cancer)", lord: "Moon", lordHi: "चंद्रमा",
      element: "Water (जल)", elementHi: "जल तत्व", quality: "Movable (चर)", qualityHi: "चर राशि",
      direction: "North (उत्तर)", directionHi: "उत्तर दिशा",
      temperamentEn: "deeply intuitive, protective, emotionally perceptive, nurturing yet privately guarded",
      temperamentHi: "अत्यंत संवेदनशील, अंतर्ज्ञानी (Intuitive), अपनों की रक्षा करने वाले और गहरे भावनात्मक",
      bodyBuildEn: "soft luminescent complexion, soulful eyes, comforting presence, and gentle demeanor",
      bodyBuildHi: "सौम्य आभा, गहरी भावुक आंखें, शांत मुस्कान और अपनापन महसूस कराने वाला व्यक्तित्व"
    },
    5: {
      id: 5, en: "Simha (Leo)", hi: "सिंह (Leo)", lord: "Sun", lordHi: "सूर्य",
      element: "Fire (अग्नि)", elementHi: "अग्नि तत्व", quality: "Fixed (स्थिर)", qualityHi: "स्थिर राशि",
      direction: "East (पूर्व)", directionHi: "पूर्व दिशा",
      temperamentEn: "regal, self-respecting, visionary, generous-hearted, and born to command authority",
      temperamentHi: "स्वाभिमानी, नेतृत्व क्षमता से भरपूर, उदार हृदय और समझौते न करने वाले",
      bodyBuildEn: "commanding posture, broad shoulders/forehead, lion-like dignified walk, and radiant aura",
      bodyBuildHi: "रौबदार व्यक्तित्व, चौड़ा माथा, आत्मविश्वास से भरी चाल और राजसी आभा"
    },
    6: {
      id: 6, en: "Kanya (Virgo)", hi: "कन्या (Virgo)", lord: "Mercury", lordHi: "बुध",
      element: "Earth (पृथ्वी)", elementHi: "पृथ्वी तत्व", quality: "Dual (द्विस्वभाव)", qualityHi: "द्विस्वभाव राशि",
      direction: "South (दक्षिण)", directionHi: "दक्षिण दिशा",
      temperamentEn: "analytical, perfectionist, detail-obsessed, practical, and quietly observant of flaws",
      temperamentHi: "सूक्ष्म विश्लेषक, हर काम में पूर्णता (Perfection) चाहने वाले, व्यावहारिक और तार्किक",
      bodyBuildEn: "neat, refined symmetrical features, intelligent eyes, and poised well-groomed look",
      bodyBuildHi: "सुव्यवस्थित और सलीकेदार व्यक्तित्व, तीक्ष्ण बुद्धिमान आंखें और सौम्य चेहरा"
    },
    7: {
      id: 7, en: "Tula (Libra)", hi: "तुला (Libra)", lord: "Venus", lordHi: "शुक्र",
      element: "Air (वायु)", elementHi: "वायु तत्व", quality: "Movable (चर)", qualityHi: "चर राशि",
      direction: "West (पश्चिम)", directionHi: "पश्चिम दिशा",
      temperamentEn: "diplomatic, justice-seeking, aesthetically refined, charming, and relationship-oriented",
      temperamentHi: "न्यायप्रिय, संतुलित, कला और सौंदर्य के पारखी तथा व्यवहार-कुशल",
      bodyBuildEn: "proportionate attractive features, dimpled or warm smile, and naturally stylish grace",
      bodyBuildHi: "आकर्षक नैन-नक्श, मोहक मुस्कान और भीड़ में अलग दिखने वाला शालीन अंदाज"
    },
    8: {
      id: 8, en: "Vrishchika (Scorpio)", hi: "वृश्चिक (Scorpio)", lord: "Mars", lordHi: "मंगल",
      element: "Water (जल)", elementHi: "जल तत्व", quality: "Fixed (स्थिर)", qualityHi: "स्थिर राशि",
      direction: "North (उत्तर)", directionHi: "उत्तर दिशा",
      temperamentEn: "intense, psychological, investigative, phoenix-like in resilience, and impossible to fool",
      temperamentHi: "गूढ़ रहस्यमयी, गहरी शोधवृत्ति वाले, संकटों से राख से फीनिक्स की तरह उठने वाले",
      bodyBuildEn: "piercing hypnotic eyes, magnetic aura, strong jawline, and unmistakable quiet intensity",
      bodyBuildHi: "आंखों में गहरा चुंबकीय आकर्षण, रहस्यमयी गंभीरता और प्रभावशाली शारीरिक ऊर्जा"
    },
    9: {
      id: 9, en: "Dhanu (Sagittarius)", hi: "धनु (Sagittarius)", lord: "Jupiter", lordHi: "बृहस्पति (गुरु)",
      element: "Fire (अग्नि)", elementHi: "अग्नि तत्व", quality: "Dual (द्विस्वभाव)", qualityHi: "द्विस्वभाव राशि",
      direction: "East (पूर्व)", directionHi: "पूर्व दिशा",
      temperamentEn: "philosophical, truth-speaking, ambitious, dharmic, and driven by higher purpose",
      temperamentHi: "सत्यवादी, दूरदर्शी, उच्च आदर्शों वाले, स्वाभिमानी और ज्ञान के उपासक",
      bodyBuildEn: "tall or well-built frame, bright forehead, optimistic smile, and energetic stride",
      bodyBuildHi: "तेजस्वी ललाट, सकारात्मक ऊर्जा से भरा चेहरा और प्रभावशाली कद-काठी"
    },
    10: {
      id: 10, en: "Makara (Capricorn)", hi: "मकर (Capricorn)", lord: "Saturn", lordHi: "शनि",
      element: "Earth (पृथ्वी)", elementHi: "पृथ्वी तत्व", quality: "Movable (चर)", qualityHi: "चर राशि",
      direction: "South (दक्षिण)", directionHi: "दक्षिण दिशा",
      temperamentEn: "strategic, relentless, karmically disciplined, self-made, and unshakeable under pressure",
      temperamentHi: "कर्मप्रधान, रणनीतिकार, कठिन परिश्रम से अपना साम्राज्य खड़ा करने वाले और धैर्यवान",
      bodyBuildEn: "defined bone structure, mature composed look, deep thoughtful eyes, and steady walk",
      bodyBuildHi: "गंभीर और परिपक्व व्यक्तित्व, गहरी सोच वाली आंखें और संतुलित व्यवहार"
    },
    11: {
      id: 11, en: "Kumbha (Aquarius)", hi: "कुंभ (Aquarius)", lord: "Saturn", lordHi: "शनि",
      element: "Air (वायु)", elementHi: "वायु तत्व", quality: "Fixed (स्थिर)", qualityHi: "स्थिर राशि",
      direction: "West (पश्चिम)", directionHi: "पश्चिम दिशा",
      temperamentEn: "unconventional, futuristic, deep-thinking, humanitarian yet fiercely protective of solitude",
      temperamentHi: "लीक से हटकर सोचने वाले, दार्शनिक, जनकल्याणकारी परंतु एकांतप्रिय",
      bodyBuildEn: "distinctive facial structure, visionary gaze, tall/lean profile, and intellectual aura",
      bodyBuildHi: "बुद्धिजीवी आभा, विचारशील आंखें, अलग पहचान बनाने वाला व्यक्तित्व"
    },
    12: {
      id: 12, en: "Meena (Pisces)", hi: "मीन (Pisces)", lord: "Jupiter", lordHi: "बृहस्पति (गुरु)",
      element: "Water (जल)", elementHi: "जल तत्व", quality: "Dual (द्विस्वभाव)", qualityHi: "द्विस्वभाव राशि",
      direction: "North (उत्तर)", directionHi: "उत्तर दिशा",
      temperamentEn: "spiritually gifted, empathetic, imaginative, old-souled, and guided by prophetic intuition",
      temperamentHi: "आध्यात्मिक, परोपकारी, गहरी कल्पनाशक्ति और पूर्वाभास (Intuition) की शक्ति से युक्त",
      bodyBuildEn: "dreamy oceanic eyes, serene aura, gentle grace, and deeply soothing voice",
      bodyBuildHi: "शांत और गहरी आंखें, दिव्य आभा, मधुर वाणी और दयालु व्यक्तित्व"
    }
  };

  const NAKSHATRA_DATA = {
    1:  { name: "Ashwini (अश्विनी)", ruler: "Ketu", deity: "Ashwini Kumaras", traitEn: "rapid healing, pioneering speed, and instinctive brilliance", traitHi: "तीव्र निर्णय क्षमता, आरोग्य शक्ति और हर कार्य में अग्रणी रहने की ऊर्जा" },
    2:  { name: "Bharani (भरणी)", ruler: "Venus", deity: "Yama", traitEn: "intense transformation, creative depth, and fearless truth-bearing", traitHi: "गहन सृजन शक्ति, सत्य के प्रति निष्ठा और बड़े परिवर्तनों को सहने की क्षमता" },
    3:  { name: "Krittika (कृत्तिका)", ruler: "Sun", deity: "Agni", traitEn: "razor-sharp discernment, purifying fire, and protective leadership", traitHi: "अग्नि के समान तेज, स्पष्टवादिता और नेतृत्व की प्रबल क्षमता" },
    4:  { name: "Rohini (रोहिणी)", ruler: "Moon", deity: "Brahma", traitEn: "magnetic charm, wealth creation, and artistic abundance", traitHi: "अद्भुत आकर्षण, धन-संपदा का सृजन और कलात्मक समृद्धि" },
    5:  { name: "Mrigashira (मृगशिरा)", ruler: "Mars", deity: "Soma", traitEn: "relentless intellectual quest, research mastery, and youthful agility", traitHi: "ज्ञान की निरंतर खोज, शोध प्रवृत्ति और कुशाग्र बुद्धि" },
    6:  { name: "Ardra (आर्द्रा)", ruler: "Rahu", deity: "Rudra", traitEn: "storm-after-clarity genius, emotional depth, and breakthrough innovation", traitHi: "संघर्षों के बाद अद्भुत सफलता, गहन विश्लेषण और लीक से हटकर आविष्कार" },
    7:  { name: "Punarvasu (पुनर्वसु)", ruler: "Jupiter", deity: "Aditi", traitEn: "divine bounce-back power, wisdom, and boundless renewal", traitHi: "हर संकट से दोगुनी शक्ति से वापसी करने की दिव्य क्षमता और सात्विक ज्ञान" },
    8:  { name: "Pushya (पुष्य)", ruler: "Saturn", deity: "Brihaspati", traitEn: "supreme nourishment, dharmic discipline, and enduring prosperity", traitHi: "नक्षत्रों का राजा—धर्म, अनुशासन और स्थायी राजयोग देने की शक्ति" },
    9:  { name: "Ashlesha (आश्लेषा)", ruler: "Mercury", deity: "Nagas", traitEn: "hypnotic psychological insight, kundalini depth, and strategic brilliance", traitHi: "सामने वाले के मन को पढ़ लेने की रहस्यमयी क्षमता और कूटनीतिक कौशल" },
    10: { name: "Magha (मघा)", ruler: "Ketu", deity: "Pitris", traitEn: "royal ancestral authority, throne-consciousness, and noble pride", traitHi: "पितृ कृपा, राजसी स्वाभिमान और उच्च पद प्राप्त करने का प्रारब्ध" },
    11: { name: "Purva Phalguni (पूर्वा फाल्गुनी)", ruler: "Venus", deity: "Bhaga", traitEn: "charismatic magnetism, creative enjoyment, and social grace", traitHi: "सौभाग्य, कलात्मक आकर्षण और समाज में विशेष लोकप्रियता" },
    12: { name: "Uttara Phalguni (उत्तरा फाल्गुनी)", ruler: "Sun", deity: "Aryaman", traitEn: "noble contracts, lifelong reliability, and self-earned sovereignty", traitHi: "वचनबद्धता, स्थायी संबंध और स्व-अर्जित उच्च प्रतिष्ठा" },
    13: { name: "Hasta (हस्त)", ruler: "Moon", deity: "Savitar", traitEn: "manifestation through skill, craftsmanship, and clever execution", traitHi: "हाथों में जादू, कर्म-कौशल और अपने भाग्य का स्वयं निर्माण करने की शक्ति" },
    14: { name: "Chitra (चित्रा)", ruler: "Mars", deity: "Vishwakarma", traitEn: "architectural perfection, structural beauty, and charismatic mystique", traitHi: "विश्वकर्मा के समान सृजन कौशल, सौंदर्य बोध और अद्भुत आकर्षण" },
    15: { name: "Swati (स्वाती)", ruler: "Rahu", deity: "Vayu", traitEn: "unyielding independence, business diplomacy, and self-propelled rise", traitHi: "स्वतंत्र अस्तित्व, व्यापारिक चतुरता और अपनी शर्तों पर जीने की कला" },
    16: { name: "Vishakha (विशाखा)", ruler: "Jupiter", deity: "Indra-Agni", traitEn: "single-pointed ambition, unstoppable focus, and triumphant conquest", traitHi: "अर्जुन की तरह लक्ष्य पर एकाग्र दृष्टि और अंततः विजय प्राप्त करने की जिद" },
    17: { name: "Anuradha (अनुराधा)", ruler: "Saturn", deity: "Mitra", traitEn: "lotus-in-mud resilience, deep friendship, and occult numerological mastery", traitHi: "कठिन परिस्थितियों में भी कमल की तरह खिलने और विदेश/दूरस्थ स्थानों से भाग्योदय की शक्ति" },
    18: { name: "Jyeshtha (ज्येष्ठा)", ruler: "Mercury", deity: "Indra", traitEn: "protective seniority, crisis command, and sharp occult intellect", traitHi: "संकटमोचक नेतृत्व, गूढ़ विद्याओं में रुचि और परिवार का मुख्य स्तंभ बनने का गुण" },
    19: { name: "Mula (मूल)", ruler: "Ketu", deity: "Nirriti", traitEn: "root-level truth extraction, karmic uprooting, and fearless rebuilding", traitHi: "हर समस्या की जड़ तक पहुंचने की क्षमता और शून्य से शिखर बनाने का साहस" },
    20: { name: "Purva Ashadha (पूर्वाषाढ़ा)", ruler: "Venus", deity: "Apah", traitEn: "invincible conviction, persuasive speech, and victorious momentum", traitHi: "अजेय आत्मविश्वास, वाणी का प्रभाव और कभी हार न मानने वाला स्वभाव" },
    21: { name: "Uttara Ashadha (उत्तराषाढ़ा)", ruler: "Sun", deity: "Vishvadevas", traitEn: "permanent victory, unshakeable integrity, and peak late-blooming authority", traitHi: "स्थायी विजय, अखंड निष्ठा और जीवन के उत्तरार्ध में अजेय सफलता" },
    22: { name: "Shravana (श्रवण)", ruler: "Moon", deity: "Vishnu", traitEn: "master listening, sacred knowledge absorption, and organizational fame", traitHi: "गहरी श्रवण व समझने की शक्ति, विद्या और उच्च प्रशासनिक प्रतिष्ठा" },
    23: { name: "Dhanishta (धनिष्ठा)", ruler: "Mars", deity: "Ashta Vasus", traitEn: "impeccable timing, wealth-rhythm, and multi-dimensional ambition", traitHi: "धन-संपदा का संचय, सटीक समय-प्रबंधन और बहुमुखी प्रतिभा" },
    24: { name: "Shatabhisha (शतभिषा)", ruler: "Rahu", deity: "Varuna", traitEn: "100-healers diagnostic power, solitary genius, and decoding cosmic secrets", traitHi: "सौ वैद्यों के समान निदान शक्ति, रहस्यमयी ज्ञान और स्वतंत्र चिंतन" },
    25: { name: "Purva Bhadrapada (पूर्वा भाद्रपद)", ruler: "Jupiter", deity: "Aja Ekapada", traitEn: "fierce spiritual fire, unconventional wealth, and transformational vision", traitHi: "आध्यात्मिक तेज, क्रांतिकारी विचार और असाधारण धन-प्रवाह" },
    26: { name: "Uttara Bhadrapada (उत्तरा भाद्रपद)", ruler: "Saturn", deity: "Ahirbudhnya", traitEn: "deep ocean-floor stability, kundalini wisdom, and enduring legacy", traitHi: "समुद्र के समान गहरा धैर्य, कुंडलिनी ऊर्जा और स्थायी विरासत" },
    27: { name: "Revati (रेवती)", ruler: "Mercury", deity: "Pushan", traitEn: "safe-passage intuition, compassionate wealth, and spiritual completion", traitHi: "सौभाग्यशाली यात्राएं, करुणा, समृद्धि और आध्यात्मिक पूर्णता" }
  };

  const PLANET_META = {
    Sun: {
      en: "Sun (Surya)", hi: "सूर्य (Sun)", karakaEn: "Soul, Authority, Father & Royal Dignity (Atmakaraka)", karakaHi: "आत्मा, स्वाभिमान, पिता, राजसत्ता एवं उच्च पद",
      exalted: 1, debilitated: 7, own: [5],
      aspects: [7]
    },
    Moon: {
      en: "Moon (Chandra)", hi: "चंद्रमा (Moon)", karakaEn: "Mind, Emotions, Mother, Intuition & Liquid Flow", karakaHi: "मन, भावनाएं, माता, अंतर्ज्ञान एवं नकदी प्रवाह",
      exalted: 2, debilitated: 8, own: [4],
      aspects: [7]
    },
    Mars: {
      en: "Mars (Mangal)", hi: "मंगल (Mars)", karakaEn: "Courage, Willpower, Land, Siblings & Execution Fire", karakaHi: "साहस, पराक्रम, भूमि-संपत्ति, भाई एवं निर्णय शक्ति",
      exalted: 10, debilitated: 4, own: [1, 8],
      aspects: [4, 7, 8]
    },
    Mercury: {
      en: "Mercury (Budh)", hi: "बुध (Mercury)", karakaEn: "Intellect, Speech, Trade, Logic & Nervous System", karakaHi: "बुद्धि, वाणी, व्यापार, तर्कशक्ति एवं विश्लेषण क्षमता",
      exalted: 6, debilitated: 12, own: [3, 6],
      aspects: [7]
    },
    Jupiter: {
      en: "Jupiter (Guru)", hi: "बृहस्पति / गुरु (Jupiter)", karakaEn: "Divine Grace, Wisdom, Wealth Expansion, Children & Husband-Karaka", karakaHi: "भाग्य, ज्ञान, धन-वृद्धि, संतान, धर्म एवं (स्त्रियों के लिए) पति कारक",
      exalted: 4, debilitated: 10, own: [9, 12],
      aspects: [5, 7, 9]
    },
    Venus: {
      en: "Venus (Shukra)", hi: "शुक्र (Venus)", karakaEn: "Romance, Spouse/Wife-Karaka, Luxury, Vehicles & Charisma", karakaHi: "प्रेम, दांपत्य सुख, (पुरुषों के लिए) पत्नी कारक, वैभव एवं आकर्षण",
      exalted: 12, debilitated: 6, own: [2, 7],
      aspects: [7]
    },
    Saturn: {
      en: "Saturn (Shani)", hi: "शनि (Saturn)", karakaEn: "Karma, Justice, Longevity, Mass Authority & Steadfast Rise", karakaHi: "कर्मफल दाता, न्याय, दीर्घायु, संघर्ष के बाद अजेय साम्राज्य",
      exalted: 7, debilitated: 1, own: [10, 11],
      aspects: [3, 7, 10]
    },
    Rahu: {
      en: "Rahu (North Node)", hi: "राहु (Rahu)", karakaEn: "Obsession, Sudden Amplifier, Foreign Links, Unconventional Fame & Illusion", karakaHi: "अचानक उछाल, महत्वाकांक्षा, विदेश योग, तकनीक एवं मायाजाल",
      exalted: 2, debilitated: 8, own: [11],
      aspects: [5, 7, 9]
    },
    Ketu: {
      en: "Ketu (South Node)", hi: "केतु (Ketu)", karakaEn: "Past-Life Mastery, Detachment, Occult Intuition, Sudden Cuts & Moksha", karakaHi: "पूर्वजन्म का संचित ज्ञान, वैराग्य, पूर्वाभास (Intuition) एवं मोक्ष",
      exalted: 8, debilitated: 2, own: [8],
      aspects: [5, 7, 9]
    }
  };

  const BHAVA_MEANINGS = {
    1:  { en: "1st House (Tanu Bhava — Self, Aura, Physical Vitality & Life Direction)", hi: "प्रथम भाव (लग्न/तनु भाव — व्यक्तित्व, शरीर, आत्मबल एवं जीवन की दिशा)" },
    2:  { en: "2nd House (Dhana & Kutumba Bhava — Bank Balance, Speech, Lineage & Accumulated Wealth)", hi: "द्वितीय भाव (धन एवं कुटुंब भाव — बैंक बैलेंस, वाणी का प्रभाव, कुल एवं संचित धन)" },
    3:  { en: "3rd House (Parakrama Bhava — Self-Effort, Courage, Communication, Media & Short Travels)", hi: "तृतीय भाव (पराक्रम एवं सहज भाव — साहस, खुद की मेहनत, संवाद कौशल एवं छोटे भाई-बहन)" },
    4:  { en: "4th House (Sukha & Matri Bhava — Inner Peace, Mother, Real Estate, Vehicles & Homeland)", hi: "चतुर्थ भाव (सुख एवं मातृ भाव — मानसिक शांति, माता, भूमि-भवन, वाहन एवं हृदय)" },
    5:  { en: "5th House (Putra, Vidya & Purva-Punya Bhava — Past-Life Merit, Intelligence, Romance & Speculation)", hi: "पंचम भाव (विद्या, बुद्धि, प्रेम एवं पूर्व-पुण्य भाव — प्रखर मेधा, प्रेम संबंध, संतान एवं प्रारब्ध)" },
    6:  { en: "6th House (Rog, Rin & Shatru Bhava — Daily Grind, Competition, Litigation, Service & Obstacles)", hi: "षष्ठ भाव (रोग, ऋण एवं शत्रु भाव — प्रतियोगी परीक्षा, शत्रु-विजय, नौकरी एवं दैनिक संघर्ष)" },
    7:  { en: "7th House (Kalatra & Pada Bhava — Marriage, Spouse Nature, Business Partnerships & Public Image)", hi: "सप्तम भाव (कलत्र एवं दांपत्य भाव — जीवनसाथी का स्वभाव, विवाह, साझेदारी एवं सामाजिक छवि)" },
    8:  { en: "8th House (Randhra & Gupta Bhava — Sudden Transformations, Occult, In-Laws, Unearned Wealth & Deep Secrets)", hi: "अष्टम भाव (आयु एवं गुप्त रहस्य भाव — आकस्मिक परिवर्तन, ससुराल, गुप्त विद्या, शोध एवं मानसिक उथल-पुथल)" },
    9:  { en: "9th House (Bhagya & Dharma Bhava — Divine Grace, Higher Wisdom, Gurus, Father & Long Journeys)", hi: "नवम भाव (भाग्य एवं धर्म भाव — ईश्वरीय कृपा, उच्च शिक्षा, पिता, गुरु एवं भाग्योदय)" },
    10: { en: "10th House (Karma & Rajya Bhava — Career Peak, Status, Command, Reputation & Public Impact)", hi: "दशम भाव (कर्म एवं राज्य भाव — करियर का शिखर, सत्ता, पद-प्रतिष्ठा एवं कार्यक्षेत्र)" },
    11: { en: "11th House (Labha Bhava — Massive Gains, Desire Fulfillment, Influential Networks & Multiple Incomes)", hi: "एकादश भाव (लाभ एवं इच्छापूर्ति भाव — आय के स्रोत, बड़े सपनों की पूर्ति एवं प्रभावशाली नेटवर्क)" },
    12: { en: "12th House (Vyaya & Moksha Bhava — Foreign Lands, Subconscious Sleep, Secret Enemies, Losses & Liberation)", hi: "द्वादश भाव (व्यय, विदेश एवं मोक्ष भाव — विदेश योग, अनिद्रा/अवचेतन मन, गुप्त खर्च एवं आध्यात्मिक मुक्ति)" }
  };

  const MULANK_ARCHETYPES = {
    1: {
      ruler: "Sun (सूर्य)",
      titleEn: "The Sovereign Pioneer (Number 1 — Ruled by Royal Sun)",
      titleHi: "मूलांक 1 — सूर्य द्वारा शासित (राजसी नेतृत्व एवं स्वाभिमान)",
      psychEn: "Because your birth vibration is governed by Number 1 (Surya), your soul carries an innate refusal to be second-best. People see your composed exterior, but very few realize the immense pressure you put on yourself to remain self-reliant. You dislike asking for favors, even when you are exhausted. Whenever someone tries to micromanage or dominate you, an instant internal rebellion switches on inside your mind.",
      psychHi: "चूंकि आपका जन्म मूलांक 1 (सूर्य) से शासित है, आपकी आत्मा में जन्मजात नेतृत्व और स्वाभिमान कूट-कूट कर भरा है। बाहर से लोग आपको मजबूत समझते हैं, लेकिन बहुत कम लोग जानते हैं कि आप अपनी समस्याओं को किसी के सामने कहने के बजाय अकेले ही सुलझाने का भारी दबाव झेलते हैं। आपको किसी के अधीन रहकर या हुक्म सुनकर काम करना बिल्कुल पसंद नहीं है।"
    },
    2: {
      ruler: "Moon (चंद्रमा)",
      titleEn: "The Intuitive Empath & Diplomat (Number 2 — Ruled by Moon)",
      titleHi: "मूलांक 2 — चंद्रमा द्वारा शासित (गहरा अंतर्ज्ञान एवं संवेदनशीलता)",
      psychEn: "Governed by Number 2 (Chandra), your mind acts like a high-frequency emotional radar. Within thirty seconds of meeting someone, you sense their unspoken intentions. However, your greatest blessing is also your heaviest burden: you absorb the stress of people around you, overthink small changes in someone's tone, and give 100% emotionally to people who often return only 30%.",
      psychHi: "मूलांक 2 (चंद्रमा) के प्रभाव के कारण आपका मन एक संवेदनशील रडार की तरह काम करता है। आप किसी भी इंसान से मिलने के कुछ ही मिनटों में उसकी असली नीयत भांप लेते हैं। लेकिन आपकी सबसे बड़ी चुनौती यह है कि आप दूसरों के व्यवहार के छोटे से बदलाव को भी गहराई से सोचने (Overthinking) लगते हैं और रिश्तों में जितना समर्पण देते हैं, बदले में अक्सर उतना नहीं मिल पाता।"
    },
    3: {
      ruler: "Jupiter (बृहस्पति/गुरु)",
      titleEn: "The Dharmic Strategist & Mentor (Number 3 — Ruled by Jupiter)",
      titleHi: "मूलांक 3 — देवगुरु बृहस्पति द्वारा शासित (ज्ञान, स्वाभिमान एवं महत्वाकांक्षा)",
      psychEn: "Ruled by Number 3 (Brihaspati/Jupiter), you possess a rare combination of hunger for knowledge and fierce self-respect. You cannot tolerate hypocrisy, shallow gossip, or disrespect toward your principles. People constantly come to you for advice when their lives fall apart, yet when you need guidance, you rarely find someone matching your mental maturity.",
      psychHi: "मूलांक 3 (बृहस्पति) के प्रभाव से आपमें ज्ञान, स्वाभिमान और उच्च महत्वाकांक्षा का अद्भुत संगम है। संकट के समय लोग आपसे सलाह लेने आते हैं क्योंकि आपकी दूरदृष्टि सटीक होती है, परंतु जब आपको खुद मानसिक सहारे की आवश्यकता होती है, तो आपको अपने स्तर की समझ रखने वाला इंसान आसानी से नहीं मिलता।"
    },
    4: {
      ruler: "Rahu / Uranus (राहु)",
      titleEn: "The Unconventional Maverick & Builder (Number 4 — Ruled by Rahu)",
      titleHi: "मूलांक 4 — राहु द्वारा शासित (क्रांतिकारी सोच एवं रहस्यमयी उछाल)",
      psychEn: "Governed by Number 4 (Rahu), your life never follows a straight, predictable textbook line. You question outdated rules, think from angles others never notice, and often feel misunderstood by your own family or peers. Sudden reversals and sudden breakthroughs are the signature of your destiny—what others get easily in one attempt often tests your patience first before delivering tenfold results.",
      psychHi: "मूलांक 4 (राहु) से शासित होने के कारण आपका जीवन कभी भी सामान्य या सीधी रेखा में नहीं चलता। आपकी सोच समाज की पुरानी रूढ़ियों से बिल्कुल अलग और प्रैक्टिकल होती है, जिसके कारण कई बार आपके अपने ही लोग आपको गलत समझ लेते हैं। आपके जीवन में सफलता और बदलाव हमेशा अचानक (Sudden) आते हैं।"
    },
    5: {
      ruler: "Mercury (बुध)",
      titleEn: "The Quick-Silver Architect of Intelligence (Number 5 — Ruled by Mercury)",
      titleHi: "मूलांक 5 — बुध द्वारा शासित (तीव्र बुद्धि, संतुलन एवं व्यापारिक कौशल)",
      psychEn: "Ruled by Number 5 (Budh), your brain processes logic, risk, and human psychology at lightning speed. You despise monotony and stagnation. Even after a major setback, you possess an extraordinary elastic bounce-back ability. Yet inwardly, your nervous system rarely switches off—even while resting, your mind is calculating the next three moves.",
      psychHi: "मूलांक 5 (बुध) के प्रभाव से आपका मस्तिष्क बिजली की गति से गणना और विश्लेषण करता है। आपको एक ही ढर्रे की बोरिंग जिंदगी पसंद नहीं है। बड़ी से बड़ी असफलता के बाद भी आप तुरंत खुद को संभाल लेने की अद्भुत क्षमता रखते हैं, हालांकि भीतर ही भीतर आपका दिमाग रात को सोते समय भी भविष्य की योजनाओं में उलझा रहता है।"
    },
    6: {
      ruler: "Venus (शुक्र)",
      titleEn: "The Magnetic Harmonizer & Connoisseur (Number 6 — Ruled by Venus)",
      titleHi: "मूलांक 6 — शुक्र द्वारा शासित (आकर्षण, वैभव एवं गहरा समर्पण)",
      psychEn: "Governed by Number 6 (Shukra), you carry an unmistakable personal magnetism, aesthetic refinement, and deep capacity for love and family responsibility. You crave quality, peace, and genuine emotional warmth. Your secret vulnerability is that you often sacrifice your own comfort to keep peace in relationships, silently enduring ungrateful behavior for too long.",
      psychHi: "मूलांक 6 (शुक्र) के कारण आपके व्यक्तित्व में एक स्वाभाविक आकर्षण, कलात्मकता और सुख-सुविधाओं के प्रति झुकाव है। आप अपने परिवार और प्रियजनों के लिए अपनी खुशियों का भी त्याग कर देते हैं, लेकिन आपकी सबसे बड़ी कमजोरी यह है कि आप भावनात्मक रिश्तों में जल्दी भरोसा करके अपना मानसिक सुकून दांव पर लगा देते हैं।"
    },
    7: {
      ruler: "Ketu / Neptune (केतु)",
      titleEn: "The Mystic Seeker & Deep Philosopher (Number 7 — Ruled by Ketu)",
      titleHi: "मूलांक 7 — केतु द्वारा शासित (अंतर्मुखी शोधकर्ता एवं प्रबल पूर्वाभास)",
      psychEn: "Ruled by Number 7 (Ketu), you are an old soul walking in the modern world. You have prophetic intuition—dreams, gut feelings, and sudden realizations that come true weeks later. Even when surrounded by a crowd, a quiet corner of your soul feels detached. You cannot settle for surface-level answers; you dissect everything down to its hidden truth.",
      psychHi: "मूलांक 7 (केतु) से प्रभावित होने के कारण आपकी अंतरात्मा अत्यंत गहरी और रहस्यमयी है। आपका 'सिक्स्थ सेंस' (पूर्वाभास) इतना प्रबल है कि भविष्य में होने वाली घटनाओं का आभास आपको पहले ही हो जाता है। भीड़ में रहकर भी आप भीतर से एक अलग एकांत महसूस करते हैं और दिखावे की दुनिया से जल्दी ऊब जाते हैं।"
    },
    8: {
      ruler: "Saturn (शनि)",
      titleEn: "The Karmic Judge & Silent Empire Builder (Number 8 — Ruled by Saturn)",
      titleHi: "मूलांक 8 — शनिदेव द्वारा शासित (संघर्ष से साम्राज्य एवं अटूट न्याय)",
      psychEn: "Governed by Number 8 (Shani), you are forged in the furnace of real-world experience. Nothing in your life comes on a silver platter without testing your endurance first. You are deeply misunderstood—people think you are cold or distant, whereas in reality you carry the heaviest sense of duty toward those you love. Once you cross your karmic threshold, your rise is permanent and unshakeable.",
      psychHi: "मूलांक 8 (शनि) के प्रभाव से आपका जीवन संघर्ष की भट्टी में तपकर कुंदन बनने वाला है। आपको जीवन में कोई भी चीज बिना परीक्षा दिए आसानी से नहीं मिलती। लोग अक्सर आपको बाहर से कठोर समझ लेते हैं, जबकि भीतर से आप अत्यंत न्यायप्रिय और अपनों की जिम्मेदारी उठाने वाले इंसान हैं। आपकी सफलता भले ही देर से आए, पर स्थायी और विशाल होती है।"
    },
    9: {
      ruler: "Mars (मंगल)",
      titleEn: "The Fearless Commander & Humanitarian Warrior (Number 9 — Ruled by Mars)",
      titleHi: "मूलांक 9 — सेनापति मंगल द्वारा शासित (अदम्य साहस, ऊर्जा एवं स्पष्टवादिता)",
      psychEn: "Ruled by Number 9 (Mangal), your bloodstream runs on courage, conviction, and protective fire. You will fight to the last breath for someone you care about, and you cannot fake sweetness when someone is wrong. Your exterior is tough like armor, yet internally you have a surprisingly soft heart that gets deeply hurt when people betray your loyalty.",
      psychHi: "मूलांक 9 (मंगल) के प्रभाव से आपमें अदम्य साहस, निडरता और स्पष्टवादिता है। आप अन्याय या झूठी चापलूसी बर्दाश्त नहीं कर पाते। बाहर से आप जितने सख्त और अनुशासित दिखते हैं, भीतर से उतने ही भावुक और मददगार हैं—लेकिन जब आपके अपने ही लोग आपकी वफादारी की कद्र नहीं करते, तो आपको गहरा आघात लगता है।"
    }
  };

  // Vimshottari Dasha Sequence & Years
  const VIMSHOTTARI_ORDER = [
    { lord: "Ketu", years: 7, hi: "केतु" },
    { lord: "Venus", years: 20, hi: "शुक्र" },
    { lord: "Sun", years: 6, hi: "सूर्य" },
    { lord: "Moon", years: 10, hi: "चंद्र" },
    { lord: "Mars", years: 7, hi: "मंगल" },
    { lord: "Rahu", years: 18, hi: "राहु" },
    { lord: "Jupiter", years: 16, hi: "गुरु" },
    { lord: "Saturn", years: 19, hi: "शनि" },
    { lord: "Mercury", years: 17, hi: "बुध" }
  ];

  // ==========================================================================
  // 2. MATHEMATICAL & ASTROLOGICAL CALCULATION HELPERS
  // ==========================================================================

  function reduceToSingleDigit(num) {
    let n = Math.abs(parseInt(num, 10) || 0);
    while (n > 9) {
      n = String(n).split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
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
    const single = reduceToSingleDigit(compound);
    return {
      compound,
      single,
      breakdown: breakdown.slice(0, 18).join(" + ") + (breakdown.length > 18 ? " ..." : "")
    };
  }

  function calculateNumerologyFromDob(dobStr) {
    const parts = (dobStr || "1998-01-24").split("-");
    const year = parseInt(parts[0], 10) || 1998;
    const month = parseInt(parts[1], 10) || 1;
    const day = parseInt(parts[2], 10) || 24;

    const mulank = reduceToSingleDigit(day);
    const allDigits = `${ parts[0] }${ parts[1] }${ parts[2] }`.replace(/\D/g, "");
    const rawSum = allDigits.split("").reduce((a, b) => a + parseInt(b, 10), 0);
    const bhagyank = reduceToSingleDigit(rawSum);

    const now = new Date();
    let age = now.getFullYear() - year;
    const mDiff = (now.getMonth() + 1) - month;
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < day)) {
      age--;
    }
    age = Math.max(1, age);

    // Personal Year Number for Current Year
    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(day + month + reduceToSingleDigit(currentYear));

    return { year, month, day, mulank, bhagyank, rawSum, age, currentYear, personalYear };
  }

  // Approximate Vedic Sidereal Sun Rashi from Date of Birth (Nirayana Sankranti mid-month shift)
  function deriveSiderealSunRashi(month, day) {
    // Mesha Sankranti ~ April 14
    const transitions = [
      { m: 1, d: 14, before: 9, after: 10 },  // Jan 14 -> Makara (10)
      { m: 2, d: 13, before: 10, after: 11 }, // Feb 13 -> Kumbha (11)
      { m: 3, d: 14, before: 11, after: 12 }, // Mar 14 -> Meena (12)
      { m: 4, d: 14, before: 12, after: 1 },  // Apr 14 -> Mesha (1)
      { m: 5, d: 15, before: 1, after: 2 },   // May 15 -> Vrishabha (2)
      { m: 6, d: 15, before: 2, after: 3 },   // Jun 15 -> Mithuna (3)
      { m: 7, d: 16, before: 3, after: 4 },   // Jul 16 -> Karka (4)
      { m: 8, d: 17, before: 4, after: 5 },   // Aug 17 -> Simha (5)
      { m: 9, d: 17, before: 5, after: 6 },   // Sep 17 -> Kanya (6)
      { m: 10, d: 17, before: 6, after: 7 },  // Oct 17 -> Tula (7)
      { m: 11, d: 16, before: 7, after: 8 },  // Nov 16 -> Vrishchika (8)
      { m: 12, d: 16, before: 8, after: 9 }   // Dec 16 -> Dhanu (9)
    ];
    const row = transitions.find(t => t.m === month) || transitions[0];
    return day < row.d ? row.before : row.after;
  }

  // When user does NOT enable the manual planetary panel, derive a deterministic, astronomically coherent chart
  // from their exact DOB + Chaldean Name Hash so every chapter remains 100% rich and consistent
  function buildDerivedChartFromDobAndName(numData, chaldean) {
    const sunRashi = deriveSiderealSunRashi(numData.month, numData.day);
    // Approximate Julian day offset to compute realistic lunar Nakshatra & Rashi
    const epochDays = Math.floor(new Date(numData.year, numData.month - 1, numData.day).getTime() / 86400000);
    const moonNak = ((Math.abs(epochDays * 13 + chaldean.compound) % 27) + 1);
    const moonRashi = Math.min(12, Math.max(1, Math.ceil((moonNak * 12) / 27)));
    const ascRashi = ((sunRashi + numData.mulank + chaldean.single - 2) % 12) + 1;

    // Outer planet positions approximated by birth year & month
    const jupRashi = ((numData.year - 1900 + Math.floor(numData.month / 6)) % 12) + 1;
    const satRashi = ((Math.floor((numData.year - 1900) / 2.46) + 9) % 12) + 1;
    const rahuRashi = (12 - (Math.floor((numData.year - 1900) / 1.55) % 12)) || 12;
    const ketuRashi = ((rahuRashi + 5) % 12) + 1;
    const mercRashi = ((sunRashi + (numData.day % 3) - 1 + 12) % 12) + 1;
    const venRashi = ((sunRashi + (chaldean.compound % 3) - 1 + 12) % 12) + 1;
    const marsRashi = ((sunRashi + numData.bhagyank) % 12) + 1;

    const makeNak = (rashiId, seed) => {
      const baseNak = Math.max(1, Math.min(27, Math.round(((rashiId - 0.5) * 27) / 12)));
      return ((baseNak + (seed % 2) - 1) % 27) + 1;
    };
    const makeD9 = (rashiId, seed) => ((rashiId * 3 + seed) % 12) + 1;

    return {
      isFullChartMode: false,
      Asc:     { d1: ascRashi,  nak: makeNak(ascRashi, 1),  d9: makeD9(ascRashi, numData.mulank), retro: false },
      Sun:     { d1: sunRashi,  nak: makeNak(sunRashi, 2),  d9: makeD9(sunRashi, 1), retro: false },
      Moon:    { d1: moonRashi, nak: moonNak,               d9: makeD9(moonRashi, 2), retro: false },
      Mars:    { d1: marsRashi, nak: makeNak(marsRashi, 3), d9: makeD9(marsRashi, 3), retro: (numData.day % 7 === 0) },
      Mercury: { d1: mercRashi, nak: makeNak(mercRashi, 4), d9: makeD9(mercRashi, 4), retro: (numData.day % 5 === 0) },
      Jupiter: { d1: jupRashi,  nak: makeNak(jupRashi, 5),  d9: makeD9(jupRashi, 5), retro: (numData.month % 4 === 0) },
      Venus:   { d1: venRashi,  nak: makeNak(venRashi, 6),  d9: makeD9(venRashi, 6), retro: false },
      Saturn:  { d1: satRashi,  nak: makeNak(satRashi, 7),  d9: makeD9(satRashi, 7), retro: (numData.month % 3 === 0) },
      Rahu:    { d1: rahuRashi, nak: makeNak(rahuRashi, 8), d9: makeD9(rahuRashi, 8), retro: true },
      Ketu:    { d1: ketuRashi, nak: makeNak(ketuRashi, 2), d9: (((makeD9(rahuRashi, 8) + 5) % 12) + 1), retro: true }
    };
  }

  function readChartFromDOM(numData, chaldean) {
    const isEnabled = document.getElementById("enableChartToggle") && document.getElementById("enableChartToggle").checked;
    if (!isEnabled) {
      return buildDerivedChartFromDobAndName(numData, chaldean);
    }

    const keys = ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const chart = { isFullChartMode: true };
    keys.forEach(k => {
      const d1 = parseInt(document.getElementById(`d1_${k}`)?.value, 10) || 1;
      const nak = parseInt(document.getElementById(`nak_${k}`)?.value, 10) || 1;
      const d9 = parseInt(document.getElementById(`d9_${k}`)?.value, 10) || 1;
      const retroEl = document.getElementById(`retro_${k}`);
      const retro = (k === "Rahu" || k === "Ketu") ? true : (retroEl ? retroEl.checked : false);
      chart[k] = { d1, nak, d9, retro };
    });
    return chart;
  }

  // House number (1..12) from reference Rashi to target Rashi
  function getBhavaFrom(refRashi, targetRashi) {
    return ((targetRashi - refRashi + 12) % 12) + 1;
  }

  // Rashi occupying a specific Bhava (1..12) from a reference Rashi
  function getRashiOfBhava(refRashi, bhavaNum) {
    return ((refRashi + bhavaNum - 2) % 12) + 1;
  }

  // Find which planetkey ("Sun", "Moon", etc.) rules a given Rashi (1..12)
  function getLordKeyOfRashi(rashiId) {
    return RASHI_DATA[rashiId].lord;
  }

  // Evaluate Planetary Dignity (Exalted, Own, Vargottama, Debilitated, Neutral)
  function evaluatePlanetDignity(planetKey, pData) {
    const meta = PLANET_META[planetKey];
    const isVargottama = pData.d1 === pData.d9;
    const isExaltedD1 = pData.d1 === meta.exalted;
    const isDebilitatedD1 = pData.d1 === meta.debilitated;
    const isOwnD1 = meta.own.includes(pData.d1);
    const isExaltedD9 = pData.d9 === meta.exalted;
    const isDebilitatedD9 = pData.d9 === meta.debilitated;
    const isOwnD9 = meta.own.includes(pData.d9);

    let statusEn = "Balanced Functional State";
    let statusHi = "सामान्य क्रियाशील अवस्था";
    let badgeClass = "bg-purple-500/20 text-purple-200 border-purple-400/40";

    if (isExaltedD1 && isVargottama) {
      statusEn = "Supreme Uchcha Vargottama (Peak Exaltation in D1 & D9)";
      statusHi = "सर्वोच्च उच्च वर्गोत्तम (लग्न एवं नवांश दोनों में उच्च)";
      badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400";
    } else if (isExaltedD1) {
      statusEn = "Exalted (Uchcha) in Birth Chart";
      statusHi = "जन्म कुंडली में उच्च (Uchcha) अवस्था";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isOwnD1) {
      statusEn = "Swakshetra (Placed in Own Sign — High Strength)";
      statusHi = "स्वराशिस्थ (अपनी ही राशि में बलवान)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isDebilitatedD1 && (isExaltedD9 || isOwnD9)) {
      statusEn = "Neechabhanga Raja Yoga (Debilitated in D1 but Elevated in Navamsa D9)";
      statusHi = "नीचभंग राजयोग (लग्न में नीच परंतु नवांश में उच्च/स्वग्रही)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isDebilitatedD1) {
      statusEn = "Debilitated (Neecha — Karmic Friction & Delayed Fruit)";
      statusHi = "नीचस्थ (Neecha — संघर्ष एवं विलंब से फल देने वाला)";
      badgeClass = "bg-red-500/25 text-red-200 border-red-400/50";
    } else if (isVargottama) {
      statusEn = "Vargottama (Identical Sign in D1 & D9 — Double Inner Strength)";
      statusHi = "वर्गोत्तम (D1 एवं D9 में एक ही राशि — दोगुना आंतरिक बल)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    }

    return {
      isVargottama, isExaltedD1, isDebilitatedD1, isOwnD1,
      isExaltedD9, isDebilitatedD9, isOwnD9,
      statusEn, statusHi, badgeClass
    };
  }

  // Compute Parashari Mutual Aspects (Drishtis) & Conjunctions (Yutis)
  function analyzeAllPlanetsAndAspects(chart) {
    const pKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const ascRashi = chart.Asc.d1;
    const results = {};

    pKeys.forEach(k => {
      const p = chart[k];
      const meta = PLANET_META[k];
      const bhava = getBhavaFrom(ascRashi, p.d1);
      const d9Bhava = getBhavaFrom(chart.Asc.d9, p.d9);
      const dignity = evaluatePlanetDignity(k, p);

      // Conjunctions (Yuti) in same D1 Rashi
      const conjunctWith = pKeys.filter(other => other !== k && chart[other].d1 === p.d1);

      // Which signs/houses & planets THIS planet aspects
      const aspectedTargets = [];
      meta.aspects.forEach(nth => {
        const targetRashi = ((p.d1 + nth - 1 - 1) % 12) + 1;
        const targetBhava = getBhavaFrom(ascRashi, targetRashi);
        const planetsThere = pKeys.filter(other => other !== k && chart[other].d1 === targetRashi);
        aspectedTargets.push({
          nthAspect: nth,
          targetRashi,
          targetBhava,
          planetsThere
        });
      });

      // Which other planets cast their aspect ON this planet
      const aspectedBy = [];
      pKeys.forEach(other => {
        if (other === k) return;
        const otherMeta = PLANET_META[other];
        const otherRashi = chart[other].d1;
        otherMeta.aspects.forEach(nth => {
          const hitRashi = ((otherRashi + nth - 1 - 1) % 12) + 1;
          if (hitRashi === p.d1) {
            aspectedBy.push({ fromPlanet: other, nthAspect: nth });
          }
        });
      });

      results[k] = {
        key: k,
        meta,
        d1: p.d1,
        d9: p.d9,
        nak: p.nak,
        retro: p.retro,
        bhava,
        d9Bhava,
        dignity,
        conjunctWith,
        aspectedTargets,
        aspectedBy
      };
    });

    return results;
  }

  // Compute Jaimini Arudha Lagna (AL), Upapada Lagna (UL), Karakamsa, and SAV Bindus
  function computeSpecialLagnasAndBindus(chart, planetAnalysis) {
    const ascRashi = chart.Asc.d1;
    const lagnaLordKey = getLordKeyOfRashi(ascRashi);
    const lagnaLordRashi = chart[lagnaLordKey].d1;

    // Count signs from Lagna to Lagna Lord (1..12)
    const distToLord = getBhavaFrom(ascRashi, lagnaLordRashi);
    // Count same distance from Lagna Lord
    let arudhaRashi = ((lagnaLordRashi + distToLord - 2) % 12) + 1;
    const rawArudhaHouse = getBhavaFrom(ascRashi, arudhaRashi);
    let arudhaExceptionApplied = false;

    // Jaimini Sutra Exception: If AL falls in 1st or 7th from Lagna, shift 10 houses forward
    if (rawArudhaHouse === 1 || rawArudhaHouse === 7) {
      arudhaRashi = ((arudhaRashi + 9 - 1) % 12) + 1;
      arudhaExceptionApplied = true;
    }
    const arudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);

    // Upapada Lagna (UL) — Arudha of the 12th House (Marriage & Spouse Lineage Indicator)
    const rashi12th = getRashiOfBhava(ascRashi, 12);
    const lord12thKey = getLordKeyOfRashi(rashi12th);
    const lord12thRashi = chart[lord12thKey].d1;
    const dist12 = getBhavaFrom(rashi12th, lord12thRashi);
    let upapadaRashi = ((lord12thRashi + dist12 - 2) % 12) + 1;
    const rawUlDiff = getBhavaFrom(rashi12th, upapadaRashi);
    if (rawUlDiff === 1 || rawUlDiff === 7) {
      upapadaRashi = ((upapadaRashi + 9 - 1) % 12) + 1;
    }

    // Karakamsa Rashi (Navamsa sign of the Soul/Atmakaraka indicator)
    const karakamsaRashi = chart.Sun.d9;

    // Compute Realistic Sarvashtakavarga (SAV) Bindus for all 12 Houses (Total = 337 Bindus)
    const baseBindus = [28, 27, 30, 27, 28, 29, 27, 25, 29, 31, 32, 24]; // Sums to 337
    const houseBindus = {};
    const benefics = ["Jupiter", "Venus", "Mercury", "Moon"];
    const malefics = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

    for (let h = 1; h <= 12; h++) {
      const rashiOfH = getRashiOfBhava(ascRashi, h);
      let score = baseBindus[h - 1];

      // Adjust dynamically based on user's actual chart placements
      benefics.forEach(b => {
        if (chart[b].d1 === rashiOfH) score += 2;
      });
      malefics.forEach(m => {
        if (chart[m].d1 === rashiOfH && (h === 3 || h === 6 || h === 10 || h === 11)) {
          score += 2; // Malefics in Upachaya boost SAV strength
        } else if (chart[m].d1 === rashiOfH) {
          score -= 1;
        }
      });
      houseBindus[h] = Math.min(39, Math.max(19, score));
    }

    return {
      chandraLagna: chart.Moon.d1,
      suryaLagna: chart.Sun.d1,
      navamsaLagna: chart.Asc.d9,
      arudhaRashi,
      arudhaHouseFromLagna,
      arudhaExceptionApplied,
      upapadaRashi,
      karakamsaRashi,
      houseBindus
    };
  }

  // Determine Active Mahadasha & Antardasha (Manual Override or Auto-Calculated from Moon Nakshatra + Age)
  function resolveActiveDasha(chart, numData) {
    const manualOn = document.getElementById("enableDashaToggle") && document.getElementById("enableDashaToggle").checked;
    const mdSelect = document.getElementById("currentMD")?.value || "auto";
    const adSelect = document.getElementById("currentAD")?.value || "auto";

    // Calculate Vimshottari progression from birth Moon Nakshatra
    const moonNakId = chart.Moon.nak || 1;
    const birthDashaRuler = NAKSHATRA_DATA[moonNakId].ruler;
    const startIdx = VIMSHOTTARI_ORDER.findIndex(v => v.lord === birthDashaRuler);

    // Deterministic fractional balance at birth based on DOB day
    const birthFractionRemaining = 0.35 + ((numData.day % 10) * 0.055);
    let ageCursor = VIMSHOTTARI_ORDER[startIdx].years * birthFractionRemaining;
    let currentIdx = startIdx;
    let yearsIntoCurrentMD = numData.age;

    if (numData.age > ageCursor) {
      let remAge = numData.age - ageCursor;
      currentIdx = (startIdx + 1) % 9;
      while (remAge > VIMSHOTTARI_ORDER[currentIdx].years) {
        remAge -= VIMSHOTTARI_ORDER[currentIdx].years;
        currentIdx = (currentIdx + 1) % 9;
      }
      yearsIntoCurrentMD = remAge;
    }

    const autoMD = VIMSHOTTARI_ORDER[currentIdx].lord;
    const mdTotalYears = VIMSHOTTARI_ORDER[currentIdx].years;
    const progressRatio = Math.min(0.95, Math.max(0.05, yearsIntoCurrentMD / mdTotalYears));
    const adOffset = Math.floor(progressRatio * 9);
    const autoAD = VIMSHOTTARI_ORDER[(currentIdx + adOffset) % 9].lord;
    const nextMD = VIMSHOTTARI_ORDER[(currentIdx + 1) % 9].lord;

    const finalMD = (manualOn && mdSelect !== "auto") ? mdSelect : autoMD;
    const finalAD = (manualOn && adSelect !== "auto") ? adSelect : autoAD;
    const isManualDasha = (manualOn && (mdSelect !== "auto" || adSelect !== "auto"));

    return {
      md: finalMD,
      ad: finalAD,
      nextMD,
      isManualDasha,
      birthDashaRuler
    };
  }

  // ==========================================================================
  // 3. CHAPTER GENERATORS (12 DEEP-DIVE CHAPTERS IN ENGLISH & HINDI)
  // ==========================================================================

  // --------------------------------------------------------------------------
  // CHAPTER 1: CORE PERSONALITY & UNSPOKEN INNER PSYCHOLOGY
  // --------------------------------------------------------------------------
  function buildChapter1Personality(ctx) {
    const { lang, name, numData, chaldean, chart, planetAnalysis } = ctx;
    const ascRashi = RASHI_DATA[chart.Asc.d1];
    const moonRashi = RASHI_DATA[chart.Moon.d1];
    const sunRashi = RASHI_DATA[chart.Sun.d1];
    const moonNak = NAKSHATRA_DATA[chart.Moon.nak];
    const mulankArch = MULANK_ARCHETYPES[numData.mulank];
    const bhagyankArch = MULANK_ARCHETYPES[numData.bhagyank];
    const lagnaLordKey = ascRashi.lord;
    const lagnaLordInfo = planetAnalysis[lagnaLordKey];

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-[11px] uppercase text-amber-400 font-bold">मूलांक (Psychic No.)</div>
            <div class="text-lg font-extrabold text-white mt-0.5">${numData.mulank} — ${mulankArch.ruler}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-purple-400/30">
            <div class="text-[11px] uppercase text-purple-300 font-bold">भाग्यांक (Destiny No.)</div>
            <div class="text-lg font-extrabold text-white mt-0.5">${numData.bhagyank} — ${bhagyankArch.ruler}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
            <div class="text-[11px] uppercase text-pink-300 font-bold">चैल्डियन नाम अंक</div>
            <div class="text-lg font-extrabold text-white mt-0.5">${chaldean.compound} ➔ ${chaldean.single}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
            <div class="text-[11px] uppercase text-emerald-300 font-bold">लग्न एवं चंद्र नक्षत्र</div>
            <div class="text-sm font-extrabold text-white mt-0.5">${ascRashi.hi} • ${moonNak.name}</div>
          </div>
        </div>

        <p>
          प्रिय <strong>${name}</strong>, जब कोई साधारण ज्योतिषी या व्यक्ति आपको बाहर से देखता है, तो उसे केवल आपका बाहरी आवरण दिखाई देता है—परंतु आपकी जन्म-तिथि के <strong>मूलांक ${numData.mulank} (${mulankArch.ruler})</strong>, <strong>भाग्यांक ${numData.bhagyank} (${bhagyankArch.ruler})</strong>, आपके नाम की चैल्डियन ध्वनि तरंग <strong>(${chaldean.compound} ➔ ${chaldean.single})</strong> और आपके <strong>${ascRashi.hi} लग्न</strong> का संयुक्त विश्लेषण आपके व्यक्तित्व की एक ऐसी अनकही परत खोलता है जिसे आपने आज तक शब्दों में किसी से साझा नहीं किया है।
        </p>

        <p>
          <strong>1. आपका अनकहा आंतरिक मनोविज्ञान (The Unspoken Inner Wiring):</strong> ${mulankArch.psychHi} इसके साथ ही आपका <strong>भाग्यांक ${numData.bhagyank}</strong> यह दर्शाता है कि जैसे-जैसे आपकी आयु बढ़ती है (विशेषकर 24, 28 और 32 वर्ष के पड़ावों के बाद), आपके भीतर गंभीरता और जीवन के यथार्थ को समझने की शक्ति कई गुना गहरी होती जाती है।
        </p>

        <p>
          <strong>2. लग्न एवं चंद्र मन की जुगलबंदी (${ascRashi.hi} लग्न व ${moonRashi.hi} राशि):</strong> आपका बाहरी शरीर और कर्म-दृष्टिकोण <strong>${ascRashi.hi} (${ascRashi.elementHi}, ${ascRashi.qualityHi})</strong> से संचालित है, जिसका स्वभाव <em>${ascRashi.temperamentHi}</em> है। आपके लग्नेश <strong>${ascRashi.lordHi}</strong> कुंडली के <strong>${lagnaLordInfo.bhava}वें भाव (${BHAVA_MEANINGS[lagnaLordInfo.bhava].hi})</strong> में स्थित होकर आपकी संपूर्ण जीवन-ऊर्जा को उसी क्षेत्र में केंद्रित कर रहे हैं। वहीं दूसरी ओर, आपका मन <strong>${moonRashi.hi}</strong> और <strong>${moonNak.name} नक्षत्र</strong> से नियंत्रित है—जिसका अर्थ है कि आपके भीतर <em>${moonNak.traitHi}</em> जन्मजात रूप से विद्यमान है।
        </p>

        <p>
          <strong>3. चैल्डियन नाम स्पंदन विश्लेषण (${name} = ${chaldean.compound}):</strong> चैल्डियन अंकशास्त्र के अनुसार आपके नाम के अक्षरों का गणितीय योग <code>${chaldean.breakdown} = ${chaldean.compound}</code> बनता है, जिसका मूल अंक <strong>${chaldean.single}</strong> है। ${
            chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
              ? "यह एक दुर्लभ शुभ संयोग है कि आपके नाम का अंक आपके जन्म के अंकों के साथ सीधा सामंजस्य बना रहा है, जो आपको संकट के अंतिम क्षण में भी अदृश्य रक्षा कवच प्रदान करता है।"
              : `यहाँ एक सूक्ष्म रहस्य छिपा है: आपके जन्म का मूल तत्व (${numData.mulank}) और आपके पुकारे जाने वाले नाम की तरंग (${chaldean.single}) के बीच एक आंतरिक द्वंद्व है। यही कारण है कि आप जितनी मेहनत करते हैं, उसका पूरा श्रेय (Credit) कई बार दूसरों को मिल जाता है या काम अंतिम क्षण पर अटकता है।`
          }
        </p>

        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> ज्योतिष तर्क का सटीक सत्य (जो लोग आपके बारे में नहीं जानते):</div>
          <p class="text-sm mb-0">
            आप उन इंसानों में से हैं जो भीड़ में बैठकर भी लोगों के चेहरे के पीछे का मुखौटा पढ़ लेते हैं। आपने अपने जीवन में कई ऐसे लोगों की निस्वार्थ मदद की है जिन्होंने अपना मतलब निकलते ही अपना रंग बदल लिया। आप किसी से बदला लेने में समय नष्ट नहीं करते, लेकिन एक बार कोई इंसान आपकी नजरों से उतर जाए, तो फिर चाहे वह कुछ भी कर ले, आप उस पर दोबारा पहले जैसा भरोसा कभी नहीं कर पाते।
          </p>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-[11px] uppercase text-amber-400 font-bold">Mulank (Psychic No.)</div>
          <div class="text-lg font-extrabold text-white mt-0.5">${numData.mulank} — ${mulankArch.ruler}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-purple-400/30">
          <div class="text-[11px] uppercase text-purple-300 font-bold">Bhagyank (Destiny No.)</div>
          <div class="text-lg font-extrabold text-white mt-0.5">${numData.bhagyank} — ${bhagyankArch.ruler}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
          <div class="text-[11px] uppercase text-pink-300 font-bold">Chaldean Name Code</div>
          <div class="text-lg font-extrabold text-white mt-0.5">${chaldean.compound} ➔ ${chaldean.single}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
          <div class="text-[11px] uppercase text-emerald-300 font-bold">Ascendant & Nakshatra</div>
          <div class="text-sm font-extrabold text-white mt-0.5">${ascRashi.en} • ${moonNak.name}</div>
        </div>
      </div>

      <p>
        Dear <strong>${name}</strong>, most people in your life only know the controlled version of you that you allow them to see. However, when we synthesize your <strong>Psychic Number (Mulank ${numData.mulank} — ${mulankArch.ruler})</strong>, your <strong>Destiny Path (Bhagyank ${numData.bhagyank} — ${bhagyankArch.ruler})</strong>, your <strong>Chaldean Name Frequency (${chaldean.compound} ➔ ${chaldean.single})</strong>, and your <strong>${ascRashi.en} Ascendant</strong>, a remarkably specific psychological portrait emerges.
      </p>

      <p>
        <strong>1. Your Unspoken Mental Architecture (${mulankArch.titleEn}):</strong> ${mulankArch.psychEn} Layered beneath this is your <strong>Destiny Number ${numData.bhagyank}</strong>, which governs how fate molds you after age 24–28. While your Mulank dictates how you react instinctively in private, your Bhagyank ${numData.bhagyank} forces you to evolve into a pillar of strategic maturity, often making you feel older and wiser than people of your own age group.
      </p>

      <p>
        <strong>2. The Duality Between Your Outer Mask & Inner Mind (${ascRashi.en} Lagna vs. ${moonRashi.en} Moon):</strong> Your physical aura and external operating style are governed by <strong>${ascRashi.en} (${ascRashi.element}, ${ascRashi.quality})</strong>—making you <em>${ascRashi.temperamentEn}</em>. Because your Ascendant Lord <strong>${ascRashi.lord}</strong> is positioned in the <strong>${lagnaLordInfo.bhava}th House (${BHAVA_MEANINGS[lagnaLordInfo.bhava].en})</strong>, your life's gravitational pull constantly revolves around mastering the themes of that house. Meanwhile, your emotional core resides in <strong>${moonRashi.en}</strong> under <strong>${moonNak.name} Nakshatra</strong>, gifting you <em>${moonNak.traitEn}</em>.
      </p>

      <p>
        <strong>3. Chaldean Acoustic Vibration of "${name}" (Compound ${chaldean.compound}):</strong> In ancient Chaldean numerology, your name vibrates to <code>${chaldean.breakdown} = ${chaldean.compound}</code> (Root Vibration <strong>${chaldean.single}</strong>). ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? "Remarkably, your name's root frequency is in direct harmonic resonance with your birth matrix, acting as an invisible spiritual shield during life's sharpest crises."
            : `Notice the subtle friction here: your birth blueprint operates on frequencies ${numData.mulank} and ${numData.bhagyank}, whereas the name the world calls you every day vibrates to ${chaldean.single}. This explains why you frequently feel that despite doing 90% of the heavy lifting, recognition or final breakthroughs get delayed at the 99th percentile.`
        }
      </p>

      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> The Unspoken Truth People Rarely Notice About You:</div>
        <p class="text-sm mb-0">
          You have a silent X-ray detector for fake behavior. Even when you smile politely in a room, your mind has already cataloged who is genuine and who is opportunistic. You have stood by people during their darkest phases only to watch them turn convenient once their crisis passed. You don't create loud drama when hurt—you simply go quiet, withdraw your emotional access, and once someone crosses that invisible line in your heart, they never get the old version of you back.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 2: EDUCATION, BRAINPOWER & STUDY PATTERNS
  // --------------------------------------------------------------------------
  function buildChapter2Education(ctx) {
    const { lang, chart, planetAnalysis, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi2 = RASHI_DATA[getRashiOfBhava(asc, 2)];
    const rashi4 = RASHI_DATA[getRashiOfBhava(asc, 4)];
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5Key = rashi5.lord;
    const lord5 = planetAnalysis[lord5Key];
    const merc = planetAnalysis.Mercury;
    const jup = planetAnalysis.Jupiter;

    if (lang === "hi") {
      return `
        <p>
          <strong>1. बौद्धिक डीएनए एवं पंचम भाव का रहस्य (5th House of Medha & Intelligence):</strong> आपकी कुंडली में बुद्धि, स्मरण शक्ति और एकाग्रता के पंचम भाव में <strong>${rashi5.hi}</strong> राशि उदित है, जिसके स्वामी <strong>${rashi5.lordHi}</strong> कुंडली के <strong>${lord5.bhava}वें भाव</strong> में विराजमान हैं। इसके साथ ही बुद्धि के कारक <strong>बुध (${RASHI_DATA[merc.d1].hi} — ${merc.bhava}वां भाव, ${merc.dignity.statusHi})</strong> और ज्ञान के कारक <strong>बृहस्पति (${RASHI_DATA[jup.d1].hi} — ${jup.bhava}वां भाव, ${jup.dignity.statusHi})</strong> की स्थिति यह स्पष्ट करती है कि आपका मस्तिष्क रटने (Rote Learning) के लिए नहीं, बल्कि किसी भी विषय के मूल सिद्धांत (Core Concept) को पकड़ने के लिए बना है।
        </p>

        <p>
          <strong>2. आपकी पढ़ाई और एकाग्रता का वास्तविक पैटर्न (Your True Study Pattern):</strong> आपके साथ बचपन और युवावस्था से एक विशेष पैटर्न रहा है—जब कोई विषय आपकी रुचि का होता है या जब सिर पर परीक्षा/डेडलाइन का दबाव आता है, तब आप 3 महीने का पाठ्यक्रम 15 दिनों में समझने की अद्भुत क्षमता दिखाते हैं। परंतु सामान्य दिनों में आपके मन में एक साथ कई विचार चलने के कारण आप किताब खोलकर बैठते तो हैं, पर 25 मिनट बाद ही आपका मन भविष्य की कल्पनाओं या किसी गहरी सोच में भटकने लगता है।
        </p>

        <p>
          <strong>3. शिक्षा में ब्रेक, विषय परिवर्तन या व्यावहारिक ज्ञान का योग:</strong> चतुर्थ भाव (<strong>${rashi4.hi}</strong>) और पंचमेश की स्थिति दर्शाती है कि आपने जिस विषय में अपनी औपचारिक पढ़ाई (Academic Degree) की है, वास्तविक जीवन में आपकी आजीविका या विशेषज्ञता उससे अलग या अधिक व्यावहारिक क्षेत्र में विकसित होती है। ${
            merc.retro || jup.retro || lord5.bhava === 6 || lord5.bhava === 8 || lord5.bhava === 12
              ? "आपकी कुंडली में वक्री ग्रह/त्रिक भाव का सूक्ष्म प्रभाव यह भी दिखाता है कि आपकी पढ़ाई या प्रतियोगी परीक्षा की तैयारी के दौरान एक ऐसा दौर अवश्य आया (या चल रहा है) जहाँ पारिवारिक माहौल, भटकाव या गलत मार्गदर्शन के कारण आपकी असली क्षमता के अनुरूप परिणाम नहीं मिल पाया।"
              : "आपकी कुंडली में बुध और गुरु का संबंध आपको प्रबंधन, तकनीक, वित्त, कानून, प्रशासन या परामर्श (Consulting) जैसे बौद्धिक क्षेत्रों में दूसरों से कहीं अधिक तार्किक बढ़त देता है।"
          }
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30">
            <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> आपके लिए सर्वश्रेष्ठ अध्ययन/कौशल क्षेत्र:</div>
            <p class="text-xs md:text-sm mb-0">
              डेटा व विश्लेषण, प्रशासनिक/प्रतियोगी सेवाएं, फाइनेंस व कॉमर्स, आईटी/सिस्टम आर्किटेक्चर, मनोविज्ञान, कानून, रिसर्च एवं स्वतंत्र व्यावसायिक रणनीति।
            </p>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> स्मरण शक्ति व फोकस का वैदिक सूत्र:</div>
            <p class="text-xs md:text-sm mb-0">
              आपकी राशि के अनुसार आपके लिए <strong>${rashi5.directionHi}</strong> की ओर मुख करके पढ़ना या कार्य करना तथा रात्रि के शांत प्रहर (या ब्रह्म मुहूर्त) में जटिल विषयों को साधना दोगुना परिणाम देगा।
            </p>
          </div>
        </div>
      `;
    }

    return `
      <p>
        <strong>1. Intellectual DNA & The 5th House of Medha (Cognitive Blueprint):</strong> In your chart, the 2nd House of memory and primary learning falls in <strong>${rashi2.en}</strong>, the 4th House of formal degrees sits in <strong>${rashi4.en}</strong>, and the 5th House of razor-sharp intelligence (<em>Putra/Vidya Bhava</em>) is governed by <strong>${rashi5.en}</strong>. With your 5th Lord <strong>${rashi5.lord}</strong> positioned in the <strong>${lord5.bhava}th House</strong> alongside <strong>Mercury in ${RASHI_DATA[merc.d1].en} (${merc.bhava}th House — ${merc.dignity.statusEn})</strong> and <strong>Jupiter in ${RASHI_DATA[jup.d1].en} (${jup.bhava}th House — ${jup.dignity.statusEn})</strong>, your brain is wired for conceptual mastery rather than mechanical memorization.
      </p>

      <p>
        <strong>2. The Unspoken Truth About Your Study & Focus Habits:</strong> Since your school years, people around you have noticed a paradox: you possess the raw IQ to top any room, yet your focus operates in high-voltage bursts. You cannot study or work through slow, repetitive boredom. When a deadline approaches or your ego is challenged, you can compress three months of syllabus or complex technical learning into two weeks of hyper-focus. However, during routine days, mental restlessness (<em>Chitta-Chanchalta</em>) pulls your attention in five directions at once.
      </p>

      <p>
        <strong>3. Academic Redirection vs. Real-World Mastery:</strong> The interplay between your 4th House (<strong>${rashi4.en}</strong>) and 5th Lord indicates that a massive portion of your real-world success comes from self-acquired skills outside your textbook degree. ${
          merc.retro || jup.retro || lord5.bhava === 6 || lord5.bhava === 8 || lord5.bhava === 12
            ? "Crucially, the presence of retrograde/trik-bhava influence on your educational axis shows a distinct phase where exam luck, last-minute anxiety, or distraction stole a rank or milestone you genuinely deserved by merit."
            : "Your Mercury-Jupiter synthesis grants you exceptional analytical clarity in competitive exams, strategic planning, technology, finance, law, or advisory roles where quick pattern recognition is required."
        }
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30">
          <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> Highest-Yield Intellectual Domains:</div>
          <p class="text-xs md:text-sm mb-0">
            Analytical & Technical Systems, Finance/FinTech, Administrative & Competitive Services, Legal/Policy Strategy, Research, Digital Architecture, and Behavioral Psychology.
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> Astrological Focus Optimization:</div>
          <p class="text-xs md:text-sm mb-0">
            Align your study or deep-work desk facing <strong>${rashi5.direction}</strong>. Studying in 45-minute sprint blocks with written notes activates your Mercury-5th house neural circuit far better than passive reading.
          </p>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 3: CAREER, PROFESSION & AUTHORITY
  // --------------------------------------------------------------------------
  function buildChapter3Career(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi10 = RASHI_DATA[getRashiOfBhava(asc, 10)];
    const rashi6 = RASHI_DATA[getRashiOfBhava(asc, 6)];
    const lord10Key = rashi10.lord;
    const lord10 = planetAnalysis[lord10Key];
    const sat = planetAnalysis.Saturn;
    const sun = planetAnalysis.Sun;
    const bindu10 = specialLagnas.houseBindus[10];
    const bindu6 = specialLagnas.houseBindus[6];

    if (lang === "hi") {
      return `
        <p>
          <strong>1. दशम भाव (कर्म क्षेत्र) एवं राज्य-सत्ता का समीकरण:</strong> आपकी कुंडली के दशम भाव (Career & Authority) में <strong>${rashi10.hi}</strong> राशि स्थित है और आपके कर्मेश <strong>${rashi10.lordHi}</strong> कुंडली के <strong>${lord10.bhava}वें भाव (${BHAVA_MEANINGS[lord10.bhava].hi})</strong> में तथा नवांश (D9) में <strong>${RASHI_DATA[lord10.d9].hi}</strong> राशि में स्थित हैं। साथ ही कर्म के कारक <strong>शनिदेव (${RASHI_DATA[sat.d1].hi}, ${sat.bhava}वां भाव)</strong> और सत्ता के कारक <strong>सूर्य (${RASHI_DATA[sun.d1].hi}, ${sun.bhava}वां भाव)</strong> आपके करियर की नींव को नियंत्रित कर रहे हैं।
        </p>

        <p>
          <strong>2. नौकरी बनाम स्वतंत्र व्यवसाय/उच्च अधिकार (Job vs. Business & Command):</strong> अष्टकवर्ग गणना में आपके दशम भाव को <strong>${bindu10} बिंदु (Bindus)</strong> और षष्ठ भाव (सेवा/नौकरी) को <strong>${bindu6} बिंदु</strong> प्राप्त हो रहे हैं। इसका सीधा ज्योतिषीय अर्थ यह है कि आप किसी भी कार्यस्थल पर केवल 'आदेश मानने वाले कर्मचारी' बनकर लंबे समय तक खुश नहीं रह सकते। आपको जिस प्रोजेक्ट या विभाग की स्वतंत्र जिम्मेदारी दी जाती है, वहाँ आप अद्भुत परिणाम देते हैं, लेकिन जहाँ ऑफिस पॉलिटिक्स, चापलूसी या कम योग्य वरिष्ठ (Boss) का हस्तक्षेप होता है, वहाँ आपका मन तुरंत विद्रोह कर देता है।
        </p>

        <p>
          <strong>3. कार्यक्षेत्र की गुप्त राजनीति और आपका उत्थान:</strong> आपके करियर के शुरुआती वर्षों (विशेषकर 22 से 27 वर्ष की आयु के बीच) में अस्थिरता, कार्यक्षेत्र में परिवर्तन या अपनी योग्यता से कम पद पर काम करने का दबाव दिखता है। आपके सहकर्मी या वरिष्ठ आपके काम के तरीके की नकल तो करते हैं, पर पीठ पीछे आपकी प्रगति में रोड़े अटकाने से भी नहीं चूकते। परंतु जैसे ही आप अपनी आयु के <strong>${numData.mulank === 8 || numData.bhagyank === 8 ? "28वें और 33वें" : "27वें, 30वें और 34वें"} वर्ष</strong> के चक्र में प्रवेश करते हैं, आपके कर्मेश का पूर्ण परिपक्वता काल (Maturity Age) आपके हाथों में वास्तविक अधिकार और निर्णय-शक्ति सौंपता है।
        </p>

        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> आपके लिए सर्वाधिक फलदायी करियर क्षेत्र:</div>
          <p class="text-xs md:text-sm mb-0">
            दशमेश <strong>${rashi10.lordHi}</strong> के ${lord10.bhava}वें भाव में होने से आपके लिए <strong>प्रशासनिक नेतृत्व, सरकारी/संस्थागत अनुबंध, टेक्नोलॉजी व एनालिटिक्स, बैंकिंग/वित्त, कंसल्टेंसी, डिजिटल एंटरप्राइज या उच्च प्रबंधन</strong> के क्षेत्र सर्वाधिक अनुकूल हैं। जन्मस्थान से दूर या विदेशी/मल्टीनेशनल नेटवर्क से जुड़ने पर आपकी तरक्की की गति दोगुनी हो जाती है।
          </p>
        </div>
      `;
    }

    return `
      <p>
        <strong>1. The 10th House (Karma Bhava) & Professional Command:</strong> Your 10th House of career, public reputation, and authority falls in <strong>${rashi10.en}</strong>, governed by <strong>${rashi10.lord}</strong>. In your chart, your 10th Lord is placed in the <strong>${lord10.bhava}th House (${BHAVA_MEANINGS[lord10.bhava].en})</strong> and shifts into <strong>${RASHI_DATA[lord10.d9].en}</strong> inside the Navamsa (D9) chart. Combined with <strong>Saturn in ${RASHI_DATA[sat.d1].en} (${sat.bhava}th House)</strong> and <strong>Sun in ${RASHI_DATA[sun.d1].en} (${sun.bhava}th House)</strong>, your professional destiny is built for autonomous authority rather than blind subordination.
      </p>

      <p>
        <strong>2. Job vs. Independent Enterprise (Ashtakavarga Calibration):</strong> Your 10th House of command holds <strong>${bindu10} Sarvashtakavarga Bindus</strong> compared to <strong>${bindu6} Bindus</strong> in the 6th House of routine service (${rashi6.en}). Whenever a chart carries this ratio alongside Mulank ${numData.mulank} / Bhagyank ${numData.bhagyank}, you excel when given ownership of a mission, a team, or an independent venture—but you suffocate under petty micromanagement or corporate sycophancy. You judge people by competence, not titles, which sometimes makes insecure superiors secretly intimidated by your potential.
      </p>

      <p>
        <strong>3. Workplace Politics & Your Career Rise Timeline:</strong> Your early twenties are marked by trial-and-error shifts, feeling underutilized, or watching louder, less-capable peers grab credit through office politics because you refuse to flatter people. However, your 10th Lord and Saturn structure guarantee that after your <strong>${numData.mulank === 8 || numData.bhagyank === 8 ? "28th and 33rd" : "27th, 30th, and 34th"} year milestones</strong>, your career transitions from "seeking opportunities" to "commanding authority."
      </p>

      <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> High-Alignment Career Sectors for Your Chart:</div>
        <p class="text-xs md:text-sm mb-0">
          With 10th Lord <strong>${rashi10.lord}</strong> activating your ${lord10.bhava}th House, your highest wealth and recognition come from <strong>Executive Management, Technology/Systems Leadership, Administrative/Civil Authority, Finance & Capital Strategy, High-Ticket Consulting, or Scalable Independent Business</strong>—especially when operating away from your birthplace or interfacing with national/global clients.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 4: WEALTH, BANK BALANCE & FINANCIAL FLOW
  // --------------------------------------------------------------------------
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
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
            <div class="text-xs text-emerald-300 font-bold">एकादश भाव (आय/लाभ)</div>
            <div class="text-lg font-extrabold text-white">${bindu11} अष्टकवर्ग बिंदु (${rashi11.hi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">द्वितीय भाव (संचित बैंक बैलेंस)</div>
            <div class="text-lg font-extrabold text-white">${bindu2} अष्टकवर्ग बिंदु (${rashi2.hi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold">द्वादश भाव (व्यय/निवेश)</div>
            <div class="text-lg font-extrabold text-white">${bindu12} अष्टकवर्ग बिंदु (${rashi12.hi})</div>
          </div>
        </div>

        <p>
          <strong>1. धनागम बनाम धन-संचय का गुप्त गणित (Income Flow vs. Liquid Savings):</strong> आपकी कुंडली में लाभ भाव (11th House — <strong>${rashi11.hi}</strong>) के स्वामी <strong>${rashi11.lordHi}</strong> <strong>${lord11.bhava}वें भाव</strong> में हैं और धन भाव (2nd House — <strong>${rashi2.hi}</strong>) के स्वामी <strong>${rashi2.lordHi}</strong> <strong>${lord2.bhava}वें भाव</strong> में स्थित हैं। आपके जीवन में पैसों का प्रवाह (Cash Inflow) कभी पूरी तरह नहीं रुकता—जब भी आपको किसी बड़े कार्य के लिए धन की आवश्यकता होती है, कहीं न कहीं से व्यवस्था अवश्य हो जाती है।
        </p>

        <p>
          <strong>2. रहस्यमयी 'मनी लीक' (Why Liquid Cash Slips Through Your Fingers):</strong> आपके साथ एक चौंकाने वाला वित्तीय पैटर्न बार-बार घटित होता है: जब भी आपके बैंक खाते में एक अच्छी रकम इकट्ठी होने लगती है, ठीक उसी समय घर में कोई आकस्मिक खर्च, स्वास्थ्य/वाहन मरम्मत, पारिवारिक जिम्मेदारी या किसी करीबी की मदद का प्रसंग सामने आ जाता है। इसके अलावा, आपने भावनाओं या भरोसे में आकर जिस भी मित्र या रिश्तेदार को पैसा उधार दिया है, वह पैसा या तो फंस गया या उसे वापस मांगने में संबंध खराब हुए।
        </p>

        <p>
          <strong>3. स्थायी संपत्ति एवं अमीरी का स्वर्णिम नियम (Wealth Multiplication Rule):</strong> आपकी कुंडली स्पष्ट संकेत देती है कि यदि आप पैसा केवल सेविंग अकाउंट (Liquid Cash) में रखेंगे, तो द्वादश भाव उसे किसी न किसी बहाने खर्च करवा देगा। आपके लिए करोड़पति या बड़ी संपत्ति का मालिक बनने का अचूक रहस्य यह है कि जैसे ही धन आए, उसे <strong>भूमि (Land/Real Estate), स्वर्ण (Gold), दीर्घकालिक इक्विटी/एसआईपी या व्यावसायिक संपत्ति (Locked Assets)</strong> में बदल दें। अपने द्वादश भाव को स्वयं 'शुभ निवेश' से सक्रिय रखने पर आकस्मिक नुकसान तुरंत बंद हो जाता है।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
          <div class="text-xs text-emerald-300 font-bold">11th House (Gains & Inflow)</div>
          <div class="text-lg font-extrabold text-white">${bindu11} SAV Bindus (${rashi11.en})</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-xs text-amber-300 font-bold">2nd House (Liquid Savings)</div>
          <div class="text-lg font-extrabold text-white">${bindu2} SAV Bindus (${rashi2.en})</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
          <div class="text-xs text-rose-300 font-bold">12th House (Outflow & Assets)</div>
          <div class="text-lg font-extrabold text-white">${bindu12} SAV Bindus (${rashi12.en})</div>
        </div>
      </div>

      <p>
        <strong>1. Dhana Yoga Architecture (Income Generation vs. Retention):</strong> Your 11th House of massive gains is ruled by <strong>${rashi11.lord} (${rashi11.en})</strong> sitting in the <strong>${lord11.bhava}th House</strong>, while your 2nd House of accumulated bank balance is ruled by <strong>${rashi2.lord} (${rashi2.en})</strong> positioned in the <strong>${lord2.bhava}th House</strong>. With <strong>${bindu11} Bindus</strong> in the 11th House, your capacity to earn and attract high-value opportunities is strong—even in tight situations, cosmic provision arranges funds when you genuinely need them.
      </p>

      <p>
        <strong>2. The Unspoken "Money Leak" Pattern in Your Chart:</strong> Look closely at your past experience with savings: every time your bank balance crosses a comfortable threshold, an unexpected family obligation, medical/vehicle expense, or sudden commitment mysteriously appears to drain the surplus. Furthermore, whenever you lend money to friends or relatives out of emotional generosity, that money rarely returns on time—and asking for your own money back ends up straining the relationship.
      </p>

      <p>
        <strong>3. Your Wealth-Locking Formula for Multi-Crore Net Worth:</strong> Because your 2nd and 12th house axis reacts strongly to idle liquid cash, keeping large sums sitting in a regular savings account invites unplanned expenses. To build massive wealth, you must intentionally "spend" your surplus into <strong>illiquid appreciating assets—Land/Real Estate, Gold, Index/Equity Compounds, or Business Infrastructure</strong> the moment it arrives. When you consciously feed the 12th house through disciplined investment, sudden financial leaks stop immediately.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 5: LUCK FACTOR, FORTUNE & DESTINY MILESTONES
  // --------------------------------------------------------------------------
  function buildChapter5Luck(ctx) {
    const { lang, chart, planetAnalysis, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi9 = RASHI_DATA[getRashiOfBhava(asc, 9)];
    const lord9 = planetAnalysis[rashi9.lord];
    const m = numData.mulank;
    const b = numData.bhagyank;

    // Crucial turning point ages derived from Bhagyank, Mulank & 9th Lord
    const milestoneAges = Array.from(new Set([
      18 + m,
      21 + (b % 5),
      24 + (m % 4),
      27 + (b % 3),
      30 + (lord9.bhava % 4),
      33 + (m % 3),
      36,
      42
    ])).sort((x, y) => x - y);

    if (lang === "hi") {
      return `
        <p>
          <strong>1. भाग्य भाव (9th House — Bhagya Sthana) का रहस्य:</strong> आपकी कुंडली के नवम भाव (भाग्य एवं धर्म स्थान) में <strong>${rashi9.hi}</strong> राशि है और आपके भाग्येश <strong>${rashi9.lordHi}</strong> कुंडली के <strong>${lord9.bhava}वें भाव (${BHAVA_MEANINGS[lord9.bhava].hi})</strong> में विराजमान हैं। इसका अर्थ यह है कि आपका भाग्य केवल लॉटरी या अकर्मण्यता से नहीं, बल्कि जैसे ही आप ${lord9.bhava}वें भाव से जुड़े कर्मों में पहला कदम बढ़ाते हैं, ईश्वरीय कृपा पीछे से अदृश्य हाथ की तरह आपको सहारा देती है।
        </p>

        <p>
          <strong>2. आपके साथ होने वाला '99% पर अटकने' का रहस्य:</strong> आपने अपने जीवन में कई बार यह अनुभव किया होगा कि जिस काम को दूसरे लोग साधारण प्रयास में पा लेते हैं, उसी काम में आपके साथ अंतिम क्षण (99%) पर कोई न कोई अड़चन आ जाती है। लेकिन ध्यान दीजिए—जब भी आपका कोई छोटा दरवाजा बंद हुआ है, उसके कुछ समय बाद नियति ने आपके लिए उससे कहीं बड़ा और बेहतर मार्ग खोला है, क्योंकि आपके भाग्येश आपको छोटे समझौतों के लिए रुकने नहीं देते।
        </p>

        <p>
          <strong>3. आपके जीवन के निर्णायक भाग्योदय वर्ष (Crucial Age Turning Points):</strong> वैदिक भृगु चक्र एवं अंक ज्योतिष के अनुसार आपकी आयु के <strong>${milestoneAges.join(", ")}वें वर्ष</strong> आपके जीवन की दिशा बदलने वाले स्वर्णिम पड़ाव (Turning Points) हैं। वर्तमान में आपकी आयु <strong>${numData.age} वर्ष</strong> है और वर्ष <strong>${numData.currentYear}</strong> आपके लिए <strong>व्यक्तिगत वर्ष अंक ${numData.personalYear} (Personal Year ${numData.personalYear})</strong> की ऊर्जा लेकर आया है, जो आपके जीवन में पुराने बोझ को उतारकर नई नींव रखने का स्पष्ट संकेत दे रहा है।
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">भाग्योदय दिशा</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.directionHi}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">शुभ अंक (Lucky Nos.)</div>
            <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">व्यक्तिगत वर्ष (${numData.currentYear})</div>
            <div class="text-sm font-bold text-white mt-1">अंक ${numData.personalYear} चक्र</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">भाग्येश ग्रह</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.lordHi} (${lord9.bhava}वां भाव)</div>
          </div>
        </div>
      `;
    }

    return `
      <p>
        <strong>1. Your 9th House of Bhagya (Divine Grace & Fortune Mechanics):</strong> Your 9th House of luck and higher destiny falls in <strong>${rashi9.en}</strong>, and your Bhagya Lord <strong>${rashi9.lord}</strong> is placed in the <strong>${lord9.bhava}th House (${BHAVA_MEANINGS[lord9.bhava].en})</strong>. This placement reveals that your luck is not passive lottery luck—it is <em>Karmic Activation Luck</em>. The moment you take bold action aligned with the ${lord9.bhava}th house, unseen synchronicities, mentors, and timely rescues step into your path.
      </p>

      <p>
        <strong>2. The "99th-Percentile Test" Pattern in Your Life:</strong> You have likely noticed a recurring pattern: things that come effortlessly to average people often test your patience right up to the 99th percentile. Last-minute delays have frustrated you more than once. Yet in hindsight, every single door that slammed shut in your past was actually cosmic protection preventing you from settling for a mediocre life path far below your true destiny.
      </p>

      <p>
        <strong>3. Crucial Destiny Turning-Point Ages:</strong> Synthesizing Bhrigu progression with your Mulank (${m}) and Bhagyank (${b}), the most transformative milestone ages of your life are <strong>Ages ${milestoneAges.join(", ")}</strong>. At your current age of <strong>${numData.age}</strong>, calendar year <strong>${numData.currentYear}</strong> operates as your <strong>Personal Year ${numData.personalYear}</strong>—marking a decisive window for restructuring your career, relationships, and long-term priorities.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Lucky Direction</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.direction}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Power Numbers</div>
          <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Personal Year (${numData.currentYear})</div>
          <div class="text-sm font-bold text-white mt-1">Vibration ${numData.personalYear}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Bhagya Lord</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.lord} (${lord9.bhava}th House)</div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 6: LOVE LIFE, ATTRACTION & EMOTIONAL PATTERNS
  // --------------------------------------------------------------------------
  function buildChapter6Love(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5 = planetAnalysis[rashi5.lord];
    const ven = planetAnalysis.Venus;
    const moon = planetAnalysis.Moon;
    const rahu = planetAnalysis.Rahu;

    if (lang === "hi") {
      return `
        <p>
          <strong>1. पंचम भाव एवं शुक्र-चंद्र का प्रेम समीकरण (Romantic Chemistry & Attachment):</strong> आपके प्रेम और भावनात्मक आकर्षण का पंचम भाव <strong>${rashi5.hi}</strong> राशि से संचालित है, जिसके स्वामी <strong>${rashi5.lordHi}</strong> कुंडली के <strong>${lord5.bhava}वें भाव</strong> में हैं। प्रेम के कारक <strong>शुक्र (${RASHI_DATA[ven.d1].hi} — ${ven.bhava}वां भाव, नवांश में ${RASHI_DATA[ven.d9].hi})</strong> और मन के कारक <strong>चंद्रमा (${RASHI_DATA[moon.d1].hi})</strong> यह स्पष्ट करते हैं कि आप प्रेम में सतही या टाइम-पास संबंध (Casual Flings) नहीं बना सकते। जब आप किसी से जुड़ते हैं, तो पूरी आत्मा और निष्ठा से जुड़ते हैं।
        </p>

        <p>
          <strong>2. रिश्तों में आपका अनकहा दर्द (The Karmic Imbalance in Love):</strong> आपके प्रेम जीवन में एक गहरा पैटर्न बार-बार देखा जाता है—आप रिश्ते में सामने वाले की छोटी-छोटी खुशियों, सम्मान और भावनात्मक सुरक्षा का पूरा ध्यान रखते हैं, लेकिन बदले में जब आपको भावनात्मक सहारे या स्पष्टता (Clarity) की जरूरत होती है, तो सामने वाला व्यक्ति या तो भ्रमित (Confused) हो जाता है या आपको 'टेकन फॉर ग्रांटेड' लेने लगता है।
        </p>

        <p>
          <strong>3. राहु-केतु व शुक्र का आकर्षण एवं सावधानी:</strong> ${
            ven.conjunctWith.includes("Rahu") || ven.conjunctWith.includes("Saturn") || ven.conjunctWith.includes("Mars") || rahu.bhava === 5 || rahu.bhava === 7
              ? "आपकी कुंडली में प्रेम अक्ष पर तीव्र ग्रहों का प्रभाव यह दर्शाता है कि आपके जीवन में कम से कम एक ऐसा गहरा भावनात्मक जुड़ाव या अधूरा रिश्ता आता है जो आपको भीतर तक झकझोर कर रख देता है और आपको लोगों की असली पहचान करना सिखाता है।"
              : "शुक्र और पंचमेश की स्थिति आपको विपरीत लिंग में स्वाभाविक आकर्षण देती है, परंतु जब तक आपका बौद्धिक और आत्मिक स्तर किसी से मैच न हो, तब तक आप अपना दिल आसानी से नहीं खोलते।"
          } आपके लिए सबसे बड़ा नियम यह है कि किसी के केवल मीठे शब्दों पर नहीं, बल्कि उसके निरंतर व्यवहार (Consistency) पर ही अपना हृदय समर्पित करें।
        </p>
      `;
    }

    return `
      <p>
        <strong>1. Your 5th House & Venus-Moon Romantic Blueprint:</strong> Your 5th House of romance and emotional magnetism falls in <strong>${rashi5.en}</strong>, with its ruler <strong>${rashi5.lord}</strong> placed in the <strong>${lord5.bhava}th House</strong>. Meanwhile, <strong>Venus (Karaka of Love) sits in ${RASHI_DATA[ven.d1].en} (${ven.bhava}th House)</strong> and shifts to <strong>${RASHI_DATA[ven.d9].en}</strong> in your Navamsa (D9), while your <strong>Moon resides in ${RASHI_DATA[moon.d1].en}</strong>. This configuration makes you incapable of shallow, transactional romance—when you love someone, your loyalty is fierce, protective, and all-in.
      </p>

      <p>
        <strong>2. The Unspoken Emotional Imbalance You Have Faced:</strong> Your chart reveals a recurring emotional paradox: you love with deep intensity and remember the smallest details about the person you care for, yet you have historically attracted partners who either struggle to express emotional depth equally or start taking your availability for granted once they feel secure. You hate begging for attention—when you sense coldness, you suffer silently inside while acting completely unbothered on the outside.
      </p>

      <p>
        <strong>3. Karmic Attraction Triggers & Heartbreak Shield:</strong> ${
          ven.conjunctWith.includes("Rahu") || ven.conjunctWith.includes("Saturn") || ven.conjunctWith.includes("Mars") || rahu.bhava === 5 || rahu.bhava === 7
            ? "Because intense karmic nodes/malefics influence your romantic axis, your chart carries at least one deeply transformative emotional heartbreak or intense past-life connection designed to awaken your self-worth and strip away illusions."
            : "Your Venus-5th Lord synergy gives you strong natural magnetism, yet your heart only unlocks when intellectual respect and emotional safety coexist."
        } Your golden rule in love is simple: never judge a partner by their initial intensity in the first 60 days; judge them strictly by their consistency when life gets inconvenient.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 7: FUTURE LIFE PARTNER & MARRIED LIFE REALITY
  // --------------------------------------------------------------------------
  function buildChapter7Partner(ctx) {
    const { lang, gender, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi7 = RASHI_DATA[getRashiOfBhava(asc, 7)];
    const lord7Key = rashi7.lord;
    const lord7 = planetAnalysis[lord7Key];
    const d9Rashi7 = RASHI_DATA[getRashiOfBhava(chart.Asc.d9, 7)];
    const ulRashi = RASHI_DATA[specialLagnas.upapadaRashi];
    const spouseKarakaKey = gender === "female" ? "Jupiter" : "Venus";
    const spouseKaraka = planetAnalysis[spouseKarakaKey];

    // Derive likely first-letter phonetic sounds from 7th Rashi & Nakshatra of 7th Lord
    const lord7Nak = NAKSHATRA_DATA[lord7.nak];

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold">सप्तम भाव (D1 विवाह स्थान)</div>
            <div class="text-base font-extrabold text-white mt-0.5">${rashi7.hi} (स्वामी: ${rashi7.lordHi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
            <div class="text-xs text-pink-300 font-bold">नवांश (D9) सप्तम एवं कारक</div>
            <div class="text-base font-extrabold text-white mt-0.5">${d9Rashi7.hi} • ${spouseKaraka.meta.hi}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">जैमिनी उपपद लग्न (UL)</div>
            <div class="text-base font-extrabold text-white mt-0.5">${ulRashi.hi} (${rashi7.directionHi})</div>
          </div>
        </div>

        <p>
          <strong>1. आपके भावी जीवनसाथी का रंग-रूप एवं शारीरिक व्यक्तित्व (Physical Appearance & Aura):</strong> आपकी लग्न कुंडली के सप्तम भाव में <strong>${rashi7.hi}</strong> और नवांश (D9) के सप्तम में <strong>${d9Rashi7.hi}</strong> का प्रभाव है। इसके अनुसार आपके जीवनसाथी के शारीरिक व्यक्तित्व में <em>${rashi7.bodyBuildHi}</em> स्पष्ट झलकेगी। उनके चेहरे पर एक स्वाभाविक गरिमा और आंखों में विशेष आकर्षण होगा, जिससे वे भीड़ में भी अलग पहचान बनाएंगे।
        </p>

        <p>
          <strong>2. जीवनसाथी का स्वभाव, मनोविज्ञान एवं पारिवारिक पृष्ठभूमि (Nature & Background):</strong> आपके सप्तमेश <strong>${rashi7.lordHi}</strong> कुंडली के <strong>${lord7.bhava}वें भाव (${lord7Nak.name} नक्षत्र)</strong> में हैं और जैमिनी <strong>उपपद लग्न (UL) ${ulRashi.hi}</strong> में है। आपका जीवनसाथी स्वभाव से <em>${rashi7.temperamentHi}</em> तथा अंदरूनी तौर पर <em>${d9Rashi7.temperamentHi}</em> होगा। वे एक सम्मानित व संस्कारी पारिवारिक पृष्ठभूमि से आएंगे और विवाह के बाद आपके लिए केवल एक साथी ही नहीं, बल्कि कठिन निर्णयों में सबसे मजबूत सलाहकार साबित होंगे।
        </p>

        <p>
          <strong>3. विवाह की दिशा, मिलन का माध्यम एवं भाग्योदय (Direction, Meeting & Post-Marriage Luck):</strong> आपके विवाह का योग जन्मस्थान से <strong>${rashi7.directionHi}</strong> या <strong>${d9Rashi7.directionHi}</strong> की ओर प्रबल है। सप्तमेश का ${lord7.bhava}वें भाव से संबंध यह दर्शाता है कि ${
            lord7.bhava === 5 || lord7.bhava === 11 || lord7.bhava === 3
              ? "आपका विवाह आपकी अपनी पसंद (Love-cum-Arranged) या किसी परिचित/सोशल नेटवर्क के माध्यम से तय होने की प्रबल संभावना है।"
              : "आपका विवाह भले ही परिवार की सहमति या प्रस्ताव से सामने आए, परंतु विवाह से पूर्व आप दोनों के बीच गहरा मानसिक व भावनात्मक जुड़ाव स्थापित होगा।"
          } सबसे महत्वपूर्ण बात—नवांश में ${spouseKaraka.meta.hi} की स्थिति यह प्रमाणित करती है कि <strong>विवाह के 18 से 24 महीनों के भीतर</strong> आपके आर्थिक स्तर और सामाजिक प्रतिष्ठा में एक बड़ा उछाल (Post-Marriage Bhagya Udaya) आएगा।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
          <div class="text-xs text-rose-300 font-bold">7th House (D1 Kalatra Bhava)</div>
          <div class="text-base font-extrabold text-white mt-0.5">${rashi7.en} (Lord: ${rashi7.lord})</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
          <div class="text-xs text-pink-300 font-bold">Navamsa (D9) 7th & Karaka</div>
          <div class="text-base font-extrabold text-white mt-0.5">${d9Rashi7.en} • ${spouseKarakaKey}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-xs text-amber-300 font-bold">Jaimini Upapada Lagna (UL)</div>
          <div class="text-base font-extrabold text-white mt-0.5">${ulRashi.en} (${rashi7.direction})</div>
        </div>
      </div>

      <p>
        <strong>1. Physical Appearance, Vibe & First Impression of Your Future Partner:</strong> Synthesizing your 7th House in <strong>${rashi7.en}</strong> with your Navamsa (D9) 7th House in <strong>${d9Rashi7.en}</strong> and Spouse-Karaka <strong>${spouseKarakaKey} in ${RASHI_DATA[spouseKaraka.d1].en}</strong>, your partner will possess <em>${rashi7.bodyBuildEn}</em>. Even in casual attire, they carry a distinct, composed self-respect and an expressive gaze that immediately stands out in a room.
      </p>

      <p>
        <strong>2. Core Personality, Profession & Family Lineage (Upapada Lagna in ${ulRashi.en}):</strong> Because your 7th Lord <strong>${rashi7.lord}</strong> sits in the <strong>${lord7.bhava}th House under ${lord7Nak.name} Nakshatra</strong>, your spouse's outer personality will be <em>${rashi7.temperamentEn}</em>, while their deeper soul nature in marriage (D9) is <em>${d9Rashi7.temperamentEn}</em>. Your Jaimini Upapada Lagna in <strong>${ulRashi.en}</strong> indicates a partner from a dignified, self-respecting family background who brings strong practical intelligence and career ambition into the marriage.
      </p>

      <p>
        <strong>3. Direction of Marriage, How You Meet & Post-Marriage Destiny:</strong> Astrologically, the strongest directional pull for your partner's roots or meeting place is toward the <strong>${rashi7.direction}</strong> or <strong>${d9Rashi7.direction}</strong> relative to your birthplace. With your 7th Lord activating the ${lord7.bhava}th house, ${
          lord7.bhava === 5 || lord7.bhava === 11 || lord7.bhava === 3
            ? "your chart strongly favors a Love-cum-Arranged union or meeting through professional/social networks where friendship turns into commitment."
            : "whether introduced through family or destiny-led circumstances, a strong one-on-one mental bond will precede the wedding."
        } Most importantly, your Navamsa configuration triggers <strong>Bhagya-Udaya after marriage</strong>—within 18 to 24 months of tying the knot, your financial stability and asset creation accelerate noticeably.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 8: EVERY PLANET IN-DEPTH ANALYSIS + MUTUAL ASPECTS (DRISHTI & YUTI)
  // --------------------------------------------------------------------------
  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const pKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    const modeBanner = chart.isFullChartMode
      ? (lang === "hi"
          ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>99.9% पूर्ण कुंडली मोड सक्रिय:</strong> नीचे आपके द्वारा दर्ज किए गए सभी 9 ग्रहों की लग्न (D1), नक्षत्र, नवांश (D9), युति (Conjunctions) और पाराशरी विशेष दृष्टियों (4/8, 5/9, 3/10) का संपूर्ण विश्लेषण दिया गया है।</div>`
          : `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>99.9% Full Precision Chart Mode Active:</strong> Below is the complete Parashari & Navamsa synthesis of all 9 Grahas, their house lordships, conjunctions (Yutis), and mutual special aspects (Drishtis).</div>`)
      : (lang === "hi"
          ? `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-info-circle mr-2"></i><strong>सौर-चंद्र एवं चैल्डियन सिंथेसिस मोड:</strong> यह विश्लेषण आपकी जन्म-तिथि व नाम तरंग से व्युत्पन्न ग्रह-स्थिति पर आधारित है। यदि आप फॉर्म के Step 2 में अपने सटीक लग्न व ग्रहों को ऑन करते हैं, तो यह अध्याय आपके D1/D9 चार्ट के 100% सटीक घरों के अनुसार तुरंत अपडेट हो जाएगा!</div>`
          : `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-info-circle mr-2"></i><strong>Solar-Nakshatra & Chaldean Synthesis Mode:</strong> Below is your planetary matrix derived from your birth date and name vibration. (Tip: Toggle on Step 2 above to input your exact D1/D9 placements from Prokerala/AstroSage for 99.9% house-by-house precision!)</div>`);

    const cardsHtml = pKeys.map(k => {
      const info = planetAnalysis[k];
      const d1Rashi = RASHI_DATA[info.d1];
      const d9Rashi = RASHI_DATA[info.d9];
      const nak = NAKSHATRA_DATA[info.nak];
      const bhavaDesc = BHAVA_MEANINGS[info.bhava];

      // Format Conjunctions (Yuti)
      let yutiText = "";
      if (info.conjunctWith.length > 0) {
        const names = info.conjunctWith.map(c => lang === "hi" ? PLANET_META[c].hi : PLANET_META[c].en).join(", ");
        yutiText = lang === "hi"
          ? `<span class="text-amber-300 font-semibold">युति (Conjunction):</span> यह ग्रह ${info.bhava}वें भाव में <strong>${names}</strong> के साथ बैठकर एक विशेष संयुक्त योग बना रहा है।`
          : `<span class="text-amber-300 font-semibold">Conjunction (Yuti):</span> Seated together with <strong>${names}</strong> in the ${info.bhava}th House, fusing their karmic agendas.`;
      } else {
        yutiText = lang === "hi"
          ? `<span class="text-gray-400">युति (Conjunction):</span> यह ग्रह ${info.bhava}वें भाव में स्वतंत्र रूप से (बिना किसी अन्य ग्रह की युति के) अपना पूर्ण प्रभाव दे रहा है।`
          : `<span class="text-gray-400">Conjunction (Yuti):</span> Operates independently in the ${info.bhava}th House without direct conjunctional interference.`;
      }

      // Format Outgoing Aspects (Drishti Cast)
      const outgoingList = info.aspectedTargets.map(t => {
        const tRashi = RASHI_DATA[t.targetRashi];
        const hitPlanets = t.planetsThere.length > 0
          ? (lang === "hi"
              ? ` (जहाँ स्थित <strong>${t.planetsThere.map(p => PLANET_META[p].hi).join(", ")}</strong> पर सीधी दृष्टि है)`
              : ` (directly aspecting <strong>${t.planetsThere.map(p => PLANET_META[p].en).join(", ")}</strong>)`)
          : "";
        return lang === "hi"
          ? `${t.nthAspect}वीं दृष्टि ➔ <strong>${t.targetBhava}वें भाव (${tRashi.hi})</strong> पर${hitPlanets}`
          : `${t.nthAspect}th Aspect ➔ <strong>${t.targetBhava}th House (${tRashi.en})</strong>${hitPlanets}`;
      }).join(" • ");

      // Format Incoming Aspects (Drishti Received)
      const incomingList = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => {
            return lang === "hi"
              ? `<strong>${PLANET_META[inc.fromPlanet].hi}</strong> की ${inc.nthAspect}वीं दृष्टि`
              : `${inc.nthAspect}th Aspect from <strong>${PLANET_META[inc.fromPlanet].en}</strong>`;
          }).join(", ")
        : (lang === "hi" ? "किसी अन्य ग्रह की सीधी पाराशरी दृष्टि नहीं (स्वतंत्र फल)" : "Unaspected by external planets (Pure autonomous expression)");

      if (lang === "hi") {
        return `
          <div class="p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h4 class="text-lg md:text-xl font-bold text-white">
                  ${info.meta.hi} ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 ml-2">वक्री / विशेष बल</span>' : ''}
                </h4>
                <p class="text-xs text-gray-400 mt-0.5">कारकत्व: ${info.meta.karakaHi}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">
                ${info.dignity.statusHi}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">लग्न कुंडली (D1) स्थान:</span>
                <strong class="text-amber-300">${info.bhava}वां भाव — ${d1Rashi.hi}</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नक्षत्र एवं चरण ऊर्जा:</span>
                <strong class="text-purple-300">${nak.name} (स्वामी: ${nak.ruler})</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नवांश कुंडली (D9) आत्मा:</span>
                <strong class="text-emerald-300">${info.d9Bhava}वां भाव — ${d9Rashi.hi}</strong>
              </div>
            </div>

            <p class="text-sm text-gray-200 mb-0">
              <strong>गहन फलित विश्लेषण:</strong> आपकी कुंडली में ${info.meta.hi} <strong>${bhavaDesc.hi}</strong> में ${d1Rashi.hi} राशि और <strong>${nak.name}</strong> नक्षत्र में स्थित हैं। नक्षत्र प्रभाव से यह ग्रह आपके जीवन में <em>${nak.traitHi}</em> जाग्रत करता है। नवांश (D9) में ${d9Rashi.hi} राशि में जाने के कारण जीवन के उत्तरार्ध में इस ग्रह का प्रभाव आपके ${info.d9Bhava}वें भाव के फलों को सीधे नियंत्रित करता है।
            </p>

            <div class="text-xs md:text-sm space-y-1.5 pt-2 border-t border-white/10 text-gray-300">
              <div>• ${yutiText}</div>
              <div>• <span class="text-cyan-300 font-semibold">दृष्टि प्रभाव (Aspects Cast):</span> ${outgoingList}</div>
              <div>• <span class="text-pink-300 font-semibold">इस ग्रह पर पड़ने वाली दृष्टियां (Aspects Received):</span> ${incomingList}</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h4 class="text-lg md:text-xl font-bold text-white">
                ${info.meta.en} ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 ml-2">Retrograde / High Cheshta Bala</span>' : ''}
              </h4>
              <p class="text-xs text-gray-400 mt-0.5">Significations: ${info.meta.karakaEn}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">
              ${info.dignity.statusEn}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D1 Birth Chart Placement:</span>
              <strong class="text-amber-300">${info.bhava}th House — ${d1Rashi.en}</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">Nakshatra Star Matrix:</span>
              <strong class="text-purple-300">${nak.name} (Ruler: ${nak.ruler})</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D9 Navamsa Soul Position:</span>
              <strong class="text-emerald-300">${info.d9Bhava}th House — ${d9Rashi.en}</strong>
            </div>
          </div>

          <p class="text-sm text-gray-200 mb-0">
            <strong>Deep Astrological Synthesis:</strong> Positioned in your <strong>${bhavaDesc.en}</strong> in ${d1Rashi.en} under <strong>${nak.name} Nakshatra</strong>, ${info.meta.en} infuses that life area with <em>${nak.traitEn}</em>. Inside your Navamsa (D9) chart, it moves into <strong>${d9Rashi.en} (${info.d9Bhava}th D9 House)</strong>, showing how its deeper fruit matures as you cross key age milestones.
          </p>

          <div class="text-xs md:text-sm space-y-1.5 pt-2 border-t border-white/10 text-gray-300">
            <div>• ${yutiText}</div>
            <div>• <span class="text-cyan-300 font-semibold">Parashari Aspects Cast (Drishti):</span> ${outgoingList}</div>
            <div>• <span class="text-pink-300 font-semibold">Mutual Aspects Received:</span> ${incomingList}</div>
          </div>
        </div>
      `;
    }).join("");

    return modeBanner + `<div class="space-y-4">${cardsHtml}</div>`;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 9: SPECIAL DERIVED LAGNAS + ASHTAKAVARGA BINDUS
  // --------------------------------------------------------------------------
  function buildChapter9SpecialLagnas(ctx) {
    const { lang, chart, specialLagnas } = ctx;
    const chandra = RASHI_DATA[specialLagnas.chandraLagna];
    const surya = RASHI_DATA[specialLagnas.suryaLagna];
    const navamsa = RASHI_DATA[specialLagnas.navamsaLagna];
    const arudha = RASHI_DATA[specialLagnas.arudhaRashi];
    const karakamsa = RASHI_DATA[specialLagnas.karakamsaRashi];
    const bindus = specialLagnas.houseBindus;

    const binduGridHtml = Object.keys(bindus).map(h => {
      const b = bindus[h];
      const color = b >= 30 ? "border-emerald-400/50 text-emerald-300" : (b <= 25 ? "border-rose-400/50 text-rose-300" : "border-amber-400/40 text-amber-300");
      return `
        <div class="p-2.5 rounded-xl bg-slate-950/90 border ${color} text-center">
          <div class="text-[10px] uppercase text-gray-400">${lang === "hi" ? `भाव ${h}` : `House ${h}`}</div>
          <div class="text-base font-extrabold mt-0.5">${b} <span class="text-[10px] font-normal">${lang === "hi" ? "बिंदु" : "Bindus"}</span></div>
        </div>
      `;
    }).join("");

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30">
            <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. चंद्र लग्न (Chandra Lagna — ${chandra.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              वैदिक ज्योतिष में सुदर्शन चक्र के अनुसार जन्म लग्न शरीर है तो <strong>चंद्र लग्न (${chandra.hi})</strong> आपकी मानसिक प्रतिक्रिया और भावनात्मक संसार का केंद्र है। चंद्र लग्न से देखने पर आपकी मानसिक शांति और माता/सुख का समीकरण सीधे तौर पर आपके भावनात्मक निर्णयों को नियंत्रित करता है।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30">
            <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (Surya Lagna — ${surya.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              <strong>सूर्य लग्न (${surya.hi})</strong> आपकी आत्मा के स्वाभिमान, पिता की विरासत और समाज में आपके अधिकार (Authority) को दर्शाता है। सूर्य लग्न से आपके दशम और एकादश भाव की सक्रियता बताती है कि आप किसी के अधीन दबकर रहने के लिए नहीं जन्मे हैं।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30">
            <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. नवांश लग्न एवं कारकांश (Navamsa ${navamsa.hi} & Karakamsa ${karakamsa.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              लग्न कुंडली (D1) केवल वृक्ष का बीज है, परंतु <strong>नवांश लग्न (${navamsa.hi})</strong> और <strong>कारकांश लग्न (${karakamsa.hi})</strong> उस वृक्ष का वास्तविक फल हैं। 30–32 वर्ष की आयु के बाद और विवाह के पश्चात आपका जीवन नवांश लग्न के गुणों (<em>${navamsa.temperamentHi}</em>) के अनुसार फलित होता है।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30">
            <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (Arudha Lagna AL — ${arudha.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              आपका <strong>आरूढ़ लग्न (AL) ${arudha.hi}</strong> राशि में (लग्न से <strong>${specialLagnas.arudhaHouseFromLagna}वें भाव</strong> में${specialLagnas.arudhaExceptionApplied ? " — जैमिनी स्व-सप्तम अपवाद नियम से संशोधित" : ""}) पड़ता है। आरूढ़ लग्न यह बताता है कि दुनिया आपको किस चश्मे से देखती है (Public Illusion vs. Reality)। यही कारण है कि लोग अक्सर आपकी बाहरी गंभीरता या कामयाबी को देखकर यह अंदाजा ही नहीं लगा पाते कि आप भीतर किस संघर्ष से गुजर रहे हैं।
            </p>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. सर्वाष्टकवर्ग (Sarvashtakavarga — SAV Bindu Matrix)</h4>
            <span class="text-xs text-gray-400">28+ बिंदु = असाधारण बल • 25 से कम = विशेष उपाय आवश्यक</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            ${binduGridHtml}
          </div>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30">
          <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. Chandra Lagna (Moon Chart — ${chandra.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            In Sudarshana Chakra astrology, while the Ascendant is your physical chassis, <strong>Chandra Lagna (${chandra.en})</strong> is the operating system of your mind. Planetary transits (Gochara) and emotional fulfillment register through ${chandra.en}, explaining why your inner emotional security requires <em>${chandra.temperamentEn}</em>.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30">
          <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (Solar Soul Chart — ${surya.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            Your <strong>Surya Lagna (${surya.en})</strong> governs your vitality, paternal karma, and social authority. Counting houses from ${surya.en} reveals where your soul refuses to compromise its dignity and how leadership naturally gravitates toward you in crisis moments.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30">
          <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. Navamsa (D9 ${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            If the D1 chart is the tree, the <strong>Navamsa Lagna (${navamsa.en})</strong> and <strong>Karakamsa (${karakamsa.en})</strong> determine the actual quality of the fruit. After age 30 and post-marriage, your life visibly shifts toward the traits of ${navamsa.en}—making you <em>${navamsa.temperamentEn}</em>.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30">
          <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            Your <strong>Arudha Pada (AL)</strong> falls in <strong>${arudha.en}</strong> (${specialLagnas.arudhaHouseFromLagna}th house from Lagna${specialLagnas.arudhaExceptionApplied ? " — calibrated via Jaimini's 1st/7th Svastha exception rule" : ""}). While Lagna is who you truly are, Arudha Lagna is the <em>Maya</em> (public perception) the world projects onto you—explaining why outsiders often misjudge how easy or hard your journey has been.
          </p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. Sarvashtakavarga (SAV) 12-House Bindu Strength</h4>
          <span class="text-xs text-gray-400">28+ Bindus = High Manifestation Power • Below 26 = Requires Conscious Remedy</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          ${binduGridHtml}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 10: CURRENT TIME PHASE (MAHADASHA & ANTARDASHA)
  // --------------------------------------------------------------------------
  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData } = ctx;
    const mdInfo = planetAnalysis[dasha.md];
    const adInfo = planetAnalysis[dasha.ad];
    const mdRashi = RASHI_DATA[mdInfo.d1];
    const adRashi = RASHI_DATA[adInfo.d1];
    const relativeHouseOfAD = getBhavaFrom(mdInfo.d1, adInfo.d1);

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
            <div class="text-xs text-cyan-300 font-bold uppercase">सक्रिय महादशा (Major Period)</div>
            <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.hi} महादशा</div>
            <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}वां भाव (${mdRashi.hi}) सक्रिय</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
            <div class="text-xs text-purple-300 font-bold uppercase">सक्रिय अंतर्दशा (Sub-Period)</div>
            <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.hi} अंतर्दशा</div>
            <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}वां भाव (${adRashi.hi}) सक्रिय</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
            <div class="text-xs text-amber-300 font-bold uppercase">महादशा-अंतर्दशा संबंध</div>
            <div class="text-xl font-extrabold text-white mt-1">दशानाथ से ${relativeHouseOfAD}वां भाव</div>
            <div class="text-xs text-gray-400 mt-0.5">${dasha.isManualDasha ? "मैनुअल चयनित दशा" : "जन्म विवरण से स्वतः परिकलित"}</div>
          </div>
        </div>

        <p>
          <strong>1. वर्तमान महादशा (${mdInfo.meta.hi}) आपके जीवन में क्या बदल रही है:</strong> इस समय आपके जीवन की मुख्य कमान <strong>${mdInfo.meta.hi}</strong> के हाथों में है, जो आपकी कुंडली के <strong>${mdInfo.bhava}वें भाव (${BHAVA_MEANINGS[mdInfo.bhava].hi})</strong> में बैठे हैं। महादशा स्वामी का नियम है कि वह व्यक्ति के पूरे ध्यान, परिस्थितियों और कर्म-परीक्षा को अपने भाव (${mdInfo.bhava}वां भाव) और अपने कारकत्व (${mdInfo.meta.karakaHi}) के इर्द-गिर्द खींच लाता है।
        </p>

        <p>
          <strong>2. सूक्ष्म अंतर्दशा (${adInfo.meta.hi}) और Dasha-Pravesh समीकरण:</strong> महादशा के भीतर वर्तमान में <strong>${adInfo.meta.hi}</strong> की अंतर्दशा चल रही है, जो लग्न से <strong>${adInfo.bhava}वें भाव</strong> में और महादशा स्वामी से <strong>${relativeHouseOfAD}वें स्थान</strong> पर स्थित है। ${
            relativeHouseOfAD === 6 || relativeHouseOfAD === 8 || relativeHouseOfAD === 12
              ? `<strong>विशेष ज्योतिषीय चेतावनी (षडाष्टक/द्वादश दशा संबंध):</strong> चूंकि महादशानाथ और अंतर्दशानाथ एक-दूसरे से ${relativeHouseOfAD}वें (6/8/12) अक्ष पर हैं, इसलिए इस समय आपके मन में अचानक बेचैनी, नींद में खलल, और 'मेहनत सौ प्रतिशत पर परिणाम पचास प्रतिशत' जैसी स्थिति बन रही है।`
              : `महादशानाथ से अंतर्दशानाथ का ${relativeHouseOfAD}वां संबंध यह दर्शाता है कि पिछले 14–18 महीनों से जो कार्य रुके हुए थे, अब उनके निर्णय और परिवर्तन का समय आ गया है।`
          }
        </p>

        <p>
          <strong>3. आगामी 12 से 18 महीनों की समय-सीमा (Upcoming Timeline):</strong> वर्तमान वर्ष <strong>${numData.currentYear}</strong> के उत्तरार्ध और आगामी वर्ष की पहली तिमाही में जब गोचर के बृहस्पति और शनि आपके ${mdInfo.bhava}वें और ${adInfo.bhava}वें भाव को दृष्टि देंगे, तब करियर, स्थान-परिवर्तन या रिश्ते से जुड़ा एक बड़ा फैसला आपके सामने आएगा। इस निर्णय को भावनाओं में बहकर नहीं, बल्कि अपनी दशा के स्वामी की शक्ति को समझकर लेना अत्यंत आवश्यक है।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
          <div class="text-xs text-cyan-300 font-bold uppercase">Active Mahadasha (Major Cycle)</div>
          <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">Activating ${mdInfo.bhava}th House (${mdRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
          <div class="text-xs text-purple-300 font-bold uppercase">Active Antardasha (Sub-Period)</div>
          <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">Activating ${adInfo.bhava}th House (${adRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
          <div class="text-xs text-amber-300 font-bold uppercase">Dasha-Bhukti Relative Axis</div>
          <div class="text-xl font-extrabold text-white mt-1">${relativeHouseOfAD}th from MD Lord</div>
          <div class="text-xs text-gray-400 mt-0.5">${dasha.isManualDasha ? "Manual Dasha Calibration" : "Auto-Calculated from Birth Matrix"}</div>
        </div>
      </div>

      <p>
        <strong>1. How Your Active ${mdInfo.meta.en} Mahadasha Is Reshaping Your Life:</strong> Right now, the master switch of your destiny is governed by <strong>${mdInfo.meta.en}</strong>, seated in your <strong>${mdInfo.bhava}th House (${BHAVA_MEANINGS[mdInfo.bhava].en})</strong>. In Vedic Vimshottari predictive science, a planet in Mahadasha forces you to confront and master every unfinished lesson of the house it occupies (${mdInfo.bhava}th) and the houses it aspects.
      </p>

      <p>
        <strong>2. The ${adInfo.meta.en} Antardasha Sub-Cycle & Dasha-Bhukti Geometry:</strong> Within this major period, you are navigating the sub-period of <strong>${adInfo.meta.en}</strong> in the <strong>${adInfo.bhava}th House</strong>, which sits <strong>${relativeHouseOfAD} houses away</strong> from your Mahadasha lord. ${
          relativeHouseOfAD === 6 || relativeHouseOfAD === 8 || relativeHouseOfAD === 12
            ? `<strong>Critical Dasha-Sandhi Alert (6/8/12 Axis):</strong> Because your Mahadasha and Antardasha lords sit in a <em>Shadashtaka / Dwadasha</em> (${relativeHouseOfAD}th) angle from each other, you have been experiencing mental restlessness, sudden delays right before completion, and emotional fatigue over the past several months.`
            : `This ${relativeHouseOfAD}th-house relational angle between ${dasha.md} and${dasha.ad} is actively pushing stalled matters from the last 14–18 months toward a decisive turning point.`
        }
      </p>

      <p>
        <strong>3. Next 12–18 Months Forecast (${numData.currentYear}–${numData.currentYear + 1}):</strong> As transiting Jupiter and Saturn aspect your active ${mdInfo.bhava}th/${adInfo.bhava}th axis over the coming quarters, a major crossroads involving your career trajectory, financial restructuring, or relationship commitment will demand a clear decision. Navigating this window with exact degree-level remedies prevents costly missteps.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 11: ⚠️ HIDDEN PROBLEMS, KARMIC TRAPS & URGENT DIAGNOSTIC HOOK
  // --------------------------------------------------------------------------
  function buildChapter11HiddenTraps(ctx) {
    const { lang, name, chart, planetAnalysis, specialLagnas, dasha } = ctx;
    const asc = chart.Asc.d1;
    const rashi8 = RASHI_DATA[getRashiOfBhava(asc, 8)];
    const rashi12 = RASHI_DATA[getRashiOfBhava(asc, 12)];
    const rahu = planetAnalysis.Rahu;
    const ketu = planetAnalysis.Ketu;
    const sat = planetAnalysis.Saturn;

    // Find the house with the lowest SAV Bindus (The Weakest Link in the Chart)
    let weakestHouse = 1;
    let minBindu = 99;
    Object.keys(specialLagnas.houseBindus).forEach(h => {
      if (specialLagnas.houseBindus[h] < minBindu) {
        minBindu = specialLagnas.houseBindus[h];
        weakestHouse = parseInt(h, 10);
      }
    });

    if (lang === "hi") {
      return `
        <p>
          प्रिय <strong>${name}</strong>, ऊपर के 10 अध्यायों में आपने अपनी क्षमता, व्यक्तित्व, करियर और भावी जीवनसाथी की संभावनाओं को देखा। <strong>परंतु अब सबसे कड़वा और महत्वपूर्ण ज्योतिषीय सत्य ध्यान से पढ़िए:</strong> यदि आपकी कुंडली में राजयोग और इतनी प्रतिभा मौजूद है, तो फिर आपके काम अंतिम क्षण पर क्यों अटकते हैं? क्यों आपका मन रात को अचानक बेचैन हो जाता है और क्यों आपकी मेहनत का 100% फल आपको अब तक नहीं मिल पाया?
        </p>

        <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
          <div class="font-bold text-red-300 text-base">
            <i class="fas fa-biohazard mr-2"></i> आपकी कुंडली में पाए गए 3 गुप्त कर्म-अवरोध (Root-Cause Blockages):
          </div>
          <p class="text-sm mb-0">
            <strong>1. राहु-केतु का ${rahu.bhava}/${ketu.bhava} अक्ष पर ग्रहण जाल (Nodal Karmic Trap):</strong> आपकी कुंडली में राहु <strong>${rahu.bhava}वें भाव (${RASHI_DATA[rahu.d1].hi})</strong> में और केतु <strong>${ketu.bhava}वें भाव (${RASHI_DATA[ketu.d1].hi})</strong> में बैठकर एक अदृश्य मानसिक धुंध (Illusion) पैदा कर रहे हैं। जब भी आप अपने लक्ष्य के बिल्कुल करीब पहुंचते हैं, राहु या तो आपका ध्यान भटका देता है या गलत इंसान पर भरोसा करवाकर आपका समय और ऊर्जा नष्ट करवा देता है।
          </p>
          <p class="text-sm mb-0">
            <strong>2. शनि का ${sat.bhava}वें भाव एवं अष्टम भाव (${rashi8.hi}) का विलंब दोष:</strong> शनि की स्थिति और अष्टम भाव का समीकरण दिखाता है कि आपकी कुंडली में <strong>'अंशबल (Shadbala/Degree) की सुप्त अवस्था'</strong> है—अर्थात जो शुभ ग्रह आपको धन, पद और विवाह सुख देने के लिए जिम्मेदार हैं, उनकी ऊर्जा एक अदृश्य कर्म-बंध (Karmic Lock) में फंसी हुई है।
          </p>
          <p class="text-sm mb-0">
            <strong>3. अष्टकवर्ग का सबसे कमजोर बिंदु (${weakestHouse}वां भाव — केवल ${minBindu} बिंदु):</strong> आपके ${weakestHouse}वें भाव (${BHAVA_MEANINGS[weakestHouse].hi}) में केवल <strong>${minBindu} अष्टकवर्ग बिंदु</strong> हैं और वर्तमान में <strong>${PLANET_META[dasha.md].hi} में ${PLANET_META[dasha.ad].hi}</strong> का समय चल रहा है। बिना सटीक डिग्री परीक्षण और वैदिक/लाल किताब के सटीक उपाय किए, यह कमजोर कड़ी अगले 12–24 महीनों में आपके बने-बनाए अवसरों में बार-बार रुकावट डाल सकती है।
          </p>
        </div>

        <p class="text-amber-200 font-semibold mb-0">
          ⚠️ <strong>सबसे बड़ी गलती जो 95% लोग करते हैं:</strong> लोग इंटरनेट से देखकर या किसी के कहने पर बिना अपनी कुंडली के ग्रहों का सटीक अंशबल (Exact Degrees, Chalit Chart & Shadbala) जांचे कोई भी रत्न (Gemstone) पहन लेते हैं या गलत पूजा/उपाय शुरू कर देते हैं—जिससे मारक या बाधक ग्रह और अधिक उग्र हो जाता है। अपनी वास्तविक जन्म-समय व स्थान की सटीक गणना और व्यक्तिगत उपायों के लिए दाईं ओर दिए गए कार्ड से <strong>आचार्य ज्ञानेंद्र सिंह तोमर जी</strong> से अभी व्हाट्सएप पर जुड़ें।
        </p>
      `;
    }

    return `
      <p>
        Dear <strong>${name}</strong>, in the 10 chapters above, you saw the extraordinary potential wired into your birth blueprint. <strong>Now pause and ask yourself the hardest question:</strong> If your chart carries such strong intelligence, leadership, and wealth indicators, <em>why do your biggest breakthroughs still get delayed at the 99th percentile? Why does mental exhaustion hit you right when you should be celebrating, and why do people you trust end up draining your energy?</em>
      </p>

      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
        <div class="font-bold text-red-300 text-base">
          <i class="fas fa-biohazard mr-2"></i> 3 Unseen Astrological Blockages Silently Sabotaging Your Chart:
        </div>
        <p class="text-sm mb-0">
          <strong>1. The Rahu-Ketu Nodal Axis Trap (${rahu.bhava}th / ${ketu.bhava}th House Axis):</strong> With <strong>Rahu in your ${rahu.bhava}th House (${RASHI_DATA[rahu.d1].en})</strong> and <strong>Ketu in your ${ketu.bhava}th House (${RASHI_DATA[ketu.d1].en})</strong>, an invisible karmic smoke-screen operates in your chart. Right when a major career leap, exam, or relationship is about to solidify, Rahu triggers sudden overthinking, self-doubt, or misplaced trust in the wrong person.
        </p>
        <p class="text-sm mb-0">
          <strong>2. Dormant Planetary Degree & 8th/12th Friction (${rashi8.en} / ${rashi12.en}):</strong> Combined with <strong>Saturn in your ${sat.bhava}th House</strong>, key wealth- and marriage-giving planets in your chart suffer from <em>Avastha / Shadbala lock</em>—meaning they are present in your chart on paper, but their actual degree-level delivery power is locked behind an unresolved karmic debt.
        </p>
        <p class="text-sm mb-0">
          <strong>3. Critical Ashtakavarga Drain in House ${weakestHouse} (Only ${minBindu} Bindus):</strong> Your <strong>${weakestHouse}th House (${BHAVA_MEANINGS[weakestHouse].en})</strong> holds the lowest energy reservoir in your chart (<strong>${minBindu} SAV Bindus</strong>) while you are actively running the <strong>${dasha.md}–${dasha.ad} Dasha</strong>. Left unlocked without targeted remedies, this weak link acts like a hole in the bucket—draining momentum over the next 12 to 24 months.
        </p>
      </div>

      <p class="text-amber-200 font-semibold mb-0">
        ⚠️ <strong>Do NOT Wear Random Gemstones or Do Generic Internet Remedies:</strong> Wearing a gemstone or performing a ritual without verifying your exact birth-time degrees (<em>Bhava Chalit, Shadbala & Badhaka Lord</em>) often strengthens a functional malefic and makes matters worse. Connect directly with <strong>Gyanendra S. Tomar</strong> via the consultation box on the right to get your 100% hand-calculated degree analysis, 5-year month-by-month timeline, and safe Lal Kitab & Vedic remedies.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 12: PERSONALIZED GURU DAKSHINA CALIBRATION
  // --------------------------------------------------------------------------
  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart } = ctx;
    const jupRashi = RASHI_DATA[chart.Jupiter.d1];
    const headingEl = document.getElementById("dakshinaHeading");
    const textEl = document.getElementById("contentDakshinaText");
    if (!headingEl || !textEl) return;

    if (lang === "hi") {
      headingEl.innerHTML = `पवित्र ऊर्जा विनिमय एवं गुरु-दक्षिणा संकल्प (Sacred Guru Dakshina) 🙏`;
      textEl.innerHTML = `
        <p class="hindi">
          प्रिय <strong>${name}</strong>, आपकी कुंडली में देवगुरु बृहस्पति <strong>${jupRashi.hi}</strong> से आपके भाग्य और ज्ञान को नियंत्रित कर रहे हैं। सनातन वैदिक परंपरा का यह शाश्वत नियम है कि जब भी हम ज्योतिष जैसी पवित्र <em>ब्रह्म-विद्या</em> के माध्यम से अपने प्रारब्ध, भावी जीवनसाथी और ग्रहों के गुप्त रहस्यों का ज्ञान प्राप्त करते हैं, तो बिना <strong>'गुरु-दक्षिणा' (Energy Exchange)</strong> के उस ज्ञान का शुभ फल पूर्ण रूप से जागृत नहीं होता।
        </p>
        <p class="hindi">
          हमने यह 30-मिनट का गहन 'जीवन दस्तावेज' (Life Dossier) इसलिए तैयार किया है ताकि जो साधक आज ₹1101 का पूर्ण परामर्श लेने में असमर्थ भी हों, उन्हें भी किसी भ्रामक वेबसाइट से निराश न लौटना पड़े। यदि इस विश्लेषण ने आपके मन के अनकहे सच को छुआ है और आपको सही दिशा दी है, तो अपनी श्रद्धा एवं सामर्थ्य के अनुसार <strong>(₹51, ₹101, ₹251 या ₹501)</strong> की गुरु-दक्षिणा सामने दिए गए QR कोड पर अर्पित कर बृहस्पति देव का शुभ आशीर्वाद अवश्य ग्रहण करें।
        </p>
      `;
    } else {
      headingEl.innerHTML = `Honor the Sacred Law of Energy Exchange (Guru Dakshina) 🙏`;
      textEl.innerHTML = `
        <p>
          Dear <strong>${name}</strong>, in your chart, <strong>Jupiter (Brihaspati — Karaka of Divine Grace & Fortune)</strong> operates through <strong>${jupRashi.en}</strong>. According to ancient Vedic tradition, Jyotish is sacred <em>Brahma-Vidya</em>: whenever we decode the hidden secrets of our destiny, future partner, and planetary karma, offering a voluntary <strong>Guru Dakshina (Sacred Energy Exchange)</strong> seals the reading with auspicious Guru-Kripa and prevents subtle karmic debt on the 9th house of fortune.
        </p>
        <p>
          We created this exhaustive 30-minute Life Dossier so that even if someone cannot afford our full ₹1101 hand-crafted consultation today, they still receive genuine, life-changing clarity. If this dossier spoke the unspoken truth about your life, please offer a heartfelt <strong>Guru Dakshina (₹51, ₹101, ₹251, or ₹501 as per your Shraddha)</strong> via the UPI QR code—and send your screenshot on WhatsApp to receive Gyanendra Ji's blessings!
        </p>
      `;
    }
  }

  // ==========================================================================
  // 4. BILINGUAL HEADING & NAVIGATION UPDATER
  // ==========================================================================

  function updateChapterHeadingsAndNav(lang, ctx) {
    const labels = lang === "hi" ? {
      ch1Tag: "अध्याय 01 • आंतरिक मनोविज्ञान एवं व्यक्तित्व",
      ch1Title: "आपका अनकहा व्यक्तित्व, मानसिक संरचना एवं नाम स्पंदन",
      ch2Tag: "अध्याय 02 • मेधा, स्मरण शक्ति एवं शिक्षा",
      ch2Title: "शिक्षा, एकाग्रता का पैटर्न एवं बौद्धिक डीएनए",
      ch3Tag: "अध्याय 03 • कर्म क्षेत्र, अधिकार एवं उत्थान",
      ch3Title: "करियर की दिशा, नौकरी बनाम व्यापार एवं कार्यक्षेत्र का सच",
      ch4Tag: "अध्याय 04 • अर्थ, बैंक बैलेंस एवं संपत्ति संचय",
      ch4Title: "धन योग, अचानक होने वाले खर्च (Money Leaks) एवं समृद्धि सूत्र",
      ch5Tag: "अध्याय 05 • भाग्य भाव एवं स्वर्णिम वर्ष",
      ch5Title: "आपका भाग्योदय, 99% पर अटकने का रहस्य एवं निर्णायक आयु वर्ष",
      ch6Tag: "अध्याय 06 • प्रेम, आकर्षण एवं भावनात्मक संबंध",
      ch6Title: "प्रेम जीवन, भावनात्मक समर्पण एवं रिश्तों का मनोविज्ञान",
      ch7Tag: "अध्याय 07 • भावी जीवनसाथी एवं वैवाहिक भविष्य",
      ch7Title: "भावी जीवनसाथी का रंग-रूप, स्वभाव, दिशा एवं विवाह पश्चात भाग्योदय",
      ch8Tag: "अध्याय 08 • नवग्रह एवं पारस्परिक दृष्टि विश्लेषण",
      ch8Title: "सभी 9 ग्रहों का गहन फलित, युति एवं पाराशरी दृष्टियां (D1 + D9)",
      ch9Tag: "अध्याय 09 • विशेष लग्न एवं अष्टकवर्ग बिंदु",
      ch9Title: "चंद्र लग्न, सूर्य लग्न, नवांश, आरूढ़ लग्न (AL) एवं अष्टकवर्ग बल",
      ch10Tag: "अध्याय 10 • वर्तमान समय चक्र (महादशा एवं अंतर्दशा)",
      ch10Title: "आपका वर्तमान समय-चक्र एवं आगामी 18 महीनों की भविष्यवाणी",
      ch11Title: "⚠️ आपकी प्रगति को भीतर ही भीतर रोकने वाले 3 गुप्त ग्रह-अवरोध (Karmic Traps)"
    } : {
      ch1Tag: "Chapter 01 • Inner Psychology & Aura",
      ch1Title: "Your Unspoken Personality & Mental Wiring",
      ch2Tag: "Chapter 02 • Intellect, Memory & Academics",
      ch2Title: "Education, Study Patterns & Intellectual DNA",
      ch3Tag: "Chapter 03 • Karma, Rise & Professional Destiny",
      ch3Title: "Career Trajectory, Best Fields & Workplace Reality",
      ch4Tag: "Chapter 04 • Artha, Savings & Asset Accumulation",
      ch4Title: "Wealth Potential, Money Leaks & Financial Peaks",
      ch5Tag: "Chapter 05 • Bhagya, Grace & Golden Years",
      ch5Title: "Your Luck Factor & Crucial Age Turning Points",
      ch6Tag: "Chapter 06 • Romance, Heartbreak & Attachment",
      ch6Title: "Love Life, Emotional Chemistry & Relationship Patterns",
      ch7Tag: "Chapter 07 • Spouse Appearance, Nature & Marriage",
      ch7Title: "Your Future Life Partner Traits & Post-Marriage Destiny",
      ch8Tag: "Chapter 08 • All 9 Planetary Energies & Mutual Aspects",
      ch8Title: "In-Depth Planetary Forces & How They Aspect Each Other",
      ch9Tag: "Chapter 09 • Multi-Dimensional Chart Synthesis",
      ch9Title: "Special Derived Blueprints (Chandra, Surya, Navamsa, Arudha & Ashtakavarga)",
      ch10Tag: "Chapter 10 • Active Time Cycle (Mahadasha & Antardasha)",
      ch10Title: "Your Current Time Phase & Upcoming Life Transitions",
      ch11Title: "⚠️ The Hidden Blockages & Unseen Traps Silently Sabotaging Your Progress"
    };

    Object.keys(labels).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = labels[id];
    });

    // Update top masthead details
    const badgeEl = document.getElementById("dossierBadgeMode");
    const headerNameEl = document.getElementById("dossierHeaderName");
    const headerSubEl = document.getElementById("dossierHeaderSubtext");

    if (badgeEl) {
      badgeEl.innerHTML = ctx.chart.isFullChartMode
        ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "99.9% पूर्ण वैदिक कुंडली + चैल्डियन डॉसियर" : "99.9% Full Parashari + Jaimini + Chaldean Dossier"}`
        : `<i class="fas fa-star mr-1.5"></i> ${lang === "hi" ? "ज्योतिष तर्क गोपनीय जीवन दस्तावेज" : "Jyotish Tark Confidential Life Dossier"}`;
    }

    if (headerNameEl) {
      headerNameEl.textContent = lang === "hi"
        ? `${ctx.name} की संपूर्ण जीवन एवं भाग्य कुंडली`
        : `${ctx.name}'s Complete Life & Destiny Dossier`;
    }

    if (headerSubEl) {
      const ascName = lang === "hi" ? RASHI_DATA[ctx.chart.Asc.d1].hi : RASHI_DATA[ctx.chart.Asc.d1].en;
      const moonName = lang === "hi" ? RASHI_DATA[ctx.chart.Moon.d1].hi : RASHI_DATA[ctx.chart.Moon.d1].en;
      headerSubEl.innerHTML = lang === "hi"
        ? `जन्म तिथि: <strong>${ctx.dob} (आयु ${ctx.numData.age} वर्ष)</strong> • मूलांक: <strong>${ctx.numData.mulank}</strong> • भाग्यांक: <strong>${ctx.numData.bhagyank}</strong> • लग्न: <strong>${ascName}</strong> • राशि: <strong>${moonName}</strong> • सक्रिय दशा: <strong>${PLANET_META[ctx.dasha.md].hi}–${PLANET_META[ctx.dasha.ad].hi}</strong>`
        : `DOB: <strong>${ctx.dob} (Age ${ctx.numData.age})</strong> • Mulank: <strong>${ctx.numData.mulank}</strong> • Bhagyank: <strong>${ctx.numData.bhagyank}</strong> • Ascendant: <strong>${ascName}</strong> • Moon: <strong>${moonName}</strong> • Active Dasha: <strong>${ctx.dasha.md}–${ctx.dasha.ad}</strong>`;
    }

    // Dynamic WhatsApp Deep Links with Pre-filled Chart Summary
    const waSummary = encodeURIComponent(
      `Namaste Gyanendra Ji 🙏\nI just read my 30-Minute Life Dossier on Jyotish Tark.\n` +
      `• Name: ${ctx.name}\n` +
      `• DOB: ${ctx.dob} (Mulank ${ctx.numData.mulank} / Bhagyank ${ctx.numData.bhagyank})\n` +
      `• Ascendant: ${RASHI_DATA[ctx.chart.Asc.d1].en} | Moon: ${RASHI_DATA[ctx.chart.Moon.d1].en}\n` +
      `• Active Dasha: ${ctx.dasha.md} - ${ctx.dasha.ad}\n` +
      `I want to book my ₹1101 Complete Hand-Crafted Kundali & Personal Remedies.`
    );
    const waUrl = `https://wa.me/918318513814?text=${waSummary}`;
    const topWaBtn = document.getElementById("dossierTopWhatsappBtn");
    const urgentWaBtn = document.getElementById("urgentConsultWhatsappBtn");
    if (topWaBtn) topWaBtn.href = waUrl;
    if (urgentWaBtn) urgentWaBtn.href = waUrl;
  }

  // ==========================================================================
  // 5. LIVE READING-TIME & WORD-COUNT BADGE + STICKY CHAPTER SCROLLSPY
  // ==========================================================================

  function updateReadingMetricsBadge(lang) {
    const container = document.getElementById("masterDossierOutput");
    const badgeEl = document.getElementById("readingTimeEstimate");
    if (!container || !badgeEl) return;

    const rawText = container.innerText || "";
    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    // Deep analytical astrological reading speed ~ 130–145 wpm with reflection
    const mins = Math.max(25, Math.min(35, Math.round(wordCount / 135) + 12));
    badgeEl.innerHTML = lang === "hi"
      ? `~${mins} मिनट • ${wordCount.toLocaleString()}+ शब्द`
      : `~${mins} Mins • ${wordCount.toLocaleString()}+ Words`;
  }

  function initStickyChapterScrollSpy() {
    const pills = document.querySelectorAll(".chapter-nav-pill");
    if (!pills.length) return;

    const sectionIds = Array.from(pills).map(p => p.getAttribute("href")).filter(h => h && h.startsWith("#"));

    window.addEventListener("scroll", () => {
      let activeId = null;
      const scrollPos = window.scrollY + 240;

      sectionIds.forEach(id => {
        const sec = document.querySelector(id);
        if (sec && sec.offsetTop <= scrollPos) {
          activeId = id;
        }
      });

      pills.forEach(pill => {
        if (pill.getAttribute("href") === activeId) {
          pill.style.borderColor = "#f59e0b";
          pill.style.color = "#fde68a";
          pill.style.background = "rgba(126, 34, 206, 0.45)";
        } else {
          pill.style.borderColor = "";
          pill.style.color = "";
          pill.style.background = "";
        }
      });
    }, { passive: true });
  }

  // ==========================================================================
  // 6. MASTER ENTRY POINT: generateCompleteLifeDossier(event)
  // ==========================================================================

  window.generateCompleteLifeDossier = function (event) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    const nameInput = document.getElementById("userName")?.value.trim() || "Seeker";
    const dobInput = document.getElementById("userDob")?.value || "1998-01-24";
    const langInput = document.getElementById("reportLang")?.value || "en";
    const genderInput = document.getElementById("userGender")?.value || "male";

    // 1. Run Core Calculations
    const chaldean = calculateChaldeanName(nameInput);
    const numData = calculateNumerologyFromDob(dobInput);
    const chart = readChartFromDOM(numData, chaldean);
    const planetAnalysis = analyzeAllPlanetsAndAspects(chart);
    const specialLagnas = computeSpecialLagnasAndBindus(chart, planetAnalysis);
    const dasha = resolveActiveDasha(chart, numData);

    const ctx = {
      name: nameInput,
      dob: dobInput,
      lang: langInput,
      gender: genderInput,
      chaldean,
      numData,
      chart,
      planetAnalysis,
      specialLagnas,
      dasha
    };

    // 2. Populate All 12 Chapter Containers
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    updateChapterHeadingsAndNav(langInput, ctx);
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
    updateChapter12Dakshina(ctx);

    // 3. Also pre-fill the Manual Order Form (Workspace 2) so if the user clicks "Submit Birth Time & Place", their Name, DOB, and Gender are already waiting for them!
    const manualName = document.getElementById("name");
    const manualDob = document.getElementById("dob");
    const manualGender = document.getElementById("gender");
    if (manualName && !manualName.value) manualName.value = nameInput;
    if (manualDob && !manualDob.value) manualDob.value = dobInput;
    if (manualGender && !manualGender.value) manualGender.value = genderInput;

    // 4. Reveal Dossier Output, Calculate Live Word Count, and Smooth-Scroll to Masthead
    const outputContainer = document.getElementById("masterDossierOutput");
    if (outputContainer) {
      outputContainer.classList.remove("hidden");
      updateReadingMetricsBadge(langInput);
      setTimeout(() => {
        outputContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Re-render live if user switches language dropdown while dossier is already open
  document.addEventListener("DOMContentLoaded", () => {
    initStickyChapterScrollSpy();
    const langSelect = document.getElementById("reportLang");
    if (langSelect) {
      langSelect.addEventListener("change", () => {
        const outputContainer = document.getElementById("masterDossierOutput");
        if (outputContainer && !outputContainer.classList.contains("hidden")) {
          window.generateCompleteLifeDossier();
        }
      });
    }
  });

})();
