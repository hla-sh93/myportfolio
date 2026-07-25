"use client";

import {
  Award,
  BarChart3,
  Briefcase,
  FileText,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: React.ElementType; badge?: number };

const GROUPS: { caption?: string; items: Item[] }[] = [
  { items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }] },
  {
    caption: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderOpen },
      { href: "/admin/blog", label: "Articles", icon: FileText },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
      { href: "/admin/experiences", label: "Experience", icon: Briefcase },
      { href: "/admin/highlights", label: "Highlights", icon: BarChart3 },
    ],
  },
  { caption: "Inbox", items: [{ href: "/admin/messages", label: "Messages", icon: Inbox }] },
];

export function AdminSidebar({
  open,
  onClose,
  unread = 0,
}: {
  open: boolean;
  onClose: () => void;
  unread?: number;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-[260px] shrink-0 flex-col border-e transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
        style={{
          background: "var(--panel-card)",
          borderColor: "var(--panel-border)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black text-white"
              style={{ background: "var(--accent)" }}
            >
              HS
            </span>
            <span className="text-[15px] font-bold tracking-tight">
              Portfolio
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 lg:hidden"
            style={{ color: "var(--panel-muted)" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.caption && <p className="panel-caption">{group.caption}</p>}
              <ul className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="panel-nav"
                      data-active={isActive(href)}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="flex-1">{label}</span>
                      {href === "/admin/messages" && unread > 0 && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                          style={{
                            background: isActive(href)
                              ? "rgba(255,255,255,0.25)"
                              : "var(--accent)",
                          }}
                        >
                          {unread}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className="border-t px-5 py-4"
          style={{ borderColor: "var(--panel-border)" }}
        >
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--panel-muted)" }}
          >
            View live site ↗
          </a>
        </div>
      </aside>
    </>
  );
}
