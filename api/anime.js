export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Image proxy : /api/anime?img=XXXX ──────────────────────────────────────
  const imgCode = req.query?.img;
  if (imgCode) {
    try {
      const r = await fetch(`https://animeheaven.me/image.php?${imgCode}`, {
        headers: {
          "Referer": "https://animeheaven.me/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!r.ok) throw new Error("img not found");
      const buf = await r.arrayBuffer();
      const ct = r.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", ct);
      res.setHeader("Cache-Control", "s-maxage=86400");
      return res.status(200).send(Buffer.from(buf));
    } catch {
      return res.status(404).end();
    }
  }

  // ── Scraping AnimeHeaven toutes les 30 min ──────────────────────────────────
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

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();
    const animes = parseAnimes(html);

    if (animes.length === 0) throw new Error("Parsing returned 0 results");

    // Cache 30 minutes
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=300");
    return res.status(200).json({ animes, updatedAt: new Date().toISOString(), source: "live" });

  } catch (err) {
    // Fallback sur les données statiques si le scraping échoue
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ animes: FALLBACK, updatedAt: new Date().toISOString(), source: "fallback", error: err.message });
  }
}

// ── Parser HTML AnimeHeaven ──────────────────────────────────────────────────
function parseAnimes(html) {
  const animes = [];
  const seen = new Set();

  // Chaque bloc animé contient une image, un lien anime.php, un titre, ep count, time ago
  // Pattern: on split sur les balises img qui contiennent image.php
  const blockRegex = /<a[^>]+href="\/anime\.php\?(\w+)"[^>]*>\s*<img[^>]+src="\/image\.php\?(\w+)"[^>]+alt="([^"]+)"/g;
  const timeRegex = /(\d+)\s*(h|d)\s*ago/g;
  const epRegex = /<a[^>]+href="\/anime\.php\?(\w+)"[^>]*>\s*\n\s*(\d+)\s*\n/g;

  // Map episode counts by ahId
  const epMap = {};
  let epMatch;
  while ((epMatch = epRegex.exec(html)) !== null) {
    epMap[epMatch[1]] = parseInt(epMatch[2]);
  }

  // Extract times
  const times = [];
  let tMatch;
  const timeRegex2 = /(\d+)\s*(h|d)\s*ago/g;
  while ((tMatch = timeRegex2.exec(html)) !== null) {
    times.push(`${tMatch[1]}${tMatch[2]}`);
  }

  let timeIdx = 0;
  let blockMatch;
  while ((blockMatch = blockRegex.exec(html)) !== null) {
    const ahId = blockMatch[1];
    const img = blockMatch[2];
    const titre = blockMatch[3].trim();

    if (!titre || titre.length < 2) continue;
    if (["Sakamoto Days", "Kaiju No. 8", "Mashle"].some(x => titre.includes(x) && timeIdx === 0)) continue; // skip banner images
    if (seen.has(ahId)) continue;
    seen.add(ahId);

    const ep = epMap[ahId] || 1;
    const ago = times[timeIdx] || "1j";
    timeIdx++;

    animes.push({ titre, titreJp: "", ep, ago, img, ahId });
    if (animes.length >= 65) break;
  }

  return animes;
}

// ── Fallback statique (18 avril 2026) ───────────────────────────────────────
const FALLBACK = [
  { titre:"Fist of the North Star (2026)", titreJp:"Hokuto no Ken", ep:4, ago:"8h", img:"ciyvs", ahId:"fpnp2" },
  { titre:"Botan Kamiina Fully Blossoms When Drunk", titreJp:"Kamiina Botan, Yoeru Sugata wa Yuri no Hana", ep:2, ago:"8h", img:"sbyve", ahId:"b0vsk" },
  { titre:"The Drops of God", titreJp:"Kami no Shizuku", ep:2, ago:"9h", img:"par8w", ahId:"m2zjn" },
  { titre:"Snowball Earth", titreJp:"", ep:3, ago:"9h", img:"g0kk7", ahId:"3kfyx" },
  { titre:"That Time I Got Reincarnated as a Slime Season 4", titreJp:"Tensei Shitara Slime Datta Ken S4", ep:3, ago:"10h", img:"pjoyd", ahId:"aplyf" },
  { titre:"The Angel Next Door Spoils Me Rotten Season 2", titreJp:"Otonari no Tenshi-sama S2", ep:3, ago:"10h", img:"c3rqy", ahId:"ttcnk" },
  { titre:"An Observation Log of My Fiancée Who Calls Herself a Villainess", titreJp:"Jishou Akuyaku Reijou na Konyakusha", ep:3, ago:"12h", img:"8ezmn", ahId:"nv9bp" },
  { titre:"All You Need Is Kill", titreJp:"", ep:1, ago:"1j", img:"4kuek", ahId:"hev47" },
  { titre:"Monster Eater", titreJp:"Mamonogurai no Boukensha", ep:3, ago:"1j", img:"anfea", ahId:"pi6yi" },
  { titre:"Killed Again, Mr. Detective?", titreJp:"Mata Korosarete Shimatta", ep:3, ago:"1j", img:"j0cec", ahId:"0cwi8" },
  { titre:"Haibara's Teenage New Game+", titreJp:"Haibara-kun no Tsuyokute Seishun New Game", ep:3, ago:"1j", img:"dw9gn", ahId:"7s4ze" },
  { titre:"Petals of Reincarnation", titreJp:"Reincarnation no Kaben", ep:3, ago:"1j", img:"iideg", ahId:"b2ybn" },
  { titre:"Dr. Stone: Science Future - Part III", titreJp:"", ep:3, ago:"1j", img:"oxfds", ahId:"xvd0a" },
  { titre:"The Barbarian's Bride", titreJp:"Himekishi wa Barbaroi no Yome", ep:2, ago:"1j", img:"synxi", ahId:"hi6b1" },
  { titre:"Record of Grancrest War", titreJp:"Grancrest Senki", ep:24, ago:"2j", img:"1zf4l", ahId:"lv7v8" },
  { titre:"The Beginning After the End Season 2", titreJp:"Saikyou no Ousama S2", ep:3, ago:"2j", img:"zmy4z", ahId:"fv1vj" },
  { titre:"Reborn as a Vending Machine, I Now Wander the Dungeon 3rd Season", titreJp:"Jidouhanbaiki ni Umarekawatta S3", ep:3, ago:"2j", img:"cirfw", ahId:"5iqzo" },
  { titre:"Dorohedoro 2", titreJp:"", ep:5, ago:"2j", img:"t71fe", ahId:"pgjgh" },
  { titre:"Re:ZERO: Starting Life in Another World Season 4", titreJp:"Re:Zero kara Hajimeru Isekai Seikatsu S4", ep:2, ago:"2j", img:"7tc0j", ahId:"ilp9j" },
  { titre:"Rent-a-Girlfriend Season 5", titreJp:"Kanojo, Okarishimasu 5th Season", ep:2, ago:"2j", img:"7nqj7", ahId:"i0kd0" },
  { titre:"Classroom of the Elite 4th Season", titreJp:"Youkoso Jitsuryoku Shijou S4", ep:6, ago:"2j", img:"npea5", ahId:"nzwhr" },
  { titre:"Release That Witch", titreJp:"Fangkai Nage Nuwu", ep:7, ago:"4j", img:"54d5g", ahId:"fwe7e" },
  { titre:"Witch Hat Atelier", titreJp:"Tongari Boushi no Atelier", ep:3, ago:"4j", img:"6rlo7", ahId:"df4in" },
  { titre:"Farming Life in Another World 2", titreJp:"Isekai Nonbiri Nouka 2", ep:2, ago:"4j", img:"b7en4", ahId:"fae6d" },
  { titre:"One Piece", titreJp:"", ep:1157, ago:"5j", img:"zbt7y", ahId:"1ht8d" },
  { titre:"Wistoria: Wand and Sword 2nd Season", titreJp:"Tsue to Tsurugi no Wistoria S2", ep:1, ago:"5j", img:"h6l0c", ahId:"y98v5" },
  { titre:"Rooster Fighter", titreJp:"Niwatori Fighter", ep:5, ago:"5j", img:"vy576", ahId:"uni0y" },
  { titre:"Welcome to Demon School, Iruma-kun 4", titreJp:"Mairimashita! Iruma-kun 4", ep:2, ago:"6j", img:"lkpy4", ahId:"amsff" },
  { titre:"Scum of the Brave", titreJp:"Yuusha no Kuzu", ep:13, ago:"6j", img:"97302", ahId:"oxx6c" },
  { titre:"Daemons of The Shadow Realm", titreJp:"Yomi no Tsugai", ep:2, ago:"6j", img:"dks5o", ahId:"pm96z" },
  { titre:"Detective Conan", titreJp:"Meitantei Conan", ep:1197, ago:"6j", img:"lx86z", ahId:"y9prb" },
  { titre:"Pokemon Horizons: The Series", titreJp:"Pocket Monsters (2023)", ep:133, ago:"6j", img:"9fsft", ahId:"9v661" },
];
