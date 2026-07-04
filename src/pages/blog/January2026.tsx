import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArticleSchema, BreadcrumbSchema } from "@/components/structured-data";
import blogHero from "@/assets/blog-hero.jpg";

const January2026 = () => {
  return (
    <Layout>
      <SEO
        title="The Art of Minimalism: Less Stuff, Less Stress"
        description="A January look at minimalism through wabi-sabi. How simpler spaces calm the mind, plus a gentle four-week path to a lighter, easier-to-keep home."
        canonical="https://wabisabiservices.ca/blog/january-2026"
        ogType="article"
        publishedTime="2026-01-01T00:00:00-08:00"
      />
      <ArticleSchema
        headline="The Art of Minimalism: How Less Stuff Means Less Stress"
        description="How simpler spaces calm the mind, and a gentle four-week path to a lighter, easier-to-keep home, through the lens of wabi-sabi."
        datePublished="2026-01-01"
        url="https://wabisabiservices.ca/blog/january-2026"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Journal", url: "https://wabisabiservices.ca/blog" },
          { name: "The Art of Minimalism", url: "https://wabisabiservices.ca/blog/january-2026" },
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
              The Art of Minimalism: How Less Stuff Means Less Stress
            </h1>
            <p className="text-muted-foreground mb-8">Published: January 2026</p>

            <p className="lead">
              New Year, new perspective. As we settle into 2026, many Victorians are taking up minimalism, not as deprivation but as a kind of relief. At Wabi Sabi Services, we have watched simplified spaces change how a household feels day to day. Here is why less so often turns out to be more.
            </p>

            <h2>Understanding Minimalism Through Wabi-Sabi</h2>
            <p>Our company's namesake philosophy, wabi-sabi, finds profound beauty in simplicity. This Japanese concept teaches us that:</p>
            <ul>
              <li>Imperfection is authentic</li>
              <li>Simplicity brings clarity</li>
              <li>Space itself has value</li>
              <li>Quality trumps quantity</li>
            </ul>

            <h2>The Psychology of Clutter</h2>
            <p>Researchers at UCLA's Center on Everyday Lives of Families observed a link between cluttered homes and raised cortisol, the body's stress hormone, in the women they studied. Most of us feel it intuitively. Physical clutter tends to bring:</p>
            <ul>
              <li>Decision fatigue from too many choices</li>
              <li>Visual overwhelm that exhausts the brain</li>
              <li>Guilt about unfinished projects</li>
              <li>Anxiety about losing important items</li>
              <li>Reduced ability to relax at home</li>
            </ul>

            <h2>The Minimalist Cleaning Advantage</h2>
            <p>The clients who pare back tend to notice a few things in common:</p>
            <ul>
              <li>Cleaning takes noticeably less time, with fewer items to move, dust, and put away</li>
              <li>A deeper clean becomes possible, since every surface and corner is within reach</li>
              <li>Tidiness holds longer, because less stuff means less mess to accumulate</li>
              <li>The air feels fresher, with fewer surfaces collecting dust</li>
              <li>The home becomes a place to settle into rather than a list of things to manage</li>
            </ul>

            <h2>Your Minimalism Journey: Start Small</h2>
            
            <h3>Week 1: The Surface Sweep</h3>
            <ul>
              <li>Clear all countertops except daily essentials</li>
              <li>Remove decorative items that don't bring joy</li>
              <li>Create designated homes for everything</li>
            </ul>

            <h3>Week 2: The Hidden Spaces</h3>
            <ul>
              <li>Tackle one drawer or cabinet daily</li>
              <li>Apply the one-year rule: unused in a year = donate</li>
              <li>Organize remaining items thoughtfully</li>
            </ul>

            <h3>Week 3: The Sentimental Sort</h3>
            <ul>
              <li>Photograph sentimental items you don't need to keep</li>
              <li>Keep one representative item from collections</li>
              <li>Create a memory box with size limits</li>
            </ul>

            <h3>Week 4: The Digital Detox</h3>
            <ul>
              <li>Declutter digital files and photos</li>
              <li>Unsubscribe from unnecessary emails</li>
              <li>Organize remaining digital life</li>
            </ul>

            <h2>The Sustainable Side of Minimalism</h2>
            <p>Minimalism naturally aligns with environmental consciousness:</p>
            <ul>
              <li>Reduced consumption means less waste</li>
              <li>Quality purchases last longer</li>
              <li>Less cleaning products needed</li>
              <li>Smaller carbon footprint</li>
              <li>Support for conscious businesses</li>
            </ul>

            <h2>How Professional Cleaning Supports Minimalism</h2>
            <p>Regular professional cleaning helps maintain minimalist spaces by:</p>
            <ul>
              <li>Deep cleaning what remains</li>
              <li>Preventing buildup in simplified spaces</li>
              <li>Maintaining the calm you've created</li>
              <li>Allowing you to enjoy, not maintain, your space</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Begin 2026 with a lighter home</h3>
              <p className="mb-6">
                Once your rooms are pared back, our concierge team can help keep them that way with quiet, regular care. We begin with a $150 in-home consultation, credited in full toward your first service.
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

export default January2026;
