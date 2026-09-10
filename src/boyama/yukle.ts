import siraHam from '../data/boyama/sira.json' with { type: 'json' };
import type { Kategori, SayfaVeri } from './tipler';

export type SayfaOzet = { id: string; kategori: Kategori };

export const SAYFA_SIRA: SayfaOzet[] = (siraHam as { sira: SayfaOzet[] }).sira;

/** Vite her kategori JSON'unu ayrı chunk yapar; ilk açılışta inmez. */
const yukleyiciler = import.meta.glob('../data/boyama/kategoriler/*.json');

type Paket = { sayfalar: SayfaVeri[] };

const onbellek: Partial<Record<string, SayfaVeri[]>> = {};
const idHarita = new Map<string, SayfaVeri>();

function paketAl(mod: unknown): SayfaVeri[] {
  const m = mod as { default?: Paket } & Paket;
  return m.default?.sayfalar ?? m.sayfalar ?? [];
}

export async function kategoriYukle(kategori: Kategori): Promise<SayfaVeri[]> {
  const elde = onbellek[kategori];
  if (elde) return elde;
  const yol = `../data/boyama/kategoriler/${kategori}.json`;
  const yukle = yukleyiciler[yol];
  if (!yukle) return [];
  const sayfalar = paketAl(await yukle());
  onbellek[kategori] = sayfalar;
  for (const s of sayfalar) idHarita.set(s.id, s);
  return sayfalar;
}

export async function sayfaYukle(ix: number): Promise<SayfaVeri | null> {
  const ozet = SAYFA_SIRA[ix];
  if (!ozet) return null;
  const hazir = idHarita.get(ozet.id);
  if (hazir) return hazir;
  const liste = await kategoriYukle(ozet.kategori);
  return liste.find((s) => s.id === ozet.id) ?? null;
}
