/** Sentetik tamponlarla kova doğrulama — DOM gerekmez. */
import {
  duvarMaskesi,
  enYakinDolgulanabilir,
  maskeSisir,
  taramaDoldur,
  type Rgba,
} from './floodFill.ts';

const BEYAZ: Rgba = [255, 254, 246, 255];
const SIYAH: Rgba = [42, 36, 56, 255];
const KIRMIZI: Rgba = [226, 61, 74, 255];

export type DogrulaMadde = {
  ad: string;
  ok: boolean;
  not: string;
};

function tampon(w: number, h: number): Uint8ClampedArray {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < d.length; i += 4) {
    d[i] = BEYAZ[0];
    d[i + 1] = BEYAZ[1];
    d[i + 2] = BEYAZ[2];
    d[i + 3] = 255;
  }
  return d;
}

function koy(d: Uint8ClampedArray, w: number, x: number, y: number, c: Rgba) {
  const i = (y * w + x) * 4;
  d[i] = c[0];
  d[i + 1] = c[1];
  d[i + 2] = c[2];
  d[i + 3] = c[3];
}

function al(d: Uint8ClampedArray, w: number, x: number, y: number): Rgba {
  const i = (y * w + x) * 4;
  return [d[i], d[i + 1], d[i + 2], d[i + 3]];
}

function halkaCiz(d: Uint8ClampedArray, w: number, h: number, cx: number, cy: number, icR: number, disR: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dist = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (dist >= icR && dist <= disR) koy(d, w, x, y, SIYAH);
    }
  }
}

function dikeyDuvar(
  d: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  x1: number,
  bosY0: number,
  bosY1: number,
) {
  for (let y = 0; y < h; y++) {
    if (y >= bosY0 && y <= bosY1) continue;
    for (let x = x0; x <= x1; x++) koy(d, w, x, y, SIYAH);
  }
}

export function floodFillDogrula(): DogrulaMadde[] {
  const out: DogrulaMadde[] = [];

  {
    const w = 200;
    const h = 180;
    const d = tampon(w, h);
    halkaCiz(d, w, h, 100, 90, 40, 50);
    const mask = duvarMaskesi(d, w, h);
    const ic = taramaDoldur(d, mask, w, h, 100, 90, KIRMIZI);
    const icRenk = al(d, w, 100, 90);
    const disRenk = al(d, w, 8, 8);
    const ok =
      ic.dolan > 100 &&
      icRenk[0] === KIRMIZI[0] &&
      disRenk[0] === BEYAZ[0];
    out.push({
      ad: 'halka-ici-sizinti-yok',
      ok,
      not: `iç ${ic.dolan} px / ${ic.ms.toFixed(2)} ms; dış hâlâ zemin: ${disRenk[0] === BEYAZ[0]}`,
    });
  }

  {
    const w = 200;
    const h = 180;
    const d = tampon(w, h);
    halkaCiz(d, w, h, 100, 90, 40, 50);
    const mask = duvarMaskesi(d, w, h);
    const dis = taramaDoldur(d, mask, w, h, 4, 4, KIRMIZI);
    const icRenk = al(d, w, 100, 90);
    const ok = dis.dolan > 1000 && icRenk[0] === BEYAZ[0];
    out.push({
      ad: 'halka-disi-ice-sizmaz',
      ok,
      not: `dış ${dis.dolan} px / ${dis.ms.toFixed(2)} ms; iç zemin kaldı: ${icRenk[0] === BEYAZ[0]}`,
    });
  }

  {
    const w = 80;
    const h = 80;
    const d = tampon(w, h);
    halkaCiz(d, w, h, 40, 40, 18, 24);
    const mask = duvarMaskesi(d, w, h);
    const duvarX = 40;
    const duvarY = 18; // kalın halka üzerinde
    const kay = enYakinDolgulanabilir(mask, w, h, duvarX, duvarY, 12);
    const son = taramaDoldur(d, mask, w, h, duvarX, duvarY, KIRMIZI);
    const ok = !!kay && son.kaydi && son.dolan > 0;
    out.push({
      ad: 'cizgiden-kaydir',
      ok,
      not: kay
        ? `(${duvarX},${duvarY}) → (${kay.x},${kay.y}); dolan ${son.dolan}`
        : 'kaydırılacak piksel bulunamadı',
    });
  }

  {
    const w = 120;
    const h = 80;
    const d = tampon(w, h);
    dikeyDuvar(d, w, h, 58, 62, 39, 40); // 2 px boşluk
    const mask = maskeSisir(duvarMaskesi(d, w, h), w, h);
    taramaDoldur(d, mask, w, h, 10, 40, KIRMIZI);
    const sag = al(d, w, 110, 40);
    const sizdi = sag[0] === KIRMIZI[0];
    out.push({
      ad: 'sisirme-2px-kapali',
      ok: !sizdi,
      not: sizdi
        ? '1 px şişirme 2 px boşluğu kapatamadı'
        : '1 px şişirme 2 px boşluğu kapattı',
    });
  }

  {
    const w = 120;
    const h = 80;
    const d = tampon(w, h);
    dikeyDuvar(d, w, h, 58, 62, 38, 41); // 4 px boşluk
    const mask = maskeSisir(duvarMaskesi(d, w, h), w, h);
    taramaDoldur(d, mask, w, h, 10, 40, KIRMIZI);
    const sag = al(d, w, 110, 40);
    const sizdi = sag[0] === KIRMIZI[0];
    out.push({
      ad: 'sisirme-4px-hala-acar',
      ok: true,
      not: sizdi
        ? '1 px şişirme 4 px boşluğu kapatmaz (2 px şişirme ister; ince detay riski)'
        : '4 px boşluk 1 px ile de kapandı',
    });
  }

  {
    const w = 80;
    const h = 40;
    const d = tampon(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 35; x <= 44; x++) {
        if (x >= 38 && x <= 41) continue; // 4 px geniş koridor
        koy(d, w, x, y, SIYAH);
      }
    }
    const mask = maskeSisir(duvarMaskesi(d, w, h), w, h);
    const ic = taramaDoldur(d, mask, w, h, 40, 20, KIRMIZI);
    const sol = al(d, w, 8, 20);
    const yutulmadi = ic.dolan > 20 && sol[0] === BEYAZ[0];
    out.push({
      ad: 'ince-koridor-yutulmadi',
      ok: yutulmadi,
      not: yutulmadi
        ? `4 px koridor doldu (${ic.dolan} px), yanlara sızmadı`
        : `koridor yutuldu veya sızdı (dolan ${ic.dolan})`,
    });
  }

  {
    const w = 800;
    const h = 720;
    const d = tampon(w, h);
    const mask = new Uint8Array(w * h);
    const son = taramaDoldur(d, mask, w, h, 1, 1, KIRMIZI);
    const ok = son.dolan === w * h && son.ms < 80;
    out.push({
      ad: 'perf-800x720-tam-dolgu',
      ok,
      not: `${son.dolan} px / ${son.ms.toFixed(2)} ms (eşik 80 ms)`,
    });
  }

  return out;
}
