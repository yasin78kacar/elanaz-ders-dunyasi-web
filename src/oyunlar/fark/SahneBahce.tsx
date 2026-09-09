import { FarkIsaretleri } from './FarkIsaretleri';
import { SAHNELER } from './sahneler';
import type { SahneProps } from './tipler';

const FARKLAR = SAHNELER[0].farklar;

function Kus({ x, y }: { x: number; y: number }) {
  return (
    <g className="fb-kus-uc" transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="11" ry="6.5" fill="#3d7ec9" />
      <ellipse cx="9" cy="0" rx="6.5" ry="4.4" fill="#2a5f9e" />
      <path d="M14 -1.2 l7 2.2 -7 2z" fill="#e09a3e" />
      <circle cx="11" cy="-0.8" r="1.1" fill="#fff" />
      <circle cx="11.4" cy="-0.8" r="0.45" fill="#222" />
      <path d="M-5 1 q-11 -8 -8 -16" fill="none" stroke="#3d7ec9" strokeWidth="2" />
      <path d="M-3 3 q-9 -2 -12 6" fill="none" stroke="#3d7ec9" strokeWidth="1.8" />
      <path d="M-2 6 l-2 5 M2 6 l1 5" stroke="#2d3748" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Cicek({ x, y, renk }: { x: number; y: number; renk: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 v22" stroke="#3d7a3a" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M0 12 q-8 2 -10 8" fill="none" stroke="#4a8f46" strokeWidth="1.6" />
      <ellipse cx="-4" cy="8" rx="5" ry="2.2" fill="#5aa356" transform="rotate(-40)" />
      <circle cx="0" cy="-2" r="5.2" fill={renk} />
      <circle cx="-5" cy="1" r="4.4" fill={renk} />
      <circle cx="5" cy="1" r="4.4" fill={renk} />
      <circle cx="-3" cy="-6" r="4" fill={renk} />
      <circle cx="3" cy="-6" r="4" fill={renk} />
      <circle cx="0" cy="-1" r="2.6" fill="#f6e27a" />
    </g>
  );
}

export function SahneBahce({ uid, bulunan, yeniId, asil, onPointerDown }: SahneProps & { asil: boolean }) {
  const ok = (id: string) => asil || bulunan.has(id);
  const yeni = (id: string) => (yeniId === id ? ' fb-yeni' : '');

  return (
    <svg className="fb-svg" viewBox="0 0 400 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bahçe evi sahnesi" onPointerDown={onPointerDown}>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec8e8" />
          <stop offset="0.55" stopColor="#c5eaf6" />
          <stop offset="1" stopColor="#e7f6c9" />
        </linearGradient>
        <linearGradient id={`${uid}-cimen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fbe4a" />
          <stop offset="1" stopColor="#4e8f32" />
        </linearGradient>
        <radialGradient id={`${uid}-gunes`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6b0" />
          <stop offset="1" stopColor={ok('gunes') ? '#ffd23a' : '#ff7a2e'} />
        </radialGradient>
        <filter id={`${uid}-yum`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="400" height="270" fill={`url(#${uid}-gok)`} />

      <g className={yeni('gunes')}>
        <circle cx="348" cy="44" r="26" fill={`url(#${uid}-gunes)`} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={348 + Math.cos(r) * 30}
              y1={44 + Math.sin(r) * 30}
              x2={348 + Math.cos(r) * 38}
              y2={44 + Math.sin(r) * 38}
              stroke={ok('gunes') ? '#ffd23a' : '#ff7a2e'}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        {ok('gunes') && (
          <g>
            <circle cx="341" cy="40" r="2.2" fill="#5a3d1a" />
            <circle cx="355" cy="40" r="2.2" fill="#5a3d1a" />
            <path d="M340 50 q8 6 16 0" fill="none" stroke="#5a3d1a" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}
      </g>

      <g className="fb-bulut">
        <ellipse cx="86" cy="48" rx="22" ry="12" fill="#fff" />
        <ellipse cx="70" cy="52" rx="16" ry="10" fill="#fff" />
        <ellipse cx="102" cy="52" rx="18" ry="11" fill="#fff" />
        <ellipse cx="88" cy="42" rx="12" ry="8" fill="#f4fbff" />
      </g>
      <g className="fb-bulut-2">
        <ellipse cx="210" cy="36" rx="20" ry="10" fill="#fff" opacity="0.92" />
        <ellipse cx="196" cy="40" rx="12" ry="8" fill="#fff" opacity="0.92" />
        <ellipse cx="224" cy="40" rx="13" ry="8" fill="#fff" opacity="0.92" />
      </g>

      <path d="M-10 168 C 80 140, 160 156, 250 148 C 320 142, 380 158, 420 150 L 420 270 L -10 270 Z" fill="#8fc85a" />
      <path d="M-10 196 C 90 176, 180 200, 280 186 C 340 178, 400 196, 420 190 L 420 270 L -10 270 Z" fill={`url(#${uid}-cimen)`} />

      <g filter={`url(#${uid}-yum)`}>
        <path d="M48 210 C 52 150, 70 118, 92 108 C 118 96, 142 118, 148 168 C 150 196, 130 214, 92 220 C 60 224, 46 218, 48 210 Z" fill="#3f8f3a" className="fb-yaprak" />
        <path d="M70 200 C 62 150, 88 112, 118 108 C 148 104, 164 140, 156 188 C 150 214, 118 222, 90 216 C 74 212, 72 206, 70 200 Z" fill="#4ea346" className="fb-yaprak fb-yaprak-2" />
        <path d="M58 188 C 50 150, 78 128, 102 130 C 128 132, 136 162, 124 190 C 114 208, 80 210, 64 198 Z" fill="#67b85a" className="fb-yaprak" />
        <path d="M86 220 v-64" stroke="#7a4e28" strokeWidth="11" strokeLinecap="round" />
        <path d="M86 176 q-22 -18 -28 -36" fill="none" stroke="#8a5a30" strokeWidth="5" strokeLinecap="round" />
        <path d="M88 168 q18 -12 26 -30" fill="none" stroke="#8a5a30" strokeWidth="4" strokeLinecap="round" />
        <path d="M84 190 l-3 18 M90 198 l2 12" stroke="#5c3a1a" strokeWidth="1.2" opacity="0.45" />
        <ellipse cx="78" cy="148" rx="5" ry="6" fill="#2d5a22" opacity="0.35" />
        <g className={yeni('elma')}>
          <circle cx="78" cy="118" r={ok('elma') ? 7 : 11} fill="#d64545" />
          <path d="M78 112 v-5" stroke="#3d7a3a" strokeWidth="1.4" />
          {ok('elma') && (
            <>
              <circle cx="104" cy="128" r="6.2" fill="#c83a3a" />
              <path d="M104 123 v-4" stroke="#3d7a3a" strokeWidth="1.3" />
              <circle cx="68" cy="136" r="5.6" fill="#e05555" />
              <path d="M68 131 v-4" stroke="#3d7a3a" strokeWidth="1.2" />
            </>
          )}
        </g>
      </g>

      <g filter={`url(#${uid}-yum)`}>
        <ellipse cx="250" cy="214" rx="54" ry="8" fill="#3d6b28" opacity="0.28" />
        <path d="M208 136 h86 v78 h-86z" fill="#f3e0b8" />
        <path d="M262 136 h32 v78 h-32z" fill="#e6d0a0" />
        <path d="M208 156 h86" stroke="#d2b88a" strokeWidth="3" />
        <path d="M208 182 h86" stroke="#d2b88a" strokeWidth="2" />
        <path d="M196 136 L251 80 L306 136 Z" fill="#c24b3c" />
        <path d="M251 80 L306 136 L280 136 Z" fill="#a83c30" />
        <path d="M192 136 h118" stroke="#8b3228" strokeWidth="5" strokeLinecap="round" />
        <rect x="270" y="88" width="16" height="30" fill="#b08960" />
        <rect x="266" y="82" width="24" height="8" rx="1" fill="#8a6240" />
        <rect x="216" y="144" width="20" height="20" fill="#9fd4f0" />
        <path d="M226 144 v20 M216 154 h20" stroke="#fff" strokeWidth="1.5" />
        <rect x="214" y="142" width="24" height="24" fill="none" stroke="#8a6240" strokeWidth="2.2" />
        <rect x="214" y="164" width="24" height="3.5" fill="#8a6240" />
        <rect x="266" y="144" width="20" height="20" fill="#9fd4f0" />
        <path d="M276 144 v20 M266 154 h20" stroke="#fff" strokeWidth="1.5" />
        <rect x="264" y="142" width="24" height="24" fill="none" stroke="#8a6240" strokeWidth="2.2" />
        <rect x="264" y="164" width="24" height="3.5" fill="#8a6240" />
        <g className={yeni('kapi')}>
          <path d="M236 170 h26 v44 h-26z" fill={ok('kapi') ? '#c64545' : '#2f8fbf'} />
          <path d="M236 170 h26 v8 h-26z" fill="#000" opacity="0.12" />
          <circle cx="257" cy="194" r="2.4" fill="#f4d35e" />
          <rect x="242" y="180" width="8" height="10" rx="1" fill="#fff" opacity="0.25" />
        </g>
        <rect x="232" y="212" width="34" height="5" fill="#c4b08a" />
        <rect x="226" y="216" width="46" height="5" fill="#b49c78" />
        <g className={yeni('kus')}>{ok('kus') && <Kus x={250} y={72} />}</g>
      </g>

      <path d="M248 221 C 230 232, 190 248, 170 270 L 330 270 C 310 248, 270 230, 252 221 Z" fill="#d2b48a" opacity="0.7" />
      <path d="M248 221 C 236 234, 210 250, 200 270" fill="none" stroke="#c4a574" strokeWidth="3" />

      <g>
        <ellipse cx="160" cy="248" rx="14" ry="7" fill="#8a8a7a" />
        <ellipse cx="168" cy="246" rx="8" ry="5" fill="#9a9a88" />
        <ellipse cx="340" cy="242" rx="12" ry="6" fill="#7e7e70" />
        <ellipse cx="348" cy="240" rx="6" ry="4" fill="#909080" />
      </g>

      <g className={yeni('cicek')}>
        {ok('cicek') && <Cicek x={46} y={226} renk="#e23d6a" />}
      </g>
      <Cicek x={118} y={232} renk="#f0a020" />
      <Cicek x={366} y={226} renk="#7b5cff" />

      <path d="M20 256 q8 -10 16 0 q8 8 0 4 q-6 2 -16 -4z" fill="#4a8f32" />
      <path d="M300 250 q10 -12 18 0 q6 8 -2 4 q-8 2 -16 -4z" fill="#3f7f2c" />
      <path d="M200 258 q6 -8 12 0" fill="none" stroke="#3d7a3a" strokeWidth="2" />

      <FarkIsaretleri farklar={FARKLAR} bulunan={bulunan} />
    </svg>
  );
}
