/* Jyotish Tark — numerology page engine (v5)
   One language at a time (हिंदी or English), plain words, short lines.
   Main report · mobile / vehicle / house number · mulank milan · Lo Shu grid · personal months.
   Lucky sets match the site's older calculator; planet friendships are Parashari (Rahu ≈ Saturn,
   Ketu ≈ Mars); compound meanings follow Cheiro's "Book of Numbers" (1926), in our own words. */
(function () {
  "use strict";
  let LANG = "hi";
  try { const v = localStorage.getItem("nmLang"); if (v === "en" || v === "hi") LANG = v; } catch (e) { /* private mode */ }
  const hi = () => LANG === "hi";
  const L = (h, e) => (hi() ? h : e);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const track = (n, p) => { try { if (window.gtag) window.gtag("event", n, p || {}); } catch (e) { /* ignore */ } };

  const PLANET = { 1: ["सूर्य", "Sun"], 2: ["चंद्र", "Moon"], 3: ["गुरु", "Jupiter"], 4: ["राहु", "Rahu"], 5: ["बुध", "Mercury"], 6: ["शुक्र", "Venus"], 7: ["केतु", "Ketu"], 8: ["शनि", "Saturn"], 9: ["मंगल", "Mars"] };
  const pl = (n) => (PLANET[n] ? PLANET[n][hi() ? 0 : 1] : "");
  const LUCKY = { 1: [1, 2, 3, 9], 2: [1, 2, 5, 7], 3: [1, 2, 3, 9], 4: [1, 4, 5, 6, 8], 5: [1, 3, 5, 6], 6: [3, 5, 6, 8, 9], 7: [1, 2, 4, 5, 7], 8: [3, 4, 5, 6, 8], 9: [1, 3, 6, 9] };
  const COLORS = { 1: ["सुनहरा, नारंगी, पीला", "Gold, orange, yellow"], 2: ["सफ़ेद, क्रीम, हल्का हरा", "White, cream, light green"], 3: ["पीला, केसरिया, गुलाबी", "Yellow, saffron, pink"], 4: ["नीला, स्लेटी", "Blue, grey"], 5: ["हरा, सफ़ेद", "Green, white"], 6: ["सफ़ेद, गुलाबी, आसमानी", "White, pink, sky blue"], 7: ["हल्का पीला, सफ़ेद", "Light yellow, white"], 8: ["गहरा नीला, बैंगनी", "Navy blue, purple"], 9: ["लाल, सिंदूरी", "Red, crimson"] };
  const DAYS = { 1: ["रविवार, सोमवार", "Sunday, Monday"], 2: ["सोमवार, शुक्रवार", "Monday, Friday"], 3: ["गुरुवार, मंगलवार", "Thursday, Tuesday"], 4: ["शनिवार, बुधवार", "Saturday, Wednesday"], 5: ["बुधवार, शुक्रवार", "Wednesday, Friday"], 6: ["शुक्रवार, मंगलवार", "Friday, Tuesday"], 7: ["रविवार, सोमवार", "Sunday, Monday"], 8: ["शनिवार, शुक्रवार", "Saturday, Friday"], 9: ["मंगलवार, गुरुवार", "Tuesday, Thursday"] };
  const RUDRA = { 1: ["तीन मुखी या पाँच मुखी", "3 or 5 Mukhi", "prod-3"], 2: ["दो मुखी", "2 Mukhi", "prod-2"], 3: ["पाँच मुखी", "5 Mukhi", "prod-5"], 4: ["आठ मुखी", "8 Mukhi", "prod-8"], 5: ["चार मुखी", "4 Mukhi", "prod-4"], 6: ["छह मुखी या गौरी शंकर", "6 Mukhi or Gauri Shankar", "prod-6"], 7: ["नौ मुखी", "9 Mukhi", "prod-9"], 8: ["सात मुखी", "7 Mukhi", "prod-7"], 9: ["तीन मुखी", "3 Mukhi", "prod-3"] };

  // ---------- birth number (mulank) ----------
  const NUM = {
    1: { hi: { t: "नेतृत्व करने वाले", one: "आप आत्मविश्वासी हैं और अपने फ़ैसले ख़ुद लेना पसंद करते हैं।", nat: "आप आगे बढ़कर ज़िम्मेदारी लेते हैं और भीड़ में अलग दिखते हैं। दूसरों के कहने पर चलना आपको पसंद नहीं।", car: "प्रशासन, सरकारी नौकरी, अपना व्यवसाय, मैनेजमेंट, राजनीति या डॉक्टर जैसा काम आपके लिए अच्छा है।", love: "आप वफ़ादार साथी हैं, पर रिश्ते में भी अपनी बात ऊपर रखना चाहते हैं — साथी की राय को भी जगह दें।", money: "आप कमाने में अच्छे हैं; दिखावे पर ख़र्च कम करें।", str: "आत्मविश्वास, नेतृत्व, मेहनत", watch: "अहंकार, जल्दबाज़ी, ज़िद" }, en: { t: "The leader", one: "You are confident and like to make your own decisions.", nat: "You take charge naturally and stand out in a crowd. You don't like being told what to do.", car: "Administration, government jobs, your own business, management, politics or medicine suit you.", love: "You are a loyal partner but like to have the last word — make room for your partner's view.", money: "You earn well; spend less on show.", str: "Confidence, leadership, hard work", watch: "Ego, haste, stubbornness" } },
    2: { hi: { t: "भावुक और सहयोगी", one: "आप संवेदनशील हैं और लोगों को जोड़कर रखते हैं।", nat: "आप दूसरों की भावनाएँ जल्दी समझ लेते हैं और शांति पसंद करते हैं। मन जल्दी बदल सकता है।", car: "काउंसलिंग, शिक्षा, नर्सिंग, कला-संगीत, होटल-फ़ूड या जनता से जुड़ा काम अच्छा है।", love: "आप दिल से रिश्ता निभाते हैं; छोटी बातों को मन पर न लें।", money: "बचत की आदत अच्छी है; भावनाओं में आकर ख़र्च न करें।", str: "समझदारी, कल्पना, सहयोग", watch: "जल्दी भावुक होना, फ़ैसले टालना" }, en: { t: "Sensitive and caring", one: "You are sensitive and keep people together.", nat: "You read people's feelings quickly and prefer peace. Your mood can change fast.", car: "Counselling, teaching, nursing, arts, hospitality or public-facing work suits you.", love: "You give your heart to a relationship; don't take small things to heart.", money: "You save well; avoid emotional spending.", str: "Empathy, imagination, cooperation", watch: "Over-sensitivity, delaying decisions" } },
    3: { hi: { t: "ज्ञानी और मार्गदर्शक", one: "आप समझदार हैं और लोग आपसे सलाह लेते हैं।", nat: "आप सीखना और सिखाना पसंद करते हैं। अनुशासन और नैतिकता आपके लिए ज़रूरी हैं।", car: "शिक्षक, वकील, बैंक-वित्त, सलाहकार, धार्मिक या सामाजिक काम अच्छा है।", love: "आप सम्मान और भरोसे वाला रिश्ता चाहते हैं; हर बात पर उपदेश न दें।", money: "धन धीरे पर सही तरीक़े से बढ़ता है; किसी की गारंटी लेने से बचें।", str: "ज्ञान, ईमानदारी, अनुशासन", watch: "ज़रूरत से ज़्यादा भरोसा, ज़िद" }, en: { t: "The wise guide", one: "You are wise and people come to you for advice.", nat: "You love to learn and to teach. Discipline and values matter to you.", car: "Teaching, law, banking and finance, consulting, religious or social work suit you.", love: "You want a relationship built on respect and trust; avoid lecturing.", money: "Money grows slowly but steadily; avoid standing guarantee for others.", str: "Knowledge, honesty, discipline", watch: "Over-trusting, rigidity" } },
    4: { hi: { t: "अलग सोच वाले", one: "आप मेहनती हैं और चीज़ों को नए तरीक़े से देखते हैं।", nat: "आप लीक से हटकर सोचते हैं और नियम-व्यवस्था से काम करते हैं। जीवन में अचानक बदलाव आते रहते हैं।", car: "आईटी, इंजीनियरिंग, रिसर्च, तकनीक, सोशल मीडिया या विदेश से जुड़ा काम अच्छा है।", love: "आप सच्चे और व्यावहारिक साथी हैं; अपनी भावनाएँ खुलकर कहें।", money: "आमदनी में उतार-चढ़ाव रहता है; हर लेन-देन लिखित में रखें।", str: "मेहनत, नई सोच, व्यवस्था", watch: "अचानक फ़ैसले, बहस" }, en: { t: "The original thinker", one: "You are hardworking and see things differently.", nat: "You think outside the box and work in a structured way. Life brings sudden changes.", car: "IT, engineering, research, technology, social media or foreign-linked work suits you.", love: "You are honest and practical in love; say your feelings out loud.", money: "Income can go up and down; keep every deal in writing.", str: "Hard work, fresh ideas, organisation", watch: "Sudden decisions, arguments" } },
    5: { hi: { t: "तेज़ बुद्धि और व्यापारी सोच", one: "आप तेज़ दिमाग़ वाले हैं और बातचीत में माहिर हैं।", nat: "आप जल्दी सीखते हैं, नए लोगों से आसानी से जुड़ते हैं और बदलाव पसंद करते हैं।", car: "व्यापार, सेल्स, मार्केटिंग, मीडिया, अकाउंट्स, यात्रा या ऑनलाइन काम अच्छा है।", love: "आप हँसमुख साथी हैं; रिश्ते में स्थिरता और समय दोनों दें।", money: "कमाई के कई रास्ते बनते हैं; एक साथ बहुत सारे जोखिम न लें।", str: "बुद्धि, संवाद, लचीलापन", watch: "बेचैनी, काम अधूरे छोड़ना" }, en: { t: "Quick mind, born trader", one: "You are quick-witted and great with words.", nat: "You learn fast, connect easily with new people and enjoy change.", car: "Business, sales, marketing, media, accounts, travel or online work suits you.", love: "You are a fun partner; give the relationship stability and time.", money: "You find many ways to earn; don't take too many risks at once.", str: "Intelligence, communication, flexibility", watch: "Restlessness, leaving things half-done" } },
    6: { hi: { t: "प्रेम, सुंदरता और सुख", one: "आप आकर्षक हैं और परिवार व रिश्तों को बहुत महत्व देते हैं।", nat: "आपको सुंदर चीज़ें, कला और सुख-सुविधा पसंद है। आप ज़िम्मेदारी से घर-परिवार सँभालते हैं।", car: "फ़ैशन, डिज़ाइन, कला, होटल, ब्यूटी, ज्वेलरी या ग्राहक सेवा का काम अच्छा है।", love: "आप रोमांटिक और समर्पित साथी हैं; दूसरों को ख़ुश करने में ख़ुद को न भूलें।", money: "धन और सुविधाएँ मिलती हैं; बजट बनाकर ख़र्च करें।", str: "प्रेम, कला, ज़िम्मेदारी", watch: "अधिक ख़र्च, दिखावा" }, en: { t: "Love, beauty and comfort", one: "You are charming and value family and relationships deeply.", nat: "You love beautiful things, art and comfort, and you look after your family responsibly.", car: "Fashion, design, arts, hospitality, beauty, jewellery or customer service suits you.", love: "You are romantic and devoted; don't forget yourself while pleasing others.", money: "Money and comforts come to you; spend on a budget.", str: "Love, creativity, responsibility", watch: "Overspending, showing off" } },
    7: { hi: { t: "गहरी सोच और अध्यात्म", one: "आप गहराई से सोचते हैं और अपनी अलग दुनिया रखते हैं।", nat: "आप हर बात की जड़ तक जाना चाहते हैं। अकेले में सोचना और सीखना आपको अच्छा लगता है।", car: "रिसर्च, लेखन, विज्ञान, डेटा, अध्यात्म, ज्योतिष या विदेश से जुड़ा काम अच्छा है।", love: "आप कम बोलते हैं पर गहरा रिश्ता चाहते हैं; मन की बात साथी से साझा करें।", money: "पैसा अचानक आता-जाता है; बचत को नियम बनाएँ।", str: "अंतर्ज्ञान, शोध, ईमानदारी", watch: "अकेलापन, ज़्यादा सोचना" }, en: { t: "Deep thinker", one: "You think deeply and keep a private inner world.", nat: "You want to get to the root of things. You enjoy thinking and learning on your own.", car: "Research, writing, science, data, spirituality, astrology or foreign-linked work suits you.", love: "You say little but want a deep bond; share what's on your mind.", money: "Money can come and go suddenly; make saving a rule.", str: "Intuition, research, honesty", watch: "Isolation, overthinking" } },
    8: { hi: { t: "मेहनत और धैर्य", one: "आप मेहनती और धैर्यवान हैं; आपकी सफलता देर से पर पक्की आती है।", nat: "आप ज़िम्मेदारी गंभीरता से लेते हैं और लंबे समय तक मेहनत कर सकते हैं। शुरुआत में संघर्ष ज़्यादा रहता है।", car: "क़ानून, प्रशासन, उद्योग, निर्माण, रियल एस्टेट या लंबे प्रोजेक्ट वाला काम अच्छा है।", love: "आप वफ़ादार और गंभीर साथी हैं; प्यार जताने में संकोच न करें।", money: "धन धीरे-धीरे पर टिकाऊ बनता है; लंबी अवधि का निवेश अच्छा।", str: "धैर्य, अनुशासन, ईमानदारी", watch: "निराशा, काम का बोझ" }, en: { t: "Hard work and patience", one: "You are patient and hardworking; your success comes late but lasts.", nat: "You take responsibility seriously and can work hard for a long time. Early years can be a struggle.", car: "Law, administration, industry, construction, real estate or long projects suit you.", love: "You are loyal and serious in love; don't hesitate to show affection.", money: "Wealth builds slowly but lasts; long-term investing suits you.", str: "Patience, discipline, integrity", watch: "Pessimism, overwork" } },
    9: { hi: { t: "साहस और ऊर्जा", one: "आप साहसी और ऊर्जावान हैं; चुनौती से नहीं डरते।", nat: "आप जोश से काम करते हैं और दूसरों की रक्षा के लिए आगे आते हैं। ग़ुस्सा जल्दी आता है।", car: "सेना-पुलिस, खेल, सर्जरी, इंजीनियरिंग, सुरक्षा या ज़मीन-जायदाद का काम अच्छा है।", love: "आप जोशीले और सच्चे साथी हैं; बहस को झगड़ा न बनने दें।", money: "कमाई अच्छी होती है; जल्दबाज़ी के निवेश से बचें।", str: "साहस, ऊर्जा, ईमानदारी", watch: "ग़ुस्सा, जल्दबाज़ी" }, en: { t: "Courage and energy", one: "You are brave and energetic; challenges don't scare you.", nat: "You work with passion and step forward to protect others. Anger can rise quickly.", car: "Defence, police, sports, surgery, engineering, security or property work suits you.", love: "You are passionate and honest; don't let arguments turn into fights.", money: "You earn well; avoid hasty investments.", str: "Courage, energy, honesty", watch: "Temper, haste" } }
  };
  // ---------- life path (bhagyank) ----------
  const LIFE = {
    1: ["जीवन आपको अपने दम पर आगे बढ़ने और नेतृत्व करने की ओर ले जाता है।", "Life pushes you to stand on your own feet and lead."],
    2: ["जीवन आपको साझेदारी, धैर्य और रिश्तों से आगे बढ़ना सिखाता है।", "Life teaches you to grow through partnership, patience and relationships."],
    3: ["जीवन आपको ज्ञान बाँटने और दूसरों को राह दिखाने की ओर ले जाता है।", "Life leads you to share knowledge and guide others."],
    4: ["जीवन आपको मेहनत से मज़बूत नींव बनाने और बदलाव को अपनाने की सीख देता है।", "Life asks you to build strong foundations and accept change."],
    5: ["जीवन आपको अनुभव, यात्रा और नए अवसरों से आगे बढ़ाता है।", "Life moves you forward through experience, travel and new chances."],
    6: ["जीवन आपको परिवार, प्रेम और ज़िम्मेदारी के रास्ते पर ले जाता है।", "Life leads you along the path of family, love and responsibility."],
    7: ["जीवन आपको गहराई से समझने, सीखने और भीतर की शांति पाने की ओर ले जाता है।", "Life leads you to understand deeply, learn and find inner peace."],
    8: ["जीवन आपको धैर्य और मेहनत से बड़ी उपलब्धि की ओर ले जाता है।", "Life leads you to big achievement through patience and effort."],
    9: ["जीवन आपको साहस, सेवा और दूसरों की मदद के रास्ते पर ले जाता है।", "Life leads you towards courage, service and helping others."],
    11: ["11 मास्टर अंक है — आपमें प्रेरणा देने और लोगों को दिशा दिखाने की ख़ास क्षमता है।", "11 is a master number — you have a special gift to inspire and guide people."],
    22: ["22 मास्टर अंक है — आप बड़े और टिकाऊ काम खड़े करने की क्षमता रखते हैं।", "22 is a master number — you can build large, lasting things."],
    33: ["33 मास्टर अंक है — आपमें सेवा, सिखाने और करुणा की बड़ी क्षमता है।", "33 is a master number — you have a great capacity for service, teaching and compassion."]
  };
  const PY = {
    1: ["नई शुरुआत का साल — नया काम, नई योजना या नई दिशा शुरू करें।", "A year of new beginnings — start a new job, plan or direction."],
    2: ["धैर्य और साझेदारी का साल — रिश्तों पर ध्यान दें, जल्दबाज़ी न करें।", "A year of patience and partnership — focus on relationships, don't rush."],
    3: ["रचनात्मकता और मेल-जोल का साल — सीखें, बोलें और लोगों से जुड़ें।", "A year of creativity and connection — learn, speak up and meet people."],
    4: ["मेहनत और व्यवस्था का साल — नींव मज़बूत करें, अनुशासन रखें।", "A year of hard work and order — build foundations, stay disciplined."],
    5: ["बदलाव और यात्रा का साल — नए अवसर आएँगे, लचीले रहें।", "A year of change and travel — new chances will come, stay flexible."],
    6: ["परिवार और ज़िम्मेदारी का साल — घर, विवाह और रिश्तों से जुड़े काम बनेंगे।", "A year of family and duty — home, marriage and relationships take focus."],
    7: ["आत्म-चिंतन और सीख का साल — पढ़ाई, शोध और आराम पर ध्यान दें।", "A year of reflection and learning — focus on study, research and rest."],
    8: ["धन और उपलब्धि का साल — मेहनत का फल और बड़ी ज़िम्मेदारी मिलेगी।", "A year of money and achievement — effort pays off and responsibility grows."],
    9: ["समापन का साल — पुराने काम पूरे करें और जो काम का नहीं, उसे छोड़ें।", "A year of completion — finish old work and let go of what no longer serves you."]
  };
  const PM = { 1: ["नई शुरुआत", "New start"], 2: ["धैर्य व सहयोग", "Patience"], 3: ["मेल-जोल", "Connect"], 4: ["मेहनत", "Hard work"], 5: ["बदलाव", "Change"], 6: ["परिवार", "Family"], 7: ["आत्म-चिंतन", "Reflect"], 8: ["धन व उपलब्धि", "Achieve"], 9: ["समापन", "Complete"] };
  const MON = { hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };

  // ---------- Cheiro compound numbers ----------
  const C = {
    10: ["भाग्य चक्र", "Wheel of fortune", "good", "मान-सम्मान और भरोसे का अंक।", "A number of honour and trust."],
    11: ["छिपी चुनौतियाँ", "Hidden trials", "care", "भरोसे के लोगों से धोखे की चेतावनी — सतर्क रहें।", "A warning of betrayal by people you trust — stay alert."],
    12: ["त्याग", "Sacrifice", "care", "दूसरों के लिए अपना नुकसान करने का संकेत — अपनी सीमा तय रखें।", "A sign of sacrificing yourself for others — set limits."],
    13: ["परिवर्तन", "Change", "care", "अचानक बदलाव का अंक — अशुभ नहीं, पर तैयार रहें।", "A number of sudden change — not unlucky, but be ready."],
    14: ["गति और जोखिम", "Movement and risk", "care", "लेन-देन और यात्रा में तेज़ी, पर जोखिम भी।", "Fast movement in deals and travel, with some risk."],
    15: ["आकर्षण और लाभ", "Magnetism and gain", "good", "धन और लोगों की मदद मिलने का शुभ अंक।", "A lucky number for money and help from others."],
    16: ["टूटता क़िला", "The falling tower", "care", "योजनाएँ अचानक बिगड़ने की चेतावनी — पहले से तैयारी रखें।", "A warning that plans may suddenly fall apart — prepare ahead."],
    17: ["जादूगर का तारा", "Star of the Magi", "good", "शांति, सम्मान और नाम का बहुत शुभ अंक।", "A very lucky number for peace, respect and reputation."],
    18: ["संघर्ष", "Conflict", "care", "विवाद और धोखे की चेतावनी — क़ानूनी मामलों में सावधानी।", "A warning of disputes and deceit — be careful legally."],
    19: ["सूर्य का राजकुमार", "Prince of Heaven", "good", "सफलता और सम्मान — सबसे शुभ अंकों में से एक।", "Success and honour — one of the luckiest numbers."],
    20: ["जागरण", "Awakening", "good", "नई शुरुआत और बड़े उद्देश्य का अंक; पैसों में थोड़ी देरी संभव।", "New purpose and a fresh start; money may come a little late."],
    21: ["विश्व का मुकुट", "Crown of the Magi", "good", "उन्नति और जीत का बहुत शुभ अंक।", "A very lucky number of rise and victory."],
    22: ["भ्रम", "Illusion", "care", "ग़लत लोगों पर भरोसे की चेतावनी — सोचकर फ़ैसला लें।", "A warning against trusting the wrong people — decide carefully."],
    23: ["सिंह का राजसी तारा", "Royal Star of the Lion", "good", "सफलता और बड़ों की मदद का बहुत शुभ अंक।", "A very lucky number of success and support from seniors."],
    24: ["सहयोग और प्रेम", "Help and love", "good", "बड़े लोगों का साथ और प्रेम में लाभ।", "Support from influential people and luck in love."],
    25: ["अनुभव से शक्ति", "Strength through experience", "good", "पहले परीक्षा, फिर सफलता।", "Tested first, successful later."],
    26: ["साझेदारी की चेतावनी", "Partnership warning", "care", "साझेदार और सलाहकार सोच-समझकर चुनें।", "Choose partners and advisers carefully."],
    27: ["राजदंड", "The sceptre", "good", "अधिकार और नेतृत्व का शुभ अंक।", "A lucky number of authority and leadership."],
    28: ["विरोधाभास", "Contradiction", "care", "दूसरों पर भरोसे से नुकसान का संकेत — पैसों में सावधानी।", "Loss through trusting others — be careful with money."],
    29: ["अनिश्चितता", "Uncertainty", "care", "धोखे और रिश्तों में अनबन की चेतावनी।", "A warning of deceit and relationship trouble."],
    30: ["गहरी सोच", "Deep thought", "mid", "परिणाम आपकी इच्छाशक्ति पर निर्भर।", "Results depend on your own will."],
    31: ["एकांत", "Solitude", "mid", "आत्मनिर्भर पर अकेलापन देने वाला अंक।", "Self-reliant but lonely."],
    32: ["संवाद का जादू", "Magic of communication", "good", "लोगों को जोड़ने वाला शुभ अंक।", "A lucky number that brings people together."],
    37: ["प्रेम और मित्रता", "Love and friendship", "good", "अच्छी साझेदारी और प्रेम का शुभ अंक।", "A lucky number for partnership and love."],
    43: ["उथल-पुथल", "Upheaval", "care", "संघर्ष और योजनाएँ बिखरने की चेतावनी।", "A warning of struggle and broken plans."],
    51: ["योद्धा", "The warrior", "good", "अचानक तरक़्क़ी का शुभ अंक; विरोधियों से सावधान।", "Sudden advancement; watch out for rivals."]
  };
  const CMAP = { 33: 24, 34: 25, 35: 26, 36: 27, 38: 29, 39: 30, 40: 31, 41: 32, 42: 24, 44: 26, 45: 27, 46: 37, 47: 29, 48: 30, 49: 31, 50: 32, 52: 43 };
  const compound = (n) => C[n] || (CMAP[n] ? C[CMAP[n]] : null);
  const cName = (c) => (hi() ? c[0] : c[1]), cText = (c) => (hi() ? c[3] : c[4]);

  const REL = { 1: { f: [2, 3, 9], e: [6, 8, 4] }, 2: { f: [1, 5], e: [] }, 3: { f: [1, 2, 9, 7], e: [5, 6] }, 4: { f: [5, 6, 8], e: [1, 2, 9, 7] }, 5: { f: [1, 6], e: [2] }, 6: { f: [5, 8, 4], e: [1, 2] }, 7: { f: [1, 2, 3], e: [5, 4] }, 8: { f: [5, 6, 4], e: [1, 2, 9, 7] }, 9: { f: [1, 2, 3, 7], e: [5] } };
  const rel = (a, b) => (a === b ? "f" : (REL[a].f.includes(b) ? "f" : (REL[a].e.includes(b) ? "e" : "n")));
  const pairKind = (a, b) => { const x = rel(a, b), y = rel(b, a); if (x === "e" || y === "e") return (x === "e" && y === "e") ? "e" : "m"; return (x === "f" && y === "f") ? "f" : "n"; };
  const CHALD = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };
  const root = (n) => { n = Math.abs(Number(n) || 0); while (n > 9) n = String(n).split("").reduce((a, b) => a + Number(b), 0); return n; };
  const sumDigits = (s) => String(s).replace(/\D/g, "").split("").reduce((a, b) => a + Number(b), 0);
  const reduceSteps = (n) => { const st = []; while (n > 9) { const d = String(n).split(""); n = d.reduce((a, b) => a + Number(b), 0); st.push(`${d.join(" + ")} = ${n}`); } return st.join(" → "); };
  const master = (n) => { if ([11, 22, 33].includes(n)) return n; while (n > 9 && ![11, 22, 33].includes(n)) n = sumDigits(n); return n; };
  function fromDob(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ""); if (!m) return null;
    const d = Number(m[3]), mo = Number(m[2]), y = Number(m[1]);
    if (!d || !mo || mo > 12 || d > 31 || y < 1900) return null;
    const parts = [master(d), master(mo), master(sumDigits(y))];
    let lp = parts[0] + parts[1] + parts[2]; lp = master(lp);
    return { d, mo, y, raw: m, mulank: root(d) || 9, lp, bhagyank: root(lp) || 9, parts };
  }
  function nameNum(name) {
    const L2 = String(name || "").toUpperCase().replace(/[^A-Z]/g, "").split("");
    if (!L2.length) return null;
    const comp = L2.reduce((a, c) => a + (CHALD[c] || 0), 0);
    return { comp, root: root(comp) || 9, br: L2.map((c) => `${c}(${CHALD[c]})`).join(" + ") };
  }
  function match(a, b) {
    const ab = LUCKY[a].includes(b), ba = LUCKY[b].includes(a);
    if (ab && ba) return { k: "good", t: L("उत्तम मेल", "Excellent match") };
    if (ab || ba) return { k: "ok", t: L("अच्छा मेल", "Good match") };
    return { k: "mid", t: L("सामान्य मेल", "Average match") };
  }
  const chip = (m) => `<span class="nm-chip nm-${m.k}">${m.t}</span>`;

  // =================== 1) MAIN REPORT ===================
  let lastMain = null, lastModel = null;
  const CT = () => window.NM_CONTENT || {};
  const LOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const PLANES = [[[4, 9, 2], "मानसिक तल", "Mental plane", "तेज़ बुद्धि और अच्छी याददाश्त।", "Sharp mind and good memory."], [[3, 5, 7], "भावनात्मक तल", "Emotional plane", "भावनाओं में संतुलन।", "Emotional balance."], [[8, 1, 6], "व्यावहारिक तल", "Practical plane", "मेहनत और व्यावहारिक सफलता।", "Hard work and practical success."], [[4, 3, 8], "विचार तल", "Thought plane", "अच्छी योजना बनाने की क्षमता।", "Good at planning."], [[9, 5, 1], "इच्छाशक्ति तल", "Will plane", "जो ठानें, उसे पूरा करने की ताक़त।", "The will to finish what you start."], [[2, 7, 6], "कर्म तल", "Action plane", "विचारों को काम में बदलने की क्षमता।", "Turns ideas into action."], [[4, 5, 6], "स्वर्ण योग", "Golden plane", "सफलता और समृद्धि का शुभ संकेत।", "A lucky sign of success and prosperity."], [[2, 5, 8], "संपत्ति योग", "Property plane", "घर और संपत्ति बनाने का संकेत।", "A sign of building home and property."]];
  const WA_NUM = "918318513814";
  const H2 = (pair) => (hi() ? pair[0] : pair[1]);

  // spelling suggestions for the name (adds or doubles one letter, keeps surname)
  function nameSuggestions(name, p) {
    const parts = String(name).toUpperCase().replace(/[^A-Z ]/g, " ").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return [];
    const first = parts[0], rest = parts.slice(1).join(" ");
    const both = LUCKY[p.mulank].filter((x) => LUCKY[p.bhagyank].includes(x));
    const fav = both.length ? both : LUCKY[p.mulank];
    const cand = new Set();
    for (let i = 0; i < first.length; i++) cand.add(first.slice(0, i + 1) + first[i] + first.slice(i + 1));
    ["A", "H", "E"].forEach((c) => cand.add(first + c));
    if (/^[^AEIOU][AEIOU]/.test(first)) cand.add(first[0] + "H" + first.slice(1));
    const out = [];
    cand.forEach((f) => {
      if (f === first) return;
      const full = rest ? f + " " + rest : f, nn = nameNum(full);
      const cp = nn.comp >= 10 && nn.comp <= 52 ? compound(nn.comp) : null;
      if (fav.includes(nn.root) && !(cp && cp[2] === "care")) out.push({ full: f.charAt(0) + f.slice(1).toLowerCase() + (rest ? " " + rest.split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ") : ""), comp: nn.comp, root: nn.root, good: cp && cp[2] === "good" });
    });
    out.sort((a, b) => (b.good ? 1 : 0) - (a.good ? 1 : 0));
    return out.slice(0, 4);
  }

  function model(dob, name) {
    const p = fromDob(dob); if (!p) return null;
    const nn = nameNum(name), now = new Date(), Y = now.getFullYear();
    const py = root(p.d + p.mo + root(Y)) || 9;
    const pmNow = root(py + now.getMonth() + 1) || 9, pdToday = root(pmNow + root(now.getDate())) || 9;
    const ok = nn ? (LUCKY[p.mulank].includes(nn.root) || LUCKY[p.bhagyank].includes(nn.root)) : true;
    const ncp = nn && nn.comp >= 10 && nn.comp <= 52 ? compound(nn.comp) : null;
    const months = [];
    for (let i = 0; i < 12; i++) {
      const dt = new Date(Y, now.getMonth() + i, 1), y2 = dt.getFullYear(), m2 = dt.getMonth() + 1, days = new Date(y2, m2, 0).getDate();
      const pyy = root(p.d + p.mo + root(y2)) || 9, pm = root(pyy + m2) || 9;
      let lucky = []; for (let d = 1; d <= days; d++) { const pd = root(pm + root(d)) || 9; if (LUCKY[p.mulank].includes(root(d) || 9) && [1, 3, 5, 6, 8].includes(pd)) lucky.push(d); }
      if (lucky.length < 2) { lucky = []; for (let d = 1; d <= days; d++) if (LUCKY[p.mulank].includes(root(d) || 9)) lucky.push(d); }
      months.push({ y: y2, m: m2, pm, lucky: lucky.slice(0, 6) });
    }
    const ds = (p.raw[3] + p.raw[2] + p.raw[1]).split("").map(Number).filter((x) => x);
    const add = [p.bhagyank]; if (p.d > 9) add.push(p.mulank);
    const all = ds.concat(add), cnt = Array.from({ length: 10 }, (_, d) => all.filter((x) => x === d).length);
    return { p, nn, name, dob, Y, py, pdToday, ok, ncp, months, ds, add, cnt, sugg: nn && (!ok || (ncp && ncp[2] === "care")) ? nameSuggestions(name, p) : [] };
  }

  // all sections as [title, html] — used for both screen and PDF
  function sections(M) {
    const { p, nn, name, Y, py, cnt } = M, C2 = CT(), D = (C2.DEEP && C2.DEEP[p.mulank]) ? C2.DEEP[p.mulank][LANG] : null;
    if (!D) return [];
    const kw = (n) => (C2.KW ? H2(C2.KW[n]) : "");
    const r1 = rel(p.mulank, p.bhagyank), r2 = rel(p.bhagyank, p.mulank);
    const comboRel = p.mulank === p.bhagyank ? L("आपका मूलांक और भाग्यांक एक ही है — स्वभाव और जीवन की दिशा एक ही ओर हैं, इसलिए इस अंक के गुण आपमें बहुत प्रबल हैं। अपनी ताक़त पर भरोसा रखें, पर इसके कमज़ोर पक्षों पर भी ध्यान दें।", "Your birth number and life path are the same — your nature and direction point the same way, so this number's qualities are very strong in you. Trust your strengths, but watch its weak sides too.")
      : (r1 === "e" || r2 === "e" ? L(`आपके स्वभाव में ${kw(p.mulank)} है, जबकि जीवन आपको ${kw(p.bhagyank)} की ओर ले जाता है। दोनों अंकों के ग्रह ${pl(p.mulank)} और ${pl(p.bhagyank)} आपस में मित्र नहीं माने जाते, इसलिए कई बार मन जो चाहता है और परिस्थितियाँ जो माँगती हैं, उनमें खिंचाव रहता है। यही खिंचाव आपको मज़बूत भी बनाता है — दोनों गुणों में संतुलन साधना आपकी सफलता की कुंजी है।`, `Your nature carries ${kw(p.mulank)}, while life pushes you towards ${kw(p.bhagyank)}. Their planets, ${pl(p.mulank)} and ${pl(p.bhagyank)}, are not considered friends, so there is often a pull between what you want and what life asks. That tension also makes you strong — balancing the two is your key to success.`)
        : (r1 === "f" && r2 === "f" ? L(`आपके स्वभाव में ${kw(p.mulank)} है और जीवन आपको ${kw(p.bhagyank)} की ओर ले जाता है। दोनों अंकों के ग्रह ${pl(p.mulank)} और ${pl(p.bhagyank)} आपस में मित्र हैं — इसलिए आप जैसे हैं, वैसा ही रास्ता आपको आगे बढ़ाता है। आपके प्रयास अक्सर सही दिशा में लगते हैं।`, `Your nature carries ${kw(p.mulank)} and life leads you towards ${kw(p.bhagyank)}. Their planets, ${pl(p.mulank)} and ${pl(p.bhagyank)}, are friends — so the path suits who you are, and your efforts usually go in the right direction.`)
          : L(`आपके स्वभाव में ${kw(p.mulank)} है और जीवन आपको ${kw(p.bhagyank)} की ओर ले जाता है। इन दोनों का संबंध सामान्य है — सही समय पर सही गुण का उपयोग करना आपको आगे ले जाएगा।`, `Your nature carries ${kw(p.mulank)} and life leads you towards ${kw(p.bhagyank)}. The two get along reasonably — using the right quality at the right time will take you forward.`)));
    const partners = LUCKY[p.mulank].slice();
    const hard = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => match(p.mulank, x).k === "mid").slice(0, 4);
    const S = [];
    // life stage: the same numbers read differently for a child, an adult and a senior (jt-life.js)
    const JL = window.JTLife, AG = JL ? JL.age(new Date(p.y, p.mo - 1, p.d)) : 30, NK = JL ? JL.numKey(AG) : null, LI = hi() ? 0 : 1;
    const kidNote = (h, e) => (AG < 16 ? `<p class="nm-small"><b>${L(`आयु अभी ${Math.floor(AG)} वर्ष:`, `Age now ${Math.floor(AG)}:`)}</b> ${L(h, e)}</p>` : "");
    S.push([L(`आपका स्वभाव — मूलांक ${p.mulank} (${pl(p.mulank)})`, `Your nature — birth number ${p.mulank} (${pl(p.mulank)})`),
      `<p>${D.nat}</p><div class="nm-two"><div><small>${L("लोग आपको कैसे देखते हैं", "How others see you")}</small><b>${D.out}</b></div><div><small>${L("आप भीतर से", "Who you are inside")}</small><b>${D.inn}</b></div></div>`]);
    S.push([L(`जीवन की दिशा — भाग्यांक ${p.lp}`, `Life direction — life path ${p.lp}`), `<p>${C2.LIFE2 ? H2(C2.LIFE2[p.lp] || C2.LIFE2[p.bhagyank]) : ""}</p><p>${comboRel}</p>`]);
    S.push([L("करियर और काम", "Career and work"), `${kidNote("यह भाग बताता है कि बड़े होकर किस तरह का काम स्वभाव के अनुकूल रहेगा — अभी इसका उपयोग विषय और रुचियाँ चुनने में करें।", "this shows what kind of work will suit the nature in adult life — for now, use it to choose subjects and interests.")}<p>${D.career}</p><p class="nm-small">${D.work}</p>`]);
    S.push([L("प्रेम और विवाह", "Love and marriage"), `${kidNote("यह भाग वयस्क जीवन में रिश्तों के स्वभाव को बताता है — अभी इससे दोस्ती और भावनाओं को समझें।", "this describes the nature in adult relationships — for now, use it to understand friendships and feelings.")}<p>${D.love}</p><div class="nm-two"><div><small>${L("अनुकूल साथी के मूलांक", "Compatible birth numbers")}</small><b>${partners.join(", ")}</b></div><div><small>${L("जिनसे समझ में मेहनत लगती है", "Numbers that need more understanding")}</small><b>${hard.length ? hard.join(", ") : "—"}</b></div></div>`]);
    S.push([L("पैसा", "Money"), `${kidNote("धन की ये बातें बड़े होने पर दिखेंगी; अभी बचत और पैसों की समझ सिखाने में इनका उपयोग करें।", "these money traits show in adult life; for now, use them to teach saving and money sense.")}<p>${D.money}</p>`]);
    S.push([L("परिवार", "Family"), `<p>${D.family}</p>`]);
    S.push([L("सेहत की प्रवृत्ति", "Wellbeing tendencies"), `<p>${D.health}</p><p class="nm-small">${L("यह अंक ज्योतिष का सामान्य संकेत है, चिकित्सा सलाह नहीं।", "General numerology tendency, not medical advice.")}</p>`]);
    S.push([L("कमज़ोरियाँ और सुधार", "Weak spots and how to fix them"), `<ul class="nm-fix">${D.weak.map((w) => `<li><b>${w[0]}</b><span>${w[1]}</span></li>`).join("")}</ul>`]);
    // name
    if (nn) {
      const ok = M.ok && !(M.ncp && M.ncp[2] === "care");
      S.push([L("आपके नाम का अंक", "Your name number"), `<p><b>${esc(name)}</b> = ${nn.comp} → <b>${nn.root}</b> (${pl(nn.root)})${M.ncp ? ` · ${L("संयुक्त अंक", "compound")} ${nn.comp}: "${cName(M.ncp)}" — ${cText(M.ncp)}` : ""}</p>
        <p>${ok ? L("आपके नाम का अंक आपके मूलांक या भाग्यांक के अनुकूल है। नाम बदलने की ज़रूरत नहीं है — अपने नाम पर भरोसा रखें।", "Your name number suits your birth number or life path. There's no need to change your name.") : L(`नाम का अंक आपके जन्म-अंकों से पूरा मेल नहीं खाता। इसका मतलब असफलता नहीं है — पर अंक ज्योतिष में माना जाता है कि नाम का अनुकूल अंक प्रयासों में सहजता लाता है।`, `Your name number doesn't fully match your birth numbers. This doesn't mean failure — but in numerology a favourable name number is believed to make efforts smoother.`)}</p>
        ${M.sugg.length ? `<p><b>${L("स्पेलिंग के कुछ विकल्प", "A few spelling options")}:</b></p><div class="nm-sugg nm-names">${M.sugg.map((x) => `<span><b>${esc(x.full)}</b><small>${x.comp} → ${x.root} (${pl(x.root)})</small></span>`).join("")}</div>
        <p class="nm-small">${L("ये विकल्प केवल गणना के आधार पर हैं। नाम की स्पेलिंग बदलने से पहले ज्योतिषी से सलाह लें। सरकारी दस्तावेज़ बदलना ज़रूरी नहीं — लोग अक्सर नई स्पेलिंग हस्ताक्षर, सोशल मीडिया या व्यवसाय में उपयोग करते हैं। इससे किसी परिणाम की गारंटी नहीं है।", "These options are based on calculation only. Consult an astrologer before changing your spelling. You don't need to change official documents — people often use the new spelling in signatures, social media or business. No result is guaranteed.")}</p>` : (ok ? "" : `<p class="nm-small">${L("इस नाम के लिए आसान स्पेलिंग विकल्प नहीं मिला — ज्योतिषी से व्यक्तिगत सलाह लें।", "No simple spelling option was found for this name — ask the astrologer for personal advice.")}</p>`)}`]);
    }
    // lucky
    S.push([L("आपके लिए शुभ", "Lucky for you"), `<div class="nm-kv"><div><small>${L("शुभ अंक", "Numbers")}</small><b>${LUCKY[p.mulank].join(", ")}</b></div><div><small>${L("शुभ रंग", "Colours")}</small><b>${H2(COLORS[p.mulank])}</b></div><div><small>${L("शुभ दिन", "Days")}</small><b>${H2(DAYS[p.mulank])}</b></div><div><small>${L("रुद्राक्ष", "Rudraksha")}</small><b><a href="https://jyotishtark.in/rudraksha.html#${RUDRA[p.mulank][2]}">${H2(RUDRA[p.mulank])}</a></b></div><div><small>${L("मंत्र", "Mantra")}</small><b>${C2.LS ? C2.LS[p.mulank].mantra : ""}</b></div></div>`]);
    // year + months
    S.push([L(`${Y} आपके लिए — व्यक्तिगत वर्ष ${py}`, `${Y} for you — personal year ${py}`), `<p>${NK ? JL.NUM.PY[NK][py][LI] : C2.PY2 ? H2(C2.PY2[py]) : ""}</p>`]);
    S.push([L("अगले 12 महीने — महीनेवार फल", "The next 12 months, month by month"), `<div class="nm-months">${M.months.map((mo, i) => { const t = NK ? JL.NUM.PM[NK][mo.pm][LI] : C2.PM2 ? C2.PM2[mo.pm][hi() ? 0 : 1] : ["", "", ""]; return `<div class="nm-mo${i === 0 ? " on" : ""}"><h5>${MON[LANG][mo.m - 1]} ${mo.y} <span>${mo.pm} · ${PM[mo.pm][hi() ? 0 : 1]}</span></h5><p>${t[0]}</p><p class="nm-small">${t[1]}<br>${t[2]}</p><p class="nm-lucky">${L("शुभ तारीख़ें", "Lucky dates")}: <b>${mo.lucky.join(", ")}</b></p></div>`; }).join("")}</div><p class="nm-small">${L("शुभ तारीख़ें आपके मूलांक और उस दिन के व्यक्तिगत अंक से निकाली गई हैं — नया काम, मीटिंग या ज़रूरी बातचीत के लिए इन्हें चुनें।", "Lucky dates are worked out from your birth number and each day's personal number — use them for new work, meetings or important talks.")}</p>`]);
    // Lo Shu
    const grid = LOSHU.map((n) => `<div class="nm-ls${cnt[n] ? "" : " nm-ls0"}"><b>${cnt[n] ? String(n).repeat(cnt[n]) : "·"}</b><small>${pl(n)}</small></div>`).join("");
    const done = PLANES.filter((x) => x[0].every((n) => cnt[n]));
    const miss = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !cnt[n]);
    const exc = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => cnt[n] >= 3);
    const strong = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => cnt[n] === 2);
    const planeMiss = (C2.PLANE_MISS || []).filter(([s]) => s.filter((n) => !cnt[n]).length >= 2);
    S.push([L("लो शू ग्रिड — आपका अंक चक्र", "Lo Shu grid — your number chart"), `<div class="nm-lsw"><div class="nm-lsg">${grid}</div><div>
      <p>${L(`जन्मतिथि के अंक (${M.ds.join(", ")}) के साथ भाग्यांक ${M.add[0]}${p.d > 9 ? ` और मूलांक ${M.add[1]}` : ""} जोड़कर यह ग्रिड बना है।`, `Built from your date digits (${M.ds.join(", ")}) plus life path ${M.add[0]}${p.d > 9 ? ` and birth number ${M.add[1]}` : ""}.`)}</p>
      ${done.length ? `<p><b>${L("पूरे तल", "Complete planes")}:</b></p><ul>${done.map((x) => `<li><b>${hi() ? x[1] : x[2]}</b> — ${hi() ? x[3] : x[4]}</li>`).join("")}</ul>` : `<p>${L("ग्रिड में कोई पूरा तल नहीं है — आपकी ताक़त अलग-अलग अंकों में बँटी है।", "No complete plane — your strengths are spread across numbers.")}</p>`}
      ${strong.length ? `<p><b>${L("आपके मज़बूत अंक", "Your strong numbers")}:</b> ${strong.map((n) => `${n} (${pl(n)} — ${kw(n)})`).join(", ")}. ${L("इन गुणों को अपने काम और फ़ैसलों में खुलकर उपयोग करें।", "Use these qualities openly in your work and decisions.")}</p>` : ""}
      </div></div>
      ${miss.length ? `<h5 class="nm-subh">${L("जो अंक नहीं हैं — उनके उपाय", "Missing numbers — remedies")}</h5><div class="nm-rem">${miss.map((n) => { const R = C2.LS[n]; return `<div><h6>${n} · ${pl(n)}</h6><p>${H2([R.hi[0], R.en[0]])}</p><ul><li><b>${L("आदत", "Habit")}:</b> ${H2([R.hi[1], R.en[1]])}</li><li><b>${L("वास्तु", "Vastu")}:</b> ${H2(R.item)} (${L("दिशा", "direction")}: ${H2(R.dir)})</li><li><b>${L("मंत्र", "Mantra")}:</b> ${R.mantra} — ${L("108 बार", "108 times")}, ${H2(R.day)}</li></ul></div>`; }).join("")}</div>` : `<p>${L("आपके ग्रिड में 1 से 9 तक सभी अंक हैं — यह संतुलित और दुर्लभ स्थिति है।", "All numbers 1 to 9 are present — a rare, balanced chart.")}</p>`}
      ${exc.length ? `<h5 class="nm-subh">${L("जो अंक बहुत बार हैं — संतुलन", "Repeated numbers — balance")}</h5><ul>${exc.map((n) => `<li>${H2(C2.EXC[n])}</li>`).join("")}</ul>` : ""}
      ${planeMiss.length ? `<h5 class="nm-subh">${L("अधूरे तल", "Incomplete planes")}</h5><ul>${planeMiss.map(([, t]) => `<li>${H2(t)}</li>`).join("")}</ul>` : ""}
      <p class="nm-small">${L("वास्तु दिशाएँ पारंपरिक लो शू वर्ग के अनुसार हैं। उपाय श्रद्धा और नियमितता से करें — ये सामान्य मार्गदर्शन हैं, गारंटी नहीं।", "Vastu directions follow the traditional Lo Shu square. Do remedies with faith and regularity — general guidance, not a guarantee.")}</p>`]);
    // how
    S.push([L("आपकी गणना कैसे हुई", "How your numbers were calculated"), `<ol class="nm-steps">
        <li><b>${L("मूलांक", "Birth number")}:</b> ${L("तारीख", "Day")} ${p.d}${p.d > 9 ? " → " + reduceSteps(p.d) : ""} → <b>${p.mulank}</b></li>
        <li><b>${L("भाग्यांक", "Life path")}:</b> ${L("तारीख", "day")} ${p.d} → ${p.parts[0]}, ${L("महीना", "month")} ${p.mo} → ${p.parts[1]}, ${L("वर्ष", "year")} ${p.y} → ${p.parts[2]}; ${p.parts.join(" + ")} = ${p.parts[0] + p.parts[1] + p.parts[2]} → <b>${p.lp}</b>${[11, 22, 33].includes(p.lp) ? L(" (मास्टर अंक)", " (master number)") : ""}</li>
        ${nn ? `<li><b>${L("नामांक", "Name number")}:</b> ${nn.br} = ${nn.comp} → <b>${nn.root}</b></li>` : ""}
        <li><b>${L("व्यक्तिगत वर्ष", "Personal year")}:</b> ${p.d} + ${p.mo} + ${root(Y)} (${Y}) = ${p.d + p.mo + root(Y)} → <b>${py}</b></li>
        <li><b>${L("व्यक्तिगत माह", "Personal month")}:</b> ${L("व्यक्तिगत वर्ष + महीने का अंक", "personal year + month number")}</li></ol>`]);
    return S;
  }

  function mainReport(e) {
    if (e) e.preventDefault();
    const f = document.getElementById("nmMainForm"), out = document.getElementById("nmMainOut");
    if (!f || !out) return;
    const M = model(f.dob.value, (f.nm.value || "").trim());
    if (!M) { out.innerHTML = `<p class="nm-err" role="alert">${L("कृपया सही जन्मतिथि चुनें।", "Please enter a valid date of birth.")}</p>`; f.dob.focus(); return; }
    lastMain = { dob: f.dob.value, name: M.name }; lastModel = M;
    const { p, nn, Y, py } = M, C2 = CT(), D = C2.DEEP[p.mulank][LANG];
    const tile = (lbl, num, sub, note) => `<div class="nm-tile"><small>${lbl}</small><b>${num}</b><span>${sub}</span><em>${note}</em></div>`;
    const S = sections(M);
    const one = (D.nat.split(/[।.]/)[0] + (hi() ? "।" : ".")) + " " + (C2.LIFE2 ? H2(C2.LIFE2[p.lp] || C2.LIFE2[p.bhagyank]).split(/[।.]/)[0] + (hi() ? "।" : ".") : "");
    const waText = L(`मेरी अंक ज्योतिष रिपोर्ट: मूलांक ${p.mulank} (${pl(p.mulank)}), भाग्यांक ${p.lp}${nn ? `, नामांक ${nn.root}` : ""}। आप भी देखें: https://jyotishtark.in/numerology.html`, `My numerology: birth number ${p.mulank} (${pl(p.mulank)}), life path ${p.lp}${nn ? `, name number ${nn.root}` : ""}. Try yours: https://jyotishtark.in/numerology.html`);
    const paidMsg = `नमस्ते, मुझे ₹299 वाली विस्तृत अंक ज्योतिष रिपोर्ट और नाम सुधार चाहिए।\nनाम: ${M.name || "-"}\nजन्मतिथि: ${p.d}-${p.mo}-${p.y}\nमूलांक ${p.mulank}, भाग्यांक ${p.lp}${nn ? `, नामांक ${nn.root}` : ""}`;
    out.innerHTML = `<div class="nm-res nm-main">
      <div class="nm-mhead"><small>${L("अंक ज्योतिष रिपोर्ट", "Numerology report")}</small><h3>${M.name ? esc(M.name) : L("आपकी रिपोर्ट", "Your report")}</h3><span>${L("जन्मतिथि", "Date of birth")}: ${p.d}-${p.mo}-${p.y}</span></div>
      <div class="nm-tiles">
        ${tile(L("मूलांक", "Birth number"), p.mulank, pl(p.mulank), L("आपका स्वभाव", "Your nature"))}
        ${tile(L("भाग्यांक", "Life path"), p.lp, pl(p.bhagyank), L("जीवन की दिशा", "Your direction"))}
        ${tile(L("नामांक", "Name number"), nn ? nn.root : "—", nn ? pl(nn.root) : L("नाम लिखें", "Add name"), L("नाम का असर", "Name effect"))}
        ${tile(L(`व्यक्तिगत वर्ष ${Y}`, `Personal year ${Y}`), py, PM[py][hi() ? 0 : 1], L("इस साल का विषय", "This year's theme"))}
      </div>
      <p class="nm-oneline"><b>${L("एक लाइन में", "In one line")}:</b> ${one}</p>
      <div class="nm-upsell"><span><b>${L("17 पेज की विस्तृत रिपोर्ट — ₹299", "17-page detailed report — ₹299")}</b> · ${L("स्वभाव, करियर, विवाह, 12 महीने का फल, नाम सुधार", "nature, career, marriage, 12-month forecast, name correction")}</span><a href="#nm-paid-card">${L("नमूना देखें व बनवाएँ ↓", "See sample & order ↓")}</a></div>
      <div class="nm-today"><span>${L("आज का आपका अंक", "Your number today")}</span><b>${M.pdToday}</b><p>${C2.PD ? H2(C2.PD[M.pdToday]) : ""}</p></div>
      ${S.map(([t, h]) => `<div class="nm-card"><h4>${t}</h4>${h}</div>`).join("")}
      <div class="nm-paid" id="nm-paid-card">
        <div><span class="nm-paid-tag">${L("विस्तृत रिपोर्ट · ₹299", "Detailed report · ₹299")}</span>
        <h4>${L("17 पेज की विस्तृत अंक ज्योतिष रिपोर्ट + नाम सुधार", "17-page detailed numerology report + name correction")}</h4>
        <ul><li>${L("19 अध्याय — जीवनसाथी, आत्मांक, बाह्यांक, कर्म अंक, जीवन के चार चरण, 9 वर्ष का चक्र", "19 chapters — life partner, soul urge, personality, karmic numbers, life stages, 9-year cycle")}</li><li>${L("नाम सुधार के विकल्प, मोबाइल नंबर, शुभ तारीख़ें और उपाय", "Name spelling options, mobile number, lucky dates and remedies")}</li><li>${L("भुगतान के तुरंत बाद इसी पेज पर PDF — इंतज़ार नहीं", "PDF on this page right after payment — no waiting")}</li></ul>
        <div class="nm-smp-mini" aria-label="${L("नमूना पेज", "Sample pages")}">${[1, 2, 3, 4, 5, 6, 7].map((k) => `<a href="#nm-sample"><img src="images/nm-sample-${hi() ? "hi" : "en"}-${k}.webp" width="74" height="105" alt="" loading="lazy"></a>`).join("")}</div>
        <div class="nm-plang" role="radiogroup" aria-label="${L("रिपोर्ट की भाषा", "Report language")}"><span>${L("रिपोर्ट की भाषा", "Report language")}:</span>
          <label><input type="radio" name="nmProLang" value="hi"${hi() ? " checked" : ""}> हिंदी</label><label><input type="radio" name="nmProLang" value="en"${hi() ? "" : " checked"}> English</label></div></div>
        <div><a class="nm-btn nm-wa" href="${(window.JTRef && window.JTRef.link("nm")) || "https://payments.cashfree.com/forms/jyotishtarknumerology"}" data-paid>${window.JTRef && window.JTRef.offer("nm") ? L("₹269 का भुगतान करें (मित्र छूट)", "Pay ₹269 (friend offer)") : L("₹299 का भुगतान करें", "Pay ₹299")}</a>${window.JTRef ? window.JTRef.note("nm", LANG) : ""}
        <p class="nm-small" style="margin:.4rem 0 0">${M.name ? L("रिपोर्ट इसी नाम और जन्मतिथि से बनेगी। भुगतान उसी फ़ोन/ब्राउज़र से करें।", "The report uses this name and date of birth. Pay from this same phone/browser.") : L("विस्तृत रिपोर्ट के लिए ऊपर अपना पूरा नाम भी लिखें।", "For the detailed report, also enter your full name above.")} <a href="https://wa.me/${WA_NUM}?text=${encodeURIComponent(paidMsg)}" target="_blank" rel="noopener">${L("सहायता", "Help")}</a></p><div data-promo></div></div>
      </div>
      <div class="nm-actions">
        <button type="button" class="nm-btn" data-pdf>${L("PDF रिपोर्ट डाउनलोड करें", "Download PDF report")}</button>
        <a class="nm-btn nm-wa" href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${L("WhatsApp पर शेयर करें", "Share on WhatsApp")}</a>
        <a class="nm-btn nm-ghost" href="kundali-form.html">${L("मुफ़्त कुंडली देखें", "See free Kundali")}</a>
      </div>
      <p class="nm-small">${L("अंक ज्योतिष सामान्य मार्गदर्शन है, गारंटी नहीं। व्यक्तिगत सलाह के लिए", "Numerology is general guidance, not a guarantee. For personal advice,")} <a href="consultation.html">${L("ज्योतिषी से बात करें — पहली 5 मिनट की कॉल मुफ़्त", "talk to the astrologer — first 5-minute call free")}</a>.</p></div>`;
    out.querySelector("[data-pdf]").addEventListener("click", () => { pdf(M); track("numerology_pdf", { lang: LANG }); });
    out.querySelector("[data-paid]").addEventListener("click", (ev) => {
      if (!M.name) { ev.preventDefault(); const nf = f.nm; nf.focus(); nf.scrollIntoView({ block: "center" }); return; }
      const pl2 = (out.querySelector('input[name="nmProLang"]:checked') || {}).value || LANG;
      try { localStorage.setItem("jt-nm-order", JSON.stringify({ dob: f.dob.value, name: M.name, lang: pl2, ts: Date.now(), ref: window.JTRef && window.JTRef.offer("nm") ? window.JTRef.code() : "" })); } catch (e2) { /* ignore */ }
      track("numerology_paid_click", { price: 299, lang: pl2 });
    });
    if (window.JTPromo) window.JTPromo.ui(out.querySelector("[data-promo]"), "nm", (off, h, msg) => {
      if (!M.name) { msg.textContent = L("कोड सही है — पहले ऊपर अपना पूरा नाम लिखें।", "Code accepted — first enter your full name above."); return false; }
      const pl2 = (out.querySelector('input[name="nmProLang"]:checked') || {}).value || LANG;
      try { localStorage.setItem("jt-nm-order", JSON.stringify({ dob: f.dob.value, name: M.name, lang: pl2, ts: Date.now(), promo: off })); } catch (e2) { /* ignore */ }
      track("numerology_promo", { off, lang: pl2 });
      if (off === 100) { msg.textContent = L("कोड लागू — रिपोर्ट बन रही है…", "Code applied — making your report…"); setTimeout(() => { location.href = "numerology.html?jtpaid=nm"; }, 500); return false; }
    }, LANG);
    if (e) out.scrollIntoView({ behavior: "smooth", block: "start" });
    track("numerology_report", { mulank: p.mulank, lang: LANG });
  }

  // ---------- PDF (print-ready A4 document in a new tab) ----------
  function stampSvg(size) {
    const k = "#7A1F1F", s = size || 150;
    const star = (cx, cy) => `<path d="M${cx} ${cy - 5}L${cx + 1.5} ${cy - 1.5}L${cx + 5} ${cy}L${cx + 1.5} ${cy + 1.5}L${cx} ${cy + 5}L${cx - 1.5} ${cy + 1.5}L${cx - 5} ${cy}L${cx - 1.5} ${cy - 1.5}Z" fill="${k}"/>`;
    return `<svg width="${s}" height="${s}" viewBox="0 0 200 200" role="img" aria-label="Jyotish Tark"><defs><path id="stT" d="M 38 100 A 62 62 0 0 1 162 100"/><path id="stB" d="M 22 100 A 78 78 0 0 0 178 100"/></defs><circle cx="100" cy="100" r="96" fill="none" stroke="${k}" stroke-width="4.5"/><circle cx="100" cy="100" r="89.5" fill="none" stroke="${k}" stroke-width="1.2"/><circle cx="100" cy="100" r="85" fill="none" stroke="${k}" stroke-width="1.6" stroke-dasharray="0.1 3.6" stroke-linecap="round"/><circle cx="100" cy="100" r="50" fill="none" stroke="${k}" stroke-width="1.2"/><circle cx="100" cy="100" r="46" fill="none" stroke="${k}" stroke-width="2.6"/><text font-family="'Tiro Devanagari Hindi',serif" font-size="19" fill="${k}" letter-spacing="1.5"><textPath href="#stT" startOffset="50%" text-anchor="middle">ज्योतिष तर्क</textPath></text><text font-family="Mukta,sans-serif" font-size="11.5" font-weight="700" fill="${k}" letter-spacing="2.2"><textPath href="#stB" startOffset="50%" text-anchor="middle">JYOTISH TARK · LUCKNOW</textPath></text>${star(29, 100)}${star(171, 100)}<text x="100" y="117" text-anchor="middle" font-family="'Tiro Devanagari Hindi',serif" font-size="48" fill="${k}">ॐ</text><text x="100" y="134" text-anchor="middle" font-family="Mukta,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.2" fill="${k}">॥ शुभम् भवतु ॥</text></svg>`;
  }
  function mandalaSvg() {
    let g = "";
    for (let i = 0; i < 16; i++) g += `<ellipse cx="100" cy="47" rx="9.5" ry="27" transform="rotate(${i * 22.5} 100 100)" fill="none" stroke="#E9C46A" stroke-width="1"/>`;
    for (let i = 0; i < 16; i++) g += `<ellipse cx="100" cy="66" rx="6" ry="15" transform="rotate(${i * 22.5 + 11.25} 100 100)" fill="rgba(233,196,106,.12)" stroke="#E9C46A" stroke-width=".8"/>`;
    for (let i = 0; i < 48; i++) { const a = i * 7.5 * Math.PI / 180; g += `<circle cx="${(100 + 93 * Math.sin(a)).toFixed(2)}" cy="${(100 - 93 * Math.cos(a)).toFixed(2)}" r="1.3" fill="#E9C46A"/>`; }
    return `<svg viewBox="0 0 200 200" width="230" height="230" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="none" stroke="#E9C46A" stroke-width="1.4"/><circle cx="100" cy="100" r="88" fill="none" stroke="#E9C46A" stroke-width=".6"/>${g}<circle cx="100" cy="100" r="42" fill="#5A1414" stroke="#E9C46A" stroke-width="1.6"/><circle cx="100" cy="100" r="37" fill="none" stroke="#E9C46A" stroke-width=".6" stroke-dasharray="2 2"/><text x="100" y="121" text-anchor="middle" font-family="'Tiro Devanagari Hindi',serif" font-size="56" fill="#F7E7C1">ॐ</text></svg>`;
  }
  function pdf(M) {
    const { p, nn, Y, py } = M;
    const S = sections(M);
    const today = new Date();
    const dstr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const title = L("अंक ज्योतिष रिपोर्ट", "Numerology Report");
    const box = (lbl, n, sub) => `<div class="cb"><small>${lbl}</small><b>${n}</b><span>${sub}</span></div>`;
    const doc = `<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — ${esc(M.name || "")} — Jyotish Tark</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
<style>
@page{size:A4;margin:16mm 14mm 16mm}
@page:first{margin:0}
*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#2B1810;font-family:Mukta,'Noto Sans Devanagari',sans-serif;font-size:11.5pt;line-height:1.65;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{width:210mm;height:297mm;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 38%,#8E2A2A 0%,#5A1414 55%,#3A0B0B 100%);color:#F7E7C1;text-align:center;page-break-after:always;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22mm}
.cover .fr{position:absolute;inset:9mm;border:1.6px solid #E9C46A;border-radius:3mm}.cover .fr2{position:absolute;inset:12mm;border:.6px solid #E9C46A;border-radius:2mm}
.cover .k{letter-spacing:.3em;font-size:11pt;color:#E9C46A;font-weight:700;margin:14px 0 4px}
.cover h1{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;font-size:40pt;margin:6px 0;color:#FBEFD0;line-height:1.2}
.cover .nm{font-family:'Tiro Devanagari Hindi',serif;font-size:24pt;margin:14px 0 2px;color:#fff}
.cover .dob{font-size:12.5pt;color:#F3DFAE}
.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin:12mm 0 8mm;width:150mm}
.cb{border:1px solid #E9C46A;border-radius:3mm;padding:4mm 2mm;background:rgba(0,0,0,.18)}.cb small{display:block;font-size:9.5pt;color:#E9C46A;font-weight:700}.cb b{display:block;font-size:26pt;line-height:1.15;color:#fff}.cb span{font-size:10pt;color:#F3DFAE}
.seal{background:#FBF4E4;border-radius:50%;padding:3mm;display:inline-block;margin-top:4mm}
.cover .ft{position:absolute;bottom:16mm;left:0;right:0;font-size:10pt;color:#E9C46A;letter-spacing:.05em}
.hd{display:flex;justify-content:space-between;border-bottom:1.5px solid #C9A227;padding-bottom:2mm;margin-bottom:5mm;font-size:9.5pt;color:#7A1F1F;font-weight:700}
h2{font-family:'Tiro Devanagari Hindi',serif;font-weight:400;color:#7A1F1F;font-size:15.5pt;margin:6mm 0 2mm;padding-bottom:1mm;border-bottom:.6px solid #E3D3B0;break-after:avoid}
p{margin:1.5mm 0}ul,ol{margin:1.5mm 0;padding-left:6mm}li{margin:.8mm 0}
.sec{break-inside:auto}.nm-two,.nm-kv{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:2mm 0}.nm-kv{grid-template-columns:repeat(3,1fr)}
.nm-two div,.nm-kv div{background:#FBF6EC;border:1px solid #EADCC0;border-radius:2mm;padding:2mm 3mm;break-inside:avoid}.nm-two small,.nm-kv small{display:block;font-size:9pt;color:#6B5444}
.nm-small{font-size:9.6pt;color:#5B4B37}a{color:#7A1F1F;text-decoration:none}
.nm-fix li b{display:block}.nm-fix li span{color:#4A3628}
.nm-months{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.nm-mo{border:1px solid #EADCC0;border-left:3px solid #C9A227;border-radius:2mm;padding:2.5mm 3mm;break-inside:avoid}.nm-mo h5{margin:0 0 1mm;font-size:11pt;color:#7A1F1F}.nm-mo h5 span{font-weight:400;color:#6B5444;font-size:9.5pt}.nm-mo p{margin:.8mm 0;font-size:10.2pt}.nm-lucky b{color:#14532D}
.nm-lsw{display:grid;grid-template-columns:52mm 1fr;gap:5mm;align-items:start}.nm-lsg{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5mm}
.nm-ls{aspect-ratio:1;border:1px solid #D9BE85;background:#FBF1DC;border-radius:2mm;display:grid;place-items:center;align-content:center;text-align:center}.nm-ls b{font-size:14pt;color:#7A1F1F}.nm-ls small{font-size:8pt;color:#6B5444}.nm-ls0{background:#fff;border-style:dashed}.nm-ls0 b{color:#B3A48C}
.nm-subh{font-size:11.5pt;color:#7A1F1F;margin:4mm 0 1.5mm}.nm-rem{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.nm-rem>div{border:1px solid #EADCC0;border-radius:2mm;padding:2.5mm 3mm;break-inside:avoid}.nm-rem h6{margin:0 0 1mm;font-size:11pt;color:#7A1F1F}.nm-rem p,.nm-rem li{font-size:10pt}
.nm-sugg{display:flex;flex-wrap:wrap;gap:3mm}.nm-sugg span{border:1px solid #BBF7D0;background:#F0FDF4;border-radius:2mm;padding:2mm 4mm;text-align:center}.nm-sugg b{display:block;color:#14532D}.nm-sugg small{font-size:9pt}
.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin:2mm 0 4mm}.summary div{border:1px solid #EADCC0;border-radius:2mm;text-align:center;padding:2.5mm;background:#FBF6EC}.summary small{display:block;font-size:9pt;color:#6B5444}.summary b{font-size:20pt;color:#7A1F1F;line-height:1.2;display:block}
.close{margin-top:8mm;display:flex;gap:6mm;align-items:center;border-top:1.5px solid #C9A227;padding-top:5mm;break-inside:avoid}
.bar{position:sticky;top:0;background:#7A1F1F;color:#fff;padding:10px 14px;display:flex;gap:10px;align-items:center;justify-content:space-between;font-size:14px;z-index:5}.bar button{background:#fff;color:#7A1F1F;border:0;border-radius:8px;padding:8px 14px;font:inherit;font-weight:700;cursor:pointer}
@media print{.bar{display:none}}
@media screen{body{background:#EDE6DA}.page{max-width:210mm;margin:0 auto;background:#fff;padding:14mm;box-shadow:0 2px 12px rgba(0,0,0,.15)}.cover{margin:0 auto}}
</style></head><body>
<div class="bar"><span>${L("यह आपकी PDF रिपोर्ट है। सेव करने के लिए बटन दबाएँ और 'Save as PDF' चुनें।", "This is your PDF report. Press the button and choose 'Save as PDF'.")}</span><button onclick="window.print()">${L("PDF सेव करें", "Save PDF")}</button></div>
<section class="cover"><div class="fr"></div><div class="fr2"></div>
  ${mandalaSvg()}
  <p class="k">॥ ${L("ज्योतिष तर्क", "JYOTISH TARK")} ॥</p>
  <h1>${esc(title)}</h1>
  <p class="nm">${esc(M.name || L("आपकी रिपोर्ट", "Your report"))}</p>
  <p class="dob">${L("जन्मतिथि", "Date of birth")}: ${p.d}-${p.mo}-${p.y}</p>
  <div class="cgrid">${box(L("मूलांक", "Birth no."), p.mulank, pl(p.mulank))}${box(L("भाग्यांक", "Life path"), p.lp, pl(p.bhagyank))}${box(L("नामांक", "Name no."), nn ? nn.root : "—", nn ? pl(nn.root) : "")}${box(L(`वर्ष ${Y}`, `Year ${Y}`), py, PM[py][hi() ? 0 : 1])}</div>
  <div class="seal">${stampSvg(120)}</div>
  <p class="ft">jyotishtark.in · ${L("ज्योतिषी ज्ञानेंद्र सिंह तोमर, लखनऊ", "Astrologer Gyanendra Singh Tomar, Lucknow")} · ${L("तैयार", "Prepared")}: ${dstr}</p>
</section>
<div class="page">
  <div class="hd"><span>${L("ज्योतिष तर्क · अंक ज्योतिष रिपोर्ट", "Jyotish Tark · Numerology Report")}</span><span>${esc(M.name || "")} · ${p.d}-${p.mo}-${p.y}</span></div>
  <div class="summary"><div><small>${L("मूलांक", "Birth number")}</small><b>${p.mulank}</b>${pl(p.mulank)}</div><div><small>${L("भाग्यांक", "Life path")}</small><b>${p.lp}</b>${pl(p.bhagyank)}</div><div><small>${L("नामांक", "Name number")}</small><b>${nn ? nn.root : "—"}</b>${nn ? pl(nn.root) : ""}</div><div><small>${L("व्यक्तिगत वर्ष", "Personal year")}</small><b>${py}</b>${PM[py][hi() ? 0 : 1]}</div></div>
  ${S.map(([t, h]) => `<div class="sec"><h2>${t}</h2>${h}</div>`).join("")}
  <div class="close">${stampSvg(110)}<div><p><b>${L("ज्योतिष तर्क, लखनऊ", "Jyotish Tark, Lucknow")}</b><br>${L("विस्तृत परामर्श, नाम सुधार और कुंडली के लिए", "For detailed consultation, name correction and Kundali")}: jyotishtark.in · WhatsApp +91 83185 13814</p><p class="nm-small">${L("यह रिपोर्ट अंक ज्योतिष के सामान्य सिद्धांतों पर आधारित है — मार्गदर्शन के लिए, गारंटी के लिए नहीं।", "This report is based on general numerology principles — for guidance, not as a guarantee.")}</p></div></div>
</div>
<script>document.fonts&&document.fonts.ready.then(function(){setTimeout(function(){try{window.print()}catch(e){}},500)});</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.open(); w.document.write(doc); w.document.close(); return; }
    // popup blocked: print through a hidden frame
    const fr = document.createElement("iframe");
    fr.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(fr);
    fr.srcdoc = doc;
    fr.onload = () => setTimeout(() => { try { fr.contentWindow.print(); } catch (e2) { /* ignore */ } setTimeout(() => fr.remove(), 4000); }, 900);
  }

  // =================== 2) NUMBER (mobile / vehicle / house) ===================
  const MOBILE = {
    1: [["नेतृत्व और पहचान", "सूर्य का यह नंबर आत्मविश्वास और पहचान देता है। लोग आपकी बात गंभीरता से लेते हैं।", "अपना व्यवसाय, प्रशासन, मैनेजर, डॉक्टर", "अहंकार और जल्दबाज़ी से बचें।"], ["Leadership and recognition", "A Sun number — it brings confidence and recognition. People take you seriously.", "Own business, administration, managers, doctors", "Avoid ego and haste."]],
    2: [["सहयोग और भावना", "चंद्र का यह नंबर लोगों से जुड़ाव और भरोसा बढ़ाता है।", "सेवा, काउंसलिंग, कला, होटल-फ़ूड", "फ़ैसलों में देरी न करें।"], ["Cooperation and feeling", "A Moon number — it builds connection and trust.", "Service, counselling, arts, food and hospitality", "Don't delay decisions."]],
    3: [["ज्ञान और सम्मान", "गुरु का यह नंबर सलाह और सम्मान से जुड़ा है।", "शिक्षक, वकील, वित्त, सलाहकार", "किसी की गारंटी लेने से बचें।"], ["Wisdom and respect", "A Jupiter number — linked to advice and respect.", "Teaching, law, finance, consulting", "Avoid standing guarantee for others."]],
    4: [["बदलाव और नई सोच", "राहु का यह नंबर नए विचार और नेटवर्क देता है, पर उतार-चढ़ाव भी।", "आईटी, तकनीक, सोशल मीडिया, रिसर्च", "हर लेन-देन लिखित में रखें।"], ["Change and new ideas", "A Rahu number — new ideas and networks, but ups and downs too.", "IT, technology, social media, research", "Keep every deal in writing."]],
    5: [["संचार और व्यापार", "बुध का यह नंबर बातचीत और व्यापार के लिए सबसे लोकप्रिय माना जाता है।", "सेल्स, मार्केटिंग, व्यापार, मीडिया, ऑनलाइन काम", "उतने ही वादे करें जितने निभा सकें।"], ["Communication and business", "A Mercury number — the most popular choice for talk and trade.", "Sales, marketing, business, media, online work", "Promise only what you can deliver."]],
    6: [["आकर्षण और सुख", "शुक्र का यह नंबर ग्राहकों और रिश्तों में मिठास लाता है।", "फ़ैशन, ब्यूटी, डिज़ाइन, होटल, ज्वेलरी", "ज़्यादा ख़र्च पर नियंत्रण रखें।"], ["Charm and comfort", "A Venus number — it brings warmth with clients and relationships.", "Fashion, beauty, design, hotels, jewellery", "Keep spending in check."]],
    7: [["चिंतन और शोध", "केतु का यह नंबर शांत और निजी काम के लिए अच्छा है।", "लेखन, शोध, विज्ञान, अध्यात्म", "सेल्स और व्यापार के लिए धीमा माना जाता है।"], ["Reflection and research", "A Ketu number — good for quiet, private work.", "Writing, research, science, spirituality", "Considered slow for sales and business."]],
    8: [["मेहनत और धैर्य", "शनि का यह नंबर देर से पर टिकाऊ परिणाम देता है।", "क़ानून, उद्योग, निर्माण, रियल एस्टेट", "जल्दी परिणाम की उम्मीद न रखें।"], ["Effort and patience", "A Saturn number — results come late but last.", "Law, industry, construction, real estate", "Don't expect quick results."]],
    9: [["ऊर्जा और साहस", "मंगल का यह नंबर जोश और तेज़ी देता है।", "खेल, सुरक्षा, ज़मीन-जायदाद, इंजीनियरिंग", "ग़ुस्से में बात न करें।"], ["Energy and courage", "A Mars number — it brings drive and speed.", "Sports, security, property, engineering", "Don't talk in anger."]]
  };
  const PURPOSE = { business: [5, 6, 1, 3], job: [1, 3, 5, 8], creative: [6, 2, 3, 5], personal: [] };
  function numberReport(e) {
    if (e) e.preventDefault();
    const f = document.getElementById("nmMobForm"), out = document.getElementById("nmMobOut");
    if (!f || !out) return;
    const kind = (f.kind && f.kind.value) || "mobile";
    const raw = (f.mob.value || "").toUpperCase();
    let digits = raw.replace(/\D/g, "");
    if (kind === "mobile") {
      digits = digits.replace(/^(91|0)(?=\d{10}$)/, "");
      if (digits.length !== 10) { out.innerHTML = `<p class="nm-err" role="alert">${L("कृपया 10 अंकों का मोबाइल नंबर लिखें।", "Please enter a 10-digit mobile number.")}</p>`; f.mob.focus(); return; }
    } else if (!digits.length || digits.length > 12) { out.innerHTML = `<p class="nm-err" role="alert">${L("कृपया सही नंबर लिखें।", "Please enter a valid number.")}</p>`; f.mob.focus(); return; }
    const D = digits.split("").map(Number), total = D.reduce((a, b) => a + b, 0), r = root(total) || 9;
    const counts = Array.from({ length: 10 }, (_, d) => D.filter((x) => x === d).length);
    const last = D[D.length - 1], p = fromDob(f.dob.value), nn = nameNum(f.nm ? f.nm.value : "");
    const purpose = f.purpose ? f.purpose.value : "personal";
    const cp = total >= 10 && total <= 52 ? compound(total) : null;
    const pairs = []; for (let i = 0; i < D.length - 1; i++) if (D[i] && D[i + 1]) pairs.push({ a: D[i], b: D[i + 1], k: pairKind(D[i], D[i + 1]) });
    const pc = { f: 0, n: 0, m: 0, e: 0 }; pairs.forEach((x) => pc[x.k]++);
    let score = null; const sc = [];
    if (p) {
      const m1 = match(p.mulank, r), m2 = match(p.bhagyank, r), pts = { good: 15, ok: 8, mid: 0 };
      sc.push([L("आधार", "Base"), 45], [L(`योग ${r} और मूलांक ${p.mulank}`, `Total ${r} vs birth number ${p.mulank}`), pts[m1.k]], [L(`योग ${r} और भाग्यांक ${p.bhagyank}`, `Total ${r} vs life path ${p.bhagyank}`), pts[m2.k]]);
      sc.push([L(`आख़िरी अंक ${last}`, `Last digit ${last}`), last ? (LUCKY[p.mulank].includes(last) ? 6 : 0) : -2]);
      sc.push([L(`अंकों के जोड़े`, `Digit pairs`), Math.round((pc.f * 2 + pc.n * 0.5 - pc.m - pc.e * 2.5) * 10) / 10]);
      if (counts[0] >= 3) sc.push([L(`शून्य ${counts[0]} बार`, `${counts[0]} zeros`), -3]);
      if (nn) sc.push([L(`नामांक ${nn.root}`, `Name number ${nn.root}`), { good: 6, ok: 3, mid: 0 }[match(nn.root, r).k]]);
      if (PURPOSE[purpose].length) sc.push([L("चुना गया उपयोग", "Chosen use"), PURPOSE[purpose].includes(r) ? 5 : 0]);
      if (cp) sc.push([L(`संयुक्त अंक ${total}`, `Compound ${total}`), cp[2] === "good" ? 4 : (cp[2] === "care" ? -4 : 0)]);
      score = Math.round(Math.max(20, Math.min(97, sc.reduce((a, x) => a + x[1], 0))));
      if (m1.k === "mid" && m2.k === "mid" && score > 58) { sc.push([L("मूलांक-भाग्यांक दोनों से सामान्य मेल (सीमा)", "Average match with both (cap)"), 58 - score]); score = 58; }
    }
    const band = score == null ? null : (score >= 80 ? [L("बहुत अनुकूल", "Very favourable"), "good"] : (score >= 62 ? [L("अनुकूल", "Favourable"), "good"] : (score >= 45 ? [L("सामान्य", "Average"), "ok"] : [L("कम अनुकूल", "Less favourable"), "mid"])));
    const M = MOBILE[r][hi() ? 0 : 1];
    const lbl = { mobile: L("मोबाइल नंबर", "Mobile number"), vehicle: L("गाड़ी नंबर", "Vehicle number"), house: L("मकान नंबर", "House number") }[kind];
    const shown = kind === "mobile" ? `${digits.slice(0, 5)} ${digits.slice(5)}` : raw.replace(/[^A-Z0-9 -]/g, "").trim();
    let sugg = [];
    if (p) { const common = LUCKY[p.mulank].filter((x) => LUCKY[p.bhagyank].includes(x)); sugg = (common.length ? common : LUCKY[p.mulank]).slice(); const pur = PURPOSE[purpose]; if (pur.length) sugg.sort((a, b) => (pur.includes(b) ? 1 : 0) - (pur.includes(a) ? 1 : 0)); }
    const verdict = score == null ? L("जन्मतिथि भी डालें — तब यह भी दिखेगा कि यह नंबर आपसे कितना मेल खाता है।", "Add your date of birth to see how well this number suits you.")
      : (score >= 62 ? L("यह नंबर आपके लिए अनुकूल है। बदलने की ज़रूरत नहीं।", "This number suits you. No need to change it.")
        : (score >= 45 ? L("यह नंबर ठीक है। चालू नंबर बदलना ज़रूरी नहीं।", "This number is fine. No need to change it.")
          : L("यह नंबर आपसे कम मेल खाता है। अगला नंबर लेते समय नीचे दिए योग चुनें।", "This number is a weaker match. Choose one of the totals below next time.")));
    const strip = D.map((d, i) => { const k = i < D.length - 1 && d && D[i + 1] ? pairKind(d, D[i + 1]) : null; return `<span class="nm-dg">${d}</span>${i < D.length - 1 ? `<span class="nm-lk nm-p${k || 0}"></span>` : ""}`; }).join("");
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !counts[d]);
    const enemies = pairs.filter((x) => x.k === "e").map((x) => `${x.a}${x.b}`);
    const last4 = kind === "vehicle" && digits.length > 4 ? digits.slice(-4) : null;
    const waText = L(`मेरे ${lbl} का अंक: ${total} → ${r} (${pl(r)})${score != null ? `, मेल ${score}/100` : ""}। आप भी देखें: https://jyotishtark.in/numerology.html#mobile-number-numerology`, `My ${lbl.toLowerCase()} adds up to ${total} → ${r} (${pl(r)})${score != null ? `, match ${score}/100` : ""}. Check yours: https://jyotishtark.in/numerology.html#mobile-number-numerology`);
    out.innerHTML = `<div class="nm-res nm-mobrep">
      <div class="nm-hero"><div class="nm-ring" style="--p:${score || 0}"><div><b>${r}</b><small>${pl(r)}</small></div></div>
        <div class="nm-hero-t"><small>${lbl} ${esc(shown)}</small><h3>${M[0]}${score != null ? ` <span class="nm-chip nm-${band[1]}">${score}/100 · ${band[0]}</span>` : ""}</h3>
        <p class="nm-verdict">${verdict}</p></div></div>
      <div class="nm-badges"><span><small>${L("कुल योग", "Total")}</small><b>${total}${total > 9 ? " → " + r : ""}</b></span>
        ${p ? `<span><small>${L(`मूलांक ${p.mulank} से`, `With birth no. ${p.mulank}`)}</small>${chip(match(p.mulank, r))}</span><span><small>${L(`भाग्यांक ${p.bhagyank} से`, `With life path ${p.bhagyank}`)}</small>${chip(match(p.bhagyank, r))}</span>` : ""}
        ${nn ? `<span><small>${L(`नामांक ${nn.root} से`, `With name no. ${nn.root}`)}</small>${chip(match(nn.root, r))}</span>` : ""}
        <span><small>${L("आख़िरी अंक", "Last digit")}</small><b>${last}</b></span></div>
      <div class="nm-card"><h4>${L("इस नंबर का स्वभाव", "What this number is like")}</h4><p>${M[1]}</p>
        <div class="nm-two"><div><small>${L("किस काम के लिए अच्छा", "Good for")}</small><b>${M[2]}</b></div><div><small>${L("ध्यान दें", "Watch out")}</small><b>${M[3]}</b></div></div></div>
      ${cp ? `<div class="nm-card nm-c-${cp[2]}"><h4>${L(`संयुक्त अंक ${total}`, `Compound number ${total}`)} — "${cName(cp)}"</h4><p>${cText(cp)}</p></div>` : ""}
      ${last4 ? `<div class="nm-card"><h4>${L("आख़िरी 4 अंक", "Last 4 digits")} (${last4})</h4><p>${L("कुछ लोग केवल आख़िरी 4 अंक देखते हैं:", "Some people use only the last 4 digits:")} ${last4.split("").join(" + ")} = ${sumDigits(last4)} → <b>${root(sumDigits(last4)) || 9} (${pl(root(sumDigits(last4)) || 9)})</b>${p ? ` · ${match(p.mulank, root(sumDigits(last4)) || 9).t}` : ""}</p></div>` : ""}
      <div class="nm-card"><h4>${L("अंकों की आपसी दोस्ती", "How the digits get along")}</h4><div class="nm-strip">${strip}</div>
        <p class="nm-small"><span class="nm-key nm-pf"></span>${L("मित्र", "friendly")} <span class="nm-key nm-pn"></span>${L("सम", "neutral")} <span class="nm-key nm-pm"></span>${L("मिश्रित", "mixed")} <span class="nm-key nm-pe"></span>${L("शत्रु", "enemy")}</p>
        <p>${enemies.length ? L(`इसमें ${enemies.length} शत्रु-जोड़े (${enemies.join(", ")}) हैं — बाक़ी नंबर अच्छा हो तो यह छोटी बात है।`, `It has ${enemies.length} enemy pair(s) (${enemies.join(", ")}) — a minor point if the rest is good.`) : L("इसमें कोई शत्रु-जोड़ा नहीं है — अच्छी बात है।", "No enemy pairs — that's good.")} ${missing.length ? L(`इस नंबर में ${missing.join(", ")} नहीं ${missing.length > 1 ? "हैं" : "है"}।`, `Missing digits: ${missing.join(", ")}.`) : ""} ${counts[0] >= 3 ? L(`शून्य ${counts[0]} बार है — ज़्यादा शून्य असर कम करते माने जाते हैं।`, `${counts[0]} zeros — many zeros are thought to weaken a number.`) : ""}</p></div>
      ${p ? `<div class="nm-card"><h4>${L("आपके लिए सबसे अच्छे योग", "Best totals for you")}</h4><div class="nm-sugg">${sugg.map((x) => `<span${x === r ? ' class="on"' : ""}><b>${x}</b><small>${pl(x)}</small></span>`).join("")}</div>
        <p class="nm-small">${L("नया नंबर लें तो इनमें से किसी योग वाला, 0 पर ख़त्म न होने वाला नंबर चुनें।", "When choosing a new number, pick one with these totals that doesn't end in 0.")}</p></div>` : ""}
      ${score != null ? `<details class="nm-how"><summary>${L(`स्कोर ${score} कैसे बना`, `How the score of ${score} was worked out`)}</summary><table class="nm-tbl">${sc.map(([l, v]) => `<tr><td>${l}</td><td style="text-align:right"><b>${v > 0 ? "+" : ""}${v}</b></td></tr>`).join("")}<tr><td><b>${L("कुल", "Total")}</b></td><td style="text-align:right"><b>${score}</b></td></tr></table></details>` : ""}
      <details class="nm-how"><summary>${L("गणना", "Calculation")}</summary><p class="nm-ex">${D.join(" + ")} = ${total}${total > 9 ? " → " + reduceSteps(total) : ""}</p></details>
      <div class="nm-actions"><a class="nm-btn nm-wa" href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${L("WhatsApp पर शेयर करें", "Share on WhatsApp")}</a>
        <button type="button" class="nm-btn nm-ghost" data-nm-again>${L("दूसरा नंबर जाँचें", "Check another number")}</button></div>
      <p class="nm-small">${L("अंक ज्योतिष का सामान्य संकेत, गारंटी नहीं। आपका नंबर कहीं सेव नहीं होता।", "General numerology guidance, not a guarantee. Your number is not saved anywhere.")}</p></div>`;
    const again = out.querySelector("[data-nm-again]");
    if (again) again.addEventListener("click", () => { f.mob.value = ""; f.mob.focus(); });
    if (e) out.scrollIntoView({ behavior: "smooth", block: "start" });
    track("mobile_numerology", { kind, root: r, score });
  }

  // =================== 3) MULANK MILAN ===================
  function milan(e) {
    if (e) e.preventDefault();
    const f = document.getElementById("nmMilForm"), out = document.getElementById("nmMilOut");
    if (!f || !out) return;
    const a = fromDob(f.d1.value), b = fromDob(f.d2.value);
    if (!a || !b) { out.innerHTML = `<p class="nm-err" role="alert">${L("कृपया दोनों जन्मतिथियाँ भरें।", "Please enter both dates of birth.")}</p>`; return; }
    const m1 = match(a.mulank, b.mulank), m2 = match(a.bhagyank, b.bhagyank);
    const s = { good: 2, ok: 1, mid: 0 }[m1.k] + { good: 2, ok: 1, mid: 0 }[m2.k];
    const v = s >= 3 ? L("अंकों के हिसाब से बहुत अच्छा मेल।", "A very good match by numbers.") : (s === 2 ? L("अंकों के हिसाब से अच्छा मेल।", "A good match by numbers.") : (s === 1 ? L("सामान्य मेल — समझदारी से रिश्ता अच्छा निभ सकता है।", "An average match — it can work well with understanding.") : L("स्वभाव अलग हैं — एक-दूसरे को समझने पर ज़्यादा ध्यान दें।", "Different natures — put extra effort into understanding each other.")));
    out.innerHTML = `<div class="nm-res"><p class="nm-verdict">${v}</p>
      <div class="nm-row"><span>${L(`स्वभाव: मूलांक ${a.mulank} (${pl(a.mulank)}) और ${b.mulank} (${pl(b.mulank)})`, `Nature: birth numbers ${a.mulank} (${pl(a.mulank)}) and ${b.mulank} (${pl(b.mulank)})`)}</span>${chip(m1)}</div>
      <div class="nm-row"><span>${L(`जीवन की दिशा: भाग्यांक ${a.bhagyank} और ${b.bhagyank}`, `Direction: life paths ${a.bhagyank} and ${b.bhagyank}`)}</span>${chip(m2)}</div>
      <p class="nm-small">${L("अंक मिलान केवल सामान्य संकेत है। विवाह के लिए", "Number matching is only a general sign. For marriage, use")} <a href="kundali-milan.html">${L("कुंडली मिलान (36 गुण) करें", "full Kundali matching (36 gunas)")}</a>.</p></div>`;
    track("mulank_milan", {});
  }

  // =================== language switch ===================
  function applyLang() {
    document.querySelectorAll("[data-en]").forEach((el) => {
      if (!el.hasAttribute("data-hi")) el.setAttribute("data-hi", el.textContent);
      el.textContent = hi() ? el.getAttribute("data-hi") : el.getAttribute("data-en");
    });
    document.querySelectorAll("[data-ph-en]").forEach((el) => {
      if (!el.hasAttribute("data-ph-hi")) el.setAttribute("data-ph-hi", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", hi() ? el.getAttribute("data-ph-hi") : el.getAttribute("data-ph-en"));
    });
    document.querySelectorAll("option[data-en]").forEach(() => {});
    document.querySelectorAll("img[data-nmsample]").forEach((im) => { im.src = `images/nm-sample-${hi() ? "hi" : "en"}-${im.getAttribute("data-nmsample")}.webp`; });
    document.querySelectorAll("[data-nm-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-nm-lang") === LANG)));
    const mo = document.getElementById("nmMainOut"); if (mo && mo.innerHTML.trim() && lastMain) mainReport();
    const no = document.getElementById("nmMobOut"); if (no && no.querySelector(".nm-res")) numberReport();
    const lo = document.getElementById("nmMilOut"); if (lo && lo.querySelector(".nm-res")) milan();
  }

  function init() {
    document.querySelectorAll("[data-nmgo]").forEach((a) => a.addEventListener("click", (e) => {
      const pc = document.getElementById("nm-paid-card");
      if (pc) { e.preventDefault(); pc.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      setTimeout(() => { const d = document.querySelector('#nmMainForm input[name="dob"]'); if (d) d.focus({ preventScroll: true }); }, 500);
    }));
    const mf = document.getElementById("nmMainForm"), nf = document.getElementById("nmMobForm"), lf = document.getElementById("nmMilForm");
    if (mf) mf.addEventListener("submit", mainReport);
    if (nf) {
      nf.addEventListener("submit", numberReport);
      const k = nf.kind, inp = nf.mob;
      if (k && inp) k.addEventListener("change", () => { inp.setAttribute("inputmode", k.value === "vehicle" ? "text" : "numeric"); inp.placeholder = k.value === "vehicle" ? "UP32 AB 1234" : (k.value === "house" ? "302" : "98765 43210"); });
    }
    if (lf) lf.addEventListener("submit", milan);
    document.querySelectorAll("[data-nm-lang]").forEach((b) => b.addEventListener("click", () => {
      LANG = b.getAttribute("data-nm-lang");
      try { localStorage.setItem("nmLang", LANG); } catch (e) { /* ignore */ }
      applyLang();
    }));
    if (LANG !== "hi") applyLang(); else document.querySelectorAll("[data-nm-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-nm-lang") === "hi")));
  }
  // shared with numerology-pro.js (the ₹299 detailed report)
  window.JT_NM = {
    withLang(l, fn) { const o = LANG; LANG = l === "en" ? "en" : "hi"; try { return fn(); } finally { LANG = o; } },
    lang: () => LANG, model, sections, nameSuggestions, nameNum, match, root, master, sumDigits, reduceSteps, compound, cName, cText,
    pl, rel, esc, L, LUCKY, COLORS, DAYS, RUDRA, PM, MON, CHALD, LOSHU, PLANES, stampSvg, mandalaSvg, MOBILE: () => MOBILE,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
