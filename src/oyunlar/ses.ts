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

let ctxPaylas: AudioContext | null = null;

/** Ritim için tek bağlam — her seste yeni context açılmaz (gecikme). */
export function sesCtx(): AudioContext | null {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctxPaylas || ctxPaylas.state === 'closed') ctxPaylas = new Ctor();
    if (ctxPaylas.state === 'suspended') void ctxPaylas.resume();
    return ctxPaylas;
  } catch {
    return null;
  }
}

/** Zamanlanmış vuruş notası (şarkı devam eder, oyuncu kaçırsa da çalar). */
export function sesRitimNoot(when: number, pad: number) {
  const ctx = sesCtx();
  if (!ctx) return;
  const skala = [392, 493.88, 587.33, 659.25];
  const f = skala[pad] ?? 440;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.16, when + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.18);
  o.connect(g).connect(ctx.destination);
  o.start(when);
  o.stop(when + 0.2);
}

export function sesRitimIsabet(tur: 'mukemmel' | 'iyi') {
  const ctx = sesCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const f = tur === 'mukemmel' ? 880 : 659.25;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = tur === 'mukemmel' ? 'sine' : 'triangle';
  o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(tur === 'mukemmel' ? 0.22 : 0.14, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (tur === 'mukemmel' ? 0.22 : 0.16));
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.24);
}

/** Tüm parçalar yerleşince kısa crescendo. */
export function sesZafer() {
  const ctx = ctxAl();
  if (!ctx) return;
  const skala = [523.25, 659.25, 783.99, 1046.5];
  const t0 = ctx.currentTime;
  skala.forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = i === 3 ? 'triangle' : 'sine';
    o.frequency.value = f;
    const t = t0 + i * 0.11;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.24, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.44);
  });
}
