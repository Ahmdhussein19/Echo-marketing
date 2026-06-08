"use client"

import { useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { ShadowOverlay } from "@/components/ui/shadow-overlay"
import { useInView } from "@/hooks/use-in-view"
import {
  serviceEntranceContainerVariants,
  serviceEntranceItemVariants,
} from "@/lib/service-entrance-motion"

import "./why-us-section.css"

interface WhyUsStat {
  suffix: string
  value: string
  label: readonly [string, string]
}

const WHY_US_STATS: readonly WhyUsStat[] = [
  {
    value: "300",
    suffix: "+",
    label: ["Successful projects", "completed"],
  },
  {
    value: "7",
    suffix: "+",
    label: ["Years of experience", "in creative industry"],
  },
  {
    value: "99",
    suffix: "%",
    label: ["Customer", "satisfaction rate"],
  },
  {
    value: "25",
    suffix: "M",
    label: ["In Client revenue", "growth"],
  },
] as const

const WHY_US_SUPPORT_COPY =
  "With a decade of expertise, We crafts bold brands and high-impact digital experience that get results."

const WHY_US_SHADOW_ANIMATION = {
  scale: 100,
  speed: 90,
} as const

const WHY_US_SHADOW_NOISE = {
  opacity: 1,
  scale: 1.2,
} as const

const WHY_US_STAT_STAGGER = 0.16

const whyUsStatNumberVariants = {
  hidden: { opacity: 0, x: 64, y: 48 },
  visible: { opacity: 1, x: 0, y: 0 },
} as const

const whyUsStatNumberTransition = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

function getWhyUsStatRevealDelay(index: number, total: number) {
  return (total - 1 - index) * WHY_US_STAT_STAGGER
}

function WhyUsStaticContent() {
  return (
    <>
      <div className="why-us-top-row">
        <div className="why-us-support-col">
          <p className="why-us-support-text">{WHY_US_SUPPORT_COPY}</p>
        </div>
        <div className="why-us-headline-col">
          <p className="why-us-label">(WHY US)</p>
          <h2 id="why-us-headline" className="why-us-headline">
            NUMBERS
            <br />
            DON&apos;T LIE
          </h2>
        </div>
      </div>

      <div aria-hidden className="why-us-dash-sep" />

      <dl className="why-us-stats-row">
        {WHY_US_STATS.map(({ label, suffix, value }) => (
          <div key={value + suffix} className="why-us-stat-block">
            <dt className="why-us-stat-number">
              {value}
              <span className="why-us-stat-sfx">{suffix}</span>
            </dt>
            <dd className="why-us-stat-label m-0">
              {label[0]}
              <br />
              {label[1]}
            </dd>
          </div>
        ))}
      </dl>
    </>
  )
}

function WhyUsAnimatedContent({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      animate={isInView ? "visible" : "hidden"}
      initial="hidden"
      variants={serviceEntranceContainerVariants}
    >
      <motion.div className="why-us-top-row" variants={serviceEntranceContainerVariants}>
        <motion.div
          className="why-us-support-col origin-bottom"
          variants={serviceEntranceItemVariants}
        >
          <p className="why-us-support-text">{WHY_US_SUPPORT_COPY}</p>
        </motion.div>
        <motion.div
          className="why-us-headline-col origin-bottom"
          variants={serviceEntranceItemVariants}
        >
          <p className="why-us-label">(WHY US)</p>
          <h2 id="why-us-headline" className="why-us-headline">
            NUMBERS
            <br />
            DON&apos;T LIE
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="why-us-dash-sep origin-bottom"
        variants={serviceEntranceItemVariants}
      />

      <dl className="why-us-stats-row">
        {WHY_US_STATS.map(({ label, suffix, value }, index) => (
          <div key={value + suffix} className="why-us-stat-block">
            <motion.dt
              animate={isInView ? "visible" : "hidden"}
              className="why-us-stat-number"
              initial="hidden"
              transition={{
                ...whyUsStatNumberTransition,
                delay: getWhyUsStatRevealDelay(index, WHY_US_STATS.length),
              }}
              variants={whyUsStatNumberVariants}
            >
              {value}
              <span className="why-us-stat-sfx">{suffix}</span>
            </motion.dt>
            <dd className="why-us-stat-label m-0">
              {label[0]}
              <br />
              {label[1]}
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}

export function WhyUsSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { isInView } = useInView<HTMLElement>({
    enabled: prefersReducedMotion !== true,
    ref: sectionRef,
    resetOnLeave: false,
    threshold: 0.2,
  })
  const useEntranceMotion = prefersReducedMotion !== true

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-us-headline"
      className="why-us-section"
    >
      <div aria-hidden className="why-us-section-background">
        <ShadowOverlay
          animation={
            prefersReducedMotion
              ? { scale: 0, speed: 90 }
              : WHY_US_SHADOW_ANIMATION
          }
          color="rgba(128, 128, 128, 1)"
          isActive={isInView}
          noise={WHY_US_SHADOW_NOISE}
          sizing="fill"
        />
      </div>

      <div className="why-us-content-bleed px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {useEntranceMotion ? (
            <WhyUsAnimatedContent isInView={isInView} />
          ) : (
            <WhyUsStaticContent />
          )}
        </div>
      </div>
    </section>
  )
}
