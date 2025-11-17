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
import QuietGrace from "./pages/seasonal/QuietGrace";
import AbundantHarmony from "./pages/seasonal/AbundantHarmony";
import GatheredAbundance from "./pages/seasonal/GatheredAbundance";
import EstateCollection from "./pages/seasonal/EstateCollection";
import MindfulMerchant from "./pages/seasonal/MindfulMerchant";
import WinterHoliday from "./pages/seasonal/WinterHoliday";
import CozyCabin from "./pages/seasonal/CozyCabin";
import WinterWonderland from "./pages/seasonal/WinterWonderland";
import FestiveEstate from "./pages/seasonal/FestiveEstate";
import GrandCelebration from "./pages/seasonal/GrandCelebration";
import BusinessWelcome from "./pages/seasonal/BusinessWelcome";
import SpringRefresh from "./pages/seasonal/SpringRefresh";
import FreshStart from "./pages/seasonal/FreshStart";
import GardenGate from "./pages/seasonal/GardenGate";
import BotanicalEstate from "./pages/seasonal/BotanicalEstate";
import BloomingManor from "./pages/seasonal/BloomingManor";
import ProfessionalWelcome from "./pages/seasonal/ProfessionalWelcome";
import SummerSerenity from "./pages/seasonal/SummerSerenity";
import CoastalCottage from "./pages/seasonal/CoastalCottage";
import IslandRetreat from "./pages/seasonal/IslandRetreat";
import BeachsideManor from "./pages/seasonal/BeachsideManor";
import SeasideEstate from "./pages/seasonal/SeasideEstate";
import SummerStorefront from "./pages/seasonal/SummerStorefront";
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
          <Route path="/seasoning/quiet-grace" element={<QuietGrace />} />
          <Route path="/seasoning/abundant-harmony" element={<AbundantHarmony />} />
          <Route path="/seasoning/gathered-abundance" element={<GatheredAbundance />} />
          <Route path="/seasoning/estate-collection" element={<EstateCollection />} />
          <Route path="/seasoning/mindful-merchant" element={<MindfulMerchant />} />
          <Route path="/seasoning/winter-holiday" element={<WinterHoliday />} />
          <Route path="/seasoning/the-cozy-cabin" element={<CozyCabin />} />
          <Route path="/seasoning/the-winter-wonderland" element={<WinterWonderland />} />
          <Route path="/seasoning/the-festive-estate" element={<FestiveEstate />} />
          <Route path="/seasoning/the-grand-celebration" element={<GrandCelebration />} />
          <Route path="/seasoning/the-business-welcome" element={<BusinessWelcome />} />
          <Route path="/seasoning/spring-refresh" element={<SpringRefresh />} />
          <Route path="/seasoning/the-fresh-start" element={<FreshStart />} />
          <Route path="/seasoning/the-garden-gate" element={<GardenGate />} />
          <Route path="/seasoning/the-botanical-estate" element={<BotanicalEstate />} />
          <Route path="/seasoning/the-blooming-manor" element={<BloomingManor />} />
          <Route path="/seasoning/the-professional-welcome" element={<ProfessionalWelcome />} />
          <Route path="/seasoning/summer-serenity" element={<SummerSerenity />} />
          <Route path="/seasoning/the-coastal-cottage" element={<CoastalCottage />} />
          <Route path="/seasoning/the-island-retreat" element={<IslandRetreat />} />
          <Route path="/seasoning/the-beachside-manor" element={<BeachsideManor />} />
          <Route path="/seasoning/the-seaside-estate" element={<SeasideEstate />} />
          <Route path="/seasoning/the-summer-storefront" element={<SummerStorefront />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/seasoning/summer-serenity" element={<SummerSerenity />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
