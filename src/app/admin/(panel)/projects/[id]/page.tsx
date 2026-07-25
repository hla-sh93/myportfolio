import { EditProjectForm } from "@/components/features/EditProjectForm";
import { getStoredProject } from "@/lib/content-store";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Project | Admin" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getStoredProject(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <header className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="rounded-lg p-2 transition-colors hover:bg-[var(--ad-hover)]"
          style={{ color: "var(--ad-muted)" }}
          aria-label="Back to projects"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{project.titleEn}</h1>
          <p
            className="mt-0.5 truncate text-sm"
            dir="rtl"
            style={{ color: "var(--ad-muted)" }}
          >
            {project.titleAr}
          </p>
        </div>
        {project.published && (
          <a
            href={`/ar/projects/detail/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="ad-btn ad-btn-ghost !py-1.5 text-xs"
          >
            <ExternalLink size={14} />
            View live
          </a>
        )}
      </header>

      <div className="ad-card p-5 md:p-6">
        <EditProjectForm
          projectId={project.id}
          initialData={{
            slug: project.slug,
            titleEn: project.titleEn,
            titleAr: project.titleAr,
            descEn: project.descEn,
            descAr: project.descAr,
            category: project.category,
            tags: project.tags.join(", "),
            coverImage: project.coverImage,
            client: project.client ?? "",
            role: project.role ?? "",
            tools: project.tools.join(", "),
            year: project.year ? String(project.year) : "",
            featured: project.featured,
            published: project.published,
            mediaUrls: project.media.map((m) => m.url).join("\n"),
          }}
        />
      </div>
    </div>
  );
}
