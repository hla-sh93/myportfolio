/**
 * Google Fonts → inline @font-face CSS, cached on disk.
 *
 * Headless Chrome renders the blog covers, so the exact webfonts the site
 * uses have to be present in the page. Fetching the css2 stylesheet gives
 * back unicode-range-split woff2 URLs; we download each one, cache it under
 * scripts/.fontcache, and hand back the same CSS with the URLs swapped for
 * data URIs. Data URIs rather than file:// so the render needs no local
 * file access, and the cache so a re-run is offline and instant.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const CACHE = "scripts/.fontcache";
/* A modern UA is what makes Google serve woff2 instead of ttf. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

fs.mkdirSync(CACHE, { recursive: true });

async function cached(url, ext) {
  const file = path.join(CACHE, crypto.createHash("md5").update(url).digest("hex") + ext);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`font fetch ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(file, buf);
  return buf;
}

/** @param {string[]} families css2 `family=` values, e.g. "Tajawal:wght@400;500;700" */
export async function inlineFontCss(families) {
  const url =
    "https://fonts.googleapis.com/css2?" +
    families.map((f) => "family=" + f.replace(/ /g, "+")).join("&") +
    "&display=block";
  const css = (await cached(url, ".css")).toString("utf8");

  const urls = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]))];
  const map = new Map();
  for (const u of urls) {
    const b64 = (await cached(u, ".woff2")).toString("base64");
    map.set(u, `data:font/woff2;base64,${b64}`);
  }
  return css.replace(/url\((https:\/\/[^)]+\.woff2)\)/g, (m, u) => `url(${map.get(u) ?? u})`);
}
