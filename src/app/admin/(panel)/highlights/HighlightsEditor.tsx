"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import type { StoredStat } from "@/lib/content-store";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveStatsAction } from "../../actions";

export function HighlightsEditor({ initial }: { initial: StoredStat[] }) {
  const router = useRouter();
  const [stats, setStats] = useState(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (i: number, k: keyof StoredStat, v: string) => {
    const next = [...stats];
    next[i] = { ...next[i], [k]: k === "value" ? Number(v) || 0 : v };
    setStats(next);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <GlassCard padding="lg" className="space-y-4">
        {/* header row */}
        <div className="hidden md:grid grid-cols-[90px_90px_1fr_1fr_40px] gap-3 text-xs font-semibold text-text-secondary px-1">
          <span>Number</span>
          <span>Suffix</span>
          <span dir="rtl">التسمية (AR)</span>
          <span>Label (EN)</span>
          <span />
        </div>
        {stats.map((s, i) => (
          <div
            key={s.id || i}
            className="grid grid-cols-2 md:grid-cols-[90px_90px_1fr_1fr_40px] gap-3 items-center"
          >
            <Input
              inputMode="numeric"
              value={String(s.value)}
              onChange={(e) => set(i, "value", e.target.value)}
            />
            <Input
              placeholder="K+"
              value={s.suffix}
              onChange={(e) => set(i, "suffix", e.target.value)}
            />
            <Input
              dir="rtl"
              placeholder="سنوات خبرة"
              value={s.labelAr}
              onChange={(e) => set(i, "labelAr", e.target.value)}
            />
            <Input
              placeholder="Years of experience"
              value={s.labelEn}
              onChange={(e) => set(i, "labelEn", e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setStats(stats.filter((_, j) => j !== i));
                setSaved(false);
              }}
              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 justify-self-end"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <Button
          variant="ghost"
          onClick={() => {
            setStats([
              ...stats,
              { id: "", value: 0, suffix: "+", labelAr: "", labelEn: "" },
            ]);
            setSaved(false);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add highlight
        </Button>
      </GlassCard>

      <div className="flex items-center justify-end gap-4">
        {saved && <span className="text-sm text-emerald-500">Saved ✓</span>}
        <Button
          variant="accent"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await saveStatsAction(stats);
              setSaved(true);
              router.refresh();
            })
          }
          className="min-w-[130px]"
        >
          {pending ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save all
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
