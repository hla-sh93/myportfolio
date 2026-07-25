import { TrafficChart } from "@/components/admin/TrafficChart";
import {
  getAllTimeVisits,
  getTopSlugs,
  getTrafficSeries,
  getTrafficTotals,
} from "@/lib/analytics-store";
import {
  getStoredArticles,
  getStoredMessages,
  getStoredProjects,
} from "@/lib/content-store";
import { getCounters } from "@/lib/counters";
import {
  Eye,
  FileText,
  FolderOpen,
  Heart,
  Inbox,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Overview | Admin" };
export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
  change,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number | string;
  hint?: string;
  change?: number | null;
  icon: React.ElementType;
  tint: string;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="panel-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "var(--panel-muted)" }}
          >
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${tint}1a`, color: tint }}
        >
          <Icon size={19} />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {change != null && (
          <span
            className="inline-flex items-center gap-1 font-semibold"
            style={{ color: up ? "#28c76f" : "#ea5455" }}
          >
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {up ? "+" : ""}
            {change}%
          </span>
        )}
        {hint && <span style={{ color: "var(--panel-muted)" }}>{hint}</span>}
      </div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="panel-card">
      <header
        className="flex items-center justify-between border-b px-5 py-4"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="text-xs font-semibold"
            style={{ color: "var(--accent)" }}
          >
            {action.label} →
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="px-5 py-10 text-center text-sm"
      style={{ color: "var(--panel-muted)" }}
    >
      {children}
    </p>
  );
}

export default async function AdminOverviewPage() {
  const [
    projects,
    articles,
    messages,
    projCounters,
    artCounters,
    series,
    totals,
    allTimeVisits,
    topProjectSlugs,
    topArticleSlugs,
  ] = await Promise.all([
    getStoredProjects(),
    getStoredArticles(),
    getStoredMessages(),
    getCounters("project"),
    getCounters("article"),
    getTrafficSeries(30),
    getTrafficTotals(30),
    getAllTimeVisits(),
    getTopSlugs("project", 5),
    getTopSlugs("article", 5),
  ]);

  const totalLikes = Object.values(projCounters).reduce((s, c) => s + c.likes, 0);
  const projectViews = Object.values(projCounters).reduce((s, c) => s + c.views, 0);
  const articleViews = Object.values(artCounters).reduce((s, c) => s + c.views, 0);
  const unread = messages.filter((m) => !m.read).length;

  // Daily rows only exist from the day tracking went live, so fall back to the
  // cumulative counters — otherwise these tables read empty despite real views.
  const topProjects = (
    topProjectSlugs.length > 0
      ? topProjectSlugs
      : Object.entries(projCounters)
          .map(([slug, c]) => ({ slug, views: c.views, visits: 0 }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
  )
    .map((t) => {
      const p = projects.find((x) => x.slug === t.slug);
      return p
        ? {
            slug: t.slug,
            views: t.views,
            id: p.id,
            title: p.titleEn,
            likes: projCounters[t.slug]?.likes ?? 0,
          }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const topArticles = (
    topArticleSlugs.length > 0
      ? topArticleSlugs
      : Object.entries(artCounters)
          .map(([slug, c]) => ({ slug, views: c.views, visits: 0 }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
  )
    .map((t) => {
      const a = articles.find((x) => x.slug === t.slug);
      return a ? { slug: t.slug, views: t.views, id: a.id, title: a.titleEn } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <header>
        <h1 className="text-xl font-bold">Overview</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--panel-muted)" }}>
          Live numbers from the site — nothing estimated.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Visitors"
          value={allTimeVisits}
          hint="all time"
          change={totals.visitsChange}
          icon={Users}
          tint="#7367f0"
        />
        <StatCard
          label="Project views"
          value={projectViews}
          hint={`${projects.length} projects`}
          icon={FolderOpen}
          tint="#00cfe8"
        />
        <StatCard
          label="Article reads"
          value={articleViews}
          hint={`${articles.length} articles`}
          icon={FileText}
          tint="#28c76f"
        />
        <StatCard
          label="Likes"
          value={totalLikes}
          hint="across projects"
          icon={Heart}
          tint="#ea5455"
        />
        <StatCard
          label="Messages"
          value={messages.length}
          hint={unread ? `${unread} unread` : "inbox clear"}
          icon={Inbox}
          tint="#ff9f43"
        />
      </div>

      <Panel title="Traffic — last 30 days">
        <div className="p-4">
          <TrafficChart data={series} />
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Top projects"
          action={{ href: "/admin/projects", label: "All projects" }}
        >
          {topProjects.length === 0 ? (
            <EmptyRow>No project views recorded yet.</EmptyRow>
          ) : (
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th className="w-24 text-end">Views</th>
                  <th className="w-20 text-end">Likes</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map((p) => (
                  <tr key={p.slug}>
                    <td>
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="text-end tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={13} style={{ color: "var(--panel-faint)" }} />
                        {p.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-end tabular-nums">{p.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel
          title="Top articles"
          action={{ href: "/admin/blog", label: "All articles" }}
        >
          {topArticles.length === 0 ? (
            <EmptyRow>No article reads recorded yet.</EmptyRow>
          ) : (
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th className="w-24 text-end">Reads</th>
                </tr>
              </thead>
              <tbody>
                {topArticles.map((a) => (
                  <tr key={a.slug}>
                    <td>
                      <Link
                        href={`/admin/blog/${a.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="text-end tabular-nums">
                      {a.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>

      <Panel
        title="Latest messages"
        action={{ href: "/admin/messages", label: "Inbox" }}
      >
        {messages.length === 0 ? (
          <EmptyRow>No messages yet.</EmptyRow>
        ) : (
          <ul>
            {messages.slice(0, 3).map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 border-b px-5 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--panel-border)" }}
              >
                {!m.read && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {m.name}
                    <span
                      className="font-normal"
                      style={{ color: "var(--panel-muted)" }}
                    >
                      {" · "}
                      {m.subject}
                    </span>
                  </p>
                  <p
                    className="truncate text-xs"
                    style={{ color: "var(--panel-muted)" }}
                  >
                    {m.message}
                  </p>
                </div>
                <time
                  className="shrink-0 text-xs tabular-nums"
                  style={{ color: "var(--panel-faint)" }}
                >
                  {new Date(m.createdAt).toLocaleDateString("en-GB")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
