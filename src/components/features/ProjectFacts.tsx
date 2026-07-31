import { TechBadgeRow } from "./TechBadge";

/**
 * The at-a-glance spec block under a project hero.
 *
 * A visitor who lands on a case study asks three things before deciding to
 * read: what field is this, who was it for, and what was my part in it. Those
 * answers used to sit in a sidebar below a screen of prose, which meant most
 * people never reached them — one reader opened the maritime portals and came
 * away unable to say what the work had been.
 *
 * The first attempt put the labels in .chip-label pills and the result read
 * as a scatter of unrelated tags: a chip is a tag, and a tag competes with
 * the thing it is labelling. Labels are quiet here and the values carry the
 * weight, with hairlines doing the separating instead of borders around each
 * cell. Tools get their own band at the foot, where the marks have room.
 *
 * Every cell is optional: a project with no client loses that column rather
 * than showing an empty label.
 */

type Fact = { label: string; value: string };

export function ProjectFacts({
  facts,
  toolsLabel,
  tools,
}: {
  facts: Fact[];
  toolsLabel: string;
  tools: string[];
}) {
  const shown = facts.filter((f) => f.value);
  if (!shown.length && !tools.length) return null;

  return (
    <section className="card-line card-line-static overflow-hidden">
      {shown.length > 0 && (
        /* .spec-grid draws the hairlines on the cells themselves — see the
           note beside it in globals.css for why not on the grid. Columns
           follow the fact count so the row fills, capped at four. */
        <dl className={shown.length < 4 ? `spec-grid spec-grid-${shown.length}` : "spec-grid"}>
          {shown.map((fact) => (
            <div key={fact.label} className="min-w-0 px-6 py-6 md:px-7 md:py-7">
              <dt className="spec-label mb-2">{fact.label}</dt>
              <dd className="text-balance font-display text-[1.0625rem] font-bold leading-snug text-text-primary md:text-lg">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {tools.length > 0 && (
        <div
          className={`px-6 py-6 md:px-7 md:py-7 ${shown.length ? "border-t border-border" : ""}`}
        >
          <p className="spec-label mb-3.5">{toolsLabel}</p>
          <TechBadgeRow tools={tools} />
        </div>
      )}
    </section>
  );
}
