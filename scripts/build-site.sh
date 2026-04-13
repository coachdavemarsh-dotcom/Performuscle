#!/usr/bin/env bash
# Build script for Netlify — assembles landing page + meal planner into dist/
set -e

echo "🏗  Building Performuscle site..."

# Clean output dir
rm -rf dist
mkdir -p dist/meal-planner

# ── Landing page ──────────────────────────────────────────────────────────────
echo "  → Copying landing page..."
cp performuscle-landing.html dist/index.html

# Copy any top-level images/assets (hero.jpg, coaching.jpg, etc.)
for ext in jpg jpeg png webp svg ico gif; do
  find . -maxdepth 1 -name "*.${ext}" -exec cp {} dist/ \; 2>/dev/null || true
done

# ── Meal planner ──────────────────────────────────────────────────────────────
echo "  → Building meal planner..."
cd meal-planner
npm install --prefer-offline
npm run build
cd ..

cp -r meal-planner/dist/* dist/meal-planner/

echo ""
echo "✅  Build complete — dist/ is ready for Netlify"
echo "    Landing page  →  dist/index.html"
echo "    Meal planner  →  dist/meal-planner/"
