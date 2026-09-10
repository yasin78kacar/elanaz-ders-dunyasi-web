import type { BoyamaSahneProps } from './tipler';

type Ortak = BoyamaSahneProps & { id: string; sw?: number };

const sinif = (secili: string | null, id: string) =>
  secili === id ? 'by-secili' : 'by-bolge';

export function Bolge({ id, d, renk, secili, onSec, sw }: Ortak & { d: string }) {
  return (
    <path
      d={d}
      fill={renk(id)}
      stroke="#2a2438"
      strokeWidth={secili === id ? 2.6 : (sw ?? 1.25)}
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
      strokeWidth={secili === id ? 2.6 : (sw ?? 1.25)}
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
      strokeWidth={secili === id ? 2.6 : (sw ?? 1.25)}
      className={sinif(secili, id)}
      role="button"
      tabIndex={0}
      aria-label={id}
      aria-pressed={secili === id}
      onClick={(e) => { e.stopPropagation(); onSec(id); }}
    />
  );
}
