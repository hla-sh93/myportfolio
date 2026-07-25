import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getStoredMessages } from "@/lib/content-store";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const messages = await getStoredMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <AdminShell email={session.user.email ?? "admin"} unread={unread}>
      {children}
    </AdminShell>
  );
}
