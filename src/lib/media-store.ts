/**
 * Where uploaded media lands.
 *
 * Vercel Blob when BLOB_READ_WRITE_TOKEN is set (the only durable option in
 * production — the serverless filesystem is discarded), the local
 * public/ folder otherwise so uploads work on a fresh clone with no cloud
 * account attached.
 */
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export type StoredMedia = {
  url: string;
  bytes: number;
  storage: "blob" | "local";
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
export const UPLOAD_PREFIX = "images/uploads";

export const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Filesystem-safe, collision-resistant name that keeps a readable stem. */
export function safeName(original: string, ext: string) {
  const stem = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${stem || "file"}-${stamp}${rand}.${ext}`;
}

export async function saveMedia(
  data: Buffer,
  filename: string,
  contentType: string
): Promise<StoredMedia> {
  if (blobConfigured()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`${UPLOAD_PREFIX}/${filename}`, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: blob.url, bytes: data.byteLength, storage: "blob" };
  }

  const dir = path.join(PUBLIC_DIR, UPLOAD_PREFIX);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
  return {
    url: `/${UPLOAD_PREFIX}/${filename}`,
    bytes: data.byteLength,
    storage: "local",
  };
}
