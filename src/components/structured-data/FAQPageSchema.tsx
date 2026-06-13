import { JsonLd } from "./JsonLd";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  items: FAQItem[];
}

/**
 * FAQPage schema for answer-engine optimization (AEO).
 * Feeds clean question/answer pairs to Google AI Overviews, rich results,
 * and generative engines (ChatGPT, Perplexity). Answer text should match
 * the visible content on the page per Google's structured data guidelines.
 */
export const FAQPageSchema = ({ items }: FAQPageSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
};
