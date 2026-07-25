import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Small accent label above the title (e.g. "المشاريع") */
  label: string;
  title: string;
  description?: string;
  /** Giant faint backdrop word behind the header */
  backdrop?: string;
  /** Optional extra content under the description (filters, meta…) */
  children?: ReactNode;
}

/**
 * Editorial page hero — the shared header voice of every inner page:
 * glow + giant faint backdrop word, section label, display title with
 * an accent full stop, description carried on an accent side-border.
 * Start-aligned always; solid faint backdrop (never outlined).
 */
export function PageHeader({
  label,
  title,
  description,
  backdrop,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="glow-accent absolute -end-40 -top-40 h-[480px] w-[480px] opacity-60" />
        {backdrop && (
          <span
            className="absolute -top-6 end-0 select-none font-display text-[22vw] font-black leading-none text-text-primary opacity-[0.05] md:text-[12rem]"
            dir="ltr"
          >
            {backdrop}
          </span>
        )}
      </div>
      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-24 lg:px-8 md:pb-16 md:pt-32">
        <span className="chip-label">{label}</span>
        <h1 className="title-display mt-9 max-w-4xl font-display text-3xl md:text-5xl lg:text-6xl">
          {title}
          <span className="text-accent">.</span>
        </h1>
        {description && (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
