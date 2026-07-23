import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://<user>.github.io/baseball-chess/
// Local dev still works at http://localhost:5173/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/baseball-chess/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
