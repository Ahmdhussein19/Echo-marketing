"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { Marquee } from "@/components/ui/marquee"
import { useInView } from "@/hooks/use-in-view"
import { useRef } from "react"

const CLIENT_LOGOS = [
  { src: "/assets/our client/AL USUS.png", alt: "AL USUS", width: 160, height: 60 },
  { src: "/assets/our client/MOTIVO -01.png", alt: "MOTIVO", width: 160, height: 60 },
  { src: "/assets/our client/a7.jpg", alt: "A7", width: 160, height: 60 },
  { src: "/assets/our client/dr megahed -03.png", alt: "Dr Megahed", width: 160, height: 60, large: true },
  { src: "/assets/our client/etriplesoft.png", alt: "Etriplesoft", width: 160, height: 60 },
  { src: "/assets/our client/expresstires.png", alt: "Express Tires", width: 160, height: 60, large: true },
  { src: "/assets/our client/ferrometal.png", alt: "Ferrometal", width: 160, height: 60 },
  { src: "/assets/our client/gcfx.png", alt: "GCFX", width: 160, height: 60 },
  { src: "/assets/our client/mazaya.png", alt: "Mazaya", width: 160, height: 60 },
  { src: "/assets/our client/micronet.png", alt: "Micronet", width: 160, height: 60 },
  { src: "/assets/our client/panntone.png", alt: "Panntone", width: 160, height: 60 },
  { src: "/assets/our client/ram-electronics.png", alt: "Ram Electronics", width: 160, height: 60, large: true },
  { src: "/assets/our client/redcircle.png", alt: "Redcircle", width: 160, height: 60, large: true },
  { src: "/assets/our client/yax.png", alt: "YAX", width: 160, height: 60 },
] as const

const ROW_ONE = CLIENT_LOGOS.slice(0, 4)
const ROW_TWO = CLIENT_LOGOS.slice(4, 8)
const ROW_THREE = CLIENT_LOGOS.slice(8, 11)
const ROW_FOUR = CLIENT_LOGOS.slice(11, 14)

function ClientLogo({ src, alt, width, height, large = false }: { src: string; alt: string; width: number; height: number; large?: boolean }) {
  return (
    <div className={`flex shrink-0 items-center justify-center px-2 py-0 ${large ? "w-[340px]" : "w-[180px]"}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`h-auto w-auto max-w-full object-contain ${large ? "max-h-[140px]" : "max-h-[65px]"}`}
        unoptimized
      />
    </div>
  )
}

const entranceTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

const entranceContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const

const entranceItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: entranceTransition,
  },
} as const

export function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isInView } = useInView<HTMLElement>({
    enabled: true,
    ref: sectionRef,
    resetOnLeave: false,
    threshold: 0.1,
  })

  return (
    <section
      ref={sectionRef}
      id="clients"
      aria-labelledby="clients-headline"
      className="w-full border-t border-[#e5e5e5] bg-[#fafafa] py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 text-center md:px-6 lg:px-8">
        <motion.div
          animate={isInView ? "visible" : "hidden"}
          initial="hidden"
          variants={entranceContainerVariants}
        >
          <motion.span
            variants={entranceItemVariants}
            className="mb-3 inline-block font-mono text-[10px] tracking-[0.13em] text-[var(--echo-orange)] uppercase"
          >
            (CLIENTS)
          </motion.span>
          <motion.h2
            id="clients-headline"
            variants={entranceItemVariants}
            className="font-heading text-5xl leading-[0.9] font-bold text-[#111111] uppercase md:text-7xl lg:text-8xl"
          >
            TRUSTED
            <br />
            BY
          </motion.h2>
        </motion.div>
      </div>

      <div className="mt-8 flex flex-col gap-0 md:mt-10">
        <Marquee className="[--gap:0.5rem] -my-2">
          {ROW_ONE.map((logo) => (
            <ClientLogo key={logo.alt} {...logo} />
          ))}
        </Marquee>
        <Marquee className="[--gap:0.5rem] -my-2" reverse>
          {ROW_TWO.map((logo) => (
            <ClientLogo key={logo.alt} {...logo} />
          ))}
        </Marquee>
        <Marquee className="[--gap:0.5rem] -my-2" speed="slow">
          {ROW_THREE.map((logo) => (
            <ClientLogo key={logo.alt} {...logo} />
          ))}
        </Marquee>
        <Marquee className="[--gap:0.5rem] -my-2" reverse speed="fast">
          {ROW_FOUR.map((logo) => (
            <ClientLogo key={logo.alt} {...logo} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
