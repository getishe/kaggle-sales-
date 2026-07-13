"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDatum {
  month: string;
  sales: number;
  [key: string]: any;
}

interface LineChartProps {
  data?: ChartDatum[];
  threshold?: number;
}

export default function LineChartComponent({
  data = [],
  threshold = 0,
}: LineChartProps) {
  const filteredData = (data || []).filter((item) => item.sales >= threshold);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#10b981"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
