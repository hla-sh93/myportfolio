"use client";

import { Lightbox } from "@/components/features/Lightbox";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ZoomIn } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";

export interface Certificate {
  url: string;
  width: number;
  height: number;
  blurDataUrl: string | null;
  issuer: string | null;
  title: string;
  date?: string | null;
  category?: string;
}

const CATS = ["all", "uiux", "frontend", "marketing", "growth"] as const;
type Cat = (typeof CATS)[number];

const LABELS: Record<Cat, { en: string; ar: string }> = {
  all: { en: "All", ar: "الكل" },
  uiux: { en: "UI/UX", ar: "UI/UX" },
  frontend: { en: "Front-End", ar: "فرونت-إند" },
  marketing: { en: "SEO & Marketing", ar: "سيو وتسويق" },
  growth: { en: "Professional Growth", ar: "تطوير مهني" },
};

/* Certificates grouped by discipline — filter pills + zoom-to-Lightbox. */
export function CertificatesGrid({ items }: { items: Certificate[] }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [cat, setCat] = useState<Cat>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (cat === "all" ? items : items.filter((c) => c.category === cat)),
    [cat, items]
  );

  if (items.length === 0) return null;

  const countOf = (c: Cat) =>
    c === "all" ? items.length : items.filter((x) => x.category === c).length;

  return (
    <>
      {/* Category rail */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {CATS.map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active ? "text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="cert-cat-pill"
                  className="absolute inset-0 rounded-full bg-accent shadow-[0_0_20px_var(--accent-glow)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                {isAr ? LABELS[c].ar : LABELS[c].en}
                <span className="ms-1.5 text-xs opacity-70">({countOf(c)})</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((cert, index) => (
            <motion.button
              layout
              key={cert.url}
              type="button"
              onClick={() => setLightboxIndex(index)}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
                delay: Math.min((index % 6) * 0.04, 0.25),
              }}
              className="card-line group cursor-zoom-in overflow-hidden p-3 text-start"
              aria-label={cert.title}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-surface">
                <Image
                  src={cert.url}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder={cert.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={cert.blurDataUrl || undefined}
                />
                <span className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn size={16} />
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-2 pb-1.5 pt-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <Award size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-text-primary">
                    {cert.title}
                  </span>
                  <span dir="ltr" className="block text-xs font-semibold text-text-tertiary">
                    {cert.issuer}
                    {cert.date ? ` · ${cert.date}` : ""}
                  </span>
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered.map((c) => ({
            url: c.url,
            type: "IMAGE" as const,
            alt: c.title,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
