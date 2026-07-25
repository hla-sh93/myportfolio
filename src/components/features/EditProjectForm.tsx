"use client";

import { MediaUpload } from "@/components/admin/MediaUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash } from "lucide-react";
import Image from "next/image";
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
  category: z.enum(["VIDEOS", "GRAPHIC_DESIGN", "UIUX", "WEBSITES"]),
  tags: z.string(),
  coverImage: z.string().min(1, "Required"),
  client: z.string(),
  role: z.string(),
  tools: z.string(),
  year: z.string(),
  featured: z.boolean(),
  published: z.boolean(),
  mediaUrls: z.string(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const textareaCls = "ad-field resize-y";
const labelCls = "mb-1.5 block text-xs font-semibold text-[var(--ad-muted)]";
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: "",
      titleEn: "",
      titleAr: "",
      descEn: "",
      descAr: "",
      category: "UIUX",
      tags: "",
      coverImage: "",
      client: "",
      role: "",
      tools: "",
      year: "",
      featured: false,
      published: true,
      mediaUrls: "",
      ...initialData,
    },
  });

  const cover = watch("coverImage");

  const onSubmit = async (data: ProjectFormData) => {
    setServerError("");
    try {
      await saveProjectAction({ ...data, id: projectId } as ProjectInput);
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
            <input dir="rtl" className="ad-field" {...register("titleAr")} />
            {errors.titleAr && <span className={errCls}>{errors.titleAr.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input className="ad-field" {...register("titleEn")} />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Slug</label>
            <input className="ad-field" placeholder="my-project" {...register("slug")} />
            {errors.slug && <span className={errCls}>{errors.slug.message}</span>}
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              {...register("category")}
              className="ad-field"
            >
              <option value="UIUX">UI/UX</option>
              <option value="WEBSITES">Websites</option>
              <option value="GRAPHIC_DESIGN">Graphic Design</option>
              <option value="VIDEOS">Videos</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Year</label>
            <input inputMode="numeric" className="ad-field" placeholder="2026" {...register("year")} />
          </div>
          <div>
            <label className={labelCls}>Client</label>
            <input className="ad-field" placeholder="Client name (optional)" {...register("client")} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <input className="ad-field" placeholder="UI/UX Designer" {...register("role")} />
          </div>
          <div>
            <label className={labelCls}>Tools (comma separated)</label>
            <input className="ad-field" placeholder="Figma, Photoshop" {...register("tools")} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input className="ad-field" placeholder="Web Design, RTL, Corporate" {...register("tags")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input className="ad-field" placeholder="/images/projects/my-project/mockup-1.webp" {...register("coverImage")} />
            {errors.coverImage && <span className={errCls}>{errors.coverImage.message}</span>}
            <div className="mt-2">
              <MediaUpload
                label="Upload cover"
                onUploaded={([url]) =>
                  url && setValue("coverImage", url, { shouldDirty: true })
                }
              />
            </div>
          </div>
          {cover && (
            <div className="relative h-28 w-40 overflow-hidden rounded-lg border border-[var(--ad-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary preview URL */}
              <img src={cover} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>
            Gallery media — one URL per line (.mp4 becomes a video)
          </label>
          <textarea
            {...register("mediaUrls")}
            rows={5}
            className={`${textareaCls} font-mono text-sm`}
            placeholder={"/images/projects/my-project/mockup-1.webp\n/images/projects/my-project/mockup-2.webp\n/videos/my-project/clip-1.mp4"}
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-[var(--ad-border)] pt-4">
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
          <button type="button" className="ad-btn ad-btn-danger" onClick={onDelete}>
            <Trash size={16} />
            Delete project
          </button>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-2">
          <Link href="/admin/projects" className="ad-btn ad-btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="ad-btn ad-btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Saving…" : projectId ? "Update project" : "Create project"}
          </button>
        </div>
      </div>
    </form>
  );
}
