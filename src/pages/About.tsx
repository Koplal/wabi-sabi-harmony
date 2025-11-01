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

            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-center">Our Core Values</h2>
            <p className="text-center text-muted-foreground mb-12">These principles guide every aspect of our service</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="font-serif text-xl mb-3">Environmental Mindfulness</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use only eco-friendly, non-toxic cleaning products that are safe for your family, pets, and our planet. Every product is carefully selected for its effectiveness and environmental responsibility.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="font-serif text-xl mb-3">Excellence in Service</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every cleaning is performed with meticulous attention to detail and a commitment to exceeding expectations. We don't just clean—we transform spaces.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="font-serif text-xl mb-3">Trust & Reliability</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fully bonded, insured, and background-checked team members you can trust in your space. Your security and peace of mind are paramount.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🕊️</div>
                <h3 className="font-serif text-xl mb-3">Peaceful Presence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We work quietly and respectfully, maintaining the tranquility of your home or business. Our presence should enhance your space's serenity, not disrupt it.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="font-serif text-xl mb-3">Work-Life Harmony</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We value our team's wellbeing, ensuring they bring positive energy to every space they clean. Happy cleaners create happier spaces.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="font-serif text-xl mb-3">Local Community</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Proudly serving Greater Victoria with personalized care and deep roots in our community. We're your neighbors, committed to making our city shine.
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
