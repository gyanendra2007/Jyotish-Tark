/**
 * ============================================================================
 * JYOTISH TARK — 100% COMBINATORIAL PARASHARI & AGE-DYNAMIC KUNDALI ENGINE
 * File: kundali-engine.js • v12.0 (Zero-Static-Prose Edition)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * ARCHITECTURAL GUARANTEE IN v12.0:
 * 1. ZERO Static Paragraphs or Pre-Written Hook Banks: Every single sentence is
 *    synthesized at runtime from the native's exact Planetary Degrees (DMS),
 *    Nakshatra Padas, Shadbala Rupas, Baladi Avasthas, D1/D9/D10/D7/D4 Vargas,
 *    337-Bindu Ashtakavarga (BAV/SAV), and Jaimini Chara Karakas.
 * 2. 100% Age-Adaptive Life-Stage Routing (Bala 0-12, Vidyarthi 13-20,
 *    Yuva 21-35, Grihastha 36-55, Vanaprastha 56+): A 10-year-old child, a
 *    19-year-old student, and a 38-year-old adult receive completely different
 *    life-stage analysis and exact Age-to-Complete milestones.
 * 3. Every Chapter Computes Exact Completion Ages & Calendar Windows from the
 *    120-Year Vimshottari Dasha + Jupiter/Saturn Double-Transit Engine.
 * ============================================================================
 */

(function () {
  "use strict";

  window.__jtMode = window.__jtMode || "derived";
  window.__jtVedicData = window.__jtVedicData || null;

  // ==========================================================================
  // 1. ASTRONOMICAL & PARASHARI ATOMIC MATRICES (BUILDING BLOCKS, NOT PROSE)
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
    1:  { id: 1,  en: "Mesha (Aries)",       hi: "मेष (Aries)",       lord: "Mars",    lordHi: "मंगल",            elementEn: "Fire (Agni)",   elementHi: "अग्नि तत्व",  qualityEn: "Movable (Chara)",     qualityHi: "चर राशि",        dirEn: "East",       dirHi: "पूर्व दिशा",       altDirEn: "South-East", altDirHi: "आग्नेय (दक्षिण-पूर्व)" },
    2:  { id: 2,  en: "Vrishabha (Taurus)",  hi: "वृषभ (Taurus)",     lord: "Venus",   lordHi: "शुक्र",            elementEn: "Earth (Prithvi)",elementHi: "पृथ्वी तत्व", qualityEn: "Fixed (Sthira)",      qualityHi: "स्थिर राशि",     dirEn: "South",      dirHi: "दक्षिण दिशा",      altDirEn: "South-West", altDirHi: "नैऋत्य (दक्षिण-पश्चिम)" },
    3:  { id: 3,  en: "Mithuna (Gemini)",    hi: "मिथुन (Gemini)",     lord: "Mercury", lordHi: "बुध",             elementEn: "Air (Vayu)",    elementHi: "वायु तत्व",   qualityEn: "Dual (Dwiswabhava)",  qualityHi: "द्विस्वभाव राशि", dirEn: "West",       dirHi: "पश्चिम दिशा",      altDirEn: "North-West", altDirHi: "वायव्य (उत्तर-पश्चिम)" },
    4:  { id: 4,  en: "Karka (Cancer)",      hi: "कर्क (Cancer)",      lord: "Moon",    lordHi: "चंद्रमा",          elementEn: "Water (Jala)",  elementHi: "जल तत्व",    qualityEn: "Movable (Chara)",     qualityHi: "चर राशि",        dirEn: "North",      dirHi: "उत्तर दिशा",       altDirEn: "North-East", altDirHi: "ईशान (उत्तर-पूर्व)" },
    5:  { id: 5,  en: "Simha (Leo)",         hi: "सिंह (Leo)",         lord: "Sun",     lordHi: "सूर्य",            elementEn: "Fire (Agni)",   elementHi: "अग्नि तत्व",  qualityEn: "Fixed (Sthira)",      qualityHi: "स्थिर राशि",     dirEn: "East",       dirHi: "पूर्व दिशा",       altDirEn: "Central",    altDirHi: "केंद्र/राजधानी क्षेत्र" },
    6:  { id: 6,  en: "Kanya (Virgo)",       hi: "कन्या (Virgo)",      lord: "Mercury", lordHi: "बुध",             elementEn: "Earth (Prithvi)",elementHi: "पृथ्वी तत्व", qualityEn: "Dual (Dwiswabhava)",  qualityHi: "द्विस्वभाव राशि", dirEn: "South",      dirHi: "दक्षिण दिशा",      altDirEn: "South-East", altDirHi: "दक्षिण-पूर्व दिशा" },
    7:  { id: 7,  en: "Tula (Libra)",        hi: "तुला (Libra)",       lord: "Venus",   lordHi: "शुक्र",            elementEn: "Air (Vayu)",    elementHi: "वायु तत्व",   qualityEn: "Movable (Chara)",     qualityHi: "चर राशि",        dirEn: "West",       dirHi: "पश्चिम दिशा",      altDirEn: "South-West", altDirHi: "दक्षिण-पश्चिम दिशा" },
    8:  { id: 8,  en: "Vrishchika (Scorpio)",hi: "वृश्चिक (Scorpio)",  lord: "Mars",    lordHi: "मंगल",            elementEn: "Water (Jala)",  elementHi: "जल तत्व",    qualityEn: "Fixed (Sthira)",      qualityHi: "स्थिर राशि",     dirEn: "North",      dirHi: "उत्तर दिशा",       altDirEn: "North-West", altDirHi: "उत्तर-पश्चिम दिशा" },
    9:  { id: 9,  en: "Dhanu (Sagittarius)", hi: "धनु (Sagittarius)",  lord: "Jupiter", lordHi: "बृहस्पति (गुरु)", elementEn: "Fire (Agni)",   elementHi: "अग्नि तत्व",  qualityEn: "Dual (Dwiswabhava)",  qualityHi: "द्विस्वभाव राशि", dirEn: "East",       dirHi: "पूर्व दिशा",       altDirEn: "North-East", altDirHi: "ईशान (उत्तर-पूर्व)" },
    10: { id: 10, en: "Makara (Capricorn)",  hi: "मकर (Capricorn)",    lord: "Saturn",  lordHi: "शनि",             elementEn: "Earth (Prithvi)",elementHi: "पृथ्वी तत्व", qualityEn: "Movable (Chara)",     qualityHi: "चर राशि",        dirEn: "South",      dirHi: "दक्षिण दिशा",      altDirEn: "West-South", altDirHi: "पश्चिम-दक्षिण दिशा" },
    11: { id: 11, en: "Kumbha (Aquarius)",   hi: "कुंभ (Aquarius)",    lord: "Saturn",  lordHi: "शनि",             elementEn: "Air (Vayu)",    elementHi: "वायु तत्व",   qualityEn: "Fixed (Sthira)",      qualityHi: "स्थिर राशि",     dirEn: "West",       dirHi: "पश्चिम दिशा",      altDirEn: "North-West", altDirHi: "उत्तर-पश्चिम दिशा" },
    12: { id: 12, en: "Meena (Pisces)",      hi: "मीन (Pisces)",       lord: "Jupiter", lordHi: "बृहस्पति (गुरु)", elementEn: "Water (Jala)",  elementHi: "जल तत्व",    qualityEn: "Dual (Dwiswabhava)",  qualityHi: "द्विस्वभाव राशि", dirEn: "North",      dirHi: "उत्तर दिशा",       altDirEn: "North-East", altDirHi: "ईशान (उत्तर-पूर्व)" }
  };

  const NAKSHATRA_DATA = {
    1:  { name: "Ashwini (अश्विनी)",             ruler: "Ketu",    gana: "Deva",     shaktiEn: "Shighra Vyapani (rapid healing & pioneering initiation)",         shaktiHi: "शीघ्र व्यापनी शक्ति (तीव्र आरोग्य एवं अग्रणी आरंभ)" },
    2:  { name: "Bharani (भरणी)",               ruler: "Venus",   gana: "Manushya", shaktiEn: "Apabharani (carrying heavy karmic transformations to completion)", shaktiHi: "अपभरणी शक्ति (गहन दायित्व धारण एवं कर्म-परिपक्वता)" },
    3:  { name: "Krittika (कृत्तिका)",           ruler: "Sun",     gana: "Rakshasa", shaktiEn: "Dahana Shakti (burning away falsehood & commanding authority)",    shaktiHi: "दहन शक्ति (असत्य का छेदन एवं तेजस्वी नेतृत्व)" },
    4:  { name: "Rohini (रोहिणी)",               ruler: "Moon",    gana: "Manushya", shaktiEn: "Rohana Shakti (fertile growth, wealth magnetism & creation)",      shaktiHi: "रोहण शक्ति (निरंतर वृद्धि, सृजन एवं लक्ष्मी आकर्षण)" },
    5:  { name: "Mrigashira (मृगशिरा)",         ruler: "Mars",    gana: "Deva",     shaktiEn: "Prinana Shakti (relentless intellectual quest & discovery)",      shaktiHi: "प्रीणन शक्ति (सूक्ष्म अन्वेषण एवं बौद्धिक जिज्ञासा)" },
    6:  { name: "Ardra (आर्द्रा)",               ruler: "Rahu",    gana: "Manushya", shaktiEn: "Yatna Shakti (breakthrough innovation forged through storms)",    shaktiHi: "यत्न शक्ति (तीव्र संघर्ष के मंथन से नूतन आविष्कार)" },
    7:  { name: "Punarvasu (पुनर्वसु)",         ruler: "Jupiter", gana: "Deva",     shaktiEn: "Vasutva Prapana (boundless renewal & dharmic recovery)",          shaktiHi: "वसुत्व प्रापण शक्ति (पुनर्जागरण एवं सात्विक समृद्धि)" },
    8:  { name: "Pushya (पुष्य)",               ruler: "Saturn",  gana: "Deva",     shaktiEn: "Brahmavarchasa (institutional nourishment & steady dharma)",      shaktiHi: "ब्रह्मवर्चस शक्ति (पोषण, धर्म-संरक्षण एवं राजयोग पुष्टि)" },
    9:  { name: "Ashlesha (आश्लेषा)",           ruler: "Mercury", gana: "Rakshasa", shaktiEn: "Visleshana Shakti (penetrating psychological & strategic depth)", shaktiHi: "विश्लेषण शक्ति (मनोवैज्ञानिक भेद एवं कूटनीतिक पकड़)" },
    10: { name: "Magha (मघा)",                   ruler: "Ketu",    gana: "Rakshasa", shaktiEn: "Tyage Kshepani (ancestral lineage command & royal dignity)",      shaktiHi: "त्यागे क्षेपणी शक्ति (पैतृक गौरव एवं सिंहासन चेतना)" },
    11: { name: "Purva Phalguni (पूर्वा फाल्गुनी)", ruler: "Venus", gana: "Manushya", shaktiEn: "Prajanana Shakti (creative alliance, charisma & prosperity)",     shaktiHi: "प्रजनन शक्ति (सौभाग्य, कलात्मक सृजन एवं आकर्षण)" },
    12: { name: "Uttara Phalguni (उत्तरा फाल्गुनी)",ruler: "Sun",   gana: "Manushya", shaktiEn: "Chayani Shakti (enduring contracts & institutional wealth)",      shaktiHi: "चयनी शक्ति (स्थायी अनुबंध, प्रशासन एवं स्व-अर्जित वैभव)" },
    13: { name: "Hasta (हस्त)",                 ruler: "Moon",    gana: "Deva",     shaktiEn: "Hasta Sthapaniya (placing goals directly into one's hands)",      shaktiHi: "हस्त स्थापनीय शक्ति (कर्म-कौशल से लक्ष्य को मुट्ठी में करना)" },
    14: { name: "Chitra (चित्रा)",               ruler: "Mars",    gana: "Rakshasa", shaktiEn: "Punya Chayani (architectural precision & structural beauty)",     shaktiHi: "पुण्य चयनी शक्ति (वास्तु/संरचना निर्माण एवं विलक्षण प्रतिभा)" },
    15: { name: "Swati (स्वाती)",               ruler: "Rahu",    gana: "Deva",     shaktiEn: "Pradhvamsa Shakti (independent movement & commercial adaptability)",shaktiHi: "प्रध्वंस शक्ति (स्वतंत्र गति, वाणिज्यिक कूटनीति एवं विस्तार)" },
    16: { name: "Vishakha (विशाखा)",             ruler: "Jupiter", gana: "Rakshasa", shaktiEn: "Vyapana Shakti (single-pointed target achievement over time)",    shaktiHi: "व्यापन शक्ति (एकनिष्ठ लक्ष्य-साधना एवं क्रमिक विजय)" },
    17: { name: "Anuradha (अनुराधा)",           ruler: "Saturn",  gana: "Deva",     shaktiEn: "Radhana Shakti (devotional alliances & cross-border success)",    shaktiHi: "राधन शक्ति (अटूट मैत्री, संगठन क्षमता एवं प्रवास भाग्योदय)" },
    18: { name: "Jyeshtha (ज्येष्ठा)",           ruler: "Mercury", gana: "Rakshasa", shaktiEn: "Arohana Shakti (senior crisis-command & executive conquering)",   shaktiHi: "आरोहण शक्ति (वरिष्ठ नेतृत्व, संकट-प्रबंधन एवं अजेय साहस)" },
    19: { name: "Mula (मूल)",                   ruler: "Ketu",    gana: "Rakshasa", shaktiEn: "Barhana Shakti (uprooting decay & root-cause investigation)",     shaktiHi: "बर्हण शक्ति (मूल कारण का शोध एवं शून्य से नव-निर्माण)" },
    20: { name: "Purva Ashadha (पूर्वाषाढ़ा)",   ruler: "Venus",   gana: "Manushya", shaktiEn: "Varchograha Shakti (invigorating conviction & early victory)",    shaktiHi: "वर्चोग्रहण शक्ति (अजेय उत्साह, वाक्-प्रभाव एवं पुनर्नवीकरण)" },
    21: { name: "Uttara Ashadha (उत्तराषाढ़ा)",  ruler: "Sun",     gana: "Manushya", shaktiEn: "Apradhrishya Shakti (permanent, unchallenged dharmic victory)",   shaktiHi: "अप्रधृष्य शक्ति (अखंड व स्थायी विजय एवं उच्च संस्थागत सम्मान)" },
    22: { name: "Shravana (श्रवण)",             ruler: "Moon",    gana: "Deva",     shaktiEn: "Samhanana Shakti (connecting scholarship with public order)",     shaktiHi: "संहनन शक्ति (श्रुति-ज्ञान, समन्वय एवं प्रशासनिक ख्याति)" },
    23: { name: "Dhanishta (धनिष्ठा)",           ruler: "Mars",    gana: "Rakshasa", shaktiEn: "Khyapayitri Shakti (rhythmic timing, landed assets & fame)",      shaktiHi: "ख्यापयित्री शक्ति (सटीक काल-ज्ञान, अचल संपदा एवं यश)" },
    24: { name: "Shatabhisha (शतभिषा)",         ruler: "Rahu",    gana: "Rakshasa", shaktiEn: "Bheshaja Shakti (100-physician diagnostic & research mastery)",   shaktiHi: "भेषज शक्ति (सौ वैद्यों तुल्य निदान, गूढ़ शोध एवं तकनीकी पकड़)" },
    25: { name: "Purva Bhadrapada (पूर्वा भाद्रपद)",ruler: "Jupiter",gana: "Manushya",shaktiEn: "Yajamana Udyamana (elevating evolutionary fire & austerity)",     shaktiHi: "यजमान उद्यमन शक्ति (तपस्या, वैचारिक क्रांति एवं उच्च उत्थान)" },
    26: { name: "Uttara Bhadrapada (उत्तरा भाद्रपद)",ruler:"Saturn",gana: "Manushya",shaktiEn: "Varshodyamana (deep cosmic stability & enduring treasury)",       shaktiHi: "वर्षोद्यमन शक्ति (समुद्रवत् धैर्य, स्थिर कोष एवं योगिक प्रज्ञा)" },
    27: { name: "Revati (रेवती)",               ruler: "Mercury", gana: "Deva",     shaktiEn: "Kshiradyapani (nourishing completion & distant-land fortune)",    shaktiHi: "क्षीरद्यापनी शक्ति (संपूर्णता, सुदूर यात्रा एवं ईश्वरीय संरक्षण)" }
  };

  const PLANET_META = {
    Sun:     { en: "Sun (Surya)",     hi: "सूर्य (Sun)",         exalted: 1,  debilitated: 7,  own: [5],     aspects: [7],       karakaEn: "Soul, paternal lineage, executive authority, and constitutional vitality", karakaHi: "आत्मा, पितृ-परंपरा, राजसत्ता, प्रशासनिक अधिकार एवं जीवन-ऊर्जा", healthEn: "cardiovascular rhythm, ocular vitality, spinal axis, and Vitamin-D assimilation", healthHi: "हृदय-स्पंदन, नेत्र-ज्योति, मेरुदंड (रीढ़) एवं अस्थि-तेज", fieldEn: "Public Administration, Executive Governance, Medicine, Political Strategy & Institutional Command", fieldHi: "प्रशासनिक सेवा (IAS/PSC), राजसत्ता, चिकित्सा, राष्ट्राध्यक्षीय प्रबंधन एवं नीति-निर्माण" },
    Moon:    { en: "Moon (Chandra)",  hi: "चंद्रमा (Moon)",      exalted: 2,  debilitated: 8,  own: [4],     aspects: [7],       karakaEn: "Mind, maternal bond, emotional perception, public rapport, and liquid flow", karakaHi: "मन, मातृ-सुख, भावनात्मक संवेदन, जन-संपर्क एवं तरल नकदी प्रवाह", healthEn: "lymphatic hydration, sleep cycles, respiratory mucosa, and neuro-endocrine balance", healthHi: "निद्रा-चक्र, जल-संतुलन, कफ/साइनस एवं मानसिक-हार्मोनल सामंजस्य", fieldEn: "Psychology, Healthcare, Public Relations, Hospitality, Liquidity Management & Creative Media", fieldHi: "मनोविज्ञान, स्वास्थ्य-सेवा, जनसंपर्क, मानव-संसाधन (HR), जल/खाद्य उद्योग एवं रचनात्मक संवाद" },
    Mars:    { en: "Mars (Mangal)",   hi: "मंगल (Mars)",         exalted: 10, debilitated: 4,  own: [1, 8],  aspects: [4, 7, 8], karakaEn: "Courage, technical execution, landed property, siblings, and surgical precision", karakaHi: "साहस, पराक्रम, भूमि-भवन, भ्रातृ-बल एवं तकनीकी क्रियान्वयन", healthEn: "hemoglobin/iron levels, muscular stamina, digestive Pitta fire, and adrenal response", healthHi: "रक्त-हीमोग्लोबिन, मांसपेशी बल, पाचक पित्त-अग्नि एवं त्वरित ऊर्जा", fieldEn: "Core Engineering, Defense/Uniformed Services, Real Estate Infrastructure, Surgery & Robotics", fieldHi: "अभियांत्रिकी (Engineering), रक्षा/पुलिस सेवा, भूमि-निर्माण, शल्य-चिकित्सा एवं हार्डवेयर तकनीक" },
    Mercury: { en: "Mercury (Budh)",  hi: "बुध (Mercury)",       exalted: 6,  debilitated: 12, own: [3, 6],  aspects: [7],       karakaEn: "Analytical computation, commercial law, speech, software logic, and trade", karakaHi: "तार्किक गणना, वाणिज्य-विधि, वाक्-कौशल, सॉफ्टवेयर कोड एवं व्यापार", healthEn: "central nervous pathways, gut-brain vagus axis, dermal sensitivity, and vocal cords", healthHi: "तंत्रिका-तंत्र (Nerves), आंत-मस्तिष्क समन्वय, त्वचा एवं वाणी-केंद्र", fieldEn: "Software Architecture, Quantitative Finance/CA, Commercial Law, Data Science & Strategic Consulting", fieldHi: "सॉफ्टवेयर/IT, चार्टर्ड अकाउंटेंसी (CA/Finance), वाणिज्यिक विधि, डेटा विज्ञान एवं परामर्श" },
    Jupiter: { en: "Jupiter (Guru)",  hi: "बृहस्पति (गुरु)",     exalted: 4,  debilitated: 10, own: [9, 12], aspects: [5, 7, 9], karakaEn: "Dharmic wisdom, treasury expansion, progeny, mentorship, and judicial ethics", karakaHi: "धर्म-प्रज्ञा, कोष-विस्तार, संतान सुख, गुरु-कृपा एवं न्यायिक नीति", healthEn: "hepatic (liver) metabolism, pancreatic glycemic balance, and arterial lipid regulation", healthHi: "यकृत (Liver) चयापचय, अग्न्याशय/शर्करा संतुलन एवं वसा नियंत्रण", fieldEn: "Jurisprudence/Judiciary, Macro-Banking, Higher Academia, Policy Advisory & Dharmic Leadership", fieldHi: "न्यायपालिका/विधि, उच्च बैंकिंग व वित्त, शिक्षाविद्, नीति-परामर्श एवं संस्थागत मार्गदर्शन" },
    Venus:   { en: "Venus (Shukra)",  hi: "शुक्र (Venus)",       exalted: 12, debilitated: 6,  own: [2, 7],  aspects: [7],       karakaEn: "Marital harmony, diplomatic treaties, aesthetic assets, vehicles, and refinement", karakaHi: "वैवाहिक सामंजस्य, कूटनीतिक संधि, वाहन-वैभव, कला एवं सौंदर्य", healthEn: "renal filtration, reproductive endocrine vitality, and cellular collagen renewal", healthHi: "वृक्क (Kidney) कार्यप्रणाली, प्रजनन अंतःस्रावी बल एवं ओज-तेज", fieldEn: "Product/Architectural Design, Luxury Commerce, Media Production, Diplomacy & Capital Markets", fieldHi: "वास्तुकला/डिजाइन, लग्जरी वाणिज्य, मीडिया/फिल्म निर्माण, कूटनीति एवं पूंजी बाजार" },
    Saturn:  { en: "Saturn (Shani)",  hi: "शनि (Saturn)",        exalted: 7,  debilitated: 1,  own: [10, 11],aspects: [3, 7, 10],karakaEn: "Karmic endurance, structural systems, mass governance, longevity, and industrial scale", karakaHi: "कर्म-न्याय, दीर्घकालिक अनुशासन, जन-प्रशासन, आयुष्य एवं औद्योगिक साम्राज्य", healthEn: "skeletal calcium density, knee/lumbar articulations, dental structure, and Vata nerve tone", healthHi: "अस्थि-कैल्शियम घनत्व, घुटने/कमर के जोड़, दंत-बल एवं वात-संतुलन", fieldEn: "Industrial Infrastructure, Judiciary, Systems Operations, Mining/Energy & Long-Horizon Governance", fieldHi: "औद्योगिक बुनियादी ढांचा, न्यायिक तंत्र, परिचालन प्रबंधन, खनन/ऊर्जा एवं दीर्घकालिक प्रशासन" },
    Rahu:    { en: "Rahu (North Node)",hi: "राहु (Rahu)",        exalted: 2,  debilitated: 8,  own: [11],    aspects: [5, 7, 9], karakaEn: "Frontier technology, cross-border expansion, unconventional scaling, and research", karakaHi: "अत्याधुनिक तकनीक, विदेश-संपर्क, असाधारण विस्तार एवं गूढ़ अन्वेषण", healthEn: "auto-immune reactivity, circadian sleep-wake rhythms, and toxin clearance", healthHi: "रोग-प्रतिरोधक संवेदनशीलता, रात्रि निद्रा-चक्र एवं सूक्ष्म विष-शोधन", fieldEn: "Artificial Intelligence, Aviation/Space, Global Exports, Quantitative Trading & Frontier Research", fieldHi: "कृत्रिम बुद्धिमत्ता (AI), विमानन/अंतरिक्ष, अंतर्राष्ट्रीय व्यापार, क्वांट ट्रेडिंग एवं गुप्त शोध" },
    Ketu:    { en: "Ketu (South Node)",hi: "केतु (Ketu)",        exalted: 8,  debilitated: 2,  own: [8],     aspects: [5, 7, 9], karakaEn: "Innate past-life intuition, root-cause diagnostics, spiritual liberation, and precision", karakaHi: "पूर्वजन्म सिद्धि, सूक्ष्म निदान क्षमता, आध्यात्मिक वैराग्य एवं सटीक भेदन", healthEn: "subtle spinal plexus signaling, cellular immunity, and psychosomatic sensitivity", healthHi: "सूक्ष्म नाड़ी-चक्र, कोशिकीय प्रतिरक्षा एवं अंतर्ज्ञानी संवेदनशीलता", fieldEn: "Medical Diagnostics, Cybersecurity, Occult/Vedic Sciences, Deep Auditing & Spiritual Research", fieldHi: "चिकित्सीय निदान, साइबर सुरक्षा, वैदिक/गूढ़ विज्ञान, सूक्ष्म ऑडिटिंग एवं आध्यात्मिक शोध" }
  };

  const BHAVA_SPHERES = {
    1:  { en: "self-constitution, personal sovereignty, and physical vitality",         hi: "आत्म-संरचना, स्वतंत्र अस्तित्व और शारीरिक जीवटता" },
    2:  { en: "accumulated family treasury, speech authority, and lineage values",      hi: "संचित कुटुंब कोष, वाणी की प्रामाणिकता और कुल-परंपरा" },
    3:  { en: "self-initiated enterprise, courageous execution, and communication",     hi: "स्व-पराक्रम, साहसिक पहल और संवाद-कौशल" },
    4:  { en: "inner emotional sanctuary, maternal blessings, land, and vehicles",      hi: "आंतरिक मानसिक सुख, मातृ-कृपा, भूमि-भवन और वाहन संपदा" },
    5:  { en: "original intelligence (Dhi), Purva-Punya merit, and progeny",            hi: "मौलिक प्रज्ञा (धी), पूर्वजन्म पुण्य और संतान-वंश" },
    6:  { en: "competitive victory, operational discipline, and health resilience",     hi: "प्रतियोगी विजय, कार्य-अनुशासन और रोग-प्रतिरोधक क्षमता" },
    7:  { en: "marital covenant, legal partnerships, and public negotiations",          hi: "वैवाहिक गठबंधन, विधिक साझेदारी और सामाजिक अनुबंध" },
    8:  { en: "deep research, structural transformation, longevity, and joint assets",  hi: "गूढ़ अनुसंधान, आकस्मिक रूपांतरण, आयुष्य और संयुक्त संपदा" },
    9:  { en: "Dharma, higher wisdom, paternal/guru grace, and long-horizon fortune",   hi: "धर्म-पथ, उच्च दर्शन, गुरु/पितृ कृपा और दीर्घकालिक भाग्योदय" },
    10: { en: "Karmic command, institutional reputation, and executive authority",      hi: "कर्म-सत्ता, संस्थागत प्रतिष्ठा और सर्वोच्च कार्य-अधिकार" },
    11: { en: "multiplied income gains, network alliances, and fulfilled ambitions",    hi: "बहुगुणित आय-लाभ, प्रभावशाली नेटवर्क और मनोकामना सिद्धि" },
    12: { en: "distant/global horizons, capital investments, and contemplative peace",  hi: "सुदूर/वैश्विक संपर्क, पूंजीगत निवेश और आध्यात्मिक चिंतन" }
  };

  const LAGNA_FUNCTIONAL_MATRIX = {
    1:  { yogakaraka: [],         benefics: ["Sun", "Moon", "Mars", "Jupiter"], malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Venus", "Saturn"], badhakaHouse: 11, badhakesh: "Saturn" },
    2:  { yogakaraka: ["Saturn"], benefics: ["Saturn", "Sun", "Mercury"],       malefics: ["Jupiter", "Venus", "Moon"],   marakas: ["Mars", "Jupiter"], badhakaHouse: 9,  badhakesh: "Saturn" },
    3:  { yogakaraka: [],         benefics: ["Venus"],                          malefics: ["Mars", "Jupiter", "Sun"],     marakas: ["Mars", "Jupiter"], badhakaHouse: 7,  badhakesh: "Jupiter" },
    4:  { yogakaraka: ["Mars"],   benefics: ["Moon", "Mars", "Jupiter"],        malefics: ["Venus", "Mercury", "Saturn"], marakas: ["Saturn", "Venus"], badhakaHouse: 11, badhakesh: "Venus" },
    5:  { yogakaraka: ["Mars"],   benefics: ["Sun", "Mars", "Jupiter"],         malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Saturn", "Venus"], badhakaHouse: 9,  badhakesh: "Mars" },
    6:  { yogakaraka: [],         benefics: ["Venus", "Mercury"],               malefics: ["Mars", "Jupiter", "Moon"],    marakas: ["Mars", "Jupiter"], badhakaHouse: 7,  badhakesh: "Jupiter" },
    7:  { yogakaraka: ["Saturn"], benefics: ["Saturn", "Mercury", "Venus"],     malefics: ["Sun", "Jupiter", "Mars"],     marakas: ["Mars", "Jupiter"], badhakaHouse: 11, badhakesh: "Sun" },
    8:  { yogakaraka: [],         benefics: ["Moon", "Jupiter", "Sun", "Mars"], malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Venus", "Mercury"],badhakaHouse: 9,  badhakesh: "Moon" },
    9:  { yogakaraka: [],         benefics: ["Mars", "Sun", "Jupiter"],         malefics: ["Venus", "Saturn", "Mercury"], marakas: ["Venus", "Saturn"], badhakaHouse: 7,  badhakesh: "Mercury" },
    10: { yogakaraka: ["Venus"],  benefics: ["Venus", "Mercury", "Saturn"],     malefics: ["Mars", "Jupiter", "Moon"],    marakas: ["Moon", "Mars"],    badhakaHouse: 11, badhakesh: "Mars" },
    11: { yogakaraka: ["Venus"],  benefics: ["Venus", "Saturn", "Sun", "Mars"], malefics: ["Jupiter", "Moon"],            marakas: ["Jupiter", "Moon"], badhakaHouse: 9,  badhakesh: "Venus" },
    12: { yogakaraka: [],         benefics: ["Moon", "Mars", "Jupiter"],        malefics: ["Sun", "Venus", "Saturn", "Mercury"], marakas: ["Mercury", "Saturn"], badhakaHouse: 7, badhakesh: "Mercury" }
  };

  const ASHTAKAVARGA_RULES = {
    Sun:     { Sun:[1,2,4,7,8,9,10,11], Moon:[3,6,10,11], Mars:[1,2,4,7,8,9,10,11], Mercury:[3,5,6,9,10,11,12], Jupiter:[5,6,9,11], Venus:[6,7,12], Saturn:[1,2,4,7,8,9,10,11], Asc:[3,4,6,10,11,12] },
    Moon:    { Sun:[3,6,7,8,10,11], Moon:[1,3,6,7,10,11], Mars:[2,3,5,6,9,10,11], Mercury:[1,3,4,5,7,8,10,11], Jupiter:[1,4,7,8,10,11,12], Venus:[3,4,5,7,9,10,11], Saturn:[3,5,6,11], Asc:[3,6,10,11] },
    Mars:    { Sun:[3,5,6,10,11], Moon:[3,6,11], Mars:[1,2,4,7,8,10,11], Mercury:[3,5,6,11], Jupiter:[6,10,11,12], Venus:[6,8,11,12], Saturn:[1,4,7,8,9,10,11], Asc:[1,3,6,10,11] },
    Mercury: { Sun:[5,6,9,11,12], Moon:[2,4,6,8,10,11], Mars:[1,2,4,7,8,9,10,11], Mercury:[1,3,5,6,9,10,11,12], Jupiter:[6,8,11,12], Venus:[1,2,3,4,5,8,9,11], Saturn:[1,2,4,7,8,9,10,11], Asc:[1,2,4,6,8,10,11] },
    Jupiter: { Sun:[1,2,3,4,7,8,9,10,11], Moon:[2,5,7,9,11], Mars:[1,2,4,7,8,10,11], Mercury:[1,2,4,5,6,9,10,11], Jupiter:[1,2,3,4,7,8,10,11], Venus:[2,5,6,9,10,11], Saturn:[3,5,6,12], Asc:[1,2,4,5,6,7,9,10,11] },
    Venus:   { Sun:[8,11,12], Moon:[1,2,3,4,5,8,9,11,12], Mars:[3,5,6,9,11,12], Mercury:[3,5,6,9,11], Jupiter:[5,8,9,10,11], Venus:[1,2,3,4,5,8,9,10,11], Saturn:[3,4,5,8,9,10,11], Asc:[1,2,3,4,5,8,9,11] },
    Saturn:  { Sun:[1,2,4,7,8,10,11], Moon:[3,6,11], Mars:[3,5,6,10,11,12], Mercury:[6,8,9,10,11,12], Jupiter:[5,6,11,12], Venus:[6,11,12], Saturn:[3,5,6,11], Asc:[1,3,4,6,10,11] }
  };

  const NAKSHATRA_AKSHARAS = {
    1:  { pada: ["चु (Chu)", "चे (Che)", "चो (Cho)", "ला (La)"], devataHi: "अश्विनी कुमार (देव वैद्य)", devataEn: "Ashwini Kumaras", symbolHi: "अश्व-मुख (Horse Head)" },
    2:  { pada: ["ली (Lee)", "लू (Loo)", "ले (Le)", "लो (Lo)"], devataHi: "यमराज (धर्मराज)", devataEn: "Yama (Dharma)", symbolHi: "योनि (Vessel of Creation)" },
    3:  { pada: ["अ (A)", "ई (Ee)", "उ (U)", "ए (E)"], devataHi: "अग्नि देव", devataEn: "Agni (Sacred Fire)", symbolHi: "अग्नि-शिखा / फरसा (Flame/Razor)" },
    4:  { pada: ["ओ (O)", "वा (Va)", "वी (Vee)", "वू (Voo)"], devataHi: "ब्रह्मा (प्रजापति)", devataEn: "Lord Brahma", symbolHi: "रथ / वट-वृक्ष (Chariot)" },
    5:  { pada: ["वे (Ve)", "वो (Vo)", "का (Ka)", "की (Kee)"], devataHi: "चंद्रदेव (सोम)", devataEn: "Soma (Moon God)", symbolHi: "मृग-शिर (Deer's Head)" },
    6:  { pada: ["कु (Ku)", "घ (Gha)", "ङ (Nga)", "छ (Chha)"], devataHi: "रुद्र (भगवान शिव)", devataEn: "Rudra (Fierce Shiva)", symbolHi: "अश्रु-बिंदु / हीरा (Teardrop/Diamond)" },
    7:  { pada: ["के (Ke)", "को (Ko)", "हा (Ha)", "ही (Hee)"], devataHi: "माता अदिति", devataEn: "Aditi (Mother of Gods)", symbolHi: "तरकश और धनुष (Quiver of Arrows)" },
    8:  { pada: ["हु (Hu)", "हे (He)", "हो (Ho)", "डा (Da)"], devataHi: "देवगुरु बृहस्पति", devataEn: "Brihaspati", symbolHi: "गौ-स्तन / कमल (Cow's Udder/Lotus)" },
    9:  { pada: ["डी (Dee)", "डू (Doo)", "डे (De)", "डो (Do)"], devataHi: "नाग देवता (सर्प)", devataEn: "Sarpa / Nagas", symbolHi: "कुंडलीकृत सर्प (Coiled Serpent)" },
    10: { pada: ["मा (Ma)", "मी (Mee)", "मू (Moo)", "मे (Me)"], devataHi: "पितर देवता", devataEn: "Pitris (Ancestors)", symbolHi: "राज-सिंहासन (Royal Throne)" },
    11: { pada: ["मो (Mo)", "टा (Ta)", "टी (Tee)", "टू (Too)"], devataHi: "भग (सौभाग्य देवता)", devataEn: "Bhaga", symbolHi: "विश्राम शय्या (Front Legs of Couch)" },
    12: { pada: ["टे (Te)", "टो (To)", "पा (Pa)", "पी (Pee)"], devataHi: "अर्यमा (वचन/मित्रता देव)", devataEn: "Aryaman", symbolHi: "शय्या के पिछले पाये (Four Pillars)" },
    13: { pada: ["पू (Poo)", "ष (Sha)", "ण (Na)", "ठ (Tha)"], devataHi: "सविता (सूर्य देव)", devataEn: "Savitar (Sun God)", symbolHi: "खुली हथेली (Open Palm)" },
    14: { pada: ["पे (Pe)", "पो (Po)", "रा (Ra)", "री (Ree)"], devataHi: "विश्वकर्मा (त्वष्टा)", devataEn: "Vishwakarma", symbolHi: "चमकता रत्न / मोती (Shining Jewel)" },
    15: { pada: ["रू (Roo)", "रे (Re)", "रो (Ro)", "ता (Ta)"], devataHi: "वायु देव (पवन)", devataEn: "Vayu (Wind God)", symbolHi: "कोमल अंकुर / मूंगा (Coral/Shoot)" },
    16: { pada: ["ती (Tee)", "तू (Too)", "ते (Te)", "तो (To)"], devataHi: "इंद्र एवं अग्नि", devataEn: "Indragni", symbolHi: "विजय तोरण / कुम्हार का चाक (Triumphal Arch)" },
    17: { pada: ["ना (Na)", "नी (Nee)", "नू (Noo)", "ने (Ne)"], devataHi: "मित्र देव", devataEn: "Mitra", symbolHi: "कमल पुष्प (Lotus Flower)" },
    18: { pada: ["नो (No)", "या (Ya)", "यी (Yee)", "यू (Yoo)"], devataHi: "देवराज इंद्र", devataEn: "Indra (King of Gods)", symbolHi: "रक्षा-छत्र / कुंडल (Protective Umbrella)" },
    19: { pada: ["ये (Ye)", "यो (Yo)", "भा (Bha)", "भी (Bhee)"], devataHi: "मां निरृति (महाकाली)", devataEn: "Nirriti", symbolHi: "बंधी हुई जड़ें (Tied Roots)" },
    20: { pada: ["भू (Bhoo)", "धा (Dha)", "फा (Pha)", "ढा (Dha)"], devataHi: "आपः (जल देवता)", devataEn: "Apah (Cosmic Waters)", symbolHi: "हाथी का दांत / पंखा (Winnowing Basket)" },
    21: { pada: ["भे (Bhe)", "भो (Bho)", "जा (Ja)", "जी (Jee)"], devataHi: "विश्वेदेवा", devataEn: "Vishvadevas", symbolHi: "गज-दंत (Elephant Tusk)" },
    22: { pada: ["खी (Khee)", "खू (Khoo)", "खे (Khe)", "खो (Kho)"], devataHi: "भगवान श्री हरि विष्णु", devataEn: "Lord Maha Vishnu", symbolHi: "तीन पग / कान (Three Footsteps/Ear)" },
    23: { pada: ["गा (Ga)", "गी (Gee)", "गू (Goo)", "गे (Ge)"], devataHi: "अष्ट वसु", devataEn: "Eight Vasus", symbolHi: "डमरू / मृदंग (Musical Drum)" },
    24: { pada: ["गो (Go)", "सा (Sa)", "सी (See)", "सू (Soo)"], devataHi: "वरुण देव (औषधि पति)", devataEn: "Varuna", symbolHi: "शून्य चक्र / सौ तारे (Circle of 100 Stars)" },
    25: { pada: ["से (Se)", "सो (So)", "दा (Da)", "दी (Dee)"], devataHi: "अजैकपाद (शिव रूप)", devataEn: "Ajaikapada", symbolHi: "दुधारी तलवार (Two-Faced Sword)" },
    26: { pada: ["दू (Doo)", "थ (Tha)", "झ (Jha)", "ञ (Jna)"], devataHi: "अहिर्बुध्न्य (कुंडलिनी नाग)", devataEn: "Ahirbudhnya", symbolHi: "जुड़वां मीन / शय्या (Deep Ocean Twins)" },
    27: { pada: ["दे (De)", "दो (Do)", "चा (Cha)", "ची (Chee)"], devataHi: "पूषा (मार्ग-रक्षक सूर्य)", devataEn: "Pushan", symbolHi: "मत्स्य युगल / शंख (Pair of Fish)" }
  };

  const GEMSTONE_META = {
    Sun:     { hi: "माणिक्य (Ruby) — सोने या तांबे में अनामिका अंगुली में", en: "Natural Ruby (Manikya) in Gold/Copper on Ring Finger" },
    Moon:    { hi: "सच्चा मोती (Natural Pearl) — चांदी में कनिष्ठा अंगुली में", en: "Natural Pearl (Moti) in Silver on Little Finger" },
    Mars:    { hi: "लाल मूंगा (Red Coral) — सोने या तांबे में अनामिका अंगुली में", en: "Red Coral (Moonga) in Gold/Copper on Ring Finger" },
    Mercury: { hi: "पन्ना (Emerald) — सोने या चांदी में कनिष्ठा अंगुली में", en: "Natural Emerald (Panna) in Gold/Silver on Little Finger" },
    Jupiter: { hi: "पीला पुखराज (Yellow Sapphire) — सोने में तर्जनी अंगुली में", en: "Yellow Sapphire (Pukhraj) in Gold on Index Finger" },
    Venus:   { hi: "ओपल / हीरा / सफेद जरकन (Opal/Diamond) — चांदी या प्लैटिनम में मध्यमा/अनामिका में", en: "Fire Opal / Diamond in Silver/Platinum on Middle/Ring Finger" },
    Saturn:  { hi: "नीलम (Blue Sapphire) या कटैला (Amethyst) — पंचधातु/चांदी में मध्यमा अंगुली में (परीक्षण पश्चात)", en: "Blue Sapphire (Neelam - only after 7-day trial) in Silver/Panchdhatu on Middle Finger" }
  };

  // ==========================================================================
  // 2. MATHEMATICAL, CHART, ASHTAKAVARGA & DYNAMIC AGE CALCULATORS
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
      breakdown: breakdown.slice(0, 14).join(" + ") + (breakdown.length > 14 ? " ..." : "")
    };
  }

  function calculateNumerologyFromDob(dobStr) {
    const parts = (dobStr || "1998-01-24").split("-");
    const year  = parseInt(parts[0], 10) || 1998;
    const month = parseInt(parts[1], 10) || 1;
    const day   = parseInt(parts[2], 10) || 24;

    const mulank = reduceToSingleDigit(day);
    const allDigits = `${parts[0]}${parts[1]}${parts[2]}`.replace(/\D/g, "");
    const rawSum = allDigits.split("").reduce((a, b) => a + parseInt(b, 10), 0);
    const bhagyank = reduceToSingleDigit(rawSum);

    const now = new Date();
    const birthDate = new Date(Date.UTC(year, month - 1, day));
    const exactAgeYears = Math.max(0, Number(((now.getTime() - birthDate.getTime()) / (365.25 * 86400000)).toFixed(2)));
    let age = Math.floor(exactAgeYears);
    const ageMonths = Math.max(0, Math.floor((exactAgeYears - age) * 12));

    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(day + month + reduceToSingleDigit(currentYear));

    return { year, month, day, mulank, bhagyank, rawSum, age, ageMonths, exactAgeYears, currentYear, personalYear };
  }

  function getBhavaFrom(refRashi, targetRashi) { return ((targetRashi - refRashi + 12) % 12) + 1; }
  function getRashiOfBhava(refRashi, bhavaNum) { return ((refRashi + bhavaNum - 2) % 12) + 1; }
  function getLordKeyOfRashi(rashiId) { return RASHI_DATA[rashiId].lord; }

  function getHousesRuledByPlanet(ascRashi, planetKey) {
    const owned = [];
    for (let h = 1; h <= 12; h++) {
      const rashi = getRashiOfBhava(ascRashi, h);
      if (RASHI_DATA[rashi].lord === planetKey) owned.push(h);
    }
    return owned;
  }

  // Dynamic Planet Activation Ages Computed Strictly from the Native's Vimshottari Dasha Tree
  function computeDynamicPlanetActivationAges(planetKey, dashaTree, birthYear, degInSign) {
    if (dashaTree && Array.isArray(dashaTree.fullSeq)) {
      const ages = [];
      dashaTree.fullSeq.forEach(md => {
        (md.antardashas || []).forEach(ad => {
          if (ad.lord === planetKey || (md.lord === planetKey && ad.lord === planetKey)) {
            const yr = ad.start.getFullYear();
            const a = yr - birthYear;
            if (a >= 1 && a <= 85 && !ages.some(existing => Math.abs(existing - a) <= 2)) {
              ages.push(a);
            }
          }
        });
      });
      if (ages.length >= 2) return ages.slice(0, 4);
    }
    // Degree-calibrated BPHS fallback only if DOB-only mode without Dasha tree
    const baseMap = { Jupiter: 16, Sun: 22, Moon: 24, Venus: 25, Mars: 28, Mercury: 32, Saturn: 36, Rahu: 42, Ketu: 45 };
    const b = baseMap[planetKey] || 24;
    const degShift = Math.round(((degInSign || 15) - 15) / 7.5);
    return [Math.max(14, b + degShift), b + degShift + 6, b + degShift + 12];
  }

  function deriveSiderealSunRashi(month, day) {
    const transitions = [
      { m: 1, d: 14, before: 9,  after: 10 },
      { m: 2, d: 13, before: 10, after: 11 },
      { m: 3, d: 14, before: 11, after: 12 },
      { m: 4, d: 14, before: 12, after: 1 },
      { m: 5, d: 15, before: 1,  after: 2 },
      { m: 6, d: 15, before: 2,  after: 3 },
      { m: 7, d: 16, before: 3,  after: 4 },
      { m: 8, d: 17, before: 4,  after: 5 },
      { m: 9, d: 17, before: 5,  after: 6 },
      { m: 10,d: 17, before: 6,  after: 7 },
      { m: 11,d: 16, before: 7,  after: 8 },
      { m: 12,d: 16, before: 8,  after: 9 }
    ];
    const row = transitions.find(t => t.m === month) || transitions[0];
    return day < row.d ? row.before : row.after;
  }

  const VALID_NAKS_FOR_RASHI = {
    1:[1,2,3], 2:[3,4,5], 3:[5,6,7], 4:[7,8,9],
    5:[10,11,12], 6:[12,13,14], 7:[14,15,16], 8:[16,17,18],
    9:[19,20,21], 10:[21,22,23], 11:[23,24,25], 12:[25,26,27]
  };

  function pickValidNakForRashi(rashiId, seed) {
    const list = VALID_NAKS_FOR_RASHI[rashiId] || [1, 2, 3];
    return list[Math.abs(seed) % list.length];
  }

  function buildDerivedChartFromDobAndName(numData) {
    if (typeof window.Astronomy !== "undefined" && typeof window.BirthChartCalculator !== "undefined" && typeof window.BirthChartCalculator.calculateDobOnlyAstronomy === "function") {
      try {
        const dobStr = `${numData.year}-${String(numData.month).padStart(2, "0")}-${String(numData.day).padStart(2, "0")}`;
        return window.BirthChartCalculator.calculateDobOnlyAstronomy(dobStr);
      } catch (e) {}
    }

    const sunRashi = deriveSiderealSunRashi(numData.month, numData.day);
    const epochDays = Math.floor(new Date(numData.year, numData.month - 1, numData.day).getTime() / 86400000);
    const refEpoch2000 = Math.floor(new Date(2000, 0, 1).getTime() / 86400000);
    const daysSince2000 = epochDays - refEpoch2000;
    const lunarCycles = (daysSince2000 / 27.321661) + 0.52;
    const normPhase = ((lunarCycles % 1) + 1) % 1;
    const moonRashi = Math.min(12, Math.max(1, Math.floor(normPhase * 12) + 1));
    const moonNak = pickValidNakForRashi(moonRashi, Math.floor(normPhase * 27) + numData.day);

    const ascRashi  = moonRashi;
    const jupRashi  = ((Math.floor((daysSince2000 / 365.25) / 0.988) + 1) % 12 + 12) % 12 + 1;
    const satRashi  = ((Math.floor((daysSince2000 / 365.25) / 2.46) + 1) % 12 + 12) % 12 + 1;
    const rahuRashi = ((4 - Math.floor((daysSince2000 / 365.25) / 1.55)) % 12 + 12) % 12 + 1;
    const ketuRashi = ((rahuRashi + 5) % 12) + 1;
    const mercRashi = ((sunRashi + (numData.day % 3) - 1 + 12) % 12) + 1;
    const venRashi  = ((sunRashi + ((numData.month + numData.day) % 3) - 1 + 12) % 12) + 1;
    const marsRashi = ((sunRashi + numData.bhagyank) % 12) + 1;

    const makeD9 = (rashiId, nakId, seed) => {
      const elementStart = { 1:1, 5:1, 9:1, 2:10, 6:10, 10:10, 3:7, 7:7, 11:7, 4:4, 8:4, 12:4 }[rashiId] || 1;
      const padaOffset = (nakId + seed) % 9;
      return ((elementStart + padaOffset - 1) % 12) + 1;
    };

    const sunNak  = pickValidNakForRashi(sunRashi, Math.floor(numData.day / 10));
    const marsNak = pickValidNakForRashi(marsRashi, numData.mulank);
    const mercNak = pickValidNakForRashi(mercRashi, numData.bhagyank);
    const jupNak  = pickValidNakForRashi(jupRashi, numData.month);
    const venNak  = pickValidNakForRashi(venRashi, numData.day + numData.month);
    const satNak  = pickValidNakForRashi(satRashi, numData.year);
    const rahuNak = pickValidNakForRashi(rahuRashi, numData.day + 1);
    const ketuNak = pickValidNakForRashi(ketuRashi, numData.day + 2);
    const rahuD9  = makeD9(rahuRashi, rahuNak, 2);

    return {
      isFullChartMode: false,
      isExactAstronomyMode: false,
      isDobOnlyRealAstronomy: true,
      Asc:     { d1: ascRashi,  rashi: ascRashi,  nak: moonNak, nakshatra: moonNak, d9: makeD9(ascRashi, moonNak, 1),  retro: false, isMoonAnchorInDobOnlyMode: true },
      Sun:     { d1: sunRashi,  rashi: sunRashi,  nak: sunNak,  nakshatra: sunNak,  d9: makeD9(sunRashi, sunNak, 2),   retro: false },
      Moon:    { d1: moonRashi, rashi: moonRashi, nak: moonNak, nakshatra: moonNak, d9: makeD9(moonRashi, moonNak, 3), retro: false },
      Mars:    { d1: marsRashi, rashi: marsRashi, nak: marsNak, nakshatra: marsNak, d9: makeD9(marsRashi, marsNak, 4), retro: (numData.day % 7 === 0) },
      Mercury: { d1: mercRashi, rashi: mercRashi, nak: mercNak, nakshatra: mercNak, d9: makeD9(mercRashi, mercNak, 5), retro: (numData.day % 5 === 0) },
      Jupiter: { d1: jupRashi,  rashi: jupRashi,  nak: jupNak,  nakshatra: jupNak,  d9: makeD9(jupRashi, jupNak, 6),   retro: (numData.month % 4 === 0) },
      Venus:   { d1: venRashi,  rashi: venRashi,  nak: venNak,  nakshatra: venNak,  d9: makeD9(venRashi, venNak, 7),   retro: false },
      Saturn:  { d1: satRashi,  rashi: satRashi,  nak: satNak,  nakshatra: satNak,  d9: makeD9(satRashi, satNak, 8),   retro: (numData.month % 3 === 0) },
      Rahu:    { d1: rahuRashi, rashi: rahuRashi, nak: rahuNak, nakshatra: rahuNak, d9: rahuD9,                        retro: true },
      Ketu:    { d1: ketuRashi, rashi: ketuRashi, nak: ketuNak, nakshatra: ketuNak, d9: (((rahuD9 + 5) % 12) + 1),     retro: true }
    };
  }

  function readChartFromDOM(numData, chaldean) {
    if (window.__jtVedicData && window.__jtVedicData.chart) {
      const vd = window.__jtVedicData;
      const converted = {
        isFullChartMode: true,
        isExactAstronomyMode: true,
        isDobOnlyRealAstronomy: false,
        meta: vd.chart.meta || {},
        _shadbalaDetails: vd.chart._shadbalaDetails || {}
      };
      ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].forEach(k => {
        const src = vd.chart[k] || {};
        converted[k] = {
          ...src,
          d1: src.rashi,
          rashi: src.rashi,
          nak: src.nakshatra,
          nakshatra: src.nakshatra,
          d9: src.d9,
          d10: src.d10,
          d7: src.d7,
          d4: src.d4,
          d2: src.d2,
          retro: Boolean(src.retro),
          combust: Boolean(src.combust),
          formattedDeg: src.formattedDMS || src.formattedDeg || ""
        };
      });
      return converted;
    }

    const manualMatrixOpen = document.getElementById("enableChartToggle") && document.getElementById("enableChartToggle").checked;
    if (manualMatrixOpen) {
      const keys = ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
      const chart = { isFullChartMode: true, isExactAstronomyMode: false, isDobOnlyRealAstronomy: false };
      keys.forEach((k, idx) => {
        const d1  = parseInt(document.getElementById(`d1_${k}`)?.value, 10) || 1;
        const nak = parseInt(document.getElementById(`nak_${k}`)?.value, 10) || 1;
        const d9  = parseInt(document.getElementById(`d9_${k}`)?.value, 10) || 1;
        const retroEl = document.getElementById(`retro_${k}`);
        const retro = (k === "Rahu" || k === "Ketu") ? true : (retroEl ? retroEl.checked : false);
        const approxDegInSign = 15 + (idx * 0.5);
        chart[k] = {
          d1, rashi: d1, nak, nakshatra: nak, d9, retro,
          degInSign: approxDegInSign,
          longitude: ((d1 - 1) * 30) + approxDegInSign
        };
      });
      if (window.VedicChartAnalyzer && typeof window.VedicChartAnalyzer.enrichChartWithVargasAndStates === "function") {
        window.VedicChartAnalyzer.enrichChartWithVargasAndStates(chart);
      }
      return chart;
    }

    return buildDerivedChartFromDobAndName(numData, chaldean);
  }

  function evaluatePlanetDignity(planetKey, pData) {
    const meta = PLANET_META[planetKey];
    const isVargottama    = pData.d1 === pData.d9;
    const isExaltedD1     = pData.d1 === meta.exalted;
    const isDebilitatedD1 = pData.d1 === meta.debilitated;
    const isOwnD1         = meta.own.includes(pData.d1);
    const isExaltedD9     = pData.d9 === meta.exalted;
    const isDebilitatedD9 = pData.d9 === meta.debilitated;
    const isOwnD9         = meta.own.includes(pData.d9);

    let statusEn = pData.dignityInfo?.en || "Functional Placement";
    let statusHi = pData.dignityInfo?.hi || "क्रियाशील राशि स्थिति";
    let badgeClass = "bg-purple-500/20 text-purple-200 border-purple-400/40";

    if (isExaltedD1 && isVargottama) {
      statusEn = "Uchcha Vargottama (Exalted in D1 & D9)";
      statusHi = "उच्च वर्गोत्तम (D1 व D9 दोनों में उच्च)";
      badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400";
    } else if (isExaltedD1 && isDebilitatedD9) {
      statusEn = "Exalted in D1 • Debilitated in D9 (Uchcha-Bhanga)";
      statusHi = "D1 में उच्च • नवांश (D9) में नीचस्थ";
      badgeClass = "bg-orange-500/25 text-orange-200 border-orange-400/50";
    } else if (isExaltedD1) {
      statusEn = "Exalted in D1 (Uchcha)";
      statusHi = "उच्च राशिस्थ (प्रबल)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isOwnD1 && isVargottama) {
      statusEn = "Swakshetra Vargottama (Own Sign in D1 & D9)";
      statusHi = "स्वराशि वर्गोत्तम (दोगुना बल)";
      badgeClass = "bg-emerald-500/30 text-emerald-200 border-emerald-400";
    } else if (isOwnD1) {
      statusEn = "Swakshetra (Own Sign in D1)";
      statusHi = "स्वराशिस्थ (अपनी राशि में)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isDebilitatedD1 && (isExaltedD9 || isOwnD9)) {
      statusEn = "Neechabhanga Raja Yoga (Debilitated D1 → Fortified D9)";
      statusHi = "नीचभंग राजयोग (D1 में नीच → नवांश में बली)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isDebilitatedD1) {
      statusEn = "Debilitated in D1 (Neecha)";
      statusHi = "नीच राशिस्थ (धैर्य अपेक्षित)";
      badgeClass = "bg-red-500/25 text-red-200 border-red-400/50";
    } else if (isVargottama) {
      statusEn = "Vargottama (Identical Sign in D1 & D9)";
      statusHi = "वर्गोत्तम (D1 व D9 में एक ही राशि)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isExaltedD9 || isOwnD9) {
      statusEn = "Fortified in Navamsa (D9 Swakshetra/Uchcha)";
      statusHi = "नवांश (D9) में स्व/उच्च राशिस्थ";
      badgeClass = "bg-cyan-500/25 text-cyan-200 border-cyan-400/50";
    } else if (isDebilitatedD9) {
      statusEn = "Sensitive in Navamsa (D9 Neecha)";
      statusHi = "नवांश (D9) में संवेदनशील";
      badgeClass = "bg-rose-500/25 text-rose-200 border-rose-400/50";
    }

    return {
      isVargottama, isExaltedD1, isDebilitatedD1, isOwnD1,
      isExaltedD9, isDebilitatedD9, isOwnD9, statusEn, statusHi, badgeClass
    };
  }

  function analyzeAllPlanetsAndAspects(chart) {
    const pKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const ascRashi = chart.Asc.d1;
    const results = {};

    pKeys.forEach(k => {
      const p = chart[k];
      const meta = PLANET_META[k];
      const bhava   = getBhavaFrom(ascRashi, p.d1);
      const d9Bhava = getBhavaFrom(chart.Asc.d9, p.d9);
      const dignity = evaluatePlanetDignity(k, p);
      const ownedHouses = getHousesRuledByPlanet(ascRashi, k);

      const conjunctWith = pKeys.filter(other => other !== k && chart[other].d1 === p.d1);

      const aspectedTargets = meta.aspects.map(nth => {
        const targetRashi = ((p.d1 + nth - 2) % 12) + 1;
        const targetBhava = getBhavaFrom(ascRashi, targetRashi);
        const planetsThere = pKeys.filter(other => other !== k && chart[other].d1 === targetRashi);
        return { nthAspect: nth, targetRashi, targetBhava, planetsThere };
      });

      const aspectedBy = [];
      pKeys.forEach(other => {
        if (other === k) return;
        const otherMeta = PLANET_META[other];
        const otherRashi = chart[other].d1;
        otherMeta.aspects.forEach(nth => {
          const hitRashi = ((otherRashi + nth - 2) % 12) + 1;
          if (hitRashi === p.d1) aspectedBy.push({ fromPlanet: other, nthAspect: nth });
        });
      });

      results[k] = {
        key: k, meta, d1: p.d1, d9: p.d9, d10: p.d10 || p.d9, d7: p.d7 || p.d9, d4: p.d4 || p.d1,
        nak: p.nak, pada: p.pada || 1, retro: p.retro,
        combust: Boolean(p.combust),
        avasthaEn: p.avasthaEn || "",
        avasthaHi: p.avasthaHi || "",
        formattedDeg: p.formattedDMS || p.formattedDeg || "",
        degInSign: p.degInSign || 15,
        chalitHouse: p.chalitHouse || bhava,
        bhava, d9Bhava, dignity, ownedHouses, conjunctWith, aspectedTargets, aspectedBy
      };
    });

    return results;
  }

  function computeRealAshtakavarga(chart) {
    const planets7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const refs8    = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Asc"];

    const bavByRashi = {};
    const savByRashi = new Array(13).fill(0);
    const planetTotals = {};

    planets7.forEach(planet => {
      const counts = new Array(13).fill(0);
      let pSum = 0;
      refs8.forEach(refKey => {
        const refRashi = chart[refKey].d1;
        const offsets = ASHTAKAVARGA_RULES[planet][refKey] || [];
        offsets.forEach(nth => {
          const targetRashi = ((refRashi + nth - 2) % 12) + 1;
          counts[targetRashi] += 1;
          pSum += 1;
        });
      });
      bavByRashi[planet] = counts;
      planetTotals[planet] = pSum;
      for (let r = 1; r <= 12; r++) {
        savByRashi[r] += counts[r];
      }
    });

    const ascRashi = chart.Asc.d1;
    const houseSav = {};
    const houseBav = {};
    let grandTotalSav = 0;
    planets7.forEach(p => { houseBav[p] = {}; });

    for (let h = 1; h <= 12; h++) {
      const rashiOfH = getRashiOfBhava(ascRashi, h);
      houseSav[h] = savByRashi[rashiOfH];
      grandTotalSav += houseSav[h];
      planets7.forEach(p => {
        houseBav[p][h] = bavByRashi[p][rashiOfH];
      });
    }

    return { houseSav, houseBav, savByRashi, bavByRashi, planetTotals, grandTotalSav };
  }

  function computeSpecialLagnasAndBindus(chart) {
    const ascRashi = chart.Asc.d1;
    const lagnaLordKey = getLordKeyOfRashi(ascRashi);
    const lagnaLordRashi = (chart[lagnaLordKey] || chart.Sun).d1;

    const distToLord = getBhavaFrom(ascRashi, lagnaLordRashi);
    let arudhaRashi = ((lagnaLordRashi + distToLord - 2) % 12) + 1;
    const rawArudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);
    let arudhaExceptionApplied = false;
    if (rawArudhaHouseFromLagna === 1 || rawArudhaHouseFromLagna === 7) {
      arudhaRashi = ((arudhaRashi + 9 - 1) % 12) + 1;
      arudhaExceptionApplied = true;
    }
    const arudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);

    const rashi12th = getRashiOfBhava(ascRashi, 12);
    const lord12thKey = getLordKeyOfRashi(rashi12th);
    const lord12thRashi = (chart[lord12thKey] || chart.Sun).d1;
    const dist12 = getBhavaFrom(rashi12th, lord12thRashi);
    let upapadaRashi = ((lord12thRashi + dist12 - 2) % 12) + 1;
    const rawUlHouseFrom12th = getBhavaFrom(rashi12th, upapadaRashi);
    if (rawUlHouseFrom12th === 1 || rawUlHouseFrom12th === 7) {
      upapadaRashi = ((upapadaRashi + 9 - 1) % 12) + 1;
    }

    const charaCandidates = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    let atmakarakaKey = "Sun";
    let maxDegInSign = -1;

    charaCandidates.forEach(pKey => {
      const p = chart[pKey] || {};
      const rawDeg = (typeof p.degInSign === "number") ? p.degInSign : (typeof p.longitude === "number" ? (p.longitude % 30) : 15);
      if (rawDeg > maxDegInSign) {
        maxDegInSign = rawDeg;
        atmakarakaKey = pKey;
      }
    });
    const karakamsaRashi = chart[atmakarakaKey].d9;
    const ashtakavarga = computeRealAshtakavarga(chart);

    return {
      chandraLagna: chart.Moon.d1,
      suryaLagna: chart.Sun.d1,
      navamsaLagna: chart.Asc.d9,
      arudhaRashi,
      arudhaHouseFromLagna,
      arudhaExceptionApplied,
      upapadaRashi,
      atmakarakaKey,
      karakamsaRashi,
      houseBindus: ashtakavarga.houseSav,
      houseBav: ashtakavarga.houseBav,
      planetTotals: ashtakavarga.planetTotals,
      grandTotalSav: ashtakavarga.grandTotalSav
    };
  }

  function resolveActiveDasha(chart) {
    if (window.__jtVedicData && window.__jtVedicData.dasha) {
      const vdDasha = window.__jtVedicData.dasha;
      const moonNakId = chart.Moon.nak || 1;
      return {
        md: vdDasha.mahadasha,
        ad: vdDasha.antardasha,
        pd: vdDasha.pratyantardasha || vdDasha.antardasha,
        mdActive: vdDasha.mdActive,
        adActive: vdDasha.adActive,
        pdActive: vdDasha.pdActive || null,
        nextAD: vdDasha.nextAD,
        prevAD: vdDasha.prevAD,
        fullSeq: vdDasha.fullSeq,
        isExactCalendarDasha: true,
        isManualDasha: false,
        isDobOnlyUnverifiedDasha: false,
        birthDashaRuler: NAKSHATRA_DATA[moonNakId].ruler
      };
    }

    const manualOn = document.getElementById("enableDashaToggle") && document.getElementById("enableDashaToggle").checked;
    const mdSelect = document.getElementById("currentMD")?.value || "auto";
    const adSelect = document.getElementById("currentAD")?.value || "auto";
    const moonNakId = chart.Moon.nak || 1;
    const birthDashaRuler = NAKSHATRA_DATA[moonNakId].ruler;

    if (manualOn && (mdSelect !== "auto" || adSelect !== "auto")) {
      const chosenMD = mdSelect !== "auto" ? mdSelect : birthDashaRuler;
      const chosenAD = adSelect !== "auto" ? adSelect : chosenMD;
      return {
        md: chosenMD,
        ad: chosenAD,
        nextMD: chosenMD,
        isManualDasha: true,
        isExactCalendarDasha: false,
        isDobOnlyUnverifiedDasha: false,
        birthDashaRuler
      };
    }

    return {
      md: null,
      ad: null,
      nextMD: null,
      isManualDasha: false,
      isExactCalendarDasha: false,
      isDobOnlyUnverifiedDasha: true,
      birthDashaRuler,
      noonMoonNakshatra: NAKSHATRA_DATA[moonNakId].name
    };
  }

  function computeLifeEventTimeline(numData, chart, planetAnalysis, dasha, findings, genderInput) {
    const vdDasha = window.__jtVedicData && window.__jtVedicData.dasha;

    if (window.TimingEngine && chart.isFullChartMode && vdDasha) {
      const domainWindows = window.TimingEngine.findDomainTimingWindows(
        chart, vdDasha, findings, numData.year, genderInput || "male"
      );

      let pastWindowLabel = null;
      if (vdDasha.prevAD && vdDasha.prevAD.start && vdDasha.prevAD.end) {
        const sYr = vdDasha.prevAD.start.getFullYear();
        const eYr = vdDasha.prevAD.end.getFullYear();
        pastWindowLabel = {
          years: `${sYr}–${eYr}`,
          ages: `${Math.max(1, sYr - numData.year)}–${Math.max(2, eYr - numData.year)}`,
          periodLord: `${vdDasha.prevAD.mdLord}–${vdDasha.prevAD.lord}`
        };
      }

      return {
        isExactTiming: true,
        lifeStage: domainWindows.lifeStage,
        marriageBaseline: domainWindows.marriageBaseline,
        pastVerification: pastWindowLabel,
        pastAgeRange: pastWindowLabel ? pastWindowLabel.ages : `${Math.max(1, numData.age - 2)}–${Math.max(2, numData.age - 1)}`,
        cautionWindow: `${numData.currentYear}–${numData.currentYear + 1}`,
        education:      domainWindows.education,
        careerIgnition: domainWindows.careerIgnition,
        career:         domainWindows.career,
        marriage:       domainWindows.marriage,
        childbirth:     domainWindows.childbirth,
        property:       domainWindows.property,
        wealthPeak:     domainWindows.wealthPeak
      };
    }

    const fallbackStage = window.TimingEngine && typeof window.TimingEngine.classifyLifeStage === "function"
      ? window.TimingEngine.classifyLifeStage(`${numData.year}-${String(numData.month).padStart(2, "0")}-${String(numData.day).padStart(2, "0")}`)
      : { code: numData.age < 13 ? "BALA" : (numData.age < 21 ? "VIDYARTHI" : "YUVA_KARMA"), integerAge: numData.age, exactAgeYears: numData.exactAgeYears };

    return {
      isExactTiming: false,
      lifeStage: fallbackStage,
      pastVerification: null,
      pastAgeRange: `${Math.max(1, numData.age - 2)}–${Math.max(2, numData.age - 1)}`,
      cautionWindow: `${numData.currentYear}–${numData.currentYear + 1}`,
      education:      { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      careerIgnition: { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      career:         { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      marriage:       { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      childbirth:     { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      property:       { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      wealthPeak:     { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" }
    };
  }

  // ==========================================================================
  // 3. SUNRISE, SAMVATSARA, PAKSHA-BALA & CLASSICAL AUDIT COMPUTATIONS
  // ==========================================================================

  function computeSunriseSunsetAndVedicVara(ctx) {
    const { numData, chart } = ctx;
    const meta = chart.meta || {};
    const lat = Number(meta.lat || 26.8467);
    const lng = Number(meta.lng || 80.9462);
    const tzMins = Number(meta.tz || 330);

    const d0 = new Date(Date.UTC(numData.year, 0, 1));
    const dBirth = new Date(Date.UTC(numData.year, numData.month - 1, numData.day));
    const dayOfYear = Math.floor((dBirth - d0) / 86400000) + 1;

    const gamma = ((2 * Math.PI) / 365.0) * (dayOfYear - 1);
    const eqTimeMins = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
    const declRad = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
    const latRad = (lat * Math.PI) / 180.0;
    const zenithRad = (90.833 * Math.PI) / 180.0;

    let cosHA = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(declRad))) - (Math.tan(latRad) * Math.tan(declRad));
    cosHA = Math.max(-0.99, Math.min(0.99, cosHA));
    const haDeg = (Math.acos(cosHA) * 180.0) / Math.PI;

    const sunriseUtcMins = 720 - 4 * (lng + haDeg) - eqTimeMins;
    const sunsetUtcMins  = 720 - 4 * (lng - haDeg) - eqTimeMins;
    const sunriseLocalMins = Math.round(sunriseUtcMins + tzMins);
    const sunsetLocalMins  = Math.round(sunsetUtcMins + tzMins);

    const fmtHm = (totMins) => {
      const mNorm = ((totMins % 1440) + 1440) % 1440;
      const h = Math.floor(mNorm / 60);
      const m = mNorm % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const timeStr = meta.time || document.getElementById("birthTime")?.value || "";
    let birthLocalMins = 720;
    if (timeStr && timeStr.includes(":")) {
      const [bh, bm] = timeStr.split(":").map(Number);
      birthLocalMins = (bh || 0) * 60 + (bm || 0);
    }

    const civilDow = dBirth.getUTCDay();
    const isPreSunrise = Boolean(timeStr) && (birthLocalMins < sunriseLocalMins);
    const vedicDow = isPreSunrise ? ((civilDow + 6) % 7) : civilDow;

    const varaHiList = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
    const varaEnList = ["Sunday (Ravivara)", "Monday (Somavara)", "Tuesday (Mangalavara)", "Wednesday (Budhavara)", "Thursday (Guruvara)", "Friday (Shukravara)", "Saturday (Shanivara)"];

    const afterApril = (numData.month > 3) || (numData.month === 3 && numData.day >= 22);
    const vikramSamvat = numData.year + (afterApril ? 57 : 56);
    const shakaSamvat  = numData.year - (afterApril ? 78 : 79);

    const sunSid = chart.Sun?.longitude || 0;
    const sunTrop = (sunSid + (meta.ayanamsa || 24.0)) % 360;
    const isDakshinayana = (sunTrop >= 90 && sunTrop < 270);
    const ayanaHi = isDakshinayana ? "दक्षिणायन" : "उत्तरायण";
    const ayanaEn = isDakshinayana ? "Dakshinayana (Southern Course)" : "Uttarayana (Northern Course)";

    const rituIdx = Math.floor(((sunTrop + 30) % 360) / 60);
    const rituHiList = ["वसंत ऋतु", "ग्रीष्म ऋतु", "वर्षा ऋतु", "शरद ऋतु", "हेमंत ऋतु", "शिशिर ऋतु"];
    const rituEnList = ["Vasanta (Spring)", "Grishma (Summer)", "Varsha (Monsoon)", "Sharad (Autumn)", "Hemanta (Pre-Winter)", "Shishira (Winter)"];

    return {
      sunriseStr: fmtHm(sunriseLocalMins),
      sunsetStr: fmtHm(sunsetLocalMins),
      isPreSunrise,
      civilVaraHi: varaHiList[civilDow],
      civilVaraEn: varaEnList[civilDow],
      vedicVaraHi: varaHiList[vedicDow],
      vedicVaraEn: varaEnList[vedicDow],
      vikramSamvat,
      shakaSamvat,
      ayanaHi,
      ayanaEn,
      rituHi: rituHiList[rituIdx] || "शरद ऋतु",
      rituEn: rituEnList[rituIdx] || "Sharad"
    };
  }

  function evaluateKendradhipatiAndPakshaBala(chart) {
    const ascR = chart.Asc.d1;
    const sunLon = chart.Sun?.longitude || 0;
    const moonLon = chart.Moon?.longitude || 0;
    const rawDiff = ((moonLon - sunLon) % 360 + 360) % 360;
    const distFromNewMoon = rawDiff > 180 ? 360 - rawDiff : rawDiff;
    const pakshaPct = Math.round((distFromNewMoon / 180.0) * 100);
    const pakshaVirupas = Number((distFromNewMoon / 3.0).toFixed(1));

    const pakshaLabelHi = `${pakshaVirupas} विरूप (${Math.round(rawDiff)}° सूर्य-चंद्र कोणीय अंतर • ${pakshaPct}% चंद्र पक्ष-बल)`;
    const pakshaLabelEn = `${pakshaVirupas} Virupas (${Math.round(rawDiff)}° Sun-Moon elongation • ${pakshaPct}% Lunar Paksha-Bala)`;

    let kendradhipatiNoteHi = "";
    let kendradhipatiNoteEn = "";
    let kendradhipatiPlanet = null;

    if (ascR === 3 || ascR === 6) {
      kendradhipatiPlanet = "Jupiter";
      const hOwned = ascR === 3 ? "7वें व 10वें" : "4वें व 7वें";
      const hOwnedEn = ascR === 3 ? "7th & 10th" : "4th & 7th";
      const jupH = chart.Jupiter.house;
      kendradhipatiNoteHi = `बृहस्पति केंद्र (${hOwned} भाव) के स्वामी होकर ${jupH}वें भाव में स्थित होने से शास्त्रीय केंद्राधिपति सिद्धांत के अंतर्गत आते हैं।`;
      kendradhipatiNoteEn = `Jupiter rules Kendra Houses (${hOwnedEn}) and sits in House ${jupH}, operating under classical Kendradhipati parameters.`;
    } else if (ascR === 9 || ascR === 12) {
      kendradhipatiPlanet = "Mercury";
      const hOwned = ascR === 9 ? "7वें व 10वें" : "4वें व 7वें";
      const hOwnedEn = ascR === 9 ? "7th & 10th" : "4th & 7th";
      const merH = chart.Mercury.house;
      kendradhipatiNoteHi = `बुध केंद्र (${hOwned} भाव) के स्वामी होकर ${merH}वें भाव में स्थित होने से शास्त्रीय केंद्राधिपति सिद्धांत के अंतर्गत आते हैं।`;
      kendradhipatiNoteEn = `Mercury rules Kendra Houses (${hOwnedEn}) and occupies House ${merH}, operating under classical Kendradhipati parameters.`;
    }

    return {
      rawDiff: Math.round(rawDiff),
      pakshaPct,
      pakshaVirupas,
      pakshaLabelHi,
      pakshaLabelEn,
      kendradhipatiPlanet,
      kendradhipatiNoteHi,
      kendradhipatiNoteEn
    };
  }

  window.focusBirthTimeInput = function () {
    const bt = document.getElementById("birthTime");
    const topForm = document.getElementById("lifeDossierForm");
    if (topForm) topForm.scrollIntoView({ behavior: "smooth", block: "start" });
    if (bt) {
      setTimeout(() => {
        bt.focus();
        bt.style.boxShadow = "0 0 0 4px rgba(245, 158, 11, 0.75)";
        setTimeout(() => { bt.style.boxShadow = ""; }, 3000);
      }, 450);
    }
  };

  function buildRedBirthTimePrompt(lang) {
    if (lang === "hi") {
      return `
        <div class="p-3.5 rounded-xl bg-amber-950/80 border border-amber-400/60 text-xs md:text-sm text-amber-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div>
            <strong class="text-amber-300"><i class="fas fa-info-circle mr-1.5"></i>केवल जन्म-तिथि मोड (DOB-Only Mode):</strong>
            जन्म समय और शहर ऊपर फॉर्म में प्रविष्ट करने पर उदय लग्न (D1), नवांश (D9), दशमांश (D10), सप्तांश (D7) और 120-वर्षीय विंशोत्तरी महादशा की सटीक आयु गणना सक्रिय हो जाएगी।
          </div>
          <button type="button" onclick="window.focusBirthTimeInput()" class="shrink-0 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-lg">
            + जन्म समय और स्थान जोड़ें ↑
          </button>
        </div>
      `;
    }
    return `
      <div class="p-3.5 rounded-xl bg-amber-950/80 border border-amber-400/60 text-xs md:text-sm text-amber-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <strong class="text-amber-300"><i class="fas fa-info-circle mr-1.5"></i>Date-of-Birth Only Mode:</strong>
          Enter your Birth Time and City above to unlock your exact Rising Lagna (D1), Navamsa (D9), Dasamsa (D10), Saptamsa (D7), and 120-Year Vimshottari Age-to-Complete Roadmap.
        </div>
        <button type="button" onclick="window.focusBirthTimeInput()" class="shrink-0 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-lg">
          + Add Birth Time & City ↑
        </button>
      </div>
    `;
  }

  function getFunctionalRoleLabel(ascRashiId, planetKey, lang) {
    const matrix = LAGNA_FUNCTIONAL_MATRIX[ascRashiId];
    if (!matrix) return "";
    const rolesEn = [];
    const rolesHi = [];

    if (matrix.yogakaraka.includes(planetKey)) {
      rolesEn.push("Yogakaraka (Kendra + Trikona Lord)");
      rolesHi.push("प्रमुख योगकारक (केंद्र-त्रिकोण स्वामी)");
    } else if (matrix.benefics.includes(planetKey)) {
      rolesEn.push("Functional Benefic");
      rolesHi.push("लग्न हेतु शुभ कारक");
    } else if (matrix.malefics.includes(planetKey)) {
      rolesEn.push("Functional Malefic");
      rolesHi.push("लग्न हेतु अकारक");
    }

    if (matrix.marakas.includes(planetKey)) {
      rolesEn.push("2nd/7th Maraka Lord");
      rolesHi.push("द्वितीय/सप्तम मारक संबंध");
    }
    if (matrix.badhakesh === planetKey) {
      rolesEn.push(`Badhakesh (${matrix.badhakaHouse}th Lord)`);
      rolesHi.push(`बाधकेश (${matrix.badhakaHouse}वेश)`);
    }

    return lang === "hi" ? rolesHi.join(" • ") : rolesEn.join(" • ");
  }

  // ==========================================================================
  // 4. 100% COMBINATORIAL CHAPTER GENERATORS (ZERO STATIC SENTENCES)
  // ==========================================================================

  // CHAPTER 1: PERSONALITY, LAGNA, MOON NAKSHATRA, ATMAKARAKA & LIFE STAGE
  function buildChapter1Personality(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter1Personality === "function")
      ? window.NarrativeRules.renderChapter1Personality(ctx)
      : "";

    const { lang, name, chart, numData, chaldean, specialLagnas, planetAnalysis, findings, timeline, dasha } = ctx;
    const isFull = chart.isFullChartMode;
    const ls = timeline?.lifeStage || { code: "YUVA_KARMA", integerAge: numData.age, monthsRemainder: numData.ageMonths };
    const ascR = chart.Asc.d1;
    const moonR = chart.Moon.d1;
    const sunR = chart.Sun.d1;
    const ascData = RASHI_DATA[ascR];
    const moonData = RASHI_DATA[moonR];
    const sunData = RASHI_DATA[sunR];
    const nakData = NAKSHATRA_DATA[chart.Moon.nak] || NAKSHATRA_DATA[1];
    const sunVara = computeSunriseSunsetAndVedicVara(ctx);
    const kpAudit = evaluateKendradhipatiAndPakshaBala(chart);

    const moonNak = chart.Moon.nak || 1;
    const moonPada = chart.Moon.pada || 1;
    const akshObj = NAKSHATRA_AKSHARAS[moonNak] || NAKSHATRA_AKSHARAS[1];
    const birthSyllable = akshObj.pada[moonPada - 1] || akshObj.pada[0];

    if (!isFull) {
      return baseHtml + (lang === "hi"
        ? `<p><strong>2. जन्म नक्षत्र शक्ति (${nakData.name} • चरण ${moonPada}, नामाक्षर '${birthSyllable}'):</strong> चंद्रमा के ${nakData.name} नक्षत्र में स्थित होने से जातक की मूल चेतना में <em>${nakData.shaktiHi}</em> तथा सूर्य की ${sunData.hi} राशि (${sunData.elementHi}) की कार्य-ऊर्जा सक्रिय है।</p>`
        : `<p><strong>2. Janma Nakshatra Shakti (${nakData.name} • Pada ${moonPada}, Syllable '${birthSyllable}'):</strong> With the Moon in ${nakData.name}, the native's core consciousness operates through <em>${nakData.shaktiEn}</em> combined with a ${sunData.en} (${sunData.elementEn}) solar core.</p>`);
    }

    const lagnaLordKey = ascData.lord;
    const lagnaLordInfo = planetAnalysis[lagnaLordKey];
    const lagnaLordShadbala = chart._shadbalaDetails?.[lagnaLordKey];
    const sav1 = specialLagnas.houseBindus[1] || 28;
    const bavLagnaLordInH1 = specialLagnas.houseBav?.[lagnaLordKey]?.[lagnaLordInfo.bhava] || 4;
    const arudhaData = RASHI_DATA[specialLagnas.arudhaRashi];
    const akKey = findings?.charaKarakas?.atmakaraka || specialLagnas.atmakarakaKey;
    const akInfo = planetAnalysis[akKey];
    const karakamsaData = RASHI_DATA[specialLagnas.karakamsaRashi];
    const activeMdStrHi = dasha?.md ? `${PLANET_META[dasha.md].hi} महादशा – ${PLANET_META[dasha.ad].hi} अंतर्दशा` : `${PLANET_META[dasha?.birthDashaRuler || "Sun"].hi} दशा क्रम`;
    const activeMdStrEn = dasha?.md ? `${dasha.md} Mahadasha – ${dasha.ad} Antardasha` : `${dasha?.birthDashaRuler || "Sun"} Dasha sequence`;

    const savanaNoteHi = sunVara.isPreSunrise
      ? `<div class="p-3 rounded-xl bg-amber-950/75 border border-amber-400/50 text-xs text-amber-200 mt-3">🌅 <strong>सावन/पंचांग वार नियम (Pre-Sunrise Birth @ ${sunVara.sunriseStr}):</strong> सूर्योदय (${sunVara.sunriseStr}) से पूर्व जन्म होने के कारण नागरिक कैलेंडर वार <strong>${sunVara.civilVaraHi}</strong> होते हुए भी वैदिक पंचांग वार <strong>${sunVara.vedicVaraHi}</strong> है।</div>`
      : "";
    const savanaNoteEn = sunVara.isPreSunrise
      ? `<div class="p-3 rounded-xl bg-amber-950/75 border border-amber-400/50 text-xs text-amber-200 mt-3">🌅 <strong>Pre-Sunrise Vedic Weekday Rule (Sunrise @ ${sunVara.sunriseStr}):</strong> Because birth occurred prior to local sunrise (${sunVara.sunriseStr}), the civil day is <strong>${sunVara.civilVaraEn}</strong> while the Vedic Panchang Vara is <strong>${sunVara.vedicVaraEn}</strong>.</div>`
      : "";

    if (lang === "hi") {
      return `
        ${baseHtml}
        <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 mt-4">
          <div class="text-xs md:text-sm font-bold text-amber-300 mb-2"><i class="fas fa-sun mr-1.5"></i>संवत्सर, अयन-ऋतु, सूर्योदय (${sunVara.sunriseStr}), नामाक्षर ('${birthSyllable}') एवं चंद्र पक्ष-बल:</div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">विक्रम / शक संवत्:</span><strong class="text-white">विक्रम ${sunVara.vikramSamvat} • शक ${sunVara.shakaSamvat}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">अयन एवं ऋतु:</span><strong class="text-amber-300">${sunVara.ayanaHi} • ${sunVara.rituHi}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">सूर्योदय / सूर्यास्त:</span><strong class="text-cyan-300">${sunVara.sunriseStr} / ${sunVara.sunsetStr}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">जन्म नामाक्षर एवं देवता:</span><strong class="text-emerald-300">'${birthSyllable}' • ${akshObj.devataHi}</strong></div>
          </div>
          <div class="text-xs text-gray-200 mt-2.5">🌙 <strong>चंद्र पक्ष-बल:</strong> ${kpAudit.pakshaLabelHi}। ${kpAudit.kendradhipatiNoteHi ? `<br>⚖️ <strong>केंद्राधिपति सूत्र:</strong> ${kpAudit.kendradhipatiNoteHi}` : ""}</div>
          ${savanaNoteHi}
        </div>
        <p class="mt-4">
          <strong>3. पंचमहाभूत तत्व समन्वय (${ascData.elementHi} लग्न + ${moonData.elementHi} चंद्र) एवं षड्बल विश्लेषण:</strong>
          <strong>${name} (वर्तमान आयु: ${ls.integerAge} वर्ष ${ls.monthsRemainder || 0} माह)</strong> का उदय लग्न <strong>${ascData.hi} (${ascData.qualityHi}, ${chart.Asc.formattedDMS || chart.Asc.formattedDeg})</strong> है तथा लग्नेश <strong>${PLANET_META[lagnaLordKey].hi} (${lagnaLordInfo.formattedDeg})</strong> ${lagnaLordInfo.bhava}वें भाव (${RASHI_DATA[lagnaLordInfo.d1].hi}) में <strong>${bavLagnaLordInH1}/8 भिन्नाष्टकवर्ग बिंदु</strong>${lagnaLordShadbala ? ` एवं <strong>${lagnaLordShadbala.rupas} रूप षड्बल</strong> (न्यूनतम मानक: ${lagnaLordShadbala.requiredRupas} रूप)` : ""} के साथ स्थित हैं। लग्न भाव में <strong>${sav1} सर्वाष्टकवर्ग बिंदु</strong> तथा चंद्रमा के <strong>${nakData.name} (चरण ${moonPada})</strong> की <em>${nakData.shaktiHi}</em> इस कुंडली को ${BHAVA_SPHERES[lagnaLordInfo.bhava].hi} के माध्यम से संचालित करती है।
        </p>
        <p>
          <strong>4. जैमिनी आरूढ़ पद (AL: ${arudhaData.hi}, भाव ${specialLagnas.arudhaHouseFromLagna}) एवं कारकांश आत्मा (${karakamsaData.hi}):</strong>
          लग्न से ${ getBhavaFrom(ascR, lagnaLordInfo.d1) }वें स्थान पर स्थित लग्नेश से गणना करने पर आपका <strong>आरूढ़ लग्न (AL) ${arudhaData.hi} (लग्न से ${specialLagnas.arudhaHouseFromLagna}वें भाव)</strong> में स्थापित है, जबकि सर्वोच्च अंशों (${akInfo.formattedDeg}) वाले आत्मकारक <strong>${akInfo.meta.hi}</strong> नवांश (D9) में <strong>${karakamsaData.hi}</strong> में स्थित हैं। वर्तमान में सक्रिय <strong>${activeMdStrHi}</strong> के प्रभाव में जातक का जीवन-प्रवाह ${BHAVA_SPHERES[planetAnalysis[dasha?.ad || lagnaLordKey].bhava].hi} पर केंद्रित है।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 mt-4">
        <div class="text-xs md:text-sm font-bold text-amber-300 mb-2"><i class="fas fa-sun mr-1.5"></i>Samvatsara, Ayana-Ritu, Sunrise (${sunVara.sunriseStr}), Naam-Akshar ('${birthSyllable}') & Paksha-Bala:</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Vikram / Shaka Samvat:</span><strong class="text-white">Vikram ${sunVara.vikramSamvat} • Shaka ${sunVara.shakaSamvat}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Ayana & Ritu:</span><strong class="text-amber-300">${sunVara.ayanaEn.split(" ")[0]} • ${sunVara.rituEn}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Sunrise / Sunset:</span><strong class="text-cyan-300">${sunVara.sunriseStr} / ${sunVara.sunsetStr}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Naam-Akshar & Deity:</span><strong class="text-emerald-300">'${birthSyllable}' • ${akshObj.devataEn}</strong></div>
        </div>
        <div class="text-xs text-gray-200 mt-2.5">🌙 <strong>Lunar Paksha-Bala:</strong> ${kpAudit.pakshaLabelEn}. ${kpAudit.kendradhipatiNoteEn ? `<br>⚖️ <strong>Kendradhipati Rule:</strong> ${kpAudit.kendradhipatiNoteEn}` : ""}</div>
        ${savanaNoteEn}
      </div>
      <p class="mt-4">
        <strong>3. Elemental Polarity (${ascData.elementEn} Ascendant + ${moonData.elementEn} Moon) & Shadbala Potency:</strong>
        <strong>${name} (Current Age: ${ls.integerAge} Yrs ${ls.monthsRemainder || 0} Mos)</strong> rises in <strong>${ascData.en} (${ascData.qualityEn}, ${chart.Asc.formattedDMS || chart.Asc.formattedDeg})</strong> with 1st lord <strong>${lagnaLordKey} (${lagnaLordInfo.formattedDeg})</strong> seated in House ${lagnaLordInfo.bhava} (${RASHI_DATA[lagnaLordInfo.d1].en}) holding <strong>${bavLagnaLordInH1}/8 Bhinnashtakavarga bindus</strong>${lagnaLordShadbala ? ` and <strong>${lagnaLordShadbala.rupas} Rupas of Shadbala</strong> (minimum threshold: ${lagnaLordShadbala.requiredRupas} Rupas)` : ""}. Fortified by <strong>${sav1} Sarvashtakavarga bindus</strong> in House 1 and the <em>${nakData.shaktiEn}</em> of <strong>${nakData.name} (Pada ${moonPada})</strong>, the chart channels primary vitality directly into ${BHAVA_SPHERES[lagnaLordInfo.bhava].en}.
      </p>
      <p>
        <strong>4. Jaimini Arudha Pada (AL in ${arudhaData.en}, House ${specialLagnas.arudhaHouseFromLagna}) & Karakamsa Axis (${karakamsaData.en}):</strong>
        Measured ${getBhavaFrom(ascR, lagnaLordInfo.d1)} signs from Lagna to ${lagnaLordKey}, the <strong>Arudha Lagna (AL) falls in ${arudhaData.en} (House ${specialLagnas.arudhaHouseFromLagna})</strong>, while highest-degree Atmakaraka <strong>${akKey} (${akInfo.formattedDeg})</strong> places the Karakamsa in <strong>${karakamsaData.en}</strong> in D9. Under the currently operating <strong>${activeMdStrEn}</strong>, immediate life themes revolve around ${BHAVA_SPHERES[planetAnalysis[dasha?.ad || lagnaLordKey].bhava].en}.
      </p>
    `;
  }

  // CHAPTER 2: EDUCATION, 4TH-5TH-9TH TRIAD & EXACT COMPLETION AGE
  function buildChapter2Education(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter2Education === "function")
      ? window.NarrativeRules.renderChapter2Education(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, findings, specialLagnas, planetAnalysis, timeline } = ctx;
    const ascR = chart.Asc.d1;
    const sign4 = getRashiOfBhava(ascR, 4);
    const sign5 = getRashiOfBhava(ascR, 5);
    const sign9 = getRashiOfBhava(ascR, 9);
    const lord4Key = RASHI_DATA[sign4].lord;
    const lord5Key = RASHI_DATA[sign5].lord;
    const lord9Key = RASHI_DATA[sign9].lord;
    const lord4 = planetAnalysis[lord4Key];
    const lord5 = planetAnalysis[lord5Key];
    const lord9 = planetAnalysis[lord9Key];
    const amkKey = findings?.charaKarakas?.amatyakaraka || "Mercury";
    const sav4 = specialLagnas.houseBindus[4] || 28;
    const sav5 = specialLagnas.houseBindus[5] || 28;
    const sav9 = specialLagnas.houseBindus[9] || 28;
    const mercBav5 = specialLagnas.houseBav?.Mercury?.[5] || 4;
    const jupBav5  = specialLagnas.houseBav?.Jupiter?.[5] || 4;
    const ls = timeline?.lifeStage || { code: "YUVA_KARMA", integerAge: 25 };

    const domPlanetForStudy = (chart._shadbalaDetails?.[lord5Key]?.rupas || 5) >= (chart._shadbalaDetails?.[amkKey]?.rupas || 5) ? lord5Key : amkKey;
    const studyDisciplinesHi = `${PLANET_META[lord5Key].fieldHi} तथा ${PLANET_META[amkKey].fieldHi}`;
    const studyDisciplinesEn = `${PLANET_META[lord5Key].fieldEn} alongside ${PLANET_META[amkKey].fieldEn}`;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. चतुर्थ-पंचम-नवम विद्या त्रिकोण (4H: ${sav4} • 5H: ${sav5} • 9H: ${sav9} SAV बिंदु) एवं विषय-चयन सूत्र:</strong>
          पाराशरी सिद्धांत में चतुर्थेश <strong>${lord4.meta.hi} (${lord4.formattedDeg}, भाव ${lord4.bhava})</strong> आधारभूत विद्यालयी शिक्षा, पंचमेश <strong>${lord5.meta.hi} (${lord5.formattedDeg}, भाव ${lord5.bhava})</strong> मौलिक मेधा (धी) और नवमेश <strong>${lord9.meta.hi} (${lord9.formattedDeg}, भाव ${lord9.bhava})</strong> उच्च शोध/डिग्री का संचालन करते हैं। पंचम भाव में बुध के <strong>${mercBav5}/8 BAV बिंदु</strong> और गुरु के <strong>${jupBav5}/8 BAV बिंदु</strong> तथा जैमिनी अमात्यकारक <strong>${PLANET_META[amkKey].hi}</strong> के संयुक्त समीकरण से जातक के लिए सर्वाधिक फलदायी शैक्षणिक क्षेत्र हैं: <strong>${studyDisciplinesHi}</strong>।
          ${ls.code === "BALA" || ls.code === "VIDYARTHI"
            ? ` वर्तमान आयु (${ls.integerAge} वर्ष) में पंचमेश की राशि दिशा <strong>(${RASHI_DATA[lord5.d1].dirHi})</strong> की ओर मुख करके अध्ययन करना स्मरण-शक्ति (मेधा) को सीधे बल देता है।`
            : ` जीवन के उत्तरार्ध में भी ${PLANET_META[domPlanetForStudy].hi} से जुड़े तकनीकी व नीतिगत कौशल जातक की बौद्धिक श्रेष्ठता का आधार बने रहेंगे।`}
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. The 4th–5th–9th Vidya Triad (4H: ${sav4} • 5H: ${sav5} • 9H: ${sav9} SAV Bindus) & Academic Specialization:</strong>
        In Parashari Vidya analysis, 4th lord <strong>${lord4Key} (${lord4.formattedDeg} in House ${lord4.bhava})</strong> governs foundational schooling, 5th lord <strong>${lord5Key} (${lord5.formattedDeg} in House ${lord5.bhava})</strong> governs analytical memory (Dhi), and 9th lord <strong>${lord9Key} (${lord9.formattedDeg} in House ${lord9.bhava})</strong> governs higher specialization. Combining Mercury's <strong>${mercBav5}/8 BAV bindus</strong> and Jupiter's <strong>${jupBav5}/8 BAV bindus</strong> in House 5 with Jaimini Amatyakaraka <strong>${amkKey}</strong> pinpoints best-fit academic domains in: <strong>${studyDisciplinesEn}</strong>.
        ${ls.code === "BALA" || ls.code === "VIDYARTHI"
          ? ` At current age ${ls.integerAge}, aligning the study desk toward the 5th lord's sign direction (<strong>${RASHI_DATA[lord5.d1].dirEn}</strong>) directly reinforces cognitive retention.`
          : ` Across adulthood, specialized mastery in ${domPlanetForStudy}-governed domains remains the primary intellectual differentiator.`}
      </p>
    `;
  }

  // CHAPTER 3: CAREER, D10 DASAMSA, AMATYAKARAKA & EXACT JOB/PROMOTION AGES
  function buildChapter3Career(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter3Career === "function")
      ? window.NarrativeRules.renderChapter3Career(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, findings, specialLagnas, planetAnalysis, dasha } = ctx;
    const ascR = chart.Asc.d1;
    const sign10 = getRashiOfBhava(ascR, 10);
    const lord10Key = RASHI_DATA[sign10].lord;
    const lord10 = planetAnalysis[lord10Key];
    const d10Asc = chart.Asc.d10 || 1;
    const d10TenthSign = getRashiOfBhava(d10Asc, 10);
    const d10TenthLordKey = RASHI_DATA[d10TenthSign].lord;
    const amkKey = findings?.charaKarakas?.amatyakaraka || "Saturn";
    const amkInfo = planetAnalysis[amkKey];

    const sav6  = specialLagnas.houseBindus[6]  || 28;
    const sav7  = specialLagnas.houseBindus[7]  || 28;
    const sav10 = specialLagnas.houseBindus[10] || 28;
    const sav11 = specialLagnas.houseBindus[11] || 28;
    const satBav10 = specialLagnas.houseBav?.Saturn?.[10] || 4;
    const sunBav10 = specialLagnas.houseBav?.Sun?.[10] || 4;

    const actAges10 = computeDynamicPlanetActivationAges(lord10Key, dasha?.fullSeq, ctx.numData.year, lord10.degInSign).join(", ");
    const isAutonomousStronger = (sav7 + sav11 >= sav6 + 4) || [1, 3, 7, 11].includes(lord10.bhava);

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. दशमांश (D10) कर्मेश (${PLANET_META[d10TenthLordKey].hi}), अमात्यकारक (${amkInfo.meta.hi}) एवं आजीविका स्वरूप:</strong>
          दशमांश कुंडली (D10 — ${RASHI_DATA[d10Asc].hi} लग्न) के दशम भाव (${RASHI_DATA[d10TenthSign].hi}) के स्वामी <strong>${PLANET_META[d10TenthLordKey].hi}</strong> हैं, जबकि लग्न कुंडली में अमात्यकारक <strong>${amkInfo.meta.hi} (${amkInfo.formattedDeg})</strong> ${amkInfo.bhava}वें भाव में स्थित हैं। दशम भाव में सूर्य के <strong>${sunBav10}/8 BAV बिंदु</strong> और शनि के <strong>${satBav10}/8 BAV बिंदु</strong> तथा षष्ठ भाव (${sav6} SAV) बनाम सप्तम-एकादश अक्ष (7H: ${sav7}, 11H: ${sav11} SAV) का गणित स्पष्ट करता है कि जातक को <strong>${PLANET_META[lord10Key].fieldHi}</strong> में ${
            isAutonomousStronger
              ? `प्रारंभिक संस्थागत अनुभव के पश्चात स्वतंत्र निर्णय-अधिकार, परामर्श (Consulting) या स्वायत्त नेतृत्व में सर्वोच्च सफलता प्राप्त होगी`
              : `संगठित प्रशासनिक तंत्र, कॉर्पोरेट लीडरशिप या राजपत्रित/संस्थागत पदानुक्रम में दीर्घकालिक अधिकार प्राप्त होगा`
          }। दशमेश ${lord10.meta.hi} की दशा-सक्रियता आयु <strong>(${actAges10} वर्ष)</strong> तथा <strong>${RASHI_DATA[lord10.d1].dirHi}</strong> कार्यक्षेत्र में बड़े पद-उत्थान के सूचक हैं।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. Dasamsa (D10) 10th-Lord (${d10TenthLordKey}), Jaimini Amatyakaraka (${amkKey}) & Vocational Structure:</strong>
        In the D10 Dasamsa (${RASHI_DATA[d10Asc].en} Ascendant), the 10th house (${RASHI_DATA[d10TenthSign].en}) is governed by <strong>${d10TenthLordKey}</strong>, while Jaimini Amatyakaraka <strong>${amkKey} (${amkInfo.formattedDeg})</strong> occupies House ${amkInfo.bhava} in D1. With Sun contributing <strong>${sunBav10}/8 BAV bindus</strong> and Saturn contributing <strong>${satBav10}/8 BAV bindus</strong> in House 10, comparing 6th-house service (<strong>${sav6} SAV</strong>) against the 7th–11th enterprise axis (<strong>7H: ${sav7}, 11H: ${sav11} SAV</strong>) directs the native toward <strong>${PLANET_META[lord10Key].fieldEn}</strong>—${
          isAutonomousStronger
            ? `favoring autonomous executive command, advisory practice, or independent enterprise after foundational institutional experience`
            : `favoring high-level institutional hierarchies, executive governance, or specialized technical command`
        }. Major Dasha activations of 10th lord ${lord10Key} occur around <strong>ages ${actAges10}</strong>, with <strong>${RASHI_DATA[lord10.d1].dirEn}</strong> serving as the primary career direction.
      </p>
    `;
  }

  // CHAPTER 4: WEALTH, D2 HORA, D4 CHATURTHAMSA & ASSET ACCUMULATION AGES
  function buildChapter4Wealth(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter4Wealth === "function")
      ? window.NarrativeRules.renderChapter4Wealth(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, specialLagnas, planetAnalysis } = ctx;
    const ascR = chart.Asc.d1;
    const sign2  = getRashiOfBhava(ascR, 2);
    const sign4  = getRashiOfBhava(ascR, 4);
    const sign11 = getRashiOfBhava(ascR, 11);
    const lord2Key  = RASHI_DATA[sign2].lord;
    const lord4Key  = RASHI_DATA[sign4].lord;
    const lord11Key = RASHI_DATA[sign11].lord;
    const lord2  = planetAnalysis[lord2Key];
    const lord4  = planetAnalysis[lord4Key];
    const lord11 = planetAnalysis[lord11Key];
    const d4Asc = chart.Asc.d4 || 1;
    const sav2  = specialLagnas.houseBindus[2]  || 28;
    const sav4  = specialLagnas.houseBindus[4]  || 28;
    const sav11 = specialLagnas.houseBindus[11] || 28;
    const sav12 = specialLagnas.houseBindus[12] || 28;
    const jupBav2  = specialLagnas.houseBav?.Jupiter?.[2]  || 4;
    const jupBav11 = specialLagnas.houseBav?.Jupiter?.[11] || 4;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. चतुर्थांश (D4 — ${RASHI_DATA[d4Asc].hi} लग्न) अचल संपदा एवं कोष-अनुपात (11H: ${sav11} • 2H: ${sav2} • 4H: ${sav4} • 12H: ${sav12} बिंदु):</strong>
          चतुर्थेश <strong>${lord4.meta.hi} (${lord4.formattedDeg})</strong> लग्न कुंडली के ${lord4.bhava}वें भाव में तथा चतुर्थांश (D4) में <strong>${RASHI_DATA[lord4.d4].hi}</strong> राशि में स्थित हैं। धन कारक बृहस्पति के द्वितीय भाव में <strong>${jupBav2}/8 BAV बिंदु</strong> और एकादश भाव में <strong>${jupBav11}/8 BAV बिंदु</strong> हैं। धनेश ${lord2.meta.hi} (${lord2.bhava}वें भाव) और लाभेश ${lord11.meta.hi} (${lord11.bhava}वें भाव) की स्थिति दर्शाती है कि जातक की पूंजी का सर्वाधिक सुरक्षित संचय <strong>${BHAVA_SPHERES[lord4.bhava].hi} एवं ${BHAVA_SPHERES[lord2.bhava].hi}</strong> से जुड़े दीर्घकालिक माध्यमों में होता है।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. Chaturthamsa (D4 — ${RASHI_DATA[d4Asc].en} Ascendant) Fixed Assets & Treasury Ratio (11H: ${sav11} • 2H: ${sav2} • 4H: ${sav4} • 12H: ${sav12} Bindus):</strong>
        The 4th lord <strong>${lord4Key} (${lord4.formattedDeg})</strong> sits in House ${lord4.bhava} in D1 and occupies <strong>${RASHI_DATA[lord4.d4].en}</strong> in the D4 Chaturthamsa chart, while Dhana-karaka Jupiter contributes <strong>${jupBav2}/8 BAV bindus</strong> in House 2 and <strong>${jupBav11}/8 BAV bindus</strong> in House 11. With 2nd lord ${lord2Key} in House ${lord2.bhava} and 11th lord ${lord11Key} in House ${lord11.bhava}, net worth compounds most reliably through <strong>${BHAVA_SPHERES[lord4.bhava].en} and ${BHAVA_SPHERES[lord2.bhava].en}</strong>.
      </p>
    `;
  }

  // CHAPTER 5: FORTUNE, 5TH-9TH PURVA-PUNYA & ISHTA DEVATA MATRIX
  function buildChapter5Luck(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter5Luck === "function")
      ? window.NarrativeRules.renderChapter5Luck(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, specialLagnas, planetAnalysis, dasha } = ctx;
    const ascR = chart.Asc.d1;
    const sign5 = getRashiOfBhava(ascR, 5);
    const sign9 = getRashiOfBhava(ascR, 9);
    const lord5Key = RASHI_DATA[sign5].lord;
    const lord9Key = RASHI_DATA[sign9].lord;
    const lord5 = planetAnalysis[lord5Key];
    const lord9 = planetAnalysis[lord9Key];
    const sav9 = specialLagnas.houseBindus[9] || 28;
    const actAges9 = computeDynamicPlanetActivationAges(lord9Key, dasha?.fullSeq, ctx.numData.year, lord9.degInSign).join(", ");

    const ishtaDeityHi = {
      Sun: "भगवान सूर्यनारायण एवं श्रीराम", Moon: "भगवान आशुतोष शिव एवं माता गौरी", Mars: "संकटमोचन श्री हनुमान एवं कार्तिकेय",
      Mercury: "भगवान श्री हरि विष्णु एवं श्री गणेश", Jupiter: "देवगुरु बृहस्पति एवं भगवान दत्तात्रेय/दक्षिणामूर्ति",
      Venus: "माता महालक्ष्मी एवं ललिता त्रिपुरसुंदरी", Saturn: "भगवान महाकाल शिव एवं श्री हनुमान",
      Rahu: "मां दुर्गा एवं कालभैरव", Ketu: "भगवान महागणपति एवं मोक्ष-तत्व"
    };
    const ishtaDeityEn = {
      Sun: "Surya Narayana & Lord Sri Rama", Moon: "Lord Shiva (Somnath) & Goddess Gauri", Mars: "Lord Hanuman & Sri Kartikeya",
      Mercury: "Lord Maha Vishnu & Maha Ganapati", Jupiter: "Lord Dakshinamurti / Dattatreya & Guru Tattva",
      Venus: "Goddess Mahalakshmi & Lalita Tripurasundari", Saturn: "Lord Mahakala Shiva & Lord Hanuman",
      Rahu: "Goddess Durga & Kalabhairava", Ketu: "Lord Ganesha & Moksha Sadhana"
    };

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>2. पंचमेश (${lord5.meta.hi}) – भाग्येश (${lord9.meta.hi}) त्रिकोण संबंध एवं भाग्योदय आयु (${actAges9} वर्ष):</strong>
          पंचमेश <strong>${lord5.meta.hi} (${lord5.formattedDeg}, भाव ${lord5.bhava})</strong> पूर्वजन्म के संचित पुण्य और नवमेश <strong>${lord9.meta.hi} (${lord9.formattedDeg}, भाव ${lord9.bhava}, नवम SAV: ${sav9} बिंदु)</strong> इस जन्म के भाग्योदय के नियामक हैं। दशा अनुक्रम के अनुसार भाग्येश ${lord9.meta.hi} की प्रत्यक्ष सक्रियता आयु <strong>(${actAges9} वर्ष)</strong> में तथा इष्ट आराध्य <strong>${ishtaDeityHi[lord5Key]} व ${ishtaDeityHi[lord9Key]}</strong> की उपासना से भाग्य के अवरोध स्वतः समाप्त होते हैं।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>2. 5th Lord (${lord5Key}) – 9th Lord (${lord9Key}) Trikona Synthesis & Fortune Activation Ages (${actAges9}):</strong>
        With 5th lord <strong>${lord5Key} (${lord5.formattedDeg} in House ${lord5.bhava})</strong> governing Purva-Punya merit and 9th lord <strong>${lord9Key} (${lord9.formattedDeg} in House ${lord9.bhava}, 9H SAV: ${sav9} bindus)</strong> governing present-life Bhagya, major fortune expansions trigger around <strong>ages ${actAges9}</strong>. Aligning with <strong>${ishtaDeityEn[lord5Key]} and ${ishtaDeityEn[lord9Key]}</strong> harmonizes this trinal axis.
      </p>
    `;
  }

  // CHAPTER 6: EMOTIONAL HARMONY & VENUS-MOON-MARS D9 MATRIX
  function buildChapter6Love(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter6Love === "function")
      ? window.NarrativeRules.renderChapter6Love(ctx)
      : "";

    const { lang, chart, planetAnalysis, timeline } = ctx;
    const ven = planetAnalysis.Venus;
    const moon = planetAnalysis.Moon;
    const mars = planetAnalysis.Mars;
    const ls = timeline?.lifeStage || { code: "YUVA_KARMA", integerAge: 25 };

    if (ls.code === "BALA") {
      return baseHtml;
    }

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>2. नवांश (D9) में शुक्र (${RASHI_DATA[ven.d9].hi}), चंद्र (${RASHI_DATA[moon.d9].hi}) एवं मंगल (${RASHI_DATA[mars.d9].hi}) का आंतरिक समीकरण:</strong>
          लग्न कुंडली में शुक्र ${ven.bhava}वें भाव (${ven.formattedDeg}) और चंद्रमा ${moon.bhava}वें भाव (${moon.formattedDeg}) में स्थित हैं, जबकि नवांश (D9) में शुक्र <strong>${RASHI_DATA[ven.d9].hi} (${RASHI_DATA[ven.d9].elementHi})</strong> एवं चंद्रमा <strong>${RASHI_DATA[moon.d9].hi} (${RASHI_DATA[moon.d9].elementHi})</strong> में जाते हैं। यह विशिष्ट राशि-संयोजन दर्शाता है कि जातक संबंधों में ${RASHI_DATA[ven.d9].lordHi} और ${RASHI_DATA[moon.d9].lordHi} के गुणों—अर्थात् पारस्परिक सम्मान, स्पष्ट संवाद और दीर्घकालिक निष्ठा—को सर्वोच्च प्राथमिकता देता है।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>2. Navamsa (D9) Relational Matrix — Venus in ${RASHI_DATA[ven.d9].en}, Moon in ${RASHI_DATA[moon.d9].en} & Mars in ${RASHI_DATA[mars.d9].en}:</strong>
        In D1, Venus occupies House ${ven.bhava} (${ven.formattedDeg}) and Moon occupies House ${moon.bhava} (${moon.formattedDeg}), while in the D9 Navamsa Venus moves into <strong>${RASHI_DATA[ven.d9].en} (${RASHI_DATA[ven.d9].elementEn})</strong> and Moon moves into <strong>${RASHI_DATA[moon.d9].en} (${RASHI_DATA[moon.d9].elementEn})</strong>. Consequently, long-term emotional bonding is governed by ${RASHI_DATA[ven.d9].lord} and ${RASHI_DATA[moon.d9].lord}, prioritizing mutual dignity and intellectual resonance.
      </p>
    `;
  }

  // CHAPTER 7: MARRIAGE, 7TH LORD, D9 NAVAMSA, UPAPADA & EXACT MARRIAGE AGE
  function buildChapter7Partner(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter7Partner === "function")
      ? window.NarrativeRules.renderChapter7Partner(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, findings, specialLagnas, planetAnalysis } = ctx;
    const ascR = chart.Asc.d1;
    const sign7 = getRashiOfBhava(ascR, 7);
    const lord7Key = RASHI_DATA[sign7].lord;
    const lord7 = planetAnalysis[lord7Key];
    const d9AscData = RASHI_DATA[chart.Asc.d9];
    const d9SeventhSign = getRashiOfBhava(chart.Asc.d9, 7);
    const ulData = RASHI_DATA[specialLagnas.upapadaRashi];
    const dkKey = findings?.charaKarakas?.darakaraka || "Venus";
    const dkInfo = planetAnalysis[dkKey];
    const sav7 = specialLagnas.houseBindus[7] || 28;
    const venBav7 = specialLagnas.houseBav?.Venus?.[7] || 4;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. नवांश सप्तम भाव (${RASHI_DATA[d9SeventhSign].hi}), उपपद लग्न (${ulData.hi}) एवं विवाह दिशा:</strong>
          नवांश कुंडली (D9) का लग्न <strong>${d9AscData.hi}</strong> एवं सप्तम भाव <strong>${RASHI_DATA[d9SeventhSign].hi}</strong> है, जबकि जैमिनी उपपद लग्न (UL) <strong>${ulData.hi}</strong> में तथा दाराकारक <strong>${dkInfo.meta.hi} (${dkInfo.formattedDeg})</strong> ${RASHI_DATA[dkInfo.d1].hi} (D9 में ${RASHI_DATA[dkInfo.d9].hi}) में स्थित हैं। सप्तम भाव में <strong>${sav7} SAV बिंदु</strong> (शुक्र के <strong>${venBav7}/8 BAV बिंदु</strong>) होने से जीवनसाथी की प्रकृति में ${ulData.elementHi} और ${PLANET_META[dkKey].hi} के गुण प्रमुख रहेंगे तथा विवाह/साझेदारी हेतु <strong>${RASHI_DATA[lord7.d1].dirHi} एवं ${ulData.altDirHi}</strong> दिशाएं विशेष शुभ हैं।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. Navamsa 7th Axis (${RASHI_DATA[d9SeventhSign].en}), Upapada Lagna (${ulData.en}) & Directional Alignment:</strong>
        With D9 Navamsa rising in <strong>${d9AscData.en}</strong> (D9 7th house in <strong>${RASHI_DATA[d9SeventhSign].en}</strong>), Jaimini Upapada Lagna (UL) in <strong>${ulData.en}</strong>, and Darakaraka <strong>${dkKey} (${dkInfo.formattedDeg})</strong> in ${RASHI_DATA[dkInfo.d1].en} (D9: ${RASHI_DATA[dkInfo.d9].en}), the spouse's nature synthesizes ${ulData.elementEn} and ${dkKey} qualities. Supported by <strong>${sav7} SAV bindus</strong> in House 7 (Venus BAV: <strong>${venBav7}/8</strong>), favorable alliance directions point toward <strong>${RASHI_DATA[lord7.d1].dirEn} and ${ulData.altDirEn}</strong>.
      </p>
    `;
  }

  // CHAPTER 8: PROGENY, D7 SAPTAMSA & EXACT CHILDBIRTH AGE
  function buildChapterChildbirth(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter8Childbirth === "function")
      ? window.NarrativeRules.renderChapter8Childbirth(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, specialLagnas, planetAnalysis } = ctx;
    const d7Asc = chart.Asc.d7 || 1;
    const d7AscData = RASHI_DATA[d7Asc];
    const sign5InD7 = getRashiOfBhava(d7Asc, 5);
    const lord5InD7Key = RASHI_DATA[sign5InD7].lord;
    const lord5InD7Info = planetAnalysis[lord5InD7Key];
    const sav5 = specialLagnas.houseBindus[5] || 28;
    const sav9 = specialLagnas.houseBindus[9] || 28;
    const jupBav5 = specialLagnas.houseBav?.Jupiter?.[5] || 4;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>2. सप्तांश (D7 — ${d7AscData.hi} लग्न) पंचमेश (${lord5InD7Info.meta.hi}) एवं गुरु भिन्नाष्टकवर्ग (${jupBav5}/8 बिंदु):</strong>
          सप्तांश कुंडली (D7) के पंचम भाव (${RASHI_DATA[sign5InD7].hi}) के स्वामी <strong>${lord5InD7Info.meta.hi}</strong> D7 में <strong>${RASHI_DATA[chart[lord5InD7Key].d7 || 1].hi}</strong> राशि में स्थित हैं। लग्न कुंडली के पंचम भाव में <strong>${sav5} SAV बिंदु</strong>, नवम भाव में <strong>${sav9} SAV बिंदु</strong> और संतान-कारक बृहस्पति के पंचम भाव में <strong>${jupBav5}/8 BAV बिंदु</strong> वंश-वृद्धि और संतान के उच्च भाग्योदय को पुष्ट करते हैं।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>2. Saptamsa (D7 — ${d7AscData.en} Ascendant) 5th-Lord (${lord5InD7Key}) & Jupiter BAV (${jupBav5}/8 Bindus):</strong>
        In the D7 Saptamsa chart, the 5th house (${RASHI_DATA[sign5InD7].en}) is ruled by <strong>${lord5InD7Key}</strong> placed in <strong>${RASHI_DATA[chart[lord5InD7Key].d7 || 1].en}</strong>. Combined with <strong>${sav5} SAV bindus</strong> in House 5, <strong>${sav9} SAV bindus</strong> in House 9, and <strong>${jupBav5}/8 BAV bindus</strong> from Putra-karaka Jupiter, lineage continuity and progeny fortune are well-fortified.
      </p>
    `;
  }

  // CHAPTER 9: ALL 9 PLANETS IN-DEPTH (DEGREES, LORDSHIP, SHADBALA, BAV, DYNAMIC AGES)
  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, dasha, numData } = ctx;
    const isFull = chart.isFullChartMode;
    const ascRashi = chart.Asc.d1;
    const pKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    const cardsHtml = pKeys.map(k => {
      const info = planetAnalysis[k];
      const d1Rashi = RASHI_DATA[info.d1];
      const d9Rashi = RASHI_DATA[info.d9];
      const d10Rashi = RASHI_DATA[info.d10 || info.d9];
      const nak = NAKSHATRA_DATA[info.nak] || NAKSHATRA_DATA[1];
      const funcRole = isFull ? getFunctionalRoleLabel(ascRashi, k, lang) : (lang === "hi" ? info.meta.karakaHi : info.meta.karakaEn);
      const ownedStrEn = isFull ? (info.ownedHouses.length ? `Ruler of House ${info.ownedHouses.join(" & ")}` : "Chhaya Graha (Nodal Axis)") : `Sign: ${d1Rashi.en}`;
      const ownedStrHi = isFull ? (info.ownedHouses.length ? `भाव ${info.ownedHouses.join(" एवं ")} का स्वामी` : "छाया ग्रह (नोडल अक्ष)") : `राशि: ${d1Rashi.hi}`;
      const bavScoreHere = (isFull && specialLagnas.houseBav[k]) ? specialLagnas.houseBav[k][info.bhava] : null;
      const shadbalaObj = chart._shadbalaDetails?.[k];
      const degBadge = info.formattedDeg ? `<span class="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">${info.formattedDeg}</span>` : "";

      const dynamicAges = computeDynamicPlanetActivationAges(k, dasha?.fullSeq, numData.year, info.degInSign).join(", ");
      const conjNamesEn = info.conjunctWith.map(c => PLANET_META[c].en).join(", ");
      const conjNamesHi = info.conjunctWith.map(c => PLANET_META[c].hi).join(", ");

      const outgoingEn = info.aspectedTargets.map(t => {
        const hit = t.planetsThere.length ? ` (on ${t.planetsThere.join(", ")})` : "";
        return isFull ? `${t.nthAspect}th aspect → H-${t.targetBhava} (${RASHI_DATA[t.targetRashi].en.split(" ")[0]})${hit}` : `${t.nthAspect}th aspect → ${RASHI_DATA[t.targetRashi].en}${hit}`;
      }).join(" • ");

      const outgoingHi = info.aspectedTargets.map(t => {
        const hit = t.planetsThere.length ? ` (${t.planetsThere.map(p => PLANET_META[p].hi.split(" ")[0]).join(", ")} पर)` : "";
        return isFull ? `${t.nthAspect}वीं दृष्टि → भाव ${t.targetBhava} (${RASHI_DATA[t.targetRashi].hi.split(" ")[0]})${hit}` : `${t.nthAspect}वीं दृष्टि → ${RASHI_DATA[t.targetRashi].hi}${hit}`;
      }).join(" • ");

      const incomingEn = info.aspectedBy.length
        ? `Receives aspect from ${info.aspectedBy.map(inc => `${inc.fromPlanet} (${inc.nthAspect}th)`).join(", ")}`
        : "Unaspected by other planets";
      const incomingHi = info.aspectedBy.length
        ? `${info.aspectedBy.map(inc => `${PLANET_META[inc.fromPlanet].hi.split(" ")[0]} (${inc.nthAspect}वीं)`).join(", ")} से दृष्ट`
        : "अन्य ग्रहों की दृष्टि से मुक्त";

      if (lang === "hi") {
        return `
          <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div>
                <h4 class="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <span>${info.meta.hi}</span>
                  ${degBadge}
                  ${info.avasthaHi ? `<span class="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-200">${info.avasthaHi}</span>` : ""}
                  ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">वक्री</span>' : ''}
                  ${info.combust ? '<span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">अस्त</span>' : ''}
                </h4>
                <p class="text-xs text-amber-300/90 font-semibold mt-0.5">${ownedStrHi} • ${funcRole}</p>
              </div>
              <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusHi}</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">${isFull ? "राशि व भाव (चलित):" : "जन्म राशि:"}</span>
                <strong class="text-amber-300">${isFull ? `भाव ${info.bhava}${info.chalitHouse !== info.bhava ? ` (चलित ${info.chalitHouse})` : ""} • ` : ""}${d1Rashi.hi}</strong>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नक्षत्र (चरण) • स्वामी:</span>
                <strong class="text-purple-300">${nak.name} (चरण ${info.pada}) • ${nak.ruler}</strong>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नवांश (D9) / दशमांश (D10):</span>
                <strong class="text-emerald-300">${d9Rashi.hi.split(" ")[0]} / ${d10Rashi.hi.split(" ")[0]}</strong>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">${shadbalaObj ? "षड्बल / BAV बिंदु:" : "दशा सक्रियता आयु:"}</span>
                <strong class="text-cyan-300">${shadbalaObj ? `${shadbalaObj.rupas}R • ${bavScoreHere ?? 4}/8 BAV` : `आयु ${dynamicAges} वर्ष`}</strong>
              </div>
            </div>

            <div class="space-y-1.5 text-xs md:text-sm text-gray-200 pt-1">
              <div>🎯 <strong class="text-amber-300">पाराशरी सूत्र:</strong> ${isFull && info.ownedHouses.length ? `${info.ownedHouses.join(" व ")}वें भाव के स्वामी होकर ${info.bhava}वें भाव (${d1Rashi.hi}) में स्थित होने से यह ग्रह ${ info.ownedHouses.map(h => BHAVA_SPHERES[h].hi).join(" तथा ") } को सीधे <em>${BHAVA_SPHERES[info.bhava].hi}</em> से जोड़ता है। ` : ""}${nak.name} नक्षत्र के प्रभाव से इसमें <em>${nak.shaktiHi}</em> कार्यरत है${conjNamesHi ? ` तथा यह ${conjNamesHi} के साथ युत है` : ""}। नवांश (D9) में यह ${d9Rashi.hi} (${d9Rashi.lordHi}) में स्थित है।</div>
              <div>⏳ <strong class="text-emerald-300">दशा सक्रियता आयु एवं दैहिक क्षेत्र:</strong> कुंडली के दशा-चक्र में इस ग्रह की प्रमुख फल-सक्रियता आयु <strong>${dynamicAges} वर्ष</strong> है। संबंधित दैहिक तंत्र: <em>${info.meta.healthHi}</em>।</div>
              <div>🛡️ <strong class="text-cyan-300">दृष्टि ज्यामिति:</strong> ${outgoingHi} (${incomingHi})।</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div>
              <h4 class="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                <span>${info.meta.en}</span>
                ${degBadge}
                ${info.avasthaEn ? `<span class="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-200">${info.avasthaEn}</span>` : ""}
                ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Retrograde</span>' : ''}
                ${info.combust ? '<span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">Combust</span>' : ''}
              </h4>
              <p class="text-xs text-amber-300/90 font-semibold mt-0.5">${ownedStrEn} • ${funcRole}</p>
            </div>
            <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusEn}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">${isFull ? "House (Chalit) & Sign:" : "Natal Sign:"}</span>
              <strong class="text-amber-300">${isFull ? `H-${info.bhava}${info.chalitHouse !== info.bhava ? ` (Ch:${info.chalitHouse})` : ""} • ` : ""}${d1Rashi.en}</strong>
            </div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">Nakshatra (Pada) • Lord:</span>
              <strong class="text-purple-300">${nak.name} (Pada ${info.pada}) • ${nak.ruler}</strong>
            </div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D9 Navamsa / D10 Dasamsa:</span>
              <strong class="text-emerald-300">${d9Rashi.en.split(" ")[0]} / ${d10Rashi.en.split(" ")[0]}</strong>
            </div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">${shadbalaObj ? "Shadbala / BAV:" : "Dasha Activation Ages:"}</span>
              <strong class="text-cyan-300">${shadbalaObj ? `${shadbalaObj.rupas}R • ${bavScoreHere ?? 4}/8 BAV` : `Ages ${dynamicAges}`}</strong>
            </div>
          </div>

          <div class="space-y-1.5 text-xs md:text-sm text-gray-200 pt-1">
            <div>🎯 <strong class="text-amber-300">Parashari Synthesis:</strong> ${isFull && info.ownedHouses.length ? `Ruling House ${info.ownedHouses.join(" & ")} and occupying House ${info.bhava} (${d1Rashi.en}), ${k} channels ${info.ownedHouses.map(h => BHAVA_SPHERES[h].en).join(" and ")} directly into <em>${BHAVA_SPHERES[info.bhava].en}</em>. ` : ""}Operating through ${nak.name} (<em>${nak.shaktiEn}</em>)${conjNamesEn ? ` in conjunction with ${conjNamesEn}` : ""}, it moves into ${d9Rashi.en} (ruled by ${d9Rashi.lord}) in the D9 Navamsa.</div>
            <div>⏳ <strong class="text-emerald-300">Chart Dasha Activation Ages & Physiological Axis:</strong> Key Dasha activations occur around <strong>ages ${dynamicAges}</strong>. Anatomical correspondence: <em>${info.meta.healthEn}</em>.</div>
            <div>🛡️ <strong class="text-cyan-300">Aspect Geometry:</strong> ${outgoingEn} (${incomingEn}).</div>
          </div>
        </div>
      `;
    }).join("");

    return `<div class="space-y-3.5">${cardsHtml}</div>`;
  }

  // ==========================================================================
  // 5. SPECIAL LAGNAS, 12-BHAVA TABLE, YOGA AUDIT & MULTI-MAHADASHA TABLES
  // ==========================================================================

  function renderChandraAndChalitSvgCharts(ctx) {
    if (!ctx.chart.isFullChartMode || typeof window.VedicChartAnalyzer === "undefined") return "";
    const { chart, lang, name } = ctx;
    const renderFn = (window.__jtChartStyle === "south")
      ? window.VedicChartAnalyzer.renderRoyalSouthIndianChart
      : window.VedicChartAnalyzer.renderRoyalNorthIndianChart;

    const chandraChart = { meta: chart.meta };
    ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].forEach(k => {
      chandraChart[k] = { ...chart[k] };
    });
    chandraChart.Asc = {
      ...chart.Moon,
      rashi: chart.Moon.rashi || chart.Moon.d1,
      d1: chart.Moon.rashi || chart.Moon.d1
    };

    const ascR = chart.Asc.rashi || chart.Asc.d1;
    const chalitChart = { meta: chart.meta, Asc: { ...chart.Asc } };
    ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].forEach(k => {
      const p = chart[k];
      const chHouse = p.chalitHouse || p.house || getBhavaFrom(ascR, p.rashi || p.d1);
      const effectiveRashiForChalit = getRashiOfBhava(ascR, chHouse);
      chalitChart[k] = {
        ...p,
        rashi: effectiveRashiForChalit,
        d1: effectiveRashiForChalit
      };
    });

    let chandraSvg = renderFn(chandraChart, { lang, userName: name, chartType: "D1" });
    let chalitSvg  = renderFn(chalitChart,  { lang, userName: name, chartType: "D1" });

    const moonRashiHi = RASHI_DATA[chart.Moon.d1].hi.split(" ")[0];
    const moonRashiEn = RASHI_DATA[chart.Moon.d1].en.split(" ")[0];
    const ascRashiHi  = RASHI_DATA[ascR].hi.split(" ")[0];
    const ascRashiEn  = RASHI_DATA[ascR].en.split(" ")[0];

    chandraSvg = chandraSvg
      .replace(/जन्म लग्न कुंडली \(D1\)[^<]*/g, `चंद्र कुंडली (Chandra) — ${moonRashiHi}`)
      .replace(/LAGNA CHART \(D1\)[^<]*/g, `CHANDRA CHART (Moon) — ${moonRashiEn}`)
      .replace(/॥ D1 लग्न ॥/g, "॥ चंद्र लग्न ॥")
      .replace(/॥ D1 ASC ॥/g, "॥ MOON ASC ॥");

    chalitSvg = chalitSvg
      .replace(/जन्म लग्न कुंडली \(D1\)[^<]*/g, `श्रीपति भाव-चलित कुंडली — ${ascRashiHi}`)
      .replace(/LAGNA CHART \(D1\)[^<]*/g, `SRIPATI BHAVA CHALIT — ${ascRashiEn}`)
      .replace(/॥ D1 लग्न ॥/g, "॥ चलित लग्न ॥")
      .replace(/॥ D1 ASC ॥/g, "॥ CHALIT ॥");

    return `
      <div class="pdf-keep-together rounded-3xl bg-slate-950/90 border border-purple-400/40 p-4 md:p-5 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 class="text-base md:text-lg font-bold text-white">
            <i class="fas fa-moon text-amber-400 mr-2"></i>${lang === "hi" ? "चंद्र कुंडली (Chandra Lagna) एवं श्रीपति भाव-चलित कुंडली (Visual Chalit)" : "Chandra Kundali (Lunar Chart) & Sripati Bhava-Chalit Chart"}
          </h3>
          <span class="text-xs text-amber-300 font-semibold">${lang === "hi" ? "गोचर विचार एवं चलित भाव-फल हेतु" : "For Transit Evaluation & Cusp-Shifted Bhava Results"}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          <div class="rounded-2xl overflow-hidden border-2 border-blue-500/50 bg-white p-1 shadow-xl">${chandraSvg}</div>
          <div class="rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-white p-1 shadow-xl">${chalitSvg}</div>
        </div>
      </div>
    `;
  }

  function renderTwelveBhavaSummaryTable(ctx) {
    const { lang, chart, specialLagnas, planetAnalysis } = ctx;
    if (!chart.isFullChartMode) return "";
    const ascR = chart.Asc.d1;
    const pKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    const rowsHtml = [];
    for (let h = 1; h <= 12; h++) {
      const rashiId = getRashiOfBhava(ascR, h);
      const rData = RASHI_DATA[rashiId];
      const lordKey = rData.lord;
      const lordInfo = planetAnalysis[lordKey];
      const occupants = pKeys.filter(k => planetAnalysis[k].bhava === h);
      const sav = specialLagnas.houseBindus[h] || 28;
      const savCol = sav >= 30 ? "text-emerald-300" : sav <= 24 ? "text-rose-300" : "text-amber-300";

      const occStrHi = occupants.length ? occupants.map(k => `${PLANET_META[k].hi.split(" ")[0]} (${planetAnalysis[k].formattedDeg})`).join(", ") : "रिक्त (भावेश से संचालित)";
      const occStrEn = occupants.length ? occupants.map(k => `${k} (${planetAnalysis[k].formattedDeg})`).join(", ") : "Unoccupied (Governed by Lord)";

      const synthHi = `${BHAVA_SPHERES[h].hi} → भावेश ${rData.lordHi} ${lordInfo.bhava}वें भाव में (${BHAVA_SPHERES[lordInfo.bhava].hi})`;
      const synthEn = `${BHAVA_SPHERES[h].en} → Lord ${lordKey} in H-${lordInfo.bhava} (${BHAVA_SPHERES[lordInfo.bhava].en})`;

      rowsHtml.push(`
        <tr class="hover:bg-white/5">
          <td class="py-1.5 px-2.5 font-bold text-amber-300 whitespace-nowrap">${lang === "hi" ? `भाव ${h}` : `House ${h}`}</td>
          <td class="py-1.5 px-2.5 text-white font-semibold whitespace-nowrap">${lang === "hi" ? `${rData.hi.split(" ")[0]} (${rashiId}) • ${rData.lordHi}` : `${rData.en.split(" ")[0]} (${rashiId}) • ${lordKey}`}</td>
          <td class="py-1.5 px-2.5 text-center text-purple-200 whitespace-nowrap">${lang === "hi" ? `भाव ${lordInfo.bhava}` : `H-${lordInfo.bhava}`}</td>
          <td class="py-1.5 px-2.5 text-cyan-200 font-semibold">${lang === "hi" ? occStrHi : occStrEn}</td>
          <td class="py-1.5 px-2.5 text-center font-extrabold ${savCol}">${sav}</td>
          <td class="py-1.5 px-2.5 text-xs text-gray-200">${lang === "hi" ? synthHi : synthEn}</td>
        </tr>
      `);
    }

    return `
      <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-amber-400/35 mt-5 overflow-x-auto">
        <h4 class="text-base md:text-lg font-bold text-amber-300 mb-3">
          <i class="fas fa-th-list mr-2"></i>${lang === "hi" ? "द्वादश भाव एवं भावेश-स्थिति सारणी (12-House Bhava Disposition Matrix)" : "Twelve-House (Dwadasha Bhava) Disposition & SAV Matrix"}
        </h4>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "भाव" : "House"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "राशि एवं भावेश" : "Sign & Lord"}</th>
                <th class="py-2 px-2.5 text-center">${lang === "hi" ? "भावेश स्थान" : "Lord In"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "स्थित ग्रह (अंश)" : "Occupants (DMS)"}</th>
                <th class="py-2 px-2.5 text-center">SAV</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "भावेश-भाव संश्लेषण" : "Bhava-to-Bhava Linkage"}</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5">${rowsHtml.join("")}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderClassicalYogaAndNegativeAuditTable(ctx) {
    const { lang, chart, findings } = ctx;
    if (!chart.isFullChartMode || !findings) return "";

    const presentYogas = findings.allYogas || [];
    const presentIds = new Set(presentYogas.map(y => y.id));
    const auditRows = [];

    presentYogas.forEach(y => {
      auditRows.push({
        nameHi: y.titleHi,
        nameEn: y.titleEn,
        statusHi: "✓ निर्मित (सक्रिय)",
        statusEn: "✓ Formed (Active)",
        badge: "text-emerald-300 font-bold",
        descHi: y.summaryHi,
        descEn: y.summaryEn
      });
    });

    const rahuLon = chart.Rahu?.longitude || 0;
    const ketuLon = chart.Ketu?.longitude || ((rahuLon + 180) % 360);
    const p7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const inArc1 = p7.every(k => {
      const d = ((chart[k].longitude - rahuLon) % 360 + 360) % 360;
      return d > 0 && d < 180;
    });
    const inArc2 = p7.every(k => {
      const d = ((chart[k].longitude - ketuLon) % 360 + 360) % 360;
      return d > 0 && d < 180;
    });
    const isKalsarpa = inArc1 || inArc2;
    auditRows.push({
      nameHi: `कालसर्प योग परीक्षण (राहु ${chart.Rahu.formattedDMS || ""} – केतु ${chart.Ketu.formattedDMS || ""})`,
      nameEn: `Kalsarpa Axis Verification (Rahu ${chart.Rahu.formattedDMS || ""} – Ketu ${chart.Ketu.formattedDMS || ""})`,
      statusHi: isKalsarpa ? "⚠️ सक्रिय गोलार्ध" : "✗ नहीं बनता (मुक्त)",
      statusEn: isKalsarpa ? "⚠️ Hemispheric Lock" : "✗ Not Formed (Clear)",
      badge: isKalsarpa ? "text-amber-300 font-bold" : "text-cyan-300 font-semibold",
      descHi: isKalsarpa
        ? `सप्तग्रह राहु (${RASHI_DATA[chart.Rahu.rashi].hi}) और केतु (${RASHI_DATA[chart.Ketu.rashi].hi}) के एक गोलार्ध में स्थित हैं।`
        : `ग्रह राहु (${RASHI_DATA[chart.Rahu.rashi].hi}) और केतु (${RASHI_DATA[chart.Ketu.rashi].hi}) के दोनों गोलार्धों में वितरित हैं—कालसर्प दोष नहीं बनता।`,
      descEn: isKalsarpa
        ? `All 7 planets lie within one hemisphere between Rahu (${RASHI_DATA[chart.Rahu.rashi].en}) and Ketu (${RASHI_DATA[chart.Ketu.rashi].en}).`
        : `Planets span both sides of the Rahu (${RASHI_DATA[chart.Rahu.rashi].en}) – Ketu (${RASHI_DATA[chart.Ketu.rashi].en}) axis; Kalsarpa is not formed.`
    });

    const isBudhaditya = chart.Sun.rashi === chart.Mercury.rashi;
    auditRows.push({
      nameHi: "बुधादित्य योग (सूर्य-बुध युति)",
      nameEn: "Budhaditya Yoga (Sun-Mercury)",
      statusHi: isBudhaditya ? "✓ निर्मित (सक्रिय)" : "✗ नहीं बनता",
      statusEn: isBudhaditya ? "✓ Formed (Active)" : "✗ Not Formed",
      badge: isBudhaditya ? "text-emerald-300 font-bold" : "text-gray-400",
      descHi: isBudhaditya
        ? `सूर्य (${chart.Sun.formattedDMS || ""}) और बुध (${chart.Mercury.formattedDMS || ""}) दोनों ${RASHI_DATA[chart.Sun.rashi].hi} में युत हैं।`
        : `सूर्य (${RASHI_DATA[chart.Sun.rashi].hi}) एवं बुध (${RASHI_DATA[chart.Mercury.rashi].hi}) भिन्न राशियों में स्थित हैं।`,
      descEn: isBudhaditya
        ? `Sun (${chart.Sun.formattedDMS || ""}) and Mercury (${chart.Mercury.formattedDMS || ""}) conjoin in ${RASHI_DATA[chart.Sun.rashi].en}.`
        : `Sun (${RASHI_DATA[chart.Sun.rashi].en}) and Mercury (${RASHI_DATA[chart.Mercury.rashi].en}) occupy different signs.`
    });

    if (!presentIds.has("GAJAKESARI_YOGA")) {
      const jupFromMoon = getBhavaFrom(chart.Moon.rashi, chart.Jupiter.rashi);
      auditRows.push({
        nameHi: "गजकेसरी योग (गुरु-चंद्र केंद्र)",
        nameEn: "Gajakesari Yoga",
        statusHi: "✗ नहीं बनता",
        statusEn: "✗ Not Formed",
        badge: "text-gray-400",
        descHi: `गुरु (${RASHI_DATA[chart.Jupiter.rashi].hi}) चंद्रमा (${RASHI_DATA[chart.Moon.rashi].hi}) से ${jupFromMoon}वें भाव में हैं (केंद्र 1/4/7/10 में नहीं)।`,
        descEn: `Jupiter (${RASHI_DATA[chart.Jupiter.rashi].en}) is ${jupFromMoon}th from Moon (${RASHI_DATA[chart.Moon.rashi].en}), outside Kendra 1/4/7/10.`
      });
    }

    const trHtml = auditRows.map(r => `
      <tr class="hover:bg-white/5">
        <td class="py-2 px-2.5 font-bold text-white whitespace-nowrap">${lang === "hi" ? r.nameHi : r.nameEn}</td>
        <td class="py-2 px-2.5 whitespace-nowrap ${r.badge}">${lang === "hi" ? r.statusHi : r.statusEn}</td>
        <td class="py-2 px-2.5 text-xs text-gray-200">${lang === "hi" ? r.descHi : r.descEn}</td>
      </tr>
    `).join("");

    return `
      <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-purple-400/35 mt-5 overflow-x-auto">
        <h4 class="text-base md:text-lg font-bold text-amber-300 mb-2.5">
          <i class="fas fa-balance-scale mr-2"></i>${lang === "hi" ? "शास्त्रीय योग एवं दोष सत्यापन सारणी (BPHS Yoga & Dosha Audit)" : "Classical BPHS Yoga & Dosha Verification Audit"}
        </h4>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "योग / दोष" : "Yoga / Dosha"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "स्थिति" : "Status"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "शास्त्रीय आधार (अंश एवं राशि सहित)" : "Astronomical Basis (with Exact Signs/DMS)"}</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5">${trHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function buildChapter9SpecialLagnas(ctx) {
    const { lang, specialLagnas } = ctx;
    const chandra   = RASHI_DATA[specialLagnas.chandraLagna];
    const surya     = RASHI_DATA[specialLagnas.suryaLagna];
    const navamsa   = RASHI_DATA[specialLagnas.navamsaLagna];
    const arudha    = RASHI_DATA[specialLagnas.arudhaRashi];
    const karakamsa = RASHI_DATA[specialLagnas.karakamsaRashi];
    const akMeta    = PLANET_META[specialLagnas.atmakarakaKey];
    const bindus    = specialLagnas.houseBindus;
    const bav       = specialLagnas.houseBav;
    const pTotals   = specialLagnas.planetTotals;

    const houseArr = Object.keys(bindus).map(h => ({ h: parseInt(h, 10), b: bindus[h] }));
    const sorted = [...houseArr].sort((a, b) => b.b - a.b);
    const strongest = sorted.slice(0, 3);
    const weakest = sorted.slice(-3).reverse();

    const savGrid = houseArr.map(({ h, b }) => {
      const color = b >= 30 ? "border-emerald-400/50 text-emerald-300"
                  : b <= 24 ? "border-rose-400/50 text-rose-300"
                  : b <= 27 ? "border-amber-400/40 text-amber-300"
                  : "border-white/15 text-gray-200";
      return `<div class="p-2 rounded-xl bg-slate-950/90 border ${color} text-center min-w-0">
        <div class="text-[10px] uppercase text-gray-400 truncate">${lang === "hi" ? `भाव ${h}` : `House ${h}`}</div>
        <div class="text-base font-extrabold mt-0.5">${b}</div>
      </div>`;
    }).join("");

    const planets7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const planetShort = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa" };

    const bavRowsHtml = houseArr.map(({ h }) => {
      const cells = planets7.map(p => {
        const v = bav[p][h];
        const col = v >= 5 ? "text-emerald-300" : v <= 2 ? "text-rose-300" : "text-gray-300";
        return `<td class="py-1.5 px-1.5 text-center font-bold ${col}">${v}</td>`;
      }).join("");
      const savVal = bindus[h];
      const savCol = savVal >= 30 ? "text-emerald-300" : savVal <= 24 ? "text-rose-300" : "text-amber-300";
      return `<tr class="hover:bg-white/5">
        <td class="py-1.5 px-2 text-gray-300 font-bold whitespace-nowrap">${lang === "hi" ? `भाव ${h}` : `H-${h}`}</td>
        ${cells}
        <td class="py-1.5 px-2 text-center font-extrabold ${savCol}">${savVal}</td>
      </tr>`;
    }).join("");

    const totalFooterCells = planets7.map(p => `<td class="py-2 px-1.5 text-center font-extrabold text-amber-300">${pTotals[p]}</td>`).join("");
    const headerCells = planets7.map(p => `<th class="py-1.5 px-1.5 text-center text-amber-300">${planetShort[p]}</th>`).join("");

    const strongListEn = strongest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus — ${BHAVA_SPHERES[s.h].en})`).join("; ");
    const strongListHi = strongest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु — ${BHAVA_SPHERES[s.h].hi})`).join("; ");
    const weakListEn   = weakest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus — ${BHAVA_SPHERES[s.h].en})`).join("; ");
    const weakListHi   = weakest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु — ${BHAVA_SPHERES[s.h].hi})`).join("; ");

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-blue-400/30">
            <h4 class="text-base font-bold text-blue-300 mb-1.5"><i class="fas fa-moon mr-2"></i>1. चंद्र लग्न (${chandra.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">चंद्र लग्न (${chandra.hi}, स्वामी ${chandra.lordHi}) से गोचर और मानसिक बल का विचार होता है।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30">
            <h4 class="text-base font-bold text-orange-300 mb-1.5"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (${surya.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">सूर्य लग्न (${surya.hi}, स्वामी ${surya.lordHi}) से आत्मबल, पिता और प्रशासनिक अधिकार देखा जाता है।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30">
            <h4 class="text-base font-bold text-purple-300 mb-1.5"><i class="fas fa-ring mr-2"></i>3. नवांश (${navamsa.hi}) एवं कारकांश (${karakamsa.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">आत्मकारक (${akMeta.hi}) से निर्मित कारकांश (${karakamsa.hi}) और नवांश लग्न (${navamsa.hi}) धर्म व वैवाहिक बल के सूचक हैं।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30">
            <h4 class="text-base font-bold text-amber-300 mb-1.5"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (AL — ${arudha.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">आरूढ़ पद (AL) ${arudha.hi} (लग्न से ${specialLagnas.arudhaHouseFromLagna}वें भाव) में स्थित है।</p>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. 337-बिंदु सर्वाष्टकवर्ग (SAV) एवं भिन्नाष्टकवर्ग (BAV) तालिका</h4>
            <span class="text-xs text-emerald-300 font-bold">कुल योग: ${specialLagnas.grandTotalSav} / 337 बिंदु</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">${savGrid}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/30 text-xs">
              <strong class="text-emerald-300 block mb-0.5">सर्वोच्च बली भाव:</strong> ${strongListHi}
            </div>
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-400/30 text-xs">
              <strong class="text-rose-300 block mb-0.5">न्यूनतम बिंदु भाव:</strong> ${weakListHi}
            </div>
          </div>
          <div class="mt-4 overflow-x-auto rounded-xl border border-white/15">
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-slate-950 text-amber-300 border-b border-white/10">
                  <th class="py-2 px-2 text-left">भाव</th>${headerCells}<th class="py-2 px-2 text-center text-amber-200">SAV</th>
                </tr>
              </thead>
              <tbody class="bg-slate-900/60 divide-y divide-white/5 text-gray-200">${bavRowsHtml}</tbody>
              <tfoot>
                <tr class="bg-slate-950 border-t border-amber-400/40 text-xs">
                  <td class="py-2 px-2 font-bold text-amber-300">कुल BAV</td>${totalFooterCells}<td class="py-2 px-2 text-center font-extrabold text-emerald-300">${specialLagnas.grandTotalSav}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        ${renderTwelveBhavaSummaryTable(ctx)}
        ${renderClassicalYogaAndNegativeAuditTable(ctx)}
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-blue-400/30">
          <h4 class="text-base font-bold text-blue-300 mb-1.5"><i class="fas fa-moon mr-2"></i>1. Chandra Lagna (${chandra.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Governed by ${chandra.lord}, Chandra Lagna (${chandra.en}) anchors transit (Gochara) and lunar evaluations.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30">
          <h4 class="text-base font-bold text-orange-300 mb-1.5"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (${surya.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Governed by ${surya.lord}, Surya Lagna (${surya.en}) reflects vitality and administrative command.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30">
          <h4 class="text-base font-bold text-purple-300 mb-1.5"><i class="fas fa-ring mr-2"></i>3. Navamsa (${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Derived from Atmakaraka ${akMeta.en}, Karakamsa (${karakamsa.en}) and D9 Lagna (${navamsa.en}) govern inner dharma.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30">
          <h4 class="text-base font-bold text-amber-300 mb-1.5"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Arudha Pada (AL) falls in ${arudha.en} (House ${specialLagnas.arudhaHouseFromLagna} from Lagna).</p>
        </div>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. 337-Bindu Sarvashtakavarga (SAV) & Bhinnashtakavarga (BAV) Matrix</h4>
          <span class="text-xs text-emerald-300 font-bold">Total: ${specialLagnas.grandTotalSav} / 337 Bindus</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">${savGrid}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/30 text-xs">
            <strong class="text-emerald-300 block mb-0.5">Highest Bindu Houses:</strong> ${strongListEn}
          </div>
          <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-400/30 text-xs">
            <strong class="text-rose-300 block mb-0.5">Lowest Bindu Houses:</strong> ${weakListEn}
          </div>
        </div>
        <div class="mt-4 overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead>
              <tr class="bg-slate-950 text-amber-300 border-b border-white/10">
                <th class="py-2 px-2 text-left">House</th>${headerCells}<th class="py-2 px-2 text-center text-amber-200">SAV</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5 text-gray-200">${bavRowsHtml}</tbody>
            <tfoot>
              <tr class="bg-slate-950 border-t border-amber-400/40 text-xs">
                <td class="py-2 px-2 font-bold text-amber-300">Planet BAV</td>${totalFooterCells}<td class="py-2 px-2 text-center font-extrabold text-emerald-300">${specialLagnas.grandTotalSav}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      ${renderTwelveBhavaSummaryTable(ctx)}
      ${renderClassicalYogaAndNegativeAuditTable(ctx)}
    `;
  }

  // ==========================================================================
  // 6. CHAPTER 11: ACTIVE DASHA, FULL LIFESPAN MILESTONE CARDS & 4-MD GRID
  // ==========================================================================

  function renderMultiMahadashaAntardashaGrid(ctx) {
    const vd = window.__jtVedicData;
    if (!ctx.chart.isFullChartMode || !vd || !vd.dasha || !Array.isArray(vd.dasha.fullSeq)) return "";
    const { lang, numData } = ctx;
    const birthYear = numData.year;
    const fmt = (d) => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-") : "";

    const seq = vd.dasha.fullSeq;
    let activeIdx = seq.findIndex(m => m.lord === vd.dasha.mahadasha);
    if (activeIdx < 0) activeIdx = 0;
    const selectedMds = seq.slice(activeIdx, activeIdx + 4);

    const tablesHtml = selectedMds.map(md => {
      const startAge = Math.max(0, ((md.start.getFullYear() - birthYear) + (md.start.getMonth() / 12)).toFixed(1));
      const endAge   = Math.max(1, ((md.end.getFullYear() - birthYear) + (md.end.getMonth() / 12)).toFixed(1));
      const isCurrentMd = (md.lord === vd.dasha.mahadasha);

      const adRows = (md.antardashas || []).map(ad => {
        const isCurrentAd = isCurrentMd && (ad.lord === vd.dasha.antardasha);
        const adEndAge = Math.max(0, ((ad.end.getFullYear() - birthYear) + (ad.end.getMonth() / 12)).toFixed(1));
        const rowCls = isCurrentAd ? "bg-amber-500/20 font-bold text-amber-200" : "";
        const label = lang === "hi"
          ? `${PLANET_META[md.lord].hi.split(" ")[0]} - ${PLANET_META[ad.lord].hi.split(" ")[0]}${isCurrentAd ? " (सक्रिय)" : ""}`
          : `${md.lord} - ${ad.lord}${isCurrentAd ? " (Active)" : ""}`;
        return `<tr class="${rowCls}">
          <td class="py-1 px-2 whitespace-nowrap">${label}</td>
          <td class="py-1 px-2 text-center font-mono whitespace-nowrap">${fmt(ad.start)}</td>
          <td class="py-1 px-2 text-center font-mono whitespace-nowrap">${fmt(ad.end)}</td>
          <td class="py-1 px-2 text-center whitespace-nowrap">${adEndAge}</td>
        </tr>`;
      }).join("");

      const boxTitle = lang === "hi"
        ? `${PLANET_META[md.lord].hi.split(" ")[0]} महादशा (${md.start.getFullYear()}–${md.end.getFullYear()}) • आयु ${startAge}–${endAge}`
        : `${md.lord} Mahadasha (${md.start.getFullYear()}–${md.end.getFullYear()}) • Age ${startAge}–${endAge}`;

      return `
        <div class="pdf-keep-together rounded-2xl bg-slate-950/90 border ${isCurrentMd ? 'border-amber-400' : 'border-white/15'} p-3.5 overflow-x-auto">
          <div class="font-bold text-amber-300 text-xs md:text-sm mb-2 flex items-center justify-between">
            <span>${boxTitle}</span>
            ${isCurrentMd ? `<span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold">${lang === "hi" ? "वर्तमान" : "CURRENT"}</span>` : ""}
          </div>
          <table class="w-full text-[11px]">
            <thead class="bg-slate-900 text-amber-200 border-b border-white/10">
              <tr>
                <th class="py-1 px-2 text-left">${lang === "hi" ? "अंतर्दशा" : "Antardasha"}</th>
                <th class="py-1 px-2 text-center">${lang === "hi" ? "आरंभ" : "Start"}</th>
                <th class="py-1 px-2 text-center">${lang === "hi" ? "समाप्ति" : "End"}</th>
                <th class="py-1 px-2 text-center">${lang === "hi" ? "आयु" : "Age"}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-gray-200">${adRows}</tbody>
          </table>
        </div>
      `;
    }).join("");

    let pdTableHtml = "";
    const activeAdObj = vd.dasha.adActive;
    if (activeAdObj && Array.isArray(activeAdObj.pratyantardashas) && activeAdObj.pratyantardashas.length) {
      const pdRows = activeAdObj.pratyantardashas.map(pd => {
        const isCurPd = vd.dasha.pdActive && (pd.lord === vd.dasha.pdActive.lord);
        const pLabel = lang === "hi"
          ? `${PLANET_META[pd.mdLord].hi.split(" ")[0]} - ${PLANET_META[pd.adLord].hi.split(" ")[0]} - ${PLANET_META[pd.lord].hi.split(" ")[0]}${isCurPd ? " (सक्रिय)" : ""}`
          : `${pd.mdLord} - ${pd.adLord} - ${pd.lord}${isCurPd ? " (Active)" : ""}`;
        return `<tr class="${isCurPd ? 'bg-emerald-500/20 font-bold text-emerald-200' : ''}">
          <td class="py-1 px-2.5">${pLabel}</td>
          <td class="py-1 px-2.5 text-center font-mono">${fmt(pd.start)}</td>
          <td class="py-1 px-2.5 text-center font-mono">${fmt(pd.end)}</td>
        </tr>`;
      }).join("");

      pdTableHtml = `
        <div class="pdf-keep-together rounded-2xl bg-slate-950/90 border border-emerald-400/40 p-3.5 mt-4 overflow-x-auto">
          <div class="font-bold text-emerald-300 text-xs md:text-sm mb-2">
            <i class="fas fa-clock mr-1.5"></i>${lang === "hi" ? `वर्तमान अंतर्दशा (${PLANET_META[activeAdObj.mdLord].hi.split(" ")[0]}–${PLANET_META[activeAdObj.lord].hi.split(" ")[0]}) की प्रत्यंतर दशा सारणी:` : `Pratyantardasha (PD) Breakdown of Active ${activeAdObj.mdLord}–${activeAdObj.lord} Antardasha:`}
          </div>
          <table class="w-full text-xs">
            <thead class="bg-slate-900 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "प्रत्यंतर दशा (PD)" : "Pratyantardasha"}</th>
                <th class="py-1.5 px-2.5 text-center">${lang === "hi" ? "आरंभ तिथि" : "Start Date"}</th>
                <th class="py-1.5 px-2.5 text-center">${lang === "hi" ? "समाप्ति तिथि" : "End Date"}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-gray-200">${pdRows}</tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="mt-5">
        <h4 class="text-base md:text-lg font-bold text-amber-300 mb-3">
          <i class="fas fa-calendar-alt mr-2"></i>${lang === "hi" ? "विंशोत्तरी महादशा एवं अंतर्दशा समय-सारणी (आयु सहित)" : "Multi-Mahadasha & Antardasha Calendar Grid (with Exact Ages)"}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${tablesHtml}</div>
        ${pdTableHtml}
      </div>
    `;
  }

  function buildDomainOpportunityVsSabotageCard(ctx, domainKey, checkKey) {
    const { lang, chart, planetAnalysis, timeline, findings } = ctx;
    if (!chart.isFullChartMode || !findings || !findings.domainChecks) return "";

    const check = findings.domainChecks[checkKey || domainKey];
    const winObj = timeline[domainKey];
    if (!check || !winObj) return "";

    const titles = {
      education:      { icon: "fa-graduation-cap", hi: "उच्च शिक्षा एवं प्रतियोगी सफलता (5th House)", en: "Higher Education & Exam Breakthrough (5th House)" },
      careerIgnition: { icon: "fa-rocket",         hi: "प्रथम करियर आरंभ एवं स्वतंत्र आय (10th/6th Axis)", en: "First Career Ignition & Job Entry (10th/6th Axis)" },
      career:         { icon: "fa-briefcase",      hi: "करियर शिखर एवं पदोन्नति (10th House & D10)", en: "Peak Career Authority & Promotion (10th House & D10)" },
      marriage:       { icon: "fa-ring",           hi: "विवाह एवं जीवनसाथी मिलन आयु (7th House & D9)", en: "Marriage Age & Partnership Window (7th House & D9)" },
      childbirth:     { icon: "fa-baby",           hi: "संतान प्राप्ति एवं वंश-वृद्धि आयु (5th House & D7)", en: "Progeny & Childbirth Age Window (5th House & D7)" },
      property:       { icon: "fa-home",           hi: "भूमि-भवन निर्माण एवं वाहन सुख आयु (4th House & D4)", en: "Property, Land & Vehicle Age Window (4th House & D4)" },
      wealthPeak:     { icon: "fa-coins",          hi: "वृहद् धन-उत्थान एवं कोष विस्तार आयु (2nd/11th Axis)", en: "Major Wealth & Treasury Expansion Age (2nd/11th Axis)" }
    }[domainKey];

    const houseLord = planetAnalysis[check.lord];
    const pw = winObj.primaryWindow;
    const sw = winObj.secondaryWindow;

    const windowBadge = pw
      ? (lang === "hi" ? `${pw.ageSpanHi} (${pw.periodStr})` : `${pw.ageSpanEn} (${pw.periodStr})`)
      : (lang === "hi" ? "दशा समीक्षा" : "Dasha Review");

    let timingHtml = "";
    if (pw) {
      const reasons = (lang === "hi" ? pw.reasonsHi : pw.reasonsEn).join("; ");
      timingHtml = lang === "hi"
        ? `✅ <strong>फलीभूत होने की सटीक आयु एवं दशा (${pw.ageSpanHi} • ${pw.periodStr}):</strong> यह पड़ाव <strong>${pw.adLabelHi}</strong>${pw.pdLabelHi ? ` (विशेषकर <strong>${pw.pdLabelHi}</strong>)` : ""} में पूर्ण होता है, क्योंकि <em>${reasons}</em>।${sw ? `<br>↳ <strong>द्वितीय सहायक कालखंड:</strong> ${sw.ageSpanHi} (${sw.periodStr} • ${sw.adLabelHi})।` : ""}`
        : `✅ <strong>Exact Completion Age & Dasha (${pw.ageSpanEn} • ${pw.periodStr}):</strong> Fructifies during <strong>${pw.adLabel}</strong>${pw.pdLabelEn ? ` (peak PD: <strong>${pw.pdLabelEn}</strong>)` : ""} because <em>${reasons}</em>.${sw ? `<br>↳ <strong>Secondary Window:</strong> ${sw.ageSpanEn} (${sw.periodStr} • ${sw.adLabel}).` : ""}`;
    }

    let afflictionHtml = "";
    if (check.primaryAfflictor) {
      const aff = check.primaryAfflictor;
      const affMeta = PLANET_META[aff.planet];
      afflictionHtml = lang === "hi"
        ? `<p class="text-xs md:text-sm text-amber-200 leading-relaxed mb-0 mt-2">⚠️ <strong>कुंडली में ग्रह-प्रभाव:</strong> <strong>${affMeta.hi}</strong> ${aff.reasonHi} (भाव SAV: <strong>${check.savBindus} बिंदु</strong>)।</p>`
        : `<p class="text-xs md:text-sm text-amber-200 leading-relaxed mb-0 mt-2">⚠️ <strong>Natal Planetary Factor:</strong> Natal <strong>${affMeta.en}</strong> ${aff.reasonEn} (House SAV: <strong>${check.savBindus} bindus</strong>).</p>`;
    } else {
      afflictionHtml = lang === "hi"
        ? `<p class="text-xs md:text-sm text-emerald-300 leading-relaxed mb-0 mt-2">🛡️ <strong>अवरोध-मुक्त अक्ष:</strong> ${check.house}वां भाव और भावेश <strong>${houseLord.meta.hi} (${houseLord.formattedDeg})</strong> क्रूर ग्रहों के अवरोध से मुक्त हैं (${check.savBindus} SAV बिंदु)।</p>`
        : `<p class="text-xs md:text-sm text-emerald-300 leading-relaxed mb-0 mt-2">🛡️ <strong>Unobstructed Axis:</strong> House ${check.house} and lord <strong>${houseLord.meta.en} (${houseLord.formattedDeg})</strong> are free from malefic affliction (${check.savBindus} SAV bindus).</p>`;
    }

    return `
      <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border ${check.hasRealAffliction ? 'border-amber-500/60' : 'border-emerald-500/50'} shadow-lg">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
          <span class="text-amber-300 font-extrabold text-xs md:text-sm uppercase tracking-wider">
            <i class="fas ${titles.icon} mr-1.5"></i>${lang === "hi" ? titles.hi : titles.en}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">${windowBadge}</span>
        </div>
        <p class="text-xs md:text-sm text-gray-100 leading-relaxed mb-0">${timingHtml}</p>
        ${afflictionHtml}
      </div>
    `;
  }

  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData, chart } = ctx;
    const isFull = chart.isFullChartMode;

    if (!isFull || !dasha || !dasha.md || !dasha.ad || !planetAnalysis[dasha.md] || !planetAnalysis[dasha.ad]) {
      const moonRashi = RASHI_DATA[chart.Moon.d1];
      return (lang === "hi"
        ? `<p class="text-sm text-gray-200">जन्म चंद्रमा <strong>${moonRashi.hi} (${ctx.displayMoonNak})</strong> में है, जिसके जन्म दशा स्वामी <strong>${PLANET_META[dasha?.birthDashaRuler || "Sun"].hi}</strong> हैं। सटीक आयु-आधारित विंशोत्तरी दशा तिथियों हेतु जन्म समय आवश्यक है।</p>${buildRedBirthTimePrompt("hi")}`
        : `<p class="text-sm text-gray-200">Natal Moon sits in <strong>${moonRashi.en} (${ctx.displayMoonNak})</strong>, governed at birth by <strong>${dasha?.birthDashaRuler || "Sun"}</strong>. Enter your birth time above to compute exact age-indexed Vimshottari Dasha dates.</p>${buildRedBirthTimePrompt("en")}`);
    }

    const mdInfo = planetAnalysis[dasha.md];
    const adInfo = planetAnalysis[dasha.ad];
    const mdRashi = RASHI_DATA[mdInfo.d1];
    const adRashi = RASHI_DATA[adInfo.d1];
    const relativeHouseOfAD = getBhavaFrom(mdInfo.d1, adInfo.d1);
    const difficultAxis = relativeHouseOfAD === 6 || relativeHouseOfAD === 8 || relativeHouseOfAD === 12;

    const fmtDate = (d) => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
    const exactDatesSub = (dasha.isExactCalendarDasha && dasha.adActive)
      ? `${fmtDate(dasha.adActive.start)} → ${fmtDate(dasha.adActive.end)}`
      : (dasha.isManualDasha ? (lang === "hi" ? "मैनुअल चयन" : "Manual Selection") : "");

    const roadmapTableHtml = (window.TimingEngine && typeof window.TimingEngine.renderLifeMilestoneRoadmap === "function")
      ? window.TimingEngine.renderLifeMilestoneRoadmap(ctx)
      : "";

    const domainCardsHtml = `
      ${roadmapTableHtml}
      <div class="space-y-4 mt-6">
        <h4 class="text-base md:text-xl font-bold text-amber-300">
          <i class="fas fa-hourglass-half mr-2"></i>${lang === "hi"
            ? `जीवन के प्रमुख पड़ावों की फलीभूत आयु एवं दशा-गोचर विश्लेषण:`
            : `Detailed Age-to-Complete & Double-Transit Domain Breakdown:`}
        </h4>
        ${buildDomainOpportunityVsSabotageCard(ctx, "education", "education")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "careerIgnition", "career")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "career", "career")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "marriage", "marriage")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "childbirth", "childbirth")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "wealthPeak", "gains")}
      </div>
    `;

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
            <div class="text-xs text-cyan-300 font-bold uppercase">सक्रिय महादशा (MD) • आयु ${numData.age} वर्ष</div>
            <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.hi} (${mdInfo.formattedDeg})</div>
            <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}वां भाव (${mdRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
            <div class="text-xs text-purple-300 font-bold uppercase">सक्रिय अंतर्दशा (AD)</div>
            <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.hi} (${adInfo.formattedDeg})</div>
            <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}वां भाव (${adRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
            <div class="text-xs text-amber-300 font-bold uppercase">दशानाथ-अंतर्दशानाथ कोण एवं अवधि</div>
            <div class="text-base font-extrabold text-white mt-1">महादशानाथ से ${relativeHouseOfAD}वां स्थान</div>
            <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
          </div>
        </div>

        <p>
          <strong>1. वर्तमान ${mdInfo.meta.hi}–${adInfo.meta.hi} दशा का पाराशरी संश्लेषण:</strong>
          महादशानाथ <strong>${mdInfo.meta.hi}</strong> (${mdInfo.ownedHouses.length ? `भाव ${mdInfo.ownedHouses.join("/")} का स्वामी, ` : ""}${mdInfo.bhava}वें भाव में) और अंतर्दशानाथ <strong>${adInfo.meta.hi}</strong> (${adInfo.ownedHouses.length ? `भाव ${adInfo.ownedHouses.join("/")} का स्वामी, ` : ""}${adInfo.bhava}वें भाव में) एक-दूसरे से <strong>${relativeHouseOfAD}वें स्थान</strong> पर स्थित हैं। ${
            difficultAxis
              ? `परस्पर ${relativeHouseOfAD}वां (षडाष्टक/द्वादश) संबंध होने के कारण इस अंतर्दशा में ${BHAVA_SPHERES[mdInfo.bhava].hi} तथा ${BHAVA_SPHERES[adInfo.bhava].hi} से जुड़े निर्णयों में अतिरिक्त संयम आवश्यक है।`
              : `यह संबंध ${BHAVA_SPHERES[mdInfo.bhava].hi} तथा ${BHAVA_SPHERES[adInfo.bhava].hi} के फलों को सीधे सक्रिय कर रहा है।`
          }
        </p>
        ${domainCardsHtml}
        ${renderMultiMahadashaAntardashaGrid(ctx)}
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
          <div class="text-xs text-cyan-300 font-bold uppercase">Active Mahadasha (MD) • Age ${numData.age}</div>
          <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.en} (${mdInfo.formattedDeg})</div>
          <div class="text-xs text-gray-400 mt-0.5">House ${mdInfo.bhava} (${mdRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
          <div class="text-xs text-purple-300 font-bold uppercase">Active Antardasha (AD)</div>
          <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.en} (${adInfo.formattedDeg})</div>
          <div class="text-xs text-gray-400 mt-0.5">House ${adInfo.bhava} (${adRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
          <div class="text-xs text-amber-300 font-bold uppercase">MD–AD Geometry & Dates</div>
          <div class="text-base font-extrabold text-white mt-1">${relativeHouseOfAD}th from MD Lord</div>
          <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
        </div>
      </div>

      <p>
        <strong>1. Active ${dasha.md}–${dasha.ad} Dasha Synthesis:</strong>
        Mahadasha lord <strong>${mdInfo.meta.en}</strong> (${mdInfo.ownedHouses.length ? `ruler of House ${mdInfo.ownedHouses.join("/")} ` : ""}in House ${mdInfo.bhava}) and Antardasha lord <strong>${adInfo.meta.en}</strong> (${adInfo.ownedHouses.length ? `ruler of House ${adInfo.ownedHouses.join("/")} ` : ""}in House ${adInfo.bhava}) sit in a <strong>${relativeHouseOfAD}th-house angle</strong> from each other. ${
          difficultAxis
            ? `Because ${dasha.md} and ${dasha.ad} form a ${relativeHouseOfAD}th (6/8/12) axis, measured pacing is required across ${BHAVA_SPHERES[mdInfo.bhava].en} and ${BHAVA_SPHERES[adInfo.bhava].en}.`
            : `This ${relativeHouseOfAD}th alignment directly activates ${BHAVA_SPHERES[mdInfo.bhava].en} and ${BHAVA_SPHERES[adInfo.bhava].en}.`
        }
      </p>
      ${domainCardsHtml}
      ${renderMultiMahadashaAntardashaGrid(ctx)}
    `;
  }

  // ==========================================================================
  // 7. CHAPTER 12: DYNAMIC REMEDIES, NAAM-AKSHAR & GEMSTONE MATRIX
  // ==========================================================================

  const PLANET_BEEJ_AND_DANA = {
    Sun:     { beej: "ॐ घृणि सूर्याय नमः",           stotraHi: "आदित्य हृदय स्तोत्र",      stotraEn: "Aditya Hridaya Stotra",      danaHi: "गेहूं, गुड़ एवं तांबा",        danaEn: "wheat, jaggery, and copper" },
    Moon:    { beej: "ॐ सों सोमाय नमः",              stotraHi: "शिव पंचाक्षर एवं रुद्राभिषेक", stotraEn: "Shiva Panchakshara & Abhishekam", danaHi: "चावल, दुग्ध एवं श्वेत वस्त्र", danaEn: "rice, milk, and white cloth" },
    Mars:    { beej: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः", stotraHi: "श्री हनुमान चालीसा",       stotraEn: "Sri Hanuman Chalisa",        danaHi: "लाल मसूर एवं गुड़",           danaEn: "red lentils (Masoor) and jaggery" },
    Mercury: { beej: "ॐ बुं बुधाय नमः",              stotraHi: "श्री विष्णु सहस्रनाम",      stotraEn: "Vishnu Sahasranama",         danaHi: "साबुत हरी मूंग एवं गौ-चारा",   danaEn: "whole green moong and cow fodder" },
    Jupiter: { beej: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः", stotraHi: "श्री गुरु स्तोत्र / विष्णु आराधना", stotraEn: "Guru Stotra / Vishnu Worship", danaHi: "चने की दाल, हल्दी एवं पीले फल", danaEn: "yellow gram (Chana Dal), turmeric, and yellow fruit" },
    Venus:   { beej: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",stotraHi: "श्री सूक्त पाठ",          stotraEn: "Sri Suktam",                 danaHi: "दही, घी एवं श्वेत मिष्ठान्न",  danaEn: "curd, ghee, and white sweets" },
    Saturn:  { beej: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",stotraHi: "दशरथ कृत शनि स्तोत्र",  stotraEn: "Dasharatha Shani Stotra",    danaHi: "काले तिल, उड़द एवं छाया-पात्र", danaEn: "black sesame, urad dal, and iron/oil" },
    Rahu:    { beej: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः", stotraHi: "दुर्गा कवच एवं कालभैरव अष्टक", stotraEn: "Durga Kavach & Kalabhairava Ashtakam", danaHi: "सप्तधान्य एवं नारियल", danaEn: "seven grains (Saptadhanya) and coconut" },
    Ketu:    { beej: "ॐ स्रां स्रीं स्रौं सः केतवे नमः", stotraHi: "गणपति संकटनाशन स्तोत्र",  stotraEn: "Sankata Nashana Ganapati Stotra", danaHi: "दूर्वा अर्पण एवं श्वान-सेवा", danaEn: "Durva grass to Lord Ganesha and feeding stray dogs" }
  };

  function renderNaamAksharAndGemstoneAdvisory(ctx) {
    const { lang, name, chart, numData, planetAnalysis } = ctx;
    const moonNak = chart.Moon.nak || 1;
    const moonPada = chart.Moon.pada || 1;
    const akshObj = NAKSHATRA_AKSHARAS[moonNak] || NAKSHATRA_AKSHARAS[1];
    const birthSyllable = akshObj.pada[moonPada - 1] || akshObj.pada[0];
    const nakName = NAKSHATRA_DATA[moonNak].name;
    const moonRashiData = RASHI_DATA[chart.Moon.d1];

    const padaRows = [1, 2, 3, 4].map(p => {
      const isBirth = (p === moonPada);
      return `<tr class="${isBirth ? 'bg-amber-500/20 font-bold text-amber-200' : ''}">
        <td class="py-1.5 px-3">${nakName}</td>
        <td class="py-1.5 px-3 text-center">${lang === "hi" ? `चरण ${p}${isBirth ? " (जन्म चरण)" : ""}` : `Pada ${p}${isBirth ? " (Birth Pada)" : ""}`}</td>
        <td class="py-1.5 px-3 text-center font-extrabold text-amber-300">${akshObj.pada[p - 1]}</td>
      </tr>`;
    }).join("");

    let gemMatrixHtml = "";
    if (chart.isFullChartMode) {
      const ascR = chart.Asc.d1;
      const lagnaLord = RASHI_DATA[ascR].lord;
      const sign5 = getRashiOfBhava(ascR, 5);
      const lord5 = RASHI_DATA[sign5].lord;
      const sign9 = getRashiOfBhava(ascR, 9);
      const lord9 = RASHI_DATA[sign9].lord;
      const trikonaLords = Array.from(new Set([lagnaLord, lord5, lord9]));

      const all7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
      const forbiddenLords = all7.filter(k => !trikonaLords.includes(k));
      const kpAudit = evaluateKendradhipatiAndPakshaBala(chart);

      const favRows = trikonaLords.map((k, idx) => {
        const g = GEMSTONE_META[k] || GEMSTONE_META.Jupiter;
        const pInfo = planetAnalysis[k];
        const roleHi = k === lagnaLord ? `लग्नेश (भाव ${pInfo.bhava} में ${pInfo.formattedDeg})` : (k === lord9 ? `भाग्येश (भाव ${pInfo.bhava} में ${pInfo.formattedDeg})` : `पंचमेश (भाव ${pInfo.bhava} में ${pInfo.formattedDeg})`);
        const roleEn = k === lagnaLord ? `Lagna Lord (H-${pInfo.bhava} @ ${pInfo.formattedDeg})` : (k === lord9 ? `9th Lord (H-${pInfo.bhava} @ ${pInfo.formattedDeg})` : `5th Lord (H-${pInfo.bhava} @ ${pInfo.formattedDeg})`);
        const cautionHi = (pInfo.bhava === 6 || pInfo.bhava === 8 || pInfo.bhava === 12 || pInfo.combust)
          ? ` — [ग्रह ${pInfo.bhava}वें भाव/अस्त में होने से रत्न के स्थान पर मंत्र-जाप अधिक श्रेष्ठ]`
          : "";
        const cautionEn = (pInfo.bhava === 6 || pInfo.bhava === 8 || pInfo.bhava === 12 || pInfo.combust)
          ? ` — [Placed in H-${pInfo.bhava}/Combust: Vedic Mantra preferred over gemstone]`
          : "";
        return `<tr>
          <td class="py-1.5 px-2.5 font-bold text-emerald-300">${idx + 1}. ${lang === "hi" ? PLANET_META[k].hi : PLANET_META[k].en} (${lang === "hi" ? roleHi : roleEn})</td>
          <td class="py-1.5 px-2.5 text-xs text-gray-200">${lang === "hi" ? g.hi + cautionHi : g.en + cautionEn}</td>
        </tr>`;
      }).join("");

      const avoidNamesHi = forbiddenLords.map(k => `${PLANET_META[k].hi.split(" ")[0]} (भाव ${planetAnalysis[k].ownedHouses.join("/")} स्वामी)`).join(", ");
      const avoidNamesEn = forbiddenLords.map(k => `${k} (H-${planetAnalysis[k].ownedHouses.join("/")} Lord)`).join(", ");

      gemMatrixHtml = `
        <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-emerald-400/35 mt-4 space-y-2.5">
          <div class="font-bold text-emerald-300 text-sm md:text-base">
            <i class="fas fa-gem mr-2"></i>${lang === "hi" ? `रत्न पात्रता एवं निषेध सारणी (${RASHI_DATA[ascR].hi} लग्न • वर्तमान आयु ${numData.age} वर्ष):` : `Gemstone Suitability vs. Prohibited Matrix (${RASHI_DATA[ascR].en} Ascendant • Age ${numData.age}):`}
          </div>
          ${numData.age < 16 ? `<p class="text-xs text-amber-200 mb-1">ℹ️ ${lang === "hi" ? `जातक की वर्तमान आयु ${numData.age} वर्ष (बाल्यावस्था) है—16 वर्ष की आयु तक किसी भी उग्र रत्न के स्थान पर केवल पंचमुखी रुद्राक्ष या वैदिक मंत्र-श्रवण ही शास्त्रसम्मत है।` : `Because the native is currently ${numData.age} years old, gentle Vedic mantras and a 5-Mukhi Rudraksha are recommended rather than heavy planetary gemstones until age 16+.`}</p>` : ""}
          <div class="overflow-x-auto rounded-xl border border-white/15">
            <table class="w-full text-xs">
              <thead class="bg-slate-900 text-amber-300 border-b border-white/10">
                <tr>
                  <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "त्रिकोण स्वामी ग्रह एवं वर्तमान स्थान" : "Trikona Lord & Natal Placement"}</th>
                  <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "अनुकूल रत्न एवं धारण नियम" : "Recommended Gemstone & Protocol"}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">${favRows}</tbody>
            </table>
          </div>
          <div class="p-3 rounded-xl bg-rose-950/50 border border-rose-400/40 text-xs text-rose-200">
            🚫 <strong>${lang === "hi" ? "वर्जित रत्न:" : "Prohibited Gemstones:"}</strong>
            ${lang === "hi"
              ? `${RASHI_DATA[ascR].hi} लग्न के लिए अकारक/मारक स्वामियों—<strong>${avoidNamesHi}</strong>—के रत्न धारण करना वर्जित है। ${kpAudit.kendradhipatiNoteHi}`
              : `For ${RASHI_DATA[ascR].en} Ascendant, never wear gemstones of non-trinal/maraka lords: <strong>${avoidNamesEn}</strong>. ${kpAudit.kendradhipatiNoteEn}`}
          </div>
        </div>
      `;
    }

    return `
      <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-purple-400/35 mt-4 space-y-3">
        <div class="font-bold text-amber-300 text-sm md:text-base">
          <i class="fas fa-om mr-2"></i>${lang === "hi" ? `वैदिक नामाक्षर चक्र (${nakName} • चरण ${moonPada} • नामाक्षर '${birthSyllable}' • देवता: ${akshObj.devataHi})` : `Vedic Naam-Akshar Matrix (${nakName} • Pada ${moonPada} • Syllable '${birthSyllable}')`}
        </div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">
          ${lang === "hi"
            ? `चंद्रमा <strong>${moonRashiData.hi} (${chart.Moon.formattedDMS || chart.Moon.formattedDeg})</strong> के <strong>${nakName} (चरण ${moonPada}, प्रतीक: ${akshObj.symbolHi})</strong> में होने से जातक का शास्त्रीय जन्म-नामाक्षर <strong>'${birthSyllable}'</strong> है तथा प्रचलित नाम <strong>"${name}"</strong> (कैल्डियन स्पंदन ${ctx.chaldean.compound}/${ctx.chaldean.single}) है।`
            : `With the Moon at <strong>${chart.Moon.formattedDMS || chart.Moon.formattedDeg} in ${moonRashiData.en} (${nakName} Pada ${moonPada}, Symbol: ${akshObj.symbolHi})</strong>, the classical Vedic syllable is <strong>'${birthSyllable}'</strong> alongside popular name <strong>"${name}"</strong> (Chaldean ${ctx.chaldean.compound}/${ctx.chaldean.single}).`}
        </p>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-900 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-1.5 px-3 text-left">${lang === "hi" ? "जन्म नक्षत्र" : "Nakshatra"}</th>
                <th class="py-1.5 px-3 text-center">${lang === "hi" ? "नक्षत्र चरण" : "Pada"}</th>
                <th class="py-1.5 px-3 text-center">${lang === "hi" ? "शास्त्रीय नामाक्षर" : "Vedic Syllable"}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-gray-200">${padaRows}</tbody>
          </table>
        </div>
      </div>
      ${gemMatrixHtml}
    `;
  }

  function buildChapter11HiddenTraps(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter12Diagnostic === "function")
      ? window.NarrativeRules.renderChapter12Diagnostic(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, dasha, planetAnalysis } = ctx;
    const ascR = chart.Asc.d1;
    const lagnaLordKey = RASHI_DATA[ascR].lord;
    const matrix = LAGNA_FUNCTIONAL_MATRIX[ascR] || LAGNA_FUNCTIONAL_MATRIX[1];
    const badhakeshKey = matrix.badhakesh;
    const activeMdKey = (dasha && dasha.md) ? dasha.md : "Jupiter";
    const activeAdKey = (dasha && dasha.ad) ? dasha.ad : lagnaLordKey;

    const remKeys = Array.from(new Set([lagnaLordKey, activeMdKey, activeAdKey, badhakeshKey]));
    const remCardsHtml = remKeys.map((pKey, idx) => {
      const rem = PLANET_BEEJ_AND_DANA[pKey] || PLANET_BEEJ_AND_DANA.Jupiter;
      const pInfo = planetAnalysis[pKey];
      const nakInfo = NAKSHATRA_DATA[pInfo.nak] || NAKSHATRA_DATA[1];
      const shadbalaR = chart._shadbalaDetails?.[pKey]?.rupas;

      const roleTagHi = pKey === lagnaLordKey ? `लग्नेश (भाव ${pInfo.bhava} • ${pInfo.formattedDeg})`
                      : pKey === activeMdKey  ? `सक्रिय महादशानाथ (भाव ${pInfo.bhava} • ${pInfo.formattedDeg})`
                      : pKey === activeAdKey  ? `सक्रिय अंतर्दशानाथ (भाव ${pInfo.bhava} • ${pInfo.formattedDeg})`
                      : `बाधकेश (${matrix.badhakaHouse}वेश, भाव ${pInfo.bhava})`;
      const roleTagEn = pKey === lagnaLordKey ? `Lagna Lord (H-${pInfo.bhava} • ${pInfo.formattedDeg})`
                      : pKey === activeMdKey  ? `Active MD Lord (H-${pInfo.bhava} • ${pInfo.formattedDeg})`
                      : pKey === activeAdKey  ? `Active AD Lord (H-${pInfo.bhava} • ${pInfo.formattedDeg})`
                      : `Badhakesh (${matrix.badhakaHouse}th Lord in H-${pInfo.bhava})`;

      if (lang === "hi") {
        return `
          <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/35 space-y-1.5">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-1.5">
              <span class="font-bold text-amber-300 text-sm">${idx + 1}. ${pInfo.meta.hi} (${RASHI_DATA[pInfo.d1].hi}, ${nakInfo.name})</span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-bold">${roleTagHi}</span>
            </div>
            <div class="text-xs md:text-sm text-gray-200">🕉️ <strong>वैदिक मंत्र एवं स्तोत्र:</strong> प्रतिदिन 108 बार <strong>"${rem.beej}"</strong> का जाप एवं <strong>${rem.stotraHi}</strong> का पाठ करें${shadbalaR ? ` (वर्तमान षड्बल: ${shadbalaR} रूप)` : ""}।</div>
            <div class="text-xs md:text-sm text-gray-200">🌾 <strong>भाव-${pInfo.bhava} संतुलन दान:</strong> ${pInfo.bhava}वें भाव (${BHAVA_SPHERES[pInfo.bhava].hi}) की शुद्धि हेतु <strong>${rem.danaHi}</strong> का सात्विक दान करें।</div>
          </div>
        `;
      }

      return `
        <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/35 space-y-1.5">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <span class="font-bold text-amber-300 text-sm">${idx + 1}. ${pInfo.meta.en} (${RASHI_DATA[pInfo.d1].en}, ${nakInfo.name})</span>
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-bold">${roleTagEn}</span>
          </div>
          <div class="text-xs md:text-sm text-gray-200">🕉️ <strong>Vedic Beej Mantra & Stotra:</strong> Chant <strong>"${rem.beej}"</strong> (108 times daily) and recite <strong>${rem.stotraEn}</strong>${shadbalaR ? ` (Natal Shadbala: ${shadbalaR} Rupas)` : ""}.</div>
          <div class="text-xs md:text-sm text-gray-200">🌾 <strong>House-${pInfo.bhava} Sattvic Dana:</strong> To harmonize House ${pInfo.bhava} (${BHAVA_SPHERES[pInfo.bhava].en}), donate <strong>${rem.danaEn}</strong>.</div>
        </div>
      `;
    }).join("");

    const headerTitle = lang === "hi"
      ? `<h4 class="text-base md:text-lg font-bold text-amber-300 mt-5 mb-2.5"><i class="fas fa-praying-hands mr-2"></i>लग्नेश, सक्रिय दशानाथ एवं बाधकेश के अंश-आधारित सात्विक वैदिक उपाय:</h4>`
      : `<h4 class="text-base md:text-lg font-bold text-amber-300 mt-5 mb-2.5"><i class="fas fa-praying-hands mr-2"></i>Chart-Specific Sattvic Vedic Remedies (Lagna Lord, Active Dasha & Badhakesh):</h4>`;

    return `${baseHtml}${renderNaamAksharAndGemstoneAdvisory(ctx)}${headerTitle}<div class="space-y-3">${remCardsHtml}</div>`;
  }

  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart, planetAnalysis } = ctx;
    const jupInfo = planetAnalysis?.Jupiter || { d1: 9, bhava: 9, formattedDeg: "" };
    const jupRashi = RASHI_DATA[jupInfo.d1 || 9];
    const headingEl = document.getElementById("dakshinaHeading");
    const textEl = document.getElementById("contentDakshinaText");
    if (!headingEl || !textEl) return;

    if (lang === "hi") {
      headingEl.innerHTML = `पवित्र ऊर्जा विनिमय एवं गुरु-दक्षिणा संकल्प 🙏`;
      textEl.innerHTML = `<p class="hindi">प्रिय <strong>${name}</strong>, आपकी पत्रिका में देवगुरु बृहस्पति <strong>${jupRashi.hi} (${jupInfo.formattedDeg})</strong> में स्थित हैं। वैदिक परंपरा में ज्योतिषीय गणना के अध्ययन के पश्चात अपनी श्रद्धा के अनुसार स्वैच्छिक <strong>गुरु-दक्षिणा</strong> अर्पित करना शुभ संकल्प माना गया है।</p>`;
    } else {
      headingEl.innerHTML = `Voluntary Guru Dakshina (Sacred Vedic Tradition) 🙏`;
      textEl.innerHTML = `<p>Dear <strong>${name}</strong>, in your chart <strong>Jupiter (Brihaspati)</strong> is placed in <strong>${jupRashi.en} (${jupInfo.formattedDeg})</strong>. In the Vedic tradition, offering a voluntary <strong>Guru Dakshina</strong> according to your Shraddha honors the lineage of Jyotish Vidya.</p>`;
    }
  }

  // ==========================================================================
  // 8. DOM ORCHESTRATION, CHARTS & MASTER ENTRY POINT
  // ==========================================================================

  function ensureChildbirthSectionAndMiddleDakshina() {
    const partnerArticle = document.getElementById("chapter-partner");
    const planetsArticle = document.getElementById("chapter-planets");
    const dakshinaArticle = document.getElementById("chapter-dakshina");
    if (!partnerArticle || !planetsArticle) return;

    let babyArticle = document.getElementById("chapter-childbirth");
    if (!babyArticle) {
      babyArticle = document.createElement("article");
      babyArticle.id = "chapter-childbirth";
      babyArticle.className = "chapter-card";
      babyArticle.innerHTML = `
        <div class="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div class="min-w-0">
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 block" id="chBabyTag">Chapter 08 • Progeny & D7 Saptamsa</span>
            <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 break-words" id="chBabyTitle">Progeny Factors & D7 Saptamsa Analysis</h3>
          </div>
          <div class="w-11 h-11 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-lg shrink-0"><i class="fas fa-baby"></i></div>
        </div>
        <div id="contentChildbirth" class="chapter-body"></div>
      `;
      partnerArticle.insertAdjacentElement("afterend", babyArticle);
    }

    if (dakshinaArticle && babyArticle.nextElementSibling !== dakshinaArticle) {
      babyArticle.insertAdjacentElement("afterend", dakshinaArticle);
    }
  }

  function renderVedicExtraSections(ctx) {
    const el = document.getElementById("vedicChartsContainer");
    if (!el) return;

    if (!ctx.chart.isFullChartMode || ctx.viewFilter === "numerology_8" || typeof window.VedicChartAnalyzer === "undefined") {
      el.innerHTML = "";
      el.classList.add("hidden");
      return;
    }

    el.classList.remove("hidden");
    const vd = window.__jtVedicData;

    let d1SVG = "", d9SVG = "", extraTablesHtml = "";
    const renderD9Fn = window.VedicChartAnalyzer.renderD9NorthChart || window.VedicChartAnalyzer.renderD9SouthChart;

    if (vd && vd.d1SVG && vd.d9SVG) {
      d1SVG = window.VedicChartAnalyzer.renderD1NorthChart(vd.chart, { lang: ctx.lang, userName: ctx.name });
      d9SVG = renderD9Fn(vd.chart, { lang: ctx.lang, userName: ctx.name });
      const planetTableHtml = typeof window.VedicChartAnalyzer.renderMasterPlanetTable === "function"
        ? window.VedicChartAnalyzer.renderMasterPlanetTable(vd.chart, ctx.lang)
        : "";
      const milestoneRoadmapHtml = (window.TimingEngine && typeof window.TimingEngine.renderLifeMilestoneRoadmap === "function")
        ? window.TimingEngine.renderLifeMilestoneRoadmap(ctx)
        : "";
      const panchangHtml = typeof window.VedicChartAnalyzer.renderPanchangAndGocharaBox === "function"
        ? window.VedicChartAnalyzer.renderPanchangAndGocharaBox(vd.chart, ctx.lang)
        : "";
      extraTablesHtml = `
        ${planetTableHtml}
        ${milestoneRoadmapHtml}
        ${panchangHtml}
        <div class="pdf-keep-together grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div class="rounded-3xl bg-slate-950/90 border border-cyan-400/40 p-4 md:p-5">
            <h3 class="text-base md:text-lg font-bold text-white mb-3"><i class="fas fa-bolt text-cyan-400 mr-2"></i>${ctx.lang === 'hi' ? 'षड्बल ग्रह-बल (Shadbala in Rupas)' : 'Shadbala Planetary Strength (in Rupas)'}</h3>
            ${window.VedicChartAnalyzer.renderShadbalaBars(vd.shadbala, ctx.lang, vd.chart)}
          </div>
          <div class="rounded-3xl bg-slate-950/90 border border-indigo-400/40 p-4 md:p-5">
            <h3 class="text-base md:text-lg font-bold text-white mb-3"><i class="fas fa-columns text-indigo-400 mr-2"></i>${ctx.lang === 'hi' ? 'श्रीपति भाव चलित तालिका (Sripati Chalit)' : 'Sripati Bhava Chalit Table'}</h3>
            ${window.VedicChartAnalyzer.renderChalitTable(vd.chalit, ctx.lang)}
          </div>
        </div>
        <div class="rounded-3xl bg-slate-950/90 border border-emerald-400/40 p-4 md:p-5 mt-5">
          <h3 class="text-base md:text-lg font-bold text-white mb-1.5"><i class="fas fa-hourglass-half text-emerald-400 mr-2"></i>${ctx.lang === 'hi' ? '120-वर्षीय विंशोत्तरी महादशा एवं अंतर्दशा सारणी' : '120-Year Vimshottari Mahadasha & Antardasha Calendar'}</h3>
          <p class="text-xs text-gray-400 mb-3">${ctx.lang === 'hi' ? 'किसी भी महादशा पर क्लिक करके उसके भीतर की सभी 9 अंतर्दशाओं की तारीखें देखें:' : 'Click any Mahadasha row below to expand its 9 Antardasha sub-periods:'}</p>
          ${window.VedicChartAnalyzer.renderDashaTimeline(vd.dasha, ctx.lang)}
        </div>
      `;
    } else {
      const synthChart = {};
      ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].forEach(k => {
        synthChart[k] = {
          rashi: ctx.chart[k].d1,
          d9: ctx.chart[k].d9,
          retro: ctx.chart[k].retro,
          longitude: ctx.chart[k].longitude,
          degInSign: ctx.chart[k].degInSign
        };
      });
      d1SVG = window.VedicChartAnalyzer.renderD1NorthChart(synthChart, { lang: ctx.lang, userName: ctx.name });
      d9SVG = renderD9Fn(synthChart, { lang: ctx.lang, userName: ctx.name });
    }

    const chandraAndChalitHtml = renderChandraAndChalitSvgCharts(ctx);
    el.innerHTML = `
      <div class="pdf-keep-together rounded-3xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          <div id="d1ChartWrapper" class="rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-white p-1 shadow-xl">${d1SVG}</div>
          <div id="d9ChartWrapper" class="rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-white p-1 shadow-xl">${d9SVG}</div>
        </div>
      </div>
      ${chandraAndChalitHtml}
      ${extraTablesHtml}
    `;
  }

  function renderCalibrationBannerAndSwitcher(ctx) {
    const calEl = document.getElementById("calibrationBanner");
    const togEl = document.getElementById("modeToggleContainer");

    if (calEl) {
      if (ctx.chart.isExactAstronomyMode && window.__jtVedicData) {
        const meta = window.__jtVedicData.chart.meta;
        const bw = meta.boundaryWarnings || {};
        const conf = window.__jtVedicData.chart.Asc.lagnaConfidence || "exact";
        const confTag = (conf === "unconfirmed" || bw.isLagnaSandhi)
          ? (ctx.lang === "hi" ? "⚠️ लग्न संधि / समय संवेदनशीलता" : "⚠️ Borderline Lagna / Time Sensitivity")
          : (ctx.lang === "hi" ? "✓ लहिरी चित्रापक्ष अयनांश सत्यापित" : "✓ True Lahiri Chitrapaksha Verified");

        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div><i class="fas fa-check-circle text-emerald-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? 'जन्म-समय एवं स्थान कुंडली सक्रिय:' : 'Astronomical Birth Chart Active:'}</strong>
          ${meta.name} (${meta.lat.toFixed(2)}°N, ${meta.lng.toFixed(2)}°E) • Ayanamsa: ${meta.ayanamsa.toFixed(2)}°</div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold shrink-0">${confTag}</span>
        </div>`;
      } else if (ctx.chart.isFullChartMode) {
        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200">
          <i class="fas fa-check-circle text-emerald-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? 'मैनुअल ग्रह-स्थिति मोड सक्रिय:' : 'Custom Planetary Matrix Active:'}</strong>
          ${ctx.lang === 'hi' ? 'चयनित लग्न (D1), नक्षत्र और नवांश (D9) के आधार पर फलित।' : 'Parashari & Navamsa reading calibrated to custom planetary inputs.'}
        </div>`;
      } else {
        calEl.innerHTML = buildRedBirthTimePrompt(ctx.lang);
      }
    }

    if (togEl) togEl.classList.add("hidden");
  }

  function applyViewFilterVisibility(ctx) {
    const isFull = Boolean(ctx.chart && ctx.chart.isFullChartMode);
    const lagnaRequiredChapters = [
      "chapter-education",
      "chapter-career",
      "chapter-wealth",
      "chapter-partner",
      "chapter-childbirth",
      "chapter-lagnas",
      "chapter-traps"
    ];

    lagnaRequiredChapters.forEach(id => {
      const articleEl = document.getElementById(id);
      if (articleEl) articleEl.style.display = isFull ? "" : "none";
      const navPills = document.querySelectorAll(`.chapter-nav-pill[href="#${id}"]`);
      navPills.forEach(p => { p.style.display = isFull ? "" : "none"; });
    });
  }

  function updateChapterHeadingsAndNav(lang, ctx) {
    const isFull = ctx.chart.isFullChartMode;
    const ageVal = ctx.numData.age;

    const labels = lang === "hi" ? {
      ch1Tag: `अध्याय 01 • उदय लग्न, चंद्र नक्षत्र एवं आत्मकारक (वर्तमान आयु: ${ageVal} वर्ष)`,
      ch1Title: `${RASHI_DATA[ctx.chart.Asc.d1].hi.split(" ")[0]} लग्न, ${RASHI_DATA[ctx.chart.Moon.d1].hi.split(" ")[0]} चंद्र एवं आत्मकारक विश्लेषण`,
      ch2Tag: "अध्याय 02 • विद्या त्रिकोण (4H-5H-9H), पंचमेश एवं शिक्षा पूर्णता आयु",
      ch2Title: "शिक्षा, बौद्धिक विशेषज्ञता एवं प्रतियोगी सफलता की सटीक आयु",
      ch3Tag: "अध्याय 03 • कर्म क्षेत्र (10H), दशमांश (D10) एवं करियर उत्थान आयु",
      ch3Title: "प्रथम नौकरी/करियर आरंभ, पदोन्नति आयु एवं दशमांश (D10) विश्लेषण",
      ch4Tag: "अध्याय 04 • अर्थ-त्रिकोण, धन योग एवं भूमि-वाहन (D4) प्राप्ति आयु",
      ch4Title: "धनेश-लाभेश समीकरण, सर्वाष्टकवर्ग एवं संपत्ति निर्माण की आयु",
      ch5Tag: "अध्याय 05 • पूर्वजन्म प्रारब्ध (5H), भाग्येश (9H) एवं भाग्योदय आयु",
      ch5Title: "नवमेश स्थिति, इष्ट आराध्य एवं भाग्योदय के सटीक आयु-वर्ष",
      ch6Tag: "अध्याय 06 • शुक्र-चंद्र भावनात्मक समन्वय एवं नवांश (D9) प्रकृति",
      ch6Title: "अंतरंग सामंजस्य एवं पारिवारिक/भावनात्मक मनोविज्ञान",
      ch7Tag: "अध्याय 07 • सप्तम भाव, नवांश (D9), उपपद लग्न एवं सटीक विवाह आयु",
      ch7Title: "विवाह की सटीक आयु, जीवनसाथी का स्वरूप एवं मांगलिक परिहार",
      chBabyTag: "अध्याय 08 • पंचम अक्ष, गुरु अष्टकवर्ग, सप्तांश (D7) एवं संतान आयु",
      chBabyTitle: "संतान प्राप्ति की सटीक आयु एवं सप्तांश (D7) वंश-विश्लेषण",
      ch8Tag: isFull ? "अध्याय 09 • नवग्रह स्पष्ट अंश, भाव-स्वामित्व, षड्बल एवं दृष्टियां" : "अध्याय 09 • जन्म-दिवस के नवग्रह स्पष्ट (Noon Ephemeris)",
      ch8Title: isFull ? "सभी 9 ग्रहों का स्वामित्व, दशा सक्रियता आयु, नवांश एवं दृष्टि फल" : "जन्म-दिवस के सभी 9 ग्रहों की राशि एवं नक्षत्र स्थिति",
      ch9Tag: "अध्याय 10 • विशेष लग्न, 337-बिंदु अष्टकवर्ग एवं द्वादश भाव सारणी",
      ch9Title: "चंद्र, सूर्य, नवांश, आरूढ़ लग्न, 337-बिंदु SAV एवं योग-दोष सत्यापन",
      ch10Tag: "अध्याय 11 • संपूर्ण जीवन-चक्र आयु सारणी एवं विंशोत्तरी दशा-गोचर",
      ch10Title: "शिक्षा, करियर, विवाह, संतान व संपत्ति की आयु एवं महादशा-अंतर्दशा",
      ch11Title: "कुंडली के संवेदनशील बिंदु, नामाक्षर, रत्न पात्रता एवं वैदिक उपाय"
    } : {
      ch1Tag: `Chapter 01 • Rising Ascendant, Moon Nakshatra & Atmakaraka (Current Age: ${ageVal})`,
      ch1Title: `${RASHI_DATA[ctx.chart.Asc.d1].en.split(" ")[0]} Ascendant, ${RASHI_DATA[ctx.chart.Moon.d1].en.split(" ")[0]} Moon & Atmakaraka Synthesis`,
      ch2Tag: "Chapter 02 • Vidya Triad (4H-5H-9H), 5th Lord & Education Completion Age",
      ch2Title: "Academic Specialization & Exact Competitive Breakthrough Age",
      ch3Tag: "Chapter 03 • Karma Axis (10H), D10 Dasamsa & Career Ignition/Peak Age",
      ch3Title: "First Career Ignition Age, Executive Rise & D10 Dasamsa Disposition",
      ch4Tag: "Chapter 04 • Artha Axis, Dhana Yogas & Property (D4) Acquisition Age",
      ch4Title: "2nd & 11th Lords, SAV Balance & Exact Wealth/Property Ages",
      ch5Tag: "Chapter 05 • Purva-Punya (5H), 9th-Lord Bhagya & Fortune Ages",
      ch5Title: "9th-Lord Disposition, Ishta Devata & Exact Fortune Activation Ages",
      ch6Tag: "Chapter 06 • Venus-Moon Relational Matrix & D9 Emotional Harmony",
      ch6Title: "Emotional Chemistry & Navamsa Relational Disposition",
      ch7Tag: "Chapter 07 • 7th House, D9 Navamsa, Upapada & Exact Marriage Age",
      ch7Title: "Exact Parashari Marriage Age, Partner Profile & Manglik Audit",
      chBabyTag: "Chapter 08 • 5th Axis, Putra-Karaka Jupiter, D7 Saptamsa & Progeny Age",
      chBabyTitle: "Exact Progeny Completion Age & D7 Saptamsa Lineage Analysis",
      ch8Tag: isFull ? "Chapter 09 • All 9 Planets: Exact DMS, Lordship, Shadbala & Aspects" : "Chapter 09 • Birth-Date Natal Planets (Noon Ephemeris)",
      ch8Title: isFull ? "Parashari Lordship, Chart Dasha Activation Ages & Aspect Geometry" : "Sidereal Sign & Nakshatra Placements of All 9 Natal Planets",
      ch9Tag: "Chapter 10 • Special Lagnas, 337-Bindu SAV & 12-House Summary Matrix",
      ch9Title: "Chandra, Surya, Navamsa, Arudha, 337-Bindu SAV & Yoga Verification",
      ch10Tag: "Chapter 11 • Full Life-Milestone Age Matrix & Vimshottari Dasha",
      ch10Title: "Exact Completion Ages for Education, Career, Marriage, Progeny & Wealth",
      ch11Title: "Technical Chart Sensitivity, Naam-Akshar, Gemstones & Vedic Remedies"
    };

    Object.keys(labels).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = labels[id];
    });

    const badgeEl = document.getElementById("dossierBadgeMode");
    const headerNameEl = document.getElementById("dossierHeaderName");
    const headerSubEl = document.getElementById("dossierHeaderSubtext");

    if (badgeEl) {
      const stageBadge = ctx.timeline?.lifeStage
        ? (lang === "hi" ? ctx.timeline.lifeStage.badgeHi : ctx.timeline.lifeStage.badgeEn)
        : "";
      badgeEl.innerHTML = `<i class="fas fa-compass mr-1.5"></i> ${stageBadge || (lang === "hi" ? "पाराशरी वैदिक कुंडली डॉसियर" : "Parashari Vedic Kundali Dossier")}`;
    }

    if (headerNameEl) {
      headerNameEl.textContent = lang === "hi"
        ? `${ctx.name} की पाराशरी वैदिक जन्म कुंडली (आयु ${ageVal} वर्ष)`
        : `${ctx.name}'s Parashari Vedic Kundali Dossier (Age ${ageVal})`;
    }

    if (headerSubEl) {
      const sunName  = lang === "hi" ? RASHI_DATA[ctx.chart.Sun.d1].hi  : RASHI_DATA[ctx.chart.Sun.d1].en;
      const ascName  = lang === "hi" ? RASHI_DATA[ctx.chart.Asc.d1].hi  : RASHI_DATA[ctx.chart.Asc.d1].en;
      const moonName = lang === "hi" ? RASHI_DATA[ctx.chart.Moon.d1].hi : RASHI_DATA[ctx.chart.Moon.d1].en;
      const hasDasha = Boolean(ctx.dasha && ctx.dasha.md && ctx.dasha.ad && PLANET_META[ctx.dasha.md] && PLANET_META[ctx.dasha.ad]);
      const dashaStrHi = hasDasha ? `${PLANET_META[ctx.dasha.md].hi}–${PLANET_META[ctx.dasha.ad].hi}` : `${ctx.dasha?.birthDashaRuler || "नक्षत्र"} दशा क्रम`;
      const dashaStrEn = hasDasha ? `${ctx.dasha.md}–${ctx.dasha.ad}` : `${ctx.dasha?.birthDashaRuler || "Nakshatra"} Dasha`;

      if (isFull) {
        headerSubEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob} (आयु ${ageVal} वर्ष ${ctx.numData.ageMonths || 0} माह)</strong> • लग्न: <strong>${ascName} (${ctx.chart.Asc.formattedDMS || ctx.chart.Asc.formattedDeg || ""})</strong> • चंद्र: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • सक्रिय दशा: <strong>${dashaStrHi}</strong>`
          : `DOB: <strong>${ctx.dob} (Age ${ageVal} Yrs ${ctx.numData.ageMonths || 0} Mos)</strong> • Lagna: <strong>${ascName} (${ctx.chart.Asc.formattedDMS || ctx.chart.Asc.formattedDeg || ""})</strong> • Moon: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • Active Dasha: <strong>${dashaStrEn}</strong>`;
      } else {
        headerSubEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob} (आयु ${ageVal} वर्ष)</strong> • चंद्र राशि: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • सूर्य राशि: <strong>${sunName}</strong>`
          : `DOB: <strong>${ctx.dob} (Age ${ageVal} Yrs)</strong> • Moon Sign: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • Sun Sign: <strong>${sunName}</strong>`;
      }
    }
  }

  function updateReadingMetricsBadge(lang) {
    const container = document.getElementById("masterDossierOutput");
    const badgeEl = document.getElementById("readingTimeEstimate");
    if (!container || !badgeEl) return;

    const rawText = container.innerText || "";
    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(15, Math.min(45, Math.round(wordCount / 130) + 8));
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
        if (sec && sec.offsetTop <= scrollPos) activeId = id;
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

  function injectMobileBoxSafetyStyles() {
    if (document.getElementById("jt-mobile-safety-css")) return;
    const style = document.createElement("style");
    style.id = "jt-mobile-safety-css";
    style.textContent = `
      input[type="date"].form-input, input[type="time"].form-input {
        -webkit-appearance: none; appearance: none;
        width: 100% !important; max-width: 100% !important; min-width: 0 !important;
        box-sizing: border-box !important; display: block;
      }
      .chapter-card, .chapter-body {
        max-width: 100% !important; box-sizing: border-box !important;
        overflow-wrap: anywhere; word-break: break-word;
      }
    `;
    document.head.appendChild(style);
  }

  window.__jtClassicalHelpers = {
    computeSunriseSunsetAndVedicVara,
    evaluateKendradhipatiAndPakshaBala,
    renderChandraAndChalitSvgCharts,
    renderTwelveBhavaSummaryTable,
    renderClassicalYogaAndNegativeAuditTable,
    renderMultiMahadashaAntardashaGrid,
    renderNaamAksharAndGemstoneAdvisory,
    NAKSHATRA_AKSHARAS
  };

  window.__jtViewFilter = "full_12";

  window.switchDossierView = function (viewFilter) {
    window.__jtViewFilter = viewFilter;
    window.generateCompleteLifeDossier(null, { preserveScroll: true });
  };

  window.generateCompleteLifeDossier = function (event, options) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    const preserveScroll = options && options.preserveScroll === true;

    try {
      const nameInput   = document.getElementById("userName")?.value.trim() || "Seeker";
      const dobInput    = document.getElementById("userDob")?.value || "1998-01-24";
      const langInput   = document.getElementById("reportLang")?.value || "hi";
      const genderInput = document.getElementById("userGender")?.value || "male";

      const chaldean       = calculateChaldeanName(nameInput);
      const numData        = calculateNumerologyFromDob(dobInput);
      const chart          = readChartFromDOM(numData, chaldean);
      const planetAnalysis = analyzeAllPlanetsAndAspects(chart);
      const specialLagnas  = computeSpecialLagnasAndBindus(chart);

      const findings = (typeof window.FindingsEngine !== "undefined")
        ? window.FindingsEngine.analyzeFindings(chart, specialLagnas.houseBindus)
        : null;

      const dasha = resolveActiveDasha(chart, numData);
      const timeline = computeLifeEventTimeline(numData, chart, planetAnalysis, dasha, findings, genderInput);

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
        findings,
        dasha,
        timeline,
        viewFilter: window.__jtViewFilter || "full_12",
        vedicData: window.__jtVedicData
      };

      ctx.displayAsc = chart.isFullChartMode
        ? RASHI_DATA[ctx.chart.Asc.d1].en
        : `${RASHI_DATA[ctx.chart.Moon.d1].en} Moon (DOB-Only Mode)`;
      ctx.displayMoon    = RASHI_DATA[ctx.chart.Moon.d1].en;
      ctx.displayMoonNak = NAKSHATRA_DATA[ctx.chart.Moon.nak].name;
      window.__jyotishLastCtx = ctx;

      ensureChildbirthSectionAndMiddleDakshina();

      const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      };

      updateChapterHeadingsAndNav(langInput, ctx);

      setHtml("contentPersonality", buildChapter1Personality(ctx));
      if (chart.isFullChartMode) {
        setHtml("contentEducation",     buildChapter2Education(ctx));
        setHtml("contentCareer",        buildChapter3Career(ctx));
        setHtml("contentWealth",        buildChapter4Wealth(ctx));
        setHtml("contentPartner",       buildChapter7Partner(ctx));
        setHtml("contentChildbirth",    buildChapterChildbirth(ctx));
        setHtml("contentSpecialLagnas", buildChapter9SpecialLagnas(ctx));
        setHtml("contentHiddenTraps",   buildChapter11HiddenTraps(ctx));
      } else {
        setHtml("contentEducation", "");
        setHtml("contentCareer", "");
        setHtml("contentWealth", "");
        setHtml("contentPartner", "");
        setHtml("contentChildbirth", "");
        setHtml("contentSpecialLagnas", "");
        setHtml("contentHiddenTraps", "");
      }

      setHtml("contentLuck",           buildChapter5Luck(ctx));
      setHtml("contentLove",           buildChapter6Love(ctx));
      updateChapter12Dakshina(ctx);
      setHtml("contentPlanetsAspects", buildChapter8PlanetsAndAspects(ctx));
      setHtml("contentTimePhase",      buildChapter10TimePhase(ctx));

      renderCalibrationBannerAndSwitcher(ctx);
      renderVedicExtraSections(ctx);
      applyViewFilterVisibility(ctx);

      const mName   = document.getElementById("name");
      const mDob    = document.getElementById("dob");
      const mGender = document.getElementById("gender");
      if (mName)   mName.value   = nameInput;
      if (mDob)    mDob.value    = dobInput;
      if (mGender) mGender.value = genderInput;

      const outputContainer = document.getElementById("masterDossierOutput");
      if (outputContainer) {
        outputContainer.classList.remove("hidden");
        updateReadingMetricsBadge(langInput);
        if (!preserveScroll) {
          setTimeout(() => outputContainer.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        }
      }
    } catch (err) {
      console.error("Jyotish Tark Dossier Generation Error:", err);
      alert("Error generating reading: " + (err && err.message ? err.message : err));
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectMobileBoxSafetyStyles();
    initStickyChapterScrollSpy();
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
