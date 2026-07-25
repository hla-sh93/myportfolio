"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteProjectAction,
  toggleProjectAction,
} from "../../actions";

export function ProjectRowActions({
  id,
  title,
  published,
  featured,
}: {
  id: string;
  title: string;
  published: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const act = (fn: () => Promise<unknown>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className={`flex items-center gap-2 ${pending ? "opacity-50 pointer-events-none" : ""}`}>
      <button
        title={featured ? "Unfeature" : "Feature on home"}
        onClick={() => act(() => toggleProjectAction(id, "featured"))}
        className={`p-2 rounded-lg transition-colors ${featured ? "text-amber-500 bg-amber-500/10" : "text-text-secondary hover:bg-bg-elevated"}`}
      >
        <Star className={`w-4 h-4 ${featured ? "fill-current" : ""}`} />
      </button>
      <button
        title={published ? "Unpublish" : "Publish"}
        onClick={() => act(() => toggleProjectAction(id, "published"))}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
          published
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-bg-elevated text-text-secondary"
        }`}
      >
        {published ? "Published" : "Draft"}
      </button>
      <Link
        href={`/admin/projects/${id}`}
        title="Edit"
        className="p-2 rounded-lg text-text-secondary hover:bg-bg-elevated transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        title="Delete"
        onClick={() => {
          if (confirm(`Delete "${title}"? This cannot be undone.`))
            act(() => deleteProjectAction(id));
        }}
        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
