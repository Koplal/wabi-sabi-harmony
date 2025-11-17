import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-quiet-grace-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const QuietGrace = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'quiet-grace',
    name: 'The Quiet Grace',
    price: 399,
    description: "Find Beauty in Autumn's Imperfection",
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
              The Quiet Grace
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Find Beauty in Autumn's Imperfection
            </p>
            <p className="text-lg text-muted-foreground">
              Mindfully curated. Naturally elegant. Authentically yours.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Embracing Subtle Beauty</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  In the spirit of wabi-sabi, we believe true beauty lies not in abundance, but in thoughtful curation. The Quiet Grace brings intentional autumn charm to compact spaces, celebrating each pumpkin's unique character and natural imperfections.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Perfect for intimate porches, townhome entries, and those who appreciate that less can indeed be more. Each display is arranged with mindful attention to balance, texture, and the inherent beauty of seasonal transitions.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$399</div>
                  <p className="text-muted-foreground">Complete package with installation</p>
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
                  "6 Large Heritage Pumpkins (each selected for unique character)",
                  "4 Medium Heirloom Pumpkins",
                  "4 White Ghost Pumpkins (symbol of purity and simplicity)",
                  "12 Small Pie Pumpkins",
                  "4 Specialty Pumpkins (rare varieties celebrating nature's diversity)",
                  "Natural jute or hemp rope accents",
                  "Dried botanical elements (lavender, wheat, or sage)",
                  "Mindful arrangement and blessing of your space"
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
                  <h4 className="font-serif text-xl mb-3">Kanso (Simplicity)</h4>
                  <p className="text-muted-foreground">
                    Elimination of clutter, focus on essentials
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Shizen (Naturalness)</h4>
                  <p className="text-muted-foreground">
                    Celebrating organic shapes and textures
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Fukinsei (Asymmetry)</h4>
                  <p className="text-muted-foreground">
                    Creating dynamic balance through imperfect arrangement
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Seijaku (Tranquility)</h4>
                  <p className="text-muted-foreground">
                    Peaceful, calming presence at your entrance
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
                  <p className="text-muted-foreground">4-6 weeks with proper care</p>
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
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Professional Arrangement</h4>
                    <span className="text-2xl font-serif">$125</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Expert design and placement by our team</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'quiet-grace-arrangement',
                      name: 'Professional Arrangement',
                      price: 125,
                      description: 'Expert design and placement by our team',
                      image: heroImage,
                    })}
                  >
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Post-Halloween Removal & Composting</h4>
                    <span className="text-2xl font-serif">$99</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Complete cleanup and eco-friendly disposal</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'quiet-grace-removal',
                      name: 'Post-Halloween Removal & Composting',
                      price: 99,
                      description: 'Complete cleanup and eco-friendly disposal',
                      image: heroImage,
                    })}
                  >
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">24 Mini Pumpkins</h4>
                    <span className="text-2xl font-serif">$75</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Additional miniature pumpkins for enhanced detail</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'quiet-grace-mini-pumpkins',
                      name: '24 Mini Pumpkins',
                      price: 75,
                      description: 'Additional miniature pumpkins for enhanced detail',
                      image: heroImage,
                    })}
                  >
                    Add to Cart
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Seasonal Aromatherapy Spray</h4>
                    <span className="text-2xl font-serif">$35</span>
                  </div>
                  <p className="text-muted-foreground mb-4">Natural autumn scent to complement your display</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addToCart({
                      id: 'quiet-grace-aromatherapy',
                      name: 'Seasonal Aromatherapy Spray',
                      price: 35,
                      description: 'Natural autumn scent to complement your display',
                      image: heroImage,
                    })}
                  >
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

export default QuietGrace;
