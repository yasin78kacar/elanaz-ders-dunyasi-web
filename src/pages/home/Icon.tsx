import type { CSSProperties, ReactElement } from 'react';

export type IconName =
  | 'logo'
  | 'math' | 'turkish' | 'science' | 'life' | 'english'
  | 'social' | 'art' | 'brain'
  | 'test' | 'story' | 'coloring' | 'games'
  | 'star' | 'shield' | 'gift' | 'lock' | 'check'
  | 'arrowRight' | 'play' | 'sparkles' | 'user' | 'plus'
  | 'learn' | 'search' | 'box' | 'trophy' | 'chart' | 'info'
  | 'abc';

const PATHS: Record<IconName, ReactElement> = {
  logo: (
    <>
      <ellipse cx="12" cy="12" rx="9.5" ry="3.4" transform="rotate(-18 12 12)" />
      <circle cx="12" cy="12" r="4.6" />
      <path d="M18.8 4.2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  math: (
    <>
      <path d="M8 4.2v7.2M4.4 7.8h7.2" />
      <path d="m13.4 13.4 6.4 6.4M19.8 13.4l-6.4 6.4" />
    </>
  ),
  turkish: (
    <>
      <path d="M4 20l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
      <path d="m13.5 7.5 3 3" />
    </>
  ),
  science: (
    <>
      <path d="M9.5 3h5M10.5 3v5.2c0 .5-.15 1-.45 1.4L6 15.5A3.5 3.5 0 0 0 9.03 20.5h5.94A3.5 3.5 0 0 0 18 15.5l-4.05-5.9a2.4 2.4 0 0 1-.45-1.4V3" />
      <path d="M7.6 14.5h8.8" />
    </>
  ),
  life: (
    <>
      <path d="M12 20.8S4.5 16.2 4.5 10.7C4.5 7.8 6.8 5.8 9.2 5.8c1.4 0 2.4.7 2.8 1.4.4-.7 1.4-1.4 2.8-1.4 2.4 0 4.7 2 4.7 4.9 0 5.5-7.5 10.1-7.5 10.1z" />
      <path d="M7.2 11.6h2.3l1.2-2.4 2 4.8 1.3-2.4h2.8" />
    </>
  ),
  english: (
    <>
      <path d="M1.6 18.4 4.4 5.6 7.2 18.4" />
      <path d="M2.9 13.2h3" />
      <path d="M8.6 5.6v12.8" />
      <path d="M8.6 5.6h3.1a2.45 2.45 0 0 1 0 4.9H8.6" />
      <path d="M8.6 10.5h3.5a3.15 3.95 0 0 1 0 7.9H8.6" />
      <path d="M22.6 7.8A3.6 6.2 0 1 0 22.6 16.2" />
    </>
  ),
  social: (
    <>
      <path d="M3.5 9.5 12 4l8.5 5.5" />
      <path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8" />
      <path d="M3.5 20h17" />
    </>
  ),
  art: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 .001 17c1.2 0 1.8-.7 1.8-1.6 0-.8-.6-1.3-.6-2.1 0-.9.8-1.6 1.9-1.6H17a4.4 4.4 0 0 0 4.4-4.4C21.4 6.6 17.1 3.5 12 3.5z" />
      <circle cx="8.4" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.3" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10.3" cy="14.2" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  brain: (
    <>
      <path d="M9.6 18h4.8M10.6 21h2.8" />
      <path d="M12 3a6.4 6.4 0 0 0-3.9 11.5c.8.7 1.3 1.4 1.5 2.3h4.8c.2-.9.7-1.6 1.5-2.3A6.4 6.4 0 0 0 12 3z" />
      <path d="M9.5 9.5h1.8l1-2 1.6 3.6 1-1.6h1.6" />
    </>
  ),
  test: (
    <>
      <rect x="5" y="4.5" width="14" height="16" rx="2.5" />
      <rect x="9" y="2.5" width="6" height="4" rx="1.2" />
      <path d="m8.8 13.2 2.2 2.2 4.2-4.4" />
    </>
  ),
  story: (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 5 4.5c-.8 0-1.5.2-2 .5v13.5c.5-.3 1.2-.5 2-.5 3.5 0 5.5.5 7 2 1.5-1.5 3.5-2 7-2 .8 0 1.5.2 2 .5V5c-.5-.3-1.2-.5-2-.5-3.5 0-5.5.5-7 2z" />
      <path d="M12 6.5v13.5" />
    </>
  ),
  coloring: (
    <>
      <path d="M20.4 5.4a1.8 1.8 0 0 0-2.5-2.5L9.3 11.6c-1.9-.3-3.9.3-5.2 1.7-1.6 1.6-1.8 3.8-.8 5.6 1.8 1 4 .8 5.6-.8 1.4-1.3 2-3.3 1.7-5.2l4-4z" />
      <path d="m12.4 9.7 1.9 1.9" />
    </>
  ),
  games: (
    <>
      <rect x="3" y="7.5" width="18" height="10" rx="5" />
      <path d="M7.5 11v4M5.5 13h4" />
      <circle cx="15.7" cy="11.3" r=".9" fill="currentColor" stroke="none" />
      <circle cx="18.2" cy="13.8" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
  ),
  shield: (
    <>
      <path d="M12 3 5 5.8v5.4c0 4.6 3 8 7 9.8 4-1.8 7-5.2 7-9.8V5.8z" />
      <path d="m9 11.5 2.2 2.2 4-4.2" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="4" />
      <path d="M6 13v6.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V13M12 9v12" />
      <path d="M12 9c-2 0-4.5-.6-4.5-2.6C7.5 5 8.6 4 10 4c1.7 0 2 2.4 2 5zm0 0c2 0 4.5-.6 4.5-2.6C16.5 5 15.4 4 14 4c-1.7 0-2 2.4-2 5z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
      <circle cx="12" cy="15.5" r="1.4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  play: <path d="M8 5.5v13l11-6.5z" />,
  sparkles: (
    <>
      <path d="M12 4l1.8 4.7 4.7 1.8-4.7 1.8L12 17l-1.8-4.7-4.7-1.8 4.7-1.8z" />
      <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  learn: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 8.2a1.8 1.8 0 1 1 1.6 2.9c-.6.3-.9.7-.9 1.3" />
      <path d="M12.7 15.2h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.2" />
      <path d="m15.2 15.2 5 5" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 8.5 12 4l8.5 4.5v9.5L12 22 3.5 18z" />
      <path d="M12 22V13" />
      <path d="M3.5 8.5 12 13l8.5-4.5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5.5a4 4 0 0 1-8 0z" />
      <path d="M8 6.5H5.5A2.5 2.5 0 0 0 8 9M16 6.5h2.5A2.5 2.5 0 0 1 16 9" />
      <path d="M10 15.5h4M12 13.5v2M8 20h8M10 20v-2.5h4V20" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16v-4M12 16V8M17 16v-7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 8h.01" />
    </>
  ),
  abc: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M8.2 16.2 12 7.6l3.8 8.6" />
      <path d="M9.5 13.2h5" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 24, className, style }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}
