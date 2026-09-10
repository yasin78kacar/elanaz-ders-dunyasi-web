import { useEffect, useRef, useState } from 'react';
import { BOS, KATEGORI_AD, PALET, bolgeKucukMu } from '../boyama/tipler';
import { SAYFALAR } from '../boyama/yukle';
import { SayfaCiz } from '../boyama/SayfaCiz';
import { sesAdim, sesZafer } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import '../styles/OyunIskelesi.css';
import '../styles/BoyamaKosesi.css';

interface Props { onClose: () => void; }

const BoyamaKosesi: React.FC<Props> = ({ onClose }) => {
  const [ix, setIx] = useState(0);
  const [renkler, setRenkler] = useState<Record<string, string>>({});
  const [secili, setSecili] = useState<string | null>(null);
  const [paletAcik, setPaletAcik] = useState(false);
  const [kutla, setKutla] = useState(false);
  const kutlandi = useRef(false);

  const sayfa = SAYFALAR[ix];
  const boyanacaklar = sayfa.bolgeler.filter((b) => !bolgeKucukMu(b));
  const bolgeIdler = boyanacaklar.map((b) => b.id);
  const boyanan = bolgeIdler.filter((id) => renkler[id] && renkler[id] !== BOS).length;
  const renk = (id: string) => renkler[id] ?? BOS;

  useEffect(() => {
    const idler = sayfa.bolgeler.filter((b) => !bolgeKucukMu(b)).map((b) => b.id);
    const bitti = idler.length > 0 && idler.every((id) => renkler[id] && renkler[id] !== BOS);
    if (bitti && !kutlandi.current) {
      kutlandi.current = true;
      setKutla(true);
      sesZafer();
    }
  }, [renkler, sayfa]);

  const temizle = () => {
    setRenkler({});
    setSecili(null);
    setPaletAcik(false);
    setKutla(false);
    kutlandi.current = false;
  };

  const onSec = (id: string) => {
    const bolge = sayfa.bolgeler.find((b) => b.id === id);
    if (!bolge || bolgeKucukMu(bolge)) return;
    setSecili(id);
    setPaletAcik(true);
    sesAdim();
  };

  const boya = (hex: string) => {
    if (!secili) return;
    setRenkler((once) => ({ ...once, [secili]: hex }));
  };

  const yeniSayfa = () => {
    setIx((i) => (i + 1) % SAYFALAR.length);
    temizle();
  };

  return (
    <div className="by-wrap">
      <Konfeti goster={kutla} />
      <button className="by-geri" onClick={onClose}>← Ana Sayfa</button>
      <header className="by-baslik-blok">
        <h1 className="by-baslik">🎨 Boyama Köşesi</h1>
        <p className="by-alt">
          {sayfa.baslik} · {KATEGORI_AD[sayfa.kategori]} · {boyanan} / {bolgeIdler.length} boyandı
        </p>
      </header>

      <div className="by-kagit">
        <svg
          className="by-svg"
          viewBox={sayfa.viewBox ?? '0 0 400 360'}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={sayfa.baslik}
          onClick={() => { setSecili(null); setPaletAcik(false); }}
        >
          <SayfaCiz sayfa={sayfa} renk={renk} secili={secili} onSec={onSec} />
        </svg>
        {kutla && (
          <div className="by-kutla" role="status">
            <span className="by-kutla-emoji">🎉</span>
            <p>Harika! Hepsi boyandı!</p>
          </div>
        )}
      </div>

      {paletAcik && secili ? (
        <div className="by-palet" role="listbox" aria-label="Renk paleti">
          {PALET.map((hex) => (
            <button
              key={hex}
              type="button"
              className={`by-renk${renkler[secili] === hex ? ' by-renk-secili' : ''}`}
              style={{ background: hex }}
              aria-label={`Renk ${hex}`}
              onClick={() => boya(hex)}
            />
          ))}
        </div>
      ) : (
        <p className="by-ipucu">Bir yere dokun, sonra renk seç.</p>
      )}

      <div className="by-butonlar">
        <button type="button" className="by-btn by-btn-sifir" onClick={temizle}>Sıfırla</button>
        <button type="button" className="by-btn by-btn-yeni" onClick={yeniSayfa}>Yeni Sayfa</button>
      </div>
    </div>
  );
};

export default BoyamaKosesi;
