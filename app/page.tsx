import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="card-label">Kaggle Sales Studio</p>
        <h1 className="hero-title">
          A polished sales analytics experience built with Next.js.
        </h1>
        <p className="hero-copy">
          Explore 2022, 2023, and 2024 sales trends with mock data, threshold
          filters, and multiple chart views.
        </p>

        <div className="hero-actions">
          <Link href="/dashboard" className="button-primary">
            Open Dashboard
          </Link>
          <a
            href="/api/sales"
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
          >
            View Sales API
          </a>
        </div>
      </section>
    </main>
  );
}
