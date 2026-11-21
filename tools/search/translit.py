# -*- coding: utf-8 -*-
"""Very small Devanagari → Roman (Hinglish) transliterator for search keywords.
   Not academic — aims at how people type: महालक्ष्मी → mahalakshmi, अष्टकम → ashtakam, चालीसा → chalisa."""
import re
V = {'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऑ': 'o'}
M = {'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e'}
C = {'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n', 'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
     'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n', 'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
     'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l', 'क़': 'q', 'ख़': 'kh', 'ग़': 'g', 'ज़': 'z', 'ड़': 'd', 'ढ़': 'rh', 'फ़': 'f'}
HAL = '्'; NUK = '़'
def word(w):
    w = w.replace('ज्ञ', 'ग्य')
    out = []; i = 0; n = len(w)
    while i < n:
        ch = w[i]
        if i + 1 < n and w[i + 1] == NUK and ch + NUK in C: ch = ch + NUK; i += 1
        if ch in C:
            out.append(C[ch]); nx = w[i + 1] if i + 1 < n else ''
            if nx == HAL: i += 2; continue
            if nx in M: out.append(M[nx]); i += 2; continue
            out.append('a'); i += 1; continue
        if ch in V: out.append(V[ch])
        elif ch in 'ंँ': out.append('n')
        elif ch == 'ः': out.append('h')
        elif ch in M: out.append(M[ch])
        elif ch == 'ऽ': pass
        elif ch.isascii() and ch.isalnum(): out.append(ch.lower())
        i += 1
    s = ''.join(out)
    if len(s) > 3 and s.endswith('a') and w and w[-1] in C: s = s[:-1]  # schwa deletion at word end: राम → ram
    return s
def translit(text):
    return ' '.join(x for x in (word(w) for w in re.split(r'[^ऀ-ॿ]+', text)) if len(x) > 1)
if __name__ == '__main__':
    for t in ['महालक्ष्मी अष्टकम', 'हनुमान चालीसा', 'विन्ध्येश्वरी स्तोत्र', 'ॐ जय जगदीश हरे', 'बजरंग बाण', 'सुंदरकांड', 'श्री राम रक्षा स्तोत्र', 'अंगारक स्तोत्र', 'ज्ञान', 'आज का पंचांग काठमांडू']:
        print(t, '→', translit(t))
