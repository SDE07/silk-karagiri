/**
 * Silk Karagiri saree collections shown in the home "Saree Atelier" section.
 * Images live in `public/images/collections/<slug>/NN.webp` and are produced by
 * `scripts/build-collections.mjs` — `count` must match what that script prints.
 * See docs/saree-collections-section.md.
 */
export interface SareeCollection {
  slug: string;
  name: string;
  /** One-line hook under the name. */
  tagline: string;
  story: string;
  fabric: string;
  motif: string;
  border: string;
  /** Number of photos in the folder (01.webp … NN.webp). */
  count: number;
  /** 1-based photo used for the slider card and as the first look on the model. */
  cover: number;
  /** Photos that can't be draped on the model (price tags, gift boxes or people in the frame). */
  noDrape?: number[];
  /** Number of `video-N.mp4` files in the folder. */
  videos?: number;
  badge?: string;
}

export const SAREE_COLLECTIONS: SareeCollection[] = [
  {
    slug: "double-warp-soft-silk",
    name: "Double Warp Soft Silk Saree",
    tagline: "Glassy two-tone sheen, made to last",
    story:
      "Dense double-warp soft silk with a glassy two-tone sheen, scattered zari buttas and contrast pallus in deep jewel tones.",
    fabric: "Double-warp soft silk",
    motif: "Zari buttas & woven checks",
    border: "Contrast border with a rich zari pallu",
    count: 12,
    cover: 3,
  },
  {
    slug: "pure-handloom-double-warp",
    name: "Pure Handloom Double Warp Soft Silk",
    tagline: "Sculpted borders on solid jewel bodies",
    story:
      "Handloom double-warp silk with sculpted thread-work borders — paisleys and florals — set against solid jewel-toned bodies.",
    fabric: "Handloom double-warp soft silk",
    motif: "Self-woven buttas",
    border: "Wide paisley & floral thread-work border",
    count: 9,
    cover: 4,
  },
  {
    slug: "double-warp-gaja-butta",
    name: "Pure Handloom Double Warp — Gaja Butta",
    tagline: "Woven elephants in antique gold",
    story:
      "Rows of woven elephants and fine checks in antique gold, framed by bold contrast borders in magenta and wine.",
    fabric: "Handloom double-warp silk",
    motif: "Gaja (elephant) buttas & checks",
    border: "Contrast border with a zari edge",
    count: 8,
    cover: 1,
  },
  {
    slug: "pure-handloom-soft-silk",
    name: "Pure Handloom Soft Silk Saree",
    tagline: "An everyday heirloom that drapes light",
    story:
      "Clean, solid soft-silk bodies with slim zari stripes and contrast borders — easy to drape, easy to love, made to be worn often.",
    fabric: "Pure handloom soft silk",
    motif: "Plain body with zari stripes",
    border: "Contrast border & tasselled pallu",
    count: 8,
    cover: 7,
    noDrape: [4, 5, 6],
  },
  {
    slug: "rangoli-fresh",
    name: "Rangoli Fresh Collection",
    tagline: "Kolam patterns, woven in silk",
    story:
      "Kolam-inspired rangoli motifs woven across rich two-tone silk, finished with contrast pallus and tasselled ends.",
    fabric: "Soft silk",
    motif: "Rangoli (kolam) buttas",
    border: "Zari stripe border, contrast pallu",
    count: 14,
    cover: 1,
    noDrape: [11, 12, 14],
    badge: "Fresh",
  },
  {
    slug: "small-bhutta-soft-silk",
    name: "Exclusive Small Bhutta Soft Silk",
    tagline: "Dainty bhuttas, deep contrast pallus",
    story:
      "Soft silk with dainty bhuttas and peacock-and-mandala motifs, set off by deep contrast pallus in silver-toned zari.",
    fabric: "Soft silk",
    motif: "Small bhuttas, peacocks & mandalas",
    border: "Striped contrast border",
    count: 12,
    cover: 8,
    badge: "Exclusive",
  },
  {
    slug: "bridal-soft-silk",
    name: "Handloom Exclusive Bridal Soft Silk",
    tagline: "Lotus buttas for the big day",
    story:
      "Lotus and floral buttas in gold zari over lustrous soft silk, with temple borders and contrasting pallus made for the wedding season.",
    fabric: "Handloom soft silk",
    motif: "Lotus & floral zari buttas",
    border: "Temple border, contrast pallu",
    count: 13,
    cover: 5,
    noDrape: [1, 2],
    badge: "Bridal",
  },
  {
    slug: "pure-handloom-border",
    name: "Pure Handloom Border Silk",
    tagline: "See the zari catch the light",
    story:
      "Classic handloom silk with intricately woven zari borders and peacock buttas — watch the weave move in the videos.",
    fabric: "Pure handloom silk",
    motif: "Peacock & mango buttas",
    border: "Heavy woven zari border",
    count: 2,
    cover: 1,
    videos: 2,
  },
  {
    slug: "kanchipuram-soft-silk",
    name: "Kanchipuram Pure Handloom Soft Silk",
    tagline: "Fine checks, grand navy zari pallu",
    story:
      "Fine-checked Kanchipuram soft silk in muted tones, anchored by a deep navy border and a grand zari pallu finished with tassels.",
    fabric: "Kanchipuram handloom soft silk",
    motif: "Fine woven checks",
    border: "Navy zari border & grand pallu",
    count: 4,
    cover: 1,
  },
  {
    slug: "banaras-khaddi-chiffon",
    name: "Banaras Khaddi Chiffon",
    tagline: "Featherlight, sheer, made to move",
    story:
      "Featherlight Banarasi khaddi chiffon with silver zari paisleys and buttis — flowing and sheer, it comes alive when draped.",
    fabric: "Banarasi khaddi chiffon",
    motif: "Zari paisleys (kairi) & buttis",
    border: "Silver zari border",
    count: 15,
    cover: 1,
    noDrape: [2, 3, 7, 10, 13, 14],
  },
  {
    slug: "banaras-kora-organza",
    name: "Banaras Kora Organza",
    tagline: "Crisp organza in a spectrum of shades",
    story:
      "Crisp Banarasi kora organza with scattered zari buttis and a broad tissue pallu, in a spectrum of jewel and pastel shades.",
    fabric: "Banarasi kora organza",
    motif: "Scattered zari buttis",
    border: "Zari border, broad tissue pallu",
    count: 21,
    cover: 5,
    noDrape: [4, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const base = (c: SareeCollection) => `/images/collections/${c.slug}`;

/** The real product photo. */
export const collectionImage = (c: SareeCollection, n: number) => `${base(c)}/${pad(n)}.webp`;
/** Centre crop of the photo at the model's aspect — the fabric "worn" on the Atelier model. */
export const collectionDrape = (c: SareeCollection, n: number) => `${base(c)}/${pad(n)}-drape.webp`;
export const collectionVideo = (c: SareeCollection, n: number) => `${base(c)}/video-${n}.mp4`;

/** Photo numbers that can be worn on the model, cover first. */
export function collectionLooks(c: SareeCollection): number[] {
  const all = Array.from({ length: c.count }, (_, i) => i + 1).filter((n) => !c.noDrape?.includes(n));
  return [c.cover, ...all.filter((n) => n !== c.cover)];
}
