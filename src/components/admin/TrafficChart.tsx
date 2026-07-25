"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type Point = { day: string; visits: number; views: number };

const shortDay = (d: string) => d.slice(5).replace("-", "/");

export function TrafficChart({ data }: { data: Point[] }) {
  const empty = data.every((d) => d.views === 0);

  if (empty) {
    return (
      <div
        className="flex h-[260px] flex-col items-center justify-center gap-1 text-center"
        style={{ color: "var(--panel-muted)" }}
      >
        <p className="text-sm font-medium">No traffic recorded yet</p>
        <p className="text-xs" style={{ color: "var(--panel-faint)" }}>
          Visits appear here as people browse the site.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--panel-faint)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--panel-faint)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--panel-border)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tickFormatter={shortDay}
            tick={{ fontSize: 11, fill: "var(--panel-faint)" }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--panel-faint)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "var(--panel-card)",
              border: "1px solid var(--panel-border)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--panel-text)",
              boxShadow: "var(--panel-shadow-lg)",
            }}
            labelStyle={{ color: "var(--panel-muted)", marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey="views"
            name="Page views"
            stroke="var(--panel-faint)"
            strokeWidth={1.5}
            fill="url(#gViews)"
          />
          <Area
            type="monotone"
            dataKey="visits"
            name="Visitors"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#gVisits)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
