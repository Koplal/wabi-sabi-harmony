import type { ComponentProps } from "react";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { CartProvider } from "./contexts/CartContext";

/** Keeps Stripe's session ID on the order confirmation page out of analytics URLs. */
const withoutSessionId = <T extends { url: string }>(event: T): T => {
  const url = new URL(event.url, window.location.origin);
  url.searchParams.delete("session_id");
  return { ...event, url: url.toString() };
};

interface RootProps extends ComponentProps<typeof App> {
  /** Filled by the head manager when the build renders a page. */
  helmetContext?: object;
}

/**
 * The whole tree, for the browser and the build alike. It must be one component: useId counts
 * siblings, so one extra element on either side shifts every Radix ID, and production React says
 * nothing about a mismatched attribute.
 */
const Root = ({ Router, helmetContext }: RootProps) => (
  <HelmetProvider context={helmetContext}>
    <CartProvider>
      <App Router={Router} />
      <SpeedInsights beforeSend={withoutSessionId} />
      <Analytics beforeSend={withoutSessionId} />
    </CartProvider>
  </HelmetProvider>
);

export default Root;
