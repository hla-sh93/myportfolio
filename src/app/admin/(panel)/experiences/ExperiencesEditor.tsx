"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import type { StoredExperience } from "@/lib/content-store";
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteExperienceAction,
  saveExperienceAction,
} from "../../actions";

const empty = (order: number): StoredExperience => ({
  id: "",
  roleEn: "",
  roleAr: "",
  companyEn: "",
  companyAr: "",
  periodEn: "",
  periodAr: "",
  descEn: "",
  descAr: "",
  order,
});

const textareaCls =
  "w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-y text-sm";

function ExperienceCard({
  exp,
  onSaved,
  onDeleted,
  isNew,
}: {
  exp: StoredExperience;
  onSaved: () => void;
  onDeleted: () => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState(exp);
  const [open, setOpen] = useState(isNew ?? false);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(form) !== JSON.stringify(exp);

  const set = (k: keyof StoredExperience) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: k === "order" ? Number(e.target.value) : e.target.value });

  return (
    <GlassCard padding="md" className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-elevated"
        >
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">
            {form.roleEn || "New experience"}
            <span className="text-text-secondary font-normal mx-2">
              {form.companyEn && `@ ${form.companyEn}`}
            </span>
          </p>
          <p className="text-xs text-text-secondary">{form.periodEn}</p>
        </div>
        <span className="text-xs text-text-secondary">order {form.order}</span>
        {!isNew && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this experience?"))
                start(async () => {
                  await deleteExperienceAction(exp.id);
                  onDeleted();
                });
            }}
            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
          <Input dir="rtl" placeholder="المسمى الوظيفي (AR)" value={form.roleAr} onChange={set("roleAr")} />
          <Input placeholder="Role (EN)" value={form.roleEn} onChange={set("roleEn")} />
          <Input dir="rtl" placeholder="الجهة (AR)" value={form.companyAr} onChange={set("companyAr")} />
          <Input placeholder="Company (EN)" value={form.companyEn} onChange={set("companyEn")} />
          <Input dir="rtl" placeholder="الفترة (AR) — ٢٠٢٠ حتى الآن" value={form.periodAr} onChange={set("periodAr")} />
          <Input placeholder="Period (EN) — 2020 – Present" value={form.periodEn} onChange={set("periodEn")} />
          <textarea dir="rtl" placeholder="الوصف (AR)" rows={3} className={textareaCls} value={form.descAr} onChange={set("descAr")} />
          <textarea placeholder="Description (EN)" rows={3} className={textareaCls} value={form.descEn} onChange={set("descEn")} />
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary">Order</label>
            <Input type="number" className="w-24" value={String(form.order)} onChange={set("order")} />
          </div>
          <div className="flex justify-end">
            <Button
              variant="accent"
              disabled={pending || (!dirty && !isNew)}
              onClick={() =>
                start(async () => {
                  await saveExperienceAction(form);
                  onSaved();
                })
              }
            >
              {pending ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export function ExperiencesEditor({ initial }: { initial: StoredExperience[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const refresh = () => {
    setAdding(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {initial.map((exp) => (
        <ExperienceCard key={exp.id} exp={exp} onSaved={refresh} onDeleted={refresh} />
      ))}

      {adding ? (
        <ExperienceCard
          exp={empty(initial.length)}
          isNew
          onSaved={refresh}
          onDeleted={refresh}
        />
      ) : (
        <Button variant="ghost" onClick={() => setAdding(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add experience
        </Button>
      )}
    </div>
  );
}
