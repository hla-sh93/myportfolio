"use client";

import { compressImage, formatBytes } from "@/lib/compress-image";
import { Check, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

type Done = {
  url: string;
  bytes: number;
  originalBytes: number;
  optimized: boolean;
  saved?: number;
  note?: string;
};

/**
 * Drop a file, get back a public URL. Images are shrunk in the browser first
 * (see compressImage) so a 10 MB photo never has to travel anywhere.
 */
export function MediaUpload({
  onUploaded,
  multiple = false,
  label = "Upload image",
  accept = "image/*",
}: {
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<Done[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    const done: Done[] = [];

    try {
      const list = Array.from(files).slice(0, multiple ? 20 : 1);

      for (const [i, original] of list.entries()) {
        const isImage = original.type.startsWith("image/");
        setProgress(
          `${list.length > 1 ? `(${i + 1}/${list.length}) ` : ""}${
            isImage ? "Optimising" : "Preparing"
          } ${original.name}…`
        );

        const prepared = isImage
          ? await compressImage(original)
          : {
              file: original,
              originalBytes: original.size,
              bytes: original.size,
            };

        setProgress(
          `${list.length > 1 ? `(${i + 1}/${list.length}) ` : ""}Uploading ${formatBytes(
            prepared.bytes
          )}…`
        );

        const body = new FormData();
        body.append("file", prepared.file);

        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error ?? "Upload failed");
        }

        done.push({
          url: json.url,
          bytes: json.bytes,
          // report against the file the user actually picked
          originalBytes: prepared.originalBytes,
          optimized: json.optimized,
          saved:
            prepared.originalBytes > 0
              ? Math.round((1 - json.bytes / prepared.originalBytes) * 100)
              : 0,
          note: json.note,
        });
      }

      setResults(done);
      onUploaded(done.map((d) => d.url));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
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
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors"
        style={{
          borderColor: dragging ? "var(--accent)" : "var(--ad-border)",
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
            <p className="text-xs" style={{ color: "var(--ad-muted)" }}>
              {progress}
            </p>
          </>
        ) : (
          <>
            <Upload size={20} style={{ color: "var(--ad-faint)" }} />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs" style={{ color: "var(--ad-faint)" }}>
              Drop {multiple ? "files" : "a file"} here or click to browse —
              images are converted to WebP automatically
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
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

      {results.length > 0 && (
        <ul className="space-y-1">
          {results.map((r) => (
            <li
              key={r.url}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
              style={{ background: "var(--ad-hover)" }}
            >
              <Check size={14} style={{ color: "#28c76f" }} className="shrink-0" />
              <ImageIcon size={13} style={{ color: "var(--ad-faint)" }} />
              <span className="min-w-0 flex-1 truncate font-mono" dir="ltr">
                {r.url}
              </span>
              <span className="shrink-0" style={{ color: "var(--ad-muted)" }}>
                {formatBytes(r.originalBytes)} → {formatBytes(r.bytes)}
                {r.optimized && r.saved && r.saved > 0 ? (
                  <span style={{ color: "#28c76f" }}> −{r.saved}%</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      {results.some((r) => r.note) && (
        <p className="text-xs" style={{ color: "var(--ad-faint)" }}>
          {results.find((r) => r.note)?.note}
        </p>
      )}
    </div>
  );
}
