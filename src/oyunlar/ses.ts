/** Mevcut Oyunlar.ses ile aynı Web Audio geri bildirimi. Harici paket yok. */
export function ses(dogru: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notalar = dogru ? [523.25, 659.25, 783.99] : [220, 196];
    let t = ctx.currentTime;
    notalar.forEach((f) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = dogru ? 'sine' : 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.2);
      t += 0.16;
    });
  } catch {
    /* ses yoksa sessiz */
  }
}

function ctxAl(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

/** Fark bulunca; seri yükseldikçe nota tırmanır. */
export function sesFark(seri: number) {
  const ctx = ctxAl();
  if (!ctx) return;
  const skala = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const f = skala[Math.min(Math.max(seri, 1), skala.length) - 1];
  const t0 = ctx.currentTime;
  [f, f * 1.25, f * 1.5].forEach((hz, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = i === 2 ? 'triangle' : 'sine';
    o.frequency.value = hz;
    const t = t0 + i * 0.07;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.3);
  });
}

/** Yanlış tık: soğuk / ılık / sıcak. */
export function sesYakin(seviye: 'soguk' | 'ilik' | 'sicak') {
  const ctx = ctxAl();
  if (!ctx) return;
  const f = seviye === 'sicak' ? 440 : seviye === 'ilik' ? 311 : 174;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = seviye === 'sicak' ? 'sine' : 'triangle';
  o.frequency.value = f;
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(seviye === 'sicak' ? 0.2 : 0.14, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (seviye === 'sicak' ? 0.16 : 0.22));
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.24);
}
