export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Image proxy ───────────────────────────────────────────────────────────────
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

  // ── Lecture de data.json généré par GitHub Actions ───────────────────────────
  try {
    const r = await fetch("https://raw.githubusercontent.com/nyraxel-tech/anitrack/main/data.json", {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!r.ok) throw new Error("data.json not found");
    const data = await r.json();

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json(data);

  } catch (err) {
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).json({
      animes: [],
      updatedAt: new Date().toISOString(),
      source: "error",
      error: err.message,
    });
  }
}
