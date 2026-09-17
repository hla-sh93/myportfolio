/**
 * Build the 1200×630 share cards for the pages that have no artwork of their
 * own — home, about, projects, blog, contact — in both languages.
 *
 *   node scripts/build-page-share-cards.mjs
 *
 * Why a browser and not the /api/og route: that route renders through Satori,
 * which does not shape Arabic. It lays the glyphs out left-to-right in their
 * isolated forms, so "نبذة عني" previewed as "ةذبن ينع" — every Arabic page
 * she shared carried broken text. sharp's SVG renderer drops the text
 * entirely. Chrome is the one renderer here that shapes and orders Arabic
 * correctly, so the cards are rendered once, committed, and served as static
 * files. Nothing renders Arabic at request time.
 *
 * Output: public/images/share/page-<locale>-<key>.jpg
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT_DIR = "public/images/share";
const W = 1200;
const H = 630;

const ar = JSON.parse(fs.readFileSync("src/messages/ar.json", "utf8"));
const en = JSON.parse(fs.readFileSync("src/messages/en.json", "utf8"));

/** key → [title, label] per locale, taken from the same strings the pages use. */
const PAGES = {
  home: { ar: [ar.hero.name, ar.hero.title], en: [en.hero.name, en.hero.title] },
  projects: { ar: [ar.projects.heading, ar.projects.subtitle], en: [en.projects.heading, en.projects.subtitle] },
  blog: { ar: [ar.blog.heading, ar.blog.subtitle], en: [en.blog.heading, en.blog.subtitle] },
  about: { ar: [ar.about.title, ar.about.subtitle], en: [en.about.title, en.about.subtitle] },
  contact: { ar: [ar.contact.title, ar.contact.subtitle], en: [en.contact.title, en.contact.subtitle] },
};

const GROUND = "#120409";
const ACCENT = "#B91942";
const ACCENT_SOFT = "#E64A6E";

function cardHtml(locale, title, label) {
  const rtl = locale === "ar";
  const family = rtl ? "Tajawal" : "'Space Grotesk'";
  const fonts = rtl
    ? "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=block"
    : "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=block";
  return `<!doctype html><html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}"><head>
<meta charset="utf-8"><link rel="stylesheet" href="${fonts}">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${GROUND};
    background-image:radial-gradient(110% 75% at 50% 0%, ${ACCENT}55 0%, ${GROUND} 62%);
    font-family:${family},system-ui,sans-serif;color:#fff;
    display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;
    border-bottom:8px solid ${ACCENT}}
  .chip{display:inline-flex;align-items:center;gap:14px;align-self:flex-start;
    padding:10px 26px;border:1px solid rgba(255,255,255,.22);border-radius:100px;
    font-size:22px;font-weight:700;letter-spacing:${rtl ? "1px" : "3px"};
    text-transform:${rtl ? "none" : "uppercase"}}
  .chip i{width:10px;height:10px;border-radius:10px;background:${ACCENT_SOFT}}
  h1{font-size:${title.length > 40 ? 62 : 78}px;font-weight:700;line-height:1.2;max-width:1000px}
  .foot{display:flex;align-items:flex-end;justify-content:space-between}
  .mark{font-size:34px;font-weight:700}
  .mark span{color:${ACCENT_SOFT}}
  .disc{font-size:22px;color:rgba(255,255,255,.55)}
</style></head><body>
<div class="chip"><i></i>${label}</div>
<h1>${title}</h1>
<div class="foot">
  <div class="mark">${rtl ? "حلا شندية" : "Hla Shindeah"}<span>.</span></div>
  <div class="disc" dir="ltr">UI/UX · Front-End · Brand · Motion</div>
</div>
</body></html>`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});

const built = [];
for (const [key, byLocale] of Object.entries(PAGES)) {
  for (const locale of ["ar", "en"]) {
    const [title, label] = byLocale[locale];
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.setContent(cardHtml(locale, title, label), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 300));
    const name = `page-${locale}-${key}`;
    await page.screenshot({ path: path.join(OUT_DIR, `${name}.jpg`), type: "jpeg", quality: 86 });
    await page.close();
    built.push(name);
    console.error(`✓ ${name}  "${title.slice(0, 36)}"`);
  }
}
await browser.close();

fs.writeFileSync(
  "src/content/share-cards-pages.json",
  JSON.stringify(built.sort(), null, 2)
);
console.error(`\n${built.length} page cards → ${OUT_DIR}`);
