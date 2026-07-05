import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArticleSchema, BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import blogHero from "@/assets/blog-hero.jpg";

const December2025 = () => {
  return (
    <Layout>
      <SEO
        title="Holiday Harmony: Mindful Cleaning for December"
        description="December in Victoria sparkles with lights and gatherings. A week-by-week plan for hosting with grace, plus natural scents and sustainable table settings."
        canonical="https://wabisabiservices.ca/blog/december-2025"
        ogType="article"
        publishedTime="2025-12-01T00:00:00-08:00"
      />
      <ArticleSchema
        headline="Holiday Harmony: Mindful Cleaning for December's Magic"
        description="A week-by-week plan for hosting with grace in a Victoria home, with natural scents and sustainable table settings."
        datePublished="2025-12-01"
        url="https://wabisabiservices.ca/blog/december-2025"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Journal", url: "https://wabisabiservices.ca/blog" },
          { name: "Holiday Harmony", url: "https://wabisabiservices.ca/blog/december-2025" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Journal", url: "https://wabisabiservices.ca/blog" },
          { name: "Holiday Harmony", url: "https://wabisabiservices.ca/blog/december-2025" },
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
              Holiday Harmony: Mindful Cleaning for December's Magic
            </h1>
            <p className="text-muted-foreground mb-8">Published: December 2025</p>

            <p className="lead">
              December in Victoria sparkles with boat parades, twinkling lights, and the promise of gathering. Yet beneath the magic sits the strain of hosting, gift-giving, and keeping the peace in a busy home. At Wabi Sabi Services, we see holiday cleaning as an act of care: it makes room for the memories without costing you your calm or your values.
            </p>

            <h2>The Spirit of Seasonal Hospitality</h2>
            <p>In Japan, the concept of <em>omotenashi</em> – wholehearted hospitality – turns cleaning from an obligation into a gift. Your clean home becomes your present to guests, to family, and to yourself. This December, approach cleaning as a quiet meditation on gratitude and connection.</p>

            <h2>Pre-Holiday Deep Clean Strategy</h2>

            <h3>Week 1 of December: Foundation Setting</h3>
            <p>Start early to avoid rush:</p>
            <ul>
              <li>Deep clean guest rooms with intention</li>
              <li>Refresh forgotten spaces (baseboards, ceiling fans)</li>
              <li>Window cleaning for maximum light during short days</li>
              <li>Declutter before decorating</li>
              <li>Carpet deep cleaning before heavy traffic</li>
            </ul>

            <h3>Week 2: Decoration Preparation</h3>
            <ul>
              <li>Clean surfaces before decorating</li>
              <li>Wash windows for light displays</li>
              <li>Clear mantels and shelves</li>
              <li>Organize decoration storage areas</li>
              <li>Create decoration staging zone</li>
            </ul>

            <h3>Week 3: Entertainment Ready</h3>
            <ul>
              <li>Kitchen deep clean and organization</li>
              <li>Dining room furniture polish</li>
              <li>Guest bathroom luxury treatment</li>
              <li>Coat closet optimization</li>
              <li>Entrance way enhancement</li>
            </ul>

            <h3>Week 4: Maintenance Mode</h3>
            <ul>
              <li>Daily touch-ups only</li>
              <li>Quick bathroom refreshes</li>
              <li>Kitchen maintenance between events</li>
              <li>Spot cleaning as needed</li>
              <li>Relaxation and enjoyment focus</li>
            </ul>

            <h2>Guest Room Grace: A Quiet Welcome</h2>
            <p>Ready your spare rooms so visitors feel genuinely at ease:</p>

            <h3>Comfort Creation:</h3>
            <ul>
              <li>Fresh linens in neutral, calming tones</li>
              <li>Extra blankets in basket (Victoria's December chill)</li>
              <li>Reading lamp with warm bulb</li>
              <li>Fresh flowers or winter greenery</li>
              <li>Essential oil diffuser with optional use</li>
            </ul>

            <h3>Thoughtful Touches:</h3>
            <ul>
              <li>Welcome basket with local treats</li>
              <li>WiFi password in frame</li>
              <li>Local attraction guides</li>
              <li>Extra chargers and adapters</li>
              <li>Cozy slippers in various sizes</li>
            </ul>

            <h3>Privacy and Peace:</h3>
            <ul>
              <li>White noise machine available</li>
              <li>Blackout curtains functioning</li>
              <li>Full-length mirror clean</li>
              <li>Adequate hangers and drawer space</li>
              <li>Private bathroom supplies basket</li>
            </ul>

            <h2>Kitchen Command: Heart of Hospitality</h2>

            <h3>Refrigerator Renaissance:</h3>
            <ul>
              <li>Complete clean-out before shopping</li>
              <li>Adjustable shelves for large items</li>
              <li>Beverage zone organized</li>
              <li>Leftover container system ready</li>
              <li>Expiration date audit completed</li>
            </ul>

            <h3>Cooking Zone Optimization:</h3>
            <ul>
              <li>Spice inventory and organization</li>
              <li>Baking supplies accessible</li>
              <li>Serving pieces inventory</li>
              <li>Small appliances tested and ready</li>
              <li>Counter space maximized</li>
            </ul>

            <h3>Hidden Heroes:</h3>
            <ul>
              <li>Oven deep cleaned early</li>
              <li>Dishwasher filter cleaned</li>
              <li>Garbage disposal refreshed</li>
              <li>Extra trash bags accessible</li>
              <li>Recycling system clear</li>
            </ul>

            <h2>Sustainable Holiday Entertaining</h2>

            <h3>Eco-Luxury Table Settings:</h3>
            <ul>
              <li>Real linens over paper</li>
              <li>Vintage dishes mixed beautifully</li>
              <li>Natural centerpieces (branches, pinecones)</li>
              <li>Beeswax candles for ambiance</li>
              <li>Cloth napkins in festive colors</li>
            </ul>

            <h3>Waste Reduction Strategies:</h3>
            <ul>
              <li>Clearly marked recycling stations</li>
              <li>Compost bin for food waste</li>
              <li>Real dishes even for large parties</li>
              <li>Leftover containers for guests</li>
              <li>Minimal single-use items</li>
            </ul>

            <h2>The Art of Holiday Scent</h2>

            <h3>Natural Aromatherapy:</h3>
            <ul>
              <li>Simmer cinnamon sticks and orange peels</li>
              <li>Fresh evergreen branches throughout home</li>
              <li>Beeswax candles with essential oils</li>
              <li>Avoid synthetic air fresheners</li>
              <li>Open windows briefly for fresh air</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Spend December with the people, not the chores</h3>
              <p className="mb-6">
                Let our concierge team carry the cleaning so your attention can stay where it belongs. We begin with a $150 in-home consultation, credited in full toward your first service.
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

export default December2025;
