import "./globals.css"
import "./kinetic-nav.css"
import Script from "next/script"
import { ScrollToTopOnLoad } from "@/components/shared/scroll-to-top"
import { fredoka, manrope, segoeUI, spaceMono } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark antialiased",
        fredoka.variable,
        manrope.variable,
        segoeUI.variable,
        spaceMono.variable,
      )}
    >
      <body className="font-sans" suppressHydrationWarning>
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){if("scrollRestoration"in history){history.scrollRestoration="manual";}window.scrollTo(0,0);})();`,
          }}
        />
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  )
}
