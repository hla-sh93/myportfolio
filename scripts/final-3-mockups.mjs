/**
 * FINAL mockup set — exactly 3 per website, from the ONLY 2 approved styles:
 *   mockup 1: showcase.png — tilted overlapping browser windows (2-3 pages)
 *   mockup 2: duo.png      — two full flat pages side by side
 *   mockup 3: duo-2.png    — duo with the next pages (variety)
 * Flat and readable — the design itself is the hero. No scroll/curl/laptop styles.
 *
 * Multi-page sites use real pages; single-page sites use slice-page.mjs segments.
 * Everything else in each 08-Mockups folder is moved to _archive.
 *
 * Usage: node scripts/final-3-mockups.mjs [projectName]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SRC = "my portfolio/01 - UIUX Design/Web";
const OUT = "my portfolio/08 - Mockups";
const HEX = {
  "Jadarat Platform": "#84604b", "SAAB Logistics": "#1b3a7a", "Turki Butchery": "#75443b",
  "Emirates Sands": "#222946", "Phoenitech Website": "#0f4b5a", "Menu": "#a04516",
  "BigBoss": "#283b65", "Kafoo": "#198e4e", "Fast Express": "#436273",
  "LAMASAT": "#233150",
};
const KEEP = new Set(["showcase.png", "duo.png", "duo-2.png"]);

function run(script, args) {
  const res = spawnSync("node", [script, ...args], { encoding: "utf8" });
  if (res.status !== 0) throw new Error(`${script} ${args.join(" ")}\n${res.stderr}`);
  return res.stdout.trim();
}

async function pickPages(dir, max = 4) {
  const infos = [];
  for (const f of fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    try {
      const m = await sharp(path.join(dir, f)).metadata();
      if (m.width >= 900 && m.height / m.width >= 1.25)
        infos.push({ f, aspect: m.height / m.width });
    } catch {}
  }
  const seen = new Map();
  for (const it of infos.sort((a, b) => b.aspect - a.aspect)) {
    const key = it.f.replace(/\.(jpe?g|png|webp)$/i, "").replace(/-1$/, "").toLowerCase();
    if (!seen.has(key)) seen.set(key, it);
  }
  return [...seen.values()].slice(0, max).map((it) => path.join(dir, it.f));
}

const only = process.argv[2];
for (const proj of Object.keys(HEX)) {
  if (only && proj !== only) continue;
  const dir = path.join(SRC, proj);
  if (!fs.existsSync(dir)) { console.log(`missing src: ${proj}`); continue; }
  const outDir = path.join(OUT, proj);
  fs.mkdirSync(outDir, { recursive: true });
  const hex = HEX[proj];

  let pages = await pickPages(dir);
  if (pages.length < 3) {
    // slice the longest page into 3 pseudo-pages
    const slices = path.join("scripts/assets/slices", proj);
    run("scripts/slice-page.mjs", [pages[0], slices, "3"]);
    const s = (n) => path.join(slices, `slice-${n}.png`);
    pages = pages.length === 2
      ? [pages[0], pages[1], s(2), s(3)]      // real pages first, slices for variety
      : [s(1), s(2), s(3)];
  }

  const p = (i) => pages[Math.min(i, pages.length - 1)];
  console.log(`=== ${proj} (${pages.length} pages)`);
  console.log(run("scripts/compose-showcase-mockup.mjs", [p(1), p(0), p(2), path.join(outDir, "showcase.png"), hex]));
  console.log(run("scripts/compose-duo-mockup.mjs", [p(0), p(1), path.join(outDir, "duo.png"), hex]));
  const d2 = pages.length >= 4 ? [p(2), p(3)] : [p(1), p(2)];
  console.log(run("scripts/compose-duo-mockup.mjs", [...d2, path.join(outDir, "duo-2.png"), hex]));

  // archive everything that is not part of the final 3
  const arch = path.join(outDir, "_archive");
  for (const f of fs.readdirSync(outDir)) {
    const fp = path.join(outDir, f);
    if (fs.statSync(fp).isDirectory() || KEEP.has(f)) continue;
    fs.mkdirSync(arch, { recursive: true });
    fs.renameSync(fp, path.join(arch, f));
  }
}
console.log("FINAL SET DONE");
