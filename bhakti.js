/* Bhakti Sangrah: font size, print, hub search */
(function () {
  var t = document.getElementById('bkText');
  if (t) {
    var KEY = 'jt-bk-fs', fs = window.innerWidth < 560 ? 20 : 22;
    try { var v = parseInt(localStorage.getItem(KEY), 10); if (v >= 16 && v <= 34) fs = v; } catch (e) {}
    var apply = function () { t.style.fontSize = fs + 'px'; };
    apply();
    document.querySelectorAll('[data-fs]').forEach(function (b) {
      b.addEventListener('click', function () {
        fs = Math.max(16, Math.min(34, fs + 2 * parseInt(b.getAttribute('data-fs'), 10)));
        apply();
        try { localStorage.setItem(KEY, String(fs)); } catch (e) {}
      });
    });
    var p = document.querySelector('[data-print]');
    if (p) p.addEventListener('click', function () { window.print(); });
  }
  var s = document.getElementById('bkSearch');
  if (s) {
    var none = document.getElementById('bkNone');
    s.addEventListener('input', function () {
      var q = s.value.trim().toLowerCase(), shown = 0;
      document.querySelectorAll('.bk-group').forEach(function (g) {
        var n = 0;
        g.querySelectorAll('a[data-q]').forEach(function (a) {
          var ok = !q || a.getAttribute('data-q').toLowerCase().indexOf(q) > -1 || a.textContent.toLowerCase().indexOf(q) > -1;
          a.hidden = !ok; if (ok) n++;
        });
        g.hidden = n === 0; shown += n;
      });
      if (none) none.hidden = shown > 0;
    });
  }
})();
