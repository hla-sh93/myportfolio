/**
 * Landscape 2800×2100 brand-board masters (site covers crop landscape).
 * Same approved hybrid method as brand-board.mjs / board-cadeau.mjs:
 * REAL artwork composited pixel-exact + exact palette; AI used only for
 * environmental scenes that wrap the real designs.
 *
 * Usage: node scripts/board-landscape.mjs [cadeau|solareva]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const W = 2800, H = 2100, M = 70, G = 36;

async function cover(p, w, h, r, pos = "centre") {
  const img = await sharp(p).resize(w, h, { fit: "cover", position: pos }).toBuffer();
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`);
  return sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}
const contain = (p, w, h) =>
  sharp(p).resize(w, h, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

const BRANDS = {
  cadeau: {
    out: "my portfolio/08 - Mockups/Cadeau Boutique/mockup-1.png",
    bg: "#e9e2d8",
    heroFill: "#3B3A38",
    name: "Cadeau Boutique",
    nameFill: "#C6A15B",
    tag: "EXPRESS HOW YOU FEEL",
    tagFill: "#ffffff",
    font: "Georgia,serif",
    logo: "scripts/_cadeau_logo.png",
    logoCard: "#ffffff",
    swatches: [
      ["#3B3A38", "#fff"], ["#C6A15B", "#fff"], ["#8A6E5E", "#fff"],
      ["#EFE7DC", "#3B3A38"], ["#FFFFFF", "#3B3A38"],
    ],
    photos: [
      "my portfolio/02 - Branding & Identity/Cadeau Boutique/business-cards.jpg",
      "my portfolio/02 - Branding & Identity/Cadeau Boutique/letterhead.jpg",
      "my portfolio/02 - Branding & Identity/Cadeau Boutique/hang-tags-1.jpg",
      "my portfolio/02 - Branding & Identity/Cadeau Boutique/hang-tags-3.jpg",
    ],
  },
  solareva: {
    out: "my portfolio/08 - Mockups/Solareva/mockup-1.png",
    bg: "#151515",
    heroFill: "#1F1F1F",
    heroStroke: "#333",
    name: "SolaReva",
    nameFill: "#FF6A00",
    tag: "BOUNDLESS IMPACT",
    tagFill: "#ffffff",
    font: "Arial,Helvetica,sans-serif",
    logo: "my portfolio/02 - Branding & Identity/Solareva/full logo.png",
    logoCard: "#ffffff",
    swatches: [
      ["#1F1F1F", "#fff", "#444"], ["#E31E24", "#fff"], ["#FF6A00", "#fff"],
      ["#FFC107", "#1F1F1F"], ["#FFFFFF", "#1F1F1F"],
    ],
    photos: [
      "scripts/_van.png",
      "scripts/_shop.png",
      "scripts/_lap.png",
      "my portfolio/08 - Mockups/Solareva/mockup-2.png",
    ],
  },
};

async function build(key) {
  const B = BRANDS[key];
  // fallback: cards master may not be archived yet
  B.photos = B.photos.map((p) =>
    fs.existsSync(p) ? p : p.replace("/_archive/", "/")
  );
  for (const p of [...B.photos, B.logo]) if (!fs.existsSync(p)) throw new Error("missing " + p);

  const leftW = 900;                       // hero column
  const rightX = M + leftW + G;
  const rightW = W - rightX - M;           // photo grid
  const cellW = Math.round((rightW - G) / 2);
  const swH = 140;
  const heroH = H - M * 2 - swH - G;
  const cellH = Math.round((H - M * 2 - G) / 2);

  const swW = (leftW - 4 * 16) / 5;
  const swSvg = B.swatches
    .map((s, i) => {
      const x = M + i * (swW + 16);
      const y = H - M - swH;
      return `<rect x="${x}" y="${y}" width="${swW}" height="${swH}" rx="14" fill="${s[0]}" ${s[2] || ["#EFE7DC", "#FFFFFF"].includes(s[0]) ? `stroke="${s[2] ?? "#ccc"}" stroke-width="2"` : ""}/>
        <text x="${x + swW / 2}" y="${y + swH - 18}" font-family="${B.font}" font-size="20" font-weight="bold" fill="${s[1]}" text-anchor="middle">${s[0]}</text>`;
    })
    .join("");

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${B.bg}"/>
    <rect x="${M}" y="${M}" width="${leftW}" height="${heroH}" rx="28" fill="${B.heroFill}" ${B.heroStroke ? `stroke="${B.heroStroke}" stroke-width="2"` : ""}/>
    <rect x="${M + 60}" y="${M + 80}" width="${leftW - 120}" height="440" rx="20" fill="${B.logoCard}"/>
    <text x="${M + leftW / 2}" y="${M + 660}" font-family="${B.font}" font-size="64" fill="${B.nameFill}" text-anchor="middle">${B.name}</text>
    <text x="${M + leftW / 2}" y="${M + 730}" font-family="${B.font}" font-size="30" letter-spacing="6" fill="${B.tagFill}" text-anchor="middle">${B.tag}</text>
    ${swSvg}
  </svg>`;

  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const logo = await contain(B.logo, leftW - 220, 360);
  const lm = await sharp(logo).metadata();

  const comps = [
    {
      input: logo,
      left: Math.round(M + 60 + (leftW - 120 - lm.width) / 2),
      top: Math.round(M + 80 + (440 - lm.height) / 2),
    },
  ];
  const pos = [
    [rightX, M], [rightX + cellW + G, M],
    [rightX, M + cellH + G], [rightX + cellW + G, M + cellH + G],
  ];
  for (let i = 0; i < 4; i++) {
    comps.push({ input: await cover(B.photos[i], cellW, cellH, 24), left: pos[i][0], top: pos[i][1] });
  }

  fs.mkdirSync(path.dirname(B.out), { recursive: true });
  await sharp(base).composite(comps).png().toFile(B.out);
  console.log("WROTE", B.out);
}

const only = process.argv[2];
for (const key of Object.keys(BRANDS)) {
  if (only && key !== only) continue;
  await build(key);
}
console.log("DONE");
