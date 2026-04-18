export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const r = await fetch("https://animeheaven.me/new.php", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://animeheaven.me/",
      },
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    const animes = [];
    const sections = html.split('class="add"');

    for (let i = 1; i < sections.length; i++) {
      const s = sections[i];
      const ahIdMatch  = s.match(/anime\.php\?(\w+)/);
      const imgMatch   = s.match(/image\.php\?(\w+)/);
      const titleMatch = s.match(/anime\.php\?\w+[^>]*>([^<]+)</);
      const epMatch    = s.match(/>(\d+)</);
      const timeMatch  = s.match(/(\d+)\s*(h|d)\s*ago/);

      if (!ahIdMatch || !imgMatch || !titleMatch || !timeMatch) continue;

      const titre = titleMatch[1].trim();
      if (titre.length < 2 || ["New","Popular","Fall","Random","MORE"].includes(titre)) continue;
      if (animes.find(a => a.ahId === ahIdMatch[1])) continue;

      animes.push({
        titre,
        titreJp: "",
        ep: epMatch ? parseInt(epMatch[1]) : 1,
        ago: `${timeMatch[1]}${timeMatch[2]}`,
        img: imgMatch[1],
        ahId: ahIdMatch[1],
      });
    }

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    return res.status(200).json({ animes, updatedAt: new Date().toISOString() });

  } catch (err) {
    return res.status(200).json({ animes: [], error: err.message });
  }
}
