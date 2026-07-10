'use client'

import { useState } from 'react'
import BarChartComponent from '@/components/charts/BarChart'
import LineChartComponent from '@/components/charts/LineChart'
import PieChartComponent from '@/components/charts/PieChart'
import StatCard from '@/components/StatCard'
import FilterInput from '@/components/FilterInput'
import ChartTypeSelector from '@/components/ChartTypeSelector'

type ChartType = 'bar' | 'line' | 'pie'

export default function Dashboard() {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [threshold, setThreshold] = useState<number>(0)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>
        <p className="text-gray-600">Comprehensive sales overview for 2022, 2023, and 2024</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Sales" value="$1,250,000" trend="+12%" />
        <StatCard title="Average Monthly" value="$103,333" trend="+8%" />
        <StatCard title="Peak Month" value="$115,000" trend="May 2024" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FilterInput onThresholdChange={setThreshold} />
          <ChartTypeSelector chartType={chartType} onChartTypeChange={setChartType} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Trend (2022-2024)</h2>
          {chartType === 'bar' && <BarChartComponent threshold={threshold} />}
          {chartType === 'line' && <LineChartComponent threshold={threshold} />}
          {chartType === 'pie' && <PieChartComponent />}
        </div>
      </div>

      {/* Year-wise breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">2024 Sales</h3>
          <div className="text-3xl font-bold text-blue-600">$425,000</div>
          <p className="text-gray-600 mt-2">12 months data</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">2023 Sales</h3>
          <div className="text-3xl font-bold text-green-600">$420,000</div>
          <p className="text-gray-600 mt-2">12 months data</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">2022 Sales</h3>
          <div className="text-3xl font-bold text-purple-600">$405,000</div>
          <p className="text-gray-600 mt-2">12 months data</p>
        </div>
      </div>
    </div>
  )
}
