import type { SahneProps } from './tipler';

function Pencere({ x, y, yanik }: { x: number; y: number; yanik?: boolean }) {
  return <rect x={x} y={y} width="10" height="12" fill={yanik ? '#f6e27a' : '#8ec4e8'} stroke="#4a3220" strokeWidth="1" />;
}

export function SahneSehir({ uid, bulunan, yeniId, onPointerDown }: SahneProps) {
  const p = (id: string) => `${bulunan.has(id) ? ' na-parla' : ''}${yeniId === id ? ' na-yeni' : ''}`;

  return (
    <svg className="na-svg" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Şehir sokağı" onPointerDown={onPointerDown}>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7eb6e0" />
          <stop offset="1" stopColor="#d6eef8" />
        </linearGradient>
        <linearGradient id={`${uid}-yol`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a6a70" />
          <stop offset="1" stopColor="#4a4a50" />
        </linearGradient>
        <filter id={`${uid}-yum`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="400" height="280" fill={`url(#${uid}-gok)`} />
      <g className="na-bulut">
        <ellipse cx="70" cy="30" rx="20" ry="9" fill="#fff" />
        <ellipse cx="56" cy="34" rx="12" ry="7" fill="#fff" />
      </g>
      <g className="na-bulut-2">
        <ellipse cx="220" cy="24" rx="18" ry="8" fill="#fff" opacity="0.9" />
        <ellipse cx="234" cy="28" rx="11" ry="6" fill="#fff" opacity="0.9" />
      </g>

      <path d="M0 70 h400" stroke="#4a4a50" strokeWidth="2" />
      <g className={`na-kus${p('guv-1')}`} transform="translate(88 64)">
        <ellipse cx="0" cy="2" rx="7" ry="4" fill="#9aa3b0" />
        <ellipse cx="6" cy="0" rx="4" ry="2.6" fill="#7a8490" />
        <circle cx="8" cy="-0.4" r="0.7" fill="#222" />
      </g>
      <ellipse cx="120" cy="66" rx="5" ry="3" fill="#9aa3b0" />
      <ellipse cx="200" cy="62" rx="5" ry="3" fill="#8a93a0" />

      <g filter={`url(#${uid}-yum)`}>
        <rect x="8" y="78" width="70" height="108" fill="#c4b08a" />
        <rect x="8" y="70" width="70" height="10" fill="#8a3a2a" />
        <Pencere x={16} y={90} />
        <Pencere x={36} y={90} yanik />
        <Pencere x={56} y={90} />
        <Pencere x={16} y={116} />
        <Pencere x={36} y={116} />
        <Pencere x={56} y={116} yanik />
        <rect x="28" y="148" width="22" height="38" fill="#5a3220" />
      </g>

      <g filter={`url(#${uid}-yum)`}>
        <rect x="86" y="96" width="90" height="90" fill="#e8c36a" />
        <rect x="86" y="88" width="90" height="10" fill="#c45c4a" />
        <path d="M86 128 h90" fill="#d64545" />
        <path d="M86 124 h90 v10 h-90z" fill="#c64545" />
        <text x="108" y="118" fontSize="9" fontWeight="700" fill="#6a2010">KAFE</text>
        <Pencere x={98} y={138} />
        <Pencere x={122} y={138} />
        <rect x="148" y="146" width="18" height="40" fill="#5a3220" />
      </g>

      <g filter={`url(#${uid}-yum)`}>
        <rect x="186" y="58" width="80" height="128" fill="#8aa0b8" />
        <rect x="186" y="50" width="80" height="10" fill="#3a4a5a" />
        <Pencere x={198} y={70} yanik />
        <Pencere x={222} y={70} />
        <Pencere x={246} y={70} />
        <Pencere x={198} y={96} />
        <g className={p('kedi-1')} transform="translate(252 104)">
          <rect x="-10" y="-12" width="14" height="16" fill="#8ec4e8" stroke="#4a3220" strokeWidth="1" />
          <ellipse cx="-3" cy="2" rx="6" ry="4" fill="#c4a06a" />
          <path d="M-7 0 l-1 -6 3 4z M0 0 l2 -6 2 4z" fill="#c4a06a" />
          <circle cx="-5" cy="1" r="0.7" fill="#222" />
        </g>
        <Pencere x={246} y={96} />
        <Pencere x={198} y={122} yanik />
        <Pencere x={222} y={122} />
        <Pencere x={246} y={122} />
        <rect x="214" y="150" width="20" height="36" fill="#3a2a20" />
      </g>

      <g filter={`url(#${uid}-yum)`}>
        <rect x="276" y="84" width="116" height="102" fill="#d4b896" />
        <rect x="276" y="76" width="116" height="10" fill="#6a4030" />
        <Pencere x={288} y={98} />
        <Pencere x={312} y={98} yanik />
        <Pencere x={336} y={98} />
        <Pencere x={360} y={98} />
        <Pencere x={288} y={124} />
        <Pencere x={312} y={124} />
        <rect x="336" y="148" width="24" height="38" fill="#5a3220" />
      </g>

      <g className={p('bal-1')} transform="translate(352 78)">
        <ellipse cx="0" cy="0" rx="7" ry="9" fill="#c64545" />
        <path d="M0 9 q3 6 0 14" fill="none" stroke="#8a3a2a" strokeWidth="1.3" />
        <path d="M-2 -4 q3 -2 4 0" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
      </g>

      <rect x="0" y="186" width="400" height="14" fill="#8a8a90" />
      <rect x="0" y="200" width="400" height="80" fill={`url(#${uid}-yol)`} />
      <path d="M20 236 h24 M60 236 h24 M100 236 h24 M140 236 h24 M180 236 h24 M220 236 h24 M260 236 h24 M300 236 h24 M340 236 h24 M380 236 h24" stroke="#f4d23a" strokeWidth="4" strokeDasharray="16 14" />

      <g>
        <rect x="18" y="148" width="6" height="40" fill="#4a4a50" />
        <circle cx="21" cy="144" r="8" fill="#f6e27a" opacity="0.7" />
        <circle cx="21" cy="144" r="4" fill="#fff6b0" />
      </g>
      <g>
        <rect x="380" y="150" width="6" height="38" fill="#4a4a50" />
        <circle cx="383" cy="146" r="7" fill="#f6e27a" opacity="0.55" />
      </g>

      <g>
        <rect x="300" y="188" width="52" height="22" rx="4" fill="#3d7ec9" />
        <rect x="308" y="180" width="28" height="12" rx="3" fill="#8ec4e8" />
        <circle cx="312" cy="210" r="6" fill="#222" />
        <circle cx="340" cy="210" r="6" fill="#222" />
      </g>
      <g>
        <rect x="230" y="192" width="48" height="20" rx="3" fill="#c45c4a" />
        <circle cx="242" cy="212" r="5.5" fill="#222" />
        <circle cx="266" cy="212" r="5.5" fill="#222" />
      </g>

      <g>
        <circle cx="20" cy="210" r="7" fill="#c64545" />
        <rect x="18" y="210" width="4" height="12" fill="#c64545" />
      </g>

      <g>
        <rect x="8" y="200" width="28" height="36" fill="#8a5a30" />
        <path d="M6 200 h32 v6 h-32z" fill="#6a4030" />
        <circle cx="14" cy="214" r="3" fill="#f0a020" />
        <circle cx="30" cy="220" r="3" fill="#c64545" />
        <g className={p('kop-1')} transform="translate(48 228)">
          <ellipse cx="0" cy="4" rx="14" ry="7" fill="#8a6240" />
          <path d="M-12 2 l-6 -8 8 6z" fill="#8a6240" />
          <ellipse cx="10" cy="2" rx="6" ry="4" fill="#6a4a30" />
          <circle cx="12" cy="1" r="0.9" fill="#222" />
          <path d="M-8 8 v6 M4 8 v6" stroke="#5a3a22" strokeWidth="1.6" />
        </g>
      </g>

      <g className={p('sem-1')} transform="translate(148 168)">
        <path d="M-18 6 q18 -22 36 0" fill="#f4d23a" />
        <path d="M-14 4 q8 -4 14 0 q6 4 14 0" fill="none" stroke="#e09a20" strokeWidth="1.2" />
        <path d="M0 6 v22" stroke="#8a6240" strokeWidth="2" />
        <circle cx="0" cy="28" r="2.4" fill="#c4a06a" />
        <path d="M-4 30 h8 v10 h-8z" fill="#3d7ec9" />
      </g>

      <g>
        <rect x="186" y="198" width="22" height="6" fill="#8a6240" />
        <rect x="188" y="186" width="5" height="12" fill="#6a4a30" />
        <rect x="201" y="186" width="5" height="12" fill="#6a4a30" />
        <g className={p('can-1')} transform="translate(198 208)">
          <path d="M-7 -2 h14 v12 h-14z" fill="#3d7ec9" />
          <path d="M-7 -2 q7 -8 14 0" fill="#2a5f9e" />
        </g>
      </g>

      <g className={`na-kus${p('guv-2')}`} transform="translate(312 198)">
        <ellipse cx="0" cy="2" rx="7" ry="4" fill="#9aa3b0" />
        <ellipse cx="6" cy="0" rx="4" ry="2.6" fill="#7a8490" />
        <path d="M9 0 l3 1 -3 1z" fill="#e09a3e" />
      </g>

      <g>
        <circle cx="120" cy="188" r="7" fill="#f4d23a" />
        <rect x="117" y="188" width="6" height="16" fill="#4a4a50" />
        <circle cx="120" cy="184" r="3" fill="#4ea346" />
      </g>
      <path d="M70 268 q8 -8 14 0" fill="#3d7a3a" />
      <ellipse cx="160" cy="268" rx="10" ry="4" fill="#5a5a4a" />
    </svg>
  );
}
