import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingFormData {
  address: string;
  serviceType: string;
  cadence: string;
  preferredTime1?: string;
  preferredTime2?: string;
  preferredTime3?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: BookingFormData = await req.json();
    console.log("Received booking form submission:", { address: formData.address, serviceType: formData.serviceType });

    // Send email to your business inbox
    const emailResponse = await resend.emails.send({
      from: "Wabi-Sabi Booking <onboarding@wabisabiservices.ca>",
      to: ["hello@wabisabiservices.ca"],
      subject: "New Booking Request",
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Address:</strong> ${formData.address}</p>
        <p><strong>Service Type:</strong> ${formData.serviceType}</p>
        <p><strong>Cadence:</strong> ${formData.cadence}</p>
        
        <h3>Preferred Time Windows:</h3>
        ${formData.preferredTime1 ? `<p><strong>Option 1:</strong> ${formData.preferredTime1}</p>` : ""}
        ${formData.preferredTime2 ? `<p><strong>Option 2:</strong> ${formData.preferredTime2}</p>` : ""}
        ${formData.preferredTime3 ? `<p><strong>Option 3:</strong> ${formData.preferredTime3}</p>` : ""}
      `,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
