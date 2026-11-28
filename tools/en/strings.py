#!/usr/bin/env python3
"""List the Hindi strings of a page (text nodes outside <script>/<style>, plus title/alt/placeholder/
aria-label/title/content attributes) so they can be translated into tools/en/dict/<page>.json.
usage: python3 tools/en/strings.py kundali-form.html  > list.txt"""
import re, sys, html, json, os
DEV = re.compile(r'[ऀ-ॿ]')

def strings(src):
    body = re.sub(r'<script.*?</script>|<style.*?</style>', '', src, flags=re.S)
    out = []
    for m in re.finditer(r'>([^<]+)<', body):
        t = html.unescape(m.group(1)).strip()
        if t and DEV.search(t): out.append(t)
    for m in re.finditer(r'\s(?:alt|placeholder|aria-label|title|content)="([^"]*)"', body):
        t = html.unescape(m.group(1)).strip()
        if t and DEV.search(t): out.append(t)
    seen, res = set(), []
    for t in out:
        if t not in seen: seen.add(t); res.append(t)
    return res

if __name__ == '__main__':
    page = sys.argv[1]
    src = open(page, encoding='utf-8').read()
    dpath = os.path.join(os.path.dirname(__file__), 'dict', page.replace('.html', '.json'))
    have = json.load(open(dpath, encoding='utf-8')) if os.path.exists(dpath) else {}
    todo = [t for t in strings(src) if t not in have]
    print(json.dumps({t: "" for t in todo}, ensure_ascii=False, indent=1))
