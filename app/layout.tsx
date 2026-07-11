import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kaggle Sales Dashboard's',
  description: 'View random sales from Kaggle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
