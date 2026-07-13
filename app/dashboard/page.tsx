"use client";

import { useEffect, useState } from "react";
import BarChartComponent from "@/components/charts/BarChart";
import LineChartComponent from "@/components/charts/LineChart";
import PieChartComponent from "@/components/charts/PieChart";
import StatCard from "@/components/StatCard";
import FilterInput from "@/components/FilterInput";
import ChartTypeSelector from "@/components/ChartTypeSelector";

type ChartType = "bar" | "line" | "pie";

export default function Dashboard() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [threshold, setThreshold] = useState<number>(0);
  const [year, setYear] = useState<string>("2024");
  const [data, setData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (chartType === "pie") {
          const res = await fetch(`/api/sales`);
          if (!res.ok) throw new Error(String(res.status));
          const json = await res.json();
          const totals = ["2022", "2023", "2024"].map((y) => ({
            name: y,
            value:
              json[y]?.reduce((s: number, it: any) => s + it.sales, 0) || 0,
          }));
          setPieData(totals);
          setData([]);
        } else {
          const res = await fetch(
            `/api/sales?year=${encodeURIComponent(year)}`,
          );
          if (!res.ok) throw new Error(String(res.status));
          const json = await res.json();
          setData(json.data || []);
          setPieData(null);
        }
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [year, chartType]);

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <div className="dashboard-header panel">
          <h1 className="dashboard-title">Sales Dashboard</h1>
          <p className="dashboard-subtitle">
            Comprehensive sales overview for 2022, 2023, and 2024
          </p>
        </div>

        <div className="stats-grid">
          <StatCard title="Total Sales" value="$1,250,000" trend="+12%" />
          <StatCard title="Average Monthly" value="$103,333" trend="+8%" />
          <StatCard title="Peak Month" value="$115,000" trend="May 2024" />
        </div>

        <div className="control-panel">
          <div className="controls-grid">
            <div>
              <label className="label-text">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="input-field"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <FilterInput onThresholdChange={setThreshold} />
            <ChartTypeSelector
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </div>
        </div>

        <div className="chart-card panel">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="chart-title">Sales Trend (2022-2024)</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              Current view:{" "}
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </span>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Showing a {chartType} chart for the selected year and threshold.
          </p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && (
            <>
              {chartType === "bar" && (
                <BarChartComponent data={data} threshold={threshold} />
              )}
              {chartType === "line" && (
                <LineChartComponent data={data} threshold={threshold} />
              )}
              {chartType === "pie" && pieData && (
                <PieChartComponent data={pieData} />
              )}
            </>
          )}
        </div>

        <div className="summary-grid">
          <div className="card">
            <h3 className="card-label">2024 Sales</h3>
            <div className="card-value">$425,000</div>
            <p className="card-trend">12 months data</p>
          </div>
          <div className="card">
            <h3 className="card-label">2023 Sales</h3>
            <div className="card-value">$420,000</div>
            <p className="card-trend">12 months data</p>
          </div>
          <div className="card">
            <h3 className="card-label">2022 Sales</h3>
            <div className="card-value">$405,000</div>
            <p className="card-trend">12 months data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
