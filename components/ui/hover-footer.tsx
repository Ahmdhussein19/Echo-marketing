"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface TextHoverEffectProps {
  text: string
  className?: string
  isActive?: boolean
}

export function TextHoverEffect({
  text,
  className,
  isActive = true,
}: TextHoverEffectProps) {
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = isActive && !prefersReducedMotion

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none uppercase", className)}
      aria-hidden
    >
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-heading text-7xl font-bold stroke-[var(--echo-orange)] opacity-30"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={
          shouldAnimate
            ? { strokeDashoffset: [1000, 0], strokeDasharray: 1000 }
            : { strokeDashoffset: 0, strokeDasharray: 1000 }
        }
        transition={
          shouldAnimate
            ? {
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }
            : { duration: 0 }
        }
      >
        {text}
      </motion.text>
    </svg>
  )
}

export function FooterBackgroundGradient() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_10%,rgba(10,10,10,0.4)_50%,rgba(217,95,43,0.2)_100%)]"
    />
  )
}
