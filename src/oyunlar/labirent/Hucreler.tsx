/** Çalı duvar / kovan / çiçek / arı — ızgara hücresi SVG'leri. */

export function Cali({ v }: { v: number }) {
  const a = v % 3;
  return (
    <svg viewBox="0 0 40 40" className="lb-cali-svg" aria-hidden>
      <ellipse cx="20" cy="28" rx="16" ry="6" fill="#000" opacity="0.1" />
      <ellipse cx="20" cy="22" rx="17" ry="12" fill={a === 0 ? '#2d6a2e' : a === 1 ? '#245a28' : '#1f5a24'} />
      <ellipse cx="12" cy="16" rx="10" ry="10" fill="#3d8a3a" />
      <ellipse cx="28" cy="15" rx="11" ry="11" fill="#4a9a42" />
      <ellipse cx="20" cy="12" rx="9" ry="8" fill="#5aaa4a" />
      {a === 0 && <circle cx="14" cy="18" r="2.2" fill="#c23d5a" />}
      {a === 1 && <circle cx="26" cy="20" r="2.4" fill="#e8b020" />}
      {a === 2 && (
        <>
          <circle cx="18" cy="14" r="2" fill="#e23d4a" />
          <circle cx="24" cy="22" r="1.6" fill="#f0c030" />
        </>
      )}
    </svg>
  );
}

export function YolTas({ v }: { v: number }) {
  return (
    <svg viewBox="0 0 40 40" className="lb-yol-svg" aria-hidden>
      <ellipse cx="20" cy="22" rx="14" ry="10" fill="#e8d7a0" opacity="0.85" />
      {v % 2 === 0 && <ellipse cx="16" cy="20" rx="4" ry="3" fill="#d4c080" />}
      {v % 3 === 0 && <ellipse cx="24" cy="24" rx="3.5" ry="2.5" fill="#c8b070" />}
    </svg>
  );
}

export function Kovan() {
  return (
    <svg viewBox="0 0 40 40" className="lb-kovan" aria-hidden>
      <ellipse cx="20" cy="30" rx="12" ry="4" fill="#000" opacity="0.12" />
      <ellipse cx="20" cy="26" rx="12" ry="5" fill="#c88820" />
      <ellipse cx="20" cy="20" rx="10" ry="5" fill="#e0a030" />
      <ellipse cx="20" cy="14" rx="8" ry="5" fill="#f0c14a" />
      <rect x="17" y="18" width="6" height="5" rx="2" fill="#5a3a10" />
    </svg>
  );
}

export function Cicek({ yakin }: { yakin: 'uzak' | 'yakin' | 'cok' }) {
  return (
    <svg viewBox="0 0 40 40" className={`lb-cicek ${yakin}`} aria-hidden>
      <ellipse cx="20" cy="32" rx="8" ry="3" fill="#000" opacity="0.1" />
      {[0, 60, 120, 180, 240, 300].map((d) => {
        const r = (d * Math.PI) / 180;
        return (
          <ellipse
            key={d}
            cx={20 + Math.cos(r) * 8}
            cy={18 + Math.sin(r) * 8}
            rx="5"
            ry="7"
            fill="#e23d6a"
            transform={`rotate(${d} ${20 + Math.cos(r) * 8} ${18 + Math.sin(r) * 8})`}
          />
        );
      })}
      <circle cx="20" cy="18" r="6" fill="#f0c030" />
      <circle cx="20" cy="18" r="3" fill="#fff6b0" />
    </svg>
  );
}

export function Ari({ sol }: { sol: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`lb-ari-svg${sol ? ' sol' : ''}`} aria-hidden>
      <ellipse className="lb-kanat lb-kanat-l" cx="14" cy="16" rx="9" ry="6" fill="#fff" opacity="0.85" />
      <ellipse className="lb-kanat lb-kanat-r" cx="34" cy="16" rx="9" ry="6" fill="#fff" opacity="0.85" />
      <ellipse cx="24" cy="26" rx="13" ry="10" fill="#f0c030" />
      <path d="M16 22 h16" stroke="#3a2a10" strokeWidth="3" />
      <path d="M16 26 h16" stroke="#3a2a10" strokeWidth="3" />
      <path d="M16 30 h16" stroke="#3a2a10" strokeWidth="3" />
      <circle cx="20" cy="22" r="1.8" fill="#2a1a10" />
      <circle cx="28" cy="22" r="1.8" fill="#2a1a10" />
      <ellipse cx="24" cy="32" rx="4" ry="2.5" fill="#e09a20" />
    </svg>
  );
}
