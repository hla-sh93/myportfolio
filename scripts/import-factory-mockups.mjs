/**
 * Imports the mockup factory renders into the site.
 *
 * Source: C:/Users/hla2-/Videos/mockup factory/out/<Project>/<type>/NN-*.png
 * Each PNG is 3–8 MB, so they are re-encoded to WebP at the same settings the
 * admin uploader uses (long edge 2400, quality 82) before landing in
 * public/images/projects/<slug>/.
 *
 * Files are named factory-<type>-NN.webp so they are easy to tell apart from
 * the older mockups when filtering later, and they are APPENDED to each
 * project's gallery — nothing existing is replaced, and coverImage is left
 * alone.
 *
 * Usage: node scripts/import-factory-mockups.mjs [--dry]
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/hla2-/Videos/mockup factory/out";
const PUBLIC = "public/images/projects";
const DATA = "data/projects.json";
const DRY = process.argv.includes("--dry");

const MAX_EDGE = 2400;
const QUALITY = 82;

/** folder (or "folder/subfolder" when one folder feeds two projects) → slug */
const MAP = {
  "Jadarat Platform": "jadarat-platform",
  "Turki Butchery": "turki-butchery",
  Kafoo: "kafoo-web",
  Menu: "menu-web",
  BigBoss: "bigboss-web",
  "Emirates Sands": "emirates-sands",
  "Fast Express": "fast-express-shipping",
  Crenny: "crenny-app",
  "Border ports": "border-ports-app",
  "Food Delivery": "tawseel-food-delivery",
  "Cadeau Boutique": "cadeau-boutique-brand",
  BW: "bw-company-profile",
  // أخضر — the agricultural marketplace
  Green: "akhdar-agri-app",
  // one folder, two products: the app and the website
  "LAMASAT/mobile": "lamasat-furniture-app",
  "LAMASAT/website": "lamasat-website",
  // three Phoenitech folders, one existing project
  "Phoenitech Website": "phoenitech-website",
  Phoenitech: "phoenitech-website",
  "Phoenitech Profile": "phoenitech-website",
};

/** Folders with no project to attach to — reported, not imported. */
const UNMATCHED = [
  "Capriani",
  "Casa Kai",
  "Gini - Qatar Chamber",
  "IFAIF",
  "Sari",
  "SmartKids Montessori",
  "WASL FX",
];

const IMAGE = /\.(png|jpe?g|webp)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (IMAGE.test(entry.name)) out.push(full);
  }
  return out;
}

/** Which map key covers this file: the folder/subfolder pair, or the folder. */
function slugFor(relative) {
  const [folder, sub] = relative.split(/[\\/]/);
  return MAP[`${folder}/${sub}`] ?? MAP[folder] ?? null;
}

async function main() {
  const projects = JSON.parse(await fs.readFile(DATA, "utf8"));
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

  const files = await walk(SRC);
  const grouped = new Map();
  const skipped = [];

  for (const file of files) {
    const rel = path.relative(SRC, file);
    const slug = slugFor(rel);
    if (!slug) {
      skipped.push(rel);
      continue;
    }
    if (!bySlug[slug]) {
      console.log(`  ! no project for slug ${slug} (${rel})`);
      continue;
    }
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug).push({ file, rel });
  }

  let converted = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const [slug, items] of grouped) {
    const project = bySlug[slug];
    const dir = path.join(PUBLIC, slug);
    if (!DRY) await fs.mkdir(dir, { recursive: true });

    // stable order: folder, then the NN- prefix the factory already applies
    items.sort((a, b) => a.rel.localeCompare(b.rel));

    let index = 1;
    for (const { file, rel } of items) {
      const type = rel.split(/[\\/]/).slice(1, 2)[0] ?? "shot";
      const name = `factory-${type}-${String(index).padStart(2, "0")}.webp`;
      const dest = path.join(dir, name);
      const url = `/images/projects/${slug}/${name}`;

      const input = await fs.readFile(file);
      bytesIn += input.byteLength;

      const output = await sharp(input)
        .rotate()
        .resize({
          width: MAX_EDGE,
          height: MAX_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, effort: 5 })
        .toBuffer();
      bytesOut += output.byteLength;

      const meta = await sharp(output).metadata();

      if (!DRY) {
        await fs.writeFile(dest, output);

        // append only — an existing entry for this url is refreshed in place
        const existing = project.media.find((m) => m.url === url);
        if (existing) {
          existing.width = meta.width ?? existing.width;
          existing.height = meta.height ?? existing.height;
        } else {
          project.media.push({
            id: `${slug}-f${index}`,
            url,
            type: "IMAGE",
            altEn: `${project.titleEn} — mockup ${index}`,
            altAr: `${project.titleAr} — نموذج ${index}`,
            order: project.media.length,
            width: meta.width ?? 2400,
            height: meta.height ?? 1800,
          });
        }
      }

      converted++;
      index++;
    }

    console.log(`  ${slug.padEnd(26)} +${items.length}`);
  }

  if (!DRY) await fs.writeFile(DATA, JSON.stringify(projects, null, 1));

  const mb = (n) => (n / 1048576).toFixed(1);
  console.log(`\n${DRY ? "[dry run] " : ""}converted ${converted} images`);
  console.log(
    `size ${mb(bytesIn)} MB → ${mb(bytesOut)} MB  (−${Math.round(
      (1 - bytesOut / bytesIn) * 100
    )}%)`
  );

  const unmatchedFound = [...new Set(skipped.map((s) => s.split(/[\\/]/)[0]))];
  if (unmatchedFound.length) {
    console.log(`\nno matching project (${unmatchedFound.length} folders):`);
    for (const f of unmatchedFound) {
      const n = skipped.filter((s) => s.startsWith(f)).length;
      console.log(`  ${f} (${n} images)`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
