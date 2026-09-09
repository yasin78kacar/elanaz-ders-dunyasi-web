import type { Fark } from './tipler';

export function FarkIsaretleri({
  farklar,
  bulunan,
}: {
  farklar: Fark[];
  bulunan: ReadonlySet<string>;
}) {
  return (
    <g pointerEvents="none">
      {farklar.filter((f) => bulunan.has(f.id)).map((f) => (
        <circle key={f.id} className="fb-halka" cx={f.cx} cy={f.cy} r={Math.max(18, f.r * 0.72)} />
      ))}
    </g>
  );
}
