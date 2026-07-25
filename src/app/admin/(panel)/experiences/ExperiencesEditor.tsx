"use client";

import {
  deleteExperienceAction,
  saveExperienceAction,
} from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import type { StoredExperience } from "@/lib/content-store";
import {
  ChevronDown,
  ChevronUp,
  MoveDown,
  MoveUp,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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

function Field({
  label,
  rtl,
  value,
  onChange,
  textarea,
  type,
}: {
  label: string;
  rtl?: boolean;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-xs font-semibold"
        style={{ color: "var(--panel-muted)" }}
      >
        {label}
      </span>
      {textarea ? (
        <textarea
          dir={rtl ? "rtl" : undefined}
          rows={3}
          className="panel-field resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          dir={rtl ? "rtl" : undefined}
          type={type}
          className="panel-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Row({
  exp,
  isNew,
  canMoveUp,
  canMoveDown,
  onDone,
  onMove,
}: {
  exp: StoredExperience;
  isNew?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onDone: () => void;
  onMove?: (dir: -1 | 1) => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState(exp);
  const [open, setOpen] = useState(isNew ?? false);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(form) !== JSON.stringify(exp);

  const set = (k: keyof StoredExperience) => (v: string) =>
    setForm({ ...form, [k]: k === "order" ? Number(v) : v });

  return (
    <div className={`panel-card ${pending ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--panel-hover)]"
          style={{ color: "var(--panel-muted)" }}
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {form.roleEn || "New experience"}
            {form.companyEn && (
              <span className="ms-2 font-normal" style={{ color: "var(--panel-muted)" }}>
                @ {form.companyEn}
              </span>
            )}
          </p>
          <p className="text-xs" style={{ color: "var(--panel-faint)" }}>
            {form.periodEn || "—"}
          </p>
        </div>

        {!isNew && onMove && (
          <div className="flex items-center">
            <button
              onClick={() => onMove(-1)}
              disabled={!canMoveUp}
              className="rounded-lg p-1.5 transition-colors hover:bg-[var(--panel-hover)] disabled:opacity-25"
              style={{ color: "var(--panel-muted)" }}
              aria-label="Move up"
            >
              <MoveUp size={15} />
            </button>
            <button
              onClick={() => onMove(1)}
              disabled={!canMoveDown}
              className="rounded-lg p-1.5 transition-colors hover:bg-[var(--panel-hover)] disabled:opacity-25"
              style={{ color: "var(--panel-muted)" }}
              aria-label="Move down"
            >
              <MoveDown size={15} />
            </button>
          </div>
        )}

        {!isNew &&
          (confirming ? (
            <div className="flex gap-1">
              <button
                className="panel-btn panel-btn-danger !px-2 !py-1 text-xs"
                onClick={() =>
                  start(async () => {
                    await deleteExperienceAction(exp.id);
                    toast({ title: "Experience deleted", variant: "success" });
                    onDone();
                  })
                }
              >
                Confirm
              </button>
              <button
                className="panel-btn panel-btn-ghost !px-2 !py-1 text-xs"
                onClick={() => setConfirming(false)}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded-lg p-1.5 transition-colors hover:bg-[rgba(234,84,85,.1)]"
              style={{ color: "#ea5455" }}
              aria-label="Delete"
            >
              <Trash2 size={15} />
            </button>
          ))}
      </div>

      {open && (
        <div
          className="grid gap-4 border-t px-4 py-4 md:grid-cols-2"
          style={{ borderColor: "var(--panel-border)" }}
        >
          <Field label="المسمى الوظيفي (AR)" rtl value={form.roleAr} onChange={set("roleAr")} />
          <Field label="Role (EN)" value={form.roleEn} onChange={set("roleEn")} />
          <Field label="الجهة (AR)" rtl value={form.companyAr} onChange={set("companyAr")} />
          <Field label="Company (EN)" value={form.companyEn} onChange={set("companyEn")} />
          <Field label="الفترة (AR)" rtl value={form.periodAr} onChange={set("periodAr")} />
          <Field label="Period (EN)" value={form.periodEn} onChange={set("periodEn")} />
          <Field label="الوصف (AR)" rtl textarea value={form.descAr} onChange={set("descAr")} />
          <Field label="Description (EN)" textarea value={form.descEn} onChange={set("descEn")} />

          <div className="flex items-end gap-3">
            <div className="w-28">
              <Field
                label="Order"
                type="number"
                value={String(form.order)}
                onChange={set("order")}
              />
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button
              className="panel-btn panel-btn-primary"
              disabled={pending || (!dirty && !isNew)}
              onClick={() =>
                start(async () => {
                  await saveExperienceAction(form);
                  toast({ title: "Experience saved", variant: "success" });
                  onDone();
                })
              }
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExperiencesEditor({ initial }: { initial: StoredExperience[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [, start] = useTransition();

  const refresh = () => {
    setAdding(false);
    router.refresh();
  };

  // Swapping the two `order` values is the whole reorder — the list is sorted
  // by it server-side.
  const move = (index: number, dir: -1 | 1) => {
    const a = initial[index];
    const b = initial[index + dir];
    if (!a || !b) return;
    start(async () => {
      await saveExperienceAction({ ...a, order: b.order });
      await saveExperienceAction({ ...b, order: a.order });
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      {initial.map((exp, i) => (
        <Row
          key={exp.id}
          exp={exp}
          canMoveUp={i > 0}
          canMoveDown={i < initial.length - 1}
          onMove={(dir) => move(i, dir)}
          onDone={refresh}
        />
      ))}

      {adding ? (
        <Row exp={empty(initial.length)} isNew onDone={refresh} />
      ) : (
        <button className="panel-btn panel-btn-ghost" onClick={() => setAdding(true)}>
          <Plus size={16} />
          Add experience
        </button>
      )}
    </div>
  );
}
