import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { type ComponentType, useEffect, lazy, Suspense } from "react";
import ClarityLoader from "@/components/Clarity";
import { Layout } from "@/components/Layout";
import NotFound from "./pages/NotFound";
import { neighborhoods } from "@/data/neighborhoods";
import { ROUTES, type SiteRoute } from "@/data/routes";

/** Every page file, each in its own chunk. NotFound is imported above, so it stays in the main bundle. */
const pageFiles = import.meta.glob<{ default: ComponentType }>(["./pages/**/*.tsx", "!./pages/NotFound.tsx"]);
const NeighborhoodPage = lazy(() =>
  import("@/components/NeighborhoodPage").then((m) => ({ default: m.NeighborhoodPage }))
);

/** A route with no page file stops the build here, not on a visitor's screen. */
const lazyPage = (page: string) => {
  const load = pageFiles[`./pages/${page}.tsx`];
  if (!load) throw new Error(`src/data/routes.ts names a page with no file: ${page}`);
  return lazy(load);
};

const elementFor = ({ page, area, addLayout }: SiteRoute) => {
  if (!page) {
    if (!area || !neighborhoods[area]) throw new Error(`src/data/routes.ts has a route with no page or area: ${area}`);
    return <NeighborhoodPage data={neighborhoods[area]} />;
  }
  const Page = lazyPage(page);
  return addLayout ? <Layout><Page /></Layout> : <Page />;
};

const routeElements = ROUTES.map((route) => ({ path: route.path, element: elementFor(route) }));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClarityLoader />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Routes>
          {routeElements.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
