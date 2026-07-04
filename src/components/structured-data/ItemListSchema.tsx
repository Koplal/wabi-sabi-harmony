import { JsonLd } from "./JsonLd";

interface ItemListEntry {
  name: string;
  url: string;
}

interface ItemListSchemaProps {
  items: ItemListEntry[];
}

/**
 * ItemList schema for the Services hub.
 * Emits sequential 1-based positions with absolute item URLs.
 *
 * @param items - Ordered list entries; each `url` should be an absolute URL.
 */
export const ItemListSchema = ({ items }: ItemListSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "url": item.url
    }))
  };

  return <JsonLd data={schema} />;
};
