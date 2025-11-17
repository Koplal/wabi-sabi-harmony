import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-festive-estate-hero.jpg";

const FestiveEstate = () => {
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
              The Festive Estate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Grand Holiday Display for Larger Homes
            </p>
            <p className="text-lg text-muted-foreground">
              Abundant beauty. Elegant presence. Mindfully grand.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Celebrating the Season in Full Splendor</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Festive Estate package is designed for homes with multi-level entries and expansive facades. This comprehensive display combines premium wreaths, extensive garland work, and abundant planter arrangements to create a cohesive, impressive holiday transformation.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Perfect for those who entertain during the holidays and appreciate the impact of thoughtful, professional holiday styling. Each element works in harmony to welcome guests with warmth and festive elegance.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,424</div>
                  <p className="text-muted-foreground">Includes professional installation & lighting</p>
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
                  "Premium wreath collection (multiple sizes, coordinated)",
                  "Garland for railings (up to 25 feet, fresh greens)",
                  "8 Planter arrangements with greens",
                  "Illuminated arrangements with lights",
                  "Natural pinecone & ornament accents",
                  "Festive bows in muted metallics",
                  "12 Battery-operated candles",
                  "Full professional styling",
                  "Custom design consultation",
                  "Two maintenance visits included",
                  "Professional photography session",
                  "Seasonal blessing ceremony"
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
                  <h4 className="font-serif text-xl mb-3">Miyabi</h4>
                  <p className="text-muted-foreground">
                    Courtly elegance - refined beauty in every detail
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Jo-ha-kyū</h4>
                  <p className="text-muted-foreground">
                    Rhythmic progression - gradual build to climax and resolution
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Ensō</h4>
                  <p className="text-muted-foreground">
                    Circle of togetherness - unity in seasonal celebration
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Omotenashi</h4>
                  <p className="text-muted-foreground">
                    Wholehearted hospitality - welcoming spirit in design
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
                  <p className="text-muted-foreground">November 20 - December 5</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Duration</h4>
                  <p className="text-muted-foreground">6-8 weeks with maintenance</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Service Area</h4>
                  <p className="text-muted-foreground">Victoria & Saanich Peninsula</p>
                </Card>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div>
              <h3 className="font-serif text-3xl mb-8">Optional Add-ons</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Post-Holiday Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground">Complete cleanup and eco-friendly disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Garland (10 feet)</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Extend garland coverage for larger spaces</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Natural winter scent to complement your display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FestiveEstate;
