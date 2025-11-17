import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, customerInfo, items } = await req.json();
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Create or retrieve customer
    const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        'address[line1]': customerInfo.address,
        'address[city]': customerInfo.city || '',
        'address[postal_code]': customerInfo.postalCode || '',
      }),
    });

    if (!customerResponse.ok) {
      const error = await customerResponse.text();
      console.error('Stripe customer creation error:', error);
      throw new Error('Failed to create customer');
    }

    const customer = await customerResponse.json();

    // Create payment intent
    const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Convert to cents
        currency: 'cad',
        customer: customer.id,
        'metadata[items]': JSON.stringify(items),
        'metadata[customer_name]': customerInfo.name,
        'metadata[customer_email]': customerInfo.email,
      }),
    });

    if (!paymentIntentResponse.ok) {
      const error = await paymentIntentResponse.text();
      console.error('Stripe payment intent error:', error);
      throw new Error('Failed to create payment intent');
    }

    const paymentIntent = await paymentIntentResponse.json();

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
