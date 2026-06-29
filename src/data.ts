import turkce_50 from './data/turkce_50.json';
import fen_50 from './data/fen_50.json';
import hayat_50 from './data/hayat_50.json';
import english_tema_1_2 from './data/english/english_tema_1_2.json';
import all_questions from './data/all_questions.json';

export const dataMap: { [key: string]: any } = {
  turkce: turkce_50,
  fen: fen_50,
  hayat: hayat_50,
  ingilizce: english_tema_1_2,
  math: all_questions
};
