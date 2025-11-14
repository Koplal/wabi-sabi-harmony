import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ritualHero from "@/assets/ritual-hero.jpg";

const Ritual = () => {
  return (
    <Layout>
      <div className="relative">
        <div className="w-full h-[500px] overflow-hidden">
          <img 
            src={ritualHero} 
            alt="Hands arranging fresh sage and natural elements on wooden surface" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-center">
            The Ritual
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-20 leading-relaxed">
            Our Approach to Caring for Your Home
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            At Wabi Sabi Services, we don't follow checklists. We follow a rhythm—one that's informed by environmental psychology, refined through hospitality standards, and tailored to how you actually live.
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed mb-20">
            Every service is designed to reduce your mental load while creating the kind of calm that comes from knowing your home is genuinely cared for.
          </p>

          {/* The Foundation */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">The Foundation: Your Consultation</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We begin every client relationship with a complimentary home consultation. This isn't a quote—it's a conversation.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We walk through your space together, discuss what's working and what isn't, and understand your priorities. Do you need consistent weekly maintenance? Help organizing a specific area? Support with daily tasks that pile up?
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From this visit, we design a service plan specific to your household—one that's flexible enough to adapt as your needs change.
            </p>
          </div>

          {/* What to Expect */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">What to Expect</h2>

            <div className="space-y-12">
              <div>
                <h3 className="font-serif text-2xl mb-4">Consistency</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You'll work with the same professional each visit. We believe relationships matter, and familiarity means we understand your home's rhythm, your preferences, and the small details that make a difference.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl mb-4">Thoughtful Care</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our approach goes beyond cleaning surfaces. Towels are presented thoughtfully. Products are placed with intention. Seasonal details—like subtle scents or how light moves through your space—are considered. These aren't add-ons; they're how we work.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl mb-4">Communication</h3>
                <p className="text-muted-foreground leading-relaxed">
                  After each service, you'll receive a brief update. If something needs your attention—a burnt-out bulb, a delivery that arrived—we let you know. If you have preferences or adjustments, we adapt. This is a partnership, not a transaction.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl mb-4">Discretion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  What we see in your home stays private. Always. Your trust is the foundation of everything we do.
                </p>
              </div>
            </div>
          </div>

          {/* Our Philosophy */}
          <div className="mb-20 bg-secondary/30 rounded-lg p-10">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Our Philosophy</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We're informed by research showing that organized environments reduce stress and improve focus—but we're also practical. Perfection isn't sustainable.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our goal isn't to create a showroom. It's to create a home that functions smoothly, feels calm, and supports your life without requiring constant attention.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Small, consistent care compounds over time. That's the ritual.
            </p>
          </div>

          {/* Seasonal Transitions */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Seasonal Transitions</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Throughout the year, we adjust our approach to align with how you live. Lighter linens in summer. Attention to entryways during rainy season. Suggestions for when it's time to rotate outdoor furniture or refresh storage systems.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These aren't upsells—they're part of understanding that homes are living spaces that shift with the seasons.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Ready to Begin?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              If this approach resonates with you, we'd love to meet your home.
            </p>
            <Button asChild size="lg">
              <Link to="/book">Book Your Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ritual;
