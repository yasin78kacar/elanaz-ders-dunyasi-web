# PROJE DURUMU — Ders Dünyası

Bu dosya uygulamanın güncel durumunu, yapılan işleri ve bekleyen işleri
tutar. Her oturum başında okunur; bittiğinde güncellenir. Kurallar için
bkz. CLAUDE.md.

Son güncelleme: 20 Temmuz 2026

## Genel

İlkokul Türkçe eğitim web uygulaması. React + Vite + TypeScript, Vercel'de
yayında (yasinkacar.com), localStorage tabanlı çoklu profil.
Klasör: ~/Desktop/elanaz-ders-dunyasi-web · Repo: yasin78kacar/elanaz-ders-dunyasi-web
Kullanıcılar: Yasin'in kızları.

## Mevcut Yapı (bölümler ve içerik)

### Ana ekran
Büyülü masal dünyası temalı (gradyan gök, süzülen bulutlar, parlayan
yıldızlar, tepe silüeti — CSS+SVG). Profil seçimi ("Kim oynuyor?"),
ikonlu menü kartları.

### Öğrenme Köşesi (4 tema)
- Tema 1 — Soru Kelimeleri (5N1K, hikaye tabanlı): 79 soru
- Tema 2 — Saat Okuma (analog kadran, SVG): 57 soru. Grup içi karıştırma
  (shuffle) her oturumda farklı, aşama sırası korunur (tam→buçuk→çeyrek).
- Tema 3 — Boşluk Doldurma: 50 soru
- Tema 4 — Dijital Saat (12+24 saat aşamalı): 50 soru

### Hikaye Köşesi
110 Türkçe hikaye kaydı (+ İngilizce hikayeler ayrı). Her hikaye: başlık,
sayfalar, anlama soruları. Metinde "Elanaz" yazılı isim uygulama tarafından
havuzdan farklı isme otomatik çevrilir (isim-eki uyumu doğru: Ece'nin,
Ada'ya vb.).

### 5N1K (ayrı ana bölüm)
Kitaptaki gibi çizgili tablo (Kim/Nerede/Niçin/Nasıl/Ne/Ne Zaman), bir
hücre boş, şıktan seçilir. Responsive (6→3→2 sütun). 105 soru.

### Diğer
Oyunlar (7 mini oyun), ders bölümleri (Matematik/Türkçe/Fen/Hayat
Bilgisi/İngilizce).

## Yapılanlar (kronolojik özet)

- Tasarım cilası (gradyan, kartlar, profil ekranı)
- Öğrenme Köşesi Tema 1 (Soru Kelimeleri) + Tema 2 (Saat Okuma + shuffle)
- Hikaye imla düzeltmeleri (83 hata) + Türkçe isim-eki kök hatası düzeltmesi
  (Ece'ın→Ece'nin, 20 isim × tüm ekler)
- Büyülü masal sahnesi + bulut/yıldız iyileştirmesi
- Öğrenme Köşesi Tema 3 (Boşluk Doldurma, 50 soru)
- Öğrenme Köşesi Tema 4 (Dijital Saat, 50 soru, 12+24 aşamalı)
- Hikaye Köşesi: 50 şablon-kopya hikaye özgün hikayelerle değiştirildi
  (metin + 200 yeni anlama sorusu)
- 5N1K bölümü: ana ekran kartı + çizgili tablo + 105 soru
- CLAUDE.md (proje kuralları) eklendi

## Bekleyen / Ertelenen İşler

- Dark mode (vaktiyle iptal edildi; istenirse ayrı iş)
- Dijital saat: analog→dijital eşleştirme soru tipi (sonraki tur fikri)
- Genel: mevcut temalara/bölümlere soru ekleme, yeni içerik

## Önemli Teknik Notlar

- fetch→dynamic import dönüşümü GEREKSİZ (offline gerekliliği yok, karar verildi)
- Referans branch'ler: timer-yedek (ead8f28), tasarim-cila — silinmeyecek
- Üretici scriptler: gen_ogrenme.mjs (silinmeyecek), quality_control.mjs
- Yedek dosyalar ~/Downloads altında (hikayeler_yedek, 5n1k_yedek vb.)
