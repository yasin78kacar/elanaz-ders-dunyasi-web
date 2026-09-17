import { useId, type ReactElement } from 'react';

export const SEKIL_DEGERLERI = [
  'ucgen',
  'kare',
  'dikdortgen',
  'besgen',
  'altigen',
  'daire',
  'oval',
  'yildiz',
  'paralelkenar',
  'yamuk',
  'sekizgen',
] as const;

export type GeometrikSekil = (typeof SEKIL_DEGERLERI)[number];

const STROKE = '#1A1520';
const SW = 3;
const CIZGI = {
  stroke: STROKE,
  strokeWidth: SW,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

const AD: Record<GeometrikSekil, string> = {
  ucgen: 'Üçgen',
  kare: 'Kare',
  dikdortgen: 'Dikdörtgen',
  besgen: 'Beşgen',
  altigen: 'Altıgen',
  daire: 'Daire',
  oval: 'Oval',
  yildiz: 'Yıldız',
  paralelkenar: 'Paralelkenar',
  yamuk: 'Yamuk',
  sekizgen: 'Sekizgen',
};

function rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex(r: number, g: number, b: number): string {
  const k = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + k(r) + k(g) + k(b);
}

function acikTon(hex: string): string {
  const [r, g, b] = rgb(hex);
  return toHex(r + (255 - r) * 0.38, g + (255 - g) * 0.38, b + (255 - b) * 0.38);
}

function koyuTon(hex: string): string {
  const [r, g, b] = rgb(hex);
  return toHex(r * 0.68, g * 0.68, b * 0.68);
}

function gid(uid: string, ad: string): string {
  return uid.replace(/:/g, '') + '-' + ad;
}

function LinearDolgu({ id, renk }: { id: string; renk: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={acikTon(renk)} />
      <stop offset="0.55" stopColor={renk} />
      <stop offset="1" stopColor={koyuTon(renk)} />
    </linearGradient>
  );
}

function Golge({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx * 1.15} ry={ry * 1.25} fill="#1A1520" opacity="0.15" />;
}

function Parlama() {
  return <ellipse cx="38" cy="34" rx="11" ry="8" fill="#FFFFFF" opacity="0.4" />;
}

function duzenliCokgen(n: number, cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((-90 + (360 / n) * i) * Math.PI) / 180;
    pts.push(`${+(cx + r * Math.cos(a)).toFixed(1)},${+(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function yildizCokgen(cx: number, cy: number, rDis: number, rIc: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rDis : rIc;
    const a = ((-90 + 36 * i) * Math.PI) / 180;
    pts.push(`${+(cx + r * Math.cos(a)).toFixed(1)},${+(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function Ucgen() {
  const id = gid(useId(), 'ucgen');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#D96A9A" />
      </defs>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <polygon points="50,20 18,78 82,78" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Kare() {
  const id = gid(useId(), 'kare');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#3D8BFD" />
      </defs>
      <Golge cx={50} cy={90} rx={26} ry={6} />
      <rect x="24" y="24" width="52" height="52" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Dikdortgen() {
  const id = gid(useId(), 'dikd');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#1FA893" />
      </defs>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <rect x="12" y="34" width="76" height="32" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Besgen() {
  const id = gid(useId(), 'besgen');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#EE6A4E" />
      </defs>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <polygon points={duzenliCokgen(5, 50, 50, 36)} fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Altigen() {
  const id = gid(useId(), 'altigen');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#7F77DD" />
      </defs>
      <Golge cx={50} cy={90} rx={30} ry={6} />
      <polygon points={duzenliCokgen(6, 50, 50, 36)} fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Daire() {
  const id = gid(useId(), 'daire');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#F2A93B" />
      </defs>
      <Golge cx={50} cy={90} rx={26} ry={6} />
      <circle cx="50" cy="50" r="32" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Oval() {
  const id = gid(useId(), 'oval');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#3DBBD4" />
      </defs>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <ellipse cx="50" cy="50" rx="40" ry="22" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Yildiz() {
  const id = gid(useId(), 'yildiz');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#E8A817" />
      </defs>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <polygon points={yildizCokgen(50, 50, 36, 14)} fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Paralelkenar() {
  const id = gid(useId(), 'par');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#C45ED4" />
      </defs>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <polygon points="18,34 72,34 88,70 34,70" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Yamuk() {
  const id = gid(useId(), 'yamuk');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#5CAD4A" />
      </defs>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <polygon points="28,32 72,32 90,72 10,72" fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Sekizgen() {
  const id = gid(useId(), 'sekiz');
  return (
    <>
      <defs>
        <LinearDolgu id={id} renk="#E5476A" />
      </defs>
      <Golge cx={50} cy={90} rx={30} ry={6} />
      <polygon points={duzenliCokgen(8, 50, 50, 36)} fill={`url(#${id})`} {...CIZGI} />
      <Parlama />
    </>
  );
}

const CIZIM: Record<GeometrikSekil, () => ReactElement> = {
  ucgen: Ucgen,
  kare: Kare,
  dikdortgen: Dikdortgen,
  besgen: Besgen,
  altigen: Altigen,
  daire: Daire,
  oval: Oval,
  yildiz: Yildiz,
  paralelkenar: Paralelkenar,
  yamuk: Yamuk,
  sekizgen: Sekizgen,
};

export default function GeometrikSekilIkon({
  sekil,
  size = 130,
}: {
  sekil: string;
  size?: number;
}) {
  if (!(SEKIL_DEGERLERI as readonly string[]).includes(sekil)) return null;
  const key = sekil as GeometrikSekil;
  const Cizim = CIZIM[key];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={AD[key]}
      shapeRendering="geometricPrecision"
    >
      <Cizim />
    </svg>
  );
}
