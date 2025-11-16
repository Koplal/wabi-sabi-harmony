import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const September = () => {
  return (
    <Layout>
      <article className="min-h-screen py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-4">September 2024 • 6 min read</div>
            <h1 className="font-serif text-4xl md:text-6xl mb-6">
              Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              As cherry blossoms bloom across Victoria, the urge to refresh our homes grows stronger. Spring cleaning is a time-honored tradition, but how can we honor this ritual while staying true to our environmental values? Here's your complete guide to sustainable spring cleaning.
            </p>

            <h2 className="font-serif text-3xl mt-12 mb-6">Why Sustainable Spring Cleaning Matters</h2>
            <p className="mb-4">
              Vancouver Island's pristine environment is our shared treasure. Every cleaning choice we make impacts our local ecosystem:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Chemicals washed down drains affect our marine life</li>
              <li>Single-use cleaning supplies contribute to landfill waste</li>
              <li>Harsh products diminish indoor air quality</li>
              <li>Energy-intensive cleaning methods increase carbon footprint</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Wabi Sabi Sustainable Cleaning Toolkit</h2>
            <p className="mb-4">
              Transform your cleaning routine with these eco-friendly essentials:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Reusable Tools:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Microfiber cloths</strong> - Last years, trap dirt effectively without chemicals</li>
              <li><strong>Natural fiber brushes</strong> - Biodegradable and durable</li>
              <li><strong>Glass spray bottles</strong> - Eliminate plastic waste</li>
              <li><strong>Washable mop heads</strong> - Reuse hundreds of times</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Natural Cleaning Agents:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>White vinegar</strong> - Natural disinfectant and deodorizer</li>
              <li><strong>Baking soda</strong> - Gentle abrasive for scrubbing</li>
              <li><strong>Castile soap</strong> - Vegetable-based, biodegradable cleaner</li>
              <li><strong>Essential oils</strong> - Natural fragrances with antimicrobial properties</li>
              <li><strong>Lemon juice</strong> - Natural bleaching and deodorizing agent</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Room-by-Room Sustainable Spring Cleaning</h2>

            <h3 className="font-serif text-2xl mt-8 mb-4">Kitchen Excellence:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Deep clean appliances using natural degreasers</li>
              <li>Organize pantry and donate unexpired items</li>
              <li>Clean and sanitize reusable containers</li>
              <li>Refresh refrigerator coils for energy efficiency</li>
              <li>Polish stainless steel with olive oil for natural shine</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Bathroom Sanctuary:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Remove grout stains with baking soda paste</li>
              <li>Descale fixtures with vinegar solution</li>
              <li>Clean shower curtains instead of replacing</li>
              <li>Organize and minimize product collection</li>
              <li>Replace chemical air fresheners with natural alternatives</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Living Spaces:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Vacuum upholstery and under cushions</li>
              <li>Clean windows with vinegar solution and newspaper</li>
              <li>Rotate and flip mattresses</li>
              <li>Declutter mindfully - donate, recycle, compost</li>
              <li>Deep clean carpets with eco-friendly methods</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Energy-Efficient Cleaning Practices</h2>
            <p className="mb-4">
              Reduce your environmental impact while cleaning:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Cold water washing</strong> - Most laundry cleans effectively in cold</li>
              <li><strong>Air drying</strong> - Use Victoria's fresh air instead of dryers</li>
              <li><strong>Batch cleaning</strong> - Clean multiple areas at once to save energy</li>
              <li><strong>Natural light</strong> - Open blinds instead of turning on lights</li>
              <li><strong>Efficient vacuum timing</strong> - Use during off-peak energy hours</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Art of Mindful Decluttering</h2>
            <p className="mb-4">
              Spring cleaning isn't just about removing dirt – it's about creating space and clarity:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Sustainable Disposal Methods:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Donate</strong> - Give usable items to local charities</li>
              <li><strong>Sell</strong> - Online marketplaces reduce waste</li>
              <li><strong>Recycle properly</strong> - Know Victoria's recycling guidelines</li>
              <li><strong>Compost</strong> - Natural materials return to earth</li>
              <li><strong>Upcycle</strong> - Creative reuse extends item life</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Professional Eco-Luxury Spring Cleaning</h2>
            <p className="mb-4">
              Sometimes, the most sustainable choice is hiring professionals who do it right the first time. Wabi Sabi Services offers:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Concentrated eco-products reducing packaging waste</li>
              <li>Professional-grade equipment using less water</li>
              <li>Expertise preventing damage that leads to replacement</li>
              <li>Time savings allowing you to focus on other sustainable practices</li>
              <li>Consistent maintenance preventing deep-set problems</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Maintaining Your Spring-Fresh Home</h2>
            <p className="mb-4">
              Sustain your spring cleaning success with these ongoing habits:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Daily 10-minute tidy prevents overwhelming buildup</li>
              <li>Weekly natural cleaning rotations</li>
              <li>Monthly deep-clean focus areas</li>
              <li>Seasonal equipment maintenance</li>
              <li>Continuous mindful consumption</li>
            </ul>

            <p className="text-lg mt-12 p-6 bg-secondary/30 rounded-lg">
              This spring, clean your home in harmony with our beautiful Island environment. Your space will shine, your conscience will rest easy, and Victoria's natural splendor will thank you.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Button asChild>
              <Link to="/book">Book Your Eco-Luxury Cleaning</Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default September;
