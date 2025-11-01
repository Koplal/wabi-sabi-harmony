import { Layout } from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
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
              We're here to handle what needs handling, so your home supports your life instead of adding to it.
            </p>

            <div className="my-20" />

            <h2 className="font-serif text-3xl md:text-4xl mb-6">The Promise</h2>

            <p className="text-muted-foreground leading-relaxed">
              Your home should feel like a retreat when you walk through the door. It should support your focus, your rest, and your peace.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              That's what we create: not just clean surfaces, but environments that actively work for you. Because you deserve more than a clean house. You deserve a home that feels like the sanctuary it was meant to be.
            </p>

            <div className="my-20" />

            <p className="text-center text-muted-foreground italic">
              Wabi Sabi Services serves discerning clients throughout Greater Victoria, including Oak Bay, Uplands, Rockland, Fairfield, and Bear Mountain.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
