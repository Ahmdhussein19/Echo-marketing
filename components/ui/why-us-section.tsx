"use client"

import { useReducedMotion } from "framer-motion"

import { ShadowOverlay } from "@/components/ui/shadow-overlay"

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
    value: "10",
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

export function WhyUsSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section aria-labelledby="why-us-headline" className="why-us-section">
      <div aria-hidden className="why-us-section-background">
        <ShadowOverlay
          animation={
            prefersReducedMotion
              ? { scale: 0, speed: 90 }
              : WHY_US_SHADOW_ANIMATION
          }
          color="rgba(128, 128, 128, 1)"
          noise={WHY_US_SHADOW_NOISE}
          sizing="fill"
        />
      </div>

      <div className="why-us-content-bleed px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
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
        </div>
      </div>

      <div className="why-us-content-bleed px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
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
        </div>
      </div>
    </section>
  )
}
