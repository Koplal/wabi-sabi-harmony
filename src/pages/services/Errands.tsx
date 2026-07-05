import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ServiceSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import errandsHero from "@/assets/errands-hero.jpg";

const Errands = () => {
  return (
    <Layout>
      <SEO 
        title="Concierge & Errand Services Victoria BC"
        description="Errand and concierge services in Victoria, BC. Grocery shopping, home restocking, mail, pet care coordination, and household management."
        keywords="errand service Victoria BC, concierge service Victoria, personal assistant Victoria, grocery delivery Victoria"
      />
      <ServiceSchema 
        name="Concierge & Errand Services"
        description="Save time with professional errand services. We handle grocery shopping, household restocking, dry cleaning, mail services, and more in Victoria, BC."
        serviceType="Concierge Service"
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Services", url: "https://wabisabiservices.ca/services" },
          { name: "Errands", url: "https://wabisabiservices.ca/services/errands" },
        ]}
      />
      <div className="relative">
        <div className="w-full h-[500px] overflow-hidden">
          <img 
            src={errandsHero} 
            alt="Fresh groceries and flowers in reusable bag on clean countertop" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-center">
            Household Errands & Support
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 leading-relaxed">
            We handle life's details so you can focus on what matters
          </p>

          <div className="prose prose-lg max-w-none space-y-12">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your time is your most considered luxury. Let us serve as your discreet concierge for the errands and household details that quietly consume the day.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                From sourcing fine groceries to managing a household in your absence, we provide reliable, vetted, white-glove support—particularly for estate and second-home owners who need a trusted presence keeping everything in quiet order.
              </p>
            </div>

            <section>
              <h2 className="font-serif text-3xl md:text-4xl mb-8">Services We Provide</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-4">Grocery Shopping & Delivery</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We shop with care, selecting fresh produce and quality items just as you would. Provide a list or let us know your preferences—we handle the rest.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Weekly or as-needed grocery runs</li>
                    <li>Specialty item sourcing</li>
                    <li>Meal prep ingredient delivery</li>
                    <li>Pantry restocking</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Meal Preparation</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Take the stress out of daily cooking with personalized meal preparation services. We handle the planning, shopping, and cooking so you can enjoy nutritious, home-cooked meals without the time investment.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Weekly meal planning based on dietary preferences</li>
                    <li>Batch cooking and portioning for busy weeks</li>
                    <li>Specialty diet accommodation (gluten-free, vegan, keto, etc.)</li>
                    <li>Meal packaging and refrigerator organization</li>
                    <li>Preparation of family dinners or entertaining menus</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Prescription & Pharmacy Runs</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We pick up prescriptions, over-the-counter items, and health supplies so you don't have to make the trip.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Package & Mail Services</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Waiting for deliveries? We can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Accept packages and deliveries</li>
                    <li>Drop off returns and shipments</li>
                    <li>Handle post office runs</li>
                    <li>Sort and organize incoming mail</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Dry Cleaning & Laundry Drop-Off</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We coordinate pickup and delivery of dry cleaning, alterations, and laundry services.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Pet Care Support</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Your pets deserve attention even when you're busy:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Vet appointment transportation</li>
                    <li>Pet supply shopping</li>
                    <li>Grooming appointment coordination</li>
                    <li>Dog walking arrangements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Household Restocking</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We keep your household essentials stocked:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Cleaning supplies</li>
                    <li>Paper products</li>
                    <li>Toiletries and personal care items</li>
                    <li>Seasonal necessities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Gift & Special Occasion Support</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Celebrations shouldn't add stress:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Gift shopping and wrapping</li>
                    <li>Card mailing</li>
                    <li>Party supply pickup</li>
                    <li>Floral arrangement delivery</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Home Maintenance Coordination</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We can be your point person for routine home needs:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Scheduling service appointments</li>
                    <li>Letting in contractors or service providers</li>
                    <li>Hardware store runs for supplies</li>
                    <li>Light bulb and filter replacements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Vehicle Services</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Keep your car maintained without the hassle:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Drop-off and pickup for maintenance</li>
                    <li>Car wash and detailing coordination</li>
                    <li>Registration and inspection appointments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Moving & Donation Assistance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We handle the logistics of moving items in or out of your home—whether that's coordinating donations, arranging pickups, or dropping off items to charity.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-secondary/30 rounded-lg p-10">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">How It Works</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl mb-2">Flexible Scheduling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Weekly, bi-weekly, or as-needed. We adapt to your household's rhythm.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-2">Transparent Communication</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You'll receive updates as tasks are completed, along with receipts and any relevant details.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-2">Discreet & Reliable</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We handle your errands with the same care and privacy you'd expect for your home.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Who This Is For</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This service is ideal for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Busy professionals who don't have time for daily errands</li>
                <li>Families managing multiple schedules</li>
                <li>Seniors who need support with logistics</li>
                <li>Anyone recovering from illness or injury</li>
                <li>People who value their time and want to reclaim their weekends</li>
              </ul>
            </section>

            <section className="bg-secondary/30 rounded-lg p-10 text-center">
              <h2 className="font-serif text-3xl mb-6">Let Us Handle the Details</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We begin with a $150 in-home consultation, credited in full toward your first service, to learn how your household runs and where we can lighten the load.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Request a Private Consultation
                  </Button>
                </Link>
                <Link to="/book">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Book a Service
                  </Button>
                </Link>
              </div>
            </section>

            <p className="text-center text-muted-foreground">
              <Link to="/areas" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Serving Victoria's finest neighbourhoods →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Errands;
