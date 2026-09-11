import type { BoyamaSahneProps } from './tipler';

type Ortak = BoyamaSahneProps & { id: string; sw?: number };

const sinif = (secili: string | null, id: string) =>
  secili === id ? 'by-secili' : 'by-bolge';

/** Sayfa JSON'unda sw yoksa boyama kitabı kalınlığı. sw: 0.4 gök/oda ince kalır. */
const VARSAYILAN_SW = 5;

/** Seçiliyken kalın sayfanın çizgisi incelmesin. */
function kalinlik(secili: string | null, id: string, sw?: number) {
  const taban = sw ?? VARSAYILAN_SW;
  return secili === id ? Math.max(taban + 0.9, 2.6) : taban;
}

export function Bolge({ id, d, renk, secili, onSec, sw }: Ortak & { d: string }) {
  return (
    <path
      d={d}
      fill={renk(id)}
      stroke="#2a2438"
      strokeWidth={kalinlik(secili, id, sw)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={sinif(secili, id)}
      role="button"
      tabIndex={0}
      aria-label={id}
      aria-pressed={secili === id}
      onClick={(e) => { e.stopPropagation(); onSec(id); }}
    />
  );
}

export function BolgeDaire({
  id, cx, cy, r, renk, secili, onSec, sw,
}: Ortak & { cx: number; cy: number; r: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={renk(id)}
      stroke="#2a2438"
      strokeWidth={kalinlik(secili, id, sw)}
      className={sinif(secili, id)}
      role="button"
      tabIndex={0}
      aria-label={id}
      aria-pressed={secili === id}
      onClick={(e) => { e.stopPropagation(); onSec(id); }}
    />
  );
}

export function BolgeElips({
  id, cx, cy, rx, ry, renk, secili, onSec, sw,
}: Ortak & { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={renk(id)}
      stroke="#2a2438"
      strokeWidth={kalinlik(secili, id, sw)}
      className={sinif(secili, id)}
      role="button"
      tabIndex={0}
      aria-label={id}
      aria-pressed={secili === id}
      onClick={(e) => { e.stopPropagation(); onSec(id); }}
    />
  );
}
