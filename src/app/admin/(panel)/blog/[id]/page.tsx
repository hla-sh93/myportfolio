import { EditArticleForm } from "@/components/features/EditArticleForm";
import { getStoredArticle } from "@/lib/content-store";
import { ArrowLeft } from "lucide-react";
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
  const article = getStoredArticle(id);
  if (!article) notFound();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 rounded-lg text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{article.titleEn}</h1>
          <p className="text-text-secondary mt-1" dir="rtl">
            {article.titleAr}
          </p>
        </div>
      </header>
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
  );
}
