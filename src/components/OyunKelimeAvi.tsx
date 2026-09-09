import { useEffect, useMemo, useRef, useState } from 'react';
import { ses } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import '../styles/OyunIskelesi.css';
import '../styles/OyunKelimeAvi.css';

const N = 6;
const HAVUZ = ['KEDİ', 'ELMA', 'OKUL', 'KUŞ', 'TOP', 'ARI', 'BAL', 'MASA', 'SÜT', 'GÜL', 'ANA', 'SARI', 'MAVİ', 'MOR', 'KALEM'];
const HARF = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const RENK = ['#1D9E75', '#378ADD', '#D4537E', '#EF9F27', '#7F77DD'];

type Hucre = { r: number; c: number };
type Bulunan = { kelime: string; hucreler: Hucre[]; renk: string };

function komsu(a: Hucre, b: Hucre) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

function anahtar(h: Hucre) {
  return `${h.r},${h.c}`;
}

function yerlestir(grid: (string | '')[][], kelime: string): Hucre[] | null {
  const yonler: [number, number][] = [[0, 1], [1, 0]];
  const denemeler: { r: number; c: number; dr: number; dc: number }[] = [];
  for (const [dr, dc] of yonler) {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        denemeler.push({ r, c, dr, dc });
      }
    }
  }
  denemeler.sort(() => Math.random() - 0.5);
  for (const { r, c, dr, dc } of denemeler) {
    const yol: Hucre[] = [];
    let olur = true;
    for (let i = 0; i < kelime.length; i++) {
      const nr = r + i * dr;
      const nc = c + i * dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) { olur = false; break; }
      const varOlan = grid[nr][nc];
      if (varOlan && varOlan !== kelime[i]) { olur = false; break; }
      yol.push({ r: nr, c: nc });
    }
    if (!olur) continue;
    yol.forEach((h, i) => { grid[h.r][h.c] = kelime[i]; });
    return yol;
  }
  return null;
}

function doldur(grid: (string | '')[][]) {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!grid[r][c]) grid[r][c] = HARF[Math.floor(Math.random() * HARF.length)];
    }
  }
}

function tahtaUret() {
  for (let deneme = 0; deneme < 40; deneme++) {
    const kelimeler = [...HAVUZ].sort(() => Math.random() - 0.5).slice(0, 5);
    const grid: (string | '')[][] = Array.from({ length: N }, () => Array(N).fill(''));
    let tamam = true;
    for (const k of kelimeler) {
      if (!yerlestir(grid, k)) { tamam = false; break; }
    }
    if (!tamam) continue;
    doldur(grid);
    return { grid: grid as string[][], kelimeler };
  }
  const kelimeler = ['KEDİ', 'ELMA', 'TOP', 'ARI', 'BAL'];
  const grid: (string | '')[][] = Array.from({ length: N }, () => Array(N).fill(''));
  kelimeler.forEach((k, i) => {
    for (let j = 0; j < k.length; j++) grid[i][j] = k[j];
  });
  doldur(grid);
  return { grid: grid as string[][], kelimeler };
}

export type AviEk = { sureSn: number; hamle: number };

interface Props { onBitti: (puan: number, ek?: AviEk) => void; }

function duzCizgi(yol: Hucre[], yeni: Hucre) {
  if (yol.length === 0) return true;
  const son = yol[yol.length - 1];
  if (!komsu(son, yeni)) return false;
  if (yol.some(x => x.r === yeni.r && x.c === yeni.c)) return false;
  if (yol.length === 1) return true;
  const once = yol[yol.length - 2];
  return yeni.r === son.r + (son.r - once.r) && yeni.c === son.c + (son.c - once.c);
}

const OyunKelimeAvi = ({ onBitti }: Props) => {
  const tahta = useMemo(tahtaUret, []);
  const [secim, setSecim] = useState<Hucre[]>([]);
  const [bulunan, setBulunan] = useState<Bulunan[]>([]);
  const [salla, setSalla] = useState(false);
  const [hamle, setHamle] = useState(0);
  const [sureSn, setSureSn] = useState(0);
  const [konfeti, setKonfeti] = useState(false);
  const baslaRef = useRef(Date.now());
  const bittiRef = useRef(false);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!bittiRef.current) setSureSn(Math.floor((Date.now() - baslaRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(t);
  }, []);

  const bulunanSet = new Set(bulunan.map(b => b.kelime));
  const bulunanHucre = new Map<string, string>();
  bulunan.forEach(b => b.hucreler.forEach(h => bulunanHucre.set(anahtar(h), b.renk)));

  const bitir = (liste: Bulunan[], hamleSayisi: number) => {
    if (bittiRef.current) return;
    bittiRef.current = true;
    const sn = Math.floor((Date.now() - baslaRef.current) / 1000);
    setKonfeti(true);
    setTimeout(() => onBitti(liste.length, { sureSn: sn, hamle: hamleSayisi }), 700);
  };

  const tikla = (r: number, c: number) => {
    if (bittiRef.current) return;
    const h = { r, c };
    const son = secim[secim.length - 1];
    if (son && son.r === r && son.c === c) {
      setSecim(secim.slice(0, -1));
      return;
    }
    const yeni = duzCizgi(secim, h) ? [...secim, h] : [h];
    const yeniHamle = hamle + 1;
    setHamle(yeniHamle);
    const metin = yeni.map(x => tahta.grid[x.r][x.c]).join('');
    const eslesen = tahta.kelimeler.find(k => !bulunanSet.has(k) && k === metin);
    if (eslesen) {
      ses(true);
      const renk = RENK[bulunan.length % RENK.length];
      const sonraki = [...bulunan, { kelime: eslesen, hucreler: yeni, renk }];
      setBulunan(sonraki);
      setSecim([]);
      setKonfeti(true);
      setTimeout(() => setKonfeti(false), 900);
      if (sonraki.length === tahta.kelimeler.length) bitir(sonraki, yeniHamle);
      return;
    }
    const prefix = tahta.kelimeler.some(k => !bulunanSet.has(k) && k.startsWith(metin));
    if (!prefix) {
      ses(false);
      setSecim(yeni);
      setSalla(true);
      setTimeout(() => { setSalla(false); setSecim([]); }, 380);
      return;
    }
    setSecim(yeni);
  };

  return (
    <div className="oyun-alan ka-oyun">
      <Konfeti goster={konfeti} />
      <div className="ka-ust">
        <span>{sureSn} sn</span>
        <span>Hamle {hamle}</span>
      </div>
      <div className="ka-liste">
        {tahta.kelimeler.map(k => {
          const b = bulunan.find(x => x.kelime === k);
          return (
            <span
              key={k}
              className={`ka-kelime${b ? ' bulundu' : ''}`}
              style={b ? { background: b.renk } : undefined}
            >
              {k}
            </span>
          );
        })}
      </div>
      <div className="ka-grid">
        {tahta.grid.map((satir, r) =>
          satir.map((harf, c) => {
            const secili = secim.some(x => x.r === r && x.c === c);
            const renk = bulunanHucre.get(anahtar({ r, c }));
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={`ka-hucre${secili ? ' secili' : ''}${salla && secili ? ' salla' : ''}`}
                style={renk ? { background: renk, color: '#fff' } : undefined}
                onClick={() => tikla(r, c)}
              >
                {harf}
              </button>
            );
          })
        )}
      </div>
      <button className="oyun-geri" onClick={() => setSecim([])}>Temizle</button>
      <div className="oyun-ipucu">Yan yana veya alt alta dokun. Çapraz yok. Yanlışta sadece seçim sıfırlanır.</div>
    </div>
  );
};

export default OyunKelimeAvi;
