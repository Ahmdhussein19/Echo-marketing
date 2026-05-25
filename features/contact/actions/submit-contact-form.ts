"use server"

import { contactFormSchema, type ContactFormInput } from "@/features/contact/schemas/contact-form"

type SubmitContactResult =
  | { success: true; data: ContactFormInput }
  | { success: false; error: string }

export async function submitContactForm(
  input: unknown,
): Promise<SubmitContactResult> {
  const parsed = contactFormSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" }
  }

  try {
    // TODO(ECHO-CONTACT): wire to CRM / email provider when backend is ready
    return { success: true, data: parsed.data }
  } catch {
    return { success: false, error: "Failed to send inquiry. Please try again." }
  }
}
