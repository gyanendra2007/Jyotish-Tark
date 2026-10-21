/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js • v8.0 (99% Parashari Synthesis + Post-Planet Yearly Engine)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * UPGRADED IN v8.0:
 * - Authentic Parashari Bhava-Lord-in-Bhava synthesis across Career, Wealth,
 *   Marriage, Childbirth, and All 9 Planetary Verdicts.
 * - Removed scattered yearly dates from middle chapters (Chapters 2, 3, 4, 7, 8)
 *   and consolidated the entire Year-by-Year Master Forecast + "Golden Opportunity
 *   vs. Planetary Sabotage" Fear Alerts into Chapter 11 (AFTER In-Depth Planets).
 * - Integrated Royal North Indian D1 & D9 SVG charts + Panchang & 2026 Sade-Sati.
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

  const LAGNA_FUNCTIONAL_MATRIX = {
    1: {
      yogakaraka: ["Sun", "Jupiter"], benefics: ["Sun", "Moon", "Mars", "Jupiter"],
      malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Venus", "Saturn"],
      badhakaHouse: 11, badhakesh: "Saturn",
      secretWeaknessEn: "impulsive trust, sudden bursts of righteous anger that fade within minutes, and fighting everyone else's battles while hiding your own exhaustion",
      secretWeaknessHi: "आवेग में आकर भरोसा करना, क्षणिक क्रोध जिसके बाद आपको स्वयं ग्लानि होती है, और अपनी थकान छिपाकर दूसरों की जिम्मेदारियां अपने सिर ले लेना"
    },
    2: {
      yogakaraka: ["Saturn"], benefics: ["Saturn", "Mercury", "Venus", "Sun"],
      malefics: ["Jupiter", "Moon", "Mars"], marakas: ["Mars", "Jupiter"],
      badhakaHouse: 9, badhakesh: "Saturn",
      secretWeaknessEn: "silent stubbornness, holding onto past emotional wounds for years without speaking, and sacrificing personal desires to keep family stability intact",
      secretWeaknessHi: "भीतर ही भीतर पुरानी बातों को वर्षों तक दबाए रखना, जिद्दी स्वाभिमान और परिवार की स्थिरता के लिए अपनी इच्छाओं का चुपचाप त्याग करना"
    },
    3: {
      yogakaraka: ["Venus"], benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Sun"], marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "two parallel tracks of thought running 24/7 in your head, late-night mental replay of conversations, and feeling intellectually lonely even in a room full of people",
      secretWeaknessHi: "दिमाग में 24 घंटे दो समानांतर विचारों का चलना, रात्रि में अत्यधिक ओवरथिंकिंग और भीड़ में भी अपने बौद्धिक स्तर का साथी न मिल पाने का एकाकीपन"
    },
    4: {
      yogakaraka: ["Mars"], benefics: ["Mars", "Jupiter", "Moon"],
      malefics: ["Venus", "Mercury", "Saturn"], marakas: ["Saturn", "Mercury"],
      badhakaHouse: 11, badhakesh: "Venus",
      secretWeaknessEn: "absorbing the emotional stress of people around you like a sponge, giving 100% loyalty to those who return 30%, and silent internal mood tides",
      secretWeaknessHi: "दूसरों के दुख और तनाव को अपने भीतर सोख लेना, उन लोगों को 100% वफादारी देना जो बदले में 30% भी नहीं लौटाते, और अचानक मन का उदास हो जाना"
    },
    5: {
      yogakaraka: ["Mars"], benefics: ["Mars", "Sun", "Jupiter"],
      malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Saturn", "Venus"],
      badhakaHouse: 9, badhakesh: "Mars",
      secretWeaknessEn: "fierce royal pride that refuses to ask for help even when bleeding internally, and feeling taken for granted by the very people you shelter",
      secretWeaknessHi: "अटूट राजसी स्वाभिमान जिसके कारण आप टूटने पर भी किसी से मदद नहीं मांगते, और जिन लोगों की आप रक्षा करते हैं उन्हीं से अपेक्षित सम्मान न मिलना"
    },
    6: {
      yogakaraka: ["Venus", "Mercury"], benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Moon"], marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "hyper-critical perfectionism, spotting micro-flaws that others miss, gut/nervous tension when plans go off-script, and acting as the unpaid fixer in relationships",
      secretWeaknessHi: "हर काम में पूर्णता (perfection) खोजने की आदत, सूक्ष्म से सूक्ष्म गलती को तुरंत पकड़ लेना, और रिश्तों में हमेशा दूसरों की समस्याएं सुलझाते रहना"
    },
    7: {
      yogakaraka: ["Saturn"], benefics: ["Saturn", "Mercury", "Venus"],
      malefics: ["Sun", "Mars", "Jupiter"], marakas: ["Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Sun",
      secretWeaknessEn: "swallowing your own hurt to preserve surface harmony until you suddenly detach forever, and second-guessing yourself at major life crossroads",
      secretWeaknessHi: "शांति बनाए रखने के लिए अपनी भावनाओं को दबाना—और जब सहनशक्ति की सीमा समाप्त हो जाए तो बिना शोर किए पूरी तरह तटस्थ (detach) हो जाना"
    },
    8: {
      yogakaraka: ["Moon", "Jupiter"], benefics: ["Sun", "Moon", "Jupiter", "Mars"],
      malefics: ["Mercury", "Venus", "Saturn"], marakas: ["Mercury", "Venus"],
      badhakaHouse: 9, badhakesh: "Moon",
      secretWeaknessEn: "living in 'all-or-nothing' extremes, radar-like suspicion born from past betrayals, and locking your deepest emotional scars inside an unbreakable vault",
      secretWeaknessHi: "'आर या पार' के चरम पर जीना, पूर्व में मिले विश्वासघात के कारण किसी पर आसानी से भरोसा न कर पाना और अपने गहरे घाव किसी को न दिखाना"
    },
    9: {
      yogakaraka: ["Sun", "Mars"], benefics: ["Sun", "Mars", "Jupiter"],
      malefics: ["Venus", "Saturn", "Mercury"], marakas: ["Venus", "Saturn"],
      badhakaHouse: 7, badhakesh: "Mercury",
      secretWeaknessEn: "blunt truth-speaking that unintentionally offends diplomatic people, secret restlessness that you haven't hit your true ceiling yet, and guiding people who don't value your wisdom",
      secretWeaknessHi: "बिना लाग-लपेट के सच बोल देना जिससे स्वार्थी लोग दूरी बना लेते हैं, और भीतर ही भीतर यह बेचैनी कि आप अभी अपने असली मुकाम तक नहीं पहुंचे हैं"
    },
    10: {
      yogakaraka: ["Venus"], benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Moon"], marakas: ["Moon", "Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Mars",
      secretWeaknessEn: "growing up too early emotionally, carrying a quiet fear of failure behind a stoic face, and feeling that everyone leans on your shoulder while you have no one to lean on",
      secretWeaknessHi: "उम्र से पहले जिम्मेदार हो जाना, चट्टान जैसे चेहरे के पीछे असफलता का अनकहा डर और यह एहसास कि सब आप पर टिके हैं पर आपके कंधे को सहारा देने वाला कोई नहीं"
    },
    11: {
      yogakaraka: ["Venus"], benefics: ["Venus", "Sun", "Mars", "Saturn"],
      malefics: ["Jupiter", "Moon", "Mercury"], marakas: ["Jupiter", "Moon"],
      badhakaHouse: 9, badhakesh: "Venus",
      secretWeaknessEn: "deep inner detachment even while smiling in social gatherings, irregular sleep from a brain that lives five years in the future, and clashing with egoistic partners",
      secretWeaknessHi: "समाज में सबके साथ घुलने-मिलने के बावजूद भीतर से गहरा वैराग्य, रात्रि में अति-सक्रिय मस्तिष्क के कारण नींद में खलल और स्वाभिमानी जीवनसाथी से वैचारिक टकराव"
    },
    12: {
      yogakaraka: ["Mars", "Moon"], benefics: ["Moon", "Mars", "Jupiter"],
      malefics: ["Sun", "Venus", "Saturn", "Mercury"], marakas: ["Mercury", "Venus", "Saturn"],
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

  function computeLifeEventTimeline(numData, chart, planetAnalysis) {
    const cy = numData.currentYear;
    const age = numData.age;
    const by = numData.year;
    const m = numData.mulank;
    const b = numData.bhagyank;

    const pastOffset = 2 + ((m + b) % 3);
    const pastYearStart = cy - pastOffset;
    const pastYearEnd   = pastYearStart + 1;
    const pastAgeStart  = Math.max(10, age - pastOffset);
    const pastAgeEnd    = pastAgeStart + 1;

    const cOffset1 = ((10 - numData.personalYear + m) % 2);
    const careerWin1Start = cy + cOffset1;
    const careerWin1End   = careerWin1Start + 1;
    const careerWin2Start = careerWin1End + 2;
    const careerWin2End   = careerWin2Start + 1;

    const rahuBhava = planetAnalysis.Rahu.bhava;
    const lossOffset = ((rahuBhava + b) % 2) + 1;
    const cautionYear1 = cy + (lossOffset === 1 ? 0 : 1);
    const cautionYear2 = cautionYear1 + 2;

    const baseMarriageAge = Math.max(21, age < 21 ? 22 + (b % 3) : age + ((m + b) % 2));
    const marYear1Start = by + baseMarriageAge;
    const marYear1End   = marYear1Start + 1;
    const marYear2Start = marYear1End + 2;
    const marYear2End   = marYear2Start + 1;

    const baseBabyYear = Math.max(cy + 1, marYear1Start + 1);
    const babyWin1 = `${baseBabyYear}–${baseBabyYear + 1}`;
    const babyWin2 = `${baseBabyYear + 3}–${baseBabyYear + 4}`;

    return {
      pastYearRange: `${pastYearStart}–${pastYearEnd}`,
      pastAgeRange: `${pastAgeStart}–${pastAgeEnd}`,
      careerWindow1: `${careerWin1Start}–${careerWin1End} (Age ${ careerWin1Start - by }–${ careerWin1End - by })`,
      careerWindow2: `${careerWin2Start}–${careerWin2End} (Age ${ careerWin2Start - by }–${ careerWin2End - by })`,
      cautionWindow: `${cautionYear1} (Late Q3/Q4) & ${cautionYear2}`,
      marriageWindow1: `${marYear1Start}–${marYear1End} (Age ${baseMarriageAge}–${baseMarriageAge + 1})`,
      marriageWindow2: `${marYear2Start}–${marYear2End} (Age ${baseMarriageAge + 3}–${baseMarriageAge + 4})`,
      babyWindow1: babyWin1,
      babyWindow2: babyWin2
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

    const ascRashi  = sunRashi;
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
      Asc:     {d1:ascRashi,  nak:sunNak,  d9:makeD9(ascRashi, sunNak, 1),   retro:false, isSuryaLagnaAnchor:true},
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
    if (window.__jtVedicData && window.__jtVedicData.chart) {
      const vd = window.__jtVedicData;
      const converted = { isFullChartMode: true, isExactAstronomyMode: true, isDobOnlyRealAstronomy: false };
      ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].forEach(k => {
        converted[k] = {
          d1: vd.chart[k].rashi,
          nak: vd.chart[k].nakshatra,
          d9: vd.chart[k].d9,
          retro: Boolean(vd.chart[k].retro),
          formattedDeg: vd.chart[k].formattedDeg || ""
        };
      });
      return converted;
    }

    const manualMatrixOpen = document.getElementById("enableChartToggle") && document.getElementById("enableChartToggle").checked;
    if (manualMatrixOpen) {
      const keys = ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
      const chart = { isFullChartMode: true, isExactAstronomyMode: false, isDobOnlyRealAstronomy: false };
      keys.forEach(k => {
        const d1  = parseInt(document.getElementById(`d1_${k}`)?.value, 10) || 1;
        const nak = parseInt(document.getElementById(`nak_${k}`)?.value, 10) || 1;
        const d9  = parseInt(document.getElementById(`d9_${k}`)?.value, 10) || 1;
        const retroEl = document.getElementById(`retro_${k}`);
        const retro = (k === "Rahu" || k === "Ketu") ? true : (retroEl ? retroEl.checked : false);
        chart[k] = { d1, nak, d9, retro };
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
      statusEn = "D9-Fortified (Matures Strongly After Age 28)";
      statusHi = "नवांश-बली (28 वर्ष के बाद विशेष फलदायी)";
      badgeClass = "bg-cyan-500/25 text-cyan-200 border-cyan-400/50";
    } else if (isDebilitatedD9) {
      statusEn = "D9-Sensitive (Requires Remedy for Long-Term Fruit)";
      statusHi = "नवांश-संवेदनशील (स्थायी फल हेतु उपाय आवश्यक)";
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

    const charaCandidates = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    let atmakarakaKey = "Sun";
    let maxAdvancementScore = -1;
    charaCandidates.forEach(pKey => {
      const p = chart[pKey];
      const validNaks = VALID_NAKS_FOR_RASHI[p.d1] || [1,2,3];
      const nakIndexInRashi = Math.max(0, validNaks.indexOf(p.nak));
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
  // 7. VIMSHOTTARI MAHADASHA & ANTARDASHA RESOLVER
  // ==========================================================================

  function resolveActiveDasha(chart, numData) {
    if (window.__jtVedicData && window.__jtVedicData.dasha) {
      const vdDasha = window.__jtVedicData.dasha;
      const moonNakId = chart.Moon.nak || 1;
      return {
        md: vdDasha.mahadasha,
        ad: vdDasha.antardasha,
        mdActive: vdDasha.mdActive,
        adActive: vdDasha.adActive,
        nextAD: vdDasha.nextAD,
        prevAD: vdDasha.prevAD,
        isExactCalendarDasha: true,
        isManualDasha: false,
        birthDashaRuler: NAKSHATRA_DATA[moonNakId].ruler
      };
    }

    const manualOn = document.getElementById("enableDashaToggle") && document.getElementById("enableDashaToggle").checked;
    const mdSelect = document.getElementById("currentMD")?.value || "auto";
    const adSelect = document.getElementById("currentAD")?.value || "auto";

    const moonRashi = chart.Moon.d1 || 1;
    const moonNakId = chart.Moon.nak || 1;
    const birthDashaRuler = NAKSHATRA_DATA[moonNakId].ruler;
    const startIdx = VIMSHOTTARI_ORDER.findIndex(v => v.lord === birthDashaRuler);

    const rashiNaks = VALID_NAKS_FOR_RASHI[moonRashi] || [moonNakId];
    const posInRashi = rashiNaks.indexOf(moonNakId);
    let birthFractionRemaining = 0.55;
    if (posInRashi === 0 && rashiNaks.length === 3) {
      birthFractionRemaining = 0.68 - ((numData.day % 5) * 0.06);
    } else if (posInRashi === 1) {
      birthFractionRemaining = 0.82 - ((numData.day % 7) * 0.09);
    } else if (posInRashi === 2) {
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

    return { md:finalMD, ad:finalAD, nextMD, isManualDasha, isExactCalendarDasha: false, birthDashaRuler };
  }

  // ==========================================================================
  // 8. NARRATIVE HELPER UTILITIES & RED 99.99% ALERT GENERATOR
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
        bt.style.boxShadow = "0 0 0 4px rgba(239, 68, 68, 0.75)";
        setTimeout(() => { bt.style.boxShadow = ""; }, 3000);
      }, 450);
    }
  };

  function buildRedBirthTimePrompt(lang) {
    if (lang === "hi") {
      return `
        <div class="p-3.5 rounded-xl bg-red-950/90 border-2 border-red-500/80 text-xs md:text-sm text-red-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div>
            <strong class="text-red-300"><i class="fas fa-exclamation-circle mr-1.5"></i>महत्वपूर्ण लाल सूचना (केवल जन्म-तिथि मोड):</strong>
            आपने अभी केवल जन्म-तिथि भरी है। यदि आपको अपना <strong>जन्म समय और स्थान (शहर)</strong> भी पता है, तो उसे ऊपर फॉर्म में भरें—जिससे हम आपकी लग्न कुंडली (D1), नवांश (D9) और महादशा के साथ <strong>99.99% सटीक भविष्यवाणी</strong> दे सकें!
          </div>
          <button type="button" onclick="window.focusBirthTimeInput()" class="shrink-0 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg">
            + जन्म समय और स्थान जोड़ें (99.99% सटीक) ↑
          </button>
        </div>
      `;
    }
    return `
      <div class="p-3.5 rounded-xl bg-red-950/90 border-2 border-red-500/80 text-xs md:text-sm text-red-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <strong class="text-red-300"><i class="fas fa-exclamation-circle mr-1.5"></i>IMPORTANT RED NOTICE (Date-of-Birth Only Mode):</strong>
          You generated this reading with only your Date of Birth. If you also know your <strong>Birth Time & Place (City)</strong>, enter them above so we can unlock your <strong>99.99% Accurate Lagna Chart (D1), Navamsa (D9) & Exact Mahadasha Dates!</strong>
        </div>
        <button type="button" onclick="window.focusBirthTimeInput()" class="shrink-0 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg">
          + Add Birth Time & City (99.99% Accuracy) ↑
        </button>
      </div>
    `;
  }

  // ==========================================================================
  // 9. CHAPTER GENERATORS (CHAPTERS 1 TO 8: PURE PARASHARI & NUMEROLOGY DEPTH,
  //    NO SCATTERED YEARLY PREDICTIONS IN THE MIDDLE!)
  // ==========================================================================

  function buildChapter1Personality(ctx) {
    const { lang, name, numData, chaldean, chart, timeline } = ctx;
    const isFull = chart.isFullChartMode;
    const ascRashi     = RASHI_DATA[chart.Asc.d1];
    const moonRashi    = RASHI_DATA[chart.Moon.d1];
    const sunRashi     = RASHI_DATA[chart.Sun.d1];
    const moonNak      = NAKSHATRA_DATA[chart.Moon.nak];
    const mulankArch   = MULANK_ARCHETYPES[numData.mulank];
    const bhagyankArch = MULANK_ARCHETYPES[numData.bhagyank];
    const lagnaMatrix  = LAGNA_FUNCTIONAL_MATRIX[chart.Asc.d1];

    const primaryAnchorLabelEn = isFull ? `${ascRashi.en} Lagna` : `${sunRashi.en} Natal Sun`;
    const primaryAnchorLabelHi = isFull ? `${ascRashi.hi} लग्न` : `${sunRashi.hi} जन्म-सूर्य`;

    const openingHook = pickUniqueVariant("ch1Opening", DYNAMIC_HOOK_BANKS.ch1Opening, ctx);
    const radarBox    = pickUniqueVariant("ch1RadarBox", DYNAMIC_HOOK_BANKS.ch1RadarBox, ctx);

    const sigRow = (labelEn, labelHi, value) => `
      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-white/10 min-w-0 break-words">
        <div class="text-[10px] uppercase text-gray-400 font-bold truncate">${lang === "hi" ? labelHi : labelEn}</div>
        <div class="text-xs sm:text-sm font-bold text-amber-200 mt-0.5 break-words">${value}</div>
      </div>
    `;

    const signatureCard = `
      <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-3.5 sm:p-5 mb-5 max-w-full overflow-hidden">
        <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2.5 break-words">
          <i class="fas fa-fingerprint mr-1.5"></i>${lang === "hi" ? "आपका जन्म-चिह्न (वैदिक एवं चैल्डियन सिंथेसिस)" : "Your Master Birth Signature (Vedic & Chaldean Synthesis)"}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${sigRow(isFull ? "Ascendant (Lagna)" : "Surya Kundali Base", isFull ? "जन्म लग्न (Udaya Lagna)" : "सूर्य लग्न आधार", `${lang === "hi" ? ascRashi.hi : ascRashi.en} <span class="text-gray-400 text-xs">(${ascRashi.lordHi})</span>`)}
          ${sigRow("Moon Rashi", "चंद्र राशि", `${lang === "hi" ? moonRashi.hi : moonRashi.en}`)}
          ${sigRow("Janma Nakshatra", "जन्म नक्षत्र", `${moonNak.name} <span class="text-gray-400 text-xs">(${moonNak.ruler})</span>`)}
          ${sigRow("Sun Rashi", "सूर्य राशि", `${lang === "hi" ? sunRashi.hi : sunRashi.en} ${chart.Sun.formattedDeg || ""}`)}
          ${sigRow("Psychic (Mulank)", "मूलांक (Psychic)", `${numData.mulank} — ${mulankArch.ruler}`)}
          ${sigRow("Destiny (Bhagyank)", "भाग्यांक (Destiny)", `${numData.bhagyank} — ${bhagyankArch.ruler}`)}
          ${sigRow("Chaldean Name", "चैल्डियन नाम अंक", `${chaldean.compound} → ${chaldean.single}`)}
          ${sigRow("Current Age / PY", "वर्तमान आयु / PY", `${numData.age} Yrs / PY-${numData.personalYear}`)}
        </div>
      </div>
    `;

    if (lang === "hi") {
      return signatureCard + `
        <p>${openingHook.hi(name, primaryAnchorLabelHi, moonRashi.hi)}</p>

        <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/40 mb-4 text-sm">
          <strong class="text-amber-300"><i class="fas fa-history mr-1.5"></i>अतीत का सत्यापन (आयु ${timeline.pastAgeRange} वर्ष के आसपास):</strong>
          आपकी ग्रह-गणना के अनुसार आपकी आयु के <strong>${timeline.pastAgeRange}वें वर्ष</strong> के बीच आपके जीवन में एक ऐसी घटना घटी जिसने लोगों पर भरोसा करने का आपका नजरिया हमेशा के लिए बदल दिया—किसी करीबी मित्र/रिश्तेदार का असली चेहरा सामने आया या करियर/पढ़ाई की दिशा में अचानक बदलाव का दबाव बना, जिसने आपको भीतर से समय से पहले परिपक्व कर दिया।
        </div>

        <p>
          <strong>1. आपका अनकहा मानसिक सच (मूलांक ${numData.mulank} + भाग्यांक ${numData.bhagyank}):</strong> ${mulankArch.psychHi} इसके साथ ही आपमें <em>${lagnaMatrix.secretWeaknessHi}</em> की प्रवृत्ति गहराई से जुड़ी है। आप अपनी थकान और पीड़ा को दुनिया से छिपाकर मुस्कुराने की कला जानते हैं।
        </p>

        <p>
          <strong>2. नाम स्पंदन ("${name}" = ${chaldean.compound} → ${chaldean.single}) एवं एकांत का अंतर्मन:</strong> एकांत में आपका मन <strong>${moonNak.name} नक्षत्र (${moonRashi.hi})</strong> से चलता है, जो आपको <em>${moonNak.traitHi}</em> देता है। ${
            chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
              ? `आपके नाम का चैल्डियन अंक (${chaldean.single}) आपके मूलांक/भाग्यांक से सीधा तालमेल बिठाता है, जो संकट के अंतिम क्षण में अदृश्य रक्षा कवच देता है।`
              : `<strong class="text-rose-300">नाम-स्पंदन असंतुलन (Name Vibration Alert):</strong> आपकी जन्म-ऊर्जा अंक ${numData.mulank} और ${numData.bhagyank} है, पर आपके प्रचलित नाम का चैल्डियन अंक ${chaldean.single} होने से कई बार आपकी 100% ईमानदारी और मेहनत का श्रेय दूसरों को मिल जाता है।`
          }
        </p>

        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4 break-words">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> ${radarBox.titleHi}</div>
          <p class="text-sm mb-0">${radarBox.hi}</p>
        </div>
        ${!isFull ? buildRedBirthTimePrompt("hi") : ""}
      `;
    }

    return signatureCard + `
      <p>${openingHook.en(name, primaryAnchorLabelEn, moonRashi.en)}</p>

      <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/40 mb-4 text-sm">
        <strong class="text-amber-300"><i class="fas fa-history mr-1.5"></i>Past-Life Event Verification (Around Age ${timeline.pastAgeRange}):</strong>
        According to your planetary progression, around <strong>age ${timeline.pastAgeRange}</strong> you went through a sharp emotional or directional wake-up call—watching someone you trusted reveal their opportunistic side or facing a sudden shift in your study/career focus that forced you to mature overnight.
      </div>

      <p>
        <strong>1. Your Unspoken Psychological Wiring (Mulank ${numData.mulank} + Bhagyank ${numData.bhagyank}):</strong> ${mulankArch.psychEn} Layered onto this is a lifelong tendency toward <em>${lagnaMatrix.secretWeaknessEn}</em>. Even under heavy personal pressure, you refuse to look weak in front of others.
      </p>

      <p>
        <strong>2. Name Vibration ("${name}" = ${chaldean.compound} → ${chaldean.single}) & Subconscious Mind:</strong> Privately, your mind runs on <strong>${moonRashi.en} under ${moonNak.name}</strong>, gifting you <em>${moonNak.traitEn}</em>. ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? `Your name's root vibration (${chaldean.single}) locks directly into harmony with your birth numbers—acting as an eleventh-hour protective shield.`
            : `<strong class="text-rose-300">Chaldean Name Vibration Mismatch:</strong> Because your birth blueprint runs on ${numData.mulank} and ${numData.bhagyank} while your daily name broadcasts vibration ${chaldean.single}, you often do 95% of the heavy lifting while recognition gets delayed.`
        }
      </p>

      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4 break-words">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> ${radarBox.titleEn}</div>
        <p class="text-sm mb-0">${radarBox.en}</p>
      </div>
      ${!isFull ? buildRedBirthTimePrompt("en") : ""}
    `;
  }

  function buildChapter2Education(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5Key = rashi5.lord;
    const lord5  = planetAnalysis[lord5Key];
    const merc   = planetAnalysis.Mercury;
    const jup    = planetAnalysis.Jupiter;
    const mercNak= NAKSHATRA_DATA[merc.nak];
    const bindu5 = specialLagnas.houseBindus[5];
    const studyVariant = pickUniqueVariant("ch2StudyPattern", DYNAMIC_HOOK_BANKS.ch2StudyPattern, ctx);

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
          <div class="p-3 rounded-xl bg-slate-950/85 border border-blue-400/30">
            <span class="text-blue-300 font-bold block">बुद्धि कारक बुध (Mercury)</span>
            <strong class="text-white text-sm">${RASHI_DATA[merc.d1].hi} • ${mercNak.name}</strong>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/85 border border-amber-400/30">
            <span class="text-amber-300 font-bold block">ज्ञान कारक गुरु (Jupiter)</span>
            <strong class="text-white text-sm">${RASHI_DATA[jup.d1].hi} (${jup.dignity.statusHi})</strong>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/85 border border-emerald-400/30">
            <span class="text-emerald-300 font-bold block">पंचमेश (${rashi5.lordHi}) एवं मेधा बिंदु</span>
            <strong class="text-white text-sm">${lord5.bhava}वें भाव में • ${bindu5} SAV बिंदु</strong>
          </div>
        </div>

        <p><strong>1. आपका वास्तविक लर्निंग और फोकस पैटर्न:</strong> ${studyVariant.hi}</p>

        <p>
          <strong>2. पाराशरी पंचमेश सिद्धांत एवं डिग्री बनाम वास्तविक करियर क्षेत्र:</strong> आपकी कुंडली में पंचमेश <strong>${rashi5.lordHi}</strong> ${lord5.bhava}वें भाव में बैठकर आपके बौद्धिक विकास को सीधे <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[lord5.bhava]}"</em> से जोड़ते हैं। आपके बुध (${RASHI_DATA[merc.d1].hi}) और गुरु (${RASHI_DATA[jup.d1].hi}) का समीकरण यह स्पष्ट करता है कि आपने जिस विषय में अपनी औपचारिक डिग्री ली है, वास्तविक जीवन में आपकी सबसे बड़ी कमाई और पहचान आपके <strong>स्व-अर्जित व्यावहारिक कौशल (Practical Mastery)</strong> से बनेगी। ${
            merc.retro || jup.retro
              ? "आपकी कुंडली में वक्री प्रभाव होने से पढ़ाई या प्रतियोगी परीक्षा में कम से कम एक बार अंतिम क्षण की घबराहट या भटकाव से रैंक/परिणाम प्रभावित होने का योग बना है।"
              : "आपकी तार्किक पकड़ इतनी मजबूत है कि कठिन विषयों का व्यावहारिक निचोड़ आप तुरंत निकाल लेते हैं।"
          }
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 min-w-0 break-words">
            <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> सर्वश्रेष्ठ बौद्धिक एवं अध्ययन क्षेत्र:</div>
            <p class="text-xs md:text-sm mb-0">टेक्नोलॉजी/आईटी, प्रशासनिक व प्रतियोगी सेवाएं, फाइनेंस/कॉमर्स, चिकित्सा व निदान विज्ञान, कानून और रणनीतिक मैनेजमेंट।</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
            <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> एकाग्रता लॉक करने का वैदिक सूत्र:</div>
            <p class="text-xs md:text-sm mb-0">पढ़ते या काम करते समय अपना मुख <strong>${rashi5.directionHi}</strong> की ओर रखें और फोन को दूसरे कमरे में रखकर 45 मिनट के लिखित स्प्रिंट में अभ्यास करें।</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
        <div class="p-3 rounded-xl bg-slate-950/85 border border-blue-400/30">
          <span class="text-blue-300 font-bold block">Intellect Karaka Mercury</span>
          <strong class="text-white text-sm">${RASHI_DATA[merc.d1].en} • ${mercNak.name}</strong>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/85 border border-amber-400/30">
          <span class="text-amber-300 font-bold block">Wisdom Karaka Jupiter</span>
          <strong class="text-white text-sm">${RASHI_DATA[jup.d1].en} (${jup.dignity.statusEn})</strong>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/85 border border-emerald-400/30">
          <span class="text-emerald-300 font-bold block">5th Lord (${rashi5.lord}) & SAV Strength</span>
          <strong class="text-white text-sm">In House ${lord5.bhava} • ${bindu5} Bindus</strong>
        </div>
      </div>

      <p><strong>1. Your True Cognitive & Study Pattern:</strong> ${studyVariant.en}</p>

      <p>
        <strong>2. Parashari 5th-Lord Synthesis & Formal Degree vs. Real Mastery:</strong> With your 5th-lord <strong>${rashi5.lord}</strong> seated in House ${lord5.bhava}, your intellect channels directly into <em>${BHAVA_IN_BHAVA_EFFECTS_EN[lord5.bhava]}</em>. The interplay between your <strong>Mercury in ${RASHI_DATA[merc.d1].en}</strong> and <strong>Jupiter in ${RASHI_DATA[jup.d1].en}</strong> shows that over 70% of your lifelong financial success will come from specialized practical skills outside your textbook syllabus.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 min-w-0 break-words">
          <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> Highest-Yield Intellectual Domains:</div>
          <p class="text-xs md:text-sm mb-0">Engineering/IT architecture, administrative & civil services, finance/chartered analytics, medical & clinical diagnostics, law, and strategic management.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> Vedic Brainpower Optimization:</div>
          <p class="text-xs md:text-sm mb-0">Face <strong>${rashi5.direction}</strong> during study or deep work. Studying in 45-minute written-recall sprints locks your Mercury (${mercNak.name}) focus without mental drift.</p>
        </div>
      </div>
    `;
  }

  function buildChapter3Career(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const isFull = chart.isFullChartMode;
    const asc = chart.Asc.d1;
    const rashi10 = RASHI_DATA[getRashiOfBhava(asc, 10)];
    const lord10Key = rashi10.lord;
    const lord10 = planetAnalysis[lord10Key];
    const sat = planetAnalysis.Saturn;
    const sun = planetAnalysis.Sun;
    const bindu10 = specialLagnas.houseBindus[10];
    const bindu6  = specialLagnas.houseBindus[6];
    const bindu11 = specialLagnas.houseBindus[11];

    const lord1Key = RASHI_DATA[asc].lord;
    const maturitySet = Array.from(new Set([
      ...(PLANET_MATURITY_AGES[lord10Key] || [26, 30, 34]),
      (PLANET_MATURITY_AGES[lord1Key] || [28])[0]
    ])).sort((a, b) => a - b);

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
          <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40">
            <span class="text-emerald-300 font-bold uppercase block">दशमेश (${rashi10.lordHi}) की भाव स्थिति</span>
            <strong class="text-base text-white">${lord10.bhava}वें भाव में (${RASHI_DATA[lord10.d1].hi})</strong>
          </div>
          <div class="p-3.5 rounded-xl bg-amber-950/50 border border-amber-400/40">
            <span class="text-amber-300 font-bold uppercase block">कर्म बनाम लाभ अष्टकवर्ग</span>
            <strong class="text-base text-white">दशम: ${bindu10} • सेवा: ${bindu6} • लाभ: ${bindu11} बिंदु</strong>
          </div>
          <div class="p-3.5 rounded-xl bg-purple-950/50 border border-purple-400/40">
            <span class="text-purple-300 font-bold uppercase block">ग्रह परिपक्वता आयु (Peak Ages)</span>
            <strong class="text-base text-white">आयु ${maturitySet.join(", ")} वर्ष</strong>
          </div>
        </div>

        <p>
          <strong>1. पाराशरी दशमेश सिद्धांत एवं नौकरी बनाम स्वतंत्र अधिकार:</strong> आपकी कुंडली में दशम भाव (${rashi10.hi}) के स्वामी <strong>${rashi10.lordHi}</strong> स्वयं <strong>${lord10.bhava}वें भाव (${RASHI_DATA[lord10.d1].hi})</strong> में स्थित हैं—जिसका पाराशरी फल है: <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[lord10.bhava]}"</em>। आपके कर्म-कारक <strong>शनि (${RASHI_DATA[sat.d1].hi})</strong> और सत्ता-कारक <strong>सूर्य (${RASHI_DATA[sun.d1].hi})</strong> यह स्पष्ट करते हैं कि आप किसी कम योग्य व्यक्ति के नीचे दबकर 'जी-हुजूरी' करने के लिए नहीं बने हैं। ${
            isFull
              ? `सर्वाष्टकवर्ग में आपके दशम भाव को <strong>${bindu10} बिंदु</strong>, षष्ठ भाव (सेवा) को <strong>${bindu6} बिंदु</strong> और लाभ भाव को <strong>${bindu11} बिंदु</strong> मिले हैं। ${bindu10 > bindu11 ? "दशम के बिंदु लाभ से अधिक होने के कारण अभी आप जिम्मेदारी ज्यादा उठा रहे हैं और उसका पूरा आर्थिक प्रतिफल रुक-रुक कर मिल रहा है।" : "लाभ भाव का मजबूत समर्थन आपकी मेहनत को सीधे बड़े धन में बदलने का सामर्थ्य रखता है।"}`
              : "जहाँ आपको निर्णय लेने की स्वतंत्रता (Autonomy) मिलती है, वहाँ आप 10 गुना परिणाम देते हैं।"
          }
        </p>

        <p>
          <strong>2. कार्यक्षेत्र की गुप्त राजनीति एवं स्थान-परिवर्तन योग:</strong> जब भी आप कार्यक्षेत्र में आवश्यकता से अधिक सरल बनते हैं, सहकर्मी या वरिष्ठ आपके विचारों और मेहनत का श्रेय स्वयं लेने का प्रयास करते हैं। जन्मस्थान से दूर, मल्टी-सिटी नेटवर्क या स्वतंत्र कमान वाले पद पर जुड़ने से आपकी तरक्की दोगुनी तेज होती है। <em>(नोट: आपके करियर उछाल के सटीक वर्षों एवं ग्रह-बाधा का विस्तृत विवरण नीचे <strong>अध्याय 11</strong> में दिया गया है।)</em>
        </p>

        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4 break-words">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> आपके लिए सर्वाधिक फलदायी करियर क्षेत्र:</div>
          <p class="text-xs md:text-sm mb-0">
            उच्च प्रशासनिक/सरकारी सेवा, टेक्नोलॉजी व सिस्टम आर्किटेक्चर, बैंकिंग व वित्तीय प्रबंधन, चिकित्सा/हेल्थकेयर, स्वतंत्र कंसल्टेंसी, न्यायिक क्षेत्र या अपना स्वयं का उद्यम (Independent Enterprise)।
          </p>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40">
          <span class="text-emerald-300 font-bold uppercase block">10th Lord (${lord10Key}) Placement</span>
          <strong class="text-base text-white">House ${lord10.bhava} (${RASHI_DATA[lord10.d1].en})</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-amber-950/50 border border-amber-400/40">
          <span class="text-amber-300 font-bold uppercase block">Karma vs. Gains SAV Bindus</span>
          <strong class="text-base text-white">10H: ${bindu10} • 6H: ${bindu6} • 11H: ${bindu11}</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-purple-950/50 border border-purple-400/40">
          <span class="text-purple-300 font-bold uppercase block">Planetary Maturity Peak Ages</span>
          <strong class="text-base text-white">Ages ${maturitySet.join(", ")}</strong>
        </div>
      </div>

      <p>
        <strong>1. Parashari 10th-Lord Synthesis & Job vs. Independent Command:</strong> Your 10th House (${rashi10.en}) ruler <strong>${lord10Key}</strong> sits in <strong>House ${lord10.bhava} (${RASHI_DATA[lord10.d1].en})</strong>—wiring your professional destiny directly into <em>${BHAVA_IN_BHAVA_EFFECTS_EN[lord10.bhava]}</em>. Anchored by <strong>Saturn in ${RASHI_DATA[sat.d1].en}</strong> and <strong>Sun in ${RASHI_DATA[sun.d1].en}</strong>, your DNA is built for autonomous leadership rather than blind subordination.
      </p>

      <p>
        <strong>2. Workplace Politics & Geographic Leverage:</strong> Operating away from your birthplace or dealing with national/global networks accelerates your rise dramatically. <em>(Note: Your exact year-by-year Career Breakthrough dates and Planetary Obstruction alerts are detailed in <strong>Chapter 11</strong> after your planetary analysis.)</em>
      </p>

      <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4 break-words">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> Highest-Alignment Career Sectors for Your Chart:</div>
        <p class="text-xs md:text-sm mb-0">
          Executive administration/government, IT/systems engineering, finance & capital strategy, medicine & healthcare, high-ticket consulting, legal/policy leadership, or scalable independent enterprise.
        </p>
      </div>
    `;
  }

  function buildChapter4Wealth(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const isFull = chart.isFullChartMode;
    const asc = chart.Asc.d1;
    const rashi2 = RASHI_DATA[getRashiOfBhava(asc, 2)];
    const rashi11 = RASHI_DATA[getRashiOfBhava(asc, 11)];
    const lord2 = planetAnalysis[rashi2.lord];
    const lord11 = planetAnalysis[rashi11.lord];
    const bindu2  = specialLagnas.houseBindus[2];
    const bindu11 = specialLagnas.houseBindus[11];
    const bindu12 = specialLagnas.houseBindus[12];
    const leakVariant = pickUniqueVariant("ch4MoneyLeak", DYNAMIC_HOOK_BANKS.ch4MoneyLeak, ctx);

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
          <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40">
            <span class="text-emerald-300 font-bold block">धनेश (${rashi2.lordHi}) एवं लाभेश (${rashi11.lordHi})</span>
            <strong class="text-base text-white">भाव ${lord2.bhava} एवं भाव ${lord11.bhava} में स्थित</strong>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/85 border border-amber-400/30">
            <span class="text-amber-300 font-bold block">${isFull ? "लाभ (11H) • बचत (2H) • व्यय (12H)" : "प्रमुख संपदा वाहन"}</span>
            <strong class="text-base text-white">${isFull ? `${bindu11} लाभ • ${bindu2} बचत • ${bindu12} व्यय` : "भूमि (Land), स्वर्ण एवं इक्विटी"}</strong>
          </div>
          <div class="p-3.5 rounded-xl bg-purple-950/50 border border-purple-400/40">
            <span class="text-purple-300 font-bold block">धन-लॉक सूत्र (Asset Rule)</span>
            <strong class="text-base text-white">40% अचल संपत्ति / स्वर्ण निवेश</strong>
          </div>
        </div>

        <p><strong>1. रहस्यमयी 'मनी लीक' (जो आपने बार-बार अनुभव किया है):</strong> ${leakVariant.hi}</p>

        <p>
          <strong>2. पाराशरी धनेश-लाभेश समीकरण:</strong> आपकी कुंडली में द्वितीयेश (धनेश) <strong>${rashi2.lordHi}</strong> ${lord2.bhava}वें भाव में और एकादशेश (लाभेश) <strong>${rashi11.lordHi}</strong> ${lord11.bhava}वें भाव में स्थित हैं। मित्र या रिश्तेदार को भावुक होकर दिया गया उधार समय पर वापस न मिलने का योग आपकी कुंडली में स्पष्ट है—अतः बिना लिखित सुरक्षा के बड़ा धन उधार देने से बचें।
        </p>

        <p>
          <strong>3. करोड़पति संपदा निर्माण का वैदिक लॉक-इन नियम:</strong> यदि आप पैसा केवल सेविंग्स अकाउंट (Liquid Cash) में छोड़ेंगे, तो 12वां भाव (${bindu12} बिंदु) उसे अनावश्यक खर्चों में खींच लेगा। जैसे ही धन आए, उसका कम से कम 40% भाग <strong>भूमि/प्रॉपर्टी, स्वर्ण (Gold) या दीर्घकालिक SIP/Assets</strong> में लॉक कर दें—इससे आकस्मिक खर्च तुरंत रुक जाएंगे।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40">
          <span class="text-emerald-300 font-bold block">2nd Lord (${rashi2.lord}) & 11th Lord (${rashi11.lord})</span>
          <strong class="text-base text-white">Placed in H-${lord2.bhava} & H-${lord11.bhava}</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/85 border border-amber-400/30">
          <span class="text-amber-300 font-bold block">${isFull ? "11H Gains • 2H Saved • 12H Outflow" : "Primary Wealth Vehicles"}</span>
          <strong class="text-base text-white">${isFull ? `${bindu11} Inflow • ${bindu2} Saved • ${bindu12} Out` : "Land, Gold & Compounding Equity"}</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-purple-950/50 border border-purple-400/40">
          <span class="text-purple-300 font-bold block">Wealth Lock-In Formula</span>
          <strong class="text-base text-white">40% into Land, Gold & Equity</strong>
        </div>
      </div>

      <p><strong>1. The Unspoken "Money Leak" Pattern in Your Life:</strong> ${leakVariant.en}</p>

      <p>
        <strong>2. Parashari Dhana-Labha Synthesis:</strong> Your 2nd-lord <strong>${rashi2.lord}</strong> sits in House ${lord2.bhava} while your 11th-lord <strong>${rashi11.lord}</strong> sits in House ${lord11.bhava}. Emotional lending to friends or relatives carries a high risk of getting stuck—never lend large sums on verbal trust alone.
      </p>

      <p>
        <strong>3. Your Multi-Crore Wealth-Locking Formula:</strong> Keeping large liquid cash idle in a regular bank account triggers sudden unplanned outflows. The moment surplus money arrives, immediately convert at least 40% into <strong>illiquid appreciating assets—Land/Real Estate, Physical Gold, or Automated Index/Equity Funds</strong>.
      </p>
    `;
  }

  function buildChapter5Luck(ctx) {
    const { lang, chart, planetAnalysis, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi9 = RASHI_DATA[getRashiOfBhava(asc, 9)];
    const lord9  = planetAnalysis[rashi9.lord];
    const m = numData.mulank, b = numData.bhagyank;
    const luckVariant = pickUniqueVariant("ch5LuckTest", DYNAMIC_HOOK_BANKS.ch5LuckTest, ctx);

    const milestoneAges = Array.from(new Set([
      18 + m, 21 + (b % 5), 24 + (m % 4), 27 + (b % 3),
      30 + (lord9.bhava % 4), 33 + (m % 3), 36, 42
    ])).sort((x, y) => x - y);

    if (lang === "hi") {
      return `
        <p><strong>1. आपके भाग्योदय का गुप्त नियम:</strong> ${luckVariant.hi}</p>

        <p>
          <strong>2. भाग्येश (${rashi9.lordHi}) का ${lord9.bhava}वें भाव में फल एवं स्वर्णिम आयु वर्ष:</strong> आपकी कुंडली में नवमेश (भाग्येश) <strong>${rashi9.lordHi}</strong> ${lord9.bhava}वें भाव में स्थित होकर आपके भाग्य को सीधे <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[lord9.bhava]}"</em> से जोड़ते हैं। भृगु चक्र और आपके मूलांक (${m}) व भाग्यांक (${b}) के अनुसार आपकी आयु के <strong>${milestoneAges.join(", ")}वें वर्ष</strong> आपके जीवन की दिशा बदलने वाले स्वर्णिम पड़ाव हैं।
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
            <div class="text-[11px] text-amber-400 font-bold">भाग्येश भाव स्थिति</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.lordHi} (${lord9.bhava}वें भाव में)</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">प्रमुख भाग्य रत्न/धातु</div>
            <div class="text-sm font-bold text-white mt-1">स्वर्ण / अभिमंत्रित रुद्राक्ष</div>
          </div>
        </div>
      `;
    }

    return `
      <p><strong>1. How Destiny Tests & Rewards You:</strong> ${luckVariant.en}</p>

      <p>
        <strong>2. 9th-Lord (${rashi9.lord}) in House ${lord9.bhava} & Crucial Age Turning Points:</strong> With your 9th-lord <strong>${rashi9.lord}</strong> seated in House ${lord9.bhava}, your fortune unlocks through <em>${BHAVA_IN_BHAVA_EFFECTS_EN[lord9.bhava]}</em>. Synthesizing Bhrigu progression with your Mulank (${m}) and Bhagyank (${b}), the most decisive destiny-shifting years of your life occur at <strong>ages ${milestoneAges.join(", ")}</strong>.
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
          <div class="text-[11px] text-amber-400 font-bold">9th Lord Placement</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.lord} in H-${lord9.bhava}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <div class="text-[11px] text-amber-400 font-bold">Primary Luck Anchor</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.lord}</div>
        </div>
      </div>
    `;
  }

  function buildChapter6Love(ctx) {
    const { lang, planetAnalysis } = ctx;
    const ven  = planetAnalysis.Venus;
    const rahu = planetAnalysis.Rahu;
    const mars = planetAnalysis.Mars;
    const loveVariant = pickUniqueVariant("ch6LovePattern", DYNAMIC_HOOK_BANKS.ch6LovePattern, ctx);

    const karmicLove = ven.conjunctWith.includes("Rahu") || ven.conjunctWith.includes("Saturn") ||
                       ven.conjunctWith.includes("Mars") || ven.conjunctWith.includes("Ketu") ||
                       rahu.bhava === 5 || rahu.bhava === 7 || [1,2,4,7,8,12].includes(mars.bhava);

    if (lang === "hi") {
      return `
        <p>
          <strong>1. रिश्तों में आपका अनकहा भावनात्मक सच:</strong> प्रेम के कारक <strong>शुक्र (${RASHI_DATA[ven.d1].hi}, ${ven.bhava}वें भाव)</strong> की स्थिति दिखाती है कि आपका हृदय टाइम-पास या सतही आकर्षण के लिए नहीं बना है। ${loveVariant.hi}
        </p>

        <p>
          <strong>2. भावनात्मक मोड़ एवं पूर्वजन्म का कार्मिक आकर्षण:</strong> ${
            karmicLove
              ? `आपके प्रेम और सप्तम अक्ष पर तीव्र कार्मिक प्रभाव होने के कारण युवावस्था के प्रारंभिक चरण में कम से कम एक ऐसा गहरा भावनात्मक जुड़ाव या अधूरा रिश्ता आता है जो आपको अंधे भरोसे से बाहर निकलकर अपने आत्म-सम्मान की कीमत सिखाता है।`
              : "शुक्र का प्रभाव आपको स्वाभाविक आकर्षण देता है, परंतु जब तक सामने वाले में बौद्धिक परिपक्वता और वफादारी न दिखे, आपका मन पूरी तरह खुलता नहीं है।"
          }
        </p>
      `;
    }

    return `
      <p>
        <strong>1. Your Unspoken Relationship Pattern:</strong> With <strong>Venus in ${RASHI_DATA[ven.d1].en} (House ${ven.bhava})</strong>, you are constitutionally incapable of shallow, time-pass romance. ${loveVariant.en}
      </p>

      <p>
        <strong>2. Karmic Attraction & Emotional Wake-Up Call:</strong> ${
          karmicLove
            ? `Because intense karmic nodes touch your romantic axis, your early adulthood includes a deeply transformative emotional attachment or heartbreak designed to strip away naive illusions and awaken your self-worth.`
            : "Your Venus placement gives you natural romantic magnetism, yet your heart only truly relaxes when intellectual respect and consistent actions coexist."
        }
      </p>
    `;
  }

  function buildChapter7Partner(ctx) {
    const { lang, gender, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi7   = RASHI_DATA[getRashiOfBhava(asc, 7)];
    const lord7    = planetAnalysis[rashi7.lord];
    const d9Rashi7 = RASHI_DATA[getRashiOfBhava(chart.Asc.d9, 7)];
    const lord7D9Rashi = RASHI_DATA[lord7.d9];
    const spouseKarakaKey = gender === "female" ? "Jupiter" : "Venus";
    const spouseKaraka = planetAnalysis[spouseKarakaKey];
    const lord7Nak = NAKSHATRA_DATA[lord7.nak];
    const bindu7 = specialLagnas.houseBindus[7];

    const planetsIn7th = Object.keys(planetAnalysis).filter(k => planetAnalysis[k].bhava === 7);
    const hasMarsIn7th = planetsIn7th.includes("Mars");

    const innerNatureHi = (rashi7.id === d9Rashi7.id)
      ? `नवांश में सप्तमेश ${rashi7.lordHi} के <strong>${lord7D9Rashi.hi}</strong> में जाने से निजी वैवाहिक जीवन में उनका आंतरिक स्वभाव <em>${lord7D9Rashi.temperamentHi}</em> रहेगा`
      : `अंतरंग संबंधों में नवांश के <strong>${d9Rashi7.hi}</strong> प्रभाव से उनका स्वभाव <em>${d9Rashi7.temperamentHi}</em> रहेगा`;

    const innerNatureEn = (rashi7.id === d9Rashi7.id)
      ? `because your 7th house is Vargottama and 7th-lord ${rashi7.lord} moves into <strong>${lord7D9Rashi.en}</strong> in Navamsa, their private inner nature will be <em>${lord7D9Rashi.temperamentEn}</em>`
      : `in private family life under D9 <strong>${d9Rashi7.en}</strong>, their deeper nature is <em>${d9Rashi7.temperamentEn}</em>`;

    const dir1En = rashi7.direction;
    const dir2En = d9Rashi7.direction !== dir1En ? d9Rashi7.direction : rashi7.altDirection;
    const dir1Hi = rashi7.directionHi;
    const dir2Hi = d9Rashi7.directionHi !== dir1Hi ? d9Rashi7.directionHi : rashi7.altDirectionHi;

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-rose-950/50 border border-rose-400/40">
            <div class="text-xs text-rose-300 font-bold">💍 सप्तम भाव एवं जीवनसाथी कारक</div>
            <div class="text-sm font-extrabold text-white mt-0.5">${rashi7.hi} • ${spouseKaraka.meta.hi} (${RASHI_DATA[spouseKaraka.d1].hi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
            <div class="text-xs text-pink-300 font-bold">सप्तमेश (${rashi7.lordHi}) एवं सप्तम बिंदु</div>
            <div class="text-sm font-extrabold text-white mt-0.5">${lord7.bhava}वें भाव में (${RASHI_DATA[lord7.d1].hi}) • ${bindu7} SAV बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">विवाह की शुभ दिशा एवं उपपद</div>
            <div class="text-sm font-extrabold text-white mt-0.5">${dir1Hi} / ${dir2Hi}</div>
          </div>
        </div>

        <p>
          <strong>1. भावी जीवनसाथी का रंग-रूप, कद-काठी और आकर्षण:</strong> आपके सप्तम अक्ष (<strong>${rashi7.hi}</strong>), सप्तमेश <strong>${rashi7.lordHi} (${lord7Nak.name} नक्षत्र)</strong> और जीवनसाथी कारक <strong>${spouseKaraka.meta.hi} (${RASHI_DATA[spouseKaraka.d1].hi})</strong> के प्रभाव से आपके जीवनसाथी में <em>${rashi7.bodyBuildHi}</em> स्पष्ट झलकेगी। ${planetsIn7th.length ? `विशेषकर सप्तम भाव में <strong>${planetsIn7th.map(p => PLANET_META[p].hi).join(", ")}</strong> की उपस्थिति उनके व्यक्तित्व में एक तीव्र और प्रभावशाली ऊर्जा जोड़ती है।` : ""}
        </p>

        <p>
          <strong>2. जीवनसाथी का स्वभाव एवं सप्तमेश (${rashi7.lordHi}) का ${lord7.bhava}वें भाव में फल:</strong> आपका जीवनसाथी बाहरी समाज के सामने <em>${rashi7.temperamentHi}</em> होगा, जबकि ${innerNatureHi}। सप्तमेश का ${lord7.bhava}वें भाव में बैठना यह दर्शाता है कि विवाह के बाद आपके जीवन में <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[lord7.bhava]}"</em> सक्रिय होगा। ${hasMarsIn7th ? "<strong class='text-rose-300'>विशेष मांगलिक (कुज दोष) निदान:</strong> सप्तम भाव में मंगल की उपस्थिति वैवाहिक जीवन में अत्यधिक स्वाभिमान और अचानक उग्र वैचारिक टकराव (Ego Clashes) देती है—अतः बिना गुप्त कुज-शांति और नाड़ी/गण मिलान के विवाह में कदम न रखें।" : ""}
        </p>

        <p>
          <strong>3. जीवनसाथी की दिशा एवं विवाह-पश्चात भाग्योदय:</strong> आपके जीवनसाथी के जन्मस्थान या मिलन की दिशा <strong>${dir1Hi}</strong> अथवा <strong>${dir2Hi}</strong> रहेगी, और विवाह के 18 से 24 महीनों के भीतर आपके आर्थिक स्तर में एक बड़ा उछाल (Post-Marriage Bhagya Udaya) आएगा। <em>(नोट: आपके विवाह के सटीक वर्षों एवं ग्रह-बाधा की चेतावनी नीचे <strong>अध्याय 11</strong> में दी गई है।)</em>
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-rose-950/50 border border-rose-400/40">
          <div class="text-xs text-rose-300 font-bold">💍 7th House & Spouse Karaka</div>
          <div class="text-sm font-extrabold text-white mt-0.5">${rashi7.en} • ${spouseKarakaKey} in ${RASHI_DATA[spouseKaraka.d1].en}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
          <div class="text-xs text-pink-300 font-bold">7th Lord (${rashi7.lord}) & SAV Strength</div>
          <div class="text-sm font-extrabold text-white mt-0.5">In H-${lord7.bhava} (${RASHI_DATA[lord7.d1].en}) • ${bindu7} Bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-xs text-amber-300 font-bold">Marriage Direction</div>
          <div class="text-sm font-extrabold text-white mt-0.5">${dir1En} / ${dir2En}</div>
        </div>
      </div>

      <p>
        <strong>1. Physical Appearance & First Impression of Your Future Partner:</strong> Synthesizing your 7th house in <strong>${rashi7.en}</strong>, 7th-lord <strong>${rashi7.lord} (${lord7Nak.name})</strong>, and spouse-karaka <strong>${spouseKarakaKey} in ${RASHI_DATA[spouseKaraka.d1].en}</strong>, your partner will carry <em>${rashi7.bodyBuildEn}</em>. ${planetsIn7th.length ? `With <strong>${planetsIn7th.join(", ")}</strong> directly occupying your 7th house, your partner projects unmistakable intensity and command.` : ""}
      </p>

      <p>
        <strong>2. Partner's Nature & 7th Lord in House ${lord7.bhava}:</strong> Socially, your spouse will be <em>${rashi7.temperamentEn}</em>, while ${innerNatureEn}. Because your 7th lord sits in House ${lord7.bhava}, marriage directly triggers <em>${BHAVA_IN_BHAVA_EFFECTS_EN[lord7.bhava]}</em>. ${hasMarsIn7th ? "<strong class='text-rose-300'>7th-House Kuja/Manglik Alert:</strong> Mars directly in your 7th house injects fierce pride and sudden temper clashes into marriage unless properly matched and pacified." : ""}
      </p>

      <p>
        <strong>3. Marriage Direction & Post-Marriage Fortune:</strong> Your partner's roots or meeting point aligns toward the <strong>${dir1En} / ${dir2En}</strong>, triggering a strong Post-Marriage Bhagya-Udaya within 18 to 24 months of marriage. <em>(Note: Your exact Marriage Year windows and Planetary Sabotage alerts are detailed in <strong>Chapter 11</strong> below.)</em>
      </p>
    `;
  }

  function buildChapterChildbirth(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const jup    = planetAnalysis.Jupiter;
    const bindu5 = specialLagnas.houseBindus[5];

    const maleficsTouching5th = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].filter(mKey =>
      planetAnalysis[mKey].bhava === 5 || planetAnalysis[mKey].aspectedTargets.some(t => t.targetBhava === 5)
    );

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40">
            <div class="text-xs text-emerald-300 font-bold">👶 संतान कारक गुरु एवं पंचम राशि</div>
            <div class="text-sm font-extrabold text-white mt-0.5">गुरु (${RASHI_DATA[jup.d1].hi}) • पंचम (${rashi5.hi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">पंचमेश (${rashi5.lordHi}) एवं पंचम बिंदु</div>
            <div class="text-sm font-extrabold text-white mt-0.5">${lord5.bhava}वें भाव में (${RASHI_DATA[lord5.d1].hi}) • ${bindu5} SAV बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-purple-400/30">
            <div class="text-xs text-purple-300 font-bold">पंचम पर क्रूर दृष्टि / प्रभाव</div>
            <div class="text-sm font-extrabold text-white mt-0.5">${maleficsTouching5th.length ? maleficsTouching5th.map(m => PLANET_META[m].hi).join(", ") : "शुभ संरक्षित"}</div>
          </div>
        </div>

        <p>
          <strong>1. पंचमेश (${rashi5.lordHi}) का ${lord5.bhava}वें भाव में समीकरण एवं संतान सुख:</strong> आपकी कुंडली में पंचमेश <strong>${rashi5.lordHi}</strong> ${lord5.bhava}वें भाव में स्थित हैं और संतान कारक <strong>देवगुरु बृहस्पति (${RASHI_DATA[jup.d1].hi})</strong> में हैं—जो संतान के माध्यम से <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[lord5.bhava]}"</em> को जागृत करते हैं।
        </p>

        <p>
          <strong>2. संतान का स्वभाव एवं संतान-भाग्योदय:</strong> पंचम भाव (${rashi5.hi}) के प्रभाव से आपकी प्रथम संतान जन्म से ही अत्यंत कुशाग्र बुद्धि, तेजस्वी आभा और स्वतंत्र सोच वाली होगी तथा उसके जन्म के 12 महीनों के भीतर आपके आर्थिक व पारिवारिक स्थायित्व में बड़ी वृद्धि होगी।
        </p>

        <p>
          <strong>3. पाराशरी दृष्टि एवं संतान-बाधा निदान:</strong> ${
            maleficsTouching5th.length
              ? `ध्यान दें—आपके पंचम भाव (पुत्र/संतान भाव) पर <strong>${maleficsTouching5th.map(m => PLANET_META[m].hi).join(" एवं ")}</strong> का सीधा दृष्टि/स्थान प्रभाव पड़ रहा है और पंचम भाव में <strong>${bindu5} अष्टकवर्ग बिंदु</strong> हैं। इसके कारण गर्भधारण में अनपेक्षित विलंब, प्रारंभिक महीनों में मेडिकल/हार्मोनल संवेदनशीलता या संतान को लेकर मानसिक चिंता उभरती है। <em>(सटीक संतान प्राप्ति वर्ष एवं ग्रह-बाधा की चेतावनी नीचे <strong>अध्याय 11</strong> में देखें।)</em>`
              : "आपकी कुंडली में पंचम अक्ष संतुलित है, परंतु गोचर के राहु-शनि से सुरक्षा रखना आवश्यक है।"
          }
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/40">
          <div class="text-xs text-emerald-300 font-bold">👶 Putra-Karaka Jupiter & 5th Sign</div>
          <div class="text-sm font-extrabold text-white mt-0.5">Jupiter (${RASHI_DATA[jup.d1].en}) • ${rashi5.en}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-xs text-amber-300 font-bold">5th Lord (${rashi5.lord}) & SAV Bindus</div>
          <div class="text-sm font-extrabold text-white mt-0.5">In H-${lord5.bhava} (${RASHI_DATA[lord5.d1].en}) • ${bindu5} Bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-purple-400/30">
          <div class="text-xs text-purple-300 font-bold">Malefic Aspects on 5th House</div>
          <div class="text-sm font-extrabold text-white mt-0.5">${maleficsTouching5th.length ? maleficsTouching5th.join(", ") : "Clear / Protected"}</div>
        </div>
      </div>

      <p>
        <strong>1. 5th-Lord Synthesis & Progeny Destiny:</strong> With your 5th-lord <strong>${rashi5.lord}</strong> in House ${lord5.bhava} and Putra-Karaka <strong>Jupiter in ${RASHI_DATA[jup.d1].en}</strong>, your progeny karma channels into <em>${BHAVA_IN_BHAVA_EFFECTS_EN[lord5.bhava]}</em>.
      </p>

      <p>
        <strong>2. Child's Nature & Putra-Bhagya Rise:</strong> Under ${rashi5.en}, your first child brings sharp observational intelligence and triggers a tangible financial/property elevation for the parents within 12 months of birth.
      </p>

      <p>
        <strong>3. Parashari Aspect & Medical Progeny Diagnosis:</strong> ${
          maleficsTouching5th.length
            ? `Crucial observation: <strong>${maleficsTouching5th.join(" & ")}</strong> directly aspect or occupy your 5th house of progeny (which holds <strong>${bindu5} SAV bindus</strong>). This creates initial conception delays, Pitta/hormonal sensitivity, or first-trimester medical precautions unless pacified. <em>(See exact Childbirth Years and Planetary Sabotage alerts in <strong>Chapter 11</strong> below.)</em>`
            : "Your 5th house is supportive, though transit protection during conception windows is advised."
        }
      </p>
    `;
  }

  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const isFull = chart.isFullChartMode;
    const ascRashi = chart.Asc.d1;
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];

    const modeBanner = isFull
      ? (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>99.9% पूर्ण पाराशरी भाव-स्वामी एवं नवांश विश्लेषण:</strong> नीचे प्रत्येक ग्रह का स्वामित्व (Lordship), बैठने के भाव का सूत्र, नवांश परिपक्वता और पाराशरी दृष्टियों का सटीक निचोड़ दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>99.9% Exact Parashari Lordship & Navamsa Synthesis:</strong> Below are the house-lordship rules, real-life verdicts, trigger ages, and aspect warnings for all 9 planets.</div>`)
      : (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-sun mr-2"></i><strong>जन्म-दिवस के वास्तविक ग्रह (Noon Natal Ephemeris):</strong> आपके जन्म के दिन दोपहर 12:00 IST पर आकाश में सभी 9 ग्रह जिन वास्तविक राशियों और नक्षत्रों में स्थित थे, उनका आपके जीवन पर सीधा व्यावहारिक प्रभाव नीचे दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-sun mr-2"></i><strong>Your Birth-Date Natal Planetary Blueprint (Noon Ephemeris):</strong> Here is how the exact sidereal positions of all 9 planets on the day you were born shape your real-life destiny, health, and trigger ages.</div>`);

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

      const matAges = (PLANET_MATURITY_AGES[k] || [24, 30, 36]).join(", ");
      const conjNamesEn = info.conjunctWith.map(c => PLANET_META[c].en).join(", ");
      const conjNamesHi = info.conjunctWith.map(c => PLANET_META[c].hi).join(", ");

      const lordshipSynthesisHi = (isFull && info.ownedHouses.length)
        ? `यह ग्रह आपके <strong>${info.ownedHouses.join(" व ")}वें भाव का स्वामी</strong> होकर <strong>${info.bhava}वें भाव</strong> में बैठा है—जिसका पाराशरी सूत्र है: <em>"${BHAVA_IN_BHAVA_EFFECTS_HI[info.bhava]}"</em>। `
        : "";
      const lordshipSynthesisEn = (isFull && info.ownedHouses.length)
        ? `As ruler of <strong>House ${info.ownedHouses.join(" & ")}</strong> seated in <strong>House ${info.bhava}</strong>, Parashari sutra dictates <em>${BHAVA_IN_BHAVA_EFFECTS_EN[info.bhava]}</em>. `
        : "";

      const outgoingEn = info.aspectedTargets.map(t => {
        const hit = t.planetsThere.length ? ` (hitting ${t.planetsThere.join(", ")})` : "";
        return isFull ? `${t.nthAspect}th aspect on House ${t.targetBhava}${hit}` : `${t.nthAspect}th aspect on ${RASHI_DATA[t.targetRashi].en}${hit}`;
      }).join(" • ");

      const outgoingHi = info.aspectedTargets.map(t => {
        const hit = t.planetsThere.length ? ` (${t.planetsThere.map(p => PLANET_META[p].hi).join(", ")} पर दृष्टि)` : "";
        return isFull ? `${t.nthAspect}वीं दृष्टि ${t.targetBhava}वें भाव पर${hit}` : `${t.nthAspect}वीं दृष्टि ${RASHI_DATA[t.targetRashi].hi} पर${hit}`;
      }).join(" • ");

      const incomingEn = info.aspectedBy.length
        ? `Aspected by ${info.aspectedBy.map(inc => PLANET_META[inc.fromPlanet].en).join(", ")}`
        : "Unaspected (operates with independent force)";
      const incomingHi = info.aspectedBy.length
        ? `${info.aspectedBy.map(inc => PLANET_META[inc.fromPlanet].hi).join(", ")} से दृष्ट`
        : "किसी अन्य ग्रह की दृष्टि से मुक्त (स्वतंत्र फल)";

      if (lang === "hi") {
        return `
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 max-w-full overflow-hidden break-words">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div class="min-w-0">
                <h4 class="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <span>${info.meta.hi}</span>
                  ${degBadge}
                  ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">वक्री (Retro)</span>' : ''}
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
                <span class="text-gray-400 block">${bavScoreHere !== null ? "अष्टकवर्ग (BAV):" : "सक्रियता आयु:"}</span>
                <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere}/8 बिंदु` : `आयु ${matAges}`}</strong>
              </div>
            </div>

            <div class="space-y-2 text-xs md:text-sm text-gray-200 pt-1">
              <div>🎯 <strong class="text-amber-300">पाराशरी सूत्र एवं प्रत्यक्ष जीवन फल:</strong> ${lordshipSynthesisHi}${d1Rashi.hi} (${nak.name}) में बैठा ${info.meta.hi} आपको <em>${nak.traitHi}</em> देता है और सीधे तौर पर ${houseThemeShort(info.bhava, "hi")} को नियंत्रित करता है। ${info.conjunctWith.length ? `यह ग्रह <strong>${conjNamesHi}</strong> के साथ युति बनाकर आपके निर्णयों में तीव्रता लाता है।` : `नवांश में ${d9Rashi.hi} में जाने से 28 वर्ष की आयु के बाद इसका प्रभाव दोगुना परिपक्व हो जाता है।`}</div>
              <div>⚡ <strong class="text-emerald-300">परिपक्वता आयु एवं चिकित्सा ज्योतिष (Medical Trigger):</strong> यह ग्रह आपकी आयु के <strong>${matAges}वें वर्ष</strong> में अपना पूर्ण प्रभाव दिखाता है। जब यह ग्रह पीड़ित हो, तो <em>${info.meta.healthHi}</em> के प्रति विशेष सावधानी रखें।</div>
              <div>🛡️ <strong class="text-cyan-300">दृष्टि प्रभाव एवं सावधानी:</strong> ${outgoingHi} (${incomingHi})।</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 max-w-full overflow-hidden break-words">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div class="min-w-0">
              <h4 class="text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                <span>${info.meta.en}</span>
                ${degBadge}
                ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Retrograde</span>' : ''}
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
              <span class="text-gray-400 block">${bavScoreHere !== null ? "BAV Strength:" : "Peak Ages:"}</span>
              <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere}/8 Bindus` : `Ages ${matAges}`}</strong>
            </div>
          </div>

          <div class="space-y-2 text-xs md:text-sm text-gray-200 pt-1">
            <div>🎯 <strong class="text-amber-300">Parashari Lordship & Real-Life Verdict:</strong> ${lordshipSynthesisEn}Seated in ${d1Rashi.en} under ${nak.name}, ${info.meta.en} wires you with <em>${nak.traitEn}</em> and directly shapes <em>${houseThemeShort(info.bhava, "en")}</em>. ${info.conjunctWith.length ? `Conjunct <strong>${conjNamesEn}</strong>, it fuses their agendas whenever triggered.` : `Maturing into ${d9Rashi.en} in D9, its strongest fruit unlocks after age 28.`}</div>
            <div>⚡ <strong class="text-emerald-300">Maturity Ages & Medical Trigger:</strong> Fires major life shifts at <strong>ages ${matAges}</strong>. Physically, monitor <em>${info.meta.healthEn}</em> during stressful transits.</div>
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
            <p class="text-xs md:text-sm text-gray-200 mb-0">गोचर और साढ़ेसाती/ढैय्या का सारा प्रभाव चंद्र लग्न (${chandra.hi}) से ही घटित होता है—मानसिक शांति के लिए आपको <em>${chandra.temperamentHi}</em> वातावरण चाहिए।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30">
            <h4 class="text-base font-bold text-orange-300 mb-1.5"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (${surya.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">सूर्य लग्न (${surya.hi}) आपकी आत्मा के स्वाभिमान, पिता की विरासत और प्रशासनिक अधिकार को नियंत्रित करता है।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30">
            <h4 class="text-base font-bold text-purple-300 mb-1.5"><i class="fas fa-ring mr-2"></i>3. नवांश (${navamsa.hi}) एवं कारकांश (${karakamsa.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">आत्मकारक (${akMeta.hi}) से निर्मित कारकांश (${karakamsa.hi}) और नवांश लग्न 28–30 वर्ष की आयु के बाद आपके वास्तविक भाग्य को खोलते हैं।</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30">
            <h4 class="text-base font-bold text-amber-300 mb-1.5"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (AL — ${arudha.hi})</h4>
            <p class="text-xs md:text-sm text-gray-200 mb-0">आरूढ़ पद (AL) ${arudha.hi} (लग्न से ${specialLagnas.arudhaHouseFromLagna}वें भाव) में है—जो समाज के सामने आपकी बाहरी छवि (Public Perception) को नियंत्रित करता है।</p>
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
              <strong class="text-emerald-300 block mb-0.5">सर्वोच्च बली भाव:</strong> ${strongListHi} (थोड़े प्रयास से बड़ा परिणाम)
            </div>
            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-400/30 text-xs">
              <strong class="text-rose-300 block mb-0.5">संवेदनशील भाव:</strong> ${weakListHi} (गोचर में विशेष उपाय आवश्यक)
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
          <p class="text-xs md:text-sm text-gray-200 mb-0">All planetary transits (Gochara) and Sade-Sati phases register relative to ${chandra.en}—requiring <em>${chandra.temperamentEn}</em> for mental peace.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-orange-400/30">
          <h4 class="text-base font-bold text-orange-300 mb-1.5"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (${surya.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Surya Lagna (${surya.en}) governs your vital authority, paternal karma, and executive command.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/30">
          <h4 class="text-base font-bold text-purple-300 mb-1.5"><i class="fas fa-ring mr-2"></i>3. Navamsa (${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Via Atmakaraka ${akMeta.en}, your Karakamsa (${karakamsa.en}) and D9 Lagna unlock your ripened destiny after age 28–30.</p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30">
          <h4 class="text-base font-bold text-amber-300 mb-1.5"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-xs md:text-sm text-gray-200 mb-0">Placed in ${arudha.en} (${specialLagnas.arudhaHouseFromLagna}th from Lagna), Arudha Pada governs how society perceives your status.</p>
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
            <strong class="text-emerald-300 block mb-0.5">Peak Power Houses:</strong> ${strongListEn} (Rapid manifestation)
          </div>
          <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-400/30 text-xs">
            <strong class="text-rose-300 block mb-0.5">Low-Bindu Sensitive Houses:</strong> ${weakListEn} (Requires conscious remedy)
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
    `;
  }

  // ==========================================================================
  // 10. CHAPTER 11 (POST-PLANET): ACTIVE DASHA + CONSOLIDATED YEARLY FORECAST +
  //     "THIS YEAR IS YOUR OPPORTUNITY FOR JOB/MARRIAGE/CHILD — BUT PLANET X
  //     IS BLOCKING IT" PSYCHOLOGICAL FEAR ENGINE!
  // ==========================================================================

  function buildDomainOpportunityVsSabotageCard(ctx, domain) {
    const { lang, chart, planetAnalysis, specialLagnas, dasha, timeline, numData } = ctx;
    const asc = chart.Asc.d1;
    const cy = numData.currentYear;
    const ny = cy + 1;
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[asc];
    const badhakeshKey = lagnaMatrix.badhakesh;
    const badhakesh = planetAnalysis[badhakeshKey];

    let targetHouse = 10;
    let icon = "fa-briefcase";
    let windowStr = timeline.careerWindow1;
    let domainTitleHi = "नौकरी, प्रमोशन एवं करियर उछाल (Job / Career)";
    let domainTitleEn = "Job Switch, Promotion & Career Rise";

    if (domain === "marriage") {
      targetHouse = 7;
      icon = "fa-ring";
      windowStr = timeline.marriageWindow1;
      domainTitleHi = "विवाह एवं रिश्ता पक्का होना (Marriage / Partner)";
      domainTitleEn = "Marriage Finalization & Partner Commitment";
    } else if (domain === "childbirth") {
      targetHouse = 5;
      icon = "fa-baby";
      windowStr = timeline.babyWindow1;
      domainTitleHi = "संतान प्राप्ति एवं गर्भधारण योग (Childbirth / Progeny)";
      domainTitleEn = "Childbirth, Conception & Santan Yoga";
    }

    const houseRashiId = getRashiOfBhava(asc, targetHouse);
    const houseLordKey = RASHI_DATA[houseRashiId].lord;
    const houseLord = planetAnalysis[houseLordKey];
    const houseBindus = specialLagnas.houseBindus[targetHouse];

    const maleficsTouching = ["Saturn", "Mars", "Rahu", "Ketu"].filter(mKey =>
      planetAnalysis[mKey].bhava === targetHouse ||
      planetAnalysis[mKey].aspectedTargets.some(t => t.targetBhava === targetHouse)
    );

    let saboteurKey = maleficsTouching[0] || badhakeshKey;
    if ([6, 8, 12].includes(planetAnalysis[dasha.ad].bhava) && saboteurKey === badhakeshKey) {
      saboteurKey = dasha.ad;
    }

    const saboteur = planetAnalysis[saboteurKey];
    const saboteurRashi = RASHI_DATA[saboteur.d1];
    const saboteurNak = NAKSHATRA_DATA[saboteur.nak];
    const satBavInTarget = specialLagnas.houseBav?.Saturn?.[targetHouse] ?? 2;

    if (lang === "hi") {
      return `
        <div class="p-4 rounded-2xl bg-gradient-to-r from-red-950/95 via-slate-950 to-amber-950/90 border-2 border-red-500/80 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-red-500/30">
            <span class="text-amber-300 font-extrabold text-xs md:text-sm uppercase tracking-wider">
              <i class="fas ${icon} mr-1.5"></i>${domainTitleHi}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold">
              प्रबल अवसर वर्ष: ${windowStr}
            </span>
          </div>
          <p class="text-xs md:text-sm text-gray-100 leading-relaxed mb-1.5">
            ✅ <strong>अवसर (Opportunity):</strong> वर्ष <strong>${cy}–${ny} (${windowStr})</strong> में आपके ${targetHouse}वें भाव के स्वामी <strong>${houseLord.meta.hi}</strong> और सक्रिय दशा के कारण <strong>${domainTitleHi}</strong> का अत्यंत प्रबल योग बन रहा है।
          </p>
          <p class="text-xs md:text-sm text-red-200 leading-relaxed mb-0">
            ⚠️ <strong>कौन सा ग्रह काम बिगाड़ रहा है (Planetary Sabotage):</strong> ठीक इसी समय आपकी कुंडली का <strong>${saboteur.meta.hi} (${saboteurRashi.hi} • ${saboteurNak.name} नक्षत्र, ${saboteur.bhava}वां भाव)</strong> और बाधकेश <strong>${badhakesh.meta.hi}</strong> आपके ${targetHouse}वें भाव (कुल अष्टकवर्ग: <strong>${houseBindus} बिंदु</strong>, शनि योगदान: मात्र <strong>${satBavInTarget}/8 बिंदु</strong>) पर सीधा अवरोध डाल रहे हैं! <strong>बिना सटीक शांति उपाय के यह अवसर इस वर्ष 99% पर आकर अटक सकता है या यह कार्य हाथ से निकल सकता है!</strong>
          </p>
        </div>
      `;
    }

    return `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-red-950/95 via-slate-950 to-amber-950/90 border-2 border-red-500/80 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-red-500/30">
          <span class="text-amber-300 font-extrabold text-xs md:text-sm uppercase tracking-wider">
            <i class="fas ${icon} mr-1.5"></i>${domainTitleEn}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold">
            Golden Window: ${windowStr}
          </span>
        </div>
        <p class="text-xs md:text-sm text-gray-100 leading-relaxed mb-1.5">
          ✅ <strong>The Opportunity:</strong> During <strong>${cy}–${ny} (${windowStr})</strong>, your ${targetHouse}th-lord <strong>${houseLord.meta.en}</strong> and active Dasha open a prime window for <strong>${domainTitleEn}</strong>.
        </p>
        <p class="text-xs md:text-sm text-red-200 leading-relaxed mb-0">
          ⚠️ <strong>Which Planet Is Sabotaging It:</strong> Simultaneously, your natal <strong>${saboteur.meta.en} (${saboteurRashi.en} • ${saboteurNak.name}, House ${saboteur.bhava})</strong> and Badhakesh <strong>${badhakesh.meta.en}</strong> afflict your ${targetHouse}th house (SAV: <strong>${houseBindus} bindus</strong>, Saturn BAV: only <strong>${satBavInTarget}/8 bindus</strong>). <strong>Unless pacified right now, this golden opportunity may stall at the 99th percentile or fail to materialize this year!</strong>
        </p>
      </div>
    `;
  }

  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData, chart, timeline } = ctx;
    const isFull = chart.isFullChartMode;
    const cy = numData.currentYear;

    // 4-Year Year-by-Year Calendar Cards (Placed right here in Chapter 11!)
    const years = [cy, cy + 1, cy + 2, cy + 3];
    const pyTheme = {
      1: { ruler:"Sun (सूर्य)", en:"New Career Command & Solo Initiative — old dependencies break; strong window for promotion or independent venture, provided ego clashes are avoided.", hi:"नया प्रारंभ एवं नेतृत्व — पुराने बंधन टूटेंगे और करियर/व्यापार में नई शुरुआत या पदोन्नति का योग बनेगा, परंतु अहंकार के टकराव से बचें।" },
      2: { ruler:"Moon (चंद्रमा)", en:"Relationships, Marriage Talks & Emotional Tides — strong year for partner alignment, though overthinking and Moon-axis affliction can cause last-minute delays.", hi:"विवाह चर्चा, साझेदारी एवं भावनात्मक निर्णय — रिश्ते की बात आगे बढ़ेगी, परंतु मानसिक दुविधा और चंद्र-दोष से अंतिम क्षण में रुकावट संभव है।" },
      3: { ruler:"Jupiter (बृहस्पति)", en:"Expansion, Exam Victory & Progeny/Santan Yoga — knowledge, promotion, auspicious family events, or childbirth luck activates strongly.", hi:"विस्तार, परीक्षा विजय एवं संतान योग — पदोन्नति, उच्च ज्ञान, घर में मांगलिक कार्य या संतान सुख का प्रबल योग बनेगा।" },
      4: { ruler:"Rahu (राहु)", en:"Sudden Restructuring & High-Risk Money Caution — unexpected outflows or sudden job/city shifts; strictly avoid lending money or risky speculation.", hi:"आकस्मिक परिवर्तन एवं आर्थिक सावधानी — अचानक स्थान/कार्य परिवर्तन और अनपेक्षित खर्च; इस वर्ष किसी को बड़ा पैसा उधार देने या शॉर्टकट से बचें।" },
      5: { ruler:"Mercury (बुध)", en:"Fast Breakthroughs, Job Switch & Commercial Gains — stagnant blocks clear rapidly; communication and skill upgrades bring income.", hi:"तेज बदलाव, नौकरी परिवर्तन एवं व्यापारिक उछाल — रुके हुए काम गति पकड़ेंगे और नए संपर्कों से आर्थिक लाभ होगा।" },
      6: { ruler:"Venus (शुक्र)", en:"Marriage Peak, Vehicle/Home Upgrade & Luxury Flow — prime year for marriage commitment, progeny, and upgrading family comfort.", hi:"विवाह योग, वाहन/गृह सुख एवं वैभव — विवाह प्रस्ताव, संतान सुख और परिवार की सुख-सुविधाओं में वृद्धि का श्रेष्ठ वर्ष।" },
      7: { ruler:"Ketu (केतु)", en:"Inner Audit, Research & Exposing Hidden Rivals — temporary mental detachment or delay that secretly redirects you toward your true calling.", hi:"आत्म-मंथन एवं गुप्त शत्रुओं की पहचान — मानसिक एकांत या गुप्त बाधा के बाद अचानक सही दिशा का ज्ञान होगा।" },
      8: { ruler:"Saturn (शनि)", en:"Karmic Harvest, Property Locking & Heavy Duty — high workload converts into durable authority and real estate if Saturn is pacified.", hi:"कर्म-फल प्राप्ति, भूमि निर्माण एवं बड़ी जिम्मेदारी — कड़ी मेहनत का ठोस प्रतिफल पद या संपत्ति के रूप में मिलेगा, बशर्ते शनि बाधा शांत हो।" },
      9: { ruler:"Mars (मंगल)", en:"Completion of a 9-Year Cycle & Courageous Decisions — clearing old debts/litigation to prepare for a massive new life chapter.", hi:"9-वर्षीय चक्र की पूर्णता एवं साहसी निर्णय — पुराने विवाद समाप्त होंगे और साहसी फैसले से नया मार्ग खुलेगा।" }
    };

    const yearlyCardsHtml = years.map(yr => {
      const py = reduceToSingleDigit(numData.day + numData.month + reduceToSingleDigit(yr));
      const t = pyTheme[py];
      return `
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-cyan-400/30">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base font-extrabold text-white">${lang === "hi" ? `वर्ष ${yr}` : `Year ${yr}`} (${lang === "hi" ? `आयु ${yr - numData.year}` : `Age ${yr - numData.year}`})</span>
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">PY-${py} • ${t.ruler}</span>
          </div>
          <p class="text-xs md:text-sm text-gray-200 mb-0">${lang === "hi" ? t.hi : t.en}</p>
        </div>
      `;
    }).join("");

    const threeFearCardsHtml = `
      <div class="space-y-4 mt-6">
        <h4 class="text-base md:text-xl font-bold text-amber-300">
          <i class="fas fa-bolt mr-2"></i>${lang === "hi"
            ? `वर्ष ${cy}–${cy + 2} के 3 सबसे बड़े अवसर बनाम उन्हें रोकने वाले ग्रह (Opportunity vs. Planetary Sabotage):`
            : `Your 3 Biggest Opportunities in ${cy}–${cy + 2} vs. The Exact Planets Blocking Them:`}
        </h4>
        ${buildDomainOpportunityVsSabotageCard(ctx, "career")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "marriage")}
        ${buildDomainOpportunityVsSabotageCard(ctx, "childbirth")}
      </div>
    `;

    if (!isFull) {
      return `
        <p class="text-sm text-gray-200">
          ${lang === "hi"
            ? `नवग्रहों के विस्तृत विश्लेषण के पश्चात, अब नीचे आपकी जन्म-तिथि और सूर्य-चंद्र गोचर पर आधारित <strong>वर्ष ${cy} से ${cy + 3} तक का वार्षिक भविष्यफल</strong> तथा <strong>नौकरी, विवाह और संतान के अवसर बनाम ग्रह-बाधा</strong> का निदान दिया गया है:`
            : `Following your in-depth 9-planet analysis, here is your consolidated <strong>Year-by-Year Forecast (${cy}–${cy + 3})</strong> alongside your <strong>Career, Marriage & Childbirth Opportunity vs. Planetary Sabotage</strong> diagnosis:`}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">${yearlyCardsHtml}</div>
        ${threeFearCardsHtml}
        ${buildRedBirthTimePrompt(lang)}
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
      : (dasha.isManualDasha ? (lang === "hi" ? "मैनुअल चयन" : "Manual Selection") : (lang === "hi" ? "नक्षत्र-पाद से परिकलित" : "Nakshatra-Pada Calibrated"));

    const nextAdBlockEn = (dasha.isExactCalendarDasha && dasha.nextAD)
      ? `Right after <strong>${fmtDate(dasha.adActive.end)}</strong>, your chart shifts into <strong>${dasha.nextAD.mdLord}–${dasha.nextAD.lord} Antardasha (${fmtDate(dasha.nextAD.start)} → ${fmtDate(dasha.nextAD.end)})</strong>, which immediately activates your ${planetAnalysis[dasha.nextAD.lord].bhava}th house (${houseThemeShort(planetAnalysis[dasha.nextAD.lord].bhava, "en")}).`
      : `Over the next 12 to 18 months (${cy}–${cy + 1}), transiting Jupiter and Saturn cross your active Dasha axis, forcing a decisive upgrade in your career and relationship priorities.`;

    const nextAdBlockHi = (dasha.isExactCalendarDasha && dasha.nextAD)
      ? `<strong>${fmtDate(dasha.adActive.end)}</strong> को वर्तमान अंतर्दशा समाप्त होते ही आपकी कुंडली में <strong>${PLANET_META[dasha.nextAD.mdLord].hi} में ${PLANET_META[dasha.nextAD.lord].hi} की अंतर्दशा (${fmtDate(dasha.nextAD.start)} → ${fmtDate(dasha.nextAD.end)})</strong> शुरू होगी—जो सीधे आपके ${planetAnalysis[dasha.nextAD.lord].bhava}वें भाव (${houseThemeShort(planetAnalysis[dasha.nextAD.lord].bhava, "hi")}) के फलों को जागृत कर देगी।`
      : `आगामी 12 से 18 महीनों (${cy}–${cy + 1}) में गोचर के गुरु और शनि आपके दशा-अक्ष को सक्रिय कर करियर और संबंधों में एक बड़ा निर्णय करवाएंगे।`;

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
            <div class="text-xs text-amber-300 font-bold uppercase">वर्तमान अंतर्दशा समय-सीमा</div>
            <div class="text-base font-extrabold text-white mt-1">दशानाथ से ${relativeHouseOfAD}वां भाव</div>
            <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
          </div>
        </div>

        <p>
          <strong>1. वर्तमान ${mdInfo.meta.hi}–${adInfo.meta.hi} दशा का प्रत्यक्ष प्रभाव:</strong> इस समय आपके जीवन की कमान ${mdInfo.bhava}वें भाव के <strong>${mdInfo.meta.hi}</strong> और ${adInfo.bhava}वें भाव के <strong>${adInfo.meta.hi}</strong> के हाथों में है। ${
            difficultAxis
              ? `क्योंकि महादशानाथ और अंतर्दशानाथ एक-दूसरे से <strong>${relativeHouseOfAD}वें (6/8/12 — षडाष्टक/द्वादश) कोण</strong> पर हैं, इसलिए आप पिछले कुछ महीनों से अकारण मानसिक तनाव, नींद में खलल और '100% मेहनत पर 50% परिणाम' जैसा दबाव महसूस कर रहे हैं।`
              : `दोनों ग्रहों का परस्पर ${relativeHouseOfAD}वां संबंध यह दर्शाता है कि पिछले 14–18 महीनों से जो योजनाएं अटकी हुई थीं, अब उनके निर्णायक रूप लेने का समय आ गया है।`
          }
        </p>

        <p><strong>2. आगामी अंतर्दशा परिवर्तन एवं सटीक तारीखें:</strong> ${nextAdBlockHi}</p>

        <h4 class="text-base md:text-lg font-bold text-cyan-300 mt-5 mb-2">
          <i class="fas fa-calendar-check mr-2"></i>3. वर्ष ${cy} से ${cy + 3} तक का वर्ष-दर-वर्ष भविष्यफल (Yearly Timeline):
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">${yearlyCardsHtml}</div>

        ${threeFearCardsHtml}
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
        <strong>1. How Your Active ${ dasha.md }–${ dasha.ad } Cycle Is Operating Right Now:</strong> Your current life chapter is governed by <strong>${mdInfo.meta.en}</strong> in House ${mdInfo.bhava} and sub-lord <strong>${adInfo.meta.en}</strong> in House ${adInfo.bhava}. ${
          difficultAxis
            ? `Because ${dasha.md} and ${dasha.ad} sit in a <strong>${relativeHouseOfAD}th (6/8/12) friction angle</strong>, you have been experiencing mental restlessness, irregular sleep, and last-minute hurdles over recent months.`
            : `This ${relativeHouseOfAD}th-house alignment between ${dasha.md} and ${dasha.ad} is actively pushing stalled matters from the last 14–18 months toward a concrete breakthrough.`
        }
      </p>

      <p><strong>2. Exact Upcoming Transition Window:</strong> ${nextAdBlockEn}</p>

      <h4 class="text-base md:text-lg font-bold text-cyan-300 mt-5 mb-2">
        <i class="fas fa-calendar-check mr-2"></i>3. Consolidated Year-by-Year Forecast (${cy} to ${cy + 3}):
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">${yearlyCardsHtml}</div>

      ${threeFearCardsHtml}
    `;
  }

  function buildChapter11HiddenTraps(ctx) {
    const { lang, name, chart, planetAnalysis, specialLagnas, dasha, timeline } = ctx;
    const isFull = chart.isFullChartMode;
    const asc = chart.Asc.d1;
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[asc];
    const badhakaKey  = lagnaMatrix.badhakesh;
    const badhakaInfo = planetAnalysis[badhakaKey];
    const rahu = planetAnalysis.Rahu;
    const ketu = planetAnalysis.Ketu;
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
          प्रिय <strong>${name}</strong>, ऊपर के अध्यायों में आपने अपनी क्षमता, नवग्रहों के विस्तृत फल और आगामी वर्षों के अवसर देखे। <strong>परंतु अब सबसे महत्वपूर्ण प्रश्न ध्यान से पढ़िए:</strong> यदि आपकी कुंडली में इतनी क्षमता मौजूद है, तो फिर आपके सबसे बड़े काम 99% पर आकर क्यों रुकते हैं? और आपकी 100% मेहनत का पूरा प्रतिफल बैंक बैलेंस या मानसिक सुकून में क्यों नहीं बदल पा रहा?
        </p>

        <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4 break-words">
          <div class="font-bold text-red-300 text-base">
            <i class="fas fa-biohazard mr-2"></i> आपकी कुंडली में पकड़े गए 3 गुप्त ग्रह-अवरोध (Root-Cause Doshas):
          </div>
          <p class="text-sm mb-0">
            <strong>1. बाधकेश (${badhakaInfo.meta.hi}) एवं मंगल/मारक का गुप्त अवरोध:</strong> आपके ${RASHI_DATA[asc].hi} आधार के लिए <strong>${badhakaInfo.meta.hi}</strong> अदृश्य रुकावटें पैदा कर रहे हैं। ${isManglik ? `साथ ही मंगल (${RASHI_DATA[mars.d1].hi}) की तीव्र अग्नि-ऊर्जा रिश्तों और साझेदारी में अचानक मतभेद पैदा करती है।` : `साथ ही मारक ग्रहों (${lagnaMatrix.marakas.map(m => PLANET_META[m].hi).join(", ")}) की स्थिति आपके आत्मबल और धन-संचय को प्रभावित कर रही है।`}
          </p>
          <p class="text-sm mb-0">
            <strong>2. राहु (${RASHI_DATA[rahu.d1].hi}) – केतु (${RASHI_DATA[ketu.d1].hi}) का कार्मिक ग्रहण और शनि की परीक्षा:</strong> राहु-केतु ठीक उस समय मानसिक धुंध या गलत इंसान पर भरोसा करवाते हैं जब आप किसी बड़ी सफलता के करीब होते हैं (विशेषकर <strong>${timeline.cautionWindow}</strong> के आर्थिक सावधानी काल में)।
          </p>
          <p class="text-sm mb-0">
            <strong>3. ${isFull ? `${weakestHouse}वें भाव में सबसे कम अष्टकवर्ग बल (केवल ${minBindu} बिंदु):` : "सटीक जन्म-समय के बिना सुप्त ग्रहों (Sleeping Planets) का लॉक:"}</strong> ${isFull ? `आपके ${weakestHouse}वें भाव (${BHAVA_MEANINGS[weakestHouse].hi}) में पूरी कुंडली के सबसे कम (${minBindu}) बिंदु हैं और वर्तमान में ${PLANET_META[dasha.md].hi}–${PLANET_META[dasha.ad].hi} का समय चल रहा है।` : "बिना आपके सटीक जन्म-समय की डिग्री, भाव चलित और षड्बल जांचे यह पता नहीं चलता कि कौन सा राजयोग कारक ग्रह सुप्त (sleeping) पड़ा है।"}
          </p>
        </div>

        <p class="text-amber-200 font-semibold mb-0">
          ⚠️ <strong>सबसे खतरनाक गलती जो 95% लोग करते हैं:</strong> इंटरनेट से देखकर बिना अपनी कुंडली का सटीक अंशबल (Exact Degrees, Bhava Chalit, Shadbala एवं लाल किताब के सोए हुए ग्रह) जांचे कोई भी रत्न पहन लेना—जिससे बाधकेश या मारक ग्रह और अधिक उग्र हो जाता है! अपनी संपूर्ण हस्तनिर्मित कुंडली, 5-वर्षीय महीना-दर-महीना भविष्यवाणी और सुरक्षित वैदिक/लाल किताब उपायों के लिए <strong>आचार्य ज्ञानेंद्र सिंह तोमर जी</strong> से अभी व्हाट्सएप पर जुड़ें।
        </p>
        ${!isFull ? buildRedBirthTimePrompt("hi") : ""}
      `;
    }

    return `
      <p>
        Dear <strong>${name}</strong>, across the chapters above you saw your 9-planet blueprint and your upcoming opportunity windows. <strong>Now ask the ruthless diagnostic question:</strong> If your chart carries such strong capability, <em>why do your biggest breakthroughs still face friction at the 99th percentile? And why hasn't your 100% effort converted into the bank balance and peace of mind you deserve?</em>
      </p>

      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4 break-words">
        <div class="font-bold text-red-300 text-base">
          <i class="fas fa-biohazard mr-2"></i> 3 Unseen Astrological Blockages Silently Sabotaging Your Chart:
        </div>
        <p class="text-sm mb-0">
          <strong>1. Badhakesh (${badhakaInfo.meta.en}) & Functional Maraka Lock:</strong> For your ${RASHI_DATA[asc].en} base, <strong>${badhakaInfo.meta.en}</strong> acts as the chief obstructor. ${isManglik ? `Simultaneously, Mars in ${RASHI_DATA[mars.d1].en} injects fiery Kuja friction into your relationship and partnership axis.` : `Simultaneously, your functional Marakas (${lagnaMatrix.marakas.join(" & ")}) create subtle energy drains during stressful transits.`}
        </p>
        <p class="text-sm mb-0">
          <strong>2. Rahu (${RASHI_DATA[rahu.d1].en}) – Ketu (${RASHI_DATA[ketu.d1].en}) Nodal Trap:</strong> Your Rahu-Ketu axis triggers overthinking, sudden distraction, or misplaced trust right when a major career or financial milestone is about to lock in (especially during your <strong>${timeline.cautionWindow}</strong> caution window).
        </p>
        <p class="text-sm mb-0">
          <strong>3. ${isFull ? `Critical Ashtakavarga Energy Drain in House ${weakestHouse} (Only ${minBindu} Bindus):` : "Unverified Birth-Time Degree & Bhava Chalit Lock:"}</strong> ${isFull ? `Your ${weakestHouse}th House (${BHAVA_MEANINGS[weakestHouse].en}) holds the lowest bindu reservoir in your entire chart while you navigate the ${dasha.md}–${dasha.ad} Dasha.` : "Without verifying your exact birth-time degrees in Bhava Chalit and Shadbala, a key wealth-giving planet can remain dormant (sleeping) for years."}
        </p>
      </div>

      <p class="text-amber-200 font-semibold mb-0">
        ⚠️ <strong>Why Generic Internet Remedies & Random Gemstones Are Dangerous:</strong> Wearing a gemstone without verifying your exact longitudinal degrees (0°–30°), Bhava Chalit shifts, and sleeping planets in Lal Kitab can accidentally supercharge your Badhakesh or Maraka planet! Connect directly with <strong>Gyanendra S. Tomar</strong> via the consultation card to get your 100% hand-calculated degree report, 5-year month-by-month timeline, and safe Vedic & Lal Kitab remedies.
      </p>
      ${!isFull ? buildRedBirthTimePrompt("en") : ""}
    `;
  }

  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart } = ctx;
    const jupRashiId = (chart && chart.Jupiter) ? chart.Jupiter.d1 : 9;
    const jupRashi = RASHI_DATA[jupRashiId];
    const headingEl = document.getElementById("dakshinaHeading");
    const textEl = document.getElementById("contentDakshinaText");
    if (!headingEl || !textEl) return;

    if (lang === "hi") {
      headingEl.innerHTML = `पवित्र ऊर्जा विनिमय एवं गुरु-दक्षिणा संकल्प (Sacred Energy Exchange) 🙏`;
      textEl.innerHTML = `
        <p class="hindi">
          प्रिय <strong>${name}</strong>, अभी आपने अपने व्यक्तित्व, करियर, धन, भावी जीवनसाथी और संतान के गूढ़ रहस्य देखे। आपकी कुंडली में देवगुरु बृहस्पति <strong>${jupRashi.hi}</strong> से आपके भाग्य को नियंत्रित कर रहे हैं। सनातन वैदिक परंपरा का शाश्वत नियम है — जब भी हम ज्योतिष जैसी पवित्र <em>ब्रह्म-विद्या</em> से अपने भविष्य और जीवनसाथी के रहस्यों को जानते हैं, तो आगे के <strong>नवग्रह फलित, वार्षिक भविष्यफल और गुप्त दोषों</strong> को पढ़ने से पूर्व <strong>'गुरु-दक्षिणा' (Energy Exchange)</strong> अर्पित करने से बृहस्पति देव का पूर्ण आशीर्वाद जागृत होता है।
        </p>
        <p class="hindi">
          यदि इस विश्लेषण ने आपके अतीत और मन के अनकहे सच को सटीकता से छुआ है, तो अपनी श्रद्धा एवं सामर्थ्य के अनुसार <strong>(₹51, ₹101, ₹251 या ₹501)</strong> की गुरु-दक्षिणा सामने दिए गए QR कोड पर अर्पित कर अपना शुभ संकल्प पूर्ण करें।
        </p>
      `;
    } else {
      headingEl.innerHTML = `Honor the Sacred Law of Energy Exchange (Guru Dakshina) 🙏`;
      textEl.innerHTML = `
        <p>
          Dear <strong>${name}</strong>, you have just uncovered your personality, career blueprint, wealth formula, future partner traits, and progeny yoga. In your chart, <strong>Jupiter (Brihaspati)</strong> operates through <strong>${jupRashi.en}</strong>. According to ancient Vedic tradition, before reading the deep <strong>9-Planet Verdicts, Yearly Predictions, and Hidden Traps</strong> below, offering a voluntary <strong>Guru Dakshina (Sacred Energy Exchange)</strong> awakens auspicious Guru-Kripa.
        </p>
        <p>
          If this reading accurately hit your past and unspoken inner truth, please offer a heartfelt <strong>Guru Dakshina (₹51, ₹101, ₹251, or ₹501 as per your Shraddha)</strong> via the UPI QR code — and send your screenshot on WhatsApp to receive Gyanendra Ji's blessings!
        </p>
      `;
    }
  }

  // ==========================================================================
  // 11. DYNAMIC DOM ORDERING & VISUAL CHARTS (NORTH INDIAN D1 & D9 + PANCHANG)
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
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 block" id="chBabyTag">Chapter 08 • Progeny, Childbirth & Santan Yoga</span>
            <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 break-words" id="chBabyTitle">Progeny Blueprint, First Child's Luck & Santan Yoga</h3>
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

    if (!ctx.chart.isFullChartMode || ctx.viewFilter === "numerology_8") {
      el.innerHTML = "";
      el.classList.add("hidden");
      return;
    }

    if (typeof window.VedicChartAnalyzer === "undefined") {
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
      panchangHtml = typeof window.VedicChartAnalyzer.renderPanchangAndGocharaBox === "function"
        ? window.VedicChartAnalyzer.renderPanchangAndGocharaBox(vd.chart, ctx.lang)
        : "";
      extraTablesHtml = `
        ${panchangHtml}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div class="rounded-3xl bg-slate-950/90 border border-cyan-400/40 p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold text-white mb-3"><i class="fas fa-bolt text-cyan-400 mr-2"></i>${ctx.lang === 'hi' ? 'षड्बल ग्रह-बल (Planetary Strength)' : 'Shadbala Planetary Strength'}</h3>
            ${window.VedicChartAnalyzer.renderShadbalaBars(vd.shadbala, ctx.lang)}
          </div>
          <div class="rounded-3xl bg-slate-950/90 border border-indigo-400/40 p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold text-white mb-3"><i class="fas fa-columns text-indigo-400 mr-2"></i>${ctx.lang === 'hi' ? 'भाव चलित तालिका (Bhava Chalit)' : 'Midpoint Bhava Chalit Table'}</h3>
            ${window.VedicChartAnalyzer.renderChalitTable(vd.chalit, ctx.lang)}
          </div>
        </div>
        <div class="rounded-3xl bg-slate-950/90 border border-emerald-400/40 p-4 md:p-6 mt-6">
          <h3 class="text-lg md:text-xl font-bold text-white mb-2"><i class="fas fa-hourglass-half text-emerald-400 mr-2"></i>${ctx.lang === 'hi' ? '120-वर्षीय विंशोत्तरी महादशा एवं अंतर्दशा सारणी' : '120-Year Vimshottari Mahadasha & Antardasha Calendar'}</h3>
          <p class="text-xs text-gray-400 mb-3">${ctx.lang === 'hi' ? 'किसी भी महादशा पर क्लिक करके उसके भीतर की सभी 9 अंतर्दशाओं की सटीक तारीखें देखें:' : 'Click any Mahadasha row below to expand its 9 Antardasha sub-periods with exact start & end dates:'}</p>
          ${window.VedicChartAnalyzer.renderDashaTimeline(vd.dasha, ctx.lang)}
        </div>
      `;
    } else {
      const synthChart = {};
      ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].forEach(k => {
        synthChart[k] = { rashi: ctx.chart[k].d1, d9: ctx.chart[k].d9, retro: ctx.chart[k].retro };
      });
      d1SVG = window.VedicChartAnalyzer.renderD1NorthChart(synthChart, { lang: ctx.lang, userName: ctx.name });
      d9SVG = renderD9Fn(synthChart, { lang: ctx.lang, userName: ctx.name });
    }

    el.innerHTML = `
      <div class="rounded-3xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-white/10">
          <div>
            <span class="text-[11px] uppercase tracking-widest text-amber-400 font-bold block">
              ${ctx.chart.isExactAstronomyMode
                ? (ctx.lang === 'hi' ? '✦ 99.99% सटीक उत्तर-भारतीय लग्न एवं नवांश कुंडली' : '✦ 99.99% True Lahiri North-Indian Birth Charts')
                : (ctx.lang === 'hi' ? '✦ उत्तर-भारतीय लग्न एवं नवांश कुंडली' : '✦ North-Indian D1 & D9 Charts')}
            </span>
            <h3 class="text-lg md:text-2xl font-bold text-white mt-0.5"><i class="fas fa-star text-amber-400 mr-2"></i>${ctx.lang === 'hi' ? 'जन्म लग्न कुंडली (D1) एवं नवांश कुंडली (D9)' : 'Lagna Chart (D1) & Navamsa Chart (D9)'}</h3>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          <div id="d1ChartWrapper" class="rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-white p-1.5 shadow-xl">${d1SVG}</div>
          <div id="d9ChartWrapper" class="rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-white p-1.5 shadow-xl">${d9SVG}</div>
        </div>
      </div>
      ${extraTablesHtml}
    `;
  }

  function renderCalibrationBannerAndSwitcher(ctx) {
    const calEl = document.getElementById("calibrationBanner");
    const togEl = document.getElementById("modeToggleContainer");

    if (calEl) {
      if (ctx.chart.isExactAstronomyMode && window.__jtVedicData) {
        const meta = window.__jtVedicData.chart.meta;
        const conf = window.__jtVedicData.chart.Asc.lagnaConfidence || "exact";
        const confTag = conf === "unconfirmed"
          ? (ctx.lang === "hi" ? "⚠️ अनुमानित समय (±2 घंटे) — लग्न संधि संभव" : "⚠️ Rough Birth Time (±2 hrs) — Borderline Lagna")
          : (ctx.lang === "hi" ? "✓ 99.99% लहिरी चित्रापक्ष अयनांश सत्यापित" : "✓ 99.99% True Lahiri Chitrapaksha Verified");

        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div><i class="fas fa-check-circle text-emerald-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? '99.99% सटीक जन्म-समय एवं स्थान कुंडली सक्रिय:' : '99.99% Exact Astronomical Birth Chart Active:'}</strong>
          ${meta.name} (${meta.lat.toFixed(2)}°N, ${meta.lng.toFixed(2)}°E) • Ayanamsa: ${meta.ayanamsa.toFixed(2)}°</div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold shrink-0">${confTag}</span>
        </div>`;
      } else if (ctx.chart.isFullChartMode) {
        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200">
          <i class="fas fa-check-circle text-emerald-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? 'मैनुअल ग्रह-स्थिति मोड सक्रिय:' : 'Custom Planetary Matrix Active:'}</strong>
          ${ctx.lang === 'hi' ? 'आपके द्वारा चुने गए लग्न (D1), नक्षत्र और नवांश (D9) के आधार पर संपूर्ण फलित।' : 'Full Parashari & Navamsa reading calibrated to your custom planetary inputs.'}
        </div>`;
      } else {
        const moonShiftNoteHi = ctx.chart.moonShiftedSignThatDay
          ? ` (नोट: आपके जन्म के दिन चंद्रमा ने <strong>${RASHI_DATA[ctx.chart.moonStartRashi].hi}</strong> और <strong>${RASHI_DATA[ctx.chart.moonEndRashi].hi}</strong> के बीच राशि परिवर्तन किया था!)`
          : "";
        const moonShiftNoteEn = ctx.chart.moonShiftedSignThatDay
          ? ` (Note: On your birth date, the Moon transitioned between <strong>${RASHI_DATA[ctx.chart.moonStartRashi].en}</strong> and <strong>${RASHI_DATA[ctx.chart.moonEndRashi].en}</strong>!)`
          : "";

        calEl.innerHTML = `
          <div class="p-4 rounded-2xl bg-red-950/90 border-2 border-red-500 text-xs md:text-sm text-red-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 shadow-xl danger-glow">
            <div class="space-y-1">
              <div class="font-extrabold text-red-300 text-sm md:text-base flex items-center gap-2">
                <i class="fas fa-exclamation-triangle text-red-400 animate-bounce"></i>
                <span>${ctx.lang === 'hi' ? '🔴 ध्यान दें: आपने केवल जन्म-तिथि (Date of Birth) भरी है!' : '🔴 IMPORTANT: You Only Entered Your Date of Birth!'}</span>
              </div>
              <p class="mb-0 text-red-100/95 leading-relaxed">
                ${ctx.lang === 'hi'
                  ? `यह विश्लेषण आपकी जन्म-तिथि के दोपहर 12:00 IST के वास्तविक सूर्य-चंद्र ग्रहों और चैल्डियन अंक-ज्योतिष पर आधारित है${moonShiftNoteHi}। <strong>यदि आपको अपना जन्म-समय और जन्म-स्थान (शहर) भी पता है, तो उसे ऊपर फॉर्म में अवश्य भरें—जिससे हम आपकी लग्न कुंडली (D1), नवांश (D9), 337-बिंदु अष्टकवर्ग और महादशा की तारीखों के साथ 99.99% सटीक विश्लेषण दे सकें!</strong>`
                  : `This reading is calibrated using your birth date's 12:00 PM Noon Natal Planets and Chaldean Numerology${moonShiftNoteEn}. <strong>If you also know your Birth Time & Place (City), enter them above so we can unlock your 99.99% Accurate Lagna Chart (D1), Navamsa (D9), 337-Bindu Ashtakavarga & Exact 120-Year Mahadasha Dates!</strong>`}
              </p>
            </div>
            <button type="button" onclick="window.focusBirthTimeInput()" class="shrink-0 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs md:text-sm shadow-lg transition transform hover:-translate-y-0.5 text-center">
              <i class="fas fa-clock mr-1.5"></i>${ctx.lang === 'hi' ? 'जन्म-समय और शहर जोड़ें (99.99% सटीक) ↑' : 'Add Birth Time & City (99.99% Accuracy) ↑'}
            </button>
          </div>
        `;
      }
    }

    if (togEl) {
      togEl.classList.add("hidden");
    }
  }

  function applyViewFilterVisibility(ctx) {
    const isFull = ctx.chart.isFullChartMode;
    const ch9 = document.getElementById("chapter-lagnas");
    if (ch9) ch9.style.display = isFull ? "" : "none";

    const navPills = document.querySelectorAll('.chapter-nav-pill[href="#chapter-lagnas"]');
    navPills.forEach(p => { p.style.display = isFull ? "" : "none"; });
  }

  // ==========================================================================
  // 12. HEADINGS, MASTHEAD, METRICS & SCROLLSPY CONTROLLER
  // ==========================================================================

  function updateChapterHeadingsAndNav(lang, ctx) {
    const isFull = ctx.chart.isFullChartMode;
    const cy = ctx.numData.currentYear;

    const labels = lang === "hi" ? {
      ch1Tag: "अध्याय 01 • आंतरिक मनोविज्ञान एवं अतीत सत्यापन",
      ch1Title: "आपका अनकहा व्यक्तित्व, अतीत की घटना एवं नाम-स्पंदन",
      ch2Tag: "अध्याय 02 • मेधा, स्मरण शक्ति एवं पंचमेश सिद्धांत",
      ch2Title: "शिक्षा, फोकस पैटर्न एवं व्यावहारिक कौशल",
      ch3Tag: "अध्याय 03 • कर्म क्षेत्र, दशमेश सिद्धांत एवं अधिकार",
      ch3Title: "नौकरी बनाम स्वतंत्र व्यापार एवं कार्यक्षेत्र का सच",
      ch4Tag: "अध्याय 04 • अर्थ, मनी लीक एवं धनेश-लाभेश सूत्र",
      ch4Title: "धन संचय सूत्र, अचानक खर्च एवं संपत्ति लॉक-इन नियम",
      ch5Tag: "अध्याय 05 • भाग्येश सिद्धांत एवं स्वर्णिम आयु वर्ष",
      ch5Title: "भाग्योदय का रहस्य एवं जीवन बदलने वाले आयु वर्ष",
      ch6Tag: "अध्याय 06 • प्रेम जीवन एवं भावनात्मक संबंध",
      ch6Title: "प्रेम में समर्पण, भावनात्मक मोड़ एवं रिश्तों का सच",
      ch7Tag: "अध्याय 07 • भावी जीवनसाथी का रंग-रूप, स्वभाव एवं दिशा",
      ch7Title: "जीवनसाथी की आभा, सप्तमेश फल एवं विवाह की शुभ दिशा",
      chBabyTag: "अध्याय 08 • संतान सुख, पंचम दृष्टि एवं संतान-भाग्य",
      chBabyTitle: "संतान का स्वभाव, पंचमेश समीकरण एवं माता-पिता का भाग्योदय",
      ch8Tag: isFull ? "अध्याय 09 • नवग्रह गहन पाराशरी विश्लेषण एवं दृष्टियां" : "अध्याय 09 • जन्म-दिवस के नवग्रह एवं प्रत्यक्ष जीवन फल",
      ch8Title: isFull ? "सभी 9 ग्रहों का भाव-स्वामित्व फल, सक्रियता आयु एवं दृष्टि चेतावनी" : "आपके जन्म-दिवस के सभी 9 ग्रहों का जीवन, करियर व स्वास्थ्य पर सीधा प्रभाव",
      ch9Tag: "अध्याय 10 • विशेष लग्न एवं 337-बिंदु अष्टकवर्ग",
      ch9Title: "चंद्र, सूर्य, नवांश, आरूढ़ लग्न एवं प्रमाणित पाराशरी अष्टकवर्ग (BAV/SAV)",
      ch10Tag: `अध्याय 11 • सक्रिय महादशा, ${cy}–${cy + 3} वार्षिक भविष्यफल एवं ग्रह-बाधा चेतावनी`,
      ch10Title: `वर्तमान दशा, वर्ष-दर-वर्ष भविष्यवाणी एवं नौकरी/विवाह/संतान में ग्रह-अवरोध निदान`,
      ch11Title: "⚠️ आपकी प्रगति को भीतर ही भीतर रोकने वाले 3 गुप्त ग्रह-अवरोध"
    } : {
      ch1Tag: "Chapter 01 • Inner Psychology & Past Verification",
      ch1Title: "Your Unspoken Personality, Past Event Verification & Name Code",
      ch2Tag: "Chapter 02 • Intellect, Memory & 5th-Lord Synthesis",
      ch2Title: "Education, Focus Pattern & Practical Mastery",
      ch3Tag: "Chapter 03 • Karma, 10th-Lord Synthesis & Authority",
      ch3Title: "Job vs. Independent Command & Workplace Reality",
      ch4Tag: "Chapter 04 • Wealth Formula, Money Leaks & Asset Rule",
      ch4Title: "Wealth Potential, Money Leaks & Multi-Crore Lock-In Formula",
      ch5Tag: "Chapter 05 • Bhagya, 9th-Lord Grace & Golden Ages",
      ch5Title: "Your Luck Factor & Crucial Destiny Turning-Point Ages",
      ch6Tag: "Chapter 06 • Romance, Heartbreak & Attachment",
      ch6Title: "Love Life, Emotional Chemistry & Relationship Patterns",
      ch7Tag: "Chapter 07 • Future Partner Appearance, Nature & Direction",
      ch7Title: "Future Life Partner Traits, 7th-Lord Fruit & Marriage Direction",
      chBabyTag: "Chapter 08 • Progeny Blueprint, 5th-Axis Aspects & Santan Yoga",
      chBabyTitle: "First Child's Nature, Post-Baby Luck & Progeny Diagnosis",
      ch8Tag: isFull ? "Chapter 09 • All 9 Planets In-Depth: Lordship, Verdicts & Aspects" : "Chapter 09 • Your Birth-Date Natal Planets & Real-Life Impact",
      ch8Title: isFull ? "Parashari Lordship Rules, Trigger Ages & Aspect Warnings for All 9 Planets" : "How All 9 Natal Planets on Your Birthday Shape Your Life, Health & Peak Ages",
      ch9Tag: "Chapter 10 • Special Lagnas & 337-Bindu Ashtakavarga",
      ch9Title: "Special Lagnas (Chandra, Surya, Navamsa, Arudha) + Verified 337-Bindu SAV",
      ch10Tag: `Chapter 11 • Active Dasha, ${cy}–${cy + 3} Yearly Predictions & Planetary Sabotage Alerts`,
      ch10Title: `Active Mahadasha, Year-by-Year Forecast & Job/Marriage/Childbirth Obstruction Alerts`,
      ch11Title: "⚠️ The 3 Hidden Astrological Blockages Silently Sabotaging Your Progress"
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
        ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "99.99% सटीक जन्म-समय वैदिक कुंडली + उत्तर-भारतीय D1/D9 चार्ट" : "99.99% True Astronomical Vedic Chart + North-Indian D1/D9 Dossier"}`
        : (ctx.chart.isFullChartMode
            ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "99.9% पूर्ण वैदिक कुंडली + अष्टकवर्ग डॉसियर" : "99.9% Full Parashari + Jaimini + 337-SAV Dossier"}`
            : `<i class="fas fa-star mr-1.5"></i> ${lang === "hi" ? "सूर्य-चंद्र नक्षत्र एवं चैल्डियन जन्म-तिथि डॉसियर" : "Natal Solar-Lunar & Chaldean Date-of-Birth Dossier"}`);
    }

    if (headerNameEl) {
      headerNameEl.textContent = lang === "hi"
        ? `${ctx.name} की संपूर्ण जीवन एवं भविष्य कुंडली`
        : `${ctx.name}'s Complete Life & Destiny Dossier`;
    }

    if (headerSubEl) {
      const sunName = lang === "hi" ? RASHI_DATA[ctx.chart.Sun.d1].hi : RASHI_DATA[ctx.chart.Sun.d1].en;
      const ascName = lang === "hi" ? RASHI_DATA[ctx.chart.Asc.d1].hi : RASHI_DATA[ctx.chart.Asc.d1].en;
      const moonName = lang === "hi" ? RASHI_DATA[ctx.chart.Moon.d1].hi : RASHI_DATA[ctx.chart.Moon.d1].en;
      if (isFull) {
        headerSubEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob} (आयु ${ctx.numData.age})</strong> • मूलांक: <strong>${ctx.numData.mulank}</strong> • भाग्यांक: <strong>${ctx.numData.bhagyank}</strong> • लग्न: <strong>${ascName}</strong> • चंद्र: <strong>${moonName}</strong> • दशा: <strong>${PLANET_META[ctx.dasha.md].hi}–${PLANET_META[ctx.dasha.ad].hi}</strong>`
          : `DOB: <strong>${ctx.dob} (Age ${ctx.numData.age})</strong> • Mulank: <strong>${ctx.numData.mulank}</strong> • Bhagyank: <strong>${ctx.numData.bhagyank}</strong> • Lagna: <strong>${ascName}</strong> • Moon: <strong>${moonName}</strong> • Dasha: <strong>${ctx.dasha.md}–${ctx.dasha.ad}</strong>`;
      } else {
        headerSubEl.innerHTML = lang === "hi"
          ? `जन्म: <strong>${ctx.dob} (आयु ${ctx.numData.age})</strong> • मूलांक: <strong>${ctx.numData.mulank}</strong> • भाग्यांक: <strong>${ctx.numData.bhagyank}</strong> • सूर्य राशि: <strong>${sunName}</strong> • चंद्र नक्षत्र: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • व्यक्तिगत वर्ष: <strong>PY-${ctx.numData.personalYear}</strong>`
          : `DOB: <strong>${ctx.dob} (Age ${ctx.numData.age})</strong> • Mulank: <strong>${ctx.numData.mulank}</strong> • Bhagyank: <strong>${ctx.numData.bhagyank}</strong> • Natal Sun: <strong>${sunName}</strong> • Moon: <strong>${moonName} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})</strong> • Personal Year: <strong>PY-${ctx.numData.personalYear}</strong>`;
      }
    }

    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[ctx.chart.Asc.d1];
    const sav7 = ctx.specialLagnas.houseBindus[7];
    const sav10 = ctx.specialLagnas.houseBindus[10];
    const waSummary = encodeURIComponent(
      `Namaste Gyanendra Ji 🙏\nI just read my Life Dossier on Jyotish Tark.\n` +
      `• Name: ${ctx.name} | DOB: ${ctx.dob}\n` +
      `• Mulank ${ctx.numData.mulank} / Bhagyank ${ctx.numData.bhagyank} / Name No. ${ctx.chaldean.single}\n` +
      `• ${isFull ? `Lagna: ${RASHI_DATA[ctx.chart.Asc.d1].en}` : `Natal Sun: ${RASHI_DATA[ctx.chart.Sun.d1].en}`} | Moon: ${RASHI_DATA[ctx.chart.Moon.d1].en} (${NAKSHATRA_DATA[ctx.chart.Moon.nak].name})\n` +
      `• ${isFull ? `Active Dasha: ${ctx.dasha.md}-${ctx.dasha.ad} | Badhakesh: ${lagnaMatrix.badhakesh} | SAV (7H:${sav7}, 10H:${sav10})` : `Personal Year: PY-${ctx.numData.personalYear}`}\n` +
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
    const mins = Math.max(25, Math.min(45, Math.round(wordCount / 120) + 12));
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
      const dasha          = resolveActiveDasha(chart, numData);
      const timeline       = computeLifeEventTimeline(numData, chart, planetAnalysis);

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
        dasha,
        timeline,
        viewFilter: window.__jtViewFilter || "full_12",
        vedicData: window.__jtVedicData
      };

      ctx.displayAsc     = chart.isFullChartMode ? RASHI_DATA[ctx.chart.Asc.d1].en : `${RASHI_DATA[ctx.chart.Sun.d1].en} (Surya Base)`;
      ctx.displayMoon    = RASHI_DATA[ctx.chart.Moon.d1].en;
      ctx.displayMoonNak = NAKSHATRA_DATA[ctx.chart.Moon.nak].name;
      window.__jyotishLastCtx = ctx;

      ensureChildbirthSectionAndMiddleDakshina();

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
      setHtml("contentChildbirth",      buildChapterChildbirth(ctx));
      updateChapter12Dakshina(ctx);
      setHtml("contentPlanetsAspects",  buildChapter8PlanetsAndAspects(ctx));
      setHtml("contentSpecialLagnas",   buildChapter9SpecialLagnas(ctx));
      setHtml("contentTimePhase",       buildChapter10TimePhase(ctx));
      setHtml("contentHiddenTraps",     buildChapter11HiddenTraps(ctx));

      renderCalibrationBannerAndSwitcher(ctx);
      renderVedicExtraSections(ctx);
      applyViewFilterVisibility(ctx);

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
          setTimeout(() => outputContainer.scrollIntoView({behavior: "smooth", block: "start"}), 100);
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
