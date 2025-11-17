import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const December2025 = () => {
  return (
    <Layout>
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
              December in Victoria sparkles with boat parades, twinkling lights, and the promise of gathering. Yet beneath the magic lurks the stress of hosting, gift-giving, and maintaining peace in busy homes. At Wabi Sabi Services, we believe your holiday cleaning can be an act of love – creating sacred spaces for memory-making without sacrificing your sanity or environmental values.
            </p>

            <h2>The Spirit of Seasonal Hospitality</h2>
            <p>In Japan, the concept of <em>omotenashi</em> – wholehearted hospitality – transforms cleaning from obligation to gift-giving. Your clean home becomes your present to guests, family, and yourself. This December, embrace cleaning as meditation on gratitude and connection.</p>

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

            <h2>Guest Room Grace: Five-Star at Home</h2>
            <p>Transform spare rooms into sanctuaries:</p>

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
              <h3 className="text-2xl font-serif mb-4">Create holiday magic through mindful cleaning</h3>
              <p className="mb-6">
                This December, let Wabi Sabi Services handle the cleaning so you can focus on creating cherished memories with loved ones.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Holiday Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default December2025;
