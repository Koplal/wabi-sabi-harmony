import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-festive-estate-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const FestiveEstate = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'festive-estate',
    name: 'The Festive Estate',
    price: 1424,
    description: 'Grand Holiday Display for Larger Homes',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Festive Estate | Winter Holiday Package"
        description="A holiday display for multi-level entries and wide facades: coordinated wreaths, railing garland, and planters across Victoria and the Saanich Peninsula."
        canonical="https://wabisabiservices.ca/seasoning/the-festive-estate"
      />
      <ProductSchema
        name="The Festive Estate"
        description="A holiday display for multi-level entries and wide facades, with coordinated wreaths, railing garland, and abundant planter arrangements."
        offers={{
          price: "1424",
          priceCurrency: "CAD",
          availability: "https://schema.org/PreOrder",
          url: "https://wabisabiservices.ca/seasoning/the-festive-estate",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Festive Estate", url: "https://wabisabiservices.ca/seasoning/the-festive-estate" },
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
              The Festive Estate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Grand Holiday Display for Larger Homes
            </p>
            <p className="text-lg text-muted-foreground">
              Wreaths, garland, and greenery that carry across a wide facade.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Holiday Front for a Larger Home</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Festive Estate suits homes with multi-level entries and wide facades. Premium wreaths, railing garland, and generous planter arrangements are worked together so the whole front of the house reads as a single, considered holiday scene.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It is built for homes that entertain through December. We design it with you, install across a day, and return twice through the season to keep the greens fresh and the lighting even, so the front of the house looks as good for your last party as it did for your first.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,424</div>
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
                  "Premium wreath collection (multiple sizes, coordinated)",
                  "Garland for railings (up to 25 feet, fresh greens)",
                  "8 Planter arrangements with greens",
                  "Illuminated arrangements with lights",
                  "Natural pinecone & ornament accents",
                  "Festive bows in muted metallics",
                  "12 Battery-operated candles",
                  "Full professional styling",
                  "Custom design consultation",
                  "Two maintenance visits included",
                  "Professional photography session",
                  "Seasonal blessing ceremony"
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
                  <h4 className="font-serif text-xl mb-3">Sized to a wide facade</h4>
                  <p className="text-muted-foreground">
                    Coordinated wreaths, railing garland, and eight planters work together across multi-level entries.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Designed with you</h4>
                  <p className="text-muted-foreground">
                    We plan the scheme around your home before installing it across a single day.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Reads as one scene</h4>
                  <p className="text-muted-foreground">
                    Greens, lighting, and muted metallic bows are balanced so the whole front of the house holds together.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Kept through December</h4>
                  <p className="text-muted-foreground">
                    Two return visits refresh the greens and even the lighting, so it looks as good for your last party as your first.
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
                  <p className="text-muted-foreground">6-8 weeks with maintenance</p>
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
                    <h4 className="font-semibold">Post-Holiday Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'festive-estate-removal',
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
                    <h4 className="font-semibold">Additional Garland (10 feet)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend garland coverage for larger spaces</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'festive-estate-garland',
                      name: 'Additional Garland (10 feet)',
                      price: 75,
                      description: 'Extend garland coverage for larger spaces',
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
                      id: 'festive-estate-aromatherapy',
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

export default FestiveEstate;
