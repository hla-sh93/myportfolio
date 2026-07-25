import { EditProjectForm } from "@/components/features/EditProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "New Project | Admin" };

export default function NewProjectPage() {
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
        <div>
          <h1 className="text-xl font-bold">New project</h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--ad-muted)" }}>
            Fill both languages — they publish together.
          </p>
        </div>
      </header>

      <div className="ad-card p-5 md:p-6">
        <EditProjectForm initialData={{}} />
      </div>
    </div>
  );
}
