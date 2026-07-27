import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import {
  CTABannerSkeleton,
  PageHeaderSkeleton,
  SectionSkeleton,
} from "@/components/skeletons";

/** About — header, the experience timeline, then the skills grid. */
export default function AboutLoading() {
  return (
    <>
      <LoadingStatus />
      <PageHeaderSkeleton />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Experience */}
        <SectionSkeleton>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SkeletonText lines={3} height={13} />
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-14">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="ps-16">
                    <Skeleton width={128} height={12} />
                    <Skeleton height={22} width="58%" className="mt-4" />
                    <div className="mt-4">
                      <SkeletonText lines={2} height={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionSkeleton>

        {/* Skills */}
        <SectionSkeleton>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={92} radius="30px" />
            ))}
          </div>
        </SectionSkeleton>
      </div>

      <CTABannerSkeleton />
    </>
  );
}
