"use client"

import dynamic from "next/dynamic"
import { useRef, type CSSProperties, type RefObject } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { AgencyHero } from "@/components/ui/agency-hero"
import {
  ServiceMediaBento,
  type ServiceMediaItem,
} from "@/components/ui/service-media-bento"
import { ScrollNavigationMenu } from "@/components/ui/scroll-navigation-menu"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { useInView } from "@/hooks/use-in-view"
import {
  serviceEntranceContainerVariants,
  serviceEntranceItemVariants,
} from "@/lib/service-entrance-motion"

const WhyUsSection = dynamic(
  () =>
    import("@/components/ui/why-us-section").then((module) => module.WhyUsSection),
  {
    loading: () => (
      <div aria-hidden className="min-h-[520px] bg-[#111111]" />
    ),
  },
)

const HowWeWorkSection = dynamic(
  () =>
    import("@/components/ui/how-we-work-section").then(
      (module) => module.HowWeWorkSection,
    ),
  {
    loading: () => (
      <div aria-hidden className="min-h-[380vh] bg-[var(--echo-bg)]" />
    ),
  },
)

const EchoHoverFooter = dynamic(
  () =>
    import("@/components/ui/echo-hover-footer").then(
      (module) => module.EchoHoverFooter,
    ),
  {
    loading: () => (
      <div aria-hidden className="min-h-[720px] bg-[var(--echo-bg)]" />
    ),
  },
)

const ClientsSection = dynamic(
  () =>
    import("@/components/ui/clients-section").then(
      (module) => module.ClientsSection,
    ),
  {
    loading: () => (
      <div aria-hidden className="min-h-[400px] bg-[var(--echo-bg)]" id="clients" />
    ),
  },
)

const EchoContactSection = dynamic(
  () =>
    import("@/components/ui/echo-contact-section").then(
      (module) => module.EchoContactSection,
    ),
  {
    loading: () => (
      <div aria-hidden className="min-h-screen bg-[var(--echo-bg)]" id="contact" />
    ),
  },
)

const ABOUT_COPY =
  "Blending years of web design and branding expertise to craft meaningful, story-driven digital experiences."

interface GlowCharacter {
  char: string
  index: number
}

const ABOUT_WORDS: GlowCharacter[][] = (() => {
  const words: GlowCharacter[][] = []
  let index = 0

  for (const word of ABOUT_COPY.split(" ")) {
    const characters = word.split("").map((char) => {
      const glowCharacter: GlowCharacter = { char, index }
      index += 1
      return glowCharacter
    })

    words.push(characters)
  }

  return words
})()

const ABOUT_CHARACTER_COUNT = ABOUT_WORDS.reduce(
  (total, word) => total + word.length,
  0
)
interface ServiceItem {
  title: string
  description?: string
  images?: ServiceMediaItem[]
}

const SERVICES: ServiceItem[] = [
  {
    title: "Brand Identity",
    description:
      "We reach into the noise and pull out the one thing only you can own. A mark. A voice. A feeling that arrives before you do.",
    images: [
      {
        src: "/images/brand identity/YWSvHCMaTi0jzTQD8XqRK7joMM.avif",
        width: 1200,
        height: 1200,
        alt: "Brand identity campaign photography",
        colSpan: 2,
        rowSpan: 2,
      },
      {
        src: "/images/brand identity/ZJv91mx5tFoWLKnF1ya3vvU17I.avif",
        width: 1200,
        height: 800,
        alt: "Brand identity wide campaign visual",
        colSpan: 1,
        rowSpan: 1,
      },
      {
        src: "/images/brand identity/fj6vHdxwJmXxa3SWyxXCZlXjk (1).avif",
        width: 800,
        height: 800,
        alt: "Brand identity mark and packaging detail",
        colSpan: 1,
        rowSpan: 1,
      },
    ],
  },
  {
    title: "Content Creation",
    description:
      "Most content fills a calendar. Ours fills a room with people who want more. Platform-native. Audience-obsessive. Never generic.",
    images: [
      {
        src: "/images/content creation/Still_Human_Futuristic_minimalist_male_editorial_campaign_exp_9b380a21-8576-43c0-ac80-e04f0f1c0c54_0.jpg",
        width: 1648,
        height: 2944,
        alt: "Futuristic minimalist male editorial campaign portrait",
        colSpan: 2,
        rowSpan: 2,
      },
      {
        src: "/images/content creation/u8969295761_Blue_background._Surreal_hyper_realistic_cinemati_0f1b29b0-beca-4c97-aa73-d5332021340f_3.jpg",
        width: 816,
        height: 1456,
        alt: "Surreal cinematic editorial of a woman reading a burning newspaper as a plane crashes behind her",
        colSpan: 1,
        rowSpan: 2,
      },
    ],
  },
  {
    title: "SEO",
    description:
      "Every article we write, every link we earn, every technical fix we implement — it doesn't expire. It builds. Invisibly, permanently.",
    images: [
      {
        kind: "seo-chart",
        alt: "SEO growth chart showing rising organic performance after SEOSpark",
      },
    ],
  },
  {
    title: "Website Development",
    description:
      "We build experiences that load in a breath, hold attention, and turn browsers into buyers.",
    images: [
      {
        src: "/images/website/6ZzUQObban53fljReJnmpE7Gw.avif",
        width: 1200,
        height: 800,
        alt: "Responsive website layout preview",
        colSpan: 2,
        rowSpan: 2,
      },
      {
        src: "/images/website/O9GTVSOp5qfdcnPZ0RpGBtAKd4.avif",
        width: 1200,
        height: 1200,
        alt: "Website design mockup for a modern digital product",
        colSpan: 1,
        rowSpan: 1,
      },
      {
        src: "/images/website/x1W4oQBvmcvuOt4GlWOEKQMUUOc.avif",
        width: 800,
        height: 800,
        alt: "Website development interface detail",
        colSpan: 1,
        rowSpan: 1,
      },
    ],
  },
  {
    title: "Mobile Applications",
    description:
      "Most apps die on Day 7. Ours are designed from the ground up around the one metric that matters: whether someone opens it again tomorrow.",
    images: [
      {
        src: "/images/mobile/original-9056a885a1473270d7b709c911c29b6f.webp",
        width: 1504,
        height: 1128,
        alt: "Mobile app UI design preview with navigation and content layout",
        colSpan: 1,
        rowSpan: 1,
        colStart: 1,
        rowStart: 1,
      },
      {
        src: "/images/mobile/original-d103401a601082dbe993790799476694.webp",
        width: 1200,
        height: 900,
        alt: "Mobile application screen detail showing app features and interactions",
        colSpan: 1,
        rowSpan: 1,
        colStart: 1,
        rowStart: 2,
      },
      {
        src: "/images/mobile/original-a1ae494e232ff035eeaa6b2ab6376272.webp",
        width: 1700,
        height: 1200,
        alt: "Mobile application interface mockup showing primary app screens",
        colSpan: 2,
        rowSpan: 2,
        colStart: 2,
        rowStart: 1,
      },
    ],
  },
  {
    title: "Media Buying",
    description:
      "We deploy it. Every dirham goes to the right person at the right moment — and we know why it worked or didn't.",
    images: [
      {
        src: "/images/media buyig/168e8dce7ea89a6bb78d85f39a39c804.webp",
        width: 2048,
        height: 1536,
        alt: "Media buying campaign performance dashboard on a dark card interface",
        unoptimized: true,
      },
    ],
  },
  {
    title: "Media Production",
    description:
      "We bring creative direction that turns a product into a world worth living in.",
    images: [
      {
        kind: "video",
        src: "/images/media production/Beige Minimalist Femme Fashion Video Ad Promo.mp4",
        alt: "Beige minimalist femme fashion video ad promo showcasing media production",
      },
    ],
  },
  {
    title: "Reel Creation",
    description: "Three seconds. That's the window.",
    images: [
      {
        kind: "video",
        src: "/images/Reel/Black and White Noir Fashion Collection Lookbook Instagram Reel (1).mp4",
        alt: "Black and white noir fashion collection lookbook Instagram reel",
        colSpan: 2,
        rowSpan: 2,
      },
      {
        kind: "video",
        src: "/images/Reel/White Bold Daily Watch Mobile Video.mp4",
        alt: "White bold daily watch mobile reel video",
        colSpan: 1,
        rowSpan: 2,
      },
    ],
  },
]

const SERVICE_DESCRIPTION_FADE_IN_END = 0.45
const SERVICE_DESCRIPTION_FADE_OUT_START = 0.5

interface GlowParagraphProps {
  progress?: MotionValue<number>
}

function GlowParagraph({ progress }: GlowParagraphProps) {
  const isMounted = useIsMounted()

  if (!progress || !isMounted) {
    return (
      <p className="font-sans text-3xl leading-none font-black text-[var(--echo-text-1)] md:text-5xl">
        {ABOUT_COPY}
      </p>
    )
  }

  return (
    <motion.p
      className="about-glow-paragraph font-sans text-3xl leading-none font-black md:text-5xl"
      style={{ "--scroll-progress": progress } as CSSProperties}
    >
      {ABOUT_WORDS.map((word, wordIndex) => (
        <span
          key={`word-${wordIndex}`}
          className="mr-[0.22em] inline-block last:mr-0"
        >
          {word.map(({ char, index }) => {
            const start = index / ABOUT_CHARACTER_COUNT
            const end = Math.min(start + 0.12, 1)

            return (
              <span
                key={`${char}-${index}`}
                className="about-glow-char inline-block"
                style={
                  {
                    "--char-start": start,
                    "--char-end": end,
                  } as CSSProperties
                }
              >
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </motion.p>
  )
}

interface AboutSectionProps {
  textProgress?: MotionValue<number>
}

function AboutSection({ textProgress }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="flex min-h-screen w-full items-center border-t border-[var(--echo-border)] bg-[var(--echo-bg)]"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-32 md:px-6 md:py-36 lg:px-8 lg:py-40">
        <div className="grid gap-8 text-left md:grid-cols-[0.2fr_0.8fr] md:items-start">
          <div className="flex h-full flex-col items-center justify-end text-center md:items-start md:text-left">
            <span className="font-heading text-xl tracking-[0.08em] text-[var(--echo-title-1)] uppercase sm:text-2xl">
              About
            </span>
          </div>
          <GlowParagraph progress={textProgress} />
        </div>
      </div>
    </section>
  )
}

interface TrackProgressItemProps {
  description?: string
  images?: ServiceMediaItem[]
  index: number
  title: string
}

const SERVICE_TITLE_STATIC_STYLE = {
  color: "#5f5f5f",
  opacity: 0.45,
  textShadow: "0 0 0 rgba(217,95,43,0)",
} as const

interface ServiceDescriptionProps {
  description: string
  descriptionLeaveProgress: MotionValue<number>
  descriptionRef: RefObject<HTMLParagraphElement | null>
  fadeInProgress: MotionValue<number>
  titleColorProgress: MotionValue<string>
  titleShadowProgress: MotionValue<string>
  useScrollStyles: boolean
}

function ServiceDescription({
  description,
  descriptionLeaveProgress,
  descriptionRef,
  fadeInProgress,
  titleColorProgress,
  titleShadowProgress,
  useScrollStyles,
}: ServiceDescriptionProps) {
  const descriptionFadeInOpacity = useTransform(fadeInProgress, (progress) => {
    if (progress <= SERVICE_DESCRIPTION_FADE_IN_END) {
      const fadeInAmount = progress / SERVICE_DESCRIPTION_FADE_IN_END
      return 0.45 + fadeInAmount * 0.55
    }

    return 1
  })

  const descriptionFadeOutOpacity = useTransform(
    descriptionLeaveProgress,
    [0, SERVICE_DESCRIPTION_FADE_OUT_START, 1],
    [1, 1, 0]
  )

  const descriptionOpacityProgress = useTransform(
    [descriptionFadeInOpacity, descriptionFadeOutOpacity],
    ([fadeIn, fadeOut]: number[]) => Math.min(fadeIn, fadeOut)
  )

  const descriptionStyle = useScrollStyles
    ? {
        color: titleColorProgress,
        opacity: descriptionOpacityProgress,
        textShadow: titleShadowProgress,
      }
    : SERVICE_TITLE_STATIC_STYLE

  return (
    <>
      <motion.p
        ref={descriptionRef}
        style={descriptionStyle}
        className="hidden md:block max-w-lg py-0 font-sans text-lg leading-tight md:max-w-xl md:text-xl md:leading-tight lg:text-2xl lg:leading-tight"
      >
        {description}
      </motion.p>
      <p
        className="md:hidden max-w-lg py-0 font-sans text-lg leading-tight"
        style={{ color: "var(--echo-text-2)" }}
      >
        {description}
      </p>
    </>
  )
}

function TrackProgressItem({
  description,
  images,
  index,
  title,
}: TrackProgressItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const isMounted = useIsMounted()
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  })
  const { scrollYProgress: descriptionLeaveProgress } = useScroll({
    target: descriptionRef,
    offset: ["start 0.92", "start 0.35"],
  })
  const titleColorProgress = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    ["#5f5f5f", "#c4c4c4", "#d95f2b"]
  )
  const titleOpacityProgress = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0.45, 1, 0.7]
  )
  const titleShadowProgress = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [
      "0 0 0 rgba(217,95,43,0)",
      "0 0 12px rgba(217,95,43,0.08)",
      "0 0 16px rgba(217,95,43,0.18)",
    ]
  )
  const useScrollStyles = isMounted && !prefersReducedMotion
  const titleStyle = useScrollStyles
    ? {
        color: titleColorProgress,
        opacity: titleOpacityProgress,
        textShadow: titleShadowProgress,
      }
    : SERVICE_TITLE_STATIC_STYLE
  const itemNumber = String(index + 1).padStart(2, "0")
  const { isInView: isRowInView } = useInView<HTMLDivElement>({
    enabled: prefersReducedMotion !== true,
    ref,
    resetOnLeave: false,
    threshold: 0.2,
  })

  const titleBlock = (
    <figure className="max-md:static md:sticky top-[calc(var(--nav-height)+24px)] z-10 m-0 w-full self-start p-0 text-left">
      <p
        aria-hidden
        className="echo-text-outline mb-3 font-heading text-6xl leading-none font-bold md:text-7xl lg:text-8xl"
      >
        {itemNumber}
      </p>
      <motion.h3
        style={titleStyle}
        className="py-0 font-segoe text-4xl leading-[0.9] font-bold md:text-6xl lg:text-7xl"
      >
        {title}
      </motion.h3>
    </figure>
  )

  const descriptionBlock =
    description ? (
      <ServiceDescription
        description={description}
        descriptionLeaveProgress={descriptionLeaveProgress}
        descriptionRef={descriptionRef}
        fadeInProgress={scrollYProgress}
        titleColorProgress={titleColorProgress}
        titleShadowProgress={titleShadowProgress}
        useScrollStyles={useScrollStyles}
      />
    ) : null

  return (
    <section className="flex h-screen max-h-[720px] items-center justify-center px-4 max-md:h-auto max-md:min-h-0 max-md:py-10 md:px-6 lg:px-8 [contain:layout_style]">
      <div
        ref={ref}
        className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 max-md:gap-10 md:grid-cols-[2fr_2.75fr]"
      >
        <div className="relative flex min-h-[460px] flex-col justify-between max-md:min-h-0 max-md:justify-start max-md:gap-6">
          {prefersReducedMotion ? (
            <>
              {titleBlock}
              {description ? (
                <p
                  ref={descriptionRef}
                  className="max-w-lg py-0 font-sans text-lg leading-tight md:max-w-xl md:text-xl md:leading-tight lg:text-2xl lg:leading-tight"
                  style={{ color: "var(--echo-text-2)" }}
                >
                  {description}
                </p>
              ) : null}
            </>
          ) : (
            <motion.div
              animate={isRowInView ? "visible" : "hidden"}
              className="flex min-h-[460px] flex-col justify-between max-md:min-h-0 max-md:justify-start max-md:gap-6"
              initial="hidden"
              variants={serviceEntranceContainerVariants}
            >
              <motion.figure
                className="max-md:static md:sticky md:top-[calc(var(--nav-height)+24px)] z-10 m-0 w-full origin-bottom self-start p-0 text-left"
                variants={serviceEntranceItemVariants}
              >
                <p
                  aria-hidden
                  className="echo-text-outline mb-3 font-heading text-6xl leading-none font-bold md:text-7xl lg:text-8xl"
                >
                  {itemNumber}
                </p>
                <motion.h3
                  style={titleStyle}
                  className="py-0 font-segoe text-4xl leading-[0.9] font-bold md:text-6xl lg:text-7xl"
                >
                  {title}
                </motion.h3>
              </motion.figure>
              {descriptionBlock ? (
                <motion.div className="origin-bottom" variants={serviceEntranceItemVariants}>
                  {descriptionBlock}
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </div>
        <div className="flex h-[460px] w-full items-center justify-center max-md:h-[min(360px,62vw)]">
          <ServiceMediaBento
            images={images ?? []}
            isInView={isRowInView}
            placeholder={itemNumber}
          />
        </div>
      </div>
    </section>
  )
}

function TrackElementWithinViewport() {
  return (
    <section id="services" className="bg-[var(--echo-bg)] py-20 max-md:pb-28 md:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center md:px-6 lg:px-8">
        <h2 className="font-heading text-5xl leading-[0.9] font-bold text-[var(--echo-title-1)] uppercase md:text-7xl lg:text-8xl">
          WHAT WE DO
        </h2>
      </div>
      <div className="mt-12 md:mt-16">
        {SERVICES.map(({ description, images, title }, index) => (
          <TrackProgressItem
            key={title}
            description={description}
            images={images}
            index={index}
            title={title}
          />
        ))}
      </div>
    </section>
  )
}

function TopScrollVanish() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-[var(--echo-bg)]/30 [mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.78)_34%,rgba(0,0,0,0.28)_72%,transparent_100%)] backdrop-blur-md md:h-36"
    />
  )
}

export function ScrollNavDemo() {
  const isMounted = useIsMounted()
  const transitionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ["start start", "end end"],
  })
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 1,
  })
  const activeProgress =
    isMounted && !prefersReducedMotion ? smoothScrollYProgress : scrollYProgress
  const aboutY = useTransform(activeProgress, [0, 0.45], ["100vh", "0vh"])
  const aboutTextProgress = useTransform(activeProgress, [0.45, 0.8], [0, 1])
  const useReducedLayout = isMounted && prefersReducedMotion === true

  if (useReducedLayout) {
    return (
      <ScrollNavigationMenu logoLabel="Echo">
        <TopScrollVanish />
        <AgencyHero />
        <AboutSection />
        <TrackElementWithinViewport />
        <WhyUsSection />
        <HowWeWorkSection />
        <ClientsSection />
        <EchoContactSection />
        <EchoHoverFooter />
      </ScrollNavigationMenu>
    )
  }

  return (
    <ScrollNavigationMenu logoLabel="Echo">
      <TopScrollVanish />
      <section
        ref={transitionRef}
        className="relative h-[400vh] bg-[var(--echo-bg)] [contain:layout_style]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <AgencyHero scrollProgress={activeProgress} />
          <motion.div
            style={{ y: aboutY, willChange: "transform" }}
            className="absolute inset-0 z-20"
          >
            <AboutSection textProgress={aboutTextProgress} />
          </motion.div>
        </div>
      </section>

      <TrackElementWithinViewport />
      <WhyUsSection />
      <HowWeWorkSection />
      <ClientsSection />
      <EchoContactSection />
      <EchoHoverFooter />
    </ScrollNavigationMenu>
  )
}
