import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import heroImage from "@/assets/package-business-welcome-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const BusinessWelcome = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'business-welcome',
    name: 'The Business Welcome',
    price: 799,
    description: 'Professional Holiday Décor for Your Business',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Business Welcome | Holiday Storefront Styling"
        description="Holiday styling for Victoria business entrances. A commercial-grade wreath, weatherproof planters, and brand-aligned design, installed and maintained for the season."
        canonical="https://wabisabiservices.ca/seasoning/the-business-welcome"
      />
      <ProductSchema
        name="The Business Welcome"
        description="Holiday styling for a Victoria business entrance, with a commercial-grade wreath, weatherproof planters, and brand-aligned design, installed and maintained."
        offers={{
          price: "799",
          priceCurrency: "CAD",
          availability: "https://schema.org/PreOrder",
          url: "https://wabisabiservices.ca/seasoning/the-business-welcome",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Business Welcome", url: "https://wabisabiservices.ca/seasoning/the-business-welcome" },
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
              The Business Welcome
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Professional Holiday Décor for Your Business
            </p>
            <p className="text-lg text-muted-foreground">
              A measured, brand-appropriate welcome for the people who walk through your door.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Quiet Holiday Welcome at the Door</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Business Welcome is the restrained option for professional entrances: law and design offices, clinics, galleries, and showrooms where the holiday note should be present but never loud. We work to your brand's palette and keep the materials weatherproof and low-maintenance.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Installation is arranged around your hours, and we return mid-season to refresh the greens before taking everything down in the new year. The result tells clients you pay attention to detail, without the display ever doing the talking for you.
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
                  "Commercial-grade wreath (36-inch, durable)",
                  "Entrance arrangement with greens",
                  "4 Weatherproof planter displays",
                  "Business-appropriate lighting",
                  "Elegant, understated accents",
                  "Professional installation",
                  "Seasonal consultation",
                  "Brand-aligned design",
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
                    <li>• A measured holiday note that suits a professional setting</li>
                    <li>• Palette and materials chosen to sit with your identity</li>
                    <li>• Attention to detail that clients read without it being said</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">For Your Visitors</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• A welcoming entrance the moment they arrive</li>
                    <li>• A quiet sense of the season at your door</li>
                    <li>• Thoughtful hospitality, with no upkeep on your part</li>
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
                  <p className="text-muted-foreground">Full season (6-8 weeks)</p>
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
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'business-welcome-removal', name: 'Post-Holiday Removal & Composting', price: 99, description: 'Complete cleanup and eco-friendly disposal', image: heroImage})}>
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
                    onClick={() => addToCart({id: 'business-welcome-planter', name: 'Additional Planter Display', price: 75, description: 'Extend styling for larger storefronts', image: heroImage})}>
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
                    onClick={() => addToCart({id: 'business-welcome-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Natural winter scent to complement your display', image: heroImage})}>
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

export default BusinessWelcome;
