import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: '/Taurus_GameStation/',
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { 
    port: 5173, 
    host: true, // Listen on all IPs
    allowedHosts: ['juvenile-unripe-breach.ngrok-free.dev'], // Allow ngrok domain
    proxy: { '/api': { target: 'http://localhost:5001', changeOrigin: true } } 
  },
});
