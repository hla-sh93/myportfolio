import { getCounters } from "@/lib/counters";
import { getStoredArticles } from "@/lib/content-store";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ArticlesTable, type ArticleRow } from "./ArticlesTable";

export const metadata = { title: "Articles | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const [articles, counters] = await Promise.all([
    getStoredArticles(),
    getCounters("article"),
  ]);

  const rows: ArticleRow[] = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    titleEn: a.titleEn,
    titleAr: a.titleAr,
    tags: a.tags,
    readTime: a.readTime,
    published: a.published,
    publishedAt: a.publishedAt,
    views: counters[a.slug]?.views ?? 0,
  }));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Articles</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--panel-muted)" }}>
            {rows.filter((r) => r.published).length} published ·{" "}
            {rows.filter((r) => !r.published).length} in draft.
          </p>
        </div>
        <Link href="/admin/blog/new" className="panel-btn panel-btn-primary">
          <Plus size={16} />
          New article
        </Link>
      </header>

      <ArticlesTable rows={rows} />
    </div>
  );
}
