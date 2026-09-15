export type Kelime = {
  en: string;
  tr: string;
  kat: string;
  dosya: string;
  ikon?: string;
  ozel?: 'sayi' | 'renk';
  deger?: string;
};

type HamKelime = {
  en: string;
  tr: string;
  kat: string;
  ikon?: string;
  dosya?: string;
  ozel?: 'sayi' | 'renk';
  deger?: string;
};

export function kelimeyeCevir(ham: HamKelime): Kelime {
  const dosya = ham.dosya
    || ham.ikon?.split('/').pop()?.replace(/\.svg$/i, '')
    || '';
  return {
    en: ham.en,
    tr: ham.tr,
    kat: ham.kat,
    dosya,
    ikon: ham.ikon,
    ozel: ham.ozel,
    deger: ham.deger,
  };
}

export function kelimeSesYolu(k: Kelime): string {
  return '/ingilizce/ses/' + k.dosya + '.m4a';
}
