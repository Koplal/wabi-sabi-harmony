import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { reportVitals } from "./lib/reportVitals";

/** Keeps Stripe's session ID on the order confirmation page out of analytics URLs. */
const withoutSessionId = <T extends { url: string }>(event: T): T => {
  const url = new URL(event.url, window.location.origin);
  url.searchParams.delete("session_id");
  return { ...event, url: url.toString() };
};

createRoot(document.getElementById("root")!).render(
  <>
    <HelmetProvider>
      <CartProvider>
        <App />
        <SpeedInsights beforeSend={withoutSessionId} />
        <Analytics beforeSend={withoutSessionId} />
      </CartProvider>
    </HelmetProvider>
  </>
);

if (import.meta.env.PROD) reportVitals();
