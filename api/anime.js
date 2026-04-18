export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const r = await fetch("https://animeheaven.me/new.php", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://animeheaven.me/",
      },
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    const animes = [];

    // Extract image codes
    const imgCodes = [...html.matchAll(/image\.php\?(\w+)/g)].map(m => m[1]);
    // Extract anime IDs
    const ahIds = [...html.matchAll(/anime\.php\?(\w+)/g)].map(m => m[1]);
    // Extract titles from alt attributes
    const titles = [...html.matchAll(/alt="([^"]+)"/g)].map(m => m[1]);
    // Extract time ago
    const times = [...html.matchAll(/(\d+)\s*(?:h|d)\s*ago/g)].map(m => m[0].replace(/\s+/g,''));
    // Extract episode numbers - numbers that appear between anchor tags
    const epNums = [...html.matchAll(/<a[^>]+anime\.php\?(\w+)[^>]*>\s*\n(\d+)/g)].map(m => ({ id: m[1], ep: parseInt(m[2]) }));

    const epMap = {};
    epNums.forEach(e => { epMap[e.id] = e.ep; });

    const seen = new Set();
    let timeIdx = 0;

    for (let i = 0; i < Math.min(imgCodes.length, titles.length, ahIds.length); i++) {
      const img = imgCodes[i];
      const titre = titles[i];
      const ahId = ahIds[i];

      if (!titre || !img || !ahId) continue;
      if (seen.has(ahId)) continue;
      if (["Anime Heaven", "ah_logo"].some(x => titre.includes(x))) continue;
      if (titre.length < 2) continue;

      seen.add(ahId);

      const ep = epMap[ahId] || 1;
      const ago = times[timeIdx] || "1j";
      if (times[timeIdx]) timeIdx++;

      animes.push({ titre, titreJp: "", ep, ago, img, ahId });
      if (animes.length >= 60) break;
    }

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    return res.status(200).json({ animes, updatedAt: new Date().toISOString() });

  } catch (err) {
    return res.status(200).json({ animes: [], error: err.message });
  }
}
