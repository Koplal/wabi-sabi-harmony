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

/**
 * Without its script a built page still looks finished, but the menus, cart, forms and FAQ answers
 * do nothing. A weak connection or a deploy that replaced the file is the likely cause, so it
 * reloads once. After that the visitor keeps text and links only, and this event is the one record.
 */
const recoverPageScript = () => {
  if (claimRetry()) window.location.reload();
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
