import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getCounters } from "@/lib/counters";
import { getStoredArticles } from "@/lib/content-store";
import { Clock, Eye, Pencil, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Articles | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const articles = await getStoredArticles();
  const counters = await getCounters("article");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Articles</h1>
          <p className="text-text-secondary mt-2">
            {articles.length} articles · write in Arabic first, mirror in English.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/blog/new">
            <Plus className="w-5 h-5 mr-2" />
            New Article
          </Link>
        </Button>
      </header>

      <GlassCard padding="sm">
        <ul className="divide-y divide-border">
          {articles.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">
                  {a.titleEn}
                  <span className="text-text-secondary font-normal text-sm mx-2" dir="rtl">
                    {a.titleAr}
                  </span>
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                  <span>/{a.slug}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {a.readTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {counters[a.slug]?.views ?? 0}
                  </span>
                  {a.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  a.published
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-bg-elevated text-text-secondary"
                }`}
              >
                {a.published ? "Published" : "Draft"}
              </span>
              <Link
                href={`/admin/blog/${a.id}`}
                className="p-2 rounded-lg text-text-secondary hover:bg-bg-elevated transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            </li>
          ))}
          {articles.length === 0 && (
            <li className="px-3 py-12 text-center text-text-secondary">
              No articles yet — write the first one.
            </li>
          )}
        </ul>
      </GlassCard>
    </div>
  );
}
