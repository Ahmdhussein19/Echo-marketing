"use client"

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"
import { createPortal } from "react-dom"
import {
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
} from "framer-motion"

import { useIsWebKitBrowser } from "@/hooks/use-is-webkit-browser"

import "./shadow-overlay.css"

interface ResponsiveImage {
  src: string
  alt?: string
  srcSet?: string
}

interface AnimationConfig {
  preview?: boolean
  scale: number
  speed: number
}

interface NoiseConfig {
  opacity: number
  scale: number
}

export interface ShadowOverlayProps {
  type?: "preset" | "custom"
  presetIndex?: number
  customImage?: ResponsiveImage
  sizing?: "fill" | "stretch"
  color?: string
  animation?: AnimationConfig
  noise?: NoiseConfig
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

const SHADOW_MASK_URL = "/images/why-us/shadow-mask.png"
const NOISE_TEXTURE_URL = "/images/why-us/noise-texture.png"

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number,
): number {
  if (fromLow === fromHigh) {
    return toLow
  }

  const percentage = (value - fromLow) / (fromHigh - fromLow)
  return toLow + percentage * (toHigh - toLow)
}

function useInstanceId(): string {
  const id = useId()
  return `shadowoverlay-${id.replace(/:/g, "")}`
}

interface ShadowOverlayFilterProps {
  animation?: AnimationConfig
  animationEnabled: boolean
  displacementScale: number
  feColorMatrixRef: RefObject<SVGFEColorMatrixElement | null>
  filterId: string
  maskId: string
}

function ShadowOverlayFilterDefs({
  animation,
  animationEnabled,
  displacementScale,
  feColorMatrixRef,
  filterId,
  maskId,
}: ShadowOverlayFilterProps) {
  if (typeof document === "undefined") {
    return null
  }

  return createPortal(
    <svg
      aria-hidden
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask
          id={maskId}
          maskContentUnits="objectBoundingBox"
          maskUnits="objectBoundingBox"
        >
          <image
            height="1"
            href={SHADOW_MASK_URL}
            preserveAspectRatio="xMidYMid slice"
            width="1"
            x="0"
            y="0"
          />
        </mask>

        {animationEnabled && animation ? (
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="objectBoundingBox"
            height="200%"
            id={filterId}
            width="200%"
            x="-50%"
            y="-50%"
          >
            <feTurbulence
              baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
              numOctaves="2"
              result="undulation"
              seed="0"
              type="turbulence"
            />
            <feColorMatrix
              in="undulation"
              ref={feColorMatrixRef}
              result="undulationHue"
              type="hueRotate"
              values="180"
            />
            <feColorMatrix
              in="dist"
              result="circulation"
              type="matrix"
              values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="circulation"
              result="dist"
              scale={displacementScale}
            />
            <feDisplacementMap
              in="dist"
              in2="undulationHue"
              result="output"
              scale={displacementScale}
            />
            <feGaussianBlur in="output" stdDeviation="4" />
          </filter>
        ) : null}
      </defs>
    </svg>,
    document.body,
  )
}

export function ShadowOverlay({
  sizing = "fill",
  color = "rgba(128, 128, 128, 1)",
  animation,
  noise,
  style,
  className,
  children,
}: ShadowOverlayProps) {
  const filterId = useInstanceId()
  const maskId = `${filterId}-mask`
  const isWebKitBrowser = useIsWebKitBrowser()
  const rootRef = useRef<HTMLDivElement>(null)
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null)
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null)
  const hueRotateMotionValue = useMotionValue(180)
  const [isInView, setIsInView] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const animationEnabled = animation !== undefined && animation.scale > 0
  const shouldAnimate = animationEnabled && isInView
  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1
  const maskSizingClass =
    sizing === "stretch" ? "shadow-overlay-mask--stretch" : "shadow-overlay-mask--fill"
  const filterValue = shouldAnimate ? `url(#${filterId})` : "none"
  const insetValue = shouldAnimate ? -displacementScale : 0

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const rootElement = rootRef.current
    if (!rootElement) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting)
        }
      },
      { threshold: 0.05 },
    )

    observer.observe(rootElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (feColorMatrixRef.current && shouldAnimate) {
      hueRotateAnimation.current?.stop()
      hueRotateMotionValue.set(0)
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        ease: "linear",
        delay: 0,
        onUpdate: (value: number) => {
          feColorMatrixRef.current?.setAttribute("values", String(value))
        },
      })

      return () => {
        hueRotateAnimation.current?.stop()
      }
    }

    hueRotateAnimation.current?.stop()
    return undefined
  }, [animationDuration, hueRotateMotionValue, shouldAnimate])

  const maskStyle = {
    backgroundColor: color,
    WebkitMaskImage: `url('${SHADOW_MASK_URL}')`,
    maskImage: `url('${SHADOW_MASK_URL}')`,
  } satisfies CSSProperties

  const renderShadowLayer = () => {
    if (isMounted && isWebKitBrowser && shouldAnimate) {
      return (
        <svg
          aria-hidden
          className="shadow-overlay-safari-svg"
          preserveAspectRatio="xMidYMid slice"
          style={{
            inset: insetValue,
            height: `calc(100% + ${Math.abs(insetValue) * 2}px)`,
            width: `calc(100% + ${Math.abs(insetValue) * 2}px)`,
          }}
          viewBox="0 0 100 100"
        >
          <rect
            fill={color}
            filter={`url(#${filterId})`}
            height="100"
            mask={`url(#${maskId})`}
            width="100"
            x="0"
            y="0"
          />
        </svg>
      )
    }

    return (
      <div
        className="shadow-overlay-filtered"
        style={{
          inset: insetValue,
          WebkitFilter: filterValue,
          filter: filterValue,
        }}
      >
        <div
          className={`shadow-overlay-mask ${maskSizingClass}`}
          style={maskStyle}
        />
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className={className ? `shadow-overlay-root ${className}` : "shadow-overlay-root"}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {isMounted ? (
        <ShadowOverlayFilterDefs
          animation={animation}
          animationEnabled={animationEnabled}
          displacementScale={displacementScale}
          feColorMatrixRef={feColorMatrixRef}
          filterId={filterId}
          maskId={maskId}
        />
      ) : null}

      {renderShadowLayer()}

      {children ? <div className="shadow-overlay-children">{children}</div> : null}

      {noise && noise.opacity > 0 ? (
        <div
          aria-hidden
          className="shadow-overlay-noise"
          style={{
            backgroundImage: `url("${NOISE_TEXTURE_URL}")`,
            backgroundSize: noise.scale * 200,
            opacity: noise.opacity / 2,
          }}
        />
      ) : null}
    </div>
  )
}
