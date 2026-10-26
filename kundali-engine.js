/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js • v9.0 (Full BPHS + Findings + Timing Integration)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 */

(function () {
  "use strict";

  window.__jtMode = window.__jtMode || "derived"; // "vedic" | "manual" | "derived"
  window.__jtVedicData = window.__jtVedicData || null;

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

  const PLANET_MATURITY_AGES = {
    Jupiter: [16, 24, 32],
    Sun:     [22, 28, 34],
    Moon:    [24, 28, 32],
    Venus:   [25, 29, 33],
    Mars:    [28, 32, 36],
    Mercury: [32, 35, 38],
    Saturn:  [36, 39, 42],
    Rahu:    [42, 44, 48],
    Ketu:    [45, 48, 52]
  };

  const BHAVA_IN_BHAVA_EFFECTS_HI = {
    1: "स्व-पराक्रम, स्वतंत्र निर्णय और व्यक्तिगत आभा से स्वतः भाग्योदय",
    2: "परिवार की जिम्मेदारी, वाणी के प्रभाव और संचित कोष से सीधा जुड़ाव",
    3: "कठिन परिश्रम, साहस, छोटे प्रवास और अपने बाहुबल से शून्य से शिखर निर्माण",
    4: "माता के आशीर्वाद, भूमि-भवन, वाहन और आंतरिक मानसिक शांति से जुड़ा फल",
    5: "तीव्र मेधा, पूर्वजन्म के पुण्य (प्रारब्ध), संतान और आकस्मिक निर्णय क्षमता से लाभ",
    6: "कड़ी प्रतिस्पर्धा, शत्रुओं/विरोधियों को परास्त करने और संघर्ष की भट्टी में तपकर विजय",
    7: "विवाह के पश्चात भाग्योदय, जीवनसाथी के भाग्य और जन-संपर्क से सीधा उत्थान",
    8: "अचानक आने वाले बड़े मोड़, गहन शोध, गुप्त बाधाओं और पीड़ा के बाद आकस्मिक लाभ",
    9: "ईश्वरीय कृपा, गुरु/पिता के आशीर्वाद और लंबी दूरी/धर्म के माध्यम से सर्वोच्च भाग्योदय",
    10: "उच्च पद, सत्ता, राजयोग और कार्यक्षेत्र में सर्वोच्च कमांड व प्रतिष्ठा",
    11: "बड़े आर्थिक लाभ, इच्छापूर्ति और प्रभावशाली लोगों के नेटवर्क से धन-वर्षा",
    12: "जन्मस्थान से दूर/विदेश संपर्क, एकांत चिंतन और अनपेक्षित खर्चों के बीच गुप्त उन्नति"
  };

  const BHAVA_IN_BHAVA_EFFECTS_EN = {
    1: "self-made authority, personal charisma, and independent life command",
    2: "family lineage duties, persuasive speech, and direct treasury accumulation",
    3: "relentless self-effort, courageous risk-taking, and building from scratch",
    4: "maternal blessings, real-estate/vehicle assets, and domestic sanctuary",
    5: "Purva-Punya intelligence, competitive exam brilliance, and progeny luck",
    6: "crushing competition, overcoming hidden rivals, and rising through service/litigation",
    7: "post-marriage destiny activation, high-value partnerships, and public visibility",
    8: "sudden karmic reversals, deep research mastery, and phoenix-like rebirth after crisis",
    9: "divine grace (Bhagya), mentor/paternal karma, and long-distance expansion",
    10: "executive command, throne-status, and institutional reputation",
    11: "massive income multiplication, fulfilled ambitions, and elite networks",
    12: "foreign/distant-city breakthroughs, subconscious intuition, and heavy capital outflows"
  };

  // BPHS Ch. 34 Verified Functional Matrix (Only Taurus, Cancer, Leo, Libra, Capricorn, Aquarius have a single Yogakaraka)
  const LAGNA_FUNCTIONAL_MATRIX = {
    1: { // Mesha (Movable -> 11th Badhaka)
      yogakaraka: [],
      benefics: ["Sun", "Moon", "Mars", "Jupiter"],
      neutrals: [],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Venus", "Saturn"],
      badhakaHouse: 11, badhakesh: "Saturn",
      secretWeaknessEn: "impulsive trust, sudden bursts of righteous anger that fade within minutes, and fighting everyone else's battles while hiding your own exhaustion",
      secretWeaknessHi: "आवेग में आकर भरोसा करना, क्षणिक क्रोध जिसके बाद आपको स्वयं ग्लानि होती है, और अपनी थकान छिपाकर दूसरों की जिम्मेदारियां अपने सिर ले लेना"
    },
    2: { // Vrishabha (Fixed -> 9th Badhaka)
      yogakaraka: ["Saturn"],
      benefics: ["Saturn", "Sun", "Mercury"],
      neutrals: ["Mars"],
      malefics: ["Jupiter", "Venus", "Moon"],
      marakas: ["Mars", "Jupiter", "Venus"],
      badhakaHouse: 9, badhakesh: "Saturn",
      secretWeaknessEn: "silent stubbornness, holding onto past emotional wounds for years without speaking, and sacrificing personal desires to keep family stability intact",
      secretWeaknessHi: "भीतर ही भीतर पुरानी बातों को वर्षों तक दबाए रखना, जिद्दी स्वाभिमान और परिवार की स्थिरता के लिए अपनी इच्छाओं का चुपचाप त्याग करना"
    },
    3: { // Mithuna (Dual -> 7th Badhaka)
      yogakaraka: [],
      benefics: ["Venus"],
      neutrals: ["Mercury", "Saturn", "Moon"],
      malefics: ["Mars", "Jupiter", "Sun"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "two parallel tracks of thought running 24/7 in your head, late-night mental replay of conversations, and feeling intellectually lonely even in a room full of people",
      secretWeaknessHi: "दिमाग में 24 घंटे दो समानांतर विचारों का चलना, रात्रि में अत्यधिक ओवरथिंकिंग और भीड़ में भी अपने बौद्धिक स्तर का साथी न मिल पाने का एकाकीपन"
    },
    4: { // Karka (Movable -> 11th Badhaka)
      yogakaraka: ["Mars"],
      benefics: ["Moon", "Mars", "Jupiter"],
      neutrals: ["Sun"],
      malefics: ["Venus", "Mercury", "Saturn"],
      marakas: ["Saturn", "Venus", "Mercury"],
      badhakaHouse: 11, badhakesh: "Venus",
      secretWeaknessEn: "absorbing the emotional stress of people around you like a sponge, giving 100% loyalty to those who return 30%, and silent internal mood tides",
      secretWeaknessHi: "दूसरों के दुख और तनाव को अपने भीतर सोख लेना, उन लोगों को 100% वफादारी देना जो बदले में 30% भी नहीं लौटाते, और अचानक मन का उदास हो जाना"
    },
    5: { // Simha (Fixed -> 9th Badhaka)
      yogakaraka: ["Mars"],
      benefics: ["Sun", "Mars", "Jupiter"],
      neutrals: ["Moon"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Saturn", "Venus", "Mercury"],
      badhakaHouse: 9, badhakesh: "Mars", // Fixed: 9th Lord Mars is Badhakesh for Leo
      secretWeaknessEn: "fierce royal pride that refuses to ask for help even when bleeding internally, and feeling taken for granted by the very people you shelter",
      secretWeaknessHi: "अटूट राजसी स्वाभिमान जिसके कारण आप टूटने पर भी किसी से मदद नहीं मांगते, और जिन लोगों की आप रक्षा करते हैं उन्हीं से अपेक्षित सम्मान न मिलना"
    },
    6: { // Kanya (Dual -> 7th Badhaka)
      yogakaraka: [],
      benefics: ["Venus", "Mercury"],
      neutrals: ["Saturn", "Sun"],
      malefics: ["Mars", "Jupiter", "Moon"],
      marakas: ["Mars", "Jupiter", "Venus"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "hyper-critical perfectionism, spotting micro-flaws that others miss, gut/nervous tension when plans go off-script, and acting as the unpaid fixer in relationships",
      secretWeaknessHi: "हर काम में पूर्णता (perfection) खोजने की आदत, सूक्ष्म से सूक्ष्म गलती को तुरंत पकड़ लेना, और रिश्तों में हमेशा दूसरों की समस्याएं सुलझाते रहना"
    },
    7: { // Tula (Movable -> 11th Badhaka)
      yogakaraka: ["Saturn"],
      benefics: ["Saturn", "Mercury", "Venus"],
      neutrals: ["Moon"],
      malefics: ["Sun", "Jupiter", "Mars"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Sun",
      secretWeaknessEn: "swallowing your own hurt to preserve surface harmony until you suddenly detach forever, and second-guessing yourself at major life crossroads",
      secretWeaknessHi: "शांति बनाए रखने के लिए अपनी भावनाओं को दबाना—और जब सहनशक्ति की सीमा समाप्त हो जाए तो बिना शोर किए पूरी तरह तटस्थ (detach) हो जाना"
    },
    8: { // Vrishchika (Fixed -> 9th Badhaka)
      yogakaraka: [],
      benefics: ["Moon", "Jupiter", "Sun", "Mars"],
      neutrals: [],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Venus", "Mercury", "Saturn"],
      badhakaHouse: 9, badhakesh: "Moon",
      secretWeaknessEn: "living in 'all-or-nothing' extremes, radar-like suspicion born from past betrayals, and locking your deepest emotional scars inside an unbreakable vault",
      secretWeaknessHi: "'आर या पार' के चरम पर जीना, पूर्व में मिले विश्वासघात के कारण किसी पर आसानी से भरोसा न कर पाना और अपने गहरे घाव किसी को न दिखाना"
    },
    9: { // Dhanu (Dual -> 7th Badhaka)
      yogakaraka: [],
      benefics: ["Mars", "Sun", "Jupiter"],
      neutrals: ["Moon"],
      malefics: ["Venus", "Saturn", "Mercury"],
      marakas: ["Venus", "Saturn", "Mercury"],
      badhakaHouse: 7, badhakesh: "Mercury",
      secretWeaknessEn: "blunt truth-speaking that unintentionally offends diplomatic people, secret restlessness that you haven't hit your true ceiling yet, and guiding people who don't value your wisdom",
      secretWeaknessHi: "बिना लाग-लपेट के सच बोल देना जिससे स्वार्थी लोग दूरी बना लेते हैं, और भीतर ही भीतर यह बेचैनी कि आप अभी अपने असली मुकाम तक नहीं पहुंचे हैं"
    },
    10: { // Makara (Movable -> 11th Badhaka)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Mercury", "Saturn"],
      neutrals: ["Sun"],
      malefics: ["Mars", "Jupiter", "Moon"],
      marakas: ["Moon", "Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Mars",
      secretWeaknessEn: "growing up too early emotionally, carrying a quiet fear of failure behind a stoic face, and feeling that everyone leans on your shoulder while you have no one to lean on",
      secretWeaknessHi: "उम्र से पहले जिम्मेदार हो जाना, चट्टान जैसे चेहरे के पीछे असफलता का अनकहा डर और यह एहसास कि सब आप पर टिके हैं पर आपके कंधे को सहारा देने वाला कोई नहीं"
    },
    11: { // Kumbha (Fixed -> 9th Badhaka)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Saturn", "Sun", "Mars"],
      neutrals: ["Mercury"],
      malefics: ["Jupiter", "Moon"],
      marakas: ["Jupiter", "Moon", "Sun"],
      badhakaHouse: 9, badhakesh: "Venus",
      secretWeaknessEn: "deep inner detachment even while smiling in social gatherings, irregular sleep from a brain that lives five years in the future, and clashing with egoistic partners",
      secretWeaknessHi: "समाज में सबके साथ घुलने-मिलने के बावजूद भीतर से गहरा वैराग्य, रात्रि में अति-सक्रिय मस्तिष्क के कारण नींद में खलल और स्वाभिमानी जीवनसाथी से वैचारिक टकराव"
    },
    12: { // Meena (Dual -> 7th Badhaka)
      yogakaraka: [],
      benefics: ["Moon", "Mars", "Jupiter"],
      neutrals: [],
      malefics: ["Sun", "Venus", "Saturn", "Mercury"],
      marakas: ["Mercury", "Saturn", "Venus"],
      badhakaHouse: 7, badhakesh: "Mercury",
      secretWeaknessEn: "forgiving people who repeatedly exploit your softness, struggling to enforce harsh boundaries, and falling in love with someone's potential rather than their reality",
      secretWeaknessHi: "अपनी करुणा का गलत फायदा उठाने वालों को भी बार-बार माफ कर देना, भावनात्मक सीमाएं (boundaries) न बना पाना और लोगों को जरूरत से ज्यादा आदर्श मान लेना"
    }
  };

  const RASHI_DATA = {
    1:  { id:1, en:"Mesha (Aries)",     hi:"मेष (Aries)",     lord:"Mars",    lordHi:"मंगल",
          element:"Fire (अग्नि)",  elementHi:"अग्नि तत्व",  quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          altDirection:"South-East (आग्नेय/दक्षिण-पूर्व)", altDirectionHi:"दक्षिण-पूर्व (आग्नेय) दिशा",
          temperamentEn:"fiercely independent, pioneering, action-driven, and instinctively allergic to micromanagement",
          temperamentHi:"अत्यंत स्वतंत्र, अग्रणी, कर्मठ और किसी के अनुचित नियंत्रण में न रहने वाला",
          bodyBuildEn:"sharp facial bone structure, intense commanding gaze, athletic energy, and a brisk purposeful walk",
          bodyBuildHi:"तेज आंखें, तीखे आकर्षक नैन-नक्श, ऊर्जावान शरीर और आत्मविश्वास भरी तेज चाल" },
    2:  { id:2, en:"Vrishabha (Taurus)", hi:"वृषभ (Taurus)",   lord:"Venus",   lordHi:"शुक्र",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          altDirection:"South-West (नैऋत्य)", altDirectionHi:"दक्षिण-पश्चिम दिशा",
          temperamentEn:"grounded, deeply loyal, luxury-appreciating, patient until pushed to the wall, and financially astute",
          temperamentHi:"स्थिर बुद्धि, अपनों के प्रति अटूट समर्पण, कला व गुणवत्ता के पारखी और धैर्यवान",
          bodyBuildEn:"graceful symmetrical features, expressive magnetic eyes, soothing voice, and a calm regal presence",
          bodyBuildHi:"सौम्य आकर्षक चेहरा, सुंदर बोलती आंखें, मधुर वाणी और शांत प्रभावशाली आभा" },
    3:  { id:3, en:"Mithuna (Gemini)",   hi:"मिथुन (Gemini)",   lord:"Mercury", lordHi:"बुध",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          altDirection:"North-West (वायव्य)", altDirectionHi:"उत्तर-पश्चिम दिशा",
          temperamentEn:"hyper-intelligent, articulate, adaptable, curious, and mentally three steps ahead of everyone else",
          temperamentHi:"तीव्र बुद्धि, वाक्पटु, बहुमुखी प्रतिभा के धनी और हर परिस्थिति को तुरंत भांप लेने वाले",
          bodyBuildEn:"youthful appearance that ages slowly, sparkling observant eyes, expressive hands, and quick wit",
          bodyBuildHi:"उम्र से कम दिखने वाला युवा चेहरा, चंचल चमकदार आंखें और प्रभावशाली संवाद शैली" },
    4:  { id:4, en:"Karka (Cancer)",     hi:"कर्क (Cancer)",     lord:"Moon",    lordHi:"चंद्रमा",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          altDirection:"North-East (ईशान)", altDirectionHi:"उत्तर-पूर्व (ईशान) दिशा",
          temperamentEn:"deeply intuitive, nurturing, fiercely protective of loved ones, and privately guarded behind a warm smile",
          temperamentHi:"अत्यंत संवेदनशील, अंतर्ज्ञानी, अपनों की ढाल बनने वाले और भावनात्मक रूप से गहरे",
          bodyBuildEn:"soft luminescent complexion, soulful empathetic eyes, gentle smile, and a deeply comforting aura",
          bodyBuildHi:"सौम्य आभा, गहरी भावुक आंखें, शांत मुस्कान और अपनापन देने वाला व्यक्तित्व" },
    5:  { id:5, en:"Simha (Leo)",        hi:"सिंह (Leo)",        lord:"Sun",     lordHi:"सूर्य",
          element:"Fire (अग्नि)",   elementHi:"अग्नि तत्व",   quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          altDirection:"Central / Capital Region (केंद्र क्षेत्र)", altDirectionHi:"केंद्र या राजधानी क्षेत्र",
          temperamentEn:"regal, self-respecting, magnanimous, protective, and born to lead rather than follow",
          temperamentHi:"स्वाभिमानी, उदार हृदय, वचन के पक्के और जन्मजात नेतृत्व क्षमता से भरपूर",
          bodyBuildEn:"commanding posture, broad forehead, radiant aura, and an unmistakable lion-like dignity",
          bodyBuildHi:"रौबदार व्यक्तित्व, चौड़ा तेजस्वी माथा, प्रभावशाली कंधे और राजसी चाल" },
    6:  { id:6, en:"Kanya (Virgo)",      hi:"कन्या (Virgo)",     lord:"Mercury", lordHi:"बुध",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          altDirection:"South-East (दक्षिण-पूर्व)", altDirectionHi:"दक्षिण-पूर्व दिशा",
          temperamentEn:"analytical, detail-oriented, quietly observant of hidden flaws, and ruthlessly practical in crisis",
          temperamentHi:"सूक्ष्म विश्लेषक, पूर्णतावादी, तार्किक और संकट में भी शांत रहकर समाधान निकालने वाले",
          bodyBuildEn:"neat refined features, intelligent penetrating eyes, youthful skin, and a well-groomed poised look",
          bodyBuildHi:"सुव्यवस्थित और सलीकेदार व्यक्तित्व, तीक्ष्ण बुद्धिमान आंखें और सौम्य आकर्षण" },
    7:  { id:7, en:"Tula (Libra)",       hi:"तुला (Libra)",      lord:"Venus",   lordHi:"शुक्र",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          altDirection:"South-West (दक्षिण-पश्चिम)", altDirectionHi:"दक्षिण-पश्चिम दिशा",
          temperamentEn:"diplomatic, justice-loving, aesthetically refined, charming, and wired for high-value partnerships",
          temperamentHi:"न्यायप्रिय, संतुलित, सौंदर्य व सुरुचि के प्रेमी और उच्च स्तरीय व्यवहार-कुशल",
          bodyBuildEn:"proportionate attractive features, dimpled or warm smile, graceful posture, and natural elegance",
          bodyBuildHi:"संतुलित आकर्षक नैन-नक्श, मोहक मुस्कान और शालीन राजसी अंदाज" },
    8:  { id:8, en:"Vrishchika (Scorpio)",hi:"वृश्चिक (Scorpio)",lord:"Mars",    lordHi:"मंगल",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          altDirection:"North-West (उत्तर-पश्चिम)", altDirectionHi:"उत्तर-पश्चिम दिशा",
          temperamentEn:"intense, investigative, transformative, phoenix-like in resilience, and impossible to deceive",
          temperamentHi:"गूढ़ रहस्यमयी, गहरी शोधवृत्ति वाले, झूठ को तुरंत पकड़ने वाले और संकटों से फीनिक्स की तरह उठने वाले",
          bodyBuildEn:"piercing hypnotic eyes, magnetic aura, strong jawline, and unmistakable quiet intensity",
          bodyBuildHi:"आंखों में गहरा चुंबकीय आकर्षण, रहस्यमयी गंभीरता और प्रभावशाली शारीरिक ऊर्जा" },
    9:  { id:9, en:"Dhanu (Sagittarius)",hi:"धनु (Sagittarius)",lord:"Jupiter", lordHi:"बृहस्पति (गुरु)",
          element:"Fire (अग्नि)",   elementHi:"अग्नि तत्व",   quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          altDirection:"North-East (ईशान/उत्तर-पूर्व)", altDirectionHi:"उत्तर-पूर्व (ईशान) दिशा",
          temperamentEn:"philosophical, truth-speaking, dharmic, visionary, and driven by higher purpose and expansion",
          temperamentHi:"सत्यवादी, दूरदर्शी, उच्च आदर्शों वाले, स्वाभिमानी और ज्ञान के उपासक",
          bodyBuildEn:"tall or well-proportioned frame, bright forehead, warm open eyes, and an energetic stride",
          bodyBuildHi:"तेजस्वी ललाट, सकारात्मक ऊर्जा से भरा चेहरा और प्रभावशाली कद-काठी" },
    10: { id:10,en:"Makara (Capricorn)", hi:"मकर (Capricorn)",  lord:"Saturn",  lordHi:"शनि",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          altDirection:"West-South-West (पश्चिम-दक्षिण)", altDirectionHi:"पश्चिम-दक्षिण दिशा",
          temperamentEn:"strategic, relentless, self-made, disciplined, and unshakeable under heavy responsibility",
          temperamentHi:"कर्मप्रधान, कुशल रणनीतिकार, यथार्थवादी और कठिन परिश्रम से अपना साम्राज्य खड़ा करने वाले",
          bodyBuildEn:"defined bone structure, mature composed look, deep thoughtful eyes, and steady grounded walk",
          bodyBuildHi:"गंभीर और परिपक्व व्यक्तित्व, गहरी सोच वाली आंखें और धैर्यवान आभा" },
    11: { id:11,en:"Kumbha (Aquarius)",  hi:"कुंभ (Aquarius)",  lord:"Saturn",  lordHi:"शनि",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          altDirection:"North-West (उत्तर-पश्चिम)", altDirectionHi:"उत्तर-पश्चिम दिशा",
          temperamentEn:"unconventional, futuristic, scientifically minded, humanitarian, and fiercely protective of inner freedom",
          temperamentHi:"लीक से हटकर सोचने वाले, वैज्ञानिक दृष्टिकोण, दार्शनिक और अपनी मानसिक स्वतंत्रता के प्रति सजग",
          bodyBuildEn:"distinctive noble features, visionary gaze, tall or lean-strong frame, and an intellectual aura",
          bodyBuildHi:"बुद्धिजीवी आभा, दूरदर्शी विचारशील आंखें और भीड़ से अलग पहचान वाला व्यक्तित्व" },
    12: { id:12,en:"Meena (Pisces)",     hi:"मीन (Pisces)",      lord:"Jupiter", lordHi:"बृहस्पति (गुरु)",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          altDirection:"North-East (ईशान/उत्तर-पूर्व)", altDirectionHi:"उत्तर-पूर्व (ईशान) दिशा",
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
    Sun:     {en:"Sun (Surya)",         hi:"सूर्य (Sun)",         karakaEn:"Soul, authority, father, royal dignity, vitality, and government/executive command", karakaHi:"आत्मा, स्वाभिमान, पिता, राजसत्ता, आरोग्य एवं उच्च प्रशासनिक अधिकार", exalted:1,  debilitated:7,  own:[5],     aspects:[7],
              healthEn:"eyes, heart, blood pressure, spine, and vitamin-D vitality", healthHi:"आंखें, हृदय, रक्तचाप (BP), रीढ़ की हड्डी और जीवन-ऊर्जा"},
    Moon:    {en:"Moon (Chandra)",      hi:"चंद्रमा (Moon)",      karakaEn:"Mind, emotions, mother, subconscious peace, intuition, and liquid cash flow",      karakaHi:"मन, भावनाएं, माता, मानसिक शांति, अंतर्ज्ञान एवं नकदी प्रवाह",       exalted:2,  debilitated:8,  own:[4],     aspects:[7],
              healthEn:"sleep cycles, sinus/cold sensitivity, hormonal balance, and emotional anxiety", healthHi:"निद्रा चक्र, कफ/साइनस, भावनात्मक उतार-चढ़ाव और मानसिक तनाव"},
    Mars:    {en:"Mars (Mangal)",       hi:"मंगल (Mars)",         karakaEn:"Courage, willpower, real estate/land, siblings, blood/energy, and execution fire", karakaHi:"साहस, पराक्रम, भूमि-संपत्ति, भाई-बहन, रक्त-ऊर्जा एवं निर्णय शक्ति",  exalted:10, debilitated:4,  own:[1,8],   aspects:[4,7,8],
              healthEn:"body heat/pitta, acidity, blood iron, muscles, and minor cuts/inflammation", healthHi:"शरीर की पित्त-गर्मी, एसिडिटी, रक्त-ऊर्जा और मांसपेशियों का खिंचाव"},
    Mercury: {en:"Mercury (Budh)",      hi:"बुध (Mercury)",       karakaEn:"Analytical intelligence, speech, trade, coding/logic, skin/nerves, and diplomacy", karakaHi:"विश्लेषणात्मक बुद्धि, वाणी, व्यापार, तर्कशक्ति, तंत्रिका तंत्र एवं कूटनीति", exalted:6,  debilitated:12, own:[3,6],   aspects:[7],
              healthEn:"nervous system, gut-brain axis, skin sensitivity, and vocal cords", healthHi:"तंत्रिका तंत्र (nerves), पाचन-मस्तिष्क अक्ष, त्वचा और कंठ"},
    Jupiter: {en:"Jupiter (Guru)",      hi:"बृहस्पति / गुरु",     karakaEn:"Divine grace, higher wisdom, wealth expansion, children, dharma, and Husband-Karaka", karakaHi:"ईश्वरीय कृपा, उच्च ज्ञान, धन-वृद्धि, संतान, धर्म एवं (स्त्री कुंडली में) पति कारक", exalted:4,  debilitated:10, own:[9,12],  aspects:[5,7,9],
              healthEn:"liver metabolism, lipid/sugar balance, pancreas, and weight regulation", healthHi:"लीवर, पाचन-चयापचय (metabolism), कोलेस्ट्रॉल/शुगर और वजन संतुलन"},
    Venus:   {en:"Venus (Shukra)",      hi:"शुक्र (Venus)",       karakaEn:"Romance, marriage, Wife-Karaka, luxury, vehicles, aesthetics, and charisma",       karakaHi:"प्रेम, वैवाहिक सुख, (पुरुष कुंडली में) पत्नी कारक, वैभव, वाहन एवं आकर्षण", exalted:12, debilitated:6,  own:[2,7],   aspects:[7],
              healthEn:"reproductive vitality, endocrine hormones, kidneys, and skin glow", healthHi:"प्रजनन ऊर्जा, हार्मोनल संतुलन, किडनी और चेहरे की आभा"},
    Saturn:  {en:"Saturn (Shani)",      hi:"शनि (Saturn)",        karakaEn:"Karmic justice, discipline, longevity, mass authority, endurance, and steady empire", karakaHi:"कर्मफल दाता, न्याय, अनुशासन, दीर्घायु एवं संघर्ष के बाद अजेय साम्राज्य", exalted:7,  debilitated:1,  own:[10,11], aspects:[3,7,10],
              healthEn:"joints/knees, lower back, dental/bone calcium, Vata dryness, and chronic fatigue", healthHi:"जोड़ों/घुटनों का दर्द, कमर, हड्डियों में कैल्शियम, वात और शारीरिक थकान"},
    Rahu:    {en:"Rahu (North Node)",   hi:"राहु (Rahu)",         karakaEn:"Obsessive ambition, sudden amplification, foreign links, technology, and illusion", karakaHi:"असीम महत्वाकांक्षा, अचानक उछाल, विदेश योग, आधुनिक तकनीक एवं माया",     exalted:2,  debilitated:8,  own:[11],    aspects:[5,7,9],
              healthEn:"sudden undiagnosed allergies, late-night insomnia, and overthinking loops", healthHi:"अचानक होने वाली एलर्जी, अनिद्रा (insomnia) और अज्ञात मानसिक बेचैनी"},
    Ketu:    {en:"Ketu (South Node)",   hi:"केतु (Ketu)",         karakaEn:"Past-life mastery, spiritual detachment, occult/medical intuition, and sudden cuts", karakaHi:"पूर्वजन्म का संचित ज्ञान, वैराग्य, सूक्ष्म अंतर्ज्ञान एवं अचानक अलगाव",   exalted:8,  debilitated:2,  own:[8],     aspects:[5,7,9],
              healthEn:"subtle nerve/spine sensitivity, sudden energy drops, and gut-instinct flashes", healthHi:"रीढ़ व नसों की संवेदनशीलता, अचानक ऊर्जा में कमी और सूक्ष्म आभास"}
  };

  const BHAVA_MEANINGS = {
    1:  {en:"1st House (Self, Vitality & Life Direction)",           hi:"प्रथम भाव (व्यक्तित्व, आत्मबल एवं जीवन दिशा)"},
    2:  {en:"2nd House (Bank Balance, Speech & Family)",             hi:"द्वितीय भाव (बैंक बैलेंस, वाणी एवं कुटुंब)"},
    3:  {en:"3rd House (Self-Effort, Courage & Communication)",      hi:"तृतीय भाव (साहस, स्व-पराक्रम एवं संवाद)"},
    4:  {en:"4th House (Inner Peace, Mother, Property & Vehicles)",  hi:"चतुर्थ भाव (मानसिक शांति, माता, भूमि एवं वाहन)"},
    5:  {en:"5th House (Intellect, Exams, Romance & Children)",      hi:"पंचम भाव (मेधा, परीक्षा, प्रेम एवं संतान)"},
    6:  {en:"6th House (Competition, Job Service, Debt & Health)",   hi:"षष्ठ भाव (प्रतियोगी विजय, नौकरी, ऋण एवं स्वास्थ्य)"},
    7:  {en:"7th House (Marriage, Life Partner & Public Image)",     hi:"सप्तम भाव (विवाह, जीवनसाथी एवं साझेदारी)"},
    8:  {en:"8th House (Sudden Turns, Research, In-Laws & Secrets)", hi:"अष्टम भाव (आकस्मिक परिवर्तन, ससुराल एवं गुप्त रहस्य)"},
    9:  {en:"9th House (Divine Grace, Luck, Father & Higher Wisdom)",hi:"नवम भाव (ईश्वरीय कृपा, भाग्योदय, पिता एवं धर्म)"},
    10: {en:"10th House (Career Command, Status & Authority)",       hi:"दशम भाव (करियर शिखर, सत्ता एवं पद-प्रतिष्ठा)"},
    11: {en:"11th House (Income Gains, Desires & Elite Networks)",   hi:"एकादश भाव (बड़े आर्थिक लाभ एवं इच्छापूर्ति)"},
    12: {en:"12th House (Foreign Links, Sleep, Outflows & Release)", hi:"द्वादश भाव (विदेश योग, निद्रा, व्यय एवं निवेश)"}
  };

  const MULANK_ARCHETYPES = {
    1:{ruler:"Sun (सूर्य)", titleEn:"The Sovereign Pioneer (Psychic Number 1 — Royal Sun)",
       psychEn:"Governed by Number 1 (Surya), your soul carries an innate refusal to be second-best or take orders from people you don't respect. Outsiders see your composed, self-reliant exterior, but almost nobody realizes the immense silent pressure you put on yourself to never look weak.",
       psychHi:"मूलांक 1 (सूर्य) से शासित होने के कारण आपकी आत्मा में जन्मजात नेतृत्व और अटूट स्वाभिमान है। बाहर से लोग आपको मजबूत समझते हैं, पर बहुत कम लोग जानते हैं कि आप अपनी समस्याएं अकेले सुलझाने का कितना भारी दबाव झेलते हैं।"},
    2:{ruler:"Moon (चंद्रमा)", titleEn:"The Intuitive Empath (Psychic Number 2 — Lunar Radar)",
       psychEn:"Governed by Number 2 (Chandra), your mind acts like a high-frequency emotional radar. Within thirty seconds of meeting someone, you sense their unspoken intentions. However, your greatest gift is also your heaviest burden: you notice tiny shifts in people's tone and replay conversations late at night.",
       psychHi:"मूलांक 2 (चंद्रमा) के कारण आपका मन एक उच्च-संवेदनशील रडार की तरह काम करता है। किसी से मिलने के कुछ ही पलों में आप उसकी असली नीयत भांप लेते हैं, परंतु दूसरों के व्यवहार के छोटे से बदलाव को भी आप रात तक गहराई से सोचते रहते हैं।"},
    3:{ruler:"Jupiter (बृहस्पति)", titleEn:"The Dharmic Strategist (Psychic Number 3 — Guru Wisdom)",
       psychEn:"Ruled by Number 3 (Brihaspati), you possess a rare combination of knowledge-hunger, ethical pride, and expansive ambition. People constantly come to you for counsel when their lives fall apart, yet when you need guidance, you rarely find someone matching your mental maturity.",
       psychHi:"मूलांक 3 (बृहस्पति) से आपमें ज्ञान, स्वाभिमान और उच्च महत्वाकांक्षा का संगम है। संकट में लोग आपसे सलाह लेने आते हैं, पर जब आपको खुद मानसिक सहारे की जरूरत होती है, तो आपके स्तर की परिपक्वता वाला इंसान आसानी से नहीं मिलता।"},
    4:{ruler:"Rahu (राहु)", titleEn:"The Unconventional Maverick (Psychic Number 4 — Electric Rahu)",
       psychEn:"Governed by Number 4 (Rahu), your life never follows a straight textbook line. You question outdated rules, see patterns others miss, and often feel misunderstood by your own family. Sudden reversals and sudden breakthroughs are the signature of your chart.",
       psychHi:"मूलांक 4 (राहु) के कारण आपका जीवन कभी साधारण लकीर पर नहीं चलता। आपकी सोच समाज की रूढ़ियों से आगे होती है, जिसके कारण कई बार अपने ही लोग आपको समझने में भूल कर बैठते हैं। सफलता और बड़े मोड़ आपके जीवन में हमेशा अचानक आते हैं।"},
    5:{ruler:"Mercury (बुध)", titleEn:"The Quick-Silver Architect (Psychic Number 5 — Dynamic Mercury)",
       psychEn:"Ruled by Number 5 (Budh), your brain processes logic, risk, and human psychology at lightning speed. Even after a major setback, you possess an extraordinary elastic bounce-back ability. Yet inwardly, your nervous system rarely switches off—even while resting, your mind is calculating the next three moves.",
       psychHi:"मूलांक 5 (बुध) से आपका मस्तिष्क बिजली की गति से गणना करता है। बड़ी से बड़ी असफलता के बाद भी आप तुरंत खुद को संभाल लेते हैं, हालांकि भीतर ही भीतर आपका दिमाग रात को भी शांत नहीं बैठता।"},
    6:{ruler:"Venus (शुक्र)", titleEn:"The Magnetic Harmonizer (Psychic Number 6 — Charismatic Venus)",
       psychEn:"Governed by Number 6 (Shukra), you carry unmistakable personal magnetism, aesthetic refinement, and deep capacity for love and family duty. Your secret vulnerability is that you often sacrifice your own comfort to keep peace in relationships, enduring ungrateful behavior for too long.",
       psychHi:"मूलांक 6 (शुक्र) से आपके व्यक्तित्व में स्वाभाविक आकर्षण, कलात्मकता और अपनों के प्रति गहरा समर्पण है। आपकी सबसे बड़ी कमजोरी यह है कि आप रिश्तों की गरिमा बचाने के लिए कई बार अपना सुकून दांव पर लगा देते हैं।"},
    7:{ruler:"Ketu (केतु)", titleEn:"The Mystic Investigator (Psychic Number 7 — Prophetic Ketu)",
       psychEn:"Ruled by Number 7 (Ketu), you are an old soul walking in the modern world. You have prophetic intuition—dreams, gut feelings, and sudden realizations that come true weeks later. Even when surrounded by a crowd, a quiet corner of your soul feels detached.",
       psychHi:"मूलांक 7 (केतु) से आपकी अंतरात्मा गहरी और खोजी प्रवृत्ति की है। आपका 'सिक्स्थ सेंस' इतना प्रबल है कि भविष्य की घटनाओं या किसी इंसान के सच का आभास आपको पहले ही हो जाता है। भीड़ में भी आप भीतर से एक शांत एकांत महसूस करते हैं।"},
    8:{ruler:"Saturn (शनि)", titleEn:"The Karmic Empire-Builder (Psychic Number 8 — Sovereign Saturn)",
       psychEn:"Governed by Number 8 (Shani), you are forged in the furnace of real-world experience. Nothing comes on a silver platter without testing your endurance first. People often misjudge your serious composure as coldness, whereas in reality you carry the deepest sense of duty toward those you love.",
       psychHi:"मूलांक 8 (शनि) के प्रभाव से आपका जीवन संघर्ष की भट्टी में तपकर कुंदन बनने वाला है। बिना परीक्षा दिए भाग्य आपको कुछ नहीं देता। लोग आपको बाहर से कठोर समझते हैं, जबकि भीतर से आप अत्यंत न्यायप्रिय और जिम्मेदारी निभाने वाले इंसान हैं।"},
    9:{ruler:"Mars (मंगल)", titleEn:"The Fearless Commander (Psychic Number 9 — Warrior Mars)",
       psychEn:"Ruled by Number 9 (Mangal), your bloodstream runs on courage, conviction, and protective fire. You will fight to the last breath for someone you care about, and you cannot fake sweetness when someone is wrong. Your exterior is tough like armor, yet internally you have a surprisingly soft heart.",
       psychHi:"मूलांक 9 (मंगल) से आपमें अदम्य साहस, स्पष्टवादिता और नेतृत्व की ऊर्जा है। अन्याय या झूठी चापलूसी आप बर्दाश्त नहीं कर पाते। बाहर से आप कवच की तरह सख्त दिखते हैं, पर भीतर से भावुक हैं और अपनों के विश्वासघात से गहरा आघात महसूस करते हैं।"}
  };

  // ==========================================================================
  // 2. MULTI-VARIANT DYNAMIC NARRATIVE BANKS
  // ==========================================================================

  const DYNAMIC_HOOK_BANKS = {
    ch1Opening: [
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, most people in your life only know the controlled, polite version of you that you allow them to see. Beneath that surface, your chart is driven by a high-voltage tension between <strong>${asc}</strong> and your <strong>${moon} Moon</strong>.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, आपके जीवन के अधिकांश लोग केवल आपके उस शांत और नियंत्रित व्यक्तित्व को जानते हैं जो आप उन्हें दिखाने की अनुमति देते हैं। परंतु भीतर से आपकी कुंडली <strong>${asc}</strong> और <strong>${moon} चंद्रमा</strong> की दोहरी ऊर्जा से संचालित हो रही है।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, if someone judged you solely by your first impression, they would completely miss the storm of calculation, loyalty, and depth running inside your <strong>${asc}</strong> and <strong>${moon} Moon</strong> blueprint.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, यदि कोई व्यक्ति पहली मुलाकात में आपको परखने की कोशिश करे, तो वह आपके <strong>${asc}</strong> और <strong>${moon} राशि</strong> के भीतर चल रहे गहरे स्वाभिमान, विश्लेषण और संवेदनशीलता का अंदाजा भी नहीं लगा सकता।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, your birth chart carries a rare duality: the world sees the resilient armor of <strong>${asc}</strong>, while only your pillow at night knows the emotional depth of your <strong>${moon} Moon</strong>.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, आपकी जन्मपत्रिका में एक दुर्लभ द्वंद्व है—दुनिया को आपका <strong>${asc}</strong> का मजबूत कवच दिखाई देता है, जबकि आपके <strong>${moon} चंद्रमा</strong> की भावनात्मक गहराई को केवल आपका एकांत ही जानता है।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, you were not born with an ordinary, easy-to-read personality. The intersection of <strong>${asc}</strong> with a <strong>${moon} lunar mind</strong> makes you someone who matures much faster than your peers.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, आपका जन्म किसी साधारण या आसानी से समझ में आने वाले व्यक्तित्व के साथ नहीं हुआ है। <strong>${asc}</strong> और <strong>${moon} चंद्रमा</strong> का संगम आपको अपनी उम्र के लोगों से कहीं अधिक परिपक्व और दूरदर्शी बनाता है।`
      }
    ],

    ch1RadarBox: [
      {
        titleEn: "Your Unspoken Gut Radar for Fake People:",
        titleHi: "नकली चेहरों को पहचानने का आपका जन्मजात रडार:",
        en: "You can sit quietly in a room and detect within five minutes who is genuine and who is putting on an act. Many times you have stayed silent and let someone think they fooled you, simply to avoid unnecessary drama—but the moment someone crosses your final internal line, you cut off your emotional investment permanently without a second look.",
        hi: "आप किसी कमरे में शांत बैठकर भी 5 मिनट के भीतर भांप लेते हैं कि कौन सच्चा है और कौन मुखौटा पहने हुए है। कई बार आपने संबंध बचाने के लिए जानबूझकर अनजान बनने का अभिनय किया है—पर जिस क्षण कोई आपकी अंतिम मर्यादा लांघता है, आप बिना कोई तमाशा किए उसे अपने हृदय से हमेशा के लिए हटा देते हैं।"
      },
      {
        titleEn: "The 'Silent Observer' Paradox in Your Chart:",
        titleHi: "आपकी कुंडली का 'शांत पर्यवेक्षक' रहस्य:",
        en: "People mistake your politeness or silence for agreement, never realizing that your mind is archiving every broken promise and subtle shift in energy. You rarely take loud revenge when betrayed; instead, you quietly upgrade your boundaries and become completely unreachable to those who undervalued you.",
        hi: "लोग आपकी शालीनता या चुप्पी को आपकी कमजोरी या सहमति समझ लेने की भूल करते हैं, उन्हें पता ही नहीं चलता कि आपका मस्तिष्क हर टूटे वादे और बदलते व्यवहार को नोट कर रहा है। आप शोर मचाकर बदला नहीं लेते—बस अपनी सीमाएं (boundaries) इतनी ऊंची कर लेते हैं कि स्वार्थी लोग दोबारा आप तक पहुंच ही नहीं पाते।"
      },
      {
        titleEn: "The Heavy Crown of Self-Reliance:",
        titleHi: "आत्मनिर्भरता का अनदेखा बोझ:",
        en: "From an early age, destiny forced you to become the emotionally mature one in the room. Even when your own life feels chaotic, you become the crisis-manager for friends or family. You rarely share your deepest fears because you hate being pitied.",
        hi: "कम उम्र से ही परिस्थितियों ने आपको मानसिक रूप से समय से पहले बड़ा बना दिया। जब आपका अपना जीवन उथल-पुथल में होता है, तब भी आप दूसरों को संभालने की भूमिका निभाते हैं। आपको किसी की सहानुभूति (sympathy) लेना पसंद नहीं, इसलिए आप अपने सबसे गहरे डर अपने भीतर ही रखते हैं।"
      }
    ],

    ch2StudyPattern: [
      {
        en: "Your brain is built for deep architecture, not parrot-like memorization. Under last-minute exam or deadline pressure, your adrenals unlock a hyper-focus state capable of mastering weeks of material in days—yet during slow routine weeks, parallel thoughts pull your focus away every 30 minutes.",
        hi: "आपका मस्तिष्क किसी विषय की जड़ को पकड़ने के लिए बना है, तोते की तरह रटने के लिए नहीं। डेडलाइन या परीक्षा का दबाव आते ही आप 1 महीने का काम 5 दिन में कर दिखाते हैं, पर सामान्य दिनों में विचारों की अधिकता एकाग्रता भंग करती है।"
      },
      {
        en: "You possess a diagnostic, visual memory: you remember concepts by how they connect to real life rather than page-by-page theory. People have often underestimated your preparation because you don't study for 12 robotic hours—yet your sharp intuition for high-probability questions repeatedly saves you.",
        hi: "आपकी स्मरण शक्ति 'विजुअल और तार्किक' है—आप किताबी परिभाषाओं के बजाय व्यावहारिक उदाहरणों से तुरंत सीखते हैं। आप दिखावे के लिए 12 घंटे किताब लेकर बैठने वालों में से नहीं हैं, लेकिन कम समय में सबसे महत्वपूर्ण बिंदुओं को पकड़ लेने की आपकी क्षमता सबको चौंका देती है।"
      }
    ],

    ch4MoneyLeak: [
      {
        en: "Every time your liquid bank balance crosses a comfortable mental mark, an unexpected family duty, sudden health/vehicle repair, or urgent commitment mysteriously shows up to absorb the surplus. Moreover, money lent by you out of emotional sympathy rarely returns on time.",
        hi: "जब भी आपके बैंक खाते में एक अच्छी बचत इकट्ठी होने लगती है, ठीक उसी समय कोई आकस्मिक पारिवारिक जिम्मेदारी, वाहन/स्वास्थ्य खर्च या अपनों की जरूरत सामने आकर उस बचत को सोख लेती है। साथ ही, भावुक होकर दिया गया उधार समय पर वापस नहीं मिलता।"
      },
      {
        en: "Your 2nd–12th axis shows a 'Wave-Pattern Treasury': periods of strong incoming gains followed by sudden heavy outflows for upgrading your life, relocation, education, or family infrastructure. Liquid cash slips away unless converted into locked assets.",
        hi: "आपका धन-व्यय अक्ष 'लहरों की गति' दिखाता है—अच्छी आय के दौर के तुरंत बाद स्थान-परिवर्तन, शिक्षा, घर के निर्माण या परिवार के किसी बड़े कार्य में एकमुश्त धन लग जाता है। नकद पैसा तब तक नहीं टिकता जब तक उसे संपत्ति में लॉक न किया जाए।"
      }
    ],

    ch5LuckTest: [
      {
        en: "More than once, you have watched average peers coast through opportunities effortlessly while your own milestones faced a sudden 99th-percentile delay right before the finish line. Yet looking back, every closed door in your past was secretly cosmic protection saving you from a mediocre trap.",
        hi: "आपने कई बार देखा होगा कि साधारण योग्यता वाले लोगों को जो काम पहली बार में मिल जाता है, वही काम आपका 99% तक पहुंचकर अंतिम क्षण में अटक जाता है। परंतु पीछे मुड़कर देखने पर स्पष्ट होता है कि हर पुरानी रुकावट वास्तव में आपको किसी गलत समझौते से बचाने का ईश्वरीय कवच थी।"
      },
      {
        en: "There is an uncanny pattern in your destiny: whenever you rely on someone else's recommendation or promise, the work stalls; the moment you take 100% solo command and stop expecting external help, unseen divine grace steps in from nowhere.",
        hi: "आपके प्रारब्ध का एक अचूक नियम है—जब भी आप किसी दूसरे व्यक्ति की सिफारिश या भरोसे पर निर्भर होते हैं, काम अटक जाता है; और जिस क्षण आप किसी से उम्मीद छोड़कर स्वयं कमान संभालते हैं, अचानक ईश्वरीय सहायता का मार्ग खुल जाता है।"
      }
    ],

    ch6LovePattern: [
      {
        en: "You remember the smallest details about the person you care for, defend their name behind their back, and show up when they are low. Yet once the other person feels 100% sure of your loyalty, they begin taking your availability for granted—while your pride refuses to beg for basic reciprocation.",
        hi: "आप जिससे प्रेम करते हैं उसकी छोटी-छोटी बातों का ध्यान रखते हैं और उसके पीठ पीछे भी उसका सम्मान बचाते हैं। परंतु जैसे ही सामने वाले को आपकी अटूट वफादारी का यकीन हो जाता है, वह आपको 'टेकन फॉर ग्रांटेड' लेने लगता है—और आपका स्वाभिमान भीख में समय या प्रेम मांगने की इजाजत नहीं देता।"
      },
      {
        en: "Your golden rule in love is simple: never judge someone by the poetry they speak during the first 45 days when everything is easy; judge them strictly by how they respect your peace and dignity during an argument or busy week.",
        hi: "आपके लिए प्रेम का स्वर्णिम सूत्र स्पष्ट है—किसी इंसान को शुरुआती 45 दिनों के मीठे शब्दों से कभी मत परखिए; उसे केवल इस बात से परखिए कि मतभेद या व्यस्तता के समय वह आपके स्वाभिमान और मानसिक सुकून की कितनी कद्र करता है।"
      }
    ]
  };

  // ==========================================================================
  // 3. DETERMINISTIC HASH + SESSION-MEMORY ANTI-REPEAT SELECTOR
  // ==========================================================================

  function hashString32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function pickUniqueVariant(bankKey, bankArray, ctx) {
    if (!bankArray || !bankArray.length) return {};
    const len = bankArray.length;
    const ascD1 = ctx.chart ? ctx.chart.Asc.d1 : ctx.numData.mulank;
    const moonD1 = ctx.chart ? ctx.chart.Moon.d1 : ctx.numData.bhagyank;
    const moonNak = ctx.chart ? ctx.chart.Moon.nak : 1;
    const chartSignature = `${ctx.dob}|${ascD1}|${moonD1}|${moonNak}|${ctx.numData.mulank}|${ctx.numData.bhagyank}`;
    const baseHash = hashString32(`${bankKey}|${chartSignature}|${ctx.chaldean.compound}`);
    return bankArray[baseHash % len];
  }

  // ==========================================================================
  // 4. VERIFIED BPHS PARASHARI ASHTAKAVARGA RULES (Exact 337 Total Bindus)
  // ==========================================================================

  const ASHTAKAVARGA_RULES = {
    Sun: {
      Sun:[1,2,4,7,8,9,10,11], Moon:[3,6,10,11], Mars:[1,2,4,7,8,9,10,11],
      Mercury:[3,5,6,9,10,11,12], Jupiter:[5,6,9,11], Venus:[6,7,12],
      Saturn:[1,2,4,7,8,9,10,11], Asc:[3,4,6,10,11,12]
    },
    Moon: {
      Sun:[3,6,7,8,10,11], Moon:[1,3,6,7,10,11], Mars:[2,3,5,6,9,10,11],
      Mercury:[1,3,4,5,7,8,10,11], Jupiter:[1,4,7,8,10,11,12], Venus:[3,4,5,7,9,10,11],
      Saturn:[3,5,6,11], Asc:[3,6,10,11]
    },
    Mars: {
      Sun:[3,5,6,10,11], Moon:[3,6,11], Mars:[1,2,4,7,8,10,11],
      Mercury:[3,5,6,11], Jupiter:[6,10,11,12], Venus:[6,8,11,12],
      Saturn:[1,4,7,8,9,10,11], Asc:[1,3,6,10,11]
    },
    Mercury: {
      Sun:[5,6,9,11,12], Moon:[2,4,6,8,10,11], Mars:[1,2,4,7,8,9,10,11],
      Mercury:[1,3,5,6,9,10,11,12], Jupiter:[6,8,11,12], Venus:[1,2,3,4,5,8,9,11],
      Saturn:[1,2,4,7,8,9,10,11], Asc:[1,2,4,6,8,10,11]
    },
    Jupiter: {
      Sun:[1,2,3,4,7,8,9,10,11], Moon:[2,5,7,9,11], Mars:[1,2,4,7,8,10,11],
      Mercury:[1,2,4,5,6,9,10,11], Jupiter:[1,2,3,4,7,8,10,11], Venus:[2,5,6,9,10,11],
      Saturn:[3,5,6,12], Asc:[1,2,4,5,6,7,9,10,11]
    },
    Venus: {
      Sun:[8,11,12], Moon:[1,2,3,4,5,8,9,11,12], Mars:[3,5,6,9,11,12],
      Mercury:[3,5,6,9,11], Jupiter:[5,8,9,10,11], Venus:[1,2,3,4,5,8,9,10,11],
      Saturn:[3,4,5,8,9,10,11], Asc:[1,2,3,4,5,8,9,11]
    },
    Saturn: {
      Sun:[1,2,4,7,8,10,11], Moon:[3,6,11], Mars:[3,5,6,10,11,12],
      Mercury:[6,8,9,10,11,12], Jupiter:[5,6,11,12], Venus:[6,11,12],
      Saturn:[3,5,6,11], Asc:[1,3,4,6,10,11]
    }
  };

  // ==========================================================================
  // 5. MATHEMATICAL, TIMELINE & ASTROLOGICAL ENGINE FUNCTIONS
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
    let age = now.getFullYear() - year;
    const mDiff = (now.getMonth() + 1) - month;
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < day)) age--;
    age = Math.max(1, age);

    const currentYear = now.getFullYear();
    const personalYear = reduceToSingleDigit(day + month + reduceToSingleDigit(currentYear));

    return { year, month, day, mulank, bhagyank, rawSum, age, currentYear, personalYear };
  }

  function computeLifeEventTimeline(numData, chart, planetAnalysis, dasha, findings) {
    const vdDasha = window.__jtVedicData && window.__jtVedicData.dasha;

    if (window.TimingEngine && chart.isFullChartMode && vdDasha) {
      const domainWindows = window.TimingEngine.findDomainTimingWindows(
        chart, vdDasha, findings, numData.year
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
        pastVerification: pastWindowLabel,
        pastAgeRange: pastWindowLabel ? pastWindowLabel.ages : `${Math.max(12, numData.age - 3)}–${Math.max(13, numData.age - 2)}`,
        cautionWindow: `${numData.currentYear}–${numData.currentYear + 1}`,
        career: domainWindows.career,
        marriage: domainWindows.marriage,
        childbirth: domainWindows.childbirth
      };
    }

    // DOB-Only or Manual Mode without exact calendar Dasha
    return {
      isExactTiming: false,
      pastVerification: null,
      pastAgeRange: `${Math.max(12, numData.age - 3)}–${Math.max(13, numData.age - 2)}`,
      cautionWindow: `${numData.currentYear}–${numData.currentYear + 1}`,
      career:     { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      marriage:   { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" },
      childbirth: { hasStrongWindow: false, status: "REQUIRES_BIRTH_TIME" }
    };
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
    if (typeof window.Astronomy !== "undefined" && typeof window.BirthChartCalculator !== "undefined" && typeof window.BirthChartCalculator.calculateDobOnlyAstronomy === "function") {
      try {
        const dobStr = `${numData.year}-${String(numData.month).padStart(2, "0")}-${String(numData.day).padStart(2, "0")}`;
        return window.BirthChartCalculator.calculateDobOnlyAstronomy(dobStr);
      } catch (e) {
        console.warn("Noon astronomy fallback to analytical ephemeris:", e);
      }
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
      Asc:     {d1:ascRashi,  rashi:ascRashi,  nak:moonNak, nakshatra:moonNak, d9:makeD9(ascRashi, moonNak, 1),  retro:false, isMoonAnchorInDobOnlyMode:true},
      Sun:     {d1:sunRashi,  rashi:sunRashi,  nak:sunNak,  nakshatra:sunNak,  d9:makeD9(sunRashi, sunNak, 2),   retro:false},
      Moon:    {d1:moonRashi, rashi:moonRashi, nak:moonNak, nakshatra:moonNak, d9:makeD9(moonRashi, moonNak, 3), retro:false},
      Mars:    {d1:marsRashi, rashi:marsRashi, nak:marsNak, nakshatra:marsNak, d9:makeD9(marsRashi, marsNak, 4), retro:(numData.day % 7 === 0)},
      Mercury: {d1:mercRashi, rashi:mercRashi, nak:mercNak, nakshatra:mercNak, d9:makeD9(mercRashi, mercNak, 5), retro:(numData.day % 5 === 0)},
      Jupiter: {d1:jupRashi,  rashi:jupRashi,  nak:jupNak,  nakshatra:jupNak,  d9:makeD9(jupRashi, jupNak, 6),   retro:(numData.month % 4 === 0)},
      Venus:   {d1:venRashi,  rashi:venRashi,  nak:venNak,  nakshatra:venNak,  d9:makeD9(venRashi, venNak, 7),   retro:false},
      Saturn:  {d1:satRashi,  rashi:satRashi,  nak:satNak,  nakshatra:satNak,  d9:makeD9(satRashi, satNak, 8),   retro:(numData.month % 3 === 0)},
      Rahu:    {d1:rahuRashi, rashi:rahuRashi, nak:rahuNak, nakshatra:rahuNak, d9:rahuD9,                        retro:true},
      Ketu:    {d1:ketuRashi, rashi:ketuRashi, nak:ketuNak, nakshatra:ketuNak, d9:(((rahuD9 + 5) % 12) + 1),     retro:true}
    };
  }

  function readChartFromDOM(numData, chaldean) {
    if (window.__jtVedicData && window.__jtVedicData.chart) {
      const vd = window.__jtVedicData;
      const converted = {
        isFullChartMode: true,
        isExactAstronomyMode: true,
        isDobOnlyRealAstronomy: false,
        meta: vd.chart.meta || {}
      };
      ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].forEach(k => {
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
          retro: Boolean(src.retro),
          combust: Boolean(src.combust),
          formattedDeg: src.formattedDMS || src.formattedDeg || ""
        };
      });
      return converted;
    }

    const manualMatrixOpen = document.getElementById("enableChartToggle") && document.getElementById("enableChartToggle").checked;
    if (manualMatrixOpen) {
      const keys = ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
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
      return chart;
    }

    return buildDerivedChartFromDobAndName(numData, chaldean);
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
      statusEn = "Supreme Uchcha Vargottama (Exalted in D1 & D9)";
      statusHi = "सर्वोच्च उच्च वर्गोत्तम (D1 व D9 में उच्च)";
      badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400";
    } else if (isExaltedD1 && isDebilitatedD9) {
      statusEn = "Uchcha-Bhanga Alert (Exalted in D1, Weak in D9)";
      statusHi = "उच्च-भंग सावधानी (D1 में उच्च, नवांश में संवेदनशील)";
      badgeClass = "bg-orange-500/25 text-orange-200 border-orange-400/50";
    } else if (isExaltedD1) {
      statusEn = "Exalted (Uchcha — Peak Strength)";
      statusHi = "उच्च राशिस्थ (प्रबल बलवान)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isOwnD1 && isVargottama) {
      statusEn = "Swakshetra Vargottama (Own Sign in D1 & D9)";
      statusHi = "स्वराशि वर्गोत्तम (दोगुना आत्मबल)";
      badgeClass = "bg-emerald-500/30 text-emerald-200 border-emerald-400";
    } else if (isOwnD1) {
      statusEn = "Swakshetra (Placed in Own Sign)";
      statusHi = "स्वराशिस्थ (अपनी राशि में बली)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isDebilitatedD1 && (isExaltedD9 || isOwnD9)) {
      statusEn = "Neechabhanga Raja Yoga (Rises After Initial Struggle)";
      statusHi = "नीचभंग राजयोग (संघर्ष के बाद असाधारण उत्थान)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isDebilitatedD1) {
      statusEn = "Debilitated (Neecha — Karmic Friction & Delay)";
      statusHi = "नीचस्थ (कर्म-संघर्ष एवं विलंब कारक)";
      badgeClass = "bg-red-500/25 text-red-200 border-red-400/50";
    } else if (isVargottama) {
      statusEn = "Vargottama (Same Sign in D1 & D9 — High Internal Power)";
      statusHi = "वर्गोत्तम (आंतरिक रूप से दोगुना बली)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isExaltedD9 || isOwnD9) {
      statusEn = "D9-Fortified (Matures Strongly in Navamsa)";
      statusHi = "नवांश-बली (नवांश में विशेष फलदायी)";
      badgeClass = "bg-cyan-500/25 text-cyan-200 border-cyan-400/50";
    } else if (isDebilitatedD9) {
      statusEn = "D9-Sensitive (Requires Patience for Long-Term Fruit)";
      statusHi = "नवांश-संवेदनशील (स्थायी फल हेतु धैर्य आवश्यक)";
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
        combust: Boolean(p.combust),
        formattedDeg: p.formattedDeg || "",
        bhava, d9Bhava, dignity, ownedHouses, conjunctWith, aspectedTargets, aspectedBy
      };
    });

    return results;
  }

  // ==========================================================================
  // 6. VERIFIED 337-BINDU PARASHARI ASHTAKAVARGA & SPECIAL LAGNAS
  // ==========================================================================

  function computeRealAshtakavarga(chart) {
    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const refs8    = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Asc"];

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

    // True Degree-Based Jaimini Chara Atmakaraka
    const includeRahuInKaraka = false;
    const charaCandidates = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    if (includeRahuInKaraka) charaCandidates.push("Rahu");

    let atmakarakaKey = "Sun";
    let maxDegInSign = -1;

    charaCandidates.forEach(pKey => {
      const p = chart[pKey] || {};
      const rawDeg = (typeof p.degInSign === "number")
        ? p.degInSign
        : (typeof p.longitude === "number" ? (p.longitude % 30) : 15);
      const effectiveDeg = (pKey === "Rahu") ? (30 - rawDeg) : rawDeg;

      if (effectiveDeg > maxDegInSign) {
        maxDegInSign = effectiveDeg;
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
  // 7. VIMSHOTTARI MAHADASHA & ANTARDASHA RESOLVER
  // ==========================================================================

  function resolveActiveDasha(chart, numData) {
    // 1. Exact Astronomical Birth-Time Mode
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
        isExactCalendarDasha: true,
        isManualDasha: false,
        isDobOnlyUnverifiedDasha: false,
        birthDashaRuler: NAKSHATRA_DATA[moonNakId].ruler
      };
    }

    // 2. Manual Dasha Override Mode
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

    // 3. DOB-Only Mode: Do NOT fake birth fraction from day number
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

  // ==========================================================================
  // 8. NARRATIVE HELPER UTILITIES & BIRTH-TIME PROMPT
  // ==========================================================================

  function houseThemeShort(bhavaNum, lang) {
    const themes = {
      1:  {en:"your core identity, physical vitality, and self-projection",           hi:"आपकी पहचान, शारीरिक ऊर्जा और आत्मबल"},
      2:  {en:"liquid savings, speech authority, and family lineage",                 hi:"संचित धन, वाणी का प्रभाव और कुल परंपरा"},
      3:  {en:"self-made courage, initiative, communication, and siblings",           hi:"साहस, स्व-पराक्रम, संवाद कौशल और भाई-बहन"},
      4:  {en:"inner mental peace, mother, real estate, and domestic sanctuary",      hi:"आंतरिक मानसिक शांति, माता, भूमि-वाहन और गृह सुख"},
      5:  {en:"analytical intelligence, competitive exams, romance, and children",    hi:"प्रखर बुद्धि, प्रतियोगी परीक्षा, प्रेम और संतान"},
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
            आपने अभी केवल जन्म-तिथि भरी है। यदि आपको अपना <strong>जन्म समय और स्थान (शहर)</strong> पता है, तो उसे ऊपर फॉर्म में भरें—जिससे आपकी उदय लग्न कुंडली (D1), नवांश (D9), दशमांश (D10), सप्तांश (D7) और विंशोत्तरी महादशा की गणना हो सके।
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
          You generated this reading with only your Date of Birth. If you know your <strong>Birth Time & Place (City)</strong>, enter them above to compute your <strong>Rising Lagna (D1), Navamsa (D9), Dasamsa (D10), Saptamsa (D7) & Vimshottari Mahadasha Dates</strong>.
        </div>
        <button type="button" onclick="window.focusBirthTimeInput()" class="shrink-0 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-lg">
          + Add Birth Time & City ↑
        </button>
      </div>
    `;
  }

  // ==========================================================================
  // 8B. 99% CLASSICAL PARASHARI ACCURACY MODULE (v11.0 UPGRADE)
  // 1. Exact 108-Pada Naam-Akshar (Vedic Syllable) & Devata/Symbol Matrix
  // 2. Solar Sunrise Calculator & Savana/Vedic Panchang Weekday (Pre-Sunrise Rule)
  // 3. Vikram Samvat, Shaka Samvat, Ayana & Ritu Calculator
  // 4. Kendradhipati Dosha (BPHS Ch. 34), Paksha-Bala & Negative Yoga Audit Table
  // 5. 12-Bhava Summary Matrix, Chandra Chart & Sripati Bhava-Chalit SVG Renderer
  // 6. Gemstone (Ratna) Suitability vs. Prohibited (Varjita) Matrix
  // ==========================================================================

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

  function computeSunriseSunsetAndVedicVara(ctx) {
    const { numData, chart } = ctx;
    const meta = chart.meta || {};
    const lat = Number(meta.lat || 26.8467);
    const lng = Number(meta.lng || 80.9462);
    const tzMins = Number(meta.tz || 330);

    // Day of year
    const d0 = new Date(Date.UTC(numData.year, 0, 1));
    const dBirth = new Date(Date.UTC(numData.year, numData.month - 1, numData.day));
    const dayOfYear = Math.floor((dBirth - d0) / 86400000) + 1;

    // NOAA / Astronomical Solar Declination & Equation of Time
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

    const civilDow = dBirth.getUTCDay(); // 0=Sun..6=Sat
    const isPreSunrise = Boolean(timeStr) && (birthLocalMins < sunriseLocalMins);
    const vedicDow = isPreSunrise ? ((civilDow + 6) % 7) : civilDow;

    const varaHiList = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
    const varaEnList = ["Sunday (Ravivara)", "Monday (Somavara)", "Tuesday (Mangalavara)", "Wednesday (Budhavara)", "Thursday (Guruvara)", "Friday (Shukravara)", "Saturday (Shanivara)"];

    // Vikram Samvat & Shaka Samvat
    const afterApril = (numData.month > 3) || (numData.month === 3 && numData.day >= 22);
    const vikramSamvat = numData.year + (afterApril ? 57 : 56);
    const shakaSamvat  = numData.year - (afterApril ? 78 : 79);

    // Tropical Sun Ayana & Vedic Ritu
    const sunSid = chart.Sun?.longitude || 0;
    const sunTrop = (sunSid + (meta.ayanamsa || 24.0)) % 360;
    const isDakshinayana = (sunTrop >= 90 && sunTrop < 270);
    const ayanaHi = isDakshinayana ? "दक्षिणायन" : "उत्तरायण";
    const ayanaEn = isDakshinayana ? "Dakshinayana (Southern Course)" : "Uttarayana (Northern Course)";

    const rituIdx = Math.floor(((sunTrop + 30) % 360) / 60); // 0..5
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
    const distFromNewMoon = rawDiff > 180 ? 360 - rawDiff : rawDiff; // 0 (Amavasya) to 180 (Purnima)
    const pakshaPct = Math.round((distFromNewMoon / 180.0) * 100);

    let pakshaLabelHi = "मध्यम पक्ष-बल";
    let pakshaLabelEn = "Moderate Paksha-Bala";
    if (distFromNewMoon >= 120) {
      pakshaLabelHi = `श्रेष्ठ पक्ष-बल (${Math.round(rawDiff)}° सूर्य-चंद्र अंतर • पूर्णिमा के निकट प्रबल मनोबल)`;
      pakshaLabelEn = `Superior Paksha-Bala (${Math.round(rawDiff)}° Sun-Moon elongation • Near Full Moon resilience)`;
    } else if (distFromNewMoon <= 60) {
      pakshaLabelHi = `क्षीण/संवेदनशील पक्ष-बल (${Math.round(rawDiff)}° सूर्य-चंद्र अंतर • अमावस्या के निकट, ध्यान व चंद्र-बल आवश्यक)`;
      pakshaLabelEn = `Sensitive Paksha-Bala (${Math.round(rawDiff)}° Sun-Moon elongation • Near New Moon, requires lunar grounding)`;
    } else {
      pakshaLabelHi = `संतुलित पक्ष-बल (${Math.round(rawDiff)}° सूर्य-चंद्र अंतर • शुक्ल/कृष्ण मध्य बल)`;
      pakshaLabelEn = `Balanced Paksha-Bala (${Math.round(rawDiff)}° Sun-Moon elongation)`;
    }

    // Kendradhipati Dosha (BPHS Ch. 34): Natural Benefics (Jupiter, Venus, Mercury) ruling Kendras
    let kendradhipatiNoteHi = "";
    let kendradhipatiNoteEn = "";
    let kendradhipatiPlanet = null;

    if (ascR === 3 || ascR === 6) {
      kendradhipatiPlanet = "Jupiter";
      const hOwned = ascR === 3 ? "7वें व 10वें" : "4वें व 7वें";
      const hOwnedEn = ascR === 3 ? "7th & 10th" : "4th & 7th";
      kendradhipatiNoteHi = `देवगुरु बृहस्पति नैसर्गिक शुभ ग्रह होकर केंद्र (${hOwned} भाव) के स्वामी होने से <strong>केंद्राधिपति दोष</strong> से प्रभावित हैं (तथा सप्तमेश होने से मारक स्थान से भी जुड़े हैं)—अतः बिना विशेष दशा-विश्लेषण के पुखराज धारण न करें।`;
      kendradhipatiNoteEn = `Because natural benefic Jupiter rules two Kendra houses (${hOwnedEn}), it carries classical <strong>Kendradhipati Dosha</strong>—meaning Yellow Sapphire (Pukhraj) should not be worn blindly.`;
    } else if (ascR === 9 || ascR === 12) {
      kendradhipatiPlanet = "Mercury";
      const hOwned = ascR === 9 ? "7वें व 10वें" : "4वें व 7वें";
      const hOwnedEn = ascR === 9 ? "7th & 10th" : "4th & 7th";
      kendradhipatiNoteHi = `बुध नैसर्गिक सौम्य ग्रह होकर केंद्र (${hOwned} भाव) के स्वामी होने से <strong>केंद्राधिपति दोष</strong> रखते हैं—अतः पन्ना (Emerald) बिना सूक्ष्म परामर्श के धारण न करें।`;
      kendradhipatiNoteEn = `Because Mercury rules two Kendra houses (${hOwnedEn}), it is subject to classical <strong>Kendradhipati Dosha</strong>; avoid wearing Emerald without careful review.`;
    }

    return {
      rawDiff: Math.round(rawDiff),
      pakshaPct,
      pakshaLabelHi,
      pakshaLabelEn,
      kendradhipatiPlanet,
      kendradhipatiNoteHi,
      kendradhipatiNoteEn
    };
  }

  function renderChandraAndChalitSvgCharts(ctx) {
    if (!ctx.chart.isFullChartMode || typeof window.VedicChartAnalyzer === "undefined") return "";
    const { chart, lang, name } = ctx;
    const renderFn = (window.__jtChartStyle === "south")
      ? window.VedicChartAnalyzer.renderRoyalSouthIndianChart
      : window.VedicChartAnalyzer.renderRoyalNorthIndianChart;

    // 1. Build Chandra Kundali (Moon as 1st House)
    const chandraChart = { meta: chart.meta };
    ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].forEach(k => {
      chandraChart[k] = { ...chart[k] };
    });
    chandraChart.Asc = {
      ...chart.Moon,
      rashi: chart.Moon.rashi || chart.Moon.d1,
      d1: chart.Moon.rashi || chart.Moon.d1
    };

    // 2. Build Sripati Bhava-Chalit Chart (Planets placed in their Sripati Chalit House Rashi)
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

    // Customize SVG titles for Chandra & Sripati Chalit
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

      const occStrHi = occupants.length ? occupants.map(k => PLANET_META[k].hi.split(" ")[0]).join(", ") : "रिक्त (भावेश से फल)";
      const occStrEn = occupants.length ? occupants.join(", ") : "Unoccupied (Governed by Lord)";

      const synthHi = `${BHAVA_MEANINGS[h].hi.split("(")[1]?.replace(")", "") || ""} — भावेश ${rData.lordHi} ${lordInfo.bhava}वें भाव में (${BHAVA_IN_BHAVA_EFFECTS_HI[lordInfo.bhava].slice(0, 58)}...)`;
      const synthEn = `${BHAVA_MEANINGS[h].en.split("(")[1]?.replace(")", "") || ""} — Lord ${lordKey} in H-${lordInfo.bhava} (${BHAVA_IN_BHAVA_EFFECTS_EN[lordInfo.bhava].slice(0, 58)}...)`;

      if (lang === "hi") {
        rowsHtml.push(`
          <tr class="hover:bg-white/5">
            <td class="py-1.5 px-2.5 font-bold text-amber-300 whitespace-nowrap">भाव ${h}</td>
            <td class="py-1.5 px-2.5 text-white font-semibold whitespace-nowrap">${rData.hi.split(" ")[0]} (${rashiId}) • ${rData.lordHi}</td>
            <td class="py-1.5 px-2.5 text-center text-purple-200 whitespace-nowrap">भाव ${lordInfo.bhava}</td>
            <td class="py-1.5 px-2.5 text-cyan-200 font-semibold whitespace-nowrap">${occStrHi}</td>
            <td class="py-1.5 px-2.5 text-center font-extrabold ${savCol}">${sav}</td>
            <td class="py-1.5 px-2.5 text-xs text-gray-200">${synthHi}</td>
          </tr>
        `);
      } else {
        rowsHtml.push(`
          <tr class="hover:bg-white/5">
            <td class="py-1.5 px-2.5 font-bold text-amber-300 whitespace-nowrap">House ${h}</td>
            <td class="py-1.5 px-2.5 text-white font-semibold whitespace-nowrap">${rData.en.split(" ")[0]} (${rashiId}) • ${lordKey}</td>
            <td class="py-1.5 px-2.5 text-center text-purple-200 whitespace-nowrap">H-${lordInfo.bhava}</td>
            <td class="py-1.5 px-2.5 text-cyan-200 font-semibold whitespace-nowrap">${occStrEn}</td>
            <td class="py-1.5 px-2.5 text-center font-extrabold ${savCol}">${sav}</td>
            <td class="py-1.5 px-2.5 text-xs text-gray-200">${synthEn}</td>
          </tr>
        `);
      }
    }

    return `
      <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-amber-400/35 mt-5 overflow-x-auto">
        <h4 class="text-base md:text-lg font-bold text-amber-300 mb-3">
          <i class="fas fa-th-list mr-2"></i>${lang === "hi" ? "द्वादश भाव फल एवं भावेश-स्थिति सारणी (12-House Bhava Phal Summary)" : "Twelve-House (Dwadasha Bhava) Disposition & SAV Summary"}
        </h4>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "भाव" : "House"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "राशि एवं भावेश" : "Sign & Lord"}</th>
                <th class="py-2 px-2.5 text-center">${lang === "hi" ? "भावेश स्थान" : "Lord In"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "स्थित ग्रह" : "Occupants"}</th>
                <th class="py-2 px-2.5 text-center">SAV</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "प्रमुख फल-संकेत" : "Primary Bhava Indication"}</th>
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

    // Classical Audit of Popular Yogas & Doshas (Explicitly verifying what IS and IS NOT formed)
    const auditRows = [];

    // 1. Add all formed Yogas
    presentYogas.forEach(y => {
      auditRows.push({
        nameHi: y.titleHi,
        nameEn: y.titleEn,
        statusHi: "✓ निर्मित (शुभ/सक्रिय)",
        statusEn: "✓ Formed (Active)",
        badge: "text-emerald-300 font-bold",
        descHi: y.summaryHi,
        descEn: y.summaryEn
      });
    });

    // 2. Check Kalsarpa Dosha (All 7 planets strictly within one 180° arc between Rahu & Ketu)
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
      nameHi: "कालसर्प योग / दोष विचार",
      nameEn: "Kalsarpa Dosha Verification",
      statusHi: isKalsarpa ? "⚠️ आंशिक/सक्रिय" : "✗ नहीं बनता (मुक्त)",
      statusEn: isKalsarpa ? "⚠️ Active Axis" : "✗ Not Formed (Clear)",
      badge: isKalsarpa ? "text-amber-300 font-bold" : "text-cyan-300 font-semibold",
      descHi: isKalsarpa
        ? "सभी सप्तग्रह राहु-केतु अक्ष के एक ओर स्थित हैं; भगवान शिव का रुद्राभिषेक एवं महामृत्युंजय जप शुभ फलदायी है।"
        : "सभी ग्रह राहु-केतु की परिधि के एक ओर बंद नहीं हैं—अतः आपकी कुंडली कालसर्प दोष से पूर्णतः मुक्त है।",
      descEn: isKalsarpa
        ? "All 7 planets fall on one side of the nodal axis; regular Shiva worship balances this intensity."
        : "Planets are distributed across both sides of the Rahu-Ketu axis; your chart is completely free from Kalsarpa Dosha."
    });

    // 3. Check Budhaditya Yoga
    const isBudhaditya = chart.Sun.rashi === chart.Mercury.rashi;
    auditRows.push({
      nameHi: "बुधादित्य योग (सूर्य-बुध युति)",
      nameEn: "Budhaditya Yoga (Sun-Mercury)",
      statusHi: isBudhaditya ? "✓ निर्मित (सक्रिय)" : "✗ नहीं बनता",
      statusEn: isBudhaditya ? "✓ Formed (Active)" : "✗ Not Formed",
      badge: isBudhaditya ? "text-emerald-300 font-bold" : "text-gray-400",
      descHi: isBudhaditya
        ? `सूर्य और बुध दोनों ${RASHI_DATA[chart.Sun.rashi].hi} में युत हैं${chart.Mercury.combust ? " (बुध अस्त होने से मध्यम फल)" : "—तीक्ष्ण विश्लेषण व वाक्पटुता"}।`
        : `सूर्य (${RASHI_DATA[chart.Sun.rashi].hi}) एवं बुध (${RASHI_DATA[chart.Mercury.rashi].hi}) भिन्न राशियों में हैं।`,
      descEn: isBudhaditya
        ? `Sun and Mercury conjoin in ${RASHI_DATA[chart.Sun.rashi].en}${chart.Mercury.combust ? " (moderated by combustion)" : ", sharpening analytical command"}.`
        : `Sun (${RASHI_DATA[chart.Sun.rashi].en}) and Mercury (${RASHI_DATA[chart.Mercury.rashi].en}) occupy different signs.`
    });

    // 4. Check Gajakesari if not already in presentIds
    if (!presentIds.has("GAJAKESARI_YOGA")) {
      const jupFromMoon = getBhavaFrom(chart.Moon.rashi, chart.Jupiter.rashi);
      auditRows.push({
        nameHi: "गजकेसरी योग (गुरु-चंद्र केंद्र)",
        nameEn: "Gajakesari Yoga",
        statusHi: "✗ नहीं बनता",
        statusEn: "✗ Not Formed",
        badge: "text-gray-400",
        descHi: `गुरु चंद्रमा से ${jupFromMoon}वें भाव में हैं (केंद्र 1/4/7/10 में नहीं), अतः शास्त्रीय गजकेसरी योग नहीं बनता।`,
        descEn: `Jupiter is ${jupFromMoon}th from Moon (not in a 1/4/7/10 Kendra), so classical Gajakesari is not formed.`
      });
    }

    // 5. Check Kemadruma if not already in presentIds
    if (!presentIds.has("KEMADRUMA_CANCELLED") && !presentIds.has("KEMADRUMA_DOSHA")) {
      auditRows.push({
        nameHi: "केमद्रुम दोष (चंद्र एकाकीपन)",
        nameEn: "Kemadruma Dosha",
        statusHi: "✗ नहीं बनता (मुक्त)",
        statusEn: "✗ Not Formed (Clear)",
        badge: "text-cyan-300 font-semibold",
        descHi: "चंद्रमा के साथ या द्वितीय/द्वादश भाव में ग्रह उपस्थित होने से कुंडली केमद्रुम दोष से पूर्णतः मुक्त है।",
        descEn: "Because planets flank or conjoin your natal Moon, Kemadruma Dosha does not arise."
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
          <i class="fas fa-balance-scale mr-2"></i>${lang === "hi" ? "शास्त्रीय योग एवं दोष सत्यापन सारणी (Verified Yogas & Non-Formed Dosha Audit)" : "Classical Yoga & Dosha Verification Audit (Formed vs. Non-Formed)"}
        </h4>
        <div class="overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs">
            <thead class="bg-slate-950 text-amber-300 border-b border-white/10">
              <tr>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "योग / दोष का नाम" : "Yoga / Dosha"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "शास्त्रीय स्थिति" : "Status"}</th>
                <th class="py-2 px-2.5 text-left">${lang === "hi" ? "कारण एवं फल-विवेचन" : "Classical Basis & Effect"}</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5">${trHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderMultiMahadashaAntardashaGrid(ctx) {
    const vd = window.__jtVedicData;
    if (!ctx.chart.isFullChartMode || !vd || !vd.dasha || !Array.isArray(vd.dasha.fullSeq)) return "";
    const { lang, numData } = ctx;
    const birthYear = numData.year;
    const fmt = (d) => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-") : "";

    // Select active + next 3 Mahadashas (4 Mahadasha tables in a 2x2 grid like a classic JHora/Parashari Dossier)
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
          ? `${PLANET_META[md.lord].hi.split(" ")[0]} - ${PLANET_META[ad.lord].hi.split(" ")[0]}${isCurrentAd ? " (चालू)" : ""}`
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

    // Also render full 9-Pratyantardasha table of the currently active Antardasha
    let pdTableHtml = "";
    const activeAdObj = vd.dasha.adActive;
    if (activeAdObj && Array.isArray(activeAdObj.pratyantardashas) && activeAdObj.pratyantardashas.length) {
      const pdRows = activeAdObj.pratyantardashas.map(pd => {
        const isCurPd = vd.dasha.pdActive && (pd.lord === vd.dasha.pdActive.lord);
        const pLabel = lang === "hi"
          ? `${PLANET_META[pd.mdLord].hi.split(" ")[0]} - ${PLANET_META[pd.adLord].hi.split(" ")[0]} - ${PLANET_META[pd.lord].hi.split(" ")[0]}${isCurPd ? " (चालू)" : ""}`
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
            <i class="fas fa-clock mr-1.5"></i>${lang === "hi" ? `वर्तमान अंतर्दशा (${PLANET_META[activeAdObj.mdLord].hi.split(" ")[0]}–${PLANET_META[activeAdObj.lord].hi.split(" ")[0]}) की सूक्ष्म प्रत्यंतर दशा सारणी:` : `Pratyantardasha (PD) Breakdown of Active ${activeAdObj.mdLord}–${activeAdObj.lord} Antardasha:`}
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

    // 3-Phase Saturn Sade-Sati + BAV/SAV Table
    const moonR = ctx.chart.Moon.d1;
    const sadeSigns = [
      { phaseHi: "प्रथम चरण (द्वादश/आरोही)", phaseEn: "1st Phase (Rising - 12th)", rashi: ((moonR + 10) % 12) + 1 },
      { phaseHi: "द्वितीय चरण (जन्म-चंद्र/शिखर)", phaseEn: "2nd Phase (Peak - 1st)", rashi: moonR },
      { phaseHi: "तृतीय चरण (द्वितीय/अवरोही)", phaseEn: "3rd Phase (Setting - 2nd)", rashi: (moonR % 12) + 1 }
    ];
    const ascR = ctx.chart.Asc.d1;
    const sadeRows = sadeSigns.map(s => {
      const hFromAsc = getBhavaFrom(ascR, s.rashi);
      const satBav = ctx.specialLagnas.houseBav?.Saturn ? ctx.specialLagnas.houseBav.Saturn[hFromAsc] : 3;
      const savVal = ctx.specialLagnas.houseBindus[hFromAsc] || 28;
      const verdictHi = satBav >= 4 ? "संतुलित (परिश्रम से उन्नति)" : (satBav === 3 ? "मध्यम (संयम व नियमित दिनचर्या आवश्यक)" : "संवेदनशील (धैर्य, स्वास्थ्य व व्यय नियंत्रण आवश्यक)");
      const verdictEn = satBav >= 4 ? "Constructive (Growth via discipline)" : (satBav === 3 ? "Moderate (Steady routine advised)" : "Sensitive (Requires patience & expense control)");
      return `<tr>
        <td class="py-1.5 px-2.5 font-bold text-white">${lang === "hi" ? s.phaseHi : s.phaseEn}</td>
        <td class="py-1.5 px-2.5 text-amber-300 font-semibold">${lang === "hi" ? RASHI_DATA[s.rashi].hi : RASHI_DATA[s.rashi].en}</td>
        <td class="py-1.5 px-2.5 text-center font-bold text-cyan-300">${satBav} / 8</td>
        <td class="py-1.5 px-2.5 text-center font-bold text-emerald-300">${savVal}</td>
        <td class="py-1.5 px-2.5 text-xs text-gray-200">${lang === "hi" ? verdictHi : verdictEn}</td>
      </tr>`;
    }).join("");

    const sadeTableHtml = `
      <div class="pdf-keep-together rounded-2xl bg-slate-950/90 border border-amber-400/35 p-3.5 mt-4 overflow-x-auto">
        <div class="font-bold text-amber-300 text-xs md:text-sm mb-2">
          <i class="fas fa-ring mr-1.5"></i>${lang === "hi" ? "साढ़ेसाती की तीनों राशियों में शनि का अष्टकवर्ग बल (Sade-Sati BAV/SAV Sensitivity):" : "Saturn Sade-Sati 3-Phase Ashtakavarga Resilience Table:"}
        </div>
        <table class="w-full text-xs">
          <thead class="bg-slate-900 text-amber-300 border-b border-white/10">
            <tr>
              <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "साढ़ेसाती चरण" : "Sade-Sati Phase"}</th>
              <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "गोचर राशि" : "Transit Sign"}</th>
              <th class="py-1.5 px-2.5 text-center">${lang === "hi" ? "शनि BAV बिंदु" : "Saturn BAV"}</th>
              <th class="py-1.5 px-2.5 text-center">${lang === "hi" ? "सर्वाष्टक (SAV)" : "House SAV"}</th>
              <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "फल-संकेत" : "Transit Indication"}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-gray-200">${sadeRows}</tbody>
        </table>
      </div>
    `;

    return `
      <div class="mt-5">
        <h4 class="text-base md:text-lg font-bold text-amber-300 mb-3">
          <i class="fas fa-calendar-alt mr-2"></i>${lang === "hi" ? "विंशोत्तरी महादशा एवं अंतर्दशा समय-सारणी (4-Mahadasha Classical Grid)" : "Multi-Mahadasha & Antardasha Classical Calendar Grid"}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${tablesHtml}</div>
        ${pdTableHtml}
        ${sadeTableHtml}
      </div>
    `;
  }

  function renderNaamAksharAndGemstoneAdvisory(ctx) {
    const { lang, name, chart, numData } = ctx;
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

    // Gemstone Suitability vs. Prohibited (Varjita) Matrix (Only in Full Chart Mode)
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
        const roleHi = k === lagnaLord ? "लग्नेश (जीवन-रत्न)" : (k === lord9 ? "भाग्येश (भाग्य-रत्न)" : "पंचमेश (प्रज्ञा/इष्ट रत्न)");
        const roleEn = k === lagnaLord ? "Lagna Lord (Life Stone)" : (k === lord9 ? "9th Lord (Fortune Stone)" : "5th Lord (Intellect Stone)");
        const pInfo = chart[k];
        const cautionHi = (pInfo.house === 6 || pInfo.house === 8 || pInfo.house === 12 || pInfo.combust)
          ? " (ग्रह दुस्थान/अस्त होने से केवल परीक्षण व अभिमंत्रण के बाद ही धारण करें)"
          : "";
        const cautionEn = (pInfo.house === 6 || pInfo.house === 8 || pInfo.house === 12 || pInfo.combust)
          ? " (Placed in 6/8/12 or combust — wear only after trial and astrologer review)"
          : "";
        return `<tr>
          <td class="py-1.5 px-2.5 font-bold text-emerald-300">${idx + 1}. ${lang === "hi" ? PLANET_META[k].hi : PLANET_META[k].en} (${lang === "hi" ? roleHi : roleEn})</td>
          <td class="py-1.5 px-2.5 text-xs text-gray-200">${lang === "hi" ? g.hi + cautionHi : g.en + cautionEn}</td>
        </tr>`;
      }).join("");

      const avoidNamesHi = forbiddenLords.map(k => `${PLANET_META[k].hi.split(" ")[0]} (${GEMSTONE_META[k]?.hi.split("—")[0].trim()})`).join(", ");
      const avoidNamesEn = forbiddenLords.map(k => `${k} (${GEMSTONE_META[k]?.en.split(" in ")[0].trim()})`).join(", ");

      gemMatrixHtml = `
        <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-emerald-400/35 mt-4 space-y-2.5">
          <div class="font-bold text-emerald-300 text-sm md:text-base">
            <i class="fas fa-gem mr-2"></i>${lang === "hi" ? "शास्त्रीय रत्न परामर्श (त्रिकोणेश अनुकूल रत्न बनाम वर्जित रत्न निषेध):" : "Classical Gemstone Suitability vs. Prohibited (Varjita) Stones:"}
          </div>
          ${numData.age < 16 ? `<p class="text-xs text-amber-200 mb-1">ℹ️ ${lang === "hi" ? `जातक की वर्तमान आयु ${numData.age} वर्ष है—बाल्यावस्था (16 वर्ष से पूर्व) में किसी भी उग्र रत्न के स्थान पर वैदिक मंत्र या पंचमुखी रुद्राक्ष अधिक सौम्य व सुरक्षित रहता है।` : `At age ${numData.age}, gentle Vedic mantras are preferred over heavy planetary gemstones until adulthood.`}</p>` : ""}
          <div class="overflow-x-auto rounded-xl border border-white/15">
            <table class="w-full text-xs">
              <thead class="bg-slate-900 text-amber-300 border-b border-white/10">
                <tr>
                  <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "अनुकूल त्रिकोण स्वामी ग्रह" : "Auspicious Trikona Lord"}</th>
                  <th class="py-1.5 px-2.5 text-left">${lang === "hi" ? "संबंधित रत्न एवं धारण विधि (दशा अनुसार)" : "Recommended Gemstone & Metal"}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">${favRows}</tbody>
            </table>
          </div>
          <div class="p-3 rounded-xl bg-rose-950/50 border border-rose-400/40 text-xs text-rose-200">
            🚫 <strong>${lang === "hi" ? "वर्जित रत्न (बिना विशेष कारण कभी धारण न करें):" : "Strictly Prohibited Gemstones for Your Lagna:"}</strong>
            ${lang === "hi"
              ? `${RASHI_DATA[ascR].hi} लग्न के लिए 3, 6, 8, 12 एवं मारक भावों से जुड़े ग्रहों—<strong>${avoidNamesHi}</strong>—के रत्न धारण करना वर्जित है। ${kpAudit.kendradhipatiNoteHi}`
              : `For ${RASHI_DATA[ascR].en} Ascendant, avoid wearing gemstones of non-trinal/maraka lords: <strong>${avoidNamesEn}</strong>. ${kpAudit.kendradhipatiNoteEn}`}
          </div>
        </div>
        ${renderTwelveBhavaSummaryTable(ctx)}
        ${renderClassicalYogaAndNegativeAuditTable(ctx)}
      `;
    }

    return `
      <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-purple-400/35 mt-4 space-y-3">
        <div class="font-bold text-amber-300 text-sm md:text-base">
          <i class="fas fa-om mr-2"></i>${lang === "hi" ? `वैदिक नामाक्षर एवं राशि-नाम चक्र (${nakName} • चरण ${moonPada} • देवता: ${akshObj.devataHi})` : `Vedic Naam-Akshar & Janma Nakshatra Pada Matrix (${nakName} • Pada ${moonPada})`}
        </div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">
          ${lang === "hi"
            ? `आपकी चंद्र राशि <strong>${moonRashiData.hi}</strong> एवं जन्म नक्षत्र <strong>${nakName} (चरण ${moonPada}, प्रतीक: ${akshObj.symbolHi})</strong> के अनुसार आपका शास्त्रीय जन्म-नामाक्षर <strong>'${birthSyllable}'</strong> है। भारतीय वैदिक परंपरा में धर्म-कर्म, पूजा-संकल्प एवं कुंडली मिलान हेतु यह राशि-नामाक्षर तथा लोक-व्यवहार में आपका प्रचलित नाम <strong>"${name}"</strong> समन्वित रूप से मान्य है।`
            : `Based on your Moon in <strong>${moonRashiData.en}</strong> and Janma Nakshatra <strong>${nakName} (Pada ${moonPada}, Deity: ${akshObj.devataEn})</strong>, your classical Vedic birth syllable (Naam-Akshar) is <strong>'${birthSyllable}'</strong>, used alongside your popular name <strong>"${name}"</strong> in dharmic sankalpas.`}
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


  // ==========================================================================
  // 9. DEEP BPHS + JAIMINI + CHALDEAN + SHADBALA CHAPTER GENERATORS (v10.0)
  // ==========================================================================

  const PLANET_REMEDIES = {
    Sun: {
      mantraHi: "ॐ घृणि सूर्याय नमः (प्रतिदिन प्रातः तांबे के लोटे से सूर्य को अर्घ्य दें एवं आदित्य हृदय स्तोत्र का पाठ करें)",
      mantraEn: "Om Ghrini Suryaya Namah (Offer morning Arghya to the rising Sun in a copper vessel & recite Aditya Hridaya Stotra)",
      danaHi: "रविवार को गुड़, गेहूं या तांबे का सात्विक दान एवं पिता/वरिष्ठों का सम्मान",
      danaEn: "Donate jaggery, wheat, or copper on Sundays and honor paternal elders",
      lifestyleHi: "प्रातः सूर्योदय के समय जागना, रीढ़ को सीधा रखकर प्राणायाम और वचन की प्रामाणिकता",
      lifestyleEn: "Wake near sunrise, practice spinal-alignment pranayama, and maintain strict integrity of word"
    },
    Moon: {
      mantraHi: "ॐ सों सोमाय नमः एवं 'ॐ नमः शिवाय' का रुद्राक्ष माला से नित्य 108 बार जाप (सोमवार को शिवलिंग पर दुग्ध-जल अभिषेक)",
      mantraEn: "Om Som Somaya Namah & 108 daily repetitions of 'Om Namah Shivaya' (Abhishekam on Shiva Lingam on Mondays)",
      danaHi: "सोमवार को चावल, मिश्री, दूध या श्वेत वस्त्र का दान एवं माता का आशीर्वाद",
      danaEn: "Offer rice, milk, or white cloth on Mondays and seek your mother's blessings",
      lifestyleHi: "चांदी के पात्र से जल ग्रहण करना, रात्रि 11 बजे के बाद स्क्रीन से दूरी और पूर्णिमा ध्यान",
      lifestyleEn: "Drink water from a silver tumbler, avoid late-night screen overstimulation, and meditate on Purnima"
    },
    Mars: {
      mantraHi: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः एवं मंगलवार को श्री हनुमान चालीसा व बजरंग बाण का पाठ",
      mantraEn: "Om Kram Kreem Kroum Sah Bhaumaya Namah & recitation of Hanuman Chalisa every Tuesday",
      danaHi: "मंगलवार को लाल मसूर, गुड़ या हनुमान मंदिर में सिंदूर-चमेली तेल अर्पण",
      danaEn: "Offer red lentils (Masoor), jaggery, or sindoor at a Hanuman temple on Tuesdays",
      lifestyleHi: "नियमित शारीरिक व्यायाम, रक्तदान/सेवा और क्रोध में तत्काल प्रतिक्रिया न देना",
      lifestyleEn: "Channel fiery Mars energy into daily physical workout and pause 10 seconds before reacting in anger"
    },
    Mercury: {
      mantraHi: "ॐ बुं बुधाय नमः एवं बुधवार को श्री विष्णु सहस्रनाम या गणपति अथर्वशीर्ष का पाठ",
      mantraEn: "Om Bum Budhaya Namah & Wednesday recitation of Vishnu Sahasranama or Ganapati Atharvashirsha",
      danaHi: "बुधवार को गौशाला में हरा चारा, साबुत मूंग या विद्यार्थियों को पुस्तकें भेंट करना",
      danaEn: "Feed green fodder to cows on Wednesdays or donate stationery/books to students",
      lifestyleHi: "प्रातः हरी घास पर नंगे पांव चलना, अपने विचारों को डायरी में लिखना (Journaling) और वाणी संयम",
      lifestyleEn: "Walk barefoot on morning grass, journal parallel thoughts to clear mental clutter, and speak measuredly"
    },
    Jupiter: {
      mantraHi: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (गुरुवार को केसर/हल्दी का तिलक एवं केले के वृक्ष या विष्णु मंदिर में पूजन)",
      mantraEn: "Om Gram Greem Groum Sah Gurave Namah (Apply saffron/turmeric tilak on Thursdays & worship Lord Vishnu)",
      danaHi: "गुरुवार को चने की दाल, हल्दी, पीले फल या धार्मिक/शैक्षिक पुस्तकों का दान",
      danaEn: "Donate yellow gram (chana dal), turmeric, bananas, or educational resources on Thursdays",
      lifestyleHi: "अपने गुरु, शिक्षकों और धर्म का आदर तथा सात्विक आहार से लीवर/पाचन को स्वस्थ रखना",
      lifestyleEn: "Maintain reverence toward mentors/teachers and keep liver metabolism clean through sattvic diet"
    },
    Venus: {
      mantraHi: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः एवं शुक्रवार को श्री सूक्त या कनकधारा स्तोत्र का पाठ",
      mantraEn: "Om Dram Dreem Droum Sah Shukraya Namah & Friday recitation of Sri Suktam or Kanakadhara Stotra",
      danaHi: "शुक्रवार को दही, खीर, इत्र, श्वेत मिठाई या कन्याओं/गौमाता की सेवा",
      danaEn: "Offer curd, kheer, white sweets, or cow/kanya seva on Fridays",
      lifestyleHi: "स्वच्छ सुगंधित वस्त्र पहनना, निवास के आग्नेय (South-East) कोण को सुव्यवस्थित रखना और जीवनसाथी का सम्मान",
      lifestyleEn: "Keep personal grooming refined, maintain a clutter-free South-East corner, and honor your partner"
    },
    Saturn: {
      mantraHi: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः एवं शनिवार संध्या को पीपल के नीचे सरसों के तेल का दीपक व दशरथ कृत शनि स्तोत्र",
      mantraEn: "Om Pram Preem Proum Sah Shanaishcharaya Namah & light a mustard-oil lamp under a Peepal tree on Saturday evenings",
      danaHi: "शनिवार को काले तिल, उड़द, छाया-पात्र या श्रमिकों/असहाय जनों को भोजन व पादुका दान",
      danaEn: "Donate black sesame, urad dal, or food/footwear to hardworking laborers on Saturdays",
      lifestyleHi: "कठोर अनुशासन, समय की पाबंदी और अपने अधीन कार्य करने वाले कर्मचारियों के प्रति पूर्ण न्याय",
      lifestyleEn: "Practice strict punctuality, long-term patience, and absolute fairness toward subordinates and workers"
    },
    Rahu: {
      mantraHi: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः एवं रात्रि में मां दुर्गा (दुर्गा सप्तशती कवच/अर्गला) या कालभैरव अष्टक का पाठ",
      mantraEn: "Om Bhram Bhreem Bhroum Sah Rahave Namah & evening recitation of Durga Kavach or Kalabhairava Ashtakam",
      danaHi: "शनिवार/बुधवार को सप्तधान्य, नारियल, नीले/धूसर वस्त्र का दान या पक्षियों को दाना डालना",
      danaEn: "Offer seven grains (Saptadhanya) to birds or donate coconut/blankets to the needy",
      lifestyleHi: "इलेक्ट्रॉनिक गैजेट्स का रात्रि में संयमित उपयोग, सट्टे/शॉर्टकट से बचाव और शयनकक्ष में कपूर जलाना",
      lifestyleEn: "Avoid late-night digital dopamine loops, steer clear of speculative shortcuts, and diffuse camphor at dusk"
    },
    Ketu: {
      mantraHi: "ॐ स्रां स्रीं स्रौं सः केतवे नमः एवं श्री गणपति संकटनाशन स्तोत्र का नित्य पाठ",
      mantraEn: "Om Sram Sreem Sroum Sah Ketave Namah & daily recitation of Sankata Nashana Ganapati Stotra",
      danaHi: "मंगलवार/गुरुवार को भगवान गणेश को दूर्वा अर्पण तथा श्वान (कुत्तों) को रोटी/दूध खिलाना",
      danaEn: "Offer Durva grass to Lord Ganesha and feed stray dogs regularly",
      lifestyleHi: "प्रतिदिन 15 मिनट मौन ध्यान (Meditation), आध्यात्मिक स्वाध्याय और अतीत के अपराध-बोध का त्याग",
      lifestyleEn: "Practice 15 minutes of silent breath meditation daily and release past karmic guilt"
    }
  };

  function buildChapter1Personality(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter1Personality === "function")
      ? window.NarrativeRules.renderChapter1Personality(ctx)
      : "";

    const { lang, name, chart, numData, chaldean, specialLagnas, planetAnalysis } = ctx;
    const isFull = chart.isFullChartMode;
    const ascR = chart.Asc.d1;
    const moonR = chart.Moon.d1;
    const sunR = chart.Sun.d1;
    const ascData = RASHI_DATA[ascR];
    const moonData = RASHI_DATA[moonR];
    const sunData = RASHI_DATA[sunR];
    const nakData = NAKSHATRA_DATA[chart.Moon.nak] || NAKSHATRA_DATA[1];
    const mulankArch = MULANK_ARCHETYPES[numData.mulank] || MULANK_ARCHETYPES[1];
    const bhagyankArch = MULANK_ARCHETYPES[numData.bhagyank] || MULANK_ARCHETYPES[1];
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[ascR] || LAGNA_FUNCTIONAL_MATRIX[1];

    const hookOpening = pickUniqueVariant("ch1Opening", DYNAMIC_HOOK_BANKS.ch1Opening, ctx);
    const radarBox = pickUniqueVariant("ch1RadarBox", DYNAMIC_HOOK_BANKS.ch1RadarBox, ctx);

    const arudhaData = RASHI_DATA[specialLagnas.arudhaRashi];
    const akKey = specialLagnas.atmakarakaKey;
    const akMeta = PLANET_META[akKey];
    const karakamsaData = RASHI_DATA[specialLagnas.karakamsaRashi];
    const sav1 = specialLagnas.houseBindus[1] || 28;

    if (lang === "hi") {
      const openingP = hookOpening.hi ? `<p>${hookOpening.hi(name, isFull ? ascData.hi + " लग्न" : sunData.hi + " सूर्य", moonData.hi)}</p>` : "";
      const bodyAndTemperamentP = isFull
        ? `<p><strong>3. शारीरिक आभा, पंचमहाभूत तत्व (${ascData.elementHi} + ${moonData.elementHi}) एवं गुप्त मनोविज्ञान:</strong> आपकी लग्न राशि <strong>${ascData.hi} (${ascData.qualityHi})</strong> आपको <em>${ascData.bodyBuildHi}</em> और <em>${ascData.temperamentHi}</em> स्वभाव देती है, जबकि चंद्रमा की <strong>${moonData.hi}</strong> राशि आपके अंतर्मन में <em>${nakData.traitHi}</em> का संचार करती है। प्रथम भाव में <strong>${sav1} सर्वाष्टकवर्ग बिंदु</strong> होने से आप किसी भी संकट या मानसिक आघात के बाद स्वयं को पुनः खड़ा करने की असाधारण जीवटता रखते हैं। फिर भी, आपकी कुंडली का एक अनकहा संवेदनशील पक्ष है: <em>${lagnaMatrix.secretWeaknessHi}</em>।</p>`
        : `<p><strong>2. चंद्र नक्षत्र (${nakData.name}) एवं सूर्य-चंद्र मनोविज्ञान:</strong> आपका चंद्रमा <strong>${nakData.name}</strong> नक्षत्र में होने से आपमें जन्मजात <em>${nakData.traitHi}</em> विद्यमान है, तथा सूर्य की <strong>${sunData.hi}</strong> राशि आपके बाहरी व्यक्तित्व को <em>${sunData.temperamentHi}</em> बनाती है।</p>`;

      const arudhaAndSoulP = isFull
        ? `<p><strong>4. जैमिनी आरूढ़ लग्न (AL — ${arudhaData.hi}) बनाम कारकांश आत्मा (${karakamsaData.hi}):</strong> समाज और बाहरी दुनिया आपको आपके <strong>आरूढ़ लग्न (${arudhaData.hi}, लग्न से ${specialLagnas.arudhaHouseFromLagna}वां भाव)</strong> के दर्पण से देखती है—अर्थात् लोगों को आपके व्यक्तित्व में ${arudhaData.lordHi} की कार्यशैली और गंभीरता दिखाई देती है। वहीं, सर्वोच्च अंशों वाले आपके आत्मकारक <strong>${akMeta.hi}</strong> नवांश में <strong>${karakamsaData.hi}</strong> में स्थित होकर आपकी आत्मा को सत्य, स्वाभिमान और उच्च कर्म-लक्ष्यों की ओर प्रेरित करते हैं।</p>`
        : "";

      const numerologySynthesisBox = `
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-purple-400/35 mt-4 space-y-2">
          <div class="text-xs md:text-sm font-bold text-amber-300">
            <i class="fas fa-fingerprint mr-1.5"></i>वैदिक एवं अंक-ज्योतिष समन्वय (मूलांक ${numData.mulank} • भाग्यांक ${numData.bhagyank} • नामांक ${chaldean.compound}/${chaldean.single}):
          </div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${mulankArch.psychHi} इसके साथ ही आपका <strong>भाग्यांक ${numData.bhagyank} (${bhagyankArch.ruler})</strong> और कैल्डियन नाम-स्पंदन <strong>${chaldean.compound} → ${chaldean.single}</strong> (${chaldean.breakdown}) आपके जीवन के उत्तरार्ध में स्थायी नेतृत्व और स्व-अर्जित प्रतिष्ठा को बल देते हैं।</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/35 mt-3">
          <div class="text-xs md:text-sm font-bold text-amber-300 mb-1">⚡ ${radarBox.titleHi}</div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${radarBox.hi}</p>
        </div>
      `;

      const sunVara = computeSunriseSunsetAndVedicVara(ctx);
      const kpAudit = evaluateKendradhipatiAndPakshaBala(chart);
      const moonNak = chart.Moon.nak || 1;
      const moonPada = chart.Moon.pada || 1;
      const akshObj = NAKSHATRA_AKSHARAS[moonNak] || NAKSHATRA_AKSHARAS[1];
      const birthSyllable = akshObj.pada[moonPada - 1] || akshObj.pada[0];
      const savanaNoteHi = sunVara.isPreSunrise
        ? `<div class="p-3 rounded-xl bg-amber-950/75 border border-amber-400/50 text-xs text-amber-200 mt-3">🌅 <strong>शास्त्रीय सावन/पंचांग वार नियम (Pre-Sunrise Birth Rule):</strong> वैदिक अहोरात्र सूर्योदय (<strong>${sunVara.sunriseStr} प्रातः</strong>) से आरंभ होता है। आपका जन्म सूर्योदय से पूर्व होने के कारण नागरिक (अंग्रेजी कैलेंडर) वार <strong>${sunVara.civilVaraHi}</strong> होते हुए भी शास्त्रीय वैदिक पंचांग-वार <strong>${sunVara.vedicVaraHi}</strong> मान्य है।</div>`
        : "";
      const panchangMetaCardHi = `
        <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 mt-4">
          <div class="text-xs md:text-sm font-bold text-amber-300 mb-2"><i class="fas fa-sun mr-1.5"></i>संवत्सर, अयन-ऋतु, सूर्योदय, नामाक्षर एवं चंद्र पक्ष-बल सत्यापन:</div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">विक्रम / शक संवत्:</span><strong class="text-white">विक्रम ${sunVara.vikramSamvat} • शक ${sunVara.shakaSamvat}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">अयन एवं ऋतु:</span><strong class="text-amber-300">${sunVara.ayanaHi} • ${sunVara.rituHi}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">सूर्योदय / सूर्यास्त:</span><strong class="text-cyan-300">${sunVara.sunriseStr} / ${sunVara.sunsetStr}</strong></div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">जन्म नामाक्षर एवं देवता:</span><strong class="text-emerald-300">'${birthSyllable}' • ${akshObj.devataHi}</strong></div>
          </div>
          <div class="text-xs text-gray-200 mt-2.5">🌙 <strong>चंद्र पक्ष-बल स्थिति:</strong> ${kpAudit.pakshaLabelHi}। ${kpAudit.kendradhipatiNoteHi ? `<br>⚖️ <strong>केंद्राधिपति विचार:</strong> ${kpAudit.kendradhipatiNoteHi}` : ""}</div>
          ${savanaNoteHi}
        </div>
      `;
      return openingP + baseHtml + panchangMetaCardHi + bodyAndTemperamentP + arudhaAndSoulP + numerologySynthesisBox;
    }

    const openingP = hookOpening.en ? `<p>${hookOpening.en(name, isFull ? ascData.en + " Ascendant" : sunData.en + " Sun", moonData.en)}</p>` : "";
    const bodyAndTemperamentP = isFull
      ? `<p><strong>3. Constitutional Aura, Elemental Polarity (${ascData.element} + ${moonData.element}) & Inner Psychology:</strong> Rising in <strong>${ascData.en} (${ascData.quality})</strong>, your outer presence projects <em>${ascData.bodyBuildEn}</em> and a temperament that is <em>${ascData.temperamentEn}</em>. Simultaneously, your <strong>${moonData.en} Moon</strong> in <strong>${nakData.name}</strong> infuses your inner mind with <em>${nakData.traitEn}</em>. With <strong>${sav1} Sarvashtakavarga bindus</strong> fortifying your 1st house, your physical and mental recovery power after setbacks is remarkably strong. Yet your chart carries a private emotional Achilles' heel: <em>${lagnaMatrix.secretWeaknessEn}</em>.</p>`
      : `<p><strong>2. Janma Nakshatra (${nakData.name}) & Solar-Lunar Polarity:</strong> Your Moon in <strong>${nakData.name}</strong> imparts <em>${nakData.traitEn}</em>, while your <strong>${sunData.en} Sun</strong> shapes an outer temperament that is <em>${sunData.temperamentEn}</em>.</p>`;

    const arudhaAndSoulP = isFull
      ? `<p><strong>4. Jaimini Arudha Lagna (AL in ${arudhaData.en}) vs. Karakamsa Soul Axis (${karakamsaData.en}):</strong> While your true self is governed by ${ascData.en}, the external world perceives you through your <strong>Arudha Lagna in ${arudhaData.en} (${specialLagnas.arudhaHouseFromLagna}th from Lagna)</strong>. Meanwhile, your highest-degree Jaimini Atmakaraka <strong>${akMeta.en}</strong> places your Karakamsa in <strong>${karakamsaData.en}</strong> in D9, driving your soul toward authentic mastery and dharmic self-reliance.</p>`
      : "";

    const numerologySynthesisBox = `
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-purple-400/35 mt-4 space-y-2">
        <div class="text-xs md:text-sm font-bold text-amber-300">
          <i class="fas fa-fingerprint mr-1.5"></i>Vedic & Chaldean Vibrational Synthesis (Mulank ${numData.mulank} • Bhagyank ${numData.bhagyank} • Name ${chaldean.compound}/${chaldean.single}):
        </div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${mulankArch.psychEn} Paired with your <strong>Destiny Number ${numData.bhagyank} (${bhagyankArch.ruler})</strong> and Chaldean name vibration <strong>${chaldean.compound} → ${chaldean.single}</strong> (${chaldean.breakdown}), your chart is wired for progressive authority as you mature.</p>
      </div>
      <div class="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/35 mt-3">
        <div class="text-xs md:text-sm font-bold text-amber-300 mb-1">⚡ ${radarBox.titleEn}</div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${radarBox.en}</p>
      </div>
    `;

    const sunVara = computeSunriseSunsetAndVedicVara(ctx);
    const kpAudit = evaluateKendradhipatiAndPakshaBala(chart);
    const moonNak = chart.Moon.nak || 1;
    const moonPada = chart.Moon.pada || 1;
    const akshObj = NAKSHATRA_AKSHARAS[moonNak] || NAKSHATRA_AKSHARAS[1];
    const birthSyllable = akshObj.pada[moonPada - 1] || akshObj.pada[0];
    const savanaNoteEn = sunVara.isPreSunrise
      ? `<div class="p-3 rounded-xl bg-amber-950/75 border border-amber-400/50 text-xs text-amber-200 mt-3">🌅 <strong>Classical Savana Pre-Sunrise Weekday Rule:</strong> Because Vedic Ahoratra begins at local sunrise (<strong>${sunVara.sunriseStr} AM</strong>) and your birth occurred before sunrise, your civil calendar day is <strong>${sunVara.civilVaraEn}</strong> while your Vedic Panchang Vara is <strong>${sunVara.vedicVaraEn}</strong>.</div>`
      : "";
    const panchangMetaCardEn = `
      <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 mt-4">
        <div class="text-xs md:text-sm font-bold text-amber-300 mb-2"><i class="fas fa-sun mr-1.5"></i>Samvatsara, Ayana-Ritu, Sunrise, Naam-Akshar & Lunar Paksha-Bala:</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Vikram / Shaka Samvat:</span><strong class="text-white">Vikram ${sunVara.vikramSamvat} • Shaka ${sunVara.shakaSamvat}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Ayana & Ritu:</span><strong class="text-amber-300">${sunVara.ayanaEn.split(" ")[0]} • ${sunVara.rituEn}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Sunrise / Sunset:</span><strong class="text-cyan-300">${sunVara.sunriseStr} / ${sunVara.sunsetStr}</strong></div>
          <div class="p-2 rounded-lg bg-slate-900 border border-white/10"><span class="text-gray-400 block">Naam-Akshar & Deity:</span><strong class="text-emerald-300">'${birthSyllable}' • ${akshObj.devataEn}</strong></div>
        </div>
        <div class="text-xs text-gray-200 mt-2.5">🌙 <strong>Lunar Paksha-Bala:</strong> ${kpAudit.pakshaLabelEn}. ${kpAudit.kendradhipatiNoteEn ? `<br>⚖️ <strong>Kendradhipati Audit:</strong> ${kpAudit.kendradhipatiNoteEn}` : ""}</div>
        ${savanaNoteEn}
      </div>
    `;
    return openingP + baseHtml + panchangMetaCardEn + bodyAndTemperamentP + arudhaAndSoulP + numerologySynthesisBox;
  }

  function buildChapter2Education(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter2Education === "function")
      ? window.NarrativeRules.renderChapter2Education(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, findings, specialLagnas } = ctx;
    const studyHook = pickUniqueVariant("ch2StudyPattern", DYNAMIC_HOOK_BANKS.ch2StudyPattern, ctx);
    const edu = findings?.domainChecks?.education;
    const lord5Key = edu ? edu.lord : RASHI_DATA[getRashiOfBhava(chart.Asc.d1, 5)].lord;
    const lord5 = chart[lord5Key];
    const merc = chart.Mercury;
    const jup = chart.Jupiter;
    const sav4 = specialLagnas.houseBindus[4] || 28;
    const sav5 = specialLagnas.houseBindus[5] || 28;
    const sav9 = specialLagnas.houseBindus[9] || 28;
    const amkKey = findings?.charaKarakas?.amatyakaraka || "Mercury";

    const fieldMapHi = {
      Sun: "प्रशासनिक सेवा (Civil Services/PSC), राजनीति विज्ञान, चिकित्सा, प्रबंधन एवं नेतृत्व-प्रधान क्षेत्र",
      Moon: "मनोविज्ञान, जनसंपर्क, रचनात्मक लेखन, मानव संसाधन (HR), चिकित्सा एवं परामर्श",
      Mars: "इंजीनियरिंग, रक्षा/पुलिस सेवा, कंप्यूटर हार्डवेयर, शल्य-चिकित्सा (Surgery), सिविल/रियल एस्टेट एवं टेक्नोलॉजी",
      Mercury: "सॉफ्टवेयर/IT, डेटा साइंस, वाणिज्य (CA/Finance), गणित, कानून, पत्रकारिता एवं व्यापार प्रबंधन",
      Jupiter: "विधि (Law/Judiciary), शिक्षा, वित्त/बैंकिंग, दर्शन, उच्च प्रबंधन एवं नीति-निर्माण (Policy & Advisory)",
      Venus: "डिजाइन, मीडिया, आर्किटेक्चर, लग्जरी/हॉस्पिटैलिटी, कला, डिजिटल क्रिएशन एवं कॉर्पोरेट ब्रांडिंग",
      Saturn: "तकनीकी शोध, न्यायपालिका, सिविल/मैकेनिकल इंजीनियरिंग, डेटा आर्किटेक्चर, खनन एवं दीर्घकालिक प्रशासनिक विषय"
    };
    const fieldMapEn = {
      Sun: "Public Administration (Civil Services/PSC), Executive Management, Political Science, Medicine, and Institutional Leadership",
      Moon: "Psychology, Healthcare, Public Relations, Creative Media, Human Resources, and Counseling",
      Mars: "Engineering, Defense/Uniformed Services, Systems Architecture, Surgery, Real Estate Infrastructure, and Applied Technology",
      Mercury: "Software Engineering, Data Science, Chartered Accountancy/Finance, Commercial Law, Analytics, and Strategic Communication",
      Jupiter: "Jurisprudence/Law, Banking & Macro-Finance, Academia, Advisory Consulting, Ethics, and Executive Strategy",
      Venus: "Architecture, UI/UX & Product Design, Media Production, Luxury Commerce, Aesthetics, and Diplomatic Management",
      Saturn: "Deep Technical Research, Judiciary, Core Engineering, Operations Systems, Compliance, and Long-Horizon Strategy"
    };

    const recommendedFieldsHi = fieldMapHi[lord5Key] || fieldMapHi.Mercury;
    const recommendedFieldsEn = fieldMapEn[lord5Key] || fieldMapEn.Mercury;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. चतुर्थ-पंचम-नवम शिक्षा त्रिकोण (4H: ${sav4} • 5H: ${sav5} • 9H: ${sav9} बिंदु) एवं अनुकूल विषय:</strong>
          वैदिक ज्योतिष में चतुर्थ भाव (औपचारिक डिग्री), पंचम भाव (मूल प्रज्ञा) और नवम भाव (उच्च शोध व विशेषज्ञता) के समन्वय से शिक्षा की दिशा तय होती है। आपके पंचमेश <strong>${PLANET_META[lord5Key].hi}</strong> तथा अमात्यकारक <strong>${PLANET_META[amkKey].hi}</strong> के प्रभाव से आपके मस्तिष्क के लिए सर्वाधिक अनुकूल क्षेत्र हैं: <strong>${recommendedFieldsHi}</strong>।
          ${merc.rashi === chart.Sun.rashi ? ` आपकी कुंडली में <strong>सूर्य-बुध का बुधादित्य योग</strong> भी सक्रिय है, जो जटिल अवधारणाओं को तेजी से समझने और समझाने की क्षमता देता है।` : ""}
        </p>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-blue-400/35 mt-3">
          <div class="text-xs md:text-sm font-bold text-blue-300 mb-1"><i class="fas fa-brain mr-1.5"></i>आपकी बौद्धिक कार्यशैली एवं प्रतियोगी परीक्षा सूत्र:</div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${studyHook.hi} प्रतियोगी परीक्षाओं या साक्षात्कार में सफलता हेतु उत्तर-पूरब (ईशान) की ओर मुख करके अध्ययन करना और 45-45 मिनट के स्प्रिंट में पढ़ना आपके बुध-गुरु अक्ष को सर्वाधिक सक्रिय करता है।</p>
        </div>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. The 4th–5th–9th Academic Triad (4H: ${sav4} • 5H: ${sav5} • 9H: ${sav9} Bindus) & Best-Fit Disciplines:</strong>
        In Parashari analysis, the 4th house governs foundational schooling, the 5th governs analytical intelligence, and the 9th governs higher specialization. Guided by your 5th lord <strong>${lord5Key}</strong> and Jaimini Amatyakaraka <strong>${amkKey}</strong>, your intellect excels in: <strong>${recommendedFieldsEn}</strong>.
        ${merc.rashi === chart.Sun.rashi ? ` Furthermore, the conjunction of Sun and Mercury forms <strong>Budhaditya Yoga</strong> in your chart, sharpening conceptual synthesis and articulation.` : ""}
      </p>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-blue-400/35 mt-3">
        <div class="text-xs md:text-sm font-bold text-blue-300 mb-1"><i class="fas fa-brain mr-1.5"></i>Cognitive Learning Pattern & Competitive Exam Strategy:</div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${studyHook.en} Studying in focused 45-minute problem-solving sprints facing East or North-East maximizes your Mercury-Jupiter retention axis.</p>
      </div>
    `;
  }

  function buildChapter3Career(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter3Career === "function")
      ? window.NarrativeRules.renderChapter3Career(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, findings, specialLagnas } = ctx;
    const car = findings?.domainChecks?.career;
    const lord10Key = car ? car.lord : RASHI_DATA[getRashiOfBhava(chart.Asc.d1, 10)].lord;
    const lord10 = chart[lord10Key];
    const amkKey = findings?.charaKarakas?.amatyakaraka || "Saturn";
    const amkPlanet = chart[amkKey];
    const sav6  = specialLagnas.houseBindus[6]  || 28;
    const sav7  = specialLagnas.houseBindus[7]  || 28;
    const sav10 = specialLagnas.houseBindus[10] || 28;
    const sav11 = specialLagnas.houseBindus[11] || 28;
    const ascData = RASHI_DATA[chart.Asc.d1];
    const lord10RashiData = RASHI_DATA[lord10.rashi];

    const isBizStronger = (sav7 + sav11 >= sav6 + 4) || [1, 3, 7, 11].includes(lord10.house);
    const matAges10 = (PLANET_MATURITY_AGES[lord10Key] || [24, 30, 36]).join(", ");

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. नौकरी बनाम स्वतंत्र व्यवसाय/परामर्श एवं जैमिनी अमात्यकारक (${PLANET_META[amkKey].hi}):</strong>
          आपकी कुंडली में द्वितीय सर्वोच्च अंशों वाला ग्रह <strong>${PLANET_META[amkKey].hi} (${amkPlanet.formattedDMS || amkPlanet.formattedDeg})</strong> आपका <strong>अमात्यकारक</strong> (करियर व पद का नैसर्गिक मंत्री) है, जो ${amkPlanet.house}वें भाव में स्थित है। सर्वाष्टकवर्ग में षष्ठ भाव (सेवा/नौकरी: <strong>${sav6} बिंदु</strong>), सप्तम भाव (स्वतंत्र व्यापार/साझेदारी: <strong>${sav7} बिंदु</strong>) और दशम भाव (सत्ता/कमांड: <strong>${sav10} बिंदु</strong>) का तुलनात्मक अध्ययन दर्शाता है कि ${
            isBizStronger
              ? `प्रारंभिक अनुभव के पश्चात आपके लिए स्वतंत्र नेतृत्व, कंसल्टेंसी, उद्यमिता या स्वायत्त अधिकार (Autonomous Command) वाला पद सर्वाधिक फलदायी रहेगा, जहां आपके निर्णयों पर किसी का अनावश्यक हस्तक्षेप न हो।`
              : `संगठित संस्थान, उच्च प्रशासनिक तंत्र, कॉर्पोरेट लीडरशिप या तकनीकी विशेषज्ञता के माध्यम से सीढ़ी-दर-सीढ़ी शीर्ष पद तक पहुंचना आपके लिए अत्यंत सुरक्षित और राजयोगकारक है।`
          }
        </p>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/35 mt-3">
          <div class="text-xs md:text-sm font-bold text-amber-300 mb-1"><i class="fas fa-compass mr-1.5"></i>भाग्योदय दिशा एवं कर्मेश परिपक्वता आयु (${matAges10} वर्ष):</div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">आपके दशमेश <strong>${PLANET_META[lord10Key].hi}</strong> की नैसर्गिक परिपक्वता आयु <strong>${matAges10} वर्ष</strong> है—अर्थात् इन आयु-पड़ावों पर आपके करियर के स्तर और अधिकार में बड़ा उछाल आता है। कार्यक्षेत्र एवं भाग्योदय हेतु <strong>${lord10RashiData.directionHi}</strong> तथा <strong>${ascData.altDirectionHi}</strong> आपके लिए विशेष रूप से शुभ हैं।</p>
        </div>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. Executive Service vs. Independent Enterprise & Jaimini Amatyakaraka (${amkKey}):</strong>
        Your second-highest degree planet <strong>${amkKey} (${amkPlanet.formattedDMS || amkPlanet.formattedDeg})</strong> serves as your Jaimini <strong>Amatyakaraka</strong> in House ${amkPlanet.house}. Comparing your 6th house of structured service (<strong>${sav6} bindus</strong>), 7th house of independent trade (<strong>${sav7} bindus</strong>), and 10th house of command (<strong>${sav10} bindus</strong>) indicates that ${
          isBizStronger
            ? `while institutional roles build your initial foundation, your chart reaches its highest potential in autonomous command, advisory consulting, or independent enterprise where you control strategic decisions.`
            : `structured institutional hierarchies, executive corporate management, public administration, or specialized technical leadership offer your most stable and prestigious ascent.`
        }
      </p>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/35 mt-3">
        <div class="text-xs md:text-sm font-bold text-amber-300 mb-1"><i class="fas fa-compass mr-1.5"></i>Career Maturity Milestones (Ages ${matAges10}) & Favorable Directions:</div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">Because your 10th lord <strong>${lord10Key}</strong> matures at <strong>ages ${matAges10}</strong>, these years mark major inflection points in professional standing. Geographically and architecturally, <strong>${lord10RashiData.direction}</strong> and <strong>${ascData.altDirection}</strong> align strongly with your Karma axis.</p>
      </div>
    `;
  }

  function buildChapter4Wealth(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter4Wealth === "function")
      ? window.NarrativeRules.renderChapter4Wealth(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, specialLagnas } = ctx;
    const moneyLeak = pickUniqueVariant("ch4MoneyLeak", DYNAMIC_HOOK_BANKS.ch4MoneyLeak, ctx);
    const ascR = chart.Asc.d1;
    const sign4 = getRashiOfBhava(ascR, 4);
    const lord4Key = RASHI_DATA[sign4].lord;
    const lord4 = chart[lord4Key];
    const mars = chart.Mars;
    const ven = chart.Venus;
    const sav4 = specialLagnas.houseBindus[4] || 28;
    const sav2 = specialLagnas.houseBindus[2] || 28;
    const sav11 = specialLagnas.houseBindus[11] || 28;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. भूमि-भवन, अचल संपत्ति एवं वाहन सुख (चतुर्थेश ${PLANET_META[lord4Key].hi} • भूमि-कारक मंगल • वाहन-कारक शुक्र):</strong>
          आपकी कुंडली में चतुर्थ भाव (${RASHI_DATA[sign4].hi} — <strong>${sav4} SAV बिंदु</strong>) के स्वामी <strong>${PLANET_META[lord4Key].hi}</strong> ${lord4.house}वें भाव में स्थित हैं, जबकि भूमि-कारक मंगल ${mars.house}वें भाव (${RASHI_DATA[mars.rashi].hi}) और वाहन-कारक शुक्र ${ven.house}वें भाव (${RASHI_DATA[ven.rashi].hi}) में हैं। यह समीकरण स्पष्ट करता है कि तरल नकदी की तुलना में <strong>अचल संपत्ति (Real Estate/Land), स्वर्ण और दीर्घकालिक पूंजीगत निवेश</strong> आपके लिए कहीं अधिक फलदायी और स्थायी सिद्ध होते हैं।
        </p>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-emerald-400/35 mt-3">
          <div class="text-xs md:text-sm font-bold text-emerald-300 mb-1"><i class="fas fa-shield-alt mr-1.5"></i>कोष-रक्षा एवं धन-प्रबंधन का स्वर्णिम नियम:</div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${moneyLeak.hi} अपनी आय का कम से कम 25–30% हिस्सा आते ही किसी लॉक-इन फंड या संपत्ति खाते में स्थानांतरित करें और भावनात्मक दबाव में बिना लिखा-पढ़ी के बड़ा उधार देने से बचें।</p>
        </div>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. Real Estate, Landed Assets & Vehicles (4th Lord ${lord4Key} • Bhumi-Karaka Mars • Vahana-Karaka Venus):</strong>
        Your 4th house of fixed assets (${RASHI_DATA[sign4].en} — <strong>${sav4} SAV bindus</strong>) is governed by <strong>${lord4Key}</strong> in House ${lord4.house}, with land-significator Mars in House ${mars.house} (${RASHI_DATA[mars.rashi].en}) and vehicle-significator Venus in House ${ven.house} (${RASHI_DATA[ven.rashi].en}). Your chart builds lasting net worth far more effectively through <strong>real estate, gold, and locked compounding instruments</strong> than through idle cash reserves.
      </p>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-emerald-400/35 mt-3">
        <div class="text-xs md:text-sm font-bold text-emerald-300 mb-1"><i class="fas fa-shield-alt mr-1.5"></i>Treasury Protection & Capital Allocation Rule:</div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${moneyLeak.en} Automatically route 25–30% of incoming gains into illiquid or locked asset buckets, and avoid unsecured emotional lending.</p>
      </div>
    `;
  }

  function buildChapter5Luck(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter5Luck === "function")
      ? window.NarrativeRules.renderChapter5Luck(ctx)
      : "";

    const { lang, chart, specialLagnas } = ctx;
    const luckHook = pickUniqueVariant("ch5LuckTest", DYNAMIC_HOOK_BANKS.ch5LuckTest, ctx);
    if (!chart.isFullChartMode) {
      return baseHtml + `<div class="p-4 rounded-2xl bg-slate-900/90 border border-yellow-400/35 mt-3 text-xs md:text-sm text-gray-200">${lang === "hi" ? luckHook.hi : luckHook.en}</div>`;
    }

    const ascR = chart.Asc.d1;
    const sign5 = getRashiOfBhava(ascR, 5);
    const sign9 = getRashiOfBhava(ascR, 9);
    const lord5Key = RASHI_DATA[sign5].lord;
    const lord9Key = RASHI_DATA[sign9].lord;
    const sav9 = specialLagnas.houseBindus[9] || 28;
    const matAges9 = (PLANET_MATURITY_AGES[lord9Key] || [24, 30, 36]).join(", ");

    const ishtMapHi = {
      Sun: "भगवान श्रीराम, सूर्य नारायण एवं गायत्री उपासना",
      Moon: "भगवान आशुतोष शिव एवं मां पार्वती (गौरी-शंकर) की आराधना",
      Mars: "संकटमोचन श्री हनुमान जी एवं कार्तिकेय/नरसिंह उपासना",
      Mercury: "भगवान श्री हरि विष्णु (श्रीकृष्ण/नारायण) एवं विघ्नहर्ता श्री गणेश",
      Jupiter: "देवगुरु बृहस्पति, भगवान श्री दत्तात्रेय/वामन एवं सद्गुरु तत्व",
      Venus: "मां महालक्ष्मी, मां जगदंबा एवं ललिता त्रिपुरसुंदरी उपासना",
      Saturn: "भगवान शिव (महाकाल), श्री हनुमान जी एवं कर्म-न्याय साधना",
      Rahu: "मां दुर्गा एवं भगवान कालभैरव की उपासना",
      Ketu: "भगवान श्री गणेश एवं मत्स्य/मोक्ष साधना"
    };
    const ishtMapEn = {
      Sun: "Lord Sri Rama, Surya Narayana & Gayatri Sadhana",
      Moon: "Lord Shiva (Somnath/Ashutosh) & Divine Mother Gauri",
      Mars: "Lord Hanuman & Sri Kartikeya / Narasimha",
      Mercury: "Lord Maha Vishnu (Sri Krishna/Narayana) & Lord Ganesha",
      Jupiter: "Lord Dakshinamurti / Dattatreya, Brihaspati & Guru Tattva",
      Venus: "Goddess Mahalakshmi & Lalita Tripurasundari",
      Saturn: "Lord Shiva (Mahakala) & Lord Hanuman",
      Rahu: "Goddess Durga & Lord Kalabhairava",
      Ketu: "Lord Maha Ganapati & Liberation Sadhana"
    };

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>2. पूर्वजन्म का प्रारब्ध (पंचमेश ${PLANET_META[lord5Key].hi}), धर्म-बल (${sav9} बिंदु) एवं इष्ट देव संकेत:</strong>
          पाराशरी सिद्धांत के अनुसार पंचम भाव आपके पूर्वजन्म के संचित पुण्य (प्रारब्ध) और नवम भाव इस जन्म के भाग्योदय व गुरु-कृपा का केंद्र है। आपके पंचमेश <strong>${PLANET_META[lord5Key].hi}</strong> और भाग्येश <strong>${PLANET_META[lord9Key].hi}</strong> के अनुसार आपके जीवन में ईश्वरीय रक्षा-कवच को जागृत करने वाले आराध्य तत्व हैं: <strong>${ishtMapHi[lord5Key]}</strong> तथा <strong>${ishtMapHi[lord9Key]}</strong>। भाग्येश की परिपक्वता आयु <strong>(${matAges9} वर्ष)</strong> आपके भाग्योदय के सबसे महत्वपूर्ण मोड़ हैं।
        </p>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-yellow-400/35 mt-3">
          <div class="text-xs md:text-sm font-bold text-yellow-300 mb-1"><i class="fas fa-dharmachakra mr-1.5"></i>आपके प्रारब्ध एवं भाग्योदय का रहस्य:</div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${luckHook.hi}</p>
        </div>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>2. Purva-Punya Merit (5th Lord ${lord5Key}), 9th-House Reservoir (${sav9} Bindus) & Ishta Devata Alignment:</strong>
        In Vedic tradition, the 5th house reflects past-life spiritual credit (Purva-Punya) while the 9th house governs present-life grace (Bhagya). Harmonizing your 5th lord <strong>${lord5Key}</strong> and 9th lord <strong>${lord9Key}</strong> points toward <strong>${ishtMapEn[lord5Key]}</strong> and <strong>${ishtMapEn[lord9Key]}</strong> as your primary spiritual anchors. Major fortune expansions align with your 9th lord's maturity milestones at <strong>ages ${matAges9}</strong>.
      </p>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-yellow-400/35 mt-3">
        <div class="text-xs md:text-sm font-bold text-yellow-300 mb-1"><i class="fas fa-dharmachakra mr-1.5"></i>The Law of Destiny Activation in Your Chart:</div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${luckHook.en}</p>
      </div>
    `;
  }

  function buildChapter6Love(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter6Love === "function")
      ? window.NarrativeRules.renderChapter6Love(ctx)
      : "";

    const { lang, chart } = ctx;
    const loveHook = pickUniqueVariant("ch6LovePattern", DYNAMIC_HOOK_BANKS.ch6LovePattern, ctx);
    const ven = chart.Venus;
    const moon = chart.Moon;
    const mars = chart.Mars;
    const venD9Rashi = RASHI_DATA[ven.d9];
    const moonD9Rashi = RASHI_DATA[moon.d9];

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>2. नवांश (D9) में शुक्र (${venD9Rashi.hi}) एवं चंद्र (${moonD9Rashi.hi}) का अंतरंग समीकरण:</strong>
          बाहरी आकर्षण लग्न कुंडली से देखा जाता है, किंतु किसी रिश्ते के भीतर वास्तविक भावनात्मक सुख नवांश (D9) के शुक्र और चंद्रमा से तय होता है। नवांश में शुक्र का <strong>${venD9Rashi.hi}</strong> और चंद्रमा का <strong>${moonD9Rashi.hi}</strong> में होना दर्शाता है कि आप संबंधों में सतही दिखावे के बजाय बौद्धिक सम्मान, भावनात्मक सुरक्षा और पूर्ण पारदर्शिता खोजते हैं। मंगल की ${RASHI_DATA[mars.rashi].hi} में स्थिति आपके स्नेह में सुरक्षात्मक निष्ठा (Protective Loyalty) जोड़ती है।
        </p>
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-pink-400/35 mt-3">
          <div class="text-xs md:text-sm font-bold text-pink-300 mb-1"><i class="fas fa-heart mr-1.5"></i>संबंधों में आपका भावनात्मक मनोविज्ञान एवं स्वर्णिम नियम:</div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${loveHook.hi}</p>
        </div>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>2. Inner Navamsa (D9) Relational Matrix — Venus in ${venD9Rashi.en} & Moon in ${moonD9Rashi.en}:</strong>
        While outer attraction is seen in D1, long-term emotional fulfillment is governed by the Navamsa placements of Venus and Moon. With D9 Venus in <strong>${venD9Rashi.en}</strong> and D9 Moon in <strong>${moonD9Rashi.en}</strong>, you require intellectual respect, emotional transparency, and fiercely loyal companionship rather than superficial romance.
      </p>
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-pink-400/35 mt-3">
        <div class="text-xs md:text-sm font-bold text-pink-300 mb-1"><i class="fas fa-heart mr-1.5"></i>Your Relational Psychology & Boundary Rule:</div>
        <p class="text-xs md:text-sm text-gray-200 mb-0">${loveHook.en}</p>
      </div>
    `;
  }

  function buildChapter7Partner(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter7Partner === "function")
      ? window.NarrativeRules.renderChapter7Partner(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, findings, specialLagnas } = ctx;
    const mar = findings?.domainChecks?.marriage;
    const lord7Key = mar ? mar.lord : RASHI_DATA[getRashiOfBhava(chart.Asc.d1, 7)].lord;
    const lord7 = chart[lord7Key];
    const d9AscRashi = RASHI_DATA[chart.Asc.d9];
    const lord7Rashi = RASHI_DATA[lord7.rashi];
    const ulRashi = RASHI_DATA[specialLagnas.upapadaRashi];
    const dkKey = findings?.charaKarakas?.darakaraka || "Venus";
    const sav7 = specialLagnas.houseBindus[7] || 28;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>3. जीवनसाथी का व्यक्तित्व, दिशा एवं विवाह पश्चात भाग्योदय (नवांश लग्न: ${d9AscRashi.hi} • सप्तम SAV: ${sav7} बिंदु):</strong>
          आपकी नवांश कुंडली (D9) का उदय लग्न <strong>${d9AscRashi.hi}</strong> है तथा उपपद लग्न (UL) <strong>${ulRashi.hi}</strong> में है। सप्तमेश <strong>${PLANET_META[lord7Key].hi}</strong> और दाराकारक <strong>${PLANET_META[dkKey].hi}</strong> के संयुक्त प्रभाव से आपके जीवनसाथी का व्यक्तित्व <em>${ulRashi.temperamentHi}</em> एवं <em>${d9AscRashi.bodyBuildHi}</em> गुणों से युक्त होगा। सप्तमेश की राशि के अनुसार जीवनसाथी का संबंध या विवाह के पश्चात उन्नति की दिशा <strong>${lord7Rashi.directionHi} / ${ulRashi.altDirectionHi}</strong> की ओर प्रबल दिखती है।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>3. Spouse Archetype, Direction & Post-Marriage Fortune (D9 Ascendant: ${d9AscRashi.en} • 7H SAV: ${sav7} Bindus):</strong>
        With your D9 Navamsa rising in <strong>${d9AscRashi.en}</strong> and Upapada Lagna (UL) in <strong>${ulRashi.en}</strong>, the synthesis of 7th lord <strong>${lord7Key}</strong> and Darakaraka <strong>${dkKey}</strong> points to a partner who is <em>${ulRashi.temperamentEn}</em> with <em>${d9AscRashi.bodyBuildEn}</em>. Geographically, the <strong>${lord7Rashi.direction} / ${ulRashi.altDirection}</strong> direction is strongly linked with your marital alliance.
      </p>
    `;
  }

  function buildChapterChildbirth(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter8Childbirth === "function")
      ? window.NarrativeRules.renderChapter8Childbirth(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, specialLagnas, findings } = ctx;
    const ch = findings?.domainChecks?.childbirth;
    const lord5Key = ch ? ch.lord : RASHI_DATA[getRashiOfBhava(chart.Asc.d1, 5)].lord;
    const lord5 = chart[lord5Key];
    const d7Asc = chart.Asc.d7 || 1;
    const d7AscData = RASHI_DATA[d7Asc];
    const sign5InD7 = getRashiOfBhava(d7Asc, 5);
    const lord5InD7Key = RASHI_DATA[sign5InD7].lord;
    const sav5 = specialLagnas.houseBindus[5] || 28;
    const sav9 = specialLagnas.houseBindus[9] || 28;
    const jupBav5 = specialLagnas.houseBav?.Jupiter ? specialLagnas.houseBav.Jupiter[5] : 5;

    if (lang === "hi") {
      return `
        ${baseHtml}
        <p>
          <strong>2. सप्तांश (D7) पंचमेश (${PLANET_META[lord5InD7Key].hi}), गुरु अष्टकवर्ग (${jupBav5}/8 बिंदु) एवं वंश-वृद्धि विश्लेषण:</strong>
          आपकी सप्तांश कुंडली (D7) में <strong>${d7AscData.hi} लग्न</strong> उदित है और D7 के पंचम भाव (${RASHI_DATA[sign5InD7].hi}) के स्वामी <strong>${PLANET_META[lord5InD7Key].hi}</strong> हैं। लग्न कुंडली के पंचम भाव में <strong>${sav5} सर्वाष्टकवर्ग बिंदु</strong> (तथा भाग्य भाव में ${sav9} बिंदु) और संतान कारक गुरु के भिन्नाष्टकवर्ग में <strong>${jupBav5} बिंदु</strong> होने से आपकी संतान मेधावी, आत्मनिर्भर और परिवार के भाग्योदय में सहायक सिद्ध होगी।
        </p>
      `;
    }

    return `
      ${baseHtml}
      <p>
        <strong>2. Saptamsa (D7) 5th-Lord (${lord5InD7Key}), Jupiter BAV (${jupBav5}/8 Bindus) & Lineage Prosperity:</strong>
        In your D7 Saptamsa chart (${d7AscData.en} Ascendant), the 5th house (${RASHI_DATA[sign5InD7].en}) is governed by <strong>${lord5InD7Key}</strong>. Supported by <strong>${sav5} bindus</strong> in your 5th house, <strong>${sav9} bindus</strong> in your 9th house, and <strong>${jupBav5} bindus</strong> in Jupiter's Bhinnashtakavarga, your progeny axis indicates bright, independent children who elevate family fortune.
      </p>
    `;
  }

  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const isFull = chart.isFullChartMode;
    const ascRashi = chart.Asc.d1;
    const pKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    const modeBanner = isFull
      ? (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>पाराशरी भाव-स्वामी एवं नवांश विश्लेषण:</strong> नीचे प्रत्येक ग्रह का स्वामित्व (Lordship), भाव स्थिति, नैसर्गिक परिपक्वता आयु, नवांश (D9) बल और पाराशरी दृष्टियों का विवरण दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>Parashari Lordship & Navamsa Synthesis:</strong> Below are the house-lordship rules, placements, natural maturity ages, D9 dignity shifts, and aspect geometry for all 9 planets.</div>`)
      : (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-sun mr-2"></i><strong>जन्म-दिवस के वास्तविक ग्रह (Noon Natal Ephemeris):</strong> आपके जन्म के दिन दोपहर 12:00 IST पर आकाश में सभी 9 ग्रह जिन वास्तविक राशियों और नक्षत्रों में स्थित थे, उनका विवरण नीचे दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-sun mr-2"></i><strong>Your Birth-Date Natal Planetary Blueprint (Noon Ephemeris):</strong> Here are the sidereal sign and nakshatra positions of all 9 planets on your date of birth.</div>`);

    const cardsHtml = pKeys.map(k => {
      const info = planetAnalysis[k];
      const d1Rashi = RASHI_DATA[info.d1];
      const d9Rashi = RASHI_DATA[info.d9];
      const nak = NAKSHATRA_DATA[info.nak];
      const funcRole = isFull ? getFunctionalRoleLabel(ascRashi, k, lang) : (lang === "hi" ? info.meta.karakaHi : info.meta.karakaEn);
      const ownedStrEn = isFull ? (info.ownedHouses.length ? `Lord of House ${info.ownedHouses.join(" & ")}` : "Karmic Shadow Node") : `Natal Sign: ${d1Rashi.en}`;
      const ownedStrHi = isFull ? (info.ownedHouses.length ? `भाव ${info.ownedHouses.join(" एवं ")} का स्वामी` : "छाया ग्रह (कार्मिक अक्ष)") : `जन्म-राशि स्थान: ${d1Rashi.hi}`;
      const bavScoreHere = (isFull && specialLagnas.houseBav[k]) ? specialLagnas.houseBav[k][info.bhava] : null;
      const degBadge = info.formattedDeg ? `<span class="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">${info.formattedDeg}</span>` : "";

      const ageList = PLANET_MATURITY_AGES[k] || [24, 30, 36];
      const primaryMatAge = ageList[0];
      const matAges = ageList.join(", ");
      const conjNamesEn = info.conjunctWith.map(c => PLANET_META[c].en).join(", ");
      const conjNamesHi = info.conjunctWith.map(c => PLANET_META[c].hi).join(", ");

      const lordshipSynthesisHi = (isFull && info.ownedHouses.length)
        ? `यह ग्रह आपके <strong>${info.ownedHouses.join(" व ")}वें भाव का स्वामी</strong> होकर <strong>${info.bhava}वें भाव</strong> में बैठा है—जिसका पाराशरी सूत्र है: <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[info.bhava]}"</em>। `
        : "";
      const lordshipSynthesisEn = (isFull && info.ownedHouses.length)
        ? `As ruler of <strong>House ${info.ownedHouses.join(" & ")}</strong> seated in <strong>House ${info.bhava}</strong>, Parashari sutra indicates <em>${BHAVA_IN_BHAVA_EFFECTS_EN[info.bhava]}</em>. `
        : "";

      let d9MaturityNoteHi = "";
      let d9MaturityNoteEn = "";

      if (info.dignity.isVargottama) {
        d9MaturityNoteHi = `यह ग्रह <strong>वर्गोत्तम (${d1Rashi.hi})</strong> होने से दोगुना आंतरिक बल रखता है और आपकी आयु के <strong>${primaryMatAge}वें वर्ष</strong> से विशेष फल देता है।`;
        d9MaturityNoteEn = `Being <strong>Vargottama in ${d1Rashi.en}</strong>, it carries strong internal potency and matures from <strong>age ${primaryMatAge}</strong> onward.`;
      } else if (info.dignity.isExaltedD9 || info.dignity.isOwnD9) {
        d9MaturityNoteHi = `नवांश (D9) में अपनी उच्च/स्वराशि <strong>${d9Rashi.hi}</strong> में जाने से आपकी आयु के <strong>${primaryMatAge}वें वर्ष</strong> के बाद इस ग्रह का शुभ फल बढ़ जाता है।`;
        d9MaturityNoteEn = `Fortified in its exalted/own sign <strong>${d9Rashi.en}</strong> in Navamsa (D9), its constructive results strengthen after its natural maturity age of <strong>${primaryMatAge}</strong>.`;
      } else if (info.dignity.isDebilitatedD9) {
        d9MaturityNoteHi = `नवांश (D9) में <strong>${d9Rashi.hi} (नीचस्थ)</strong> में जाने के कारण इसके स्थायी फल हेतु धैर्य आवश्यक है।`;
        d9MaturityNoteEn = `Moving into debilitated <strong>${d9Rashi.en}</strong> in Navamsa (D9), it requires steady discipline for long-term results.`;
      } else {
        d9MaturityNoteHi = `नवांश (D9) में <strong>${d9Rashi.hi} (${d9Rashi.lordHi} की राशि)</strong> में जाने से आपकी आयु के <strong>${primaryMatAge}वें वर्ष</strong> के बाद इसके फल में स्थायित्व आता है।`;
        d9MaturityNoteEn = `Maturing into <strong>${d9Rashi.en} (ruled by ${d9Rashi.lord})</strong> in Navamsa (D9), its deeper results stabilize after <strong>age ${primaryMatAge}</strong>.`;
      }

      const conjAndD9BlockHi = info.conjunctWith.length
        ? `यह ग्रह <strong>${conjNamesHi}</strong> के साथ युति में है। साथ ही, ${d9MaturityNoteHi}`
        : d9MaturityNoteHi;

      const conjAndD9BlockEn = info.conjunctWith.length
        ? `Conjunct <strong>${conjNamesEn}</strong>, it blends their significations. Furthermore, ${d9MaturityNoteEn}`
        : d9MaturityNoteEn;

      const outgoingEn = info.aspectedTargets.map(t => {
        const hit = t.planetsThere.length ? ` (aspecting ${t.planetsThere.join(", ")})` : "";
        return isFull ? `${t.nthAspect}th aspect on House ${t.targetBhava}${hit}` : `${t.nthAspect}th aspect on ${RASHI_DATA[t.targetRashi].en}${hit}`;
      }).join(" • ");

      const outgoingHi = info.aspectedTargets.map(t => {
        const hit = t.planetsThere.length ? ` (${t.planetsThere.map(p => PLANET_META[p].hi).join(", ")} पर दृष्टि)` : "";
        return isFull ? `${t.nthAspect}वीं दृष्टि ${t.targetBhava}वें भाव पर${hit}` : `${t.nthAspect}वीं दृष्टि ${RASHI_DATA[t.targetRashi].hi} पर${hit}`;
      }).join(" • ");

      const incomingEn = info.aspectedBy.length
        ? `Aspected by ${info.aspectedBy.map(inc => PLANET_META[inc.fromPlanet].en).join(", ")}`
        : "Unaspected";
      const incomingHi = info.aspectedBy.length
        ? `${info.aspectedBy.map(inc => PLANET_META[inc.fromPlanet].hi).join(", ")} से दृष्ट`
        : "किसी अन्य ग्रह की दृष्टि से मुक्त";

      if (lang === "hi") {
        return `
          <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 max-w-full overflow-hidden break-words">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div class="min-w-0">
                <h4 class="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <span>${info.meta.hi}</span>
                  ${degBadge}
                  ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">वक्री (Retro)</span>' : ''}
                  ${info.combust ? '<span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">अस्त (Combust)</span>' : ''}
                </h4>
                <p class="text-xs text-amber-300/90 font-semibold mt-0.5">${ownedStrHi} • ${funcRole}</p>
              </div>
              <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusHi}</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">${isFull ? "लग्न (D1) भाव:" : "जन्म राशि:"}</span>
                <strong class="text-amber-300">${isFull ? `${info.bhava}वां भाव — ` : ""}${d1Rashi.hi}</strong>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नक्षत्र एवं स्वामी:</span>
                <strong class="text-purple-300">${nak.name} (${nak.ruler})</strong>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नवांश (D9) राशि:</span>
                <strong class="text-emerald-300">${d9Rashi.hi}</strong>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">${bavScoreHere !== null ? "अष्टकवर्ग (BAV):" : "परिपक्वता आयु:"}</span>
                <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere}/8 बिंदु` : `आयु ${matAges}`}</strong>
              </div>
            </div>

            <div class="space-y-2 text-xs md:text-sm text-gray-200 pt-1">
              <div>🎯 <strong class="text-amber-300">पाराशरी फल:</strong> ${lordshipSynthesisHi}${d1Rashi.hi} (${nak.name}) में स्थित ${info.meta.hi} आपको <em>${nak.traitHi}</em> देता है${isFull ? ` और ${houseThemeShort(info.bhava, "hi")} को प्रभावित करता है` : ""}। ${conjAndD9BlockHi}</div>
              <div>⚡ <strong class="text-emerald-300">परिपक्वता आयु एवं स्वास्थ्य:</strong> नैसर्गिक परिपक्वता आयु: <strong>${matAges} वर्ष</strong>। स्वास्थ्य संवेदनशीलता: <em>${info.meta.healthHi}</em>।</div>
              <div>🛡️ <strong class="text-cyan-300">दृष्टि ज्यामिति:</strong> ${outgoingHi} (${incomingHi})।</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="pdf-keep-together p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 max-w-full overflow-hidden break-words">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div class="min-w-0">
              <h4 class="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                <span>${info.meta.en}</span>
                ${degBadge}
                ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Retrograde</span>' : ''}
                ${info.combust ? '<span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">Combust</span>' : ''}
              </h4>
              <p class="text-xs text-amber-300/90 font-semibold mt-0.5">${ownedStrEn} • ${funcRole}</p>
            </div>
            <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusEn}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">${isFull ? "D1 House:" : "Natal Sign:"}</span>
              <strong class="text-amber-300">${isFull ? `H-${info.bhava} — ` : ""}${d1Rashi.en}</strong>
            </div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">Nakshatra:</span>
              <strong class="text-purple-300">${nak.name} (${nak.ruler})</strong>
            </div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D9 Sign:</span>
              <strong class="text-emerald-300">${d9Rashi.en}</strong>
            </div>
            <div class="p-2 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">${bavScoreHere !== null ? "BAV Strength:" : "Maturity Ages:"}</span>
              <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere}/8 Bindus` : `Ages ${matAges}`}</strong>
            </div>
          </div>

          <div class="space-y-2 text-xs md:text-sm text-gray-200 pt-1">
            <div>🎯 <strong class="text-amber-300">Parashari Verdict:</strong> ${lordshipSynthesisEn}Seated in ${d1Rashi.en} under ${nak.name}, ${info.meta.en} imparts <em>${nak.traitEn}</em>${isFull ? ` and shapes <em>${houseThemeShort(info.bhava, "en")}</em>` : ""}. ${conjAndD9BlockEn}</div>
            <div>⚡ <strong class="text-emerald-300">Maturity Ages & Health:</strong> Natural maturity ages: <strong>${matAges}</strong>. Anatomical correspondence: <em>${info.meta.healthEn}</em>.</div>
            <div>🛡️ <strong class="text-cyan-300">Aspect Geometry:</strong> Casts ${outgoingEn} (${incomingEn}).</div>
          </div>
        </div>
      `;
    }).join("");

    return modeBanner + `<div class="space-y-3.5">${cardsHtml}</div>`;
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

    const houseArr = Object.keys(bindus).map(h => ({h: parseInt(h, 10), b: bindus[h]}));
    const sorted = [...houseArr].sort((a, b) => b.b - a.b);
    const strongest = sorted.slice(0, 3);
    const weakest = sorted.slice(-3).reverse();

    const savGrid = houseArr.map(({h, b}) => {
      const color = b >= 30 ? "border-emerald-400/50 text-emerald-300"
                  : b <= 24 ? "border-rose-400/50 text-rose-300"
                  : b <= 27 ? "border-amber-400/40 text-amber-300"
                  : "border-white/15 text-gray-200";
      return `<div class="p-2 rounded-xl bg-slate-950/90 border ${color} text-center min-w-0">
        <div class="text-[10px] uppercase text-gray-400 truncate">${lang === "hi" ? `भाव ${h}` : `House ${h}`}</div>
        <div class="text-base font-extrabold mt-0.5">${b}</div>
      </div>`;
    }).join("");

    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const planetShort = {Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa"};

    const bavRowsHtml = houseArr.map(({h}) => {
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

    const strongListEn = strongest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus)`).join(", ");
    const strongListHi = strongest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु)`).join(", ");
    const weakListEn   = weakest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus)`).join(", ");
    const weakListHi   = weakest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु)`).join(", ");

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-blue-400/30">
            <h4 class="text-base font-bold text-blue-300 mb-1.5"><i class="fas fa-moon mr-2"></i>1. चंद्र लग्न (${chandra.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">गोचर और साढ़ेसाती/ढैय्या का प्रभाव चंद्र लग्न (${chandra.hi}) से देखा जाता है।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30">
            <h4 class="text-base font-bold text-orange-300 mb-1.5"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (${surya.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">सूर्य लग्न (${surya.hi}) आत्मबल, पिता की विरासत और प्रशासनिक क्षमता को दर्शाता है।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30">
            <h4 class="text-base font-bold text-purple-300 mb-1.5"><i class="fas fa-ring mr-2"></i>3. नवांश (${navamsa.hi}) एवं कारकांश (${karakamsa.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">सर्वोच्च अंश वाले आत्मकारक (${akMeta.hi}) से निर्मित कारकांश (${karakamsa.hi}) और नवांश लग्न आपके आंतरिक धर्म और वैवाहिक सामंजस्य को दर्शाते हैं।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30">
            <h4 class="text-base font-bold text-amber-300 mb-1.5"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (AL — ${arudha.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">आरूढ़ पद (AL) ${arudha.hi} (लग्न से ${specialLagnas.arudhaHouseFromLagna}वें भाव) में है, जो समाज में आपकी प्रत्यक्ष छवि को दर्शाता है।</p>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5 max-w-full overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. प्रमाणित 337-बिंदु सर्वाष्टकवर्ग (SAV) एवं BAV तालिका</h4>
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
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-blue-400/30">
          <h4 class="text-base font-bold text-blue-300 mb-1.5"><i class="fas fa-moon mr-2"></i>1. Chandra Lagna (${chandra.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Planetary transits (Gochara) and Sade-Sati phases operate relative to ${chandra.en}.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30">
          <h4 class="text-base font-bold text-orange-300 mb-1.5"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (${surya.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Surya Lagna (${surya.en}) governs your vitality, paternal lineage, and administrative authority.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30">
          <h4 class="text-base font-bold text-purple-300 mb-1.5"><i class="fas fa-ring mr-2"></i>3. Navamsa (${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Derived from highest-degree Atmakaraka ${akMeta.en}, your Karakamsa (${karakamsa.en}) and D9 Lagna reflect your inner dharma.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30">
          <h4 class="text-base font-bold text-amber-300 mb-1.5"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Placed in ${arudha.en} (${specialLagnas.arudhaHouseFromLagna}th from Lagna), Arudha Pada reflects your tangible public standing.</p>
        </div>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5 max-w-full overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. Verified 337-Bindu Sarvashtakavarga (SAV) & BAV Matrix</h4>
          <span class="text-xs text-emerald-300 font-bold">Verified Sum: ${specialLagnas.grandTotalSav} / 337 Bindus</span>
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
  // 10. CHAPTER 11: ACTIVE DASHA + DOMAIN TIMING & AFFLICTION CARDS
  // ==========================================================================

  function buildDomainOpportunityVsSabotageCard(ctx, domain) {
    const { lang, chart, planetAnalysis, timeline, findings } = ctx;
    if (!chart.isFullChartMode || !findings || !findings.domainChecks) return "";

    const check = findings.domainChecks[domain];
    const winObj = timeline[domain];
    if (!check || !winObj) return "";

    const titles = {
      career:     { icon: "fa-briefcase", hi: "करियर एवं पदोन्नति (10th House & D10)", en: "Career & Authority (10th House & D10)" },
      marriage:   { icon: "fa-ring",      hi: "विवाह एवं साझेदारी (7th House & D9)",    en: "Marriage & Partnership (7th House & D9)" },
      childbirth: { icon: "fa-baby",      hi: "संतान योग (5th House & D7)",           en: "Progeny & Santan Yoga (5th House & D7)" }
    }[domain];

    const houseLord = planetAnalysis[check.lord];
    const windowBadge = winObj.hasStrongWindow
      ? (lang === "hi" ? winObj.labelHi : winObj.labelEn)
      : (lang === "hi" ? "कोई तत्काल प्रबल दशा-गोचर खिड़की नहीं (समेकन चरण)" : "No Immediate Strong Window (Consolidation Phase)");

    let timingHtml = "";
    if (winObj.hasStrongWindow && winObj.primaryWindow) {
      const pw = winObj.primaryWindow;
      const reasons = (lang === "hi" ? pw.reasonsHi : pw.reasonsEn).join("; ");
      timingHtml = lang === "hi"
        ? `✅ <strong>दशा एवं गोचर समय-सीमा (${pw.periodStr}):</strong> आपकी कुंडली में <strong>${pw.adLabel}</strong> के दौरान (${reasons}) यह क्षेत्र प्रबल रूप से सक्रिय हो रहा है।`
        : `✅ <strong>Dasha & Transit Window (${pw.periodStr}):</strong> Activated during <strong>${pw.adLabel}</strong> because ${reasons}.`;
    } else {
      timingHtml = lang === "hi"
        ? `ℹ️ <strong>वर्तमान दशा स्थिति:</strong> आगामी 36 महीनों में इस भाव से संबंधित कोई उच्च-तीव्रता वाली अंतर्दशा और गुरु-शनि का डबल ट्रांजिट एक साथ नहीं बन रहा है—अतः यह समय जल्दबाजी के बजाय आधार मजबूत करने का है।`
        : `ℹ️ <strong>Current Dasha Status:</strong> No high-intensity Antardasha and Jupiter-Saturn Double Transit converge on House ${check.house} over the immediate 36 months, marking this as a foundation and preparation phase.`;
    }

    let afflictionHtml = "";
    if (check.primaryAfflictor) {
      const aff = check.primaryAfflictor;
      const affMeta = PLANET_META[aff.planet];
      afflictionHtml = lang === "hi"
        ? `<p class="text-xs md:text-sm text-amber-200 leading-relaxed mb-0 mt-2">⚠️ <strong>वास्तविक ग्रह-अवरोध (Verified Affliction):</strong> आपकी कुंडली में <strong>${affMeta.hi}</strong> ${aff.reasonHi} (सर्वाष्टकवर्ग: <strong>${check.savBindus} बिंदु</strong>), जो इस क्षेत्र में विलंब या अतिरिक्त परिश्रम दर्शाता है।</p>`
        : `<p class="text-xs md:text-sm text-amber-200 leading-relaxed mb-0 mt-2">⚠️ <strong>Verified Natal Affliction:</strong> Natal <strong>${affMeta.en}</strong> ${aff.reasonEn} (House SAV: <strong>${check.savBindus} bindus</strong>), creating friction that requires disciplined patience.</p>`;
    } else if (check.lordInDusthana || check.lordCombust || check.lordDebilitated) {
      const stateReasonHi = check.lordDebilitated ? "नीच राशि में है" : (check.lordCombust ? "सूर्य से अस्त है" : `${check.lordHouse}वें (दुस्थान) भाव में स्थित है`);
      const stateReasonEn = check.lordDebilitated ? "is debilitated" : (check.lordCombust ? "is combust" : `is placed in Dusthana House ${check.lordHouse}`);
      afflictionHtml = lang === "hi"
        ? `<p class="text-xs md:text-sm text-amber-200 leading-relaxed mb-0 mt-2">⚠️ <strong>भावेश बल सावधानी:</strong> इस भाव पर किसी क्रूर ग्रह की सीधी मार नहीं है, परंतु भावेश <strong>${houseLord.meta.hi}</strong> स्वयं ${stateReasonHi}—अतः परिणाम धैर्य और निरंतर प्रयास के बाद परिपक्व होते हैं।</p>`
        : `<p class="text-xs md:text-sm text-amber-200 leading-relaxed mb-0 mt-2">⚠️ <strong>House Lord Sensitivity:</strong> While free from external malefic aspects, your ${check.house}th lord <strong>${houseLord.meta.en}</strong> ${stateReasonEn}, requiring steady effort for full fruition.</p>`;
    } else {
      afflictionHtml = lang === "hi"
        ? `<p class="text-xs md:text-sm text-emerald-300 leading-relaxed mb-0 mt-2">🛡️ <strong>अवरोध-मुक्त भाव (Clear & Protected):</strong> आपका ${check.house}वां भाव और उसके स्वामी <strong>${houseLord.meta.hi}</strong> किसी भी क्रूर ग्रह की सीधी पीड़ा से मुक्त हैं (${check.savBindus} SAV बिंदु)।</p>`
        : `<p class="text-xs md:text-sm text-emerald-300 leading-relaxed mb-0 mt-2">🛡️ <strong>Unobstructed Axis:</strong> Your ${check.house}th house and its lord <strong>${houseLord.meta.en}</strong> are free from severe malefic affliction (${check.savBindus} SAV bindus).</p>`;
    }

    return `
      <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border ${check.hasRealAffliction ? 'border-amber-500/60' : 'border-emerald-500/50'} shadow-lg">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
          <span class="text-amber-300 font-extrabold text-xs md:text-sm uppercase tracking-wider">
            <i class="fas ${titles.icon} mr-1.5"></i>${lang === "hi" ? titles.hi : titles.en}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-200 text-xs font-bold">${windowBadge}</span>
        </div>
        <p class="text-xs md:text-sm text-gray-100 leading-relaxed mb-0">${timingHtml}</p>
        ${afflictionHtml}
      </div>
    `;
  }

  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData, chart } = ctx;
    const isFull = chart.isFullChartMode;
    const cy = numData.currentYear;

    if (!isFull || !dasha || !dasha.md || !dasha.ad || !planetAnalysis[dasha.md] || !planetAnalysis[dasha.ad]) {
      const moonRashi = RASHI_DATA[chart.Moon.d1];
      if (lang === "hi") {
        return `
          <p class="text-sm text-gray-200">
            आपका जन्म चंद्रमा <strong>${moonRashi.hi} (${ctx.displayMoonNak} नक्षत्र)</strong> में है, जिसके जन्म दशा स्वामी <strong>${PLANET_META[dasha?.birthDashaRuler || "Sun"].hi}</strong> हैं। सटीक विंशोत्तरी महादशा और अंतर्दशा की तारीखों की गणना चंद्रमा के सटीक अंशों (डिग्री/मिनट) पर निर्भर करती है।
          </p>
          ${buildRedBirthTimePrompt("hi")}
        `;
      }
      return `
        <p class="text-sm text-gray-200">
          Your natal Moon is placed in <strong>${moonRashi.en} (${ctx.displayMoonNak} Nakshatra)</strong>, governed at birth by <strong>${dasha?.birthDashaRuler || "Sun"}</strong>. Because exact Vimshottari Mahadasha and Antardasha dates depend on the exact longitudinal degree of the Moon at the minute of birth, Dasha calendar dates require your birth time.
        </p>
        ${buildRedBirthTimePrompt("en")}
      `;
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

    const nextAdBlockEn = (dasha.isExactCalendarDasha && dasha.nextAD)
      ? `Following <strong>${fmtDate(dasha.adActive.end)}</strong>, your chart enters <strong>${dasha.nextAD.mdLord}–${dasha.nextAD.lord} Antardasha (${fmtDate(dasha.nextAD.start)} → ${fmtDate(dasha.nextAD.end)})</strong>, activating your ${planetAnalysis[dasha.nextAD.lord].bhava}th house (${houseThemeShort(planetAnalysis[dasha.nextAD.lord].bhava, "en")}).`
      : "";

    const nextAdBlockHi = (dasha.isExactCalendarDasha && dasha.nextAD)
      ? `<strong>${fmtDate(dasha.adActive.end)}</strong> के पश्चात आपकी कुंडली में <strong>${PLANET_META[dasha.nextAD.mdLord].hi} में ${PLANET_META[dasha.nextAD.lord].hi} की अंतर्दशा (${fmtDate(dasha.nextAD.start)} → ${fmtDate(dasha.nextAD.end)})</strong> प्रारंभ होगी, जो आपके ${planetAnalysis[dasha.nextAD.lord].bhava}वें भाव (${houseThemeShort(planetAnalysis[dasha.nextAD.lord].bhava, "hi")}) को सक्रिय करेगी।`
      : "";

    const domainCardsHtml = `
      <div class="space-y-4 mt-6">
        <h4 class="text-base md:text-xl font-bold text-amber-300">
          <i class="fas fa-hourglass-half mr-2"></i>${lang === "hi"
            ? `दशा एवं गोचर समय-सीमा विश्लेषण (${cy}–${cy + 3}):`
            : `Dasha & Double-Transit Domain Windows (${cy}–${cy + 3}):`}
        </h4>
        ${buildDomainOpportunityVsSabotageCard(ctx, "career")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "marriage")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "childbirth")}
      </div>
    `;

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
            <div class="text-xs text-amber-300 font-bold uppercase">अंतर्दशा संबंध एवं अवधि</div>
            <div class="text-base font-extrabold text-white mt-1">दशानाथ से ${relativeHouseOfAD}वां भाव</div>
            <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
          </div>
        </div>

        <p>
          <strong>1. वर्तमान ${mdInfo.meta.hi}–${adInfo.meta.hi} दशा का पाराशरी फल:</strong> इस समय आपके जीवन की दशा कमान ${mdInfo.bhava}वें भाव के <strong>${mdInfo.meta.hi}</strong> और ${adInfo.bhava}वें भाव के <strong>${adInfo.meta.hi}</strong> के पास है। ${
            difficultAxis
              ? `महादशानाथ और अंतर्दशानाथ एक-दूसरे से <strong>${relativeHouseOfAD}वें (6/8/12 — षडाष्टक/द्वादश) कोण</strong> पर स्थित हैं, अतः इस अवधि में धैर्य और सुविचारित निर्णय आवश्यक हैं।`
              : `दोनों ग्रहों का परस्पर ${relativeHouseOfAD}वां संबंध आपके ${mdInfo.bhava}वें और ${adInfo.bhava}वें भाव के विषयों को गति प्रदान कर रहा है।`
          }
        </p>

        ${nextAdBlockHi ? `<p><strong>2. आगामी अंतर्दशा परिवर्तन:</strong> ${nextAdBlockHi}</p>` : ""}
        ${domainCardsHtml}
        ${renderMultiMahadashaAntardashaGrid(ctx)}
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
          <div class="text-xs text-amber-300 font-bold uppercase">Active Period Dates</div>
          <div class="text-base font-extrabold text-white mt-1">${relativeHouseOfAD}th from MD Lord</div>
          <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
        </div>
      </div>

      <p>
        <strong>1. Active ${dasha.md}–${dasha.ad} Dasha Disposition:</strong> Your current period is governed by <strong>${mdInfo.meta.en}</strong> in House ${mdInfo.bhava} and sub-lord <strong>${adInfo.meta.en}</strong> in House ${adInfo.bhava}. ${
          difficultAxis
            ? `Because ${dasha.md} and ${dasha.ad} form a <strong>${relativeHouseOfAD}th (6/8/12) angle</strong> from each other, steady pacing and careful planning are advised during this sub-period.`
            : `This ${relativeHouseOfAD}th-house relationship between ${dasha.md} and ${dasha.ad} links Houses ${mdInfo.bhava} and ${adInfo.bhava} constructively.`
        }
      </p>

      ${nextAdBlockEn ? `<p><strong>2. Upcoming Antardasha Transition:</strong> ${nextAdBlockEn}</p>` : ""}
      ${domainCardsHtml}
      ${renderMultiMahadashaAntardashaGrid(ctx)}
    `;
  }

  function buildChapter11HiddenTraps(ctx) {
    const baseHtml = (window.NarrativeRules && typeof window.NarrativeRules.renderChapter12Diagnostic === "function")
      ? window.NarrativeRules.renderChapter12Diagnostic(ctx)
      : "";
    if (!ctx.chart.isFullChartMode) return baseHtml;

    const { lang, chart, dasha } = ctx;
    const ascR = chart.Asc.d1;
    const lagnaLordKey = RASHI_DATA[ascR].lord;
    const matrix = LAGNA_FUNCTIONAL_MATRIX[ascR] || LAGNA_FUNCTIONAL_MATRIX[1];
    const badhakeshKey = matrix.badhakesh;
    const activeMdKey = (dasha && dasha.md) ? dasha.md : "Jupiter";
    const activeAdKey = (dasha && dasha.ad) ? dasha.ad : lagnaLordKey;

    const remKeys = Array.from(new Set([lagnaLordKey, activeMdKey, activeAdKey, badhakeshKey]));
    const remCardsHtml = remKeys.map((pKey, idx) => {
      const rem = PLANET_REMEDIES[pKey] || PLANET_REMEDIES.Jupiter;
      const pMeta = PLANET_META[pKey];
      const roleTagHi = pKey === lagnaLordKey ? "लग्नेश (जीवन-बल)"
                      : pKey === activeMdKey  ? "सक्रिय महादशानाथ"
                      : pKey === activeAdKey  ? "सक्रिय अंतर्दशानाथ"
                      : `बाधकेश (${matrix.badhakaHouse}वेश शांति)`;
      const roleTagEn = pKey === lagnaLordKey ? "Lagna Lord (Core Vitality)"
                      : pKey === activeMdKey  ? "Active Mahadasha Lord"
                      : pKey === activeAdKey  ? "Active Antardasha Lord"
                      : `Badhakesh (${matrix.badhakaHouse}th Lord Pacification)`;

      if (lang === "hi") {
        return `
          <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/35 space-y-1.5">
            <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
              <span class="font-bold text-amber-300 text-sm">${idx + 1}. ${pMeta.hi} — सात्विक वैदिक उपाय</span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-bold">${roleTagHi}</span>
            </div>
            <div class="text-xs md:text-sm text-gray-200">🕉️ <strong>वैदिक मंत्र एवं उपासना:</strong> ${rem.mantraHi}</div>
            <div class="text-xs md:text-sm text-gray-200">🌾 <strong>सात्विक दान एवं सेवा:</strong> ${rem.danaHi}</div>
            <div class="text-xs md:text-sm text-gray-200">🌿 <strong>आचार एवं जीवनशैली सूत्र:</strong> ${rem.lifestyleHi}</div>
          </div>
        `;
      }

      return `
        <div class="pdf-keep-together p-4 rounded-2xl bg-slate-950/90 border border-amber-400/35 space-y-1.5">
          <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <span class="font-bold text-amber-300 text-sm">${idx + 1}. ${pMeta.en} — Classical Sattvic Remedy</span>
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-bold">${roleTagEn}</span>
          </div>
          <div class="text-xs md:text-sm text-gray-200">🕉️ <strong>Vedic Mantra & Worship:</strong> ${rem.mantraEn}</div>
          <div class="text-xs md:text-sm text-gray-200">🌾 <strong>Sattvic Dana (Charity):</strong> ${rem.danaEn}</div>
          <div class="text-xs md:text-sm text-gray-200">🌿 <strong>Daily Dharmic Discipline:</strong> ${rem.lifestyleEn}</div>
        </div>
      `;
    }).join("");

    const headerTitle = lang === "hi"
      ? `<h4 class="text-base md:text-lg font-bold text-amber-300 mt-5 mb-2.5"><i class="fas fa-praying-hands mr-2"></i>आपकी कुंडली एवं सक्रिय दशा के अनुसार व्यक्तिगत सात्विक वैदिक उपाय:</h4>`
      : `<h4 class="text-base md:text-lg font-bold text-amber-300 mt-5 mb-2.5"><i class="fas fa-praying-hands mr-2"></i>Personalized Sattvic Vedic Remedies (Lagna Lord, Active Dasha & Badhakesh):</h4>`;

    return `${baseHtml}${renderNaamAksharAndGemstoneAdvisory(ctx)}${headerTitle}<div class="space-y-3">${remCardsHtml}</div>`;
  }

  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart } = ctx;
    const jupRashiId = (chart && chart.Jupiter) ? chart.Jupiter.d1 : 9;
    const jupRashi = RASHI_DATA[jupRashiId];
    const headingEl = document.getElementById("dakshinaHeading");
    const textEl = document.getElementById("contentDakshinaText");
    if (!headingEl || !textEl) return;

    if (lang === "hi") {
      headingEl.innerHTML = `पवित्र ऊर्जा विनिमय एवं गुरु-दक्षिणा संकल्प (
Sacred Tradition) 🙏`;
      textEl.innerHTML = `
        <p class="hindi">
          प्रिय <strong>${name}</strong>, आपकी पत्रिका में देवगुरु बृहस्पति <strong>${jupRashi.hi}</strong> में स्थित हैं। वैदिक परंपरा में ज्योतिषीय मार्गदर्शन के अध्ययन के साथ अपनी श्रद्धा एवं सामर्थ्य के अनुसार स्वैच्छिक <strong>गुरु-दक्षिणा</strong> अर्पित करना एक शुभ संकल्प माना गया है।
        </p>
      `;
    } else {
      headingEl.innerHTML = `Voluntary Guru Dakshina (Sacred Vedic Tradition) 🙏`;
      textEl.innerHTML = `
        <p>
          Dear <strong>${name}</strong>, in your chart <strong>Jupiter (Brihaspati)</strong> is placed in <strong>${jupRashi.en}</strong>. In the Vedic tradition, offering a voluntary <strong>Guru Dakshina</strong> according to your Shraddha is a time-honored gesture of gratitude for astrological study.
        </p>
      `;
    }
  }

  // ==========================================================================
  // 11. DYNAMIC DOM ORDERING & VISUAL CHARTS
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

    let d1SVG = "", d9SVG = "", panchangHtml = "", extraTablesHtml = "";
    const renderD9Fn = window.VedicChartAnalyzer.renderD9NorthChart || window.VedicChartAnalyzer.renderD9SouthChart;

    if (vd && vd.d1SVG && vd.d9SVG) {
      d1SVG = window.VedicChartAnalyzer.renderD1NorthChart(vd.chart, { lang: ctx.lang, userName: ctx.name });
      d9SVG = renderD9Fn(vd.chart, { lang: ctx.lang, userName: ctx.name });
      const planetTableHtml = typeof window.VedicChartAnalyzer.renderMasterPlanetTable === "function"
        ? window.VedicChartAnalyzer.renderMasterPlanetTable(vd.chart, ctx.lang)
        : "";
      panchangHtml = typeof window.VedicChartAnalyzer.renderPanchangAndGocharaBox === "function"
        ? window.VedicChartAnalyzer.renderPanchangAndGocharaBox(vd.chart, ctx.lang)
        : "";
      extraTablesHtml = `
        ${planetTableHtml}
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
      ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].forEach(k => {
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
          ${ctx.lang === 'hi' ? 'आपके द्वारा चुने गए लग्न (D1), नक्षत्र और नवांश (D9) के आधार पर फलित।' : 'Parashari & Navamsa reading calibrated to your custom planetary inputs.'}
        </div>`;
      } else {
        calEl.innerHTML = buildRedBirthTimePrompt(ctx.lang);
      }
    }

    if (togEl) {
      togEl.classList.add("hidden");
    }
  }

  // Strictly hides Lagna/House-dependent chapters when in Date-of-Birth-Only mode
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

  // ==========================================================================
  // 12. HEADINGS, MASTHEAD, METRICS & SCROLLSPY CONTROLLER
  // ==========================================================================

  function updateChapterHeadingsAndNav(lang, ctx) {
    const isFull = ctx.chart.isFullChartMode;
    const cy = ctx.numData.currentYear;

    const labels = lang === "hi" ? {
      ch1Tag: "अध्याय 01 • उदय लग्न, चंद्र नक्षत्र एवं आत्मकारक",
      ch1Title: "लग्नेश, चंद्र राशि एवं जैमिनी आत्मकारक विश्लेषण",
      ch2Tag: "अध्याय 02 • मेधा, स्मरण शक्ति एवं पंचमेश सिद्धांत",
      ch2Title: "शिक्षा, बौद्धिक एकाग्रता एवं पंचम भाव विश्लेषण",
      ch3Tag: "अध्याय 03 • कर्म क्षेत्र, दशमेश एवं दशमांश (D10)",
      ch3Title: "करियर, दशमांश (D10) एवं अष्टकवर्ग कर्म-लाभ संतुलन",
      ch4Tag: "अध्याय 04 • अर्थ, धन योग एवं धनेश-लाभेश समीकरण",
      ch4Title: "द्वितीयेश-एकादशेश संबंध एवं सर्वाष्टकवर्ग कोष संतुलन",
      ch5Tag: "अध्याय 05 • भाग्येश एवं नवम धर्म भाव",
      ch5Title: "नवमेश की स्थिति एवं भाग्योदय के कारक",
      ch6Tag: "अध्याय 06 • शुक्र एवं चंद्र भावनात्मक समन्वय",
      ch6Title: "संबंधों में सामंजस्य एवं भावनात्मक प्रकृति",
      ch7Tag: "अध्याय 07 • सप्तम भाव, नवांश (D9), दाराकारक एवं मांगलिक विचार",
      ch7Title: "वैवाहिक साझेदारी, उपपद लग्न एवं कुज दोष परिहार",
      chBabyTag: "अध्याय 08 • पंचम अक्ष, संतान कारक गुरु एवं सप्तांश (D7)",
      chBabyTitle: "संतान योग एवं सप्तांश (D7) विश्लेषण",
      ch8Tag: isFull ? "अध्याय 09 • नवग्रह पाराशरी स्वामित्व एवं दृष्टियां" : "अध्याय 09 • जन्म-दिवस के नवग्रह (Noon Ephemeris)",
      ch8Title: isFull ? "सभी 9 ग्रहों का भाव-स्वामित्व, अवस्था एवं दृष्टि ज्यामिति" : "आपके जन्म-दिवस के सभी 9 ग्रहों की राशि एवं नक्षत्र स्थिति",
      ch9Tag: "अध्याय 10 • विशेष लग्न एवं 337-बिंदु अष्टकवर्ग",
      ch9Title: "चंद्र, सूर्य, नवांश, आरूढ़ लग्न एवं 337-बिंदु सर्वाष्टकवर्ग (BAV/SAV)",
      ch10Tag: `अध्याय 11 • सक्रिय विंशोत्तरी दशा एवं गोचर समय-सीमा (${cy}–${cy + 3})`,
      ch10Title: `वर्तमान महादशा-अंतर्दशा एवं प्रमुख क्षेत्रों का समय निर्धारण`,
      ch11Title: "कुंडली के प्रमुख तकनीकी संवेदनशील बिंदु एवं सात्विक वैदिक उपाय"
    } : {
      ch1Tag: "Chapter 01 • Rising Ascendant, Moon Nakshatra & Atmakaraka",
      ch1Title: "Lagna Lord, Lunar Mind & Jaimini Atmakaraka Synthesis",
      ch2Tag: "Chapter 02 • Intellect, Memory & 5th-Lord Synthesis",
      ch2Title: "Education, Analytical Focus & 5th-House Disposition",
      ch3Tag: "Chapter 03 • Karma, 10th-Lord & D10 Dasamsa",
      ch3Title: "Career Authority, D10 Dasamsa & Karma-Labha Balance",
      ch4Tag: "Chapter 04 • Artha, Dhana Yogas & Treasury Balance",
      ch4Title: "2nd & 11th Lords, Dhana Yogas & Savashtakavarga Ratio",
      ch5Tag: "Chapter 05 • Bhagya & 9th-House Dharma",
      ch5Title: "9th-Lord Fortune Disposition & Dharmic Support",
      ch6Tag: "Chapter 06 • Venus & Lunar Relational Harmony",
      ch6Title: "Emotional Chemistry & Relational Disposition",
      ch7Tag: "Chapter 07 • 7th House, D9 Navamsa, Darakaraka & Upapada",
      ch7Title: "Marriage Partnership, D9 Navamsa & Manglik Evaluation",
      chBabyTag: "Chapter 08 • 5th Axis, Putra-Karaka Jupiter & D7 Saptamsa",
      chBabyTitle: "Progeny Factors & D7 Saptamsa Analysis",
      ch8Tag: isFull ? "Chapter 09 • All 9 Planets: Lordship, Dignity & Aspects" : "Chapter 09 • Birth-Date Natal Planets (Noon Ephemeris)",
      ch8Title: isFull ? "Parashari Lordship Rules, Maturity Ages & Aspect Geometry" : "Sidereal Sign & Nakshatra Placements of All 9 Natal Planets",
      ch9Tag: "Chapter 10 • Special Lagnas & 337-Bindu Ashtakavarga",
      ch9Title: "Special Lagnas (Chandra, Surya, Navamsa, Arudha) + 337-Bindu SAV",
      ch10Tag: `Chapter 11 • Active Vimshottari Dasha & Double-Transit Windows (${cy}–${cy + 3})`,
      ch10Title: `Active Mahadasha-Antardasha & Domain Timing Analysis`,
      ch11Title: "Technical Chart Sensitivity Summary & Sattvic Vedic Remedies"
    };

    Object.keys(labels).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = labels[id];
    });

    const badgeEl = document.getElementById("dossierBadgeMode");
    const headerNameEl = document.getElementById("dossierHeaderName");
    const headerSubEl = document.getElementById("dossierHeaderSubtext");

    if (badgeEl) {
      badgeEl.innerHTML = ctx.chart.isExactAstronomyMode
        ? `<i class="fas fa-compass mr-1.5"></i> ${lang === "hi" ? "वैदिक जन्म कुंडली + षोडशवर्ग (D1/D9/D10/D7) डॉसियर" : "Vedic Birth Chart + Divisional Vargas (D1/D9/D10/D7) Dossier"}`
        : (ctx.chart.isFullChartMode
            ? `<i class="fas fa-compass mr-1.5"></i> ${lang === "hi" ? "पाराशरी वैदिक कुंडली + अष्टकवर्ग डॉसियर" : "Parashari + Jaimini + 337-SAV Dossier"}`
            : `<i class="fas fa-moon mr-1.5"></i> ${lang === "hi" ? "चंद्र-नक्षत्र जन्म-तिथि विश्लेषण (DOB-Only Mode)" : "Lunar & Nakshatra Date-of-Birth Reading (DOB-Only Mode)"}`);
    }

    if (headerNameEl) {
      headerNameEl.textContent = lang === "hi"
        ? `${ctx.name} की वैदिक जन्म कुंडली एवं जीवन विश्लेषण`
        : `${ctx.name}'s Vedic Birth Chart & Life Dossier`;
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
          ? `जन्म: <strong>${ctx.dob} (आयु ${ctx.numData.age})</strong> • लग्न: <strong>${ascName}</strong> • चंद्र: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • दशा: <strong>${dashaStrHi}</strong>`
          : `DOB: <strong>${ctx.dob} (Age ${ctx.numData.age})</strong> • Lagna: <strong>${ascName}</strong> • Moon: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • Dasha: <strong>${dashaStrEn}</strong>`;
      } else {
        headerSubEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob} (आयु ${ctx.numData.age})</strong> • चंद्र राशि: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • सूर्य राशि: <strong>${sunName}</strong>`
          : `DOB: <strong>${ctx.dob} (Age ${ctx.numData.age})</strong> • Moon Sign: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • Sun Sign: <strong>${sunName}</strong>`;
      }
    }

    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[ctx.chart.Asc.d1];
    const sav7 = ctx.specialLagnas.houseBindus[7];
    const sav10 = ctx.specialLagnas.houseBindus[10];
    const dashaLabel = (ctx.dasha && ctx.dasha.md && ctx.dasha.ad) ? `${ctx.dasha.md}-${ctx.dasha.ad}` : "Unverified (DOB-Only)";
    const waSummary = encodeURIComponent(
      `Namaste Gyanendra Ji 🙏\nI just read my Vedic Kundali Dossier on Jyotish Tark.\n` +
      `• Name: ${ctx.name} | DOB: ${ctx.dob}\n` +
      `• ${isFull ? `Lagna: ${RASHI_DATA[ctx.chart.Asc.d1].en}` : `Natal Sun: ${RASHI_DATA[ctx.chart.Sun.d1].en}`} | Moon: ${RASHI_DATA[ctx.chart.Moon.d1].en} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})\n` +
      `• ${isFull ? `Active Dasha: ${dashaLabel} | Badhakesh: ${lagnaMatrix.badhakesh} | SAV (7H:${sav7}, 10H:${sav10})` : `Mode: DOB-Only`}\n` +
      `I would like to book a ₹1101 Personal Kundali Consultation.`
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
    }, {passive: true});
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
      input.form-input:-webkit-autofill,
      input.form-input:-webkit-autofill:hover,
      input.form-input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px #0f172a inset !important;
        -webkit-text-fill-color: #fde68a !important;
        caret-color: #fde68a !important;
      }
      #lifeDossierForm .grid > div, #kundaliForm .grid > div, #masterDossierOutput .grid > div {
        min-width: 0 !important; max-width: 100% !important;
      }
      .chapter-card, .chapter-body {
        max-width: 100% !important; box-sizing: border-box !important;
        overflow-wrap: anywhere; word-break: break-word;
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================================================
  // 13. GLOBAL HELPERS & MASTER ENTRY POINT
  // ==========================================================================

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

      // 1. Compute Structured Facts via FindingsEngine
      const findings = (typeof window.FindingsEngine !== "undefined")
        ? window.FindingsEngine.analyzeFindings(chart, specialLagnas.houseBindus)
        : null;

      // 2. Resolve Dasha (Never fake birth fraction in DOB-only mode)
      const dasha = resolveActiveDasha(chart, numData);

      // 3. Compute Dasha + Double-Transit Timeline (Zero numerology seeds)
      const timeline = computeLifeEventTimeline(numData, chart, planetAnalysis, dasha, findings);

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

      const NR = window.NarrativeRules || {};

      setHtml("contentPersonality", buildChapter1Personality(ctx));
      if (chart.isFullChartMode) {
        setHtml("contentEducation",     buildChapter2Education(ctx));
        setHtml("contentCareer",        buildChapter3Career(ctx));
        setHtml("contentWealth",        buildChapter4Wealth(ctx));
        setHtml("contentPartner",       buildChapter7Partner(ctx));
        setHtml("contentChildbirth",    buildChapterChildbirth(ctx));
        setHtml("contentSpecialLagnas", typeof NR.renderChapter10SpecialLagnas === "function" ? NR.renderChapter10SpecialLagnas(ctx) : buildChapter9SpecialLagnas(ctx));
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
      setHtml("contentPlanetsAspects", typeof NR.renderChapter9Planets === "function" ? NR.renderChapter9Planets(ctx) : buildChapter8PlanetsAndAspects(ctx));
      setHtml("contentTimePhase",      typeof NR.renderChapter11Timing === "function" ? NR.renderChapter11Timing(ctx) : buildChapter10TimePhase(ctx));

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
