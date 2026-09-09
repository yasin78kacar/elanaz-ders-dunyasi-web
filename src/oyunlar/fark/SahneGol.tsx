import { FarkIsaretleri } from './FarkIsaretleri';
import { SAHNELER } from './sahneler';
import type { SahneProps } from './tipler';

const FARKLAR = SAHNELER[1].farklar;

function Cam({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 ${h * 0.22} C ${-h * 0.22} ${h * 0.34}, ${-h * 0.28} ${h * 0.55}, ${-h * 0.16} ${h * 0.7} C ${-h * 0.3} ${h * 0.78}, ${-h * 0.18} ${h * 0.92}, 0 ${h * 0.88} C ${h * 0.18} ${h * 0.92}, ${h * 0.3} ${h * 0.78}, ${h * 0.16} ${h * 0.7} C ${h * 0.28} ${h * 0.55}, ${h * 0.22} ${h * 0.34}, 0 ${h * 0.22} Z`} fill="#1f5c3a" />
      <path d={`M0 ${h * 0.28} C ${-h * 0.14} ${h * 0.38}, ${-h * 0.16} ${h * 0.55}, ${-h * 0.06} ${h * 0.62} C ${-h * 0.12} ${h * 0.7}, 0 ${h * 0.72}, ${h * 0.08} ${h * 0.62} C ${h * 0.16} ${h * 0.55}, ${h * 0.14} ${h * 0.38}, 0 ${h * 0.28} Z`} fill="#2a7348" />
      <rect x="-2.6" y={h * 0.78} width="5.2" height={h * 0.22} rx="1" fill="#5a3a22" />
    </g>
  );
}

function Ordek() {
  return (
    <g>
      <ellipse cx="0" cy="4" rx="11" ry="6" fill="#f4d35e" />
      <circle cx="10" cy="0" r="5" fill="#f4d35e" />
      <path d="M14 -1 l7 2 -7 2z" fill="#e07a20" />
      <circle cx="12" cy="-1" r="0.9" fill="#333" />
      <path d="M-6 6 q-4 6 4 5" fill="#e07a20" />
    </g>
  );
}

export function SahneGol({ uid, bulunan, yeniId, asil, onPointerDown }: SahneProps & { asil: boolean }) {
  const ok = (id: string) => asil || bulunan.has(id);
  const yeni = (id: string) => (yeniId === id ? ' fb-yeni' : '');
  const tekneX = ok('tekne') ? 268 : 292;

  return (
    <svg className="fb-svg" viewBox="0 0 400 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Göl kenarı sahnesi" onPointerDown={onPointerDown}>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a6e" />
          <stop offset="0.4" stopColor="#c45c4a" />
          <stop offset="0.72" stopColor="#f0a050" />
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
        <filter id={`${uid}-yum`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.25" />
        </filter>
      </defs>

      <rect width="400" height="270" fill={`url(#${uid}-gok)`} />
      <circle cx="300" cy="78" r="28" fill={`url(#${uid}-gunes)`} opacity="0.95" />
      <circle cx="300" cy="78" r="40" fill="#ffb050" opacity="0.18" />

      <g>
        <circle cx="40" cy="28" r="1.6" fill="#fff6d6" />
        <circle cx="88" cy="18" r="1.2" fill="#fff6d6" />
        <circle cx="130" cy="32" r="1.4" fill="#fff6d6" />
        <circle cx="190" cy="16" r="1.1" fill="#fff6d6" />
        <circle cx="240" cy="26" r="1.3" fill="#fff6d6" />
        <g className={yeni('yildiz')}>
          {ok('yildiz') && (
            <g transform="translate(352 36)">
              <path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="#fff4b0" />
              <circle r="2" fill="#fff" />
            </g>
          )}
        </g>
      </g>

      <path d="M-10 128 C 70 118, 140 136, 220 122 C 300 108, 360 128, 420 118 L 420 180 L -10 180 Z" fill="#3d5a32" />
      <path d="M-10 148 C 90 138, 160 158, 240 146 C 310 136, 380 154, 420 148 L 420 190 L -10 190 Z" fill="#4a6e3a" />

      <Cam x={48} y={78} h={86} />
      <Cam x={78} y={92} h={70} />
      <Cam x={360} y={86} h={80} />

      <g filter={`url(#${uid}-yum)`}>
        <ellipse cx="121" cy="170" rx="42" ry="7" fill="#2a3a22" opacity="0.28" />
        <path d="M86 168 h70 v-46 h-70z" fill="#8b5a3c" />
        <path d="M86 148 h70 M86 136 h70" stroke="#6e4228" strokeWidth="1.5" opacity="0.35" />
        <path d="M86 122 L121 84 L156 122 Z" fill="#5a3220" />
        <path d="M86 122 L121 84 L156 122 Z" fill="#3a2014" opacity="0.2" />
        <rect x="132" y="90" width="13" height="24" fill="#6a4030" />
        <rect x="130" y="86" width="17" height="6" rx="1" fill="#4a2818" />
        <g className={yeni('duman')}>
          {ok('duman') && (
            <g className="fb-duman">
              <ellipse cx="138" cy="82" rx="7" ry="5" fill="#f0e6d8" opacity="0.7" />
              <ellipse cx="144" cy="70" rx="8" ry="6" fill="#f7f0e6" opacity="0.5" />
              <ellipse cx="136" cy="60" rx="6" ry="5" fill="#fff" opacity="0.35" />
            </g>
          )}
        </g>
        <g className={yeni('pencere')}>
          <rect x="106" y="128" width="18" height="16" fill={ok('pencere') ? '#f6e27a' : '#2a3040'} />
          <path d="M115 128 v16 M106 136 h18" stroke="#5a3220" strokeWidth="1.4" />
          <rect x="104" y="126" width="22" height="20" fill="none" stroke="#4a2818" strokeWidth="2" />
        </g>
        <rect x="128" y="140" width="12" height="22" fill="#4a2818" />
        <ellipse cx="137" cy="152" rx="1.2" ry="1.2" fill="#f4d35e" />
      </g>

      <path d="M168 168 h70 v8 h-70z" fill="#6a4a30" />
      <path d="M174 168 v8 M188 168 v8 M202 168 v8 M216 168 v8 M230 168 v8" stroke="#4a3220" strokeWidth="2" />

      <rect x="0" y="176" width="400" height="94" fill={`url(#${uid}-su)`} />
      <path className="fb-dalga" d="M0 186 q20 6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t20 0" fill="none" stroke="#8ec4e0" strokeWidth="2" opacity="0.45" />
      <path className="fb-dalga" d="M0 202 q24 7 48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t32 0" fill="none" stroke="#b8dff0" strokeWidth="1.6" opacity="0.3" style={{ animationDelay: '-1s' }} />
      <ellipse cx="300" cy="196" rx="36" ry="6" fill="#ffb060" opacity="0.2" />

      <g className={yeni('ordek')} transform="translate(198 188)">
        {ok('ordek') && <Ordek />}
      </g>

      <g className={yeni('tekne')} transform={`translate(${tekneX} 198)`}>
        <path d="M-28 0 Q-22 14 0 16 Q22 14 28 0 Z" fill="#8b3a2a" />
        <path d="M-22 0 h44" stroke="#5a2418" strokeWidth="3" />
        <rect x="-8" y="-10" width="16" height="10" fill="#d4b08a" />
        <path d="M0 -10 v-16" stroke="#3d2a18" strokeWidth="2" />
        <path d="M0 -26 l14 8 h-14z" fill="#e8d2a0" />
      </g>

      <g>
        <path d="M40 176 v40" stroke="#3d6b32" strokeWidth="2" />
        <path d="M40 188 q-10 -8 -16 6" fill="none" stroke="#4a8f3a" strokeWidth="2" />
        <path d="M42 194 q12 -6 14 8" fill="none" stroke="#4a8f3a" strokeWidth="2" />
        <path d="M58 180 v36" stroke="#3d6b32" strokeWidth="2" />
        <path d="M58 192 q-8 -10 -14 4" fill="none" stroke="#3d7a32" strokeWidth="1.8" />
      </g>

      <g className={yeni('nilufer')} transform="translate(318 214)">
        <ellipse cx="0" cy="4" rx="16" ry="6" fill={ok('nilufer') ? '#3d8f5a' : '#8a4a9a'} />
        <ellipse cx="10" cy="6" rx="10" ry="4" fill={ok('nilufer') ? '#4aa368' : '#a060b0'} />
        <circle cx="2" cy="2" r="4" fill={ok('nilufer') ? '#f0d24a' : '#e8a0e0'} />
      </g>

      <path d="M0 248 h400" stroke="#2a4060" strokeWidth="10" opacity="0.25" />
      <FarkIsaretleri farklar={FARKLAR} bulunan={bulunan} />
    </svg>
  );
}
