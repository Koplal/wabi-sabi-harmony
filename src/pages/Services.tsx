import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import servicesHero from "@/assets/services-hero.jpg";

const Services = () => {
  return (
    <Layout>
      <div className="relative">
        <div className="w-full h-[500px] overflow-hidden">
          <img 
            src={servicesHero} 
            alt="Beautifully maintained home with organized shelving and natural light" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-center">
            Our Services
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-20 leading-relaxed max-w-3xl mx-auto">
            From regular cleaning to comprehensive organization and household support, we offer tailored solutions that make your life easier
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Link to="/services/cleaning" className="group">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl group-hover:text-sage transition-colors">
                    Cleaning Services
                  </CardTitle>
                  <CardDescription className="text-base">
                    Residential, commercial, and specialty cleaning solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    From regular maintenance to deep cleans and post-construction cleanup.
                  </p>
                  <Button variant="link" className="p-0">
                    Explore Cleaning Services →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/services/organizing" className="group">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl group-hover:text-sage transition-colors">
                    Professional Organizing
                  </CardTitle>
                  <CardDescription className="text-base">
                    Decluttering and systems that actually work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create functional spaces that reduce mental load and support your daily life.
                  </p>
                  <Button variant="link" className="p-0">
                    Explore Organizing Services →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/services/errands" className="group">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl group-hover:text-sage transition-colors">
                    Household Errands
                  </CardTitle>
                  <CardDescription className="text-base">
                    We handle life's details for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    From grocery shopping to prescription pickups and home maintenance coordination.
                  </p>
                  <Button variant="link" className="p-0">
                    Explore Errand Services →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          <section className="mb-20 bg-secondary/30 rounded-lg p-10">
            <h2 className="font-serif text-4xl mb-8 text-center">Why Wabi Sabi Services?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-serif text-xl mb-3">Holistic Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We don't just clean—we create environments informed by psychology and hospitality standards that reduce your mental load.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Consistent Care</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You work with the same professional each visit, ensuring familiarity with your preferences and home.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Flexible Solutions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every service plan is tailored to your needs—whether that's weekly maintenance, one-time organizing, or ongoing errand support.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Complete Discretion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is paramount. What we see in your home stays private, always.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-accent/20 rounded-lg p-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Every service begins with a complimentary consultation. We'll discuss your needs and create a plan that works for your home and schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto">
                  Book a Consultation
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
