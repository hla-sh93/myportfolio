import { LoadingStatus } from "@/components/ui/Skeleton";
import {
  CTABannerSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
  ProjectCardSkeleton,
} from "@/components/skeletons";

/** Projects index — header, filter rail, then the 3-column work grid. */
export default function ProjectsLoading() {
  return (
    <>
      <LoadingStatus />
      <PageHeaderSkeleton />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <div className="flex w-full flex-col gap-8">
          <FilterBarSkeleton />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <CTABannerSkeleton />
    </>
  );
}
