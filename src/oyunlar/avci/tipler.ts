import type { PointerEvent } from 'react';

export type SahneId = 'park' | 'orman' | 'sehir';

export type Ornek = { id: string; cx: number; cy: number; r: number };

export type Gorev = {
  id: string;
  ad: string;
  ikon: 'cicek' | 'top' | 'kelebek' | 'ucurtma' | 'kova' | 'mantar' | 'baykus' | 'tilki' | 'salyangoz' | 'kus' | 'kurbaga' | 'semsiye' | 'kedi' | 'balon' | 'guvercin' | 'kopek' | 'canta';
  ornekler: Ornek[];
};

export type SahneTanimi = {
  id: SahneId;
  ad: string;
  zorluk: 'Kolay' | 'Orta' | 'Zor';
  gorevler: Gorev[];
};

export type SahneProps = {
  uid: string;
  bulunan: ReadonlySet<string>;
  yeniId: string | null;
  onPointerDown?: (e: PointerEvent<SVGSVGElement>) => void;
};
