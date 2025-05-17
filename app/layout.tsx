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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-lexend bg-black">
        {children}
      </body>
    </html>
  )
}
