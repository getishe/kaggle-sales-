import AdmZip from "adm-zip";
import { NextResponse } from "next/server";

type SalesPoint = { month: string; sales: number };
type SalesRecord = Record<string, unknown>;

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
          record.Month_name ??
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
          record.Total ??
          record.value ??
          record.Value ??
          record.money ??
          record.Money;

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

  if (
    !kaggleUsername ||
    !kaggleKey ||
    !kaggleDatasetSlug ||
    kaggleUsername === "your-kaggle-username" ||
    kaggleDatasetSlug === "your-dataset-slug"
  ) {
    return null;
  }

  try {
    const url = `https://www.kaggle.com/api/v1/datasets/download/${kaggleDatasetSlug}`;
    const headers = new Headers();
    headers.set(
      "Authorization",
      `Basic ${Buffer.from(`${kaggleUsername}:${kaggleKey}`).toString("base64")}`,
    );

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

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

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  try {
    const kaggleData = await tryKaggleDataset(year);

    if (kaggleData) {
      return NextResponse.json(kaggleData);
    }

    return NextResponse.json(
      {
        error:
          "Unable to load sales data. Check your Kaggle credentials and dataset slug in the environment file.",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Sales API error", error);

    return NextResponse.json(
      {
        error: "Unable to load sales data.",
      },
      { status: 500 },
    );
  }
}
