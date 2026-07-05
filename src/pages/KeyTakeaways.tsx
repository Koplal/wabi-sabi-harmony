import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function KeyTakeaways() {
  return (
    <Layout>
      <SEO
        title="What to Expect — Wabi Sabi Services"
        description="How we work, what we value, and what it's like to have Wabi Sabi Services care for your home in Greater Victoria. Quiet, mindful, fully insured."
        canonical="https://wabisabiservices.ca/key-takeaways"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "What to Expect", url: "https://wabisabiservices.ca/key-takeaways" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "What to Expect", url: "https://wabisabiservices.ca/key-takeaways" },
        ]}
      />

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-6">What to Expect</h1>
        <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
          A quiet account of how we work, what we hold to, and what it feels like
          to hand your home to someone who treats it as their own.
        </p>

        <div className="prose prose-lg max-w-none space-y-16">
          <section>
            <h2 className="font-serif text-3xl mb-5">Our Philosophy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The name comes from a Japanese idea: that there is beauty in things
              kept with care, simply and without fuss. We bring that spirit to the
              homes we look after. A room should feel calm when you walk into it—not
              because it has been scrubbed within an inch of its life, but because
              everything is where it belongs and nothing is asking for your
              attention.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Most of our clients are accomplished people with full lives and
              homes they love. What they lack is time. We give it back. We maintain
              a home the way you would yourself, if the days were longer.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-8">What We Hold To</h2>
            <div className="grid gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Care over speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We work at the pace a home deserves. Victoria's finer houses are
                    built of materials that punish haste—marble, limestone, heritage
                    windows, fine millwork—and we choose surface-safe methods that
                    protect both the finish and the character that makes each home its
                    own.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Discretion, without exception</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Each member of our team is carefully vetted, background-checked,
                    and fully insured and bonded. Many clients trust us with keys and
                    the run of homes they cannot always be present to manage. What we
                    see in your home stays in your home.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Kinder products, properly chosen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We favour eco-conscious, low-toxicity products that are gentle on
                    children, pets, and sensitive households—and matched to the
                    surface they touch, so nothing is compromised in the name of being
                    green.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">A plan made for your home</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    No two homes keep the same rhythm. We build the work around how you
                    actually live—your schedule, your preferences, the small things
                    that matter to you—rather than a fixed checklist applied to every
                    house.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-5">How It Begins</h2>
            <p className="text-muted-foreground leading-relaxed">
              Everything starts with a conversation in your home. We walk the rooms
              together, listen to what you need, and learn the particulars—the
              surfaces that need a careful hand, the spaces that matter most, the way
              you like things kept. From there we propose a plan and a rhythm that
              suits you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The visit is a <strong>$150 in-home consultation, credited in full
              toward your first service.</strong> It is simply the right way to begin
              a relationship built on trust.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-5">Who We Look After</h2>
            <p className="text-muted-foreground leading-relaxed">
              We care for the homes of busy professionals who would rather spend their
              hours elsewhere; families who want a healthy, safe environment for their
              children; and estate and second-home owners who need a discreet eye on
              the house while they are away. If you value a home that feels like a
              retreat the moment you walk in, you are exactly who we had in mind.
            </p>
          </section>

          <section className="bg-muted/30 p-8 md:p-10 rounded-lg not-prose">
            <h2 className="font-serif text-3xl mb-4">Let's begin with a conversation</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              If this is the kind of care you have been looking for, we would be glad
              to meet you and your home.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-primary text-primary-foreground px-7 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Request a Private Consultation
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
}
