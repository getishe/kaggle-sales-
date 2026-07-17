export type SalesYear = "2022" | "2023" | "2024";

export type ChartDatum = {
  month: string;
  sales: number;
};

export type PieDatum = {
  name: string;
  value: number;
};

export type SalesSummary = {
  total: number;
  average: number;
  peakMonth: string;
  peakSales: number;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_ORDER = MONTHS.reduce<Record<string, number>>((acc, month, index) => {
  acc[month] = index;
  return acc;
}, {});

const MOCK_SERIES: Record<SalesYear, ChartDatum[]> = {
  2022: [
    { month: "Jan", sales: 318000 },
    { month: "Feb", sales: 325000 },
    { month: "Mar", sales: 334000 },
    { month: "Apr", sales: 329000 },
    { month: "May", sales: 341000 },
    { month: "Jun", sales: 347000 },
    { month: "Jul", sales: 352000 },
    { month: "Aug", sales: 356000 },
    { month: "Sep", sales: 361000 },
    { month: "Oct", sales: 368000 },
    { month: "Nov", sales: 374000 },
    { month: "Dec", sales: 381000 },
  ],
  2023: [
    { month: "Jan", sales: 342000 },
    { month: "Feb", sales: 349000 },
    { month: "Mar", sales: 358000 },
    { month: "Apr", sales: 366000 },
    { month: "May", sales: 375000 },
    { month: "Jun", sales: 382000 },
    { month: "Jul", sales: 389000 },
    { month: "Aug", sales: 397000 },
    { month: "Sep", sales: 404000 },
    { month: "Oct", sales: 412000 },
    { month: "Nov", sales: 419000 },
    { month: "Dec", sales: 427000 },
  ],
  2024: [
    { month: "Jan", sales: 365000 },
    { month: "Feb", sales: 374000 },
    { month: "Mar", sales: 386000 },
    { month: "Apr", sales: 391000 },
    { month: "May", sales: 405000 },
    { month: "Jun", sales: 411000 },
    { month: "Jul", sales: 419000 },
    { month: "Aug", sales: 427000 },
    { month: "Sep", sales: 435000 },
    { month: "Oct", sales: 442000 },
    { month: "Nov", sales: 451000 },
    { month: "Dec", sales: 459000 },
  ],
};

function normalizeYear(year: string | null | undefined): SalesYear {
  if (year === "2022" || year === "2023" || year === "2024") {
    return year;
  }

  return "2024";
}

export function getMockSalesSeries(year: string | null | undefined): ChartDatum[] {
  return MOCK_SERIES[normalizeYear(year)].map((item) => ({ ...item }));
}

export function buildChartSeries(
  rawData: Array<Record<string, unknown>> = [],
): ChartDatum[] {
  const totals = rawData.reduce<Record<string, number>>((acc, item) => {
    const monthValue =
      item.month ??
      item.Month ??
      item.MonthName ??
      item.Month_name ??
      item.date ??
      item.Date ??
      item.period ??
      item.name ??
      "Unknown";

    const salesValue = Number(
      item.sales ??
        item.Sales ??
        item.revenue ??
        item.Revenue ??
        item.amount ??
        item.Amount ??
        item.total ??
        item.Total ??
        item.value ??
        item.Value ??
        item.money ??
        item.Money,
    );

    if (!Number.isFinite(salesValue)) {
      return acc;
    }

    const key = String(monthValue);
    acc[key] = (acc[key] ?? 0) + salesValue;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([month, sales]) => ({ month, sales }))
    .sort((left, right) => {
      const leftOrder = MONTH_ORDER[left.month] ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = MONTH_ORDER[right.month] ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
}

export function seriesToPieData(series: ChartDatum[]): PieDatum[] {
  return series.map((item) => ({ name: item.month, value: item.sales }));
}

export function getSalesSummary(series: ChartDatum[]): SalesSummary {
  const total = series.reduce((sum, item) => sum + item.sales, 0);
  const peak = series.reduce(
    (best, item) => (item.sales > best.sales ? item : best),
    series[0] ?? { month: "N/A", sales: 0 },
  );

  return {
    total,
    average: series.length > 0 ? Math.round(total / series.length) : 0,
    peakMonth: peak.month,
    peakSales: peak.sales,
  };
}

export const SALES_YEARS: SalesYear[] = ["2024", "2023", "2022"];
