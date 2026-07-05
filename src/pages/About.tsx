import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Leaf, Lock, Gem, Wind } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";

const About = () => {
  return (
    <Layout>
      <SEO
        title="About Us"
        description="Learn about Wabi Sabi Services and our approach to mindful luxury cleaning in Victoria, BC, founded on environmental psychology and hospitality standards."
        keywords="about Wabi Sabi Services, cleaning company Victoria BC, professional cleaners Victoria"
        canonical="https://wabisabiservices.ca/about"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "About", url: "https://wabisabiservices.ca/about" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "About", url: "https://wabisabiservices.ca/about" },
        ]}
      />
      <div className="relative">
        <div className="w-full h-[500px] overflow-hidden">
          <img 
            src={aboutHero} 
            alt="Serene minimalist interior space with natural light" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            About Wabi Sabi Services
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-center">
              Your Home Should Support Your Life, Not Add To It
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              I founded Wabi Sabi Services with a simple belief: your home should work for you, not against you.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              While completing my Master's in Social Psychology with a minor in Business, I became fascinated by how profoundly our physical environments affect us. Research shows that visual clutter doesn't just look messy—it actively impairs our ability to think clearly and increases stress. Meanwhile, organized spaces create calm and give us a sense of control.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              I kept meeting capable, accomplished people who lived in beautiful homes that somehow still felt chaotic. They had the resources and the taste—but not the bandwidth to keep up. I remember one family in particular: successful professionals in a stunning home, drowning in daily details. They didn't just need cleaning—they needed someone to handle the errands, the organizing, the hundred small tasks that accumulate when life gets busy.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              That's when I realized there was space for something different.
            </p>

            <div className="my-20" />

            <h2 className="font-serif text-3xl md:text-4xl mb-6">What We Do</h2>

            <p className="text-muted-foreground leading-relaxed">
              Wabi Sabi Services brings together environmental psychology and practical household management. The name reflects the Japanese philosophy of finding beauty in simplicity. We apply this practically: creating homes that actually function without adding to your mental load.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              We don't just clean your home. We maintain it the way you would—if you had the time.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Beyond standard cleaning, we offer professional organizing and decluttering for spaces that need real solutions, not just surface attention. We also provide errand running and household support for clients who need help managing life's details. Every service—from how we present towels to how we organize a pantry—is informed by understanding how small environmental changes reduce mental load and create genuine calm.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              For estate and second-home owners, we serve as a discreet concierge—keeping a watchful eye while you're away, coordinating the household, and keeping your home immaculate and ready for the moment you return. Many of our clients entrust us with keys, schedules, and the care of homes they cannot always be present to manage themselves.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Victoria's most distinguished homes are built of irreplaceable materials—marble and limestone, heritage windows, fine millwork, and natural stone weathered by salt air. We bring genuine material and heritage expertise to their care, choosing surface-safe methods that protect both the finish and the character that makes each home singular.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              And through all of it, discretion is absolute. We work quietly, respect your privacy without exception, and treat everything we encounter in your home as entirely confidential.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              We're here to handle what needs handling, so your home supports your life instead of adding to it.
            </p>

            <div className="my-20" />

            <h2 className="font-serif text-3xl md:text-4xl mb-6">The Promise</h2>

            <p className="text-muted-foreground leading-relaxed">
              Your home should feel like a retreat when you walk through the door. It should support your focus, your rest, and your peace.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              That is what we create: environments that work for you, not only clean surfaces. You deserve more than a tidy house. You deserve a home that gives something back.
            </p>

            <div className="my-20" />

            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <Wind className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    <span className="font-serif text-xl">Mindful Presence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We approach every space with focused attention and care, treating your home with the same respect we'd give our own.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <Leaf className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    <span className="font-serif text-xl">Environmental Care</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We use eco-conscious products and methods that are safe for your family, pets, and the planet.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <Lock className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    <span className="font-serif text-xl">Discretion & Trust</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is absolute. Each member of our team is carefully vetted and fully insured, and what we see in your home stays entirely confidential—the soul of discretion for homes where it matters most.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <Gem className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    <span className="font-serif text-xl">Heritage & Material Mastery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Quality over speed, always. From marble and limestone to heritage windows and fine millwork, we bring museum-level, surface-safe care to the materials that make a home irreplaceable.
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-muted-foreground italic">
              Wabi Sabi Services serves discerning clients throughout Greater Victoria, including Oak Bay, Uplands,
              Rockland, North Saanich, Fairfield, the Westshore and Langford (Bear Mountain), and Metchosin.{" "}
              <Link to="/areas" className="not-italic underline underline-offset-4 hover:text-foreground transition-colors">
                Explore all of our service areas →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
