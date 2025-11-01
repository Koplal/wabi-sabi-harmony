import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Careers
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-center">
              We're Building Something Different
            </h2>

            <p className="text-lg text-center text-muted-foreground leading-relaxed mb-12">
              Wabi Sabi Services isn't your typical cleaning company. We're creating a team where quality matters more than speed, where flexibility is built in, and where the work you do genuinely makes a difference in people's lives.
            </p>

            <p className="text-lg text-center text-muted-foreground leading-relaxed mb-20">
              If that sounds like the kind of place you'd want to work, let's talk.
            </p>

            <div className="text-center mt-20">
              <Button asChild size="lg">
                <a href="mailto:hello@wabisabiservices.ca">Get In Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
