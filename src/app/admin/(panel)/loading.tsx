import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Dashboard skeleton — covers every panel route (stats row, then a card).
 * It speaks the console's own language (`panel-card`, 10px radius), not the
 * public site's editorial one.
 *
 * No <LoadingStatus/> here: the admin shell isn't wrapped in the next-intl
 * client provider, so it announces the wait with a plain string instead.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <span role="status" aria-live="polite" className="sr-only">
        Loading…
      </span>

      {/* Page title */}
      <div className="flex flex-col gap-3">
        <Skeleton height={26} width={220} radius="8px" />
        <Skeleton height={12} width={320} />
      </div>

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="panel-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton height={11} width="60%" />
                <Skeleton height={24} width="42%" radius="6px" />
              </div>
              <Skeleton width={42} height={42} radius="10px" />
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="panel-card overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--panel-border)] p-5">
          <Skeleton height={16} width={180} radius="6px" />
          <Skeleton height={34} width={128} radius="8px" />
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-[var(--panel-border)] px-5 py-4 last:border-b-0"
            >
              <Skeleton width={40} height={40} radius="8px" />
              <div className="flex flex-1 flex-col gap-2.5">
                <Skeleton height={12} width="46%" />
                <Skeleton height={10} width="28%" />
              </div>
              <Skeleton width={72} height={24} radius="9999px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
