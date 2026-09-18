"use client";

import { MediaManager, type MediaEntry } from "@/components/admin/MediaManager";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  deleteProjectAction,
  saveProjectAction,
  type ProjectInput,
} from "@/app/admin/actions";

const projectSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  titleEn: z.string().min(1, "Required"),
  titleAr: z.string().min(1, "Required"),
  descEn: z.string().min(1, "Required"),
  descAr: z.string().min(1, "Required"),
  // The case study under the summary. Markdown, and optional — a project can
  // ship with a summary alone and gain its detail later.
  bodyEn: z.string(),
  bodyAr: z.string(),
  category: z.enum(["VIDEOS", "GRAPHIC_DESIGN", "UIUX", "WEBSITES"]),
  tags: z.string(),
  coverImage: z.string().min(1, "Required"),
  client: z.string(),
  role: z.string(),
  liveUrl: z.string(),
  tools: z.string(),
  year: z.string(),
  featured: z.boolean(),
  published: z.boolean(),
  mediaUrls: z.string(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const textareaCls = "panel-field resize-y";
const labelCls = "mb-1.5 block text-xs font-semibold text-[var(--panel-muted)]";
const errCls = "mt-1 block text-xs text-[#ea5455]";

export function EditProjectForm({
  initialData,
  projectId,
}: {
  initialData: Partial<ProjectFormData>;
  projectId?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  // What an upload learned about a file. The form itself only carries URLs, so
  // these ride alongside until save, where they spare the site a second pass
  // over every picture just to find out how tall it is.
  const [meta, setMeta] = useState<
    Record<string, { width: number; height: number; blurDataUrl?: string }>
  >({});
  const [coverBlur, setCoverBlur] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: "",
      titleEn: "",
      titleAr: "",
      descEn: "",
      descAr: "",
      bodyEn: "",
      bodyAr: "",
      category: "UIUX",
      tags: "",
      coverImage: "",
      client: "",
      role: "",
      liveUrl: "",
      tools: "",
      year: "",
      featured: false,
      published: true,
      mediaUrls: "",
      ...initialData,
    },
  });

  const cover = watch("coverImage");
  const mediaUrls = watch("mediaUrls");

  const mediaItems: MediaEntry[] = mediaUrls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean)
    .map((url) => ({ url, ...meta[url] }));

  const onSubmit = async (data: ProjectFormData) => {
    setServerError("");
    try {
      await saveProjectAction({
        ...data,
        id: projectId,
        mediaMeta: meta,
        coverBlurDataUrl: coverBlur,
      } as ProjectInput);
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setServerError("Saving failed — are you still signed in?");
    }
  };

  const onDelete = async () => {
    if (!projectId) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProjectAction(projectId);
    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        {serverError && (
          <p className="rounded-lg px-3 py-2.5 text-sm text-[#ea5455]" style={{ background: "rgba(234,84,85,.1)" }}>{serverError}</p>
        )}

        {/* Titles — AR first, side by side (bilingual editing rule) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>العنوان (AR)</label>
            <input dir="rtl" className="panel-field" {...register("titleAr")} />
            {errors.titleAr && <span className={errCls}>{errors.titleAr.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input className="panel-field" {...register("titleEn")} />
            {errors.titleEn && <span className={errCls}>{errors.titleEn.message}</span>}
          </div>
          <div>
            <label className={labelCls}>الوصف (AR)</label>
            <textarea {...register("descAr")} dir="rtl" rows={5} className={textareaCls} />
            {errors.descAr && <span className="text-xs text-red-500">{errors.descAr.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Description (EN)</label>
            <textarea {...register("descEn")} rows={5} className={textareaCls} />
            {errors.descEn && <span className="text-xs text-red-500">{errors.descEn.message}</span>}
          </div>
          <div>
            <label className={labelCls}>
              تفاصيل العمل (AR) — Markdown
            </label>
            <textarea {...register("bodyAr")} dir="rtl" rows={14} className={textareaCls} />
            <span className="mt-1 block text-xs text-[var(--panel-muted)]">
              ‏## عنوان، و- نقطة، و**عريض**. القسم يختفي إذا تُرك فارغًا.
            </span>
          </div>
          <div>
            <label className={labelCls}>Case study (EN) — Markdown</label>
            <textarea {...register("bodyEn")} rows={14} className={textareaCls} />
            <span className="mt-1 block text-xs text-[var(--panel-muted)]">
              ## heading, - bullet, **bold**. The section is hidden when empty.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Slug</label>
            <input className="panel-field" placeholder="my-project" {...register("slug")} />
            {errors.slug && <span className={errCls}>{errors.slug.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              {...register("category")}
              className="panel-field"
            >
              <option value="UIUX">UI/UX</option>
              <option value="WEBSITES">Websites</option>
              <option value="GRAPHIC_DESIGN">Graphic Design</option>
              <option value="VIDEOS">Videos</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Year</label>
            <input inputMode="numeric" className="panel-field" placeholder="2026" {...register("year")} />
          </div>
          <div>
            <label className={labelCls}>Client</label>
            <input className="panel-field" placeholder="Client name (optional)" {...register("client")} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <input className="panel-field" placeholder="UI/UX Designer" {...register("role")} />
          </div>
          <div>
            <label className={labelCls}>Tools (comma separated)</label>
            <input className="panel-field" placeholder="Figma, Photoshop" {...register("tools")} />
          </div>
          <div>
            <label className={labelCls}>Live URL</label>
            <input
              type="url"
              dir="ltr"
              className="panel-field"
              placeholder="https://example.com (optional)"
              {...register("liveUrl")}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input className="panel-field" placeholder="Web Design, RTL, Corporate" {...register("tags")} />
        </div>

        <div>
          <label className={labelCls}>Pictures</label>
          <MediaManager
            items={mediaItems}
            cover={cover}
            onChange={({ items, cover: nextCover, coverBlur }) => {
              setValue("mediaUrls", items.map((m) => m.url).join("\n"), {
                shouldDirty: true,
              });
              setValue("coverImage", nextCover, { shouldDirty: true });
              if (coverBlur !== undefined) setCoverBlur(coverBlur);
              // Dimensions and placeholders only ever arrive with an upload, so
              // merge rather than replace: reordering must not forget them.
              setMeta((prev) => {
                const next = { ...prev };
                for (const m of items) {
                  if (m.width && m.height) {
                    next[m.url] = {
                      width: m.width,
                      height: m.height,
                      blurDataUrl: m.blurDataUrl,
                    };
                  }
                }
                return next;
              });
            }}
          />
          {errors.coverImage && (
            <span className={errCls}>Add at least one picture — it becomes the cover.</span>
          )}

          <details className="mt-3">
            <summary
              className="cursor-pointer text-xs"
              style={{ color: "var(--panel-muted)" }}
            >
              Edit the URLs as text
            </summary>
            <textarea
              {...register("mediaUrls")}
              rows={5}
              className={`${textareaCls} mt-2 font-mono text-sm`}
              placeholder={"/images/projects/my-project/mockup-1.webp\n/images/projects/my-project/mockup-2.webp\n/videos/my-project/clip-1.mp4"}
            />
            <label className={`${labelCls} mt-3`}>Cover URL</label>
            <input
              className="panel-field font-mono text-sm"
              dir="ltr"
              {...register("coverImage")}
            />
          </details>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-[var(--panel-border)] pt-4">
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              {...register("published")}
              className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            Publish publicly
          </label>
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            Featured on home (max 4 shown)
          </label>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        {projectId ? (
          <button type="button" className="panel-btn panel-btn-danger" onClick={onDelete}>
            <Trash size={16} />
            Delete project
          </button>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-2">
          <Link href="/admin/projects" className="panel-btn panel-btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="panel-btn panel-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Saving…" : projectId ? "Update project" : "Create project"}
          </button>
        </div>
      </div>
    </form>
  );
}
