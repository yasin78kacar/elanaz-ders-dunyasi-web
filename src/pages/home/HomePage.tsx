import { useRef, type CSSProperties } from 'react';
import { Icon, type IconName } from './Icon';
import './home.css';

/** Canlı profil kaydı ile aynı: { ad, sinif }. Tasarım adı ChildProfile. */
export type ChildProfile = {
  ad: string;
  sinif: string;
};

export type HomeRoute =
  | 'matematik'
  | 'türkçe'
  | 'fen'
  | 'hayat'
  | 'ingilizce'
  | 'sosyal'
  | 'sanat'
  | 'zeka-dikkat'
  | 'test/deneme'
  | 'hikaye-kosesi'
  | 'boyama-kosesi'
  | 'video-kosesi'
  | 'mini-oyunlar'
  | 'ogrenme-kosesi'
  | 'besn1k'
  | 'hata-kutusu'
  | 'siralama'
  | 'ilerleme'
  | 'hakkinda'
  | 'ingilizce-ogren';

export const SUBJECT_ROUTE_TO_LABEL: Record<string, string> = {
  matematik: 'Matematik',
  'türkçe': 'Türkçe',
  fen: 'Fen Bilimleri',
  hayat: 'Hayat Bilgisi',
  ingilizce: 'İngilizce',
  sosyal: 'Sosyal Bilgiler',
  sanat: 'Görsel Sanatlar',
  'zeka-dikkat': 'Zeka-Dikkat',
};

const AVATAR_COLORS = ['#7f77dd', '#1fa893', '#ee6a4e', '#f2a93b', '#3d8bfd', '#d96a9a', '#575fcc', '#a855f7'];

type SubjectCard = {
  name: string;
  icon: IconName;
  route: HomeRoute;
  color: string;
  colorBg: string;
  gradeLabel: string;
  grades: number[];
};

type FeatureCard = {
  name: string;
  desc: string;
  icon: IconName;
  route: HomeRoute;
  count: string;
  variant: 'story' | 'coloring' | 'games' | 'learn' | 'besn1k' | 'englishLearn' | 'video';
};

const SUBJECTS: SubjectCard[] = [
  { name: 'Matematik', icon: 'math', route: 'matematik', color: 'var(--coral)', colorBg: 'var(--coral-100)', gradeLabel: '1–4. sınıf', grades: [1, 2, 3, 4] },
  { name: 'Türkçe', icon: 'turkish', route: 'türkçe', color: 'var(--teal)', colorBg: 'var(--teal-100)', gradeLabel: '1–4. sınıf', grades: [1, 2, 3, 4] },
  { name: 'Fen Bilimleri', icon: 'science', route: 'fen', color: 'var(--blue)', colorBg: 'var(--blue-100)', gradeLabel: '1–4. sınıf', grades: [1, 2, 3, 4] },
  { name: 'Hayat Bilgisi', icon: 'life', route: 'hayat', color: 'var(--amber)', colorBg: 'var(--amber-100)', gradeLabel: '1–4. sınıf', grades: [1, 2, 3, 4] },
  { name: 'İngilizce', icon: 'english', route: 'ingilizce', color: 'var(--rose)', colorBg: 'var(--rose-100)', gradeLabel: '2–4. sınıf', grades: [2, 3, 4] },
  { name: 'Sosyal Bilgiler', icon: 'social', route: 'sosyal', color: 'var(--indigo)', colorBg: 'var(--indigo-100)', gradeLabel: '4. sınıf', grades: [4] },
  { name: 'Görsel Sanatlar', icon: 'art', route: 'sanat', color: 'var(--violet)', colorBg: 'var(--violet-100)', gradeLabel: '2. sınıf', grades: [2] },
  { name: 'Zeka-Dikkat', icon: 'brain', route: 'zeka-dikkat', color: 'var(--purple-600)', colorBg: 'var(--purple-100)', gradeLabel: '1–4. sınıf', grades: [1, 2, 3, 4] },
];

const FEATURES: FeatureCard[] = [
  { name: 'Hikaye Köşesi', desc: 'Oku, dinle, anladın mı?', icon: 'story', route: 'hikaye-kosesi', count: 'Oku', variant: 'story' },
  { name: 'Boyama Köşesi', desc: 'Tıkla, boya, kutla!', icon: 'coloring', route: 'boyama-kosesi', count: '126', variant: 'coloring' },
  { name: 'Video Köşesi', desc: 'Kısa ders anlatımları', icon: 'play', route: 'video-kosesi', count: 'İzle', variant: 'video' },
  { name: 'Mini Oyunlar', desc: '17 eğlenceli mini oyun', icon: 'games', route: 'mini-oyunlar', count: '17', variant: 'games' },
  { name: 'Öğrenme Köşesi', desc: 'Soru kelimeleri & saat okuma', icon: 'clock', route: 'ogrenme-kosesi', count: '4 tema', variant: 'learn' },
  { name: '5N1K', desc: 'Kim? Ne? Nerede? Ne zaman? Neden? Nasıl?', icon: 'search', route: 'besn1k', count: 'Tablo', variant: 'besn1k' },
  { name: 'İngilizce Öğreniyorum', desc: 'Alfabe, kelimeler ve okunuşları', icon: 'abc', route: 'ingilizce-ogren', count: '127 kelime', variant: 'englishLearn' },
];

const CORNER_CARDS: { name: string; icon: IconName; route: HomeRoute }[] = [
  { name: 'Hata Kutusu', icon: 'box', route: 'hata-kutusu' },
  { name: 'Sıralama', icon: 'trophy', route: 'siralama' },
  { name: 'İlerleme', icon: 'chart', route: 'ilerleme' },
  { name: 'Hakkında', icon: 'info', route: 'hakkinda' },
];

export type HomePageProps = {
  profiles: ChildProfile[];
  activeName: string;
  questionCount: string;
  onSelectProfile: (ad: string) => void;
  onAddProfile: () => void;
  onChangeProfile: () => void;
  onNavigate: (route: HomeRoute) => void;
  onVeliAc?: () => void;
};

export function HomePage({
  profiles,
  activeName,
  questionCount,
  onSelectProfile,
  onAddProfile,
  onChangeProfile,
  onNavigate,
  onVeliAc,
}: HomePageProps) {
  const dersRef = useRef<HTMLElement>(null);
  const aktif = profiles.find((p) => p.ad === activeName);
  const sinifNo = Number(aktif?.sinif || '2');
  const visibleSubjects = SUBJECTS.filter((s) => s.grades.includes(sinifNo));

  return (
    <div className="home">
      <header className="home-topbar">
        <button type="button" className="home-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="home-brand-icon">
            <Icon name="logo" size={22} />
          </span>
          <span className="home-brand-name">
            Ders Dünyası
            <small>İlkokul 1–4</small>
          </span>
        </button>
        <button type="button" className="home-topbar-cta" onClick={onChangeProfile}>
          <Icon name="user" size={16} />
          {aktif ? aktif.ad : 'Profil seç'}
        </button>
      </header>

      <section className="home-hero">
        <div className="home-hero-badge">
          <Icon name="sparkles" size={14} />
          İlkokul 1–4 · güvenli öğrenme
        </div>
        <h1>
          Öğrenmek <span className="accent">eğlenceli</span>
        </h1>
        <p>
          {aktif
            ? `Merhaba ${aktif.ad}! Ders seç, hikaye oku, boya ya da oyun oyna.`
            : 'Dersler, hikayeler, boyama ve oyunlar — hepsi bir arada.'}
        </p>
        <div className="home-hero-actions">
          <button
            type="button"
            className="home-btn home-btn-light"
            onClick={() => dersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <Icon name="play" size={16} />
            Derslere başla
          </button>
          <button type="button" className="home-btn home-btn-ghost" onClick={() => onNavigate('hikaye-kosesi')}>
            <Icon name="story" size={16} />
            Hikaye Köşesi
          </button>
        </div>
        <ul className="home-hero-stats">
          <li>
            <strong>{questionCount}</strong>
            <span>Soru</span>
          </li>
          <li>
            <strong>{visibleSubjects.length}</strong>
            <span>Ders</span>
          </li>
          <li>
            <strong>17</strong>
            <span>Oyun</span>
          </li>
        </ul>
      </section>

      <section className="home-section">
        <div className="home-section-title">
          <span className="icon-wrap">
            <Icon name="user" size={18} />
          </span>
          <h2>Kim oynuyor?</h2>
        </div>
        <div className="home-profile-strip">
          {profiles.map((p, i) => (
            <button
              key={p.ad}
              type="button"
              className={`home-profile${p.ad === activeName ? ' active' : ''}`}
              onClick={() => onSelectProfile(p.ad)}
            >
              <span
                className="home-profile-avatar"
                style={{ '--pc': AVATAR_COLORS[i % AVATAR_COLORS.length] } as CSSProperties}
              >
                <Icon name="user" size={22} />
              </span>
              <span>{p.ad}</span>
              <small>{p.sinif}. sınıf</small>
            </button>
          ))}
          <button type="button" className="home-profile home-profile-add" onClick={onAddProfile}>
            <span className="home-profile-avatar">
              <Icon name="plus" size={22} />
            </span>
            <span>Yeni</span>
          </button>
        </div>
      </section>

      <section className="home-section">
        <button type="button" className="home-exam" onClick={() => onNavigate('test/deneme')}>
          <span className="home-exam-icon">
            <Icon name="test" size={26} />
          </span>
          <span className="home-exam-text">
            <strong>Deneme Sınavı</strong>
            <span>Karışık ders test soruları</span>
          </span>
          <span className="home-exam-arrow">
            <Icon name="arrowRight" size={18} />
          </span>
        </button>
      </section>

      <section className="home-section" ref={dersRef} id="home-dersler">
        <div className="home-section-title">
          <span className="icon-wrap">
            <Icon name="star" size={18} />
          </span>
          <h2>Bir ders seç</h2>
        </div>
        <div className="home-subject-grid">
          {visibleSubjects.map((s) => (
            <button
              key={s.route}
              type="button"
              className="home-subject"
              style={{ '--sc': s.color, '--sc-bg': s.colorBg } as CSSProperties}
              onClick={() => onNavigate(s.route)}
            >
              <span className="home-subject-icon">
                <Icon name={s.icon} size={22} />
              </span>
              <span className="home-subject-name">{s.name}</span>
              <span className="home-subject-grade">{s.gradeLabel}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-title">
          <span className="icon-wrap">
            <Icon name="sparkles" size={18} />
          </span>
          <h2>Köşeler</h2>
        </div>
        <div className="home-feature-list">
          {FEATURES.map((f) => (
            <button
              key={f.route}
              type="button"
              className={`home-feature home-feature--${f.variant}`}
              onClick={() => onNavigate(f.route)}
            >
              <span className="home-feature-icon">
                <Icon name={f.icon} size={26} />
              </span>
              <span className="home-feature-text">
                <strong>{f.name}</strong>
                <span>{f.desc}</span>
              </span>
              <span className="home-feature-count">{f.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-title">
          <span className="icon-wrap">
            <Icon name="user" size={18} />
          </span>
          <h2>Benim Köşem</h2>
        </div>
        <div className="home-corner-grid">
          {CORNER_CARDS.map((c) => (
            <button
              key={c.route}
              type="button"
              className="home-corner"
              onClick={() => onNavigate(c.route)}
            >
              <span className="home-corner-icon">
                <Icon name={c.icon} size={16} />
              </span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-trust">
          <div className="home-trust-item">
            <span className="home-trust-icon t-shield">
              <Icon name="shield" size={20} />
            </span>
            <div>
              <strong>Güvenli ve reklamsız</strong>
              <p>Çocuklar için tasarlandı. Dışarıya veri gitmez, hesap gerekmez.</p>
            </div>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-icon t-book">
              <Icon name="turkish" size={20} />
            </span>
            <div>
              <strong>İlkokul müfredatı</strong>
              <p>1–4. sınıf dersleri, kısa cümleler, günlük hayattan örnekler.</p>
            </div>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-icon t-gift">
              <Icon name="gift" size={20} />
            </span>
            <div>
              <strong>Ücretsiz oynanır</strong>
              <p>Tüm dersler, hikayeler, boyama ve oyunlar açık.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-line">
          <Icon name="lock" size={14} />
          Reklamsız · Güvenli · Ücretsiz
        </div>
        <p className="home-footer-copy">Ders Dünyası · aile içinde kullanım</p>
      </footer>
      {onVeliAc ? (
        <button type="button" className="home-veli-giris" onClick={onVeliAc} aria-label="Veli paneli">
          <Icon name="lock" size={15} />
        </button>
      ) : null}
    </div>
  );
}

export default HomePage;
