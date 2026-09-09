import { useEffect, useRef, useState } from 'react';
import { sesFark, sesYakin, sesZafer } from '../oyunlar/ses';
import { SAHNELER } from '../oyunlar/yapboz/tipler';
import type { SahneId } from '../oyunlar/yapboz/tipler';
import { SahneKus } from '../oyunlar/yapboz/SahneKus';
import { SahneTekne } from '../oyunlar/yapboz/SahneTekne';
import { SahneKale } from '../oyunlar/yapboz/SahneKale';
import '../styles/OyunIskelesi.css';
import '../styles/OyunYapboz.css';

export type YapbozEk = { sureSn: number; sahne: number };

interface Props { onBitti: (puan: number, ek?: YapbozEk) => void; }

type Parca = { id: number; x: number; y: number; dx: number; dy: number; tur: 'yildiz' | 'nokta'; renk: string };

const RENK_Y = ['#ffe566', '#fff', '#ff9a3c', '#f0c14a', '#fff6d6'];

function karistir(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === i) && n > 1) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

function SahneCiz({ id, uid }: { id: SahneId; uid: string }) {
  if (id === 'kus') return <SahneKus uid={uid} />;
  if (id === 'tekne') return <SahneTekne uid={uid} />;
  return <SahneKale uid={uid} />;
}

function ParcaSvg({
  id, uid, w, h, cols, rows, index, hayalet,
}: {
  id: SahneId;
  uid: string;
  w: number;
  h: number;
  cols: number;
  rows: number;
  index: number;
  hayalet?: boolean;
}) {
  const pw = w / cols;
  const ph = h / rows;
  const x = (index % cols) * pw;
  const y = Math.floor(index / cols) * ph;
  return (
    <svg className={`yb-parca${hayalet ? ' hayalet' : ''}`} viewBox={`${x} ${y} ${pw} ${ph}`} aria-hidden>
      <use href={`#${uid}`} width={w} height={h} />
    </svg>
  );
}

const OyunYapboz = ({ onBitti }: Props) => {
  const [sahneIx, setSahneIx] = useState(0);
  const [tepsi, setTepsi] = useState<number[]>([]);
  const [yuva, setYuva] = useState<(number | null)[]>([]);
  const [secili, setSecili] = useState<number | null>(null);
  const [yeniIx, setYeniIx] = useState<number | null>(null);
  const [salla, setSalla] = useState(false);
  const [ara, setAra] = useState(false);
  const [sureSn, setSureSn] = useState(0);
  const [parca, setParca] = useState<Parca[]>([]);
  const [kutla, setKutla] = useState(false);
  const baslaRef = useRef(Date.now());
  const bittiRef = useRef(false);
  const toplamRef = useRef(0);
  const seriRef = useRef(0);
  const pid = useRef(0);

  const sahne = SAHNELER[sahneIx];
  const n = sahne.cols * sahne.rows;
  const symId = `yb-sym-${sahne.id}`;

  useEffect(() => {
    setTepsi(karistir(n));
    setYuva(Array(n).fill(null));
    setSecili(null);
    setYeniIx(null);
    setKutla(false);
  }, [sahneIx, n]);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!bittiRef.current) setSureSn(Math.floor((Date.now() - baslaRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(t);
  }, []);

  const parilti = (buyuk: boolean) => {
    const list: Parca[] = [];
    const adet = buyuk ? 22 : 10;
    for (let i = 0; i < adet; i++) {
      const a = (i / adet) * Math.PI * 2 + Math.random() * 0.25;
      const d = (buyuk ? 40 : 24) + Math.random() * (buyuk ? 70 : 36);
      list.push({
        id: ++pid.current,
        x: 50 + (Math.random() * 20 - 10),
        y: 45 + (Math.random() * 16 - 8),
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d - 12,
        tur: i % 3 === 0 ? 'nokta' : 'yildiz',
        renk: RENK_Y[i % RENK_Y.length],
      });
    }
    setParca(list);
    window.setTimeout(() => setParca([]), buyuk ? 1000 : 800);
  };

  const bitir = () => {
    if (bittiRef.current) return;
    bittiRef.current = true;
    const sn = Math.floor((Date.now() - baslaRef.current) / 1000);
    window.setTimeout(() => onBitti(toplamRef.current, { sureSn: sn, sahne: SAHNELER.length }), 800);
  };

  const sonraki = () => {
    if (sahneIx >= SAHNELER.length - 1) {
      bitir();
      return;
    }
    setAra(true);
    window.setTimeout(() => {
      setSahneIx((i) => i + 1);
      setAra(false);
    }, 1400);
  };

  const yerlestir = (slot: number) => {
    if (bittiRef.current || ara) return;
    if (yuva[slot] !== null) return;
    if (secili === null) return;
    if (secili !== slot) {
      seriRef.current = 0;
      sesYakin('ilik');
      setSalla(true);
      setSecili(null);
      window.setTimeout(() => setSalla(false), 380);
      return;
    }
    seriRef.current += 1;
    toplamRef.current += 1;
    sesFark(seriRef.current);
    const yeniYuva = yuva.map((v, i) => (i === slot ? secili : v));
    setYuva(yeniYuva);
    setTepsi(tepsi.filter((p) => p !== secili));
    setSecili(null);
    setYeniIx(slot);
    parilti(false);
    window.setTimeout(() => setYeniIx(null), 560);
    if (yeniYuva.every((v) => v !== null)) {
      setKutla(true);
      sesZafer();
      parilti(true);
      window.setTimeout(sonraki, 1100);
    }
  };

  if (ara) {
    return (
      <div className="oyun-alan yb-oyun">
        <div className="yb-ara">
          <h2>Tablo tamam!</h2>
          <p>Sırada: {SAHNELER[sahneIx + 1]?.ad}</p>
          <div className="yb-noktalar">{SAHNELER.map((_, i) => (i <= sahneIx ? '●' : '○')).join(' ')}</div>
        </div>
      </div>
    );
  }

  const zorSinif = sahne.zorluk === 'Kolay' ? '' : sahne.zorluk === 'Orta' ? ' orta' : ' zor';
  const dolu = yuva.filter((v) => v !== null).length;

  return (
    <div className="oyun-alan yb-oyun">
      <svg className="yb-sembol" aria-hidden>
        <symbol id={symId} viewBox={`0 0 ${sahne.w} ${sahne.h}`}>
          <SahneCiz id={sahne.id} uid={symId} />
        </symbol>
      </svg>
      <div className="yb-ust">
        <span className="yb-baslik">
          {sahne.ad}{' '}
          <span className={`yb-zorluk${zorSinif}`}>{sahne.zorluk}</span>
        </span>
        <span>{dolu} / {n}</span>
        <span>{sureSn} sn</span>
      </div>
      <div className={`yb-tahta${salla ? ' salla' : ''}`}>
        <div
          className="yb-izgara"
          style={{ gridTemplateColumns: `repeat(${sahne.cols}, 1fr)` }}
        >
          {yuva.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`yb-yuva${p !== null ? ' dolu' : ''}${yeniIx === i ? ' yeni' : ''}`}
              onClick={() => yerlestir(i)}
              aria-label={p !== null ? `Yuva ${i + 1} dolu` : `Yuva ${i + 1}`}
            >
              <ParcaSvg
                id={sahne.id}
                uid={symId}
                w={sahne.w}
                h={sahne.h}
                cols={sahne.cols}
                rows={sahne.rows}
                index={p === null ? i : p}
                hayalet={p === null}
              />
            </button>
          ))}
        </div>
        {(kutla || parca.length > 0) && (
          <div className="yb-kutlama" aria-hidden>
            {parca.map((pr) => (
              <span
                key={pr.id}
                className={pr.tur === 'yildiz' ? 'yb-yildiz' : 'yb-nokta'}
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
      <div className="yb-tepsi">
        {tepsi.map((p) => (
          <button
            key={p}
            type="button"
            className={`yb-tepsi-parca${secili === p ? ' secili' : ''}`}
            onClick={() => setSecili(secili === p ? null : p)}
            aria-label={`Parça ${p + 1}`}
          >
            <ParcaSvg
              id={sahne.id}
              uid={symId}
              w={sahne.w}
              h={sahne.h}
              cols={sahne.cols}
              rows={sahne.rows}
              index={p}
            />
          </button>
        ))}
      </div>
      <div className="oyun-ipucu">Önce alttan parça seç, sonra ızgarada yerine dokun. Yanlışta parça geri gelir — ceza yok.</div>
    </div>
  );
};

export default OyunYapboz;
