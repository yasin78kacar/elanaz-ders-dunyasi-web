import { useState } from 'react';
import QuizViewer from './components/QuizViewer';
import HikayeKosesi from './components/HikayeKosesi';
import Oyunlar from './components/Oyunlar';
import './App.css';

type Screen = 'quiz' | 'hikaye' | 'oyunlar';

function App() {
  const [screen, setScreen] = useState<Screen>('quiz');

  return (
    <div className="app">
      {screen === 'quiz' && (
        <QuizViewer
          onHikayeAc={() => setScreen('hikaye')}
          onOyunlarAc={() => setScreen('oyunlar')}
        />
      )}
      {screen === 'hikaye' && (
        <HikayeKosesi onClose={() => setScreen('quiz')} />
      )}
      {screen === 'oyunlar' && (
        <Oyunlar onClose={() => setScreen('quiz')} />
      )}
    </div>
  );
}

export default App;
