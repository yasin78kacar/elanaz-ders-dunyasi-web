import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'node:fs'

const buildId = Date.now().toString();

// Tum tema dosyalarindaki questions.length toplamini build aninda hesaplar; boylece
// ana ekranda gercek toplam, runtime'da hicbir veri dosyasi indirmeden gosterilir.
// Ceviri/format burada yapilir ("4790" -> "4.790") -> tarayici locale'ine bagli degil.
function toplamSoruSayisi(): number {
  const klasorler = ['math', 'turkce', 'fen', 'hayat', 'english'];
  let toplam = 0;
  for (const k of klasorler) {
    for (let t = 1; t <= 10; t++) {
      const yol = `public/data/${k}/tema${t}.json`;
      if (!existsSync(yol)) continue;
      try {
        const veri = JSON.parse(readFileSync(yol, 'utf8'));
        toplam += Array.isArray(veri.questions) ? veri.questions.length : 0;
      } catch { /* bozuk/eksik dosya sayimda atlanir */ }
    }
  }
  return toplam;
}

const toplamSoruMetni = String(toplamSoruSayisi()).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const surumDosyasi = () => ({
  name: 'surum-dosyasi',
  writeBundle() {
    require('fs').writeFileSync('dist/version.json', JSON.stringify({ v: buildId }));
  },
});

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    __TOTAL_QUESTIONS__: JSON.stringify(toplamSoruMetni),
  },
  plugins: [surumDosyasi(), react()],
  build: {
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    middlewareMode: false
  }
})
