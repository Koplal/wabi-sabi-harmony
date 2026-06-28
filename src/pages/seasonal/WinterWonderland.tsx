import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-winter-wonderland-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const WinterWonderland = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'winter-wonderland',
    name: 'The Winter Wonderland',
    price: 924,
    description: 'Elegant Frost-Inspired Sophistication',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Winter Wonderland | Winter Holiday Package"
        description="A frost-inspired holiday entrance with premium evergreens, frosted branches, and warm lighting, installed across Greater Victoria."
        canonical="https://wabisabiservices.ca/seasoning/the-winter-wonderland"
      />
      <ProductSchema
        name="The Winter Wonderland"
        description="A frost-inspired holiday entrance with premium evergreens, frosted branches, and warm lighting, installed on site."
        offers={{
          price: "924",
          priceCurrency: "CAD",
          availability: "https://schema.org/PreOrder",
          url: "https://wabisabiservices.ca/seasoning/the-winter-wonderland",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Winter Wonderland", url: "https://wabisabiservices.ca/seasoning/the-winter-wonderland" },
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
              The Winter Wonderland
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Elegant Frost-Inspired Sophistication
            </p>
            <p className="text-lg text-muted-foreground">
              An entrance that shifts gently from daylight to a soft evening glow.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Where Frost Meets Sophistication</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Winter Wonderland leans cool and quiet. Premium evergreens, frosted branches, and a warm string of lights give the entrance a pale, wintry palette that holds up against grey afternoons and earns its keep once the light goes down.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every piece is placed to read as one display rather than a row of pieces, and we set the lighting in the evening so we can see exactly how it lands after dark. A mid-season visit keeps the greens fresh through the holidays.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$924</div>
                  <p className="text-muted-foreground">Includes professional installation & lighting</p>
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
                  "Premium evergreen wreath (30-inch, designer quality)",
                  "Matching door swag arrangement",
                  "4 Planter arrangements with fresh greens",
                  "Frosted branch accents (hand-selected)",
                  "6 Battery-operated LED candles",
                  "White lights for planters (200 count, warm glow)",
                  "Pinecone & berry accents",
                  "Complete installation & design",
                  "Evening lighting preview",
                  "Mid-season refresh visit"
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
                  <h4 className="font-serif text-xl mb-3">A cool, pale palette</h4>
                  <p className="text-muted-foreground">
                    Premium evergreens and frosted branches give the entrance a wintry tone that holds up on grey afternoons.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Set as one display</h4>
                  <p className="text-muted-foreground">
                    Wreath, swag, and planters are placed to read together rather than as a row of separate pieces.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Tuned after dark</h4>
                  <p className="text-muted-foreground">
                    We set the lighting in the evening so we can see exactly how it lands once the light goes down.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Refreshed mid-season</h4>
                  <p className="text-muted-foreground">
                    A return visit keeps the greens fresh through the holidays so the entrance stays at its best.
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
                  <p className="text-muted-foreground">November 20 - December 5</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Duration</h4>
                  <p className="text-muted-foreground">6-8 weeks with refresh</p>
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
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'winter-wonderland-removal',
                      name: 'Post-Holiday Removal & Composting',
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
                    <h4 className="font-semibold">Additional Lighting Strand (100)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend illumination throughout display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'winter-wonderland-lighting',
                      name: 'Additional Lighting Strand (100)',
                      price: 75,
                      description: 'Extend illumination throughout display',
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
                  <p className="text-muted-foreground mb-4">Natural winter scent to complement your display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'winter-wonderland-aromatherapy',
                      name: 'Seasonal Aromatherapy Spray',
                      price: 35,
                      description: 'Natural winter scent to complement your display',
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

export default WinterWonderland;
