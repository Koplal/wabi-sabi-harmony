import { absoluteUrl } from "./absoluteUrl";
import { JsonLd } from "./JsonLd";

interface ProductOffer {
  price?: string;
  priceCurrency?: string;
  availability?: string;
  url?: string;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  offers?: ProductOffer;
}

/**
 * Product schema for seasonal package pages.
 *
 * When an offer with a price is supplied, an Offer node is emitted with
 * priceCurrency defaulting to "CAD". When no price is given but other offer
 * fields exist, an Offer with only availability/url is emitted.
 *
 * @param name - Package name
 * @param description - Package description
 * @param image - The package's own photo, as an imported asset or a full URL. Google's
 *   product rich result needs one, so it is required, and it is written as a full URL
 * @param offers - Optional offer details (price, priceCurrency, availability, url)
 */
export const ProductSchema = ({
  name,
  description,
  image,
  offers,
}: ProductSchemaProps) => {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": absoluteUrl(image),
    "brand": {
      "@id": "https://wabisabiservices.ca/#organization"
    }
  };

  if (offers) {
    const offer: Record<string, any> = {
      "@type": "Offer"
    };

    if (offers.price) {
      offer.price = offers.price;
      offer.priceCurrency = offers.priceCurrency || "CAD";
    }
    if (offers.availability) {
      offer.availability = offers.availability;
    }
    if (offers.url) {
      offer.url = offers.url;
    }

    schema.offers = offer;
  }

  return <JsonLd data={schema} />;
};
