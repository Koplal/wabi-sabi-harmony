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
            <p className="text-xl text-center text-muted-foreground leading-relaxed">
              Wabi Sabi Services was born from the belief that serenity is a service. Founded by Jalene Plamondon 
              in Victoria, BC, we blend hospitality standards with psychology-informed care—attentive, discreet, 
              and grounded in ritual.
            </p>

            <div className="my-20" />

            <h2 className="font-serif text-3xl md:text-4xl mb-6">Meet Jalene Plamondon</h2>

            <p className="text-muted-foreground leading-relaxed">
              Jalene Plamondon, B.A. Psychology, blends academic insight with years of experience in high-end 
              residential care—from discreet weekly upkeep to meticulous post-construction detailing. Her approach 
              is grounded in the belief that a well-tended home fosters clarity, connection, and community.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              At Wabi Sabi Services, she works with a select circle of clients, offering fewer homes and deeper care. 
              The result is an atmosphere of calm precision and sustainable luxury. Beyond immaculate details, 
              Jalene envisions her work as a quiet contribution to something larger—spaces that nurture well-being 
              and bring people together.
            </p>

            <div className="my-20" />

            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">Our Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="text-center p-8">
                <h3 className="font-serif text-2xl mb-3">Discretion</h3>
                <p className="text-sm text-muted-foreground">
                  We work quietly in the background, respecting your privacy and peace.
                </p>
              </div>

              <div className="text-center p-8">
                <h3 className="font-serif text-2xl mb-3">Consistency</h3>
                <p className="text-sm text-muted-foreground">
                  Gallery-ready results, every time, through our proven ritual.
                </p>
              </div>

              <div className="text-center p-8">
                <h3 className="font-serif text-2xl mb-3">Respect for Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Each surface receives specialized care to preserve its beauty.
                </p>
              </div>

              <div className="text-center p-8">
                <h3 className="font-serif text-2xl mb-3">Wellbeing</h3>
                <p className="text-sm text-muted-foreground">
                  Sustainable practices that protect people, pets, and the planet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
