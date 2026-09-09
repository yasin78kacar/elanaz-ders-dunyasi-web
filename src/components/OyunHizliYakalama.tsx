import { useEffect, useRef, useState } from 'react';
import { ses } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import '../styles/OyunIskelesi.css';
import '../styles/OyunHizliYakalama.css';

const TUR_MS = 30_000;
const HIT = 84;
/** Hafıza / Eşleştirme setlerinden ayrı. */
const EMOJI = ['🐞', '🌻', '🍀', '🧸', '🍪', '🌙', '☀️', '🎨'];

function zorluk(elapsed: number) {
  const t = Math.min(1, elapsed / TUR_MS);
  const e = t * t;
  return {
    life: 1850 - e * 950,
    pause: 480 - e * 240,
  };
}

type Hedef = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  born: number;
  life: number;
  yakalandi?: boolean;
};

interface Props { onBitti: (puan: number) => void; }

const OyunHizliYakalama: React.FC<Props> = ({ onBitti }) => {
  const [puan, setPuan] = useState(0);
  const [kalan, setKalan] = useState(30);
  const [hedef, setHedef] = useState<Hedef | null>(null);
  const [konfeti, setKonfeti] = useState(false);

  const startRef = useRef(0);
  const hedefRef = useRef<Hedef | null>(null);
  const nextAtRef = useRef(0);
  const puanRef = useRef(0);
  const bittiRef = useRef(false);
  const kalanRef = useRef(30);
  const sonKonumRef = useRef({ x: 0.5, y: 0.5 });
  const idRef = useRef(0);
  const onBittiRef = useRef(onBitti);
  onBittiRef.current = onBitti;

  useEffect(() => {
    const basla = performance.now();
    startRef.current = basla;
    nextAtRef.current = basla + 550;
    bittiRef.current = false;
    let raf = 0;

    const tick = (now: number) => {
      if (bittiRef.current) return;
      const elapsed = now - startRef.current;
      if (elapsed >= TUR_MS) {
        bittiRef.current = true;
        hedefRef.current = null;
        setHedef(null);
        setKalan(0);
        setKonfeti(true);
        setTimeout(() => onBittiRef.current(puanRef.current), 500);
        return;
      }
      const sec = Math.ceil((TUR_MS - elapsed) / 1000);
      if (sec !== kalanRef.current) {
        kalanRef.current = sec;
        setKalan(sec);
      }

      const h = hedefRef.current;
      if (h && !h.yakalandi && now - h.born >= h.life) {
        hedefRef.current = null;
        setHedef(null);
        nextAtRef.current = now + zorluk(elapsed).pause;
      }
      if (!hedefRef.current && now >= nextAtRef.current) {
        let x = Math.random();
        let y = Math.random();
        if (Math.abs(x - sonKonumRef.current.x) < 0.18 && Math.abs(y - sonKonumRef.current.y) < 0.18) {
          x = (x + 0.45) % 1;
          y = (y + 0.4) % 1;
        }
        sonKonumRef.current = { x, y };
        const n: Hedef = {
          id: ++idRef.current,
          emoji: EMOJI[idRef.current % EMOJI.length],
          x,
          y,
          born: now,
          life: zorluk(elapsed).life,
        };
        hedefRef.current = n;
        setHedef(n);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const yakala = () => {
    const h = hedefRef.current;
    if (!h || h.yakalandi || bittiRef.current) return;
    h.yakalandi = true;
    puanRef.current += 10;
    setPuan(puanRef.current);
    setHedef({ ...h });
    ses(true);
    const elapsed = performance.now() - startRef.current;
    window.setTimeout(() => {
      if (hedefRef.current?.id === h.id) {
        hedefRef.current = null;
        setHedef(null);
        nextAtRef.current = performance.now() + zorluk(elapsed).pause;
      }
    }, 280);
  };

  const bar = (kalan / 30) * 100;

  return (
    <div className="oyun-alan hy-oyun">
      <Konfeti goster={konfeti} />
      <div className="hy-ust">
        <span>Puan {puan}</span>
        <span className="hy-sure">{kalan} sn</span>
      </div>
      <div className="hy-bar" aria-hidden="true">
        <div className="hy-bar-ic" style={{ width: `${bar}%` }} />
      </div>
      <div className="hy-sahne">
        {hedef && (
          <button
            type="button"
            className={`hy-hedef${hedef.yakalandi ? ' parla' : ''}`}
            style={{
              left: `calc(${hedef.x} * (100% - ${HIT}px))`,
              top: `calc(${hedef.y} * (100% - ${HIT}px))`,
            }}
            onClick={yakala}
            aria-label="Yakala"
          >
            {hedef.emoji}
          </button>
        )}
      </div>
      <div className="oyun-ipucu">Belirince dokun. Kaçırınca bir şey olmaz — sonraki gelir.</div>
    </div>
  );
};

export default OyunHizliYakalama;
