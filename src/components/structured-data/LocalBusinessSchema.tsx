import { JsonLd } from "./JsonLd";

/**
 * LocalBusiness schema for Wabi Sabi Services.
 * Helps with local SEO and "near me" searches in Victoria, BC.
 */
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://wabisabiservices.ca/#organization",
    "name": "Wabi Sabi Services",
    "description": "Quiet luxury, immaculately kept. Mindful cleaning for intentional homes and businesses in Victoria, BC. Museum-level precision, discreet service, sustainable care.",
    "url": "https://wabisabiservices.ca",
    "telephone": "+1-250-XXX-XXXX",
    "email": "hello@wabisabiservices.com",
    "priceRange": "$$-$$$",
    "image": "https://wabisabiservices.ca/og-image.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Victoria",
      "addressRegion": "BC",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.4284",
      "longitude": "-123.3656"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "48.4284",
        "longitude": "-123.3656"
      },
      "geoRadius": "50000"
    },
    "serviceArea": {
      "@type": "City",
      "name": "Victoria",
      "containedIn": {
        "@type": "State",
        "name": "British Columbia"
      }
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "24"
    }
  };

  return <JsonLd data={schema} />;
};

