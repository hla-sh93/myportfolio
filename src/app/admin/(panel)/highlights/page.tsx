import { getStoredStats } from "@/lib/content-store";
import { HighlightsEditor } from "./HighlightsEditor";

export const metadata = { title: "Highlights | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHighlightsPage() {
  const stats = await getStoredStats();

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <header>
        <h1 className="text-xl font-bold">Highlights</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--panel-muted)" }}>
          The numbers strip on the home and about pages. Every figure should
          match the CV.
        </p>
      </header>

      <HighlightsEditor initial={stats} />
    </div>
  );
}
