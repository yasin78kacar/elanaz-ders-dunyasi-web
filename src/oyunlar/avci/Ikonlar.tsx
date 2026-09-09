import type { Gorev } from './tipler';

export function MiniIkon({ tur }: { tur: Gorev['ikon'] }) {
  const s = { width: 22, height: 22, viewBox: '0 0 24 24' } as const;
  if (tur === 'cicek') {
    return (
      <svg {...s}><circle cx="12" cy="10" r="4" fill="#e23d6a" /><circle cx="8" cy="12" r="3.2" fill="#e23d6a" /><circle cx="16" cy="12" r="3.2" fill="#e23d6a" /><circle cx="12" cy="11" r="1.8" fill="#f6e27a" /><path d="M12 14 v7" stroke="#3d7a3a" strokeWidth="2" /></svg>
    );
  }
  if (tur === 'top') {
    return (
      <svg {...s}><circle cx="12" cy="12" r="8" fill="#f4d23a" /><path d="M12 4 v16 M4 12 h16" stroke="#e09a20" strokeWidth="1.4" /></svg>
    );
  }
  if (tur === 'kelebek') {
    return (
      <svg {...s}><ellipse cx="7" cy="10" rx="5" ry="6" fill="#7b5cff" /><ellipse cx="17" cy="10" rx="5" ry="6" fill="#7b5cff" /><path d="M12 6 v12" stroke="#333" strokeWidth="1.6" /></svg>
    );
  }
  if (tur === 'ucurtma') {
    return (
      <svg {...s}><path d="M12 3 L20 12 L12 16 L4 12 Z" fill="#d64545" /><path d="M12 16 q4 4 2 8" fill="none" stroke="#333" strokeWidth="1.3" /></svg>
    );
  }
  if (tur === 'kova') {
    return (
      <svg {...s}><path d="M7 10 h10 l-1.5 10 h-7z" fill="#c64545" /><path d="M8 10 q4 -6 8 0" fill="none" stroke="#8a3a2a" strokeWidth="1.6" /></svg>
    );
  }
  if (tur === 'mantar') {
    return (
      <svg {...s}><path d="M5 12 q7 -10 14 0" fill="#c64545" /><rect x="10" y="12" width="4" height="8" fill="#f0e0c0" /><circle cx="9" cy="10" r="1.2" fill="#fff" /></svg>
    );
  }
  if (tur === 'baykus') {
    return (
      <svg {...s}><ellipse cx="12" cy="13" rx="7" ry="8" fill="#7a5a38" /><circle cx="9" cy="11" r="2.4" fill="#f6e27a" /><circle cx="15" cy="11" r="2.4" fill="#f6e27a" /><circle cx="9" cy="11" r="1" fill="#222" /><circle cx="15" cy="11" r="1" fill="#222" /></svg>
    );
  }
  if (tur === 'tilki') {
    return (
      <svg {...s}><ellipse cx="13" cy="14" rx="7" ry="5" fill="#e07a20" /><path d="M6 10 l3 6 3 -4z" fill="#e07a20" /><circle cx="16" cy="12" r="1" fill="#222" /></svg>
    );
  }
  if (tur === 'salyangoz') {
    return (
      <svg {...s}><circle cx="14" cy="12" r="6" fill="#d4a060" /><path d="M14 12 q3 0 3 3" fill="none" stroke="#8a6240" strokeWidth="1.4" /><path d="M8 16 q-4 0 -5 -6" fill="none" stroke="#c4b08a" strokeWidth="2" /></svg>
    );
  }
  if (tur === 'kus') {
    return (
      <svg {...s}><ellipse cx="10" cy="13" rx="6" ry="4" fill="#3d7ec9" /><ellipse cx="16" cy="11" rx="4" ry="3" fill="#2a5f9e" /><path d="M19 11 l4 1 -4 1z" fill="#e09a3e" /></svg>
    );
  }
  if (tur === 'kurbaga') {
    return (
      <svg {...s}><ellipse cx="12" cy="14" rx="8" ry="5" fill="#4ea346" /><circle cx="8" cy="10" r="2.6" fill="#67b85a" /><circle cx="8" cy="10" r="1" fill="#222" /></svg>
    );
  }
  if (tur === 'semsiye') {
    return (
      <svg {...s}><path d="M4 13 q8 -12 16 0" fill="#f4d23a" /><path d="M12 13 v8" stroke="#8a6240" strokeWidth="1.6" /></svg>
    );
  }
  if (tur === 'kedi') {
    return (
      <svg {...s}><ellipse cx="12" cy="15" rx="7" ry="5" fill="#c4a06a" /><path d="M6 12 l2 -6 3 5z M16 11 l-2 -6 3 5z" fill="#c4a06a" /><circle cx="10" cy="14" r="0.9" fill="#222" /></svg>
    );
  }
  if (tur === 'balon') {
    return (
      <svg {...s}><ellipse cx="12" cy="10" rx="6" ry="7" fill="#c64545" /><path d="M12 17 q2 3 0 6" fill="none" stroke="#8a3a2a" strokeWidth="1.3" /></svg>
    );
  }
  if (tur === 'guvercin') {
    return (
      <svg {...s}><ellipse cx="11" cy="13" rx="6" ry="4" fill="#9aa3b0" /><ellipse cx="16" cy="11" rx="3.5" ry="2.6" fill="#7a8490" /></svg>
    );
  }
  if (tur === 'kopek') {
    return (
      <svg {...s}><ellipse cx="13" cy="14" rx="7" ry="5" fill="#8a6240" /><path d="M6 12 l-3 -4 5 3z" fill="#8a6240" /><circle cx="16" cy="12" r="1" fill="#222" /></svg>
    );
  }
  return (
    <svg {...s}><path d="M8 10 h8 v8 h-8z" fill="#3d7ec9" /><path d="M8 10 q4 -6 8 0" fill="#2a5f9e" /></svg>
  );
}
