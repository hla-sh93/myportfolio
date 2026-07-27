import { LoadingStatus } from "@/components/ui/Skeleton";
import {
  BlogCardSkeleton,
  CTABannerSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons";

/** Tag archive — same shape as the blog index, without the filter rail. */
export default function BlogTagLoading() {
  return (
    <>
      <LoadingStatus />
      <PageHeaderSkeleton />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <CTABannerSkeleton />
    </>
  );
}
