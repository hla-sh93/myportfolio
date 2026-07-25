import { EditArticleForm } from "@/components/features/EditArticleForm";
import { getStoredArticle } from "@/lib/content-store";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Article | Admin" };
export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getStoredArticle(id);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <header className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="rounded-lg p-2 transition-colors hover:bg-[var(--panel-hover)]"
          style={{ color: "var(--panel-muted)" }}
          aria-label="Back to articles"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{article.titleEn}</h1>
          <p
            className="mt-0.5 truncate text-sm"
            dir="rtl"
            style={{ color: "var(--panel-muted)" }}
          >
            {article.titleAr}
          </p>
        </div>
        {article.published && (
          <a
            href={`/ar/blog/${article.slug}`}
            target="_blank"
            rel="noreferrer"
            className="panel-btn panel-btn-ghost !py-1.5 text-xs"
          >
            <ExternalLink size={14} />
            View live
          </a>
        )}
      </header>

      <div className="panel-card p-5 md:p-6">
        <EditArticleForm
          articleId={article.id}
          initialData={{
            slug: article.slug,
            titleEn: article.titleEn,
            titleAr: article.titleAr,
            excerptEn: article.excerptEn,
            excerptAr: article.excerptAr,
            bodyEn: article.bodyEn,
            bodyAr: article.bodyAr,
            coverImage: article.coverImage,
            tags: article.tags.join(", "),
            readTime: String(article.readTime),
            published: article.published,
          }}
        />
      </div>
    </div>
  );
}
