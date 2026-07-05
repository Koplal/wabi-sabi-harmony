import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ProductSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import heroImage from "@/assets/package-professional-welcome-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const ProfessionalWelcome = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'professional-welcome',
    name: 'The Professional Welcome',
    price: 799,
    description: 'Fresh Spring Presentation for Your Business',
    image: heroImage,
  };

  return (
    <Layout>
      <SEO
        title="The Professional Welcome | Spring"
        description="The Professional Welcome: spring styling for Victoria storefronts and lobbies, with weatherproof planters, a commercial wreath, and flexible scheduling."
        canonical="https://wabisabiservices.ca/seasoning/the-professional-welcome"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Professional Welcome", url: "https://wabisabiservices.ca/seasoning/the-professional-welcome" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Professional Welcome", url: "https://wabisabiservices.ca/seasoning/the-professional-welcome" },
        ]}
      />
      <ProductSchema
        name="The Professional Welcome"
        description="Spring presentation for Victoria businesses, with a commercial wreath, four weatherproof planter displays, brand-appropriate styling, and flexible installation."
        offers={{
          price: "799",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          url: "https://wabisabiservices.ca/seasoning/the-professional-welcome",
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
              The Professional Welcome
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Fresh Spring Presentation for Your Business
            </p>
            <p className="text-lg text-muted-foreground">
              Spring styling for the entrance your clients see first.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Considered First Impression</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Professional Welcome is for Victoria businesses where the entrance does real work. A spring display at the door tells clients and customers, before a word is spoken, that you pay attention to the details. We design to your brand colours and the way people actually arrive.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Everything is built to hold up outdoors and to ask little of your staff. We install on a schedule that fits your hours, return mid-season to keep the display fresh, and handle removal when spring gives way to summer.
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
                  "Commercial spring wreath (durable, professional)",
                  "4 Professional planter displays",
                  "Fresh seasonal arrangements",
                  "Brand-appropriate color scheme",
                  "Weatherproof materials",
                  "Low-maintenance design",
                  "Installation & consultation",
                  "Seasonal refresh recommendations",
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
                    <li>• Signals care and attention at the threshold</li>
                    <li>• Colours and materials chosen to match your identity</li>
                    <li>• A presence that sets you apart on a busy street</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">For Your Visitors</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• A warm, current welcome the moment they arrive</li>
                    <li>• A clear sense of the season at your door</li>
                    <li>• Quiet hospitality, no upkeep on your part</li>
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
                  <p className="text-muted-foreground">Full season (4-6 weeks)</p>
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
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'professional-welcome-removal', name: 'Post-Season Removal & Composting', price: 99, description: 'Complete cleanup and eco-friendly disposal', image: heroImage})}>
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
                    onClick={() => addToCart({id: 'professional-welcome-planter', name: 'Additional Planter Display', price: 75, description: 'Extend styling for larger storefronts', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Natural spring scent to complement your display</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'professional-welcome-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Natural spring scent to complement your display', image: heroImage})}>
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

export default ProfessionalWelcome;
