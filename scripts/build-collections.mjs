/**
 * One-off asset pipeline for the home "Saree Atelier" section.
 * Reads the client's WhatsApp-exported folders from `public/images/all sarries/` and writes
 * optimised, consistently named files to `public/images/collections/<slug>/`.
 *
 *   node scripts/build-collections.mjs            # all collections
 *   node scripts/build-collections.mjs <slug>     # just one
 *
 * Re-runnable: each output folder is rebuilt from scratch. Prints the resulting image count per
 * collection, which `src/data/collections.data.ts` relies on.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const SRC = "assets/all sarries"; // client originals — kept out of public/ so they are not deployed
const OUT = "public/images/collections";
const MAX_EDGE = 1200;
const MIN_WIDTH = 700; // smaller shots blur on the stage

/** Supplied folder → site slug. Order is the client's numbering. */
const FOLDERS = [
  ["double wrap soft silk saree-1", "double-warp-soft-silk"],
  ["Pure handloom Double warp soft silk saree-2", "pure-handloom-double-warp"],
  ["Pure handloom Doubl -3", "double-warp-gaja-butta"],
  ["PURE HANDLOOM SOFT  SILK SARE-4", "pure-handloom-soft-silk"],
  ["RANGOLI FRESH COLLECTIONS-5", "rangoli-fresh"],
  ["EXCLUSIVE  SMALL BHUTTA  SOFT silk-6", "small-bhutta-soft-silk"],
  ["handloom exclusive  bridal collection for soft-7", "bridal-soft-silk"],
  ["Pure Handloom Border 7", "pure-handloom-border"],
  ["KANCHIPURAM PURE HANDLOOM SOF-8", "kanchipuram-soft-silk"],
  ["Banaras Khaddi Chiffon-9", "banaras-khaddi-chiffon"],
  ["Banaras Kora Organza-10", "banaras-kora-organza"],
];

/** Source files (0-based, sorted by name) that are visual duplicates of a neighbour. */
const EXCLUDE = { "banaras-khaddi-chiffon": [13] };

/**
 * Drape swatch: the centre of each photo (where the fabric is, away from table edges and price
 * tags), cropped to the try-on model's aspect. Used as the fabric "worn" on the Atelier stage.
 */
const SWATCH_CROP = 0.56;
const SWATCH_SIZE = { width: 900, height: 1388 }; // model photo aspect (533 × 822), sharp at 2× density

/**
 * Where the centre crop would catch a contrast border or the table instead of the saree body, the
 * swatch is built from a clean patch of the body (fractions of the photo), tiled with mirroring so
 * the seams match. Suits small repeating weaves. Kanchipuram: the plain checked body is a narrow
 * diagonal band between the navy-and-gold border (top-right) and the table (bottom-left).
 */
const SWATCH_PATCH = {
  "kanchipuram-soft-silk": { left: 0.04, top: 0.42, width: 0.24, height: 0.2 },
};

/**
 * Fills SWATCH_SIZE by tiling a patch of the saree body. The patch's own fold shading is divided out
 * first (pixel ÷ heavy blur × mean), leaving just the weave and colour — otherwise the folds would
 * repeat visibly. The try-on model supplies the drape's shading.
 */
async function tiledSwatch(photo, w, h, box) {
  const region = { left: Math.round(w * box.left), top: Math.round(h * box.top), width: Math.round(w * box.width), height: Math.round(h * box.height) };
  const { data, info } = await photo.clone().extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const raw = { raw: { width: info.width, height: info.height, channels: 3 } };
  // σ 3 px: wider than the 1–2 px check lines (kept), narrow enough to divide out pleat creases.
  const low = await sharp(data, raw).blur(3).raw().toBuffer();
  const mean = [0, 1, 2].map((c) => { let t = 0; for (let i = c; i < data.length; i += 3) t += data[i]; return t / (data.length / 3); });
  const flat = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) flat[i] = Math.max(0, Math.min(255, Math.round((data[i] / Math.max(1, low[i])) * mean[i % 3])));
  const tile = await sharp(flat, raw).png().toBuffer();
  return sharp({ create: { ...SWATCH_SIZE, channels: 3, background: "#000" } }).composite([{ input: tile, tile: true, left: 0, top: 0 }]);
}

const only = process.argv[2];

const pad = (n) => String(n).padStart(2, "0");

for (const [folder, slug] of FOLDERS) {
  if (only && slug !== only) continue;
  const srcDir = path.join(SRC, folder);
  const outDir = path.join(OUT, slug);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).sort();
  const seen = new Set();
  let images = 0;
  let videos = 0;
  let skipped = 0;

  for (const [i, file] of files.entries()) {
    if (EXCLUDE[slug]?.includes(i)) { skipped++; continue; }
    const p = path.join(srcDir, file);
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash("sha1").update(buf).digest("hex");
    if (seen.has(hash)) { skipped++; continue; }
    seen.add(hash);

    if (/\.mp4$/i.test(file)) {
      fs.copyFileSync(p, path.join(outDir, `video-${++videos}.mp4`));
      continue;
    }
    if (!/\.jpe?g$/i.test(file)) continue;

    const { width = 0 } = await sharp(buf).metadata();
    if (width < MIN_WIDTH) { skipped++; continue; }

    const n = pad(++images);
    const photo = sharp(buf).rotate();
    await photo
      .clone()
      .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(path.join(outDir, `${n}.webp`));

    const { width: w = 0, height: h = 0 } = await photo.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
    const cw = Math.round(w * SWATCH_CROP), ch = Math.round(h * SWATCH_CROP);
    const swatch = SWATCH_PATCH[slug]
      ? await tiledSwatch(photo, w, h, SWATCH_PATCH[slug])
      : photo
          .clone()
          .extract({ left: Math.round((w - cw) / 2), top: Math.round((h - ch) / 2), width: cw, height: ch })
          .resize({ ...SWATCH_SIZE, fit: "cover" });
    // Unsharp mask and micro-contrast restore weave detail lost to compression, making the draped saree crisp.
    await swatch
      .modulate({ saturation: 1.08 })
      .sharpen({ sigma: 1.2, m1: 1.2, m2: 3.2 })
      .webp({ quality: 92 })
      .toFile(path.join(outDir, `${n}-drape.webp`));
  }

  console.log(`${slug.padEnd(28)} images=${images} videos=${videos} skipped=${skipped}`);
}
