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

# Copy recipe images from the app's public folder so they're served on coachdavemarsh.net/recipes/
if [ -d "public/recipes" ]; then
  echo "  → Copying recipe images..."
  mkdir -p dist/recipes
  cp public/recipes/*.jpeg dist/recipes/ 2>/dev/null || true
  cp public/recipes/*.jpg  dist/recipes/ 2>/dev/null || true
  cp public/recipes/*.png  dist/recipes/ 2>/dev/null || true
  echo "     $(ls dist/recipes | wc -l | tr -d ' ') recipe images copied"
fi

# ── Coach / mentee tools ──────────────────────────────────────────────────────
echo "  → Copying tool pages..."
[ -f "public/structural-balance.html" ] && cp public/structural-balance.html dist/structural-balance.html
[ -f "public/coach-tools.html" ]        && cp public/coach-tools.html        dist/coach-tools.html
[ -f "public/1rm-calculator.html" ]     && cp public/1rm-calculator.html     dist/1rm-calculator.html
[ -f "public/body-composition.html" ]   && cp public/body-composition.html   dist/body-composition.html

# ── Meal planner ──────────────────────────────────────────────────────────────
echo "  → Building meal planner..."
cd meal-planner
npm install --prefer-offline
npm run build
cd ..

cp -r meal-planner/dist/* dist/meal-planner/

echo ""
echo "✅  Build complete — dist/ is ready for Netlify"
echo "    Landing page         →  dist/index.html"
echo "    Meal planner         →  dist/meal-planner/"
echo "    Structural Balance   →  dist/structural-balance.html"
echo "    Coach Tools          →  dist/coach-tools.html"
echo "    1RM Calculator       →  dist/1rm-calculator.html"
echo "    Body Composition     →  dist/body-composition.html"
