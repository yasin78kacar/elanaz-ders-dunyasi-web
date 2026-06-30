import turkce_tema3 from './data/turkce/turkce_tema3.json';
import english_tema_1_2 from './data/english/english_tema_1_2.json';
import all_questions from './data/all_questions.json';

// Tüm soruları tek havuzda birleştir
const base = (all_questions as any).questions || [];
const extraTurkce = (turkce_tema3 as any[]) || [];
const extraEnglish = (english_tema_1_2 as any[]) || [];

// subject alanlarını normalize et (turkce -> Türkçe, ingilizce -> İngilizce)
const normalizeSubject = (s: string) => {
  const map: { [k: string]: string } = {
    turkce: 'Türkçe', ingilizce: 'İngilizce',
    fen: 'Fen Bilimleri', hayat: 'Hayat Bilgisi', math: 'Matematik'
  };
  return map[s] || s;
};

const normalized = [...extraTurkce, ...extraEnglish].map((q: any) => ({
  ...q,
  subject: normalizeSubject(q.subject)
}));

const allPool = [...base, ...normalized];

export const dataMap: { [key: string]: any } = {
  turkce: { questions: allPool },
  fen: { questions: allPool },
  hayat: { questions: allPool },
  ingilizce: { questions: allPool },
  math: { questions: allPool }
};
