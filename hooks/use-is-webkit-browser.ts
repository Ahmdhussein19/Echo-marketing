"use client"

import { useEffect, useState } from "react"

/**
 * Detects Safari/WebKit (excluding Chromium-based browsers).
 * Defaults to false during SSR and initial hydration to avoid markup mismatches.
 */
export function useIsWebKitBrowser(): boolean {
  const [isWebKitBrowser, setIsWebKitBrowser] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isAppleWebKit = /AppleWebKit/i.test(userAgent)
    const isChromium = /Chrome|CriOS|Chromium|Edg|OPR/i.test(userAgent)

    setIsWebKitBrowser(isAppleWebKit && !isChromium)
  }, [])

  return isWebKitBrowser
}
