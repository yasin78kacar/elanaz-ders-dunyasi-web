import { useState, useEffect } from 'react';
import '../styles/QuizViewer.css';

interface Question {
  id: string;
  soru: string;
  dogruCevap: string;
  secenekler?: string[];
  gorsel?: {
    tur: string;
    mod: string;
    sahne?: string;
  };
}

interface Topic {
  id: string;
  baslik: string;
  alistirma: Question[];
}

interface Theme {
  id: string;
  baslik: string;
  konular: Topic[];
}

const QuizViewer: React.FC = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [selectedTheme, setSelectedTheme] = useState<string>('tema-1');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setSubjects(['math', 'turkce', 'english', 'fen', 'hayat']);
  }, []);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themeModules = import.meta.glob('../data/*/tema*.json', { eager: true });
        const subjectThemes: Theme[] = [];

        Object.entries(themeModules).forEach(([path, module]: [string, any]) => {
          if (path.includes(`/data/${selectedSubject}/`)) {
            subjectThemes.push(module.default || module);
          }
        });

        setThemes(subjectThemes.sort((a, b) => {
          const numA = parseInt(a.id.split('-')[1]) || 0;
          const numB = parseInt(b.id.split('-')[1]) || 0;
          return numA - numB;
        }));

        if (subjectThemes.length > 0) {
          setSelectedTheme(subjectThemes[0].id);
        }
      } catch (error) {
        console.error('Error loading themes:', error);
      }
    };

    loadThemes();
  }, [selectedSubject]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const themeData = themes.find(t => t.id === selectedTheme);
        if (themeData?.konular?.[0]?.alistirma) {
          const allQuestions = themeData.konular.flatMap(k => k.alistirma);
          setQuestions(allQuestions);
          setCurrentQuestionIndex(0);
          setScore(0);
          setAnswered(false);
          setSelectedAnswer(null);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, [selectedTheme, themes]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === currentQuestion.dogruCevap) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  if (questions.length === 0) {
    return <div className="quiz-container">Loading...</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-title">Elanaz'ın Ders Dünyası</div>
        <div className="quiz-score">Puan: {score}/{questions.length}</div>
      </div>

      <div className="quiz-controls">
        <div className="control-group">
          <label>Konu:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Tema:</label>
          <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
            {themes.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.baslik}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-text">{currentQuestionIndex + 1} / {questions.length}</div>

      {currentQuestion && (
        <div className="question-card">
          <div className="question-text">{currentQuestion.soru}</div>

          <div className="options">
            {(currentQuestion.secenekler || []).map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === option ? 'selected' : ''
                } ${
                  answered && option === currentQuestion.dogruCevap ? 'correct' : ''
                } ${
                  answered && selectedAnswer === option && option !== currentQuestion.dogruCevap ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswer(option)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <div className={`feedback ${selectedAnswer === currentQuestion.dogruCevap ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.dogruCevap
                ? '✓ Doğru!'
                : `✗ Yanlış! Doğru cevap: ${currentQuestion.dogruCevap}`}
            </div>
          )}
        </div>
      )}

      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          ← Önceki
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Sonraki →
        </button>
      </div>

      {currentQuestionIndex === questions.length - 1 && answered && (
        <div className="results">
          <div className="results-title">Tebrikler!</div>
          <div className="results-score">{score} / {questions.length} Doğru</div>
          <div className="results-percentage">%{Math.round((score / questions.length) * 100)}</div>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
