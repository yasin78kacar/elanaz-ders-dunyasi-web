import type { SahneProps } from './tipler';

function Cam({ x, y, h, cls }: { x: number; y: number; h: number; cls?: string }) {
  return (
    <g className={cls} transform={`translate(${x} ${y})`}>
      <path d={`M0 ${h * 0.18} C ${-h * 0.24} ${h * 0.32}, ${-h * 0.3} ${h * 0.58}, ${-h * 0.16} ${h * 0.72} C ${-h * 0.32} ${h * 0.8}, ${-h * 0.14} ${h * 0.94}, 0 ${h * 0.9} C ${h * 0.14} ${h * 0.94}, ${h * 0.32} ${h * 0.8}, ${h * 0.16} ${h * 0.72} C ${h * 0.3} ${h * 0.58}, ${h * 0.24} ${h * 0.32}, 0 ${h * 0.18} Z`} fill="#1f5c3a" />
      <path d={`M0 ${h * 0.26} C ${-h * 0.14} ${h * 0.4}, ${-h * 0.16} ${h * 0.58}, ${-h * 0.04} ${h * 0.64} C 0 ${h * 0.72}, ${h * 0.1} ${h * 0.6}, ${h * 0.08} ${h * 0.46} C ${h * 0.14} ${h * 0.36}, ${h * 0.08} ${h * 0.28}, 0 ${h * 0.26} Z`} fill="#2a7348" />
      <rect x="-3" y={h * 0.78} width="6" height={h * 0.22} rx="1" fill="#5a3a22" />
    </g>
  );
}

function Mantar({ x, y, kirmizi, cls }: { x: number; y: number; kirmizi: boolean; cls?: string }) {
  return (
    <g className={cls} transform={`translate(${x} ${y})`}>
      <path d="M-12 0 q12 -16 24 0" fill={kirmizi ? '#c64545' : '#8a6240'} />
      <rect x="-3.4" y="0" width="6.8" height="10" rx="1" fill="#f0e0c0" />
      {kirmizi && <><circle cx="-4" cy="-4" r="1.8" fill="#fff" /><circle cx="5" cy="-3" r="1.4" fill="#fff" /></>}
    </g>
  );
}

export function SahneOrman({ uid, bulunan, yeniId, onPointerDown }: SahneProps) {
  const p = (id: string) => `${bulunan.has(id) ? ' na-parla' : ''}${yeniId === id ? ' na-yeni' : ''}`;

  return (
    <svg className="na-svg" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sık orman" onPointerDown={onPointerDown}>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a3a4a" />
          <stop offset="0.45" stopColor="#3d6b4a" />
          <stop offset="1" stopColor="#6a9a48" />
        </linearGradient>
        <linearGradient id={`${uid}-su`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a7a8a" />
          <stop offset="1" stopColor="#2a5a6a" />
        </linearGradient>
        <filter id={`${uid}-yum`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect width="400" height="280" fill={`url(#${uid}-gok)`} />
      <g className="na-bulut">
        <ellipse cx="80" cy="28" rx="28" ry="10" fill="#d8e8d0" opacity="0.35" />
        <ellipse cx="300" cy="22" rx="24" ry="8" fill="#d8e8d0" opacity="0.3" />
      </g>

      <Cam x={28} y={40} h={150} cls="na-yaprak" />
      <Cam x={70} y={20} h={170} cls="na-yaprak-2" />
      <Cam x={130} y={36} h={140} cls="na-yaprak" />
      <Cam x={210} y={16} h={168} cls="na-yaprak-2" />
      <Cam x={300} y={30} h={150} cls="na-yaprak" />
      <Cam x={370} y={24} h={160} cls="na-yaprak-2" />
      <Cam x={170} y={70} h={110} />
      <Cam x={250} y={64} h={100} />

      <path d="M-10 168 C 90 150, 180 176, 280 158 C 340 148, 400 168, 420 160 L 420 280 L -10 280 Z" fill="#3d6b32" />
      <path d="M-10 198 C 100 184, 200 210, 310 192 C 360 184, 400 200, 420 196 L 420 280 L -10 280 Z" fill="#4a7a38" />

      <g filter={`url(#${uid}-yum)`}>
        <path d="M52 200 C 48 140, 62 110, 76 108 C 92 106, 100 140, 96 188 C 94 208, 70 214, 54 206 Z" fill="#5a3a22" />
        <path d="M62 160 l-4 20 M78 150 l3 16" stroke="#3a2414" strokeWidth="1.3" opacity="0.45" />
        <ellipse cx="74" cy="118" rx="11" ry="13" fill="#1a1410" />
        <g className={p('baykus-1')} transform="translate(72 118)">
          <ellipse cx="0" cy="2" rx="8" ry="9" fill="#7a5a38" />
          <circle cx="-3" cy="0" r="2.8" fill="#f6e27a" />
          <circle cx="3" cy="0" r="2.8" fill="#f6e27a" />
          <circle cx="-3" cy="0" r="1.1" fill="#222" />
          <circle cx="3" cy="0" r="1.1" fill="#222" />
          <path d="M-1 4 l1 3 1 -3z" fill="#e09a3e" />
        </g>
      </g>

      <path d="M220 176 C 250 186, 300 178, 360 190 C 330 204, 270 198, 230 206 C 210 192, 214 180, 220 176 Z" fill={`url(#${uid}-su)`} />
      <path d="M230 186 q20 4 40 0 t40 0 t40 0" fill="none" stroke="#8ec4c8" strokeWidth="1.6" opacity="0.4" />

      <g>
        <path d="M130 220 h60" stroke="#5a3a22" strokeWidth="9" strokeLinecap="round" />
        <path d="M136 216 q10 -4 20 0" fill="none" stroke="#3a2414" strokeWidth="1.2" />
        <g className={p('sal-1')} transform="translate(158 228)">
          <ellipse cx="6" cy="0" rx="8" ry="6" fill="#d4a060" />
          <path d="M6 0 q4 0 4 3" fill="none" stroke="#8a6240" strokeWidth="1.3" />
          <path d="M-2 2 q-8 2 -10 -6" fill="none" stroke="#c4b08a" strokeWidth="2" />
          <circle cx="-10" cy="-5" r="1.1" fill="#333" />
        </g>
      </g>

      <Mantar x={48} y={232} kirmizi cls={p('mantar-1')} />
      <Mantar x={248} y={246} kirmizi cls={p('mantar-2')} />
      <Mantar x={110} y={250} kirmizi={false} />
      <Mantar x={200} y={238} kirmizi={false} />
      <Mantar x={360} y={240} kirmizi={false} />

      <g className={`na-kus${p('kus-1')}`} transform="translate(196 86)">
        <ellipse cx="0" cy="2" rx="8" ry="5" fill="#3d7ec9" />
        <ellipse cx="7" cy="0" rx="5" ry="3.4" fill="#2a5f9e" />
        <path d="M11 -1 l5 1.6 -5 1.4z" fill="#e09a3e" />
        <circle cx="8.4" cy="-0.8" r="0.9" fill="#fff" />
      </g>

      <g className={p('kur-1')} transform="translate(292 188)">
        <ellipse cx="0" cy="4" rx="10" ry="6" fill="#4ea346" />
        <circle cx="-5" cy="-1" r="3.4" fill="#67b85a" />
        <circle cx="-5" cy="-1" r="1.2" fill="#222" />
        <path d="M8 6 q6 4 2 8" fill="none" stroke="#3d7a3a" strokeWidth="1.8" />
      </g>

      <g>
        <path d="M300 250 C 310 210, 350 200, 390 214 C 400 230, 380 250, 340 256 C 316 258, 300 252, 300 250 Z" fill="#2e6b32" />
        <path d="M320 236 q16 -10 28 4" fill="#3d7a3a" className="na-yaprak" />
        <g className={p('tilki-1')} transform="translate(328 214)">
          <ellipse cx="6" cy="8" rx="16" ry="8" fill="#e07a20" />
          <path d="M-10 4 l6 -12 6 10z" fill="#e07a20" />
          <path d="M-8 -2 l3 6" fill="#f4d2a8" />
          <ellipse cx="16" cy="6" rx="6" ry="4" fill="#e07a20" />
          <circle cx="18" cy="5" r="1" fill="#222" />
          <path d="M20 6 l6 1 -6 1z" fill="#333" />
          <ellipse cx="-8" cy="10" rx="5" ry="3" fill="#f4d2a8" />
        </g>
      </g>

      <path d="M16 258 q10 -14 8 2 q8 -10 6 2" fill="#2e6b32" className="na-yaprak" />
      <path d="M180 262 q12 -12 10 2" fill="#3d7a3a" />
      <ellipse cx="90" cy="262" rx="14" ry="6" fill="#6a6a58" />
      <ellipse cx="380" cy="256" rx="12" ry="5" fill="#5a5a4a" />
      <circle cx="40" cy="50" r="1.4" fill="#f6e27a" opacity="0.7" />
      <circle cx="160" cy="40" r="1.2" fill="#f6e27a" opacity="0.55" />
      <circle cx="340" cy="56" r="1.3" fill="#f6e27a" opacity="0.6" />
      <g className="na-kelebek" transform="translate(120 160)">
        <ellipse cx="-4" cy="0" rx="4" ry="5" fill="#e23d6a" />
        <ellipse cx="4" cy="0" rx="4" ry="5" fill="#e23d6a" />
      </g>
    </svg>
  );
}
