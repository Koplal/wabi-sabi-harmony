import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-gathered-abundance-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const GatheredAbundance = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'gathered-abundance',
    name: 'The Gathered Abundance',
    price: 1399,
    description: 'When Autumn Arrives in Full Splendor',
    image: heroImage,
  };

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
              The Gathered Abundance
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              When Autumn Arrives in Full Splendor
            </p>
            <p className="text-lg text-muted-foreground">
              Generous hospitality. Natural grandeur. Mindful abundance.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">A Celebration of Harvest's Peak</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Gathered Abundance is for those who understand that true luxury lies in thoughtful detail and natural beauty. This substantial display creates a powerful yet peaceful presence, transforming your entry into a destination that honors both the season and your guests.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Like a perfectly orchestrated tea ceremony, every element is placed with intention - the largest pumpkins anchor the design while smaller varieties dance between them, creating rhythm and visual poetry that evolves as viewers approach.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,399</div>
                  <p className="text-muted-foreground">Includes professional installation & photography</p>
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
                  "2 Grand Prize Pumpkins (magnificent centerpieces, 30-50 lbs each)",
                  "10 Large Heritage Pumpkins",
                  "8 Medium Heirloom Pumpkins",
                  "8 White Ghost Pumpkins",
                  "Abundant Pie Pumpkin collection",
                  "16 Rare Specialty Pumpkins (museum-quality varieties)",
                  "24 Miniature Pumpkins for delicate detail",
                  "2 Premium hay bales with weather protection",
                  "Ornamental gourd collection",
                  "Seasonal branches (dogwood or maple)",
                  "Dried hydrangeas and ornamental grasses",
                  "Professional landscape-level installation",
                  "Seasonal blessing with sage smudging",
                  "Weekly wellness checks included",
                  "Professional photography session"
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
                  <h4 className="font-serif text-xl mb-3">Mono no Aware</h4>
                  <p className="text-muted-foreground">
                    Bittersweet awareness - celebrating fleeting seasonal beauty
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Iki</h4>
                  <p className="text-muted-foreground">
                    Sophisticated simplicity - refined restraint within abundance
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Kaizen</h4>
                  <p className="text-muted-foreground">
                    Continuous improvement - weekly adjustments for optimal display
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Wa</h4>
                  <p className="text-muted-foreground">
                    Harmony - perfect balance between elements
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Delivery Window</h4>
                  <p className="text-muted-foreground">September 25 - October 10</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Display Longevity</h4>
                  <p className="text-muted-foreground">4-6 weeks with weekly care</p>
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
                    <h4 className="font-semibold">Post-Halloween Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground">Complete cleanup and eco-friendly disposal</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">24 Mini Pumpkins</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground">Additional miniature pumpkins for enhanced detail</p>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground">Natural autumn scent to complement your display</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default GatheredAbundance;
