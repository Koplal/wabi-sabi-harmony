import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen">
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

              <Button asChild size="sm">
                <Link to="/book">Book Now</Link>
              </Button>
            </div>

            <Button asChild variant="sage" size="sm" className="lg:hidden">
              <Link to="/book">Book Now</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-20">{children}</main>

      <footer className="border-t border-border mt-32">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
              <h4 className="font-sans text-xs uppercase tracking-wider mb-4">Contact</h4>
              <a
                href="mailto:hello@wabisabiservices.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                hello@wabisabiservices.com
              </a>
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
