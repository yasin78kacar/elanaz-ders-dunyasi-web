import { useEffect, useRef, useState } from 'react';
import { BOS, KATEGORI_AD, KATEGORI_EMOJI, PALET, bolgeKucukMu, type Kategori, type SayfaVeri } from '../boyama/tipler';
import { SAYFA_SIRA, kategoriOzetleri, kategoriSayfalari, kategoriYukle, sayfaYukleId } from '../boyama/yukle';
import { SayfaCiz } from '../boyama/SayfaCiz';
import { sesAdim, sesZafer } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import '../styles/OyunIskelesi.css';
import '../styles/BoyamaKosesi.css';

interface Props { onClose: () => void; }

const KAT_KAGIT = [
  '#fff4e5', '#e8f7ee', '#e8f1ff', '#fde8f0',
  '#fff8d6', '#e8fbf7', '#f3e8ff', '#ffe9dd',
];

const BoyamaKosesi: React.FC<Props> = ({ onClose }) => {
  const [kat, setKat] = useState<Kategori | null>(null);
  const [ix, setIx] = useState(0);
  const [sayfa, setSayfa] = useState<SayfaVeri | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [renkler, setRenkler] = useState<Record<string, string>>({});
  const [secili, setSecili] = useState<string | null>(null);
  const [paletAcik, setPaletAcik] = useState(false);
  const [kutla, setKutla] = useState(false);
  const kutlandi = useRef(false);

  const katSayfalar = kat ? kategoriSayfalari(kat) : [];

  useEffect(() => {
    if (!kat) {
      setSayfa(null);
      setYukleniyor(false);
      return;
    }
    const liste = kategoriSayfalari(kat);
    const seciliOzet = liste[ix];
    if (!seciliOzet) {
      setSayfa(null);
      setYukleniyor(false);
      return;
    }
    let iptal = false;
    setYukleniyor(true);
    void sayfaYukleId(seciliOzet.id).then((s) => {
      if (iptal) return;
      setSayfa(s);
      setYukleniyor(false);
    });
    const sonraki = liste[(ix + 1) % liste.length];
    if (sonraki && sonraki.id !== seciliOzet.id) void kategoriYukle(sonraki.kategori);
    return () => { iptal = true; };
  }, [kat, ix]);

  const boyanacaklar = sayfa ? sayfa.bolgeler.filter((b) => !bolgeKucukMu(b)) : [];
  const bolgeIdler = boyanacaklar.map((b) => b.id);
  const boyanan = bolgeIdler.filter((id) => renkler[id] && renkler[id] !== BOS).length;
  const renk = (id: string) => renkler[id] ?? BOS;

  useEffect(() => {
    if (!sayfa) return;
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
    if (!sayfa) return;
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

  const gitSayfa = (delta: number) => {
    const n = katSayfalar.length;
    if (n <= 1) return;
    setIx((i) => (i + delta + n) % n);
    temizle();
  };

  const kategorilereDon = () => {
    setKat(null);
    setIx(0);
    setSayfa(null);
    temizle();
  };

  const kategoriAc = (kategori: Kategori) => {
    setKat(kategori);
    setIx(0);
    temizle();
  };

  if (kat === null) {
    const ozetler = kategoriOzetleri();
    return (
      <div className="by-wrap">
        <button type="button" className="by-geri" onClick={onClose}>← Ana Sayfa</button>
        <header className="by-baslik-blok">
          <h1 className="by-baslik">🎨 Boyama Köşesi</h1>
          <p className="by-alt">Bir konu seç, boyamaya başla! · {SAYFA_SIRA.length} sayfa</p>
        </header>
        <div className="by-kat-grid">
          {ozetler.map((o, i) => (
            <button
              key={o.kategori}
              type="button"
              className="by-kat-kart"
              style={{ background: KAT_KAGIT[i % KAT_KAGIT.length] }}
              onClick={() => kategoriAc(o.kategori)}
            >
              <span className="by-kat-emoji" aria-hidden="true">{KATEGORI_EMOJI[o.kategori]}</span>
              <span className="by-kat-ad">{KATEGORI_AD[o.kategori]}</span>
              <span className="by-kat-adet">{o.adet} sayfa</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const n = katSayfalar.length;

  return (
    <div className="by-wrap">
      <Konfeti goster={kutla} />
      <button type="button" className="by-geri" onClick={kategorilereDon}>← Konular</button>
      <header className="by-baslik-blok">
        <h1 className="by-baslik">🎨 {KATEGORI_AD[kat]}</h1>
        <p className="by-alt">
          {sayfa && !yukleniyor
            ? `${sayfa.baslik} · ${ix + 1} / ${n} · ${boyanan} / ${bolgeIdler.length} boyandı`
            : 'Sayfa geliyor…'}
        </p>
      </header>

      <div className="by-kagit">
        {sayfa && !yukleniyor ? (
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
        ) : (
          <div className="by-yukle" role="status">Sayfa geliyor…</div>
        )}
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
        <button type="button" className="by-btn by-btn-once" onClick={() => gitSayfa(-1)} disabled={n <= 1}>
          Önceki
        </button>
        <button type="button" className="by-btn by-btn-sifir" onClick={temizle}>Sıfırla</button>
        <button type="button" className="by-btn by-btn-yeni" onClick={() => gitSayfa(1)} disabled={n <= 1}>
          Sonraki
        </button>
      </div>
    </div>
  );
};

export default BoyamaKosesi;
