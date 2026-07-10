# Kaggle Sales Dashboard

An app that displays random sales from Kaggle and shows sales data for a selected year.

## Features

- Display random sales data from Kaggle
- Filter sales by year
- Simple and intuitive UI

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** CSS

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/getishe/kaggle-sales-.git
cd kaggle-sales-
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on **Vercel**.

### Deploy to Vercel

**Option 1: Using Vercel CLI (Fastest)**
```bash
npm install -g vercel
vercel
```

**Option 2: GitHub Integration**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/getishe/kaggle-sales-`
4. Click "Import"
5. Vercel will auto-detect Next.js and deploy!

**Option 3: Dashboard**
1. Visit https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your repository
4. Click "Deploy"

Your app will be live at: `https://kaggle-sales-[username].vercel.app`

## Environment Variables

Add environment variables in Vercel dashboard:
- Settings → Environment Variables

## License

MIT