"use client";

import { deleteProjectAction, toggleProjectAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { ArrowUpDown, Eye, Heart, Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export type ProjectRow = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  category: string;
  year: number | null;
  coverImage: string;
  published: boolean;
  featured: boolean;
  views: number;
  likes: number;
};

const CATEGORY_LABEL: Record<string, string> = {
  UIUX: "UI/UX",
  WEBSITES: "Websites",
  GRAPHIC_DESIGN: "Graphic Design",
  VIDEOS: "Videos",
};

type SortKey = "title" | "year" | "views" | "likes";
const PER_PAGE = 12;

export function ProjectsTable({ rows }: { rows: ProjectRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, start] = useTransition();

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("year");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (status === "published" && !r.published) return false;
      if (status === "draft" && r.published) return false;
      if (status === "featured" && !r.featured) return false;
      if (!q) return true;
      return (
        r.titleEn.toLowerCase().includes(q) ||
        r.titleAr.includes(query.trim()) ||
        r.slug.includes(q)
      );
    });

    out.sort((a, b) => {
      let d = 0;
      if (sort === "title") d = a.titleEn.localeCompare(b.titleEn);
      else if (sort === "year") d = (a.year ?? 0) - (b.year ?? 0);
      else if (sort === "views") d = a.views - b.views;
      else d = a.likes - b.likes;
      return asc ? d : -d;
    });
    return out;
  }, [rows, query, cat, status, sort, asc]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const act = (fn: () => Promise<unknown>, msg: string) =>
    start(async () => {
      await fn();
      toast({ title: msg, variant: "success" });
      router.refresh();
    });

  const th = (key: SortKey, label: string, extra = "") => (
    <th className={extra}>
      <button
        className="inline-flex items-center gap-1 uppercase hover:opacity-70"
        onClick={() => {
          if (sort === key) setAsc(!asc);
          else {
            setSort(key);
            setAsc(false);
          }
        }}
      >
        {label}
        <ArrowUpDown size={11} className={sort === key ? "" : "opacity-30"} />
      </button>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="panel-field max-w-xs"
          placeholder="Search title or slug…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="panel-field max-w-[170px]"
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          className="panel-field max-w-[150px]"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="featured">Featured</option>
        </select>
        <span className="text-sm" style={{ color: "var(--panel-muted)" }}>
          {filtered.length} of {rows.length}
        </span>
      </div>

      <div className={`panel-card overflow-hidden ${pending ? "opacity-60" : ""}`}>
        {slice.length === 0 ? (
          <p
            className="px-5 py-14 text-center text-sm"
            style={{ color: "var(--panel-muted)" }}
          >
            {rows.length === 0
              ? "No projects yet — create the first one."
              : "Nothing matches these filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="panel-table">
              <thead>
                <tr>
                  <th className="w-16">Cover</th>
                  {th("title", "Project")}
                  <th className="w-36">Category</th>
                  {th("year", "Year", "w-20 text-end")}
                  {th("views", "Views", "w-24 text-end")}
                  {th("likes", "Likes", "w-20 text-end")}
                  <th className="w-28">Status</th>
                  <th className="w-32 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span
                        className="relative block h-9 w-12 overflow-hidden rounded"
                        style={{ background: "var(--panel-hover)" }}
                      >
                        <Image
                          src={p.coverImage}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {p.titleEn}
                      </Link>
                      <span
                        className="mt-0.5 block text-xs"
                        style={{ color: "var(--panel-faint)" }}
                      >
                        /{p.slug}
                      </span>
                    </td>
                    <td style={{ color: "var(--panel-muted)" }}>
                      {CATEGORY_LABEL[p.category] ?? p.category}
                    </td>
                    <td className="text-end tabular-nums" style={{ color: "var(--panel-muted)" }}>
                      {p.year ?? "—"}
                    </td>
                    <td className="text-end tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={13} style={{ color: "var(--panel-faint)" }} />
                        {p.views}
                      </span>
                    </td>
                    <td className="text-end tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Heart size={13} style={{ color: "var(--panel-faint)" }} />
                        {p.likes}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          act(
                            () => toggleProjectAction(p.id, "published"),
                            p.published ? "Moved to draft" : "Published"
                          )
                        }
                        className="panel-pill"
                        style={
                          p.published
                            ? { background: "rgba(40,199,111,.14)", color: "#28c76f" }
                            : { background: "var(--panel-hover)", color: "var(--panel-muted)" }
                        }
                        title="Click to toggle"
                      >
                        {p.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() =>
                            act(
                              () => toggleProjectAction(p.id, "featured"),
                              p.featured ? "Removed from home" : "Featured on home"
                            )
                          }
                          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--panel-hover)]"
                          style={{ color: p.featured ? "#ff9f43" : "var(--panel-faint)" }}
                          title={p.featured ? "Unfeature" : "Feature on home"}
                        >
                          <Star size={15} fill={p.featured ? "currentColor" : "none"} />
                        </button>
                        <Link
                          href={`/admin/projects/${p.id}`}
                          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--panel-hover)]"
                          style={{ color: "var(--panel-muted)" }}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        {confirmId === p.id ? (
                          <>
                            <button
                              className="panel-btn panel-btn-danger !px-2 !py-1 text-xs"
                              onClick={() =>
                                act(() => deleteProjectAction(p.id), "Project deleted")
                              }
                            >
                              Confirm
                            </button>
                            <button
                              className="panel-btn panel-btn-ghost !px-2 !py-1 text-xs"
                              onClick={() => setConfirmId(null)}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmId(p.id)}
                            className="rounded-lg p-1.5 transition-colors hover:bg-[rgba(234,84,85,.1)]"
                            style={{ color: "#ea5455" }}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div
            className="flex items-center justify-between border-t px-5 py-3 text-sm"
            style={{ borderColor: "var(--panel-border)" }}
          >
            <span style={{ color: "var(--panel-muted)" }}>
              Page {current} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                className="panel-btn panel-btn-ghost !py-1"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </button>
              <button
                className="panel-btn panel-btn-ghost !py-1"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
