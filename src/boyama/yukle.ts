import ham from '../data/boyama/sayfalar.json' with { type: 'json' };
import type { SayfaVeri } from './tipler';

const paket = ham as { sayfalar: SayfaVeri[] };

export const SAYFALAR: SayfaVeri[] = paket.sayfalar;
