import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/structured-data";
import servicesHero from "@/assets/services-hero.jpg";
import budapestImage from "@/assets/pumpkin-grand-budapest-1.jpg";
import cozyCabinHero from "@/assets/package-cozy-cabin-hero.jpg";
import freshStartHero from "@/assets/package-fresh-start-hero.jpg";
import coastalCottageHero from "@/assets/package-coastal-cottage-hero.jpg";

const Seasoning = () => {
  return (
    <Layout>
      <SEO
        title="Seasonal Decorating | Victoria BC"
        description="Seasonal styling for the home through autumn, winter, spring, and summer. Designed, installed, and removed by hand across Greater Victoria."
        canonical="https://wabisabiservices.ca/seasoning"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Seasonal", url: "https://wabisabiservices.ca/seasoning" },
        ]}
      />
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
              The beauty of each season, brought quietly into your home
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Beyond our signature cleaning, we bring the essence of each season into your home. Our seasonal
              decorating work creates inviting, restful atmospheres that follow the natural rhythm of the year,
              held to the same quiet simplicity that runs through everything we do.
            </p>
          </div>
        </section>

        {/* Seasonal Services */}
        <section className="py-20 px-6 lg:px-12 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Fall */}
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <Link to="/seasoning/fall-pumpkins">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${budapestImage})`,
                    }}
                  />
                  <div className="p-8">
                    <h3 className="font-serif text-3xl mb-4 group-hover:text-primary transition-colors">Autumn Warmth</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Welcome the harvest with thoughtful touches that honour the season. We arrange displays
                      that bring the warmth of autumn indoors.
                    </p>
                    <ul className="space-y-3 text-muted-foreground mb-6">
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
                    <Button variant="outline">View Pumpkin Packages</Button>
                  </div>
                </Link>
              </Card>

              {/* Winter/Christmas */}
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <Link to="/seasoning/winter-holiday">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${cozyCabinHero})`,
                    }}
                  />
                  <div className="p-8">
                    <h3 className="font-serif text-3xl mb-4 group-hover:text-primary transition-colors">Winter Elegance</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Turn your home into a calm winter sanctuary with refined holiday touches that honour
                      tradition and keep to an unhurried beauty.
                    </p>
                    <ul className="space-y-3 text-muted-foreground mb-6">
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
                        <span>Ornamental displays in muted metallics</span>
                      </li>
                    </ul>
                    <Button variant="outline">View Winter Packages</Button>
                  </div>
                </Link>
              </Card>

              {/* Spring */}
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <Link to="/seasoning/spring-refresh">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${freshStartHero})`,
                    }}
                  />
                  <div className="p-8">
                    <h3 className="font-serif text-3xl mb-4 group-hover:text-primary transition-colors">Spring Renewal</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Mark new beginnings with fresh, light touches that bring the first stir of the garden
                      into your living spaces.
                    </p>
                    <ul className="space-y-3 text-muted-foreground mb-6">
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
                    <Button variant="outline">View Spring Packages</Button>
                  </div>
                </Link>
              </Card>

              {/* Summer */}
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <Link to="/seasoning/summer-serenity">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${coastalCottageHero})`,
                    }}
                  />
                  <div className="p-8">
                    <h3 className="font-serif text-3xl mb-4 group-hover:text-primary transition-colors">Summer Serenity</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Embrace the lightness of summer with coastal-inspired touches and natural elements 
                      that create a breezy, relaxed atmosphere.
                    </p>
                    <ul className="space-y-3 text-muted-foreground mb-6">
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
                    <Button variant="outline">View Summer Packages</Button>
                  </div>
                </Link>
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
                  Each display is shaped to your space, your preferences, and the character of your home.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4">Start to Finish</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We arrive, arrange, and return to take it all down, so the season is yours to enjoy.
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


        {/* CTA */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6">Ready to Welcome the Season?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Let us bring the beauty of the seasons into your home with our considered decorating work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Request a Private Consultation</Link>
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
