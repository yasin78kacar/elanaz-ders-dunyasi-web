const AKTIF_KEY = 'dersdunyasi_aktif';

export type IngilizceKelimeKayit = {
  dogru: number;
  yanlis: number;
  gunler: string[];
};

export type IngilizceKayit = {
  seviye: number;
  sure: number;
  kelimeler: { [kelimeEn: string]: IngilizceKelimeKayit };
  sinavlar: unknown[];
};

function anahtar(): string {
  const profilAdi = localStorage.getItem(AKTIF_KEY) || '';
  return 'dersdunyasi_' + profilAdi + '_ingilizce';
}

function varsayilan(): IngilizceKayit {
  return { seviye: 1, sure: 0, kelimeler: {}, sinavlar: [] };
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

export function ingilizceGetir(): IngilizceKayit {
  try {
    const ham = localStorage.getItem(anahtar());
    if (!ham) return varsayilan();
    const oku = JSON.parse(ham) as Partial<IngilizceKayit>;
    return {
      seviye: typeof oku.seviye === 'number' ? oku.seviye : 1,
      sure: typeof oku.sure === 'number' ? oku.sure : 0,
      kelimeler: oku.kelimeler && typeof oku.kelimeler === 'object' ? oku.kelimeler : {},
      sinavlar: Array.isArray(oku.sinavlar) ? oku.sinavlar : [],
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
