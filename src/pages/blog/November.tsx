import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const November = () => {
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
            <div className="text-sm text-muted-foreground mb-4">November 2024 • 6 min read</div>
            <h1 className="font-serif text-4xl md:text-6xl mb-6">
              Living Clean with Furry Friends: A Pet Owner's Guide to Pristine Homes
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              As fellow pet lovers in Victoria, we understand the joy our furry companions bring – and the unique cleaning challenges they present. The good news? You can absolutely maintain a spotless, fresh-smelling home while living with pets. Here's how to do it without compromising your pet's wellbeing or your home's cleanliness.
            </p>

            <h2 className="font-serif text-3xl mt-12 mb-6">Understanding Pet-Specific Cleaning Challenges</h2>
            <p className="mb-4">
              Living with pets introduces specific cleaning needs:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Pet hair</strong> - Constantly shed and accumulates in unexpected places</li>
              <li><strong>Dander</strong> - Microscopic skin flakes that trigger allergies</li>
              <li><strong>Odors</strong> - From accidents, wet fur, or litter boxes</li>
              <li><strong>Tracked dirt</strong> - Paws bring outdoor elements inside</li>
              <li><strong>Occasional accidents</strong> - Even the best-trained pets have mishaps</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Pet-Safe Cleaning: What You Must Know</h2>
            <p className="mb-4">
              Not all cleaning products are created equal. Many conventional cleaners contain chemicals toxic to pets:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Dangerous Ingredients to Avoid:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Bleach - Respiratory irritant and toxic if ingested</li>
              <li>Ammonia - Lung damage and resembles urine smell to pets</li>
              <li>Phenols - Found in many disinfectants, toxic to cats</li>
              <li>Formaldehyde - Carcinogenic and respiratory irritant</li>
              <li>Phthalates - Hormone disruptors</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Pet-Safe Alternatives:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>White vinegar</strong> - Natural disinfectant (avoid on certain surfaces)</li>
              <li><strong>Baking soda</strong> - Deodorizer and gentle abrasive</li>
              <li><strong>Enzyme cleaners</strong> - Break down organic matter naturally</li>
              <li><strong>Plant-based soaps</strong> - Gentle yet effective</li>
              <li><strong>Essential oils (carefully)</strong> - Some are pet-safe, others toxic</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Battle Against Pet Hair</h2>
            <p className="mb-4">
              Pet hair management requires strategy, not just effort:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Prevention Strategies:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Regular grooming</strong> - Brush pets daily during shedding seasons</li>
              <li><strong>Professional grooming</strong> - Monthly visits reduce shedding significantly</li>
              <li><strong>High-quality diet</strong> - Better nutrition = healthier coat = less shedding</li>
              <li><strong>Supplements</strong> - Omega fatty acids improve coat health</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Removal Techniques:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>HEPA vacuum</strong> - Essential for capturing fine pet hair</li>
              <li><strong>Rubber gloves</strong> - Dampen and run over fabric to gather hair</li>
              <li><strong>Lint rollers</strong> - Keep multiple throughout your home</li>
              <li><strong>Microfiber cloths</strong> - Static attracts hair effectively</li>
              <li><strong>Furniture covers</strong> - Washable protection for sofas and chairs</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Eliminating Pet Odors Naturally</h2>
            <p className="mb-4">
              Pet odors don't require harsh chemicals to eliminate:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Daily Odor Prevention:</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Regular grooming reduces shedding and dander</li>
              <li>Wash pet bedding weekly in hot water</li>
              <li>Clean litter boxes daily, full change weekly</li>
              <li>Vacuum frequently with HEPA filters</li>
              <li>Maintain optimal humidity (30-50%)</li>
            </ol>

            <h3 className="font-serif text-2xl mt-8 mb-4">Natural Deodorizers:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Activated charcoal in strategic locations</li>
              <li>Baking soda on carpets before vacuuming</li>
              <li>Fresh air circulation daily</li>
              <li>Indoor plants that purify air (pet-safe varieties)</li>
              <li>Professional enzyme treatments for deep odors</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Tackling Common Pet Messes</h2>

            <h3 className="font-serif text-2xl mt-8 mb-4">Fresh Urine:</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Blot immediately (don't rub)</li>
              <li>Apply enzyme cleaner</li>
              <li>Let sit according to directions</li>
              <li>Blot again and air dry</li>
              <li>Repeat if necessary</li>
            </ol>

            <h3 className="font-serif text-2xl mt-8 mb-4">Vomit or Hairballs:</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Remove solid matter</li>
              <li>Blot liquid</li>
              <li>Apply enzyme cleaner</li>
              <li>Clean with pet-safe detergent</li>
              <li>Rinse thoroughly</li>
            </ol>

            <h3 className="font-serif text-2xl mt-8 mb-4">Muddy Paws:</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Let mud dry completely</li>
              <li>Vacuum dried mud</li>
              <li>Clean with mild soap solution</li>
              <li>Use door mats and paw stations</li>
            </ol>

            <h2 className="font-serif text-3xl mt-12 mb-6">Creating Pet Zones</h2>
            <p className="mb-4">
              Organize your home for easier maintenance:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Feeding Station:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Waterproof mats under bowls</li>
              <li>Daily bowl washing</li>
              <li>Regular mat cleaning</li>
              <li>Elevated feeders for less mess</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Entry Management:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Paw cleaning station</li>
              <li>Towel storage</li>
              <li>Waterproof runners</li>
              <li>Easy-clean surfaces</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Sleep Spaces:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Washable covers on furniture</li>
              <li>Designated pet blankets</li>
              <li>Regular washing rotation</li>
              <li>Protected favorite spots</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Professional Cleaning for Pet Homes</h2>
            <p className="mb-4">
              Why pet owners love Wabi Sabi Services:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Pet-safe products exclusively</li>
              <li>Team trained in pet home challenges</li>
              <li>Flexible scheduling around pet routines</li>
              <li>Understanding of pet anxiety</li>
              <li>Thorough hair and dander removal</li>
              <li>Enzyme treatments for persistent odors</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Pet-Safe Plants for Natural Air Cleaning</h2>
            <p className="mb-4">
              Enhance air quality with these safe options:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Spider plants</li>
              <li>Boston ferns</li>
              <li>Bamboo palm</li>
              <li>Prayer plants</li>
              <li>Peperomia</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Wabi Sabi Promise to Pet Parents</h2>
            <p className="mb-4">
              We understand pets are family. Our service ensures:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Never using products harmful to pets</li>
              <li>Respecting pet spaces and routines</li>
              <li>Securing homes properly</li>
              <li>Communicating about pet needs</li>
              <li>Treating pets with kindness</li>
            </ul>

            <p className="text-lg mt-12 p-6 bg-secondary/30 rounded-lg">
              <strong>Special Offer for Pet Parents:</strong> Mention this article for 10% off our Pet-Fresh Deep Clean package.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Button asChild>
              <Link to="/book">Book Your Pet-Safe Cleaning</Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default November;
