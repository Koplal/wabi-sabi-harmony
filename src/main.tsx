import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";

createRoot(document.getElementById("root")!).render(
  <>
    <HelmetProvider>
      <CartProvider>
        <App />
        <SpeedInsights />
        <Analytics />
      </CartProvider>
    </HelmetProvider>
  </>
);
