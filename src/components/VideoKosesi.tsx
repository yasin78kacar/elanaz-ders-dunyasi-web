import { useMemo, useState } from 'react';
import { VIDEOLAR, type DersVideosu } from '../data/videolar';

interface Props {
  sinif?: number;
  onGeri?: () => void;
}

const DERS_SIRA = [
  'Matematik',
  'Türkçe',
  'İngilizce',
  'Fen Bilimleri',
  'Hayat Bilgisi',
  'Sosyal Bilgiler',
  'Trafik Güvenliği',
  'İnsan Hakları',
];

function sureYaz(sn: number): string {
  const d = Math.floor(sn / 60);
  const s = sn % 60;
  return `${d}:${s.toString().padStart(2, '0')}`;
}

export default function VideoKosesi({ sinif, onGeri }: Props) {
  const sinifListe = useMemo(
    () => VIDEOLAR.filter((v) => sinif === undefined || v.sinif === sinif),
    [sinif],
  );
  const dersler = useMemo(() => {
    const varOlan = new Set(sinifListe.map((v) => v.ders));
    const sirali = DERS_SIRA.filter((d) => varOlan.has(d));
    for (const d of varOlan) {
      if (!sirali.includes(d)) sirali.push(d);
    }
    return sirali;
  }, [sinifListe]);
  const [secili, setSecili] = useState<string | null>(null);
  const aktifDers = secili && dersler.includes(secili) ? secili : (dersler[0] ?? '');
  const liste = useMemo(
    () => sinifListe.filter((v) => v.ders === aktifDers),
    [sinifListe, aktifDers],
  );
  const gruplar = useMemo(() => {
    const m = new Map<string, DersVideosu[]>();
    for (const v of liste) {
      const k = v.konu || 'Diğer';
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(v);
    }
    return [...m.entries()];
  }, [liste]);
  const [aktif, setAktif] = useState<number | null>(null);
  const video = aktif !== null ? liste[aktif] : null;

  function dersSec(d: string) {
    setSecili(d);
    setAktif(null);
  }

  if (video) {
    return (
      <div className="vk-wrap">
        <button type="button" className="vk-btn" onClick={() => setAktif(null)}>← Videolar</button>
        <h2 className="vk-baslik">{video.baslik}</h2>
        <video
          key={video.id}
          className="vk-oynatici"
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
        />
        <div className="vk-nav">
          <button type="button" className="vk-btn" disabled={aktif === 0} onClick={() => setAktif((a) => (a ?? 0) - 1)}>← Önceki</button>
          <button type="button" className="vk-btn" disabled={aktif === liste.length - 1} onClick={() => setAktif((a) => (a ?? 0) + 1)}>Sonraki →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vk-wrap vk-wrap--liste">
      {onGeri && <button type="button" className="vk-btn" onClick={onGeri}>← Geri</button>}
      <h2 className="vk-baslik">Video Köşesi</h2>
      {dersler.length > 0 && (
        <div className="vk-sekmeler" role="tablist" aria-label="Dersler">
          {dersler.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={d === aktifDers}
              className={`vk-sekme${d === aktifDers ? ' aktif' : ''}`}
              onClick={() => dersSec(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}
      {liste.length === 0 && <p className="vk-bos">Bu sınıf için henüz video yok.</p>}
      {gruplar.map(([konu, vids]) => (
        <section key={konu} className="vk-grup">
          <h3 className="vk-konu">{konu}</h3>
          <div className="vk-grid">
            {vids.map((v) => (
              <button
                type="button"
                key={v.id}
                className="vk-kart"
                onClick={() => setAktif(liste.indexOf(v))}
              >
                <img className="vk-poster" src={v.poster} alt="" loading="lazy" />
                <div className="vk-kart-metin">
                  <div className="vk-kart-baslik">{v.baslik}</div>
                  <div className="vk-sure">{sureYaz(v.sure)}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
