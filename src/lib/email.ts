import "server-only";
import { Resend } from "resend";

/**
 * Contact notifications.
 *
 * The form saves to the database and the panel lists what came in, but that
 * only helps someone who thinks to log in. An enquiry is worth nothing if it
 * waits a week, so a copy goes to the inbox that is printed on the site.
 *
 * Sending is best-effort on purpose: the message is already stored by the time
 * this runs, so a mail failure is logged and swallowed rather than shown to
 * the visitor as a failed submission.
 */

/** Where the site tells people to write. Keep the two in step. */
const DEFAULT_TO = "hla.shindeah@gmail.com";

/**
 * Resend delivers from its sandbox sender without a verified domain, which is
 * enough to get notifications working today. Once a domain is verified, point
 * EMAIL_FROM at an address on it.
 */
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

const key = process.env.RESEND_API_KEY?.trim();
// The repo ships a placeholder; treat it as absent rather than calling the API
// once per submission only to be told the key is invalid.
const usable = Boolean(key && key.startsWith("re_") && !/x{3,}/i.test(key));

export function contactEmailConfigured() {
  return usable;
}

export type ContactNotification = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactNotification(msg: ContactNotification) {
  if (!usable) {
    console.warn(
      "[email] RESEND_API_KEY is missing or a placeholder — the message was saved but not forwarded"
    );
    return { sent: false as const, reason: "not-configured" as const };
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
  const from = process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;

  try {
    const { data, error } = await new Resend(key).emails.send({
      from,
      to,
      // Replying goes straight back to whoever wrote in, not to the sender
      // address, which nobody reads.
      replyTo: msg.email,
      subject: `${msg.name} — ${msg.subject}`,
      text: [
        `From: ${msg.name} <${msg.email}>`,
        `Subject: ${msg.subject}`,
        "",
        msg.message,
      ].join("\n"),
      html: `<div dir="auto" style="font-family:system-ui,sans-serif;line-height:1.7">
  <p style="margin:0 0 4px"><strong>${escapeHtml(msg.name)}</strong>
    &lt;<a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a>&gt;</p>
  <p style="margin:0 0 16px;color:#666">${escapeHtml(msg.subject)}</p>
  <div style="white-space:pre-wrap;border-top:1px solid #eee;padding-top:16px">${escapeHtml(
    msg.message
  )}</div>
</div>`,
    });

    if (error) {
      console.error("[email] Resend rejected the contact notification", error);
      return { sent: false as const, reason: "rejected" as const };
    }
    return { sent: true as const, id: data?.id };
  } catch (e) {
    console.error("[email] could not send the contact notification", e);
    return { sent: false as const, reason: "threw" as const };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
