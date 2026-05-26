"use client"

import { useState, useTransition, useEffect, type CSSProperties } from "react"

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
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
  id: string
}

interface SelectFieldProps {
  label: string
  placeholder: string
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  id: string
}


// ── Spinner ──────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "echoSpin 1s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="#888" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Inline Field ─────────────────────────────────────────────────
function GlowField({
  label, placeholder, type = "text", icon, value, onChange, id,
}: FieldProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 9, fontWeight: 600,
          letterSpacing: "0.13em", textTransform: "uppercase", color: "#555",
        } as CSSProperties}
      >
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        background: "#111111",
        border: focused ? "1px solid rgba(232,72,32,0.5)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, padding: "0 13px", height: 42,
        transition: "border-color 0.15s",
      }}>
        <span style={{ color: focused ? "#E84820" : "#555", flexShrink: 0, transition: "color 0.15s" }}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--font-sans, sans-serif)", fontSize: 13.5,
            color: "#E0E0E0", width: "100%",
          }}
        />
      </div>
    </div>
  )
}

// ── Inline Select ─────────────────────────────────────────────────
function GlowSelect({
  label, placeholder, icon, value, onChange, options, id,
}: SelectFieldProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 9, fontWeight: 600,
          letterSpacing: "0.13em", textTransform: "uppercase", color: "#555",
        } as CSSProperties}
      >
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        background: "#111111",
        border: focused ? "1px solid rgba(232,72,32,0.5)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, padding: "0 13px", height: 42,
        transition: "border-color 0.15s",
      }}>
        <span style={{ color: focused ? "#E84820" : "#555", flexShrink: 0, transition: "color 0.15s" }}>
          {icon}
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--font-sans, sans-serif)", fontSize: 13.5,
            color: value ? "#E0E0E0" : "#555", cursor: "pointer", appearance: "none",
          } as CSSProperties}
        >
          <option value="" disabled style={{ background: "#1a1a1a", color: "#888" }}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} style={{ background: "#1a1a1a", color: "#E0E0E0" }}>
              {o}
            </option>
          ))}
        </select>
        <span style={{ flexShrink: 0, color: "#555" }}>
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
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    let lastUpdate = 0
    const id = setInterval(() => {
      const now = performance.now()
      if (now - lastUpdate < 16) return
      lastUpdate = now
      setAngle((a) => (a + 1.2) % 360)
    }, 16)
    return () => clearInterval(id)
  }, [])

  const setField =
    (key: keyof ContactFormInput) =>
    (value: string) => {
      setForm((current) => ({ ...current, [key]: value }))
    }

  const toggleService = (service: string) => {
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(service)) next.delete(service)
      else next.add(service)
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
      if (result.success) { setSent(true); return }
      setError(result.error)
    })
  }

  const conicGrad = `conic-gradient(from ${angle}deg, #ff6ec7, #a78bfa, #60a5fa, #34d399, #fbbf24, #f87171, #ff6ec7)`

  return (
    <>
      <style>{`
        @keyframes echoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes echoFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .echo-glow-field-input::placeholder { color: #555; }
        .echo-glow-textarea::placeholder { color: #555; }
        .echo-glow-textarea:focus { border-color: rgba(232,72,32,0.5) !important; outline: none; }
        .echo-glow-select { appearance: none; -webkit-appearance: none; }
      `}</style>

      {/* Rotating conic gradient border */}
      <div style={{
        borderRadius: 24, padding: 2,
        background: conicGrad,
        boxShadow: "0 0 40px rgba(167,139,250,0.25), 0 0 80px rgba(96,165,250,0.12)",
      }}>
        {/* Inner card */}
        <div style={{
          borderRadius: 22, background: "#1a1a1a",
          padding: "28px 28px 24px", position: "relative", overflow: "hidden",
        }}>
          {/* Ambient inner glow */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,139,250,0.04) 0%, transparent 60%)",
          }} />

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, position: "relative" }}>
            {/* Echo logo mark */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
                <path d="M4 6h16v4H4zM4 12h12v4H4zM4 18h16v4H4z" fill="#ffffff" opacity="0.9" />
                <path d="M22 6h6v4h-6zM24 12h4v4h-4zM22 18h6v4h-6z" fill="#E84820" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.6)" }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" } as CSSProperties}>
                Available
              </span>
            </div>
          </div>

          {/* Title row */}
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-sans, sans-serif)", fontSize: 16, fontWeight: 600, color: "#E0E0E0" }}>
              Let&apos;s shape your next move.
            </span>
          </div>

          {/* Content */}
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "32px 0", animation: "echoFadeIn 0.4s ease" }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80",
              }}>
                <IcoCheck />
              </div>
              <p style={{ fontFamily: "var(--font-heading, sans-serif)", fontSize: 30, fontWeight: 700, color: "#E0E0E0", letterSpacing: -0.3 }}>
                Message sent.
              </p>
              <p style={{ fontFamily: "var(--font-sans, sans-serif)", fontSize: 13, color: "#888", textAlign: "center", maxWidth: 240, lineHeight: 1.6 }}>
                We&apos;ll review your brief and reply within 1–2 business days.
              </p>
              <button
                type="button"
                onClick={reset}
                style={{
                  marginTop: 6, fontFamily: "var(--font-sans, sans-serif)", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "#E84820",
                  background: "transparent", border: "1px solid rgba(232,72,32,0.3)",
                  borderRadius: 9999, padding: "8px 20px", cursor: "pointer",
                } as CSSProperties}
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 13, animation: "echoFadeIn 0.3s ease" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <GlowField id="contact-name" label="Name" placeholder="Your name" icon={<IcoUser />} value={form.name} onChange={setField("name")} />
                <GlowField id="contact-email" label="Email" placeholder="name@company.com" type="email" icon={<IcoMail />} value={form.email} onChange={setField("email")} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <GlowField id="contact-company" label="Company" placeholder="Company name" icon={<IcoBldg />} value={form.company ?? ""} onChange={setField("company")} />
                <GlowField id="contact-phone" label="Phone" placeholder="+20 100 000 0000" type="tel" icon={<IcoPhone />} value={form.phone ?? ""} onChange={setField("phone")} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <GlowField id="contact-website" label="Website" placeholder="https://yoursite.com" icon={<IcoGlobe />} value={form.website ?? ""} onChange={setField("website")} />
                <GlowSelect id="contact-budget" label="Monthly Budget" placeholder="Select budget" icon={<IcoDollar />} value={form.budget ?? ""} onChange={setField("budget")} options={CONTACT_BUDGETS} />
              </div>

              {/* Services */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "#555" } as CSSProperties}>
                  Service
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CONTACT_SERVICES.map((service) => {
                    const isOn = selected.has(service)
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        aria-pressed={isOn}
                        style={{
                          fontFamily: "var(--font-sans, sans-serif)", fontSize: 12, fontWeight: 500,
                          color: isOn ? "#E84820" : "#888",
                          background: isOn ? "rgba(232,72,32,0.1)" : "rgba(255,255,255,0.03)",
                          border: isOn ? "1px solid rgba(232,72,32,0.35)" : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 9999, padding: "5px 12px", cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {service}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Brief */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label
                  htmlFor="contact-brief"
                  style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 9, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "#555" } as CSSProperties}
                >
                  Brief
                </label>
                <textarea
                  id="contact-brief"
                  placeholder="Goals, timeline, audience, and what success should look like."
                  value={form.brief ?? ""}
                  onChange={(e) => setField("brief")(e.target.value)}
                  rows={3}
                  className="echo-glow-textarea"
                  style={{
                    width: "100%", background: "#111111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "11px 13px",
                    fontFamily: "var(--font-sans, sans-serif)", fontSize: 13.5, color: "#E0E0E0",
                    lineHeight: 1.6, resize: "vertical", transition: "border-color 0.15s",
                  } as CSSProperties}
                />
              </div>

              {error ? (
                <p style={{ fontFamily: "var(--font-sans, sans-serif)", fontSize: 13, color: "#E84820" }} role="alert">
                  {error}
                </p>
              ) : null}

              {/* Bottom row */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginTop: 4, paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Spinner />
                  <span style={{ fontFamily: "var(--font-sans, sans-serif)", fontSize: 13, color: "#555", fontStyle: "italic" }}>
                    {isPending ? "Sending your brief..." : "Ready when you are..."}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "var(--font-sans, sans-serif)", fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: isPending ? "rgba(232,72,32,0.5)" : "#fff",
                    background: isPending ? "rgba(232,72,32,0.08)" : "#E84820",
                    border: isPending ? "1px solid rgba(232,72,32,0.2)" : "none",
                    borderRadius: 9999, padding: "10px 20px",
                    cursor: isPending ? "not-allowed" : "pointer",
                    transition: "all 0.2s", flexShrink: 0,
                  } as CSSProperties}
                >
                  {isPending ? "Sending..." : <><IcoSend /> Send Inquiry</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
