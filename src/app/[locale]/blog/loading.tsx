import { LoadingStatus, Skeleton } from "@/components/ui/Skeleton";
import {
  BlogCardSkeleton,
  CTABannerSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons";

/** Blog index — header, tag rail + search, then the article grid. */
export default function BlogLoading() {
  return (
    <>
      <LoadingStatus />
      <PageHeaderSkeleton />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <div className="flex w-full flex-col gap-8">
          <FilterBarSkeleton pills={4} />
          <Skeleton width={92} height={12} className="self-end" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <CTABannerSkeleton />
    </>
  );
}
