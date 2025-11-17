import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-blooming-manor-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const BloomingManor = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'blooming-manor',
    name: 'The Blooming Manor',
    price: 1924,
    description: 'Grand Spring Transformation',
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
              The Blooming Manor
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Grand Spring Transformation
            </p>
            <p className="text-lg text-muted-foreground">
              Editorial-level artistry. Abundant florals. Mindfully spectacular.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">The Pinnacle of Spring Artistry</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Blooming Manor represents the zenith of our spring styling - a masterwork designed for estate-style properties. This grand installation transforms your home into a botanical showplace with abundant florals, architectural elements, and sophisticated garden artistry that creates an unforgettable seasonal statement.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Created for those who entertain in style and appreciate museum-quality botanical design. Each element is precisely placed through collaboration with our design team to create a cohesive, breathtaking display that honors both the season and your property's unique character.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$1,924</div>
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
                  "Premium floral wreath collection (3+, custom-designed)",
                  "12 Statement planter arrangements",
                  "Abundant fresh & preserved flowers",
                  "Decorative trellis or arbor styling",
                  "Vintage garden furniture accents",
                  "Natural moss & stone pathway elements",
                  "Water feature styling (if applicable)",
                  "Garden lanterns & ambient lighting",
                  "Editorial-level installation",
                  "Dedicated project manager",
                  "2-week design consultation process",
                  "Weekly maintenance visits",
                  "Professional photo & video documentation",
                  "Opening ceremony with seasonal blessing",
                  "Pressed botanical keepsake"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Philosophy */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Design Philosophy</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Ichigo ichie</h4>
                  <p className="text-muted-foreground">
                    Once in a lifetime - treasure this unique spring moment
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Hanami</h4>
                  <p className="text-muted-foreground">
                    Flower viewing - celebrating the beauty of blossoms
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Gei</h4>
                  <p className="text-muted-foreground">
                    Artistic accomplishment - mastery in floral execution
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Kodawari</h4>
                  <p className="text-muted-foreground">
                    Uncompromising dedication - pursuit of botanical perfection
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
                  <p className="text-muted-foreground text-sm">Weekly throughout season</p>
                </Card>
              </div>
            </div>

            {/* Optional Add-ons */}
            <div>
              <h3 className="font-serif text-3xl mb-8">Optional Add-ons</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Post-Season Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'blooming-manor-removal', name: 'Post-Season Removal & Composting', price: 99, description: 'Complete cleanup and eco-friendly disposal', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Additional Premium Wreath</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Extend styling to additional entrances</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'blooming-manor-wreath', name: 'Additional Premium Wreath', price: 75, description: 'Extend styling to additional entrances', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Natural spring scent to complement your display</p>
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => addToCart({id: 'blooming-manor-aromatherapy', name: 'Seasonal Aromatherapy Spray', price: 35, description: 'Natural spring scent to complement your display', image: heroImage})}>
                    Add to Cart
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BloomingManor;
