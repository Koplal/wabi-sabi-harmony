import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const August = () => {
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
            <div className="text-sm text-muted-foreground mb-4">August 2024 • 5 min read</div>
            <h1 className="font-serif text-4xl md:text-6xl mb-6">
              The Hidden Health Benefits of a Clean Home: What Science Tells Us
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              As we embrace the colder months in Victoria, we spend more time indoors, making the cleanliness of our living spaces more important than ever. But did you know that a clean home offers benefits far beyond aesthetic appeal? Let's explore the science-backed health advantages of maintaining a pristine living environment.
            </p>

            <h2 className="font-serif text-3xl mt-12 mb-6">Mental Health and Clarity</h2>
            <p className="mb-4">
              Recent studies from Princeton University reveal that cluttered spaces significantly impact our ability to focus and process information. When our environment is organized and clean, our minds can relax and function more efficiently. This isn't just about tidiness – it's about creating a sanctuary that supports mental well-being.
            </p>
            <p className="mb-4">
              At Wabi Sabi Services, we understand that cleaning is more than a chore; it's an act of self-care. Our mindful approach to cleaning helps create spaces that promote:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Reduced anxiety and stress levels</li>
              <li>Improved sleep quality</li>
              <li>Enhanced productivity and creativity</li>
              <li>Greater sense of control and accomplishment</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Physical Health Protection</h2>
            <p className="mb-4">
              Your home should be a haven from environmental stressors, not a source of them. Regular professional cleaning dramatically reduces:
            </p>

            <h3 className="font-serif text-2xl mt-8 mb-4">Allergens and Irritants:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Dust mites (reduced by up to 90% with regular deep cleaning)</li>
              <li>Pet dander accumulation</li>
              <li>Pollen tracked indoors</li>
              <li>Mold spores in damp areas</li>
            </ul>

            <h3 className="font-serif text-2xl mt-8 mb-4">Disease-Causing Pathogens:</h3>
            <p className="mb-6">
              Studies show that frequently touched surfaces can harbor bacteria for days or even weeks. Our eco-friendly disinfectants eliminate 99.9% of harmful bacteria without introducing toxic chemicals into your home.
            </p>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Eco-Luxury Advantage</h2>
            <p className="mb-4">
              Traditional cleaning products often trade one health risk for another, eliminating germs while introducing volatile organic compounds (VOCs) that can trigger respiratory issues, headaches, and skin irritation. Our carefully selected eco-luxury products provide:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Hospital-grade disinfection using plant-based ingredients</li>
              <li>Zero VOC emissions</li>
              <li>Hypoallergenic formulas safe for sensitive individuals</li>
              <li>Biodegradable components that protect our water systems</li>
            </ul>

            <h2 className="font-serif text-3xl mt-12 mb-6">Creating Your Healthy Home Routine</h2>
            <p className="mb-4">
              While professional cleaning provides deep sanitation, maintaining a healthy home between services is equally important. Here are our top tips:
            </p>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li><strong>Establish daily micro-cleaning habits</strong> - 10 minutes each evening prevents buildup</li>
              <li><strong>Focus on high-touch surfaces</strong> - Door handles, light switches, and remotes need frequent attention</li>
              <li><strong>Maintain optimal humidity</strong> - Between 30-50% to discourage mold and dust mites</li>
              <li><strong>Let fresh air in</strong> - Even in winter, brief ventilation improves air quality</li>
              <li><strong>Use doormats effectively</strong> - 85% of dirt enters on shoes</li>
            </ol>

            <h2 className="font-serif text-3xl mt-12 mb-6">The Wabi Sabi Approach</h2>
            <p className="mb-4">
              Our philosophy extends beyond cleaning to creating harmonious spaces that nurture health. We believe in:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Working with natural light and airflow patterns</li>
              <li>Respecting the inherent beauty of your space</li>
              <li>Using gentle, effective techniques that preserve your furnishings</li>
              <li>Creating calm through cleanliness</li>
            </ul>

            <p className="text-lg mt-12 p-6 bg-secondary/30 rounded-lg">
              Ready to experience the health benefits of mindful luxury cleaning? Contact Wabi Sabi Services today and discover how we can transform your home into a true wellness sanctuary.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Button asChild>
              <Link to="/book">Book Your Cleaning Service</Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default August;
