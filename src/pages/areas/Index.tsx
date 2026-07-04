import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ServiceSchema, BreadcrumbSchema } from "@/components/structured-data";
import { ChevronRight } from "lucide-react";
import { neighborhoods, type Neighborhood } from "@/data/neighborhoods";

// Brand section headings derived from each record's tier (NOT "Tier 1/2/3").
const tierGroups: { heading: string; tier: 1 | 2 | 3; blurb: string }[] = [
  {
    heading: "Flagship Estates",
    tier: 1,
    blurb:
      "Our flagship enclaves — Olmsted garden suburbs, heritage landmarks, and ultra-private oceanfront estates.",
  },
  {
    heading: "Coastal & Executive",
    tier: 2,
    blurb:
      "Waterfront, lakefront, and master-planned executive neighbourhoods across Saanich and the Peninsula.",
  },
  {
    heading: "Heritage & Urban",
    tier: 3,
    blurb:
      "Victoria's oldest residential streets and lock-and-leave luxury condos around the Inner Harbour.",
  },
];

const AreasIndex = () => {
  const allAreas = Object.values(neighborhoods);

  return (
    <Layout>
      <SEO
        title="Service Areas"
        description="Bespoke concierge cleaning across Greater Victoria — Oak Bay, the Saanich Peninsula, and the Westshore/Langford, from Uplands and Rockland to Sidney."
        canonical="https://wabisabiservices.ca/areas"
      />

      <ServiceSchema
        name="Bespoke Concierge Cleaning Across Greater Victoria"
        description="Bespoke concierge cleaning across Greater Victoria, the Saanich Peninsula, and Oak Bay."
        serviceType="Luxury House Cleaning & Concierge"
        areaServed="Greater Victoria, BC"
        areaServedType="City"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Service Areas", url: "https://wabisabiservices.ca/areas" },
        ]}
      />

      {/* Hero */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="text-foreground">
                Service Areas
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6">
            Bespoke Concierge Cleaning Across Greater Victoria
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From the heritage estates of Oak Bay and Uplands to the waterfront enclaves of the
            Saanich Peninsula, the Westshore and Langford, and Metchosin, we bring discreet,
            museum-level care to Victoria's most discerning homes. Explore the neighbourhoods we serve below.
          </p>
        </div>
      </section>

      {/* Grouped area links */}
      {tierGroups.map((group, groupIndex) => {
        const areas = allAreas.filter((area: Neighborhood) => area.tier === group.tier);
        if (areas.length === 0) return null;

        return (
          <section
            key={group.tier}
            className={`py-20 px-6 lg:px-12 ${groupIndex % 2 === 1 ? "bg-secondary/30" : ""}`}
          >
            <div className="container mx-auto max-w-5xl">
              <h2 className="font-serif text-3xl md:text-4xl mb-3 text-center">{group.heading}</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
                {group.blurb}
              </p>
              <nav aria-label={`${group.heading} service areas`}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {areas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        to={`/areas/${area.slug}`}
                        className="group block rounded-lg border border-border p-6 transition-colors hover:border-primary hover:bg-secondary/40"
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-serif text-xl">{area.name}</span>
                          <ChevronRight
                            className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="mt-2 block text-sm text-muted-foreground leading-relaxed">
                          {area.heroTagline}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </section>
        );
      })}

      {/* Closing CTA */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Don't See Your Neighbourhood?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            We care for discerning homes throughout Greater Victoria — Oak Bay, the Saanich Peninsula,
            the Westshore and Langford, and Metchosin. Tell us about your home, and we'll design a
            bespoke concierge plan around it.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Request a Private Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default AreasIndex;
