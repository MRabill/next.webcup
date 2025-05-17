import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TheEnd.page',
  description: 'Created by Codewars',
  generator: 'Codewars',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
