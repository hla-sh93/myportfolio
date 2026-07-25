/**
 * Daily-aggregated traffic.
 *
 * One row per (day, kind, slug) holding two counters — never a per-visitor
 * log. That keeps the table tiny (a few rows per day) and means no IP,
 * user-agent or any other personal data is stored.
 *
 *   views  — every page view
 *   visits — first view of a browser session (the "visitors" number)
 *
 * Postgres when reachable, a JSON file otherwise, same as the content store.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";

export type TrafficKind = "page" | "project" | "article";

export type DailyRow = {
  day: string; // YYYY-MM-DD (UTC)
  kind: TrafficKind;
  slug: string;
  views: number;
  visits: number;
};

const FILE = path.join(process.cwd(), "data", "analytics.json");

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Inclusive list of the last `n` days ending today, oldest first. */
export function lastDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(dayKey(d));
  }
  return out;
}

/* ── file fallback ────────────────────────────────────────────────────── */

function readFileRows(): DailyRow[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as DailyRow[];
  } catch {
    return [];
  }
}

function writeFileRows(rows: DailyRow[]) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(rows, null, 1));
  } catch {
    /* read-only FS — dev/local only */
  }
}

/* ── writes ───────────────────────────────────────────────────────────── */

/**
 * Record one hit. `isNewSession` comes from the client (first view in this
 * browser session) and is what separates "visits" from raw "views".
 */
export async function recordHit(
  kind: TrafficKind,
  slug: string,
  isNewSession: boolean
): Promise<void> {
  const day = today();
  const visitInc = isNewSession ? 1 : 0;

  try {
    await db.dailyStat.upsert({
      where: { day_kind_slug: { day, kind, slug } },
      create: { day, kind, slug, views: 1, visits: visitInc },
      update: {
        views: { increment: 1 },
        visits: { increment: visitInc },
      },
    });
    return;
  } catch {
    /* fall through to the file store */
  }

  const rows = readFileRows();
  const row = rows.find(
    (r) => r.day === day && r.kind === kind && r.slug === slug
  );
  if (row) {
    row.views += 1;
    row.visits += visitInc;
  } else {
    rows.push({ day, kind, slug, views: 1, visits: visitInc });
  }
  writeFileRows(rows);
}

/* ── reads ────────────────────────────────────────────────────────────── */

export async function getRows(sinceDay?: string): Promise<DailyRow[]> {
  try {
    const rows = await db.dailyStat.findMany({
      where: sinceDay ? { day: { gte: sinceDay } } : undefined,
      orderBy: { day: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        day: r.day,
        kind: r.kind as TrafficKind,
        slug: r.slug,
        views: r.views,
        visits: r.visits,
      }));
    }
  } catch {
    /* fall through */
  }
  const rows = readFileRows();
  return sinceDay ? rows.filter((r) => r.day >= sinceDay) : rows;
}

export type TrafficSeries = { day: string; visits: number; views: number }[];

/** Visits + views per day for the last `days` days, zero-filled. */
export async function getTrafficSeries(days = 30): Promise<TrafficSeries> {
  const window = lastDays(days);
  const rows = await getRows(window[0]);
  const byDay = new Map(window.map((d) => [d, { day: d, visits: 0, views: 0 }]));
  for (const r of rows) {
    const bucket = byDay.get(r.day);
    if (bucket) {
      bucket.visits += r.visits;
      bucket.views += r.views;
    }
  }
  return [...byDay.values()];
}

export type TrafficTotals = {
  visits: number;
  views: number;
  prevVisits: number;
  prevViews: number;
  /** percent change vs the previous window; null when there is no baseline */
  visitsChange: number | null;
};

/**
 * Totals for the last `days` days plus the window before it, so the dashboard
 * can show a real trend instead of a made-up one.
 */
export async function getTrafficTotals(days = 30): Promise<TrafficTotals> {
  const all = await getRows(lastDays(days * 2)[0]);
  const current = new Set(lastDays(days));

  let visits = 0,
    views = 0,
    prevVisits = 0,
    prevViews = 0;

  for (const r of all) {
    if (current.has(r.day)) {
      visits += r.visits;
      views += r.views;
    } else {
      prevVisits += r.visits;
      prevViews += r.views;
    }
  }

  const visitsChange =
    prevVisits > 0 ? Math.round(((visits - prevVisits) / prevVisits) * 100) : null;

  return { visits, views, prevVisits, prevViews, visitsChange };
}

/** All-time visit total across every recorded day. */
export async function getAllTimeVisits(): Promise<number> {
  const rows = await getRows();
  return rows.reduce((n, r) => n + r.visits, 0);
}

/** Top slugs of one kind by views, most viewed first. */
export async function getTopSlugs(
  kind: TrafficKind,
  limit = 5
): Promise<{ slug: string; views: number; visits: number }[]> {
  const rows = await getRows();
  const totals = new Map<string, { slug: string; views: number; visits: number }>();
  for (const r of rows) {
    if (r.kind !== kind) continue;
    const t = totals.get(r.slug) ?? { slug: r.slug, views: 0, visits: 0 };
    t.views += r.views;
    t.visits += r.visits;
    totals.set(r.slug, t);
  }
  return [...totals.values()].sort((a, b) => b.views - a.views).slice(0, limit);
}
