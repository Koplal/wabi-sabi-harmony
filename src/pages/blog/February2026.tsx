import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArticleSchema, BreadcrumbSchema } from "@/components/structured-data";
import blogHero from "@/assets/blog-hero.jpg";

const February2026 = () => {
  return (
    <Layout>
      <SEO
        title="Love Your Home: Spaces That Nurture Relationships"
        description="February is for tending love in all its forms, beginning with home. How a calm, cared-for Victoria space supports romance, family bonds, and self-care."
        canonical="https://wabisabiservices.ca/blog/february-2026"
        ogType="article"
        publishedTime="2026-02-01T00:00:00-08:00"
      />
      <ArticleSchema
        headline="Love Your Home: Creating Spaces That Nurture Relationships"
        description="How a calm, cared-for Victoria home supports romance, family bonds, and self-care in February and beyond."
        datePublished="2026-02-01"
        url="https://wabisabiservices.ca/blog/february-2026"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Journal", url: "https://wabisabiservices.ca/blog" },
          { name: "Love Your Home", url: "https://wabisabiservices.ca/blog/february-2026" },
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
              Love Your Home: Creating Spaces That Nurture Relationships
            </h1>
            <p className="text-muted-foreground mb-8">Published: February 2026</p>

            <p className="lead">
              February in Victoria is about more than Valentine's Day. It is a season for tending love in all its forms, beginning with the place we call home. At Wabi Sabi Services, we find that a home cared for with intention nurtures romance, yes, and also self-respect, family bonds, and friendship.
            </p>

            <h2>The Psychology of Loving Spaces</h2>
            <p>Anyone who has argued over a pile of unsorted mail knows that a cluttered home adds friction to a relationship. A thoughtfully maintained home tends to do the opposite:</p>
            <ul>
              <li>Reduces cortisol, allowing for emotional availability</li>
              <li>Creates welcoming atmospheres for connection</li>
              <li>Provides peaceful backgrounds for difficult conversations</li>
              <li>Offers sanctuary for individual restoration</li>
              <li>Demonstrates care through environment</li>
            </ul>

            <h2>Self-Love Starts at Home</h2>
            <p>Before we can fully love others, we must care for ourselves. Your home is your first relationship.</p>

            <h3>Morning Rituals for Self-Care:</h3>
            <ul>
              <li>Clear bathroom counter for mindful preparation</li>
              <li>Organized closet for confident dressing</li>
              <li>Clean kitchen for nourishing breakfast</li>
              <li>Made bed as act of self-respect</li>
              <li>Fresh flowers as daily gift to yourself</li>
            </ul>

            <h3>Evening Sanctuary Creation:</h3>
            <ul>
              <li>Bath supplies arranged for relaxation</li>
              <li>Bedroom free of work materials</li>
              <li>Soft lighting for wind-down time</li>
              <li>Clean sheets for restorative sleep</li>
              <li>Tomorrow's clothes prepared with intention</li>
            </ul>

            <h2>Couple's Cleaning: Strengthening Bonds</h2>
            <p>Done together, cleaning can become less of a chore and more of a shared hour:</p>

            <h3>The Mindful Clean Together:</h3>
            <ul>
              <li>Put on music you both love</li>
              <li>Work side-by-side, not separately</li>
              <li>Take dance breaks between tasks</li>
              <li>Share memories triggered by items</li>
              <li>Celebrate completion together</li>
            </ul>

            <h3>Creating Romance Through Environment:</h3>
            <ul>
              <li>Decluttered bedroom for intimacy</li>
              <li>Clean kitchen for cooking together</li>
              <li>Organized entry for peaceful returns</li>
              <li>Fresh bathroom for spa-like experiences</li>
              <li>Living room ready for quality time</li>
            </ul>

            <h2>Family Love Through Shared Spaces</h2>
            
            <h3>Teaching Love Through Care:</h3>
            <p>Children learn love through action:</p>
            <ul>
              <li>Age-appropriate cleaning tasks build contribution</li>
              <li>Shared responsibility creates belonging</li>
              <li>Clean spaces show respect for family</li>
              <li>Organization reduces morning stress</li>
              <li>Tidy homes allow for spontaneous fun</li>
            </ul>

            <h3>Memory-Making Spaces:</h3>
            <ul>
              <li>Clear dining table for family meals</li>
              <li>Organized game cupboard for play</li>
              <li>Clean kitchen for baking together</li>
              <li>Tidy living room for movie nights</li>
              <li>Guest-ready spaces for extended family</li>
            </ul>

            <h2>The Five Love Languages of Home</h2>
            <ul>
              <li><strong>Acts of Service:</strong> Cleaning partner's workspace, maintaining shared areas</li>
              <li><strong>Quality Time:</strong> Clean spaces enable presence and togetherness</li>
              <li><strong>Words of Affirmation:</strong> Thank family for cleaning efforts</li>
              <li><strong>Gifts:</strong> Fresh flowers, surprise deep clean of favorite room</li>
              <li><strong>Physical Touch:</strong> Clean, comfortable spaces invite closeness</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">A home that holds the people you love</h3>
              <p className="mb-6">
                Consider giving someone the quiet luxury of a home kept beautifully by our concierge team. We begin with a $150 in-home consultation, credited in full toward your first service.
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

export default February2026;
