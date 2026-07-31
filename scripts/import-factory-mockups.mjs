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
  KRSY: "krsy-web",
  Codxeon: "codxeon-website",
  "Emirates Sands": "emirates-sands",
  "Fast Express": "fast-express-shipping",
  "SAAB Logistics": "saab-logistics",
  Crenny: "crenny-app",
  "Border ports": "border-ports-app",
  "Food Delivery": "tawseel-food-delivery",
  "Living App": "living-app-ui",
  "Cadeau Boutique": "cadeau-boutique-brand",
  Solareva: "solareva-brand-identity",
  "Believe in Syria": "believe-in-syria-campaign",
  BW: "bw-company-profile",
  // أخضر — the agricultural marketplace
  Green: "akhdar-agri-app",
  // the app screens the Albroker promo animates
  "Albroker/mobile": "albroker-promo",
  // one folder, two products: the app and the website
  "LAMASAT/mobile": "lamasat-furniture-app",
  "LAMASAT/website": "lamasat-website",
  // the travel agency, boarded twice — branding set and company profile
  "Travel Tent Branding": "travel-agency-branding",
  "Travel Tent": "travel-agency-branding",
  // site and profile for the same client, one project
  "Phoenitech Website": "phoenitech-website",
  Phoenitech: "phoenitech-website",
  "Phoenitech Profile": "phoenitech-website",
};

/**
 * Folders deliberately left out, and why. Reported at the end of a run so
 * they stay visible rather than silently dropped.
 *
 * AMBIGUOUS — a project exists but attaching to it would be a guess.
 * ORPHAN — no project in the portfolio covers this work at all.
 */
const HELD = {
  "Albroker Branding":
    "ambiguous — albroker-promo is a motion project; branding boards may want their own entry",
  "Zanqa App":
    "ambiguous — could be zanqa-education-platform (the product) or zanqa-app-promo (the video)",
  "JCI Gala":
    "ambiguous — same client as believe-in-syria-campaign, but a different event",
};

const IMAGE = /\.(png|jpe?g|webp)$/i;

/** "03-mob-trio-drop.png" → "03-mob-trio-drop" */
const slugify = (fileName) =>
  fileName
    .replace(IMAGE, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
      const parts = rel.split(/[\\/]/);
      const type = parts.slice(1, 2)[0] ?? "shot";
      /* The destination name is derived from the source path, never from a
         running counter. A counter looked tidier but made the import
         non-idempotent: two folders feed some projects, so a second run
         assigned different numbers to the same sources, wrote a second copy
         of two files under the new names, and appended media rows whose ids
         collided with the first run's. Same source in, same file out. */
      const name = `factory-${type}-${slugify(parts[parts.length - 1])}.webp`;
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
            // derived from the file name for the same reason it is
            id: `${slug}-${name.replace(/\.webp$/, "")}`,
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

  const leftOver = [...new Set(skipped.map((s) => s.split(/[\\/]/)[0]))].sort();
  const held = leftOver.filter((f) => HELD[f]);
  const orphans = leftOver.filter((f) => !HELD[f]);
  const count = (f) => skipped.filter((s) => s.startsWith(f)).length;

  if (held.length) {
    console.log(`\nheld back — needs a decision (${held.length}):`);
    for (const f of held) console.log(`  ${f} (${count(f)}) — ${HELD[f]}`);
  }
  if (orphans.length) {
    console.log(`\nno project covers these (${orphans.length}):`);
    for (const f of orphans) console.log(`  ${f} (${count(f)} images)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
