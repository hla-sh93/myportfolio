"use client";

import { MediaUpload } from "@/components/admin/MediaUpload";
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

const textareaCls = "ad-field resize-y";
const labelCls = "mb-1.5 block text-xs font-semibold text-[var(--ad-muted)]";
const errCls = "mt-1 block text-xs text-[#ea5455]";

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
    setValue,
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
      <div className="space-y-6">
        {serverError && (
          <p className="rounded-lg px-3 py-2.5 text-sm text-[#ea5455]" style={{ background: "rgba(234,84,85,.1)" }}>{serverError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>العنوان (AR)</label>
            <input dir="rtl" className="ad-field" {...register("titleAr")} />
            {errors.titleAr && <span className={errCls}>{errors.titleAr.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input className="ad-field" {...register("titleEn")} />
            {errors.titleEn && <span className={errCls}>{errors.titleEn.message}</span>}
          </div>
          <div>
            <label className={labelCls}>المقتطف (AR)</label>
            <textarea {...register("excerptAr")} dir="rtl" rows={2} className={textareaCls} />
            {errors.excerptAr && (
              <span className="text-xs text-red-500">{errors.excerptAr.message}</span>
            )}
          </div>
          <div>
            <label className={labelCls}>Excerpt (EN)</label>
            <textarea {...register("excerptEn")} rows={2} className={textareaCls} />
            {errors.excerptEn && (
              <span className="text-xs text-red-500">{errors.excerptEn.message}</span>
            )}
          </div>
          <div>
            <label className={labelCls}>
              المحتوى (AR — Markdown)
            </label>
            <textarea
              {...register("bodyAr")}
              dir="rtl"
              rows={14}
              className={`${textareaCls} font-mono text-sm`}
            />
          </div>
          <div>
            <label className={labelCls}>
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
          <div>
            <label className={labelCls}>Slug</label>
            <input className="ad-field" placeholder="my-article" {...register("slug")} />
            {errors.slug && <span className={errCls}>{errors.slug.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Read time (minutes)</label>
            <input inputMode="numeric" className="ad-field" {...register("readTime")} />
          </div>
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input className="ad-field" placeholder="/images/placeholder.jpg" {...register("coverImage")} />
            <div className="mt-2">
              <MediaUpload
                label="Upload cover"
                onUploaded={([url]) =>
                  url && setValue("coverImage", url, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input className="ad-field" placeholder="Design, RTL, Next.js" {...register("tags")} />
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2.5 border-t border-[var(--ad-border)] pt-4 text-sm font-medium">
          <input
            type="checkbox"
            {...register("published")}
            className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
          />
          Publish publicly
        </label>
      </div>

      <div className="flex justify-between gap-4">
        {articleId ? (
          <button type="button" className="ad-btn ad-btn-danger" onClick={onDelete}>
            <Trash size={16} />
            Delete article
          </button>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-2">
          <Link href="/admin/blog" className="ad-btn ad-btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="ad-btn ad-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Saving…" : articleId ? "Update article" : "Create article"}
          </button>
        </div>
      </div>
    </form>
  );
}
