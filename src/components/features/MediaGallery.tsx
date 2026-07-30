"use client";

import type { Media } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

interface MediaGalleryProps {
  media: Media[];
  /** Captions and alt text follow the page language, not the stored default. */
  isRtl?: boolean;
}

export function MediaGallery({ media, isRtl = false }: MediaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  /* A screenshot on its own tells a visitor almost nothing — it is a
     rectangle of someone else's interface. The caption is what turns it
     into evidence, so it is shown under the image and not just left in
     the alt attribute.
     Alt text that only counts the images ("Project — 2") is the exception:
     it still belongs in the alt attribute, but printing it under the frame
     would add a line of noise to every gallery. */
  const captionOf = (m: Media) => (isRtl ? m.altAr : m.altEn) || "";
  const counted = /[—–-]\s*(?:mockup|shot|نموذج|صورة|لقطة)?\s*\d+\s*$/i;
  const showCaption = (caption: string) => Boolean(caption) && !counted.test(caption);

  // Adapt Prisma Media to Lightbox MediaItem
  const lightboxItems = media.sort((a, b) => a.order - b.order).map((m) => ({
    id: m.id,
    url: m.url,
    type: m.type as "IMAGE" | "VIDEO",
    alt: captionOf(m) || "Gallery media",
  }));

  // Layout algorithm: 
  // 1 item -> full width
  // 2 items -> 50/50
  // 3+ items -> First item full, rest in a grid
  
  return (
    <>
      <div className="grid grid-cols-1 items-start gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item, index) => {
          const isFirstOfMany = media.length >= 3 && index === 0;
          const caption = captionOf(item);

          return (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className={isFirstOfMany ? "sm:col-span-2 lg:col-span-3" : undefined}
            >
            <div
              className={`relative overflow-hidden rounded-2xl cursor-zoom-in group ${
                isFirstOfMany ? "aspect-[21/9]" : "aspect-[4/3]"
              } bg-gray-100 dark:bg-gray-800`}
              onClick={() => setLightboxIndex(index)}
            >
              {item.type === "IMAGE" ? (
                <Image
                  src={item.url}
                  alt={caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={isFirstOfMany ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
                  priority={index < 2}
                />
              ) : (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-80"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.play().catch(() => {});
                    }}
                    onMouseLeave={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 ml-1 fill-current" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

              {showCaption(caption) && (
                <figcaption className="mt-3 px-1 text-sm leading-relaxed text-text-tertiary">
                  {caption}
                </figcaption>
              )}
            </motion.figure>
          );
        })}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={lightboxItems}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
