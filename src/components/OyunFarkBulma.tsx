import { useEffect, useRef, useState } from 'react';
import { sesFark, sesYakin } from '../oyunlar/ses';
import { SAHNELER } from '../oyunlar/fark/sahneler';
import { SahneBahce } from '../oyunlar/fark/SahneBahce';
import { SahneGol } from '../oyunlar/fark/SahneGol';
import { SahneKis } from '../oyunlar/fark/SahneKis';
import type { Fark, SahneId } from '../oyunlar/fark/tipler';
import '../styles/OyunIskelesi.css';
import '../styles/OyunFarkBulma.css';

export type FarkEk = { sureSn: number; sahne: number };

interface Props { onBitti: (puan: number, ek?: FarkEk) => void; }

type Isi = 'soguk' | 'ilik' | 'sicak';
type Parca = { id: number; x: number; y: number; dx: number; dy: number; tur: 'yildiz' | 'nokta'; renk: string };
type Ipu = { id: number; x: number; y: number; isi: Isi; pane: 'a' | 'b' };

const RENK_Y = ['#ffe566', '#fff', '#ff9a3c', '#f0c14a', '#fff6d6'];

function svgNokta(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(ctm.inverse());
}

function merkez(f: Fark, pane: 'a' | 'b') {
  return {
    x: pane === 'b' ? (f.cxB ?? f.cx) : f.cx,
    y: pane === 'b' ? (f.cyB ?? f.cy) : f.cy,
  };
}

function mesafe(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function SahneCiz({
  id, uid, bulunan, yeniId, asil, onPointerDown,
}: {
  id: SahneId;
  uid: string;
  bulunan: ReadonlySet<string>;
  yeniId: string | null;
  asil: boolean;
  onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
}) {
  const p = { uid, bulunan, yeniId, asil, onPointerDown };
  if (id === 'bahce') return <SahneBahce {...p} />;
  if (id === 'gol') return <SahneGol {...p} />;
  return <SahneKis {...p} />;
}

const OyunFarkBulma = ({ onBitti }: Props) => {
  const [sahneIx, setSahneIx] = useState(0);
  const [bulunan, setBulunan] = useState<string[]>([]);
  const [yeniId, setYeniId] = useState<string | null>(null);
  const [salla, setSalla] = useState<{ pane: 'a' | 'b'; isi: Isi } | null>(null);
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

  const tikla = (pane: 'a' | 'b', e: React.PointerEvent<SVGSVGElement>) => {
    if (bittiRef.current || ara) return;
    const svg = e.currentTarget;
    const pt = svgNokta(svg, e.clientX, e.clientY);
    if (!pt) return;
    const kalan = sahne.farklar.filter((f) => !bulunanSet.has(f.id));
    const isabet = kalan
      .map((f) => {
        const m = merkez(f, pane);
        return { f, d: mesafe(pt.x, pt.y, m.x, m.y) };
      })
      .filter((x) => x.d <= x.f.r)
      .sort((a, b) => a.d - b.d)[0]?.f;

    const rect = svg.getBoundingClientRect();
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
      if (sonraki.length === sahne.farklar.length) {
        window.setTimeout(sonrakiSahne, 850);
      }
      return;
    }

    seriRef.current = 0;
    let min = Infinity;
    kalan.forEach((f) => {
      const m = merkez(f, pane);
      min = Math.min(min, mesafe(pt.x, pt.y, m.x, m.y));
    });
    const isi: Isi = min < 48 ? 'sicak' : min < 90 ? 'ilik' : 'soguk';
    sesYakin(isi);
    setSalla({ pane, isi });
    setIpucu({ id: ++pid.current, x: px, y: py, isi, pane });
    window.setTimeout(() => setSalla(null), 420);
    window.setTimeout(() => setIpucu(null), 700);
  };

  if (ara) {
    return (
      <div className="oyun-alan fb-oyun">
        <div className="fb-ara">
          <h2>Hepsi bulundu!</h2>
          <p>Sırada: {SAHNELER[sahneIx + 1]?.ad}</p>
          <div className="fb-noktalar">{SAHNELER.map((_, i) => (i <= sahneIx ? '●' : '○')).join(' ')}</div>
        </div>
      </div>
    );
  }

  const zorSinif = sahne.zorluk === 'Kolay' ? '' : sahne.zorluk === 'Orta' ? ' orta' : ' zor';

  return (
    <div className="oyun-alan fb-oyun">
      <div className="fb-ust">
        <span className="fb-baslik">
          {sahne.ad}{' '}
          <span className={`fb-zorluk${zorSinif}`}>{sahne.zorluk}</span>
        </span>
        <span>{bulunan.length} / {sahne.farklar.length}</span>
        <span>{sureSn} sn</span>
      </div>
      <div className="fb-sahneler">
        {(['a', 'b'] as const).map((pane) => (
          <div
            key={pane}
            className={`fb-pane${salla?.pane === pane ? ` salla-${salla.isi}` : ''}`}
          >
            <span className="fb-etiket">{pane === 'a' ? 'Resim 1' : 'Resim 2'}</span>
            <SahneCiz
              id={sahne.id}
              uid={`${sahne.id}-${pane}`}
              bulunan={bulunanSet}
              yeniId={yeniId}
              asil={pane === 'a'}
              onPointerDown={(e) => tikla(pane, e)}
            />
            {ipucu && ipucu.pane === pane && (
              <span className={`fb-ipucu ${ipucu.isi}`} style={{ left: `${ipucu.x}%`, top: `${ipucu.y}%` }}>
                {ipucu.isi === 'sicak' ? 'Sıcak!' : ipucu.isi === 'ilik' ? 'Ilık…' : 'Soğuk'}
              </span>
            )}
            <div className="fb-parilti" aria-hidden>
              {parca.map((p) => (
                <span
                  key={p.id}
                  className={p.tur === 'yildiz' ? 'fb-yildiz' : 'fb-nokta'}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    background: p.renk,
                    ['--dx' as string]: `${p.dx}px`,
                    ['--dy' as string]: `${p.dy}px`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="oyun-ipucu">İki resme bak. Farklı olan yere dokun. Yanlışta soğuk / ılık / sıcak dersin — ceza yok.</div>
    </div>
  );
};

export default OyunFarkBulma;
