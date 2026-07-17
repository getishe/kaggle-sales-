"use client";

import { useEffect, useState } from "react";
import BarChartComponent from "@/components/charts/BarChart";
import LineChartComponent from "@/components/charts/LineChart";
import PieChartComponent from "@/components/charts/PieChart";
import StatCard from "@/components/StatCard";
import FilterInput from "@/components/FilterInput";
import ChartTypeSelector from "@/components/ChartTypeSelector";
import {
  getMockSalesSeries,
  getSalesSummary,
  SALES_YEARS,
  seriesToPieData,
  type ChartDatum,
  type PieDatum,
} from "@/lib/sales-data";

type ChartType = "bar" | "line" | "pie";

export default function SalesDashboard() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [threshold, setThreshold] = useState<number>(0);
  const [year, setYear] = useState<string>("2024");
  const [data, setData] = useState<ChartDatum[]>(() =>
    getMockSalesSeries("2024"),
  );
  const [pieData, setPieData] = useState<PieDatum[]>(() =>
    seriesToPieData(getMockSalesSeries("2024")),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("mock");

  useEffect(() => {
    async function load() {
      const fallbackSeries = getMockSalesSeries(year);
      setData(fallbackSeries);
      setPieData(seriesToPieData(fallbackSeries));
      setSource("mock");

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/sales?year=${encodeURIComponent(year)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(String(response.status));
        }

        const payload = await response.json();
        const rawItems = Array.isArray(payload?.data)
          ? (payload.data as ChartDatum[])
          : Array.isArray(payload)
            ? (payload as ChartDatum[])
            : [];

        const normalizedItems = rawItems.filter(
          (item): item is ChartDatum =>
            typeof item?.month === "string" &&
            typeof item?.sales === "number" &&
            Number.isFinite(item.sales),
        );

        if (normalizedItems.length > 0) {
          setData(normalizedItems);
          setPieData(seriesToPieData(normalizedItems));
          setSource(
            typeof payload?.source === "string" ? payload.source : "api",
          );
        } else {
          const fallbackSeries = getMockSalesSeries(year);
          setData(fallbackSeries);
          setPieData(seriesToPieData(fallbackSeries));
          setSource("mock");
        }
      } catch (requestError: any) {
        setError(requestError?.message ?? String(requestError));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [year]);

  const summary = getSalesSummary(data);
  const hasChartData =
    chartType === "pie" ? pieData.length > 0 : data.length > 0;

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <div className="dashboard-header panel">
          <p className="card-label">Sales Dashboard</p>
          <h1 className="dashboard-title">Kaggle Sales Studio</h1>
          <p className="dashboard-subtitle">
            Choose a year, set a minimum sales threshold, and switch between
            chart types to compare 2022, 2023, and 2024.
          </p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Sales"
            value={`$${summary.total.toLocaleString()}`}
            trend={
              source === "kaggle" ? "Live Kaggle data" : "Mock data fallback"
            }
          />
          <StatCard
            title="Average Monthly"
            value={`$${summary.average.toLocaleString()}`}
            trend={`Filtered by ${year}`}
          />
          <StatCard
            title="Peak Month"
            value={summary.peakMonth}
            trend={`$${summary.peakSales.toLocaleString()}`}
          />
        </div>

        <div className="control-panel">
          <div className="controls-grid">
            <div>
              <label className="label-text">Year</label>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="input-field"
              >
                {SALES_YEARS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <FilterInput value={threshold} onThresholdChange={setThreshold} />
            <ChartTypeSelector
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </div>
        </div>

        <div className="chart-card panel">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="chart-title">Sales Trend</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              Current view:{" "}
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </span>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Showing sales for {year} with a {chartType} chart. Try a threshold
            like 400000 to focus on stronger months.
          </p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && !hasChartData && (
            <div className="text-sm text-gray-400">
              No sales data available for the selected view.
            </div>
          )}
          {!loading && !error && hasChartData && (
            <>
              {chartType === "bar" && (
                <BarChartComponent data={data} threshold={threshold} />
              )}
              {chartType === "line" && (
                <LineChartComponent data={data} threshold={threshold} />
              )}
              {chartType === "pie" && <PieChartComponent data={pieData} />}
            </>
          )}
        </div>

        <div className="summary-grid">
          <div className="card">
            <h3 className="card-label">2024 Sales</h3>
            <div className="card-value">$4,560,000</div>
            <p className="card-trend">Mocked monthly dataset</p>
          </div>
          <div className="card">
            <h3 className="card-label">2023 Sales</h3>
            <div className="card-value">$4,220,000</div>
            <p className="card-trend">Mocked monthly dataset</p>
          </div>
          <div className="card">
            <h3 className="card-label">2022 Sales</h3>
            <div className="card-value">$4,136,000</div>
            <p className="card-trend">Mocked monthly dataset</p>
          </div>
        </div>
      </div>
    </div>
  );
}
