import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * The blurred stand-in `next/image` paints while the real file downloads.
 * Sixteen pixels wide is enough to read as the picture's colour, and small
 * enough that the base64 costs less than the HTML around it.
 */
export async function blurPlaceholder(image: Buffer): Promise<string | null> {
  try {
    const tiny = await sharp(image)
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 45 })
      .toBuffer();
    return `data:image/webp;base64,${tiny.toString("base64")}`;
  } catch {
    // A missing placeholder costs a flash of empty space, never the upload.
    return null;
  }
}

/** Refuse anything too large to be a cover; a placeholder is not worth a stall. */
const MAX_BYTES = 12 * 1024 * 1024;

async function readLocal(url: string): Promise<Buffer | null> {
  try {
    const rel = url.split("?")[0].replace(/^\/+/, "");
    const full = path.join(process.cwd(), "public", rel);
    // Refuse to climb out of public/ on a crafted path.
    if (!full.startsWith(path.join(process.cwd(), "public"))) return null;
    const stat = await fs.stat(full);
    if (stat.size > MAX_BYTES) return null;
    return await fs.readFile(full);
  } catch {
    return null;
  }
}

async function fetchRemote(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.byteLength > MAX_BYTES ? null : buf;
  } catch {
    return null;
  }
}

/**
 * A placeholder for a picture that is already published.
 *
 * Uploading generates one from the bytes in hand, but choosing a cover from
 * pictures the project already has means there are no bytes in hand: media
 * rows carry width and height and never carried a placeholder. So the picture
 * is read back — off disk when it is one of ours, over the network when it
 * lives in blob storage — and the placeholder is made the same way.
 *
 * Never throws. A cover without a placeholder is worth less than a save that
 * fails because a picture could not be reached.
 */
export async function blurForUrl(url: string): Promise<string | null> {
  if (!url) return null;
  const image = url.startsWith("/")
    ? ((await readLocal(url)) ??
      // public/ is not always on the serverless filesystem, so fall back to
      // asking the site for its own file.
      (process.env.NEXT_PUBLIC_SITE_URL
        ? await fetchRemote(
            `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${url}`
          )
        : null))
    : /^https?:\/\//.test(url)
      ? await fetchRemote(url)
      : null;

  return image ? blurPlaceholder(image) : null;
}
