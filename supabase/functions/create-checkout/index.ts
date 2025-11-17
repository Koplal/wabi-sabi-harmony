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
    const { items, customerInfo } = await req.json();
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Check if customer already exists
    const customersResponse = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(customerInfo.email)}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      }
    );

    const customersData = await customersResponse.json();
    let customerId = customersData.data?.[0]?.id;

    // Create customer if doesn't exist
    if (!customerId) {
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone || '',
          'address[line1]': customerInfo.address || '',
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
      customerId = customer.id;
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price, 0);
    const gstRate = 0.05; // 5% GST for Canada
    const gstAmount = Math.round(subtotal * gstRate * 100); // Convert to cents

    // Create line items for Stripe Checkout
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Add GST as a separate line item
    lineItems.push({
      price_data: {
        currency: 'cad',
        product_data: {
          name: 'GST (5%)',
          description: 'Canadian Goods and Services Tax',
        },
        unit_amount: gstAmount,
      },
      quantity: 1,
    });

    const origin = req.headers.get('origin') || 'http://localhost:8080';

    // Create Stripe Checkout Session
    const sessionParams = new URLSearchParams({
      'customer': customerId,
      'mode': 'payment',
      'success_url': `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${origin}/cart`,
      'billing_address_collection': 'required',
    });

    // Add line items
    lineItems.forEach((item: any, index: number) => {
      sessionParams.append(`line_items[${index}][price_data][currency]`, item.price_data.currency);
      sessionParams.append(`line_items[${index}][price_data][product_data][name]`, item.price_data.product_data.name);
      if (item.price_data.product_data.description) {
        sessionParams.append(`line_items[${index}][price_data][product_data][description]`, item.price_data.product_data.description);
      }
      sessionParams.append(`line_items[${index}][price_data][unit_amount]`, item.price_data.unit_amount.toString());
      sessionParams.append(`line_items[${index}][quantity]`, item.quantity.toString());
    });

    const sessionResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sessionParams,
    });

    if (!sessionResponse.ok) {
      const error = await sessionResponse.text();
      console.error('Stripe checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }

    const session = await sessionResponse.json();

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
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
