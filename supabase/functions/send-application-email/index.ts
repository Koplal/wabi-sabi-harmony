import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationFormData {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  experience?: string;
  availability?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ApplicationFormData = await req.json();
    console.log("Received job application:", { email: formData.email, name: formData.name });

    // Send email to your business inbox
    const emailResponse = await resend.emails.send({
      from: "Wabi-Sabi Careers <onboarding@wabisabiservices.ca>",
      to: ["hello@wabisabiservices.ca"],
      replyTo: formData.email,
      subject: `New Job Application from ${formData.name}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ""}
        ${formData.position ? `<p><strong>Position of Interest:</strong> ${formData.position}</p>` : ""}
        ${formData.availability ? `<p><strong>Availability:</strong> ${formData.availability}</p>` : ""}
        
        ${formData.experience ? `
          <h3>Relevant Experience:</h3>
          <p>${formData.experience.replace(/\n/g, "<br>")}</p>
        ` : ""}
        
        ${formData.message ? `
          <h3>Additional Information:</h3>
          <p>${formData.message.replace(/\n/g, "<br>")}</p>
        ` : ""}
      `,
    });

    console.log("Application email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-email function:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
