import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { ServiceSchema, BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Check, Sparkles, ClipboardList, ShoppingBag, Star } from "lucide-react";
import type { Neighborhood } from "@/data/neighborhoods";

// Area-appropriate existing hero assets, varied across adjacent areas for differentiation.
// Falls back to the shared hero image when a slug is not explicitly mapped.
import heroImage from "@/assets/hero-image.jpg";
import servicesHero from "@/assets/services-hero.jpg";
import residentialService from "@/assets/residential-service.jpg";
import cleaningMaterials from "@/assets/cleaning-materials.jpg";
import organizingHero from "@/assets/organizing-hero.jpg";
import errandsHero from "@/assets/errands-hero.jpg";
import postConstructionService from "@/assets/post-construction-service.jpg";

const heroAssets: Record<string, string> = {
  uplands: heroImage,
  "oak-bay": servicesHero,
  rockland: cleaningMaterials,
  "ten-mile-point": residentialService,
  "cadboro-bay": organizingHero,
  "north-saanich": errandsHero,
  "willis-point": postConstructionService,
  fairfield: cleaningMaterials,
  "gordon-head": servicesHero,
  broadmead: residentialService,
  "cordova-bay": organizingHero,
  "dean-park": errandsHero,
  "prospect-lake": heroImage,
  sidney: servicesHero,
  metchosin: postConstructionService,
  "james-bay": cleaningMaterials,
  "downtown-victoria": residentialService,
  gonzales: organizingHero,
};

const conciergeCards = [
  {
    title: "Cleaning",
    href: "/services/cleaning",
    icon: Sparkles,
    blurb: "Museum-level maintenance and deep resets, tuned to fine finishes and heritage materials.",
  },
  {
    title: "Organizing",
    href: "/services/organizing",
    icon: ClipboardList,
    blurb: "Thoughtful organizing and decluttering that brings lasting calm to every room.",
  },
  {
    title: "Errands",
    href: "/services/errands",
    icon: ShoppingBag,
    blurb: "Discreet errand running and household support, so life's details are handled for you.",
  },
];

interface NeighborhoodPageProps {
  data: Neighborhood;
}

export const NeighborhoodPage = ({ data }: NeighborhoodPageProps) => {
  const heroAsset = heroAssets[data.slug] ?? heroImage;
  const canonical = `https://wabisabiservices.ca/areas/${data.slug}`;

  return (
    <Layout>
      <SEO
        title={`Luxury Cleaning in ${data.name}`}
        description={data.metaDescription}
        canonical={canonical}
        ogImage={data.ogImage}
      />

      <ServiceSchema
        name={`Bespoke Concierge Cleaning in ${data.name}`}
        description={data.metaDescription}
        serviceType="Luxury House Cleaning & Concierge"
        areaServed={`${data.name}, Victoria, BC`}
        areaServedType="Place"
        geo={data.geo}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Service Areas", url: "https://wabisabiservices.ca/areas" },
          { name: data.name, url: canonical },
        ]}
      />

      {/* 1. Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-24">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroAsset})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <Breadcrumbs
            centered
            items={[
              { name: "Home", url: "https://wabisabiservices.ca/" },
              { name: "Service Areas", url: "https://wabisabiservices.ca/areas" },
              { name: data.name, url: canonical },
            ]}
          />

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6">
            Bespoke Concierge Cleaning in {data.name}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">{data.heroTagline}</p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {data.intro}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button asChild size="lg">
              <Link to="/contact">Request a Private Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/book">Book Now</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Discreet, fully vetted, and insured care for Victoria's most discerning homes.
          </p>
        </div>
      </section>

      {/* 2. Local Context */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-10 text-center">
            Caring for Homes in {data.name}
          </h2>
          <div className="space-y-6">
            {data.localContext.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Luxury Cleaning Here */}
      <section className="py-24 px-6 lg:px-12 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-10 text-center">
            Why Discerning {data.name} Homeowners Choose Us
          </h2>
          <ul className="space-y-4">
            {data.whyLuxuryHere.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-accent mt-1 shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Materials & Heritage Care */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-10 text-center">
            Materials &amp; Heritage Care
          </h2>
          <ul className="space-y-4">
            {data.heritageMaterials.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-accent mt-1 shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Concierge Services */}
      <section className="py-24 px-6 lg:px-12 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-16 text-center">Concierge Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conciergeCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="overflow-hidden group cursor-pointer border-none shadow-none bg-background"
                >
                  <Link to={card.href}>
                    <div className="p-8">
                      <Icon className="h-8 w-8 text-accent mb-4" aria-hidden="true" />
                      <h3 className="font-serif text-2xl mb-3">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{card.blurb}</p>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Google Reviews trust band */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <Star className="h-8 w-8 text-accent mx-auto mb-6" aria-hidden="true" />
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Trusted by Discerning Homeowners</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            See why discerning Victoria homeowners choose us.
          </p>
          <Button asChild variant="outline">
            <a
              href="https://share.google/qpmn3a6VHcDFweao6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our Google Reviews
            </a>
          </Button>
        </div>
      </section>

      {/* 7. Nearby Areas */}
      <section className="py-24 px-6 lg:px-12 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-10">Nearby Service Areas</h2>
          <nav aria-label="Nearby service areas">
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {data.nearbyAreas.map((area) => (
                <li key={area.slug}>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/areas/${area.slug}`}>{area.name}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 8. Closing CTA */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Begin with a Private Consultation
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Tell us about your home in {data.name}, and we'll design a bespoke concierge plan around it.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Request a Private Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NeighborhoodPage;
