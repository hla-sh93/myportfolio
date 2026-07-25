"use client";

import { deleteArticleAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { ArrowUpDown, Clock, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export type ArticleRow = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  tags: string[];
  readTime: number;
  published: boolean;
  publishedAt: string;
  views: number;
};

type SortKey = "title" | "date" | "views";
const PER_PAGE = 12;

export function ArticlesTable({ rows }: { rows: ArticleRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, start] = useTransition();

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const allTags = useMemo(
    () => [...new Set(rows.flatMap((r) => r.tags))].sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (tag !== "all" && !r.tags.includes(tag)) return false;
      if (status === "published" && !r.published) return false;
      if (status === "draft" && r.published) return false;
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
      else if (sort === "date") d = +new Date(a.publishedAt) - +new Date(b.publishedAt);
      else d = a.views - b.views;
      return asc ? d : -d;
    });
    return out;
  }, [rows, query, tag, status, sort, asc]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

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
          className="ad-field max-w-xs"
          placeholder="Search title or slug…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="ad-field max-w-[170px]"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="ad-field max-w-[150px]"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <span className="text-sm" style={{ color: "var(--ad-muted)" }}>
          {filtered.length} of {rows.length}
        </span>
      </div>

      <div className={`ad-card overflow-hidden ${pending ? "opacity-60" : ""}`}>
        {slice.length === 0 ? (
          <p
            className="px-5 py-14 text-center text-sm"
            style={{ color: "var(--ad-muted)" }}
          >
            {rows.length === 0
              ? "No articles yet — write the first one."
              : "Nothing matches these filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="ad-table">
              <thead>
                <tr>
                  {th("title", "Article")}
                  <th className="w-48">Tags</th>
                  {th("date", "Published", "w-32")}
                  <th className="w-24 text-end">Read</th>
                  {th("views", "Reads", "w-24 text-end")}
                  <th className="w-28">Status</th>
                  <th className="w-24 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link
                        href={`/admin/blog/${a.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {a.titleEn}
                      </Link>
                      <span
                        className="mt-0.5 block text-xs"
                        style={{ color: "var(--ad-faint)" }}
                      >
                        /{a.slug}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {a.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="ad-pill"
                            style={{
                              background: "var(--ad-hover)",
                              color: "var(--ad-muted)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td
                      className="tabular-nums"
                      style={{ color: "var(--ad-muted)" }}
                    >
                      {new Date(a.publishedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="text-end tabular-nums" style={{ color: "var(--ad-muted)" }}>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} style={{ color: "var(--ad-faint)" }} />
                        {a.readTime}m
                      </span>
                    </td>
                    <td className="text-end tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={13} style={{ color: "var(--ad-faint)" }} />
                        {a.views}
                      </span>
                    </td>
                    <td>
                      <span
                        className="ad-pill"
                        style={
                          a.published
                            ? { background: "rgba(40,199,111,.14)", color: "#28c76f" }
                            : { background: "var(--ad-hover)", color: "var(--ad-muted)" }
                        }
                      >
                        {a.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-0.5">
                        <Link
                          href={`/admin/blog/${a.id}`}
                          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--ad-hover)]"
                          style={{ color: "var(--ad-muted)" }}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        {confirmId === a.id ? (
                          <>
                            <button
                              className="ad-btn ad-btn-danger !px-2 !py-1 text-xs"
                              onClick={() =>
                                start(async () => {
                                  await deleteArticleAction(a.id);
                                  setConfirmId(null);
                                  toast({ title: "Article deleted", variant: "success" });
                                  router.refresh();
                                })
                              }
                            >
                              Confirm
                            </button>
                            <button
                              className="ad-btn ad-btn-ghost !px-2 !py-1 text-xs"
                              onClick={() => setConfirmId(null)}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmId(a.id)}
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
            style={{ borderColor: "var(--ad-border)" }}
          >
            <span style={{ color: "var(--ad-muted)" }}>
              Page {current} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                className="ad-btn ad-btn-ghost !py-1"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </button>
              <button
                className="ad-btn ad-btn-ghost !py-1"
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
