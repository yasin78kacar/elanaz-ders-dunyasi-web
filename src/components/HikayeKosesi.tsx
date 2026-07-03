import { useState, useEffect } from 'react';
import { hikayeleriYukle } from '../data';
import '../styles/HikayeKosesi.css';

interface Soru { question: string; options: string[]; correctAnswer: number; }
interface Hikaye { id: string; baslik: string; seviye: number; sayfalar: string[]; sorular?: Soru[]; }

interface Props { onClose: () => void; }

const HikayeKosesi: React.FC<Props> = ({ onClose }) => {
  const [dil, setDil] = useState<'tr' | 'en'>('tr');
  const [hikayeler, setHikayeler] = useState<Hikaye[]>([]);
  const [ingilizceHikayeler, setIngilizceHikayeler] = useState<Hikaye[]>([]);
  const [hikayeYukleniyor, setHikayeYukleniyor] = useState(true);

  useEffect(() => {
    hikayeleriYukle().then(({ hikayeler: h, ingilizceHikayeler: ih }) => {
      setHikayeler(h as Hikaye[]);
      setIngilizceHikayeler(ih as Hikaye[]);
      setHikayeYukleniyor(false);
    }).catch(() => {
      setHikayeYukleniyor(false); // bos liste + tekrar giriste yeniden dener
    });
  }, []);
  const [seciliHikaye, setSeciliHikaye] = useState<number | null>(null);
  const [sayfa, setSayfa] = useState(0);
  const [okunuyor, setOkunuyor] = useState(false);
  const [aktifKelime, setAktifKelime] = useState(-1);
  const [uzunMu, setUzunMu] = useState(false);
  // Her hikayeye sabit ama farkli bir kahraman ismi (id'ye gore donusumlu)
  const ISIMLER = ['Ayşe','Mehmet','Zeynep','Can','Elif','Yusuf','Selin','Ali','Defne','Kaan','Ece','Emir','Naz','Arda','Sude','Mert','Ada','Efe','Nil','Berk'];
  const hikayeIsmi = (id: string) => {
    let t = 0;
    for (let i = 0; i < id.length; i++) t += id.charCodeAt(i);
    return ISIMLER[t % ISIMLER.length];
  };
  const isimDegistir = (metin: string, id: string) => {
    const isim = hikayeIsmi(id);
    return metin
      .replace(/Elanaz'?/g, (m) => m.endsWith("'") ? isim + "'" : isim)
      .replace(/KAHRAMAN'?/g, (m) => m.endsWith("'") ? isim + "'" : isim);
  };
  const [testModu, setTestModu] = useState(false);
  const [soruIndex, setSoruIndex] = useState(0);
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [secilen, setSecilen] = useState<number | null>(null);
  const [testBitti, setTestBitti] = useState(false);

  const tumListe = (dil === 'tr' ? hikayeler : ingilizceHikayeler) as Hikaye[];
  const liste = tumListe.filter(h => uzunMu ? (h as any).uzun === true : !(h as any).uzun);
  const sesDili = dil === 'tr' ? 'tr-TR' : 'en-US';

  useEffect(() => { setAktifKelime(-1); }, [sayfa, seciliHikaye]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  if (hikayeYukleniyor) {
    return <div className="hikaye-container"><p style={{textAlign:'center',marginTop:'40px'}}>📚 Hikayeler yükleniyor...</p></div>;
  }

  const enIyiSesiSec = (lang: string) => {
    const sesler = window.speechSynthesis.getVoices();
    if (lang.startsWith('en')) {
      const tercih = ['Samantha','Ava','Allison','Alex','Daniel','Google US English'];
      for (const isim of tercih) { const v = sesler.find(s => s.name.includes(isim)); if (v) return v; }
      return sesler.find(s => s.lang === 'en-US') || sesler.find(s => s.lang.startsWith('en'));
    }
    // Turkce icin Yelda'yi oncelikle sec (varsa gelistirilmis)
    const trTercih = sesler.filter(s => s.lang === 'tr-TR' || s.lang.startsWith('tr'));
    const yeldaEnh = trTercih.find(s => s.name.includes('Yelda') && /enhanced|premium|geli/i.test(s.name));
    return yeldaEnh || trTercih.find(s => s.name.includes('Yelda')) || trTercih[0];
  };

  const sesliOku = (metin: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = sesDili;
    const ses = enIyiSesiSec(sesDili); if (ses) u.voice = ses;
    u.rate = 0.85;
    u.pitch = 1.05;
    u.onend = () => setOkunuyor(false);
    // Karaoke: okunan kelimeyi takip et
    const duz = metin;
    const kelimeler = duz.split(/\s+/).filter(Boolean);
    const baslangiclar: number[] = [];
    let poz = 0;
    kelimeler.forEach(k => { const idx = duz.indexOf(k, poz); baslangiclar.push(idx); poz = idx + k.length; });
    u.addEventListener('boundary', (e: any) => {
      if (e.name && e.name !== 'word') return;
      const ci = e.charIndex ?? 0;
      let idx = 0;
      for (let i = 0; i < baslangiclar.length; i++) { if (baslangiclar[i] <= ci) idx = i; else break; }
      setAktifKelime(idx);
    });
    u.addEventListener('end', () => setAktifKelime(-1));
    setAktifKelime(-1);
    setOkunuyor(true); window.speechSynthesis.speak(u);
  };
  const sesiDurdur = () => { window.speechSynthesis.cancel(); setOkunuyor(false); setAktifKelime(-1); };

  const dilDegistir = (yeniDil: 'tr' | 'en') => {
    sesiDurdur(); setDil(yeniDil); setSeciliHikaye(null); setSayfa(0); resetTest();
  };
  const resetTest = () => {
    setTestModu(false); setSoruIndex(0); setDogruSayisi(0); setSecilen(null); setTestBitti(false);
  };
  const hikayeyeDon = () => { sesiDurdur(); setSeciliHikaye(null); setSayfa(0); resetTest(); };

  // LISTE
  if (seciliHikaye === null) {
    return (
      <div className="hikaye-container">
        <button className="back-btn" onClick={onClose}>← Ana Sayfa</button>
        <h1 className="hikaye-baslik">📚 Hikaye Köşesi</h1>
        <p className="hikaye-alt">Bir hikaye seç, oku ya da dinle!</p>
        <div className="hikaye-dil-sekme">
          <button className={`dil-btn ${dil === 'tr' ? 'aktif' : ''}`} onClick={() => dilDegistir('tr')}>🇹🇷 Türkçe</button>
          <button className={`dil-btn ${dil === 'en' ? 'aktif' : ''}`} onClick={() => dilDegistir('en')}>🇬🇧 İngilizce</button>
        </div>
        <div className="hikaye-dil-sekme hikaye-uzunluk-sekme">
          <button className={`dil-btn ${!uzunMu ? 'aktif' : ''}`} onClick={() => { setUzunMu(false); setSeciliHikaye(null); }}>📖 Kısa</button>
          <button className={`dil-btn ${uzunMu ? 'aktif' : ''}`} onClick={() => { setUzunMu(true); setSeciliHikaye(null); }}>📚 Uzun</button>
        </div>
        <div className="hikaye-liste">
          {liste.map((h, i) => (
            <button key={h.id} className="hikaye-kart" onClick={() => { setSeciliHikaye(i); setSayfa(0); resetTest(); }}>
              <span className="hikaye-emoji hikaye-emoji-buyuk">{['📕','📗','📘','📙','📔','📚'][i % 6]}</span>
              <span className="hikaye-kart-baslik">{isimDegistir(h.baslik, h.id)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const h = liste[seciliHikaye];
  const sorularVar = h.sorular && h.sorular.length > 0;

  // TEST MODU
  if (testModu) {
    if (testBitti) {
      return (
        <div className="hikaye-container">
          <button className="back-btn" onClick={hikayeyeDon}>← Hikayeler</button>
          <h2 className="hikaye-okuma-baslik">{isimDegistir(h.baslik, h.id)}</h2>
          <div className="test-sonuc">
            <div className="test-sonuc-emoji">{dogruSayisi >= 3 ? '🎉' : '💪'}</div>
            <h2>{dogruSayisi} / {h.sorular!.length} doğru!</h2>
            <p>{dogruSayisi >= 3 ? 'Harika okudun!' : 'Tekrar okuyup dene!'}</p>
            <button className="hikaye-ses-btn" onClick={() => { setTestModu(false); setSayfa(0); resetTest(); }}>📖 Tekrar Oku</button>
          </div>
        </div>
      );
    }
    const soru = h.sorular![soruIndex];
    return (
      <div className="hikaye-container">
        <button className="back-btn" onClick={hikayeyeDon}>← Hikayeler</button>
        <h2 className="hikaye-okuma-baslik">📝 Anladın mı?</h2>
        <div className="test-ilerleme">Soru {soruIndex + 1} / {h.sorular!.length}</div>
        <div className="hikaye-sayfa">
          <p className="hikaye-metin">{soru.question}</p>
        </div>
        <div className="test-secenekler">
          {soru.options.map((o, i) => {
            let cls = 'test-secenek';
            if (secilen !== null) {
              if (i === soru.correctAnswer) cls += ' dogru';
              else if (i === secilen) cls += ' yanlis';
            }
            return (
              <button key={i} className={cls} disabled={secilen !== null}
                onClick={() => {
                  setSecilen(i);
                  if (i === soru.correctAnswer) setDogruSayisi(d => d + 1);
                  setTimeout(() => {
                    if (soruIndex < h.sorular!.length - 1) { setSoruIndex(soruIndex + 1); setSecilen(null); }
                    else setTestBitti(true);
                  }, 1100);
                }}>
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // OKUMA
  const sonSayfa = sayfa >= h.sayfalar.length - 1;
  const ilkSayfa = sayfa <= 0;
  return (
    <div className="hikaye-container">
      <button className="back-btn" onClick={hikayeyeDon}>← Hikayeler</button>
      <h2 className="hikaye-okuma-baslik">{isimDegistir(h.baslik, h.id)}</h2>
      <div className="hikaye-sayfa">
        <p className="hikaye-metin">
          {(() => {
            let ki = -1;
            return isimDegistir(h.sayfalar[sayfa], h.id).split(/(\s+)/).map((parca, i) => {
              if (parca === '' || /^\s+$/.test(parca)) return parca;
              ki += 1; const benim = ki;
              const cls = benim === aktifKelime ? 'kelime-aktif'
                : (aktifKelime > -1 && benim < aktifKelime ? 'kelime-okundu' : '');
              return <span key={i} className={cls}>{parca}</span>;
            });
          })()}
        </p>
      </div>
      {dil === 'en' && (
        <div className="hikaye-ses-row">
          {okunuyor ? (
            <button className="hikaye-ses-btn durdur" onClick={sesiDurdur}>⏹️ Stop</button>
          ) : (
            <button className="hikaye-ses-btn" onClick={() => sesliOku(isimDegistir(h.sayfalar[sayfa], h.id))}>🔊 Listen</button>
          )}
        </div>
      )}
      <div className="hikaye-nav">
        <button className="hikaye-nav-btn" disabled={ilkSayfa} onClick={() => { sesiDurdur(); setSayfa(sayfa - 1); }}>← Önceki</button>
        <span className="hikaye-sayfa-no">{sayfa + 1} / {h.sayfalar.length}</span>
        {sonSayfa && sorularVar ? (
          <button className="hikaye-nav-btn test-btn" onClick={() => { sesiDurdur(); setTestModu(true); }}>📝 Anladın mı?</button>
        ) : (
          <button className="hikaye-nav-btn" disabled={sonSayfa} onClick={() => { sesiDurdur(); setSayfa(sayfa + 1); }}>Sonraki →</button>
        )}
      </div>
    </div>
  );
};

export default HikayeKosesi;
