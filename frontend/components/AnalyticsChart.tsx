"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Mock analytics data since backend doesn't track clicks yet
// Replace with real API call when analytics endpoint is added
function generateMockData(shortCode: string) {
  const days = 14;
  const seed = shortCode.charCodeAt(0) + shortCode.charCodeAt(shortCode.length - 1);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      clicks: Math.floor(Math.random() * 40 * ((seed % 5) + 1)) + 2,
    };
  });
}

interface AnalyticsChartProps {
  shortCode: string;
}

export default function AnalyticsChart({ shortCode }: AnalyticsChartProps) {
  const data = generateMockData(shortCode);
  const total = data.reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "20px" }}>
        <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-text-primary)" }}>
          {total}
        </span>
        <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
          total clicks — last 14 days
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              color: "var(--color-text-primary)",
              fontSize: "13px",
            }}
            cursor={{ stroke: "var(--color-accent)", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#accentGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#6366f1",
              stroke: "var(--color-bg)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
