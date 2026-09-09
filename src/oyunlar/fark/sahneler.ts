import type { SahneTanimi } from './tipler';

export const SAHNELER: SahneTanimi[] = [
  {
    id: 'bahce',
    ad: 'Bahçe Evi',
    zorluk: 'Kolay',
    farklar: [
      { id: 'gunes', cx: 348, cy: 44, r: 38, tur: 'renk' },
      { id: 'kapi', cx: 248, cy: 188, r: 30, tur: 'renk' },
      { id: 'cicek', cx: 46, cy: 228, r: 28, tur: 'yok' },
      { id: 'kus', cx: 250, cy: 70, r: 26, tur: 'yok' },
      { id: 'elma', cx: 92, cy: 112, r: 30, tur: 'boyut' },
    ],
  },
  {
    id: 'gol',
    ad: 'Göl Kenarı',
    zorluk: 'Orta',
    farklar: [
      { id: 'pencere', cx: 118, cy: 132, r: 26, tur: 'renk' },
      { id: 'tekne', cx: 268, cy: 198, cxB: 292, r: 34, tur: 'konum' },
      { id: 'ordek', cx: 198, cy: 188, r: 26, tur: 'yok' },
      { id: 'yildiz', cx: 352, cy: 36, r: 22, tur: 'yok' },
      { id: 'duman', cx: 142, cy: 78, r: 24, tur: 'yok' },
      { id: 'nilufer', cx: 318, cy: 214, r: 24, tur: 'renk' },
    ],
  },
  {
    id: 'kis',
    ad: 'Kış Köyü',
    zorluk: 'Zor',
    farklar: [
      { id: 'atki', cx: 196, cy: 193, r: 22, tur: 'renk' },
      { id: 'dugme', cx: 196, cy: 220, r: 20, tur: 'yok' },
      { id: 'celenk', cx: 286, cy: 148, r: 24, tur: 'yok' },
      { id: 'mum', cx: 271, cy: 126, r: 24, tur: 'yok' },
      { id: 'kus', cx: 78, cy: 92, cxB: 108, cyB: 104, r: 26, tur: 'konum' },
      { id: 'yigin', cx: 348, cy: 228, r: 26, tur: 'yok' },
    ],
  },
];
