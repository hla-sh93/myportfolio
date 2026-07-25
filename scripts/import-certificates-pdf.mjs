/**
 * Certificates pipeline v2 — PDF-aware.
 * Reads Coursera PDFs from "my portfolio/09 - Certificates/", renders page 1
 * to webp (1200w + blur), extracts title/partner/date from the PDF text,
 * categorizes by topic, and writes src/content/certificates.json.
 *
 * Usage: node scripts/import-certificates-pdf.mjs
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "my portfolio/09 - Certificates";
const OUT = "public/images/certificates";
const MANIFEST = "src/content/certificates.json";
const WIDTH = 1200;

/* Manual fixes for multi-course certificates whose layout confuses parsing */
const OVERRIDES = {
  MK93A2J35ZL6: {
    title: "Meta Social Media Marketing — Professional Certificate",
    partner: "Meta",
    date: "Feb 2024",
  },
  WZZE4KB6ZN8F: {
    title: "UI / UX Design — Specialization",
    partner: "California Institute of the Arts",
    date: "2024",
  },
};

/* Topic keywords → category (checked in order) */
const CATEGORIES = [
  { key: "uiux", match: /UX|UI|User Experience|Design/i },
  { key: "frontend", match: /React|JavaScript|HTML|CSS|Front-End|Version Control|Programming/i },
  { key: "marketing", match: /SEO|Google Search|Marketing|Social Media/i },
  { key: "growth", match: /./ }, // everything else: languages, learning, data literacy
];

function extract(lines, id) {
  if (OVERRIDES[id]) return OVERRIDES[id];
  const nameIdx = lines.findIndex((l) => /Hla Shindeah/i.test(l));
  const endIdx = lines.findIndex((l) => /an online (course|specialization)/i.test(l));
  const title = lines
    .slice(nameIdx + 1, endIdx > 0 ? endIdx : nameIdx + 3)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const partner = (lines.find((l) => /authorized by/i.test(l)) || "")
    .replace(/an online .*? authorized by /i, "")
    .replace(/ and offered through.*/i, "")
    .trim();
  const date = (lines[0] || "").replace(/\s+/g, " ").replace(/(\w) (\w{2,})/g, "$1$2").trim();
  return { title, partner, date };
}

fs.mkdirSync(OUT, { recursive: true });
const entries = [];
const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".pdf")).sort();

for (const file of files) {
  const id = file.replace(/^Coursera\s+/i, "").replace(/\.pdf$/i, "");
  const doc = mupdf.Document.openDocument(
    fs.readFileSync(path.join(SRC, file)),
    "application/pdf"
  );
  const page = doc.loadPage(0);
  const lines = JSON.parse(page.toStructuredText().asJSON()).blocks.flatMap(
    (b) => b.lines.map((l) => l.text)
  );
  const meta = extract(lines, id);
  const category =
    CATEGORIES.find((c) => c.match.test(meta.title))?.key ?? "growth";

  // Render at 2.2x (~1585px wide for A4-landscape) then downscale to 1200
  const pixmap = page.toPixmap(mupdf.Matrix.scale(2.2, 2.2), mupdf.ColorSpace.DeviceRGB, false);
  const png = Buffer.from(pixmap.asPNG());
  const resized = await sharp(png)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const outName = `${id.toLowerCase()}.webp`;
  await sharp(resized.data).webp({ quality: 88 }).toFile(path.join(OUT, outName));
  const blur = await sharp(resized.data).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();

  entries.push({
    url: `/images/certificates/${outName}`,
    width: resized.info.width,
    height: resized.info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    title: meta.title,
    issuer: meta.partner ? `${meta.partner} · Coursera` : "Coursera",
    date: meta.date,
    category,
  });
  console.error(`ok [${category}] ${meta.title}`);
}

/* Order: UI/UX → Front-End → Marketing → Growth (site narrative order) */
const order = { uiux: 0, frontend: 1, marketing: 2, growth: 3 };
entries.sort((a, b) => order[a.category] - order[b.category] || a.title.localeCompare(b.title));

fs.writeFileSync(MANIFEST, JSON.stringify(entries, null, 1));
console.error(`DONE — ${entries.length} certificates`);
