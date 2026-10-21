/**
 * ============================================================================
 * BIRTH CHART CALCULATOR — Engine 3 (Astronomy)
 * Converts DOB + Time + Place → exact sidereal planetary longitudes
 * Uses astronomy-engine (VSOP87/ELP2000) + Lahiri ayanamsa + spherical trig
 * 100% client-side. No backend, no API keys.
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. TOP INDIAN CITIES CACHE (lat, lng, timezone offset in minutes from UTC)
  //    Fallback: OpenStreetMap Nominatim for anything else.
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
    "srinagar": { lat: 34.0837, lng: 74.7973, tz: 330 },
    "amritsar": { lat: 31.6340, lng: 74.8723, tz: 330 },
    "allahabad": { lat: 25.4358, lng: 81.8463, tz: 330 },
    "prayagraj": { lat: 25.4358, lng: 81.8463, tz: 330 },
    "ranchi": { lat: 23.3441, lng: 85.3096, tz: 330 },
    "coimbatore": { lat: 11.0168, lng: 76.9558, tz: 330 },
    "jabalpur": { lat: 23.1815, lng: 79.9864, tz: 330 },
    "gwalior": { lat: 26.2183, lng: 78.1828, tz: 330 },
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
    "mysore": { lat: 12.2958, lng: 76.6394, tz: 330 },
    "gurgaon": { lat: 28.4595, lng: 77.0266, tz: 330 },
    "gurugram": { lat: 28.4595, lng: 77.0266, tz: 330 },
    "noida": { lat: 28.5355, lng: 77.3910, tz: 330 },
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
    "akola": { lat: 20.7002, lng: 77.0082, tz: 330 },
    "gulbarga": { lat: 17.3297, lng: 76.8343, tz: 330 },
    "jamnagar": { lat: 22.4707, lng: 70.0577, tz: 330 },
    "ujjain": { lat: 23.1765, lng: 75.7885, tz: 330 },
    "siliguri": { lat: 26.7271, lng: 88.3953, tz: 330 },
    "jhansi": { lat: 25.4484, lng: 78.5685, tz: 330 },
    "jammu": { lat: 32.7266, lng: 74.8570, tz: 330 },
    "sangli": { lat: 16.8524, lng: 74.5815, tz: 330 },
    "mangalore": { lat: 12.9141, lng: 74.8560, tz: 330 },
    "erode": { lat: 11.3410, lng: 77.7172, tz: 330 },
    "belgaum": { lat: 15.8497, lng: 74.4977, tz: 330 },
    "tiruppur": { lat: 11.1085, lng: 77.3411, tz: 330 },
    "gaya": { lat: 24.7955, lng: 85.0002, tz: 330 },
    "kurnool": { lat: 15.8281, lng: 78.0373, tz: 330 },
    "kakinada": { lat: 16.9891, lng: 82.2475, tz: 330 },
    "bokaro": { lat: 23.6693, lng: 86.1511, tz: 330 },
    "bellary": { lat: 15.1394, lng: 76.9214, tz: 330 },
    "patiala": { lat: 30.3398, lng: 76.3869, tz: 330 },
    "agartala": { lat: 23.8315, lng: 91.2868, tz: 330 },
    "bhagalpur": { lat: 25.2425, lng: 86.9842, tz: 330 },
    "muzaffarnagar": { lat: 29.4727, lng: 77.7085, tz: 330 },
    "bhatinda": { lat: 30.2110, lng: 74.9455, tz: 330 },
    "purnia": { lat: 25.7771, lng: 87.4753, tz: 330 },
    "mathura": { lat: 27.4924, lng: 77.6737, tz: 330 },
    "hapur": { lat: 28.7306, lng: 77.7759, tz: 330 },
    "shimla": { lat: 31.1048, lng: 77.1734, tz: 330 },
    "rourkela": { lat: 22.2604, lng: 84.8536, tz: 330 },
    "howrah": { lat: 22.5958, lng: 88.2636, tz: 330 },
    "nagercoil": { lat: 8.1833, lng: 77.4119, tz: 330 },
    "tumkur": { lat: 13.3379, lng: 77.1173, tz: 330 },
    "dhule": { lat: 20.9042, lng: 74.7749, tz: 330 },
    "panipat": { lat: 29.3909, lng: 76.9635, tz: 330 },
    "aligarh": { lat: 27.8974, lng: 78.0880, tz: 330 },
    "moradabad": { lat: 28.8386, lng: 78.7733, tz: 330 },
    "gorakhpur": { lat: 26.7606, lng: 83.3732, tz: 330 },
    "bareilly": { lat: 28.3670, lng: 79.4304, tz: 330 },
    "firozabad": { lat: 27.1592, lng: 78.3957, tz: 330 },
    "saharanpur": { lat: 29.9680, lng: 77.5552, tz: 330 },
    "noida": { lat: 28.5355, lng: 77.3910, tz: 330 },
    "loni": { lat: 28.7515, lng: 77.2900, tz: 330 },
    "jamshedpur": { lat: 22.8046, lng: 86.2029, tz: 330 },
    "asansol": { lat: 23.6739, lng: 86.9524, tz: 330 },
    "dhanbad": { lat: 23.7957, lng: 86.4304, tz: 330 },
    "kollam": { lat: 8.8932, lng: 76.6141, tz: 330 },
    "thrissur": { lat: 10.5276, lng: 76.2144, tz: 330 },
    "kottayam": { lat: 9.5916, lng: 76.5222, tz: 330 },
    "nellore": { lat: 14.4426, lng: 79.9865, tz: 330 },
    "tirupati": { lat: 13.6288, lng: 79.4192, tz: 330 },
    "visakhapatnam": { lat: 17.6868, lng: 83.2185, tz: 330 },
    "vijayanagaram": { lat: 18.1067, lng: 83.3956, tz: 330 },
    "shillong": { lat: 25.5788, lng: 91.8933, tz: 330 },
    "imphal": { lat: 24.8170, lng: 93.9368, tz: 330 },
    "aizawl": { lat: 23.7271, lng: 92.7176, tz: 330 },
    "kohima": { lat: 25.6751, lng: 94.1086, tz: 330 },
    "gangtok": { lat: 27.5330, lng: 88.5122, tz: 330 },
    "itanagar": { lat: 27.0844, lng: 93.6053, tz: 330 },
    "panaji": { lat: 15.4909, lng: 73.8278, tz: 330 },
    "puducherry": { lat: 11.9416, lng: 79.8083, tz: 330 }
  };

  // ==========================================================================
  // 2. LAHIRI AYANAMSA (Chitrapaksha) — linear approximation
  //    Accurate to ~1 arcminute across 1900-2100. Good enough for chart-level work.
  // ==========================================================================
  function lahiriAyanamsa(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525; // centuries since J2000
    // Lahiri ayanamsa at J2000 = 23.85333°; precession ~0.0139289°/year
    const yearsFromJ2000 = T * 100;
    return 23.85333 + yearsFromJ2000 * 0.0139289;
  }

  // ==========================================================================
  // 3. TROPICAL PLANETARY LONGITUDES (via astronomy-engine)
  // ==========================================================================
  function getTropicalLongitudes(date) {
    if (typeof Astronomy === "undefined") {
      throw new Error("astronomy-engine not loaded. Ensure <script src='...astronomy.browser.min.js'> is in <head>.");
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
      out[name] = ecl.elon; // ecliptic longitude 0-360
    });

    // Mean lunar node for Rahu/Ketu (always retrograde, node moves backwards)
    // True node approximation: use mean node
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525;
    let meanNode = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441;
    meanNode = ((meanNode % 360) + 360) % 360;
    // Rahu is conventionally the ascending node (meanNode); Ketu is 180° away
    out.Rahu = meanNode;
    out.Ketu = (meanNode + 180) % 360;

    return out;
  }

  // ==========================================================================
  // 4. ASCENDANT (Lagna) — spherical trigonometry
  // ==========================================================================
  function computeAscendant(date, lat, lng) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525;

    // Greenwich Mean Sidereal Time in degrees
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
               0.000387933 * T * T - (T * T * T) / 38710000;
    gmst = ((gmst % 360) + 360) % 360;

    // Local Sidereal Time
    const lst = ((gmst + lng) % 360 + 360) % 360;

    // Obliquity of ecliptic
    const obl = 23.439291 - 0.0130042 * T;

    const lstRad = lst * Math.PI / 180;
    const oblRad = obl * Math.PI / 180;
    const latRad = lat * Math.PI / 180;

    // Ascendant formula
    const y = -Math.cos(lstRad);
    const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
    let asc = Math.atan2(y, x) * 180 / Math.PI;
    asc = ((asc % 360) + 360) % 360;
    return asc;
  }

  // ==========================================================================
  // 5. SIDEREAL → RASHI / NAKSHATRA / PADA / D9
  // ==========================================================================
  const RASHI_NAMES_EN = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"];
  const NAKSHATRA_NAMES = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

  function siderealToRashi(lon) { return Math.floor((((lon % 360) + 360) % 360) / 30) + 1; }

  function siderealToNakshatra(lon) {
    const norm = ((lon % 360) + 360) % 360;
    const idx = Math.floor(norm / (360 / 27));
    const pada = Math.floor((norm % (360 / 27)) / (360 / 108)) + 1;
    return { id: idx + 1, name: NAKSHATRA_NAMES[idx], pada };
  }

  function siderealToD9(lon) {
    const norm = ((lon % 360) + 360) % 360;
    const d9Idx = Math.floor(norm / (30 / 9)) % 12;
    return d9Idx + 1;
  }

  // ==========================================================================
  // 6. GEOCODING
  // ==========================================================================
  async function geocodePlace(placeName) {
    const key = placeName.trim().toLowerCase();
    if (CITY_CACHE[key]) {
      return { ...CITY_CACHE[key], name: placeName };
    }
    // Nominatim fallback
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "JyotishTark/1.0" } });
    if (!res.ok) throw new Error("Geocoding service unavailable");
    const data = await res.json();
    if (!data.length) throw new Error(`Could not find place: ${placeName}`);
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      tz: 330, // default IST — user should verify for foreign births
      name: data[0].display_name
    };
  }

  // ==========================================================================
  // 7. MASTER CALCULATION
  // ==========================================================================
  async function calculateChart({ name, dob, time, place }) {
    // Geocode
    const geo = await geocodePlace(place);

    // Build UTC birth moment
    const [year, month, day] = dob.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const utcMs = Date.UTC(year, month - 1, day, hour, minute) - geo.tz * 60000;
    const birthUTC = new Date(utcMs);

    // Tropical positions
    const tropical = getTropicalLongitudes(birthUTC);

    // Sidereal conversion
    const ayan = lahiriAyanamsa(birthUTC);
    const sidereal = {};
    Object.keys(tropical).forEach(k => {
      sidereal[k] = ((tropical[k] - ayan) % 360 + 360) % 360;
    });

    // Ascendant
    const ascTropical = computeAscendant(birthUTC, geo.lat, geo.lng);
    sidereal.Asc = ((ascTropical - ayan) % 360 + 360) % 360;

    // Build result object
    const result = { meta: { ...geo, birthUTC, ayanamsa: ayan } };
    Object.keys(sidereal).forEach(k => {
      const lon = sidereal[k];
      const rashi = siderealToRashi(lon);
      const nak = siderealToNakshatra(lon);
      const d9 = siderealToD9(lon);
      result[k] = {
        longitude: lon,
        rashi,
        rashiName: RASHI_NAMES_EN[rashi - 1],
        nakshatra: nak.id,
        nakshatraName: nak.name,
        pada: nak.pada,
        d9,
        d9Name: RASHI_NAMES_EN[d9 - 1],
        retro: (k === "Rahu" || k === "Ketu") ? true : false
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
    _internal: { lahiriAyanamsa, getTropicalLongitudes, computeAscendant, siderealToRashi, siderealToNakshatra, siderealToD9 }
  };
})();
