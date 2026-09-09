import type { SahneProps } from './tipler';

function Cicek({ x, y, renk, cls }: { x: number; y: number; renk: string; cls?: string }) {
  return (
    <g className={cls} transform={`translate(${x} ${y})`}>
      <path d="M0 0 v20" stroke="#3d7a3a" strokeWidth="2.1" strokeLinecap="round" />
      <ellipse cx="-4" cy="8" rx="5" ry="2" fill="#5aa356" transform="rotate(-36)" />
      <circle cx="0" cy="-2" r="5" fill={renk} />
      <circle cx="-5" cy="1" r="4.2" fill={renk} />
      <circle cx="5" cy="1" r="4.2" fill={renk} />
      <circle cx="-3" cy="-6" r="3.8" fill={renk} />
      <circle cx="3" cy="-6" r="3.8" fill={renk} />
      <circle cx="0" cy="-1" r="2.4" fill="#f6e27a" />
    </g>
  );
}

export function SahnePark({ uid, bulunan, yeniId, onPointerDown }: SahneProps) {
  const p = (id: string) => `${bulunan.has(id) ? ' na-parla' : ''}${yeniId === id ? ' na-yeni' : ''}`;

  return (
    <svg className="na-svg" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Oyun parkı" onPointerDown={onPointerDown}>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec8e8" />
          <stop offset="0.55" stopColor="#c5eaf6" />
          <stop offset="1" stopColor="#d8f0a8" />
        </linearGradient>
        <linearGradient id={`${uid}-cimen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86c44e" />
          <stop offset="1" stopColor="#4e8f32" />
        </linearGradient>
        <filter id={`${uid}-yum`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="400" height="280" fill={`url(#${uid}-gok)`} />
      <circle cx="52" cy="40" r="22" fill="#ffe566" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={52 + Math.cos(r) * 26} y1={40 + Math.sin(r) * 26} x2={52 + Math.cos(r) * 33} y2={40 + Math.sin(r) * 33} stroke="#ffd23a" strokeWidth="2.4" strokeLinecap="round" />;
      })}
      <g className="na-bulut">
        <ellipse cx="150" cy="36" rx="22" ry="11" fill="#fff" />
        <ellipse cx="134" cy="40" rx="14" ry="9" fill="#fff" />
        <ellipse cx="166" cy="40" rx="15" ry="9" fill="#fff" />
      </g>
      <g className="na-bulut-2">
        <ellipse cx="250" cy="28" rx="18" ry="9" fill="#fff" opacity="0.92" />
        <ellipse cx="238" cy="32" rx="11" ry="7" fill="#fff" opacity="0.92" />
      </g>

      <g className={`na-kus${p('ucurtma-1')}`} transform="translate(318 48)">
        <path d="M0 -18 L16 0 L0 8 L-16 0 Z" fill="#d64545" />
        <path d="M0 -18 L16 0 L0 8 Z" fill="#e07a20" />
        <path d="M0 8 q10 10 6 22" fill="none" stroke="#5a3d1a" strokeWidth="1.5" />
        <path d="M6 18 h5 M4 24 h4" stroke="#3d7ec9" strokeWidth="1.3" />
      </g>

      <path d="M-10 148 C 70 136, 150 154, 240 142 C 320 132, 380 150, 420 140 L 420 280 L -10 280 Z" fill="#9ad45a" />
      <path d="M-10 186 C 80 172, 180 196, 280 180 C 340 172, 400 190, 420 184 L 420 280 L -10 280 Z" fill={`url(#${uid}-cimen)`} />

      <g className="na-yaprak" filter={`url(#${uid}-yum)`}>
        <path d="M8 200 C 4 140, 28 108, 58 102 C 90 96, 110 128, 104 176 C 100 206, 70 216, 36 214 Z" fill="#3f8f3a" />
        <path d="M20 188 C 16 146, 48 118, 78 122 C 104 126, 112 160, 96 192 Z" fill="#5aa356" className="na-yaprak-2" />
        <path d="M48 214 v-62" stroke="#7a4e28" strokeWidth="10" strokeLinecap="round" />
      </g>
      <g className="na-yaprak" filter={`url(#${uid}-yum)`}>
        <path d="M360 168 C 340 120, 368 88, 396 92 C 420 96, 424 140, 408 172 Z" fill="#4ea346" />
        <path d="M384 176 v-46" stroke="#7a4e28" strokeWidth="8" strokeLinecap="round" />
      </g>

      <g filter={`url(#${uid}-yum)`}>
        <rect x="128" y="118" width="10" height="72" fill="#c45c4a" />
        <path d="M138 118 L214 168 L214 178 L138 128 Z" fill="#3d7ec9" />
        <path d="M148 126 L208 168" stroke="#fff" strokeWidth="2" opacity="0.35" />
        <rect x="206" y="168" width="16" height="8" rx="2" fill="#f4d23a" />
      </g>

      <g>
        <path d="M248 188 v-70" stroke="#8a6240" strokeWidth="5" />
        <path d="M300 188 v-70" stroke="#8a6240" strokeWidth="5" />
        <path d="M244 118 h60" stroke="#8a6240" strokeWidth="5" />
        <path d="M262 122 v36" stroke="#c4a06a" strokeWidth="2" />
        <rect x="254" y="156" width="16" height="10" rx="2" fill="#d64545" />
        <path d="M286 122 v28" stroke="#c4a06a" strokeWidth="2" />
        <rect x="278" y="148" width="16" height="10" rx="2" fill="#3d7ec9" />
      </g>

      <g>
        <ellipse cx="88" cy="228" rx="32" ry="10" fill="#e8d2a0" />
        <ellipse cx="88" cy="226" rx="26" ry="7" fill="#f3e0b8" />
        <g className={p('kova-1')} transform="translate(86 222)">
          <path d="M-8 -2 h16 l-2 14 h-12z" fill="#c64545" />
          <path d="M-6 -2 q6 -8 12 0" fill="none" stroke="#8a3a2a" strokeWidth="2" />
          <circle cx="0" cy="4" r="1.4" fill="#f6e27a" />
        </g>
      </g>

      <g>
        <rect x="318" y="186" width="44" height="8" rx="2" fill="#8a6240" />
        <rect x="322" y="168" width="8" height="20" fill="#6a4a30" />
        <rect x="350" y="168" width="8" height="20" fill="#6a4a30" />
      </g>

      <path d="M0 214 h400" stroke="#8a6240" strokeWidth="3" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M${8 + i * 29} 200 v14`} stroke="#8a6240" strokeWidth="2.4" />
      ))}

      <path d="M190 200 C 200 220, 210 240, 220 280 L 160 280 C 170 240, 180 214, 190 200 Z" fill="#d2b48a" opacity="0.75" />
      <g>
        <rect x="232" y="248" width="10" height="10" fill="#fff" opacity="0.35" />
        <rect x="242" y="248" width="10" height="10" fill="#c64545" opacity="0.35" />
        <rect x="252" y="248" width="10" height="10" fill="#fff" opacity="0.35" />
        <rect x="242" y="258" width="10" height="10" fill="#fff" opacity="0.35" />
      </g>

      <g>
        <rect x="300" y="230" width="54" height="6" rx="2" fill="#8a6240" transform="rotate(-12 327 233)" />
        <circle cx="308" cy="238" r="6" fill="#c45c4a" />
        <circle cx="348" cy="228" r="6" fill="#3d7ec9" />
      </g>

      <g className={p('top-1')} transform="translate(214 232)">
        <circle r="11" fill="#f4d23a" />
        <path d="M0 -11 v22 M-11 0 h22" stroke="#e09a20" strokeWidth="1.5" />
        <path d="M-7 -7 q7 4 14 0" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.5" />
      </g>

      <g className={`na-kelebek${p('kelebek-1')}`} transform="translate(118 132)">
        <ellipse cx="-8" cy="-2" rx="8" ry="10" fill="#7b5cff" />
        <ellipse cx="8" cy="-2" rx="8" ry="10" fill="#9b7cff" />
        <ellipse cx="-7" cy="8" rx="5" ry="6" fill="#f0a020" />
        <ellipse cx="7" cy="8" rx="5" ry="6" fill="#f0a020" />
        <path d="M0 -10 v22" stroke="#333" strokeWidth="1.8" />
        <circle cx="0" cy="-11" r="1.6" fill="#333" />
      </g>

      <Cicek x={36} y={248} renk="#e23d6a" cls={p('cicek-1')} />
      <Cicek x={168} y={252} renk="#e23d6a" cls={p('cicek-2')} />
      <Cicek x={352} y={236} renk="#e23d6a" cls={p('cicek-3')} />
      <Cicek x={128} y={258} renk="#f0a020" />
      <Cicek x={280} y={252} renk="#7b5cff" />
      <Cicek x={60} y={262} renk="#f0a020" />

      <g className="na-kus" transform="translate(200 58)">
        <ellipse cx="0" cy="2" rx="7" ry="4" fill="#4a5568" />
        <ellipse cx="6" cy="0" rx="4" ry="2.8" fill="#2d3748" />
      </g>
      <ellipse cx="150" cy="268" rx="12" ry="5" fill="#8a8a7a" />
      <ellipse cx="370" cy="262" rx="10" ry="4" fill="#7e7e70" />
      <path d="M20 268 q8 -10 14 0" fill="#3d7a3a" />
      <path d="M240 264 q8 -9 14 0" fill="#4a8f32" />
      <circle cx="190" cy="108" r="7" fill="#ef9f27" opacity="0.85" />
      <path d="M190 115 v18" stroke="#8a6240" strokeWidth="1.3" />
    </svg>
  );
}
