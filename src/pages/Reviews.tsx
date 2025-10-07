import { Layout } from "@/components/Layout";

const Reviews = () => {
  const reviews = [
    {
      quote: "Listing went live at 10am and sold in 48 hours. The house felt like a boutique hotel.",
      author: "S.K., Uplands"
    },
    {
      quote: "They care for our marble like it's their own.",
      author: "M.D., Bear Mountain"
    },
    {
      quote: "Wabi Sabi Services elevated our home beyond clean—it felt like a boutique retreat.",
      author: "A.L., Oak Bay"
    },
    {
      quote: "Professional, discreet, and meticulous. We trust them completely.",
      author: "J.R., Bear Mountain"
    }
  ];

  return (
    <Layout>
      <div className="py-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl mb-12 text-center">
            Client Reviews
          </h1>

          <p className="text-xl text-center text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
            The quiet satisfaction of a space thoughtfully cared for.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
