import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import servicesHero from "@/assets/services-hero.jpg";
import coastalCottageHero from "@/assets/package-coastal-cottage-hero.jpg";
import islandRetreatHero from "@/assets/package-island-retreat-hero.jpg";
import beachsideManorHero from "@/assets/package-beachside-manor-hero.jpg";
import seasideEstateHero from "@/assets/package-seaside-estate-hero.jpg";
import summerStorefrontHero from "@/assets/package-summer-storefront-hero.jpg";

const packages = [
  {
    name: "The Coastal Cottage",
    price: 474,
    basePrice: 349,
    decoratingFee: 125,
    popular: true,
    image: coastalCottageHero,
    description: "Breezy beach-inspired accents with natural coastal elements.",
    includes: [
      "Nautical wreath with shells & rope",
      "2 Coastal planter arrangements",
      "Driftwood accents",
      "Natural fiber elements",
      "Sea glass touches",
      "Professional styling"
    ]
  },
  {
    name: "The Island Retreat",
    price: 924,
    basePrice: 799,
    decoratingFee: 125,
    image: islandRetreatHero,
    description: "Relaxed summer aesthetic with tropical-inspired touches.",
    includes: [
      "Tropical wreath with palm elements",
      "4 Summer planter arrangements",
      "Natural bamboo & rattan accents",
      "Coastal decorative elements",
      "Hurricane lanterns (2)",
      "Natural fiber textiles",
      "Shell & coral details",
      "Complete installation"
    ]
  },
  {
    name: "The Beachside Manor",
    price: 1424,
    basePrice: 1299,
    decoratingFee: 125,
    image: beachsideManorHero,
    description: "Expansive coastal-luxe summer transformation.",
    includes: [
      "Multiple coastal wreaths",
      "8 Statement summer planters",
      "Driftwood sculpture accents",
      "Natural rope & netting details",
      "Large hurricane lanterns (4)",
      "Beach glass & shell displays",
      "Nautical rope railings",
      "Tropical greenery accents",
      "Full professional styling"
    ]
  },
  {
    name: "The Seaside Estate",
    price: 1924,
    basePrice: 1799,
    decoratingFee: 125,
    image: seasideEstateHero,
    description: "Resort-style summer elegance for waterfront properties.",
    includes: [
      "Premium coastal wreath collection (3+)",
      "12 Luxury summer arrangements",
      "Large driftwood installations",
      "Professional nautical styling",
      "Multiple lantern displays",
      "Natural fiber furniture accents",
      "Beach-inspired lighting",
      "Tropical plant arrangements",
      "Editorial coastal design"
    ]
  },
  {
    name: "The Summer Storefront",
    price: 799,
    basePrice: 799,
    decoratingFee: 0,
    business: true,
    image: summerStorefrontHero,
    description: "Fresh summer presentation for business entrances.",
    includes: [
      "Commercial summer wreath",
      "4 Professional planter displays",
      "Seasonal tropical elements",
      "Weather-resistant materials",
      "Brand-appropriate styling",
      "Low-maintenance design",
      "Installation & consultation",
      "Summer refresh recommendations"
    ]
  }
];

const SummerSerenity = () => {
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
              Summer Serenity Packages
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Coastal-inspired elegance for the season of sunshine
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Available: June through August
            </Badge>
          </div>
        </section>

        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Embrace summer's relaxed elegance with coastal wreaths, driftwood accents, and breezy arrangements 
              that capture the essence of island living.
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
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${pkg.image})`,
                        }}
                      />
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
            <h2 className="font-serif text-3xl text-center mb-8">Summer Design Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Coastal Elegance</h3>
                <p className="text-muted-foreground text-sm">
                  Natural materials like driftwood, shells, and rope create an authentic seaside atmosphere.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Relaxed Luxury</h3>
                <p className="text-muted-foreground text-sm">
                  Sophisticated yet effortless designs that capture summer's easygoing spirit.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Island Living</h3>
                <p className="text-muted-foreground text-sm">
                  Tropical touches and breezy elements that celebrate Vancouver Island summers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6">Create Your Summer Sanctuary</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Transform your entrance into a coastal retreat that welcomes the season's warmth.
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

export default SummerSerenity;
