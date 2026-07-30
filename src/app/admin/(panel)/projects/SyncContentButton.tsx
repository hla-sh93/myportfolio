"use client";

import { syncContentAction } from "@/app/admin/actions";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Imports the repo's JSON content into the database from inside the running
 * deployment — the only place the database can actually be reached from.
 * Upsert only, so pressing it twice does nothing the first press did not.
 */
export function SyncContentButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const report = await syncContentAction();
      setResult(
        report.failed.length
          ? `${report.projects} projects, ${report.articles} articles — ${report.failed.length} failed`
          : `${report.projects} projects, ${report.articles} articles imported`
      );
      router.refresh();
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {result && (
        <span className="text-xs" style={{ color: "var(--panel-muted)" }}>
          {result}
        </span>
      )}
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="panel-btn panel-btn-ghost disabled:opacity-60"
        title="Import the content shipped with this deployment into the database"
      >
        <RefreshCw size={16} className={busy ? "animate-spin" : undefined} />
        {busy ? "Importing…" : "Import from repo"}
      </button>
    </div>
  );
}
