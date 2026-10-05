/** Web Speech API. Harici paket yok. Hız 0.9. */

export function konusmaDestegi(): boolean {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** Türkçe: tr-TR, varsa Yelda. İngilizce ders: en-US. */
export function sesBul(lang: string): SpeechSynthesisVoice | undefined {
  if (!konusmaDestegi()) return undefined;
  const sesler = window.speechSynthesis.getVoices();
  if (lang === 'tr-TR' || lang.startsWith('tr')) {
    const tr = sesler.filter(s => s.lang === 'tr-TR' || s.lang.startsWith('tr'));
    const yelda = tr.find(s => s.name.includes('Yelda') && /enhanced|premium|geli/i.test(s.name));
    return yelda || tr.find(s => s.name.includes('Yelda')) || tr.find(s => s.lang === 'tr-TR') || tr[0];
  }
  return sesler.find(s => s.lang === lang) || sesler.find(s => s.lang.startsWith(lang.slice(0, 2)));
}

export function okuIptal(): void {
  if (konusmaDestegi()) window.speechSynthesis.cancel();
}

/** Sırayla okur. Ses yoksa hiçbir şey yapmaz. */
export function metinleriOku(metinler: string[], lang: string): void {
  if (!konusmaDestegi()) return;
  const ses = sesBul(lang);
  if (!ses) return;
  const liste = metinler.map(m => m.trim()).filter(Boolean);
  if (liste.length === 0) return;
  window.speechSynthesis.cancel();
  for (const metin of liste) {
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = lang;
    u.rate = 0.9;
    u.voice = ses;
    window.speechSynthesis.speak(u);
  }
}
