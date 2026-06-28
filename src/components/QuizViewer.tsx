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
}

const QuizViewer: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('Matematik');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subjects = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Hayat Bilgisi', 'İngilizce'];

  useEffect(() => {
    loadQuestions();
  }, [selectedSubject]);

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
      const dataPath = `./data/${folder}/tema1.json`;
      
      const response = await fetch(dataPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load questions from ${dataPath}`);
      }
      
      const data = await response.json();
      setQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      if (optionIndex === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        alert(`Quiz tamamlandı! Skor: ${score + (optionIndex === currentQuestion.correctAnswer ? 1 : 0)}/${questions.length}`);
        setCurrentQuestionIndex(0);
        setScore(0);
      }
    }
  };

  if (loading) {
    return <div className="quiz-container"><p>Sorular yükleniyor...</p></div>;
  }

  if (error) {
    return <div className="quiz-container"><p style={{color: 'red'}}>Hata: {error}</p></div>;
  }

  if (questions.length === 0) {
    return <div className="quiz-container"><p>Soru bulunamadı.</p></div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1>Elanaz'ın Ders Dünyası</h1>
      
      <div className="subject-selector">
        <h2>Bir Dersi Seç:</h2>
        <div className="subject-buttons">
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
      </div>

      <div className="quiz-content">
        <div className="question-header">
          <h2>{selectedSubject}</h2>
          <p>Soru {currentQuestionIndex + 1}/{questions.length}</p>
        </div>

        <div className="question-box">
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.image && (
            <img src={currentQuestion.image} alt="Soru görseli" className="question-image" />
          )}
        </div>

        <div className="options">
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
          Doğru Cevap: {score}/{currentQuestionIndex}
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;