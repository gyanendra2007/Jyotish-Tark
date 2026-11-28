#!/usr/bin/env python3
"""Home page v2 blocks (Nov 2026).

usage:  python3 tools/home/build_home.py preview   -> writes _prevA.html and _prevB.html (not committed)
        python3 tools/home/build_home.py apply A|B -> rewrites index.html between the JH markers
The first apply replaces the old hero (ABOVE-THE-FOLD …) and the old founder + services blocks.
"""
import re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSS = open(os.path.join(ROOT, 'tools/home/new-top.css'), encoding='utf-8').read().replace('../../images/', 'images/')

FORM = '''<form class="jh-form" id="homeQuickKundaliForm" onsubmit="launchKundaliFromHome(event)">
  <h2>मुफ़्त जन्म कुंडली</h2>
  <p class="sm">नाम और जन्म तिथि डालें — 12 अध्याय का विश्लेषण तुरंत, मोबाइल PDF के साथ।</p>
  <div class="f-name"><label for="homeUserName">आपका पूरा नाम</label><input type="text" id="homeUserName" placeholder="जैसे: आदित्य प्रताप सिंह" autocomplete="name" required></div>
  <div class="row"><div><label for="homeUserDob">जन्म तिथि</label><input type="date" id="homeUserDob" required></div>
  <div><label for="homeUserLang">भाषा</label><select id="homeUserLang"><option value="hi">हिंदी</option><option value="en">English</option></select></div></div>
  <button type="submit" class="jh-btn p">कुंडली देखें →</button>
  <div class="alt"><a href="kundali-form.html">जन्म समय व स्थान के साथ पूरी कुंडली</a><a href="sampurna-kundali.html">सम्पूर्ण कुंडली ₹1,101</a></div>
</form>'''

HERO_TEXT = '''<div class="jh-hero-t">
  <span class="jh-k">॥ ज्योतिष तर्क · लखनऊ ॥</span>
  <h1 class="jh-h">आपकी कुंडली, <span>आपकी भाषा में</span></h1>
  <p class="lead">वैदिक ज्योतिष को तर्क और सरल हिंदी में समझिए — मुफ़्त जन्म कुंडली, कुंडली मिलान, राशिफल और पंचांग, और ज़रूरत हो तो ज्योतिषी ज्ञानेंद्र सिंह तोमर से सीधी बात।</p>
  <div class="jh-cta"><a class="jh-btn p" href="kundali-form.html">मुफ़्त कुंडली बनाएं</a><a class="jh-btn s" href="consultation.html">ज्योतिषी से बात करें</a></div>
  <ul class="jh-chips"><li>2020 से</li><li>100+ संतुष्ट जातक</li><li>हिंदी व English</li><li>40+ मुफ़्त टूल</li></ul>
</div>'''

HERO_A = f'''<section class="jhA" aria-label="ज्योतिष तर्क">
  <picture><source media="(max-width:760px)" srcset="images/ui/hero-mobile.webp" type="image/webp"><source srcset="images/ui/hero-desktop.webp" type="image/webp"><img src="images/ui/hero-desktop.jpg" alt="" width="1600" height="893" fetchpriority="high"></picture>
  <div class="jh-wrap">{HERO_TEXT}
  {FORM}</div>
</section>'''

HERO_B = f'''<section class="jhB" aria-label="ज्योतिष तर्क">
<div class="jh-sky" aria-hidden="true"><i style="left:6%;top:14%;animation-delay:0s"></i><i style="left:18%;top:62%;animation-delay:1.1s"></i><i style="left:33%;top:22%;animation-delay:2.2s"></i><i style="left:47%;top:8%;animation-delay:0.6s"></i><i style="left:58%;top:48%;animation-delay:1.7s"></i><i style="left:71%;top:16%;animation-delay:2.8s"></i><i style="left:86%;top:58%;animation-delay:0.3s"></i><i style="left:93%;top:24%;animation-delay:1.4s"></i><i style="left:26%;top:86%;animation-delay:2.5s"></i><i style="left:64%;top:84%;animation-delay:0.9s"></i></div>
  <div class="jh-wrap">{HERO_TEXT}
  <div class="jh-arch"><div class="fr"><picture><source srcset="images/ui/gyanendra-namaste.webp" type="image/webp"><img src="images/ui/gyanendra-namaste.jpg" alt="ज्योतिषी ज्ञानेंद्र सिंह तोमर" width="720" height="720" fetchpriority="high"></picture></div>
  <div class="nm"><b>ज्ञानेंद्र सिंह तोमर</b><small>वैदिक ज्योतिषी, लखनऊ</small></div></div></div>
</section>
<div class="jhB-form"><div class="jh-wrap">{FORM}</div></div>'''

def card(href, img, title, text, price, go='देखें →', alt=''):
    im = f'<div class="im"><picture><source srcset="{img}.webp" type="image/webp"><img src="{img}.jpg" alt="{alt}" loading="lazy" width="800" height="597"></picture></div>' if img else \
        '<div class="im jh-num" aria-hidden="true">' + ''.join(f'<span style="left:{x}%;top:{y}%">{n}</span>' for n, x, y in [('१', 18, 22), ('२', 44, 12), ('३', 72, 24), ('४', 12, 52), ('५', 44, 44), ('६', 78, 54), ('७', 22, 78), ('८', 50, 76), ('९', 78, 82)]) + '</div>'
    return f'<a class="jh-card" href="{href}">{im}<div class="bd"><h3>{title}</h3><p>{text}</p><div class="ft"><span class="pr">{price}</span><span class="go">{go}</span></div></div></a>'

SERVICES = '<section class="jh-sec"><div class="jh-wrap"><div class="jh-st"><span class="jh-k">हमारी सेवाएं</span><h2 class="jh-h">आपके हर प्रश्न के लिए</h2><p>मुफ़्त टूल से शुरुआत करें, और गहराई चाहिए तो विस्तृत रिपोर्ट या सीधी बात।</p></div><div class="jh-grid">' + ''.join([
    card('kundali-form.html', 'images/ui/card-kundali', 'जन्म कुंडली', 'लग्न, नवांश, ग्रह, दशा और 12 अध्याय का विश्लेषण।', 'मुफ़्त', alt='जन्म कुंडली'),
    card('kundali-milan.html', 'images/ui/card-milan', 'कुंडली मिलान', '36 गुण, मंगल दोष और नाड़ी दोष — शादी से पहले।', 'मुफ़्त', alt='कुंडली मिलान'),
    card('sampurna-kundali.html', 'images/ui/card-career', 'सम्पूर्ण कुंडली', '35+ पेज की PDF: करियर, धन, विवाह, दशा और उपाय।', '₹1,101', alt='सम्पूर्ण कुंडली — करियर व भविष्य'),
    card('consultation.html', 'images/ui/gyanendra', 'ज्योतिषी से बात', 'ऑडियो या वीडियो कॉल — पहली 5 मिनट मुफ़्त।', '₹301 से', alt='ज्योतिषी ज्ञानेंद्र सिंह तोमर'),
    card('rudraksha.html', 'images/ui/card-rudraksha', 'असली रुद्राक्ष', 'नेपाली दाना, लैब सर्टिफिकेट के विकल्प के साथ।', 'स्टोर देखें', alt='रुद्राक्ष'),
    card('numerology.html', '', 'अंक ज्योतिष', 'मूलांक, भाग्यांक और नाम का अंक — मुफ़्त कैलकुलेटर।', 'मुफ़्त'),
]) + '</div></div></section>'

RASHI = [('mesh', 'मेष'), ('vrishabh', 'वृषभ'), ('mithun', 'मिथुन'), ('kark', 'कर्क'), ('singh', 'सिंह'), ('kanya', 'कन्या'), ('tula', 'तुला'), ('vrishchik', 'वृश्चिक'), ('dhanu', 'धनु'), ('makar', 'मकर'), ('kumbh', 'कुंभ'), ('meen', 'मीन')]
RASHI_SEC = '<section class="jh-sec jh-rashi"><div class="jh-wrap"><div class="jh-st"><span class="jh-k">राशिफल</span><h2 class="jh-h">अपनी राशि चुनें</h2><p>2027 का वार्षिक राशिफल — करियर, धन, विवाह और उपाय।</p></div><div class="jh-rgrid">' + ''.join(
    f'<a class="jh-r" href="{k}-rashifal-2027.html"><img src="images/ui/rashi-{k}.webp" alt="" width="240" height="240" loading="lazy"><span>{h}</span></a>' for k, h in RASHI) + \
    '</div><div class="jh-links"><a class="jh-btn s" href="weekly-rashifal.html">साप्ताहिक राशिफल</a><a class="jh-btn s" href="masik-rashifal-december-2026.html">मासिक राशिफल</a><a class="jh-btn s" href="gochar-2027.html">गोचर 2027</a></div></div></section>'

PANCHANG = '''<section class="jh-sec" style="padding-top:0"><div class="jh-wrap"><div class="jh-pan" id="jhPan">
  <img src="images/ui/panchang-banner.webp" alt="" width="1600" height="679" loading="lazy">
  <div class="tx"><span class="jh-k">आज का पंचांग · लखनऊ</span><h2 class="jh-h" id="jhPanDate">आज का पंचांग</h2>
  <p class="today" id="jhPanT">तिथि, नक्षत्र, योग, राहुकाल और शुभ मुहूर्त — सूर्योदय से सटीक।</p>
  <a class="jh-btn p" href="panchang.html">पूरा पंचांग देखें</a> <a class="jh-btn s" href="shubh-muhurat-2027.html">शुभ मुहूर्त 2027</a></div>
</div></div>
<script>(function(){var el=document.getElementById('jhPan');if(!el)return;function load(s,cb){var x=document.createElement('script');x.src=s;x.onload=cb;x.onerror=function(){};document.head.appendChild(x);}
function fill(){try{var t=JTP.todayIn('Asia/Kolkata'),d=JTP.day(t[0],t[1],t[2]);document.getElementById('jhPanDate').textContent=d.dateHindi;
document.getElementById('jhPanT').innerHTML='<b>तिथि:</b> '+d.p.tithi.split(',')[0]+'<br><b>नक्षत्र:</b> '+d.p.nakshatra.split(',')[0]+'<br><b>राहुकाल:</b> '+d.p.rahuKaal+'<br><b>सूर्योदय:</b> '+d.p.sunrise+' · <b>सूर्यास्त:</b> '+d.p.sunset+(d.hasFestival?'<br><b>आज:</b> '+d.festivals.join(', '):'');}catch(e){}}
function go(){if(window.JTP)return fill();load('astronomy.min.js?v=1',function(){load('panchang-engine.js?v=4',fill);});}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();go();}},{rootMargin:'300px'});io.observe(el);}else go();})();</script>
</section>'''

FOUNDER = '''<section class="jh-sec" style="background:#fff"><div class="jh-wrap jh-me">
  <div class="ph"><picture><source srcset="images/ui/gyanendra.webp" type="image/webp"><img src="images/ui/gyanendra.jpg" alt="ज्योतिषी ज्ञानेंद्र सिंह तोमर" width="600" height="600" loading="lazy"></picture></div>
  <div><span class="jh-k">संस्थापक</span><h2 class="jh-h">ज्ञानेंद्र सिंह तोमर</h2>
  <p>लखनऊ के वैदिक ज्योतिषी और MBBS छात्र। विज्ञान की पढ़ाई ने सोचने का तरीका तार्किक बनाया — इसीलिए इस मंच का नाम है <b>“ज्योतिष तर्क”</b>: प्राचीन ज्ञान, तर्क और सटीकता के साथ।</p>
  <p>पाराशरी, जैमिनी, KP, लाल किताब, अष्टकवर्ग और अंक ज्योतिष का अध्ययन। उद्देश्य डराना नहीं, बल्कि करियर, विवाह और जीवन के प्रश्नों पर साफ़ और ईमानदार मार्गदर्शन देना है।</p>
  <ul class="jh-chips"><li>2020 से</li><li>100+ संतुष्ट जातक</li><li>20+ करियर मार्गदर्शन</li><li>30+ विवाह मार्गदर्शन</li></ul>
  <div class="jh-cta" style="margin-top:18px"><a class="jh-btn p" href="consultation.html">परामर्श बुक करें</a><a class="jh-btn s" href="about.html">पूरा परिचय</a></div></div>
</div></section>'''

TRUST = '<div class="jh-trust"><ul><li><b>2020</b> से सेवा</li><li><b>100+</b> संतुष्ट जातक</li><li><b>550+</b> लेख, स्तोत्र व टूल</li><li>हिंदी व English</li></ul></div>'

def block(variant):
    hero = HERO_A if variant == 'A' else HERO_B
    return f'<!-- JH:START (tools/home/build_home.py) -->\n<style>{CSS}</style>\n<div class="jh">\n{hero}\n{TRUST}\n{SERVICES}\n{RASHI_SEC}\n{PANCHANG}\n{FOUNDER}\n</div>\n<!-- JH:END -->'

def rewrite(src, variant):
    if '<!-- JH:START' in src:
        return re.sub(r'<!-- JH:START.*?<!-- JH:END -->', lambda m: block(variant), src, flags=re.S)
    a = src.index('    <!-- ======================================================================= -->\n    <!-- ABOVE-THE-FOLD')
    b = src.index('    <!-- KP astrology spotlight -->')
    src = src[:a] + block(variant) + '\n\n' + src[b:]
    # old founder section and old big services section
    a = src.index('    <!-- About Founder Section -->'); b = src.index('    <!-- Services & Interactive Tools Section -->')
    src = src[:a] + src[b:]
    a = src.index('    <!-- Services & Interactive Tools Section -->'); b = src.index('    <!-- Kundali Chart Section -->')
    # keep the secondary daily utilities bar if present inside? (it is inside the services section) -> drop with it
    src = src[:a] + src[b:]
    return src

if __name__ == '__main__':
    idx = os.path.join(ROOT, 'index.html')
    s = open(idx, encoding='utf-8').read()
    if sys.argv[1] == 'preview':
        for v in 'AB':
            open(os.path.join(ROOT, f'_prev{v}.html'), 'w', encoding='utf-8').write(rewrite(s, v))
        print('wrote _prevA.html _prevB.html')
    elif sys.argv[1] == 'apply':
        open(idx, 'w', encoding='utf-8').write(rewrite(s, sys.argv[2]))
        print('index.html updated with variant', sys.argv[2])
