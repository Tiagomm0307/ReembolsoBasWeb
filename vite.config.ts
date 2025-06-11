import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0', // ou 'localhost' ou '127.0.0.1'
    port: 3000,       // escolha a porta que quiser
    open: true        // abre automaticamente no navegador
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
      assets: path.resolve(__dirname, './src/assets'),
      hooks: path.resolve(__dirname, './src/hooks'),
      service: path.resolve(__dirname, './src/service'),
      contexts: path.resolve(__dirname, './src/contexts'),
      api: path.resolve(__dirname, './src/api'),
      utils: path.resolve(__dirname, './src/utils'),
      types: path.resolve(__dirname, './src/types'),
      texts: path.resolve(__dirname, './src/texts'),
    },
  },
});
