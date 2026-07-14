import { useState } from 'react';
import QuizViewer from './components/QuizViewer';
import HikayeKosesi from './components/HikayeKosesi';
import './App.css';

type Screen = 'quiz' | 'hikaye';

function App() {
  const [screen, setScreen] = useState<Screen>('quiz');

  return (
    <div className="app">
      {screen === 'quiz' && (
        <QuizViewer onHikayeAc={() => setScreen('hikaye')} />
      )}
      {screen === 'hikaye' && (
        <HikayeKosesi onClose={() => setScreen('quiz')} />
      )}
    </div>
  );
}

export default App;
