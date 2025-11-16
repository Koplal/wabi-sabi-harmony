import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import servicesHero from "@/assets/services-hero.jpg";

const Seasoning = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${servicesHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              Seasonal Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Transform your home with the beauty of each season
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Beyond our signature cleaning services, we bring the essence of each season into your home. 
              Our seasonal decoration services create inviting, festive atmospheres that reflect the natural 
              rhythm of the year while maintaining the elegant simplicity of wabi-sabi design.
            </p>
          </div>
        </section>

        {/* Seasonal Services */}
        <section className="py-20 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Fall */}
              <Card className="p-8">
                <h3 className="font-serif text-3xl mb-4">Autumn Warmth</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Welcome the season of harvest with thoughtful touches that celebrate nature's abundance. 
                  We curate displays that bring the warmth of autumn indoors.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Elegant pumpkin arrangements in muted, natural tones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Seasonal foliage displays with maple leaves and branches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Subtle autumn wreaths for doors and mantels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cozy table settings with natural elements</span>
                  </li>
                </ul>
              </Card>

              {/* Winter/Christmas */}
              <Card className="p-8">
                <h3 className="font-serif text-3xl mb-4">Winter Elegance</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Transform your home into a serene winter sanctuary with sophisticated holiday touches 
                  that honor tradition while embracing minimalist beauty.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Handcrafted wreaths with natural evergreen and eucalyptus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Thoughtfully placed garlands and greenery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Elegant candle arrangements for warm ambiance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Curated ornamental displays in muted metallics</span>
                  </li>
                </ul>
              </Card>

              {/* Spring */}
              <Card className="p-8">
                <h3 className="font-serif text-3xl mb-4">Spring Renewal</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Celebrate new beginnings with fresh, vibrant touches that bring the awakening of nature 
                  into your living spaces.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Delicate floral arrangements with seasonal blooms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cherry blossom branch displays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Light, airy wreaths with pastel accents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fresh herb and botanical arrangements</span>
                  </li>
                </ul>
              </Card>

              {/* Summer */}
              <Card className="p-8">
                <h3 className="font-serif text-3xl mb-4">Summer Serenity</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Embrace the lightness of summer with coastal-inspired touches and natural elements 
                  that create a breezy, relaxed atmosphere.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Driftwood and sea glass displays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Light, tropical greenery arrangements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Natural fiber wreaths and wall hangings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Outdoor entertaining area styling</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-4xl text-center mb-12">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="font-serif text-xl mb-4">Mindful Selection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We choose natural, sustainable materials that honor the season while maintaining 
                  your home's aesthetic integrity.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4">Custom Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each installation is tailored to your space, preferences, and the unique character 
                  of your home.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4">Complete Service</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From installation to removal, we handle everything so you can simply enjoy the 
                  transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Special Occasions */}
        <section className="py-20 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl mb-8">Special Occasions</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Beyond seasonal transitions, we also provide decoration services for life's special moments:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-serif text-xl mb-2">Celebrations</h4>
                <p className="text-muted-foreground">
                  Birthday parties, anniversaries, and milestone events
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-serif text-xl mb-2">Gatherings</h4>
                <p className="text-muted-foreground">
                  Dinner parties, cocktail events, and intimate gatherings
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-serif text-xl mb-2">Staging</h4>
                <p className="text-muted-foreground">
                  Open houses and property presentations
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-serif text-xl mb-2">Transitions</h4>
                <p className="text-muted-foreground">
                  Moving, renovations, and new beginnings
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fall Pumpkins Link */}
        <section className="py-12 px-6 lg:px-12 bg-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-4">Autumn Pumpkin Packages</h2>
            <p className="text-muted-foreground mb-6">View our curated pumpkin collections for fall</p>
            <Button asChild size="lg">
              <Link to="/seasoning/fall-pumpkins">View Pumpkin Packages</Link>
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6">Ready to Transform Your Space?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let us bring the beauty of the seasons into your home with our mindful decoration services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Request Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Seasoning;
