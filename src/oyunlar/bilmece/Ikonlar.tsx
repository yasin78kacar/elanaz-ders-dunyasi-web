import type { IkonId } from './tipler';

export function Ikon({ id }: { id: IkonId }) {
  switch (id) {
    case 'elma':
      return (
        <g>
          <path d="M40 18c16 0 24 18 24 32 0 16-10 22-24 22S16 66 16 50C16 36 24 18 40 18z" fill="#D4537E" />
          <path d="M38 18v-8h5v8" fill="#6b3d1f" />
          <path d="M43 14q10-8 14 4-10 0-14-4z" fill="#1D9E75" />
        </g>
      );
    case 'muz':
      return (
        <g>
          <path d="M18 28c8-10 28-8 40 6 10 12 10 28 2 34-8-10-6-22-2-30-10-8-24-10-36-4z" fill="#EF9F27" />
          <path d="M56 22c4-4 8-2 8 2" stroke="#6b3d1f" strokeWidth="3" fill="none" />
        </g>
      );
    case 'karpuz':
      return (
        <g>
          <path d="M10 48c0-22 14-32 30-32s30 10 30 32H10z" fill="#1D9E75" />
          <path d="M16 48c2-16 12-24 24-24s22 8 24 24H16z" fill="#D4537E" />
          <circle cx="32" cy="40" r="2" fill="#2a2438" />
          <circle cx="44" cy="38" r="2" fill="#2a2438" />
          <circle cx="50" cy="44" r="1.6" fill="#2a2438" />
        </g>
      );
    case 'uzum':
      return (
        <g>
          <path d="M40 10v16" stroke="#1D9E75" strokeWidth="3" />
          <circle cx="32" cy="32" r="8" fill="#7F77DD" />
          <circle cx="48" cy="32" r="8" fill="#7F77DD" />
          <circle cx="40" cy="44" r="8" fill="#5a4a7a" />
          <circle cx="28" cy="48" r="7" fill="#7F77DD" />
          <circle cx="52" cy="48" r="7" fill="#7F77DD" />
          <circle cx="40" cy="58" r="7" fill="#5a4a7a" />
        </g>
      );
    case 'portakal':
      return (
        <g>
          <circle cx="40" cy="44" r="24" fill="#EF9F27" />
          <circle cx="40" cy="44" r="16" fill="#e89b20" opacity="0.35" />
          <path d="M40 20v-8" stroke="#1D9E75" strokeWidth="3" />
          <path d="M40 16q8-6 12 2" fill="#1D9E75" />
        </g>
      );
    case 'kedi':
      return (
        <g>
          <circle cx="40" cy="44" r="20" fill="#c45c2a" />
          <path d="M22 32l-8-16 16 8z" fill="#c45c2a" />
          <path d="M58 32l8-16-16 8z" fill="#c45c2a" />
          <circle cx="32" cy="42" r="3" fill="#2a2438" />
          <circle cx="48" cy="42" r="3" fill="#2a2438" />
          <path d="M36 50h8" stroke="#2a2438" strokeWidth="2" />
          <path d="M62 50q12 8 6 18" stroke="#c45c2a" strokeWidth="5" fill="none" />
        </g>
      );
    case 'kopek':
      return (
        <g>
          <ellipse cx="40" cy="48" rx="22" ry="16" fill="#8a5a38" />
          <circle cx="56" cy="36" r="12" fill="#8a5a38" />
          <path d="M22 40l-8 14h12z" fill="#6b3d1f" />
          <circle cx="52" cy="34" r="2.4" fill="#2a2438" />
          <ellipse cx="60" cy="40" rx="4" ry="3" fill="#2a2438" />
          <path d="M20 52q-10 10-4 18" stroke="#8a5a38" strokeWidth="5" fill="none" />
        </g>
      );
    case 'kus':
      return (
        <g>
          <ellipse cx="40" cy="44" rx="22" ry="14" fill="#378ADD" />
          <path d="M22 40c-10-12 4-22 16-10" fill="#2a5f9e" />
          <path d="M58 40l16 4-16 6z" fill="#EF9F27" />
          <circle cx="50" cy="40" r="2.4" fill="#fff" />
          <circle cx="51" cy="40" r="1.2" fill="#2a2438" />
        </g>
      );
    case 'balik':
      return (
        <g>
          <ellipse cx="36" cy="42" rx="20" ry="12" fill="#2a9db8" />
          <path d="M54 42l18-12v24z" fill="#1d7a8a" />
          <circle cx="26" cy="40" r="2.4" fill="#fff" />
          <circle cx="26.6" cy="40" r="1.2" fill="#2a2438" />
          <path d="M32 36q6 6 0 12" fill="none" stroke="#1d7a8a" strokeWidth="2" />
        </g>
      );
    case 'tavsan':
      return (
        <g>
          <ellipse cx="40" cy="50" rx="18" ry="16" fill="#e8d0b0" />
          <ellipse cx="30" cy="22" rx="6" ry="16" fill="#e8d0b0" />
          <ellipse cx="50" cy="22" rx="6" ry="16" fill="#e8d0b0" />
          <ellipse cx="30" cy="24" rx="3" ry="10" fill="#f4b6c2" />
          <ellipse cx="50" cy="24" rx="3" ry="10" fill="#f4b6c2" />
          <circle cx="34" cy="48" r="2.2" fill="#2a2438" />
          <circle cx="46" cy="48" r="2.2" fill="#2a2438" />
          <ellipse cx="40" cy="54" rx="4" ry="3" fill="#c45c2a" />
        </g>
      );
    case 'ari':
      return (
        <g>
          <ellipse cx="28" cy="30" rx="10" ry="7" fill="#fff" opacity="0.9" />
          <ellipse cx="52" cy="30" rx="10" ry="7" fill="#fff" opacity="0.9" />
          <ellipse cx="40" cy="44" rx="16" ry="12" fill="#EF9F27" />
          <path d="M28 40h24M28 46h24M28 52h24" stroke="#2a2438" strokeWidth="3" />
        </g>
      );
    case 'kurbaga':
      return (
        <g>
          <ellipse cx="40" cy="48" rx="22" ry="14" fill="#3d9a4a" />
          <circle cx="28" cy="32" r="8" fill="#3d9a4a" />
          <circle cx="52" cy="32" r="8" fill="#3d9a4a" />
          <circle cx="28" cy="32" r="3.5" fill="#fff" />
          <circle cx="52" cy="32" r="3.5" fill="#fff" />
          <circle cx="29" cy="32" r="1.8" fill="#2a2438" />
          <circle cx="53" cy="32" r="1.8" fill="#2a2438" />
          <ellipse cx="40" cy="52" rx="6" ry="3" fill="#2a6a28" />
        </g>
      );
    case 'saat':
      return (
        <g>
          <circle cx="40" cy="42" r="22" fill="#fff6d6" stroke="#6b3d1f" strokeWidth="4" />
          <path d="M40 42v-12" stroke="#2a2438" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 42l10 6" stroke="#D4537E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="42" r="3" fill="#2a2438" />
        </g>
      );
    case 'kalem':
      return (
        <g>
          <path d="M28 64 L52 16" stroke="#378ADD" strokeWidth="10" strokeLinecap="round" />
          <path d="M52 16l8 4-6 10z" fill="#EF9F27" />
          <path d="M28 64l-6 8 10-2z" fill="#6b3d1f" />
        </g>
      );
    case 'kitap':
      return (
        <g>
          <path d="M16 18h22v48H16z" fill="#378ADD" />
          <path d="M42 18h22v48H42z" fill="#D4537E" />
          <path d="M38 16v52" stroke="#6b3d1f" strokeWidth="4" />
          <path d="M20 28h14M20 38h14M46 28h14M46 38h14" stroke="#fff" strokeWidth="2" opacity="0.7" />
        </g>
      );
    case 'semsiye':
      return (
        <g>
          <path d="M12 42c0-18 12-28 28-28s28 10 28 28H12z" fill="#D4537E" />
          <path d="M40 42v22" stroke="#6b3d1f" strokeWidth="4" />
          <path d="M40 64q8 8 14 2" stroke="#6b3d1f" strokeWidth="3" fill="none" />
        </g>
      );
    case 'top':
      return (
        <g>
          <circle cx="40" cy="42" r="22" fill="#D85A30" />
          <path d="M18 42h44M40 20v44" stroke="#fff" strokeWidth="3" />
          <path d="M24 28q16 10 32 0M24 56q16-10 32 0" stroke="#fff" strokeWidth="2.5" fill="none" />
        </g>
      );
    case 'anahtar':
      return (
        <g>
          <circle cx="26" cy="30" r="12" fill="none" stroke="#EF9F27" strokeWidth="6" />
          <path d="M36 34l28 22" stroke="#EF9F27" strokeWidth="6" strokeLinecap="round" />
          <path d="M54 50v10M62 56v10" stroke="#EF9F27" strokeWidth="4" />
        </g>
      );
    case 'gunes':
      return (
        <g>
          <circle cx="40" cy="40" r="14" fill="#EF9F27" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
            const r = (d * Math.PI) / 180;
            return (
              <line
                key={d}
                x1={40 + Math.cos(r) * 18}
                y1={40 + Math.sin(r) * 18}
                x2={40 + Math.cos(r) * 26}
                y2={40 + Math.sin(r) * 26}
                stroke="#EF9F27"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      );
    case 'ay':
      return (
        <g>
          <circle cx="40" cy="42" r="20" fill="#f0c14a" />
          <circle cx="50" cy="36" r="16" fill="#fff6e4" />
        </g>
      );
    case 'yagmur':
      return (
        <g>
          <ellipse cx="40" cy="28" rx="22" ry="12" fill="#8aa0b8" />
          <ellipse cx="28" cy="32" rx="12" ry="8" fill="#8aa0b8" />
          <ellipse cx="52" cy="32" rx="12" ry="8" fill="#8aa0b8" />
          <path d="M28 46l-4 14M40 48l-4 16M52 46l-4 14" stroke="#378ADD" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'kar':
      return (
        <g>
          <path d="M40 16v48M22 28l36 24M22 52l36-24" stroke="#7aa8d4" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="40" r="5" fill="#b8d4ee" />
        </g>
      );
    case 'gokkusagi':
      return (
        <g>
          <path d="M10 58a30 30 0 0 1 60 0" fill="none" stroke="#D4537E" strokeWidth="6" />
          <path d="M16 58a24 24 0 0 1 48 0" fill="none" stroke="#EF9F27" strokeWidth="6" />
          <path d="M22 58a18 18 0 0 1 36 0" fill="none" stroke="#378ADD" strokeWidth="6" />
          <path d="M28 58a12 12 0 0 1 24 0" fill="none" stroke="#1D9E75" strokeWidth="6" />
        </g>
      );
    case 'agac':
      return (
        <g>
          <ellipse cx="40" cy="34" rx="22" ry="20" fill="#1D9E75" />
          <rect x="34" y="48" width="12" height="22" rx="2" fill="#6b3d1f" />
        </g>
      );
    case 'ev':
      return (
        <g>
          <path d="M10 42 L40 16 L70 42z" fill="#D85A30" />
          <path d="M18 40v28h44V40z" fill="#EF9F27" />
          <path d="M34 50h12v18H34z" fill="#6b3d1f" />
          <rect x="50" y="50" width="8" height="8" fill="#378ADD" />
        </g>
      );
    default:
      return null;
  }
}
