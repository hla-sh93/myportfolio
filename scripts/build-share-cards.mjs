/**
 * Build the 1200×630 share cards that social platforms actually render.
 *
 *   node scripts/build-share-cards.mjs
 *
 * Every project and article already has real cover artwork, but it is 4:3
 * (projects) or 16:9 (articles) while Open Graph is 1.91:1 — so handing the
 * cover straight to Facebook/LinkedIn/WhatsApp means a blind centre crop that
 * slices ~30% off a mockup board. These cards letterbox the full artwork onto
 * the brand's dark ground instead, so the work arrives intact and the card
 * still reads as hers.
 *
 * Output: public/images/share/<slug>.jpg  (JPEG — the one format every
 * platform decodes without argument).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const PAD = 54;
const OUT_DIR = "public/images/share";

/** The closing-banner ground, so the card sits in the same world as the site. */
const GROUND = { r: 0x12, g: 0x04, b: 0x09 };
const ACCENT = "#B91942";

fs.mkdirSync(OUT_DIR, { recursive: true });

const projects = JSON.parse(fs.readFileSync("data/projects.json", "utf8")).filter((p) => p.published);
const articles = JSON.parse(fs.readFileSync("data/articles.json", "utf8")).filter((a) => a.published);

/** Wine glow + hairline frame, drawn once and reused. */
const backdrop = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${ACCENT}"/>
</svg>`);

async function card(srcPath, outName) {
  const src = path.join("public", srcPath);
  if (!fs.existsSync(src)) return { outName, skipped: "missing source" };

  // `contain` keeps the whole board visible; the ground fills the letterbox.
  const art = await sharp(src)
    .resize(W - PAD * 2, H - PAD * 2, { fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  const out = path.join(OUT_DIR, `${outName}.jpg`);
  await sharp({
    create: { width: W, height: H, channels: 3, background: GROUND },
  })
    .composite([
      { input: backdrop, top: 0, left: 0 },
      {
        input: art.data,
        top: Math.round((H - art.info.height) / 2),
        left: Math.round((W - art.info.width) / 2),
      },
    ])
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(out);

  const { size } = fs.statSync(out);
  return { outName, w: art.info.width, h: art.info.height, kb: Math.round(size / 1024) };
}

const manifest = [];
let made = 0;
let bytes = 0;
for (const [items, prefix] of [
  [projects, "project"],
  [articles, "article"],
]) {
  for (const item of items) {
    const r = await card(item.coverImage, `${prefix}-${item.slug}`);
    if (r.skipped) {
      console.error(`skip ${r.outName}: ${r.skipped}`);
      continue;
    }
    made++;
    bytes += r.kb;
    manifest.push(`${prefix}-${item.slug}`);
  }
}
// The metadata layer reads this instead of touching the filesystem at request
// time, so a slug added in the admin before its card is built falls back to
// the generated card rather than pointing at a 404.
fs.writeFileSync(
  "src/content/share-cards.json",
  JSON.stringify(manifest.sort(), null, 2)
);
console.error(`\n${made} share cards → ${OUT_DIR} (${Math.round(bytes / 1024)} MB total)`);
