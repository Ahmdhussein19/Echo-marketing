"use client"

import { useState, useTransition, type ReactNode } from "react"

import {
  IcoBldg,
  IcoCheck,
  IcoChevronDown,
  IcoDollar,
  IcoGlobe,
  IcoMail,
  IcoPhone,
  IcoSend,
  IcoUser,
} from "@/components/ui/echo-contact-icons"
import { submitContactForm } from "@/features/contact/actions/submit-contact-form"
import {
  CONTACT_BUDGETS,
  CONTACT_SERVICES,
  type ContactFormInput,
} from "@/features/contact/schemas/contact-form"
import { cn } from "@/lib/utils"

import "./echo-contact-section.css"

const EMPTY_FORM: ContactFormInput = {
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
  budget: "",
  services: [],
  brief: "",
}

interface FieldProps {
  label: string
  placeholder: string
  type?: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  id: string
}

function Field({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
  id,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="echo-contact-label">
        {label}
      </label>
      <div className="echo-contact-input-wrap group">
        <span className="echo-contact-input-icon">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="echo-contact-input"
        />
      </div>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  placeholder: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  id: string
}

function SelectField({
  label,
  placeholder,
  icon,
  value,
  onChange,
  options,
  id,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="echo-contact-label">
        {label}
      </label>
      <div className="echo-contact-input-wrap group">
        <span className="echo-contact-input-icon">{icon}</span>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn("echo-contact-select", !value && "echo-contact-select--placeholder")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-[var(--echo-text-3)]">
          <IcoChevronDown />
        </span>
      </div>
    </div>
  )
}

export function EchoContactFormCard() {
  const [form, setForm] = useState<ContactFormInput>(EMPTY_FORM)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const setField =
    (key: keyof ContactFormInput) =>
    (value: string) => {
      setForm((current) => ({ ...current, [key]: value }))
    }

  const toggleService = (service: string) => {
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(service)) {
        next.delete(service)
      } else {
        next.add(service)
      }
      return next
    })
  }

  const reset = () => {
    setSent(false)
    setError(null)
    setForm(EMPTY_FORM)
    setSelected(new Set())
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await submitContactForm({
        ...form,
        services: Array.from(selected),
      })

      if (result.success) {
        setSent(true)
        return
      }

      setError(result.error)
    })
  }

  return (
    <div className="echo-contact-card">
      <div className="echo-contact-card-accent" aria-hidden />

      <div className="echo-contact-card-inner">
        <div className="mb-2 flex flex-wrap items-baseline gap-2.5">
          <h3 className="font-sans text-[26px] font-semibold tracking-tight text-[var(--echo-text-1)]">
            Contact Us
          </h3>
          <span className="font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-[var(--echo-orange)]">
            GET IN TOUCH
          </span>
        </div>

        <p className="mb-5 font-sans text-[13.5px] leading-relaxed text-[var(--echo-text-2)]">
          Tell us about your brand and goals. We&apos;ll come back with a clear, honest direction.
        </p>

        <div className="echo-contact-divider mb-6" aria-hidden />

        {sent ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div className="echo-contact-success-icon">
              <IcoCheck />
            </div>
            <p className="font-heading text-[34px] font-bold leading-none tracking-tight text-[var(--echo-text-1)]">
              Message sent.
            </p>
            <p className="max-w-[260px] text-center font-sans text-sm leading-relaxed text-[var(--echo-text-2)]">
              We&apos;ll review your brief and reply within 1–2 business days.
            </p>
            <button type="button" onClick={reset} className="echo-contact-ghost-btn mt-2">
              Send another
            </button>
          </div>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  id="contact-name"
                  label="Name"
                  placeholder="Your name"
                  icon={<IcoUser />}
                  value={form.name}
                  onChange={setField("name")}
                />
                <Field
                  id="contact-email"
                  label="Email"
                  placeholder="name@company.com"
                  type="email"
                  icon={<IcoMail />}
                  value={form.email}
                  onChange={setField("email")}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  id="contact-company"
                  label="Company"
                  placeholder="Company name"
                  icon={<IcoBldg />}
                  value={form.company ?? ""}
                  onChange={setField("company")}
                />
                <Field
                  id="contact-phone"
                  label="Phone"
                  placeholder="+20 100 000 0000"
                  type="tel"
                  icon={<IcoPhone />}
                  value={form.phone ?? ""}
                  onChange={setField("phone")}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  id="contact-website"
                  label="Website"
                  placeholder="https://yoursite.com"
                  icon={<IcoGlobe />}
                  value={form.website ?? ""}
                  onChange={setField("website")}
                />
                <SelectField
                  id="contact-budget"
                  label="Monthly Budget"
                  placeholder="Select budget"
                  icon={<IcoDollar />}
                  value={form.budget ?? ""}
                  onChange={setField("budget")}
                  options={CONTACT_BUDGETS}
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="echo-contact-label">Service</span>
                <div className="flex flex-wrap gap-1.5">
                  {CONTACT_SERVICES.map((service) => {
                    const isSelected = selected.has(service)

                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        aria-pressed={isSelected ? "true" : "false"}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 font-sans text-[12.5px] font-medium transition-colors duration-150",
                          isSelected
                            ? "border-[var(--echo-orange)]/35 bg-[var(--echo-orange-muted)] text-[var(--echo-orange)]"
                            : "border-[var(--echo-border)] text-[var(--echo-text-2)] hover:border-[var(--echo-orange)]/20",
                        )}
                      >
                        {service}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-brief" className="echo-contact-label">
                  Brief
                </label>
                <textarea
                  id="contact-brief"
                  placeholder="Goals, timeline, audience, and what success should look like."
                  value={form.brief ?? ""}
                  onChange={(event) => setField("brief")(event.target.value)}
                  rows={4}
                  className="echo-contact-textarea"
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 font-sans text-sm text-[var(--echo-orange)]" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-7">
              <p className="mb-4 font-sans text-xs leading-relaxed text-[var(--echo-text-3)]">
                We&apos;ll use this to reply about your project inquiry only.
              </p>
              <button type="submit" disabled={isPending} className="echo-contact-submit">
                {isPending ? "Sending…" : "Send Inquiry"}
                {!isPending ? <IcoSend /> : null}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
