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

const HARFLER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ALFABE_ORNEK: Record<string, string> = {
  A: 'apple',
  B: 'bird',
  C: 'cat',
  D: 'dog',
  E: 'egg',
  F: 'fish',
  G: 'grapes',
  H: 'horse',
  I: 'ice cream',
  J: 'jeans',
  K: 'key',
  L: 'lion',
  M: 'monkey',
  N: 'nose',
  O: 'owl',
  P: 'pencil',
  Q: 'question',
  R: 'rabbit',
  S: 'sun',
  T: 'tree',
  U: 'umbrella',
  V: 'violin',
  W: 'water',
  X: 'x-ray',
  Y: 'yo-yo',
  Z: 'zebra',
};

function sesYolu(ikon: string): string {
  const ad = ikon.split('/').pop()?.replace(/\.svg$/i, '') ?? '';
  return '/ingilizce/ses/' + ad + '.m4a';
}

const HARF_BEKLE_MS = 450;

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
  const [ekran, setEkran] = useState<'giris' | 'kategoriler' | 'alfabe'>('giris');
  const [katId, setKatId] = useState<string | null>(null);
  const [calan, setCalan] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bekleRef = useRef<number | null>(null);
  const secili = KATEGORILER.find((k) => k.id === katId);

  const temizleBekle = () => {
    if (bekleRef.current != null) {
      window.clearTimeout(bekleRef.current);
      bekleRef.current = null;
    }
  };

  const sesCal = (dosya: string, ttsMetin: string, gorselId: string, bitince?: () => void) => {
    const onceki = audioRef.current;
    if (onceki) {
      onceki.pause();
      onceki.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    setCalan(gorselId);

    const bitti = () => {
      if (bitince) bitince();
      else setCalan((c) => (c === gorselId ? null : c));
    };

    let yedeklendi = false;
    const ttsYedek = () => {
      if (yedeklendi) return;
      yedeklendi = true;
      ttsOku(ttsMetin, bitti);
    };

    const ses = new Audio(dosya);
    audioRef.current = ses;
    ses.addEventListener('error', ttsYedek, { once: true });
    ses.addEventListener('ended', () => {
      if (yedeklendi) return;
      if (audioRef.current === ses) bitti();
    }, { once: true });
    const playSonuc = ses.play();
    if (playSonuc !== undefined) {
      playSonuc.catch(() => ttsYedek());
    }
  };

  const kelimeyiSeslendir = (k: Kelime) => {
    temizleBekle();
    sesCal(sesYolu(k.ikon), k.en, k.en);
  };

  const harfiSeslendir = (harf: string) => {
    temizleBekle();
    sesCal('/ingilizce/ses/harfler/' + harf + '.m4a', harf, harf, () => {
      const ornekAd = ALFABE_ORNEK[harf];
      const ornek = ornekAd ? KELIMELER.find((k) => k.en === ornekAd) : undefined;
      if (!ornek) {
        setCalan((c) => (c === harf ? null : c));
        return;
      }
      bekleRef.current = window.setTimeout(() => {
        bekleRef.current = null;
        sesCal(sesYolu(ornek.ikon), ornek.en, harf);
      }, HARF_BEKLE_MS);
    });
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
              onClick={() => kelimeyiSeslendir(k)}
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

  if (ekran === 'alfabe') {
    return (
      <div className="io-wrap">
        <button type="button" className="back-btn" onClick={() => { temizleBekle(); setEkran('giris'); }}>← Geri</button>
        <h1 className="io-baslik">Alfabe</h1>
        <div className="io-harf-grid">
          {HARFLER.map((harf) => {
            const ornekAd = ALFABE_ORNEK[harf];
            const ornek = ornekAd ? KELIMELER.find((k) => k.en === ornekAd) : undefined;
            return (
              <button
                key={harf}
                type="button"
                className={`io-harf${calan === harf ? ' by-ses-caliyor' : ''}`}
                onClick={() => harfiSeslendir(harf)}
              >
                <strong className="io-harf-yazi">{harf} {harf.toLowerCase()}</strong>
                <span className="io-harf-ornek">
                  {ornek ? (
                    <>
                      <img src={ornek.ikon} alt="" width={28} height={28} draggable={false} />
                      {ornek.en}
                    </>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (ekran === 'kategoriler') {
    return (
      <div className="io-wrap">
        <button type="button" className="back-btn" onClick={() => setEkran('giris')}>← Ana Sayfa</button>
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
  }

  return (
    <div className="io-wrap">
      <button type="button" className="back-btn" onClick={onClose}>← Ana Sayfa</button>
      <h1 className="io-baslik">İngilizce Öğreniyorum</h1>
      <div className="io-giris-grid">
        <button type="button" className="io-giris-kart" onClick={() => setEkran('alfabe')}>
          <strong>Alfabe</strong>
          <span>26 harf ve okunuşları</span>
        </button>
        <button type="button" className="io-giris-kart" onClick={() => setEkran('kategoriler')}>
          <strong>Kelimeler</strong>
          <span>127 kelime, 8 konu</span>
        </button>
      </div>
    </div>
  );
}

export default IngilizceOgren;
