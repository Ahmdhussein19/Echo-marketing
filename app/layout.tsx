import { Geist_Mono } from "next/font/google"

import "./globals.css"
import "./kinetic-nav.css"
import { manrope, segoeUI } from "@/lib/fonts"
import { cn } from "@/lib/utils"

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark antialiased",
        segoeUI.variable,
        manrope.variable,
        fontMono.variable,
      )}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
