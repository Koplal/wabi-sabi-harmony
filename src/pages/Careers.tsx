import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Careers = () => {
  const roles = [
    {
      title: "Lead Cleaner",
      description: "Oversee service delivery, mentor team members, and ensure excellence."
    },
    {
      title: "Specialist (Stone/Glass)",
      description: "Expert care for delicate surfaces requiring specialized techniques."
    },
    {
      title: "Construction Detailer",
      description: "Post-construction finishing with precision and attention to detail."
    }
  ];

  const perks = [
    "Premium clients",
    "Stable schedules",
    "Training stipend",
    "Advancement opportunities"
  ];

  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Careers
          </h1>

          <p className="text-2xl text-center mb-20 leading-relaxed">
            We hire for character, train for excellence.
          </p>

          <div className="mb-24">
            <h2 className="font-serif text-3xl mb-12 text-center">Open Roles</h2>
            
            <div className="space-y-8">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="border-l-2 border-accent pl-8 py-4"
                >
                  <h3 className="font-serif text-2xl mb-3">{role.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16 p-12 bg-secondary/30 rounded-sm">
            <h3 className="font-serif text-2xl mb-8 text-center">Perks</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {perks.map((perk, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <span className="text-muted-foreground">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-8">
              Ready to join our team? Send your resume and a brief note about why you're drawn to this work.
            </p>
            <Button asChild size="lg">
              <a href="mailto:hello@wabisabiservices.com?subject=Career Inquiry">
                Apply Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
