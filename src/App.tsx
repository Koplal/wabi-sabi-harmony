import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { type ComponentType, type ReactNode, useEffect, useState, lazy, Suspense } from "react";
import ClarityLoader from "@/components/Clarity";
import { Layout } from "@/components/Layout";
import NotFound from "./pages/NotFound";
import { neighborhoods } from "@/data/neighborhoods";
import { ROUTES, type SiteRoute } from "@/data/routes";

/** Every page file, each in its own chunk. NotFound is imported above, so it stays in the main bundle. */
const pageFiles = import.meta.glob<{ default: ComponentType }>(["./pages/**/*.tsx", "!./pages/NotFound.tsx"]);

/**
 * A lazy page that can also load ahead of its first render, so it renders with no suspense at all.
 * That is what attaching to built HTML needs: see preloadRoute. The first render picks one component
 * for the life of the mount, because changing the type later would remount the page.
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
    const [Component] = useState(() => loaded ?? Lazy);
    return <Component {...props} />;
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
 * Loads a route's page before its first render. A boundary still waiting on its page cannot take an
 * update, so if the cart loaded first, React would throw away the built HTML and render from nothing.
 */
export const preloadRoute = async (path: string) => {
  await routeElements.find((route) => route.path === path)?.preload();
};

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
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
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Routes>
          {routeElements.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
