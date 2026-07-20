import { useState, useEffect } from 'react';
import '../styles/BesN1K.css';

interface Props { onClose: () => void; }

// 5N1K hücre anahtarları — sütun sırası: Kim / Nerede / Niçin / Nasıl / Ne / Ne Zaman
type HucreKey = 'kim' | 'nerede' | 'nicin' | 'nasil' | 'ne' | 'neZaman';

interface Soru {
  id: string;
  tablo: Record<HucreKey, string>;
  sorulan: HucreKey;
  options: string[];
  correctAnswer: number;
}

const SUTUNLAR: { key: HucreKey; label: string; emoji: string }[] = [
  { key: 'kim',     label: 'Kim',      emoji: '🧒' },
  { key: 'nerede',  label: 'Nerede',   emoji: '📍' },
  { key: 'nicin',   label: 'Niçin',    emoji: '💡' },
  { key: 'nasil',   label: 'Nasıl',    emoji: '🎯' },
  { key: 'ne',      label: 'Ne',       emoji: '📦' },
  { key: 'neZaman', label: 'Ne Zaman', emoji: '⏰' },
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function ses(dogru: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notalar = dogru ? [523.25, 659.25, 783.99] : [220, 196];
    let t = ctx.currentTime;
    notalar.forEach((f) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = dogru ? 'sine' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2); t += 0.16;
    });
  } catch { /* ses yoksa sessiz */ }
}

const BesN1K: React.FC<Props> = ({ onClose }) => {
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [puan, setPuan] = useState(0);
  const [secili, setSecili] = useState<number | null>(null);
  const [sonuc, setSonuc] = useState<'idle' | 'dogru' | 'yanlis'>('idle');
  const [bitti, setBitti] = useState(false);

  useEffect(() => {
    let iptal = false;
    (async () => {
      try {
        const r = await fetch('./data/5n1k/sorular.json');
        if (!r.ok) throw new Error('Sorular yüklenemedi.');
        const data = await r.json();
        if (!iptal) setSorular(data.questions || []);
      } catch (e) {
        if (!iptal) setHata(e instanceof Error ? e.message : 'Bir hata oluştu.');
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    })();
    return () => { iptal = true; };
  }, []);

  const cevapla = (i: number) => {
    if (sonuc !== 'idle' || sorular.length === 0) return;
    const soru = sorular[index];
    const dogruMu = i === soru.correctAnswer;
    setSecili(i);
    setSonuc(dogruMu ? 'dogru' : 'yanlis');
    ses(dogruMu);
    if (dogruMu) setPuan((p) => p + 1);

    setTimeout(() => {
      setSonuc('idle');
      setSecili(null);
      if (index < sorular.length - 1) {
        setIndex((x) => x + 1);
      } else {
        setBitti(true);
      }
    }, dogruMu ? 900 : 1600);
  };

  const bastanBasla = () => {
    setIndex(0); setPuan(0); setSecili(null); setSonuc('idle'); setBitti(false);
  };

  if (yukleniyor) {
    return (
      <div className="bnk-wrap">
        <div className="bnk-loading"><div className="bnk-spinner" /><p>Sorular yükleniyor…</p></div>
      </div>
    );
  }

  if (hata) {
    return (
      <div className="bnk-wrap">
        <button className="back-btn" onClick={onClose}>← Ana Sayfa</button>
        <div className="bnk-error">⚠️ {hata}</div>
      </div>
    );
  }

  if (bitti) {
    const yuzde = sorular.length > 0 ? Math.round((puan / sorular.length) * 100) : 0;
    return (
      <div className="bnk-wrap">
        <button className="back-btn" onClick={onClose}>← Ana Sayfa</button>
        <div className="bnk-bitis">
          <div className="bnk-bitis-emoji">{yuzde >= 60 ? '🎉' : '💪'}</div>
          <h2 className="bnk-bitis-baslik">Tebrikler!</h2>
          <p className="bnk-bitis-skor">{puan} / {sorular.length} doğru</p>
          <div className="bnk-bitis-btns">
            <button className="bnk-btn-primary" onClick={bastanBasla}>🔁 Tekrar Oyna</button>
            <button className="bnk-btn-ghost" onClick={onClose}>🏠 Ana Sayfa</button>
          </div>
        </div>
      </div>
    );
  }

  const soru = sorular[index];
  const ilerleme = sorular.length > 0 ? (index / sorular.length) * 100 : 0;

  return (
    <div className="bnk-wrap">
      {sonuc === 'yanlis' && <div className="bnk-balon bnk-balon-yanlis">💪 Olsun, tekrar dene!</div>}
      {sonuc === 'dogru' && <div className="bnk-balon bnk-balon-dogru">🎉 Aferin!</div>}

      <button className="back-btn" onClick={onClose}>← Ana Sayfa</button>

      <div className="bnk-card">
        <div className="bnk-topbar">
          <span className="bnk-label">🔍 5N1K</span>
          <span className="bnk-score">⭐ {puan}/{index}</span>
        </div>

        <div className="bnk-progress-track">
          <div className="bnk-progress-fill" style={{ width: `${ilerleme}%` }} />
        </div>
        <p className="bnk-progress-text">Soru {index + 1} / {sorular.length}</p>

        <p className="bnk-yonerge">Boş kutuya hangi cevap gelmeli?</p>

        {/* 6 hücrelik 5N1K tablosu — sorulan hücre boş/vurgulu */}
        <div className="bnk-tablo" role="table" aria-label="5N1K tablosu">
          {SUTUNLAR.map((s) => {
            const sorulanMi = s.key === soru.sorulan;
            const deger = soru.tablo[s.key];
            const dolu = !sorulanMi || sonuc === 'dogru';
            const gosterilen = sorulanMi
              ? (sonuc === 'dogru' ? deger : '?')
              : deger;
            return (
              <div
                key={s.key}
                className={`bnk-hucre${sorulanMi ? ' bnk-hucre--sorulan' : ''}${sorulanMi && sonuc === 'dogru' ? ' bnk-hucre--dolduruldu' : ''}`}
                role="cell"
              >
                <span className="bnk-hucre-baslik">{s.emoji} {s.label}</span>
                <span className={`bnk-hucre-deger${dolu ? '' : ' bnk-hucre-deger--bos'}`}>{gosterilen}</span>
              </div>
            );
          })}
        </div>

        <div className="bnk-secenekler">
          {soru.options.map((opt, i) => {
            let cls = 'bnk-secenek';
            if (secili !== null) {
              if (i === soru.correctAnswer) cls += ' bnk-secenek--dogru';
              else if (i === secili) cls += ' bnk-secenek--yanlis';
              else cls += ' bnk-secenek--sonuk';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => cevapla(i)}
                disabled={sonuc !== 'idle'}
              >
                <span className="bnk-secenek-harf">{OPTION_LABELS[i]}</span>
                <span className="bnk-secenek-metin">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BesN1K;
