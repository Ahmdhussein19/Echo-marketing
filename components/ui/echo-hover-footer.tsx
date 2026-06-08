"use client"

import { useRef } from "react"
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import Image from "next/image"

import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer"
import { useInView } from "@/hooks/use-in-view"

import "./echo-hover-footer.css"

interface FooterLinkItem {
  href: string
  label: string
}

interface FooterLinkSection {
  links: FooterLinkItem[]
  title: string
}

const FOOTER_LINK_SECTIONS: readonly FooterLinkSection[] = [
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "#about" },
      { label: "Why Echo", href: "#about" },
      { label: "Our Process", href: "#how-we-work" },
      { label: "Careers", href: "#contact" },
    ],
  },
  {
    title: "Helpful Links",
    links: [
      { label: "Services", href: "#progress-track" },
      { label: "Case Studies", href: "#progress-track" },
      {
        label: "Live Chat",
        href: "#contact",
      },
    ],
  },
] as const

const CONTACT_INFO: readonly {
  icon: typeof Mail
  href?: string
  text: string
}[] = [
  {
    icon: Mail,
    text: "contact@echo.etriplesoft.com",
    href: "mailto:contact@echo.etriplesoft.com",
  },
  {
    icon: Phone,
    text: "+20 103 733 9471",
    href: "tel:+201037339471",
  },
  {
    icon: MapPin,
    text: "Cairo, Egypt",
  },
] as const

const SOCIAL_LINKS = [
  { image: "/images/Linkedin_footer.svg", label: "LinkedIn", href: "https://www.linkedin.com/in/echo-marketing-245121401/", icon: undefined },
  { image: "/images/Facebook_white_icon_svg.svg", label: "Facebook", href: "https://www.facebook.com/share/18T9VhboV2/?mibextid=wwXIfr", icon: undefined },
  { image: "/images/Instagram_white.svg", label: "Instagram", href: "https://www.instagram.com/echomarkting64", icon: undefined },
  { image: "/images/Iconoir_tiktok_white.svg", label: "TikTok", href: "https://www.facebook.com/share/18T9VhboV2/?mibextid=wwXIfr", icon: undefined },
] as const

const COPYRIGHT_YEAR = 2026

export function EchoHoverFooter() {
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const { isInView: isWordmarkInView } = useInView<HTMLDivElement>({
    ref: wordmarkRef,
    resetOnLeave: true,
    threshold: 0.05,
  })

  return (
    <section className="bg-[var(--echo-bg)]">
      <footer className="echo-hover-footer bg-[rgba(10,10,10,0.1)]">
      <div className="echo-hover-footer-inner">
        <div className="echo-hover-footer-grid">
          <div className="echo-hover-footer-brand">
            <div className="flex items-center">
              <Image
                src="/Echo.svg"
                alt="Echo"
                width={120}
                height={40}
                className="h-8 w-auto md:h-10"
              />
            </div>
            <p className="font-sans text-sm leading-relaxed text-[var(--echo-text-2)]">
              Echo is a digital marketing agency crafting bold brands and high-impact experiences
              that get results.
            </p>
          </div>

          {FOOTER_LINK_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="echo-hover-footer-column-title font-heading text-lg font-semibold text-[var(--echo-text-1)]">
                {section.title}
              </h4>
              <ul className="echo-hover-footer-link-list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm text-[var(--echo-text-2)] transition-colors duration-150 hover:text-[var(--echo-orange)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="echo-hover-footer-column-title font-heading text-lg font-semibold text-[var(--echo-text-1)]">
              Contact Us
            </h4>
            <ul className="echo-hover-footer-contact-list">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon

                return (
                  <li key={item.text} className="flex items-center gap-2">
                    <Icon aria-hidden className="size-[18px] shrink-0 text-[var(--echo-orange)]" />
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-sans text-sm text-[var(--echo-text-2)] transition-colors duration-150 hover:text-[var(--echo-orange)]"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="font-sans text-sm text-[var(--echo-text-2)]">
                        {item.text}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <hr className="echo-hover-footer-divider" />

        <div className="echo-hover-footer-bottom">
          <div className="echo-hover-footer-social">
            {SOCIAL_LINKS.map(({ image, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="transition-colors duration-150 hover:text-[var(--echo-orange)]"
              >
                <Image
                  src={image}
                  alt={label}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </a>
            ))}
          </div>

          <p className="text-center font-sans text-sm text-[var(--echo-text-3)] md:text-left">
            &copy; {COPYRIGHT_YEAR} Echo. All rights reserved.
          </p>
        </div>
      </div>

      <div ref={wordmarkRef} className="echo-hover-footer-wordmark">
        <TextHoverEffect
          text="Echo"
          className="z-50 w-full"
          isActive={isWordmarkInView}
        />
      </div>

      <FooterBackgroundGradient />
      </footer>
    </section>
  )
}
