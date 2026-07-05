import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqHero from "@/assets/faq-hero.jpg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ScrollText, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema, FAQPageSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { faqItems } from "@/data/faqItems";

// Section groupings map ranges of the single-source `faqItems` array to the
// visible accordion headings. Counts must sum to faqItems.length so visible
// content and FAQPageSchema stay structurally in parity.
const faqSections: { heading: string; count: number }[] = [
  { heading: "Getting Started with Our Services", count: 3 },
  { heading: "Understanding Our Service Levels", count: 3 },
  { heading: "Pricing & Scheduling", count: 3 },
  { heading: "Products & Safety", count: 3 },
  { heading: "Service Logistics", count: 4 },
  { heading: "Quality & Satisfaction", count: 2 },
  { heading: "Serving Victoria's Neighbourhoods", count: 8 },
];

// Drift guard: section counts must cover every faqItem, or the slice logic below
// would silently drop trailing questions from the visible accordion while they
// remain in FAQPageSchema (breaking visible↔schema parity). Surfaced loudly in dev.
if (
  import.meta.env.DEV &&
  faqSections.reduce((n, s) => n + s.count, 0) !== faqItems.length
) {
  // eslint-disable-next-line no-console
  console.error(
    `FAQ: faqSections counts (${faqSections.reduce((n, s) => n + s.count, 0)}) !== faqItems.length (${faqItems.length}). Update faqSections.`
  );
}

const FAQ = () => {
  return (
    <Layout>
      <SEO
        title="Frequently Asked Questions"
        description="Answers about Wabi Sabi Services' luxury cleaning, organizing, and concierge services in Victoria, BC — pricing, scheduling, and service details."
        keywords="cleaning FAQ Victoria BC, cleaning service questions, professional cleaning pricing Victoria, house cleaning FAQs"
        canonical="https://wabisabiservices.ca/faq"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "FAQ", url: "https://wabisabiservices.ca/faq" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "FAQ", url: "https://wabisabiservices.ca/faq" },
        ]}
      />
      <FAQPageSchema items={faqItems} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${faqHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Mindful luxury cleaning, organizing, and concierge care in Greater Victoria, BC.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {(() => {
                let cursor = 0;
                return faqSections.map((section) => {
                  const items = faqItems.slice(cursor, cursor + section.count);
                  cursor += section.count;
                  return (
                    <div key={section.heading} className="mb-8">
                      <h2 className="font-serif text-3xl mb-6">{section.heading}</h2>

                      {items.map((item, index) => (
                        <AccordionItem
                          key={item.question}
                          value={`${section.heading}-${index}`}
                        >
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </div>
                  );
                });
              })()}
            </Accordion>

            {/* Important Documents Section */}
            <div className="mt-16 pt-12 border-t">
              <h2 className="font-serif text-3xl mb-4 text-center">Important Documents & Resources</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Learn more about our services, policies, and commitments through these documents.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <CardTitle>Key Takeaways</CardTitle>
                    </div>
                    <CardDescription>
                      Discover what makes Wabi Sabi Services unique - our philosophy, values, and commitment to eco-luxury cleaning.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/key-takeaways">
                      <Button className="w-full">View Key Takeaways</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <ClipboardCheck className="h-6 w-6 text-primary" />
                      <CardTitle>Client Agreement</CardTitle>
                    </div>
                    <CardDescription>
                      Review our service guidelines, scheduling policies, and what to expect when working with us.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/client-agreement">
                      <Button className="w-full">View Client Agreement</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <ScrollText className="h-6 w-6 text-primary" />
                      <CardTitle>Terms of Service</CardTitle>
                    </div>
                    <CardDescription>
                      Read our complete terms and conditions, including pricing, cancellation policies, and legal information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/terms-of-service">
                      <Button className="w-full">View Terms of Service</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FAQ;
