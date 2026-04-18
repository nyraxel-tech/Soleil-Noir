const ANIMES = [
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
  { titre:"My Ribdiculous Reincarnation", titreJp:"Megami Isekai Tensei", ep:2, ago:"3j", img:"27pp6", ahId:"xw4de" },
  { titre:"Even a Replica Can Fall in Love", titreJp:"Replica datte, Koi wo Suru.", ep:2, ago:"3j", img:"z35jq", ahId:"k662x" },
  { titre:"The Most Heretical Last Boss Queen S2", titreJp:"Higeki no Genkyou to Naru S2", ep:2, ago:"3j", img:"5zcck", ahId:"np9nt" },
  { titre:"Release That Witch", titreJp:"Fangkai Nage Nuwu", ep:7, ago:"4j", img:"54d5g", ahId:"fwe7e" },
  { titre:"Witch Hat Atelier", titreJp:"Tongari Boushi no Atelier", ep:3, ago:"4j", img:"6rlo7", ahId:"df4in" },
  { titre:"Farming Life in Another World 2", titreJp:"Isekai Nonbiri Nouka 2", ep:2, ago:"4j", img:"b7en4", ahId:"fae6d" },
  { titre:"One Piece", titreJp:"", ep:1157, ago:"5j", img:"zbt7y", ahId:"1ht8d" },
  { titre:"Mission: Yozakura Family Season 2", titreJp:"Yozakura-san Chi no Daisakusen S2", ep:1, ago:"5j", img:"rgi7x", ahId:"feqdi" },
  { titre:"Ace of the Diamond: Act II 2nd Season", titreJp:"Diamond no Ace: Act II 2nd Season", ep:2, ago:"5j", img:"c50pz", ahId:"dd464" },
  { titre:"Wistoria: Wand and Sword 2nd Season", titreJp:"Tsue to Tsurugi no Wistoria S2", ep:1, ago:"5j", img:"h6l0c", ahId:"y98v5" },
  { titre:"Rooster Fighter", titreJp:"Niwatori Fighter", ep:5, ago:"5j", img:"vy576", ahId:"uni0y" },
  { titre:"Welcome to Demon School, Iruma-kun 4", titreJp:"Mairimashita! Iruma-kun 4", ep:2, ago:"6j", img:"lkpy4", ahId:"amsff" },
  { titre:"Scum of the Brave", titreJp:"Yuusha no Kuzu", ep:13, ago:"6j", img:"97302", ahId:"oxx6c" },
  { titre:"Daemons of The Shadow Realm", titreJp:"Yomi no Tsugai", ep:2, ago:"6j", img:"dks5o", ahId:"pm96z" },
  { titre:"Kill Blue", titreJp:"Kill Ao", ep:1, ago:"6j", img:"dns6b", ahId:"y5v48" },
  { titre:"The Strongest Job is an Appraiser!", titreJp:"Saikyou no Shokugyou wa Kanteishi (Kari)", ep:3, ago:"6j", img:"hnxbm", ahId:"ayudj" },
  { titre:"Detective Conan", titreJp:"Meitantei Conan", ep:1197, ago:"6j", img:"lx86z", ahId:"y9prb" },
  { titre:"Pokemon Horizons: The Series", titreJp:"Pocket Monsters (2023)", ep:133, ago:"6j", img:"9fsft", ahId:"9v661" },
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Proxy mode : /api/anime?img=IMGCODE
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

  // Normal mode : return anime list
  res.setHeader("Cache-Control", "s-maxage=3600");
  return res.status(200).json({ animes: ANIMES, updatedAt: "2026-04-18T10:00:00.000Z" });
}
