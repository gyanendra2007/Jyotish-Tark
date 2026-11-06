/**
 * ============================================================================
 * JYOTISH TARK — FREE "PARICHAY" JANAM KUNDALI (FIXED-PAGE A4 PRINT REPORT)
 * File: free-report.js • v1.0
 * ============================================================================
 * Builds a self-contained, print-ready HTML document made of exactly-sized
 * A4 pages (210 × 297 mm). Every page has a fixed header, a body that can
 * never spill onto the next page (auto-fit script), and a footer carrying the
 * Guru-Dakshina QR, so the QR is on every single page.
 *
 * FULL MODE (birth time known) — 10 pages
 *   1 Cover & birth particulars          6 Yogas (strengths) & planet dignity
 *   2 D1 Lagna + Chandra charts, Spashta 7 Running Dasha + next ~5 years
 *   3 Navamsa (D9) signals               8 Life-area snapshot (details locked)
 *   4 Panchang, Avakahada, live Gochar   9 Sensitive points / doshas + remedy CTA
 *   5 Personality                       10 Simple remedies, full-kundali offer, QR
 *
 * DOB-ONLY MODE (no birth time) — 8 pages; Lagna-dependent pages are replaced
 * by an "unlock with birth time" page. Nothing Lagna-based is ever faked.
 *
 * Load order: after kundali-engine.js
 * API:
 *   const html = await window.FreeReport.buildDocument(ctx, vedicData, opts);
 *   // POST html to /api/generate-kundali-pdf, or open it and window.print()
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 0. CONSTANTS & DICTIONARIES
  // ==========================================================================
  const DAY_MS = 86400000;
  const YEAR_MS = 365.25 * DAY_MS;

  const KEYS = ["Asc", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const PLANETS9 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const PLANETS7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const MALEFICS = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

  const RASHI_HI = [null, "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
  const RASHI_EN = [null, "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const RASHI_LORD = [null, "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

  const PL_HI = { Asc: "लग्न", Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const PL_EN = { Asc: "Ascendant", Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu" };

  const NAK_HI = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"];
  const NAK_EN = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

  const EXALT = { Sun: 1, Moon: 2, Mars: 10, Mercury: 6, Jupiter: 4, Venus: 12, Saturn: 7, Rahu: 2, Ketu: 8 };
  const DEBIL = { Sun: 7, Moon: 8, Mars: 4, Mercury: 12, Jupiter: 10, Venus: 6, Saturn: 1, Rahu: 8, Ketu: 2 };
  const OWN = { Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6], Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11], Rahu: [11], Ketu: [8] };
  const ASPECTS = { Sun: [7], Moon: [7], Mercury: [7], Venus: [7], Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10], Rahu: [5, 7, 9], Ketu: [5, 7, 9] };

  const HOUSE_ORD_HI = ["", "प्रथम", "द्वितीय", "तृतीय", "चतुर्थ", "पंचम", "षष्ठ", "सप्तम", "अष्टम", "नवम", "दशम", "एकादश", "द्वादश"];
  const LORD_NAME_HI = ["", "लग्नेश", "धनेश", "तृतीयेश", "चतुर्थेश", "पंचमेश", "षष्ठेश", "सप्तमेश", "अष्टमेश", "नवमेश", "दशमेश", "लाभेश", "व्ययेश"];

  const HOUSE_HI = {
    1: "व्यक्तित्व, शरीर व आत्मबल", 2: "धन, वाणी व परिवार", 3: "पराक्रम, भाई-बहन व संवाद",
    4: "माता, घर, भूमि-वाहन व मानसिक सुख", 5: "बुद्धि, शिक्षा, संतान व पूर्व-पुण्य", 6: "प्रतियोगिता, रोग, ऋण व विरोधी",
    7: "विवाह, साझेदारी व जनसंपर्क", 8: "आयु, अचानक परिवर्तन, शोध व गुप्त विषय", 9: "भाग्य, धर्म, पिता व गुरु",
    10: "कर्म, करियर व प्रतिष्ठा", 11: "आय, लाभ व मित्र-मंडल", 12: "व्यय, विदेश, निद्रा व आध्यात्म"
  };
  const HOUSE_EN = {
    1: "self, body & vitality", 2: "wealth, speech & family", 3: "courage, siblings & communication",
    4: "mother, home, property & peace of mind", 5: "intellect, education, children & past merit", 6: "competition, illness, debt & rivals",
    7: "marriage, partnership & public dealings", 8: "longevity, sudden change, research & hidden matters", 9: "fortune, dharma, father & mentors",
    10: "career, status & authority", 11: "income, gains & networks", 12: "expenses, foreign lands, sleep & spirituality"
  };
  const SHORT_HI = { 1: "स्वास्थ्य/व्यक्तित्व", 2: "धन/परिवार", 3: "पराक्रम/संवाद", 4: "घर/माता/वाहन", 5: "शिक्षा/संतान", 6: "प्रतियोगिता/रोग", 7: "विवाह/साझेदारी", 8: "अचानक परिवर्तन", 9: "भाग्य/पिता", 10: "करियर/प्रतिष्ठा", 11: "आय/लाभ", 12: "व्यय/विदेश" };
  const SHORT_EN = { 1: "health/self", 2: "money/family", 3: "initiative/communication", 4: "home/mother/vehicles", 5: "education/children", 6: "competition/illness", 7: "marriage/partnership", 8: "sudden change", 9: "fortune/father", 10: "career/status", 11: "income/gains", 12: "expenses/foreign" };

  const LAGNA_TRAIT_HI = {
    1: "साहसी, स्पष्टवादी, तेज़ निर्णय लेने वाले और नेतृत्व-प्रिय; धैर्य आपकी सबसे बड़ी साधना है।",
    2: "स्थिर, व्यावहारिक, सौंदर्य-प्रिय और भरोसेमंद; परिवर्तन स्वीकारने में समय लेते हैं।",
    3: "बुद्धिमान, जिज्ञासु, बातचीत में कुशल और बहुमुखी; ऊर्जा कई दिशाओं में बँट सकती है।",
    4: "भावुक, संवेदनशील, परिवार-केंद्रित और रक्षा करने वाले; मन की स्थिति निर्णयों को प्रभावित करती है।",
    5: "आत्मसम्मानी, उदार, नेतृत्व-क्षमता से युक्त और सिद्धांतवादी; मान-सम्मान आपके लिए अत्यंत महत्वपूर्ण है।",
    6: "विश्लेषक, व्यवस्थित, सेवा-भावी और बारीकी देखने वाले; अत्यधिक चिंता से बचना आवश्यक है।",
    7: "संतुलित, कूटनीतिक, कलाप्रिय और संबंधों को महत्व देने वाले; निर्णय में द्विविधा रह सकती है।",
    8: "गहरे, दृढ़-निश्चयी, रहस्यप्रिय और परिवर्तन से न डरने वाले; भावनाएँ भीतर रखते हैं।",
    9: "आशावादी, धर्म-प्रिय, स्वतंत्र विचारक और ज्ञान-पिपासु; स्पष्टवादिता कभी कठोर लग सकती है।",
    10: "परिश्रमी, अनुशासित, महत्वाकांक्षी और धैर्यवान; सफलता देर से पर स्थायी आती है।",
    11: "मानवतावादी, मौलिक सोच वाले, सामाजिक और दूरदर्शी; भावनात्मक दूरी रख सकते हैं।",
    12: "करुणामय, कल्पनाशील, आध्यात्मिक और अंतर्ज्ञानी; व्यावहारिक सीमाएँ बनाना सीखना होता है।"
  };
  const LAGNA_TRAIT_EN = {
    1: "courageous, direct, quick to decide and a natural leader; patience is your main lesson.",
    2: "steady, practical, aesthetic and dependable; slow to accept change.",
    3: "intelligent, curious, articulate and versatile; energy can scatter in many directions.",
    4: "emotional, sensitive, family-centred and protective; moods colour decisions.",
    5: "dignified, generous, principled and born to lead; respect matters deeply to you.",
    6: "analytical, orderly, service-minded and detail-oriented; must guard against worry.",
    7: "balanced, diplomatic, artistic and relationship-oriented; indecision can creep in.",
    8: "deep, determined, private and unafraid of change; keeps emotions inside.",
    9: "optimistic, dharmic, independent and knowledge-seeking; frankness can sound harsh.",
    10: "hardworking, disciplined, ambitious and patient; success comes late but lasts.",
    11: "humanitarian, original, social and far-sighted; may keep emotional distance.",
    12: "compassionate, imaginative, spiritual and intuitive; must learn practical boundaries."
  };
  const MOON_TRAIT_HI = {
    1: "मन उत्साही, तेज़ और स्वतंत्र; प्रतिक्रिया तुरंत होती है, धैर्य कम।",
    2: "मन स्थिर, शांत और सुख-सुविधा प्रिय; भावनात्मक सुरक्षा ज़रूरी।",
    3: "मन जिज्ञासु, चंचल और संवाद-प्रिय; नई जानकारी से प्रसन्न।",
    4: "मन अत्यंत भावुक, ममतामय और परिवार से जुड़ा; मूड जल्दी बदलता है।",
    5: "मन गौरवशाली, उदार और प्रशंसा-प्रिय; आत्मसम्मान पर चोट सहन नहीं।",
    6: "मन विश्लेषक, व्यवस्थित और चिंतनशील; छोटी बातों की चिंता रहती है।",
    7: "मन संतुलन-प्रिय, मिलनसार और सौंदर्य-प्रेमी; अकेलेपन से असहज।",
    8: "मन गहरा, तीव्र और रहस्यप्रिय; भावनाएँ भीतर छिपी रहती हैं।",
    9: "मन आशावादी, धार्मिक और स्वतंत्रता-प्रिय; बंधन पसंद नहीं।",
    10: "मन व्यावहारिक, गंभीर और लक्ष्य-केंद्रित; भावनाएँ कम व्यक्त होती हैं।",
    11: "मन मौलिक, मानवतावादी और विचारशील; भावनात्मक दूरी बनी रहती है।",
    12: "मन करुणामय, कल्पनाशील और आध्यात्मिक; दूसरों का दुख अपना लेते हैं।"
  };
  const MOON_TRAIT_EN = {
    1: "an enthusiastic, quick, independent mind; reacts instantly, low patience.",
    2: "a steady, calm, comfort-loving mind; needs emotional security.",
    3: "a curious, restless, communicative mind; delighted by new information.",
    4: "a deeply emotional, nurturing, family-bound mind; moods shift quickly.",
    5: "a proud, generous mind that loves appreciation; hurt by disrespect.",
    6: "an analytical, orderly, reflective mind; worries over small things.",
    7: "a harmony-seeking, sociable, aesthetic mind; uneasy when alone.",
    8: "a deep, intense, secretive mind; feelings stay hidden.",
    9: "an optimistic, dharmic, freedom-loving mind; dislikes restriction.",
    10: "a practical, serious, goal-driven mind; expresses little emotion.",
    11: "an original, humanitarian, thoughtful mind; keeps emotional distance.",
    12: "a compassionate, imaginative, spiritual mind; absorbs others' pain."
  };
  const MOON_DUSTHANA_HI = {
    6: "षष्ठ चंद्र: मन प्रतिस्पर्धी है, पर तनाव जल्दी लेता है।",
    8: "अष्टम चंद्र: अंतर्ज्ञान गहरा है, पर मन भीतर ही भीतर अधिक सोचता और चिंता करता है।",
    12: "द्वादश चंद्र: कल्पनाशील व आध्यात्मिक मन; नींद और एकांत की विशेष आवश्यकता।"
  };
  const MOON_DUSTHANA_EN = {
    6: "Moon in the 6th: a competitive mind that absorbs stress quickly.",
    8: "Moon in the 8th: deep intuition, but the mind overthinks and worries internally.",
    12: "Moon in the 12th: imaginative and spiritual; needs good sleep and solitude."
  };
  const AK_LESSON_HI = {
    Sun: "अहंकार को सेवा-भाव में बदलना", Moon: "भावनात्मक संतुलन और करुणा", Mars: "साहस को अनुशासन में ढालना और क्रोध पर विजय",
    Mercury: "वाणी और बुद्धि का सत्यनिष्ठ प्रयोग", Jupiter: "ज्ञान को विनम्रता से बाँटना", Venus: "इच्छाओं और संबंधों में संयम",
    Saturn: "धैर्य, कर्तव्य और दूसरों के दुख की समझ"
  };
  const AK_LESSON_EN = {
    Sun: "turning ego into service", Moon: "emotional balance and compassion", Mars: "channelling courage into discipline and mastering anger",
    Mercury: "using speech and intellect truthfully", Jupiter: "sharing wisdom with humility", Venus: "restraint in desires and relationships",
    Saturn: "patience, duty and understanding others' suffering"
  };
  const FIELD_HI = {
    Sun: "प्रशासन, सरकारी सेवा, प्रबंधन, चिकित्सा", Moon: "स्वास्थ्य-सेवा, आतिथ्य, जनसंपर्क, मनोविज्ञान",
    Mars: "इंजीनियरिंग, रक्षा/पुलिस, भूमि-निर्माण, खेल", Mercury: "आईटी, वित्त/लेखा, वाणिज्य, लेखन, परामर्श",
    Jupiter: "शिक्षण, विधि, बैंकिंग, परामर्श", Venus: "डिज़ाइन, मीडिया, कला, लग्ज़री व्यापार, वित्त",
    Saturn: "उद्योग, संचालन, न्याय-तंत्र, तकनीकी सेवा", Rahu: "आधुनिक तकनीक, विदेश व्यापार, एविएशन, शोध",
    Ketu: "शोध, चिकित्सीय निदान, साइबर सुरक्षा, अध्यात्म"
  };
  const FIELD_EN = {
    Sun: "administration, government, management, medicine", Moon: "healthcare, hospitality, public relations, psychology",
    Mars: "engineering, defence/police, real estate, sports", Mercury: "IT, finance/accounts, commerce, writing, consulting",
    Jupiter: "teaching, law, banking, advisory", Venus: "design, media, arts, luxury trade, finance",
    Saturn: "industry, operations, judiciary, technical services", Rahu: "new-age tech, foreign trade, aviation, research",
    Ketu: "research, diagnostics, cyber-security, spirituality"
  };
  const IN_LAGNA_HI = {
    Sun: "तेजस्वी, आत्मविश्वासी व नेतृत्व-प्रिय; अहं पर नियंत्रण आवश्यक", Moon: "आकर्षक, भावुक व लोकप्रिय; मन की चंचलता",
    Mars: "ऊर्जावान व साहसी; क्रोध व चोट से सावधानी", Mercury: "बुद्धिमान, वाक्पटु व युवा-दिखने वाले",
    Jupiter: "ज्ञानी, उदार, सम्माननीय; जीवन में ईश्वरीय संरक्षण", Venus: "आकर्षक, कलाप्रिय व सुख-सुविधा प्रिय",
    Saturn: "गंभीर व परिश्रमी; प्रारंभिक संघर्ष, बाद में स्थिरता", Rahu: "महत्वाकांक्षी, अपरंपरागत सोच; बेचैनी व भ्रम",
    Ketu: "अंतर्मुखी व आध्यात्मिक; आत्म-पहचान को लेकर प्रश्न"
  };
  const IN_LAGNA_EN = {
    Sun: "radiant, confident and commanding; ego needs control", Moon: "attractive, emotional and popular; a changeable mind",
    Mars: "energetic and brave; caution with anger and injuries", Mercury: "intelligent, articulate and youthful",
    Jupiter: "wise, generous and respected; divine protection in life", Venus: "charming, artistic and comfort-loving",
    Saturn: "serious and hardworking; early struggle, later stability", Rahu: "ambitious and unconventional; restlessness",
    Ketu: "introverted and spiritual; questions about identity"
  };
  const MANTRA = {
    Sun: "ॐ घृणि सूर्याय नमः", Moon: "ॐ सों सोमाय नमः", Mars: "ॐ अं अंगारकाय नमः", Mercury: "ॐ बुं बुधाय नमः",
    Jupiter: "ॐ बृं बृहस्पतये नमः", Venus: "ॐ शुं शुक्राय नमः", Saturn: "ॐ शं शनैश्चराय नमः", Rahu: "ॐ रां राहवे नमः", Ketu: "ॐ कें केतवे नमः"
  };
  const SIMPLE_REMEDY_HI = {
    Sun: "प्रातः ताँबे के लोटे से सूर्य को जल अर्पण; पिता व वरिष्ठों का सम्मान",
    Moon: "सोमवार को शिवलिंग पर जल/दूध अर्पण; माता का आशीर्वाद लें",
    Mars: "मंगलवार को हनुमान चालीसा; क्रोध व जल्दबाज़ी पर संयम",
    Mercury: "बुधवार को गणेश जी को दूर्वा; वाणी में सत्य व मधुरता",
    Jupiter: "गुरुवार को केले/चने की दाल का दान; गुरुजनों का सम्मान",
    Venus: "शुक्रवार को माता लक्ष्मी की आराधना; स्वच्छता व सौंदर्य का ध्यान",
    Saturn: "शनिवार को हनुमान चालीसा, काले तिल/सरसों तेल का दान; श्रमिकों व वृद्धों की सेवा",
    Rahu: "शनिवार को दुर्गा कवच; नशे व शॉर्टकट से दूरी",
    Ketu: "गणेश जी की उपासना; पक्षियों/श्वानों को भोजन"
  };
  const SIMPLE_REMEDY_EN = {
    Sun: "Offer water to the rising Sun from a copper vessel; respect father and elders",
    Moon: "Offer water/milk to Shiva on Mondays; seek your mother's blessings",
    Mars: "Recite Hanuman Chalisa on Tuesdays; restrain anger and haste",
    Mercury: "Offer durva grass to Ganesha on Wednesdays; keep speech truthful",
    Jupiter: "Donate bananas/chana dal on Thursdays; honour teachers",
    Venus: "Worship Goddess Lakshmi on Fridays; keep surroundings clean and beautiful",
    Saturn: "Hanuman Chalisa on Saturdays, donate black sesame/mustard oil; serve workers and the elderly",
    Rahu: "Recite Durga Kavach on Saturdays; avoid intoxicants and shortcuts",
    Ketu: "Worship Lord Ganesha; feed birds/dogs"
  };
  const MON_HI = ["जन॰", "फ़र॰", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अग॰", "सित॰", "अक्टू॰", "नव॰", "दिस॰"];
  const MON_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const VARA_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const VARA_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const DEFAULTS = {
    qrSrc: "qr-code.png",
    logoSrc: "logo.png",
    phone: "+91 8318513814",
    waNumber: "918318513814",
    site: "jyotishtark.in",
    email: "jyotishtark@gmail.com",
    acharyaHi: "आचार्य ज्ञानेन्द्र सिंह तोमर",
    acharyaEn: "Acharya Gyanendra Singh Tomar",
    fullPrice: "₹1,101",
    fullPriceStrike: ""
  };

  // ==========================================================================
  // 1. SMALL HELPERS
  // ==========================================================================
  let LANG = "hi";
  let OPT = DEFAULTS;
  const T = (hi, en) => (LANG === "hi" ? hi : en);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm360 = (d) => (((Number(d) || 0) % 360) + 360) % 360;
  const houseFrom = (ref, target) => ((target - ref + 12) % 12) + 1;
  const rashiOfHouse = (asc, h) => ((asc + h - 2) % 12) + 1;
  const signOfLon = (lon) => Math.floor(norm360(lon) / 30) + 1;
  const sgn = (p) => (p && (p.rashi || p.d1)) || 1;
  const nakOf = (p) => (p && (p.nakshatra || p.nak)) || (Math.floor(norm360(p && p.longitude) / (360 / 27)) + 1);
  const lonOf = (p) => (p && typeof p.longitude === "number") ? norm360(p.longitude) : ((sgn(p) - 1) * 30 + 15);
  const ordEn = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  const rName = (r) => T(RASHI_HI[r], RASHI_EN[r]);
  const pName = (p) => T(PL_HI[p], PL_EN[p]);
  const nName = (n) => T(NAK_HI[n - 1], NAK_EN[n - 1]);
  const bh = (n) => T(`${HOUSE_ORD_HI[n]} भाव`, `${ordEn(n)} house`);
  const lordName = (n) => T(LORD_NAME_HI[n], `${ordEn(n)} lord`);
  const houseTheme = (n) => T(HOUSE_HI[n], HOUSE_EN[n]);
  const shortTheme = (n) => T(SHORT_HI[n], SHORT_EN[n]);
  const isDebil = (k, r) => DEBIL[k] === r;
  const isStrongSign = (k, r) => EXALT[k] === r || (OWN[k] || []).includes(r);
  const aspectsSign = (k, fromR, toR) => fromR === toR || (ASPECTS[k] || [7]).includes(houseFrom(fromR, toR));
  const uniq = (arr) => Array.from(new Set(arr));

  function shortDeg(p) {
    const d = (p && typeof p.degInSign === "number") ? p.degInSign : (lonOf(p) % 30);
    const dd = Math.floor(d), mm = Math.floor((d - dd) * 60);
    return `${dd}°${String(mm).padStart(2, "0")}′`;
  }
  function fmtMY(ms) {
    const d = new Date(ms);
    return `${T(MON_HI[d.getMonth()], MON_EN[d.getMonth()])} ${d.getFullYear()}`;
  }
  function fmtDMY(ms) {
    const d = new Date(ms);
    return `${String(d.getDate()).padStart(2, "0")} ${T(MON_HI[d.getMonth()], MON_EN[d.getMonth()])} ${d.getFullYear()}`;
  }
  function ms(d) { return d instanceof Date ? d.getTime() : Number(d); }
  function hash4(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36).toUpperCase().slice(-5);
  }

  // ==========================================================================
  // 2. LIVE TRANSIT (SIDEREAL SATURN / JUPITER) & SADE-SATI CYCLE FINDER
  // ==========================================================================
  function siderealLon(body, date) {
    try {
      if (typeof Astronomy !== "undefined" && window.BirthChartCalculator && window.BirthChartCalculator._internal) {
        const ecl = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[body], date, true));
        return norm360(ecl.elon - window.BirthChartCalculator._internal.lahiriAyanamsa(date));
      }
    } catch (e) { /* fall through to mean-motion approximation */ }
    const d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / DAY_MS;
    return body === "Saturn" ? norm360(16.5 + d * 0.033459) : norm360(10.5 + d * 0.083091);
  }

  function computeTransits(moonR, ascR) {
    const now = Date.now();
    const satNow = signOfLon(siderealLon("Saturn", new Date(now)));
    const jupNow = signOfLon(siderealLon("Jupiter", new Date(now)));

    // Saturn scan: 8 years back → 31 years ahead, 5-day steps, merged across retrograde gaps
    const step = 5 * DAY_MS, start = now - 8 * YEAR_MS, end = now + 31 * YEAR_MS;
    const samples = [];
    for (let t = start; t <= end; t += step) {
      samples.push({ t, h: houseFrom(moonR, signOfLon(siderealLon("Saturn", new Date(t)))) });
    }
    const blocks = (pred) => {
      const out = []; let cur = null;
      samples.forEach((s) => {
        if (!pred(s.h)) return;
        if (cur && s.t - cur.end <= 420 * DAY_MS) cur.end = s.t + step;
        else { cur = { start: s.t, end: s.t + step }; out.push(cur); }
      });
      return out;
    };
    const pick = (arr) => ({
      current: arr.find((b) => b.start <= now && b.end >= now) || null,
      next: arr.find((b) => b.start > now) || null,
      prev: arr.slice().reverse().find((b) => b.end < now) || null
    });
    const ssBlocks = blocks((h) => h === 12 || h === 1 || h === 2);
    const ss = pick(ssBlocks);
    const phaseBlock = ss.current || ss.next;
    let phases = null;
    if (phaseBlock) {
      const inB = samples.filter((s) => s.t >= phaseBlock.start && s.t <= phaseBlock.end);
      const peak = inB.find((s) => s.h === 1);
      const setting = inB.find((s) => s.h === 2);
      phases = { rising: phaseBlock.start, peak: peak ? peak.t : null, setting: setting ? setting.t : null, end: phaseBlock.end };
    }
    return {
      satNow, jupNow,
      satFromMoon: houseFrom(moonR, satNow), satFromAsc: houseFrom(ascR, satNow),
      jupFromMoon: houseFrom(moonR, jupNow), jupFromAsc: houseFrom(ascR, jupNow),
      sadeSati: { ...ss, phases },
      dhaiya4: pick(blocks((h) => h === 4)),
      dhaiya8: pick(blocks((h) => h === 8))
    };
  }

  // ==========================================================================
  // 3. MODEL BUILDER (ALL FACTS USED BY THE PAGES)
  // ==========================================================================
  function birthMsOf(ctx, chart) {
    const bu = chart && chart.meta && chart.meta.birthUTC;
    if (bu) { const t = new Date(bu).getTime(); if (!isNaN(t)) return t; }
    const [y, mo, d] = String(ctx.dob || "2000-01-01").split("-").map(Number);
    return Date.UTC(y || 2000, (mo || 1) - 1, d || 1, 6, 30);
  }

  function computeAK(chart) {
    let best = "Sun", max = -1;
    PLANETS7.forEach((k) => { const d = lonOf(chart[k]) % 30; if (d > max) { max = d; best = k; } });
    return best;
  }

  function buildModel(ctx, vd) {
    const chart = (vd && vd.chart) ? vd.chart : ctx.chart;
    const full = Boolean(ctx.chart && ctx.chart.isFullChartMode);
    const sg = (k) => sgn(chart[k]);
    const moonR = sg("Moon"), sunR = sg("Sun");
    const ascR = full ? sg("Asc") : moonR;
    const house = (k) => houseFrom(ascR, sg(k));
    const lordOf = (h) => RASHI_LORD[rashiOfHouse(ascR, h)];
    const owned = (k) => { const o = []; for (let h = 1; h <= 12; h++) if (lordOf(h) === k) o.push(h); return o; };
    const occupants = (h) => PLANETS9.filter((k) => house(k) === h);
    const dobMs = birthMsOf(ctx, chart);
    const age = Math.max(0, (Date.now() - dobMs) / YEAR_MS);
    const sav = full && ctx.specialLagnas ? ctx.specialLagnas.houseBindus : null;
    const findings = ctx.findings || null;
    const matrix = (findings && findings.functionalMatrix) ||
      (window.FindingsEngine && window.FindingsEngine.BPHS_LAGNA_MATRIX && window.FindingsEngine.BPHS_LAGNA_MATRIX[ascR]) ||
      { yogakaraka: [], benefics: [], malefics: [], marakas: [], badhakesh: null, badhakaHouse: null };
    const helpers = window.__jtClassicalHelpers || {};

    let panchang = null;
    try { panchang = window.VedicChartAnalyzer.computePanchangAndAvakahada(chart); } catch (e) { panchang = null; }
    let samvat = null;
    try { samvat = helpers.computeSunriseSunsetAndVedicVara ? helpers.computeSunriseSunsetAndVedicVara(ctx) : null; } catch (e) { samvat = null; }

    const moonNak = nakOf(chart.Moon);
    const moonPada = chart.Moon.pada || 1;
    const aksh = helpers.NAKSHATRA_AKSHARAS ? helpers.NAKSHATRA_AKSHARAS[moonNak] : null;
    const syllable = aksh ? (aksh.pada[moonPada - 1] || aksh.pada[0]) : "";
    const ck = (findings && findings.charaKarakas) || {};

    const m = {
      ctx, vd, chart, full, ascR, moonR, sunR, sg, house, lordOf, owned, occupants,
      dobMs, age, sav, findings, matrix, panchang, samvat, moonNak, moonPada, aksh, syllable,
      ak: ck.atmakaraka || (ctx.specialLagnas && ctx.specialLagnas.atmakarakaKey) || computeAK(chart),
      amk: ck.amatyakaraka || null,
      dk: ck.darakaraka || null,
      transit: computeTransits(moonR, ascR)
    };
    m.moonReliable = Boolean(full || (chart.isDobOnlyRealAstronomy && chart.meta && chart.moonShiftedSignThatDay === false));
    m.num = full ? null : buildNumModel(ctx);
    m.dasha = buildDashaModel(m);
    m.yogas = detectPositiveYogas(m);
    m.cons = detectSensitivePoints(m);
    m.areas = full ? buildLifeAreas(m) : [];
    m.reportId = `JT-${String(ctx.dob || "").replace(/-/g, "").slice(2)}-${hash4(`${ctx.name}|${ctx.dob}|${chart.meta && chart.meta.time}`)}`;
    return m;
  }

  // ==========================================================================
  // 4. DASHA MODEL & PERIOD TONE
  // ==========================================================================
  function buildDashaModel(m) {
    const d = m.ctx.dasha;
    if (!m.full || !d || !d.md || !Array.isArray(d.fullSeq)) return null;
    const flat = [];
    d.fullSeq.forEach((md) => (md.antardashas || []).forEach((ad) => flat.push(ad)));
    const now = Date.now();
    let idx = flat.findIndex((ad) => ms(ad.start) <= now && ms(ad.end) >= now);
    if (idx < 0) idx = 0;
    const md = d.fullSeq.find((x) => ms(x.start) <= now && ms(x.end) >= now) || d.mdActive || d.fullSeq[0];
    return {
      md, ad: flat[idx], pd: d.pdActive || null,
      prev: idx > 0 ? flat[idx - 1] : null,
      next: flat.slice(idx + 1, idx + 5)
    };
  }

  function periodTone(m, lord, mdLord) {
    let s = 0;
    const h = m.house(lord);
    if ([6, 8, 12].includes(h)) s -= 2; else if ([1, 4, 5, 7, 9, 10, 11].includes(h)) s += 1;
    if (mdLord && mdLord !== lord) {
      const rel = houseFrom(m.sg(mdLord), m.sg(lord));
      if ([6, 8, 12].includes(rel)) s -= 1; else if ([1, 4, 5, 7, 9, 10, 11].includes(rel)) s += 1;
    }
    if ((m.matrix.yogakaraka || []).includes(lord)) s += 2;
    else if ((m.matrix.benefics || []).includes(lord)) s += 1;
    else if ((m.matrix.malefics || []).includes(lord)) s -= 1;
    if (isDebil(lord, m.sg(lord))) s -= 1;
    if (isStrongSign(lord, m.sg(lord))) s += 1;
    return s >= 2 ? "good" : (s <= -1 ? "caution" : "mixed");
  }

  function toneChip(tone) {
    const map = {
      good: [T("अनुकूल", "Favourable"), "chip-good"],
      mixed: [T("मिश्रित", "Mixed"), "chip-mixed"],
      caution: [T("सावधानी", "Caution"), "chip-caution"]
    };
    const [txt, cls] = map[tone] || map.mixed;
    return `<span class="chip ${cls}">${txt}</span>`;
  }

  function lordshipLabel(m, k) {
    const own = m.owned(k);
    if (!own.length) return T("छाया ग्रह", "shadow planet");
    return T(`${own.map((h) => HOUSE_ORD_HI[h]).join(" व ")} भाव के स्वामी`, `lord of ${own.map(ordEn).join(" & ")}`);
  }

  function periodThemes(m, k) {
    return uniq([...m.owned(k), m.house(k)]).map(shortTheme).join(", ");
  }

  // ==========================================================================
  // 5. POSITIVE YOGA DETECTION (STRENGTHS)
  // ==========================================================================
  function relationOf(m, a, b) {
    const ra = m.sg(a), rb = m.sg(b);
    if (ra === rb) return "conj";
    if ((ASPECTS[a] || [7]).includes(houseFrom(ra, rb)) && (ASPECTS[b] || [7]).includes(houseFrom(rb, ra))) return "aspect";
    if (RASHI_LORD[ra] === b && RASHI_LORD[rb] === a) return "exchange";
    return null;
  }
  const REL_HI = { conj: "युति", aspect: "परस्पर पूर्ण दृष्टि", exchange: "राशि परिवर्तन" };
  const REL_EN = { conj: "conjunction", aspect: "mutual full aspect", exchange: "sign exchange" };

  function ownerLabel(m, k) {
    const own = m.owned(k);
    return T(`${own.map((h) => LORD_NAME_HI[h]).join("-")} ${PL_HI[k]}`, `${PL_EN[k]} (${own.map(ordEn).join("/")} lord)`);
  }

  function detectPositiveYogas(m) {
    const out = [];
    const add = (id, score, title, desc) => { if (!out.some((y) => y.id === id)) out.push({ id, score, title, desc }); };
    const { chart, full } = m;
    const benefic3 = ["Jupiter", "Venus", "Mercury"];

    if (full) {
      // Pancha Mahapurusha
      const MP = { Mars: ["रुचक", "Ruchaka"], Mercury: ["भद्र", "Bhadra"], Jupiter: ["हंस", "Hamsa"], Venus: ["मालव्य", "Malavya"], Saturn: ["शश", "Shasha"] };
      Object.keys(MP).forEach((k) => {
        const h = m.house(k);
        if ([1, 4, 7, 10].includes(h) && isStrongSign(k, m.sg(k))) {
          add(`MP_${k}`, 90, T(`${MP[k][0]} महापुरुष योग`, `${MP[k][1]} Mahapurusha Yoga`),
            T(`${pName(k)} केंद्र (${bh(h)}) में अपनी ${EXALT[k] === m.sg(k) ? "उच्च" : "स्व"} राशि में — असाधारण व्यक्तित्व व ख्याति का योग।`,
              `${pName(k)} in a kendra (${bh(h)}) in its ${EXALT[k] === m.sg(k) ? "exaltation" : "own"} sign — a mark of distinction and renown.`));
        }
      });

      // Kendra–Trikona Raja Yoga & Trikona–Trikona link
      const kendraH = [1, 4, 7, 10], trikonaH = [1, 5, 9];
      const seen = new Set();
      kendraH.forEach((kh) => trikonaH.forEach((th) => {
        if (kh === th) return;
        const a = m.lordOf(kh), b = m.lordOf(th);
        if (a === b) return;
        const key = [a, b].sort().join("-");
        if (seen.has(key)) return;
        const rel = relationOf(m, a, b);
        if (!rel) return;
        seen.add(key);
        add(`RAJA_${key}`, 88, T(`राजयोग — ${ownerLabel(m, a)} एवं ${ownerLabel(m, b)}`, `Raja Yoga — ${ownerLabel(m, a)} & ${ownerLabel(m, b)}`),
          T(`केंद्र व त्रिकोण के स्वामियों की ${REL_HI[rel]} — परिश्रम को पद, प्रतिष्ठा और भाग्य का साथ मिलता है।`,
            `${REL_EN[rel]} of kendra and trikona lords — effort is rewarded with position, status and luck.`));
      }));
      [[5, 9], [1, 5], [1, 9]].forEach(([h1, h2]) => {
        const a = m.lordOf(h1), b = m.lordOf(h2);
        if (a === b) return;
        const key = [a, b].sort().join("-");
        if (seen.has(key)) return;
        const rel = relationOf(m, a, b);
        if (!rel) return;
        seen.add(key);
        add(`TRIKONA_${key}`, 84, T(`लक्ष्मी-भाग्य योग — ${ownerLabel(m, a)} एवं ${ownerLabel(m, b)}`, `Lakshmi-Bhagya link — ${ownerLabel(m, a)} & ${ownerLabel(m, b)}`),
          T(`दो त्रिकोण-स्वामियों की ${REL_HI[rel]} — बुद्धि और भाग्य साथ चलते हैं।`, `${REL_EN[rel]} of two trikona lords — intellect and fortune move together.`));
      });

      // Yogakaraka well placed
      (m.matrix.yogakaraka || []).forEach((k) => {
        const h = m.house(k);
        if (![6, 8, 12].includes(h)) {
          add(`YK_${k}`, 82, T(`योगकारक ${PL_HI[k]} ${bh(h)} में`, `Yogakaraka ${PL_EN[k]} in the ${ordEn(h)} house`),
            T(`केंद्र व त्रिकोण दोनों का स्वामी शुभ स्थान में — इसकी दशा/अंतर्दशा उन्नति लाती है।`, `Lord of both a kendra and a trikona, well placed — its periods bring progress.`));
        }
      });

      // Vargottama Lagna
      if (chart.Asc && chart.Asc.d9 && sgn(chart.Asc) === chart.Asc.d9) {
        add("VARGOTTAMA_LAGNA", 84, T("वर्गोत्तम लग्न", "Vargottama Ascendant"),
          T(`लग्न-कुंडली व नवांश दोनों में ${rName(m.ascR)} लग्न — दृढ़ व्यक्तित्व, स्थिर स्वास्थ्य और भीतर से मज़बूत चरित्र।`,
            `${rName(m.ascR)} rises in both D1 and D9 — firm personality, steady constitution and inner strength.`));
      }

      // Saraswati
      const sarOk = benefic3.every((k) => [1, 2, 4, 5, 7, 9, 10].includes(m.house(k)));
      const jupDig = chart.Jupiter.dignityInfo && chart.Jupiter.dignityInfo.code;
      if (sarOk && !isDebil("Jupiter", m.sg("Jupiter")) && (!jupDig || ["EXALTED", "MOOLATRIKONA", "OWN_SIGN", "GREAT_FRIEND", "FRIEND"].includes(jupDig))) {
        add("SARASWATI", 86, T("सरस्वती योग", "Saraswati Yoga"),
          T("गुरु, शुक्र व बुध केंद्र/त्रिकोण/धन भाव में — तीव्र बुद्धि, स्मरण-शक्ति, विद्या और प्रभावी अभिव्यक्ति।",
            "Jupiter, Venus and Mercury in kendra/trikona/2nd — sharp intellect, memory, learning and eloquence."));
      }

      // Amala (from Lagna)
      const tenthL = m.occupants(10).filter((k) => benefic3.includes(k));
      if (tenthL.length) {
        add("AMALA_L", 78, T("अमल योग (लग्न से)", "Amala Yoga (from Lagna)"),
          T(`दशम भाव में ${tenthL.map((k) => PL_HI[k]).join(", ")} — कार्यक्षेत्र में स्वच्छ छवि और सम्मान।`, `${tenthL.map((k) => PL_EN[k]).join(", ")} in the 10th — a clean professional reputation.`));
      }

      // Dhana yoga: 2nd/11th lord in a trikona or with 9th/5th lord
      const l2 = m.lordOf(2), l11 = m.lordOf(11);
      uniq([l2, l11]).forEach((k) => {
        const h = m.house(k);
        if ([1, 5, 9].includes(h)) {
          add(`DHANA_${k}`, 80, T(`धन योग — ${ownerLabel(m, k)} ${bh(h)} में`, `Dhana Yoga — ${ownerLabel(m, k)} in the ${ordEn(h)}`),
            T(`धन/लाभ भाव का स्वामी त्रिकोण में — बुद्धि और पूर्व-पुण्य से धन-संचय।`, `Wealth/gain lord in a trikona — wealth through intelligence and merit.`));
        }
      });

      // Jupiter in kendra from Lagna
      if ([1, 4, 7, 10].includes(m.house("Jupiter")) && !isDebil("Jupiter", m.sg("Jupiter"))) {
        add("JUP_KENDRA", 74, T(`गुरु ${bh(m.house("Jupiter"))} में (केंद्र)`, `Jupiter in a kendra (${ordEn(m.house("Jupiter"))})`),
          T("केंद्रस्थ गुरु अनेक दोषों का शमन करता है — कठिन समय में संरक्षण और सही मार्गदर्शन।",
            "A kendra Jupiter softens many afflictions — protection and right guidance in hard times."));
      }
    }

    // Moon-based yogas (valid even without birth time)
    const fromMoon = (k) => houseFrom(m.moonR, m.sg(k));
    const tenthM = ["Jupiter", "Venus", "Mercury"].filter((k) => fromMoon(k) === 10);
    if (tenthM.length) {
      add("AMALA_M", 76, T("अमल योग (चंद्र से)", "Amala Yoga (from Moon)"),
        T(`चंद्र से दशम में ${tenthM.map((k) => PL_HI[k]).join(", ")} — प्रतिष्ठित और नैतिक कर्म-जीवन।`, `${tenthM.map((k) => PL_EN[k]).join(", ")} 10th from the Moon — a respected, ethical working life.`));
    }
    const jfm = fromMoon("Jupiter");
    if ([1, 4, 7, 10].includes(jfm) && !isDebil("Jupiter", m.sg("Jupiter"))) {
      add("GAJAKESARI", 80, T("गजकेसरी योग", "Gajakesari Yoga"),
        T(`गुरु चंद्र से ${HOUSE_ORD_HI[jfm]} स्थान (केंद्र) में — यश, बुद्धिमत्ता और संकट में रक्षा।`, `Jupiter in a kendra from the Moon — fame, wisdom and protection in crises.`));
    }
    const nonLum = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const m2 = nonLum.filter((k) => fromMoon(k) === 2), m12 = nonLum.filter((k) => fromMoon(k) === 12);
    if (m2.length && m12.length) add("DURUDHARA", 68, T("दुरुधरा योग", "Durudhara Yoga"), T("चंद्र के दोनों ओर ग्रह — साधन-संपन्नता और भावनात्मक सहारा।", "Planets on both sides of the Moon — resources and emotional support."));
    else if (m2.length) add("SUNAPHA", 64, T("सुनफा योग", "Sunapha Yoga"), T(`चंद्र से द्वितीय में ${m2.map((k) => PL_HI[k]).join(", ")} — स्व-अर्जित धन और बुद्धि।`, `${m2.map((k) => PL_EN[k]).join(", ")} 2nd from the Moon — self-earned wealth.`));
    else if (m12.length) add("ANAPHA", 62, T("अनफा योग", "Anapha Yoga"), T(`चंद्र से द्वादश में ${m12.map((k) => PL_HI[k]).join(", ")} — आत्मनिर्भरता; केमद्रुम दोष नहीं बनता।`, `${m12.map((k) => PL_EN[k]).join(", ")} 12th from the Moon — self-reliance; Kemadruma does not form.`));

    const fromSun = (k) => houseFrom(m.sunR, m.sg(k));
    const s2 = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((k) => fromSun(k) === 2);
    const s12 = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((k) => fromSun(k) === 12);
    if (s2.length && s12.length) add("UBHAYACHARI", 66, T("उभयचारी योग", "Ubhayachari Yoga"), T("सूर्य के दोनों ओर ग्रह — संतुलित व्यक्तित्व और सामाजिक सम्मान।", "Planets on both sides of the Sun — balanced character and social respect."));
    else if (s2.length) add("VESI", 64, T("वेशि योग", "Vesi Yoga"), T(`सूर्य से द्वितीय में ${s2.map((k) => PL_HI[k]).join(", ")} — सद्गुण, वाक्पटुता और प्रगति।`, `${s2.map((k) => PL_EN[k]).join(", ")} 2nd from the Sun — virtue, eloquence and progress.`));
    else if (s12.length) add("VASI", 62, T("वाशि योग", "Vasi Yoga"), T(`सूर्य से द्वादश में ${s12.map((k) => PL_HI[k]).join(", ")} — परिश्रम से उन्नति।`, `${s12.map((k) => PL_EN[k]).join(", ")} 12th from the Sun — rise through effort.`));

    if (m.sg("Sun") === m.sg("Mercury") && !chart.Mercury.combust) {
      add("BUDHADITYA", 70, T("बुधादित्य योग", "Budhaditya Yoga"), T("सूर्य-बुध युति (बुध अस्त नहीं) — तीक्ष्ण बुद्धि और प्रशासनिक कुशलता।", "Sun–Mercury conjunction (Mercury not combust) — sharp intellect and administrative skill."));
    }

    // From the findings engine (re-titled cleanly, no mixed language)
    ((m.findings && m.findings.allYogas) || []).forEach((y) => {
      if (y.category === "Viparita Raja Yoga") {
        const k = y.planets[0];
        add(y.id, 72, T(`विपरीत राजयोग — ${ownerLabel(m, k)} ${bh(y.house)} में`, `Viparita Raja Yoga — ${ownerLabel(m, k)} in the ${ordEn(y.house)}`),
          T("दुःस्थान का स्वामी दुःस्थान में — संकट और विरोध के बीच से अचानक उन्नति।", "A dusthana lord in a dusthana — sudden rise out of crisis and opposition."));
      } else if (y.category === "Neechabhanga Raja Yoga") {
        const k = y.planets[0];
        add(y.id, 80, T(`नीचभंग राजयोग — ${PL_HI[k]}`, `Neechabhanga Raja Yoga — ${PL_EN[k]}`),
          T(`${PL_HI[k]} नीच राशि में होकर भी शास्त्रीय भंग — संघर्ष के बाद ऊँचा उठने का योग।`, `${PL_EN[k]} is debilitated but cancelled — rising high after struggle.`));
      } else if (y.category === "Maha Parivartana Yoga") {
        const [a, b] = y.planets;
        add(y.id, 85, T(`महा परिवर्तन योग — ${PL_HI[a]} ⇄ ${PL_HI[b]}`, `Maha Parivartana Yoga — ${PL_EN[a]} ⇄ ${PL_EN[b]}`),
          T(`${bh(m.house(a))} और ${bh(m.house(b))} के स्वामियों का राशि-परिवर्तन — दोनों भावों के फल परस्पर बलवान।`, `Sign exchange linking the ${ordEn(m.house(a))} and ${ordEn(m.house(b))} houses — both strengthen each other.`));
      }
    });

    return out.sort((a, b) => b.score - a.score);
  }

  // ==========================================================================
  // 6. SENSITIVE POINTS / DOSHAS (HONEST, CHART-DERIVED "CONS")
  // ==========================================================================
  function detectSensitivePoints(m) {
    const out = [];
    const add = (o) => { if (!out.some((x) => x.key === o.key)) out.push(o); };
    const { chart, full, transit: tr } = m;
    const ss = tr.sadeSati;
    // Moon-based points need a reliable Moon sign (always true with birth time;
    // with date only, only if the Moon stayed in one sign all day).
    const moonOK = full || m.moonReliable;

    // 1. Sade-Sati / Dhaiya (live transit)
    if (moonOK && ss.current) {
      const h = tr.satFromMoon;
      const phase = h === 12 ? 1 : (h === 1 ? 2 : 3);
      const phaseHi = ["", "प्रथम (उदय)", "द्वितीय (शिखर)", "तृतीय (अस्त)"][phase];
      const phaseEn = ["", "first (rising)", "second (peak)", "third (setting)"][phase];
      const effHi = phase === 2
        ? "मानसिक दबाव, कार्यों में देरी, स्वास्थ्य व खर्च पर ध्यान। धैर्य, अनुशासन और सही उपाय से यही समय मज़बूत नींव बनाता है।"
        : (phase === 1 ? "खर्च, स्थान-परिवर्तन व नींद पर प्रभाव; नई प्रतिबद्धताएँ सोच-समझकर लें।" : "धन-प्रवाह, वाणी व पारिवारिक मामलों में संयम; दबाव धीरे-धीरे घटता है।");
      const effEn = phase === 2
        ? "Mental pressure, delays, watch health and expenses. With patience, discipline and the right remedies this period builds a strong foundation."
        : (phase === 1 ? "Affects expenses, relocation and sleep; take on new commitments carefully." : "Restraint in money, speech and family matters; pressure eases gradually.");
      add({
        key: "SADESATI", sev: phase === 2 ? 3 : 2, dom: ["health", "career", "wealth"],
        title: T(`शनि साढ़ेसाती — ${phaseHi} चरण चल रहा है`, `Shani Sade-Sati — ${phaseEn} phase running`),
        basis: T(`गोचर शनि ${rName(tr.satNow)} में, ${h === 1 ? `ठीक आपकी जन्म-राशि ${rName(m.moonR)} के ऊपर` : `आपकी जन्म-राशि ${rName(m.moonR)} से ${HOUSE_ORD_HI[h]} स्थान पर`} • पूरी अवधि लगभग ${fmtMY(ss.current.start)} – ${fmtMY(ss.current.end)}`,
          `Transit Saturn in ${rName(tr.satNow)}, ${ordEn(h)} from your Moon sign ${rName(m.moonR)} • whole span approx. ${fmtMY(ss.current.start)} – ${fmtMY(ss.current.end)}`),
        effect: T(effHi, effEn)
      });
    } else if (moonOK && ss.next && ss.next.start - Date.now() < 4 * YEAR_MS) {
      add({
        key: "SADESATI_NEXT", sev: 1, dom: ["health"],
        title: T("आगामी शनि साढ़ेसाती", "Upcoming Shani Sade-Sati"),
        basis: T(`लगभग ${fmtMY(ss.next.start)} से ${fmtMY(ss.next.end)} तक`, `Approx. ${fmtMY(ss.next.start)} to ${fmtMY(ss.next.end)}`),
        effect: T("अभी से तैयारी व उपाय आरंभ करने पर प्रभाव बहुत हल्का रहता है।", "Starting preparation and remedies early keeps the impact light.")
      });
    }
    if (moonOK && tr.satFromMoon === 4 && tr.dhaiya4.current) {
      add({
        key: "DHAIYA4", sev: 2, dom: ["health", "wealth"],
        title: T("शनि की चतुर्थ ढैय्या (कंटक शनि) सक्रिय", "Shani Dhaiya (4th, Kantaka) active"),
        basis: T(`गोचर शनि जन्म-राशि से चतुर्थ • लगभग ${fmtMY(tr.dhaiya4.current.end)} तक`, `Transit Saturn 4th from Moon • until approx. ${fmtMY(tr.dhaiya4.current.end)}`),
        effect: T("घर, माता, वाहन और मानसिक शांति पर दबाव; संपत्ति के निर्णय सावधानी से।", "Pressure on home, mother, vehicles and peace of mind; be careful with property decisions.")
      });
    }
    if (moonOK && tr.satFromMoon === 8 && tr.dhaiya8.current) {
      add({
        key: "DHAIYA8", sev: 3, dom: ["health", "career"],
        title: T("शनि की अष्टम ढैय्या सक्रिय", "Ashtama Shani Dhaiya active"),
        basis: T(`गोचर शनि जन्म-राशि से अष्टम • लगभग ${fmtMY(tr.dhaiya8.current.end)} तक`, `Transit Saturn 8th from Moon • until approx. ${fmtMY(tr.dhaiya8.current.end)}`),
        effect: T("अचानक बाधाएँ, स्वास्थ्य व गुप्त चिंताएँ; जोखिम भरे निर्णय टालें।", "Sudden obstacles, health and hidden worries; avoid risky decisions.")
      });
    }
    if (full && tr.satFromAsc === 8) {
      add({
        key: "ASHTAMA_LAGNA", sev: 2, dom: ["career", "health"],
        title: T("गोचर शनि लग्न से अष्टम भाव में", "Transit Saturn in the 8th from Ascendant"),
        basis: T(`शनि ${rName(tr.satNow)} में, आपके ${rName(m.ascR)} लग्न से अष्टम`, `Saturn in ${rName(tr.satNow)}, 8th from your ${rName(m.ascR)} ascendant`),
        effect: T("करियर में धीमी प्रगति या अचानक परिवर्तन, स्वास्थ्य में सावधानी; नियमित दिनचर्या रखें।", "Slow career progress or sudden change; take care of health and keep a regular routine.")
      });
    }

    // 2. Running Antardasha
    if (m.dasha && m.dasha.ad) {
      const ad = m.dasha.ad.lord, md = m.dasha.ad.mdLord || (m.dasha.md && m.dasha.md.lord);
      const h = m.house(ad);
      const rel = md && md !== ad ? houseFrom(m.sg(md), m.sg(ad)) : 1;
      const badH = [6, 8, 12].includes(h), badRel = [6, 8, 12].includes(rel);
      if (badH || badRel) {
        add({
          key: "AD_SENSITIVE", sev: badH && badRel ? 3 : 2, dom: ["career", "health", "wealth"],
          title: T(`वर्तमान ${PL_HI[md]}–${PL_HI[ad]} दशा संवेदनशील`, `Running ${PL_EN[md]}–${PL_EN[ad]} period is sensitive`),
          basis: T(`अंतर्दशानाथ ${PL_HI[ad]} ${bh(h)} में${badRel ? `, महादशानाथ से ${HOUSE_ORD_HI[rel]} स्थान पर` : ""} • ${fmtMY(ms(m.dasha.ad.start))} – ${fmtMY(ms(m.dasha.ad.end))}`,
            `Sub-period lord ${PL_EN[ad]} in the ${ordEn(h)} house${badRel ? `, ${ordEn(rel)} from the main-period lord` : ""} • ${fmtMY(ms(m.dasha.ad.start))} – ${fmtMY(ms(m.dasha.ad.end))}`),
          effect: T(`${houseTheme(h)} से जुड़े विषयों में उतार-चढ़ाव, निर्णयों में भ्रम या देरी संभव। इस अवधि के ग्रह-विशेष उपाय लाभकारी।`,
            `Ups and downs around ${houseTheme(h)}; confusion or delay in decisions possible. Planet-specific remedies help in this period.`)
        });
      }
    }

    // 3. Manglik
    if (full && m.findings && m.findings.manglik && typeof m.findings.manglik.marsFromLagna === "number") {
      const mg = m.findings.manglik;
      const mH = [1, 2, 4, 7, 8, 12];
      const fromL = mH.includes(mg.marsFromLagna), fromM = mH.includes(mg.marsFromMoon);
      if (fromL || fromM) {
        const where = [fromL ? T(`लग्न से ${HOUSE_ORD_HI[mg.marsFromLagna]}`, `${ordEn(mg.marsFromLagna)} from Lagna`) : null,
          fromM ? T(`चंद्र से ${HOUSE_ORD_HI[mg.marsFromMoon]}`, `${ordEn(mg.marsFromMoon)} from Moon`) : null].filter(Boolean).join(", ");
        const reason = mg.isCancelled ? T((mg.reasonsHi || [])[0] || "", (mg.reasonsEn || [])[0] || "") : "";
        add({
          key: "MANGLIK", sev: mg.isCancelled ? 1 : 3, dom: ["marriage"],
          title: mg.isCancelled ? T("मांगलिक योग (शास्त्रीय परिहार सहित)", "Manglik yoga (with classical cancellation)") : T("मांगलिक दोष सक्रिय", "Manglik Dosha active"),
          basis: T(`मंगल ${rName(m.sg("Mars"))} में — ${where}`, `Mars in ${rName(m.sg("Mars"))} — ${where}`),
          effect: mg.isCancelled
            ? T(`परिहार उपलब्ध${reason ? ` (${reason})` : ""}; फिर भी विवाह से पूर्व कुंडली-मिलान और मंगल-संतुलन देखना आवश्यक।`, `Cancellation applies${reason ? ` (${reason})` : ""}; still, matching and Mars balance must be checked before marriage.`)
            : T("विवाह में विलंब या मतभेद की संभावना; मांगलिक मिलान और उपाय अनिवार्य।", "Possible delay or friction in marriage; Manglik matching and remedies are essential.")
        });
      }
    }

    // 4. Kalsarpa
    const rl = lonOf(chart.Rahu);
    const inArc = (lon) => { const d = norm360(lon - rl); return d > 0 && d < 180; };
    const lons = PLANETS7.map((k) => lonOf(chart[k]));
    if (lons.every(inArc) || lons.every((l) => !inArc(l))) {
      add({
        key: "KALSARPA", sev: 2, dom: ["career", "health"],
        title: T("कालसर्प योग", "Kalsarpa Yoga"),
        basis: T(`सातों ग्रह राहु (${rName(m.sg("Rahu"))}) – केतु (${rName(m.sg("Ketu"))}) अक्ष के एक ओर`, `All seven planets on one side of the Rahu (${rName(m.sg("Rahu"))}) – Ketu (${rName(m.sg("Ketu"))}) axis`),
        effect: T("प्रयासों का फल रुक-रुक कर; अचानक उतार-चढ़ाव। प्रकार व शांति-विधि पूर्ण कुंडली में।", "Results come in fits and starts with sudden swings. Type and pacification in the full kundali.")
      });
    }

    // 5. Kemadruma (uncancelled)
    if (((m.findings && m.findings.allYogas) || []).some((y) => y.id === "KEMADRUMA_DOSHA")) {
      add({
        key: "KEMADRUMA", sev: 2, dom: ["health", "wealth"],
        title: T("केमद्रुम दोष", "Kemadruma Dosha"),
        basis: T("चंद्र से द्वितीय-द्वादश रिक्त और केंद्र में भी सहायक ग्रह नहीं", "No planets 2nd/12th from the Moon and no kendra support"),
        effect: T("भावनात्मक एकाकीपन, आर्थिक अस्थिरता की अनुभूति; चंद्र-बल के उपाय आवश्यक।", "Feelings of isolation and financial insecurity; Moon-strengthening remedies needed.")
      });
    }

    // 6. Conjunction doshas
    const conj = (a, b) => m.sg(a) === m.sg(b);
    const CJ = [
      ["GRAHAN_MOON", ["Moon", ["Rahu", "Ketu"]], "ग्रहण दोष (चंद्र-राहु/केतु)", "Grahan Dosha (Moon with node)", "मन में भ्रम, चिंता और निर्णय में अस्थिरता।", "Confusion, anxiety and unstable decisions.", ["health"]],
      ["GRAHAN_SUN", ["Sun", ["Rahu", "Ketu"]], "ग्रहण/पितृ दोष संकेत (सूर्य-राहु/केतु)", "Grahan/Pitru indication (Sun with node)", "पिता, सरकारी कार्य और आत्मविश्वास में बाधाएँ।", "Obstacles with father, government work and self-confidence.", ["career"]],
      ["GURU_CHANDAL", ["Jupiter", ["Rahu"]], "गुरु-चांडाल योग", "Guru-Chandal Yoga", "शिक्षा, मार्गदर्शन व नैतिक निर्णयों में भ्रम।", "Confusion in education, guidance and ethical choices.", ["education"]],
      ["ANGARAK", ["Mars", ["Rahu"]], "अंगारक योग", "Angarak Yoga", "क्रोध, जल्दबाज़ी, दुर्घटना या विवाद से सावधानी।", "Caution with anger, haste, accidents and disputes.", ["health"]],
      ["VISH", ["Moon", ["Saturn"]], "विष योग (चंद्र-शनि)", "Vish Yoga (Moon-Saturn)", "उदासी, मानसिक भारीपन और अकेलेपन की अनुभूति।", "Low mood, mental heaviness and loneliness.", ["health"]],
      ["SHRAPIT", ["Saturn", ["Rahu"]], "श्रापित योग (शनि-राहु)", "Shrapit Yoga (Saturn-Rahu)", "बार-बार की रुकावटें; धैर्य से सफलता।", "Repeated obstacles; success through patience.", ["career"]]
    ];
    CJ.forEach(([key, [a, list], tHi, tEn, eHi, eEn, dom]) => {
      if (!moonOK && a === "Moon") return;
      const hit = list.find((b) => conj(a, b));
      if (hit) {
        add({
          key, sev: 2, dom,
          title: T(tHi, tEn),
          basis: T(`${PL_HI[a]} व ${PL_HI[hit]} ${rName(m.sg(a))} में साथ${full ? ` (${bh(m.house(a))})` : ""}`, `${PL_EN[a]} and ${PL_EN[hit]} together in ${rName(m.sg(a))}${full ? ` (${ordEn(m.house(a))} house)` : ""}`),
          effect: T(eHi, eEn)
        });
      }
    });

    if (full) {
      // 7. Moon in dusthana
      const mh = m.house("Moon");
      if ([6, 8, 12].includes(mh)) {
        add({
          key: "MOON_DUSTHANA", sev: 2, dom: ["health"],
          title: T(`चंद्रमा ${bh(mh)} में — मानसिक संवेदनशीलता`, `Moon in the ${ordEn(mh)} house — emotional sensitivity`),
          basis: T(`मन का कारक चंद्र ${rName(m.moonR)} में, ${bh(mh)} (दुःस्थान) में`, `Moon, karaka of the mind, in ${rName(m.moonR)} in the ${ordEn(mh)} (a dusthana)`),
          effect: T("अधिक सोचना, नींद व मन की अशांति, माता के स्वास्थ्य पर ध्यान; चंद्र-शांति के उपाय उपयोगी।", "Overthinking, disturbed sleep, care for mother's health; Moon-pacifying remedies help.")
        });
      }

      // 8. Key house lords in dusthana (unless in own sign there)
      [[1, 2, ["health"]], [7, 2, ["marriage"]], [10, 2, ["career"]], [5, 1, ["education"]], [9, 1, ["wealth"]], [2, 1, ["wealth"]], [4, 1, ["wealth"]]].forEach(([hNum, sev, dom]) => {
        const k = m.lordOf(hNum), h = m.house(k);
        if ([6, 8, 12].includes(h) && !isStrongSign(k, m.sg(k))) {
          add({
            key: `LORD_${hNum}`, sev, dom,
            title: T(`${LORD_NAME_HI[hNum]} ${PL_HI[k]} ${bh(h)} में`, `${ordEn(hNum)} lord ${PL_EN[k]} in the ${ordEn(h)} house`),
            basis: T(`${houseTheme(hNum)} का स्वामी दुःस्थान में`, `Lord of ${houseTheme(hNum)} placed in a dusthana`),
            effect: T(`${houseTheme(hNum)} के फल संघर्ष, विलंब या उतार-चढ़ाव के बाद मिलते हैं।`, `Results of ${houseTheme(hNum)} come after struggle, delay or fluctuation.`)
          });
        }
      });

      // 9. 7th-house occupation by separative planets
      const occ7 = m.occupants(7).filter((k) => ["Saturn", "Rahu", "Ketu", "Sun"].includes(k));
      if (occ7.length) {
        add({
          key: "SEVENTH_OCC", sev: 2, dom: ["marriage"],
          title: T(`सप्तम भाव में ${occ7.map((k) => PL_HI[k]).join(", ")}`, `${occ7.map((k) => PL_EN[k]).join(", ")} in the 7th house`),
          basis: T(`विवाह भाव (${rName(rashiOfHouse(m.ascR, 7))}) में पृथकतावादी ग्रह`, `Separative planet(s) in the marriage house (${rName(rashiOfHouse(m.ascR, 7))})`),
          effect: T("विवाह में विलंब या जीवनसाथी से वैचारिक मतभेद की संभावना; मिलान व उपाय आवश्यक।", "Possible delay in marriage or differences with the spouse; matching and remedies advised.")
        });
      }
    }

    // 10. Debilitated / combust planets
    PLANETS7.forEach((k) => {
      const nb = ((m.findings && m.findings.allYogas) || []).some((y) => y.id === `NEECHABHANGA_${k}`);
      if (isDebil(k, m.sg(k)) && !nb) {
        add({
          key: `DEBIL_${k}`, sev: 2, dom: ["health"],
          title: T(`${PL_HI[k]} नीच राशि (${rName(m.sg(k))}) में`, `${PL_EN[k]} debilitated in ${rName(m.sg(k))}`),
          basis: T(`${PL_HI[k]} अपनी नीच राशि में${full ? `, ${bh(m.house(k))}` : ""}`, `${PL_EN[k]} in its fall${full ? `, ${ordEn(m.house(k))} house` : ""}`),
          effect: T(`${full ? m.owned(k).map(houseTheme).join(" तथा ") : "इस ग्रह के कारक-विषयों"} में कमज़ोरी; ग्रह-बल बढ़ाने के उपाय आवश्यक।`, `Weakness in ${full ? m.owned(k).map(houseTheme).join(" and ") : "this planet's significations"}; strengthening remedies needed.`)
        });
      }
      if (k !== "Sun" && k !== "Moon" && chart[k] && chart[k].combust) {
        add({
          key: `COMBUST_${k}`, sev: 1, dom: [],
          title: T(`${PL_HI[k]} अस्त (सूर्य के अत्यंत निकट)`, `${PL_EN[k]} combust (too close to the Sun)`),
          basis: T(`सूर्य से दूरी केवल ${chart[k].combustDistance || chart[k].distanceFromSun || "—"}°`, `Only ${chart[k].combustDistance || chart[k].distanceFromSun || "—"}° from the Sun`),
          effect: T("इस ग्रह के फल पूरे नहीं मिलते; दशा में विशेष ध्यान।", "This planet's results are subdued; extra care in its periods.")
        });
      }
    });

    // 11. Weakest Ashtakavarga house
    if (m.sav) {
      const arr = Object.keys(m.sav).map((h) => ({ h: Number(h), b: m.sav[h] })).sort((a, b) => a.b - b.b);
      const w = arr[0];
      if (w && w.b <= 24) {
        const domMap = { 1: "health", 2: "wealth", 4: "wealth", 5: "education", 6: "health", 7: "marriage", 8: "health", 10: "career", 11: "wealth", 12: "wealth" };
        add({
          key: "LOW_SAV", sev: w.b <= 22 ? 2 : 1, dom: [domMap[w.h] || "wealth"],
          title: T(`सबसे कमज़ोर भाव: ${bh(w.h)} (${w.b} बिंदु)`, `Weakest house: ${ordEn(w.h)} (${w.b} bindus)`),
          basis: T(`सर्वाष्टकवर्ग में ${bh(w.h)} को केवल ${w.b} बिंदु (औसत 28)`, `Only ${w.b} Sarvashtakavarga bindus in the ${ordEn(w.h)} (average 28)`),
          effect: T(`${houseTheme(w.h)} में अतिरिक्त प्रयास अपेक्षित; इस भाव पर शनि/राहु के गोचर में सावधानी।`, `${houseTheme(w.h)} need extra effort; be careful when Saturn/Rahu transit this house.`)
        });
      }
    }

    if (!full && m.num) addNumerologyCons(m, add);

    return out.sort((a, b) => b.sev - a.sev);
  }

  // ==========================================================================
  // 7. LIFE-AREA SNAPSHOT (FULL MODE)
  // ==========================================================================
  function buildLifeAreas(m) {
    const sav = m.sav || {};
    const placeScore = (h) => ([1, 4, 5, 7, 9, 10, 11].includes(h) ? 1 : ([6, 8, 12].includes(h) ? -1 : 0));
    const savScore = (h) => (sav[h] >= 30 ? 1 : (sav[h] <= 24 ? -1 : 0));
    const hasYoga = (id) => m.yogas.some((y) => y.id === id || y.id.startsWith(id));
    const malOn = (h) => {
      const target = rashiOfHouse(m.ascR, h);
      return ["Saturn", "Mars", "Rahu", "Ketu"].filter((k) => k !== m.lordOf(h) &&
        (m.house(k) === h || (["Saturn", "Mars"].includes(k) && aspectsSign(k, m.sg(k), target))));
    };
    const chipOf = (s) => (s >= 2 ? "good" : (s <= -1 ? "caution" : "mixed"));
    const cautionFor = (dom) => { const c = m.cons.find((x) => (x.dom || []).includes(dom)); return c ? c.title : null; };
    const savTxt = (h) => (sav[h] != null ? T(` (अष्टकवर्ग: ${sav[h]} बिंदु)`, ` (ashtakavarga: ${sav[h]} bindus)`) : "");

    const areas = [];

    // Education
    {
      const l = m.lordOf(5), h = m.house(l), mal = malOn(5);
      const s = placeScore(h) + savScore(5) + (hasYoga("SARASWATI") ? 1 : 0) - (mal.length ? 1 : 0) - (isDebil(l, m.sg(l)) ? 1 : 0);
      const fieldsHi = uniq([l, m.amk].filter(Boolean)).map((k) => FIELD_HI[k]).join("; ");
      const fieldsEn = uniq([l, m.amk].filter(Boolean)).map((k) => FIELD_EN[k]).join("; ");
      areas.push({
        key: "education", icon: "🎓", title: T("शिक्षा एवं बुद्धि", "Education & Intellect"), tone: chipOf(s),
        lines: [
          T(`पंचमेश ${PL_HI[l]} ${bh(h)} में — विद्या का संबंध ${houseTheme(h)} से${savTxt(5)}।`, `5th lord ${PL_EN[l]} in the ${ordEn(h)} — learning connects with ${houseTheme(h)}${savTxt(5)}.`),
          hasYoga("SARASWATI") ? T("सरस्वती योग — तीव्र बुद्धि, स्मरण-शक्ति व अभिव्यक्ति।", "Saraswati Yoga — sharp intellect, memory and expression.")
            : (mal.length ? T(`पंचम पर ${mal.map((k) => PL_HI[k]).join(", ")} का प्रभाव — सफलता परिश्रम व धैर्य से, बीच में रुकावट संभव।`, `${mal.map((k) => PL_EN[k]).join(", ")} influence the 5th — success through persistence; interruptions possible.`)
              : T("अध्ययन में स्वाभाविक रुचि और प्रगति के योग।", "Natural interest and progress in studies.")),
          T(`अनुकूल क्षेत्र: ${fieldsHi}`, `Suitable fields: ${fieldsEn}`)
        ],
        caution: cautionFor("education") || (mal.length && hasYoga("SARASWATI") ? T(`पंचम पर ${mal.map((k) => PL_HI[k]).join(", ")} की दृष्टि — एकाग्रता हेतु अनुशासन आवश्यक`, `${mal.map((k) => PL_EN[k]).join(", ")} aspect the 5th — discipline needed for focus`) : null),
        lock: T("प्रतियोगी परीक्षा/प्रवेश के सबसे प्रबल वर्ष और विषय-चयन", "Strongest exam/admission years & stream choice")
      });
    }

    // Career
    {
      const l = m.lordOf(10), h = m.house(l), tenthSign = rashiOfHouse(m.ascR, 10);
      const yk = (m.matrix.yogakaraka || []).filter((k) => k !== l && aspectsSign(k, m.sg(k), tenthSign));
      const s = placeScore(h) + savScore(10) + (yk.length ? 1 : 0) - (isDebil(l, m.sg(l)) ? 1 : 0);
      const business = sav[6] != null && ((sav[7] + sav[11]) / 2) > sav[6];
      areas.push({
        key: "career", icon: "💼", title: T("करियर एवं कर्म", "Career & Profession"), tone: chipOf(s),
        lines: [
          T(`दशमेश ${PL_HI[l]} ${bh(h)} में — कर्मक्षेत्र ${houseTheme(h)} से जुड़ता है${savTxt(10)}।`, `10th lord ${PL_EN[l]} in the ${ordEn(h)} — career links with ${houseTheme(h)}${savTxt(10)}.`),
          yk.length ? T(`योगकारक ${yk.map((k) => PL_HI[k]).join(", ")} की दशम पर दृष्टि — पद व अधिकार की संभावना प्रबल।`, `Yogakaraka ${yk.map((k) => PL_EN[k]).join(", ")} aspects the 10th — strong potential for position and authority.`)
            : T(`${business ? "स्वतंत्र कार्य/परामर्श" : "नौकरी/संस्थागत पद"} की ओर झुकाव अधिक।`, `Greater tilt towards ${business ? "independent work/consulting" : "employment/institutional roles"}.`),
          T(`अनुकूल क्षेत्र: ${uniq([l, m.amk].filter(Boolean)).map((k) => FIELD_HI[k]).join("; ")}`, `Suitable fields: ${uniq([l, m.amk].filter(Boolean)).map((k) => FIELD_EN[k]).join("; ")}`)
        ],
        caution: cautionFor("career"),
        lock: T("नौकरी बनाम व्यवसाय निर्णय, पदोन्नति व बदलाव के सटीक वर्ष", "Job vs business decision, promotion & change years")
      });
    }

    // Wealth
    {
      const l2 = m.lordOf(2), l11 = m.lordOf(11), h2 = m.house(l2), h11 = m.house(l11);
      const dhana = m.yogas.some((y) => /^DHANA_|^TRIKONA_|^SUNAPHA|^DURUDHARA/.test(y.id));
      const s = placeScore(h2) + placeScore(h11) + (sav[11] != null && sav[11] > sav[12] ? 1 : -1) + (dhana ? 1 : 0);
      areas.push({
        key: "wealth", icon: "💰", title: T("धन एवं संपत्ति", "Wealth & Assets"), tone: chipOf(s),
        lines: [
          l2 === l11
            ? T(`धनेश व लाभेश दोनों ${PL_HI[l2]}, ${bh(h2)} में — आय व संचय ${houseTheme(h2)} से।`, `${PL_EN[l2]} rules both the 2nd and 11th, placed in the ${ordEn(h2)} — income and savings through ${houseTheme(h2)}.`)
            : T(`धनेश ${PL_HI[l2]} ${bh(h2)} में, लाभेश ${PL_HI[l11]} ${bh(h11)} में।`, `2nd lord ${PL_EN[l2]} in the ${ordEn(h2)}, 11th lord ${PL_EN[l11]} in the ${ordEn(h11)}.`),
          sav[11] != null
            ? (sav[11] > sav[12] ? T(`लाभ भाव (${sav[11]}) व्यय भाव (${sav[12]}) से बलवान — बचत की क्षमता अच्छी।`, `Gains (${sav[11]}) outweigh expenses (${sav[12]}) — good saving capacity.`)
              : T(`व्यय भाव (${sav[12]}) लाभ भाव (${sav[11]}) से बलवान — धन टिकाने के लिए अनुशासन आवश्यक।`, `Expenses (${sav[12]}) outweigh gains (${sav[11]}) — discipline needed to retain money.`))
            : "",
          dhana ? T("कुंडली में धन-योग उपस्थित — सही दशा में बड़ा उछाल संभव।", "Dhana yogas present — a big rise is possible in the right period.") : T("धन स्थिर गति से, निरंतर प्रयास द्वारा।", "Wealth grows steadily through consistent effort.")
        ].filter(Boolean),
        caution: cautionFor("wealth"),
        lock: T("धन-वृद्धि, भूमि-भवन व वाहन के प्रबल वर्ष; निवेश की दिशा", "Peak wealth, property & vehicle years; investment direction")
      });
    }

    // Marriage
    {
      const l = m.lordOf(7), h = m.house(l), occ = m.occupants(7);
      const mg = m.findings && m.findings.manglik;
      const ven = m.sg("Venus");
      const s = placeScore(h) + savScore(7) + (isStrongSign("Venus", ven) ? 1 : 0) - (isDebil("Venus", ven) ? 1 : 0)
        - (occ.some((k) => ["Saturn", "Rahu", "Ketu"].includes(k)) ? 1 : 0) - (mg && mg.isManglik && !mg.isCancelled ? 1 : 0);
      const jupAsp = aspectsSign("Jupiter", m.sg("Jupiter"), rashiOfHouse(m.ascR, 7));
      areas.push({
        key: "marriage", icon: "💍", title: T("विवाह एवं दांपत्य", "Marriage & Partnership"), tone: chipOf(s),
        lines: [
          T(`सप्तमेश ${PL_HI[l]} ${bh(h)} में${occ.length ? `; सप्तम में ${occ.map((k) => PL_HI[k]).join(", ")}` : ""}${savTxt(7)}।`, `7th lord ${PL_EN[l]} in the ${ordEn(h)}${occ.length ? `; ${occ.map((k) => PL_EN[k]).join(", ")} in the 7th` : ""}${savTxt(7)}.`),
          jupAsp ? T("सप्तम पर गुरु की दृष्टि — विवाह को संरक्षण; परिपक्व आयु में अधिक शुभ।", "Jupiter aspects the 7th — protection for marriage; more auspicious at a mature age.")
            : T(`विवाह-कारक शुक्र ${rName(ven)} में — संबंधों की गुणवत्ता इसी से निर्धारित।`, `Venus, karaka of marriage, in ${rName(ven)} — sets the tone of relationships.`),
          m.age < 18 ? T("जातक अभी विवाह-योग्य आयु में नहीं है; यह संकेत भविष्य हेतु है।", "The native is below marriageable age; this is a future indication.") : ""
        ].filter(Boolean),
        caution: cautionFor("marriage"),
        lock: T("विवाह का सबसे प्रबल वर्ष, जीवनसाथी का स्वरूप, गुण-मिलान", "Strongest marriage year, spouse profile, guna matching")
      });
    }

    // Children
    {
      const l = m.lordOf(5), h = m.house(l), jh = m.house("Jupiter");
      const jAsp5 = aspectsSign("Jupiter", m.sg("Jupiter"), rashiOfHouse(m.ascR, 5));
      const s = placeScore(h) + placeScore(jh) + (jAsp5 ? 1 : 0) + savScore(5) - (malOn(5).length ? 1 : 0);
      areas.push({
        key: "children", icon: "👶", title: T("संतान सुख", "Children"), tone: chipOf(s),
        lines: [
          T(`पंचमेश ${PL_HI[l]} ${bh(h)} में, संतान-कारक गुरु ${bh(jh)} में।`, `5th lord ${PL_EN[l]} in the ${ordEn(h)}, Jupiter (karaka) in the ${ordEn(jh)}.`),
          jAsp5 ? T("गुरु की पंचम पर दृष्टि — संतान-सुख का शुभ संकेत।", "Jupiter aspects the 5th — an auspicious sign for children.") : T("संतान योग का सूक्ष्म निर्णय सप्तांश (D7) से होता है।", "Fine judgement of progeny comes from the Saptamsa (D7).")
        ],
        caution: malOn(5).length ? T(`पंचम पर ${malOn(5).map((k) => PL_HI[k]).join(", ")} का प्रभाव — योजना के समय सावधानी`, `${malOn(5).map((k) => PL_EN[k]).join(", ")} influence the 5th — care while planning`) : null,
        lock: T("संतान प्राप्ति का प्रबल समय और सप्तांश (D7) विश्लेषण", "Progeny timing and Saptamsa (D7) analysis")
      });
    }

    // Health
    {
      const l = m.lordOf(1), h = m.house(l), mh = m.house("Moon");
      const s = placeScore(h) + savScore(1) - ([6, 8, 12].includes(mh) ? 1 : 0) - (isDebil(l, m.sg(l)) ? 1 : 0);
      areas.push({
        key: "health", icon: "🌿", title: T("स्वास्थ्य एवं ऊर्जा", "Health & Vitality"), tone: chipOf(s),
        lines: [
          T(`लग्नेश ${PL_HI[l]} ${bh(h)} में${savTxt(1)}।`, `Ascendant lord ${PL_EN[l]} in the ${ordEn(h)}${savTxt(1)}.`),
          [6, 8, 12].includes(mh) ? T("चंद्र दुःस्थान में — नींद, जल-संतुलन व मानसिक तनाव पर ध्यान।", "Moon in a dusthana — mind sleep, hydration and stress.") : T("मन व शरीर का संतुलन सामान्यतः अच्छा।", "Mind-body balance is generally good."),
          T("(सामान्य ज्योतिषीय संकेत — चिकित्सा सलाह नहीं)", "(General astrological indication — not medical advice)")
        ],
        caution: cautionFor("health"),
        lock: T("स्वास्थ्य के संवेदनशील वर्ष व ग्रह-विशेष उपाय", "Sensitive health years & planet-specific remedies")
      });
    }

    return areas;
  }

  // ==========================================================================
  // 8. CHART SVG HELPERS
  // ==========================================================================
  function chandraChartOf(chart) {
    const c = { meta: chart.meta };
    KEYS.forEach((k) => { if (chart[k]) c[k] = { ...chart[k] }; });
    c.Asc = { ...chart.Moon, rashi: sgn(chart.Moon), d1: sgn(chart.Moon), retro: false };
    return c;
  }

  function renderChartSvg(m, chartObj, type, retitleTo, lagnaMark) {
    try {
      const A = window.VedicChartAnalyzer;
      const fn = window.__jtChartStyle === "south" ? A.renderRoyalSouthIndianChart : A.renderRoyalNorthIndianChart;
      let svg = fn(chartObj, { lang: LANG, userName: m.ctx.name || "", chartType: type });
      if (retitleTo) {
        svg = svg.replace(/(ॐ (?:JYOTISH TARK|SOUTH INDIAN) • )[^<]*/, `$1${esc(retitleTo)}`)
          .replace(/जन्म लग्न कुंडली \(D1\)|LAGNA CHART \(D1\)/g, esc(retitleTo));
      }
      if (lagnaMark) svg = svg.replace(/॥ D1 (?:लग्न|ASC) ॥/g, `॥ ${esc(lagnaMark)} ॥`);
      return svg;
    } catch (e) {
      return `<div class="nochart">${T("चार्ट उपलब्ध नहीं", "Chart unavailable")}</div>`;
    }
  }

  // ==========================================================================
  // 9. PAGE RENDERERS
  // ==========================================================================
  function kv(rows) {
    return `<table class="kv">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;
  }

  // ---------- Page 1: Cover ----------
  function pageCover(m) {
    const { ctx, chart, full, samvat, panchang } = m;
    const meta = chart.meta || {};
    const dobMs = Date.UTC(...String(ctx.dob).split("-").map((x, i) => (i === 1 ? Number(x) - 1 : Number(x))));
    const vara = samvat ? T(samvat.vedicVaraHi, (samvat.vedicVaraEn || "").split(" ")[0]) : T(VARA_HI[new Date(dobMs).getUTCDay()], VARA_EN[new Date(dobMs).getUTCDay()]);
    const timeStr = full ? (meta.time || "—") : T("अज्ञात (केवल जन्म-तिथि)", "Unknown (date only)");
    const place = full ? (meta.name || "—") : T("—", "—");
    const coords = (full && typeof meta.lat === "number") ? `${meta.lat.toFixed(2)}°N, ${meta.lng.toFixed(2)}°E` : "—";
    const tz = full ? (meta.tzLabel || "IST +05:30") : "—";
    const ayan = meta.ayanamsa ? `${Number(meta.ayanamsa).toFixed(3)}° (${T("लाहिरी", "Lahiri")})` : T("लाहिरी", "Lahiri");

    const nm = m.num;
    const trio = nm ? [
      [T("मूलांक", "Birth number"), `${nm.mulank} <small>${pName(NUM_PLANET[nm.mulank])}</small>`],
      [T("भाग्यांक", "Destiny number"), `${nm.bhagyank} <small>${pName(NUM_PLANET[nm.bhagyank])}</small>`],
      nm.name ? [T("नामांक", "Name number"), `${nm.name.single} <small>(${nm.name.compound})</small>`]
        : (m.moonReliable ? [T("चंद्र राशि", "Moon sign"), rName(m.moonR)] : [T("वर्ष-अंक", "Personal year"), `${nm.currentPY} <small>${nm.years[0].yr}</small>`])
    ] : [
      [T("लग्न", "Ascendant"), full ? `${rName(m.ascR)} <small>${shortDeg(chart.Asc)}</small>` : T("जन्म समय आवश्यक", "Needs birth time")],
      [T("चंद्र राशि", "Moon sign"), `${rName(m.moonR)} <small>${shortDeg(chart.Moon)}</small>`],
      [T("जन्म नक्षत्र", "Birth star"), `${nName(m.moonNak)} <small>${T("चरण", "Pada")} ${m.moonPada}</small>`]
    ];

    return `
      <div class="cover">
        <div class="inv">॥ श्री गणेशाय नमः ॥</div>
        ${OPT.logoData ? `<img class="clogo" src="${OPT.logoData}" alt="">` : ""}
        <div class="ctitle">${T("जन्म पत्रिका", "Janam Patrika")}</div>
        <div class="csub">${full ? T("वैदिक परिचय कुंडली • पाराशरी पद्धति", "Vedic Introductory Horoscope • Parashari System") : T("जन्म-तिथि आधारित जीवन-मार्गदर्शन • अंक ज्योतिष", "Birth-Date Life Guidance • Ank Jyotish")}</div>
        <div class="orn">❖ ❖ ❖</div>
        <div class="cname">${esc(ctx.name)}</div>
        ${m.syllable && m.moonReliable ? `<div class="cakshar">${T("शास्त्रीय जन्म-नामाक्षर", "Classical birth syllable")}: <b>${esc(m.syllable)}</b></div>` : ""}
        <div class="trio">${trio.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
        ${kv([
          [T("जन्म तिथि", "Date of birth"), `${fmtDMY(dobMs)} • ${vara}`],
          [T("जन्म समय", "Time of birth"), `${esc(timeStr)}${full ? ` <small>(${esc(tz)})</small>` : ""}`],
          ...(full ? [[T("जन्म स्थान", "Place of birth"), `${esc(place)} <small>${coords}</small>`], [T("अयनांश", "Ayanamsa"), ayan]] : [[T("ग्रह-स्वामी", "Ruling planets"), `${pName(NUM_PLANET[nm.mulank])} • ${pName(NUM_PLANET[nm.bhagyank])}`], [T("चालू वर्ष-अंक", "Current personal year"), `${nm.currentPY} — ${T(PY_HI[nm.currentPY][0], PY_EN[nm.currentPY][0])}`]]),
          [T("संवत्", "Samvat"), samvat ? T(`विक्रम ${samvat.vikramSamvat} • शक ${samvat.shakaSamvat}`, `Vikram ${samvat.vikramSamvat} • Shaka ${samvat.shakaSamvat}`) : "—"],
          ...(m.moonReliable ? [[T("तिथि", "Tithi"), panchang ? T(panchang.tithiHi, panchang.tithiEn) : "—"]] : []),
          [T("रिपोर्ट क्रमांक", "Report ID"), `${m.reportId} • ${T("निर्मित", "Generated")} ${fmtDMY(Date.now())}`]
        ])}
        ${nm ? `<div class="csum">${T(`<b>जीवन-सार:</b> मूलांक ${nm.mulank} आपको ${NUMT(nm.mulank, "trait")} देता है, और भाग्यांक ${nm.bhagyank} जीवन को ${NUMT(nm.bhagyank, "trait")} की ओर ले जाता है।`, `<b>Life in brief:</b> Birth number ${nm.mulank} gives you ${NUMT(nm.mulank, "trait")}, and destiny number ${nm.bhagyank} steers life towards ${NUMT(nm.bhagyank, "trait")}.`)}</div>` : ""}
        <div class="cqr">
          ${OPT.qrData ? `<img src="${OPT.qrData}" alt="QR">` : `<div class="qrph">Pay<br>online</div>`}
          <div>
            <b>${T("गुरु-दक्षिणा एवं परामर्श", "Guru-Dakshina & Consultation")}</b>
            <p>${T("यह परिचय कुंडली निःशुल्क है। यदि यह उपयोगी लगी, तो श्रद्धानुसार गुरु-दक्षिणा हेतु QR स्कैन करें। पूर्ण कुंडली व व्यक्तिगत उपाय हेतु WhatsApp करें:", "This introductory kundali is free. If it helped you, scan the QR to offer Guru-Dakshina as you wish. For the full kundali and personal remedies, WhatsApp:")} <b>${esc(OPT.phone)}</b></p>
          </div>
        </div>
        <div class="cby">${T("प्रस्तुतकर्ता", "Prepared by")}: <b>${T(OPT.acharyaHi, OPT.acharyaEn)}</b> • ${T("ज्योतिष तर्क", "Jyotish Tark")} • ${esc(OPT.site)}</div>
      </div>`;
  }

  // ---------- Page 2: Charts & Graha Spashta ----------
  function pageCharts(m) {
    const { chart, full } = m;
    const chandra = renderChartSvg(m, chandraChartOf(chart), "D1", T(`चंद्र कुंडली — ${RASHI_HI[m.moonR]}`, `CHANDRA CHART — ${RASHI_EN[m.moonR]}`), T("चंद्र लग्न", "MOON ASC"));
    const charts = full
      ? `<div class="charts2"><div class="chart">${renderChartSvg(m, chart, "D1")}</div><div class="chart">${chandra}</div></div>`
      : `<div class="charts1"><div class="chart">${chandra}</div></div>`;

    const rows = KEYS.filter((k) => full || k !== "Asc").map((k) => {
      const p = chart[k] || {};
      const nak = nakOf(p);
      const dig = k === "Asc" ? (p.d9 === sgn(p) ? T("वर्गोत्तम", "Vargottama") : "—") : (p.dignityInfo ? T(p.dignityInfo.hi, p.dignityInfo.en.split(" (")[0]) : "—");
      const flags = [p.retro && !["Rahu", "Ketu", "Asc"].includes(k) ? T("वक्री", "R") : "", p.combust ? T("अस्त", "C") : "", k !== "Asc" && p.d9 && p.d9 === sgn(p) ? "★" : ""].filter(Boolean).join(" ");
      const hNum = full ? (k === "Asc" ? 1 : m.house(k)) : houseFrom(m.moonR, sgn(p));
      return `<tr><td class="b">${pName(k)}${flags ? ` <span class="flag">${flags}</span>` : ""}</td><td>${rName(sgn(p))}</td><td class="mono">${shortDeg(p)}</td><td>${nName(nak)} (${p.pada || 1})</td><td class="c">${hNum}</td><td>${p.d9 ? rName(p.d9) : "—"}</td><td>${dig}</td></tr>`;
    }).join("");

    return `
      ${charts}
      <div class="h3">${T("ग्रह स्पष्ट (सायन-निरयण लाहिरी)", "Graha Spashta (sidereal, Lahiri)")}</div>
      <table class="tbl">
        <thead><tr><th>${T("ग्रह", "Planet")}</th><th>${T("राशि", "Sign")}</th><th>${T("अंश", "Degree")}</th><th>${T("नक्षत्र (चरण)", "Nakshatra (pada)")}</th><th class="c">${full ? T("भाव", "House") : T("चंद्र से", "From Moon")}</th><th>${T("नवांश", "Navamsa")}</th><th>${T("स्थिति", "Dignity")}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="note">${T("वक्री = उल्टी गति • अस्त = सूर्य के अत्यंत निकट • ★ = वर्गोत्तम (राशि व नवांश समान)", "R = retrograde • C = combust • ★ = vargottama (same sign in D1 and D9)")}${full ? "" : T(" • जन्म समय के बिना भाव चंद्र-राशि से गिने गए हैं।", " • Without birth time, houses are counted from the Moon sign.")}</p>`;
  }

  // ---------- Page 3: Navamsa ----------
  function pageNavamsa(m) {
    const { chart } = m;
    const d9Asc = chart.Asc.d9;
    const varg = PLANETS9.filter((k) => chart[k] && chart[k].d9 === sgn(chart[k]));
    const strong = PLANETS7.filter((k) => chart[k] && isStrongSign(k, chart[k].d9));
    const weak = PLANETS7.filter((k) => chart[k] && isDebil(k, chart[k].d9));
    const venH = houseFrom(d9Asc, chart.Venus.d9);
    const l7 = m.lordOf(7);
    const bullets = [];
    bullets.push(sgn(chart.Asc) === d9Asc
      ? T(`नवांश लग्न भी ${rName(d9Asc)} — लग्न वर्गोत्तम है। जीवन के उत्तरार्ध में भी व्यक्तित्व व स्वास्थ्य दृढ़ रहते हैं।`, `D9 Ascendant is also ${rName(d9Asc)} — a vargottama Lagna; personality and health stay firm in later life.`)
      : T(`नवांश लग्न ${rName(d9Asc)} — विवाह के बाद व आयु के साथ स्वभाव में ${RASHI_LORD[d9Asc] ? PL_HI[RASHI_LORD[d9Asc]] : ""} के गुण बढ़ते हैं।`, `D9 Ascendant ${rName(d9Asc)} — after marriage and with age, ${PL_EN[RASHI_LORD[d9Asc]]}-like qualities grow.`));
    if (varg.length) bullets.push(T(`वर्गोत्तम ग्रह: ${varg.map((k) => PL_HI[k]).join(", ")} — ये ग्रह पूर्ण विश्वसनीय फल देते हैं।`, `Vargottama planets: ${varg.map((k) => PL_EN[k]).join(", ")} — they give dependable results.`));
    if (strong.length) bullets.push(T(`नवांश में बलवान (स्व/उच्च): ${strong.map((k) => `${PL_HI[k]} (${RASHI_HI[chart[k].d9]})`).join(", ")} — इनकी दशा में भीतर से मज़बूत परिणाम।`, `Strong in D9 (own/exalted): ${strong.map((k) => `${PL_EN[k]} (${RASHI_EN[chart[k].d9]})`).join(", ")} — strong inner results in their periods.`));
    bullets.push(T(`विवाह-कारक शुक्र नवांश के ${HOUSE_ORD_HI[venH]} भाव (${rName(chart.Venus.d9)}) में${[1, 4, 5, 7, 9, 10, 11].includes(venH) ? " — दांपत्य सुख का शुभ संकेत" : " — दांपत्य में समझदारी व धैर्य आवश्यक"}।`, `Venus in the ${ordEn(venH)} of D9 (${rName(chart.Venus.d9)})${[1, 4, 5, 7, 9, 10, 11].includes(venH) ? " — a good sign for married life" : " — married life needs understanding and patience"}.`));
    bullets.push(T(`सप्तमेश ${PL_HI[l7]} नवांश में ${rName(chart[l7].d9)} में${isStrongSign(l7, chart[l7].d9) ? " (बलवान)" : (isDebil(l7, chart[l7].d9) ? " (निर्बल)" : "")}।`, `7th lord ${PL_EN[l7]} sits in ${rName(chart[l7].d9)} in D9${isStrongSign(l7, chart[l7].d9) ? " (strong)" : (isDebil(l7, chart[l7].d9) ? " (weak)" : "")}.`));

    return `
      <div class="charts1"><div class="chart">${renderChartSvg(m, chart, "D9")}</div></div>
      <div class="h3">${T("नवांश के मुख्य संकेत", "Key Navamsa indications")}</div>
      <ul class="bul">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      ${weak.length ? `<div class="warnline">⚠ ${T(`नवांश में निर्बल: ${weak.map((k) => `${PL_HI[k]} (${RASHI_HI[chart[k].d9]})`).join(", ")} — इनके फलों हेतु उपाय पूर्ण कुंडली में।`, `Weak in D9: ${weak.map((k) => `${PL_EN[k]} (${RASHI_EN[chart[k].d9]})`).join(", ")} — remedies in the full kundali.`)}</div>` : ""}
      <p class="note">${T("नवांश (D9) विवाह, धर्म और ग्रहों के वास्तविक बल का दर्पण है।", "The Navamsa (D9) mirrors marriage, dharma and the true strength of planets.")}</p>`;
  }

  // ---------- Page 4: Panchang & Gochar ----------
  function pagePanchang(m) {
    const p = m.panchang;
    const tr = m.transit;
    const cells = p ? [
      [T("वार", "Weekday"), m.samvat ? T(m.samvat.vedicVaraHi, (m.samvat.vedicVaraEn || "").split(" ")[0]) : T(p.varaHi, p.varaEn.split(" (")[0])],
      [T("तिथि", "Tithi"), T(p.tithiHi.replace(/\s*\(.*?\)/g, ""), p.tithiEn)],
      [T("नक्षत्र", "Nakshatra"), `${nName(m.moonNak)} (${T("चरण", "Pada")} ${m.moonPada})`],
      [T("योग", "Yoga"), T(p.yogaName.replace(/^.*\(|\)$/g, ""), p.yogaName.split(" (")[0])],
      [T("करण", "Karana"), T(p.karanaName.replace(/^.*\(|\)$/g, ""), p.karanaName.split(" (")[0])],
      [T("नामाक्षर", "Syllable"), esc(m.syllable || "—")],
      [T("गण", "Gana"), T(p.gana.replace(/^.*\(|\)$/g, ""), p.gana.split(" (")[0])],
      [T("योनि", "Yoni"), T(p.yoni.replace(/^.*\(|\)$/g, ""), p.yoni.split(" (")[0])],
      [T("नाड़ी", "Nadi"), T(p.nadi.replace(/^.*\(|\)$/g, "").split(" /")[0], p.nadi.split(" (")[0])],
      [T("वर्ण", "Varna"), T(p.varna.replace(/^.*\(|\)$/g, ""), p.varna.split(" (")[0])],
      [T("राशि स्वामी", "Sign lord"), pName(RASHI_LORD[m.moonR])],
      [T("नक्षत्र देवता", "Star deity"), m.aksh ? T(m.aksh.devataHi.split(" (")[0], m.aksh.devataEn) : "—"]
    ] : [];
    if (m.full && p) cells.splice(5, 0, [T("पाया", "Paya"), T(p.payaHi.split(" (")[0], p.payaEn.split(" (")[0])]);

    const ss = tr.sadeSati;
    let satCard;
    if (ss.current && ss.phases) {
      const ph = ss.phases;
      const seg = (label, from, to, active) => `<div class="seg${active ? " on" : ""}"><b>${label}</b><span>${from ? fmtMY(from) : "—"} → ${to ? fmtMY(to) : "—"}</span></div>`;
      const h = tr.satFromMoon;
      satCard = `
        <div class="card sev3">
          <div class="ct">🪐 ${T("शनि साढ़ेसाती — सक्रिय", "Shani Sade-Sati — ACTIVE")}</div>
          <div class="segs">
            ${seg(T("प्रथम चरण", "Phase 1"), ph.rising, ph.peak, h === 12)}
            ${seg(T("द्वितीय (शिखर)", "Phase 2 (peak)"), ph.peak, ph.setting, h === 1)}
            ${seg(T("तृतीय चरण", "Phase 3"), ph.setting, ph.end, h === 2)}
          </div>
          <p>${T(`गोचर शनि ${rName(tr.satNow)} में, आपकी जन्म-राशि ${rName(m.moonR)} से ${HOUSE_ORD_HI[h]} स्थान पर। तिथियाँ लगभग हैं (वक्री गति से कुछ महीनों का अंतर संभव)।`, `Transit Saturn in ${rName(tr.satNow)}, ${ordEn(h)} from your Moon sign ${rName(m.moonR)}. Dates are approximate (retrograde motion can shift them by a few months).`)}</p>
        </div>`;
    } else {
      const nxt = ss.next;
      const dh = tr.satFromMoon === 4 || tr.satFromMoon === 8;
      satCard = `
        <div class="card ${dh ? "sev2" : "okcard"}">
          <div class="ct">🪐 ${dh ? T(`शनि ढैय्या सक्रिय (चंद्र से ${HOUSE_ORD_HI[tr.satFromMoon]})`, `Shani Dhaiya active (${ordEn(tr.satFromMoon)} from Moon)`) : T("साढ़ेसाती / ढैय्या — वर्तमान में नहीं", "Sade-Sati / Dhaiya — not running now")}</div>
          <p>${T(`गोचर शनि ${rName(tr.satNow)} में (चंद्र से ${HOUSE_ORD_HI[tr.satFromMoon]} स्थान)।`, `Transit Saturn in ${rName(tr.satNow)} (${ordEn(tr.satFromMoon)} from the Moon).`)}
          ${nxt ? T(` अगली साढ़ेसाती लगभग <b>${fmtMY(nxt.start)} – ${fmtMY(nxt.end)}</b>।`, ` Next Sade-Sati approx. <b>${fmtMY(nxt.start)} – ${fmtMY(nxt.end)}</b>.`) : ""}
          ${ss.prev ? T(` पिछली साढ़ेसाती ${fmtMY(ss.prev.start)} – ${fmtMY(ss.prev.end)}।`, ` Previous: ${fmtMY(ss.prev.start)} – ${fmtMY(ss.prev.end)}.`) : ""}</p>
        </div>`;
    }
    const jGood = [2, 5, 7, 9, 11].includes(tr.jupFromMoon);
    const jupCard = `
      <div class="card ${jGood ? "okcard" : "neutral"}">
        <div class="ct">♃ ${T("गुरु गोचर", "Jupiter transit")}</div>
        <p>${T(`गोचर गुरु ${rName(tr.jupNow)} में — चंद्र से ${HOUSE_ORD_HI[tr.jupFromMoon]}${m.full ? `, लग्न से ${HOUSE_ORD_HI[tr.jupFromAsc]}` : ""} स्थान पर। ${jGood ? "यह स्थिति शुभ मानी जाती है — मार्गदर्शन, अवसर व संरक्षण।" : "यह स्थिति सामान्य है — बड़े निर्णयों में सलाह लें।"}`, `Transit Jupiter in ${rName(tr.jupNow)} — ${ordEn(tr.jupFromMoon)} from the Moon${m.full ? `, ${ordEn(tr.jupFromAsc)} from the Ascendant` : ""}. ${jGood ? "Considered favourable — guidance, opportunity and protection." : "A neutral placement — seek advice before big decisions."}`)}</p>
      </div>`;

    return `
      <div class="h3">${T("पंचांग एवं अवकहड़ा चक्र (जन्म के समय)", "Panchang & Avakahada (at birth)")}</div>
      <div class="grid4">${cells.map(([k, v]) => `<div class="cell"><span>${k}</span><b>${v}</b></div>`).join("")}</div>
      <div class="h3">${T("वर्तमान गोचर — आज की स्थिति", "Current transits — as of today")} <small>(${fmtDMY(Date.now())})</small></div>
      ${satCard}
      ${jupCard}
      <p class="note">${T("गोचर-विचार जन्म-राशि (चंद्र) से किया गया है। महीने-वार गोचर फल पूर्ण कुंडली में।", "Transits are judged from the natal Moon sign. Month-by-month transit results are in the full kundali.")}</p>`;
  }

  // ---------- Page 5: Personality ----------
  function pagePersonality(m) {
    const { chart, full } = m;
    const paras = [];
    if (full) {
      const vg = chart.Asc.d9 === m.ascR;
      paras.push(`<p><b>${T(`${RASHI_HI[m.ascR]} लग्न${vg ? " (वर्गोत्तम)" : ""}:`, `${RASHI_EN[m.ascR]} Ascendant${vg ? " (Vargottama)" : ""}:`)}</b> ${T(`आप ${LAGNA_TRAIT_HI[m.ascR]}`, `You are ${LAGNA_TRAIT_EN[m.ascR]}`)}${vg ? T(" लग्न का वर्गोत्तम होना व्यक्तित्व को असाधारण दृढ़ता देता है।", " A vargottama Lagna gives the personality unusual firmness.") : ""}</p>`);
      const ll = m.lordOf(1), lh = m.house(ll);
      paras.push(`<p><b>${T(`लग्नेश ${PL_HI[ll]} ${bh(lh)} में:`, `Ascendant lord ${PL_EN[ll]} in the ${ordEn(lh)}:`)}</b> ${T(`जीवन की मुख्य ऊर्जा ${houseTheme(lh)} की ओर बहती है।`, `Your core life-energy flows towards ${houseTheme(lh)}.`)} ${chart[ll] && chart[ll].dignityInfo ? T(`लग्नेश ${chart[ll].dignityInfo.hi} में है।`, `The Ascendant lord is in a ${chart[ll].dignityInfo.en.split(" (")[0].toLowerCase()} sign.`) : ""}</p>`);
      const inL = m.occupants(1);
      if (inL.length) {
        paras.push(`<p><b>${T(`लग्न में ${inL.map((k) => PL_HI[k]).join(", ")}:`, `${inL.map((k) => PL_EN[k]).join(", ")} in the Ascendant:`)}</b> ${inL.map((k) => T(IN_LAGNA_HI[k], IN_LAGNA_EN[k])).join("; ")}।</p>`);
      }
    }
    const mh = full ? m.house("Moon") : null;
    paras.push(`<p><b>${T(`चंद्रमा ${RASHI_HI[m.moonR]} राशि, ${NAK_HI[m.moonNak - 1]} नक्षत्र (चरण ${m.moonPada})${full ? `, ${bh(mh)} में` : ""}:`, `Moon in ${RASHI_EN[m.moonR]}, ${NAK_EN[m.moonNak - 1]} (pada ${m.moonPada})${full ? `, ${ordEn(mh)} house` : ""}:`)}</b> ${T(MOON_TRAIT_HI[m.moonR], MOON_TRAIT_EN[m.moonR])} ${full && [6, 8, 12].includes(mh) ? T(MOON_DUSTHANA_HI[mh], MOON_DUSTHANA_EN[mh]) : ""}</p>`);
    if (!full) {
      paras.push(`<p><b>${T(`सूर्य ${RASHI_HI[m.sunR]} में:`, `Sun in ${RASHI_EN[m.sunR]}:`)}</b> ${T(`आत्मबल और कार्यशैली पर ${PL_HI[RASHI_LORD[m.sunR]]} का प्रभाव।`, `Your will and working style carry the stamp of ${PL_EN[RASHI_LORD[m.sunR]]}.`)}</p>`);
    }
    if (m.ak && AK_LESSON_HI[m.ak]) {
      const kk = chart[m.ak] && chart[m.ak].d9;
      paras.push(`<p><b>${T(`आत्मकारक ${PL_HI[m.ak]}${kk ? ` (कारकांश ${RASHI_HI[kk]})` : ""}:`, `Atmakaraka ${PL_EN[m.ak]}${kk ? ` (Karakamsa ${RASHI_EN[kk]})` : ""}:`)}</b> ${T(`इस जन्म की मुख्य आत्मिक सीख — ${AK_LESSON_HI[m.ak]}।`, `The soul's key lesson in this life — ${AK_LESSON_EN[m.ak]}.`)}</p>`);
    }
    const strength = m.yogas[0];
    const challenge = m.cons[0];
    return `
      ${paras.join("")}
      <div class="two">
        <div class="card okcard"><div class="ct">✦ ${T("आपकी सबसे बड़ी शक्ति", "Your greatest strength")}</div><p><b>${strength ? strength.title : T("संतुलित कुंडली", "A balanced chart")}</b><br>${strength ? strength.desc : ""}</p></div>
        <div class="card sev2"><div class="ct">⚠ ${T("मुख्य चुनौती", "Main challenge")}</div><p><b>${challenge ? challenge.title : T("कोई प्रबल दोष नहीं", "No major affliction")}</b><br>${challenge ? challenge.effect : ""}</p></div>
      </div>
      <div class="lockbox">🔒 ${T("आपके स्वभाव का गहन विश्लेषण (नवांश, आरूढ़ लग्न, नक्षत्र-पद) और करियर-विवाह पर उसका प्रभाव — पूर्ण कुंडली में।", "In-depth temperament analysis (Navamsa, Arudha, nakshatra pada) and its effect on career and marriage — in the full kundali.")}</div>`;
  }

  // ---------- Page 6: Yogas & dignity ----------
  function pageYogas(m) {
    const ys = m.yogas.slice(0, m.full ? 6 : 5);
    const cards = ys.length
      ? ys.map((y) => `<div class="ycard"><b>✦ ${y.title}</b><p>${y.desc}</p></div>`).join("")
      : `<p>${T("विशेष शास्त्रीय योग जन्म-समय से ही पूर्ण रूप से निर्धारित होते हैं।", "Special classical yogas are fully determined only with the birth time.")}</p>`;
    let table = "";
    if (m.full) {
      const rows = PLANETS9.map((k) => {
        const p = m.chart[k];
        const fr = (m.matrix.yogakaraka || []).includes(k) ? T("योगकारक", "Yogakaraka")
          : (m.matrix.benefics || []).includes(k) ? T("शुभ", "Benefic")
          : (m.matrix.malefics || []).includes(k) ? T("अकारक", "Malefic") : T("छाया", "Node");
        const st = isStrongSign(k, sgn(p)) ? "good" : (isDebil(k, sgn(p)) || [6, 8, 12].includes(m.house(k)) ? "caution" : "mixed");
        return `<tr><td class="b">${pName(k)}</td><td>${m.owned(k).map((h) => HOUSE_ORD_HI.length && LANG === "hi" ? HOUSE_ORD_HI[h] : ordEn(h)).join(", ") || "—"}</td><td class="c">${m.house(k)}</td><td>${p.dignityInfo ? T(p.dignityInfo.hi, p.dignityInfo.en.split(" (")[0]) : "—"}</td><td>${fr}</td><td>${toneChip(st)}</td></tr>`;
      }).join("");
      table = `
        <div class="h3">${T(`ग्रहों का कार्यात्मक स्वभाव (${RASHI_HI[m.ascR]} लग्न हेतु)`, `Functional nature of planets (for ${RASHI_EN[m.ascR]} Ascendant)`)}</div>
        <table class="tbl"><thead><tr><th>${T("ग्रह", "Planet")}</th><th>${T("भाव-स्वामित्व", "Lordship")}</th><th class="c">${T("भाव", "House")}</th><th>${T("राशि-बल", "Sign dignity")}</th><th>${T("लग्न हेतु", "For Lagna")}</th><th>${T("स्थिति", "Status")}</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
    return `
      <div class="h3">${T("आपकी कुंडली के प्रमुख शुभ योग", "Key auspicious yogas in your chart")}</div>
      <div class="ygrid">${cards}</div>
      ${table}
      <div class="lockbox">🔒 ${T("ये योग किस दशा में और किस वर्ष फल देंगे — सटीक समय-निर्धारण पूर्ण कुंडली में।", "When these yogas deliver — exact period and year — in the full kundali.")}</div>`;
  }

  // ---------- Page 7: Dasha ----------
  function pageDasha(m) {
    const d = m.dasha;
    if (!d) return pageUnlock(m);
    const ageAt = (t) => ((t - m.dobMs) / YEAR_MS);
    const ageR = (a, b) => `${Math.floor(ageAt(a))}–${Math.floor(ageAt(b))}`;
    const md = d.md, ad = d.ad;
    const adTone = periodTone(m, ad.lord, md.lord);
    const pdTxt = d.pd ? T(`प्रत्यंतर: ${PL_HI[d.pd.lord]} (${fmtDMY(ms(d.pd.start))} – ${fmtDMY(ms(d.pd.end))})`, `Pratyantar: ${PL_EN[d.pd.lord]} (${fmtDMY(ms(d.pd.start))} – ${fmtDMY(ms(d.pd.end))})`) : "";

    const nextRows = d.next.map((n) => {
      const tone = periodTone(m, n.lord, n.mdLord);
      return `<tr><td class="b">${PL_HI[n.mdLord] && LANG === "hi" ? `${PL_HI[n.mdLord]}–${PL_HI[n.lord]}` : `${PL_EN[n.mdLord]}–${PL_EN[n.lord]}`}</td><td class="mono">${fmtMY(ms(n.start))} – ${fmtMY(ms(n.end))}</td><td class="c">${ageR(ms(n.start), ms(n.end))}</td><td>${periodThemes(m, n.lord)}</td><td>${toneChip(tone)}</td></tr>`;
    }).join("");

    const prev = d.prev;
    const verify = prev ? `
      <div class="card verify">
        <div class="ct">🔍 ${T("अपनी कुंडली की सटीकता जाँचें", "Verify your chart's accuracy")}</div>
        <p>${T(`${fmtMY(ms(prev.start))} से ${fmtMY(ms(prev.end))} के बीच (${PL_HI[prev.mdLord]}–${PL_HI[prev.lord]} दशा) क्या <b>${periodThemes(m, prev.lord)}</b> से जुड़ी कोई महत्वपूर्ण घटना हुई थी? यदि हाँ, तो आपका जन्म-समय सही है। यदि नहीं, तो जन्म-समय शोधन (rectification) आवश्यक हो सकता है — WhatsApp पर बताएँ।`,
          `Between ${fmtMY(ms(prev.start))} and ${fmtMY(ms(prev.end))} (${PL_EN[prev.mdLord]}–${PL_EN[prev.lord]} period), did something important happen around <b>${periodThemes(m, prev.lord)}</b>? If yes, your birth time is right. If not, birth-time rectification may be needed — tell us on WhatsApp.`)}</p>
      </div>` : "";

    return `
      <div class="two">
        <div class="card neutral">
          <div class="ct">${T("महादशा", "Mahadasha")}: ${pName(md.lord)} ${toneChip(periodTone(m, md.lord, null))}</div>
          <p class="mono">${fmtDMY(ms(md.start))} – ${fmtDMY(ms(md.end))} • ${T("आयु", "Age")} ${ageR(ms(md.start), ms(md.end))}</p>
          <p>${T(`${pName(md.lord)} (${lordshipLabel(m, md.lord)}, ${bh(m.house(md.lord))} में) — यह पूरी दशा ${periodThemes(m, md.lord)} के विषयों को आगे लाती है।`, `${pName(md.lord)} (${lordshipLabel(m, md.lord)}, in the ${ordEn(m.house(md.lord))}) — this whole period brings ${periodThemes(m, md.lord)} to the fore.`)}</p>
        </div>
        <div class="card ${adTone === "caution" ? "sev2" : (adTone === "good" ? "okcard" : "neutral")}">
          <div class="ct">${T("अंतर्दशा (अभी)", "Antardasha (now)")}: ${pName(ad.lord)} ${toneChip(adTone)}</div>
          <p class="mono">${fmtDMY(ms(ad.start))} – ${fmtDMY(ms(ad.end))}</p>
          <p>${T(`${pName(ad.lord)} (${lordshipLabel(m, ad.lord)}, ${bh(m.house(ad.lord))} में), महादशानाथ से ${HOUSE_ORD_HI[houseFrom(m.sg(md.lord), m.sg(ad.lord))]} स्थान पर।`, `${pName(ad.lord)} (${lordshipLabel(m, ad.lord)}, in the ${ordEn(m.house(ad.lord))}), ${ordEn(houseFrom(m.sg(md.lord), m.sg(ad.lord)))} from the Mahadasha lord.`)} ${adTone === "caution" ? T("इस अवधि में धैर्य, स्वास्थ्य और निर्णयों में विशेष सावधानी रखें।", "Exercise patience and care with health and decisions in this period.") : (adTone === "good" ? T("उन्नति और अवसरों का समय।", "A time of growth and opportunity.") : T("मिश्रित परिणाम — प्रयास के अनुपात में फल।", "Mixed results — returns in proportion to effort."))}</p>
          ${pdTxt ? `<p class="small">${pdTxt}</p>` : ""}
        </div>
      </div>
      <div class="h3">${T("आगामी अंतर्दशाएँ — अगले लगभग 5–8 वर्ष", "Upcoming sub-periods — next ~5–8 years")}</div>
      <table class="tbl"><thead><tr><th>${T("दशा", "Period")}</th><th>${T("अवधि", "Dates")}</th><th class="c">${T("आयु", "Age")}</th><th>${T("सक्रिय विषय", "Active themes")}</th><th>${T("स्वभाव", "Tone")}</th></tr></thead><tbody>${nextRows}</tbody></table>
      ${verify}
      <div class="lockbox">🔒 ${T("120 वर्षीय दशा-अंतर्दशा-प्रत्यंतर फल, हर अवधि के शुभ/अशुभ महीने और विशेष उपाय — पूर्ण कुंडली में।", "120-year dasha–antardasha–pratyantar results, good/bad months in each period and specific remedies — in the full kundali.")}</div>`;
  }

  // ---------- Page 7 (DOB-only): unlock ----------
  function pageUnlock(m) {
    const ruler = NAK_EN.length ? ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"][(m.moonNak - 1) % 9] : "Sun";
    const items = T(
      ["उदय लग्न व 12 भावों का विश्लेषण", "नवांश (D9), दशमांश (D10), सप्तांश (D7)", "विंशोत्तरी महादशा-अंतर्दशा की सटीक तिथियाँ", "मांगलिक दोष (लग्न से) का निर्णय", "विवाह, करियर व संतान के संभावित वर्ष", "राजयोग, धनयोग व विपरीत राजयोग"],
      ["Rising sign and all 12 houses", "Navamsa (D9), Dasamsa (D10), Saptamsa (D7)", "Exact Vimshottari dasha dates", "Manglik dosha from the Ascendant", "Probable years for marriage, career, children", "Raja, Dhana and Viparita Raja yogas"]);
    return `
      <div class="card neutral"><div class="ct">⏳ ${T("जन्म-दशा", "Birth dasha")}</div>
        <p>${T(`जन्म-नक्षत्र ${NAK_HI[m.moonNak - 1]} के अनुसार जन्म के समय <b>${PL_HI[ruler]}</b> की महादशा चल रही थी। वर्तमान दशा की सटीक तिथियाँ जन्म-समय (घंटा-मिनट) से ही निकलती हैं।`, `By birth star ${NAK_EN[m.moonNak - 1]}, the <b>${PL_EN[ruler]}</b> Mahadasha was running at birth. Exact current dasha dates need the birth time (hour and minute).`)}</p></div>
      <div class="h3">${T("जन्म-समय जोड़ने पर क्या खुलेगा", "What unlocks when you add the birth time")}</div>
      <ul class="bul">${items.map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="card verify"><div class="ct">📞 ${T("जन्म-समय नहीं पता?", "Don't know your birth time?")}</div>
        <p>${T("जीवन की 3–4 प्रमुख घटनाओं की तिथियों से आचार्य जी जन्म-समय शोधन (rectification) करते हैं। WhatsApp करें:", "Acharya ji can rectify the birth time from the dates of 3–4 major life events. WhatsApp:")} <b>${esc(OPT.phone)}</b></p></div>`;
  }

  // ---------- Page 8: Life areas ----------
  function pageAreas(m) {
    return `
      <div class="agrid">
        ${m.areas.map((a) => `
          <div class="acard">
            <div class="ah"><span>${a.icon} ${a.title}</span>${toneChip(a.tone)}</div>
            ${a.lines.map((l) => `<p>${l}</p>`).join("")}
            ${a.caution ? `<p class="acaut">⚠ ${a.caution}</p>` : ""}
            <p class="alock">🔒 ${a.lock}</p>
          </div>`).join("")}
      </div>
      <p class="note">${T("यह झलक मुख्य भाव-स्वामियों, अष्टकवर्ग और योगों पर आधारित है। सटीक वर्ष व उपाय पूर्ण कुंडली में दिए जाते हैं।", "This snapshot is based on key house lords, ashtakavarga and yogas. Exact years and remedies are given in the full kundali.")}</p>`;
  }

  // ---------- Page 9: Sensitive points ----------
  function pageCons(m) {
    const list = m.cons.slice(0, 6);
    const sevLabel = (s) => (s === 3 ? T("प्रबल", "High") : (s === 2 ? T("मध्यम", "Moderate") : T("ध्यान दें", "Watch")));
    const waText = encodeURIComponent(`${T("प्रणाम आचार्य जी", "Namaste Acharya ji")} 🙏 ${T("मेरी निःशुल्क कुंडली", "My free kundali")} ${m.reportId} (${m.ctx.name}) — ${T("मुझे इन दोषों के उपाय व पूर्ण कुंडली चाहिए।", "I need remedies for these points and the full kundali.")}`);
    const body = list.length
      ? list.map((c) => `
          <div class="card sev${c.sev}">
            <div class="ct"><span class="sev">${sevLabel(c.sev)}</span> ${c.title}</div>
            <p class="basis">${T("आधार", "Basis")}: ${c.basis}</p>
            <p>${c.effect}</p>
          </div>`).join("")
      : `<div class="card okcard"><p>${T("आपकी कुंडली में कोई प्रबल दोष या कठिन गोचर इस समय नहीं है।", "No strong dosha or difficult transit is active in your chart right now.")}</p></div>`;
    return `
      <p class="lead">${T("ये बिंदु आपकी कुंडली की गणना से सीधे निकले हैं। इनका अर्थ डरना नहीं, बल्कि समय रहते सही उपाय करना है — शास्त्र कहते हैं, जाना हुआ दोष आधा निवारित होता है।", "These points come directly from your chart's calculations. They are not a reason to fear but to act in time — as the shastras say, a dosha known is half resolved.")}</p>
      ${body}
      <div class="cta">
        ${OPT.qrData ? `<img src="${OPT.qrData}" alt="QR">` : ""}
        <div>
          <b>${T("इन बिंदुओं के व्यक्तिगत उपाय चाहिए?", "Need personal remedies for these points?")}</b>
          <p>${T(`आपकी कुंडली के लिए विशेष मंत्र, दान, रत्न-पात्रता और उपाय-कैलेंडर आचार्य जी स्वयं तैयार करते हैं। WhatsApp: <b>${esc(OPT.phone)}</b> • रिपोर्ट क्रमांक <b>${m.reportId}</b> बताएँ।`, `Acharya ji personally prepares mantras, charity, gemstone suitability and a remedy calendar for your chart. WhatsApp: <b>${esc(OPT.phone)}</b> • quote report ID <b>${m.reportId}</b>.`)}</p>
          <a class="btn" href="https://wa.me/${OPT.waNumber}?text=${waText}">${T("WhatsApp पर उपाय पूछें →", "Ask for remedies on WhatsApp →")}</a>
        </div>
      </div>`;
  }

  // ---------- Page 10: Remedies, offer, QR ----------
  function pageClose(m) {
    const keys = [];
    if (m.full) keys.push(m.lordOf(1));
    if (m.dasha) keys.push(m.dasha.md.lord, m.dasha.ad.lord);
    if (m.moonReliable && (m.transit.sadeSati.current || [4, 8].includes(m.transit.satFromMoon))) keys.push("Saturn");
    if (!m.full && m.num) keys.push(NUM_PLANET[m.num.mulank], NUM_PLANET[m.num.bhagyank]);
    const rem = uniq(keys).slice(0, 4).map((k) => `<li><b>${pName(k)}:</b> ${T(SIMPLE_REMEDY_HI[k], SIMPLE_REMEDY_EN[k])} • <span class="mantra">${MANTRA[k]}</span> ${T("(108 बार)", "(108 times)")}</li>`).join("");
    const full = T(
      ["35+ पेज, 17 अध्याय — लग्न, नवांश, दशमांश व सप्तांश कुंडली सहित", "विवाह का सबसे प्रबल वर्ष, जीवनसाथी का स्वरूप व गुण-मिलान", "करियर: नौकरी बनाम व्यवसाय, पदोन्नति व परिवर्तन के वर्ष", "महादशा-अंतर्दशा की तारीखें व अगले 5 वर्षों की समय-रेखा", "रत्न-पात्रता (वर्जित रत्न सहित) व रुद्राक्ष परामर्श", "आपकी कुंडली हेतु व्यक्तिगत मंत्र-दान-अनुष्ठान योजना", "ज्योतिषी द्वारा हस्तनिर्मित कुंडली भी उपलब्ध — ₹2,100, 5–7 दिन"],
      ["20+ pages, 12 chapters — with Lagna, Navamsa, Dasamsa and Saptamsa charts", "Strongest marriage year, spouse profile and matching", "Career: job vs business, promotion and change years", "Mahadasha–antardasha dates and a 5-year timeline", "Gemstone suitability (incl. prohibited stones) and Rudraksha", "A personal mantra–charity–ritual plan for your chart", "Handmade kundali by the astrologer also available — ₹2,100, 5–7 days"]);
    return `
      <div class="h3">${T("सरल दैनिक उपाय (सभी के लिए सुरक्षित)", "Simple daily remedies (safe for everyone)")}</div>
      <ul class="bul">${rem}</ul>
      <p class="note">${T("रत्न केवल पूर्ण कुंडली विश्लेषण के बाद धारण करें — गलत रत्न लाभ के स्थान पर हानि कर सकता है।", "Wear gemstones only after a full chart analysis — a wrong stone can harm instead of help.")}</p>
      <div class="offer">
        <div class="oh">${T("सम्पूर्ण कुंडली — 35+ पेज, 24 घंटे में", "Sampurna Kundali — 20+ pages, within 24 hours")} <span class="price">${OPT.fullPrice}${OPT.fullPriceStrike ? ` <s>${OPT.fullPriceStrike}</s>` : ""}</span></div>
        <ul>${full.map((x) => `<li>✔ ${x}</li>`).join("")}</ul>
      </div>
      <div class="bigqr">
        ${OPT.qrData ? `<img src="${OPT.qrData}" alt="QR">` : `<div class="qrph">Pay<br>online</div>`}
        <div>
          <div class="bq1">🙏 ${T("गुरु-दक्षिणा / पूर्ण कुंडली हेतु स्कैन करें", "Scan for Guru-Dakshina / Full Kundali")}</div>
          <p>${T("QR स्कैन करें — Cashfree का सुरक्षित पेज खुलेगा, जहाँ Card, UPI ऐप या Net Banking से गुरु-दक्षिणा दे सकते हैं। पूर्ण कुंडली के लिए jyotishtark.in/sampurna-kundali.html देखें।", "Scan the QR to open our secure Cashfree page and offer Guru-Dakshina by card, UPI app or net banking. For the full kundali, visit jyotishtark.in/sampurna-kundali.html.")}</p>
          <p class="contact">📱 ${esc(OPT.phone)} • ✉ ${esc(OPT.email)} • 🌐 ${esc(OPT.site)}</p>
          <p class="sig">${T(OPT.acharyaHi, OPT.acharyaEn)}<br><small>${T("ज्योतिष तर्क", "Jyotish Tark")}</small></p>
        </div>
      </div>
      <p class="disc">${T("अस्वीकरण: यह विश्लेषण वैदिक ज्योतिष के शास्त्रीय सिद्धांतों (BPHS, जैमिनी सूत्र) पर आधारित मार्गदर्शन है। गणनाएँ खगोलीय रूप से सटीक हैं, परंतु फलादेश संभावनाएँ दर्शाते हैं। चिकित्सा, कानूनी या वित्तीय निर्णय संबंधित विशेषज्ञ की सलाह से लें।", "Disclaimer: This analysis is guidance based on classical Vedic principles (BPHS, Jaimini Sutras). Calculations are astronomically precise; predictions indicate probabilities. Take medical, legal or financial decisions with a qualified professional.")}</p>
      <div class="bless">॥ ${T("शुभम् भवतु • कल्याणमस्तु", "Shubham Bhavatu • Kalyanamastu")} ॥</div>`;
  }

  // ==========================================================================
  // 9B. DATE-OF-BIRTH (ANK JYOTISH) READING — USED WHEN BIRTH TIME IS UNKNOWN
  // ==========================================================================
  // Traditional Ank-Jyotish mapping: 1 Sun, 2 Moon, 3 Jupiter, 4 Rahu, 5 Mercury,
  // 6 Venus, 7 Ketu, 8 Saturn, 9 Mars. Number friendship is derived from the
  // classical (Naisargika) friendship of these planets, so it stays consistent
  // with the rest of the kundali engine.
  const NUM_PLANET = [null, "Sun", "Moon", "Jupiter", "Rahu", "Mercury", "Venus", "Ketu", "Saturn", "Mars"];
  const PLANET_NUM = { Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9 };
  const NAT_FRIENDS = {
    Sun: { f: ["Moon", "Mars", "Jupiter"], e: ["Venus", "Saturn", "Rahu", "Ketu"] },
    Moon: { f: ["Sun", "Mercury"], e: ["Rahu", "Ketu"] },
    Mars: { f: ["Sun", "Moon", "Jupiter", "Ketu"], e: ["Mercury", "Rahu"] },
    Mercury: { f: ["Sun", "Venus", "Rahu"], e: ["Moon"] },
    Jupiter: { f: ["Sun", "Moon", "Mars", "Ketu"], e: ["Mercury", "Venus", "Rahu"] },
    Venus: { f: ["Mercury", "Saturn", "Rahu"], e: ["Sun", "Moon"] },
    Saturn: { f: ["Mercury", "Venus", "Rahu"], e: ["Sun", "Moon", "Mars"] },
    Rahu: { f: ["Venus", "Saturn", "Mercury"], e: ["Sun", "Moon", "Mars", "Jupiter"] },
    Ketu: { f: ["Mars", "Jupiter"], e: ["Sun", "Moon"] }
  };
  function numRelation(a, b) {
    if (a === b) return "same";
    const pa = NUM_PLANET[a], pb = NUM_PLANET[b];
    const fa = NAT_FRIENDS[pa], fb = NAT_FRIENDS[pb];
    const aToB = fa.f.includes(pb) ? 1 : (fa.e.includes(pb) ? -1 : 0);
    const bToA = fb.f.includes(pa) ? 1 : (fb.e.includes(pa) ? -1 : 0);
    const s = aToB + bToA;
    return s >= 1 ? "friend" : (s <= -1 ? "enemy" : "neutral");
  }
  const reduce9 = (n) => { n = Math.abs(Number(n) || 0); while (n > 9) n = String(n).split("").reduce((x, d) => x + Number(d), 0); return n || 9; };

  const NUM_HI = {
    1: { trait: "नेतृत्व, आत्मविश्वास और स्वतंत्र निर्णय", str: ["जन्मजात नेतृत्व क्षमता", "आत्मनिर्भरता", "स्पष्ट लक्ष्य"], ch: ["अहंकार व ज़िद", "दूसरों की बात कम सुनना", "सब कुछ अकेले करने की आदत"], career: "प्रशासन, सरकारी सेवा, प्रबंधन, स्वयं का व्यवसाय, राजनीति", money: "धन स्वयं के प्रयास और पद से आता है; बड़े निर्णय स्वयं लेना पसंद।", love: "सम्मान चाहने वाले; साथी पर नियंत्रण की प्रवृत्ति से बचें।", health: "हृदय, आँखें, रक्तचाप व हड्डियों का ध्यान रखें।", color: "सुनहरा, नारंगी, केसरिया", day: "रविवार", dir: "पूर्व", deity: "सूर्य देव" },
    2: { trait: "भावुकता, कल्पनाशीलता, सहयोग और कूटनीति", str: ["गहरी संवेदनशीलता", "सहयोग व मेल-मिलाप", "रचनात्मकता"], ch: ["मूड जल्दी बदलना", "निर्णय में अनिश्चितता", "अधिक चिंता करना"], career: "कला/संगीत, परामर्श/मनोविज्ञान, स्वास्थ्य-सेवा, आतिथ्य, जल-खाद्य से जुड़ा व्यापार", money: "आय में उतार-चढ़ाव रहता है; नियमित बचत की आदत आवश्यक।", love: "गहरा भावनात्मक जुड़ाव; छोटी बातों से आहत न हों।", health: "मन, नींद, पाचन व सर्दी-जुकाम पर ध्यान दें।", color: "सफ़ेद, क्रीम, हल्का हरा", day: "सोमवार", dir: "उत्तर-पश्चिम", deity: "भगवान शिव" },
    3: { trait: "ज्ञान, अनुशासन, महत्वाकांक्षा और मार्गदर्शन", str: ["सीखने व सिखाने की ललक", "ईमानदारी व सिद्धांत", "लोगों को दिशा देना"], ch: ["दूसरों की आलोचना", "स्वयं को ही सही मानना", "अधिक उपदेश देना"], career: "शिक्षण, विधि/न्याय, बैंकिंग/वित्त, परामर्श, धार्मिक-सामाजिक संस्थाएँ", money: "ज्ञान और प्रतिष्ठा से धन; उधार देने में सावधानी रखें।", love: "आदर्शवादी; साथी में बुद्धिमत्ता और सम्मान चाहते हैं।", health: "यकृत, शर्करा (मधुमेह), वज़न व पाचन पर ध्यान दें।", color: "पीला, सुनहरा, बैंगनी", day: "गुरुवार", dir: "उत्तर-पूर्व", deity: "भगवान विष्णु / देवगुरु बृहस्पति" },
    4: { trait: "परिश्रम, अलग सोच, व्यवस्था और परिवर्तन", str: ["कठिन परिश्रम की क्षमता", "नई व मौलिक सोच", "तकनीकी समझ"], ch: ["अचानक आने वाली बाधाएँ", "ज़िद व विद्रोह", "जल्दबाज़ी में खर्च"], career: "आईटी/तकनीक, इंजीनियरिंग, शोध, विदेशी व्यापार, मीडिया", money: "आय अचानक आती-जाती है; जोखिम भरे निवेश से बचें।", love: "मित्र कम पर गहरे; ग़लतफ़हमियों को समय पर सुलझाएँ।", health: "नसें, सिरदर्द, अनिद्रा और अचानक होने वाले रोगों से सावधानी।", color: "नीला, धूसर, खाकी", day: "शनिवार", dir: "दक्षिण-पश्चिम", deity: "माँ दुर्गा" },
    5: { trait: "बुद्धिमत्ता, तीव्रता, मिलनसारिता और बहुमुखी प्रतिभा", str: ["उत्कृष्ट संवाद कौशल", "व्यापारिक बुद्धि", "जल्दी सीखना"], ch: ["बेचैनी", "बार-बार दिशा बदलना", "जल्दबाज़ी"], career: "व्यापार/मार्केटिंग, वित्त/लेखा, आईटी, मीडिया/लेखन, यात्रा से जुड़े कार्य", money: "व्यापार और संपर्कों से अच्छी कमाई; जोखिम संतुलित रखें।", love: "हँसमुख व आकर्षक; संबंधों में स्थिरता सीखनी होती है।", health: "नसें, त्वचा, श्वास और तनाव पर ध्यान दें।", color: "हरा, फ़िरोज़ी", day: "बुधवार", dir: "उत्तर", deity: "श्री गणेश" },
    6: { trait: "आकर्षण, कलाप्रियता, ज़िम्मेदारी और पारिवारिक प्रेम", str: ["सौंदर्य-बोध", "संबंध निभाने की कला", "सेवा भाव"], ch: ["सुख-सुविधा पर अधिक खर्च", "भावनात्मक निर्भरता", "आलोचना से आहत होना"], career: "डिज़ाइन/फ़ैशन, मीडिया/फ़िल्म, होटल/आतिथ्य, सौंदर्य उद्योग, वित्त", money: "आय अच्छी, पर विलासिता पर खर्च अधिक; बजट बनाएँ।", love: "प्रेम व परिवार जीवन का केंद्र; सामंजस्य प्रिय।", health: "गला, गुर्दे, त्वचा व हार्मोन संतुलन पर ध्यान दें।", color: "सफ़ेद, गुलाबी, हल्का नीला", day: "शुक्रवार", dir: "दक्षिण-पूर्व", deity: "माँ लक्ष्मी" },
    7: { trait: "गहन चिंतन, अंतर्ज्ञान, आध्यात्मिकता और स्वतंत्रता", str: ["विश्लेषण व शोध क्षमता", "तीव्र अंतर्ज्ञान", "मौलिकता"], ch: ["एकांत-प्रियता", "लोगों पर अविश्वास", "निर्णय टालना"], career: "शोध/विज्ञान, चिकित्सा, लेखन, ज्योतिष/आध्यात्म, विदेश से जुड़े कार्य", money: "धन के प्रति उदासीनता; योजनाबद्ध बचत आवश्यक।", love: "भावनाएँ कम व्यक्त करते हैं; विश्वास बनने में समय लगता है।", health: "पाचन, त्वचा और मनोदैहिक (तनाव-जनित) कष्टों पर ध्यान दें।", color: "हल्का हरा, सफ़ेद, धूसर", day: "सोमवार", dir: "उत्तर-पश्चिम", deity: "श्री गणेश" },
    8: { trait: "गंभीरता, धैर्य, कर्मठता और न्यायप्रियता", str: ["अटूट अनुशासन", "लंबी अवधि की योजना", "कठिन समय में डटे रहना"], ch: ["सफलता देर से", "अकेलापन/उदासी", "लोगों द्वारा ग़लत समझा जाना"], career: "उद्योग/निर्माण, विधि/न्याय, प्रशासन/संचालन, रियल एस्टेट, खनन/ऊर्जा", money: "धन देर से, पर स्थायी; आयु के साथ बढ़ता है।", love: "निष्ठावान, पर भावनाएँ व्यक्त करने में संकोच।", health: "जोड़ों, हड्डियों, दाँतों व वात-रोगों पर ध्यान दें।", color: "गहरा नीला, काला, बैंगनी", day: "शनिवार", dir: "पश्चिम", deity: "श्री हनुमान / शनि देव" },
    9: { trait: "साहस, ऊर्जा, जोश और रक्षा-भाव", str: ["अदम्य साहस", "भरपूर ऊर्जा", "नेतृत्व व रक्षा का भाव"], ch: ["क्रोध", "जल्दबाज़ी", "विवाद व चोट"], career: "सेना/पुलिस, इंजीनियरिंग, खेल, चिकित्सा/सर्जरी, भूमि/निर्माण", money: "कमाई अच्छी, खर्च भी तेज़; भूमि में निवेश शुभ।", love: "भावुक व रक्षक; क्रोध पर नियंत्रण संबंध बचाता है।", health: "रक्त, बुखार, चोट और रक्तचाप पर ध्यान दें।", color: "लाल, गुलाबी, केसरिया", day: "मंगलवार", dir: "दक्षिण", deity: "श्री हनुमान" }
  };
  const NUM_EN = {
    1: { trait: "leadership, confidence and independent decisions", str: ["natural leadership", "self-reliance", "clear goals"], ch: ["ego and stubbornness", "not listening to others", "doing everything alone"], career: "administration, government, management, own business, politics", money: "Money comes through your own effort and position; you prefer to take big decisions yourself.", love: "You want respect; avoid controlling your partner.", health: "Care for heart, eyes, blood pressure and bones.", color: "gold, orange, saffron", day: "Sunday", dir: "East", deity: "Surya Dev" },
    2: { trait: "emotion, imagination, cooperation and diplomacy", str: ["deep sensitivity", "cooperation and harmony", "creativity"], ch: ["changing moods", "indecision", "excess worry"], career: "arts/music, counselling/psychology, healthcare, hospitality, food and liquids trade", money: "Income fluctuates; a regular saving habit is essential.", love: "Deep emotional bonding; try not to be hurt by small things.", health: "Mind, sleep, digestion and colds need care.", color: "white, cream, light green", day: "Monday", dir: "North-West", deity: "Lord Shiva" },
    3: { trait: "wisdom, discipline, ambition and guidance", str: ["love of learning and teaching", "honesty and principles", "guiding others"], ch: ["criticising others", "always believing you are right", "over-advising"], career: "teaching, law, banking/finance, consulting, religious and social institutions", money: "Wealth through knowledge and reputation; be careful lending money.", love: "Idealistic; you look for intelligence and respect in a partner.", health: "Care for liver, blood sugar, weight and digestion.", color: "yellow, gold, purple", day: "Thursday", dir: "North-East", deity: "Lord Vishnu / Guru Brihaspati" },
    4: { trait: "hard work, original thinking, order and change", str: ["capacity for hard work", "new and original ideas", "technical understanding"], ch: ["sudden obstacles", "stubbornness and rebellion", "impulsive spending"], career: "IT/technology, engineering, research, foreign trade, media", money: "Money comes and goes suddenly; avoid risky investments.", love: "Few but deep friendships; clear misunderstandings early.", health: "Nerves, headaches, insomnia and sudden ailments need care.", color: "blue, grey, khaki", day: "Saturday", dir: "South-West", deity: "Goddess Durga" },
    5: { trait: "intelligence, speed, sociability and versatility", str: ["excellent communication", "business sense", "quick learning"], ch: ["restlessness", "changing direction often", "haste"], career: "business/marketing, finance/accounts, IT, media/writing, travel-related work", money: "Good earnings through trade and contacts; keep risks balanced.", love: "Cheerful and charming; stability has to be learned.", health: "Nerves, skin, breathing and stress need care.", color: "green, turquoise", day: "Wednesday", dir: "North", deity: "Lord Ganesha" },
    6: { trait: "charm, artistry, responsibility and love of family", str: ["aesthetic sense", "nurturing relationships", "service"], ch: ["overspending on comforts", "emotional dependence", "hurt by criticism"], career: "design/fashion, media/film, hotels/hospitality, beauty industry, finance", money: "Good income but high spending on luxury; keep a budget.", love: "Love and family are the centre of life; you value harmony.", health: "Throat, kidneys, skin and hormonal balance need care.", color: "white, pink, light blue", day: "Friday", dir: "South-East", deity: "Goddess Lakshmi" },
    7: { trait: "deep thought, intuition, spirituality and independence", str: ["analysis and research", "strong intuition", "originality"], ch: ["love of solitude", "distrust of people", "postponing decisions"], career: "research/science, medicine, writing, astrology/spirituality, foreign-linked work", money: "Indifferent to money; planned saving is essential.", love: "You express feelings little; trust takes time.", health: "Digestion, skin and stress-related complaints need care.", color: "light green, white, grey", day: "Monday", dir: "North-West", deity: "Lord Ganesha" },
    8: { trait: "seriousness, patience, hard work and justice", str: ["unbreakable discipline", "long-term planning", "standing firm in hard times"], ch: ["late success", "loneliness/low mood", "being misunderstood"], career: "industry/construction, law, administration/operations, real estate, mining/energy", money: "Wealth comes late but stays; it grows with age.", love: "Loyal, but hesitant to express emotions.", health: "Joints, bones, teeth and Vata disorders need care.", color: "dark blue, black, purple", day: "Saturday", dir: "West", deity: "Lord Hanuman / Shani Dev" },
    9: { trait: "courage, energy, passion and protectiveness", str: ["fearless courage", "abundant energy", "leadership and protectiveness"], ch: ["anger", "haste", "disputes and injuries"], career: "army/police, engineering, sports, medicine/surgery, land/construction", money: "Good earnings, fast spending; investing in land is auspicious.", love: "Passionate and protective; controlling anger saves relationships.", health: "Blood, fevers, injuries and blood pressure need care.", color: "red, pink, saffron", day: "Tuesday", dir: "South", deity: "Lord Hanuman" }
  };
  const PY_HI = {
    1: ["नई शुरुआत", "नया काम, कोर्स या नौकरी शुरू करने का वर्ष; पहल करें।", "good"],
    2: ["धैर्य व साझेदारी", "संबंध और सहयोग का वर्ष; जल्दबाज़ी न करें।", "mixed"],
    3: ["विस्तार व अभिव्यक्ति", "शिक्षा, रचनात्मकता और सामाजिक संपर्क बढ़ते हैं।", "good"],
    4: ["परिश्रम व नींव", "मेहनत अधिक, फल धीरे; स्वास्थ्य व खर्च पर ध्यान।", "caution"],
    5: ["परिवर्तन", "यात्रा, बदलाव व नए अवसर; अस्थिर निर्णयों से बचें।", "mixed"],
    6: ["परिवार व ज़िम्मेदारी", "विवाह, घर, परिवार और सेवा से जुड़े शुभ अवसर।", "good"],
    7: ["आत्मचिंतन", "अध्ययन, आध्यात्म व एकांत का वर्ष; बड़े निवेश टालें।", "caution"],
    8: ["कर्म-फल व धन", "पद, धन व अधिकार के अवसर, पर दबाव व कानूनी मामलों में सावधानी।", "mixed"],
    9: ["पूर्णता", "पुराने कार्य पूरे करने और जो काम का नहीं उसे छोड़ने का वर्ष।", "mixed"]
  };
  const PY_EN = {
    1: ["New beginnings", "A year to start a new job, course or venture; take initiative.", "good"],
    2: ["Patience & partnership", "A year of relationships and cooperation; don't rush.", "mixed"],
    3: ["Expansion & expression", "Education, creativity and social contacts grow.", "good"],
    4: ["Hard work & foundations", "More effort, slower results; watch health and spending.", "caution"],
    5: ["Change", "Travel, change and new openings; avoid unstable decisions.", "mixed"],
    6: ["Family & responsibility", "Good openings around marriage, home, family and service.", "good"],
    7: ["Reflection", "A year for study, spirituality and solitude; postpone big investments.", "caution"],
    8: ["Karma & money", "Chances of position, money and authority, but care with pressure and legal matters.", "mixed"],
    9: ["Completion", "Finish old work and let go of what no longer serves you.", "mixed"]
  };
  const MISSING_HI = {
    1: "अपनी बात कहने व आत्मविश्वास में संकोच", 2: "धैर्य, सहयोग और अंतर्ज्ञान पर काम आवश्यक", 3: "कल्पना, योजना व पढ़ाई में एकाग्रता हेतु प्रयास",
    4: "अनुशासन व व्यवस्था की कमी; काम अधूरे छूटना", 5: "भावनात्मक संतुलन और स्थिरता की कमी", 6: "घर-परिवार के सुख व ज़िम्मेदारी में कमी का भाव",
    7: "भाग्य के सहारे की कमी; अनुभव से सीखना पड़ता है", 8: "धन-प्रबंधन व बारीकियों पर ध्यान की कमी", 9: "महत्वाकांक्षा, ऊर्जा व प्रेरणा की कमी"
  };
  const MISSING_EN = {
    1: "hesitation in self-expression and confidence", 2: "patience, cooperation and intuition need work", 3: "effort needed in imagination, planning and focus",
    4: "lack of discipline and order; tasks left unfinished", 5: "lack of emotional balance and stability", 6: "a sense of lack in home comforts and responsibility",
    7: "less support from luck; lessons come through experience", 8: "weak money management and attention to detail", 9: "low ambition, energy and motivation"
  };
  const PLANES = [
    { n: [4, 9, 2], hi: "विचार-शक्ति (मानसिक)", en: "Mental plane" }, { n: [3, 5, 7], hi: "भावनात्मक संतुलन", en: "Emotional plane" },
    { n: [8, 1, 6], hi: "व्यावहारिक कुशलता", en: "Practical plane" }, { n: [4, 3, 8], hi: "योजना-शक्ति", en: "Thought plane" },
    { n: [9, 5, 1], hi: "इच्छा-शक्ति", en: "Will plane" }, { n: [2, 7, 6], hi: "कर्म-शक्ति", en: "Action plane" },
    { n: [4, 5, 6], hi: "स्वर्ण (सफलता) रेखा", en: "Golden (success) line" }, { n: [2, 5, 8], hi: "संपत्ति रेखा", en: "Property line" }
  ];
  const LOSHU_LAYOUT = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  const PLANE_MEAN_HI = ["स्मरण-शक्ति, बुद्धि व विश्लेषण", "भावनाओं की गहराई व संतुलन", "व्यावहारिक कार्य, धन-प्रबंधन व भौतिक सफलता", "योजना बनाना व विचारों को व्यवस्थित करना", "दृढ़ संकल्प और लक्ष्य पर टिके रहना", "विचारों को कर्म में बदलना", "सफलता, प्रगति व स्थिरता", "संपत्ति, भूमि व भौतिक सुख"];
  const PLANE_MEAN_EN = ["memory, intellect and analysis", "emotional depth and balance", "practical work, money management and material success", "planning and organising ideas", "determination and staying on target", "turning ideas into action", "success, progress and stability", "property, land and material comfort"];
  const ADVICE_HI = {
    1: "दूसरों को साथ लेकर चलें — आपकी सफलता टीम के सहयोग से कई गुना बढ़ती है। सुबह जल्दी उठना और सूर्य-नमस्कार आपके लिए विशेष शुभ है।",
    2: "बड़े निर्णय शांत मन से, एक दिन रुककर लें। नियमित ध्यान, पर्याप्त नींद और जल-सेवन आपके मन को स्थिर रखते हैं।",
    3: "ज्ञान बाँटें, पर उपदेश कम दें — सुनने की आदत आपको सर्वोत्तम मार्गदर्शक बनाती है। गुरुवार को बड़ों का आशीर्वाद लें।",
    4: "योजना लिखकर काम करें और अचानक निर्णयों से बचें। अनुशासित दिनचर्या आपकी बाधाओं को अवसर में बदल देती है।",
    5: "एक समय में एक लक्ष्य पर टिकें। आपकी वाणी आपकी पूँजी है — संवाद, नेटवर्क और व्यापारिक बुद्धि का सही उपयोग करें।",
    6: "सुख-सुविधा और बचत में संतुलन रखें। परिवार और कला से जुड़ाव आपको ऊर्जा देता है; स्वच्छता और सुगंध शुभ फल देती हैं।",
    7: "अपने अंतर्ज्ञान पर भरोसा करें, पर विश्वसनीय लोगों से विचार साझा करें। अध्ययन और ध्यान आपकी सबसे बड़ी शक्ति हैं।",
    8: "धैर्य ही आपकी कुंजी है — आपकी मेहनत देर से, पर स्थायी फल देती है। ईमानदारी, सेवा और ज़रूरतमंदों की सहायता भाग्य खोलती है।",
    9: "क्रोध को ऊर्जा में बदलें — खेल, व्यायाम या सेवा कार्य में। विवाद से पहले दस तक गिनें; साहस को धैर्य के साथ जोड़ें।"
  };
  const ADVICE_EN = {
    1: "Take others along — your success multiplies with a team. Rising early and Surya Namaskar are especially good for you.",
    2: "Take big decisions with a calm mind, after a day's pause. Regular meditation, enough sleep and water keep your mind steady.",
    3: "Share knowledge but advise less — listening makes you the best guide. Seek elders' blessings on Thursdays.",
    4: "Work from a written plan and avoid sudden decisions. A disciplined routine turns your obstacles into openings.",
    5: "Stick to one goal at a time. Your words are your capital — use communication, networks and business sense well.",
    6: "Balance comfort and saving. Family and the arts recharge you; cleanliness and fragrance bring good results.",
    7: "Trust your intuition, but share ideas with trusted people. Study and meditation are your greatest strengths.",
    8: "Patience is your key — your effort pays late but lasts. Honesty, service and helping the needy open your luck.",
    9: "Turn anger into energy — sport, exercise or service. Count to ten before a dispute; pair courage with patience."
  };

  function buildNumModel(ctx) {
    const nd = ctx.numData || {};
    const [y, mo, d] = String(ctx.dob || "2000-01-01").split("-").map(Number);
    const mulank = reduce9(d);
    const digitsAll = String(ctx.dob || "").replace(/\D/g, "");
    const bhagyank = reduce9(digitsAll.split("").reduce((a, b) => a + Number(b), 0));
    const latin = /[A-Za-z]/.test(ctx.name || "");
    const name = latin && ctx.chaldean && ctx.chaldean.compound > 0 ? { compound: ctx.chaldean.compound, single: reduce9(ctx.chaldean.compound) } : null;

    const counts = {};
    for (let i = 1; i <= 9; i++) counts[i] = 0;
    digitsAll.split("").map(Number).filter((x) => x > 0).forEach((x) => { counts[x]++; });
    counts[bhagyank]++;
    if (d > 9) counts[mulank]++;
    const missing = Object.keys(counts).map(Number).filter((k) => counts[k] === 0);
    const strong = Object.keys(counts).map(Number).filter((k) => counts[k] >= 2);
    const fullPlanes = PLANES.filter((p) => p.n.every((x) => counts[x] > 0));
    const emptyPlanes = PLANES.filter((p) => p.n.every((x) => counts[x] === 0));

    const thisYear = new Date().getFullYear();
    const pyOf = (yr) => reduce9(d + mo + reduce9(yr));
    const years = [];
    for (let yr = thisYear; yr <= thisYear + 5; yr++) years.push({ yr, py: pyOf(yr) });

    const friendsOf = (n) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((k) => k !== n && numRelation(n, k) === "friend");
    const enemiesOf = (n) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((k) => k !== n && numRelation(n, k) === "enemy");
    return {
      d, mo, y, mulank, bhagyank, name, counts, missing, strong, fullPlanes, emptyPlanes, years,
      mbRel: numRelation(mulank, bhagyank),
      nameRelM: name ? numRelation(name.single, mulank) : null,
      nameRelB: name ? numRelation(name.single, bhagyank) : null,
      lucky: uniq([mulank, ...friendsOf(mulank)]).filter((k) => !enemiesOf(bhagyank).includes(k)),
      avoid: enemiesOf(mulank).filter((k) => k !== bhagyank),
      partner: friendsOf(mulank),
      currentPY: years[0].py
    };
  }

  const NUMT = (n, key) => (LANG === "hi" ? NUM_HI[n][key] : NUM_EN[n][key]);
  const relLabel = (r) => ({ same: T("समान", "same"), friend: T("मित्र", "friendly"), neutral: T("सम", "neutral"), enemy: T("विरोधी", "opposing") }[r]);

  function addNumerologyCons(m, add) {
    const n = m.num;
    if (n.mbRel === "enemy") {
      add({
        key: "NUM_MB", sev: 2, dom: ["career", "health"],
        title: T(`मूलांक ${n.mulank} और भाग्यांक ${n.bhagyank} में टकराव`, `Conflict between birth number ${n.mulank} and destiny number ${n.bhagyank}`),
        basis: T(`मूलांक ${n.mulank} (${PL_HI[NUM_PLANET[n.mulank]]}) और भाग्यांक ${n.bhagyank} (${PL_HI[NUM_PLANET[n.bhagyank]]}) परस्पर विरोधी ग्रहों के अंक हैं`, `${n.mulank} (${PL_EN[NUM_PLANET[n.mulank]]}) and ${n.bhagyank} (${PL_EN[NUM_PLANET[n.bhagyank]]}) belong to opposing planets`),
        effect: T("मन एक दिशा चाहता है, परिस्थितियाँ दूसरी ओर ले जाती हैं — प्रयास के अनुपात में फल देर से मिलता है। सही दिशा-चयन व उपाय से यह संतुलित होता है।", "The mind wants one direction while circumstances pull another — results lag behind effort. The right direction and remedies balance this.")
      });
    }
    if (n.name && (n.nameRelM === "enemy" || n.nameRelB === "enemy")) {
      add({
        key: "NUM_NAME", sev: 2, dom: ["career", "wealth"],
        title: T(`नाम का अंक ${n.name.single} आपके जन्म-अंकों से मेल नहीं खाता`, `Your name number ${n.name.single} does not match your birth numbers`),
        basis: T(`नाम "${esc(m.ctx.name)}" का अंक ${n.name.compound}/${n.name.single} (${PL_HI[NUM_PLANET[n.name.single]]}) — मूलांक से ${relLabel(n.nameRelM)}, भाग्यांक से ${relLabel(n.nameRelB)}`, `Name "${esc(m.ctx.name)}" totals ${n.name.compound}/${n.name.single} (${PL_EN[NUM_PLANET[n.name.single]]}) — ${relLabel(n.nameRelM)} to the birth number, ${relLabel(n.nameRelB)} to the destiny number`),
        effect: T("नाम रोज़ बोला और लिखा जाता है; अंक-विरोध से पहचान, अवसर व प्रतिष्ठा में अकारण रुकावट आती है। नाम की वर्तनी में छोटे संशोधन से इसे ठीक किया जा सकता है।", "A name is spoken and written daily; a mismatch brings needless friction in recognition, opportunities and reputation. A small spelling correction can fix it.")
      });
    }
    const pyTone = PY_HI[n.currentPY][2];
    if (pyTone === "caution" || n.currentPY === 8) {
      add({
        key: "NUM_PY", sev: pyTone === "caution" ? 2 : 1, dom: ["career", "wealth"],
        title: T(`वर्ष ${n.years[0].yr}: व्यक्तिगत वर्ष-अंक ${n.currentPY} — ${PY_HI[n.currentPY][0]}`, `${n.years[0].yr}: personal year ${n.currentPY} — ${PY_EN[n.currentPY][0]}`),
        basis: T(`जन्म-दिन व माह के अंकों और वर्ष ${n.years[0].yr} के योग से`, `From your birth day and month plus the year ${n.years[0].yr}`),
        effect: T(PY_HI[n.currentPY][1], PY_EN[n.currentPY][1])
      });
    }
    if (n.emptyPlanes.length || n.missing.length >= 5) {
      add({
        key: "NUM_MISSING", sev: 1, dom: ["education"],
        title: T(`जन्म-तिथि में ${n.missing.length} अंकों की कमी`, `${n.missing.length} numbers missing from your birth date`),
        basis: T(`अनुपस्थित अंक: ${n.missing.join(", ")}${n.emptyPlanes.length ? ` • रिक्त रेखा: ${n.emptyPlanes.map((p) => p.hi).join(", ")}` : ""}`, `Missing: ${n.missing.join(", ")}${n.emptyPlanes.length ? ` • empty line: ${n.emptyPlanes.map((p) => p.en).join(", ")}` : ""}`),
        effect: T(`मुख्य कमी: ${n.missing.slice(0, 3).map((k) => MISSING_HI[k]).join("; ")}। इनकी पूर्ति के सरल उपाय होते हैं।`, `Main gaps: ${n.missing.slice(0, 3).map((k) => MISSING_EN[k]).join("; ")}. Each has simple remedies.`)
      });
    }
  }

  // ---------- DOB page A: birth numbers + grid ----------
  function pageNumbers(m) {
    const n = m.num;
    const tile = (label, val, sub, note) => `<div class="ntile"><span>${label}</span><b>${val}</b><em>${sub}</em><small>${note}</small></div>`;
    const grid = LOSHU_LAYOUT.map((row) => `<tr>${row.map((k) => `<td class="${n.counts[k] ? "has" : "miss"}">${n.counts[k] ? String(k).repeat(n.counts[k]) : "—"}</td>`).join("")}</tr>`).join("");
    return `
      <div class="ntiles">
        ${tile(T("मूलांक", "Birth number"), n.mulank, pName(NUM_PLANET[n.mulank]), T("आपका स्वभाव और सोच", "your nature and thinking"))}
        ${tile(T("भाग्यांक", "Destiny number"), n.bhagyank, pName(NUM_PLANET[n.bhagyank]), T("जीवन की दिशा और भाग्य", "life direction and fortune"))}
        ${n.name ? tile(T("नामांक", "Name number"), `${n.name.single}<sup>${n.name.compound}</sup>`, pName(NUM_PLANET[n.name.single]), T("पहचान और प्रतिष्ठा", "identity and reputation")) : tile(T("वर्ष-अंक", "Personal year"), n.currentPY, String(n.years[0].yr), T(PY_HI[n.currentPY][0], PY_EN[n.currentPY][0]))}
      </div>
      <p class="lead">${T(`मूलांक ${n.mulank} और भाग्यांक ${n.bhagyank} का संबंध <b>${relLabel(n.mbRel)}</b> है${n.mbRel === "enemy" ? " — इसलिए प्रयास और परिणाम में अक्सर अंतर दिखता है।" : (n.mbRel === "friend" || n.mbRel === "same" ? " — स्वभाव और भाग्य एक ही दिशा में चलते हैं, जो प्रगति में सहायक है।" : " — परिणाम आपके सही चुनावों पर निर्भर करते हैं।")}${n.name ? ` नाम का अंक ${n.name.single} मूलांक से ${relLabel(n.nameRelM)} और भाग्यांक से ${relLabel(n.nameRelB)} है।` : ""}`,
        `The relationship between birth number ${n.mulank} and destiny number ${n.bhagyank} is <b>${relLabel(n.mbRel)}</b>${n.mbRel === "enemy" ? " — so effort and results often diverge." : (n.mbRel === "friend" || n.mbRel === "same" ? " — nature and destiny pull the same way, which helps progress." : " — results depend on your choices.")}${n.name ? ` Your name number ${n.name.single} is ${relLabel(n.nameRelM)} to the birth number and ${relLabel(n.nameRelB)} to the destiny number.` : ""}`)}</p>
      <div class="h3">${T("जन्म-तिथि अंक-चक्र", "Birth-date number grid")}</div>
      <div class="loshu">
        <table class="lsg">${grid}</table>
        <div>
          ${n.fullPlanes.length ? `<p><b class="ok">✦ ${T("पूर्ण रेखाएँ (शक्ति)", "Complete lines (strength)")}:</b> ${n.fullPlanes.map((p) => T(p.hi, p.en)).join(", ")}</p>` : ""}
          ${n.strong.length ? `<p><b class="ok">✦ ${T("प्रबल अंक", "Strong numbers")}:</b> ${n.strong.join(", ")}</p>` : ""}
          <p><b class="bad">⚠ ${T("अनुपस्थित अंक", "Missing numbers")}:</b> ${n.missing.length ? n.missing.join(", ") : T("कोई नहीं", "none")}</p>
          <ul class="bul">${n.missing.slice(0, 4).map((k) => `<li><b>${k}:</b> ${T(MISSING_HI[k], MISSING_EN[k])}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="h3">${T("अंक-चक्र की आठ रेखाएँ", "The eight lines of the grid")}</div>
      <table class="tbl"><thead><tr><th>${T("रेखा", "Line")}</th><th class="c">${T("अंक", "Numbers")}</th><th>${T("क्या दर्शाती है", "What it shows")}</th><th class="c">${T("स्थिति", "Status")}</th></tr></thead><tbody>
        ${PLANES.map((pl, i) => { const c = pl.n.filter((x) => n.counts[x] > 0).length; const st = c === 3 ? `<span class="chip chip-good">${T("पूर्ण", "Complete")}</span>` : (c === 0 ? `<span class="chip chip-caution">${T("रिक्त", "Empty")}</span>` : `<span class="chip chip-mixed">${T("आंशिक", "Partial")} ${c}/3</span>`); return `<tr><td class="b">${T(pl.hi, pl.en)}</td><td class="c">${pl.n.join("-")}</td><td>${T(PLANE_MEAN_HI[i], PLANE_MEAN_EN[i])}</td><td class="c">${st}</td></tr>`; }).join("")}
      </tbody></table>
      <div class="lockbox">🔒 ${T("अनुपस्थित अंकों की पूर्ति के व्यक्तिगत उपाय और नाम-वर्तनी सुधार — पूर्ण विश्लेषण में।", "Personal remedies for missing numbers and name-spelling correction — in the full analysis.")}</div>`;
  }

  // ---------- DOB page B: personality ----------
  function pageNumPersonality(m) {
    const n = m.num;
    const mul = n.mulank, bh = n.bhagyank;
    const list = (arr) => arr.map((x) => `<li>${x}</li>`).join("");
    return `
      <p><b>${T(`आपका मूल स्वभाव (मूलांक ${mul} — ${PL_HI[NUM_PLANET[mul]]}):`, `Your core nature (birth number ${mul} — ${PL_EN[NUM_PLANET[mul]]}):`)}</b> ${T(`आपके व्यक्तित्व की पहचान है — ${NUMT(mul, "trait")}।`, `Your personality is marked by ${NUMT(mul, "trait")}.`)}</p>
      <p><b>${T(`जीवन की दिशा (भाग्यांक ${bh} — ${PL_HI[NUM_PLANET[bh]]}):`, `Life direction (destiny number ${bh} — ${PL_EN[NUM_PLANET[bh]]}):`)}</b> ${T(`जीवन आपको ${NUMT(bh, "trait")} की ओर ले जाता है; आयु के साथ ये गुण अधिक उभरते हैं।`, `Life steers you towards ${NUMT(bh, "trait")}; these qualities grow stronger with age.`)}</p>
      <div class="two">
        <div class="card okcard"><div class="ct">✦ ${T("आपकी शक्तियाँ", "Your strengths")}</div><ul class="bul">${list(uniq([...NUMT(mul, "str"), ...NUMT(bh, "str").slice(0, 2)]))}</ul></div>
        <div class="card sev2"><div class="ct">⚠ ${T("जिन पर काम करना है", "What to work on")}</div><ul class="bul">${list(uniq([...NUMT(mul, "ch"), ...NUMT(bh, "ch").slice(0, 1)]))}</ul></div>
      </div>
      ${m.moonReliable ? `<p><b>${T(`चंद्र राशि ${RASHI_HI[m.moonR]} (${NAK_HI[m.moonNak - 1]} नक्षत्र):`, `Moon sign ${RASHI_EN[m.moonR]} (${NAK_EN[m.moonNak - 1]}):`)}</b> ${T(MOON_TRAIT_HI[m.moonR], MOON_TRAIT_EN[m.moonR])}</p>` : ""}
      <p><b>${T("स्वभाव और भाग्य का मेल:", "How nature and destiny combine:")}</b> ${n.mbRel === "enemy"
        ? T(`${PL_HI[NUM_PLANET[mul]]} और ${PL_HI[NUM_PLANET[bh]]} विरोधी ग्रह हैं — आप जो करना चाहते हैं और जीवन जो माँगता है, उनमें अक्सर खिंचाव रहता है। सही दिशा चुनने पर यही खिंचाव आपको असाधारण बनाता है।`, `${PL_EN[NUM_PLANET[mul]]} and ${PL_EN[NUM_PLANET[bh]]} are opposing planets — what you want and what life asks of you often pull apart. With the right direction this very tension makes you exceptional.`)
        : (n.mbRel === "neutral"
          ? T(`${PL_HI[NUM_PLANET[mul]]} और ${PL_HI[NUM_PLANET[bh]]} सम संबंध में हैं — परिणाम आपके चुनावों पर निर्भर करते हैं; सही समय और सही संगति से भाग्य तेज़ी से साथ देता है।`, `${PL_EN[NUM_PLANET[mul]]} and ${PL_EN[NUM_PLANET[bh]]} are neutral to each other — results depend on your choices; the right timing and company bring luck quickly.`)
          : T(`${PL_HI[NUM_PLANET[mul]]} और ${PL_HI[NUM_PLANET[bh]]} मित्र ग्रह हैं — आपका स्वभाव और भाग्य एक ही दिशा में चलते हैं। अपनी स्वाभाविक रुचि का अनुसरण करना ही आपकी सफलता का मार्ग है।`, `${PL_EN[NUM_PLANET[mul]]} and ${PL_EN[NUM_PLANET[bh]]} are friends — your nature and destiny pull the same way. Following your natural interests is your path to success.`))}</p>
      ${n.name ? `<p><b>${T(`नाम का प्रभाव (नामांक ${n.name.single} — ${PL_HI[NUM_PLANET[n.name.single]]}):`, `Effect of your name (name number ${n.name.single} — ${PL_EN[NUM_PLANET[n.name.single]]}):`)}</b> ${T(`लोग आपको ${NUMT(n.name.single, "trait")} से पहचानते हैं।`, `People recognise you by ${NUMT(n.name.single, "trait")}.`)} ${(n.nameRelM === "enemy" || n.nameRelB === "enemy") ? T("परंतु यह अंक आपके जन्म-अंकों से मेल नहीं खाता, इसलिए आपकी वास्तविक क्षमता लोगों तक पूरी नहीं पहुँचती।", "But this number clashes with your birth numbers, so your real ability does not fully reach people.") : T("यह अंक आपके जन्म-अंकों से अनुकूल है, जो पहचान और प्रतिष्ठा में सहायक है।", "This number suits your birth numbers, which helps recognition and reputation.")}</p>` : ""}
      <div class="card neutral"><div class="ct">🧭 ${T("आपकी सफलता का सूत्र", "Your formula for success")}</div><p>${T(ADVICE_HI[mul], ADVICE_EN[mul])}</p>${mul !== bh ? `<p>${T(ADVICE_HI[bh], ADVICE_EN[bh])}</p>` : ""}</div>
      <div class="lockbox">🔒 ${T("जन्म-समय से लग्न, नवांश और दशा जोड़कर स्वभाव का संपूर्ण विश्लेषण — पूर्ण कुंडली में।", "A complete temperament reading with ascendant, navamsa and dasha from your birth time — in the full kundali.")}</div>`;
  }

  // ---------- DOB page C: life areas ----------
  function pageNumAreas(m) {
    const n = m.num, mul = n.mulank, bh = n.bhagyank;
    const consFor = (dom) => { const c = m.cons.find((x) => (x.dom || []).includes(dom)); return c ? c.title : null; };
    const cards = [
      ["💼", T("करियर एवं कार्यक्षेत्र", "Career & Work"), [T(`अनुकूल क्षेत्र: ${NUMT(mul, "career")}`, `Suitable fields: ${NUMT(mul, "career")}`), mul !== bh ? T(`भाग्यांक से अतिरिक्त अवसर: ${NUMT(bh, "career")}`, `Extra openings via destiny number: ${NUMT(bh, "career")}`) : ""], consFor("career"), T("नौकरी बनाम व्यवसाय और बदलाव के सटीक वर्ष", "Job vs business and exact change years")],
      ["💰", T("धन एवं बचत", "Money & Savings"), [NUMT(mul, "money"), mul !== bh ? NUMT(bh, "money") : ""], consFor("wealth"), T("धन-वृद्धि व निवेश के अनुकूल वर्ष", "Favourable years for growth and investment")],
      ["🎓", T("शिक्षा एवं बुद्धि", "Education & Intellect"), [T(`विषय-चयन में ${NUMT(mul, "career").split(",")[0]} जैसे क्षेत्र स्वाभाविक रूप से अनुकूल।`, `Fields like ${NUMT(mul, "career").split(",")[0]} come naturally.`), n.missing.includes(3) ? T("अंक 3 अनुपस्थित — पढ़ाई में एकाग्रता हेतु नियमित दिनचर्या रखें।", "3 is missing — keep a regular study routine for focus.") : T("अंक 3 उपस्थित — सीखने की स्वाभाविक क्षमता।", "3 is present — a natural capacity to learn.")], consFor("education"), T("परीक्षा/प्रवेश के प्रबल वर्ष", "Strong exam/admission years")],
      ["💍", T("संबंध एवं विवाह", "Relationships & Marriage"), [NUMT(mul, "love"), T(`अनुकूल साथी के मूलांक: ${n.partner.join(", ")}`, `Compatible partner birth numbers: ${n.partner.join(", ")}`)], consFor("marriage"), T("विवाह का प्रबल समय और कुंडली-मिलान", "Strong marriage timing and matching")],
      ["🌿", T("स्वास्थ्य", "Health"), [NUMT(mul, "health"), mul !== bh ? NUMT(bh, "health") : "", T("(सामान्य संकेत — चिकित्सा सलाह नहीं)", "(General indication — not medical advice)")], consFor("health"), T("स्वास्थ्य के संवेदनशील वर्ष व उपाय", "Sensitive health years and remedies")],
      ["🧭", T("शुभ दिशा एवं समय", "Lucky Direction & Timing"), [T(`शुभ दिशा: ${NUMT(mul, "dir")} • शुभ वार: ${NUMT(mul, "day")}`, `Lucky direction: ${NUMT(mul, "dir")} • lucky day: ${NUMT(mul, "day")}`), T(`महत्वपूर्ण कार्य ${n.lucky.join(", ")} तारीख़ों को शुरू करें।`, `Start important work on dates adding to ${n.lucky.join(", ")}.`)], null, T("मुहूर्त-चयन हेतु व्यक्तिगत परामर्श", "Personal guidance for muhurta selection")]
    ];
    return `
      <p class="lead">${T(`मूलांक ${mul} (${PL_HI[NUM_PLANET[mul]]}) आपकी स्वाभाविक क्षमता और भाग्यांक ${bh} (${PL_HI[NUM_PLANET[bh]]}) जीवन के अवसर दर्शाता है। नीचे दोनों के मेल से हर जीवन-क्षेत्र का मार्गदर्शन है।`, `Birth number ${mul} (${PL_EN[NUM_PLANET[mul]]}) shows your natural ability and destiny number ${bh} (${PL_EN[NUM_PLANET[bh]]}) the openings life brings. Below, both are combined for each area of life.`)}</p>
      <div class="agrid">
        ${cards.map(([icon, title, lines, caut, lock]) => `
          <div class="acard">
            <div class="ah"><span>${icon} ${title}</span></div>
            ${lines.filter(Boolean).map((l) => `<p>${l}</p>`).join("")}
            ${caut ? `<p class="acaut">⚠ ${caut}</p>` : ""}
            <p class="alock">🔒 ${lock}</p>
          </div>`).join("")}
      </div>`;
  }

  // ---------- DOB page D: years ahead ----------
  function pageNumYears(m) {
    const n = m.num;
    const cur = n.years[0];
    const ageIn = (yr) => yr - n.y;
    const rows = n.years.map((x, i) => `<tr${i === 0 ? ' class="curyr"' : ""}><td class="b">${x.yr}${i === 0 ? ` <small>(${T("वर्तमान", "now")})</small>` : ""}</td><td class="c">${ageIn(x.yr)}</td><td class="c b">${x.py}</td><td><b>${T(PY_HI[x.py][0], PY_EN[x.py][0])}</b> — ${T(PY_HI[x.py][1], PY_EN[x.py][1])}</td><td>${toneChip(PY_HI[x.py][2])}</td></tr>`).join("");
    const best = n.years.slice(1).filter((x) => PY_HI[x.py][2] === "good").map((x) => x.yr);
    const careful = n.years.slice(1).filter((x) => PY_HI[x.py][2] === "caution").map((x) => x.yr);
    return `
      <div class="card ${PY_HI[cur.py][2] === "caution" ? "sev2" : (PY_HI[cur.py][2] === "good" ? "okcard" : "neutral")}">
        <div class="ct">${T(`वर्ष ${cur.yr} — व्यक्तिगत वर्ष-अंक ${cur.py}: ${PY_HI[cur.py][0]}`, `${cur.yr} — personal year ${cur.py}: ${PY_EN[cur.py][0]}`)} ${toneChip(PY_HI[cur.py][2])}</div>
        <p>${T(PY_HI[cur.py][1], PY_EN[cur.py][1])}</p>
      </div>
      <div class="h3">${T("आने वाले वर्षों का क्रम", "The years ahead")}</div>
      <table class="tbl"><thead><tr><th>${T("वर्ष", "Year")}</th><th class="c">${T("आयु", "Age")}</th><th class="c">${T("वर्ष-अंक", "Year no.")}</th><th>${T("मुख्य विषय", "Main theme")}</th><th>${T("स्वभाव", "Tone")}</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="two">
        <div class="card okcard"><div class="ct">✦ ${T("आगे के सबसे अनुकूल वर्ष", "Most favourable years ahead")}</div><p>${best.length ? best.join(", ") : T("मिश्रित क्रम — प्रयास से अवसर बनेंगे", "a mixed run — effort will create openings")}</p></div>
        <div class="card sev2"><div class="ct">⚠ ${T("सावधानी के वर्ष", "Years needing care")}</div><p>${careful.length ? careful.join(", ") : T("कोई विशेष नहीं", "none in particular")}</p></div>
      </div>
      <div class="h3">${T(`वर्ष ${cur.yr} — महीने-वार मार्गदर्शन`, `${cur.yr} — month-by-month guide`)}</div>
      <div class="mgrid">${(T(MON_HI, MON_EN)).map((mn, i) => { const pm = reduce9(cur.py + i + 1); const tone = PY_HI[pm][2]; const past = cur.yr === new Date().getFullYear() && i < new Date().getMonth(); return `<div class="mcell t-${tone}${past ? " past" : ""}"><b>${mn}</b><span>${pm} • ${T(PY_HI[pm][0], PY_EN[pm][0])}</span></div>`; }).join("")}</div>
      <div class="lockbox">🔒 ${T("हर वर्ष के महीने-वार शुभ/अशुभ समय और जन्म-समय से विंशोत्तरी दशा — पूर्ण कुंडली में।", "Month-by-month good/difficult periods for each year and the Vimshottari dasha from your birth time — in the full kundali.")}</div>`;
  }

  // ---------- DOB page E: lucky factors + moon/transit ----------
  function pageNumLucky(m) {
    const n = m.num, mul = n.mulank;
    const cells = [
      [T("शुभ अंक", "Lucky numbers"), n.lucky.join(", ")],
      [T("सावधानी के अंक", "Numbers to avoid"), n.avoid.length ? n.avoid.join(", ") : "—"],
      [T("शुभ रंग", "Lucky colours"), NUMT(mul, "color")],
      [T("शुभ वार", "Lucky day"), NUMT(mul, "day")],
      [T("शुभ दिशा", "Lucky direction"), NUMT(mul, "dir")],
      [T("इष्ट देव", "Deity"), NUMT(mul, "deity")],
      [T("अनुकूल साथी/साझेदार", "Compatible partners"), n.partner.join(", ")],
      [T("ग्रह-स्वामी", "Ruling planet"), `${pName(NUM_PLANET[mul])} / ${pName(NUM_PLANET[n.bhagyank])}`]
    ];
    const tr = m.transit;
    let moonCard = "";
    if (m.moonReliable) {
      const ss = tr.sadeSati;
      moonCard = ss.current
        ? `<div class="card sev3"><div class="ct">🪐 ${T(`शनि साढ़ेसाती सक्रिय (चंद्र राशि ${RASHI_HI[m.moonR]})`, `Shani Sade-Sati active (Moon sign ${RASHI_EN[m.moonR]})`)}</div><p>${T(`लगभग ${fmtMY(ss.current.start)} – ${fmtMY(ss.current.end)}। धैर्य, अनुशासन और शनि-शांति के उपाय आवश्यक।`, `Approx. ${fmtMY(ss.current.start)} – ${fmtMY(ss.current.end)}. Patience, discipline and Saturn remedies are needed.`)}</p></div>`
        : `<div class="card okcard"><div class="ct">🪐 ${T(`चंद्र राशि ${RASHI_HI[m.moonR]} — साढ़ेसाती अभी नहीं`, `Moon sign ${RASHI_EN[m.moonR]} — no Sade-Sati now`)}</div><p>${ss.next ? T(`अगली साढ़ेसाती लगभग ${fmtMY(ss.next.start)} से।`, `Next Sade-Sati from approx. ${fmtMY(ss.next.start)}.`) : ""}</p></div>`;
    } else {
      moonCard = `<div class="card verify"><div class="ct">🌙 ${T("चंद्र राशि हेतु जन्म-समय आवश्यक", "Birth time needed for the Moon sign")}</div><p>${T("आपके जन्म-दिन चंद्रमा ने राशि बदली थी, इसलिए साढ़ेसाती का सटीक निर्णय जन्म-समय से ही होगा।", "The Moon changed sign on your birth day, so Sade-Sati can be judged exactly only with your birth time.")}</p></div>`;
    }
    return `
      <div class="grid4">${cells.map(([k, v]) => `<div class="cell"><span>${k}</span><b>${v}</b></div>`).join("")}</div>
      <div class="h3">${T("वर्तमान ग्रह-गोचर का प्रभाव", "Effect of current transits")}</div>
      ${moonCard}
      <div class="card verify">
        <div class="ct">⏳ ${T("जन्म-समय जोड़ने पर आपकी कुंडली में और क्या खुलेगा", "What else unlocks with your birth time")}</div>
        <ul class="bul">${T(["लग्न कुंडली, नवांश व 12 भावों का विश्लेषण", "विंशोत्तरी महादशा-अंतर्दशा की सटीक तिथियाँ", "मांगलिक दोष, राजयोग व धनयोग का निर्णय", "विवाह, करियर व संतान के संभावित वर्ष"], ["Ascendant chart, navamsa and all 12 houses", "Exact Vimshottari dasha dates", "Manglik dosha, Raja and Dhana yogas", "Probable years for marriage, career and children"]).map((x) => `<li>${x}</li>`).join("")}</ul>
        <p>${T("जन्म-समय नहीं पता? जीवन की 3–4 प्रमुख घटनाओं से आचार्य जी जन्म-समय शोधन करते हैं।", "Don't know your birth time? Acharya ji can rectify it from 3–4 major life events.")} <b>WhatsApp: ${esc(OPT.phone)}</b></p>
      </div>`;
  }


  // ==========================================================================
  // 10. PAGE SHELL, CSS & DOCUMENT
  // ==========================================================================
  function shell(m, n, total, title, subtitle, body, isCover) {
    return `
    <section class="page${isCover ? " pcover" : ""}">
      <div class="frame"></div>
      ${isCover ? "" : `
      <header class="ph">
        <div><div class="brand">ज्योतिष तर्क • ${T("जन्म पत्रिका", "Janam Patrika")}</div><div>${esc(m.ctx.name)} • ${m.reportId}</div></div>
        <div class="phr">${T("निःशुल्क परिचय कुंडली", "Free Introductory Kundali")}</div>
      </header>
      <h2 class="pt">${title}</h2>
      ${subtitle ? `<p class="ps">${subtitle}</p>` : ""}`}
      <div class="pb">${body}</div>
      <footer class="pf">
        <div>${T(OPT.acharyaHi, OPT.acharyaEn)} • ${esc(OPT.site)}<br>WhatsApp: ${esc(OPT.phone)}</div>
        <div class="pn">${T("पृष्ठ", "Page")} ${n} / ${total}</div>
        <div class="qr">${OPT.qrData ? `<img src="${OPT.qrData}" alt="QR">` : ""}<span>${T("गुरु-दक्षिणा हेतु<br>स्कैन करें", "Scan for<br>Guru-Dakshina")}</span></div>
      </footer>
    </section>`;
  }

  const CSS = `
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { background: #d9d2c3; font-family: 'Noto Sans Devanagari', 'Hind', 'Inter', sans-serif; color: #2b1b0f; font-size: 10.2pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: 210mm; height: 297mm; margin: 6mm auto; background: #fffbf2; position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 11mm 12mm 7mm; break-after: page; page-break-after: always; box-shadow: 0 2px 12px rgba(0,0,0,.18); }
  .page:last-child { break-after: auto; page-break-after: auto; }
  @media print { body { background: #fff; } .page { margin: 0; box-shadow: none; } }
  .frame { position: absolute; inset: 5mm; border: 1.6pt solid #8a3412; border-radius: 3mm; pointer-events: none; }
  .frame::after { content: ""; position: absolute; inset: 1.3mm; border: .6pt solid #d4a24c; border-radius: 2mm; }
  .ph { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1pt solid #d4a24c; padding-bottom: 1.5mm; margin-bottom: 2.5mm; font-size: 7.8pt; color: #7a4a1e; position: relative; z-index: 1; }
  .ph .brand { font-family: 'Tiro Devanagari Hindi', serif; font-size: 11pt; color: #7c2d12; }
  .phr { font-weight: 600; color: #9a3412; }
  .pt { font-family: 'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif; font-weight: 400; font-size: 17pt; color: #7c2d12; margin: 0 0 .5mm; line-height: 1.25; position: relative; z-index: 1; }
  .ps { font-size: 8.5pt; color: #9a6a3a; margin: 0 0 2.5mm; position: relative; z-index: 1; }
  .pb { flex: 1; overflow: hidden; position: relative; z-index: 1; }
  .pf { display: flex; align-items: center; justify-content: space-between; border-top: 1pt solid #d4a24c; padding-top: 1.5mm; margin-top: 2mm; font-size: 7.4pt; color: #7a4a1e; height: 18mm; position: relative; z-index: 1; }
  .pf .pn { font-weight: 700; color: #7c2d12; }
  .pf .qr { display: flex; align-items: center; gap: 2mm; text-align: right; font-weight: 600; color: #6b21a8; }
  .pf .qr img { width: 15mm; height: 15mm; border: .6pt solid #d4a24c; border-radius: 1mm; background: #fff; }
  p { margin: 0 0 2mm; }
  small { font-size: .82em; color: #7a5a3a; font-weight: 400; }
  .h3 { font-weight: 700; color: #7c2d12; font-size: 1.078em; margin: 3mm 0 1.8mm; border-left: 3pt solid #c2410c; padding-left: 2mm; }
  .note { font-size: 0.784em; color: #7a5a3a; margin-top: 2mm; }
  .lead { font-size: 0.941em; color: #4a2f17; background: #fdf3e1; border-radius: 2mm; padding: 2mm 3mm; }
  .mono { font-family: 'Inter', monospace; font-size: .92em; }
  .b { font-weight: 700; }
  .c { text-align: center; }
  .small { font-size: 0.833em; color: #5b3a1e; }
  .tbl { width: 100%; border-collapse: collapse; font-size: 0.843em; }
  .tbl th { background: #fbe7c6; color: #7c2d12; text-align: left; padding: 1.3mm 1.6mm; border: .6pt solid #e2c08a; font-weight: 700; }
  .tbl td { padding: 1.2mm 1.6mm; border: .6pt solid #eddcbc; background: #fff; }
  .tbl tbody tr:nth-child(even) td { background: #fffaf0; }
  .tbl .flag { color: #b45309; font-size: .85em; font-weight: 700; }
  .kv { width: 100%; border-collapse: collapse; font-size: 0.941em; margin: 3mm 0; }
  .kv th { width: 34%; text-align: left; color: #92400e; font-weight: 600; padding: 1.4mm 2mm; border-bottom: .6pt dashed #e2c08a; }
  .kv td { padding: 1.4mm 2mm; border-bottom: .6pt dashed #e2c08a; font-weight: 600; }
  .charts2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .charts1 { display: flex; justify-content: center; }
  .charts1 .chart { width: 128mm; }
  .chart { border: 1pt solid #d4a24c; border-radius: 2mm; background: #fff; padding: 1mm; }
  .chart svg { width: 100% !important; max-width: none !important; height: auto !important; display: block; }
  .nochart { padding: 20mm; text-align: center; color: #999; }
  .bul { margin: 0 0 2mm; padding-left: 5mm; } .bul li { margin-bottom: 1.6mm; }
  .warnline { background: #fff1e6; border-left: 3pt solid #c2410c; padding: 2mm 3mm; border-radius: 1.5mm; font-size: 0.902em; }
  .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; }
  .cell { background: #fff; border: .6pt solid #e2c08a; border-radius: 1.5mm; padding: 1.5mm 2mm; }
  .cell span { display: block; font-size: 0.725em; color: #92400e; font-weight: 600; }
  .cell b { font-size: 0.922em; }
  .card { border-radius: 2mm; padding: 2.4mm 3mm; margin-bottom: 2.6mm; border: .7pt solid #e2c08a; border-left-width: 3pt; background: #fff; }
  .card .ct { font-weight: 700; color: #3b1f0b; margin-bottom: 1mm; font-size: 0.980em; }
  .card p { margin: 0 0 1mm; font-size: 0.912em; }
  .card .basis { font-size: 0.814em; color: #6b4a2a; }
  .sev3 { border-color: #f1b4b4; border-left-color: #b91c1c; background: #fff5f5; }
  .sev2 { border-color: #f6d0a8; border-left-color: #c2410c; background: #fff8f0; }
  .sev1 { border-color: #f2df9c; border-left-color: #a16207; background: #fffcef; }
  .okcard { border-color: #b9e3c6; border-left-color: #15803d; background: #f3fbf5; }
  .neutral { border-left-color: #7c2d12; }
  .verify { border-color: #d8c3f0; border-left-color: #6b21a8; background: #faf5ff; }
  .sev { display: inline-block; font-size: 7.4pt; font-weight: 700; padding: .3mm 1.6mm; border-radius: 3mm; background: #7c2d12; color: #fff; margin-right: 1mm; vertical-align: middle; }
  .sev3 .sev { background: #b91c1c; } .sev2 .sev { background: #c2410c; } .sev1 .sev { background: #a16207; }
  .chip { display: inline-block; font-size: 7.6pt; font-weight: 700; padding: .3mm 2mm; border-radius: 3mm; vertical-align: middle; margin-left: 1mm; }
  .chip-good { background: #dcfce7; color: #166534; } .chip-mixed { background: #fef3c7; color: #92400e; } .chip-caution { background: #fee2e2; color: #991b1b; }
  .segs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5mm; margin: 1.5mm 0 2mm; }
  .seg { border: .6pt solid #e2c08a; border-radius: 1.5mm; padding: 1.4mm 2mm; background: #fff; font-size: 0.824em; }
  .seg b { display: block; color: #7c2d12; } .seg.on { background: #b91c1c; border-color: #b91c1c; color: #fff; } .seg.on b { color: #fff; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-top: 2mm; }
  .lockbox { margin-top: 2.5mm; background: #f5edff; border: .7pt dashed #8b5cf6; border-radius: 2mm; padding: 2mm 3mm; font-size: 0.882em; color: #5b21b6; font-weight: 600; }
  .ygrid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4mm; }
  .ycard { background: #fff; border: .7pt solid #e2c08a; border-top: 2.4pt solid #d97706; border-radius: 2mm; padding: 2mm 2.6mm; }
  .ycard b { color: #7c2d12; font-size: 0.931em; } .ycard p { margin: 1mm 0 0; font-size: 0.863em; }
  .agrid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; }
  .acard { background: #fff; border: .7pt solid #e2c08a; border-radius: 2mm; padding: 2.4mm 3mm; display: flex; flex-direction: column; }
  .acard .ah { display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #7c2d12; font-size: 1.000em; margin-bottom: 1.4mm; border-bottom: .6pt solid #f1dfba; padding-bottom: 1mm; }
  .acard p { font-size: 0.873em; margin: 0 0 1.2mm; }
  .acaut { color: #9a3412; font-weight: 600; } .alock { color: #6b21a8; font-weight: 600; margin-top: auto !important; }
  .cta { display: flex; gap: 4mm; align-items: center; background: #fff7ed; border: 1pt solid #ea580c; border-radius: 2.5mm; padding: 3mm; margin-top: 2mm; }
  .cta img { width: 30mm; height: 30mm; background: #fff; border: .6pt solid #e2c08a; border-radius: 1.5mm; }
  .cta b { color: #9a3412; font-size: 1.020em; } .cta p { font-size: 0.882em; margin: 1mm 0 2mm; }
  .btn { display: inline-block; background: #15803d; color: #fff; font-weight: 700; text-decoration: none; padding: 1.4mm 4mm; border-radius: 4mm; font-size: 0.882em; }
  .offer { background: linear-gradient(135deg, #fff7e6, #fdebd0); border: 1pt solid #d97706; border-radius: 2.5mm; padding: 3mm 4mm; margin: 3mm 0; }
  .offer .oh { font-weight: 700; color: #7c2d12; font-size: 1.078em; display: flex; justify-content: space-between; align-items: center; }
  .offer .price { font-size: 14pt; color: #b45309; } .offer s { font-size: 9pt; color: #9a8a7a; }
  .offer ul { list-style: none; padding: 0; margin: 1.5mm 0 0; columns: 2; column-gap: 5mm; font-size: 0.863em; } .offer li { margin-bottom: 1.2mm; break-inside: avoid; }
  .bigqr { display: flex; gap: 5mm; align-items: center; border: 1.2pt solid #7c2d12; border-radius: 3mm; padding: 3.5mm; background: #fff; }
  .bigqr img, .qrph { width: 44mm; height: 44mm; border: .8pt solid #d4a24c; border-radius: 2mm; }
  .qrph { display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 700; color: #7c2d12; }
  .bq1 { font-weight: 700; color: #7c2d12; font-size: 12pt; margin-bottom: 1.5mm; }
  .contact { font-weight: 600; font-size: 0.882em; } .sig { font-family: 'Tiro Devanagari Hindi', serif; font-size: 1.176em; color: #7c2d12; margin-top: 2mm; }
  .mantra { font-family: 'Tiro Devanagari Hindi', serif; color: #7c2d12; font-weight: 600; }
  .disc { font-size: 0.745em; color: #7a5a3a; margin-top: 3mm; border-top: .6pt dashed #e2c08a; padding-top: 1.5mm; }
  .bless { text-align: center; font-family: 'Tiro Devanagari Hindi', serif; color: #7c2d12; font-size: 1.176em; margin-top: 2mm; }
  .pcover .pb { display: flex; }
  .cover { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 2mm; }
  .inv { font-family: 'Tiro Devanagari Hindi', serif; color: #9a3412; font-size: 12pt; }
  .clogo { width: 20mm; height: 20mm; border-radius: 50%; border: 1pt solid #d4a24c; margin: 2mm 0; object-fit: cover; }
  .ctitle { font-family: 'Tiro Devanagari Hindi', serif; font-size: 34pt; color: #7c2d12; line-height: 1.15; }
  .csub { font-size: 10pt; color: #9a6a3a; letter-spacing: .3pt; }
  .orn { color: #d4a24c; margin: 2mm 0; letter-spacing: 3mm; }
  .cname { font-family: 'Tiro Devanagari Hindi', serif; font-size: 26pt; color: #2b1b0f; border-bottom: 1.2pt solid #d4a24c; padding: 0 8mm 1mm; }
  .cakshar { font-size: 10pt; color: #6b4a2a; margin-top: 1.5mm; }
  .trio { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; width: 100%; margin: 4mm 0 1mm; }
  .trio div { background: #fff; border: .8pt solid #d4a24c; border-radius: 2mm; padding: 2.4mm; }
  .trio span { display: block; font-size: 8pt; color: #92400e; font-weight: 600; } .trio b { font-size: 12.5pt; color: #7c2d12; }
  .cover .kv { text-align: left; }
  .cqr { display: flex; gap: 4mm; align-items: center; text-align: left; border: 1pt solid #d4a24c; border-radius: 2.5mm; padding: 3mm; background: #fff; width: 100%; margin-top: auto; }
  .cqr img, .cqr .qrph { width: 30mm; height: 30mm; border-radius: 1.5mm; border: .6pt solid #d4a24c; }
  .cqr b { color: #7c2d12; } .cqr p { font-size: 8.8pt; margin: 1mm 0 0; }
  .cby { font-size: 9pt; color: #6b4a2a; margin: 3mm 0 1mm; }
  .ntiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin-bottom: 3mm; }
  .ntile { background: #fff; border: 1pt solid #d4a24c; border-radius: 2.5mm; padding: 2.5mm; text-align: center; }
  .ntile span { display: block; font-size: .82em; color: #92400e; font-weight: 700; }
  .ntile b { display: block; font-family: 'Tiro Devanagari Hindi', serif; font-size: 2.6em; color: #7c2d12; line-height: 1.1; }
  .ntile b sup { font-size: .35em; color: #9a6a3a; }
  .ntile em { display: block; font-style: normal; font-weight: 700; color: #b45309; }
  .ntile small { display: block; }
  .loshu { display: grid; grid-template-columns: 54mm 1fr; gap: 4mm; align-items: start; }
  .lsg { border-collapse: collapse; width: 54mm; }
  .lsg td { width: 18mm; height: 16mm; border: 1pt solid #d4a24c; text-align: center; font-size: 1.25em; font-weight: 700; letter-spacing: .5mm; }
  .lsg td.has { background: #fdf3e1; color: #7c2d12; } .lsg td.miss { background: #fff; color: #d6c2a0; }
  .ok { color: #15803d; } .bad { color: #b91c1c; }
  .curyr td { background: #fff3d6 !important; font-weight: 600; }
  .mgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6mm; }
  .mcell { border: .6pt solid #e2c08a; border-radius: 1.5mm; padding: 1.2mm 2mm; background: #fff; border-left-width: 2.4pt; }
  .mcell b { display: block; color: #7c2d12; font-size: .9em; } .mcell span { font-size: .8em; }
  .mcell.t-good { border-left-color: #15803d; background: #f3fbf5; } .mcell.t-mixed { border-left-color: #d97706; } .mcell.t-caution { border-left-color: #b91c1c; background: #fff5f5; }
  .mcell.past { opacity: .55; }
  .csum { width: 100%; text-align: left; background: #fdf3e1; border-radius: 2mm; padding: 2.5mm 3.5mm; font-size: 10pt; margin: 1mm 0 3mm; }
  `;

  // Shrinks a page body's text (never charts) until it fits its fixed A4 slot.
  const FIT_SCRIPT = `
  (function () {
    // Grow text on sparse pages, shrink on dense ones, so every A4 page is
    // well filled and nothing ever spills onto the next sheet.
    function fits(b) { return b.scrollHeight <= b.clientHeight + 1; }
    function fit() {
      document.querySelectorAll('.pb').forEach(function (b) {
        var fs = 10.2;
        b.style.fontSize = fs + 'pt';
        while (fits(b) && fs < 14.6) { fs += 0.2; b.style.fontSize = fs.toFixed(1) + 'pt'; }
        while (!fits(b) && fs > 7.6) { fs -= 0.2; b.style.fontSize = fs.toFixed(1) + 'pt'; }
        if (!fits(b)) b.setAttribute('data-overflow', '1');
      });
      window.__JT_FIT_DONE = true;
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(fit, 60); });
    else window.addEventListener('load', fit);
  })();`;

  function buildHtml(ctx, vd, opts) {
    LANG = ctx.lang === "en" ? "en" : "hi";
    OPT = { ...DEFAULTS, ...(opts || {}) };
    const m = buildModel(ctx, vd);

    const pages = [];
    pages.push({ cover: true, body: pageCover(m) });
    if (!m.full) {
      // No birth time: no charts at all — a birth-date (Ank Jyotish) reading instead.
      pages.push({ title: T("आपके जन्म-अंक", "Your Birth Numbers"), sub: T("जन्म-तिथि और नाम से निकले मूल अंक तथा अंक-चक्र", "Core numbers from your birth date and name, with the number grid"), body: pageNumbers(m) });
      pages.push({ title: T("आपका व्यक्तित्व एवं स्वभाव", "Your Personality & Temperament"), sub: T("मूलांक और भाग्यांक के ग्रह-स्वामियों के आधार पर", "Based on the ruling planets of your birth and destiny numbers"), body: pageNumPersonality(m) });
      pages.push({ title: T("जीवन-क्षेत्र मार्गदर्शन", "Life-Area Guidance"), sub: T("करियर, धन, शिक्षा, विवाह व स्वास्थ्य", "Career, money, education, marriage and health"), body: pageNumAreas(m) });
      pages.push({ title: T("आने वाले वर्ष", "The Years Ahead"), sub: T("व्यक्तिगत वर्ष-अंक के अनुसार हर वर्ष का मुख्य विषय", "The main theme of each year by your personal year number"), body: pageNumYears(m) });
      pages.push({ title: T("शुभ तत्व एवं वर्तमान गोचर", "Lucky Factors & Current Transits"), sub: "", body: pageNumLucky(m) });
      pages.push({ title: T("जीवन के संवेदनशील बिंदु", "Sensitive Points in Your Life"), sub: T("जिन पर समय रहते ध्यान और उपाय आवश्यक है", "Points that need attention and remedies in time"), body: pageCons(m) });
      pages.push({ title: T("उपाय, पूर्ण कुंडली एवं गुरु-दक्षिणा", "Remedies, Full Kundali & Guru-Dakshina"), sub: "", body: pageClose(m) });
    } else {
    pages.push({ title: m.full ? T("लग्न कुंडली, चंद्र कुंडली एवं ग्रह स्पष्ट", "Lagna Chart, Chandra Chart & Planetary Positions") : T("चंद्र कुंडली एवं ग्रह स्पष्ट", "Chandra Chart & Planetary Positions"),
      sub: m.full ? T("जन्म-क्षण के ग्रहों की सटीक स्थिति (VSOP87 खगोलीय गणना)", "Exact planetary positions at birth (VSOP87 astronomy)") : T("जन्म-दिवस (दोपहर 12 बजे) के ग्रह — लग्न हेतु जन्म-समय आवश्यक", "Planets for the birth date (12:00 noon) — the Ascendant needs the birth time"),
      body: pageCharts(m) });
    if (m.full) pages.push({ title: T("नवांश कुंडली (D9)", "Navamsa Chart (D9)"), sub: T("विवाह, धर्म और ग्रहों का आंतरिक बल", "Marriage, dharma and the inner strength of planets"), body: pageNavamsa(m) });
    pages.push({ title: T("पंचांग, अवकहड़ा चक्र एवं वर्तमान गोचर", "Panchang, Avakahada & Current Transits"), sub: "", body: pagePanchang(m) });
    pages.push({ title: T("आपका व्यक्तित्व एवं स्वभाव", "Your Personality & Temperament"), sub: T("लग्न, चंद्रमा और आत्मकारक के आधार पर", "Based on the Ascendant, Moon and Atmakaraka"), body: pagePersonality(m) });
    pages.push({ title: T("शुभ योग एवं ग्रह-बल", "Auspicious Yogas & Planetary Strength"), sub: T("आपकी कुंडली की प्रमुख शक्तियाँ", "The main strengths in your chart"), body: pageYogas(m) });
    pages.push({ title: m.dasha ? T("वर्तमान दशा एवं आगामी वर्ष", "Current Dasha & the Years Ahead") : T("दशा — जन्म-समय से खुलेगी", "Dasha — unlocks with birth time"), sub: m.dasha ? T("विंशोत्तरी दशा (365.25 दिवसीय वर्ष)", "Vimshottari dasha (365.25-day year)") : "", body: pageDasha(m) });
    if (m.full) pages.push({ title: T("जीवन-क्षेत्र झलक", "Life-Area Snapshot"), sub: T("शिक्षा, करियर, धन, विवाह, संतान व स्वास्थ्य", "Education, career, wealth, marriage, children and health"), body: pageAreas(m) });
    pages.push({ title: T("कुंडली के संवेदनशील बिंदु एवं दोष", "Sensitive Points & Doshas in Your Chart"), sub: T("जिन पर समय रहते ध्यान और उपाय आवश्यक है", "Points that need attention and remedies in time"), body: pageCons(m) });
    pages.push({ title: T("उपाय, पूर्ण कुंडली एवं गुरु-दक्षिणा", "Remedies, Full Kundali & Guru-Dakshina"), sub: "", body: pageClose(m) });
    }

    const total = pages.length;
    const html = pages.map((p, i) => shell(m, i + 1, total, p.title, p.sub, p.body, p.cover)).join("");

    return `<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(`JyotishTark_Kundali_${(ctx.name || "Seeker").replace(/\s+/g, "_")}_${m.reportId}`)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Tiro+Devanagari+Hindi&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${html}
<script>${FIT_SCRIPT}<\/script>
</body>
</html>`;
  }

  // ==========================================================================
  // 11. ASSETS (QR / LOGO → DATA URI SO THE SERVER PDF NEVER LOSES THEM)
  // ==========================================================================
  async function toDataUrl(src) {
    if (!src) return null;
    if (/^data:/.test(src)) return src;
    try {
      const res = await fetch(src, { cache: "force-cache" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => resolve(null);
        r.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  }

  async function buildDocument(ctx, vd, opts) {
    const o = { ...DEFAULTS, ...(opts || {}) };
    o.qrData = o.qrData || await toDataUrl(o.qrSrc);
    o.logoData = o.logoData || await toDataUrl(o.logoSrc);
    return buildHtml(ctx, vd, o);
  }

  window.FreeReport = {
    buildDocument,
    buildHtml,
    _internal: { buildModel, detectPositiveYogas, detectSensitivePoints, computeTransits }
  };
})();
