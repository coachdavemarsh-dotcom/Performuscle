// Netlify serverless function — fetches & parses the Substack RSS feed server-side
// so the browser avoids CORS issues. Called from the landing page as:
//   /.netlify/functions/substack-feed

const FEED_URL = 'https://coachdavemarsh.substack.com/feed';

exports.handler = async function () {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);
    const xml = await res.text();

    const items = [];

    // Extract <item> blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(xml)) !== null) {
      const block = itemMatch[1];

      const title    = decode(get(block, 'title'));
      const link     = get(block, 'link');
      const pubDate  = get(block, 'pubDate');
      const desc     = decode(stripHtml(get(block, 'description')));

      // Image: prefer <enclosure url="..."> then <media:content url="...">
      let image = '';
      const enclosure = block.match(/<enclosure[^>]+url="([^"]+)"/i);
      if (enclosure) image = enclosure[1];
      if (!image) {
        const media = block.match(/<media:content[^>]+url="([^"]+)"/i);
        if (media) image = media[1];
      }

      if (title && link) {
        items.push({ title, link, pubDate, description: desc, image });
      }

      if (items.length >= 3) break;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=900', // cache 15 min
      },
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message, items: [] }),
    };
  }
};

// ── helpers ──────────────────────────────────────────────────────────────────

function get(block, tag) {
  // Handles <tag>value</tag> and <tag><![CDATA[value]]></tag>
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
  const m  = block.match(re);
  return m ? m[1].trim() : '';
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decode(str) {
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, ' ');
}
