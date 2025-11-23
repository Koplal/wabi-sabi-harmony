import { JsonLd } from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
}

/**
 * Service schema for individual service pages.
 * 
 * @param name - Service name
 * @param description - Service description
 * @param serviceType - Type of service offered
 * @param areaServed - Geographic area where service is available
 */
export const ServiceSchema = ({
  name,
  description,
  serviceType,
  areaServed = "Victoria, BC"
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "serviceType": serviceType,
    "provider": {
      "@type": "LocalBusiness",
      "@id": "https://wabisabiservices.ca/#organization",
      "name": "Wabi Sabi Services",
      "url": "https://wabisabiservices.ca"
    },
    "areaServed": {
      "@type": "City",
      "name": areaServed
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://wabisabiservices.ca/book",
      "servicePhone": "+1-250-XXX-XXXX"
    }
  };

  return <JsonLd data={schema} />;
};

