/**
 * Serves dist/ the way vercel.json does, for the browser pass.
 *
 * `vite preview` is not used because its fallback can serve the home page for extensionless
 * routes, which hides head problems. Files win over rewrites, as they do on Vercel, and
 * /_vercel/* returns 204. It listens on a free port, so several passes can run side by side.
 */
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { extname, resolve, sep } from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

interface VercelConfig {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
  rewrites?: Array<{ source: string; destination: string }>;
}

const matches = (source: string, pathname: string) => new RegExp(`^${source}$`).test(pathname);

export interface RunningServer {
  origin: string;
  close(): Promise<void>;
}

export function startStaticServer(root: string): Promise<RunningServer> {
  const dist = resolve(root, "dist");
  const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8")) as VercelConfig;

  const fileIn = (pathname: string): string | undefined => {
    const candidate = resolve(dist, `.${pathname}`);
    if (candidate !== dist && !candidate.startsWith(`${dist}${sep}`)) return undefined;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    const index = resolve(candidate, "index.html");
    return existsSync(index) ? index : undefined;
  };

  const resolveRequest = (pathname: string): string | undefined => {
    const direct = fileIn(pathname);
    if (direct) return direct;
    const rewrite = config.rewrites?.find((entry) => matches(entry.source, pathname));
    if (rewrite) return fileIn(rewrite.destination);
    return undefined;
  };

  const server: Server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/_vercel/")) {
      response.writeHead(204).end();
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405).end();
      return;
    }

    for (const rule of config.headers ?? []) {
      if (matches(rule.source, pathname)) for (const { key, value } of rule.headers) response.setHeader(key, value);
    }

    const file = resolveRequest(pathname);
    if (!file) {
      const notFound = fileIn("/404.html");
      response.writeHead(404, { "Content-Type": CONTENT_TYPES[".html"] });
      if (notFound && request.method === "GET") createReadStream(notFound).pipe(response);
      else response.end();
      return;
    }

    if (!response.hasHeader("Content-Type")) {
      response.setHeader("Content-Type", CONTENT_TYPES[extname(file)] ?? "application/octet-stream");
    }
    response.writeHead(200);
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  });

  return new Promise((resolvePromise, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolvePromise({
        origin: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise((done) => {
            server.closeAllConnections();
            server.close(() => done());
          }),
      });
    });
  });
}
