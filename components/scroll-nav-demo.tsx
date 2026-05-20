"use client"

import { motion } from "framer-motion"

import { AgencyHero } from "@/components/ui/agency-hero"
import { ScrollNavigationMenu } from "@/components/ui/scroll-navigation-menu"

const SECTIONS = [
  { id: "about", title: "About" },
  { id: "services", title: "Services" },
  { id: "contact", title: "Contact" },
  { id: "info", title: "Info" },
] as const

export function ScrollNavDemo() {
  return (
    <ScrollNavigationMenu logoLabel="Echo">
      <AgencyHero />

      <div className="bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14 lg:px-8 lg:py-16">
          <motion.div className="space-y-4 md:space-y-5">
            {SECTIONS.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"
              >
                <h2 className="text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="font-subtitle mt-1 leading-relaxed text-muted-foreground">
                  Strategy, creative, and performance media — built as one cohesive
                  system so every touchpoint reinforces your brand story.
                </p>
              </motion.section>
            ))}
          </motion.div>
        </div>
      </div>
    </ScrollNavigationMenu>
  )
}
