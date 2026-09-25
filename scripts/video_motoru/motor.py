#!/usr/bin/env python3
"""Ders Dünyası video motoru.
Kullanım (proje kökünden):
  python3 scripts/video_motoru/motor.py                 # tüm videolar, sesli (macOS Yelda)
  python3 scripts/video_motoru/motor.py --id mat2-22    # tek video (id başı yeterli)
  python3 scripts/video_motoru/motor.py --sessiz        # ses olmadan
  python3 scripts/video_motoru/motor.py --onizleme      # sadece kontrol görseli (hızlı)
Çıktı: public/videolar/<id>.mp4 + <id>.jpg ; src/data/videolar.ts
"""
import argparse, json, math, os, re, shutil, subprocess, sys, tempfile, wave
from PIL import Image, ImageDraw, ImageFont

KOK = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SENARYO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'senaryolar.json')
CIKTI = os.path.join(KOK, 'public', 'videolar')
MANIFEST = os.path.join(KOK, 'src', 'data', 'videolar.ts')
ONIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'onizleme')

W, H, FPS, SS = 1280, 720, 25, 2
SES_HIZ = 165
SES_ONCE, SES_SONRA, MIN_SAHNE = 0.5, 0.9, 3.5

FONT_ADAY = {
    False: ['/System/Library/Fonts/Supplemental/Arial.ttf', '/Library/Fonts/Arial.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'],
    True: ['/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/Library/Fonts/Arial Bold.ttf',
           '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'],
}
_fyol, _fcache = {}, {}
def font(size, bold=True):
    if bold not in _fyol:
        _fyol[bold] = next((p for p in FONT_ADAY[bold] if os.path.exists(p)), None)
        if not _fyol[bold]:
            sys.exit('Yazı tipi bulunamadı (Arial / DejaVu).')
    k = (max(1, int(size * SS)), bold)
    if k not in _fcache:
        _fcache[k] = ImageFont.truetype(_fyol[bold], k[0])
    return _fcache[k]

EMOJI_FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'NotoColorEmoji.ttf')
_ecache, _eboyut = {}, {}
def emoji_img(ch):
    ch = ch.replace('\ufe0f', '')
    if ch not in _ecache:
        f = ImageFont.truetype(EMOJI_FONT, 109)
        im = Image.new('RGBA', (220, 220), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((10, 10), ch, font=f, embedded_color=True)
        bb = im.getbbox()
        _ecache[ch] = im.crop(bb) if bb else im
    return _ecache[ch]

def emoji(T, ch, x, y, size, a=1.0):
    if a <= 0 or size < 2: return
    src = emoji_img(ch); k = (ch, int(size * SS))
    if k not in _eboyut:
        w, h = src.size; sc = size * SS / max(w, h)
        _eboyut[k] = src.resize((max(1, int(w * sc)), max(1, int(h * sc))), Image.LANCZOS)
    im = _eboyut[k]
    if a < 1:
        im = im.copy(); al = im.getchannel('A').point(lambda v: int(v * a)); im.putalpha(al)
    T.im.paste(im, (int(x * SS - im.width / 2), int(y * SS - im.height / 2)), im)

BG = (255, 248, 236); INK = (44, 44, 42); MUTED = (120, 118, 110); LINE = (211, 209, 199)
WHITE = (255, 255, 255); ACC = (59, 109, 17); HL = (151, 196, 89)
RENK = {
    'kirmizi': (226, 75, 74), 'mavi': (55, 138, 221), 'sari': (239, 159, 39), 'yesil': (99, 153, 34),
    'mor': (127, 119, 221), 'turuncu': (216, 90, 48), 'pembe': (212, 83, 126), 'turkuaz': (29, 158, 117),
    'lacivert': (12, 68, 124), 'kahve': (133, 79, 11),
}
GRUP_RENK = [RENK['mavi'], RENK['turuncu'], RENK['mor']]

def lerp(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def ease(t):
    t = max(0.0, min(1.0, t)); return t * t * (3 - 2 * t)
def A(t, bas, sure=0.5):
    return ease((t - bas) / sure) if sure > 0 else (1.0 if t >= bas else 0.0)
def fade(c, a):
    return lerp(BG, c, a)

class Tuval:
    def __init__(s, im): s.im = im; s.d = ImageDraw.Draw(im)
    @staticmethod
    def k(v): return v * SS
    def rect(s, x0, y0, x1, y1, fill=None, outline=None, w=0, r=0):
        box = [s.k(x0), s.k(y0), s.k(x1), s.k(y1)]
        if r: s.d.rounded_rectangle(box, radius=s.k(r), fill=fill, outline=outline, width=int(s.k(w)))
        else: s.d.rectangle(box, fill=fill, outline=outline, width=int(s.k(w)))
    def circle(s, x, y, r, fill=None, outline=None, w=0):
        s.d.ellipse([s.k(x - r), s.k(y - r), s.k(x + r), s.k(y + r)], fill=fill, outline=outline, width=int(s.k(w)))
    def ellipse(s, x0, y0, x1, y1, fill=None):
        s.d.ellipse([s.k(x0), s.k(y0), s.k(x1), s.k(y1)], fill=fill)
    def line(s, pts, fill, w):
        s.d.line([(s.k(x), s.k(y)) for x, y in pts], fill=fill, width=int(s.k(w)), joint='curve')
    def cap_line(s, x0, y0, x1, y1, fill, w):
        s.line([(x0, y0), (x1, y1)], fill, w); s.circle(x0, y0, w / 2, fill); s.circle(x1, y1, w / 2, fill)
    def poly(s, pts, fill=None, outline=None, w=0):
        s.d.polygon([(s.k(x), s.k(y)) for x, y in pts], fill=fill, outline=outline, width=int(s.k(w)))
    def pie(s, x, y, r, a0, a1, fill):
        s.d.pieslice([s.k(x - r), s.k(y - r), s.k(x + r), s.k(y + r)], a0, a1, fill=fill)
    def text(s, x, y, t, size, fill, bold=True, anchor='mm'):
        s.d.text((s.k(x), s.k(y)), str(t), font=font(size, bold), fill=fill, anchor=anchor)
    def mtext(s, x, y, t, size, fill, bold=False, spacing=8):
        s.d.multiline_text((s.k(x), s.k(y)), t, font=font(size, bold), fill=fill, anchor='mm', align='center', spacing=s.k(spacing))
    def width(s, t, size, bold=True):
        return s.d.textlength(str(t), font=font(size, bold)) / SS

# ---------- nesneler ----------
def cizim_sekil(T, tur, x, y, r, renk, a=1.0, outline=None):
    c = fade(renk, a); o = fade(outline, a) if outline else None
    if tur == 'daire':
        T.circle(x, y, r, c, o, 3 if o else 0)
    elif tur == 'kare':
        T.rect(x - r, y - r, x + r, y + r, c, o, 3 if o else 0, r=r * 0.12)
    elif tur == 'dikdortgen':
        T.rect(x - r * 1.4, y - r * 0.8, x + r * 1.4, y + r * 0.8, c, o, 3 if o else 0, r=r * 0.1)
    elif tur in UCGEN_TIP:
        T.poly(kose_noktalari(tur, x, y, r), c, o, 3 if o else 0)
    elif tur in ('ucgen', 'besgen', 'altigen'):
        n = {'ucgen': 3, 'besgen': 5, 'altigen': 6}[tur]
        pts = [(x + r * 1.1 * math.cos(-math.pi / 2 + 2 * math.pi * i / n),
                y + r * 0.15 + r * 1.1 * math.sin(-math.pi / 2 + 2 * math.pi * i / n)) for i in range(n)]
        T.poly(pts, c, o, 3 if o else 0)
    elif tur == 'yildiz':
        pts = []
        for i in range(10):
            rr = r if i % 2 == 0 else r * 0.45
            an = -math.pi / 2 + math.pi * i / 5
            pts.append((x + rr * math.cos(an), y + rr * math.sin(an)))
        T.poly(pts, c, fade((186, 117, 23), a), 2)

def nesne(T, tur, x, y, r, a=1.0, renk=None):
    if a <= 0: return
    r = r * (0.6 + 0.4 * a)
    if tur == 'elma':
        T.circle(x, y + r * 0.08, r, fade(renk or RENK['kirmizi'], a))
        T.line([(x, y - r * 0.8), (x + r * 0.12, y - r * 1.2)], fade(RENK['kahve'], a), max(2, r * 0.12))
        T.ellipse(x + r * 0.1, y - r * 1.15, x + r * 0.62, y - r * 0.85, fade(RENK['yesil'], a))
    elif tur == 'top':
        c = renk or RENK['mavi']
        T.circle(x, y, r, fade(c, a))
        T.d.arc([T.k(x - r * 0.6), T.k(y - r * 1.4), T.k(x + r * 1.6), T.k(y + r * 0.6)], 120, 200, fill=fade(WHITE, a), width=int(T.k(max(2, r * 0.14))))
    elif tur == 'yildiz':
        cizim_sekil(T, 'yildiz', x, y, r * 1.1, renk or RENK['sari'], a)
    elif tur == 'kup':
        T.rect(x - r, y - r, x + r, y + r, fade(renk or RENK['mavi'], a), fade(WHITE, a), 1.5, r=2)
    elif tur == 'nokta':
        T.circle(x, y, r, fade(renk or RENK['turkuaz'], a))
    else:
        emoji(T, tur, x, y, r * 2.3, a)

def izgara(n, sutun, x0, y0, x1, y1, max_hucre=90):
    satir = max(1, math.ceil(n / sutun))
    hucre = min((x1 - x0) / sutun, (y1 - y0) / satir, max_hucre)
    gx = x0 + ((x1 - x0) - hucre * sutun) / 2; gy = y0 + ((y1 - y0) - hucre * satir) / 2
    return [(gx + hucre * (i % sutun) + hucre / 2, gy + hucre * (i // sutun) + hucre / 2) for i in range(n)], hucre

def kesir_ciz(T, x, y, pay, payda, size, c):
    wn = max(T.width(pay, size), T.width(payda, size))
    T.text(x + wn / 2, y - size * 0.14, pay, size, c, anchor='md')
    T.line([(x - 8, y), (x + wn + 8, y)], c, max(4, size * 0.08))
    T.text(x + wn / 2, y + size * 0.14, payda, size, c, anchor='ma')
    return wn + 16

def ifade_ciz(T, x, y, parcalar, size, a, renkler=None):
    """parcalar: '1/2', '=', '3' ... ; x merkez"""
    ol = []
    for p in parcalar:
        if re.fullmatch(r'\d+/\d+', str(p)):
            n, d = str(p).split('/'); ol.append(('k', n, d, max(T.width(n, size), T.width(d, size)) + 16))
        else:
            ol.append(('t', str(p), None, T.width(str(p), size)))
    bosluk = size * 0.35
    top = sum(o[3] for o in ol) + bosluk * (len(ol) - 1)
    cx = x - top / 2
    for i, o in enumerate(ol):
        c = fade((renkler[i] if renkler and i < len(renkler) and renkler[i] else INK), a)
        if o[0] == 'k': kesir_ciz(T, cx, y, o[1], o[2], size, c)
        else: T.text(cx + o[3] / 2, y, o[1], size, c)
        cx += o[3] + bosluk

# ---------- sahne tipleri ----------
def kelime_zamanlari(p, D):
    """[(bas_idx, bit_idx, t_bas, t_bit)] — anlatımdaki her kelimenin konumu ve söylendiği an.
    Microsoft sesinden gelen gerçek zamanlar (_zaman) varsa onlar, yoksa harf oranı kullanılır."""
    k = ('_kz', round(D, 3))
    if k in p: return p[k]
    metin = p.get('anlatim', ''); out = []
    if p.get('_zaman'):
        imlec = 0
        for off, dur, txt in p['_zaman']:
            j = metin.find(txt, imlec)
            if j < 0: continue
            out.append((j, j + len(txt), SES_ONCE + off, SES_ONCE + off + max(dur, 0.05))); imlec = j + len(txt)
    if not out and metin:
        sesli = max(0.5, D - SES_ONCE - SES_SONRA); L = len(metin)
        for m in re.finditer(r'\S+', metin):
            out.append((m.start(), m.end(), SES_ONCE + sesli * m.start() / L, SES_ONCE + sesli * m.end() / L))
    p[k] = out
    return out

def zaman_at(p, D, idx):
    kz = kelime_zamanlari(p, D)
    if not kz: return None
    onceki = kz[0]
    for w in kz:
        if w[0] > idx: break
        onceki = w
    b, e, tb, te = onceki
    if idx >= e: return te
    return tb + (te - tb) * max(0, idx - b) / max(1, e - b)

def sayim_zamanlari(p, D, n):
    """p['sayim'] = [ilk_kelime, son_kelime] aralığındaki sayılar söylendikçe n öğenin görüneceği anlar."""
    metin = p.get('anlatim', ''); ilk, son = p['sayim']
    i0 = metin.find(ilk); i1 = metin.rfind(son)
    if i0 < 0 or i1 < 0: return None
    i1 += len(son)
    W = [w for w in kelime_zamanlari(p, D) if w[1] > i0 and w[0] < i1 and re.search(r'\w', metin[w[0]:w[1]])]
    if not W: return None
    if len(W) == n: return [w[2] for w in W]
    out = []
    for j in range(n):
        f = j * len(W) / n; w = W[int(f)]
        out.append(w[2] + (f - int(f)) * (w[3] - w[2]))
    return out

def an(p, D, parca, varsayilan, son=True):
    """Anlatımda 'parca'nın söylenmeye başladığı an (yoksa varsayılan)."""
    metin = p.get('anlatim', '')
    i = metin.rfind(str(parca)) if son else metin.find(str(parca))
    if i < 0 or not metin: return varsayilan
    z = zaman_at(p, D, i)
    return varsayilan if z is None else z

def tr_kucuk(x):
    return str(x).replace('İ', 'i').replace('I', 'ı').lower()

def oge_zamani(p, D, etiket, varsayilan, i=0):
    """Öğe anlatımda geçtiği an görünsün. Önce etiketin tamamı, bulunamazsa kelime kökleri (ilk 4 harf) aranır."""
    metin = tr_kucuk(p.get('anlatim', '')); et = tr_kucuk(etiket).strip(' .,!?')
    if not et or not metin: return varsayilan
    im = p.setdefault('_imlec', {})
    bas = max([v for k, v in im.items() if k < i] or [0])
    j = metin.find(et, bas)
    if j < 0:
        adaylar = [metin.find(w[:4], bas) for w in re.findall(r'\w+', et) if len(w) >= 3]
        adaylar = [x for x in adaylar if x >= 0]
        j = min(adaylar) if adaylar else metin.find(et)
    if j < 0: return varsayilan
    im[i] = j + 1
    z = zaman_at(p, D, j)
    return varsayilan if z is None else z

def an_ilk(p, D, parcalar, varsayilan):
    ts = [an(p, D, x, None, son=False) for x in parcalar]; ts = [x for x in ts if x is not None]
    return min(ts) if ts else varsayilan

def s_baslik(T, p, t, D):
    a = A(t, 0.1, 0.6)
    T.text(640, 290 - 20 * (1 - a), p['baslik'], 64, fade(INK, a))
    if p.get('alt'): T.text(640, 375, p['alt'], 32, fade(MUTED, A(t, 0.5)), bold=False)
    for i, (tur, rk) in enumerate([('daire', 'kirmizi'), ('ucgen', 'sari'), ('kare', 'mavi'), ('yildiz', 'yesil'), ('daire', 'mor')]):
        aa = A(t, 0.8 + i * 0.15, 0.4)
        if tur == 'yildiz': nesne(T, 'yildiz', 480 + i * 80, 470, 22, aa, RENK[rk])
        else: cizim_sekil(T, tur, 480 + i * 80, 470, 22 * (0.6 + 0.4 * aa), RENK[rk], aa)

def s_metin(T, p, t, D):
    sat = p['satirlar']; sutun = p.get('sutun', 1); vurgu = set(p.get('vurgu', []))
    per = math.ceil(len(sat) / sutun)
    size = p.get('boyut') or min(50, 400 / per * 0.62)
    aralik = min(size * 1.6, 420 / max(per, 1))
    y0 = 330 - aralik * (per - 1) / 2
    adim = min(0.8, (D * 0.5) / max(len(sat), 1))
    for i, s in enumerate(sat):
        col = i // per; row = i % per
        x = 640 if sutun == 1 else 360 + col * 560
        a = A(t, 0.3 + i * adim, 0.5)
        T.text(x, y0 + row * aralik + 12 * (1 - a), s, size, fade(ACC if i in vurgu else INK, a))

def s_kesir(T, p, t, D):
    n = p['parca']; boya = p.get('boya', [])
    if isinstance(boya, int): boya = list(range(boya))
    base = (250, 199, 117)
    kesim_a = A(t, 0.2, 1.0) if p.get('kes', True) else 1.0
    boya_a = A(t, p.get('boya_zaman', 1.0), 0.6)
    if p.get('sekil', 'daire') == 'daire':
        cx, cy, R = 400, 330, 195
        acilar = p.get('acilar') or [360 / n] * n
        b = 270.0; sinir = []
        for i, ac in enumerate(acilar):
            T.pie(cx, cy, R, b, b + ac, lerp(base, HL, boya_a) if i in boya else base)
            sinir.append(b); b += ac
        if p.get('pizza', True):
            T.circle(cx, cy, R, None, (186, 117, 23), 16)
            for px, py, r in [(80, -95, 19), (105, 60, 19), (-70, 95, 19), (-95, -70, 19), (20, 60, 15), (-35, -45, 15), (35, -130, 13), (-130, 20, 13)]:
                T.circle(cx + px, cy + py, r, (226, 75, 74))
        else:
            T.circle(cx, cy, R, None, (186, 117, 23), 6)
        if n > 1:
            for ang in sinir:
                rad = math.radians(ang); L = (R + 12) * kesim_a
                T.cap_line(cx, cy, cx + L * math.cos(rad), cy + L * math.sin(rad), (65, 36, 2), 6)
    else:
        x0, y0, x1, y1 = 150, 210, 650, 450; wdt = (x1 - x0) / n
        for i in range(n):
            T.rect(x0 + i * wdt, y0, x0 + (i + 1) * wdt, y1, lerp((133, 79, 11), HL, boya_a) if i in boya else (133, 79, 11))
            for j in range(3):
                T.rect(x0 + i * wdt + 10, y0 + 10 + j * 78, x0 + (i + 1) * wdt - 10, y0 + 70 + j * 78, None, (99, 56, 6), 2, r=6)
        T.rect(x0, y0, x1, y1, None, (65, 36, 2), 6, r=4)
        for i in range(1, n):
            xx = x0 + i * wdt; L = (y1 - y0 + 30) * kesim_a
            T.cap_line(xx, y0 - 15, xx, y0 - 15 + L, (65, 36, 2), 6)
    if p.get('kesir'):
        ifade_ciz(T, 960, 330, p['kesir'], 72, A(t, p.get('kesir_zaman', 1.4), 0.6), [ACC])
    elif p.get('yazi'):
        T.text(960, 330, p['yazi'], 52, fade(INK, A(t, 0.8)))

def s_nesne_say(T, p, t, D):
    n = p['sayi']; tur = p.get('nesne', 'elma'); duzen = p.get('duzen', 'onluk')
    sure = min(D * 0.55, max(1.0, n * 0.22)); adim = sure / n; bas0 = 0.3
    zl = sayim_zamanlari(p, D, n) if p.get('sayim') else None
    if zl: bas0 = zl[0]; sure = max(0.3, zl[-1] - zl[0] + 0.3); adim = sure / n
    else: zl = [bas0 + i * adim for i in range(n)]
    if duzen == 'cift':
        sut = math.ceil(n / 2); hucre = min(640 / sut, 150, 110)
        gx = 420 - hucre * sut / 2
        pos = [(gx + hucre * (i // 2) + hucre / 2, 270 + (i % 2) * hucre) for i in range(n)]
    else:
        pos, hucre = izgara(n, 10 if duzen == 'onluk' else p.get('sutun', 5), 60, 110, 780, 560, 90 if duzen == 'onluk' else 150)
    r = hucre * 0.36
    gorunen = 0
    for i, (x, y) in enumerate(pos):
        a = A(t, zl[i], 0.25 if adim > 0.3 else max(0.05, adim * 0.9))
        if a > 0: gorunen = i + 1
        nesne(T, tur, x, y, r, a)
    if duzen == 'onluk' and n >= 10:
        for g in range(n // 10):
            if gorunen >= (g + 1) * 10:
                x0 = pos[g * 10][0] - hucre / 2 + 3; y0 = pos[g * 10][1] - hucre / 2 + 3
                T.rect(x0, y0, x0 + hucre * 10 - 6, y0 + hucre - 6, None, ACC, 3, r=10)
    if duzen == 'cift':
        for j in range(n // 2):
            if gorunen >= 2 * j + 2:
                x = pos[2 * j][0]
                T.rect(x - hucre * 0.46, 270 - hucre * 0.48, x + hucre * 0.46, 270 + hucre * 1.48, None, ACC, 3, r=14)
        if n % 2 and A(t, bas0 + sure + 0.3) > 0:
            x, y = pos[-1]; T.circle(x, y, r * 1.35, None, fade(RENK['kirmizi'], A(t, bas0 + sure + 0.3)), 4)
    T.text(1010, 300, gorunen, 110, INK)
    if p.get('etiket'): T.text(1010, 400, p['etiket'], 34, fade(MUTED, A(t, bas0 + sure)), bold=False)
    if p.get('sonuc'): T.text(1010, 470, p['sonuc'], 48, fade(ACC, A(t, bas0 + sure + 0.3)))

def blok_ciz(T, onluk, birlik, x, renk, t, bas, adim, kup=24, yuzluk=0):
    """sol alt yerleşimli yüzlük tabakalar + onluk çubuklar + birlikler; döndürür: (sağ x, sonraki zaman)"""
    alt = 520
    if yuzluk:
        fs = kup * 10
        for i in range(yuzluk):
            a = A(t, bas, 0.3); bas += adim
            ox = x + i * 16; oy = alt - fs - i * 16
            if a > 0:
                T.rect(ox, oy, ox + fs, oy + fs, fade(lerp(renk, INK, 0.15), a), fade(WHITE, a), 1.5)
                for g in range(1, 10):
                    T.line([(ox + g * kup, oy), (ox + g * kup, oy + fs)], fade(lerp(renk, WHITE, 0.45), a), 1)
                    T.line([(ox, oy + g * kup), (ox + fs, oy + g * kup)], fade(lerp(renk, WHITE, 0.45), a), 1)
        x += fs + 16 * (yuzluk - 1) + 28
    for i in range(onluk):
        a = A(t, bas, 0.3); bas += adim
        for j in range(10):
            yy = alt - (j + 1) * kup
            if a > 0: T.rect(x, yy, x + kup, yy + kup, fade(renk, a), fade(WHITE, a), 1.5)
        x += kup + (8 if kup < 20 else 12)
    if onluk: x += 16
    sut = 5
    for i in range(birlik):
        a = A(t, bas, 0.3); bas += adim * 0.6
        cx = x + (i % sut) * (kup + 6); cy = alt - (i // sut + 1) * (kup + 6)
        if a > 0: T.rect(cx, cy, cx + kup, cy + kup, fade(renk, a), fade(WHITE, a), 1.5, r=2)
    if birlik: x += min(birlik, sut) * (kup + 6)
    return x, bas

BASAMAK_AD = ['Binler', 'Yüzler', 'Onlar', 'Birler']
def s_onluk_birlik(T, p, t, D):
    gr = p['gruplar']; x = 70; bas = 0.3
    yuz_var = any(g.get('yuzluk', 0) for g in gr)
    kup = 20 if yuz_var else 24
    toplam_parca = sum(g.get('yuzluk', 0) + g.get('onluk', 0) + g.get('birlik', 0) * 0.6 for g in gr)
    adim = min(0.35, (D * 0.45) / max(toplam_parca, 1))
    for i, g in enumerate(gr):
        renk = RENK.get(g.get('renk', ''), GRUP_RENK[i % 3])
        x, bas = blok_ciz(T, g.get('onluk', 0), g.get('birlik', 0), x, renk, t, bas, adim, kup, g.get('yuzluk', 0))
        if i < len(gr) - 1:
            T.text(x + 30, 400, p.get('isaret', '+'), 60, fade(INK, A(t, bas)))
            x += 70
    sx = 1010; y = 180
    if p.get('tablo'):
        tb = [str(d) for d in p['tablo']]; L = len(tb); a = A(t, bas, 0.5)
        x0, x1 = (820, 1200) if gr else (440, 840); cw = (x1 - x0) / L
        if not gr: sx = 640
        T.rect(x0, 140, x1, 210, fade((234, 243, 222), a), fade(ACC, a), 2, r=8)
        T.rect(x0, 210, x1, 320, fade(WHITE, a), fade(ACC, a), 2, r=8)
        for j in range(L):
            cx = x0 + cw * j + cw / 2
            if j: T.line([(x0 + cw * j, 140), (x0 + cw * j, 320)], fade(ACC, a), 2)
            T.text(cx, 175, BASAMAK_AD[4 - L + j], 30 if L <= 2 else 22, fade((39, 80, 10), a))
            T.text(cx, 265, tb[j], 70 if L <= 3 else 58, fade(GRUP_RENK[0], a))
        y = 390
    for j, st in enumerate(p.get('sag', [])):
        a = A(t, bas + 0.2 + j * 0.6, 0.5)
        T.text(sx, y + j * 80, st, 48 if len(st) < 12 else 38 if len(st) < 18 else 30, fade(ACC if j == len(p['sag']) - 1 and len(p['sag']) > 1 else INK, a))

def s_sayi_dogrusu(T, p, t, D):
    bas, son = p['bas'], p['son']; adim = p.get('adim', 1); et = p.get('etiket_aralik', adim)
    x0, x1, y = 90, 1190, 420
    X = lambda v: x0 + (v - bas) / (son - bas) * (x1 - x0)
    a0 = A(t, 0.1, 0.5)
    T.line([(x0 - 30, y), (x1 + 30, y)], fade(INK, a0), 4)
    T.poly([(x1 + 40, y), (x1 + 24, y - 10), (x1 + 24, y + 10)], fade(INK, a0))
    isr = set(p.get('isaretle', []))
    ia = A(t, p.get('isaret_zaman', 0.6), 0.5)
    v = bas
    while v <= son + 1e-9:
        xx = X(v); uzun = (v - bas) % et == 0
        T.line([(xx, y - (14 if uzun else 8)), (xx, y + (14 if uzun else 8))], fade(INK, a0), 3 if uzun else 2)
        if v in isr and ia > 0:
            T.circle(xx, y + 52, 26, fade((234, 243, 222), ia), fade(ACC, ia), 3)
            T.text(xx, y + 52, v, 30, fade(ACC, ia))
        elif uzun and all(abs(X(h) - xx) > 44 for h in isr):
            T.text(xx, y + 48, v, 28 if (son - bas) / et <= 20 else 22, fade(INK, a0))
        v += adim
    hops = p.get('atlamalar', [])
    hs = p.get('atlama_zaman', 0.6); hd = min(0.9, (D * 0.6) / max(len(hops), 1))
    hz = None
    if p.get('sayim') and hops:
        zl = sayim_zamanlari(p, D, len(hops))
        if zl:
            hd = max(0.25, min(0.6, (zl[-1] - zl[0]) / (len(hops) - 1))) if len(hops) > 1 else 0.5
            hz = [z - hd * 0.8 for z in zl]; hs = hz[0]
    for k, (f, to) in enumerate(hops):
        pr = ease((t - (hz[k] if hz else hs + k * hd)) / (hd * 0.85))
        if pr <= 0: break
        xa, xb = X(f), X(to); hgt = min(110, abs(xb - xa) * 0.6 + 25)
        m = max(2, int(24 * pr))
        pts = [(xa + (xb - xa) * (i / 24), y - 6 - hgt * math.sin(math.pi * i / 24)) for i in range(m + 1)]
        renk = RENK['turuncu'] if to >= f else RENK['mor']
        T.line(pts, renk, 4)
        T.circle(pts[-1][0], pts[-1][1], 9, renk)
        if pr >= 1:
            d = to - f
            T.text((xa + xb) / 2, y - hgt - 28, ('+' if d > 0 else '−') + str(abs(d)), 24 if abs(xb - xa) > 45 else 18, renk)
    if p.get('ifade'):
        T.text(640, 175, p['ifade'], 54, fade(ACC, A(t, (hz[-1] + hd) if hz else hs + len(hops) * hd + 0.2, 0.6)))

def kutu_nesneler(T, n, tur, renkler, x0, y0, x1, y1, t, bas, adim, max_h=62, sutun=5):
    pos, h = izgara(n, min(sutun, max(n, 1)), x0 + 10, y0 + 10, x1 - 10, y1 - 10, max_h)
    for i, (x, y) in enumerate(pos):
        nesne(T, tur, x, y, h * 0.36, A(t, bas + i * adim, 0.3), renkler[i] if isinstance(renkler, list) else renkler)
    return bas + n * adim

def s_toplama(T, p, t, D):
    a_, b_ = p['a'], p['b']; c_ = a_ + b_; tur = p.get('nesne', 'elma')
    r1 = RENK[p.get('renk1', 'kirmizi')]; r2 = RENK[p.get('renk2', 'sari')]
    adim = min(0.3, (D * 0.25) / max(a_ + b_, 1))
    kutular = [(50, 300), (400, 650), (800, 1230)]
    for x0, x1 in kutular:
        T.rect(x0, 150, x1, 440, WHITE, LINE, 2, r=20)
    z = kutu_nesneler(T, a_, tur, r1, 50, 150, 300, 440, t, 0.3, adim, sutun=3 if a_ <= 9 else 4)
    z = kutu_nesneler(T, b_, tur, r2, 400, 150, 650, 440, t, z + 0.2, adim, sutun=3 if b_ <= 9 else 4)
    z += 0.5
    zs = an(p, D, c_, None)
    if zs is not None: z = max(z, zs - 0.6 - c_ * adim * 0.6)
    T.text(350, 295, '+', 64, fade(INK, A(t, 0.5))); T.text(725, 295, '=', 64, fade(INK, A(t, z)))
    kutu_nesneler(T, c_, tur, [r1] * a_ + [r2] * b_, 800, 150, 1230, 440, t, z, adim * 0.6, sutun=5)
    T.text(175, 500, a_, 54, fade(INK, A(t, 0.3))); T.text(525, 500, b_, 54, fade(INK, A(t, 0.5 + a_ * adim)))
    T.text(1015, 500, c_, 60, fade(ACC, A(t, max(z + c_ * adim * 0.6, zs if zs is not None else 0))))

def s_cikarma(T, p, t, D):
    a_, b_ = p['a'], p['b']; tur = p.get('nesne', 'elma')
    pos, h = izgara(a_, 5, 60, 120, 700, 540, 110)
    adim = min(0.3, D * 0.2 / a_)
    for i, (x, y) in enumerate(pos): nesne(T, tur, x, y, h * 0.36, A(t, 0.3 + i * adim, 0.3))
    bas = 0.5 + a_ * adim + 0.3; adim2 = min(0.5, D * 0.25 / max(b_, 1))
    for j in range(b_):
        i = a_ - 1 - j; x, y = pos[i]; a = A(t, bas + j * adim2, 0.35)
        if a > 0:
            T.circle(x, y, h * 0.42, (255, 248, 236) if a >= 1 else None)
            nesne(T, tur, x, y, h * 0.36, 1 - 0.75 * a)
            L = h * 0.32 * a
            T.line([(x - L, y - L), (x + L, y + L)], RENK['kirmizi'], 6); T.line([(x - L, y + L), (x + L, y - L)], RENK['kirmizi'], 6)
    son = bas + b_ * adim2 + 0.3
    son = max(son, an(p, D, a_ - b_, 0))
    ifade_ciz(T, 980, 330, [a_, '−', b_, '=', a_ - b_], 62, A(t, son), [None, None, None, None, ACC])

def s_dizi(T, p, t, D):
    r, c = p['satir'], p['sutun']; tur = p.get('nesne', 'nokta')
    pos, h = izgara(r * c, c, 140, 100, 1140, 420, 95)
    adim = min(0.8, D * 0.5 / r)
    for i, (x, y) in enumerate(pos):
        row = i // c; nesne(T, tur, x, y, h * 0.34, A(t, 0.3 + row * adim, 0.4), GRUP_RENK[row % 3] if tur == 'nokta' else None)
    for row in range(r):
        a = A(t, 0.3 + row * adim, 0.4)
        if a > 0:
            y = pos[row * c][1]; T.rect(pos[row * c][0] - h / 2 + 4, y - h / 2 + 4, pos[row * c + c - 1][0] + h / 2 - 4, y + h / 2 - 4, None, fade(LINE, a), 2, r=12)
    gor = sum(1 for row in range(r) if A(t, 0.3 + row * adim, 0.4) > 0)
    parca = []
    for i in range(gor):
        if i: parca.append('+')
        parca.append(c)
    son = 0.3 + r * adim + 0.3
    son = max(son, an(p, D, r * c, 0) - 0.6)
    if gor: 
        if A(t, son) > 0: parca += ['=', r * c]
        ifade_ciz(T, 640, 480, parca, 44, 1.0)
    ifade_ciz(T, 640, 548, [r, '×', c, '=', r * c], 50, A(t, son + 0.6), [ACC, ACC, ACC, ACC, ACC])

def s_paylastirma(T, p, t, D):
    n, k = p['toplam'], p['grup']; tur = p.get('nesne', 'elma'); mod = p.get('mod', 'paylas')
    q, r = divmod(n, k)
    sonuc = f'{n} ÷ {k} = {q}' + (f', kalan {r}' if r else '')
    if mod == 'paylas':
        gen = 1100 / k; kut = []
        for g in range(k):
            x0 = 90 + g * gen + 12; kut.append((x0 + 20, 330, x0 + gen - 44, 490))
            T.ellipse(x0, 450, x0 + gen - 24, 520, (234, 225, 205))
        yig, h = izgara(n, min(n, 12), 140, 110, 1140, 240, 70)
        dagit = q * k
        adim = min(0.45, D * 0.55 / max(dagit, 1)); bas = 0.5
        for i in range(n):
            sx, sy = yig[i]
            if i >= dagit:
                nesne(T, tur, sx, sy, h * 0.34, A(t, 0.1, 0.4))
                continue
            g = i % k; sira = i // k
            slot, hs = izgara(q, min(q, 3), *kut[g], 70)
            pr = ease((t - bas - i * adim) / 0.4)
            ex, ey = slot[sira]
            x = sx + (ex - sx) * pr; y = sy + (ey - sy) * pr - math.sin(math.pi * pr) * 60
            nesne(T, tur, x, y, min(h, hs) * 0.34, A(t, 0.1, 0.4))
        son = bas + dagit * adim + 0.3
        if r:
            ra = A(t, son, 0.5)
            for i in range(dagit, n):
                sx, sy = yig[i]; T.circle(sx, sy, h * 0.46, None, fade(RENK['kirmizi'], ra), 3)
            T.text(yig[n - 1][0] + h * 0.6, yig[n - 1][1], 'kalan', 28, fade(RENK['kirmizi'], ra), anchor='lm')
        for g in range(k):
            x0, _, x1, _ = kut[g]; T.text((x0 + x1) / 2, 545, q, 36, fade(ACC, A(t, son)))
        T.text(640, 285 if r else 150, sonuc, 44 if r else 54, fade(ACC, A(t, max(son + 0.5, an(p, D, q, 0)))))
    else:
        sut = k * max(1, min(n, 12) // k)
        pos, h = izgara(n, sut, 80, 160, 1200, 460, 90)
        adim_g = min(0.8, D * 0.5 / max(q, 1))
        for i, (x, y) in enumerate(pos): nesne(T, tur, x, y, h * 0.34, A(t, 0.2, 0.4))
        for g in range(q):
            a = A(t, 0.8 + g * adim_g, 0.4)
            if a <= 0: continue
            xs = [pos[i][0] for i in range(g * k, g * k + k)]; ys = [pos[i][1] for i in range(g * k, g * k + k)]
            T.rect(min(xs) - h * 0.47, min(ys) - h * 0.47, max(xs) + h * 0.47, max(ys) + h * 0.47, None, fade(GRUP_RENK[g % 3], a), 4, r=18)
            if n <= sut: T.text((min(xs) + max(xs)) / 2, max(ys) + h * 0.47 + 26, f'{g + 1}. grup', 22, fade(GRUP_RENK[g % 3], a), bold=False)
        son = 0.8 + q * adim_g + 0.3
        if r:
            ra = A(t, son - 0.2, 0.4)
            for i in range(q * k, n):
                x, y = pos[i]; T.circle(x, y, h * 0.48, None, fade(RENK['kirmizi'], ra), 4)
        T.text(640, 545, sonuc, 50, fade(ACC, A(t, max(son, an(p, D, q, 0)))))

def s_saat(T, p, t, D):
    cx, cy, R = 400, 330, 205
    h, m = p['saat'], p.get('dakika', 0)
    hedef = (h % 12) * 60 + m
    if p.get('onceki'):
        oh, om = p['onceki']; bas = (oh % 12) * 60 + om
        if hedef < bas: hedef += 720
        cur = bas + (hedef - bas) * ease((t - 0.5) / 1.8)
    else: cur = hedef
    T.circle(cx, cy, R + 14, (24, 95, 165)); T.circle(cx, cy, R, WHITE)
    if p.get('dilim'):
        mm = cur % 60
        if mm > 0.5: T.pie(cx, cy, R - 4, 270, 270 + mm * 6, (250, 238, 218))
    for i in range(60):
        an = math.radians(i * 6 - 90); L = 20 if i % 5 == 0 else 9
        T.line([(cx + (R - 6) * math.cos(an), cy + (R - 6) * math.sin(an)), (cx + (R - 6 - L) * math.cos(an), cy + (R - 6 - L) * math.sin(an))], INK, 4 if i % 5 == 0 else 2)
    for i in range(1, 13):
        an = math.radians(i * 30 - 90); T.text(cx + (R - 55) * math.cos(an), cy + (R - 55) * math.sin(an), i, 36, INK)
    ma = math.radians((cur % 60) * 6 - 90); ha = math.radians((cur / 60 % 12) * 30 - 90)
    T.cap_line(cx, cy, cx + (R - 45) * math.cos(ma), cy + (R - 45) * math.sin(ma), (220, 40, 40), 9)
    T.cap_line(cx, cy, cx + (R - 95) * math.cos(ha), cy + (R - 95) * math.sin(ha), (12, 35, 80), 15)
    T.circle(cx, cy, 13, (12, 35, 80))
    a = A(t, 0.8 if not p.get('onceki') else 2.3, 0.5)
    if p.get('dijital', True):
        T.rect(830, 210, 1170, 320, fade((12, 35, 80), a), None, 0, r=16)
        T.text(1000, 265, f'{h:02d}:{m:02d}', 70, fade((250, 199, 117), a))
    if p.get('etiket'): T.text(1000, 400, p['etiket'], 40, fade(ACC, A(t, (2.6 if p.get('onceki') else 1.1), 0.5)))
    if p.get('bilgi'):
        for j, s in enumerate(p['bilgi']): T.text(1000, 470 + j * 50, s, 28, fade(INK, A(t, 1.4 + j * 0.5)), bold=False)

SEKIL_AD = {'ucgen': 'Üçgen', 'kare': 'Kare', 'dikdortgen': 'Dikdörtgen', 'daire': 'Daire', 'besgen': 'Beşgen', 'altigen': 'Altıgen',
            'eskenar': 'Eşkenar', 'ikizkenar': 'İkizkenar', 'cesitkenar': 'Çeşitkenar', 'dik_ucgen': 'Dik üçgen'}
SEKIL_RENK = {'ucgen': 'sari', 'kare': 'mavi', 'dikdortgen': 'mor', 'daire': 'kirmizi', 'besgen': 'turkuaz', 'altigen': 'turuncu',
              'eskenar': 'sari', 'ikizkenar': 'turkuaz', 'cesitkenar': 'pembe', 'dik_ucgen': 'turuncu'}
UCGEN_TIP = {'eskenar': None, 'ikizkenar': [(0, -1.25), (0.75, 0.85), (-0.75, 0.85)],
             'cesitkenar': [(-0.45, -1.0), (1.2, 0.85), (-1.1, 0.85)], 'dik_ucgen': [(-0.9, -1.0), (-0.9, 0.85), (1.1, 0.85)]}
def kose_noktalari(tur, x, y, r):
    if tur in UCGEN_TIP and UCGEN_TIP[tur]: return [(x + a * r, y + b * r) for a, b in UCGEN_TIP[tur]]
    if tur == 'eskenar': tur = 'ucgen'
    if tur == 'kare': return [(x - r, y - r), (x + r, y - r), (x + r, y + r), (x - r, y + r)]
    if tur == 'dikdortgen': return [(x - r * 1.4, y - r * 0.8), (x + r * 1.4, y - r * 0.8), (x + r * 1.4, y + r * 0.8), (x - r * 1.4, y + r * 0.8)]
    n = {'ucgen': 3, 'besgen': 5, 'altigen': 6}.get(tur)
    if not n: return []
    return [(x + r * 1.1 * math.cos(-math.pi / 2 + 2 * math.pi * i / n), y + r * 0.15 + r * 1.1 * math.sin(-math.pi / 2 + 2 * math.pi * i / n)) for i in range(n)]

def s_sekil(T, p, t, D):
    if p.get('sekiller'):
        lst = p['sekiller']; gen = 1180 / len(lst)
        for i, tur in enumerate(lst):
            a = A(t, 0.3 + i * 0.6, 0.5); x = 50 + gen * i + gen / 2
            if a > 0:
                cizim_sekil(T, tur, x, 300, min(80, gen * 0.3) * (0.7 + 0.3 * a), RENK[SEKIL_RENK[tur]], a)
                T.text(x, 440, SEKIL_AD[tur], 34, fade(INK, a))
        return
    tur = p['sekil']; x, y, r = 380, 330, 160
    cizim_sekil(T, tur, x, y, r, RENK[SEKIL_RENK[tur]], A(t, 0.1))
    ks = kose_noktalari(tur, x, y, r); n = len(ks); bas = 0.8
    adim = min(0.5, D * 0.2 / max(n, 1))
    for i in range(n):
        a = A(t, bas + i * adim, 0.3)
        if a > 0:
            p0, p1 = ks[i], ks[(i + 1) % n]
            T.line([p0, (p0[0] + (p1[0] - p0[0]) * a, p0[1] + (p1[1] - p0[1]) * a)], ACC, 9)
            if a >= 1:
                mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2; dx, dy = mx - x, my - y; L = math.hypot(dx, dy) or 1
                T.circle(mx + dx / L * 40, my + dy / L * 40, 20, (234, 243, 222), ACC, 2); T.text(mx + dx / L * 40, my + dy / L * 40, i + 1, 22, ACC)
    bas2 = bas + n * adim + 0.2
    for i, (kx, ky) in enumerate(ks):
        a = A(t, bas2 + i * adim * 0.6, 0.3)
        if a > 0: T.circle(kx, ky, 13 * a, RENK['kirmizi'], WHITE, 3)
    if tur == 'daire' and A(t, 0.8) > 0:
        T.circle(x, y, r + 6, None, fade(ACC, A(t, 0.8)), 6)
    zam = [0.5, bas2 if n else 1.2, bas2 + n * adim * 0.6 + 0.2 if n else 1.8]
    for j, s in enumerate(p.get('bilgi', [])):
        z = zam[j] if j < len(zam) else zam[-1] + 0.5 * (j - len(zam) + 1)
        T.text(960, 240 + j * 75, s, 44, fade(INK if j else ACC, A(t, z)))

def token_ciz(T, tok, x, y, s, a):
    if isinstance(tok, str) and tok and ord(tok[0]) > 0x2000 and not tok[0].isalpha():
        emoji(T, tok, x, y, s * 0.72, a); return
    if isinstance(tok, (int, float)) or '-' not in str(tok):
        L = len(str(tok)); T.text(x, y, tok, s * {1: 0.72, 2: 0.52, 3: 0.38}.get(L, 0.3), fade(INK, a))
    else:
        rk, tur = tok.split('-'); cizim_sekil(T, tur, x, y, s * 0.42 * (0.7 + 0.3 * a), RENK[rk], a)

def s_oruntu(T, p, t, D):
    d = p['dizi']; eksik = set(p.get('eksik', [])); n = len(d)
    gen = min(150, 1160 / n); s = gen - 16; x0 = 640 - gen * n / 2 + gen / 2
    cz = p.get('cevap_zaman') or an_ilk(p, D, ['Sıradaki', 'sıradaki', 'Boş kutuya', 'Boşluklara', 'Boş yere', 'boşluklara'], D * 0.62)
    cevap_a = A(t, cz, 0.5)
    # sayılar anlatımda söylendikçe belirsin
    gz = []; imlec = 0; metin = p.get('anlatim', '')
    for i, tok in enumerate(d):
        z = None
        if isinstance(tok, int) and i not in eksik:
            k = metin.find(str(tok), imlec)
            if k >= 0: z = zaman_at(p, D, k); imlec = k + len(str(tok))
        gz.append(z)
    onceki = 0.0
    for i in range(n):
        if gz[i] is None: gz[i] = (onceki + 0.3) if i else 0.3
        onceki = gz[i]
    for i, tok in enumerate(d):
        a = A(t, gz[i], 0.3); x = x0 + i * gen
        if a <= 0: continue
        ek = i in eksik
        T.rect(x - s / 2, 330 - s / 2, x + s / 2, 330 + s / 2, fade(WHITE, a), fade(ACC if ek and cevap_a > 0 else LINE, a), 3 if ek else 2, r=14)
        if ek:
            if cevap_a > 0: token_ciz(T, tok, x, 330, s, cevap_a)
            else: T.text(x, 330, '?', s * 0.6, fade(RENK['turuncu'], a))
        else: token_ciz(T, tok, x, 330, s, a)
    if p.get('kural'): T.text(640, 470, p['kural'], 40, fade(ACC, cevap_a))

def s_karsilastirma(T, p, t, D):
    a_, b_ = p['a'], p['b']; mx = max(a_, b_, 1); tavan = p.get('tavan', 100)
    for x, v, rk in [(330, a_, GRUP_RENK[0]), (950, b_, GRUP_RENK[1])]:
        h = 300 * v / max(tavan, mx) * A(t, 0.3, 1.0)
        T.rect(x - 70, 540 - h, x + 70, 540, rk, None, 0, r=8)
        T.text(x, 540 - h - 55, v, 76, INK)
    T.line([(180, 540), (1100, 540)], LINE, 3)
    isr = '<' if a_ < b_ else '>' if a_ > b_ else '='
    iz = an_ilk(p, D, ['daha büyük', 'daha küçük', 'büyüktür', 'küçüktür', 'fazladır', 'eşittir', 'eşit'], p.get('isaret_zaman', 1.8))
    p = dict(p, isaret_zaman=iz)
    a = A(t, p.get('isaret_zaman', 1.8), 0.5)
    if a > 0:
        T.circle(640, 360, 70 * a, (234, 243, 222), ACC, 3); T.text(640, 356, isr, 90 * a, ACC)
    T.text(640, 150, f'{a_} {isr} {b_}', 50, fade(ACC, A(t, p.get('isaret_zaman', 1.8) + 0.8)))

PARA = {'5 kr': ('madeni', (190, 150, 60), 48), '10 kr': ('madeni', (200, 160, 70), 52), '25 kr': ('madeni', (205, 165, 75), 56),
        '50 kr': ('madeni', (180, 180, 185), 60), '1 TL': ('madeni2', (205, 165, 75), 66),
        '5 TL': ('kagit', (160, 120, 170)), '10 TL': ('kagit', (215, 80, 80)), '20 TL': ('kagit', (90, 160, 110)),
        '50 TL': ('kagit', (230, 150, 60)), '100 TL': ('kagit', (80, 130, 200)), '200 TL': ('kagit', (200, 110, 160))}
def s_para(T, p, t, D):
    lst = p['paralar']; x, y = 0, 0; satir_h = 0; yer = []
    for v in lst:
        b = PARA[v]; w = b[2] * 2 if b[0] != 'kagit' else 240; h = b[2] * 2 if b[0] != 'kagit' else 125
        if x + w > 1100: x = 0; y += satir_h + 40; satir_h = 0
        yer.append([x, y, w, h]); x += w + 30; satir_h = max(satir_h, h)
    tw = max(e[0] + e[2] for e in yer); th = y + satir_h
    ox = 640 - tw / 2; oy = 320 - th / 2
    for e in yer:
        satirdaki = [f for f in yer if f[1] == e[1]]; rh = max(f[3] for f in satirdaki)
        e[1] += (rh - e[3]) / 2
    adim = min(0.6, D * 0.5 / len(lst))
    for i, (v, (x, y, w, h)) in enumerate(zip(lst, yer)):
        a = A(t, 0.3 + i * adim, 0.4); x += ox; y += oy
        if a <= 0: continue
        tip, c = PARA[v][0], PARA[v][1]
        if tip == 'kagit':
            T.rect(x, y, x + w, y + h, fade(c, a), fade(lerp(c, INK, 0.4), a), 3, r=10)
            T.rect(x + 12, y + 12, x + w - 12, y + h - 12, None, fade(lerp(c, WHITE, 0.5), a), 2, r=6)
            T.text(x + w / 2, y + h / 2, v, 36, fade(WHITE, a))
        else:
            r = w / 2
            T.circle(x + r, y + r, r, fade(c, a), fade(lerp(c, INK, 0.3), a), 2)
            if tip == 'madeni2': T.circle(x + r, y + r, r * 0.68, fade((190, 190, 195), a))
            T.text(x + r, y + r, v, max(20, r * 0.45), fade(INK, a))
    if p.get('toplam'): T.text(640, 540, p['toplam'], 48, fade(ACC, A(t, 0.3 + len(lst) * adim + 0.3)))

def s_uzunluk(T, p, t, D):
    L = p['uzunluk']; cm_max = p.get('cetvel', 20); x0 = 140; px = 1000 / cm_max; tur = p.get('nesne', 'kalem')
    T.rect(x0 - 30, 380, x0 + 1000 + 30, 460, (250, 220, 130), (186, 140, 40), 3, r=8)
    for i in range(cm_max * 2 + 1):
        xx = x0 + i * px / 2; L2 = 30 if i % 2 == 0 else 16
        T.line([(xx, 380), (xx, 380 + L2)], INK, 3 if i % 2 == 0 else 2)
        if i % 2 == 0: T.text(xx, 435, i // 2, 22, INK)
    a = A(t, 0.3, 0.6); off = (1 - a) * 200; w = L * px
    if tur == 'kalem':
        T.rect(x0 + off, 290, x0 + off + w - 50, 340, fade((239, 159, 39), a), fade((186, 117, 23), a), 2, r=4)
        T.rect(x0 + off, 290, x0 + off + 30, 340, fade((212, 83, 126), a), None, 0, r=4)
        T.poly([(x0 + off + w - 50, 290), (x0 + off + w, 315), (x0 + off + w - 50, 340)], fade((245, 220, 180), a))
        T.poly([(x0 + off + w - 16, 305), (x0 + off + w, 315), (x0 + off + w - 16, 325)], fade(INK, a))
    else:
        T.rect(x0 + off, 295, x0 + off + w, 335, fade(RENK.get(p.get('renk', 'mavi'), RENK['mavi']), a), None, 0, r=8)
    b = A(t, 1.3, 0.8)
    if b > 0:
        T.line([(x0, 490), (x0 + w * b, 490)], ACC, 5); T.line([(x0, 478), (x0, 502)], ACC, 5)
        if b >= 1: T.line([(x0 + w, 478), (x0 + w, 502)], ACC, 5)
    T.text(x0 + w / 2, 540, f"{L} {p.get('birim', 'cm')}", 46, fade(ACC, A(t, 2.0)))
    if p.get('ust'): T.text(640, 170, p['ust'], 40, fade(INK, A(t, 0.5)))

def s_grafik(T, p, t, D):
    et, dg = p['etiketler'], p['degerler']; mx = max(dg); adimg = 1 if mx <= 10 else 2 if mx <= 20 else 5
    ust = math.ceil(mx / adimg) * adimg; x0, x1, y0, y1 = 200, 1120, 175, 500
    for v in range(0, ust + 1, adimg):
        y = y1 - (y1 - y0) * v / ust; T.line([(x0, y), (x1, y)], LINE, 2); T.text(x0 - 30, y, v, 22, MUTED, bold=False)
    T.line([(x0, y0 - 10), (x0, y1)], INK, 3); T.line([(x0, y1), (x1, y1)], INK, 3)
    gen = (x1 - x0) / len(dg)
    for i, (e, v) in enumerate(zip(et, dg)):
        a = A(t, 0.4 + i * 0.5, 0.8); x = x0 + gen * i + gen / 2; h = (y1 - y0) * v / ust * a
        T.rect(x - gen * 0.3, y1 - h, x + gen * 0.3, y1, RENK[['kirmizi', 'sari', 'pembe', 'turuncu', 'mavi', 'yesil'][i % 6]], None, 0, r=6)
        if a >= 1: T.text(x, y1 - h - 24, v, 30, INK)
        T.text(x, y1 + 30, e, 26, INK)
    if p.get('baslik'): T.text(660, 105, p['baslik'], 30, fade(MUTED, A(t, 0.2)), bold=False)

def s_alt_alta(T, p, t, D):
    u, a_, op = p['ust'], p['alt'], p.get('islem', '+')
    son = u + a_ if op == '+' else u - a_ if op == '-' else u * a_
    ud = [int(c) for c in str(u)][::-1]; ad = [int(c) for c in str(a_)][::-1]; sd = [int(c) for c in str(son)][::-1]
    nc = max(len(ud), len(ad), len(sd))
    sz = 96 if nc <= 3 else 84; dx = sz * 0.78
    xr = 700 if not p.get('not') else 620
    X = lambda j: xr - j * dx
    ys = [210, 320]; yl = 380; yr = 450
    z0, z1 = D * 0.04, D * 0.14; zc0, zc1 = D * 0.22, D * 0.86
    stp = (zc1 - zc0) / nc
    # elde / ödünç hesapları
    elde = [0] * (nc + 1); yeni = list(ud) + [0] * (nc - len(ud)); degisim = {}
    if op in ('+', '×'):
        c = 0
        for j in range(nc):
            if op == '+': v = (ud[j] if j < len(ud) else 0) + (ad[j] if j < len(ad) else 0) + c
            else: v = (ud[j] * a_ + c) if j < len(ud) else c
            c = v // 10; elde[j + 1] = c
    else:
        for j in range(len(ud)):
            b = ad[j] if j < len(ad) else 0
            if yeni[j] < b:
                yeni[j] += 10; degisim.setdefault(j, j)
                yeni[j + 1] -= 1; degisim[j + 1] = j
        for j in list(degisim): degisim[j] = min(degisim[j], j)
    aktif = int((t - zc0) // stp) if zc0 <= t < zc1 + 0.6 else -1
    if 0 <= aktif < nc: T.rect(X(aktif) - dx * 0.55, 150, X(aktif) + dx * 0.55, 500, (234, 243, 222), None, 0, r=12)
    a0 = A(t, z0)
    for j, d in enumerate(ud):
        T.text(X(j), ys[0], d, sz, fade(INK, a0))
        if j in degisim:
            bz = A(t, zc0 + degisim[j] * stp, 0.4)
            if bz > 0:
                T.line([(X(j) - 28, ys[0] + 30), (X(j) + 28, ys[0] - 30)], RENK['kirmizi'], max(1, 6 * bz))
                T.text(X(j), ys[0] - 78, yeni[j], 40, fade(RENK['kirmizi'], bz))
    for j, d in enumerate(ad): T.text(X(j), ys[1], d, sz, fade(INK, a0))
    for j in range(1, nc):
        if elde[j] and op in ('+', '×') and j < (len(ud) if op == '×' else max(len(ud), len(ad))):
            T.text(X(j), ys[0] - 78, elde[j], 40, fade(RENK['kirmizi'], A(t, zc0 + (j - 0.5) * stp, 0.4)))
    solx = X(nc - 1) - dx * 1.2
    T.text(solx, ys[1], {'+': '+', '-': '−', '×': '×'}[op], sz, fade(INK, a0))
    T.line([(solx - dx * 0.5, yl), (X(0) + dx * 0.6, yl)], fade(INK, A(t, z1)), 6)
    for j, d in enumerate(sd): T.text(X(j), yr, d, sz, fade(ACC, A(t, zc0 + (j + 0.5) * stp, 0.4)))
    if p.get('not'): T.text(1030, 330, p['not'], 32, fade(MUTED, A(t, zc0)), bold=False)

def s_alan_cevre(T, p, t, D):
    w, h = p['en'], p['boy']; mod = p.get('mod', 'alan')
    u = min(64, 620 / w, 380 / h); x0 = 420 - u * w / 2; y0 = 320 - u * h / 2
    n = w * h; adim = min(0.3, D * 0.45 / n) if mod == 'alan' else 0
    say = 0
    for i in range(n):
        cx, cy = i % w, i // w
        a = A(t, 0.6 + i * adim, 0.25) if mod == 'alan' else 1.0
        fill = lerp(WHITE, (192, 221, 151), a) if mod == 'alan' else (234, 243, 222)
        if mod == 'alan' and a > 0: say = i + 1
        T.rect(x0 + cx * u, y0 + cy * u, x0 + (cx + 1) * u, y0 + (cy + 1) * u, fill, (150, 170, 130), 2)
        if mod == 'alan' and a >= 1 and u >= 40: T.text(x0 + (cx + 0.5) * u, y0 + (cy + 0.5) * u, i + 1, max(14, u * 0.34), (39, 80, 10), bold=False)
    T.rect(x0, y0, x0 + w * u, y0 + h * u, None, INK, 3)
    T.text(x0 + w * u / 2, y0 - 28, f'{w} birim', 26, MUTED, bold=False)
    T.text(x0 - 20, y0 + h * u / 2, f'{h} birim', 26, MUTED, bold=False, anchor='rm')
    if mod == 'cevre':
        yol = [(x0 + i * u, y0) for i in range(w + 1)] + [(x0 + w * u, y0 + j * u) for j in range(1, h + 1)] + \
              [(x0 + (w - i) * u, y0 + h * u) for i in range(1, w + 1)] + [(x0, y0 + (h - j) * u) for j in range(1, h + 1)]
        L = len(yol) - 1; pr = max(0.0, min(1.0, (t - 0.6) / max(0.5, D * 0.55)))
        k = pr * L; tam = int(k)
        pts = yol[:tam + 1]
        if tam < L: pts = pts + [(yol[tam][0] + (yol[tam + 1][0] - yol[tam][0]) * (k - tam), yol[tam][1] + (yol[tam + 1][1] - yol[tam][1]) * (k - tam))]
        if len(pts) > 1: T.line(pts, RENK['turuncu'], 9)
        for i in range(1, tam + 1): T.circle(yol[i][0], yol[i][1], 6, RENK['turuncu'])
        say = tam
    T.text(1000, 250, say, 100, INK)
    T.text(1000, 340, 'birim kare' if mod == 'alan' else 'birim', 32, MUTED, bold=False)
    if p.get('sonuc'): T.text(1000, 440, p['sonuc'], 36 if len(p['sonuc']) < 18 else 28, fade(ACC, A(t, 0.6 + (n * adim if mod == 'alan' else max(0.5, D * 0.55)) + 0.3)))

def s_aci(T, p, t, D):
    der = p['derece']; bas = p.get('onceki', 0)
    cur = bas + (der - bas) * ease((t - 0.5) / 1.5)
    vx, vy, L = 380, 440, 300
    T.cap_line(vx, vy, vx + L, vy, INK, 8)
    rad = math.radians(cur)
    ex, ey = vx + L * math.cos(rad), vy - L * math.sin(rad)
    if abs(cur - 90) < 0.5 and t > 2.0:
        q = 40; T.poly([(vx, vy), (vx + q, vy), (vx + q, vy - q), (vx, vy - q)], (234, 243, 222), ACC, 3)
    elif cur > 1:
        T.pie(vx, vy, 70, -cur, 0, (234, 243, 222)); T.d.arc([T.k(vx - 70), T.k(vy - 70), T.k(vx + 70), T.k(vy + 70)], -cur, 0, fill=ACC, width=int(T.k(4)))
    T.cap_line(vx, vy, ex, ey, RENK['mavi'], 8)
    T.circle(vx, vy, 10, RENK['kirmizi'])
    a = A(t, 2.1, 0.5)
    if p.get('ad'): T.text(1000, 260, p['ad'], 50, fade(ACC, a))
    if p.get('derece_goster'): T.text(1000, 340, f'{der}°', 44, fade(INK, a))
    for j, st in enumerate(p.get('bilgi', [])): T.text(1000, 420 + j * 50, st, 30, fade(INK, A(t, 2.5 + j * 0.5)), bold=False)

def s_kesir_seritleri(T, p, t, D):
    rows = p['satirlar']; n = len(rows)
    rh = min(80, 380 / n); gap = min(40, (420 - rh * n) / max(n, 1)); y0 = 320 - (rh * n + gap * (n - 1)) / 2
    adim = min(1.2, D * 0.55 / n)
    for i, rw in enumerate(rows):
        a = A(t, 0.3 + i * adim, 0.4); ba = A(t, 0.3 + i * adim + 0.5, 0.5)
        k, b = rw['parca'], rw.get('boya', 0)
        bars = max(1, math.ceil(b / k)) if b else 1
        bw = (700 - 20 * (bars - 1)) / bars; y = y0 + i * (rh + gap)
        renk = RENK.get(rw.get('renk', ''), [RENK['turuncu'], RENK['mavi'], RENK['mor'], RENK['turkuaz']][i % 4])
        for bi in range(bars):
            bx = 90 + bi * (bw + 20)
            for j in range(k):
                idx = bi * k + j
                fill = lerp(WHITE, renk, ba) if idx < b else WHITE
                T.rect(bx + j * bw / k, y, bx + (j + 1) * bw / k, y + rh, fade(fill, a), fade(INK, a), 2)
        if rw.get('etiket'): ifade_ciz(T, 1000, y + rh / 2, str(rw['etiket']).split(' '), min(44, rh * 0.5), ba)
    if p.get('ifade'): T.text(640, 560 if n > 3 else 540, p['ifade'], 40, fade(ACC, A(t, 0.3 + n * adim + 0.4)))

def s_kap(T, p, t, D):
    kaplar = p['kaplar']; n = len(kaplar); gen = min(260, 1000 / n)
    for i, k in enumerate(kaplar):
        cx = 640 + (i - (n - 1) / 2) * (gen + 40); w = gen * 0.7; top, bot = 150, 480
        a = A(t, 0.3 + i * 0.5, 0.4); fl = A(t, 0.8 + i * 0.7, 1.0)
        oran = k['dolu'] / k['max']; hs = (bot - top) * oran * fl
        T.rect(cx - w / 2, bot - hs, cx + w / 2, bot, fade((133, 183, 235), a), None, 0, r=4)
        T.line([(cx - w / 2, top), (cx - w / 2, bot), (cx + w / 2, bot), (cx + w / 2, top)], fade(INK, a), 5)
        for j in range(1, k.get('cizgi', 4)):
            yy = bot - (bot - top) * j / k.get('cizgi', 4); T.line([(cx + w / 2 - 22, yy), (cx + w / 2, yy)], fade(INK, a), 3)
        T.text(cx, 525, k.get('etiket', ''), 32, fade(ACC, A(t, 1.8 + i * 0.7)))
    if p.get('ifade'): T.text(640, 100, p['ifade'], 38, fade(INK, A(t, 1.2 + n * 0.7)))

def s_terazi(T, p, t, D):
    # egim: -1 sol ağır, 1 sağ ağır
    egim = -p.get('egim', 0) * 12 * ease((t - 1.0) / 1.2); cx, cy = 640, 250; L = 330
    T.poly([(cx - 70, 540), (cx + 70, 540), (cx + 14, cy), (cx - 14, cy)], (180, 178, 169))
    rad = math.radians(egim)
    lx, ly = cx - L * math.cos(rad), cy + L * math.sin(rad); rx, ry = cx + L * math.cos(rad), cy - L * math.sin(rad)
    T.cap_line(lx, ly, rx, ry, (95, 94, 90), 12); T.circle(cx, cy, 14, (95, 94, 90))
    for (px, py, et, rk) in [(lx, ly, p.get('sol', ''), RENK['turuncu']), (rx, ry, p.get('sag', ''), RENK['mavi'])]:
        T.line([(px, py), (px - 80, py + 120)], (95, 94, 90), 3); T.line([(px, py), (px + 80, py + 120)], (95, 94, 90), 3)
        T.rect(px - 110, py + 118, px + 110, py + 132, (95, 94, 90), None, 0, r=6)
        a = A(t, 0.4, 0.4)
        T.rect(px - 75, py + 48, px + 75, py + 118, fade(rk, a), None, 0, r=10); T.text(px, py + 83, et, 30 if len(et) < 9 else 22, fade(WHITE, a))
    if p.get('ifade'): T.text(640, 110, p['ifade'], 44, fade(ACC, A(t, 2.4)))

def s_sekil_grafigi(T, p, t, D):
    et, dg = p['etiketler'], p['degerler']; ol = p.get('olcek', 1); tur = p.get('nesne', 'yildiz')
    n = len(et); rh = min(85, 360 / n); y0 = 345 - rh * (n - 1) / 2
    for i, (e, v) in enumerate(zip(et, dg)):
        y = y0 + i * rh; a = A(t, 0.3 + i * 0.6, 0.4)
        T.text(250, y, e, 30, fade(INK, a), anchor='rm')
        T.line([(270, y - rh / 2), (270, y + rh / 2)], fade(LINE, a), 2)
        for j in range(v // ol):
            nesne(T, tur, 320 + j * rh * 0.85, y, rh * 0.32, A(t, 0.4 + i * 0.6 + j * 0.08, 0.3))
    if p.get('anahtar'): T.text(640, 560, p['anahtar'], 30, fade(ACC, A(t, 0.3 + n * 0.6)))
    if p.get('baslik'): T.text(640, 92, p['baslik'], 30, fade(MUTED, A(t, 0.2)), bold=False)

def s_kelime(T, p, t, D):
    a = A(t, 0.2, 0.5)
    if p.get('adet') and p.get('emoji'):
        n = p['adet']; pos, h = izgara(n, min(n, 5), 80, 140, 640, 520, 110)
        for i, (x, y) in enumerate(pos): emoji(T, p['emoji'], x, y, h * 0.8, A(t, 0.2 + i * 0.08, 0.3))
    elif p.get('emoji'): emoji(T, p['emoji'], 360, 320, 300 * (0.7 + 0.3 * a), a)
    elif p.get('sol_yazi'): T.text(360, 320, p['sol_yazi'], 200, fade(RENK['mavi'], a))
    T.text(900, 270, p['buyuk'], 84 if len(p['buyuk']) < 10 else 60, fade(ACC, A(t, 0.5)))
    if p.get('kucuk'): T.text(900, 370, p['kucuk'], 44, fade(MUTED, A(t, p.get('kucuk_zaman', 1.2))), bold=False)
    if p.get('not'): T.text(900, 450, p['not'], 30, fade(INK, A(t, 1.8)), bold=False)

def s_kelimeler(T, p, t, D):
    it = p['ogeler']; n = len(it); sut = min(p.get('sutun', 4), n); sat = math.ceil(n / sut)
    cw = 1100 / sut; ch = min(210, 430 / sat); adim = min(0.7, D * 0.6 / n)
    y0 = 330 - ch * (sat - 1) / 2
    for i, o in enumerate(it):
        satirdaki = min(sut, n - (i // sut) * sut)
        x = 640 + (i % sut - (satirdaki - 1) / 2) * cw; y = y0 + ch * (i // sut)
        et = o[2] if len(o) > 2 and o[2] and not re.search(r'[a-zçğıöşü]', tr_kucuk(o[1])) else o[1]
        a = A(t, 0.3 + i * adim if p.get('ses') else oge_zamani(p, D, et, 0.3 + i * adim, i), 0.4)
        emoji(T, o[0], x, y - ch * 0.14, ch * 0.5 * (0.7 + 0.3 * a), a)
        T.text(x, y + ch * 0.28, o[1], 34 if len(o[1]) < 11 else 26, fade(ACC, a))
        if len(o) > 2 and o[2]: T.text(x, y + ch * 0.28 + 32, o[2], 22, fade(MUTED, a), bold=False)

def ok_ciz(T, x0, x1, y, renk, cift=True):
    T.line([(x0, y), (x1, y)], renk, 6)
    T.poly([(x1 + 4, y), (x1 - 18, y - 14), (x1 - 18, y + 14)], renk)
    if cift: T.poly([(x0 - 4, y), (x0 + 18, y - 14), (x0 + 18, y + 14)], renk)

def s_kelime_ciftleri(T, p, t, D):
    pr = p['ciftler']; n = len(pr); rh = min(110, 420 / n); y0 = 330 - rh * (n - 1) / 2; tip = p.get('bag', 'es')
    adim = min(1.2, D * 0.6 / n)
    for i, c in enumerate(pr):
        y = y0 + i * rh; a = A(t, 0.3 + i * adim, 0.4); b = A(t, 0.3 + i * adim + 0.5, 0.4)
        for (x0, x1, txt, em, aa) in [(150, 540, c[0], c[2] if len(c) > 2 else None, a), (740, 1130, c[1], c[3] if len(c) > 3 else None, b)]:
            T.rect(x0, y - rh * 0.4, x1, y + rh * 0.4, fade(WHITE, aa), fade(LINE, aa), 2, r=16)
            tx = (x0 + x1) / 2; alan = (x1 - x0) - 30
            if em: emoji(T, em, x0 + rh * 0.45, y, rh * 0.55, aa); tx += rh * 0.25; alan -= rh * 0.5
            fs = min(40, rh * 0.38); w0 = T.width(txt, fs)
            if w0 > alan: fs = fs * alan / w0
            T.text(tx, y, txt, fs, fade(INK, aa))
        if b > 0:
            if tip == 'es': T.text(640, y, '=', 56, fade(ACC, b))
            else: ok_ciz(T, 580, 700, y, fade(RENK['turuncu'], b))
    if p.get('baslik'): T.text(640, 92, p['baslik'], 30, fade(MUTED, A(t, 0.1)), bold=False)

def s_hece(T, p, t, D):
    kelime = p['kelime']; hc = p['heceler']; n = len(hc)
    if p.get('emoji'): emoji(T, p['emoji'], 640, 150, 130, A(t, 0.1))
    ya = 1 - A(t, 0.8, 0.3)
    if ya > 0: T.text(640, 320, kelime, 90, fade(INK, ya))
    size = 76 if n <= 3 else 60; gen = [T.width(h, size) + 50 for h in hc]; top = sum(gen) + 20 * (n - 1)
    x = 640 - top / 2; adim = min(0.7, max(0.2, (D - 1.8) / (n + 1)))
    metin = p.get('anlatim', '').lower(); zam = []
    kalip = ', '.join(hc).lower(); k = metin.find(kalip)
    if k >= 0:
        ofs = 0
        for h in hc:
            zam.append(zaman_at(p, D, k + ofs) or 1.0); ofs += len(h) + 2
    else:
        w = metin.find(kelime.lower()); t0 = zaman_at(p, D, w) if w >= 0 else 1.0
        zam = [max(0.8, (t0 or 1.0) - 0.4) + i * adim for i in range(n)]
    for i in range(1, n): zam[i] = max(zam[i], zam[i - 1] + 0.15)
    for i, (h, w) in enumerate(zip(hc, gen)):
        a = A(t, zam[i], 0.3)
        if a > 0:
            rk = [RENK['turuncu'], RENK['mavi'], RENK['mor'], RENK['turkuaz'], RENK['pembe']][i % 5]
            yy = 320 - 20 * (1 - a)
            T.rect(x, yy - 60, x + w, yy + 60, fade(lerp(WHITE, rk, 0.18), a), fade(rk, a), 3, r=18)
            T.text(x + w / 2, yy, h, size, fade(rk, a))
        x += w + 20
    T.text(640, 470, p.get('etiket', f'{n} hece'), 44, fade(ACC, A(t, zam[-1] + 0.4)))

def s_cumle(T, p, t, D):
    tok = p['parcalar']; vg = {int(k): v for k, v in p.get('vurgu', {}).items()}; size = p.get('boyut', 50)
    ws = [T.width(k, size) for k in tok]; sp = size * (0.55 if vg else 0.35)
    satirlar, cur, cw = [], [], 0
    for i, w in enumerate(ws):
        if cur and cw + sp + w > 1100: satirlar.append(cur); cur, cw = [], 0
        cur.append(i); cw += (sp if cw else 0) + w
    satirlar.append(cur)
    y0 = 300 - (len(satirlar) - 1) * 70
    vz = p.get('vurgu_zaman', 1.2)
    for si, sat in enumerate(satirlar):
        tw = sum(ws[i] for i in sat) + sp * (len(sat) - 1); x = 640 - tw / 2; y = y0 + si * 140
        for i in sat:
            a = A(t, 0.3 + i * 0.12, 0.3)
            if i in vg:
                b = A(t, vz + list(vg).index(i) * 0.6, 0.4)
                rk = RENK.get(p.get('renk', 'turuncu'), RENK['turuncu'])
                if b > 0:
                    T.rect(x - 10, y - size * 0.7, x + ws[i] + 10, y + size * 0.7, lerp(BG, lerp(WHITE, rk, 0.25), b), fade(rk, b), 3, r=12)
                    if vg[i]: T.text(x + ws[i] / 2, y + size * 0.7 + 26, vg[i], 24, fade(rk, b), bold=False)
            T.text(x + ws[i] / 2, y, tok[i], size, fade(INK, a))
            x += ws[i] + sp

def s_konum(T, p, t, D):
    il = p['iliski']; ref, ana = p['ref'], p['ana']; a = A(t, 0.2, 0.4); b = A(t, 0.7, 0.4)
    cx, cy = 450, 340
    off = {'ustunde': (0, -175, 150), 'altinda': (0, 150, 150), 'saginda': (200, 0, 150), 'solunda': (-200, 0, 150),
           'yaninda': (200, 0, 150), 'onunde': (40, 70, 190), 'arkasinda': (-40, -70, 130), 'icinde': (0, 20, 110)}[il]
    if il == 'arkasinda': emoji(T, ana, cx + off[0], cy + off[1], off[2], b)
    emoji(T, ref, cx, cy, 230, a)
    if il != 'arkasinda': emoji(T, ana, cx + off[0], cy + off[1], off[2], b)
    T.text(980, 300, p['etiket'], 52, fade(ACC, A(t, 1.1)))
    if p.get('alt'): T.text(980, 380, p['alt'], 30, fade(MUTED, A(t, 1.4)), bold=False)

def s_harfler(T, p, t, D):
    hs = p['harfler']; vg = set(p.get('vurgu', [])); n = len(hs); sut = min(p.get('sutun', 8), n); sat = math.ceil(n / sut)
    cw = min(120, 1100 / sut); ch = min(100, 430 / sat); x0 = 640 - cw * sut / 2 + cw / 2; y0 = 330 - ch * (sat - 1) / 2
    vz = p.get('vurgu_zaman', 0.6 + n * 0.05 + 0.4)
    for i, h in enumerate(hs):
        x = x0 + cw * (i % sut); y = y0 + ch * (i // sut); a = A(t, 0.3 + i * 0.05, 0.3); b = A(t, vz, 0.5) if i in vg else 0
        fill = lerp(WHITE, (250, 199, 117), b)
        T.rect(x - cw * 0.42, y - ch * 0.42, x + cw * 0.42, y + ch * 0.42, fade(fill, a), fade(LINE if not b else RENK['turuncu'], a), 2, r=12)
        T.text(x, y, h, min(56, ch * 0.55), fade(INK, a))
    if p.get('bilgi'): T.text(640, 560, p['bilgi'], 34, fade(ACC, A(t, vz + 0.4)))

def s_siniflama(T, p, t, D):
    kat = p['kategoriler']; og = p['ogeler']; nk = len(kat); n = len(og)
    cw = min(380, 1140 / nk); x0 = 640 - cw * nk / 2
    say = [0] * nk
    for j, k in enumerate(kat):
        x = x0 + j * cw; rk = [RENK['mavi'], RENK['turuncu'], RENK['turkuaz'], RENK['mor']][j % 4]
        T.rect(x + 10, 250, x + cw - 10, 575, lerp(WHITE, rk, 0.08), rk, 3, r=18)
        T.rect(x + 10, 250, x + cw - 10, 305, lerp(WHITE, rk, 0.25), None, 0, r=18)
        if isinstance(k, list) and k[1]: emoji(T, k[1], x + 40, 278, 34)
        T.text(x + cw / 2 + (14 if isinstance(k, list) and k[1] else 0), 278, k[0] if isinstance(k, list) else k, 28, rk)
    adim = min(1.0, D * 0.6 / max(n, 1))
    for i, (em, et, ki) in enumerate(og):
        z = oge_zamani(p, D, et, 0.5 + i * adim, i)
        a = A(t, z, 0.25); m = ease((t - z - 0.5) / 0.6)
        if a <= 0: continue
        sira = sum(1 for q in og[:i] if q[2] == ki)
        hx = x0 + ki * cw + cw / 2 + ((sira % 2) - 0.5) * (cw * 0.42 if cw > 250 else cw * 0.45)
        hy = 375 + (sira // 2) * 108
        bx, by = 640, 150
        x = bx + (hx - bx) * m; y = by + (hy - by) * m - math.sin(math.pi * m) * 40
        boy = 100 - 22 * m
        emoji(T, em, x, y - 10, boy, a)
        T.text(x, y + boy * 0.5 + 4, et, 22 if m > 0.5 else 30, fade(INK, a), bold=m < 0.5)

def ok_egri(T, x0, y0, x1, y1, renk, w=5):
    T.line([(x0, y0), (x1, y1)], renk, w)
    an_ = math.atan2(y1 - y0, x1 - x0); L = 18
    T.poly([(x1, y1), (x1 - L * math.cos(an_ - 0.45), y1 - L * math.sin(an_ - 0.45)), (x1 - L * math.cos(an_ + 0.45), y1 - L * math.sin(an_ + 0.45))], renk)

def s_dongu(T, p, t, D):
    ad = p['adimlar']; n = len(ad); cx, cy, R0 = 640, 318, min(200, 150 + n * 10)
    pos = [(cx + R0 * 1.15 * math.cos(-math.pi / 2 + 2 * math.pi * i / n), cy + R0 * 0.82 * math.sin(-math.pi / 2 + 2 * math.pi * i / n)) for i in range(n)]
    adim = min(1.2, D * 0.6 / n); zs = []
    for i, (em, et) in enumerate(ad):
        zs.append(oge_zamani(p, D, et, 0.5 + i * adim, i))
    for i in range(n):
        j = (i + 1) % n; b = A(t, max(zs[i], zs[j] if j else zs[i]) + 0.2, 0.4) if j else A(t, zs[-1] + 0.6, 0.4)
        if b > 0:
            (xa, ya), (xb, yb) = pos[i], pos[j]; d = math.hypot(xb - xa, yb - ya); k = 78 / d
            ok_egri(T, xa + (xb - xa) * k, ya + (yb - ya) * k, xa + (xb - xa) * (k + (1 - 2 * k) * b), ya + (yb - ya) * (k + (1 - 2 * k) * b), fade(RENK['turuncu'], b))
    for i, (em, et) in enumerate(ad):
        a = A(t, zs[i], 0.35); x, y = pos[i]
        if a <= 0: continue
        T.circle(x, y - 8, 62 * (0.8 + 0.2 * a), fade(WHITE, a), fade(LINE, a), 2)
        emoji(T, em, x, y - 14, 70 * (0.8 + 0.2 * a), a)
        T.text(x, y + 66, et, 26, fade(ACC, a))
    if p.get('orta'): T.text(cx, cy, p['orta'], 30, fade(MUTED, A(t, 0.3)), bold=False)

def s_akis(T, p, t, D):
    ad = p['adimlar']; n = len(ad); gen = min(250, 1180 / n); x0 = 640 - gen * (n - 1) / 2
    adim = min(1.2, D * 0.6 / n)
    for i, (em, et) in enumerate(ad):
        z = oge_zamani(p, D, et, 0.5 + i * adim, i); a = A(t, z, 0.35); x = x0 + i * gen
        if a <= 0: continue
        T.rect(x - gen * 0.44, 190, x + gen * 0.44, 450, fade(WHITE, a), fade(LINE, a), 2, r=18)
        T.circle(x - gen * 0.44 + 22, 212, 16, fade(RENK['turuncu'], a)); T.text(x - gen * 0.44 + 22, 212, i + 1, 20, fade(WHITE, a))
        emoji(T, em, x, 290, min(110, gen * 0.5), a)
        for j, sat in enumerate(sar(T, et, 24, gen * 0.8)[:3]):
            T.text(x, 380 + j * 28, sat, 24, fade(INK, a))
        if i:
            b = a; xa = x - gen + gen * 0.44 + 4; xb = x - gen * 0.44 - 4
            if xb - xa > 12: ok_egri(T, xa, 320, xa + (xb - xa) * b, 320, fade(RENK['turuncu'], b), 5)

TIPLER = {'baslik': s_baslik, 'metin': s_metin, 'kesir': s_kesir, 'nesne_say': s_nesne_say, 'onluk_birlik': s_onluk_birlik,
          'sayi_dogrusu': s_sayi_dogrusu, 'toplama': s_toplama, 'cikarma': s_cikarma, 'dizi': s_dizi, 'paylastirma': s_paylastirma,
          'saat': s_saat, 'sekil': s_sekil, 'oruntu': s_oruntu, 'karsilastirma': s_karsilastirma, 'para': s_para,
          'uzunluk': s_uzunluk, 'grafik': s_grafik, 'alt_alta': s_alt_alta,
          'alan_cevre': s_alan_cevre, 'aci': s_aci, 'kesir_seritleri': s_kesir_seritleri, 'kap': s_kap, 'terazi': s_terazi,
          'sekil_grafigi': s_sekil_grafigi, 'kelime': s_kelime, 'kelimeler': s_kelimeler, 'kelime_ciftleri': s_kelime_ciftleri,
          'hece': s_hece, 'cumle': s_cumle, 'konum': s_konum, 'harfler': s_harfler,
          'siniflama': s_siniflama, 'dongu': s_dongu, 'akis': s_akis}

# ---------- çerçeve ----------
def altyazi(T, metin, a):
    size = 28
    sat = sar(T, metin, size, 1000)
    if len(sat) > 2: size = 24; sat = sar(T, metin, size, 1040)
    T.rect(110, 612, 1170, 704, WHITE, LINE, 2, r=16)
    T.mtext(640, 658, '\n'.join(sat[:3]), size, lerp(WHITE, INK, a), spacing=6)

def sar(T, metin, size, maxw):
    out, cur = [], ''
    for w in metin.split():
        dene = (cur + ' ' + w).strip()
        if T.width(dene, size, False) <= maxw: cur = dene
        else: out.append(cur); cur = w
    if cur: out.append(cur)
    return out

def kare(video, k, sahne, t, D, poster=False):
    im = Image.new('RGB', (W * SS, H * SS), BG); T = Tuval(im)
    if sahne['tip'] != 'baslik': T.text(640, 44, video['baslik'], 28, MUTED)
    TIPLER[sahne['tip']](T, sahne, t, D)
    if poster: return im.reduce(SS)
    n = len(video['sahneler'])
    for j in range(n):
        x = 640 + (j - (n - 1) / 2) * 22
        T.circle(x, 592, 6, ACC if j <= k else LINE)
    altyazi(T, sahne.get('altyazi', sahne['anlatim']), A(t, 0.05, 0.4))
    return im.reduce(SS)

# ---------- ses ----------
def ses_bul(dil='tr_TR', tercih=()):
    try: out = subprocess.run(['say', '-v', '?'], capture_output=True, text=True).stdout
    except FileNotFoundError: return None
    adaylar = []
    for line in out.splitlines():
        m = re.match(r'^(.*?)\s+' + dil.replace('_', '[_-]'), line)
        if m: adaylar.append(m.group(1).strip())
    if not adaylar: return None
    for t in tercih:
        for a in adaylar:
            if a.startswith(t): return a
    for anahtar in ('Premium', 'Enhanced', 'Gelişmiş', 'İyileştirilmiş'):
        for a in adaylar:
            if anahtar.lower() in a.lower(): return a
    return adaylar[0]

def edge_seslendir(metin, voice, mp3):
    import asyncio, edge_tts
    async def calis():
        try: c = edge_tts.Communicate(metin, voice, rate='-5%', boundary='WordBoundary')
        except TypeError: c = edge_tts.Communicate(metin, voice, rate='-5%')
        kel = []
        with open(mp3, 'wb') as f:
            async for ch in c.stream():
                if ch['type'] == 'audio': f.write(ch['data'])
                elif ch['type'] == 'WordBoundary': kel.append((ch['offset'] / 1e7, ch['duration'] / 1e7, ch['text']))
        return kel
    for deneme in range(3):
        try: return asyncio.run(calis())
        except Exception:
            if deneme == 2: raise

SON_KELIMELER = None
def seslendir(metin, ses, yol):
    global SON_KELIMELER
    SON_KELIMELER = None
    if ses.startswith('edge:'):
        mp3 = yol[:-4] + '.mp3'
        SON_KELIMELER = edge_seslendir(metin, ses[5:], mp3)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ar', '22050', '-ac', '1', '-sample_fmt', 's16', yol], check=True)
        with wave.open(yol) as w: return w.getnframes() / w.getframerate()
    subprocess.run(['say', '-v', ses, '-r', str(SES_HIZ), '--file-format=WAVE', '--data-format=LEI16@22050', '-o', yol, metin], check=True)
    with wave.open(yol) as w: return w.getnframes() / w.getframerate()

def seslendir_sahne(sahne, sesler, yol, tmp):
    parcalar = sahne.get('ses') or [['tr', sahne['anlatim']]]
    kelimeler = None
    rate = 22050; veri = b''; bosluk = b'\x00\x00' * int(0.35 * rate)
    for j, (dil, metin) in enumerate(parcalar):
        py = os.path.join(tmp, f'p{j}_' + os.path.basename(yol))
        seslendir(metin, sesler.get(dil) or sesler['tr'], py)
        if len(parcalar) == 1 and metin == sahne['anlatim']: kelimeler = SON_KELIMELER
        with wave.open(py) as w: veri += (bosluk if j else b'') + w.readframes(w.getnframes())
    with wave.open(yol, 'wb') as out:
        out.setnchannels(1); out.setsampwidth(2); out.setframerate(rate); out.writeframes(veri)
    return len(veri) / 2 / rate, kelimeler

def ses_birlestir(parcalar, sureler, yol):
    rate = 22050
    with wave.open(yol, 'wb') as out:
        out.setnchannels(1); out.setsampwidth(2); out.setframerate(rate)
        for parca, D in zip(parcalar, sureler):
            toplam = int(round(D * FPS)) * rate // FPS
            veri = b''
            if parca:
                with wave.open(parca) as w:
                    if w.getframerate() != rate or w.getnchannels() != 1: raise RuntimeError('beklenmeyen ses formatı')
                    veri = w.readframes(w.getnframes())
            once = b'\x00\x00' * int(SES_ONCE * rate)
            blok = (once + veri)[:toplam * 2]
            out.writeframes(blok + b'\x00\x00' * (toplam - len(blok) // 2))

# ---------- üretim ----------
def sure_hesapla(sahne, ses_suresi):
    if ses_suresi is not None: D = ses_suresi + SES_ONCE + SES_SONRA
    else: D = len(sahne['anlatim']) * 0.075 + 1.5
    return max(D, sahne.get('min_sure', 0), MIN_SAHNE)

def dogrula(videolar):
    ids = set()
    for v in videolar:
        assert v['id'] not in ids, 'tekrar eden id: ' + v['id']; ids.add(v['id'])
        for i, s in enumerate(v['sahneler']):
            assert s['tip'] in TIPLER, f"{v['id']} sahne {i + 1}: bilinmeyen tip {s['tip']}"
            assert s.get('anlatim'), f"{v['id']} sahne {i + 1}: anlatim yok"

def poster_sahne(sahneler):
    """Poster: başlıktan sonraki ilk görsel sahnenin son hâli (metin sahnelerini atla)."""
    for i, s in enumerate(sahneler):
        if i and s['tip'] not in ('baslik', 'metin'): return i
    return min(1, len(sahneler) - 1)

def poster_uret(video):
    ss = [dict(s) for s in video['sahneler']]; i = poster_sahne(ss); D = sure_hesapla(ss[i], None)
    kare(video, i, ss[i], D + 30, D, poster=True).save(os.path.join(CIKTI, video['id'] + '.jpg'), quality=82)

def uret(video, ses, onizleme):
    vid = video['id']; tmp = tempfile.mkdtemp()
    try:
        parcalar, sureler, sahneler = [], [], []
        for i, s in enumerate(video['sahneler']):
            s = dict(s)
            if ses:
                yol = os.path.join(tmp, f's{i}.wav'); parcalar.append(yol); ss, kel = seslendir_sahne(s, ses, yol, tmp)
                if kel: s['_zaman'] = kel
            else: parcalar.append(None); ss = None
            sureler.append(sure_hesapla(s, ss)); sahneler.append(s)
        if onizleme:
            os.makedirs(ONIZ, exist_ok=True)
            n = len(video['sahneler']); pano = Image.new('RGB', (640 * 2, 360 * math.ceil(n / 2)), BG)
            for i, s in enumerate(sahneler):
                pano.paste(kare(video, i, s, sureler[i] - 0.3, sureler[i]).resize((640, 360)), ((i % 2) * 640, (i // 2) * 360))
            pano.save(os.path.join(ONIZ, vid + '.png')); return sum(sureler)
        os.makedirs(CIKTI, exist_ok=True)
        sessiz_mp4 = os.path.join(tmp, 'v.mp4')
        pr = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                               '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', sessiz_mp4], stdin=subprocess.PIPE)
        for i, s in enumerate(sahneler):
            D = sureler[i]; nk = int(round(D * FPS))
            for f in range(nk):
                im = kare(video, i, s, f / FPS, D)
                if i == poster_sahne(sahneler) and f == max(0, nk - int(0.4 * FPS)):
                    kare(video, i, s, D + 30, D, poster=True).save(os.path.join(CIKTI, vid + '.jpg'), quality=82)
                pr.stdin.write(im.tobytes())
        pr.stdin.close()
        if pr.wait() != 0: raise RuntimeError('ffmpeg video hatası')
        hedef = os.path.join(CIKTI, vid + '.mp4')
        if ses:
            wav = os.path.join(tmp, 'a.wav'); ses_birlestir(parcalar, sureler, wav)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sessiz_mp4, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '96k',
                            '-movflags', '+faststart', hedef], check=True)
        else:
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sessiz_mp4, '-c', 'copy', '-movflags', '+faststart', hedef], check=True)
        return sum(sureler)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

def manifest_yaz(videolar, sureler):
    kayit = []
    for v in videolar:
        if not os.path.exists(os.path.join(CIKTI, v['id'] + '.mp4')): continue
        kayit.append({'id': v['id'], 'baslik': v['baslik'], 'konu': v.get('konu', ''), 'sinif': v.get('sinif', 2), 'ders': v.get('ders', 'Matematik'),
                      'sure': round(sureler.get(v['id'], 0)), 'src': f"/videolar/{v['id']}.mp4", 'poster': f"/videolar/{v['id']}.jpg"})
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    with open(MANIFEST, 'w', encoding='utf-8') as f:
        f.write('// OTOMATİK ÜRETİLDİ — scripts/video_motoru/motor.py. Elle düzenleme.\n')
        f.write('export interface DersVideosu {\n  id: string; baslik: string; konu: string; sinif: number; ders: string;\n  sure: number; src: string; poster: string;\n}\n\n')
        f.write('export const VIDEOLAR: DersVideosu[] = ' + json.dumps(kayit, ensure_ascii=False, indent=2) + ';\n')
    return len(kayit)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--id'); ap.add_argument('--sessiz', action='store_true'); ap.add_argument('--onizleme', action='store_true')
    ap.add_argument('--ses', help='macOS ses adı (varsayılan: otomatik Türkçe)')
    ap.add_argument('--edge', nargs='?', const='tr-TR-EmelNeural', help='Microsoft nöral ses (varsayılan Emel; erkek: tr-TR-AhmetNeural)')
    ap.add_argument('--edge-en', default='en-US-JennyNeural', help='İngilizce kelimeler için Microsoft sesi')
    ap.add_argument('--poster', action='store_true', help='sadece posterleri yeniden üret (video ve ses değişmez)')
    ap.add_argument('--eksik', action='store_true', help='sadece henüz üretilmemiş videoları üret')
    ap.add_argument('--sinif', type=int, help='sadece bu sınıfın videoları')
    ap.add_argument('--ders', help='sadece bu dersin videoları (Matematik, Türkçe, İngilizce)')
    ar = ap.parse_args()
    if ar.poster:
        with open(SENARYO, encoding='utf-8') as f: vs = json.load(f)['videolar']
        vs = [v for v in vs if (not ar.id or v['id'].startswith(ar.id)) and os.path.exists(os.path.join(CIKTI, v['id'] + '.mp4'))]
        for k, v in enumerate(vs, 1):
            poster_uret(v)
            if k % 25 == 0 or k == len(vs): print(f'poster {k}/{len(vs)}')
        return
    if not shutil.which('ffmpeg') and not ar.onizleme: sys.exit('ffmpeg bulunamadı: brew install ffmpeg')
    with open(SENARYO, encoding='utf-8') as f: videolar = json.load(f)['videolar']
    dogrula(videolar)
    ses = None
    if not ar.sessiz and not ar.onizleme:
        if ar.edge:
            if not shutil.which('edge-tts'): sys.exit('edge-tts bulunamadı')
            ses = {'tr': 'edge:' + ar.edge, 'en': 'edge:' + ar.edge_en}
        else:
            tr = ar.ses or ses_bul()
            ses = {'tr': tr, 'en': ses_bul('en_US', ('Samantha',)) or tr} if tr else None
        if not ses: sys.exit('Türkçe ses bulunamadı. Ses olmadan üretmek için --sessiz kullan.')
        print('Ses:', ses['tr'], '| İngilizce:', ses['en'])
    secili = [v for v in videolar if (not ar.id or v['id'].startswith(ar.id)) and (not ar.sinif or v.get('sinif') == ar.sinif) and (not ar.ders or v.get('ders', 'Matematik') == ar.ders)]
    if ar.eksik: secili = [v for v in secili if not os.path.exists(os.path.join(CIKTI, v['id'] + '.mp4'))]
    if not secili: sys.exit('Üretilecek video yok.')
    sureler = {}
    for i, v in enumerate(secili, 1):
        print(f'[{i}/{len(secili)}] {v["id"]} ...', end=' ', flush=True)
        sureler[v['id']] = uret(v, ses, ar.onizleme); print(f'{sureler[v["id"]]:.0f} sn')
    if not ar.onizleme:
        # önceki çalışmalardan kalan süreleri korumak için mevcut manifesti oku
        if os.path.exists(MANIFEST):
            for m in re.finditer(r'"id": "([^"]+)",[^}]*?"sure": (\d+)', open(MANIFEST, encoding='utf-8').read()):
                sureler.setdefault(m.group(1), int(m.group(2)))
        print('Manifest:', manifest_yaz(videolar, sureler), 'video ->', os.path.relpath(MANIFEST, KOK))
    else:
        print('Önizlemeler:', ONIZ)

if __name__ == '__main__':
    main()
