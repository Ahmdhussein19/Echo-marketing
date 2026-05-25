"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { useInView } from "@/hooks/use-in-view"

import "./how-we-work-section.css"

const howWeWorkEntranceTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

const howWeWorkEntranceContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const

const howWeWorkEntranceItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: howWeWorkEntranceTransition,
  },
} as const

const howWeWorkTrackEntranceVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...howWeWorkEntranceTransition,
      delay: 0.24,
    },
  },
} as const

interface Phase {
  step: string
  title: string
  subtitle: string
  body: string
  duration: string
  index: number
}

const PHASES: readonly Phase[] = [
  {
    index: 1,
    step: "STEP 1",
    title: "Discovery",
    subtitle: "We listen before we speak.",
    body: "Understanding your goals, constraints, audience, and what makes you impossible to replicate. No templates — only questions.",
    duration: "1–2 weeks",
  },
  {
    index: 2,
    step: "STEP 2",
    title: "Blueprint",
    subtitle: "Strategy before a single pixel.",
    body: "We translate everything we learned into a documented plan — channels, KPIs, creative direction. You approve it before anything moves.",
    duration: "1 week",
  },
  {
    index: 3,
    step: "STEP 3",
    title: "Build",
    subtitle: "Craft without compromise.",
    body: "This is where the work happens. Campaigns, content, design, code — all built with internal QA. You never see a first draft.",
    duration: "2–6 weeks",
  },
  {
    index: 4,
    step: "STEP 4",
    title: "Launch",
    subtitle: "Live — and we stay in the room.",
    body: "We don't hand off and disappear. Launch week means daily monitoring, real-time adjustments, and a Day 7 performance report.",
    duration: "1 week",
  },
  {
    index: 5,
    step: "STEP 5",
    title: "Optimize",
    subtitle: "The work that compounds.",
    body: "Weekly reviews. Monthly strategy calls. Quarterly audits. This is where short-term campaigns become long-term brand equity.",
    duration: "Ongoing",
  },
] as const

function PhaseCard({ phase }: { phase: Phase }) {
  return (
    <div className="how-we-work-phase-card">
      <span aria-hidden className="how-we-work-phase-index">
        {phase.index}
      </span>

      <div>
        <span className="how-we-work-phase-step">
          {phase.step}
          <span className="how-we-work-phase-step-dot">.</span>
        </span>
      </div>

      <div className="how-we-work-phase-title-block">
        <h3 className="how-we-work-phase-title">{phase.title}</h3>
        <p className="how-we-work-phase-subtitle">{phase.subtitle}</p>
      </div>

      <div className="how-we-work-phase-footer">
        <p className="how-we-work-phase-body">{phase.body}</p>
        <div className="how-we-work-duration">
          <span className="how-we-work-duration-label">Duration</span>
          <span className="how-we-work-duration-value">{phase.duration}</span>
        </div>
      </div>
    </div>
  )
}

function HowWeWorkCtaCard() {
  return (
    <div className="how-we-work-cta-card">
      <span className="how-we-work-cta-label">Ready?</span>
      <div>
        <h3 className="how-we-work-cta-title">Let&apos;s start your first phase.</h3>
        <a href="#contact" className="how-we-work-cta-link">
          Start the conversation →
        </a>
      </div>
    </div>
  )
}

function useHorizontalScrollDistance(
  trackRef: RefObject<HTMLDivElement | null>,
  viewportRef: RefObject<HTMLDivElement | null>,
) {
  const [maxScrollPx, setMaxScrollPx] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return

    const update = () => {
      const nextMaxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth)
      setMaxScrollPx(nextMaxScroll)
    }

    update()

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null

    resizeObserver?.observe(track)
    resizeObserver?.observe(viewport)
    window.addEventListener("resize", update)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [trackRef, viewportRef])

  return maxScrollPx
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(media.matches)

    update()
    media.addEventListener("change", update)

    return () => media.removeEventListener("change", update)
  }, [])

  return isMobile
}

function useCarouselScrollX(
  scrollYProgress: MotionValue<number>,
  maxScrollPx: number,
  isMobile: boolean,
) {
  return useTransform(scrollYProgress, (progress) => {
    if (maxScrollPx <= 0) return 0

    const adjustedProgress = isMobile
      ? Math.max(0, Math.min(1, (progress - 0.08) / 0.92))
      : progress

    return -adjustedProgress * maxScrollPx
  })
}

function HowWeWorkAnchor() {
  return (
    <div className="how-we-work-anchor">
      <span className="how-we-work-label">(PROCESS)</span>
      <h2 id="how-we-work-headline" className="how-we-work-headline">
        HOW
        <br />
        WE
        <br />
        WORK
      </h2>
      <div aria-hidden className="how-we-work-accent-line" />
      <div className="how-we-work-scroll-hint">
        <motion.span
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="how-we-work-scroll-arrow"
          aria-hidden
        >
          →
        </motion.span>
        <span className="how-we-work-scroll-text">Scroll to explore</span>
      </div>
    </div>
  )
}

function HowWeWorkAnimatedAnchor({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      animate={isInView ? "visible" : "hidden"}
      className="how-we-work-anchor"
      initial="hidden"
      variants={howWeWorkEntranceContainerVariants}
    >
      <motion.span className="how-we-work-label origin-bottom" variants={howWeWorkEntranceItemVariants}>
        (PROCESS)
      </motion.span>
      <motion.h2
        id="how-we-work-headline"
        className="how-we-work-headline origin-bottom"
        variants={howWeWorkEntranceItemVariants}
      >
        HOW
        <br />
        WE
        <br />
        WORK
      </motion.h2>
      <motion.div
        aria-hidden
        className="how-we-work-accent-line origin-bottom"
        variants={howWeWorkEntranceItemVariants}
      />
      <motion.div className="how-we-work-scroll-hint origin-bottom" variants={howWeWorkEntranceItemVariants}>
        <motion.span
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="how-we-work-scroll-arrow"
          aria-hidden
        >
          →
        </motion.span>
        <span className="how-we-work-scroll-text">Scroll to explore</span>
      </motion.div>
    </motion.div>
  )
}

function HowWeWorkCarousel({
  isInView,
  sectionRef,
}: {
  isInView: boolean
  sectionRef: RefObject<HTMLElement | null>
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobileViewport()
  const { scrollYProgress } = useScroll({ target: sectionRef })
  const maxScrollPx = useHorizontalScrollDistance(trackRef, viewportRef)
  const x = useCarouselScrollX(scrollYProgress, maxScrollPx, isMobile)

  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      aria-labelledby="how-we-work-headline"
      className="how-we-work-section"
    >
      <div className="how-we-work-sticky">
        <HowWeWorkAnimatedAnchor isInView={isInView} />
        <motion.div
          ref={viewportRef}
          animate={isInView ? "visible" : "hidden"}
          className="how-we-work-track-viewport origin-bottom"
          initial="hidden"
          variants={howWeWorkTrackEntranceVariants}
        >
          <motion.div
            ref={trackRef}
            className="how-we-work-track"
            style={{ x, willChange: "transform" }}
          >
            {PHASES.map((phase) => (
              <PhaseCard key={phase.index} phase={phase} />
            ))}
            <HowWeWorkCtaCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function HowWeWorkStatic({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>
}) {
  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      aria-labelledby="how-we-work-headline"
      className="how-we-work-section how-we-work-section--static"
    >
      <div className="how-we-work-sticky">
        <HowWeWorkAnchor />
        <div className="how-we-work-track-wrap">
          <div className="how-we-work-track">
            {PHASES.map((phase) => (
              <PhaseCard key={phase.index} phase={phase} />
            ))}
            <HowWeWorkCtaCard />
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowWeWorkSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const useEntranceMotion = prefersReducedMotion !== true
  const { isInView } = useInView<HTMLElement>({
    enabled: useEntranceMotion,
    ref: sectionRef,
    resetOnLeave: false,
    threshold: 0.1,
  })

  if (prefersReducedMotion) {
    return <HowWeWorkStatic sectionRef={sectionRef} />
  }

  return <HowWeWorkCarousel isInView={isInView} sectionRef={sectionRef} />
}
