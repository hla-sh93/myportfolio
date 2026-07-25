import { getStoredMessages } from "@/lib/content-store";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageRow } from "./MessageRow";

export const metadata = { title: "Messages | Admin" };
export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  const messages = getStoredMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Messages</h1>
        <p className="text-text-secondary mt-2">
          {messages.length} received{unread ? ` · ${unread} unread` : ""} — from
          the contact form.
        </p>
      </header>

      <GlassCard padding="sm">
        {messages.length === 0 ? (
          <p className="px-3 py-12 text-center text-text-secondary">
            No messages yet. When someone submits the contact form it appears
            here.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
