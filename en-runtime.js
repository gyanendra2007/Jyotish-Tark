/* ==========================================================================
   Jyotish Tark — English runtime for pages in /en/ whose tools write Hindi from JS.
   Translates text nodes (and placeholder / aria-label / title) as they appear:
     1) exact sentence from DICT, 2) pattern RULES, 3) word TERMS (signs, nakshatras…).
   Page-specific strings can be added with window.JT_EN_EXTRA = { dict: {}, rules: [] }
   before this file loads. Loaded only by English pages (tools/en/make_en.py).
   ========================================================================== */
(function () {
  "use strict";
  if (!/\/en\//.test(location.pathname)) return;
  var DEV = /[ऀ-ॿ]/;

  var TERMS = {
    // signs
    "मेष": "Aries", "वृषभ": "Taurus", "मिथुन": "Gemini", "कर्क": "Cancer", "सिंह": "Leo", "कन्या": "Virgo", "तुला": "Libra", "वृश्चिक": "Scorpio", "धनु": "Sagittarius", "मकर": "Capricorn", "कुंभ": "Aquarius", "मीन": "Pisces",
    // nakshatras
    "अश्विनी": "Ashwini", "भरणी": "Bharani", "कृत्तिका": "Krittika", "रोहिणी": "Rohini", "मृगशिरा": "Mrigashira", "आर्द्रा": "Ardra", "पुनर्वसु": "Punarvasu", "पुष्य": "Pushya", "आश्लेषा": "Ashlesha", "मघा": "Magha",
    "पूर्वाफाल्गुनी": "Purva Phalguni", "पूर्वा फाल्गुनी": "Purva Phalguni", "उत्तराफाल्गुनी": "Uttara Phalguni", "उत्तरा फाल्गुनी": "Uttara Phalguni", "हस्त": "Hasta", "चित्रा": "Chitra", "स्वाति": "Swati", "विशाखा": "Vishakha", "अनुराधा": "Anuradha", "ज्येष्ठा": "Jyeshtha", "मूल": "Mula",
    "पूर्वाषाढ़ा": "Purva Ashadha", "पूर्वाषाढा": "Purva Ashadha", "उत्तराषाढ़ा": "Uttara Ashadha", "उत्तराषाढा": "Uttara Ashadha", "श्रवण": "Shravana", "धनिष्ठा": "Dhanishtha", "शतभिषा": "Shatabhisha", "शतभिषक": "Shatabhisha",
    "पूर्वाभाद्रपद": "Purva Bhadrapada", "पूर्वा भाद्रपद": "Purva Bhadrapada", "उत्तराभाद्रपद": "Uttara Bhadrapada", "उत्तरा भाद्रपद": "Uttara Bhadrapada", "रेवती": "Revati",
    // planets
    "सूर्य": "Sun", "चंद्र": "Moon", "चंद्रमा": "Moon", "मंगल": "Mars", "बुध": "Mercury", "गुरु": "Jupiter", "बृहस्पति": "Jupiter", "शुक्र": "Venus", "शनि": "Saturn", "राहु": "Rahu", "केतु": "Ketu",
    // ashtakoot names and categories
    "वर्ण": "Varna", "वश्य": "Vashya", "तारा": "Tara", "योनि": "Yoni", "ग्रह मैत्री": "Graha Maitri", "गण": "Gana", "भकूट": "Bhakoot", "नाड़ी": "Nadi",
    "ब्राह्मण": "Brahmin", "क्षत्रिय": "Kshatriya", "वैश्य": "Vaishya", "शूद्र": "Shudra",
    "चतुष्पद": "Quadruped", "मानव": "Human", "जलचर": "Water-born", "वनचर": "Wild", "कीट": "Insect",
    "अश्व": "Horse", "गज": "Elephant", "मेष (बकरा)": "Goat", "सर्प": "Serpent", "श्वान": "Dog", "मार्जार": "Cat", "मूषक": "Rat", "गौ": "Cow", "महिष": "Buffalo", "व्याघ्र": "Tiger", "मृग": "Deer", "वानर": "Monkey", "नकुल": "Mongoose",
    "देव": "Deva", "मनुष्य": "Manushya", "राक्षस": "Rakshasa", "आदि": "Adi", "मध्य": "Madhya", "अंत्य": "Antya",
    // months
    "जनवरी": "January", "फ़रवरी": "February", "फरवरी": "February", "मार्च": "March", "अप्रैल": "April", "मई": "May", "जून": "June", "जुलाई": "July", "अगस्त": "August", "सितंबर": "September", "अक्टूबर": "October", "नवंबर": "November", "दिसंबर": "December",
    // small words
    "और": "and", "लड़का": "Boy", "लड़की": "Girl", "दोनों": "both"
  };

  var DICT = {
    // shared calculator form (jt-calc.js)
    "नाम": "Name", "नाम *": "Name *", "जन्मतिथि *": "Date of birth *", "जन्म समय *": "Time of birth *", "जन्म समय (पता हो तो)": "Time of birth (if known)",
    "जन्म स्थान *": "Place of birth *", "जन्म स्थान (पता हो तो)": "Place of birth (if known)", "शहर के 2-3 अक्षर, जैसे Luc": "Type 2–3 letters of the city, e.g. Luc", "जैसे Rahul Sharma": "e.g. Rahul Sharma",
    "गणना हो रही है…": "Calculating…", "पेज पूरा लोड नहीं हुआ — दोबारा कोशिश करें।": "The page did not load fully — please try again.",
    "मुफ़्त ज्योतिष कैलकुलेटर": "Free astrology calculator",
    // guna milan (calc-milan.js + jt-calc.js)
    "मिलान का तरीका": "Matching method", "पूरा गुण मिलान (36 गुण)": "Full guna milan (36 points)", "Quick vibe check — सिर्फ़ जन्मतिथि": "Quick vibe check — dates of birth only", "💌 Partner को लिंक भेजें": "💌 Send a link to your partner",
    "अपना विवरण भरें और लिंक अपने partner को भेजें। वे अपनी जन्मतिथि डालेंगे और आप दोनों का गुण मिलान खुल जाएगा।": "Fill in your details and send the link to your partner. They add their date of birth and the guna milan for both of you opens.",
    "आपका विवरण किसी सर्वर पर सेव नहीं होता": "your details are not saved on any server", "— वह सिर्फ़ लिंक के अंदर रहता है।": "— they live only inside the link.",
    "मैं हूँ *": "I am *", "💌 मिलान का लिंक बनाएँ": "💌 Create matching link",
    "👨 वर (लड़का)": "👨 Groom (boy)", "👩 कन्या (लड़की)": "👩 Bride (girl)", "पहला व्यक्ति (लड़का)": "First person (boy)", "दूसरा व्यक्ति (लड़की)": "Second person (girl)",
    "गुण मिलान करें": "Match the gunas", "Vibe check करें ✨": "Do the vibe check ✨",
    "वैदिक अष्टकूट मिलान दोनों के जन्म-नक्षत्र से होता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।": "Vedic ashtakoot matching uses both birth nakshatras, so the time and place of birth are needed.",
    "सिर्फ़ जन्मतिथि से चंद्र राशि का अनुमान लगाकर मिलान — मज़ेदार और जल्दी। विवाह के लिए “पूरा गुण मिलान” ही करें।": "A quick match from an estimate of the moon sign using dates of birth only — fun and fast. For marriage, use the “Full guna milan”.",
    "कर्म और अहं का तालमेल": "Work and ego harmony", "आपसी आकर्षण और प्रभाव": "Mutual attraction and influence", "भाग्य और स्वास्थ्य का साथ": "Fortune and well-being together",
    "स्वभाव और शारीरिक अनुकूलता": "Nature and physical compatibility", "सोच और मानसिक मेल": "Thinking and mental match", "स्वभाव और व्यवहार": "Temperament and behaviour",
    "प्रेम, परिवार और समृद्धि": "Love, family and prosperity", "स्वास्थ्य और संतान": "Well-being and children",
    "उत्तम": "Excellent", "बहुत अच्छा मिलान": "a very good match", "बहुत अच्छा": "Very good", "अच्छा मिलान": "a good match", "मध्यम": "Average", "विवाह योग्य माना जाता है": "considered suitable for marriage",
    "कमज़ोर": "Weak", "18 से कम — परंपरा में अनुशंसित नहीं": "below 18 — not recommended by tradition",
    "एक-दूसरे के लिए बने ✨ — दुर्लभ मेल": "Made for each other ✨ — a rare match", "Strong match 💞 — थोड़ी समझ, बहुत सारा साथ": "Strong match 💞 — a little understanding, a lot of togetherness",
    "Theek-thaak 🙂 — कोशिश से रिश्ता खिलेगा": "Okay-ish 🙂 — effort will make it bloom", "Opposites? 🤔 — पहले खुलकर बात, फिर फ़ैसला": "Opposites? 🤔 — talk openly first, then decide",
    "मांगलिक नहीं": "not manglik", "आंशिक मांगलिक": "partly manglik", "मांगलिक": "manglik",
    "मंगल दोष मिलान": "Mangal dosha match",
    "दोनों मांगलिक हैं, इसलिए परंपरा में दोष आपस में संतुलित माना जाता है।": "both are manglik, so by tradition the dosha is considered balanced.",
    "दोनों में मंगल दोष नहीं — इस दृष्टि से कोई बाधा नहीं।": "neither has mangal dosha — no obstacle on this count.",
    "एक मांगलिक और दूसरा नहीं — इसे पूरी कुण्डली देखकर ही तय करें; कई बार परिहार (दोष कम करने वाले कारक) मौजूद होते हैं।": "one is manglik and the other is not — decide only after seeing both full charts; often there are factors that cancel the dosha.",
    "मंगल दोष विस्तार से जाँचें": "check mangal dosha in detail",
    "अष्टकूट — आठों कूट का हिसाब": "Ashtakoot — all eight kootas", "कूट": "Koota", "क्या देखता है": "What it shows", "गुण": "Points", "कुल": "Total",
    "दोष और परिहार": "Doshas and their cancellation", "✓ नाड़ी, भकूट और गण — तीनों बड़े दोष नहीं हैं।": "✓ No Nadi, Bhakoot or Gana dosha — none of the three major doshas.",
    "गुणों का पारंपरिक अर्थ:": "What the points traditionally mean:", "18 से कम — अनुशंसित नहीं · 18–24 — सामान्य · 25–32 — अच्छा · 33–36 — उत्तम।": "below 18 — not recommended · 18–24 — average · 25–32 — good · 33–36 — excellent.",
    "📲 रिज़ल्ट शेयर करें": "📲 Share result", "ज्योतिषी से पूरा मिलान करवाएँ": "Get a full matching from the astrologer",
    "36 गुण ही सब कुछ नहीं।": "36 points are not everything.", "विवाह में दोनों कुण्डलियों के सप्तम भाव, दशा और मंगल की स्थिति भी देखी जाती है —": "for marriage the 7th house, dasha and Mars in both charts are also studied —",
    "पढ़ें: 36 गुण मिलने पर भी शादियाँ क्यों टूटती हैं": "read: why marriages fail even with 36 points (Hindi)",
    "यह गणना पारंपरिक अष्टकूट तालिकाओं से है (KP अयनांश से चंद्र नक्षत्र)। अलग-अलग पंचांगों में योनि और वश्य जैसे कूट की तालिकाओं में थोड़ा अंतर होता है, इसलिए कभी-कभी 1–2 गुण का फ़र्क दिख सकता है।": "This uses the traditional ashtakoot tables (moon nakshatra with KP ayanamsa). Panchangs differ slightly in tables such as Yoni and Vashya, so a 1–2 point difference is possible.",
    "नाड़ी दोष है, पर दोनों की राशि एक और नक्षत्र अलग हैं — शास्त्रों में इसे नाड़ी दोष का परिहार माना गया है।": "Nadi dosha is present, but both share the same moon sign with different nakshatras — the texts treat this as a cancellation of nadi dosha.",
    "नाड़ी दोष है, पर नक्षत्र एक और राशि अलग है — इसे परिहार माना जाता है।": "Nadi dosha is present, but the nakshatra is the same and the signs differ — this is treated as a cancellation.",
    "नाड़ी दोष है, पर नक्षत्र एक होते हुए चरण अलग हैं — इसे आंशिक परिहार माना जाता है।": "Nadi dosha is present, but with the same nakshatra the padas differ — treated as a partial cancellation.",
    "नाड़ी दोष (0/8) है। परंपरा में इसे गंभीरता से देखा जाता है — पूरी कुंडली मिलान और विशेषज्ञ की सलाह अवश्य लें।": "Nadi dosha (0/8). Tradition takes it seriously — please get a full chart matching and expert advice.",
    "भकूट दोष है, पर दोनों राशियों के स्वामी एक या मित्र हैं — इसे भकूट दोष का परिहार माना जाता है।": "Bhakoot dosha is present, but the lords of both signs are the same or friends — treated as a cancellation.",
    "गण दोष है — स्वभाव में अंतर के कारण धैर्य और संवाद ज़रूरी है।": "Gana dosha — different temperaments call for patience and communication.",
    "आपका लिंक तैयार है!": "Your link is ready!", "WhatsApp पर भेजें": "Send on WhatsApp", "लिंक कॉपी करें": "Copy link", "✓ कॉपी हो गया": "✓ Copied",
    "जन्म समय और स्थान भरने पर 36 गुण का सटीक मिलान होता है; केवल जन्मतिथि पर अनुमानित मिलान।": "With time and place of birth the 36-point match is exact; with only the date it is an estimate.",
    "❤️ हमारा मिलान देखें": "❤️ See our match", "— यह रिज़ल्ट दोनों के लिए है।": "— this result is for both of you."
  };

  var RULES = [
    [/^कृपया भरें\s*[—:]\s*(.*)।$/, function (m, x) { return "Please fill in: " + x + "."; }],
    [/जन्म स्थान \(सूची (?:से|में से) चुनें\)/g, "place of birth (choose from the list)"],
    [/जन्मतिथि/g, "date of birth"], [/जन्म समय/g, "time of birth"],
    [/लड़का: /g, "Boy: "], [/लड़की: /g, "Girl: "],
    [/^गणना नहीं हो सकी: /, "Could not calculate: "],
    [/^भकूट दोष \(([\d-]+)\) है — परिवार और धन से जुड़े विषयों में समझदारी चाहिए।$/, function (m, x) { return "Bhakoot dosha (" + x + ") — family and money matters need care."; }],
    [/% अनुकूलता।/g, "% compatibility."],
    [/ के जन्मदिन पर चंद्रमा का नक्षत्र दिन में बदला था — इसलिए यह अनुमान है। सटीक मिलान के लिए “पूरा गुण मिलान” चुनें।/, ": the Moon changed nakshatra during the day of birth, so this is an estimate. Choose “Full guna milan” for an exact match."],
    [/ ने आपके साथ कुंडली मिलान शुरू किया है!/, " has started a kundali match with you!"],
    [/ को रिज़ल्ट भेजें/, ": send the result"]
  ];

  var X = window.JT_EN_EXTRA || {};
  if (X.dict) for (var k in X.dict) DICT[k] = X.dict[k];
  if (X.rules) RULES = X.rules.concat(RULES);
  var termKeys = Object.keys(TERMS).sort(function (a, b) { return b.length - a.length; });
  var termRe = new RegExp("(" + termKeys.map(function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")(?![\\u0900-\\u097F])", "g");

  function tr(s) {
    var t = s.trim();
    if (!t || !DEV.test(t)) return null;
    if (DICT[t]) return s.replace(t, DICT[t]);
    var o = t;
    for (var i = 0; i < RULES.length; i++) o = o.replace(RULES[i][0], RULES[i][1]);
    if (DICT[o.trim()]) o = DICT[o.trim()];
    // sentences joined with " — ": translate each part on its own
    o = o.split(/(\s*—\s*)/).map(function (part) { var q = part.trim(); return DICT[q] ? part.replace(q, DICT[q]) : part; }).join("");
    o = o.replace(termRe, function (m) { return TERMS[m]; });
    return o !== t ? s.replace(t, o) : null;
  }
  function node(n) {
    if (n.nodeType === 3) {
      var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName) || (p.closest && p.closest("[data-no-en]"))) return;
      var r = tr(n.nodeValue); if (r !== null && r !== n.nodeValue) n.nodeValue = r;
    } else if (n.nodeType === 1) {
      ["placeholder", "aria-label", "title"].forEach(function (a) { var v = n.getAttribute && n.getAttribute(a); if (v) { var r = tr(v); if (r !== null) n.setAttribute(a, r); } });
      if (/^(SCRIPT|STYLE)$/.test(n.nodeName)) return;
      for (var c = n.firstChild; c; c = c.nextSibling) node(c);
    }
  }
  function start() {
    node(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === "characterData") node(m.target);
        else if (m.type === "attributes") node(m.target);
        else m.addedNodes.forEach(node);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
