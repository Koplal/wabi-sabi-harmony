import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-estate-collection-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const EstateCollection = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'estate-collection',
    name: 'The Estate Collection',
    price: 1899,
    description: 'Where Grandeur Meets Grace',
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
              The Estate Collection
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Where Grandeur Meets Grace
            </p>
            <p className="text-lg text-muted-foreground">
              Museum-quality curation. Estate-level presentation. Mindfully magnificent.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">The Pinnacle of Seasonal Artistry</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Estate Collection represents the zenith of our seasonal artistry - a masterwork that transforms your property into a living gallery. Each installation is a bespoke creation, designed in collaboration with landscape architects and executed with the precision of a Japanese garden.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This is for those who understand that true luxury whispers rather than shouts, that the most profound beauty often lies in the interplay between the monumental and the minute, the perfect and the imperfect.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,899</div>
                  <p className="text-muted-foreground">Complete concierge service with full documentation</p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={() => addToCart(packageItem)}
                >
                  Add to Cart
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
                  "3 Museum-Grade Grand Prize Pumpkins (competition quality)",
                  "10 Large Heritage Pumpkins (rare Victorian varieties)",
                  "12 Medium Heirloom Pumpkins",
                  "16 Antique White Pumpkins (including rare Lumina variety)",
                  "12 Artisan Pie Pumpkins",
                  "24 Miniature Pumpkins (including rare Jack-Be-Little)",
                  "20+ Rare Specimen Pumpkins (one-of-a-kind varieties)",
                  "3 Premium hay bales with custom covers",
                  "Extensive ornamental gourd collection",
                  "Preserved maple and oak branches",
                  "Dried flower arrangements (designed by florist)",
                  "Living succulent pumpkin arrangements",
                  "Custom wooden signage (optional)",
                  "Full landscape-grade installation",
                  "Opening ceremony with professional photographer",
                  "Dedicated project manager",
                  "2-week collaborative planning process",
                  "Twice-weekly service visits",
                  "Professional photo & video documentation",
                  "Pressed botanical keepsake book"
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
              <h3 className="font-serif text-3xl mb-8">Design Philosophy</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Shu-Ha-Ri</h4>
                  <p className="text-muted-foreground">
                    Learning journey - each year builds upon the last
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Kintsugi</h4>
                  <p className="text-muted-foreground">
                    Golden repair - celebrating imperfections as features
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Mushin</h4>
                  <p className="text-muted-foreground">
                    No-mind - creating spaces for meditation
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Ichi-go ichi-e</h4>
                  <p className="text-muted-foreground">
                    One time, one meeting - unique, unrepeatable beauty
                  </p>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">The Complete Estate Experience</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Discovery Phase</h4>
                  <p className="text-muted-foreground text-sm">2 weeks before installation</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Design Phase</h4>
                  <p className="text-muted-foreground text-sm">1 week before installation</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <p className="text-muted-foreground text-sm">Full day with 4-person team</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Maintenance</h4>
                  <p className="text-muted-foreground text-sm">Twice-weekly throughout season</p>
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

export default EstateCollection;
