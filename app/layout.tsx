import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaggle Sales Dashboard",
  description: "A Next.js 15 sales dashboard with charts, filters, and Kaggle data support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
