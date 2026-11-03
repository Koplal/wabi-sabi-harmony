import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import heroImage from "@/assets/package-estate-collection-hero.jpg";

const EstateCollection = () => {
  return (
    <Layout>
      <SEO
        title="The Estate Collection | Autumn Pumpkin Package"
        description="Our most involved pumpkin installation: rare specimen varieties, a dedicated project manager, and professional photo and video for Greater Victoria estates."
        canonical="https://wabisabiservices.ca/seasoning/estate-collection"
      />
      <ProductSchema
        name="The Estate Collection"
        image={heroImage}
        description="Our most involved autumn pumpkin installation, with rare specimen varieties, a dedicated project manager, and professional photo and video."
        offers={{
          price: "1899",
          priceCurrency: "CAD",
          availability: "https://schema.org/OutOfStock",
          url: "https://wabisabiservices.ca/seasoning/estate-collection",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Estate Collection", url: "https://wabisabiservices.ca/seasoning/estate-collection" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "The Estate Collection", url: "https://wabisabiservices.ca/seasoning/estate-collection" },
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
              The Estate Collection
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Where Grandeur Meets Grace
            </p>
            <p className="text-lg text-muted-foreground">
              Planned over weeks and installed in a day.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Display Built Over Weeks</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Estate Collection is the most involved autumn display we offer. It begins two weeks before installation, with a walk of your grounds and a plan drawn for your specific sightlines, light, and architecture. On the day itself, a four-person team works through to dusk so the result reads as one composition rather than a set of arrangements.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  It suits owners who would rather oversee nothing and simply walk up to a finished, well-kept entrance each morning.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,899</div>
                  <p className="text-muted-foreground">Complete concierge service with full documentation</p>
                  <p className="text-sm font-medium mt-3">2026 season closed. 2027 waitlist open.</p>
                </div>
                <Link to="/contact?interest=seasonal-2027-waitlist">
                  <Button size="lg" className="w-full">
                    Join 2027 waitlist
                  </Button>
                </Link>
              </Card>
            </div>

            {/* What's Included */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "3 Museum-Grade Grand Prize Pumpkins",
                  "10 Large Heritage Pumpkins",
                  "16 Antique White Pumpkins",
                  "20+ Rare Specimen Pumpkins",
                  "24 Miniature Pumpkins",
                  "3 Premium hay bales",
                  "Dedicated project manager",
                  "Professional photo & video"
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
                  <h4 className="font-serif text-xl mb-3">Rare specimens at the centre</h4>
                  <p className="text-muted-foreground">
                    Competition-grade and heritage pumpkins anchor the display, with unusual varieties chosen so no two entrances look alike.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Built for your sightlines</h4>
                  <p className="text-muted-foreground">
                    The plan is drawn to your grounds, light, and architecture rather than dropped from a template.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Layered, not piled</h4>
                  <p className="text-muted-foreground">
                    Large and small pieces are set in scale so they read together.
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">How the Season Unfolds</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Discovery Phase</h4>
                  <p className="text-muted-foreground text-sm">2 weeks before installation</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Design Phase</h4>
                  <p className="text-muted-foreground text-sm">1 week before installation</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <p className="text-muted-foreground text-sm">Full day with 4-person team</p>
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
                  <p className="text-muted-foreground">Complete cleanup and eco-friendly disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">24 Mini Pumpkins</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Additional miniature pumpkins for enhanced detail</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Essential-oil aromatherapy spray. Natural autumn scent to complement your display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default EstateCollection;
