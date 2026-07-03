
import { useState, useEffect } from 'react';
import { dersYukle } from '../data';
import Oyunlar from './Oyunlar';
import HikayeKosesi from './HikayeKosesi';
import { gorselBul } from '../data/konuGorselleri';
import '../styles/QuizViewer.css';

interface Question {
  id: string;
  subject: string;
  theme: string;
  passage?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
  difficulty?: 'Kolay' | 'Orta' | 'Zor';
}

interface QuizResult {
  subject: string;
  theme: string;
  difficulty: string;
  score: number;
  total: number;
  date: string;
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
  } catch (e) { /* ses desteklenmiyorsa sessizce geç */ }
}


// ================= COKLU PROFIL SISTEMI =================
interface Profil { ad: string; sinif: string; }

const PROFIL_KEY = 'dersdunyasi_profiller';
const AKTIF_KEY = 'dersdunyasi_aktif';
const statsKey = (ad: string) => `dersdunyasi_${ad}_stats`;
const hatalarKey = (ad: string) => `dersdunyasi_${ad}_hatalar`;
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
  if (hatalar.length > 200) hatalar.shift(); // tasma korumasi
  localStorage.setItem(hatalarKey(ad), JSON.stringify(hatalar));
}
function hataCikar(ad: string, soru: Question) {
  const imza = soru.question + '|' + [...soru.options].sort().join('|');
  const hatalar = hatalariGetir(ad).filter(h => h.question + '|' + [...h.options].sort().join('|') !== imza);
  localStorage.setItem(hatalarKey(ad), JSON.stringify(hatalar));
}

function profilleriGetir(): Profil[] {
  try { return JSON.parse(localStorage.getItem(PROFIL_KEY) || '[]'); } catch { return []; }
}
function profilleriKaydet(liste: Profil[]) {
  localStorage.setItem(PROFIL_KEY, JSON.stringify(liste));
}
// Eski tek-profil verisini yeni sisteme tasir (puan kaybi olmaz, bir kez calisir)
declare const __BUILD_ID__: string;

// Yeni surum kontrolu: version.json'daki damga uygulamadakinden farkliysa
// sayfayi onbellegi atlayarak yeniler. Kizlar hicbir sey yapmadan guncel kalir.
let guncellemeKontrolEdildi = false;
async function guncellemeVarsaYenile(zorla = false) {
  try {
    if (guncellemeKontrolEdildi && !zorla) return;
    guncellemeKontrolEdildi = true;
    const r = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return;
    const { v } = await r.json();
    if (v && v !== __BUILD_ID__) {
      window.location.reload();
    } else if (zorla) {
      alert('Uygulama zaten güncel! ✓');
    }
  } catch { /* cevrimdisi ise sessizce gec */ }
}
guncellemeVarsaYenile();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') { guncellemeKontrolEdildi = false; guncellemeVarsaYenile(); }
});

function eskiVeriyiTasi() {
  const eskiAd = localStorage.getItem('aktifProfilAdi');
  if (!eskiAd) return;
  const profiller = profilleriGetir();
  if (!profiller.find(pr => pr.ad === eskiAd)) {
    profiller.push({ ad: eskiAd, sinif: localStorage.getItem('aktifProfilSinif') || '2' });
    profilleriKaydet(profiller);
  }
  const eskiStats = localStorage.getItem('quizStats');
  if (eskiStats && !localStorage.getItem(statsKey(eskiAd))) {
    localStorage.setItem(statsKey(eskiAd), eskiStats);
  }
  localStorage.setItem(AKTIF_KEY, eskiAd);
  localStorage.removeItem('aktifProfilAdi');
  localStorage.removeItem('aktifProfilSinif');
  localStorage.removeItem('quizStats');
}
eskiVeriyiTasi();

const QuizViewer: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'hikaye' | 'hakkinda' | 'oyunlar'>('home');
  const [profilAdi, setProfilAdi] = useState<string>(() => localStorage.getItem(AKTIF_KEY) || '');
  const [profiller, setProfiller] = useState<Profil[]>(() => profilleriGetir());
  const [yeniProfilModu, setYeniProfilModu] = useState(false);
  const [hataModu, setHataModu] = useState(false);
  const [yeniAd, setYeniAd] = useState('');
  const [yeniSinif, setYeniSinif] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('Türkçe');
  const [selectedTheme, setSelectedTheme] = useState('Tema 1');
  const difficulty = 'Orta';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [kutlama, setKutlama] = useState(false);
  const [yanlisGeri, setYanlisGeri] = useState(false);
  const [secilenSik, setSecilenSik] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);


  useEffect(() => {
    loadQuestions();
  }, [selectedSubject, selectedTheme, difficulty]);

  // Timer logic
  useEffect(() => {
    if (quizFinished || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Otomatik yanlış cevap
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizFinished, questions.length]);

  // Yeni soru gelince timer sıfırla
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestionIndex]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const subjectMap: { [key: string]: string } = {
        'Matematik': 'math',
        'Türkçe': 'turkce',
        'Fen Bilimleri': 'fen',
        'Hayat Bilgisi': 'hayat',
        'İngilizce': 'ingilizce',
        'Görsel Sanatlar': 'gorsel',
        'Zeka-Dikkat': 'zeka'
      };
      
      const folder = subjectMap[selectedSubject] || 'math';
      const pool = await dersYukle(folder);
      let dersSorulari = pool.filter((q: Question) => q.subject === selectedSubject);
      // 1. sinif profili sadece 1. sinif seviyesi sorulari gorur
      if (aktifSinif(profilAdi) === '1') {
        const birinciSinif = dersSorulari.filter((q: any) => q.grade === 1);
        if (birinciSinif.length >= 7) dersSorulari = birinciSinif; // guvenlik agi
      }
      const karistir = [...dersSorulari].sort(() => Math.random() - 0.5).slice(0, 7);
      setQuestions(karistir);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizFinished(false);
      setTimeLeft(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = () => {
    const result: QuizResult = {
      subject: selectedSubject,
      theme: selectedTheme,
      difficulty: difficulty,
      score: score,
      total: questions.length,
      date: new Date().toLocaleString('tr-TR')
    };

    const stats = JSON.parse(localStorage.getItem(statsKey(profilAdi)) || '[]');
    stats.push(result);
    localStorage.setItem(statsKey(profilAdi), JSON.stringify(stats));
  };

  const soruyuSeslendir = () => {
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

  const ilerle = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (!hataModu) saveResult();
      setQuizFinished(true);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    if (secilenSik !== null) return; // cevap verildiyse tekrar tiklamayi engelle
    const isCorrect = selectedIndex === questions[currentQuestionIndex].correctAnswer;
    if (!isCorrect && !hataModu) hataEkle(profilAdi, questions[currentQuestionIndex]);
    if (isCorrect && hataModu) hataCikar(profilAdi, questions[currentQuestionIndex]);
    playSound(isCorrect);
    setSecilenSik(selectedIndex);
    if (isCorrect) {
      setScore(score + 1);
      setKutlama(true);
      setTimeout(() => { setKutlama(false); setSecilenSik(null); ilerle(); }, 900);
    } else {
      setYanlisGeri(true);
      setTimeout(() => { setYanlisGeri(false); setSecilenSik(null); ilerle(); }, 1600);
    }
  };

  const handleRestart = () => {
    if (hataModu) {
      const h = hatalariGetir(profilAdi);
      setQuestions(h);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizFinished(false);
      setTimeLeft(30);
      return;
    }
    loadQuestions();
  };

  const getStats = () => {
    const stats: QuizResult[] = JSON.parse(localStorage.getItem(statsKey(profilAdi)) || '[]');
    return stats;
  };

  const calculateOverallStats = () => {
    const stats = getStats();
    if (stats.length === 0) return { totalQuestions: 0, correctCount: 0, percentage: 0 };

    const totalQuestions = stats.reduce((sum, s) => sum + s.total, 0);
    const correctCount = stats.reduce((sum, s) => sum + s.score, 0);
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return { totalQuestions, correctCount, percentage };
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return '#4CAF50';
    if (timeLeft > 5) return '#FFC107';
    return '#FF6B6B';
  };

  if (showLeaderboard) {
    const stats = getStats();
    const ranked = [...stats]
      .map((s) => ({ ...s, pct: s.total > 0 ? (s.score / s.total) * 100 : 0 }))
      .sort((a, b) => b.pct - a.pct || b.score - a.score)
      .slice(0, 10);
    const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`);

    return (
      <div className="quiz-container">
        <h1>🏆 Sıralama - En İyi 10</h1>

        <button className="back-btn" onClick={() => setShowLeaderboard(false)}>
          ← Geri Dön
        </button>

        <div className="stats-history">
          {ranked.length === 0 ? (
            <p>Henüz sınav yapılmamış.</p>
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

  if (showStats) {
    const stats = getStats();
    const overallStats = calculateOverallStats();

    return (
      <div className="quiz-container">
        <h1>Elanaz'ın Ders Dünyası - İstatistikler</h1>
        
        <button 
          className="back-btn"
          onClick={() => setShowStats(false)}
        >
          ← Geri Dön
        </button>

        <div className="stats-summary">
          <h2>Genel İstatistikler</h2>
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
            <p>Henüz sınav yapılmamış.</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Ders</th>
                  <th>Tema</th>
                  <th>Zorluk</th>
                  <th>Puan</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.subject}</td>
                    <td>{stat.theme}</td>
                    <td>{stat.difficulty}</td>
                    <td>{stat.score}/{stat.total}</td>
                    <td>{stat.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="quiz-container">
        <h1>Elanaz'ın Ders Dünyası - Web</h1>
        
        <div className="quiz-finished">
          <h2>🎉 Quiz Tamamlandı!</h2>
          <div className="result-box">
            <p className="result-text">Puan: <strong>{score} / {questions.length}</strong></p>
            <p className="result-percentage">Başarı: <strong>{percentage}%</strong></p>
            <p className="result-details">
              {selectedSubject} - {selectedTheme} - {difficulty}
            </p>
          </div>
          
          <div className="button-group">
            <button 
              className="restart-btn"
              onClick={handleRestart}
            >
              🔄 Yeniden Başla
            </button>
            <button 
              className="stats-btn"
              onClick={() => setShowStats(true)}
            >
              📊 İstatistikler
            </button>
            <button 
              className="stats-btn"
              onClick={() => setShowLeaderboard(true)}
            >
              🏆 Sıralama
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'hakkinda') {
    return (
      <div className="hakkinda-container">
        <button className="back-btn" onClick={() => { setHataModu(false); setScreen('home'); }}>← Ana Sayfa</button>
        <div className="hakkinda-emoji">🎈</div>
        <h1 className="hakkinda-baslik">Ders Dünyası Hakkında</h1>

        <p className="hakkinda-giris">
          Ders Dünyası, ilkokul çağındaki çocukların öğrenmesine küçük bir katkı sunmak için
          hazırlanmış, tamamen ücretsiz bir eğitim uygulamasıdır. Hiçbir kâr amacı gütmez;
          tek amacı çocukların eğlenerek ve kendi hızlarında öğrenmesidir.
        </p>

        <div className="hakkinda-bolum">
          <h3>📚 Müfredata uygun</h3>
          <p>Tüm sorular ve hikâyeler, MEB müfredatı göz önünde bulundurularak hazırlanmıştır.
          Matematik, Türkçe, Fen Bilimleri, Hayat Bilgisi ve İngilizce başta olmak üzere geniş bir konu yelpazesini kapsar.</p>
        </div>

        <div className="hakkinda-bolum">
          <h3>🛡️ Güvenli içerik</h3>
          <p>İçerikler çocuklar için özenle hazırlanmıştır. Uygulamada argo, küfür, şiddet ya da
          çocuklar için uygunsuz hiçbir ifade yer almaz. Her şey çocukların yaş seviyesine uygun bir dille yazılmıştır.</p>
        </div>

        <div className="hakkinda-bolum">
          <h3>🔒 Gizliliğiniz güvende</h3>
          <p>Çocuğunuzun takma adı, sınıfı ve oyun ilerlemesi yalnızca kullandığınız cihazda saklanır.
          Bu bilgiler bize veya başka hiç kimseye gönderilmez, hiçbir sunucuda toplanmaz.
          Cihazınızın tarayıcı verilerini temizlerseniz bu bilgiler de silinir — yani her şey tamamen sizin kontrolünüzdedir.</p>
        </div>

        <div className="hakkinda-bolum">
          <h3>🌱 Sürekli gelişiyor</h3>
          <p>Ders Dünyası güncellemeye açık, yaşayan bir projedir. Yeni sorular, hikâyeler ve
          özellikler zamanla eklenmeye devam edecek. Amacımız, uygulamayı çocuklarla birlikte büyütmek.</p>
        </div>

        <div className="hakkinda-bolum">
          <h3>🔄 Güncelleme</h3>
          <p>Uygulama yeni sürümleri kendiliğinden alır. Bir sorun görürsen bu butona dokun:</p>
          <button className="home-action-btn" onClick={() => guncellemeVarsaYenile(true)}>🔄 Şimdi Güncelle</button>
        </div>

        <div className="hakkinda-bolum hakkinda-son">
          <h3>❤️ Sevgiyle yapıldı</h3>
          <p>Bu uygulama, bir babanın kendi çocukları için başlattığı bir projeden doğdu.
          Umuyoruz ki sizin çocuğunuzun da öğrenme yolculuğuna küçük bir ışık tutar.</p>
        </div>
      </div>
    );
  }

  if (screen === 'hikaye') {
    return <HikayeKosesi onClose={() => setScreen('home')} />;
  }

  if (screen === 'oyunlar') {
    return <Oyunlar onClose={() => setScreen('home')} />;
  }

  // Profil secim / yeni profil ekrani
  if (!profilAdi) {
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
    };
    const profilSec = (ad: string) => {
      localStorage.setItem(AKTIF_KEY, ad);
      setProfilAdi(ad);
    };
    const EMOJI = ['🦁','🌟','🦋','🚀','🌈','🐬','🦄','🍀'];

    if (profiller.length > 0 && !yeniProfilModu) {
      return (
        <div className="profil-container">
          <div className="profil-emoji">👋</div>
          <h1 className="profil-baslik">Kim oynuyor?</h1>
          <p className="profil-alt">Adına dokun ve başla!</p>
          <div className="profil-kart-grid">
            {profiller.map((pr, i) => (
              <button key={pr.ad} className="profil-kart" onClick={() => profilSec(pr.ad)}>
                <span className="profil-kart-emoji">{EMOJI[i % EMOJI.length]}</span>
                <span className="profil-kart-ad">{pr.ad}</span>
                <span className="profil-kart-sinif">{pr.sinif}. Sınıf</span>
              </button>
            ))}
            <button className="profil-kart profil-kart-yeni" onClick={() => setYeniProfilModu(true)}>
              <span className="profil-kart-emoji">➕</span>
              <span className="profil-kart-ad">Yeni Profil</span>
            </button>
          </div>
        </div>
      );
    }

    const siniflar = ['1', '2', '3', '4'];
    return (
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
    );
  }

  if (screen === 'home') {
    const cards = [
      { name: 'Matematik', emoji: '🔢', color: '#378ADD' },
      { name: 'Türkçe', emoji: '📖', color: '#D4537E' },
      { name: 'Fen Bilimleri', emoji: '🔬', color: '#1D9E75' },
      { name: 'Hayat Bilgisi', emoji: '🌍', color: '#EF9F27' },
      { name: 'İngilizce', emoji: '🔤', color: '#7F77DD' },
      { name: 'Görsel Sanatlar', emoji: '🎨', color: '#D85A30' },
      { name: 'Zeka-Dikkat', emoji: '🧩', color: '#378ADD' },
    ];
    return (
      <div className="home-container">
        <h1 className="home-title">🎈 Ders Dünyası</h1>
        <p className="home-subtitle">Merhaba {profilAdi}! 👋 Dokun ve oyna!</p>
        <button className="profil-degistir-btn" onClick={() => { localStorage.removeItem(AKTIF_KEY); setProfilAdi(""); }}>👤 Profil Değiştir</button>
        <div className="home-grid">
          {cards.filter(c => !(aktifSinif(profilAdi) === '1' && c.name === 'İngilizce')).map((c, i) => (
            <button
              key={c.name}
              className={`home-card ${i === 4 ? 'home-card-wide' : ''}`}
              style={{ background: c.color }}
              onClick={() => {
                setSelectedSubject(c.name);
                setSelectedTheme('Tema 1');
                setScreen('quiz');
              }}
            >
              <span className="home-card-emoji">{c.emoji}</span>
              <span className="home-card-name">{c.name}</span>
            </button>
          ))}
        </div>
        <div className="home-actions">
          <button className="home-buyuk-kart hikaye-buyuk" onClick={() => setScreen('hikaye')}>
            <span className="home-buyuk-emoji">📚</span>
            <span className="home-buyuk-ad">Hikaye Köşesi</span>
          </button>
          <button className="home-buyuk-kart oyun-buyuk" onClick={() => setScreen('oyunlar')}>
            <span className="home-buyuk-emoji">🎮</span>
            <span className="home-buyuk-ad">Oyunlar</span>
          </button>
          <button className="home-action-btn hata-kutusu-btn" onClick={() => {
            const h = hatalariGetir(profilAdi);
            setHataModu(true);
            setQuestions(h);
            setCurrentQuestionIndex(0);
            setScore(0);
            setQuizFinished(false);
            setSecilenSik(null);
            setTimeLeft(30);
            setScreen('quiz');
          }}>📦 Hata Kutusu ({hatalariGetir(profilAdi).length})</button>
          <button className="home-action-btn" onClick={() => setShowLeaderboard(true)}>🏆 Sıralama</button>
          <button className="home-action-btn" onClick={() => setShowStats(true)}>📊 İlerlemem</button>
          <button className="home-action-btn" onClick={() => setScreen('hakkinda')}>ℹ️ Hakkında</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="quiz-container">Yükleniyor...</div>;
  if (error) return <div className="quiz-container error">{error}</div>;
  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;

  return (
    <div className="quiz-container">
      <button className="back-btn" onClick={() => setScreen('home')}>← Ana Sayfa</button>
      {yanlisGeri && (
        <div className="yanlis-balon">💪 Olsun, tekrar dene!</div>
      )}
      {kutlama && (
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
      {/* Aktif ders basligi */}
      <div className="aktif-ders">{hataModu ? '📦 Hata Kutusu' : selectedSubject}</div>

      {/* Quiz Content */}
      <div className="quiz-content">
        {!currentQuestion ? (
          <div className="question-section">
            <h2>{hataModu ? 'Kutun bomboş, harikasın! 🌟 Hiç düzeltilecek hatan yok.' : 'Bu derste henüz soru yok. Ana sayfadan başka bir ders seç.'}</h2>
          </div>
        ) : (
        <>
        <div className="progress-row">
          <div className="progress">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div 
            className="timer"
            style={{ color: getTimerColor() }}
          >
            ⏱️ {timeLeft}s
          </div>
        </div>
        
        <div className="question-section">
          {currentQuestion.passage && (
            <div className="okuma-metni">{currentQuestion.passage}</div>
          )}
          {gorselBul(currentQuestion.theme) && (
            <img className="soru-gorsel" src={gorselBul(currentQuestion.theme)!} alt={currentQuestion.theme} />
          )}
          <div className="soru-satir">
            <h2>{currentQuestion.question}</h2>
            <button className="soru-dinle-btn" onClick={soruyuSeslendir} title="Dinle">🔊</button>
          </div>
          {currentQuestion.image && (
            currentQuestion.image.startsWith("http") ? (
              <img
                src={currentQuestion.image}
                alt=""
                className="question-image"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="question-emoji">{currentQuestion.image}</div>
            )
          )}
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            let cls = 'option-btn';
            if (secilenSik !== null) {
              if (index === currentQuestion.correctAnswer) cls += ' option-dogru';
              else if (index === secilenSik) cls += ' option-yanlis';
            }
            return (
              <button
                key={index}
                className={cls}
                onClick={() => handleAnswer(index)}
                disabled={secilenSik !== null}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="score-display">
          Puan: {score} / {questions.length}
        </div>
        </>
        )}

        <button 
          className="stats-btn-bottom"
          onClick={() => setShowStats(true)}
        >
          📊 İstatistikler
        </button>
        <button 
          className="stats-btn-bottom"
          onClick={() => setShowLeaderboard(true)}
        >
          🏆 Sıralama
        </button>
      </div>
    </div>
  );
};

export default QuizViewer;
