export type IkonId =
  | 'elma' | 'muz' | 'karpuz' | 'uzum' | 'portakal'
  | 'kedi' | 'kopek' | 'kus' | 'balik' | 'tavsan' | 'ari' | 'kurbaga'
  | 'saat' | 'kalem' | 'kitap' | 'semsiye' | 'top' | 'anahtar'
  | 'gunes' | 'ay' | 'yagmur' | 'kar' | 'gokkusagi' | 'agac' | 'ev';

export type Bilmece = {
  id: string;
  metin: string;
  dogru: IkonId;
  celdirici: [IkonId, IkonId, IkonId];
};

export const ISIM: Record<IkonId, string> = {
  elma: 'elma',
  muz: 'muz',
  karpuz: 'karpuz',
  uzum: 'üzüm',
  portakal: 'portakal',
  kedi: 'kedi',
  kopek: 'köpek',
  kus: 'kuş',
  balik: 'balık',
  tavsan: 'tavşan',
  ari: 'arı',
  kurbaga: 'kurbağa',
  saat: 'saat',
  kalem: 'kalem',
  kitap: 'kitap',
  semsiye: 'şemsiye',
  top: 'top',
  anahtar: 'anahtar',
  gunes: 'güneş',
  ay: 'ay',
  yagmur: 'yağmur',
  kar: 'kar',
  gokkusagi: 'gökkuşağı',
  agac: 'ağaç',
  ev: 'ev',
};

export const BILMECELER: Bilmece[] = [
  { id: 'b01', metin: 'Kırmızı, yuvarlak, ağaçta yetişir. Tatlıdır — ben neyim?', dogru: 'elma', celdirici: ['muz', 'top', 'portakal'] },
  { id: 'b02', metin: 'Sarı ve uzunum. Kabuğum soyulunca yenirim — ben neyim?', dogru: 'muz', celdirici: ['elma', 'kalem', 'portakal'] },
  { id: 'b03', metin: 'Dışım yeşil, içim kırmızı. Yazın dilim dilim kesilirim.', dogru: 'karpuz', celdirici: ['elma', 'top', 'uzum'] },
  { id: 'b04', metin: 'Salkım salkım dururum. Küçük tanelerim tek tek koparılır.', dogru: 'uzum', celdirici: ['elma', 'karpuz', 'ari'] },
  { id: 'b05', metin: 'Turuncu kabuğum soyulur. Suyum kahvaltıda içilir.', dogru: 'portakal', celdirici: ['elma', 'gunes', 'muz'] },
  { id: 'b06', metin: 'Miyavlarım. Bıyığım var, fareyi kovalarım.', dogru: 'kedi', celdirici: ['kopek', 'tavsan', 'kus'] },
  { id: 'b07', metin: 'Havlarım. Kuyruğumu sallayınca mutlu olduğum anlaşılır.', dogru: 'kopek', celdirici: ['kedi', 'tavsan', 'kurbaga'] },
  { id: 'b08', metin: 'Kanatlarım var, gökyüzünde uçarım. Yuvamı ağaca yaparım.', dogru: 'kus', celdirici: ['ari', 'kedi', 'balik'] },
  { id: 'b09', metin: 'Suda yaşarım. Pulum parlaktır, solungacımla nefes alırım.', dogru: 'balik', celdirici: ['kurbaga', 'kus', 'karpuz'] },
  { id: 'b10', metin: 'Kulaklarım çok uzundur. Havuç yerim, zıplayarak giderim.', dogru: 'tavsan', celdirici: ['kedi', 'kurbaga', 'kopek'] },
  { id: 'b11', metin: 'Vızıldarım. Çiçekten bal toplarım.', dogru: 'ari', celdirici: ['kus', 'kurbaga', 'elma'] },
  { id: 'b12', metin: 'Göl kenarında yaşarım. Vak vak derim, uzun zıplarım.', dogru: 'kurbaga', celdirici: ['balik', 'tavsan', 'ari'] },
  { id: 'b13', metin: 'Tik tak ederim. Zamanı gösteririm.', dogru: 'saat', celdirici: ['ay', 'gunes', 'anahtar'] },
  { id: 'b14', metin: 'Ucum sivridir. Deftere yazı yazarım.', dogru: 'kalem', celdirici: ['kitap', 'anahtar', 'muz'] },
  { id: 'b15', metin: 'Sayfalarım çevrilir. İçimde hikaye vardır.', dogru: 'kitap', celdirici: ['kalem', 'ev', 'saat'] },
  { id: 'b16', metin: 'Yağmur yağınca açılırım. Başını ıslatmam.', dogru: 'semsiye', celdirici: ['yagmur', 'agac', 'ev'] },
  { id: 'b17', metin: 'Yuvarlağım, zıplarım. Bahçede ayakla sürülürüm.', dogru: 'top', celdirici: ['elma', 'karpuz', 'saat'] },
  { id: 'b18', metin: 'Kapının kilidini açarım. Cebinde dururum.', dogru: 'anahtar', celdirici: ['kalem', 'saat', 'kitap'] },
  { id: 'b19', metin: 'Gündüz gökte parlarım. Her yeri ısıtırım.', dogru: 'gunes', celdirici: ['ay', 'portakal', 'gokkusagi'] },
  { id: 'b20', metin: 'Gece gökte dururum. Bazen ince hilal olurum.', dogru: 'ay', celdirici: ['gunes', 'saat', 'kar'] },
  { id: 'b21', metin: 'Gökyüzünden damla damla inerim. Yeri ıslatırım.', dogru: 'yagmur', celdirici: ['kar', 'semsiye', 'gokkusagi'] },
  { id: 'b22', metin: 'Kışın yağarım, beyazım. Elde tutulunca eririm.', dogru: 'kar', celdirici: ['yagmur', 'ay', 'top'] },
  { id: 'b23', metin: 'Yağmur durunca çıkarım. Yedi rengim yay gibi durur.', dogru: 'gokkusagi', celdirici: ['yagmur', 'gunes', 'ay'] },
  { id: 'b24', metin: 'Köküm topraktadır. Yaprağım gölge verir.', dogru: 'agac', celdirici: ['ev', 'elma', 'semsiye'] },
  { id: 'b25', metin: 'Çatım, kapım, pencerem var. İçimde oturulur.', dogru: 'ev', celdirici: ['agac', 'kitap', 'saat'] },
];
