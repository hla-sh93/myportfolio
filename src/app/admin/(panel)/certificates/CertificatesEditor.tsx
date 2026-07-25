"use client";

import {
  deleteCertificateAction,
  saveCertificateAction,
} from "@/app/admin/actions";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useToast } from "@/components/ui/Toast";
import type { StoredCertificate } from "@/lib/content-store";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const CATEGORIES = [
  { value: "uiux", label: "UI/UX" },
  { value: "frontend", label: "Front-End" },
  { value: "marketing", label: "SEO & Marketing" },
  { value: "growth", label: "Professional Growth" },
];

type Draft = {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  url: string;
  order: string;
};

const blank = (order: number): Draft => ({
  title: "",
  issuer: "",
  date: "",
  category: "uiux",
  url: "",
  order: String(order),
});

export function CertificatesEditor({ initial }: { initial: StoredCertificate[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = initial.filter((c) => {
    const matchesCat = cat === "all" || c.category === cat;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      (c.issuer ?? "").toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const save = () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.url.trim()) {
      toast({ title: "Title and image URL are required", variant: "error" });
      return;
    }
    start(async () => {
      await saveCertificateAction(draft);
      setDraft(null);
      toast({ title: "Certificate saved", variant: "success" });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    start(async () => {
      await deleteCertificateAction(id);
      setConfirmId(null);
      toast({ title: "Certificate deleted", variant: "success" });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="ad-field max-w-xs"
          placeholder="Search title or issuer…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="ad-field max-w-[190px]"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <span className="text-sm" style={{ color: "var(--ad-muted)" }}>
          {filtered.length} of {initial.length}
        </span>
        <button
          className="ad-btn ad-btn-primary ms-auto"
          onClick={() => setDraft(blank(initial.length))}
        >
          <Plus size={16} />
          Add certificate
        </button>
      </div>

      {/* Editor */}
      {draft && (
        <div className="ad-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">
              {draft.id ? "Edit certificate" : "New certificate"}
            </h2>
            <button
              onClick={() => setDraft(null)}
              className="rounded-lg p-1.5"
              style={{ color: "var(--ad-muted)" }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ad-muted)" }}>
                Title *
              </span>
              <input
                className="ad-field"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ad-muted)" }}>
                Issuer
              </span>
              <input
                className="ad-field"
                placeholder="Meta · Coursera"
                value={draft.issuer}
                onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ad-muted)" }}>
                Date
              </span>
              <input
                className="ad-field"
                placeholder="Jun 30, 2024"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ad-muted)" }}>
                Category
              </span>
              <select
                className="ad-field"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ad-muted)" }}>
                  Image URL *
                </span>
                <input
                  className="ad-field"
                  placeholder="/images/certificates/name.webp"
                  value={draft.url}
                  onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                />
              </label>
              <div className="mt-2">
                <MediaUpload
                  label="Upload certificate image"
                  onUploaded={([url]) => url && setDraft({ ...draft, url })}
                />
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ad-muted)" }}>
                Order
              </span>
              <input
                type="number"
                className="ad-field"
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <button className="ad-btn ad-btn-primary" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button className="ad-btn ad-btn-ghost" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="ad-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm" style={{ color: "var(--ad-muted)" }}>
            {initial.length === 0
              ? "No certificates yet — add the first one."
              : "Nothing matches this filter."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="ad-table">
              <thead>
                <tr>
                  <th className="w-16">Image</th>
                  <th>Title</th>
                  <th>Issuer</th>
                  <th className="w-32">Date</th>
                  <th className="w-36">Category</th>
                  <th className="w-28 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span
                        className="relative block h-9 w-12 overflow-hidden rounded"
                        style={{ background: "var(--ad-hover)" }}
                      >
                        <Image src={c.url} alt="" fill className="object-cover" sizes="48px" />
                      </span>
                    </td>
                    <td className="font-medium">{c.title}</td>
                    <td style={{ color: "var(--ad-muted)" }}>{c.issuer ?? "—"}</td>
                    <td style={{ color: "var(--ad-muted)" }}>{c.date ?? "—"}</td>
                    <td>
                      <span
                        className="ad-pill"
                        style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                      >
                        {CATEGORIES.find((x) => x.value === c.category)?.label ?? c.category}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="ad-btn ad-btn-ghost !px-2.5 !py-1 text-xs"
                          onClick={() =>
                            setDraft({
                              id: c.id,
                              title: c.title,
                              issuer: c.issuer ?? "",
                              date: c.date ?? "",
                              category: c.category,
                              url: c.url,
                              order: String(c.order),
                            })
                          }
                        >
                          Edit
                        </button>
                        {confirmId === c.id ? (
                          <>
                            <button
                              className="ad-btn ad-btn-danger !px-2.5 !py-1 text-xs"
                              onClick={() => remove(c.id)}
                              disabled={pending}
                            >
                              Confirm
                            </button>
                            <button
                              className="ad-btn ad-btn-ghost !px-2.5 !py-1 text-xs"
                              onClick={() => setConfirmId(null)}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            className="ad-btn ad-btn-danger !px-2 !py-1"
                            onClick={() => setConfirmId(c.id)}
                            aria-label={`Delete ${c.title}`}
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
      </div>
    </div>
  );
}
