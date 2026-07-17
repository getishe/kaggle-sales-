# Kaggle Sales Dashboard

A Next.js 15 application that presents yearly sales dashboards for 2022, 2023, and 2024. The app uses mock sales data out of the box and can optionally read from Kaggle through the API route when credentials are provided.

## What The Project Does

- Shows a landing page and a dashboard page with the App Router
- Displays yearly sales data for 2022, 2023, and 2024
- Lets users switch between bar, line, and pie charts
- Includes a custom sales threshold input
- Uses a Kaggle-powered API route with a mock-data fallback

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Recharts

## Project Structure

- `app/page.tsx` for the landing page
- `app/dashboard/page.tsx` for the dashboard route
- `app/api/sales/route.ts` for sales data API responses
- `components/` for reusable UI and chart components
- `lib/sales-data.ts` for shared mock data and chart helpers

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the app:

```bash
http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Optional Kaggle API Setup

The app works without Kaggle credentials, but if you want the API route to try real Kaggle data, add these environment variables:

```bash
KAGGLE_USERNAME=your-kaggle-username
KAGGLE_KEY=your-kaggle-api-key
KAGGLE_DATASET_SLUG=owner/dataset-slug
KAGGLE_DATASET_FILE=optional-file-name.csv
```

If those values are missing, the API returns the local mock dataset so the dashboard still works.

## Deployment

The project is ready for Vercel deployment.

1. Push the repository to GitHub
2. Import the repo in Vercel
3. Add any optional Kaggle environment variables in the Vercel dashboard
4. Deploy

## Notes

- The dashboard uses reusable chart components for bar, line, and pie views
- The data flow is intentionally simple so it is easy to extend with a real API later
