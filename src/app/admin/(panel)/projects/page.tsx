import { getCounters } from "@/lib/counters";
import { getStoredProjects } from "@/lib/content-store";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProjectsTable, type ProjectRow } from "./ProjectsTable";
import { SyncContentButton } from "./SyncContentButton";

export const metadata = { title: "Projects | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, counters] = await Promise.all([
    getStoredProjects(),
    getCounters("project"),
  ]);

  const rows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    titleAr: p.titleAr,
    category: p.category,
    year: p.year,
    coverImage: p.coverImage,
    published: p.published,
    featured: p.featured,
    views: counters[p.slug]?.views ?? 0,
    likes: counters[p.slug]?.likes ?? 0,
  }));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Projects</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--panel-muted)" }}>
            {rows.filter((r) => r.published).length} published ·{" "}
            {rows.filter((r) => r.featured).length} featured on the home page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SyncContentButton />
          <Link href="/admin/projects/new" className="panel-btn panel-btn-primary">
            <Plus size={16} />
            New project
          </Link>
        </div>
      </header>

      <ProjectsTable rows={rows} />
    </div>
  );
}
