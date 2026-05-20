"use client"

import Image from "next/image"
import Link from "next/link"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase)
}

export interface KineticNavMenuItem {
  id: number
  title: string
  url: string
  shape: string
  fade?: boolean
}

export interface SterlingGateKineticNavigationProps {
  menuItems?: KineticNavMenuItem[]
  logoLabel?: string
  logoHref?: string
  children?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showHeader?: boolean
  showOverlayOnly?: boolean
  onNavigateLink?: (url: string, event: MouseEvent<HTMLAnchorElement>) => void
}

const defaultMenuItems: KineticNavMenuItem[] = [
  { id: 1, title: "About us", url: "#about", shape: "1" },
  { id: 2, title: "Our work", url: "#services", shape: "2" },
  { id: 3, title: "Services", url: "#services", shape: "3" },
  { id: 4, title: "Blog", url: "#info", shape: "4", fade: true },
  { id: 5, title: "Contact us", url: "#contact", shape: "5" },
]

type MenuListItemElement = HTMLElement & {
  _cleanup?: () => void
}

function useKineticNavEffects(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isMenuOpen: boolean,
) {
  const hasInitializedRef = useRef(false)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99")
        gsap.defaults({ ease: "main", duration: 0.7 })
      }
    } catch {
      gsap.defaults({ ease: "power2.out", duration: 0.7 })
    }

    const ctx = gsap.context(() => {
      const arrowLine = container.querySelector(".arrow-line")
      if (arrowLine) {
        const pathLength = (arrowLine as SVGPathElement).getTotalLength()
        gsap.set(arrowLine, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })
        const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
        arrowTl
          .to(arrowLine, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.out",
          })
          .to({}, { duration: 1.2 })
          .to(arrowLine, {
            strokeDashoffset: -pathLength,
            duration: 0.6,
            ease: "power2.in",
          })
          .set(arrowLine, { strokeDashoffset: pathLength })
      }

      const menuItems = container.querySelectorAll(".menu-list-item[data-shape]")
      const shapesContainer = container.querySelector(".ambient-background-shapes")

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape")
        const shape = shapesContainer
          ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`)
          : null

        if (!shape) return

        const shapeEls = shape.querySelectorAll(".shape-element")

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer
              .querySelectorAll(".bg-shape")
              .forEach((s) => s.classList.remove("active"))
          }
          shape.classList.add("active")

          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            },
          )
        }

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          })
        }

        item.addEventListener("mouseenter", onEnter)
        item.addEventListener("mouseleave", onLeave)

        ;(item as MenuListItemElement)._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter)
          item.removeEventListener("mouseleave", onLeave)
        }
      })
    }, container)

    return () => {
      ctx.revert()
      const items = container.querySelectorAll(".menu-list-item[data-shape]")
      items.forEach((item) => {
        const menuItem = item as MenuListItemElement
        menuItem._cleanup?.()
      })
    }
  }, [containerRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const navWrap = container.querySelector(".nav-overlay-wrapper")
      const menu = container.querySelector(".menu-content")
      const overlay = container.querySelector(".overlay")
      const bgPanels = container.querySelectorAll(".backdrop-layer")
      const menuLinks = container.querySelectorAll(".nav-link")

      if (!navWrap || !menu || !overlay) return

      gsap.set(navWrap, { display: "none" })
      gsap.set(menu, { xPercent: 120 })
      gsap.set(overlay, { autoAlpha: 0 })
      gsap.set(bgPanels, { xPercent: 101 })
      gsap.set(menuLinks, { yPercent: 140, rotate: 10 })
    }, container)

    return () => ctx.revert()
  }, [containerRef])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const navWrap = container.querySelector(".nav-overlay-wrapper")
    const menu = container.querySelector(".menu-content")
    const overlay = container.querySelector(".overlay")
    const bgPanels = container.querySelectorAll(".backdrop-layer")
    const menuLinks = container.querySelectorAll(".nav-link")
    const fadeTargets = container.querySelectorAll("[data-menu-fade]")
    const menuButton = container.querySelector(".nav-close-btn")
    const menuButtonTexts = menuButton?.querySelectorAll("p")
    const menuButtonIcon = menuButton?.querySelector(".menu-button-icon")

    if (!navWrap || !menu || !overlay) return

    const tl = gsap.timeline()

    if (isMenuOpen) {
      hasInitializedRef.current = true
      navWrap.setAttribute("data-nav", "open")
      gsap.set(navWrap, { display: "block" })

      tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0)
        .fromTo(
          menu,
          { xPercent: 120 },
          { xPercent: 0, duration: 0.575, ease: "main" },
          0,
        )
        .fromTo(
          bgPanels,
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: 0.575, ease: "main" },
          0,
        )

      if (menuButtonTexts?.length) {
        tl.fromTo(
          menuButtonTexts,
          { yPercent: 0 },
          { yPercent: -100, stagger: 0.2, duration: 0.4 },
          0,
        )
      }

      if (menuButtonIcon) {
        tl.fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.4 }, 0)
      }

      tl.fromTo(
        menuLinks,
        { yPercent: 140, rotate: 10 },
        { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.7, ease: "main" },
        0.35,
      )

      if (fadeTargets.length) {
        tl.fromTo(
          fadeTargets,
          { autoAlpha: 0, yPercent: 50 },
          {
            autoAlpha: 1,
            yPercent: 0,
            stagger: 0.04,
            duration: 0.5,
            clearProps: "all",
          },
          0.55,
        )
      }
    } else {
      navWrap.setAttribute("data-nav", "closed")

      if (!hasInitializedRef.current) {
        gsap.set(navWrap, { display: "none" })
        return () => {
          tl.kill()
        }
      }

      tl.to(overlay, { autoAlpha: 0, duration: 0.3 }, 0)
        .to(menu, { xPercent: 120, duration: 0.4, ease: "main" }, 0)
        .to(
          bgPanels,
          { xPercent: 101, duration: 0.3, stagger: 0.08, ease: "main" },
          0,
        )

      if (menuButtonTexts?.length) {
        tl.to(menuButtonTexts, { yPercent: 0, duration: 0.3 }, 0)
      }

      if (menuButtonIcon) {
        tl.to(menuButtonIcon, { rotate: 0, duration: 0.3 }, 0)
      }

      tl.to(menuLinks, { yPercent: 140, rotate: 10, duration: 0.25, stagger: 0.03 }, 0)
        .set(navWrap, { display: "none" })
    }

    return () => {
      tl.kill()
    }
  }, [containerRef, isMenuOpen])
}

function KineticMenuOverlay({
  menuItems,
  isMenuOpen,
  closeMenu,
  onNavigateLink,
}: {
  menuItems: KineticNavMenuItem[]
  isMenuOpen: boolean
  closeMenu: () => void
  onNavigateLink?: (url: string, event: MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <section className="fullscreen-menu-container" aria-hidden={!isMenuOpen}>
      <div data-nav="closed" className="nav-overlay-wrapper">
        <button
          type="button"
          className="overlay"
          onClick={closeMenu}
          aria-label="Close menu"
        />
        <nav className="menu-content" aria-label="Fullscreen navigation">
          <div className="menu-bg">
            <div className="backdrop-layer first" />
            <div className="backdrop-layer second" />
            <div className="backdrop-layer" />

            <div className="ambient-background-shapes">
              <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                <circle
                  className="shape-element"
                  cx="80"
                  cy="120"
                  r="40"
                  fill="rgba(234,120,50,0.15)"
                />
                <circle
                  className="shape-element"
                  cx="300"
                  cy="80"
                  r="60"
                  fill="rgba(255,150,70,0.12)"
                />
                <circle
                  className="shape-element"
                  cx="200"
                  cy="300"
                  r="80"
                  fill="rgba(200,90,40,0.1)"
                />
                <circle
                  className="shape-element"
                  cx="350"
                  cy="280"
                  r="30"
                  fill="rgba(234,120,50,0.15)"
                />
              </svg>

              <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                <path
                  className="shape-element"
                  d="M0 200 Q100 100, 200 200 T 400 200"
                  stroke="rgba(234,120,50,0.2)"
                  strokeWidth="60"
                  fill="none"
                />
                <path
                  className="shape-element"
                  d="M0 280 Q100 180, 200 280 T 400 280"
                  stroke="rgba(255,150,70,0.15)"
                  strokeWidth="40"
                  fill="none"
                />
              </svg>

              <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(234,120,50,0.3)" />
                <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(255,150,70,0.3)" />
                <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(200,90,40,0.3)" />
                <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(234,120,50,0.3)" />
                <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(255,150,70,0.25)" />
                <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(200,90,40,0.25)" />
                <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(234,120,50,0.25)" />
                <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(200,90,40,0.3)" />
                <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(234,120,50,0.3)" />
                <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(255,150,70,0.3)" />
                <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(200,90,40,0.3)" />
                <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(234,120,50,0.3)" />
                <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(255,150,70,0.3)" />
                <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(200,90,40,0.3)" />
              </svg>

              <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                <path
                  className="shape-element"
                  d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                  fill="rgba(234,120,50,0.12)"
                />
                <path
                  className="shape-element"
                  d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                  fill="rgba(200,90,40,0.1)"
                />
              </svg>

              <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                <line
                  className="shape-element"
                  x1="0"
                  y1="100"
                  x2="300"
                  y2="400"
                  stroke="rgba(234,120,50,0.15)"
                  strokeWidth="30"
                />
                <line
                  className="shape-element"
                  x1="100"
                  y1="0"
                  x2="400"
                  y2="300"
                  stroke="rgba(255,150,70,0.12)"
                  strokeWidth="25"
                />
                <line
                  className="shape-element"
                  x1="200"
                  y1="0"
                  x2="400"
                  y2="200"
                  stroke="rgba(200,90,40,0.1)"
                  strokeWidth="20"
                />
              </svg>
            </div>
          </div>

          <div className="menu-content-wrapper">
            <ul className="menu-list">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="menu-list-item"
                  data-shape={item.shape}
                >
                  <Link
                    href={item.url}
                    className="nav-link"
                    onClick={(event) => {
                      onNavigateLink?.(item.url, event)
                      closeMenu()
                    }}
                  >
                    <p
                      className="nav-link-text"
                      {...(item.fade ? { "data-menu-fade": true } : {})}
                    >
                      {item.title}
                    </p>
                    <div className="nav-link-hover-bg" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </section>
  )
}

export function SterlingGateKineticNavigation({
  menuItems = defaultMenuItems,
  logoLabel = "Echo",
  logoHref = "/",
  children,
  isOpen: controlledOpen,
  onOpenChange,
  showHeader = true,
  showOverlayOnly = false,
  onNavigateLink,
}: SterlingGateKineticNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const isMenuOpen = isControlled ? controlledOpen : internalOpen

  const setMenuOpen = (open: boolean) => {
    if (!isControlled) setInternalOpen(open)
    onOpenChange?.(open)
  }

  const toggleMenu = () => setMenuOpen(!isMenuOpen)
  const closeMenu = () => setMenuOpen(false)

  useKineticNavEffects(containerRef, isMenuOpen)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) closeMenu()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <div ref={containerRef} className="kinetic-nav-root">
      {showHeader && !showOverlayOnly && (
        <div className="site-header-wrapper">
          <header className="kinetic-header">
            <div className="kinetic-container is--full">
              <nav className="nav-row">
                <Link href={logoHref} aria-label="Home" className="nav-logo-row">
                  <Image
                    src="/Echo.svg"
                    alt={logoLabel}
                    width={96}
                    height={36}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
                <div className="nav-row__right">
                  <button
                    type="button"
                    className="nav-close-btn"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  >
                    <div className="menu-button-text">
                      <p className="p-large">Menu</p>
                      <p className="p-large">Close</p>
                    </div>
                    <div className="icon-wrap">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="menu-button-icon"
                        aria-hidden
                      >
                        <path
                          d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                          fill="currentColor"
                        />
                        <path
                          d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                          fill="currentColor"
                        />
                        <path
                          d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                          fill="currentColor"
                        />
                        <path
                          d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                          fill="currentColor"
                        />
                        <path
                          d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                          fill="currentColor"
                        />
                        <path
                          d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </header>
        </div>
      )}

      <KineticMenuOverlay
        menuItems={menuItems}
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        onNavigateLink={onNavigateLink}
      />

      {children}
    </div>
  )
}

/** Overlay-only export for use with existing nav bars */
export function SterlingGateKineticMenuOverlay({
  menuItems = defaultMenuItems,
  isOpen,
  onClose,
  onNavigateLink,
}: {
  menuItems?: KineticNavMenuItem[]
  isOpen: boolean
  onClose: () => void
  onNavigateLink?: (url: string, event: MouseEvent<HTMLAnchorElement>) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useKineticNavEffects(containerRef, isOpen)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="kinetic-nav-root">
      <KineticMenuOverlay
        menuItems={menuItems}
        isMenuOpen={isOpen}
        closeMenu={onClose}
        onNavigateLink={onNavigateLink}
      />
    </div>
  )
}

/** @deprecated Use `SterlingGateKineticNavigation` — kept for 21st.dev demo imports */
export const Component = SterlingGateKineticNavigation
