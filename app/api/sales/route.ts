import AdmZip from "adm-zip";

type SalesPoint = { month: string; sales: number };

type SalesRecord = Record<string, unknown>;

const fallbackSalesData = {
  2024: [
    { month: "January", sales: 35000 },
    { month: "February", sales: 38000 },
    { month: "March", sales: 42000 },
    { month: "April", sales: 40000 },
    { month: "May", sales: 45000 },
    { month: "June", sales: 38000 },
    { month: "July", sales: 41000 },
    { month: "August", sales: 43000 },
    { month: "September", sales: 39000 },
    { month: "October", sales: 44000 },
    { month: "November", sales: 47000 },
    { month: "December", sales: 48000 },
  ],
  2023: [
    { month: "January", sales: 32000 },
    { month: "February", sales: 35000 },
    { month: "March", sales: 38000 },
    { month: "April", sales: 36000 },
    { month: "May", sales: 42000 },
    { month: "June", sales: 35000 },
    { month: "July", sales: 38000 },
    { month: "August", sales: 40000 },
    { month: "September", sales: 36000 },
    { month: "October", sales: 41000 },
    { month: "November", sales: 44000 },
    { month: "December", sales: 45000 },
  ],
  2022: [
    { month: "January", sales: 30000 },
    { month: "February", sales: 32000 },
    { month: "March", sales: 35000 },
    { month: "April", sales: 33000 },
    { month: "May", sales: 38000 },
    { month: "June", sales: 32000 },
    { month: "July", sales: 35000 },
    { month: "August", sales: 37000 },
    { month: "September", sales: 33000 },
    { month: "October", sales: 38000 },
    { month: "November", sales: 41000 },
    { month: "December", sales: 42000 },
  ],
} as const;

function toFallbackResponse(year: string | null) {
  if (year === "2024") {
    const data = fallbackSalesData[2024];
    return {
      year,
      data,
      total: data.reduce((sum, item) => sum + item.sales, 0),
    };
  }

  if (year === "2023") {
    const data = fallbackSalesData[2023];
    return {
      year,
      data,
      total: data.reduce((sum, item) => sum + item.sales, 0),
    };
  }

  if (year === "2022") {
    const data = fallbackSalesData[2022];
    return {
      year,
      data,
      total: data.reduce((sum, item) => sum + item.sales, 0),
    };
  }

  return {
    2024: fallbackSalesData[2024],
    2023: fallbackSalesData[2023],
    2022: fallbackSalesData[2022],
  };
}

function parseCsv(text: string) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [] as SalesRecord[];

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replace(/^"|"$/g, ""));

  return lines.slice(1).map((line) => {
    const values = line
      .split(",")
      .map((value) => value.trim().replace(/^"|"$/g, ""));

    return headers.reduce<SalesRecord>((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {});
  });
}

function normalizeSalesData(payload: unknown): SalesPoint[] {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        const record = item as SalesRecord;
        const month =
          record.month ??
          record.Month ??
          record.MonthName ??
          record.date ??
          record.Date ??
          record.period;
        const sales =
          record.sales ??
          record.Sales ??
          record.revenue ??
          record.Revenue ??
          record.amount ??
          record.Amount ??
          record.total ??
          record.Total;

        if (month === undefined || sales === undefined) return null;

        const numericSales = Number(sales);
        return Number.isFinite(numericSales)
          ? { month: String(month), sales: numericSales }
          : null;
      })
      .filter((item): item is SalesPoint => item !== null);
  }

  if (payload && typeof payload === "object") {
    const record = payload as SalesRecord;
    const possibleArrays = [record.data, record.sales, record.rows].filter(
      (value): value is unknown[] => Array.isArray(value),
    );

    if (possibleArrays.length > 0) {
      return normalizeSalesData(possibleArrays[0]);
    }
  }

  return [];
}

function getEntryName(zip: AdmZip, preferredFile?: string | null) {
  const entries = zip.getEntries().map((entry) => entry.entryName);
  if (preferredFile) {
    const exact = entries.find((entry) => entry.endsWith(preferredFile));
    if (exact) return exact;
  }

  const preferred = entries.find((entry) => entry.endsWith(".csv"));
  if (preferred) return preferred;

  const jsonEntry = entries.find((entry) => entry.endsWith(".json"));
  if (jsonEntry) return jsonEntry;

  return entries[0] ?? null;
}

async function tryKaggleDataset(year: string | null) {
  const kaggleUsername =
    process.env.KAGGLE_USERNAME || process.env.SALES_API_USERNAME;
  const kaggleKey =
    process.env.KAGGLE_KEY ||
    process.env.KAGGLE_API_TOKEN ||
    process.env.SALES_API_KEY ||
    process.env.API_Token;
  const kaggleDatasetSlug =
    process.env.KAGGLE_DATASET_SLUG || process.env.SALES_DATASET_SLUG;
  const kaggleDatasetFile = process.env.KAGGLE_DATASET_FILE;

  if (!kaggleUsername || !kaggleKey || !kaggleDatasetSlug) {
    return null;
  }

  try {
    const url = `https://www.kaggle.com/api/v1/datasets/download/${kaggleDatasetSlug}`;
    const headers = new Headers();
    headers.set(
      "Authorization",
      `Basic ${Buffer.from(`${kaggleUsername}:${kaggleKey}`).toString("base64")}`,
    );

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Kaggle API returned ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entryName = getEntryName(zip, kaggleDatasetFile);

    if (!entryName) {
      throw new Error("No files found in Kaggle dataset archive");
    }

    const fileText = zip.readAsText(entryName);
    const parsed = fileText.trim().startsWith("{")
      ? JSON.parse(fileText)
      : parseCsv(fileText);

    const data = normalizeSalesData(parsed);
    if (data.length > 0) {
      return {
        year,
        data,
        total: data.reduce((sum, item) => sum + item.sales, 0),
      };
    }
  } catch (error) {
    console.error("Kaggle dataset fetch failed", error);
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const kaggleData = await tryKaggleDataset(year);
  if (kaggleData) {
    return Response.json(kaggleData);
  }

  return Response.json(toFallbackResponse(year));
}
