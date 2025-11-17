import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-botanical-estate-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const BotanicalEstate = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'botanical-estate',
    name: 'The Botanical Estate',
    price: 1424,
    description: 'Expansive Spring Garden Aesthetic',
    image: heroImage,
  };

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
              The Botanical Estate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Expansive Spring Garden Aesthetic
            </p>
            <p className="text-lg text-muted-foreground">
              Luxurious botanicals. Grand renewal. Mindfully magnificent.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Creating a Living Garden Sanctuary</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Botanical Estate package transforms larger properties into spring sanctuaries with expansive floral displays and garden artistry. This comprehensive installation combines fresh seasonal flowers, cherry blossom branches, and sculptural elements to create a botanical garden experience at your entrance.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Designed for those who appreciate estate-level presentation and botanical beauty. Each element is carefully curated and placed to create layers of interest and natural elegance that celebrates spring's abundance.
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
                  "Multiple spring wreaths (coordinated collection)",
                  "8 Luxury planter arrangements",
                  "Fresh seasonal flowers throughout",
                  "Cherry blossom branch displays",
                  "Garden sculpture accents (2, premium quality)",
                  "Natural stone & wood elements",
                  "Vintage garden accents",
                  "Butterfly & bird motifs",
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
                    Courtly elegance - refined beauty in every detail
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Iki</h4>
                  <p className="text-muted-foreground">
                    Sophisticated simplicity - originality within refinement
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Mono no aware</h4>
                  <p className="text-muted-foreground">
                    Pathos of things - appreciating fleeting spring beauty
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Wa</h4>
                  <p className="text-muted-foreground">
                    Harmony - perfect balance between elements
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
                  <p className="text-muted-foreground">March 15 - April 10</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Duration</h4>
                  <p className="text-muted-foreground">4-6 weeks with maintenance</p>
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
                    <h4 className="font-semibold">Post-Season Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground">Complete cleanup and eco-friendly disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Planter Arrangements (2)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Extend botanical display to additional areas</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Natural spring scent to complement your display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BotanicalEstate;
