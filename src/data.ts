import matematik from './data/aktarilan/matematik.json';
import turkce from './data/aktarilan/turkce.json';
import fen from './data/aktarilan/fen.json';
import hayat from './data/aktarilan/hayat.json';
import ingilizce from './data/aktarilan/ingilizce.json';

const allPool = [
  ...(matematik as any[]),
  ...(turkce as any[]),
  ...(fen as any[]),
  ...(hayat as any[]),
  ...(ingilizce as any[]),
];

export const dataMap: { [key: string]: any } = {
  turkce: { questions: allPool },
  fen: { questions: allPool },
  hayat: { questions: allPool },
  ingilizce: { questions: allPool },
  math: { questions: allPool },
};
