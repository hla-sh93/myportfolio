import { LoadingStatus, Skeleton } from "@/components/ui/Skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons";

/** Contact — header, the three channel rows, and the underline form panel. */
export default function ContactLoading() {
  return (
    <>
      <LoadingStatus />
      <PageHeaderSkeleton />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12">
          {/* Channels */}
          <div className="lg:col-span-4">
            <ul>
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-5 border-b border-border py-6 first:border-t"
                >
                  <Skeleton width={48} height={48} radius="9999px" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <Skeleton height={11} width="42%" />
                    <Skeleton height={16} width="78%" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form panel */}
          <div className="lg:col-span-8">
            <div className="card-line card-line-static p-8 md:p-12">
              <Skeleton height={30} width="42%" radius="10px" />
              <div className="mt-10 flex flex-col gap-9">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton height={12} width="24%" />
                    <Skeleton height={1} radius="0" />
                  </div>
                ))}
                <div className="flex flex-col gap-3">
                  <Skeleton height={12} width="24%" />
                  <Skeleton height={96} radius="12px" />
                </div>
                <Skeleton width={184} height={50} radius="9999px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
