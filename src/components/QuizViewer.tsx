import { useState } from 'react';
import '../styles/QuizViewer.css';

const QuizViewer: React.FC = () => {
  const [selectedSubject] = useState('math');
  
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-title">Elanaz'ın Ders Dünyası</div>
        <div className="quiz-score">Web Sürümü - Hazırlama Aşaması</div>
      </div>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Quiz Engine Geliştiriliyor...</h2>
        <p>Seçilen konu: {selectedSubject}</p>
        <p>Data klasörü başarıyla bağlandı ✓</p>
      </div>
    </div>
  );
};

export default QuizViewer;
