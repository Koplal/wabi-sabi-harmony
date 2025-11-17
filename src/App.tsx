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
import August from "./pages/blog/August";
import September from "./pages/blog/September";
import October from "./pages/blog/October";
import November from "./pages/blog/November";
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
          <Route path="/blog/august" element={<August />} />
          <Route path="/blog/september" element={<September />} />
          <Route path="/blog/october" element={<October />} />
          <Route path="/blog/november" element={<November />} />
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
