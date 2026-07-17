#!/usr/bin/env node
/**
 * gen_ogrenme.mjs
 *
 * "Öğrenme Köşesi" bölümü için iki temanın sorularını üretir:
 *   Tema 1 — Soru Kelimeleri (5N1K): öğretici + mini hikâye soruları
 *   Tema 2 — Saat Okuma: tam / buçuk (emoji) + çeyrek (akrep-yelkovan tarifi)
 *
 * Üreteç, quality_control.mjs ile BİREBİR aynı kontrolleri uygular
 * (yasaklı içerik alt-dize taraması, min uzunluk, en az 4 şık, geçerli cevap,
 * kopya metin) + daha KATI bir kontrol: "4 şıkkın hepsi birbirinden farklı".
 * Yalnızca TÜM kontrollerden geçen sorular dosyaya yazılır.
 *
 * Saat→cevap eşlemesi ve doğru şık indeksi programatik hesaplanır; böylece
 * insan kaynaklı eşleme/indeks hataları imkânsızdır.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "public", "data", "ogrenme");

// ─── quality_control.mjs ile aynı yasak listesi ─────────────────────────────
const FORBIDDEN = [
  "bok","sik","orospu","göt","piç","it","salak","aptal","ahmak","gerizekalı",
  "mal","dangalak","densiz","hödük","özürlü","kör gibi","sağır gibi",
  "öldür","vur","dövüş","kan","savaş","bomba","silah","patlat","ateş et",
  "senin gibi","onun gibi olmak","kötü insan",
  "terörist","bölücü","irk","köle",
];

// ─── Tohumlanmış RNG (tekrarlanabilirlik için) ──────────────────────────────
let _seed = 20260716;
function rng() { _seed = (_seed * 1103515245 + 12345) & 0x7fffffff; return _seed / 0x7fffffff; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function pickDistractors(pool, correct, n) {
  const avail = pool.filter(x => x !== correct);
  return shuffle(avail).slice(0, n);
}
// correct + 3 çeldirici -> karıştırılmış 4 şık; correctAnswer indeksi hesaplanır
function makeQ(question, correct, pool) {
  const options = shuffle([correct, ...pickDistractors(pool, correct, 3)]);
  return { question, options, correctAnswer: options.indexOf(correct) };
}

// ─── Kontroller (QC paritesi + katı benzersiz şık) ──────────────────────────
function forbiddenHit(q) {
  const t = (q.question + " " + q.options.join(" ")).toLowerCase();
  for (const w of FORBIDDEN) if (t.includes(w.toLowerCase())) return w;
  return null;
}
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").replace(/[.!?,;:'"()]/g, "").trim();
}
// Saat -> metin ("3:00", "3:15", "3:30", "3:45"); saat okuma sorularının tek doğruluk kaynağı
const clockStr = (h, m) => `${h}:${m < 10 ? "0" + m : "" + m}`;
function validate(q) {
  const text = (q.question || "").trim();
  if (text.length < 8) return "cok-kisa";
  if (!Array.isArray(q.options) || q.options.length !== 4) return "sik-sayisi";
  if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) return "gecersiz-cevap";
  if (q.options.some(o => o === null || o === undefined || String(o).trim() === "")) return "bos-sik";
  if (new Set(q.options.map(o => String(o).trim().toLowerCase())).size !== 4) return "sik-tekrar";
  const fw = forbiddenHit(q);
  if (fw) return `yasakli-icerik("${fw}")`;
  // Görsel saat sorusu: doğru şık, clock'un gösterdiği saatle programatik eşleşmeli
  if (q.clock) {
    const derived = clockStr(q.clock.hour, q.clock.minute);
    if (String(q.options[q.correctAnswer]).trim() !== derived) return "clock-cevap-uyusmuyor";
  }
  return null;
}

// ════════════════════════════════════════════════════════════════════════════
//  TEMA 1 — SORU KELİMELERİ (5N1K)  — yalnızca 2 SOMUT format, tanım/kural YOK
//    FORMAT 1 (~%70): mini hikâye + hikâyeye dair 5N1K sorusu (cevap açıkça geçer)
//    FORMAT 2 (~%30): kısa cümle + verilen cevaba uygun soru kelimesini seç
// ════════════════════════════════════════════════════════════════════════════

// Çeldirici havuzları (tümü Büyük harfle başlar; şık büyük/küçük çakışması olmaz)
const KISI  = ["Ali","Ayşe","Elif","Mehmet","Zeynep","Efe","Ece","Deniz","Can","Defne","Poyraz","Mert","Annesi","Babası","Dedem","Ninem","Ablası","Öğretmenimiz","Komşusu","Teyzesi","Arkadaşları","Kardeşi"];
const YER   = ["Parkta","Bahçede","Mutfakta","Okulda","Markette","Sınıfta","Salonda","Balkonda","Denizde","Ormanda","Evde","Kütüphanede"];
const ZAMAN = ["Sabah","Öğlen","Akşam","Gece","Hafta sonu","Kahvaltıda","Tatilde","Öğleden sonra","Okuldan sonra","Sabahları","Kışın","Dün"];
const NESNE = ["Süt","Elma","Top","Defter","Kalem","Balon","Çiçek","Şapka","Bardak","Muz","Armut","Havuç","Ekmek","Peynir","Şemsiye","Kale","Su","Gözleme","Kuş"];
const SEBEP = ["Acıktığı için","Susadığı için","Yorulduğu için","Üşüdüğü için","Hasta olduğu için","Hava yağmurlu olduğu için","Arkadaşını özlediği için","Doğum günü olduğu için","Kardeşini güldürmek için","Sevindiği için","Kuşa yardım etmek için","Canı sıkıldığı için"];
const NASIL = ["Yavaşça","Hızlıca","Sessizce","Neşeyle","Dikkatlice","Koşarak","Gülerek","Sevinçle","Birlikte","Tek tek","Mutlulukla","Yüksek sesle"];

const POOL_BY_W = { "ne": NESNE, "kim": KISI, "nerede": YER, "ne zaman": ZAMAN, "neden": SEBEP, "nasil": NASIL };

const tema1 = [];

// ── FORMAT 1 — Mini hikâye + 5N1K ───────────────────────────────────────────
// Her hikâye farklı bir sahne; sorular [soru_kelimesi, soru_cümlesi, cevap].
// Cevap havuzu (çeldiriciler) soru kelimesine göre otomatik seçilir.
const stories = [
  { text: "Ali sabah parka koştu. Parkta arkadaşı Can ile top oynadı. İkisi de çok eğlendi.", qs: [
    ["ne zaman", "Ali parka NE ZAMAN koştu?", "Sabah"],
    ["nerede", "Ali ile Can NEREDE top oynadı?", "Parkta"],
    ["ne", "Ali ile Can parkta NE oynadı?", "Top"],
  ]},
  { text: "Elif kahvaltıda süt içti. Annesi ona peynir de verdi. Sonra Elif çantasını hazırladı.", qs: [
    ["ne", "Elif kahvaltıda NE içti?", "Süt"],
    ["kim", "Elif'e peyniri KİM verdi?", "Annesi"],
  ]},
  { text: "Mehmet'in sevimli bir köpeği var. Köpek bahçede topun peşinden koştu. Mehmet gülerek onu izledi.", qs: [
    ["nerede", "Köpek topun peşinden NEREDE koştu?", "Bahçede"],
    ["nasil", "Mehmet köpeğini NASIL izledi?", "Gülerek"],
  ]},
  { text: "Ayşe akşam annesine mutfakta yardım etti. Birlikte salata yaptılar. Ayşe domatesleri yıkadı.", qs: [
    ["ne zaman", "Ayşe annesine NE ZAMAN yardım etti?", "Akşam"],
    ["nerede", "Ayşe annesine NEREDE yardım etti?", "Mutfakta"],
    ["nasil", "Ayşe ile annesi salatayı NASIL yaptı?", "Birlikte"],
  ]},
  { text: "Dışarıda yağmur yağıyordu. Zeynep üşüdüğü için kalın montunu giydi. Sonra şemsiyesini aldı.", qs: [
    ["neden", "Zeynep montunu NEDEN giydi?", "Üşüdüğü için"],
    ["ne", "Zeynep yağmurda yanına NE aldı?", "Şemsiye"],
  ]},
  { text: "Bugün Efe'nin doğum günü. Arkadaşları ona renkli balonlar aldı. Efe çok sevindi.", qs: [
    ["kim", "Efe'ye balonları KİM aldı?", "Arkadaşları"],
    ["ne", "Arkadaşları Efe'ye NE aldı?", "Balon"],
    ["neden", "Arkadaşları NEDEN balon aldı?", "Doğum günü olduğu için"],
  ]},
  { text: "Poyraz kütüphanede sessizce resim çizdi. Yanında küçük kardeşi oturuyordu. Odada hiç ses yoktu.", qs: [
    ["nerede", "Poyraz NEREDE resim çizdi?", "Kütüphanede"],
    ["nasil", "Poyraz resmini NASIL çizdi?", "Sessizce"],
    ["kim", "Poyraz'ın yanında KİM oturuyordu?", "Kardeşi"],
  ]},
  { text: "Tatilde ailemiz denize gezmeye çıktı. Ben kumdan kale yaptım. Deniz çok maviydi.", qs: [
    ["ne zaman", "Ailemiz denize NE ZAMAN gezmeye çıktı?", "Tatilde"],
    ["ne", "Ben kumdan NE yaptım?", "Kale"],
  ]},
  { text: "Öğretmenimiz sınıfta yeni bir masal okudu. Biz dikkatlice dinledik. Masal çok güzeldi.", qs: [
    ["kim", "Sınıfta masalı KİM okudu?", "Öğretmenimiz"],
    ["nerede", "Masal NEREDE okundu?", "Sınıfta"],
    ["nasil", "Biz masalı NASIL dinledik?", "Dikkatlice"],
  ]},
  { text: "Babam öğleden sonra markete uğradı. Markette taze ekmek aldı. Sonra eve döndü.", qs: [
    ["ne zaman", "Babam markete NE ZAMAN uğradı?", "Öğleden sonra"],
    ["nerede", "Babam ekmeği NEREDE aldı?", "Markette"],
    ["ne", "Babam markette NE aldı?", "Ekmek"],
  ]},
  { text: "Dedem sabah bahçede çiçekleri suladı. Kırmızı güller çok güzel açmıştı. Dedem mutlu oldu.", qs: [
    ["kim", "Bahçede çiçekleri KİM suladı?", "Dedem"],
    ["ne zaman", "Dedem çiçekleri NE ZAMAN suladı?", "Sabah"],
    ["nerede", "Dedem çiçekleri NEREDE suladı?", "Bahçede"],
  ]},
  { text: "Kedimiz bütün gün salonda uyudu. Akşam acıkınca miyavladı. Ona mama verdik.", qs: [
    ["nerede", "Kedimiz NEREDE uyudu?", "Salonda"],
    ["neden", "Kedi akşam NEDEN miyavladı?", "Acıktığı için"],
    ["ne zaman", "Kedi NE ZAMAN miyavladı?", "Akşam"],
  ]},
  { text: "Öğrenciler bahçede oynuyordu. Yağmur başlayınca hızlıca sınıfa koştular. İçeride oyunlarına devam ettiler.", qs: [
    ["nasil", "Öğrenciler sınıfa NASIL koştu?", "Hızlıca"],
    ["neden", "Öğrenciler NEDEN sınıfa koştu?", "Hava yağmurlu olduğu için"],
  ]},
  { text: "Ece okuldan sonra evde resim çizdi. Bir ağaç ve iki kuş boyadı. Resmini duvara astı.", qs: [
    ["ne zaman", "Ece resmi NE ZAMAN çizdi?", "Okuldan sonra"],
    ["nerede", "Ece resmi NEREDE çizdi?", "Evde"],
  ]},
  { text: "Küçük kardeşi ağlıyordu. Ayşe onu güldürmek için komik bir yüz yaptı. Kardeşi hemen güldü.", qs: [
    ["neden", "Ayşe NEDEN komik bir yüz yaptı?", "Kardeşini güldürmek için"],
    ["kim", "Kardeşe komik yüz yapan KİM?", "Ayşe"],
  ]},
  { text: "Ormanda küçük bir tavşan yaşıyordu. Tavşan sabahları havuç yerdi. Bir gün yeni bir arkadaş buldu.", qs: [
    ["ne", "Tavşan sabahları NE yerdi?", "Havuç"],
    ["ne zaman", "Tavşan havucu NE ZAMAN yerdi?", "Sabahları"],
  ]},
  { text: "Sınıfça güzel bir şarkı söyledik. Herkes neşeyle el çırptı. Öğretmenimiz bizi çok beğendi.", qs: [
    ["nasil", "Öğrenciler NASIL el çırptı?", "Neşeyle"],
  ]},
  { text: "Mehmet uzun süre koştu. Çok susadığı için mutfağa uğradı. Mutfakta soğuk bir bardak su içti.", qs: [
    ["neden", "Mehmet mutfağa NEDEN uğradı?", "Susadığı için"],
    ["ne", "Mehmet mutfakta NE içti?", "Su"],
    ["nerede", "Mehmet suyu NEREDE içti?", "Mutfakta"],
  ]},
  { text: "Kışın çok kar yağdı. Çocuklar bahçede kardan adam yaptı. Elleri üşüdü ama çok eğlendiler.", qs: [
    ["ne zaman", "Çocuklar kardan adamı NE ZAMAN yaptı?", "Kışın"],
    ["nerede", "Çocuklar kardan adamı NEREDE yaptı?", "Bahçede"],
  ]},
  { text: "Ninem öğlen bize gözleme yaptı. Mutfaktan güzel bir koku geldi. Hepimiz sofraya oturduk.", qs: [
    ["kim", "Öğlen gözlemeyi KİM yaptı?", "Ninem"],
    ["ne zaman", "Ninem gözlemeyi NE ZAMAN yaptı?", "Öğlen"],
    ["ne", "Ninem bize NE yaptı?", "Gözleme"],
  ]},
  { text: "Defne ile Mert yapbozu birlikte yaptı. Parçaları tek tek yerleştirdiler. Sonunda güzel bir resim çıktı.", qs: [
    ["nasil", "Defne ile Mert yapbozu NASIL yaptı?", "Birlikte"],
    ["kim", "Defne yapbozu KİMİNLE yaptı?", "Mert"],
  ]},
  { text: "Poyraz sınavdan yüksek not aldı. Çok sevindiği için mutlulukla zıpladı. Ailesi onu kutladı.", qs: [
    ["neden", "Poyraz NEDEN zıpladı?", "Sevindiği için"],
    ["nasil", "Poyraz NASIL zıpladı?", "Mutlulukla"],
  ]},
  { text: "Küçük kuş yuvasından düştü. Ali ona yardım etmek için koştu. Kuşu yuvasına geri koydu.", qs: [
    ["kim", "Kuşa yardım eden KİM?", "Ali"],
    ["neden", "Ali NEDEN koştu?", "Kuşa yardım etmek için"],
  ]},
];
for (const st of stories) {
  const storyLow = st.text.toLocaleLowerCase("tr-TR");
  for (const [w, q, correct] of st.qs) {
    const item = makeQ(`${st.text} ${q}`, correct, POOL_BY_W[w]);
    // Hikâyede adı/öğesi geçen bir seçenek (ör. kahramanın kendisi) yanlışlıkla
    // çeldirici olduysa belirsizlik/kafa karışıklığı olmasın diye değiştir.
    // Deterministik seçim: RNG durumu değişmez, yalnızca kusurlu çeldirici düzelir.
    for (let i = 0; i < item.options.length; i++) {
      if (i === item.correctAnswer) continue;
      if (storyLow.includes(item.options[i].toLocaleLowerCase("tr-TR"))) {
        const repl = POOL_BY_W[w].find(o =>
          o !== correct &&
          !item.options.includes(o) &&
          !storyLow.includes(o.toLocaleLowerCase("tr-TR"))
        );
        if (repl) item.options[i] = repl;
      }
    }
    item._w = w;
    tema1.push(item);
  }
}

// ── FORMAT 2 — Doğru soru kelimesini seç ────────────────────────────────────
// Cümlede vurgulu (BÜYÜK harf) cevap verilir; o cevabı almak için doğru soru seçilir.
// Şıklar aynı fiile ait 6 soru kelimesinden 4'ü; doğru = vurgulanan öğenin kategorisi.
const W_LABEL = { yer: "nerede", zaman: "ne zaman", kisi: "kim", sebep: "neden", nasil: "nasil", nesne: "ne" };
function makeF2(sentence, verb, cat, answer) {
  const phrases = {
    yer:   `Nerede ${verb}?`,
    zaman: `Ne zaman ${verb}?`,
    kisi:  `Kim ${verb}?`,
    sebep: `Neden ${verb}?`,
    nasil: `Nasıl ${verb}?`,
    nesne: `Ne ${verb}?`,
  };
  const correct = phrases[cat];
  const pool = Object.keys(phrases).filter(k => k !== cat).map(k => phrases[k]);
  const item = makeQ(`${sentence} '${answer}' cevabını almak için hangi soruyu sorarız?`, correct, pool);
  item._w = W_LABEL[cat];
  return item;
}
const format2 = [
  // yer
  ["Ali topu BAHÇEDE oynadı.", "oynadı", "yer", "Bahçede"],
  ["Zeynep resmini SINIFTA çizdi.", "çizdi", "yer", "Sınıfta"],
  ["Dedem çiçekleri BALKONDA suladı.", "suladı", "yer", "Balkonda"],
  ["Kedi MUTFAKTA uyudu.", "uyudu", "yer", "Mutfakta"],
  // zaman
  ["Elif ödevini AKŞAM yaptı.", "yaptı", "zaman", "Akşam"],
  ["Ailem tatile YAZIN çıktı.", "çıktı", "zaman", "Yazın"],
  ["Babam SABAH gazete okudu.", "okudu", "zaman", "Sabah"],
  ["Maç HAFTA SONU başladı.", "başladı", "zaman", "Hafta sonu"],
  // kim
  ["Bulaşıkları ANNEM yıkadı.", "yıkadı", "kisi", "Annem"],
  ["Bahçeyi DEDEM suladı.", "suladı", "kisi", "Dedem"],
  ["Resmi ELİF çizdi.", "çizdi", "kisi", "Elif"],
  ["Topu ALİ attı.", "attı", "kisi", "Ali"],
  // neden
  ["Ayşe ÜŞÜDÜĞÜ İÇİN montunu giydi.", "giydi", "sebep", "Üşüdüğü için"],
  ["Mehmet ACIKTIĞI İÇİN elma yedi.", "yedi", "sebep", "Acıktığı için"],
  ["Çocuk YORULDUĞU İÇİN oturdu.", "oturdu", "sebep", "Yorulduğu için"],
  ["Elif SUSADIĞI İÇİN su içti.", "içti", "sebep", "Susadığı için"],
  // nasıl
  ["Kaplumbağa YAVAŞÇA yürüdü.", "yürüdü", "nasil", "Yavaşça"],
  ["Çocuklar NEŞEYLE şarkı söyledi.", "söyledi", "nasil", "Neşeyle"],
  ["Ali ödevini DİKKATLİCE yaptı.", "yaptı", "nasil", "Dikkatlice"],
  ["Tavşan HIZLICA zıpladı.", "zıpladı", "nasil", "Hızlıca"],
  // ne (nesne)
  ["Elif kahvaltıda SÜT içti.", "içti", "nesne", "Süt"],
  ["Mehmet bahçede TOP oynadı.", "oynadı", "nesne", "Top"],
  ["Ayşe çantasına DEFTER koydu.", "koydu", "nesne", "Defter"],
  ["Dede sepete ELMA topladı.", "topladı", "nesne", "Elma"],
];
for (const [s, v, cat, ans] of format2) tema1.push(makeF2(s, v, cat, ans));

// ── Tema 1 — bilerek hatalı taslaklar (kalite süzgecinin yakalaması beklenir) ─
const tema1Drafts = [
  { question: "Ceren okula gitti. Ceren nereye gitti?", options: ["Okula", "Parka", "Eve", "Bahçeye"], correctAnswer: 0 }, // yasaklı: "it" (gitti)
  { question: "Kedi kanepede uyudu. Kedi nerede uyudu?", options: ["Kanepede", "Yatakta", "Halıda", "Sandalyede"], correctAnswer: 0 }, // yasaklı: "kan" (kanepede)
  { question: "Kim?", options: ["Ali", "Ayşe", "Elif", "Mehmet"], correctAnswer: 0 },                                       // çok kısa
  { question: "Deniz parkta koştu. Deniz nerede koştu?", options: ["Parkta", "Evde", "Okulda"], correctAnswer: 0 },         // 4'ten az şık
  { question: "Elif sabah süt içti. Elif ne zaman süt içti?", options: ["Sabah", "Sabah", "Akşam", "Öğlen"], correctAnswer: 0 }, // şık tekrarı
  { question: tema1[0].question, options: ["Sabah", "Akşam", "Öğlen", "Gece"], correctAnswer: 0 },                          // kopya (ilk üretilen soru)
];

// ════════════════════════════════════════════════════════════════════════════
//  TEMA 2 — SAAT OKUMA (aşamalı)
// ════════════════════════════════════════════════════════════════════════════

const pad = (n) => (n < 10 ? "0" + n : "" + n);
const FULL  = Array.from({ length: 12 }, (_, i) => clockStr(i + 1, 0));
const HALF  = Array.from({ length: 12 }, (_, i) => clockStr(i + 1, 30));
const QPAST = Array.from({ length: 12 }, (_, i) => clockStr(i + 1, 15));
const QTO   = Array.from({ length: 12 }, (_, i) => clockStr(i + 1, 45));

// Görsel saat sorusu: metin sade + emojisiz; clock:{hour,minute} eklenir ve
// doğru cevap clock'tan (clockStr) türetilir — elle yazılmaz.
function makeClockQ(hour, minute, pool) {
  const correct = clockStr(hour, minute);
  const options = shuffle([correct, ...pickDistractors(pool, correct, 3)]);
  return { question: "Saat kaçı gösteriyor?", options, correctAnswer: options.indexOf(correct), clock: { hour, minute } };
}

const tema2 = [];

// Aşama A — Tam saatler (çeldiriciler: yalnızca diğer tam saatler → sade)
for (let h = 1; h <= 12; h++) tema2.push(makeClockQ(h, 0, FULL));

// Aşama B — Buçuklar (çeldiriciler: tam + buçuk karışık → iki ibreyi de okumalı)
for (let h = 1; h <= 12; h++) tema2.push(makeClockQ(h, 30, [...FULL, ...HALF]));

// Aşama C — Çeyrekler (çeldiriciler: tüm zaman türleri → en zor; görsel kadranla)
const ALLT = [...FULL, ...HALF, ...QPAST, ...QTO];
for (let h = 1; h <= 12; h++) tema2.push(makeClockQ(h, 15, ALLT));
for (let h = 1; h <= 12; h++) tema2.push(makeClockQ(h, 45, ALLT));

// Öğretici kavram soruları (saat sözlüğü) — görsel/clock alanı yok
const clockTeach = [
  ["Yelkovan 12'yi, akrep bir sayıyı tam gösterirse saat nasıldır?", "Tam saat", ["Tam saat", "Buçuk", "Çeyrek geçe", "Çeyrek kala"]],
  ["Yelkovan 6'yı gösterdiğinde saate ne deriz?", "Buçuk", ["Buçuk", "Tam saat", "Çeyrek geçe", "Çeyrek kala"]],
  ["Yelkovan 3'ü gösterdiğinde saate ne deriz?", "Çeyrek geçe", ["Çeyrek geçe", "Tam saat", "Buçuk", "Çeyrek kala"]],
  ["Yelkovan 9'u gösterdiğinde saate ne deriz?", "Çeyrek kala", ["Çeyrek kala", "Tam saat", "Buçuk", "Çeyrek geçe"]],
  ["Bir saat kaç dakikadır?", "60", ["60", "30", "100", "24"]],
  ["Yarım saat kaç dakikadır?", "30", ["30", "15", "45", "60"]],
  ["Çeyrek saat kaç dakikadır?", "15", ["15", "30", "45", "20"]],
  ["Saatteki kısa ibreye ne denir?", "Akrep", ["Akrep", "Yelkovan", "Sarkaç", "Kordon"]],
  ["Saatteki uzun ibreye ne denir?", "Yelkovan", ["Yelkovan", "Akrep", "Sarkaç", "Zil"]],
];
for (const [q, correct, opts] of clockTeach) {
  const options = shuffle(opts);
  tema2.push({ question: q, options, correctAnswer: options.indexOf(correct) });
}

// Tema 2 — bilerek hatalı taslaklar (yeni clock-cevap kontrolü dahil süzgeç testi)
const tema2Drafts = [
  // clock 3:00 gösteriyor ama işaretli doğru şık "4:00" → clock-cevap-uyusmuyor
  { question: "Saat kaçı gösteriyor?", clock: { hour: 3, minute: 0 }, options: ["4:00", "2:00", "5:00", "1:00"], correctAnswer: 0 },
  // şık tekrarı
  { question: "Saat kaçı gösteriyor?", clock: { hour: 6, minute: 30 }, options: ["6:30", "6:30", "7:30", "5:30"], correctAnswer: 0 },
  // çok kısa
  { question: "Saat?", clock: { hour: 1, minute: 0 }, options: ["1:00", "2:00", "3:00", "4:00"], correctAnswer: 0 },
  // 4'ten az şık
  { question: "Saat kaçı gösteriyor?", clock: { hour: 9, minute: 15 }, options: ["9:15", "9:45", "8:15"], correctAnswer: 0 },
  // kopya (aynı metin + aynı clock = ilk tam saat sorusu)
  { question: tema2[0].question, clock: { ...tema2[0].clock }, options: [...tema2[0].options], correctAnswer: tema2[0].correctAnswer },
];

// ════════════════════════════════════════════════════════════════════════════
//  KALİTE SÜZGECİ + DOSYA YAZIMI + RAPOR
// ════════════════════════════════════════════════════════════════════════════

function processTheme(name, subject, theme, candidates, idPrefix) {
  const written = candidates.length;
  const kept = [];
  const seen = new Set();
  const eliminated = [];

  for (const c of candidates) {
    const reason = validate(c);
    if (reason) { eliminated.push({ q: c.question, reason }); continue; }
    // Saat sorularında aynı metin farklı clock => farklı soru; dedup anahtarına clock katılır
    const norm = normalize(c.question) + (c.clock ? `|c${c.clock.hour}:${c.clock.minute}` : "");
    if (seen.has(norm)) { eliminated.push({ q: c.question, reason: "kopya" }); continue; }
    seen.add(norm);
    kept.push(c);
  }

  const questions = kept.map((c, i) => ({
    id: `${idPrefix}${pad(i + 1)}`,
    subject,
    theme,
    question: c.question,
    options: c.options,
    correctAnswer: c.correctAnswer,
    ...(c.clock ? { clock: c.clock } : {}),
  }));

  mkdirSync(OUT_DIR, { recursive: true });
  const file = join(OUT_DIR, `${theme === "Tema 1" ? "tema1" : "tema2"}.json`);
  writeFileSync(file, JSON.stringify({ questions }, null, 2));

  console.log(`\n── ${name} ──`);
  console.log(`  Yazılan (aday) : ${written}`);
  console.log(`  Elenen         : ${eliminated.length}`);
  console.log(`  Eklenen (temiz): ${questions.length}`);
  if (eliminated.length) {
    console.log(`  Eleme nedenleri:`);
    for (const e of eliminated) console.log(`    • [${e.reason}] ${e.q.slice(0, 70)}`);
  }
  return { written, eliminated: eliminated.length, added: questions.length };
}

console.log("🏗️  Öğrenme Köşesi soru üretimi + kalite kontrolü\n" + "═".repeat(60));

// Tema 1 — soru kelimesi dağılımı (temiz adaylar üzerinden)
const dagilim = {};
for (const q of tema1) dagilim[q._w] = (dagilim[q._w] || 0) + 1;
const f2Say = tema1.filter(q => q.question.includes("cevabını almak için")).length;
console.log(`\nℹ️  Tema 1 format dağılımı: hikâye ${tema1.length - f2Say} (%${Math.round((tema1.length - f2Say) / tema1.length * 100)}) · soru-kelimesi-seç ${f2Say} (%${Math.round(f2Say / tema1.length * 100)})`);
console.log(`ℹ️  Tema 1 soru kelimesi dağılımı:`, Object.entries(dagilim).map(([k, v]) => `${k}:${v}`).join(" · "));

const r1 = processTheme(
  "TEMA 1 — Soru Kelimeleri (5N1K)", "Öğrenme Köşesi", "Tema 1",
  [...tema1, ...tema1Drafts], "o1q"
);
const r2 = processTheme(
  "TEMA 2 — Saat Okuma", "Öğrenme Köşesi", "Tema 2",
  [...tema2, ...tema2Drafts], "o2q"
);

console.log("\n" + "═".repeat(60));
console.log(`📊 GENEL: yazılan ${r1.written + r2.written} · elenen ${r1.eliminated + r2.eliminated} · eklenen ${r1.added + r2.added}`);
console.log("═".repeat(60) + "\n");
