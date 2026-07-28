/**
 * Capture the live front-end sites for the portfolio.
 *
 * Two products per site:
 *   hero.png      1440×900  — the card image for the site wall
 *   panel-N.png   1440×2880 — tall slices for compose-showcase-mockup.mjs
 *
 * Notes that matter:
 *  - the tall viewport is deliberate: every scroll-reveal is inside the
 *    viewport, so nothing is captured mid-fade the way a short viewport does;
 *  - these sites all sit on one host and her ISP's resolver NXDOMAINs them,
 *    so the hostnames are mapped straight to their public-DNS addresses;
 *  - `panel` slices are taken by scrolling, not with fullPage, which keeps
 *    sticky headers from being stamped repeatedly down the capture.
 *
 * Usage: node scripts/capture-live-sites.mjs <outDir> [siteKey ...]
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = process.argv[2];
const ONLY = process.argv.slice(3);
if (!OUT) {
  console.error("usage: node scripts/capture-live-sites.mjs <outDir> [siteKey ...]");
  process.exit(1);
}

const HOST_IP = "74.0.48.66";

/** key → { url, name, panels } */
export const SITES = {
  haiti: { url: "https://haiauthor.org", name: "Haiti Ship Registration" },
  zimbabwe: { url: "https://zimadmin.org", name: "Zimbabwe Maritime Administration" },
  nicaragua: { url: "https://nicaradmin.org", name: "Nicaragua Maritime Administration" },
  chad: { url: "https://chadminstra.org", name: "Chad Maritime Administration" },
  cameroon: { url: "https://cameadmin.org", name: "Cameroon Ship Registry" },
  equatorialguinea: { url: "https://equguadmin.org", name: "Equatorial Guinea Ship Administration" },
  zambiaadmin: { url: "https://zambauth.org", name: "Zambia Maritime Administration" },
  zambiaservices: { url: "https://zamadmin.org", name: "Zambia Maritime Services" },
  alliance: { url: "https://clallianc.org", name: "Alliance Ship Certification Services" },
  sasmaa: { url: "https://sasmaaclub.org", name: "SASMAA" },
  asset: { url: "https://asset-uae.com", name: "ASSET" },
  rasael: { url: "https://rasaelapp.com", name: "Rasael" },
};

const MAPPED = [
  "haiauthor.org", "zimadmin.org", "nicaradmin.org", "equguadmin.org",
  "sasmaaclub.org", "zambauth.org", "zamadmin.org", "chadminstra.org",
  "cameadmin.org", "clallianc.org",
];
const rules = MAPPED.flatMap((h) => [`MAP ${h} ${HOST_IP}`, `MAP www.${h} ${HOST_IP}`]).join(", ");

const HERO = { width: 1440, height: 900, deviceScaleFactor: 2 };
const PANEL = { width: 1440, height: 2880, deviceScaleFactor: 1.5 };
const PANELS = 3;

/** Let lazy images and reveal animations settle, then park the scroll. */
async function settle(page, ms = 3200) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, ms));
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: [
    "--no-sandbox",
    "--hide-scrollbars",
    "--ignore-certificate-errors",
    `--host-resolver-rules=${rules}`,
  ],
});

const keys = ONLY.length ? ONLY : Object.keys(SITES);
const report = [];

for (const key of keys) {
  const site = SITES[key];
  if (!site) {
    console.log(`skip ${key} — unknown site key`);
    continue;
  }
  const dir = path.join(OUT, key);
  fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage();
  const row = { key, url: site.url };

  try {
    await page.setViewport(HERO);
    await page.goto(site.url, { waitUntil: "networkidle2", timeout: 60000 });
    await settle(page);
    await page.screenshot({ path: path.join(dir, "hero.png") });

    await page.setViewport(PANEL);
    await new Promise((r) => setTimeout(r, 1500));
    await settle(page, 2200);

    const height = await page.evaluate(() => document.body.scrollHeight);
    row.pageHeight = height;
    // spread the slices over whatever page length actually exists
    const span = Math.max(0, height - PANEL.height);
    for (let i = 0; i < PANELS; i++) {
      const y = PANELS === 1 ? 0 : Math.round((span * i) / (PANELS - 1));
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await new Promise((r) => setTimeout(r, 900));
      await page.screenshot({ path: path.join(dir, `panel-${i + 1}.png`) });
    }
    row.ok = true;
    console.log(`OK   ${key.padEnd(18)} height=${height}`);
  } catch (e) {
    row.ok = false;
    row.error = String(e.message || e).slice(0, 120);
    console.log(`FAIL ${key.padEnd(18)} ${row.error}`);
  }
  await page.close();
  report.push(row);
}

fs.writeFileSync(path.join(OUT, "capture.json"), JSON.stringify(report, null, 2));
console.log(`\ncaptured ${report.filter((r) => r.ok).length}/${keys.length} → ${OUT}`);
await browser.close();
