/** Yeni oyun menü kartı. Mevcut 7 kartın işaretlemesine dokunmaz. */
interface Props {
  renk: string;
  emoji: string;
  baslik: string;
  alt: string;
  onClick: () => void;
}

export function OyunKart({ renk, emoji, baslik, alt, onClick }: Props) {
  return (
    <button className="oyun-kart" style={{ background: renk }} onClick={onClick}>
      <span className="oyun-kart-emoji">{emoji}</span>
      <span>{baslik}</span>
      <span className="oyun-kart-alt">{alt}</span>
    </button>
  );
}
