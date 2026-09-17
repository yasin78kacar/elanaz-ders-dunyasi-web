import { createPortal } from 'react-dom';
import '../styles/BilgiModal.css';

type Props = {
  mesaj: string;
  onayEtiket: string;
  onOnayla: () => void;
  onVazgec: () => void;
};

function OnayModal({ mesaj, onayEtiket, onOnayla, onVazgec }: Props) {
  return createPortal(
    <div className="bm-overlay" role="presentation">
      <div className="bm-kart" role="dialog" aria-modal="true" aria-describedby="bm-onay-mesaj">
        <p id="bm-onay-mesaj" className="bm-mesaj">{mesaj}</p>
        <div className="bm-btnler">
          <button type="button" className="bm-btn bm-btn--vazgec" onClick={onVazgec}>Vazgeç</button>
          <button type="button" className="bm-btn bm-btn--onay" onClick={onOnayla}>{onayEtiket}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default OnayModal;
