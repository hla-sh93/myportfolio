import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import collections from "@/content/collections.json";

/**
 * The wall of delivered sites for a collection project.
 *
 * Some projects are a family rather than a single piece — one information
 * architecture built out as a dozen separate national portals. Ten near-
 * identical cards in the main grid would bury the rest of the portfolio, so
 * the family lives inside one case study and this is where you actually see
 * it: every site, its own screenshot, its own link.
 *
 * A site that has gone offline keeps its card and loses its link — the work
 * still happened, and a dead link is worse than no link.
 */

type Site = {
  key: string;
  nameEn: string;
  nameAr: string;
  url: string;
  image: string;
  live: boolean;
  year?: number;
};

const wall = collections as unknown as Record<string, Site[] | undefined>;

export function getCollection(slug: string): Site[] | undefined {
  const entry = wall[slug];
  return Array.isArray(entry) ? entry : undefined;
}

export function SiteWall({ slug, isRtl }: { slug: string; isRtl: boolean }) {
  const sites = getCollection(slug);
  if (!sites?.length) return null;

  return (
    <section className="mt-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="title-display font-display text-2xl md:text-3xl">
          {isRtl ? "المواقع المنشورة" : "The delivered sites"}
          <span>.</span>
        </h2>
        <span className="text-sm font-semibold text-text-tertiary">
          {isRtl ? `${sites.length} موقع` : `${sites.length} sites`}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => {
          const name = isRtl ? site.nameAr : site.nameEn;
          const host = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

          const body = (
            <>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-border bg-surface">
                <Image
                  src={site.image}
                  alt={name}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
                <h3 className="line-clamp-2 min-h-[3rem] font-display text-base font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-accent">
                  {name}
                </h3>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      dir="ltr"
                      className="truncate font-mono text-xs text-text-tertiary"
                    >
                      {host}
                    </span>
                    {site.year && (
                      <span className="meta-mono shrink-0 text-xs text-text-tertiary">
                        {site.year}
                      </span>
                    )}
                  </span>
                  {site.live ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-text-secondary transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white rtl:-scale-x-100">
                      <ArrowUpRight size={15} />
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
                      {isRtl ? "غير متاح" : "offline"}
                    </span>
                  )}
                </div>
              </div>
            </>
          );

          return (
            <li key={site.key} className="h-full">
              {site.live ? (
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="card-line flex h-full flex-col p-3">{body}</div>
                </a>
              ) : (
                <div className="card-line card-line-static flex h-full flex-col p-3 opacity-75">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
