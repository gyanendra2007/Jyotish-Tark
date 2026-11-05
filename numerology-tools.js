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
  let lastMain = null;
  function mainReport(e) {
    if (e) e.preventDefault();
    const f = document.getElementById("nmMainForm"), out = document.getElementById("nmMainOut");
    if (!f || !out) return;
    const p = fromDob(f.dob.value);
    if (!p) { out.innerHTML = `<p class="nm-err" role="alert">${L("कृपया सही जन्मतिथि चुनें।", "Please enter a valid date of birth.")}</p>`; f.dob.focus(); return; }
    const name = (f.nm.value || "").trim();
    const nn = nameNum(name);
    const now = new Date(), Y = now.getFullYear();
    const py = root(p.d + p.mo + root(Y)) || 9;
    const N = NUM[p.mulank][LANG];
    lastMain = { dob: f.dob.value, name };
    const tile = (lbl, num, sub, note) => `<div class="nm-tile"><small>${lbl}</small><b>${num}</b><span>${sub}</span><em>${note}</em></div>`;
    // name number verdict
    let nameCard = "";
    if (nn) {
      const ok = LUCKY[p.mulank].includes(nn.root) || LUCKY[p.bhagyank].includes(nn.root);
      const cp = nn.comp >= 10 && nn.comp <= 52 ? compound(nn.comp) : null;
      const caution = cp && cp[2] === "care";
      nameCard = `<div class="nm-card ${ok && !caution ? "nm-c-good" : "nm-c-mid"}"><h4>${L("आपके नाम का अंक", "Your name number")}</h4>
        <p><b>${esc(name)}</b> = ${nn.comp} → <b>${nn.root}</b> (${pl(nn.root)})${cp ? ` · ${L("संयुक्त अंक", "compound")} ${nn.comp}: "${cName(cp)}"` : ""}</p>
        <p>${ok && !caution ? L(`आपके नाम का अंक आपके मूलांक और भाग्यांक के अनुकूल है। नाम बदलने की ज़रूरत नहीं।`, `Your name number suits your birth numbers. No change is needed.`)
          : (ok ? L(`नाम का मूल अंक अनुकूल है, पर संयुक्त अंक ${nn.comp} सावधानी वाला माना जाता है। ${cText(cp)}`, `The name's root number suits you, but compound ${nn.comp} is considered a caution number. ${cText(cp)}`)
            : L(`नाम का अंक ${nn.root} आपके जन्म-अंकों की अनुकूल सूची में नहीं है। यह असफलता का संकेत नहीं है; चाहें तो स्पेलिंग में छोटा बदलाव विचार कर सकते हैं।`, `Name number ${nn.root} is not in your favourable list. This does not mean failure; a small spelling change may be worth considering.`))}</p>
        ${ok && !caution ? "" : `<p class="nm-small"><a href="https://wa.me/918318513814?text=${encodeURIComponent(`नमस्ते, मेरा नाम ${name} (जन्मतिथि ${f.dob.value}) है। मुझे नाम की स्पेलिंग पर सलाह चाहिए।`)}" target="_blank" rel="noopener">${L("नाम की स्पेलिंग पर सलाह लें →", "Get advice on your name spelling →")}</a></p>`}</div>`;
    }
    // Lo Shu
    const ds = (p.raw[3] + p.raw[2] + p.raw[1]).split("").map(Number).filter((x) => x);
    const add = [p.bhagyank]; if (p.d > 9) add.push(p.mulank);
    const all = ds.concat(add), cnt = Array.from({ length: 10 }, (_, d) => all.filter((x) => x === d).length);
    const LOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
    const PLANES = [[[4, 9, 2], "मानसिक तल", "Mental plane", "तेज़ बुद्धि और अच्छी याददाश्त।", "Sharp mind and good memory."], [[3, 5, 7], "भावनात्मक तल", "Emotional plane", "भावनाओं में संतुलन।", "Emotional balance."], [[8, 1, 6], "व्यावहारिक तल", "Practical plane", "मेहनत और व्यावहारिक सफलता।", "Hard work and practical success."], [[4, 3, 8], "विचार तल", "Thought plane", "अच्छी योजना बनाने की क्षमता।", "Good at planning."], [[9, 5, 1], "इच्छाशक्ति तल", "Will plane", "जो ठानें, उसे पूरा करने की ताक़त।", "The will to finish what you start."], [[2, 7, 6], "कर्म तल", "Action plane", "विचारों को काम में बदलने की क्षमता।", "Turns ideas into action."], [[4, 5, 6], "स्वर्ण योग", "Golden plane", "सफलता और समृद्धि का शुभ संकेत।", "A lucky sign of success and prosperity."], [[2, 5, 8], "संपत्ति योग", "Property plane", "घर और संपत्ति बनाने का संकेत।", "A sign of building home and property."]];
    const MISS = { 1: ["अपनी बात खुलकर कहने का अभ्यास करें।", "Practise speaking up for yourself."], 2: ["धैर्य रखें और दूसरों की भावनाएँ समझें।", "Be patient and tune into others' feelings."], 3: ["रोज़ कुछ नया पढ़ें और सीखें।", "Read and learn something new every day."], 4: ["काम लिखकर और क्रम से करें।", "Plan your work in writing and in order."], 5: ["जीवन में संतुलन रखें, एक साथ बहुत काम न पकड़ें।", "Keep balance; don't take on too much at once."], 6: ["परिवार और घर को समय दें।", "Give time to family and home."], 7: ["रोज़ कुछ मिनट शांत बैठकर सोचें।", "Spend a few quiet minutes reflecting each day."], 8: ["पैसों का हिसाब और बजट रखें।", "Keep track of money and budget."], 9: ["बड़े लक्ष्य रखें और दूसरों की मदद करें।", "Set bigger goals and help others."] };
    const done = PLANES.filter((x) => x[0].every((n) => cnt[n]));
    const miss = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !cnt[n]);
    const grid = LOSHU.map((n) => `<div class="nm-ls${cnt[n] ? "" : " nm-ls0"}"><b>${cnt[n] ? String(n).repeat(cnt[n]) : "·"}</b><small>${pl(n)}</small></div>`).join("");
    // months
    const months = [];
    for (let i = 0; i < 12; i++) {
      const dt = new Date(Y, now.getMonth() + i, 1), y2 = dt.getFullYear(), m2 = dt.getMonth() + 1;
      const pyy = root(p.d + p.mo + root(y2)) || 9, pm = root(pyy + m2) || 9;
      months.push(`<span class="nm-pmc${i === 0 ? " on" : ""}"><small>${MON[LANG][m2 - 1]} ${y2}</small><b>${pm}</b><em>${PM[pm][hi() ? 0 : 1]}</em></span>`);
    }
    const lifeTxt = LIFE[p.lp] ? LIFE[p.lp][hi() ? 0 : 1] : LIFE[p.bhagyank][hi() ? 0 : 1];
    const waText = L(`मेरी अंक ज्योतिष रिपोर्ट: मूलांक ${p.mulank} (${pl(p.mulank)}), भाग्यांक ${p.lp}${nn ? `, नामांक ${nn.root}` : ""}। आप भी देखें: https://jyotishtark.in/numerology.html`, `My numerology: birth number ${p.mulank} (${pl(p.mulank)}), life path ${p.lp}${nn ? `, name number ${nn.root}` : ""}. Try yours: https://jyotishtark.in/numerology.html`);
    out.innerHTML = `<div class="nm-res nm-main">
      <div class="nm-mhead"><small>${L("अंक ज्योतिष रिपोर्ट", "Numerology report")}</small><h3>${name ? esc(name) : L("आपकी रिपोर्ट", "Your report")}</h3><span>${L("जन्मतिथि", "Date of birth")}: ${p.d}-${p.mo}-${p.y}</span></div>
      <div class="nm-tiles">
        ${tile(L("मूलांक", "Birth number"), p.mulank, pl(p.mulank), L("आपका स्वभाव", "Your nature"))}
        ${tile(L("भाग्यांक", "Life path"), p.lp, pl(p.bhagyank), L("जीवन की दिशा", "Your direction"))}
        ${tile(L("नामांक", "Name number"), nn ? nn.root : "—", nn ? pl(nn.root) : L("नाम लिखें", "Add name"), L("नाम का असर", "Name effect"))}
        ${tile(L(`व्यक्तिगत वर्ष ${Y}`, `Personal year ${Y}`), py, PM[py][hi() ? 0 : 1], L("इस साल का विषय", "This year's theme"))}
      </div>
      <p class="nm-oneline"><b>${L("एक लाइन में", "In one line")}:</b> ${N.one} ${lifeTxt}</p>

      <div class="nm-card"><h4>${L(`आपका स्वभाव — मूलांक ${p.mulank} (${N.t})`, `Your nature — birth number ${p.mulank} (${N.t.toLowerCase()})`)}</h4><p>${N.nat}</p>
        <div class="nm-two"><div><small>${L("आपकी ताक़त", "Strengths")}</small><b>${N.str}</b></div><div><small>${L("ध्यान दें", "Watch out for")}</small><b>${N.watch}</b></div></div></div>
      <div class="nm-card"><h4>${L(`जीवन की दिशा — भाग्यांक ${p.lp}`, `Life direction — life path ${p.lp}`)}</h4><p>${lifeTxt}${p.lp !== p.bhagyank ? L(` इसका मूल अंक ${p.bhagyank} (${pl(p.bhagyank)}) है।`, ` Its root number is ${p.bhagyank} (${pl(p.bhagyank)}).`) : ""} ${p.mulank === p.bhagyank ? L("आपका मूलांक और भाग्यांक एक ही है — आप जैसे हैं, जीवन भी आपको उसी दिशा में ले जाता है।", "Your birth number and life path are the same — your nature and your path point the same way.") : (match(p.mulank, p.bhagyank).k !== "mid" ? L("आपके मूलांक और भाग्यांक में अच्छा तालमेल है।", "Your birth number and life path work well together.") : L("आपके मूलांक और भाग्यांक का स्वभाव अलग है — मन और परिस्थितियों में संतुलन बनाना आपकी सीख है।", "Your birth number and life path differ — balancing your nature with life's demands is your lesson."))}</p></div>
      <div class="nm-three">
        <div class="nm-card"><h4>${L("करियर", "Career")}</h4><p>${N.car}</p></div>
        <div class="nm-card"><h4>${L("प्रेम व विवाह", "Love & marriage")}</h4><p>${N.love}</p></div>
        <div class="nm-card"><h4>${L("पैसा", "Money")}</h4><p>${N.money}</p></div>
      </div>
      ${nameCard}
      <div class="nm-card"><h4>${L("आपके लिए शुभ", "Lucky for you")}</h4><div class="nm-kv">
        <div><small>${L("शुभ अंक", "Numbers")}</small><b>${LUCKY[p.mulank].join(", ")}</b></div>
        <div><small>${L("शुभ रंग", "Colours")}</small><b>${COLORS[p.mulank][hi() ? 0 : 1]}</b></div>
        <div><small>${L("शुभ दिन", "Days")}</small><b>${DAYS[p.mulank][hi() ? 0 : 1]}</b></div>
        <div><small>${L("रुद्राक्ष", "Rudraksha")}</small><b><a href="rudraksha.html#${RUDRA[p.mulank][2]}">${RUDRA[p.mulank][hi() ? 0 : 1]}</a></b></div></div></div>
      <div class="nm-card"><h4>${L(`${Y} आपके लिए — व्यक्तिगत वर्ष ${py}`, `${Y} for you — personal year ${py}`)}</h4><p>${PY[py][hi() ? 0 : 1]}</p>
        <p class="nm-small">${L("अगले 12 महीने:", "Next 12 months:")}</p><div class="nm-pm">${months.join("")}</div></div>
      <div class="nm-card"><h4>${L("लो शू ग्रिड", "Lo Shu grid")}</h4>
        <div class="nm-lsw"><div class="nm-lsg">${grid}</div><div>
        ${done.length ? `<p><b>${L("आपके ग्रिड में पूरे तल", "Complete planes in your grid")}:</b></p><ul>${done.map((x) => `<li><b>${hi() ? x[1] : x[2]}</b> — ${hi() ? x[3] : x[4]}</li>`).join("")}</ul>` : `<p>${L("आपके ग्रिड में कोई पूरा तल नहीं है — यह कमी नहीं, बस आपकी ताक़त अलग-अलग अंकों में है।", "No plane is complete in your grid — not a weakness; your strengths are spread across numbers.")}</p>`}
        ${miss.length ? `<p><b>${L("जो अंक नहीं हैं, उनके लिए सुझाव", "Tips for missing numbers")}:</b></p><ul>${miss.map((n) => `<li><b>${n}</b> — ${MISS[n][hi() ? 0 : 1]}</li>`).join("")}</ul>` : `<p>${L("आपके ग्रिड में 1 से 9 तक सभी अंक हैं — यह संतुलित स्थिति है।", "All numbers 1 to 9 are in your grid — a balanced chart.")}</p>`}
        </div></div></div>
      <details class="nm-how"><summary>${L("आपकी गणना कैसे हुई", "How your numbers were calculated")}</summary><ol class="nm-steps">
        <li><b>${L("मूलांक", "Birth number")}:</b> ${L("तारीख", "Day")} ${p.d}${p.d > 9 ? " → " + reduceSteps(p.d) : ""} → <b>${p.mulank}</b></li>
        <li><b>${L("भाग्यांक", "Life path")}:</b> ${L("तारीख", "day")} ${p.d} → ${p.parts[0]}, ${L("महीना", "month")} ${p.mo} → ${p.parts[1]}, ${L("वर्ष", "year")} ${p.y} → ${p.parts[2]}; ${p.parts.join(" + ")} = ${p.parts[0] + p.parts[1] + p.parts[2]} → <b>${p.lp}</b>${[11, 22, 33].includes(p.lp) ? L(" (मास्टर अंक, इसलिए घटाया नहीं गया)", " (a master number, so it is not reduced)") : ""}</li>
        ${nn ? `<li><b>${L("नामांक", "Name number")}:</b> ${nn.br} = ${nn.comp} → <b>${nn.root}</b></li>` : ""}
        <li><b>${L("व्यक्तिगत वर्ष", "Personal year")}:</b> ${p.d} + ${p.mo} + ${root(Y)} (${Y}) = ${p.d + p.mo + root(Y)} → <b>${py}</b></li>
        <li><b>${L("लो शू ग्रिड", "Lo Shu grid")}:</b> ${L("जन्मतिथि के अंक (शून्य छोड़कर)", "date digits (zeros left out)")} ${ds.join(", ")} + ${L("भाग्यांक", "life path")} ${p.bhagyank}${p.d > 9 ? ` + ${L("मूलांक", "birth number")} ${p.mulank}` : ""}</li>
      </ol><p class="nm-small">${L('पूरी विधि उदाहरण के साथ पेज के आख़िर में <a href="#kaise-nikale">"मूलांक कैसे निकालें"</a> में है।', 'The full method with an example is at the end of this page (in Hindi).')}</p></details>
      <div class="nm-actions">
        <a class="nm-btn nm-wa" href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${L("WhatsApp पर शेयर करें", "Share on WhatsApp")}</a>
        <a class="nm-btn nm-ghost" href="kundali-form.html">${L("मुफ़्त कुंडली देखें", "See free Kundali")}</a>
        <button type="button" class="nm-btn nm-ghost" onclick="window.print()">${L("प्रिंट / PDF", "Print / PDF")}</button>
      </div>
      <p class="nm-small">${L("अंक ज्योतिष सामान्य मार्गदर्शन है, गारंटी नहीं। व्यक्तिगत सलाह के लिए", "Numerology is general guidance, not a guarantee. For personal advice,")} <a href="consultation.html">${L("ज्योतिषी से बात करें — पहले 5 मिनट मुफ़्त", "talk to the astrologer — first 5 minutes free")}</a>.</p></div>`;
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    track("numerology_report", { mulank: p.mulank, lang: LANG });
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
    document.querySelectorAll("[data-nm-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-nm-lang") === LANG)));
    const mo = document.getElementById("nmMainOut"); if (mo && mo.innerHTML.trim() && lastMain) mainReport();
    const no = document.getElementById("nmMobOut"); if (no && no.querySelector(".nm-res")) numberReport();
    const lo = document.getElementById("nmMilOut"); if (lo && lo.querySelector(".nm-res")) milan();
  }

  function init() {
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
