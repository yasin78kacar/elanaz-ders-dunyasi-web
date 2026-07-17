interface AnalogClockProps {
  hour: number;
  minute: number;
  /** Kenar uzunluğu (px). En az 160px olur. */
  size?: number;
}

// Çocuk dostu analog saat: 12 rakamlı kadran, kalın kısa akrep, ince uzun yelkovan.
// Yüksek kontrast/keskin okunabilirlik hedefi: saf beyaz zemin, tam siyah kalın
// rakamlar, koyu lacivert kalın akrep, canlı kırmızı yelkovan, kalın tek renk çerçeve.
// Akrep/yelkovan açıları saat ve dakikadan hesaplanır (12 = yukarı, saat yönünde).
const AnalogClock: React.FC<AnalogClockProps> = ({ hour, minute, size = 200 }) => {
  const px = Math.max(160, size);
  const c = 100; // viewBox merkezi (0 0 200 200)

  const minuteAngle = minute * 6;               // her dakika 6°
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // her saat 30° + dakika kayması

  // Rakamlar çerçeveden içeri alınır (çizgilere yapışmasın, ferah dursun).
  // 12 tam üstte, 3 tam sağda, 6 tam altta, 9 tam solda; diğerleri eşit aralıkta.
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const a = (n * 30) * Math.PI / 180;
    const r = 65;
    return { n, x: c + r * Math.sin(a), y: c - r * Math.cos(a) };
  });

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 200 200"
      className="analog-clock"
      role="img"
      aria-label={`Saat ${hour}:${minute < 10 ? '0' + minute : minute}`}
      shapeRendering="geometricPrecision"
      style={{ filter: 'none' }}
    >
      {/* Kadran: saf beyaz zemin + kalın tek düz renk çerçeve */}
      <circle cx={c} cy={c} r="93" fill="#FFFFFF" stroke="#1565C0" strokeWidth="11" />

      {/* Dakika/saat çizgileri — koyu ve net */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`t${i}`}
          x1={c}
          y1="15"
          x2={c}
          y2={i % 3 === 0 ? '27' : '21'}
          stroke="#0A1A2F"
          strokeWidth={i % 3 === 0 ? 4.5 : 2.5}
          strokeLinecap="butt"
          transform={`rotate(${i * 30} ${c} ${c})`}
        />
      ))}

      {/* Rakamlar — düz/dik sistem fontu, tam siyah, açı noktasına ortalı */}
      {numbers.map(({ n, x, y }) => (
        <text
          key={n}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="system-ui, -apple-system, 'Segoe UI', 'Arial Rounded MT Bold', Arial, sans-serif"
          fontSize="21"
          fontWeight="700"
          fontStyle="normal"
          fill="#000000"
        >
          {n}
        </text>
      ))}

      {/* Akrep — koyu lacivert, kalın ve kısa, keskin */}
      <line
        x1={c}
        y1={c + 14}
        x2={c}
        y2="58"
        stroke="#0A1A2F"
        strokeWidth="9"
        strokeLinecap="round"
        transform={`rotate(${hourAngle} ${c} ${c})`}
      />

      {/* Yelkovan — canlı kırmızı, ince(ce) ve uzun, keskin */}
      <line
        x1={c}
        y1={c + 18}
        x2={c}
        y2="30"
        stroke="#E11900"
        strokeWidth="5.5"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} ${c} ${c})`}
      />

      {/* Merkez */}
      <circle cx={c} cy={c} r="7" fill="#0A1A2F" />
    </svg>
  );
};

export default AnalogClock;
