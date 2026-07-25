import { EditArticleForm } from "@/components/features/EditArticleForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "New Article | Admin" };

export default function NewArticlePage() {
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
        <div>
          <h1 className="text-xl font-bold">New article</h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--panel-muted)" }}>
            The body fields accept Markdown.
          </p>
        </div>
      </header>

      <div className="panel-card p-5 md:p-6">
        <EditArticleForm initialData={{}} />
      </div>
    </div>
  );
}
