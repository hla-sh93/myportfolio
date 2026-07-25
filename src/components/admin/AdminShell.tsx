"use client";

import { signOutAction } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

/**
 * Dashboard chrome: fixed sidebar + sticky topbar, with the sidebar
 * collapsing to a drawer under lg. Holds the only client state the shell
 * needs (drawer open, user menu open) so pages stay server components.
 */
export function AdminShell({
  email,
  unread,
  children,
}: {
  email: string;
  unread: number;
  children: React.ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  const isDark = resolvedTheme === "dark";

  return (
    <div className="console-shell flex min-h-screen">
      <AdminSidebar
        open={drawer}
        onClose={() => setDrawer(false)}
        unread={unread}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md lg:px-6"
          style={{
            borderColor: "var(--panel-border)",
            background: "color-mix(in srgb, var(--panel-bg) 88%, transparent)",
          }}
        >
          <button
            onClick={() => setDrawer(true)}
            className="rounded-lg p-2 lg:hidden"
            style={{ color: "var(--panel-muted)" }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--panel-hover)]"
            style={{ color: "var(--panel-muted)" }}
            aria-label="Toggle theme"
          >
            {mounted && isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenu((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "var(--accent)" }}
              aria-label="Account menu"
              aria-expanded={menu}
            >
              {email.slice(0, 2).toUpperCase()}
            </button>

            {menu && (
              <div
                className="panel-card absolute end-0 top-12 w-60 overflow-hidden p-1.5"
                style={{ boxShadow: "var(--panel-shadow-lg)" }}
              >
                <p
                  className="truncate px-3 py-2 text-xs"
                  style={{ color: "var(--panel-muted)" }}
                >
                  {email}
                </p>
                <div
                  className="my-1 h-px"
                  style={{ background: "var(--panel-border)" }}
                />
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--panel-hover)]"
                    style={{ color: "#ea5455" }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
