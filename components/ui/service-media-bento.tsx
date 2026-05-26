"use client"

import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, type RefObject } from "react"
import { useInView } from "@/hooks/use-in-view"
import {
  serviceEntranceTransition,
  serviceEntranceVariants,
} from "@/lib/service-entrance-motion"
import { cn } from "@/lib/utils"

const SeoGrowthChart = dynamic(
  () =>
    import("@/components/ui/seo-growth-chart").then((module) => module.SeoGrowthChart),
  {
    loading: () => (
      <div
        aria-hidden
        className="h-full min-h-0 w-full bg-[#030303]"
      />
    ),
    ssr: false,
  },
)

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

function isChartItem(image: ServiceMediaItem): image is ServiceMediaChart {
  return "kind" in image && image.kind === "seo-chart"
}

function isVideoItem(image: ServiceMediaItem): image is ServiceMediaVideo {
  return "kind" in image && image.kind === "video"
}

function ServiceBentoVideo({
  alt,
  fit,
  isInView,
  src,
  videoRef,
}: {
  alt: string
  fit: "contain" | "cover"
  isInView: boolean
  src: string
  videoRef: RefObject<HTMLVideoElement | null>
}) {
  const objectFitClass =
    fit === "contain" ? "object-contain object-center" : "object-cover"
  const lockPlaybackRate = () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.defaultPlaybackRate = 1
    video.playbackRate = 1
  }

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.defaultMuted = true
    video.muted = true
    video.playsInline = true
    video.defaultPlaybackRate = 1
    video.playbackRate = 1

    if (isInView) {
      void video.play().catch(() => {})
      return
    }

    video.pause()
  }, [isInView, videoRef])

  return (
    <video
      ref={videoRef}
      aria-label={alt}
      className={cn("absolute inset-0 h-full w-full", objectFitClass)}
      loop
      muted
      onCanPlay={lockPlaybackRate}
      onLoadedMetadata={lockPlaybackRate}
      onRateChange={lockPlaybackRate}
      playsInline
      preload="none"
      src={isInView ? src : undefined}
    />
  )
}

function ServiceMediaCell({
  image,
  isRowInView = false,
}: {
  image: ServiceMediaItem
  isRowInView?: boolean
}) {
  const isChart = isChartItem(image)
  const isVideo = isVideoItem(image)
  const prefersReducedMotion = useReducedMotion()
  const activateOnView = isChart && !prefersReducedMotion
  const activateVideoOnView = isVideo
  const { containerRef, isInView: isCellInView } = useInView<HTMLDivElement>({
    enabled: activateOnView || activateVideoOnView,
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const shouldPlayVideo = isVideo && (isRowInView || isCellInView)

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
      ref={activateOnView || activateVideoOnView ? containerRef : undefined}
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
        <SeoGrowthChart alt={image.alt} animate={isCellInView} />
      ) : isVideoItem(image) ? (
        <ServiceBentoVideo
          alt={image.alt}
          fit={fit}
          isInView={shouldPlayVideo}
          src={image.src}
          videoRef={videoRef}
        />
      ) : (
        <Image
          alt={image.alt}
          className={objectFitClass}
          fill
          quality={image.quality ?? 80}
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
            isRowInView={isInView ?? false}
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
