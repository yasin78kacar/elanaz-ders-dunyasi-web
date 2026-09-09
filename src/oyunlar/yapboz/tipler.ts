export type SahneId = 'kus' | 'tekne' | 'kale';

export type YapbozSahne = {
  id: SahneId;
  ad: string;
  zorluk: 'Kolay' | 'Orta' | 'Zor';
  cols: number;
  rows: number;
  w: number;
  h: number;
};

export const SAHNELER: YapbozSahne[] = [
  { id: 'kus', ad: 'Bahçe Kuşu', zorluk: 'Kolay', cols: 3, rows: 3, w: 400, h: 400 },
  { id: 'tekne', ad: 'Yelkenli', zorluk: 'Orta', cols: 4, rows: 3, w: 400, h: 300 },
  { id: 'kale', ad: 'Kale', zorluk: 'Zor', cols: 4, rows: 4, w: 400, h: 400 },
];
