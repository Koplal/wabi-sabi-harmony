import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const April2026 = () => {
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
              Earth Month Excellence: Cleaning with Climate Consciousness
            </h1>
            <p className="text-muted-foreground mb-8">Published: April 2026</p>

            <p className="lead">
              April brings Earth Day and a global focus on environmental stewardship. Here in Victoria, where ocean meets forest and sustainability shapes our culture, this month offers the perfect opportunity to align our cleaning practices with our planet's needs.
            </p>

            <h2>The Climate Cost of Conventional Cleaning</h2>
            <p>Traditional cleaning impacts our planet more than most realize:</p>
            <ul>
              <li>Average household uses 8 gallons of hazardous chemicals annually</li>
              <li>Single-use cleaning products generate 230 pounds of waste per year</li>
              <li>Synthetic fragrances contribute to indoor air pollution</li>
              <li>Microplastics from synthetic cloths enter our oceans</li>
              <li>Energy-intensive cleaning methods increase carbon footprints</li>
            </ul>

            <h2>Your Earth Month Action Plan</h2>

            <h3>Week 1: Audit and Awareness</h3>
            <ul>
              <li>Inventory current cleaning products</li>
              <li>Research ingredient impacts</li>
              <li>Calculate cleaning waste footprint</li>
              <li>Identify areas for improvement</li>
              <li>Set sustainability goals</li>
            </ul>

            <h3>Week 2: Sustainable Swaps</h3>
            <ul>
              <li>Replace chemical cleaners with natural alternatives</li>
              <li>Switch disposable products for reusables</li>
              <li>Invest in quality tools that last</li>
              <li>Choose concentrated products</li>
              <li>Select refillable options</li>
            </ul>

            <h3>Week 3: Water Wisdom</h3>
            <ul>
              <li>Fix dripping faucets</li>
              <li>Install low-flow fixtures</li>
              <li>Adopt water-saving cleaning methods</li>
              <li>Collect greywater for appropriate uses</li>
              <li>Time cleaning tasks efficiently</li>
            </ul>

            <h3>Week 4: Energy Excellence</h3>
            <ul>
              <li>Clean in natural light when possible</li>
              <li>Use cold water for most cleaning</li>
              <li>Air-dry instead of heat-drying</li>
              <li>Maintain appliances for efficiency</li>
              <li>Choose manual tools over electric</li>
            </ul>

            <h2>The Zero-Waste Cleaning Challenge</h2>
            <p>Can you clean without creating trash?</p>

            <h3>Reusable Arsenal:</h3>
            <ul>
              <li>Microfiber cloths replace paper towels</li>
              <li>Glass spray bottles over plastic</li>
              <li>Refillable soap dispensers</li>
              <li>Washable mop heads</li>
              <li>Compostable scrub brushes</li>
            </ul>

            <h3>DIY Cleaning Product Station:</h3>
            <p>Create a sustainable cleaning laboratory:</p>
            <ul>
              <li>Bulk vinegar in glass containers</li>
              <li>Baking soda in reusable jars</li>
              <li>Castile soap refill station</li>
              <li>Essential oils for customization</li>
              <li>Reusable labels for organization</li>
            </ul>

            <h2>Ocean-Safe Cleaning for Island Living</h2>
            <p>Living on Vancouver Island means protecting our waters:</p>

            <h3>Marine-Friendly Practices:</h3>
            <ul>
              <li>Phosphate-free detergents only</li>
              <li>Biodegradable soaps exclusively</li>
              <li>No antibacterial chemicals</li>
              <li>Avoid synthetic fragrances</li>
              <li>Proper disposal of any hazardous materials</li>
            </ul>

            <h3>Drain-Conscious Cleaning:</h3>
            <ul>
              <li>Use drain catchers to prevent debris</li>
              <li>Never flush cleaning wipes</li>
              <li>Avoid caustic drain cleaners</li>
              <li>Choose enzyme-based alternatives</li>
              <li>Regular maintenance prevents harsh treatments</li>
            </ul>

            <h2>Indigenous Wisdom in Cleaning</h2>
            <p>Honor Coast Salish teachings about land stewardship:</p>
            <ul>
              <li>Take only what you need</li>
              <li>Give back more than you take</li>
              <li>Consider seven generations ahead</li>
              <li>Respect all living things</li>
              <li>Practice gratitude for resources</li>
            </ul>

            <h2>The Carbon Footprint of Clean</h2>
            <p>Calculate and reduce your cleaning carbon footprint:</p>

            <h3>High-Impact Habits to Change:</h3>
            <ul>
              <li>Hot water washing → Cold water</li>
              <li>Disposable products → Reusables</li>
              <li>Driving for supplies → Bulk buying/delivery</li>
              <li>Energy-intensive tools → Manual alternatives</li>
              <li>Synthetic products → Natural options</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Clean with climate consciousness</h3>
              <p className="mb-6">
                Celebrate Earth Month with Wabi Sabi Services' eco-certified cleaning that protects our planet while maintaining your pristine home.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Earth-Friendly Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default April2026;
