import "server-only";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Admin access, checked by every page that reads admin data, not once in the
 * (panel) layout.
 *
 * Next renders a layout and its page independently. A client-navigation
 * request can ask for the page segment on its own, and then the layout's
 * redirect never runs: an anonymous request with a hand-written router-state
 * header was enough to read the projects table, the dashboard figures and the
 * contact inbox. A page that checks for itself has no such gap.
 */
export function isAdmin(session: Session | null): session is Session {
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "ADMIN";
}

/** For pages: no admin session, no render. */
export async function requireAdminPage(): Promise<Session> {
  const session = await auth();
  if (!isAdmin(session)) redirect("/admin/login");
  return session;
}
