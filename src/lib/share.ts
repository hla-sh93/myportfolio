import shareCards from "@/content/share-cards.json";
import pageCards from "@/content/share-cards-pages.json";

/**
 * The image a social platform shows when a page is shared.
 *
 * Two kinds, both pre-built and served as static files:
 *
 *  - Projects and articles share a card made from their own cover artwork.
 *    `scripts/build-share-cards.mjs` letterboxes each cover onto the brand
 *    ground at a true 1200×630 — the ratio Facebook, LinkedIn, WhatsApp and X
 *    actually render. Handing them the raw 4:3 cover meant a blind centre crop
 *    that sliced about a third off every mockup board. The point is the one a
 *    shop makes: the preview shows the thing, not a house logo.
 *
 *  - Pages with no artwork of their own — home, about, projects, blog,
 *    contact — share a branded title card built by
 *    `scripts/build-page-share-cards.mjs`.
 *
 * Nothing is rendered at request time. The /api/og route remains only as a
 * fallback for a slug added in the admin since the last card build, and it
 * deliberately carries no title: it renders through Satori, which does not
 * shape Arabic and would preview "نبذة عني" as "ةذبن ينع".
 */

const WORK_CARDS = new Set(shareCards as string[]);
const PAGE_CARDS = new Set(pageCards as string[]);

export interface ShareImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

const card = (name: string, alt: string): ShareImage => ({
  url: `/images/share/${name}.jpg`,
  width: 1200,
  height: 630,
  alt,
});

const fallback = (alt: string, type: string): ShareImage => ({
  url: `/api/og?type=${type}`,
  width: 1200,
  height: 630,
  alt,
});

/** Share card for a project or an article. */
export function shareImage(
  kind: "project" | "article",
  slug: string,
  title: string,
): ShareImage {
  const key = `${kind}-${slug}`;
  return WORK_CARDS.has(key) ? card(key, title) : fallback(title, kind);
}

/** Share card for a page that has no artwork of its own. */
export function pageShareImage(
  locale: string,
  key: "home" | "projects" | "blog" | "about" | "contact",
  title: string,
): ShareImage {
  const name = `page-${locale}-${key}`;
  return PAGE_CARDS.has(name) ? card(name, title) : fallback(title, "page");
}
