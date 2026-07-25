import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getCounters } from "@/lib/counters";
import { getStoredProjects } from "@/lib/content-store";
import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectRowActions } from "./ProjectRowActions";

export const metadata = { title: "Projects | Admin" };
export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  UIUX: "UI/UX",
  WEBSITES: "Websites",
  GRAPHIC_DESIGN: "Graphic Design",
  VIDEOS: "Videos",
};

export default async function AdminProjectsPage() {
  const projects = await getStoredProjects();
  const counters = await getCounters("project");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-2">
            {projects.length} projects · add, edit, publish, feature, delete.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/projects/new">
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Link>
        </Button>
      </header>

      <GlassCard padding="sm">
        <ul className="divide-y divide-border">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-4 px-3 py-3">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
                <Image
                  src={p.coverImage}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">
                  {p.titleEn}
                  <span className="text-text-secondary font-normal text-sm mx-2" dir="rtl">
                    {p.titleAr}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{CATEGORY_LABEL[p.category]}</Badge>
                  <span className="text-xs text-text-secondary">/{p.slug}</span>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {counters[p.slug]?.likes ?? 0}
                  </span>
                </div>
              </div>
              <ProjectRowActions
                id={p.id}
                title={p.titleEn}
                published={p.published}
                featured={p.featured}
              />
            </li>
          ))}
          {projects.length === 0 && (
            <li className="px-3 py-12 text-center text-text-secondary">
              No projects yet — create the first one.
            </li>
          )}
        </ul>
      </GlassCard>
    </div>
  );
}
