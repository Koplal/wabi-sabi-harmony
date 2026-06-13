import { JsonLd } from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
  areaServedType?: "City" | "Place";
}

/**
 * Service schema for individual service and area pages.
 *
 * @param name - Service name
 * @param description - Service description
 * @param serviceType - Type of service offered
 * @param areaServed - Geographic area where service is available
 * @param areaServedType - schema.org type for areaServed: "City" (default, used by
 *   /services/* pages) or "Place" (used by neighborhood/area pages). Backward
 *   compatible: omitting it produces a "City" areaServed identical to prior output.
 */
export const ServiceSchema = ({
  name,
  description,
  serviceType,
  areaServed = "Victoria, BC",
  areaServedType = "City"
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "serviceType": serviceType,
    // Bare reference to the #organization node; full identity is declared once in
    // the Layout-level OrganizationSchema/LocalBusinessSchema.
    "provider": {
      "@id": "https://wabisabiservices.ca/#organization"
    },
    "areaServed": {
      "@type": areaServedType,
      "name": areaServed
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://wabisabiservices.ca/book",
      "servicePhone": "+1-250-896-5971"
    }
  };

  return <JsonLd data={schema} />;
};
