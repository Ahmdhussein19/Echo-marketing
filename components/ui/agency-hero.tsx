"use client"

import Link from "next/link"
import { useRef } from "react"
import {
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuroraButton } from "@/components/ui/aurora-button"
import { TextRotate } from "@/components/ui/text-rotate"
import { cn } from "@/lib/utils"


const ROTATING_WORDS = [
  "beatable",
  "forgettable",
  "stoppable",
  "mistakable",
]

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] },
  },
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

export interface AgencyHeroProps {
  className?: string
}

export function AgencyHero({ className }: AgencyHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 80]
  )
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.45],
    prefersReducedMotion ? [1, 1] : [1, 0]
  )
  const backdropScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    prefersReducedMotion ? [1, 1] : [1, 1.06]
  )

  return (
    <section
      ref={sectionRef}
      id="top"
      className={cn(
        "relative flex min-h-screen w-full flex-col items-start justify-between overflow-hidden border-0 bg-black",
        className,
      )}
    >
      <motion.div
        style={{ scale: backdropScale, willChange: prefersReducedMotion ? undefined : 'transform' }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(217,95,43,0.25),transparent)]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, willChange: prefersReducedMotion ? undefined : 'transform, opacity' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex w-full flex-col items-start px-4 text-left md:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="max-w-5xl">
          <h1 className="font-heading text-4xl font-bold leading-[0.9] text-foreground sm:text-5xl md:text-7xl lg:text-9xl mt-16 sm:mt-20 md:mt-32 uppercase">
            <span className="block">We make Your Brand</span>
            <LayoutGroup>
              <span className="mt-2 flex flex-wrap items-baseline justify-start gap-x-2">
                <span>Un</span>
                <TextRotate
                  texts={ROTATING_WORDS}
                  mainClassName="text-primary text-4xl sm:text-5xl md:text-7xl lg:text-9xl"
                  staggerDuration={0.025}
                  staggerFrom="last"
                  rotationInterval={2800}
                  transition={{ type: "spring", damping: 28, stiffness: 380 }}
                />
              </span>
            </LayoutGroup>
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-wrap items-center justify-start gap-3 md:mt-8"
        >
          <AuroraButton className="flex items-center gap-2 whitespace-nowrap px-8 py-3 text-lg" onClick={() => window.location.href = '#contact'}>
            Start a project
            <ArrowRight className="size-5" />
          </AuroraButton>
        </motion.div>

      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, willChange: prefersReducedMotion ? undefined : 'transform, opacity' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-4 pb-8 text-left md:px-6 lg:px-8"
      >
        <motion.p
          variants={itemVariants}
          className="font-sans max-w-2xl text-2xl font-bold leading-tight md:text-3xl"
        >
          <span className="text-foreground">We build brands, websites, and performance campaigns</span>{" "}
          <span className="text-foreground/40">with intention, clarity and care.</span>
        </motion.p>
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, willChange: prefersReducedMotion ? undefined : 'transform, opacity' }}
        variants={itemVariants}
        className="absolute bottom-8 right-4 z-10 hidden flex-col items-end gap-2 md:flex lg:bottom-10 lg:right-10"
        suppressHydrationWarning
      >
        {[
          { value: "120+", label: "Campaigns" },
          { value: "98%", label: "Retention" },
          { value: "4.2×", label: "Avg. ROAS" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-baseline gap-3 text-right"
          >
            <p className="font-sans text-xs uppercase text-muted-foreground leading-none">
              {stat.label}
            </p>
            <p className="font-heading text-3xl font-bold leading-none text-foreground md:text-4xl">
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground md:flex"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.span
          className="h-10 w-px bg-gradient-to-b from-muted-foreground/60 to-transparent"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}
