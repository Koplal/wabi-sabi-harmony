import { Writable } from "node:stream";
import type { ReactNode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import { preloadRoute } from "./App";
import Root from "./Root";

export { GOOGLE_REVIEWS_URL, GOOGLE_SHARE_URL } from "./data/organization";
export { builtOn } from "./hooks/use-today";

export interface RenderedRoute {
  html: string;
  helmet: HelmetServerState;
}

/** Waits for every lazy page, and rejects if any part of the tree fails to render. */
const renderToHtml = (tree: ReactNode) =>
  new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _encoding, done) {
        chunks.push(Buffer.from(chunk));
        done();
      },
    });
    sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8")));

    const { pipe } = renderToPipeableStream(tree, {
      // React moves a large finished boundary into a hidden element and swaps it in with a script,
      // which leaves the page out of reach without JavaScript. This keeps every boundary in place.
      progressiveChunkSize: Number.POSITIVE_INFINITY,
      onAllReady: () => pipe(sink),
      onShellError: reject,
      // A failure inside a boundary still finishes, with the loading fallback in the HTML.
      onError: reject,
    });
  });

/** One page as HTML, with the head tags its components asked for. Runs in `npm run build`. */
export async function render(path: string): Promise<RenderedRoute> {
  await preloadRoute(path);
  const Router = ({ children }: { children: ReactNode }) => <StaticRouter location={path}>{children}</StaticRouter>;
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = await renderToHtml(<Root Router={Router} helmetContext={helmetContext} />);
  if (!helmetContext.helmet) throw new Error(`${path}: the head manager returned nothing`);
  return { html, helmet: helmetContext.helmet };
}
