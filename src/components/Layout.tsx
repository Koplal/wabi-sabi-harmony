import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { LocalBusinessSchema, OrganizationSchema } from "./structured-data";

const navigation = [
  { name: "The Ritual", href: "/ritual" },
  { name: "Reviews", href: "/reviews" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const servicesLinks = [
  { name: "All Services", href: "/services" },
  { name: "Cleaning", href: "/services/cleaning" },
  { name: "Organizing", href: "/services/organizing" },
  { name: "Errands", href: "/services/errands" },
  { name: "Seasonal Services", href: "/seasoning" },
];

// Flagship (Tier 1) service areas surfaced in the footer, plus the index hub.
const footerAreas = [
  { name: "Uplands", href: "/areas/uplands" },
  { name: "Oak Bay", href: "/areas/oak-bay" },
  { name: "Rockland", href: "/areas/rockland" },
  { name: "Ten Mile Point", href: "/areas/ten-mile-point" },
  { name: "Cadboro Bay", href: "/areas/cadboro-bay" },
  { name: "North Saanich", href: "/areas/north-saanich" },
  { name: "Willis Point", href: "/areas/willis-point" },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <LocalBusinessSchema />
      <OrganizationSchema />
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="font-serif text-xl tracking-tight hover:opacity-70 transition-opacity">
              Wabi Sabi Services
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link
                to="/about"
                className={`text-sm tracking-wide transition-colors hover:text-primary ${
                  location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                About
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-1 text-sm tracking-wide transition-colors hover:text-primary ${
                  location.pathname.startsWith('/services') ? "text-primary" : "text-muted-foreground"
                }`}>
                  Services
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48 bg-background border-border">
                  {servicesLinks.map((service) => (
                    <DropdownMenuItem key={service.name} asChild>
                      <Link 
                        to={service.href}
                        className={`w-full cursor-pointer ${
                          location.pathname === service.href ? "bg-accent text-accent-foreground" : ""
                        }`}
                      >
                        {service.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/areas"
                className={`text-sm tracking-wide transition-colors hover:text-primary ${
                  location.pathname.startsWith("/areas") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Areas
              </Link>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm tracking-wide transition-colors hover:text-primary ${
                    location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Button asChild size="sm">
                <Link to="/book">Book Now</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Button asChild variant="sage" size="sm">
                <Link to="/book">Book Now</Link>
              </Button>

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Open menu">
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-4/5 max-w-sm overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-xl text-left">Menu</SheetTitle>
                  </SheetHeader>

                  <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                    <Link
                      to="/about"
                      onClick={() => setMobileOpen(false)}
                      className={`py-2 text-base tracking-wide transition-colors hover:text-primary ${
                        location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      About
                    </Link>

                    <div className="py-2">
                      <span className="text-base tracking-wide text-foreground">Services</span>
                      <div className="mt-2 ml-3 flex flex-col gap-1">
                        {servicesLinks.map((service) => (
                          <Link
                            key={service.name}
                            to={service.href}
                            onClick={() => setMobileOpen(false)}
                            className={`py-1.5 text-sm tracking-wide transition-colors hover:text-primary ${
                              location.pathname === service.href
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/areas"
                      onClick={() => setMobileOpen(false)}
                      className={`py-2 text-base tracking-wide transition-colors hover:text-primary ${
                        location.pathname.startsWith("/areas")
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      Areas
                    </Link>

                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`py-2 text-base tracking-wide transition-colors hover:text-primary ${
                          location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}

                    <Link
                      to="/cart"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 py-2 text-base tracking-wide transition-colors hover:text-primary ${
                        location.pathname === "/cart" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                      Cart
                      {itemCount > 0 && (
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Link>

                    <Button asChild size="sm" className="mt-4">
                      <Link to="/book" onClick={() => setMobileOpen(false)}>
                        Book Now
                      </Link>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-20">{children}</main>

      <footer className="border-t border-border mt-32">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="font-serif text-lg mb-4">Wabi Sabi Services</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quiet luxury, immaculately kept.<br />
                Victoria, BC
              </p>
            </div>
            
            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <span className="text-sm text-muted-foreground font-medium">Services</span>
                  <ul className="mt-2 ml-3 space-y-2">
                    {servicesLinks.map((service) => (
                      <li key={service.name}>
                        <Link
                          to={service.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider mb-4">Service Areas</h4>
              <ul className="space-y-2">
                {footerAreas.map((area) => (
                  <li key={area.name}>
                    <Link
                      to={area.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {area.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/areas"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    All Service Areas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-xs uppercase tracking-wider mb-4">Contact</h4>
              <a
                href="mailto:hello@wabisabiservices.ca"
                className="text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                hello@wabisabiservices.ca
              </a>
              <a
                href="tel:+12508965971"
                className="text-sm text-muted-foreground hover:text-primary transition-colors block mt-2"
              >
                (250) 896-5971
              </a>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://www.instagram.com/wabisabiservices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Wabi Sabi Services on Instagram"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://share.google/qpmn3a6VHcDFweao6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Wabi Sabi Services on Google"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Google Reviews
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Wabi Sabi Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
