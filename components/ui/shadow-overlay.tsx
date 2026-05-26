"use client"

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
} from "framer-motion"

import { useIsMounted } from "@/hooks/use-is-mounted"

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
  isActive?: boolean
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
  const cleanId = id.replace(/:/g, "")
  return `shadowoverlay-${cleanId}`
}

export function ShadowOverlay({
  sizing = "fill",
  color = "rgba(128, 128, 128, 1)",
  animation,
  isActive = true,
  noise,
  style,
  className,
  children,
}: ShadowOverlayProps) {
  const isMounted = useIsMounted()
  const id = useInstanceId()
  const animationEnabled =
    isMounted && isActive && animation !== undefined && animation.scale > 0
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null)
  const hueRotateMotionValue = useMotionValue(180)
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null)

  const displacementScale =
    animation && animationEnabled
      ? mapRange(animation.scale, 1, 100, 20, 100)
      : 0
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      hueRotateAnimation.current?.stop()
      hueRotateMotionValue.set(0)
      let lastUpdate = 0
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        ease: "linear",
        delay: 0,
        onUpdate: (value: number) => {
          const now = performance.now()
          if (now - lastUpdate < 33) return
          lastUpdate = now
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute("values", String(value))
          }
        },
      })

      return () => {
        hueRotateAnimation.current?.stop()
      }
    }

    hueRotateAnimation.current?.stop()
    return undefined
  }, [animationEnabled, animationDuration, hueRotateMotionValue])

  return (
    <div
      className={className}
      suppressHydrationWarning
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        willChange: animationEnabled ? "transform" : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${-displacementScale}px`,
          right: `${-displacementScale}px`,
          bottom: `${-displacementScale}px`,
          left: `${-displacementScale}px`,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : "none",
          transform: "translateZ(0)",
          willChange: animationEnabled ? "filter" : undefined,
        }}
        suppressHydrationWarning
      >
        {animationEnabled && animation ? (
          <svg style={{ position: "absolute", width: 0, height: 0, overflow: "visible" }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
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
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        ) : null}
        <div
          style={{
            backgroundColor: color,
            WebkitMaskImage: `url('${SHADOW_MASK_URL}')`,
            maskImage: `url('${SHADOW_MASK_URL}')`,
            WebkitMaskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {children ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {children}
        </div>
      ) : null}

      {noise && noise.opacity > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${NOISE_TEXTURE_URL}")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
          }}
        />
      ) : null}
    </div>
  )
}
