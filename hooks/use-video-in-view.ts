"use client"

import { useEffect, useRef, type RefObject } from "react"

import { useInView } from "@/hooks/use-in-view"

interface UseVideoInViewOptions {
  enabled?: boolean
  resetOnLeave?: boolean
  threshold?: number
}

interface UseVideoInViewResult<T extends HTMLElement> {
  containerRef: RefObject<T | null>
  isInView: boolean
  videoRef: RefObject<HTMLVideoElement | null>
}

/** Play/pause a video based on whether its container is in the viewport. */
export function useVideoInView<T extends HTMLElement>(
  options: UseVideoInViewOptions = {},
): UseVideoInViewResult<T> {
  const { enabled = true, resetOnLeave = true, threshold = 0.35 } = options
  const { containerRef, isInView } = useInView<T>({
    enabled,
    resetOnLeave,
    threshold,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const video = videoRef.current

    if (!video) {
      return
    }

    if (isInView) {
      void video.play().catch(() => {})
      return
    }

    video.pause()

    if (resetOnLeave) {
      video.currentTime = 0
    }
  }, [enabled, isInView, resetOnLeave])

  return { containerRef, isInView, videoRef }
}
