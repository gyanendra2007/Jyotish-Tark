/**
 * ============================================================================
 * JYOTISH TARK — MASTER VEDIC ASTROLOGY & CHALDEAN NUMEROLOGY ENGINE
 * File: kundali-engine.js  •  v3.0 (Deep-Reading Edition)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Powers the 30-Minute Deep-Reading Life Dossier (English & हिंदी)
 * Chapters 1–12 with real Parashari Ashtakavarga + per-planet BAV matrix.
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. CORE DATABASES
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
    1:  { id:1, en:"Mesha (Aries)",     hi:"मेष (Aries)",     lord:"Mars",    lordHi:"मंगल",
          element:"Fire (अग्नि)",  elementHi:"अग्नि तत्व",  quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          temperamentEn:"fiercely independent, pioneering, and instinctively allergic to being controlled",
          temperamentHi:"अत्यंत स्वतंत्र, अग्रणी और किसी के नियंत्रण में न रहने वाला",
          bodyBuildEn:"sharp facial angles, intense gaze, and a brisk commanding walk",
          bodyBuildHi:"तेज आंखें, तीखे नैन-नक्श और आत्मविश्वास भरी चाल" },
    2:  { id:2, en:"Vrishabha (Taurus)", hi:"वृषभ (Taurus)",   lord:"Venus",   lordHi:"शुक्र",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          temperamentEn:"grounded, loyal to the bone, patient until provoked, and resource-smart",
          temperamentHi:"स्थिर बुद्धि, अपनों के प्रति समर्पित, धैर्यवान और संसाधन-कुशल",
          bodyBuildEn:"graceful features, expressive eyes, and a soothing magnetic presence",
          bodyBuildHi:"सौम्य आकर्षक चेहरा, सुंदर आंखें और शांत आभा" },
    3:  { id:3, en:"Mithuna (Gemini)",   hi:"मिथुन (Gemini)",   lord:"Mercury", lordHi:"बुध",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          temperamentEn:"hyper-intelligent, adaptable, witty, and mentally three steps ahead of the room",
          temperamentHi:"तीव्र बुद्धि, वाक्पटु, हर परिस्थिति में ढलने वाले",
          bodyBuildEn:"youthful appearance, sparkling observant eyes, and expressive hands",
          bodyBuildHi:"उम्र से कम दिखने वाला चेहरा, चंचल आंखें और प्रभावशाली मुस्कान" },
    4:  { id:4, en:"Karka (Cancer)",     hi:"कर्क (Cancer)",     lord:"Moon",    lordHi:"चंद्रमा",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          temperamentEn:"deeply intuitive, protective, and privately guarded behind a caring exterior",
          temperamentHi:"अत्यंत संवेदनशील, अंतर्ज्ञानी और अपनों की रक्षा करने वाले",
          bodyBuildEn:"soft luminescent complexion, soulful eyes, and a comforting presence",
          bodyBuildHi:"सौम्य आभा, गहरी भावुक आंखें और अपनापन देने वाला व्यक्तित्व" },
    5:  { id:5, en:"Simha (Leo)",        hi:"सिंह (Leo)",        lord:"Sun",     lordHi:"सूर्य",
          element:"Fire (अग्नि)",   elementHi:"अग्नि तत्व",   quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          temperamentEn:"regal, self-respecting, generous, and born to command rather than follow",
          temperamentHi:"स्वाभिमानी, उदार हृदय और नेतृत्व क्षमता से भरपूर",
          bodyBuildEn:"commanding posture, broad forehead, and a lion-like dignified stride",
          bodyBuildHi:"रौबदार व्यक्तित्व, चौड़ा माथा और राजसी आभा" },
    6:  { id:6, en:"Kanya (Virgo)",      hi:"कन्या (Virgo)",     lord:"Mercury", lordHi:"बुध",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          temperamentEn:"analytical, perfectionist, quietly observant of flaws, and ruthlessly practical",
          temperamentHi:"सूक्ष्म विश्लेषक, पूर्णतावादी और तार्किक",
          bodyBuildEn:"neat refined features, intelligent eyes, and a well-groomed poised look",
          bodyBuildHi:"सुव्यवस्थित और सलीकेदार व्यक्तित्व, तीक्ष्ण आंखें" },
    7:  { id:7, en:"Tula (Libra)",       hi:"तुला (Libra)",      lord:"Venus",   lordHi:"शुक्र",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          temperamentEn:"diplomatic, aesthetically refined, charming, and wired for partnership",
          temperamentHi:"न्यायप्रिय, संतुलित, कला के पारखी और व्यवहार-कुशल",
          bodyBuildEn:"proportionate attractive features, warm smile, and a natural stylish grace",
          bodyBuildHi:"आकर्षक नैन-नक्श, मोहक मुस्कान और शालीन अंदाज" },
    8:  { id:8, en:"Vrishchika (Scorpio)",hi:"वृश्चिक (Scorpio)",lord:"Mars",    lordHi:"मंगल",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          temperamentEn:"intense, investigative, phoenix-like in resilience, and impossible to fool",
          temperamentHi:"गूढ़, गहरी शोधवृत्ति वाले और संकटों से फीनिक्स की तरह उठने वाले",
          bodyBuildEn:"piercing hypnotic eyes, magnetic aura, and unmistakable quiet intensity",
          bodyBuildHi:"आंखों में चुंबकीय आकर्षण और रहस्यमयी गंभीरता" },
    9:  { id:9, en:"Dhanu (Sagittarius)",hi:"धनु (Sagittarius)",lord:"Jupiter", lordHi:"बृहस्पति (गुरु)",
          element:"Fire (अग्नि)",   elementHi:"अग्नि तत्व",   quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"East (पूर्व)",  directionHi:"पूर्व दिशा",
          temperamentEn:"philosophical, truth-speaking, dharmic, and driven by higher purpose",
          temperamentHi:"सत्यवादी, दूरदर्शी, उच्च आदर्शों वाले और ज्ञान के उपासक",
          bodyBuildEn:"tall or well-built frame, bright forehead, and an optimistic energetic stride",
          bodyBuildHi:"तेजस्वी ललाट, सकारात्मक ऊर्जा और प्रभावशाली कद" },
    10: { id:10,en:"Makara (Capricorn)", hi:"मकर (Capricorn)",  lord:"Saturn",  lordHi:"शनि",
          element:"Earth (पृथ्वी)", elementHi:"पृथ्वी तत्व", quality:"Movable (चर)",      qualityHi:"चर राशि",
          direction:"South (दक्षिण)",directionHi:"दक्षिण दिशा",
          temperamentEn:"strategic, relentless, self-made, and unshakeable under pressure",
          temperamentHi:"कर्मप्रधान, रणनीतिकार, कठिन परिश्रम से साम्राज्य खड़ा करने वाले",
          bodyBuildEn:"defined bone structure, mature composed look, and steady walk",
          bodyBuildHi:"गंभीर और परिपक्व व्यक्तित्व, गहरी सोच वाली आंखें" },
    11: { id:11,en:"Kumbha (Aquarius)",  hi:"कुंभ (Aquarius)",  lord:"Saturn",  lordHi:"शनि",
          element:"Air (वायु)",     elementHi:"वायु तत्व",    quality:"Fixed (स्थिर)",     qualityHi:"स्थिर राशि",
          direction:"West (पश्चिम)", directionHi:"पश्चिम दिशा",
          temperamentEn:"unconventional, futuristic, humanitarian, and fiercely protective of solitude",
          temperamentHi:"लीक से हटकर सोचने वाले, दार्शनिक और जनकल्याणकारी",
          bodyBuildEn:"distinctive features, visionary gaze, and an intellectual aura",
          bodyBuildHi:"बुद्धिजीवी आभा, विचारशील आंखें और अलग पहचान वाला व्यक्तित्व" },
    12: { id:12,en:"Meena (Pisces)",     hi:"मीन (Pisces)",      lord:"Jupiter", lordHi:"बृहस्पति (गुरु)",
          element:"Water (जल)",     elementHi:"जल तत्व",      quality:"Dual (द्विस्वभाव)", qualityHi:"द्विस्वभाव राशि",
          direction:"North (उत्तर)", directionHi:"उत्तर दिशा",
          temperamentEn:"spiritually gifted, empathetic, imaginative, and guided by prophetic intuition",
          temperamentHi:"आध्यात्मिक, परोपकारी और पूर्वाभास की शक्ति से युक्त",
          bodyBuildEn:"dreamy oceanic eyes, serene aura, and a deeply soothing voice",
          bodyBuildHi:"शांत गहरी आंखें, दिव्य आभा और मधुर वाणी" }
  };

  const NAKSHATRA_DATA = {
    1:{name:"Ashwini (अश्विनी)",ruler:"Ketu",traitEn:"lightning-fast healing, pioneering speed, and instinctive brilliance",traitHi:"तीव्र निर्णय क्षमता, आरोग्य शक्ति और अग्रणी रहने की ऊर्जा"},
    2:{name:"Bharani (भरणी)",ruler:"Venus",traitEn:"intense creative transformation and fearless truth-bearing",traitHi:"गहन सृजन शक्ति, सत्य के प्रति निष्ठा और बड़े परिवर्तन सहने की क्षमता"},
    3:{name:"Krittika (कृत्तिका)",ruler:"Sun",traitEn:"razor-sharp discernment and purifying leadership fire",traitHi:"अग्नि जैसा तेज, स्पष्टवादिता और नेतृत्व क्षमता"},
    4:{name:"Rohini (रोहिणी)",ruler:"Moon",traitEn:"magnetic charm, wealth creation, and artistic abundance",traitHi:"अद्भुत आकर्षण, धन-संपदा का सृजन और कलात्मक समृद्धि"},
    5:{name:"Mrigashira (मृगशिरा)",ruler:"Mars",traitEn:"relentless intellectual quest and youthful agility",traitHi:"ज्ञान की निरंतर खोज, शोध प्रवृत्ति और कुशाग्र बुद्धि"},
    6:{name:"Ardra (आर्द्रा)",ruler:"Rahu",traitEn:"storm-after-clarity genius and breakthrough innovation",traitHi:"संघर्षों के बाद अद्भुत सफलता और लीक से हटकर आविष्कार"},
    7:{name:"Punarvasu (पुनर्वसु)",ruler:"Jupiter",traitEn:"divine bounce-back power and boundless renewal",traitHi:"हर संकट से दोगुनी शक्ति से वापसी और सात्विक ज्ञान"},
    8:{name:"Pushya (पुष्य)",ruler:"Saturn",traitEn:"supreme nourishment, dharmic discipline, and enduring prosperity",traitHi:"धर्म, अनुशासन और स्थायी राजयोग देने की शक्ति"},
    9:{name:"Ashlesha (आश्लेषा)",ruler:"Mercury",traitEn:"hypnotic psychological insight and strategic brilliance",traitHi:"सामने वाले के मन को पढ़ लेने की रहस्यमयी क्षमता और कूटनीति"},
    10:{name:"Magha (मघा)",ruler:"Ketu",traitEn:"royal ancestral authority and throne-consciousness",traitHi:"पितृ कृपा, राजसी स्वाभिमान और उच्च पद का प्रारब्ध"},
    11:{name:"Purva Phalguni (पूर्वा फाल्गुनी)",ruler:"Venus",traitEn:"charismatic magnetism and creative enjoyment",traitHi:"सौभाग्य, कलात्मक आकर्षण और विशेष लोकप्रियता"},
    12:{name:"Uttara Phalguni (उत्तरा फाल्गुनी)",ruler:"Sun",traitEn:"noble contracts, lifelong reliability, and self-earned sovereignty",traitHi:"वचनबद्धता, स्थायी संबंध और स्व-अर्जित प्रतिष्ठा"},
    13:{name:"Hasta (हस्त)",ruler:"Moon",traitEn:"manifestation through skill and clever execution",traitHi:"हाथों में जादू, कर्म-कौशल और भाग्य निर्माण की शक्ति"},
    14:{name:"Chitra (चित्रा)",ruler:"Mars",traitEn:"architectural perfection and charismatic mystique",traitHi:"सृजन कौशल, सौंदर्य बोध और अद्भुत आकर्षण"},
    15:{name:"Swati (स्वाती)",ruler:"Rahu",traitEn:"unyielding independence and self-propelled rise",traitHi:"स्वतंत्र अस्तित्व, व्यापारिक चतुरता और अपनी शर्तों पर जीने की कला"},
    16:{name:"Vishakha (विशाखा)",ruler:"Jupiter",traitEn:"single-pointed ambition and triumphant conquest",traitHi:"लक्ष्य पर एकाग्र दृष्टि और अंततः विजय"},
    17:{name:"Anuradha (अनुराधा)",ruler:"Saturn",traitEn:"lotus-in-mud resilience and deep friendship",traitHi:"कठिन परिस्थितियों में भी खिलने की शक्ति"},
    18:{name:"Jyeshtha (ज्येष्ठा)",ruler:"Mercury",traitEn:"protective seniority and sharp occult intellect",traitHi:"संकटमोचक नेतृत्व और गूढ़ विद्याओं में रुचि"},
    19:{name:"Mula (मूल)",ruler:"Ketu",traitEn:"root-level truth extraction and fearless rebuilding",traitHi:"हर समस्या की जड़ तक पहुंचने की क्षमता"},
    20:{name:"Purva Ashadha (पूर्वाषाढ़ा)",ruler:"Venus",traitEn:"invincible conviction and victorious momentum",traitHi:"अजेय आत्मविश्वास और कभी हार न मानने वाला स्वभाव"},
    21:{name:"Uttara Ashadha (उत्तराषाढ़ा)",ruler:"Sun",traitEn:"permanent victory and peak late-blooming authority",traitHi:"स्थायी विजय, अखंड निष्ठा और उत्तरार्ध में अजेय सफलता"},
    22:{name:"Shravana (श्रवण)",ruler:"Moon",traitEn:"master listening and organizational fame",traitHi:"गहरी श्रवण शक्ति, विद्या और उच्च प्रशासनिक प्रतिष्ठा"},
    23:{name:"Dhanishta (धनिष्ठा)",ruler:"Mars",traitEn:"impeccable timing and multi-dimensional ambition",traitHi:"धन-संपदा का संचय और बहुमुखी प्रतिभा"},
    24:{name:"Shatabhisha (शतभिषा)",ruler:"Rahu",traitEn:"hundred-healer diagnostic power and solitary genius",traitHi:"सौ वैद्यों जैसी निदान शक्ति और स्वतंत्र चिंतन"},
    25:{name:"Purva Bhadrapada (पूर्वा भाद्रपद)",ruler:"Jupiter",traitEn:"fierce spiritual fire and unconventional wealth",traitHi:"आध्यात्मिक तेज, क्रांतिकारी विचार और असाधारण धन"},
    26:{name:"Uttara Bhadrapada (उत्तरा भाद्रपद)",ruler:"Saturn",traitEn:"deep ocean-floor stability and kundalini wisdom",traitHi:"समुद्र जैसा धैर्य और स्थायी विरासत"},
    27:{name:"Revati (रेवती)",ruler:"Mercury",traitEn:"safe-passage intuition and spiritual completion",traitHi:"सौभाग्यशाली यात्राएं, करुणा और आध्यात्मिक पूर्णता"}
  };

  const PLANET_META = {
    Sun:     {en:"Sun (Surya)",         hi:"सूर्य (Sun)",         karakaEn:"Soul, authority, father, royal dignity, and self-worth",     karakaHi:"आत्मा, स्वाभिमान, पिता, राजसत्ता एवं उच्च पद",       exalted:1,  debilitated:7,  own:[5],     aspects:[7]},
    Moon:    {en:"Moon (Chandra)",      hi:"चंद्रमा (Moon)",      karakaEn:"Mind, emotions, mother, intuition, and liquid flow",         karakaHi:"मन, भावनाएं, माता, अंतर्ज्ञान एवं नकदी प्रवाह",       exalted:2,  debilitated:8,  own:[4],     aspects:[7]},
    Mars:    {en:"Mars (Mangal)",       hi:"मंगल (Mars)",         karakaEn:"Courage, willpower, land, siblings, and execution fire",    karakaHi:"साहस, पराक्रम, भूमि-संपत्ति, भाई एवं निर्णय शक्ति",  exalted:10, debilitated:4,  own:[1,8],   aspects:[4,7,8]},
    Mercury: {en:"Mercury (Budh)",      hi:"बुध (Mercury)",       karakaEn:"Intellect, speech, trade, logic, and nervous system",       karakaHi:"बुद्धि, वाणी, व्यापार, तर्कशक्ति एवं विश्लेषण",       exalted:6,  debilitated:12, own:[3,6],   aspects:[7]},
    Jupiter: {en:"Jupiter (Guru)",      hi:"बृहस्पति / गुरु",     karakaEn:"Divine grace, wisdom, wealth expansion, children, husband-karaka",karakaHi:"भाग्य, ज्ञान, धन-वृद्धि, संतान एवं पति कारक",   exalted:4,  debilitated:10, own:[9,12],  aspects:[5,7,9]},
    Venus:   {en:"Venus (Shukra)",      hi:"शुक्र (Venus)",       karakaEn:"Romance, spouse/wife-karaka, luxury, vehicles, charisma",    karakaHi:"प्रेम, दांपत्य सुख, वैभव एवं आकर्षण",               exalted:12, debilitated:6,  own:[2,7],   aspects:[7]},
    Saturn:  {en:"Saturn (Shani)",      hi:"शनि (Saturn)",        karakaEn:"Karma, justice, longevity, mass authority, steadfast rise", karakaHi:"कर्मफल दाता, न्याय, दीर्घायु एवं संघर्ष के बाद साम्राज्य", exalted:7,  debilitated:1,  own:[10,11], aspects:[3,7,10]},
    Rahu:    {en:"Rahu (North Node)",   hi:"राहु (Rahu)",         karakaEn:"Obsession, sudden amplifier, foreign links, unconventional fame",karakaHi:"अचानक उछाल, महत्वाकांक्षा, विदेश योग एवं तकनीक",  exalted:2,  debilitated:8,  own:[11],    aspects:[5,7,9]},
    Ketu:    {en:"Ketu (South Node)",   hi:"केतु (Ketu)",         karakaEn:"Past-life mastery, detachment, occult intuition, sudden cuts", karakaHi:"पूर्वजन्म का संचित ज्ञान, वैराग्य एवं पूर्वाभास",   exalted:8,  debilitated:2,  own:[8],     aspects:[5,7,9]}
  };

  const BHAVA_MEANINGS = {
    1:  {en:"1st House (Tanu Bhava — self, aura, vitality, life direction)",                                                                         hi:"प्रथम भाव (लग्न/तनु — व्यक्तित्व, शरीर, आत्मबल)"},
    2:  {en:"2nd House (Dhana Bhava — bank balance, speech, lineage, accumulated wealth)",                                                            hi:"द्वितीय भाव (धन एवं कुटुंब — बैंक बैलेंस, वाणी, कुल)"},
    3:  {en:"3rd House (Parakrama Bhava — self-effort, courage, communication, siblings)",                                                            hi:"तृतीय भाव (पराक्रम — साहस, संवाद, छोटे भाई-बहन)"},
    4:  {en:"4th House (Sukha Bhava — inner peace, mother, real estate, vehicles, homeland)",                                                         hi:"चतुर्थ भाव (सुख एवं मातृ — मानसिक शांति, माता, भूमि, वाहन)"},
    5:  {en:"5th House (Vidya & Purva-Punya Bhava — past-life merit, intelligence, romance, children)",                                              hi:"पंचम भाव (विद्या एवं पूर्व-पुण्य — मेधा, प्रेम, संतान)"},
    6:  {en:"6th House (Rog & Shatru Bhava — daily grind, competition, litigation, service)",                                                        hi:"षष्ठ भाव (रोग एवं शत्रु — प्रतियोगिता, नौकरी, दैनिक संघर्ष)"},
    7:  {en:"7th House (Kalatra Bhava — marriage, spouse nature, business partnerships, public image)",                                              hi:"सप्तम भाव (कलत्र — जीवनसाथी, विवाह, साझेदारी)"},
    8:  {en:"8th House (Randhra Bhava — sudden transformations, occult, in-laws, unearned wealth, secrets)",                                          hi:"अष्टम भाव (आयु एवं गुप्त — आकस्मिक परिवर्तन, ससुराल, शोध)"},
    9:  {en:"9th House (Bhagya Bhava — divine grace, higher wisdom, gurus, father, long journeys)",                                                    hi:"नवम भाव (भाग्य एवं धर्म — ईश्वरीय कृपा, गुरु, पिता)"},
    10: {en:"10th House (Karma Bhava — career peak, status, command, reputation)",                                                                     hi:"दशम भाव (कर्म एवं राज्य — करियर, सत्ता, पद-प्रतिष्ठा)"},
    11: {en:"11th House (Labha Bhava — massive gains, desire fulfilment, influential networks)",                                                       hi:"एकादश भाव (लाभ एवं इच्छापूर्ति — आय के स्रोत, नेटवर्क)"},
    12: {en:"12th House (Vyaya & Moksha Bhava — foreign lands, sleep, secret enemies, losses, liberation)",                                            hi:"द्वादश भाव (व्यय एवं मोक्ष — विदेश, अवचेतन, गुप्त खर्च)"}
  };

  const MULANK_ARCHETYPES = {
    1:{ruler:"Sun (सूर्य)", titleEn:"The Sovereign Pioneer (Number 1 — Royal Sun)",
       psychEn:"Governed by Number 1 (Surya), your soul carries an innate refusal to be second-best. People see your composed exterior, but very few realize the immense pressure you put on yourself to remain self-reliant. You dislike asking for favors even when exhausted. Whenever someone tries to micromanage you, an instant internal rebellion switches on.",
       psychHi:"मूलांक 1 (सूर्य) से शासित आपकी आत्मा में जन्मजात नेतृत्व और स्वाभिमान है। बाहर से लोग आपको मजबूत समझते हैं, पर बहुत कम जानते हैं कि आप अपनी समस्याएं अकेले सुलझाने का भारी दबाव झेलते हैं। किसी के अधीन काम करना आपको बिल्कुल पसंद नहीं।"},
    2:{ruler:"Moon (चंद्रमा)", titleEn:"The Intuitive Empath (Number 2 — Moon-Ruled)",
       psychEn:"Governed by Number 2 (Chandra), your mind acts like a high-frequency emotional radar. Within thirty seconds of meeting someone, you sense their unspoken intentions. However, your greatest blessing is also your heaviest burden: you absorb the stress of people around you, overthink small tonal shifts, and give 100% emotionally to people who often return 30%.",
       psychHi:"मूलांक 2 (चंद्रमा) के कारण आपका मन एक संवेदनशील रडार की तरह काम करता है। किसी से मिलने के कुछ ही मिनटों में आप उसकी असली नीयत भांप लेते हैं। लेकिन सबसे बड़ी चुनौती यह है कि आप दूसरों के व्यवहार के छोटे बदलाव को भी गहराई से सोचते हैं और जितना समर्पण देते हैं, उतना नहीं मिल पाता।"},
    3:{ruler:"Jupiter (बृहस्पति)", titleEn:"The Dharmic Strategist (Number 3 — Jupiter-Ruled)",
       psychEn:"Ruled by Number 3 (Brihaspati), you possess a rare combination of knowledge-hunger and fierce self-respect. You cannot tolerate hypocrisy, shallow gossip, or disrespect toward your principles. People constantly come to you for advice when their lives fall apart, yet when you need guidance, you rarely find someone matching your mental maturity.",
       psychHi:"मूलांक 3 (बृहस्पति) से आपमें ज्ञान, स्वाभिमान और महत्वाकांक्षा का अद्भुत संगम है। संकट में लोग आपसे सलाह लेते हैं, पर जब आपको खुद सहारे की जरूरत होती है, तो आपके स्तर का इंसान आसानी से नहीं मिलता।"},
    4:{ruler:"Rahu (राहु)", titleEn:"The Unconventional Maverick (Number 4 — Rahu-Ruled)",
       psychEn:"Governed by Number 4 (Rahu), your life never follows a straight textbook line. You question outdated rules, think from angles others never notice, and often feel misunderstood by your own family. Sudden reversals and sudden breakthroughs are the signature of your destiny—what others get easily in one attempt often tests your patience first before delivering tenfold results.",
       psychHi:"मूलांक 4 (राहु) के कारण आपका जीवन कभी सीधी रेखा में नहीं चलता। आपकी सोच समाज की रूढ़ियों से अलग होती है, जिसके कारण कई बार अपने ही लोग आपको गलत समझते हैं। सफलता और बदलाव आपके जीवन में हमेशा अचानक आते हैं।"},
    5:{ruler:"Mercury (बुध)", titleEn:"The Quick-Silver Architect (Number 5 — Mercury-Ruled)",
       psychEn:"Ruled by Number 5 (Budh), your brain processes logic, risk, and human psychology at lightning speed. You despise monotony and stagnation. Even after a major setback, you possess an extraordinary elastic bounce-back ability. Yet inwardly, your nervous system rarely switches off—even while resting, your mind is calculating the next three moves.",
       psychHi:"मूलांक 5 (बुध) से आपका मस्तिष्क बिजली की गति से गणना करता है। आपको बोरिंग जिंदगी पसंद नहीं। बड़ी असफलता के बाद भी आप तुरंत खुद को संभाल लेते हैं, हालांकि भीतर ही भीतर आपका दिमाग रात को भी भविष्य की योजनाओं में उलझा रहता है।"},
    6:{ruler:"Venus (शुक्र)", titleEn:"The Magnetic Harmonizer (Number 6 — Venus-Ruled)",
       psychEn:"Governed by Number 6 (Shukra), you carry unmistakable personal magnetism, aesthetic refinement, and deep capacity for love and family responsibility. You crave quality, peace, and genuine emotional warmth. Your secret vulnerability is that you often sacrifice your own comfort to keep peace in relationships, silently enduring ungrateful behavior for too long.",
       psychHi:"मूलांक 6 (शुक्र) से आपके व्यक्तित्व में स्वाभाविक आकर्षण और कलात्मकता है। आप परिवार और प्रियजनों के लिए खुशियों का त्याग कर देते हैं। सबसे बड़ी कमजोरी यह है कि आप भावनात्मक रिश्तों में जल्दी भरोसा करके अपना सुकून दांव पर लगा देते हैं।"},
    7:{ruler:"Ketu (केतु)", titleEn:"The Mystic Seeker (Number 7 — Ketu-Ruled)",
       psychEn:"Ruled by Number 7 (Ketu), you are an old soul walking in the modern world. You have prophetic intuition—dreams, gut feelings, and sudden realizations that come true weeks later. Even when surrounded by a crowd, a quiet corner of your soul feels detached. You cannot settle for surface-level answers; you dissect everything down to its hidden truth.",
       psychHi:"मूलांक 7 (केतु) से आपकी अंतरात्मा गहरी और रहस्यमयी है। आपका 'सिक्स्थ सेंस' इतना प्रबल है कि भविष्य की घटनाओं का आभास पहले ही हो जाता है। भीड़ में भी आप भीतर से अलग एकांत महसूस करते हैं और दिखावे से जल्दी ऊब जाते हैं।"},
    8:{ruler:"Saturn (शनि)", titleEn:"The Karmic Judge (Number 8 — Saturn-Ruled)",
       psychEn:"Governed by Number 8 (Shani), you are forged in the furnace of real-world experience. Nothing comes on a silver platter without testing your endurance first. You are deeply misunderstood—people think you are cold, whereas in reality you carry the heaviest sense of duty toward those you love. Once you cross your karmic threshold, your rise is permanent and unshakeable.",
       psychHi:"मूलांक 8 (शनि) के प्रभाव से आपका जीवन संघर्ष की भट्टी में तपकर कुंदन बनने वाला है। बिना परीक्षा दिए कुछ नहीं मिलता। लोग आपको बाहर से कठोर समझते हैं, जबकि भीतर से आप न्यायप्रिय और अपनों की जिम्मेदारी उठाने वाले हैं। सफलता भले देर से आए, पर स्थायी और विशाल होती है।"},
    9:{ruler:"Mars (मंगल)", titleEn:"The Fearless Commander (Number 9 — Mars-Ruled)",
       psychEn:"Ruled by Number 9 (Mangal), your bloodstream runs on courage, conviction, and protective fire. You will fight to the last breath for someone you care about, and you cannot fake sweetness when someone is wrong. Your exterior is tough like armor, yet internally you have a surprisingly soft heart that gets deeply hurt when people betray your loyalty.",
       psychHi:"मूलांक 9 (मंगल) से आपमें अदम्य साहस और स्पष्टवादिता है। अन्याय या झूठी चापलूसी आप बर्दाश्त नहीं कर पाते। बाहर से सख्त दिखते हैं, भीतर से भावुक और मददगार हैं—लेकिन जब अपने ही लोग वफादारी की कद्र नहीं करते, तो गहरा आघात लगता है।"}
  };

  const VIMSHOTTARI_ORDER = [
    {lord:"Ketu",years:7,hi:"केतु"},
    {lord:"Venus",years:20,hi:"शुक्र"},
    {lord:"Sun",years:6,hi:"सूर्य"},
    {lord:"Moon",years:10,hi:"चंद्र"},
    {lord:"Mars",years:7,hi:"मंगल"},
    {lord:"Rahu",years:18,hi:"राहु"},
    {lord:"Jupiter",years:16,hi:"गुरु"},
    {lord:"Saturn",years:19,hi:"शनि"},
    {lord:"Mercury",years:17,hi:"बुध"}
  ];

  // ==========================================================================
  // 2. REAL PARASHARI ASHTAKAVARGA RULES (Classical Bhinnashtakavarga)
  //    Each array holds the houses (1-indexed from the reference planet)
  //    that receive a benefic bindu for the given planet.
  // ==========================================================================

  const ASHTAKAVARGA_RULES = {
    Sun: {
      Sun:     [1,2,4,7,8,9,10,11],
      Moon:    [3,6,10,11],
      Mars:    [1,2,4,7,8,9,10,11],
      Mercury: [3,5,6,9,10,11,12],
      Jupiter: [5,6,9,11],
      Venus:   [6,7,12],
      Saturn:  [1,2,4,7,8,9,10,11],
      Asc:     [3,4,6,10,11,12]
    },
    Moon: {
      Sun:     [3,6,7,8,10,11],
      Moon:    [1,3,6,7,10,11],
      Mars:    [2,3,5,6,9,10,11],
      Mercury: [1,3,4,5,7,8,10,11],
      Jupiter: [1,4,7,8,10,11,12],
      Venus:   [3,4,5,7,9,10,11],
      Saturn:  [3,5,6,11],
      Asc:     [3,6,10,11]
    },
    Mars: {
      Sun:     [3,5,6,10,11],
      Moon:    [3,6,11],
      Mars:    [1,2,4,7,8,10,11],
      Mercury: [3,5,6,11],
      Jupiter: [6,10,11,12],
      Venus:   [6,8,11,12],
      Saturn:  [1,4,7,8,9,10,11],
      Asc:     [1,3,6,10,11]
    },
    Mercury: {
      Sun:     [5,6,9,11,12],
      Moon:    [2,4,6,8,10,11],
      Mars:    [1,2,4,7,8,9,10,11],
      Mercury: [1,3,5,6,9,10,11,12],
      Jupiter: [6,8,11,12],
      Venus:   [1,2,3,4,5,8,9,11],
      Saturn:  [1,2,4,7,8,9,10,11],
      Asc:     [1,2,4,6,8,10,11]
    },
    Jupiter: {
      Sun:     [1,2,3,4,7,8,9,10,11],
      Moon:    [2,5,7,9,11],
      Mars:    [1,2,4,7,8,10,11],
      Mercury: [1,2,4,5,6,9,10,11],
      Jupiter: [1,2,3,4,7,8,10,11],
      Venus:   [2,5,6,9,10,11],
      Saturn:  [3,5,6,12],
      Asc:     [1,2,4,5,6,7,9,10,11]
    },
    Venus: {
      Sun:     [8,11,12],
      Moon:    [1,2,3,4,5,8,9,11,12],
      Mars:    [3,4,6,9,11,12],
      Mercury: [3,5,6,9,11],
      Jupiter: [5,8,9,10,11],
      Venus:   [1,2,3,4,5,8,9,10,11],
      Saturn:  [3,4,5,8,9,10,11],
      Asc:     [1,2,3,4,5,8,9,11]
    },
    Saturn: {
      Sun:     [1,2,4,7,8,10,11],
      Moon:    [3,6,11],
      Mars:    [3,5,6,10,11,12],
      Mercury: [6,8,9,10,11,12],
      Jupiter: [5,6,11,12],
      Venus:   [6,11,12],
      Saturn:  [3,5,6,11],
      Asc:     [1,3,4,6,10,11]
    }
  };

  // ==========================================================================
  // 3. MATH & ASTROLOGICAL HELPERS
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

  function buildDerivedChartFromDobAndName(numData, chaldean) {
    const sunRashi = deriveSiderealSunRashi(numData.month, numData.day);
    const epochDays = Math.floor(new Date(numData.year, numData.month - 1, numData.day).getTime() / 86400000);

    const moonNak = ((Math.abs(epochDays * 13 + chaldean.compound) % 27) + 1);
    const moonRashi = Math.min(12, Math.max(1, Math.ceil((moonNak * 12) / 27)));
    const ascRashi = ((sunRashi + numData.mulank + chaldean.single - 2) % 12) + 1;

    const jupRashi  = ((numData.year - 1900 + Math.floor(numData.month / 6)) % 12) + 1;
    const satRashi  = ((Math.floor((numData.year - 1900) / 2.46) + 9) % 12) + 1;
    const rahuRashi = (12 - (Math.floor((numData.year - 1900) / 1.55) % 12)) || 12;
    const ketuRashi = ((rahuRashi + 5) % 12) + 1;
    const mercRashi = ((sunRashi + (numData.day % 3) - 1 + 12) % 12) + 1;
    const venRashi  = ((sunRashi + (chaldean.compound % 3) - 1 + 12) % 12) + 1;
    const marsRashi = ((sunRashi + numData.bhagyank) % 12) + 1;

    const makeNak = (rashiId, seed) => {
      const baseNak = Math.max(1, Math.min(27, Math.round(((rashiId - 0.5) * 27) / 12)));
      return ((baseNak + (seed % 2) - 1) % 27) + 1;
    };
    const makeD9 = (rashiId, seed) => ((rashiId * 3 + seed) % 12) + 1;

    return {
      isFullChartMode: false,
      Asc:     {d1:ascRashi, nak:makeNak(ascRashi,1), d9:makeD9(ascRashi, numData.mulank), retro:false},
      Sun:     {d1:sunRashi, nak:makeNak(sunRashi,2), d9:makeD9(sunRashi,1), retro:false},
      Moon:    {d1:moonRashi,nak:moonNak,             d9:makeD9(moonRashi,2), retro:false},
      Mars:    {d1:marsRashi,nak:makeNak(marsRashi,3),d9:makeD9(marsRashi,3), retro:(numData.day % 7 === 0)},
      Mercury: {d1:mercRashi,nak:makeNak(mercRashi,4),d9:makeD9(mercRashi,4), retro:(numData.day % 5 === 0)},
      Jupiter: {d1:jupRashi, nak:makeNak(jupRashi,5), d9:makeD9(jupRashi,5), retro:(numData.month % 4 === 0)},
      Venus:   {d1:venRashi, nak:makeNak(venRashi,6), d9:makeD9(venRashi,6), retro:false},
      Saturn:  {d1:satRashi, nak:makeNak(satRashi,7), d9:makeD9(satRashi,7), retro:(numData.month % 3 === 0)},
      Rahu:    {d1:rahuRashi,nak:makeNak(rahuRashi,8),d9:makeD9(rahuRashi,8), retro:true},
      Ketu:    {d1:ketuRashi,nak:makeNak(ketuRashi,2),d9:(((makeD9(rahuRashi,8)+5)%12)+1), retro:true}
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

  function evaluatePlanetDignity(planetKey, pData) {
    const meta = PLANET_META[planetKey];
    const isVargottama   = pData.d1 === pData.d9;
    const isExaltedD1    = pData.d1 === meta.exalted;
    const isDebilitatedD1= pData.d1 === meta.debilitated;
    const isOwnD1        = meta.own.includes(pData.d1);
    const isExaltedD9    = pData.d9 === meta.exalted;
    const isDebilitatedD9= pData.d9 === meta.debilitated;
    const isOwnD9        = meta.own.includes(pData.d9);

    let statusEn = "Balanced functional state";
    let statusHi = "सामान्य क्रियाशील अवस्था";
    let badgeClass = "bg-purple-500/20 text-purple-200 border-purple-400/40";

    if (isExaltedD1 && isVargottama) {
      statusEn = "Supreme Uchcha Vargottama (peak exaltation in both D1 & D9)";
      statusHi = "सर्वोच्च उच्च वर्गोत्तम (लग्न एवं नवांश दोनों में उच्च)";
      badgeClass = "bg-amber-500/30 text-amber-200 border-amber-400";
    } else if (isExaltedD1) {
      statusEn = "Exalted (Uchcha) in birth chart";
      statusHi = "जन्म कुंडली में उच्च (Uchcha)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isOwnD1) {
      statusEn = "Swakshetra (own sign — high strength)";
      statusHi = "स्वराशिस्थ (अपनी राशि में बलवान)";
      badgeClass = "bg-emerald-500/25 text-emerald-200 border-emerald-400/50";
    } else if (isDebilitatedD1 && (isExaltedD9 || isOwnD9)) {
      statusEn = "Neechabhanga Raja Yoga (debilitated in D1 but elevated in D9)";
      statusHi = "नीचभंग राजयोग (लग्न में नीच परंतु नवांश में उच्च)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    } else if (isDebilitatedD1) {
      statusEn = "Debilitated (Neecha — karmic friction, delayed fruit)";
      statusHi = "नीचस्थ (संघर्ष एवं विलंब से फल)";
      badgeClass = "bg-red-500/25 text-red-200 border-red-400/50";
    } else if (isVargottama) {
      statusEn = "Vargottama (identical D1 & D9 sign — double inner strength)";
      statusHi = "वर्गोत्तम (D1 एवं D9 में एक ही राशि — दोगुना बल)";
      badgeClass = "bg-amber-500/25 text-amber-200 border-amber-400/50";
    }

    return {isVargottama, isExaltedD1, isDebilitatedD1, isOwnD1, isExaltedD9, isDebilitatedD9, isOwnD9, statusEn, statusHi, badgeClass};
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
        bhava, d9Bhava, dignity, conjunctWith, aspectedTargets, aspectedBy
      };
    });

    return results;
  }

  // ==========================================================================
  // 4. SPECIAL LAGNAS + REAL ASHTAKAVARGA
  // ==========================================================================

  function computeRealAshtakavarga(chart) {
    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const refs8    = [...planets7, "Asc"];

    const bavByRashi = {}; // planet -> {rashiId: bindus}
    const savByRashi = new Array(13).fill(0); // 1-indexed

    planets7.forEach(planet => {
      const counts = new Array(13).fill(0);
      refs8.forEach(refKey => {
        const refRashi = chart[refKey].d1;
        ASHTAKAVARGA_RULES[planet][refKey].forEach(nth => {
          const targetRashi = ((refRashi + nth - 2) % 12) + 1;
          counts[targetRashi]++;
        });
      });
      bavByRashi[planet] = counts;
      for (let r = 1; r <= 12; r++) savByRashi[r] += counts[r];
    });

    const ascRashi = chart.Asc.d1;
    const houseSav = {};
    const houseBav = {};
    planets7.forEach(p => { houseBav[p] = {}; });

    for (let h = 1; h <= 12; h++) {
      const rashiOfH = getRashiOfBhava(ascRashi, h);
      houseSav[h] = savByRashi[rashiOfH];
      planets7.forEach(p => { houseBav[p][h] = bavByRashi[p][rashiOfH]; });
    }

    return {houseSav, houseBav};
  }

  function computeSpecialLagnasAndBindus(chart, planetAnalysis) {
    const ascRashi = chart.Asc.d1;
    const lagnaLordKey = getLordKeyOfRashi(ascRashi);
    const lagnaLordRashi = chart[lagnaLordKey].d1;

    const distToLord = getBhavaFrom(ascRashi, lagnaLordRashi);
    let arudhaRashi = ((lagnaLordRashi + distToLord - 2) % 12) + 1;
    const rawArudhaHouse = getBhavaFrom(ascRashi, arudhaRashi);
    let arudhaExceptionApplied = false;
    if (rawArudhaHouse === 1 || rawArudhaHouse === 7) {
      arudhaRashi = ((arudhaRashi + 8) % 12) + 1;
      arudhaExceptionApplied = true;
    }
    const arudhaHouseFromLagna = getBhavaFrom(ascRashi, arudhaRashi);

    const rashi12th = getRashiOfBhava(ascRashi, 12);
    const lord12thKey = getLordKeyOfRashi(rashi12th);
    const lord12thRashi = chart[lord12thKey].d1;
    const dist12 = getBhavaFrom(rashi12th, lord12thRashi);
    let upapadaRashi = ((lord12thRashi + dist12 - 2) % 12) + 1;
    const rawUlDiff = getBhavaFrom(rashi12th, upapadaRashi);
    if (rawUlDiff === 1 || rawUlDiff === 7) {
      upapadaRashi = ((upapadaRashi + 8) % 12) + 1;
    }

    const karakamsaRashi = chart.Sun.d9;
    const ashtakavarga = computeRealAshtakavarga(chart);

    return {
      chandraLagna: chart.Moon.d1,
      suryaLagna: chart.Sun.d1,
      navamsaLagna: chart.Asc.d9,
      arudhaRashi, arudhaHouseFromLagna, arudhaExceptionApplied, upapadaRashi, karakamsaRashi,
      houseBindus: ashtakavarga.houseSav,
      houseBav: ashtakavarga.houseBav
    };
  }

  function resolveActiveDasha(chart, numData) {
    const manualOn = document.getElementById("enableDashaToggle") && document.getElementById("enableDashaToggle").checked;
    const mdSelect = document.getElementById("currentMD")?.value || "auto";
    const adSelect = document.getElementById("currentAD")?.value || "auto";

    const moonNakId = chart.Moon.nak || 1;
    const birthDashaRuler = NAKSHATRA_DATA[moonNakId].ruler;
    const startIdx = VIMSHOTTARI_ORDER.findIndex(v => v.lord === birthDashaRuler);

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

    return {md:finalMD, ad:finalAD, nextMD, isManualDasha, birthDashaRuler};
  }

  // ==========================================================================
  // 5. HELPERS FOR NARRATIVE WRITING
  // ==========================================================================

  // Plain-English house-relationship narratives so we don't repeat the same phrase
  function houseThemeShort(bhavaNum, lang) {
    const themes = {
      1:  {en:"your own identity and physical vitality",       hi:"आपकी पहचान और शारीरिक ऊर्जा"},
      2:  {en:"wealth, speech, and family lineage",            hi:"धन, वाणी और कुल परंपरा"},
      3:  {en:"courage, communication, and self-effort",       hi:"साहस, संवाद और स्वयं के प्रयास"},
      4:  {en:"home, inner peace, and mother",                  hi:"घर, आंतरिक शांति और माता"},
      5:  {en:"intelligence, romance, and past-life merit",     hi:"बुद्धि, प्रेम और पूर्व-पुण्य"},
      6:  {en:"daily work, competition, and service",           hi:"दैनिक कार्य, प्रतिस्पर्धा और सेवा"},
      7:  {en:"marriage, partners, and public image",           hi:"विवाह, साझेदारी और सार्वजनिक छवि"},
      8:  {en:"sudden changes, secrets, and inheritances",      hi:"अचानक बदलाव, रहस्य और विरासत"},
      9:  {en:"higher wisdom, gurus, and divine grace",         hi:"उच्च ज्ञान, गुरु और ईश्वरीय कृपा"},
      10: {en:"career, status, and public authority",           hi:"करियर, पद और सार्वजनिक अधिकार"},
      11: {en:"gains, networks, and desire fulfilment",         hi:"लाभ, नेटवर्क और इच्छापूर्ति"},
      12: {en:"foreign lands, sleep, and spiritual liberation", hi:"विदेश, नींद और आध्यात्मिक मुक्ति"}
    };
    return lang === "hi" ? themes[bhavaNum].hi : themes[bhavaNum].en;
  }

  // Short planet-signature line for narrative interweaving
  function planetTheme(planetKey, lang) {
    const map = {
      Sun:     {en:"authority and self-worth",           hi:"अधिकार और स्वाभिमान"},
      Moon:    {en:"emotions and mental peace",          hi:"भावनाएं और मानसिक शांति"},
      Mars:    {en:"courage and execution drive",        hi:"साहस और निष्पादन शक्ति"},
      Mercury: {en:"intellect and communication",        hi:"बुद्धि और संवाद"},
      Jupiter: {en:"wisdom, expansion, and good fortune",hi:"ज्ञान, विस्तार और सौभाग्य"},
      Venus:   {en:"love, aesthetics, and comfort",      hi:"प्रेम, सौंदर्य और सुख"},
      Saturn:  {en:"discipline, patience, and karma",    hi:"अनुशासन, धैर्य और कर्म"},
      Rahu:    {en:"ambition, obsession, and foreign pulls",hi:"महत्वाकांक्षा और विदेश योग"},
      Ketu:    {en:"detachment and spiritual depth",     hi:"वैराग्य और आध्यात्मिक गहराई"}
    };
    return lang === "hi" ? map[planetKey].hi : map[planetKey].en;
  }

  // ==========================================================================
  // 6. CHAPTER GENERATORS
  // ==========================================================================

  // --------------------------------------------------------------------------
  // CHAPTER 1 — CORE PERSONALITY & UNSPOKEN INNER PSYCHOLOGY
  // Includes the ONE-TIME chart signature reveal
  // --------------------------------------------------------------------------
  function buildChapter1Personality(ctx) {
    const { lang, name, numData, chaldean, chart, planetAnalysis } = ctx;
    const ascRashi  = RASHI_DATA[chart.Asc.d1];
    const moonRashi = RASHI_DATA[chart.Moon.d1];
    const sunRashi  = RASHI_DATA[chart.Sun.d1];
    const moonNak   = NAKSHATRA_DATA[chart.Moon.nak];
    const mulankArch = MULANK_ARCHETYPES[numData.mulank];
    const bhagyankArch = MULANK_ARCHETYPES[numData.bhagyank];
    const lagnaLordKey = ascRashi.lord;
    const lagnaLordInfo = planetAnalysis[lagnaLordKey];

    // Build the one-time chart signature strip
    const sigRow = (labelEn, labelHi, value) => `
      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-white/10">
        <div class="text-[10px] uppercase text-gray-400 font-bold">${lang === "hi" ? labelHi : labelEn}</div>
        <div class="text-sm font-bold text-amber-200 mt-0.5">${value}</div>
      </div>
    `;

    const signatureCard = `
      <div class="rounded-2xl bg-slate-950/90 border border-amber-400/40 p-4 md:p-5 mb-6">
        <div class="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-2">
          <i class="fas fa-fingerprint mr-1.5"></i>${lang === "hi" ? "आपका जन्म-चिह्न (एक बार स्थापित, आगे हर अध्याय में स्वतः लागू)" : "Your Birth Signature (revealed once — referenced organically throughout)"}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${sigRow("Ascendant (Lagna)", "लग्न", `${lang === "hi" ? ascRashi.hi : ascRashi.en} <span class="text-gray-400 text-xs">— lord ${ascRashi.lordHi}</span>`)}
          ${sigRow("Moon Rashi", "चंद्र राशि", `${lang === "hi" ? moonRashi.hi : moonRashi.en}`)}
          ${sigRow("Moon Nakshatra", "चंद्र नक्षत्र", `${moonNak.name} <span class="text-gray-400 text-xs">— ${moonNak.ruler}</span>`)}
          ${sigRow("Sun Rashi", "सूर्य राशि", `${lang === "hi" ? sunRashi.hi : sunRashi.en}`)}
          ${sigRow("Mulank", "मूलांक", `${numData.mulank} — ${mulankArch.ruler}`)}
          ${sigRow("Bhagyank", "भाग्यांक", `${numData.bhagyank} — ${bhagyankArch.ruler}`)}
          ${sigRow("Chaldean Name", "चैल्डियन नाम", `${chaldean.compound} → ${chaldean.single}`)}
          ${sigRow("Age / Year", "आयु / वर्ष", `${numData.age} / ${numData.currentYear}`)}
        </div>
      </div>
    `;

    if (lang === "hi") {
      return signatureCard + `
        <p>
          प्रिय <strong>${name}</strong>, आपका व्यक्तित्व किसी एक ग्रह की परछाई नहीं, बल्कि <strong>चार जीवित धागों से बुनी हुई एक गहरी रचना</strong> है — मूलांक ${numData.mulank}, भाग्यांक ${numData.bhagyank}, नाम की चैल्डियन ध्वनि तरंग ${chaldean.compound} → ${chaldean.single}, और चंद्रमा का ${moonNak.name} नक्षत्र।
        </p>

        <p>
          <strong>1. आपकी अनकही आंतरिक वास्तुकला:</strong> ${mulankArch.psychHi} इसके ऊपर आपका <strong>भाग्यांक ${numData.bhagyank} (${bhagyankArch.ruler})</strong> यह तय करता है कि 24–28 वर्ष के पड़ाव के बाद आपके भीतर गंभीरता और यथार्थबोध कितनी तेजी से परिपक्व होता है। यह वह अंक है जो आपको अपने ही आयु वर्ग के लोगों से कहीं अधिक परिपक्व बना देता है।
        </p>

        <p>
          <strong>2. बाहरी चेहरा बनाम भीतरी मन (यह द्वंद्व आपके हर निर्णय में झलकता है):</strong> दुनिया आपको <em>${ascRashi.temperamentHi}</em> के रूप में देखती है — क्योंकि आपकी बाहरी कार्यशैली ${ascRashi.hi} से संचालित होती है। लेकिन भीतर, आपका मन <strong>${moonRashi.hi} और ${moonNak.name} नक्षत्र</strong> पर चलता है, जो आपको <em>${moonNak.traitHi}</em> देता है। जब कोई आपको बाहर से सख्त या तटस्थ समझता है, आपके भीतर चंद्र-नक्षत्र की वह सूक्ष्म परत हर छोटी बात को गहराई से महसूस कर रही होती है।
        </p>

        <p>
          <strong>3. आपके नाम का गुप्त अंक-विज्ञान (${chaldean.compound} → ${chaldean.single}):</strong> चैल्डियन गणना के अनुसार आपके नाम का कंपाउंड अंक <strong>${chaldean.compound}</strong> बनता है। ${
            chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
              ? "आपके नाम का मूल अंक आपके जन्म-अंकों के साथ सीधा सामंजस्य बना रहा है — यह एक दुर्लभ रक्षा-कवच है जो संकट के अंतिम क्षण में भी आपको थाम लेता है।"
              : `यहाँ एक महत्वपूर्ण रहस्य छिपा है — आपके जन्म का मूल (${numData.mulank}) और आपके नाम की तरंग (${chaldean.single}) में एक आंतरिक घर्षण है। इसीलिए जितनी मेहनत आप करते हैं, उसका पूरा श्रेय कई बार दूसरों को मिल जाता है, या काम 99% पर अटकता है।`
          }
        </p>

        <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
          <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> वह सच जो लोग आपके बारे में नहीं जानते:</div>
          <p class="text-sm mb-0">
            आप उन दुर्लभ इंसानों में से हैं जो भीड़ में बैठकर भी लोगों के चेहरे के पीछे का मुखौटा पढ़ लेते हैं। आपने कई लोगों की निस्वार्थ मदद की है, जिन्होंने मतलब निकलते ही रंग बदल लिया। आप बदला लेने में समय नष्ट नहीं करते — पर एक बार कोई इंसान आपकी आंखों से उतर जाए, तो फिर चाहे वह कुछ भी कर ले, आप उस पर पहले जैसा भरोसा कभी नहीं कर पाते।
          </p>
        </div>
      `;
    }

    return signatureCard + `
      <p>
        Dear <strong>${name}</strong>, your personality is not a single-planet stamp — it is a <strong>four-thread weave</strong>: your Psychic Number (${numData.mulank}), your Destiny Number (${numData.bhagyank}), the Chaldean acoustic vibration of your name (${chaldean.compound} → ${chaldean.single}), and the nakshatra of your Moon (${moonNak.name}).
      </p>

      <p>
        <strong>1. Your unspoken mental architecture:</strong> ${mulankArch.psychEn} Layered on top of this is your <strong>Destiny Number ${numData.bhagyank} (${bhagyankArch.ruler})</strong>, which decides how fate quietly matures you after the age of 24–28. That is why you often feel older and more strategic than people of your own age group — the ${numData.bhagyank} vibration does not let you stay naive for long.
      </p>

      <p>
        <strong>2. The outer mask versus the inner mind:</strong> The world reads you as <em>${ascRashi.temperamentEn}</em> — because your external operating style runs on ${ascRashi.en}. But internally, your mind lives inside <strong>${moonRashi.en}</strong> under <strong>${moonNak.name}</strong>, which wires you with <em>${moonNak.traitEn}</em>. When someone mistakes your outer composure for coldness, the truth is that your Moon is quietly cataloguing every micro-shift in their tone, mood, and intention.
      </p>

      <p>
        <strong>3. The hidden numerology of your name (${chaldean.compound} → ${chaldean.single}):</strong> In classical Chaldean numerology, your name vibrates to the compound value <strong>${chaldean.compound}</strong>. ${
          chaldean.single === numData.mulank || chaldean.single === numData.bhagyank
            ? "Your name's root frequency harmonizes directly with your birth matrix — a rare protective shield that catches you at the last possible second during life's sharpest crises."
            : `Here is the invisible friction in your chart: your birth blueprint runs on frequencies ${numData.mulank} and ${numData.bhagyank}, while the name the world calls you vibrates at ${chaldean.single}. This explains why you frequently deliver 90% of the heavy lifting, yet recognition or the final breakthrough arrives at the 99th percentile — sometimes landing on someone else.`
        }
      </p>

      <div class="p-4 rounded-2xl bg-purple-950/60 border border-amber-400/30 mt-4">
        <div class="font-bold text-amber-300 mb-1"><i class="fas fa-eye mr-1.5"></i> The unspoken truth people rarely notice about you:</div>
        <p class="text-sm mb-0">
          You possess a silent X-ray detector for fake behavior. You smile politely in a room while mentally cataloguing who is genuine and who is opportunistic. You have stood by people during their darkest phases only to watch them turn convenient once their crisis passed. You do not create loud drama when hurt — you simply go quiet, withdraw your emotional access, and once someone crosses that invisible line, they never get the old version of you back.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 2 — EDUCATION, MEMORY & INTELLECTUAL DNA
  // --------------------------------------------------------------------------
  function buildChapter2Education(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const asc = chart.Asc.d1;
    const rashi2 = RASHI_DATA[getRashiOfBhava(asc, 2)];
    const rashi4 = RASHI_DATA[getRashiOfBhava(asc, 4)];
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const merc   = planetAnalysis.Mercury;
    const jup    = planetAnalysis.Jupiter;

    if (lang === "hi") {
      return `
        <p>
          आपका बौद्धिक डीएनए रटने (rote learning) के लिए नहीं, बल्कि किसी भी विषय के <strong>मूल सिद्धांत</strong> को पकड़ने के लिए बना है। पंचम भाव (मेधा) में <strong>${rashi5.hi}</strong> राशि है, जिसके स्वामी <strong>${rashi5.lordHi}</strong> कुंडली के <strong>${lord5.bhava}वें भाव</strong> में विराजमान हैं। बुध <strong>${RASHI_DATA[merc.d1].hi} (${merc.bhava}वां भाव — ${merc.dignity.statusHi})</strong> में और गुरु <strong>${RASHI_DATA[jup.d1].hi} (${jup.bhava}वां भाव — ${jup.dignity.statusHi})</strong> में बैठकर यह तय कर रहे हैं कि आपका मस्तिष्क किस तरह सीखता है।
        </p>

        <p>
          <strong>आपका असली अध्ययन-पैटर्न:</strong> जब कोई विषय आपकी रुचि का हो — या जब सिर पर परीक्षा का दबाव आता है — तब आप 3 महीने का पाठ्यक्रम 15 दिनों में समझ लेने की अद्भुत क्षमता दिखाते हैं। पर सामान्य दिनों में, एक साथ कई विचार चलने के कारण आप किताब खोलकर बैठते तो हैं, लेकिन 25 मिनट बाद ही आपका मन भविष्य की कल्पनाओं या किसी गहरे अंतर्द्वंद्व में भटक जाता है।
        </p>

        <p>
          <strong>शिक्षा में मोड़ और व्यावहारिक ज्ञान का प्रभुत्व:</strong> आपने जिस विषय में औपचारिक डिग्री ली है, वास्तविक जीवन में आपकी आजीविका या विशेषज्ञता अक्सर उससे अलग या अधिक व्यावहारिक क्षेत्र में विकसित होती है। ${
            merc.retro || jup.retro || lord5.bhava === 6 || lord5.bhava === 8 || lord5.bhava === 12
              ? "वक्री ग्रहों और त्रिक भाव के प्रभाव के कारण आपकी पढ़ाई या प्रतियोगी परीक्षा की तैयारी में एक ऐसा दौर अवश्य आया (या चल रहा है) जब पारिवारिक माहौल, भटकाव, या गलत मार्गदर्शन के कारण आपकी असली क्षमता के अनुरूप परिणाम नहीं मिल पाया।"
              : "बुध और गुरु का सामंजस्य आपको प्रबंधन, तकनीक, वित्त, कानून, प्रशासन या कंसल्टिंग जैसे बौद्धिक क्षेत्रों में दूसरों से कहीं अधिक तार्किक बढ़त देता है।"
          }
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30">
            <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> सर्वश्रेष्ठ कौशल क्षेत्र:</div>
            <p class="text-xs md:text-sm mb-0">डेटा व एनालिटिक्स, प्रशासनिक सेवाएं, फाइनेंस, आईटी/सिस्टम आर्किटेक्चर, मनोविज्ञान, कानून, रिसर्च एवं स्वतंत्र रणनीति।</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> फोकस का वैदिक सूत्र:</div>
            <p class="text-xs md:text-sm mb-0">आपके लिए <strong>${rashi5.directionHi}</strong> की ओर मुख करके पढ़ना, और रात्रि के शांत प्रहर या ब्रह्म मुहूर्त में जटिल विषयों को साधना दोगुना परिणाम देगा। 45-मिनट स्प्रिंट ब्लॉक्स में लिखकर पढ़ना आपके मस्तिष्क की तार्किक शक्ति को सबसे तेज जगाता है।</p>
          </div>
        </div>
      `;
    }

    return `
      <p>
        Your intellectual DNA is wired not for rote memorization but for <strong>core-concept extraction</strong>. The 5th House of Medha (intelligence) holds <strong>${rashi5.en}</strong>, its ruler <strong>${rashi5.lord}</strong> sits in the <strong>${lord5.bhava}th House</strong>, and together with <strong>Mercury in ${RASHI_DATA[merc.d1].en} (${merc.bhava}th House — ${merc.dignity.statusEn})</strong> and <strong>Jupiter in ${RASHI_DATA[jup.d1].en} (${jup.bhava}th House — ${jup.dignity.statusEn})</strong>, they lock in a very specific cognitive wiring.
      </p>

      <p>
        <strong>Your real study pattern:</strong> When a subject genuinely interests you — or when exam pressure hits the roof — you can compress three months of syllabus into two weeks of hyper-focus. But on ordinary days, mental restlessness (<em>Chitta-Chanchalta</em>) pulls you in five directions at once. You open the book, sit down, and 25 minutes in, your mind has already jumped into future scenarios or a deep internal debate.
      </p>

      <p>
        <strong>Academic redirection versus real-world mastery:</strong> A large portion of your actual professional success comes from self-acquired skills outside your formal degree. ${
          merc.retro || jup.retro || lord5.bhava === 6 || lord5.bhava === 8 || lord5.bhava === 12
            ? "The presence of retrograde/trik-bhava influence on your educational axis shows a distinct phase where exam luck, last-minute anxiety, family environment, or wrong guidance stole a milestone you genuinely deserved by merit."
            : "The Mercury-Jupiter synergy grants you exceptional analytical clarity in competitive exams, technology, finance, law, or advisory roles where quick pattern recognition beats raw memorization."
        }
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="p-4 rounded-xl bg-slate-950/80 border border-blue-400/30">
          <div class="font-bold text-blue-300 text-sm mb-1"><i class="fas fa-brain mr-1.5"></i> Highest-yield intellectual domains</div>
          <p class="text-xs md:text-sm mb-0">Analytical systems, finance/fintech, administrative & competitive services, legal/policy strategy, research, digital architecture, and behavioral psychology.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-lightbulb mr-1.5"></i> Astrological focus optimization</div>
          <p class="text-xs md:text-sm mb-0">Face <strong>${rashi5.direction}</strong> while studying or doing deep work. Study in 45-minute sprint blocks with handwritten notes — that combination activates your Mercury–5th house neural circuit far better than passive reading.</p>
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

    if (lang === "hi") {
      return `
        <p>
          आपका करियर एक 'आदेश मानने वाले कर्मचारी' के रूप में नहीं, बल्कि <strong>स्वतंत्र अधिकार और निर्णय-शक्ति</strong> के लिए बना है। दशम भाव में <strong>${rashi10.hi}</strong> है, कर्मेश <strong>${rashi10.lordHi}</strong> <strong>${lord10.bhava}वें भाव</strong> में, नवांश (D9) में <strong>${RASHI_DATA[lord10.d9].hi}</strong> राशि में हैं। शनि <strong>${RASHI_DATA[sat.d1].hi} (${sat.bhava}वां भाव)</strong> में और सूर्य <strong>${RASHI_DATA[sun.d1].hi} (${sun.bhava}वां भाव)</strong> में बैठकर आपकी कार्यशैली को गढ़ रहे हैं।
        </p>

        <p>
          <strong>नौकरी बनाम स्वतंत्र व्यवसाय:</strong> अष्टकवर्ग में आपके दशम भाव को <strong>${bindu10} बिंदु</strong> और षष्ठ भाव (नौकरी) को <strong>${bindu6} बिंदु</strong> मिल रहे हैं। ${
            bindu10 >= bindu6
              ? "यह स्पष्ट संकेत है कि आपको 'स्वामित्व' (ownership) मिलते ही आप अद्भुत परिणाम देते हैं, और लंबे समय तक किसी अयोग्य वरिष्ठ के नीचे दबकर काम करना आपको भीतर से तोड़ देता है।"
              : "यह संकेत देता है कि आप संगठनात्मक ढांचे में रहकर तेजी से ऊपर उठ सकते हैं — बशर्ते आपको स्वायत्तता (autonomy) और निर्णय-शक्ति दी जाए।"
          }
        </p>

        <p>
          <strong>कार्यक्षेत्र की गुप्त राजनीति और आपका उत्थान:</strong> आपके करियर के शुरुआती वर्षों (विशेषकर 22–27 वर्ष) में अस्थिरता, कार्यक्षेत्र परिवर्तन, या अपनी योग्यता से कम पद पर काम करने का दबाव दिखता है। सहकर्मी आपके काम के तरीके की नकल तो करते हैं, पर पीठ पीछे रोड़े भी अटकाते हैं। पर जैसे ही आप <strong>${numData.mulank === 8 || numData.bhagyank === 8 ? "28वें और 33वें" : "27वें, 30वें और 34वें"} वर्ष</strong> के चक्र में प्रवेश करते हैं, कर्मेश की परिपक्वता आपके हाथों में वास्तविक अधिकार सौंपती है।
        </p>

        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
          <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> सर्वाधिक फलदायी क्षेत्र:</div>
          <p class="text-xs md:text-sm mb-0">
            दशमेश <strong>${rashi10.lordHi}</strong> के ${lord10.bhava}वें भाव में होने से आपके लिए <strong>प्रशासनिक नेतृत्व, सरकारी/संस्थागत अनुबंध, टेक्नोलॉजी व एनालिटिक्स, बैंकिंग/वित्त, कंसल्टेंसी, डिजिटल एंटरप्राइज या उच्च प्रबंधन</strong> के क्षेत्र सर्वोत्तम हैं। जन्मस्थान से दूर या विदेशी नेटवर्क से जुड़ने पर तरक्की दोगुनी होती है।
          </p>
        </div>
      `;
    }

    return `
      <p>
        Your career was never designed to operate as a passive order-taker. It is wired for <strong>autonomous command and decision-making authority</strong>. Your 10th House of Karma holds <strong>${rashi10.en}</strong>, its ruler <strong>${rashi10.lord}</strong> activates your <strong>${lord10.bhava}th House</strong> and matures into <strong>${RASHI_DATA[lord10.d9].en}</strong> in Navamsa. Saturn sits in <strong>${RASHI_DATA[sat.d1].en} (${sat.bhava}th House)</strong> while the Sun sits in <strong>${RASHI_DATA[sun.d1].en} (${sun.bhava}th House)</strong>, shaping the style of your professional climb.
      </p>

      <p>
        <strong>Job versus independent enterprise:</strong> In Ashtakavarga, your 10th House of command holds <strong>${bindu10} bindus</strong> against <strong>${bindu6} bindus</strong> in the 6th House of routine employment. ${
          bindu10 >= bindu6
            ? "That ratio is a clear signature — you deliver spectacular results when given ownership of a mission, and you quietly suffocate when forced to operate below your intellectual level under an incompetent superior."
            : "That ratio suggests you rise fastest inside an organizational structure — provided you are given autonomy and decision-making authority rather than pure execution work."
        }
      </p>

      <p>
        <strong>Workplace politics and your career rise:</strong> Your early-to-mid twenties carry visible instability — role changes, under-utilization, or watching louder, less-capable peers claim credit through flattery because you refuse to play that game. Your energy is often the engine behind someone else's promotion. However, the Saturnine structure of your chart guarantees that once you cross <strong>${numData.mulank === 8 || numData.bhagyank === 8 ? "age 28 and 33" : "age 27, 30, and 34"}</strong>, your career shifts from "seeking opportunities" to "commanding them."
      </p>

      <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 mt-4">
        <div class="font-bold text-amber-300 text-sm mb-1"><i class="fas fa-award mr-1.5"></i> Highest-alignment career sectors</div>
        <p class="text-xs md:text-sm mb-0">
          With 10th Lord <strong>${rashi10.lord}</strong> activating your ${lord10.bhava}th House, your peak recognition comes from <strong>executive management, technology/systems leadership, administrative authority, finance & capital strategy, high-ticket consulting, or scalable independent business</strong> — especially when operating away from your birthplace or interfacing with national/global clients.
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
            <div class="text-xs text-emerald-300 font-bold">11वां भाव (लाभ) — ${rashi11.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu11} बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">2रा भाव (संचय) — ${rashi2.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu2} बिंदु</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold">12वां भाव (व्यय) — ${rashi12.hi}</div>
            <div class="text-lg font-extrabold text-white">${bindu12} बिंदु</div>
          </div>
        </div>

        <p>
          <strong>धनागम बनाम धन-संचय:</strong> आपके 11वें भाव (आय) के स्वामी <strong>${rashi11.lordHi}</strong> <strong>${lord11.bhava}वें भाव</strong> में हैं, और धन भाव (2nd) के स्वामी <strong>${rashi2.lordHi}</strong> <strong>${lord2.bhava}वें भाव</strong> में। आपके जीवन में पैसों का प्रवाह कभी पूरी तरह रुकता नहीं — जब भी किसी बड़े कार्य के लिए धन की आवश्यकता होती है, कहीं न कहीं से व्यवस्था अवश्य हो जाती है।
        </p>

        <p>
          <strong>रहस्यमयी 'मनी लीक' — यही आपके संचय को रोकता है:</strong> आपके साथ एक चौंकाने वाला वित्तीय पैटर्न बार-बार दोहराया जाता है — जैसे ही आपके खाते में अच्छी रकम इकट्ठी होने लगती है, ठीक उसी समय घर में कोई आकस्मिक खर्च, स्वास्थ्य/वाहन मरम्मत, पारिवारिक जिम्मेदारी, या किसी करीबी की मदद का प्रसंग सामने आ जाता है। इसके अलावा, भावना या भरोसे में आकर आपने जिस भी मित्र/रिश्तेदार को उधार दिया, वह पैसा या तो फंस गया या वापस मांगने में संबंध खराब हुए।
        </p>

        <p>
          <strong>स्थायी संपत्ति का स्वर्णिम नियम:</strong> आपकी कुंडली स्पष्ट संकेत देती है कि यदि आप पैसा केवल सेविंग अकाउंट में रखेंगे, तो 12वां भाव उसे किसी न किसी बहाने खर्च करवा देगा। आपके लिए अमीरी का अचूक रहस्य — जैसे ही धन आए, उसे <strong>भूमि, स्वर्ण, दीर्घकालिक इक्विटी/एसआईपी, या व्यावसायिक संपत्ति (Locked Assets)</strong> में बदल दें। अपने 12वें भाव को 'शुभ निवेश' से सक्रिय रखने पर आकस्मिक नुकसान तुरंत बंद हो जाता है।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-400/30">
          <div class="text-xs text-emerald-300 font-bold">11th House (Gains) — ${rashi11.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu11} bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
          <div class="text-xs text-amber-300 font-bold">2nd House (Savings) — ${rashi2.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu2} bindus</div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
          <div class="text-xs text-rose-300 font-bold">12th House (Outflow) — ${rashi12.en}</div>
          <div class="text-lg font-extrabold text-white">${bindu12} bindus</div>
        </div>
      </div>

      <p>
        <strong>Income generation versus retention:</strong> Your 11th House of gains is ruled by <strong>${rashi11.lord}</strong> from your <strong>${lord11.bhava}th House</strong>, while the 2nd House of accumulated wealth is ruled by <strong>${rashi2.lord}</strong> from your <strong>${lord2.bhava}th House</strong>. With <strong>${bindu11} bindus</strong> in the 11th, your capacity to attract high-value opportunities is real — even in tight situations, provision tends to appear when you genuinely need it.
      </p>

      <p>
        <strong>The unspoken "money leak" pattern in your chart:</strong> Look at your own history — every time your bank balance crosses a comfortable threshold, an unexpected family obligation, medical expense, vehicle repair, or a sudden "rescue a friend" situation mysteriously appears. And whenever you lend money to friends or relatives out of pure emotional generosity, that money rarely returns on time — and asking for it back ends up straining the relationship.
      </p>

      <p>
        <strong>Your wealth-locking formula:</strong> Because your 2nd/12th axis reacts strongly to idle liquid cash, keeping large sums sitting in a regular savings account invites unplanned expenses. To build massive net worth, you must intentionally "spend" your surplus into <strong>illiquid appreciating assets — land/real estate, gold, index/equity compounds, or business infrastructure</strong> the moment it arrives. When you consciously feed the 12th house through disciplined investment, the sudden-leak pattern stops immediately.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 5 — LUCK FACTOR, FORTUNE & DESTINY MILESTONES
  // --------------------------------------------------------------------------
  function buildChapter5Luck(ctx) {
    const { lang, chart, planetAnalysis, numData } = ctx;
    const asc = chart.Asc.d1;
    const rashi9 = RASHI_DATA[getRashiOfBhava(asc, 9)];
    const lord9  = planetAnalysis[rashi9.lord];
    const m = numData.mulank, b = numData.bhagyank;

    const milestoneAges = Array.from(new Set([
      18 + m, 21 + (b % 5), 24 + (m % 4), 27 + (b % 3),
      30 + (lord9.bhava % 4), 33 + (m % 3), 36, 42
    ])).sort((x, y) => x - y);

    if (lang === "hi") {
      return `
        <p>
          आपका भाग्य नवम भाव में <strong>${rashi9.hi}</strong> और भाग्येश <strong>${rashi9.lordHi}</strong> के <strong>${lord9.bhava}वें भाव</strong> में होने के कारण निष्क्रिय नहीं है — यह <strong>कर्म-सक्रिय भाग्य</strong> है। जैसे ही आप ${lord9.bhava}वें भाव से जुड़े कर्मों में पहला कदम बढ़ाते हैं, ईश्वरीय कृपा पीछे से अदृश्य हाथ की तरह आपको सहारा देती है।
        </p>

        <p>
          <strong>'99% पर अटकने' का रहस्य:</strong> जो काम दूसरे लोग साधारण प्रयास में पा लेते हैं, वही आपके साथ अंतिम क्षण पर किसी न किसी अड़चन से अटक जाता है। लेकिन ध्यान दीजिए — हर बार जब कोई छोटा दरवाजा बंद हुआ है, तो कुछ समय बाद नियति ने आपके लिए उससे कहीं बड़ा और बेहतर मार्ग खोला है। आपके भाग्येश आपको छोटे समझौतों के लिए रुकने नहीं देते।
        </p>

        <p>
          <strong>निर्णायक भाग्योदय वर्ष:</strong> वैदिक भृगु चक्र एवं अंक ज्योतिष के अनुसार आपके जीवन के स्वर्णिम पड़ाव हैं — <strong>${milestoneAges.join(", ")}वें वर्ष</strong>। वर्तमान में आपकी आयु <strong>${numData.age} वर्ष</strong> है और वर्ष <strong>${numData.currentYear}</strong> आपके लिए <strong>व्यक्तिगत वर्ष अंक ${numData.personalYear}</strong> की ऊर्जा लेकर आया है, जो पुराने बोझ को उतारकर नई नींव रखने का स्पष्ट संकेत दे रहा है।
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">भाग्योदय दिशा</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.directionHi}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">शुभ अंक</div>
            <div class="text-sm font-bold text-white mt-1">${m}, ${b}, ${((m + b - 1) % 9) + 1}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">व्यक्तिगत वर्ष</div>
            <div class="text-sm font-bold text-white mt-1">अंक ${numData.personalYear}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div class="text-[11px] text-amber-400 font-bold">भाग्येश ग्रह</div>
            <div class="text-sm font-bold text-white mt-1">${rashi9.lordHi} (${lord9.bhava}वां)</div>
          </div>
        </div>
      `;
    }

    return `
      <p>
        Your luck does not operate passively. With the 9th House of Bhagya holding <strong>${rashi9.en}</strong> and your Bhagya Lord <strong>${rashi9.lord}</strong> activating your <strong>${lord9.bhava}th House</strong>, your chart carries <em>Karmic Activation Luck</em> — the moment you take bold action aligned with the ${lord9.bhava}th house, unseen mentors, synchronicities, and timely rescues step into your path.
      </p>

      <p>
        <strong>The "99th-percentile test" pattern:</strong> You have likely noticed that things which come effortlessly to average people often test your patience right up to the 99th percentile. Last-minute delays have frustrated you more than once. Yet in hindsight, every door that slammed shut in your past was cosmic protection preventing you from settling for a mediocre life path far below your true destiny.
      </p>

      <p>
        <strong>Crucial destiny turning points:</strong> Synthesizing Bhrigu progression with your Mulank (${m}) and Bhagyank (${b}), the most transformative milestone ages of your life are <strong>${milestoneAges.join(", ")}</strong>. At your current age of <strong>${numData.age}</strong>, calendar year <strong>${numData.currentYear}</strong> operates as your <strong>Personal Year ${numData.personalYear}</strong> — marking a decisive window for restructuring your career, relationships, and long-term priorities.
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
          <div class="text-[11px] text-amber-400 font-bold">Personal Year</div>
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
  // CHAPTER 6 — LOVE LIFE, ATTRACTION & EMOTIONAL PATTERNS
  // --------------------------------------------------------------------------
  function buildChapter6Love(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const asc = chart.Asc.d1;
    const rashi5 = RASHI_DATA[getRashiOfBhava(asc, 5)];
    const lord5  = planetAnalysis[rashi5.lord];
    const ven = planetAnalysis.Venus;
    const moon = planetAnalysis.Moon;
    const rahu = planetAnalysis.Rahu;

    const karmicLove = ven.conjunctWith.includes("Rahu") || ven.conjunctWith.includes("Saturn") ||
                       ven.conjunctWith.includes("Mars") || rahu.bhava === 5 || rahu.bhava === 7;

    if (lang === "hi") {
      return `
        <p>
          आप प्रेम में सतही या टाइम-पास संबंध (casual flings) नहीं बना सकते। आपके पंचम भाव में <strong>${rashi5.hi}</strong>, उसके स्वामी <strong>${rashi5.lordHi}</strong> <strong>${lord5.bhava}वें भाव</strong> में, और शुक्र <strong>${RASHI_DATA[ven.d1].hi} (${ven.bhava}वां भाव, नवांश ${RASHI_DATA[ven.d9].hi})</strong> में बैठकर यह तय कर रहे हैं कि जब आप किसी से जुड़ते हैं, तो पूरी आत्मा और निष्ठा से जुड़ते हैं।
        </p>

        <p>
          <strong>रिश्तों में वह अनकहा असंतुलन:</strong> आप रिश्ते में सामने वाले की छोटी-छोटी खुशियों, सम्मान और भावनात्मक सुरक्षा का पूरा ध्यान रखते हैं। लेकिन बदले में जब आपको भावनात्मक सहारे या स्पष्टता (clarity) की जरूरत होती है, तो सामने वाला व्यक्ति या तो भ्रमित हो जाता है, या आपको 'taken for granted' लेने लगता है। आप attention के लिए गिड़गिड़ाते नहीं — जब ठंडापन महसूस होता है, आप बाहर से 'बिल्कुल ठीक' दिखते हुए भीतर से चुपचाप टूटते हैं।
        </p>

        <p>
          <strong>आकर्षण और सावधानी:</strong> ${
            karmicLove
              ? "आपके प्रेम अक्ष पर तीव्र ग्रहों का प्रभाव यह दर्शाता है कि आपके जीवन में कम से कम एक ऐसा गहरा भावनात्मक जुड़ाव या अधूरा रिश्ता आता है जो आपको भीतर तक झकझोर कर रख देता है और लोगों की असली पहचान सिखाता है।"
              : "शुक्र और पंचमेश की स्थिति विपरीत लिंग में स्वाभाविक आकर्षण देती है, पर जब तक बौद्धिक और आत्मिक स्तर मैच न हो, तब तक आप अपना दिल आसानी से नहीं खोलते।"
          } सबसे बड़ा नियम — किसी के मीठे शब्दों पर नहीं, बल्कि उसके निरंतर व्यवहार (consistency) पर ही हृदय समर्पित करें।
        </p>
      `;
    }

    return `
      <p>
        You cannot do shallow, transactional romance. Your 5th House of romance holds <strong>${rashi5.en}</strong>, its ruler <strong>${rashi5.lord}</strong> activates your <strong>${lord5.bhava}th House</strong>, and <strong>Venus sits in ${RASHI_DATA[ven.d1].en} (${ven.bhava}th House) maturing to ${RASHI_DATA[ven.d9].en} in D9</strong>. When you attach to someone, your loyalty is fierce, protective, and all-in — which is precisely why the wrong person can leave a very deep scar.
      </p>

      <p>
        <strong>The unspoken emotional imbalance you have faced:</strong> You love with deep intensity and remember the smallest details about the person you care for. Yet you have historically attracted partners who either struggle to match that emotional depth, or start taking your availability for granted once they feel secure. You hate begging for attention — when you sense coldness, you suffer silently inside while acting completely unbothered on the surface.
      </p>

      <p>
        <strong>Karmic attraction triggers and the heartbreak shield:</strong> ${
          karmicLove
            ? "Because intense karmic nodes / malefics influence your romantic axis, your chart carries at least one deeply transformative heartbreak or intense past-life connection designed to awaken your self-worth and strip away illusions."
            : "Your Venus–5th Lord synergy gives you strong natural magnetism, yet your heart only unlocks when intellectual respect and emotional safety coexist."
        } Your golden rule in love is simple: never judge a partner by their first-60-day intensity — judge them strictly by their consistency when life gets inconvenient.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 7 — FUTURE LIFE PARTNER & MARRIED LIFE
  // --------------------------------------------------------------------------
  function buildChapter7Partner(ctx) {
    const { lang, gender, chart, planetAnalysis, specialLagnas } = ctx;
    const asc = chart.Asc.d1;
    const rashi7 = RASHI_DATA[getRashiOfBhava(asc, 7)];
    const lord7  = planetAnalysis[rashi7.lord];
    const d9Rashi7 = RASHI_DATA[getRashiOfBhava(chart.Asc.d9, 7)];
    const ulRashi  = RASHI_DATA[specialLagnas.upapadaRashi];
    const spouseKarakaKey = gender === "female" ? "Jupiter" : "Venus";
    const spouseKaraka = planetAnalysis[spouseKarakaKey];
    const lord7Nak = NAKSHATRA_DATA[lord7.nak];

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold">7वां भाव (D1)</div>
            <div class="text-base font-extrabold text-white mt-0.5">${rashi7.hi} (स्वामी: ${rashi7.lordHi})</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-pink-400/30">
            <div class="text-xs text-pink-300 font-bold">नवांश (D9) 7वां एवं कारक</div>
            <div class="text-base font-extrabold text-white mt-0.5">${d9Rashi7.hi} • ${spouseKaraka.meta.hi}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30">
            <div class="text-xs text-amber-300 font-bold">उपपद लग्न (UL)</div>
            <div class="text-base font-extrabold text-white mt-0.5">${ulRashi.hi} (${rashi7.directionHi})</div>
          </div>
        </div>

        <p>
          <strong>रंग-रूप और व्यक्तित्व:</strong> सप्तम भाव में <strong>${rashi7.hi}</strong> और D9 में <strong>${d9Rashi7.hi}</strong> का प्रभाव — आपके जीवनसाथी में <em>${rashi7.bodyBuildHi}</em> स्पष्ट झलकेगी। उनके चेहरे पर स्वाभाविक गरिमा और आंखों में विशेष आकर्षण होगा जो भीड़ में अलग पहचान दिलाएगा।
        </p>

        <p>
          <strong>स्वभाव और पारिवारिक पृष्ठभूमि:</strong> सप्तमेश <strong>${rashi7.lordHi}</strong> ${lord7Nak.name} नक्षत्र में <strong>${lord7.bhava}वें भाव</strong> में हैं और UL <strong>${ulRashi.hi}</strong> में। जीवनसाथी स्वभाव से <em>${rashi7.temperamentHi}</em>, भीतर से <em>${d9Rashi7.temperamentHi}</em> होंगे। वे एक सम्मानित व संस्कारी पारिवारिक पृष्ठभूमि से आएंगे और विवाह के बाद कठिन निर्णयों में सबसे मजबूत सलाहकार साबित होंगे।
        </p>

        <p>
          <strong>दिशा, मिलन और विवाह-पश्चात भाग्योदय:</strong> विवाह का योग जन्मस्थान से <strong>${rashi7.directionHi}</strong> या <strong>${d9Rashi7.directionHi}</strong> की ओर प्रबल है। ${
            lord7.bhava === 5 || lord7.bhava === 11 || lord7.bhava === 3
              ? "आपका विवाह आपकी अपनी पसंद (love-cum-arranged) या सोशल/प्रोफेशनल नेटवर्क से तय होने की प्रबल संभावना है।"
              : "विवाह भले ही परिवार की सहमति से हो, पर विवाह से पूर्व आप दोनों के बीच गहरा मानसिक जुड़ाव स्थापित होगा।"
          } सबसे महत्वपूर्ण — नवांश में ${spouseKaraka.meta.hi} की स्थिति यह प्रमाणित करती है कि <strong>विवाह के 18–24 महीनों के भीतर</strong> आपके आर्थिक स्तर और सामाजिक प्रतिष्ठा में बड़ा उछाल आएगा।
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
        <strong>Appearance, vibe & first impression of your partner:</strong> Synthesizing the 7th House in <strong>${rashi7.en}</strong> with your Navamsa (D9) 7th House in <strong>${d9Rashi7.en}</strong> and the spouse-karaka <strong>${spouseKarakaKey} in ${RASHI_DATA[spouseKaraka.d1].en}</strong>, your partner will possess <em>${rashi7.bodyBuildEn}</em>. Even in casual attire, they carry a composed self-respect and an expressive gaze that immediately stands out in a room.
      </p>

      <p>
        <strong>Core personality, profession & family lineage:</strong> Because your 7th Lord <strong>${rashi7.lord}</strong> sits in the <strong>${lord7.bhava}th House under ${lord7Nak.name}</strong>, your spouse's outer personality will be <em>${rashi7.temperamentEn}</em>, while their deeper soul nature (D9) is <em>${d9Rashi7.temperamentEn}</em>. Your Upapada Lagna in <strong>${ulRashi.en}</strong> indicates a partner from a dignified, self-respecting family who brings strong practical intelligence and career ambition into the marriage.
      </p>

      <p>
        <strong>Direction, meeting & post-marriage destiny:</strong> Astrologically, the strongest directional pull for your partner's roots (or your meeting point) is toward the <strong>${rashi7.direction}</strong> or <strong>${d9Rashi7.direction}</strong> relative to your birthplace. With 7th Lord activating the ${lord7.bhava}th house, ${
          lord7.bhava === 5 || lord7.bhava === 11 || lord7.bhava === 3
            ? "your chart strongly favors a love-cum-arranged union, or a meeting through professional/social networks where friendship evolves into commitment."
            : "whether introduced through family or destiny-led circumstances, a strong one-on-one mental bond will precede the wedding."
        } Most importantly, your Navamsa configuration triggers <strong>Bhagya-Udaya after marriage</strong> — within 18 to 24 months of the wedding, your financial stability and asset creation accelerate noticeably.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 8 — IN-DEPTH PLANET ANALYSIS (5-6 paragraphs per planet)
  // --------------------------------------------------------------------------
  function buildChapter8PlanetsAndAspects(ctx) {
    const { lang, chart, planetAnalysis } = ctx;
    const pKeys = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];

    const modeBanner = chart.isFullChartMode
      ? (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>पूर्ण कुंडली मोड सक्रिय:</strong> नीचे सभी 9 ग्रहों की लग्न (D1), नक्षत्र, नवांश (D9), युति और पाराशरी विशेष दृष्टियों का संपूर्ण विश्लेषण दिया गया है।</div>`
        : `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-xs md:text-sm text-emerald-200 mb-6"><i class="fas fa-check-circle mr-2"></i><strong>Full-Precision Chart Mode Active:</strong> Below is a complete Parashari + Navamsa synthesis of all 9 Grahas — house lordships, conjunctions (Yutis), and mutual aspects (Drishtis).</div>`)
      : (lang === "hi"
        ? `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-info-circle mr-2"></i><strong>जन्म-तिथि व नाम सिंथेसिस मोड:</strong> यह विश्लेषण आपकी जन्म-तिथि व नाम तरंग से व्युत्पन्न ग्रह-स्थिति पर आधारित है। Step 2 में अपनी सटीक लग्न व ग्रहों को ऑन करते ही यह अध्याय 100% सटीक हो जाएगा।</div>`
        : `<div class="p-4 rounded-xl bg-amber-950/60 border border-amber-400/40 text-xs md:text-sm text-amber-200 mb-6"><i class="fas fa-info-circle mr-2"></i><strong>Solar-Nakshatra & Chaldean Synthesis Mode:</strong> This planetary matrix is derived from your birth date and name vibration. (Tip: toggle Step 2 above to input your exact D1/D9 placements from Prokerala/AstroSage for 99.9% accuracy.)</div>`);

    const cardsHtml = pKeys.map(k => {
      const info = planetAnalysis[k];
      const d1Rashi = RASHI_DATA[info.d1];
      const d9Rashi = RASHI_DATA[info.d9];
      const nak = NAKSHATRA_DATA[info.nak];
      const bhavaDesc = BHAVA_MEANINGS[info.bhava];

      // Yuti summary
      let yutiEn = "", yutiHi = "";
      if (info.conjunctWith.length > 0) {
        const namesEn = info.conjunctWith.map(c => PLANET_META[c].en).join(", ");
        const namesHi = info.conjunctWith.map(c => PLANET_META[c].hi).join(", ");
        yutiEn = `This Graha shares its sign with <strong>${namesEn}</strong> in the ${info.bhava}th House — their karmic agendas fuse, and each one's expression is permanently coloured by the others.`;
        yutiHi = `यह ग्रह ${info.bhava}वें भाव में <strong>${namesHi}</strong> के साथ बैठकर विशेष संयुक्त योग बना रहा है — दोनों की कर्म-ऊर्जाएं आपस में मिलकर एक साथ फल दे रही हैं।`;
      } else {
        yutiEn = `No direct conjunction (Yuti) — this Graha operates in a clean, independent mode in the ${info.bhava}th House, delivering its karakatva without interference from neighbouring planets.`;
        yutiHi = `कोई सीधी युति नहीं — यह ग्रह ${info.bhava}वें भाव में स्वतंत्र रूप से अपना पूर्ण प्रभाव दे रहा है, जिससे इसका कारकत्व स्पष्ट रूप से फलित होता है।`;
      }

      // Aspects cast
      const outgoingEn = info.aspectedTargets.map(t => {
        const tRashi = RASHI_DATA[t.targetRashi];
        const hit = t.planetsThere.length > 0
          ? `, directly aspecting <strong>${t.planetsThere.map(p => PLANET_META[p].en).join(", ")}</strong>`
          : "";
        return `${t.nthAspect}th aspect onto the <strong>${t.targetBhava}th House (${tRashi.en})</strong>${hit}`;
      }).join("; ");

      const outgoingHi = info.aspectedTargets.map(t => {
        const tRashi = RASHI_DATA[t.targetRashi];
        const hit = t.planetsThere.length > 0
          ? `, जहाँ स्थित <strong>${t.planetsThere.map(p => PLANET_META[p].hi).join(", ")}</strong> पर सीधी दृष्टि`
          : "";
        return `${t.nthAspect}वीं दृष्टि <strong>${t.targetBhava}वें भाव (${tRashi.hi})</strong> पर${hit}`;
      }).join("; ");

      // Aspects received
      const incomingEn = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => `${inc.nthAspect}th aspect from <strong>${PLANET_META[inc.fromPlanet].en}</strong>`).join(", ")
        : "No external Parashari aspect falls on this Graha — it expresses its pure autonomous fruit without outside modulation.";

      const incomingHi = info.aspectedBy.length > 0
        ? info.aspectedBy.map(inc => `<strong>${PLANET_META[inc.fromPlanet].hi}</strong> की ${inc.nthAspect}वीं दृष्टि`).join(", ")
        : "किसी अन्य ग्रह की सीधी पाराशरी दृष्टि इस पर नहीं पड़ रही — यह स्वतंत्र रूप से अपना शुद्ध फल दे रहा है।";

      // Timing hint
      const dashaHintEn = `Whenever ${info.meta.en} activates in Vimshottari Dasha or Antardasha, the events of the ${info.bhava}th House (${bhavaDesc.en}) become the dominant theme of your life — promotions, unexpected visitors, and structural shifts related to that domain accelerate.`;
      const dashaHintHi = `जब भी विंशोत्तरी में ${info.meta.hi} की महादशा या अंतर्दशा चलती है, तब ${info.bhava}वें भाव (${bhavaDesc.hi}) से जुड़े विषय आपके जीवन के मुख्य विषय बन जाते हैं — उस क्षेत्र में उन्नति, अचानक घटनाएं और ढांचागत बदलाव तेज हो जाते हैं।`;

      // Practical guidance
      const guidanceEn = `Practically: feed this Graha's energy through disciplined action rather than fantasy. Any spiritual remedy you do for ${info.meta.en} — mantra, dāna, or behavioural discipline — pays off most if it is done on that planet's weekday and during its direct/high-bala period.`;
      const guidanceHi = `व्यावहारिक सूत्र: इस ग्रह की ऊर्जा को कल्पना से नहीं, अनुशासित कर्म से पोषित करें। ${info.meta.hi} के लिए कोई भी उपाय — मंत्र, दान या व्यवहार-अनुशासन — उसके वार (weekday) और उसके बलवान काल में करने से सबसे अधिक फल देता है।`;

      if (lang === "hi") {
        return `
          <div class="p-5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h4 class="text-lg md:text-xl font-bold text-white">
                  ${info.meta.hi} ${info.retro ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 ml-2">वक्री / विशेष चेष्टा बल</span>' : ''}
                </h4>
                <p class="text-xs text-gray-400 mt-0.5">कारकत्व: ${info.meta.karakaHi}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusHi}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">D1 स्थिति:</span>
                <strong class="text-amber-300">${info.bhava}वां भाव — ${d1Rashi.hi}</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">नक्षत्र:</span>
                <strong class="text-purple-300">${nak.name} (स्वामी: ${nak.ruler})</strong>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
                <span class="text-gray-400 block">D9 स्थिति:</span>
                <strong class="text-emerald-300">${info.d9Bhava}वां भाव — ${d9Rashi.hi}</strong>
              </div>
            </div>

            <p class="text-sm text-gray-200 mb-0">
              <strong>1. यह ग्रह आपके जीवन में क्या नियंत्रित करता है:</strong> ${info.meta.karakaHi} — यानी जीवन के वे सभी निर्णय, स्वाभाविक प्रवृत्तियां और बाहरी घटनाएं जो इस विषय से जुड़ी हैं, सीधे इसी ग्रह के हाथ में हैं।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>2. D1 एवं नक्षत्र-स्तरीय फलित:</strong> यह ग्रह <strong>${bhavaDesc.hi}</strong> में ${d1Rashi.hi} राशि और <strong>${nak.name}</strong> नक्षत्र में स्थित हैं। इसका अर्थ — आपके भीतर <em>${nak.traitHi}</em> की ऊर्जा जन्मजात रूप से जागृत है, और यह इस भाव के विषयों (${houseThemeShort(info.bhava, "hi")}) को आपके जीवन में सबसे अधिक सक्रिय रखती है। ${info.dignity.statusHi} की अवस्था में इसकी फलदायिता ${info.dignity.isExaltedD1 || info.dignity.isOwnD1 ? "असाधारण रूप से उच्च" : (info.dignity.isDebilitatedD1 ? "संघर्ष एवं विलंब के साथ" : "संतुलित एवं क्रमिक")} रहती है।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>3. D9 (नवांश) में ग्रह की परिपक्वता:</strong> यह ग्रह नवांश में <strong>${d9Rashi.hi} (${info.d9Bhava}वां भाव)</strong> में जाता है, जो 30 वर्ष की आयु और विवाह के पश्चात इसके फल को सूक्ष्म रूप से परिपक्व करता है। D9 में यह ${houseThemeShort(info.d9Bhava, "hi")} से जुड़े विषयों में दीर्घकालिक फल देता है — यही कारण है कि 30 के बाद आपका जीवन-दृष्टिकोण इस ग्रह की स्वामी-ऊर्जा के अनुसार बदलता है।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>4. युति (Conjunction) एवं मिश्रित प्रभाव:</strong> ${yutiHi}
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>5. पाराशरी दृष्टि — बाहर भेजी ऊर्जा:</strong> यह ग्रह <strong>${outgoingHi}</strong>। इसका अर्थ — जिन भावों पर यह दृष्टि डाल रहा है, उन क्षेत्रों में भी आपकी नियति गतिशील रहेगी।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>6. आने वाली दृष्टियां — जो इस ग्रह को प्रभावित कर रही हैं:</strong> ${incomingHi}। यह दिखाता है कि बाहर से कौन सी ऊर्जाएं इस ग्रह के फल को संशोधित (modify) कर रही हैं — कुछ मामलों में समर्थन, कुछ में दबाव।
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>7. समय-चक्र प्रभाव:</strong> ${dashaHintHi}
            </p>

            <p class="text-sm text-gray-200 mb-0">
              <strong>8. व्यावहारिक मार्गदर्शन:</strong> ${guidanceHi}
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
              <p class="text-xs text-gray-400 mt-0.5">Significations: ${info.meta.karakaEn}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${info.dignity.badgeClass}">${info.dignity.statusEn}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D1 Placement:</span>
              <strong class="text-amber-300">${info.bhava}th House — ${d1Rashi.en}</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">Nakshatra:</span>
              <strong class="text-purple-300">${nak.name} (Ruler: ${nak.ruler})</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900 border border-white/10">
              <span class="text-gray-400 block">D9 (Navamsa):</span>
              <strong class="text-emerald-300">${info.d9Bhava}th House — ${d9Rashi.en}</strong>
            </div>
          </div>

          <p class="text-sm text-gray-200 mb-0">
            <strong>1. What this Graha governs in your life:</strong> ${info.meta.karakaEn} — every decision, instinct, and external event tied to these significations is under this planet's direct supervision.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>2. D1 and Nakshatra-level reading:</strong> Positioned in the <strong>${bhavaDesc.en}</strong> in ${d1Rashi.en} under <strong>${nak.name}</strong>, this Graha wires you with <em>${nak.traitEn}</em>. Its presence in this house keeps the themes of <em>${houseThemeShort(info.bhava, "en")}</em> permanently switched on in your life. ${info.dignity.statusEn === "Balanced functional state" ? "" : "Currently it sits in a state of <strong>" + info.dignity.statusEn + "</strong>."} ${info.dignity.isExaltedD1 || info.dignity.isOwnD1 ? "This placement behaves with unusually high natural strength, delivering its benefic significations more easily." : (info.dignity.isDebilitatedD1 ? "This placement delivers its fruits with friction and delay — the results require sustained effort, and often show up in later life." : "It delivers its results at a steady, balanced pace.")}
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>3. D9 (Navamsa) maturity:</strong> In the D9 chart it moves into <strong>${d9Rashi.en} (${info.d9Bhava}th D9 House)</strong>, meaning its deeper fruit ripens after age 30 and post-marriage. The D9 shift tilts its long-term expression toward the themes of <em>${houseThemeShort(info.d9Bhava, "en")}</em>.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>4. Yuti (Conjunction) and mixed effects:</strong> ${yutiEn}
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>5. Parashari Drishti — outgoing aspects cast:</strong> This Graha casts ${outgoingEn}. Every house it touches becomes a live "karmic theatre" where its agenda plays out through you.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>6. Drishti received — incoming aspects:</strong> ${incomingEn}. This tells you which external planetary forces are modulating this Graha — some with supportive rays, others with subtle pressure.
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>7. Time-cycle impact:</strong> ${dashaHintEn}
          </p>

          <p class="text-sm text-gray-200 mb-0">
            <strong>8. Practical guidance:</strong> ${guidanceEn}
          </p>
        </div>
      `;
    }).join("");

    return modeBanner + `<div class="space-y-4">${cardsHtml}</div>`;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 9 — SPECIAL LAGNAS + REAL ASHTAKAVARGA (BAV & SAV)
  // --------------------------------------------------------------------------
  function buildChapter9SpecialLagnas(ctx) {
    const { lang, specialLagnas } = ctx;
    const chandra = RASHI_DATA[specialLagnas.chandraLagna];
    const surya   = RASHI_DATA[specialLagnas.suryaLagna];
    const navamsa = RASHI_DATA[specialLagnas.navamsaLagna];
    const arudha  = RASHI_DATA[specialLagnas.arudhaRashi];
    const karakamsa = RASHI_DATA[specialLagnas.karakamsaRashi];
    const bindus  = specialLagnas.houseBindus;
    const bav     = specialLagnas.houseBav;

    // Identify strongest and weakest houses
    const houseArr = Object.keys(bindus).map(h => ({h: parseInt(h, 10), b: bindus[h]}));
    const sorted = [...houseArr].sort((a, b) => b.b - a.b);
    const strongest = sorted.slice(0, 3);
    const weakest = sorted.slice(-3).reverse();

    // SAV grid — proper color by real bindu count
    const savGrid = houseArr.map(({h, b}) => {
      const color = b >= 30 ? "border-emerald-400/50 text-emerald-300"
                  : b <= 23 ? "border-rose-400/50 text-rose-300"
                  : b <= 26 ? "border-amber-400/40 text-amber-300"
                  : "border-white/15 text-gray-200";
      return `<div class="p-2.5 rounded-xl bg-slate-950/90 border ${color} text-center">
        <div class="text-[10px] uppercase text-gray-400">${lang === "hi" ? `भाव ${h}` : `House ${h}`}</div>
        <div class="text-base font-extrabold mt-0.5">${b}</div>
      </div>`;
    }).join("");

    // BAV mini-grid per planet (row per house, col per planet)
    const planets7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
    const planetShort = {Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me", Jupiter:"Ju", Venus:"Ve", Saturn:"Sa"};

    const bavRowsHtml = houseArr.map(({h}) => {
      const cells = planets7.map(p => {
        const v = bav[p][h];
        const col = v >= 5 ? "text-emerald-300" : v <= 2 ? "text-rose-300" : "text-gray-300";
        return `<td class="py-1.5 px-2 text-center font-bold ${col}">${v}</td>`;
      }).join("");
      const savVal = bindus[h];
      const savCol = savVal >= 30 ? "text-emerald-300" : savVal <= 23 ? "text-rose-300" : "text-amber-300";
      return `<tr class="hover:bg-white/5">
        <td class="py-1.5 px-2 text-gray-300 font-bold">${h}</td>
        ${cells}
        <td class="py-1.5 px-2 text-center font-extrabold ${savCol}">${savVal}</td>
      </tr>`;
    }).join("");

    const headerCells = planets7.map(p => `<th class="py-1.5 px-2 text-center text-amber-300">${planetShort[p]}</th>`).join("");

    // Interpretation of strongest / weakest houses
    const strongListEn = strongest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus)`).join(", ");
    const strongListHi = strongest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु)`).join(", ");
    const weakListEn = weakest.map(s => `<strong>House ${s.h}</strong> (${s.b} bindus)`).join(", ");
    const weakListHi = weakest.map(s => `<strong>${s.h}वां भाव</strong> (${s.b} बिंदु)`).join(", ");

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30">
            <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. चंद्र लग्न (${chandra.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              जन्म लग्न शरीर है, तो <strong>चंद्र लग्न (${chandra.hi})</strong> आपका मानसिक संसार है। गोचर (transits) और भावनात्मक निर्णय चंद्र लग्न से ही संचालित होते हैं — इसीलिए आपकी आंतरिक भावनात्मक सुरक्षा के लिए <em>${chandra.temperamentHi}</em> की गुणवत्ता चाहिए।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30">
            <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. सूर्य लग्न (${surya.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              <strong>सूर्य लग्न (${surya.hi})</strong> आपकी आत्म-गरिमा, पिता से संबंध और सामाजिक अधिकार (authority) को दर्शाता है। सूर्य लग्न से गणना करने पर जो भाव सक्रिय दिखते हैं, वही बताते हैं कि आप किस क्षेत्र में अपना स्वाभिमान कभी दांव पर नहीं लगाते।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30">
            <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. नवांश लग्न (${navamsa.hi}) एवं कारकांश (${karakamsa.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              D1 वृक्ष का बीज है, परंतु <strong>नवांश लग्न (${navamsa.hi})</strong> और <strong>कारकांश लग्न (${karakamsa.hi})</strong> उसके वास्तविक फल हैं। 30–32 वर्ष के बाद और विवाह के पश्चात आपका जीवन <em>${navamsa.temperamentHi}</em> गुणों की ओर स्पष्ट रूप से झुकता है।
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30">
            <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. जैमिनी आरूढ़ लग्न (AL — ${arudha.hi})</h4>
            <p class="text-sm text-gray-200 mb-0">
              आपका <strong>आरूढ़ लग्न ${arudha.hi}</strong> में (लग्न से <strong>${specialLagnas.arudhaHouseFromLagna}वें भाव</strong> में${specialLagnas.arudhaExceptionApplied ? " — जैमिनी स्व-सप्तम अपवाद नियम से संशोधित" : ""}) पड़ता है। Lagna आपकी सच्चाई है, पर AL वह 'माया' है जो दुनिया आप पर थोपती है — इसीलिए लोग अक्सर आपकी बाहरी गंभीरता देखकर यह अंदाजा नहीं लगा पाते कि भीतर किस संघर्ष से गुजर रहे हैं।
            </p>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. सर्वाष्टकवर्ग (SAV) — वास्तविक पाराशरी गणना</h4>
            <span class="text-xs text-gray-400">कुल 337 बिंदु • 30+ = असाधारण बल • 26 से कम = विशेष उपाय</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
            ${savGrid}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30">
              <div class="text-xs text-emerald-300 font-bold mb-1"><i class="fas fa-arrow-up mr-1"></i>सबसे मजबूत भाव</div>
              <p class="text-sm text-gray-200 mb-0">${strongListHi} — इन क्षेत्रों में आपकी सफलता स्वाभाविक रूप से तेज है, विशेष रूप से इन भावों के कारक ग्रहों की दशा में।</p>
            </div>
            <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30">
              <div class="text-xs text-rose-300 font-bold mb-1"><i class="fas fa-arrow-down mr-1"></i>सबसे कमजोर भाव</div>
              <p class="text-sm text-gray-200 mb-0">${weakListHi} — इन क्षेत्रों में आपको थोड़ा अतिरिक्त प्रयास, सही मार्गदर्शन, और अनुशासित उपाय चाहिए। यहां कम बिंदु 'बुरा भाग्य' नहीं, बल्कि 'अधिक सजगता की जरूरत' दर्शाता है।</p>
            </div>
          </div>

          <div class="mt-5 overflow-x-auto rounded-xl border border-white/15">
            <table class="w-full text-xs md:text-sm">
              <thead>
                <tr class="bg-slate-950 text-amber-300">
                  <th class="py-2 px-2 text-left">भाव</th>
                  ${headerCells}
                  <th class="py-2 px-2 text-center text-amber-200">SAV</th>
                </tr>
              </thead>
              <tbody class="bg-slate-900/60 divide-y divide-white/5 text-gray-200">
                ${bavRowsHtml}
              </tbody>
            </table>
          </div>
          <p class="text-[11px] text-gray-400 mt-2">
            <strong>कैसे पढ़ें:</strong> प्रत्येक कॉलम एक ग्रह की भिन्नाष्टकवर्ग (BAV) संख्या है — यानी उस ग्रह ने उस भाव में कितने शुभ बिंदु दिए हैं। 5+ = वह ग्रह उस भाव में बहुत शुभ है; 2- = वह ग्रह उस भाव में कमजोर या बाधक है। SAV = सब ग्रहों का कुल योग।
          </p>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 rounded-2xl bg-slate-950/85 border border-blue-400/30">
          <h4 class="text-lg font-bold text-blue-300 mb-2"><i class="fas fa-moon mr-2"></i>1. Chandra Lagna (${chandra.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            The Ascendant is your body; <strong>Chandra Lagna (${chandra.en})</strong> is the operating system of your mind. Transits (Gochara) and emotional decisions register through ${chandra.en} — which is why your inner emotional safety requires <em>${chandra.temperamentEn}</em>.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-orange-400/30">
          <h4 class="text-lg font-bold text-orange-300 mb-2"><i class="fas fa-sun mr-2"></i>2. Surya Lagna (${surya.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            <strong>Surya Lagna (${surya.en})</strong> governs your vital pride, paternal karma, and social authority. Counting houses from it reveals the exact life-domain where you never allow your self-respect to be bargained.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-purple-400/30">
          <h4 class="text-lg font-bold text-purple-300 mb-2"><i class="fas fa-ring mr-2"></i>3. Navamsa (${navamsa.en}) & Karakamsa (${karakamsa.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            If D1 is the tree, <strong>Navamsa Lagna (${navamsa.en})</strong> and <strong>Karakamsa (${karakamsa.en})</strong> determine the quality of the fruit. After age 30 and post-marriage, your life visibly shifts toward the traits of ${navamsa.en} — <em>${navamsa.temperamentEn}</em>.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-950/85 border border-amber-400/30">
          <h4 class="text-lg font-bold text-amber-300 mb-2"><i class="fas fa-eye mr-2"></i>4. Jaimini Arudha Lagna (AL in ${arudha.en})</h4>
          <p class="text-sm text-gray-200 mb-0">
            Your Arudha Pada falls in <strong>${arudha.en}</strong> (${specialLagnas.arudhaHouseFromLagna}th from Lagna${specialLagnas.arudhaExceptionApplied ? " — calibrated via Jaimini's 1st/7th Svastha exception rule" : ""}). Lagna is who you truly are; Arudha Lagna is the <em>Maya</em> the world projects onto you — explaining why outsiders consistently misjudge your inner struggles.
          </p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-slate-950/90 border border-white/15 mt-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 class="text-base md:text-lg font-bold text-amber-300"><i class="fas fa-th mr-2"></i>5. Sarvashtakavarga (SAV) — Real Parashari Calculation</h4>
          <span class="text-xs text-gray-400">Total 337 bindus • 30+ = exceptional power • Below 26 = requires conscious remedy</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
          ${savGrid}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30">
            <div class="text-xs text-emerald-300 font-bold mb-1"><i class="fas fa-arrow-up mr-1"></i>Strongest houses</div>
            <p class="text-sm text-gray-200 mb-0">${strongListEn} — success in these life-areas comes naturally and peaks strongly during the Dasha of their ruling planets.</p>
          </div>
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30">
            <div class="text-xs text-rose-300 font-bold mb-1"><i class="fas fa-arrow-down mr-1"></i>Weakest houses</div>
            <p class="text-sm text-gray-200 mb-0">${weakListEn} — these domains need additional conscious effort, correct guidance, and disciplined remedies. Low bindus signal "extra vigilance needed", not "bad luck".</p>
          </div>
        </div>

        <div class="mt-5 overflow-x-auto rounded-xl border border-white/15">
          <table class="w-full text-xs md:text-sm">
            <thead>
              <tr class="bg-slate-950 text-amber-300">
                <th class="py-2 px-2 text-left">House</th>
                ${headerCells}
                <th class="py-2 px-2 text-center text-amber-200">SAV</th>
              </tr>
            </thead>
            <tbody class="bg-slate-900/60 divide-y divide-white/5 text-gray-200">
              ${bavRowsHtml}
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-gray-400 mt-2">
          <strong>How to read:</strong> Each planet column shows that planet's Bhinnashtakavarga (BAV) count for that house — i.e., how many benefic points that planet contributes to that house. 5+ = that planet is highly benevolent for that house. 2- = that planet is weak or obstructive there. SAV column is the total across all 7 planets.
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 10 — CURRENT TIME PHASE (MAHADASHA & ANTARDASHA)
  // --------------------------------------------------------------------------
  function buildChapter10TimePhase(ctx) {
    const { lang, dasha, planetAnalysis, numData } = ctx;
    const mdInfo = planetAnalysis[dasha.md];
    const adInfo = planetAnalysis[dasha.ad];
    const mdRashi = RASHI_DATA[mdInfo.d1];
    const adRashi = RASHI_DATA[adInfo.d1];
    const relativeHouseOfAD = getBhavaFrom(mdInfo.d1, adInfo.d1);
    const difficultAxis = relativeHouseOfAD === 6 || relativeHouseOfAD === 8 || relativeHouseOfAD === 12;

    if (lang === "hi") {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
            <div class="text-xs text-cyan-300 font-bold uppercase">महादशा</div>
            <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.hi}</div>
            <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}वां भाव (${mdRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
            <div class="text-xs text-purple-300 font-bold uppercase">अंतर्दशा</div>
            <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.hi}</div>
            <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}वां भाव (${adRashi.hi})</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
            <div class="text-xs text-amber-300 font-bold uppercase">दशा-भुक्ति संबंध</div>
            <div class="text-xl font-extrabold text-white mt-1">दशानाथ से ${relativeHouseOfAD}वां</div>
            <div class="text-xs text-gray-400 mt-0.5">${dasha.isManualDasha ? "मैनुअल चयन" : "स्वतः परिकलित"}</div>
          </div>
        </div>

        <p>
          <strong>महादशा (${mdInfo.meta.hi}) का प्रभाव:</strong> इस समय आपके जीवन की मुख्य कमान ${mdInfo.meta.hi} के हाथों में है, जो ${mdInfo.bhava}वें भाव (${BHAVA_MEANINGS[mdInfo.bhava].hi}) में बैठे हैं। महादशा स्वामी आपके पूरे ध्यान और कर्म-परीक्षा को अपने भाव और अपने कारकत्व (${mdInfo.meta.karakaHi}) के इर्द-गिर्द खींच लाता है।
        </p>

        <p>
          <strong>अंतर्दशा (${adInfo.meta.hi}) और दशा-भुक्ति समीकरण:</strong> महादशा के भीतर ${adInfo.meta.hi} की अंतर्दशा चल रही है, जो लग्न से ${adInfo.bhava}वें भाव में और महादशा स्वामी से ${relativeHouseOfAD}वें स्थान पर है। ${
            difficultAxis
              ? `<strong>चेतावनी (6/8/12 दशा संबंध):</strong> यह अक्ष आपको पिछले कुछ महीनों से मानसिक बेचैनी, नींद में खलल और '100% मेहनत पर 50% परिणाम' जैसी स्थिति दे रहा है। यह ग्रह-दोष नहीं, बल्कि दशा-संधि (dasha-sandhi) का स्वाभाविक प्रभाव है — जो आने वाले महीनों में ठीक होता है।`
              : `महादशानाथ से अंतर्दशानाथ का ${relativeHouseOfAD}वां संबंध यह दर्शाता है कि पिछले 14–18 महीनों से जो कार्य रुके थे, अब उनके निर्णय और परिवर्तन का समय आ गया है।`
          }
        </p>

        <p>
          <strong>आगामी 12–18 महीने:</strong> वर्तमान वर्ष <strong>${numData.currentYear}</strong> के उत्तरार्ध और आगामी वर्ष की पहली तिमाही में जब गोचर के बृहस्पति और शनि आपके ${mdInfo.bhava}वें और ${adInfo.bhava}वें भाव पर दृष्टि देंगे, तब करियर, स्थान-परिवर्तन, या रिश्ते से जुड़ा एक बड़ा निर्णय आपके सामने आएगा। इसे भावनाओं में बहकर नहीं, बल्कि अपनी दशा के स्वामी की शक्ति को समझकर लें।
        </p>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div class="p-4 rounded-xl bg-slate-950/85 border border-cyan-400/40">
          <div class="text-xs text-cyan-300 font-bold uppercase">Mahadasha</div>
          <div class="text-xl font-extrabold text-white mt-1">${mdInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">${mdInfo.bhava}th House (${mdRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-purple-400/40">
          <div class="text-xs text-purple-300 font-bold uppercase">Antardasha</div>
          <div class="text-xl font-extrabold text-white mt-1">${adInfo.meta.en}</div>
          <div class="text-xs text-gray-400 mt-0.5">${adInfo.bhava}th House (${adRashi.en})</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-950/85 border border-amber-400/40">
          <div class="text-xs text-amber-300 font-bold uppercase">Dasha-Bhukti Axis</div>
          <div class="text-xl font-extrabold text-white mt-1">${relativeHouseOfAD}th from MD Lord</div>
          <div class="text-xs text-gray-400 mt-0.5">${dasha.isManualDasha ? "Manual calibration" : "Auto-calculated"}</div>
        </div>
      </div>

      <p>
        <strong>How your ${mdInfo.meta.en} Mahadasha is reshaping your life:</strong> Right now the master switch of your destiny is governed by ${mdInfo.meta.en}, seated in your ${mdInfo.bhava}th House (${BHAVA_MEANINGS[mdInfo.bhava].en}). Vimshottari predictive science works on a simple principle: a planet in Mahadasha forces you to confront and master every unfinished lesson of the house it occupies and the houses it aspects.
      </p>

      <p>
        <strong>The ${adInfo.meta.en} Antardasha sub-cycle:</strong> Within this major period you are navigating the sub-period of ${adInfo.meta.en} in your ${adInfo.bhava}th House, sitting ${relativeHouseOfAD} houses away from your Mahadasha lord. ${
          difficultAxis
            ? `<strong>Critical dasha-sandhi alert (6/8/12 axis):</strong> Because your MD and AD lords sit at a ${relativeHouseOfAD}th angle from each other, you have been experiencing mental restlessness, sudden delays right before completion, and emotional fatigue over the past several months. This is a natural transit artifact of dasha-sandhi — it eases significantly once the AD lord shifts.`
            : `This ${relativeHouseOfAD}th-house relational angle between ${dasha.md} and ${dasha.ad} is actively pushing stalled matters from the last 14–18 months toward a decisive turning point.`
        }
      </p>

      <p>
        <strong>Next 12–18 months forecast (${numData.currentYear}–${numData.currentYear + 1}):</strong> As transiting Jupiter and Saturn aspect your active ${mdInfo.bhava}th/${adInfo.bhava}th axis over the coming quarters, a major crossroads involving your career trajectory, financial restructuring, or relationship commitment will demand a clear decision. Navigating this window with exact degree-level remedies prevents costly missteps.
      </p>
    `;
  }

  // --------------------------------------------------------------------------
  // CHAPTER 11 — HIDDEN PROBLEMS, KARMIC TRAPS & DIAGNOSTIC HOOK
  // --------------------------------------------------------------------------
  function buildChapter11HiddenTraps(ctx) {
    const { lang, name, chart, planetAnalysis, specialLagnas, dasha } = ctx;
    const asc = chart.Asc.d1;
    const rashi8 = RASHI_DATA[getRashiOfBhava(asc, 8)];
    const rashi12 = RASHI_DATA[getRashiOfBhava(asc, 12)];
    const rahu = planetAnalysis.Rahu;
    const ketu = planetAnalysis.Ketu;
    const sat = planetAnalysis.Saturn;

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
          प्रिय <strong>${name}</strong>, ऊपर के 10 अध्यायों में आपने अपनी क्षमता, करियर, और भावी जीवनसाथी की संभावनाओं को देखा। <strong>अब सबसे कड़वा और महत्वपूर्ण ज्योतिषीय सत्य ध्यान से पढ़िए:</strong> यदि कुंडली में राजयोग और इतनी प्रतिभा मौजूद है, तो फिर आपके काम अंतिम क्षण पर क्यों अटकते हैं? आपका मन रात को अचानक बेचैन क्यों हो जाता है? और आपकी 100% मेहनत का पूरा फल अब तक क्यों नहीं मिल पाया?
        </p>

        <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
          <div class="font-bold text-red-300 text-base">
            <i class="fas fa-biohazard mr-2"></i> आपकी कुंडली में पाए गए 3 गुप्त कर्म-अवरोध:
          </div>
          <p class="text-sm mb-0">
            <strong>1. राहु-केतु का ${rahu.bhava}/${ketu.bhava} अक्ष (Nodal Karmic Trap):</strong> राहु <strong>${rahu.bhava}वें भाव (${RASHI_DATA[rahu.d1].hi})</strong> में और केतु <strong>${ketu.bhava}वें भाव (${RASHI_DATA[ketu.d1].hi})</strong> में बैठकर एक अदृश्य मानसिक धुंध पैदा कर रहे हैं। जब भी आप लक्ष्य के करीब पहुंचते हैं, राहु या तो ध्यान भटका देता है या गलत इंसान पर भरोसा करवाकर ऊर्जा नष्ट करवा देता है।
          </p>
          <p class="text-sm mb-0">
            <strong>2. शनि का ${sat.bhava}वें भाव एवं अष्टम भाव (${rashi8.hi}) का विलंब:</strong> शनि की स्थिति और अष्टम भाव का समीकरण दिखाता है कि आपके धन, पद, और विवाह-सुख के कारक ग्रहों की ऊर्जा 'अंशबल सुप्त अवस्था' में है — कागज़ पर मौजूद, परंतु फल देने में विलंब।
          </p>
          <p class="text-sm mb-0">
            <strong>3. सबसे कमजोर भाव — ${weakestHouse}वां (केवल ${minBindu} बिंदु):</strong> आपके ${weakestHouse}वें भाव (${BHAVA_MEANINGS[weakestHouse].hi}) में केवल <strong>${minBindu} अष्टकवर्ग बिंदु</strong> हैं, और वर्तमान में <strong>${PLANET_META[dasha.md].hi}–${PLANET_META[dasha.ad].hi}</strong> दशा चल रही है। बिना सटीक डिग्री परीक्षण और वैदिक/लाल किताब उपायों के, यह कमजोर कड़ी अगले 12–24 महीनों में आपके बने-बनाए अवसरों में बार-बार रुकावट डाल सकती है।
          </p>
        </div>

        <p class="text-amber-200 font-semibold mb-0">
          ⚠️ <strong>सबसे बड़ी गलती जो 95% लोग करते हैं:</strong> इंटरनेट से देखकर या किसी के कहने पर बिना अपनी कुंडली के सटीक अंशबल (exact degrees, Chalit chart, Shadbala) जांचे रत्न पहन लेना या गलत उपाय शुरू कर देना — जिससे मारक ग्रह और उग्र हो जाता है। अपनी वास्तविक जन्म-समय व स्थान की सटीक गणना और व्यक्तिगत उपायों के लिए दाईं ओर दिए कार्ड से <strong>आचार्य ज्ञानेंद्र सिंह तोमर जी</strong> से अभी व्हाट्सएप पर जुड़ें।
        </p>
      `;
    }

    return `
      <p>
        Dear <strong>${name}</strong>, in the ten chapters above you saw the extraordinary potential wired into your birth blueprint. <strong>Now pause and ask the harder question:</strong> If your chart carries such strong intelligence, leadership, and wealth indicators — <em>why do your biggest breakthroughs still get delayed at the 99th percentile? Why does mental exhaustion hit you exactly when you should be celebrating? And why do people you trust drain your energy the most?</em>
      </p>

      <div class="p-4 rounded-2xl bg-red-950/80 border border-red-400/50 space-y-3 my-4">
        <div class="font-bold text-red-300 text-base">
          <i class="fas fa-biohazard mr-2"></i> 3 unseen astrological blockages silently sabotaging your chart
        </div>
        <p class="text-sm mb-0">
          <strong>1. Rahu-Ketu ${rahu.bhava}/${ketu.bhava} nodal axis trap:</strong> With <strong>Rahu in your ${rahu.bhava}th House (${RASHI_DATA[rahu.d1].en})</strong> and <strong>Ketu in your ${ketu.bhava}th House (${RASHI_DATA[ketu.d1].en})</strong>, an invisible karmic smoke-screen operates in your chart. Right when a major career leap, exam, or relationship is about to solidify, Rahu triggers sudden overthinking, self-doubt, or misplaced trust in the wrong person.
        </p>
        <p class="text-sm mb-0">
          <strong>2. Dormant planetary degree & 8th/12th friction (${rashi8.en} / ${rashi12.en}):</strong> Combined with <strong>Saturn in your ${sat.bhava}th House</strong>, key wealth- and marriage-giving planets in your chart suffer from Avastha/Shadbala lock — meaning they exist on paper, but their degree-level delivery power is currently muted by an unresolved karmic debt.
        </p>
        <p class="text-sm mb-0">
          <strong>3. Critical Ashtakavarga drain in House ${weakestHouse} (only ${minBindu} bindus):</strong> Your <strong>${weakestHouse}th House (${BHAVA_MEANINGS[weakestHouse].en})</strong> holds the lowest energy reservoir in your chart while you are running the <strong>${dasha.md}–${dasha.ad} Dasha</strong>. Left unlocked, this weak link acts like a hole in the bucket — draining momentum over the next 12–24 months.
        </p>
      </div>

      <p class="text-amber-200 font-semibold mb-0">
        ⚠️ <strong>Do NOT wear random gemstones or perform generic internet remedies:</strong> Wearing a gemstone or ritual without verifying your exact birth-time degrees (Bhava Chalit, Shadbala & Badhaka Lord) often strengthens a functional malefic and makes matters worse. Connect directly with <strong>Gyanendra S. Tomar</strong> via the consultation card to the right for a full hand-calculated degree analysis, 5-year month-by-month timeline, and safe Lal Kitab & Vedic remedies.
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
          हमने यह 30-मिनट का गहन जीवन दस्तावेज़ इसलिए तैयार किया ताकि जो साधक आज ₹1101 का पूर्ण परामर्श लेने में असमर्थ भी हों, उन्हें भी भ्रामक वेबसाइट से निराश न लौटना पड़े। यदि इस विश्लेषण ने आपके मन के अनकहे सच को छुआ है, तो अपनी श्रद्धा एवं सामर्थ्य के अनुसार <strong>(₹51, ₹101, ₹251 या ₹501)</strong> की गुरु-दक्षिणा सामने दिए गए QR कोड पर अर्पित कर बृहस्पति देव का आशीर्वाद अवश्य ग्रहण करें।
        </p>
      `;
    } else {
      headingEl.innerHTML = `Honor the Sacred Law of Energy Exchange (Guru Dakshina) 🙏`;
      textEl.innerHTML = `
        <p>
          Dear <strong>${name}</strong>, in your chart, <strong>Jupiter (Brihaspati — karaka of divine grace and fortune)</strong> operates through <strong>${jupRashi.en}</strong>. According to ancient Vedic tradition, Jyotish is sacred <em>Brahma-Vidya</em>: whenever we decode the hidden secrets of our destiny, future partner, and planetary karma, offering a voluntary <strong>Guru Dakshina (Sacred Energy Exchange)</strong> seals the reading with auspicious Guru-Kripa and prevents subtle karmic debt on the 9th house of fortune.
        </p>
        <p>
          We created this exhaustive Life Dossier so that even someone who cannot afford our full ₹1101 hand-crafted consultation today still receives genuine, life-changing clarity. If this dossier spoke the unspoken truth about your life, please offer a heartfelt <strong>Guru Dakshina (₹51, ₹101, ₹251, or ₹501 as per your Shraddha)</strong> via the UPI QR code — and send your screenshot on WhatsApp to receive Gyanendra Ji's blessings.
        </p>
      `;
    }
  }

  // ==========================================================================
  // 7. HEADINGS, MASTHEAD & NAV UPDATES
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
      ch8Title: "सभी 9 ग्रहों का गहन फलित, युति एवं पाराशरी दृष्टियां (D1 + D9)",
      ch9Tag: "अध्याय 09 • विशेष लग्न एवं अष्टकवर्ग",
      ch9Title: "चंद्र लग्न, सूर्य लग्न, नवांश, आरूढ़ लग्न एवं वास्तविक अष्टकवर्ग (BAV/SAV)",
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
      ch8Title: "In-Depth Planetary Forces & How They Aspect Each Other",
      ch9Tag: "Chapter 09 • Multi-Dimensional Chart Synthesis",
      ch9Title: "Special Lagnas (Chandra, Surya, Navamsa, Arudha) + Real Ashtakavarga (BAV & SAV)",
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
        ? `<i class="fas fa-crown mr-1.5"></i> ${lang === "hi" ? "पूर्ण वैदिक कुंडली + चैल्डियन डॉसियर" : "Full Parashari + Jaimini + Chaldean Dossier"}`
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
      `Namaste Gyanendra Ji 🙏\nI just read my 30-Minute Life Dossier on Jyotish Tark.\n` +
      `• Name: ${ctx.name}\n` +
      `• DOB: ${ctx.dob} (Mulank ${ctx.numData.mulank} / Bhagyank ${ctx.numData.bhagyank})\n` +
      `• Lagna: ${RASHI_DATA[ctx.chart.Asc.d1].en} | Moon: ${RASHI_DATA[ctx.chart.Moon.d1].en}\n` +
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
  // 8. READING METRICS + STICKY SCROLLSPY
  // ==========================================================================

  function updateReadingMetricsBadge(lang) {
    const container = document.getElementById("masterDossierOutput");
    const badgeEl = document.getElementById("readingTimeEstimate");
    if (!container || !badgeEl) return;

    const rawText = container.innerText || "";
    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(28, Math.min(45, Math.round(wordCount / 130) + 12));
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
  // 9. MASTER ENTRY POINT
  // ==========================================================================

  window.generateCompleteLifeDossier = function (event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();

    const nameInput   = document.getElementById("userName")?.value.trim() || "Seeker";
    const dobInput    = document.getElementById("userDob")?.value || "1998-01-24";
    const langInput   = document.getElementById("reportLang")?.value || "en";
    const genderInput = document.getElementById("userGender")?.value || "male";

    const chaldean  = calculateChaldeanName(nameInput);
    const numData   = calculateNumerologyFromDob(dobInput);
    const chart     = readChartFromDOM(numData, chaldean);
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

    // Prefill manual form
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

  // Language switch → auto re-render if dossier is open
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
