import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const PROJECT_ID = (import.meta.env.VITE_CLARITY_ID ?? "").trim();
const VERCEL_ENV = import.meta.env.VERCEL_ENV ?? "";

/** The Stripe session ID is in this page's URL and the order ID is on the page. */
const isCheckoutSuccess = (pathname: string) =>
  pathname.replace(/\/+$/, "").toLowerCase() === "/checkout-success";

/** Latch: Clarity is started once per page load, across re-mounts. */
let started = false;

/**
 * Microsoft Clarity (heatmaps and session replays). Mounted once in App.tsx. Renders nothing.
 *
 * - Does nothing unless VITE_CLARITY_ID is set and the build ran with VERCEL_ENV=production, so
 *   local and preview builds never record.
 * - Runs only in a client effect, so index.html has no Clarity code. It waits for the window `load`
 *   event, then a browser idle moment, so it stays off the LCP critical path.
 * - The check on /checkout-success runs once per page load. A visit that lands there leaves Clarity
 *   off until the next full load, including after client navigation away and back.
 * - Sends one custom tag, `env`, and never calls identify(): no names or emails go to Clarity.
 *   Form fields that hold personal details sit inside `data-clarity-mask="true"` wrappers.
 */
const ClarityLoader = () => {
  useEffect(() => {
    if (!PROJECT_ID || VERCEL_ENV !== "production") return;

    const start = () => {
      if (started || isCheckoutSuccess(window.location.pathname)) return;
      started = true;
      Clarity.init(PROJECT_ID);
      Clarity.setTag("env", VERCEL_ENV);
    };
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(start);
      else start();
    };

    if (document.readyState === "complete") {
      whenIdle();
      return;
    }
    window.addEventListener("load", whenIdle, { once: true });
    return () => window.removeEventListener("load", whenIdle);
  }, []);

  return null;
};

export default ClarityLoader;
