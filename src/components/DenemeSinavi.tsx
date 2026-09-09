import { useEffect, useState } from 'react';
import '../styles/DenemeSinavi.css';

const PROFIL_KEY = 'dersdunyasi_profiller';
const AKTIF_KEY = 'dersdunyasi_aktif';
const denemelerKey = (ad: string) => `dersdunyasi_${ad}_denemeler`;

const SIK_HARF = ['A', 'B', 'C', 'D'];
const DERS_SIRASI = ['Türkçe', 'Matematik', 'Fen Bilimleri', 'Hayat Bilgisi', 'İngilizce'];
const DERS_RENK: Record<string, string> = {
  Türkçe: '#14B8A6',
  Matematik: '#EF4444',
  'Fen Bilimleri': '#38BDF8',
  'Hayat Bilgisi': '#84CC16',
  İngilizce: '#F59E0B',
};

interface DenemeSoru {
  id: string;
  subject: string;
  theme: string;
  konu: string;
  grade: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Kirilim {
  subject: string;
  konu: string;
  dogru: number;
  yanlis: number;
  toplam: number;
}

interface DenemeSonuc {
  id: string;
  sinif: number;
  date: string;
  score: number;
  total: number;
  kirilim: Kirilim[];
  yanlisIdler: string[];
}

interface Profil {
  ad: string;
  sinif: string;
}

interface Props {
  onClose: () => void;
}

function aktifProfil(): { ad: string; sinif: number } {
  const ad = localStorage.getItem(AKTIF_KEY) || '';
  try {
    const liste: Profil[] = JSON.parse(localStorage.getItem(PROFIL_KEY) || '[]');
    const pr = liste.find((x) => x.ad === ad);
    return { ad, sinif: Number(pr?.sinif || 2) };
  } catch {
    return { ad, sinif: 2 };
  }
}

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function kirilimHesapla(sorular: DenemeSoru[], dogruMu: boolean[]): Kirilim[] {
  const map = new Map<string, Kirilim>();
  sorular.forEach((q, i) => {
    const anahtar = q.subject + '|' + q.konu;
    const once = map.get(anahtar) || {
      subject: q.subject,
      konu: q.konu,
      dogru: 0,
      yanlis: 0,
      toplam: 0,
    };
    once.toplam += 1;
    if (dogruMu[i]) once.dogru += 1;
    else once.yanlis += 1;
    map.set(anahtar, once);
  });
  return [...map.values()];
}

function kaydet(ad: string, sonuc: DenemeSonuc) {
  if (!ad) return;
  let liste: DenemeSonuc[] = [];
  try {
    liste = JSON.parse(localStorage.getItem(denemelerKey(ad)) || '[]');
  } catch {
    liste = [];
  }
  liste.push(sonuc);
  if (liste.length > 50) liste = liste.slice(-50);
  localStorage.setItem(denemelerKey(ad), JSON.stringify(liste));
}

function ses(dogru: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notalar = dogru ? [523.25, 659.25, 783.99] : [220, 196];
    let t = ctx.currentTime;
    notalar.forEach((f) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = dogru ? 'sine' : 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.2);
      t += 0.16;
    });
  } catch { /* sessiz */ }
}

const DenemeSinavi: React.FC<Props> = ({ onClose }) => {
  const { ad, sinif } = aktifProfil();
  const [sorular, setSorular] = useState<DenemeSoru[]>([]);
  const [yukleniyor, setYukleniyor] = useState(sinif === 2);
  const [hata, setHata] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [puan, setPuan] = useState(0);
  const [secili, setSecili] = useState<number | null>(null);
  const [geribildirim, setGeribildirim] = useState<'idle' | 'dogru' | 'yanlis'>('idle');
  const [cevaplar, setCevaplar] = useState<boolean[]>([]);
  const [sonuc, setSonuc] = useState<DenemeSonuc | null>(null);

  useEffect(() => {
    if (sinif !== 2) {
      setYukleniyor(false);
      return;
    }
    let iptal = false;
    (async () => {
      try {
        const mod = await import('../data/deneme/sinif2.json');
        const ham = (mod.default as { questions: DenemeSoru[] }).questions || [];
        if (!iptal) setSorular(karistir(ham));
      } catch {
        if (!iptal) setHata('Deneme soruları yüklenemedi.');
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    })();
    return () => { iptal = true; };
  }, [sinif]);

  const bitir = (tumCevap: boolean[]) => {
    const kirilim = kirilimHesapla(sorular, tumCevap);
    const yanlisIdler = sorular.filter((_, i) => !tumCevap[i]).map((q) => q.id);
    const skor = tumCevap.filter(Boolean).length;
    const kayit: DenemeSonuc = {
      id: `deneme_${Date.now()}`,
      sinif,
      date: new Date().toISOString(),
      score: skor,
      total: sorular.length,
      kirilim,
      yanlisIdler,
    };
    kaydet(ad, kayit);
    setSonuc(kayit);
  };

  const cevapla = (i: number) => {
    if (geribildirim !== 'idle' || sorular.length === 0) return;
    const q = sorular[index];
    const dogruMu = i === q.correctAnswer;
    setSecili(i);
    setGeribildirim(dogruMu ? 'dogru' : 'yanlis');
    ses(dogruMu);
    const sonrakiCevap = [...cevaplar, dogruMu];
    setCevaplar(sonrakiCevap);
    if (dogruMu) setPuan((p) => p + 1);
    window.setTimeout(() => {
      setGeribildirim('idle');
      setSecili(null);
      if (index < sorular.length - 1) {
        setIndex((n) => n + 1);
      } else {
        bitir(sonrakiCevap);
      }
    }, dogruMu ? 900 : 1600);
  };

  const yenidenBasla = () => {
    setSorular((once) => karistir(once));
    setIndex(0);
    setPuan(0);
    setSecili(null);
    setGeribildirim('idle');
    setCevaplar([]);
    setSonuc(null);
  };

  if (sinif !== 2) {
    return (
      <div className="deneme-wrap">
        <button className="deneme-geri" onClick={onClose}>← Ana Sayfa</button>
        <h1 className="deneme-baslik">📝 Deneme Sınavı</h1>
        <p className="deneme-uyari">
          Deneme şimdilik 2. sınıf için hazır.<br />
          Senin profilin {sinif}. sınıf.<br />
          1, 3 ve 4. sınıf denemeleri sonraki turda gelecek.
        </p>
      </div>
    );
  }

  if (yukleniyor) {
    return (
      <div className="deneme-wrap">
        <p className="deneme-uyari">Sorular yükleniyor…</p>
      </div>
    );
  }

  if (hata) {
    return (
      <div className="deneme-wrap">
        <button className="deneme-geri" onClick={onClose}>← Ana Sayfa</button>
        <p className="deneme-uyari">{hata}</p>
      </div>
    );
  }

  if (sonuc) {
    const dersOzet = DERS_SIRASI.map((ders) => {
      const parca = sonuc.kirilim.filter((k) => k.subject === ders);
      const dogru = parca.reduce((s, k) => s + k.dogru, 0);
      const toplam = parca.reduce((s, k) => s + k.toplam, 0);
      return { ders, dogru, toplam };
    }).filter((d) => d.toplam > 0);

    const zayif = [...sonuc.kirilim].sort((a, b) => {
      const pa = a.toplam ? a.dogru / a.toplam : 1;
      const pb = b.toplam ? b.dogru / b.toplam : 1;
      return pa - pb;
    })[0];

    return (
      <div className="deneme-wrap">
        <button className="deneme-geri" onClick={onClose}>← Ana Sayfa</button>
        <h1 className="deneme-baslik">📝 Deneme bitti!</h1>
        <p className="deneme-alt">2. sınıf karışık deneme</p>
        <div className="deneme-kart">
          <div className="deneme-sonuc-skor">{sonuc.score} / {sonuc.total}</div>
          {dersOzet.map((d) => {
            const yuzde = d.toplam ? Math.round((d.dogru / d.toplam) * 100) : 0;
            return (
              <div className="deneme-cubuk-satir" key={d.ders}>
                <div className="deneme-cubuk-etiket">
                  <span>{d.ders}</span>
                  <span>{d.dogru}/{d.toplam}</span>
                </div>
                <div className="deneme-cubuk-iz">
                  <div
                    className="deneme-cubuk-dolgu"
                    style={{ width: `${yuzde}%`, background: DERS_RENK[d.ders] || '#F59E0B' }}
                  />
                </div>
              </div>
            );
          })}
          {zayif && zayif.yanlis > 0 && (
            <div className="deneme-zayif">
              Biraz daha çalış: {zayif.subject} — {zayif.konu}
            </div>
          )}
          <button className="deneme-tekrar" onClick={yenidenBasla}>Tekrar dene</button>
        </div>
      </div>
    );
  }

  const q = sorular[index];
  if (!q) {
    return (
      <div className="deneme-wrap">
        <button className="deneme-geri" onClick={onClose}>← Ana Sayfa</button>
        <p className="deneme-uyari">Soru bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="deneme-wrap">
      <button className="deneme-geri" onClick={onClose}>← Ana Sayfa</button>
      <div className="deneme-kart">
        <div className="deneme-ust">
          <span>{q.subject} · {q.konu}</span>
          <span>⭐ {puan}</span>
        </div>
        <p className="deneme-ilerleme-yazi">Soru {index + 1} / {sorular.length}</p>
        <p className="deneme-soru">{q.question}</p>
        <div className="deneme-siklar">
          {q.options.map((opt, i) => {
            let cls = 'deneme-sik';
            if (secili !== null) {
              if (i === q.correctAnswer) cls += ' deneme-sik--dogru';
              else if (i === secili) cls += ' deneme-sik--yanlis';
              else cls += ' deneme-sik--soluk';
            }
            return (
              <button
                key={i}
                className={cls}
                disabled={geribildirim !== 'idle'}
                onClick={() => cevapla(i)}
              >
                <span className="deneme-sik-harf">{SIK_HARF[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DenemeSinavi;
