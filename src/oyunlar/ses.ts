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
