import { useState } from 'react';
import QuizViewer from './components/QuizViewer';
import HikayeKosesi from './components/HikayeKosesi';
import Oyunlar from './components/Oyunlar';
import BesN1K from './components/BesN1K';
import DenemeSinavi from './components/DenemeSinavi';
import BoyamaKosesi from './components/BoyamaKosesi';
import IngilizceOgren from './components/IngilizceOgren';
import './App.css';

type Screen = 'quiz' | 'hikaye' | 'oyunlar' | 'besn1k' | 'deneme' | 'boyama' | 'ingilizce';

function App() {
  const [screen, setScreen] = useState<Screen>('quiz');
  const yeniAnasayfa = new URLSearchParams(window.location.search).get('yeni-anasayfa') === '1';

  return (
    <div className="app">
      {screen === 'quiz' && (
        <QuizViewer
          onHikayeAc={() => setScreen('hikaye')}
          onOyunlarAc={() => setScreen('oyunlar')}
          onBesN1KAc={() => setScreen('besn1k')}
          onDenemeAc={() => setScreen('deneme')}
          onBoyamaAc={() => setScreen('boyama')}
          onIngilizceAc={() => setScreen('ingilizce')}
          yeniAnasayfa={yeniAnasayfa}
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
      {screen === 'ingilizce' && (
        <IngilizceOgren onClose={() => setScreen('quiz')} />
      )}
    </div>
  );
}

export default App;
