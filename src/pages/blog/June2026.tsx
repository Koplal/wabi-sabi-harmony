import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import blogHero from "@/assets/blog-hero.jpg";

const June2026 = () => {
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
              Pet-Friendly Cleaning: Keeping Your Home Fresh and Your Furry Friends Safe
            </h1>
            <p className="text-muted-foreground mb-8">Published: June 2026</p>

            <p className="lead">
              Victoria's pet-loving community knows the joy our four-legged friends bring to our lives. But maintaining a clean, fresh home while ensuring pet safety requires special consideration. Here's your complete guide to pet-friendly cleaning that keeps everyone happy and healthy.
            </p>

            <h2>The Hidden Dangers in Traditional Cleaning</h2>
            <p>Many conventional cleaning products pose serious risks to pets:</p>
            <ul>
              <li><strong>Phenols</strong> (in disinfectants): Toxic to cats, even in small amounts</li>
              <li><strong>Bleach</strong>: Causes respiratory and digestive issues</li>
              <li><strong>Ammonia</strong>: Burns throat and stomach lining</li>
              <li><strong>Essential oils</strong>: Some are toxic to pets (tea tree, eucalyptus, citrus for cats)</li>
              <li><strong>Formaldehyde</strong>: Found in some air fresheners, causes cancer</li>
            </ul>

            <h2>Safe Cleaning Solutions for Pet Homes</h2>

            <h3>Wabi Sabi's Pet-Safe Arsenal:</h3>
            <ul>
              <li>Enzyme cleaners for biological messes</li>
              <li>Vinegar-based solutions (diluted properly)</li>
              <li>Baking soda for odor absorption</li>
              <li>Castile soap for general cleaning</li>
              <li>Pet-specific botanical cleaners</li>
              <li>Microfiber technology for hair removal</li>
            </ul>

            <h2>Managing Pet Odors Naturally</h2>

            <h3>Preventive Measures:</h3>
            <ol>
              <li>Regular grooming reduces shedding and dander</li>
              <li>Wash pet bedding weekly in hot water</li>
              <li>Clean litter boxes daily, full change weekly</li>
              <li>Vacuum frequently with HEPA filters</li>
              <li>Maintain optimal humidity (30-50%)</li>
            </ol>

            <h3>Natural Deodorizers:</h3>
            <ul>
              <li>Activated charcoal in strategic locations</li>
              <li>Baking soda on carpets before vacuuming</li>
              <li>Fresh air circulation daily</li>
              <li>Indoor plants that purify air (pet-safe varieties)</li>
              <li>Professional enzyme treatments for deep odors</li>
            </ul>

            <h2>Tackling Common Pet Messes</h2>

            <h3>Fresh Urine:</h3>
            <ol>
              <li>Blot immediately (don't rub)</li>
              <li>Apply enzyme cleaner</li>
              <li>Let sit according to directions</li>
              <li>Blot again and air dry</li>
              <li>Repeat if necessary</li>
            </ol>

            <h3>Vomit or Hairballs:</h3>
            <ol>
              <li>Remove solid matter</li>
              <li>Blot liquid</li>
              <li>Apply enzyme cleaner</li>
              <li>Clean with pet-safe detergent</li>
              <li>Rinse thoroughly</li>
            </ol>

            <h3>Muddy Paws:</h3>
            <ol>
              <li>Let mud dry completely</li>
              <li>Vacuum dried mud</li>
              <li>Clean with mild soap solution</li>
              <li>Use door mats and paw stations</li>
            </ol>

            <h2>Creating Pet Zones</h2>
            <p>Organize your home for easier maintenance:</p>

            <h3>Feeding Station:</h3>
            <ul>
              <li>Waterproof mats under bowls</li>
              <li>Daily bowl washing</li>
              <li>Regular mat cleaning</li>
              <li>Elevated feeders for less mess</li>
            </ul>

            <h3>Entry Management:</h3>
            <ul>
              <li>Paw cleaning station</li>
              <li>Towel storage</li>
              <li>Waterproof runners</li>
              <li>Easy-clean surfaces</li>
            </ul>

            <h3>Sleep Spaces:</h3>
            <ul>
              <li>Washable covers on furniture</li>
              <li>Designated pet blankets</li>
              <li>Regular washing rotation</li>
              <li>Easy-clean pet beds</li>
            </ul>

            <h2>Pet Hair Management</h2>

            <h3>Daily Strategies:</h3>
            <ul>
              <li>Brush pets regularly outside</li>
              <li>Use microfiber cloths on furniture</li>
              <li>Vacuum high-traffic areas daily</li>
              <li>Use rubber gloves on upholstery</li>
              <li>Keep lint rollers accessible</li>
            </ul>

            <h3>Deep Cleaning Techniques:</h3>
            <ul>
              <li>HEPA vacuum filters essential</li>
              <li>Steam clean carpets quarterly</li>
              <li>Professional upholstery cleaning bi-annually</li>
              <li>Wash curtains and throws monthly</li>
              <li>Clean air vents regularly</li>
            </ul>

            <h2>Professional Pet-Safe Cleaning</h2>
            <p>When to call in the experts:</p>
            <ul>
              <li>Deep odor removal requiring professional enzymes</li>
              <li>Regular maintenance to stay ahead of accumulation</li>
              <li>Safe, effective products for pet households</li>
              <li>Proper techniques that don't harm your pets</li>
              <li>Peace of mind with certified pet-safe methods</li>
            </ul>

            <div className="mt-12 p-8 bg-muted rounded-lg">
              <h3 className="text-2xl font-serif mb-4">Safe, fresh, pet-friendly cleaning</h3>
              <p className="mb-6">
                Keep your home spotless and your furry friends safe with Wabi Sabi Services' pet-friendly cleaning expertise.
              </p>
              <Link to="/book">
                <Button size="lg">Book Your Pet-Safe Clean</Button>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default June2026;
