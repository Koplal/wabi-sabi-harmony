import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { type ComponentType, type ReactNode, useEffect, useRef, useState, lazy, Suspense } from "react";
import ClarityLoader from "@/components/Clarity";
import { Layout } from "@/components/Layout";
import NotFound from "./pages/NotFound";
import { neighborhoods } from "@/data/neighborhoods";
import { ROUTES, type SiteRoute } from "@/data/routes";

/** Every page file, each in its own chunk. NotFound is imported above, so it stays in the main bundle. */
const pageFiles = import.meta.glob<{ default: ComponentType }>(["./pages/**/*.tsx", "!./pages/NotFound.tsx"]);

/**
 * A lazy page that can also load ahead of its first render, and then renders with no Suspense
 * boundary at all, which attaching to built HTML needs: see preloadRoute. The first render picks one
 * path for the life of the mount, because changing the component type later would remount the page.
 */
const preloadable = <P extends object>(load: () => Promise<{ default: ComponentType<P> }>) => {
  let loaded: ComponentType<P> | undefined;
  const preload = async () => {
    const module = await load();
    loaded = module.default;
    return module;
  };
  const Lazy = lazy(preload) as unknown as ComponentType<P>;
  const Page = (props: P) => {
    const [Preloaded] = useState(() => loaded);
    if (Preloaded) return <Preloaded {...props} />;
    return (
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Lazy {...props} />
      </Suspense>
    );
  };
  return Object.assign(Page, { preload });
};

const NeighborhoodPage = preloadable(() =>
  import("@/components/NeighborhoodPage").then((m) => ({ default: m.NeighborhoodPage }))
);

/** A route with no page file stops the build here, not on a visitor's screen. */
const lazyPage = (page: string) => {
  const load = pageFiles[`./pages/${page}.tsx`];
  if (!load) throw new Error(`src/data/routes.ts names a page with no file: ${page}`);
  return preloadable(load);
};

const routeFor = ({ path, page, area, addLayout }: SiteRoute) => {
  if (!page) {
    if (!area || !neighborhoods[area]) throw new Error(`src/data/routes.ts has a route with no page or area: ${path}`);
    return { path, element: <NeighborhoodPage data={neighborhoods[area]} />, preload: NeighborhoodPage.preload };
  }
  const Page = lazyPage(page);
  return { path, element: addLayout ? <Layout><Page /></Layout> : <Page />, preload: Page.preload };
};

const routeElements = ROUTES.map(routeFor);

/**
 * Loads a route's page before its first render, so the whole page attaches to the built HTML in one
 * pass. React leaves a Suspense boundary for a later pass, and the cart loading before that pass
 * makes React start a render of the page and abandon it. The head manager registers its tags during
 * render, so an abandoned render leaves them in the head for good, on every later page.
 */
// eslint-disable-next-line react-refresh/only-export-components -- D-MANIFEST reads the route table in this file, and this needs that table.
export const preloadRoute = async (path: string) => {
  await routeElements.find((route) => route.path === path)?.preload();
};

const queryClient = new QueryClient();

/**
 * Only a move to another page resets the scroll. A built page can be read and scrolled before this
 * mounts, and the browser may have restored a position, so the first load is left alone.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const shownPath = useRef(pathname);

  useEffect(() => {
    if (pathname === shownPath.current) return;
    shownPath.current = pathname;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** BrowserRouter in the browser, StaticRouter in the build. */
const App = ({ Router }: { Router: ComponentType<{ children?: ReactNode }> }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClarityLoader />
      <Router>
        <ScrollToTop />
        <Routes>
          {routeElements.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
