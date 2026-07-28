"use client";

import { saveStatsAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import type { StoredStat } from "@/lib/content-store";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function HighlightsEditor({ initial }: { initial: StoredStat[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState(initial);
  const [pending, start] = useTransition();

  const dirty = JSON.stringify(stats) !== JSON.stringify(initial);

  const set = (i: number, k: keyof StoredStat, v: string) => {
    const next = [...stats];
    next[i] = { ...next[i], [k]: k === "value" ? Number(v) || 0 : v };
    setStats(next);
  };

  return (
    <div className="space-y-4">
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="panel-table">
            <thead>
              <tr>
                <th className="w-28">Number</th>
                <th className="w-24">Suffix</th>
                <th dir="rtl">التسمية (AR)</th>
                <th>Label (EN)</th>
                <th className="w-14" />
              </tr>
            </thead>
            <tbody>
              {stats.map((s, i) => (
                <tr key={s.id || `new-${i}`}>
                  <td>
                    {/* A counted stat is read from the content itself, so an
                        editable box here would be a lie — typing in it would
                        change nothing on the site. */}
                    <input
                      inputMode="numeric"
                      className="panel-field disabled:cursor-not-allowed disabled:opacity-60"
                      value={String(s.value)}
                      disabled={!!s.source}
                      title={
                        s.source
                          ? `Counted automatically from your ${s.source}`
                          : undefined
                      }
                      onChange={(e) => set(i, "value", e.target.value)}
                    />
                    {s.source && (
                      <span className="mt-1 block text-[11px] font-medium text-[var(--panel-faint)]">
                        auto · {s.source}
                      </span>
                    )}
                  </td>
                  <td>
                    <input
                      className="panel-field"
                      placeholder="K+"
                      value={s.suffix}
                      onChange={(e) => set(i, "suffix", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      dir="rtl"
                      className="panel-field"
                      placeholder="سنوات خبرة"
                      value={s.labelAr}
                      onChange={(e) => set(i, "labelAr", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="panel-field"
                      placeholder="Years of experience"
                      value={s.labelEn}
                      onChange={(e) => set(i, "labelEn", e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => setStats(stats.filter((_, j) => j !== i))}
                      className="rounded-lg p-1.5 transition-colors hover:bg-[rgba(234,84,85,.1)]"
                      style={{ color: "#ea5455" }}
                      aria-label="Remove row"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <p
                      className="py-8 text-center text-sm"
                      style={{ color: "var(--panel-muted)" }}
                    >
                      No highlights — the numbers strip will be hidden.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="border-t px-4 py-3"
          style={{ borderColor: "var(--panel-border)" }}
        >
          <button
            className="panel-btn panel-btn-ghost !py-1.5 text-xs"
            onClick={() =>
              setStats([
                ...stats,
                { id: "", value: 0, suffix: "+", labelAr: "", labelEn: "" },
              ])
            }
          >
            <Plus size={14} />
            Add highlight
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {dirty && (
          <span className="text-xs" style={{ color: "var(--panel-muted)" }}>
            Unsaved changes
          </span>
        )}
        <button
          className="panel-btn panel-btn-primary"
          disabled={pending || !dirty}
          onClick={() =>
            start(async () => {
              await saveStatsAction(stats);
              toast({ title: "Highlights saved", variant: "success" });
              router.refresh();
            })
          }
        >
          {pending ? "Saving…" : "Save all"}
        </button>
      </div>
    </div>
  );
}
