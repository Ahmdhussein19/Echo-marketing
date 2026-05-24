"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState, type RefObject } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInView } from "@/hooks/use-in-view"
import {
  serviceEntranceTransition,
  serviceEntranceVariants,
} from "@/lib/service-entrance-motion"
import { cn } from "@/lib/utils"

export interface ServiceMediaImage {
  alt: string
  background?: "surface" | "white"
  colSpan?: 1 | 2 | 3
  colStart?: 1 | 2 | 3
  fit?: "contain" | "cover"
  height: number
  quality?: number
  rowSpan?: 1 | 2
  rowStart?: 1 | 2
  src: string
  unoptimized?: boolean
  width: number
}

export interface ServiceMediaChart {
  alt: string
  colSpan?: 1 | 2 | 3
  colStart?: 1 | 2 | 3
  kind: "seo-chart"
  rowSpan?: 1 | 2
  rowStart?: 1 | 2
}

export interface ServiceMediaVideo {
  alt: string
  colSpan?: 1 | 2 | 3
  colStart?: 1 | 2 | 3
  fit?: "contain" | "cover"
  kind: "video"
  rowSpan?: 1 | 2
  rowStart?: 1 | 2
  src: string
}

export type ServiceMediaItem =
  | ServiceMediaImage
  | ServiceMediaChart
  | ServiceMediaVideo

interface ServiceMediaBentoProps {
  images: ServiceMediaItem[]
  isInView?: boolean
  placeholder?: string
}

interface BentoPlacement {
  colSpan: 1 | 2 | 3
  rowSpan: 1 | 2
}

const BENTO_GRID_HEIGHT = 460
const BENTO_GRID_GAP = 16
/** Approximate desktop column width — used only for `sizes`, not layout. */
const BENTO_GRID_REFERENCE_WIDTH = 760

const COL_SPAN_CLASS = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
} as const

const ROW_SPAN_CLASS = {
  1: "row-span-1",
  2: "row-span-2",
} as const

const COL_START_CLASS = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
} as const

const ROW_START_CLASS = {
  1: "row-start-1",
  2: "row-start-2",
} as const

const GRID_CLASS_NAME =
  "grid h-[min(360px,62vw)] w-full grid-cols-3 grid-rows-2 gap-4 md:h-[460px]"

function ServiceMediaBentoGrid({
  children,
  isInView: isInViewProp,
}: {
  children: React.ReactNode
  isInView?: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const { containerRef, isInView: internalInView } = useInView<HTMLDivElement>({
    enabled: prefersReducedMotion !== true && isInViewProp === undefined,
    resetOnLeave: false,
    threshold: 0.2,
  })
  const isInView = isInViewProp ?? internalInView

  if (prefersReducedMotion) {
    return <div className={GRID_CLASS_NAME}>{children}</div>
  }

  return (
    <motion.div
      ref={isInViewProp === undefined ? containerRef : undefined}
      animate={isInView ? "visible" : "hidden"}
      className={cn(GRID_CLASS_NAME, "origin-bottom")}
      initial="hidden"
      transition={serviceEntranceTransition}
      variants={serviceEntranceVariants}
    >
      {children}
    </motion.div>
  )
}

function getDefaultPlacement(count: number, index: number): BentoPlacement {
  if (count === 1) {
    return { colSpan: 3, rowSpan: 2 }
  }

  if (count === 2) {
    return index === 0 ? { colSpan: 2, rowSpan: 2 } : { colSpan: 1, rowSpan: 2 }
  }

  if (count === 3) {
    if (index === 0) {
      return { colSpan: 2, rowSpan: 2 }
    }

    return { colSpan: 1, rowSpan: 1 }
  }

  if (count === 4) {
    return index === 3 ? { colSpan: 2, rowSpan: 1 } : { colSpan: 1, rowSpan: 1 }
  }

  return { colSpan: 1, rowSpan: 1 }
}

function getCellDimensions(colSpan: 1 | 2 | 3, rowSpan: 1 | 2) {
  const columnUnit = (BENTO_GRID_REFERENCE_WIDTH - BENTO_GRID_GAP * 2) / 3
  const rowUnit = (BENTO_GRID_HEIGHT - BENTO_GRID_GAP) / 2
  const width = colSpan * columnUnit + (colSpan - 1) * BENTO_GRID_GAP
  const height = rowSpan * rowUnit + (rowSpan - 1) * BENTO_GRID_GAP

  return {
    width: Math.round(width),
    height: Math.round(height),
  }
}

function getImageSizes(colSpan: 1 | 2 | 3, rowSpan: 1 | 2): string {
  const { width, height } = getCellDimensions(colSpan, rowSpan)

  if (colSpan === 3 && rowSpan === 2) {
    return `(max-width: 768px) 100vw, (max-width: 1280px) 55vw, ${width}px`
  }

  return `(max-width: 768px) 100vw, ${Math.max(width, height)}px`
}

function getCellBackgroundClass(
  image: ServiceMediaImage,
  fit: "contain" | "cover"
) {
  if (image.background === "white") {
    return "bg-white"
  }

  if (image.background === "surface" || fit === "contain") {
    return "bg-[var(--echo-surface-1)]/45"
  }

  return undefined
}

function SeoGrowthChart({ alt, animate }: { alt: string; animate: boolean }) {
  const [animationKey, setAnimationKey] = useState(0)
  const wasAnimatingRef = useRef(false)

  useEffect(() => {
    if (animate && !wasAnimatingRef.current) {
      setAnimationKey((key) => key + 1)
    }

    wasAnimatingRef.current = animate
  }, [animate])

  const metricItems = [
    ["+570k+", "Return on Investment"],
    ["+690k+", "Monthly Organic Traffic"],
    ["+800k+", "Ranking Keywords"],
  ] as const

  const chartData = [
    { month: "Jan", after: 94, before: 92 },
    { month: "Feb", after: 132, before: 96 },
    { month: "Mar", after: 146, before: 101 },
    { month: "Apr", after: 155, before: 105 },
    { month: "May", after: 226, before: 109 },
    { month: "Jun", after: 249, before: 112 },
    { month: "Jul", after: 275, before: 116 },
    { month: "Aug", after: 302, before: 121 },
    { month: "Sep", after: 326, before: 124 },
    { month: "Oct", after: 418, before: 128 },
  ] as const

  const chartConfig = {
    before: {
      label: "Before SEO",
      color: "rgba(70, 76, 124, 0.52)",
    },
    after: {
      label: "After SEO",
      color: "#535b99",
    },
  } satisfies ChartConfig

  return (
    <div
      aria-label={alt}
      className="relative flex h-full min-h-0 w-full flex-col justify-end overflow-hidden bg-[#030303] px-3 pt-5 pb-4 text-white sm:px-6 sm:pt-8 sm:pb-6"
      role="img"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(86,93,150,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]"
      />
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-x-0 top-0 h-[82%]">
          {[12, 34, 50, 67, 83].map((left, index) => (
            <span
              aria-hidden
              className={cn(
                "absolute top-0 h-full w-px bg-[rgba(87,96,145,0.16)]",
                index === 1 && "bg-[rgba(111,119,190,0.35)]"
              )}
              key={left}
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
        <ChartContainer
          id="seo-growth-chart"
          className="absolute inset-x-0 top-1 h-[86%] w-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            key={animationKey}
            margin={{ bottom: 8, left: 8, right: 8, top: 8 }}
          >
            <defs>
              <linearGradient id="fillBeforeSeo" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="8%"
                  stopColor="var(--color-before)"
                  stopOpacity={0.34}
                />
                <stop
                  offset="92%"
                  stopColor="var(--color-before)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillAfterSeo" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-after)"
                  stopOpacity={0.34}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-after)"
                  stopOpacity={0.03}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              stroke="rgba(87,96,145,0.16)"
              vertical
            />
            <XAxis axisLine={false} dataKey="month" hide tickLine={false} />
            <YAxis domain={[60, 450]} hide />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={{
                stroke: "rgba(111,119,190,0.28)",
                strokeWidth: 1,
              }}
            />
            <Area
              activeDot={{
                fill: "var(--color-before)",
                r: 4,
                stroke: "rgba(255,255,255,0.14)",
              }}
              animationDuration={900}
              dataKey="before"
              dot={false}
              fill="url(#fillBeforeSeo)"
              fillOpacity={1}
              isAnimationActive={animate}
              stroke="var(--color-before)"
              strokeWidth={2}
              type="natural"
            />
            <Area
              activeDot={{
                fill: "var(--color-after)",
                r: 5,
                stroke: "rgba(255,255,255,0.18)",
              }}
              animationDuration={900}
              dataKey="after"
              dot={{
                fill: "var(--color-after)",
                r: 4,
                stroke: "rgba(81,89,145,0.28)",
                strokeWidth: 7,
              }}
              fill="url(#fillAfterSeo)"
              fillOpacity={1}
              isAnimationActive={animate}
              stroke="var(--color-after)"
              strokeLinecap="round"
              strokeWidth={3}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
        <div className="seo-chart-callout absolute top-[20%] left-[30%] rounded-full border border-white/5 bg-[#111116]/90 px-5 py-2 font-segoe text-sm font-normal tracking-normal text-[#f4f2fb] shadow-[0_0_24px_rgba(70,75,120,0.28)] backdrop-blur-md sm:left-[29%] sm:px-7 sm:py-3 sm:text-2xl">
          After <span className="text-[#f7f7ff]">↗</span> SEOSpark
        </div>
      </div>
      <div className="relative grid shrink-0 grid-cols-3 gap-2 pt-3 text-center">
        {metricItems.map(([value, label]) => (
          <div className="min-w-0" key={label}>
            <p className="font-segoe text-xl leading-none font-bold tracking-normal text-[#f5f5f7] sm:text-4xl">
              {value}
            </p>
            <p className="mt-2 font-segoe text-[10px] leading-tight font-normal tracking-normal text-[#8f8f94] sm:mt-4 sm:text-lg">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function isChartItem(image: ServiceMediaItem): image is ServiceMediaChart {
  return "kind" in image && image.kind === "seo-chart"
}

function isVideoItem(image: ServiceMediaItem): image is ServiceMediaVideo {
  return "kind" in image && image.kind === "video"
}

function ServiceBentoVideo({
  alt,
  fit,
  src,
  videoRef,
}: {
  alt: string
  fit: "contain" | "cover"
  src: string
  videoRef: RefObject<HTMLVideoElement | null>
}) {
  const objectFitClass =
    fit === "contain" ? "object-contain object-center" : "object-cover"

  return (
    <video
      ref={videoRef}
      aria-label={alt}
      className={cn("absolute inset-0 h-full w-full", objectFitClass)}
      loop
      muted
      playsInline
      preload="metadata"
      src={src}
    />
  )
}

function ServiceMediaCell({ image }: { image: ServiceMediaItem }) {
  const isChart = isChartItem(image)
  const isVideo = isVideoItem(image)
  const prefersReducedMotion = useReducedMotion()
  const activateOnView = (isChart || isVideo) && !prefersReducedMotion
  const { containerRef, isInView } = useInView<HTMLDivElement>({
    enabled: activateOnView,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!isVideo || !activateOnView) {
      return
    }

    const video = videoRef.current

    if (!video) {
      return
    }

    if (isInView) {
      void video.play().catch(() => {})
      return
    }

    video.pause()
    video.currentTime = 0
  }, [activateOnView, isInView, isVideo])

  const colSpan = image.colSpan ?? 1
  const rowSpan = image.rowSpan ?? 1
  const fit = isChartItem(image)
    ? "cover"
    : isVideoItem(image)
      ? (image.fit ?? "cover")
      : (image.fit ?? "cover")
  const imageSizes =
    isChartItem(image) || isVideoItem(image)
      ? undefined
      : getImageSizes(colSpan, rowSpan)
  const isSvg =
    isChartItem(image) || isVideoItem(image) ? false : image.src.endsWith(".svg")
  const useUnoptimized =
    !isChartItem(image) &&
    !isVideoItem(image) &&
    (isSvg || image.unoptimized === true)
  const objectFitClass =
    fit === "contain" ? "object-contain object-center" : "object-cover"

  return (
    <div
      ref={activateOnView ? containerRef : undefined}
      className={cn(
        "service-image-frame relative min-h-0 min-w-0 overflow-hidden rounded-lg",
        !isChartItem(image) &&
          !isVideoItem(image) &&
          getCellBackgroundClass(image, fit),
        COL_SPAN_CLASS[colSpan],
        ROW_SPAN_CLASS[rowSpan],
        image.colStart !== undefined && COL_START_CLASS[image.colStart],
        image.rowStart !== undefined && ROW_START_CLASS[image.rowStart]
      )}
    >
      {isChartItem(image) ? (
        <SeoGrowthChart alt={image.alt} animate={isInView} />
      ) : isVideoItem(image) ? (
        <ServiceBentoVideo
          alt={image.alt}
          fit={fit}
          src={image.src}
          videoRef={videoRef}
        />
      ) : (
        <Image
          alt={image.alt}
          className={objectFitClass}
          fill
          quality={image.quality ?? 90}
          sizes={imageSizes}
          src={image.src}
          unoptimized={useUnoptimized}
        />
      )}
    </div>
  )
}

function ServiceMediaPlaceholder({
  colSpan,
  label,
  rowSpan,
}: {
  colSpan: 1 | 2 | 3
  label: string
  rowSpan: 1 | 2
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 items-center justify-center rounded-lg border border-[var(--echo-border)] bg-[var(--echo-surface-1)]/45",
        COL_SPAN_CLASS[colSpan],
        ROW_SPAN_CLASS[rowSpan]
      )}
    >
      <span className="font-heading text-3xl font-bold text-[var(--echo-title-1)] md:text-4xl">
        {label}
      </span>
    </div>
  )
}

export function ServiceMediaBento({
  images,
  isInView,
  placeholder,
}: ServiceMediaBentoProps) {
  if (images.length === 0) {
    return (
      <ServiceMediaBentoGrid isInView={isInView}>
        <ServiceMediaPlaceholder
          colSpan={3}
          label={placeholder ?? "00"}
          rowSpan={2}
        />
      </ServiceMediaBentoGrid>
    )
  }

  return (
    <ServiceMediaBentoGrid isInView={isInView}>
      {images.map((image, index) => {
        const defaults = getDefaultPlacement(images.length, index)
        const itemKey =
          isChartItem(image) || isVideoItem(image)
            ? `${image.kind}-${index}`
            : `${image.src}-${index}`

        return (
          <ServiceMediaCell
            key={itemKey}
            image={{
              ...image,
              colSpan: image.colSpan ?? defaults.colSpan,
              rowSpan: image.rowSpan ?? defaults.rowSpan,
            }}
          />
        )
      })}
    </ServiceMediaBentoGrid>
  )
}
