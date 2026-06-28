import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ProductSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-garden-gate-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const GardenGate = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'garden-gate',
    name: 'The Garden Gate',
    price: 924,
    description: 'Abundant Spring Celebration',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Garden Gate | Spring Package"
        description="The Garden Gate: an abundant spring display with a designer wreath, four planters, and garden accents for your Victoria home. $924 CAD, installed."
        canonical="https://wabisabiservices.ca/seasoning/the-garden-gate"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal Styling", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Garden Gate", url: "https://wabisabiservices.ca/seasoning/the-garden-gate" },
        ]}
      />
      <ProductSchema
        name="The Garden Gate"
        description="Abundant spring display celebrating renewal and growth, with a 26-inch floral wreath, four seasonal planters, and natural wood and moss accents."
        offers={{
          price: "924",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          url: "https://wabisabiservices.ca/seasoning/the-garden-gate",
        }}
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
              The Garden Gate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Abundant Spring Celebration
            </p>
            <p className="text-lg text-muted-foreground">
              A generous spring display that deepens and settles as the season unfolds.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Fuller Spring Display</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Garden Gate is a generous step up. A designer wreath, four seasonal planters, and a handful of garden accents give the entrance real presence, with fresh and preserved flowers carrying the look through the season.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It is the package for people who genuinely garden, or wish they had more time to. We build it to settle and shift a little as spring moves on, so it never looks fixed in place.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$924</div>
                  <p className="text-muted-foreground">Includes professional installation & design</p>
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
                  "Lush floral wreath (26-inch, designer quality)",
                  "4 Seasonal planter arrangements",
                  "Fresh & preserved flower accents",
                  "Decorative garden tools (vintage-inspired)",
                  "Bird house or nest elements",
                  "Natural wood & moss details",
                  "Pastel ribbon accents",
                  "Complete design & installation",
                  "Mid-season refresh visit",
                  "Photography session"
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
                  <h4 className="font-serif text-xl mb-3">Real presence at the door</h4>
                  <p className="text-muted-foreground">
                    A designer wreath, four planters, and garden accents give the entrance weight without tipping into busy.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Fresh and preserved together</h4>
                  <p className="text-muted-foreground">
                    Living blooms are paired with preserved flowers so the look carries from early spring to late.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Built to shift a little</h4>
                  <p className="text-muted-foreground">
                    We set it to settle and move as spring goes on, so it never looks fixed in place.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Tended mid-season</h4>
                  <p className="text-muted-foreground">
                    A refresh visit partway through keeps the flowers and accents looking their best.
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
                  <p className="text-muted-foreground">4-6 weeks with refresh</p>
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
                    <h4 className="font-semibold">Post-Season Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'garden-gate-removal',
                      name: 'Post-Season Removal & Composting',
                      price: 99,
                      description: 'Complete cleanup and eco-friendly disposal',
                      image: heroImage,
                    })}
                  >
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Seasonal Wreath</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend styling to additional entrances</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'garden-gate-wreath',
                      name: 'Additional Seasonal Wreath',
                      price: 75,
                      description: 'Extend styling to additional entrances',
                      image: heroImage,
                    })}
                  >
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Natural spring scent to complement your display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'garden-gate-aromatherapy',
                      name: 'Seasonal Aromatherapy Spray',
                      price: 35,
                      description: 'Natural spring scent to complement your display',
                      image: heroImage,
                    })}
                  >
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

export default GardenGate;
