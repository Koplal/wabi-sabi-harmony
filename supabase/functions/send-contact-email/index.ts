import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  serviceType?: string;
  cadence?: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Received contact form submission:", { email: formData.email, name: formData.name });

    // Send email to your business inbox
    const emailResponse = await resend.emails.send({
      from: "Wabi-Sabi Contact Form <onboarding@wabisabiservices.ca>",
      to: ["hello@wabisabiservices.ca"], // Your business email
      replyTo: formData.email,
      subject: `New Contact Form Submission from ${formData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ""}
        ${formData.address ? `<p><strong>Address/Neighbourhood:</strong> ${formData.address}</p>` : ""}
        ${formData.serviceType ? `<p><strong>Service Type:</strong> ${formData.serviceType}</p>` : ""}
        ${formData.cadence ? `<p><strong>Ideal Cadence:</strong> ${formData.cadence}</p>` : ""}
        ${formData.notes ? `<p><strong>Notes:</strong></p><p>${formData.notes.replace(/\n/g, "<br>")}</p>` : ""}
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
