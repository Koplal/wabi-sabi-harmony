import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Services
          </h1>

          <p className="text-xl text-center text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
            Tailored care for every space—residential, commercial, and post-construction.
          </p>

          {/* Residential */}
          <section className="mb-24">
            <h2 className="font-serif text-4xl mb-8">Residential</h2>
            
            <div className="space-y-6 mb-8">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Maintenance Cleans</h3>
                <p className="text-muted-foreground">Weekly or bi-weekly service to keep your home serene and styled.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Deep Reset</h3>
                <p className="text-muted-foreground">Seasonal refresh for a truly immaculate foundation.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Moving Prep / Listing-Ready</h3>
                <p className="text-muted-foreground">Gallery-quality presentation for sale or move-in.</p>
              </div>
            </div>

            <div className="bg-secondary/30 p-8 rounded-sm">
              <h4 className="font-sans text-xs uppercase tracking-wider mb-4">Add-Ons</h4>
              <p className="text-sm text-muted-foreground">
                Inside fridge/oven · Linen refresh · Styling reset · Organization · Decluttering · Laundry · Dishes
              </p>
            </div>
          </section>

          {/* Commercial */}
          <section className="mb-24">
            <h2 className="font-serif text-4xl mb-8">Commercial</h2>
            
            <div className="space-y-6 mb-8">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Boutique Spaces</h3>
                <p className="text-muted-foreground">Offices, studios, and wellness centers maintained to hospitality standards.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Before/After Hours</h3>
                <p className="text-muted-foreground">Discreet service that doesn't interrupt your business flow.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Supply Management</h3>
                <p className="text-muted-foreground">Restock and inventory management included.</p>
              </div>
            </div>
          </section>

          {/* Post-Construction */}
          <section className="mb-24">
            <h2 className="font-serif text-4xl mb-8">Post-Construction</h2>
            
            <div className="space-y-6">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">HEPA Vacuuming</h3>
                <p className="text-muted-foreground">Ceiling to floor dust capture using professional-grade equipment.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Fine Dust Removal</h3>
                <p className="text-muted-foreground">Meticulous cleaning of every surface, ledge, and corner.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Glass & Millwork Detailing</h3>
                <p className="text-muted-foreground">Streak-free windows and pristine woodwork.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Adhesive Removal</h3>
                <p className="text-muted-foreground">Safe removal of labels, tape, and construction residue.</p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-serif text-xl mb-2">Stone-Safe Finishing</h3>
                <p className="text-muted-foreground">Specialized care for marble, quartzite, and natural stone.</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center space-x-4">
            <Button asChild size="lg">
              <Link to="/contact">Request a Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/book">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
