import { useEffect, useState } from 'react';
import { genelOzetGetir, ingilizceOzetiGetir, konuOzetiGetir, zayifKonularGetir, type KonuTrend } from '../../lib/veliPaneli';
import { pinBelirle, pinDogrula, pinVarMi } from '../../lib/veliPaneliAuth';
import './veliPaneli.css';

type Ekran = 'pin' | 'ozet';
type Profil = { ad: string; sinif: string };

const AKTIF_KEY = 'dersdunyasi_aktif';
const PROFIL_KEY = 'dersdunyasi_profiller';
const PIN_UZUNLUK = 4;
const YANLIS_LIMIT = 3;
const BEKLE_MS = 8000;
const KONU_LIMIT = 8;

function aktifIsim(): string {
  try {
    return localStorage.getItem(AKTIF_KEY) || '';
  } catch {
    return '';
  }
}

function profilleriOku(): Profil[] {
  try {
    const ham = localStorage.getItem(PROFIL_KEY);
    if (!ham) return [];
    const oku = JSON.parse(ham) as unknown;
    if (!Array.isArray(oku)) return [];
    return oku.filter((p): p is Profil => p && typeof p.ad === 'string' && typeof p.sinif === 'string');
  } catch {
    return [];
  }
}

function sonUnlu(ad: string): string {
  for (let i = ad.length - 1; i >= 0; i--) {
    const h = ad[i];
    if ('aıA'.includes(h)) return 'a';
    if ('eiEİ'.includes(h)) return 'e';
    if ('ouOU'.includes(h)) return 'o';
    if ('öüÖÜ'.includes(h)) return 'ö';
    if (h === 'I') return 'a';
    if (h === 'i') return 'e';
  }
  return 'e';
}

function unluMu(harf: string): boolean {
  return 'aeıioöuüAEIİOÖUÜ'.includes(harf);
}

function panelBaslik(ad: string): string {
  if (!ad) return 'Veli Paneli';
  const u = sonUnlu(ad);
  const ek = u === 'a' ? 'ın' : u === 'o' ? 'un' : u === 'ö' ? 'ün' : 'in';
  const kaynastirma = unluMu(ad.slice(-1)) ? 'n' : '';
  return ad + "'" + kaynastirma + ek + ' Paneli';
}

function sadeceRakam(deger: string): string {
  return deger.replace(/\D/g, '').slice(0, PIN_UZUNLUK);
}

function trendYazi(trend: KonuTrend): string {
  if (trend === 'yükseliyor') return 'Yükseliyor';
  if (trend === 'düşüyor') return 'Düşüyor';
  if (trend === 'sabit') return 'Sabit';
  return 'Yetersiz veri';
}

function trendSinif(trend: KonuTrend): string {
  if (trend === 'yükseliyor') return 'yukseliyor';
  if (trend === 'düşüyor') return 'dusuyor';
  if (trend === 'sabit') return 'sabit';
  return 'yetersiz';
}

function VeliPaneli({ onClose }: { onClose: () => void }) {
  const [ekran, setEkran] = useState<Ekran>('pin');
  const [kurulum, setKurulum] = useState(() => !pinVarMi());
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pinHata, setPinHata] = useState('');
  const [yanlisSay, setYanlisSay] = useState(0);
  const [beklemeBitis, setBeklemeBitis] = useState<number | null>(null);
  const [beklemeSn, setBeklemeSn] = useState(0);
  const [unuttumAcik, setUnuttumAcik] = useState(false);
  const [konularAcik, setKonularAcik] = useState(false);

  const bekliyor = beklemeBitis != null && Date.now() < beklemeBitis;

  useEffect(() => {
    if (beklemeBitis == null) return;
    const tik = () => {
      const kalan = Math.ceil((beklemeBitis - Date.now()) / 1000);
      if (kalan <= 0) {
        setBeklemeBitis(null);
        setBeklemeSn(0);
        setYanlisSay(0);
        setPinHata('');
      } else {
        setBeklemeSn(kalan);
      }
    };
    tik();
    const id = window.setInterval(tik, 250);
    return () => window.clearInterval(id);
  }, [beklemeBitis]);

  const ozetAc = () => {
    setPin1('');
    setPin2('');
    setPinHata('');
    setYanlisSay(0);
    setEkran('ozet');
  };

  const pinKur = () => {
    setPinHata('');
    if (pin1.length !== PIN_UZUNLUK || pin2.length !== PIN_UZUNLUK) {
      setPinHata('4 haneli bir PIN gir.');
      return;
    }
    if (pin1 !== pin2) {
      setPinHata('PIN’ler eşleşmedi.');
      return;
    }
    pinBelirle(pin1);
    setKurulum(false);
    ozetAc();
  };

  const pinGir = () => {
    if (bekliyor) return;
    setPinHata('');
    if (pin1.length !== PIN_UZUNLUK) {
      setPinHata('4 haneli PIN gir.');
      return;
    }
    if (pinDogrula(pin1)) {
      ozetAc();
      return;
    }
    const sonraki = yanlisSay + 1;
    setYanlisSay(sonraki);
    setPin1('');
    if (sonraki >= YANLIS_LIMIT) {
      setBeklemeBitis(Date.now() + BEKLE_MS);
      setPinHata('Çok fazla yanlış deneme. Biraz bekle.');
    } else {
      setPinHata('PIN yanlış. Kalan deneme: ' + (YANLIS_LIMIT - sonraki));
    }
  };

  if (ekran === 'pin') {
    return (
      <div className="vp-wrap">
        <button type="button" className="vp-geri" onClick={onClose}>← Çık</button>
        <h1 className="vp-baslik">{kurulum ? 'PIN belirle' : 'Veli Paneli'}</h1>
        <p className="vp-aciklama">
          {kurulum
            ? 'Bu PIN yalnızca anne ve babalar içindir. 4 rakam seç ve bir kez daha yaz.'
            : 'Devam etmek için PIN’ini gir.'}
        </p>
        <label className="vp-etiket" htmlFor="vp-pin1">{kurulum ? 'PIN' : 'PIN’in'}</label>
        <input
          id="vp-pin1"
          className="vp-pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={PIN_UZUNLUK}
          value={pin1}
          disabled={bekliyor}
          onChange={(e) => setPin1(sadeceRakam(e.target.value))}
        />
        {kurulum ? (
          <>
            <label className="vp-etiket" htmlFor="vp-pin2">PIN tekrar</label>
            <input
              id="vp-pin2"
              className="vp-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={PIN_UZUNLUK}
              value={pin2}
              onChange={(e) => setPin2(sadeceRakam(e.target.value))}
            />
          </>
        ) : null}
        {pinHata ? <p className="vp-hata">{pinHata}{bekliyor && beklemeSn > 0 ? ' (' + beklemeSn + ' sn)' : ''}</p> : null}
        <button
          type="button"
          className="vp-btn"
          disabled={bekliyor}
          onClick={kurulum ? pinKur : pinGir}
        >
          {kurulum ? 'Kaydet' : 'Giriş'}
        </button>
        {!kurulum ? (
          <>
            <button type="button" className="vp-link" onClick={() => setUnuttumAcik((v) => !v)}>
              PIN’i unuttum
            </button>
            {unuttumAcik ? <p className="vp-not">Bu özellik yakında.</p> : null}
          </>
        ) : null}
      </div>
    );
  }

  const isim = aktifIsim();
  const profil = profilleriOku().find((p) => p.ad === isim);
  const genel = genelOzetGetir(isim);
  const konular = konuOzetiGetir(isim);
  const zayiflar = zayifKonularGetir(isim);
  const ingilizce = ingilizceOzetiGetir(isim);

  return (
    <div className="vp-wrap">
      <button
        type="button"
        className="vp-geri"
        onClick={onClose}
      >
        ← Çık
      </button>
      <h1 className="vp-baslik">{panelBaslik(isim)}</h1>
      {profil ? <p className="vp-aciklama">Sınıf {profil.sinif}</p> : null}

      <div className="vp-kart">
        <strong>Toplam soru</strong>
        <span>{genel.toplamSoru}</span>
      </div>
      <div className="vp-kart">
        <strong>Başarı</strong>
        <span>%{Math.round(genel.basariYuzdesi)}</span>
      </div>
      <div className="vp-kart">
        <strong>Son aktivite</strong>
        <span>{genel.sonAktivite || 'Kayıt yok'}</span>
      </div>

      <h2 className="vp-altbaslik">Konular</h2>
      {konular.length === 0 ? (
        <p className="vp-aciklama">Henüz test kaydı yok.</p>
      ) : (
        <>
          {(konularAcik ? konular : konular.slice(0, KONU_LIMIT)).map((k) => (
            <div key={k.subject + '\0' + k.theme} className="vp-kart">
              <strong>{k.subject} · {k.theme}</strong>
              <span>%{Math.round(k.ortalamaBasari)} · {k.denemeSayisi} deneme</span>
              <span className={'vp-trend vp-trend--' + trendSinif(k.trend)}>{trendYazi(k.trend)}</span>
            </div>
          ))}
          {konular.length > KONU_LIMIT ? (
            <button
              type="button"
              className="vp-link vp-konu-daha"
              onClick={() => setKonularAcik((v) => !v)}
            >
              {konularAcik ? 'Daha az göster' : `+${konular.length - KONU_LIMIT} konu daha`}
            </button>
          ) : null}
        </>
      )}

      <h2 className="vp-altbaslik">Zayıf konular</h2>
      {zayiflar.length === 0 ? (
        <p className="vp-aciklama">Hata kutusunda birikmiş konu yok.</p>
      ) : zayiflar.map((k) => (
        <div key={'z' + k.subject + '\0' + k.theme} className="vp-kart">
          <strong>{k.subject} · {k.theme}</strong>
          <span>{k.soruSayisi} farklı soru</span>
        </div>
      ))}

      {ingilizce ? (
        <>
          <h2 className="vp-altbaslik">İngilizce</h2>
          <div className="vp-kart">
            <strong>Seviye</strong>
            <span>{ingilizce.seviye}</span>
          </div>
          <div className="vp-kart">
            <strong>Çalışma süresi</strong>
            <span>{ingilizce.calismaSuresi}</span>
          </div>
          <div className="vp-kart">
            <strong>Kelime</strong>
            <span>{ingilizce.ogrenilenKelime} / {ingilizce.toplamKelime}</span>
          </div>
          <div className="vp-kart">
            <strong>Çalışılan gün</strong>
            <span>{ingilizce.calisilanGun} gün</span>
          </div>
          {ingilizce.sonSinav ? (
            <div className="vp-kart">
              <strong>Son sınav</strong>
              <span>
                {ingilizce.sonSinav.dogru}/{ingilizce.sonSinav.toplam}
                {ingilizce.sonSinav.gecti ? ' · geçti' : ' · kaldı'}
              </span>
            </div>
          ) : (
            <div className="vp-kart">
              <strong>Son sınav</strong>
              <span>Henüz sınav yok</span>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default VeliPaneli;
