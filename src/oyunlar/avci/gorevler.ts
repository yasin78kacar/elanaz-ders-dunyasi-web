import type { SahneTanimi } from './tipler';

export const SAHNELER: SahneTanimi[] = [
  {
    id: 'park',
    ad: 'Oyun Parkı',
    zorluk: 'Kolay',
    gorevler: [
      {
        id: 'cicek',
        ad: 'Kırmızı çiçek',
        ikon: 'cicek',
        ornekler: [
          { id: 'cicek-1', cx: 36, cy: 248, r: 28 },
          { id: 'cicek-2', cx: 168, cy: 252, r: 26 },
          { id: 'cicek-3', cx: 352, cy: 236, r: 26 },
        ],
      },
      { id: 'top', ad: 'Sarı top', ikon: 'top', ornekler: [{ id: 'top-1', cx: 214, cy: 232, r: 24 }] },
      { id: 'kelebek', ad: 'Kelebek', ikon: 'kelebek', ornekler: [{ id: 'kelebek-1', cx: 118, cy: 132, r: 24 }] },
      { id: 'ucurtma', ad: 'Uçurtma', ikon: 'ucurtma', ornekler: [{ id: 'ucurtma-1', cx: 318, cy: 48, r: 28 }] },
      { id: 'kova', ad: 'Kırmızı kova', ikon: 'kova', ornekler: [{ id: 'kova-1', cx: 86, cy: 222, r: 22 }] },
    ],
  },
  {
    id: 'orman',
    ad: 'Sık Orman',
    zorluk: 'Orta',
    gorevler: [
      { id: 'baykus', ad: 'Gizli baykuş', ikon: 'baykus', ornekler: [{ id: 'baykus-1', cx: 72, cy: 118, r: 22 }] },
      {
        id: 'mantar',
        ad: 'Kırmızı mantar',
        ikon: 'mantar',
        ornekler: [
          { id: 'mantar-1', cx: 48, cy: 232, r: 22 },
          { id: 'mantar-2', cx: 248, cy: 246, r: 22 },
        ],
      },
      { id: 'tilki', ad: 'Gizli tilki', ikon: 'tilki', ornekler: [{ id: 'tilki-1', cx: 328, cy: 214, r: 26 }] },
      { id: 'salyangoz', ad: 'Salyangoz', ikon: 'salyangoz', ornekler: [{ id: 'sal-1', cx: 158, cy: 228, r: 20 }] },
      { id: 'kus', ad: 'Mavi kuş', ikon: 'kus', ornekler: [{ id: 'kus-1', cx: 196, cy: 86, r: 22 }] },
      { id: 'kurbaga', ad: 'Kurbağa', ikon: 'kurbaga', ornekler: [{ id: 'kur-1', cx: 292, cy: 188, r: 20 }] },
    ],
  },
  {
    id: 'sehir',
    ad: 'Şehir Sokağı',
    zorluk: 'Zor',
    gorevler: [
      { id: 'semsiye', ad: 'Sarı şemsiye', ikon: 'semsiye', ornekler: [{ id: 'sem-1', cx: 148, cy: 168, r: 24 }] },
      { id: 'kedi', ad: 'Penceredeki kedi', ikon: 'kedi', ornekler: [{ id: 'kedi-1', cx: 252, cy: 104, r: 20 }] },
      { id: 'balon', ad: 'Kırmızı balon', ikon: 'balon', ornekler: [{ id: 'bal-1', cx: 352, cy: 78, r: 20 }] },
      {
        id: 'guvercin',
        ad: 'Güvercin',
        ikon: 'guvercin',
        ornekler: [
          { id: 'guv-1', cx: 88, cy: 64, r: 18 },
          { id: 'guv-2', cx: 312, cy: 198, r: 18 },
        ],
      },
      { id: 'kopek', ad: 'Gizli köpek', ikon: 'kopek', ornekler: [{ id: 'kop-1', cx: 48, cy: 228, r: 22 }] },
      { id: 'canta', ad: 'Mavi çanta', ikon: 'canta', ornekler: [{ id: 'can-1', cx: 198, cy: 208, r: 18 }] },
    ],
  },
];
