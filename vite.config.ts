import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — GitHub Pages(/repo/ 하위 경로)와 Vercel(루트) 어디서든 동작
export default defineConfig({
  base: './',
  plugins: [react()],
});
