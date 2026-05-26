"use client"

import { useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"

const SCROLL_WEIGHT = 0.55

export function useWeightedScroll(): { smoothY: MotionValue<number> } {
  const { scrollY } = useScroll()

  const smoothY = useSpring(scrollY, {
    stiffness: Math.round(SCROLL_WEIGHT * 100),
    damping: 20,
    mass: 1,
  })

  return { smoothY }
}

export function useWeightedScrollY(): MotionValue<string> {
  const { smoothY } = useWeightedScroll()
  return useTransform(smoothY, (value: number) => `${-value}px`)
}
