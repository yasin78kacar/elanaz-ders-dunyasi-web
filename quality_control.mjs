#!/usr/bin/env node
/**
 * quality_control.mjs
 * 
 * Bu script tüm soru dosyalarını:
 *   1. Kopya soruları temizler (soru metni aynı olan)
 *   2. Seçenekleri kontrol eder (en az 4 seçenek, doğru cevap geçerli)
 *   3. Kaba/uygunsuz içerikleri filtreler
 *   4. Anlamsız/çok kısa soruları eler
 *   5. MEB müfredatına uygun olmayan kalıpları işaretler
 *   6. Her dosyayı temizlenmiş haliyle yeniden yazar
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, "public", "data");

// ─── Filtre listesi: uygunsuz / MEB dışı kelimeler ─────────────────────────
const FORBIDDEN = [
  // Küfür / argo
  "bok","sik","orospu","göt","piç","it","salak","aptal","ahmak","gerizekalı",
  "mal","dangalak","densiz","hödük","özürlü","kör gibi","sağır gibi",
  // Şiddet
  "öldür","vur","dövüş","kan","savaş","bomba","silah","patlat","ateş et",
  // Kişisel hakaret kalıpları
  "senin gibi","onun gibi olmak","kötü insan",
  // Siyasi / ayrımcı
  "terörist","bölücü","irk","köle",
];

// ─── Çok genel / anlamsız soru şablonları (pattern match) ──────────────────
const MEANINGLESS_PATTERNS = [
  /Soru \d+\).*Soru \d+\)/i,       // nested duplicated labels
  /^\s*\??\s*$/,                   // boş ya da sadece soru işareti
];

// ─── Geçerli soru kontrolü ─────────────────────────────────────────────────
function isValidQuestion(q) {
  if (!q || typeof q !== "object") return false;

  const text = (q.question || "").trim();
  const opts  = q.options;
  const ca    = q.correctAnswer;

  // Soru metni çok kısa ise ele
  if (text.length < 8) return false;

  // Seçenekler eksik veya 4'ten az
  if (!Array.isArray(opts) || opts.length < 4) return false;

  // Doğru cevap indeksi geçerli değilse
  if (typeof ca !== "number" || ca < 0 || ca >= opts.length) return false;

  // Seçeneklerde null/undefined/boş olan varsa
  if (opts.some(o => o === null || o === undefined || String(o).trim() === "")) return false;

  // Tüm seçenekler birbirinin aynısı ise (kalite sorunu)
  const optSet = new Set(opts.map(o => String(o).trim().toLowerCase()));
  if (optSet.size < 2) return false;

  // Doğru cevap seçeneklerde yok
  const correctText = String(opts[ca]).trim().toLowerCase();
  if (!correctText) return false;

  // Uygunsuz içerik kontrolü
  const fullText = (text + " " + opts.join(" ")).toLowerCase();
  for (const word of FORBIDDEN) {
    if (fullText.includes(word.toLowerCase())) return false;
  }

  // Anlamsız pattern kontrolü
  for (const pattern of MEANINGLESS_PATTERNS) {
    if (pattern.test(text)) return false;
  }

  // "Konu N" / "Tema N" / "Soru N)" gibi sadece şablon olan soruları ele
  // (bu tür sorular gerçek içerik taşımıyor)
  const templatePattern = /^\(?(Konu|Soru|Tema|Madde)\s+\d+\)?[:\.\s]*$/i;
  if (templatePattern.test(text.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s]/g, "").trim())) return false;

  // Görsel analog saat sorusu: clock alanı varsa, işaretli doğru şık clock'un
  // gösterdiği saatle programatik eşleşmeli (elle yazılan cevaba güvenilmez).
  if (q.clock && typeof q.clock === "object") {
    const h = q.clock.hour, m = q.clock.minute;
    if (typeof h !== "number" || typeof m !== "number") return false;
    if (h < 1 || h > 12 || m < 0 || m > 59) return false;
    const derived = `${h}:${m < 10 ? "0" + m : "" + m}`;
    if (String(opts[ca]).trim() !== derived) return false;
  }

  return true;
}

// ─── Bir dosyadaki soruları temizle ────────────────────────────────────────
function cleanFile(folder, filename) {
  const filepath = join(BASE, folder, filename);
  let data;
  try {
    data = JSON.parse(readFileSync(filepath, "utf-8"));
  } catch (e) {
    console.warn(`  ⚠️  Okunamadı: ${folder}/${filename}`);
    return { before: 0, after: 0 };
  }

  const questions = data.questions || [];
  const before = questions.length;

  // 1. Geçersiz soruları ele
  const valid = questions.filter(isValidQuestion);

  // 2. Soru metni (normalize edilmiş) üzerinden unique tut
  const seenTexts = new Set();
  const seenNormTexts = new Set();
  
  const unique = valid.filter(q => {
    // Saat sorularında aynı metin farklı clock => farklı soru; anahtara clock katılır
    const clockSig = q.clock ? `|c${q.clock.hour}:${q.clock.minute}` : "";
    const rawText = q.question.trim() + clockSig;
    // Normalize: küçük harf, fazla boşluk kaldır, noktalama normalize et
    const normText = q.question.trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.!?,;:'"()]/g, "")
      .replace(/\(soru \d+\)/gi, "")
      .replace(/\(konu \d+\)/gi, "")
      .replace(/\(tema \d+\)/gi, "")
      .trim() + clockSig;

    // Tamamen aynı ham metin
    if (seenTexts.has(rawText)) return false;
    // Normalize edilmiş metin aynı (format farkları)
    if (seenNormTexts.has(normText)) return false;

    seenTexts.add(rawText);
    seenNormTexts.add(normText);
    return true;
  });

  const after = unique.length;

  if (before !== after) {
    writeFileSync(filepath, JSON.stringify({ questions: unique }, null, 2));
  }

  return { before, after };
}

// ─── Tüm dosyaları tara ───────────────────────────────────────────────────
function runQC() {
  const subjects = ["math", "turkce", "fen", "hayat", "english", "ogrenme"];
  const stats = { totalBefore: 0, totalAfter: 0, removed: 0 };
  
  console.log("\n🔍 Kalite Kontrolü Başlıyor...\n");
  
  for (const subject of subjects) {
    let subBefore = 0, subAfter = 0;
    const dir = join(BASE, subject);
    
    let files;
    try {
      files = readdirSync(dir).filter(f => f.endsWith(".json")).sort();
    } catch (e) {
      continue;
    }

    for (const file of files) {
      const { before, after } = cleanFile(subject, file);
      subBefore += before;
      subAfter  += after;
      
      const removed = before - after;
      if (removed > 0) {
        console.log(`  🗑️  ${subject}/${file}: ${before} → ${after} (${removed} kaldırıldı)`);
      }
    }

    console.log(`  ✅ ${subject.padEnd(10)} : ${subAfter} soru (${subBefore - subAfter} silindi)`);
    stats.totalBefore += subBefore;
    stats.totalAfter  += subAfter;
    stats.removed     += subBefore - subAfter;
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`📊 SONUÇ:`);
  console.log(`   Öncesi  : ${stats.totalBefore} soru`);
  console.log(`   Sonrası : ${stats.totalAfter} soru`);
  console.log(`   Silinen : ${stats.removed} soru`);
  console.log(`${"─".repeat(50)}\n`);
  
  return stats;
}

// ─── Ek: Cross-file duplicate kontrolü (farklı tema dosyalarında aynı soru) ─
function crossFileCheck() {
  const subjects = ["math", "turkce", "fen", "hayat", "english", "ogrenme"];
  let crossDupes = 0;
  
  console.log("🔍 Çapraz dosya kopya kontrolü...\n");
  
  for (const subject of subjects) {
    const dir = join(BASE, subject);
    const globalTexts = new Set();
    
    let files;
    try {
      files = readdirSync(dir).filter(f => f.endsWith(".json")).sort();
    } catch (e) {
      continue;
    }

    for (const file of files) {
      const filepath = join(BASE, subject, file);
      let data;
      try {
        data = JSON.parse(readFileSync(filepath, "utf-8"));
      } catch (e) {
        continue;
      }

      const questions = data.questions || [];
      const kept = [];
      let dupes = 0;

      for (const q of questions) {
        const norm = q.question.toLowerCase().replace(/\s+/g, " ").replace(/[.!?,;:'"()]/g, "").replace(/\(soru \d+\)/gi, "").replace(/\(konu \d+\)/gi, "").trim() + (q.clock ? `|c${q.clock.hour}:${q.clock.minute}` : "");
        if (globalTexts.has(norm)) {
          dupes++;
          crossDupes++;
        } else {
          globalTexts.add(norm);
          kept.push(q);
        }
      }

      if (dupes > 0) {
        writeFileSync(filepath, JSON.stringify({ questions: kept }, null, 2));
        console.log(`  🗑️  ${subject}/${file}: ${dupes} çapraz kopya kaldırıldı`);
      }
    }
  }

  if (crossDupes === 0) {
    console.log("  ✅ Çapraz kopya yok!\n");
  } else {
    console.log(`\n  Toplam ${crossDupes} çapraz kopya kaldırıldı.\n`);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
runQC();
crossFileCheck();

// Final count
let grand = 0;
const subjects = ["math", "turkce", "fen", "hayat", "english", "ogrenme"];
console.log("📈 FINAL SAYIM:\n");
for (const s of subjects) {
  let sub = 0;
  try {
    for (const f of readdirSync(join(BASE, s))) {
      if (!f.endsWith(".json")) continue;
      const d = JSON.parse(readFileSync(join(BASE, s, f)));
      sub += d.questions?.length || 0;
    }
  } catch (e) {}
  console.log(`  ${s.padEnd(12)}: ${sub} soru (${Math.round(sub/10)}/tema ort)`);
  grand += sub;
}
console.log(`\n🏆 TOPLAM TEMİZ SORU: ${grand}\n`);
