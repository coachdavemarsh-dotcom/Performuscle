-- Fix 6 missing recipe image URLs
-- Run in Supabase SQL Editor

-- Fix name mismatch: seed has 'Sweet & Sour' but old SQL used 'Sweet And Sour'
UPDATE recipes SET image_url = '/recipes/sweet-and-sour-pork-stir-fry.jpeg' WHERE name = 'Sweet & Sour Pork Stir-Fry';

-- Vol III recipes (images newly extracted from RECIPE PACK 3.1.pdf)
UPDATE recipes SET image_url = '/recipes/bacon-mushroom-hash.jpeg'            WHERE name = 'Bacon & Mushroom Hash';
UPDATE recipes SET image_url = '/recipes/baked-cod-nduja-butterbeans.jpeg'    WHERE name = 'Baked Cod with Nduja & Butterbeans';
UPDATE recipes SET image_url = '/recipes/beef-and-broccoli.jpeg'              WHERE name = 'Beef & Broccoli';
UPDATE recipes SET image_url = '/recipes/beef-picadillo.jpeg'                 WHERE name = 'Beef Picadillo';
UPDATE recipes SET image_url = '/recipes/cajun-chicken-pasta.jpeg'            WHERE name = 'Cajun Chicken Pasta';
