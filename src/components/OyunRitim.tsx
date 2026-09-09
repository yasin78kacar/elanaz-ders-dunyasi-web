import { useEffect, useRef, useState } from 'react';
import { sesCtx, sesRitimIsabet, sesRitimNoot, sesZafer } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import { SahneBando } from '../oyunlar/ritim/SahneBando';
import {
  GOOD_MS, LEAD_MS, PADLAR, PERFECT_MS, PICKUP, PUAN_IYI, PUAN_MUKEMMEL, TURLAR,
} from '../oyunlar/ritim/tipler';
import '../styles/OyunIskelesi.css';
import '../styles/OyunRitim.css';

export type RitimEk = { mukemmel: number; iyi: number; kacti: number; enIyiCombo: number };

interface Props { onBitti: (puan: number, ek?: RitimEk) => void; }

type Sonuc = 'mukemmel' | 'iyi' | 'kacti';
type Vurus = { id: number; pad: number; t: number; sonuc: Sonuc | null; gosterildi: boolean };
type Faz = 'giris' | 'sayac' | 'oyna' | 'ara';
type Parca = { id: number; pad: number; dx: number; dy: number; renk: string };

const OyunRitim = ({ onBitti }: Props) => {
  const [faz, setFaz] = useState<Faz>('giris');
  const [turIx, setTurIx] = useState(0);
  const [sayi, setSayi] = useState(3);
  const [halka, setHalka] = useState<(number | null)[]>([null, null, null, null]);
  const [flash, setFlash] = useState<(null | 'mukemmel' | 'iyi')[]>([null, null, null, null]);
  const [aktif, setAktif] = useState<number | null>(null);
  const [mukemmel, setMukemmel] = useState(0);
  const [iyi, setIyi] = useState(0);
  const [kacti, setKacti] = useState(0);
  const [puan, setPuan] = useState(0);
  const [combo, setCombo] = useState(0);
  const [parca, setParca] = useState<Parca[]>([]);
  const [konfeti, setKonfeti] = useState(false);
  const [kutla, setKutla] = useState(false);

  const vurusRef = useRef<Vurus[]>([]);
  const fazRef = useRef<Faz>('giris');
  const halkaRef = useRef<(number | null)[]>([null, null, null, null]);
  const turIxRef = useRef(0);
  const bittiRef = useRef(false);
  const comboRef = useRef(0);
  const enIyiRef = useRef(0);
  const sayRef = useRef({ m: 0, i: 0, k: 0, p: 0 });
  const pid = useRef(0);
  const onBittiRef = useRef(onBitti);
  onBittiRef.current = onBitti;
  fazRef.current = faz;
  halkaRef.current = halka;
  turIxRef.current = turIx;

  const tur = TURLAR[turIx];

  const bitir = () => {
    if (bittiRef.current) return;
    bittiRef.current = true;
    setKutla(true);
    setKonfeti(true);
    sesZafer();
    const s = sayRef.current;
    window.setTimeout(() => {
      onBittiRef.current(s.p, {
        mukemmel: s.m,
        iyi: s.i,
        kacti: s.k,
        enIyiCombo: enIyiRef.current,
      });
    }, 900);
  };

  const turKur = (ix: number) => {
    const t = TURLAR[ix];
    const beatMs = 60_000 / t.bpm;
    const start = performance.now() + 40;
    const liste: Vurus[] = [];
    let id = 0;
    t.pater.forEach((pad, i) => {
      if (pad < 0) return;
      liste.push({
        id: ++id,
        pad,
        t: start + (PICKUP + i) * beatMs,
        sonuc: null,
        gosterildi: false,
      });
    });
    vurusRef.current = liste;
    const ctx = sesCtx();
    if (ctx) {
      const audio0 = ctx.currentTime + (start - performance.now()) / 1000;
      const beatSec = 60 / t.bpm;
      t.pater.forEach((pad, i) => {
        if (pad < 0) return;
        sesRitimNoot(audio0 + (PICKUP + i) * beatSec, pad);
      });
    }
    setHalka([null, null, null, null]);
    setFlash([null, null, null, null]);
    setAktif(null);
    setFaz('oyna');
    fazRef.current = 'oyna';
  };

  const sayacBaslat = (ix: number) => {
    setTurIx(ix);
    setSayi(3);
    setFaz('sayac');
    fazRef.current = 'sayac';
    window.setTimeout(() => setSayi(2), 700);
    window.setTimeout(() => setSayi(1), 1400);
    window.setTimeout(() => turKur(ix), 2100);
  };

  const basla = () => {
    sesCtx();
    sayacBaslat(0);
  };

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (bittiRef.current) return;
      if (fazRef.current === 'oyna') {
        const now = performance.now();
        let halkaDegis = false;
        const yeniHalka = [...halkaRef.current];
        let kactiYeni = 0;
        for (const v of vurusRef.current) {
          if (!v.sonuc && !v.gosterildi && now >= v.t - LEAD_MS) {
            v.gosterildi = true;
            yeniHalka[v.pad] = v.id;
            halkaDegis = true;
            setAktif(v.pad);
          }
          if (!v.sonuc && now > v.t + GOOD_MS) {
            v.sonuc = 'kacti';
            kactiYeni += 1;
            if (yeniHalka[v.pad] === v.id) {
              yeniHalka[v.pad] = null;
              halkaDegis = true;
            }
          }
        }
        if (halkaDegis) {
          halkaRef.current = yeniHalka;
          setHalka(yeniHalka);
        }
        if (kactiYeni) {
          comboRef.current = 0;
          setCombo(0);
          sayRef.current.k += kactiYeni;
          setKacti(sayRef.current.k);
        }
        const hepsi = vurusRef.current.length > 0 && vurusRef.current.every((v) => v.sonuc);
        if (hepsi) {
          fazRef.current = 'ara';
          const sonraki = turIxRef.current + 1;
          if (sonraki >= TURLAR.length) {
            bitir();
          } else {
            setFaz('ara');
            window.setTimeout(() => sayacBaslat(sonraki), 1600);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const patlat = (pad: number, renk: string) => {
    const ek: Parca[] = Array.from({ length: 7 }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = 18 + Math.random() * 28;
      return {
        id: ++pid.current,
        pad,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d,
        renk,
      };
    });
    setParca((p) => [...p, ...ek]);
    window.setTimeout(() => {
      const ids = new Set(ek.map((e) => e.id));
      setParca((p) => p.filter((x) => !ids.has(x.id)));
    }, 560);
  };

  const dokun = (pad: number) => {
    if (fazRef.current !== 'oyna' || bittiRef.current) return;
    const now = performance.now();
    const v = vurusRef.current.find(
      (x) => x.pad === pad && !x.sonuc && Math.abs(now - x.t) <= GOOD_MS,
    );
    if (!v) return;
    const dt = Math.abs(now - v.t);
    const turSonuc: Sonuc = dt <= PERFECT_MS ? 'mukemmel' : 'iyi';
    v.sonuc = turSonuc;
    const yeniH = [...halkaRef.current];
    if (yeniH[pad] === v.id) yeniH[pad] = null;
    halkaRef.current = yeniH;
    setHalka(yeniH);
    setFlash((f) => {
      const n = [...f] as (null | 'mukemmel' | 'iyi')[];
      n[pad] = turSonuc;
      return n;
    });
    window.setTimeout(() => {
      setFlash((f) => {
        const n = [...f];
        if (n[pad] === turSonuc) n[pad] = null;
        return n;
      });
    }, 320);
    sesRitimIsabet(turSonuc);
    patlat(pad, PADLAR[pad].renk);
    if (turSonuc === 'mukemmel') {
      sayRef.current.m += 1;
      sayRef.current.p += PUAN_MUKEMMEL;
      comboRef.current += 1;
      enIyiRef.current = Math.max(enIyiRef.current, comboRef.current);
      setMukemmel(sayRef.current.m);
      setCombo(comboRef.current);
    } else {
      sayRef.current.i += 1;
      sayRef.current.p += PUAN_IYI;
      comboRef.current = 0;
      setIyi(sayRef.current.i);
      setCombo(0);
    }
    setPuan(sayRef.current.p);
  };

  const zorSinif = tur.zorluk === 'Yavaş' ? '' : tur.zorluk === 'Orta' ? ' orta' : ' hizli';

  return (
    <div className={`oyun-alan rt-oyun${kutla ? ' rt-kutla' : ''}`}>
      <Konfeti goster={konfeti} />
      <div className="rt-ust">
        <span className="rt-baslik">
          {tur.ad}{' '}
          <span className={`rt-zorluk${zorSinif}`}>{tur.zorluk}</span>
        </span>
        <span className="rt-skorlar">
          <span className="m">✨ {mukemmel}</span>
          <span className="i">👍 {iyi}</span>
          <span className="k">· {kacti}</span>
        </span>
        <span>{puan} puan</span>
      </div>

      <div className="rt-pane">
        <svg className="rt-svg" viewBox="0 0 400 280" aria-hidden>
          <SahneBando uid="rt-bando" aktif={aktif} />
        </svg>
        {combo >= 2 && <div className="rt-combo">Seri {combo}!</div>}
        {faz === 'giris' && (
          <div className="rt-ortu">
            <h2>Halka küçülünce bas</h2>
            <p>Renkli daire düğmeye değince dokun. Erken veya geç olursa sorun yok — ceza yok.</p>
            <button type="button" className="rt-basla" onClick={basla}>Başla</button>
          </div>
        )}
        {faz === 'sayac' && (
          <div className="rt-ortu">
            <div className="rt-ortu-sayi">{sayi}</div>
            <p>{tur.zorluk}</p>
          </div>
        )}
        {faz === 'ara' && (
          <div className="rt-ortu">
            <h2>Harika!</h2>
            <p>Sırada: {TURLAR[turIx + 1]?.ad ?? ''}</p>
          </div>
        )}
      </div>

      <div className="rt-padlar">
        {PADLAR.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`rt-pad${halka[p.id] != null ? ' yaklasan' : ''}${flash[p.id] ? ` ${flash[p.id]}` : ''}`}
            style={{
              ['--rt-renk' as string]: p.renk,
              ['--rt-acik' as string]: p.acik,
              ['--rt-koyu' as string]: p.koyu,
            }}
            onPointerDown={(e) => { e.preventDefault(); dokun(p.id); }}
            onClick={(e) => { e.preventDefault(); dokun(p.id); }}
            aria-label={p.ad}
          >
            {halka[p.id] != null && <span key={halka[p.id]} className="rt-halka" />}
            <span aria-hidden>{p.emoji}</span>
            {parca.filter((x) => x.pad === p.id).map((x) => (
              <span
                key={x.id}
                className="rt-parca"
                style={{
                  background: x.renk,
                  ['--dx' as string]: `${x.dx}px`,
                  ['--dy' as string]: `${x.dy}px`,
                }}
              />
            ))}
          </button>
        ))}
      </div>
      <div className="oyun-ipucu">Halka düğmeye değince bas. Kaçırırsan o vuruş geçer — ceza yok.</div>
    </div>
  );
};

export default OyunRitim;
