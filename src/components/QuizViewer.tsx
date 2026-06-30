
import { useState, useEffect } from 'react';
import { dataMap } from '../data';
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

const QuizViewer: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'hikaye'>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('Türkçe');
  const [selectedTheme, setSelectedTheme] = useState('Tema 1');
  const difficulty = 'Orta';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [kutlama, setKutlama] = useState(false);
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
      const data = dataMap[folder];
      const pool = Array.isArray(data) ? data : data.questions;
      const dersSorulari = pool.filter((q: Question) => q.subject === selectedSubject);
      const karistir = [...dersSorulari].sort(() => Math.random() - 0.5).slice(0, 20);
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

    const stats = JSON.parse(localStorage.getItem('quizStats') || '[]');
    stats.push(result);
    localStorage.setItem('quizStats', JSON.stringify(stats));
  };

  const ilerle = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      saveResult();
      setQuizFinished(true);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentQuestionIndex].correctAnswer;
    playSound(isCorrect);
    if (isCorrect) {
      setScore(score + 1);
      setKutlama(true);
      setTimeout(() => { setKutlama(false); ilerle(); }, 900);
    } else {
      ilerle();
    }
  };

  const handleRestart = () => {
    loadQuestions();
  };

  const getStats = () => {
    const stats: QuizResult[] = JSON.parse(localStorage.getItem('quizStats') || '[]');
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

  if (screen === 'hikaye') {
    return <HikayeKosesi onClose={() => setScreen('home')} />;
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
        <p className="home-subtitle">Dokun ve oyna!</p>
        <div className="home-grid">
          {cards.map((c, i) => (
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
          <button className="home-action-btn hikaye-action" onClick={() => setScreen('hikaye')}>📚 Hikaye Köşesi</button>
          <button className="home-action-btn" onClick={() => setShowLeaderboard(true)}>🏆 Sıralama</button>
          <button className="home-action-btn" onClick={() => setShowStats(true)}>📊 İlerlemem</button>
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
      <div className="aktif-ders">{selectedSubject}</div>

      {/* Quiz Content */}
      <div className="quiz-content">
        {!currentQuestion ? (
          <div className="question-section">
            <h2>Bu derste henüz soru yok. Ana sayfadan başka bir ders seç.</h2>
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
          <h2>{currentQuestion.question}</h2>
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
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
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
