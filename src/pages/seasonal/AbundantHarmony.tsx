import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-abundant-harmony-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const AbundantHarmony = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'abundant-harmony',
    name: 'The Abundant Harmony',
    price: 899,
    description: "Celebrate Autumn's Generous Spirit",
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Abundant Harmony | Autumn Pumpkin Package"
        description="A generous autumn pumpkin display for larger porches and stepped entries. Heritage varieties, botanicals, and full installation across Greater Victoria."
        canonical="https://wabisabiservices.ca/seasoning/abundant-harmony"
      />
      <ProductSchema
        name="The Abundant Harmony"
        description="A generous autumn pumpkin display for larger porches and stepped entries, with heritage varieties, seasonal botanicals, and full installation."
        offers={{
          price: "899",
          priceCurrency: "CAD",
          availability: "https://schema.org/PreOrder",
          url: "https://wabisabiservices.ca/seasoning/abundant-harmony",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Abundant Harmony", url: "https://wabisabiservices.ca/seasoning/abundant-harmony" },
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
              The Abundant Harmony
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Celebrate Autumn's Generous Spirit
            </p>
            <p className="text-lg text-muted-foreground">
              Generous enough to greet your guests, quiet enough to feel at ease.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Generous, Without the Crowd</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Abundant Harmony sits in the middle of our autumn range, and it is the package most people land on. There is enough here to fill a larger porch or a set of front steps, but the pieces are chosen and spaced so the result still feels calm rather than crowded.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We choose each pumpkin for its character, including the lopsided ones, then arrange and install the whole display and check in mid-season to keep it looking its best. It is a good fit for homes that entertain through the autumn and want the entrance to match.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$899</div>
                  <p className="text-muted-foreground">Includes professional styling & installation</p>
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
                  "8 Large Heritage Pumpkins",
                  "8 Medium Heirloom Pumpkins",
                  "6 White Ghost Pumpkins",
                  "12 Small Pie Pumpkins",
                  "12 Specialty Pumpkins (unique textures and heritage varieties)",
                  "2 Locally-sourced hay bales (organic when available)",
                  "Ornamental gourds and seasonal botanicals",
                  "Eucalyptus or sage bundles for natural aromatherapy",
                  "Professional design and full installation",
                  "Blessing ceremony for your autumn display",
                  "Mid-season refresh check-in"
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
                  <h4 className="font-serif text-xl mb-3">Full, not crowded</h4>
                  <p className="text-muted-foreground">
                    Enough to fill a larger porch or set of steps, with pieces spaced so the result still reads as calm.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Chosen for character</h4>
                  <p className="text-muted-foreground">
                    We pick each pumpkin for its shape and colour, including the lopsided ones, rather than matching a set.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Layered with botanicals</h4>
                  <p className="text-muted-foreground">
                    Hay bales, ornamental gourds, and sage or eucalyptus bundles round out the display with seasonal texture.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Checked mid-season</h4>
                  <p className="text-muted-foreground">
                    We return partway through to refresh anything past its prime, so the entrance holds up for guests.
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Delivery Window</h4>
                  <p className="text-muted-foreground">September 25 - October 10</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Longevity</h4>
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
                    <h4 className="font-semibold">Post-Halloween Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'abundant-harmony-removal', name: 'Post-Halloween Removal & Composting', price: 99, description: 'Complete cleanup and eco-friendly disposal', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">24 Mini Pumpkins</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Additional miniature pumpkins for enhanced detail</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'abundant-harmony-pumpkins', name: '24 Mini Pumpkins', price: 75, description: 'Additional miniature pumpkins for enhanced detail', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Natural autumn scent to complement your display</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'abundant-harmony-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Natural autumn scent to complement your display', image: heroImage})}>
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

export default AbundantHarmony;
