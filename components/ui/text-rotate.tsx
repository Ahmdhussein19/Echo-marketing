"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import {
  AnimatePresence,
  motion,
  type AnimatePresenceProps,
  type MotionProps,
  type Transition,
  type Variants,
} from "framer-motion"

import { cn } from "@/lib/utils"

export interface TextRotateProps {
  texts: string[]
  rotationInterval?: number
  initial?: MotionProps["initial"]
  animate?: MotionProps["animate"]
  exit?: MotionProps["exit"]
  animatePresenceMode?: AnimatePresenceProps["mode"]
  animatePresenceInitial?: boolean
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number | "random"
  transition?: Transition
  loop?: boolean
  auto?: boolean
  splitBy?: "words" | "characters" | "lines" | string
  onNext?: (index: number) => void
  mainClassName?: string
  splitLevelClassName?: string
  elementLevelClassName?: string
}

export interface TextRotateRef {
  next: () => void
  previous: () => void
  jumpTo: (index: number) => void
  reset: () => void
}

interface WordObject {
  characters: string[]
  needsSpace: boolean
}

function splitIntoCharacters(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  return Array.from(text)
}

export const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref,
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex] ?? ""
      if (splitBy === "characters") {
        const words = currentText.split(" ")
        return words.map((word, index) => ({
          characters: splitIntoCharacters(word),
          needsSpace: index !== words.length - 1,
        }))
      }
      if (splitBy === "words") {
        return currentText.split(" ").map((word, index, array) => ({
          characters: [word],
          needsSpace: index !== array.length - 1,
        }))
      }
      if (splitBy === "lines") {
        return currentText.split("\n").map((line, index, array) => ({
          characters: [line],
          needsSpace: index !== array.length - 1,
        }))
      }
      return currentText.split(splitBy).map((part, index, array) => ({
        characters: [part],
        needsSpace: index !== array.length - 1,
      }))
    }, [texts, currentTextIndex, splitBy])

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        if (staggerFrom === "first") return index * staggerDuration
        if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration
        if (staggerFrom === "center") {
          const center = Math.floor(totalChars / 2)
          return Math.abs(center - index) * staggerDuration
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * totalChars)
          return Math.abs(randomIndex - index) * staggerDuration
        }
        return Math.abs(staggerFrom - index) * staggerDuration
      },
      [staggerFrom, staggerDuration],
    )

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex)
        onNext?.(newIndex)
      },
      [onNext],
    )

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1

      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex)
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange])

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1

      if (prevIndex !== currentTextIndex) {
        handleIndexChange(prevIndex)
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange])

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1))
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex)
        }
      },
      [texts.length, currentTextIndex, handleIndexChange],
    )

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0)
      }
    }, [currentTextIndex, handleIndexChange])

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset],
    )

    useEffect(() => {
      if (!auto) return
      const intervalId = setInterval(next, rotationInterval)
      return () => clearInterval(intervalId)
    }, [next, rotationInterval, auto])

    const totalChars = (elements as WordObject[]).reduce(
      (sum, word) => sum + word.characters.length,
      0,
    )

    return (
      <motion.span
        className={cn("inline-flex flex-wrap whitespace-pre-wrap", mainClassName)}
        layout
        transition={transition}
        {...props}
      >
        <span className="sr-only">{texts[currentTextIndex]}</span>

        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.span
            key={currentTextIndex}
            className={cn(
              "inline-flex flex-wrap",
              splitBy === "lines" && "w-full flex-col",
            )}
            layout
            aria-hidden="true"
          >
            {(elements as WordObject[]).map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0)

              return (
                <span
                  key={`${currentTextIndex}-${wordIndex}`}
                  className={cn("inline-flex", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={`${wordIndex}-${charIndex}`}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          totalChars,
                        ),
                      }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace ? <span className="whitespace-pre"> </span> : null}
                </span>
              )
            })}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    )
  },
)

TextRotate.displayName = "TextRotate"
