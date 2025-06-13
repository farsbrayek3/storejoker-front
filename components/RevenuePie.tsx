/* RevenuePie.tsx */
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Direct", value: 400, color: "#00A86B" },
  { name: "Social", value: 300, color: "#7A3DF4" },
  { name: "Referral", value: 300, color: "#FF3B58" },
];
export function RevenuePie() {
  return (
    <div className="bg-surface rounded-xl p-6">
      <h3 className="mb-4">Revenue by Source</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={60} outerRadius={100}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
