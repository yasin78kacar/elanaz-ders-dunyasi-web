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
