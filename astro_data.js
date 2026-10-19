// astro_data.js - Monthly Database for Jyotish Tark
// Location: Lucknow, Uttar Pradesh, India

const RASHI_LIST = [
    "मेष (Aries)", "वृषभ (Taurus)", "मिथुन (Gemini)", "कर्क (Cancer)", 
    "सिंह (Leo)", "कन्या (Virgo)", "तुला (Libra)", "वृश्चिक (Scorpio)", 
    "धनु (Sagittarius)", "मकर (Capricorn)", "कुंभ (Aquarius)", "मीन (Pisces)"
];

const NAKSHATRA_LIST = [
    "अश्विनी (Ashwini)", "भरणी (Bharani)", "कृत्तिका (Krittika)", "रोहिणी (Rohini)",
    "मृगशिरा (Mrigashira)", "आर्द्रा (Ardra)", "पुनर्वसु (Punarvasu)", "पुष्य (Pushya)",
    "आश्लेषा (Ashlesha)", "मघा (Magha)", "पूर्वाफाल्गुनी (Purva Phalguni)", "उत्तराफाल्गुनी (Uttara Phalguni)",
    "हस्त (Hasta)", "चित्रा (Chitra)", "स्वाति (Swati)", "विशाखा (Vishakha)",
    "अनुराधा (Anuradha)", "ज्येष्ठा (Jyeshtha)", "मूल (Mula)", "पूर्वाषाढ़ा (Purva Ashadha)",
    "उत्तराषाढ़ा (Uttara Ashadha)", "श्रवण (Shravana)", "धनिष्ठा (Dhanishta)", "शतभिषा (Shatabhisha)",
    "पूर्वाभाद्रपद (Purva Bhadrapada)", "उत्तराभाद्रपद (Uttara Bhadrapada)", "रेवती (Revati)"
];

const ASTRO_DATABASE = {
    "2026-10-18": {
        dateHindi: "रविवार, 18 अक्टूबर 2026",
        dateEnglish: "18 October 2026",
        festival: "शारदीय नवरात्रि (सप्तमी) - कालरात्रि पूजा",
        moonSignIndex: 8, // 0=Aries ... 8=Sagittarius
        nakshatraIndex: 19, // 19=Purva Ashadha (morning), shifts to 20=Uttara Ashadha
        panchang: {
            tithi: "शुक्ल सप्तमी (09:14 PM तक), उपरांत अष्टमी",
            nakshatra: "पूर्वाषाढ़ा (11:42 AM तक), उपरांत उत्तराषाढ़ा",
            yoga: "अतिगण्ड (04:18 PM तक), उपरांत सुकर्मा",
            karana: "गर (08:30 AM तक), उपरांत वणिज",
            paksha: "शुक्ल पक्ष",
            masa: "आश्विन",
            sunrise: "06:08 AM",
            sunset: "05:37 PM",
            moonrise: "12:18 PM",
            moonset: "11:24 PM",
            moonSign: "धनु (05:58 PM तक), उपरांत मकर",
            sunSign: "तुला (Libra)",
            brahmaMuhurat: "04:32 AM - 05:20 AM",
            abhijitMuhurat: "11:30 AM - 12:15 PM",
            amritKaal: "06:12 AM - 07:54 AM",
            godhuliMuhurat: "05:37 PM - 06:01 PM",
            rahuKaal: "04:11 PM - 05:37 PM",
            yamaganda: "11:52 AM - 01:18 PM",
            gulikaKaal: "02:45 PM - 04:11 PM",
            varjyam: "07:40 PM - 09:22 PM",
            dishaShool: "पश्चिम (West) - दलिया या घी खाकर यात्रा करें"
        },
        liveWindows: {
            abhijit: { start: "11:30", end: "12:15", label: "अभिजीत मुहूर्त (Best for Important Work)" },
            amrit: { start: "06:12", end: "07:54", label: "अमृत काल (Best for Spiritual & New Tasks)" },
            rahu: { start: "16:11", end: "17:37", label: "राहु काल (Avoid Financial & New Decisions)" },
            yamaganda: { start: "11:52", end: "13:18", label: "यमगंड (Avoid Travel & Negotiations)" }
        },
        activities: {
            vehicle: { status: "good", score: "85%", title: "शुभ (Auspicious after 11:42 AM)", desc: "उत्तराषाढ़ा नक्षत्र (11:42 AM के बाद) और सप्तमी तिथि वाहन या इलेक्ट्रॉनिक्स की बुकिंग के लिए श्रेष्ठ हैं। राहु काल (04:11 PM - 05:37 PM) से बचें।" },
            finance: { status: "caution", score: "60%", title: "सामान्य (Moderate for Finance)", desc: "रविवार और अतिगण्ड योग (04:18 PM तक) के कारण बड़े कर्ज के लेन-देन से बचें। केवल नियमित निवेश ही करें।" },
            travel: { status: "good", score: "80%", title: "यात्रा अनुकूल (Good for Travel)", desc: "सप्तमी तिथि यात्रा के लिए शुभ है। पश्चिम दिशा में दिशा शूल है—यदि पश्चिम जाना आवश्यक हो तो घी या दलिया खाकर प्रस्थान करें।" },
            property: { status: "good", score: "88%", title: "उत्तम (Great after 11:42 AM)", desc: "11:42 AM के बाद उत्तराषाढ़ा (ध्रुव/स्थिर नक्षत्र) लगने से भूमि पूजन, प्रॉपर्टी डील और नींव से जुड़े कार्यों के लिए दिन अत्यंत शुभ है।" },
            career: { status: "good", score: "90%", title: "श्रेष्ठ (Excellent for Leadership)", desc: "रविवार + उत्तराषाढ़ा नक्षत्र सरकारी कार्यों, प्रमोशन की बात करने और नए प्रोजेक्ट की रूपरेखा बनाने के लिए सर्वोत्तम है।" },
            medical: { status: "caution", score: "55%", title: "सावधानी रखें (Routine Care Only)", desc: "सप्तमी को तेल मालिश या आक्रामक कॉस्मेटिक प्रक्रियाओं से बचना चाहिए। स्वास्थ्य जांच के लिए सुबह का समय ठीक है।" }
        },
        guidance: [
            {
                icon: "🪔",
                title: "Kalratri Puja & Saptami",
                text: "Today is Maha Saptami of Shardiya Navratri, dedicated to Maa Kalratri. Worshipping her today destroys unseen fears, chronic obstacles, and negative energies."
            },
            {
                icon: "☀️",
                title: "Uttara Ashadha Shift",
                text: "After 11:42 AM, the Moon enters Uttara Ashadha Nakshatra, ruled by the Sun. This creates an invincible alignment on a Sunday for taking long-term leadership decisions."
            },
            {
                icon: "⚠️",
                title: "Evening Rahu Kaal",
                text: "Rahu Kaal runs from 04:11 PM to 05:37 PM today. Complete important festive purchases or agreements before 04:00 PM."
            }
        ]
    },

    "2026-10-19": {
        dateHindi: "सोमवार, 19 अक्टूबर 2026",
        dateEnglish: "19 October 2026",
        festival: "शारदीय नवरात्रि - महाष्टमी (दुर्गा अष्टमी)",
        moonSignIndex: 9, // 9=Capricorn
        nakshatraIndex: 21, // 20=Uttara Ashadha till 1:55 PM, 21=Shravana main cosmic influence
        panchang: {
            tithi: "शुक्ल अष्टमी (10:48 PM तक), उपरांत नवमी",
            nakshatra: "उत्तराषाढ़ा (01:55 PM तक), उपरांत श्रवण",
            yoga: "सुकर्मा (04:35 PM तक), उपरांत धृति",
            karana: "विष्टि/भद्रा (10:01 AM तक), उपरांत बव",
            paksha: "शुक्ल पक्ष",
            masa: "आश्विन",
            sunrise: "06:09 AM",
            sunset: "05:36 PM",
            moonrise: "01:08 PM",
            moonset: "12:21 AM (20 अक्टूबर)",
            moonSign: "मकर (Capricorn)",
            sunSign: "तुला (Libra)",
            brahmaMuhurat: "04:33 AM - 05:21 AM",
            abhijitMuhurat: "11:29 AM - 12:15 PM",
            amritKaal: "07:12 AM - 08:56 AM",
            godhuliMuhurat: "05:36 PM - 06:00 PM",
            rahuKaal: "07:35 AM - 09:01 AM",
            yamaganda: "10:27 AM - 11:52 AM",
            gulikaKaal: "01:18 PM - 02:44 PM",
            varjyam: "08:50 PM - 10:34 PM",
            dishaShool: "पूर्व (East) - दर्पण देखकर या दूध पीकर निकलें"
        },
        liveWindows: {
            abhijit: { start: "11:29", end: "12:15", label: "अभिजीत मुहूर्त (Best for Important Work)" },
            amrit: { start: "07:12", end: "08:56", label: "अमृत काल (Spiritual Sadhana Window)" },
            rahu: { start: "07:35", end: "09:01", label: "राहु काल (Avoid Starting New Work)" },
            yamaganda: { start: "10:27", end: "11:52", label: "यमगंड (Avoid Financial Risk)" }
        },
        activities: {
            vehicle: { status: "good", score: "82%", title: "दोपहर बाद शुभ (Good after 01:55 PM)", desc: "सुबह 10:01 AM तक भद्रा है। दोपहर 01:55 PM के बाद जब 'श्रवण' (चर/गतिशील नक्षत्र) प्रारंभ हो, तब वाहन या गैजेट खरीदना अत्यंत शुभ रहेगा।" },
            finance: { status: "caution", score: "50%", title: "उधार देने से बचें (Avoid Lending)", desc: "अष्टमी तिथि और सुबह की भद्रा के कारण आज किसी को बड़ा धन उधार न दें। निवेश या बैंकिंग कार्य 11:29 AM (अभिजीत मुहूर्त) के बाद करें।" },
            travel: { status: "good", score: "85%", title: "01:55 PM के बाद उत्तम (Best in Afternoon)", desc: "श्रवण नक्षत्र यात्रा के लिए श्रेष्ठ माना जाता है। आज पूर्व (East) दिशा में दिशा शूल है—पूर्व की यात्रा से पहले दर्पण देखें या थोड़ा दूध पिएं।" },
            property: { status: "good", score: "78%", title: "10:01 AM से 01:55 PM तक शुभ", desc: "भद्रा समाप्ति (10:01 AM) से लेकर उत्तराषाढ़ा नक्षत्र रहने (01:55 PM) तक का समय प्रॉपर्टी के कागजात और वास्तु कार्यों के लिए मजबूत है।" },
            career: { status: "good", score: "92%", title: "अत्यंत शुभ (Great for Career & Study)", desc: "सोमवार + श्रवण नक्षत्र + सुकर्मा योग का संगम शिक्षा, काउंसलिंग, मीडिया और ऑफिस मीटिंग्स में बड़ी सफलता दिलाएगा।" },
            medical: { status: "bad", score: "30%", title: "आज टालें (Avoid Haircut/Nails Today)", desc: "महाष्टमी पर्व और अष्टमी तिथि पर बाल कटवाना, नाखून काटना या वैकल्पिक सर्जरी कराना शास्त्रों में वर्जित है।" }
        },
        guidance: [
            {
                icon: "🔱",
                title: "Maha Ashtami & Shravana Power",
                text: "With Shukla Ashtami active today and the Moon entering its own Nakshatra (Shravana) at 01:55 PM on a Monday, the afternoon creates a rare Siddha alignment for spiritual साधना, learning, and career stability."
            },
            {
                icon: "🪐",
                title: "Lal Kitab & Ashtakvarga Insight",
                text: "Moon in Capricorn (10th sign of Karma) on Somvar demands emotional discipline. Offer raw milk mixed with water on a Shivling today to strengthen your natal Moon and clear mental blocks."
            },
            {
                icon: "⏳",
                title: "Morning Bhadra & Rahu Kaal Alert",
                text: "Both Rahu Kaal (07:35 AM - 09:01 AM) and Vishti Karana (till 10:01 AM) fall in the early morning. Schedule important signings, Kanya Pujan preparations, or major purchases after 10:05 AM."
            }
        ]
    },

    "2026-10-20": {
        dateHindi: "मंगलवार, 20 अक्टूबर 2026",
        dateEnglish: "20 October 2026",
        festival: "महानवमी (शारदीय नवरात्रि समापन) एवं हवन पूजन",
        moonSignIndex: 9, // Capricorn
        nakshatraIndex: 21, // Shravana till 3:45 PM, then 22=Dhanishta
        panchang: {
            tithi: "शुक्ल नवमी (11:52 PM तक), उपरांत दशमी",
            nakshatra: "श्रवण (03:45 PM तक), उपरांत धनिष्ठा",
            yoga: "धृति (04:30 PM तक), उपरांत शूल",
            karana: "बालव (11:20 AM तक), उपरांत कौलव",
            paksha: "शुक्ल पक्ष",
            masa: "आश्विन",
            sunrise: "06:10 AM",
            sunset: "05:35 PM",
            moonrise: "01:52 PM",
            moonset: "01:18 AM (21 अक्टूबर)",
            moonSign: "मकर (Capricorn)",
            sunSign: "तुला (Libra)",
            brahmaMuhurat: "04:33 AM - 05:21 AM",
            abhijitMuhurat: "11:29 AM - 12:15 PM",
            amritKaal: "08:40 AM - 10:22 AM",
            godhuliMuhurat: "05:35 PM - 05:59 PM",
            rahuKaal: "02:44 PM - 04:10 PM",
            yamaganda: "09:01 AM - 10:27 AM",
            gulikaKaal: "11:52 AM - 01:18 PM",
            varjyam: "10:15 PM - 11:58 PM",
            dishaShool: "उत्तर (North) - गुड़ खाकर यात्रा प्रारंभ करें"
        },
        liveWindows: {
            abhijit: { start: "11:29", end: "12:15", label: "अभिजीत मुहूर्त (Best for Havan & Sankalp)" },
            amrit: { start: "08:40", end: "10:22", label: "अमृत काल (Best for Kanya Pujan)" },
            rahu: { start: "14:44", end: "16:10", label: "राहु काल (Avoid Auspicious Ceremonies)" },
            yamaganda: { start: "09:01", end: "10:27", label: "यमगंड (Avoid Commercial Contracts)" }
        },
        activities: {
            vehicle: { status: "caution", score: "65%", title: "बुकिंग करें, डिलीवरी कल लें", desc: "नवमी (रिक्ता तिथि) और मंगलवार होने से वाहन की बुकिंग तो की जा सकती है, परंतु वाहन घर लाने के लिए कल दशहरा (अबूझ मुहूर्त) सर्वोत्तम है।" },
            finance: { status: "bad", score: "35%", title: "कर्ज बिल्कुल न लें (Strictly Avoid Loans)", desc: "मंगलवार को कर्ज लेना शास्त्रों में वर्जित है। हां, यदि पुराना लोन चुकाना चाहते हैं, तो आज ऋण मुक्ति के लिए सर्वश्रेष्ठ दिन है!" },
            travel: { status: "caution", score: "60%", title: "सावधानी से यात्रा करें", desc: "उत्तर (North) दिशा में दिशा शूल है। यदि यात्रा अनिवार्य हो, तो गुड़ खाकर और हनुमान चालीसा का पाठ करके ही प्रस्थान करें।" },
            property: { status: "good", score: "85%", title: "भूमि/मंगल कार्यों हेतु शुभ", desc: "मंगलवार और धृति योग के प्रभाव से प्रॉपर्टी का निरीक्षण करने या कंस्ट्रक्शन संबंधी निर्णयों के लिए सुबह 11:29 AM - 12:15 PM का समय उत्तम है।" },
            career: { status: "good", score: "80%", title: "साहसिक निर्णयों का दिन", desc: "मां सिद्धिदात्री की कृपा और मंगल के प्रभाव से रुके हुए प्रोजेक्ट्स को पूरा करने और तकनीकी कार्यों में सफलता मिलेगी।" },
            medical: { status: "bad", score: "25%", title: "मंगलवार व नवमी निषेध", desc: "मंगलवार और महानवमी के कारण आज बाल/दाढ़ी कटवाना या अनावश्यक रक्त संबंधी प्रक्रियाएं टालना ही श्रेयस्कर है।" }
        },
        guidance: [
            {
                icon: "🔥",
                title: "Maha Navami & Siddhidatri Puja",
                text: "Today is Maha Navami, governed by Maa Siddhidatri. Performing Navami Havan and Kanya Pujan during the morning Amrit Kaal (08:40 AM - 10:22 AM) or Abhijit Muhurat (11:29 AM - 12:15 PM) grants complete fulfillment of efforts."
            },
            {
                icon: "⚡",
                title: "Dhanishta Mars Alignment",
                text: "At 03:45 PM, the Moon enters Dhanishta Nakshatra (ruled by Mars) on a Tuesday! This triggers a massive surge of courage, property-related momentum, and decisive energy."
            },
            {
                icon: "⚠️",
                title: "Afternoon Rahu Kaal Warning",
                text: "Avoid performing Havan Purnahuti during Rahu Kaal between 02:44 PM and 04:10 PM."
            }
        ]
    },

    "2026-10-21": {
        dateHindi: "बुधवार, 21 अक्टूबर 2026",
        dateEnglish: "21 October 2026",
        festival: "विजयादशमी (दशहरा) - साढ़े तीन अबूझ मुहूर्तों में से एक",
        moonSignIndex: 10, // Aquarius
        nakshatraIndex: 22, // Dhanishta till 5:12 PM, then 23=Shatabhisha
        panchang: {
            tithi: "शुक्ल दशमी (पूरे दिन)",
            nakshatra: "धनिष्ठा (05:12 PM तक), उपरांत शतभिषा",
            yoga: "शूल (04:08 PM तक), उपरांत गण्ड",
            karana: "तैतिल (12:15 PM तक), उपरांत गर",
            paksha: "शुक्ल पक्ष",
            masa: "आश्विन",
            sunrise: "06:10 AM",
            sunset: "05:34 PM",
            moonrise: "02:32 PM",
            moonset: "02:15 AM (22 अक्टूबर)",
            moonSign: "कुंभ (Aquarius)",
            sunSign: "तुला (Libra)",
            brahmaMuhurat: "04:34 AM - 05:22 AM",
            abhijitMuhurat: "02:02 PM - 02:48 PM (विजय मुहूर्त विशेष)",
            amritKaal: "10:12 AM - 11:54 AM",
            godhuliMuhurat: "05:34 PM - 05:58 PM",
            rahuKaal: "11:52 AM - 01:18 PM",
            yamaganda: "07:36 AM - 09:01 AM",
            gulikaKaal: "10:27 AM - 11:52 AM",
            varjyam: "11:45 PM - 01:25 AM",
            dishaShool: "उत्तर (North) - हरा धनिया या तिल खाकर निकलें"
        },
        liveWindows: {
            abhijit: { start: "14:02", end: "14:48", label: "विजय मुहूर्त (Best Time for New Ventures & Shastra Puja)" },
            amrit: { start: "10:12", end: "11:54", label: "अमृत काल (Auspicious for Vehicle/Gold Purchase)" },
            rahu: { start: "11:52", end: "13:18", label: "राहु काल (Pause Major Transactions)" },
            yamaganda: { start: "07:36", end: "09:01", label: "यमगंड (Routine Work Only)" }
        },
        activities: {
            vehicle: { status: "good", score: "98%", title: "सर्वश्रेष्ठ अबूझ मुहूर्त!", desc: "विजयादशमी वाहन, सोना, लैपटॉप और मशीनरी खरीदने के लिए वर्ष के सबसे शुभ दिनों में से एक है। 10:12 AM - 11:50 AM या 02:02 PM - 02:48 PM (विजय मुहूर्त) में खरीदें।" },
            finance: { status: "good", score: "95%", title: "निवेश एवं खाता खोलने हेतु उत्तम", desc: "बुधवार और दशहरा का संयोग व्यापारिक निवेश, बही-खाता पूजन और नए वित्तीय लक्ष्य शुरू करने के लिए अत्यंत समृद्धिशाली है।" },
            travel: { status: "good", score: "92%", title: "सीमोल्लंघन एवं शुभ यात्रा", desc: "दशहरे पर यात्रा करना विजय का प्रतीक है। केवल राहु काल (11:52 AM - 01:18 PM) को छोड़कर किसी भी समय प्रस्थान करें।" },
            property: { status: "good", score: "96%", title: "गृह प्रवेश व भूमि डील हेतु श्रेष्ठ", desc: "अबूझ मुहूर्त होने के कारण आज प्रॉपर्टी का टोकन देने, रजिस्ट्री की बात पक्की करने या नए ऑफिस के उद्घाटन के लिए दिन सर्वोत्तम है।" },
            career: { status: "good", score: "99%", title: "नया व्यापार व जॉब शुरू करने का दिन", desc: "विजय मुहूर्त (02:02 PM - 02:48 PM) में शुरू किया गया कोई भी व्यावसायिक कार्य या प्रोजेक्ट निश्चित विजय दिलाता है।" },
            medical: { status: "good", score: "80%", title: "स्वास्थ्य एवं ग्रूमिंग हेतु अनुकूल", desc: "नवरात्रि व्रत पारायण के बाद आज ग्रूमिंग और नई फिटनेस दिनचर्या शुरू करने के लिए बुधवार का दिन अनुकूल है।" }
        },
        guidance: [
            {
                icon: "🏹",
                title: "Vijayadashami (Abujh Muhurat)",
                text: "Dussehra is one of the 3.5 most auspicious 'Abujh Muhurats' of the Hindu calendar. The Vijay Muhurat (02:02 PM - 02:48 PM) guarantees victory in new business launches, vehicle purchases, and important undertakings."
            },
            {
                icon: "🌿",
                title: "Shami Puja & Aparajita",
                text: "Worshipping the Shami tree today and keeping a Shami leaf in your locker or wallet pacifies Saturn and attracts undefeated prosperity throughout the year."
            },
            {
                icon: "🧭",
                title: "Midday Rahu Kaal",
                text: "Even on an Abujh Muhurat day, wise astrologers avoid the Rahu Kaal window (11:52 AM - 01:18 PM) for vehicle delivery or contract signing."
            }
        ]
    }
};
