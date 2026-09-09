import { FarkIsaretleri } from './FarkIsaretleri';
import { SAHNELER } from './sahneler';
import type { SahneProps } from './tipler';

const FARKLAR = SAHNELER[2].farklar;

function CamKar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 18 C -14 28, -22 48, -18 62 C -28 70, -26 88, -8 92 C -4 102, 4 102, 8 92 C 26 88, 28 70, 18 62 C 22 48, 14 28, 0 18 Z" fill="#1a4a32" />
      <path d="M0 22 C -10 32, -16 48, -12 58 C -18 64, -14 78, -2 80 C 2 88, 8 80, 12 70 C 18 64, 12 48, 0 22 Z" fill="#246044" />
      <path d="M0 26 C -7 34, -8 46, -4 52 C 0 58, 6 52, 8 42 C 6 34, 3 28, 0 26 Z" fill="#2e7a54" />
      <rect x="-3.2" y="88" width="6.4" height="20" rx="1" fill="#4a3220" />
      <path d="M-2 90 v14 M2 92 v10" stroke="#3a2414" strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="-10" cy="58" rx="8" ry="4" fill="#eef4ff" />
      <ellipse cx="9" cy="64" rx="7" ry="3.4" fill="#eef4ff" />
      <ellipse cx="0" cy="36" rx="7" ry="3.2" fill="#f7fbff" />
      <ellipse cx="-6" cy="78" rx="6" ry="2.8" fill="#e8eef8" />
    </g>
  );
}

function Kus({ x, y }: { x: number; y: number }) {
  return (
    <g className="fb-kus-uc" transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="1.4" rx="8.5" ry="5" fill="#2c3344" />
      <ellipse cx="7" cy="-1" rx="5" ry="3.2" fill="#1b2030" />
      <path d="M11 -1.6 l5 1.5 -5 1.4z" fill="#e09a3e" />
      <circle cx="8.2" cy="-2" r="0.85" fill="#fff" />
    </g>
  );
}

export function SahneKis({ uid, bulunan, yeniId, asil, onPointerDown }: SahneProps & { asil: boolean }) {
  const ok = (id: string) => asil || bulunan.has(id);
  const yeni = (id: string) => (yeniId === id ? ' fb-yeni' : '');
  const kus = ok('kus') ? { x: 78, y: 92 } : { x: 108, y: 104 };

  return (
    <svg className="fb-svg" viewBox="0 0 400 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kış köyü sahnesi" onPointerDown={onPointerDown}>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2744" />
          <stop offset="0.55" stopColor="#3a4a72" />
          <stop offset="1" stopColor="#8aa0c8" />
        </linearGradient>
        <linearGradient id={`${uid}-kar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7ff" />
          <stop offset="1" stopColor="#d5e0f0" />
        </linearGradient>
        <filter id={`${uid}-yum`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect width="400" height="270" fill={`url(#${uid}-gok)`} />
      <circle cx="330" cy="42" r="22" fill="#f4f0d8" />
      <circle cx="338" cy="38" r="22" fill="#1a2744" />

      {[
        [30, 22], [70, 40], [120, 16], [168, 34], [220, 20], [260, 44],
        [300, 18], [360, 56], [50, 60], [200, 50], [380, 30],
      ].map(([x, y], i) => (
        <circle key={i} className="fb-kar" cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} fill="#fff" opacity="0.85" />
      ))}

      <path d="M-10 168 C 80 148, 170 176, 260 156 C 330 142, 380 166, 420 158 L 420 270 L -10 270 Z" fill="#c5d4e8" />
      <path d="M-10 198 C 100 184, 190 210, 290 192 C 350 182, 400 200, 420 196 L 420 270 L -10 270 Z" fill={`url(#${uid}-kar)`} />

      <CamKar x={62} y={86} />
      <CamKar x={372} y={100} />

      <g className={yeni('kus')}>
        <Kus x={kus.x} y={kus.y} />
      </g>

      <g filter={`url(#${uid}-yum)`}>
        <ellipse cx="288" cy="206" rx="50" ry="7" fill="#b8c8dc" opacity="0.55" />
        <path d="M246 198 h84 v-70 h-84z" fill="#c49a72" />
        <path d="M288 128 v70" stroke="#a87850" strokeWidth="2" opacity="0.35" />
        <path d="M246 150 h84 M246 172 h84" stroke="#a87850" strokeWidth="1.4" opacity="0.3" />
        <path d="M246 128 L288 84 L330 128 Z" fill="#7a3a32" />
        <path d="M246 128 L288 84 L330 128 Z" fill="#fff" opacity="0.42" />
        <path d="M240 128 h96" stroke="#f7fbff" strokeWidth="7" strokeLinecap="round" />
        <path d="M252 128 l2 10 M264 128 l1.5 12 M278 128 l2 9 M300 128 l1 11 M318 128 l2 10" stroke="#d8e6f6" strokeWidth="2" strokeLinecap="round" />
        <rect x="302" y="92" width="14" height="26" fill="#8a5a40" />
        <rect x="298" y="88" width="22" height="7" rx="1" fill="#f7fbff" />
        <g className={yeni('mum')}>
          <rect x="258" y="116" width="22" height="20" fill="#1a2744" />
          {ok('mum') && (
            <g>
              <rect x="266" y="124" width="6" height="9" fill="#f6e27a" />
              <path d="M269 122 q2.4 -5 0 -7" fill="#ff8a3c" />
              <circle cx="269" cy="116" r="2.2" fill="#ffd27a" opacity="0.7" />
            </g>
          )}
          <path d="M269 116 v20 M258 126 h22" stroke="#5a3a28" strokeWidth="1.4" />
          <rect x="256" y="114" width="26" height="24" fill="none" stroke="#5a3a28" strokeWidth="2.2" />
          <rect x="256" y="136" width="26" height="3" fill="#f7fbff" />
        </g>
        <g className={yeni('celenk')}>
          <path d="M276 146 h20 v32 h-20z" fill="#6a3828" />
          <path d="M276 146 h20 v6 h-20z" fill="#000" opacity="0.12" />
          <circle cx="292" cy="164" r="1.7" fill="#e8c36a" />
          {ok('celenk') && (
            <g>
              <circle cx="286" cy="146" r="9" fill="none" stroke="#2e7a44" strokeWidth="3.6" />
              <circle cx="279" cy="144" r="2.1" fill="#c64545" />
              <circle cx="293" cy="144" r="2.1" fill="#c64545" />
              <circle cx="286" cy="139" r="2.1" fill="#e8c36a" />
              <path d="M284 154 q2 3 4 0" fill="#c64545" />
            </g>
          )}
        </g>
        <path d="M248 198 h80 v8 h-80z" fill="#f7fbff" />
        <path d="M252 198 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0" fill="#e8eef8" />
      </g>

      <g filter={`url(#${uid}-yum)`} transform="translate(196 210)">
        <ellipse cx="0" cy="18" rx="28" ry="7" fill="#b8c8dc" />
        <circle cx="0" cy="8" r="16" fill="#f4f7ff" />
        <circle cx="0" cy="-10" r="12.4" fill="#eef3fb" />
        <circle cx="0" cy="-26" r="9.2" fill="#f7fbff" />
        <path d="M-9 -34 h18 v4 h-18z" fill="#2c3344" />
        <path d="M-11 -38 h22 v6 h-22z" fill="#1b2030" />
        <circle cx="-3.2" cy="-28" r="1.15" fill="#333" />
        <circle cx="3.2" cy="-28" r="1.15" fill="#333" />
        <path d="M0 -24 l11 2.2 -11 1.6z" fill="#e07a20" />
        <path d="M-6.5 -21.5 q6.5 5.5 13 0" fill="none" stroke="#333" strokeWidth="1.2" />
        <g className={yeni('atki')}>
          <path d="M-9 -16 h18 v5.5 h-18z" fill={ok('atki') ? '#c64545' : '#2f7d6e'} />
          <path d="M7 -10.5 v15" stroke={ok('atki') ? '#c64545' : '#2f7d6e'} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M5 3 h7 M5 6.5 h6" stroke={ok('atki') ? '#f0c14a' : '#8fd4c4'} strokeWidth="1.3" />
        </g>
        <circle cx="-5" cy="1.5" r="1.7" fill="#333" />
        <g className={yeni('dugme')}>
          {ok('dugme') && <circle cx="0" cy="8" r="1.7" fill="#333" />}
        </g>
        <circle cx="4.2" cy="14" r="1.7" fill="#333" />
        <path d="M-16 0 q-16 -10 -20 -24" fill="none" stroke="#5a3a22" strokeWidth="2.3" />
        <path d="M-34 -20 l6 3 -2 6" fill="none" stroke="#5a3a22" strokeWidth="1.6" />
        <path d="M16 0 q16 -8 22 -22" fill="none" stroke="#5a3a22" strokeWidth="2.3" />
        <path d="M36 -18 l-5 4 4 5" fill="none" stroke="#5a3a22" strokeWidth="1.6" />
      </g>

      <g>
        <path d="M28 226 L74 214 L78 220 L32 232 Z" fill="#8b3a2a" />
        <path d="M34 224 L70 214" stroke="#5a2418" strokeWidth="2" />
        <rect x="44" y="210" width="10" height="8" rx="1" fill="#c45c4a" />
        <circle cx="34" cy="230" r="5.5" fill="#2a2a2a" />
        <circle cx="34" cy="230" r="2.2" fill="#666" />
        <circle cx="70" cy="220" r="5.5" fill="#2a2a2a" />
        <circle cx="70" cy="220" r="2.2" fill="#666" />
      </g>

      <g className={yeni('yigin')}>
        {ok('yigin') && (
          <g transform="translate(348 228)">
            <ellipse cx="0" cy="6" rx="16" ry="7" fill="#e8eef8" />
            <ellipse cx="-4" cy="2" rx="8" ry="5" fill="#f7fbff" />
            <ellipse cx="6" cy="3" rx="7" ry="4" fill="#eef3fb" />
          </g>
        )}
      </g>

      <path d="M16 250 q8 -8 14 0 q6 6 0 3 q-6 2 -14 -3z" fill="#eef3fb" />
      <path d="M300 246 q10 -9 16 0 q5 6 -1 3z" fill="#e8eef8" />
      <FarkIsaretleri farklar={FARKLAR} bulunan={bulunan} />
    </svg>
  );
}
