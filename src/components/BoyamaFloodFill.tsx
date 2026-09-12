import { useCallback, useEffect, useRef, useState } from 'react';
import { BOS, PALET } from '../boyama/tipler';
import { duvarMaskesi, maskeSisir, taramaDoldur, type DoldurSonuc } from '../boyama/floodFill';
import { floodFillDogrula, type DogrulaMadde } from '../boyama/floodFillDogrula';
import '../styles/BoyamaKosesi.css';
import '../styles/BoyamaFloodFill.css';

type Sahne = { id: string; baslik: string; src: string };

const SAHNELER: Sahne[] = [
  { id: 'fil-vahsi', baslik: 'Fil (vahşi)', src: '/boyama-yeni/fil-vahsi.png' },
  { id: 'kopek-park', baslik: 'Köpek (park)', src: '/boyama-yeni/kopek-park.png' },
  { id: 'ciftlik-avlu', baslik: 'Çiftlik avlusu', src: '/boyama-yeni/ciftlik-avlu.png' },
  { id: 'dino-orman', baslik: 'Dino (orman)', src: '/boyama-yeni/dino-orman.png' },
];

function hexRgba(hex: string): readonly [number, number, number, number] {
  const n = hex.replace('#', '');
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16), 255];
}

function icCozunurluk(): number {
  return Math.min(window.devicePixelRatio || 1, 2);
}

type Props = { onClose: () => void };

const BoyamaFloodFill: React.FC<Props> = ({ onClose }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boyaRef = useRef<HTMLCanvasElement>(null);
  const hamRef = useRef<ImageData | null>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const [ix, setIx] = useState(0);
  const [renk, setRenk] = useState(PALET[0]);
  const [son, setSon] = useState<DoldurSonuc | null>(null);
  const [dogrula, setDogrula] = useState<DogrulaMadde[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yuklu, setYuklu] = useState(false);
  const sahne = SAHNELER[ix];

  const yukle = useCallback(async (src: string) => {
    setHata(null);
    setSon(null);
    setYuklu(false);
    const wrap = wrapRef.current;
    const boya = boyaRef.current;
    if (!wrap || !boya) return;

    const img = new Image();
    img.decoding = 'sync';
    await new Promise<void>((ok, no) => {
      img.onload = () => ok();
      img.onerror = () => no(new Error(`PNG yüklenemedi: ${src}`));
      img.src = src;
    });

    let cssW = wrap.clientWidth;
    for (let i = 0; i < 20 && cssW < 8; i++) {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      cssW = wrap.clientWidth;
    }
    if (cssW < 8) {
      setHata('Tuval ölçülemedi');
      return;
    }
    const cssH = Math.round(cssW * (img.naturalHeight / img.naturalWidth));
    const dpr = icCozunurluk();
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));

    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) {
      setHata('Canvas 2D yok');
      return;
    }
    octx.drawImage(img, 0, 0, w, h);
    const cizgi = octx.getImageData(0, 0, w, h);
    maskRef.current = maskeSisir(duvarMaskesi(cizgi.data, w, h), w, h);

    boya.width = w;
    boya.height = h;
    boya.style.width = `${cssW}px`;
    boya.style.height = `${cssH}px`;
    const pctx = boya.getContext('2d', { willReadFrequently: true });
    if (!pctx) {
      setHata('Canvas 2D yok');
      return;
    }
    pctx.fillStyle = BOS;
    pctx.fillRect(0, 0, w, h);
    hamRef.current = pctx.getImageData(0, 0, w, h);
    setYuklu(true);
  }, []);

  useEffect(() => {
    setDogrula(floodFillDogrula());
  }, []);

  useEffect(() => {
    void yukle(sahne.src).catch((e: unknown) => {
      setHata(e instanceof Error ? e.message : 'yükleme hatası');
    });
  }, [sahne.src, yukle]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    let sonW = wrap.clientWidth;
    const goz = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      if (Math.abs(w - sonW) < 2) return;
      sonW = w;
      void yukle(sahne.src);
    });
    goz.observe(wrap);
    return () => goz.disconnect();
  }, [sahne.src, yukle]);

  const boyaNokta = (istemciX: number, istemciY: number) => {
    const boya = boyaRef.current;
    const ham = hamRef.current;
    const mask = maskRef.current;
    if (!boya || !ham || !mask) return;
    const ctx = boya.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const kutu = boya.getBoundingClientRect();
    const x = (istemciX - kutu.left) * (boya.width / kutu.width);
    const y = (istemciY - kutu.top) * (boya.height / kutu.height);
    const sonuc = taramaDoldur(ham.data, mask, boya.width, boya.height, x, y, hexRgba(renk));
    if (sonuc.dolan > 0) ctx.putImageData(ham, 0, 0);
    setSon(sonuc);
  };

  const temizle = () => {
    void yukle(sahne.src);
  };

  return (
    <div className="by-wrap">
      <button className="by-geri" type="button" onClick={onClose}>← Ana Sayfa</button>
      <header className="by-baslik-blok">
        <h1 className="by-baslik">🎨 Kova prototipi</h1>
        <p className="by-alt">{sahne.baslik} · önce renk, sonra tuvale dokun</p>
      </header>

      {dogrula && (
        <ul className="by-ff-dogrula">
          {dogrula.map((m) => (
            <li key={m.ad}>
              <strong>{m.ok ? 'OK' : 'FAIL'}</strong>
              {' '}
              {m.ad}
              {': '}
              {m.not}
            </li>
          ))}
        </ul>
      )}

      <div className="by-kagit">
        <div ref={wrapRef} className="by-ff-sahne">
          <canvas
            ref={boyaRef}
            className="by-ff-boya"
            aria-label={sahne.baslik}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              boyaNokta(e.clientX, e.clientY);
            }}
          />
          {yuklu && (
            <img
              className="by-ff-cizgi"
              src={sahne.src}
              alt=""
              draggable={false}
            />
          )}
        </div>
      </div>
      {hata && <p className="by-alt" role="alert">{hata}</p>}
      {son && (
        <p className="by-ff-olcu">
          {son.dolan}
          {' '}
          px ·
          {son.ms.toFixed(1)}
          {' '}
          ms
          {son.kaydi ? ` · çizgiden (${son.tohumX},${son.tohumY}) kaydı` : ''}
        </p>
      )}

      <div className="by-palet" role="listbox" aria-label="Renk paleti">
        {PALET.map((hex) => (
          <button
            key={hex}
            type="button"
            className={`by-renk${renk === hex ? ' by-renk-secili' : ''}`}
            style={{ background: hex }}
            aria-label={`Renk ${hex}`}
            onClick={() => setRenk(hex)}
          />
        ))}
      </div>

      <div className="by-butonlar">
        <button type="button" className="by-btn by-btn-sifir" onClick={temizle}>Sıfırla</button>
        {SAHNELER.length > 1 && (
          <button
            type="button"
            className="by-btn by-btn-yeni"
            onClick={() => setIx((i) => (i + 1) % SAHNELER.length)}
          >
            Diğer sahne
          </button>
        )}
      </div>
    </div>
  );
};

export default BoyamaFloodFill;
