/**
 * Saree mannequin cut-outs used by the layered Silk Karagiri banner and the About page.
 * Kept outside the "use client" banner so server components can read it too.
 */
export const SAREE_MODELS = [
  { src: "/images/about/saree-1.webp", alt: "Pista green organza silk saree with pink floral pallu", name: "Organza Floral" },
  { src: "/images/about/saree-2.webp", alt: "Maroon Kanchipuram silk saree with gold zari pallu", name: "Kanchipuram Maroon" },
  { src: "/images/about/saree-3.webp", alt: "Marigold orange soft silk saree with zari border", name: "Marigold Soft Silk" },
  { src: "/images/about/saree-4.webp", alt: "Blush pink tissue silk saree with gold border", name: "Blush Tissue Silk" },
  { src: "/images/about/saree-5.webp", alt: "Peacock green and gold dual-tone silk saree", name: "Peacock Dual-Tone" },
  { src: "/images/about/saree-6.webp", alt: "Royal blue silk saree with magenta zari border", name: "Royal Blue Paithani" },
] as const;

export type SareeModel = (typeof SAREE_MODELS)[number];
