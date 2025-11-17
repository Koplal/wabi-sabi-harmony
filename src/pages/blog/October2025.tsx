import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const October2025 = () => {
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
              Embracing Autumn's Transition: Your Mindful Fall Cleaning Guide
            </h1>
            <p className="text-muted-foreground mb-8">Published: October 2025</p>

            <p className="lead">
              As maple leaves paint Victoria's streets in amber and gold, nature reminds us of the beauty in letting go. Fall cleaning isn't just about preparing for winter – it's about creating harmony between our indoor sanctuaries and the changing world outside.
            </p>

            <h2>The Philosophy of Autumn Renewal</h2>
            <p>In Japanese culture, autumn represents <em>mono no aware</em> – the bittersweet awareness of the impermanence of all things. Your fall cleaning can embody this principle: releasing summer's energy while welcoming autumn's introspective calm.</p>

            <h2>Windows: Portals to Seasonal Change</h2>
            <p>Victoria's October light has a unique quality – softer, more golden than summer's brightness. Clean windows become more important as we spend more time indoors:</p>

            <h3>Mindful Window Cleaning:</h3>
            <ul>
              <li>Start with gratitude for the view they provide</li>
              <li>Use a solution of warm water, white vinegar, and lavender essential oil</li>
              <li>Clean on overcast days to avoid streaking</li>
              <li>Don't forget window tracks – accumulated dust affects seal efficiency</li>
              <li>Consider leaving one small smudge as a reminder of wabi-sabi's beauty in imperfection</li>
            </ul>

            <h3>Energy Efficiency Check:</h3>
            <ul>
              <li>Inspect seals for drafts</li>
              <li>Clean or replace screens before storage</li>
              <li>Check for condensation issues that could lead to winter mold</li>
            </ul>

            <h2>Transitioning Textiles with Intention</h2>

            <h3>The Textile Ceremony:</h3>
            <p>As you swap lightweight summer linens for cozy autumn layers, treat this as a ritual:</p>
            <ol>
              <li><strong>Gratitude Practice:</strong> Thank summer bedding for its service</li>
              <li><strong>Mindful Washing:</strong> Use eco-friendly lavender or cedar sachets</li>
              <li><strong>Storage Wisdom:</strong> Store summer items with dried lavender from local Victoria farms</li>
              <li><strong>Welcoming Warmth:</strong> Unfold winter blankets with intention</li>
            </ol>

            <h3>Sustainable Textile Care:</h3>
            <ul>
              <li>Wash summer items in cold water with plant-based detergent</li>
              <li>Air-dry when possible (Victoria's October often provides perfect drying days)</li>
              <li>Repair small tears before storage – honor the item's continued service</li>
              <li>Donate textiles that no longer spark joy to local shelters before winter</li>
            </ul>

            <h2>The Sacred Kitchen: Preparing for Harvest Season</h2>
            <p>October brings thanksgiving and the return to hearth-centered living. Your kitchen deserves special attention:</p>

            <h3>Pantry Meditation:</h3>
            <ul>
              <li>Remove everything mindfully</li>
              <li>Check expiration dates without judgment</li>
              <li>Wipe shelves with rosemary-infused vinegar (naturally antibacterial)</li>
              <li>Organize with winter cooking in mind: soups, stews, baking supplies accessible</li>
              <li>Create a "give" box for food bank donations before the holiday rush</li>
            </ul>

            <h3>Appliance Deep Clean:</h3>
            <ul>
              <li><strong>Oven:</strong> Use baking soda paste overnight, honoring this hearth's hard work</li>
              <li><strong>Refrigerator:</strong> Clean coils for efficiency as it works harder in heated homes</li>
              <li><strong>Range Hood:</strong> Degrease filters – crucial as windows stay closed more</li>
              <li><strong>Small Appliances:</strong> Descale kettles and coffee makers with white vinegar</li>
            </ul>

            <h2>Bedroom Sanctuary: Creating Hygge Haven</h2>
            <p>Danish hygge meets Japanese wabi-sabi in your autumn bedroom:</p>

            <h3>Mattress Renewal:</h3>
            <ul>
              <li>Vacuum thoroughly with HEPA filter</li>
              <li>Sprinkle with baking soda and lavender, leave for 2 hours</li>
              <li>Flip or rotate mindfully, considering even wear</li>
              <li>Protect with breathable, organic cotton covers</li>
            </ul>

            <h3>Air Quality Enhancement:</h3>
            <ul>
              <li>Clean heating vents before first use</li>
              <li>Replace or clean humidifier filters</li>
              <li>Position a spider plant or peace lily for natural air purification</li>
              <li>Open windows briefly each day, even in rain – fresh air is essential</li>
            </ul>

            <h2>Entrance Ways: Threshold Protection</h2>
            <p>Victoria's autumn rain requires mindful entrance preparation:</p>

            <h3>Creating a Mudroom Mindset:</h3>
            <ul>
              <li>Install boot trays with river rocks for drainage and beauty</li>
              <li>Hang hooks at varied heights for all family members</li>
              <li>Place a bench for mindful shoe removal</li>
              <li>Keep natural fiber mat outside, absorbent inside</li>
              <li>Create umbrella stand from reclaimed materials</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Embrace autumn's graceful transition</h3>
              <p className="mb-6">
                Let Wabi Sabi Services help you create harmony between your indoor sanctuary and the changing season outside.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Autumn Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default October2025;
