import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-center">
            Services
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
            Tailored Support for Your Home
          </p>

          <p className="text-lg text-center text-muted-foreground mb-20 max-w-4xl mx-auto leading-relaxed">
            Wabi Sabi Services offers elevated home care for discerning clients throughout Greater Victoria. We focus on three core services: meticulous cleaning, thoughtful organization, and the small tasks that keep a household running smoothly.
          </p>

          <div className="space-y-20">
            {/* Home Cleaning */}
            <div className="bg-card border border-border rounded-lg p-10">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Home Cleaning</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Regular care that goes beyond surface cleaning. We maintain your home with the same attention to detail you would—if you had the time. Our approach combines thorough cleaning with thoughtful touches that make your space feel genuinely cared for.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Ideal for: Weekly or bi-weekly ongoing service
              </p>
            </div>

            {/* Professional Organizing & Decluttering */}
            <div className="bg-card border border-border rounded-lg p-10">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Professional Organizing & Decluttering</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Collaborative sessions to transform spaces that need more than maintenance—they need systems. We work alongside you to sort, simplify, and create organizational approaches that are sustainable for your actual lifestyle.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Ideal for: Closets, pantries, home offices, and entryways that have become overwhelming
              </p>
            </div>

            {/* Household Errands */}
            <div className="bg-card border border-border rounded-lg p-10">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Household Errands</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The practical support busy lives require. Grocery runs, dry cleaning pickup, package coordination, and other daily tasks that consume time and mental energy.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Ideal for: Clients who need reliable help managing life's details
              </p>
            </div>
          </div>

          <div className="my-20" />

          {/* How We Work */}
          <div className="bg-secondary/30 rounded-lg p-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">How We Work</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              Every client relationship begins with a complimentary home consultation. We visit your space, understand your needs and preferences, and design a service plan specific to your household. Our approach is flexible, discreet, and built on consistent, excellent care.
            </p>
            <Button asChild size="lg">
              <Link to="/book">Book Your Consultation</Link>
            </Button>
          </div>

          <p className="text-center text-muted-foreground mt-12 italic">
            All services are customized based on your needs. Contact us to discuss how we can support your home.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
