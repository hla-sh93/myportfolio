import { EditProjectForm } from "@/components/features/EditProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "New Project | Admin" };

export default function NewProjectPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">New Project</h1>
          <p className="text-text-secondary mt-1">
            Arabic first, English beside it — both are published together.
          </p>
        </div>
      </header>
      <EditProjectForm initialData={{}} />
    </div>
  );
}
