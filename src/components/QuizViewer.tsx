import { useState, useEffect, useCallback, useRef, memo } from 'react';
import '../styles/QuizViewer.css';
import AnalogClock from './AnalogClock';

interface Question {
  id: string;
  subject: string;
  theme: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
  clock?: { hour: number; minute: number };
}

interface QuizResult {
  subject: string;
  theme: string;
  difficulty: string;
  score: number;
  total: number;
  date: string;
}

interface Profil {
  ad: string;
  sinif: string;
}

declare const __BUILD_ID__: string;
// Build aninda hesaplanip enjekte edilen, tum temalardaki toplam soru sayisi ( or. "4.790").
declare const __TOTAL_QUESTIONS__: string;

const PROFIL_KEY = 'dersdunyasi_profiller';
const AKTIF_KEY = 'dersdunyasi_aktif';
const statsKey = (ad: string) => `dersdunyasi_${ad}_stats`;
const hatalarKey = (ad: string) => `dersdunyasi_${ad}_hatalar`;

const SUBJECTS = [
  { label: 'Matematik',     folder: 'math',    emoji: '🔢', color: '#FF6B6B' },
  { label: 'Türkçe',        folder: 'turkce',  emoji: '📖', color: '#4ECDC4' },
  { label: 'Fen Bilimleri', folder: 'fen',     emoji: '🔬', color: '#45B7D1' },
  { label: 'Hayat Bilgisi', folder: 'hayat',   emoji: '🌍', color: '#96CEB4' },
  { label: 'İngilizce',     folder: 'english', emoji: '🌟', color: '#FFEAA7' },
];

// "Öğrenme Köşesi" — mevcut ders sistemine dahil DEĞİL (ana derslerde görünmez),
// ama AYNI soru şeması ve AYNI yükleme mekanizmasını (./data/{folder}/tema{N}.json) kullanır.
const OGRENME = {
  label: 'Öğrenme Köşesi',
  folder: 'ogrenme',
  emoji: '🧠',
  color: '#0EA5A5',
  temalar: [
    { tema: 'Tema 1', baslik: 'Soru Kelimeleri', emoji: '❓', renk: '#6366F1', alt: 'Ne? Kim? Nerede? Ne zaman? Neden? Nasıl?' },
    { tema: 'Tema 2', baslik: 'Saat Okuma',      emoji: '🕐', renk: '#0EA5A5', alt: 'Tam, buçuk ve çeyrek saatler' },
  ],
};
// Klasör/renk/emoji aramaları için birleşik liste (ana ders grid'i yalnız SUBJECTS kullanır).
const ALL_SUBJECTS = [...SUBJECTS, OGRENME];

const THEMES = Array.from({ length: 10 }, (_, i) => `Tema ${i + 1}`);
const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const EMOJI = ['🦁','🌟','🦋','🚀','🌈','🐬','🦄','🍀'];

// Yerinde (in-place) Fisher-Yates karıştırma.
function fisherYates<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Tema 2 (Saat Okuma): blok SIRASINI koruyarak yalnızca her bloğun İÇİNDE karıştır.
// Bloklar clock.minute ile ayrılır (tam=0 → buçuk=30 → çeyrek:15 → çeyrek:45).
// Kavram soruları (clock alanı olmayanlar) her zaman en sonda kalır.
const SAAT_BLOK_SIRASI = [0, 30, 15, 45];
function saatBloklariniKaristir(questions: Question[]): Question[] {
  const bloklar = new Map<number, Question[]>();
  const kavram: Question[] = [];
  for (const q of questions) {
    const m = q.clock?.minute;
    if (typeof m === 'number') {
      const b = bloklar.get(m) ?? [];
      b.push(q);
      bloklar.set(m, b);
    } else {
      kavram.push(q);
    }
  }
  const sonuc: Question[] = [];
  const eklenen = new Set<number>();
  for (const m of SAAT_BLOK_SIRASI) {
    const b = bloklar.get(m);
    if (b) { fisherYates(b); sonuc.push(...b); eklenen.add(m); }
  }
  // Beklenmeyen bir minute değeri varsa: sırayı bozmadan (artan) ve grup-içi karışık ekle.
  for (const m of [...bloklar.keys()].filter(x => !eklenen.has(x)).sort((a, b) => a - b)) {
    const b = bloklar.get(m)!;
    fisherYates(b);
    sonuc.push(...b);
  }
  fisherYates(kavram);
  sonuc.push(...kavram);
  return sonuc;
}

function playSound(correct: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = correct ? [523.25, 659.25, 783.99] : [220, 196];
    let t = ctx.currentTime;
    notes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = correct ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
      t += 0.16;
    });
  } catch (e) { /* silent fail */ }
}

function profilleriGetir(): Profil[] {
  try { return JSON.parse(localStorage.getItem(PROFIL_KEY) || '[]'); } catch { return []; }
}

function profilleriKaydet(liste: Profil[]) {
  localStorage.setItem(PROFIL_KEY, JSON.stringify(liste));
}

function aktifSinif(ad: string): string {
  const pr = profilleriGetir().find(x => x.ad === ad);
  return pr ? pr.sinif : '2';
}

function hatalariGetir(ad: string): Question[] {
  try { return JSON.parse(localStorage.getItem(hatalarKey(ad)) || '[]'); } catch { return []; }
}

function hataEkle(ad: string, soru: Question) {
  const hatalar = hatalariGetir(ad);
  const imza = soru.question + '|' + [...soru.options].sort().join('|');
  if (hatalar.find(h => h.question + '|' + [...h.options].sort().join('|') === imza)) return;
  hatalar.push(soru);
  if (hatalar.length > 200) hatalar.shift();
  localStorage.setItem(hatalarKey(ad), JSON.stringify(hatalar));
}

function hataCikar(ad: string, soru: Question) {
  const imza = soru.question + '|' + [...soru.options].sort().join('|');
  const hatalar = hatalariGetir(ad).filter(h => h.question + '|' + [...h.options].sort().join('|') !== imza);
  localStorage.setItem(hatalarKey(ad), JSON.stringify(hatalar));
}

interface Props {
  onHikayeAc?: () => void;
  onOyunlarAc?: () => void;
}

// Sayac kendi state'ini tutar; boylece saniyelik tik yalniz bu minik bileseni
// render eder, dev QuizViewer bileseni saniyede bir yeniden render OLMAZ.
// paused=true iken (cevap geri bildirimi / soru yokken) sayac durur; her yeni
// soruda key ile yeniden monte edilip 30'a sifirlanir.
const TIMER_SURE = 30;
const Timer = memo(function Timer({ paused, onTimeout }: { paused: boolean; onTimeout: () => void }) {
  const [saniye, setSaniye] = useState(TIMER_SURE);
  const geriCagir = useRef(onTimeout);
  useEffect(() => { geriCagir.current = onTimeout; });
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setSaniye((prev) => {
        if (prev <= 1) {
          geriCagir.current(); // sure bitince otomatik yanlis
          return TIMER_SURE;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);
  const renk = saniye > 10 ? '#4CAF50' : saniye > 5 ? '#FFC107' : '#FF6B6B';
  return <span style={{ color: renk }}>⏱️ {saniye}s</span>;
});

const QuizViewer: React.FC<Props> = ({ onHikayeAc, onOyunlarAc }) => {
  const [profilAdi, setProfilAdi] = useState<string>(() => localStorage.getItem(AKTIF_KEY) || '');
  const [profiller, setProfiller] = useState<Profil[]>(() => profilleriGetir());
  
  // Views: 'profile_selection' | 'home' | 'theme_selection' | 'ogrenme_home' | 'quiz' | 'stats' | 'leaderboard' | 'about'
  const [view, setView] = useState<'profile_selection' | 'home' | 'theme_selection' | 'ogrenme_home' | 'quiz' | 'stats' | 'leaderboard' | 'about'>(() => {
    const active = localStorage.getItem(AKTIF_KEY);
    return active ? 'home' : 'profile_selection';
  });

  const [yeniProfilModu, setYeniProfilModu] = useState(false);
  const [yeniAd, setYeniAd] = useState('');
  const [yeniSinif, setYeniSinif] = useState('');

  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].label);
  const [selectedTheme, setSelectedTheme] = useState('Tema 1');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hataModu, setHataModu] = useState(false);

  const activeSubject = ALL_SUBJECTS.find(s => s.label === selectedSubject) || SUBJECTS[0];

  // Auto version update check
  useEffect(() => {
    let checked = false;
    const checkVersion = async () => {
      if (checked) return;
      checked = true;
      try {
        const r = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
        if (!r.ok) return;
        const { v } = await r.json();
        if (v && v !== __BUILD_ID__) {
          window.location.reload();
        }
      } catch {}
    };
    checkVersion();
  }, []);

  const loadQuestions = useCallback(async (subjectName: string, themeName: string) => {
    setLoading(true);
    setError(null);
    setFeedback('idle');
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
    try {
      const activeSub = ALL_SUBJECTS.find(s => s.label === subjectName) || SUBJECTS[0];
      const folder   = activeSub.folder;
      const temaNum  = themeName.replace('Tema ', '');
      const response = await fetch(`./data/${folder}/tema${temaNum}.json`);
      if (!response.ok) throw new Error('Sorular yüklenemedi.');
      const data = await response.json();
      let yuklenen: Question[] = data.questions || [];
      // Yalnızca Öğrenme Köşesi → Tema 2 (Saat Okuma): blok sırasını koruyup grup-içi
      // karıştır. Her loadQuestions çağrısında yeniden çalışır → her oturumda farklı sıra.
      if (subjectName === OGRENME.label && themeName === 'Tema 2') {
        yuklenen = saatBloklariniKaristir(yuklenen);
      }
      setQuestions(yuklenen);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = (optionIndex: number) => {
    if (feedback !== 'idle' || questions.length === 0) return;
    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    
    setSelectedOption(optionIndex);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    playSound(isCorrect);
    
    if (isCorrect) {
      setScore(s => s + 1);
      if (hataModu) {
        hataCikar(profilAdi, currentQ);
      }
    } else {
      if (!hataModu) {
        hataEkle(profilAdi, currentQ);
      }
    }

    setTimeout(() => {
      setFeedback('idle');
      setSelectedOption(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        if (!hataModu) {
          saveResult();
        }
        setView('home');
        alert(`Tebrikler! Testi tamamladın. Skorun: ${score + (isCorrect ? 1 : 0)}/${questions.length}`);
      }
    }, isCorrect ? 900 : 1600);
  };

  const saveResult = () => {
    const result: QuizResult = {
      subject: selectedSubject,
      theme: selectedTheme,
      difficulty: 'Orta',
      score: score,
      total: questions.length,
      date: new Date().toLocaleString('tr-TR')
    };

    let stats = JSON.parse(localStorage.getItem(statsKey(profilAdi)) || '[]');
    stats.push(result);
    if (stats.length > 500) stats = stats.slice(-500);
    localStorage.setItem(statsKey(profilAdi), JSON.stringify(stats));
  };

  const soruyuSeslendir = () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    window.speechSynthesis.cancel();
    const metin = currentQuestion.question + '. ' + currentQuestion.options.join('. ');
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = selectedSubject === 'İngilizce' ? 'en-US' : 'tr-TR';
    u.rate = 0.9;
    const sesler = window.speechSynthesis.getVoices();
    if (selectedSubject === 'İngilizce') {
      const s = sesler.find(v => v.name.includes('Samantha')) || sesler.find(v => v.lang === 'en-US');
      if (s) u.voice = s;
    } else {
      const s = sesler.find(v => v.lang === 'tr-TR');
      if (s) u.voice = s;
    }
    window.speechSynthesis.speak(u);
  };

  const yedekIndir = () => {
    const veri: { [k: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('dersdunyasi_')) veri[k] = localStorage.getItem(k) || '';
    }
    const blob = new Blob([JSON.stringify({ surum: 1, tarih: new Date().toISOString(), veri }, null, 1)],
      { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ders-dunyasi-yedek-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const yedekYukle = (dosya: File) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => {
      try {
        const paket = JSON.parse(String(okuyucu.result));
        if (!paket || typeof paket.veri !== 'object') { alert('Bu dosya geçerli bir yedek değil.'); return; }
        const anahtarlar = Object.keys(paket.veri).filter(k => k.startsWith('dersdunyasi_'));
        if (anahtarlar.length === 0) { alert('Yedekte veri bulunamadı.'); return; }
        if (!confirm(`${anahtarlar.length} kayıt yüklenecek ve mevcut verilerin üzerine yazılacak. Devam?`)) return;
        anahtarlar.forEach(k => localStorage.setItem(k, paket.veri[k]));
        alert('Yedek yüklendi! ✓ Uygulama yenileniyor...');
        window.location.reload();
      } catch { alert('Dosya okunamadı.'); }
    };
    okuyucu.readAsText(dosya);
  };

  const calculateOverallStats = () => {
    const stats: QuizResult[] = JSON.parse(localStorage.getItem(statsKey(profilAdi)) || '[]');
    if (stats.length === 0) return { totalQuestions: 0, correctCount: 0, percentage: 0 };
    const totalQuestions = stats.reduce((sum, s) => sum + s.total, 0);
    const correctCount = stats.reduce((sum, s) => sum + s.score, 0);
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    return { totalQuestions, correctCount, percentage };
  };

  // ── VIEWS ─────────────────────────────────────────────────────────────

  // 1. Profile Selection / Creation View
  if (view === 'profile_selection') {
    const profilOlustur = () => {
      const ad = yeniAd.trim();
      if (!ad || !yeniSinif) return;
      if (profiller.find(pr => pr.ad.toLowerCase() === ad.toLowerCase())) return;
      const guncel = [...profiller, { ad, sinif: yeniSinif }];
      profilleriKaydet(guncel);
      setProfiller(guncel);
      localStorage.setItem(AKTIF_KEY, ad);
      setProfilAdi(ad);
      setYeniAd(''); setYeniSinif(''); setYeniProfilModu(false);
      setView('home');
    };
    const profilSec = (ad: string) => {
      localStorage.setItem(AKTIF_KEY, ad);
      setProfilAdi(ad);
      setView('home');
    };
    const profilSil = (ad: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirm(`"${ad}" profili tüm puanları ve hata kutusuyla birlikte silinecek. Emin misin?`)) return;
      const guncel = profiller.filter(pr => pr.ad !== ad);
      profilleriKaydet(guncel);
      setProfiller(guncel);
      localStorage.removeItem(statsKey(ad));
      localStorage.removeItem(hatalarKey(ad));
    };

    if (profiller.length > 0 && !yeniProfilModu) {
      return (
        <div className="qv-wrap">
          <div className="profil-container">
            <div className="profil-emoji">👋</div>
            <h1 className="profil-baslik">Kim oynuyor?</h1>
            <p className="profil-alt">Adına dokun ve başla!</p>
            <div className="profil-kart-grid">
              {profiller.map((pr, i) => (
                <div key={pr.ad} className="profil-kart" role="button" tabIndex={0}
                  onClick={() => profilSec(pr.ad)}
                  onKeyDown={(e) => { if (e.key === 'Enter') profilSec(pr.ad); }}>
                  <span className="profil-kart-sil" onClick={(e) => profilSil(pr.ad, e)} title="Profili sil">✕</span>
                  <span className="profil-kart-emoji">{EMOJI[i % EMOJI.length]}</span>
                  <span className="profil-kart-ad">{pr.ad}</span>
                  <span className="profil-kart-sinif">{pr.sinif}. Sınıf</span>
                </div>
              ))}
              <button className="profil-kart profil-kart-yeni" onClick={() => setYeniProfilModu(true)}>
                <span className="profil-kart-emoji">➕</span>
                <span className="profil-kart-ad">Yeni Profil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const siniflar = ['1', '2', '3', '4'];
    return (
      <div className="qv-wrap">
        <div className="profil-container">
          <div className="profil-emoji">🎮</div>
          <h1 className="profil-baslik">{profiller.length > 0 ? 'Yeni arkadaş! 🎉' : 'Hoş geldin!'}</h1>
          <p className="profil-alt">Kendine bir takma ad seç!</p>
          <input
            className="profil-input"
            placeholder="Takma adın (örn: Aslan, Yıldız)"
            value={yeniAd}
            onChange={(e) => setYeniAd(e.target.value)}
            maxLength={16}
          />
          <p className="profil-soru">Kaçıncı sınıftasın?</p>
          <div className="profil-sinif-grid">
            {siniflar.map((s) => (
              <button
                key={s}
                className={`profil-sinif-btn ${yeniSinif === s ? 'aktif' : ''}`}
                onClick={() => setYeniSinif(s)}
              >
                {s}. Sınıf
              </button>
            ))}
          </div>
          <button className="profil-btn" onClick={profilOlustur} disabled={!yeniAd.trim() || !yeniSinif}>
            Başla! 🎈
          </button>
          {profiller.length > 0 && (
            <button className="profil-geri-btn" onClick={() => setYeniProfilModu(false)}>← Geri dön</button>
          )}
        </div>
      </div>
    );
  }

  // 2. Home Dashboard View
  if (view === 'home') {
    const activeGrade = aktifSinif(profilAdi);
    const visibleSubjects = SUBJECTS.filter(s => !(activeGrade === '1' && s.label === 'İngilizce'));

    const hikayeBtn = onHikayeAc ? (
      <button className="qv-hikaye-btn" id="btn-hikaye-kosesi" onClick={onHikayeAc}>
        <span className="qv-hikaye-btn-emoji">📚</span>
        <span className="qv-hikaye-btn-text">
          <span className="qv-hikaye-btn-title">Hikaye Köşesi</span>
          <span className="qv-hikaye-btn-sub">Oku, dinle, anladın mı?</span>
        </span>
        <span className="qv-hikaye-btn-arrow">›</span>
      </button>
    ) : null;

    const oyunlarBtn = onOyunlarAc ? (
      <button className="qv-oyunlar-btn" id="btn-oyunlar" onClick={onOyunlarAc}>
        <span className="qv-hikaye-btn-emoji">🎮</span>
        <span className="qv-hikaye-btn-text">
          <span className="qv-hikaye-btn-title">Oyunlar</span>
          <span className="qv-hikaye-btn-sub">7 eğlenceli mini oyun</span>
        </span>
        <span className="qv-hikaye-btn-arrow">›</span>
      </button>
    ) : null;

    return (
      <>
        <div className="magic-scene" aria-hidden="true">
          <div className="ms-stars">
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className="ms-clouds">
            <div className="ms-cloud ms-cloud-1">
              <svg viewBox="0 0 160 70" width="160" height="70"><g fill="#ffffff"><ellipse cx="52" cy="44" rx="34" ry="22" /><ellipse cx="86" cy="38" rx="30" ry="26" /><ellipse cx="116" cy="46" rx="26" ry="18" /><rect x="40" y="44" width="86" height="20" rx="10" /></g></svg>
            </div>
            <div className="ms-cloud ms-cloud-2">
              <svg viewBox="0 0 160 70" width="160" height="70"><g fill="#ffffff"><ellipse cx="52" cy="44" rx="34" ry="22" /><ellipse cx="86" cy="38" rx="30" ry="26" /><ellipse cx="116" cy="46" rx="26" ry="18" /><rect x="40" y="44" width="86" height="20" rx="10" /></g></svg>
            </div>
            <div className="ms-cloud ms-cloud-3">
              <svg viewBox="0 0 160 70" width="160" height="70"><g fill="#ffffff"><ellipse cx="52" cy="44" rx="34" ry="22" /><ellipse cx="86" cy="38" rx="30" ry="26" /><ellipse cx="116" cy="46" rx="26" ry="18" /><rect x="40" y="44" width="86" height="20" rx="10" /></g></svg>
            </div>
            <div className="ms-cloud ms-cloud-4">
              <svg viewBox="0 0 160 70" width="160" height="70"><g fill="#ffffff"><ellipse cx="52" cy="44" rx="34" ry="22" /><ellipse cx="86" cy="38" rx="30" ry="26" /><ellipse cx="116" cy="46" rx="26" ry="18" /><rect x="40" y="44" width="86" height="20" rx="10" /></g></svg>
            </div>
            <div className="ms-cloud ms-cloud-5">
              <svg viewBox="0 0 160 70" width="160" height="70"><g fill="#ffffff"><ellipse cx="52" cy="44" rx="34" ry="22" /><ellipse cx="86" cy="38" rx="30" ry="26" /><ellipse cx="116" cy="46" rx="26" ry="18" /><rect x="40" y="44" width="86" height="20" rx="10" /></g></svg>
            </div>
            <div className="ms-cloud ms-cloud-6">
              <svg viewBox="0 0 160 70" width="160" height="70"><g fill="#ffffff"><ellipse cx="52" cy="44" rx="34" ry="22" /><ellipse cx="86" cy="38" rx="30" ry="26" /><ellipse cx="116" cy="46" rx="26" ry="18" /><rect x="40" y="44" width="86" height="20" rx="10" /></g></svg>
            </div>
          </div>
          <div className="ms-shooting" aria-hidden="true"><span /></div>
          <svg className="ms-hills" viewBox="0 0 1440 220" preserveAspectRatio="none" width="100%" height="220">
            <path fill="#BFE0C2" d="M0 120 C 180 70 320 150 520 120 C 720 90 860 160 1080 120 C 1240 92 1360 140 1440 118 L1440 220 L0 220 Z" />
            <path fill="#8FCB9B" d="M0 160 C 200 120 360 190 600 160 C 820 134 1000 196 1220 160 C 1330 142 1400 170 1440 158 L1440 220 L0 220 Z" />
            <g fill="#6FB77E">
              <path d="M120 175 l18 -46 l18 46 Z" /><path d="M150 180 l22 -56 l22 56 Z" />
              <path d="M1230 178 l20 -50 l20 50 Z" /><path d="M1265 182 l16 -40 l16 40 Z" />
              <path d="M660 182 l18 -44 l18 44 Z" /><path d="M690 186 l14 -34 l14 34 Z" />
            </g>
          </svg>
        </div>
      <div className="qv-wrap">
        <div className="home-container">
          <header className="qv-hero">
            <span className="hero-star hero-star-a" aria-hidden="true">✦</span>
            <span className="hero-star hero-star-b" aria-hidden="true">✦</span>
            <span className="hero-star hero-star-c" aria-hidden="true">✧</span>
            <h1 className="home-title">Ders Dünyası 🌈</h1>
            <p className="home-subtitle">Merhaba {profilAdi}! 👋 Dokun ve oyna!</p>
            <p className="home-soru-toplam" style={{ fontSize: '0.85rem', opacity: 0.8, margin: '2px 0 0' }}>{__TOTAL_QUESTIONS__} Soru</p>
            <button className="profil-degistir-btn" onClick={() => { localStorage.removeItem(AKTIF_KEY); setProfilAdi(""); setView('profile_selection'); }}>👤 Profil Değiştir</button>
          </header>

          {/* Öğrenme Köşesi — Hikaye Köşesi'nin görsel ailesinden, tam genişlik */}
          <button className="qv-ogrenme-btn" id="btn-ogrenme-kosesi" onClick={() => setView('ogrenme_home')}>
            <span className="qv-hikaye-btn-emoji">🧠</span>
            <span className="qv-hikaye-btn-text">
              <span className="qv-hikaye-btn-title">Öğrenme Köşesi</span>
              <span className="qv-hikaye-btn-sub">Soru kelimeleri &amp; saat okuma</span>
            </span>
            <span className="qv-hikaye-btn-arrow">›</span>
          </button>

          {/* Green buttons for Story Corner and Games */}
          {(hikayeBtn || oyunlarBtn) && (
            <div className="qv-extra-btns">
              {hikayeBtn}
              {oyunlarBtn}
            </div>
          )}

          <section className="qv-section">
            <h2 className="qv-section-title">📚 Bir Ders Seç</h2>
            <div className="home-grid">
              {visibleSubjects.map(s => (
                <button
                  key={s.label}
                  className="home-card"
                  style={{ background: s.color }}
                  onClick={() => {
                    setSelectedSubject(s.label);
                    setView('theme_selection');
                  }}
                >
                  <span className="home-card-emoji">{s.emoji}</span>
                  <span className="home-card-name">{s.label}</span>
                </button>
              ))}
            </div>
          </section>

          <footer className="home-menu-grid">
            <button className="home-menu-card hmc-hata" onClick={() => {
              const h = hatalariGetir(profilAdi);
              if (h.length === 0) {
                alert('Hata kutun şu an boş! Harikasın! 🌟');
                return;
              }
              setHataModu(true);
              setQuestions(h);
              setCurrentIndex(0);
              setScore(0);
              setFeedback('idle');
              setSelectedOption(null);
              setView('quiz');
            }}>
              <span className="home-menu-icon">📦</span>
              <span className="home-menu-label">Hata Kutusu</span>
              <span className="home-menu-badge">{hatalariGetir(profilAdi).length}</span>
            </button>
            <button className="home-menu-card hmc-sira" onClick={() => setView('leaderboard')}>
              <span className="home-menu-icon">🏆</span>
              <span className="home-menu-label">Sıralama</span>
            </button>
            <button className="home-menu-card hmc-ilerleme" onClick={() => setView('stats')}>
              <span className="home-menu-icon">📊</span>
              <span className="home-menu-label">İlerlemem</span>
            </button>
            <button className="home-menu-card hmc-hakkinda" onClick={() => setView('about')}>
              <span className="home-menu-icon">ℹ️</span>
              <span className="home-menu-label">Hakkında</span>
            </button>
          </footer>
        </div>
      </div>
      </>
    );
  }

  // 3. Theme Selection View
  if (view === 'theme_selection') {
    return (
      <div className="qv-wrap">
        <button className="back-btn" onClick={() => setView('home')}>← Ana Sayfa</button>
        <h1 className="home-title" style={{ color: activeSubject.color }}>{activeSubject.emoji} {selectedSubject}</h1>
        <h2 className="qv-section-title" style={{ marginTop: '20px', textAlign: 'center' }}>🗂️ Bir Tema Seç ve Başla!</h2>
        
        <div className="qv-theme-grid" style={{ marginTop: '20px' }}>
          {THEMES.map(t => (
            <button
              key={t}
              className={`qv-theme-pill`}
              style={{ '--card-color': activeSubject.color, padding: '14px 20px', fontSize: '1.05rem', borderRadius: '14px' } as React.CSSProperties}
              onClick={() => {
                setSelectedTheme(t);
                setHataModu(false);
                loadQuestions(selectedSubject, t);
                setView('quiz');
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3b. Öğrenme Köşesi — Tema Seçimi
  if (view === 'ogrenme_home') {
    return (
      <div className="qv-wrap">
        <button className="back-btn" onClick={() => setView('home')}>← Ana Sayfa</button>
        <h1 className="home-title" style={{ color: OGRENME.color }}>🧠 Öğrenme Köşesi</h1>
        <p className="home-subtitle">Bir konu seç, birlikte öğrenelim! ✨</p>

        <div className="ogrenme-tema-grid">
          {OGRENME.temalar.map(t => (
            <button
              key={t.tema}
              className="ogrenme-tema-kart"
              style={{ '--card-color': t.renk } as React.CSSProperties}
              onClick={() => {
                setSelectedSubject(OGRENME.label);
                setSelectedTheme(t.tema);
                setHataModu(false);
                loadQuestions(OGRENME.label, t.tema);
                setView('quiz');
              }}
            >
              <span className="ogrenme-tema-emoji">{t.emoji}</span>
              <span className="ogrenme-tema-baslik">{t.baslik}</span>
              <span className="ogrenme-tema-alt">{t.alt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 4. Leaderboard View
  if (view === 'leaderboard') {
    const stats: QuizResult[] = JSON.parse(localStorage.getItem(statsKey(profilAdi)) || '[]');
    const ranked = [...stats]
      .map((s) => ({ ...s, pct: s.total > 0 ? (s.score / s.total) * 100 : 0 }))
      .sort((a, b) => b.pct - a.pct || b.score - a.score)
      .slice(0, 10);
    const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`);

    return (
      <div className="qv-wrap">
        <button className="back-btn" onClick={() => setView('home')}>← Ana Sayfa</button>
        <h1 className="home-title">🏆 Sıralama - En İyi 10</h1>
        
        <div className="stats-history" style={{ marginTop: '24px' }}>
          {ranked.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Henüz test çözülmemiş.</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Ders</th>
                  <th>Tema</th>
                  <th>Puan</th>
                  <th>Başarı</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((s, idx) => (
                  <tr key={idx}>
                    <td>{medal(idx)}</td>
                    <td>{s.subject}</td>
                    <td>{s.theme}</td>
                    <td>{s.score}/{s.total}</td>
                    <td>{Math.round(s.pct)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // 5. Stats Overview View
  if (view === 'stats') {
    const stats: QuizResult[] = JSON.parse(localStorage.getItem(statsKey(profilAdi)) || '[]');
    const overallStats = calculateOverallStats();

    return (
      <div className="qv-wrap">
        <button className="back-btn" onClick={() => setView('home')}>← Ana Sayfa</button>
        <h1 className="home-title">📊 {profilAdi}'ın İlerlemesi</h1>

        <div className="stats-summary" style={{ marginTop: '24px' }}>
          <h2>Genel Başarı Durumu</h2>
          <div className="stat-item">
            <p>Toplam Soru: <strong>{overallStats.totalQuestions}</strong></p>
          </div>
          <div className="stat-item">
            <p>Doğru Cevaplar: <strong>{overallStats.correctCount}</strong></p>
          </div>
          <div className="stat-item">
            <p>Başarı Oranı: <strong>{overallStats.percentage}%</strong></p>
          </div>
        </div>

        <div className="stats-history">
          <h2>Geçmiş Sonuçlar</h2>
          {stats.length === 0 ? (
            <p>Henüz test çözülmemiş.</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Ders</th>
                  <th>Tema</th>
                  <th>Puan</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {[...stats].reverse().slice(0, 20).map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.subject}</td>
                    <td>{stat.theme}</td>
                    <td>{stat.score}/{stat.total}</td>
                    <td>{stat.date.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // 6. About App View
  if (view === 'about') {
    return (
      <div className="qv-wrap">
        <button className="back-btn" onClick={() => setView('home')}>← Ana Sayfa</button>
        <div className="hakkinda-container">
          <div className="hakkinda-emoji">🎈</div>
          <h1 className="hakkinda-baslik">Ders Dünyası Hakkında</h1>

          <p className="hakkinda-giris">
            Ders Dünyası, ilkokul çağındaki çocukların öğrenmesine küçük bir katkı sunmak için
            hazırlanmış, tamamen ücretsiz bir eğitim uygulamasıdır. Hiçbir kâr amacı gütmez;
            tek amacı çocukların eğlenerek ve kendi hızlarında öğrenmesidir.
          </p>

          <div className="hakkinda-bolum">
            <h3>📚 Müfredata Uygun</h3>
            <p>Tüm sorular ve hikâyeler, MEB müfredatı göz önünde bulundurularak hazırlanmıştır.
            Matematik, Türkçe, Fen Bilimleri, Hayat Bilgisi ve İngilizce başta olmak üzere geniş bir konu yelpazesini kapsar.</p>
          </div>

          <div className="hakkinda-bolum">
            <h3>🛡️ Güvenli İçerik</h3>
            <p>İçerikler çocuklar için özenle hazırlanmıştır. Uygulamada argo, küfür, şiddet ya da
            çocuklar için uygunsuz hiçbir ifade yer almaz. Her şey çocukların yaş seviyesine uygun bir dille yazılmıştır.</p>
          </div>

          <div className="hakkinda-bolum">
            <h3>🔒 Gizliliğiniz Güvende</h3>
            <p>Çocuğunuzun takma adı, sınıfı ve oyun ilerlemesi yalnızca kullandığınız cihazda saklanır.
            Bu bilgiler bize veya başka hiç kimseye gönderilmez, hiçbir sunucuda toplanmaz.
            Cihazınızın tarayıcı verilerini temizlerseniz bu bilgiler de silinir — yani her şey tamamen sizin kontrolünüzdedir.</p>
          </div>

          <div className="hakkinda-bolum">
            <h3>💾 Yedekleme</h3>
            <p>Tüm profiller, puanlar ve hata kutuları tek dosyada. Cihaz değişse bile ilerleme kaybolmaz.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="home-action-btn" onClick={yedekIndir}>💾 Yedek İndir</button>
              <label className="home-action-btn" style={{ cursor: 'pointer', margin: 0 }}>
                📂 Yedek Yükle
                <input type="file" accept=".json,application/json" style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) yedekYukle(f);
                    e.target.value = '';
                  }} />
              </label>
            </div>
          </div>

          <div className="hakkinda-bolum hakkinda-son" style={{ marginTop: '30px' }}>
            <h3>❤️ Sevgiyle yapıldı</h3>
            <p>Bu uygulama, bir babanın kendi çocukları için başlattığı bir projeden doğdu.
            Umuyoruz ki sizin çocuğunuzun da öğrenme yolculuğuna küçük bir ışık tutar.</p>
          </div>
        </div>
      </div>
    );
  }

  // 7. Quiz Screen View
  if (loading) {
    return (
      <div className="qv-wrap">
        <div className="qv-loading">
          <div className="qv-spinner" />
          <p>Sorular yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="qv-wrap">
        <button className="back-btn" onClick={() => setView('home')}>← Geri Dön</button>
        <div className="qv-error">⚠️ {error}</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  return (
    <div className="qv-wrap">
      {feedback === 'wrong' && (
        <div className="yanlis-balon">💪 Olsun, tekrar dene!</div>
      )}
      {feedback === 'correct' && (
        <div className="kutlama-katman">
          <div className="kutlama-balon">
            <div className="kutlama-emoji">🎉</div>
            <div className="kutlama-yazi">Aferin!</div>
          </div>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={`konfeti konfeti-${i % 7}`} style={{ left: `${(i * 7) % 100}%` }} />
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => { setHataModu(false); setView('home'); }}>← Ana Sayfa</button>

      <div className="qv-quiz-card" style={{ '--card-color': activeSubject.color } as React.CSSProperties}>
        <div className="qv-quiz-topbar">
          <span className="qv-quiz-label">
            {activeSubject.emoji} {hataModu ? '📦 Hata Kutusu' : `${selectedSubject} · ${selectedTheme}`}
          </span>
          <span className="qv-quiz-score" style={{ display: 'flex', gap: '15px' }}>
            <Timer key={currentIndex} paused={questions.length === 0 || feedback !== 'idle'} onTimeout={() => handleAnswer(-1)} />
            <span>⭐ {score}/{currentIndex}</span>
          </span>
        </div>

        <div className="qv-progress-track">
          <div className="qv-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="qv-progress-text">
          Soru {currentIndex + 1} / {questions.length}
        </p>

        {currentQuestion && (
          <>
            <div className="qv-question-box">
              {currentQuestion.image && (
                <img src={currentQuestion.image} alt="Soru görseli" className="qv-question-img" />
              )}
              {currentQuestion.clock && (
                <div className="qv-clock-wrap">
                  <AnalogClock hour={currentQuestion.clock.hour} minute={currentQuestion.clock.minute} size={200} />
                </div>
              )}
              <div className="soru-satir">
                <p className="qv-question-text">{currentQuestion.question}</p>
                <button className="soru-dinle-btn" onClick={soruyuSeslendir} title="Dinle">🔊</button>
              </div>
            </div>

            <div className="qv-options">
              {currentQuestion.options.map((opt, i) => {
                let cls = 'qv-option';
                if (selectedOption !== null) {
                  if (i === currentQuestion.correctAnswer) cls += ' qv-option--correct';
                  else if (i === selectedOption) cls += ' qv-option--wrong';
                  else cls += ' qv-option--dim';
                }
                return (
                  <button
                    key={i}
                    id={`option-${i}`}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={feedback !== 'idle'}
                  >
                    <span className="qv-option-label">{OPTION_LABELS[i]}</span>
                    <span className="qv-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizViewer;
