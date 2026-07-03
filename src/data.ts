// Ders verileri: ders basina dinamik import -> Vite her dersi ayri chunk yapar.
// Cocuk hangi derse dokunursa yalniz o dosya iner (ilk acilis kucuk kalir).
// Bu runtime fetch degildir; Vite'in module sistemi build sirasinda paketler.

const yukleyiciler: { [key: string]: () => Promise<any> } = {
  math:      () => import('./data/aktarilan/matematik.json'),
  turkce:    () => import('./data/aktarilan/turkce.json'),
  fen:       () => import('./data/aktarilan/fen.json'),
  hayat:     () => import('./data/aktarilan/hayat.json'),
  ingilizce: () => import('./data/aktarilan/ingilizce.json'),
  gorsel:    () => import('./data/aktarilan/gorsel.json'),
  zeka:      () => import('./data/aktarilan/zeka.json'),
};

const onbellek: { [key: string]: any[] } = {};

export async function dersYukle(folder: string): Promise<any[]> {
  if (onbellek[folder]) return onbellek[folder];
  const yukleyici = yukleyiciler[folder];
  if (!yukleyici) return [];
  const mod = await yukleyici();
  onbellek[folder] = (mod.default || mod) as any[];
  return onbellek[folder];
}

// Hikayeler kucuk; HikayeKosesi acilinca dinamik yuklenir
export async function hikayeleriYukle() {
  const [h, ih] = await Promise.all([
    import('./data/aktarilan/hikayeler.json'),
    import('./data/aktarilan/ingilizce_hikayeler.json'),
  ]);
  return {
    hikayeler: (h.default || h) as { id: string; baslik: string; seviye: number; sayfalar: string[] }[],
    ingilizceHikayeler: (ih.default || ih) as { id: string; baslik: string; seviye: number; sayfalar: string[] }[],
  };
}
