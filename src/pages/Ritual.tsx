import { Layout } from "@/components/Layout";

const Ritual = () => {
  const steps = [
    {
      number: "01",
      title: "Consult",
      description: "Listen first, understand your space, needs, sensitivities, materials, and access requirements."
    },
    {
      number: "02",
      title: "Walk-Through",
      description: "Observe light, flow, traffic patterns, surfaces, and priorities in your environment."
    },
    {
      number: "03",
      title: "Proposal",
      description: "Curate a tailored care plan with clear scope, cadence, and investment details."
    },
    {
      number: "04",
      title: "Preparation",
      description: "Assemble the right tools, products, protection measures, and scheduling coordination."
    },
    {
      number: "05",
      title: "Care in Action",
      description: "Methodical, calm, exact execution using zone sequencing, top-down method, and double-inspection."
    },
    {
      number: "06",
      title: "Finishing Touch",
      description: "A quiet reset with leave-behind notes, product guidance, and next visit planning for gallery-ready results."
    }
  ];

  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            The Ritual
          </h1>

          <p className="text-xl text-center text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
            Our six-step process ensures consistent, serene, gallery-ready results every time.
          </p>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="border-l-2 border-accent pl-8 py-4 animate-in fade-in duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <span className="font-serif text-5xl text-accent opacity-40 leading-none">
                    {step.number}
                  </span>
                  <div className="flex-1 pt-2">
                    <h2 className="font-serif text-3xl mb-4">{step.title}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-secondary/30 text-center rounded-sm">
            <h3 className="font-serif text-3xl mb-6">What We Use</h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Fragrance-free and aromatherapy options · Wood and stone-safe products · 
              Professional-grade microfiber and HEPA equipment · Protective gloves and booties · 
              Conscious, sustainable materials
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ritual;
