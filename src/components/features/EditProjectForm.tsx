"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
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

const textareaCls =
  "w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-y";

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
      <GlassCard padding="lg" className="space-y-6">
        {serverError && (
          <p className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">{serverError}</p>
        )}

        {/* Titles — AR first, side by side (bilingual editing rule) */}
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
            <label className="text-sm font-medium text-text-secondary">الوصف (AR)</label>
            <textarea {...register("descAr")} dir="rtl" rows={5} className={textareaCls} />
            {errors.descAr && <span className="text-xs text-red-500">{errors.descAr.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Description (EN)</label>
            <textarea {...register("descEn")} rows={5} className={textareaCls} />
            {errors.descEn && <span className="text-xs text-red-500">{errors.descEn.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Slug</label>
            <Input {...register("slug")} error={errors.slug?.message} placeholder="my-project" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Category</label>
            <select
              {...register("category")}
              className="w-full h-11 px-4 bg-bg-elevated border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            >
              <option value="UIUX">UI/UX</option>
              <option value="WEBSITES">Websites</option>
              <option value="GRAPHIC_DESIGN">Graphic Design</option>
              <option value="VIDEOS">Videos</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Year</label>
            <Input {...register("year")} placeholder="2026" inputMode="numeric" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Client</label>
            <Input {...register("client")} placeholder="Client name (optional)" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Role</label>
            <Input {...register("role")} placeholder="UI/UX Designer" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Tools (comma separated)</label>
            <Input {...register("tools")} placeholder="Figma, Photoshop" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Tags (comma separated)</label>
          <Input {...register("tags")} placeholder="Web Design, RTL, Corporate" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Cover Image URL</label>
            <Input
              {...register("coverImage")}
              error={errors.coverImage?.message}
              placeholder="/images/projects/my-project/mockup-1.webp"
            />
            <p className="text-xs text-text-secondary">
              Put files under <code>public/images/projects/&lt;slug&gt;/</code> and reference them as{" "}
              <code>/images/projects/&lt;slug&gt;/file.webp</code>.
            </p>
          </div>
          {cover && (
            <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-border bg-bg-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary preview URL */}
              <img src={cover} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Gallery media — one URL per line (.mp4 becomes a video)
          </label>
          <textarea
            {...register("mediaUrls")}
            rows={5}
            className={`${textareaCls} font-mono text-sm`}
            placeholder={"/images/projects/my-project/mockup-1.webp\n/images/projects/my-project/mockup-2.webp\n/videos/my-project/clip-1.mp4"}
          />
        </div>

        <div className="flex items-center gap-8 pt-4 border-t border-border">
          <label className="flex items-center gap-3 font-medium text-text-primary cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("published")}
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent/50 bg-bg-elevated cursor-pointer"
            />
            Publish publicly
          </label>
          <label className="flex items-center gap-3 font-medium text-text-primary cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("featured")}
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent/50 bg-bg-elevated cursor-pointer"
            />
            Featured on home (max 4 shown)
          </label>
        </div>
      </GlassCard>

      <div className="flex justify-between gap-4">
        {projectId ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash className="w-5 h-5 mr-2" />
            Delete Project
          </Button>
        ) : (
          <span />
        )}
        <div className="flex justify-end gap-4">
          <Button asChild variant="ghost">
            <Link href="/admin/projects">Cancel</Link>
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {projectId ? "Update Project" : "Create Project"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
