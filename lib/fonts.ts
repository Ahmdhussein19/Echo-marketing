import { Fredoka, Space_Mono } from "next/font/google"
import localFont from "next/font/local"

/** Display — Fredoka (headlines, service names, metric values, logo) */
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
})

/** Labels — Space Mono (badges, nav links, tags, captions, section labels) */
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
})

/** Body — Manrope (descriptions, body copy, paragraphs) */
export const manrope = localFont({
  src: [
    {
      path: "../public/fonts/Manrope/Manrope-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Manrope/Manrope-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Manrope/Manrope-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})
