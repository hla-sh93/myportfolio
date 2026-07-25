// Staggered-scatter presentation mockup (like ref c2a37508) built from REAL profile pages — pixel-exact.
// Usage: node scripts/profile-scatter.mjs <out.png> <bg-tint-hex> <page1> <page2> <page3> <page4> <page5>
import sharp from 'sharp';

const [outPath, tint, ...pages] = process.argv.slice(2);
if (pages.length < 3) { console.error('need >=3 pages'); process.exit(1); }

const W = 2800, H = 2100;
const cardW = 980, cardH = Math.round(cardW * 9 / 16); // 16:9 cards
const shadow = 40;

// staggered diagonal grid like the reference (straight cards, offset rows)
const positions = [
  { x: 760,  y: 90 },   // top center-left
  { x: 1900, y: 330 },  // top right
  { x: 420,  y: 780 },  // mid left  (cover — most prominent, slightly bigger)
  { x: 1560, y: 1020 }, // mid right
  { x: -180, y: 1470 }, // bottom left (bleeds off edge like ref)
  { x: 960,  y: 1710 }, // bottom center (bleeds bottom)
];

const bg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H}" fill="${tint}"/>
</svg>`;

async function card(p, w, h) {
  const img = await sharp(p).resize(w, h, { fit: 'fill' }).toBuffer();
  // rounded corners + drop shadow baked into an extended canvas
  const r = 18;
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`);
  const rounded = await sharp(img).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const sh = Buffer.from(`<svg width="${w + shadow*2}" height="${h + shadow*2}">
    <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
    <rect x="${shadow}" y="${shadow+10}" width="${w}" height="${h}" rx="${r}" fill="#0b1e33" fill-opacity="0.35" filter="url(#b)"/>
  </svg>`);
  return sharp({ create: { width: w + shadow*2, height: h + shadow*2, channels: 4, background: { r:0,g:0,b:0,alpha:0 } } })
    .composite([{ input: sh, left: 0, top: 0 }, { input: rounded, left: shadow, top: shadow }])
    .png().toBuffer();
}

const comps = [];
for (let i = 0; i < Math.min(pages.length, positions.length); i++) {
  const big = (i === 2); // cover slot
  const w = big ? Math.round(cardW * 1.06) : cardW;
  const h = Math.round(w * 9 / 16);
  const buf = await card(pages[i], w, h);
  comps.push({ input: buf, left: positions[i].x - shadow, top: positions[i].y - shadow });
}

await sharp(Buffer.from(bg)).composite(comps).png().toFile(outPath);
console.log('WROTE', outPath, W + 'x' + H);
