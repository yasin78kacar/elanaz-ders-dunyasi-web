import seviye1Listesi from './seviye1.json';
import seviye2Listesi from './seviye2.json';
import { kelimeyeCevir, type Kelime } from './kelime';

const AKTIF_KEY = 'dersdunyasi_aktif';

export type IngilizceKelimeKayit = {
  dogru: number;
  yanlis: number;
  gunler: string[];
};

export type IngilizceSinavSonuc = {
  tarih: string;
  dogru: number;
  toplam: number;
  gecti: boolean;
};

export type IngilizceKayit = {
  seviye: number;
  sure: number;
  gecmisSure: number;
  kelimeler: { [kelimeEn: string]: IngilizceKelimeKayit };
  sinavlar: IngilizceSinavSonuc[];
};

export const GEREKEN_SURE = 72000;

function anahtar(isim?: string): string {
  const profilAdi = isim ?? (localStorage.getItem(AKTIF_KEY) || '');
  return 'dersdunyasi_' + profilAdi + '_ingilizce';
}

function varsayilan(): IngilizceKayit {
  return { seviye: 1, sure: 0, gecmisSure: 0, kelimeler: {}, sinavlar: [] };
}

function bugun(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const g = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + g;
}

function yaz(kayit: IngilizceKayit) {
  try {
    localStorage.setItem(anahtar(), JSON.stringify(kayit));
  } catch {
    /* localStorage dolu veya kapalı */
  }
}

export function ingilizceGetir(isim?: string): IngilizceKayit {
  try {
    const ham = localStorage.getItem(anahtar(isim));
    if (!ham) return varsayilan();
    const oku = JSON.parse(ham) as Partial<IngilizceKayit>;
    return {
      seviye: typeof oku.seviye === 'number' ? oku.seviye : 1,
      sure: typeof oku.sure === 'number' ? oku.sure : 0,
      gecmisSure: typeof oku.gecmisSure === 'number' ? oku.gecmisSure : 0,
      kelimeler: oku.kelimeler && typeof oku.kelimeler === 'object' ? oku.kelimeler : {},
      sinavlar: Array.isArray(oku.sinavlar) ? (oku.sinavlar as IngilizceSinavSonuc[]) : [],
    };
  } catch {
    return varsayilan();
  }
}

export function kelimeKaydet(en: string, dogruMu: boolean) {
  try {
    const kayit = ingilizceGetir();
    const mevcut = kayit.kelimeler[en] || { dogru: 0, yanlis: 0, gunler: [] };
    if (dogruMu) mevcut.dogru += 1;
    else mevcut.yanlis += 1;
    const tarih = bugun();
    if (!mevcut.gunler.includes(tarih)) mevcut.gunler.push(tarih);
    kayit.kelimeler[en] = mevcut;
    yaz(kayit);
  } catch {
    /* localStorage dolu veya kapalı */
  }
}

export function sureEkle(saniye: number) {
  try {
    if (saniye <= 0) return;
    const kayit = ingilizceGetir();
    kayit.sure += saniye;
    yaz(kayit);
  } catch {
    /* localStorage dolu veya kapalı */
  }
}

export function seviyeKelimeleri(seviye: number): Kelime[] {
  const ham = seviye >= 2 ? seviye2Listesi : seviye1Listesi;
  return (ham as Parameters<typeof kelimeyeCevir>[0][]).map(kelimeyeCevir);
}

export function aktifKelimeler(): Kelime[] {
  return seviyeKelimeleri(ingilizceGetir().seviye);
}

export function sinavaGirebilirMi(): boolean {
  return ingilizceGetir().sure >= GEREKEN_SURE;
}

export function kalanSure(): number {
  const kalan = GEREKEN_SURE - ingilizceGetir().sure;
  return kalan > 0 ? kalan : 0;
}

export function sinavKaydet(sonuc: IngilizceSinavSonuc) {
  try {
    const kayit = ingilizceGetir();
    kayit.sinavlar = [...kayit.sinavlar, sonuc];
    if (sonuc.gecti) {
      kayit.gecmisSure += kayit.sure;
      kayit.sure = 0;
      kayit.seviye += 1;
    }
    yaz(kayit);
  } catch {
    /* localStorage dolu veya kapalı */
  }
}

export function ozet(isim?: string): {
  toplamKelime: number;
  calisilanKelime: number;
  dogruOran: number;
  calisilanGun: number;
} {
  const kayit = ingilizceGetir(isim);
  const aktifEn = new Set(seviyeKelimeleri(kayit.seviye).map((k) => k.en));
  let calisilanKelime = 0;
  let dogru = 0;
  let yanlis = 0;
  const gunler = new Set<string>();
  for (const [en, k] of Object.entries(kayit.kelimeler)) {
    if (!aktifEn.has(en)) continue;
    if (k.dogru > 0) calisilanKelime += 1;
    dogru += k.dogru;
    yanlis += k.yanlis;
    for (const g of k.gunler || []) gunler.add(g);
  }
  const toplamCevap = dogru + yanlis;
  return {
    toplamKelime: aktifEn.size,
    calisilanKelime,
    dogruOran: toplamCevap === 0 ? 0 : (dogru / toplamCevap) * 100,
    calisilanGun: gunler.size,
  };
}
