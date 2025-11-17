import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-island-retreat-hero.jpg";

const IslandRetreat = () => {
  return (
    <Layout>
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
              The Island Retreat
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Relaxed Tropical-Inspired Summer
            </p>
            <p className="text-lg text-muted-foreground">
              Resort elegance. Tropical beauty. Mindful escape.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Creating Your Summer Sanctuary</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Island Retreat package transforms your entrance into a tropical escape with lush plants, natural materials, and resort-inspired accents. This substantial display combines bamboo, rattan, and coastal elements to create a welcoming atmosphere that evokes vacation memories and relaxation.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ideal for those who love tropical aesthetics and appreciate the laid-back luxury of island living. Each element works together to create a cohesive, inviting display that feels like a permanent vacation.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$924</div>
                  <p className="text-muted-foreground">Includes professional installation & design</p>
                </div>
                <Button size="lg" className="w-full mb-4" disabled>
                  Sold Out for 2025
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
                  "Tropical wreath with palm elements (designer quality)",
                  "4 Summer planter arrangements with tropical plants",
                  "Natural bamboo & rattan accents",
                  "Coastal decorative elements (shells, coral)",
                  "Hurricane lanterns (2) for ambient lighting",
                  "Natural fiber textiles (linen, cotton)",
                  "Shell & coral detail work",
                  "Complete installation",
                  "Mid-season refresh visit",
                  "Photography session"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Principles */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Design Principles</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Fukinsei</h4>
                  <p className="text-muted-foreground">
                    Asymmetry - natural, organic tropical arrangement
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Yugen</h4>
                  <p className="text-muted-foreground">
                    Subtle profundity - mysterious island grace
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Datsuzoku</h4>
                  <p className="text-muted-foreground">
                    Freedom from convention - relaxed island spirit
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Ma</h4>
                  <p className="text-muted-foreground">
                    Negative space - breathing room in tropical abundance
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation Window</h4>
                  <p className="text-muted-foreground">June 1 - June 20</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Duration</h4>
                  <p className="text-muted-foreground">8-10 weeks with refresh</p>
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
                    <h4 className="font-semibold">Post-Season Removal</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground">Complete cleanup and disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Hurricane Lantern</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Extend ambient lighting throughout display</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Tropical coconut scent to complement display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default IslandRetreat;
