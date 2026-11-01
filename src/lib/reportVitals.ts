import { onLCP, type LCPMetric } from "web-vitals";

const ENDPOINT = "/api/report-vitals";
const PHONE_WIDTH = "(max-width: 767px)";

/** A page restored by the Back button has no real load to measure, so it sends nothing. */
export function reportBody(metric: Pick<LCPMetric, "name" | "value" | "navigationType">, path: string, device: string) {
  if (metric.navigationType === "back-forward-cache") return null;
  return JSON.stringify({ metric: metric.name, value: metric.value, path, device });
}

/**
 * Sends each page load's LCP to our own function, which forwards it to Axiom. LCP belongs to the
 * page the visitor landed on, and the report can arrive after the app has moved to another route,
 * so the path is read here at load.
 */
export function reportVitals() {
  const path = window.location.pathname;
  const device = window.matchMedia(PHONE_WIDTH).matches ? "mobile" : "desktop";

  onLCP((metric) => {
    const body = reportBody(metric, path, device);
    if (body) navigator.sendBeacon(ENDPOINT, body);
  });
}
