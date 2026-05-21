"use client"

import { useReducedMotion } from "framer-motion"

interface EntranceMotionState {
  initial: false | "hidden" | "visible"
  animate: false | "visible"
  motionKey: string
  shouldAnimate: boolean
}

/** Entrance motion props — hidden on first paint to prevent pre-animation flash. */
export function useEntranceMotion(id: string): EntranceMotionState {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = !prefersReducedMotion

  return {
    motionKey: id,
    shouldAnimate,
    initial: shouldAnimate ? "hidden" : false,
    animate: shouldAnimate ? "visible" : false,
  }
}
