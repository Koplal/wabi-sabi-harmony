export type FormName = "contact" | "booking" | "careers";

/** Posts a form to the Vercel Function that emails it to the business inbox. */
export const sendForm = (form: FormName, fields: Record<string, string>) =>
  fetch("/api/send-form-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...fields, form }),
  });
