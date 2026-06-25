import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Layout } from "@/components/Layout";
import NotFound from "./pages/NotFound";
import { neighborhoods } from "@/data/neighborhoods";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Cleaning = lazy(() => import("./pages/services/Cleaning"));
const Organizing = lazy(() => import("./pages/services/Organizing"));
const Errands = lazy(() => import("./pages/services/Errands"));
const Ritual = lazy(() => import("./pages/Ritual"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Book = lazy(() => import("./pages/Book"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const August2025 = lazy(() => import("./pages/blog/August2025"));
const September2025 = lazy(() => import("./pages/blog/September2025"));
const October2025 = lazy(() => import("./pages/blog/October2025"));
const November2025 = lazy(() => import("./pages/blog/November2025"));
const December2025 = lazy(() => import("./pages/blog/December2025"));
const January2026 = lazy(() => import("./pages/blog/January2026"));
const February2026 = lazy(() => import("./pages/blog/February2026"));
const March2026 = lazy(() => import("./pages/blog/March2026"));
const April2026 = lazy(() => import("./pages/blog/April2026"));
const May2026 = lazy(() => import("./pages/blog/May2026"));
const June2026 = lazy(() => import("./pages/blog/June2026"));
const July2026 = lazy(() => import("./pages/blog/July2026"));
const Seasoning = lazy(() => import("./pages/Seasoning"));
const FallPumpkins = lazy(() => import("./pages/seasonal/FallPumpkins"));
const QuietGrace = lazy(() => import("./pages/seasonal/QuietGrace"));
const AbundantHarmony = lazy(() => import("./pages/seasonal/AbundantHarmony"));
const GatheredAbundance = lazy(() => import("./pages/seasonal/GatheredAbundance"));
const EstateCollection = lazy(() => import("./pages/seasonal/EstateCollection"));
const MindfulMerchant = lazy(() => import("./pages/seasonal/MindfulMerchant"));
const WinterHoliday = lazy(() => import("./pages/seasonal/WinterHoliday"));
const CozyCabin = lazy(() => import("./pages/seasonal/CozyCabin"));
const WinterWonderland = lazy(() => import("./pages/seasonal/WinterWonderland"));
const FestiveEstate = lazy(() => import("./pages/seasonal/FestiveEstate"));
const GrandCelebration = lazy(() => import("./pages/seasonal/GrandCelebration"));
const BusinessWelcome = lazy(() => import("./pages/seasonal/BusinessWelcome"));
const SpringRefresh = lazy(() => import("./pages/seasonal/SpringRefresh"));
const FreshStart = lazy(() => import("./pages/seasonal/FreshStart"));
const GardenGate = lazy(() => import("./pages/seasonal/GardenGate"));
const BotanicalEstate = lazy(() => import("./pages/seasonal/BotanicalEstate"));
const BloomingManor = lazy(() => import("./pages/seasonal/BloomingManor"));
const ProfessionalWelcome = lazy(() => import("./pages/seasonal/ProfessionalWelcome"));
const SummerSerenity = lazy(() => import("./pages/seasonal/SummerSerenity"));
const CoastalCottage = lazy(() => import("./pages/seasonal/CoastalCottage"));
const IslandRetreat = lazy(() => import("./pages/seasonal/IslandRetreat"));
const BeachsideManor = lazy(() => import("./pages/seasonal/BeachsideManor"));
const SeasideEstate = lazy(() => import("./pages/seasonal/SeasideEstate"));
const SummerStorefront = lazy(() => import("./pages/seasonal/SummerStorefront"));
const KeyTakeaways = lazy(() => import("./pages/KeyTakeaways"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ClientAgreement = lazy(() => import("./pages/ClientAgreement"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const AreasIndex = lazy(() => import("./pages/areas/Index"));
const NeighborhoodPage = lazy(() =>
  import("@/components/NeighborhoodPage").then((m) => ({ default: m.NeighborhoodPage }))
);

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
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
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
          <Route path="/key-takeaways" element={<KeyTakeaways />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/client-agreement" element={<ClientAgreement />} />
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/areas" element={<AreasIndex />} />
          {Object.values(neighborhoods).map((n) => (
            <Route key={n.slug} path={`/areas/${n.slug}`} element={<NeighborhoodPage data={n} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
