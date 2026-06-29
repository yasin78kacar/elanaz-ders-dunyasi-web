
import { useState, useEffect } from 'react';
import { dataMap } from '../data';
import '../styles/QuizViewer.css';

interface Question {
  id: string;
  subject: string;
  theme: string;
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

const QuizViewer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('Matematik');
  const [selectedTheme, setSelectedTheme] = useState('Tema 1');
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Orta');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const subjects = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Hayat Bilgisi', 'İngilizce'];
  const themes = ['Tema 1', 'Tema 2', 'Tema 3', 'Tema 4', 'Tema 5'];

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
        'İngilizce': 'ingilizce'
      };
      
      const folder = subjectMap[selectedSubject] || 'math';
      const data = dataMap[folder];
      const filteredQuestions = data.questions.filter(
        (q: Question) =>
          q.difficulty === difficulty &&
          q.theme.startsWith(selectedTheme)
      );
      setQuestions(filteredQuestions);
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

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      saveResult();
      setQuizFinished(true);
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
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="quiz-container">Yükleniyor...</div>;
  if (error) return <div className="quiz-container error">{error}</div>;
  if (questions.length === 0) return <div className="quiz-container">Soru bulunamadı.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1>Elanaz'ın Ders Dünyası - Web</h1>
      
      {/* Subject Selection */}
      <div className="subject-selector">
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`subject-btn ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Theme Selection */}
      <div className="theme-selector">
        {themes.map((theme) => (
          <button
            key={theme}
            className={`theme-btn ${selectedTheme === theme ? 'active' : ''}`}
            onClick={() => setSelectedTheme(theme)}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Difficulty Selector */}
      <div className="difficulty-selector">
        {['Kolay', 'Orta', 'Zor'].map((level) => (
          <button
            key={level}
            className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
            onClick={() => setDifficulty(level as 'Kolay' | 'Orta' | 'Zor')}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Quiz Content */}
      <div className="quiz-content">
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

        <button 
          className="stats-btn-bottom"
          onClick={() => setShowStats(true)}
        >
          📊 İstatistikler
        </button>
      </div>
    </div>
  );
};

export default QuizViewer;
