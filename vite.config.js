import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      // Allow JSX in .js files (hooks use JSX for AuthProvider)
      include: ['**/*.jsx', '**/*.js'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/**', 'recipes/**'],
      manifest: {
        name:             'Performuscle',
        short_name:       'Performuscle',
        description:      'Health | Function | Performance — Your bespoke coaching platform',
        theme_color:      '#060608',
        background_color: '#060608',
        display:          'standalone',
        orientation:      'portrait',
        scope:            '/',
        start_url:        '/',
        icons: [
          { src: '/icons/icon-72x72.png',           sizes: '72x72',     type: 'image/png' },
          { src: '/icons/icon-96x96.png',           sizes: '96x96',     type: 'image/png' },
          { src: '/icons/icon-128x128.png',         sizes: '128x128',   type: 'image/png' },
          { src: '/icons/icon-144x144.png',         sizes: '144x144',   type: 'image/png' },
          { src: '/icons/icon-152x152.png',         sizes: '152x152',   type: 'image/png' },
          { src: '/icons/icon-192x192.png',         sizes: '192x192',   type: 'image/png' },
          { src: '/icons/icon-384x384.png',         sizes: '384x384',   type: 'image/png' },
          { src: '/icons/icon-512x512.png',         sizes: '512x512',   type: 'image/png' },
          { src: '/icons/maskable-icon-512x512.png',sizes: '512x512',   type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Take over immediately — don't wait for tabs to close
        skipWaiting:  true,
        clientsClaim: true,
        // Cache app shell and static assets (exclude standalone tool pages)
        globPatterns:         ['**/*.{js,css,ico,png,svg,woff2}'],
        // Don't cache Supabase, Stripe, or standalone HTML tool pages
        navigateFallback:     '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/, /\.html$/],
        runtimeCaching: [
          {
            // Cache recipe images
            urlPattern: /\/recipes\/.*\.jpe?g$/,
            handler:    'CacheFirst',
            options: {
              cacheName:  'recipe-images',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler:    'CacheFirst',
            options: {
              cacheName:  'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target:       'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir:    'dist',
    sourcemap: true,
  },
})
