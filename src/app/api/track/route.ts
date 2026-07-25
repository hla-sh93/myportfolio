import { bump } from "@/lib/counter-store";
import { recordHit } from "@/lib/analytics-store";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Two things happen here, both keyed only by content slug — no IP, no
 * user-agent, nothing personal is stored:
 *
 *  1. Engagement counters (cumulative views + likes) per project/article.
 *  2. Daily traffic aggregates that power the dashboard charts.
 *
 * POST /api/track
 *   { type: "project" | "article", slug, action: "view" | "like" | "unlike" }
 *     → { views, likes }
 *   { type: "page", slug, action: "view", newSession? }
 *     → { ok: true }            (routes without a counter, e.g. /about)
 *
 * View dedup is client-side (sessionStorage, once per session per slug);
 * `newSession` marks the first view in a browser session, which is what
 * separates "visitors" from raw page views.
 */
const bodySchema = z.object({
  type: z.enum(["project", "article", "page"]),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9/_-]+$/i),
  action: z.enum(["view", "like", "unlike"]),
  newSession: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { type, slug, action, newSession } = parsed.data;

  // Traffic aggregate — views only; likes are engagement, not traffic.
  if (action === "view") {
    await recordHit(type, slug, newSession === true);
  }

  // Plain page views have no counter row to bump.
  if (type === "page") {
    return NextResponse.json({ ok: true });
  }

  const counter = await bump(type, slug, action);
  return NextResponse.json(counter);
}
