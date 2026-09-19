/**
 * Blog title covers — the bilingual plate.
 *
 * Every article gets a 1600x900 cover carrying its Arabic and its English
 * title, set in the site's own type and tokens: studio black, wine accent,
 * hairline cards at 30px, chip labels, film grain. Arabic leads because the
 * site does; English answers underneath across a rule.
 *
 * Five arrangements share one voice, rotated by index so no two covers sit
 * side by side in the grid looking the same. Colour comes from the article's
 * category, not from the arrangement.
 *
 * Chrome renders the plate (real HarfBuzz shaping — the only way Arabic
 * comes out joined) at 2x, and sharp brings it back down to 1600x900.
 *
 *   node scripts/blog-title-covers.mjs               # every article
 *   node scripts/blog-title-covers.mjs <slug> ...    # just these
 *   node scripts/blog-title-covers.mjs --sheet       # + a contact sheet
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import puppeteer from "puppeteer-core";
import { inlineFontCss } from "./_fonts.mjs";

const W = 1600, H = 900, SCALE = 2;
const OUT = "public/images/blog";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

/* ── Categories ───────────────────────────────────────────────────────
   The colour each plate is tinted with. Craft keeps the brand wine; the
   rest reuse the category colours already defined in globals.css. */
const CATS = {
  craft:    { accent: "#D62049", en: "Craft" },
  product:  { accent: "#8B5CF6", en: "Product Design" },
  frontend: { accent: "#60A5FA", en: "Front-End" },
  uiux:     { accent: "#E14A6D", en: "UI / UX" },
  graphic:  { accent: "#F59E0B", en: "Graphic Design" },
};

/* Articles seeded after _covers.json carry no category of their own, so
   their tags decide it — most specific tag wins, in this order. */
const BY_TAG = [
  ["Front-End", "frontend"], ["CSS", "frontend"], ["Web Platform", "frontend"],
  ["React", "frontend"], ["Next.js", "frontend"], ["TypeScript", "frontend"],
  ["Performance", "frontend"], ["Design Engineering", "frontend"],
  ["Graphic Design", "graphic"], ["Branding", "graphic"],
  ["Packaging", "graphic"], ["Typography", "graphic"],
  ["Design Systems", "product"], ["Product Design", "product"], ["Strategy", "product"],
  ["RTL", "uiux"], ["Accessibility", "uiux"], ["Motion", "uiux"],
  ["UX Research", "uiux"], ["Arabic", "uiux"], ["UI/UX", "uiux"], ["UX", "uiux"],
  ["Craft", "craft"], ["Career", "craft"], ["Process", "craft"],
];

function categoryOf(article, seeded) {
  if (seeded.has(article.slug)) return seeded.get(article.slug);
  for (const [tag, cat] of BY_TAG) if (article.tags?.includes(tag)) return cat;
  return "craft";
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── The page ─────────────────────────────────────────────────────────
   One document holds every plate rule; each render swaps the data and
   re-fits the type, so Chrome parses the webfonts exactly once. */
const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:#070607;overflow:hidden}

.plate{
  position:relative;width:${W}px;height:${H}px;overflow:hidden;
  background:#070607;color:#F7F4F5;
  --fg:#F7F4F5; --faint:rgba(255,255,255,.42);
  --line:rgba(255,255,255,.16); --soft:rgba(255,255,255,.075);
}

/* Light: a wide wine bloom plus a tighter one in the category colour. Two
   sources rather than one keep the black from reading as flat ink. */
.glow{position:absolute;inset:0}
.glow::before,.glow::after{content:"";position:absolute;border-radius:50%;transform:translate(-50%,-50%)}
.glow::before{width:1500px;height:1500px;left:var(--bx);top:var(--by);
  background:radial-gradient(circle,rgba(185,25,66,.44),rgba(185,25,66,0) 64%)}
.glow::after{width:1060px;height:1060px;left:var(--ax);top:var(--ay);opacity:.66;
  background:radial-gradient(circle,var(--halo),transparent 64%)}

/* A hairline field under everything — the studio blueprint, barely there. */
.mesh{position:absolute;inset:0;opacity:.5;
  background-image:linear-gradient(var(--soft) 1px,transparent 1px),
                   linear-gradient(90deg,var(--soft) 1px,transparent 1px);
  background-size:100px 100px;
  -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,#000 20%,transparent 78%)}

.figure{position:absolute;inset:0;overflow:hidden}
.figure svg{position:absolute;left:0;top:0}

/* The same feTurbulence layer the site paints over every page. */
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.062;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.vignette{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 98% 98% at 50% 46%,transparent 56%,rgba(7,6,7,.70) 100%)}

/* The live area. A cover is cropped to 16:10 in the card (and scaled 4%
   further on hover) and to 21:9 on the article page, so nothing that has
   to survive both crops may sit outside this box. */
.safe{position:absolute;left:132px;top:132px;width:${W - 264}px;height:${H - 264}px;display:flex}

/* chip-label, straight out of globals.css */
.chip{display:inline-flex;align-items:center;gap:10px;flex:0 0 auto;align-self:flex-start;
  font-family:Poppins,sans-serif;font-size:19px;font-weight:500;letter-spacing:.16em;
  text-transform:uppercase;color:var(--fg);white-space:nowrap;
  border:1px solid var(--line);border-radius:999px;padding:11px 26px;line-height:1.2}
.chip::before{content:"";width:8px;height:8px;border-radius:999px;background:var(--accent);flex:0 0 auto}

.meta{font-family:"JetBrains Mono",monospace;font-size:17px;font-weight:400;
  letter-spacing:.2em;color:var(--faint);white-space:nowrap;text-transform:uppercase}

/* Arabic display. No letter-spacing — it pulls the ligatures apart — and a
   taller line than the Latin, which Arabic needs for its descenders. */
.ar{font-family:Tajawal,sans-serif;font-weight:400;direction:rtl;
  letter-spacing:0;line-height:1.52;color:var(--fg);
  display:flex;align-items:center;overflow:visible}
.ar > span{display:block;width:100%;text-wrap:balance}

/* The Latin answer, set light and tight against the Arabic. */
.en{font-family:"Space Grotesk",sans-serif;font-weight:300;direction:ltr;
  letter-spacing:-.018em;line-height:1.18;color:rgba(247,244,245,.88);
  display:flex;align-items:center;overflow:visible}
.en > span{display:block;width:100%;text-wrap:balance}

.rule{background:var(--line);flex:0 0 auto}

/* ── 1 · Column ── a centred masthead */
.t1 .safe{flex-direction:column;align-items:center;text-align:center}
.t1 .chip{align-self:center;margin-bottom:auto}
.t1 .ar,.t1 .en{width:92%;justify-content:center;text-align:center}
.t1 .band{display:flex;align-items:center;gap:22px;margin:30px 0;flex:0 0 auto}
.t1 .band .rule{width:120px;height:1px;background:rgba(255,255,255,.30)}
.t1 .band .dot{width:7px;height:7px;border-radius:999px;background:var(--accent);flex:0 0 auto}
.t1 .meta{margin-top:auto}

/* ── 2 · Split ── a rule down the plate, the index on the short side */
.t2 .safe{flex-direction:row;align-items:stretch}
.t2 .side{width:290px;flex:0 0 auto;display:flex;flex-direction:column;
  justify-content:space-between;padding-right:46px}
.t2 .divider{width:1px;background:var(--line);flex:0 0 auto}
.t2 .main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;
  justify-content:center;padding-left:56px}
.t2 .idx{font-family:"Space Grotesk",sans-serif;font-weight:300;font-size:120px;
  line-height:.85;color:var(--accent)}
.t2 .idx small{display:block;font-family:"JetBrains Mono",monospace;font-size:16px;
  letter-spacing:.2em;color:var(--faint);margin-top:18px;text-transform:uppercase}
.t2 .ar{text-align:right;justify-content:flex-end}
.t2 .en{text-align:left}
.t2 .rule{width:88px;height:2px;margin:26px 0;background:var(--accent)}

/* ── 3 · Baseline ── anchored low, above a full-width rule */
.t3 .safe{flex-direction:column;align-items:stretch}
.t3 .top{display:flex;align-items:flex-start;justify-content:space-between;flex:0 0 auto}
.t3 .body{margin-top:auto;display:flex;gap:34px;align-items:stretch}
.t3 .bar{width:3px;background:var(--accent);flex:0 0 auto;border-radius:2px}
.t3 .stack{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;justify-content:flex-end}
.t3 .ar{text-align:right;justify-content:flex-end}
.t3 .en{text-align:left;margin-top:32px}
.t3 .foot{margin-top:42px;padding-top:22px;border-top:1px solid var(--line);
  display:flex;justify-content:space-between;align-items:center;flex:0 0 auto}

/* ── 4 · Framed ── the card-line surface at 30px, type held inside */
.t4 .frame{flex:1 1 auto;margin:0 18px;border:1px solid var(--line);border-radius:30px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:56px 76px;text-align:center}
.t4 .chip{align-self:center;margin-bottom:auto}
.t4 .ar,.t4 .en{width:100%;justify-content:center;text-align:center}
.t4 .rule{width:72px;height:2px;margin:26px 0;background:var(--accent)}
.t4 .meta{margin-top:auto}

/* ── 5 · Ledger ── ruled top and bottom, type held between */
.t5 .safe{flex-direction:column;align-items:stretch}
.t5 .row{display:flex;align-items:center;justify-content:space-between;flex:0 0 auto;
  padding-bottom:24px;border-bottom:1px solid var(--line)}
.t5 .mid{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;
  justify-content:center;padding:40px 0}
.t5 .ar{text-align:right;justify-content:flex-end}
.t5 .en{text-align:left;margin-top:32px}
.t5 .foot{display:flex;align-items:center;justify-content:space-between;flex:0 0 auto;
  padding-top:24px;border-top:1px solid var(--line)}
.t5 .mark{font-family:Poppins,sans-serif;font-size:18px;font-weight:600;
  letter-spacing:.24em;text-transform:uppercase;color:var(--fg)}
`;

/* Hairline figures — one per arrangement, drawn behind the type. */
const FIGURES = {
  t1: (a) =>
    [0, 1, 2, 3, 4]
      .map((i) => `<circle cx="800" cy="1180" r="${300 + i * 150}" fill="none" stroke="${a}" stroke-opacity="${(0.17 - i * 0.027).toFixed(3)}" stroke-width="1"/>`)
      .join(""),
  t2: (a) =>
    Array.from({ length: 26 }, (_, i) =>
      `<rect x="${1340 + (i % 2 ? 0 : 18)}" y="${90 + i * 28}" width="${i % 2 ? 44 : 26}" height="1" fill="#fff" fill-opacity=".10"/>`
    ).join("") + `<rect x="0" y="0" width="1600" height="1" fill="${a}" fill-opacity=".22"/>`,
  t3: (a) =>
    Array.from({ length: 16 }, (_, i) =>
      `<line x1="${900 + i * 56}" y1="-60" x2="${1180 + i * 56}" y2="360" stroke="#fff" stroke-opacity=".055" stroke-width="1"/>`
    ).join("") + `<circle cx="1330" cy="228" r="150" fill="none" stroke="${a}" stroke-opacity=".20" stroke-width="1"/>`,
  t4: (a) =>
    Array.from({ length: 13 }, (_, r) =>
      Array.from({ length: 23 }, (_, c) =>
        `<circle cx="${60 + c * 70}" cy="${60 + r * 70}" r="1.6" fill="#fff" fill-opacity=".085"/>`
      ).join("")
    ).join("") + `<circle cx="800" cy="450" r="392" fill="none" stroke="${a}" stroke-opacity=".14" stroke-width="1"/>`,
  t5: (a) =>
    `<path d="M1180 900 L1470 0 L1530 0 L1240 900 Z" fill="${a}" fill-opacity=".10"/>` +
    `<path d="M1300 900 L1590 0 L1612 0 L1322 900 Z" fill="${a}" fill-opacity=".06"/>`,
};

/* Where each arrangement's light sits, so the bloom never lands under the
   densest run of type. */
const GLOW = {
  t1: { bx: "50%", by: "106%", ax: "50%", ay: "-14%" },
  t2: { bx: "-6%", by: "50%", ax: "96%", ay: "10%" },
  t3: { bx: "8%", by: "104%", ax: "88%", ay: "4%" },
  t4: { bx: "24%", by: "94%", ax: "82%", ay: "6%" },
  t5: { bx: "94%", by: "98%", ax: "4%", ay: "6%" },
};

/* The most height each block may take, and the size range it is fitted
   within. The height is a ceiling, not a slot — once the size is settled
   the block collapses onto its own text, so a two-line title and a
   one-line title both sit tight against what follows them. */
const BOX = {
  t1: { ar: [250, 40, 76], en: [150, 26, 48] },
  t2: { ar: [250, 40, 76], en: [150, 26, 48] },
  t3: { ar: [250, 40, 76], en: [150, 26, 48] },
  t4: { ar: [230, 38, 70], en: [130, 24, 44] },
  t5: { ar: [250, 40, 76], en: [150, 26, 48] },
};

function plateHtml(d) {
  const { tpl, accent, catEn, ar, en, no, year, mins } = d;
  const chip = `<span class="chip">${esc(catEn)}</span>`;
  const metaFull = `<span class="meta">Hla Shindeah &middot; No. ${no} &middot; ${year} &middot; ${mins} Min</span>`;
  const metaShort = `<span class="meta">No. ${no} &mdash; ${year}</span>`;
  const arEl = `<div class="ar" id="ar"><span>${esc(ar)}</span></div>`;
  const enEl = `<div class="en" id="en"><span>${esc(en)}</span></div>`;

  const body = {
    t1: `<div class="safe">${chip}${arEl}
      <div class="band"><span class="rule"></span><span class="dot"></span><span class="rule"></span></div>
      ${enEl}${metaFull}</div>`,
    t2: `<div class="safe">
      <div class="side"><div class="idx">${no}<small>${esc(catEn)}</small></div>${metaShort}</div>
      <div class="divider"></div>
      <div class="main">${arEl}<span class="rule"></span>${enEl}</div></div>`,
    t3: `<div class="safe">
      <div class="top">${chip}${metaShort}</div>
      <div class="body"><div class="bar"></div><div class="stack">${arEl}${enEl}</div></div>
      <div class="foot"><span class="meta">Hla Shindeah</span><span class="meta">${mins} Min</span></div></div>`,
    t4: `<div class="safe"><div class="frame">${chip}${arEl}<span class="rule"></span>${enEl}${metaFull}</div></div>`,
    t5: `<div class="safe">
      <div class="row">${chip}<span class="meta">${year} / ${no}</span></div>
      <div class="mid">${arEl}${enEl}</div>
      <div class="foot"><span class="mark">Hla Shindeah</span><span class="meta">${esc(catEn)} &middot; ${mins} Min</span></div></div>`,
  }[tpl];

  const g = GLOW[tpl];
  return `<div class="plate ${tpl}" style="--accent:${accent};--halo:${accent}4D;--bx:${g.bx};--by:${g.by};--ax:${g.ax};--ay:${g.ay}">
    <div class="glow"></div>
    <div class="mesh"></div>
    <div class="figure"><svg width="${W}" height="${H}">${FIGURES[tpl](accent)}</svg></div>
    ${body}
    <div class="vignette"></div>
    <div class="grain"></div>
  </div>`;
}

/* Type that fits. The 46 titles run from 20 to 64 characters, so one fixed
   size either clips the long ones or leaves the short ones looking timid.
   Each block is binary-searched down to the largest size that still fits
   the height it was given. */
/* Every family, in both scripts, so no face is discovered mid-render. */
const PROBE =
  `<span style="position:absolute;visibility:hidden;font-size:40px;font-family:Tajawal">ما العربية</span>` +
  `<span style="position:absolute;visibility:hidden;font-size:40px;font-family:'Space Grotesk'">Wg</span>` +
  `<span style="position:absolute;visibility:hidden;font-size:40px;font-family:Poppins">Wg</span>` +
  `<span style="position:absolute;visibility:hidden;font-size:40px;font-family:'JetBrains Mono'">Wg</span>`;

const FIT = `
function fit(el, ceiling, min, max) {
  const inner = el.firstElementChild;
  el.style.height = ceiling + 'px';
  let lo = min, hi = max, best = min;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    el.style.fontSize = mid + 'px';
    if (inner.getBoundingClientRect().height <= ceiling + 0.5) { best = mid; lo = mid; }
    else { hi = mid; }
  }
  el.style.fontSize = best + 'px';
  /* Collapse onto the text so the gap below is the one the layout asked
     for, not the leftover of a slot the title never filled. */
  el.style.height = Math.ceil(inner.getBoundingClientRect().height) + 'px';
  return best;
}`;

async function main() {
  const articles = JSON.parse(fs.readFileSync("data/articles.json", "utf8"));
  const seeded = new Map(
    JSON.parse(fs.readFileSync("scripts/_covers.json", "utf8")).map((c) => [c.slug, c.cat])
  );

  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const wantSheet = process.argv.includes("--sheet");

  /* The index runs oldest to newest, so No. 01 is the first she published. */
  const ordered = [...articles].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  const noOf = new Map(ordered.map((a, i) => [a.slug, String(i + 1).padStart(2, "0")]));

  const jobs = articles
    .map((a, i) => {
      const cat = categoryOf(a, seeded);
      return {
        slug: a.slug,
        cat,
        tpl: "t" + ((i % 5) + 1),
        accent: CATS[cat].accent,
        catEn: CATS[cat].en,
        ar: a.titleAr,
        en: a.titleEn,
        no: noOf.get(a.slug),
        year: new Date(a.publishedAt).getFullYear(),
        mins: a.readTime ?? 4,
      };
    })
    .filter((j) => !only.length || only.includes(j.slug));

  if (!jobs.length) throw new Error(`no article matched: ${only.join(", ")}`);

  const fontCss = await inlineFontCss([
    "Tajawal:wght@300;400;500;700",
    "Space+Grotesk:wght@300;400;500;700",
    "Poppins:wght@300;400;500;600",
    "JetBrains+Mono:wght@400;500",
  ]);

  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">` +
      `<style>${fontCss}</style><style>${CSS}</style></head>` +
      `<body><div id="probe">${PROBE}</div><div id="root"></div>` +
      `<script>${FIT}</script></body></html>`,
    { waitUntil: "load" }
  );
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.getElementById("probe").remove());

  for (const j of jobs) {
    /* Lay the plate down first and let the faces settle, then measure.
       Fitting in the same tick as the insert measures whatever font
       happened to be resolved at that instant. */
    await page.evaluate((html) => {
      document.getElementById("root").innerHTML = html;
    }, plateHtml(j));
    await page.evaluate(() => document.fonts.ready);

    const sizes = await page.evaluate((box) => {
      const ar = document.getElementById("ar"), en = document.getElementById("en");
      return [fit(ar, ...box.ar), fit(en, ...box.en)];
    }, BOX[j.tpl]);

    const png = await page.screenshot({ type: "png" });
    await sharp(png)
      .resize(W, H, { fit: "fill" })
      .webp({ quality: 90, effort: 5 })
      .toFile(path.join(OUT, `${j.slug}.webp`));
    console.log(
      `${j.tpl}  ${j.cat.padEnd(9)} ar:${sizes[0].toFixed(0).padStart(2)}  en:${sizes[1].toFixed(0).padStart(2)}  ${j.slug}`
    );
  }
  await browser.close();

  if (wantSheet) {
    const cols = 4, tw = 400, th = 225, gap = 14;
    const rows = Math.ceil(jobs.length / cols);
    const tiles = await Promise.all(
      jobs.map(async (j, i) => ({
        input: await sharp(path.join(OUT, `${j.slug}.webp`)).resize(tw, th).toBuffer(),
        left: gap + (i % cols) * (tw + gap),
        top: gap + Math.floor(i / cols) * (th + gap),
      }))
    );
    const sheet = process.env.SHEET_OUT || "blog-covers-contact-sheet.webp";
    await sharp({
      create: {
        width: gap + cols * (tw + gap),
        height: gap + rows * (th + gap),
        channels: 3,
        background: "#070607",
      },
    })
      .composite(tiles)
      .webp({ quality: 88 })
      .toFile(sheet);
    console.log(`contact sheet -> ${sheet}`);
  }

  console.log(`\n${jobs.length} covers -> ${OUT}`);
}

main();
