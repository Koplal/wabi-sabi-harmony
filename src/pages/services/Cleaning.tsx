import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cleaningImage from "@/assets/residential-service.jpg";

const Cleaning = () => {
  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-center">
            Professional Cleaning Services
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto">
            Comprehensive cleaning solutions for homes and businesses throughout Vancouver
          </p>

          <div className="mb-20">
            <img 
              src={cleaningImage} 
              alt="Professional cleaning service in progress"
              className="w-full h-[400px] object-cover rounded-lg mb-12"
            />
          </div>

          <div className="prose prose-lg max-w-none space-y-16">
            {/* Residential Cleaning */}
            <section>
              <h2 className="font-serif text-4xl mb-8">Residential Cleaning</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-4">Regular Maintenance Cleaning</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Consistent care that keeps your home feeling fresh without the effort. We handle the routine so you don't have to think about it.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>All surfaces dusted and wiped down</li>
                    <li>Floors vacuumed and mopped</li>
                    <li>Kitchens cleaned (counters, sinks, appliances)</li>
                    <li>Bathrooms cleaned and sanitized</li>
                    <li>Beds made and linens straightened</li>
                    <li>General tidying throughout</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Deep Cleaning</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    For when your home needs more than surface attention. We get into the details that make the difference—baseboards, behind appliances, inside cabinets.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Ideal for spring refreshes, preparing for events, or just resetting your space to feel genuinely fresh.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Move-In/Move-Out Cleaning</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Moving is stressful enough. We handle the thorough cleaning so your new place feels ready or your old place passes inspection.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Full home deep clean, top to bottom</li>
                    <li>Inside all cabinets and appliances</li>
                    <li>Walls, baseboards, and trim</li>
                    <li>Windows and window tracks</li>
                    <li>All floors scrubbed</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Commercial Cleaning */}
            <section>
              <h2 className="font-serif text-4xl mb-8">Commercial Cleaning</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-4">Office Spaces</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Your workspace should reflect the quality of your business. We maintain professional environments that feel welcoming for both staff and clients.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Reception and common areas</li>
                    <li>Individual offices and workstations</li>
                    <li>Meeting rooms</li>
                    <li>Kitchens and break rooms</li>
                    <li>Restrooms</li>
                    <li>Floor care (vacuuming, mopping)</li>
                    <li>Trash removal and recycling</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Retail Spaces</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    First impressions matter. We keep your retail environment spotless, so your customers focus on your products, not the dust.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Sales floor cleaning</li>
                    <li>Display maintenance</li>
                    <li>Window cleaning (interior and exterior)</li>
                    <li>Fitting rooms</li>
                    <li>Back-of-house areas</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Medical & Wellness Spaces</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Healthcare settings require more than standard cleaning. We follow proper sanitation protocols to maintain the highest standards for patient care environments.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Exam and treatment rooms</li>
                    <li>Waiting areas</li>
                    <li>Restrooms</li>
                    <li>Medical-grade disinfection</li>
                    <li>Biohazard disposal (as needed)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Specialty Cleaning */}
            <section>
              <h2 className="font-serif text-4xl mb-8">Specialty Cleaning Services</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-4">Post-Construction Cleaning</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Renovations create mess. We handle the dust, debris, and fine details so your newly renovated space is move-in ready.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Dust removal from all surfaces</li>
                    <li>Window cleaning (interior/exterior)</li>
                    <li>Floor scrubbing and polishing</li>
                    <li>Paint and adhesive removal</li>
                    <li>Cabinet and fixture cleaning</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Event Cleaning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Hosting should be enjoyable, not exhausting. We handle pre-event setup cleaning and post-event cleanup so you can focus on your guests.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Vacation Rental Turnover</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Fast, thorough turnovers between guests. We clean, restock, and prepare your property so it's guest-ready on schedule.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Full property cleaning</li>
                    <li>Linen changes</li>
                    <li>Restocking essentials</li>
                    <li>Pre-arrival inspections</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-secondary/30 rounded-lg p-10 text-center">
              <h2 className="font-serif text-3xl mb-6">Ready to Experience the Difference?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Every cleaning service is tailored to your specific needs. Schedule a complimentary consultation to discuss how we can support your space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book">
                  <Button size="lg" className="w-full sm:w-auto">
                    Book a Service
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cleaning;
