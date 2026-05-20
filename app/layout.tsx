import "./globals.css"
import "./kinetic-nav.css"
import { fredoka, manrope, spaceMono } from "@/lib/fonts"
import { cn } from "@/lib/utils"

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
        fredoka.variable,
        manrope.variable,
        spaceMono.variable,
      )}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
