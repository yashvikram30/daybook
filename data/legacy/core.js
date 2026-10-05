// Helpers shared by all curriculum data files.
// Link kinds: read (article/book/paper), video, docs (reference), lab (interactive/hands-on).
const yt = (id) => "https://www.youtube.com/watch?v=" + id;
const lc = (slug) => "https://leetcode.com/problems/" + slug + "/";
const R = (t, u, n) => ({ k: "read", t, u, n });
const V = (t, id, n) => ({ k: "video", t, u: yt(id), n });
const D = (t, u, n) => ({ k: "docs", t, u, n });
const L = (t, u, n) => ({ k: "lab", t, u, n });
const P = (t, slug, d) => ({ t, u: lc(slug), d });

window.PHASES = {
  arch: { name: "Architecture", lang: "Python" },
  os: { name: "Operating systems", lang: "Python" },
  net: { name: "Networking", lang: "Python" },
  db: { name: "Databases", lang: "Python" },
  dist: { name: "Distributed systems", lang: "Python" },
  swe: { name: "Software engineering", lang: "Python" },
  ml: { name: "Machine learning and generative AI", lang: "Python" },
};

window.WEEKS = [];
