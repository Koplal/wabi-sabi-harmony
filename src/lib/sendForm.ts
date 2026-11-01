export type FormName = "contact" | "booking" | "careers";

/** Longer than the function's own limit on Resend, so its answer arrives first. */
const TIMEOUT_MS = 15000;

/** Shown after a send fails for a reason the customer can't fix. State is kept, so nothing typed is lost. */
export const FORM_FAILED = "We couldn't send this, but your details are still here. Please call 250-896-5971 or email hello@wabisabiservices.ca.";

/** A refusal the customer can fix, such as a mistyped email address. */
export class FormRefused extends Error {}

/** Posts a form to the Vercel Function that emails it to the business inbox. */
export async function sendForm(form: FormName, fields: Record<string, string>): Promise<Response> {
  // AbortSignal.timeout is missing from Safari before 16, where it would break every form.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch("/api/send-form-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, form }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/** The error for a failed response. Only a 400 carries a message the customer can act on. */
export async function formFailure(response: Response): Promise<Error> {
  const body = response.status === 400 ? await response.json().catch(() => null) : null;
  return typeof body?.error === "string" ? new FormRefused(body.error) : new Error("Form was not sent");
}
