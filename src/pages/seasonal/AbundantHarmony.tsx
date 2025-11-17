import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-abundant-harmony-hero.jpg";

const AbundantHarmony = () => {
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
              The Abundant Harmony
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Celebrate Autumn's Generous Spirit
            </p>
            <p className="text-lg text-muted-foreground">
              Thoughtfully abundant. Naturally balanced. Beautifully imperfect.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">The Perfect Middle Path</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Abundant Harmony represents the perfect middle path - generous enough to impress, refined enough to inspire tranquility. Each pumpkin is chosen not for perfection, but for character, creating a display that tells the story of nature's beautiful irregularities.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ideal for larger porches, stepped entries, and homes that host with heart. This curated collection transforms your entrance into a meditation on autumn's fleeting beauty, reminding all who enter to pause and appreciate the present moment.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$899</div>
                  <p className="text-muted-foreground">Includes professional styling & installation</p>
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
                  "8 Large Heritage Pumpkins",
                  "8 Medium Heirloom Pumpkins",
                  "6 White Ghost Pumpkins",
                  "12 Small Pie Pumpkins",
                  "12 Specialty Pumpkins (unique textures and heritage varieties)",
                  "2 Locally-sourced hay bales (organic when available)",
                  "Ornamental gourds and seasonal botanicals",
                  "Eucalyptus or sage bundles for natural aromatherapy",
                  "Professional design and full installation",
                  "Blessing ceremony for your autumn display",
                  "Mid-season refresh check-in"
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
                  <h4 className="font-serif text-xl mb-3">Shibui (Subtle Beauty)</h4>
                  <p className="text-muted-foreground">
                    Understated elegance that reveals itself slowly
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Yugen (Profound Grace)</h4>
                  <p className="text-muted-foreground">
                    Suggesting rather than revealing the whole
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Ma (Negative Space)</h4>
                  <p className="text-muted-foreground">
                    Strategic use of empty space for visual breathing
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Datsuzoku (Freedom from Habit)</h4>
                  <p className="text-muted-foreground">
                    Unexpected elements that delight
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div>
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Delivery Window</h4>
                  <p className="text-muted-foreground">September 25 - October 10</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Longevity</h4>
                  <p className="text-muted-foreground">4-6 weeks with maintenance</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Service Area</h4>
                  <p className="text-muted-foreground">Greater Victoria</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AbundantHarmony;
