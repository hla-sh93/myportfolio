"use client";

import { LINK_TYPES, type LinkType } from "@/lib/link-types";
import { Plus, Trash2 } from "lucide-react";

/** How each kind is named in the panel. The public labels are translated. */
const LABEL: Record<LinkType, string> = {
  site: "Website",
  play: "Google Play",
  appstore: "App Store",
  behance: "Behance",
  youtube: "YouTube",
};

const PLACEHOLDER: Record<LinkType, string> = {
  site: "https://example.com",
  play: "https://play.google.com/store/apps/details?id=…",
  appstore: "https://apps.apple.com/app/id…",
  behance: "https://www.behance.net/gallery/…",
  youtube: "https://www.youtube.com/watch?v=…",
};

export type LinkRow = { type: LinkType; url: string };

/**
 * Where a project can be visited. A project often has more than one address —
 * Zanqa is a website and a Play Store listing — and the type is what lets the
 * public page label each button correctly instead of saying "visit the site"
 * over a store link.
 */
export function LinksEditor({
  value,
  onChange,
}: {
  value: LinkRow[];
  onChange: (next: LinkRow[]) => void;
}) {
  const set = (i: number, patch: Partial<LinkRow>) =>
    onChange(value.map((row, n) => (n === i ? { ...row, ...patch } : row)));

  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <select
            className="panel-field !w-auto shrink-0"
            value={row.type}
            onChange={(e) => set(i, { type: e.target.value as LinkType })}
          >
            {LINK_TYPES.map((t) => (
              <option key={t} value={t}>
                {LABEL[t]}
              </option>
            ))}
          </select>
          <input
            type="url"
            dir="ltr"
            className="panel-field font-mono text-sm"
            placeholder={PLACEHOLDER[row.type]}
            value={row.url}
            onChange={(e) => set(i, { url: e.target.value })}
          />
          <button
            type="button"
            className="panel-icon-btn shrink-0"
            style={{ color: "#ea5455" }}
            aria-label="Remove this link"
            onClick={() => onChange(value.filter((_, n) => n !== i))}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        className="panel-btn panel-btn-ghost !py-1.5 text-xs"
        onClick={() => onChange([...value, { type: "site", url: "" }])}
      >
        <Plus size={14} />
        Add a link
      </button>

      {value.length === 0 && (
        <p className="text-xs" style={{ color: "var(--panel-faint)" }}>
          No links yet. A project with nothing to visit simply shows no button.
        </p>
      )}
    </div>
  );
}
