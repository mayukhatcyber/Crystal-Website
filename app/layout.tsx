import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { VoiceCommandProvider } from "@/contexts/voice-command-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crystal Engineering - Electrical Substation Specialists",
  description: "Government registered contractors specializing in all types of substation-based electrical jobs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <VoiceCommandProvider>{children}</VoiceCommandProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
