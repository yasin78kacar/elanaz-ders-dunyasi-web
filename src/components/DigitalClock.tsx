interface DigitalClockProps {
  hour: number;
  minute: number;
  /** 12 → 12 saat biçimi ("3:00", başa 0 yok); 24 → 24 saat biçimi ("13:00", başa 0 var). */
  format?: number;
  /** Ekran taban genişliği (px) — rakam boyutu buna göre ölçeklenir. Şık/mini için ~90, soru için ~200–280. */
  size?: number;
}

// Çocuk dostu dijital saat: koyu lacivert ekran + parlak amber rakamlar (monospace,
// "dijital font" hissi). 12 saat biçiminde tek haneli saatlerde başa 0 KONMAZ ("7:30",
// "3:00"); 24 saat biçiminde iki haneli gösterilir ("07:30", "13:00").
const DigitalClock: React.FC<DigitalClockProps> = ({ hour, minute, format = 12, size = 280 }) => {
  const mm = minute < 10 ? `0${minute}` : `${minute}`;
  let saatMetni: string;
  if (format === 24) {
    const h24 = ((hour % 24) + 24) % 24;
    saatMetni = `${h24 < 10 ? '0' + h24 : h24}:${mm}`;
  } else {
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    saatMetni = `${h12}:${mm}`;
  }

  // Mini şık (Tema 2) ~90–120px; soru görseli 200+. Alt sınır düşük tutulur.
  const w = Math.max(72, size);
  const compact = w < 160;
  const fontSize = Math.round(w * (compact ? 0.34 : 0.4));
  const borderW = Math.max(2, Math.round(w * 0.018));
  const amber = '#FFC24B';

  return (
    <div
      className="digital-clock"
      role="img"
      aria-label={`Saat ${saatMetni}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: compact ? '100%' : undefined,
        minWidth: compact ? 0 : w,
        maxWidth: '100%',
        padding: `${Math.round(w * (compact ? 0.1 : 0.11))}px ${Math.round(w * (compact ? 0.1 : 0.14))}px`,
        boxSizing: 'border-box',
        borderRadius: Math.round(w * 0.1),
        background: 'linear-gradient(160deg, #0E1B33 0%, #0A1220 100%)',
        border: `${borderW}px solid #1E2A45`,
        boxShadow:
          compact
            ? '0 3px 8px rgba(10,18,32,0.28), inset 0 1px 3px rgba(0,0,0,0.5)'
            : '0 10px 24px rgba(10,18,32,0.35), inset 0 2px 6px rgba(0,0,0,0.6), inset 0 0 0 3px #060B15',
      }}
    >
      <span
        style={{
          fontFamily:
            "'DS-Digital', 'Courier New', 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: `${Math.round(w * 0.02)}px`,
          color: amber,
          textShadow: `0 0 ${Math.round(w * 0.04)}px rgba(255,194,75,0.85), 0 0 ${Math.round(w * 0.09)}px rgba(255,159,28,0.55)`,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {saatMetni}
      </span>
    </div>
  );
};

export default DigitalClock;
