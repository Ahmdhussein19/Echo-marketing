import { z } from "zod"

export const CONTACT_SERVICES = [
  "Branding",
  "Content Creation",
  "Media Production",
  "SEO",
  "Media Buying",
  "Website Development",
  "Mobile Applications",
  "Reel Creator",
] as const

export const CONTACT_BUDGETS = [
  "Under $3,000",
  "$3,000 – $6,000",
  "$6,000 – $10,000",
  "$10,000 – $20,000",
  "$20,000+",
  "Let's discuss",
] as const

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  website: z.string().trim().optional(),
  budget: z.string().trim().optional(),
  services: z.array(z.string()).optional(),
  brief: z.string().trim().optional(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
