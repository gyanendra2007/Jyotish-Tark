/* ==========================================================================
   JYOTISH TARK — life-stage layer shared by every report.
   A chart promises the same things for life, but WHEN a period falls decides
   what it can mean: a "10th house" period at age 9 is about school, at 30
   about the job, at 70 about respect and guidance. Every timed statement in
   the reports goes through these helpers so nothing impossible is predicted
   (no job for a 10-year-old, no exams for a 72-year-old).
   ========================================================================== */
window.JTLife = (function () {
  "use strict";
  const YR = 31557600000;
  const ms = (d) => (d instanceof Date ? d.getTime() : typeof d === "number" ? d : new Date(String(d).length <= 10 ? d + "T00:00:00" : d).getTime());
  const age = (dob, at) => (ms(at == null ? Date.now() : at) - ms(dob)) / YR;
  const stage = (a) => (a < 13 ? "child" : a < 18 ? "teen" : a < 25 ? "young" : a < 60 ? "adult" : "senior");
  // youngest sensible age for a topic to be "timed" in a report
  const MIN = { career: 18, job: 18, money: 18, invest: 21, business: 21, property: 22, vehicle: 18, marriage: 21, love: 18, children: 24, exams: 14, foreign: 16 };
  const MAX = { exams: 35, children: 45, marriage: 50, career: 62, job: 62, business: 70 };
  // house themes by life stage [hi, en]; adults/young use the report's own wording
  const EVT = {
    child: {
      1: ["सेहत, स्वभाव और आत्मविश्वास", "health, nature and confidence"], 2: ["परिवार, वाणी और खान-पान", "family, speech and eating habits"],
      3: ["साहस, भाई-बहन, खेल और लेखन", "courage, siblings, sports and writing"], 4: ["माता, घर और पढ़ाई का माहौल", "mother, home and the study environment"],
      5: ["बुद्धि, पढ़ाई और रचनात्मकता", "intellect, studies and creativity"], 6: ["सेहत, अनुशासन और प्रतियोगिता", "health, discipline and competitions"],
      7: ["दोस्ती और साथियों से संबंध", "friendships and classmates"], 8: ["सेहत में सावधानी और अचानक बदलाव", "health care and sudden changes"],
      9: ["भाग्य, पिता, गुरु और संस्कार", "fortune, father, teachers and values"], 10: ["पढ़ाई में प्रदर्शन, अनुशासन और पिता का सहयोग", "school performance, discipline and the father's support"],
      11: ["मित्र, पुरस्कार और इच्छा-पूर्ति", "friends, awards and wishes"], 12: ["नींद, आराम और दूर की यात्राएँ", "sleep, rest and long journeys"]
    },
    teen: {
      1: ["सेहत, आत्मविश्वास और पहचान", "health, confidence and identity"], 2: ["परिवार, वाणी और बचत की आदत", "family, speech and saving habits"],
      3: ["साहस, भाई-बहन, कौशल और संपर्क", "courage, siblings, skills and contacts"], 4: ["माता, घर और पढ़ाई का माहौल", "mother, home and the study environment"],
      5: ["पढ़ाई, बुद्धि, रचनात्मकता और भावनाएँ", "studies, intellect, creativity and emotions"], 6: ["प्रतियोगी परीक्षाएँ, सेहत और अनुशासन", "competitive exams, health and discipline"],
      7: ["दोस्ती, साथी और टीम-वर्क", "friendships, companions and teamwork"], 8: ["सेहत में सावधानी और अचानक बदलाव", "health care and sudden changes"],
      9: ["उच्च शिक्षा, गुरु, पिता और भाग्य", "higher studies, teachers, father and fortune"], 10: ["करियर की दिशा और पढ़ाई का लक्ष्य", "career direction and study goals"],
      11: ["मित्र, सफलता और इच्छा-पूर्ति", "friends, success and wishes"], 12: ["ख़र्च, नींद और पढ़ाई या घूमने के लिए दूर जाना", "expenses, sleep and going away to study or travel"]
    },
    senior: {
      1: ["सेहत और स्फूर्ति", "health and vitality"], 2: ["परिवार, बचत और वाणी", "family, savings and speech"],
      3: ["छोटी यात्राएँ, भाई-बहन और संपर्क", "short trips, siblings and contacts"], 4: ["घर, सुख और मन की शांति", "home, comfort and peace of mind"],
      5: ["संतान और पोते-पोतियों का सुख, पूजा-पाठ", "children and grandchildren, prayer"], 6: ["सेहत, दिनचर्या और विवादों से बचाव", "health, routine and avoiding disputes"],
      7: ["जीवनसाथी का साथ और सेहत", "the spouse's company and health"], 8: ["सेहत में सावधानी, बीमा और विरासत", "health care, insurance and inheritance"],
      9: ["धर्म, तीर्थ और भाग्य", "dharma, pilgrimage and fortune"], 10: ["मान-सम्मान और अनुभव से मार्गदर्शन", "respect and guiding others from experience"],
      11: ["लाभ, बड़ी संतान और मित्र", "gains, elder children and friends"], 12: ["ख़र्च, तीर्थ-यात्रा और आध्यात्मिकता", "expenses, pilgrimage and spirituality"]
    }
  };
  const evt = (h, a, lang, fallback) => { const t = EVT[stage(a)]; return t && t[h] ? t[h][lang === "en" ? 1 : 0] : fallback; };
  const allowed = (topic, a) => a >= (MIN[topic] || 0) && a < (MAX[topic] || 200);
  // Date from which a topic may be timed (birth + min age, never before "now")
  const from = (dob, topic, now) => new Date(Math.max(ms(now == null ? Date.now() : now), ms(dob) + (MIN[topic] || 0) * YR));
  const until = (dob, topic, fallback) => (MAX[topic] ? new Date(Math.min(ms(fallback), ms(dob) + MAX[topic] * YR)) : fallback);
  // a short note shown at the top of a report for children, teenagers and seniors
  function note(a, lang, name) {
    const en = lang === "en", n = Math.floor(a), who = name ? name.split(" ")[0] : "";
    if (a < 13) return en ? `${who ? who + " is" : "The native is"} ${n} years old. This report reads the chart for this age: health, nature, studies and family come first. Career, money, marriage and children are described as the chart's promise for adult life — their timings are given only for adult ages.` : `${who ? who + " की" : "जातक की"} आयु अभी ${n} वर्ष है। इस रिपोर्ट में कुंडली को इसी आयु के हिसाब से पढ़ा गया है — अभी सेहत, स्वभाव, पढ़ाई और परिवार मुख्य हैं। करियर, धन, विवाह और संतान की बातें बड़े होने पर मिलने वाले फल हैं; इनका समय केवल वयस्क आयु के लिए बताया गया है।`;
    if (a < 18) return en ? `${who ? who + " is" : "The native is"} ${n} years old. For the next few years the chart is read for studies, exams and choosing a career direction. Job, money, marriage and children are described for adult life, and timed only from adult ages.` : `${who ? who + " की" : "जातक की"} आयु अभी ${n} वर्ष है। अगले कुछ वर्षों के लिए कुंडली को पढ़ाई, परीक्षा और करियर की दिशा चुनने के हिसाब से पढ़ा गया है। नौकरी, धन, विवाह और संतान की बातें वयस्क जीवन के लिए हैं और उनका समय वयस्क आयु से ही बताया गया है।`;
    if (a >= 60) return en ? `At ${n}, the chart is read for health, family, respect, peace of mind and spiritual life. Career and education sections describe the nature of the chart and past life; timings focus on these present themes.` : `${n} वर्ष की आयु में कुंडली को सेहत, परिवार, मान-सम्मान, मन की शांति और आध्यात्मिक जीवन के हिसाब से पढ़ा गया है। शिक्षा और करियर के अध्याय कुंडली का स्वभाव और बीता जीवन बताते हैं; समय-संकेत इन्हीं वर्तमान विषयों पर हैं।`;
    return "";
  }

  // ---- numerology personal year / month wording for children-teenagers and seniors ----
  const NUM = {
    PY: {
      kid: {
        1: ["नई शुरुआत का वर्ष — नई कक्षा, नया विषय या नया शौक़ शुरू करने के लिए बहुत अच्छा। आत्मविश्वास बढ़ेगा; बच्चे को छोटे-छोटे काम ख़ुद करने दें।", "A year of new starts — a new class, subject or hobby goes well. Confidence grows; let the child do small things on their own."],
        2: ["धैर्य और दोस्ती का वर्ष — टीम-वर्क, अच्छी दोस्ती और माता-पिता से खुलकर बात करने का समय। मन भावुक रह सकता है; प्यार और भरोसा दें।", "A year of patience and friendship — teamwork, good friends and open talks with parents. Feelings run deep; give love and trust."],
        3: ["रचनात्मकता का वर्ष — कला, भाषण, लेखन, संगीत और नए दोस्त। ध्यान भटक सकता है, इसलिए पढ़ाई का तय समय रखें।", "A creative year — art, speaking, writing, music and new friends. Attention can wander, so keep fixed study hours."],
        4: ["मेहनत और अनुशासन का वर्ष — रोज़ की पढ़ाई से नींव मज़बूत होगी। परिणाम धीरे आएँगे पर पक्के होंगे; नियमित दिनचर्या सबसे बड़ा उपाय है।", "A year of effort and discipline — daily study builds a strong base. Results come slowly but surely; a regular routine is the best remedy."],
        5: ["बदलाव और नए अनुभवों का वर्ष — स्कूल, शहर या विषय में बदलाव, घूमना-फिरना। मोबाइल और स्क्रीन-टाइम पर नियंत्रण रखें।", "A year of change and new experiences — a change of school, city or subject, and travel. Keep screen time in check."],
        6: ["परिवार और ज़िम्मेदारी का वर्ष — घर के कामों में हाथ बँटाना, संगीत-कला और बड़ों का साथ। परिवार का प्यार आत्मविश्वास बढ़ाएगा।", "A year of family and responsibility — helping at home, music and art, time with elders. Family warmth builds confidence."],
        7: ["सीखने और सोचने का वर्ष — गहरी पढ़ाई, विज्ञान, किताबें और प्रश्न पूछने की आदत। अकेले समय की ज़रूरत रहेगी; सेहत और नींद पर ध्यान दें।", "A year of learning and reflection — deep study, science, books and asking questions. Some quiet time is needed; mind health and sleep."],
        8: ["मेहनत के फल का वर्ष — परीक्षा, प्रतियोगिता और खेल में अच्छे परिणाम संभव। अनुशासन और समय की पाबंदी सफलता दिलाएगी।", "A year when effort pays — good results in exams, competitions and sports are possible. Discipline and punctuality bring success."],
        9: ["पूर्णता का वर्ष — पुरानी आदतें छोड़ने और अगले चरण (नई कक्षा या स्कूल) की तैयारी का समय। दान और दूसरों की मदद करना सिखाएँ।", "A year of completion — dropping old habits and preparing for the next stage (a new class or school). Teach giving and helping others."]
      },
      senior: {
        1: ["नई शुरुआत का वर्ष — नई दिनचर्या, नया शौक़ या घर में कोई नया शुभ कार्य शुरू करने के लिए अच्छा।", "A year of new starts — a new routine, a new hobby or a new auspicious task at home."],
        2: ["जीवनसाथी, परिवार और धैर्य का वर्ष — रिश्तों में मधुरता और आपसी सहयोग से मन प्रसन्न रहेगा।", "A year of spouse, family and patience — warmth in relationships keeps the mind happy."],
        3: ["मेल-जोल और आनंद का वर्ष — पुराने मित्रों से मिलना, यात्रा, भजन-कीर्तन और रचनात्मक शौक़।", "A year of company and joy — meeting old friends, travel, devotional music and creative hobbies."],
        4: ["व्यवस्था का वर्ष — सेहत की नियमित जाँच, घर और संपत्ति के काग़ज़ात ठीक करने का समय।", "A year of order — regular health check-ups and putting home and property papers in order."],
        5: ["बदलाव और यात्रा का वर्ष — तीर्थ-यात्रा या स्थान-परिवर्तन संभव; सेहत का ध्यान रखते हुए यात्रा करें।", "A year of change and travel — pilgrimage or a change of place is possible; travel with care for health."],
        6: ["परिवार का वर्ष — संतान और पोते-पोतियों से सुख, घर में शुभ कार्य और सेवा।", "A family year — joy from children and grandchildren, auspicious events at home and service."],
        7: ["आध्यात्मिकता का वर्ष — ध्यान, पूजा-पाठ और आत्मचिंतन; सेहत पर विशेष ध्यान दें।", "A spiritual year — meditation, prayer and reflection; take special care of health."],
        8: ["निर्णय का वर्ष — धन, संपत्ति और वसीयत से जुड़े फ़ैसले सोच-समझकर और परिवार की सलाह से लें।", "A year of decisions — choices about money, property and the will, made carefully with the family."],
        9: ["पूर्णता और सेवा का वर्ष — दान, सेवा और पुराने मनमुटाव समाप्त करने का समय।", "A year of completion and service — charity, service and ending old differences."]
      }
    },
    PM: {
      kid: {
        1: [["नई शुरुआत का महीना — नया पाठ, नया खेल या नया शौक़ शुरू करें।", "क्या करें: पहल करना, नया कौशल सीखना", "क्या न करें: ज़िद और आलस"], ["A month of new starts — a new lesson, game or hobby.", "Do: take initiative, learn a skill", "Don't: stubbornness and laziness"]],
        2: [["दोस्ती और धैर्य का महीना — टीम में काम और माता-पिता से बात।", "क्या करें: दोस्तों की मदद, मन की बात कहना", "क्या न करें: छोटी बात पर रूठना"], ["A month of friendship and patience — teamwork and talking with parents.", "Do: help friends, share feelings", "Don't: sulk over small things"]],
        3: [["रचनात्मक महीना — कला, भाषण, लेखन और खेल।", "क्या करें: प्रतियोगिता में भाग लेना", "क्या न करें: पढ़ाई टालना"], ["A creative month — art, speaking, writing and games.", "Do: take part in contests", "Don't: put off studies"]],
        4: [["मेहनत का महीना — रोज़ की पढ़ाई और अभ्यास।", "क्या करें: समय-सारिणी बनाना", "क्या न करें: देर रात तक जागना"], ["A month of hard work — daily study and practice.", "Do: make a timetable", "Don't: stay up late"]],
        5: [["बदलाव और घूमने का महीना — नई जगहें और नए अनुभव।", "क्या करें: खेल-कूद, बाहर घूमना", "क्या न करें: ज़्यादा स्क्रीन-टाइम"], ["A month of change and outings — new places and experiences.", "Do: sports and outdoor time", "Don't: too much screen time"]],
        6: [["परिवार का महीना — घर में मदद और बड़ों का साथ।", "क्या करें: घर के कामों में हाथ बँटाना", "क्या न करें: बड़ों से बहस"], ["A family month — helping at home and time with elders.", "Do: help with chores", "Don't: argue with elders"]],
        7: [["सीखने का महीना — किताबें, विज्ञान और सवाल पूछना।", "क्या करें: अच्छी नींद, पढ़ाई पर ध्यान", "क्या न करें: अकेले में चिंता करना"], ["A month for learning — books, science and asking questions.", "Do: good sleep, focused study", "Don't: worry alone"]],
        8: [["परिणाम का महीना — परीक्षा और प्रतियोगिता में मेहनत का फल।", "क्या करें: अनुशासन और समय पर काम", "क्या न करें: आख़िरी समय की तैयारी"], ["A month of results — effort pays in exams and contests.", "Do: discipline and punctuality", "Don't: last-minute preparation"]],
        9: [["पूर्णता का महीना — अधूरे काम पूरे करना और पुरानी आदतें छोड़ना।", "क्या करें: दूसरों की मदद, दान", "क्या न करें: ग़ुस्सा"], ["A month of completion — finishing pending work and dropping old habits.", "Do: help others, give", "Don't: anger"]]
      },
      senior: {
        1: [["नई शुरुआत का महीना — नई दिनचर्या या कोई शुभ कार्य।", "क्या करें: सुबह की सैर, नया शौक़", "क्या न करें: अकेलापन"], ["A month of new starts — a new routine or an auspicious task.", "Do: morning walks, a new hobby", "Don't: isolate yourself"]],
        2: [["परिवार और जीवनसाथी का महीना।", "क्या करें: परिवार के साथ समय", "क्या न करें: पुरानी बातों पर नाराज़गी"], ["A month for family and spouse.", "Do: time with family", "Don't: dwell on old grudges"]],
        3: [["मेल-जोल का महीना — मित्रों और रिश्तेदारों से मिलना।", "क्या करें: सत्संग, भजन, मेल-जोल", "क्या न करें: ज़्यादा थकान"], ["A social month — meeting friends and relatives.", "Do: satsang, music, company", "Don't: overexert"]],
        4: [["व्यवस्था का महीना — सेहत की जाँच और काग़ज़ात।", "क्या करें: नियमित जाँच, दवाइयों का समय", "क्या न करें: लापरवाही"], ["A month of order — health checks and papers.", "Do: regular check-ups, medicine on time", "Don't: neglect"]],
        5: [["यात्रा और बदलाव का महीना।", "क्या करें: तीर्थ या परिवार से मिलने जाना", "क्या न करें: जल्दबाज़ी"], ["A month of travel and change.", "Do: pilgrimage or family visits", "Don't: rush"]],
        6: [["परिवार और सेवा का महीना — संतान और पोते-पोतियों का सुख।", "क्या करें: घर में शुभ कार्य, सेवा", "क्या न करें: ज़िम्मेदारियों का अधिक बोझ"], ["A month of family and service — joy from children and grandchildren.", "Do: auspicious work at home, service", "Don't: take on too much"]],
        7: [["आध्यात्मिक महीना — ध्यान और पूजा-पाठ।", "क्या करें: ध्यान, अच्छी नींद", "क्या न करें: चिंता"], ["A spiritual month — meditation and prayer.", "Do: meditation, good sleep", "Don't: worry"]],
        8: [["धन-संपत्ति के निर्णयों का महीना।", "क्या करें: परिवार की सलाह से फ़ैसले", "क्या न करें: जोखिम वाले निवेश"], ["A month for money and property decisions.", "Do: decide with the family", "Don't: risky investments"]],
        9: [["दान और सेवा का महीना।", "क्या करें: दान, पुराने मनमुटाव समाप्त करना", "क्या न करें: बीती बातों का दुख"], ["A month of charity and service.", "Do: give, end old differences", "Don't: grieve the past"]]
      }
    }
  };
  const numKey = (a) => (a < 18 ? "kid" : a >= 60 ? "senior" : null);
  return { NUM, numKey, age, stage, evt, allowed, from, until, note, MIN, MAX, EVT, YR };
})();
