const PIN_ANAHTAR = 'dersdunyasi_veli_pin';

function pinGizle(pin: string): string {
  const ters = [...pin].reverse().join('');
  const n = pin.length;
  let hex = '';
  for (let i = 0; i < ters.length; i++) {
    hex += (ters.charCodeAt(i) ^ n).toString(16).padStart(2, '0');
  }
  return hex;
}

export function pinVarMi(): boolean {
  try {
    const ham = localStorage.getItem(PIN_ANAHTAR);
    return typeof ham === 'string' && ham.length > 0;
  } catch {
    return false;
  }
}

export function pinBelirle(pin: string): void {
  try {
    localStorage.setItem(PIN_ANAHTAR, pinGizle(pin));
  } catch {
    /* localStorage dolu veya kapalı */
  }
}

export function pinDogrula(girilenPin: string): boolean {
  try {
    const ham = localStorage.getItem(PIN_ANAHTAR);
    if (typeof ham !== 'string' || ham.length === 0) return false;
    return ham === pinGizle(girilenPin);
  } catch {
    return false;
  }
}

export function pinSifirla(): void {
  try {
    localStorage.removeItem(PIN_ANAHTAR);
  } catch {
    /* localStorage kapalı */
  }
}
