import { GlassCard } from "@/components/ui/GlassCard";
import { getCounters } from "@/lib/counters";
import {
  getStoredArticles,
  getStoredMessages,
  getStoredProjects,
} from "@/lib/content-store";
import { Eye, FileText, FolderOpen, Heart, Inbox } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const projects = getStoredProjects();
  const articles = getStoredArticles();
  const messages = getStoredMessages();
  const [projCounters, artCounters] = await Promise.all([
    getCounters("project"),
    getCounters("article"),
  ]);

  const totalLikes = Object.values(projCounters).reduce((s, c) => s + c.likes, 0);
  const totalViews =
    Object.values(projCounters).reduce((s, c) => s + c.views, 0) +
    Object.values(artCounters).reduce((s, c) => s + c.views, 0);
  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    {
      title: "Projects",
      value: projects.length,
      description: `${projects.filter((p) => p.published).length} published · ${projects.filter((p) => p.featured).length} featured`,
      icon: <FolderOpen className="w-5 h-5 text-accent" />,
      colorClass: "bg-accent/10 border-accent/20",
      href: "/admin/projects",
    },
    {
      title: "Articles",
      value: articles.length,
      description: `${articles.filter((a) => a.published).length} published`,
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      colorClass: "bg-blue-500/10 border-blue-500/20",
      href: "/admin/blog",
    },
    {
      title: "Likes",
      value: totalLikes,
      description: "Across all projects",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      colorClass: "bg-red-500/10 border-red-500/20",
      href: "/admin/projects",
    },
    {
      title: "Views",
      value: totalViews,
      description: "Projects + articles",
      icon: <Eye className="w-5 h-5 text-emerald-500" />,
      colorClass: "bg-emerald-500/10 border-emerald-500/20",
      href: "/admin/projects",
    },
    {
      title: "Messages",
      value: messages.length,
      description: unread ? `${unread} unread` : "Inbox clear",
      icon: <Inbox className="w-5 h-5 text-amber-500" />,
      colorClass: "bg-amber-500/10 border-amber-500/20",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Overview of your portfolio activity.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <GlassCard
              padding="md"
              className="flex flex-col relative overflow-hidden h-full hover:border-accent/40 transition-colors"
            >
              <div
                className={`absolute top-0 right-0 p-4 -translate-y-1/4 translate-x-1/4 rounded-full blur-2xl opacity-50 ${stat.colorClass} w-24 h-24`}
              />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-text-secondary">{stat.title}</h3>
                <div
                  className={`p-2 rounded-lg ${stat.colorClass} backdrop-blur-sm border`}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-black text-text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {stat.description}
                </p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Latest messages preview */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Latest messages</h2>
          <Link href="/admin/messages" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        {messages.length === 0 ? (
          <p className="text-text-secondary text-sm">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {messages.slice(0, 5).map((m) => (
              <li key={m.id} className="py-3 flex items-center gap-4">
                {!m.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {m.name} <span className="text-text-secondary font-normal">· {m.subject}</span>
                  </p>
                  <p className="text-sm text-text-secondary truncate">{m.message}</p>
                </div>
                <time className="text-xs text-text-secondary shrink-0">
                  {new Date(m.createdAt).toLocaleDateString("en-GB")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
