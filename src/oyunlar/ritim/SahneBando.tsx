/** Festival sahnesi: tren + 4 enstrümanlı hayvan. 30+ path. */

export function SahneBando({ uid, aktif }: { uid: string; aktif: number | null }) {
  const a = (i: number) => (aktif === i ? ' rt-hayvan-oyna' : '');
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5eb0d8" />
          <stop offset="0.45" stopColor="#c8e8f6" />
          <stop offset="1" stopColor="#f6e7b0" />
        </linearGradient>
        <radialGradient id={`${uid}-gunes`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6b8" />
          <stop offset="1" stopColor="#ffc53a" />
        </radialGradient>
        <linearGradient id={`${uid}-tepe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec45a" />
          <stop offset="1" stopColor="#3f8a32" />
        </linearGradient>
        <linearGradient id={`${uid}-sahne`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4a05a" />
          <stop offset="1" stopColor="#8a5a28" />
        </linearGradient>
        <linearGradient id={`${uid}-tren`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e85a3a" />
          <stop offset="1" stopColor="#b83220" />
        </linearGradient>
      </defs>

      <rect width="400" height="280" fill={`url(#${uid}-gok)`} />
      <circle cx="58" cy="44" r="26" fill={`url(#${uid}-gunes)`} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
        const r = (d * Math.PI) / 180;
        return (
          <line key={d} x1={58 + Math.cos(r) * 30} y1={44 + Math.sin(r) * 30} x2={58 + Math.cos(r) * 38} y2={44 + Math.sin(r) * 38} stroke="#ffc53a" strokeWidth="2.6" strokeLinecap="round" />
        );
      })}

      <g className="rt-bulut">
        <ellipse cx="168" cy="38" rx="26" ry="12" fill="#fff" />
        <ellipse cx="150" cy="44" rx="16" ry="9" fill="#fff" />
        <ellipse cx="186" cy="44" rx="16" ry="9" fill="#fff" />
      </g>
      <g className="rt-bulut-2">
        <ellipse cx="318" cy="30" rx="22" ry="10" fill="#fff" opacity="0.92" />
        <ellipse cx="334" cy="34" rx="13" ry="7" fill="#fff" opacity="0.92" />
      </g>

      <path d="M-8 118 C 70 96, 140 124, 220 104 C 300 86, 360 118, 410 108 L 410 280 L -8 280 Z" fill="#9ad45a" />
      <path d="M-8 168 C 80 150, 170 178, 260 158 C 330 146, 380 168, 410 162 L 410 280 L -8 280 Z" fill={`url(#${uid}-tepe)`} />

      <g className="rt-tren">
        <rect x="12" y="128" width="78" height="36" rx="6" fill={`url(#${uid}-tren)`} />
        <rect x="90" y="136" width="44" height="28" rx="4" fill="#f0c14a" />
        <rect x="134" y="140" width="40" height="24" rx="4" fill="#3d7ec9" />
        <rect x="18" y="134" width="18" height="14" rx="2" fill="#8ec4ff" />
        <rect x="42" y="134" width="18" height="14" rx="2" fill="#8ec4ff" />
        <rect x="66" y="118" width="14" height="16" rx="2" fill="#6a6a6a" />
        <ellipse cx="72" cy="112" rx="10" ry="6" fill="#d8d8d8" className="rt-duman" />
        <ellipse cx="80" cy="100" rx="8" ry="5" fill="#e8e8e8" opacity="0.7" className="rt-duman-2" />
        <circle cx="28" cy="168" r="8" fill="#3a3a3a" />
        <circle cx="52" cy="168" r="8" fill="#3a3a3a" />
        <circle cx="78" cy="168" r="7" fill="#3a3a3a" />
        <circle cx="108" cy="168" r="7" fill="#3a3a3a" />
        <circle cx="152" cy="168" r="7" fill="#3a3a3a" />
        <circle cx="28" cy="168" r="3" fill="#c8c8c8" />
        <circle cx="52" cy="168" r="3" fill="#c8c8c8" />
        <path d="M4 168 h176" stroke="#5a4030" strokeWidth="3" />
      </g>

      <path d="M20 78 q18 -22 36 0" fill="#e23d4a" />
      <path d="M56 72 q16 -18 32 0" fill="#e8b020" />
      <path d="M88 78 q18 -20 36 0" fill="#3d7ec9" />
      <path d="M312 70 q16 -18 30 0" fill="#3d9a4a" />
      <path d="M342 76 q16 -16 28 0" fill="#e23d4a" />
      <line x1="38" y1="78" x2="38" y2="96" stroke="#8a5a28" strokeWidth="2" />
      <line x1="72" y1="72" x2="72" y2="96" stroke="#8a5a28" strokeWidth="2" />
      <line x1="106" y1="78" x2="106" y2="100" stroke="#8a5a28" strokeWidth="2" />
      <line x1="327" y1="70" x2="327" y2="96" stroke="#8a5a28" strokeWidth="2" />
      <line x1="356" y1="76" x2="356" y2="100" stroke="#8a5a28" strokeWidth="2" />

      <path d="M8 206 C 40 196, 80 210, 200 200 C 320 190, 370 206, 396 200 L 396 248 L 8 248 Z" fill={`url(#${uid}-sahne)`} />
      <path d="M8 228 h388" stroke="#c88840" strokeWidth="3" />
      <path d="M8 248 h388" stroke="#6a4018" strokeWidth="6" />
      {[40, 100, 160, 220, 280, 340].map((x) => (
        <rect key={x} x={x} y="248" width="10" height="18" rx="1" fill="#6a4018" />
      ))}

      <g className="rt-nota">
        <ellipse cx="196" cy="88" rx="7" ry="5" fill="#3a2a18" />
        <path d="M203 88 v-22" stroke="#3a2a18" strokeWidth="2.2" />
        <path d="M203 66 q10 4 8 12" fill="#3a2a18" />
      </g>
      <g className="rt-nota-2">
        <ellipse cx="236" cy="70" rx="6" ry="4" fill="#3a2a18" />
        <path d="M242 70 v-18" stroke="#3a2a18" strokeWidth="2" />
      </g>

      {/* Tilki + davul */}
      <g className={`rt-hayvan${a(0)}`} style={{ transformOrigin: '56px 200px' }}>
        <ellipse cx="56" cy="218" rx="22" ry="8" fill="#000" opacity="0.12" />
        <ellipse cx="56" cy="198" rx="22" ry="16" fill="#e07a38" />
        <ellipse cx="56" cy="200" rx="16" ry="11" fill="#f4a060" />
        <path d="M38 186 l-10 -16 16 6z" fill="#e07a38" />
        <path d="M74 186 l10 -16 -16 6z" fill="#e07a38" />
        <path d="M40 188 l-6 -10 10 4z" fill="#f4c090" />
        <path d="M72 188 l6 -10 -10 4z" fill="#f4c090" />
        <circle cx="48" cy="196" r="2.4" fill="#2a1a10" />
        <circle cx="64" cy="196" r="2.4" fill="#2a1a10" />
        <ellipse cx="56" cy="204" rx="5" ry="3" fill="#c45a28" />
        <ellipse cx="56" cy="222" rx="16" ry="10" fill="#c45a28" />
        <ellipse cx="56" cy="222" rx="13" ry="8" fill="#e8d2a0" />
        <circle cx="56" cy="222" r="3" fill="#8a5a28" />
        <path d="M40 214 q-10 4 -8 14" stroke="#e07a38" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M72 214 q10 4 8 14" stroke="#e07a38" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>

      {/* Civciv + zil */}
      <g className={`rt-hayvan${a(1)}`} style={{ transformOrigin: '152px 200px' }}>
        <ellipse cx="152" cy="218" rx="20" ry="7" fill="#000" opacity="0.12" />
        <ellipse cx="152" cy="200" rx="20" ry="16" fill="#f0c030" />
        <ellipse cx="152" cy="198" rx="14" ry="12" fill="#ffe066" />
        <circle cx="146" cy="196" r="2.2" fill="#2a1a10" />
        <circle cx="158" cy="196" r="2.2" fill="#2a1a10" />
        <path d="M152 200 l8 4 -8 3z" fill="#e07a20" />
        <path d="M136 188 q8 -14 18 -2" fill="#f0c030" />
        <ellipse cx="134" cy="214" rx="7" ry="5" fill="#e8b020" />
        <ellipse cx="170" cy="214" rx="7" ry="5" fill="#e8b020" />
        <circle cx="132" cy="212" r="6" fill="#f6e27a" stroke="#c88820" strokeWidth="1.4" />
        <circle cx="172" cy="212" r="6" fill="#f6e27a" stroke="#c88820" strokeWidth="1.4" />
        <path d="M146 216 l-4 10 8 0z" fill="#e07a20" />
        <path d="M158 216 l-4 10 8 0z" fill="#e07a20" />
      </g>

      {/* Ayı + tef */}
      <g className={`rt-hayvan${a(2)}`} style={{ transformOrigin: '248px 198px' }}>
        <ellipse cx="248" cy="218" rx="24" ry="8" fill="#000" opacity="0.12" />
        <circle cx="228" cy="178" r="10" fill="#8a5a38" />
        <circle cx="268" cy="178" r="10" fill="#8a5a38" />
        <circle cx="228" cy="178" r="5" fill="#d4a070" />
        <circle cx="268" cy="178" r="5" fill="#d4a070" />
        <ellipse cx="248" cy="196" rx="26" ry="20" fill="#8a5a38" />
        <ellipse cx="248" cy="200" rx="16" ry="12" fill="#d4a070" />
        <circle cx="240" cy="194" r="2.6" fill="#2a1a10" />
        <circle cx="256" cy="194" r="2.6" fill="#2a1a10" />
        <ellipse cx="248" cy="204" rx="6" ry="4" fill="#5a3820" />
        <ellipse cx="248" cy="222" rx="18" ry="10" fill="#8a5a38" />
        <circle cx="268" cy="216" r="11" fill="#e8b020" stroke="#c88820" strokeWidth="2" />
        <circle cx="268" cy="216" r="6" fill="#fff6d0" />
        <path d="M228 214 q-8 8 -2 16" stroke="#8a5a38" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>

      {/* Kurbağa + ksilofon */}
      <g className={`rt-hayvan${a(3)}`} style={{ transformOrigin: '344px 200px' }}>
        <ellipse cx="344" cy="218" rx="22" ry="8" fill="#000" opacity="0.12" />
        <ellipse cx="344" cy="200" rx="24" ry="16" fill="#3d9a4a" />
        <ellipse cx="344" cy="198" rx="16" ry="11" fill="#6bc45a" />
        <circle cx="332" cy="184" r="8" fill="#3d9a4a" />
        <circle cx="356" cy="184" r="8" fill="#3d9a4a" />
        <circle cx="332" cy="184" r="4" fill="#fff" />
        <circle cx="356" cy="184" r="4" fill="#fff" />
        <circle cx="333" cy="184" r="2" fill="#2a1a10" />
        <circle cx="357" cy="184" r="2" fill="#2a1a10" />
        <ellipse cx="344" cy="204" rx="6" ry="3" fill="#2a6a28" />
        <rect x="326" y="216" width="36" height="12" rx="2" fill="#6a4018" />
        <rect x="328" y="218" width="7" height="8" rx="1" fill="#e23d4a" />
        <rect x="336" y="218" width="7" height="8" rx="1" fill="#e8b020" />
        <rect x="344" y="218" width="7" height="8" rx="1" fill="#3d7ec9" />
        <rect x="352" y="218" width="7" height="8" rx="1" fill="#3d9a4a" />
        <path d="M322 208 q-8 6 -4 16" stroke="#3d9a4a" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M366 208 q8 6 4 16" stroke="#3d9a4a" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>

      <path d="M24 268 q8 -10 16 0" fill="#2f6a28" />
      <path d="M370 266 q8 -10 14 0" fill="#2f6a28" />
      <ellipse cx="200" cy="274" rx="18" ry="5" fill="#000" opacity="0.08" />
    </g>
  );
}
