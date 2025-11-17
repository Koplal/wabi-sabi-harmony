import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import heroImage from "@/assets/package-mindful-merchant-hero.jpg";
import { useCart } from "@/contexts/CartContext";

const MindfulMerchant = () => {
  const { addToCart } = useCart();

  const packageItem = {
    id: 'mindful-merchant',
    name: 'The Mindful Merchant',
    price: 799,
    description: 'Make Your Business the Heart of Autumn',
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
              The Mindful Merchant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Make Your Business the Heart of Autumn
            </p>
            <p className="text-lg text-muted-foreground">
              Attract. Delight. Remember. Return.
            </p>
          </div>
        </section>

        {/* Package Details */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-4xl mb-6">Strategic Placemaking for Business</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The Mindful Merchant package is designed for Victoria businesses that understand the power of seasonal storytelling. More than decoration, this is strategic placemaking that transforms your storefront into a community landmark and social media sensation.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In the spirit of 'omotenashi' (Japanese hospitality), we create displays that welcome customers before they even enter your door, setting the stage for exceptional experiences and organic social sharing.
                </p>
              </div>
              <Card className="p-8">
                <div className="mb-6">
                  <div className="text-4xl font-serif mb-2">$799</div>
                  <p className="text-muted-foreground">Commercial package with marketing support</p>
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
                  "8 Large Commercial-Grade Pumpkins",
                  "8 Medium Heritage Pumpkins",
                  "8 White Ghost Pumpkins (perfect for evening visibility)",
                  "Abundant Pie Pumpkin collection",
                  "12 Specialty Pumpkins (conversation starters)",
                  "24 Mini pumpkins for detail work",
                  "2 Commercial hay bales (fire-retardant treated)",
                  "Weather-resistant signage integration",
                  "Ornamental gourds throughout",
                  "Professional commercial installation",
                  "Liability insurance coverage ($2M)",
                  "Bi-weekly maintenance service",
                  "Social media photo package",
                  "Marketing templates and hashtags",
                  "Complete cleanup and removal"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Benefits */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Business Benefits & ROI</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="text-3xl font-serif mb-2">35%</div>
                  <p className="text-muted-foreground">Average foot traffic increase</p>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-serif mb-2">150%</div>
                  <p className="text-muted-foreground">Social media engagement boost</p>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-serif mb-2">200%</div>
                  <p className="text-muted-foreground">Instagram check-ins increased</p>
                </Card>
              </div>
            </div>

            {/* Marketing Amplification */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Marketing Amplification</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Content Support</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Professional photography for marketing</li>
                    <li>• Social media content calendar (30 days)</li>
                    <li>• Press release template</li>
                    <li>• Hashtag strategy guide</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h4 className="font-serif text-xl mb-3">Competitive Advantages</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• First-in-neighborhood impact</li>
                    <li>• Memorable brand differentiation</li>
                    <li>• Community goodwill building</li>
                    <li>• Employee morale boost</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Package Features */}
            <div className="mb-16">
              <h3 className="font-serif text-3xl mb-8">Package Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <p className="text-muted-foreground">Flexible scheduling including after-hours</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Duration</h4>
                  <p className="text-muted-foreground">Full season (6-8 weeks)</p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-semibold mb-2">Insurance</h4>
                  <p className="text-muted-foreground">$2M liability coverage included</p>
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

export default MindfulMerchant;
