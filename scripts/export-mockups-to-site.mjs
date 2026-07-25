/**
 * Export "08 - Mockups" masters (2800×2100 Dribbble size) to the site:
 *   public/images/projects/<site-slug>/mockup-N.webp @1600w + watermark,
 * ordered [showcase, duo, fullpage], and refresh src/content/project-images.json
 * (dimensions + blur placeholders) for those slugs.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "my portfolio/08 - Mockups";
const OUT = "public/images/projects";
const WIDTH = 1600;
const ORDER = ["showcase.png", "duo.png", "duo-2.png", "showcase-2.png"]; // first 3 that exist

/* master folder -> site slug (matches src/content/projects.ts).
   String value = web project using the default ORDER file names;
   object value = explicit ordered file list (mobile trios, brand boards). */
const MOBILE = ["mockup-1.png", "mockup-2.png", "mockup-3.png"];
const SLUGS = {
  "Jadarat Platform": "jadarat-platform",
  "SAAB Logistics": "saab-logistics",
  "Turki Butchery": "turki-butchery",
  "Kafoo": "kafoo-web",
  "Menu": "menu-web",
  "BigBoss": "bigboss-web",
  "Phoenitech Website": "phoenitech-website",
  "Emirates Sands": "emirates-sands",
  "Fast Express": "fast-express-shipping",
  "LAMASAT": "lamasat-website",
  "E-Liefer": "e-liefer-delivery-platform",
  "Crenny": { slug: "crenny-app", files: MOBILE },
  "Border Ports": { slug: "border-ports-app", files: MOBILE },
  "Green": { slug: "akhdar-agri-app", files: MOBILE },
  "Food Delivery": { slug: "tawseel-food-delivery", files: MOBILE },
  "LAMASAT App": { slug: "lamasat-furniture-app", files: MOBILE },
  "BW Profile": { slug: "bw-company-profile", files: ["mockup-1.png", "mockup-2.png"] },
  "Solareva": { slug: "solareva-brand-identity", files: ["mockup-1.png", "mockup-2.png"] },
  "Cadeau Boutique": { slug: "cadeau-boutique-brand", files: ["mockup-1.png"] },
};

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

const manifest = JSON.parse(
  fs.readFileSync("src/content/project-images.json", "utf8")
);

for (const [proj, cfg] of Object.entries(SLUGS)) {
  const slug = typeof cfg === "string" ? cfg : cfg.slug;
  const wanted = typeof cfg === "string" ? ORDER : cfg.files;
  const dir = path.join(SRC, proj);
  if (!fs.existsSync(dir)) {
    console.error(`missing masters: ${proj}`);
    continue;
  }
  const files = wanted.filter((f) => fs.existsSync(path.join(dir, f)));
  if (files.length === 0) continue;

  const outDir = path.join(OUT, slug);
  fs.mkdirSync(outDir, { recursive: true });
  // clear stale mockup-N files so counts stay in sync
  for (const old of fs.readdirSync(outDir).filter((f) => /^mockup-\d\.webp$/.test(f))) {
    fs.rmSync(path.join(outDir, old));
  }

  manifest[slug] = [];
  for (let i = 0; i < files.length; i++) {
    const outName = `mockup-${i + 1}.webp`;
    const resized = await sharp(path.join(dir, files[i]))
      .resize({ width: WIDTH, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });
    await sharp(resized.data)
      .composite([{ input: watermark(resized.info.width), gravity: "southeast" }])
      .webp({ quality: 84 })
      .toFile(path.join(outDir, outName));
    const blur = await sharp(resized.data)
      .resize({ width: 16 })
      .webp({ quality: 40 })
      .toBuffer();
    manifest[slug].push({
      url: `/images/projects/${slug}/${outName}`,
      width: resized.info.width,
      height: resized.info.height,
      blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    });
  }
  console.error(`✓ ${slug}: ${files.length}`);
}

fs.writeFileSync(
  "src/content/project-images.json",
  JSON.stringify(manifest, null, 1)
);
console.error("SITE EXPORT DONE");
