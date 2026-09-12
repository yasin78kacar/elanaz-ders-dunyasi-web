export type FloodKategori = 'hayvanlar' | 'ciftlik' | 'dinozorlar';

export type FloodSahne = {
  id: string;
  baslik: string;
  kategori: FloodKategori;
  src: string;
};

export const FLOOD_KATEGORI_AD: Record<FloodKategori, string> = {
  hayvanlar: 'Hayvanlar',
  ciftlik: 'Çiftlik',
  dinozorlar: 'Dinozorlar',
};

export const FLOOD_SAHNELER: FloodSahne[] = [
  { id: 'fil-vahsi', baslik: 'Fil (vahşi)', kategori: 'hayvanlar', src: '/boyama-yeni/fil-vahsi.png' },
  { id: 'kopek-park', baslik: 'Köpek (park)', kategori: 'hayvanlar', src: '/boyama-yeni/kopek-park.png' },
  { id: 'ciftlik-avlu', baslik: 'Çiftlik avlusu', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik-avlu.png' },
  { id: 'dino-orman', baslik: 'Dino (orman)', kategori: 'dinozorlar', src: '/boyama-yeni/dino-orman.png' },

  { id: 'alpaka', baslik: 'Alpaka', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/alpaka.png' },
  { id: 'ayi', baslik: 'Ayı', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/ayi.png' },
  { id: 'kunduz', baslik: 'Kunduz (köprü)', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kunduz.png' },
  { id: 'aslan', baslik: 'Aslan', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/aslan.png' },
  { id: 'flamingo', baslik: 'Flamingo', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/flamingo.png' },
  { id: 'kanguru', baslik: 'Kanguru', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kanguru.png' },
  { id: 'kaplan', baslik: 'Kaplan', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kaplan.png' },
  { id: 'kedi', baslik: 'Kedi', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kedi.png' },
  { id: 'panda', baslik: 'Panda', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/panda.png' },
  { id: 'rakun', baslik: 'Rakun', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/rakun.png' },
  { id: 'bukalemun', baslik: 'Bukalemun', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/bukalemun.png' },
  { id: 'yunus', baslik: 'Yunus', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/yunus.png' },
  { id: 'ahtapot', baslik: 'Ahtapot', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/ahtapot.png' },
  { id: 'horoz', baslik: 'Horoz', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/horoz.png' },
  { id: 'kaplumbaga', baslik: 'Kaplumbağa', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kara-kaplumbaga.png' },
  { id: 'hindi', baslik: 'Hindi', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/hindi.png' },
  { id: 'kaplumbaga-yuzme', baslik: 'Kaplumbağa (yüzüyor)', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kaplumbaga-yuzme.png' },
  { id: 'istiridye', baslik: 'İstiridye', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/istiridye.png' },
  { id: 'kurbaga', baslik: 'Kurbağa', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/kurbaga.png' },
  { id: 'oklu-kirpi', baslik: 'Oklu kirpi', kategori: 'hayvanlar', src: '/boyama-yeni/hayvanlar/oklu-kirpi.png' },
];
