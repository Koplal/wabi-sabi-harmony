import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import servicesHero from "@/assets/services-hero.jpg";

const packages = [
  {
    name: "The Cozy Cabin",
    price: 474,
    basePrice: 349,
    decoratingFee: 125,
    popular: true,
    description: "Warm and inviting winter welcome with natural evergreen elements.",
    includes: [
      "Fresh evergreen wreath (24-inch)",
      "Door swag with natural pinecones",
      "2 Planter arrangements with greens",
      "Battery-operated LED candles (4)",
      "Natural birch log accents",
      "Professional placement & styling"
    ]
  },
  {
    name: "The Winter Wonderland",
    price: 924,
    basePrice: 799,
    decoratingFee: 125,
    description: "Elegant frost-inspired display with sophisticated touches.",
    includes: [
      "Premium evergreen wreath (30-inch)",
      "Matching door swag arrangement",
      "4 Planter arrangements with greens",
      "Frosted branch accents",
      "6 Battery-operated LED candles",
      "White lights for planters (200 count)",
      "Pinecone & berry accents",
      "Complete installation & design"
    ]
  },
  {
    name: "The Festive Estate",
    price: 1424,
    basePrice: 1299,
    decoratingFee: 125,
    description: "Grand holiday display for larger homes and multi-level entries.",
    includes: [
      "Premium wreath collection (multiple sizes)",
      "Garland for railings (up to 25 feet)",
      "8 Planter arrangements with greens",
      "Illuminated arrangements with lights",
      "Natural pinecone & ornament accents",
      "Festive bows in muted metallics",
      "12 Battery-operated candles",
      "Full professional styling"
    ]
  },
  {
    name: "The Grand Celebration",
    price: 1924,
    basePrice: 1799,
    decoratingFee: 125,
    description: "Spectacular holiday transformation for estate-style properties.",
    includes: [
      "Multiple premium wreaths (3+)",
      "Extensive garland installation (up to 50 feet)",
      "12 Luxury planter arrangements",
      "Professional light installation (up to 500 bulbs)",
      "Natural & ornamental accents throughout",
      "Elegant ribbon & bow details",
      "16 LED candles & lanterns",
      "Topiary accents (2)",
      "Complete design & installation"
    ]
  },
  {
    name: "The Business Welcome",
    price: 799,
    basePrice: 799,
    decoratingFee: 0,
    business: true,
    description: "Professional holiday décor to welcome clients and customers.",
    includes: [
      "Commercial-grade wreath (36-inch)",
      "Entrance arrangement with greens",
      "4 Weatherproof planter displays",
      "Business-appropriate lighting",
      "Elegant, understated accents",
      "Professional installation",
      "Seasonal consultation",
      "Brand-aligned design"
    ]
  }
];

const WinterHoliday = () => {
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
              Winter Holiday Packages
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Elegant seasonal décor that celebrates winter's beauty
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Available: November through December
            </Badge>
          </div>
        </section>

        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome the season with sophisticated wreaths, fresh evergreen arrangements, and thoughtfully placed 
              lighting. Each package brings natural elegance to your home's entrance.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => {
                const packageSlug = pkg.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={pkg.name} to={`/seasoning/${packageSlug}`}>
                    <Card className="overflow-hidden flex flex-col relative h-full hover:shadow-lg transition-shadow">
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
                        </div>
                        <div className="space-y-2 mb-6 flex-grow">
                          <p className="text-sm font-semibold mb-3">What's Included:</p>
                          {pkg.includes.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                          {pkg.includes.length > 5 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              +{pkg.includes.length - 5} more items...
                            </p>
                          )}
                        </div>
                        <Button className="w-full">View Package Details</Button>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl text-center mb-8">Our Winter Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Natural Materials</h3>
                <p className="text-muted-foreground text-sm">
                  Fresh evergreens, natural pinecones, and sustainable elements that honor the season.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Elegant Simplicity</h3>
                <p className="text-muted-foreground text-sm">
                  Sophisticated designs that enhance your home without overwhelming its character.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Complete Service</h3>
                <p className="text-muted-foreground text-sm">
                  Installation, maintenance guidance, and removal when the season concludes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6">Ready to Transform Your Space?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let us create a welcoming winter display that reflects your home's unique character.
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

export default WinterHoliday;
