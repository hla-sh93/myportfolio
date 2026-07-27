import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Project case-study skeleton — the tall cinematic cover with the title block
 * sitting on it, then the two-column body (story + facts panel).
 */
export default function ProjectDetailLoading() {
  return (
    <article className="min-h-screen">
      <LoadingStatus />

      {/* Cover stage */}
      <div className="relative h-[60vh] w-full bg-surface md:h-[80vh]">
        <div className="skeleton absolute inset-0 rounded-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />

        <div className="container absolute inset-0 mx-auto flex max-w-5xl flex-col justify-end px-6 pb-16 md:pb-24">
          <Skeleton width={128} height={14} className="mb-8" />
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Skeleton width={104} height={30} radius="9999px" />
            <Skeleton width={128} height={14} />
          </div>
          <div className="mb-6 flex flex-col gap-4">
            <Skeleton height={46} width="78%" radius="12px" />
            <Skeleton height={46} width="52%" radius="12px" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton width={116} height={40} radius="9999px" />
            <Skeleton width={96} height={40} radius="9999px" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div className="space-y-6">
              <Skeleton height={30} width="38%" radius="10px" />
              <SkeletonText lines={5} height={13} />
            </div>
            <div className="space-y-6">
              <Skeleton height={30} width="46%" radius="10px" />
              <SkeletonText lines={4} height={13} />
            </div>
          </div>

          <div className="space-y-10">
            <div className="card-line card-line-static p-8">
              <Skeleton width={112} height={12} className="mb-6" />
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton height={11} width="46%" />
                    <Skeleton height={15} width="72%" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton width={88} height={12} className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width={78} height={32} radius="10px" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
