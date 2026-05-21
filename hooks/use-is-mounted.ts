"use client"

import { useEffect, useState } from "react"

/** True only after the client has committed — use to align SSR and hydration markup. */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
