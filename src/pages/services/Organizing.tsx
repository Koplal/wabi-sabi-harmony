import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Organizing = () => {
  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-center">
            Professional Organizing & Decluttering
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 leading-relaxed">
            Transform your space from overwhelming to functional
          </p>

          <div className="prose prose-lg max-w-none space-y-12">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You don't need more storage solutions. You need a system that actually works for how you live.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Our organizing services go beyond just tidying up. We help you create functional spaces that reduce decision fatigue, minimize visual clutter, and genuinely make your daily routines easier.
              </p>
            </div>

            <section>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">What We Offer</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-4">Whole-Home Organization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We assess your entire home, identify what's working and what isn't, and create systems that reduce the mental load of maintaining order.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Room-Specific Solutions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Sometimes one area needs focused attention:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li><strong>Kitchens:</strong> Pantry organization, cabinet systems, workflow optimization</li>
                    <li><strong>Closets:</strong> Wardrobe curation, seasonal storage, accessible systems</li>
                    <li><strong>Home Offices:</strong> Paper management, filing systems, workspace flow</li>
                    <li><strong>Garages & Storage Areas:</strong> Categorizing, shelving, accessibility</li>
                    <li><strong>Children's Spaces:</strong> Toy rotation, easy-access systems, teaching organization habits</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Decluttering Support</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Letting go is hard. We guide you through the process without judgment, helping you identify what genuinely serves your life and what's just taking up space.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We'll handle donation drop-offs, recycling coordination, and disposal—so you're not left with bags sitting in your hallway.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Move Preparation & Unpacking</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Moving is the perfect time to start fresh. We help you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Declutter before packing</li>
                    <li>Pack strategically by category and room</li>
                    <li>Unpack and organize your new space efficiently</li>
                    <li>Set up functional systems from day one</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-4">Digital Organization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Physical clutter isn't the only kind that drains us. We offer support organizing digital files, photo libraries, and email inboxes—creating systems that are easy to maintain.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-secondary/30 rounded-lg p-10">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">How It Works</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl mb-2">1. Consultation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We walk through your space, discuss pain points, and understand your goals. No judgment, just solutions.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-2">2. Planning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We create a realistic plan tailored to your lifestyle, budget, and timeline.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-2">3. Implementation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We do the work—sorting, categorizing, arranging. You can be as involved or hands-off as you prefer.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-2">4. Maintenance Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We provide clear instructions and follow-up support so your systems stay functional long-term.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Why This Matters</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Clutter isn't just visual noise. Research shows it increases cortisol levels, impairs focus, and makes decision-making harder. An organized space doesn't just look better—it genuinely helps you think more clearly and feel more in control.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We're not here to create magazine-perfect spaces. We're here to build systems that work for your real life—so your home supports you instead of overwhelming you.
              </p>
            </section>

            <section className="bg-secondary/30 rounded-lg p-10 text-center">
              <h2 className="font-serif text-3xl mb-6">Ready to Reclaim Your Space?</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Schedule a complimentary consultation to discuss your organizing needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book">
                  <Button size="lg" className="w-full sm:w-auto">
                    Book a Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Ask a Question
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

export default Organizing;
