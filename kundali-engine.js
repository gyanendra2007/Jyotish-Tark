/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js • v6.5 (Unified Exact-Astronomy + v5.0 Anti-Repeat Edition)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * UNIFIED CAPABILITIES:
 * 1. Exact Birth-Time Mode (via birth-chart-calculator.js + vedic-chart-analyzer.js):
 *    - True Lahiri Sidereal Lagna, Planetary Degrees (0°-30°), Vakri Detection
 *    - North Indian D1 SVG + South Indian D9 Navamsa SVG + PNG Download
 *    - Midpoint Bhava Chalit Table, Shadbala Bars & Calendar-Date Dasha Timeline
 * 2. DOB-Only Derived Mode (When Birth Time/Place is not entered):
 *    - Full 12-Chapter Solar-Lunar & Chaldean Blueprint with Derived Lagna,
 *      Moon Nakshatra, D9 Maturity & 337-Bindu Ashtakavarga + Optional 8-Chapter
 *      Pure Numerology View Switcher.
 * 3. v5.0 Session-Aware Anti-Repeat & Twin-Differentiated Narrative Engine:
 *    - Multiple searches in the same browser never repeat cold-reading hooks.
 *    - Deduplicated D1/D9 Marriage Directions & True Parashari Maturity Ages.
 * ============================================================================
 */

(function () {
  "use strict";

  window.__jtMode = window.__jtMode || "derived"; // "vedic" | "manual" | "derived" | "numerology"
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

  // True Parashari Planetary Maturity Ages (Graha Pakva Ayu)
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

  const LAGNA_FUNCTIONAL_MATRIX = {
    1: { // Mesha (Aries)
      yogakaraka: ["Sun", "Jupiter"],
      benefics: ["Sun", "Moon", "Mars", "Jupiter"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Venus", "Saturn"],
      badhakaHouse: 11, badhakesh: "Saturn",
      secretWeaknessEn: "impulsive trust, sudden bursts of righteous anger that fade within minutes, and fighting everyone else's battles while hiding your own exhaustion",
      secretWeaknessHi: "आवेग में आकर भरोसा करना, क्षणिक क्रोध जिसके बाद आपको स्वयं ग्लानि होती है, और अपनी थकान छिपाकर दूसरों की जिम्मेदारियां अपने सिर ले लेना"
    },
    2: { // Vrishabha (Taurus)
      yogakaraka: ["Saturn"],
      benefics: ["Saturn", "Mercury", "Venus", "Sun"],
      malefics: ["Jupiter", "Moon", "Mars"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 9, badhakesh: "Saturn",
      secretWeaknessEn: "silent stubbornness, holding onto past emotional wounds for years without speaking, and sacrificing personal desires to keep family stability intact",
      secretWeaknessHi: "भीतर ही भीतर पुरानी बातों को वर्षों तक दबाए रखना, जिद्दी स्वाभिमान और परिवार की स्थिरता के लिए अपनी इच्छाओं का चुपचाप त्याग करना"
    },
    3: { // Mithuna (Gemini)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Sun"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "two parallel tracks of thought running 24/7 in your head, late-night mental replay of conversations, and feeling intellectually lonely even in a room full of people",
      secretWeaknessHi: "दिमाग में 24 घंटे दो समानांतर विचारों का चलना, रात्रि में अत्यधिक ओवरथिंकिंग और भीड़ में भी अपने बौद्धिक स्तर का साथी न मिल पाने का एकाकीपन"
    },
    4: { // Karka (Cancer)
      yogakaraka: ["Mars"],
      benefics: ["Mars", "Jupiter", "Moon"],
      malefics: ["Venus", "Mercury", "Saturn"],
      marakas: ["Saturn", "Mercury"],
      badhakaHouse: 11, badhakesh: "Venus",
      secretWeaknessEn: "absorbing the emotional stress of people around you like a sponge, giving 100% loyalty to those who return 30%, and silent internal mood tides",
      secretWeaknessHi: "दूसरों के दुख और तनाव को अपने भीतर सोख लेना, उन लोगों को 100% वफादारी देना जो बदले में 30% भी नहीं लौटाते, और अचानक मन का उदास हो जाना"
    },
    5: { // Simha (Leo)
      yogakaraka: ["Mars"],
      benefics: ["Mars", "Sun", "Jupiter"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Saturn", "Venus"],
      badhakaHouse: 9, badhakesh: "Mars",
      secretWeaknessEn: "fierce royal pride that refuses to ask for help even when bleeding internally, and feeling taken for granted by the very people you shelter",
      secretWeaknessHi: "अटूट राजसी स्वाभिमान जिसके कारण आप टूटने पर भी किसी से मदद नहीं मांगते, और जिन लोगों की आप रक्षा करते हैं उन्हीं से अपेक्षित सम्मान न मिलना"
    },
    6: { // Kanya (Virgo)
      yogakaraka: ["Venus", "Mercury"],
      benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Moon"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 7, badhakesh: "Jupiter",
      secretWeaknessEn: "hyper-critical perfectionism, spotting micro-flaws that others miss, gut/nervous tension when plans go off-script, and acting as the unpaid fixer in relationships",
      secretWeaknessHi: "हर काम में पूर्णता (perfection) खोजने की आदत, सूक्ष्म से सूक्ष्म गलती को तुरंत पकड़ लेना, और रिश्तों में हमेशा दूसरों की समस्याएं सुलझाते रहना"
    },
    7: { // Tula (Libra)
      yogakaraka: ["Saturn"],
      benefics: ["Saturn", "Mercury", "Venus"],
      malefics: ["Sun", "Mars", "Jupiter"],
      marakas: ["Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Sun",
      secretWeaknessEn: "swallowing your own hurt to preserve surface harmony until you suddenly detach forever, and second-guessing yourself at major life crossroads",
      secretWeaknessHi: "शांति बनाए रखने के लिए अपनी भावनाओं को दबाना—और जब सहनशक्ति की सीमा समाप्त हो जाए तो बिना शोर किए पूरी तरह तटस्थ (detach) हो जाना"
    },
    8: { // Vrishchika (Scorpio)
      yogakaraka: ["Moon", "Jupiter"],
      benefics: ["Sun", "Moon", "Jupiter", "Mars"],
      malefics: ["Mercury", "Venus", "Saturn"],
      marakas: ["Mercury", "Venus"],
      badhakaHouse: 9, badhakesh: "Moon",
      secretWeaknessEn: "living in 'all-or-nothing' extremes, radar-like suspicion born from past betrayals, and locking your deepest emotional scars inside an unbreakable vault",
      secretWeaknessHi: "'आर या पार' के चरम पर जीना, पूर्व में मिले विश्वासघात के कारण किसी पर आसानी से भरोसा न कर पाना और अपने गहरे घाव किसी को न दिखाना"
    },
    9: { // Dhanu (Sagittarius)
      yogakaraka: ["Sun", "Mars"],
      benefics: ["Sun", "Mars", "Jupiter"],
      malefics: ["Venus", "Saturn", "Mercury"],
      marakas: ["Venus", "Saturn"],
      badhakaHouse: 7, badhakesh: "Mercury",
      secretWeaknessEn: "blunt truth-speaking that unintentionally offends diplomatic people, secret restlessness that you haven't hit your true ceiling yet, and guiding people who don't value your wisdom",
      secretWeaknessHi: "बिना लाग-लपेट के सच बोल देना जिससे स्वार्थी लोग दूरी बना लेते हैं, और भीतर ही भीतर यह बेचैनी कि आप अभी अपने असली मुकाम तक नहीं पहुंचे हैं"
    },
    10: { // Makara (Capricorn)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Mercury", "Saturn"],
      malefics: ["Mars", "Jupiter", "Moon"],
      marakas: ["Moon", "Mars", "Jupiter"],
      badhakaHouse: 11, badhakesh: "Mars",
      secretWeaknessEn: "growing up too early emotionally, carrying a quiet fear of failure behind a stoic face, and feeling that everyone leans on your shoulder while you have no one to lean on",
      secretWeaknessHi: "उम्र से पहले जिम्मेदार हो जाना, चट्टान जैसे चेहरे के पीछे असफलता का अनकहा डर और यह एहसास कि सब आप पर टिके हैं पर आपके कंधे को सहारा देने वाला कोई नहीं"
    },
    11: { // Kumbha (Aquarius)
      yogakaraka: ["Venus"],
      benefics: ["Venus", "Sun", "Mars", "Saturn"],
      malefics: ["Jupiter", "Moon", "Mercury"],
      marakas: ["Jupiter", "Moon"],
      badhakaHouse: 9, badhakesh: "Venus",
      secretWeaknessEn: "deep inner detachment even while smiling in social gatherings, irregular sleep from a brain that lives five years in the future, and clashing with egoistic partners",
      secretWeaknessHi: "समाज में सबके साथ घुलने-मिलने के बावजूद भीतर से गहरा वैराग्य, रात्रि में अति-सक्रिय मस्तिष्क के कारण नींद में खलल और स्वाभिमानी जीवनसाथी से वैचारिक टकराव"
    },
    12: { // Meena (Pisces)
      yogakaraka: ["Mars", "Moon"],
      benefics: ["Moon", "Mars", "Jupiter"],
      malefics: ["Sun", "Venus", "Saturn", "Mercury"],
      marakas: ["Mercury", "Venus", "Saturn"],
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
  // 2. MULTI-VARIANT DYNAMIC NARRATIVE BANKS (ANTI-REPEAT ACROSS USERS)
  // ==========================================================================

  const DYNAMIC_HOOK_BANKS = {
    ch1Opening: [
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, most people in your life only know the controlled, polite version of you that you allow them to see. Beneath that surface, your chart is driven by a high-voltage tension between your <strong>${asc} Ascendant</strong> and your <strong>${moon} Moon</strong>.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, आपके जीवन के अधिकांश लोग केवल आपके उस शांत और नियंत्रित व्यक्तित्व को जानते हैं जो आप उन्हें दिखाने की अनुमति देते हैं। परंतु भीतर से आपकी कुंडली <strong>${asc} लग्न</strong> और <strong>${moon} चंद्रमा</strong> की दोहरी ऊर्जा से संचालित हो रही है।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, if someone judged you solely by your first impression, they would completely miss the storm of calculation, loyalty, and depth running inside your <strong>${asc} Lagna</strong> and <strong>${moon} Moon</strong> blueprint.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, यदि कोई व्यक्ति पहली मुलाकात में आपको परखने की कोशिश करे, तो वह आपके <strong>${asc} लग्न</strong> और <strong>${moon} राशि</strong> के भीतर चल रहे गहरे स्वाभिमान, विश्लेषण और संवेदनशीलता का अंदाजा भी नहीं लगा सकता।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, your birth chart carries a rare duality: the world sees the resilient armor of <strong>${asc}</strong>, while only your pillow at night knows the emotional depth of your <strong>${moon} Moon</strong>.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, आपकी जन्मपत्रिका में एक दुर्लभ द्वंद्व है—दुनिया को आपका <strong>${asc} लग्न</strong> का मजबूत कवच दिखाई देता है, जबकि आपके <strong>${moon} चंद्रमा</strong> की भावनात्मक गहराई को केवल आपका एकांत ही जानता है।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, you were not born with an ordinary, easy-to-read personality. The intersection of <strong>${asc} Ascendant</strong> with a <strong>${moon} lunar mind</strong> makes you someone who matures much faster than your peers.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, आपका जन्म किसी साधारण या आसानी से समझ में आने वाले व्यक्तित्व के साथ नहीं हुआ है। <strong>${asc} लग्न</strong> और <strong>${moon} चंद्रमा</strong> का संगम आपको अपनी उम्र के लोगों से कहीं अधिक परिपक्व और दूरदर्शी बनाता है।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, everyone comes to you when they need strength or a logical solution, yet very few pause to ask how much weight your <strong>${asc} Lagna</strong> and <strong>${moon} Moon</strong> are silently carrying.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, जब दूसरों को सहारे या सही सलाह की जरूरत होती है तो सब आपके पास आते हैं, परंतु बहुत कम लोग यह पूछते हैं कि आपके <strong>${asc} लग्न</strong> और <strong>${moon} मन</strong> ने भीतर कितना बोझ उठा रखा है।`
      },
      {
        en: (n, asc, moon) => `Dear <strong>${n}</strong>, there is a reason you have always felt slightly out of place among superficial crowds: your <strong>${asc} Ascendant</strong> and <strong>${moon} Moon</strong> are wired for substance, truth, and long-term legacy.`,
        hi: (n, asc, moon) => `प्रिय <strong>${n}</strong>, यही कारण है कि आपको दिखावटी भीड़ या नकली रिश्तों में कभी सुकून नहीं मिला—क्योंकि आपका <strong>${asc} लग्न</strong> और <strong>${moon} चंद्रमा</strong> केवल सत्य, गहराई और स्थायी स्वाभिमान के लिए बने हैं।`
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
        titleEn: "Why You Feel Misunderstood by Those Closest to You:",
        titleHi: "आपके अपने ही लोग आपको समझने में चूक क्यों करते हैं:",
        en: "When you care for someone, you express it through actions, sacrifice, and solving their real problems rather than sugary flattery. Because you don't advertise your struggles, people around you assume you don't hurt easily—when in truth, disloyalty from an inner-circle person wounds you deeper than anything else.",
        hi: "जब आप किसी को अपना मानते हैं, तो मीठी चुपड़ी बातों के बजाय उसके संकट में खड़े होकर अपना प्रेम दिखाते हैं। चूंकि आप अपने दुख का ढिंढोरा नहीं पीटते, इसलिए लोग मान लेते हैं कि आपको दर्द नहीं होता—जबकि अपनों का छोटा सा विश्वासघात भी आपको भीतर तक आहत कर देता है।"
      },
      {
        titleEn: "Your Prophetic Intuition & Pre-Cognition:",
        titleHi: "आपकी पूर्वाभास शक्ति (Pre-Cognition) का रहस्य:",
        en: "Have you noticed how your first instinctive gut feeling about a person, job, or deal almost always turns out to be 100% accurate six months later? Every major regret in your past happened only when you ignored your own inner voice to please family or society.",
        hi: "क्या आपने गौर किया है कि किसी इंसान, सौदे या फैसले के बारे में आपके मन में उठने वाली पहली आवाज (First Gut Feeling) 6 महीने बाद अक्षरशः सच साबित होती है? आपके जीवन में जब भी नुकसान हुआ है, तब-तब आपने दूसरों का मन रखने के लिए अपनी अंतरात्मा की आवाज को अनसुना किया है।"
      },
      {
        titleEn: "The Heavy Crown of Self-Reliance:",
        titleHi: "आत्मनिर्भरता का अनदेखा बोझ:",
        en: "From an early age, destiny forced you to become the emotionally mature one in the room. Even when your own life feels chaotic, you become the crisis-manager for friends or family. You rarely share your deepest fears because you hate being pitied.",
        hi: "कम उम्र से ही परिस्थितियों ने आपको मानसिक रूप से समय से पहले बड़ा बना दिया। जब आपका अपना जीवन उथल-पुथल में होता है, तब भी आप दूसरों को संभालने की भूमिका निभाते हैं। आपको किसी की सहानुभूति (sympathy) लेना पसंद नहीं, इसलिए आप अपने सबसे गहरे डर अपने भीतर ही रखते हैं।"
      },
      {
        titleEn: "Selective Social Battery & Solitude Hunger:",
        titleHi: "भीड़ से दूरी और एकांत से ऊर्जा पाने का गुण:",
        en: "You can be the most articulate, magnetic person at a gathering when required, yet small talk and fake social posturing drain your battery rapidly. You need periodic solitude to recharge your nervous system—and only 2 or 3 people on earth truly know the unfiltered you.",
        hi: "आवश्यकता पड़ने पर आप किसी भी महफिल के सबसे प्रभावशाली व्यक्ति बन सकते हैं, परंतु नकली औपचारिकताएं आपकी मानसिक ऊर्जा को जल्दी सोख लेती हैं। खुद को रिचार्ज करने के लिए आपको एकांत चाहिए होता है—और पूरी दुनिया में गिनती के 2-3 लोग ही आपके असली स्वरूप को जानते हैं।"
      },
      {
        titleEn: "Your Zero-Tolerance Filter for Disrespect:",
        titleHi: "स्वाभिमान के प्रति आपकी शून्य-सहनशीलता:",
        en: "You can forgive an honest mistake ten times, and you can adjust to financial or physical hardship without complaining—but the microsecond you sense arrogance, manipulation, or disrespect in someone's tone, an iron curtain drops inside your mind.",
        hi: "आप किसी की अनजाने में हुई गलती को दस बार माफ कर सकते हैं और कठिन से कठिन परिस्थिति में भी मुस्कुराकर गुजार सकते हैं—परंतु जैसे ही किसी के लहजे में आपको अहंकार, चालाकी या अनादर दिखता है, आपका मन तुरंत एक लोहे की दीवार खड़ी कर लेता है।"
      },
      {
        titleEn: "The Karmic Mirror Effect You Carry:",
        titleHi: "आपकी कुंडली का 'कार्मिक दर्पण' प्रभाव:",
        en: "Your aura acts like a karmic mirror: pure-hearted people feel instantly safe around you, while insecure or manipulative people feel inexplicably threatened by your presence even when you haven't said a word against them.",
        hi: "आपकी आभा एक 'कार्मिक दर्पण' की तरह काम करती है—साफ दिल के लोगों को आपके पास तुरंत सुकून मिलता है, जबकि कपटी या असुरक्षित (insecure) लोग बिना किसी कारण के आपकी उपस्थिति मात्र से असहज होने लगते हैं।"
      }
    ],

    ch2StudyPattern: [
      {
        en: "Your brain is built for deep architecture, not parrot-like memorization. Unless you understand the core logic behind a subject, your mind rebels against reading it. Under last-minute exam or deadline pressure, your adrenals unlock a hyper-focus state capable of mastering weeks of material in days—yet during slow routine weeks, parallel thoughts pull your focus away every 30 minutes.",
        hi: "आपका मस्तिष्क किसी विषय की जड़ को पकड़ने के लिए बना है, तोते की तरह रटने के लिए नहीं। जब तक आपको 'यह कैसे और क्यों काम करता है' समझ न आए, आपका मन किताब में नहीं लगता। डेडलाइन या परीक्षा का दबाव आते ही आप 1 महीने का काम 5 दिन में कर दिखाते हैं, पर सामान्य दिनों में विचारों की अधिकता एकाग्रता भंग करती है।"
      },
      {
        en: "You possess a diagnostic, visual memory: you remember concepts by how they connect to real life rather than page-by-page theory. People have often underestimated your preparation because you don't study for 12 robotic hours—yet your sharp intuition for high-probability questions repeatedly saves you in crunch moments.",
        hi: "आपकी स्मरण शक्ति 'विजुअल और तार्किक' है—आप किताबी परिभाषाओं के बजाय व्यावहारिक उदाहरणों से तुरंत सीखते हैं। आप दिखावे के लिए 12 घंटे किताब लेकर बैठने वालों में से नहीं हैं, लेकिन कम समय में सबसे महत्वपूर्ण बिंदुओं को पकड़ लेने की आपकी क्षमता सबको चौंका देती है।"
      },
      {
        en: "Your intellectual graph operates in intense waves. When a topic sparks your curiosity—whether technology, finance, human psychology, or strategy—you research it like an investigative scientist at 1 AM. However, forced syllabus repetition or uninspiring teachers quickly trigger mental boredom.",
        hi: "आपकी बौद्धिक ऊर्जा लहरों की तरह काम करती है। जब कोई विषय आपकी जिज्ञासा जगा देता है, तो आप रात के 1 बजे भी उस पर गहराई से शोध कर सकते हैं—परंतु उबाऊ और पुराने ढर्रे की पढ़ाई से आपका मन बहुत जल्दी ऊब जाता है।"
      },
      {
        en: "Since childhood, your biggest academic battle has never been IQ—it has been mental restlessness (Chitta-Vrittis). You can read two pages while a second track in your brain is simultaneously planning your future career, replaying an old conversation, or solving a completely different problem.",
        hi: "बचपन से ही आपकी असली चुनौती बुद्धि की कमी कभी नहीं रही, बल्कि 'मन की अति-सक्रियता' रही है। आप सामने खुली किताब के दो पन्ने पढ़ रहे होते हैं और ठीक उसी समय आपके दिमाग के पीछे भविष्य की योजनाएं या कोई पुराना संवाद समानांतर चल रहा होता है।"
      },
      {
        en: "You learn best by doing, reverse-engineering, and questioning authority. Whenever someone tells you 'just memorize this formula,' your brain slows down; whenever you see the practical application or competitive challenge, your retention triples.",
        hi: "आप स्वयं प्रयोग करके और प्रश्नों की तह में जाकर सबसे तेजी से सीखते हैं। जहाँ केवल रटने का दबाव हो वहाँ आपकी गति धीमी हो जाती है, और जहाँ तार्किक चुनौती या प्रतिस्पर्धा हो वहाँ आपकी क्षमता तीन गुना बढ़ जाती है।"
      },
      {
        en: "Your chart shows 'Multi-Domain Intelligence'—the ability to connect dots across completely different fields. While single-track students struggle outside their textbook, your mind naturally grasps practical execution, negotiation, and real-world problem solving.",
        hi: "आपकी कुंडली में 'बहु-आयामी मेधा' (Multi-Domain Intelligence) का योग है। केवल किताबी ज्ञान रखने वाले लोग जहाँ व्यावहारिक दुनिया में अटक जाते हैं, वहीं आपका दिमाग परिस्थिति के अनुसार तुरंत नया रास्ता निकाल लेता है।"
      }
    ],

    ch4MoneyLeak: [
      {
        en: "Look closely at your financial history: every time your liquid bank balance crosses a comfortable mental mark, an unexpected family duty, sudden health/vehicle repair, or urgent commitment mysteriously shows up to absorb the surplus. Moreover, money lent by you out of emotional sympathy rarely returns on time.",
        hi: "अपने पिछले अनुभवों पर गौर करें—जब भी आपके बैंक खाते में एक अच्छी बचत इकट्ठी होने लगती है, ठीक उसी समय कोई आकस्मिक पारिवारिक जिम्मेदारी, वाहन/स्वास्थ्य खर्च या अपनों की जरूरत सामने आकर उस बचत को सोख लेती है। साथ ही, भावुक होकर दिया गया उधार समय पर वापस नहीं मिलता।"
      },
      {
        en: "Your chart carries the 'Silent Provider' financial signature: you never hesitate to spend on quality or on the comfort of people you love, yet when it comes to your own desires, you calculate twice. Several times, trusting someone's verbal promise in a financial or career matter has cost you hard-earned money.",
        hi: "आपकी कुंडली में 'मौन पालनकर्ता' का धन-योग है—अपनों की खुशी या घर की जरूरत के लिए आप तुरंत खर्च कर देते हैं, पर अपनी स्वयं की इच्छाओं के समय सोचने लगते हैं। मौखिक भरोसे (verbal trust) पर किया गया लेन-देन या साझेदारी आपको पूर्व में आर्थिक चोट दे चुकी है।"
      },
      {
        en: "Money flows to you strongly when you have a clear target, but idle cash sitting in your primary bank account suffers from 'Sudden Vyaya Activation'—unplanned lifestyle leaks, helping ungrateful people, or impulsive stress-spending that leaves you wondering where the money went.",
        hi: "जब आपके सामने कोई बड़ा लक्ष्य होता है तो धन का प्रवाह तेजी से बनता है, परंतु सेविंग अकाउंट में निष्क्रिय पड़ा पैसा 'अचानक व्यय दोष' का शिकार हो जाता है—छोटे-छोटे अनदेखे खर्चों या दूसरों की मदद में वह राशि कब निकल जाती है, पता ही नहीं चलता।"
      },
      {
        en: "You have a karmic pattern with 'Unbilled Value': whether in work, business, or family, you often deliver 10x value while charging or receiving 3x because you feel awkward being ruthless about money with people you know.",
        hi: "आपके साथ 'अमूल्य योगदान' का एक विशेष पैटर्न जुड़ा है—चाहे कार्यक्षेत्र हो या परिवार, आप जितना देते हैं उसकी तुलना में आर्थिक या व्यावहारिक प्रतिफल कम मांगते हैं, क्योंकि अपनों के साथ पैसों को लेकर कठोर होना आपके स्वभाव में नहीं है।"
      },
      {
        en: "Notice how your biggest financial drains have never come from luxury—they have come from emotional decisions: backing the wrong person, delaying a tough financial boundary, or sudden domestic contingencies that arrived right when you planned to invest.",
        hi: "ध्यान दीजिए—आपका सबसे बड़ा आर्थिक नुकसान कभी आपके अपने शौक से नहीं हुआ, बल्कि भावनात्मक फैसलों से हुआ है: गलत इंसान पर भरोसा करना, संकोचवश समय पर 'ना' न कह पाना, या निवेश के ठीक समय पर अचानक घरेलू खर्च आ जाना।"
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
        en: "Your luck operates on the 'Gold-in-Fire Principle': easy things rarely come to you without a preliminary test of patience, yet when your breakthrough finally arrives, it is ten times more durable and respected than the quick luck of others.",
        hi: "आपका भाग्य 'अग्नि में तपे स्वर्ण' के सिद्धांत पर चलता है—छोटी से छोटी उपलब्धि भी पहले आपके धैर्य की परीक्षा लेती है, लेकिन जब आपका भाग्योदय फलित होता है, तो वह दूसरों की क्षणिक सफलता से दस गुना अधिक स्थायी और सम्मानजनक होता है।"
      },
      {
        en: "There is an uncanny pattern in your destiny: whenever you rely on someone else's recommendation or promise, the work stalls; the moment you take 100% solo command and stop expecting external help, unseen divine grace steps in from nowhere.",
        hi: "आपके प्रारब्ध का एक अचूक नियम है—जब भी आप किसी दूसरे व्यक्ति की सिफारिश या भरोसे पर निर्भर होते हैं, काम अटक जाता है; और जिस क्षण आप किसी से उम्मीद छोड़कर स्वयं कमान संभालते हैं, अचानक ईश्वरीय सहायता का मार्ग खुल जाता है।"
      },
      {
        en: "Your 9th house shows 'Place-Shift Activation': remaining stuck in the exact same room, routine, or childhood environment slows your luck down, whereas traveling, dealing with distant cities/foreign networks, or changing your work environment immediately unlocks stagnant fortune.",
        hi: "आपके भाग्य भाव में 'स्थान-परिवर्तन जागृति' का योग है—एक ही कमरे या पुराने ढर्रे में बंधे रहने से आपका भाग्य शिथिल पड़ता है, जबकि यात्रा, जन्मस्थान से दूर के संपर्क या कार्य-परिवेश में बदलाव करते ही रुका हुआ भाग्य तेजी से दौड़ने लगता है।"
      },
      {
        en: "Have you noticed that your life transforms in sharp 3-to-4 year leaps rather than slow linear inches? You go through quiet 'root-building phases' where nothing seems to move on the surface, followed by a sudden 6-month window where your entire status changes.",
        hi: "क्या आपने अनुभव किया है कि आपके जीवन में तरक्की धीरे-धीरे इंच-दर-इंच नहीं, बल्कि हर 3-4 वर्ष के अंतराल पर बड़ी छलांग (Quantum Leap) में होती है? लंबे समय तक शांत संघर्ष चलता है और फिर अचानक 6 महीनों के भीतर पूरा जीवन-स्तर बदल जाता है।"
      },
      {
        en: "Your Bhagya carries 'Crisis-Immunity': even when you have been cornered in situations where 99% of people would have broken down, an eleventh-hour intuition, mentor, or unexpected opening has always pulled you through safely.",
        hi: "आपके भाग्य में 'संकट-रक्षा कवच' विद्यमान है—जब-जब परिस्थितियां ऐसी बनीं जहाँ साधारण इंसान टूट जाता, तब-तब अंतिम घड़ी (11th hour) में किसी अदृश्य प्रेरणा या आकस्मिक सहयोग ने आपको सुरक्षित बाहर निकाला है।"
      }
    ],

    ch6LovePattern: [
      {
        en: "You remember the smallest details about the person you care for, defend their name behind their back, and show up when they are low. Yet your chart reveals a recurring test: once the other person feels 100% sure of your loyalty, they begin taking your availability for granted—while your pride refuses to beg for basic reciprocation.",
        hi: "आप जिससे प्रेम करते हैं उसकी छोटी-छोटी बातों का ध्यान रखते हैं और उसके पीठ पीछे भी उसका सम्मान बचाते हैं। परंतु आपकी कुंडली की भावनात्मक परीक्षा यह है कि जैसे ही सामने वाले को आपकी अटूट वफादारी का यकीन हो जाता है, वह आपको 'टेकन फॉर ग्रांटेड' लेने लगता है—और आपका स्वाभिमान भीख में समय या प्रेम मांगने की इजाजत नहीं देता।"
      },
      {
        en: "In relationships, you crave deep mental and soulful transparency, not just surface romance. When you sense emotional distance or half-truths, you don't scream immediately—you withdraw into silence and wait to see if your partner notices your pain without being told.",
        hi: "रिश्तों में आपको केवल बाहरी दिखावा नहीं, बल्कि मानसिक और आत्मिक पारदर्शिता चाहिए। जब आपको सामने वाले के व्यवहार में ठंडापन या अधूरा सच महसूस होता है, तो आप तुरंत शिकायत करने के बजाय शांत हो जाते हैं और देखते हैं कि क्या वह बिना कहे आपकी पीड़ा समझ पाता है या नहीं।"
      },
      {
        en: "Your heart has a 'Rescue-Magnet' tendency: you have historically attracted people who were emotionally confused, healing from their own chaos, or needing your strength to stabilize their life—leaving you emotionally drained when it was their turn to support you.",
        hi: "आपके हृदय में 'संकटमोचक आकर्षण' रहा है—अतीत में आपके जीवन में ऐसे लोग आकर्षित हुए जो स्वयं भावनात्मक रूप से उलझे हुए थे या जिन्हें संभलने के लिए आपके सहारे की जरूरत थी, परंतु जब आपको भावनात्मक सहारे की आवश्यकता पड़ी तो वे पीछे हट गए।"
      },
      {
        en: "Because you combine fierce self-respect with deep private tenderness, very few people know how to handle your heart properly: weak people get intimidated by your clarity, while selfish people try to exploit your forgiving nature until you shut them out.",
        hi: "चूंकि आपके भीतर कड़क स्वाभिमान और गहरी कोमलता दोनों एक साथ हैं, इसलिए बहुत कम लोग आपके दिल को सही ढंग से संभाल पाते हैं—कमजोर लोग आपकी स्पष्टता से घबरा जाते हैं और स्वार्थी लोग आपकी उदारता का फायदा उठाने की कोशिश करते हैं।"
      },
      {
        en: "You never fall in love easily or casually, which is why letting go of someone you once trusted takes you much longer than you admit to the world. Even when you look completely moved on externally, your mind demands logical closure.",
        hi: "आप आसानी से या सतही तौर पर किसी से दिल नहीं लगाते—और यही कारण है कि जिस पर आपने एक बार सच्चा भरोसा कर लिया, उस स्मृति से बाहर निकलने में आपको दुनिया के सामने दिखाए जाने से कहीं अधिक समय लगता है।"
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

    const userSignature = `${(ctx.name || "").toLowerCase().trim()}|${ctx.dob}|${ascD1}|${moonD1}|${moonNak}`;
    const chartSignature = `${ctx.dob}|${ascD1}|${moonD1}|${moonNak}|${ctx.numData.mulank}|${ctx.numData.bhagyank}`;

    let store = { byUser: {}, usedByBank: {} };
    try {
      const raw = sessionStorage.getItem("jt_seen_variants_v5");
      if (raw) store = JSON.parse(raw);
    } catch (e) {}

    store.byUser = store.byUser || {};
    store.usedByBank = store.usedByBank || {};

    if (store.byUser[userSignature] && typeof store.byUser[userSignature][bankKey] === "number") {
      return bankArray[store.byUser[userSignature][bankKey] % len];
    }

    const baseHash = hashString32(`${bankKey}|${chartSignature}|${ctx.chaldean.compound}`);
    let chosenIdx = baseHash % len;

    const usedList = store.usedByBank[bankKey] || [];
    if (usedList.length < len) {
      let step = 0;
      while (usedList.includes(chosenIdx) && step < len) {
        chosenIdx = (chosenIdx + 1) % len;
        step++;
      }
    } else {
      store.usedByBank[bankKey] = [];
    }

    store.byUser[userSignature] = store.byUser[userSignature] || {};
    store.byUser[userSignature][bankKey] = chosenIdx;
    store.usedByBank[bankKey] = store.usedByBank[bankKey] || [];
    if (!store.usedByBank[bankKey].includes(chosenIdx)) {
      store.usedByBank[bankKey].push(chosenIdx);
    }

    try {
      sessionStorage.setItem("jt_seen_variants_v5", JSON.stringify(store));
    } catch (e) {}

    return bankArray[chosenIdx];
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
  // 5. MATHEMATICAL & ASTROLOGICAL ENGINE FUNCTIONS
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
    const sunRashi = deriveSiderealSunRashi(numData.month, numData.day);
    const epochDays = Math.floor(new Date(numData.year, numData.month - 1, numData.day).getTime() / 86400000);

    const refEpoch2000 = Math.floor(new Date(2000, 0, 1).getTime() / 86400000);
    const daysSince2000 = epochDays - refEpoch2000;
    const lunarCycles = (daysSince2000 / 27.321661) + 0.52;
    const normPhase = ((lunarCycles % 1) + 1) % 1;
    const moonRashi = Math.min(12, Math.max(1, Math.floor(normPhase * 12) + 1));
    const moonNak = pickValidNakForRashi(moonRashi, Math.floor(normPhase * 27) + numData.day);

    const ascRashi  = ((sunRashi + numData.mulank + numData.bhagyank - 2) % 12) + 1;
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

    const ascNak  = pickValidNakForRashi(ascRashi, numData.day);
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
    // 1. If exact birth time & place was calculated via BirthChartCalculator + VedicChartAnalyzer:
    if (window.__jtVedicData && window.__jtVedicData.chart) {
      const vd = window.__jtVedicData;
      const converted = { isFullChartMode: true, isExactAstronomyMode: true };
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

    // 2. If user toggled Manual Planetary Matrix:
    const manualMatrixOpen = (document.getElementById("enableChartToggle") && document.getElementById("enableChartToggle").checked) ||
                             (document.getElementById("manualMatrixContainer") && !document.getElementById("manualMatrixContainer").classList.contains("hidden") && window.__jtManualMatrixActive);
    if (manualMatrixOpen) {
      const keys = ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
      const chart = { isFullChartMode: true, isExactAstronomyMode: false };
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

    // 3. Otherwise derive Solar-Lunar & Chaldean chart from DOB & Name:
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
      statusHi = "सर्वोच्च उच्च वर्गोत्तम (लग्न व नवांश में उच्च)";
      badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400";
    } else if (isExaltedD1 && isDebilitatedD9) {
      statusEn = "Uchcha-Bhanga Alert (Exalted in D1, Debilitated in D9)";
      statusHi = "उच्च-भंग सावधानी (लग्न में उच्च, नवांश में नीच)";
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
      statusHi = "वर्गोत्तम (D1 व D9 में एक ही राशि — दोगुना बल)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isExaltedD9 || isOwnD9) {
      statusEn = "Pushkara / D9-Fortified (Stronger After Age 28–32)";
      statusHi = "नवांश-बली (28–32 वर्ष व विवाह बाद प्रबल फल)";
      badgeClass = "bg-cyan-500/25 text-cyan-200 border-cyan-400/50";
    } else if (isDebilitatedD9) {
      statusEn = "D9-Sensitive (Requires Navamsa Pacification)";
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
    const lagnaLordRashi = chart[lagnaLordKey].d1;

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
    const lord12thRashi = chart[lord12thKey].d1;
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
  // 7. PROPORTIONAL VIMSHOTTARI MAHADASHA & ANTARDASHA ENGINE
  // ==========================================================================

  function resolveActiveDasha(chart, numData) {
    // 1. If exact astronomy dasha tree is present from VedicChartAnalyzer:
    if (window.__jtVedicData && window.__jtVedicData.dasha) {
      const vdDasha = window.__jtVedicData.dasha;
      const moonNakId = chart.Moon.nak || 1;
      return {
        md: vdDasha.mahadasha,
        ad: vdDasha.antardasha,
        mdActive: vdDasha.mdActive,
        adActive: vdDasha.adActive,
        isExactCalendarDasha: true,
        isManualDasha: false,
        birthDashaRuler: NAKSHATRA_DATA[moonNakId].ruler
      };
    }

    // 2. Manual or Nakshatra-Pada proportional calculation:
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
  // 8. NARRATIVE HELPER UTILITIES
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
  // 9. CHAPTER GENERATORS (CHAPTERS 1 TO 12 — FULL UNCUT v5.0 PROSE)
  // ==========================================================================

  function buildChapter1Personality(ctx) {
    const { lang, name, numData, chaldean, chart, planetAnalysis } = ctx;
    const ascRashi     = RASHI_DATA[chart.Asc.d1];
    const moonRashi    = RASHI_DATA[chart.Moon.d1];
    const sunRashi     = RASHI_DATA[chart.Sun.d1];
    const moonNak      = NAKSHATRA_DATA[chart.Moon.nak];
    const mulankArch   = MULANK_ARCHETYPES[numData.mulank];
    const bhagyankArch = MULANK_ARCHETYPES[numData.bhagyank];
    const lagnaMatrix  = LAGNA_FUNCTIONAL_MATRIX[chart.Asc.d1];
    const lagnaLordKey = ascRashi.lord;
    const lagnaLordInfo= planetAnalysis[lagnaLordKey];

    const openingHook  = pickUniqueVariant("ch1Opening", DYNAMIC_HOOK_BANKS.ch1Opening, ctx);
    const radarBox     = pickUniqueVariant("ch1RadarBox", DYNAMIC_HOOK_BANKS.ch1RadarBox, ctx);

    const ascLabelEn = chart.isFullChartMode ? "Ascendant (Lagna)" : "Derived Surya-Ank Lagna";
    const ascLabelHi = chart.isFullChartMode ? "जन्म लग्न (Udaya Lagna)" : "सूर्य-अंक लग्न (Derived)";

    const sigRow = (labelEn, labelHi, value) => `
      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-white/10 min-w-0 break-words">
        <div class="text-[10px] uppercase text-gray-400 font-bold truncate">${lang === "hi" ? labelHi : labelEn}</div>
        <div class="text-xs sm:text-sm font-bold text-amber-200 mt-0.5 break-words">${value}</div>
      </div>
    `;

    const signatureCard = `
      <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-3.5 sm:p-5 mb-6 max-w-full overflow-hidden">
        <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2.5 break-words">
          <i class="fas fa-fingerprint mr-1.5"></i>${lang === "hi" ? "आपका जन्म-चिह्न (पंच-स्तरीय वैदिक एवं चैल्डियन सिंथेसिस)" : "Your Master Birth Signature (5-Layer Vedic, Navamsa & Chaldean Synthesis)"}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${sigRow(ascLabelEn, ascLabelHi, `${lang === "hi" ? ascRashi.hi : ascRashi.en} <span class="text-gray-400 text-xs">(${ascRashi.lordHi})</span>`)}
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
        <p>${openingHook.hi(name, ascRashi.hi, moonRashi.hi)}</p>

        <p>
          <strong>1. आपका अनकहा मानसिक सच (मूलांक ${numData.mulank} + ${ascRashi.hi} लग्न):</strong> ${mulankArch.psychHi} इसके साथ ही ${ascRashi.hi} लग्न का गुप्त मनोवैज्ञानिक सत्य यह है कि आपमें <em>${lagnaMatrix.secretWeaknessHi}</em> की प्रवृत्ति गहराई से जुड़ी है। आप अपनी पीड़ा और थकान को दुनिया से छिपाकर मुस्कुराने की कला जानते हैं।
        </p>

        <p>
          <strong>2. बाहरी व्यक्तित्व बनाम एकांत का अंतर्मन:</strong> समाज के सामने आपकी कार्यशैली <strong>${ascRashi.hi}</strong> जैसी (<em>${ascRashi.temperamentHi}</em>) दिखती है, और लग्नेश <strong>${ascRashi.lordHi}</strong> के <strong>${lagnaLordInfo.bhava}वें भाव</strong> में बैठने से आपकी जीवन-ऊर्जा ${houseThemeShort(lagnaLordInfo.bhava, "hi")} के इर्द-गिर्द केंद्रित रहती है। किंतु एकांत में आपका मन <strong>${moonNak.name} नक्षत्र (${moonRashi.hi})</strong> से संचालित होता है—जो आपको <em>${moonNak.traitHi}</em> प्रदान करता है।
        </p>

        <p>
          <strong>3. आपके नाम की चैल्डियन ध्वनि तरंग ("${name}" = ${chaldean.compound} → ${chaldean.single}):</strong> चैल्डियन अंकशास्त्र के अनुसार आपके नाम का स्पंदन <code>${chaldean.breakdown} = ${chaldean.compound}</code> (मूल अंक <strong>${chaldean.single}</strong>) है। ${
            chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
              ? "यह एक दुर्लभ शुभ संयोग है कि आपके नाम का अंक आपके जन्म के मूलांक/भाग्यांक से सीधा तालमेल बिठा रहा है, जो संकट के अंतिम क्षण में अदृश्य रक्षा कवच देता है।"
              : `यहाँ एक सूक्ष्म अंतर है: आपकी जन्म-ऊर्जा अंक ${numData.mulank} और ${numData.bhagyank} पर चलती है, जबकि आपके पुकारे जाने वाले नाम की तरंग अंक ${chaldean.single} छोड़ती है। यही कारण है कि कई बार आपकी 100% ईमानदारी और मेहनत का श्रेय दूसरों को मिल जाता है या काम अंतिम पलों में रुकता है।`
          }
        </p>

        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4 break-words">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> ${radarBox.titleHi}</div>
          <p class="text-sm mb-0">${radarBox.hi}</p>
        </div>
      `;
    }

    return signatureCard + `
      <p>${openingHook.en(name, ascRashi.en, moonRashi.en)}</p>

      <p>
        <strong>1. Your Unspoken Psychological Reality (Mulank ${numData.mulank} + ${ascRashi.en} Lagna):</strong> ${mulankArch.psychEn} Layered onto this is the hidden signature of ${ascRashi.en} Lagna: a lifelong tendency toward <em>${lagnaMatrix.secretWeaknessEn}</em>. Even when you are navigating intense personal or financial pressure, you carry yourself with composed dignity.
      </p>

      <p>
        <strong>2. The Outer Mask vs. Your Inner Mind:</strong> Socially and professionally, people experience your <strong>${ascRashi.en}</strong> exterior—<em>${ascRashi.temperamentEn}</em>—and because your Ascendant Lord <strong>${ascRashi.lord}</strong> sits in your <strong>${lagnaLordInfo.bhava}th House</strong>, your life energy is magnetically pulled toward <em>${houseThemeShort(lagnaLordInfo.bhava, "en")}</em>. Yet privately, your mind runs on <strong>${moonRashi.en} under ${moonNak.name}</strong>, wiring your subconscious with <em>${moonNak.traitEn}</em>.
      </p>

      <p>
        <strong>3. The Acoustic Vibration of "${name}" (${chaldean.compound} → ${chaldean.single}):</strong> In Chaldean numerology, the letters of your name sum to <code>${chaldean.breakdown} = ${chaldean.compound}</code> (reducing to root vibration <strong>${chaldean.single}</strong>). ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? "Remarkably, your name's root vibration locks directly into harmony with your birth numbers—acting as an unseen protective shield that pulls you out of life's sharpest crises at the eleventh hour."
            : `Notice the subtle frequency contrast here: your soul was born under frequencies ${numData.mulank} and ${numData.bhagyank}, whereas the name society calls you broadcasts vibration ${chaldean.single}. This explains why you often do 95% of the heavy lifting in projects and relationships while final credit gets delayed.`
        }
      </p>

      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4 break-words">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> ${radarBox.titleEn}</div>
        <p class="text-sm mb-0">${radarBox.en}</p>
      </div>
    `;
  }

  function buildChapter2Education(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const merc   = planetAnalysis.Mercury;
    const jup    = planetAnalysis.Jupiter;
    const bindu5 = specialLagnas.houseBindus[5];
    const mercNak= NAKSHATRA_DATA[merc.nak];

    const studyVariant = pickUniqueVariant("ch2StudyPattern", DYNAMIC_HOOK_BANKS.ch2StudyPattern, ctx);

    const hasFocusDisruption = merc.retro || jup.retro ||
      [6, 8, 12].includes(lord5.bhava) ||
      planetAnalysis.Rahu.bhava === 5 || planetAnalysis.Ketu.bhava === 5 || planetAnalysis.Saturn.bhava === 5;

    if (lang === "hi") {
      return `
        <p>
          आपकी कुंडली के पंचम भाव (मेधा एवं पूर्व-पुण्य) में <strong>${rashi5.hi}</strong> राशि है, जिसके स्वामी <strong>${rashi5.lordHi}</strong> कुंडली के <strong>${lord5.bhava}वें भाव (${RASHI_DATA[lord5.d1].hi})</strong> में स्थित हैं। साथ ही बुद्धि के कारक <strong>बुध ${RASHI_DATA[merc.d1].hi} (${merc.bhava}वां भाव — ${mercNak.name} नक्षत्र)</strong> में और ज्ञान के कारक <strong>गुरु ${RASHI_DATA[jup.d1].hi} (${jup.bhava}वां भाव)</strong> में बैठकर आपके मस्तिष्क की सीखने की क्षमता को नियंत्रित कर रहे हैं। अष्टकवर्ग में आपके पंचम भाव को <strong>${bindu5} शुभ बिंदु</strong> प्राप्त हैं।
        </p>

        <p>
          <strong>1. आपका वास्तविक लर्निंग पैटर्न:</strong> ${studyVariant.hi}
        </p>

        <p>
          <strong>2. परीक्षा और एकाग्रता में आने वाला गुप्त मोड़:</strong> ${
            hasFocusDisruption
              ? `आपके पंचम अक्ष और बुध/गुरु पर विशेष कर्म-प्रभाव होने के कारण आपके शैक्षणिक या प्रतियोगी जीवन में कम से कम एक ऐसा दौर अवश्य आया है जहाँ आपकी योग्यता शीर्ष स्तर की थी, परंतु अंतिम समय पर मानसिक भटकाव, स्वास्थ्य या पारिवारिक वातावरण के कारण परिणाम आपकी असली क्षमता से कम रह गया।`
              : `बुध और पंचमेश का समन्वय आपको तार्किक विषयों, प्रतियोगी परीक्षाओं और समस्या-समाधान में स्वाभाविक श्रेष्ठता देता है, बशर्ते आप अंतिम क्षण के टालमटोल (procrastination) से बचें।`
          } आपकी औपचारिक डिग्री चाहे जो भी हो, जीवन में आपकी सबसे बड़ी तरक्की आपके <strong>स्व-अर्जित व्यावहारिक कौशल (self-taught mastery)</strong> से होगी।
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 min-w-0 break-words">
            <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> आपके मस्तिष्क के सर्वाधिक अनुकूल क्षेत्र:</div>
            <p class="text-xs md:text-sm mb-0">डेटा व टेक्नोलॉजी, प्रशासनिक/प्रतियोगी सेवाएं, वित्त व कॉमर्स, चिकित्सा व निदान विज्ञान, कानून/न्याय, मनोविज्ञान और रणनीतिक शोध।</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
            <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> मेधा जागृत करने का अचूक वैदिक नियम:</div>
            <p class="text-xs md:text-sm mb-0">पढ़ते या काम करते समय अपना मुख <strong>${rashi5.directionHi}</strong> की ओर रखें। मोबाइल को दूसरे कमरे में रखकर 45-45 मिनट के स्प्रिंट में लिखकर अभ्यास करना आपके बुध (${mercNak.name}) के न्यूरल सर्किट को तुरंत लॉक कर देता है।</p>
          </div>
        </div>
      `;
    }

    return `
      <p>
        Your 5th House of Medha (intelligence, memory, and competitive merit) falls in <strong>${rashi5.en}</strong>, with its ruler <strong>${rashi5.lord}</strong> positioned in your <strong>${lord5.bhava}th House (${RASHI_DATA[lord5.d1].en})</strong> and carrying <strong>${bindu5} Sarvashtakavarga bindus</strong>. Combined with <strong>Mercury in ${RASHI_DATA[merc.d1].en} (${merc.bhava}th House under ${mercNak.name})</strong> and <strong>Jupiter in ${RASHI_DATA[jup.d1].en} (${jup.bhava}th House)</strong>, your cognitive blueprint is wired for conceptual mastery.
      </p>

      <p>
        <strong>1. Your True Cognitive & Study Pattern:</strong> ${studyVariant.en}
      </p>

      <p>
        <strong>2. The Unspoken Exam & Stream-Switch Pattern:</strong> ${
          hasFocusDisruption
            ? `Because your 5th-house/Mercury axis carries karmic sensitivity, your educational journey includes at least one frustrating phase where your raw intellect was in the top tier, yet last-minute anxiety, distraction, or external pressure caused a result below your true caliber.`
            : `Your 5th Lord and Mercury alignment gives you a sharp edge in competitive exams and analytical problem-solving—your only enemy is last-minute procrastination born from knowing you can catch up fast.`
        } Regardless of your formal degree on paper, over 70% of your lifelong authority will come from skills and insights you master in the real world.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30 min-w-0 break-words">
          <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> Highest-Yield Intellectual Domains:</div>
          <p class="text-xs md:text-sm mb-0">Engineering/IT architecture, administrative & civil services, finance/chartered analytics, medical & clinical diagnostics, law & policy, and human psychology.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> Vedic Brainpower Optimization:</div>
          <p class="text-xs md:text-sm mb-0">Face <strong>${rashi5.direction}</strong> during study or high-stakes work. Studying in 45-minute written-recall sprints locks your Mercury (${mercNak.name}) focus without mental drift.</p>
        </div>
      </div>
    `;
  }

  function buildChapter3Career(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi10 = RASHI_DATA[getRashiOfBhava(asc, 10)];
    const lord10Key = rashi10.lord;
    const lord10  = planetAnalysis[lord10Key];
    const sat = planetAnalysis.Saturn;
    const sun = planetAnalysis.Sun;
    const bindu10 = specialLagnas.houseBindus[10];
    const bindu6  = specialLagnas.houseBindus[6];
    const bindu11 = specialLagnas.houseBindus[11];
    const lagnaMatrix = LAGNA_FUNCTIONAL_MATRIX[asc];

    const lord1Key = RASHI_DATA[asc].lord;
    const maturitySet = Array.from(new Set([
      ...(PLANET_MATURITY_AGES[lord10Key] || [26, 30, 34]),
      (PLANET_MATURITY_AGES[lord1Key] || [28])[0]
    ])).sort((a, b) => a - b);

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
          <strong>2. कार्यक्षेत्र की राजनीति और दशमेश परिपक्वता वर्ष (${maturitySet.join(", ")}वां वर्ष):</strong> आपने अपने कार्यक्षेत्र में यह अनुभव किया होगा कि जब तक आप दूसरों का काम संभालते हैं, सब आपकी प्रशंसा करते हैं—पर जैसे ही आप अपने अधिकार या प्रमोशन की बात करते हैं, गुप्त राजनीति शुरू हो जाती है। पाराशरी ग्रह-परिपक्वता सिद्धांत के अनुसार आपके दशमेश <strong>${rashi10.lordHi}</strong> और योगकारक (<strong>${lagnaMatrix.yogakaraka.map(p => PLANET_META[p].hi).join(", ")}</strong>) आपकी आयु के <strong>${maturitySet.join(", ")}वें वर्ष</strong> में पूर्ण परिपक्व होकर आपको स्वतंत्र अधिकार और उच्च पद सौंपते हैं।
        </p>

        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4 break-words">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> आपके लिए सर्वोच्च सफलता वाले करियर क्षेत्र:</div>
          <p class="text-xs md:text-sm mb-0">
            दशमेश <strong>${rashi10.lordHi}</strong> के ${lord10.bhava}वें भाव से जुड़ने के कारण आपके लिए <strong>उच्च प्रशासनिक/सरकारी पद, टेक्नोलॉजी व सिस्टम आर्किटेक्चर, चिकित्सा एवं हेल्थकेयर, बैंकिंग व वित्तीय प्रबंधन, स्वतंत्र कंसल्टेंसी, न्यायिक क्षेत्र या अपना स्वयं का उद्यम (Enterprise)</strong> सर्वाधिक भाग्योदयकारी रहेगा।
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
        <strong>2. Workplace Politics & Your Planetary Maturity Ages (${maturitySet.join(", ")}):</strong> Because you refuse to flatter seniors or play petty office politics, louder peers may have grabbed temporary credit in your early twenties. However, governed by the Parashari maturity cycles of your 10th Lord <strong>${rashi10.lord}</strong> and Yogakaraka (<strong>${lagnaMatrix.yogakaraka.join(" & ")}</strong>), your chart undergoes decisive upward command shifts at <strong>ages ${maturitySet.join(", ")}</strong>—transitioning you into a seat where others report to your authority.
      </p>

      <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4 break-words">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> Highest-Alignment Career Sectors for Your Chart:</div>
        <p class="text-xs md:text-sm mb-0">
          With 10th Lord <strong>${rashi10.lord}</strong> linked to your ${lord10.bhava}th House, your highest status and wealth come through <strong>executive administration/government, IT/systems engineering, medicine & clinical sciences, finance & capital management, advisory/consulting, or building your own independent enterprise</strong>—especially when connected to cities or clients outside your birthplace.
        </p>
      </div>
    `;
  }

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

    const leakVariant = pickUniqueVariant("ch4MoneyLeak", DYNAMIC_HOOK_BANKS.ch4MoneyLeak, ctx);

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30 min-w-0 break-words">
            <div class="text-xs text-emerald-300 font-bold">11वां भाव (आय प्रवाह) — ${rashi11.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu11} अष्टकवर्ग बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
            <div class="text-xs text-amber-300 font-bold">2रा भाव (बैंक संचय) — ${rashi2.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu2} अष्टकवर्ग बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30 min-w-0 break-words">
            <div class="text-xs text-rose-300 font-bold">12वां भाव (व्यय/निवेश) — ${rashi12.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu12} अष्टकवर्ग बिंदु</div>
          </div>
        </div>

        <p>
          <strong>1. धनागम बनाम धन-संचय का समीकरण:</strong> आपके एकादश भाव (लाभ) के स्वामी <strong>${rashi11.lordHi}</strong> कुंडली के <strong>${lord11.bhava}वें भाव</strong> में हैं और द्वितीय भाव (संचित कोष) के स्वामी <strong>${rashi2.lordHi}</strong> <strong>${lord2.bhava}वें भाव</strong> में बैठे हैं। आपकी कुंडली में धन कमाने की क्षमता (earning potential) अत्यंत प्रबल है—जब भी जीवन में किसी बड़े कार्य के लिए धन की आवश्यकता होती है, व्यवस्था स्वतः बन जाती है।
        </p>

        <p>
          <strong>2. रहस्यमयी 'मनी लीक' (जो आपने वास्तविक जीवन में देखा है):</strong> ${leakVariant.hi}
        </p>

        <p>
          <strong>3. करोड़पति संपदा निर्माण का वैदिक लॉक-इन सूत्र:</strong> क्योंकि आपके द्वादश भाव में <strong>${bindu12} बिंदु</strong> हैं, यदि आप पैसा केवल लिक्विड सेविंग्स अकाउंट में छोड़ेंगे तो 12वां भाव उसे किसी न किसी बहाने खर्च करवा देगा। आपके लिए अमीरी का अचूक नियम यह है कि धन आते ही उसे <strong>अचल संपत्ति (भूमि/प्रॉपर्टी), स्वर्ण (Gold), दीर्घकालिक इक्विटी/SIP या व्यावसायिक एसेट्स</strong> में 'लॉक' कर दें। जब आप स्वयं अपने 12वें भाव को 'निवेश' दे देते हैं, तो आकस्मिक नुकसान स्वतः बंद हो जाते हैं।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30 min-w-0 break-words">
          <div class="text-xs text-emerald-300 font-bold">11th House (Inflow) — ${rashi11.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu11} SAV Bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
          <div class="text-xs text-amber-300 font-bold">2nd House (Retention) — ${rashi2.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu2} SAV Bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30 min-w-0 break-words">
          <div class="text-xs text-rose-300 font-bold">12th House (Outflow) — ${rashi12.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu12} SAV Bindus</div>
        </div>
      </div>

      <p>
        <strong>1. Cash Inflow vs. Wealth Retention:</strong> Your 11th House of gains is governed by <strong>${rashi11.lord}</strong> operating from your <strong>${lord11.bhava}th House</strong>, while your 2nd House of accumulated bank balance is ruled by <strong>${rashi2.lord}</strong> in the <strong>${lord2.bhava}th House</strong>. Your chart never truly lacks the ability to generate money—whenever a major necessity hits, resources find their way to you.
      </p>

      <p>
        <strong>2. The Unspoken "Money Leak" Pattern in Your Chart:</strong> ${leakVariant.en}
      </p>

      <p>
        <strong>3. Your Wealth-Locking Formula:</strong> With <strong>${bindu12} bindus</strong> in your 12th house versus <strong>${bindu2} bindus</strong> in your 2nd house, idle cash sitting in a savings account triggers the "Vyaya" (loss) side of the 12th house. To build massive net worth, you must consciously activate the "Investment" side of the 12th house: the moment surplus income arrives, lock it into <strong>appreciating assets—land/real estate, physical gold, automated equity compounding, or business assets</strong>.
      </p>
    `;
  }

  function buildChapter5Luck(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi9 = RASHI_DATA[getRashiOfBhava(asc, 9)];
    const lord9  = planetAnalysis[rashi9.lord];
    const bindu9 = specialLagnas.houseBindus[9];
    const m = numData.mulank, b = numData.bhagyank;

    const luckVariant = pickUniqueVariant("ch5LuckTest", DYNAMIC_HOOK_BANKS.ch5LuckTest, ctx);

    const milestoneAges = Array.from(new Set([
      18 + m, 21 + (b % 5), 24 + (m % 4), 27 + (b % 3),
      30 + (lord9.bhava % 4), 33 + (m % 3), 36, 42
    ])).sort((x, y) => x - y);

    if (lang === "hi") {
      return `
        <p>
          आपके नवम भाव (भाग्य एवं धर्म) में <strong>${rashi9.hi}</strong> राशि है, भाग्येश <strong>${rashi9.lordHi}</strong> कुंडली के <strong>${lord9.bhava}वें भाव</strong> में विराजमान हैं और नवम भाव को अष्टकवर्ग में <strong>${bindu9} बिंदु</strong> प्राप्त हैं। आपका भाग्य निष्क्रिय बैठकर फल देने वाला नहीं है—यह <strong>कर्म-जागृत भाग्य</strong> है, जो आपके पहला कदम उठाते ही सक्रिय हो जाता है।
        </p>

        <p>
          <strong>1. आपके भाग्योदय का गुप्त नियम:</strong> ${luckVariant.hi}
        </p>

        <p>
          <strong>2. आपके जीवन के स्वर्णिम भाग्योदय वर्ष:</strong> भृगु चक्र, नवमेश <strong>${rashi9.lordHi}</strong> और आपके मूलांक (${m}) व भाग्यांक (${b}) के संगम से आपके जीवन के सबसे बड़े निर्णायक मोड़ <strong>${milestoneAges.join(", ")}वें वर्ष</strong> में आते हैं। वर्तमान में आपकी आयु <strong>${numData.age} वर्ष</strong> है और वर्ष <strong>${numData.currentYear}</strong> आपके लिए <strong>व्यक्तिगत वर्ष अंक ${numData.personalYear}</strong> की ऊर्जा में चल रहा है—जो पुराने मानसिक बोझ को उतारकर करियर और रिश्तों में एक ठोस निर्णय लेने का वर्ष है।
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
            <div class="text-[11px] text-amber-400 font-bold">भाग्योदय दिशा</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.directionHi}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
            <div class="text-[11px] text-amber-400 font-bold">शक्तिशाली अंक</div>
            <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
            <div class="text-[11px] text-amber-400 font-bold">वर्ष ${numData.currentYear} स्पंदन</div>
            <div class="text-sm font-bold text-white mt-1">व्यक्तिगत अंक ${numData.personalYear}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
            <div class="text-[11px] text-amber-400 font-bold">भाग्येश स्थिति</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.lordHi} (${lord9.bhava}वां भाव)</div>
          </div>
        </div>
      `;
    }

    return `
      <p>
        Your 9th House of Bhagya (divine grace and fortune) holds <strong>${rashi9.en}</strong> with <strong>${bindu9} SAV bindus</strong>, while your Bhagya Lord <strong>${rashi9.lord}</strong> operates from your <strong>${lord9.bhava}th House</strong>. This configuration creates <em>Action-Triggered Fortune</em>: the moment you commit to bold action in ${houseThemeShort(lord9.bhava, "en")}, unseen doors and mentors open up rapidly.
      </p>

      <p>
        <strong>1. How Destiny Tests & Rewards You:</strong> ${luckVariant.en}
      </p>

      <p>
        <strong>2. Your Crucial Age Turning Points:</strong> Synthesizing Bhrigu progression with your 9th Lord (${rashi9.lord}), Mulank (${m}), and Bhagyank (${b}), the most decisive destiny-shifting years of your life occur at <strong>ages ${milestoneAges.join(", ")}</strong>. At your current age of <strong>${numData.age}</strong>, calendar year <strong>${numData.currentYear}</strong> runs under your <strong>Personal Year ${numData.personalYear}</strong>—signaling an active restructuring window for your career, finances, and personal boundaries.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
          <div class="text-[11px] text-amber-400 font-bold">Fortune Direction</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.direction}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
          <div class="text-[11px] text-amber-400 font-bold">Power Numbers</div>
          <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
          <div class="text-[11px] text-amber-400 font-bold">${numData.currentYear} Vibration</div>
          <div class="text-sm font-bold text-white mt-1">Personal Year ${numData.personalYear}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-0 break-words">
          <div class="text-[11px] text-amber-400 font-bold">Bhagya Lord</div>
          <div class="text-sm font-bold text-white mt-1">${rashi9.lord} (${lord9.bhava}th House)</div>
        </div>
      </div>
    `;
  }

  function buildChapter6Love(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const ven    = planetAnalysis.Venus;
    const rahu   = planetAnalysis.Rahu;
    const mars   = planetAnalysis.Mars;

    const loveVariant = pickUniqueVariant("ch6LovePattern", DYNAMIC_HOOK_BANKS.ch6LovePattern, ctx);

    const karmicLove = ven.conjunctWith.includes("Rahu") || ven.conjunctWith.includes("Saturn") ||
                       ven.conjunctWith.includes("Mars") || ven.conjunctWith.includes("Ketu") ||
                       rahu.bhava === 5 || rahu.bhava === 7 || [1,2,4,7,8,12].includes(mars.bhava);

    if (lang === "hi") {
      return `
        <p>
          प्रेम के मामले में आपका हृदय दिखावे या सतही आकर्षण (time-pass romance) के लिए नहीं बना है। आपके पंचम भाव में <strong>${rashi5.hi}</strong>, पंचमेश <strong>${rashi5.lordHi}</strong> के <strong>${lord5.bhava}वें भाव</strong> में होने और प्रेम-कारक <strong>शुक्र के ${RASHI_DATA[ven.d1].hi} (${ven.bhava}वां भाव, नवांश ${RASHI_DATA[ven.d9].hi})</strong> में बैठने के कारण जब आप किसी से जुड़ते हैं, तो पूरी आत्मा और अटूट निष्ठा से जुड़ते हैं।
        </p>

        <p>
          <strong>1. रिश्तों में आपका अनकहा भावनात्मक सच:</strong> ${loveVariant.hi}
        </p>

        <p>
          <strong>2. पूर्वजन्म का कार्मिक आकर्षण और सावधानी:</strong> ${
            karmicLove
              ? "आपके शुक्र और पंचम/सप्तम अक्ष पर तीव्र कार्मिक ग्रहों का प्रभाव यह स्पष्ट दर्शाता है कि आपके जीवन में कम से कम एक ऐसा गहरा भावनात्मक लगाव या अधूरा प्रेम-प्रसंग आता है जो आपको भीतर तक झकझोर कर रख देता है—ताकि आप अंधे भरोसे से बाहर निकलकर अपने आत्म-सम्मान की कीमत पहचान सकें।"
              : "शुक्र और पंचमेश का समन्वय आपको स्वाभाविक आकर्षण और गहरा प्रेम देता है, पर जब तक सामने वाले में बौद्धिक स्तर और वफादारी न दिखे, आपका मन पूरी तरह खुलता नहीं है।"
          }
        </p>
      `;
    }

    return `
      <p>
        You are constitutionally incapable of shallow, transactional romance. With your 5th House of love in <strong>${rashi5.en}</strong>, its ruler <strong>${rashi5.lord}</strong> in your <strong>${lord5.bhava}th House</strong>, and <strong>Venus placed in ${RASHI_DATA[ven.d1].en} (${ven.bhava}th House) maturing into ${RASHI_DATA[ven.d9].en} in D9</strong>, when you let someone into your inner circle, you love with fierce loyalty, protection, and depth.
      </p>

      <p>
        <strong>1. Your Unspoken Relationship Pattern:</strong> ${loveVariant.en}
      </p>

      <p>
        <strong>2. Karmic Attraction Triggers & Heartbreak Protection:</strong> ${
          karmicLove
            ? "Because intense karmic nodes/malefics touch your romantic axis, your destiny includes at least one deeply transformative heartbreak or complicated attachment early on—specifically designed to strip away naive illusions and awaken your self-worth."
            : "Your Venus–5th house alignment gives you natural romantic magnetism, yet your heart only truly relaxes when intellectual respect and emotional safety coexist."
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
    const ulRashi  = RASHI_DATA[specialLagnas.upapadaRashi];
    const spouseKarakaKey = gender === "female" ? "Jupiter" : "Venus";
    const spouseKaraka = planetAnalysis[spouseKarakaKey];
    const lord7Nak = NAKSHATRA_DATA[lord7.nak];
    const bindu7   = specialLagnas.houseBindus[7];

    const dir1En = rashi7.direction;
    const dir2En = d9Rashi7.direction !== dir1En ? d9Rashi7.direction : rashi7.altDirection;
    const dir1Hi = rashi7.directionHi;
    const dir2Hi = d9Rashi7.directionHi !== dir1Hi ? d9Rashi7.directionHi : rashi7.altDirectionHi;

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30 min-w-0 break-words">
            <div class="text-xs text-rose-300 font-bold">सप्तम भाव (D1 कलत्र)</div>
            <div class="text-base font-extrabold text-white mt-0.5">${rashi7.hi} (स्वामी: ${rashi7.lordHi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30 min-w-0 break-words">
            <div class="text-xs text-pink-300 font-bold">नवांश (D9) सप्तम एवं कारक</div>
            <div class="text-base font-extrabold text-white mt-0.5">${d9Rashi7.hi} • ${spouseKaraka.meta.hi}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
            <div class="text-xs text-amber-300 font-bold">उपपद लग्न (UL) व बिंदु</div>
            <div class="text-base font-extrabold text-white mt-0.5">${ulRashi.hi} (${bindu7} बिंदु)</div>
          </div>
        </div>

        <p>
          <strong>1. भावी जीवनसाथी का रंग-रूप, कद-काठी और प्रथम आकर्षण:</strong> आपके सप्तम भाव में <strong>${rashi7.hi}</strong> और नवांश (D9) के सप्तम भाव में <strong>${d9Rashi7.hi}</strong> राशि का संगम यह बताता है कि आपके जीवनसाथी में <em>${rashi7.bodyBuildHi}</em> स्पष्ट झलकेगी। उनके चेहरे पर एक स्वाभाविक गरिमा और आंखों में ऐसा आकर्षण होगा कि भीड़ में भी उनकी उपस्थिति अलग महसूस होगी।
        </p>

        <p>
          <strong>2. जीवनसाथी का स्वभाव, बुद्धिमत्ता और पारिवारिक स्तर:</strong> आपके सप्तमेश <strong>${rashi7.lordHi}</strong> <strong>${lord7Nak.name} नक्षत्र</strong> में कुंडली के <strong>${lord7.bhava}वें भाव</strong> में बैठे हैं और जैमिनी उपपद लग्न (UL) <strong>${ulRashi.hi}</strong> में है। आपका जीवनसाथी बाहर से <em>${rashi7.temperamentHi}</em> होगा, जबकि अंतरंग संबंधों में (D9 के अनुसार) उनका स्वभाव <em>${d9Rashi7.temperamentHi}</em> रहेगा। ${
            bindu7 < 26
              ? "सप्तम भाव में अष्टकवर्ग बिंदु थोड़े संवेदनशील होने के कारण विवाह के शुरुआती चरण में अहं (ego) या संवाद की गलतफहमी से बचना आवश्यक रहेगा—जितना अधिक आप दोनों तीसरे व्यक्ति के हस्तक्षेप से दूर रहेंगे, दांपत्य उतना ही सुखद रहेगा।"
              : "सप्तम भाव के मजबूत बिंदु यह दर्शाते हैं कि कठिन समय में आपका जीवनसाथी आपकी सबसे मजबूत ढाल और सलाहकार साबित होगा।"
          }
        </p>

        <p>
          <strong>3. विवाह की दिशा, मिलन का माध्यम और विवाह-पश्चात भाग्योदय:</strong> आपके जीवनसाथी के जन्मस्थान या आपके मिलन की सबसे प्रबल दिशा <strong>${dir1Hi}</strong> अथवा <strong>${dir2Hi}</strong> है। सप्तमेश के ${lord7.bhava}वें भाव से जुड़ने के कारण ${
            [3, 5, 9, 11].includes(lord7.bhava)
              ? "आपका विवाह आपकी अपनी पसंद (love-cum-arranged) या आपके कार्यक्षेत्र/सोशल नेटवर्क के माध्यम से तय होने का प्रबल योग है।"
              : "विवाह परिवार की सहमति या आकस्मिक संयोग से तय होगा, परंतु विवाह से पूर्व आप दोनों के बीच गहरा मानसिक समन्वय स्थापित हो जाएगा।"
          } सबसे महत्वपूर्ण—नवांश में <strong>${spouseKaraka.meta.hi}</strong> की स्थिति यह प्रमाणित करती है कि <strong>विवाह के 18 से 24 महीनों के भीतर</strong> आपके आर्थिक स्तर और सामाजिक मान-सम्मान में एक बड़ा उछाल (Post-Marriage Bhagya Udaya) आएगा।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30 min-w-0 break-words">
          <div class="text-xs text-rose-300 font-bold">7th House (D1 Kalatra Bhava)</div>
          <div class="text-base font-extrabold text-white mt-0.5">${rashi7.en} (Lord: ${rashi7.lord})</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30 min-w-0 break-words">
          <div class="text-xs text-pink-300 font-bold">Navamsa (D9) 7th & Karaka</div>
          <div class="text-base font-extrabold text-white mt-0.5">${d9Rashi7.en} • ${spouseKarakaKey}</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 min-w-0 break-words">
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
        <strong>3. Direction of Marriage, How You Meet & Post-Marriage Fortune:</strong> Astrologically, the strongest directional pull for your partner's roots or meeting place lies toward the <strong>${dir1En}</strong> or <strong>${dir2En}</strong> relative to your birthplace. With 7th Lord activating your ${lord7.bhava}th house, ${
          [3, 5, 9, 11].includes(lord7.bhava)
            ? "your chart strongly favors a love-cum-arranged marriage or meeting through your professional/educational network where mental respect turns into commitment."
            : "whether introduced through family or destiny-led circumstances, a strong one-on-one intellectual bond will form before marriage."
        } Crucially, your Navamsa configuration triggers <strong>Post-Marriage Bhagya-Udaya</strong>: within 18 to 24 months of marriage, your financial discipline and social standing elevate into a noticeably higher league.
      </p>
    `;
  }

  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis, specialLagnas } = ctx;
    const ascRashi = chart.Asc.d1;
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];

    const modeBanner = chart.isFullChartMode
      ? (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6 break-words"><i class="fas fa-check-circle mr-2"></i><strong>99.9% पूर्ण कुंडली मोड सक्रिय:</strong> नीचे आपके लग्न (D1), नक्षत्र एवं नवांश (D9) के आधार पर सभी 9 ग्रहों के स्वामित्व, युति, पाराशरी दृष्टि और अष्टकवर्ग बल का संपूर्ण विश्लेषण दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6 break-words"><i class="fas fa-check-circle mr-2"></i><strong>99.9% Full-Precision Chart Mode Active:</strong> Below is the complete Parashari, Navamsa (D9), and Ashtakavarga breakdown of all 9 Grahas—including house lordships, functional nature, conjunctions (Yutis), and mutual aspects (Drishtis).</div>`)
      : (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6 break-words"><i class="fas fa-info-circle mr-2"></i><strong>जन्म-तिथि एवं नाम सिंथेसिस मोड:</strong> यह विश्लेषण आपकी जन्म-तिथि के सूर्य-चंद्र नक्षत्र व चैल्डियन तरंग पर आधारित है। (ऊपर जन्म-समय और स्थान जोड़कर आप अपना सटीक लग्न, चलित व D1/D9 चार्ट भी खोल सकते हैं!)</div>`
        : `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6 break-words"><i class="fas fa-info-circle mr-2"></i><strong>Sidereal Solar-Lunar & Chaldean Synthesis Mode:</strong> Derived from your birth date and name vibration. (Tip: Add your Birth Time & Place above to unlock exact astronomical D1/D9 SVG charts, Bhava Chalit, and calendar Dasha dates!)</div>`);

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
      const degBadge = info.formattedDeg ? `<span class="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">${info.formattedDeg}</span>` : "";

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

      const incomingEn = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => `${inc.nthAspect}th aspect from <strong>${PLANET_META[inc.fromPlanet].en}</strong> (from House ${planetAnalysis[inc.fromPlanet].bhava})`).join(", ")
        : "Receives no direct Parashari aspect from other planets—operating purely on its own Rashi, Nakshatra, and D9 strength.";

      const incomingHi = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => `<strong>${PLANET_META[inc.fromPlanet].hi}</strong> (${planetAnalysis[inc.fromPlanet].bhava}वें भाव से) की ${inc.nthAspect}वीं दृष्टि`).join(", ")
        : "इस ग्रह पर किसी अन्य ग्रह की सीधी पाराशरी दृष्टि नहीं है—यह अपने स्वयं के नक्षत्र और नवांश बल से फल दे रहा है।";

      if (lang === "hi") {
        return `
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 max-w-full overflow-hidden break-words">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div class="min-w-0">
                <h4 class="text-lg md:text-xl font-bold text-white flex flex-wrap items-center gap-2">
                  <span>${info.meta.hi}</span>
                  ${degBadge}
                  ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">वक्री / उच्च चेष्टा बल</span>' : ''}
                </h4>
                <p class="text-xs text-amber-300/90 font-semibold mt-0.5 break-words">${ownedStrHi} • ${funcRole}</p>
              </div>
              <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass} break-words max-w-full">${info.dignity.statusHi}</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
                <span class="text-gray-400 block">लग्न (D1) स्थिति:</span>
                <strong class="text-amber-300">${info.bhava}वां भाव — ${d1Rashi.hi}</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
                <span class="text-gray-400 block">नक्षत्र एवं स्वामी:</span>
                <strong class="text-purple-300">${nak.name} (${nak.ruler})</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
                <span class="text-gray-400 block">नवांश (D9) परिपक्वता:</span>
                <strong class="text-emerald-300">${info.d9Bhava}वां भाव — ${d9Rashi.hi}</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
                <span class="text-gray-400 block">भिन्नाष्टकवर्ग (BAV):</span>
                <strong class="text-cyan-300">${bavScoreHere !== null ? `${bavScoreHere} / 8 बिंदु` : 'छाया नोड (Node)'}</strong>
              </div>
            </div>

            <p class="text-sm text-gray-200 mb-0">
              <strong>1. भाव स्वामित्व एवं D1 फलित:</strong> आपकी कुंडली में ${info.meta.hi} (${ownedStrHi}) <strong>${bhavaDesc.hi}</strong> में ${d1Rashi.hi} राशि और <strong>${nak.name}</strong> नक्षत्र में स्थित हैं। इस स्थिति के कारण आपके भीतर <em>${nak.traitHi}</em> का गुण सक्रिय रहता है और यह ग्रह आपके ${houseThemeShort(info.bhava, "hi")} को सीधे नियंत्रित करता है।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>2. नवांश (D9) का गुप्त सच:</strong> लग्न कुंडली में ${d1Rashi.hi} में दिखने वाला यह ग्रह नवांश (D9) में <strong>${d9Rashi.hi} राशि (D9 के ${info.d9Bhava}वें भाव)</strong> में जाता है। इसका अर्थ है कि समय के साथ यह ग्रह ${houseThemeShort(info.d9Bhava, "hi")} के माध्यम से अपना वास्तविक फल प्रकट करेगा।
            </p>

            <p class="text-sm text-gray-200 mb-0"><strong>3. ${yutiHi}</strong></p>

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
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 max-w-full overflow-hidden break-words">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div class="min-w-0">
              <h4 class="text-lg md:text-xl font-bold text-white flex flex-wrap items-center gap-2">
                <span>${info.meta.en}</span>
                ${degBadge}
                ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Retrograde / High Cheshta Bala</span>' : ''}
              </h4>
              <p class="text-xs text-amber-300/90 font-semibold mt-0.5 break-words">${ownedStrEn} • ${funcRole}</p>
            </div>
            <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass} break-words max-w-full">${info.dignity.statusEn}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
              <span class="text-gray-400 block">D1 Placement:</span>
              <strong class="text-amber-300">${info.bhava}th House — ${d1Rashi.en}</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
              <span class="text-gray-400 block">Nakshatra & Lord:</span>
              <strong class="text-purple-300">${nak.name} (${nak.ruler})</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
              <span class="text-gray-400 block">D9 Navamsa Maturity:</span>
              <strong class="text-emerald-300">${info.d9Bhava}th House — ${d9Rashi.en}</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10 min-w-0 break-words">
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

          <p class="text-sm text-gray-200 mb-0"><strong>3. ${yutiEn}</strong></p>

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
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30 min-w-0 break-words">
            <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. चंद्र लग्न (${chandra.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              जन्म लग्न शरीर है, तो <strong>चंद्र लग्न (${chandra.hi})</strong> आपके मन की धुरी है। गोचर और साढ़ेसाती/ढैय्या का सारा प्रभाव चंद्र लग्न से ही घटित होता है—इसीलिए भावनात्मक शांति के लिए आपको <em>${chandra.temperamentHi}</em> वातावरण की आवश्यकता होती है।
            </p>
          </div>

          <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30 min-w-0 break-words">
            <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (${surya.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              <strong>सूर्य लग्न (${surya.hi})</strong> आपकी आत्मा के स्वाभिमान, पिता की विरासत और प्रशासनिक अधिकार को दर्शाता है। सूर्य लग्न से दशम और एकादश भाव यह तय करते हैं कि समाज में आपका नाम किस अधिकार से लिया जाएगा।
            </p>
          </div>

          <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30 min-w-0 break-words">
            <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. नवांश लग्न (${navamsa.hi}) एवं कारकांश (${karakamsa.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              <strong>नवांश लग्न (${navamsa.hi})</strong> और आत्मकारक (${akMeta.hi}) से निर्मित <strong>कारकांश लग्न (${karakamsa.hi})</strong> आपकी आत्मा की असली मंजिल हैं। 30 वर्ष की आयु और विवाह के पश्चात आपका व्यक्तित्व स्पष्ट रूप से <em>${navamsa.temperamentHi}</em> गुणों में ढल जाता है।
            </p>
          </div>

          <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30 min-w-0 break-words">
            <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (AL — ${arudha.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              आपका <strong>आरूढ़ पद (AL) ${arudha.hi}</strong> में (लग्न से <strong>${specialLagnas.arudhaHouseFromLagna}वें भाव</strong> में${specialLagnas.arudhaExceptionApplied ? " — जैमिनी स्व-सप्तम अपवाद नियम से 10वें स्थान पर संशोधित" : ""}) स्थित है। लग्न आपका सच है, पर आरूढ़ लग्न वह छवि (Maya) है जो दुनिया आप पर थोपती है।
            </p>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5 max-w-full overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. बृहत् पाराशर होरा शास्त्र — प्रमाणित 337-बिंदु सर्वाष्टकवर्ग (SAV)</h4>
            <span class="text-xs text-emerald-300 font-bold">कुल योग: ${specialLagnas.grandTotalSav} / 337 बिंदु (100% सत्यापित)</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
            ${savGrid}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30 min-w-0 break-words">
              <div class="text-xs text-emerald-300 font-bold mb-1"><i class="fas fa-arrow-up mr-1"></i>सर्वोच्च बली भाव (Power Houses)</div>
              <p class="text-sm text-gray-200 mb-0">${strongListHi} — इन भावों में उच्च बिंदु होने से इन क्षेत्रों में आपका थोड़ा सा प्रयास भी बड़ा परिणाम देता है।</p>
            </div>
            <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30 min-w-0 break-words">
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
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30 min-w-0 break-words">
          <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. Chandra Lagna (${chandra.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            If the Ascendant is your physical chassis, <strong>Chandra Lagna (${chandra.en})</strong> is the operating system of your mind. All planetary transits (Gochara) and Sade-Sati phases register relative to ${chandra.en}—requiring <em>${chandra.temperamentEn}</em> for inner peace.
          </p>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30 min-w-0 break-words">
          <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (${surya.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            <strong>Surya Lagna (${surya.en})</strong> governs your vital authority, paternal lineage, and executive command. Counting houses from ${surya.en} reveals the exact domain where your soul refuses to compromise its dignity.
          </p>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30 min-w-0 break-words">
          <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. Navamsa (${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            While D1 shows the seed, <strong>Navamsa Lagna (${navamsa.en})</strong> and your <strong>Karakamsa Lagna (${karakamsa.en} — via Atmakaraka ${akMeta.en})</strong> reveal the ripened fruit. After age 30 and post-marriage, your life visibly takes on ${navamsa.en} qualities: <em>${navamsa.temperamentEn}</em>.
          </p>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30 min-w-0 break-words">
          <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            Your Arudha Pada falls in <strong>${arudha.en}</strong> (${specialLagnas.arudhaHouseFromLagna}th House from Lagna${specialLagnas.arudhaExceptionApplied ? " — shifted 10th via Jaimini's Swastha/Darastha exception rule" : ""}). Lagna is your internal truth; Arudha Lagna is the <em>Maya</em> (public perception) projected onto you by society.
          </p>
        </div>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5 max-w-full overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. Verified BPHS Parashari Sarvashtakavarga (SAV) & BAV Matrix</h4>
          <span class="text-xs text-emerald-300 font-bold">Verified Sum: ${specialLagnas.grandTotalSav} / 337 Bindus</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
          ${savGrid}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30 min-w-0 break-words">
            <div class="text-xs text-emerald-300 font-bold mb-1"><i class="fas fa-arrow-up mr-1"></i>Peak Reservoir Houses</div>
            <p class="text-sm text-gray-200 mb-0">${strongListEn} — these houses carry your highest cosmic voltage, delivering rapid results whenever their lords or transits activate.</p>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30 min-w-0 break-words">
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
      </div>
    `;
  }

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

    const fmtDate = (d) => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
    const exactDatesSub = (dasha.isExactCalendarDasha && dasha.adActive)
      ? `${fmtDate(dasha.adActive.start)} → ${fmtDate(dasha.adActive.end)}`
      : (dasha.isManualDasha ? (lang === "hi" ? "मैनुअल चयन" : "Manual Selection") : (lang === "hi" ? "नक्षत्र-पाद से परिकलित" : "Nakshatra-Pada Calibrated"));

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40 min-w-0 break-words">
            <div class="text-xs text-cyan-300 font-bold uppercase">सक्रिय महादशा (MD)</div>
            <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.hi}</div>
            <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}वां भाव (${mdRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40 min-w-0 break-words">
            <div class="text-xs text-purple-300 font-bold uppercase">सक्रिय अंतर्दशा (AD)</div>
            <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.hi}</div>
            <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}वां भाव (${adRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40 min-w-0 break-words">
            <div class="text-xs text-amber-300 font-bold uppercase">दशा-भुक्ति संबंध</div>
            <div class="text-xl font-extrabold text-white mt-1">महादशानाथ से ${relativeHouseOfAD}वां</div>
            <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
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
        <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40 min-w-0 break-words">
          <div class="text-xs text-cyan-300 font-bold uppercase">Active Mahadasha (MD)</div>
          <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}th House (${mdRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40 min-w-0 break-words">
          <div class="text-xs text-purple-300 font-bold uppercase">Active Antardasha (AD)</div>
          <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}th House (${adRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40 min-w-0 break-words">
          <div class="text-xs text-amber-300 font-bold uppercase">Dasha-Bhukti Angle</div>
          <div class="text-xl font-extrabold text-white mt-1">${relativeHouseOfAD}th from MD Lord</div>
          <div class="text-xs text-amber-200/90 mt-0.5 font-mono">${exactDatesSub}</div>
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
          प्रिय <strong>${name}</strong>, ऊपर के 10 अध्यायों में आपने अपनी प्रतिभा, करियर, और भावी जीवनसाथी की संभावनाओं को देखा। <strong>अब एक तार्किक ज्योतिषी के रूप में सबसे महत्वपूर्ण प्रश्न ध्यान से पढ़िए:</strong> यदि आपकी कुंडली में इतनी क्षमता और राजयोग मौजूद हैं, तो फिर आपके सबसे बड़े काम अंतिम क्षण पर क्यों अटकते हैं? और आपकी 100% मेहनत का पूरा प्रतिफल बैंक बैलेंस या मानसिक सुकून में क्यों नहीं बदल पा रहा?
        </p>

        <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4 break-words">
          <div class="font-bold text-red-300 text-base">
            <i class="fas fa-biohazard mr-2"></i> आपकी कुंडली में पकड़े गए 3 गुप्त ग्रह-अवरोध (Root-Cause Doshas):
          </div>
          <p class="text-sm mb-0">
            <strong>1. बाधकेश (${badhakaInfo.meta.hi}) एवं मारक ग्रह का गुप्त अवरोध:</strong> आपके ${RASHI_DATA[asc].hi} लग्न के लिए <strong>${badhakaInfo.meta.hi}</strong> (${lagnaMatrix.badhakaHouse}वें बाधक भाव के स्वामी) कुंडली के <strong>${badhakaInfo.bhava}वें भाव</strong> में बैठकर अदृश्य रुकावटें पैदा कर रहे हैं। ${isManglik ? `साथ ही मंगल के ${mars.bhava}वें भाव में होने से वैवाहिक/भावनात्मक अक्ष पर तीव्र अग्नि-ऊर्जा (कुज प्रभाव) बन रही है।` : `साथ ही मारक ग्रहों (${lagnaMatrix.marakas.map(m => PLANET_META[m].hi).join(", ")}) की स्थिति आपके आत्मबल और रिश्तों की शांति को प्रभावित कर रही है।`}
          </p>
          <p class="text-sm mb-0">
            <strong>2. राहु-केतु का ${rahu.bhava}/${ketu.bhava} कार्मिक ग्रहण और शनि की दृष्टि:</strong> राहु <strong>${rahu.bhava}वें भाव (${RASHI_DATA[rahu.d1].hi})</strong> में और केतु <strong>${ketu.bhava}वें भाव (${RASHI_DATA[ketu.d1].hi})</strong> में बैठकर ठीक उस समय मानसिक धुंध या भटकाव पैदा करते हैं जब आप किसी बड़ी सफलता के करीब होते हैं। वहीं शनि (${sat.bhava}वें भाव) की दृष्टि आपके धैर्य की कड़ी परीक्षा ले रही है।
          </p>
          <p class="text-sm mb-0">
            <strong>3. ${weakestHouse}वें भाव में सबसे कम अष्टकवर्ग बल (केवल ${minBindu} बिंदु):</strong> आपके <strong>${weakestHouse}वें भाव (${BHAVA_MEANINGS[weakestHouse].hi})</strong> में पूरी कुंडली के सबसे कम (मात्र ${minBindu}) बिंदु हैं, और ऊपर से वर्तमान में <strong>${PLANET_META[dasha.md].hi}–${PLANET_META[dasha.ad].hi}</strong> का समय-चक्र चल रहा है। बिना सटीक अंशबल (Degree/Chalit) जांचे और बिना सही उपाय किए, यह कमजोर कड़ी अगले 12–24 महीनों में आपके बने-बनाए अवसरों में रुकावट डाल सकती है।
          </p>
        </div>

        <p class="text-amber-200 font-semibold mb-0">
          ⚠️ <strong>सबसे खतरनाक गलती जो 95% लोग करते हैं:</strong> इंटरनेट से देखकर बिना अपनी कुंडली का सटीक अंशबल (Exact Degrees, Bhava Chalit, Shadbala एवं लाल किताब के सोए हुए ग्रह) जांचे कोई भी रत्न पहन लेना—जिससे बाधकेश या मारक ग्रह और अधिक उग्र हो जाता है! अपनी जन्म-तिथि, सटीक समय और स्थान की संपूर्ण हस्तनिर्मित कुंडली, 5-वर्षीय महीना-दर-महीना भविष्यवाणी और सुरक्षित वैदिक/लाल किताब उपायों के लिए <strong>आचार्य ज्ञानेंद्र सिंह तोमर जी</strong> से अभी व्हाट्सएप पर जुड़ें।
        </p>
      `;
    }

    return `
      <p>
        Dear <strong>${name}</strong>, across the ten chapters above you saw the genuine brilliance, leadership, and partner potential wired into your chart. <strong>Now pause and ask the ruthless diagnostic question:</strong> If your chart carries such strong capability, <em>why do your biggest breakthroughs still face friction right before completion? And why hasn't your 100% effort converted into the bank balance and peace of mind you deserve?</em>
      </p>

      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4 break-words">
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

  function updateChapter12Dakshina(ctx) {
    const { lang, name, chart } = ctx;
    const jupRashiId = (chart && chart.Jupiter) ? chart.Jupiter.d1 : 9;
    const jupRashi = RASHI_DATA[jupRashiId];
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
  // 10. VISUAL CHARTS (D1 SVG, D9 SVG, SHADBALA, CHALIT & DASHA TIMELINE)
  // ==========================================================================

  function renderVedicExtraSections(ctx) {
    const el = document.getElementById("vedicChartsContainer");
    if (!el) return;

    // If user is in pure 8-chapter Numerology-only view, hide charts
    if (ctx.viewFilter === "numerology_8") {
      el.innerHTML = "";
      el.classList.add("hidden");
      return;
    }

    // If VedicChartAnalyzer is loaded, we can render D1 & D9 SVGs for BOTH Exact Birth Time and Derived/Manual charts!
    if (typeof window.VedicChartAnalyzer === "undefined") {
      el.innerHTML = "";
      el.classList.add("hidden");
      return;
    }

    el.classList.remove("hidden");
    const vd = window.__jtVedicData;

    // Build chart structure for SVG renderer if in Manual or Derived mode
    let d1SVG = "", d9SVG = "", extraTablesHtml = "";
    if (vd && vd.d1SVG && vd.d9SVG) {
      d1SVG = window.VedicChartAnalyzer.renderD1NorthChart(vd.chart, { lang: ctx.lang, userName: ctx.name });
      d9SVG = window.VedicChartAnalyzer.renderD9SouthChart(vd.chart, { lang: ctx.lang, userName: ctx.name });
      extraTablesHtml = `
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
      // Derived or Manual Chart SVG synthesis
      const synthChart = {};
      ["Asc","Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].forEach(k => {
        synthChart[k] = {
          rashi: ctx.chart[k].d1,
          d9: ctx.chart[k].d9,
          retro: ctx.chart[k].retro
        };
      });
      d1SVG = window.VedicChartAnalyzer.renderD1NorthChart(synthChart, { lang: ctx.lang, userName: ctx.name });
      d9SVG = window.VedicChartAnalyzer.renderD9SouthChart(synthChart, { lang: ctx.lang, userName: ctx.name });
    }

    el.innerHTML = `
      <div class="rounded-3xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-white/10">
          <div>
            <span class="text-[11px] uppercase tracking-widest text-amber-400 font-bold block">
              ${ctx.chart.isExactAstronomyMode
                ? (ctx.lang === 'hi' ? '✦ सटीक जन्म-समय एवं अक्षांश-देशांतर कुंडली' : '✦ True Lahiri Astronomical Birth Charts')
                : (ctx.chart.isFullChartMode
                    ? (ctx.lang === 'hi' ? '✦ मैनुअल लग्न एवं नवांश कुंडली' : '✦ Custom Planetary Matrix Charts')
                    : (ctx.lang === 'hi' ? '✦ सूर्य-चंद्र एवं अंक-जनित लग्न/नवांश चक्र' : '✦ Derived Solar-Lunar & Chaldean Charts'))}
            </span>
            <h3 class="text-lg md:text-2xl font-bold text-white mt-0.5"><i class="fas fa-star text-amber-400 mr-2"></i>${ctx.lang === 'hi' ? 'लग्न कुंडली (D1) एवं नवांश कुंडली (D9)' : 'Lagna Chart (D1) & Navamsa Chart (D9)'}</h3>
          </div>
          <div class="flex gap-2 no-print">
            <button type="button" onclick="saveChartAsPNG('d1ChartWrapper','D1-Lagna-Chart')" class="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition">
              <i class="fas fa-download mr-1"></i>D1 PNG
            </button>
            <button type="button" onclick="saveChartAsPNG('d9ChartWrapper','D9-Navamsa-Chart')" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition">
              <i class="fas fa-download mr-1"></i>D9 PNG
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div id="d1ChartWrapper" class="rounded-2xl overflow-hidden border-2 border-purple-400/40 bg-white p-1.5 shadow-xl">${d1SVG}</div>
          <div id="d9ChartWrapper" class="rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-white p-1.5 shadow-xl">${d9SVG}</div>
        </div>
        <p class="text-xs text-center text-gray-300 mt-3">
          ${ctx.lang === 'hi'
            ? '<strong>D1 लग्न कुंडली</strong> आपके शारीरिक व्यक्तित्व व बाहरी जीवन को दर्शाती है • <strong>D9 नवांश कुंडली</strong> आपके विवाह, जीवनसाथी और 28–30 वर्ष के बाद के वास्तविक भाग्य को दर्शाती है।'
            : '<strong>D1 Lagna Chart</strong> maps your physical destiny & outer life • <strong>D9 Navamsa Chart</strong> unlocks your marriage, spouse temperament, and second-half maturity.'}
        </p>
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
          : (ctx.lang === "hi" ? "✓ लहिरी चित्रापक्ष अयनांश सत्यापित" : "✓ True Lahiri Chitrapaksha Verified");

        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div><i class="fas fa-check-circle text-emerald-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? '99.9% सटीक जन्म-समय एवं स्थान कुंडली सक्रिय:' : '99.9% Exact Astronomical Birth Chart Active:'}</strong>
          ${meta.name} (${meta.lat.toFixed(2)}°N, ${meta.lng.toFixed(2)}°E) • Ayanamsa: ${meta.ayanamsa.toFixed(2)}°</div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold shrink-0">${confTag}</span>
        </div>`;
      } else if (ctx.chart.isFullChartMode) {
        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200">
          <i class="fas fa-check-circle text-emerald-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? 'मैनुअल ग्रह-स्थिति मोड सक्रिय:' : 'Custom Planetary Matrix Active:'}</strong>
          ${ctx.lang === 'hi' ? 'आपके द्वारा चुने गए लग्न (D1), नक्षत्र और नवांश (D9) के आधार पर संपूर्ण 12-अध्याय फलित।' : 'Full 12-chapter Parashari & Navamsa reading calibrated to your custom planetary inputs.'}
        </div>`;
      } else {
        calEl.innerHTML = `<div class="p-3.5 rounded-xl bg-purple-950/70 border border-amber-400/40 text-xs text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div><i class="fas fa-sparkles text-amber-400 mr-1.5"></i><strong>${ctx.lang === 'hi' ? 'सूर्य-चंद्र नक्षत्र एवं चैल्डियन सिंथेसिस मोड (बिना जन्म-समय):' : 'Solar-Lunar Nakshatra & Chaldean Synthesis Mode (DOB + Name):'}</strong>
          ${ctx.lang === 'hi' ? 'जन्म-समय न होने पर भी आपकी जन्म-तिथि के सूर्य-चंद्र नक्षत्र और मूलांक-भाग्यांक से संपूर्ण 12 अध्याय और लग्न/नवांश चार्ट तैयार किए गए हैं।' : 'Even without birth time, all 12 chapters and derived charts are synthesized from your Solar-Lunar Nakshatra and Mulank-Bhagyank.'}</div>
          <a href="#topKundaliWorkspace" class="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-bold shrink-0 text-center">${ctx.lang === 'hi' ? '+ जन्म-समय जोड़ें' : '+ Add Birth Time'}</a>
        </div>`;
      }
    }

    if (togEl) {
      togEl.classList.remove("hidden");
      const isNum8 = ctx.viewFilter === "numerology_8";
      togEl.innerHTML = `<div class="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-950/85 border border-white/15 w-fit">
        <button type="button" onclick="switchDossierView('full_12')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${!isNum8 ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-300 hover:text-white'}">
          <i class="fas fa-dharmachakra mr-1"></i>${ctx.lang === 'hi' ? 'संपूर्ण 12-अध्याय कुंडली + चार्ट' : 'Full 12-Chapter Kundali + Charts'}
        </button>
        <button type="button" onclick="switchDossierView('numerology_8')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${isNum8 ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:text-white'}">
          <i class="fas fa-hashtag mr-1"></i>${ctx.lang === 'hi' ? 'केवल अंक-ज्योतिष दृश्य (8 अध्याय)' : 'Pure Numerology View (8 Chapters)'}
        </button>
      </div>`;
    }
  }

  function applyViewFilterVisibility(ctx) {
    const isNum8 = ctx.viewFilter === "numerology_8";
    const ch8 = document.getElementById("chapter-planets");
    const ch9 = document.getElementById("chapter-lagnas");
    if (ch8) ch8.style.display = isNum8 ? "none" : "";
    if (ch9) ch9.style.display = isNum8 ? "none" : "";
  }

  // ==========================================================================
  // 11. HEADINGS, MASTHEAD, METRICS & SCROLLSPY CONTROLLER
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
      ch5Title: "भाग्योदय का रहस्य एवं निर्णायक आयु वर्ष",
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
      badgeEl.innerHTML = ctx.chart.isExactAstronomyMode
        ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "99.9% सटीक जन्म-समय वैदिक कुंडली + D1/D9 चार्ट" : "99.9% True Astronomical Vedic Chart + D1/D9 Dossier"}`
        : (ctx.chart.isFullChartMode
            ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "99.9% पूर्ण वैदिक कुंडली + अष्टकवर्ग डॉसियर" : "99.9% Full Parashari + Jaimini + 337-SAV Dossier"}`
            : `<i class="fas fa-star mr-1.5"></i> ${lang === "hi" ? "ज्योतिष तर्क सूर्य-चंद्र एवं अंक जीवन दस्तावेज" : "Jyotish Tark Solar-Lunar & Chaldean Life Dossier"}`);
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
  // 12. GLOBAL HELPERS & MASTER ENTRY POINT
  // ==========================================================================

  window.__jtViewFilter = "full_12"; // "full_12" | "numerology_8"

  window.switchDossierView = function (viewFilter) {
    window.__jtViewFilter = viewFilter;
    window.generateCompleteLifeDossier(null, { preserveScroll: true });
  };

  window.saveChartAsPNG = function (id, prefix) {
    const el = document.getElementById(id);
    if (!el || typeof html2canvas !== "function") {
      alert("Chart PNG export requires html2canvas.");
      return;
    }
    html2canvas(el, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `Jyotish_Tark_${prefix}.png`;
      a.click();
    });
  };

  window.generateCompleteLifeDossier = function (event, options) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    const preserveScroll = options && options.preserveScroll === true;

    const nameInput   = document.getElementById("userName")?.value.trim() || "Seeker";
    const dobInput    = document.getElementById("userDob")?.value || "1998-01-24";
    const langInput   = document.getElementById("reportLang")?.value || "en";
    const genderInput = document.getElementById("userGender")?.value || "male";

    const chaldean       = calculateChaldeanName(nameInput);
    const numData        = calculateNumerologyFromDob(dobInput);
    const chart          = readChartFromDOM(numData, chaldean);
    const planetAnalysis = analyzeAllPlanetsAndAspects(chart);
    const specialLagnas  = computeSpecialLagnasAndBindus(chart);
    const dasha          = resolveActiveDasha(chart, numData);

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
      viewFilter: window.__jtViewFilter || "full_12",
      vedicData: window.__jtVedicData
    };

    ctx.displayAsc     = RASHI_DATA[chart.Asc.d1].en;
    ctx.displayMoon    = RASHI_DATA[chart.Moon.d1].en;
    ctx.displayMoonNak = NAKSHATRA_DATA[chart.Moon.nak].name;
    window.__jyotishLastCtx = ctx;

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

    renderCalibrationBannerAndSwitcher(ctx);
    renderVedicExtraSections(ctx);
    applyViewFilterVisibility(ctx);

    // Pre-populate Manual Booking Form
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
