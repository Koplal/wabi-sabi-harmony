import { absoluteUrl } from "./absoluteUrl";
import { JsonLd } from "./JsonLd";

interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image: string;
}

/** A date with a time and a timezone, as Google's article rich result asks for. */
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

function dateTime(value: string): string {
  if (!DATE_TIME.test(value)) throw new Error(`BlogPosting date ${value} needs a time and a timezone, such as 2026-07-01T00:00:00-07:00`);
  return value;
}

/**
 * BlogPosting schema for blog articles.
 *
 * Author and publisher both reference the site-wide #organization node declared
 * once in the Layout-level LocalBusinessSchema (a co-typed Organization + LocalBusiness node).
 *
 * @param headline - Article title
 * @param description - Article summary
 * @param datePublished - ISO 8601 publish time with its Pacific offset, such as 2026-07-01T00:00:00-07:00
 * @param dateModified - ISO 8601 last-modified time in the same form (defaults to datePublished)
 * @param url - Absolute canonical URL of the article (also used as mainEntityOfPage)
 * @param image - The post's own photo, as an imported asset or a full URL, written as a full URL
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
    "image": absoluteUrl(image),
    "datePublished": dateTime(datePublished),
    "dateModified": dateTime(dateModified || datePublished),
    "url": url,
    "mainEntityOfPage": url,
    "author": {
      "@id": "https://wabisabiservices.ca/#organization"
    },
    "publisher": {
      "@id": "https://wabisabiservices.ca/#organization"
    }
  };

  return <JsonLd data={schema} />;
};
