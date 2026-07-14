import { useState, useEffect, useCallback } from 'react';
import '../styles/QuizViewer.css';

interface Question {
  id: string;
  subject: string;
  theme: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

type FeedbackState = 'idle' | 'correct' | 'wrong';

const SUBJECTS = [
  { label: 'Matematik',     folder: 'math',    emoji: '🔢', color: '#FF6B6B' },
  { label: 'Türkçe',        folder: 'turkce',  emoji: '📖', color: '#4ECDC4' },
  { label: 'Fen Bilimleri', folder: 'fen',     emoji: '🔬', color: '#45B7D1' },
  { label: 'Hayat Bilgisi', folder: 'hayat',   emoji: '🌍', color: '#96CEB4' },
  { label: 'İngilizce',     folder: 'english', emoji: '🌟', color: '#FFEAA7' },
];

const THEMES = Array.from({ length: 10 }, (_, i) => `Tema ${i + 1}`);

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

interface Props {
  onHikayeAc?: () => void;
  onOyunlarAc?: () => void;
}

const QuizViewer: React.FC<Props> = ({ onHikayeAc, onOyunlarAc }) => {
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].label);
  const [selectedTheme, setSelectedTheme]     = useState('Tema 1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [feedback, setFeedback]         = useState<FeedbackState>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const activeSubject = SUBJECTS.find(s => s.label === selectedSubject) || SUBJECTS[0];

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback('idle');
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
    try {
      const folder   = activeSubject.folder;
      const temaNum  = selectedTheme.replace('Tema ', '');
      const response = await fetch(`./data/${folder}/tema${temaNum}.json`);
      if (!response.ok) throw new Error('Sorular yüklenemedi.');
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedTheme]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const handleAnswer = (optionIndex: number) => {
    if (feedback !== 'idle') return;
    const isCorrect = optionIndex === questions[currentIndex].correctAnswer;
    setSelectedOption(optionIndex);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback('idle');
      setSelectedOption(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setCurrentIndex(0);
        setScore(0);
      }
    }, 900);
  };

  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  // ── Selectors (always visible at top) ──────────────────────────────────
  const selectors = (
    <div className="qv-selectors">
      {/* Ders seçimi */}
      <section className="qv-section">
        <h2 className="qv-section-title">📚 Ders Seç</h2>
        <div className="qv-subject-grid">
          {SUBJECTS.map(s => (
            <button
              key={s.label}
              id={`subject-${s.folder}`}
              className={`qv-subject-card ${selectedSubject === s.label ? 'qv-subject-card--active' : ''}`}
              style={{ '--card-color': s.color } as React.CSSProperties}
              onClick={() => setSelectedSubject(s.label)}
            >
              <span className="qv-subject-emoji">{s.emoji}</span>
              <span className="qv-subject-label">{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Tema seçimi */}
      <section className="qv-section">
        <h2 className="qv-section-title">🗂️ Tema Seç</h2>
        <div className="qv-theme-grid">
          {THEMES.map(t => (
            <button
              key={t}
              id={`theme-${t.replace(' ', '-').toLowerCase()}`}
              className={`qv-theme-pill ${selectedTheme === t ? 'qv-theme-pill--active' : ''}`}
              style={{ '--card-color': activeSubject.color } as React.CSSProperties}
              onClick={() => setSelectedTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  // ── Ekstra butonlar ────────────────────────────────────────────────────
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

  const extraButtons = (hikayeBtn || oyunlarBtn) ? (
    <div className="qv-extra-btns">
      {hikayeBtn}
      {oyunlarBtn}
    </div>
  ) : null;

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="qv-wrap">
      <div className="qv-hero">
        <div className="qv-hero-title">Ders Dünyası 🌈</div>
        <div className="qv-hero-sub">2. Sınıf · 6.000+ Soru</div>
      </div>
      {extraButtons}
      {selectors}
      <div className="qv-loading">
        <div className="qv-spinner" />
        <p>Sorular yükleniyor…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="qv-wrap">
      <div className="qv-hero">
        <div className="qv-hero-title">Ders Dünyası 🌈</div>
      </div>
      {selectors}
      <div className="qv-error">⚠️ {error}</div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="qv-wrap">
      {/* ── Hero başlık ── */}
      <header className="qv-hero">
        <div className="qv-hero-title">Ders Dünyası 🌈</div>
        <div className="qv-hero-sub">2. Sınıf · 6.000+ Soru</div>
      </header>

      {/* ── Hikaye Köşesi + Oyunlar butonları ── */}
      {extraButtons}

      {/* ── Seçiciler ── */}
      {selectors}

      {/* ── Quiz alanı ── */}
      <div className="qv-quiz-card" style={{ '--card-color': activeSubject.color } as React.CSSProperties}>

        {/* Üst bilgi çubuğu */}
        <div className="qv-quiz-topbar">
          <span className="qv-quiz-label">
            {activeSubject.emoji} {selectedSubject} · {selectedTheme}
          </span>
          <span className="qv-quiz-score">
            ⭐ {score}/{currentIndex}
          </span>
        </div>

        {/* Progress bar */}
        <div className="qv-progress-track">
          <div className="qv-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="qv-progress-text">
          Soru {currentIndex + 1} / {questions.length}
        </p>

        {/* Soru */}
        <div className="qv-question-box">
          {currentQuestion.image && (
            <img src={currentQuestion.image} alt="Soru görseli" className="qv-question-img" />
          )}
          <p className="qv-question-text">{currentQuestion.question}</p>
        </div>

        {/* Şıklar */}
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

        {/* Anlık geri bildirim banner */}
        {feedback !== 'idle' && (
          <div className={`qv-feedback qv-feedback--${feedback}`}>
            {feedback === 'correct' ? '🎉 Harika! Doğru cevap!' : '😅 Olmadı, bir dahaki soruda!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizViewer;
