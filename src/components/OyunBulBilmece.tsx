import { useMemo, useState } from 'react';
import { sesFark, sesYakin } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import { BILMECELER, ISIM } from '../oyunlar/bilmece/tipler';
import type { IkonId } from '../oyunlar/bilmece/tipler';
import { Ikon } from '../oyunlar/bilmece/Ikonlar';
import '../styles/OyunIskelesi.css';
import '../styles/OyunBulBilmece.css';

export type BulBilmeceEk = { enIyiSeri: number };

interface Props { onBitti: (puan: number, ek?: BulBilmeceEk) => void; }

const TUR = 8;

function karistir<T>(a: T[]): T[] {
  const d = [...a];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

const OyunBulBilmece = ({ onBitti }: Props) => {
  const deste = useMemo(() => karistir(BILMECELER).slice(0, TUR), []);
  const [ix, setIx] = useState(0);
  const [siklar, setSiklar] = useState<IkonId[]>(() => {
    const b = deste[0];
    return karistir([b.dogru, ...b.celdirici]);
  });
  const [kilit, setKilit] = useState(false);
  const [secim, setSecim] = useState<IkonId | null>(null);
  const [dogru, setDogru] = useState(0);
  const [seri, setSeri] = useState(0);
  const [enIyi, setEnIyi] = useState(0);
  const [konfeti, setKonfeti] = useState(false);

  const b = deste[ix];

  const sonraki = (yeniDogru: number, yeniEnIyi: number) => {
    if (ix + 1 >= TUR) {
      setKonfeti(true);
      window.setTimeout(() => onBitti(yeniDogru, { enIyiSeri: yeniEnIyi }), 700);
      return;
    }
    const n = deste[ix + 1];
    setIx(ix + 1);
    setSiklar(karistir([n.dogru, ...n.celdirici]));
    setSecim(null);
    setKilit(false);
  };

  const sec = (id: IkonId) => {
    if (kilit) return;
    setKilit(true);
    setSecim(id);
    const oldu = id === b.dogru;
    if (oldu) {
      const yeniSeri = seri + 1;
      const yeniEnIyi = Math.max(enIyi, yeniSeri);
      const yeniDogru = dogru + 1;
      setSeri(yeniSeri);
      setEnIyi(yeniEnIyi);
      setDogru(yeniDogru);
      sesFark(yeniSeri);
      setKonfeti(true);
      window.setTimeout(() => setKonfeti(false), 500);
      window.setTimeout(() => sonraki(yeniDogru, yeniEnIyi), 700);
    } else {
      setSeri(0);
      sesYakin('ilik');
      window.setTimeout(() => sonraki(dogru, enIyi), 1100);
    }
  };

  return (
    <div className="oyun-alan bb-oyun">
      <Konfeti goster={konfeti} />
      <div className="bb-ust">
        <span>Bilmece {ix + 1} / {TUR}</span>
        {seri >= 2 && <span className="bb-seri">Seri {seri}!</span>}
        <span>{dogru} doğru</span>
      </div>
      <p className="bb-metin">{b.metin}</p>
      <div className="bb-grid">
        {siklar.map((id) => {
          const oldu = secim !== null && id === b.dogru;
          const yanlis = secim === id && id !== b.dogru;
          return (
            <button
              key={id}
              type="button"
              className={`bb-kart${oldu && secim === id ? ' parla' : ''}${oldu && secim !== id ? ' dogru-goster' : ''}${yanlis ? ' salla' : ''}`}
              onClick={() => sec(id)}
              disabled={kilit}
              aria-label={ISIM[id]}
            >
              <svg viewBox="0 0 80 80" aria-hidden>
                <Ikon id={id} />
              </svg>
              <span className="bb-ad">{ISIM[id]}</span>
            </button>
          );
        })}
      </div>
      <div className="oyun-ipucu">Bilmeceyi oku, resmi seç. Yanlışta doğru gösterilir — ceza yok.</div>
    </div>
  );
};

export default OyunBulBilmece;
