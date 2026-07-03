import { useState } from 'react';
import '../styles/Oyunlar.css';

interface Props { onClose: () => void; }

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

const TUR_SAYISI = 5;

// ==================== SAAT OYUNU ====================
const SaatOyunu: React.FC<{ onBitti: (puan: number) => void }> = ({ onBitti }) => {
  const hedefUret = () => ({ saat: 1 + Math.floor(Math.random() * 12), dakika: Math.random() < 0.5 ? 0 : 30 });
  const [hedef, setHedef] = useState(hedefUret);
  const [saat, setSaat] = useState(12);
  const [dakika, setDakika] = useState(0);
  const [tur, setTur] = useState(1);
  const [puan, setPuan] = useState(0);
  const [mesaj, setMesaj] = useState<'' | 'dogru' | 'yanlis'>('');
  const [kilit, setKilit] = useState(false);

  const akrepAci = ((saat % 12) * 30) + (dakika * 0.5) - 90;
  const yelkovanAci = (dakika * 6) - 90;

  const kontrol = () => {
    if (kilit) return;
    setKilit(true);
    const dogru = saat % 12 === hedef.saat % 12 && dakika === hedef.dakika;
    ses(dogru);
    setMesaj(dogru ? 'dogru' : 'yanlis');
    setTimeout(() => {
      const yeniPuan = dogru ? puan + 1 : puan;
      if (dogru) setPuan(yeniPuan);
      setMesaj('');
      if (dogru || tur >= 1) {
        if (dogru && tur >= TUR_SAYISI) { onBitti(yeniPuan); return; }
        if (dogru) { setTur(tur + 1); setHedef(hedefUret()); setSaat(12); setDakika(0); }
      }
      setKilit(false);
    }, 1100);
  };

  const el = (aci: number, uzunluk: number, kalinlik: number, renk: string) => {
    const r = (aci * Math.PI) / 180;
    return <line x1="100" y1="100" x2={100 + uzunluk * Math.cos(r)} y2={100 + uzunluk * Math.sin(r)}
      stroke={renk} strokeWidth={kalinlik} strokeLinecap="round" />;
  };

  return (
    <div className="oyun-alan">
      <div className="oyun-hedef">🎯 Saati <b>{hedef.saat}:{hedef.dakika === 0 ? '00' : '30'}</b>'a getir! (Tur {tur}/{TUR_SAYISI})</div>
      <svg viewBox="0 0 200 200" className="saat-svg">
        <circle cx="100" cy="100" r="92" fill="#fffbe9" stroke="#7F77DD" strokeWidth="6" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i + 1) * 30 - 90) * Math.PI / 180;
          return <text key={i} x={100 + 74 * Math.cos(a)} y={100 + 74 * Math.sin(a) + 6}
            textAnchor="middle" fontSize="16" fontWeight="700" fill="#444">{i + 1}</text>;
        })}
        {el(akrepAci, 45, 7, '#D4537E')}
        {el(yelkovanAci, 66, 4, '#378ADD')}
        <circle cx="100" cy="100" r="6" fill="#333" />
      </svg>
      <div className="oyun-butonlar">
        <button className="oyun-btn akrep" onClick={() => !kilit && setSaat(s => (s % 12) + 1)}>🔴 Akrep +1 saat</button>
        <button className="oyun-btn yelkovan" onClick={() => !kilit && setDakika(d => (d + 30) % 60)}>🔵 Yelkovan +30 dk</button>
      </div>
      <button className="oyun-kontrol" onClick={kontrol} disabled={kilit}>Kontrol Et ✓</button>
      {mesaj === 'dogru' && <div className="oyun-mesaj dogru">🎉 Harika! Doğru saat!</div>}
      {mesaj === 'yanlis' && <div className="oyun-mesaj yanlis">💪 Olmadı, tekrar dene!</div>}
    </div>
  );
};

// ==================== PIZZA OYUNU ====================
const PizzaOyunu: React.FC<{ onBitti: (puan: number) => void }> = ({ onBitti }) => {
  const ISIM = ['Ayşe', 'Berk', 'Selin', 'Can', 'Zeynep'];
  const hedefUret = () => {
    const tip = Math.random() < 0.5 ? 'yarim' : 'ceyrek';
    return { tip, dilim: tip === 'yarim' ? 4 : 2, isim: ISIM[Math.floor(Math.random() * ISIM.length)] };
  };
  const [hedef, setHedef] = useState(hedefUret);
  const [secili, setSecili] = useState<boolean[]>(Array(8).fill(false));
  const [tur, setTur] = useState(1);
  const [puan, setPuan] = useState(0);
  const [mesaj, setMesaj] = useState<'' | 'dogru' | 'yanlis'>('');
  const [kilit, setKilit] = useState(false);

  const dilimYol = (i: number) => {
    const a1 = (i * 45 - 90) * Math.PI / 180;
    const a2 = ((i + 1) * 45 - 90) * Math.PI / 180;
    return `M100,100 L${100 + 88 * Math.cos(a1)},${100 + 88 * Math.sin(a1)} A88,88 0 0,1 ${100 + 88 * Math.cos(a2)},${100 + 88 * Math.sin(a2)} Z`;
  };

  const kontrol = () => {
    if (kilit) return;
    setKilit(true);
    const seciliSayi = secili.filter(Boolean).length;
    const dogru = seciliSayi === hedef.dilim;
    ses(dogru);
    setMesaj(dogru ? 'dogru' : 'yanlis');
    setTimeout(() => {
      const yeniPuan = dogru ? puan + 1 : puan;
      if (dogru) setPuan(yeniPuan);
      setMesaj('');
      if (dogru) {
        if (tur >= TUR_SAYISI) { onBitti(yeniPuan); return; }
        setTur(tur + 1); setHedef(hedefUret()); setSecili(Array(8).fill(false));
      }
      setKilit(false);
    }, 1100);
  };

  return (
    <div className="oyun-alan">
      <div className="oyun-hedef">🎯 Pizzanın <b>{hedef.tip === 'yarim' ? 'YARISINI' : 'ÇEYREĞİNİ'}</b> {hedef.isim}'e ver!
        <span className="oyun-ipucu"> (8 dilimden {hedef.dilim} tane seç — Tur {tur}/{TUR_SAYISI})</span></div>
      <svg viewBox="0 0 200 200" className="pizza-svg">
        <circle cx="100" cy="100" r="92" fill="#e8b84b" stroke="#c8922a" strokeWidth="5" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={dilimYol(i)}
            fill={secili[i] ? '#D4537E' : '#f5d76e'}
            stroke="#c8922a" strokeWidth="2" style={{ cursor: 'pointer' }}
            onClick={() => { if (!kilit) setSecili(s => s.map((v, j) => j === i ? !v : v)); }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 + 22.5 - 90) * Math.PI / 180;
          return <circle key={'p' + i} cx={100 + 55 * Math.cos(a)} cy={100 + 55 * Math.sin(a)} r="5"
            fill={secili[i] ? '#fff' : '#c0392b'} pointerEvents="none" />;
        })}
      </svg>
      <div className="oyun-ipucu">Seçilen: {secili.filter(Boolean).length} dilim</div>
      <button className="oyun-kontrol" onClick={kontrol} disabled={kilit}>Kontrol Et ✓</button>
      {mesaj === 'dogru' && <div className="oyun-mesaj dogru">🎉 Afiyet olsun {hedef.isim}!</div>}
      {mesaj === 'yanlis' && <div className="oyun-mesaj yanlis">💪 Say bakalım, tekrar dene!</div>}
    </div>
  );
};

// ==================== BALON OYUNU ====================
const BalonOyunu: React.FC<{ onBitti: (puan: number) => void }> = ({ onBitti }) => {
  const RENK = ['#D4537E', '#378ADD', '#1D9E75', '#EF9F27'];
  const soruUret = () => {
    const a = 1 + Math.floor(Math.random() * 10);
    const b = 1 + Math.floor(Math.random() * (20 - a));
    const dogru = a + b;
    const secenekler = new Set<number>([dogru]);
    while (secenekler.size < 4) {
      const s = dogru + Math.floor(Math.random() * 9) - 4;
      if (s > 0 && s !== dogru) secenekler.add(s);
    }
    return { a, b, dogru, secenekler: [...secenekler].sort(() => Math.random() - 0.5) };
  };
  const [soru, setSoru] = useState(soruUret);
  const [tur, setTur] = useState(1);
  const [puan, setPuan] = useState(0);
  const [patlayan, setPatlayan] = useState<number | null>(null);
  const [kilit, setKilit] = useState(false);

  const patlat = (deger: number, idx: number) => {
    if (kilit) return;
    setKilit(true);
    setPatlayan(idx);
    const dogru = deger === soru.dogru;
    ses(dogru);
    setTimeout(() => {
      const yeniPuan = dogru ? puan + 1 : puan;
      if (dogru) setPuan(yeniPuan);
      setPatlayan(null);
      if (tur >= TUR_SAYISI) { onBitti(yeniPuan); return; }
      setTur(tur + 1); setSoru(soruUret());
      setKilit(false);
    }, 900);
  };

  return (
    <div className="oyun-alan">
      <div className="oyun-hedef">🎯 <b>{soru.a} + {soru.b} = ?</b> Doğru balonu patlat! (Tur {tur}/{TUR_SAYISI})</div>
      <div className="balon-alan">
        {soru.secenekler.map((s, i) => (
          <button key={`${tur}-${i}`} className={`balon ${patlayan === i ? 'patladi' : ''}`}
            style={{ background: RENK[i % 4], animationDelay: `${i * 0.3}s` }}
            onClick={() => patlat(s, i)} disabled={kilit}>
            {patlayan === i ? '💥' : s}
          </button>
        ))}
      </div>
      <div className="oyun-ipucu">Puan: {puan}</div>
    </div>
  );
};


// ==================== HAFIZA OYUNU ====================
const HafizaOyunu: React.FC<{ onBitti: (puan: number) => void }> = ({ onBitti }) => {
  const EMOJI = ['🐱','🐶','🦁','🐸','🦋','🍎','🌈','⭐','🚗','🎈','🐠','🌸'];
  const desteUret = () => {
    const secilen = [...EMOJI].sort(() => Math.random() - 0.5).slice(0, 6);
    return [...secilen, ...secilen].sort(() => Math.random() - 0.5);
  };
  const [deste] = useState(desteUret);
  const [acik, setAcik] = useState<number[]>([]);
  const [bulunan, setBulunan] = useState<Set<number>>(new Set());
  const [deneme, setDeneme] = useState(0);
  const [kilit, setKilit] = useState(false);

  const cevir = (i: number) => {
    if (kilit || acik.includes(i) || bulunan.has(i)) return;
    const yeniAcik = [...acik, i];
    setAcik(yeniAcik);
    if (yeniAcik.length === 2) {
      setKilit(true);
      setDeneme(deneme + 1);
      const [a, b] = yeniAcik;
      const eslesti = deste[a] === deste[b];
      ses(eslesti);
      setTimeout(() => {
        if (eslesti) {
          const yeniBulunan = new Set(bulunan); yeniBulunan.add(a); yeniBulunan.add(b);
          setBulunan(yeniBulunan);
          if (yeniBulunan.size === 12) {
            const puan = deneme + 1 <= 8 ? 5 : deneme + 1 <= 11 ? 4 : deneme + 1 <= 14 ? 3 : 2;
            setTimeout(() => onBitti(puan), 600);
          }
        }
        setAcik([]); setKilit(false);
      }, eslesti ? 500 : 900);
    }
  };

  return (
    <div className="oyun-alan">
      <div className="oyun-hedef">🎯 Aynı kartları eşleştir! <span className="oyun-ipucu">(Deneme: {deneme})</span></div>
      <div className="hafiza-grid">
        {deste.map((e, i) => {
          const gorunur = acik.includes(i) || bulunan.has(i);
          return (
            <button key={i} className={`hafiza-kart ${gorunur ? 'acik' : ''} ${bulunan.has(i) ? 'bulundu' : ''}`}
              onClick={() => cevir(i)}>
              {gorunur ? e : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==================== SAYI SIRALAMA ====================
const SiralamaOyunu: React.FC<{ onBitti: (puan: number) => void }> = ({ onBitti }) => {
  const sayiUret = () => {
    const s = new Set<number>();
    while (s.size < 5) s.add(1 + Math.floor(Math.random() * 99));
    return [...s].sort(() => Math.random() - 0.5);
  };
  const [sayilar, setSayilar] = useState(sayiUret);
  const [tiklanan, setTiklanan] = useState<number[]>([]);
  const [tur, setTur] = useState(1);
  const [puan, setPuan] = useState(0);
  const [hataVar, setHataVar] = useState(false);
  const [sallanan, setSallanan] = useState<number | null>(null);

  const tikla = (deger: number, idx: number) => {
    if (tiklanan.includes(idx)) return;
    const kalanlar = sayilar.filter((_, i) => !tiklanan.includes(i));
    const enKucuk = Math.min(...kalanlar);
    if (deger === enKucuk) {
      ses(true);
      const yeni = [...tiklanan, idx];
      setTiklanan(yeni);
      if (yeni.length === 5) {
        const yeniPuan = hataVar ? puan : puan + 1;
        if (!hataVar) setPuan(yeniPuan);
        setTimeout(() => {
          if (tur >= TUR_SAYISI) { onBitti(yeniPuan); return; }
          setTur(tur + 1); setSayilar(sayiUret()); setTiklanan([]); setHataVar(false);
        }, 800);
      }
    } else {
      ses(false); setHataVar(true); setSallanan(idx);
      setTimeout(() => setSallanan(null), 500);
    }
  };

  return (
    <div className="oyun-alan">
      <div className="oyun-hedef">🎯 Sayılara <b>KÜÇÜKTEN BÜYÜĞE</b> sırayla dokun! (Tur {tur}/{TUR_SAYISI})</div>
      <div className="siralama-alan">
        {sayilar.map((s, i) => (
          <button key={`${tur}-${i}`}
            className={`siralama-sayi ${tiklanan.includes(i) ? 'secildi' : ''} ${sallanan === i ? 'salla-hata' : ''}`}
            onClick={() => tikla(s, i)}>
            {s}
            {tiklanan.includes(i) && <span className="sira-no">{tiklanan.indexOf(i) + 1}</span>}
          </button>
        ))}
      </div>
      <div className="oyun-ipucu">Puan: {puan} {hataVar && '(bu turda hata yapıldı)'}</div>
    </div>
  );
};

// ==================== KELIME KURMA ====================
const KelimeOyunu: React.FC<{ onBitti: (puan: number) => void }> = ({ onBitti }) => {
  const KELIMELER = [
    { k: 'KEDİ', ipucu: '🐱' }, { k: 'ELMA', ipucu: '🍎' }, { k: 'OKUL', ipucu: '🏫' },
    { k: 'KUŞ', ipucu: '🐦' }, { k: 'BALIK', ipucu: '🐠' }, { k: 'ÇİÇEK', ipucu: '🌸' },
    { k: 'ARABA', ipucu: '🚗' }, { k: 'GÜNEŞ', ipucu: '☀️' }, { k: 'KİTAP', ipucu: '📖' },
    { k: 'KALEM', ipucu: '✏️' }, { k: 'BALON', ipucu: '🎈' }, { k: 'YILDIZ', ipucu: '⭐' },
  ];
  const secUret = (kullanilmis: string[]) => {
    const kalan = KELIMELER.filter(x => !kullanilmis.includes(x.k));
    const secim = kalan[Math.floor(Math.random() * kalan.length)];
    let harfler = secim.k.split('').sort(() => Math.random() - 0.5);
    if (harfler.join('') === secim.k) harfler = [...harfler].reverse();
    return { ...secim, harfler };
  };
  const [kullanilmis, setKullanilmis] = useState<string[]>([]);
  const [aktif, setAktif] = useState(() => secUret([]));
  const [dizilen, setDizilen] = useState<number[]>([]);
  const [tur, setTur] = useState(1);
  const [puan, setPuan] = useState(0);
  const [mesaj, setMesaj] = useState<'' | 'dogru' | 'yanlis'>('');
  const [kilit, setKilit] = useState(false);

  const harfSec = (i: number) => {
    if (kilit || dizilen.includes(i)) return;
    const yeni = [...dizilen, i];
    setDizilen(yeni);
    if (yeni.length === aktif.harfler.length) {
      setKilit(true);
      const kurulan = yeni.map(x => aktif.harfler[x]).join('');
      const dogru = kurulan === aktif.k;
      ses(dogru);
      setMesaj(dogru ? 'dogru' : 'yanlis');
      setTimeout(() => {
        setMesaj('');
        if (dogru) {
          const yeniPuan = puan + 1; setPuan(yeniPuan);
          if (tur >= TUR_SAYISI) { onBitti(yeniPuan); return; }
          const yeniKullanilmis = [...kullanilmis, aktif.k];
          setKullanilmis(yeniKullanilmis);
          setTur(tur + 1); setAktif(secUret(yeniKullanilmis)); setDizilen([]);
        } else {
          setDizilen([]);
        }
        setKilit(false);
      }, 1100);
    }
  };

  return (
    <div className="oyun-alan">
      <div className="oyun-hedef">🎯 Harfleri sırayla dokunarak kelimeyi kur! (Tur {tur}/{TUR_SAYISI})</div>
      <div className="kelime-ipucu">{aktif.ipucu}</div>
      <div className="kelime-kutular">
        {aktif.harfler.map((_, i) => (
          <div key={i} className="kelime-kutu">{dizilen[i] !== undefined ? aktif.harfler[dizilen[i]] : ''}</div>
        ))}
      </div>
      <div className="kelime-harfler">
        {aktif.harfler.map((h, i) => (
          <button key={`${tur}-${i}`} className={`kelime-harf ${dizilen.includes(i) ? 'kullanildi' : ''}`}
            onClick={() => harfSec(i)}>{h}</button>
        ))}
      </div>
      <button className="oyun-geri" onClick={() => !kilit && setDizilen([])}>🔄 Baştan Diz</button>
      {mesaj === 'dogru' && <div className="oyun-mesaj dogru">🎉 Süpersin! {aktif.k}!</div>}
      {mesaj === 'yanlis' && <div className="oyun-mesaj yanlis">💪 Olmadı, tekrar dizelim!</div>}
    </div>
  );
};

// ==================== ANA MENU ====================
const Oyunlar: React.FC<Props> = ({ onClose }) => {
  const [aktifOyun, setAktifOyun] = useState<'' | 'saat' | 'pizza' | 'balon' | 'hafiza' | 'siralama' | 'kelime'>('');
  const [sonuc, setSonuc] = useState<number | null>(null);

  const oyunBitti = (puan: number) => setSonuc(puan);
  const menuyeDon = () => { setAktifOyun(''); setSonuc(null); };

  if (sonuc !== null) {
    return (
      <div className="oyunlar-container">
        <div className="oyun-sonuc">
          <div className="oyun-sonuc-emoji">{sonuc >= 4 ? '🏆' : sonuc >= 2 ? '🌟' : '💪'}</div>
          <h2>{sonuc} / {TUR_SAYISI} doğru!</h2>
          <p>{sonuc >= 4 ? 'Muhteşemsin!' : sonuc >= 2 ? 'Çok iyi gidiyorsun!' : 'Denedikçe daha iyi olacak!'}</p>
          <button className="oyun-kontrol" onClick={() => { const o = aktifOyun; menuyeDon(); setTimeout(() => setAktifOyun(o), 0); }}>🔄 Tekrar Oyna</button>
          <button className="oyun-geri" onClick={menuyeDon}>← Oyun Menüsü</button>
        </div>
      </div>
    );
  }

  if (aktifOyun === 'saat') return <div className="oyunlar-container"><button className="oyun-geri" onClick={menuyeDon}>← Oyunlar</button><SaatOyunu onBitti={oyunBitti} /></div>;
  if (aktifOyun === 'pizza') return <div className="oyunlar-container"><button className="oyun-geri" onClick={menuyeDon}>← Oyunlar</button><PizzaOyunu onBitti={oyunBitti} /></div>;
  if (aktifOyun === 'balon') return <div className="oyunlar-container"><button className="oyun-geri" onClick={menuyeDon}>← Oyunlar</button><BalonOyunu onBitti={oyunBitti} /></div>;
  if (aktifOyun === 'hafiza') return <div className="oyunlar-container"><button className="oyun-geri" onClick={menuyeDon}>← Oyunlar</button><HafizaOyunu onBitti={oyunBitti} /></div>;
  if (aktifOyun === 'siralama') return <div className="oyunlar-container"><button className="oyun-geri" onClick={menuyeDon}>← Oyunlar</button><SiralamaOyunu onBitti={oyunBitti} /></div>;
  if (aktifOyun === 'kelime') return <div className="oyunlar-container"><button className="oyun-geri" onClick={menuyeDon}>← Oyunlar</button><KelimeOyunu onBitti={oyunBitti} /></div>;

  return (
    <div className="oyunlar-container">
      <button className="oyun-geri" onClick={onClose}>← Ana Sayfa</button>
      <h1 className="oyunlar-baslik">🎮 Oyunlar</h1>
      <div className="oyunlar-grid">
        <button className="oyun-kart" style={{ background: '#378ADD' }} onClick={() => setAktifOyun('saat')}>
          <span className="oyun-kart-emoji">🕐</span><span>Saat Oyunu</span>
          <span className="oyun-kart-alt">Saati doğru zamana getir</span>
        </button>
        <button className="oyun-kart" style={{ background: '#EF9F27' }} onClick={() => setAktifOyun('pizza')}>
          <span className="oyun-kart-emoji">🍕</span><span>Pizza Oyunu</span>
          <span className="oyun-kart-alt">Yarım ve çeyreği öğren</span>
        </button>
        <button className="oyun-kart" style={{ background: '#D4537E' }} onClick={() => setAktifOyun('balon')}>
          <span className="oyun-kart-emoji">🎈</span><span>Balon Patlatma</span>
          <span className="oyun-kart-alt">Doğru cevabı patlat!</span>
        </button>
        <button className="oyun-kart" style={{ background: '#7F77DD' }} onClick={() => setAktifOyun('hafiza')}>
          <span className="oyun-kart-emoji">🧠</span><span>Hafıza Oyunu</span>
          <span className="oyun-kart-alt">Aynı kartları eşleştir</span>
        </button>
        <button className="oyun-kart" style={{ background: '#1D9E75' }} onClick={() => setAktifOyun('siralama')}>
          <span className="oyun-kart-emoji">🔢</span><span>Sayı Sıralama</span>
          <span className="oyun-kart-alt">Küçükten büyüğe dokun</span>
        </button>
        <button className="oyun-kart" style={{ background: '#D85A30' }} onClick={() => setAktifOyun('kelime')}>
          <span className="oyun-kart-emoji">✏️</span><span>Kelime Kurma</span>
          <span className="oyun-kart-alt">Harflerden kelime yap</span>
        </button>
      </div>
    </div>
  );
};

export default Oyunlar;
