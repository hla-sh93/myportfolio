"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  deleteArticleAction,
  saveArticleAction,
  type ArticleInput,
} from "@/app/admin/actions";

const articleSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  titleEn: z.string().min(1, "Required"),
  titleAr: z.string().min(1, "Required"),
  excerptEn: z.string().min(1, "Required"),
  excerptAr: z.string().min(1, "Required"),
  bodyEn: z.string(),
  bodyAr: z.string(),
  coverImage: z.string(),
  tags: z.string(),
  readTime: z.string(),
  published: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

const textareaCls =
  "w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-y";

export function EditArticleForm({
  initialData,
  articleId,
}: {
  initialData: Partial<ArticleFormData>;
  articleId?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      slug: "",
      titleEn: "",
      titleAr: "",
      excerptEn: "",
      excerptAr: "",
      bodyEn: "",
      bodyAr: "",
      coverImage: "",
      tags: "",
      readTime: "5",
      published: true,
      ...initialData,
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    setServerError("");
    try {
      await saveArticleAction({ ...data, id: articleId } as ArticleInput);
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setServerError("Saving failed — are you still signed in?");
    }
  };

  const onDelete = async () => {
    if (!articleId) return;
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await deleteArticleAction(articleId);
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <GlassCard padding="lg" className="space-y-6">
        {serverError && (
          <p className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">{serverError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">العنوان (AR)</label>
            <Input {...register("titleAr")} error={errors.titleAr?.message} dir="rtl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Title (EN)</label>
            <Input {...register("titleEn")} error={errors.titleEn?.message} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">المقتطف (AR)</label>
            <textarea {...register("excerptAr")} dir="rtl" rows={2} className={textareaCls} />
            {errors.excerptAr && (
              <span className="text-xs text-red-500">{errors.excerptAr.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Excerpt (EN)</label>
            <textarea {...register("excerptEn")} rows={2} className={textareaCls} />
            {errors.excerptEn && (
              <span className="text-xs text-red-500">{errors.excerptEn.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              المحتوى (AR — Markdown)
            </label>
            <textarea
              {...register("bodyAr")}
              dir="rtl"
              rows={14}
              className={`${textareaCls} font-mono text-sm`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Content (EN — Markdown)
            </label>
            <textarea
              {...register("bodyEn")}
              rows={14}
              className={`${textareaCls} font-mono text-sm`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Slug</label>
            <Input {...register("slug")} error={errors.slug?.message} placeholder="my-article" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Read time (minutes)</label>
            <Input {...register("readTime")} inputMode="numeric" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Cover Image URL</label>
            <Input {...register("coverImage")} placeholder="/images/placeholder.jpg" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Tags (comma separated)</label>
          <Input {...register("tags")} placeholder="Design, RTL, Next.js" />
        </div>

        <label className="flex items-center gap-3 font-medium text-text-primary cursor-pointer select-none pt-4 border-t border-border">
          <input
            type="checkbox"
            {...register("published")}
            className="w-5 h-5 rounded border-border text-accent focus:ring-accent/50 bg-bg-elevated cursor-pointer"
          />
          Publish publicly
        </label>
      </GlassCard>

      <div className="flex justify-between gap-4">
        {articleId ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash className="w-5 h-5 mr-2" />
            Delete Article
          </Button>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-4">
          <Button asChild variant="ghost">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {articleId ? "Update Article" : "Create Article"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
