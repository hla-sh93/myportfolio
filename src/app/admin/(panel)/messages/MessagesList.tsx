"use client";

import { deleteMessageAction, setMessageReadAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import type { StoredMessage } from "@/lib/content-store";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MailOpen,
  Reply,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export function MessagesList({ messages }: { messages: StoredMessage[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, start] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (filter === "read" && !m.read) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, query, filter]);

  const toggleOpen = (m: StoredMessage) => {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && !m.read) {
      start(async () => {
        await setMessageReadAction(m.id, true);
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="panel-field max-w-xs"
          placeholder="Search name, email or text…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="panel-field max-w-[150px]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <span className="text-sm" style={{ color: "var(--panel-muted)" }}>
          {filtered.length} of {messages.length}
        </span>
      </div>

      <div className={`panel-card overflow-hidden ${pending ? "opacity-60" : ""}`}>
        {filtered.length === 0 ? (
          <p
            className="px-5 py-14 text-center text-sm"
            style={{ color: "var(--panel-muted)" }}
          >
            {messages.length === 0
              ? "No messages yet. Submissions from the contact form land here."
              : "Nothing matches this filter."}
          </p>
        ) : (
          <ul>
            {filtered.map((m) => {
              const open = openId === m.id;
              return (
                <li
                  key={m.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "var(--panel-border)" }}
                >
                  <div
                    className="flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--panel-hover)]"
                    onClick={() => toggleOpen(m)}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={
                        m.read
                          ? { background: "var(--panel-hover)", color: "var(--panel-muted)" }
                          : { background: "var(--accent-light)", color: "var(--accent)" }
                      }
                    >
                      {m.read ? <MailOpen size={15} /> : <Mail size={15} />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm ${m.read ? "font-medium" : "font-bold"}`}
                      >
                        {m.name}
                        <span
                          className="ms-2 font-normal"
                          style={{ color: "var(--panel-muted)" }}
                        >
                          {m.email}
                        </span>
                      </p>
                      <p
                        className="truncate text-xs"
                        style={{ color: "var(--panel-muted)" }}
                      >
                        <span className="font-medium">{m.subject}</span>
                        {" — "}
                        {m.message}
                      </p>
                    </div>

                    <time
                      className="shrink-0 text-xs tabular-nums"
                      style={{ color: "var(--panel-faint)" }}
                    >
                      {new Date(m.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    {open ? (
                      <ChevronUp size={15} style={{ color: "var(--panel-faint)" }} />
                    ) : (
                      <ChevronDown size={15} style={{ color: "var(--panel-faint)" }} />
                    )}
                  </div>

                  {open && (
                    <div className="space-y-3 px-5 pb-4 ps-[4.25rem]">
                      <p
                        className="whitespace-pre-wrap rounded-lg p-4 text-sm"
                        style={{ background: "var(--panel-hover)" }}
                      >
                        {m.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${m.email}?subject=${encodeURIComponent(
                            `Re: ${m.subject}`
                          )}`}
                          className="panel-btn panel-btn-primary !py-1.5 text-xs"
                        >
                          <Reply size={14} />
                          Reply by email
                        </a>
                        <button
                          className="panel-btn panel-btn-ghost !py-1.5 text-xs"
                          onClick={() =>
                            start(async () => {
                              await setMessageReadAction(m.id, !m.read);
                              router.refresh();
                            })
                          }
                        >
                          Mark as {m.read ? "unread" : "read"}
                        </button>
                        {confirmId === m.id ? (
                          <>
                            <button
                              className="panel-btn panel-btn-danger !py-1.5 text-xs"
                              onClick={() =>
                                start(async () => {
                                  await deleteMessageAction(m.id);
                                  setConfirmId(null);
                                  toast({
                                    title: "Message deleted",
                                    variant: "success",
                                  });
                                  router.refresh();
                                })
                              }
                            >
                              Confirm delete
                            </button>
                            <button
                              className="panel-btn panel-btn-ghost !py-1.5 text-xs"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="panel-btn panel-btn-danger !py-1.5 text-xs"
                            onClick={() => setConfirmId(m.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
