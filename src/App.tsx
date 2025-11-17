import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Cleaning from "./pages/services/Cleaning";
import Organizing from "./pages/services/Organizing";
import Errands from "./pages/services/Errands";
import Ritual from "./pages/Ritual";
import Reviews from "./pages/Reviews";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import August2025 from "./pages/blog/August2025";
import September2025 from "./pages/blog/September2025";
import October2025 from "./pages/blog/October2025";
import November2025 from "./pages/blog/November2025";
import December2025 from "./pages/blog/December2025";
import January2026 from "./pages/blog/January2026";
import February2026 from "./pages/blog/February2026";
import March2026 from "./pages/blog/March2026";
import April2026 from "./pages/blog/April2026";
import May2026 from "./pages/blog/May2026";
import June2026 from "./pages/blog/June2026";
import July2026 from "./pages/blog/July2026";
import Seasoning from "./pages/Seasoning";
import FallPumpkins from "./pages/seasonal/FallPumpkins";
import WinterHoliday from "./pages/seasonal/WinterHoliday";
import SpringRefresh from "./pages/seasonal/SpringRefresh";
import SummerSerenity from "./pages/seasonal/SummerSerenity";
import NotFound from "./pages/NotFound";

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
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/cleaning" element={<Cleaning />} />
          <Route path="/services/organizing" element={<Organizing />} />
          <Route path="/services/errands" element={<Errands />} />
          <Route path="/ritual" element={<Ritual />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Book />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/august-2025" element={<August2025 />} />
          <Route path="/blog/september-2025" element={<September2025 />} />
          <Route path="/blog/october-2025" element={<October2025 />} />
          <Route path="/blog/november-2025" element={<November2025 />} />
          <Route path="/blog/december-2025" element={<December2025 />} />
          <Route path="/blog/january-2026" element={<January2026 />} />
          <Route path="/blog/february-2026" element={<February2026 />} />
          <Route path="/blog/march-2026" element={<March2026 />} />
          <Route path="/blog/april-2026" element={<April2026 />} />
          <Route path="/blog/may-2026" element={<May2026 />} />
          <Route path="/blog/june-2026" element={<June2026 />} />
          <Route path="/blog/july-2026" element={<July2026 />} />
          <Route path="/seasoning" element={<Seasoning />} />
          <Route path="/seasoning/fall-pumpkins" element={<FallPumpkins />} />
          <Route path="/seasoning/winter-holiday" element={<WinterHoliday />} />
          <Route path="/seasoning/spring-refresh" element={<SpringRefresh />} />
          <Route path="/seasoning/summer-serenity" element={<SummerSerenity />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
