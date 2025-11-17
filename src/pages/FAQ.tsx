import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqHero from "@/assets/faq-hero.jpg";

const FAQ = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${faqHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Mindful Luxury Cleaning for Your Sacred Space
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {/* Getting Started */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-6">Getting Started with Our Services</h2>
                
                <AccordionItem value="unique">
                  <AccordionTrigger className="text-left">
                    What makes Wabi Sabi Services unique in Victoria's cleaning market?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We blend the Japanese philosophy of wabi-sabi - finding beauty in simplicity and imperfection - with eco-luxury cleaning practices. Our mindful approach transforms cleaning from a mundane task into a practice of creating harmonious, healthy living spaces. We use exclusively premium, non-toxic products and bring intention to every surface we touch, creating not just cleanliness but tranquility.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="areas">
                  <AccordionTrigger className="text-left">
                    Which areas of Victoria do you serve?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">We bring mindful luxury cleaning throughout Greater Victoria, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Oak Bay & Fairfield</li>
                      <li>James Bay & Downtown Victoria</li>
                      <li>Saanich & Gordon Head</li>
                      <li>Esquimalt & View Royal</li>
                      <li>Langford & Colwood</li>
                      <li>Sidney & North Saanich</li>
                      <li>Cadboro Bay & Cordova Bay</li>
                    </ul>
                    <p className="mt-3 italic">Travel fees may apply for locations beyond our standard service area. Please inquire about your specific location.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="booking">
                  <AccordionTrigger className="text-left">
                    How do I book your services?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">Booking your mindful cleaning experience is simple:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Online:</strong> Visit wabisabiservices.ca for 24/7 booking</li>
                      <li><strong>Phone:</strong> Call us at 778-800-2767</li>
                      <li><strong>Email:</strong> Contact info@wabisabiservices.ca</li>
                    </ul>
                    <p className="mt-3">We recommend booking 48-72 hours in advance for single services and one week ahead for recurring services to ensure your preferred time slot.</p>
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Service Levels */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-6">Understanding Our Service Levels</h2>
                
                <AccordionItem value="standard">
                  <AccordionTrigger className="text-left">
                    What's included in your Mindful Standard Clean?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Living Spaces & Bedrooms:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Mindful dusting of all surfaces, décor, and electronics</li>
                          <li>Vacuum carpets and area rugs with HEPA filtration</li>
                          <li>Mop hard floors with eco-luxury products</li>
                          <li>Clean and disinfect light switches and door handles</li>
                          <li>Remove cobwebs and dust ceiling fans</li>
                          <li>Attention to baseboards and window sills</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Bathrooms - Your Personal Spa:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Deep sanitization of toilets, tubs, showers, and sinks</li>
                          <li>Polish fixtures to a mindful shine</li>
                          <li>Disinfect all surfaces with plant-based products</li>
                          <li>Clean mirrors for clarity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Kitchen - The Heart of Your Home:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Clean and sanitize all countertops</li>
                          <li>Exterior cleaning of all appliances</li>
                          <li>Degrease stovetop, burners, and control knobs</li>
                          <li>Polish stainless steel to brilliance</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="deep">
                  <AccordionTrigger className="text-left">
                    What distinguishes your Deep Cleaning service?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">Our Deep Clean includes everything in the Standard Clean plus:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Detailed baseboards throughout</li>
                      <li>Interior window cleaning (ground level)</li>
                      <li>Light fixture and ceiling fan deep cleaning</li>
                      <li>Inside appliances (oven and refrigerator when empty)</li>
                      <li>Detailed grout and tile restoration</li>
                      <li>Behind accessible furniture and appliances</li>
                      <li>Wall spot-cleaning and mark removal</li>
                    </ul>
                    <p className="mt-3 italic">First-time clients who haven't had professional cleaning within 30 days should book our Deep Clean to establish a pristine baseline for ongoing maintenance.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specialized">
                  <AccordionTrigger className="text-left">
                    Do you offer specialized services?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">Yes, we provide:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Eco-Organization:</strong> 3-hour minimum for mindful decluttering</li>
                      <li><strong>Post-Construction Cleaning:</strong> Removing renovation dust with care</li>
                      <li><strong>Move-In/Move-Out:</strong> Comprehensive transition cleaning</li>
                      <li><strong>Seasonal Deep Cleans:</strong> Refresh your space with the seasons</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Pricing & Scheduling */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-6">Pricing & Scheduling</h2>
                
                <AccordionItem value="pricing">
                  <AccordionTrigger className="text-left">
                    How is pricing determined?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">Pricing is based on:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Home size (square footage and number of rooms)</li>
                      <li>Number of bathrooms</li>
                      <li>Service type (Standard, Deep, Specialized)</li>
                      <li>Frequency (weekly, bi-weekly, monthly, one-time)</li>
                    </ul>
                    <p className="mt-3">We offer significant discounts for recurring services - up to 20% off for weekly cleaning!</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="frequency">
                  <AccordionTrigger className="text-left">
                    What frequency should I choose?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <div className="space-y-3">
                      <p><strong>Weekly (20% discount):</strong> Ideal for busy families, pet owners, or those who value constant readiness</p>
                      <p><strong>Bi-weekly (15% discount):</strong> Perfect balance for most homes, maintaining cleanliness without daily maintenance</p>
                      <p><strong>Tri-weekly (12% discount):</strong> Good for smaller spaces or minimalist households</p>
                      <p><strong>Monthly (10% discount):</strong> Maintains baseline cleanliness for tidy households</p>
                      <p><strong>One-time:</strong> Deep cleans, special occasions, or trying our services</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cancellation">
                  <AccordionTrigger className="text-left">
                    What is your cancellation policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We understand life happens. Please provide 48 hours notice for cancellations or rescheduling to avoid a 50% service fee. Same-day cancellations incur the full service charge. We appreciate your understanding as this allows us to schedule fairly and honor our team's time.
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Products & Safety */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-6">Products & Safety</h2>
                
                <AccordionItem value="products">
                  <AccordionTrigger className="text-left">
                    What cleaning products do you use?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">We exclusively use eco-luxury cleaning products that are:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>100% non-toxic and biodegradable</li>
                      <li>Plant-based and hypoallergenic</li>
                      <li>Free from harsh chemicals, VOCs, and synthetic fragrances</li>
                      <li>Safe for children, pets, and sensitive individuals</li>
                      <li>Effective as or better than conventional products</li>
                    </ul>
                    <p className="mt-3">We can also accommodate fragrance-free preferences.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pets">
                  <AccordionTrigger className="text-left">
                    Are your services safe for my pets?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Absolutely! All our products are pet-safe, and our team is trained to work comfortably around animals. Please let us know about any pets during booking so we can prepare accordingly. We can work around your pet's routine and respect their spaces.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="insurance">
                  <AccordionTrigger className="text-left">
                    Are you insured and bonded?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, Wabi Sabi Services is fully insured and bonded for your peace of mind. All team members are background-checked and professionally trained. We treat your home with the same care and respect we give our own.
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Logistics */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-6">Service Logistics</h2>
                
                <AccordionItem value="duration">
                  <AccordionTrigger className="text-left">
                    How long will the cleaning take?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">Service duration varies by home size and service type:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Studio/1BR: 1.5-2.5 hours</li>
                      <li>2BR: 2-3 hours</li>
                      <li>3BR: 2.5-4 hours</li>
                      <li>4BR+: 3-5 hours</li>
                    </ul>
                    <p className="mt-3">Deep cleans require approximately 50% more time. We provide accurate estimates during booking.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="home">
                  <AccordionTrigger className="text-left">
                    Do I need to be home during cleaning?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Not at all! Many clients prefer us to clean while they're at work or running errands. We're happy to work with lockbox codes, door codes, or hidden keys. For first-time services, some clients prefer to be home to show us around and communicate any special requests.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="supplies">
                  <AccordionTrigger className="text-left">
                    Do I need to provide cleaning supplies?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    No! We bring all professional-grade supplies and equipment. We only ask that you provide a vacuum if you have specific filtration needs (like a pet-hair specialized vacuum) and that your home has basic utilities (running water, electricity).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="preparation">
                  <AccordionTrigger className="text-left">
                    How should I prepare for your visit?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-3">Minimal preparation is needed:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Clear surfaces of personal items and clutter</li>
                      <li>Secure pets or inform us of their location</li>
                      <li>Note any areas requiring special attention</li>
                      <li>Remove valuable or fragile items from cleaning areas</li>
                    </ul>
                    <p className="mt-3">We're happy to work around your schedule and lifestyle!</p>
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Satisfaction */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-6">Quality & Satisfaction</h2>
                
                <AccordionItem value="guarantee">
                  <AccordionTrigger className="text-left">
                    What is your satisfaction guarantee?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Your satisfaction is our priority. If you're not completely happy with any aspect of our service, please contact us within 24 hours. We'll return to address any concerns at no additional charge. Our goal is creating spaces that bring you joy and peace.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="special">
                  <AccordionTrigger className="text-left">
                    Can you accommodate special requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Absolutely! We believe every home and client is unique. Whether you need fragrance-free products, have specific cleaning preferences, require accommodation for allergies, or have areas needing extra attention - just let us know. We customize our approach to your needs.
                  </AccordionContent>
                </AccordionItem>
              </div>
            </Accordion>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FAQ;
