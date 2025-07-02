import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
    port: 5173,
    host: true, // <- permite accesos externos
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
  // ESTA ES LA PARTE IMPORTANTE
  base: '/',
  // Redirigir todas las rutas al index.html (para React Router)
  // Esto es fundamental para evitar 404 en rutas profundas como /reportes/titulados
  // cuando se recarga la página
  assetsInclude: [],
});
