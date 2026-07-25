/**
 * Export "07 - Motion & Video" masters to the site:
 *   public/videos/<slug>/clip-N.mp4   (H.264 web-compressed, faststart)
 *   public/images/projects/<slug>/poster-N.webp (@1600w + blur, first one = cover)
 * and refresh src/content/project-videos.json + poster entries in
 * src/content/project-images.json.
 *
 * "App Promo" is excluded on purpose — client unidentified (CV-truth rule).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "@ffprobe-installer/ffprobe";

const SRC = "my portfolio/07 - Motion & Video";
const PROJECTS = [
  {
    slug: "motion-showreel",
    clips: [{ file: "Showreel/showreel-all.mp4", poster: 4, maxW: 1280 }],
  },
  {
    slug: "zanqa-app-promo",
    clips: [
      { file: "Zanqa App/Copy of Final Comp.mp4", poster: 6, maxW: 1280 },
      {
        file: "Zanqa App/الإصدار الجديد من تطبيق زنقة - 2.2.1.mp4",
        poster: 5,
        maxW: 1280,
      },
    ],
  },
  {
    slug: "albroker-promo",
    clips: [{ file: "Albroker/albroker-promo.mp4", poster: 5, maxW: 1920 }],
  },
  {
    slug: "piaget-presentation",
    clips: [{ file: "PIAGET Presentation/PIAGET presentation.mp4", poster: 8, maxW: 1280 }],
  },
];

const run = (bin, args) => {
  const r = spawnSync(bin, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${path.basename(bin)} failed:\n${r.stderr?.slice(-800)}`);
  return r.stdout;
};

const probe = (file) =>
  JSON.parse(
    run(ffprobe.path, [
      "-v", "error", "-select_streams", "v:0",
      "-show_entries", "stream=width,height:format=duration",
      "-of", "json", file,
    ])
  );

const imgManifest = JSON.parse(fs.readFileSync("src/content/project-images.json", "utf8"));
const vidManifest = {};

for (const proj of PROJECTS) {
  const vidDir = path.join("public/videos", proj.slug);
  const imgDir = path.join("public/images/projects", proj.slug);
  fs.mkdirSync(vidDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });
  imgManifest[proj.slug] = [];
  vidManifest[proj.slug] = [];

  for (let i = 0; i < proj.clips.length; i++) {
    const clip = proj.clips[i];
    const src = path.join(SRC, clip.file);
    const outMp4 = path.join(vidDir, `clip-${i + 1}.mp4`);

    run(ffmpegPath, [
      "-y", "-i", src,
      "-vf", `scale='min(${clip.maxW},iw)':-2`,
      "-c:v", "libx264", "-crf", "25", "-preset", "slow",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      "-c:a", "aac", "-b:a", "128k",
      outMp4,
    ]);

    const meta = probe(outMp4);
    const { width, height } = meta.streams[0];
    const duration = Math.round(parseFloat(meta.format.duration));
    vidManifest[proj.slug].push({
      url: `/videos/${proj.slug}/clip-${i + 1}.mp4`,
      width, height, duration,
    });

    // poster frame -> webp @1600w + blur (goes into the image manifest so
    // coverOf()/blur placeholders keep working unchanged)
    const rawPoster = path.join(vidDir, `_poster-${i + 1}.png`);
    run(ffmpegPath, ["-y", "-ss", String(clip.poster), "-i", src, "-frames:v", "1", rawPoster]);
    const posterName = `poster-${i + 1}.webp`;
    const resized = await sharp(rawPoster)
      .resize({ width: 1600, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });
    await sharp(resized.data).webp({ quality: 84 }).toFile(path.join(imgDir, posterName));
    const blur = await sharp(resized.data).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    imgManifest[proj.slug].push({
      url: `/images/projects/${proj.slug}/${posterName}`,
      width: resized.info.width,
      height: resized.info.height,
      blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    });
    fs.rmSync(rawPoster);

    const mb = (fs.statSync(outMp4).size / 1e6).toFixed(1);
    console.error(`ok ${proj.slug}/clip-${i + 1}.mp4 ${width}x${height} ${duration}s ${mb}MB`);
  }
}

fs.writeFileSync("src/content/project-videos.json", JSON.stringify(vidManifest, null, 1));
fs.writeFileSync("src/content/project-images.json", JSON.stringify(imgManifest, null, 1));
console.error("VIDEO EXPORT DONE");
