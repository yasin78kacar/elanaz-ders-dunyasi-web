import { useState } from 'react';
import { ses } from '../oyunlar/ses';
import { Konfeti } from '../oyunlar/Konfeti';
import '../styles/OyunIskelesi.css';
import '../styles/OyunGolge.css';

const TUR_SAYISI = 5;
const GOLGE = '#2a2438';

type Kahraman = 'elma' | 'ev' | 'agac' | 'kedi' | 'tekne' | 'kelebek';
type SekilId =
  | Kahraman
  | 'elmaYaprakYok' | 'armut'
  | 'evBacasiz' | 'ambar'
  | 'cam' | 'cali'
  | 'kediKuyruksuz' | 'tavsan'
  | 'kayik' | 'ciftYelken'
  | 'kelebekDar' | 'kus';

const KAHRAMANLAR: Kahraman[] = ['elma', 'ev', 'agac', 'kedi', 'tekne', 'kelebek'];

const AILE: Record<Kahraman, SekilId[]> = {
  elma: ['elmaYaprakYok', 'armut', 'kelebek'],
  ev: ['evBacasiz', 'ambar', 'agac'],
  agac: ['cam', 'cali', 'ev'],
  kedi: ['kediKuyruksuz', 'tavsan', 'kelebek'],
  tekne: ['kayik', 'ciftYelken', 'armut'],
  kelebek: ['kelebekDar', 'kus', 'elma'],
};

const ISIM: Record<Kahraman, string> = {
  elma: 'elma',
  ev: 'ev',
  agac: 'ağaç',
  kedi: 'kedi',
  tekne: 'tekne',
  kelebek: 'kelebek',
};

function karistir<T>(dizi: T[]): T[] {
  return [...dizi].sort(() => Math.random() - 0.5);
}

function Sekil({ id, boyali }: { id: SekilId; boyali?: boolean }) {
  const g = !boyali;
  switch (id) {
    case 'elma':
      return (
        <g>
          <path d="M60 30c26 0 36 28 36 48 0 22-16 30-36 30S24 100 24 78C24 58 34 30 60 30z" fill={g ? GOLGE : '#D4537E'} />
          <path d="M57 30v-14h7v14" fill={g ? GOLGE : '#6b3d1f'} />
          <path d="M64 22q18-12 22 6-16-2-22-6z" fill={g ? GOLGE : '#1D9E75'} />
        </g>
      );
    case 'elmaYaprakYok':
      return (
        <g>
          <path d="M60 30c26 0 36 28 36 48 0 22-16 30-36 30S24 100 24 78C24 58 34 30 60 30z" fill={GOLGE} />
          <path d="M57 30v-14h7v14" fill={GOLGE} />
        </g>
      );
    case 'armut':
      return (
        <g>
          <path d="M60 18c12 0 18 10 20 22 8 16 18 28 18 42 0 20-16 28-38 28S22 102 22 82c0-14 10-26 18-42 2-12 8-22 20-22z" fill={GOLGE} />
          <path d="M57 20v-10h6v10" fill={GOLGE} />
        </g>
      );
    case 'ev':
      return (
        <g>
          <path d="M14 62 L60 20 L106 62z" fill={g ? GOLGE : '#D85A30'} />
          <path d="M28 60v48h64V60z" fill={g ? GOLGE : '#EF9F27'} />
          <path d="M80 46v-22h14v28" fill={g ? GOLGE : '#7a3b28'} />
          <path d="M50 82h20v26H50z" fill={g ? GOLGE : '#6b3d1f'} />
        </g>
      );
    case 'evBacasiz':
      return (
        <g>
          <path d="M14 62 L60 20 L106 62z" fill={GOLGE} />
          <path d="M28 60v48h64V60z" fill={GOLGE} />
          <path d="M50 82h20v26H50z" fill={GOLGE} />
        </g>
      );
    case 'ambar':
      return (
        <g>
          <path d="M8 70 L60 32 L112 70z" fill={GOLGE} />
          <path d="M16 68v40h88V68z" fill={GOLGE} />
          <path d="M52 86h16v22H52z" fill={GOLGE} />
        </g>
      );
    case 'agac':
      return (
        <g>
          <ellipse cx="60" cy="48" rx="38" ry="34" fill={g ? GOLGE : '#1D9E75'} />
          <rect x="50" y="76" width="20" height="32" rx="3" fill={g ? GOLGE : '#6b3d1f'} />
        </g>
      );
    case 'cam':
      return (
        <g>
          <path d="M60 10 L92 48 H28z" fill={GOLGE} />
          <path d="M60 32 L100 72 H20z" fill={GOLGE} />
          <path d="M60 52 L108 100 H12z" fill={GOLGE} />
          <rect x="52" y="96" width="16" height="16" fill={GOLGE} />
        </g>
      );
    case 'cali':
      return (
        <g>
          <ellipse cx="60" cy="62" rx="42" ry="30" fill={GOLGE} />
          <ellipse cx="38" cy="78" rx="20" ry="16" fill={GOLGE} />
          <ellipse cx="82" cy="78" rx="20" ry="16" fill={GOLGE} />
        </g>
      );
    case 'kedi':
      return (
        <g>
          <path d="M38 28 L32 8 L54 24z" fill={g ? GOLGE : '#7F77DD'} />
          <path d="M82 28 L88 8 L66 24z" fill={g ? GOLGE : '#7F77DD'} />
          <circle cx="60" cy="40" r="22" fill={g ? GOLGE : '#9b93e8'} />
          <ellipse cx="58" cy="84" rx="28" ry="24" fill={g ? GOLGE : '#7F77DD'} />
          <path d="M84 88 Q108 70 98 42 Q92 60 80 78z" fill={g ? GOLGE : '#5a52c7'} />
        </g>
      );
    case 'kediKuyruksuz':
      return (
        <g>
          <path d="M38 28 L32 8 L54 24z" fill={GOLGE} />
          <path d="M82 28 L88 8 L66 24z" fill={GOLGE} />
          <circle cx="60" cy="40" r="22" fill={GOLGE} />
          <ellipse cx="58" cy="84" rx="28" ry="24" fill={GOLGE} />
        </g>
      );
    case 'tavsan':
      return (
        <g>
          <path d="M42 40 Q36 2 50 38z" fill={GOLGE} />
          <path d="M70 40 Q76 2 62 38z" fill={GOLGE} />
          <circle cx="60" cy="52" r="20" fill={GOLGE} />
          <ellipse cx="60" cy="90" rx="24" ry="20" fill={GOLGE} />
        </g>
      );
    case 'tekne':
      return (
        <g>
          <path d="M58 22v58h6V22z" fill={g ? GOLGE : '#6b3d1f'} />
          <path d="M64 26 L98 78 H64z" fill={g ? GOLGE : '#fffef2'} stroke={g ? 'none' : '#c8b88a'} strokeWidth={g ? 0 : 2} />
          <path d="M16 80 Q60 104 104 80 L94 92 Q60 110 26 92z" fill={g ? GOLGE : '#378ADD'} />
        </g>
      );
    case 'kayik':
      return (
        <g>
          <path d="M16 70 Q60 96 104 70 L94 84 Q60 104 26 84z" fill={GOLGE} />
        </g>
      );
    case 'ciftYelken':
      return (
        <g>
          <path d="M58 18v62h6V18z" fill={GOLGE} />
          <path d="M64 24 L96 72 H64z" fill={GOLGE} />
          <path d="M58 36 L28 72 H58z" fill={GOLGE} />
          <path d="M16 80 Q60 104 104 80 L94 92 Q60 110 26 92z" fill={GOLGE} />
        </g>
      );
    case 'kelebek':
      return (
        <g>
          <ellipse cx="36" cy="44" rx="26" ry="22" fill={g ? GOLGE : '#D4537E'} />
          <ellipse cx="84" cy="44" rx="26" ry="22" fill={g ? GOLGE : '#D4537E'} />
          <ellipse cx="38" cy="80" rx="20" ry="18" fill={g ? GOLGE : '#EF9F27'} />
          <ellipse cx="82" cy="80" rx="20" ry="18" fill={g ? GOLGE : '#EF9F27'} />
          <rect x="56" y="28" width="8" height="64" rx="4" fill={g ? GOLGE : '#2a2438'} />
        </g>
      );
    case 'kelebekDar':
      return (
        <g>
          <ellipse cx="40" cy="46" rx="18" ry="24" fill={GOLGE} />
          <ellipse cx="80" cy="46" rx="18" ry="24" fill={GOLGE} />
          <ellipse cx="42" cy="82" rx="14" ry="16" fill={GOLGE} />
          <ellipse cx="78" cy="82" rx="14" ry="16" fill={GOLGE} />
          <rect x="56" y="30" width="8" height="60" rx="4" fill={GOLGE} />
        </g>
      );
    case 'kus':
      return (
        <g>
          <ellipse cx="58" cy="64" rx="28" ry="18" fill={GOLGE} />
          <path d="M70 56 Q100 36 86 68z" fill={GOLGE} />
          <circle cx="36" cy="58" r="12" fill={GOLGE} />
          <path d="M24 58 L10 54 L24 64z" fill={GOLGE} />
        </g>
      );
  }
}

function turUret(tur: number, kullanilan: Kahraman[]): { hedef: Kahraman; secenekler: SekilId[] } {
  const kalan = KAHRAMANLAR.filter(k => !kullanilan.includes(k));
  const hedef = kalan[Math.floor(Math.random() * kalan.length)];
  let distract: SekilId[];
  if (tur <= 2) {
    distract = karistir(KAHRAMANLAR.filter(k => k !== hedef)).slice(0, 3);
  } else if (tur === 3) {
    const aile = AILE[hedef];
    distract = [aile[0], aile[1], karistir(KAHRAMANLAR.filter(k => k !== hedef))[0]];
  } else {
    distract = [...AILE[hedef]];
  }
  return { hedef, secenekler: karistir([hedef, ...distract]) };
}

interface Props { onBitti: (puan: number) => void; }

const OyunGolge: React.FC<Props> = ({ onBitti }) => {
  const [kullanilan, setKullanilan] = useState<Kahraman[]>([]);
  const [tur, setTur] = useState(1);
  const [durum, setDurum] = useState(() => turUret(1, []));
  const [puan, setPuan] = useState(0);
  const [seri, setSeri] = useState(0);
  const [enIyiSeri, setEnIyiSeri] = useState(0);
  const [ilkDeneme, setIlkDeneme] = useState(true);
  const [kilit, setKilit] = useState(false);
  const [parlayan, setParlayan] = useState<number | null>(null);
  const [sallanan, setSallanan] = useState<number | null>(null);
  const [konfeti, setKonfeti] = useState(false);

  const sec = (id: SekilId, idx: number) => {
    if (kilit) return;
    if (id === durum.hedef) {
      setKilit(true);
      setParlayan(idx);
      ses(true);
      const yeniSeri = seri + 1;
      setSeri(yeniSeri);
      if (yeniSeri > enIyiSeri) setEnIyiSeri(yeniSeri);
      const yeniPuan = ilkDeneme ? puan + 1 : puan;
      if (ilkDeneme) setPuan(yeniPuan);
      setKonfeti(true);
      setTimeout(() => {
        setKonfeti(false);
        setParlayan(null);
        if (tur >= TUR_SAYISI) {
          onBitti(yeniPuan);
          return;
        }
        const yeniKul = [...kullanilan, durum.hedef];
        setKullanilan(yeniKul);
        setTur(tur + 1);
        setDurum(turUret(tur + 1, yeniKul));
        setIlkDeneme(true);
        setKilit(false);
      }, 900);
    } else {
      ses(false);
      setSeri(0);
      setIlkDeneme(false);
      setSallanan(idx);
      setTimeout(() => setSallanan(null), 450);
    }
  };

  return (
    <div className="oyun-alan golge-oyun">
      <Konfeti goster={konfeti} />
      <div className="golge-ust">
        <span>Tur {tur}/{TUR_SAYISI}</span>
        <span className="golge-seri">Seri {seri}{enIyiSeri > 1 ? ` · en iyi ${enIyiSeri}` : ''}</span>
      </div>
      <div className="golge-sahne" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <Sekil id={durum.hedef} boyali />
        </svg>
      </div>
      <p className="golge-hedef">Hangi gölge bu <b>{ISIM[durum.hedef]}</b>?</p>
      <div className="golge-grid">
        {durum.secenekler.map((id, i) => (
          <button
            key={`${tur}-${id}-${i}`}
            type="button"
            className={`golge-kart${parlayan === i ? ' parla' : ''}${sallanan === i ? ' salla' : ''}`}
            onClick={() => sec(id, i)}
            disabled={kilit}
            aria-label={`Gölge ${i + 1}`}
          >
            <svg viewBox="0 0 120 120">
              <Sekil id={id} />
            </svg>
          </button>
        ))}
      </div>
      <div className="oyun-ipucu">Puan: {puan} — yanlış olursa aynı turda tekrar dene</div>
    </div>
  );
};

export default OyunGolge;
