import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import heroImage from "@/assets/package-cozy-cabin-hero.jpg";

const CozyCabin = () => {
  return (
    <Layout>
      <SEO
        title="The Cozy Cabin | Winter Holiday Package"
        description="A warm winter entrance with a fresh evergreen wreath, door swag, and planter greens, styled and installed across Greater Victoria."
        canonical="https://wabisabiservices.ca/seasoning/the-cozy-cabin"
      />
      <ProductSchema
        name="The Cozy Cabin"
        image={heroImage}
        description="A warm winter entrance with a fresh evergreen wreath, door swag, and planter greens, styled and installed on site."
        offers={{
          price: "474",
          priceCurrency: "CAD",
          availability: "https://schema.org/OutOfStock",
          url: "https://wabisabiservices.ca/seasoning/the-cozy-cabin",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Cozy Cabin", url: "https://wabisabiservices.ca/seasoning/the-cozy-cabin" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Cozy Cabin", url: "https://wabisabiservices.ca/seasoning/the-cozy-cabin" },
        ]}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.5,
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              The Cozy Cabin
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Warm Winter Welcome with Natural Elements
            </p>
            <p className="text-lg text-muted-foreground">
              Fresh greens and quiet light for a doorway that feels like coming home.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Embracing Winter's Warmth</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Cozy Cabin is our most pared-back winter display, and it is built entirely from fresh greens: a handmade evergreen wreath, a door swag, two planters, and a few warm candles. Nothing flashy, just the kind of doorway that smells of cedar and looks like someone is home.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It is a natural fit for a smaller home or a single front entrance. We handle the placement and styling, leave you with care instructions, and return mid-season to refresh the fragrance so the greens still feel alive in late December.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$474</div>
                  <p className="text-muted-foreground">Complete package with installation</p>
                  <p className="text-sm font-medium mt-3">2026 season closed. 2027 waitlist open.</p>
                </div>
                <Link to="/contact?interest=seasonal-2027-waitlist">
                  <Button size="lg" className="w-full">
                    Join 2027 waitlist
                  </Button>
                </Link>
              </Card>
            </div>

            {/* What's Included */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Fresh evergreen wreath (24-inch, handcrafted)",
                  "Door swag with natural pinecones",
                  "2 Planter arrangements with fresh greens",
                  "Battery-operated LED candles (4)",
                  "Natural birch log accents",
                  "Professional placement & styling",
                  "Seasonal care instructions",
                  "Mid-season fragrance refresh"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How We Approach It */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">How We Approach It</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">All fresh greens</h4>
                  <p className="text-muted-foreground">
                    A handmade evergreen wreath, a door swag, and two planters, so the doorway smells of cedar from day one.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Sized for a single entrance</h4>
                  <p className="text-muted-foreground">
                    Pared back on purpose, it suits a smaller home or one front door without overwhelming the space.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Warm, quiet light</h4>
                  <p className="text-muted-foreground">
                    Battery LED candles and birch accents add a soft glow rather than a bright display.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Refreshed mid-season</h4>
                  <p className="text-muted-foreground">
                    We return partway through to revive the fragrance so the greens still feel alive in late December.
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation Window</h4>
                  <p className="text-muted-foreground">To be confirmed for 2027</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Duration</h4>
                  <p className="text-muted-foreground">6-8 weeks with care</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Service Area</h4>
                  <p className="text-muted-foreground">Greater Victoria</p>
                </Card>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div>
              <h3 className="font-serif text-3xl mb-8">Optional Add-ons</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Post-Holiday Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground">Complete cleanup and eco-friendly disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional LED Candles (4)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Extend warm lighting throughout display</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Essential-oil aromatherapy spray. Natural winter scent to complement your display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CozyCabin;
