import localFont from "next/font/local"

/** Titles — Segoe UI */
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
  variable: "--font-heading",
  display: "swap",
})

/** Body & subtitles — Manrope */
export const manrope = localFont({
  src: [
    {
      path: "../public/fonts/Manrope/Manrope-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Manrope/Manrope-Light.ttf",
      weight: "300",
      style: "normal",
    },
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
    {
      path: "../public/fonts/Manrope/Manrope-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Manrope/Manrope-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})
