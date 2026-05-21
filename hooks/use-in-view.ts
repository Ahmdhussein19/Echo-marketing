"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

interface UseInViewOptions {
  enabled?: boolean
  resetOnLeave?: boolean
  threshold?: number
}

interface UseInViewResult<T extends HTMLElement> {
  containerRef: RefObject<T | null>
  isInView: boolean
}

/** Tracks whether an element is visible in the viewport. */
export function useInView<T extends HTMLElement>(
  options: UseInViewOptions = {},
): UseInViewResult<T> {
  const { enabled = true, resetOnLeave = true, threshold = 0.35 } = options
  const containerRef = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const container = containerRef.current

    if (!container) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          return
        }

        if (resetOnLeave) {
          setIsInView(false)
        }
      },
      { threshold },
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [enabled, resetOnLeave, threshold])

  return { containerRef, isInView }
}
