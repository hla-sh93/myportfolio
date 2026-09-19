import { db } from "@/lib/db";
import { addMessage } from "@/lib/content-store";
import { sendContactNotification } from "@/lib/email";
import { contactSchema } from "@/lib/validations";
import {
  buildRateLimitResponse,
  contactRateLimit,
  getRateLimitIdentifier,
} from "@/lib/ratelimit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Honeypot — a filled hidden field is a bot. Answer as if it worked so
    //    it learns nothing.
    if (body?.website) {
      return NextResponse.json({ success: true, message: "Message received" }, { status: 200 });
    }

    // 2. Rate limit — 5 submissions per IP per hour. This used to be commented
    //    out, which left the form open to anyone with a loop.
    const limited = buildRateLimitResponse(
      await contactRateLimit.limit(`contact:${getRateLimitIdentifier(req)}`),
      "contact"
    );
    if (limited) return limited;

    // 3. Validate
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    // 4. reCAPTCHA — only when a secret is configured, and then a real token is
    //    required. There used to be a literal "dummy-token" escape hatch here
    //    that anyone could send; with a secret set, the check now fails closed.
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const token = data.recaptchaToken;
      if (!token || token === "dummy-token") {
        return NextResponse.json({ error: "Verification failed" }, { status: 400 });
      }
      const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      });
      const verdict = (await res.json()) as { success?: boolean; score?: number };
      if (!verdict.success || (verdict.score ?? 0) < 0.5) {
        return NextResponse.json({ error: "Verification failed" }, { status: 400 });
      }
    }

    // 5. Save — database when configured, file store otherwise
    const message = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };
    try {
      await db.contactMessage.create({ data: message });
    } catch {
      await addMessage(message);
    }

    // 6. Forward it. The message is saved by now, so a mail failure must not
    //    tell the visitor their enquiry did not go through — it did.
    await sendContactNotification(message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
