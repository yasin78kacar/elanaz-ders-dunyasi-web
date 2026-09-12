/** Canvas kova doldurma — paketsiz, ImageData üzerinde scanline. */

export type Rgba = readonly [number, number, number, number];

export type DoldurSonuc = {
  dolan: number;
  ms: number;
  kaydi: boolean;
  tohumX: number;
  tohumY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const BOS_SONUC: DoldurSonuc = {
  dolan: 0,
  ms: 0,
  kaydi: false,
  tohumX: 0,
  tohumY: 0,
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0,
};

export function parlaklik(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** Koyu pikseller duvar (çizgi). */
export function duvarMaskesi(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  esik = 110,
): Uint8Array {
  const m = new Uint8Array(w * h);
  for (let i = 0, p = 0; p < m.length; p++, i += 4) {
    if (parlaklik(data[i], data[i + 1], data[i + 2]) < esik) m[p] = 1;
  }
  return m;
}

/** 1 piksel şişirme — 1–2 px çizgi boşluğunu kapatır; 4 px için kez=2 gerekir. */
export function maskeSisir(mask: Uint8Array, w: number, h: number, kez = 1): Uint8Array {
  let cur = mask;
  for (let k = 0; k < kez; k++) {
    const out = new Uint8Array(cur);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!cur[y * w + x]) continue;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            out[ny * w + nx] = 1;
          }
        }
      }
    }
    cur = out;
  }
  return cur === mask ? new Uint8Array(mask) : cur;
}

/** Çizgiye denk gelince en yakın doldurulabilir piksele kaydır. */
export function enYakinDolgulanabilir(
  mask: Uint8Array,
  w: number,
  h: number,
  x: number,
  y: number,
  maxR = 12,
): { x: number; y: number } | null {
  if (x < 0 || y < 0 || x >= w || y >= h) return null;
  if (!mask[y * w + x]) return { x, y };
  for (let r = 1; r <= maxR; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (!mask[ny * w + nx]) return { x: nx, y: ny };
      }
    }
  }
  return null;
}

function ayniRenk(
  data: Uint8ClampedArray,
  w: number,
  x: number,
  y: number,
  sr: number,
  sg: number,
  sb: number,
  sa: number,
): boolean {
  const i = (y * w + x) * 4;
  return data[i] === sr && data[i + 1] === sg && data[i + 2] === sb && data[i + 3] === sa;
}

/**
 * Scanline kova: tohum rengi ile bağlı, duvar olmayan pikselleri boyar.
 * mask[p] === 1 → çizgi, asla boyanmaz.
 */
export function taramaDoldur(
  data: Uint8ClampedArray,
  mask: Uint8Array,
  w: number,
  h: number,
  x0: number,
  y0: number,
  renk: Rgba,
  maxKaydir = 12,
): DoldurSonuc {
  const t0 = performance.now();
  const xBas = Math.floor(x0);
  const yBas = Math.floor(y0);
  const kayma = enYakinDolgulanabilir(mask, w, h, xBas, yBas, maxKaydir);
  if (!kayma) return { ...BOS_SONUC, ms: performance.now() - t0 };

  const { x, y } = kayma;
  const kaydi = x !== xBas || y !== yBas;
  const i0 = (y * w + x) * 4;
  const sr = data[i0];
  const sg = data[i0 + 1];
  const sb = data[i0 + 2];
  const sa = data[i0 + 3];
  const [tr, tg, tb, ta] = renk;
  if (sr === tr && sg === tg && sb === tb && sa === ta) {
    return { ...BOS_SONUC, ms: performance.now() - t0, kaydi, tohumX: x, tohumY: y };
  }

  const uygun = (px: number, py: number) => {
    if (px < 0 || py < 0 || px >= w || py >= h) return false;
    if (mask[py * w + px]) return false;
    return ayniRenk(data, w, px, py, sr, sg, sb, sa);
  };

  const stackX = [x];
  const stackY = [y];
  let dolan = 0;
  let minX = x;
  let maxX = x;
  let minY = y;
  let maxY = y;

  while (stackX.length > 0) {
    const cx = stackX.pop() as number;
    const cy = stackY.pop() as number;
    if (!uygun(cx, cy)) continue;

    let left = cx;
    while (left > 0 && uygun(left - 1, cy)) left -= 1;
    let right = cx;
    while (right < w - 1 && uygun(right + 1, cy)) right += 1;

    let ustte = false;
    let altta = false;
    for (let px = left; px <= right; px++) {
      const i = (cy * w + px) * 4;
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
      data[i + 3] = ta;
      dolan += 1;

      if (cy > 0) {
        const varUst = uygun(px, cy - 1);
        if (varUst && !ustte) {
          stackX.push(px);
          stackY.push(cy - 1);
        }
        ustte = varUst;
      }
      if (cy < h - 1) {
        const varAlt = uygun(px, cy + 1);
        if (varAlt && !altta) {
          stackX.push(px);
          stackY.push(cy + 1);
        }
        altta = varAlt;
      }
    }
    if (left < minX) minX = left;
    if (right > maxX) maxX = right;
    if (cy < minY) minY = cy;
    if (cy > maxY) maxY = cy;
  }

  return {
    dolan,
    ms: performance.now() - t0,
    kaydi,
    tohumX: x,
    tohumY: y,
    minX,
    minY,
    maxX,
    maxY,
  };
}
