/**
 * Branded blog covers — studio look (dark base, blueprint grid, category
 * accent glow, Latin display type). 1600×900 webp + blur, written to
 * public/images/blog/<slug>.webp. Latin text only (no AI, no Arabic garble).
 *
 * Usage: node scripts/article-covers.mjs '<json array of {slug,title,cat}>'
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const CAT = {
  uiux: { tint: "#E14A6D", label: "UI / UX" },
  frontend: { tint: "#60A5FA", label: "FRONT-END" },
  graphic: { tint: "#F59E0B", label: "GRAPHIC DESIGN" },
  product: { tint: "#8B5CF6", label: "PRODUCT DESIGN" },
};

const W = 1600, H = 900;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(title, max = 26) {
  const words = title.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

async function cover({ slug, title, cat }) {
  const c = CAT[cat];
  const lines = wrap(title);
  const fs1 = lines.length >= 3 ? 84 : 96;
  const lineH = fs1 * 1.16;
  const startY = H / 2 + 30 - ((lines.length - 1) * lineH) / 2;

  const grid = [];
  for (let x = 0; x <= W; x += 80) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ffffff" stroke-opacity="0.045" />`);
  for (let y = 0; y <= H; y += 80) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity="0.045" />`);

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="18%" cy="110%" r="90%">
      <stop offset="0%" stop-color="${c.tint}" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#B91942" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#070607" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="90%" cy="-10%" r="70%">
      <stop offset="0%" stop-color="${c.tint}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#070607" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#070607"/>
  ${grid.join("")}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <text x="110" y="150" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="10" fill="${c.tint}">${esc(c.label)}</text>
  <rect x="110" y="176" width="72" height="5" rx="2.5" fill="${c.tint}"/>
  ${lines
    .map(
      (l, i) =>
        `<text x="108" y="${startY + i * lineH}" font-family="Arial, Helvetica, sans-serif" font-size="${fs1}" font-weight="900" fill="#F5F5F7">${esc(l)}</text>`
    )
    .join("")}
  <text x="110" y="${H - 70}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" letter-spacing="6" fill="#98989D">HLA SHINDEAH — BLOG · 2026</text>
</svg>`;

  const outDir = "public/images/blog";
  fs.mkdirSync(outDir, { recursive: true });
  const buf = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
  await sharp(buf).toFile(path.join(outDir, `${slug}.webp`));
  console.error(`cover ok: ${slug}`);
}

const items = JSON.parse(process.argv[2] ?? fs.readFileSync("scripts/_covers.json", "utf8"));
for (const item of items) await cover(item);
console.error("COVERS DONE");
