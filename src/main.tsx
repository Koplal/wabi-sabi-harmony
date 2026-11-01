import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { preloadRoute } from "./App";
import Root from "./Root";
import "./index.css";

const container = document.getElementById("root")!;
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const app = <Root Router={BrowserRouter} />;

// Only HTML built for this path can be attached to. Any other URL gets the home page's HTML from
// the catch-all rewrite, and the dev server gets an empty #root. If the page's script fails to
// load, the visitor keeps the built page, which reads and links as plain HTML.
if (container.dataset.route === path) {
  preloadRoute(path).then(() => hydrateRoot(container, app));
} else {
  createRoot(container).render(app);
}
