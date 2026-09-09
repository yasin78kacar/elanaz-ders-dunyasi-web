export type Zorluk = 'Kolay' | 'Orta' | 'Zor';

export type Lab = {
  id: string;
  ad: string;
  zorluk: Zorluk;
  satir: string[];
};

export type Nokta = { r: number; c: number };

export const LABIRENTLER: Lab[] = [
  {
    id: 'kucuk',
    ad: 'Bal Bahçesi',
    zorluk: 'Kolay',
    satir: [
      '#######',
      '#S....#',
      '###.#.#',
      '#...#.#',
      '#.###.#',
      '#....G#',
      '#######',
    ],
  },
  {
    id: 'orta',
    ad: 'Çiçek Yolu',
    zorluk: 'Orta',
    satir: [
      '#########',
      '#S.#....#',
      '#..#.##.#',
      '##.#....#',
      '#..##.#.#',
      '#.#...#.#',
      '#.#.###.#',
      '#......G#',
      '#########',
    ],
  },
  {
    id: 'buyuk',
    ad: 'Büyük Bahçe',
    zorluk: 'Zor',
    satir: [
      '###########',
      '#S........#',
      '#########.#',
      '#.........#',
      '#.#.#######',
      '#.#.......#',
      '#######.#.#',
      '#.......#.#',
      '#.#.#######',
      '#.#......G#',
      '###########',
    ],
  },
];

export function parseLab(lab: Lab) {
  const n = lab.satir.length;
  const duvar: boolean[][] = [];
  let start: Nokta = { r: 1, c: 1 };
  let hedef: Nokta = { r: n - 2, c: n - 2 };
  for (let r = 0; r < n; r++) {
    const row = lab.satir[r];
    duvar[r] = [];
    for (let c = 0; c < n; c++) {
      const ch = row[c];
      duvar[r][c] = ch === '#';
      if (ch === 'S') start = { r, c };
      if (ch === 'G') hedef = { r, c };
    }
  }
  return { n, duvar, start, hedef };
}

const YON: Nokta[] = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];

export function yolBul(duvar: boolean[][], from: Nokta, to: Nokta): Nokta[] | null {
  if (from.r === to.r && from.c === to.c) return [from];
  const n = duvar.length;
  const key = (p: Nokta) => `${p.r},${p.c}`;
  const q: Nokta[] = [from];
  const came = new Map<string, Nokta | null>();
  came.set(key(from), null);
  while (q.length) {
    const cur = q.shift()!;
    for (const d of YON) {
      const nx = { r: cur.r + d.r, c: cur.c + d.c };
      if (nx.r < 0 || nx.c < 0 || nx.r >= n || nx.c >= n) continue;
      if (duvar[nx.r][nx.c]) continue;
      const k = key(nx);
      if (came.has(k)) continue;
      came.set(k, cur);
      if (nx.r === to.r && nx.c === to.c) {
        const path: Nokta[] = [nx];
        let p: Nokta | null = cur;
        while (p) {
          path.push(p);
          p = came.get(key(p)) ?? null;
        }
        path.reverse();
        return path;
      }
      q.push(nx);
    }
  }
  return null;
}

export function mesafe(duvar: boolean[][], from: Nokta, to: Nokta) {
  const p = yolBul(duvar, from, to);
  return p ? p.length - 1 : 99;
}

/** Aynı satır/sütunda duvarsız koridor — çapraz ve köşe atlama yok. */
export function duzYol(duvar: boolean[][], from: Nokta, to: Nokta): Nokta[] | null {
  if (from.r === to.r && from.c === to.c) return [from];
  if (from.r !== to.r && from.c !== to.c) return null;
  const n = duvar.length;
  const dr = Math.sign(to.r - from.r);
  const dc = Math.sign(to.c - from.c);
  const path: Nokta[] = [from];
  let r = from.r;
  let c = from.c;
  while (r !== to.r || c !== to.c) {
    r += dr;
    c += dc;
    if (r < 0 || c < 0 || r >= n || c >= n || duvar[r][c]) return null;
    path.push({ r, c });
  }
  return path;
}

export function sonrakiAdim(duvar: boolean[][], from: Nokta, hedef: Nokta): Nokta | null {
  const p = yolBul(duvar, from, hedef);
  return p && p.length > 1 ? p[1] : null;
}
