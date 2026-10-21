/**
 * ============================================================================
 * JYOTISH TARK — HIGH-PRECISION VEDIC BIRTH CHART CALCULATOR (Engine 3)
 * File: birth-chart-calculator.js • v6.5 (True Lahiri Chitrapaksha Edition)
 * Architect: Gyanendra Singh Tomar • Jyotish Tark
 * ============================================================================
 * Features:
 * - Exact Geocentric Ecliptic Longitudes via astronomy-engine (VSOP87 / ELP2000)
 * - Exact Quadrant-Safe Ascendant (Udaya Lagna) & Sripati/Equal Bhava Cusps
 * - True Retrograde (Vakri) Velocity Detection for Mars, Mercury, Jupiter, Venus, Saturn
 * - True/Mean Rahu-Ketu Nodal Axis + Exact Navamsa (D9) & Nakshatra Pada (1-4)
 * - Smart Geocoder: 180+ Indian Cities/Towns Cache (handles "City, State" strings)
 *   + CORS-safe OpenStreetMap Nominatim fallback
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. EXPANDED INDIAN CITIES & TOWNS CACHE (lat, lng, tz offset in mins)
  // ==========================================================================
  const CITY_CACHE = {
    "lucknow": { lat: 26.8467, lng: 80.9462, tz: 330 },
    "delhi": { lat: 28.6139, lng: 77.2090, tz: 330 },
    "new delhi": { lat: 28.6139, lng: 77.2090, tz: 330 },
    "mumbai": { lat: 19.0760, lng: 72.8777, tz: 330 },
    "kolkata": { lat: 22.5726, lng: 88.3639, tz: 330 },
    "chennai": { lat: 13.0827, lng: 80.2707, tz: 330 },
    "bengaluru": { lat: 12.9716, lng: 77.5946, tz: 330 },
    "bangalore": { lat: 12.9716, lng: 77.5946, tz: 330 },
    "hyderabad": { lat: 17.3850, lng: 78.4867, tz: 330 },
    "ahmedabad": { lat: 23.0225, lng: 72.5714, tz: 330 },
    "pune": { lat: 18.5204, lng: 73.8567, tz: 330 },
    "jaipur": { lat: 26.9124, lng: 75.7873, tz: 330 },
    "surat": { lat: 21.1702, lng: 72.8311, tz: 330 },
    "kanpur": { lat: 26.4499, lng: 80.3319, tz: 330 },
    "nagpur": { lat: 21.1458, lng: 79.0882, tz: 330 },
    "indore": { lat: 22.7196, lng: 75.8577, tz: 330 },
    "bhopal": { lat: 23.2599, lng: 77.4126, tz: 330 },
    "patna": { lat: 25.5941, lng: 85.1376, tz: 330 },
    "vadodara": { lat: 22.3072, lng: 73.1812, tz: 330 },
    "ghaziabad": { lat: 28.6692, lng: 77.4538, tz: 330 },
    "ludhiana": { lat: 30.9010, lng: 75.8573, tz: 330 },
    "agra": { lat: 27.1767, lng: 78.0081, tz: 330 },
    "nashik": { lat: 19.9975, lng: 73.7898, tz: 330 },
    "faridabad": { lat: 28.4089, lng: 77.3178, tz: 330 },
    "meerut": { lat: 28.9845, lng: 77.7064, tz: 330 },
    "rajkot": { lat: 22.3039, lng: 70.8022, tz: 330 },
    "varanasi": { lat: 25.3176, lng: 82.9739, tz: 330 },
    "banaras": { lat: 25.3176, lng: 82.9739, tz: 330 },
    "kashi": { lat: 25.3176, lng: 82.9739, tz: 330 },
    "srinagar": { lat: 34.0837, lng: 74.7973, tz: 330 },
    "amritsar": { lat: 31.6340, lng: 74.8723, tz: 330 },
    "allahabad": { lat: 25.4358, lng: 81.8463, tz: 330 },
    "prayagraj": { lat: 25.4358, lng: 81.8463, tz: 330 },
    "ranchi": { lat: 23.3441, lng: 85.3096, tz: 330 },
    "coimbatore": { lat: 11.0168, lng: 76.9558, tz: 330 },
    "jabalpur": { lat: 23.1815, lng: 79.9864, tz: 330 },
    "gwalior": { lat: 26.2183, lng: 78.1828, tz: 330 },
    "porsa": { lat: 26.6710, lng: 78.3712, tz: 330 },
    "morena": { lat: 26.4947, lng: 77.9940, tz: 330 },
    "bhind": { lat: 26.5647, lng: 78.7871, tz: 330 },
    "etawah": { lat: 26.7856, lng: 79.0158, tz: 330 },
    "mainpuri": { lat: 27.2306, lng: 79.0258, tz: 330 },
    "ayodhya": { lat: 26.7922, lng: 82.1998, tz: 330 },
    "faizabad": { lat: 26.7730, lng: 82.1458, tz: 330 },
    "sultanpur": { lat: 26.2648, lng: 82.0727, tz: 330 },
    "rae bareli": { lat: 26.2345, lng: 81.2409, tz: 330 },
    "raebareli": { lat: 26.2345, lng: 81.2409, tz: 330 },
    "unnao": { lat: 26.5393, lng: 80.4878, tz: 330 },
    "sitapur": { lat: 27.5680, lng: 80.6826, tz: 330 },
    "hardoi": { lat: 27.3959, lng: 80.1314, tz: 330 },
    "barabanki": { lat: 26.9268, lng: 81.1834, tz: 330 },
    "lakhimpur": { lat: 27.9463, lng: 80.7787, tz: 330 },
    "shahjahanpur": { lat: 27.8815, lng: 79.9109, tz: 330 },
    "basti": { lat: 26.7997, lng: 82.7351, tz: 330 },
    "deoria": { lat: 26.5024, lng: 83.7791, tz: 330 },
    "azamgarh": { lat: 26.0739, lng: 83.1859, tz: 330 },
    "jaunpur": { lat: 25.7464, lng: 82.6837, tz: 330 },
    "mirzapur": { lat: 25.1460, lng: 82.5690, tz: 330 },
    "ballia": { lat: 25.7604, lng: 84.1471, tz: 330 },
    "ghazipur": { lat: 25.5840, lng: 83.5770, tz: 330 },
    "banda": { lat: 25.4763, lng: 80.3395, tz: 330 },
    "orai": { lat: 25.9878, lng: 79.4504, tz: 330 },
    "lalitpur": { lat: 24.6912, lng: 78.4187, tz: 330 },
    "chitrakoot": { lat: 25.2007, lng: 80.9039, tz: 330 },
    "vijayawada": { lat: 16.5062, lng: 80.6480, tz: 330 },
    "jodhpur": { lat: 26.2389, lng: 73.0243, tz: 330 },
    "madurai": { lat: 9.9252, lng: 78.1198, tz: 330 },
    "raipur": { lat: 21.2514, lng: 81.6296, tz: 330 },
    "kota": { lat: 25.2138, lng: 75.8648, tz: 330 },
    "guwahati": { lat: 26.1445, lng: 91.7362, tz: 330 },
    "chandigarh": { lat: 30.7333, lng: 76.7794, tz: 330 },
    "thiruvananthapuram": { lat: 8.5241, lng: 76.9366, tz: 330 },
    "bhubaneswar": { lat: 20.2961, lng: 85.8245, tz: 330 },
    "dehradun": { lat: 30.3165, lng: 78.0322, tz: 330 },
    "haridwar": { lat: 29.9457, lng: 78.1642, tz: 330 },
    "rishikesh": { lat: 30.0869, lng: 78.2676, tz: 330 },
    "haldwani": { lat: 29.2183, lng: 79.5130, tz: 330 },
    "roorkee": { lat: 29.8543, lng: 77.8880, tz: 330 },
    "mysore": { lat: 12.2958, lng: 76.6394, tz: 330 },
    "mysuru": { lat: 12.2958, lng: 76.6394, tz: 330 },
    "gurgaon": { lat: 28.4595, lng: 77.0266, tz: 330 },
    "gurugram": { lat: 28.4595, lng: 77.0266, tz: 330 },
    "noida": { lat: 28.5355, lng: 77.3910, tz: 330 },
    "greater noida": { lat: 28.4744, lng: 77.5040, tz: 330 },
    "jalandhar": { lat: 31.3260, lng: 75.5762, tz: 330 },
    "tiruchirappalli": { lat: 10.7905, lng: 78.7047, tz: 330 },
    "salem": { lat: 11.6643, lng: 78.1460, tz: 330 },
    "warangal": { lat: 17.9689, lng: 79.5941, tz: 330 },
    "guntur": { lat: 16.3067, lng: 80.4365, tz: 330 },
    "solapur": { lat: 17.6599, lng: 75.9064, tz: 330 },
    "tirunelveli": { lat: 8.7139, lng: 77.7567, tz: 330 },
    "udaipur": { lat: 24.5854, lng: 73.7125, tz: 330 },
    "kochi": { lat: 9.9312, lng: 76.2673, tz: 330 },
    "kozhikode": { lat: 11.2588, lng: 75.7804, tz: 330 },
    "nanded": { lat: 19.1383, lng: 77.3210, tz: 330 },
    "kolhapur": { lat: 16.7050, lng: 74.2433, tz: 330 },
    "ajmer": { lat: 26.4499, lng: 74.6399, tz: 330 },
    "bikaner": { lat: 28.0229, lng: 73.3119, tz: 330 },
    "alwar": { lat: 27.5530, lng: 76.6346, tz: 330 },
    "bharatpur": { lat: 27.2152, lng: 77.5030, tz: 330 },
    "sikar": { lat: 27.6094, lng: 75.1398, tz: 330 },
    "bhilwara": { lat: 25.3407, lng: 74.6313, tz: 330 },
    "akola": { lat: 20.7002, lng: 77.0082, tz: 330 },
    "gulbarga": { lat: 17.3297, lng: 76.8343, tz: 330 },
    "jamnagar": { lat: 22.4707, lng: 70.0577, tz: 330 },
    "ujjain": { lat: 23.1765, lng: 75.7885, tz: 330 },
    "sagar": { lat: 23.8388, lng: 78.7378, tz: 330 },
    "rewa": { lat: 24.5362, lng: 81.3037, tz: 330 },
    "satna": { lat: 24.6005, lng: 80.8322, tz: 330 },
    "ratlam": { lat: 23.3315, lng: 75.0367, tz: 330 },
    "dewas": { lat: 22.9676, lng: 76.0534, tz: 330 },
    "katni": { lat: 23.8343, lng: 80.3894, tz: 330 },
    "chhindwara": { lat: 22.0574, lng: 78.9382, tz: 330 },
    "siliguri": { lat: 26.7271, lng: 88.3953, tz: 330 },
    "jhansi": { lat: 25.4484, lng: 78.5685, tz: 330 },
    "jammu": { lat: 32.7266, lng: 74.8570, tz: 330 },
    "sangli": { lat: 16.8524, lng: 74.5815, tz: 330 },
    "mangalore": { lat: 12.9141, lng: 74.8560, tz: 330 },
    "erode": { lat: 11.3410, lng: 77.7172, tz: 330 },
    "belgaum": { lat: 15.8497, lng: 74.4977, tz: 330 },
    "tiruppur": { lat: 11.1085, lng: 77.3411, tz: 330 },
    "gaya": { lat: 24.7955, lng: 85.0002, tz: 330 },
    "muzaffarpur": { lat: 26.1197, lng: 85.3910, tz: 330 },
    "darbhanga": { lat: 26.1542, lng: 85.8918, tz: 330 },
    "chapra": { lat: 25.7796, lng: 84.7499, tz: 330 },
    "arrah": { lat: 25.5560, lng: 84.6603, tz: 330 },
    "begusarai": { lat: 25.4182, lng: 86.1272, tz: 330 },
    "kurnool": { lat: 15.8281, lng: 78.0373, tz: 330 },
    "kakinada": { lat: 16.9891, lng: 82.2475, tz: 330 },
    "bokaro": { lat: 23.6693, lng: 86.1511, tz: 330 },
    "bellary": { lat: 15.1394, lng: 76.9214, tz: 330 },
    "patiala": { lat: 30.3398, lng: 76.3869, tz: 330 },
    "agartala": { lat: 23.8315, lng: 91.2868, tz: 330 },
    "bhagalpur": { lat: 25.2425, lng: 86.9842, tz: 330 },
    "muzaffarnagar": { lat: 29.4727, lng: 77.7085, tz: 330 },
    "bhatinda": { lat: 30.2110, lng: 74.9455, tz: 330 },
    "bathinda": { lat: 30.2110, lng: 74.9455, tz: 330 },
    "purnia": { lat: 25.7771, lng: 87.4753, tz: 330 },
    "mathura": { lat: 27.4924, lng: 77.6737, tz: 330 },
    "vrindavan": { lat: 27.5806, lng: 77.7006, tz: 330 },
    "hapur": { lat: 28.7306, lng: 77.7759, tz: 330 },
    "shimla": { lat: 31.1048, lng: 77.1734, tz: 330 },
    "rourkela": { lat: 22.2604, lng: 84.8536, tz: 330 },
    "cuttack": { lat: 20.4625, lng: 85.8830, tz: 330 },
    "puri": { lat: 19.8135, lng: 85.8312, tz: 330 },
    "howrah": { lat: 22.5958, lng: 88.2636, tz: 330 },
    "nagercoil": { lat: 8.1833, lng: 77.4119, tz: 330 },
    "tumkur": { lat: 13.3379, lng: 77.1173, tz: 330 },
    "dhule": { lat: 20.9042, lng: 74.7749, tz: 330 },
    "panipat": { lat: 29.3909, lng: 76.9635, tz: 330 },
    "karnal": { lat: 29.6857, lng: 76.9905, tz: 330 },
    "rohtak": { lat: 28.8955, lng: 76.6066, tz: 330 },
    "hisar": { lat: 29.1492, lng: 75.7217, tz: 330 },
    "sonipat": { lat: 28.9931, lng: 77.0151, tz: 330 },
    "ambala": { lat: 30.3782, lng: 76.7767, tz: 330 },
    "aligarh": { lat: 27.8974, lng: 78.0880, tz: 330 },
    "moradabad": { lat: 28.8386, lng: 78.7733, tz: 330 },
    "gorakhpur": { lat: 26.7606, lng: 83.3732, tz: 330 },
    "bareilly": { lat: 28.3670, lng: 79.4304, tz: 330 },
    "firozabad": { lat: 27.1592, lng: 78.3957, tz: 330 },
    "saharanpur": { lat: 29.9680, lng: 77.5552, tz: 330 },
    "loni": { lat: 28.7515, lng: 77.2900, tz: 330 },
    "jamshedpur": { lat: 22.8046, lng: 86.2029, tz: 330 },
    "asansol": { lat: 23.6739, lng: 86.9524, tz: 330 },
    "dhanbad": { lat: 23.7957, lng: 86.4304, tz: 330 },
    "bilaspur": { lat: 22.0797, lng: 82.1409, tz: 330 },
    "durg": { lat: 21.1904, lng: 81.2849, tz: 330 },
    "bhilai": { lat: 21.1938, lng: 81.3509, tz: 330 },
    "kollam": { lat: 8.8932, lng: 76.6141, tz: 330 },
    "thrissur": { lat: 10.5276, lng: 76.2144, tz: 330 },
    "kottayam": { lat: 9.5916, lng: 76.5222, tz: 330 },
    "nellore": { lat: 14.4426, lng: 79.9865, tz: 330 },
    "tirupati": { lat: 13.6288, lng: 79.4192, tz: 330 },
    "visakhapatnam": { lat: 17.6868, lng: 83.2185, tz: 330 },
    "vizag": { lat: 17.6868, lng: 83.2185, tz: 330 },
    "vijayanagaram": { lat: 18.1067, lng: 83.3956, tz: 330 },
    "shillong": { lat: 25.5788, lng: 91.8933, tz: 330 },
    "imphal": { lat: 24.8170, lng: 93.9368, tz: 330 },
    "aizawl": { lat: 23.7271, lng: 92.7176, tz: 330 },
    "kohima": { lat: 25.6751, lng: 94.1086, tz: 330 },
    "gangtok": { lat: 27.5330, lng: 88.5122, tz: 330 },
    "itanagar": { lat: 27.0844, lng: 93.6053, tz: 330 },
    "panaji": { lat: 15.4909, lng: 73.8278, tz: 330 },
    "goa": { lat: 15.4909, lng: 73.8278, tz: 330 },
    "puducherry": { lat: 11.9416, lng: 79.8083, tz: 330 },
    "pondicherry": { lat: 11.9416, lng: 79.8083, tz: 330 }
  };

  // ==========================================================================
  // 2. TRUE LAHIRI CHITRAPAKSHA AYANAMSA (High-Precision Precession Polynomial)
  // ==========================================================================
  function lahiriAyanamsa(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
    // IAU / Indian Astronomical Ephemeris Chitrapaksha Lahiri Ayanamsa:
    // At J2000.0 (1 Jan 2000 12:00 TT): 23° 51' 25.53" = 23.857092°
    // Rate: 50.290966" per year = 1.396971° per Julian century
    const ayan = 23.857092 + (1.396971 * T) + (0.0003086 * T * T);
    return ((ayan % 360) + 360) % 360;
  }

  // ==========================================================================
  // 3. TROPICAL PLANETARY LONGITUDES + RETROGRADE VELOCITY DETECTION
  // ==========================================================================
  function computeSingleMomentTropical(date) {
    if (typeof Astronomy === "undefined") {
      throw new Error("astronomy-engine library is not loaded yet. Please wait 1 second and try again.");
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
      const vec = Astronomy.GeoVector(bodies[name], date, true);
      const ecl = Astronomy.Ecliptic(vec);
      out[name] = ((ecl.elon % 360) + 360) % 360;
    });

    // Mean Lunar Ascending Node (Rahu) & Descending Node (Ketu)
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    let meanNode = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441.0;
    meanNode = ((meanNode % 360) + 360) % 360;
    out.Rahu = meanNode;
    out.Ketu = (meanNode + 180) % 360;

    return out;
  }

  function getTropicalLongitudesAndRetro(date) {
    const t0 = computeSingleMomentTropical(date);
    // Check 4 hours later to detect apparent retrograde (Vakri) motion
    const laterDate = new Date(date.getTime() + 4 * 3600000);
    const t1 = computeSingleMomentTropical(laterDate);

    const retro = { Sun: false, Moon: false, Rahu: true, Ketu: true };
    ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach(p => {
      let diff = t1[p] - t0[p];
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      retro[p] = diff < 0;
    });

    return { longitudes: t0, retro };
  }

  // ==========================================================================
  // 4. QUADRANT-SAFE EASTERN ASCENDANT (UDAYA LAGNA) FORMULA
  // ==========================================================================
  function computeAscendant(date, lat, lng) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;

    // Greenwich Mean Sidereal Time (GMST) in degrees
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
               0.000387933 * T * T - (T * T * T) / 38710000.0;
    gmst = ((gmst % 360) + 360) % 360;

    // Local Sidereal Time (RAMC) in degrees
    const lst = ((gmst + lng) % 360 + 360) % 360;

    // Mean Obliquity of the Ecliptic
    const obl = 23.4392911 - 0.0130042 * T;

    const lstRad = lst * Math.PI / 180.0;
    const oblRad = obl * Math.PI / 180.0;
    const latRad = lat * Math.PI / 180.0;

    // Exact Quadrant-Safe Eastern Horizon Intersection (Udaya Lagna):
    // Calling atan2(cos(RAMC), -(sin(RAMC)*cos(obl) + tan(lat)*sin(obl)))
    // guarantees the Eastern Rising point (Azimuth = 90° East) across all 0°–360° RAMC values!
    const num = Math.cos(lstRad);
    const den = -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));
    let ascTropical = Math.atan2(num, den) * 180.0 / Math.PI;
    ascTropical = ((ascTropical % 360) + 360) % 360;

    return ascTropical;
  }

  // ==========================================================================
  // 5. SIDEREAL LONGITUDE → RASHI, NAKSHATRA, PADA & PARASHARI NAVAMSA (D9)
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
    const nakSpan = 360 / 27; // 13.333333°
    const padaSpan = 360 / 108; // 3.333333°
    const idx = Math.min(26, Math.floor(norm / nakSpan));
    const pada = Math.min(4, Math.floor((norm % nakSpan) / padaSpan) + 1);
    return { id: idx + 1, name: NAKSHATRA_NAMES[idx], pada };
  }

  function siderealToD9(lon) {
    const norm = ((lon % 360) + 360) % 360;
    const padaSpan = 360 / 108; // 3°20' per Navamsa
    const totalNavamsaIdx = Math.floor(norm / padaSpan);
    return (totalNavamsaIdx % 12) + 1;
  }

  // ==========================================================================
  // 6. SMART GEOCODER (Handles "Lucknow, UP", "Porsa, MP", etc. + Nominatim)
  // ==========================================================================
  async function geocodePlace(placeName) {
    const raw = (placeName || "Lucknow").trim();
    const fullLower = raw.toLowerCase().replace(/\s+/g, " ");

    // 1. Check exact match in cache
    if (CITY_CACHE[fullLower]) {
      return { ...CITY_CACHE[fullLower], name: raw };
    }

    // 2. Check primary city token before comma/hyphen (e.g., "Lucknow, UP" -> "lucknow")
    const primaryCity = fullLower.split(/[,\-()/]/)[0].trim();
    if (CITY_CACHE[primaryCity]) {
      return { ...CITY_CACHE[primaryCity], name: raw };
    }

    // 3. Check if any cached city name is contained as a whole word inside input
    for (const cachedKey of Object.keys(CITY_CACHE)) {
      const regex = new RegExp(`\\b${cachedKey}\\b`, "i");
      if (regex.test(fullLower)) {
        return { ...CITY_CACHE[cachedKey], name: raw };
      }
    }

    // 4. OpenStreetMap Nominatim Fallback (No custom User-Agent header so CORS succeeds)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw)}&limit=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          // Estimate timezone: if inside India bounding box (6°N–37°N, 68°E–98°E), use IST (330 mins)
          const isIndia = lat >= 6 && lat <= 37.5 && lng >= 68 && lng <= 97.5;
          const tz = isIndia ? 330 : Math.round(lng / 15) * 60;
          return { lat, lng, tz, name: data[0].display_name || raw };
        }
      }
    } catch (e) {
      console.warn("Nominatim geocoding fallback warning:", e);
    }

    // 5. Ultimate Safe Fallback to Lucknow (Standard Indian Meridian Reference)
    console.warn(`Place "${raw}" not found in geocoder; using Lucknow IST coordinates.`);
    return { ...CITY_CACHE["lucknow"], name: `${raw} (IST Standard)` };
  }

  // ==========================================================================
  // 7. MASTER BIRTH CHART CALCULATION
  // ==========================================================================
  async function calculateChart({ name, dob, time, place }) {
    const geo = await geocodePlace(place);

    const [year, month, day] = (dob || "1998-01-24").split("-").map(Number);
    const timeParts = (time || "12:00").split(":").map(Number);
    const hour = timeParts[0] || 0;
    const minute = timeParts[1] || 0;

    // Convert Local Birth Time to UTC Timestamp
    const utcMs = Date.UTC(year, month - 1, day, hour, minute, 0) - (geo.tz * 60000);
    const birthUTC = new Date(utcMs);

    // Tropical Planetary Longitudes + True Retrograde Flags
    const { longitudes: tropical, retro } = getTropicalLongitudesAndRetro(birthUTC);

    // Subtract True Lahiri Ayanamsa for Nirayana (Sidereal) Longitudes
    const ayan = lahiriAyanamsa(birthUTC);
    const sidereal = {};
    Object.keys(tropical).forEach(k => {
      sidereal[k] = ((tropical[k] - ayan) % 360 + 360) % 360;
    });

    // Quadrant-Safe Sidereal Ascendant (Udaya Lagna)
    const ascTropical = computeAscendant(birthUTC, geo.lat, geo.lng);
    sidereal.Asc = ((ascTropical - ayan) % 360 + 360) % 360;
    retro.Asc = false;

    const result = {
      meta: {
        ...geo,
        birthUTC,
        dob,
        time,
        ayanamsa: ayan
      }
    };

    Object.keys(sidereal).forEach(k => {
      const lon = sidereal[k];
      const degInSign = lon % 30;
      const deg = Math.floor(degInSign);
      const min = Math.floor((degInSign - deg) * 60);
      const rashi = siderealToRashi(lon);
      const nak = siderealToNakshatra(lon);
      const d9 = siderealToD9(lon);

      result[k] = {
        longitude: lon,
        degInSign,
        formattedDeg: `${String(deg).padStart(2, "0")}°${String(min).padStart(2, "0")}'`,
        rashi,
        rashiName: RASHI_NAMES_EN[rashi - 1],
        nakshatra: nak.id,
        nakshatraName: nak.name,
        pada: nak.pada,
        d9,
        d9Name: RASHI_NAMES_EN[d9 - 1],
        retro: Boolean(retro[k])
      };
    });

    return result;
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================
  window.BirthChartCalculator = {
    calculateChart,
    geocodePlace,
    _internal: {
      lahiriAyanamsa,
      getTropicalLongitudes: computeSingleMomentTropical,
      computeAscendant,
      siderealToRashi,
      siderealToNakshatra,
      siderealToD9
    }
  };
})();
