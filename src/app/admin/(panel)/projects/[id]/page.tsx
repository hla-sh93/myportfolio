import { EditProjectForm } from "@/components/features/EditProjectForm";
import { getStoredProject } from "@/lib/content-store";
import { ArrowLeft } from "lucide-react";
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
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{project.titleEn}</h1>
          <p className="text-text-secondary mt-1" dir="rtl">
            {project.titleAr}
          </p>
        </div>
      </header>
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
  );
}
