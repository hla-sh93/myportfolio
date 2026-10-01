"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ListCollapse, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * The headings come from the page, read out of the rendered article HTML on
 * the server, so the list is in the first paint and not assembled from the
 * DOM after hydration.
 */
export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const t = useTranslations("blog");
  const tA = useTranslations("a11y");
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Trigger when near top
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Escape closes the mobile panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (headings.length === 0) return null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for sticky navbar
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  const desktopToc = (
    <nav aria-label={t("tableOfContents")} className="hidden xl:block sticky top-32 w-64 shrink-0">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">
        {t("tableOfContents")}
      </h3>
      <ul className="space-y-3 border-s-2 border-border ps-4 relative">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={cn("transition-colors relative", isActive ? "text-accent" : "text-text-secondary hover:text-text-primary")}
              style={{ marginInlineStart: `${(heading.level - 2)}rem` }}
            >
              {isActive && (
                <motion.div
                  layoutId="toc-indicator"
                  className="absolute -start-[18px] top-1.5 w-2 h-2 rounded-full bg-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <a
                href={`#${heading.id}`}
                onClick={(e) => scrollToSection(e, heading.id)}
                className={cn("text-sm block py-1", heading.level === 3 ? "text-xs opacity-80" : "")}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const mobileToc = (
    <div className="xl:hidden fixed bottom-6 start-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="toc-mobile"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 start-0 w-72 origin-bottom-left rtl:origin-bottom-right"
          >
            <GlassCard padding="md" className="max-h-[60vh] overflow-y-auto scrollbar-thin shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">
                {t("tableOfContents")}
              </h3>
              <ul className="space-y-3">
                {headings.map((heading) => (
                  <li key={heading.id} style={{ marginInlineStart: `${(heading.level - 2)}rem` }}>
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => scrollToSection(e, heading.id)}
                      className={cn(
                        "text-sm block py-1 transition-colors",
                        activeId === heading.id ? "text-accent font-medium" : "text-text-secondary"
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
        aria-label={tA("tocToggle")}
        aria-expanded={isOpen}
        aria-controls="toc-mobile"
      >
        {isOpen ? <X className="w-5 h-5" /> : <ListCollapse className="w-5 h-5" />}
      </button>
    </div>
  );

  return (
    <>
      {desktopToc}
      {mobileToc}
    </>
  );
}
