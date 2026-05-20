"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import {
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Floating, FloatingElement } from "@/components/ui/parallax-floating"
import { TextRotate } from "@/components/ui/text-rotate"
import { cn } from "@/lib/utils"

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    alt: "Marketing team strategy session",
    className:
      "size-20 rotate-[-4deg] sm:size-28 md:size-32 lg:size-36",
    depth: 0.5,
    position: "top-[18%] left-[3%] md:top-[22%] md:left-[6%]",
    delay: 0.5,
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e5347f670?w=900&h=650&fit=crop",
    alt: "Creative agency workspace",
    className:
      "h-24 w-36 rotate-[-10deg] sm:h-32 sm:w-48 md:h-40 md:w-56",
    depth: 1,
    position: "top-[4%] left-[10%] md:top-[8%] md:left-[14%]",
    delay: 0.65,
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop",
    alt: "Team collaboration",
    className:
      "size-32 rotate-[-3deg] sm:size-40 md:size-48 lg:size-52",
    depth: 1.2,
    position: "top-[72%] left-[5%] md:top-[68%] md:left-[8%]",
    delay: 0.8,
  },
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=700&fit=crop",
    alt: "Analytics and growth dashboard",
    className:
      "h-28 w-40 rotate-[8deg] sm:h-36 sm:w-52 md:h-44 md:w-60",
    depth: 2,
    position: "top-[2%] right-[6%] md:top-[6%] md:right-[10%]",
    delay: 0.95,
  },
  {
    url: "https://images.unsplash.com/photo-1521737711862-ece13f8ba570?w=900&h=900&fit=crop",
    alt: "Brand campaign presentation",
    className:
      "size-36 rotate-[14deg] sm:size-44 md:size-52 lg:size-60",
    depth: 1.4,
    position: "top-[70%] right-[4%] md:top-[64%] md:right-[8%]",
    delay: 1.1,
  },
] as const

const ROTATING_WORDS = [
  "brands",
  "growth",
  "campaigns",
  "audiences",
  "revenue",
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const backdropScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.06])

  return (
    <section
      ref={sectionRef}
      id="top"
      className={cn(
        "relative flex min-h-[calc(100svh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden md:min-h-[calc(100svh-4rem)]",
        className,
      )}
    >
      <motion.div
        style={{ scale: backdropScale }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]"
      />

      <Floating sensitivity={-0.6} className="absolute inset-0">
        {HERO_IMAGES.map((image) => (
          <FloatingElement
            key={image.url}
            depth={image.depth}
            className={image.position}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: image.delay, duration: 0.5 }}
              className={cn(
                "relative overflow-hidden rounded-xl border border-border/60 shadow-2xl shadow-black/10",
                image.className,
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 30vw, 20vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority={image.delay < 0.7}
              />
            </motion.div>
          </FloatingElement>
        ))}
      </Floating>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center md:px-6 lg:px-8"
      >
        <motion.p
          variants={itemVariants}
          className="font-subtitle mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
        >
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          Premium marketing agency
        </motion.p>

        <motion.div variants={itemVariants} className="max-w-4xl">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">We amplify</span>
            <LayoutGroup>
              <span className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2">
                <span>your</span>
                <TextRotate
                  texts={ROTATING_WORDS}
                  mainClassName="text-primary"
                  staggerDuration={0.025}
                  staggerFrom="last"
                  rotationInterval={2800}
                  transition={{ type: "spring", damping: 28, stiffness: 380 }}
                />
              </span>
            </LayoutGroup>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="font-subtitle mt-3 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Echo crafts bold narratives, performance campaigns, and brand systems that
          turn attention into measurable growth.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-8"
        >
          <Button size="lg" className="gap-2 rounded-full px-6" asChild>
            <Link href="#contact">
              Start a project
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6" asChild>
            <Link href="#services">View our work</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 grid w-full max-w-3xl grid-cols-3 gap-4 md:mt-10"
        >
          {[
            { value: "120+", label: "Campaigns" },
            { value: "98%", label: "Retention" },
            { value: "4.2×", label: "Avg. ROAS" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="rounded-xl border border-border/50 bg-background/70 p-4 backdrop-blur-sm"
            >
              <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="font-subtitle mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
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
