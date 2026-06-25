import { JsonLd } from "./JsonLd";

interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}

/**
 * BlogPosting schema for blog articles.
 *
 * Author and publisher both reference the site-wide #organization node declared
 * once in the Layout-level OrganizationSchema/LocalBusinessSchema.
 *
 * @param headline - Article title
 * @param description - Article summary
 * @param datePublished - ISO 8601 publish date
 * @param dateModified - ISO 8601 last-modified date (defaults to datePublished)
 * @param url - Absolute canonical URL of the article (also used as mainEntityOfPage)
 * @param image - Absolute URL of a representative image
 */
export const ArticleSchema = ({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
}: ArticleSchemaProps) => {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": headline,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "url": url,
    "mainEntityOfPage": url,
    "author": {
      "@id": "https://wabisabiservices.ca/#organization"
    },
    "publisher": {
      "@id": "https://wabisabiservices.ca/#organization"
    }
  };

  if (image) {
    schema.image = image;
  }

  return <JsonLd data={schema} />;
};
