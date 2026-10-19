/**
 * ============================================================================
 * JYOTISH TARK — VIRAL VEDIC-TAROT & NUMEROLOGY FUSION ENGINE
 * File: tarot-engine.js  •  v4.0 (78-Card Bilingual Edition: English & हिंदी)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Features:
 * - Full 78-Card Deck (22 Major Arcana + 56 Minor Arcana across 4 Suits)
 * - Upright (सीधा) & Reversed (उल्टा) Polarity Calibration
 * - 5 Viral Spread Modes: Yes/No + Timing, Partner's Secret Feelings,
 *   Career/Money Breakthrough, Aura/Evil Eye Scan, & Past-Present-Future
 * - Vedic Graha + Chaldean Name + DOB Mulank/Bhagyank Synthesis
 * - Built-in Conversion Funnel to kundali-form.html & WhatsApp (+91 8318513814)
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. CHALDEAN & NUMEROLOGY HELPERS
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

  const MULANK_PLANETS = {
    1: { planetEn: "Sun (Surya)",     planetHi: "सूर्य (Sun)",     traitEn: "royal self-respect and leadership drive",      traitHi: "राजसी स्वाभिमान और नेतृत्व क्षमता" },
    2: { planetEn: "Moon (Chandra)",  planetHi: "चंद्रमा (Moon)",  traitEn: "deep emotional radar and intuitive sensitivity", traitHi: "गहरी भावनात्मक संवेदनशीलता और अंतर्ज्ञान" },
    3: { planetEn: "Jupiter (Guru)",  planetHi: "बृहस्पति (Guru)", traitEn: "dharmic wisdom and ambitious expansion",        traitHi: "सात्विक ज्ञान, स्वाभिमान और उच्च महत्वाकांक्षा" },
    4: { planetEn: "Rahu",            planetHi: "राहु (Rahu)",     traitEn: "unconventional thinking and sudden turns",      traitHi: "लीक से हटकर सोच और आकस्मिक परिवर्तन" },
    5: { planetEn: "Mercury (Budh)",  planetHi: "बुध (Mercury)",   traitEn: "rapid analytical calculation and adaptability", traitHi: "तीव्र तार्किक बुद्धि और तुरंत निर्णय क्षमता" },
    6: { planetEn: "Venus (Shukra)",  planetHi: "शुक्र (Venus)",   traitEn: "magnetic charm and deep romantic devotion",     traitHi: "चुंबकीय आकर्षण, प्रेम और समर्पण" },
    7: { planetEn: "Ketu",            planetHi: "केतु (Ketu)",     traitEn: "prophetic intuition and spiritual depth",       traitHi: "तीव्र सिक्स्थ सेंस (पूर्वाभास) और गूढ़ खोजी स्वभाव" },
    8: { planetEn: "Saturn (Shani)",  planetHi: "शनि (Saturn)",    traitEn: "relentless karmic endurance and justice",       traitHi: "संघर्ष की भट्टी में तपकर स्थायी साम्राज्य बनाने की शक्ति" },
    9: { planetEn: "Mars (Mangal)",   planetHi: "मंगल (Mars)",     traitEn: "fearless warrior courage and decisive fire",    traitHi: "अदम्य साहस, स्पष्टवादिता और अटूट संकल्प" }
  };

  function reduceSingle(n) {
    let v = Math.abs(parseInt(n, 10) || 0);
    while (v > 9) {
      v = String(v).split("").reduce((a, b) => a + parseInt(b, 10), 0);
    }
    return v === 0 ? 1 : v;
  }

  function getUserNumerology(nameStr, dobStr) {
    const cleanName = (nameStr || "Seeker").toUpperCase().replace(/[^A-Z]/g, "");
    let nameCompound = 0;
    for (let i = 0; i < cleanName.length; i++) {
      nameCompound += CHALDEAN_MAP[cleanName[i]] || 1;
    }
    if (nameCompound === 0) nameCompound = 14;
    const nameNumber = reduceSingle(nameCompound);

    if (!dobStr) {
      return { hasDob: false, mulank: nameNumber, bhagyank: reduceSingle(nameNumber + 3), nameCompound, nameNumber };
    }

    const parts = dobStr.split("-");
    const day = parseInt(parts[2], 10) || 1;
    const mulank = reduceSingle(day);
    const digits = dobStr.replace(/\D/g, "");
    const rawSum = digits.split("").reduce((a, b) => a + parseInt(b, 10), 0);
    const bhagyank = reduceSingle(rawSum);

    return { hasDob: true, mulank, bhagyank, nameCompound, nameNumber };
  }

  // ==========================================================================
  // 2. SPREAD MODES CONFIGURATION (5 VIRAL READING MODES)
  // ==========================================================================

  const SPREAD_MODES = {
    yesno: {
      id: "yesno",
      titleEn: "⚡ Yes / No + Exact Timing Oracle",
      titleHi: "⚡ हाँ / ना एवं सटीक समय भविष्यवाणी (Yes/No Oracle)",
      subtitleEn: "Calculates your cosmic probability score (0–100%), hidden condition, and exact manifestation window.",
      subtitleHi: "आपके प्रश्न की सफलता का प्रतिशत (0–100%), गुप्त शर्त और कार्य पूर्ण होने का सटीक समय।",
      positions: [
        { en: "1. Root Energy Behind Your Question",   hi: "1. आपके प्रश्न के पीछे की मूल ऊर्जा" },
        { en: "2. Hidden Karmic Condition / Obstacle", hi: "2. गुप्त शर्त या अनदेखी बाधा" },
        { en: "3. Final Verdict & Timing Trigger",     hi: "3. अंतिम निर्णय एवं समय संकेत" }
      ]
    },
    feelings: {
      id: "feelings",
      titleEn: "❤️ Their Unspoken Feelings & Next Move",
      titleHi: "❤️ उनके दिल की अनकही भावनाएं और अगला कदम",
      subtitleEn: "Decodes what is running inside your partner/crush's mind at night, what stops them, and their upcoming action.",
      subtitleHi: "जानिए आपके पार्टनर/क्रश रात को आपके बारे में क्या सोचते हैं, उन्हें क्या रोक रहा है और उनका अगला कदम क्या होगा।",
      positions: [
        { en: "1. Their Secret 2 AM Thoughts About You", hi: "1. आपके प्रति उनके दिल के गहरे (अनकहे) विचार" },
        { en: "2. What Is Blocking or Scaring Them",     hi: "2. उन्हें आपकी ओर बढ़ने से क्या रोक रहा है?" },
        { en: "3. Their Upcoming Move & Future Bond",    hi: "3. आपकी ओर उनका अगला कदम और भविष्य" }
      ]
    },
    career: {
      id: "career",
      titleEn: "💼 Career, Exam & Money Breakthrough",
      titleHi: "💼 करियर, परीक्षा एवं धन-प्रवाह विश्लेषण",
      subtitleEn: "Pinpoints your current career/money leak, active planetary test, and incoming financial breakthrough.",
      subtitleHi: "आपके करियर व धन में आ रही रुकावट, वर्तमान कर्म-परीक्षा और आगामी बड़ी सफलता का संकेत।",
      positions: [
        { en: "1. Hidden Drain on Your Focus / Money",   hi: "1. आपकी एकाग्रता व धन को रोकने वाला कारण" },
        { en: "2. Your Present Professional / Exam Test",hi: "2. वर्तमान समय की मुख्य कर्म-परीक्षा" },
        { en: "3. Incoming Career & Wealth Breakthrough",hi: "3. आगामी आर्थिक व करियर उछाल" }
      ]
    },
    evileye: {
      id: "evileye",
      titleEn: "🧿 Aura Block, Jealousy & Evil Eye Scan",
      titleHi: "🧿 बुरी नज़र, गुप्त शत्रु एवं ऑरा (Aura) परीक्षण",
      subtitleEn: "Reveals whether unseen jealousy, negative frequency, or a sleeping planet is draining your luck and peace.",
      subtitleHi: "जानिए क्या किसी की ईर्ष्या (बुरी नज़र), नकारात्मक ऊर्जा या सुप्त ग्रह आपकी तरक्की और शांति को बांध रहा है।",
      positions: [
        { en: "1. Source of Negative Frequency / Jealousy", hi: "1. नकारात्मक ऊर्जा या गुप्त ईर्ष्या का स्रोत" },
        { en: "2. How It Is Affecting Your Mind & Luck",    hi: "2. आपके मन, स्वास्थ्य व भाग्य पर इसका प्रभाव" },
        { en: "3. Your Cosmic Protection & Release Key",    hi: "3. ऊर्जा शुद्धि एवं सुरक्षा कवच का संकेत" }
      ]
    },
    destiny: {
      id: "destiny",
      titleEn: "🌌 Past, Present & Future Destiny Spread",
      titleHi: "🌌 भूत, वर्तमान एवं भविष्य की संपूर्ण नियति रीडिंग",
      subtitleEn: "A deep three-pillar timeline of the karmic past shaping you, your current crossroads, and your approaching destiny.",
      subtitleHi: "आपके अतीत के कर्म-प्रभाव, वर्तमान के निर्णायक मोड़ और आने वाले भविष्य का संपूर्ण चित्रण।",
      positions: [
        { en: "1. Past Karmic Foundation",        hi: "1. अतीत का कर्म-आधार (Past Influence)" },
        { en: "2. Present Crossroads & Reality",  hi: "2. वर्तमान परिस्थिति एवं परीक्षा (Present)" },
        { en: "3. Approaching Destiny Outcome",   hi: "3. आगामी भविष्य एवं परिणाम (Future)" }
      ]
    }
  };

  // ==========================================================================
  // 3. 22 MAJOR ARCANA MASTER DATABASE (WITH VEDIC GRAHA & TIMING)
  // ==========================================================================

  const MAJOR_ARCANA = [
    {
      id: "maj_0", arcana: "Major", numeral: "0",
      nameEn: "The Fool", nameHi: "द फूल (The Fool — शून्य से नई शुरुआत)",
      icon: "fa-feather-alt", element: "Air", grahaEn: "Rahu / Uranus (Vayu)", grahaHi: "राहु एवं वायु तत्व",
      yesNoWeight: 78, verdictEn: "YES — Take the Leap", verdictHi: "हाँ — निडर होकर कदम बढ़ाएं",
      timingEn: "Within 11 to 21 Days (Sudden Unplanned Shift)", timingHi: "11 से 21 दिनों के भीतर (अचानक नया मोड़)",
      uprightEn: "A fearless new beginning is knocking at your door. The universe is asking you to drop over-calculation and trust the unknown path.",
      uprightHi: "एक बिल्कुल नई और अप्रत्याशित शुरुआत आपके द्वार पर है। ब्रह्मांड संकेत दे रहा है कि अत्यधिक डर छोड़कर नए अवसर पर भरोसा करें।",
      reversedEn: "Reckless haste or fear of looking foolish is holding you back. Do not jump blindly without checking the ground beneath your feet.",
      reversedHi: "बिना सोचे-समझे जल्दबाजी करना या समाज के डर से कदम रोकना आपको नुकसान दे सकता है। भावनाओं में बहकर अंधा भरोसा न करें।",
      feelingsEn: "They feel a magnetic, carefree excitement around you and want a fresh start without heavy past baggage, though their mind is still slightly unpredictable.",
      feelingsHi: "वे आपके प्रति एक नया, निश्छल आकर्षण महसूस करते हैं और पुरानी कड़वाहट भूलकर नई शुरुआत करना चाहते हैं, पर अभी उनके मन में स्थिरता की कमी है।",
      careerEn: "An unconventional career switch, startup idea, or new skill outside your routine path holds massive hidden potential right now.",
      careerHi: "लीक से हटकर कोई नया प्रोजेक्ट, करियर बदलाव या नया कौशल आपके लिए बड़ा दरवाजा खोलने वाला है।",
      evilEyeEn: "Your open-hearted nature makes you overshare your plans too early—allowing envious people's gaze to jinx your beginnings.",
      evilEyeHi: "आप उत्साह में आकर अपनी योजनाएं समय से पहले लोगों को बता देते हैं, जिससे दूसरों की ईर्ष्या आपके शुरुआती काम में टोक लगा देती है।"
    },
    {
      id: "maj_1", arcana: "Major", numeral: "I",
      nameEn: "The Magician", nameHi: "द मैजिशियन (The Magician — संकल्प सिद्धि)",
      icon: "fa-wand-magic-sparkles", element: "Air", grahaEn: "Mercury (Budh — Vak Siddhi)", grahaHi: "बुध (बुद्धि एवं वाक्-सिद्धि)",
      yesNoWeight: 94, verdictEn: "STRONG YES — Manifestation Active", verdictHi: "प्रबल हाँ — संकल्प सिद्धि का समय",
      timingEn: "Within 1 to 3 Weeks (Immediate Momentum)", timingHi: "1 से 3 सप्ताह के भीतर (तीव्र गति)",
      uprightEn: "You hold all four elements of manifestation in your hands right now. Your intellect, speech, and timing can turn this desire into reality.",
      uprightHi: "इस समय चारों तत्व आपके पक्ष में हैं। आपकी बुद्धि, संवाद-कौशल और सही रणनीति असंभव दिखने वाले कार्य को भी संभव बना देगी।",
      reversedEn: "Watch out for manipulation, sweet-talking illusions, or scattering your own talent across too many unfinished tasks.",
      reversedHi: "सावधान रहें—कोई व्यक्ति मीठे शब्दों का जाल बुनकर आपको भ्रमित कर सकता है, अथवा आपकी अपनी ऊर्जा कई दिशाओं में बिखर रही है।",
      feelingsEn: "They are deeply magnetized by your intelligence and presence. They are actively strategizing how to communicate with you and win your attention.",
      feelingsHi: "वे आपकी बुद्धि और व्यक्तित्व से गहराई से प्रभावित हैं और आपसे संपर्क साधने या आपके करीब आने की सचेत योजना बना रहे हैं।",
      careerEn: "Peak manifestation phase for interviews, exams, pitches, and independent initiatives. Your skill will outshine competitors.",
      careerHi: "परीक्षा, इंटरव्यू, व्यापारिक डील और नई पहल के लिए सर्वोच्च कार्ड। आपका कौशल विरोधियों को पीछे छोड़ देगा।",
      evilEyeEn: "Someone in your peer circle admires your talent to your face while secretly trying to copy or manipulate your strategy behind your back.",
      evilEyeHi: "आपके कार्यक्षेत्र या मित्र-मंडल का कोई व्यक्ति सामने आपकी प्रशंसा करता है, पर पीठ पीछे आपकी रणनीति की नकल या चालाकी कर रहा है।"
    },
    {
      id: "maj_2", arcana: "Major", numeral: "II",
      nameEn: "The High Priestess", nameHi: "द हाई प्रीस्टेस (अंतर्ज्ञान एवं गुप्त रहस्य)",
      icon: "fa-moon", element: "Water", grahaEn: "Moon & Ketu (Intuition)", grahaHi: "चंद्र एवं केतु (गूढ़ अंतर्ज्ञान)",
      yesNoWeight: 58, verdictEn: "WAIT — Hidden Truth Yet to Surface", verdictHi: "प्रतीक्षा करें — अभी एक गुप्त सच सामने आना बाकी है",
      timingEn: "Around the Next Full/New Moon (2 to 4 Weeks)", timingHi: "आगामी पूर्णिमा/अमावस्या तक (2 से 4 सप्ताह)",
      uprightEn: "More is happening behind the curtain than on the stage. Trust your 2 AM gut instinct and dreams—keep your next move completely silent.",
      uprightHi: "पर्दे के पीछे बहुत कुछ ऐसा चल रहा है जो अभी आपकी आंखों के सामने नहीं है। अपनी अंतरात्मा (सिक्स्थ सेंस) की आवाज सुनें और अपनी योजनाएं गुप्त रखें।",
      reversedEn: "You are ignoring your own intuition and letting anxiety or surface appearances fool you. Secret agendas are active around you.",
      reversedHi: "आप अपने ही अंतर्ज्ञान की अनदेखी कर रहे हैं। सतही बातों पर भरोसा न करें, क्योंकि कोई बात आपसे छिपाई जा रही है।",
      feelingsEn: "Their feelings for you are intense, silent, and locked deep inside. They watch you quietly from a distance but fear exposing their vulnerability.",
      feelingsHi: "आपके प्रति उनकी भावनाएं अत्यंत गहरी पर मौन हैं। वे दूर से आपको नोटिस करते हैं, पर अपनी भावनाएं खुलकर व्यक्त करने से डरते हैं।",
      careerEn: "Do not announce your career or exam move until it is signed and sealed. Research, medical/technical study, and confidential planning succeed now.",
      careerHi: "जब तक काम पूरा न हो जाए, उसका ढिंढोरा न पीटें। गहन अध्ययन, शोध और गोपनीय तैयारी से बड़ी सफलता मिलेगी।",
      evilEyeEn: "Your psychic sponge is absorbing heavy subconscious negativity or someone's silent envy—causing vivid dreams and sudden fatigue.",
      evilEyeHi: "आपका संवेदनशील ऑरा किसी की मौन ईर्ष्या या नकारात्मक तरंग को सोख रहा है, जिससे अकारण थकान या बेचैन करने वाले स्वप्न आ रहे हैं।"
    },
    {
      id: "maj_3", arcana: "Major", numeral: "III",
      nameEn: "The Empress", nameHi: "द एम्प्रेस (शुक्र वैभव एवं समृद्धि)",
      icon: "fa-crown", element: "Earth", grahaEn: "Venus (Shukra — Mahalakshmi Yoga)", grahaHi: "शुक्र (वैभव, प्रेम एवं आकर्षण)",
      yesNoWeight: 92, verdictEn: "YES — Abundance & Growth", verdictHi: "हाँ — सुख, समृद्धि एवं सकारात्मक वृद्धि",
      timingEn: "Within 3 to 6 Weeks (Fertile Blossoming)", timingHi: "3 से 6 सप्ताह के भीतर (शुभ फल की प्राप्ति)",
      uprightEn: "Venusian grace surrounds you. Creativity, financial comfort, emotional warmth, and magnetic attraction are blooming in your favor.",
      uprightHi: "शुक्र की शुभ ऊर्जा आपके साथ है। प्रेम, आर्थिक समृद्धि, आकर्षण और सृजनात्मक कार्यों में उन्नति का अत्यंत शुभ समय है।",
      reversedEn: "Emotional over-giving, creative block, or neglecting your own self-worth while nurturing everyone else is draining your glow.",
      reversedHi: "दूसरों की परवाह में स्वयं की उपेक्षा करना या भावनात्मक रूप से जरूरत से ज्यादा निर्भर होना आपकी ऊर्जा को कम कर रहा है।",
      feelingsEn: "They see you as deeply attractive, nurturing, and high-value—someone worthy of long-term love, care, and emotional devotion.",
      feelingsHi: "वे आपको अत्यंत आकर्षक, सौम्य और जीवनसाथी के रूप में एक आदर्श व उच्च-मूल्य (high-value) इंसान के रूप में देखते हैं।",
      careerEn: "Prosperous expansion, luxury/creative/medical/advisory growth, and steady cash inflow are strongly supported.",
      careerHi: "धन-प्रवाह में वृद्धि, प्रतिष्ठा और कार्यक्षेत्र में सुखद विस्तार के प्रबल योग बने हुए हैं।",
      evilEyeEn: "Your natural charm, lifestyle, or relationship aura attracts 'Nazar' (envy) from someone who feels insecure around your glow.",
      evilEyeHi: "आपके व्यक्तित्व के आकर्षण, सुख या संबंधों पर किसी ऐसे परिचित की नज़र है जो आपके स्तर को देखकर भीतर ही भीतर ईर्ष्या करता है।"
    },
    {
      id: "maj_4", arcana: "Major", numeral: "IV",
      nameEn: "The Emperor", nameHi: "द एम्परर (सत्ता, अनुशासन एवं अधिकार)",
      icon: "fa-chess-king", element: "Fire", grahaEn: "Sun & Mars (Kshatriya Authority)", grahaHi: "सूर्य एवं मंगल (सत्ता व प्रशासन)",
      yesNoWeight: 86, verdictEn: "YES — Through Discipline & Strategy", verdictHi: "हाँ — अनुशासन और ठोस रणनीति से विजय",
      timingEn: "Within 4 Weeks to 2 Months (Structured Build)", timingHi: "4 सप्ताह से 2 माह के भीतर (स्थायी निर्माण)",
      uprightEn: "Step into command. Victory comes not from emotional pleading, but from rock-solid boundaries, structure, and fearless authority.",
      uprightHi: "अपनी कमान स्वयं संभालें। भावुकता के बजाय कड़े अनुशासन, स्पष्ट सीमाओं (boundaries) और नेतृत्व क्षमता से आपको निश्चित विजय मिलेगी।",
      reversedEn: "Stubborn ego clashes, controlling behavior, or conflict with a father/boss figure is creating unnecessary rigidity.",
      reversedHi: "अहंकार का टकराव, जिद्दी स्वभाव या किसी वरिष्ठ/पिता तुल्य व्यक्ति से मतभेद आपके मार्ग में अवरोध पैदा कर रहा है।",
      feelingsEn: "They feel protective and possessive toward you, but their pride and need for control make them hide their softer emotions behind a tough mask.",
      feelingsHi: "वे आपके प्रति सुरक्षात्मक और गंभीर हैं, परंतु उनका स्वाभिमान (ego) उन्हें अपनी कोमल भावनाएं खुलकर दिखाने से रोकता है।",
      careerEn: "Strong indicator for government roles, promotions, management authority, and building an unshakeable professional reputation.",
      careerHi: "सरकारी क्षेत्र, उच्च पद, प्रशासनिक अधिकार और स्थायी करियर निर्माण के लिए यह अत्यंत शक्तिशाली कार्ड है।",
      evilEyeEn: "Your strong aura repels weak negativity, but workplace politics or authority-jealousy requires you to keep your boundaries iron-clad.",
      evilEyeHi: "आपका मजबूत आत्मबल साधारण नकारात्मकता को काट देता है, पर कार्यक्षेत्र में आपके अधिकार से जलने वाले लोगों से सतर्क रहें।"
    },
    {
      id: "maj_5", arcana: "Major", numeral: "V",
      nameEn: "The Hierophant", nameHi: "द हायरोफैंट (गुरु कृपा, परंपरा एवं विवाह)",
      icon: "fa-gopuram", element: "Earth", grahaEn: "Jupiter (Brihaspati — Dharma & Vivaha)", grahaHi: "देवगुरु बृहस्पति (धर्म, शिक्षा एवं विवाह)",
      yesNoWeight: 85, verdictEn: "YES — Blessed by Dharma & Tradition", verdictHi: "हाँ — गुरु कृपा एवं पारंपरिक मार्ग से सफलता",
      timingEn: "Within 1 to 3 Months (Auspicious Guru Window)", timingHi: "1 से 3 माह के भीतर (गुरु के शुभ गोचर में)",
      uprightEn: "Divine wisdom, institutional success, higher education, mentor blessings, or sacred marriage commitment is strongly favored.",
      uprightHi: "देवगुरु बृहस्पति की कृपा से उच्च शिक्षा, संस्थागत सफलता, गुरु के मार्गदर्शन या पवित्र वैवाहिक बंधन के प्रबल योग हैं।",
      reversedEn: "Outdated social pressure, orthodox family interference, or following blind advice without logic is trapping your growth.",
      reversedHi: "समाज के डर, पारिवारिक रूढ़िवादिता या किसी गलत सलाहकार की बातों में आकर आप अपनी असली क्षमता को बांध रहे हैं।",
      feelingsEn: "They view you with deep respect and marriage/long-term potential. Family values and social honor play a huge role in their mind.",
      feelingsHi: "वे आपको अत्यंत सम्मान की दृष्टि से देखते हैं और आपके साथ पवित्र, दीर्घकालिक या वैवाहिक संबंध की कल्पना करते हैं।",
      careerEn: "Excellent for academic exams, medicine, law, banking, teaching, advisory roles, and respected institutional positions.",
      careerHi: "शिक्षा, चिकित्सा, कानून, बैंकिंग, परामर्श और प्रतिष्ठित संस्थानों में सफलता के लिए यह कार्ड वरदान समान है।",
      evilEyeEn: "Jupiter's shield protects you, provided you maintain ethical integrity and complete your spiritual/karmic obligations.",
      evilEyeHi: "गुरु की सात्विक ऊर्जा आपका रक्षा-कवच है—बस अपने धर्म, सत्य और गुरु-परंपरा के प्रति निष्ठा बनाए रखें।"
    },
    {
      id: "maj_6", arcana: "Major", numeral: "VI",
      nameEn: "The Lovers", nameHi: "द लवर्स (आत्मिक मिलन एवं निर्णायक चुनाव)",
      icon: "fa-heart", element: "Air", grahaEn: "Venus & Mercury (Mithuna — Union)", grahaHi: "शुक्र एवं बुध (प्रेम मिलन व निर्णय)",
      yesNoWeight: 90, verdictEn: "YES — Soul Alignment & Choice", verdictHi: "हाँ — आत्मिक जुड़ाव एवं सही चुनाव",
      timingEn: "Within 2 to 6 Weeks", timingHi: "2 से 6 सप्ताह के भीतर",
      uprightEn: "A powerful union of hearts or a defining crossroads where choosing your authentic truth brings deep love and harmony.",
      uprightHi: "दो हृदयों का गहरा आत्मिक जुड़ाव या जीवन का एक ऐसा मोड़ जहाँ अपने दिल की सच्ची आवाज चुनने से प्रेम और सामंजस्य मिलेगा।",
      reversedEn: "Indecision between two paths, third-party interference, or disharmony between words and actions is testing your bond.",
      reversedHi: "दो रास्तों के बीच दुविधा, किसी तीसरे व्यक्ति का हस्तक्षेप या कथनी-करनी का अंतर रिश्ते व निर्णय में तनाव ला रहा है।",
      feelingsEn: "Intense romantic chemistry and soul-level pull! You are constantly on their mind, and they feel an undeniable magnetic bond with you.",
      feelingsHi: "आपके प्रति उनके मन में तीव्र आकर्षण और आत्मिक खिंचाव है। वे आपको अपने दिल के सबसे करीब महसूस करते हैं।",
      careerEn: "A lucrative partnership, contract, or choosing between two career paths—pick the one that aligns with your long-term passion.",
      careerHi: "एक महत्वपूर्ण साझेदारी या दो करियर विकल्पों में से चुनाव का समय—वह मार्ग चुनें जहाँ आपका कौशल और मन दोनों जुड़ें।",
      evilEyeEn: "Relationship envy (Drishti on your bond)—keep your romantic life private from social media and overly curious friends.",
      evilEyeHi: "आपके प्रेम या आपसी सामंजस्य पर बाहरी लोगों की नज़र जल्दी लगती है—अपने निजी पलों को सोशल मीडिया व बाहरी चर्चा से दूर रखें।"
    },
    {
      id: "maj_7", arcana: "Major", numeral: "VII",
      nameEn: "The Chariot", nameHi: "द चैरियट (अजेय विजय रथ एवं गति)",
      icon: "fa-horse-head", element: "Water", grahaEn: "Moon & Mars (Conquest)", grahaHi: "चंद्र एवं मंगल (अर्जुन-समान विजय)",
      yesNoWeight: 91, verdictEn: "STRONG YES — Victory Through Willpower", verdictHi: "प्रबल हाँ — दृढ़ इच्छाशक्ति से निश्चित विजय",
      timingEn: "Fast Movement — Within 7 to 21 Days", timingHi: "तीव्र गति — 7 से 21 दिनों के भीतर",
      uprightEn: "Hold the reins tightly! Despite opposing forces pulling you left and right, single-pointed focus guarantees a triumphant breakthrough.",
      uprightHi: "अपने मन के रथ की लगाम कसकर पकड़ें! विपरीत परिस्थितियों के बावजूद आपकी एकाग्रता और संकल्प शक्ति आपको निश्चित विजय दिलाएगी।",
      reversedEn: "Lack of direction, emotional road-rage, or trying to force something without steering your mind first.",
      reversedHi: "दिशाहीन जल्दबाजी या भावनात्मक आवेग में नियंत्रण खोना आपके बने-बनाए काम की गति को बिगाड़ सकता है।",
      feelingsEn: "Once they make up their mind, they will come toward you with bold, unstoppable momentum—overcoming distance or obstacles.",
      feelingsHi: "वे आपके पास आने के लिए बाधाओं को पार करने का मन बना रहे हैं; जल्द ही उनकी ओर से तेज पहल या संदेश दिख सकता है।",
      careerEn: "Triumph over competitors in exams, promotions, vehicle/travel luck, and rapid career acceleration.",
      careerHi: "प्रतियोगी परीक्षाओं में विजय, प्रमोशन, यात्रा/स्थान परिवर्तन से लाभ और करियर में तेज रफ्तार का संकेत।",
      evilEyeEn: "Competitors are watching your speed with envy, but as long as you don't look sideways at them, they cannot slow your chariot.",
      evilEyeHi: "प्रतिद्वंद्वी आपकी रफ्तार देखकर ईर्ष्या कर रहे हैं, पर जब तक आपका ध्यान केवल अपने लक्ष्य पर है, कोई आपको रोक नहीं सकता।"
    },
    {
      id: "maj_8", arcana: "Major", numeral: "VIII",
      nameEn: "Strength", nameHi: "स्ट्रेंथ (आंतरिक सिंह-बल एवं धैर्य)",
      icon: "fa-shield-heart", element: "Fire", grahaEn: "Sun (Simha — Soul Mastery)", grahaHi: "सूर्य (सिंह राशि — आत्मबल एवं धैर्य)",
      yesNoWeight: 84, verdictEn: "YES — Through Calm Endurance", verdictHi: "हाँ — शांत धैर्य एवं आत्मबल से सफलता",
      timingEn: "Within 1 to 2 Months", timingHi: "1 से 2 माह के भीतर",
      uprightEn: "True power is not loud anger—it is the calm mastery that tames the lion. Your quiet resilience will bend this situation in your favor.",
      uprightHi: "असली शक्ति क्रोध में नहीं, बल्कि उस शांत आत्मबल में है जो सिंह को भी वश में कर लेती है। आपका धैर्य ही आपकी सबसे बड़ी जीत बनेगा।",
      reversedEn: "Self-doubt, emotional exhaustion, or letting temporary frustration make you forget how much you have already survived.",
      reversedHi: "आत्म-संदेह या मानसिक थकान को खुद पर हावी न होने दें। याद रखें कि आप इससे बड़े तूफानों को पार करके यहाँ तक पहुंचे हैं।",
      feelingsEn: "Your grace and loyalty have tamed their guarded heart. They admire your strength deeply, even if they struggle to match it.",
      feelingsHi: "आपके धैर्य और समर्पण ने उनके कठोर दिल को पिघला दिया है। वे मन ही मन आपकी सहनशक्ति का गहरा सम्मान करते हैं।",
      careerEn: "Steady promotion, handling high-pressure responsibilities with composure, and earning deep respect from seniors.",
      careerHi: "कठिन दबाव में भी शांत रहकर नेतृत्व करने से कार्यक्षेत्र में आपका कद और सम्मान दोनों बढ़ेंगे।",
      evilEyeEn: "You have been carrying everyone else's emotional weight, which has fatigued your solar-plexus aura. Reclaim your energy.",
      evilEyeHi: "दूसरों का भावनात्मक बोझ उठाते-उठाते आपकी अपनी सूर्य-ऊर्जा थक गई है। अपनी ऊर्जा को व्यर्थ के लोगों पर खर्च करना बंद करें।"
    },
    {
      id: "maj_9", arcana: "Major", numeral: "IX",
      nameEn: "The Hermit", nameHi: "द हर्मिट (आत्म-मंथन एवं गुप्त ज्ञान)",
      icon: "fa-lantern", element: "Earth", grahaEn: "Saturn & Ketu (Tapasya & Wisdom)", grahaHi: "शनि एवं केतु (एकांत साधना व विवेक)",
      yesNoWeight: 48, verdictEn: "PAUSE — Step Back & Reflect First", verdictHi: "रुकें — पहले शांत आत्म-मंथन आवश्यक है",
      timingEn: "After a 30 to 60 Day Introspection Phase", timingHi: "30 से 60 दिनों के शांत मंथन के पश्चात",
      uprightEn: "Step away from the noise of opinions. The answer you are looking for outside is already glowing inside your own solitude and deep study.",
      uprightHi: "दुनिया के शोर और लोगों की सलाह से थोड़ा पीछे हटें। जिस प्रश्न का उत्तर आप बाहर खोज रहे हैं, वह आपके शांत आत्म-मंथन में मिलेगा।",
      reversedEn: "Isolating yourself out of bitterness, overthinking in loneliness, or refusing wise counsel when you genuinely need a guide.",
      reversedHi: "उदासी में खुद को अकेला कर लेना या सही मार्गदर्शक की सलाह को ठुकराना आपके अकेलेपन को बढ़ा रहा है।",
      feelingsEn: "Right now they are in a shell of solitude—processing their own life stress and evaluating what they truly want before speaking.",
      feelingsHi: "इस समय वे अपने ही जीवन की उलझनों और एकांत में खोए हुए हैं तथा कोई भी कदम उठाने से पहले गहरा विचार कर रहे हैं।",
      careerEn: "Ideal for deep exam preparation, research, coding, writing, medical/technical specialization, and strategic planning behind closed doors.",
      careerHi: "गहन परीक्षा की तैयारी, शोध, विशेषज्ञता और एकांत में बैठकर बड़ी रणनीति बनाने के लिए यह सर्वोत्तम समय है।",
      evilEyeEn: "Solitude is actually protecting you right now—distancing yourself from fake friends is cleansing your aura automatically.",
      evilEyeHi: "आपका एकांत ही इस समय आपका रक्षा-कवच है—दिखावटी मित्रों से बनी दूरी आपके ऑरा को स्वतः शुद्ध कर रही है।"
    },
    {
      id: "maj_10", arcana: "Major", numeral: "X",
      nameEn: "Wheel of Fortune", nameHi: "व्हील ऑफ फॉर्च्यून (भाग्य-चक्र का बड़ा मोड़)",
      icon: "fa-dharmachakra", element: "Fire", grahaEn: "Jupiter & Rahu (Karmic Destiny Turn)", grahaHi: "गुरु एवं राहु (अचानक भाग्योदय चक्र)",
      yesNoWeight: 93, verdictEn: "YES — Destiny Wheel Turning in Your Favor!", verdictHi: "प्रबल हाँ — भाग्य का पहिया आपके पक्ष में घूम रहा है!",
      timingEn: "Sudden Shift Within 10 to 30 Days", timingHi: "10 से 30 दिनों के भीतर आकस्मिक बदलाव",
      uprightEn: "A major karmic cycle is completing! What felt stuck for months is about to rotate rapidly through a destined synchronicity.",
      uprightHi: "कर्म का एक बड़ा चक्र पूरा हो रहा है! जो काम महीनों से रुका हुआ था, वह नियति के एक आकस्मिक संयोग से तेजी से बदलने वाला है।",
      reversedEn: "A temporary dip or repeating the same karmic mistake because you haven't learned the lesson of the previous cycle yet.",
      reversedHi: "पुरानी गलती को दोहराने के कारण समय-चक्र में अस्थायी रुकावट आ रही है—पिछले अनुभव से सबक लेकर अपनी रणनीति बदलें।",
      feelingsEn: "Yours is a fated, past-life connection. Even when circumstances pull you apart, the wheel of destiny keeps bringing you back into each other's orbit.",
      feelingsHi: "आप दोनों का संबंध प्रारब्ध (नियति) से जुड़ा है। परिस्थितियां चाहे कितनी भी बदलें, भाग्य का चक्र फिर से मिलन का संयोग बनाएगा।",
      careerEn: "Unexpected breakthrough, transfer, interview call, or sudden financial windfall orchestrated by destiny.",
      careerHi: "अचानक कोई बड़ा अवसर, प्रमोशन, स्थान परिवर्तन या आर्थिक लाभ आपके करियर की दिशा बदलने वाला है।",
      evilEyeEn: "No human jealousy can stop a planetary Dasha turn when the Wheel of Fortune activates—ride the wave boldly.",
      evilEyeHi: "जब प्रारब्ध का चक्र घूमता है, तब किसी भी विरोधी की ईर्ष्या आपके भाग्योदय को रोक नहीं सकती।"
    },
    {
      id: "maj_11", arcana: "Major", numeral: "XI",
      nameEn: "Justice", nameHi: "जस्टिस (शनि का अटल कर्म-न्याय)",
      icon: "fa-scale-balanced", element: "Air", grahaEn: "Saturn (Exalted in Tula — Karmic Law)", grahaHi: "उच्चस्थ शनि (तुला — निष्पक्ष कर्म-न्याय)",
      yesNoWeight: 80, verdictEn: "YES — Fair Karmic Justice in Your Favor", verdictHi: "हाँ — आपके सत्य और कर्म के पक्ष में न्याय होगा",
      timingEn: "Within 30 to 45 Days (Official / Legal Resolution)", timingHi: "30 से 45 दिनों के भीतर (निर्णायक न्याय)",
      uprightEn: "The scales of Saturn are balancing. If your intentions and effort have been honest, truth, legal/official victory, and fair reward are guaranteed.",
      uprightHi: "शनिदेव का तराजू अब संतुलन कर रहा है। यदि आपकी नीयत और मेहनत सच्ची रही है, तो न्याय, सम्मान और अधिकार आपके पक्ष में ही आएगा।",
      reversedEn: "Unfair treatment, delayed paperwork, or refusing to admit your own part in a relationship or professional imbalance.",
      reversedHi: "कागजी कार्यवाही में विलंब, पक्षपात या रिश्ते में एकतरफा बोझ के कारण असंतुलन बना हुआ है।",
      feelingsEn: "They are weighing the relationship logically and fairly. They want equal reciprocity, truth, and long-term commitment without games.",
      feelingsHi: "वे इस रिश्ते को पूरी गंभीरता और बराबरी के तराजू पर तौल रहे हैं। वे स्पष्टता, सच्चाई और स्थायी निर्णय चाहते हैं।",
      careerEn: "Favorable for competitive exams, legal matters, government verifications, contracts, and clearing your name.",
      careerHi: "प्रतियोगी परीक्षाओं, कानूनी मामलों, सरकारी दस्तावेजों और अनुबंधों (contracts) में न्यायपूर्ण विजय का योग।",
      evilEyeEn: "Anyone who tried to wrong or defame you behind your back is about to face automatic Saturnian karma—do not dirty your hands.",
      evilEyeHi: "जिस किसी ने आपके साथ छल या पीठ पीछे षड्यंत्र किया है, शनि का कर्म-विधान स्वयं उसे उसका फल चखाने जा रहा है।"
    },
    {
      id: "maj_12", arcana: "Major", numeral: "XII",
      nameEn: "The Hanged Man", nameHi: "द हैंग्ड मैन (प्रतीक्षा, त्याग एवं नया दृष्टिकोण)",
      icon: "fa-hourglass-half", element: "Water", grahaEn: "Saturn & Rahu (Karmic Pause)", grahaHi: "शनि एवं जल तत्व (विराम व दृष्टिकोण परिवर्तन)",
      yesNoWeight: 38, verdictEn: "NOT YET — Mandatory Pause & Perspective Shift", verdictHi: "अभी नहीं — थोड़ा धैर्य रखें और नजरिया बदलें",
      timingEn: "Delayed by 6 to 10 Weeks Until Strategy Changes", timingHi: "6 से 10 सप्ताह का विलंब (रणनीति बदलने तक)",
      uprightEn: "This delay is not a punishment—it is a cosmic suspension forcing you to look at your problem upside-down from a completely new angle.",
      uprightHi: "यह रुकावट कोई दंड नहीं है, बल्कि नियति का एक आवश्यक विराम है ताकि आप समस्या को पुराने ढर्रे के बजाय बिल्कुल नए दृष्टिकोण से देखें।",
      reversedEn: "Needless martyrdom—sacrificing your self-respect for someone who isn't changing, or staying stuck in indecision.",
      reversedHi: "ऐसे इंसान या काम के लिए अपना स्वाभिमान और समय बलिदान करना बंद करें जहाँ से कोई प्रतिफल नहीं मिल रहा है।",
      feelingsEn: "They feel stuck in limbo—caught between their feelings for you and external obligations, unable to make a move right now.",
      feelingsHi: "वे इस समय परिस्थितियों में बंधे हुए (त्रिशंकु की तरह) महसूस कर रहे हैं—चाहकर भी तुरंत कोई कदम नहीं उठा पा रहे हैं।",
      careerEn: "Progress feels temporarily frozen. Use this pause to upgrade your skills or rethink your exam/business approach rather than forcing doors.",
      careerHi: "काम की गति अभी धीमी है। जबरदस्ती धक्का लगाने के बजाय अपनी तैयारी और कौशल को तराशने में यह समय लगाएं।",
      evilEyeEn: "Your energy is stagnant because you are emotionally tied to a past disappointment—cut the cord to restart your flow.",
      evilEyeHi: "पुरानी निराशा से चिपके रहने के कारण आपकी ऊर्जा बंध गई है—मानसिक मोह छोड़ते ही रास्ता खुल जाएगा।"
    },
    {
      id: "maj_13", arcana: "Major", numeral: "XIII",
      nameEn: "Death (Rebirth)", nameHi: "डेथ — पुनर्जन्म (पुराने अध्याय का अंत व नया उदय)",
      icon: "fa-phoenix-framework", element: "Water", grahaEn: "Scorpio / Ketu & Saturn (8th House Transformation)", grahaHi: "वृश्चिक / केतु एवं शनि (कायाकल्प व पुनर्जन्म)",
      yesNoWeight: 32, verdictEn: "NO to the Old Way — Total Transformation Required", verdictHi: "पुराने रूप में नहीं — पूर्ण परिवर्तन के बाद नया उदय",
      timingEn: "After a Complete Closure (Within 30 to 60 Days)", timingHi: "पुराना अध्याय समाप्त होने के 30–60 दिनों के भीतर",
      uprightEn: "Do not fear this card! It never means physical harm—it means an expired chapter, toxic pattern, or outdated role is dying so your higher destiny can be born.",
      uprightHi: "इस कार्ड से भयभीत न हों! इसका अर्थ है कि आपके जीवन का एक पुराना, थका हुआ अध्याय अब समाप्त हो रहा है ताकि एक कहीं अधिक शक्तिशाली नया दौर शुरू हो सके।",
      reversedEn: "Clinging desperately to a dead situation, past memory, or expired habit is causing you prolonged emotional pain.",
      reversedHi: "जो बात या परिस्थिति समाप्त हो चुकी है, उसे जबरदस्ती पकड़कर रखने से आप स्वयं अपने नए भाग्योदय को रोक रहे हैं।",
      feelingsEn: "The old version of your dynamic is over. Either the bond undergoes a deep, honest rebirth from scratch, or it clears space for true love.",
      feelingsHi: "रिश्ते का पुराना ढर्रा अब समाप्त हो चुका है। अब या तो अहंकार त्यागकर रिश्ते का बिल्कुल नया पुनर्जन्म होगा, या यह अध्याय आपको मुक्त करेगा।",
      careerEn: "Major career pivot, leaving an unfulfilling environment, or completely reinventing your professional identity.",
      careerHi: "पुराने कार्यक्षेत्र या असफल तरीके को छोड़कर करियर में पूर्ण कायाकल्प (reinvention) का समय।",
      evilEyeEn: "Intense 8th-house Pluto/Ketu purge—your aura is shedding years of accumulated toxic energy and fake connections.",
      evilEyeHi: "आपकी कुंडली का अष्टम भाव सक्रिय होकर आपके जीवन से नकली लोगों और पुरानी नकारात्मक ऊर्जा को जड़ से साफ कर रहा है।"
    },
    {
      id: "maj_14", arcana: "Major", numeral: "XIV",
      nameEn: "Temperance", nameHi: "टेम्परेंस (दिव्य संतुलन एवं धैर्यपूर्ण रसायन)",
      icon: "fa-yin-yang", element: "Fire", grahaEn: "Jupiter (Dhanu — Healing Alchemy)", grahaHi: "बृहस्पति (धनु — दिव्य सामंजस्य व आरोग्य)",
      yesNoWeight: 82, verdictEn: "YES — With Patience & Middle-Path Balance", verdictHi: "हाँ — धैर्य और संतुलित प्रयास से निश्चित सिद्धि",
      timingEn: "Gradual Blossoming Over 4 to 8 Weeks", timingHi: "4 से 8 सप्ताह में क्रमिक और स्थायी सुधार",
      uprightEn: "Divine alchemy is blending two opposite forces in your life. Avoid extremes—steady patience and peaceful moderation will heal the rift.",
      uprightHi: "ईश्वरीय कृपा आपके जीवन की दो विपरीत परिस्थितियों में सुंदर संतुलन बना रही है। उग्रता छोड़ें—शांत और मध्यम मार्ग से हर उलझन सुलझ जाएगी।",
      reversedEn: "Impatience, emotional extremes, or clashing lifestyles are disturbing your inner peace and digestion/nerves.",
      reversedHi: "अधीरता, 'आर या पार' का उग्र स्वभाव और अनियमित दिनचर्या आपके मानसिक व शारीरिक संतुलन को बिगाड़ रही है।",
      feelingsEn: "Deep soulmate healing energy. They want peace, reconciliation, and a calm, harmonious blending of your lives without drama.",
      feelingsHi: "उनके मन में आपके प्रति गहरा सुकून और सुलह (healing) की भावना है। वे बिना किसी विवाद के शांत और स्थायी साथ चाहते हैं।",
      careerEn: "Successful collaboration, combining two skills, steady financial recovery, and harmonious workplace diplomacy.",
      careerHi: "दो कौशलों के संगम, शांत कूटनीति और धैर्यपूर्ण प्रयास से करियर व धन में स्थायी स्थिरता आएगी।",
      evilEyeEn: "Angelic/Guru protection is actively filtering out negative vibrations around you—keep your water intake and meditation steady.",
      evilEyeHi: "गुरु की सात्विक ऊर्जा आपके चारों ओर के नकारात्मक स्पंदनों को शांत कर रही है।"
    },
    {
      id: "maj_15", arcana: "Major", numeral: "XV",
      nameEn: "The Devil", nameHi: "द डेविल (राहु-शनि मायाजाल एवं मोह-बंधन)",
      icon: "fa-link", element: "Earth", grahaEn: "Saturn & Rahu (Makara — Obsession & Bondage)", grahaHi: "शनि एवं राहु (मोह-बंधन, लत एवं मायाजाल)",
      yesNoWeight: 28, verdictEn: "WARNING — Toxic Attachment or Hidden Trap!", verdictHi: "सावधान — मोह-बंधन या गुप्त जाल से बचें!",
      timingEn: "Blocked Until You Cut the Toxic Cord", timingHi: "जब तक आप मानसिक बंधन नहीं तोड़ते, तब तक अवरोध",
      uprightEn: "Wake up! You are dealing with an obsessive attachment, fear-based contract, overthinking loop, or toxic temptation that drains your soul power.",
      uprightHi: "सजग हो जाएं! किसी व्यक्ति का अत्यधिक मोह (obsession), भय, ओवरथिंकिंग या कोई गलत आदत आपकी आत्मिक शक्ति को जंजीर की तरह बांध रही है।",
      reversedEn: "Breaking the chains! You are finally seeing through a manipulator's game and reclaiming your mental freedom.",
      reversedHi: "मुक्ति का समय! आप अंततः किसी के भावनात्मक छलावे या अपने भीतर के डर की जंजीर को तोड़कर बाहर निकल रहे हैं।",
      feelingsEn: "Intense, magnetic, almost addictive obsession—they cannot stop thinking about you, yet ego, jealousy, or toxic control complicates the bond.",
      feelingsHi: "वे आपके प्रति अत्यधिक चुंबकीय खिंचाव और जुनून (obsession) महसूस करते हैं—वे आपको भूल नहीं पा रहे, पर इसमें अधिकार जताने या ईर्ष्या की भावना भी मिली है।",
      careerEn: "Beware of golden-handcuff jobs, debt traps, shortcut money schemes, or a toxic boss exploiting your hard work.",
      careerHi: "कर्ज के जाल, शॉर्टकट धन के प्रलोभन या कार्यक्षेत्र में आपका शोषण करने वाले लोगों से अत्यंत सावधान रहें।",
      evilEyeEn: "HIGH ALERT: Strong Rahu-Shani Drishti / psychic cord detected! Someone's obsessive envy or your own toxic attachment is draining your vitality.",
      evilEyeHi: "उच्च चेतावनी: आपके ऑरा पर राहु-शनि की तीव्र नकारात्मक दृष्टि या किसी ईर्ष्यालु व्यक्ति का गहरा प्रभाव दिख रहा है—तुरंत सुरक्षा उपाय करें।"
    },
    {
      id: "maj_16", arcana: "Major", numeral: "XVI",
      nameEn: "The Tower", nameHi: "द टॉवर (मंगल-केतु आकस्मिक विस्फोट व सत्य का उद्घाटन)",
      icon: "fa-bolt-lightning", element: "Fire", grahaEn: "Mars & Ketu (Sudden Awakening)", grahaHi: "मंगल एवं केतु (भ्रम का टूटना व आकस्मिक सत्य)",
      yesNoWeight: 20, verdictEn: "NO — Sudden Shake-Up Clears False Illusions", verdictHi: "नहीं — झूठे भ्रम का टूटना आपके भविष्य के लिए आवश्यक है",
      timingEn: "Sudden Unexpected Event Within Days/Weeks", timingHi: "अचानक अप्रत्याशित घटना (कुछ दिनों या सप्ताह में)",
      uprightEn: "When a structure is built on weak or false foundations, the cosmos strikes it with lightning so you don't waste 10 more years inside a lie. Let the false fall!",
      uprightHi: "जब कोई रिश्ता या योजना झूठी नींव पर टिकी होती है, तो प्रकृति बिजली गिराकर उस भ्रम को तोड़ देती है ताकि आपके आने वाले वर्ष बर्बाद न हों।",
      reversedEn: "Trying to hold together a crumbling situation out of fear of change is only delaying the inevitable awakening.",
      reversedHi: "बदलाव के डर से किसी टूटती हुई परिस्थिति को जबरदस्ती पकड़कर रखना केवल आपके मानसिक तनाव को बढ़ा रहा है।",
      feelingsEn: "A sudden realization or ego-shattering shock has hit them. Their walls are cracking, and the unspoken truth between you is about to erupt.",
      feelingsHi: "उन्हें अचानक अपनी गलती या आपके महत्व का गहरा झटका (realization) लगा है; उनके अहंकार की दीवार टूट रही है।",
      careerEn: "Sudden restructuring, exam/job wake-up call, or abrupt end of a stagnant role that forces you onto your true path.",
      careerHi: "कार्यक्षेत्र में अचानक बदलाव या किसी पुरानी रुकावट का विस्फोटक अंत, जो आपको आपकी असली क्षमता की ओर मोड़ देगा।",
      evilEyeEn: "Sudden arguments, electronics breaking, or unexplained headaches indicate sharp Mars-Ketu Drishti hitting your environment.",
      evilEyeHi: "अचानक घर में कलह, उपकरणों का खराब होना या सिर में भारीपन मंगल-केतु की तीक्ष्ण नज़र/दोष का संकेत है।"
    },
    {
      id: "maj_17", arcana: "Major", numeral: "XVII",
      nameEn: "The Star", nameHi: "द स्टार (आशा की किरण, उपचार एवं दैवीय आशीर्वाद)",
      icon: "fa-star", element: "Air", grahaEn: "Saturn & Venus (Kumbha — Wish Fulfilment)", grahaHi: "कुंभ / शनि-शुक्र (मनोकामना पूर्ति व दैवीय कृपा)",
      yesNoWeight: 95, verdictEn: "BLESSED YES — Healing & Wish Fulfilment", verdictHi: "परम शुभ हाँ — मनोकामना पूर्ति एवं ईश्वरीय आशीर्वाद",
      timingEn: "Within 2 to 5 Weeks (Peaceful Unfolding)", timingHi: "2 से 5 सप्ताह के भीतर (सुखद परिणाम)",
      uprightEn: "After the storm comes the purest starlight. Your prayers have been heard—emotional healing, fame, recognition, and wish fulfilment are flowing toward you.",
      uprightHi: "तूफान के बाद अब शांत और चमकीले तारे का उदय हो चुका है। आपकी प्रार्थना स्वीकार हुई है—मानसिक शांति, सम्मान और मनोकामना पूर्ति का समय आ गया है।",
      reversedEn: "Pessimism or losing faith right at the 99th percentile when your blessing is just around the corner.",
      reversedHi: "मंजिल के बिल्कुल करीब पहुंचकर निराशा या आत्म-संदेह में आना आपके बने-बनाए सौभाग्य को धीमा कर रहा है।",
      feelingsEn: "You are their 'dream person'—their guiding star. Even from afar, thinking of you brings them hope, peace, and deep admiration.",
      feelingsHi: "आप उनके लिए किसी 'ध्रुव तारे' या सपने जैसे हैं। दूर रहकर भी आपके बारे में सोचना उन्हें गहरा सुकून और उम्मीद देता है।",
      careerEn: "Public recognition, clearing a long-awaited milestone, digital/social fame, and alignment with your highest calling.",
      careerHi: "समाज में प्रतिष्ठा, लंबे समय से प्रतीक्षित लक्ष्य की प्राप्ति और करियर में नई चमक का योग।",
      evilEyeEn: "Your aura is being washed clean by divine grace—past negativity and evil eye are dissolving rapidly.",
      evilEyeHi: "ईश्वरीय कृपा से आपके ऑरा की पुरानी नकारात्मकता धुल रही है और आपका आत्मबल पुनः चमक रहा है।"
    },
    {
      id: "maj_18", arcana: "Major", numeral: "XVIII",
      nameEn: "The Moon", nameHi: "द मून (चंद्र-राहु भ्रम, ओवरथिंकिंग एवं गुप्त रहस्य)",
      icon: "fa-cloud-moon", element: "Water", grahaEn: "Moon & Rahu (Grahan / Illusion & Subconscious)", grahaHi: "चंद्र-राहु (मानसिक भ्रम, अनजाना डर एवं गुप्त चेहरा)",
      yesNoWeight: 35, verdictEn: "UNCLEAR / WAIT — Hidden Illusions Active", verdictHi: "अस्पष्ट / रुकें — अभी कोहरा और भ्रम बना हुआ है",
      timingEn: "Wait 18 to 28 Days for the Fog to Clear", timingHi: "कोहरा छंटने तक 18 से 28 दिन प्रतीक्षा करें",
      uprightEn: "Nothing in this situation is 100% as it appears on the surface. Late-night anxiety, mixed signals, or someone's hidden face is clouding the truth.",
      uprightHi: "इस परिस्थिति में जो बाहर दिख रहा है, वह पूरा सच नहीं है। रात्रि में ओवरथिंकिंग, अस्पष्ट संकेत या किसी व्यक्ति का दोहरा चेहरा आपको भ्रमित कर रहा है।",
      reversedEn: "The fog is lifting! A lie, secret, or emotional confusion that haunted you is finally being exposed to daylight.",
      reversedHi: "भ्रम का कोहरा अब छंट रहा है! जो झूठ या संदेह आपको परेशान कर रहा था, उसका सच अब आपके सामने आने वाला है।",
      feelingsEn: "Their emotions are deep but tangled in fear, insecurity, and overthinking. They miss you intensely at night but project confusion by day.",
      feelingsHi: "उनकी भावनाएं गहरी हैं पर अनजाने डर, असुरक्षा और ओवरथिंकिंग में उलझी हैं। रात को वे आपको बहुत याद करते हैं, पर दिन में भ्रमित दिखते हैं।",
      careerEn: "Read every contract and promise twice. Do not make emotional career jumps while under mental stress or incomplete information.",
      careerHi: "किसी के मौखिक वादे पर आंख मूंदकर भरोसा न करें। मानसिक तनाव में कोई बड़ा करियर निर्णय लेने से बचें।",
      evilEyeEn: "CLASSIC GRAHAN ALERT: Moon-Rahu shadow energy is causing 2 AM overthinking, mood swings, and psychic heaviness.",
      evilEyeHi: "चंद्र-राहु (ग्रहण) संकेत: रात्रि में अकारण बेचैनी, बुरे सपने और मन का अचानक भारी होना नकारात्मक स्पंदन का सीधा प्रमाण है।"
    },
    {
      id: "maj_19", arcana: "Major", numeral: "XIX",
      nameEn: "The Sun", nameHi: "द सन (सूर्य-तेज, प्रचंड सफलता एवं स्पष्ट विजय)",
      icon: "fa-sun", element: "Fire", grahaEn: "Exalted Sun (Surya — Supreme Illumination)", grahaHi: "उच्चस्थ सूर्य (प्रचंड सफलता, यश एवं स्पष्टता)",
      yesNoWeight: 98, verdictEn: "100% DEFINITE YES — Radiant Victory & Joy!", verdictHi: "100% निश्चित हाँ — प्रचंड विजय, यश एवं खुशियां!",
      timingEn: "Rapid Fulfilment — Within 7 to 30 Days", timingHi: "तीव्र सिद्धि — 7 से 30 दिनों के भीतर",
      uprightEn: "The most auspicious card in the entire deck! Just as the rising Sun destroys all darkness, every doubt and obstacle in your path is melting into radiant success.",
      uprightHi: "पूरे टैरो डेक का सर्वश्रेष्ठ कार्ड! जैसे उगता हुआ सूर्य अंधकार को मिटा देता है, वैसे ही आपके मार्ग की सारी बाधाएं समाप्त होकर प्रचंड सफलता और सम्मान मिलने वाला है।",
      reversedEn: "Success is still yours, just slightly delayed by ego clashes or unrealistic impatience.",
      reversedHi: "सफलता निश्चित है, बस अहंकार या अत्यधिक अधीरता के कारण उसमें थोड़ा विलंब हो रहा है।",
      feelingsEn: "Pure, warm, unmistakable love and joy! You bring sunshine into their life, and they want an open, proud, happy future with you.",
      feelingsHi: "उनके मन में आपके लिए पूर्ण स्पष्टता, खुशी और गहरा प्रेम है। वे आपके साथ दुनिया के सामने गर्व से खड़ा होना चाहते हैं।",
      careerEn: "Top-rank exam success, promotion, government/executive favor, high wealth growth, and public honor.",
      careerHi: "परीक्षा में उच्च सफलता, पदोन्नति, सरकारी/प्रशासनिक लाभ, धन-वृद्धि और समाज में मान-सम्मान की प्राप्ति।",
      evilEyeEn: "Surya Tejas: Your solar aura is burning so brightly right now that no evil eye or jealousy can touch you.",
      evilEyeHi: "सूर्य कवच: आपका आत्मिक तेज इस समय इतना प्रबल है कि कोई भी बुरी नज़र या षड्यंत्र आपका बाल भी बांका नहीं कर सकता।"
    },
    {
      id: "maj_20", arcana: "Major", numeral: "XX",
      nameEn: "Judgement", nameHi: "जजमेंट (प्रारब्ध का बुलावा, पुनर्मिलन एवं निर्णायक मोड़)",
      icon: "fa-bell", element: "Fire", grahaEn: "Saturn & Ketu (Karmic Awakening & Second Chance)", grahaHi: "शनि एवं केतु (प्रारब्ध का निर्णय व पुनर्जागरण)",
      yesNoWeight: 88, verdictEn: "YES — Karmic Awakening & Second Chance", verdictHi: "हाँ — प्रारब्ध का बुलावा एवं दूसरा सुनहरा अवसर",
      timingEn: "Decisive Call / News Within 2 to 4 Weeks", timingHi: "2 से 4 सप्ताह में निर्णायक समाचार या कॉल",
      uprightEn: "A karmic trumpet is sounding in your life. Past efforts are being rewarded, a major final verdict is arriving, or a past connection is resurfacing for closure/reawakening.",
      uprightHi: "आपके जीवन में प्रारब्ध की घंटी बज चुकी है। पूर्व में किए गए कर्मों का शुभ फल, कोई बड़ा अंतिम निर्णय या अतीत के किसी रिश्ते की वापसी होने वाली है।",
      reversedEn: "Harsh self-judgment, doubting your own calling, or refusing to forgive yourself for a past mistake.",
      reversedHi: "अतीत की किसी भूल के लिए स्वयं को दोष देते रहना आपको अपने नए अवसर को स्वीकार करने से रोक रहा है।",
      feelingsEn: "A powerful awakening! If you were in no-contact or distance, they are realizing what they lost and feeling a karmic pull to reconnect.",
      feelingsHi: "यदि बातचीत बंद (No-Contact) थी या दूरी आ गई थी, तो अब उन्हें आपकी कीमत का गहरा एहसास हो रहा है और पुनर्मिलन की तीव्र इच्छा जाग रही है।",
      careerEn: "Final exam/interview results, career calling awakening, legal/official clearance, and stepping into a higher league.",
      careerHi: "परीक्षा या इंटरव्यू के अंतिम परिणाम, रुके हुए मामलों का निपटारा और करियर में एक बड़े उद्देश्य की शुरुआत।",
      evilEyeEn: "Past karmic debts are being settled—once you forgive and release old resentment, your luck doubles overnight.",
      evilEyeHi: "पुराने कर्म-ऋण चुकता हो रहे हैं—मन से पुरानी कड़वाहट निकालते ही आपका भाग्य दोगुनी गति से दौड़ेगा।"
    },
    {
      id: "maj_21", arcana: "Major", numeral: "XXI",
      nameEn: "The World", nameHi: "द वर्ल्ड (पूर्ण सिद्धि, चक्र की पूर्णता एवं वैश्विक सफलता)",
      icon: "fa-earth-asia", element: "Earth", grahaEn: "Saturn & Jupiter (Sampoorna Rajayoga)", grahaHi: "शनि एवं गुरु (संपूर्ण सिद्धि, पूर्णता एवं विदेश योग)",
      yesNoWeight: 96, verdictEn: "SUPREME YES — Full-Circle Completion & Triumph!", verdictHi: "सर्वोच्च हाँ — संपूर्ण सिद्धि एवं चक्र की सफल पूर्णता!",
      timingEn: "Milestone Completion Within 3 to 6 Weeks", timingHi: "3 से 6 सप्ताह में बड़ी उपलब्धि व पूर्णता",
      uprightEn: "The crown jewel of completion! A long, exhausting struggle is finally coming full circle into total victory, wholeness, marriage, or global/distant expansion.",
      uprightHi: "एक लंबे और थका देने वाले संघर्ष का चक्र अब पूर्ण विजय के साथ संपन्न हो रहा है! विवाह, करियर शिखर, विदेश/दूरस्थ सफलता या बड़ी मनोकामना पूर्ण होने का समय है।",
      reversedEn: "Stopping at 95% completion—one final loose end or karmic lesson needs to be tied up before you claim the trophy.",
      reversedHi: "95% पर आकर रुकना—विजय आपकी ही है, बस एक अंतिम अधूरे काम या संकोच को पूरा करना बाकी है।",
      feelingsEn: "You are their 'whole world.' They see you as the final destination of their heart—pointing toward deep union, marriage, or complete harmony.",
      feelingsHi: "वे आपको अपनी 'पूरी दुनिया' और अपनी तलाश की अंतिम मंजिल मानते हैं। यह कार्ड स्थायी मिलन और वैवाहिक पूर्णता का प्रतीक है।",
      careerEn: "Graduation, exam conquest, international/MNC opportunity, major project completion, and empire-level satisfaction.",
      careerHi: "बड़े लक्ष्य की प्राप्ति, राष्ट्रीय/अंतर्राष्ट्रीय अवसर, परीक्षा में सर्वोच्च सफलता और मान-सम्मान का योग।",
      evilEyeEn: "A protective cosmic mandala surrounds your aura—the cycle of struggle is ending and a new victorious chapter is sealing.",
      evilEyeHi: "आपके चारों ओर एक पूर्ण ब्रह्मांडीय सुरक्षा चक्र निर्मित हो चुका है—संघर्ष का अध्याय समाप्त हो रहा है।"
    }
  ];

  // ==========================================================================
  // 4. 56 MINOR ARCANA GENERATOR (4 SUITS × 14 RANKS — FULL 78-CARD ENGINE)
  // ==========================================================================

  const SUIT_META = {
    Wands: {
      suitEn: "Wands", suitHi: "वैंड्स (अग्नि दंड)", icon: "fa-fire-flame-curved",
      element: "Fire", grahaEn: "Mars & Sun (Agni Tatva)", grahaHi: "मंगल एवं सूर्य (अग्नि तत्व)",
      domainEn: "ambition, passion, career action, and courage", domainHi: "महत्वाकांक्षा, साहस, कर्म-ऊर्जा और तीव्र आकर्षण"
    },
    Cups: {
      suitEn: "Cups", suitHi: "कप्स (जल पात्र)", icon: "fa-wine-glass",
      element: "Water", grahaEn: "Moon & Venus (Jala Tatva)", grahaHi: "चंद्र एवं शुक्र (जल तत्व)",
      domainEn: "deep love, emotions, intuition, and relationships", domainHi: "प्रेम, भावनाएं, अंतर्ज्ञान और आत्मीय संबंध"
    },
    Swords: {
      suitEn: "Swords", suitHi: "स्वॉर्ड्स (वायु खड्ग)", icon: "fa-khanda",
      element: "Air", grahaEn: "Mercury, Saturn & Rahu (Vayu Tatva)", grahaHi: "बुध, शनि एवं राहु (वायु तत्व)",
      domainEn: "sharp truth, mental conflicts, decisions, and cutting illusions", domainHi: "तीक्ष्ण सत्य, मानसिक द्वंद्व, निर्णय और भ्रम का छेदन"
    },
    Pentacles: {
      suitEn: "Pentacles", suitHi: "पेंटाकल्स (पृथ्वी स्वर्ण-मुद्रा)", icon: "fa-coins",
      element: "Earth", grahaEn: "Jupiter, Mercury & Saturn (Prithvi Tatva)", grahaHi: "गुरु, बुध एवं शनि (पृथ्वी तत्व)",
      domainEn: "wealth, career stability, property, and tangible results", domainHi: "धन-संपदा, करियर स्थिरता, भूमि-भवन और ठोस परिणाम"
    }
  };

  const MINOR_RANKS = [
    { rank: "Ace",   num: "I",   w: 90, tEn: "1 to 3 Weeks", tHi: "1 से 3 सप्ताह",
      upEn: "A pure, divinely gifted seed of new beginning, breakthrough offer, and fresh momentum",
      upHi: "एक अत्यंत शुभ नई शुरुआत, नया अवसर और ईश्वरीय वरदान का बीज",
      revEn: "Delayed start or hesitating to grab a golden opportunity sitting right in front of you",
      revHi: "सामने आए सुनहरे अवसर को पकड़ने में संकोच या शुरुआती विलंब" },
    { rank: "Two",   num: "II",  w: 68, tEn: "2 to 4 Weeks", tHi: "2 से 4 सप्ताह",
      upEn: "A pivotal partnership or two-path decision requiring balance and mutual alignment",
      upHi: "दो रास्तों के बीच संतुलन, आपसी साझेदारी और भविष्य की ठोस योजना",
      revEn: "Indecision, stalemate, or mixed signals between two choices",
      revHi: "दो विकल्पों के बीच अनिर्णय, असमंजस या तालमेल की कमी" },
    { rank: "Three", num: "III", w: 72, tEn: "3 Weeks to 2 Months", tHi: "3 सप्ताह से 2 माह",
      upEn: "Expansion, visible initial results, or a third factor influencing the outcome",
      upHi: "प्रारंभिक प्रयासों का विस्तार, सहयोग या किसी तीसरे कारक का प्रभाव",
      revEn: "Third-party interference, emotional sting, or scattered teamwork",
      revHi: "किसी तीसरे व्यक्ति/कारक का हस्तक्षेप या पुरानी पीड़ा का उभरना" },
    { rank: "Four",  num: "IV",  w: 74, tEn: "4 Weeks", tHi: "4 सप्ताह के भीतर",
      upEn: "Stability, consolidation, protective foundation, and a moment to anchor your position",
      upHi: "स्थिरता, सुरक्षा की मजबूत नींव और अपनी स्थिति को सुदृढ़ करने का समय",
      revEn: "Stagnation, stubbornly holding back, or feeling emotionally boxed in",
      revHi: "जड़ता, अति-सुरक्षात्मक रवैया या मन को बंद कर लेना" },
    { rank: "Five",  num: "V",   w: 34, tEn: "After Crossing a 3–5 Week Test", tHi: "3 से 5 सप्ताह की परीक्षा पार करने के बाद",
      upEn: "Karmic friction, competition, ego clash, or temporary loss that tests your resilience",
      upHi: "प्रतिस्पर्धा, वैचारिक टकराव या अस्थायी उतार-चढ़ाव जो आपके धैर्य की परीक्षा ले रहा है",
      revEn: "End of conflict—recovering from a setback and choosing peace over ego battles",
      revHi: "विवाद और तनाव की समाप्ति—पुरानी निराशा से बाहर निकलकर सुलह का मार्ग" },
    { rank: "Six",   num: "VI",  w: 84, tEn: "Within 2 to 6 Weeks", tHi: "2 से 6 सप्ताह के भीतर",
      upEn: "Victory, harmonious reciprocity, healing transition, or a nostalgic past connection returning",
      upHi: "विजय, आपसी सहयोग, परिस्थितियों में सुधार या किसी पुराने संबंध की मधुर स्मृति",
      revEn: "One-sided giving (giving 90% and receiving 10%) or struggling to let go of the past",
      revHi: "एकतरफा समर्पण (90% देना और 10% पाना) या अतीत से बाहर न निकल पाना" },
    { rank: "Seven", num: "VII", w: 56, tEn: "Within 4 to 7 Weeks", tHi: "4 से 7 सप्ताह के भीतर",
      upEn: "Standing your ground, strategic patience, and discerning real gold from shiny illusions",
      upHi: "अपने हक के लिए डटे रहना, धैर्यपूर्ण प्रतीक्षा और भ्रम व सच में अंतर पहचानना",
      revEn: "Mental overwhelm, hidden agenda around you, or giving up right before the harvest",
      revHi: "मानसिक थकान, किसी की गुप्त चालाकी या फल पकने से ठीक पहले हार मान लेना" },
    { rank: "Eight", num: "VIII",w: 76, tEn: "Rapid Shift in 8 Days to 4 Weeks", tHi: "8 दिनों से 4 सप्ताह में तेज बदलाव",
      upEn: "Rapid acceleration, dedicated skill mastery, or consciously walking away from what no longer serves you",
      upHi: "तीव्र गति से समाचार/प्रगति, कौशल में निपुणता और अनचाहे बंधनों से आगे बढ़ना",
      revEn: "Self-imposed mental cage—overthinking traps that exist more in your head than in reality",
      revHi: "स्वयं के विचारों का पिंजरा—वह डर जो वास्तविकता से ज्यादा आपके दिमाग में बड़ा हो गया है" },
    { rank: "Nine",  num: "IX",  w: 75, tEn: "Within 3 to 9 Weeks", tHi: "3 से 9 सप्ताह के भीतर",
      upEn: "Near-completion resilience, wish fulfilment, self-earned independence, or final-mile vigilance",
      upHi: "लक्ष्य के बिल्कुल करीब पहुंचकर अंतिम परीक्षा, मनोकामना पूर्ति और आत्मनिर्भरता",
      revEn: "2 AM sleepless anxiety and carrying a heavy emotional burden all by yourself",
      revHi: "रात्रि में अनिद्रा/चिंता और सारी जिम्मेदारियों का बोझ अकेले ढोना" },
    { rank: "Ten",   num: "X",   w: 78, tEn: "Full Cycle Completion in 1 to 2 Months", tHi: "1 से 2 माह में पूर्ण परिणाम",
      upEn: "Total culmination of the cycle—lasting family/wealth legacy or the final end of an exhausting burden",
      upHi: "चक्र की पूर्णता—पारिवारिक व आर्थिक समृद्धि अथवा किसी लंबे बोझ का अंतिम समापन",
      revEn: "Carrying 10 people's workload on your shoulders while refusing to delegate or release",
      revHi: "अपनी क्षमता से अधिक बोझ उठाना और पुराने तनाव को छोड़ने में कठिनाई" },
    { rank: "Page",  num: "P",   w: 77, tEn: "Message Within 7 to 14 Days", tHi: "7 से 14 दिनों में संदेश या समाचार",
      upEn: "An incoming message, curious observation, fresh offer, or sincere emotional/career beginning",
      upHi: "एक नया संदेश, शुभ समाचार, नई जिज्ञासा या किसी अवसर की पहली दस्तक",
      revEn: "Immature communication, stalking from afar without texting, or delayed news",
      revHi: "संवाद में झिझक, दूर से नजर रखना पर पहल न करना, या समाचार में देरी" },
    { rank: "Knight",num: "Kn",  w: 82, tEn: "Fast Movement Within 1 to 3 Weeks", tHi: "1 से 3 सप्ताह में तेज हलचल",
      upEn: "Bold movement, romantic or professional pursuit, and charging forward toward the goal",
      upHi: "तेज पहल, साहसी कदम और लक्ष्य या रिश्ते की ओर पूरी ऊर्जा से बढ़ना",
      revEn: "In-and-out inconsistency—rushing in with high intensity and then suddenly going quiet",
      revHi: "अस्थिरता—कभी बहुत तीव्र लगाव दिखाना और कभी अचानक शांत पड़ जाना" },
    { rank: "Queen", num: "Q",   w: 86, tEn: "Within 3 to 5 Weeks", tHi: "3 से 5 सप्ताह के भीतर",
      upEn: "Magnetic maturity, intuitive mastery, clear boundaries, and nurturing abundance",
      upHi: "परिपक्व आकर्षण, गहरी समझ, स्पष्ट आत्म-सम्मान और भावनात्मक/आर्थिक स्थिरता",
      revEn: "Emotional guardedness, cold detachment after being hurt, or hidden insecurity",
      revHi: "पूर्व में मिले आघात के कारण भावनात्मक कवच ओढ़ लेना या भीतर की असुरक्षा" },
    { rank: "King",  num: "K",   w: 90, tEn: "Solid Outcome Within 1 to 2 Months", tHi: "1 से 2 माह में ठोस एवं स्थायी परिणाम",
      upEn: "Supreme mastery, mature commitment, executive authority, and protective provider energy",
      upHi: "सर्वोच्च अधिकार, परिपक्व वचनबद्धता, नेतृत्व और स्थायी सुरक्षा प्रदान करने की शक्ति",
      revEn: "Stubborn pride, emotionally unexpressive exterior, or controlling tendency",
      revHi: "अहंकार का आवरण, भावनाओं को भीतर दबाकर कठोर दिखना या नियंत्रण की प्रवृत्ति" }
  ];

  // Build Full 78-Card Deck Array
  const FULL_TAROT_DECK = [...MAJOR_ARCANA];

  Object.keys(SUIT_META).forEach(suitKey => {
    const sm = SUIT_META[suitKey];
    MINOR_RANKS.forEach(rk => {
      // Customize Three of Swords & Five of Swords/Cups/Pentacles accurately
      let weight = rk.w;
      if (suitKey === "Swords" && ["Three", "Five", "Eight", "Nine", "Ten"].includes(rk.rank)) {
        weight = 26;
      } else if (suitKey === "Cups" && ["Nine", "Ten", "Ace", "Two"].includes(rk.rank)) {
        weight = 92;
      } else if (suitKey === "Pentacles" && ["Ace", "Nine", "Ten", "King"].includes(rk.rank)) {
        weight = 93;
      }

      const verdictEn = weight >= 75 ? "YES — Favorable Flow" : (weight <= 40 ? "CHALLENGING — Caution Needed" : "MODERATE — Depends on Action");
      const verdictHi = weight >= 75 ? "हाँ — अनुकूल ऊर्जा प्रवाह" : (weight <= 40 ? "चुनौतीपूर्ण — सावधानी आवश्यक" : "मध्यम — आपके कर्म व धैर्य पर निर्भर");

      FULL_TAROT_DECK.push({
        id: `min_${suitKey}_${rk.rank}`,
        arcana: "Minor",
        numeral: rk.num,
        nameEn: `${rk.rank} of ${sm.suitEn}`,
        nameHi: `${rk.rank} ऑफ ${sm.suitHi}`,
        icon: sm.icon,
        element: sm.element,
        grahaEn: sm.grahaEn,
        grahaHi: sm.grahaHi,
        yesNoWeight: weight,
        verdictEn,
        verdictHi,
        timingEn: rk.tEn,
        timingHi: rk.tHi,
        uprightEn: `${rk.upEn} in the realm of ${sm.domainEn}.`,
        uprightHi: `${sm.domainHi} के क्षेत्र में: ${rk.upHi}।`,
        reversedEn: `${rk.revEn} affecting your ${sm.domainEn}.`,
        reversedHi: `${sm.domainHi} के क्षेत्र में: ${rk.revHi}।`,
        feelingsEn: suitKey === "Swords"
          ? `Their mind is over-analyzing everything (${rk.upEn.toLowerCase()}). They feel a sharp mental pull toward you but battle internal conflict or pride.`
          : `In their heart, ${rk.upEn.toLowerCase()} shapes how they view you—connecting you directly with ${sm.domainEn}.`,
        feelingsHi: suitKey === "Swords"
          ? `उनका दिमाग आपके बारे में अत्यधिक सोच-विचार (over-analysis) कर रहा है (${rk.upHi})। वे मानसिक रूप से आपसे जुड़े हैं पर भीतरी द्वंद्व में हैं।`
          : `उनके हृदय में आपके प्रति ${rk.upHi} की भावना है, जो सीधे ${sm.domainHi} से जुड़ी हुई है।`,
        careerEn: `In your career and finances: ${rk.upEn.toLowerCase()} governed by ${sm.grahaEn}.`,
        careerHi: `करियर और आर्थिक क्षेत्र में (${sm.grahaHi} के प्रभाव से): ${rk.upHi}।`,
        evilEyeEn: suitKey === "Swords" || rk.rank === "Five" || rk.rank === "Seven"
          ? `Sharp mental projection or hidden workplace/social rivalry (${sm.grahaEn}) is creating temporary static around your aura.`
          : `Your ${sm.element} element needs grounding so outside opinions don't disturb your ${sm.domainEn}.`,
        evilEyeHi: suitKey === "Swords" || rk.rank === "Five" || rk.rank === "Seven"
          ? `वायु/संघर्ष तत्व (${sm.grahaHi}) के कारण किसी की गुप्त प्रतिस्पर्धा या तीखी वाणी आपके मानसिक शांति के चक्र को प्रभावित कर रही है।`
          : `अपने ${sm.domainHi} को बाहरी लोगों की अनावश्यक चर्चा से सुरक्षित रखें।`
      });
    });
  });

  // ==========================================================================
  // 5. STATE MANAGEMENT & INTERACTIVE FANNED DECK CONTROLLER
  // ==========================================================================

  let currentMode = "yesno";
  let currentLang = "en";
  let shuffledDeckPool = [];
  let pickedCards = []; // Array of 3 { card, isReversed, slotIndex }

  function shuffleDeckWithCosmicSeed() {
    const pool = [...FULL_TAROT_DECK];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    // We display 22 mystic cards in the interactive fan (drawn from the full 78-card shuffled deck)
    shuffledDeckPool = pool.slice(0, 22);
    pickedCards = [];
  }

  function renderFannedDeckUI() {
    const fanContainer = document.getElementById("tarotFanContainer");
    const counterBadge = document.getElementById("pickedCounterBadge");
    if (!fanContainer) return;

    const total = shuffledDeckPool.length; // 22 cards
    const mid = (total - 1) / 2;

    fanContainer.innerHTML = shuffledDeckPool.map((card, idx) => {
      const offset = idx - mid;
      const angle = offset * 3.2; // Fan angle
      const yLift = Math.abs(offset) * 2.2;
      return `
        <button type="button"
          class="fan-card-item group focus:outline-none"
          data-fan-idx="${idx}"
          onclick="window.selectCardFromMysticFan(${idx}, this)"
          style="--fan-angle: ${angle}deg; --fan-y: ${yLift}px;"
          aria-label="Pick Mystic Tarot Card ${idx + 1}">
          <div class="fan-card-back">
            <div class="fan-card-border">
              <i class="fas fa-dharmachakra text-amber-300/80 text-lg md:text-xl group-hover:spin-slow"></i>
              <span class="text-[9px] uppercase tracking-widest text-purple-200/70 mt-1">Jyotish Tark</span>
            </div>
          </div>
        </button>
      `;
    }).join("");

    updateSelectionProgressUI();
  }

  function updateSelectionProgressUI() {
    const counterBadge = document.getElementById("pickedCounterBadge");
    const lang = document.getElementById("tarotLang")?.value || "en";
    const modeObj = SPREAD_MODES[currentMode] || SPREAD_MODES.yesno;
    const remaining = 3 - pickedCards.length;

    if (counterBadge) {
      if (remaining > 0) {
        const nextSlotLabel = lang === "hi"
          ? modeObj.positions[pickedCards.length].hi
          : modeObj.positions[pickedCards.length].en;
        counterBadge.innerHTML = lang === "hi"
          ? `<i class="fas fa-hand-Sparkles text-amber-300 mr-1.5"></i>कार्ड ${pickedCards.length + 1}/3 चुनें — <strong>${nextSlotLabel}</strong>`
          : `<i class="fas fa-hand-sparkles text-amber-300 mr-1.5"></i>Tap Card ${pickedCards.length + 1} of 3 for: <strong>${nextSlotLabel}</strong>`;
      } else {
        counterBadge.innerHTML = lang === "hi"
          ? `<i class="fas fa-check-circle text-emerald-400 mr-1.5"></i>तीनों दिव्य कार्ड चुन लिए गए हैं! नीचे अपना विस्तृत फलित पढ़ें ↓`
          : `<i class="fas fa-check-circle text-emerald-400 mr-1.5"></i>All 3 Cosmic Cards Drawn! Read Your Deep Synthesis Below ↓`;
      }
    }

    // Update the 3 slot placeholders
    for (let s = 0; s < 3; s++) {
      const slotLabelEl = document.getElementById(`slotPositionLabel_${s + 1}`);
      if (slotLabelEl) {
        slotLabelEl.textContent = lang === "hi" ? modeObj.positions[s].hi : modeObj.positions[s].en;
      }
    }
  }

  // Called when user taps a card in the fanned deck
  window.selectCardFromMysticFan = function (fanIdx, btnEl) {
    if (pickedCards.length >= 3) return;
    if (btnEl && btnEl.classList.contains("picked")) return;

    const cardObj = shuffledDeckPool[fanIdx];
    if (!cardObj) return;

    // 25% realistic chance of Reversed (उल्टा) polarity for authentic tarot precision
    const isReversed = Math.random() < 0.25;
    const slotNumber = pickedCards.length + 1;

    pickedCards.push({ card: cardObj, isReversed, slotNumber });

    if (btnEl) {
      btnEl.classList.add("picked");
      btnEl.disabled = true;
    }

    populateSpreadSlotCard(slotNumber, cardObj, isReversed);
    updateSelectionProgressUI();

    if (pickedCards.length === 3) {
      setTimeout(() => {
        generateDeepTarotDossier();
      }, 450);
    }
  };

  // One-click Quick Draw (if user prefers instant 3-card draw)
  window.quickDrawThreeCards = function () {
    resetTarotDeckAndSpread(false);
    const fanButtons = document.querySelectorAll(".fan-card-item");
    const chosenIndices = [];
    while (chosenIndices.length < 3) {
      const r = Math.floor(Math.random() * shuffledDeckPool.length);
      if (!chosenIndices.includes(r)) chosenIndices.push(r);
    }

    chosenIndices.forEach((idx, i) => {
      setTimeout(() => {
        window.selectCardFromMysticFan(idx, fanButtons[idx]);
      }, i * 320);
    });
  };

  window.resetTarotDeckAndSpread = function (scrollToDeck = true) {
    shuffleDeckWithCosmicSeed();
    renderFannedDeckUI();

    for (let s = 1; s <= 3; s++) {
      const cardEl = document.getElementById(`spreadCard_${s}`);
      if (cardEl) cardEl.classList.remove("flipped", "reversed-card");
    }

    const resultSec = document.getElementById("tarotDeepResultSection");
    if (resultSec) resultSec.classList.add("hidden");

    if (scrollToDeck) {
      const deckArea = document.getElementById("mysticDeckArena");
      if (deckArea) deckArea.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  function populateSpreadSlotCard(slotNum, card, isReversed) {
    const cardEl = document.getElementById(`spreadCard_${slotNum}`);
    const numeralEl = document.getElementById(`slotNumeral_${slotNum}`);
    const iconEl = document.getElementById(`slotIcon_${slotNum}`);
    const titleEl = document.getElementById(`slotCardTitle_${slotNum}`);
    const grahaEl = document.getElementById(`slotCardGraha_${slotNum}`);
    const polarityEl = document.getElementById(`slotCardPolarity_${slotNum}`);

    const lang = document.getElementById("tarotLang")?.value || "en";

    if (numeralEl) numeralEl.textContent = `${card.arcana} • ${card.numeral}`;
    if (iconEl) {
      iconEl.className = `fas ${card.icon} text-3xl md:text-4xl text-amber-300 my-2 transition-transform duration-500 ${isReversed ? "rotate-180" : ""}`;
    }
    if (titleEl) titleEl.textContent = lang === "hi" ? card.nameHi : card.nameEn;
    if (grahaEl) grahaEl.textContent = lang === "hi" ? card.grahaHi : card.grahaEn;

    if (polarityEl) {
      if (isReversed) {
        polarityEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/25 text-rose-200 border border-rose-400/40";
        polarityEl.textContent = lang === "hi" ? "उल्टा (Reversed • कर्म-अवरोध)" : "Reversed (Blocked / Internalized)";
      } else {
        polarityEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400/40";
        polarityEl.textContent = lang === "hi" ? "सीधा (Upright • जागृत प्रवाह)" : "Upright (Direct Active Flow)";
      }
    }

    if (cardEl) {
      setTimeout(() => {
        cardEl.classList.add("flipped");
      }, 80);
    }
  }

  // ==========================================================================
  // 6. DEEP VEDIC-TAROT FUSION DOSSIER GENERATOR
  // ==========================================================================

  function generateDeepTarotDossier() {
    if (pickedCards.length < 3) return;

    const lang = document.getElementById("tarotLang")?.value || "en";
    const userName = document.getElementById("tarotUserName")?.value.trim() || (lang === "hi" ? "साधक" : "Seeker");
    const userDob = document.getElementById("tarotUserDob")?.value || "";
    const userQuestion = document.getElementById("tarotUserQuestion")?.value.trim() || "";
    const modeObj = SPREAD_MODES[currentMode] || SPREAD_MODES.yesno;

    const numInfo = getUserNumerology(userName, userDob);
    const mulankObj = MULANK_PLANETS[numInfo.mulank] || MULANK_PLANETS[1];
    const bhagyankObj = MULANK_PLANETS[numInfo.bhagyank] || MULANK_PLANETS[3];

    // Refresh card face labels in case language changed
    pickedCards.forEach((p, idx) => populateSpreadSlotCard(idx + 1, p.card, p.isReversed));

    // Calculate Weighted Yes/No Probability & Elemental Balance
    let totalScore = 0;
    const elementsCount = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    const weights = [0.25, 0.30, 0.45]; // Outcome card carries highest weight

    pickedCards.forEach((item, idx) => {
      let cardScore = item.card.yesNoWeight;
      if (item.isReversed) {
        // Reversed reduces high score or softens a harsh card
        cardScore = cardScore > 55 ? Math.max(25, cardScore - 28) : Math.min(62, cardScore + 14);
      }
      totalScore += cardScore * weights[idx];
      elementsCount[item.card.element] = (elementsCount[item.card.element] || 0) + 1;
    });

    const finalProbability = Math.min(98, Math.max(18, Math.round(totalScore)));
    const outcomeCard = pickedCards[2].card;
    const outcomeReversed = pickedCards[2].isReversed;

    // 1. Render Top Oracle Verdict & Timing Meter
    renderOracleVerdictBanner(lang, userName, userQuestion, modeObj, finalProbability, outcomeCard, outcomeReversed, numInfo, mulankObj, bhagyankObj);

    // 2. Render Detailed 3-Card Position Synthesis
    renderThreeCardDetailedSynthesis(lang, userName, modeObj, pickedCards, numInfo);

    // 3. Render Elemental Dignity & Hidden Graha Diagnostic Hook (Funnels to Kundali & WhatsApp)
    renderElementalAndGrahaHook(lang, userName, userDob, modeObj, pickedCards, elementsCount, finalProbability, numInfo);

    const resultSec = document.getElementById("tarotDeepResultSection");
    if (resultSec) {
      resultSec.classList.remove("hidden");
      resultSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderOracleVerdictBanner(lang, userName, userQuestion, modeObj, prob, outcomeCard, isRev, numInfo, mulankObj, bhagyankObj) {
    const box = document.getElementById("oracleVerdictContainer");
    if (!box) return;

    let badgeColor = "from-emerald-600 to-teal-500 border-emerald-300";
    let verdictHeading = lang === "hi" ? "प्रबल हाँ (STRONG YES — अनुकूल सिद्धि)" : "STRONG YES — Favorable Cosmic Alignment";
    if (prob < 48) {
      badgeColor = "from-rose-700 to-red-600 border-rose-300";
      verdictHeading = lang === "hi" ? "अवरोध / अभी नहीं (Karmic Block Detected)" : "WAIT / CAUTION — Hidden Karmic Block Detected";
    } else if (prob < 72) {
      badgeColor = "from-amber-600 to-orange-500 border-amber-300";
      verdictHeading = lang === "hi" ? "शर्त के साथ हाँ (CONDITIONAL YES)" : "CONDITIONAL YES — Requires Strategy Shift";
    }

    const timingStr = lang === "hi" ? outcomeCard.timingHi : outcomeCard.timingEn;
    const qHtml = userQuestion
      ? `<div class="text-xs md:text-sm text-purple-200 italic mt-1">"${userQuestion}"</div>`
      : "";

    if (lang === "hi") {
      box.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-8 space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase">
              <i class="fas fa-om"></i> ${modeObj.titleHi} • वैदिक-टैरो सिंथेसिस
            </div>
            <h3 class="text-2xl md:text-4xl font-bold text-white">
              प्रिय <span class="text-amber-300">${userName}</span>, आपके प्रश्न का ब्रह्मांडीय उत्तर
            </h3>
            ${qHtml}
            <p class="text-sm md:text-base text-gray-200 leading-relaxed">
              आपके <strong>मूलांक ${numInfo.mulank} (${mulankObj.planetHi})</strong>, <strong>भाग्यांक ${numInfo.bhagyank} (${bhagyankObj.planetHi})</strong> और आपके नाम के चैल्डियन स्पंदन (<strong>${numInfo.nameCompound} → ${numInfo.nameNumber}</strong>) का आपके द्वारा चुने गए तीनों कार्डों से मिलान करने पर यह स्पष्ट होता है कि आपकी वर्तमान ऊर्जा <strong>${outcomeCard.grahaHi}</strong> से संचालित हो रही है।
            </p>
            <div class="flex flex-wrap gap-3 pt-1 text-xs">
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 font-bold">
                <i class="fas fa-clock mr-1.5"></i>सटीक समय संकेत: ${timingStr}
              </span>
              <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-400/40 text-purple-200 font-bold">
                <i class="fas fa-planet-ringed mr-1.5"></i>निर्णायक ग्रह प्रभाव: ${outcomeCard.grahaHi}
              </span>
            </div>
          </div>

          <div class="lg:col-span-4 bg-slate-950/90 p-5 rounded-2xl border border-amber-400/40 text-center space-y-3 shadow-2xl">
            <div class="text-xs font-bold uppercase tracking-widest text-gray-400">सफलता एवं सकारात्मकता मीटर</div>
            <div class="text-4xl md:text-5xl font-extrabold text-amber-400">${prob}%</div>
            <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div class="h-full rounded-full bg-gradient-to-r ${badgeColor}" style="width: ${prob}%"></div>
            </div>
            <div class="inline-block px-4 py-1.5 rounded-xl bg-gradient-to-r ${badgeColor} text-white font-bold text-xs md:text-sm shadow">
              ${verdictHeading}
            </div>
          </div>
        </div>
      `;
      return;
    }

    box.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-8 space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase">
            <i class="fas fa-om"></i> ${modeObj.titleEn} • Vedic-Tarot Synthesis
          </div>
          <h3 class="text-2xl md:text-4xl font-bold text-white">
            Dear <span class="text-amber-300">${userName}</span>, Your Cosmic Oracle Verdict
          </h3>
          ${qHtml}
          <p class="text-sm md:text-base text-gray-200 leading-relaxed">
            Synthesizing your <strong>Psychic Number ${numInfo.mulank} (${mulankObj.planetEn})</strong>, <strong>Destiny Number ${numInfo.bhagyank} (${bhagyankObj.planetEn})</strong>, and your <strong>Chaldean Name Vibration (${numInfo.nameCompound} → ${numInfo.nameNumber})</strong> with the three cards your intuition selected reveals that your outcome is currently governed by <strong>${outcomeCard.grahaEn}</strong>.
          </p>
          <div class="flex flex-wrap gap-3 pt-1 text-xs">
            <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 font-bold">
              <i class="fas fa-clock mr-1.5"></i>Manifestation Window: ${timingStr}
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-400/40 text-purple-200 font-bold">
              <i class="fas fa-globe mr-1.5"></i>Ruling Graha Force: ${outcomeCard.grahaEn}
            </span>
          </div>
        </div>

        <div class="lg:col-span-4 bg-slate-950/90 p-5 rounded-2xl border border-amber-400/40 text-center space-y-3 shadow-2xl">
          <div class="text-xs font-bold uppercase tracking-widest text-gray-400">Cosmic Alignment Probability</div>
          <div class="text-4xl md:text-5xl font-extrabold text-amber-400">${prob}%</div>
          <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-gradient-to-r ${badgeColor}" style="width: ${prob}%"></div>
          </div>
          <div class="inline-block px-4 py-1.5 rounded-xl bg-gradient-to-r ${badgeColor} text-white font-bold text-xs md:text-sm shadow">
            ${verdictHeading}
          </div>
        </div>
      </div>
    `;
  }

  function renderThreeCardDetailedSynthesis(lang, userName, modeObj, picked, numInfo) {
    const container = document.getElementById("threeCardDetailedCards");
    if (!container) return;

    container.innerHTML = picked.map((item, idx) => {
      const c = item.card;
      const rev = item.isReversed;
      const posTitle = lang === "hi" ? modeObj.positions[idx].hi : modeObj.positions[idx].en;
      const cardTitle = lang === "hi" ? c.nameHi : c.nameEn;
      const polarityTag = rev
        ? (lang === "hi" ? "उल्टा कार्ड (Reversed — रुकी हुई या आंतरिक ऊर्जा)" : "Reversed Polarity (Internalized / Delayed Energy)")
        : (lang === "hi" ? "सीधा कार्ड (Upright — पूर्ण जागृत प्रभाव)" : "Upright Polarity (Direct Active Manifestation)");

      const coreMeaning = rev
        ? (lang === "hi" ? c.reversedHi : c.reversedEn)
        : (lang === "hi" ? c.uprightHi : c.uprightEn);

      let modeSpecificText = "";
      if (currentMode === "feelings") {
        modeSpecificText = lang === "hi" ? c.feelingsHi : c.feelingsEn;
      } else if (currentMode === "career") {
        modeSpecificText = lang === "hi" ? c.careerHi : c.careerEn;
      } else if (currentMode === "evileye") {
        modeSpecificText = lang === "hi" ? c.evilEyeHi : c.evilEyeEn;
      } else {
        modeSpecificText = lang === "hi"
          ? `${c.feelingsHi} साथ ही करियर व कर्म के स्तर पर: ${c.careerHi}`
          : `${c.feelingsEn} Simultaneously on the practical/career plane: ${c.careerEn}`;
      }

      if (lang === "hi") {
        return `
          <div class="p-6 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 relative overflow-hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-amber-400">${posTitle}</span>
                <h4 class="text-xl md:text-2xl font-bold text-white mt-0.5">${cardTitle}</h4>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-900/60 border border-purple-400/40 text-purple-200">${c.grahaHi}</span>
                <span class="px-3 py-1 rounded-full text-xs font-bold ${rev ? "bg-rose-900/60 text-rose-200 border border-rose-400/40" : "bg-emerald-900/60 text-emerald-200 border border-emerald-400/40"}">${polarityTag}</span>
              </div>
            </div>

            <p class="text-gray-200 text-sm md:text-base leading-relaxed mb-0">
              <strong>1. कार्ड का मूल संदेश:</strong> ${coreMeaning}
            </p>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed mb-0">
              <strong>2. आपके प्रश्न के संदर्भ में गूढ़ अर्थ:</strong> ${modeSpecificText}
            </p>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-200">
              <i class="fas fa-compass mr-1.5 text-amber-400"></i><strong>समय एवं निर्णय संकेत:</strong> ${c.verdictHi} • संभावित समय: <strong>${c.timingHi}</strong>
            </div>
          </div>
        `;
      }

      return `
        <div class="p-6 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3 relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400">${posTitle}</span>
              <h4 class="text-xl md:text-2xl font-bold text-white mt-0.5">${cardTitle}</h4>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-900/60 border border-purple-400/40 text-purple-200">${c.grahaEn}</span>
              <span class="px-3 py-1 rounded-full text-xs font-bold ${rev ? "bg-rose-900/60 text-rose-200 border border-rose-400/40" : "bg-emerald-900/60 text-emerald-200 border border-emerald-400/40"}">${polarityTag}</span>
            </div>
          </div>

          <p class="text-gray-200 text-sm md:text-base leading-relaxed mb-0">
            <strong>1. Core Archetypal Message:</strong> ${coreMeaning}
          </p>
          <p class="text-gray-200 text-sm md:text-base leading-relaxed mb-0">
            <strong>2. Deep Meaning for Your Focus Area:</strong> ${modeSpecificText}
          </p>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-200">
            <i class="fas fa-compass mr-1.5 text-amber-400"></i><strong>Oracle Verdict & Timing:</strong> ${c.verdictEn} • Window: <strong>${c.timingEn}</strong>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderElementalAndGrahaHook(lang, userName, userDob, modeObj, picked, elementsCount, prob, numInfo) {
    const hookBox = document.getElementById("tarotKarmicDiagnosticBox");
    if (!hookBox) return;

    const cardNamesEn = picked.map(p => `${p.card.nameEn}${p.isReversed ? " (Rev)" : ""}`).join(" → ");
    const grahasEn = picked.map(p => p.card.grahaEn).join(" + ");
    const grahasHi = picked.map(p => p.card.grahaHi).join(" + ");

    // Identify dominant element
    let domElem = "Fire";
    let maxCount = 0;
    Object.keys(elementsCount).forEach(el => {
      if (elementsCount[el] > maxCount) {
        maxCount = elementsCount[el];
        domElem = el;
      }
    });

    const elemDiagnostic = {
      Fire: {
        en: "High Agni (Fire) Dominance: Your energy is burning with urgency and impatience, risking burnout or impulsive clashes if not timed with your Mahadasha.",
        hi: "अग्नि तत्व की अधिकता: आपके भीतर तीव्रता और अधीरता बढ़ी हुई है—बिना अपनी महादशा जांचे आवेग में कदम उठाने से ऊर्जा व्यर्थ हो सकती है।"
      },
      Water: {
        en: "Deep Jala (Water) Dominance: Heavy emotional attachment and subconscious sensitivity are making you absorb other people's mood swings.",
        hi: "जल तत्व की प्रधानता: अत्यधिक भावुकता और गहरा मानसिक लगाव आपको दूसरों के व्यवहार के प्रति अति-संवेदनशील बना रहा है।"
      },
      Air: {
        en: "High Vayu (Air/Swords) Dominance: Your mind is trapped in a 2 AM overthinking loop—analyzing 10 scenarios at once and disturbing your sleep.",
        hi: "वायु तत्व की अधिकता: आपका मस्तिष्क रात्रि में ओवरथिंकिंग के भंवर में फंसा है—एक साथ दस आशंकाएं सोचने से मानसिक थकान बढ़ रही है।"
      },
      Earth: {
        en: "Prithvi (Earth) Grounding: Practical outcomes are near, but karmic delays from Saturn require unlocking your birth chart's 2nd/10th/11th houses.",
        hi: "पृथ्वी तत्व का प्रभाव: ठोस परिणाम आपके करीब हैं, परंतु शनि के कर्म-विलंब को खोलने के लिए आपकी जन्म कुंडली के धन व कर्म भाव की जांच आवश्यक है।"
      }
    }[domElem];

    const waText = encodeURIComponent(
      `Namaste Gyanendra Ji 🙏\nI just completed my Vedic-Tarot Reading on Jyotish Tark:\n` +
      `• Name: ${userName} ${userDob ? `(DOB: ${userDob}, Mulank${numInfo.mulank})` : ""}\n` +
      `• Spread: ${modeObj.titleEn}\n` +
      `• Cards Drawn: ${cardNamesEn}\n` +
      `• Probability Score: ${prob}%\n` +
      `I want to book my ₹1101 Complete Hand-Crafted Kundali & Personal Remedies to unlock these planetary blocks.`
    );
    const waUrl = `https://wa.me/918318513814?text=${waText}`;

    if (lang === "hi") {
      hookBox.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400 text-red-300 text-xs font-bold uppercase">
              <i class="fas fa-exclamation-triangle animate-bounce"></i> महत्वपूर्ण ज्योतिषीय निदान (Why Tarot Is Only 30% of Your Picture)
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-white leading-tight">
              ⚠️ आपके कार्ड्स में <span class="text-amber-300">${grahasHi}</span> का गहरा कर्म-संकेत मिला है!
            </h3>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed">
              प्रिय <strong>${userName}</strong>, टैरो कार्ड्स आपके <strong>वर्तमान 60–90 दिनों के अवचेतन आभा-मंडल (Aura)</strong> का बिल्कुल सटीक दर्पण दिखाते हैं। ${elemDiagnostic.hi}
            </p>
            <p class="text-amber-200 text-sm md:text-base leading-relaxed font-medium">
              परंतु याद रखिए—टैरो यह बताता है कि <em>"अभी क्या होने वाला है"</em>, जबकि आपकी <strong>जन्म कुंडली (Lagna, Navamsa D9, 337-Bindu Ashtakavarga एवं महादशा-अंतर्दशा)</strong> यह तय करती है कि यह समस्या जड़ से कैसे समाप्त होगी और आपका स्थायी भाग्योदय कब होगा!
            </p>
          </div>

          <div class="lg:col-span-4 bg-slate-950/95 p-6 rounded-2xl border-2 border-amber-400/60 text-center space-y-4 shadow-2xl">
            <div class="text-xs font-bold uppercase tracking-widest text-amber-400">Next Step for 99.9% Clarity</div>
            <h4 class="text-lg font-bold text-white">अपनी जन्म कुंडली से इसका स्थायी समाधान जानें</h4>
            <a href="kundali-form.html" class="primary-button w-full text-sm py-3.5 px-5 shadow-xl">
              <i class="fas fa-key mr-2"></i> अपनी 45-Min फ्री कुंडली पढ़ें
            </a>
            <a href="${waUrl}" target="_blank" class="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition">
              <i class="fab fa-whatsapp text-lg"></i> ज्ञानेंद्र जी से परामर्श लें (₹1101)
            </a>
          </div>
        </div>
      `;
      return;
    }

    hookBox.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-8 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400 text-red-300 text-xs font-bold uppercase">
            <i class="fas fa-exclamation-triangle animate-bounce"></i> Critical Vedic-Tarot Diagnostic (Why Tarot Is Only 30% of the Picture)
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-white leading-tight">
            ⚠️ Your Spread Reveals an Active <span class="text-amber-300">${grahasEn}</span> Karmic Trigger!
          </h3>
          <p class="text-gray-200 text-sm md:text-base leading-relaxed">
            Dear <strong>${userName}</strong>, Tarot cards mirror your <strong>current 60-to-90-day subconscious aura</strong> with uncanny accuracy. ${elemDiagnostic.en}
          </p>
          <p class="text-amber-200 text-sm md:text-base leading-relaxed font-medium">
            However, Tarot only shows <em>what energy is approaching</em>—whereas your <strong>Vedic Janam Kundali (Lagna, Navamsa D9, 337-Bindu Ashtakavarga & Active Mahadasha–Antardasha)</strong> reveals the permanent root cause and the exact remedy to unlock your destiny!
          </p>
        </div>

        <div class="lg:col-span-4 bg-slate-950/95 p-6 rounded-2xl border-2 border-amber-400/60 text-center space-y-4 shadow-2xl">
          <div class="text-xs font-bold uppercase tracking-widest text-amber-400">Unlock 99.9% Root-Cause Clarity</div>
          <h4 class="text-lg font-bold text-white">Check Your Permanent Kundali & Dasha Solution</h4>
          <a href="kundali-form.html" class="primary-button w-full text-sm py-3.5 px-5 shadow-xl">
            <i class="fas fa-key mr-2"></i> Read Free 45-Min Kundali Dossier
          </a>
          <a href="${waUrl}" target="_blank" class="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition">
            <i class="fab fa-whatsapp text-lg"></i> Consult Gyanendra Ji (₹1101)
          </a>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 7. MODE SWITCHING & INITIALIZATION
  // ==========================================================================

  window.selectTarotSpreadMode = function (modeKey, btnEl) {
    if (!SPREAD_MODES[modeKey]) return;
    currentMode = modeKey;

    document.querySelectorAll(".tarot-mode-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    const modeSubtitleEl = document.getElementById("activeSpreadModeSubtitle");
    const lang = document.getElementById("tarotLang")?.value || "en";
    if (modeSubtitleEl) {
      modeSubtitleEl.textContent = lang === "hi" ? SPREAD_MODES[modeKey].subtitleHi : SPREAD_MODES[modeKey].subtitleEn;
    }

    updateSelectionProgressUI();

    // If 3 cards are already drawn, re-synthesize immediately for the new mode!
    if (pickedCards.length === 3) {
      generateDeepTarotDossier();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    shuffleDeckWithCosmicSeed();
    renderFannedDeckUI();

    const langSelect = document.getElementById("tarotLang");
    if (langSelect) {
      langSelect.addEventListener("change", () => {
        currentLang = langSelect.value;
        const modeSubtitleEl = document.getElementById("activeSpreadModeSubtitle");
        if (modeSubtitleEl && SPREAD_MODES[currentMode]) {
          modeSubtitleEl.textContent = currentLang === "hi"
            ? SPREAD_MODES[currentMode].subtitleHi
            : SPREAD_MODES[currentMode].subtitleEn;
        }
        updateSelectionProgressUI();
        if (pickedCards.length === 3) {
          generateDeepTarotDossier();
        }
      });
    }
  });

})();
