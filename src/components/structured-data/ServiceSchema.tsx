import { JsonLd } from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
  areaServedType?: "City" | "Place";
  geo?: { lat: string; lng: string };
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
 * @param geo - Optional centroid coordinates. When provided (area pages), a
 *   GeoCoordinates node is attached to the areaServed Place so search engines can
 *   place the served neighbourhood precisely.
 */
export const ServiceSchema = ({
  name,
  description,
  serviceType,
  areaServed = "Victoria, BC",
  areaServedType = "City",
  geo
}: ServiceSchemaProps) => {
  const areaServedNode: Record<string, unknown> = {
    "@type": areaServedType,
    "name": areaServed
  };

  if (geo) {
    areaServedNode.geo = {
      "@type": "GeoCoordinates",
      "latitude": geo.lat,
      "longitude": geo.lng
    };
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "serviceType": serviceType,
    // Bare reference to the #organization node; full identity is declared once in
    // the Layout-level LocalBusinessSchema (co-typed Organization + LocalBusiness).
    "provider": {
      "@id": "https://wabisabiservices.ca/#organization"
    },
    "areaServed": areaServedNode,
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://wabisabiservices.ca/book",
      "servicePhone": "+1-250-896-5971"
    }
  };

  return <JsonLd data={schema} />;
};
