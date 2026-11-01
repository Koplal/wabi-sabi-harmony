/**
 * Starts a Stripe Checkout session for the cart.
 *
 * Only item ids are read from the request. Names and prices come from CATALOGUE,
 * so nothing the browser sends can change the amount, and a bad cart is refused
 * before Stripe is called. The Stripe customer is created on payment, not before,
 * so an unpaid request can't touch an existing customer's record.
 *
 * This file imports nothing on purpose, so it has no module resolution to go wrong
 * on Vercel. `vite dev` doesn't serve /api: use `vercel dev` to test checkout locally.
 */

const STRIPE_SESSIONS_URL = "https://api.stripe.com/v1/checkout/sessions";
const SITE = "https://wabisabiservices.ca";
const GST_RATE = 0.05;
const METADATA_MAX_LENGTH = 500;

interface CatalogueItem {
  name: string;
  price: number;
  /** Still listed, but refused at checkout, so a saved cart can't buy a closed season. */
  closed?: boolean;
  addOnFor?: string;
}

interface PricedLine {
  name: string;
  /** Price in cents. */
  unitAmount: number;
  description?: string;
}

interface PricedCart {
  lines: PricedLine[];
  gstAmount: number;
}

interface CheckoutBody {
  items?: unknown;
  customerInfo?: Record<string, unknown>;
}

/**
 * The only source of checkout prices, in whole Canadian dollars before GST, keyed by
 * the cart item id. Keep this in step with the prices on src/pages/seasonal/*: an item
 * missing here can't be bought, and a price here is what customers are actually charged.
 */
const CATALOGUE: Record<string, CatalogueItem> = {
  "abundant-harmony": { name: "The Abundant Harmony", price: 899 },
  "abundant-harmony-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Abundant Harmony" },
  "abundant-harmony-pumpkins": { name: "24 Mini Pumpkins", price: 75, addOnFor: "The Abundant Harmony" },
  "abundant-harmony-removal": { name: "Post-Halloween Removal & Composting", price: 99, addOnFor: "The Abundant Harmony" },
  "beachside-manor": { name: "The Beachside Manor", price: 1424 },
  "beachside-manor-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Beachside Manor" },
  "beachside-manor-planters": { name: "Additional Planter Arrangements (2)", price: 75, addOnFor: "The Beachside Manor" },
  "beachside-manor-removal": { name: "Post-Season Removal", price: 99, addOnFor: "The Beachside Manor" },
  "blooming-manor": { name: "The Blooming Manor", price: 1924 },
  "blooming-manor-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Blooming Manor" },
  "blooming-manor-removal": { name: "Post-Season Removal & Composting", price: 99, addOnFor: "The Blooming Manor" },
  "blooming-manor-wreath": { name: "Additional Premium Wreath", price: 75, addOnFor: "The Blooming Manor" },
  "botanical-estate": { name: "The Botanical Estate", price: 1424 },
  "botanical-estate-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Botanical Estate" },
  "botanical-estate-planters": { name: "Additional Planter Arrangements (2)", price: 75, addOnFor: "The Botanical Estate" },
  "botanical-estate-removal": { name: "Post-Season Removal & Composting", price: 99, addOnFor: "The Botanical Estate" },
  "business-welcome": { name: "The Business Welcome", price: 799, closed: true },
  "business-welcome-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, closed: true, addOnFor: "The Business Welcome" },
  "business-welcome-planter": { name: "Additional Planter Display", price: 75, closed: true, addOnFor: "The Business Welcome" },
  "business-welcome-removal": { name: "Post-Holiday Removal & Composting", price: 99, closed: true, addOnFor: "The Business Welcome" },
  "coastal-cottage": { name: "The Coastal Cottage", price: 474 },
  "coastal-cottage-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Coastal Cottage" },
  "coastal-cottage-planter": { name: "Additional Planter Display", price: 75, addOnFor: "The Coastal Cottage" },
  "coastal-cottage-removal": { name: "Post-Season Removal", price: 99, addOnFor: "The Coastal Cottage" },
  "cozy-cabin": { name: "The Cozy Cabin", price: 474, closed: true },
  "cozy-cabin-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, closed: true, addOnFor: "The Cozy Cabin" },
  "cozy-cabin-candles": { name: "Additional LED Candles (4)", price: 75, closed: true, addOnFor: "The Cozy Cabin" },
  "cozy-cabin-removal": { name: "Post-Holiday Removal & Composting", price: 99, closed: true, addOnFor: "The Cozy Cabin" },
  "estate-collection": { name: "The Estate Collection", price: 1899 },
  "estate-collection-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Estate Collection" },
  "estate-collection-pumpkins": { name: "24 Mini Pumpkins", price: 75, addOnFor: "The Estate Collection" },
  "estate-collection-removal": { name: "Post-Halloween Removal & Composting", price: 99, addOnFor: "The Estate Collection" },
  "festive-estate": { name: "The Festive Estate", price: 1424, closed: true },
  "festive-estate-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, closed: true, addOnFor: "The Festive Estate" },
  "festive-estate-garland": { name: "Additional Garland (10 feet)", price: 75, closed: true, addOnFor: "The Festive Estate" },
  "festive-estate-removal": { name: "Post-Holiday Removal & Composting", price: 99, closed: true, addOnFor: "The Festive Estate" },
  "fresh-start": { name: "The Fresh Start", price: 474 },
  "fresh-start-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Fresh Start" },
  "fresh-start-planter": { name: "Additional Planter Display", price: 75, addOnFor: "The Fresh Start" },
  "fresh-start-removal": { name: "Post-Season Removal & Composting", price: 99, addOnFor: "The Fresh Start" },
  "garden-gate": { name: "The Garden Gate", price: 924 },
  "garden-gate-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Garden Gate" },
  "garden-gate-removal": { name: "Post-Season Removal & Composting", price: 99, addOnFor: "The Garden Gate" },
  "garden-gate-wreath": { name: "Additional Seasonal Wreath", price: 75, addOnFor: "The Garden Gate" },
  "gathered-abundance": { name: "The Gathered Abundance", price: 1399 },
  "gathered-abundance-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Gathered Abundance" },
  "gathered-abundance-pumpkins": { name: "24 Mini Pumpkins", price: 75, addOnFor: "The Gathered Abundance" },
  "gathered-abundance-removal": { name: "Post-Halloween Removal & Composting", price: 99, addOnFor: "The Gathered Abundance" },
  "grand-celebration": { name: "The Grand Celebration", price: 1924, closed: true },
  "grand-celebration-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, closed: true, addOnFor: "The Grand Celebration" },
  "grand-celebration-removal": { name: "Post-Holiday Removal & Composting", price: 99, closed: true, addOnFor: "The Grand Celebration" },
  "grand-celebration-wreath": { name: "Additional Premium Wreath", price: 75, closed: true, addOnFor: "The Grand Celebration" },
  "island-retreat": { name: "The Island Retreat", price: 924 },
  "island-retreat-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Island Retreat" },
  "island-retreat-lantern": { name: "Additional Hurricane Lantern", price: 75, addOnFor: "The Island Retreat" },
  "island-retreat-removal": { name: "Post-Season Removal", price: 99, addOnFor: "The Island Retreat" },
  "mindful-merchant": { name: "The Mindful Merchant", price: 799 },
  "mindful-merchant-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Mindful Merchant" },
  "mindful-merchant-pumpkins": { name: "24 Mini Pumpkins", price: 75, addOnFor: "The Mindful Merchant" },
  "mindful-merchant-removal": { name: "Post-Halloween Removal & Composting", price: 99, addOnFor: "The Mindful Merchant" },
  "professional-welcome": { name: "The Professional Welcome", price: 799 },
  "professional-welcome-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Professional Welcome" },
  "professional-welcome-planter": { name: "Additional Planter Display", price: 75, addOnFor: "The Professional Welcome" },
  "professional-welcome-removal": { name: "Post-Season Removal & Composting", price: 99, addOnFor: "The Professional Welcome" },
  "quiet-grace": { name: "The Quiet Grace", price: 399 },
  "quiet-grace-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Quiet Grace" },
  "quiet-grace-arrangement": { name: "Professional Arrangement", price: 125, addOnFor: "The Quiet Grace" },
  "quiet-grace-mini-pumpkins": { name: "24 Mini Pumpkins", price: 75, addOnFor: "The Quiet Grace" },
  "quiet-grace-removal": { name: "Post-Halloween Removal & Composting", price: 99, addOnFor: "The Quiet Grace" },
  "seaside-estate": { name: "The Seaside Estate", price: 1924 },
  "seaside-estate-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Seaside Estate" },
  "seaside-estate-removal": { name: "Post-Season Removal", price: 99, addOnFor: "The Seaside Estate" },
  "seaside-estate-wreath": { name: "Additional Premium Wreath", price: 75, addOnFor: "The Seaside Estate" },
  "summer-storefront": { name: "The Summer Storefront", price: 799 },
  "summer-storefront-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, addOnFor: "The Summer Storefront" },
  "summer-storefront-planter": { name: "Additional Planter Display", price: 75, addOnFor: "The Summer Storefront" },
  "summer-storefront-removal": { name: "Post-Season Removal", price: 99, addOnFor: "The Summer Storefront" },
  "winter-wonderland": { name: "The Winter Wonderland", price: 924, closed: true },
  "winter-wonderland-aromatherapy": { name: "Seasonal Aromatherapy Spray", price: 35, closed: true, addOnFor: "The Winter Wonderland" },
  "winter-wonderland-lighting": { name: "Additional Lighting Strand (100)", price: 75, closed: true, addOnFor: "The Winter Wonderland" },
  "winter-wonderland-removal": { name: "Post-Holiday Removal & Composting", price: 99, closed: true, addOnFor: "The Winter Wonderland" },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function priceCart(items: unknown): PricedCart | { error: string } {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Your cart is empty" };
  }

  const seen: string[] = [];
  const closedItems: string[] = [];
  const lines: PricedLine[] = [];
  for (const item of items) {
    const id = (item as { id?: unknown } | null)?.id;
    if (typeof id !== "string" || !Object.prototype.hasOwnProperty.call(CATALOGUE, id) || seen.includes(id)) {
      return { error: "Your cart contains an item that is no longer available" };
    }
    seen.push(id);

    const { name, price, addOnFor, closed } = CATALOGUE[id];
    if (closed) closedItems.push(addOnFor ? `${name} (add-on for ${addOnFor})` : name);
    lines.push({ name, unitAmount: price * 100, description: addOnFor && `Add-on for ${addOnFor}` });
  }

  if (closedItems.length > 0) {
    return { error: `Closed for 2026, please remove: ${closedItems.join(", ")}.` };
  }

  const subtotal = lines.reduce((sum, line) => sum + line.unitAmount, 0);
  return { lines, gstAmount: Math.round(subtotal * GST_RATE) };
}

/** Return URLs always use https and a known host, so they can't send a buyer elsewhere. */
function siteOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const isOwnHost = host === "wabisabiservices.ca" || host === "www.wabisabiservices.ca";
  const isPreview = process.env.VERCEL_ENV === "preview" && host.endsWith(".vercel.app");
  return isOwnHost || isPreview ? `https://${host}` : SITE;
}

function appendLine(params: URLSearchParams, index: number, line: PricedLine) {
  const prefix = `line_items[${index}]`;
  params.append(`${prefix}[price_data][currency]`, "cad");
  params.append(`${prefix}[price_data][product_data][name]`, line.name);
  if (line.description) params.append(`${prefix}[price_data][product_data][description]`, line.description);
  params.append(`${prefix}[price_data][unit_amount]`, String(line.unitAmount));
  params.append(`${prefix}[quantity]`, "1");
}

export async function POST(request: Request): Promise<Response> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return json({ error: "Checkout is unavailable" }, 500);
  }

  let body: CheckoutBody | null;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ error: "Invalid request" }, 400);
  }

  const cart = priceCart(body.items);
  if ("error" in cart) {
    return json({ error: cart.error }, 400);
  }

  const customer = body.customerInfo ?? {};
  const email = text(customer.email);
  const name = text(customer.name);
  if (!email.includes("@") || !name) {
    return json({ error: "Name and email are required" }, 400);
  }

  const origin = siteOrigin(request);
  const params = new URLSearchParams({
    mode: "payment",
    customer_email: email,
    customer_creation: "always",
    success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    billing_address_collection: "required",
  });

  // Stripe's billing address may differ from where the work happens, so the service
  // details travel with the order.
  const details = {
    customer_name: name,
    phone: text(customer.phone),
    service_address: text(customer.address),
    city: text(customer.city),
    postal_code: text(customer.postalCode),
  };
  for (const [key, value] of Object.entries(details)) {
    if (value) params.append(`metadata[${key}]`, value.slice(0, METADATA_MAX_LENGTH));
  }

  cart.lines.forEach((line, index) => appendLine(params, index, line));
  appendLine(params, cart.lines.length, {
    name: "GST (5%)",
    unitAmount: cart.gstAmount,
    description: "Canadian Goods and Services Tax",
  });

  try {
    const response = await fetch(STRIPE_SESSIONS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!response.ok) {
      console.error("Stripe checkout session failed:", response.status, await response.text());
      return json({ error: "Unable to start checkout" }, 502);
    }

    const session = (await response.json()) as { id: string; url: string };
    return json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return json({ error: "Unable to start checkout" }, 502);
  }
}
