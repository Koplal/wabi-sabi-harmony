import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import blogHero from "@/assets/blog-hero.jpg";

const August2025 = () => {
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
              August Awakening: Transitioning from Summer's Freedom to Fall's Focus
            </h1>
            <p className="text-muted-foreground mb-8">Published: August 2025</p>

            <p className="lead">
              As August unfolds in Victoria, morning mists hint at autumn's approach while afternoon sun still warms our beaches. This liminal time offers a unique opportunity for mindful home renewal as we transition from summer's relaxed energy to fall's structure.
            </p>

            <h2>The Philosophy of Seasonal Transition</h2>
            <p>In Japanese aesthetics, the concept of <em>utsuroi</em> captures the beauty of transition itself. Your August cleaning can embody this principle: honoring summer's relaxed energy while gradually introducing autumn's structure.</p>

            <h2>Outdoor Living Space Renewal</h2>
            <p>August is perfect for refreshing spaces that have hosted summer gatherings:</p>

            <h3>Deck and Patio Renaissance:</h3>
            <ul>
              <li>Deep clean outdoor furniture while weather permits</li>
              <li>Oil teak or cedar furniture for winter protection</li>
              <li>Clean cushion covers (or store if fair-weather only)</li>
              <li>Pressure wash deck surfaces</li>
              <li>Clean and organize BBQ for final summer gatherings</li>
            </ul>

            <h3>Garden-to-Home Transition:</h3>
            <ul>
              <li>Harvest herbs for drying</li>
              <li>Clean gardening tools before storage</li>
              <li>Bring sensitive plants indoors gradually</li>
              <li>Clean windows to maximize light for indoor plants</li>
              <li>Create mud-management station for garden harvests</li>
            </ul>

            <h2>Summer Activity Gear Organization</h2>

            <h3>Beach and Water Equipment:</h3>
            <ul>
              <li>Clean and dry all beach toys thoroughly</li>
              <li>Wash beach towels with vinegar to remove sunscreen</li>
              <li>Clean coolers with baking soda solution</li>
              <li>Sort and donate outgrown water gear</li>
              <li>Organize remaining items for easy access</li>
            </ul>

            <h3>Sports and Adventure Gear:</h3>
            <ul>
              <li>Clean bikes for fall riding</li>
              <li>Organize hiking gear for autumn trails</li>
              <li>Sort camping equipment, repair if needed</li>
              <li>Clean and store summer-specific sports gear</li>
              <li>Create "grab-and-go" system for continuing activities</li>
            </ul>

            <h2>The Great Sunscreen and Sand Purge</h2>
            <p>Every Victoria household battles sand and sunscreen:</p>

            <h3>Removing Summer's Residue:</h3>
            <ul>
              <li>Vacuum car interiors thoroughly</li>
              <li>Clean door mats and entry areas</li>
              <li>Deep clean washing machine (sunscreen buildup)</li>
              <li>Steam clean high-traffic carpets</li>
              <li>Wash walls where sunscreen hands have touched</li>
            </ul>

            <h3>Bathroom Summer Recovery:</h3>
            <ul>
              <li>Deep clean shower glass (sunscreen film)</li>
              <li>Organize and check expiration on sun products</li>
              <li>Clean beach bags and summer toiletry cases</li>
              <li>Refresh bath toys (clean or replace)</li>
              <li>Reorganize for fall skincare routine</li>
            </ul>

            <h2>Air Quality Restoration</h2>
            <p>After a summer of open windows and active living:</p>

            <h3>Ventilation System Care:</h3>
            <ul>
              <li>Change HVAC filters</li>
              <li>Clean bathroom exhaust fans</li>
              <li>Vacuum bedroom ceiling fans</li>
              <li>Clean kitchen range hood filters</li>
              <li>Check dryer vents for lint buildup</li>
            </ul>

            <h2>Kitchen Transition: From BBQ to Soup Season</h2>

            <h3>Refrigerator Reality Check:</h3>
            <ul>
              <li>Audit condiments from summer entertaining</li>
              <li>Deep clean before fall grocery shopping</li>
              <li>Check and clean ice maker</li>
              <li>Organize for meal prep efficiency</li>
              <li>Create space for fall preserving projects</li>
            </ul>

            <h3>Pantry Preparation:</h3>
            <ul>
              <li>Use up summer specialty items</li>
              <li>Check expiration dates thoroughly</li>
              <li>Clean shelves before restocking</li>
              <li>Organize baking supplies for fall</li>
              <li>Create donation box for excess</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Embrace the transition</h3>
              <p className="mb-6">
                Let Wabi Sabi Services help you mindfully transition your home from summer's freedom to fall's focused energy.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Transitional Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default August2025;
