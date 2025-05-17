
import { Toaster } from "@/components/ui/toaster"
import ApiConnectionChecker from '@/components/api-connection-checker'
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
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
      </head>      <body className="font-lexend bg-black">
        {children}
        <Toaster />
        <ApiConnectionChecker />
      </body>
    </html>
  )
}
