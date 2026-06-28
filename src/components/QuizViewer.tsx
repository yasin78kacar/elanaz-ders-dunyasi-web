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
      
      const dataPath = `/data/${selectedSubject.toLowerCase()}/tema1.json`;
      
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
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz Bitti! Puanınız: ${score + (optionIndex === currentQuestion.correctAnswer ? 1 : 0)}/${questions.length}`);
      setCurrentQuestionIndex(0);
      setScore(0);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Elanaz'ın Ders Dünyası</h1>
          <p>Web Sürümü</p>
        </div>
        <div className="loading">Sorular yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Elanaz'ın Ders Dünyası</h1>
        </div>
        <div className="error">⚠️ Hata: {error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Elanaz'ın Ders Dünyası</h1>
        </div>
        <div className="subject-selector">
          <h2>Bir Konu Seç:</h2>
          <div className="subject-buttons">
            {subjects.map(subject => (
              <button
                key={subject}
                className={`subject-btn ${selectedSubject === subject ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          <p>Seçilen: {selectedSubject}</p>
          <p className="info">Data klasöründen sorular yüklenmek için...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Elanaz'ın Ders Dünyası</h1>
        <div className="quiz-info">
          <span>Konu: {selectedSubject}</span>
          <span>Soru: {currentQuestionIndex + 1}/{questions.length}</span>
          <span>Puan: {score}</span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-box">
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.image && (
            <img src={currentQuestion.image} alt="Question visual" className="question-image" />
          )}
        </div>

        <div className="options-box">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => handleAnswer(index)}
            >
              {String.fromCharCode(65 + index)}) {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;