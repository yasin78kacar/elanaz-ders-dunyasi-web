/** QuizViewer konfeti katmanının oyun kopyası — localStorage yok. */
export function Konfeti({ goster }: { goster: boolean }) {
  if (!goster) return null;
  return (
    <div className="oyun-konfeti" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className={`oyun-konfeti-parca oyun-konfeti-${i % 7}`}
          style={{ left: `${(i * 7) % 100}%` }}
        />
      ))}
    </div>
  );
}
