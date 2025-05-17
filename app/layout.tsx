import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ApiConnectionChecker from '@/components/api-connection-checker'

const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: 'TheEnd.page',
  description: 'Created by Codewars',
  generator: 'Codewars',
  icons: {
    icon: '/favicon.png', // Or .ico if you converted it
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster />
        <ApiConnectionChecker />
      </body>
    </html>
  )
}
