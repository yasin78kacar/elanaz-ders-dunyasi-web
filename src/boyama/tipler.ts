export type BoyamaSahneProps = {
  renk: (id: string) => string;
  secili: string | null;
  onSec: (id: string) => void;
};

export type Kategori =
  | 'hayvanlar' | 'araclar' | 'meyve-sebze' | 'doga' | 'gunluk'
  | 'deniz' | 'uzay' | 'spor' | 'meslekler' | 'masal'
  | 'bocekler' | 'cicekler' | 'oyuncaklar' | 'hava' | 'aile'
  | 'okul' | 'park' | 'muzik'
  | 'mevsimler' | 'akvaryum' | 'ciftlik' | 'teknoloji' | 'kutlama'
  | 'dinozorlar' | 'yemek' | 'kis-spor' | 'muze' | 'doga-olay'
  | 'peri-masal' | 'balikcilik' | 'insaat' | 'bilim' | 'hayvanat';

export const KATEGORI_AD: Record<Kategori, string> = {
  hayvanlar: 'Hayvanlar',
  araclar: 'Araçlar',
  'meyve-sebze': 'Meyve-Sebze',
  doga: 'Doğa',
  gunluk: 'Günlük',
  deniz: 'Deniz',
  uzay: 'Uzay',
  spor: 'Spor',
  meslekler: 'Meslekler',
  masal: 'Masal',
  bocekler: 'Böcekler',
  cicekler: 'Çiçekler',
  oyuncaklar: 'Oyuncaklar',
  hava: 'Hava',
  aile: 'Aile',
  okul: 'Okul',
  park: 'Park',
  muzik: 'Müzik',
  mevsimler: 'Mevsimler',
  akvaryum: 'Akvaryum',
  ciftlik: 'Çiftlik',
  teknoloji: 'Teknoloji',
  kutlama: 'Kutlama',
  dinozorlar: 'Dinozorlar',
  yemek: 'Yemek',
  'kis-spor': 'Kış Sporu',
  muze: 'Müze',
  'doga-olay': 'Doğa Olayı',
  'peri-masal': 'Peri Masalı',
  balikcilik: 'Balıkçılık',
  insaat: 'İnşaat',
  bilim: 'Bilim',
  hayvanat: 'Hayvanat',
};

export type BolgePath = { id: string; tur?: 'path'; d: string; sw?: number; dekorRenk?: string };
export type BolgeDaireVeri = { id: string; tur: 'daire'; cx: number; cy: number; r: number; sw?: number; dekorRenk?: string };
export type BolgeElipsVeri = {
  id: string;
  tur: 'elips';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  sw?: number;
  dekorRenk?: string;
};
export type BolgeVeri = BolgePath | BolgeDaireVeri | BolgeElipsVeri;

export type SusVeri =
  | { tur: 'path'; d: string; fill?: string; stroke?: string; sw?: number; opacity?: number }
  | { tur: 'line'; x1: number; y1: number; x2: number; y2: number; stroke?: string; sw?: number; opacity?: number }
  | { tur: 'daire'; cx: number; cy: number; r: number; fill?: string; opacity?: number };

export type SayfaVeri = {
  id: string;
  baslik: string;
  kategori: Kategori;
  viewBox?: string;
  bolgeler: BolgeVeri[];
  sus?: SusVeri[];
};

export const BOS = '#fffef6';

export const PALET = [
  '#e23d4a', '#f97316', '#e8b020', '#84cc16',
  '#22c55e', '#14b8a6', '#378ADD', '#38bdf8',
  '#ec4899', '#a16207', '#78350f', '#1f2937',
  '#fde68a', '#94a3b8',
];

/** 390px telefonda SVG ~300px; viewBox 400 → 0.75 CSS px / birim. */
const TEL_OLCEK = 300 / 400;
const MIN_PARMAK = 20;
/** Göz/gaga gibi benek: her iki eksen de küçük. Uzun sap/direk boyanır. */
const MAX_BENEK = 32;

const PATH_ARG: Record<string, number> = {
  m: 2, l: 2, t: 2, h: 1, v: 1,
  c: 6, s: 4, q: 4, a: 7,
};

function pathKutu(d: string): { w: number; h: number } | null {
  const tok = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tok) return null;
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  const xs: number[] = [];
  const ys: number[] = [];
  const push = (px: number, py: number) => {
    x = px;
    y = py;
    xs.push(px);
    ys.push(py);
  };
  while (i < tok.length) {
    const t = tok[i];
    if (/^[A-Za-z]$/.test(t)) {
      cmd = t;
      i += 1;
      if (cmd === 'Z' || cmd === 'z') continue;
    }
    const low = cmd.toLowerCase();
    const n = PATH_ARG[low];
    if (!n || i + n > tok.length) break;
    const a = tok.slice(i, i + n).map(Number);
    i += n;
    const rel = cmd === low;
    const abs = (px: number, py: number) => (rel ? [x + px, y + py] : [px, py]);
    if (low === 'h') push(rel ? x + a[0] : a[0], y);
    else if (low === 'v') push(x, rel ? y + a[0] : a[0]);
    else if (low === 'a') push(rel ? x + a[5] : a[5], rel ? y + a[6] : a[6]);
    else if (low === 'c') {
      const [c1x, c1y] = abs(a[0], a[1]);
      const [c2x, c2y] = abs(a[2], a[3]);
      xs.push(c1x, c2x);
      ys.push(c1y, c2y);
      push(rel ? x + a[4] : a[4], rel ? y + a[5] : a[5]);
    } else if (low === 's' || low === 'q') {
      const [cx, cy] = abs(a[0], a[1]);
      xs.push(cx);
      ys.push(cy);
      push(rel ? x + a[2] : a[2], rel ? y + a[3] : a[3]);
    } else {
      const px = rel ? x + a[n - 2] : a[n - 2];
      const py = rel ? y + a[n - 1] : a[n - 1];
      push(px, py);
    }
  }
  if (xs.length === 0) return null;
  return {
    w: (Math.max(...xs) - Math.min(...xs)) * TEL_OLCEK,
    h: (Math.max(...ys) - Math.min(...ys)) * TEL_OLCEK,
  };
}

/** Göz / gaga / çekirdek gibi 7 yaş parmağına sığmayan parçalar. */
export function bolgeKucukMu(b: BolgeVeri): boolean {
  if (b.tur === 'daire') return 2 * b.r * TEL_OLCEK < MIN_PARMAK;
  if (b.tur === 'elips') return 2 * Math.min(b.rx, b.ry) * TEL_OLCEK < MIN_PARMAK;
  const k = pathKutu(b.d);
  if (!k) return false;
  const min = Math.min(k.w, k.h);
  const max = Math.max(k.w, k.h);
  return min < MIN_PARMAK && max < MAX_BENEK;
}
