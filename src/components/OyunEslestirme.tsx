import { useState } from 'react';
import { ses } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import '../styles/OyunIskelesi.css';
import '../styles/OyunEslestirme.css';

/** Hafıza oyunundaki 12 emojiden tamamen ayrı set. */
const EMOJI = ['🍓', '🍇', '🍉', '🍑', '🥝', '🎂', '🎁', '🎯'];

function bonusPuan(seri: number) {
  return 10 + Math.max(0, seri - 1) * 5;
}

function desteUret() {
  return [...EMOJI, ...EMOJI].sort(() => Math.random() - 0.5);
}

export type EslestirmeEk = { enIyiSeri: number };

interface Props {
  onBitti: (puan: number, ek?: EslestirmeEk) => void;
}

const OyunEslestirme: React.FC<Props> = ({ onBitti }) => {
  const [deste] = useState(desteUret);
  const [acik, setAcik] = useState<number[]>([]);
  const [bulunan, setBulunan] = useState<Set<number>>(new Set());
  const [kilit, setKilit] = useState(false);
  const [puan, setPuan] = useState(0);
  const [seri, setSeri] = useState(0);
  const [enIyiSeri, setEnIyiSeri] = useState(0);
  const [parlayan, setParlayan] = useState<number[]>([]);
  const [konfeti, setKonfeti] = useState(false);

  const cevir = (i: number) => {
    if (kilit || acik.includes(i) || bulunan.has(i)) return;
    const yeniAcik = [...acik, i];
    setAcik(yeniAcik);
    if (yeniAcik.length !== 2) return;

    setKilit(true);
    const [a, b] = yeniAcik;
    const eslesti = deste[a] === deste[b];

    if (eslesti) {
      ses(true);
      const yeniSeri = seri + 1;
      const kazanc = bonusPuan(yeniSeri);
      const yeniPuan = puan + kazanc;
      setSeri(yeniSeri);
      if (yeniSeri > enIyiSeri) setEnIyiSeri(yeniSeri);
      setPuan(yeniPuan);
      setParlayan([a, b]);
      setKonfeti(true);
      const yeniBulunan = new Set(bulunan);
      yeniBulunan.add(a);
      yeniBulunan.add(b);
      setTimeout(() => {
        setKonfeti(false);
        setParlayan([]);
        setBulunan(yeniBulunan);
        setAcik([]);
        setKilit(false);
        if (yeniBulunan.size === deste.length) {
          setTimeout(() => onBitti(yeniPuan, { enIyiSeri: Math.max(enIyiSeri, yeniSeri) }), 500);
        }
      }, 650);
    } else {
      ses(false);
      setSeri(0);
      setTimeout(() => {
        setAcik([]);
        setKilit(false);
      }, 850);
    }
  };

  const sonraki = bonusPuan(seri + 1);

  return (
    <div className="oyun-alan es-oyun">
      <Konfeti goster={konfeti} />
      <div className="es-ust">
        <span>Puan {puan}</span>
        <span className="es-seri">Seri {seri}{enIyiSeri > 1 ? ` · en iyi ${enIyiSeri}` : ''}</span>
      </div>
      <div className="es-bonus">Sonraki eşleşme: +{sonraki} puan</div>
      <div className="es-grid">
        {deste.map((e, i) => {
          const gorunur = acik.includes(i) || bulunan.has(i);
          let cls = 'es-kart';
          if (gorunur) cls += ' acik';
          if (parlayan.includes(i)) cls += ' parla';
          if (bulunan.has(i)) cls += ' bulundu';
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => cevir(i)}
              disabled={kilit && !acik.includes(i)}
              aria-label={gorunur ? e : 'Kapalı kart'}
            >
              <div className="es-kart-ic">
                <div className="es-kart-on">✦</div>
                <div className="es-kart-arka">{e}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="oyun-ipucu">Art arda eşleştir, bonus artsın. Yanlışta sadece bonus sıfırlanır.</div>
    </div>
  );
};

export default OyunEslestirme;
