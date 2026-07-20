import { useState } from 'react';
import QuizViewer from './components/QuizViewer';
import HikayeKosesi from './components/HikayeKosesi';
import Oyunlar from './components/Oyunlar';
import BesN1K from './components/BesN1K';
import './App.css';

type Screen = 'quiz' | 'hikaye' | 'oyunlar' | 'besn1k';

function App() {
  const [screen, setScreen] = useState<Screen>('quiz');

  return (
    <div className="app">
      {screen === 'quiz' && (
        <QuizViewer
          onHikayeAc={() => setScreen('hikaye')}
          onOyunlarAc={() => setScreen('oyunlar')}
          onBesN1KAc={() => setScreen('besn1k')}
        />
      )}
      {screen === 'hikaye' && (
        <HikayeKosesi onClose={() => setScreen('quiz')} />
      )}
      {screen === 'oyunlar' && (
        <Oyunlar onClose={() => setScreen('quiz')} />
      )}
      {screen === 'besn1k' && (
        <BesN1K onClose={() => setScreen('quiz')} />
      )}
    </div>
  );
}

export default App;
