import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Article skeleton — centred header, 21:9 cover, then the reading column with
 * the sticky table-of-contents rail. Same reserved heights as the real page so
 * the text doesn't jump when it arrives.
 */
export default function ArticleLoading() {
  return (
    <article className="min-h-screen pb-16 pt-24 md:pb-24">
      <LoadingStatus />

      {/* Header */}
      <header className="container mx-auto mb-12 max-w-4xl px-6 text-center md:mb-20">
        <div className="mb-10 flex justify-center">
          <Skeleton width={96} height={14} />
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
          <Skeleton width={112} height={14} />
          <Skeleton width={96} height={14} />
          <Skeleton width={64} height={14} />
        </div>

        <div className="mb-8 flex flex-col items-center gap-4">
          <Skeleton height={40} width="88%" radius="12px" />
          <Skeleton height={40} width="62%" radius="12px" />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width={96} height={30} radius="9999px" />
          ))}
        </div>
      </header>

      {/* Cover */}
      <div className="container mx-auto mb-16 max-w-5xl px-6 md:mb-24">
        <Skeleton aspect="21 / 9" radius="30px" />
      </div>

      {/* Body + table of contents */}
      <div className="container mx-auto max-w-6xl px-6">
        <div className="relative flex flex-col gap-16 xl:flex-row">
          <div className="w-full shrink-0 xl:w-[calc(100%-20rem)]">
            <div className="flex flex-col gap-10">
              <SkeletonText lines={5} height={13} />
              <Skeleton height={28} width="42%" radius="10px" />
              <SkeletonText lines={6} height={13} />
              <Skeleton aspect="16 / 9" radius="20px" />
              <SkeletonText lines={4} height={13} />
            </div>
          </div>

          <aside className="hidden w-72 shrink-0 xl:block">
            <div className="sticky top-[calc(var(--navbar-height)+24px)] flex flex-col gap-4">
              <Skeleton width={128} height={13} />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  height={11}
                  width={i % 2 === 0 ? "88%" : "70%"}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
