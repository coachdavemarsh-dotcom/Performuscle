import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  base: '/performance-fuel/',
  plugins: [react()],
  server: {
    port: 5176,
  },
  build: {
    outDir: `${__dirname}/dist`,
  },
})
