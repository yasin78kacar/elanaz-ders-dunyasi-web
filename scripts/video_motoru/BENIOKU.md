# Video motoru

Kodla üretilen ders anlatım videoları (animasyon + altyazı + macOS Türkçe ses).

## Kurulum (bir kez)
    brew install ffmpeg
    pip3 install pillow

Türkçe ses: Sistem Ayarları > Erişilebilirlik > Seslendirilen İçerik > Sistem sesi > Sesleri Yönet > Türkçe > "Yelda (Enhanced)" indir.
Motor en iyi Türkçe sesi kendisi seçer. Belirli bir ses için: --ses "Yelda"

## Kullanım (proje kökünden)
    python3 scripts/video_motoru/motor.py --onizleme        # hızlı kontrol görselleri -> scripts/video_motoru/onizleme/
    python3 scripts/video_motoru/motor.py --id mat2-22      # tek video
    python3 scripts/video_motoru/motor.py                   # tüm videolar
    python3 scripts/video_motoru/motor.py --edge --eksik    # Emel sesiyle, sadece henüz üretilmemiş videolar
    python3 scripts/video_motoru/motor.py --sinif 3         # sadece 3. sınıf

Çıktı: public/videolar/*.mp4 + *.jpg, src/data/videolar.ts (otomatik; statik import, fetch yok).

## Yeni video eklemek
senaryolar.json içine yeni bir kayıt ekle. Sahne tipleri:
baslik, metin, kesir, nesne_say, onluk_birlik, sayi_dogrusu, toplama, cikarma, dizi,
paylastirma, saat, sekil, oruntu, karsilastirma, para, uzunluk, grafik, alt_alta,
alan_cevre, aci, kesir_seritleri, kap, terazi, sekil_grafigi,
kelime, kelimeler, kelime_ciftleri, hece, cumle, konum, harfler.

Nesne adı yerine emoji kullanılabilir (nesne: "🍎"). Emoji yazı tipi: fonts/NotoColorEmoji.ttf (SIL OFL 1.1).
İngilizce sahnelerde "ses": [["en", "Apple"], ["tr", "Elma"]] ile çift dilli seslendirme yapılır (--edge-en ile İngilizce ses seçilir).
Her sahnede "anlatim" zorunludur; sahne süresi seslendirme süresine göre otomatik ayarlanır.
