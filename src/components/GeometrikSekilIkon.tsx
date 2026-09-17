import type { ReactElement } from 'react';

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
const SW = 2.2;

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

function Golge({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#1A1520" opacity="0.1" />;
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
  return (
    <>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <polygon points="50,20 18,78 82,78" fill="#D96A9A" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Kare() {
  return (
    <>
      <Golge cx={50} cy={90} rx={26} ry={6} />
      <rect x="24" y="24" width="52" height="52" fill="#3D8BFD" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Dikdortgen() {
  return (
    <>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <rect x="12" y="34" width="76" height="32" fill="#1FA893" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Besgen() {
  return (
    <>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <polygon points={duzenliCokgen(5, 50, 50, 36)} fill="#EE6A4E" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Altigen() {
  return (
    <>
      <Golge cx={50} cy={90} rx={30} ry={6} />
      <polygon points={duzenliCokgen(6, 50, 50, 36)} fill="#7F77DD" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Daire() {
  return (
    <>
      <Golge cx={50} cy={90} rx={26} ry={6} />
      <circle cx="50" cy="50" r="32" fill="#F2A93B" stroke={STROKE} strokeWidth={SW} />
    </>
  );
}

function Oval() {
  return (
    <>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <ellipse cx="50" cy="50" rx="40" ry="22" fill="#3DBBD4" stroke={STROKE} strokeWidth={SW} />
    </>
  );
}

function Yildiz() {
  return (
    <>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <polygon points={yildizCokgen(50, 50, 36, 14)} fill="#E8A817" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Paralelkenar() {
  return (
    <>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <polygon points="18,34 72,34 88,70 34,70" fill="#C45ED4" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Yamuk() {
  return (
    <>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <polygon points="28,32 72,32 90,72 10,72" fill="#5CAD4A" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Sekizgen() {
  return (
    <>
      <Golge cx={50} cy={90} rx={30} ry={6} />
      <polygon points={duzenliCokgen(8, 50, 50, 36)} fill="#E5476A" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
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
  size = 80,
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
