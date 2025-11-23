import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PriceEstimateFormData {
  firstName: string;
  lastName: string;
  email: string;
  serviceType: string;
  bathrooms: number;
  frequency: string;
  estimatedPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: PriceEstimateFormData = await req.json();
    console.log("Received price estimate submission:", {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      serviceType: formData.serviceType
    });

    // Send email to your business inbox
    const emailResponse = await resend.emails.send({
      from: "Wabi-Sabi Price Estimate <onboarding@wabisabiservices.ca>",
      to: ["hello@wabisabiservices.ca"],
      replyTo: formData.email,
      subject: `New Booking Request from ${formData.firstName} ${formData.lastName}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Service Type:</strong> ${formData.serviceType}</p>
        <p><strong>Bathrooms/Workers:</strong> ${formData.bathrooms}</p>
        <p><strong>Frequency/Hours:</strong> ${formData.frequency}</p>
        <p><strong>Estimated Price:</strong> $${formData.estimatedPrice}</p>
      `,
    });

    console.log("Price estimate email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-price-estimate-email function:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
