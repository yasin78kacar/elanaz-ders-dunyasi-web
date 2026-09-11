import { Bolge, BolgeDaire, BolgeElips } from './Bolge';
import { bolgeKucukMu, type BoyamaSahneProps, type BolgeVeri, type SayfaVeri, type SusVeri } from './tipler';

function SusCiz({ s, i }: { s: SusVeri; i: number }) {
  if (s.tur === 'line') {
    return (
      <line
        key={i}
        x1={s.x1}
        y1={s.y1}
        x2={s.x2}
        y2={s.y2}
        stroke={s.stroke ?? '#2a2438'}
        strokeWidth={s.sw ?? 2}
        strokeLinecap="round"
        opacity={s.opacity ?? 0.35}
      />
    );
  }
  if (s.tur === 'daire') {
    return (
      <circle
        key={i}
        cx={s.cx}
        cy={s.cy}
        r={s.r}
        fill={s.fill ?? '#2a2438'}
        opacity={s.opacity ?? 1}
      />
    );
  }
  return (
    <path
      key={i}
      d={s.d}
      fill={s.fill ?? 'none'}
      stroke={s.stroke}
      strokeWidth={s.sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={s.opacity ?? 1}
    />
  );
}

function dekorRenk(b: BolgeVeri): string {
  if (b.dekorRenk) return b.dekorRenk;
  if (b.id.startsWith('alev') || b.id.startsWith('gaga')) return '#e09a3e';
  return '#2a2438';
}

function DekorBolge({ b }: { b: BolgeVeri }) {
  const fill = dekorRenk(b);
  if (b.tur === 'daire') {
    return <circle cx={b.cx} cy={b.cy} r={b.r} fill={fill} stroke="#2a2438" strokeWidth={b.sw ?? 1} />;
  }
  if (b.tur === 'elips') {
    return <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={fill} stroke="#2a2438" strokeWidth={b.sw ?? 1} />;
  }
  return <path d={b.d} fill={fill} stroke="#2a2438" strokeWidth={b.sw ?? 1.1} strokeLinejoin="round" />;
}

export function SayfaCiz({
  sayfa, renk, secili, onSec,
}: BoyamaSahneProps & { sayfa: SayfaVeri }) {
  const p = { renk, secili, onSec };
  return (
    <g>
      {sayfa.bolgeler.map((b) => {
        if (bolgeKucukMu(b)) {
          return (
            <g key={b.id} className="by-sus" aria-hidden>
              <DekorBolge b={b} />
            </g>
          );
        }
        if (b.tur === 'daire') {
          return <BolgeDaire key={b.id} id={b.id} cx={b.cx} cy={b.cy} r={b.r} sw={b.sw} {...p} />;
        }
        if (b.tur === 'elips') {
          return <BolgeElips key={b.id} id={b.id} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} sw={b.sw} {...p} />;
        }
        return <Bolge key={b.id} id={b.id} d={b.d} sw={b.sw} {...p} />;
      })}
      {sayfa.sus && sayfa.sus.length > 0 && (
        <g className="by-sus" aria-hidden>
          {sayfa.sus.map((s, i) => <SusCiz key={i} s={s} i={i} />)}
        </g>
      )}
    </g>
  );
}
