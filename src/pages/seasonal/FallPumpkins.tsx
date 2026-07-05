import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import servicesHero from "@/assets/services-hero.jpg";
import senseImage1 from "@/assets/pumpkin-sense-sensibility-1.jpg";
import senseImage2 from "@/assets/pumpkin-sense-sensibility-2.jpg";
import budapestImage from "@/assets/pumpkin-grand-budapest-1.jpg";
import babylonImage from "@/assets/pumpkin-babylon-1.jpg";
import gatsbyImage from "@/assets/pumpkin-full-gatsby-1.jpg";
import businessImage from "@/assets/pumpkin-business-stand-1.jpg";
import { useCart } from "@/contexts/CartContext";

const packages = [
  {
    name: "The Quiet Grace",
    slug: "quiet-grace",
    price: 399,
    image: senseImage1,
    description: "A small, considered display for a townhome entry or a single front step.",
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
    image: budapestImage,
    description: "Generous enough for a larger porch, restrained enough to still feel calm.",
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
    image: babylonImage,
    description: "Our statement display, with grand-prize centerpieces that read from the road.",
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
    image: gatsbyImage,
    description: "Museum-grade pumpkins for properties where grandeur meets grace.",
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
    business: true,
    image: businessImage,
    description: "A considered autumn presence for shops and studios that want to greet the street with warmth.",
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
      <SEO
        title="Autumn Pumpkin Packages | Seasonal Styling"
        description="Heritage pumpkin displays styled and installed across Greater Victoria. Five autumn packages, from intimate porches to estate entries."
        canonical="https://wabisabiservices.ca/seasoning/fall-pumpkins"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "Autumn Pumpkin Packages", url: "https://wabisabiservices.ca/seasoning/fall-pumpkins" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
          { name: "Autumn Pumpkin Packages", url: "https://wabisabiservices.ca/seasoning/fall-pumpkins" },
        ]}
      />
      {packages.map((pkg) => (
        <ProductSchema
          key={pkg.slug}
          name={pkg.name}
          description={pkg.description}
          offers={{
            price: String(pkg.price),
            priceCurrency: "CAD",
            availability: "https://schema.org/PreOrder",
            url: `https://wabisabiservices.ca/seasoning/${pkg.slug}`,
          }}
        />
      ))}
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
              Heritage pumpkin displays for the harvest season, styled and installed at your door
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
              Each collection is styled and installed by hand, so your entrance carries the warmth of the
              harvest without the work of sourcing, arranging, or hauling. Choose a package below, or talk
              with us about a display shaped to your home.
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
                          Complete package, styled and installed
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
                      <Button className="w-full" variant="outline">
                        View Package Details
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
                <h3 className="font-serif text-xl mb-3">Styled by Hand</h3>
                <p className="text-muted-foreground text-sm">
                  Our team sets every piece on site, adjusting to your steps, light, and front door until it sits right.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Chosen, Not Ordered</h3>
                <p className="text-muted-foreground text-sm">
                  We hand-pick heritage and heirloom pumpkins, including the odd shapes and uneven colour the season is known for.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl mb-3">Start to Finish</h3>
                <p className="text-muted-foreground text-sm">
                  We deliver, arrange, and come back to clear everything away once the season has passed.
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
              Our autumn calendar fills early. Start with a $150 in-home consultation, credited in full toward your
              first service, and we will plan a display for your home and hold your place on the 2026 waitlist.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Request a Private Consultation</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FallPumpkins;
