/** 4/4 patern: her eleman bir vuruş, -1 = dinlenme. */

export const LEAD_MS = 280;
export const PERFECT_MS = 160;
export const GOOD_MS = 300;
export const PUAN_MUKEMMEL = 3;
export const PUAN_IYI = 1;
export const PICKUP = 4;

export type PadId = 0 | 1 | 2 | 3;

export const PADLAR: { id: PadId; ad: string; emoji: string; renk: string; acik: string; koyu: string }[] = [
  { id: 0, ad: 'Tilki', emoji: '🥁', renk: '#e23d4a', acik: '#ff8a94', koyu: '#9a1c28' },
  { id: 1, ad: 'Civciv', emoji: '🔔', renk: '#e8b020', acik: '#ffe066', koyu: '#9a7010' },
  { id: 2, ad: 'Ayı', emoji: '🪘', renk: '#3d7ec9', acik: '#8ec4ff', koyu: '#1e4a86' },
  { id: 3, ad: 'Kurbağa', emoji: '🎹', renk: '#3d9a4a', acik: '#8ee08a', koyu: '#1f6a28' },
];

export type TurId = 'yavas' | 'orta' | 'hizli';

export type Tur = {
  id: TurId;
  ad: string;
  zorluk: 'Yavaş' | 'Orta' | 'Hızlı';
  bpm: number;
  /** 8 ölçü × 4 vuruş */
  pater: number[];
};

export const TURLAR: Tur[] = [
  {
    id: 'yavas',
    ad: 'Hayvan Bandosu',
    zorluk: 'Yavaş',
    bpm: 80,
    pater: [
      0, -1, 1, -1,
      2, -1, 3, -1,
      0, -1, 1, -1,
      2, -1, 3, -1,
      0, -1, 2, -1,
      1, -1, 3, -1,
      0, -1, 1, -1,
      2, -1, 3, -1,
    ],
  },
  {
    id: 'orta',
    ad: 'İkili Adımlar',
    zorluk: 'Orta',
    bpm: 88,
    pater: [
      0, 1, -1, 2,
      3, 0, -1, 1,
      2, 3, -1, 0,
      1, 2, -1, 3,
      0, 2, -1, 1,
      3, 1, -1, 0,
      0, 1, -1, 2,
      3, 2, -1, 1,
    ],
  },
  {
    id: 'hizli',
    ad: 'Son Dans',
    zorluk: 'Hızlı',
    bpm: 96,
    pater: [
      0, 1, -1, 2,
      3, -1, 0, -1,
      1, 2, -1, 3,
      0, -1, 1, -1,
      2, 3, -1, 0,
      1, -1, 2, -1,
      0, 3, -1, 1,
      2, -1, 3, -1,
    ],
  },
];
