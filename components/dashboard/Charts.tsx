"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ── RevenuePie ───────────────────────────────────────────── */
const pieData = [
  { name: "Direct", value: 400, color: "#38E54D" },
  { name: "Social", value: 300, color: "#8B5CF6" },
  { name: "Referral", value: 300, color: "#EF4444" },
];

export function RevenuePie() {
  return (
    <div className="rounded-xl bg-[#18141c] p-6 shadow border border-[#231b2a]">
      <h3 className="text-white mb-4 text-base font-semibold">
        Revenue by Source
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            dataKey="value"
            data={pieData}
            innerRadius={48}
            outerRadius={70}
            stroke="none"
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-4 flex justify-between text-xs text-[#aaa]">
        {pieData.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: d.color }}
            />
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── TrafficLine ──────────────────────────────────────────── */
const lineData = [
  { date: "10 Apr", users: 200 },
  { date: "12 Apr", users: 380 },
  { date: "13 Apr", users: 300 },
  { date: "14 Apr", users: 450 },
  { date: "10 Apr", users: 520 },
];

export function TrafficLine() {
  return (
    <div className="rounded-xl bg-[#18141c] p-6 shadow border border-[#231b2a]">
      <h3 className="text-white mb-4 text-base font-semibold">Daily Traffic</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={lineData}>
          <XAxis
            dataKey="date"
            stroke="#aaa"
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#aaa" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#251f2c", border: 0, color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
