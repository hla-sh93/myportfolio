/* Infinite tool marquee — every name comes straight from the CV.
   Editorial scale: big alternating filled/outlined words, not a quiet
   ticker. Pure CSS animation (see .animate-marquee in globals.css);
   reverses in RTL and freezes under prefers-reduced-motion. */

const tools = [
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Premiere Pro",
  "React",
  "Next.js",
  "JavaScript",
  "HTML5",
  "CSS3",
  "MUI",
  "Bootstrap",
] as const;

export function ToolsMarquee() {
  // Duplicated once so the -50% keyframe loops seamlessly
  const items = [...tools, ...tools];

  return (
    <section
      aria-label="Tools & technologies"
      className="marquee-mask overflow-hidden py-6 md:py-8"
    >
      <div dir="ltr" className="animate-marquee flex w-max items-center">
        {items.map((tool, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`marquee-word px-5 font-display text-xl md:px-8 md:text-3xl ${
                i % 2 === 0 ? "text-text-primary" : "text-text-tertiary/50"
              }`}
            >
              {tool}
            </span>
            <span aria-hidden className="text-lg text-accent md:text-xl">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
