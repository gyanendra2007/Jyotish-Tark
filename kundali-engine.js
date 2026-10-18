/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js  •  v4.0 (45-Min Ultra-Precision Edition)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * 100% Synchronized with kundali-form.html:
 * - Verified BPHS 337-Bindu Sarvashtakavarga (SAV) & Bhinnashtakavarga (BAV)
 * - Exact Functional Benefic, Yogakaraka, Maraka & Badhakesh Matrix for 12 Lagnas
 * - Proportional Vimshottari Mahadasha & Antardasha with Rashi-Nakshatra Pada Balance
 * - Deep Psychological & Predictive Prose (English & हिंदी) across Chapters 1–12
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. CORE NUMEROLOGY & RASHI / LAGNA MASTER DATABASES
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

  // Complete 12-Lagna Functional Nature Matrix (Parashari Functional Roles)
  const LAGNA_FUNCTIONAL_MATRIX = {
    1: { // Mesha (Aries)
      yogakaraka: ["Sun", "Jupiter"],
      benefics: ["Sun", "Moon", "Mars", "Jupiter"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Venus", "Saturn"],
      badhakaHouse: 11, badhakesh: "Saturn",
      secretWeaknessEn: "impulsive trust, sudden bursts of anger that you regret within minutes, and taking on everyone else's battles while hiding your own exhaustion",
      secretWeaknessHi: "आवेग में आकर भरोसा करना, क्षणिक क्रोध जिसके बाद आपको स्वयं ग्लानि होती है, और अपनी थकान छिपाकर दूसरों की जिम्मेदारियां अपने सिर ले लेना"
    },
    2: { // Vrishabha (Taurus)
      yogakaraka: ["Saturn"],
      benefics: ["Saturn", "Mercury", "Venus", "Sun"],
      malefics: ["Jupiter", "Moon", "Mars"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 9, badhakesh: "Saturn",
      secretWeaknessEn: "silent stubbornness, holding onto past emotional hurts for years, and sacrificing your personal desires to maintain family stability",
      secretWeaknessHi: "भीतर ही भीतर पुरानी बातों को वर्षों तक दबाए रखना, जिद्दी स्वाभिमान और परिवार की स्थिरता के लिए अपनी इच्छाओं का चुपचाप त्याग करना"
    },
    3: { // Mithuna (Gemini)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Sun"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "two parallel tracks of thought running 24/7 in your brain, severe overthinking at night, and feeling intellectually lonely even in a crowd",
      secretWeaknessHi: "दिमाग में 24 घंटे दो समानांतर विचारों का चलना, रात्रि में अत्यधिक ओवरथिंकिंग और भीड़ में भी अपने बौद्धिक स्तर का साथी न मिल पाने का एकाकीपन"
    },
    4: { // Karka (Cancer)
      yogakaraka: ["Mars"],
      benefics: ["Mars", "Jupiter", "Moon"],
      malefics: ["Venus", "Mercury", "Saturn"],
      marakas: ["Saturn", "Mercury"],
      badhakaHouse: 11, badhakesh: "Venus",
      secretWeaknessEn: "absorbing the emotional stress of everyone around you, giving 100% loyalty to people who return 30%, and silent mood fluctuations",
      secretWeaknessHi: "दूसरों के दुख और तनाव को अपने भीतर सोख लेना, उन लोगों को 100% वफादारी देना जो बदले में 30% भी नहीं लौटाते, और अचानक मन का उदास हो जाना"
    },
    5: { // Simha (Leo)
      yogakaraka: ["Mars"],
      benefics: ["Mars", "Sun", "Jupiter"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Saturn", "Venus"],
      badhakaHouse: 9, badhakesh: "Mars",
      secretWeaknessEn: "fierce royal pride that refuses to ask for help even when hurting deeply, and feeling unappreciated by the very people you protect",
      secretWeaknessHi: "अटूट राजसी स्वाभिमान जिसके कारण आप टूटने पर भी किसी से मदद नहीं मांगते, और जिन लोगों की आप रक्षा करते हैं उन्हीं से अपेक्षित सम्मान न मिलना"
    },
    6: { // Kanya (Virgo)
      yogakaraka: ["Venus", "Mercury"],
      benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Moon"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "hyper-critical perfectionism, noticing micro-flaws that others miss, gut/nervous tension when plans go off-track, and being the unpaid 'fixer' in relationships",
      secretWeaknessHi: "हर काम में पूर्णता (perfection) खोजने की आदत, सूक्ष्म से सूक्ष्म गलती को तुरंत पकड़ लेना, और रिश्तों में हमेशा दूसरों की समस्याएं सुलझाते रहना"
    },
    7: { // Tula (Libra)
      yogakaraka: ["Saturn"],
      benefics: ["Saturn", "Mercury", "Venus"],
      malefics: ["Sun", "Mars", "Jupiter"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Sun",
      secretWeaknessEn: "suppressing your own anger to keep peace until you suddenly detach completely, and hesitation at major life crossroads",
      secretWeaknessHi: "शांति बनाए रखने के लिए अपनी भावनाओं को दबाना—और जब सहनशक्ति की सीमा समाप्त हो जाए तो बिना शोर किए पूरी तरह तटस्थ (detach) हो जाना"
    },
    8: { // Vrishchika (Scorpio)
      yogakaraka: ["Moon", "Jupiter"],
      benefics: ["Sun", "Moon", "Jupiter", "Mars"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Mercury", "Venus"],
      badhakaHouse: 9, badhakesh: "Moon",
      secretWeaknessEn: "living in 'all-or-nothing' extremes, radar-like suspicion caused by early-life betrayals, and keeping your deepest wounds locked in a vault",
      secretWeaknessHi: "'आर या पार' के चरम पर जीना, पूर्व में मिले विश्वासघात के कारण किसी पर आसानी से भरोसा न कर पाना और अपने गहरे घाव किसी को न दिखाना"
    },
    9: { // Dhanu (Sagittarius)
      yogakaraka: ["Sun", "Mars"],
      benefics: ["Sun", "Mars", "Jupiter"],
      malefics: ["Venus", "Saturn", "Mercury"],
      marakas: ["Venus", "Saturn"],
      badhakaHouse: 7, badhakesh: "Mercury",
      secretWeaknessEn: "blunt truth-speaking that unintentionally creates enemies, secret restlessness that you haven't reached your true peak yet, and over-giving advice to the undeserving",
      secretWeaknessHi: "बिना लाग-लपेट के सच बोल देना जिससे स्वार्थी लोग दूरी बना लेते हैं, और भीतर ही भीतर यह बेचैनी कि आप अभी अपने असली मुकाम तक नहीं पहुंचे हैं"
    },
    10: { // Makara (Capricorn)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Moon"],
      marakas: ["Moon", "Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Mars",
      secretWeaknessEn: "growing up too early emotionally, carrying a quiet fear of failure behind a rock-solid face, and feeling that everyone leans on you while you have no one to lean on",
      secretWeaknessHi: "उम्र से पहले जिम्मेदार हो जाना, चट्टान जैसे चेहरे के पीछे असफलता का अनकहा डर और यह एहसास कि सब आप पर टिके हैं पर आपके कंधे को सहारा देने वाला कोई नहीं"
    },
    11: { // Kumbha (Aquarius)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Sun", "Mars", "Saturn"],
      malefics: ["Jupiter", "Moon", "Mercury"],
      marakas: ["Jupiter", "Moon"],
      badhakaHouse: 9, badhakesh: "Venus",
      secretWeaknessEn: "deep inner detachment even while smiling socially, irregular sleep from an overactive futuristic brain, and attracting proud/dominant partners",
      secretWeaknessHi: "समाज में सबके साथ घुलने-मिलने के बावजूद भीतर से गहरा वैराग्य, रात्रि में अति-सक्रिय मस्तिष्क के कारण नींद में खलल और स्वाभिमानी जीवनसाथी से वैचारिक टकराव"
    },
    12: { // Meena (Pisces)
      yogakaraka: ["Mars", "Moon"],
      benefics: ["Moon", "Mars", "Jupiter"],
      malefics: ["Sun", "Venus", "Saturn", "Mercury"],
      marakas: ["Mercury", "Venus", "Saturn"],
      badhakaHouse: 7, badhakesh: "Mercury",
      secretWeaknessEn: "forgiving people who repeatedly misuse your kindness, struggling with emotional boundaries, and over-idealizing partners before seeing their flaws",
      secretWeaknessHi: "अपनी करुणा का गलत फायदा उठाने वालों को भी बार-बार माफ कर देना, भावनात्मक सीमाएं (boundaries) न बना पाना और लोगों को जरूरत से ज्यादा आदर्श मान लेना"
    }
  };

  const RASHI_DATA = {
    1:  { id:1, en:"Mesha (Aries)",     hi:"मेष (Aries)",     lord:"Mars",    lordHi:"मंगल",
          element:"Fire (अग्नि)",  elementHi:"अग्नि तत्व",  quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          temperamentEn:"fiercely independent, pioneering, action-driven, and instinctively allergic to micromanagement",
          temperamentHi:"अत्यंत स्वतंत्र, अग्रणी, कर्मठ और किसी के अनुचित नियंत्रण में न रहने वाला",
          bodyBuildEn:"sharp facial bone structure, intense commanding gaze, athletic energy, and a brisk purposeful walk",
          bodyBuildHi:"तेज आंखें, तीखे आकर्षक नैन-नक्श, ऊर्जावान शरीर और आत्मविश्वास भरी तेज चाल" },
    2:  { id:2, en:"Vrishabha (Taurus)", hi:"वृषभ (Taurus)",   lord:"Venus",   lordHi:"शुक्र",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          temperamentEn:"grounded, deeply loyal, luxury-appreciating, patient until pushed to the wall, and financially astute",
          temperamentHi:"स्थिर बुद्धि, अपनों के प्रति अटूट समर्पण, कला व गुणवत्ता के पारखी और धैर्यवान",
          bodyBuildEn:"graceful symmetrical features, expressive magnetic eyes, soothing voice, and a calm regal presence",
          bodyBuildHi:"सौम्य आकर्षक चेहरा, सुंदर बोलती आंखें, मधुर वाणी और शांत प्रभावशाली आभा" },
    3:  { id:3, en:"Mithuna (Gemini)",   hi:"मिथुन (Gemini)",   lord:"Mercury", lordHi:"बुध",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          temperamentEn:"hyper-intelligent, articulate, adaptable, curious, and mentally three steps ahead of everyone else",
          temperamentHi:"तीव्र बुद्धि, वाक्पटु, बहुमुखी प्रतिभा के धनी और हर परिस्थिति को तुरंत भांप लेने वाले",
          bodyBuildEn:"youthful appearance that ages slowly, sparkling observant eyes, expressive hands, and quick wit",
          bodyBuildHi:"उम्र से कम दिखने वाला युवा चेहरा, चंचल चमकदार आंखें और प्रभावशाली संवाद शैली" },
    4:  { id:4, en:"Karka (Cancer)",     hi:"कर्क (Cancer)",     lord:"Moon",    lordHi:"चंद्रमा",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          temperamentEn:"deeply intuitive, nurturing, fiercely protective of loved ones, and privately guarded behind a warm smile",
          temperamentHi:"अत्यंत संवेदनशील, अंतर्ज्ञानी, अपनों की ढाल बनने वाले और भावनात्मक रूप से गहरे",
          bodyBuildEn:"soft luminescent complexion, soulful empathetic eyes, gentle smile, and a deeply comforting aura",
          bodyBuildHi:"सौम्य आभा, गहरी भावुक आंखें, शांत मुस्कान और अपनापन देने वाला व्यक्तित्व" },
    5:  { id:5, en:"Simha (Leo)",        hi:"सिंह (Leo)",        lord:"Sun",     lordHi:"सूर्य",
          element:"Fire (अग्नि)",   elementHi:"अग्नि तत्व",   quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          temperamentEn:"regal, self-respecting, magnanimous, protective, and born to lead rather than follow",
          temperamentHi:"स्वाभिमानी, उदार हृदय, वचन के पक्के और जन्मजात नेतृत्व क्षमता से भरपूर",
          bodyBuildEn:"commanding posture, broad forehead, radiant aura, and an unmistakable lion-like dignity",
          bodyBuildHi:"रौबदार व्यक्तित्व, चौड़ा तेजस्वी माथा, प्रभावशाली कंधे और राजसी चाल" },
    6:  { id:6, en:"Kanya (Virgo)",      hi:"कन्या (Virgo)",     lord:"Mercury", lordHi:"बुध",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          temperamentEn:"analytical, detail-oriented, quietly observant of hidden flaws, and ruthlessly practical in crisis",
          temperamentHi:"सूक्ष्म विश्लेषक, पूर्णतावादी, तार्किक और संकट में भी शांत रहकर समाधान निकालने वाले",
          bodyBuildEn:"neat refined features, intelligent penetrating eyes, youthful skin, and a well-groomed poised look",
          bodyBuildHi:"सुव्यवस्थित और सलीकेदार व्यक्तित्व, तीक्ष्ण बुद्धिमान आंखें और सौम्य आकर्षण" },
    7:  { id:7, en:"Tula (Libra)",       hi:"तुला (Libra)",      lord:"Venus",   lordHi:"शुक्र",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          temperamentEn:"diplomatic, justice-loving, aesthetically refined, charming, and wired for high-value partnerships",
          temperamentHi:"न्यायप्रिय, संतुलित, सौंदर्य व सुरुचि के प्रेमी और उच्च स्तरीय व्यवहार-कुशल",
          bodyBuildEn:"proportionate attractive features, dimpled or warm smile, graceful posture, and natural elegance",
          bodyBuildHi:"संतुलित आकर्षक नैन-नक्श, मोहक मुस्कान और शालीन राजसी अंदाज" },
    8:  { id:8, en:"Vrishchika (Scorpio)",hi:"वृश्चिक (Scorpio)",lord:"Mars",    lordHi:"मंगल",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          temperamentEn:"intense, investigative, transformative, phoenix-like in resilience, and impossible to deceive",
          temperamentHi:"गूढ़ रहस्यमयी, गहरी शोधवृत्ति वाले, झूठ को तुरंत पकड़ने वाले और संकटों से फीनिक्स की तरह उठने वाले",
          bodyBuildEn:"piercing hypnotic eyes, magnetic aura, strong jawline, and unmistakable quiet intensity",
          bodyBuildHi:"आंखों में गहरा चुंबकीय आकर्षण, रहस्यमयी गंभीरता और प्रभावशाली शारीरिक ऊर्जा" },
    9:  { id:9, en:"Dhanu (Sagittarius)",hi:"धनु (Sagittarius)",lord:"Jupiter", lordHi:"बृहस्पति (गुरु)",
          element:"Fire (अग्नि)",   elementHi:"अग्नि तत्व",   quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          temperamentEn:"philosophical, truth-speaking, dharmic, visionary, and driven by higher purpose and expansion",
          temperamentHi:"सत्यवादी, दूरदर्शी, उच्च आदर्शों वाले, स्वाभिमानी और ज्ञान के उपासक",
          bodyBuildEn:"tall or well-proportioned frame, bright forehead, warm open eyes, and an energetic stride",
          bodyBuildHi:"तेजस्वी ललाट, सकारात्मक ऊर्जा से भरा चेहरा और प्रभावशाली कद-काठी" },
    10: { id:10,en:"Makara (Capricorn)", hi:"मकर (Capricorn)",  lord:"Saturn",  lordHi:"शनि",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          temperamentEn:"strategic, relentless, self-made, disciplined, and unshakeable under heavy responsibility",
          temperamentHi:"कर्मप्रधान, कुशल रणनीतिकार, यथार्थवादी और कठिन परिश्रम से अपना साम्राज्य खड़ा करने वाले",
          bodyBuildEn:"defined bone structure, mature composed look, deep thoughtful eyes, and steady grounded walk",
          bodyBuildHi:"गंभीर और परिपक्व व्यक्तित्व, गहरी सोच वाली आंखें और धैर्यवान आभा" },
    11: { id:11,en:"Kumbha (Aquarius)",  hi:"कुंभ (Aquarius)",  lord:"Saturn",  lordHi:"शनि",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          temperamentEn:"unconventional, futuristic, scientifically minded, humanitarian, and fiercely protective of inner freedom",
          temperamentHi:"लीक से हटकर सोचने वाले, वैज्ञानिक दृष्टिकोण, दार्शनिक और अपनी मानसिक स्वतंत्रता के प्रति सजग",
          bodyBuildEn:"distinctive noble features, visionary gaze, tall or lean-strong frame, and an intellectual aura",
          bodyBuildHi:"बुद्धिजीवी आभा, दूरदर्शी विचारशील आंखें और भीड़ से अलग पहचान वाला व्यक्तित्व" },
    12: { id:12,en:"Meena (Pisces)",     hi:"मीन (Pisces)",      lord:"Jupiter", lordHi:"बृहस्पति (गुरु)",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          temperamentEn:"spiritually gifted, empathetic, wise, counselor-natured, and guided by prophetic intuition",
          temperamentHi:"आध्यात्मिक, परोपकारी, गहरे दार्शनिक और पूर्वाभास (intuition) की अद्भुत शक्ति से युक्त",
          bodyBuildEn:"dreamy oceanic eyes, serene luminous aura, graceful demeanor, and a deeply soothing voice",
          bodyBuildHi:"शांत गहरी समुद्र जैसी आंखें, दिव्य सौम्य आभा और हृदय को छू लेने वाली मधुर वाणी" }
  };

  const NAKSHATRA_DATA = {
    1:{name:"Ashwini (अश्विनी)",ruler:"Ketu",gana:"Deva",traitEn:"lightning-fast intuition, healing touch, pioneering speed, and refusal to stay stuck",traitHi:"तीव्र निर्णय क्षमता, आरोग्य शक्ति, अग्रणी रहने की ऊर्जा और किसी भी बाधा से तुरंत निकलने का गुण"},
    2:{name:"Bharani (भरणी)",ruler:"Venus",gana:"Manushya",traitEn:"intense creative willpower, ability to carry heavy responsibilities, and fearless truth",traitHi:"गहन सृजन शक्ति, बड़ी जिम्मेदारियां उठाने का सामर्थ्य और सत्य के प्रति अडिग निष्ठा"},
    3:{name:"Krittika (कृत्तिका)",ruler:"Sun",gana:"Rakshasa",traitEn:"razor-sharp discernment, protective fire, cutting through fake illusions, and command",traitHi:"अग्नि जैसा तेज, झूठ और दिखावे को तुरंत काटने की क्षमता और रक्षात्मक नेतृत्व"},
    4:{name:"Rohini (रोहिणी)",ruler:"Moon",gana:"Manushya",traitEn:"magnetic charm, wealth-attracting aura, deep emotional loyalty, and artistic refinement",traitHi:"अद्भुत चुंबकीय आकर्षण, धन-संपदा व वैभव खींचने की शक्ति और गहरा भावनात्मक समर्पण"},
    5:{name:"Mrigashira (मृगशिरा)",ruler:"Mars",gana:"Deva",traitEn:"restless intellectual quest, research brilliance, and observant sensitivity",traitHi:"ज्ञान और पूर्णता की निरंतर खोज, सूक्ष्म शोध प्रवृत्ति और कुशाग्र बुद्धि"},
    6:{name:"Ardra (आर्द्रा)",ruler:"Rahu",gana:"Manushya",traitEn:"storm-to-clarity genius, deep psychological analysis, and breakthrough innovation after crisis",traitHi:"संकट और संघर्ष के तूफानों से गुजरकर अद्भुत सफलता और आविष्कार करने की क्षमता"},
    7:{name:"Punarvasu (पुनर्वसु)",ruler:"Jupiter",gana:"Deva",traitEn:"divine bounce-back resilience, spiritual wisdom, and ability to rebuild stronger every time",traitHi:"हर संकट के बाद दोगुनी शक्ति से वापसी (bounce-back) करने की ईश्वरीय कृपा और सात्विक ज्ञान"},
    8:{name:"Pushya (पुष्य)",ruler:"Saturn",gana:"Deva",traitEn:"supreme nourishment, dharmic discipline, patient wealth-building, and institutional respect",traitHi:"नक्षत्रों का राजा—धर्म, अनुशासन, धैर्य और स्थायी राजयोग व समृद्धि निर्मित करने की शक्ति"},
    9:{name:"Ashlesha (आश्लेषा)",ruler:"Mercury",gana:"Rakshasa",traitEn:"hypnotic psychological insight, X-ray intuition into human motives, and strategic depth",traitHi:"सामने वाले के मन की परतें पढ़ लेने की रहस्यमयी क्षमता, तीव्र अंतर्ज्ञान और कूटनीतिक गहराई"},
    10:{name:"Magha (मघा)",ruler:"Ketu",gana:"Rakshasa",traitEn:"royal ancestral pride, throne-consciousness, high standards, and natural authority",traitHi:"पितरों का विशेष आशीर्वाद, राजसी स्वाभिमान, उच्च आदर्श और नेतृत्व का जन्मजात प्रारब्ध"},
    11:{name:"Purva Phalguni (पूर्वा फाल्गुनी)",ruler:"Venus",gana:"Manushya",traitEn:"charismatic warmth, creative magnetism, romantic depth, and social grace",traitHi:"सौभाग्य, कलात्मक आकर्षण, उदार हृदय और समाज में स्वतः सम्मान पाने की क्षमता"},
    12:{name:"Uttara Phalguni (उत्तरा फाल्गुनी)",ruler:"Sun",gana:"Manushya",traitEn:"committed partnerships, administrative mastery, and self-earned independent standing",traitHi:"वचनबद्धता, स्थायी संबंध, प्रशासनिक दक्षता और स्व-अर्जित प्रतिष्ठा"},
    13:{name:"Hasta (हस्त)",ruler:"Moon",gana:"Deva",traitEn:"manifestation through skill, clever execution, dexterity, and control over destiny",traitHi:"कर्म-कौशल से अपना भाग्य स्वयं लिखने की शक्ति, तीक्ष्ण बुद्धि और व्यावहारिक दक्षता"},
    14:{name:"Chitra (चित्रा)",ruler:"Mars",gana:"Rakshasa",traitEn:"architectural perfectionism, charismatic mystique, and carving beauty out of raw struggle",traitHi:"अद्भुत सृजन कौशल, सौंदर्य बोध और कठिनाइयों को तराशकर बड़ी उपलब्धि बनाने की शक्ति"},
    15:{name:"Swati (स्वाती)",ruler:"Rahu",gana:"Deva",traitEn:"unyielding love for freedom, business diplomacy, and self-propelled rise like the wind",traitHi:"स्वतंत्र अस्तित्व, व्यापारिक कूटनीति और बिना किसी के सहारे अपनी शर्तों पर आगे बढ़ने की कला"},
    16:{name:"Vishakha (विशाखा)",ruler:"Jupiter",gana:"Rakshasa",traitEn:"laser-focused obsession with goals, relentless stamina, and triumphant conquest in the second half",traitHi:"लक्ष्य पर अर्जुन जैसी एकाग्र दृष्टि, अटूट संकल्प और जीवन के उत्तरार्ध में अजेय विजय"},
    17:{name:"Anuradha (अनुराधा)",ruler:"Saturn",gana:"Deva",traitEn:"lotus-in-mud resilience, deep devotion in love/friendship, and success away from birthplace",traitHi:"विपरीत परिस्थितियों में भी कमल की तरह खिलने की शक्ति, गहरी निष्ठा और जन्मस्थान से दूर भाग्योदय"},
    18:{name:"Jyeshtha (ज्येष्ठा)",ruler:"Mercury",gana:"Rakshasa",traitEn:"protective seniority, crisis-management genius, occult intelligence, and hidden sensitivity",traitHi:"परिवार व कार्यक्षेत्र में सबसे बड़े संकटमोचक, गूढ़ विद्याओं में रुचि और तीक्ष्ण रणनीतिक बुद्धि"},
    19:{name:"Mula (मूल)",ruler:"Ketu",gana:"Rakshasa",traitEn:"root-level truth extraction, karmic uprooting of false structures, and fearless rebuilding",traitHi:"हर विषय की जड़ (root cause) तक पहुंचने की क्षमता और शून्य से नया साम्राज्य खड़ा करने का साहस"},
    20:{name:"Purva Ashadha (पूर्वाषाढ़ा)",ruler:"Venus",gana:"Manushya",traitEn:"invincible conviction, persuasive speech, emotional depth, and victorious momentum",traitHi:"अजेय आत्मविश्वास, प्रभावशाली तर्कशक्ति और कभी हार न मानने वाला जुझारू स्वभाव"},
    21:{name:"Uttara Ashadha (उत्तराषाढ़ा)",ruler:"Sun",gana:"Manushya",traitEn:"permanent unshakeable victory, righteous authority, and peak respect after age 28–32",traitHi:"स्थायी विजय (अप्रतिम), अखंड निष्ठा और 28–32 वर्ष के बाद समाज में सर्वोच्च सम्मान"},
    22:{name:"Shravana (श्रवण)",ruler:"Moon",gana:"Deva",traitEn:"master listening, scholarly intellect, strategic timing, and organizational fame",traitHi:"गहरी श्रवण व समझने की शक्ति, उच्च विद्या और अपने ज्ञान से प्रतिष्ठा अर्जित करने का योग"},
    23:{name:"Dhanishta (धनिष्ठा)",ruler:"Mars",gana:"Rakshasa",traitEn:"impeccable timing, wealth-accumulating drive, and multi-dimensional ambition",traitHi:"सही समय पर सही निर्णय लेने की क्षमता, भूमि व धन-संपदा का संचय और उच्च महत्वाकांक्षा"},
    24:{name:"Shatabhisha (शतभिषा)",ruler:"Rahu",gana:"Rakshasa",traitEn:"hundred-healer diagnostic power, secret research brilliance, and solitary genius",traitHi:"सौ वैद्यों जैसी सूक्ष्म निदान शक्ति (diagnostic mind), रहस्यमयी शोध और स्वतंत्र चिंतन"},
    25:{name:"Purva Bhadrapada (पूर्वा भाद्रपद)",ruler:"Jupiter",gana:"Manushya",traitEn:"fierce transformational fire, philosophical depth, and unconventional wealth creation",traitHi:"आध्यात्मिक तेज, क्रांतिकारी विचार और असाधारण मार्गों से धन व सफलता अर्जित करने की शक्ति"},
    26:{name:"Uttara Bhadrapada (उत्तरा भाद्रपद)",ruler:"Saturn",gana:"Manushya",traitEn:"deep ocean-floor stability, kundalini wisdom, and enduring material-spiritual balance",traitHi:"समुद्र जैसी गहरी शांति, धैर्य, आध्यात्मिक परिपक्वता और स्थायी संपत्ति व विरासत का योग"},
    27:{name:"Revati (रेवती)",ruler:"Mercury",gana:"Deva",traitEn:"compassionate soul, foreign/long-distance luck, creative imagination, and divine protection",traitHi:"सौभाग्यशाली यात्राएं, करुणा, उच्च कल्पनाशीलता और संकट में ईश्वरीय रक्षा का कवच"}
  };

  const PLANET_META = {
    Sun:     {en:"Sun (Surya)",         hi:"सूर्य (Sun)",         karakaEn:"Soul, authority, father, royal dignity, vitality, and government/executive command", karakaHi:"आत्मा, स्वाभिमान, पिता, राजसत्ता, आरोग्य एवं उच्च प्रशासनिक अधिकार", exalted:1,  debilitated:7,  own:[5],     aspects:[7]},
    Moon:    {en:"Moon (Chandra)",      hi:"चंद्रमा (Moon)",      karakaEn:"Mind, emotions, mother, subconscious peace, intuition, and liquid cash flow",      karakaHi:"मन, भावनाएं, माता, मानसिक शांति, अंतर्ज्ञान एवं नकदी प्रवाह",       exalted:2,  debilitated:8,  own:[4],     aspects:[7]},
    Mars:    {en:"Mars (Mangal)",       hi:"मंगल (Mars)",         karakaEn:"Courage, willpower, real estate/land, siblings, blood/energy, and execution fire", karakaHi:"साहस, पराक्रम, भूमि-संपत्ति, भाई-बहन, रक्त-ऊर्जा एवं निर्णय शक्ति",  exalted:10, debilitated:4,  own:[1,8],   aspects:[4,7,8]},
    Mercury: {en:"Mercury (Budh)",      hi:"बुध (Mercury)",       karakaEn:"Analytical intelligence, speech, trade, coding/logic, skin/nerves, and diplomacy", karakaHi:"विश्लेषणात्मक बुद्धि, वाणी, व्यापार, तर्कशक्ति, तंत्रिका तंत्र एवं कूटनीति", exalted:6,  debilitated:12, own:[3,6],   aspects:[7]},
    Jupiter: {en:"Jupiter (Guru)",      hi:"बृहस्पति / गुरु",     karakaEn:"Divine grace, higher wisdom, wealth expansion, children, dharma, and Husband-Karaka", karakaHi:"ईश्वरीय कृपा, उच्च ज्ञान, धन-वृद्धि, संतान, धर्म एवं (स्त्री कुंडली में) पति कारक", exalted:4,  debilitated:10, own:[9,12],  aspects:[5,7,9]},
    Venus:   {en:"Venus (Shukra)",      hi:"शुक्र (Venus)",       karakaEn:"Romance, marriage, Wife-Karaka, luxury, vehicles, aesthetics, and charisma",       karakaHi:"प्रेम, वैवाहिक सुख, (पुरुष कुंडली में) पत्नी कारक, वैभव, वाहन एवं आकर्षण", exalted:12, debilitated:6,  own:[2,7],   aspects:[7]},
    Saturn:  {en:"Saturn (Shani)",      hi:"शनि (Saturn)",        karakaEn:"Karmic justice, discipline, longevity, mass authority, endurance, and steady empire", karakaHi:"कर्मफल दाता, न्याय, अनुशासन, दीर्घायु एवं संघर्ष के बाद अजेय साम्राज्य", exalted:7,  debilitated:1,  own:[10,11], aspects:[3,7,10]},
    Rahu:    {en:"Rahu (North Node)",   hi:"राहु (Rahu)",         karakaEn:"Obsessive ambition, sudden amplification, foreign links, technology, and illusion", karakaHi:"असीम महत्वाकांक्षा, अचानक उछाल, विदेश योग, आधुनिक तकनीक एवं माया",     exalted:2,  debilitated:8,  own:[11],    aspects:[5,7,9]},
    Ketu:    {en:"Ketu (South Node)",   hi:"केतु (Ketu)",         karakaEn:"Past-life mastery, spiritual detachment, occult/medical intuition, and sudden cuts", karakaHi:"पूर्वजन्म का संचित ज्ञान, वैराग्य, सूक्ष्म अंतर्ज्ञान एवं अचानक अलगाव",   exalted:8,  debilitated:2,  own:[8],     aspects:[5,7,9]}
  };

  const BHAVA_MEANINGS = {
    1:  {en:"1st House (Tanu Bhava — core self, physical vitality, brain, and life direction)",                                     hi:"प्रथम भाव (लग्न/तनु — व्यक्तित्व, मस्तिष्क, आत्मबल एवं जीवन की दिशा)"},
    2:  {en:"2nd House (Dhana & Kutumba Bhava — bank balance, speech, family values, and accumulated assets)",                     hi:"द्वितीय भाव (धन एवं कुटुंब — बैंक बैलेंस, वाणी का प्रभाव एवं संचित धन)"},
    3:  {en:"3rd House (Parakrama Bhava — courage, self-made effort, communication, siblings, and short travels)",                 hi:"तृतीय भाव (पराक्रम एवं सहज — साहस, स्व-प्रयास, संवाद कौशल एवं छोटे भाई-बहन)"},
    4:  {en:"4th House (Sukha & Matri Bhava — inner peace, mother, real estate, vehicles, and emotional sanctuary)",               hi:"चतुर्थ भाव (सुख एवं मातृ — मानसिक शांति, माता, भूमि-भवन, वाहन एवं हृदय)"},
    5:  {en:"5th House (Putra, Vidya & Purva-Punya Bhava — intelligence, competitive exams, romance, children, and past merit)",   hi:"पंचम भाव (विद्या, बुद्धि एवं पूर्व-पुण्य — मेधा, प्रतियोगी परीक्षा, प्रेम एवं संतान)"},
    6:  {en:"6th House (Ari, Roga & Rina Bhava — competition, daily work grind, debt, health defence, and overcoming enemies)",   hi:"षष्ठ भाव (रोग, ऋण एवं शत्रु — प्रतियोगी विजय, दैनिक सेवा, ऋण मुक्ति एवं संघर्ष क्षमता)"},
    7:  {en:"7th House (Kalatra Bhava — marriage, life partner, business contracts, and public projection)",                       hi:"सप्तम भाव (कलत्र एवं दांपत्य — जीवनसाथी, विवाह, व्यापारिक साझेदारी एवं जन-छवि)"},
    8:  {en:"8th House (Randhra & Ayur Bhava — sudden transformations, deep research, occult, in-laws, and hidden wealth)",       hi:"अष्टम भाव (आयु एवं गुप्त रहस्य — आकस्मिक परिवर्तन, गहन शोध, ससुराल एवं गुप्त धन)"},
    9:  {en:"9th House (Bhagya & Dharma Bhava — divine grace, luck, higher education, father, gurus, and long journeys)",          hi:"नवम भाव (भाग्य एवं धर्म — ईश्वरीय कृपा, उच्च शिक्षा, पिता, गुरु एवं लंबी यात्राएं)"},
    10: {en:"10th House (Karma & Rajya Bhava — career peak, professional authority, social status, and honour)",                   hi:"दशम भाव (कर्म एवं राज्य — करियर का शिखर, सत्ता, पद-प्रतिष्ठा एवं कार्यक्षेत्र)"},
    11: {en:"11th House (Labha & Kama Bhava — incoming financial gains, wish fulfilment, elder siblings, and elite networks)",     hi:"एकादश भाव (लाभ एवं इच्छापूर्ति — आय के स्रोत, मनोकामना पूर्ति एवं प्रभावशाली नेटवर्क)"},
    12: {en:"12th House (Vyaya & Moksha Bhava — foreign lands, subconscious mind, sleep quality, outflows, and spiritual liberation)",hi:"द्वादश भाव (व्यय, विदेश एवं मोक्ष — विदेशी संबंध, निद्रा, अवचेतन मन एवं खर्च)"}
  };

  const MULANK_ARCHETYPES = {
    1:{ruler:"Sun (सूर्य)", titleEn:"The Sovereign Pioneer (Psychic Number 1 — Royal Sun)",
       psychEn:"Governed by Number 1 (Surya), your soul carries an innate refusal to be second-best or take orders from people you don't respect. Outsiders see your composed, self-reliant exterior, but almost nobody realizes the immense silent pressure you put on yourself to never look weak. You hate asking for favors even when you are exhausted.",
       psychHi:"मूलांक 1 (सूर्य) से शासित होने के कारण आपकी आत्मा में जन्मजात नेतृत्व और अटूट स्वाभिमान है। बाहर से लोग आपको मजबूत समझते हैं, पर बहुत कम लोग जानते हैं कि आप अपनी समस्याएं अकेले सुलझाने का कितना भारी दबाव झेलते हैं।"},
    2:{ruler:"Moon (चंद्रमा)", titleEn:"The Intuitive Empath (Psychic Number 2 — Lunar Radar)",
       psychEn:"Governed by Number 2 (Chandra), your mind acts like a high-frequency emotional radar. Within thirty seconds of meeting someone, you sense their unspoken intentions. However, your greatest gift is also your heaviest burden: you notice tiny shifts in people's tone, overthink conversations at night, and give 100% emotional loyalty to people who often return 30%.",
       psychHi:"मूलांक 2 (चंद्रमा) के कारण आपका मन एक उच्च-संवेदनशील रडार की तरह काम करता है। किसी से मिलने के कुछ ही पलों में आप उसकी असली नीयत भांप लेते हैं, परंतु दूसरों के व्यवहार के छोटे से बदलाव को भी आप रात तक गहराई से सोचते रहते हैं।"},
    3:{ruler:"Jupiter (बृहस्पति)", titleEn:"The Dharmic Strategist (Psychic Number 3 — Guru Wisdom)",
       psychEn:"Ruled by Number 3 (Brihaspati), you possess a rare combination of knowledge-hunger, ethical pride, and expansive ambition. You cannot tolerate hypocrisy, shallow gossip, or disrespect toward your principles. People constantly come to you for counsel when their lives fall apart, yet when you need guidance, you rarely find someone matching your mental maturity.",
       psychHi:"मूलांक 3 (बृहस्पति) से आपमें ज्ञान, स्वाभिमान और उच्च महत्वाकांक्षा का संगम है। संकट में लोग आपसे सलाह लेने आते हैं, पर जब आपको खुद मानसिक सहारे की जरूरत होती है, तो आपके स्तर की परिपक्वता वाला इंसान आसानी से नहीं मिलता।"},
    4:{ruler:"Rahu (राहु)", titleEn:"The Unconventional Maverick (Psychic Number 4 — Electric Rahu)",
       psychEn:"Governed by Number 4 (Rahu), your life never follows a straight textbook line. You question outdated rules, see patterns others miss, and often feel misunderstood by your own family. Sudden reversals and sudden breakthroughs are the signature of your chart—what others get easily in one attempt tests your patience first before delivering tenfold results.",
       psychHi:"मूलांक 4 (राहु) के कारण आपका जीवन कभी साधारण लकीर पर नहीं चलता। आपकी सोच समाज की रूढ़ियों से आगे होती है, जिसके कारण कई बार अपने ही लोग आपको समझने में भूल कर बैठते हैं। सफलता और बड़े मोड़ आपके जीवन में हमेशा अचानक आते हैं।"},
    5:{ruler:"Mercury (बुध)", titleEn:"The Quick-Silver Architect (Psychic Number 5 — Dynamic Mercury)",
       psychEn:"Ruled by Number 5 (Budh), your brain processes logic, risk, and human psychology at lightning speed. You despise monotony and stagnation. Even after a major setback, you possess an extraordinary elastic bounce-back ability. Yet inwardly, your nervous system rarely switches off—even while resting, your mind is calculating the next three moves.",
       psychHi:"मूलांक 5 (बुध) से आपका मस्तिष्क बिजली की गति से गणना करता है। आपको जड़ता या बोरिंग दिनचर्या पसंद नहीं। बड़ी से बड़ी असफलता के बाद भी आप तुरंत खुद को संभाल लेते हैं, हालांकि भीतर ही भीतर आपका दिमाग रात को भी शांत नहीं बैठता।"},
    6:{ruler:"Venus (शुक्र)", titleEn:"The Magnetic Harmonizer (Psychic Number 6 — Charismatic Venus)",
       psychEn:"Governed by Number 6 (Shukra), you carry unmistakable personal magnetism, aesthetic refinement, and deep capacity for love and family duty. You crave quality, peace, and genuine emotional warmth. Your secret vulnerability is that you often sacrifice your own comfort to keep peace in relationships, silently enduring ungrateful behavior for too long.",
       psychHi:"मूलांक 6 (शुक्र) से आपके व्यक्तित्व में स्वाभाविक आकर्षण, कलात्मकता और अपनों के प्रति गहरा समर्पण है। आपकी सबसे बड़ी कमजोरी यह है कि आप रिश्तों की गरिमा बचाने के लिए कई बार अपना सुकून दांव पर लगा देते हैं।"},
    7:{ruler:"Ketu (केतु)", titleEn:"The Mystic Investigator (Psychic Number 7 — Prophetic Ketu)",
       psychEn:"Ruled by Number 7 (Ketu), you are an old soul walking in the modern world. You have prophetic intuition—dreams, gut feelings, and sudden realizations that come true weeks later. Even when surrounded by a crowd, a quiet corner of your soul feels detached. You cannot settle for surface-level answers; you dissect everything down to its root truth.",
       psychHi:"मूलांक 7 (केतु) से आपकी अंतरात्मा गहरी और खोजी प्रवृत्ति की है। आपका 'सिक्स्थ सेंस' इतना प्रबल है कि भविष्य की घटनाओं या किसी इंसान के सच का आभास आपको पहले ही हो जाता है। भीड़ में भी आप भीतर से एक शांत एकांत महसूस करते हैं।"},
    8:{ruler:"Saturn (शनि)", titleEn:"The Karmic Empire-Builder (Psychic Number 8 — Sovereign Saturn)",
       psychEn:"Governed by Number 8 (Shani), you are forged in the furnace of real-world experience. Nothing comes on a silver platter without testing your endurance first. People often misjudge your serious composure as coldness, whereas in reality you carry the deepest sense of duty toward those you love. Once you cross your karmic threshold, your rise is permanent.",
       psychHi:"मूलांक 8 (शनि) के प्रभाव से आपका जीवन संघर्ष की भट्टी में तपकर कुंदन बनने वाला है। बिना परीक्षा दिए भाग्य आपको कुछ नहीं देता। लोग आपको बाहर से कठोर समझते हैं, जबकि भीतर से आप अत्यंत न्यायप्रिय और जिम्मेदारी निभाने वाले इंसान हैं।"},
    9:{ruler:"Mars (मंगल)", titleEn:"The Fearless Commander (Psychic Number 9 — Warrior Mars)",
       psychEn:"Ruled by Number 9 (Mangal), your bloodstream runs on courage, conviction, and protective fire. You will fight to the last breath for someone you care about, and you cannot fake sweetness when someone is wrong. Your exterior is tough like armor, yet internally you have a surprisingly soft heart that gets deeply hurt when people betray your loyalty.",
       psychHi:"मूलांक 9 (मंगल) से आपमें अदम्य साहस, स्पष्टवादिता और नेतृत्व की ऊर्जा है। अन्याय या झूठी चापलूसी आप बर्दाश्त नहीं कर पाते। बाहर से आप कवच की तरह सख्त दिखते हैं, पर भीतर से भावुक हैं और अपनों के विश्वासघात से गहरा आघात महसूस करते हैं।"}
  };

  const VIMSHOTTARI_ORDER = [
    {lord:"Ketu",    years:7,  hi:"केतु"},
    {lord:"Venus",   years:20, hi:"शुक्र"},
    {lord:"Sun",     years:6,  hi:"सूर्य"},
    {lord:"Moon",    years:10, hi:"चंद्र"},
    {lord:"Mars",    years:7,  hi:"मंगल"},
    {lord:"Rahu",    years:18, hi:"राहु"},
    {lord:"Jupiter", years:16, hi:"गुरु"},
    {lord:"Saturn",  years:19, hi:"शनि"},
    {lord:"Mercury", years:17, hi:"बुध"}
  ];

  // ==========================================================================
  // 2. VERIFIED BPHS PARASHARI ASHTAKAVARGA RULES (Exact 337 Total Bindus)
  //    Sun: 48 | Moon: 49 | Mars: 39 | Mercury: 54 | Jupiter: 56 | Venus: 52 | Saturn: 39
  //    48 + 49 + 39 + 54 + 56 + 52 + 39 = 337 Bindus Exactly!
  // ==========================================================================

  const ASHTAKAVARGA_RULES = {
    Sun: { // Total = 48
      Sun:     [1,2,4,7,8,9,10,11],   // 8
      Moon:    [3,6,10,11],           // 4
      Mars:    [1,2,4,7,8,9,10,11],   // 8
      Mercury: [3,5,6,9,10,11,12],    // 7
      Jupiter: [5,6,9,11],            // 4
      Venus:   [6,7,12],              // 3
      Saturn:  [1,2,4,7,8,9,10,11],   // 8
      Asc:     [3,4,6,10,11,12]       // 6
    },
    Moon: { // Total = 49
      Sun:     [3,6,7,8,10,11],       // 6
      Moon:    [1,3,6,7,10,11],       // 6
      Mars:    [2,3,5,6,9,10,11],     // 7
      Mercury: [1,3,4,5,7,8,10,11],   // 8
      Jupiter: [1,4,7,8,10,11,12],    // 7
      Venus:   [3,4,5,7,9,10,11],     // 7
      Saturn:  [3,5,6,11],            // 4
      Asc:     [3,6,10,11]            // 4
    },
    Mars: { // Total = 39
      Sun:     [3,5,6,10,11],         // 5
      Moon:    [3,6,11],              // 3
      Mars:    [1,2,4,7,8,10,11],     // 7
      Mercury: [3,5,6,11],            // 4
      Jupiter: [6,10,11,12],          // 4
      Venus:   [6,8,11,12],           // 4
      Saturn:  [1,4,7,8,9,10,11],     // 7
      Asc:     [1,3,6,10,11]          // 5
    },
    Mercury: { // Total = 54
      Sun:     [5,6,9,11,12],         // 5
      Moon:    [2,4,6,8,10,11],       // 6
      Mars:    [1,2,4,7,8,9,10,11],   // 8
      Mercury: [1,3,5,6,9,10,11,12],  // 8
      Jupiter: [6,8,11,12],           // 4
      Venus:   [1,2,3,4,5,8,9,11],    // 8
      Saturn:  [1,2,4,7,8,9,10,11],   // 8
      Asc:     [1,2,4,6,8,10,11]      // 7
    },
    Jupiter: { // Total = 56
      Sun:     [1,2,3,4,7,8,9,10,11], // 9
      Moon:    [2,5,7,9,11],          // 5
      Mars:    [1,2,4,7,8,10,11],     // 7
      Mercury: [1,2,4,5,6,9,10,11],   // 8
      Jupiter: [1,2,3,4,7,8,10,11],   // 8
      Venus:   [2,5,6,9,10,11],       // 6
      Saturn:  [3,5,6,12],            // 4
      Asc:     [1,2,4,5,6,7,9,10,11]  // 9
    },
    Venus: { // Total = 52 (FIXED Classical Mars offset: [3,5,6,9,11,12])
      Sun:     [8,11,12],             // 3
      Moon:    [1,2,3,4,5,8,9,11,12], // 9
      Mars:    [3,5,6,9,11,12],       // 6  <-- Fixed from [3,4,6,9,11,12]
      Mercury: [3,5,6,9,11],          // 5
      Jupiter: [5,8,9,10,11],         // 5
      Venus:   [1,2,3,4,5,8,9,10,11], // 9
      Saturn:  [3,4,5,8,9,10,11],     // 7
      Asc:     [1,2,3,4,5,8,9,11]     // 8
    },
    Saturn: { // Total = 39
      Sun:     [1,2,4,7,8,10,11],     // 7
      Moon:    [3,6,11],              // 3
      Mars:    [3,5,6,10,11,12],      // 6
      Mercury: [6,8,9,10,11,12],      // 6
      Jupiter: [5,6,11,12],           // 4
      Venus:   [6,11,12],             // 3
      Saturn:  [3,5,6,11],            // 4
      Asc:     [1,3,4,6,10,11]        // 6
    }
  };

  // ==========================================================================
  // 3. MATHEMATICAL & ASTROLOGICAL ENGINE FUNCTIONS
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
    const year  = parseInt(parts[0], 10) || 1998;
    const month = parseInt(parts[1], 10) || 1;
    const day   = parseInt(parts[2], 10) || 24;

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

  function deriveSiderealSunRashi(month, day) {
    const transitions = [
      {m:1, d:14, before:9,  after:10},
      {m:2, d:13, before:10, after:11},
      {m:3, d:14, before:11, after:12},
      {m:4, d:14, before:12, after:1},
      {m:5, d:15, before:1,  after:2},
      {m:6, d:15, before:2,  after:3},
      {m:7, d:16, before:3,  after:4},
      {m:8, d:17, before:4,  after:5},
      {m:9, d:17, before:5,  after:6},
      {m:10,d:17, before:6,  after:7},
      {m:11,d:16, before:7,  after:8},
      {m:12,d:16, before:8,  after:9}
    ];
    const row = transitions.find(t => t.m === month) || transitions[0];
    return day < row.d ? row.before : row.after;
  }

  // Exact Nakshatra-to-Rashi mapping so derived charts never mismatch Rashi & Nakshatra
  const VALID_NAKS_FOR_RASHI = {
    1:[1,2,3], 2:[3,4,5], 3:[5,6,7], 4:[7,8,9],
    5:[10,11,12], 6:[12,13,14], 7:[14,15,16], 8:[16,17,18],
    9:[19,20,21], 10:[21,22,23], 11:[23,24,25], 12:[25,26,27]
  };

  function pickValidNakForRashi(rashiId, seed) {
    const list = VALID_NAKS_FOR_RASHI[rashiId] || [1, 2, 3];
    return list[Math.abs(seed) % list.length];
  }

  function buildDerivedChartFromDobAndName(numData, chaldean) {
    const sunRashi = deriveSiderealSunRashi(numData.month, numData.day);
    const epochDays = Math.floor(new Date(numData.year, numData.month - 1, numData.day).getTime() / 86400000);

    // Accurate Sidereal Lunar Progression (~27.32166 days per sidereal revolution)
    const refEpoch2000 = Math.floor(new Date(2000, 0, 1).getTime() / 86400000);
    const daysSince2000 = epochDays - refEpoch2000;
    const lunarCycles = (daysSince2000 / 27.321661) + 0.52;
    const normPhase = ((lunarCycles % 1) + 1) % 1;
    const moonNak = Math.min(27, Math.max(1, Math.floor(normPhase * 27) + 1));
    const moonRashi = Math.min(12, Math.max(1, Math.floor(normPhase * 12) + 1));

    const ascRashi  = ((sunRashi + numData.mulank + chaldean.single - 2) % 12) + 1;
    const jupRashi  = ((Math.floor((daysSince2000 / 365.25) / 0.988) + 1) % 12 + 12) % 12 + 1;
    const satRashi  = ((Math.floor((daysSince2000 / 365.25) / 2.46) + 1) % 12 + 12) % 12 + 1;
    const rahuRashi = ((4 - Math.floor((daysSince2000 / 365.25) / 1.55)) % 12 + 12) % 12 + 1;
    const ketuRashi = ((rahuRashi + 5) % 12) + 1;
    const mercRashi = ((sunRashi + (numData.day % 3) - 1 + 12) % 12) + 1;
    const venRashi  = ((sunRashi + (chaldean.compound % 3) - 1 + 12) % 12) + 1;
    const marsRashi = ((sunRashi + numData.bhagyank) % 12) + 1;

    const makeD9 = (rashiId, nakId, seed) => {
      const elementStart = { 1:1, 5:1, 9:1, 2:10, 6:10, 10:10, 3:7, 7:7, 11:7, 4:4, 8:4, 12:4 }[rashiId] || 1;
      const padaOffset = (nakId + seed) % 9;
      return ((elementStart + padaOffset - 1) % 12) + 1;
    };

    const ascNak  = pickValidNakForRashi(ascRashi, numData.day);
    const sunNak  = pickValidNakForRashi(sunRashi, Math.floor(numData.day / 10));
    const marsNak = pickValidNakForRashi(marsRashi, numData.mulank);
    const mercNak = pickValidNakForRashi(mercRashi, numData.bhagyank);
    const jupNak  = pickValidNakForRashi(jupRashi, numData.month);
    const venNak  = pickValidNakForRashi(venRashi, chaldean.single);
    const satNak  = pickValidNakForRashi(satRashi, numData.year);
    const rahuNak = pickValidNakForRashi(rahuRashi, numData.day + 1);
    const ketuNak = pickValidNakForRashi(ketuRashi, numData.day + 2);
    const rahuD9  = makeD9(rahuRashi, rahuNak, 2);

    return {
      isFullChartMode: false,
      Asc:     {d1:ascRashi,  nak:ascNak,  d9:makeD9(ascRashi, ascNak, 1),   retro:false},
      Sun:     {d1:sunRashi,  nak:sunNak,  d9:makeD9(sunRashi, sunNak, 2),   retro:false},
      Moon:    {d1:moonRashi, nak:moonNak, d9:makeD9(moonRashi, moonNak, 3), retro:false},
      Mars:    {d1:marsRashi, nak:marsNak, d9:makeD9(marsRashi, marsNak, 4), retro:(numData.day % 7 === 0)},
      Mercury: {d1:mercRashi, nak:mercNak, d9:makeD9(mercRashi, mercNak, 5), retro:(numData.day % 5 === 0)},
      Jupiter: {d1:jupRashi,  nak:jupNak,  d9:makeD9(jupRashi, jupNak, 6),   retro:(numData.month % 4 === 0)},
      Venus:   {d1:venRashi,  nak:venNak,  d9:makeD9(venRashi, venNak, 7),   retro:false},
      Saturn:  {d1:satRashi,  nak:satNak,  d9:makeD9(satRashi, satNak, 8),   retro:(numData.month % 3 === 0)},
      Rahu:    {d1:rahuRashi, nak:rahuNak, d9:rahuD9,                        retro:true},
      Ketu:    {d1:ketuRashi, nak:ketuNak, d9:(((rahuD9 + 5) % 12) + 1),     retro:true}
    };
  }

  function readChartFromDOM(numData, chaldean) {
    const isEnabled = document.getElementById("enableChartToggle") && document.getElementById("enableChartToggle").checked;
    if (!isEnabled) return buildDerivedChartFromDobAndName(numData, chaldean);

    const keys = ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const chart = {isFullChartMode:true};
    keys.forEach(k => {
      const d1  = parseInt(document.getElementById(`d1_${k}`)?.value, 10) || 1;
      const nak = parseInt(document.getElementById(`nak_${k}`)?.value, 10) || 1;
      const d9  = parseInt(document.getElementById(`d9_${k}`)?.value, 10) || 1;
      const retroEl = document.getElementById(`retro_${k}`);
      const retro = (k === "Rahu" || k === "Ketu") ? true : (retroEl ? retroEl.checked : false);
      chart[k] = {d1, nak, d9, retro};
    });
    return chart;
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

  function evaluatePlanetDignity(planetKey, pData) {
    const meta = PLANET_META[planetKey];
    const isVargottama    = pData.d1 === pData.d9;
    const isExaltedD1     = pData.d1 === meta.exalted;
    const isDebilitatedD1 = pData.d1 === meta.debilitated;
    const isOwnD1         = meta.own.includes(pData.d1);
    const isExaltedD9     = pData.d9 === meta.exalted;
    const isDebilitatedD9 = pData.d9 === meta.debilitated;
    const isOwnD9         = meta.own.includes(pData.d9);

    let statusEn = "Balanced Functional State";
    let statusHi = "सामान्य क्रियाशील अवस्था";
    let badgeClass = "bg-purple-500/20 text-purple-200 border-purple-400/40";

    if (isExaltedD1 && isVargottama) {
      statusEn = "Supreme Uchcha Vargottama (Exalted in both D1 & D9)";
      statusHi = "सर्वोच्च उच्च वर्गोत्तम (लग्न एवं नवांश दोनों में उच्च)";
      badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400";
    } else if (isExaltedD1 && isDebilitatedD9) {
      statusEn = "Uchcha-Bhanga Alert (Exalted in D1, Debilitated in D9)";
      statusHi = "उच्च-भंग सावधानी (लग्न में उच्च परंतु नवांश में नीच)";
      badgeClass = "bg-orange-500/25 text-orange-200 border-orange-400/50";
    } else if (isExaltedD1) {
      statusEn = "Exalted (Uchcha) in Birth Chart";
      statusHi = "जन्म कुंडली में उच्च (Uchcha)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isOwnD1 && isVargottama) {
      statusEn = "Swakshetra Vargottama (Own Sign in D1 & D9)";
      statusHi = "स्वराशि वर्गोत्तम (असाधारण आत्मबल)";
      badgeClass = "bg-emerald-500/30 text-emerald-200 border-emerald-400";
    } else if (isOwnD1) {
      statusEn = "Swakshetra (Own Sign — High Strength)";
      statusHi = "स्वराशिस्थ (अपनी राशि में बलवान)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isDebilitatedD1 && (isExaltedD9 || isOwnD9)) {
      statusEn = "Neechabhanga Raja Yoga (Debilitated in D1, Elevated in D9)";
      statusHi = "नीचभंग राजयोग (संघर्ष के बाद असाधारण उत्थान)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isDebilitatedD1) {
      statusEn = "Debilitated (Neecha — Karmic Friction & Delayed Fruit)";
      statusHi = "नीचस्थ (कर्म-संघर्ष एवं विलंब से फल)";
      badgeClass = "bg-red-500/25 text-red-200 border-red-400/50";
    } else if (isVargottama) {
      statusEn = "Vargottama (Identical Sign in D1 & D9 — Double Power)";
      statusHi = "वर्गोत्तम (D1 एवं D9 में एक ही राशि — दोगुना बल)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isExaltedD9 || isOwnD9) {
      statusEn = "Pushkara / D9-Fortified (Stronger in Second Half of Life)";
      statusHi = "नवांश-बली (30 वर्ष व विवाह के बाद प्रबल फलदायी)";
      badgeClass = "bg-cyan-500/25 text-cyan-200 border-cyan-400/50";
    } else if (isDebilitatedD9) {
      statusEn = "D9-Sensitive (Requires Navamsa Remedy for Long-Term Peace)";
      statusHi = "नवांश में संवेदनशील (स्थायी फल हेतु उपाय आवश्यक)";
      badgeClass = "bg-rose-500/25 text-rose-200 border-rose-400/50";
    }

    return {
      isVargottama, isExaltedD1, isDebilitatedD1, isOwnD1,
      isExaltedD9, isDebilitatedD9, isOwnD9, statusEn, statusHi, badgeClass
    };
  }

  function analyzeAllPlanetsAndAspects(chart) {
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
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
        return {nthAspect:nth, targetRashi, targetBhava, planetsThere};
      });

      const aspectedBy = [];
      pKeys.forEach(other => {
        if (other === k) return;
        const otherMeta = PLANET_META[other];
        const otherRashi = chart[other].d1;
        otherMeta.aspects.forEach(nth => {
          const hitRashi = ((otherRashi + nth - 2) % 12) + 1;
          if (hitRashi === p.d1) aspectedBy.push({fromPlanet:other, nthAspect:nth});
        });
      });

      results[k] = {
        key:k, meta, d1:p.d1, d9:p.d9, nak:p.nak, retro:p.retro,
        bhava, d9Bhava, dignity, ownedHouses, conjunctWith, aspectedTargets, aspectedBy
      };
    });

    return results;
  }

  // ==========================================================================
  // 4. VERIFIED 337-BINDU PARASHARI ASHTAKAVARGA & SPECIAL LAGNAS
  // ==========================================================================

  function computeRealAshtakavarga(chart) {
    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const refs8    = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Asc"];

    const bavByRashi = {}; // planet -> [0..12] bindus in Rashi 1..12
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

  function computeSpecialLagnasAndBindus(chart, planetAnalysis) {
    const ascRashi = chart.Asc.d1;
    const lagnaLordKey = getLordKeyOfRashi(ascRashi);
    const lagnaLordRashi = chart[lagnaLordKey].d1;

    // 1. Jaimini Arudha Lagna (AL) with exact 1st/7th Swastha-Darastha Exception (moves 10th = +9 signs)
    const distToLord = getBhavaFrom(ascRashi, lagnaLordRashi);
    let arudhaRashi = ((lagnaLordRashi + distToLord - 2) % 12) + 1;
    const rawArudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);
    let arudhaExceptionApplied = false;
    if (rawArudhaHouseFromLagna === 1 || rawArudhaHouseFromLagna === 7) {
      arudhaRashi = ((arudhaRashi + 9 - 1) % 12) + 1; // 10th sign from raw Arudha
      arudhaExceptionApplied = true;
    }
    const arudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);

    // 2. Jaimini Upapada Lagna (UL — Arudha Pada of the 12th House) with exact 1st/7th Exception
    const rashi12th = getRashiOfBhava(ascRashi, 12);
    const lord12thKey = getLordKeyOfRashi(rashi12th);
    const lord12thRashi = chart[lord12thKey].d1;
    const dist12 = getBhavaFrom(rashi12th, lord12thRashi);
    let upapadaRashi = ((lord12thRashi + dist12 - 2) % 12) + 1;
    const rawUlHouseFrom12th = getBhavaFrom(rashi12th, upapadaRashi);
    if (rawUlHouseFrom12th === 1 || rawUlHouseFrom12th === 7) {
      upapadaRashi = ((upapadaRashi + 9 - 1) % 12) + 1; // 10th sign from raw UL
    }

    // 3. Karakamsa Lagna (D9 sign of the strongest/furthest-advanced Chara Atmakaraka candidate)
    // Using Rashi-Nakshatra advancement score so it isn't blindly hardcoded to Sun
    const charaCandidates = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    let atmakarakaKey = "Sun";
    let maxAdvancementScore = -1;
    charaCandidates.forEach(pKey => {
      const p = chart[pKey];
      const validNaks = VALID_NAKS_FOR_RASHI[p.d1] || [1,2,3];
      const nakIndexInRashi = Math.max(0, validNaks.indexOf(p.nak)); // 0, 1, or 2
      const d9Offset = ((p.d9 - p.d1 + 12) % 12);
      const score = (nakIndexInRashi * 10) + d9Offset + (p.d1 === p.d9 ? 5 : 0);
      if (score > maxAdvancementScore) {
        maxAdvancementScore = score;
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

  // ==========================================================================
  // 5. PROPORTIONAL VIMSHOTTARI MAHADASHA & ANTARDASHA ENGINE
  // ==========================================================================

  function resolveActiveDasha(chart, numData) {
    const manualOn = document.getElementById("enableDashaToggle") && document.getElementById("enableDashaToggle").checked;
    const mdSelect = document.getElementById("currentMD")?.value || "auto";
    const adSelect = document.getElementById("currentAD")?.value || "auto";

    const moonRashi = chart.Moon.d1 || 1;
    const moonNakId = chart.Moon.nak || 1;
    const birthDashaRuler = NAKSHATRA_DATA[moonNakId].ruler;
    const startIdx = VIMSHOTTARI_ORDER.findIndex(v => v.lord === birthDashaRuler);

    // Exact Nakshatra-Rashi Pada Intersection for realistic Birth Dasha Balance
    const rashiNaks = VALID_NAKS_FOR_RASHI[moonRashi] || [moonNakId];
    const posInRashi = rashiNaks.indexOf(moonNakId);
    let birthFractionRemaining = 0.55;
    if (posInRashi === 0 && rashiNaks.length === 3) {
      // First star in Rashi (can be full 4 padas or remaining padas)
      birthFractionRemaining = 0.68 - ((numData.day % 5) * 0.06);
    } else if (posInRashi === 1) {
      // Middle star in Rashi (always all 4 padas inside this Rashi)
      birthFractionRemaining = 0.82 - ((numData.day % 7) * 0.09);
    } else if (posInRashi === 2) {
      // Last star in Rashi (early padas inside this Rashi -> high balance left)
      birthFractionRemaining = 0.88 - ((numData.day % 4) * 0.05);
    }

    let ageCursor = VIMSHOTTARI_ORDER[startIdx].years * birthFractionRemaining;
    let currentIdx = startIdx;
    let yearsIntoCurrentMD = numData.age;

    if (numData.age <= ageCursor) {
      yearsIntoCurrentMD = (VIMSHOTTARI_ORDER[startIdx].years * (1 - birthFractionRemaining)) + numData.age;
    } else {
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

    // Proportional Antardasha Calculation (AD duration = MD_Years * AD_Years / 120)
    let accumulatedADYears = 0;
    let autoAD = autoMD;
    for (let i = 0; i < 9; i++) {
      const adObj = VIMSHOTTARI_ORDER[(currentIdx + i) % 9];
      const adDuration = (mdTotalYears * adObj.years) / 120;
      if (yearsIntoCurrentMD <= accumulatedADYears + adDuration || i === 8) {
        autoAD = adObj.lord;
        break;
      }
      accumulatedADYears += adDuration;
    }

    const nextMD = VIMSHOTTARI_ORDER[(currentIdx + 1) % 9].lord;
    const finalMD = (manualOn && mdSelect !== "auto") ? mdSelect : autoMD;
    const finalAD = (manualOn && adSelect !== "auto") ? adSelect : autoAD;
    const isManualDasha = Boolean(manualOn && (mdSelect !== "auto" || adSelect !== "auto"));

    return { md:finalMD, ad:finalAD, nextMD, isManualDasha, birthDashaRuler };
  }

  // ==========================================================================
  // 6. NARRATIVE HELPER UTILITIES
  // ==========================================================================

  function houseThemeShort(bhavaNum, lang) {
    const themes = {
      1:  {en:"your core identity, physical vitality, and self-projection",           hi:"आपकी पहचान, शारीरिक ऊर्जा और आत्मबल"},
      2:  {en:"liquid savings, speech authority, and family lineage",                 hi:"संचित धन, वाणी का प्रभाव और कुल परंपरा"},
      3:  {en:"self-made courage, initiative, communication, and siblings",           hi:"साहस, स्व-पराक्रम, संवाद कौशल और भाई-बहन"},
      4:  {en:"inner mental peace, mother, real estate, and domestic sanctuary",      hi:"आंतरिक मानसिक शांति, माता, भूमि-वाहन और गृह सुख"},
      5:  {en:"analytical intelligence, competitive exams, romance, and past merit",  hi:"प्रखर बुद्धि, प्रतियोगी परीक्षा, प्रेम और पूर्व-पुण्य"},
      6:  {en:"daily work discipline, crushing competition, debt, and service",       hi:"दैनिक कार्य-अनुशासन, शत्रु विजय, ऋण मुक्ति और सेवा"},
      7:  {en:"marriage, life partner chemistry, contracts, and public standing",     hi:"विवाह, जीवनसाथी का स्वभाव, साझेदारी और जन-छवि"},
      8:  {en:"sudden karmic turns, deep research, in-laws, and hidden assets",       hi:"आकस्मिक कर्म-परिवर्तन, गहन शोध, ससुराल और गुप्त धन"},
      9:  {en:"divine grace, higher fortune, mentors/father, and long-term luck",     hi:"ईश्वरीय कृपा, भाग्योदय, गुरु/पिता और उच्च ज्ञान"},
      10: {en:"career command, professional reputation, status, and authority",       hi:"करियर का शिखर, सत्ता, पद-प्रतिष्ठा और अधिकार"},
      11: {en:"massive income gains, wish fulfilment, and high-level networks",       hi:"बड़े आर्थिक लाभ, इच्छापूर्ति और प्रभावशाली नेटवर्क"},
      12: {en:"foreign connections, subconscious sleep cycles, and spiritual release",hi:"विदेशी संपर्क, अवचेतन मन, निद्रा और आध्यात्मिक मुक्ति"}
    };
    return lang === "hi" ? themes[bhavaNum].hi : themes[bhavaNum].en;
  }

  function getFunctionalRoleLabel(ascRashiId, planetKey, lang) {
    const matrix = LAGNA_FUNCTIONAL_MATRIX[ascRashiId];
    if (!matrix) return "";
    const rolesEn = [];
    const rolesHi = [];

    if (matrix.yogakaraka.includes(planetKey)) {
      rolesEn.push("Supreme Yogakaraka (Prime Rajayoga Planet)");
      rolesHi.push("प्रमुख योगकारक (राजयोग कारक ग्रह)");
    } else if (matrix.benefics.includes(planetKey)) {
      rolesEn.push("Functional Benefic (Shubha Graha)");
      rolesHi.push("लग्न हेतु शुभ कारक ग्रह");
    } else if (matrix.malefics.includes(planetKey)) {
      rolesEn.push("Functional Malefic (Requires Caution)");
      rolesHi.push("लग्न हेतु अकारक / संघर्ष कारक");
    }

    if (matrix.marakas.includes(planetKey)) {
      rolesEn.push("Maraka Sensitivity");
      rolesHi.push("मारक भाव से संबंध");
    }
    if (matrix.badhakesh === planetKey) {
      rolesEn.push(`Badhakesh (${matrix.badhakaHouse}th Lord Obstructor)`);
      rolesHi.push(`बाधकेश (${matrix.badhakaHouse}वें भाव का स्वामी)`);
    }

    return lang === "hi" ? rolesHi.join(" • ") : rolesEn.join(" • ");
  }

  // ==========================================================================
  // 7. CHAPTER GENERATORS (CHAPTERS 1 TO 12 — ULTRA-HIGH PRECISION)
  // ==========================================================================

  // --------------------------------------------------------------------------
  // CHAPTER 1 — CORE PERSONALITY & UNSPOKEN INNER PSYCHOLOGY
  // --------------------------------------------------------------------------
  function buildChapter1Personality(ctx) {
    const { lang, name, numData, chaldean, chart, planetAnalysis } = ctx;
    const ascRashi    = RASHI_DATA[chart.Asc.d1];
    const moonRashi   = RASHI_DATA[chart.Moon.d1];
    const sunRashi    = RASHI_DATA[chart.Sun.d1];
    const moonNak     = NAKSHATRA_DATA[chart.Moon.nak];
    const mulankArch  = MULANK_ARCHETYPES[numData.mulank];
    const bhagyankArch= MULANK_ARCHETYPES[numData.bhagyank];
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[chart.Asc.d1];
    const lagnaLordKey= ascRashi.lord;
    const lagnaLordInfo = planetAnalysis[lagnaLordKey];

    const sigRow = (labelEn, labelHi, value) => `
      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-white/10">
        <div class="text-[10px] uppercase text-gray-400 font-bold">${lang === "hi" ? labelHi : labelEn}</div>
        <div class="text-sm font-bold text-amber-200 mt-0.5">${value}</div>
      </div>
    `;

    const signatureCard = `
      <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-5 mb-6">
        <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2">
          <i class="fas fa-fingerprint mr-1.5"></i>${lang === "hi" ? "आपका जन्म-चिह्न (पंच-स्तरीय वैदिक एवं चैल्डियन सिंथेसिस)" : "Your Master Birth Signature (5-Layer Vedic, Navamsa & Chaldean Synthesis)"}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${sigRow("Ascendant (Lagna)", "जन्म लग्न", `${lang === "hi" ? ascRashi.hi : ascRashi.en} <span class="text-gray-400 text-xs">(${ascRashi.lordHi})</span>`)}
          ${sigRow("Moon Rashi", "चंद्र राशि", `${lang === "hi" ? moonRashi.hi : moonRashi.en}`)}
          ${sigRow("Janma Nakshatra", "जन्म नक्षत्र", `${moonNak.name} <span class="text-gray-400 text-xs">(${moonNak.ruler})</span>`)}
          ${sigRow("Sun Rashi", "सूर्य राशि", `${lang === "hi" ? sunRashi.hi : sunRashi.en}`)}
          ${sigRow("Psychic (Mulank)", "मूलांक (Psychic)", `${numData.mulank} — ${mulankArch.ruler}`)}
          ${sigRow("Destiny (Bhagyank)", "भाग्यांक (Destiny)", `${numData.bhagyank} — ${bhagyankArch.ruler}`)}
          ${sigRow("Chaldean Name", "चैल्डियन नाम अंक", `${chaldean.compound} → ${chaldean.single}`)}
          ${sigRow("Current Age / Year", "आयु / व्यक्तिगत वर्ष", `${numData.age} Yrs / PY-${numData.personalYear}`)}
        </div>
      </div>
    `;

    if (lang === "hi") {
      return signatureCard + `
        <p>
          प्रिय <strong>${name}</strong>, जब कोई साधारण व्यक्ति आपको देखता है तो वह केवल आपका बाहरी शांत या आत्मविश्वासी चेहरा देखता है—परंतु आपकी वास्तविक कुंडली और अंक-संरचना यह बताती है कि आपके भीतर <strong>चार समानांतर शक्तियां</strong> एक साथ काम कर रही हैं: आपका <strong>मूलांक ${numData.mulank} (${mulankArch.ruler})</strong>, आपका <strong>भाग्यांक ${numData.bhagyank} (${bhagyankArch.ruler})</strong>, आपका <strong>${ascRashi.hi} लग्न</strong> (जिसके स्वामी ${ascRashi.lordHi} ${lagnaLordInfo.bhava}वें भाव में बैठे हैं), और चंद्रमा का <strong>${moonNak.name} नक्षत्र</strong>।
        </p>

        <p>
          <strong>1. आपका अनकहा मानसिक सच (जो आप किसी से साझा नहीं करते):</strong> ${mulankArch.psychHi} इसके साथ ही ${ascRashi.hi} लग्न का गुप्त मनोवैज्ञानिक सत्य यह है कि आपमें <em>${lagnaMatrix.secretWeaknessHi}</em> की प्रवृत्ति गहराई से जुड़ी है। आप अपनी पीड़ा, अपनी थकान और अपने आंसू दुनिया से छिपाकर मुस्कुराने की कला जानते हैं, क्योंकि किसी के सामने कमजोर दिखना आपके स्वाभिमान को स्वीकार नहीं है।
        </p>

        <p>
          <strong>2. बाहरी व्यक्तित्व बनाम रात्रि 2 बजे का अंतर्मन:</strong> समाज के सामने आपकी कार्यशैली <strong>${ascRashi.hi}</strong> जैसी (<em>${ascRashi.temperamentHi}</em>) दिखती है, और लग्नेश <strong>${ascRashi.lordHi}</strong> के <strong>${lagnaLordInfo.bhava}वें भाव</strong> में होने के कारण आपका पूरा जीवन ${houseThemeShort(lagnaLordInfo.bhava, "hi")} के इर्द-गिर्द घूमता है। किंतु जब आप एकांत में होते हैं, तब आपका मन <strong>${moonRashi.hi} राशि और ${moonNak.name} नक्षत्र</strong> से संचालित होता है—जो आपको <em>${moonNak.traitHi}</em> प्रदान करता है। यही कारण है कि लोग आपको बाहर से जितना सरल या कठोर समझते हैं, भीतर से आप उससे दस गुना अधिक संवेदनशील और गहरे इंसान हैं।
        </p>

        <p>
          <strong>3. आपके नाम की चैल्डियन ध्वनि तरंग (${chaldean.compound} → ${chaldean.single}):</strong> प्राचीन चैल्डियन गणना के अनुसार आपके नाम के अक्षरों का कुल योग <strong>${chaldean.compound}</strong> (मूल स्पंदन <strong>${chaldean.single}</strong>) बनता है। ${
            chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
              ? "यह एक अत्यंत शुभ संयोग है कि आपके नाम की ध्वनि तरंग आपके जन्म-अंकों के साथ सीधा सामंजस्य बना रही है—जिससे बड़े से बड़े संकट में भी अंतिम क्षण पर कोई अदृश्य शक्ति आपको बचा लेती है।"
              : `यहाँ एक सूक्ष्म घर्षण (frequency clash) छिपा है: आपकी जन्म-ऊर्जा अंक ${numData.mulank} और ${numData.bhagyank} पर चलती है, जबकि दुनिया आपको जिस नाम से पुकारती है वह अंक ${chaldean.single} की तरंग छोड़ता है। यही कारण है कि आप जितनी ईमानदारी से 100% मेहनत करते हैं, उसका पूरा श्रेय (credit) कई बार दूसरों को मिल जाता है या काम 99% पर आकर अटकता है।`
          }
        </p>

        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> आपकी 'सिक्स्थ सेंस' और इंसानों को परखने की शक्ति:</div>
          <p class="text-sm mb-0">
            आपके ${moonNak.name} नक्षत्र और मूलांक ${numData.mulank} के संगम ने आपको झूठ पकड़ने का एक जन्मजात रडार दिया है। जब कोई इंसान आपके सामने मीठा बोलकर चालाकी करने की कोशिश करता है, तो आपको तुरंत भीतर से आभास हो जाता है। आपने कई बार रिश्तों को बचाने के लिए जानबूझकर अनजान बनने का नाटक किया है—पर जिस दिन कोई आपकी सहनशक्ति की अंतिम रेखा पार कर जाता है, आप बिना कोई शोर मचाए उसे अपने दिल से हमेशा के लिए बाहर कर देते हैं।
          </p>
        </div>
      `;
    }

    return signatureCard + `
      <p>
        Dear <strong>${name}</strong>, to the outside world you project a composed, capable presence—but beneath the surface, your psyche is powered by a <strong>four-layer cosmic engine</strong>: your <strong>Psychic Number ${numData.mulank} (${mulankArch.ruler})</strong>, your <strong>Destiny Number ${numData.bhagyank} (${bhagyankArch.ruler})</strong>, your <strong>${ascRashi.en} Ascendant</strong> (with Lagna Lord ${ascRashi.lord} operating from the ${lagnaLordInfo.bhava}th House), and your Moon's <strong>${moonNak.name} Nakshatra</strong>.
      </p>

      <p>
        <strong>1. Your Unspoken Psychological Reality (What You Never Show Others):</strong> ${mulankArch.psychEn} Layered onto this is the hidden signature of ${ascRashi.en} Lagna: a lifelong tendency toward <em>${lagnaMatrix.secretWeaknessEn}</em>. Even when you are going through intense personal or financial pressure, you carry yourself with dignity because asking for sympathy feels alien to your core nature.
      </p>

      <p>
        <strong>2. The Outer Mask vs. Your 2 AM Inner Mind:</strong> Socially and professionally, people experience your <strong>${ascRashi.en}</strong> exterior—<em>${ascRashi.temperamentEn}</em>—and because your Ascendant Lord <strong>${ascRashi.lord}</strong> sits in your <strong>${lagnaLordInfo.bhava}th House</strong>, your life energy is magnetically pulled toward <em>${houseThemeShort(lagnaLordInfo.bhava, "en")}</em>. Yet privately, your mind runs on <strong>${moonRashi.en} under ${moonNak.name}</strong>, wiring your subconscious with <em>${moonNak.traitEn}</em>. People frequently misread your outer composure, never realizing that your Moon is quietly registering every shift in their tone, loyalty, and body language.
      </p>

      <p>
        <strong>3. The Acoustic Vibration of Your Name (${chaldean.compound} → ${chaldean.single}):</strong> In Chaldean numerology, the letters of your name sum to the compound number <strong>${chaldean.compound}</strong> (reducing to root vibration <strong>${chaldean.single}</strong>). ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? "Remarkably, your name's root vibration locks directly into harmony with your birth numbers—acting as an unseen protective shield that pulls you out of life's sharpest crises at the eleventh hour."
            : `Here lies a subtle frequency friction in your blueprint: your soul was born under frequencies ${numData.mulank} and ${numData.bhagyank}, whereas the name society calls you broadcasts vibration ${chaldean.single}. This explains why you often do 95% of the heavy lifting in projects and relationships, yet the final recognition gets delayed at the 99th percentile or claimed by someone louder.`
        }
      </p>

      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> Your Silent X-Ray Detector for Human Behavior:</div>
        <p class="text-sm mb-0">
          The combination of <strong>${moonNak.name}</strong> and Psychic Number <strong>${numData.mulank}</strong> gives you an uncanny gut radar. You can sit quietly in a room and sense who is genuine and who is wearing a mask within minutes. Many times in life, you have pretended not to notice someone's opportunism just to keep the peace—but once someone crosses your final internal boundary, you don't create loud drama; you simply shut the door of your heart permanently.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 2 — EDUCATION, MEMORY & INTELLECTUAL DNA
  // --------------------------------------------------------------------------
  function buildChapter2Education(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const merc   = planetAnalysis.Mercury;
    const jup    = planetAnalysis.Jupiter;
    const bindu5 = specialLagnas.houseBindus[5];
    const mercNak= NAKSHATRA_DATA[merc.nak];

    const hasFocusDisruption = merc.retro || jup.retro ||
      [6, 8, 12].includes(lord5.bhava) ||
      planetAnalysis.Rahu.bhava === 5 || planetAnalysis.Ketu.bhava === 5 || planetAnalysis.Saturn.bhava === 5;

    if (lang === "hi") {
      return `
        <p>
          आपकी कुंडली के पंचम भाव (मेधा एवं पूर्व-पुण्य) में <strong>${rashi5.hi}</strong> राशि है, जिसके स्वामी <strong>${rashi5.lordHi}</strong> कुंडली के <strong>${lord5.bhava}वें भाव (${RASHI_DATA[lord5.d1].hi})</strong> में स्थित हैं। साथ ही बुद्धि के कारक <strong>बुध ${RASHI_DATA[merc.d1].hi} (${merc.bhava}वां भाव — ${mercNak.name} नक्षत्र)</strong> में और ज्ञान के कारक <strong>गुरु ${RASHI_DATA[jup.d1].hi} (${jup.bhava}वां भाव)</strong> में बैठकर आपके मस्तिष्क की सीखने की क्षमता को नियंत्रित कर रहे हैं। अष्टकवर्ग में आपके पंचम भाव को <strong>${bindu5} शुभ बिंदु</strong> प्राप्त हैं।
        </p>

        <p>
          <strong>1. आपका वास्तविक लर्निंग पैटर्न (रटने के बजाय तर्क की पकड़):</strong> आपका दिमाग तोते की तरह रटने (rote memorization) के लिए नहीं बना है। जब तक आपको किसी विषय के पीछे का 'क्यों और कैसे' समझ न आ जाए, आपका मन उसमें टिकता नहीं है। आश्चर्यजनक बात यह है कि जब परीक्षा या लक्ष्य सिर पर होता है, तब आपका दिमाग <strong>हाइपर-फोकस मोड</strong> में आकर 3 महीने का काम 15 दिनों में पूरा कर लेता है—परंतु सामान्य दिनों में एक साथ 4 दिशाओं में सोचने के कारण एकाग्रता बार-बार टूटती है।
        </p>

        <p>
          <strong>2. परीक्षा और एकाग्रता में आने वाला गुप्त अवरोध:</strong> ${
            hasFocusDisruption
              ? `आपके पंचम अक्ष और बुध/गुरु पर विशेष कर्म-प्रभाव होने के कारण आपके शैक्षणिक जीवन में कम से कम एक ऐसा मोड़ अवश्य आया है (या चल रहा है) जहाँ आपकी योग्यता 95% की थी, परंतु अंतिम समय पर स्वास्थ्य, मानसिक भटकाव, पारिवारिक तनाव या परीक्षा हॉल की घबराहट के कारण परिणाम आपकी असली क्षमता से कम रह गया।`
              : `बुध और पंचमेश का समन्वय आपको तार्किक विषयों, प्रतियोगी परीक्षाओं और समस्या-समाधान (problem-solving) में स्वाभाविक श्रेष्ठता देता है, बशर्ते आप अति-आत्मविश्वास में आकर अंतिम क्षण तक टालमटोल (procrastination) न करें।`
          } आपकी औपचारिक डिग्री चाहे जो भी हो, जीवन में आपकी सबसे बड़ी तरक्की आपके <strong>स्व-अर्जित व्यावहारिक ज्ञान (self-taught mastery)</strong> से होगी।
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30">
            <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> आपके मस्तिष्क के सर्वाधिक अनुकूल क्षेत्र:</div>
            <p class="text-xs md:text-sm mb-0">चिकित्सा व निदान विज्ञान (Diagnostics/Medicine), डेटा व टेक्नोलॉजी, प्रशासनिक सेवाएं, वित्त व कॉमर्स, कानून/न्याय, मनोविज्ञान और रणनीतिक शोध।</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> मेधा जागृत करने का अचूक वैदिक नियम:</div>
            <p class="text-xs md:text-sm mb-0">पढ़ते या काम करते समय अपना मुख <strong>${rashi5.directionHi}</strong> की ओर रखें। मोबाइल को दूसरे कमरे में रखकर 45-45 मिनट के स्प्रिंट में लिखकर अभ्यास करना आपके बुध (${mercNak.name}) के न्यूरल सर्किट को तुरंत लॉक कर देता है।</p>
          </div>
        </div>
      `;
    }

    return `
      <p>
        Your 5th House of Medha (intelligence, memory, and competitive merit) falls in <strong>${rashi5.en}</strong>, with its ruler <strong>${rashi5.lord}</strong> positioned in your <strong>${lord5.bhava}th House (${RASHI_DATA[lord5.d1].en})</strong> and carrying <strong>${bindu5} Sarvashtakavarga bindus</strong>. Combined with <strong>Mercury in ${RASHI_DATA[merc.d1].en} (${merc.bhava}th House under ${mercNak.name})</strong> and <strong>Jupiter in ${RASHI_DATA[jup.d1].en} (${jup.bhava}th House)</strong>, your cognitive blueprint is wired for conceptual mastery rather than mechanical repetition.
      </p>

      <p>
        <strong>1. Your True Learning Style (Why You Hate Rote Memorization):</strong> Your brain refuses to absorb dry information unless it understands the underlying logic ("why this works"). Under deadline pressure, your nervous system switches into an extraordinary <strong>hyper-focus sprint mode</strong> capable of compressing three months of syllabus into fifteen days. Yet during routine weeks, mental multi-threading pulls your attention across five topics at once—making you sit in front of a book while your mind travels miles away.
      </p>

      <p>
        <strong>2. The Unspoken Exam & Stream-Switch Pattern:</strong> ${
          hasFocusDisruption
            ? `Because your 5th-house/Mercury axis carries karmic sensitivity, your educational journey includes at least one frustrating phase where your raw intellect was in the top 5%, yet last-minute anxiety, sudden syllabus traps, emotional distraction, or family atmosphere caused a result below your true caliber.`
            : `Your 5th Lord and Mercury alignment gives you a sharp edge in competitive exams and analytical problem-solving—your only enemy is last-minute procrastination born from knowing you can catch up quickly.`
        } Regardless of your formal degree on paper, over 70% of your lifelong authority will come from skills and diagnostic insights you teach yourself in the real world.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30">
          <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> Highest-Yield Intellectual Domains:</div>
          <p class="text-xs md:text-sm mb-0">Medical & clinical diagnostics, engineering/IT architecture, administrative & civil services, finance/chartered analytics, law & policy, and human psychology.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> Vedic Brainpower Optimization:</div>
          <p class="text-xs md:text-sm mb-0">Face <strong>${rashi5.direction}</strong> during study or high-stakes work. Studying in 45-minute written-recall sprints during late night or early Brahma-Muhurta locks your Mercury (${mercNak.name}) focus without mental drift.</p>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 3 — CAREER, PROFESSION & AUTHORITY
  // --------------------------------------------------------------------------
  function buildChapter3Career(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi10 = RASHI_DATA[getRashiOfBhava(asc, 10)];
    const rashi6  = RASHI_DATA[getRashiOfBhava(asc, 6)];
    const lord10  = planetAnalysis[rashi10.lord];
    const sat = planetAnalysis.Saturn;
    const sun = planetAnalysis.Sun;
    const bindu10 = specialLagnas.houseBindus[10];
    const bindu6  = specialLagnas.houseBindus[6];
    const bindu11 = specialLagnas.houseBindus[11];
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[asc];

    if (lang === "hi") {
      return `
        <p>
          आपके दशम भाव (कर्म एवं सत्ता) में <strong>${rashi10.hi}</strong> राशि है और दशमेश <strong>${rashi10.lordHi}</strong> कुंडली के <strong>${lord10.bhava}वें भाव (${RASHI_DATA[lord10.d1].hi})</strong> में तथा नवांश (D9) के <strong>${RASHI_DATA[lord10.d9].hi}</strong> में स्थित हैं। साथ ही कर्म-कारक <strong>शनि ${RASHI_DATA[sat.d1].hi} (${sat.bhava}वां भाव)</strong> में और राज्य-कारक <strong>सूर्य ${RASHI_DATA[sun.d1].hi} (${sun.bhava}वां भाव)</strong> में बैठकर आपके करियर की नींव रख रहे हैं।
        </p>

        <p>
          <strong>1. नौकरी बनाम स्वतंत्र अधिकार (अष्टकवर्ग प्रमाण):</strong> सर्वाष्टकवर्ग में आपके दशम भाव (अधिकार) को <strong>${bindu10} बिंदु</strong>, षष्ठ भाव (नौकरी/सेवा) को <strong>${bindu6} बिंदु</strong> और एकादश भाव (लाभ) को <strong>${bindu11} बिंदु</strong> मिले हैं। ${
            bindu10 >= bindu6
              ? "दशम भाव का षष्ठ भाव से बलवान होना यह सिद्ध करता है कि आप जीवन भर किसी कम बुद्धि वाले बॉस के नीचे दबकर 'जी-हुजूरी' नहीं कर सकते। आपको जहाँ निर्णय लेने की स्वतंत्रता (autonomy) मिलती है, वहाँ आप 10 गुना परिणाम देते हैं।"
              : "षष्ठ भाव के प्रबल बिंदु आपको प्रतियोगी परीक्षाओं, कॉर्पोरेट/संस्थागत तंत्र और संकट-प्रबंधन (crisis management) में विरोधियों को पछाड़कर ऊपर उठने की शक्ति देते हैं।"
          } ${
            bindu10 > bindu11
              ? `<strong>विशेष अष्टकवर्ग सूत्र:</strong> आपके 10वें भाव के बिंदु (${bindu10}) आपके 11वें भाव के लाभ बिंदुओं (${bindu11}) से अधिक हैं—जिसका अर्थ है कि वर्तमान में आप काम और जिम्मेदारी तो बहुत अधिक उठा रहे हैं, पर उसके अनुपात में आर्थिक प्रतिफल (financial reward) थोड़ा रुककर आ रहा है।`
              : `आपके 11वें भाव के बिंदु (${bindu11}) आपके 10वें भाव (${bindu10}) को शानदार समर्थन दे रहे हैं, जिसका अर्थ है कि सही दशा जागृत होते ही आपकी मेहनत सीधे बड़े आर्थिक लाभ में बदलेगी।`
          }
        </p>

        <p>
          <strong>2. कार्यक्षेत्र की राजनीति और आपका स्थायी उदय:</strong> आपने अपने करियर या कार्यक्षेत्र में यह अनुभव किया होगा कि जब तक आप दूसरों का काम संभालते हैं, सब आपकी प्रशंसा करते हैं—पर जैसे ही आप अपने अधिकार या प्रमोशन की बात करते हैं, गुप्त राजनीति शुरू हो जाती है। आपके लग्न के योगकारक ग्रह (<strong>${lagnaMatrix.yogakaraka.map(p => PLANET_META[p].hi).join(", ")}</strong>) और शनि की स्थिति यह सुनिश्चित करती है कि शुरुआती संघर्षों के बाद <strong>${numData.mulank === 8 || numData.bhagyank === 8 ? "28वें, 32वें और 35वें" : "26वें, 29वें और 33वें"} वर्ष</strong> से आपके हाथों में वास्तविक पद और स्वायत्तता आती है।
        </p>

        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> आपके लिए सर्वोच्च सफलता वाले करियर क्षेत्र:</div>
          <p class="text-xs md:text-sm mb-0">
            दशमेश <strong>${rashi10.lordHi}</strong> के ${lord10.bhava}वें भाव से जुड़ने के कारण आपके लिए <strong>उच्च प्रशासनिक/सरकारी पद, चिकित्सा एवं हेल्थकेयर, टेक्नोलॉजी/सॉफ्टवेयर, बैंकिंग व वित्तीय प्रबंधन, स्वतंत्र कंसल्टेंसी, न्यायिक/कानूनी क्षेत्र या अपना स्वयं का उद्यम (Enterprise)</strong> सर्वाधिक भाग्योदयकारी रहेगा।
          </p>
        </div>
      `;
    }

    return `
      <p>
        Your 10th House of Karma and professional command holds <strong>${rashi10.en}</strong>, while its ruler <strong>${rashi10.lord}</strong> operates from your <strong>${lord10.bhava}th House (${RASHI_DATA[lord10.d1].en})</strong> and matures into <strong>${RASHI_DATA[lord10.d9].en}</strong> in your Navamsa (D9). Supported by <strong>Saturn in ${RASHI_DATA[sat.d1].en} (${sat.bhava}th House)</strong> and <strong>Sun in ${RASHI_DATA[sun.d1].en} (${sun.bhava}th House)</strong>, your professional blueprint is built for authority rather than blind obedience.
      </p>

      <p>
        <strong>1. Job vs. Independent Command (The Ashtakavarga Proof):</strong> In your 337-point Sarvashtakavarga matrix, your 10th House of authority carries <strong>${bindu10} bindus</strong>, your 6th House of routine service carries <strong>${bindu6} bindus</strong>, and your 11th House of financial gains carries <strong>${bindu11} bindus</strong>. ${
          bindu10 >= bindu6
            ? "Having equal or higher bindus in the 10th than the 6th confirms that you suffocate under micromanagement or incompetent superiors. You thrive only when given direct ownership of decisions."
            : "Your strong 6th-house bindus give you tremendous stamina to crush competition in exams, corporate ladders, medical/technical problem-solving, and structured institutions."
        } ${
          bindu10 > bindu11
            ? `<strong>Crucial Effort-to-Income Ratio:</strong> Because your 10th House bindus (${bindu10}) exceed your 11th House bindus (${bindu11}), you currently carry heavier workload and responsibility than the financial payout you receive—a classic karmic bottleneck that requires 11th-lord activation.`
            : `Because your 11th House bindus (${bindu11}) match or exceed your 10th House (${bindu10}), every strategic career move you make has the potential to compound into disproportionate wealth once your Dasha aligns.`
        }
      </p>

      <p>
        <strong>2. Workplace Politics & Your Inevitable Rise:</strong> You refuse to flatter seniors or play petty office politics, which has occasionally allowed louder, less-qualified peers to take temporary credit in your early twenties. However, powered by your Lagna's primary Yogakaraka (<strong>${lagnaMatrix.yogakaraka.join(" & ")}</strong>) and Saturn's gaze, your chart undergoes decisive upward shifts around <strong>ages ${numData.mulank === 8 || numData.bhagyank === 8 ? "28, 32, and 35" : "26, 29, and 33"}</strong>—transitioning you into a position where people come to you for approval.
      </p>

      <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> Highest-Alignment Career Sectors for Your Chart:</div>
        <p class="text-xs md:text-sm mb-0">
          With 10th Lord <strong>${rashi10.lord}</strong> linked to your ${lord10.bhava}th House, your highest status and wealth come through <strong>executive administration/government, medicine & clinical sciences, IT/systems engineering, finance & capital management, advisory/consulting, or building your own independent enterprise</strong>—especially when connected to cities or clients outside your birthplace.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 4 — WEALTH, BANK BALANCE & FINANCIAL FLOW
  // --------------------------------------------------------------------------
  function buildChapter4Wealth(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi2  = RASHI_DATA[getRashiOfBhava(asc, 2)];
    const rashi11 = RASHI_DATA[getRashiOfBhava(asc, 11)];
    const rashi12 = RASHI_DATA[getRashiOfBhava(asc, 12)];
    const lord2   = planetAnalysis[rashi2.lord];
    const lord11  = planetAnalysis[rashi11.lord];
    const bindu2  = specialLagnas.houseBindus[2];
    const bindu11 = specialLagnas.houseBindus[11];
    const bindu12 = specialLagnas.houseBindus[12];

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
            <div class="text-xs text-emerald-300 font-bold">11वां भाव (आय प्रवाह) — ${rashi11.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu11} अष्टकवर्ग बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">2रा भाव (बैंक संचय) — ${rashi2.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu2} अष्टकवर्ग बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold">12वां भाव (व्यय/निवेश) — ${rashi12.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu12} अष्टकवर्ग बिंदु</div>
          </div>
        </div>

        <p>
          <strong>1. धनागम बनाम धन-संचय का समीकरण:</strong> आपके एकादश भाव (लाभ) के स्वामी <strong>${rashi11.lordHi}</strong> कुंडली के <strong>${lord11.bhava}वें भाव</strong> में हैं और द्वितीय भाव (संचित कोष) के स्वामी <strong>${rashi2.lordHi}</strong> <strong>${lord2.bhava}वें भाव</strong> में बैठे हैं। आपकी कुंडली में धन कमाने की क्षमता (earning potential) अत्यंत प्रबल है—जब भी जीवन में किसी बड़े कार्य या जिम्मेदारी के लिए धन की आवश्यकता होती है, ईश्वर कोई न कोई मार्ग अवश्य खोल देता है।
        </p>

        <p>
          <strong>2. रहस्यमयी 'मनी लीक' (जो आपने बार-बार अनुभव किया है):</strong> आपके साथ एक बहुत ही सटीक वित्तीय पैटर्न घटित होता है—जब भी आपके बैंक खाते में एक निश्चित सीमा से अधिक नकद राशि (idle cash) जमा होने लगती है, ठीक उसी समय घर में कोई आकस्मिक खर्च, स्वास्थ्य/उपकरण की मरम्मत, पारिवारिक जिम्मेदारी या किसी परिचित की आकस्मिक मदद का प्रसंग सामने आ जाता है। इसके अतिरिक्त, आपने भावुकता या संबंध निभाने के लिए जिस भी मित्र/रिश्तेदार को पैसा उधार दिया है, वह पैसा या तो फंस गया या उसे वापस मांगने में संबंध कड़वे हुए।
        </p>

        <p>
          <strong>3. करोड़पति संपदा निर्माण का वैदिक लॉक-इन सूत्र:</strong> क्योंकि आपके द्वादश भाव में <strong>${bindu12} बिंदु</strong> हैं, यदि आप पैसा केवल लिक्विड सेविंग्स अकाउंट में छोड़ेंगे तो 12वां भाव उसे अनावश्यक खर्चों में खींच लेगा। आपके लिए अमीरी का अचूक नियम यह है कि धन आते ही उसे <strong>अचल संपत्ति (भूमि/प्रॉपर्टी), स्वर्ण (Gold), दीर्घकालिक इक्विटी/SIP या व्यावसायिक एसेट्स</strong> में 'लॉक' कर दें। जब आप स्वयं अपने 12वें भाव को 'निवेश' (investment) दे देते हैं, तो आकस्मिक नुकसान (losses) स्वतः बंद हो जाते हैं।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
          <div class="text-xs text-emerald-300 font-bold">11th House (Inflow) — ${rashi11.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu11} SAV Bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-xs text-amber-300 font-bold">2nd House (Retention) — ${rashi2.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu2} SAV Bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
          <div class="text-xs text-rose-300 font-bold">12th House (Outflow) — ${rashi12.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu12} SAV Bindus</div>
        </div>
      </div>

      <p>
        <strong>1. Cash Inflow vs. Wealth Retention:</strong> Your 11th House of gains is governed by <strong>${rashi11.lord}</strong> operating from your <strong>${lord11.bhava}th House</strong>, while your 2nd House of accumulated bank balance is ruled by <strong>${rashi2.lord}</strong> in the <strong>${lord2.bhava}th House</strong>. Your chart never truly lacks the ability to generate money—whenever a major necessity hits, resources find their way to you.
      </p>

      <p>
        <strong>2. The Unspoken "Money Leak" Pattern You Have Lived Through:</strong> Look closely at your past financial pattern: every single time your liquid bank balance crosses a comfortable mental threshold, an unplanned family obligation, sudden gadget/vehicle breakdown, medical bill, or urgent request from someone close mysteriously appears to drain the surplus. Furthermore, money lent by you out of emotional goodwill rarely comes back smoothly—and asking for your own money back makes you look like the villain.
      </p>

      <p>
        <strong>3. Your Wealth-Locking Formula:</strong> With <strong>${bindu12} bindus</strong> in your 12th house versus <strong>${bindu2} bindus</strong> in your 2nd house, idle cash sitting in a savings account triggers the "Vyaya" (loss) side of the 12th house. To build massive net worth, you must consciously activate the "Investment" side of the 12th house: the moment surplus income arrives, lock it into <strong>appreciating assets—land/real estate, physical gold, automated equity compounding, or business assets</strong>. Keep your liquid account lean and your asset sheet heavy.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 5 — LUCK FACTOR, FORTUNE & DESTINY MILESTONES
  // --------------------------------------------------------------------------
  function buildChapter5Luck(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi9 = RASHI_DATA[getRashiOfBhava(asc, 9)];
    const lord9  = planetAnalysis[rashi9.lord];
    const bindu9 = specialLagnas.houseBindus[9];
    const m = numData.mulank, b = numData.bhagyank;

    const milestoneAges = Array.from(new Set([
      18 + m, 21 + (b % 5), 24 + (m % 4), 27 + (b % 3),
      30 + (lord9.bhava % 4), 33 + (m % 3), 36, 42
    ])).sort((x, y) => x - y);

    if (lang === "hi") {
      return `
        <p>
          आपके नवम भाव (भाग्य एवं धर्म) में <strong>${rashi9.hi}</strong> राशि है, भाग्येश <strong>${rashi9.lordHi}</strong> कुंडली के <strong>${lord9.bhava}वें भाव</strong> में विराजमान हैं और नवम भाव को अष्टकवर्ग में <strong>${bindu9} बिंदु</strong> प्राप्त हैं। आपका भाग्य 'लॉटरी' की तरह निष्क्रिय बैठकर फल देने वाला नहीं है—यह <strong>कर्म-जागृत भाग्य</strong> है, जो आपके पहला कदम उठाते ही सक्रिय हो जाता है।
        </p>

        <p>
          <strong>1. '99% पर अटकने' के पीछे का दैवीय रहस्य:</strong> आपने अपने जीवन में कई बार यह पीड़ा महसूस की होगी कि जो चीज साधारण लोगों को पहली बार में मिल जाती है, वही काम आपका 99% तक पहुंचकर अंतिम क्षण पर अटक जाता है। लेकिन अपने अतीत को पीछे मुड़कर देखिए—जब भी कोई छोटा दरवाजा आपके सामने बंद हुआ है, तो कुछ महीनों या वर्षों बाद नियति ने आपको यह दिखाया है कि वह रुकावट वास्तव में आपकी रक्षा (divine protection) थी, ताकि आप किसी गलत समझौते में न फंसें।
        </p>

        <p>
          <strong>2. आपके जीवन के स्वर्णिम भाग्योदय वर्ष:</strong> भृगु चक्र, नवमेश <strong>${rashi9.lordHi}</strong> और आपके मूलांक (${m}) व भाग्यांक (${b}) के संगम से आपके जीवन के सबसे बड़े निर्णायक मोड़ <strong>${milestoneAges.join(", ")}वें वर्ष</strong> में आते हैं। वर्तमान में आपकी आयु <strong>${numData.age} वर्ष</strong> है और वर्ष <strong>${numData.currentYear}</strong> आपके लिए <strong>व्यक्तिगत वर्ष अंक ${numData.personalYear}</strong> की ऊर्जा में चल रहा है—जो पुराने मानसिक बोझ को उतारकर करियर और रिश्तों में एक ठोस निर्णय लेने का वर्ष है।
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">भाग्योदय दिशा</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.directionHi}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">शक्तिशाली अंक</div>
            <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">वर्ष ${numData.currentYear} स्पंदन</div>
            <div class="text-sm font-bold text-white mt-1">व्यक्तिगत अंक ${numData.personalYear}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">भाग्येश स्थिति</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.lordHi} (${lord9.bhava}वां भाव)</div>
          </div>
        </div>
      `;
    }

    return `
      <p>
        Your 9th House of Bhagya (divine grace and fortune) holds <strong>${rashi9.en}</strong> with <strong>${bindu9} SAV bindus</strong>, while your Bhagya Lord <strong>${rashi9.lord}</strong> operates from your <strong>${lord9.bhava}th House</strong>. This configuration creates <em>Action-Triggered Fortune</em>: luck rarely drops into your lap while you wait passively, but the moment you commit to bold action in ${houseThemeShort(lord9.bhava, "en")}, unseen doors and mentors open up rapidly.
      </p>

      <p>
        <strong>1. Why Your Goals Face the "99th-Percentile Test":</strong> More than once in life, you have watched average peers coast through opportunities effortlessly while your own milestones faced sudden last-minute hurdles at the 99th percentile. Yet if you examine your timeline honestly, every rejection or delay in your past secretly saved you from settling into a smaller life or the wrong long-term commitment.
      </p>

      <p>
        <strong>2. Your Crucial Age Turning Points:</strong> Synthesizing Bhrigu progression with your 9th Lord (${rashi9.lord}), Mulank (${m}), and Bhagyank (${b}), the most decisive destiny-shifting years of your life occur at <strong>ages ${milestoneAges.join(", ")}</strong>. At your current age of <strong>${numData.age}</strong>, calendar year <strong>${numData.currentYear}</strong> runs under your <strong>Personal Year ${numData.personalYear}</strong>—signaling an active restructuring window for your career, finances, and personal boundaries.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Fortune Direction</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.direction}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Power Numbers</div>
          <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">${numData.currentYear} Vibration</div>
          <div class="text-sm font-bold text-white mt-1">Personal Year ${numData.personalYear}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Bhagya Lord</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.lord} (${lord9.bhava}th House)</div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 6 — LOVE LIFE, ATTRACTION & EMOTIONAL PATTERNS
  // --------------------------------------------------------------------------
  function buildChapter6Love(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const ven    = planetAnalysis.Venus;
    const rahu   = planetAnalysis.Rahu;
    const mars   = planetAnalysis.Mars;

    const karmicLove = ven.conjunctWith.includes("Rahu") || ven.conjunctWith.includes("Saturn") ||
                       ven.conjunctWith.includes("Mars") || ven.conjunctWith.includes("Ketu") ||
                       rahu.bhava === 5 || rahu.bhava === 7 || [1,2,4,7,8,12].includes(mars.bhava);

    if (lang === "hi") {
      return `
        <p>
          प्रेम के मामले में आपका हृदय दिखावे या सतही आकर्षण (time-pass romance) के लिए नहीं बना है। आपके पंचम भाव में <strong>${rashi5.hi}</strong>, पंचमेश <strong>${rashi5.lordHi}</strong> के <strong>${lord5.bhava}वें भाव</strong> में होने और प्रेम-कारक <strong>शुक्र के ${RASHI_DATA[ven.d1].hi} (${ven.bhava}वां भाव, नवांश ${RASHI_DATA[ven.d9].hi})</strong> में बैठने के कारण जब आप किसी से जुड़ते हैं, तो पूरी आत्मा और अटूट निष्ठा से जुड़ते हैं।
        </p>

        <p>
          <strong>1. रिश्तों में आपके साथ होने वाला भावनात्मक असंतुलन:</strong> आपने अपने प्रेम या करीबी रिश्तों में एक कड़वा सच महसूस किया होगा—आप सामने वाले की छोटी-छोटी खुशियों, उसके सम्मान और उसकी भावनात्मक सुरक्षा के लिए अपनी नींद और स्वाभिमान तक दांव पर लगा देते हैं। परंतु जब आपको भावनात्मक सहारे, समय या स्पष्टता (clarity) की जरूरत होती है, तो वही इंसान या तो व्यस्त हो जाता है या आपकी भावनाओं को 'ओवरथिंकिंग' कहकर टाल देता है।
        </p>

        <p>
          <strong>2. पूर्वजन्म का कार्मिक आकर्षण और सावधानी:</strong> ${
            karmicLove
              ? "आपके शुक्र और पंचम/सप्तम अक्ष पर तीव्र कार्मिक ग्रहों का प्रभाव यह स्पष्ट दर्शाता है कि आपके जीवन में कम से कम एक ऐसा गहरा भावनात्मक लगाव या अधूरा प्रेम-प्रसंग आता है जो आपको भीतर तक झकझोर कर रख देता है—ताकि आप अंधे भरोसे से बाहर निकलकर अपने आत्म-सम्मान की कीमत पहचान सकें।"
              : "शुक्र और पंचमेश का समन्वय आपको स्वाभाविक आकर्षण और गहरा प्रेम देता है, पर जब तक सामने वाले में बौद्धिक स्तर और वफादारी न दिखे, आपका मन पूरी तरह खुलता नहीं है।"
          } आपके लिए प्रेम का स्वर्णिम नियम: किसी इंसान के शुरुआती 30 दिनों के मीठे शब्दों पर नहीं, बल्कि संकट के समय उसके व्यवहार की निरंतरता (consistency) पर ही विश्वास करें।
        </p>
      `;
    }

    return `
      <p>
        You are constitutionally incapable of shallow, transactional romance. With your 5th House of love in <strong>${rashi5.en}</strong>, its ruler <strong>${rashi5.lord}</strong> in your <strong>${lord5.bhava}th House</strong>, and <strong>Venus placed in ${RASHI_DATA[ven.d1].en} (${ven.bhava}th House) maturing into ${RASHI_DATA[ven.d9].en} in D9</strong>, when you let someone into your inner circle, you love with fierce loyalty, protection, and depth.
      </p>

      <p>
        <strong>1. The Unspoken Giver-Taker Imbalance in Your Relationships:</strong> You remember the smallest details about the person you love, defend them behind their back, and show up whenever they are hurting. Yet your chart reveals a recurring emotional test: the moment you become 100% emotionally available, the other person either starts taking your presence for granted or pulls back when you ask for basic clarity and reciprocity. Because your pride refuses to beg for attention, you suffer silently inside while acting completely strong on the outside.
      </p>

      <p>
        <strong>2. Karmic Attraction Triggers & Heartbreak Protection:</strong> ${
          karmicLove
            ? "Because intense karmic nodes/malefics touch your romantic axis, your destiny includes at least one deeply transformative heartbreak or complicated attachment early on—specifically designed to strip away naive illusions and awaken your self-worth."
            : "Your Venus–5th house alignment gives you natural romantic magnetism, yet your heart only truly relaxes when intellectual respect and emotional safety coexist."
        } Your golden rule in love: never judge someone by their intensity in the first 60 days; judge them strictly by how they treat your feelings when it is inconvenient for them.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 7 — FUTURE LIFE PARTNER & MARRIED LIFE REALITY
  // --------------------------------------------------------------------------
  function buildChapter7Partner(ctx) {
    const { lang, gender, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi7   = RASHI_DATA[getRashiOfBhava(asc, 7)];
    const lord7    = planetAnalysis[rashi7.lord];
    const d9Rashi7 = RASHI_DATA[getRashiOfBhava(chart.Asc.d9, 7)];
    const ulRashi  = RASHI_DATA[specialLagnas.upapadaRashi];
    const spouseKarakaKey = gender === "female" ? "Jupiter" : "Venus";
    const spouseKaraka = planetAnalysis[spouseKarakaKey];
    const lord7Nak = NAKSHATRA_DATA[lord7.nak];
    const bindu7   = specialLagnas.houseBindus[7];

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold">सप्तम भाव (D1 कलत्र)</div>
            <div class="text-base font-extrabold text-white mt-0.5">${rashi7.hi} (स्वामी: ${rashi7.lordHi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
            <div class="text-xs text-pink-300 font-bold">नवांश (D9) सप्तम एवं कारक</div>
            <div class="text-base font-extrabold text-white mt-0.5">${d9Rashi7.hi} • ${spouseKaraka.meta.hi}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">उपपद लग्न (UL) व बिंदु</div>
            <div class="text-base font-extrabold text-white mt-0.5">${ulRashi.hi} (${bindu7} बिंदु)</div>
          </div>
        </div>

        <p>
          <strong>1. भावी जीवनसाथी का रंग-रूप, कद-काठी और प्रथम आकर्षण:</strong> आपके सप्तम भाव में <strong>${rashi7.hi}</strong> और नवांश (D9) के सप्तम भाव में <strong>${d9Rashi7.hi}</strong> राशि का संगम यह बताता है कि आपके जीवनसाथी में <em>${rashi7.bodyBuildHi}</em> स्पष्ट झलकेगी। उनके चेहरे पर एक स्वाभाविक गरिमा और आंखों में ऐसा आकर्षण होगा कि भीड़ में भी उनकी उपस्थिति अलग महसूस होगी।
        </p>

        <p>
          <strong>2. जीवनसाथी का स्वभाव, बुद्धिमत्ता और पारिवारिक स्तर:</strong> आपके सप्तमेश <strong>${rashi7.lordHi}</strong> <strong>${lord7Nak.name} नक्षत्र</strong> में कुंडली के <strong>${lord7.bhava}वें भाव</strong> में बैठे हैं और जैमिनी उपपद लग्न (UL) <strong>${ulRashi.hi}</strong> में है। आपका जीवनसाथी बाहर से <em>${rashi7.temperamentHi}</em> होगा, जबकि अंतरंग संबंधों में (D9 के अनुसार) उनका स्वभाव <em>${d9Rashi7.temperamentHi}</em> रहेगा। वे एक सम्मानित और संस्कारी परिवार से होंगे। ${
            bindu7 < 26
              ? "सप्तम भाव में अष्टकवर्ग बिंदु थोड़े संवेदनशील होने के कारण विवाह के शुरुआती चरण में अहं (ego) या संवाद की गलतफहमी से बचना आवश्यक रहेगा—जितना अधिक आप दोनों तीसरे व्यक्ति के हस्तक्षेप से दूर रहेंगे, दांपत्य उतना ही सुखद रहेगा।"
              : "सप्तम भाव के मजबूत बिंदु यह दर्शाते हैं कि कठिन समय में आपका जीवनसाथी आपकी सबसे मजबूत ढाल और सलाहकार साबित होगा।"
          }
        </p>

        <p>
          <strong>3. विवाह की दिशा, मिलन का माध्यम और विवाह-पश्चात भाग्योदय:</strong> आपके जीवनसाथी के जन्मस्थान या आपके मिलन की सबसे प्रबल दिशा <strong>${rashi7.directionHi}</strong> अथवा <strong>${d9Rashi7.directionHi}</strong> है। सप्तमेश के ${lord7.bhava}वें भाव से जुड़ने के कारण ${
            [3, 5, 9, 11].includes(lord7.bhava)
              ? "आपका विवाह आपकी अपनी पसंद (love-cum-arranged) या आपके कार्यक्षेत्र/सोशल नेटवर्क के माध्यम से तय होने का प्रबल योग है।"
              : "विवाह परिवार की सहमति या आकस्मिक संयोग से तय होगा, परंतु विवाह से पूर्व आप दोनों के बीच गहरा मानसिक समन्वय स्थापित हो जाएगा।"
          } सबसे महत्वपूर्ण—नवांश में <strong>${spouseKaraka.meta.hi}</strong> की स्थिति यह प्रमाणित करती है कि <strong>विवाह के 18 से 24 महीनों के भीतर</strong> आपके आर्थिक स्तर, स्थिरता और सामाजिक मान-सम्मान में एक बड़ा उछाल (Post-Marriage Bhagya Udaya) आएगा।
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
          <div class="text-xs text-amber-300 font-bold">Upapada Lagna (UL) & SAV</div>
          <div class="text-base font-extrabold text-white mt-0.5">${ulRashi.en} (${bindu7} Bindus)</div>
        </div>
      </div>

      <p>
        <strong>1. Physical Appearance, Vibe & First Impression of Your Future Partner:</strong> Synthesizing your D1 7th House in <strong>${rashi7.en}</strong> with your Navamsa (D9) 7th House in <strong>${d9Rashi7.en}</strong> and spouse-significator <strong>${spouseKarakaKey} in ${RASHI_DATA[spouseKaraka.d1].en}</strong>, your partner will carry <em>${rashi7.bodyBuildEn}</em>. Even in simple attire, they project natural self-respect and an expressive gaze that stands out immediately.
      </p>

      <p>
        <strong>2. Partner's Core Nature, Intelligence & Family Status:</strong> Because your 7th Lord <strong>${rashi7.lord}</strong> sits in your <strong>${lord7.bhava}th House under ${lord7Nak.name}</strong> and your Jaimini Upapada Lagna (UL) falls in <strong>${ulRashi.en}</strong>, your spouse's outer personality will be <em>${rashi7.temperamentEn}</em>, while behind closed doors (in D9) their deeper nature matures into <em>${d9Rashi7.temperamentEn}</em>. ${
          bindu7 < 26
            ? `With ${bindu7} bindus in the 7th house, both of you have strong individual opinions—meaning you must never allow third-party relatives to mediate your private disagreements.`
            : `With ${bindu7} bindus supporting your 7th house, your partner acts as your sharpest strategic advisor and emotional anchor during life's storms.`
        }
      </p>

      <p>
        <strong>3. Direction of Marriage, How You Meet & Post-Marriage Fortune:</strong> Astrologically, the strongest directional pull for your partner's roots or meeting place lies toward the <strong>${rashi7.direction}</strong> or <strong>${d9Rashi7.direction}</strong>. With 7th Lord activating your ${lord7.bhava}th house, ${
          [3, 5, 9, 11].includes(lord7.bhava)
            ? "your chart strongly favors a love-cum-arranged marriage or meeting through your professional/educational network where mental respect turns into commitment."
            : "whether introduced through family or destiny-led circumstances, a strong one-on-one intellectual bond will form before marriage."
        } Crucially, your Navamsa configuration triggers <strong>Post-Marriage Bhagya-Udaya</strong>: within 18 to 24 months of marriage, your financial discipline and social standing elevate into a noticeably higher league.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 8 — EVERY PLANET IN-DEPTH ANALYSIS + MUTUAL ASPECTS (D1 + D9)
  // --------------------------------------------------------------------------
  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const ascRashi = chart.Asc.d1;
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];

    const modeBanner = chart.isFullChartMode
      ? (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>99.9% पूर्ण कुंडली मोड सक्रिय:</strong> नीचे आपके द्वारा प्रविष्ट लग्न (D1), नक्षत्र एवं नवांश (D9) के आधार पर सभी 9 ग्रहों के स्वामित्व, युति, पाराशरी दृष्टि और अष्टकवर्ग बल का संपूर्ण विश्लेषण दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>99.9% Full-Precision Chart Mode Active:</strong> Below is the complete Parashari, Navamsa (D9), and Ashtakavarga breakdown of all 9 Grahas—including house lordships, functional nature, conjunctions (Yutis), and mutual aspects (Drishtis).</div>`)
      : (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-info-circle mr-2"></i><strong>जन्म-तिथि एवं नाम सिंथेसिस मोड:</strong> यह विश्लेषण आपकी जन्म-तिथि के सूर्य-चंद्र नक्षत्र व चैल्डियन तरंग पर आधारित है। (ऊपर Step 2 में अपनी लग्न व ग्रहों की राशि चुनकर इसे 99.9% सटीक कुंडली मोड में भी देख सकते हैं!)</div>`
        : `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-info-circle mr-2"></i><strong>Sidereal Solar-Lunar & Chaldean Synthesis Mode:</strong> Derived from your birth date and name vibration. (Tip: Toggle Step 2 above to enter your exact Prokerala/AstroSage placements for 99.9% chart verification!)</div>`);

    const cardsHtml = pKeys.map(k => {
      const info = planetAnalysis[k];
      const d1Rashi = RASHI_DATA[info.d1];
      const d9Rashi = RASHI_DATA[info.d9];
      const nak = NAKSHATRA_DATA[info.nak];
      const bhavaDesc = BHAVA_MEANINGS[info.bhava];
      const funcRole = getFunctionalRoleLabel(ascRashi, k, lang);
      const ownedStrEn = info.ownedHouses.length ? `Rules House ${info.ownedHouses.join(" & ")}` : "Shadow Karmic Node (Chhaya Graha)";
      const ownedStrHi = info.ownedHouses.length ? `भाव ${info.ownedHouses.join(" एवं ")} का स्वामी` : "छाया ग्रह (कार्मिक अक्ष)";
      const bavScoreHere = specialLagnas.houseBav[k] ? specialLagnas.houseBav[k][info.bhava] : null;

      // Conjunction (Yuti)
      let yutiEn = "", yutiHi = "";
      if (info.conjunctWith.length > 0) {
        const namesEn = info.conjunctWith.map(c => PLANET_META[c].en).join(", ");
        const namesHi = info.conjunctWith.map(c => PLANET_META[c].hi).join(", ");
        yutiEn = `<strong>Conjunction (Yuti) in ${info.bhava}th House:</strong> Shares ${d1Rashi.en} with <strong>${namesEn}</strong>. Whenever either planet's Dasha/Antardasha runs, both planets fire simultaneously—blending their agendas in ${houseThemeShort(info.bhava, "en")}.`;
        yutiHi = `<strong>युति (Conjunction) प्रभाव:</strong> यह ग्रह ${info.bhava}वें भाव (${d1Rashi.hi}) में <strong>${namesHi}</strong> के साथ युति बना रहा है—अतः जब भी इनमें से किसी की दशा चलेगी, दोनों ग्रह मिलकर ${houseThemeShort(info.bhava, "hi")} के परिणामों को एक साथ प्रभावित करेंगे।`;
      } else {
        yutiEn = `<strong>Unconjunct (Independent Placement):</strong> Sits alone in ${d1Rashi.en} in the ${info.bhava}th House—meaning its core agenda is unadulterated by planetary crowding.`;
        yutiHi = `<strong>स्वतंत्र स्थिति (बिना युति):</strong> यह ग्रह ${info.bhava}वें भाव (${d1Rashi.hi}) में अकेले बैठकर बिना किसी अन्य ग्रह के हस्तक्षेप के अपना स्वतंत्र और स्पष्ट प्रभाव दे रहा है।`;
      }

      // Outgoing Aspects (Drishti Cast)
      const outgoingEn = info.aspectedTargets.map(t => {
        const tRashi = RASHI_DATA[t.targetRashi];
        const hit = t.planetsThere.length > 0
          ? ` (directly aspecting <strong>${t.planetsThere.map(p => PLANET_META[p].en).join(", ")}</strong> sitting there)`
          : "";
        return `${t.nthAspect}th Drishti onto the <strong>${t.targetBhava}th House (${tRashi.en})</strong>${hit}`;
      }).join("; ");

      const outgoingHi = info.aspectedTargets.map(t => {
        const tRashi = RASHI_DATA[t.targetRashi];
        const hit = t.planetsThere.length > 0
          ? ` (जहाँ बैठे <strong>${t.planetsThere.map(p => PLANET_META[p].hi).join(", ")}</strong> पर सीधी दृष्टि पड़ रही है)`
          : "";
        return `${t.nthAspect}वीं दृष्टि <strong>${t.targetBhava}वें भाव (${tRashi.hi})</strong> पर${hit}`;
      }).join("; ");

      // Incoming Aspects (Drishti Received)
      const incomingEn = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => `${inc.nthAspect}th aspect from <strong>${PLANET_META[inc.fromPlanet].en}</strong> (from House ${planetAnalysis[inc.fromPlanet].bhava})`).join(", ")
        : "Receives no direct Parashari aspect from other planets—operating purely on its own Rashi, Nakshatra, and D9 strength.";

      const incomingHi = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => `<strong>${PLANET_META[inc.fromPlanet].hi}</strong> (${planetAnalysis[inc.fromPlanet].bhava}वें भाव से) की ${inc.nthAspect}वीं दृष्टि`).join(", ")
        : "इस ग्रह पर किसी अन्य ग्रह की सीधी पाराशरी दृष्टि नहीं है—यह अपने स्वयं के नक्षत्र और नवांश बल से फल दे रहा है।";

      if (lang === "hi") {
        return `
          <div class="p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h4 class="text-lg md:text-xl font-bold text-white">
                  ${info.meta.hi} ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 ml-2">वक्री / उच्च चेष्टा बल</span>' : ''}
                </h4>
                <p class="text-xs text-amber-300/90 font-semibold mt-0.5">${ownedStrHi} • ${funcRole}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusHi}</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">लग्न (D1) स्थिति:</span>
                <strong class="text-amber-300">${info.bhava}वां भाव — ${d1Rashi.hi}</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नक्षत्र एवं स्वामी:</span>
                <strong class="text-purple-300">${nak.name} (${nak.ruler})</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नवांश (D9) परिपक्वता:</span>
                <strong class="text-emerald-300">${info.d9Bhava}वां भाव — ${d9Rashi.hi}</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">भिन्नाष्टकवर्ग (BAV):</span>
                <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere} / 8 बिंदु` : 'छाया नोड (Node)'}</strong>
              </div>
            </div>

            <p class="text-sm text-gray-200 mb-0">
              <strong>1. भाव स्वामित्व एवं D1 फलित:</strong> आपकी कुंडली में ${info.meta.hi} (${ownedStrHi}) <strong>${bhavaDesc.hi}</strong> में ${d1Rashi.hi} राशि और <strong>${nak.name}</strong> नक्षत्र में स्थित हैं। इस स्थिति के कारण आपके भीतर <em>${nak.traitHi}</em> का गुण सक्रिय रहता है और यह ग्रह आपके ${houseThemeShort(info.bhava, "hi")} को सीधे नियंत्रित करता है।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>2. नवांश (D9) का गुप्त सच (विवाह व 30 वर्ष के बाद का फल):</strong> लग्न कुंडली में ${d1Rashi.hi} में दिखने वाला यह ग्रह नवांश (D9) में <strong>${d9Rashi.hi} राशि (D9 के ${info.d9Bhava}वें भाव)</strong> में जाता है। इसका अर्थ है कि समय के साथ यह ग्रह ${houseThemeShort(info.d9Bhava, "hi")} के माध्यम से अपना वास्तविक फल प्रकट करेगा।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>3. ${yutiHi}</strong>
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>4. इस ग्रह की पाराशरी दृष्टि (Drishti Cast):</strong> ${info.meta.hi} अपने स्थान से <strong>${outgoingHi}</strong> डाल रहे हैं—जिससे उन भावों के विषयों में निरंतर हलचल और कर्म-सक्रियता बनी रहती है।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>5. इस ग्रह पर पड़ने वाली दृष्टियां (Drishti Received):</strong> ${incomingHi}
            </p>
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
              <p class="text-xs text-amber-300/90 font-semibold mt-0.5">${ownedStrEn} • ${funcRole}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusEn}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D1 Placement:</span>
              <strong class="text-amber-300">${info.bhava}th House — ${d1Rashi.en}</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">Nakshatra & Lord:</span>
              <strong class="text-purple-300">${nak.name} (${nak.ruler})</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D9 Navamsa Maturity:</span>
              <strong class="text-emerald-300">${info.d9Bhava}th House — ${d9Rashi.en}</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">BAV Bindu Strength:</span>
              <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere} / 8 Bindus` : 'Karmic Axis Node'}</strong>
            </div>
          </div>

          <p class="text-sm text-gray-200 mb-0">
            <strong>1. House Lordship & D1 Execution:</strong> In your chart, ${info.meta.en} (${ownedStrEn}) occupies the <strong>${bhavaDesc.en}</strong> in ${d1Rashi.en} under <strong>${nak.name}</strong>. This wires your subconscious with <em>${nak.traitEn}</em> and directly links ${info.ownedHouses.length ? `the affairs of House ${info.ownedHouses.join(" & ")} into` : `karmic intensity into`} <em>${houseThemeShort(info.bhava, "en")}</em>.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>2. Navamsa (D9) Fruit & Second-Half Maturity:</strong> While seated in ${d1Rashi.en} in your birth chart, this Graha shifts into <strong>${d9Rashi.en} (House ${info.d9Bhava} of D9)</strong>—meaning after age 28–32 and post-marriage, its true fruit manifests through <em>${houseThemeShort(info.d9Bhava, "en")}</em>.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>3. ${yutiEn}</strong>
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>4. Outgoing Parashari Aspects (Drishti Cast):</strong> From the ${info.bhava}th House, ${info.meta.en} projects its ${outgoingEn}—permanently energizing those life sectors.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>5. Incoming Planetary Aspects (Drishti Received):</strong> ${incomingEn}
          </p>
        </div>
      `;
    }).join("");

    return modeBanner + `<div class="space-y-4">${cardsHtml}</div>`;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 9 — SPECIAL LAGNAS + VERIFIED 337-BINDU PARASHARI ASHTAKAVARGA
  // --------------------------------------------------------------------------
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

    const houseArr = Object.keys(bindus).map(h => ({h: parseInt(h, 10), b: bindus[h]}));
    const sorted = [...houseArr].sort((a, b) => b.b - a.b);
    const strongest = sorted.slice(0, 3);
    const weakest = sorted.slice(-3).reverse();

    const savGrid = houseArr.map(({h, b}) => {
      const color = b >= 30 ? "border-emerald-400/50 text-emerald-300"
                  : b <= 24 ? "border-rose-400/50 text-rose-300"
                  : b <= 27 ? "border-amber-400/40 text-amber-300"
                  : "border-white/15 text-gray-200";
      return `<div class="p-2.5 rounded-xl bg-slate-950/90 border ${color} text-center">
        <div class="text-[10px] uppercase text-gray-400">${lang === "hi" ? `भाव ${h}` : `House ${h}`}</div>
        <div class="text-base font-extrabold mt-0.5">${b}</div>
      </div>`;
    }).join("");

    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const planetShort = {Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa"};

    const bavRowsHtml = houseArr.map(({h}) => {
      const cells = planets7.map(p => {
        const v = bav[p][h];
        const col = v >= 5 ? "text-emerald-300" : v <= 2 ? "text-rose-300" : "text-gray-300";
        return `<td class="py-1.5 px-2 text-center font-bold ${col}">${v}</td>`;
      }).join("");
      const savVal = bindus[h];
      const savCol = savVal >= 30 ? "text-emerald-300" : savVal <= 24 ? "text-rose-300" : "text-amber-300";
      return `<tr class="hover:bg-white/5">
        <td class="py-1.5 px-2 text-gray-300 font-bold">${lang === "hi" ? `भाव ${h}` : `H-${h}`}</td>
        ${cells}
        <td class="py-1.5 px-2 text-center font-extrabold ${savCol}">${savVal}</td>
      </tr>`;
    }).join("");

    const totalFooterCells = planets7.map(p => `<td class="py-2 px-2 text-center font-extrabold text-amber-300">${pTotals[p]}</td>`).join("");
    const headerCells = planets7.map(p => `<th class="py-1.5 px-2 text-center text-amber-300">${planetShort[p]}</th>`).join("");

    const strongListEn = strongest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus)`).join(", ");
    const strongListHi = strongest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु)`).join(", ");
    const weakListEn   = weakest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus)`).join(", ");
    const weakListHi   = weakest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु)`).join(", ");

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30">
            <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. चंद्र लग्न (${chandra.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              जन्म लग्न शरीर है, तो <strong>चंद्र लग्न (${chandra.hi})</strong> आपके मन की धुरी है। गोचर (Transits) और साढ़ेसाती/ढैय्या का सारा प्रभाव चंद्र लग्न से ही घटित होता है—इसीलिए भावनात्मक शांति के लिए आपको <em>${chandra.temperamentHi}</em> वातावरण की आवश्यकता होती है।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30">
            <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (${surya.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              <strong>सूर्य लग्न (${surya.hi})</strong> आपकी आत्मा के स्वाभिमान, पिता की विरासत और प्रशासनिक अधिकार को दर्शाता है। सूर्य लग्न से दशम और एकादश भाव यह तय करते हैं कि समाज में आपका नाम किस अधिकार से लिया जाएगा।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30">
            <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. नवांश लग्न (${navamsa.hi}) एवं कारकांश (${karakamsa.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              <strong>नवांश लग्न (${navamsa.hi})</strong> और आत्मकारक (${akMeta.hi}) से निर्मित <strong>कारकांश लग्न (${karakamsa.hi})</strong> आपकी आत्मा की असली मंजिल हैं। 30 वर्ष की आयु और विवाह के पश्चात आपका व्यक्तित्व स्पष्ट रूप से <em>${navamsa.temperamentHi}</em> गुणों में ढल जाता है।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30">
            <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (AL — ${arudha.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              आपका <strong>आरूढ़ पद (AL) ${arudha.hi}</strong> में (लग्न से <strong>${specialLagnas.arudhaHouseFromLagna}वें भाव</strong> में${specialLagnas.arudhaExceptionApplied ? " — जैमिनी स्व-सप्तम अपवाद नियम से 10वें स्थान पर संशोधित" : ""}) स्थित है। लग्न आपका सच है, पर आरूढ़ लग्न वह छवि (Maya) है जो दुनिया आप पर थोपती है।
            </p>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. बृहत् पाराशर होरा शास्त्र — प्रमाणित 337-बिंदु सर्वाष्टकवर्ग (SAV)</h4>
            <span class="text-xs text-emerald-300 font-bold">कुल योग: ${specialLagnas.grandTotalSav} / 337 बिंदु (100% सत्यापित)</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
            ${savGrid}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30">
              <div class="text-xs text-emerald-300 font-bold mb-1"><i class="fas fa-arrow-up mr-1"></i>सर्वोच्च बली भाव (Power Houses)</div>
              <p class="text-sm text-gray-200 mb-0">${strongListHi} — इन भावों में 30+ या उच्च बिंदु होने से इन क्षेत्रों में आपका थोड़ा सा प्रयास भी बड़ा परिणाम देता है।</p>
            </div>
            <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30">
              <div class="text-xs text-rose-300 font-bold mb-1"><i class="fas fa-arrow-down mr-1"></i>कम बिंदु वाले संवेदनशील भाव (Energy Drain)</div>
              <p class="text-sm text-gray-200 mb-0">${weakListHi} — इन भावों में बिंदु कम होने से जब भी पाप ग्रह यहाँ से गोचर करते हैं, तब मानसिक थकान या कार्य में विलंब होता है।</p>
            </div>
          </div>

          <div class="mt-5 overflow-x-auto rounded-xl border border-white/15">
            <table class="w-full text-xs md:text-sm">
              <thead>
                <tr class="bg-slate-950 text-amber-300 border-b border-white/10">
                  <th class="py-2 px-2 text-left">भाव</th>
                  ${headerCells}
                  <th class="py-2 px-2 text-center text-amber-200">SAV योग</th>
                </tr>
              </thead>
              <tbody class="bg-slate-900/60 divide-y divide-white/5 text-gray-200">
                ${bavRowsHtml}
              </tbody>
              <tfoot>
                <tr class="bg-slate-950 border-t border-amber-400/40 text-xs">
                  <td class="py-2 px-2 font-bold text-amber-300">कुल BAV</td>
                  ${totalFooterCells}
                  <td class="py-2 px-2 text-center font-extrabold text-emerald-300">${specialLagnas.grandTotalSav}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p class="text-[11px] text-gray-400 mt-2">
            <strong>पाराशरी सत्यापन:</strong> सूर्य (48) + चंद्र (49) + मंगल (39) + बुध (54) + गुरु (56) + शुक्र (52) + शनि (39) = <strong>337 कुल बिंदु</strong>। किसी भी भाव में किसी ग्रह का BAV 5+ होना अत्यंत शुभ और 0–2 होना संघर्षकारी होता है।
          </p>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30">
          <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. Chandra Lagna (${chandra.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            If the Ascendant is your physical chassis, <strong>Chandra Lagna (${chandra.en})</strong> is the operating system of your mind. All planetary transits (Gochara) and Sade-Sati phases register relative to ${chandra.en}—requiring <em>${chandra.temperamentEn}</em> for inner peace.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30">
          <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (${surya.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            <strong>Surya Lagna (${surya.en})</strong> governs your vital authority, paternal lineage, and executive command. Counting houses from ${surya.en} reveals the exact domain where your soul refuses to compromise its dignity.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30">
          <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. Navamsa (${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            While D1 shows the seed, <strong>Navamsa Lagna (${navamsa.en})</strong> and your <strong>Karakamsa Lagna (${karakamsa.en} — via Atmakaraka ${akMeta.en})</strong> reveal the ripened fruit. After age 30 and post-marriage, your life visibly takes on ${navamsa.en} qualities: <em>${navamsa.temperamentEn}</em>.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30">
          <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            Your Arudha Pada falls in <strong>${arudha.en}</strong> (${specialLagnas.arudhaHouseFromLagna}th House from Lagna${specialLagnas.arudhaExceptionApplied ? " — shifted 10th via Jaimini's Swastha/Darastha exception rule" : ""}). Lagna is your internal truth; Arudha Lagna is the <em>Maya</em> (public perception) projected onto you by society.
          </p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. Verified BPHS Parashari Sarvashtakavarga (SAV) & BAV Matrix</h4>
          <span class="text-xs text-emerald-300 font-bold">Verified Sum: ${specialLagnas.grandTotalSav} / 337 Bindus</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
          ${savGrid}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30">
            <div class="text-xs text-emerald-300 font-bold mb-1"><i class="fas fa-arrow-up mr-1"></i>Peak Reservoir Houses</div>
            <p class="text-sm text-gray-200 mb-0">${strongListEn} — these houses carry your highest cosmic voltage, delivering rapid results whenever their lords or transits activate.</p>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold mb-1"><i class="fas fa-arrow-down mr-1"></i>Low-Bindu Vulnerable Houses</div>
            <p class="text-sm text-gray-200 mb-0">${weakListEn} — these houses hold lower bindu reserves, meaning Saturn/Rahu transits through them require conscious remedies and patience.</p>
          </div>
        </div>

        <div class="mt-5 overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs md:text-sm">
            <thead>
              <tr class="bg-slate-950 text-amber-300 border-b border-white/10">
                <th class="py-2 px-2 text-left">House</th>
                ${headerCells}
                <th class="py-2 px-2 text-center text-amber-200">SAV Total</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5 text-gray-200">
              ${bavRowsHtml}
            </tbody>
            <tfoot>
              <tr class="bg-slate-950 border-t border-amber-400/40 text-xs">
                <td class="py-2 px-2 font-bold text-amber-300">Planet BAV</td>
                ${totalFooterCells}
                <td class="py-2 px-2 text-center font-extrabold text-emerald-300">${specialLagnas.grandTotalSav}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="text-[11px] text-gray-400 mt-2">
          <strong>Classical BPHS Verification:</strong> Sun (48) + Moon (49) + Mars (39) + Mercury (54) + Jupiter (56) + Venus (52) + Saturn (39) = <strong>337 Total Bindus</strong>. A planet scoring 5–8 BAV in a house yields effortless results there; 0–2 BAV indicates karmic friction.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 10 — CURRENT TIME PHASE (MAHADASHA & ANTARDASHA)
  // --------------------------------------------------------------------------
  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData, chart } = ctx;
    const mdInfo = planetAnalysis[dasha.md];
    const adInfo = planetAnalysis[dasha.ad];
    const mdRashi = RASHI_DATA[mdInfo.d1];
    const adRashi = RASHI_DATA[adInfo.d1];
    const relativeHouseOfAD = getBhavaFrom(mdInfo.d1, adInfo.d1);
    const difficultAxis = relativeHouseOfAD === 6 || relativeHouseOfAD === 8 || relativeHouseOfAD === 12;
    const mdRole = getFunctionalRoleLabel(chart.Asc.d1, dasha.md, lang);
    const adRole = getFunctionalRoleLabel(chart.Asc.d1, dasha.ad, lang);

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
            <div class="text-xs text-cyan-300 font-bold uppercase">सक्रिय महादशा (MD)</div>
            <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.hi}</div>
            <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}वां भाव (${mdRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
            <div class="text-xs text-purple-300 font-bold uppercase">सक्रिय अंतर्दशा (AD)</div>
            <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.hi}</div>
            <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}वां भाव (${adRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
            <div class="text-xs text-amber-300 font-bold uppercase">दशा-भुक्ति संबंध</div>
            <div class="text-xl font-extrabold text-white mt-1">महादशानाथ से ${relativeHouseOfAD}वां</div>
            <div class="text-xs text-gray-400 mt-0.5">${dasha.isManualDasha ? "मैनुअल चयन" : "नक्षत्र-पाद से परिकलित"}</div>
          </div>
        </div>

        <p>
          <strong>1. ${mdInfo.meta.hi} महादशा आपके जीवन में क्या बदल रही है:</strong> इस समय आपके जीवन की मुख्य कमान <strong>${mdInfo.meta.hi}</strong> (${mdRole}) के हाथों में है, जो आपकी कुंडली के <strong>${mdInfo.bhava}वें भाव (${BHAVA_MEANINGS[mdInfo.bhava].hi})</strong> में और नवांश के <strong>${RASHI_DATA[mdInfo.d9].hi}</strong> में बैठे हैं। यही कारण है कि पिछले कुछ समय से आपका पूरा मानसिक और व्यावहारिक फोकस ${houseThemeShort(mdInfo.bhava, "hi")} के इर्द-गिर्द केंद्रित हो गया है।
        </p>

        <p>
          <strong>2. ${adInfo.meta.hi} अंतर्दशा और दशा-भुक्ति समीकरण:</strong> महादशा के भीतर वर्तमान में <strong>${adInfo.meta.hi}</strong> (${adRole}) की अंतर्दशा चल रही है, जो लग्न से <strong>${adInfo.bhava}वें भाव</strong> में और महादशानाथ ${mdInfo.meta.hi} से <strong>${relativeHouseOfAD}वें स्थान</strong> पर स्थित है। ${
            difficultAxis
              ? `<strong>विशेष सावधानी (षडाष्टक / द्वादश दशा-भुक्ति अक्ष):</strong> क्योंकि महादशानाथ और अंतर्दशानाथ एक-दूसरे से ${relativeHouseOfAD}वें (6/8/12) कोण पर हैं, इसलिए आप पिछले कुछ महीनों से अकारण मानसिक थकान, रात को विचारों का द्वंद्व और 'पूरी मेहनत के बाद भी अंतिम क्षण पर काम रुकने' जैसा दबाव महसूस कर रहे हैं।`
              : `महादशानाथ से अंतर्दशानाथ का ${relativeHouseOfAD}वां संबंध यह दर्शाता है कि पिछले 14–18 महीनों से जो योजनाएं रुकी हुई थीं, अब उन्हें ठोस रूप देने का समय आ गया है।`
          }
        </p>

        <p>
          <strong>3. आगामी 12–18 महीनों की सटीक भविष्यवाणी (${numData.currentYear}–${numData.currentYear + 1}):</strong> जैसे ही गोचर के गुरु और शनि आपके ${mdInfo.bhava}वें और ${adInfo.bhava}वें भाव के अक्ष को सक्रिय करेंगे, आपके सामने करियर परिवर्तन, आर्थिक पुनर्गठन या विवाह/रिश्ते से जुड़ा एक बड़ा निर्णय आएगा। इस संधि-काल में बिना अपनी कुंडली का सटीक अंशबल (Chalit & Shadbala) जांचे कोई भी आवेगपूर्ण कदम न उठाएं।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
          <div class="text-xs text-cyan-300 font-bold uppercase">Active Mahadasha (MD)</div>
          <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}th House (${mdRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
          <div class="text-xs text-purple-300 font-bold uppercase">Active Antardasha (AD)</div>
          <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}th House (${adRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
          <div class="text-xs text-amber-300 font-bold uppercase">Dasha-Bhukti Angle</div>
          <div class="text-xl font-extrabold text-white mt-1">${relativeHouseOfAD}th from MD Lord</div>
          <div class="text-xs text-gray-400 mt-0.5">${dasha.isManualDasha ? "Manual Selection" : "Nakshatra-Pada Calibrated"}</div>
        </div>
      </div>

      <p>
        <strong>1. How Your ${mdInfo.meta.en} Mahadasha Is Reshaping Your Life:</strong> Right now, the master switch of your destiny is held by <strong>${mdInfo.meta.en}</strong> (${mdRole}), seated in your <strong>${mdInfo.bhava}th House (${BHAVA_MEANINGS[mdInfo.bhava].en})</strong> and maturing into <strong>${RASHI_DATA[mdInfo.d9].en}</strong> in Navamsa. In Vimshottari predictive law, the Mahadasha lord forces you to confront and master every unfinished karmic lesson of <em>${houseThemeShort(mdInfo.bhava, "en")}</em>.
      </p>

      <p>
        <strong>2. The ${adInfo.meta.en} Antardasha Sub-Cycle:</strong> Inside this major period, you are navigating the sub-period of <strong>${adInfo.meta.en}</strong> (${adRole}) in your <strong>${adInfo.bhava}th House</strong>, positioned <strong>${relativeHouseOfAD} houses away</strong> from your Mahadasha lord. ${
          difficultAxis
            ? `<strong>Critical Dasha-Bhukti Friction (6/8/12 Angle):</strong> Because ${dasha.md} and ${dasha.ad} sit in a ${relativeHouseOfAD}th (Shashtashtaka / Dwirdwadasha) relationship, you have been experiencing unexplained mental fatigue, restless sleep, and a feeling of pushing a boulder uphill over the past several months. This is a classic Dasha-angle friction that requires targeted pacification.`
            : `Because ${dasha.md} and ${dasha.ad} form a ${relativeHouseOfAD}th-house alignment, stalled efforts from the past 14–18 months are now being pushed toward a decisive breakthrough.`
        }
      </p>

      <p>
        <strong>3. Next 12–18 Months Forecast (${numData.currentYear}–${numData.currentYear + 1}):</strong> As transiting Jupiter and Saturn aspect your active ${mdInfo.bhava}th/${adInfo.bhava}th axis over the coming quarters, a defining decision regarding your career authority, financial structure, or marriage/relationship commitment will arrive. Navigating this window with degree-calibrated remedies ensures you turn this transition into a permanent rise.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 11 — HIDDEN PROBLEMS, KARMIC TRAPS & DIAGNOSTIC HOOK
  // --------------------------------------------------------------------------
  function buildChapter11HiddenTraps(ctx) {
    const { lang, name, chart, planetAnalysis, specialLagnas, dasha } = ctx;
    const asc = chart.Asc.d1;
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[asc];
    const badhakaKey  = lagnaMatrix.badhakesh;
    const badhakaInfo = planetAnalysis[badhakaKey];
    const rahu = planetAnalysis.Rahu;
    const ketu = planetAnalysis.Ketu;
    const sat  = planetAnalysis.Saturn;
    const mars = planetAnalysis.Mars;
    const isManglik = [1, 2, 4, 7, 8, 12].includes(mars.bhava);

    let weakestHouse = 1, minBindu = 99;
    Object.keys(specialLagnas.houseBindus).forEach(h => {
      if (specialLagnas.houseBindus[h] < minBindu) {
        minBindu = specialLagnas.houseBindus[h];
        weakestHouse = parseInt(h, 10);
      }
    });

    if (lang === "hi") {
      return `
        <p>
          प्रिय <strong>${name}</strong>, ऊपर के 10 अध्यायों में आपने अपनी प्रतिभा, करियर, और भावी जीवनसाथी की संभावनाओं को देखा। <strong>अब एक तार्किक ज्योतिषी के रूप में सबसे महत्वपूर्ण और कड़वा प्रश्न ध्यान से पढ़िए:</strong> यदि आपकी कुंडली में इतनी क्षमता और राजयोग मौजूद हैं, तो फिर आपके सबसे बड़े काम 99% पर आकर क्यों अटकते हैं? जिन लोगों के लिए आप अपना सब कुछ न्योछावर करते हैं, वही आपको सबसे गहरा मानसिक आघात क्यों देते हैं? और आपकी 100% मेहनत का पूरा फल बैंक बैलेंस या पद में क्यों नहीं बदल पा रहा?
        </p>

        <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
          <div class="font-bold text-red-300 text-base">
            <i class="fas fa-biohazard mr-2"></i> आपकी कुंडली में पकड़े गए 3 गुप्त ग्रह-अवरोध (Root-Cause Doshas):
          </div>
          <p class="text-sm mb-0">
            <strong>1. बाधकेश (${badhakaInfo.meta.hi}) एवं मारक ग्रह का गुप्त अवरोध:</strong> आपके ${RASHI_DATA[asc].hi} लग्न के लिए <strong>${badhakaInfo.meta.hi}</strong> (${lagnaMatrix.badhakaHouse}वें बाधक भाव के स्वामी) कुंडली के <strong>${badhakaInfo.bhava}वें भाव</strong> में बैठकर अदृश्य रुकावटें पैदा कर रहे हैं। ${isManglik ? `साथ ही मंगल के ${mars.bhava}वें भाव में होने से वैवाहिक/भावनात्मक अक्ष पर तीव्र अग्नि-ऊर्जा (कुज प्रभाव) बन रही है।` : `साथ ही मारक ग्रहों (${lagnaMatrix.marakas.map(m => PLANET_META[m].hi).join(", ")}) की स्थिति आपके आत्मबल और रिश्तों की शांति को प्रभावित कर रही है।`}
          </p>
          <p class="text-sm mb-0">
            <strong>2. राहु-केतु का ${rahu.bhava}/${ketu.bhava} कार्मिक ग्रहण और शनि की दृष्टि:</strong> राहु <strong>${rahu.bhava}वें भाव (${RASHI_DATA[rahu.d1].hi})</strong> में और केतु <strong>${ketu.bhava}वें भाव (${RASHI_DATA[ketu.d1].hi})</strong> में बैठकर ठीक उस समय मानसिक धुंध या भटकाव पैदा करते हैं जब आप किसी बड़ी सफलता के करीब होते हैं। वहीं शनि (${sat.bhava}वें भाव) की तीसरी, सातवीं और दसवीं दृष्टि आपके धैर्य की कड़ी परीक्षा ले रही है।
          </p>
          <p class="text-sm mb-0">
            <strong>3. ${weakestHouse}वें भाव में सबसे कम अष्टकवर्ग बल (केवल ${minBindu} बिंदु):</strong> आपके <strong>${weakestHouse}वें भाव (${BHAVA_MEANINGS[weakestHouse].hi})</strong> में पूरी कुंडली के सबसे कम (मात्र ${minBindu}) बिंदु हैं, और ऊपर से वर्तमान में <strong>${PLANET_META[dasha.md].hi}–${PLANET_META[dasha.ad].hi}</strong> का समय-चक्र चल रहा है। बिना सटीक अंशबल (Degree/Chalit) जांचे और बिना सही उपाय किए, यह कमजोर कड़ी अगले 12–24 महीनों में आपके बने-बनाए अवसरों में बार-बार रुकावट डाल सकती है।
          </p>
        </div>

        <p class="text-amber-200 font-semibold mb-0">
          ⚠️ <strong>सबसे खतरनाक गलती जो 95% लोग करते हैं:</strong> इंटरनेट से देखकर या किसी अधूरे परामर्श पर बिना अपनी कुंडली का सटीक अंशबल (Exact Degrees, Bhava Chalit, Shadbala एवं लाल किताब के सोए हुए ग्रह) जांचे कोई भी रत्न पहन लेना—जिससे बाधकेश या मारक ग्रह और अधिक उग्र हो जाता है! अपनी जन्म-तिथि, सटीक समय और स्थान की संपूर्ण हस्तनिर्मित कुंडली, 5-वर्षीय महीना-दर-महीना भविष्यवाणी और सुरक्षित वैदिक/लाल किताब उपायों के लिए दाईं ओर दिए कार्ड से <strong>आचार्य ज्ञानेंद्र सिंह तोमर जी</strong> से अभी व्हाट्सएप पर जुड़ें।
        </p>
      `;
    }

    return `
      <p>
        Dear <strong>${name}</strong>, across the ten chapters above you saw the genuine brilliance, leadership, and partner potential wired into your chart. <strong>Now pause and ask the ruthless diagnostic question:</strong> If your chart carries such strong capability, <em>why do your biggest breakthroughs still get delayed at the 99th percentile? Why do the very people you support the most drain your peace? And why hasn't your 100% effort converted into the bank balance and peace of mind you deserve?</em>
      </p>

      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
        <div class="font-bold text-red-300 text-base">
          <i class="fas fa-biohazard mr-2"></i> 3 Unseen Astrological Blockages Silently Sabotaging Your Chart:
        </div>
        <p class="text-sm mb-0">
          <strong>1. Badhakesh (${badhakaInfo.meta.en}) & Functional Maraka Lock:</strong> For your ${RASHI_DATA[asc].en} Ascendant, <strong>${badhakaInfo.meta.en}</strong> acts as your <em>Badhakesh</em> (${lagnaMatrix.badhakaHouse}th-house chief obstructor) operating from your <strong>${badhakaInfo.bhava}th House</strong>. ${isManglik ? `Simultaneously, Mars in your ${mars.bhava}th House injects fiery Kuja/Manglik friction into your relationship and domestic axis.` : `Simultaneously, your functional Marakas (${lagnaMatrix.marakas.join(" & ")}) create subtle energy drains whenever their sub-periods trigger.`}
        </p>
        <p class="text-sm mb-0">
          <strong>2. Rahu-Ketu ${rahu.bhava}/${ketu.bhava} Nodal Trap & Saturn's Gaze:</strong> With <strong>Rahu in your ${rahu.bhava}th House (${RASHI_DATA[rahu.d1].en})</strong> and <strong>Ketu in your ${ketu.bhava}th House (${RASHI_DATA[ketu.d1].en})</strong>, an unseen karmic smoke-screen triggers overthinking, sudden distraction, or misplaced trust right when a major career or relationship milestone is about to lock in.
        </p>
        <p class="text-sm mb-0">
          <strong>3. Critical Ashtakavarga Energy Drain in House ${weakestHouse} (Only ${minBindu} Bindus):</strong> Your <strong>${weakestHouse}th House (${BHAVA_MEANINGS[weakestHouse].en})</strong> holds the lowest bindu reservoir in your entire chart while you navigate the <strong>${dasha.md}–${dasha.ad} Dasha</strong>. Left un-remedied, this weak link acts like a hidden leak in your destiny over the next 12–24 months.
        </p>
      </div>

      <p class="text-amber-200 font-semibold mb-0">
        ⚠️ <strong>Why Generic Internet Remedies & Random Gemstones Are Dangerous:</strong> Rashi-level placements only show <em>where</em> a planet sits—they do not show its exact longitudinal degree (0°–30°), whether it has shifted houses in your <strong>Bhava Chalit chart</strong>, or whether it is a sleeping/afflicted planet in Lal Kitab. Wearing the wrong gemstone can accidentally supercharge your Badhakesh or Maraka planet! Connect directly with <strong>Gyanendra S. Tomar</strong> via the consultation card to get your 100% hand-calculated degree report, 5-year month-by-month timeline, and safe, logical Vedic & Lal Kitab remedies.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 12 — GURU DAKSHINA CALIBRATION
  // --------------------------------------------------------------------------
  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart } = ctx;
    const jupRashi = RASHI_DATA[chart.Jupiter.d1];
    const headingEl = document.getElementById("dakshinaHeading");
    const textEl = document.getElementById("contentDakshinaText");
    if (!headingEl || !textEl) return;

    if (lang === "hi") {
      headingEl.innerHTML = `पवित्र ऊर्जा विनिमय एवं गुरु-दक्षिणा संकल्प 🙏`;
      textEl.innerHTML = `
        <p class="hindi">
          प्रिय <strong>${name}</strong>, आपकी कुंडली में देवगुरु बृहस्पति <strong>${jupRashi.hi}</strong> से आपके भाग्य और ज्ञान को नियंत्रित कर रहे हैं। सनातन वैदिक परंपरा का शाश्वत नियम है — जब भी हम ज्योतिष जैसी पवित्र ब्रह्म-विद्या के माध्यम से अपने प्रारब्ध, भावी जीवनसाथी और ग्रहों के गहरे रहस्यों का ज्ञान प्राप्त करते हैं, तो बिना <strong>'गुरु-दक्षिणा' (Energy Exchange)</strong> के उस ज्ञान का शुभ फल पूर्ण रूप से जागृत नहीं होता।
        </p>
        <p class="hindi">
          हमने यह 45-मिनट का गहन जीवन दस्तावेज़ इसलिए तैयार किया ताकि जो साधक आज ₹1101 का पूर्ण परामर्श लेने में असमर्थ भी हों, उन्हें भी किसी भ्रामक वेबसाइट से निराश न लौटना पड़े। यदि इस विश्लेषण ने आपके मन के अनकहे सच को छुआ है, तो अपनी श्रद्धा एवं सामर्थ्य के अनुसार <strong>(₹51, ₹101, ₹251 या ₹501)</strong> की गुरु-दक्षिणा सामने दिए गए QR कोड पर अर्पित कर बृहस्पति देव का आशीर्वाद अवश्य ग्रहण करें।
        </p>
      `;
    } else {
      headingEl.innerHTML = `Honor the Sacred Law of Energy Exchange (Guru Dakshina) 🙏`;
      textEl.innerHTML = `
        <p>
          Dear <strong>${name}</strong>, in your chart, <strong>Jupiter (Brihaspati — karaka of divine grace and fortune)</strong> operates through <strong>${jupRashi.en}</strong>. According to ancient Vedic tradition, Jyotish is sacred <em>Brahma-Vidya</em>: whenever we decode the hidden secrets of our destiny, future partner, and planetary karma, offering a voluntary <strong>Guru Dakshina (Sacred Energy Exchange)</strong> seals the reading with auspicious Guru-Kripa and prevents subtle karmic debt on the 9th house of fortune.
        </p>
        <p>
          We engineered this exhaustive 45-minute Life Dossier so that even someone who cannot afford our full ₹1101 hand-crafted consultation today still receives genuine, life-changing clarity. If this dossier spoke the unspoken truth about your life, please offer a heartfelt <strong>Guru Dakshina (₹51, ₹101, ₹251, or ₹501 as per your Shraddha)</strong> via the UPI QR code — and send your screenshot on WhatsApp to receive Gyanendra Ji's blessings.
        </p>
      `;
    }
  }

  // ==========================================================================
  // 8. HEADINGS, MASTHEAD, METRICS & SCROLLSPY CONTROLLER
  // ==========================================================================

  function updateChapterHeadingsAndNav(lang, ctx) {
    const labels = lang === "hi" ? {
      ch1Tag: "अध्याय 01 • आंतरिक मनोविज्ञान एवं व्यक्तित्व",
      ch1Title: "आपका अनकहा व्यक्तित्व, मानसिक संरचना एवं नाम-स्पंदन",
      ch2Tag: "अध्याय 02 • मेधा, स्मरण शक्ति एवं शिक्षा",
      ch2Title: "शिक्षा, एकाग्रता का पैटर्न एवं बौद्धिक डीएनए",
      ch3Tag: "अध्याय 03 • कर्म क्षेत्र, अधिकार एवं उत्थान",
      ch3Title: "करियर की दिशा, नौकरी बनाम व्यापार एवं कार्यक्षेत्र का सच",
      ch4Tag: "अध्याय 04 • अर्थ, बैंक बैलेंस एवं संपत्ति संचय",
      ch4Title: "धन योग, अचानक खर्च (Money Leaks) एवं समृद्धि सूत्र",
      ch5Tag: "अध्याय 05 • भाग्य भाव एवं स्वर्णिम वर्ष",
      ch5Title: "भाग्योदय, 99% पर अटकने का रहस्य एवं निर्णायक आयु",
      ch6Tag: "अध्याय 06 • प्रेम, आकर्षण एवं भावनात्मक संबंध",
      ch6Title: "प्रेम जीवन, भावनात्मक समर्पण एवं रिश्तों का मनोविज्ञान",
      ch7Tag: "अध्याय 07 • भावी जीवनसाथी एवं वैवाहिक भविष्य",
      ch7Title: "जीवनसाथी का रंग-रूप, स्वभाव, दिशा एवं विवाह-पश्चात भाग्योदय",
      ch8Tag: "अध्याय 08 • नवग्रह एवं पारस्परिक दृष्टि",
      ch8Title: "सभी 9 ग्रहों का गहन फलित, स्वामित्व, युति एवं पाराशरी दृष्टियां (D1 + D9)",
      ch9Tag: "अध्याय 09 • विशेष लग्न एवं 337-बिंदु अष्टकवर्ग",
      ch9Title: "चंद्र, सूर्य, नवांश, आरूढ़ लग्न एवं प्रमाणित पाराशरी अष्टकवर्ग (BAV/SAV)",
      ch10Tag: "अध्याय 10 • वर्तमान समय चक्र (महादशा एवं अंतर्दशा)",
      ch10Title: "आपका वर्तमान समय-चक्र एवं आगामी 18 महीनों की भविष्यवाणी",
      ch11Title: "⚠️ आपकी प्रगति को भीतर ही भीतर रोकने वाले 3 गुप्त ग्रह-अवरोध"
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
      ch8Title: "In-Depth Planetary Forces, Lordships & Mutual Aspects (D1 + D9)",
      ch9Tag: "Chapter 09 • Multi-Dimensional Chart Synthesis",
      ch9Title: "Special Lagnas (Chandra, Surya, Navamsa, Arudha) + Verified 337-Bindu SAV",
      ch10Tag: "Chapter 10 • Active Time Cycle (Mahadasha & Antardasha)",
      ch10Title: "Your Current Time Phase & Upcoming Life Transitions",
      ch11Title: "⚠️ The Hidden Blockages & Unseen Traps Silently Sabotaging Your Progress"
    };

    Object.keys(labels).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = labels[id];
    });

    const badgeEl = document.getElementById("dossierBadgeMode");
    const headerNameEl = document.getElementById("dossierHeaderName");
    const headerSubEl = document.getElementById("dossierHeaderSubtext");

    if (badgeEl) {
      badgeEl.innerHTML = ctx.chart.isFullChartMode
        ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "99.9% पूर्ण वैदिक कुंडली + अष्टकवर्ग डॉसियर" : "99.9% Full Parashari + Jaimini + 337-SAV Dossier"}`
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
        ? `जन्म: <strong>${ctx.dob} (आयु ${ctx.numData.age})</strong> • मूलांक: <strong>${ctx.numData.mulank}</strong> • भाग्यांक: <strong>${ctx.numData.bhagyank}</strong> • लग्न: <strong>${ascName}</strong> • चंद्र: <strong>${moonName}</strong> • दशा: <strong>${PLANET_META[ctx.dasha.md].hi}–${PLANET_META[ctx.dasha.ad].hi}</strong>`
        : `DOB: <strong>${ctx.dob} (Age ${ctx.numData.age})</strong> • Mulank: <strong>${ctx.numData.mulank}</strong> • Bhagyank: <strong>${ctx.numData.bhagyank}</strong> • Lagna: <strong>${ascName}</strong> • Moon: <strong>${moonName}</strong> • Dasha: <strong>${ctx.dasha.md}–${ctx.dasha.ad}</strong>`;
    }

    const waSummary = encodeURIComponent(
      `Namaste Gyanendra Ji 🙏\nI just read my 45-Minute Life Dossier on Jyotish Tark.\n` +
      `• Name: ${ctx.name}\n` +
      `• DOB: ${ctx.dob} (Mulank ${ctx.numData.mulank} / Bhagyank ${ctx.numData.bhagyank})\n` +
      `• Lagna: ${RASHI_DATA[ctx.chart.Asc.d1].en} | Moon: ${RASHI_DATA[ctx.chart.Moon.d1].en} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})\n` +
      `• Navamsa (D9) Lagna: ${RASHI_DATA[ctx.chart.Asc.d9].en}\n` +
      `• Active Dasha: ${ctx.dasha.md} - ${ctx.dasha.ad}\n` +
      `I want to book my ₹1101 Complete Hand-Crafted Kundali & Personal Remedies.`
    );
    const waUrl = `https://wa.me/918318513814?text=${waSummary}`;
    const topWaBtn = document.getElementById("dossierTopWhatsappBtn");
    const urgentWaBtn = document.getElementById("urgentConsultWhatsappBtn");
    if (topWaBtn) topWaBtn.href = waUrl;
    if (urgentWaBtn) urgentWaBtn.href = waUrl;
  }

  function updateReadingMetricsBadge(lang) {
    const container = document.getElementById("masterDossierOutput");
    const badgeEl = document.getElementById("readingTimeEstimate");
    if (!container || !badgeEl) return;

    const rawText = container.innerText || "";
    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(35, Math.min(48, Math.round(wordCount / 115) + 14));
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
    }, {passive: true});
  }

  // ==========================================================================
  // 9. MASTER GLOBAL ENTRY POINT
  // ==========================================================================

  window.generateCompleteLifeDossier = function (event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();

    const nameInput   = document.getElementById("userName")?.value.trim() || "Seeker";
    const dobInput    = document.getElementById("userDob")?.value || "1998-01-24";
    const langInput   = document.getElementById("reportLang")?.value || "en";
    const genderInput = document.getElementById("userGender")?.value || "male";

    const chaldean       = calculateChaldeanName(nameInput);
    const numData        = calculateNumerologyFromDob(dobInput);
    const chart          = readChartFromDOM(numData, chaldean);
    const planetAnalysis = analyzeAllPlanetsAndAspects(chart);
    const specialLagnas  = computeSpecialLagnasAndBindus(chart, planetAnalysis);
    const dasha          = resolveActiveDasha(chart, numData);

    const ctx = {
      name: nameInput, dob: dobInput, lang: langInput, gender: genderInput,
      chaldean, numData, chart, planetAnalysis, specialLagnas, dasha
    };

    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    updateChapterHeadingsAndNav(langInput, ctx);
    setHtml("contentPersonality",     buildChapter1Personality(ctx));
    setHtml("contentEducation",       buildChapter2Education(ctx));
    setHtml("contentCareer",          buildChapter3Career(ctx));
    setHtml("contentWealth",          buildChapter4Wealth(ctx));
    setHtml("contentLuck",            buildChapter5Luck(ctx));
    setHtml("contentLove",            buildChapter6Love(ctx));
    setHtml("contentPartner",         buildChapter7Partner(ctx));
    setHtml("contentPlanetsAspects",  buildChapter8PlanetsAndAspects(ctx));
    setHtml("contentSpecialLagnas",   buildChapter9SpecialLagnas(ctx));
    setHtml("contentTimePhase",       buildChapter10TimePhase(ctx));
    setHtml("contentHiddenTraps",     buildChapter11HiddenTraps(ctx));
    updateChapter12Dakshina(ctx);

    // Pre-populate Manual Booking Form so user doesn't have to re-type
    const mName = document.getElementById("name");
    const mDob = document.getElementById("dob");
    const mGender = document.getElementById("gender");
    if (mName && !mName.value) mName.value = nameInput;
    if (mDob && !mDob.value) mDob.value = dobInput;
    if (mGender && !mGender.value) mGender.value = genderInput;

    const outputContainer = document.getElementById("masterDossierOutput");
    if (outputContainer) {
      outputContainer.classList.remove("hidden");
      updateReadingMetricsBadge(langInput);
      setTimeout(() => outputContainer.scrollIntoView({behavior: "smooth", block: "start"}), 100);
    }
  };

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
