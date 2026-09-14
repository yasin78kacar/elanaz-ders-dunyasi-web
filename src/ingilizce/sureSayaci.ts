import { useEffect, useRef } from 'react';
import { sureEkle } from './kayit';

const PENCERE_MS = 60_000;
const KAYIT_SN = 10;

export function useSureSayaci(aktifMi: boolean) {
  const birikenRef = useRef(0);
  const tikRef = useRef<number | null>(null);
  const pencereRef = useRef<number | null>(null);

  useEffect(() => {
    if (!aktifMi) return;

    const tikDurdur = () => {
      if (tikRef.current != null) {
        window.clearInterval(tikRef.current);
        tikRef.current = null;
      }
    };

    const pencereDurdur = () => {
      if (pencereRef.current != null) {
        window.clearTimeout(pencereRef.current);
        pencereRef.current = null;
      }
    };

    const birikeniYaz = () => {
      if (birikenRef.current > 0) {
        sureEkle(birikenRef.current);
        birikenRef.current = 0;
      }
    };

    const sayaciDurdur = () => {
      tikDurdur();
      pencereDurdur();
      birikeniYaz();
    };

    const tikBaslat = () => {
      if (tikRef.current != null) return;
      tikRef.current = window.setInterval(() => {
        birikenRef.current += 1;
        if (birikenRef.current >= KAYIT_SN) {
          sureEkle(birikenRef.current);
          birikenRef.current = 0;
        }
      }, 1000);
    };

    const etkilesim = () => {
      if (document.visibilityState === 'hidden') return;
      pencereDurdur();
      pencereRef.current = window.setTimeout(() => {
        tikDurdur();
        birikeniYaz();
        pencereRef.current = null;
      }, PENCERE_MS);
      tikBaslat();
    };

    const gizlilik = () => {
      if (document.visibilityState === 'hidden') sayaciDurdur();
    };

    document.addEventListener('pointerdown', etkilesim);
    document.addEventListener('keydown', etkilesim);
    document.addEventListener('visibilitychange', gizlilik);

    return () => {
      document.removeEventListener('pointerdown', etkilesim);
      document.removeEventListener('keydown', etkilesim);
      document.removeEventListener('visibilitychange', gizlilik);
      sayaciDurdur();
    };
  }, [aktifMi]);
}
