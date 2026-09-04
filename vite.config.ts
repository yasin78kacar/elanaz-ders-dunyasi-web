import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync, readdirSync } from 'node:fs'

const buildId = Date.now().toString();

// Tum tema/kategori dosyalarindaki questions.length toplamini build aninda hesaplar; boylece
// ana ekranda gercek toplam, runtime'da hicbir veri dosyasi indirmeden gosterilir.
// Ceviri/format burada yapilir ("4790" -> "4.790") -> tarayici locale'ine bagli degil.
// math/turkce/.../sosyal: temaN.json; zeka: kategori*.json — klasordeki tum .json taraniyor.
function toplamSoruSayisi(): number {
  const klasorler = ['math', 'turkce', 'fen', 'hayat', 'english', 'sosyal', 'zeka'];
  let toplam = 0;
  for (const k of klasorler) {
    const dir = `public/data/${k}`;
    if (!existsSync(dir)) continue;
    let dosyalar: string[] = [];
    try {
      dosyalar = readdirSync(dir).filter((f) => f.endsWith('.json'));
    } catch {
      continue;
    }
    for (const f of dosyalar) {
      const yol = `${dir}/${f}`;
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
