import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import blogHero from "@/assets/blog-hero.jpg";

const May2026 = () => {
  return (
    <Layout>
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
          <h1 className="font-serif text-5xl md:text-7xl">
            Mindful Living Blog
          </h1>
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
              May Mindfulness: Creating Wellness Sanctuaries for Modern Families
            </h1>
            <p className="text-muted-foreground mb-8">Published: May 2026</p>

            <p className="lead">
              May in Victoria blooms with rhododendrons, Mother's Day celebrations, and the promise of summer. It's a month that honors nurturing in all forms. At Wabi Sabi Services, we believe a clean, organized home is fundamental to family wellness.
            </p>

            <h2>The Wellness Home Revolution</h2>
            <p>Recent studies from the Global Wellness Institute show that "wellness real estate" isn't just for luxury developments – it's about transforming existing homes into health-supporting sanctuaries.</p>

            <h2>Mother's Day: Honoring the Home's Heart</h2>
            <p>Whether you're a mother, have a mother, or honor mother figures, this month celebrates nurturing energy.</p>

            <h3>Gift of Time and Space:</h3>
            <p>Instead of flowers that fade, consider:</p>
            <ul>
              <li>Professional cleaning service gift certificates</li>
              <li>Organized spaces that reduce daily stress</li>
              <li>Decluttered rooms for personal retreat</li>
              <li>Clean homes that support self-care</li>
              <li>Time reclaimed from cleaning for living</li>
            </ul>

            <h3>Creating Mom's Sanctuary Spaces:</h3>
            <ul>
              <li>Bedroom retreat free from family clutter</li>
              <li>Bathroom spa experience with organized products</li>
              <li>Reading nook with perfect lighting</li>
              <li>Kitchen workspace that functions beautifully</li>
              <li>Personal corner for hobbies or meditation</li>
            </ul>

            <h2>The Five Pillars of a Wellness Home</h2>

            <h3>1. Air Quality Excellence</h3>
            <p>May's open-window weather helps establish:</p>
            <ul>
              <li>Daily fresh air circulation routines</li>
              <li>HEPA filter maintenance schedules</li>
              <li>Houseplant integration for natural purification</li>
              <li>Allergen reduction strategies</li>
              <li>Chemical-free cleaning transitions</li>
            </ul>

            <h3>2. Sleep Sanctuary Science</h3>
            <p>Quality rest starts with environment:</p>
            <ul>
              <li>Dust-free bedrooms for better breathing</li>
              <li>Organized spaces for mental calm</li>
              <li>Temperature regulation through clean vents</li>
              <li>Blackout solutions for longer spring days</li>
              <li>Calming colors and minimal stimulation</li>
            </ul>

            <h3>3. Nutrition Enablement</h3>
            <p>Clean kitchens support healthy eating:</p>
            <ul>
              <li>Organized pantries encourage cooking</li>
              <li>Clean refrigerators inspire fresh choices</li>
              <li>Clear counters enable meal prep</li>
              <li>Sanitized spaces ensure food safety</li>
              <li>Accessible tools support family involvement</li>
            </ul>

            <h3>4. Movement Motivation</h3>
            <p>Organized spaces encourage activity:</p>
            <ul>
              <li>Clear floors for yoga or exercise</li>
              <li>Accessible sports equipment storage</li>
              <li>Outdoor gear ready for adventures</li>
              <li>Dance-friendly living spaces</li>
              <li>Garden tools organized for outdoor work</li>
            </ul>

            <h3>5. Mental Clarity Cultivation</h3>
            <p>Clutter-free equals stress-free:</p>
            <ul>
              <li>Organized entryways for calm arrivals</li>
              <li>Clear surfaces for mental space</li>
              <li>Systems that prevent accumulation</li>
              <li>Designated spaces for everything</li>
              <li>Regular maintenance routines</li>
            </ul>

            <h2>May Allergen Management</h2>
            <p>Victoria's beautiful blooms bring pollen challenges:</p>

            <h3>Natural Allergy Relief Through Cleaning:</h3>
            <ul>
              <li>Vacuum with HEPA filters twice weekly</li>
              <li>Wash bedding in hot water weekly</li>
              <li>Keep windows closed during high pollen (10am-4pm)</li>
              <li>Shower and change clothes after outdoor time</li>
              <li>Use damp cloths for dusting (traps pollen)</li>
            </ul>

            <h3>Bedroom Allergy Fortress:</h3>
            <ul>
              <li>Allergen-proof mattress and pillow covers</li>
              <li>Minimal fabric decorations</li>
              <li>Hard floors over carpets when possible</li>
              <li>Air purifier for nighttime relief</li>
              <li>Pet-free zones if allergic</li>
            </ul>

            <h2>Children's Wellness Spaces</h2>
            <p>May is Children's Mental Health Month:</p>

            <h3>Calm Corners for Emotional Regulation:</h3>
            <ul>
              <li>Soft textures and calming colors</li>
              <li>Organized sensory tools</li>
              <li>Clear space for movement</li>
              <li>Natural light when possible</li>
              <li>Easy-to-maintain systems</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Create your wellness sanctuary</h3>
              <p className="mb-6">
                Honor Mother's Day and family wellness with a home that supports health, clarity, and balance for every family member.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Wellness Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default May2026;
