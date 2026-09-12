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

  { id: 'ciftlik-inek', baslik: 'İnek', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/inek.png' },
  { id: 'ciftlik-domuz', baslik: 'Domuz', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz.png' },
  { id: 'ciftlik-domuz-aile', baslik: 'Domuz ailesi', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-aile.png' },
  { id: 'ciftlik-domuz-yavru', baslik: 'Domuz yavruları', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-yavru.png' },
  { id: 'ciftlik-domuz-camur', baslik: 'Domuzlar (çamur)', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-camur.png' },
  { id: 'ciftlik-domuz-yem', baslik: 'Domuzlar (yem)', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-yem.png' },
  { id: 'ciftlik-domuz-gecit', baslik: 'Domuz geçidi', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-gecit.png' },
  { id: 'ciftlik-domuz-kumes', baslik: 'Domuz ve kümes', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-kumes.png' },
  { id: 'ciftlik-domuz-sebze', baslik: 'Domuzlar (sebze)', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/domuz-sebze.png' },
  { id: 'ciftlik-ordekler', baslik: 'Ördekler', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/ordekler.png' },
  { id: 'ciftlik-traktor', baslik: 'Traktör', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/traktor.png' },
  { id: 'ciftlik-isler', baslik: 'Çiftlik işleri', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/isler.png' },
  { id: 'ciftlik-dans', baslik: 'Ahır dansı', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/dans.png' },
  { id: 'ciftlik-panayir', baslik: 'Köy panayırı', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/panayir.png' },
  { id: 'ciftlik-piknik', baslik: 'Çiftlik pikniği', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/piknik.png' },
  { id: 'ciftlik-hayvanlar', baslik: 'Çiftlik hayvanları', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/hayvanlar-cimen.png' },
  { id: 'ciftlik-karisik', baslik: 'Çiftlik karışık', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/karisik.png' },
  { id: 'ciftlik-mevsim-1', baslik: 'Çiftlik mevsimleri', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/mevsim-1.png' },
  { id: 'ciftlik-mevsim-2', baslik: 'Çiftlik mevsimleri 2', kategori: 'ciftlik', src: '/boyama-yeni/ciftlik/mevsim-2.png' },

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
