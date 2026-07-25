import { getStoredExperiences } from "@/lib/content-store";
import { ExperiencesEditor } from "./ExperiencesEditor";

export const metadata = { title: "Experience | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const experiences = await getStoredExperiences();

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <header>
        <h1 className="text-xl font-bold">Experience</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ad-muted)" }}>
          {experiences.length} entries on the About page timeline — the arrows
          reorder them.
        </p>
      </header>

      <ExperiencesEditor initial={experiences} />
    </div>
  );
}
