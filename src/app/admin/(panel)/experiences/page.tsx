import { getStoredExperiences } from "@/lib/content-store";
import { ExperiencesEditor } from "./ExperiencesEditor";

export const metadata = { title: "Experiences | Admin" };
export const dynamic = "force-dynamic";

export default function AdminExperiencesPage() {
  const experiences = getStoredExperiences();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Experiences</h1>
        <p className="text-text-secondary mt-2">
          The career timeline on the About page. Lower order = shown first.
        </p>
      </header>
      <ExperiencesEditor initial={experiences} />
    </div>
  );
}
