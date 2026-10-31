/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLARITY_ID?: string;
  /** Inlined by the define in vite.config.ts. Empty when the build ran outside Vercel. */
  readonly VERCEL_ENV?: string;
}

interface Window {
  /** Defined by the inline Google tag in index.html. */
  gtag?: (...args: unknown[]) => void;
}
