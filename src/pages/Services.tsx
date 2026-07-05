import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, ItemListSchema, ServiceSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import servicesHero from "@/assets/services-hero.jpg";

const Services = () => {
  return (
    <Layout>
      <SEO
        title="Our Services"
        description="Professional cleaning, organizing, and concierge services in Victoria, BC. Residential cleaning, commercial cleaning, home organizing, and errand services."
        canonical="https://wabisabiservices.ca/services"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Services", url: "https://wabisabiservices.ca/services" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Services", url: "https://wabisabiservices.ca/services" },
        ]}
      />
      <ItemListSchema
        items={[
          { name: "Cleaning Services", url: "https://wabisabiservices.ca/services/cleaning" },
          { name: "Professional Organizing", url: "https://wabisabiservices.ca/services/organizing" },
          { name: "Household Errands", url: "https://wabisabiservices.ca/services/errands" },
        ]}
      />
      <ServiceSchema
        name="Cleaning Services"
        description="Residential, commercial, and specialty cleaning for Victoria's most distinguished homes, from regular maintenance to deep cleans and post-construction care."
        serviceType="House Cleaning"
      />
      <ServiceSchema
        name="Professional Organizing"
        description="Decluttering and household systems that reduce mental load and support daily life across Greater Victoria, BC."
        serviceType="Home Organizing"
      />
      <ServiceSchema
        name="Household Errands"
        description="Discreet errand running and household coordination for clients across Greater Victoria, BC."
        serviceType="Concierge Service"
      />
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
            White-glove cleaning, considered organization, and discreet household support for Victoria's most distinguished homes. Every engagement is bespoke, estate-capable, and tailored to the way you live.
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
                <h3 className="font-serif text-xl mb-3">Estate-Capable Expertise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From heritage residences to waterfront estates, we are equipped for fine materials and demanding homes—marble, limestone, heritage windows, and salt-air-exposed surfaces handled with museum-level care.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">A Dedicated, Vetted Professional</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are paired with the same carefully vetted, fully insured professional each visit—someone who comes to know your home, your preferences, and your standards intimately.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Bespoke Solutions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every engagement is composed around your home and cadence—ongoing care plans, seasonal resets, or full concierge support for absentee and estate owners.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">NDA-Grade Discretion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is absolute. Our team works quietly in the background, and what we see in your home remains entirely confidential—always.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-accent/20 rounded-lg p-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Begin with a Private Consultation</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Every engagement opens with a $150 in-home consultation, credited in full toward your first service. We listen, study your home and its materials, and compose a plan tailored to your standards and your schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Request a Private Consultation
                </Button>
              </Link>
              <Link to="/book">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Book Online
                </Button>
              </Link>
            </div>
          </section>

          <p className="text-center text-muted-foreground mt-16">
            <Link to="/areas" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Serving Victoria's finest neighbourhoods →
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
