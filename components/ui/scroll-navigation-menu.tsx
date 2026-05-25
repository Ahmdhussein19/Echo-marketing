"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion"
import { Menu, Home, User, Settings, Mail, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useIsMounted } from "@/hooks/use-is-mounted"
import { cn } from "@/lib/utils"
import type { KineticNavMenuItem } from "@/components/ui/sterling-gate-kinetic-navigation"

const SterlingGateKineticMenuOverlay = dynamic(
  () =>
    import("@/components/ui/sterling-gate-kinetic-navigation").then(
      (module) => module.SterlingGateKineticMenuOverlay,
    ),
  { ssr: false },
)

export interface ScrollNavMenuItem {
  id: number
  title: string
  url: string
  icon: React.ReactNode
}

export interface ScrollNavigationMenuProps {
  menuItems?: ScrollNavMenuItem[]
  className?: string
  logoLabel?: string
  children?: React.ReactNode
}

const defaultMenuItems: ScrollNavMenuItem[] = [
  {
    id: 1,
    title: "Home",
    url: "#top",
    icon: <Home className="size-5" />,
  },
  {
    id: 2,
    title: "About",
    url: "#about",
    icon: <User className="size-5" />,
  },
  {
    id: 3,
    title: "Services",
    url: "#services",
    icon: <Settings className="size-5" />,
  },
  {
    id: 4,
    title: "Contact",
    url: "#contact",
    icon: <Mail className="size-5" />,
  },
  {
    id: 5,
    title: "Info",
    url: "#info",
    icon: <Info className="size-5" />,
  },
]

const shapeByIndex = ["1", "2", "3", "4", "5"] as const

function toKineticMenuItems(items: ScrollNavMenuItem[]): KineticNavMenuItem[] {
  return items.map((item, index) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    shape: shapeByIndex[index % shapeByIndex.length] ?? "1",
    fade: index === 3,
  }))
}

export function ScrollNavigationMenu({
  menuItems = defaultMenuItems,
  className,
  logoLabel = "Logo",
  children,
}: ScrollNavigationMenuProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuOverlayMounted, setMenuOverlayMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const isMounted = useIsMounted()
  const { scrollY } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100)
  })

  useEffect(() => {
    if (!isMounted) return
    setIsScrolled(window.scrollY > 100)
  }, [isMounted])

  const scrollToHash = React.useCallback(
    (hash: string) => {
      if (typeof window === "undefined" || !hash.startsWith("#")) return false

      const target = document.querySelector(hash) as HTMLElement | null
      if (!target) return false

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      })

      if (window.history.replaceState) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        )
      }

      return true
    },
    [prefersReducedMotion],
  )

  const handleNavLinkClick = React.useCallback(
    (url: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!url.startsWith("#")) return false

      event.preventDefault()
      return scrollToHash(url)
    },
    [scrollToHash],
  )

  useEffect(() => {
    if (isMenuOpen) {
      setMenuOverlayMounted(true)
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setMenuOverlayMounted(true)
    setIsMenuOpen((open) => !open)
  }
  const closeMenu = () => setIsMenuOpen(false)
  const scrollToContact = React.useCallback(() => {
    scrollToHash("#contact")
  }, [scrollToHash])
  const kineticMenuItems = toKineticMenuItems(menuItems)
  const showFloatingMenu = isMounted && isScrolled

  return (
    <>
      <motion.nav
        initial={false}
        animate={
          isMounted
            ? {
                y: isScrolled ? -100 : 0,
                opacity: isScrolled ? 0 : 1,
              }
            : false
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 right-0 left-0 z-50",
          className,
        )}
        aria-label="Main navigation"
        suppressHydrationWarning
      >
        <motion.div className="px-4 md:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between md:h-16">
            <motion.div
              className="shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center">
                <Image
                  src="/Echo.svg"
                  alt="Echo"
                  width={120}
                  height={40}
                  className="h-8 w-auto md:h-10"
                  priority
                />
              </Link>
            </motion.div>

            <motion.div className="hidden md:block">
              <div className="ml-10 flex items-baseline gap-1">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                      onClick={(event) => {
                        const handled = handleNavLinkClick(item.url, event)
                        if (handled) closeMenu()
                      }}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                    {hoveredItem === item.id && (
                      <motion.div
                        layoutId="navbar-hover"
                        className="absolute inset-0 -z-10 rounded-md bg-muted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="md:hidden">
              <motion.button
                type="button"
                onClick={toggleMenu}
                className="rounded-md p-2 text-foreground hover:text-primary focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-expanded={isMenuOpen}
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.nav>

      <motion.div
        initial={false}
        animate={
          isMounted
            ? {
                scale: isScrolled ? 1 : 0,
                opacity: isScrolled ? 1 : 0,
              }
            : false
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-6 right-4 z-50 origin-center md:right-6 lg:right-8",
          !showFloatingMenu && "pointer-events-none scale-0 opacity-0",
        )}
        aria-hidden={!showFloatingMenu}
      >
        <div className="group mx-0 flex items-center gap-0">
          <button
            type="button"
            onClick={scrollToContact}
            tabIndex={showFloatingMenu ? 0 : -1}
            className="flex h-12 items-center whitespace-nowrap rounded-full bg-[var(--echo-orange)] px-6 text-[#0A0A0A] duration-500 ease-in-out group-hover:bg-white group-hover:text-[#0A0A0A] group-hover:transition-colors"
            aria-label="Scroll to contact section"
          >
            Let&apos;s Talk
          </button>
          <motion.button
            type="button"
            onClick={toggleMenu}
            tabIndex={showFloatingMenu ? 0 : -1}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--echo-orange)] text-[#0A0A0A] duration-500 ease-in-out group-hover:bg-white group-hover:text-[#0A0A0A] group-hover:transition-colors"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            aria-expanded={isMenuOpen}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </motion.button>
        </div>
      </motion.div>

      {menuOverlayMounted ? (
        <SterlingGateKineticMenuOverlay
          menuItems={kineticMenuItems}
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onNavigateLink={handleNavLinkClick}
        />
      ) : null}

      <motion.div>{children}</motion.div>
    </>
  )
}

/** @deprecated Use `ScrollNavigationMenu` — kept for 21st.dev demo imports */
export const Component = ScrollNavigationMenu
