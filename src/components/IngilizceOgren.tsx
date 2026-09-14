import { useRef, useState } from 'react';
import kelimeListesi from '../ingilizce/seviye1.json';
import '../styles/IngilizceOgren.css';

type Kelime = { en: string; tr: string; kat: string; ikon: string };

type Props = { onClose: () => void };

const KELIMELER = kelimeListesi as Kelime[];

const KATEGORILER: { id: string; ad: string }[] = [
  { id: 'hayvanlar', ad: 'Hayvanlar' },
  { id: 'yiyecek', ad: 'Yiyecekler' },
  { id: 'okul', ad: 'Okul' },
  { id: 'ev', ad: 'Ev' },
  { id: 'vucut', ad: 'Vücudum' },
  { id: 'giysi', ad: 'Giysiler' },
  { id: 'tasit', ad: 'Taşıtlar' },
  { id: 'doga', ad: 'Doğa' },
];

function ttsOku(kelime: string, bitince: () => void) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(kelime);
  u.lang = 'en-US';
  u.rate = 0.8;
  const sesler = window.speechSynthesis.getVoices();
  const s = sesler.find((v) => v.name.includes('Samantha')) || sesler.find((v) => v.lang === 'en-US');
  if (s) u.voice = s;
  u.onend = bitince;
  u.onerror = bitince;
  window.speechSynthesis.speak(u);
}

function Hoparlor() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 9.5v5h3.2L12 18.5V5.5L7.7 9.5z" />
      <path d="M15.2 9.2a4.2 4.2 0 0 1 0 5.6" />
      <path d="M17.6 7a7 7 0 0 1 0 10" />
    </svg>
  );
}

function IngilizceOgren({ onClose }: Props) {
  const [katId, setKatId] = useState<string | null>(null);
  const [calan, setCalan] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const secili = KATEGORILER.find((k) => k.id === katId);

  const kelimeyiSeslendir = (kelime: string) => {
    const onceki = audioRef.current;
    if (onceki) {
      onceki.pause();
      onceki.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    setCalan(kelime);

    const durdurGorsel = () => {
      setCalan((c) => (c === kelime ? null : c));
    };

    let yedeklendi = false;
    const ttsYedek = () => {
      if (yedeklendi) return;
      yedeklendi = true;
      ttsOku(kelime, durdurGorsel);
    };

    const ses = new Audio('/ingilizce/ses/' + kelime + '.m4a');
    audioRef.current = ses;
    ses.addEventListener('error', ttsYedek, { once: true });
    ses.addEventListener('ended', () => {
      if (audioRef.current === ses) durdurGorsel();
    }, { once: true });
    const playSonuc = ses.play();
    if (playSonuc !== undefined) {
      playSonuc.catch(() => ttsYedek());
    }
  };

  if (secili) {
    const kelimeler = KELIMELER.filter((k) => k.kat === secili.id);
    return (
      <div className="io-wrap">
        <button type="button" className="back-btn" onClick={() => setKatId(null)}>← Kategoriler</button>
        <h1 className="io-baslik">{secili.ad}</h1>
        <div className="io-kelime-grid">
          {kelimeler.map((k) => (
            <button
              key={k.en + k.kat}
              type="button"
              className="io-kelime"
              onClick={() => kelimeyiSeslendir(k.en)}
            >
              <img src={k.ikon} alt="" width={64} height={64} draggable={false} />
              <strong>{k.en}</strong>
              <span>{k.tr}</span>
              <span className={`io-dinle${calan === k.en ? ' by-ses-caliyor' : ''}`} aria-hidden="true"><Hoparlor /></span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="io-wrap">
      <button type="button" className="back-btn" onClick={onClose}>← Ana Sayfa</button>
      <h1 className="io-baslik">İngilizce Öğreniyorum</h1>
      <div className="io-kat-grid">
        {KATEGORILER.map((k) => {
          const sayi = KELIMELER.filter((w) => w.kat === k.id).length;
          return (
            <button
              key={k.id}
              type="button"
              className="io-kat"
              onClick={() => setKatId(k.id)}
            >
              <strong>{k.ad}</strong>
              <span>{sayi} kelime</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IngilizceOgren;
