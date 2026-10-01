import { AdminShell } from "@/components/admin/AdminShell";
import { getStoredMessages } from "@/lib/content-store";
import { requireAdminPage } from "@/lib/admin-guard";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminPage();

  const messages = await getStoredMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <AdminShell email={session.user.email ?? "admin"} unread={unread}>
      {children}
    </AdminShell>
  );
}
