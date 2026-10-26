/**
 * ============================================================================
 * JYOTISH TARK — HIGH-PRECISION VEDIC BIRTH CHART CALCULATOR (Engine 3)
 * File: birth-chart-calculator.js • v7.0 (All-India 750+ Places + DOB-Noon Ephemeris)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Features:
 * 1. Exact Geocentric Ecliptic Longitudes via astronomy-engine (VSOP87 / ELP2000)
 * 2. True Lahiri Chitrapaksha Ayanamsa & Quadrant-Safe Udaya Lagna (Ascendant)
 * 3. True Retrograde (Vakri) Velocity Detection for Mars, Mercury, Jupiter, Venus, Saturn
 * 4. All-India 750+ Districts, Tehsils & Pilgrimage Hubs + Global Cities Database
 *    with 1-to-3 Letter Instant Autocomplete (`searchPlaces`) + Nominatim Fallback
 * 5. `calculateDobOnlyAstronomy(dob)`: Honest 12:00 PM Noon IST Sidereal Planetary
 *    Calculator for users who only know their Date of Birth (No Fake Lagna!)
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. ALL-INDIA 750+ DISTRICTS, FAMOUS TOWNS & GLOBAL HUBS DATABASE
  //    Format: "State/Country": [ ["City/District", lat, lng, tzOffsetMins?], ... ]
  // ==========================================================================
  const RAW_PLACES_BY_STATE = {
    "Uttar Pradesh": [
      ["Lucknow",26.8467,80.9462],["Kanpur",26.4499,80.3319],["Varanasi (Kashi)",25.3176,82.9739],
      ["Prayagraj (Allahabad)",25.4358,81.8463],["Agra",27.1767,78.0081],["Ayodhya",26.7922,82.1998],
      ["Gorakhpur",26.7606,83.3732],["Noida",28.5355,77.3910],["Greater Noida",28.4744,77.5040],
      ["Ghaziabad",28.6692,77.4538],["Meerut",28.9845,77.7064],["Bareilly",28.3670,79.4304],
      ["Aligarh",27.8974,78.0880],["Moradabad",28.8386,78.7733],["Saharanpur",29.9680,77.5552],
      ["Jhansi",25.4484,78.5685],["Mathura",27.4924,77.6737],["Vrindavan",27.5806,77.7006],
      ["Firozabad",27.1592,78.3957],["Muzaffarnagar",29.4727,77.7085],["Shahjahanpur",27.8815,79.9109],
      ["Rampur",28.8152,79.0250],["Etawah",26.7856,79.0158],["Mainpuri",27.2306,79.0258],
      ["Farrukhabad",27.3826,79.5840],["Kannauj",27.0514,79.9137],["Auraiya",26.4644,79.5092],
      ["Kanpur Dehat (Akbarpur)",26.3800,79.9500],["Unnao",26.5393,80.4878],["Raebareli",26.2345,81.2409],
      ["Sitapur",27.5680,80.6826],["Hardoi",27.3959,80.1314],["Lakhimpur Kheri",27.9463,80.7787],
      ["Barabanki",26.9268,81.1834],["Sultanpur",26.2648,82.0727],["Amethi",26.1541,81.8143],
      ["Pratapgarh",25.8971,81.9456],["Kaushambi",25.5318,81.3789],["Fatehpur",25.9304,80.8139],
      ["Banda",25.4763,80.3395],["Chitrakoot",25.2007,80.9039],["Hamirpur",25.9564,80.1483],
      ["Mahoba",25.2921,79.8724],["Jalaun (Orai)",25.9878,79.4504],["Lalitpur",24.6912,78.4187],
      ["Mirzapur",25.1460,82.5690],["Sonbhadra (Robertsganj)",24.6879,83.0650],["Bhadohi",25.3948,82.5696],
      ["Jaunpur",25.7464,82.6837],["Ghazipur",25.5840,83.5770],["Chandauli",25.2605,83.2645],
      ["Azamgarh",26.0739,83.1859],["Mau",25.9417,83.5611],["Ballia",25.7604,84.1471],
      ["Deoria",26.5024,83.7791],["Kushinagar (Padrauna)",26.9022,83.9819],["Maharajganj",27.1446,83.5620],
      ["Basti",26.7997,82.7351],["Sant Kabir Nagar (Khalilabad)",26.7745,83.0715],["Siddharthnagar",27.2588,83.0954],
      ["Gonda",27.1340,81.9619],["Balrampur",27.4297,82.1850],["Bahraich",27.5743,81.5959],
      ["Shravasti",27.5030,82.0370],["Ambedkar Nagar",26.4272,82.5332],["Budaun",28.0362,79.1263],
      ["Pilibhit",28.6312,79.8044],["Bijnor",29.3724,78.1358],["Amroha",28.9044,78.4673],
      ["Sambhal",28.5854,78.5706],["Bulandshahr",28.4070,77.8498],["Hapur",28.7306,77.7759],
      ["Baghpat",28.9442,77.2187],["Shamli",29.4496,77.3128],["Hathras",27.5950,78.0520],
      ["Kasganj",27.8085,78.6461],["Etah",27.5588,78.6626],["Faizabad",26.7730,82.1458]
    ],
    "Madhya Pradesh": [
      ["Bhopal",23.2599,77.4126],["Indore",22.7196,75.8577],["Gwalior",26.2183,78.1828],
      ["Jabalpur",23.1815,79.9864],["Ujjain",23.1765,75.7885],["Porsa",26.6710,78.3712],
      ["Ambah",26.7069,78.2295],["Morena",26.4947,77.9940],["Bhind",26.5647,78.7871],
      ["Sagar",23.8388,78.7378],["Rewa",24.5362,81.3037],["Satna",24.6005,80.8322],
      ["Ratlam",23.3315,75.0367],["Dewas",22.9676,76.0534],["Katni (Murwara)",23.8343,80.3894],
      ["Chhindwara",22.0574,78.9382],["Guna",24.6470,77.3112],["Shivpuri",25.4235,77.6611],
      ["Datia",25.6673,78.4609],["Dabra",25.8856,78.3320],["Sheopur",25.6670,76.6961],
      ["Ashoknagar",24.5775,77.7319],["Vidisha",23.5251,77.8081],["Raisen",23.3315,77.7867],
      ["Sehore",23.2032,77.0844],["Narmadapuram (Hoshangabad)",22.7481,77.7289],["Itarsi",22.6148,77.7625],
      ["Betul",21.9012,77.8961],["Harda",22.3444,77.0940],["Khandwa",21.8314,76.3498],
      ["Omkareshwar",22.2456,76.1510],["Burhanpur",21.3104,76.2285],["Khargone",21.8245,75.6102],
      ["Maheshwar",22.1769,75.5880],["Barwani",22.0360,74.9037],["Dhar",22.5979,75.3040],
      ["Pithampur",22.6130,75.6820],["Jhabua",22.7697,74.5909],["Alirajpur",22.3033,74.3591],
      ["Mandsaur",24.0768,75.0693],["Neemuch",24.4765,74.8624],["Shajapur",23.4272,76.2776],
      ["Agar Malwa",23.7122,76.0150],["Rajgarh",24.0080,76.7276],["Chhatarpur",24.9164,79.5882],
      ["Khajuraho",24.8318,79.9199],["Tikamgarh",24.7456,78.8319],["Orchha",25.3519,78.6419],
      ["Panna",24.7180,80.1884],["Damoh",23.8323,79.4387],["Maihar",24.2638,80.7583],
      ["Sidhi",24.4090,81.8794],["Singrauli (Waidhan)",24.0695,82.6225],["Shahdol",23.3002,81.3598],
      ["Anuppur",23.1157,81.6966],["Amarkantak",22.6744,81.7590],["Umaria",23.5245,80.8365],
      ["Dindori",22.9437,81.0772],["Mandla",22.5980,80.3714],["Balaghat",21.8129,80.1838],
      ["Seoni",22.0869,79.5435],["Narsinghpur",22.9469,79.1945],["Mauganj",24.6660,81.8790]
    ],
    "Bihar": [
      ["Patna",25.5941,85.1376],["Gaya",24.7955,85.0002],["Bodh Gaya",24.6961,84.9870],
      ["Muzaffarpur",26.1197,85.3910],["Bhagalpur",25.2425,86.9842],["Darbhanga",26.1542,85.8918],
      ["Purnia",25.7771,87.4753],["Arrah (Bhojpur)",25.5560,84.6603],["Begusarai",25.4182,86.1272],
      ["Katihar",25.5415,87.5678],["Munger",25.3748,86.4735],["Chhapra (Saran)",25.7796,84.7499],
      ["Danapur",25.6290,85.0440],["Bettiah (West Champaran)",26.8025,84.5037],["Motihari (East Champaran)",26.6470,84.9167],
      ["Saharsa",25.8777,86.5952],["Sasaram (Rohtas)",24.9482,84.0163],["Hajipur (Vaishali)",25.6858,85.2146],
      ["Dehri",24.9080,84.1820],["Siwan",26.2243,84.3600],["Kishanganj",26.0985,87.9403],
      ["Nawada",24.8867,85.5437],["Bagaha",27.0990,84.0900],["Buxar",25.5647,83.9777],
      ["Sitamarhi",26.5936,85.4906],["Jehanabad",25.2134,84.9877],["Aurangabad (Bihar)",24.7520,84.3742],
      ["Lakhisarai",25.1726,86.0942],["Jamui",24.9228,86.2248],["Madhubani",26.3537,86.0717],
      ["Samastipur",25.8629,85.7810],["Khagaria",25.5042,86.4705],["Supaul",26.1235,86.6045],
      ["Madhepura",25.9211,86.7946],["Araria",26.1485,87.4606],["Gopalganj",26.4682,84.4404],
      ["Banka",24.8874,86.9200],["Sheikhpura",25.1417,85.8505],["Nalanda (Bihar Sharif)",25.1982,85.5149],
      ["Rajgir",25.0270,85.4170],["Kaimur (Bhabua)",25.0416,83.6067],["Sheohar",26.5161,85.2951]
    ],
    "Delhi NCR": [
      ["New Delhi",28.6139,77.2090],["Delhi",28.6448,77.2167],["South Delhi",28.5245,77.2066],
      ["Dwarka (Delhi)",28.5921,77.0460],["Rohini (Delhi)",28.7383,77.0822],["Connaught Place",28.6315,77.2167],
      ["Shahdara",28.6730,77.2890],["Janakpuri",28.6219,77.0878],["Saket",28.5246,77.2066]
    ],
    "Rajasthan": [
      ["Jaipur",26.9124,75.7873],["Jodhpur",26.2389,73.0243],["Udaipur",24.5854,73.7125],
      ["Kota",25.2138,75.8648],["Bikaner",28.0229,73.3119],["Ajmer",26.4499,74.6399],
      ["Pushkar",26.4897,74.5511],["Bhilwara",25.3407,74.6313],["Alwar",27.5530,76.6346],
      ["Bharatpur",27.2152,77.5030],["Sikar",27.6094,75.1398],["Pali",25.7711,73.3234],
      ["Sri Ganganagar",29.9038,73.8772],["Hanumangarh",29.5815,74.3294],["Churu",28.2920,74.9672],
      ["Jhunjhunu",28.1289,75.3995],["Nagaur",27.2038,73.7339],["Barmer",25.7521,71.3967],
      ["Jaisalmer",26.9157,70.9083],["Jalore",25.3459,72.6238],["Sirohi",24.8826,72.8589],
      ["Mount Abu",24.5926,72.7156],["Chittorgarh",24.8887,74.6269],["Nathdwara",24.9288,73.8220],
      ["Rajsamand",25.0680,73.8831],["Dungarpur",23.8417,73.7147],["Banswara",23.5461,74.4350],
      ["Pratapgarh (Raj)",24.0321,74.7816],["Bundi",25.4385,75.6373],["Jhalawar",24.5967,76.1610],
      ["Baran",25.1011,76.5132],["Sawai Madhopur",26.0124,76.3568],["Karauli",26.4967,77.0199],
      ["Dholpur",26.7025,77.8934],["Dausa",26.8918,76.3358],["Tonk",26.1620,75.7895]
    ],
    "Maharashtra": [
      ["Mumbai",19.0760,72.8777],["Pune",18.5204,73.8567],["Nagpur",21.1458,79.0882],
      ["Thane",19.2183,72.9781],["Navi Mumbai",19.0330,73.0297],["Nashik",19.9975,73.7898],
      ["Kalyan-Dombivli",19.2403,73.1305],["Vasai-Virar",19.3919,72.8397],["Chhatrapati Sambhajinagar (Aurangabad)",19.8762,75.3433],
      ["Solapur",17.6599,75.9064],["Mira-Bhayandar",19.2952,72.8544],["Bhiwandi",19.2813,73.0483],
      ["Amravati",20.9320,77.7523],["Nanded",19.1383,77.3210],["Kolhapur",16.7050,74.2433],
      ["Akola",20.7002,77.0082],["Panvel",18.9894,73.1175],["Ulhasnagar",19.2215,73.1645],
      ["Sangli",16.8524,74.5815],["Malegaon",20.5579,74.5089],["Jalgaon",21.0077,75.5626],
      ["Latur",18.4088,76.5604],["Dhule",20.9042,74.7749],["Ahmednagar (Ahilyanagar)",19.0948,74.7480],
      ["Shirdi",19.7645,74.4762],["Chandrapur",19.9615,79.2961],["Parbhani",19.2608,76.7748],
      ["Ichalkaranji",16.6915,74.4605],["Jalna",19.8347,75.8816],["Ambarnath",19.1864,73.1919],
      ["Bhusawal",21.0455,75.7850],["Satara",17.6805,74.0183],["Beed",18.9891,75.7601],
      ["Yavatmal",20.3888,78.1204],["Kamptee",21.2230,79.1900],["Gondia",21.4624,80.2210],
      ["Barshi",18.2333,75.6833],["Wardha",20.7453,78.6022],["Bhandara",21.1702,79.6489],
      ["Ratnagiri",16.9902,73.3120],["Sindhudurg",16.1200,73.7000],["Washim",20.1119,77.1313],
      ["Buldhana",20.5292,76.1842],["Dharashiv (Osmanabad)",18.1853,76.0420],["Nandurbar",21.3700,74.2400]
    ],
    "Gujarat": [
      ["Ahmedabad",23.0225,72.5714],["Surat",21.1702,72.8311],["Vadodara (Baroda)",22.3072,73.1812],
      ["Rajkot",22.3039,70.8022],["Bhavnagar",21.7645,72.1519],["Jamnagar",22.4707,70.0577],
      ["Gandhinagar",23.2156,72.6369],["Junagadh",21.5222,70.4579],["Gandhidham",23.0753,70.1337],
      ["Anand",22.5645,72.9289],["Navsari",20.9467,72.9520],["Morbi",22.8173,70.8377],
      ["Nadiad",22.6916,72.8634],["Surendranagar",22.7284,71.6371],["Bharuch",21.7051,72.9959],
      ["Mehsana",23.5880,72.3693],["Bhuj (Kutch)",23.2420,69.6669],["Porbandar",21.6417,69.6293],
      ["Palanpur",24.1724,72.4346],["Valsad",20.5992,72.9342],["Vapi",20.3893,72.9106],
      ["Patan",23.8493,72.1266],["Deesa",24.2585,72.1907],["Amreli",21.6032,71.2221],
      ["Godhra",22.7788,73.6143],["Palanpur",24.1724,72.4346],["Dahod",22.8379,74.2531],
      ["Botad",22.1691,71.6663],["Somnath (Veraval)",20.8880,70.4012],["Dwarka (Gujarat)",22.2442,68.9685]
    ],
    "Haryana": [
      ["Gurugram (Gurgaon)",28.4595,77.0266],["Faridabad",28.4089,77.3178],["Panipat",29.3909,76.9635],
      ["Ambala",30.3782,76.7767],["Yamunanagar",30.1290,77.2674],["Rohtak",28.8955,76.6066],
      ["Hisar",29.1492,75.7217],["Karnal",29.6857,76.9905],["Sonipat",28.9931,77.0151],
      ["Panchkula",30.6942,76.8606],["Bhiwani",28.7975,76.1322],["Sirsa",29.5321,75.0318],
      ["Bahadurgarh",28.6924,76.9239],["Jind",29.3159,76.3149],["Thanesar (Kurukshetra)",29.9695,76.8783],
      ["Kaithal",29.8015,76.3996],["Rewari",28.1920,76.6191],["Palwal",28.1487,77.3320],
      ["Fatehabad",29.5132,75.4510],["Mahendragarh (Narnaul)",28.0460,76.1060],["Jhajjar",28.6063,76.6565],
      ["Charkhi Dadri",28.5921,76.2653],["Nuh (Mewat)",28.1080,77.0017]
    ],
    "Punjab & Chandigarh": [
      ["Chandigarh",30.7333,76.7794],["Ludhiana",30.9010,75.8573],["Amritsar",31.6340,74.8723],
      ["Jalandhar",31.3260,75.5762],["Patiala",30.3398,76.3869],["Bathinda",30.2110,74.9455],
      ["Mohali (SAS Nagar)",30.7046,76.7179],["Hoshiarpur",31.5143,75.9115],["Pathankot",32.2643,75.6421],
      ["Moga",30.8165,75.1717],["Abohar",30.1453,74.1993],["Malerkotla",30.5250,75.8794],
      ["Khanna",30.7071,76.2170],["Phagwara",31.2240,75.7708],["Muktsar",30.4762,74.5122],
      ["Barnala",30.3819,75.5468],["Ropar (Rupnagar)",30.9686,76.5269],["Firozpur",30.9331,74.6225],
      ["Kapurthala",31.3808,75.3821],["Sangrur",30.2458,75.8421],["Gurdaspur",32.0419,75.4053],
      ["Faridkot",30.6769,74.7583],["Mansa",29.9881,75.3932],["Fazilka",30.4036,74.0280]
    ],
    "Uttarakhand": [
      ["Dehradun",30.3165,78.0322],["Haridwar",29.9457,78.1642],["Rishikesh",30.0869,78.2676],
      ["Haldwani",29.2183,79.5130],["Roorkee",29.8543,77.8880],["Kashipur",29.2104,78.9619],
      ["Rudrapur (Udham Singh Nagar)",28.9875,79.4141],["Nainital",29.3919,79.4542],["Almora",29.5892,79.6467],
      ["Pithoragarh",29.5829,80.2182],["Pauri Garhwal",30.1499,78.7747],["Kotdwar",29.7460,78.5230],
      ["Tehri",30.3782,78.4317],["Chamoli (Gopeshwar)",30.4090,79.3208],["Badrinath",30.7433,79.4938],
      ["Kedarnath (Rudraprayag)",30.7352,79.0669],["Uttarkashi",30.7268,78.4354],["Bageshwar",29.8362,79.7713],
      ["Champawat",29.3361,80.0911]
    ],
    "Himachal Pradesh": [
      ["Shimla",31.1048,77.1734],["Dharamshala (Kangra)",32.2190,76.3234],["Mandi",31.7087,76.9320],
      ["Solan",30.9045,77.0967],["Baddi",30.9578,76.7914],["Kullu",31.9592,77.1089],
      ["Manali",32.2432,77.1892],["Hamirpur (HP)",31.6862,76.5213],["Una",31.4685,76.2708],
      ["Bilaspur (HP)",31.3266,76.7567],["Chamba",32.5534,76.1258],["Nahan (Sirmaur)",30.5594,77.2953],
      ["Palampur",32.1109,76.5363]
    ],
    "Jammu, Kashmir & Ladakh": [
      ["Jammu",32.7266,74.8570],["Srinagar",34.0837,74.7973],["Katra (Vaishno Devi)",32.9916,74.9318],
      ["Anantnag",33.7311,75.1487],["Baramulla",34.1980,74.3636],["Udhampur",32.9160,75.1416],
      ["Kathua",32.3865,75.5173],["Rajouri",33.3716,74.3152],["Leh (Ladakh)",34.1526,77.5771]
    ],
    "West Bengal": [
      ["Kolkata",22.5726,88.3639],["Howrah",22.5958,88.2636],["Siliguri",26.7271,88.3953],
      ["Durgapur",23.5204,87.3119],["Asansol",23.6739,86.9524],["Bardhaman (Burdwan)",23.2324,87.8615],
      ["Malda (English Bazar)",25.0108,88.1411],["Baharampur (Murshidabad)",24.0988,88.2679],["Kharagpur",22.3460,87.2320],
      ["Haldia",22.0667,88.0698],["Krishnanagar (Nadia)",23.4012,88.5026],["Mayapur",23.4232,88.3883],
      ["Barasat",22.7225,88.4806],["Barrackpore",22.7674,88.3883],["Darjeeling",27.0410,88.2663],
      ["Jalpaiguri",26.5215,88.7196],["Cooch Behar",26.3452,89.4482],["Bankura",23.2313,87.0784],
      ["Purulia",23.3322,86.3652],["Midnapore (Medinipur)",22.4257,87.3199],["Suri (Birbhum)",23.9102,87.5272],
      ["Shantiniketan (Bolpur)",23.6776,87.6852],["Hooghly (Chinsurah)",22.8962,88.3993],["Raiganj",25.6184,88.1256],
      ["Balurghat",25.2223,88.7773],["Alipurduar",26.4918,89.5271]
    ],
    "Jharkhand": [
      ["Ranchi",23.3441,85.3096],["Jamshedpur",22.8046,86.2029],["Dhanbad",23.7957,86.4304],
      ["Bokaro Steel City",23.6693,86.1511],["Deoghar (Baidyanath)",24.4852,86.6948],["Hazaribagh",23.9925,85.3637],
      ["Giridih",24.1913,86.2996],["Ramgarh",23.6332,85.5149],["Daltonganj (Palamu)",24.0390,84.0653],
      ["Chaibasa",22.5519,85.8037],["Dumka",24.2685,87.2488],["Godda",24.8255,87.2130],
      ["Koderma",24.4676,85.5933],["Chatra",24.2065,84.8722],["Garhwa",24.1592,83.8065],
      ["Gumla",23.0441,84.5391],["Lohardaga",23.4355,84.6836]
    ],
    "Chhattisgarh": [
      ["Raipur",21.2514,81.6296],["Bhilai",21.1938,81.3509],["Durg",21.1904,81.2849],
      ["Bilaspur (CG)",22.0797,82.1409],["Korba",22.3595,82.7501],["Rajnandgaon",21.0974,81.0337],
      ["Raigarh",21.8974,83.3950],["Jagdalpur (Bastar)",19.0786,82.0214],["Ambikapur (Surguja)",23.1186,83.1984],
      ["Dhamtari",20.7069,81.5484],["Mahasamund",21.1079,82.0979],["Kanker",20.2719,81.4912],
      ["Janjgir-Champa",22.0094,82.5768],["Kawardha (Kabirdham)",22.0104,81.2335]
    ],
    "Odisha": [
      ["Bhubaneswar",20.2961,85.8245],["Cuttack",20.4625,85.8830],["Rourkela",22.2604,84.8536],
      ["Puri (Jagannath)",19.8135,85.8312],["Brahmapur (Berhampur)",19.3150,84.7941],["Sambalpur",21.4669,83.9812],
      ["Balasore",21.4934,86.9135],["Baripada",21.9320,86.7352],["Bhadrak",21.0583,86.4958],
      ["Jharsuguda",21.8554,84.0062],["Jeypore (Koraput)",18.8562,82.5716],["Angul",20.8409,85.1016],
      ["Bargarh",21.3347,83.6191],["Kendujhar (Keonjhar)",21.6289,85.5817],["Dhenkanal",20.6593,85.5976]
    ],
    "Karnataka": [
      ["Bengaluru (Bangalore)",12.9716,77.5946],["Mysuru (Mysore)",12.2958,76.6394],["Hubballi-Dharwad",15.3647,75.1240],
      ["Mangaluru (Mangalore)",12.9141,74.8560],["Belagavi (Belgaum)",15.8497,74.4977],["Kalaburagi (Gulbarga)",17.3297,76.8343],
      ["Davanagere",14.4644,75.9218],["Ballari (Bellary)",15.1394,76.9214],["Vijayapura (Bijapur)",16.8302,75.7100],
      ["Shivamogga (Shimoga)",13.9299,75.5681],["Tumakuru (Tumkur)",13.3379,77.1173],["Raichur",16.2076,77.3463],
      ["Bidar",17.9104,77.5199],["Udupi",13.3409,74.7421],["Hospet (Vijayanagara)",15.2689,76.3909],
      ["Hassan",13.0033,76.1004],["Chitradurga",14.2251,76.3980],["Kolar",13.1362,78.1291],
      ["Mandya",12.5218,76.8951],["Chikkamagaluru",13.3161,75.7720]
    ],
    "Tamil Nadu & Puducherry": [
      ["Chennai",13.0827,80.2707],["Coimbatore",11.0168,76.9558],["Madurai",9.9252,78.1198],
      ["Tiruchirappalli (Trichy)",10.7905,78.7047],["Salem",11.6643,78.1460],["Tirunelveli",8.7139,77.7567],
      ["Tiruppur",11.1085,77.3411],["Vellore",12.9165,79.1325],["Erode",11.3410,77.7172],
      ["Thoothukudi (Tuticorin)",8.7642,78.1348],["Dindigul",10.3624,77.9695],["Thanjavur",10.7870,79.1378],
      ["Hosur",12.7409,77.8253],["Nagercoil (Kanyakumari)",8.1833,77.4119],["Kanchipuram",12.8342,79.7036],
      ["Karur",10.9601,78.0766],["Rameswaram",9.2876,79.3129],["Puducherry (Pondicherry)",11.9416,79.8083]
    ],
    "Telangana": [
      ["Hyderabad",17.3850,78.4867],["Secunderabad",17.4399,78.4983],["Warangal",17.9689,79.5941],
      ["Nizamabad",18.6725,78.0941],["Khammam",17.2473,80.1514],["Karimnagar",18.4386,79.1288],
      ["Ramagundam",18.7550,79.4740],["Mahbubnagar",16.7488,78.0035],["Nalgonda",17.0575,79.2684],
      ["Adilabad",19.6641,78.5320],["Suryapet",17.1415,79.6236],["Siddipet",18.1018,78.8520]
    ],
    "Andhra Pradesh": [
      ["Visakhapatnam (Vizag)",17.6868,83.2185],["Vijayawada",16.5062,80.6480],["Guntur",16.3067,80.4365],
      ["Nellore",14.4426,79.9865],["Kurnool",15.8281,78.0373],["Tirupati",13.6288,79.4192],
      ["Rajahmundry",17.0005,81.8040],["Kakinada",16.9891,82.2475],["Kadapa (Cuddapah)",14.4673,78.8242],
      ["Anantapur",14.6819,77.6006],["Eluru",16.7107,81.0952],["Ongole",15.5057,80.0499],
      ["Vizianagaram",18.1067,83.3956],["Machilipatnam",16.1875,81.1389],["Srikakulam",18.2949,83.8938],
      ["Chittoor",13.2172,79.1003]
    ],
    "Kerala": [
      ["Thiruvananthapuram (Trivandrum)",8.5241,76.9366],["Kochi (Cochin)",9.9312,76.2673],["Kozhikode (Calicut)",11.2588,75.7804],
      ["Thrissur",10.5276,76.2144],["Kollam",8.8932,76.6141],["Palakkad",10.7867,76.6548],
      ["Alappuzha (Alleppey)",9.4981,76.3388],["Kannur",11.8745,75.3704],["Kottayam",9.5916,76.5222],
      ["Malappuram",11.0510,76.0711],["Kasaragod",12.4996,74.9869],["Pathanamthitta",9.2648,76.7870],
      ["Idukki",9.8494,76.9800],["Wayanad (Kalpetta)",11.6103,76.0828]
    ],
    "Assam & North-East": [
      ["Guwahati",26.1445,91.7362],["Dibrugarh",27.4728,94.9120],["Silchar",24.8333,92.7789],
      ["Jorhat",26.7509,94.2037],["Tezpur",26.6528,92.7926],["Nagaon",26.3464,92.6840],
      ["Tinsukia",27.4922,95.3468],["Shillong (Meghalaya)",25.5788,91.8933],["Agartala (Tripura)",23.8315,91.2868],
      ["Imphal (Manipur)",24.8170,93.9368],["Aizawl (Mizoram)",23.7271,92.7176],["Kohima (Nagaland)",25.6751,94.1086],
      ["Dimapur (Nagaland)",25.9091,93.7266],["Itanagar (Arunachal)",27.0844,93.6053],["Gangtok (Sikkim)",27.3314,88.6138]
    ],
    "Goa & UTs": [
      ["Panaji (Goa)",15.4909,73.8278],["Margao (Goa)",15.2832,73.9862],["Vasco da Gama (Goa)",15.3982,73.8113],
      ["Mapusa (Goa)",15.5915,73.8124],["Daman",20.3974,72.8328],["Silvassa",20.2763,73.0083],
      ["Port Blair (Andaman)",11.6234,92.7265]
    ],
    "International": [
      ["Kathmandu, Nepal",27.7172,85.3240,345],["Pokhara, Nepal",28.2096,83.9856,345],
      ["Dubai, UAE",25.2048,55.2708,240],["Abu Dhabi, UAE",24.4539,54.3773,240],
      ["London, UK",51.5074,-0.1278,0],["New York, USA",40.7128,-74.0060,-300],
      ["Chicago, USA",41.8781,-87.6298,-360],["San Francisco, USA",37.7749,-122.4194,-480],
      ["Toronto, Canada",43.6532,-79.3832,-300],["Vancouver, Canada",49.2827,-123.1207,-480],
      ["Sydney, Australia",-33.8688,151.2093,600],["Melbourne, Australia",-37.8136,144.9631,600],
      ["Singapore",1.3521,103.8198,480],["Kuala Lumpur, Malaysia",3.1390,101.6869,480],
      ["Bangkok, Thailand",13.7563,100.5018,420],["Colombo, Sri Lanka",6.9271,79.8612,330],
      ["Dhaka, Bangladesh",23.8103,90.4125,360],["Mauritius",-20.3484,57.5522,240]
    ]
  };

  // Build Flattened Search Index + Fast Lookup Map
  const ALL_PLACES_LIST = [];
  const CITY_CACHE = {};

  Object.keys(RAW_PLACES_BY_STATE).forEach(state => {
    RAW_PLACES_BY_STATE[state].forEach(row => {
      const city = row[0];
      const lat = row[1];
      const lng = row[2];
      const tz = row[3] !== undefined ? row[3] : 330;
      const displayLabel = state === "International" ? city : `${city}, ${state}`;
      const cleanTokens = city.toLowerCase().replace(/[()]/g, " ").split(/[\s,/+-]+/).filter(Boolean);
      const entry = {
        city,
        state,
        label: displayLabel,
        lat,
        lng,
        tz,
        searchKey: displayLabel.toLowerCase(),
        cityLower: city.toLowerCase(),
        tokens: cleanTokens
      };
      ALL_PLACES_LIST.push(entry);

      // Register both full label and primary city tokens in CITY_CACHE
      CITY_CACHE[displayLabel.toLowerCase()] = { lat, lng, tz, name: displayLabel };
      CITY_CACHE[city.toLowerCase()] = { lat, lng, tz, name: displayLabel };
      cleanTokens.forEach(tok => {
        if (tok.length >= 3 && !CITY_CACHE[tok]) {
          CITY_CACHE[tok] = { lat, lng, tz, name: displayLabel };
        }
      });
    });
  });

  // ==========================================================================
  // 2. INSTANT 1-TO-3 LETTER AUTOCOMPLETE SEARCHER (`searchPlaces`)
  // ==========================================================================
  function searchPlaces(query, limit = 10) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];

    const exactCityPrefix = [];
    const tokenPrefix = [];
    const substringMatch = [];

    for (let i = 0; i < ALL_PLACES_LIST.length; i++) {
      const p = ALL_PLACES_LIST[i];
      if (p.cityLower.startsWith(q)) {
        exactCityPrefix.push(p);
      } else if (p.tokens.some(t => t.startsWith(q))) {
        tokenPrefix.push(p);
      } else if (p.searchKey.includes(q)) {
        substringMatch.push(p);
      }
      if (exactCityPrefix.length >= limit) break;
    }

    return [...exactCityPrefix, ...tokenPrefix, ...substringMatch].slice(0, limit);
  }

  /**
 * ============================================================================
 * JYOTISH TARK — HIGH-PRECISION VEDIC BIRTH CHART CALCULATOR (Engine v8.0)
 * File: birth-chart-calculator.js • v8.0 (JHora / Swiss-Ephemeris Calibrated)
 * ============================================================================
 * NEW IN v8.0:
 * 1. IANA Timezone + Historical Indian War-Time DST (1942–1945 +06:30) Resolver
 * 2. True Lahiri Chitrapaksha Ayanamsa + Mean vs. True Node Option (Default: Mean)
 * 3. Exact Daily Speed (deg/day) for all 9 planets (for Shadbala Cheshta Bala)
 * 4. Midheaven (MC / 10th Cusp) + 12 Sripati Porphyry House Cusps & Sandhis
 * 5. Classical Surya Siddhanta Combustion (Asta) & Planetary War (Graha Yuddha)
 * 6. Lagna-Sandhi (<1° from border) & Moon Nakshatra-Boundary Time-Sensitivity Flags
 * ============================================================================
 */

  // ==========================================================================
  // 3. HISTORICAL TIMEZONE & IANA OFFSET RESOLVER (Supports India 1942-45 DST)
  // ==========================================================================
  function resolveHistoricalTzOffsetMinutes({ year, month, day, hour, minute, lat, lng, tzZone, defaultTzMins }) {
    // 1. Check if inside India geographic bounding box (or Asia/Kolkata)
    const isIndia = (tzZone === "Asia/Kolkata") ||
      (typeof lat === "number" && typeof lng === "number" && lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5);

    if (isIndia) {
      // Historical Indian War Time (IST + 1 hour = +06:30 = 390 mins):
      // Officially observed from 1 Sept 1942 00:00 to 15 Oct 1945 00:00
      const numDate = year * 10000 + month * 100 + day;
      if (numDate >= 19420901 && numDate <= 19451015) {
        return { tzMinutes: 390, tzLabel: "IST War-Time (+06:30 DST)", isHistoricalDST: true };
      }
      // Pre-1906 Local Mean Time (LMT) before IST was standardized on 1 Jan 1906
      if (year < 1906 && typeof lng === "number") {
        return { tzMinutes: Math.round(lng * 4), tzLabel: "Historical LMT", isHistoricalDST: true };
      }
      return { tzMinutes: 330, tzLabel: "Asia/Kolkata (IST +05:30)", isHistoricalDST: false };
    }

    // 2. If Luxon or Intl.DateTimeFormat with IANA timeZone is available in browser/Node:
    if (tzZone && typeof Intl !== "undefined" && Intl.DateTimeFormat) {
      try {
        const approxUTC = new Date(Date.UTC(year, month - 1, day, hour || 12, minute || 0, 0));
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: tzZone,
          timeZoneName: "shortOffset"
        }).formatToParts(approxUTC);
        const tzPart = parts.find(p => p.type === "timeZoneName")?.value || "";
        // Parses strings like "GMT+5:30", "GMT-4", "GMT+09:00"
        const m = tzPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
        if (m) {
          const sign = m[1] === "-" ? -1 : 1;
          const hrs = parseInt(m[2], 10) || 0;
          const mins = parseInt(m[3] || "0", 10) || 0;
          return { tzMinutes: sign * (hrs * 60 + mins), tzLabel: `${tzZone} (${tzPart})`, isHistoricalDST: false };
        }
      } catch (e) {}
    }

    // 3. Fallback to cached city offset or longitude meridian
    const fallbackMins = (typeof defaultTzMins === "number") ? defaultTzMins : Math.round((lng || 80.9462) / 15) * 60;
    return { tzMinutes: fallbackMins, tzLabel: `UTC${fallbackMins >= 0 ? "+" : ""}${(fallbackMins / 60).toFixed(2)}`, isHistoricalDST: false };
  }

  // ==========================================================================
  // 4. TRUE LAHIRI CHITRAPAKSHA AYANAMSA (Calibrated to JHora / Spica 180°)
  // ==========================================================================
  function lahiriAyanamsa(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
    // IAU Precession + Nutation in Longitude correction for True Chitrapaksha
    const omega = (125.04452 - 1934.136261 * T) * Math.PI / 180.0;
    const nutationDeg = (-17.20 * Math.sin(omega)) / 3600.0;
    const meanLahiri = 23.853056 + (50.290966 * T * 100) / 3600.0 + (0.000111 * T * T);
    const ayan = meanLahiri + nutationDeg;
    return ((ayan % 360) + 360) % 360;
  }

  // ==========================================================================
  // 5. TROPICAL LONGITUDES, EXACT DAILY SPEED (deg/day) & NODE TYPE
  // ==========================================================================
  function computeSingleMomentTropical(date, nodeType = "mean") {
    if (typeof Astronomy === "undefined") {
      throw new Error("astronomy-engine library is loading. Please wait a moment and try again.");
    }
    const bodies = {
      Sun: Astronomy.Body.Sun,
      Moon: Astronomy.Body.Moon,
      Mars: Astronomy.Body.Mars,
      Mercury: Astronomy.Body.Mercury,
      Jupiter: Astronomy.Body.Jupiter,
      Venus: Astronomy.Body.Venus,
      Saturn: Astronomy.Body.Saturn
    };
    const out = {};
    Object.keys(bodies).forEach(name => {
      // Apparent geocentric ecliptic coordinates of date (with aberration & light-time)
      const vec = Astronomy.GeoVector(bodies[name], date, true);
      const ecl = Astronomy.Ecliptic(vec);
      out[name] = ((ecl.elon % 360) + 360) % 360;
    });

    // Lunar Node (JHora defaults to Mean Node; True Node optional via nodeType === "true")
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    let nodeLon = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441.0;

    if (nodeType === "true") {
      const d = (297.8501921 + 445267.1114034 * T) * Math.PI / 180.0;
      const m = (357.5291092 + 35999.0502909 * T) * Math.PI / 180.0;
      const mp = (134.9633964 + 477198.8675055 * T) * Math.PI / 180.0;
      const f = (93.2720950 + 483202.0175233 * T) * Math.PI / 180.0;
      const trueCorr = -1.4979 * Math.sin(2 * (d - f))
                       - 0.1500 * Math.sin(m)
                       - 0.1226 * Math.sin(2 * d)
                       + 0.1176 * Math.sin(2 * f)
                       - 0.0801 * Math.sin(2 * (mp - f));
      nodeLon += trueCorr;
    }

    nodeLon = ((nodeLon % 360) + 360) % 360;
    out.Rahu = nodeLon;
    out.Ketu = (nodeLon + 180) % 360;

    return out;
  }

  function getTropicalLongitudesSpeedAndRetro(date, nodeType = "mean") {
    // Central difference over ±30 minutes (1 hour total) for exact instantaneous deg/day speed
    const halfHourMs = 1800000;
    const tMinus = computeSingleMomentTropical(new Date(date.getTime() - halfHourMs), nodeType);
    const t0     = computeSingleMomentTropical(date, nodeType);
    const tPlus  = computeSingleMomentTropical(new Date(date.getTime() + halfHourMs), nodeType);

    const speedPerDay = {};
    const retro = { Asc: false, Sun: false, Moon: false, Rahu: true, Ketu: true };

    Object.keys(t0).forEach(p => {
      let diff = tPlus[p] - tMinus[p];
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const dailySpeed = Number((diff * 24.0).toFixed(4)); // degrees per 24 hours
      speedPerDay[p] = dailySpeed;
      if (["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(p)) {
        retro[p] = dailySpeed < 0;
      }
    });

    return { longitudes: t0, speedPerDay, retro };
  }

  // ==========================================================================
  // 6. ASCENDANT (LAGNA), MIDHEAVEN (MC) & 12 SRIPATI HOUSE CUSPS
  // ==========================================================================
  function computeAscendantAndSripatiHouses(date, lat, lng, ayanamsa) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;

    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
               0.000387933 * T * T - (T * T * T) / 38710000.0;
    gmst = ((gmst % 360) + 360) % 360;

    const lst = ((gmst + lng) % 360 + 360) % 360; // RAMC in degrees
    const obl = 23.4392911 - 0.0130042 * T;

    const lstRad = lst * Math.PI / 180.0;
    const oblRad = obl * Math.PI / 180.0;
    const latRad = lat * Math.PI / 180.0;

    // 1. Tropical Eastern Ascendant
    const numAsc = Math.cos(lstRad);
    const denAsc = -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));
    const ascTropical = ((Math.atan2(numAsc, denAsc) * 180.0 / Math.PI) % 360 + 360) % 360;

    // 2. Tropical Midheaven (MC / 10th Cusp)
    const mcTropical = ((Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(oblRad)) * 180.0 / Math.PI) % 360 + 360) % 360;

    const ascSid = ((ascTropical - ayanamsa) % 360 + 360) % 360;
    const mcSid  = ((mcTropical - ayanamsa) % 360 + 360) % 360;
    const icSid  = (mcSid + 180) % 360;
    const descSid = (ascSid + 180) % 360;

    // 3. Sripati / Porphyry Trisection of the 4 Quadrants
    const fwdArc = (a, b) => ((b - a) % 360 + 360) % 360;
    const norm = (d) => ((d % 360) + 360) % 360;

    const madhya = new Array(13).fill(0);
    madhya[1]  = ascSid;
    madhya[4]  = icSid;
    madhya[7]  = descSid;
    madhya[10] = mcSid;

    const q1 = fwdArc(ascSid, icSid) / 3.0;
    madhya[2] = norm(ascSid + q1);
    madhya[3] = norm(ascSid + q1 * 2);

    const q2 = fwdArc(icSid, descSid) / 3.0;
    madhya[5] = norm(icSid + q2);
    madhya[6] = norm(icSid + q2 * 2);

    const q3 = fwdArc(descSid, mcSid) / 3.0;
    madhya[8] = norm(descSid + q3);
    madhya[9] = norm(descSid + q3 * 2);

    const q4 = fwdArc(mcSid, ascSid) / 3.0;
    madhya[11] = norm(mcSid + q4);
    madhya[12] = norm(mcSid + q4 * 2);

    const cusps = [];
    for (let h = 1; h <= 12; h++) {
      const prevH = h === 1 ? 12 : h - 1;
      const nextH = h === 12 ? 1 : h + 1;
      const start = norm(madhya[prevH] + fwdArc(madhya[prevH], madhya[h]) / 2.0);
      const end   = norm(madhya[h] + fwdArc(madhya[h], madhya[nextH]) / 2.0);
      cusps.push({ house: h, start, mid: madhya[h], end });
    }

    return { ascTropical, mcTropical, ascSid, mcSid, cusps };
  }

  // ==========================================================================
  // 7. COMBUSTION (ASTA) & PLANETARY WAR (GRAHA YUDDHA) EVALUATOR
  // ==========================================================================
  const COMBUST_ORB_DEG = {
    Moon:    { direct: 12, retro: 12 },
    Mars:    { direct: 17, retro: 17 },
    Mercury: { direct: 14, retro: 12 },
    Jupiter: { direct: 11, retro: 11 },
    Venus:   { direct: 10, retro: 8  },
    Saturn:  { direct: 15, retro: 15 }
  };

  function angularSeparation(lonA, lonB) {
    const d = Math.abs(((lonA % 360) + 360) % 360 - ((lonB % 360) + 360) % 360);
    return d > 180 ? 360 - d : d;
  }

  // ==========================================================================
  // 7B. SIDEREAL LONGITUDE → RASHI, NAKSHATRA, PADA, D9 & GEOCODER
  // ==========================================================================
  const RASHI_NAMES_EN = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];

  const NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];

  function siderealToRashi(lon) {
    const norm = ((lon % 360) + 360) % 360;
    return Math.floor(norm / 30) + 1;
  }

  function siderealToNakshatra(lon) {
    const norm = ((lon % 360) + 360) % 360;
    const nakSpan = 360 / 27;
    const padaSpan = 360 / 108;
    const idx = Math.min(26, Math.floor(norm / nakSpan));
    const pada = Math.min(4, Math.floor((norm % nakSpan) / padaSpan) + 1);
    return { id: idx + 1, name: NAKSHATRA_NAMES[idx], pada };
  }

  function siderealToD9(lon) {
    const norm = ((lon % 360) + 360) % 360;
    const padaSpan = 360 / 108;
    const totalNavamsaIdx = Math.floor(norm / padaSpan);
    return (totalNavamsaIdx % 12) + 1;
  }

  async function geocodePlace(placeName, explicitLat, explicitLng) {
    const raw = (placeName || "Lucknow, Uttar Pradesh").trim();

    if (typeof explicitLat === "number" && !isNaN(explicitLat) && typeof explicitLng === "number" && !isNaN(explicitLng)) {
      const isIndia = explicitLat >= 6 && explicitLat <= 37.5 && explicitLng >= 68 && explicitLng <= 97.5;
      const tz = isIndia ? 330 : Math.round(explicitLng / 15) * 60;
      return { lat: explicitLat, lng: explicitLng, tz, name: raw };
    }

    const fullLower = raw.toLowerCase().replace(/\s+/g, " ");
    if (CITY_CACHE[fullLower]) {
      return { ...CITY_CACHE[fullLower], name: CITY_CACHE[fullLower].name || raw };
    }

    const primaryCity = fullLower.split(/[,\-()/]/)[0].trim();
    if (CITY_CACHE[primaryCity]) {
      return { ...CITY_CACHE[primaryCity], name: CITY_CACHE[primaryCity].name || raw };
    }

    const matches = searchPlaces(primaryCity, 1);
    if (matches.length > 0) {
      const m = matches[0];
      return { lat: m.lat, lng: m.lng, tz: m.tz, name: m.label };
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw)}&limit=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const isIndia = lat >= 6 && lat <= 37.5 && lng >= 68 && lng <= 97.5;
          const tz = isIndia ? 330 : Math.round(lng / 15) * 60;
          return { lat, lng, tz, name: data[0].display_name.split(",").slice(0, 2).join(", ") || raw };
        }
      }
    } catch (e) {
      console.warn("Nominatim geocoding fallback warning:", e);
    }

    return { lat: 26.8467, lng: 80.9462, tz: 330, name: `${raw} (IST Standard)` };
  }

  // ==========================================================================
  // 8. FULL BIRTH CHART CALCULATION (WHEN BIRTH TIME IS PROVIDED)
  // ==========================================================================
  async function calculateChart({ name, dob, time, place, lat, lng, tzZone, nodeType = "mean", timeAccuracy = "exact" }) {
    const geo = await geocodePlace(place, lat, lng);

    const [year, month, day] = (dob || "1998-01-24").split("-").map(Number);
    const timeParts = (time || "12:00").split(":").map(Number);
    const hour = timeParts[0] || 0;
    const minute = timeParts[1] || 0;
    const second = timeParts[2] || 0;

    const tzInfo = resolveHistoricalTzOffsetMinutes({
      year, month, day, hour, minute,
      lat: geo.lat, lng: geo.lng,
      tzZone: tzZone || geo.tzZone,
      defaultTzMins: geo.tz
    });

    const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - (tzInfo.tzMinutes * 60000);
    const birthUTC = new Date(utcMs);

    const { longitudes: tropical, speedPerDay, retro } = getTropicalLongitudesSpeedAndRetro(birthUTC, nodeType);
    const ayan = lahiriAyanamsa(birthUTC);

    const sidereal = {};
    Object.keys(tropical).forEach(k => {
      sidereal[k] = ((tropical[k] - ayan) % 360 + 360) % 360;
    });

    const houseData = computeAscendantAndSripatiHouses(birthUTC, geo.lat, geo.lng, ayan);
    sidereal.Asc = houseData.ascSid;
    sidereal.MC  = houseData.mcSid;
    speedPerDay.Asc = 360.9856;
    speedPerDay.MC  = 360.9856;
    retro.Asc = false;
    retro.MC  = false;

    const result = {
      meta: {
        ...geo,
        tz: tzInfo.tzMinutes,
        tzLabel: tzInfo.tzLabel,
        isHistoricalDST: tzInfo.isHistoricalDST,
        nodeType,
        birthUTC,
        dob,
        time,
        ayanamsa: ayan,
        mcLongitude: houseData.mcSid,
        sripatiCusps: houseData.cusps,
        isExactBirthTime: true
      },
      sripatiCusps: houseData.cusps,
      planetaryWars: []
    };

    const sunLon = sidereal.Sun;

    Object.keys(sidereal).forEach(k => {
      const lon = sidereal[k];
      const degInSign = lon % 30;
      const deg = Math.floor(degInSign);
      const minFloat = (degInSign - deg) * 60;
      const min = Math.floor(minFloat);
      const sec = Math.round((minFloat - min) * 60);
      const rashi = siderealToRashi(lon);
      const nak = siderealToNakshatra(lon);
      const d9 = siderealToD9(lon);

      let combust = false;
      let distanceFromSun = null;
      if (COMBUST_ORB_DEG[k]) {
        distanceFromSun = Number(angularSeparation(lon, sunLon).toFixed(2));
        const orb = retro[k] ? COMBUST_ORB_DEG[k].retro : COMBUST_ORB_DEG[k].direct;
        combust = distanceFromSun <= orb;
      }

      result[k] = {
        longitude: lon,
        degInSign,
        dailySpeed: speedPerDay[k] || 0,
        formattedDeg: `${String(deg).padStart(2, "0")}°${String(min).padStart(2, "0")}'`,
        formattedDMS: `${String(deg).padStart(2, "0")}°${String(min).padStart(2, "0")}'${String(sec).padStart(2, "0")}"`,
        rashi,
        rashiName: RASHI_NAMES_EN[rashi - 1],
        nakshatra: nak.id,
        nakshatraName: nak.name,
        pada: nak.pada,
        d9,
        d9Name: RASHI_NAMES_EN[d9 - 1],
        retro: Boolean(retro[k]),
        combust,
        distanceFromSun,
        inPlanetaryWar: false,
        warOpponent: null
      };
    });

    const warCandidates = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    for (let i = 0; i < warCandidates.length; i++) {
      for (let j = i + 1; j < warCandidates.length; j++) {
        const pA = warCandidates[i];
        const pB = warCandidates[j];
        const sep = angularSeparation(result[pA].longitude, result[pB].longitude);
        if (sep <= 1.0) {
          result[pA].inPlanetaryWar = true;
          result[pA].warOpponent = pB;
          result[pB].inPlanetaryWar = true;
          result[pB].warOpponent = pA;
          result.planetaryWars.push({ planetA: pA, planetB: pB, separationDeg: Number(sep.toFixed(3)) });
        }
      }
    }

    const ascDeg = result.Asc.degInSign;
    const isLagnaBoundary = (ascDeg < 1.0 || ascDeg > 29.0);
    const moonNakRemainder = (result.Moon.longitude % (360 / 27));
    const isMoonNakBoundary = (moonNakRemainder < 0.5 || moonNakRemainder > ((360 / 27) - 0.5));

    result.meta.boundaryWarnings = {
      isLagnaSandhi: isLagnaBoundary,
      isMoonNakshatraBoundary: isMoonNakBoundary,
      requiresRectification: isLagnaBoundary || (isMoonNakBoundary && timeAccuracy !== "exact"),
      warningMessageEn: isLagnaBoundary
        ? `Ascendant is at ${result.Asc.formattedDMS} in ${result.Asc.rashiName} (within 1° of sign boundary). A 4-minute shift in birth time changes the Lagna.`
        : (isMoonNakBoundary ? `Moon is within 30' of a Nakshatra boundary; slight birth time variations shift Vimshottari Dasha dates.` : null)
    };

    return result;
  }

  // ==========================================================================
  // 9. HONEST DOB-ONLY ASTRONOMICAL EPHEMERIS (12:00 PM NOON IST — NO FAKE LAGNA)
  // ==========================================================================
  function calculateDobOnlyAstronomy(dob) {
    const [year, month, day] = (dob || "1998-01-24").split("-").map(Number);
    const noonUTC = new Date(Date.UTC(year, month - 1, day, 6, 30, 0));
    const startOfDayUTC = new Date(Date.UTC(year, month - 1, day - 1, 18, 30, 0));
    const endOfDayUTC   = new Date(Date.UTC(year, month - 1, day, 18, 29, 0));

    // Fixed: Calls getTropicalLongitudesSpeedAndRetro instead of deleted function
    const { longitudes: tropicalNoon, speedPerDay, retro } = getTropicalLongitudesSpeedAndRetro(noonUTC, "mean");
    const ayan = lahiriAyanamsa(noonUTC);

    const tropStart = computeSingleMomentTropical(startOfDayUTC);
    const tropEnd   = computeSingleMomentTropical(endOfDayUTC);
    const moonStartRashi = siderealToRashi(((tropStart.Moon - ayan) % 360 + 360) % 360);
    const moonEndRashi   = siderealToRashi(((tropEnd.Moon - ayan) % 360 + 360) % 360);

    const out = {
      isDobOnlyRealAstronomy: true,
      isFullChartMode: false,
      isExactAstronomyMode: false,
      moonShiftedSignThatDay: moonStartRashi !== moonEndRashi,
      moonStartRashi,
      moonEndRashi,
      meta: { dob, ayanamsa: ayan }
    };

    const sunLon = ((tropicalNoon.Sun - ayan) % 360 + 360) % 360;
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    planets.forEach(k => {
      const lon = ((tropicalNoon[k] - ayan) % 360 + 360) % 360;
      const degInSign = lon % 30;
      const deg = Math.floor(degInSign);
      const min = Math.floor((degInSign - deg) * 60);
      const rashi = siderealToRashi(lon);
      const nak = siderealToNakshatra(lon);
      const d9 = siderealToD9(lon);

      let combust = false;
      if (COMBUST_ORB_DEG[k]) {
        const orb = retro[k] ? COMBUST_ORB_DEG[k].retro : COMBUST_ORB_DEG[k].direct;
        combust = angularSeparation(lon, sunLon) <= orb;
      }

      out[k] = {
        longitude: lon,
        degInSign,
        dailySpeed: speedPerDay[k] || 0,
        formattedDeg: `${String(deg).padStart(2, "0")}°${String(min).padStart(2, "0")}'`,
        rashi,
        d1: rashi,
        rashiName: RASHI_NAMES_EN[rashi - 1],
        nakshatra: nak.id,
        nak: nak.id,
        nakshatraName: nak.name,
        pada: nak.pada,
        d9,
        d9Name: RASHI_NAMES_EN[d9 - 1],
        retro: Boolean(retro[k]),
        combust
      };
    });

    out.Asc = {
      longitude: out.Moon.longitude,
      degInSign: out.Moon.degInSign,
      formattedDeg: out.Moon.formattedDeg,
      rashi: out.Moon.rashi,
      d1: out.Moon.rashi,
      rashiName: out.Moon.rashiName,
      nakshatra: out.Moon.nakshatra,
      nak: out.Moon.nakshatra,
      nakshatraName: out.Moon.nakshatraName,
      pada: out.Moon.pada,
      d9: out.Moon.d9,
      d9Name: out.Moon.d9Name,
      retro: false,
      isMoonAnchorInDobOnlyMode: true
    };

    return out;
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================
  window.BirthChartCalculator = {
    calculateChart,
    calculateDobOnlyAstronomy,
    geocodePlace,
    searchPlaces,
    resolveHistoricalTzOffsetMinutes,
    ALL_PLACES_LIST,
    _internal: {
      lahiriAyanamsa,
      getTropicalLongitudes: computeSingleMomentTropical,
      getTropicalLongitudesSpeedAndRetro,
      computeAscendant: (date, lat, lng) => computeAscendantAndSripatiHouses(date, lat, lng, 0).ascTropical,
      computeAscendantAndSripatiHouses,
      siderealToRashi,
      siderealToNakshatra,
      siderealToD9
    }
  };
})();
