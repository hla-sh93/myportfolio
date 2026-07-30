/**
 * The at-a-glance strip under a project hero.
 *
 * A visitor who lands on a case study asks three things before deciding to
 * read: what field is this, who was it for, and what was my part in it. Those
 * answers used to sit in a sidebar below a screen of prose, which meant most
 * people never reached them — one reader opened the maritime portals and came
 * away unable to say what the work had been. So the answers come first now,
 * as a scannable row, and the reading starts after them.
 *
 * Every cell is optional: a project with no client simply loses that column
 * rather than showing an empty label.
 */

type Fact = { label: string; value: string };

export function ProjectFacts({ facts }: { facts: Fact[] }) {
  const shown = facts.filter((f) => f.value);
  if (!shown.length) return null;

  return (
    <dl className="card-line card-line-static grid grid-cols-2 gap-x-6 gap-y-7 p-7 sm:grid-cols-3 md:gap-x-10 md:p-9 lg:grid-cols-4">
      {shown.map((fact) => (
        <div key={fact.label} className="min-w-0">
          <dt className="chip-label mb-2.5 text-text-tertiary">{fact.label}</dt>
          <dd className="text-balance font-display text-base font-bold leading-snug text-text-primary md:text-lg">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
