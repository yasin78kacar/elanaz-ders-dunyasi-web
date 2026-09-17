import { useId, type ReactElement } from 'react';
import GeometrikSekilIkon, { type GeometrikSekil } from './GeometrikSekilIkon';

export const CISIM_SEKILLERI = [
  'kup',
  'kare_prizma',
  'dikdortgen_prizma',
  'ucgen_prizma',
  'silindir',
  'kure',
  'koni',
  'piramit',
] as const;

export type GeometrikCisim = (typeof CISIM_SEKILLERI)[number];
export type GorselSekil = GeometrikCisim | GeometrikSekil;

const STROKE = '#1A1520';
const SW = 3;
const CIZGI = {
  stroke: STROKE,
  strokeWidth: SW,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

const AD: Record<GeometrikCisim, string> = {
  kup: 'Küp',
  kare_prizma: 'Kare prizma',
  dikdortgen_prizma: 'Dikdörtgen prizma',
  ucgen_prizma: 'Üçgen prizma',
  silindir: 'Silindir',
  kure: 'Küre',
  koni: 'Koni',
  piramit: 'Piramit',
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

function RadialDolgu({ id, renk }: { id: string; renk: string }) {
  return (
    <radialGradient id={id} cx="36%" cy="32%" r="72%">
      <stop offset="0" stopColor={acikTon(renk)} />
      <stop offset="0.5" stopColor={renk} />
      <stop offset="1" stopColor={koyuTon(renk)} />
    </radialGradient>
  );
}

function Golge({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx * 1.15} ry={ry * 1.25} fill="#1A1520" opacity="0.15" />;
}

function Parlama() {
  return <ellipse cx="38" cy="34" rx="11" ry="8" fill="#FFFFFF" opacity="0.4" />;
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
  const uid = gid(useId(), 'kutu');
  const ustP = `${cx},${topY} ${cx + dx},${topY + dy} ${cx},${topY + 2 * dy} ${cx - dx},${topY + dy}`;
  const onP = `${cx - dx},${topY + dy} ${cx},${topY + 2 * dy} ${cx},${topY + 2 * dy + h} ${cx - dx},${topY + dy + h}`;
  const yanP = `${cx},${topY + 2 * dy} ${cx + dx},${topY + dy} ${cx + dx},${topY + dy + h} ${cx},${topY + 2 * dy + h}`;
  return (
    <>
      <defs>
        <LinearDolgu id={`${uid}-yan`} renk={yan} />
        <LinearDolgu id={`${uid}-on`} renk={on} />
        <LinearDolgu id={`${uid}-ust`} renk={ust} />
      </defs>
      <polygon points={yanP} fill={`url(#${uid}-yan)`} {...CIZGI} />
      <polygon points={onP} fill={`url(#${uid}-on)`} {...CIZGI} />
      <polygon points={ustP} fill={`url(#${uid}-ust)`} {...CIZGI} />
      <Parlama />
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
  const uid = gid(useId(), 'ucgenp');
  const P = '36,14';
  const L = '10,82';
  const R = '62,82';
  const P2 = '50,8';
  const L2 = '24,76';
  const R2 = '76,76';
  return (
    <>
      <defs>
        <LinearDolgu id={`${uid}-yan`} renk="#A8558A" />
        <LinearDolgu id={`${uid}-sirt`} renk="#E8A0C8" />
        <LinearDolgu id={`${uid}-on`} renk="#D96A9A" />
      </defs>
      <Golge cx={46} cy={90} rx={32} ry={6} />
      <polygon points={`${P} ${R} ${R2} ${P2}`} fill={`url(#${uid}-yan)`} {...CIZGI} />
      <polygon points={`${P} ${P2} ${L2} ${L}`} fill={`url(#${uid}-sirt)`} {...CIZGI} />
      <polygon points={`${P} ${L} ${R}`} fill={`url(#${uid}-on)`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Silindir() {
  const uid = gid(useId(), 'sil');
  return (
    <>
      <defs>
        <LinearDolgu id={`${uid}-alt`} renk="#A68554" />
        <LinearDolgu id={`${uid}-govde`} renk="#C4A574" />
        <LinearDolgu id={`${uid}-ust`} renk="#E8D4B0" />
      </defs>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <ellipse cx="50" cy="74" rx="24" ry="10" fill={`url(#${uid}-alt)`} {...CIZGI} />
      <path d="M26 28 L26 74 A24 10 0 0 0 74 74 L74 28" fill={`url(#${uid}-govde)`} {...CIZGI} />
      <ellipse cx="50" cy="28" rx="24" ry="10" fill={`url(#${uid}-ust)`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Kure() {
  const uid = gid(useId(), 'kure');
  return (
    <>
      <defs>
        <RadialDolgu id={`${uid}-d`} renk="#F2A93B" />
      </defs>
      <Golge cx={50} cy={90} rx={26} ry={6} />
      <circle cx="50" cy="50" r="32" fill={`url(#${uid}-d)`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Koni() {
  const uid = gid(useId(), 'koni');
  return (
    <>
      <defs>
        <LinearDolgu id={`${uid}-taban`} renk="#C45E18" />
        <LinearDolgu id={`${uid}-govde`} renk="#E87B2A" />
      </defs>
      <Golge cx={50} cy={90} rx={28} ry={6} />
      <ellipse cx="50" cy="78" rx="26" ry="10" fill={`url(#${uid}-taban)`} {...CIZGI} />
      <path d="M50 16 L24 78 A26 10 0 0 0 76 78 Z" fill={`url(#${uid}-govde)`} {...CIZGI} />
      <Parlama />
    </>
  );
}

function Piramit() {
  const uid = gid(useId(), 'pir');
  const tepe = '50,14';
  const arka = '50,56';
  const sag = '80,70';
  const on = '50,84';
  const sol = '20,70';
  return (
    <>
      <defs>
        <LinearDolgu id={`${uid}-taban`} renk="#C9A227" />
        <LinearDolgu id={`${uid}-sag`} renk="#C4A050" />
        <LinearDolgu id={`${uid}-on`} renk="#E8C35A" />
      </defs>
      <Golge cx={50} cy={90} rx={32} ry={6} />
      <polygon points={`${arka} ${sag} ${on} ${sol}`} fill={`url(#${uid}-taban)`} {...CIZGI} />
      <polygon points={`${tepe} ${sag} ${on}`} fill={`url(#${uid}-sag)`} {...CIZGI} />
      <polygon points={`${tepe} ${sol} ${on}`} fill={`url(#${uid}-on)`} {...CIZGI} />
      <Parlama />
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
  koni: Koni,
  piramit: Piramit,
};

export default function GeometrikCisimIkon({
  sekil,
  size = 130,
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
