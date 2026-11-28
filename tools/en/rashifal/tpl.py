#!/usr/bin/env python3
"""Template translator for the 12 rashifal-2027 pages.
A text unit (a sentence) is normalised by replacing rashi names, months, ordinals and numbers
with numbered slots: {R1} {M1} {O1} {N1}… The English template (tools/en/rashifal/tpl.json)
uses the same slots; {R1h} gives the Hindi-style name (Makar), {O1w} the word form (fifth)."""
import re, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
RASHI = ['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन']
R_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
R_HI = ['Mesh','Vrishabh','Mithun','Kark','Singh','Kanya','Tula','Vrishchik','Dhanu','Makar','Kumbh','Meen']
MON = ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर']
M_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
ORDW = ['पहले','दूसरे','तीसरे','चौथे','पाँचवें','छठे','सातवें','आठवें','नौवें','दसवें','ग्यारहवें','बारहवें']
O_EN = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th']
O_W = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth']
TOK = re.compile('(' + '|'.join(sorted(RASHI + MON + ORDW, key=len, reverse=True)) + r'|\d+)')

def norm(u):
    slots = {}; cnt = {'R': 0, 'M': 0, 'O': 0, 'N': 0}
    def rep(m):
        t = m.group(1)
        k = 'R' if t in RASHI else 'M' if t in MON else 'O' if t in ORDW else 'N'
        cnt[k] += 1; name = f'{k}{cnt[k]}'
        if k == 'R': i = RASHI.index(t); slots[name] = R_EN[i]; slots[name + 'h'] = R_HI[i]
        elif k == 'M': slots[name] = M_EN[MON.index(t)]
        elif k == 'O': i = ORDW.index(t); slots[name] = O_EN[i]; slots[name + 'w'] = O_W[i]
        else: slots[name] = t
        return '{' + name + '}'
    return TOK.sub(rep, u), slots

KEEP_CAP = {'Jupiter', 'Saturn', 'Rahu', 'Ketu', 'Sun', 'Moon', 'Mars', 'Venus', 'Mercury', 'Hanuman', 'Lord', 'Ganesh', 'Maa', 'Om', 'Durva', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Sade', 'Shiva'}

def split_units(t):
    return [u for u in re.split(r'(?<=।)\s+|(?<=;)\s+', t) if u.strip()]

def load():
    p = os.path.join(HERE, 'tpl.json')
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}

def translate(t, TPL):
    out = []
    for u in split_units(t):
        lead = ''
        n, slots = norm(u.strip())
        if n not in TPL or not TPL[n]: return None
        e = TPL[n].format(**slots)
        # after a ';' the next sentence continues in lower case (unless it starts with a name)
        if out and out[-1].endswith(';') and e[:1].isupper() and e.split(' ')[0].strip('"') not in KEEP_CAP:
            e = e[0].lower() + e[1:]
        out.append(e)
    return ' '.join(out)
