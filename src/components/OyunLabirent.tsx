import { useEffect, useMemo, useRef, useState } from 'react';
import { sesAdim, sesYakin, sesZafer } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import { Ari, Cali, Cicek, Kovan, YolTas } from '../oyunlar/labirent/Hucreler';
import {
  duzYol, LABIRENTLER, mesafe, parseLab, sonrakiAdim,
} from '../oyunlar/labirent/tipler';
import type { Nokta } from '../oyunlar/labirent/tipler';
import '../styles/OyunIskelesi.css';
import '../styles/OyunLabirent.css';

export type LabirentEk = { hamle: number; sahne: number };

interface Props { onBitti: (puan: number, ek?: LabirentEk) => void; }

type Parca = { id: number; x: number; y: number; dx: number; dy: number; tur: 'yildiz' | 'nokta'; renk: string };

const ADIM_MS = 240;
const RENK_Y = ['#ffe566', '#fff', '#ff9a3c', '#f0c14a', '#fff6d6'];

function Gok() {
  return (
    <svg className="lb-gok" viewBox="0 0 400 70" aria-hidden>
      <circle cx="52" cy="28" r="16" fill="#ffe566" />
      <g className="lb-bulut">
        <ellipse cx="160" cy="22" rx="22" ry="10" fill="#fff" />
        <ellipse cx="144" cy="26" rx="12" ry="7" fill="#fff" />
        <ellipse cx="176" cy="26" rx="12" ry="7" fill="#fff" />
      </g>
      <g className="lb-bulut-2">
        <ellipse cx="310" cy="18" rx="18" ry="8" fill="#fff" opacity="0.9" />
        <ellipse cx="324" cy="22" rx="10" ry="6" fill="#fff" opacity="0.9" />
      </g>
    </svg>
  );
}

const OyunLabirent = ({ onBitti }: Props) => {
  const [ix, setIx] = useState(0);
  const [pos, setPos] = useState<Nokta>({ r: 1, c: 1 });
  const [sol, setSol] = useState(false);
  const [yuru, setYuru] = useState(false);
  const [salla, setSalla] = useState(false);
  const [hamle, setHamle] = useState(0);
  const [ara, setAra] = useState(false);
  const [kutla, setKutla] = useState(false);
  const [konfeti, setKonfeti] = useState(false);
  const [parca, setParca] = useState<Parca[]>([]);
  const [ipucu, setIpucu] = useState(false);

  const lab = LABIRENTLER[ix];
  const { n, duvar, start, hedef } = useMemo(() => parseLab(LABIRENTLER[ix]), [ix]);

  const yuruyor = useRef(false);
  const posRef = useRef(pos);
  const bittiRef = useRef(false);
  const hamleRef = useRef(0);
  const distRef = useRef(99);
  const sonIlerleme = useRef(0);
  const pid = useRef(0);
  const timer = useRef(0);
  const onBittiRef = useRef(onBitti);
  onBittiRef.current = onBitti;
  posRef.current = pos;

  useEffect(() => {
    setPos(start);
    posRef.current = start;
    yuruyor.current = false;
    setYuru(false);
    setKutla(false);
    setIpucu(false);
    distRef.current = mesafe(duvar, start, hedef);
    sonIlerleme.current = hamleRef.current;
  }, [ix]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const parilti = () => {
    const list: Parca[] = [];
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const d = 36 + Math.random() * 70;
      list.push({
        id: ++pid.current,
        x: ((hedef.c + 0.5) / n) * 100,
        y: ((hedef.r + 0.5) / n) * 100,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d - 10,
        tur: i % 3 === 0 ? 'nokta' : 'yildiz',
        renk: RENK_Y[i % RENK_Y.length],
      });
    }
    setParca(list);
    window.setTimeout(() => setParca([]), 1000);
  };

  const carpti = () => {
    sesYakin('ilik');
    setSalla(true);
    window.setTimeout(() => setSalla(false), 380);
  };

  const bitir = () => {
    if (bittiRef.current) return;
    bittiRef.current = true;
    window.setTimeout(() => {
      onBittiRef.current(LABIRENTLER.length, { hamle: hamleRef.current, sahne: LABIRENTLER.length });
    }, 900);
  };

  const vardim = () => {
    setKutla(true);
    setKonfeti(true);
    sesZafer();
    parilti();
    window.setTimeout(() => setKonfeti(false), 900);
    if (ix >= LABIRENTLER.length - 1) {
      window.setTimeout(bitir, 1100);
      return;
    }
    window.setTimeout(() => {
      setAra(true);
      window.setTimeout(() => {
        setSahneIleri();
      }, 1400);
    }, 900);
  };

  const setSahneIleri = () => {
    setIx((i) => i + 1);
    setAra(false);
    setKutla(false);
  };

  const yurut = (path: Nokta[]) => {
    const adimlar = path.slice(1);
    if (!adimlar.length || yuruyor.current) return;
    yuruyor.current = true;
    setYuru(true);
    let i = 0;
    const tick = () => {
      const nxt = adimlar[i];
      const cur = posRef.current;
      if (nxt.c < cur.c) setSol(true);
      if (nxt.c > cur.c) setSol(false);
      posRef.current = nxt;
      setPos(nxt);
      sesAdim();
      hamleRef.current += 1;
      setHamle(hamleRef.current);
      const d = mesafe(duvar, nxt, hedef);
      if (d < distRef.current) {
        distRef.current = d;
        sonIlerleme.current = hamleRef.current;
        setIpucu(false);
      } else if (lab.zorluk !== 'Kolay' && hamleRef.current - sonIlerleme.current >= 8) {
        setIpucu(true);
      }
      i += 1;
      if (nxt.r === hedef.r && nxt.c === hedef.c) {
        yuruyor.current = false;
        setYuru(false);
        vardim();
        return;
      }
      if (i >= adimlar.length) {
        yuruyor.current = false;
        setYuru(false);
        return;
      }
      timer.current = window.setTimeout(tick, ADIM_MS);
    };
    tick();
  };

  const dene = (to: Nokta) => {
    if (bittiRef.current || ara || yuruyor.current || kutla) return;
    const cur = posRef.current;
    if (to.r === cur.r && to.c === cur.c) return;
    if (to.r < 0 || to.c < 0 || to.r >= n || to.c >= n || duvar[to.r][to.c]) {
      carpti();
      return;
    }
    const path = duzYol(duvar, cur, to);
    if (!path || path.length < 2) {
      carpti();
      return;
    }
    yurut(path);
  };

  useEffect(() => {
    const kn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); dene({ r: posRef.current.r - 1, c: posRef.current.c }); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); dene({ r: posRef.current.r + 1, c: posRef.current.c }); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); dene({ r: posRef.current.r, c: posRef.current.c - 1 }); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); dene({ r: posRef.current.r, c: posRef.current.c + 1 }); }
    };
    window.addEventListener('keydown', kn);
    return () => window.removeEventListener('keydown', kn);
  }, [n, duvar, ara, kutla, lab.zorluk]);

  const dist = mesafe(duvar, pos, hedef);
  const cicekYakin = dist <= 1 ? 'cok' : dist <= 4 ? 'yakin' : 'uzak';
  const ipucuHucre = ipucu ? sonrakiAdim(duvar, pos, hedef) : null;
  const zorSinif = lab.zorluk === 'Kolay' ? '' : lab.zorluk === 'Orta' ? ' orta' : ' zor';

  if (ara) {
    return (
      <div className="oyun-alan lb-oyun">
        <div className="lb-ara">
          <h2>Çiçeğe vardı!</h2>
          <p>Sırada: {LABIRENTLER[ix + 1]?.ad}</p>
          <div className="lb-noktalar">{LABIRENTLER.map((_, i) => (i <= ix ? '●' : '○')).join(' ')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="oyun-alan lb-oyun">
      <Konfeti goster={konfeti} />
      <div className="lb-ust">
        <span className="lb-baslik">
          {lab.ad}{' '}
          <span className={`lb-zorluk${zorSinif}`}>{lab.zorluk}</span>
        </span>
        <span>{hamle} hamle</span>
      </div>
      <div className={`lb-pane${salla ? ' salla' : ''}`}>
        <Gok />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="lb-yaprak-ambient"
            style={{ left: `${12 + i * 22}%`, animationDelay: `${i * 1.4}s`, background: i % 2 ? '#5aaa4a' : '#c23d5a' }}
          />
        ))}
        <div className="lb-izgara">
          <div className="lb-tablo">
            <div className="lb-hucreler" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
              {duvar.map((row, r) => row.map((w, c) => {
                const startH = r === start.r && c === start.c;
                const hedefH = r === hedef.r && c === hedef.c;
                const ip = ipucuHucre?.r === r && ipucuHucre.c === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    className={`lb-hucre${w ? ' duvar' : ''}${ip ? ' ipucu' : ''}`}
                    onClick={() => dene({ r, c })}
                    aria-label={w ? 'Çalı' : hedefH ? 'Çiçek' : startH ? 'Kovan' : 'Yol'}
                  >
                    {w ? <Cali v={r * 3 + c} /> : startH ? <Kovan /> : hedefH ? <Cicek yakin={cicekYakin} /> : <YolTas v={r + c} />}
                  </button>
                );
              }))}
            </div>
            <div
              className={`lb-ari${yuru ? ' yuru' : ''}`}
              style={{
                width: `${(120 / n)}%`,
                height: `${(120 / n)}%`,
                left: `${((pos.c + 0.5) / n) * 100}%`,
                top: `${((pos.r + 0.5) / n) * 100}%`,
              }}
            >
              <Ari sol={sol} />
            </div>
            {(kutla || parca.length > 0) && (
              <div className="lb-kutlama" aria-hidden>
                {parca.map((pr) => (
                  <span
                    key={pr.id}
                    className={pr.tur === 'yildiz' ? 'lb-yildiz' : 'lb-nokta'}
                    style={{
                      left: `${pr.x}%`,
                      top: `${pr.y}%`,
                      background: pr.renk,
                      ['--dx' as string]: `${pr.dx}px`,
                      ['--dy' as string]: `${pr.dy}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lb-pad" aria-label="Yön tuşları">
        <button type="button" className="lb-ok yukari" onClick={() => dene({ r: pos.r - 1, c: pos.c })} aria-label="Yukarı">↑</button>
        <button type="button" className="lb-ok sol" onClick={() => dene({ r: pos.r, c: pos.c - 1 })} aria-label="Sol">←</button>
        <button type="button" className="lb-ok sag" onClick={() => dene({ r: pos.r, c: pos.c + 1 })} aria-label="Sağ">→</button>
        <button type="button" className="lb-ok asagi" onClick={() => dene({ r: pos.r + 1, c: pos.c })} aria-label="Aşağı">↓</button>
      </div>
      <div className="oyun-ipucu">Koridora dokun veya ok tuşuyla yürü. Çalıya çarpınca sorun yok — ceza yok.</div>
    </div>
  );
};

export default OyunLabirent;
