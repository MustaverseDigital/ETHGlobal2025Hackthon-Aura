import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { Header } from '@/components/header'

const inter = Inter({ subsets: ["latin"] })

// Update metadata
export const metadata: Metadata = {
  title: "GemFi - Real World Asset Lending Platform",
  description: "Secure DeFi lending platform for tokenized real-world assets, powered by ERC-1155",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <Header />
            <main>
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'