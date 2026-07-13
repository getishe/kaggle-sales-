"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PieDatum {
  name: string;
  value: number;
}

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6"];

interface PieChartProps {
  data?: PieDatum[];
}

export default function PieChartComponent({ data = [] }: PieChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
