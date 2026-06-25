import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ProductSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-summer-storefront-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const SummerStorefront = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'summer-storefront',
    name: 'The Summer Storefront',
    price: 799,
    description: 'Fresh Summer Presentation for Your Business',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Summer Storefront | Commercial Styling | Victoria"
        description="The Summer Storefront: coastal summer styling for Victoria businesses, with weather-resistant planters, a commercial wreath, and flexible scheduling."
        canonical="https://wabisabiservices.ca/seasoning/the-summer-storefront"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal Styling", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Summer Storefront", url: "https://wabisabiservices.ca/seasoning/the-summer-storefront" },
        ]}
      />
      <ProductSchema
        name="The Summer Storefront"
        description="Fresh summer presentation for Victoria businesses, with a commercial wreath, four weather-resistant planter displays, coastal-inspired styling, and flexible installation."
        offers={{
          price: "799",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          url: "https://wabisabiservices.ca/seasoning/the-summer-storefront",
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
              The Summer Storefront
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Fresh Summer Presentation for Your Business
            </p>
            <p className="text-lg text-muted-foreground">
              Coastal summer styling for the front your customers walk through.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Summer Welcome at the Door</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Summer Storefront is for Victoria businesses that want their entrance to feel like the season. Driftwood, sea glass, and breezy planters read as summer the moment customers arrive, styled to your brand colours and the rhythm of your foot traffic.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The materials are chosen to take coastal sun and wind without fading, and to ask nothing of your team. We schedule installation around your hours, return mid-season for a refresh, and take everything down when the season turns.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$799</div>
                  <p className="text-muted-foreground">Commercial package with consultation</p>
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
                  "Commercial summer wreath (durable, professional)",
                  "4 Professional planter displays",
                  "Seasonal tropical elements",
                  "Weather-resistant materials",
                  "Brand-appropriate styling with coastal touches",
                  "Low-maintenance design",
                  "Installation & consultation",
                  "Summer refresh recommendations",
                  "Flexible installation scheduling",
                  "Mid-season maintenance visit",
                  "Complete removal & cleanup"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What It Does for Your Space */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">What It Does for Your Space</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">For Your Brand</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• A storefront that feels current and cared for</li>
                    <li>• Coastal styling matched to your identity</li>
                    <li>• A look that holds up to a summer of sun and salt air</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">For Your Visitors</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• An easy, summery welcome at the entrance</li>
                    <li>• The feel of the season the moment they arrive</li>
                    <li>• Quiet hospitality with no upkeep on your part</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <p className="text-muted-foreground">Flexible scheduling including after-hours</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Duration</h4>
                  <p className="text-muted-foreground">Full season (8-10 weeks)</p>
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
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'summer-storefront-removal', name: 'Post-Season Removal', price: 99, description: 'Complete cleanup and disposal', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Planter Display</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend styling for larger storefronts</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'summer-storefront-planter', name: 'Additional Planter Display', price: 75, description: 'Extend styling for larger storefronts', image: heroImage})}>
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
                    onClick={() => addToCart({id: 'summer-storefront-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Ocean breeze scent to complement display', image: heroImage})}>
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

export default SummerStorefront;
