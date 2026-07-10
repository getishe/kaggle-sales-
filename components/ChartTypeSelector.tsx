'use client'

type ChartType = 'bar' | 'line' | 'pie'

interface ChartTypeSelectorProps {
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
}

export default function ChartTypeSelector({
  chartType,
  onChartTypeChange,
}: ChartTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Chart Type</label>
      <div className="flex gap-3">
        {(['bar', 'line', 'pie'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              chartType === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
