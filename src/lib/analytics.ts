/** GA4 event names, exactly as they are marked as key events in GA4. */
type AnalyticsEvent = "consultation_booking" | "contact_submit";

/** The only parameter an event may carry. Never add personal data here. */
interface EventParams {
  service_type?: string;
}

const isSiteHostname = (hostname: string) =>
  hostname === "wabisabiservices.ca" || hostname.endsWith(".wabisabiservices.ca");

/**
 * Sends a GA4 event through the inline Google tag in index.html. Does nothing without the tag or
 * away from the site's own hostnames, so previews and local builds send nothing.
 */
export const trackEvent = (name: AnalyticsEvent, { service_type }: EventParams = {}) => {
  try {
    if (!isSiteHostname(window.location.hostname) || typeof window.gtag !== "function") return;
    window.gtag("event", name, service_type ? { service_type } : {});
  } catch {
    // Callers fire this after a form has sent. A tag failure must not surface as a form error.
  }
};
