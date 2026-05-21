"use client"

import { useEffect } from "react"

/** Ensures reloads and fresh visits start at the hero, not the last scroll position. */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    window.scrollTo(0, 0)
  }, [])

  return null
}
