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
            <h2 className="font-serif text-4xl mb-4">Residential Cleaning</h2>
            <p className="text-muted-foreground mb-10 max-w-3xl">
              Your home is your sanctuary. We treat it with the respect and care it deserves, using mindful cleaning practices that create a healthy, peaceful environment for you and your family.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Regular Maintenance</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Keep your home consistently fresh and inviting with our scheduled cleaning services.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Weekly, bi-weekly, or monthly schedules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Full home cleaning including all rooms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Kitchen deep clean and sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Bathroom disinfection and shine</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Dusting all surfaces and baseboards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vacuuming carpets and rugs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Mopping all hard floors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Trash removal and recycling</span>
                  </li>
                </ul>
                <p className="font-semibold text-center">Starting at $120 for apartments</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Deep Cleaning</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Comprehensive seasonal cleaning that reaches every corner and refreshes your entire home.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Everything in regular cleaning plus:</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Inside appliances (oven, refrigerator)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Window sills and tracks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Light fixtures and ceiling fans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Behind and under furniture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Detailed baseboard cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Door frames and switch plates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vent and register cleaning</span>
                  </li>
                </ul>
                <p className="font-semibold text-center">Starting at $250 for apartments</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Move-In/Move-Out</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Ensure your new beginning starts fresh or leave your space pristine for the next occupants.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Complete empty-home deep clean</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cabinet interiors and exteriors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>All appliances inside and out</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Complete wall washing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Detailed bathroom sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Carpet edge detailing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Garage and storage areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Final inspection walkthrough</span>
                  </li>
                </ul>
                <p className="font-semibold text-center">Starting at $350 for apartments</p>
              </div>
            </div>
          </section>

          {/* Commercial */}
          <section className="mb-24">
            <h2 className="font-serif text-4xl mb-4">Commercial Cleaning</h2>
            <p className="text-muted-foreground mb-10 max-w-3xl">
              Create a professional environment that impresses clients and inspires productivity. Our commercial cleaning services are designed to maintain the highest standards while minimizing disruption to your business.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Office Spaces</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Keep your workplace pristine and professional with regular cleaning services.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Desk and workstation sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Conference room detailing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Kitchen and break room cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Restroom sanitization and restocking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Floor care (vacuum, mop, polish)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Trash removal and recycling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Window and glass cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>High-touch surface disinfection</span>
                  </li>
                </ul>
                <p className="font-semibold text-center">Custom pricing based on square footage</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Retail Spaces</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Maintain an inviting atmosphere that encourages customers to browse and buy.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sales floor maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Display case and shelf cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Storefront window cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fitting room sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Customer area maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Back office cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Storage area organization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Entrance and exit detailing</span>
                  </li>
                </ul>
                <p className="font-semibold text-center">Flexible scheduling available</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Medical & Wellness</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Specialized cleaning for healthcare facilities requiring the highest hygiene standards.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Medical-grade sanitization protocols</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Waiting room deep cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Treatment room disinfection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Reception area maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Restroom hospital-grade cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Proper biohazard disposal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Equipment and surface sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>HEPA filtration vacuuming</span>
                  </li>
                </ul>
                <p className="font-semibold text-center">Compliant with health regulations</p>
              </div>
            </div>
          </section>

          {/* Specialty Services */}
          <section className="mb-24">
            <h2 className="font-serif text-4xl mb-4">Specialty Services</h2>
            <p className="text-muted-foreground mb-10 max-w-3xl">
              Beyond regular cleaning, we offer specialized services for unique situations and requirements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Post-Construction Cleaning</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Remove dust, debris, and construction residue to reveal your beautiful new space.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Construction dust removal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Window and frame cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Floor preparation and cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fixture and fitting polishing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Paint overspray removal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>HVAC vent cleaning</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Event Cleaning</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Pre and post-event cleaning to ensure your venue is perfect for guests.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Pre-event preparation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>During-event maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Post-event restoration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Kitchen and catering cleanup</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Furniture arrangement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Decoration removal assistance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-2xl mb-4 text-center">Vacation Rental Cleaning</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Quick turnaround cleaning for Airbnb and vacation properties.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Between-guest deep cleaning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Linen service available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Restocking supplies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Property inspection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Key management services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>24/7 emergency cleaning</span>
                  </li>
                </ul>
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