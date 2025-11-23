import { JsonLd } from "./JsonLd";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb schema for improved site navigation visibility in search results.
 * 
 * @param items - Array of breadcrumb items with name and URL
 */
export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://wabisabiservices.ca${item.url}`
    }))
  };

  return <JsonLd data={schema} />;
};

