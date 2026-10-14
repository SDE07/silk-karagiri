# Home — "Saree Atelier" collections section

Replaces the home-page About block (`SilkKaragiriBanner` + "Read Our Story") with an interactive
showcase of the real Silk Karagiri collections.

## Goal

A visitor picks a collection from a slider, and the centre stage "changes look" to that saree, with
its name, story and weave details animating in around it — the browsing feel of a boutique try-on
screen (reference 1) laid out as a centre portrait flanked by feature notes (reference 2).

## Source photos → organised assets

The client supplied 11 WhatsApp-exported folders, kept in `assets/all sarries/` (outside public/) (~130 photos,
2 videos, 33 MB). They are converted once by `scripts/build-collections.mjs`:

| # | Folder (as supplied)                              | Collection name used on site                 | Slug                          |
|---|---------------------------------------------------|----------------------------------------------|-------------------------------|
| 1 | double wrap soft silk saree-1                     | Double Warp Soft Silk Saree                  | `double-warp-soft-silk`       |
| 2 | Pure handloom Double warp soft silk saree-2       | Pure Handloom Double Warp Soft Silk          | `pure-handloom-double-warp`   |
| 3 | Pure handloom Doubl -3                            | Pure Handloom Double Warp — Gaja Butta       | `double-warp-gaja-butta`      |
| 4 | PURE HANDLOOM SOFT  SILK SARE-4                   | Pure Handloom Soft Silk Saree                | `pure-handloom-soft-silk`     |
| 5 | RANGOLI FRESH COLLECTIONS-5                       | Rangoli Fresh Collection                     | `rangoli-fresh`               |
| 6 | EXCLUSIVE  SMALL BHUTTA  SOFT silk-6              | Exclusive Small Bhutta Soft Silk             | `small-bhutta-soft-silk`      |
| 7 | handloom exclusive  bridal collection for soft-7  | Handloom Exclusive Bridal Soft Silk          | `bridal-soft-silk`            |
| 8 | Pure Handloom Border 7                            | Pure Handloom Border Silk                    | `pure-handloom-border`        |
| 9 | KANCHIPURAM PURE HANDLOOM SOF-8                   | Kanchipuram Pure Handloom Soft Silk          | `kanchipuram-soft-silk`       |
| 10| Banaras Khaddi Chiffon-9                          | Banaras Khaddi Chiffon                       | `banaras-khaddi-chiffon`      |
| 11| Banaras Kora Organza-10                           | Banaras Kora Organza                         | `banaras-kora-organza`        |

Output: `public/images/collections/<slug>/01.webp, 02.webp …` (+ `video-1.mp4` where supplied).

Rules applied by the script:
- Resize to max 1200 px on the long edge, WebP q≈76 (next/image then serves right-sized variants).
- Skip photos under 700 px wide (several Kora Organza shots are 360 px and would blur on the stage).
- Skip byte-identical duplicates.
- Names are the folder names, cleaned up ("wrap" → "warp", truncations completed). No prices are
  invented — the CTA is "Enquire on WhatsApp" with the collection name pre-filled.

## The model stage — virtual drape

One fixed model; when a saree is picked only her saree changes. Built by
`scripts/build-tryon.mjs` from `assets/atelier/model-red-saree.png` (a model in a solid red saree):

| Layer (`public/images/atelier/`) | Blend     | Purpose                                              |
|----------------------------------|-----------|------------------------------------------------------|
| `model-hd.webp`                  | normal    | the model (4× AI master), cut out of her background  |
| fabric swatch (`NN-drape.webp`)  | CSS mask `mask-hd.png` | the selected saree, clipped to the saree area |
| `shade-hd.png`                   | multiply  | original folds & shadows, so the new fabric drapes   |
| `gloss-hd.png`                   | screen    | silk highlights                                      |

Mask: saturated-red colour match → largest region → morphological close → absorb zari motifs
(small, saturated gold regions touching the saree) while leaving skin, blouse and background alone
(thresholds measured from the photo, documented in the script). Shading under filled zari is
inpainted from the surrounding cloth so motifs don't ghost through.

Swatches (`NN-drape.webp`) are a centre crop of each photo at the model's aspect, made by
`build-collections.mjs`. Where the centre would catch a contrast border or the table (Kanchipuram),
`SWATCH_PATCH` names a clean patch of the body instead; its creases are divided out and it is tiled.
Rebuild one collection with `node scripts/build-collections.mjs <slug>`. Photos with price tags, gift boxes or people in the centre are listed in
`noDrape` per collection and never worn.

The drape is a visualisation, so the stage has an **On model / Actual photo** toggle and a one-line
caption pointing to the real photo for exact colour.

To change the model: replace the source photo, adjust `isSaree` (and the measured thresholds) in
`build-tryon.mjs`, rerun it. A model in a solid, saturated saree on a contrasting background works best.

## 360° / side and back views

The stage uses one front photo of the model, so it can only sway ±12° convincingly (a full spin
flattens and mirrors her). A true 360° needs a photo sequence of the same model from fixed angles:

- 8–24 shots on a turntable at equal steps (e.g. every 15°–45°), including side and back views
- same pose, lighting, distance and framing in every shot
- ideally the model in a solid, saturated saree (as now), so each frame can be masked for the
  virtual drape by `build-tryon.mjs`

With those, the stage can become a drag-to-rotate viewer that steps through the frames.

## Layout

```
                 ── THE SAREE ATELIER ──
                   Choose Your  Drape

 ┌ COLLECTIONS  01 of 11 ˄˅ ┐    ╭──────────╮     01 ── 11   BRIDAL
 │▌◉ Double Warp Soft…   01 │    │  model   │     Collection name (serif)
 │  Glassy two-tone sheen…  │  ‹ │  (arch)  │ ›   tagline (italic)
 │ ◉ Pure Handloom…      02 │    │          │     story
 │  Sculpted borders…       │    ╰──────────╯     ───────────
 │ ◉ …  (inbox, scrolls)    │   [On model|Actual]  FABRIC / MOTIF / BORDER
 └──────────────────────────┘                     [Enquire on WhatsApp] Shop →
                                                  Change look ▢▢▢▢▢▢ (grid, all looks)
```

- Left: an email-inbox style list — avatar (cover), bold name, grey one-line tagline, number /
  video marker where the date would be; accent bar + gold autoplay progress on the active row.
- Centre: the model (background removed) on a warm studio backdrop inside a temple-arch frame.
- Right: name, tagline, story, the three weave notes in one row, "Change look" (a compact strip of
  every wearable shade), then the WhatsApp / Shop actions — sized to sit level with the model.
- Mobile order: model → view toggle → details & looks → collections list.
- Sharpness: the model photo is AI-upscaled 4× with Real-ESRGAN (`assets/atelier/model-red-saree-4x.png`,
  2132 × 3288; command in the header of `build-tryon.mjs`) and blended 85/15 with a plain upscale so
  skin stays natural. Mask/fold/gloss layers are 2×. Layers are served at quality 90
  (`images.qualities` in next.config.ts). Drape swatches are 900 × 1388 from the original photos with
  an unsharp mask — an AI upscale of the fabric was tested and rejected because it invents thread
  detail that isn't in the real weave.
- Old-saree fringe: red/zari pixels near the saree are desaturated in the model photo and the fabric
  mask is grown 1 px, so no red edge shows under light fabrics.

## Interaction & motion

- Selecting a collection: stage does a "drape reveal" (clip-path unroll from the top + slight
  scale settle); text and notes stagger in; slider scrolls the active card into view.
- Changing saree: the model never moves; the new fabric unrolls from the shoulder down with a
  zari-gold light along the reveal edge (slower for a new collection, quicker for a new shade).
- Shades auto-advance every 4 s with a gold progress ring on the active thumb; any click,
  hover over the stage, or keyboard focus pauses it. Off-screen → paused (IntersectionObserver).
- "Watch video" pill appears only on collections with a video; plays inline in the stage.
- "On model / Actual photo" choice is kept when the look or collection changes, and remembered
  across visits (localStorage, read via useSyncExternalStore so SSR stays consistent).
- Keyboard: ↑ / ↓ change collection when the list has focus. `prefers-reduced-motion`: no
  autoplay, fades only.

## Files

- `scripts/build-collections.mjs` — one-off asset pipeline (re-runnable).
- `src/data/collections.data.ts` — collection names, copy, image counts, cover/model/video.
- `scripts/build-tryon.mjs` — model layers for the virtual drape.
- `src/components/home/DrapeStage.tsx` — the layered model stage.
- `src/components/home/SareeAtelierSection.tsx` — the section.
- `app/page.tsx` — swap the old About block for `<SareeAtelierSection />`.
