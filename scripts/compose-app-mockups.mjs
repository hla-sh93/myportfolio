/**
 * Pixel-exact mobile mockup masters (2800×2100, Dribbble 4:3) from REAL screens —
 * screens untouched (resize + top-crop only).
 * Layouts: trio (3 phones, center raised), duo (2 phones), solo (1 phone).
 * Superseded masters must be moved to _archive by hand or by this script.
 *
 * Usage: node scripts/compose-app-mockups.mjs [projectKey]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "my portfolio/01 - UIUX Design/Mobile";
const OUT = "my portfolio/08 - Mockups";
const W = 2800, H = 2100;

/* phone display ratio 430:932 (iPhone 14/15) — tall captures are top-cropped */
const PHONE_AR = 932 / 430;

const PROJECTS = {
  crenny: {
    src: "Crenny", out: "Crenny", tint: "#E8EDF2",
    sets: [
      ["Map.png", "services.png", "trip-details.png"],
      ["Choose location.png", "vehicle. type.png", "Provider Found.png"],
      ["Verify location.png", "Searching.png", "Additional Info.png"],
    ],
  },
  borderports: {
    src: "Border ports", out: "Border Ports", tint: "#E9E7F6",
    sets: [
      ["Select Company.png", "Home.png", "Detailed Revenue (Filtered Port).png"],
      ["Login.png", "Sales Report.png", "Daily Snapshot.png"],
      ["Splash-Vendors.png", "Detailed Revenue (Filtered Port).png"],
    ],
  },
  green: {
    src: "Green", out: "Green", tint: "#DFECE3",
    sets: [
      ["Categories.png", "home - Hobbyist.png", "Products.png"],
      ["Vendor Details.png", "cart.png", "Login.png"],
      ["Splash.png"],
    ],
  },
  tawseel: {
    src: "Food Delivery", out: "Food Delivery", tint: "#DCE6F4",
    sets: [
      ["Restaurant Details.png", "Home.png", "Item Details.png"],
      ["Special offers.png", "cart.png", "Navigate.png"],
      ["On scroll.png", "Splash.png", "Edit Customization.png"],
    ],
  },
  lamasatapp: {
    src: "LAMASAT", out: "LAMASAT App", tint: "#F2E8E4",
    sets: [
      ["Main Categories.png", "Home - Engineer.png", "Products List.png"],
      ["Search.png", "Product Details Page - added.png", "Account.png"],
      ["Search-1.png", "Home - regular user.png", "No Results Found.png"],
    ],
  },
};

const roundedMask = (w, h, r) =>
  Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`);

async function phone(file, w) {
  const h = Math.round(w * PHONE_AR);
  const img = await sharp(file)
    .resize({ width: w })
    .toBuffer();
  const meta = await sharp(img).metadata();
  const cropped = await sharp(img)
    .extract({ left: 0, top: 0, width: w, height: Math.min(h, meta.height) })
    .toBuffer();
  // pad if source shorter than target (rare)
  const cm = await sharp(cropped).metadata();
  const canvas = cm.height < h
    ? await sharp({ create: { width: w, height: h, channels: 4, background: "#fff" } })
        .composite([{ input: cropped, top: 0, left: 0 }]).png().toBuffer()
    : cropped;
  return sharp(canvas)
    .composite([{ input: roundedMask(w, h, Math.round(w * 0.135)), blend: "dest-in" }])
    .png().toBuffer();
}

function shadow(w, h, r) {
  const pad = 120;
  return sharp(
    Buffer.from(
      `<svg width="${w + pad * 2}" height="${h + pad * 2}">
        <rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${r}" fill="rgba(15,23,42,0.20)"/>
      </svg>`
    )
  ).blur(28).png().toBuffer();
}

function bg(tint) {
  // pale brand tint with a soft radial highlight behind the center
  return Buffer.from(`<svg width="${W}" height="${H}">
    <defs>
      <radialGradient id="g" cx="50%" cy="46%" r="62%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${tint}"/>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
  </svg>`);
}

async function compose(tint, files, outFile) {
  const n = files.length;
  const phoneW = n === 3 ? 620 : n === 2 ? 720 : 800;
  const phoneH = Math.round(phoneW * PHONE_AR);
  const gap = n === 3 ? 120 : 200;
  const totalW = n * phoneW + (n - 1) * gap;
  const x0 = Math.round((W - totalW) / 2);
  const yMid = Math.round((H - phoneH) / 2);

  const comps = [];
  for (let i = 0; i < n; i++) {
    const raise = n === 3 && i === 1 ? -70 : 0;
    const x = x0 + i * (phoneW + gap);
    const y = yMid + raise + (n === 3 && i !== 1 ? 40 : 0);
    const ph = await phone(files[i], phoneW);
    const sh = await shadow(phoneW, phoneH, Math.round(phoneW * 0.135));
    comps.push({ input: sh, left: x - 120, top: y - 120 + 36 });
    comps.push({ input: ph, left: x, top: y });
  }

  await sharp(bg(tint)).composite(comps).png().toFile(outFile);
  console.log("WROTE", outFile);
}

const only = process.argv[2];
for (const [key, cfg] of Object.entries(PROJECTS)) {
  if (only && key !== only) continue;
  const srcDir = path.join(SRC, cfg.src);
  const outDir = path.join(OUT, cfg.out);
  fs.mkdirSync(outDir, { recursive: true });
  // archive old masters
  const archive = path.join(outDir, "_archive");
  fs.mkdirSync(archive, { recursive: true });
  for (const f of fs.readdirSync(outDir).filter((f) => f.endsWith(".png"))) {
    fs.renameSync(path.join(outDir, f), path.join(archive, f));
  }
  for (let i = 0; i < cfg.sets.length; i++) {
    const files = cfg.sets[i].map((f) => path.join(srcDir, f));
    for (const f of files) if (!fs.existsSync(f)) throw new Error("missing " + f);
    await compose(cfg.tint, files, path.join(outDir, `mockup-${i + 1}.png`));
  }
}
console.log("DONE");
