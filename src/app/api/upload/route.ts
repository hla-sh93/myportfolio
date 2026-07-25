import { auth } from "@/auth";
import { safeName, saveMedia } from "@/lib/media-store";
import { NextResponse } from "next/server";
import sharp from "sharp";

/**
 * Admin media upload.
 *
 * Images are re-encoded to WebP here regardless of what arrived — the client
 * already shrinks big files before sending (Vercel caps a request body at
 * 4.5 MB), and this pass guarantees the result no matter which client did the
 * upload. Video is stored as-is: transcoding needs ffmpeg, which does not fit
 * in a serverless function's size or time budget.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

// Long edge cap — beyond this is wasted bytes for a portfolio.
const MAX_EDGE = 2400;
const WEBP_QUALITY = 82;

const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // post-compression safety net
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload too large for the server. Try a smaller file." },
      { status: 413 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  const type = file.type || "";
  const isImage = IMAGE_TYPES.includes(type);
  const isVideo = VIDEO_TYPES.includes(type);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: `Unsupported file type: ${type || "unknown"}` },
      { status: 415 }
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  const originalBytes = input.byteLength;

  try {
    if (isVideo) {
      if (originalBytes > MAX_VIDEO_BYTES) {
        return NextResponse.json(
          {
            error: `Video is ${(originalBytes / 1048576).toFixed(1)} MB — the limit is ${
              MAX_VIDEO_BYTES / 1048576
            } MB. Compress it before uploading.`,
          },
          { status: 413 }
        );
      }
      const ext = type === "video/webm" ? "webm" : "mp4";
      const saved = await saveMedia(input, safeName(file.name, ext), type);
      return NextResponse.json({
        ...saved,
        originalBytes,
        optimized: false,
        note: "Video stored as uploaded — server-side transcoding is not available.",
      });
    }

    if (originalBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large even after compression." },
        { status: 413 }
      );
    }

    const image = sharp(input, { animated: type === "image/gif" });
    const meta = await image.metadata();

    // Only ever scale down; `withoutEnlargement` keeps small sources sharp.
    const output = await image
      .rotate() // honour EXIF orientation before stripping it
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer();

    const saved = await saveMedia(
      output,
      safeName(file.name, "webp"),
      "image/webp"
    );

    return NextResponse.json({
      ...saved,
      originalBytes,
      optimized: true,
      width: meta.width ?? null,
      height: meta.height ?? null,
      saved: originalBytes > 0
        ? Math.round((1 - output.byteLength / originalBytes) * 100)
        : 0,
    });
  } catch (error) {
    console.error("[upload] failed", error);
    return NextResponse.json(
      { error: "Could not process this file." },
      { status: 500 }
    );
  }
}
