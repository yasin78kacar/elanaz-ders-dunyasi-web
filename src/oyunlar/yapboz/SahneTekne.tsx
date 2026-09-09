export function SahneTekne({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a6e" />
          <stop offset="0.4" stopColor="#c45c4a" />
          <stop offset="0.75" stopColor="#f0a050" />
          <stop offset="1" stopColor="#f6d48a" />
        </linearGradient>
        <linearGradient id={`${uid}-su`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a7ea8" />
          <stop offset="1" stopColor="#2a4e72" />
        </linearGradient>
        <radialGradient id={`${uid}-gunes`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff0c0" />
          <stop offset="1" stopColor="#ff9a3c" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${uid}-gok)`} />
      <circle cx="310" cy="78" r="30" fill={`url(#${uid}-gunes)`} />
      <circle cx="310" cy="78" r="44" fill="#ffb050" opacity="0.2" />
      <g className="yb-bulut">
        <ellipse cx="70" cy="40" rx="24" ry="10" fill="#f4d2c0" opacity="0.55" />
        <ellipse cx="54" cy="44" rx="14" ry="8" fill="#f4d2c0" opacity="0.55" />
      </g>
      <path d="M-10 128 C 80 118, 160 134, 250 120 C 320 110, 380 128, 420 118 L 420 168 L -10 168 Z" fill="#3d5a32" />
      <path d="M320 148 L332 118 L344 148 Z" fill="#1f5c3a" />
      <path d="M348 152 L358 128 L368 152 Z" fill="#2a7348" />
      <rect x="368" y="108" width="8" height="42" fill="#b08960" />
      <path d="M364 108 h16 l-8 -14z" fill="#c64545" />
      <circle cx="376" cy="128" r="4" fill="#f6e27a" />
      <rect x="0" y="168" width="400" height="132" fill={`url(#${uid}-su)`} />
      <path className="yb-dalga" d="M0 184 q20 8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t20 0" fill="none" stroke="#8ec4e0" strokeWidth="2.2" opacity="0.45" />
      <path className="yb-dalga" d="M0 210 q24 8 48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t32 0" fill="none" stroke="#b8dff0" strokeWidth="1.8" opacity="0.3" />
      <g>
        <path d="M120 210 Q140 248 200 252 Q260 248 280 210 Z" fill="#8b3a2a" />
        <path d="M128 210 h144" stroke="#5a2418" strokeWidth="5" />
        <path d="M200 210 v-118" stroke="#4a3220" strokeWidth="5" />
        <path d="M202 96 L268 200 L202 200 Z" fill="#f4e4c0" />
        <path d="M198 112 L140 200 L198 200 Z" fill="#e8d2a0" />
        <path d="M200 88 l18 -8 v10z" fill="#c64545" />
        <rect x="186" y="200" width="28" height="12" fill="#d4b08a" />
        <circle cx="168" cy="222" r="4" fill="#f4d23a" />
        <circle cx="232" cy="222" r="4" fill="#f4d23a" />
      </g>
      <g className="yb-kus">
        <ellipse cx="60" cy="90" rx="8" ry="4.5" fill="#4a5568" />
        <ellipse cx="68" cy="88" rx="5" ry="3" fill="#2d3748" />
      </g>
      <g className="yb-kus" style={{ animationDelay: '-1s' }}>
        <ellipse cx="100" cy="70" rx="7" ry="4" fill="#4a5568" />
        <ellipse cx="107" cy="68" rx="4" ry="2.6" fill="#2d3748" />
      </g>
      <ellipse cx="200" cy="268" rx="70" ry="8" fill="#1a3048" opacity="0.2" />
    </g>
  );
}
