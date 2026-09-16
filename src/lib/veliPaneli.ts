import { ingilizceGetir, ozet, type IngilizceSinavSonuc } from '../ingilizce/kayit';

type StatsKayit = {
  subject: string;
  theme: string;
  difficulty?: string;
  score: number;
  total: number;
  date: string;
};

type HataKayit = {
  id?: string;
  subject: string;
  theme: string;
  question?: string;
  options?: string[];
  tarih?: string;
};

export type KonuTrend = 'yükseliyor' | 'düşüyor' | 'sabit' | 'yetersiz veri';

export type KonuOzeti = {
  subject: string;
  theme: string;
  ortalamaBasari: number;
  denemeSayisi: number;
  sonTarih: string;
  trend: KonuTrend;
};

export type ZayifKonu = {
  subject: string;
  theme: string;
  soruSayisi: number;
};

export type IngilizceOzeti = {
  seviye: number;
  calismaSuresi: string;
  ogrenilenKelime: number;
  toplamKelime: number;
  sonSinav: IngilizceSinavSonuc | null;
  sinavSayisi: number;
  calisilanGun: number;
};

export type GenelOzet = {
  toplamSoru: number;
  basariYuzdesi: number;
  sonAktivite: string | null;
};

function statsAnahtar(isim: string): string {
  return 'dersdunyasi_' + isim + '_stats';
}

function hatalarAnahtar(isim: string): string {
  return 'dersdunyasi_' + isim + '_hatalar';
}

function diziOku<T>(anahtar: string): T[] {
  try {
    const ham = localStorage.getItem(anahtar);
    if (!ham) return [];
    const oku = JSON.parse(ham) as unknown;
    return Array.isArray(oku) ? (oku as T[]) : [];
  } catch {
    return [];
  }
}

function statsOku(isim: string): StatsKayit[] {
  return diziOku<StatsKayit>(statsAnahtar(isim)).filter(
    (k) => k && typeof k.subject === 'string' && typeof k.theme === 'string'
      && typeof k.score === 'number' && typeof k.total === 'number',
  );
}

function hatalarOku(isim: string): HataKayit[] {
  return diziOku<HataKayit>(hatalarAnahtar(isim)).filter(
    (k) => k && typeof k.subject === 'string' && typeof k.theme === 'string',
  );
}

function grupAnahtari(subject: string, theme: string): string {
  return subject + '\0' + theme;
}

function yuzde(dogru: number, toplam: number): number {
  if (toplam <= 0) return 0;
  return Math.round((dogru / toplam) * 1000) / 10;
}

function denemeYuzdesi(kayitlar: StatsKayit[]): number {
  let dogru = 0;
  let toplam = 0;
  for (const k of kayitlar) {
    dogru += k.score;
    toplam += k.total;
  }
  return yuzde(dogru, toplam);
}

function trendHesapla(kayitlar: StatsKayit[]): KonuTrend {
  if (kayitlar.length < 10) return 'yetersiz veri';
  const son = denemeYuzdesi(kayitlar.slice(-5));
  const onceki = denemeYuzdesi(kayitlar.slice(-10, -5));
  if (son > onceki) return 'yükseliyor';
  if (son < onceki) return 'düşüyor';
  return 'sabit';
}

function sureYazi(saniye: number): string {
  const s = Math.max(0, Math.floor(saniye));
  const saat = Math.floor(s / 3600);
  const dk = Math.floor((s % 3600) / 60);
  if (saat === 0) return dk + ' dakika';
  if (dk === 0) return saat + ' saat';
  return saat + ' saat ' + dk + ' dakika';
}

export function konuOzetiGetir(isim: string): KonuOzeti[] {
  const gruplar = new Map<string, StatsKayit[]>();
  for (const kayit of statsOku(isim)) {
    const anahtar = grupAnahtari(kayit.subject, kayit.theme);
    const liste = gruplar.get(anahtar);
    if (liste) liste.push(kayit);
    else gruplar.set(anahtar, [kayit]);
  }

  const ozetler: KonuOzeti[] = [];
  for (const liste of gruplar.values()) {
    const sonBes = liste.slice(-5);
    const son = liste[liste.length - 1];
    ozetler.push({
      subject: liste[0].subject,
      theme: liste[0].theme,
      ortalamaBasari: denemeYuzdesi(sonBes),
      denemeSayisi: liste.length,
      sonTarih: typeof son.date === 'string' ? son.date : '',
      trend: trendHesapla(liste),
    });
  }
  return ozetler;
}

export function zayifKonularGetir(isim: string, limit = 5): ZayifKonu[] {
  const sayac = new Map<string, ZayifKonu>();
  for (const hata of hatalarOku(isim)) {
    const anahtar = grupAnahtari(hata.subject, hata.theme);
    const mevcut = sayac.get(anahtar);
    if (mevcut) mevcut.soruSayisi += 1;
    else sayac.set(anahtar, { subject: hata.subject, theme: hata.theme, soruSayisi: 1 });
  }
  return [...sayac.values()]
    .sort((a, b) => b.soruSayisi - a.soruSayisi)
    .slice(0, Math.max(0, limit));
}

function gunTarihi(ham: string | undefined): string | null {
  if (!ham) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(ham)) return ham.slice(0, 10);
  const m = ham.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!m) return null;
  return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
}

export function ingilizceOzetiGetir(isim: string): IngilizceOzeti | null {
  try {
    const ham = localStorage.getItem('dersdunyasi_' + isim + '_ingilizce');
    if (!ham) return null;
  } catch {
    return null;
  }

  const kayit = ingilizceGetir(isim);
  const bilgi = ozet(isim);
  const sinavlar = kayit.sinavlar;
  const sonSinav = sinavlar.length > 0 ? sinavlar[sinavlar.length - 1] : null;

  return {
    seviye: kayit.seviye,
    calismaSuresi: sureYazi(kayit.sure),
    ogrenilenKelime: bilgi.calisilanKelime,
    toplamKelime: bilgi.toplamKelime,
    sonSinav,
    sinavSayisi: sinavlar.length,
    calisilanGun: bilgi.calisilanGun,
  };
}

export function genelOzetGetir(isim: string): GenelOzet {
  const stats = statsOku(isim);
  let dogru = 0;
  let toplamSoru = 0;
  let sonAktivite: string | null = null;
  for (const k of stats) {
    dogru += k.score;
    toplamSoru += k.total;
    const gun = gunTarihi(k.date);
    if (gun && (sonAktivite == null || gun > sonAktivite)) sonAktivite = gun;
  }
  for (const hata of hatalarOku(isim)) {
    const gun = gunTarihi(hata.tarih);
    if (gun && (sonAktivite == null || gun > sonAktivite)) sonAktivite = gun;
  }
  return {
    toplamSoru,
    basariYuzdesi: yuzde(dogru, toplamSoru),
    sonAktivite,
  };
}
