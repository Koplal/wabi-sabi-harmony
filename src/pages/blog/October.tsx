import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const October = () => {
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
            <div className="text-sm text-muted-foreground mb-4">October 2024 • 5 min read</div>
            <h1 className="font-serif text-4xl md:text-6xl mb-6">
              The Art of Minimalism: How Less Stuff Means Less Stress
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              New Year, new perspective. As we settle into 2025, many Victorians are embracing minimalism – not as deprivation, but as liberation. At Wabi Sabi Services, we've witnessed firsthand how simplified spaces transform lives. Here's why less truly is more.
            </p>

            <h2 className="font-serif text-3xl mt-12 mb-6">Understanding Minimalism Through Wabi-Sabi</h2>
            <p className="mb-4">
              Our company's namesake philosophy, wabi-sabi, finds profound beauty in simplicity. This Japanese concept teaches us that:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Imperfection is authentic</li>
              <li>Simplicity brings clarity</li>
              <li>Space itself has value</li>
              <li>Quality trumps quantity</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Psychology of Clutter</h2>
            <p className="mb-4">
              Research from UCLA's Center on Everyday Lives of Families found that women with cluttered homes have elevated cortisol levels – the stress hormone. Physical clutter creates:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Decision fatigue from too many choices</li>
              <li>Visual overwhelm that exhausts the brain</li>
              <li>Guilt about unfinished projects</li>
              <li>Anxiety about losing important items</li>
              <li>Reduced ability to relax at home</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Minimalist Cleaning Advantage</h2>
            <p className="mb-4">
              Our clients who embrace minimalism report:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>50% less cleaning time</strong> - Fewer items to move, dust, and organize</li>
              <li><strong>Deeper cleaning possible</strong> - Access to all surfaces and corners</li>
              <li><strong>Maintained cleanliness</strong> - Less stuff means less mess accumulation</li>
              <li><strong>Enhanced air quality</strong> - Fewer dust collectors</li>
              <li><strong>Greater home enjoyment</strong> - Space becomes calming, not overwhelming</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Your Minimalism Journey: Start Small</h2>

            <h3 className="font-serif text-2xl mt-8 mb-4">Week 1: The Surface Sweep</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Clear all countertops except daily essentials</li>
              <li>Remove decorative items that don't bring joy</li>
              <li>Create designated homes for everything</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Week 2: The Hidden Spaces</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Tackle one drawer or cabinet daily</li>
              <li>Apply the one-year rule: unused in a year = donate</li>
              <li>Organize remaining items thoughtfully</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Week 3: The Sentimental Sort</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Photograph sentimental items you don't need to keep</li>
              <li>Keep one representative item from collections</li>
              <li>Create a memory box with size limits</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Week 4: The Digital Detox</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Declutter digital files and photos</li>
              <li>Unsubscribe from unnecessary emails</li>
              <li>Organize remaining digital life</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Minimalism Room by Room</h2>

            <h3 className="font-serif text-2xl mt-8 mb-4">Bedroom Sanctuary:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Limit surfaces to essentials only</li>
              <li>Invest in quality bedding over quantity</li>
              <li>Create calm with neutral colors</li>
              <li>Remove electronics for better sleep</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Kitchen Efficiency:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Keep counters completely clear</li>
              <li>Store appliances used less than weekly</li>
              <li>Maintain one set of quality dishes</li>
              <li>Organize drawers with dividers</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Living Room Serenity:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Choose furniture with hidden storage</li>
              <li>Display only meaningful artwork</li>
              <li>Maintain clear pathways</li>
              <li>Embrace negative space</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Sustainable Side of Minimalism</h2>
            <p className="mb-4">
              Minimalism naturally aligns with environmental consciousness:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Reduced consumption means less waste</li>
              <li>Quality purchases last longer</li>
              <li>Less cleaning products needed</li>
              <li>Smaller carbon footprint</li>
              <li>Support for conscious businesses</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Maintaining Your Minimalist Space</h2>
            <p className="mb-4">
              Once achieved, minimalism requires mindful maintenance:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Daily Habits:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Everything returns to its home</li>
              <li>One in, one out rule</li>
              <li>Evening 10-minute reset</li>
              <li>Mindful purchasing decisions</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Weekly Rituals:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Surface cleaning becomes quick</li>
              <li>Evaluate any accumulation</li>
              <li>Appreciate your space</li>
              <li>Plan ahead to prevent clutter</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">How Professional Cleaning Supports Minimalism</h2>
            <p className="mb-4">
              Regular professional cleaning helps maintain minimalist spaces by:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Deep cleaning what remains</li>
              <li>Preventing buildup in simplified spaces</li>
              <li>Maintaining the calm you've created</li>
              <li>Allowing you to enjoy, not maintain, your space</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Minimalist Mindset</h2>
            <p className="mb-4">
              Remember, minimalism isn't about deprivation – it's about intention. Every item in your space should:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Serve a purpose</li>
              <li>Bring genuine joy</li>
              <li>Align with your values</li>
              <li>Deserve the space it occupies</li>
            </ul>

            <p className="text-lg mt-12 p-6 bg-secondary/30 rounded-lg">
              Start your minimalism journey today. Less stuff, less stress, more life. Let Wabi Sabi Services help you maintain the serene, simplified space you deserve.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Button asChild>
              <Link to="/book">Book Your Minimalist Clean</Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default October;
