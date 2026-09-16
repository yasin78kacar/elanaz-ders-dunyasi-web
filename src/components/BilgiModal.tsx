import { createPortal } from 'react-dom';
import '../styles/BilgiModal.css';

type Props = {
  mesaj: string;
  onKapat: () => void;
};

function BilgiModal({ mesaj, onKapat }: Props) {
  return createPortal(
    <div className="bm-overlay" role="presentation">
      <div className="bm-kart" role="dialog" aria-modal="true" aria-describedby="bm-mesaj">
        <p id="bm-mesaj" className="bm-mesaj">{mesaj}</p>
        <button type="button" className="bm-btn" onClick={onKapat}>Tamam</button>
      </div>
    </div>,
    document.body,
  );
}

export default BilgiModal;
