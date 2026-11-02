import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArticleSchema, BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import blogHero from "@/assets/blog-hero.jpg";

const March2026 = () => {
  return (
    <Layout>
      <SEO
        title="Sustainable Spring Cleaning for Eco-Conscious Victorians"
        noBrandSuffix
        description="As cherry blossoms open across Victoria, refresh your home without harming the Island. A room-by-room guide, and ways to let things go."
        canonical="https://wabisabiservices.ca/blog/march-2026"
        ogType="article"
        publishedTime="2026-03-01T00:00:00-08:00"
      />
      <ArticleSchema
        headline="Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians"
        description="A room-by-room guide and mindful ways to let things go, for a Victoria home and the Island around it."
        datePublished="2026-03-01"
        url="https://wabisabiservices.ca/blog/march-2026"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Journal", url: "https://wabisabiservices.ca/blog" },
          { name: "Sustainable Spring Cleaning", url: "https://wabisabiservices.ca/blog/march-2026" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Journal", url: "https://wabisabiservices.ca/blog" },
          { name: "Sustainable Spring Cleaning", url: "https://wabisabiservices.ca/blog/march-2026" },
        ]}
      />
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center mb-12">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${blogHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <p className="font-serif text-2xl md:text-3xl tracking-wide text-muted-foreground">
            The Wabi Sabi Journal
          </p>
        </div>
      </section>

      <div className="min-h-screen py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog">
            <Button variant="outline" className="mb-8">
              ← Back to Blog
            </Button>
          </Link>

          <article className="prose prose-lg max-w-none">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians
            </h1>
            <p className="text-muted-foreground mb-8">Published: March 2026</p>

            <p className="lead">
              As cherry blossoms bloom across Victoria, the urge to refresh our homes grows stronger. Spring cleaning is a time-honored tradition, but how can we honor this ritual while staying true to our environmental values? Here's your complete guide to sustainable spring cleaning.
            </p>

            <h2>Why Sustainable Spring Cleaning Matters</h2>
            <p>Vancouver Island's pristine environment is our shared treasure. Every cleaning choice we make impacts our local ecosystem:</p>
            <ul>
              <li>Chemicals washed down drains affect our marine life</li>
              <li>Single-use cleaning supplies contribute to landfill waste</li>
              <li>Harsh products diminish indoor air quality</li>
              <li>Energy-intensive cleaning methods increase carbon footprint</li>
            </ul>

            <h2>Room-by-Room Sustainable Spring Cleaning Guide</h2>

            <h3>Kitchen Revival:</h3>
            <ul>
              <li>Refrigerator refresh: Remove contents, clean with mild soap</li>
            </ul>

            <h3>Living Spaces:</h3>
            <ul>
              <li>Air purification: Open windows, add houseplants</li>
            </ul>

            <h2>Decluttering with Purpose</h2>
            <p>Spring cleaning is really an exercise in mindful consumption as much as tidying:</p>

            <h3>The Wabi Sabi Method:</h3>
            <ol>
              <li><strong>Appreciate</strong> each item's service to you</li>
              <li><strong>Assess</strong> whether it continues to bring value</li>
              <li><strong>Redistribute</strong> thoughtfully:
                <ul>
                  <li>Donate to local Victoria charities</li>
                  <li>Sell through consignment shops</li>
                  <li>Recycle appropriately</li>
                  <li>Compost organic materials</li>
                </ul>
              </li>
            </ol>

            <h2>Professional Support for Your Sustainable Goals</h2>
            <p>Sometimes, the most sustainable choice is to call in professionals who:</p>
            <ul>
              <li>Use concentrated, low-toxicity products (reducing packaging waste)</li>
              <li>Employ efficient techniques (saving water and energy)</li>
              <li>Have proper disposal/recycling knowledge</li>
              <li>Bring reusable supplies and equipment</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">A clean home, a cared-for Island</h3>
              <p className="mb-6">
                When you would rather spend spring outdoors, our concierge team can handle the deep clean with low-toxicity products and a light footprint. We begin with a $150 in-home consultation, credited in full toward your first service. Free estimates by phone or email.
              </p>
              <Link to="/contact">
                <Button size="lg">Request a Private Consultation</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default March2026;
