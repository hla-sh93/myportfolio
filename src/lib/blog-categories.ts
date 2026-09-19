/**
 * The content pillars — the first tag of every article.
 *
 * "Craft" carries the pieces about the profession itself: taste, judgement,
 * constraints, and what stays human as the tooling changes.
 *
 * The list and its Arabic labels live here rather than in the explorer,
 * because the filter chips and the tag printed on each card have to agree.
 * They did not: the chips read فرونت-إند while the cards underneath them
 * still said Front-End.
 */
export const BLOG_CATEGORIES = [
  "ALL",
  "UI/UX",
  "Front-End",
  "Graphic Design",
  "Product Design",
  "Craft",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

const LABEL_AR: Record<string, string> = {
  ALL: "الكل",
  // the abbreviation is read as-is in Arabic too; spelling it out helps nobody
  "UI/UX": "UI/UX",
  "Front-End": "فرونت-إند",
  "Graphic Design": "جرافيك",
  "Product Design": "تصميم منتج",
  Craft: "الصنعة",
};

/** A tag with no Arabic label is printed as it stands, never dropped. */
export function blogCategoryLabel(tag: string, locale: string) {
  if (locale === "ar") return LABEL_AR[tag] ?? tag;
  return tag === "ALL" ? "All" : tag;
}
