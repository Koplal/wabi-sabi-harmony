import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/** Vercel's build environment. It has no VITE_ prefix, so the define below passes it to the client. */
const vercelEnv = (process.env.VERCEL_ENV ?? "").trim();

/** One build-log line with the two values that decide whether Clarity runs. Never prints the ID. */
function clarityBuildLog(): Plugin {
  return {
    name: "clarity-build-log",
    apply: "build",
    configResolved(config) {
      if (config.build.ssr) return;
      const present = (config.env.VITE_CLARITY_ID ?? "").trim() !== "";
      config.logger.info(`Clarity ID present: ${present ? "yes" : "no"}, VERCEL_ENV: ${vercelEnv || "unset"}`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    "import.meta.env.VERCEL_ENV": JSON.stringify(vercelEnv),
  },
  plugins: [react(), mode === "development" && componentTagger(), clarityBuildLog()].filter(Boolean),
  // The prerender bundle carries its own dependencies, so Node never has to load a browser package.
  ssr: {
    noExternal: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
