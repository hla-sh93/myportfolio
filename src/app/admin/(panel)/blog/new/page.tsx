import { EditArticleForm } from "@/components/features/EditArticleForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "New Article | Admin" };

export default function NewArticlePage() {
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
          <h1 className="text-3xl font-bold text-text-primary">New Article</h1>
          <p className="text-text-secondary mt-1">
            Markdown supported in the content fields.
          </p>
        </div>
      </header>
      <EditArticleForm initialData={{}} />
    </div>
  );
}
