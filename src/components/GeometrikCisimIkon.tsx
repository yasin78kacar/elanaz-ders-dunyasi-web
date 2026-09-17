import type { ReactElement } from 'react';
import GeometrikSekilIkon, { type GeometrikSekil } from './GeometrikSekilIkon';

export const CISIM_SEKILLERI = [
  'kup',
  'kare_prizma',
  'dikdortgen_prizma',
  'ucgen_prizma',
  'silindir',
  'kure',
] as const;

export type GeometrikCisim = (typeof CISIM_SEKILLERI)[number];
export type GorselSekil = GeometrikCisim | GeometrikSekil;

const STROKE = '#1A1520';
const SW = 2.2;

const AD: Record<GeometrikCisim, string> = {
  kup: 'Küp',
  kare_prizma: 'Kare prizma',
  dikdortgen_prizma: 'Dikdörtgen prizma',
  ucgen_prizma: 'Üçgen prizma',
  silindir: 'Silindir',
  kure: 'Küre',
};

function Golge({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#1A1520" opacity="0.1" />;
}

/** İzometrik kutu: üst / ön / yan yüz. */
function Kutu({
  cx,
  topY,
  dx,
  dy,
  h,
  ust,
  on,
  yan,
}: {
  cx: number;
  topY: number;
  dx: number;
  dy: number;
  h: number;
  ust: string;
  on: string;
  yan: string;
}) {
  const ustP = `${cx},${topY} ${cx + dx},${topY + dy} ${cx},${topY + 2 * dy} ${cx - dx},${topY + dy}`;
  const onP = `${cx - dx},${topY + dy} ${cx},${topY + 2 * dy} ${cx},${topY + 2 * dy + h} ${cx - dx},${topY + dy + h}`;
  const yanP = `${cx},${topY + 2 * dy} ${cx + dx},${topY + dy} ${cx + dx},${topY + dy + h} ${cx},${topY + 2 * dy + h}`;
  return (
    <>
      <polygon points={yanP} fill={yan} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <polygon points={onP} fill={on} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <polygon points={ustP} fill={ust} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Kup() {
  return (
    <>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <Kutu cx={50} topY={20} dx={22} dy={13} h={30} ust="#7EB6FF" on="#3D8BFD" yan="#2563C7" />
    </>
  );
}

/** Dikey uzun — kare tabanlı prizma. */
function KarePrizma() {
  return (
    <>
      <Golge cx={50} cy={92} rx={22} ry={5} />
      <Kutu cx={50} topY={12} dx={16} dy={9} h={50} ust="#FF8B78" on="#EE6A4E" yan="#C94D38" />
    </>
  );
}

/** Yatay / yassı dikdörtgen prizma. */
function DikdortgenPrizma() {
  return (
    <>
      <Golge cx={50} cy={88} rx={36} ry={6} />
      <Kutu cx={50} topY={30} dx={34} dy={12} h={18} ust="#5ED4BE" on="#1FA893" yan="#157A6C" />
    </>
  );
}

function UcgenPrizma() {
  // Çadır / Toblerone: büyük ön üçgen + ince üst sırt + sağ yan yüz.
  // Derinlik kısa tutulur ki ilk okunan şekil üçgen olsun.
  const P = '36,14';
  const L = '10,82';
  const R = '62,82';
  const P2 = '50,8';
  const L2 = '24,76';
  const R2 = '76,76';
  return (
    <>
      <Golge cx={46} cy={90} rx={32} ry={6} />
      <polygon points={`${P} ${R} ${R2} ${P2}`} fill="#A8558A" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <polygon points={`${P} ${P2} ${L2} ${L}`} fill="#E8A0C8" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <polygon points={`${P} ${L} ${R}`} fill="#D96A9A" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </>
  );
}

function Silindir() {
  return (
    <>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <ellipse cx="50" cy="74" rx="24" ry="10" fill="#A68554" stroke={STROKE} strokeWidth={SW} />
      <path d="M26 28 L26 74 A24 10 0 0 0 74 74 L74 28" fill="#C4A574" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="50" cy="28" rx="24" ry="10" fill="#E8D4B0" stroke={STROKE} strokeWidth={SW} />
    </>
  );
}

function Kure() {
  return (
    <>
      <Golge cx={50} cy={90} rx={26} ry={6} />
      <circle cx="50" cy="50" r="32" fill="#F2A93B" stroke={STROKE} strokeWidth={SW} />
      <ellipse cx="40" cy="40" rx="12" ry="9" fill="#FFF3B0" opacity="0.85" />
    </>
  );
}

const CIZIM: Record<GeometrikCisim, () => ReactElement> = {
  kup: Kup,
  kare_prizma: KarePrizma,
  dikdortgen_prizma: DikdortgenPrizma,
  ucgen_prizma: UcgenPrizma,
  silindir: Silindir,
  kure: Kure,
};

export default function GeometrikCisimIkon({
  sekil,
  size = 80,
}: {
  sekil: string;
  size?: number;
}) {
  if ((CISIM_SEKILLERI as readonly string[]).includes(sekil)) {
    const key = sekil as GeometrikCisim;
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
  return <GeometrikSekilIkon sekil={sekil} size={size} />;
}
