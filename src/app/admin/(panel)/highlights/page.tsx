import { getStoredStats } from "@/lib/content-store";
import { HighlightsEditor } from "./HighlightsEditor";

export const metadata = { title: "Key Highlights | Admin" };
export const dynamic = "force-dynamic";

export default function AdminHighlightsPage() {
  const stats = getStoredStats();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Key Highlights</h1>
        <p className="text-text-secondary mt-2">
          The numbers strip on the home page (7+ years, 94K+ users, …). Keep
          them CV-true.
        </p>
      </header>
      <HighlightsEditor initial={stats} />
    </div>
  );
}
