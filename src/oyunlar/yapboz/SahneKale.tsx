export function SahneKale({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2744" />
          <stop offset="0.5" stopColor="#3a4a72" />
          <stop offset="1" stopColor="#8aa0c8" />
        </linearGradient>
        <linearGradient id={`${uid}-tas`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4b08a" />
          <stop offset="1" stopColor="#8a7350" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${uid}-gok)`} />
      <circle cx="330" cy="56" r="26" fill="#f4f0d8" />
      <circle cx="340" cy="50" r="26" fill="#1a2744" />
      {[[30, 28], [70, 48], [120, 22], [180, 40], [230, 18], [280, 36], [360, 70], [50, 70]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 1.4 : 1.8} fill="#fff6d6" opacity="0.85" />
      ))}
      <path d="M-10 168 C 70 148, 150 170, 240 150 C 310 136, 380 160, 420 150 L 420 250 L -10 250 Z" fill="#4a5a48" />
      <path d="M-10 210 C 90 196, 180 220, 280 200 C 340 190, 400 214, 420 208 L 420 400 L -10 400 Z" fill="#3d6b32" />
      <g>
        <rect x="118" y="148" width="164" height="130" fill={`url(#${uid}-tas)`} />
        <path d="M118 148 h20 v-16 h-8 v16 h-12z M150 148 h16 v-16 h-8 v16 h-8z M182 148 h16 v-16 h-8 v16 h-8z M214 148 h16 v-16 h-8 v16 h-8z M246 148 h16 v-16 h-8 v16 h-8z M262 148 h20 v-16 h-8 v16 h-12z" fill="#b49c78" />
        <rect x="98" y="120" width="36" height="158" fill="#a8926c" />
        <rect x="266" y="108" width="40" height="170" fill="#a8926c" />
        <path d="M98 120 h12 v-18 h-8 v18 h-4z M122 120 h12 v-18 h-8 v18 h-4z" fill="#98825c" />
        <path d="M266 108 h14 v-18 h-8 v18 h-6z M292 108 h14 v-18 h-8 v18 h-6z" fill="#98825c" />
        <path d="M98 120 L116 88 L134 120 Z" fill="#7a3a32" />
        <path d="M266 108 L286 72 L306 108 Z" fill="#7a3a32" />
        <rect x="278" y="78" width="8" height="22" fill="#8a5a40" />
        <path d="M274 78 h16 l-8 -12z" fill="#c64545" className="yb-yaprak" />
        <rect x="148" y="176" width="22" height="26" fill="#1a2744" />
        <rect x="188" y="176" width="22" height="26" fill="#f6e27a" />
        <rect x="228" y="176" width="22" height="26" fill="#1a2744" />
        <rect x="108" y="168" width="14" height="18" fill="#f6e27a" />
        <rect x="276" y="156" width="16" height="20" fill="#1a2744" />
        <path d="M186 230 h28 v48 h-28z" fill="#5a3220" />
        <path d="M186 230 h28 v10 h-28z" fill="#3a2014" />
        <circle cx="208" cy="258" r="2.2" fill="#e8c36a" />
        <path d="M118 278 h164 v12 h-164z" fill="#d8e6f6" />
      </g>
      <path d="M200 290 C 180 320, 140 350, 120 400 L 280 400 C 260 350, 220 318, 200 290 Z" fill="#c4b08a" opacity="0.7" />
      <path d="M40 250 C 20 200, 60 170, 90 180 C 120 190, 110 240, 80 270 Z" fill="#2e7a44" className="yb-yaprak" />
      <path d="M64 268 v-40" stroke="#5a3a22" strokeWidth="8" strokeLinecap="round" />
      <path d="M340 240 C 320 190, 360 160, 390 174 C 410 186, 400 230, 370 258 Z" fill="#246044" className="yb-yaprak-2" />
      <path d="M362 256 v-36" stroke="#5a3a22" strokeWidth="7" strokeLinecap="round" />
      <path d="M20 360 C 60 340, 90 350, 110 380" fill="none" stroke="#3a7a8a" strokeWidth="10" />
      <ellipse cx="60" cy="380" rx="28" ry="8" fill="#3a7a8a" opacity="0.5" />
      <path d="M16 388 q8 -10 14 0" fill="#2e6b32" />
      <path d="M300 376 q10 -12 16 0" fill="#3d7a3a" />
    </g>
  );
}
