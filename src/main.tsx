import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { preloadRoute } from "./App";
import Root from "./Root";
import { trackEvent } from "./lib/analytics";
import "./index.css";

const container = document.getElementById("root")!;
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const app = <Root Router={BrowserRouter} />;

const RETRIED_KEY = "page-script-retried";
const SITE_CHECK_MS = 3000;

/** With storage blocked this reads as already retried, because nothing could then stop a reload loop. */
const claimRetry = () => {
  try {
    if (sessionStorage.getItem(RETRIED_KEY) === path) return false;
    sessionStorage.setItem(RETRIED_KEY, path);
    return true;
  } catch {
    return false;
  }
};

const formFields = () => [...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("form input[id], form textarea[id]")];

/** Text in a built form, which a reload would throw away. */
const formHasText = () => formFields().some((field) => field.value);

/** The page stays on screen until the new one arrives, and text typed in that gap would be lost. */
const reloadPage = () => {
  for (const field of formFields()) field.readOnly = true;
  window.location.reload();
};

/**
 * A reload with no connection swaps a page that reads fine for the browser's error page. A good
 * answer can't promise the reload lands on a flaky link. That risk is taken for the reload that
 * usually fixes this. AbortSignal.timeout is missing from Safari before 16, as in sendForm.
 */
const siteAnswers = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SITE_CHECK_MS);
  try {
    const response = await fetch(window.location.href, { method: "HEAD", cache: "no-store", signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Without its script a built page still looks finished, but the menus, cart, forms and FAQ answers
 * do nothing. A weak connection or a deploy that replaced the file is the likely cause, so it
 * reloads once. Forms are checked again after the wait, because a visitor can type during it.
 * Otherwise the visitor keeps the page, each form's built text gives the phone and email, and this
 * event is the one record.
 */
const recoverPageScript = async () => {
  if (!formHasText() && (await siteAnswers()) && !formHasText() && claimRetry()) reloadPage();
  else trackEvent("page_script_failed");
};

const attach = () => {
  try {
    sessionStorage.removeItem(RETRIED_KEY);
  } catch {
    // Blocked storage holds no flag to clear.
  }
  hydrateRoot(container, app);
};

// Only HTML built for this path can be attached to. Any other URL gets 404.html, which has no
// data-route, so React renders over it, and the dev server gets an empty #root.
if (container.dataset.route === path) {
  preloadRoute(path).then(attach, recoverPageScript);
} else {
  createRoot(container).render(app);
}
