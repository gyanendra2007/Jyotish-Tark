/* Live daily panchang card for city pages. Needs astronomy.min.js + panchang-engine.js and window.JT_LOC. */
(function () {
  var L = window.JT_LOC, box = document.getElementById('cpLive');
  if (!L || !box || !window.JTP) return;
  var J = window.JTP, cur = J.todayIn(L.tz);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shift(n) { var t = new Date(Date.UTC(cur[0], cur[1] - 1, cur[2] + n)); cur = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]; render(); }
  function row(k, v, best) { return '<dt' + (best ? ' class="fx-best"' : '') + '>' + k + '</dt><dd' + (best ? ' class="fx-best"' : '') + '>' + esc(v) + '</dd>'; }
  function render() {
    var r;
    try { r = J.day(cur[0], cur[1], cur[2], L); } catch (e) { box.innerHTML = '<p>पंचांग लोड नहीं हो सका, पेज रीफ़्रेश करें।</p>'; return; }
    var p = r.p, today = J.todayIn(L.tz), isToday = cur.join() === today.join();
    var fest = r.festivals.length ? r.festivals.join(', ') : '';
    var ek = r.festivals.filter(function (f) { return /एकादशी/.test(f); })[0], par = '';
    if (ek) { var pa = J.parana(cur[0], cur[1], cur[2], L); if (pa) { var q = J.parts(pa.start, L.tz); par = q.d + ' ' + J.MON_HI[q.m - 1] + ', ' + J.fmtTime(pa.start, L.tz) + ' – ' + J.fmtTime(pa.end, L.tz); } }
    box.innerHTML =
      '<div class="cp-nav"><button type="button" data-n="-1" aria-label="पिछला दिन">‹ पिछला</button>' +
      '<strong>' + esc(r.dateHindi) + (isToday ? ' · आज' : '') + '</strong>' +
      '<button type="button" data-n="1" aria-label="अगला दिन">अगला ›</button></div>' +
      (fest ? '<p class="cp-fest">🪔 ' + esc(fest) + '</p>' : '') +
      '<dl>' +
      row('तिथि', p.tithi) + row('नक्षत्र', p.nakshatra) + row('योग', p.yoga) + row('करण', p.karana) +
      row('मास', p.masa + ' · ' + p.paksha) + row('सूर्योदय / सूर्यास्त', p.sunrise + ' / ' + p.sunset) +
      row('चंद्रोदय / चंद्रास्त', p.moonrise + ' / ' + p.moonset) + row('चंद्र राशि', p.moonSign) +
      row('अभिजित मुहूर्त', p.abhijitMuhurat, true) + row('अमृत चौघड़िया', p.amritKaal.replace(' (अमृत चौघड़िया)', ''), true) +
      row('ब्रह्म मुहूर्त', p.brahmaMuhurat) + row('राहु काल', p.rahuKaal) + row('यमगंड', p.yamaganda) + row('गुलिक काल', p.gulikaKaal) +
      (par ? row('एकादशी पारण (अगले दिन)', par, true) : '') +
      '</dl><p class="fx-note">समय ' + esc(L.hi) + ' (' + esc(L.tzLabel) + ') के लिए, लाहिड़ी अयनांश से गणना।</p>';
    box.querySelectorAll('button[data-n]').forEach(function (b) { b.onclick = function () { shift(+b.getAttribute('data-n')); }; });
  }
  render();
})();
