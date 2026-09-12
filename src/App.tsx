import { useState } from 'react';
import QuizViewer from './components/QuizViewer';
import HikayeKosesi from './components/HikayeKosesi';
import Oyunlar from './components/Oyunlar';
import BesN1K from './components/BesN1K';
import DenemeSinavi from './components/DenemeSinavi';
import BoyamaKosesi from './components/BoyamaKosesi';
import BoyamaFloodFill from './components/BoyamaFloodFill';
import './App.css';

type Screen = 'quiz' | 'hikaye' | 'oyunlar' | 'besn1k' | 'deneme' | 'boyama' | 'boyama-flood';

function floodPrototipIsteniyor(): boolean {
  return new URLSearchParams(window.location.search).has('boyama-flood');
}

function App() {
  const [screen, setScreen] = useState<Screen>(() => (
    floodPrototipIsteniyor() ? 'boyama-flood' : 'quiz'
  ));

  return (
    <div className="app">
      {screen === 'quiz' && (
        <QuizViewer
          onHikayeAc={() => setScreen('hikaye')}
          onOyunlarAc={() => setScreen('oyunlar')}
          onBesN1KAc={() => setScreen('besn1k')}
          onDenemeAc={() => setScreen('deneme')}
          onBoyamaAc={() => setScreen('boyama')}
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
      {screen === 'deneme' && (
        <DenemeSinavi onClose={() => setScreen('quiz')} />
      )}
      {screen === 'boyama' && (
        <BoyamaKosesi onClose={() => setScreen('quiz')} />
      )}
      {screen === 'boyama-flood' && (
        <BoyamaFloodFill onClose={() => setScreen('quiz')} />
      )}
    </div>
  );
}

export default App;
