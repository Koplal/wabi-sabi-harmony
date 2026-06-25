import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-grand-celebration-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const GrandCelebration = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'grand-celebration',
    name: 'The Grand Celebration',
    price: 1924,
    description: 'Spectacular Holiday Display',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Grand Celebration | Winter Holiday Package"
        description="Our most involved holiday installation for estate properties: extensive lighting, garland, and a dedicated project manager with weekly care across Greater Victoria."
        canonical="https://wabisabiservices.ca/seasoning/the-grand-celebration"
      />
      <ProductSchema
        name="The Grand Celebration"
        description="Our most involved holiday installation for estate properties, with extensive lighting and garland, a dedicated project manager, and weekly seasonal care."
        offers={{
          price: "1924",
          priceCurrency: "CAD",
          availability: "https://schema.org/PreOrder",
          url: "https://wabisabiservices.ca/seasoning/the-grand-celebration",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Grand Celebration", url: "https://wabisabiservices.ca/seasoning/the-grand-celebration" },
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
              The Grand Celebration
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Spectacular Holiday Display
            </p>
            <p className="text-lg text-muted-foreground">
              Up to five hundred lights and fifty feet of garland, all kept in hand all season.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Lighting on an Estate Scale</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Grand Celebration is our largest holiday installation, built for properties with long rooflines, mature trees, and grounds that read from the road. Up to five hundred bulbs and fifty feet of garland are run by a professional crew, with a dedicated project manager seeing the whole thing through from the first site visit.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We plan it over two weeks, install across a full day, and return each week to swap tired greens and keep the lighting even. For homes that host through December, it removes every part of the holiday set-up except the welcome.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,924</div>
                  <p className="text-muted-foreground">Complete concierge service with full documentation</p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={() => addToCart(packageItem)}
                >
                  Add to Cart
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
                  "Multiple premium wreaths (3+, custom-designed)",
                  "Extensive garland installation (up to 50 feet)",
                  "12 Luxury planter arrangements",
                  "Professional light installation (up to 500 bulbs)",
                  "Natural & ornamental accents throughout",
                  "Elegant ribbon & bow details",
                  "16 LED candles & lanterns",
                  "Topiary accents (2, premium quality)",
                  "Complete design & installation",
                  "Dedicated project manager",
                  "2-week design consultation process",
                  "Weekly maintenance visits",
                  "Professional photo & video documentation",
                  "Opening ceremony with seasonal blessing",
                  "Pressed botanical keepsake"
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
                  <h4 className="font-serif text-xl mb-3">Lighting that reads from the road</h4>
                  <p className="text-muted-foreground">
                    Up to five hundred bulbs and fifty feet of garland are run to suit long rooflines and mature trees.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Mapped to your property</h4>
                  <p className="text-muted-foreground">
                    We plan the run over two weeks around your grounds, sightlines, and how the house sits from the street.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Installed by a crew</h4>
                  <p className="text-muted-foreground">
                    A professional team handles the heights and the wiring across a full day, with one manager seeing it through.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Even all season</h4>
                  <p className="text-muted-foreground">
                    Weekly visits swap tired greens and keep the lighting consistent through December's hosting.
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">How the Season Unfolds</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Discovery Phase</h4>
                  <p className="text-muted-foreground text-sm">2 weeks before installation</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Design Phase</h4>
                  <p className="text-muted-foreground text-sm">1 week before installation</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <p className="text-muted-foreground text-sm">Full day with 4-person team</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Maintenance</h4>
                  <p className="text-muted-foreground text-sm">Weekly throughout season</p>
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
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'grand-celebration-removal', name: 'Post-Holiday Removal & Composting', price: 99, description: 'Complete cleanup and eco-friendly disposal', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Premium Wreath</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend styling to additional entrances</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'grand-celebration-wreath', name: 'Additional Premium Wreath', price: 75, description: 'Extend styling to additional entrances', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Natural winter scent to complement your display</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'grand-celebration-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Natural winter scent to complement your display', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default GrandCelebration;
