"use client";

import {
  BarChart,
  Bar,
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

interface BarChartProps {
  data?: ChartDatum[];
  threshold?: number;
}

export default function BarChartComponent({
  data = [],
  threshold = 0,
}: BarChartProps) {
  const filteredData = (data || []).filter((item) => item.sales >= threshold);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
          <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
