export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Image proxy : /api/anime?img=XXXX ────────────────────────────────────────
  if (req.query?.img) {
    try {
      const r = await fetch(`https://animeheaven.me/image.php?${req.query.img}`, {
        headers: {
          "Referer": "https://animeheaven.me/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!r.ok) throw new Error("not found");
      const buf = await r.arrayBuffer();
      res.setHeader("Content-Type", r.headers.get("content-type") || "image/jpeg");
      res.setHeader("Cache-Control", "s-maxage=86400");
      return res.status(200).send(Buffer.from(buf));
    } catch { return res.status(404).end(); }
  }

  // ── Scraping dynamique 100% ──────────────────────────────────────────────────
  try {
    const r = await fetch("https://animeheaven.me/new.php", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://animeheaven.me/",
        "Cache-Control": "no-cache",
      },
    });

    if (!r.ok) throw new Error(`AnimeHeaven returned HTTP ${r.status}`);
    const html = await r.text();

    // ── Parser basé sur la structure réelle du HTML ────────────────────────────
    // Chaque animé est séparé par "add.svg" dans le HTML
    // Structure d'un bloc :
    //   ...image.php?IMG...  anime.php?ID...  EP  [Titre](lien)  TitreJp  Xh/d ago
    const animes = [];
    const seen = new Set();
    const blocks = html.split('/add.svg');

    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];

      // Extrait l'ID de l'animé
      const idMatch = block.match(/anime\.php\?(\w+)/);
      // Extrait le code image
      const imgMatch = block.match(/image\.php\?(\w+)/);
      // Extrait le titre depuis le lien markdown
      const titleMatch = block.match(/\[([^\]]+)\]\(https:\/\/animeheaven\.me\/anime\.php\?\w+\)/);
      // Extrait le nombre d'épisodes (premier nombre seul sur une ligne)
      const epMatch = block.match(/^\s*(\d+)\s*$/m);
      // Extrait le temps (ex: "8 h ago" ou "1 d ago")
      const timeMatch = block.match(/(\d+)\s*(h|d)\s*ago/);

      if (!idMatch || !imgMatch || !titleMatch || !timeMatch) continue;

      const ahId = idMatch[1];
      const titre = titleMatch[1].trim();

      // Ignore les doublons et les éléments de navigation
      if (seen.has(ahId)) continue;
      if (titre.length < 2) continue;
      if (["New","Popular","Fall","Random","MORE","POPULAR","Tools"].includes(titre)) continue;

      seen.add(ahId);

      // Extrait le titre japonais (ligne après le titre, avant le temps)
      let titreJp = "";
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const titleLineIdx = lines.findIndex(l => l.includes(`[${titre}]`));
      if (titleLineIdx >= 0) {
        const nextLine = lines[titleLineIdx + 1];
        if (nextLine && !nextLine.match(/\d+\s*(h|d)\s*ago/) && nextLine !== "-" && !nextLine.startsWith("[") && !nextLine.startsWith("!")) {
          titreJp = nextLine;
        }
      }

      animes.push({
        titre,
        titreJp,
        ep: epMatch ? parseInt(epMatch[1]) : 1,
        ago: `${timeMatch[1]}${timeMatch[2]}`,
        img: imgMatch[1],
        ahId,
      });

      if (animes.length >= 80) break;
    }

    if (animes.length === 0) throw new Error("Parser returned 0 results");

    // Cache 30 minutes
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json({
      animes,
      updatedAt: new Date().toISOString(),
      source: "live",
      count: animes.length,
    });

  } catch (err) {
    // En cas d'échec, on retourne une erreur claire
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).json({
      animes: [],
      updatedAt: new Date().toISOString(),
      source: "error",
      error: err.message,
    });
  }
}
