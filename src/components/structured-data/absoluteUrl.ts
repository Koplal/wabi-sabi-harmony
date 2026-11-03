const SITE = "https://wabisabiservices.ca";

/**
 * The full URL of an image for JSON-LD, which needs an absolute one. An imported asset is a
 * root path such as /assets/name-hash.jpg, the same in the prerender bundle and the browser
 * bundle, so the built HTML and the hydrated head name the same file.
 *
 * Vite turns a very small import into a data: URI, which is no use as a schema image, so that
 * stops the build rather than ship it.
 */
export function absoluteUrl(path: string): string {
  if (path.startsWith(`${SITE}/`)) return path;
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`JSON-LD image must be a site path or a ${SITE} URL, not ${path.slice(0, 40)}`);
  }
  return `${SITE}${path}`;
}
