import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceEstimator } from "@/components/PriceEstimator";
import heroImage from "@/assets/hero-image.jpg";
import commercialService from "@/assets/commercial-service.jpg";
import postConstructionService from "@/assets/post-construction-service.jpg";
import residentialService from "@/assets/residential-service.jpg";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 animate-in fade-in duration-1000">
            Quiet luxury,<br />immaculately kept.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-in fade-in duration-1000 delay-200">
            Mindful cleaning for intentional homes and businesses.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8 animate-in fade-in duration-1000 delay-300">
            <PriceEstimator />
          </div>

          <div className="animate-in fade-in duration-1000 delay-400">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Wabi Sabi Services */}
      <section className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-20">
            Why Wabi Sabi Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="font-serif text-2xl mb-4">Calm Precision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every detail matters—from museum-level dusting and edge-to-edge floors to curated resets 
                that leave your home styled and serene. Conscious products and subtle seasonal scents complete the finish.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-serif text-2xl mb-4">Discreet & Trustworthy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy and peace of mind come first. Our team is carefully vetted, fully insured, 
                and trained to work quietly in the background—leaving your space flawless without disruption.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-serif text-2xl mb-4">Sustainable Care</h3>
              <p className="text-muted-foreground leading-relaxed">
                Luxury should never come at the expense of well-being. We offer fragrance-free options 
                as well as aromatherapy enhancements, always using surface-safe products and practices that 
                protect your children, pets, and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-32 px-6 lg:px-12 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-20">
            Featured Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden group cursor-pointer border-none shadow-none">
              <Link to="/services">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={residentialService}
                    alt="Residential cleaning service"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl mb-2">Residential</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintenance cleans, deep resets, and move prep for your sanctuary.
                  </p>
                </div>
              </Link>
            </Card>

            <Card className="overflow-hidden group cursor-pointer border-none shadow-none">
              <Link to="/services">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={commercialService}
                    alt="Commercial cleaning service"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl mb-2">Commercial</h3>
                  <p className="text-sm text-muted-foreground">
                    Boutique offices, studios, and wellness spaces.
                  </p>
                </div>
              </Link>
            </Card>

            <Card className="overflow-hidden group cursor-pointer border-none shadow-none">
              <Link to="/services">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={postConstructionService}
                    alt="Post-construction cleaning"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl mb-2">Post-Construction</h3>
                  <p className="text-sm text-muted-foreground">
                    HEPA vacuuming, fine dust removal, and stone-safe finishing.
                  </p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* The Ritual Teaser */}
      <section className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-8">The Ritual</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            From first consult to final touch, our six-step ritual ensures serene, gallery-ready results.
          </p>
          <Button asChild variant="ghost">
            <Link to="/ritual">See the Ritual →</Link>
          </Button>
        </div>
      </section>

      {/* Consultation */}
      <section className="py-32 px-6 lg:px-12 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Curated Care Plan</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Our in-home consultation is <span className="text-foreground font-medium">$150</span>, 
            fully credited toward your first booking. This ensures your home receives a tailored plan 
            designed for precision and care.
          </p>
          <Button asChild>
            <Link to="/contact">Request Consultation</Link>
          </Button>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-20">
            What Clients Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="border-l-2 border-accent pl-6">
              <p className="text-lg mb-4 leading-relaxed">
                "Listing went live at 10am and sold in 48 hours. The house felt like a boutique hotel."
              </p>
              <p className="text-sm text-muted-foreground">— S.K., Uplands</p>
            </div>

            <div className="border-l-2 border-accent pl-6">
              <p className="text-lg mb-4 leading-relaxed">
                "They care for our marble like it's their own."
              </p>
              <p className="text-sm text-muted-foreground">— M.D., Bear Mountain</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="ghost">
              <Link to="/reviews">Read More Reviews →</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
