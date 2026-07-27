import type { ReactNode } from "react";
import { Skeleton, SkeletonChip, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Route-shaped skeletons.
 *
 * Each one mirrors the real component's box model — same container widths,
 * same paddings, same aspect ratios, same reserved heights — so the swap from
 * skeleton to content shifts nothing (CLS stays at 0). They are plain server
 * components: a route skeleton must paint instantly and ship no JS.
 */

/* ── Page header (mirrors <PageHeader>) ── */
export function PageHeaderSkeleton() {
  return (
    <header className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="glow-accent absolute -end-40 -top-40 h-[480px] w-[480px] opacity-40" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-24 lg:px-8 md:pb-16 md:pt-32">
        <SkeletonChip />
        <div className="mt-9 flex max-w-4xl flex-col gap-3.5">
          <Skeleton height={48} width="72%" radius="14px" />
          <Skeleton height={48} width="44%" radius="14px" />
        </div>
        <div className="mt-7 max-w-2xl">
          <SkeletonText lines={2} height={14} />
        </div>
      </div>
    </header>
  );
}

/* ── Filter rail (mirrors the ProjectGrid / BlogExplorer controls) ── */
export function FilterBarSkeleton({ pills = 5 }: { pills?: number }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        {Array.from({ length: pills }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === 0 ? 72 : 104}
            height={38}
            radius="9999px"
          />
        ))}
      </div>
      <Skeleton width={256} height={44} radius="9999px" className="shrink-0" />
    </div>
  );
}

/* ── Project card (mirrors <ProjectCard view="grid">) ── */
export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden>
      <Skeleton aspect="16 / 11" radius="30px" />
      <div className="px-1 pt-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton height={20} width="65%" />
          <Skeleton width={32} height={32} radius="9999px" className="shrink-0" />
        </div>
        <div className="mt-3">
          <SkeletonText lines={2} height={11} />
        </div>
        <Skeleton width={54} height={12} className="mt-4" />
      </div>
    </div>
  );
}

/* ── Blog card (mirrors the contained <BlogCard>) ── */
export function BlogCardSkeleton() {
  return (
    <div className="card-line card-line-static flex h-full flex-col p-3" aria-hidden>
      <Skeleton aspect="16 / 10" radius="22px" />
      <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
        <div className="flex items-center gap-3">
          <Skeleton width={88} height={24} radius="9999px" />
          <Skeleton width={72} height={12} />
        </div>
        {/* matches the title's reserved min-h-[3.2rem] */}
        <div className="mt-4 flex min-h-[3.2rem] flex-col gap-2.5">
          <Skeleton height={18} width="100%" />
          <Skeleton height={18} width="70%" />
        </div>
        <div className="mb-5 mt-2.5 min-h-[2.6rem]">
          <SkeletonText lines={2} height={11} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-4">
            <Skeleton width={78} height={12} />
            <Skeleton width={42} height={12} />
          </div>
          <Skeleton width={36} height={36} radius="9999px" />
        </div>
      </div>
    </div>
  );
}

/* ── Closing CTA band (mirrors <CTABanner>) ── */
export function CTABannerSkeleton({ contained = false }: { contained?: boolean }) {
  const inner = (
    <>
      <SkeletonChip width={104} />
      <div className="mt-8 flex flex-col gap-4">
        <Skeleton height={contained ? 36 : 56} width="60%" radius="14px" />
        <Skeleton height={14} width="38%" />
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Skeleton width={168} height={48} radius="9999px" />
        <Skeleton width={148} height={48} radius="9999px" />
      </div>
    </>
  );

  if (contained) {
    return (
      <section className="relative py-16 md:py-24" aria-hidden>
        <div className="rounded-[30px] bg-[#120409] px-7 py-12 md:px-12 md:py-16 [--text-primary:#ffffff]">
          {inner}
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-[#120409] py-28 md:py-40 [--text-primary:#ffffff]"
      aria-hidden
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">{inner}</div>
    </section>
  );
}

/* ── A generic titled section, for the About page rhythm ── */
export function SectionSkeleton({
  children,
  bordered = true,
}: {
  children?: ReactNode;
  bordered?: boolean;
}) {
  return (
    <section className={`py-16 md:py-24 ${bordered ? "border-t border-border" : ""}`}>
      <SkeletonChip width={116} />
      <div className="mt-7 max-w-2xl">
        <Skeleton height={34} width="58%" radius="12px" />
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
