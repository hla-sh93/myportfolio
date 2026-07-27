import {
  Skeleton,
  SkeletonChip,
  SkeletonText,
  LoadingStatus,
} from "@/components/ui/Skeleton";
import { ProjectCardSkeleton } from "@/components/skeletons";

/**
 * Home skeleton — mirrors the split shell: sticky identity card on one side,
 * the scrolling content column on the other. Also the fallback for any child
 * route that doesn't ship its own loading file.
 */
export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-6 lg:px-8 xl:pt-10">
      <LoadingStatus />
      <div className="xl:grid xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start xl:gap-14 2xl:grid-cols-[460px_minmax(0,1fr)] 2xl:gap-16">
        {/* Identity card */}
        <div className="mx-auto mb-12 w-full max-w-md xl:mb-0 xl:max-w-none">
          <div className="card-line card-line-static p-6">
            <Skeleton aspect="4 / 3" radius="24px" />
            <div className="mt-7 flex flex-col gap-3">
              <Skeleton height={16} width="55%" />
              <Skeleton height={12} width="75%" />
            </div>
            <div className="mt-7 flex flex-col gap-4 border-t border-border pt-7">
              <Skeleton height={12} width="68%" />
              <Skeleton height={12} width="48%" />
            </div>
            <div className="mt-7 flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width={50} height={50} radius="9999px" />
              ))}
            </div>
            <Skeleton height={48} radius="9999px" className="mt-7" />
          </div>
        </div>

        {/* Content column */}
        <div className="min-w-0">
          {/* Intro */}
          <section className="pt-4 md:pt-8">
            <SkeletonChip />
            <div className="mt-8 flex flex-col gap-4">
              <Skeleton height={54} width="92%" radius="14px" />
              <Skeleton height={54} width="64%" radius="14px" />
            </div>
            <div className="mt-8 max-w-xl">
              <SkeletonText lines={2} height={14} />
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Skeleton width={176} height={50} radius="9999px" />
              <Skeleton width={152} height={50} radius="9999px" />
            </div>

            {/* Fact counters */}
            <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton height={44} width="58%" radius="10px" />
                  <Skeleton height={12} width="80%" />
                </div>
              ))}
            </div>
          </section>

          {/* Tools marquee */}
          <div className="mt-16 border-y border-border py-8">
            <div className="flex gap-10 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} width={118} height={22} className="shrink-0" />
              ))}
            </div>
          </div>

          {/* Featured work */}
          <section className="py-16 md:py-24">
            <SkeletonChip width={116} />
            <div className="mt-7">
              <Skeleton height={34} width="46%" radius="12px" />
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
