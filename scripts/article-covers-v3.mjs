/**
 * Covers v3 — real, attractive imagery: each article's cover is composed
 * from HER actual project work (mockups/boards/posters), cinematic dark
 * grade + category accent. Real work → real credibility.
 * Output: public/images/blog/<slug>.webp (1600×900).
 */
import sharp from "sharp";
import fs from "node:fs";

const W = 1600, H = 900;
const CAT = {
  uiux: { tint: "#E14A6D", label: "UI / UX" },
  frontend: { tint: "#60A5FA", label: "FRONT-END" },
  graphic: { tint: "#F59E0B", label: "GRAPHIC DESIGN" },
  product: { tint: "#8B5CF6", label: "PRODUCT DESIGN" },
};

/* article slug → real work imagery (relevant to the topic) */
const SOURCE = {
  "ai-assisted-design-workflow-2026": "public/images/projects/crenny-app/mockup-1.webp",
  "arabic-rtl-ux-design-guide": "public/images/projects/jadarat-platform/mockup-1.webp",
  "design-tokens-multi-brand-systems": "public/images/projects/lamasat-furniture-app/mockup-1.webp",
  "motion-ux-microinteractions-2026": "public/images/projects/motion-showreel/poster-1.webp",
  "react-server-components-in-practice": "public/images/projects/phoenitech-website/mockup-1.webp",
  "modern-css-2026-no-framework": "public/images/projects/kafoo-web/mockup-1.webp",
  "core-web-vitals-inp-performance": "public/images/projects/fast-express-shipping/mockup-1.webp",
  "typescript-patterns-design-engineers": "public/images/projects/menu-web/mockup-1.webp",
  "brand-identity-ai-era": "public/images/projects/solareva-brand-identity/mockup-1.webp",
  "packaging-design-shelf-to-screen": "public/images/projects/nana-gelato-packaging/1.webp",
  "typography-trends-2026-variable-arabic": "public/images/projects/turki-butchery/mockup-1.webp",
  "brand-board-process-brief-to-delivery": "public/images/projects/cadeau-boutique-brand/mockup-1.webp",
  "ui-designer-to-product-designer": "public/images/projects/zanqa-education-platform/1.webp",
  "design-engineering-handoff-is-dead": "public/images/projects/bigboss-web/mockup-1.webp",
  "ux-research-on-a-budget": "public/images/projects/border-ports-app/mockup-1.webp",
  "designing-ai-native-product-experiences": "public/images/projects/tawseel-food-delivery/mockup-1.webp",
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function cover(slug, cat) {
  const src = SOURCE[slug];
  if (!src || !fs.existsSync(src)) throw new Error(`missing source for ${slug}: ${src}`);
  const { tint, label } = CAT[cat];

  // Base: her real work, cover-cropped with attention focus
  const base = await sharp(src)
    .resize(W, H, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.92, saturation: 1.06 })
    .toBuffer();

  // Cinematic grade: bottom-up dark gradient + subtle wine wash + category bar
  const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#070607" stop-opacity="0.88"/>
        <stop offset="34%" stop-color="#070607" stop-opacity="0.38"/>
        <stop offset="70%" stop-color="#070607" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#070607" stop-opacity="0.18"/>
      </linearGradient>
      <linearGradient id="wine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#B91942" stop-opacity="0.16"/>
        <stop offset="60%" stop-color="#B91942" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
    <rect width="${W}" height="${H}" fill="url(#wine)"/>
    <rect x="84" y="${H - 168}" width="10" height="76" rx="5" fill="${tint}"/>
    <text x="122" y="${H - 138}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" letter-spacing="8" fill="#FFFFFF">${esc(label)}</text>
    <text x="122" y="${H - 100}" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="600" letter-spacing="5" fill="rgba(255,255,255,0.72)">HLA SHINDEAH — BLOG · 2026</text>
  </svg>`);

  await sharp(base)
    .composite([{ input: overlay }])
    .webp({ quality: 86 })
    .toFile(`public/images/blog/${slug}.webp`);
  console.error("ok", slug);
}

const items = JSON.parse(fs.readFileSync("scripts/_covers.json", "utf8"));
for (const { slug, cat } of items) await cover(slug, cat);
console.error("V3 COVERS DONE");
