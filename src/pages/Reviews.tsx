import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { googleReviews } from "@/data/googleReviews";
import { GOOGLE_REVIEWS_URL } from "@/data/organization";
import reviewsHero from "@/assets/reviews-hero.jpg";

const Reviews = () => {
  const reviews = [
    {
      quote: "The attention to detail was remarkable. Our home has never looked this pristine.",
      author: "S.K., Uplands"
    },
    ...googleReviews
  ];

  return (
    <Layout>
      <SEO
        title="Client Reviews & Testimonials"
        description="What discerning clients across Greater Victoria, BC say about Wabi Sabi Services and its quiet, discreet concierge cleaning."
        keywords="cleaning reviews Victoria BC, cleaning testimonials Victoria, best cleaners Victoria, luxury cleaning reviews"
        canonical="https://wabisabiservices.ca/reviews"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Reviews", url: "https://wabisabiservices.ca/reviews" },
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://wabisabiservices.ca/" },
          { name: "Reviews", url: "https://wabisabiservices.ca/reviews" },
        ]}
      />
      <div className="relative">
        <div className="w-full h-[500px] overflow-hidden">
          <img 
            src={reviewsHero} 
            alt="Handwritten client testimonials on natural wood surface" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Client Reviews
          </h1>

          <p className="text-xl text-center text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
            The quiet satisfaction of a space thoughtfully cared for.
          </p>

          <div
            className={
              reviews.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-12" : "grid grid-cols-1 gap-12 max-w-2xl mx-auto"
            }
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border-l-2 border-accent pl-8 py-4 animate-in fade-in duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-lg mb-4 leading-relaxed italic">
                  "{review.quote}"
                </p>
                <p className="text-sm text-muted-foreground">— {review.author}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Button asChild variant="outline">
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Read our Google Reviews
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
