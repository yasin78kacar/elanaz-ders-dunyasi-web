import type { PointerEvent } from 'react';

export type FarkTur = 'renk' | 'yok' | 'boyut' | 'konum';

export type Fark = {
  id: string;
  cx: number;
  cy: number;
  cxB?: number;
  cyB?: number;
  r: number;
  tur: FarkTur;
};

export type SahneId = 'bahce' | 'gol' | 'kis';

export type SahneTanimi = {
  id: SahneId;
  ad: string;
  zorluk: 'Kolay' | 'Orta' | 'Zor';
  farklar: Fark[];
};

export const VB = { w: 400, h: 270 };

export type SahneProps = {
  uid: string;
  bulunan: ReadonlySet<string>;
  yeniId: string | null;
  onPointerDown?: (e: PointerEvent<SVGSVGElement>) => void;
};
