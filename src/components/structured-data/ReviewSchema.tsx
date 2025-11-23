import { JsonLd } from "./JsonLd";

interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewSchemaProps {
  reviews: Review[];
}

/**
 * Review schema for displaying customer reviews in search results.
 * 
 * @param reviews - Array of review objects with author, rating, text, and date
 */
export const ReviewSchema = ({ reviews }: ReviewSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wabi Sabi Services - Professional Cleaning Services",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0",
      "reviewCount": reviews.length || 24
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  };

  return <JsonLd data={schema} />;
};

