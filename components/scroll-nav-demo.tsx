"use client"

import { motion } from "framer-motion"

import { AgencyHero } from "@/components/ui/agency-hero"
import { ScrollNavigationMenu } from "@/components/ui/scroll-navigation-menu"

export function ScrollNavDemo() {
  return (
    <ScrollNavigationMenu logoLabel="Echo">
      <AgencyHero />

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-120px" }}
        className="w-full border-y border-[var(--echo-border)] bg-[var(--echo-bg)]"
      >
        <div className="mx-auto max-w-5xl px-4 py-32 md:px-6 md:py-36 lg:px-8 lg:py-40">
          <div className="grid gap-8 text-left md:grid-cols-[0.2fr_0.8fr] md:items-start">
            <div className="flex h-full flex-col items-center justify-end text-center md:items-start md:text-left">
              <span className="font-heading text-xl uppercase tracking-[0.08em] text-[var(--echo-text-1)] sm:text-2xl">
                About
              </span>
            </div>
            <p className="font-sans text-3xl font-black leading-tight text-[var(--echo-text-1)] md:text-4xl">
              Blending years of web design and branding expertise to craft meaningful, story-driven
              digital experiences.
            </p>
          </div>
        </div>
      </motion.section>

    </ScrollNavigationMenu>
  )
}
