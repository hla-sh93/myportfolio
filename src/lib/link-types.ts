/**
 * Project links, shared by the panel and the public page.
 *
 * This lives apart from content-store because that module is server-only and
 * the panel's editor is a client component.
 */

/**
 * The kinds of address a delivered project can have. The type decides the
 * label and the icon, so "visit the site" never sits under a store link.
 */
export const LINK_TYPES = ["site", "play", "appstore", "behance", "youtube"] as const;
export type LinkType = (typeof LINK_TYPES)[number];
export type ProjectLink = { type: LinkType; url: string };

/** Anything stored before the column existed, or typed by hand, lands here. */
export function normaliseLinks(raw: unknown, legacy?: string | null): ProjectLink[] {
  const list = Array.isArray(raw) ? raw : [];
  const out: ProjectLink[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const { type, url } = item as Partial<ProjectLink>;
    if (typeof url !== "string" || !url.trim()) continue;
    out.push({
      type: LINK_TYPES.includes(type as LinkType) ? (type as LinkType) : "site",
      url: url.trim(),
    });
  }
  // A row written before the change still only has liveUrl.
  if (!out.length && legacy?.trim()) out.push({ type: "site", url: legacy.trim() });
  return out;
}
