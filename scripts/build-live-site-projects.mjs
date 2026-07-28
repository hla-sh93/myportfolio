/**
 * Turn captured live-site screenshots into portfolio artwork.
 *
 *   node scripts/capture-live-sites.mjs <shotsDir>
 *   node scripts/build-live-site-projects.mjs <shotsDir>
 *
 * Produces, for each project:
 *   public/images/projects/<slug>/mockup-N.webp   1600w, watermarked covers
 *   public/images/projects/<slug>/site-<key>.webp 1200w, one per site wall card
 * and refreshes src/content/project-images.json for those slugs.
 *
 * Covers reuse the two approved composers (tilted showcase, flat duo) so the
 * new work sits in the same visual language as the other thirty projects.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SHOTS = process.argv[2];
if (!SHOTS) {
  console.error("usage: node scripts/build-live-site-projects.mjs <shotsDir>");
  process.exit(1);
}

const OUT = "public/images/projects";
const TMP = path.join(SHOTS, "_masters");
const COVER_W = 1600;
const CARD_W = 1200;

/** Brand hex per composition, sampled by eye from each site's own palette. */
const PROJECTS = {
  "maritime-flag-administrations": {
    covers: [
      { style: "showcase", pages: ["zimbabwe", "nicaragua", "haiti"], brand: "#0d3b2e" },
      { style: "showcase", pages: ["chad", "zambiaadmin", "alliance"], brand: "#12395c", angle: 8 },
      { style: "duo", pages: ["nicaragua", "zambiaservices"], brand: "#1b3a5f" },
    ],
    wall: [
      "haiti", "zimbabwe", "nicaragua", "chad",
      "zambiaadmin", "zambiaservices", "alliance",
    ],
  },
  // A single-page site still needs three panels or the composition is mostly
  // empty board — so these take three different sections of the same page.
  "asset-security-systems": {
    covers: [
      { style: "showcase", pages: ["asset:1", "asset:2", "asset:3"], brand: "#0b2a4a" },
      { style: "duo", pages: ["asset:1", "asset:3"], brand: "#0b2a4a" },
    ],
  },
  "rasael-messaging-platform": {
    covers: [
      { style: "showcase", pages: ["rasael:1", "rasael:2", "rasael:3"], brand: "#0a1626" },
      { style: "duo", pages: ["rasael:1", "rasael:2"], brand: "#0a1626" },
    ],
  },
};

/** "key" or "key:n" — panel-1 is the hero, later panels are further down. */
const panel = (ref, fallback = 1) => {
  const [key, n] = String(ref).split(":");
  return path.join(SHOTS, key, `panel-${n || fallback}.png`);
};
const hero = (key) => path.join(SHOTS, key, "hero.png");

function watermark(w) {
  const fontSize = Math.max(18, Math.round(w * 0.014));
  const pad = Math.round(fontSize * 0.9);
  return Buffer.from(`<svg width="${w}" height="${fontSize * 2 + pad}">
    <text x="${w - pad}" y="${fontSize + pad / 2}" text-anchor="end"
      font-family="Arial, sans-serif" font-weight="600" font-size="${fontSize}"
      fill="rgba(255,255,255,0.55)" stroke="rgba(0,0,0,0.18)" stroke-width="0.6"
      letter-spacing="1.5">HLA SHINDEAH</text>
  </svg>`);
}

async function toWebp(src, outPath, width, { mark = true } = {}) {
  const resized = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const img = sharp(resized.data);
  if (mark) img.composite([{ input: watermark(resized.info.width), gravity: "southeast" }]);
  await img.webp({ quality: 84 }).toFile(outPath);
  const blur = await sharp(resized.data).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  return {
    url: `/${path.relative("public", outPath).split(path.sep).join("/")}`,
    width: resized.info.width,
    height: resized.info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

fs.mkdirSync(TMP, { recursive: true });
const manifestPath = "src/content/project-images.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

for (const [slug, cfg] of Object.entries(PROJECTS)) {
  const outDir = path.join(OUT, slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (const stale of fs.readdirSync(outDir).filter((f) => /\.webp$/.test(f))) {
    fs.rmSync(path.join(outDir, stale));
  }
  manifest[slug] = [];

  // ── covers ──
  cfg.covers.forEach((cover, i) => {
    const master = path.join(TMP, `${slug}-${i + 1}.png`);
    const script =
      cover.style === "duo"
        ? "scripts/compose-duo-mockup.mjs"
        : "scripts/compose-showcase-mockup.mjs";
    // duo wants two full sheets; showcase wants 1-3 top-cropped panels
    const inputs =
      cover.style === "duo"
        ? [panel(cover.pages[0], 1), panel(cover.pages[1], 2)]
        : cover.pages.map((k) => panel(k, 1));

    execFileSync("node", [script, ...inputs, master, cover.brand], {
      stdio: ["ignore", "ignore", "inherit"],
      env: { ...process.env, ...(cover.angle ? { ANGLE: String(cover.angle) } : {}) },
    });
  });

  for (let i = 0; i < cfg.covers.length; i++) {
    const master = path.join(TMP, `${slug}-${i + 1}.png`);
    const entry = await toWebp(master, path.join(outDir, `mockup-${i + 1}.webp`), COVER_W);
    manifest[slug].push(entry);
  }

  // ── site wall cards (no watermark: they are small reference thumbnails) ──
  for (const key of cfg.wall ?? []) {
    await toWebp(hero(key), path.join(outDir, `site-${key}.webp`), CARD_W, { mark: false });
  }

  console.error(`✓ ${slug}: ${cfg.covers.length} covers, ${(cfg.wall ?? []).length} wall cards`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.error("LIVE SITE BUILD DONE");
