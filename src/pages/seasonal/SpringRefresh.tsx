import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import servicesHero from "@/assets/services-hero.jpg";

const packages = [
  {
    name: "The Fresh Start",
    price: 474,
    basePrice: 349,
    decoratingFee: 125,
    popular: true,
    description: "Light and airy spring refresh with delicate floral touches.",
    includes: [
      "Fresh spring wreath with blooms",
      "2 Planter arrangements with seasonal flowers",
      "Decorative watering can accent",
      "Natural moss & twig elements",
      "Garden-inspired styling",
      "Professional placement"
    ]
  },
  {
    name: "The Garden Gate",
    price: 924,
    basePrice: 799,
    decoratingFee: 125,
    description: "Abundant spring display celebrating renewal and growth.",
    includes: [
      "Lush floral wreath (26-inch)",
      "4 Seasonal planter arrangements",
      "Fresh or preserved flower accents",
      "Decorative garden tools",
      "Bird house or nest elements",
      "Natural wood & moss details",
      "Pastel ribbon accents",
      "Complete design & installation"
    ]
  },
  {
    name: "The Botanical Estate",
    price: 1424,
    basePrice: 1299,
    decoratingFee: 125,
    description: "Expansive spring garden aesthetic for larger properties.",
    includes: [
      "Multiple spring wreaths",
      "8 Luxury planter arrangements",
      "Fresh seasonal flowers throughout",
      "Cherry blossom branch displays",
      "Garden sculpture accents (2)",
      "Natural stone & wood elements",
      "Vintage garden accents",
      "Butterfly & bird motifs",
      "Full professional styling"
    ]
  },
  {
    name: "The Blooming Manor",
    price: 1924,
    basePrice: 1799,
    decoratingFee: 125,
    description: "Grand spring transformation with abundant floral artistry.",
    includes: [
      "Premium floral wreath collection (3+)",
      "12 Statement planter arrangements",
      "Abundant fresh & preserved flowers",
      "Decorative trellis or arbor styling",
      "Vintage garden furniture accents",
      "Natural moss & stone pathways",
      "Water feature styling (if applicable)",
      "Garden lanterns & lighting",
      "Editorial-level installation"
    ]
  },
  {
    name: "The Professional Welcome",
    price: 799,
    basePrice: 799,
    decoratingFee: 0,
    business: true,
    description: "Fresh, professional spring presentation for your business.",
    includes: [
      "Commercial spring wreath",
      "4 Professional planter displays",
      "Fresh seasonal arrangements",
      "Brand-appropriate color scheme",
      "Weatherproof materials",
      "Low-maintenance design",
      "Installation & consultation",
      "Seasonal refresh recommendations"
    ]
  }
];

const SpringRefresh = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${servicesHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              Spring Refresh Packages
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Celebrate renewal with fresh florals and garden-inspired touches
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Available: March through May
            </Badge>
          </div>
        </section>

        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome spring with delicate blooms, fresh greenery, and garden-inspired arrangements that 
              capture the season's promise of renewal and growth.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <Card key={pkg.name} className="overflow-hidden flex flex-col relative">
                  {pkg.popular && (
                    <Badge className="absolute top-4 left-4 z-10 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  {pkg.business && (
                    <Badge variant="secondary" className="absolute top-4 left-4 z-10">
                      Business Package
                    </Badge>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {pkg.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl">${pkg.price}</span>
                        <span className="text-sm text-muted-foreground">CAD</span>
                      </div>
                      {pkg.decoratingFee > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Includes ${pkg.decoratingFee} decorating fee
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 mb-6 flex-grow">
                      <p className="text-sm font-semibold mb-3">What's Included:</p>
                      {pkg.includes.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/contact">Book Package</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl text-center mb-8">Spring Design Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Fresh & Light</h3>
                <p className="text-muted-foreground text-sm">
                  Airy arrangements with pastel tones and delicate textures that celebrate new beginnings.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Natural Beauty</h3>
                <p className="text-muted-foreground text-sm">
                  Seasonal flowers and garden elements that bring Victoria's spring beauty to your door.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Sustainable Choices</h3>
                <p className="text-muted-foreground text-sm">
                  Locally-sourced materials and eco-friendly designs that respect our environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6">Celebrate Spring's Arrival</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let us create a fresh, inspiring display that welcomes the season of renewal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Request Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/seasoning">View All Seasonal Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SpringRefresh;
