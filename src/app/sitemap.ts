import type { MetadataRoute } from "next";
import { getPublicProjects, getPublicArticles } from "@/lib/content";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const LOCALES = ["ar", "en"] as const;

/** One entry per (locale, path) with hreflang alternates — Arabic is the
 *  primary audience, so /ar is also the x-default. */
function entry(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified,
    priority,
    changeFrequency,
    alternates: {
      languages: {
        ar: `${BASE}/ar${path}`,
        en: `${BASE}/en${path}`,
        "x-default": `${BASE}/ar${path}`,
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await getPublicProjects();
  const articles = await getPublicArticles();

  return [
    ...entry("", now, 1, "weekly"),
    ...entry("/projects", now, 0.9, "weekly"),
    ...entry("/about", now, 0.8, "monthly"),
    ...entry("/blog", now, 0.8, "weekly"),
    ...entry("/contact", now, 0.7, "yearly"),
    ...projects.flatMap((p) =>
      entry(`/projects/detail/${p.slug}`, new Date(p.publishedAt), 0.8, "monthly")
    ),
    ...articles.flatMap((a) =>
      entry(`/blog/${a.slug}`, new Date(a.publishedAt), 0.7, "monthly")
    ),
  ];
}
