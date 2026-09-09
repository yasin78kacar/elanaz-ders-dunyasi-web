export function SahneKus({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec8e8" />
          <stop offset="0.5" stopColor="#c5eaf6" />
          <stop offset="1" stopColor="#e8f6c0" />
        </linearGradient>
        <radialGradient id={`${uid}-gunes`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6b0" />
          <stop offset="1" stopColor="#ffd23a" />
        </radialGradient>
        <linearGradient id={`${uid}-cimen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc85a" />
          <stop offset="1" stopColor="#4e8f32" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${uid}-gok)`} />
      <circle cx="72" cy="64" r="32" fill={`url(#${uid}-gunes)`} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line key={a} x1={72 + Math.cos(r) * 38} y1={64 + Math.sin(r) * 38} x2={72 + Math.cos(r) * 48} y2={64 + Math.sin(r) * 48} stroke="#ffd23a" strokeWidth="3.2" strokeLinecap="round" />
        );
      })}
      <g className="yb-bulut">
        <ellipse cx="200" cy="56" rx="28" ry="14" fill="#fff" />
        <ellipse cx="180" cy="62" rx="18" ry="11" fill="#fff" />
        <ellipse cx="220" cy="62" rx="18" ry="11" fill="#fff" />
      </g>
      <g className="yb-bulut-2">
        <ellipse cx="330" cy="44" rx="22" ry="11" fill="#fff" opacity="0.92" />
        <ellipse cx="348" cy="48" rx="14" ry="8" fill="#fff" opacity="0.92" />
      </g>
      <path d="M-10 220 C 80 190, 180 210, 280 188 C 340 176, 400 198, 420 190 L 420 400 L -10 400 Z" fill="#9ad45a" />
      <path d="M-10 268 C 90 248, 200 278, 310 258 C 360 250, 410 270, 420 266 L 420 400 L -10 400 Z" fill={`url(#${uid}-cimen)`} />
      <g className="yb-yaprak">
        <path d="M40 300 C 20 210, 70 150, 120 148 C 170 146, 190 210, 160 290 C 140 330, 70 330, 40 300 Z" fill="#3f8f3a" />
        <path d="M70 280 C 60 210, 110 170, 150 180 C 180 190, 170 250, 130 300 Z" fill="#5aa356" className="yb-yaprak-2" />
        <path d="M88 320 v-90" stroke="#7a4e28" strokeWidth="14" strokeLinecap="round" />
      </g>
      <g>
        <ellipse cx="248" cy="248" rx="78" ry="52" fill="#3d7ec9" />
        <ellipse cx="248" cy="248" rx="62" ry="40" fill="#5a9ae0" />
        <path d="M200 230 C 160 180, 210 140, 250 168 C 270 184, 250 220, 230 236 Z" fill="#2a5f9e" className="yb-yaprak" />
        <path d="M210 220 C 190 176, 230 150, 258 176" fill="#4a88d0" />
        <ellipse cx="318" cy="228" rx="36" ry="28" fill="#2a5f9e" />
        <path d="M348 220 l28 8 -28 8z" fill="#e09a3e" />
        <circle cx="332" cy="220" r="4.2" fill="#fff" />
        <circle cx="333.2" cy="219.4" r="1.8" fill="#222" />
        <path d="M300 248 q20 16 8 28" fill="none" stroke="#2a5f9e" strokeWidth="3" />
        <path d="M170 250 C 120 270, 100 320, 148 330 C 190 338, 210 300, 200 270 Z" fill="#2a5f9e" />
        <path d="M178 270 C 150 290, 160 320, 190 318" fill="#3d7ec9" />
        <path d="M230 298 l-10 36 16 -6 8 28 14 -32z" fill="#e09a3e" />
        <path d="M258 298 l8 34 12 -8 6 22 14 -28z" fill="#c47a20" />
        <path d="M300 200 C 310 160, 340 150, 348 178 C 352 196, 328 206, 312 204 Z" fill="#f0a020" />
        <path d="M308 188 C 318 168, 338 170, 340 186" fill="#ffd23a" />
      </g>
      <g>
        <path d="M40 360 v28" stroke="#3d7a3a" strokeWidth="2.2" />
        <circle cx="40" cy="354" r="7" fill="#e23d6a" />
        <circle cx="34" cy="358" r="5" fill="#e23d6a" />
        <circle cx="46" cy="358" r="5" fill="#e23d6a" />
        <circle cx="40" cy="356" r="2.6" fill="#f6e27a" />
        <path d="M360 350 v26" stroke="#3d7a3a" strokeWidth="2.2" />
        <circle cx="360" cy="344" r="7" fill="#f0a020" />
        <circle cx="354" cy="348" r="5" fill="#f0a020" />
        <circle cx="366" cy="348" r="5" fill="#f0a020" />
        <circle cx="360" cy="346" r="2.6" fill="#f6e27a" />
        <path d="M140 372 v18" stroke="#3d7a3a" strokeWidth="2" />
        <circle cx="140" cy="368" r="6" fill="#7b5cff" />
        <circle cx="140" cy="368" r="2.2" fill="#f6e27a" />
      </g>
      <ellipse cx="200" cy="384" rx="16" ry="6" fill="#8a8a7a" />
      <path d="M20 386 q10 -12 16 0" fill="#3d7a3a" />
      <path d="M300 380 q10 -10 14 0" fill="#4a8f32" />
    </g>
  );
}
