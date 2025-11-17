import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import servicesHero from "@/assets/services-hero.jpg";
import senseImage1 from "@/assets/pumpkin-sense-sensibility-1.jpg";
import senseImage2 from "@/assets/pumpkin-sense-sensibility-2.jpg";
import budapestImage from "@/assets/pumpkin-grand-budapest-1.jpg";
import babylonImage from "@/assets/pumpkin-babylon-1.jpg";
import gatsbyImage from "@/assets/pumpkin-full-gatsby-1.jpg";
import businessImage from "@/assets/pumpkin-business-stand-1.jpg";

const packages = [
  {
    name: "The Quiet Grace",
    slug: "quiet-grace",
    price: 399,
    soldOut: true,
    image: senseImage1,
    description: "Perfect for intimate porches and those who appreciate that less can indeed be more.",
    includes: [
      "6 Large Heritage Pumpkins",
      "4 Medium Heirloom Pumpkins",
      "4 White Ghost Pumpkins",
      "12 Small Pie Pumpkins",
      "4 Specialty Pumpkins",
      "Natural jute or hemp rope accents",
      "Dried botanical elements",
      "Mindful arrangement and blessing"
    ]
  },
  {
    name: "The Abundant Harmony",
    slug: "abundant-harmony",
    price: 899,
    popular: true,
    soldOut: true,
    image: budapestImage,
    description: "The perfect middle path - generous enough to impress, refined enough to inspire tranquility.",
    includes: [
      "8 Large Heritage Pumpkins",
      "8 Medium Heirloom Pumpkins",
      "6 White Ghost Pumpkins",
      "12 Small Pie Pumpkins",
      "12 Specialty Pumpkins",
      "2 Locally-sourced hay bales",
      "Ornamental gourds & botanicals",
      "Professional design & installation"
    ]
  },
  {
    name: "The Gathered Abundance",
    slug: "gathered-abundance",
    price: 1399,
    soldOut: true,
    image: babylonImage,
    description: "A show-stopping statement for those who honor both the season and their guests.",
    includes: [
      "2 Grand Prize Pumpkins (30-50 lbs each)",
      "10 Large Heritage Pumpkins",
      "8 Medium Heirloom Pumpkins",
      "8 White Ghost Pumpkins",
      "16 Rare Specialty Pumpkins",
      "24 Miniature Pumpkins",
      "2 Premium hay bales",
      "Full professional installation"
    ]
  },
  {
    name: "The Estate Collection",
    slug: "estate-collection",
    price: 1899,
    soldOut: true,
    image: gatsbyImage,
    description: "Museum-quality curation for properties where grandeur meets grace.",
    includes: [
      "3 Museum-Grade Grand Prize Pumpkins",
      "10 Large Heritage Pumpkins",
      "16 Antique White Pumpkins",
      "20+ Rare Specimen Pumpkins",
      "24 Miniature Pumpkins",
      "3 Premium hay bales",
      "Dedicated project manager",
      "Professional photo & video"
    ]
  },
  {
    name: "The Mindful Merchant",
    slug: "mindful-merchant",
    price: 799,
    soldOut: true,
    business: true,
    image: businessImage,
    description: "Transform your business into a destination this autumn with strategic placemaking.",
    includes: [
      "8 Large Commercial-Grade Pumpkins",
      "8 Medium Heritage Pumpkins",
      "8 White Ghost Pumpkins",
      "12 Specialty Pumpkins",
      "24 Mini pumpkins",
      "2 Commercial hay bales",
      "Professional installation",
      "Marketing support & insurance"
    ]
  }
];

const FallPumpkins = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
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
              Autumn Pumpkin Packages
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Curated pumpkin displays that celebrate the harvest season
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Deliveries: Last week of September - First week of October
            </Badge>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your porch into an autumn masterpiece with our thoughtfully curated pumpkin collections. 
              Each package is professionally styled and installed, bringing the warmth and beauty of fall to your doorstep.
            </p>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <Link key={pkg.name} to={`/seasoning/${pkg.slug}`}>
                  <Card className="overflow-hidden flex flex-col relative hover:shadow-xl transition-shadow cursor-pointer">
                    {pkg.soldOut && (
                      <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                        Sold Out
                      </Badge>
                    )}
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
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Complete package with installation
                        </p>
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
                      <Button 
                        disabled 
                        className="w-full" 
                        variant={pkg.soldOut ? "secondary" : "default"}
                      >
                        {pkg.soldOut ? "Sold Out for 2024" : "Reserve Package"}
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-12 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl text-center mb-8">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Professional Styling</h3>
                <p className="text-muted-foreground text-sm">
                  Our team arranges each pumpkin with intention, creating balanced, beautiful displays.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Quality Selection</h3>
                <p className="text-muted-foreground text-sm">
                  Hand-picked pumpkins in various sizes, colors, and textures for visual interest.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Hassle-Free Service</h3>
                <p className="text-muted-foreground text-sm">
                  We deliver, arrange, and can remove your display when the season ends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6">Planning for Next Season?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our waitlist to be the first to know when 2025 packages become available.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Join Waitlist</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FallPumpkins;
