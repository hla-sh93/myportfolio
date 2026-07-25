/**
 * Browser-side image compression, run before anything is uploaded.
 *
 * Two problems it solves at once:
 *  1. Vercel rejects request bodies over 4.5 MB, so a 10 MB photo could never
 *     reach the server to be optimised there.
 *  2. Uploading 10 MB to shrink it to 300 KB wastes the user's bandwidth.
 *
 * Decoding happens through createImageBitmap (off the main thread where
 * supported) and encoding through canvas.toBlob, both of which every current
 * browser supports for WebP.
 */

export type CompressResult = {
  file: File;
  originalBytes: number;
  bytes: number;
  width: number;
  height: number;
};

const MAX_EDGE = 2400;
const QUALITY = 0.85;

/** Formats the canvas can decode. SVG is passed through untouched. */
const CANVAS_SAFE = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/bmp",
];

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encoding failed"))),
      "image/webp",
      quality
    );
  });
}

export async function compressImage(file: File): Promise<CompressResult> {
  const originalBytes = file.size;

  // Animated GIFs and SVGs lose their meaning through a canvas — send as-is
  // and let the server decide.
  if (!CANVAS_SAFE.includes(file.type)) {
    return {
      file,
      originalBytes,
      bytes: originalBytes,
      width: 0,
      height: 0,
    };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await toBlob(canvas, QUALITY);

  // A tiny, already-optimised source can come out bigger as WebP — keep the
  // original when that happens.
  if (blob.size >= originalBytes && file.type === "image/webp") {
    return { file, originalBytes, bytes: originalBytes, width, height };
  }

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return {
    file: new File([blob], name, { type: "image/webp" }),
    originalBytes,
    bytes: blob.size,
    width,
    height,
  };
}

export const formatBytes = (n: number) =>
  n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
