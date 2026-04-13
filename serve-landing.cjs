/**
 * Performuscle unified dev/prod server — port 8080
 *
 * Routes:
 *   /meal-planner/*  →  dev: proxy to Vite on :5175
 *                        prod: serve meal-planner/dist/ statically
 *   /api/*           →  proxy to Express on :3001
 *   /*               →  performuscle-landing.html + static assets
 */

const http = require('http')
const fs   = require('fs')
const path = require('path')

const PORT     = 8080
const ROOT     = __dirname
const DIST_DIR = path.join(ROOT, 'meal-planner', 'dist')

// Detect if a production build exists
const isProd = fs.existsSync(path.join(DIST_DIR, 'index.html'))
if (isProd) {
  console.log('[server] 🏗  Meal planner: serving built dist from', DIST_DIR)
} else {
  console.log('[server] ⚡  Meal planner: proxying to Vite dev server on :5175')
}

// ─── MIME types ───────────────────────────────────────────────────────────────
const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.css':   'text/css',
  '.js':    'application/javascript',
  '.mjs':   'application/javascript',
  '.json':  'application/json',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
}

// ─── Proxy helper ─────────────────────────────────────────────────────────────
function proxy(req, res, host, port) {
  const opts = {
    hostname: host,
    port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${host}:${port}` },
  }
  const upstream = http.request(opts, upRes => {
    res.writeHead(upRes.statusCode, upRes.headers)
    upRes.pipe(res, { end: true })
  })
  upstream.on('error', err => {
    const msg = `Cannot reach ${host}:${port} — is it running?\n${err.message}`
    console.warn(`[proxy] ✗ ${msg}`)
    res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end(msg)
  })
  req.pipe(upstream, { end: true })
}

// ─── Static file helper ───────────────────────────────────────────────────────
function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  })
}

// ─── Server ───────────────────────────────────────────────────────────────────
http.createServer((req, res) => {
  const rawUrl  = req.url || '/'
  const urlPath = rawUrl.split('?')[0]

  // ── /api/* → Express :3001 ─────────────────────────────────────────────────
  if (urlPath.startsWith('/api')) {
    return proxy(req, res, 'localhost', 3001)
  }

  // ── /meal-planner/* ────────────────────────────────────────────────────────
  if (urlPath.startsWith('/meal-planner')) {
    if (isProd) {
      // Serve from built dist — strip /meal-planner prefix
      let filePath = urlPath.replace(/^\/meal-planner/, '') || '/index.html'
      if (filePath === '/') filePath = '/index.html'
      const fullPath = path.join(DIST_DIR, filePath)

      // If the file doesn't exist, fall back to index.html (React Router)
      fs.access(fullPath, fs.constants.F_OK, err => {
        serveFile(err ? path.join(DIST_DIR, 'index.html') : fullPath, res)
      })
    } else {
      // Proxy to Vite dev server (keeps base: '/meal-planner/' path intact)
      proxy(req, res, 'localhost', 5175)
    }
    return
  }

  // ── Landing page & assets ──────────────────────────────────────────────────
  let filePath = urlPath === '/' ? '/performuscle-landing.html' : urlPath
  serveFile(path.join(ROOT, filePath), res)

}).listen(PORT, () => {
  console.log(`\n🚀  Performuscle site running at http://localhost:${PORT}`)
  console.log(`    Landing     →  http://localhost:${PORT}/`)
  console.log(`    Meal Planner→  http://localhost:${PORT}/meal-planner/\n`)
})
