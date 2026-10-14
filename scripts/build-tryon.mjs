/**
 * Builds the "virtual drape" layers for the home Saree Atelier stage from one model photo.
 *
 *   node scripts/build-tryon.mjs
 *
 * Input:  assets/atelier/model-red-saree.png     — model in a solid red saree (533 × 822)
 *         assets/atelier/model-red-saree-4x.png  — its 4× AI upscale (2132 × 3288), made with
 *           Real-ESRGAN (realesrgan-ncnn-vulkan, model realesrgan-x4plus):
 *           realesrgan-ncnn-vulkan -i model-red-saree.png -o model-red-saree-4x.png -n realesrgan-x4plus
 *           Optional — without it the layers fall back to a plain Lanczos upscale.
 * Output: public/images/atelier/
 *   model-hd.webp  the model cut out of her background (alpha), 4× — bottom layer
 *   mask-hd.png    saree area as alpha, 2× — the selected fabric is shown only inside it
 *   shade-hd.png   the saree's folds/shadows as grey + alpha, 2× — multiplied over the fabric
 *   gloss-hd.png   the silk highlights as white + alpha, 2× — screened over the fabric
 *
 * The saree is found by colour (saturated red), then cleaned up: keep the largest region,
 * fill the gold zari motifs inside it (but not skin — the hand at the waist stays visible),
 * and feather the edge. Swap the model by changing SRC and the colour test in `isSaree`.
 */
import fs from "node:fs";
import sharp from "sharp";

const SRC = "assets/atelier/model-red-saree.png";
const OUT = "public/images/atelier";

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

const hsv = (i) => {
  const r = data[i * 3] / 255, g = data[i * 3 + 1] / 255, b = data[i * 3 + 2] / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max };
};

const isSaree = ({ h, s, v }) => (h < 16 || h > 335) && s > 0.5 && v > 0.1; // low v keeps the shadowed hem

/** Labels 4-connected regions where `pick(i)` is true; returns regions as index arrays. */
function regions(pick) {
  const seen = new Uint8Array(N);
  const out = [];
  const stack = new Int32Array(N);
  for (let start = 0; start < N; start++) {
    if (seen[start] || !pick(start)) continue;
    let top = 0;
    stack[top++] = start;
    seen[start] = 1;
    const px = [];
    while (top) {
      const i = stack[--top];
      px.push(i);
      const x = i % W, y = (i / W) | 0;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j >= 0 && !seen[j] && pick(j)) { seen[j] = 1; stack[top++] = j; }
      }
    }
    out.push(px);
  }
  return out;
}

// 1. Colour match → keep only the largest region (drops rose petals, lips, stray pixels).
const raw = new Uint8Array(N);
for (let i = 0; i < N; i++) raw[i] = isSaree(hsv(i)) ? 1 : 0;
const largest = regions((i) => raw[i] === 1).sort((a, b) => b.length - a.length)[0];
const mask = new Uint8Array(N);
for (const i of largest) mask[i] = 1;
/** Pixels that are genuinely red cloth — the only ones whose brightness is trusted for shading. */
const cloth = mask.slice();

// 1b. Morphological close (dilate → erode) bridges zari motifs that sit on the saree's edge, where
//     hole-filling can't reach them. Skin the close swept in (hand at the waist) is cut back out.
const CLOSE_R = 10;
const morph = (src, grow, r = CLOSE_R) => {
  const pass = (a, horizontal) => {
    const out = new Uint8Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = grow ? 0 : 1;
      for (let k = -r; k <= r && v === (grow ? 0 : 1); k++) {
        const xx = horizontal ? x + k : x, yy = horizontal ? y : y + k;
        const inside = xx >= 0 && yy >= 0 && xx < W && yy < H;
        const s = inside ? a[yy * W + xx] : 0;
        if (grow ? s : !s) v = grow ? 1 : 0;
      }
      out[y * W + x] = v;
    }
    return out;
  };
  return pass(pass(src, true), false);
};
const closed = morph(morph(mask, true), false);
// Zari and skin share a hue here, but zari is brighter: measured region averages are v ≈ 0.82–0.94 for
// zari vs ≈ 0.73 for the hand and the gap between the pleats — so decide per region, not per pixel.
for (const region of regions((i) => closed[i] && !mask[i])) {
  const avgV = region.reduce((sum, i) => sum + hsv(i).v, 0) / region.length;
  if (avgV >= 0.8) for (const i of region) mask[i] = 1;
}

// 1c. Zari flecks on the saree's outer edge can't be enclosed by a close. Absorb bright-gold patches
//     that touch the saree if they are small and saturated — the blouse is large (~2.4k px) and the
//     wall/floor are low-saturation (s ≈ 0.33), so both stay untouched.
// Lit zari is bright; zari in the pallu's shadow is darker (v ≈ 0.5) but strongly saturated (s ≥ 0.55),
// which the hand (s ≈ 0.47) and the wall (s ≈ 0.33) never are.
const zariLike = (i) => {
  const c = hsv(i);
  return !mask[i] && c.h >= 10 && c.h <= 50 && ((c.v >= 0.7 && c.s > 0.3) || (c.v >= 0.3 && c.s >= 0.55));
};
const touchesMask = (i) => { const x = i % W; return (x > 0 && mask[i - 1]) || (x < W - 1 && mask[i + 1]) || (i >= W && mask[i - W]) || (i < N - W && mask[i + W]); };
for (const region of regions(zariLike)) {
  const avgS = region.reduce((sum, i) => sum + hsv(i).s, 0) / region.length;
  if (region.length < 1200 && avgS >= 0.4 && region.some(touchesMask)) for (const i of region) mask[i] = 1;
}

// 2. Fill enclosed holes that are zari (gold, hue > 30°) or tiny specks; leave skin holes open.
for (const hole of regions((i) => mask[i] === 0)) {
  const touchesEdge = hole.some((i) => { const x = i % W, y = (i / W) | 0; return x === 0 || y === 0 || x === W - 1 || y === H - 1; });
  if (touchesEdge) continue;
  const avgHue = hole.reduce((sum, i) => sum + hsv(i).h, 0) / hole.length;
  if (hole.length < 40 || (hole.length < 2500 && avgHue > 30 && avgHue < 80)) for (const i of hole) mask[i] = 1;
}

// 2b. Cut the model out of her background. The wall and floor are low-saturation beige
//     (measured s ≈ 0.25–0.41) while skin is s ≈ 0.54–0.74 — but the gold blouse (s 0.44) sits close
//     to the wall, so a plain threshold would bite into it. Instead the background is flood-filled,
//     stepping only between *similar* neighbouring wall-coloured pixels, so it stops at every real
//     edge. Seeds: the frame edge, plus clean wall pixels anywhere (reaches the patch enclosed by
//     her raised arm). Then keep only what is attached to the saree (drops bowl, lamp, arch moulding).
const wallish = (c) => c.s < 0.47 && c.v > 0.3 && c.h > 10 && c.h < 45;
const cleanWall = (c) => c.s > 0.2 && c.s < 0.33 && c.v > 0.78 && c.v < 0.92 && c.h > 22 && c.h < 32;
const step = (a, b) => Math.abs(data[a * 3] - data[b * 3]) + Math.abs(data[a * 3 + 1] - data[b * 3 + 1]) + Math.abs(data[a * 3 + 2] - data[b * 3 + 2]);
const FLOOD_TOL = 20;
const bg = new Uint8Array(N);
const queue = [];
for (let i = 0; i < N; i++) {
  const x = i % W, y = (i / W) | 0;
  const edge = x === 0 || y === 0 || x === W - 1 || y === H - 1;
  const c = hsv(i);
  if (!mask[i] && ((edge && wallish(c)) || cleanWall(c))) { bg[i] = 1; queue.push(i); }
}
while (queue.length) {
  const i = queue.pop();
  const x = i % W, y = (i / W) | 0;
  for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
    if (j >= 0 && !bg[j] && !mask[j] && wallish(hsv(j)) && step(i, j) < FLOOD_TOL) { bg[j] = 1; queue.push(j); }
  }
}
// Scene rules for this photo (update if the model photo changes): below the skirting line, and in the
// lamp's area right of the pallu, nothing of her shows except the saree — so only saree counts there.
// This severs the bowl, lamp and floor, which otherwise connect to the hem through the marble.
const FLOOR_Y = 628;
const LAMP = { x: 420, y: 380 };
// The skirting's red reflection leaves 1px slivers in the saree mask at floor level; a 1px open there clears them.
const openedMask = morph(morph(mask, false, 1), true, 1);
for (let i = FLOOR_Y * W; i < N; i++) mask[i] = openedMask[i];
for (let i = 0; i < N; i++) {
  const x = i % W, y = (i / W) | 0;
  if (!mask[i] && (y > FLOOR_Y || (x > LAMP.x && y > LAMP.y))) bg[i] = 1;
}
// Open (erode → dilate) breaks hairline bridges to the lamp/bowl before picking the saree's component.
let person = new Uint8Array(N);
for (let i = 0; i < N; i++) person[i] = bg[i] ? 0 : 1;
person = morph(morph(person, false, 2), true, 2);
const body = regions((i) => person[i] === 1).sort((a, b) => b.filter((i) => mask[i]).length - a.filter((i) => mask[i]).length)[0];
person = new Uint8Array(N);
for (const i of body) person[i] = 1;
for (let i = 0; i < N; i++) if (mask[i]) person[i] = 1; // never lose saree pixels to the open
// Fill pinholes inside the figure (specular highlights that looked like wall).
for (const hole of regions((i) => person[i] === 0)) {
  if (hole.length < 300 && !hole.some((i) => { const x = i % W, y = (i / W) | 0; return x === 0 || y === 0 || x === W - 1 || y === H - 1; })) for (const i of hole) person[i] = 1;
}

// 3. Output. Masks come from the 1× analysis above (its thresholds are tuned for that size); pixels
//    come from the HD master, so the model is crisp. The model photo is written at 4×; the mask, fold
//    and gloss layers are smooth, so 2× is plenty for any screen.
const HD_SRC = "assets/atelier/model-red-saree-4x.png"; // Real-ESRGAN ×4 of SRC — see header
const MODEL_SCALE = 4;
const LAYER_SCALE = 2;
const AI_BLEND = 0.85; // share of the AI upscale vs plain Lanczos — keeps skin natural, not "painted"

const planeOf = (w, h) => ({ raw: { width: w, height: h, channels: 1 } });
const plane = planeOf(W, H);
// blur()/resize() can return sRGB; extractChannel(0) keeps one band.
const blurPlane = (buf, sigma, p = plane) => sharp(buf, p).blur(sigma).extractChannel(0).raw().toBuffer();
/** A 1× single-channel plane resized to `scale`× with Lanczos (smooth edges). */
const upPlane = (buf, scale) => sharp(buf, plane).resize(W * scale, H * scale, { kernel: "lanczos3" }).extractChannel(0).raw().toBuffer();
const toPlane = (bits) => { const out = Buffer.alloc(N); for (let i = 0; i < N; i++) out[i] = bits[i] ? 255 : 0; return out; };

/** RGB at `scale`×: the AI master blended with a Lanczos upscale (Lanczos alone if no master). */
async function hdPixels(scale) {
  const size = { width: W * scale, height: H * scale };
  const lanczos = await sharp(data, { raw: { width: W, height: H, channels: 3 } }).resize({ ...size, kernel: "lanczos3" }).raw().toBuffer();
  if (!fs.existsSync(HD_SRC)) return lanczos;
  const ai = await sharp(HD_SRC).removeAlpha().resize({ ...size, kernel: "lanczos3" }).raw().toBuffer();
  const out = Buffer.alloc(ai.length);
  for (let i = 0; i < ai.length; i++) out[i] = Math.round(ai[i] * AI_BLEND + lanczos[i] * (1 - AI_BLEND));
  return out;
}

fs.mkdirSync(OUT, { recursive: true });

// 3a. The model, cut out of her background. Where the new fabric's feathered edge lets the photo show
//     through, the old red saree would leave a red fringe — so red-saree and zari pixels near the saree
//     are desaturated to neutral grey (reads as an edge shadow on any fabric). Saturation cut-offs keep
//     the hand (s ≈ 0.47) and the gold blouse (s ≈ 0.44) untouched.
{
  const MW = W * MODEL_SCALE, MH = H * MODEL_SCALE;
  const near = morph(mask, true, 4);
  const oldSaree = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (!near[i]) continue;
    const c = hsv(i);
    const red = (c.h < 16 || c.h > 335) && c.s > 0.55;
    const zari = c.h >= 16 && c.h <= 45 && c.v >= 0.78 && c.s >= 0.5;
    if (red || zari) oldSaree[i] = 1;
  }
  const weight = await upPlane(await blurPlane(toPlane(oldSaree), 0.8), MODEL_SCALE);
  const rgb = await hdPixels(MODEL_SCALE);
  for (let i = 0; i < MW * MH; i++) {
    const w = weight[i] / 255;
    if (!w) continue;
    const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
    const grey = 0.3 * r + 0.59 * g + 0.11 * b;
    rgb[i * 3] = Math.round(r + (grey - r) * w);
    rgb[i * 3 + 1] = Math.round(g + (grey - g) * w);
    rgb[i * 3 + 2] = Math.round(b + (grey - b) * w);
  }
  const alpha = await upPlane(await blurPlane(toPlane(person), 0.7), MODEL_SCALE);
  await sharp(rgb, { raw: { width: MW, height: MH, channels: 3 } })
    .joinChannel(alpha, planeOf(MW, MH))
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${OUT}/model-hd.webp`);
}

// 3b. Saree layers. Shading comes from the brightness (HSV value) of the red cloth: folds stay, gold
//     motifs mostly vanish because zari and lit red have similar value. Only "trusted" cloth is read —
//     eroded 1 px so the crisp edges of filled zari motifs don't ghost through — and the 90th
//     percentile maps to white.
{
  const LW = W * LAYER_SCALE, LH = H * LAYER_SCALE, LN = LW * LH, pL = planeOf(LW, LH);
  const px = await hdPixels(LAYER_SCALE);
  const value = (i) => Math.max(px[i * 3], px[i * 3 + 1], px[i * 3 + 2]) / 255;
  // Grown 1 px so the new fabric fully covers the old saree's edge.
  const maskL = await upPlane(toPlane(morph(mask, true, 1)), LAYER_SCALE);
  const clothL = await upPlane(toPlane(morph(cloth, false, 1)), LAYER_SCALE);
  const isCloth = (i) => clothL[i] >= 128;

  const values = [];
  for (let i = 0; i < LN; i++) if (isCloth(i)) values.push(value(i));
  values.sort((a, b) => a - b);
  const p90 = values[Math.floor(values.length * 0.9)];
  const p70 = values[Math.floor(values.length * 0.7)];

  // Grey and alpha are separate planes, blurred independently — blurring grey+alpha together would
  // bleed the transparent black into the grey.
  const shadeG = Buffer.alloc(LN);
  const glossA = Buffer.alloc(LN);
  const known = Buffer.alloc(LN);
  const weighted = Buffer.alloc(LN);
  for (let i = 0; i < LN; i++) {
    const v = value(i);
    shadeG[i] = Math.round(Math.min(1, 0.18 + 0.82 * (v / p90)) * 255);
    glossA[i] = isCloth(i) ? Math.round(Math.max(0, (v - p70) / (1 - p70)) ** 1.6 * 150) : 0;
    known[i] = isCloth(i) ? 255 : 0;
    weighted[i] = isCloth(i) ? shadeG[i] : 0;
  }
  // Filled zari is brighter than the cloth around it, so its shading is inpainted from neighbouring
  // cloth (normalised convolution: blur(value·known) / blur(known)) instead of read from the photo.
  const [blurW, blurK] = await Promise.all([blurPlane(weighted, 5 * LAYER_SCALE, pL), blurPlane(known, 5 * LAYER_SCALE, pL)]);
  for (let i = 0; i < LN; i++) if (!isCloth(i) && maskL[i] >= 128) shadeG[i] = blurK[i] ? Math.min(255, Math.round((blurW[i] / blurK[i]) * 255)) : 200;

  const white = Buffer.alloc(LN, 255);
  const writeLayer = (grey, alpha, file) => sharp(grey, pL).joinChannel(alpha, pL).toColourspace("b-w").png().toFile(`${OUT}/${file}`);
  // Feathered edge so the fabric blends into the photo instead of looking cut out.
  const softMask = await blurPlane(maskL, 1.2, pL);
  await writeLayer(white, softMask, "mask-hd.png");
  // A slight blur keeps the large fold shapes while hiding fine motif residue.
  await writeLayer(await blurPlane(shadeG, 1.4, pL), softMask, "shade-hd.png");
  await writeLayer(white, await blurPlane(glossA, 2.2, pL), "gloss-hd.png");
}

console.log(`model ${W}×${H} → ${W * MODEL_SCALE}×${H * MODEL_SCALE}${fs.existsSync(HD_SRC) ? " (AI master)" : " (Lanczos — no AI master)"}, figure ${((body.length / N) * 100).toFixed(1)}%, saree ${((largest.length / N) * 100).toFixed(1)}% of frame → ${OUT}`);
