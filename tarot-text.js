/* Jyotish Tark — plain-language tarot texts (Hindi / English, never mixed).
   Loaded after tarot-engine.js; replaces the wording of all 78 cards and the 5 spreads.
   Meanings follow the standard Rider–Waite tradition. */
(function () {
  "use strict";
  const T = window.JT_TAROT;
  if (!T || !T.deck) return;

  // ---------- 22 major arcana ----------
  // [nameHi, grahaHi, grahaEn, timingHi, timingEn, upHi, upEn, revHi, revEn, loveHi, loveEn, workHi, workEn, nazarHi, nazarEn, advHi, advEn]
  const MAJ = {
    maj_0: ["द फ़ूल", "राहु", "Rahu", "2–3 हफ़्ते", "2–3 weeks",
      "नई शुरुआत का समय है। डर छोड़कर पहला कदम उठाइए।", "A fresh start is here. Take the first step without fear.",
      "बिना सोचे जल्दबाज़ी न करें, और डर के कारण मौक़ा भी न छोड़ें।", "Don't rush in blindly, and don't let fear stop you either.",
      "वे आपके साथ हल्का और नया रिश्ता चाहते हैं, पर अभी पूरी तरह तय नहीं हैं।", "They want a light, fresh connection with you, but they are not fully settled yet.",
      "नया काम, नई नौकरी या नया कौशल सीखने का अच्छा समय है।", "A good time for a new job, a new project or a new skill.",
      "अपनी योजनाएँ पूरी होने से पहले सबको न बताएँ।", "Don't share your plans with everyone before they are done.",
      "शुरुआत कीजिए, पर ज़रूरी तैयारी के साथ।", "Begin — but with basic preparation."],
    maj_1: ["द मैजिशियन", "बुध", "Mercury", "1–3 हफ़्ते", "1–3 weeks",
      "आपके पास सफलता के सारे साधन हैं। बस सही दिशा में मेहनत चाहिए।", "You have everything you need to succeed. Now put it to work.",
      "किसी की मीठी बातों में न आएँ, और अपनी ऊर्जा कई कामों में न बाँटें।", "Beware of smooth talk, and don't scatter your energy across too many tasks.",
      "वे आपसे प्रभावित हैं और आपसे बात करने का मौक़ा ढूँढ रहे हैं।", "They are impressed by you and are looking for a chance to talk.",
      "इंटरव्यू, परीक्षा या नई डील के लिए बहुत अच्छा समय है।", "An excellent time for interviews, exams or a new deal.",
      "आपकी तरक़्क़ी देखकर कोई जलन रख सकता है — काम से जवाब दें।", "Someone may envy your progress — let your work answer.",
      "जो सोचा है, उसे आज से करना शुरू करें।", "Start acting on your plan today."],
    maj_2: ["द हाई प्रीस्टेस", "चंद्र", "Moon", "2–4 हफ़्ते", "2–4 weeks",
      "अपने अंतर्मन की आवाज़ सुनिए। अभी हर बात सामने नहीं आई है।", "Trust your inner voice. Not everything has been revealed yet.",
      "आप अपनी अंदर की आवाज़ को अनदेखा कर रहे हैं, या कुछ बातें छिपी हुई हैं।", "You are ignoring your instinct, or something is being kept hidden.",
      "उनके मन में भावनाएँ हैं, पर वे अभी खुलकर नहीं कह रहे।", "They have feelings for you but are not saying them openly yet.",
      "जल्दबाज़ी न करें। पूरी जानकारी मिलने के बाद ही फ़ैसला लें।", "Don't rush. Decide only after you have the full picture.",
      "अपनी निजी बातें सीमित लोगों से ही साझा करें।", "Share personal matters only with a few trusted people.",
      "थोड़ा रुकिए और ध्यान से देखिए।", "Pause and observe carefully."],
    maj_3: ["द एम्प्रेस", "शुक्र", "Venus", "3–6 हफ़्ते", "3–6 weeks",
      "समृद्धि, प्रेम और सुख का समय है। मेहनत अब फल देने लगी है।", "A time of comfort, love and growth. Your efforts are bearing fruit.",
      "ख़ुद की देखभाल छोड़ रहे हैं, या किसी पर ज़रूरत से ज़्यादा निर्भर हैं।", "You are neglecting yourself or depending too much on someone.",
      "वे आपके साथ सुरक्षित और ख़ुश महसूस करते हैं, और रिश्ता आगे बढ़ाना चाहते हैं।", "They feel safe and happy with you and want the bond to grow.",
      "काम में बढ़त और पैसे में सुधार के अच्छे संकेत हैं।", "Good signs of growth at work and better income.",
      "दिखावे से बचें, अपनी ख़ुशियाँ सादगी से मनाएँ।", "Avoid showing off; celebrate quietly.",
      "जो आपके पास है, उसकी क़द्र करें और उसे बढ़ाएँ।", "Value what you have and help it grow."],
    maj_4: ["द एम्परर", "सूर्य और मंगल", "Sun & Mars", "1–2 महीने", "1–2 months",
      "अनुशासन, योजना और नेतृत्व से सफलता मिलेगी।", "Discipline, planning and leadership will bring success.",
      "ज़िद, ग़ुस्सा या हर चीज़ पर नियंत्रण रखने की आदत नुकसान दे सकती है।", "Stubbornness, anger or the need to control everything can backfire.",
      "वे आपको लेकर गंभीर हैं और ज़िम्मेदारी लेना चाहते हैं, पर भावनाएँ कम दिखाते हैं।", "They are serious about you and want to commit, but show little emotion.",
      "पद, अधिकार या सरकारी काम में सफलता के संकेत हैं।", "Signs of success in authority, promotion or government work.",
      "आपके अधिकार से कुछ लोग असहज हैं — विनम्र रहें।", "Some people are uneasy with your authority — stay polite.",
      "नियम बनाइए और उन पर टिके रहिए।", "Set clear rules and stick to them."],
    maj_5: ["द हायरोफ़ेंट", "गुरु", "Jupiter", "1–3 महीने", "1–3 months",
      "बड़ों की सलाह, परंपरा और सही तरीक़े से काम बनेगा।", "Advice from elders and the proper, traditional way will work.",
      "पुराने नियम आपको रोक रहे हैं, या कोई ग़लत सलाह दे रहा है।", "Old rules are holding you back, or someone is giving poor advice.",
      "वे रिश्ते को परिवार की सहमति और विवाह की दिशा में ले जाना चाहते हैं।", "They want to take the relationship towards family approval and marriage.",
      "पढ़ाई, सरकारी नौकरी, बैंक या शिक्षा से जुड़े कामों में लाभ।", "Gains in studies, government jobs, banking or teaching.",
      "दूसरों की राय पर बहुत ज़्यादा न चलें।", "Don't be ruled by other people's opinions.",
      "किसी अनुभवी व्यक्ति से सलाह लें।", "Ask someone experienced for guidance."],
    maj_6: ["द लवर्स", "शुक्र और बुध", "Venus & Mercury", "2–6 हफ़्ते", "2–6 weeks",
      "सच्चा रिश्ता और दिल से लिया गया सही फ़ैसला।", "A true bond and a decision made from the heart.",
      "रिश्ते में तालमेल की कमी, या दो विकल्पों के बीच उलझन।", "A mismatch in the relationship, or confusion between two choices.",
      "वे आपसे गहरा जुड़ाव महसूस करते हैं और रिश्ते को आगे बढ़ाना चाहते हैं।", "They feel a deep connection and want to move forward.",
      "साझेदारी या दो विकल्पों में से सही विकल्प चुनने का समय है।", "Time to choose the right partner or the right option.",
      "किसी तीसरे व्यक्ति को अपने रिश्ते में दख़ल न देने दें।", "Don't let a third person interfere in your relationship.",
      "वही चुनें जो आपके मूल्यों से मेल खाए।", "Choose what matches your values."],
    maj_7: ["द चैरियट", "चंद्र और मंगल", "Moon & Mars", "1–3 हफ़्ते", "1–3 weeks",
      "मेहनत और आत्म-नियंत्रण से जीत पक्की है। काम तेज़ी से आगे बढ़ेगा।", "Effort and self-control will win. Things will move fast.",
      "दिशा की कमी या ग़ुस्से के कारण काम रुक रहा है।", "Lack of direction or temper is stalling progress.",
      "वे आपकी ओर बढ़ने का पक्का इरादा रखते हैं।", "They are determined to move towards you.",
      "परीक्षा, प्रतियोगिता, यात्रा या वाहन से जुड़े कामों में सफलता।", "Success in exams, competition, travel or vehicle-related work.",
      "विरोधी आपको रोक नहीं पाएँगे, बस लक्ष्य पर टिके रहें।", "Rivals can't stop you if you stay focused.",
      "लक्ष्य तय करें और रुकें नहीं।", "Fix your goal and keep going."],
    maj_8: ["स्ट्रेंथ", "सूर्य", "Sun", "1–2 महीने", "1–2 months",
      "धैर्य और शांत आत्मविश्वास से हर मुश्किल पार होगी।", "Patience and calm confidence will carry you through.",
      "आत्मविश्वास कम है, या ग़ुस्सा आप पर हावी हो रहा है।", "Your confidence is low, or anger is taking over.",
      "वे आपके धैर्य और अच्छे स्वभाव की बहुत क़द्र करते हैं।", "They deeply value your patience and kindness.",
      "मुश्किल प्रोजेक्ट या कठिन लोगों को आप समझदारी से सँभाल लेंगे।", "You will handle a tough project or difficult people wisely.",
      "दूसरों की बातों से विचलित न हों — आपकी ताक़त अंदर है।", "Don't be shaken by gossip — your strength is within.",
      "नरमी से, पर दृढ़ता से आगे बढ़ें।", "Move ahead gently but firmly."],
    maj_9: ["द हर्मिट", "शनि और केतु", "Saturn & Ketu", "1–2 महीने", "1–2 months",
      "कुछ समय रुककर सोचने और सही रास्ता ढूँढने का समय है।", "Time to step back, think and find your own path.",
      "ज़रूरत से ज़्यादा अकेलापन, या मदद लेने से बचना।", "Too much isolation, or refusing help.",
      "वे अभी अपने आप में व्यस्त हैं और सोच-समझकर कदम उठाना चाहते हैं।", "They are inward right now and want to think before acting.",
      "शोध, पढ़ाई और गहराई वाले काम के लिए अच्छा समय। बड़े बदलाव कुछ देर से।", "Good for study and deep work. Big moves come a little later.",
      "शांत रहें — हर बात पर प्रतिक्रिया देना ज़रूरी नहीं।", "Stay calm — you don't need to react to everything.",
      "जवाब आपके भीतर है, थोड़ा समय दें।", "The answer is within you; give it time."],
    maj_10: ["व्हील ऑफ़ फ़ॉर्च्यून", "गुरु और राहु", "Jupiter & Rahu", "2–4 हफ़्ते", "2–4 weeks",
      "भाग्य पलट रहा है। अच्छा मोड़ और नया अवसर आने वाला है।", "Luck is turning. A positive change and a new chance are coming.",
      "हालात अभी आपके हाथ में नहीं हैं। धैर्य रखें, यह दौर भी बदलेगा।", "Things are out of your hands for now. Be patient; this phase will pass.",
      "रिश्ते में अचानक अच्छा बदलाव या पुरानी बात फिर से शुरू हो सकती है।", "A sudden positive turn, or an old connection may restart.",
      "अचानक अवसर, तबादला या आय में बदलाव संभव है।", "A sudden opportunity, transfer or change in income is likely.",
      "समय बदल रहा है, नकारात्मकता अपने-आप कम होगी।", "The cycle is changing; negativity will fade on its own.",
      "अवसर आए तो तुरंत पकड़ें।", "When the chance comes, take it."],
    maj_11: ["जस्टिस", "शनि", "Saturn", "1–2 महीने", "1–2 months",
      "जैसा कर्म, वैसा फल। सच और ईमानदारी आपके पक्ष में है।", "You reap what you sow. Truth and honesty are on your side.",
      "किसी के साथ अन्याय हो रहा है, या आप सच से बच रहे हैं।", "Something is unfair, or you are avoiding the truth.",
      "वे रिश्ते में बराबरी और ईमानदारी चाहते हैं।", "They want fairness and honesty in the relationship.",
      "क़ानूनी, सरकारी या काग़ज़ी कामों में फ़ैसला आपके पक्ष में आ सकता है।", "Legal, official or paperwork matters may be decided in your favour.",
      "कोई आपके बारे में ग़लत राय बना रहा है — सच समय पर सामने आएगा।", "Someone has a wrong view of you — the truth will come out.",
      "हर काम ईमानदारी और लिखित में करें।", "Be honest and keep things in writing."],
    maj_12: ["द हैंग्ड मैन", "शनि और केतु", "Saturn & Ketu", "6–10 हफ़्ते", "6–10 weeks",
      "काम कुछ समय रुका रहेगा। नज़रिया बदलेंगे तो रास्ता दिखेगा।", "Things are on hold. A change of view will show the way.",
      "बेवजह इंतज़ार कर रहे हैं, या ग़लत चीज़ के लिए त्याग कर रहे हैं।", "You are waiting for nothing, or sacrificing for the wrong thing.",
      "वे दुविधा में हैं और अभी कोई फ़ैसला नहीं ले पा रहे।", "They are stuck in doubt and can't decide yet.",
      "नौकरी या प्रोजेक्ट में देरी संभव है। तरीक़ा बदलें।", "Delays at work are likely. Try a different approach.",
      "दूसरों को ख़ुश करने के लिए ख़ुद को न थकाएँ।", "Don't wear yourself out pleasing others.",
      "रुकिए, सोचिए, फिर नए तरीक़े से कोशिश कीजिए।", "Pause, rethink, then try a new way."],
    maj_13: ["डेथ", "केतु और शनि", "Ketu & Saturn", "1–2 महीने", "1–2 months",
      "एक अध्याय ख़त्म हो रहा है, ताकि नया शुरू हो सके। यह बदलाव का कार्ड है, मृत्यु का नहीं।", "One chapter is ending so a new one can begin. This card means change, not death.",
      "पुरानी चीज़ को पकड़े रहने से नया आने में रुकावट है।", "Holding on to the old is blocking the new.",
      "रिश्ता या तो पूरी तरह बदलेगा या ख़त्म होकर नया रूप लेगा।", "The relationship will either transform or end and take a new form.",
      "नौकरी या काम का पुराना तरीक़ा बदलने वाला है।", "An old job or way of working is about to change.",
      "पुरानी कड़वाहट छोड़ें, तभी मन हल्का होगा।", "Let go of old bitterness; you will feel lighter.",
      "जो ख़त्म हो रहा है, उसे जाने दें।", "Let what is ending go."],
    maj_14: ["टेम्परेंस", "गुरु", "Jupiter", "1–2 महीने", "1–2 months",
      "संतुलन और धैर्य से धीरे-धीरे अच्छा परिणाम मिलेगा।", "Balance and patience will slowly bring good results.",
      "किसी चीज़ की अति हो रही है — काम, ख़र्च या भावनाएँ।", "Something is out of balance — work, spending or emotions.",
      "वे रिश्ते में शांति और समझदारी चाहते हैं।", "They want peace and understanding in the relationship.",
      "धीरे पर स्थिर प्रगति। जल्दबाज़ी न करें।", "Slow but steady progress. Don't rush.",
      "मध्यम मार्ग अपनाएँ, किसी से टकराव न लें।", "Take the middle path; avoid clashes.",
      "हर चीज़ संतुलित मात्रा में रखें।", "Keep everything in balance."],
    maj_15: ["द डेविल", "राहु और शनि", "Rahu & Saturn", "बंधन टूटने के बाद", "After you break the hold",
      "कोई आदत, लालच या रिश्ता आपको बाँधे हुए है।", "A habit, temptation or relationship has a hold on you.",
      "आप उस बंधन से बाहर निकलने लगे हैं। यह अच्छा संकेत है।", "You are starting to break free. A good sign.",
      "उनमें आपके लिए आकर्षण तो है, पर रिश्ते में नियंत्रण या स्वार्थ भी हो सकता है।", "There is attraction, but also control or self-interest.",
      "पैसे या काम के लिए ग़लत समझौता न करें। क़र्ज़ से बचें।", "Don't make wrong compromises for money. Avoid debt.",
      "किसी की चालाकी या ग़लत संगत से सावधान रहें।", "Watch out for manipulation and bad company.",
      "जो चीज़ आपको बाँध रही है, उसे पहचानें और छोड़ें।", "Name what binds you and let it go."],
    maj_16: ["द टावर", "मंगल", "Mars", "कुछ दिनों में अचानक", "Suddenly, within days",
      "अचानक बदलाव या झटका संभव है। जो झूठ पर टिका है, वह टूटेगा।", "A sudden shock or change. What stands on falsehood will fall.",
      "बड़ा बदलाव टल रहा है, पर अंदर से तैयारी ज़रूरी है।", "A big change is being delayed, but prepare yourself inside.",
      "रिश्ते में अचानक सच सामने आ सकता है या बड़ा विवाद हो सकता है।", "A hidden truth or a big argument may surface suddenly.",
      "अचानक बदलाव के लिए तैयार रहें। बचत संभालकर रखें।", "Be ready for sudden change at work. Keep savings safe.",
      "भ्रम टूटेगा और साफ़ दिखने लगेगा कि कौन अपना है।", "Illusions will break and you'll see who is truly with you.",
      "घबराएँ नहीं, यह नई और मज़बूत नींव का मौक़ा है।", "Don't panic — this clears the ground for something stronger."],
    maj_17: ["द स्टार", "शनि और शुक्र", "Saturn & Venus", "2–5 हफ़्ते", "2–5 weeks",
      "उम्मीद, शांति और मनोकामना पूरी होने का संकेत।", "Hope, healing and a wish coming true.",
      "निराशा या आत्मविश्वास की कमी। हिम्मत न छोड़ें।", "Discouragement or low faith in yourself. Don't give up.",
      "वे आपके साथ सच्चा और शांत भविष्य देखते हैं।", "They see a sincere, peaceful future with you.",
      "नई उम्मीद और पहचान। लंबे लक्ष्य पूरे होने लगेंगे।", "New hope and recognition. Long-term goals start to come true.",
      "आपके आसपास की नकारात्मकता कम हो रही है।", "The negativity around you is fading.",
      "भरोसा रखें और लगातार प्रयास करें।", "Keep faith and keep going."],
    maj_18: ["द मून", "चंद्र और राहु", "Moon & Rahu", "3–4 हफ़्ते", "3–4 weeks",
      "हालात साफ़ नहीं हैं। डर और भ्रम से बचें।", "Things are unclear. Don't act out of fear or confusion.",
      "भ्रम छँट रहा है और सच धीरे-धीरे सामने आ रहा है।", "The confusion is lifting and the truth is coming out.",
      "उनकी भावनाएँ अभी साफ़ नहीं हैं, या कोई बात छिपाई जा रही है।", "Their feelings are unclear, or something is being hidden.",
      "जल्दबाज़ी में अनुबंध या बड़ा फ़ैसला न करें।", "Don't sign deals or make big decisions in a hurry.",
      "हर बात पर शक करना भी ठीक नहीं — तथ्यों की जाँच करें।", "Don't suspect everything — check the facts.",
      "पूरी जानकारी आने तक रुकें।", "Wait until you have all the facts."],
    maj_19: ["द सन", "सूर्य", "Sun", "1–4 हफ़्ते", "1–4 weeks",
      "सफलता, ख़ुशी और साफ़ परिणाम। सबसे शुभ कार्डों में से एक।", "Success, joy and clear results. One of the best cards.",
      "ख़ुशी थोड़ी देर से मिलेगी, पर मिलेगी ज़रूर।", "Happiness is a little delayed, but it will come.",
      "वे आपके साथ खुलकर ख़ुश हैं और रिश्ते को सबके सामने रखना चाहते हैं।", "They are truly happy with you and want to be open about it.",
      "पहचान, तरक़्क़ी और अच्छे परिणाम मिलेंगे।", "Recognition, promotion and strong results.",
      "आपकी चमक के आगे नकारात्मकता टिक नहीं पाएगी।", "Negativity can't stand in your light.",
      "आत्मविश्वास से आगे बढ़ें।", "Move ahead with confidence."],
    maj_20: ["जजमेंट", "शनि और केतु", "Saturn & Ketu", "2–4 हफ़्ते", "2–4 weeks",
      "एक ज़रूरी फ़ैसला या ख़बर आने वाली है। दूसरा मौक़ा मिल सकता है।", "An important decision or news is coming. A second chance is possible.",
      "ख़ुद को ज़रूरत से ज़्यादा दोष दे रहे हैं, या फ़ैसला टाल रहे हैं।", "You are blaming yourself too much or delaying a decision.",
      "पुराना रिश्ता या बात फिर से शुरू हो सकती है।", "An old connection may come back.",
      "परिणाम, इंटरव्यू कॉल या पुरानी मेहनत का फल मिलने का समय।", "Results, a call-back or reward for past work.",
      "पुरानी ग़लतियों के लिए ख़ुद को माफ़ करें।", "Forgive yourself for past mistakes.",
      "पुरानी सीख के साथ नया फ़ैसला लें।", "Decide afresh, using what you learned."],
    maj_21: ["द वर्ल्ड", "शनि और गुरु", "Saturn & Jupiter", "3–6 हफ़्ते", "3–6 weeks",
      "एक बड़ा काम पूरा होने वाला है। सफलता और संतोष।", "A big goal is completing. Success and fulfilment.",
      "काम लगभग पूरा है, बस आख़िरी कदम बाक़ी है।", "Almost done — one last step remains.",
      "रिश्ता पूर्णता और स्थायी साथ की ओर बढ़ रहा है।", "The relationship is moving towards commitment and completeness.",
      "बड़ी उपलब्धि, विदेश से जुड़ा काम या बड़ा प्रोजेक्ट पूरा होगा।", "A major achievement, foreign work or a big project completes.",
      "आप अपने रास्ते पर सुरक्षित हैं।", "You are safe on your path.",
      "काम पूरा करें, फिर नई शुरुआत करें।", "Finish it, then start the next chapter."]
  };

  // ---------- 56 minor arcana ----------
  const SUITS = {
    Wands: { hi: "वैंड्स", g: ["मंगल और सूर्य", "Mars & Sun"] },
    Cups: { hi: "कप्स", g: ["चंद्र और शुक्र", "Moon & Venus"] },
    Swords: { hi: "स्वॉर्ड्स", g: ["बुध और शनि", "Mercury & Saturn"] },
    Pentacles: { hi: "पेंटाकल्स", g: ["गुरु और शुक्र", "Jupiter & Venus"] }
  };
  const RANK_HI = { Ace: "ऐस", Two: "टू", Three: "थ्री", Four: "फ़ोर", Five: "फ़ाइव", Six: "सिक्स", Seven: "सेवन", Eight: "एट", Nine: "नाइन", Ten: "टेन", Page: "पेज", Knight: "नाइट", Queen: "क्वीन", King: "किंग" };
  const TIME = { Ace: ["1–2 हफ़्ते", "1–2 weeks"], Two: ["2–4 हफ़्ते", "2–4 weeks"], Three: ["3–6 हफ़्ते", "3–6 weeks"], Four: ["लगभग 4 हफ़्ते", "about 4 weeks"], Five: ["4–6 हफ़्ते", "4–6 weeks"], Six: ["2–6 हफ़्ते", "2–6 weeks"], Seven: ["4–7 हफ़्ते", "4–7 weeks"], Eight: ["1–4 हफ़्ते", "1–4 weeks"], Nine: ["3–9 हफ़्ते", "3–9 weeks"], Ten: ["1–2 महीने", "1–2 months"], Page: ["1–2 हफ़्ते", "1–2 weeks"], Knight: ["1–3 हफ़्ते", "1–3 weeks"], Queen: ["3–5 हफ़्ते", "3–5 weeks"], King: ["1–2 महीने", "1–2 months"] };
  // [weight, upHi, upEn, revHi, revEn]
  const MIN = {
    Wands: {
      Ace: [85, "नया जोश और नया अवसर — शुरुआत का सही समय।", "New energy and a new opportunity — the right time to begin.", "जोश तो है, पर शुरुआत में देरी हो रही है।", "The drive is there, but the start is delayed."],
      Two: [65, "आगे की योजना बनाने और बड़ा सोचने का समय।", "Time to plan ahead and think bigger.", "डर के कारण आप फ़ैसला टाल रहे हैं।", "Fear is making you delay the decision."],
      Three: [75, "मेहनत का पहला फल दिखने लगा है। विस्तार के अवसर।", "Early results are showing. Room to expand.", "उम्मीद से कम प्रगति — धैर्य रखें।", "Progress is slower than hoped — be patient."],
      Four: [85, "ख़ुशी, उत्सव और घर-परिवार में सुकून।", "Celebration, joy and peace at home.", "घर या रिश्ते में थोड़ा तनाव, जो जल्दी सुलझेगा।", "A little tension at home that will soon settle."],
      Five: [40, "प्रतियोगिता और छोटी-छोटी बहस।", "Competition and minor arguments.", "झगड़ा ख़त्म होने की ओर है।", "The conflict is winding down."],
      Six: [85, "जीत, सम्मान और पहचान मिलेगी।", "Victory, praise and recognition.", "श्रेय देर से मिलेगा या कम मिलेगा।", "Credit comes late or falls short."],
      Seven: [55, "अपनी बात और जगह पर डटे रहें।", "Stand your ground.", "दबाव में आप थकने लगे हैं।", "You are getting worn down by pressure."],
      Eight: [80, "तेज़ी से ख़बर या प्रगति आएगी।", "Fast news or quick progress.", "काम में अड़चन और देरी।", "Delays and hold-ups."],
      Nine: [50, "आप मंज़िल के क़रीब हैं, बस थोड़ा और धैर्य।", "You are close to the finish; hold on a little longer.", "थकान और शक — ख़ुद पर भरोसा रखें।", "Tired and doubtful — trust yourself."],
      Ten: [35, "ज़िम्मेदारियों का बोझ बहुत ज़्यादा है।", "You are carrying too much.", "कुछ बोझ बाँटें या छोड़ें।", "Share or drop some of the load."],
      Page: [70, "नया विचार या अच्छी ख़बर आने वाली है।", "A new idea or good news is coming.", "जोश है पर दिशा नहीं।", "Plenty of enthusiasm, little direction."],
      Knight: [70, "तेज़ कदम और साहसी पहल।", "Bold, quick action.", "जल्दबाज़ी और अधूरे काम।", "Haste and unfinished work."],
      Queen: [80, "आत्मविश्वास और आकर्षक व्यक्तित्व आपको आगे ले जाएगा।", "Confidence and charm carry you forward.", "ईर्ष्या या असुरक्षा की भावना।", "Jealousy or insecurity."],
      King: [80, "नेतृत्व और बड़ी सोच से सफलता।", "Success through leadership and vision.", "अहंकार या ग़ुस्सा काम बिगाड़ सकता है।", "Ego or temper may spoil things."]
    },
    Cups: {
      Ace: [90, "नया प्रेम, नई भावनाएँ और मन की ख़ुशी।", "New love, fresh feelings and joy.", "भावनाएँ दबी हुई हैं या खुलकर नहीं कह पा रहे।", "Feelings are blocked or held back."],
      Two: [90, "आपसी प्रेम, समझ और अच्छी साझेदारी।", "Mutual love, understanding and a good partnership.", "रिश्ते में ग़लतफ़हमी या असंतुलन।", "Misunderstanding or imbalance in the bond."],
      Three: [85, "दोस्ती, उत्सव और ख़ुशी के पल।", "Friendship, celebration and happy moments.", "दोस्तों में दूरी या किसी तीसरे का दख़ल।", "Distance among friends or a third person interfering."],
      Four: [40, "मन ऊबा हुआ है, सामने आया अवसर दिख नहीं रहा।", "Bored and missing the offer in front of you.", "नए अवसर के लिए मन खुल रहा है।", "You are opening up to new chances."],
      Five: [25, "किसी नुकसान या दुःख पर मन अटका है।", "Your mind is stuck on a loss.", "दुःख से बाहर निकलकर आगे बढ़ रहे हैं।", "You are moving on from the hurt."],
      Six: [70, "पुरानी यादें, बचपन या पुराना साथी फिर से जुड़ सकता है।", "Old memories, or someone from the past may return.", "अतीत में अटके न रहें।", "Don't stay stuck in the past."],
      Seven: [40, "बहुत सारे विकल्प — सपने और सच में फ़र्क़ पहचानें।", "Too many options — tell dreams from reality.", "उलझन दूर हो रही है, सही विकल्प दिखेगा।", "The confusion clears; the right choice appears."],
      Eight: [35, "जो संतोष नहीं देता, उसे छोड़कर आगे बढ़ने का समय।", "Time to walk away from what no longer fulfils you.", "जाने या रुकने को लेकर दुविधा।", "Torn between leaving and staying."],
      Nine: [92, "मनोकामना पूरी होने का कार्ड — संतोष और ख़ुशी।", "The wish card — satisfaction and joy.", "पूरी ख़ुशी में थोड़ी कमी रह सकती है।", "Happiness may feel slightly incomplete."],
      Ten: [95, "परिवार में सुख, प्रेम और स्थायी ख़ुशी।", "Family happiness, love and lasting joy.", "परिवार में मतभेद — बात करके सुलझाएँ।", "Family disagreements — talk them through."],
      Page: [75, "प्रेम का संदेश या भावुक ख़बर आ सकती है।", "A loving message or emotional news may arrive.", "भावनाओं में अपरिपक्वता या मूड बदलना।", "Emotional immaturity or mood swings."],
      Knight: [75, "प्रस्ताव, रोमांटिक पहल या दिल की बात।", "A proposal, romantic gesture or heartfelt offer.", "बातें बहुत, पर काम कम।", "Big words, little follow-through."],
      Queen: [80, "करुणा, समझ और भावनात्मक मज़बूती।", "Compassion, intuition and emotional strength.", "ज़रूरत से ज़्यादा भावुक होना।", "Being overly emotional."],
      King: [80, "भावनाओं पर नियंत्रण और समझदार व्यवहार।", "Calm, balanced and emotionally wise.", "भावनाएँ दबाना या मूडी होना।", "Bottling up feelings or moodiness."]
    },
    Swords: {
      Ace: [70, "साफ़ सोच और सच्चाई से जीत।", "Clarity and truth win.", "भ्रम या कड़वे शब्द नुकसान दे सकते हैं।", "Confusion or harsh words may hurt."],
      Two: [45, "दो रास्तों में उलझन, फ़ैसला टल रहा है।", "Stuck between two choices.", "फ़ैसला लेने का समय आ गया है।", "It's time to decide."],
      Three: [20, "दिल का दर्द या दुःख भरी बात।", "Heartbreak or painful news.", "दर्द कम हो रहा है, घाव भर रहे हैं।", "The hurt is easing and healing has begun."],
      Four: [45, "आराम और शांत होकर सोचने का समय।", "Rest and recover before you act.", "थकान के बावजूद ख़ुद को रोक नहीं रहे।", "You are pushing on despite exhaustion."],
      Five: [25, "जीत की ज़िद में रिश्ते टूट सकते हैं।", "Winning at any cost may cost you people.", "झगड़ा ख़त्म करने और माफ़ी का समय।", "Time to end the fight and make peace."],
      Six: [60, "मुश्किल दौर से बाहर निकलकर बेहतर हालात की ओर।", "Moving away from trouble towards calmer times.", "बदलाव में रुकावट, पर रास्ता खुलेगा।", "Change is delayed, but the way will open."],
      Seven: [30, "कोई चालाकी या छल कर सकता है — सावधान।", "Someone may be deceptive — be careful.", "छिपी बात सामने आ रही है।", "Something hidden is coming to light."],
      Eight: [25, "आप ख़ुद को फँसा हुआ महसूस करते हैं, पर रास्ता है।", "You feel trapped, but there is a way out.", "आप डर से बाहर निकल रहे हैं।", "You are freeing yourself from fear."],
      Nine: [20, "चिंता और नींद की कमी — डर हक़ीक़त से बड़ा है।", "Worry and sleepless nights — the fear is bigger than reality.", "चिंता कम हो रही है।", "The worry is lifting."],
      Ten: [15, "एक मुश्किल दौर का अंत — अब सिर्फ़ ऊपर जाना है।", "The end of a painful phase — only up from here.", "धीरे-धीरे सुधार शुरू हो चुका है।", "Recovery has started."],
      Page: [55, "जिज्ञासा और नई जानकारी — पर बोलने से पहले सोचें।", "Curiosity and new information — think before you speak.", "अफ़वाह या जल्दबाज़ी में कही बात।", "Gossip or hasty words."],
      Knight: [55, "तेज़ फ़ैसले और सीधी बात।", "Quick decisions and direct talk.", "बिना सोचे कदम उठाना।", "Acting without thinking."],
      Queen: [60, "साफ़ और ईमानदार सोच, स्पष्ट सीमाएँ।", "Clear, honest thinking and firm boundaries.", "कड़वाहट या ज़रूरत से ज़्यादा कठोरता।", "Bitterness or being too harsh."],
      King: [65, "तर्क, न्याय और समझदार फ़ैसला।", "Logic, fairness and a sound decision.", "शक्ति का ग़लत इस्तेमाल या कठोरता।", "Misuse of power or coldness."]
    },
    Pentacles: {
      Ace: [92, "नया आर्थिक अवसर — नौकरी, आमदनी या निवेश।", "A new money opportunity — job, income or investment.", "आर्थिक अवसर में देरी या हाथ से निकलना।", "A financial chance is delayed or slips away."],
      Two: [55, "पैसे और कामों में संतुलन बनाना होगा।", "You need to balance money and tasks.", "बहुत सारे काम और ख़र्च एक साथ।", "Too many tasks and bills at once."],
      Three: [80, "टीम वर्क और कौशल की क़द्र होगी।", "Teamwork and skill will be valued.", "तालमेल की कमी से काम धीमा।", "Poor coordination slows the work."],
      Four: [55, "बचत और सुरक्षा — पर कंजूसी नहीं।", "Saving and security — but don't be miserly.", "पैसे को लेकर ज़रूरत से ज़्यादा डर।", "Too much fear around money."],
      Five: [25, "आर्थिक तंगी या अकेलापन — मदद माँगने में संकोच न करें।", "Money worries or feeling left out — don't hesitate to ask for help.", "मुश्किल वक़्त से बाहर निकल रहे हैं।", "You are coming out of hard times."],
      Six: [75, "मदद मिलेगी या आप किसी की मदद करेंगे — लेन-देन बराबर।", "Help received or given — fair give and take.", "उधार या एकतरफ़ा मदद से सावधान।", "Beware of loans or one-sided help."],
      Seven: [55, "धैर्य रखें, मेहनत का फल धीरे आएगा।", "Be patient; returns come slowly.", "मेहनत के मुक़ाबले फल कम — तरीक़ा बदलें।", "Low returns for effort — change the method."],
      Eight: [80, "लगातार मेहनत और हुनर में निखार।", "Steady effort and growing skill.", "काम में मन नहीं लग रहा या जल्दबाज़ी।", "Lack of focus or careless work."],
      Nine: [90, "आर्थिक आत्मनिर्भरता और आराम।", "Financial independence and comfort.", "दिखावे पर ख़र्च से बचें।", "Avoid spending to show off."],
      Ten: [95, "स्थायी धन, परिवार की समृद्धि और संपत्ति।", "Lasting wealth, family prosperity and property.", "परिवार में पैसे या संपत्ति को लेकर मतभेद।", "Family disputes over money or property."],
      Page: [75, "नई पढ़ाई या आमदनी का अवसर।", "A chance to study or earn something new.", "योजना बहुत, काम कम।", "Lots of plans, little action."],
      Knight: [65, "धीमी पर पक्की प्रगति।", "Slow but sure progress.", "आलस या एक ही जगह अटकना।", "Laziness or getting stuck."],
      Queen: [85, "घर और पैसे दोनों को अच्छी तरह सँभालना।", "Managing home and money well.", "काम और घर के बीच असंतुलन।", "Work–home imbalance."],
      King: [90, "धन, स्थिरता और व्यापार में सफलता।", "Wealth, stability and business success.", "लालच या पैसे पर ज़रूरत से ज़्यादा ध्यान।", "Greed or over-focus on money."]
    }
  };
  // what each suit says for each spread (used with minor cards)
  const FOCUS = {
    love: { Wands: ["रिश्ते में आकर्षण और जोश है — पहल करने का समय।", "There is attraction and energy — a time to make a move."], Cups: ["यह कार्ड सीधे भावनाओं की बात करता है — दिल की आवाज़ सुनें।", "This card speaks directly about feelings — listen to your heart."], Swords: ["रिश्ते में बातचीत और साफ़ सोच सबसे ज़रूरी है।", "Honest talk and clear thinking matter most here."], Pentacles: ["रिश्ते में भरोसा, स्थिरता और ज़िम्मेदारी अहम हैं।", "Trust, stability and responsibility matter in this bond."] },
    work: { Wands: ["काम में पहल और मेहनत से आगे बढ़ेंगे।", "Initiative and hard work will move your career."], Cups: ["काम में टीम और लोगों से अच्छा तालमेल लाभ देगा।", "Good relations with people and your team will help."], Swords: ["काम में फ़ैसले सोच-समझकर और लिखित में लें।", "Make work decisions carefully and in writing."], Pentacles: ["पैसा, नौकरी और ठोस परिणाम इस कार्ड का विषय हैं।", "Money, job and tangible results are the theme here."] },
    nazar: { Wands: ["आपकी तरक़्क़ी से कुछ लोग असहज हैं — काम पर ध्यान रखें।", "Some people are uneasy with your progress — stay focused."], Cups: ["अपनी भावनाएँ हर किसी से साझा न करें।", "Don't share your feelings with everyone."], Swords: ["तीखी बातें और अफ़वाहें मन की शांति बिगाड़ रही हैं।", "Sharp words and gossip are disturbing your peace."], Pentacles: ["अपनी आमदनी और योजनाएँ सबको न बताएँ।", "Keep your income and plans private."] }
  };
  const verdict = (w) => (w >= 75 ? ["हाँ", "Yes"] : (w >= 50 ? ["हाँ, पर मेहनत से", "Yes, with effort"] : (w >= 35 ? ["अभी साफ़ नहीं", "Not clear yet"] : ["अभी नहीं", "Not now"])));

  T.deck.forEach((c) => {
    if (MAJ[c.id]) {
      const d = MAJ[c.id];
      Object.assign(c, { nameHi: d[0], grahaHi: d[1], grahaEn: d[2], timingHi: d[3], timingEn: d[4], uprightHi: d[5], uprightEn: d[6], reversedHi: d[7], reversedEn: d[8], feelingsHi: d[9], feelingsEn: d[10], careerHi: d[11], careerEn: d[12], evilEyeHi: d[13], evilEyeEn: d[14], adviceHi: d[15], adviceEn: d[16] });
      if (c.id === "maj_13") c.nameEn = "Death";
    } else {
      const m = /^min_(\w+)_(\w+)$/.exec(c.id); if (!m) return;
      const suit = m[1], rank = m[2], d = MIN[suit] && MIN[suit][rank]; if (!d) return;
      Object.assign(c, { nameHi: `${RANK_HI[rank]} ऑफ़ ${SUITS[suit].hi}`, grahaHi: SUITS[suit].g[0], grahaEn: SUITS[suit].g[1], yesNoWeight: d[0], timingHi: TIME[rank][0], timingEn: TIME[rank][1], uprightHi: d[1], uprightEn: d[2], reversedHi: d[3], reversedEn: d[4],
        feelingsHi: FOCUS.love[suit][0], feelingsEn: FOCUS.love[suit][1], careerHi: FOCUS.work[suit][0], careerEn: FOCUS.work[suit][1], evilEyeHi: FOCUS.nazar[suit][0], evilEyeEn: FOCUS.nazar[suit][1], adviceHi: "", adviceEn: "" });
    }
    const v = verdict(c.yesNoWeight); c.verdictHi = v[0]; c.verdictEn = v[1];
  });

  // ---------- spreads: plain titles and positions ----------
  const POS = {
    yesno: [["स्थिति", "The situation"], ["रुकावट", "The obstacle"], ["परिणाम", "The outcome"]],
    feelings: [["उनकी भावनाएँ", "Their feelings"], ["उन्हें क्या रोक रहा है", "What holds them back"], ["आगे क्या होगा", "What happens next"]],
    career: [["अभी की स्थिति", "Where you stand"], ["चुनौती", "The challenge"], ["आगे का रास्ता", "The way forward"]],
    evileye: [["नकारात्मकता कहाँ से", "Source of the negativity"], ["आप पर असर", "How it affects you"], ["बचाव का उपाय", "How to protect yourself"]],
    destiny: [["अतीत", "Past"], ["वर्तमान", "Present"], ["भविष्य", "Future"]]
  };
  Object.keys(POS).forEach((k) => { if (T.modes[k]) T.modes[k].positions = POS[k].map((p) => ({ hi: p[0], en: p[1] })); });
  T.plain = true;
})();
