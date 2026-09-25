// Turkce ek uretimi (kaynastirma + unlu/unsuz uyumu).
// HikayeKosesi ile ayni kurallar; davranis degismemeli.

const UNLULER = 'aeıioöuü';
const KALIN = 'aıou';
const SERT = 'fstkçşhp';

export const trLower = (c: string) => c.toLocaleLowerCase('tr-TR');

const sonUnlu = (ad: string) => {
  const a = trLower(ad);
  for (let i = a.length - 1; i >= 0; i--) if (UNLULER.includes(a[i])) return a[i];
  return 'a';
};
const sonHarf = (ad: string) => trLower(ad).slice(-1);
const unluBiter = (ad: string) => UNLULER.includes(sonHarf(ad));
const sertBiter = (ad: string) => SERT.includes(sonHarf(ad));
const I4 = (sv: string) => ('aı'.includes(sv) ? 'ı' : 'ei'.includes(sv) ? 'i' : 'ou'.includes(sv) ? 'u' : 'ü');
const A2 = (sv: string) => (KALIN.includes(sv) ? 'a' : 'e');

export type EkTipi = 'yonelme' | 'tamlayan' | 'belirtme' | 'vasita' | 'ayrilma' | 'bildirme' | 'ikinci';

export const turkceEk = (ad: string, tip: EkTipi): string => {
  const sv = sonUnlu(ad);
  const seslimi = unluBiter(ad);
  const sertmi = sertBiter(ad);
  switch (tip) {
    case 'yonelme':
      return ad + "'" + (seslimi ? 'y' : '') + A2(sv);
    case 'tamlayan':
      return ad + "'" + (seslimi ? 'n' : '') + I4(sv) + 'n';
    case 'belirtme':
      return ad + "'" + (seslimi ? 'y' : '') + I4(sv);
    case 'vasita':
      return ad + "'" + (seslimi ? 'y' : '') + 'l' + A2(sv);
    case 'ayrilma':
      return ad + "'" + (sertmi ? 't' : 'd') + A2(sv) + 'n';
    case 'bildirme':
      return ad + "'" + (seslimi ? 'y' : '') + (sertmi ? 't' : 'd') + I4(sv);
    case 'ikinci':
      return ad + "'" + 's' + I4(sv) + 'n';
    default:
      return ad;
  }
};

const RAKAM_OKUNUS: Record<string, string> = {
  '0': 'sıfır',
  '1': 'bir',
  '2': 'iki',
  '3': 'üç',
  '4': 'dört',
  '5': 'beş',
  '6': 'altı',
  '7': 'yedi',
  '8': 'sekiz',
  '9': 'dokuz',
};

/** Ilgi eki: Elif'in, Alya'nın. Rakamla biten isimde ek, rakamin okunusuna gore. */
export function ilgiHali(ad: string): string {
  const okunus = RAKAM_OKUNUS[ad.slice(-1)];
  const kaynak = okunus ?? ad;
  const ekli = turkceEk(kaynak, 'tamlayan');
  return ad + ekli.slice(kaynak.length);
}
