import { EchoContactFormCard } from "@/components/ui/echo-contact-form"

import "./echo-contact-section.css"

const CONTACT_EMAIL = "contact@echo.etriplesoft.com"
const CONTACT_PHONE = "+20 103 733 9471"

export function EchoContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="echo-contact-headline"
      className="echo-contact-section"
    >
      <div className="echo-contact-grid">
        <div className="flex flex-col">
          <h2 id="echo-contact-headline" className="echo-contact-headline">
            LET&apos;S
            <br />
            TALK.
          </h2>

          <p className="mb-9 max-w-[280px] font-sans text-[15px] leading-relaxed text-[var(--echo-text-2)]">
            A compact brief is enough. Tell us what you need and we&apos;ll guide the creative,
            media, and digital direction.
          </p>

          <div className="echo-contact-divider mb-7" aria-hidden />

          <div className="flex flex-col gap-4">
            <div>
              <p className="echo-contact-meta-label">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="echo-contact-meta-value hover:text-[var(--echo-orange)]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div>
              <p className="echo-contact-meta-label">Response</p>
              <p className="echo-contact-meta-value">1–2 business days</p>
            </div>
            <div>
              <p className="echo-contact-meta-label">Phone</p>
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="echo-contact-meta-value hover:text-[var(--echo-orange)]"
              >
                {CONTACT_PHONE}
              </a>
            </div>

            <div className="mt-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="echo-contact-ghost-btn">
                Email us directly ↗
              </a>
            </div>
          </div>
        </div>

        <EchoContactFormCard />
      </div>
    </section>
  )
}
