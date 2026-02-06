import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['image.png'],
      manifest: {
        id: '/',
        name: 'NutriBowl',
        short_name: 'NutriBowl',
        description: 'Fresh fruits, dry fruits & combos delivered — COD only, 5 km from Rajam.',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/image.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/image.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/image.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/image.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        categories: ['food', 'shopping'],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react', 'vite-plugin-pwa'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5174',
    },
  },
});
