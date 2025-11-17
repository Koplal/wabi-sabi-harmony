import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const March2026 = () => {
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

            <h2>The Wabi Sabi Sustainable Cleaning Toolkit</h2>
            
            <h3>Essential Eco-Friendly Ingredients:</h3>
            <ul>
              <li>White vinegar (natural disinfectant and deodorizer)</li>
              <li>Baking soda (gentle abrasive and odor neutralizer)</li>
              <li>Castile soap (plant-based, biodegradable cleanser)</li>
              <li>Essential oils (natural fragrance and antimicrobial properties)</li>
              <li>Microfiber cloths (reusable, effective without chemicals)</li>
            </ul>

            <h2>Room-by-Room Sustainable Spring Cleaning Guide</h2>

            <h3>Kitchen Revival:</h3>
            <ul>
              <li>Degreasing naturally: Combine equal parts vinegar and hot water</li>
              <li>Oven cleaning: Baking soda paste left overnight works wonders</li>
              <li>Refrigerator refresh: Remove contents, clean with mild soap</li>
              <li>Dishwasher deep clean: Run empty cycle with vinegar</li>
            </ul>

            <h3>Bathroom Brilliance:</h3>
            <ul>
              <li>Tub and tile: Baking soda sprinkle, spray with vinegar, gentle scrub</li>
              <li>Mirror magic: Newspaper and vinegar solution for streak-free shine</li>
              <li>Natural mold prevention: Tea tree oil spray (10 drops per cup of water)</li>
              <li>Toilet treatment: Borax and vinegar combination</li>
            </ul>

            <h3>Living Spaces:</h3>
            <ul>
              <li>Carpet refresher: Sprinkle baking soda, let sit, vacuum thoroughly</li>
              <li>Window washing: Vinegar solution with squeegee</li>
              <li>Wood furniture polish: Olive oil and lemon juice mixture</li>
              <li>Air purification: Open windows, add houseplants</li>
            </ul>

            <h2>Decluttering with Purpose</h2>
            <p>Spring cleaning isn't just about cleaning – it's about mindful consumption:</p>

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

            <h2>Natural Spring Cleaning Recipes</h2>

            <h3>Cherry Blossom All-Purpose Spray:</h3>
            <ul>
              <li>2 cups distilled water</li>
              <li>1/2 cup white vinegar</li>
              <li>15 drops lavender essential oil</li>
              <li>10 drops lemon essential oil</li>
            </ul>

            <h3>Spring Garden Furniture Polish:</h3>
            <ul>
              <li>1/4 cup olive oil</li>
              <li>1/4 cup lemon juice</li>
              <li>10 drops rosemary essential oil</li>
            </ul>

            <h2>Professional Support for Your Sustainable Goals</h2>
            <p>Sometimes, the most sustainable choice is to call in professionals who:</p>
            <ul>
              <li>Use concentrated, eco-certified products (reducing packaging waste)</li>
              <li>Employ efficient techniques (saving water and energy)</li>
              <li>Have proper disposal/recycling knowledge</li>
              <li>Bring reusable supplies and equipment</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Sustainable spring cleaning made easy</h3>
              <p className="mb-6">
                Let Wabi Sabi Services help you achieve a sparkling clean home while honoring our Island's pristine environment.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Eco-Friendly Spring Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default March2026;
