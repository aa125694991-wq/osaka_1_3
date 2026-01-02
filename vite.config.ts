import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  // 重要：這裡的名稱必須跟你的 GitHub Repository 名稱一樣
  // 例如你的倉庫叫 kyoto-flow，這裡就填 '/kyoto-flow/'
  base: '/kyoto-flow/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'KyotoFlow 旅遊規劃',
        short_name: 'KyotoFlow',
        description: '大阪京都團體旅遊規劃助手',
        theme_color: '#F2F2F7',
        background_color: '#F2F2F7',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/kyoto-flow/',
        start_url: '/kyoto-flow/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});