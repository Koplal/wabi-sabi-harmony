import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ProductSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import heroImage from "@/assets/package-beachside-manor-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const BeachsideManor = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'beachside-manor',
    name: 'The Beachside Manor',
    price: 1424,
    description: 'Expansive Coastal-Luxe Summer',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Beachside Manor | Summer"
        description="The Beachside Manor: an expansive coastal summer display with multiple wreaths, eight planters, driftwood, and lanterns for larger Victoria homes. $1,424"
        canonical="https://wabisabiservices.ca/seasoning/the-beachside-manor"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal Styling", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Beachside Manor", url: "https://wabisabiservices.ca/seasoning/the-beachside-manor" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal Styling", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Beachside Manor", url: "https://wabisabiservices.ca/seasoning/the-beachside-manor" },
        ]}
      />
      <ProductSchema
        name="The Beachside Manor"
        description="Expansive coastal-luxe summer styling for larger properties, with multiple coastal wreaths, eight statement planters, driftwood sculpture accents, and large hurricane lanterns."
        offers={{
          price: "1424",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          url: "https://wabisabiservices.ca/seasoning/the-beachside-manor",
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
              The Beachside Manor
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Expansive Coastal-Luxe Summer
            </p>
            <p className="text-lg text-muted-foreground">
              Coastal summer styling at the scale of a beach house.
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
                  The Beachside Manor brings coastal styling to larger properties at the scale they deserve. Statement planters, driftwood sculpture, and ambient lighting run across the entrance and grounds, settling the whole front of the house into a relaxed beach-house mood.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It is for larger waterfront and view homes where a small display would simply disappear. We work along the entrance and grounds by hand, layering driftwood, lanterns, and greenery so the scene holds together from the gate through to the front step, all summer long.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,424</div>
                  <p className="text-muted-foreground">Includes professional installation & photography</p>
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

            {/* How We Approach It */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">How We Approach It</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Scaled to the property</h4>
                  <p className="text-muted-foreground">
                    Multiple wreaths, eight planters, and driftwood sculpture sized so the display reads on a larger home.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Across entrance and grounds</h4>
                  <p className="text-muted-foreground">
                    Driftwood, lanterns, and greenery run along the entrance and out into the grounds, not just the door.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">A relaxed beach-house mood</h4>
                  <p className="text-muted-foreground">
                    The pieces are layered to feel easy and lived-in rather than staged or matched too tightly.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Two visits to keep it fresh</h4>
                  <p className="text-muted-foreground">
                    Two maintenance visits over the season keep the plantings and lighting looking their best.
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
                  <p className="text-muted-foreground mb-4">Complete cleanup and disposal</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'beachside-manor-removal', name: 'Post-Season Removal', price: 99, description: 'Complete cleanup and disposal', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Planter Arrangements (2)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend coastal display to additional areas</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'beachside-manor-planters', name: 'Additional Planter Arrangements (2)', price: 75, description: 'Extend coastal display to additional areas', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Ocean breeze scent to complement display</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'beachside-manor-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Ocean breeze scent to complement display', image: heroImage})}>
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

export default BeachsideManor;
