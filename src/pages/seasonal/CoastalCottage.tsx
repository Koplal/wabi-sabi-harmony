import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ProductSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-coastal-cottage-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const CoastalCottage = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'coastal-cottage',
    name: 'The Coastal Cottage',
    price: 474,
    description: 'Breezy Beach-Inspired Summer Welcome',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Coastal Cottage | Summer"
        description="The Coastal Cottage: a breezy summer display of shells, driftwood, and sea glass for your Victoria entrance. $474 CAD, designed and installed."
        canonical="https://wabisabiservices.ca/seasoning/the-coastal-cottage"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal Styling", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Coastal Cottage", url: "https://wabisabiservices.ca/seasoning/the-coastal-cottage" },
        ]}
      />
      <ProductSchema
        name="The Coastal Cottage"
        description="Breezy beach-inspired summer welcome with a nautical wreath, coastal planters, driftwood accents, and sea glass touches in ocean tones."
        offers={{
          price: "474",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          url: "https://wabisabiservices.ca/seasoning/the-coastal-cottage",
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
              The Coastal Cottage
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Breezy Beach-Inspired Summer Welcome
            </p>
            <p className="text-lg text-muted-foreground">
              The calm of a day by the water, brought to your front step.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Day by the Water, at Your Door</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Coastal Cottage is our smallest summer display. A handcrafted wreath of shells and rope, two coastal planters, and weathered driftwood give the entrance a quiet seaside feel, the kind that comes from real materials rather than a theme.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It suits people who want a touch of the coast without turning the porch into a postcard. The sea glass and natural fibres are chosen in ocean tones that read soft against most front doors.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$474</div>
                  <p className="text-muted-foreground">Complete package with installation</p>
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
                  "Nautical wreath with shells & rope (handcrafted)",
                  "2 Coastal planter arrangements",
                  "Driftwood accents (naturally weathered)",
                  "Natural fiber elements (jute, sisal)",
                  "Sea glass touches in ocean tones",
                  "Professional styling",
                  "Seasonal care instructions",
                  "Mid-season refresh consultation"
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
                  <h4 className="font-serif text-xl mb-3">A quiet touch of the coast</h4>
                  <p className="text-muted-foreground">
                    One handcrafted wreath, two planters, and weathered driftwood, enough seaside feel without a theme.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Real materials</h4>
                  <p className="text-muted-foreground">
                    Shells, rope, and driftwood do the work, so the look comes from the materials rather than a costume.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Ocean tones for your door</h4>
                  <p className="text-muted-foreground">
                    Sea glass and natural fibres are chosen in soft ocean shades that read well against most front doors.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Looked in on mid-season</h4>
                  <p className="text-muted-foreground">
                    A refresh consultation partway through keeps the display fresh across the long summer.
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
                  <p className="text-muted-foreground">8-10 weeks with care</p>
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
                    <h4 className="font-semibold">Post-Season Removal</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete cleanup and disposal</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'coastal-cottage-removal',
                      name: 'Post-Season Removal',
                      price: 99,
                      description: 'Complete cleanup and disposal',
                      image: heroImage,
                    })}
                  >
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Planter Display</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extra coastal plants to enhance display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'coastal-cottage-planter',
                      name: 'Additional Planter Display',
                      price: 75,
                      description: 'Extra coastal plants to enhance display',
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
                  <p className="text-muted-foreground mb-4">Ocean-inspired scent to complement display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'coastal-cottage-aromatherapy',
                      name: 'Seasonal Aromatherapy Spray',
                      price: 35,
                      description: 'Ocean-inspired scent to complement display',
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

export default CoastalCottage;
