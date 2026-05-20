"use client"

import {
  createContext,
  useContext,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { cn } from "@/lib/utils"

interface FloatingContextValue {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  sensitivity: number
}

const FloatingContext = createContext<FloatingContextValue | null>(null)

function useFloatingContext() {
  const context = useContext(FloatingContext)
  if (!context) {
    throw new Error("FloatingElement must be used within Floating")
  }
  return context
}

interface FloatingProps {
  children: ReactNode
  className?: string
  sensitivity?: number
}

export function Floating({
  children,
  className,
  sensitivity = 1,
}: FloatingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <FloatingContext.Provider value={{ mouseX, mouseY, sensitivity }}>
      <motion.div
        ref={ref}
        className={cn("relative", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    </FloatingContext.Provider>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  depth?: number
}

export function FloatingElement({
  children,
  className,
  depth = 1,
}: FloatingElementProps) {
  const { mouseX, mouseY, sensitivity } = useFloatingContext()

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const x = useSpring(
    useTransform(mouseX, (value) => value * sensitivity * depth * 0.02),
    springConfig,
  )
  const y = useSpring(
    useTransform(mouseY, (value) => value * sensitivity * depth * 0.02),
    springConfig,
  )

  return (
    <motion.div style={{ x, y }} className={cn("absolute", className)}>
      {children}
    </motion.div>
  )
}
