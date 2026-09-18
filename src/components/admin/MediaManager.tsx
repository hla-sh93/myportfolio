"use client";

import { compressImage, formatBytes } from "@/lib/compress-image";
import {
  ArrowLeft,
  ArrowRight,
  Film,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export type MediaEntry = {
  url: string;
  width?: number;
  height?: number;
  /** Only ever set for a freshly uploaded file; see api/upload. */
  blurDataUrl?: string;
};

const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url.split("?")[0]);

/**
 * The gallery editor for a project.
 *
 * One ordered list, one of whose entries is the cover — which is how the
 * pictures actually behave on the site, and what the old pair of text boxes
 * (a cover URL beside a textarea of gallery URLs) forced the editor to hold
 * in their head. Order here is the order the case study shows.
 */
export function MediaManager({
  items,
  cover,
  onChange,
}: {
  items: MediaEntry[];
  cover: string;
  onChange: (next: {
    items: MediaEntry[];
    cover: string;
    coverBlur?: string;
  }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [savings, setSavings] = useState("");
  const [dragging, setDragging] = useState(false);

  const coverInList = Boolean(cover) && items.some((m) => m.url === cover);

  /** Keeps the cover pointing at a picture that still exists. */
  const commit = (next: MediaEntry[], nextCover?: string, coverBlur?: string) => {
    const chosen = nextCover ?? cover;
    const survives = next.some((m) => m.url === chosen) || (chosen && !coverInList);
    onChange({
      items: next,
      cover: survives ? chosen : (next.find((m) => !isVideo(m.url))?.url ?? ""),
      coverBlur,
    });
  };

  const setCover = (m: MediaEntry) => commit(items, m.url, m.blurDataUrl);

  const remove = (url: string) => commit(items.filter((m) => m.url !== url));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    setSavings("");

    const added: MediaEntry[] = [];
    let before = 0;
    let after = 0;

    try {
      const list = Array.from(files).slice(0, 20);

      for (const [i, original] of list.entries()) {
        const step = list.length > 1 ? `(${i + 1}/${list.length}) ` : "";
        const image = original.type.startsWith("image/");
        setProgress(
          `${step}${image ? "Optimising" : "Preparing"} ${original.name}…`
        );

        const prepared = image
          ? await compressImage(original)
          : { file: original, originalBytes: original.size, bytes: original.size };

        setProgress(`${step}Uploading ${formatBytes(prepared.bytes)}…`);

        const body = new FormData();
        body.append("file", prepared.file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");

        before += prepared.originalBytes;
        after += json.bytes;
        added.push({
          url: json.url,
          width: json.width ?? undefined,
          height: json.height ?? undefined,
          blurDataUrl: json.blurDataUrl ?? undefined,
        });
      }

      const next = [...items, ...added];
      // The first picture a blank project receives becomes its cover; there is
      // no other sensible answer, and forgetting to pick one ships a placeholder.
      const first = added.find((m) => !isVideo(m.url));
      const claimCover = !cover && first;
      commit(
        next,
        claimCover ? first.url : undefined,
        claimCover ? first.blurDataUrl : undefined
      );

      if (before > 0) {
        setSavings(
          `${added.length} file${added.length > 1 ? "s" : ""} · ${formatBytes(
            before
          )} → ${formatBytes(after)} (−${Math.round((1 - after / before) * 100)}%)`
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !busy && inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-7 text-center transition-colors"
        style={{
          borderColor: dragging ? "var(--accent)" : "var(--panel-border)",
          background: dragging ? "var(--accent-light)" : "transparent",
        }}
      >
        {busy ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: "var(--accent)" }}
            />
            <p className="text-xs" style={{ color: "var(--panel-muted)" }}>
              {progress}
            </p>
          </>
        ) : (
          <>
            <ImagePlus size={22} style={{ color: "var(--panel-faint)" }} />
            <p className="text-sm font-medium">Add images or video</p>
            <p className="text-xs" style={{ color: "var(--panel-faint)" }}>
              Drop up to 20 files or click to browse — images are resized to
              2400px and turned into WebP before they leave your computer
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p
          className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ background: "rgba(234,84,85,.1)", color: "#ea5455" }}
        >
          <X size={14} className="mt-px shrink-0" />
          {error}
        </p>
      )}

      {savings && <p className="text-xs" style={{ color: "#28c76f" }}>{savings}</p>}

      {/* A cover from before the gallery existed — surfaced so it cannot go missing. */}
      {cover && !coverInList && (
        <div
          className="flex items-center gap-3 rounded-lg p-2"
          style={{ background: "var(--panel-hover)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary stored URL */}
          <img src={cover} alt="" className="h-12 w-16 rounded object-cover" />
          <span
            className="min-w-0 flex-1 truncate text-xs"
            style={{ color: "var(--panel-muted)" }}
          >
            Current cover, not part of the gallery
          </span>
          <button
            type="button"
            className="panel-btn panel-btn-ghost !py-1 text-xs"
            onClick={() => commit([{ url: cover }, ...items], cover)}
          >
            Add to gallery
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--panel-faint)" }}>
          No gallery media yet.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((m, i) => {
              const cur = m.url === cover;
              const video = isVideo(m.url);
              return (
                <li
                  key={m.url}
                  className="overflow-hidden rounded-xl border"
                  style={{
                    borderColor: cur ? "var(--accent)" : "var(--panel-border)",
                  }}
                >
                  <div className="relative aspect-[4/3] bg-[var(--panel-hover)]">
                    {video ? (
                      <span
                        className="flex h-full w-full items-center justify-center"
                        style={{ color: "var(--panel-faint)" }}
                      >
                        <Film size={26} />
                      </span>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element -- arbitrary stored URL */
                      <img
                        src={m.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}

                    {cur && (
                      <span
                        className="absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ background: "var(--accent)" }}
                      >
                        <Star size={10} fill="currentColor" />
                        Cover
                      </span>
                    )}
                  </div>

                  <div
                    className="flex items-center gap-0.5 border-t p-1"
                    style={{ borderColor: "var(--panel-border)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setCover(m)}
                      disabled={cur || video}
                      title={
                        video ? "A video cannot be the cover" : "Make this the cover"
                      }
                      aria-label="Make this the cover"
                      className="panel-icon-btn disabled:opacity-30"
                      style={cur ? { color: "var(--accent)" } : undefined}
                    >
                      <Star size={14} fill={cur ? "currentColor" : "none"} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      aria-label="Move earlier"
                      className="panel-icon-btn disabled:opacity-30"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === items.length - 1}
                      aria-label="Move later"
                      className="panel-icon-btn disabled:opacity-30"
                    >
                      <ArrowRight size={14} />
                    </button>
                    <span className="flex-1" />
                    <button
                      type="button"
                      onClick={() => remove(m.url)}
                      aria-label="Remove from gallery"
                      className="panel-icon-btn"
                      style={{ color: "#ea5455" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-xs" style={{ color: "var(--panel-faint)" }}>
            {items.length} item{items.length > 1 ? "s" : ""} — the star picks the
            cover, the arrows set the order the case study shows them in. Removing
            one here leaves the uploaded file untouched.
          </p>
        </>
      )}
    </div>
  );
}
