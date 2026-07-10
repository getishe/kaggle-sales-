export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')

  // Mock Kaggle sales data
  const salesData = {
    2024: [
      { month: 'January', sales: 35000 },
      { month: 'February', sales: 38000 },
      { month: 'March', sales: 42000 },
      { month: 'April', sales: 40000 },
      { month: 'May', sales: 45000 },
      { month: 'June', sales: 38000 },
      { month: 'July', sales: 41000 },
      { month: 'August', sales: 43000 },
      { month: 'September', sales: 39000 },
      { month: 'October', sales: 44000 },
      { month: 'November', sales: 47000 },
      { month: 'December', sales: 48000 },
    ],
    2023: [
      { month: 'January', sales: 32000 },
      { month: 'February', sales: 35000 },
      { month: 'March', sales: 38000 },
      { month: 'April', sales: 36000 },
      { month: 'May', sales: 42000 },
      { month: 'June', sales: 35000 },
      { month: 'July', sales: 38000 },
      { month: 'August', sales: 40000 },
      { month: 'September', sales: 36000 },
      { month: 'October', sales: 41000 },
      { month: 'November', sales: 44000 },
      { month: 'December', sales: 45000 },
    ],
    2022: [
      { month: 'January', sales: 30000 },
      { month: 'February', sales: 32000 },
      { month: 'March', sales: 35000 },
      { month: 'April', sales: 33000 },
      { month: 'May', sales: 38000 },
      { month: 'June', sales: 32000 },
      { month: 'July', sales: 35000 },
      { month: 'August', sales: 37000 },
      { month: 'September', sales: 33000 },
      { month: 'October', sales: 38000 },
      { month: 'November', sales: 41000 },
      { month: 'December', sales: 42000 },
    ],
  }

  if (year && year in salesData) {
    return Response.json({
      year,
      data: salesData[year as keyof typeof salesData],
      total: salesData[year as keyof typeof salesData].reduce((sum, item) => sum + item.sales, 0),
    })
  }

  // Return all years if no specific year requested
  return Response.json({
    2024: salesData[2024],
    2023: salesData[2023],
    2022: salesData[2022],
  })
}
