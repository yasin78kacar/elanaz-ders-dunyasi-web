import { useEffect, useRef, useState } from 'react';
import { sesFark, sesYakin } from '../oyunlar/ses';
import { SAHNELER } from '../oyunlar/avci/gorevler';
import { SahnePark } from '../oyunlar/avci/SahnePark';
import { SahneOrman } from '../oyunlar/avci/SahneOrman';
import { SahneSehir } from '../oyunlar/avci/SahneSehir';
import { MiniIkon } from '../oyunlar/avci/Ikonlar';
import type { SahneId } from '../oyunlar/avci/tipler';
import '../styles/OyunIskelesi.css';
import '../styles/OyunNesneAvcisi.css';

export type AvciEk = { sureSn: number; sahne: number };

interface Props { onBitti: (puan: number, ek?: AvciEk) => void; }

type Isi = 'soguk' | 'ilik' | 'sicak';
type Parca = { id: number; x: number; y: number; dx: number; dy: number; tur: 'yildiz' | 'nokta'; renk: string };
type Ipu = { id: number; x: number; y: number; isi: Isi };

const RENK_Y = ['#ffe566', '#fff', '#ff9a3c', '#f0c14a', '#fff6d6'];

function svgNokta(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(ctm.inverse());
}

function SahneCiz({
  id, uid, bulunan, yeniId, onPointerDown,
}: {
  id: SahneId;
  uid: string;
  bulunan: ReadonlySet<string>;
  yeniId: string | null;
  onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
}) {
  const p = { uid, bulunan, yeniId, onPointerDown };
  if (id === 'park') return <SahnePark {...p} />;
  if (id === 'orman') return <SahneOrman {...p} />;
  return <SahneSehir {...p} />;
}

const OyunNesneAvcisi = ({ onBitti }: Props) => {
  const [sahneIx, setSahneIx] = useState(0);
  const [bulunan, setBulunan] = useState<string[]>([]);
  const [yeniId, setYeniId] = useState<string | null>(null);
  const [salla, setSalla] = useState<Isi | null>(null);
  const [ipucu, setIpucu] = useState<Ipu | null>(null);
  const [parca, setParca] = useState<Parca[]>([]);
  const [ara, setAra] = useState(false);
  const [sureSn, setSureSn] = useState(0);
  const seriRef = useRef(0);
  const baslaRef = useRef(Date.now());
  const bittiRef = useRef(false);
  const pid = useRef(0);
  const toplamRef = useRef(0);

  const sahne = SAHNELER[sahneIx];
  const bulunanSet = new Set(bulunan);
  const tumOrnek = sahne.gorevler.flatMap((g) => g.ornekler);
  const sahneBitti = tumOrnek.every((o) => bulunanSet.has(o.id));

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!bittiRef.current) setSureSn(Math.floor((Date.now() - baslaRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(t);
  }, []);

  const parilti = (px: number, py: number) => {
    const list: Parca[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
      const d = 28 + Math.random() * 36;
      list.push({
        id: ++pid.current,
        x: px,
        y: py,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d - 10,
        tur: i % 3 === 0 ? 'nokta' : 'yildiz',
        renk: RENK_Y[i % RENK_Y.length],
      });
    }
    setParca(list);
    window.setTimeout(() => setParca([]), 800);
  };

  const bitir = () => {
    if (bittiRef.current) return;
    bittiRef.current = true;
    const sn = Math.floor((Date.now() - baslaRef.current) / 1000);
    window.setTimeout(() => onBitti(toplamRef.current, { sureSn: sn, sahne: SAHNELER.length }), 700);
  };

  const sonrakiSahne = () => {
    if (sahneIx >= SAHNELER.length - 1) {
      bitir();
      return;
    }
    setAra(true);
    window.setTimeout(() => {
      setSahneIx((i) => i + 1);
      setBulunan([]);
      setYeniId(null);
      setAra(false);
    }, 1400);
  };

  const tikla = (e: React.PointerEvent<SVGSVGElement>) => {
    if (bittiRef.current || ara || sahneBitti) return;
    const pt = svgNokta(e.currentTarget, e.clientX, e.clientY);
    if (!pt) return;
    const kalan = tumOrnek.filter((o) => !bulunanSet.has(o.id));
    const isabet = kalan
      .map((o) => ({ o, d: Math.hypot(pt.x - o.cx, pt.y - o.cy) }))
      .filter((x) => x.d <= x.o.r)
      .sort((a, b) => a.d - b.d)[0]?.o;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    if (isabet) {
      seriRef.current += 1;
      toplamRef.current += 1;
      sesFark(seriRef.current);
      const sonraki = [...bulunan, isabet.id];
      setBulunan(sonraki);
      setYeniId(isabet.id);
      parilti(px, py);
      window.setTimeout(() => setYeniId(null), 750);
      if (tumOrnek.every((o) => sonraki.includes(o.id))) {
        window.setTimeout(sonrakiSahne, 850);
      }
      return;
    }

    seriRef.current = 0;
    let min = Infinity;
    kalan.forEach((o) => { min = Math.min(min, Math.hypot(pt.x - o.cx, pt.y - o.cy)); });
    const isi: Isi = min < 48 ? 'sicak' : min < 90 ? 'ilik' : 'soguk';
    sesYakin(isi);
    setSalla(isi);
    setIpucu({ id: ++pid.current, x: px, y: py, isi });
    window.setTimeout(() => setSalla(null), 420);
    window.setTimeout(() => setIpucu(null), 700);
  };

  if (ara) {
    return (
      <div className="oyun-alan na-oyun">
        <div className="na-ara">
          <h2>Hepsi bulundu!</h2>
          <p>Sırada: {SAHNELER[sahneIx + 1]?.ad}</p>
          <div className="na-noktalar">{SAHNELER.map((_, i) => (i <= sahneIx ? '●' : '○')).join(' ')}</div>
        </div>
      </div>
    );
  }

  const zorSinif = sahne.zorluk === 'Kolay' ? '' : sahne.zorluk === 'Orta' ? ' orta' : ' zor';

  return (
    <div className="oyun-alan na-oyun">
      <div className="na-ust">
        <span className="na-baslik">
          {sahne.ad}{' '}
          <span className={`na-zorluk${zorSinif}`}>{sahne.zorluk}</span>
        </span>
        <span>{bulunan.length} / {tumOrnek.length}</span>
        <span>{sureSn} sn</span>
      </div>
      <div className={`na-pane${salla ? ` salla-${salla}` : ''}`}>
        <SahneCiz
          id={sahne.id}
          uid={`${sahne.id}-av`}
          bulunan={bulunanSet}
          yeniId={yeniId}
          onPointerDown={tikla}
        />
        {ipucu && (
          <span className={`na-ipucu ${ipucu.isi}`} style={{ left: `${ipucu.x}%`, top: `${ipucu.y}%` }}>
            {ipucu.isi === 'sicak' ? 'Sıcak!' : ipucu.isi === 'ilik' ? 'Ilık…' : 'Soğuk'}
          </span>
        )}
        <div className="na-parilti" aria-hidden>
          {parca.map((pr) => (
            <span
              key={pr.id}
              className={pr.tur === 'yildiz' ? 'na-yildiz' : 'na-nokta'}
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
      </div>
      <div className="na-liste">
        {sahne.gorevler.map((g) => {
          const n = g.ornekler.filter((o) => bulunanSet.has(o.id)).length;
          const bitti = n >= g.ornekler.length;
          return (
            <span key={g.id} className={`na-gorev${bitti ? ' bitti' : ''}`}>
              <MiniIkon tur={g.ikon} />
              {g.ad} {n}/{g.ornekler.length}
            </span>
          );
        })}
      </div>
      <div className="oyun-ipucu">Listeden bak, sahnede dokun. Yanlışta soğuk / ılık / sıcak — ceza yok.</div>
    </div>
  );
};

export default OyunNesneAvcisi;
