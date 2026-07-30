import { TECH_MARKS, initialsOf } from "@/content/tech-icons";

/**
 * One tool, drawn rather than spelled.
 *
 * A list of tools set as text ("Photoshop، Illustrator") reads as a footnote;
 * the marks are recognised before they are read, which is the point of naming
 * the stack at all. The name stays in the tooltip and the accessible label,
 * so nothing is lost for a screen reader or for anyone who does not know a
 * particular logo.
 */
export function TechBadge({ name }: { name: string }) {
  const mark = TECH_MARKS[name];

  return (
    <span className="tech-badge" title={name} role="img" aria-label={name}>
      {mark?.path ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={mark.path} />
        </svg>
      ) : (
        <span aria-hidden="true">{mark?.mono ?? initialsOf(name)}</span>
      )}
    </span>
  );
}

export function TechBadgeRow({ tools }: { tools: string[] }) {
  if (!tools.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2.5">
      {tools.map((tool) => (
        <li key={tool}>
          <TechBadge name={tool} />
        </li>
      ))}
    </ul>
  );
}
