import { Barlow, Barlow_Condensed, Fredoka, Space_Mono } from "next/font/google"
import localFont from "next/font/local"

/** Services — Segoe UI (service list titles) */
export const segoeUI = localFont({
  src: [
    {
      path: "../public/fonts/segoe-ui-4-cufonfonts/Segoe UI.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/segoe-ui-4-cufonfonts/Segoe UI Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/segoe-ui-4-cufonfonts/Segoe UI Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/segoe-ui-4-cufonfonts/Segoe UI Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-segoe",
  display: "swap",
})

/** Why Us — Barlow Condensed (display headline, stat numbers) */
export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
})

/** Why Us — Barlow (labels, support copy, stat captions) */
export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-barlow",
  display: "swap",
})

/** Display — Fredoka (headlines, metric values, logo) */
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
