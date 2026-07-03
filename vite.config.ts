import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildId = Date.now().toString();

const surumDosyasi = () => ({
  name: 'surum-dosyasi',
  writeBundle() {
    require('fs').writeFileSync('dist/version.json', JSON.stringify({ v: buildId }));
  },
});

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(buildId) },
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
