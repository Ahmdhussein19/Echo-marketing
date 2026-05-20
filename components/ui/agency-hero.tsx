"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

import { TextRotate } from "@/components/ui/text-rotate"
import { AeroButton } from "@/components/ui/aero-button"
import { cn } from "@/lib/utils"


const ROTATING_WORDS = [
  "beatable",
  "forgettable",
  "stoppable",
  "mistakable",
]

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(16px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      delay: 0.35 + delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -60, filter: "blur(18px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.25,
      delay: 0.35 + delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

export interface AgencyHeroProps {
  className?: string
}

export function AgencyHero({ className }: AgencyHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const entranceInitial = prefersReducedMotion ? "visible" : "hidden"
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    const updateViewportHeight = () => setViewportHeight(window.innerHeight)
    updateViewportHeight()
    window.addEventListener("resize", updateViewportHeight)
    return () => window.removeEventListener("resize", updateViewportHeight)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const scrollToContactSection = () => {
    if (typeof window === "undefined") return
    const contactSection = document.getElementById("contact")
    if (!contactSection) return

    contactSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })

    if (window.history.replaceState) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      )
    }
  }

  const backdropScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    prefersReducedMotion ? [1, 1] : [1, 1.06]
  )
  const heroScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 0.9]
  )
  const heroRotateX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 4]
  )
  const overlayStart = viewportHeight ? viewportHeight : 600
  const overlayEnd = viewportHeight ? -viewportHeight * 0.25 : -200
  const nextSectionY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [overlayStart, overlayStart] : [overlayStart, overlayEnd]
  )
  const nextSectionOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 1]
  )
  const heroPerspective = prefersReducedMotion ? undefined : "1400px"

  return (
    <section
      ref={sectionRef}
      id="top"
      className={cn("relative min-h-[185vh]", className)}
    >
      <motion.div
        style={{
          backgroundColor: 'var(--echo-bg)',
          perspective: heroPerspective,
          scale: heroScale,
          rotateX: heroRotateX,
          transformOrigin: "center top",
          transformStyle: prefersReducedMotion ? undefined : "preserve-3d",
        }}
        className="sticky top-0 flex h-screen w-full flex-col items-start justify-between overflow-hidden border-0"
      >
        <motion.div
          style={{ scale: backdropScale, willChange: prefersReducedMotion ? undefined : 'transform' }}
          className="pointer-events-none absolute inset-0 bg-[var(--echo-bg)]"
        />

        <motion.div
          variants={slideDownVariants}
          initial={entranceInitial}
          animate="visible"
          custom={0.25}
          className="relative z-10 flex w-full flex-col items-start px-4 text-left md:px-6 lg:px-8"
        >
          <motion.div variants={slideDownVariants} custom={0.3} className="max-w-5xl">
            <h1 className="font-heading text-4xl font-bold leading-[0.9] text-[var(--echo-text-1)] sm:text-5xl md:text-7xl lg:text-[clamp(60px,8.5vw,116px)] mt-16 sm:mt-20 md:mt-32 uppercase tracking-tight">
              <span className="block">We make</span>
              <span className="block">YOUR BRAND</span>
              <LayoutGroup>
                <div className="mt-2 flex flex-col gap-1 sm:gap-2">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span>Un</span>
                    <TextRotate
                      texts={ROTATING_WORDS}
                      mainClassName="text-[var(--echo-orange)] text-4xl sm:text-5xl md:text-7xl lg:text-[clamp(60px,8.5vw,116px)]"
                      staggerDuration={0.025}
                      staggerFrom="last"
                      rotationInterval={2800}
                      initial={{ y: "30%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-30%", opacity: 0 }}
                      transition={{ type: "spring", damping: 28, stiffness: 380 }}
                    />
                  </span>
                </div>
              </LayoutGroup>
            </h1>
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          initial={entranceInitial}
          animate="visible"
          custom={0.55}
          className="absolute left-1/2 top-[70%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <AeroButton onClick={scrollToContactSection}>
            Start a project
          </AeroButton>
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          initial={entranceInitial}
          animate="visible"
          custom={0.1}
          className="absolute bottom-0 right-[15%] z-10"
        >
          <div className="relative">
            <img
              src="/images/image 13 (1).webp"
              alt=""
              className="h-auto w-[25vw] object-contain"
            />
            <img
              src="/images/image 13 (1).webp"
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-110 rounded-[32px] blur-3xl opacity-60"
            />
          </div>
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          initial={entranceInitial}
          animate="visible"
          custom={0.25}
          className="relative z-10 px-4 pb-8 text-left md:px-6 lg:px-8"
        >
          <motion.p
            variants={slideUpVariants}
            custom={0.25}
            className="font-sans max-w-2xl text-2xl font-bold leading-tight md:text-3xl"
          >
            <span className="text-[var(--echo-text-1)]">We build brands, websites, and performance campaigns</span>{" "}
            <span className="text-[var(--echo-text-2)]/40">with intention, clarity and care.</span>
          </motion.p>
        </motion.div>


        <div
          className="absolute bottom-8 right-4 z-10 hidden flex-col items-end gap-0 md:flex lg:right-10"
          suppressHydrationWarning
        >
          {[
            { value: "120+", label: "Campaigns" },
            { value: "98%", label: "Retention" },
            { value: "4.2×", label: "Avg. ROAS" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={slideUpVariants}
              initial={entranceInitial}
              animate="visible"
              custom={0.3 + index * 0.05}
              className="flex items-baseline gap-2 text-right"
            >
              <p className="font-mono text-xs uppercase text-[var(--echo-text-3)] leading-none tracking-[0.10em]">
                {stat.label}
              </p>
              <p className="font-heading text-4xl font-bold leading-none text-[var(--echo-orange)] md:text-5xl">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={slideUpVariants}
          initial={entranceInitial}
          animate="visible"
          custom={0.55}
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--echo-text-3)] md:flex"
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Scroll</span>
          <motion.span
            className="h-10 w-px bg-gradient-to-b from-[var(--echo-text-3)]/60 to-transparent"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          style={{ y: nextSectionY, opacity: nextSectionOpacity }}
          className="pointer-events-none fixed left-1/2 bottom-[-15vh] z-30 w-[min(92vw,820px)] -translate-x-1/2 rounded-[32px] border border-[var(--echo-border)] bg-[var(--echo-surface-1)]/92 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <div className="text-[10px] uppercase tracking-[0.6em] text-[var(--echo-text-3)]">Next section</div>
          <div className="mt-3 text-2xl font-heading text-[var(--echo-text-1)]">Strategy & services overview</div>
          <p className="mt-2 text-sm text-[var(--echo-text-2)]">Scroll to dive into how Echo orchestrates growth across channels.</p>
        </motion.div>
      )}
    </section>
  )
}
