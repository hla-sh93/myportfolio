import { auth } from "@/auth";
import {
  BarChart3,
  Briefcase,
  FileText,
  FolderOpen,
  Inbox,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "../SignOutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Articles", icon: FileText },
  { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { href: "/admin/highlights", label: "Highlights", icon: BarChart3 },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex">
      <aside className="w-64 border-r border-border bg-bg-elevated/50 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-black text-accent tracking-tighter">
            PORTFOLIO<span className="text-text-primary">ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4 px-4 font-medium text-sm text-text-secondary truncate">
            {session.user.email}
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
