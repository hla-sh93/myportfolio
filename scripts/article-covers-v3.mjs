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
  craft: { tint: "#B91942", label: "CRAFT" },
};

/* article slug → real work imagery (relevant to the topic) */
const SOURCE = {
  "taste-gap-prompt-design": "public/images/projects/ifaif-app/factory-mobile-01-alt-01-01-mob-duo-circle.webp",
  "craft-atrophy-junior-designers": "public/images/projects/zanqa-education-platform/1.webp",
  "designing-alongside-ai-loneliness": "public/images/projects/living-app-ui/1.webp",
  "breadth-versus-depth-exploration": "public/images/projects/jadarat-platform/factory-website-01-web-board-2panel.webp",
  "non-designers-in-figma": "public/images/projects/lamasat-website/factory-website-01-web-board-2panel.webp",
  "tool-fatigue-seven-tools": "public/images/projects/codxeon-website/factory-website-ready-01.webp",
  "contrast-color-browser-decides": "public/images/projects/solareva-brand-identity/factory-branding-01-b03.webp",
  "container-queries-end-of-page": "public/images/projects/emirates-sands/factory-website-01-web-board-2panel.webp",
  "when-to-delete-a-dependency": "public/images/projects/asset-security-systems/factory-website-01-w03.webp",
  "two-percent-arabic-content": "public/images/projects/krsy-web/factory-website-ready-01.webp",
  "msa-for-search-dialect-for-social": "public/images/projects/akhdar-agri-app/factory-mobile-01-mob-duo-circle.webp",
  "super-apps-middle-east": "public/images/projects/tawseel-food-delivery/factory-mobile-01-mob-duo-circle.webp",
  "translation-is-not-localization": "public/images/projects/e-liefer-delivery-platform/mockup-1.webp",
  "the-baseline-device": "public/images/projects/crenny-app/factory-mobile-01-mob-duo-circle.webp",
  "arabic-script-is-structure": "public/images/projects/ngt-brand/factory-branding-01-mag-03-b12.webp",
  "who-picks-the-metric": "public/images/projects/border-ports-app/factory-mobile-01-mob-duo-circle.webp",
  "against-best-practices": "public/images/projects/bw-company-profile/factory-profile-01-profile-open-grid.webp",
  "constraints-make-form": "public/images/projects/nana-gelato-packaging/1.webp",
  "taste-versus-judgment": "public/images/projects/sari-profile/factory-profile-01-alt-02-02-profile-cover-inner.webp",
  "simplicity-is-not-fewer-elements": "public/images/projects/capriani-gelato-brand/factory-branding-01-ready-set-brown.webp",
  "honest-interfaces": "public/images/projects/kafoo-web/factory-website-01-web-board-2panel.webp",
  "systems-beat-touches": "public/images/projects/albroker-brand/factory-branding-01-ready-01.webp",
  "design-engineering-permanent-or-gap": "public/images/projects/phoenitech-website/factory-website-01-showcase.webp",
  "why-designers-write": "public/images/projects/m1-fashion-profile/factory-profile-01-ready-01.webp",
  "measuring-generated-quality": "public/images/projects/golden-horse-web/factory-extra-01-ready-01.webp",
  "css-shape-function": "public/images/projects/wasl-fx-brand/factory-branding-01-alt-04-04-cards.webp",
  "design-systems-are-politics": "public/images/projects/lamasat-furniture-app/factory-mobile-01-mob-duo-circle.webp",
  "empty-states-are-the-product": "public/images/projects/stars-events-app/factory-mobile-01-alt-01-01-mob-duo-circle.webp",
  "forms-are-the-hardest-screen": "public/images/projects/driver-app/factory-mobile-01-ready-01.webp",
  "the-web-is-the-last-open-platform": "public/images/projects/rasael-messaging-platform/factory-website-01-w09.webp",
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
