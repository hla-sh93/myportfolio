import { getStoredMessages } from "@/lib/content-store";
import { MessagesList } from "./MessagesList";

export const metadata = { title: "Messages | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getStoredMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <header>
        <h1 className="text-xl font-bold">Messages</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ad-muted)" }}>
          {messages.length} received
          {unread ? ` · ${unread} unread` : " · inbox clear"}
        </p>
      </header>

      <MessagesList messages={messages} />
    </div>
  );
}
