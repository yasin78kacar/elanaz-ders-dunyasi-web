import { useState, useEffect } from 'react';
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

const QuizViewer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('Matematik');
  const [selectedTheme, setSelectedTheme] = useState('Tema 1');
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Orta');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subjects = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Hayat Bilgisi', 'İngilizce'];
  const themes = ['Tema 1', 'Tema 2', 'Tema 3', 'Tema 4', 'Tema 5'];

  useEffect(() => {
    loadQuestions();
  }, [selectedSubject, selectedTheme, difficulty]);

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
      const temaNum = selectedTheme.replace('Tema ', '');
      const dataPath = `./data/${folder}/tema${temaNum}.json`;
      
      const response = await fetch(dataPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load questions from ${dataPath}`);
      }
      
      const data = await response.json();
      const filteredQuestions = data.questions.filter(
        (q: Question) => q.difficulty === difficulty
      );
      setQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz tamamlandı! Skor: ${score + 1}/${questions.length}`);
      setCurrentQuestionIndex(0);
      setScore(0);
    }
  };

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
        <div className="progress">
          Soru {currentQuestionIndex + 1} / {questions.length}
        </div>
        
        <div className="question-section">
          <h2>{currentQuestion.question}</h2>
          {currentQuestion.image && (
            <img src={currentQuestion.image} alt="Question" className="question-image" />
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
      </div>
    </div>
  );
};

export default QuizViewer;
