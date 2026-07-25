"use client";

import type { StoredMessage } from "@/lib/content-store";
import { ChevronDown, ChevronUp, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMessageAction, setMessageReadAction } from "../../actions";

export function MessageRow({ message }: { message: StoredMessage }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && !message.read) {
      start(async () => {
        await setMessageReadAction(message.id, true);
        router.refresh();
      });
    }
  };

  return (
    <li className={pending ? "opacity-60" : ""}>
      <div
        className="flex items-center gap-4 px-3 py-3 cursor-pointer hover:bg-bg-elevated/50 rounded-lg transition-colors"
        onClick={toggleOpen}
      >
        <span
          className={`p-2 rounded-lg shrink-0 ${
            message.read
              ? "text-text-secondary bg-bg-elevated"
              : "text-accent bg-accent/10"
          }`}
        >
          {message.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`truncate ${message.read ? "font-medium" : "font-bold"}`}>
            {message.name}
            <span className="text-text-secondary font-normal text-sm mx-2">
              {message.email}
            </span>
          </p>
          <p className="text-sm text-text-secondary truncate">
            <span className="font-medium text-text-primary/80">{message.subject}</span>
            {" — "}
            {message.message}
          </p>
        </div>
        <time className="text-xs text-text-secondary shrink-0">
          {new Date(message.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        {open ? (
          <ChevronUp className="w-4 h-4 text-text-secondary shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-secondary shrink-0" />
        )}
      </div>

      {open && (
        <div className="px-16 pb-4 space-y-4">
          <p className="text-sm text-text-primary whitespace-pre-wrap bg-bg-elevated rounded-xl p-4">
            {message.message}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              <Reply className="w-4 h-4" />
              Reply by email
            </a>
            <button
              onClick={() =>
                start(async () => {
                  await setMessageReadAction(message.id, !message.read);
                  router.refresh();
                })
              }
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-elevated transition-colors"
            >
              Mark as {message.read ? "unread" : "read"}
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this message?"))
                  start(async () => {
                    await deleteMessageAction(message.id);
                    router.refresh();
                  });
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
