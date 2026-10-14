/**
 * The seven campaign images in `public/images/scrollerimg/`, described by what each one actually
 * shows. Every image has its saree type printed on it — all are Kancheepuram (Kanchipattu) silk — so
 * names come from the saree's colour plus that printed line. Shared by the home wheel
 * (SareeHeritageShowcase) and the 3D hover gallery, so a label can never disagree with its picture.
 */
export interface ShowcaseSaree {
  image: string;
  /** What the saree is, e.g. "Royal Purple Kancheepuram". */
  name: string;
  /** The line printed on the image. */
  line: string;
  description: string;
  /** The saree's colour, used for the gallery's hover glow. */
  glow: string;
}

export const KANCHI_SHOWCASE: ShowcaseSaree[] = [
  {
    image: "/images/scrollerimg/img1.webp",
    name: "Marigold Kancheepuram",
    line: "Pure Kancheepuram · 2G Zari",
    description: "Marigold handwoven silk with an all-over gold zari brocade and a rich zari pallu.",
    glow: "rgba(230,126,34,0.45)",
  },
  {
    image: "/images/scrollerimg/img2.webp",
    name: "Magenta Kancheepuram",
    line: "Pure Kancheepuram · Handwoven",
    description: "Magenta silk covered in gold zari florals, framed by a broad zari border.",
    glow: "rgba(159,45,85,0.45)",
  },
  {
    image: "/images/scrollerimg/img3.webp",
    name: "Parrot Green Kancheepuram",
    line: "Pure Kancheepuram · Handwoven",
    description: "Parrot-green silk with gold buttis and a contrast magenta-and-gold border.",
    glow: "rgba(110,160,40,0.45)",
  },
  {
    image: "/images/scrollerimg/img4.webp",
    name: "Bottle Green Kancheepuram",
    line: "Pure Kancheepuram · 2G Zari",
    description: "Deep bottle-green silk with fine zari checks and a maroon-and-gold border.",
    glow: "rgba(6,78,59,0.45)",
  },
  {
    image: "/images/scrollerimg/img5.webp",
    name: "Royal Purple Kancheepuram",
    line: "Kancheepuram Silk · 2G Zari",
    description: "Royal purple silk with gold buttas and a wide gold zari border and pallu.",
    glow: "rgba(91,33,182,0.45)",
  },
  {
    image: "/images/scrollerimg/img6.webp",
    name: "Classic Red Kancheepuram",
    line: "Kancheepuram Silk · 2G Zari",
    description: "Classic red silk with a green-edged gold zari border — a timeless bridal choice.",
    glow: "rgba(185,28,28,0.45)",
  },
  {
    image: "/images/scrollerimg/img7.webp",
    name: "Floral Tissue Kanchipattu",
    line: "Pure Kanchipattu · Tissue Edge",
    description: "Shimmering tissue silk with pastel florals and a fine tissue edge.",
    glow: "rgba(212,175,55,0.45)",
  },
];

/** The same sarees shaped for the 3D hover gallery (title / category / description). */
export const SHOWCASE_GALLERY_ITEMS = KANCHI_SHOWCASE.map((saree) => ({
  url: saree.image,
  title: saree.name,
  category: saree.line,
  description: saree.description,
  glow: saree.glow,
  href: "/products?category=Sarees",
}));
