import { useState } from 'react';
import QuizViewer from './components/QuizViewer';
import HikayeKosesi from './components/HikayeKosesi';
import Oyunlar from './components/Oyunlar';
import BesN1K from './components/BesN1K';
import DenemeSinavi from './components/DenemeSinavi';
import BoyamaKosesi from './components/BoyamaKosesi';
import VideoKosesi from './components/VideoKosesi';
import IngilizceOgren from './components/IngilizceOgren';
import VeliPaneli from './pages/veli-paneli/VeliPaneli';
import './App.css';

type Screen = 'quiz' | 'hikaye' | 'oyunlar' | 'besn1k' | 'deneme' | 'boyama' | 'video' | 'ingilizce' | 'veli';

function aktifSinifNo(): number {
  const ad = localStorage.getItem('dersdunyasi_aktif') || '';
  try {
    const liste = JSON.parse(localStorage.getItem('dersdunyasi_profiller') || '[]');
    const pr = Array.isArray(liste) ? liste.find((x: { ad?: string; sinif?: string }) => x.ad === ad) : null;
    const n = Number(pr?.sinif);
    return n >= 1 && n <= 4 ? n : 2;
  } catch {
    return 2;
  }
}

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
          onVideoAc={() => setScreen('video')}
          onIngilizceAc={() => setScreen('ingilizce')}
          onVeliAc={() => setScreen('veli')}
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
      {screen === 'video' && (
        <VideoKosesi sinif={aktifSinifNo()} onGeri={() => setScreen('quiz')} />
      )}
      {screen === 'ingilizce' && (
        <IngilizceOgren onClose={() => setScreen('quiz')} />
      )}
      {screen === 'veli' && (
        <VeliPaneli onClose={() => setScreen('quiz')} />
      )}
    </div>
  );
}

export default App;
