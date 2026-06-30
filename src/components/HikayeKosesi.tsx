import { useState, useEffect } from 'react';
import { hikayeler } from '../data';
import '../styles/HikayeKosesi.css';

interface Props {
  onClose: () => void;
}

const HikayeKosesi: React.FC<Props> = ({ onClose }) => {
  const [seciliHikaye, setSeciliHikaye] = useState<number | null>(null);
  const [sayfa, setSayfa] = useState(0);
  const [okunuyor, setOkunuyor] = useState(false);

  // Bilesen kapanirken sesi durdur
  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const sesliOku = (metin: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = 'tr-TR';
    u.rate = 0.9;
    u.onend = () => setOkunuyor(false);
    setOkunuyor(true);
    window.speechSynthesis.speak(u);
  };

  const sesiDurdur = () => {
    window.speechSynthesis.cancel();
    setOkunuyor(false);
  };

  // HIKAYE LISTESI
  if (seciliHikaye === null) {
    return (
      <div className="hikaye-container">
        <button className="back-btn" onClick={onClose}>← Ana Sayfa</button>
        <h1 className="hikaye-baslik">📚 Hikaye Köşesi</h1>
        <p className="hikaye-alt">Bir hikaye seç, oku ya da dinle!</p>
        <div className="hikaye-liste">
          {hikayeler.map((h, i) => (
            <button key={h.id} className="hikaye-kart" onClick={() => { setSeciliHikaye(i); setSayfa(0); }}>
              <span className="hikaye-emoji">📖</span>
              <span className="hikaye-kart-baslik">{h.baslik}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // HIKAYE OKUMA
  const h = hikayeler[seciliHikaye];
  const sonSayfa = sayfa >= h.sayfalar.length - 1;
  const ilkSayfa = sayfa <= 0;

  return (
    <div className="hikaye-container">
      <button className="back-btn" onClick={() => { sesiDurdur(); setSeciliHikaye(null); }}>← Hikayeler</button>
      <h2 className="hikaye-okuma-baslik">{h.baslik}</h2>
      <div className="hikaye-sayfa">
        <p className="hikaye-metin">{h.sayfalar[sayfa]}</p>
      </div>
      <div className="hikaye-ses-row">
        {okunuyor ? (
          <button className="hikaye-ses-btn durdur" onClick={sesiDurdur}>⏹️ Durdur</button>
        ) : (
          <button className="hikaye-ses-btn" onClick={() => sesliOku(h.sayfalar[sayfa])}>🔊 Dinle</button>
        )}
      </div>
      <div className="hikaye-nav">
        <button className="hikaye-nav-btn" disabled={ilkSayfa} onClick={() => { sesiDurdur(); setSayfa(sayfa - 1); }}>← Önceki</button>
        <span className="hikaye-sayfa-no">{sayfa + 1} / {h.sayfalar.length}</span>
        <button className="hikaye-nav-btn" disabled={sonSayfa} onClick={() => { sesiDurdur(); setSayfa(sayfa + 1); }}>Sonraki →</button>
      </div>
    </div>
  );
};

export default HikayeKosesi;
