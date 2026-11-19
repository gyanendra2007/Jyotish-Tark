/* WhatsApp vrat-reminder box. Renders into any element with [data-jt-remind].
   Primary: follow the WhatsApp Channel (no data needed). Secondary: leave number → Leads sheet (type "remind"). */
(function () {
  var CHANNEL = ''; // ← WhatsApp Channel link (https://whatsapp.com/channel/...) — paste once the channel is created
  var API = 'https://script.google.com/macros/s/AKfycbw1dACJE9HKwOxwmsMlTJQWP3mQ2BsoIXme2FpHO1WnWut2O3_4slsNQkM1RlKCfgNr/exec';
  var nodes = document.querySelectorAll('[data-jt-remind]');
  if (!nodes.length) return;
  var css = document.createElement('style');
  css.textContent = '.jr-box{margin:28px 0;padding:18px 18px 16px;border-radius:16px;background:linear-gradient(135deg,#0b5d3b,#128c4a);color:#fff}' +
    '.jr-box h2,.jr-box h3{color:#fff;margin:0 0 6px;font-size:1.25rem}.jr-box p{margin:0 0 12px;color:#e8fff1}' +
    '.jr-row{display:flex;flex-wrap:wrap;gap:8px}.jr-row input{flex:1 1 160px;min-width:0;padding:11px 12px;border-radius:10px;border:0;font:inherit}' +
    '.jr-btn{display:inline-block;padding:11px 16px;border-radius:10px;border:0;background:#fff;color:#0b5d3b;font-weight:700;font:inherit;font-weight:700;cursor:pointer;text-decoration:none}' +
    '.jr-small{font-size:.82rem;color:#c9f3da;margin:10px 0 0}.jr-ok{font-weight:700}.jr-consent{display:flex;gap:8px;align-items:flex-start;font-size:.85rem;margin:10px 0 0;color:#e8fff1}';
  document.head.appendChild(css);
  nodes.forEach(function (el) {
    var city = el.getAttribute('data-city') || '';
    var page = location.pathname.split('/').pop() || 'index.html';
    el.innerHTML = '<div class="jr-box" role="region" aria-label="WhatsApp रिमाइंडर">' +
      '<h3>🔔 एकादशी, व्रत और त्योहार का रिमाइंडर WhatsApp पर</h3>' +
      '<p>हर एकादशी, प्रदोष, पूर्णिमा और बड़े त्योहार से एक दिन पहले तारीख, मुहूर्त और पारण का समय — मुफ़्त।</p>' +
      (CHANNEL ? '<p><a class="jr-btn" href="' + CHANNEL + '" target="_blank" rel="noopener">WhatsApp चैनल से जुड़ें</a></p><p class="jr-small">या अपना नंबर दें:</p>' : '') +
      '<form class="jr-form"><div class="jr-row">' +
      '<input name="name" type="text" placeholder="नाम" autocomplete="name" maxlength="60">' +
      '<input name="phone" type="tel" inputmode="numeric" placeholder="WhatsApp नंबर" autocomplete="tel" maxlength="15" required>' +
      '<button class="jr-btn" type="submit">रिमाइंडर चालू करें</button></div>' +
      '<label class="jr-consent"><input type="checkbox" name="ok" required> मैं Jyotish Tark से WhatsApp पर व्रत-त्योहार के संदेश पाने की सहमति देता/देती हूँ। कभी भी "STOP" लिखकर बंद कर सकते हैं।</label>' +
      '<p class="jr-small">आपका नंबर किसी और को नहीं दिया जाएगा। <a href="privacy-policy.html" style="color:#fff">प्राइवेसी</a></p></form></div>';
    var f = el.querySelector('form');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ph = (f.phone.value || '').replace(/\D/g, '');
      if (ph.length < 10) { f.phone.focus(); f.phone.setCustomValidity('सही नंबर लिखें'); f.phone.reportValidity(); f.phone.setCustomValidity(''); return; }
      var btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'भेज रहे हैं…';
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'lead', type: 'remind', name: f.name.value.trim(), phone: ph, details: { city: city, consent: true }, page: page }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.ok) throw 0;
          f.innerHTML = '<p class="jr-ok">✅ धन्यवाद! रिमाइंडर के लिए आपका नंबर जुड़ गया।</p><p class="jr-small">संदेश पाने के लिए हमारा नंबर <b>+91 83185 13814</b> अपने फ़ोन में सेव कर लें।</p>' +
            '<a class="jr-btn" href="https://wa.me/918318513814?text=' + encodeURIComponent('नमस्ते, मुझे व्रत-त्योहार रिमाइंडर चाहिए।') + '" target="_blank" rel="noopener">WhatsApp पर "नमस्ते" भेजें</a>';
          try { if (window.gtag) gtag('event', 'remind_signup', { page: page }); } catch (e) {}
        })
        .catch(function () { btn.disabled = false; btn.textContent = 'फिर से कोशिश करें'; });
    });
  });
})();
