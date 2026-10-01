import { bump } from "@/lib/counter-store";
import { recordHit } from "@/lib/analytics-store";
import { getPublicArticles, getPublicProjects } from "@/lib/content";
import {
  apiRateLimit,
  buildRateLimitResponse,
  getRateLimitIdentifier,
  likeRateLimit,
} from "@/lib/ratelimit";
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

/** The routes that report a page view; see the <ViewTracker type="page"> sites. */
const PAGE_SLUGS = new Set(["home", "about", "projects", "blog", "contact"]);

/**
 * Only published content gets counted. Any slug that matched the pattern
 * used to create counter and daily-stat rows, and so a place on the
 * dashboard's top list.
 */
async function isKnown(type: "project" | "article" | "page", slug: string) {
  if (type === "page") return PAGE_SLUGS.has(slug);
  const items = type === "project" ? await getPublicProjects() : await getPublicArticles();
  return items.some((item) => item.slug === slug);
}

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

  // Per IP: 100 views a minute, 10 likes a minute. There was no limit, so a
  // loop could inflate any counter at will.
  const ip = getRateLimitIdentifier(req);
  const limited = buildRateLimitResponse(
    action === "view"
      ? await apiRateLimit.limit(`track:${ip}`)
      : await likeRateLimit.limit(`like:${ip}`),
    "track"
  );
  if (limited) return limited;

  if (!(await isKnown(type, slug))) {
    return NextResponse.json({ error: "Unknown content" }, { status: 404 });
  }

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
