"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

interface MediaItem {
  id?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  alt?: string;
}

interface LightboxProps {
  items: MediaItem[];
  initialIndex?: number;
  onClose: () => void;
}

const FOCUSABLE = 'button, [href], video, [tabindex]:not([tabindex="-1"])';

/**
 * A dialog in the ARIA sense as well: focus moves in when it opens, stays in
 * while it is open (Tab wraps), and returns to the opener on close. The
 * arrows sit by side rather than by reading direction, because the arrow
 * keys and a swipe are spatial too.
 */
export function Lightbox({ items, initialIndex = 0, onClose }: LightboxProps) {
  const t = useTranslations("a11y");
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Focus in on open, back to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  const navigate = useCallback((direction: 1 | -1) => {
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = items.length - 1;
      if (next >= items.length) next = 0;
      return next;
    });
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, onClose]);

  const currentItem = items[currentIndex];

  if (!items.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("lightbox")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        {/* Header / Close */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
          <div className="text-white/70 text-sm font-medium" aria-live="polite">
            {currentIndex + 1} / {items.length}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            aria-label={t("close")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            {/* Shown at every width: on a phone a swipe used to be the only
                way between images, and a swipe is not something everyone
                can do. */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 sm:left-4 p-2 sm:p-3 text-white/60 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all z-10"
              aria-label={t("previous")}
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-2 sm:right-4 p-2 sm:p-3 text-white/60 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all z-10"
              aria-label={t("next")}
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </>
        )}

        {/* Media Container */}
        <div 
          className="relative w-full h-[100dvh] flex items-center justify-center p-0 sm:p-12 md:p-20"
          onClick={onClose}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking media
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) navigate(-1);
                if (info.offset.x < -100) navigate(1);
              }}
            >
              {currentItem.type === "IMAGE" ? (
                <div className="relative w-full h-full max-w-7xl max-h-full">
                  <Image
                    src={currentItem.url}
                    alt={currentItem.alt || "Gallery image"}
                    fill
                    className="object-contain"
                    quality={100}
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : (
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                  playsInline
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
