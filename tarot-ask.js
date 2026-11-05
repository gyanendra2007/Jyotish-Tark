/* Jyotish Tark — tarot question picker + in-depth analysis writer.
   The person picks a topic, a ready-made question and (if needed) who it is about,
   keeping that person's name in mind. The reading is one connected analysis for that
   question — the cards are shown, not explained one by one. Hindi or English, never mixed. */
(function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const TOPICS = {
    love: ["प्रेम व रिश्ते", "Love & relationships"], marriage: ["विवाह", "Marriage"], career: ["करियर व नौकरी", "Career & job"],
    money: ["पैसा व व्यापार", "Money & business"], study: ["पढ़ाई व परीक्षा", "Studies & exams"], family: ["परिवार", "Family"],
    life: ["जीवन व मन", "Life & mind"], nazar: ["नज़र व रुकावट", "Negativity & blocks"]
  };
  // who the question is about: [chip hi, chip en, possessive hi, possessive en]
  const PERSON = {
    partner: ["साथी", "Partner", "आपके साथी", "your partner"], ex: ["पुराने साथी (एक्स)", "Ex-partner", "आपके पुराने साथी", "your ex"],
    crush: ["जिन्हें आप पसंद करते हैं", "Someone I like", "आपकी पसंद के व्यक्ति", "the person you like"], spouse: ["पति / पत्नी", "Husband / wife", "आपके जीवनसाथी", "your spouse"],
    proposal: ["रिश्ते का प्रस्ताव", "Marriage proposal", "प्रस्ताव वाले व्यक्ति", "the proposed match"], friend: ["दोस्त", "Friend", "आपके दोस्त", "your friend"],
    family: ["परिवार का सदस्य", "Family member", "परिवार के उस सदस्य", "that family member"], boss: ["बॉस", "Boss", "आपके बॉस", "your boss"],
    colleague: ["सहकर्मी", "Colleague", "आपके सहकर्मी", "your colleague"], bizp: ["बिज़नेस पार्टनर", "Business partner", "आपके बिज़नेस पार्टनर", "your business partner"]
  };
  // position headings per reading type ({P} = the person)
  const POS = {
    feel: [["{P} के मन में अभी", "What {P} feels now"], ["उन्हें क्या रोक रहा है", "What is holding them back"], ["आगे वे क्या करेंगे", "What they will do next"]],
    yesno: [["अभी की स्थिति", "Where things stand"], ["रुकावट", "The obstacle"], ["परिणाम", "The outcome"]],
    decide: [["यह कदम उठाने पर", "If you go ahead"], ["किस बात का ध्यान रखें", "What to watch"], ["संभावित परिणाम", "Likely result"]],
    time: [["अभी", "Now"], ["बीच का समय", "In between"], ["परिणाम और समय", "Result and timing"]],
    path: [["अतीत का असर", "What shaped this"], ["अभी", "Right now"], ["आगे का रास्ता", "The way ahead"]],
    evil: [["नकारात्मकता कहाँ से", "Where it comes from"], ["आप पर असर", "How it affects you"], ["बचाव", "How to protect yourself"]]
  };
  // questions: id: [topic, type, area, persons|null, qHi, qEn, [goodHi, goodEn, midHi, midEn, lowHi, lowEn]]
  const Q = {
    love_feel: ["love", "feel", "love", ["partner", "ex", "crush", "spouse"], "वे मेरे बारे में क्या सोचते हैं?", "What do they think about me?",
      ["उनके मन में आपके लिए अच्छी भावनाएँ हैं", "They have warm feelings for you", "उनके मन में भावनाएँ हैं, पर उलझन भी है", "They have feelings, but also confusion", "अभी उनका मन आपकी ओर कम है", "Their heart is not leaning towards you right now"]],
    love_true: ["love", "yesno", "love", ["partner", "crush", "spouse"], "क्या वे मुझसे सच्चा प्यार करते हैं?", "Do they truly love me?",
      ["हाँ — उनकी भावनाएँ सच्ची दिखती हैं", "Yes — their feelings look genuine", "भावनाएँ हैं, पर अभी पूरी तरह पक्की नहीं", "There are feelings, but not fully settled yet", "अभी उनके प्यार में गहराई कम दिखती है", "Their love looks shallow right now"]],
    love_return: ["love", "yesno", "love", ["ex"], "क्या वे मेरे पास लौटेंगे?", "Will they come back to me?",
      ["हाँ — लौटने के अच्छे संकेत हैं", "Yes — there are good signs of a return", "संभावना है, पर पहल और समय दोनों चाहिए", "Possible, but it needs time and effort", "अभी लौटने के संकेत कमज़ोर हैं", "Signs of a return are weak right now"]],
    love_future: ["love", "yesno", "love", ["partner", "crush", "ex"], "क्या हमारा रिश्ता आगे बढ़ेगा?", "Will our relationship move forward?",
      ["हाँ — रिश्ता आगे बढ़ने की ओर है", "Yes — the relationship is moving forward", "आगे बढ़ेगा, पर धीरे और समझदारी से", "It will move, but slowly and with care", "अभी रिश्ता ठहराव में है", "The relationship is stuck for now"]],
    love_move: ["love", "decide", "love", ["crush", "ex"], "क्या मुझे पहल करनी चाहिए?", "Should I make the first move?",
      ["हाँ — पहल करने का यह सही समय है", "Yes — this is the right time to reach out", "पहल करें, पर हल्के और सहज तरीक़े से", "Reach out, but lightly and naturally", "अभी रुकना बेहतर है", "Better to wait for now"]],
    love_gap: ["love", "path", "love", ["partner", "spouse", "ex", "friend"], "हमारे बीच दूरी क्यों आ गई है?", "Why has distance come between us?",
      ["दूरी अस्थायी है और दूर हो सकती है", "The distance is temporary and can be bridged", "दूरी की वजह समझ में आ रही है — बातचीत से सुधार होगा", "The cause is becoming clear — talking will help", "दूरी गहरी है — समय और धैर्य चाहिए", "The distance runs deep — it needs time and patience"]],
    mar_when: ["marriage", "time", "core", null, "मेरी शादी कब तक होगी?", "When will I get married?",
      ["विवाह के योग जल्द बनते दिख रहे हैं", "Marriage looks likely soon", "विवाह होगा, पर थोड़ा समय लगेगा", "Marriage will happen, but it may take a little time", "अभी विवाह में देरी के संकेत हैं", "There are signs of delay for now"]],
    mar_with: ["marriage", "yesno", "love", ["partner", "crush"], "क्या इनसे मेरी शादी होगी?", "Will I marry this person?",
      ["हाँ — इस रिश्ते के विवाह तक पहुँचने के अच्छे संकेत हैं", "Yes — good signs this bond leads to marriage", "संभावना है, पर परिवार और समय की भूमिका बड़ी है", "Possible, but family and timing play a big role", "अभी इस रिश्ते में विवाह के संकेत कमज़ोर हैं", "Signs of marriage in this bond are weak for now"]],
    mar_proposal: ["marriage", "decide", "love", ["proposal"], "क्या यह रिश्ता मेरे लिए सही है?", "Is this proposal right for me?",
      ["यह प्रस्ताव अनुकूल दिखता है", "This proposal looks favourable", "प्रस्ताव ठीक है, पर कुछ बातें अच्छी तरह जाँच लें", "It is fine, but check a few things carefully", "इस प्रस्ताव पर जल्दबाज़ी न करें", "Don't rush into this proposal"]],
    mar_peace: ["marriage", "path", "love", ["spouse"], "हमारे शादीशुदा जीवन में तनाव कैसे दूर होगा?", "How can the tension in our marriage ease?",
      ["तनाव जल्दी कम होने के संकेत हैं", "The tension looks set to ease soon", "सुधार होगा, पर दोनों की कोशिश ज़रूरी है", "Things will improve, but it takes effort from both", "तनाव गहरा है — धैर्य और खुली बातचीत चाहिए", "The tension is deep — patience and honest talk are needed"]],
    job_new: ["career", "yesno", "work", null, "क्या मुझे जल्द नई नौकरी मिलेगी?", "Will I get a new job soon?",
      ["हाँ — नई नौकरी के अच्छे संकेत हैं", "Yes — good signs of a new job", "मिलेगी, पर कोशिश बढ़ानी होगी", "It will come, but you need to push harder", "अभी थोड़ी देरी के संकेत हैं", "There are signs of delay for now"]],
    job_change: ["career", "decide", "work", null, "क्या मुझे नौकरी बदलनी चाहिए?", "Should I change my job?",
      ["बदलाव आपके लिए अच्छा रहेगा", "A change looks good for you", "बदलें, पर नई जगह पक्की होने के बाद ही", "Change, but only once the new role is confirmed", "अभी बदलना जल्दबाज़ी होगी", "Changing now would be hasty"]],
    job_promo: ["career", "yesno", "work", null, "क्या मेरा प्रमोशन या वेतन-वृद्धि होगी?", "Will I get a promotion or raise?",
      ["हाँ — तरक़्क़ी के अच्छे संकेत हैं", "Yes — good signs of growth", "होगा, पर अपनी उपलब्धियाँ सामने रखनी होंगी", "Likely, but you must make your results visible", "अभी तरक़्क़ी में देरी के संकेत हैं", "Growth looks delayed for now"]],
    work_person: ["career", "feel", "work", ["boss", "colleague"], "वे मेरे काम के बारे में क्या सोचते हैं?", "What do they think of my work?",
      ["वे आपके काम से संतुष्ट हैं", "They are happy with your work", "वे आपकी क़द्र करते हैं, पर कुछ बातों से असहज हैं", "They value you, but some things bother them", "अभी उनकी राय पूरी तरह आपके पक्ष में नहीं है", "Their view isn't fully in your favour right now"]],
    career_path: ["career", "path", "work", null, "मेरा करियर किस दिशा में जा रहा है?", "Where is my career heading?",
      ["करियर सही दिशा में बढ़ रहा है", "Your career is heading the right way", "दिशा ठीक है, पर कुछ बदलाव ज़रूरी हैं", "The direction is fine, but some changes are needed", "करियर एक मोड़ पर है — दिशा बदलनी पड़ सकती है", "Your career is at a turning point — you may need a new direction"]],
    money_better: ["money", "yesno", "work", null, "क्या मेरी आर्थिक स्थिति सुधरेगी?", "Will my finances improve?",
      ["हाँ — आर्थिक सुधार के अच्छे संकेत हैं", "Yes — good signs of financial improvement", "सुधार होगा, पर धीरे-धीरे", "It will improve, but slowly", "अभी ख़र्च और दबाव ज़्यादा है", "Expenses and pressure are high right now"]],
    biz_grow: ["money", "yesno", "work", null, "क्या मेरा व्यापार बढ़ेगा?", "Will my business grow?",
      ["हाँ — व्यापार बढ़ने के अच्छे संकेत हैं", "Yes — good signs of growth", "बढ़ेगा, पर तरीक़े में बदलाव चाहिए", "It will grow, but the approach needs changes", "अभी व्यापार में ठहराव है", "Business is slow for now"]],
    money_back: ["money", "yesno", "work", null, "क्या मेरा अटका हुआ पैसा वापस मिलेगा?", "Will I get my stuck money back?",
      ["हाँ — पैसा वापस मिलने के अच्छे संकेत हैं", "Yes — good signs you will get it back", "मिलेगा, पर लगातार याद दिलाना होगा", "Likely, but you will need to follow up", "अभी पैसा लौटने में देरी के संकेत हैं", "Repayment looks delayed for now"]],
    money_deal: ["money", "decide", "work", null, "क्या यह सौदा या निवेश सही रहेगा?", "Is this deal or investment a good idea?",
      ["सौदा अनुकूल दिखता है", "The deal looks favourable", "ठीक है, पर शर्तें ध्यान से पढ़ें", "It's fine, but read the terms carefully", "अभी इस सौदे में जोखिम ज़्यादा है", "The risk looks high right now"]],
    biz_partner: ["money", "decide", "work", ["bizp", "friend", "colleague"], "क्या इन पर भरोसा किया जा सकता है?", "Can I trust this person?",
      ["हाँ — भरोसे के अच्छे संकेत हैं", "Yes — good signs of trust", "भरोसा करें, पर लिखित में और सीमा के साथ", "Trust them, but in writing and with limits", "अभी पूरी तरह भरोसा करना ठीक नहीं", "Not wise to trust fully right now"]],
    exam: ["study", "yesno", "work", null, "क्या इस परीक्षा में मुझे सफलता मिलेगी?", "Will I succeed in this exam?",
      ["हाँ — सफलता के अच्छे संकेत हैं", "Yes — good signs of success", "सफलता मिल सकती है, पर तैयारी और बढ़ानी होगी", "You can succeed, but step up your preparation", "अभी और मेहनत की ज़रूरत है", "More work is needed right now"]],
    admission: ["study", "yesno", "work", null, "क्या मुझे मनचाहे कॉलेज या कोर्स में दाख़िला मिलेगा?", "Will I get into the college or course I want?",
      ["हाँ — दाख़िले के अच्छे संकेत हैं", "Yes — good signs of admission", "संभावना है, पर एक-दो विकल्प और रखें", "Possible, but keep a backup or two", "अभी दूसरे विकल्पों पर भी ध्यान दें", "Keep other options open for now"]],
    abroad: ["study", "yesno", "work", null, "क्या विदेश जाने (पढ़ाई या काम) का सपना पूरा होगा?", "Will my dream of going abroad come true?",
      ["हाँ — विदेश जाने के अच्छे संकेत हैं", "Yes — good signs of going abroad", "संभव है, पर काग़ज़ी काम और तैयारी पूरी रखें", "Possible, but get your paperwork and preparation in order", "अभी देरी के संकेत हैं", "There are signs of delay for now"]],
    study_focus: ["study", "path", "core", null, "पढ़ाई में मन क्यों नहीं लग रहा?", "Why can't I focus on my studies?",
      ["रुकावट छोटी है — जल्दी ध्यान लौटेगा", "The block is small — focus will return soon", "वजह समझ आ रही है — दिनचर्या बदलें", "The cause is clear — change your routine", "मन पर दबाव ज़्यादा है — पहले उसे हल करें", "Your mind is under pressure — deal with that first"]],
    fam_peace: ["family", "time", "core", null, "परिवार में तनाव कब कम होगा?", "When will the family tension ease?",
      ["तनाव जल्दी कम होने के संकेत हैं", "The tension looks set to ease soon", "सुधार होगा, पर थोड़ा समय लगेगा", "It will improve, but it will take a little time", "तनाव अभी कुछ समय रहेगा — धैर्य रखें", "The tension may last a while — be patient"]],
    fam_person: ["family", "feel", "core", ["family", "friend"], "वे मुझसे नाराज़ क्यों हैं?", "Why are they upset with me?",
      ["नाराज़गी छोटी है और जल्द दूर होगी", "The upset is minor and will pass soon", "नाराज़गी की वजह साफ़ है — बात करने से सुधरेगी", "The reason is clear — talking will help", "नाराज़गी गहरी है — धैर्य से बात करें", "The hurt runs deep — talk with patience"]],
    property: ["family", "yesno", "work", null, "क्या घर या ज़मीन से जुड़ा काम बनेगा?", "Will my home or property matter work out?",
      ["हाँ — काम बनने के अच्छे संकेत हैं", "Yes — good signs it will work out", "बनेगा, पर काग़ज़ और समय दोनों पर ध्यान दें", "It will, but watch the paperwork and timing", "अभी देरी या अड़चन के संकेत हैं", "There are signs of delay or hurdles for now"]],
    gen_now: ["life", "path", "core", null, "मेरे जीवन में अभी क्या चल रहा है?", "What is happening in my life right now?",
      ["आप एक अच्छे दौर में प्रवेश कर रहे हैं", "You are entering a good phase", "जीवन बदलाव के दौर में है", "Life is in a phase of change", "यह परीक्षा का समय है — पर यह भी बीतेगा", "This is a testing time — and it will pass"]],
    gen_3m: ["life", "time", "core", null, "आने वाले 3 महीने कैसे रहेंगे?", "How will the next 3 months go?",
      ["आने वाले महीने अच्छे दिखते हैं", "The coming months look good", "मिले-जुले महीने — योजना से चलें", "Mixed months — go with a plan", "सावधानी वाले महीने — धैर्य रखें", "Careful months — be patient"]],
    gen_wish: ["life", "yesno", "core", null, "क्या मेरी मनोकामना पूरी होगी?", "Will my wish come true?",
      ["हाँ — मनोकामना पूरी होने के अच्छे संकेत हैं", "Yes — good signs your wish will come true", "होगी, पर आपकी कोशिश ज़रूरी है", "It can, but it needs your effort", "अभी थोड़ा इंतज़ार करना होगा", "You will need to wait a little"]],
    mind_peace: ["life", "path", "core", null, "मेरा मन अशांत क्यों है और शांति कैसे मिलेगी?", "Why am I restless, and how do I find peace?",
      ["बेचैनी अस्थायी है — शांति लौट रही है", "The restlessness is temporary — calm is returning", "वजह पहचान में आ रही है — छोटे बदलाव मदद करेंगे", "The cause is becoming clear — small changes will help", "मन पर बोझ ज़्यादा है — उसे हल्का करना ज़रूरी है", "Your mind is carrying too much — lighten the load"]],
    evil: ["nazar", "evil", "nazar", null, "क्या किसी की नज़र या ईर्ष्या मुझ पर असर डाल रही है?", "Is someone's envy affecting me?",
      ["कोई बड़ी नकारात्मकता नहीं दिखती", "No major negativity shows up", "हल्की नकारात्मकता है — सावधानी काफ़ी है", "Some mild negativity — caution is enough", "नकारात्मक माहौल का असर दिख रहा है", "A negative atmosphere is affecting you"]],
    enemy: ["nazar", "evil", "nazar", null, "क्या कोई मेरे ख़िलाफ़ काम कर रहा है?", "Is someone working against me?",
      ["कोई गंभीर विरोध नहीं दिखता", "No serious opposition shows up", "कुछ लोग असहज हैं — अपनी बातें सीमित रखें", "Some people are uneasy — keep your plans private", "विरोध के संकेत हैं — सतर्क रहें", "There are signs of opposition — stay alert"]],
    blocked: ["nazar", "evil", "core", null, "मेरे काम बार-बार क्यों अटक जाते हैं?", "Why do my plans keep getting stuck?",
      ["रुकावट जल्द हटने वाली है", "The block is about to lift", "रुकावट की वजह समझ आ रही है — तरीक़ा बदलें", "The cause is clear — change your approach", "रुकावट गहरी है — धैर्य और योजना चाहिए", "The block runs deep — patience and a plan are needed"]]
  };
  const ORDER = { love: ["love_feel", "love_true", "love_return", "love_future", "love_move", "love_gap"], marriage: ["mar_when", "mar_with", "mar_proposal", "mar_peace"], career: ["job_new", "job_change", "job_promo", "work_person", "career_path"], money: ["money_better", "biz_grow", "money_back", "money_deal", "biz_partner"], study: ["exam", "admission", "abroad", "study_focus"], family: ["fam_peace", "fam_person", "property"], life: ["gen_now", "gen_3m", "gen_wish", "mind_peace"], nazar: ["evil", "enemy", "blocked"] };
  // topic tips by result band
  const TIPS = {
    love: [["रिश्ते को समय और भरोसा दें — अच्छी भावनाओं को शब्दों में कहें।", "Give the bond time and trust — put your feelings into words."], ["जल्दबाज़ी या दबाव न डालें; हल्की और सच्ची बातचीत रखें।", "Don't push or pressure; keep the talk light and honest."], ["अपनी ख़ुशी किसी एक व्यक्ति पर टिकाकर न रखें; ख़ुद को प्राथमिकता दें।", "Don't hang your happiness on one person; put yourself first."]],
    marriage: [["परिवार से खुलकर बात करें — यह सही समय है।", "Talk openly with family — the timing is right."], ["कुंडली मिलान और परिवार की राय दोनों साथ रखें।", "Combine Kundali matching with family views."], ["धैर्य रखें; देरी का मतलब इनकार नहीं होता।", "Be patient; delay is not denial."]],
    career: [["अपनी उपलब्धियाँ सामने रखें और नए अवसरों के लिए आवेदन करें।", "Show your results and apply for new opportunities."], ["कौशल बढ़ाएँ और नेटवर्क मज़बूत करें — अवसर पास है।", "Build skills and your network — the opportunity is close."], ["जल्दबाज़ी में नौकरी न छोड़ें; पहले योजना और बचत तैयार करें।", "Don't quit in a hurry; prepare a plan and savings first."]],
    money: [["आमदनी का एक हिस्सा बचत या सुरक्षित निवेश में लगाएँ।", "Put part of your income into savings or safe investments."], ["ख़र्च लिखें और हर सौदा लिखित में करें।", "Track spending and get every deal in writing."], ["नया उधार और जोखिम वाला निवेश अभी टालें।", "Avoid new loans and risky investments for now."]],
    study: [["इसी लय से पढ़ते रहें — रिवीज़न पर ध्यान दें।", "Keep this rhythm — focus on revision."], ["रोज़ का छोटा लक्ष्य बनाएँ और फ़ोन से दूरी रखें।", "Set a small daily target and keep your phone away."], ["पढ़ाई का तरीक़ा बदलें और किसी शिक्षक से मार्गदर्शन लें।", "Change your study method and ask a teacher for guidance."]],
    family: [["परिवार के साथ समय बिताएँ — रिश्ते और मज़बूत होंगे।", "Spend time with family — bonds will grow stronger."], ["बात करते समय शांत रहें और पहले सुनें।", "Stay calm in conversations and listen first."], ["अभी बहस से बचें; माहौल शांत होने पर बात करें।", "Avoid arguments for now; talk once things calm down."]],
    life: [["अवसरों को पहचानें और आगे बढ़ें।", "Spot the opportunities and move forward."], ["दिनचर्या और प्राथमिकताएँ ठीक करें।", "Sort out your routine and priorities."], ["ख़ुद पर दबाव कम करें — आराम और ध्यान को समय दें।", "Ease the pressure on yourself — make time for rest and calm."]],
    nazar: [["अपने काम पर ध्यान रखें — बेवजह चिंता न करें।", "Focus on your work — don't worry needlessly."], ["अपनी योजनाएँ सीमित लोगों से ही साझा करें।", "Share your plans with only a few trusted people."], ["ग़लत संगत से दूरी रखें; हनुमान चालीसा या अपने इष्ट का पाठ मन को मज़बूत करेगा।", "Keep away from negative company; prayer or quiet reflection will steady you."]]
  };
  const SUIT_TXT = { Cups: ["भावनाएँ इस मामले में सबसे बड़ी भूमिका निभा रही हैं।", "Emotions are playing the biggest part here."], Pentacles: ["पैसा, स्थिरता और व्यावहारिक बातें यहाँ निर्णायक हैं।", "Money, stability and practical matters are decisive here."], Swords: ["मन की उलझन और बातचीत की कमी सबसे बड़ी चुनौती है।", "Mental confusion and poor communication are the main challenge."], Wands: ["आपकी पहल और जोश ही नतीजा तय करेंगे।", "Your initiative and drive will decide the outcome."] };
  const EL_TIP = { Fire: ["जोश बनाए रखें, पर जल्दबाज़ी से बचें।", "Keep your drive, but avoid haste."], Water: ["भावनाओं को समझें, पर फ़ैसले शांत मन से लें।", "Honour your feelings, but decide with a calm mind."], Air: ["सोच साफ़ रखें — मन की बात लिखकर देखें।", "Keep your thinking clear — try writing things down."], Earth: ["छोटे, ठोस कदम उठाएँ — धैर्य फल देगा।", "Take small, solid steps — patience will pay off."] };

  // minor cards: what each rank says about a relationship / about work (upright, reversed)
  const RANK = {
    love: {
      Ace: [["रिश्ते में नई शुरुआत की इच्छा है।", "There is a wish for a fresh start in the relationship."], ["भावनाएँ हैं, पर कहने में झिझक है।", "The feelings are there, but they hesitate to say them."]],
      Two: [["दोनों तरफ़ से जुड़ाव और बराबरी की चाह है।", "There is a mutual pull and a wish for an equal bond."], ["तालमेल में कमी और ग़लतफ़हमी है।", "There is a mismatch and some misunderstanding."]],
      Three: [["रिश्ता धीरे-धीरे बढ़ रहा है; दोस्तों या परिवार की भी भूमिका है।", "The bond is slowly growing; friends or family play a part."], ["किसी तीसरे व्यक्ति या बाहरी बातों का असर है।", "A third person or outside matters are interfering."]],
      Four: [["वे स्थिरता और सुरक्षा चाहते हैं।", "They want stability and security."], ["मन में ऊब या दूरी का भाव है।", "There is boredom or a sense of distance."]],
      Five: [["अहं, बहस या पुरानी चोट बीच में है।", "Ego, arguments or an old hurt stand in between."], ["मनमुटाव कम हो रहा है और सुलह की इच्छा है।", "The friction is easing and there is a wish to make up."]],
      Six: [["पुरानी अच्छी यादें उन्हें आपकी ओर खींचती हैं।", "Good old memories pull them towards you."], ["अतीत की बातें अब भी मन में अटकी हैं।", "Past issues are still stuck in their mind."]],
      Seven: [["मन में उलझन है; कई बातें एक साथ चल रही हैं।", "Their mind is confused; many things are going on at once."], ["उलझन कम हो रही है और सच साफ़ हो रहा है।", "The confusion is lifting and the truth is getting clearer."]],
      Eight: [["वे आगे बढ़ना या कुछ दूरी बनाना चाहते हैं।", "They want to move on or create some distance."], ["वे जाने या रुकने को लेकर दुविधा में हैं।", "They are torn between leaving and staying."]],
      Nine: [["वे इस रिश्ते से संतुष्ट हैं और अच्छा महसूस करते हैं।", "They feel content and good about this bond."], ["मन में चिंता या असुरक्षा है।", "There is worry or insecurity in their mind."]],
      Ten: [["वे लंबे समय का, गंभीर साथ चाहते हैं।", "They want a serious, long-term bond."], ["ज़िम्मेदारियों या दबाव के कारण रिश्ता बोझ लग रहा है।", "Pressure and duties are making the bond feel heavy."]],
      Page: [["वे बात शुरू करने या संदेश भेजने की सोच रहे हैं।", "They are thinking of reaching out or sending a message."], ["वे झिझक रहे हैं और पहल नहीं कर पा रहे।", "They are hesitant and can't make the first move."]],
      Knight: [["वे आपकी ओर कदम बढ़ाने को तैयार हैं।", "They are ready to move towards you."], ["उनका व्यवहार कभी गर्म, कभी ठंडा है।", "They are hot and cold."]],
      Queen: [["वे आपकी परवाह करते हैं और भावनात्मक रूप से समझदार हैं।", "They care for you and are emotionally mature."], ["पुराने अनुभवों के कारण वे दिल खोलने से बचते हैं।", "Past hurt makes them guard their heart."]],
      King: [["वे ज़िम्मेदारी और गंभीरता से रिश्ता निभाना चाहते हैं।", "They want to handle the bond seriously and responsibly."], ["अहं या नियंत्रण की आदत रिश्ते में दूरी लाती है।", "Ego or a need for control creates distance."]]
    },
    work: {
      Ace: [["नया अवसर या नई शुरुआत सामने है।", "A new opportunity or fresh start is in front of you."], ["अवसर में देरी है, या वह हाथ से निकल सकता है।", "The opportunity is delayed, or could slip away."]],
      Two: [["दो विकल्पों में से चुनना होगा; योजना ज़रूरी है।", "You must choose between two options; planning matters."], ["फ़ैसले की टालमटोल काम रोक रही है।", "Putting off the decision is holding things up."]],
      Three: [["मेहनत का पहला फल और टीम का साथ मिलेगा।", "Early results and team support are coming."], ["तालमेल की कमी से प्रगति धीमी है।", "Poor coordination is slowing progress."]],
      Four: [["स्थिरता है; अभी जो है उसे मज़बूत करें।", "Things are stable; strengthen what you have."], ["एक ही जगह अटके रहने से ठहराव है।", "Being stuck in one place has led to stagnation."]],
      Five: [["प्रतियोगिता, विरोध या पैसों की तंगी है।", "There is competition, opposition or a money squeeze."], ["मुश्किल दौर ख़त्म होने की ओर है।", "The hard phase is coming to an end."]],
      Six: [["सफलता, पहचान या किसी की मदद मिलेगी।", "Success, recognition or help is coming."], ["श्रेय या मदद मिलने में देरी है।", "Credit or help is delayed."]],
      Seven: [["धैर्य से टिके रहें; फल धीरे आएगा।", "Hold steady; results will come slowly."], ["मेहनत के मुक़ाबले फल कम है; तरीक़ा बदलें।", "Returns are low for the effort; change the method."]],
      Eight: [["तेज़ प्रगति और हुनर में निखार।", "Fast progress and growing skill."], ["काम में देरी या मन न लगना।", "Delays or a lack of focus."]],
      Nine: [["आप लक्ष्य के क़रीब हैं; आत्मनिर्भरता बढ़ रही है।", "You are close to the goal; independence is growing."], ["थकान और चिंता काम पर असर डाल रही है।", "Fatigue and worry are affecting your work."]],
      Ten: [["काम पूरा होने वाला है, पर ज़िम्मेदारी भी बढ़ेगी।", "Work is nearing completion, but responsibility will grow."], ["बोझ बहुत ज़्यादा है — काम बाँटना ज़रूरी है।", "The load is too heavy — share the work."]],
      Page: [["नई सीख, कोर्स या अच्छी ख़बर आएगी।", "New learning, a course or good news is coming."], ["योजनाएँ बहुत, काम कम।", "Lots of plans, little action."]],
      Knight: [["तेज़ कदम और नई पहल का समय है।", "Time for quick steps and new initiative."], ["जल्दबाज़ी से ग़लती हो सकती है।", "Haste could lead to mistakes."]],
      Queen: [["समझदारी और अच्छे व्यवहार से काम बनेगा।", "Good sense and good manners will get things done."], ["काम और निजी जीवन में असंतुलन है।", "Work and personal life are out of balance."]],
      King: [["अधिकार, स्थिरता और बड़े फ़ैसलों का समय है।", "A time of authority, stability and big decisions."], ["अहं या कठोरता से नुकसान हो सकता है।", "Ego or harshness could cause losses."]]
    }
  };
  const SUIT_AREA = {
    love: { Cups: ["यहाँ भावनाएँ दिल से जुड़ी हैं — मामला सच्चे एहसास का है।", "The feelings here come from the heart — this is about real emotion."], Swords: ["यहाँ दिल से ज़्यादा दिमाग़ चल रहा है — सोच-विचार और शंका हावी है।", "The head is ruling the heart here — thinking and doubt dominate."], Wands: ["यहाँ आकर्षण और जोश साफ़ दिखता है।", "Attraction and passion are clearly present here."], Pentacles: ["यहाँ व्यावहारिक सोच है — भरोसा, स्थिरता और भविष्य की सुरक्षा देखी जा रही है।", "The thinking here is practical — trust, stability and the future matter."] },
    work: { Cups: ["लोगों से अच्छे संबंध यहाँ सबसे ज़्यादा मदद करेंगे।", "Good relations with people will help most here."], Swords: ["यहाँ फ़ैसले सोच-समझकर और लिखित में लेना ज़रूरी है।", "Decisions here need care and should be in writing."], Wands: ["पहल और ऊर्जा से ही काम आगे बढ़ेगा।", "Initiative and energy will move this forward."], Pentacles: ["पैसा और ठोस परिणाम यहाँ मुख्य विषय हैं।", "Money and concrete results are the main theme here."] }
  };
  const S = { topic: "love", q: "love_feel", person: null, custom: "" };
  const lang = () => (window.JT_TAROT_LANG === "en" ? "en" : "hi");
  const T = (pair) => (lang() === "hi" ? pair[0] : pair[1]);
  const poss = () => (S.person && PERSON[S.person] ? PERSON[S.person][lang() === "hi" ? 2 : 3] : (lang() === "hi" ? "वे" : "they"));

  function needsPerson() { return S.q !== "custom" && !!Q[S.q][3]; }
  function type() { return S.q === "custom" ? (S.topic === "nazar" ? "evil" : "yesno") : Q[S.q][1]; }
  function area() { if (S.q === "custom") return { love: "love", marriage: "love", career: "work", money: "work", study: "work", family: "core", life: "core", nazar: "nazar" }[S.topic]; return Q[S.q][2]; }
  function pos(i) { const p = POS[type()][i]; let t = T(p).replace("{P}", poss()); if (lang() === "en") t = t.charAt(0).toUpperCase() + t.slice(1); return t; }
  function questionText() {
    if (S.q === "custom") return S.custom;
    return T([Q[S.q][4], Q[S.q][5]]);
  }
  function isYesNo() { return ["yesno", "decide"].includes(type()); }

  // ---------- picker UI ----------
  function renderPicker() {
    const tp = document.getElementById("ttTopics"), qs = document.getElementById("ttQs"), pb = document.getElementById("ttPersonBox"), pp = document.getElementById("ttPersons");
    if (!tp) return;
    tp.innerHTML = Object.keys(TOPICS).map((k) => `<button type="button" class="tt-tchip" data-topic="${k}" aria-pressed="${k === S.topic}">${esc(T(TOPICS[k]))}</button>`).join("");
    qs.innerHTML = ORDER[S.topic].map((id) => `<label class="tt-qopt"><input type="radio" name="ttQ" value="${id}"${id === S.q ? " checked" : ""}><span>${esc(T([Q[id][4], Q[id][5]]))}</span></label>`).join("")
      + `<label class="tt-qopt"><input type="radio" name="ttQ" value="custom"${S.q === "custom" ? " checked" : ""}><span>${esc(T(["अपना प्रश्न लिखें", "Write my own question"]))}</span></label>`
      + `<input type="text" id="ttCustom" class="tt-custom" maxlength="140" ${S.q === "custom" ? "" : "hidden"} value="${esc(S.custom)}" placeholder="${esc(T(["जैसे: क्या इस साल मेरा घर बनेगा?", "e.g. Will I buy a home this year?"]))}">`;
    if (needsPerson()) {
      pb.hidden = false;
      const list = Q[S.q][3];
      if (!list.includes(S.person)) S.person = list.length === 1 ? list[0] : null;
      pp.innerHTML = list.map((k) => `<button type="button" class="tt-pchip" data-person="${k}" aria-pressed="${k === S.person}">${esc(T([PERSON[k][0], PERSON[k][1]]))}</button>`).join("");
    } else { pb.hidden = true; S.person = null; }
    // events
    tp.querySelectorAll("[data-topic]").forEach((b) => b.addEventListener("click", () => { S.topic = b.dataset.topic; S.q = ORDER[S.topic][0]; renderPicker(); notify(); }));
    qs.querySelectorAll('input[name="ttQ"]').forEach((r) => r.addEventListener("change", () => { S.q = r.value; renderPicker(); notify(); if (S.q === "custom") { const c = document.getElementById("ttCustom"); if (c) c.focus(); } }));
    const c = document.getElementById("ttCustom"); if (c) c.addEventListener("input", () => { S.custom = c.value; });
    pp && pp.querySelectorAll("[data-person]").forEach((b) => b.addEventListener("click", () => { S.person = b.dataset.person; renderPicker(); notify(); }));
    const err = document.getElementById("ttFormErr"); if (err) err.textContent = "";
  }
  function notify() { if (typeof window.JT_ASK.onChange === "function") window.JT_ASK.onChange(); }
  function validate() {
    if (S.q === "custom" && !String(S.custom).trim()) return T(["कृपया अपना प्रश्न लिखें।", "Please write your question."]);
    if (needsPerson() && !S.person) return T(["कृपया चुनें कि आप किसके बारे में पूछ रहे हैं।", "Please choose who you are asking about."]);
    return "";
  }

  // ---------- analysis ----------
  function band(prob) { return prob >= 72 ? 0 : (prob >= 48 ? 1 : 2); }
  function headline(prob) {
    const b = band(prob);
    if (S.q === "custom") return T([["संकेत अनुकूल हैं", "The signs are favourable"], ["संकेत मिले-जुले हैं — प्रयास ज़रूरी", "Mixed signs — effort needed"], ["अभी रुकें — पहले रुकावट दूर करें", "Wait — clear the block first"]][b]);
    const h = Q[S.q][6]; return lang() === "hi" ? h[b * 2] : h[b * 2 + 1];
  }
  let seen = {};
  function cardLines(p) {
    const c = p.card, hi = lang() === "hi";
    const core = p.reversed ? (hi ? c.reversedHi : c.reversedEn) : (hi ? c.uprightHi : c.uprightEn);
    const a = area();
    if (a === "core") return [core, hi ? c.adviceHi : c.adviceEn].filter(Boolean).join(" ");
    if (c.arcana === "Minor") {
      const rk = c.id.split("_")[2];
      if (a === "nazar") { const su = c.id.split("_")[1]; if (seen[su]) return core; seen[su] = 1; return core + " " + (hi ? c.evilEyeHi : c.evilEyeEn); }
      const su = c.id.split("_")[1], extra = seen["a" + su] ? "" : " " + T(SUIT_AREA[a][su]); seen["a" + su] = 1;
      return T(RANK[a][rk][p.reversed ? 1 : 0]) + extra;
    }
    const f = { love: "feelings", work: "career", nazar: "evilEye" }[a];
    const al = c[f + (hi ? "Hi" : "En")];
    if (type() === "feel") return p.reversed ? al + " " + T(["पर अभी इसमें कुछ रुकावट है।", "But something is blocking this right now."]) : al;
    return p.reversed ? al + " " + (hi ? "साथ ही, " : "Also, ") + core.charAt(0).toLowerCase() + core.slice(1) : al + " " + core;
  }
  function posNote(i, w) {
    if (i === 0) return w >= 75 ? T(["शुरुआत आपके पक्ष में है।", "The starting point is in your favour."]) : (w < 40 ? T(["शुरुआत में कठिनाई है, इसलिए धैर्य ज़रूरी है।", "The start is difficult, so patience matters."]) : "");
    if (i === 1) return w >= 75 ? T(["यह रुकावट बड़ी नहीं है — थोड़ी समझदारी से पार हो जाएगी।", "This hurdle is small — a little wisdom will get you past it."]) : (w < 40 ? T(["यही इस मामले की सबसे बड़ी चुनौती है — इस पर काम करना ज़रूरी है।", "This is the biggest challenge here — it needs your attention."]) : T(["इस पर ध्यान देंगे तो आगे का रास्ता आसान होगा।", "Deal with this and the road ahead gets easier."]));
    return w >= 75 ? T(["आगे का परिणाम अच्छा दिखता है।", "The outcome looks good."]) : (w < 40 ? T(["परिणाम अभी आपके मन मुताबिक़ नहीं दिखता — समय और प्रयास से बदल सकता है।", "The outcome doesn't look as you hope yet — time and effort can change it."]) : T(["परिणाम आपके प्रयास पर निर्भर करेगा।", "The outcome will depend on your effort."]));
  }
  function body(picked, prob) {
    const hi = lang() === "hi", b = band(prob), w = picked.map((p) => (p.reversed ? (p.card.yesNoWeight > 55 ? Math.max(25, p.card.yesNoWeight - 28) : Math.min(62, p.card.yesNoWeight + 14)) : p.card.yesNoWeight));
    seen = {};
    const sections = picked.map((p, i) => `<section class="tt-an"><h3><span>${i + 1}</span>${esc(pos(i))}</h3><p>${esc(cardLines(p))} ${esc(posNote(i, w[i]))}</p></section>`).join("");
    // overall picture
    const ov = [];
    const d = w[2] - w[0];
    ov.push(d >= 20 ? T(["शुरुआत की मुश्किलें धीरे-धीरे हल होंगी — अंत शुरुआत से बेहतर दिखता है।", "Early difficulties will ease — the end looks better than the start."]) : (d <= -20 ? T(["शुरुआत अच्छी है, पर आगे सावधानी चाहिए — ढिलाई न करें।", "The start is good, but stay careful ahead — don't relax too soon."]) : T(["स्थिति लगभग एक जैसी बनी रहेगी — बदलाव आपके अपने कदम से आएगा।", "Things will stay much the same — change will come from your own steps."])));
    const majors = picked.filter((p) => p.card.arcana === "Major").length;
    if (majors >= 2) ov.push(T(["यह आपके जीवन का एक अहम मोड़ है — परिणाम केवल आपके हाथ में नहीं, समय भी भूमिका निभाएगा।", "This is an important turning point — timing will play a part, not just you."]));
    else if (majors === 0) ov.push(T(["यह मामला ज़्यादातर रोज़मर्रा के फ़ैसलों और आपकी मेहनत पर टिका है।", "This depends mostly on everyday choices and your own effort."]));
    const rev = picked.filter((p) => p.reversed).length;
    if (rev >= 2) ov.push(T(["अभी रुकावटें और देरी ज़्यादा हैं, इसलिए जल्दबाज़ी न करें।", "There are more delays and blocks right now, so don't rush."]));
    const suits = {}; picked.forEach((p) => { if (p.card.arcana === "Minor") { const s = p.card.id.split("_")[1]; suits[s] = (suits[s] || 0) + 1; } });
    const ds = Object.keys(suits).find((k) => suits[k] >= 2); if (ds) ov.push(T(SUIT_TXT[ds]));
    // advice
    const el = {}; picked.forEach((p) => { el[p.card.element] = (el[p.card.element] || 0) + 1; });
    const de = Object.keys(el).sort((a, c) => el[c] - el[a])[0];
    const out = picked[2].card;
    const adv = [T(TIPS[S.topic][b]), (hi ? out.adviceHi : out.adviceEn), el[de] >= 2 ? T(EL_TIP[de]) : ""].filter(Boolean);
    const timing = hi ? out.timingHi : out.timingEn;
    const tline = !/\d/.test(timing) ? T([`समय का संकेत: ${timing}।`, `Timing hint: ${timing}.`]) : b === 2 ? T([`लगभग ${timing} बाद स्थिति दोबारा देखें — तब तक रुकावट पर काम करें।`, `Look at this again in about ${timing} — work on the block until then.`]) : T([`इस मामले में हलचल लगभग ${timing} में दिख सकती है।`, `You may see movement on this in about ${timing}.`]);
    const rel = S.q === "custom" ? ORDER[S.topic].slice(0, 3) : ORDER[S.topic].filter((x) => x !== S.q).slice(0, 3);
    return `<div class="tt-analysis">${sections}</div>
      <div class="tt-overall"><h3>${esc(T(["पूरी तस्वीर", "The full picture"]))}</h3><p>${esc(ov.join(" "))}</p>
        <div class="tt-time"><strong>${esc(T(["समय", "Timing"]))}:</strong> ${esc(tline)}</div></div>
      <div class="tt-advice"><h3>${esc(T(["आपके लिए सलाह", "What you can do"]))}</h3><ul>${adv.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>
      <div class="tt-next"><h3>${esc(T(["इससे जुड़े प्रश्न भी पूछें", "Ask a related question"]))}</h3><div class="tt-next-row">${rel.map((id) => `<button type="button" class="tt-tchip" data-next="${id}">${esc(T([Q[id][4], Q[id][5]]))}</button>`).join("")}</div></div>`;
  }
  function pick(id) { if (!Q[id]) return; S.topic = Q[id][0]; S.q = id; renderPicker(); notify(); }
  function topicName() { return T(TOPICS[S.topic]); }

  window.JT_ASK = { render: renderPicker, validate, pos, type, isYesNo, questionText, headline, body, pick, topicName, state: S, onChange: null };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderPicker); else renderPicker();
})();
