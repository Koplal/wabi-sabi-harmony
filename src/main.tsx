import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";

createRoot(document.getElementById("root")!).render(
  <>
    <CartProvider>
      <App />
      <SpeedInsights />
    </CartProvider>
  </>
);
