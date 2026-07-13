"use client";

type ChartType = "bar" | "line" | "pie";

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export default function ChartTypeSelector({
  chartType,
  onChartTypeChange,
}: ChartTypeSelectorProps) {
  return (
    <div>
      <label className="label-text">Chart Type</label>
      <div className="chart-toggle">
        {(["bar", "line", "pie"] as const).map((type) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={chartType === type ? "active" : ""}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
