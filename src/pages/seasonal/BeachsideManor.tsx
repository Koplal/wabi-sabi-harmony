import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-beachside-manor-hero.jpg";

const BeachsideManor = () => {
  return (
    <Layout>
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
              The Beachside Manor
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Expansive Coastal-Luxe Summer
            </p>
            <p className="text-lg text-muted-foreground">
              Sophisticated coastal. Natural grandeur. Mindfully luxurious.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Creating Coastal Grandeur</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Beachside Manor package transforms larger properties into coastal sanctuaries with expansive displays of nautical elements and natural materials. This comprehensive installation combines statement planters, driftwood sculptures, and ambient lighting to create a sophisticated beach house atmosphere.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Designed for those who appreciate estate-level presentation and coastal luxury. Each element is carefully curated and placed to create layers of interest and natural elegance that celebrates summer's abundance.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,424</div>
                  <p className="text-muted-foreground">Includes professional installation & photography</p>
                </div>
                <Button size="lg" className="w-full mb-4" disabled>
                  Sold Out for 2025
                </Button>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full">
                    Join 2026 Waitlist
                  </Button>
                </Link>
              </Card>
            </div>

            {/* What's Included */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Multiple coastal wreaths (coordinated collection)",
                  "8 Statement summer planters with tropical plants",
                  "Driftwood sculpture accents (large, artistic)",
                  "Natural rope & netting details",
                  "Large hurricane lanterns (4) for ambient lighting",
                  "Beach glass & shell displays throughout",
                  "Nautical rope along railings",
                  "Tropical greenery accents (palm, monstera)",
                  "Full professional styling",
                  "Custom design consultation",
                  "Two maintenance visits included",
                  "Professional photography session"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Principles */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Design Principles</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Miyabi</h4>
                  <p className="text-muted-foreground">
                    Courtly elegance - refined coastal beauty in every detail
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Iki</h4>
                  <p className="text-muted-foreground">
                    Sophisticated simplicity - originality within coastal refinement
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Shibumi</h4>
                  <p className="text-muted-foreground">
                    Simple, subtle beauty - effortless coastal elegance
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Wa</h4>
                  <p className="text-muted-foreground">
                    Harmony - perfect balance between coastal elements
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
                  <p className="text-muted-foreground">June 1 - June 20</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Duration</h4>
                  <p className="text-muted-foreground">8-10 weeks with maintenance</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Service Area</h4>
                  <p className="text-muted-foreground">Victoria & Saanich Peninsula</p>
                </Card>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div>
              <h3 className="font-serif text-3xl mb-8">Optional Add-ons</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Post-Season Removal</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground">Complete cleanup and disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Planter Arrangements (2)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Extend coastal display to additional areas</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Ocean breeze scent to complement display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BeachsideManor;
