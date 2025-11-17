import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import blogHero from "@/assets/blog-hero.jpg";

const November2025 = () => {
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
              The Gratitude Home: Preparing Thankful Spaces for Connection
            </h1>
            <p className="text-muted-foreground mb-8">Published: November 2025</p>

            <p className="lead">
              November in Victoria brings crisp mornings, early sunsets, and the invitation to gather in gratitude. As we prepare for Thanksgiving and the holiday season ahead, our homes become vessels for memory-making and connection. At Wabi Sabi Services, we believe cleaning with gratitude transforms routine maintenance into mindful practice.
            </p>

            <h2>The Philosophy of Grateful Cleaning</h2>
            <p>In Japanese culture, the practice of <em>kansha</em> – deep gratitude – extends to our physical spaces. Each cleaning action becomes an opportunity to thank our homes for shelter, comfort, and the memories they hold. This November, approach cleaning not as a chore, but as an expression of thanksgiving.</p>

            <h2>Pre-Thanksgiving Deep Clean Strategy</h2>

            <h3>Three Weeks Before (Early November):</h3>
            <ul>
              <li>Assess and plan entertainment spaces</li>
              <li>Deep clean forgotten areas (behind furniture, ceiling fans)</li>
              <li>Organize storage for seasonal items</li>
              <li>Declutter before holiday decorations</li>
              <li>Schedule professional services if needed</li>
            </ul>

            <h3>Two Weeks Before:</h3>
            <ul>
              <li>Deep clean kitchen completely</li>
              <li>Polish silver and special servingware</li>
              <li>Clean and organize dining room</li>
              <li>Refresh guest bathroom</li>
              <li>Launder table linens and napkins</li>
            </ul>

            <h3>One Week Before:</h3>
            <ul>
              <li>Clean refrigerator for food storage</li>
              <li>Final vacuum and dust all areas</li>
              <li>Prepare guest room if needed</li>
              <li>Set up coat storage area</li>
              <li>Create cleaning supplies station</li>
            </ul>

            <h2>The Grateful Kitchen: Heart of Thanksgiving</h2>
            <p>Your kitchen works overtime this month – show appreciation:</p>

            <h3>Appliance Gratitude:</h3>
            <ul>
              <li>Thank your oven with deep cleaning</li>
              <li>Honor your refrigerator with thorough organization</li>
              <li>Appreciate small appliances with careful maintenance</li>
              <li>Respect your dishwasher with filter cleaning</li>
              <li>Acknowledge your stovetop with detailed attention</li>
            </ul>

            <h3>Pantry Appreciation:</h3>
            <ul>
              <li>Remove everything mindfully</li>
              <li>Thank each shelf as you clean</li>
              <li>Check dates with gentle acceptance</li>
              <li>Organize with cooking flow in mind</li>
              <li>Create donation box for food banks</li>
            </ul>

            <h3>Sacred Sink Space:</h3>
            <ul>
              <li>Deep clean with baking soda paste</li>
              <li>Polish fixtures to shine</li>
              <li>Organize under-sink supplies</li>
              <li>Stock up on dish soap</li>
              <li>Prepare for heavy use</li>
            </ul>

            <h2>Dining Room Revival</h2>
            <p>Transform your dining space into a gratitude sanctuary:</p>

            <h3>Table Love:</h3>
            <ul>
              <li>Polish wood with natural oils</li>
              <li>Protect with quality padding</li>
              <li>Clear completely for beauty</li>
              <li>Add fresh flowers or centerpiece</li>
              <li>Set with intention and care</li>
            </ul>

            <h3>Chair Care:</h3>
            <ul>
              <li>Vacuum upholstery thoroughly</li>
              <li>Tighten any loose screws</li>
              <li>Clean legs and rungs</li>
              <li>Add cushions if needed</li>
              <li>Count and prepare for guests</li>
            </ul>

            <h3>Ambiance Elements:</h3>
            <ul>
              <li>Clean light fixtures for warm glow</li>
              <li>Wash windows for natural light</li>
              <li>Polish mirrors to expand space</li>
              <li>Arrange candles safely</li>
              <li>Create grateful atmosphere</li>
            </ul>

            <h2>Guest Room Grace</h2>
            <p>Welcome visitors with grateful preparation:</p>

            <h3>Comfort Creation:</h3>
            <ul>
              <li>Fresh linens with lavender sachets</li>
              <li>Extra blankets for November chill</li>
              <li>Bedside water carafe</li>
              <li>Reading materials selected</li>
              <li>Personal touches added</li>
            </ul>

            <h3>Thoughtful Details:</h3>
            <ul>
              <li>Empty drawers and closet space</li>
              <li>Full-length mirror cleaned</li>
              <li>Nightlight for navigation</li>
              <li>Phone charging station</li>
              <li>Welcome note with WiFi</li>
            </ul>

            <h2>The Gratitude Practice Room by Room</h2>
            <p>Start cleaning each room with appreciation:</p>
            <ul>
              <li>"Thank you, bedroom, for restful sleep"</li>
              <li>"Thank you, bathroom, for refreshing starts"</li>
              <li>"Thank you, kitchen, for nourishing meals"</li>
              <li>"Thank you, living room, for family gathering"</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Clean with gratitude this Thanksgiving</h3>
              <p className="mb-6">
                Let Wabi Sabi Services help you create a thankful home sanctuary that honors connection, comfort, and celebration.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Gratitude Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default November2025;
