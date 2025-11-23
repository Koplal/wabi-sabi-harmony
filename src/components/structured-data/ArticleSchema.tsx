import { JsonLd } from "./JsonLd";

interface ArticleSchemaProps {
  title: string;
  description: string;
  publishedDate: string;
  slug: string;
  imageUrl?: string;
}

/**
 * Article schema for blog posts to enable rich search results.
 * 
 * @param title - Article title
 * @param description - Article description/excerpt
 * @param publishedDate - ISO 8601 date string
 * @param slug - Article URL slug
 * @param imageUrl - Optional article image URL
 */
export const ArticleSchema = ({
  title,
  description,
  publishedDate,
  slug,
  imageUrl = "/og-image.png"
}: ArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "author": {
      "@type": "Organization",
      "name": "Wabi Sabi Services",
      "url": "https://wabisabiservices.ca"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wabi Sabi Services",
      "url": "https://wabisabiservices.ca",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wabisabiservices.ca/og-image.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://wabisabiservices.ca/blog/${slug}`
    },
    "image": imageUrl.startsWith("http") ? imageUrl : `https://wabisabiservices.ca${imageUrl}`
  };

  return <JsonLd data={schema} />;
};

