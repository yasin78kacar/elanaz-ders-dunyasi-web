import { useEffect, useRef, useState } from 'react';

/** Maarif harf sırası. İkon yolu ya mevcut İngilizce OpenMoji dosyası ya da public/harfler/ikonlar. */

type HarfKarti = {
  harf: string;
  kelime: string;
  ses: string;
  ikon: string;
};

const ING = '/ingilizce/ikonlar/';
const YENI = '/harfler/ikonlar/';

const GRUPLAR: { baslik: string; kartlar: HarfKarti[] }[] = [
  {
    baslik: '1. Grup',
    kartlar: [
      { harf: 'a', kelime: 'arı', ses: '01_ari', ikon: ING + 'bee.svg' },
      { harf: 'n', kelime: 'nar', ses: '02_nar', ikon: YENI + 'nar.svg' },
      { harf: 'e', kelime: 'el', ses: '03_el', ikon: ING + 'hand.svg' },
      { harf: 't', kelime: 'top', ses: '04_top', ikon: ING + 'ball.svg' },
      { harf: 'i', kelime: 'inek', ses: '05_inek', ikon: ING + 'cow.svg' },
      { harf: 'l', kelime: 'limon', ses: '06_limon', ikon: ING + 'lemon.svg' },
    ],
  },
  {
    baslik: '2. Grup',
    kartlar: [
      { harf: 'o', kelime: 'otobüs', ses: '07_otobus', ikon: ING + 'bus.svg' },
      { harf: 'k', kelime: 'kuş', ses: '08_kus', ikon: ING + 'bird.svg' },
      { harf: 'u', kelime: 'uçak', ses: '09_ucak', ikon: ING + 'airplane.svg' },
      { harf: 'r', kelime: 'roket', ses: '10_roket', ikon: ING + 'rocket.svg' },
      { harf: 'ı', kelime: 'ıstakoz', ses: '11_istakoz', ikon: YENI + 'istakoz.svg' },
      { harf: 'm', kelime: 'muz', ses: '12_muz', ikon: ING + 'banana.svg' },
    ],
  },
  {
    baslik: '3. Grup',
    kartlar: [
      { harf: 'ü', kelime: 'üzüm', ses: '13_uzum', ikon: ING + 'grapes.svg' },
      { harf: 's', kelime: 'saat', ses: '14_saat', ikon: ING + 'clock.svg' },
      { harf: 'ö', kelime: 'ördek', ses: '15_ordek', ikon: ING + 'duck.svg' },
      { harf: 'y', kelime: 'yıldız', ses: '16_yildiz', ikon: ING + 'star.svg' },
      { harf: 'd', kelime: 'dondurma', ses: '17_dondurma', ikon: ING + 'icecream.svg' },
      { harf: 'z', kelime: 'zürafa', ses: '18_zurafa', ikon: ING + 'giraffe.svg' },
    ],
  },
  {
    baslik: '4. Grup',
    kartlar: [
      { harf: 'ç', kelime: 'çiçek', ses: '19_cicek', ikon: YENI + 'lale.svg' },
      { harf: 'b', kelime: 'balık', ses: '20_balik', ikon: ING + 'fish.svg' },
      { harf: 'g', kelime: 'gemi', ses: '21_gemi', ikon: ING + 'ship.svg' },
      { harf: 'c', kelime: 'ceket', ses: '22_ceket', ikon: ING + 'coat.svg' },
      { harf: 'ş', kelime: 'şemsiye', ses: '23_semsiye', ikon: ING + 'umbrella.svg' },
    ],
  },
  {
    baslik: '5. Grup',
    kartlar: [
      { harf: 'p', kelime: 'pasta', ses: '24_pasta', ikon: ING + 'cake.svg' },
      { harf: 'h', kelime: 'horoz', ses: '25_horoz', ikon: YENI + 'horoz.svg' },
      { harf: 'v', kelime: 'voleybol', ses: '26_voleybol', ikon: ING + 'volleyball.svg' },
      { harf: 'ğ', kelime: 'dağ', ses: '27_dag', ikon: ING + 'mountain.svg' },
      { harf: 'f', kelime: 'fil', ses: '28_fil', ikon: ING + 'elephant.svg' },
      { harf: 'j', kelime: 'jimnastik', ses: '29_jimnastik', ikon: YENI + 'jimnastik.svg' },
    ],
  },
];

function harfCifti(harf: string): string {
  return harf.toLocaleUpperCase('tr-TR') + harf.toLocaleLowerCase('tr-TR');
}

function kelimeVurgu(kelime: string, harf: string) {
  const hedef = harf.toLocaleLowerCase('tr-TR');
  const harfler = [...kelime];
  const yer = harfler.findIndex((h) => h.toLocaleLowerCase('tr-TR') === hedef);
  if (yer < 0) return kelime;
  return (
    <>
      {harfler.slice(0, yer).join('')}
      <strong className="harf-vurgu">{harfler[yer]}</strong>
      {harfler.slice(yer + 1).join('')}
    </>
  );
}

export default function HarfleriTaniyalim() {
  const sesRef = useRef<HTMLAudioElement | null>(null);
  const [calan, setCalan] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      sesRef.current?.pause();
    };
  }, []);

  const cal = (anahtar: string, dosya: string) => {
    sesRef.current?.pause();
    const ses = new Audio(`/harfler/ses/${dosya}.mp3`);
    sesRef.current = ses;
    ses.onerror = () => {
      if (sesRef.current === ses) setCalan(null);
    };
    ses.onended = () => {
      if (sesRef.current === ses) setCalan(null);
    };
    ses.play().then(() => setCalan(anahtar)).catch(() => setCalan(null));
  };

  return (
    <div className="harf-bolum">
      {GRUPLAR.map((grup) => (
        <section key={grup.baslik} className="harf-grup" aria-label={grup.baslik}>
          <h2 className="harf-grup-baslik">{grup.baslik}</h2>
          <div className="harf-izgara">
            {grup.kartlar.map((kart) => {
              const anahtar = kart.ses;
              const cift = harfCifti(kart.harf);
              return (
                <button
                  key={anahtar}
                  type="button"
                  className={'harf-kart' + (calan === anahtar ? ' harf-kart--caliyor' : '')}
                  aria-label={`${cift}, ${kart.kelime}`}
                  onClick={() => cal(anahtar, kart.ses)}
                >
                  <span className="harf-cift">{cift}</span>
                  <img src={kart.ikon} alt="" width={72} height={72} draggable={false} />
                  <span className="harf-kelime">{kelimeVurgu(kart.kelime, kart.harf)}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
