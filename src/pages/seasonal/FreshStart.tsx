import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ProductSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-fresh-start-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const FreshStart = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'fresh-start',
    name: 'The Fresh Start',
    price: 474,
    description: 'Light and Airy Spring Refresh',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Fresh Start | Spring Styling Package | Victoria"
        description="The Fresh Start: a light spring display of handcrafted blooms, seasonal planters, and natural textures for your Victoria entrance. $474 CAD, designed and installed."
        canonical="https://wabisabiservices.ca/seasoning/the-fresh-start"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal Styling", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Fresh Start", url: "https://wabisabiservices.ca/seasoning/the-fresh-start" },
        ]}
      />
      <ProductSchema
        name="The Fresh Start"
        description="Light and airy spring refresh with delicate floral touches, seasonal planters, and natural moss and twig elements, professionally placed."
        offers={{
          price: "474",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          url: "https://wabisabiservices.ca/seasoning/the-fresh-start",
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
              The Fresh Start
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Light and Airy Spring Refresh
            </p>
            <p className="text-lg text-muted-foreground">
              A quiet welcome for the season, composed in soft blooms and natural texture.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Light Welcome for Spring</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Fresh Start is our smallest spring display, and the easiest to live with. A handcrafted wreath, two seasonal planters, and a few natural touches give the front of the house a soft lift after winter, without crowding the entrance.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It suits people who would rather have one well-made arrangement than a lot of decoration. We choose the blooms and textures to sit comfortably with your door and the colour of the house.
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
                  "Fresh spring wreath with blooms (handcrafted)",
                  "2 Planter arrangements with seasonal flowers",
                  "Decorative vintage watering can accent",
                  "Natural moss & twig elements",
                  "Garden-inspired styling",
                  "Professional placement",
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

            {/* Design Principles */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Design Principles</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Sakura</h4>
                  <p className="text-muted-foreground">
                    Cherry blossom spirit - fleeting beauty and renewal
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Kanso</h4>
                  <p className="text-muted-foreground">
                    Simplicity - elimination of clutter, focus on essentials
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Shizen</h4>
                  <p className="text-muted-foreground">
                    Naturalness - celebrating organic forms and textures
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Seijaku</h4>
                  <p className="text-muted-foreground">
                    Tranquility - peaceful, calm presence
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
                  <p className="text-muted-foreground">4-6 weeks with care</p>
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
                      id: 'fresh-start-removal',
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
                    <h4 className="font-semibold">Additional Planter Display</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extra seasonal flowers to enhance display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'fresh-start-planter',
                      name: 'Additional Planter Display',
                      price: 75,
                      description: 'Extra seasonal flowers to enhance display',
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
                      id: 'fresh-start-aromatherapy',
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

export default FreshStart;
