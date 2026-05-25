"use client"

import { useRef, useState } from "react"
import {
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion"

import { TextRotate } from "@/components/ui/text-rotate"
import { AeroButton } from "@/components/ui/aero-button"
import { useEntranceMotion } from "@/hooks/use-entrance-motion"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { cn } from "@/lib/utils"
import Image from "next/image"


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

const slideUpImageVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      delay: 0.35 + delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const HERO_PORTRAIT_SRC = "/images/image 13 (1).webp"

export interface AgencyHeroProps {
  className?: string
  scrollProgress?: MotionValue<number>
}

export function AgencyHero({ className, scrollProgress }: AgencyHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isMounted = useIsMounted()
  const prefersReducedMotion = useReducedMotion()
  const headlineMotion = useEntranceMotion("hero-headline")
  const ctaMotion = useEntranceMotion("hero-cta")
  const imageMotion = useEntranceMotion("hero-image")
  const taglineMotion = useEntranceMotion("hero-tagline")
  const statsMotion = useEntranceMotion("hero-stats")
  const scrollHintMotion = useEntranceMotion("hero-scroll-hint")
  const heroEntranceClass = headlineMotion.shouldAnimate ? "hero-entrance" : undefined
  const [heroPortraitReady, setHeroPortraitReady] = useState(false)

  const { scrollYProgress: internalScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const heroScrollProgress = scrollProgress ?? internalScrollProgress

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
    heroScrollProgress,
    [0, 0.5],
    prefersReducedMotion ? [1, 1] : [1, 1.03]
  )
  const heroScale = useTransform(
    heroScrollProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 0.84]
  )
  const heroRotateX = useTransform(
    heroScrollProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 2]
  )
  const heroContentFilter = useTransform(
    heroScrollProgress,
    [0, 0.55, 1],
    prefersReducedMotion
      ? ["blur(0px)", "blur(0px)", "blur(0px)"]
      : ["blur(0px)", "blur(6px)", "blur(14px)"]
  )
  const heroContentOpacity = useTransform(
    heroScrollProgress,
    [0, 0.8, 1],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.72, 0.48]
  )
  const heroPerspective = prefersReducedMotion ? undefined : "1400px"

  return (
    <section
      ref={sectionRef}
      id="top"
      className={cn("relative h-screen overflow-hidden", className)}
    >
      <motion.div
        style={{
          backgroundColor: "var(--echo-bg)",
          perspective: isMounted ? heroPerspective : undefined,
          scale: isMounted ? heroScale : undefined,
          rotateX: isMounted ? heroRotateX : undefined,
          filter: isMounted ? heroContentFilter : undefined,
          opacity: isMounted ? heroContentOpacity : undefined,
          transformOrigin: "center top",
          transformStyle:
            isMounted && !prefersReducedMotion ? "preserve-3d" : undefined,
        }}
        className="absolute inset-0 flex h-screen w-full flex-col items-start justify-between overflow-hidden border-0"
      >
        <motion.div
          style={{
            scale: isMounted ? backdropScale : undefined,
            willChange: isMounted && !prefersReducedMotion ? "transform" : undefined,
          }}
          className="pointer-events-none absolute inset-0 bg-[var(--echo-bg)]"
        />

        <motion.div
          variants={slideDownVariants}
          initial={headlineMotion.initial}
          animate={headlineMotion.animate}
          custom={0.25}
          className={cn(
            "relative z-10 flex w-full flex-col items-start px-4 text-left max-md:py-24 md:px-6 md:py-0 lg:px-8",
            heroEntranceClass,
          )}
        >
          <motion.div
            variants={slideDownVariants}
            initial={headlineMotion.initial}
            animate={headlineMotion.animate}
            custom={0.3}
            className="max-w-5xl"
          >
            <h1 className="font-heading mt-0 text-[2.75rem] font-bold leading-[0.9] text-[var(--echo-title-1)] sm:text-5xl md:mt-32 md:text-7xl lg:text-[clamp(60px,8.5vw,116px)] uppercase tracking-tight">
              <span className="block">We make</span>
              <span className="block">YOUR BRAND</span>
              <LayoutGroup>
                <div className="mt-2 flex flex-col gap-1 sm:gap-2">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span>Un</span>
                    {isMounted ? (
                      <TextRotate
                        texts={ROTATING_WORDS}
                        mainClassName="text-[var(--echo-orange)] text-[2.75rem] sm:text-5xl md:text-7xl lg:text-[clamp(60px,8.5vw,116px)]"
                        staggerDuration={0.025}
                        staggerFrom="last"
                        rotationInterval={2800}
                        initial={{ y: "30%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-30%", opacity: 0 }}
                        transition={{ type: "spring", damping: 28, stiffness: 380 }}
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="text-[var(--echo-orange)] text-[2.75rem] opacity-0 sm:text-5xl md:text-7xl lg:text-[clamp(60px,8.5vw,116px)]"
                      >
                        {ROTATING_WORDS[0]}
                      </span>
                    )}
                  </span>
                </div>
              </LayoutGroup>
            </h1>
          </motion.div>

          <motion.div
            variants={slideUpVariants}
            initial={ctaMotion.initial}
            animate={ctaMotion.animate}
            custom={0.55}
            className={cn("relative z-20 mt-6 md:hidden", heroEntranceClass)}
          >
            <AeroButton className="mx-0 justify-start" onClick={scrollToContactSection}>
              Start a project
            </AeroButton>
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          initial={ctaMotion.initial}
          animate={ctaMotion.animate}
          custom={0.55}
          className={cn(
            "absolute left-1/2 top-[70%] z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block",
            heroEntranceClass,
          )}
        >
          <AeroButton onClick={scrollToContactSection}>
            Start a project
          </AeroButton>
        </motion.div>

        <motion.div
          variants={slideUpImageVariants}
          initial={imageMotion.initial}
          animate={imageMotion.animate}
          custom={0.1}
          className={cn(
            "absolute bottom-0 right-[5%] z-[1] max-md:right-[2%] md:right-[15%] md:z-10",
            heroEntranceClass,
          )}
        >
          <Image
            src={HERO_PORTRAIT_SRC}
            alt=""
            width={347}
            height={661}
            priority
            onLoad={() => setHeroPortraitReady(true)}
            className={cn(
              "h-auto w-[62vw] max-w-[300px] object-contain transition-opacity duration-500 ease-out sm:w-[52vw] md:w-[25vw] md:max-w-none",
              heroPortraitReady
                ? "opacity-100 [filter:drop-shadow(0_0_32px_rgba(255,255,255,0.35))_drop-shadow(0_0_64px_rgba(255,255,255,0.18))]"
                : "opacity-0",
            )}
          />
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          initial={taglineMotion.initial}
          animate={taglineMotion.animate}
          custom={0.25}
          className={cn(
            "relative z-10 px-4 pb-8 text-left md:px-6 lg:px-8",
            heroEntranceClass,
          )}
        >
          <p className="font-sans max-w-2xl text-2xl font-bold leading-tight md:text-3xl">
            <span className="text-[var(--echo-text-1)]">We build brands, websites, and performance campaigns</span>{" "}
            <span className="text-[var(--echo-text-2)]/40">with intention, clarity and care.</span>
          </p>
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
              initial={statsMotion.initial}
              animate={statsMotion.animate}
              custom={0.3 + index * 0.05}
              className={cn("flex items-baseline gap-2 text-right", heroEntranceClass)}
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
          initial={scrollHintMotion.initial}
          animate={scrollHintMotion.animate}
          custom={0.55}
          className={cn(
            "absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--echo-text-3)] md:flex",
            heroEntranceClass,
          )}
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Scroll</span>
          {isMounted ? (
            <motion.span
              className="h-10 w-px bg-gradient-to-b from-[var(--echo-text-3)]/60 to-transparent"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <span className="h-10 w-px bg-gradient-to-b from-[var(--echo-text-3)]/60 to-transparent" />
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
